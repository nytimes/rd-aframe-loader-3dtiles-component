import { Loader3DTiles, PointCloudColoring, GeoTransform } from 'three-loader-3dtiles';
import './textarea';
import { Vector3 } from 'three';

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

const POINT_CLOUD_COLORING = {
  white: PointCloudColoring.White,
  intensity: PointCloudColoring.Intensity,
  classification: PointCloudColoring.Classification,
  elevation: PointCloudColoring.Elevation,
  rgb: PointCloudColoring.RGB
};
/**
 * 3D Tiles component for A-Frame.
 */

AFRAME.registerComponent('loader-3dtiles', {
  schema: {
    url: { type: 'string' },
    cameraEl: { type: 'selector' },
    maximumSSE: { type: 'int', default: 16 },
    maximumMem: { type: 'int', default: 32 },
    distanceScale: { type: 'number', default: 1.0 },
    pointcloudColoring: { type: 'string', default: 'white' },
    pointcloudElevationRange: { type: 'array', default: ['0', '400'] },
    wireframe: { type: 'boolean', default: false },
    showStats: { type: 'boolean', default: false },
    cesiumIONToken: { type: 'string' },
    googleApiKey: { type: 'string' },
    lat: { type: 'number' },
    long: { type: 'number' },
    height: { type: 'number' },
    geoTransform: { type: 'string', default: 'Reset' },
    subtractBox: {type: 'selector'}
  },
  init: async function () {
    this.camera = this.data.cameraEl?.object3D.children[0] ?? document.querySelector('a-scene').camera;
    if (!this.camera) {
      throw new Error('3D Tiles: Please add an active camera or specify the target camera via the cameraEl property');
    }
    const { model, runtime } = await this._initTileset();

    this.el.setObject3D('tileset', model);

    this.originalCamera = this.camera;

    this.el.sceneEl.addEventListener('camera-set-active', (e) => {
      // TODO: For some reason after closing the inspector this event is fired with an empty camera,
      // so revert to the original camera used.
      //
      // TODO: Does not provide the right Inspector perspective camera
      this.camera = e.detail.cameraEl.object3D.children[0] ?? this.originalCamera;
    });

    this.el.sceneEl.addEventListener('enter-vr', (e) => {
      this.originalCamera = this.camera;
      try {
        this.camera = this.el.sceneEl.renderer.xr.getCamera(this.camera);

        // FOV Code from https://github.com/mrdoob/three.js/issues/21869
        this.el.sceneEl.renderer.xr.getSession().requestAnimationFrame((time, frame) => {
          const ref = this.el.sceneEl.renderer.xr.getReferenceSpace();
          const pose = frame.getViewerPose(ref);
          if (pose) {
            const fovi = pose.views[0].projectionMatrix[5];
            this.camera.fov = Math.atan2(1, fovi) * 2 * 180 / Math.PI;
          }
        });
      } catch (e) {
        console.warn('Could not get VR camera');
      }
    });
    this.el.sceneEl.addEventListener('exit-vr', (e) => {
      this.camera = this.originalCamera;
    });

    if (this.data.showStats) {
      this.stats = this._initStats();
    }
    if (THREE.Cache.enabled) {
      console.warn('3D Tiles loader cannot work with THREE.Cache, disabling.');
      THREE.Cache.enabled = false;
    }
    await this._nextFrame();
    this.runtime = runtime;
    this.runtime.setElevationRange(this.data.pointcloudElevationRange.map(n => Number(n)));

  },
  setSubtractShaders: function () {
    this.fragmentShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    uniform sampler2D map;
    uniform vec3 boxMin;
    uniform vec3 boxMax;

    void main() {
        // Check if the fragment position is inside the bounding box
        if (vPosition.x > boxMin.x && vPosition.y > boxMin.y && vPosition.z > boxMin.z &&
            vPosition.x < boxMax.x && vPosition.y < boxMax.y && vPosition.z < boxMax.z) {
            discard; // Discard the fragment if inside the bounding box
        }

        // Otherwise, keep the fragment color
        gl_FragColor = texture2D(map, vUv);
    }`
    this.vertexShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;

      void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

  },
  update: async function (oldData) {
    if (oldData.url !== this.data.url) {
      if (this.runtime) {
        this.runtime.dispose();
        this.runtime = null;
      }
      const { model, runtime } = await this._initTileset();

      this.el.setObject3D('tileset', model);

      await this._nextFrame();
      this.runtime = runtime;
    } else if (this.runtime) {
      this.runtime.setPointCloudColoring(this._resolvePointcloudColoring(this.data.pointCloudColoring));
      this.runtime.setWireframe(this.data.wireframe);
      this.runtime.setViewDistanceScale(this.data.distanceScale);
      this.runtime.setElevationRange(this.data.pointcloudElevationRange.map(n => Number(n)));
    }

    if (this.data.showStats && !this.stats) {
      this.stats = this._initStats();
    }
    if (!this.data.showStats && this.stats) {
      this.el.sceneEl.removeChild(this.stats);
      this.stats = null;
    }

    // set parameters for google 3dtiles API
    if (this.data.lat && this.data.long && this.data.height) {
      // create shanders for subtract box
      this.setSubtractShaders();

      // eslint-disable-next-line no-unused-vars
      const { model, runtime } = await this._initTileset();

      console.log(this.data.lat, this.data.long, this.data.height);

      this.runtime.orientToGeocoord({
        lat: Number(this.data.lat),
        long: Number(this.data.long),
        height: Number(this.data.height)
      });
    }
  },
  tick: function (t, dt) {
    if (this.runtime) {
      this.runtime.update(dt, this.el.sceneEl.clientHeight, this.camera);
      if (this.stats) {
        const worldPos = new Vector3();
        this.camera.getWorldPosition(worldPos);
        const stats = this.runtime.getStats();
        this.stats.setAttribute(
          'textarea',
          'text',
          Object.values(stats.stats).map(s => `${s.name}: ${s.count}`).join('\n')
        );
        const newPos = new Vector3();
        newPos.copy(worldPos);
        newPos.z -= 2;
        this.stats.setAttribute('position', newPos);
      }
    }
  },
  shaderCallback: function (renderer, material) {
    if (this.data.subtractBox) {
      const threeBox = new THREE.Box3().setFromObject(this.data.subtractBox.object3D);

      const uniforms = {
        boxMin: {value: threeBox.min || new THREE.Vector3()},
        boxMax: {value: threeBox.max || new THREE.Vector3()}
      };    
      const fragmentShader = this.fragmentShader;
      const vertexShader = this.vertexShader;
      material.onBeforeCompile = function(shader) {
          shader.uniforms = THREE.UniformsUtils.merge([shader.uniforms, uniforms]);
          shader.fragmentShader = fragmentShader; 
          shader.vertexShader = vertexShader;
      }
    }
  },
  remove: function () {
    if (this.runtime) {
      this.runtime.dispose();
    }
  },
  _resolvePointcloudColoring () {
    const pointCloudColoring = POINT_CLOUD_COLORING[this.data.pointcloudColoring];
    if (!pointCloudColoring) {
      console.warn('Invalid value for point cloud coloring');
      return PointCloudColoring.White;
    } else {
      return pointCloudColoring;
    }
  },
  _initTileset: async function () {
    this.shaderCallback = this.shaderCallback.bind(this);
    const pointCloudColoring = this._resolvePointcloudColoring(this.data.pointcloudColoring);
    return Loader3DTiles.load({
      url: this.data.url,
      renderer: this.el.sceneEl.renderer,
      options: {
        googleApiKey: this.data.googleApiKey,
        cesiumIONToken: this.data.cesiumIONToken,
        dracoDecoderPath: 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco',
        basisTranscoderPath: 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/basis',
        maximumScreenSpaceError: this.data.maximumSSE,
        maximumMemoryUsage: this.data.maximumMem,
        memoryCacheOverflow: 128,
        pointCloudColoring: pointCloudColoring,
        viewDistanceScale: this.data.distanceScale,
        wireframe: this.data.wireframe,
        updateTransforms: true,
        geoTransform: GeoTransform[this.data.geoTransform],
        shaderCallback: this.shaderCallback,
        shading: 2,
        transparent: true
      }
    });
  },
  _initStats: function () {
    const stats = document.createElement('a-entity');
    this.el.sceneEl.appendChild(stats);
    stats.setAttribute('position', '-0.5 0 -1');
    stats.setAttribute('textarea', {
      cols: 30,
      rows: 15,
      text: '',
      color: 'white',
      disabledBackgroundColor: '#0c1e2c',
      disabled: true
    });
    return stats;
  },
  _nextFrame: async function () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 0);
    });
  }
});
