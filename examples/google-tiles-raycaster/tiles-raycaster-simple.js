/* global AFRAME */

const registerComponent = AFRAME.registerComponent;
const THREE = AFRAME.THREE;
const utils = AFRAME.utils;

/**
 * Raycaster component.
 *
 * Pass options to three.js Raycaster including which objects to test.
 * Poll for intersections.
 * Emit event on origin entity and on target entity on intersect.
 *
 * @member {array} objects - Cached list of meshes to intersect.
 * @member {number} prevCheckTime - Previous time intersection was checked. To help interval.
 * @member {object} raycaster - three.js Raycaster.
 */
AFRAME.registerComponent('tiles-raycaster-simple', {
  schema: {
    direction: { type: 'vec3', default: { x: 0, y: -1, z: 0 } }, // down
    interval: { default: 0 },
    objects: { default: '' },
    origin: { type: 'vec3', default: { x: 0, y: 0, z: 0 } } // raycast from here
  },
  init: function () {
    this.intersections = [];
    this.objects = [];
    this.prevCheckTime = undefined;
    this.rawIntersections = [];
    this.raycaster = new THREE.Raycaster();
    const data = this.data;

    this.raycaster.set(data.origin, data.direction);
  },

  /**
     * Update list of objects to test for intersection.
     */
  refreshObjects: function () {
    // get object3d of 3dtiles entity
    const tilesetChildren = document.querySelector('#tileset').object3D?.children;
    const allMeshs = [];
    console.log(tilesetChildren);

    tilesetChildren?.forEach(d => {
      if (!d.visible) {
        return;
      }
      d.traverse(e => {
        if (e.isMesh) {
          allMeshs.push(e);
        }
      });
    });
    console.log('allMeshs', allMeshs);
    // const intersects = this.raycaster.intersectObjects(allMeshs)
    // if (!intersects.length) {
    //   return null
    // }
    // return intersects[0].point

    // this.objects = this.flattenObject3DMaps(els);
    this.objects = allMeshs;
    console.log(this.objects);
  },

  /**
     * Check for intersections and cleared intersections on an interval.
     */
  tock: function (time) {
    const data = this.data;
    const prevCheckTime = this.prevCheckTime;

    // Only check for intersection if interval time has passed.
    if (prevCheckTime && (time - prevCheckTime < data.interval)) { return; }

    // Update check time.
    this.prevCheckTime = time;
    this.checkIntersections();
  },

  /**
     * Raycast for intersections and emit events for current and cleared intersections.
     */
  checkIntersections: function () {
    const el = this.el;
    const data = this.data;
    let i;
    const intersections = this.intersections;

    // Raycast.
    intersections.length = 0;
    console.log('this.objects', this.objects.length);
    this.raycaster.intersectObjects(this.objects, true, intersections);
    console.log('intersections', intersections);
  }
});

/**
 * Copy contents of one array to another without allocating new array.
 */
function copyArray (a, b) {
  let i;
  a.length = b.length;
  for (i = 0; i < b.length; i++) {
    a[i] = b[i];
  }
}
