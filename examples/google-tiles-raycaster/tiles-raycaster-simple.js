/* global AFRAME */

/**
 * 3d tiles Raycaster component based on A-Frame Raycaster component
 */
AFRAME.registerComponent('tiles-raycaster-simple', {
  schema: {
    direction: { type: 'vec3', default: { x: 0, y: -1, z: 0 } }, // down
    interval: { default: 1000 },
    origin: { type: 'vec3', default: { x: 0, y: 0, z: 0 } }, // raycast from here
    tilesetSelector: { default: '#tileset', type: 'selector' },
    elevationHint: { default: 1000, type: 'number' } // start searching for ground from this height
  },
  init: function () {
    this.intersections = [];
    this.objects = []; // Cached list of meshes to intersect.
    this.prevCheckTime = undefined; // Previous time intersection was checked. To help interval.
    this.rawIntersections = [];
    // init three.js raycaster and set origin and direction
    this.raycaster = new AFRAME.THREE.Raycaster();
    this.raycaster.set(this.data.origin, this.data.direction);
    this.needToAdjustHeight = true;
    this.numTimesTocked = 0;
    this.data.tilesetSelector.setAttribute('loader-3dtiles', { height: this.data.elevationHint });
  },

  /**
             * Update list of objects to test for intersection
             */
  refreshObjects: function () {
    function getVisibleMeshes (object) {
      const visibleMeshes = [];
      if (!object.visible) {
        return visibleMeshes;
      }
      if (object.isMesh) {
        visibleMeshes.push(object);
      }
      object.children.forEach(child => {
        visibleMeshes.push(...getVisibleMeshes(child));
      });
      return visibleMeshes;
    }

    // get children of object3d of 3dtiles entity
    const tilesetChildren = this.data.tilesetSelector.object3D?.children;
    const visibleMeshes = [];

    tilesetChildren?.forEach(object => {
      visibleMeshes.push(...getVisibleMeshes(object));
    });
    console.log('visibleTileMeshes', visibleMeshes.length, 'totalTileMeshes', tilesetChildren[0]?.children.length);

    this.objects = visibleMeshes;
  },

  /**
             * Check for intersections on an interval.
             */
  tock: function (time) {
    const data = this.data;
    const prevCheckTime = this.prevCheckTime;

    // Only check for intersection if interval time has passed.
    if (prevCheckTime && (time - prevCheckTime < data.interval)) { return; }

    // Update check time.
    this.prevCheckTime = time;
    this.refreshObjects();
    // console.log('numTimesTocked', this.numTimesTocked, this.needToAdjustHeight);
    // HACK Wait until the loaded tileset has settled down. Better would be to monitor
    // the tileset loading state or watch until it settles down with a nonzero number of
    // intersections found in adjustTilesetHeight.
    if (this.numTimesTocked > 14 && this.needToAdjustHeight) {
      this.adjustTilesetHeight();
    }
    this.numTimesTocked++;
  },

  adjustTilesetHeight: function () {
    const intersections = this.intersections;

    // Raycast straight down from above to find the ground.
    intersections.length = 0;
    this.raycaster.intersectObjects(this.objects, true, intersections);
    // we hope that the first intersection is the ground
    if (intersections.length > 0) {
      console.log('calculated height: ', this.data.elevationHint - intersections[0]?.distance);
      this.data.tilesetSelector.setAttribute('loader-3dtiles', { height: this.data.elevationHint - intersections[0]?.distance });
      console.log('intersections', intersections.length);
      console.log('intersection[0].distance', intersections[0]?.distance);
      this.needToAdjustHeight = false;
      document.querySelector('#cameraRig').setAttribute('rotation', '0 0 0');
    }
  }
});
