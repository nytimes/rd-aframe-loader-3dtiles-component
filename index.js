import { Loader3DTiles, PointCloudColoring } from 'three-loader-3dtiles';
import './textarea';
import { Vector2, Vector3 } from 'three';

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
    copyrightEl: { type: 'selector' }
  },
  init: async function () {
    const sceneEl = this.el.sceneEl;
    const data = this.data;

    this.camera = data.cameraEl?.object3D.children[0] ?? document.querySelector('a-scene').camera;
    if (!this.camera) {
      throw new Error('3D Tiles: Please add an active camera or specify the target camera via the cameraEl property');
    }

    const { model, runtime } = await this._initTileset();

    this.el.setObject3D('tileset', model);

    this.originalCamera = this.camera;

    sceneEl.addEventListener('camera-set-active', (e) => {
      // TODO: For some reason after closing the inspector this event is fired with an empty camera,
      // so revert to the original camera used.
      //
      // TODO: Does not provide the right Inspector perspective camera
      this.camera = e.detail.cameraEl.object3D.children[0] ?? this.originalCamera;
    });

    this.el.addEventListener('cameraChange', (e) => {
      if (e.detail.type === 'PerspectiveCamera') {
        this.camera = e.detail;
      }
    });

    sceneEl.addEventListener('enter-vr', (e) => {
      this.originalCamera = this.camera;
      try {
        this.camera = sceneEl.renderer.xr.getCamera(this.camera);

        // FOV Code from https://github.com/mrdoob/three.js/issues/21869
        sceneEl.renderer.xr.getSession().requestAnimationFrame((time, frame) => {
          const ref = sceneEl.renderer.xr.getReferenceSpace();
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
    sceneEl.addEventListener('exit-vr', (e) => {
      this.camera = this.originalCamera;
    });

    if (data.showStats) {
      this.stats = this._initStats();
    }
    if (THREE.Cache.enabled) {
      console.warn('3D Tiles loader cannot work with THREE.Cache, disabling.');
      THREE.Cache.enabled = false;
    }
    await this._nextFrame();
    this.runtime = runtime;
    this.runtime.setElevationRange(data.pointcloudElevationRange.map(n => Number(n)));

    this.viewportSize = new Vector2(sceneEl.clientWidth, sceneEl.clientHeight);
    window.addEventListener('resize', this.onWindowResize.bind(this));

  },
  onWindowResize: function () {
    const sceneEl = this.el.sceneEl;
    this.viewportSize.set(sceneEl.clientWidth, sceneEl.clientHeight);
    this.camera.aspect = sceneEl.clientWidth / sceneEl.clientHeight;
    this.camera.updateProjectionMatrix();
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
      window.runtime = runtime;
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
      this.runtime.update(dt, this.viewportSize, this.camera);
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
      if (this.data.copyrightEl) {
        this.data.copyrightEl.innerHTML = this.runtime.getDataAttributions() ?? '';
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
        updateTransforms: true
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
