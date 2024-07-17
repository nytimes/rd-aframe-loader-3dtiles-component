import { CanvasTexture as Kc, LinearFilter as zc, RepeatWrapping as kr, Frustum as Wc, Matrix4 as tt, Group as En, PlaneGeometry as Xc, Vector3 as rt, MeshBasicMaterial as Hs, DoubleSide as jo, Mesh as Js, ArrowHelper as Qc, Color as w, BoxGeometry as qc, EdgesGeometry as Yc, LineSegments as $c, LineBasicMaterial as Zc, Vector2 as ko, ShaderMaterial as lr, NormalBlending as hr, WebGLRenderTarget as tu, NearestFilter as Kr, RGBAFormat as eu, FloatType as nu, Scene as su, WebGLRenderer as ru, Euler as rs, BufferGeometry as Ko, Float32BufferAttribute as Sn, BufferAttribute as zo, PerspectiveCamera as Wo, OrthographicCamera as iu, Quaternion as ou, Uint8BufferAttribute as zr, Points as au } from 'three';
import { GLTFLoader as cu } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader as uu } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader as lu } from 'three/examples/jsm/loaders/KTX2Loader.js';
const jc = Object.defineProperty;
const kc = (e, t, n) => t in e ? jc(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
const p = (e, t, n) => (kc(e, typeof t !== 'symbol' ? t + '' : t, n), n);
async function Ke (e, t, n, s) {
  return s._parse(e, t, n, s);
}
function z (e, t) {
  if (!e) { throw new Error(t || 'loader assertion failed.'); }
}
const kn = !!(typeof process !== 'object' || String(process) !== '[object process]' || process.browser); const Wr = typeof process < 'u' && process.version && /v([0-9]*)/.exec(process.version);
Wr && parseFloat(Wr[1]);
function hu (e, t) {
  return Xo(e || {}, t);
}
function Xo (e, t) {
  const n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
  if (n > 3) { return t; }
  const s = {
    ...e
  };
  for (const [r, i] of Object.entries(t)) { i && typeof i === 'object' && !Array.isArray(i) ? s[r] = Xo(s[r] || {}, t[r], n + 1) : s[r] = t[r]; }
  return s;
}
const fu = 'latest';
function du () {
  let e;
  return (e = globalThis._loadersgl_) !== null && e !== void 0 && e.version || (globalThis._loadersgl_ = globalThis._loadersgl_ || {}, globalThis._loadersgl_.version = '4.1.1'), globalThis._loadersgl_.version;
}
const Qo = du();
function Jt (e, t) {
  if (!e) { throw new Error(t || 'loaders.gl assertion failed.'); }
}
const bt = typeof process !== 'object' || String(process) !== '[object process]' || process.browser; const fr = typeof importScripts === 'function'; const mu = typeof window < 'u' && typeof window.orientation < 'u'; const Xr = typeof process < 'u' && process.version && /v([0-9]*)/.exec(process.version);
Xr && parseFloat(Xr[1]);
class gu {
  constructor (t, n) {
    this.name = void 0, this.workerThread = void 0, this.isRunning = !0, this.result = void 0, this._resolve = () => {
    }, this._reject = () => {
    }, this.name = t, this.workerThread = n, this.result = new Promise((s, r) => {
      this._resolve = s, this._reject = r;
    });
  }

  postMessage (t, n) {
    this.workerThread.postMessage({
      source: 'loaders.gl',
      type: t,
      payload: n
    });
  }

  done (t) {
    Jt(this.isRunning), this.isRunning = !1, this._resolve(t);
  }

  error (t) {
    Jt(this.isRunning), this.isRunning = !1, this._reject(t);
  }
}
class is {
  terminate () {
  }
}
const os = /* @__PURE__ */ new Map();
function Au (e) {
  Jt(e.source && !e.url || !e.source && e.url);
  let t = os.get(e.source || e.url);
  return t || (e.url && (t = pu(e.url), os.set(e.url, t)), e.source && (t = qo(e.source), os.set(e.source, t))), Jt(t), t;
}
function pu (e) {
  if (!e.startsWith('http')) { return e; }
  const t = yu(e);
  return qo(t);
}
function qo (e) {
  const t = new Blob([e], {
    type: 'application/javascript'
  });
  return URL.createObjectURL(t);
}
function yu (e) {
  return `try {
  importScripts('${e}');
} catch (error) {
  console.error(error);
  throw error;
}`;
}
function Yo (e) {
  const t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0; const n = arguments.length > 2 ? arguments[2] : void 0;
  const s = n || /* @__PURE__ */ new Set();
  if (e) {
    if (Qr(e)) { s.add(e); } else if (Qr(e.buffer)) { s.add(e.buffer); } else if (!ArrayBuffer.isView(e)) {
      if (t && typeof e === 'object') {
        for (const r in e) { Yo(e[r], t, s); }
      }
    }
  }
  return n === void 0 ? Array.from(s) : [];
}
function Qr (e) {
  return e ? e instanceof ArrayBuffer || typeof MessagePort < 'u' && e instanceof MessagePort || typeof ImageBitmap < 'u' && e instanceof ImageBitmap || typeof OffscreenCanvas < 'u' && e instanceof OffscreenCanvas : !1;
}
const as = () => {
};
class Vs {
  static isSupported () {
    return typeof Worker < 'u' && bt || typeof is < 'u' && !bt;
  }

  constructor (t) {
    this.name = void 0, this.source = void 0, this.url = void 0, this.terminated = !1, this.worker = void 0, this.onMessage = void 0, this.onError = void 0, this._loadableURL = '';
    const {
      name: n,
      source: s,
      url: r
    } = t;
    Jt(s || r), this.name = n, this.source = s, this.url = r, this.onMessage = as, this.onError = (i) => console.log(i), this.worker = bt ? this._createBrowserWorker() : this._createNodeWorker();
  }

  destroy () {
    this.onMessage = as, this.onError = as, this.worker.terminate(), this.terminated = !0;
  }

  get isRunning () {
    return !!this.onMessage;
  }

  postMessage (t, n) {
    n = n || Yo(t), this.worker.postMessage(t, n);
  }

  _getErrorFromErrorEvent (t) {
    let n = 'Failed to load ';
    return n += `worker ${this.name} from ${this.url}. `, t.message && (n += `${t.message} in `), t.lineno && (n += `:${t.lineno}:${t.colno}`), new Error(n);
  }

  _createBrowserWorker () {
    this._loadableURL = Au({
      source: this.source,
      url: this.url
    });
    const t = new Worker(this._loadableURL, {
      name: this.name
    });
    return t.onmessage = (n) => {
      n.data ? this.onMessage(n.data) : this.onError(new Error('No data received'));
    }, t.onerror = (n) => {
      this.onError(this._getErrorFromErrorEvent(n)), this.terminated = !0;
    }, t.onmessageerror = (n) => console.error(n), t;
  }

  _createNodeWorker () {
    let t;
    if (this.url) {
      const s = this.url.includes(':/') || this.url.startsWith('/') ? this.url : `./${this.url}`;
      t = new is(s, {
        eval: !1
      });
    } else if (this.source) {
      t = new is(this.source, {
        eval: !0
      });
    } else { throw new Error('no worker'); }
    return t.on('message', (n) => {
      this.onMessage(n);
    }), t.on('error', (n) => {
      this.onError(n);
    }), t.on('exit', (n) => {
    }), t;
  }
}
class Bu {
  static isSupported () {
    return Vs.isSupported();
  }

  constructor (t) {
    this.name = 'unnamed', this.source = void 0, this.url = void 0, this.maxConcurrency = 1, this.maxMobileConcurrency = 1, this.onDebug = () => {
    }, this.reuseWorkers = !0, this.props = {}, this.jobQueue = [], this.idleQueue = [], this.count = 0, this.isDestroyed = !1, this.source = t.source, this.url = t.url, this.setProps(t);
  }

  destroy () {
    this.idleQueue.forEach((t) => t.destroy()), this.isDestroyed = !0;
  }

  setProps (t) {
    this.props = {
      ...this.props,
      ...t
    }, t.name !== void 0 && (this.name = t.name), t.maxConcurrency !== void 0 && (this.maxConcurrency = t.maxConcurrency), t.maxMobileConcurrency !== void 0 && (this.maxMobileConcurrency = t.maxMobileConcurrency), t.reuseWorkers !== void 0 && (this.reuseWorkers = t.reuseWorkers), t.onDebug !== void 0 && (this.onDebug = t.onDebug);
  }

  async startJob (t) {
    const n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : (i, o, a) => i.done(a); const s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : (i, o) => i.error(o);
    const r = new Promise((i) => (this.jobQueue.push({
      name: t,
      onMessage: n,
      onError: s,
      onStart: i
    }), this));
    return this._startQueuedJob(), await r;
  }

  async _startQueuedJob () {
    if (!this.jobQueue.length) { return; }
    const t = this._getAvailableWorker();
    if (!t) { return; }
    const n = this.jobQueue.shift();
    if (n) {
      this.onDebug({
        message: 'Starting job',
        name: n.name,
        workerThread: t,
        backlog: this.jobQueue.length
      });
      const s = new gu(n.name, t);
      t.onMessage = (r) => n.onMessage(s, r.type, r.payload), t.onError = (r) => n.onError(s, r), n.onStart(s);
      try {
        await s.result;
      } catch (r) {
        console.error(`Worker exception: ${r}`);
      } finally {
        this.returnWorkerToQueue(t);
      }
    }
  }

  returnWorkerToQueue (t) {
    !bt || this.isDestroyed || !this.reuseWorkers || this.count > this._getMaxConcurrency() ? (t.destroy(), this.count--) : this.idleQueue.push(t), this.isDestroyed || this._startQueuedJob();
  }

  _getAvailableWorker () {
    if (this.idleQueue.length > 0) { return this.idleQueue.shift() || null; }
    if (this.count < this._getMaxConcurrency()) {
      this.count++;
      const t = `${this.name.toLowerCase()} (#${this.count} of ${this.maxConcurrency})`;
      return new Vs({
        name: t,
        source: this.source,
        url: this.url
      });
    }
    return null;
  }

  _getMaxConcurrency () {
    return mu ? this.maxMobileConcurrency : this.maxConcurrency;
  }
}
const Cu = {
  maxConcurrency: 3,
  maxMobileConcurrency: 1,
  reuseWorkers: !0,
  onDebug: () => {
  }
};
class Nt {
  static isSupported () {
    return Vs.isSupported();
  }

  static getWorkerFarm () {
    const t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return Nt._workerFarm = Nt._workerFarm || new Nt({}), Nt._workerFarm.setProps(t), Nt._workerFarm;
  }

  constructor (t) {
    this.props = void 0, this.workerPools = /* @__PURE__ */ new Map(), this.props = {
      ...Cu
    }, this.setProps(t), this.workerPools = /* @__PURE__ */ new Map();
  }

  destroy () {
    for (const t of this.workerPools.values()) { t.destroy(); }
    this.workerPools = /* @__PURE__ */ new Map();
  }

  setProps (t) {
    this.props = {
      ...this.props,
      ...t
    };
    for (const n of this.workerPools.values()) { n.setProps(this._getWorkerPoolProps()); }
  }

  getWorkerPool (t) {
    const {
      name: n,
      source: s,
      url: r
    } = t;
    let i = this.workerPools.get(n);
    return i || (i = new Bu({
      name: n,
      source: s,
      url: r
    }), i.setProps(this._getWorkerPoolProps()), this.workerPools.set(n, i)), i;
  }

  _getWorkerPoolProps () {
    return {
      maxConcurrency: this.props.maxConcurrency,
      maxMobileConcurrency: this.props.maxMobileConcurrency,
      reuseWorkers: this.props.reuseWorkers,
      onDebug: this.props.onDebug
    };
  }
}
Nt._workerFarm = void 0;
function Eu (e) {
  const t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const n = t[e.id] || {}; const s = bt ? `${e.id}-worker.js` : `${e.id}-worker-node.js`;
  let r = n.workerUrl;
  if (!r && e.id === 'compression' && (r = t.workerUrl), t._workerType === 'test' && (bt ? r = `modules/${e.module}/dist/${s}` : r = `modules/${e.module}/src/workers/${e.id}-worker-node.ts`), !r) {
    let i = e.version;
    i === 'latest' && (i = fu);
    const o = i ? `@${i}` : '';
    r = `https://unpkg.com/@loaders.gl/${e.module}${o}/dist/${s}`;
  }
  return Jt(r), r;
}
function Tu (e) {
  const t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Qo;
  Jt(e, 'no worker provided');
  const n = e.version;
  return !(!t || !n);
}
const bu = {}; const _u = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: bu
}, Symbol.toStringTag, { value: 'Module' })); const cs = {};
async function Zt (e) {
  const t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null; const n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}; const s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
  return t && (e = wu(e, t, n, s)), cs[e] = cs[e] || Ru(e), await cs[e];
}
function wu (e, t) {
  const n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}; let s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
  if (!n.useLocalLibraries && e.startsWith('http')) { return e; }
  s = s || e;
  const r = n.modules || {};
  return r[s] ? r[s] : bt ? n.CDN ? (Jt(n.CDN.startsWith('http')), `${n.CDN}/${t}@${Qo}/dist/libs/${s}`) : fr ? `../src/libs/${s}` : `modules/${t}/src/libs/${s}` : `modules/${t}/dist/libs/${s}`;
}
async function Ru (e) {
  if (e.endsWith('wasm')) { return await Su(e); }
  if (!bt) {
    try {
      return _u && void 0;
    } catch (n) {
      return console.error(n), null;
    }
  }
  if (fr) { return importScripts(e); }
  const t = await Iu(e);
  return Mu(t, e);
}
function Mu (e, t) {
  if (!bt) { return; }
  if (fr) { return eval.call(globalThis, e), null; }
  const n = document.createElement('script');
  n.id = t;
  try {
    n.appendChild(document.createTextNode(e));
  } catch {
    n.text = e;
  }
  return document.body.appendChild(n), null;
}
async function Su (e) {
  return await (await fetch(e)).arrayBuffer();
}
async function Iu (e) {
  return await (await fetch(e)).text();
}
function xu (e, t) {
  return !Nt.isSupported() || !bt && !(t != null && t._nodeWorkers) ? !1 : e.worker && (t == null ? void 0 : t.worker);
}
async function vu (e, t, n, s, r) {
  const i = e.id; const o = Eu(e, n); const c = Nt.getWorkerFarm(n).getWorkerPool({
    name: i,
    url: o
  });
  n = JSON.parse(JSON.stringify(n)), s = JSON.parse(JSON.stringify(s || {}));
  const u = await c.startJob('process-on-worker', Ou.bind(null, r));
  return u.postMessage('process', {
    input: t,
    options: n,
    context: s
  }), await (await u.result).result;
}
async function Ou (e, t, n, s) {
  switch (n) {
    case 'done':
      t.done(s);
      break;
    case 'error':
      t.error(new Error(s.error));
      break;
    case 'process':
      const {
        id: r,
        input: i,
        options: o
      } = s;
      try {
        const a = await e(i, o);
        t.postMessage('done', {
          id: r,
          result: a
        });
      } catch (a) {
        const c = a instanceof Error ? a.message : 'unknown error';
        t.postMessage('error', {
          id: r,
          error: c
        });
      }
      break;
    default:
      console.warn(`parse-with-worker unknown message ${n}`);
  }
}
function Fu (e) {
  const t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 5;
  return typeof e === 'string' ? e.slice(0, t) : ArrayBuffer.isView(e) ? qr(e.buffer, e.byteOffset, t) : e instanceof ArrayBuffer ? qr(e, 0, t) : '';
}
function qr (e, t, n) {
  if (e.byteLength <= t + n) { return ''; }
  const s = new DataView(e);
  let r = '';
  for (let i = 0; i < n; i++) { r += String.fromCharCode(s.getUint8(t + i)); }
  return r;
}
function Du (e) {
  try {
    return JSON.parse(e);
  } catch {
    throw new Error(`Failed to parse JSON from data starting with "${Fu(e)}"`);
  }
}
function Lu (e, t, n) {
  if (n = n || e.byteLength, e.byteLength < n || t.byteLength < n) { return !1; }
  const s = new Uint8Array(e); const r = new Uint8Array(t);
  for (let i = 0; i < s.length; ++i) {
    if (s[i] !== r[i]) { return !1; }
  }
  return !0;
}
function Pu () {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) { t[n] = arguments[n]; }
  return Gu(t);
}
function Gu (e) {
  const t = e.map((i) => i instanceof ArrayBuffer ? new Uint8Array(i) : i); const n = t.reduce((i, o) => i + o.byteLength, 0); const s = new Uint8Array(n);
  let r = 0;
  for (const i of t) { s.set(i, r), r += i.byteLength; }
  return s.buffer;
}
function dr (e, t, n) {
  const s = n !== void 0 ? new Uint8Array(e).subarray(t, t + n) : new Uint8Array(e).subarray(t);
  return new Uint8Array(s).buffer;
}
function ze (e, t) {
  return z(e >= 0), z(t > 0), e + (t - 1) & ~(t - 1);
}
function Nu (e, t, n) {
  let s;
  if (e instanceof ArrayBuffer) { s = new Uint8Array(e); } else {
    const r = e.byteOffset; const i = e.byteLength;
    s = new Uint8Array(e.buffer || e.arrayBuffer, r, i);
  }
  return t.set(s, n), n + ze(s.byteLength, 4);
}
async function Uu (e) {
  const t = [];
  for await (const n of e) { t.push(n); }
  return Pu(...t);
}
function Yr () {
  let e;
  if (typeof window < 'u' && window.performance) { e = window.performance.now(); } else if (typeof process < 'u' && process.hrtime) {
    const t = process.hrtime();
    e = t[0] * 1e3 + t[1] / 1e6;
  } else { e = Date.now(); }
  return e;
}
class $r {
  constructor (t, n) {
    this.name = void 0, this.type = void 0, this.sampleSize = 1, this.time = 0, this.count = 0, this.samples = 0, this.lastTiming = 0, this.lastSampleTime = 0, this.lastSampleCount = 0, this._count = 0, this._time = 0, this._samples = 0, this._startTime = 0, this._timerPending = !1, this.name = t, this.type = n, this.reset();
  }

  reset () {
    return this.time = 0, this.count = 0, this.samples = 0, this.lastTiming = 0, this.lastSampleTime = 0, this.lastSampleCount = 0, this._count = 0, this._time = 0, this._samples = 0, this._startTime = 0, this._timerPending = !1, this;
  }

  setSampleSize (t) {
    return this.sampleSize = t, this;
  }

  incrementCount () {
    return this.addCount(1), this;
  }

  decrementCount () {
    return this.subtractCount(1), this;
  }

  addCount (t) {
    return this._count += t, this._samples++, this._checkSampling(), this;
  }

  subtractCount (t) {
    return this._count -= t, this._samples++, this._checkSampling(), this;
  }

  addTime (t) {
    return this._time += t, this.lastTiming = t, this._samples++, this._checkSampling(), this;
  }

  timeStart () {
    return this._startTime = Yr(), this._timerPending = !0, this;
  }

  timeEnd () {
    return this._timerPending ? (this.addTime(Yr() - this._startTime), this._timerPending = !1, this._checkSampling(), this) : this;
  }

  getSampleAverageCount () {
    return this.sampleSize > 0 ? this.lastSampleCount / this.sampleSize : 0;
  }

  getSampleAverageTime () {
    return this.sampleSize > 0 ? this.lastSampleTime / this.sampleSize : 0;
  }

  getSampleHz () {
    return this.lastSampleTime > 0 ? this.sampleSize / (this.lastSampleTime / 1e3) : 0;
  }

  getAverageCount () {
    return this.samples > 0 ? this.count / this.samples : 0;
  }

  getAverageTime () {
    return this.samples > 0 ? this.time / this.samples : 0;
  }

  getHz () {
    return this.time > 0 ? this.samples / (this.time / 1e3) : 0;
  }

  _checkSampling () {
    this._samples === this.sampleSize && (this.lastSampleTime = this._time, this.lastSampleCount = this._count, this.count += this._count, this.time += this._time, this.samples += this._samples, this._time = 0, this._count = 0, this._samples = 0);
  }
}
class $o {
  constructor (t) {
    this.id = void 0, this.stats = {}, this.id = t.id, this.stats = {}, this._initializeStats(t.stats), Object.seal(this);
  }

  get (t) {
    const n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'count';
    return this._getOrCreate({
      name: t,
      type: n
    });
  }

  get size () {
    return Object.keys(this.stats).length;
  }

  reset () {
    for (const t of Object.values(this.stats)) { t.reset(); }
    return this;
  }

  forEach (t) {
    for (const n of Object.values(this.stats)) { t(n); }
  }

  getTable () {
    const t = {};
    return this.forEach((n) => {
      t[n.name] = {
        time: n.time || 0,
        count: n.count || 0,
        average: n.getAverageTime() || 0,
        hz: n.getHz() || 0
      };
    }), t;
  }

  _initializeStats () {
    (arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : []).forEach((n) => this._getOrCreate(n));
  }

  _getOrCreate (t) {
    const {
      name: n,
      type: s
    } = t;
    let r = this.stats[n];
    return r || (t instanceof $r ? r = t : r = new $r(n, s), this.stats[n] = r), r;
  }
}
const Hu = '';
const Zr = {};
function Ju (e) {
  for (const t in Zr) {
    if (e.startsWith(t)) {
      const n = Zr[t];
      e = e.replace(t, n);
    }
  }
  return !e.startsWith('http://') && !e.startsWith('https://') && (e = `${Hu}${e}`), e;
}
function Vu (e) {
  return e && typeof e === 'object' && e.isBuffer;
}
function Zo (e) {
  if (Vu(e)) { return e; }
  if (e instanceof ArrayBuffer) { return e; }
  if (ArrayBuffer.isView(e)) { return e.byteOffset === 0 && e.byteLength === e.buffer.byteLength ? e.buffer : e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength); }
  if (typeof e === 'string') {
    const t = e;
    return new TextEncoder().encode(t).buffer;
  }
  if (e && typeof e === 'object' && e._toArrayBuffer) { return e._toArrayBuffer(); }
  throw new Error('toArrayBuffer');
}
function ju () {
  let e;
  if (typeof process < 'u' && typeof process.cwd < 'u') { return process.cwd(); }
  const t = (e = window.location) === null || e === void 0 ? void 0 : e.pathname;
  return (t == null ? void 0 : t.slice(0, t.lastIndexOf('/') + 1)) || '';
}
function ta (e) {
  const t = e ? e.lastIndexOf('/') : -1;
  return t >= 0 ? e.substr(t + 1) : '';
}
function ea (e) {
  const t = e ? e.lastIndexOf('/') : -1;
  return t >= 0 ? e.substr(0, t) : '';
}
function ku () {
  const e = [];
  for (let r = 0; r < arguments.length; r++) { e[r] = r < 0 || arguments.length <= r ? void 0 : arguments[r]; }
  let t = ''; let n = !1; let s;
  for (let r = e.length - 1; r >= -1 && !n; r--) {
    let i;
    r >= 0 ? i = e[r] : (s === void 0 && (s = ju()), i = s), i.length !== 0 && (t = `${i}/${t}`, n = i.charCodeAt(0) === Ie);
  }
  return t = Ku(t, !n), n ? `/${t}` : t.length > 0 ? t : '.';
}
const Ie = 47; const us = 46;
function Ku (e, t) {
  let n = ''; let s = -1; let r = 0; let i; let o = !1;
  for (let a = 0; a <= e.length; ++a) {
    if (a < e.length) { i = e.charCodeAt(a); } else {
      if (i === Ie) { break; }
      i = Ie;
    }
    if (i === Ie) {
      if (!(s === a - 1 || r === 1)) {
        if (s !== a - 1 && r === 2) {
          if (n.length < 2 || !o || n.charCodeAt(n.length - 1) !== us || n.charCodeAt(n.length - 2) !== us) {
            if (n.length > 2) {
              const c = n.length - 1;
              let u = c;
              for (; u >= 0 && n.charCodeAt(u) !== Ie; --u)
                ;
              if (u !== c) {
                n = u === -1 ? '' : n.slice(0, u), s = a, r = 0, o = !1;
                continue;
              }
            } else if (n.length === 2 || n.length === 1) {
              n = '', s = a, r = 0, o = !1;
              continue;
            }
          }
          t && (n.length > 0 ? n += '/..' : n = '..', o = !0);
        } else {
          const c = e.slice(s + 1, a);
          n.length > 0 ? n += `/${c}` : n = c, o = !1;
        }
      }
      s = a, r = 0;
    } else { i === us && r !== -1 ? ++r : r = -1; }
  }
  return n;
}
const zu = (e) => typeof e === 'boolean'; const ve = (e) => typeof e === 'function'; const We = (e) => e !== null && typeof e === 'object'; const ti = (e) => We(e) && e.constructor === {}.constructor; const Wu = (e) => !!e && typeof e[Symbol.iterator] === 'function'; const Xu = (e) => e && typeof e[Symbol.asyncIterator] === 'function'; const se = (e) => typeof Response < 'u' && e instanceof Response || e && e.arrayBuffer && e.text && e.json; const re = (e) => typeof Blob < 'u' && e instanceof Blob; const Qu = (e) => e && typeof e === 'object' && e.isBuffer; const qu = (e) => typeof ReadableStream < 'u' && e instanceof ReadableStream || We(e) && ve(e.tee) && ve(e.cancel) && ve(e.getReader); const Yu = (e) => We(e) && ve(e.read) && ve(e.pipe) && zu(e.readable); const na = (e) => qu(e) || Yu(e); const $u = /^data:([-\w.]+\/[-\w.+]+)(;|,)/; const Zu = /^([-\w.]+\/[-\w.+]+)/;
function tl (e) {
  const t = Zu.exec(e);
  return t ? t[1] : e;
}
function ei (e) {
  const t = $u.exec(e);
  return t ? t[1] : '';
}
const sa = /\?.*/;
function el (e) {
  const t = e.match(sa);
  return t && t[0];
}
function mr (e) {
  return e.replace(sa, '');
}
function Kn (e) {
  return se(e) ? e.url : re(e) ? e.name || '' : typeof e === 'string' ? e : '';
}
function gr (e) {
  if (se(e)) {
    const t = e; const n = t.headers.get('content-type') || ''; const s = mr(t.url);
    return tl(n) || ei(s);
  }
  return re(e) ? e.type || '' : typeof e === 'string' ? ei(e) : '';
}
function nl (e) {
  return se(e) ? e.headers['content-length'] || -1 : re(e) ? e.size : typeof e === 'string' ? e.length : e instanceof ArrayBuffer || ArrayBuffer.isView(e) ? e.byteLength : -1;
}
async function ra (e) {
  if (se(e)) { return e; }
  const t = {}; const n = nl(e);
  n >= 0 && (t['content-length'] = String(n));
  const s = Kn(e); const r = gr(e);
  r && (t['content-type'] = r);
  const i = await il(e);
  i && (t['x-first-bytes'] = i), typeof e === 'string' && (e = new TextEncoder().encode(e));
  const o = new Response(e, {
    headers: t
  });
  return Object.defineProperty(o, 'url', {
    value: s
  }), o;
}
async function sl (e) {
  if (!e.ok) {
    const t = await rl(e);
    throw new Error(t);
  }
}
async function rl (e) {
  let t = `Failed to fetch resource ${e.url} (${e.status}): `;
  try {
    const n = e.headers.get('Content-Type');
    let s = e.statusText;
    n != null && n.includes('application/json') && (s += ` ${await e.text()}`), t += s, t = t.length > 60 ? `${t.slice(0, 60)}...` : t;
  } catch {
  }
  return t;
}
async function il (e) {
  if (typeof e === 'string') { return `data:,${e.slice(0, 5)}`; }
  if (e instanceof Blob) {
    const n = e.slice(0, 5);
    return await new Promise((s) => {
      const r = new FileReader();
      r.onload = (i) => {
        let o;
        return s(i == null || (o = i.target) === null || o === void 0 ? void 0 : o.result);
      }, r.readAsDataURL(n);
    });
  }
  if (e instanceof ArrayBuffer) {
    const n = e.slice(0, 5);
    return `data:base64,${ol(n)}`;
  }
  return null;
}
function ol (e) {
  let t = '';
  const n = new Uint8Array(e);
  for (let s = 0; s < n.byteLength; s++) { t += String.fromCharCode(n[s]); }
  return btoa(t);
}
function al (e) {
  return !cl(e) && !ul(e);
}
function cl (e) {
  return e.startsWith('http:') || e.startsWith('https:');
}
function ul (e) {
  return e.startsWith('data:');
}
async function Ge (e, t) {
  if (typeof e === 'string') {
    const r = Ju(e);
    if (al(r)) {
      let n;
      if ((n = globalThis.loaders) !== null && n !== void 0 && n.fetchNode) {
        let s;
        return (s = globalThis.loaders) === null || s === void 0 ? void 0 : s.fetchNode(r, t);
      }
    }
    return await fetch(r, t);
  }
  return await ra(e);
}
function ll (e) {
  if (typeof window < 'u' && typeof window.process === 'object' && window.process.type === 'renderer' || typeof process < 'u' && typeof process.versions === 'object' && process.versions.electron) { return !0; }
  const t = typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent; const n = e || t;
  return !!(n && n.indexOf('Electron') >= 0);
}
function Xe () {
  return !(typeof process === 'object' && String(process) === '[object process]' && !process.browser) || ll();
}
const Ze = globalThis.window || globalThis.self || globalThis.global; const Ee = globalThis.process || {}; const ia = typeof __VERSION__ < 'u' ? __VERSION__ : 'untranspiled source';
Xe();
function hl (e) {
  try {
    const t = window[e]; const n = '__storage_test__';
    return t.setItem(n, n), t.removeItem(n), t;
  } catch {
    return null;
  }
}
class fl {
  constructor (t, n) {
    const s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 'sessionStorage';
    this.storage = void 0, this.id = void 0, this.config = void 0, this.storage = hl(s), this.id = t, this.config = n, this._loadConfiguration();
  }

  getConfiguration () {
    return this.config;
  }

  setConfiguration (t) {
    if (Object.assign(this.config, t), this.storage) {
      const n = JSON.stringify(this.config);
      this.storage.setItem(this.id, n);
    }
  }

  _loadConfiguration () {
    let t = {};
    if (this.storage) {
      const n = this.storage.getItem(this.id);
      t = n ? JSON.parse(n) : {};
    }
    return Object.assign(this.config, t), this;
  }
}
function dl (e) {
  let t;
  return e < 10 ? t = ''.concat(e.toFixed(2), 'ms') : e < 100 ? t = ''.concat(e.toFixed(1), 'ms') : e < 1e3 ? t = ''.concat(e.toFixed(0), 'ms') : t = ''.concat((e / 1e3).toFixed(2), 's'), t;
}
function ml (e) {
  const t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 8;
  const n = Math.max(t - e.length, 0);
  return ''.concat(' '.repeat(n)).concat(e);
}
function ls (e, t, n) {
  const s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 600;
  const r = e.src.replace(/\(/g, '%28').replace(/\)/g, '%29');
  e.width > s && (n = Math.min(n, s / e.width));
  const i = e.width * n; const o = e.height * n; const a = ['font-size:1px;', 'padding:'.concat(Math.floor(o / 2), 'px ').concat(Math.floor(i / 2), 'px;'), 'line-height:'.concat(o, 'px;'), 'background:url('.concat(r, ');'), 'background-size:'.concat(i, 'px ').concat(o, 'px;'), 'color:transparent;'].join('');
  return [''.concat(t, ' %c+'), a];
}
let In;
(function (e) {
  e[e.BLACK = 30] = 'BLACK', e[e.RED = 31] = 'RED', e[e.GREEN = 32] = 'GREEN', e[e.YELLOW = 33] = 'YELLOW', e[e.BLUE = 34] = 'BLUE', e[e.MAGENTA = 35] = 'MAGENTA', e[e.CYAN = 36] = 'CYAN', e[e.WHITE = 37] = 'WHITE', e[e.BRIGHT_BLACK = 90] = 'BRIGHT_BLACK', e[e.BRIGHT_RED = 91] = 'BRIGHT_RED', e[e.BRIGHT_GREEN = 92] = 'BRIGHT_GREEN', e[e.BRIGHT_YELLOW = 93] = 'BRIGHT_YELLOW', e[e.BRIGHT_BLUE = 94] = 'BRIGHT_BLUE', e[e.BRIGHT_MAGENTA = 95] = 'BRIGHT_MAGENTA', e[e.BRIGHT_CYAN = 96] = 'BRIGHT_CYAN', e[e.BRIGHT_WHITE = 97] = 'BRIGHT_WHITE';
})(In || (In = {}));
const gl = 10;
function ni (e) {
  return typeof e !== 'string' ? e : (e = e.toUpperCase(), In[e] || In.WHITE);
}
function Al (e, t, n) {
  if (!Xe && typeof e === 'string') {
    if (t) {
      const s = ni(t);
      e = '\x1B['.concat(s, 'm').concat(e, '\x1B[39m');
    }
    if (n) {
      const s = ni(n);
      e = '\x1B['.concat(s + gl, 'm').concat(e, '\x1B[49m');
    }
  }
  return e;
}
function pl (e) {
  const t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : ['constructor'];
  const n = Object.getPrototypeOf(e); const s = Object.getOwnPropertyNames(n); const r = e;
  for (const i of s) {
    const o = r[i];
    typeof o === 'function' && (t.find((a) => i === a) || (r[i] = o.bind(e)));
  }
}
function xn (e, t) {
  if (!e) { throw new Error(t || 'Assertion failed'); }
}
function ae () {
  let e;
  if (Xe() && Ze.performance) {
    let t, n;
    e = Ze == null || (t = Ze.performance) === null || t === void 0 || (n = t.now) === null || n === void 0 ? void 0 : n.call(t);
  } else if ('hrtime' in Ee) {
    let s;
    const r = Ee == null || (s = Ee.hrtime) === null || s === void 0 ? void 0 : s.call(Ee);
    e = r[0] * 1e3 + r[1] / 1e6;
  } else { e = Date.now(); }
  return e;
}
const ce = {
  debug: Xe() && console.debug || console.log,
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error
}; const yl = {
  enabled: !0,
  level: 0
};
function Ct () {
}
const si = {}; const ri = {
  once: !0
};
class zn {
  constructor () {
    const {
      id: t
    } = arguments.length > 0 && arguments[0] !== void 0
      ? arguments[0]
      : {
          id: ''
        };
    this.id = void 0, this.VERSION = ia, this._startTs = ae(), this._deltaTs = ae(), this._storage = void 0, this.userData = {}, this.LOG_THROTTLE_TIMEOUT = 0, this.id = t, this.userData = {}, this._storage = new fl('__probe-'.concat(this.id, '__'), yl), this.timeStamp(''.concat(this.id, ' started')), pl(this), Object.seal(this);
  }

  set level (t) {
    this.setLevel(t);
  }

  get level () {
    return this.getLevel();
  }

  isEnabled () {
    return this._storage.config.enabled;
  }

  getLevel () {
    return this._storage.config.level;
  }

  getTotal () {
    return Number((ae() - this._startTs).toPrecision(10));
  }

  getDelta () {
    return Number((ae() - this._deltaTs).toPrecision(10));
  }

  set priority (t) {
    this.level = t;
  }

  get priority () {
    return this.level;
  }

  getPriority () {
    return this.level;
  }

  enable () {
    const t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0;
    return this._storage.setConfiguration({
      enabled: t
    }), this;
  }

  setLevel (t) {
    return this._storage.setConfiguration({
      level: t
    }), this;
  }

  get (t) {
    return this._storage.config[t];
  }

  set (t, n) {
    this._storage.setConfiguration({
      [t]: n
    });
  }

  settings () {
    console.table ? console.table(this._storage.config) : console.log(this._storage.config);
  }

  assert (t, n) {
    xn(t, n);
  }

  warn (t) {
    return this._getLogFunction(0, t, ce.warn, arguments, ri);
  }

  error (t) {
    return this._getLogFunction(0, t, ce.error, arguments);
  }

  deprecated (t, n) {
    return this.warn('`'.concat(t, '` is deprecated and will be removed in a later version. Use `').concat(n, '` instead'));
  }

  removed (t, n) {
    return this.error('`'.concat(t, '` has been removed. Use `').concat(n, '` instead'));
  }

  probe (t, n) {
    return this._getLogFunction(t, n, ce.log, arguments, {
      time: !0,
      once: !0
    });
  }

  log (t, n) {
    return this._getLogFunction(t, n, ce.debug, arguments);
  }

  info (t, n) {
    return this._getLogFunction(t, n, console.info, arguments);
  }

  once (t, n) {
    return this._getLogFunction(t, n, ce.debug || ce.info, arguments, ri);
  }

  table (t, n, s) {
    return n
      ? this._getLogFunction(t, n, console.table || Ct, s && [s], {
        tag: Tl(n)
      })
      : Ct;
  }

  image (t) {
    const {
      logLevel: n,
      priority: s,
      image: r,
      message: i = '',
      scale: o = 1
    } = t;
    return this._shouldLog(n || s)
      ? Xe()
        ? El({
          image: r,
          message: i,
          scale: o
        })
        : Cl()
      : Ct;
  }

  time (t, n) {
    return this._getLogFunction(t, n, console.time ? console.time : console.info);
  }

  timeEnd (t, n) {
    return this._getLogFunction(t, n, console.timeEnd ? console.timeEnd : console.info);
  }

  timeStamp (t, n) {
    return this._getLogFunction(t, n, console.timeStamp || Ct);
  }

  group (t, n) {
    const s = arguments.length > 2 && arguments[2] !== void 0
      ? arguments[2]
      : {
          collapsed: !1
        };
    const r = ii({
      logLevel: t,
      message: n,
      opts: s
    }); const {
      collapsed: i
    } = s;
    return r.method = (i ? console.groupCollapsed : console.group) || console.info, this._getLogFunction(r);
  }

  groupCollapsed (t, n) {
    const s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return this.group(t, n, Object.assign({}, s, {
      collapsed: !0
    }));
  }

  groupEnd (t) {
    return this._getLogFunction(t, '', console.groupEnd || Ct);
  }

  withGroup (t, n, s) {
    this.group(t, n)();
    try {
      s();
    } finally {
      this.groupEnd(t)();
    }
  }

  trace () {
    console.trace && console.trace();
  }

  _shouldLog (t) {
    return this.isEnabled() && this.getLevel() >= oa(t);
  }

  _getLogFunction (t, n, s, r, i) {
    if (this._shouldLog(t)) {
      i = ii({
        logLevel: t,
        message: n,
        args: r,
        opts: i
      }), s = s || i.method, xn(s), i.total = this.getTotal(), i.delta = this.getDelta(), this._deltaTs = ae();
      const o = i.tag || i.message;
      if (i.once && o) {
        if (!si[o]) { si[o] = ae(); } else { return Ct; }
      }
      return n = Bl(this.id, i.message, i), s.bind(console, n, ...i.args);
    }
    return Ct;
  }
}
zn.VERSION = ia;
function oa (e) {
  if (!e) { return 0; }
  let t;
  switch (typeof e) {
    case 'number':
      t = e;
      break;
    case 'object':
      t = e.logLevel || e.priority || 0;
      break;
    default:
      return 0;
  }
  return xn(Number.isFinite(t) && t >= 0), t;
}
function ii (e) {
  const {
    logLevel: t,
    message: n
  } = e;
  e.logLevel = oa(t);
  const s = e.args ? Array.from(e.args) : [];
  for (; s.length && s.shift() !== n;)
    ;
  switch (typeof t) {
    case 'string':
    case 'function':
      n !== void 0 && s.unshift(n), e.message = t;
      break;
    case 'object':
      Object.assign(e, t);
      break;
  }
  typeof e.message === 'function' && (e.message = e.message());
  const r = typeof e.message;
  return xn(r === 'string' || r === 'object'), Object.assign(e, {
    args: s
  }, e.opts);
}
function Bl (e, t, n) {
  if (typeof t === 'string') {
    const s = n.time ? ml(dl(n.total)) : '';
    t = n.time ? ''.concat(e, ': ').concat(s, '  ').concat(t) : ''.concat(e, ': ').concat(t), t = Al(t, n.color, n.background);
  }
  return t;
}
function Cl (e) {
  return console.warn('removed'), Ct;
}
function El (e) {
  const {
    image: t,
    message: n = '',
    scale: s = 1
  } = e;
  if (typeof t === 'string') {
    const i = new Image();
    return i.onload = () => {
      const o = ls(i, n, s);
      console.log(...o);
    }, i.src = t, Ct;
  }
  const r = t.nodeName || '';
  if (r.toLowerCase() === 'img') { return console.log(...ls(t, n, s)), Ct; }
  if (r.toLowerCase() === 'canvas') {
    const i = new Image();
    return i.onload = () => console.log(...ls(i, n, s)), i.src = t.toDataURL(), Ct;
  }
  return Ct;
}
function Tl (e) {
  for (const t in e) {
    for (const n in e[t]) { return n || 'untitled'; }
  }
  return 'empty';
}
const aa = new zn({
  id: '@probe.gl/log'
}); const oi = new zn({
  id: 'loaders.gl'
});
class bl {
  log () {
    return () => {
    };
  }

  info () {
    return () => {
    };
  }

  warn () {
    return () => {
    };
  }

  error () {
    return () => {
    };
  }
}
class _l {
  constructor () {
    this.console = void 0, this.console = console;
  }

  log () {
    for (var t = arguments.length, n = new Array(t), s = 0; s < t; s++) { n[s] = arguments[s]; }
    return this.console.log.bind(this.console, ...n);
  }

  info () {
    for (var t = arguments.length, n = new Array(t), s = 0; s < t; s++) { n[s] = arguments[s]; }
    return this.console.info.bind(this.console, ...n);
  }

  warn () {
    for (var t = arguments.length, n = new Array(t), s = 0; s < t; s++) { n[s] = arguments[s]; }
    return this.console.warn.bind(this.console, ...n);
  }

  error () {
    for (var t = arguments.length, n = new Array(t), s = 0; s < t; s++) { n[s] = arguments[s]; }
    return this.console.error.bind(this.console, ...n);
  }
}
const ca = {
  fetch: null,
  mimeType: void 0,
  nothrow: !1,
  log: new _l(),
  useLocalLibraries: !1,
  CDN: 'https://unpkg.com/@loaders.gl',
  worker: !0,
  maxConcurrency: 3,
  maxMobileConcurrency: 1,
  reuseWorkers: kn,
  _nodeWorkers: !1,
  _workerType: '',
  limit: 0,
  _limitMB: 0,
  batchSize: 'auto',
  batchDebounceMs: 0,
  metadata: !1,
  transforms: []
}; const wl = {
  throws: 'nothrow',
  dataType: '(no longer used)',
  uri: 'baseUri',
  method: 'fetch.method',
  headers: 'fetch.headers',
  body: 'fetch.body',
  mode: 'fetch.mode',
  credentials: 'fetch.credentials',
  cache: 'fetch.cache',
  redirect: 'fetch.redirect',
  referrer: 'fetch.referrer',
  referrerPolicy: 'fetch.referrerPolicy',
  integrity: 'fetch.integrity',
  keepalive: 'fetch.keepalive',
  signal: 'fetch.signal'
};
function ua () {
  globalThis.loaders = globalThis.loaders || {};
  const {
    loaders: e
  } = globalThis;
  return e._state = e._state || {}, e._state;
}
function la () {
  const e = ua();
  return e.globalOptions = e.globalOptions || {
    ...ca
  }, e.globalOptions;
}
function Rl (e, t, n, s) {
  return n = n || [], n = Array.isArray(n) ? n : [n], Ml(e, n), Il(t, e, s);
}
function Ml (e, t) {
  ai(e, null, ca, wl, t);
  for (const n of t) {
    const s = e && e[n.id] || {}; const r = n.options && n.options[n.id] || {}; const i = n.deprecatedOptions && n.deprecatedOptions[n.id] || {};
    ai(s, n.id, r, i, t);
  }
}
function ai (e, t, n, s, r) {
  const i = t || 'Top level'; const o = t ? `${t}.` : '';
  for (const a in e) {
    const c = !t && We(e[a]); const u = a === 'baseUri' && !t; const l = a === 'workerUrl' && t;
    if (!(a in n) && !u && !l) {
      if (a in s) { oi.warn(`${i} loader option '${o}${a}' no longer supported, use '${s[a]}'`)(); } else if (!c) {
        const h = Sl(a, r);
        oi.warn(`${i} loader option '${o}${a}' not recognized. ${h}`)();
      }
    }
  }
}
function Sl (e, t) {
  const n = e.toLowerCase();
  let s = '';
  for (const r of t) {
    for (const i in r.options) {
      if (e === i) { return `Did you mean '${r.id}.${i}'?`; }
      const o = i.toLowerCase();
      (n.startsWith(o) || o.startsWith(n)) && (s = s || `Did you mean '${r.id}.${i}'?`);
    }
  }
  return s;
}
function Il (e, t, n) {
  const r = {
    ...e.options || {}
  };
  return xl(r, n), r.log === null && (r.log = new bl()), ci(r, la()), ci(r, t), r;
}
function ci (e, t) {
  for (const n in t) {
    if (n in t) {
      const s = t[n];
      ti(s) && ti(e[n])
        ? e[n] = {
          ...e[n],
          ...t[n]
        }
        : e[n] = t[n];
    }
  }
}
function xl (e, t) {
  t && !('baseUri' in e) && (e.baseUri = t);
}
function Ar (e) {
  let t;
  return e ? (Array.isArray(e) && (e = e[0]), Array.isArray((t = e) === null || t === void 0 ? void 0 : t.extensions)) : !1;
}
function ha (e) {
  let t, n;
  z(e, 'null loader'), z(Ar(e), 'invalid loader');
  let s;
  return Array.isArray(e) && (s = e[1], e = e[0], e = {
    ...e,
    options: {
      ...e.options,
      ...s
    }
  }), ((t = e) !== null && t !== void 0 && t.parseTextSync || (n = e) !== null && n !== void 0 && n.parseText) && (e.text = !0), e.text || (e.binary = !0), e;
}
const vl = () => {
  const e = ua();
  return e.loaderRegistry = e.loaderRegistry || [], e.loaderRegistry;
};
function Ol () {
  return vl();
}
const Fl = new zn({
  id: 'loaders.gl'
}); const Dl = /\.([^.]+)$/;
async function Ll (e) {
  const t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : []; const n = arguments.length > 2 ? arguments[2] : void 0; const s = arguments.length > 3 ? arguments[3] : void 0;
  if (!fa(e)) { return null; }
  let r = ui(e, t, {
    ...n,
    nothrow: !0
  }, s);
  if (r) { return r; }
  if (re(e) && (e = await e.slice(0, 10).arrayBuffer(), r = ui(e, t, n, s)), !r && !(n != null && n.nothrow)) { throw new Error(da(e)); }
  return r;
}
function ui (e) {
  const t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : []; const n = arguments.length > 2 ? arguments[2] : void 0; const s = arguments.length > 3 ? arguments[3] : void 0;
  if (!fa(e)) { return null; }
  if (t && !Array.isArray(t)) { return ha(t); }
  let r = [];
  t && (r = r.concat(t)), n != null && n.ignoreRegisteredLoaders || r.push(...Ol()), Gl(r);
  const i = Pl(e, r, n, s);
  if (!i && !(n != null && n.nothrow)) { throw new Error(da(e)); }
  return i;
}
function Pl (e, t, n, s) {
  const r = Kn(e); const i = gr(e); const o = mr(r) || (s == null ? void 0 : s.url);
  let a = null; let c = '';
  if (n != null && n.mimeType && (a = hs(t, n == null ? void 0 : n.mimeType), c = `match forced by supplied MIME type ${n == null ? void 0 : n.mimeType}`), a = a || Nl(t, o), c = c || (a ? `matched url ${o}` : ''), a = a || hs(t, i), c = c || (a ? `matched MIME type ${i}` : ''), a = a || Hl(t, e), c = c || (a ? `matched initial data ${ma(e)}` : ''), n != null && n.fallbackMimeType && (a = a || hs(t, n == null ? void 0 : n.fallbackMimeType), c = c || (a ? `matched fallback MIME type ${i}` : '')), c) {
    let u;
    Fl.log(1, `selectLoader selected ${(u = a) === null || u === void 0 ? void 0 : u.name}: ${c}.`);
  }
  return a;
}
function fa (e) {
  return !(e instanceof Response && e.status === 204);
}
function da (e) {
  const t = Kn(e); const n = gr(e);
  let s = 'No valid loader found (';
  s += t ? `${ta(t)}, ` : 'no url provided, ', s += `MIME type: ${n ? `"${n}"` : 'not provided'}, `;
  const r = e ? ma(e) : '';
  return s += r ? ` first bytes: "${r}"` : 'first bytes: not available', s += ')', s;
}
function Gl (e) {
  for (const t of e) { ha(t); }
}
function Nl (e, t) {
  const n = t && Dl.exec(t); const s = n && n[1];
  return s ? Ul(e, s) : null;
}
function Ul (e, t) {
  t = t.toLowerCase();
  for (const n of e) {
    for (const s of n.extensions) {
      if (s.toLowerCase() === t) { return n; }
    }
  }
  return null;
}
function hs (e, t) {
  for (const n of e) {
    if (n.mimeTypes && n.mimeTypes.includes(t) || t === `application/x.${n.id}`) { return n; }
  }
  return null;
}
function Hl (e, t) {
  if (!t) { return null; }
  for (const n of e) {
    if (typeof t === 'string') {
      if (Jl(t, n)) { return n; }
    } else if (ArrayBuffer.isView(t)) {
      if (li(t.buffer, t.byteOffset, n)) { return n; }
    } else if (t instanceof ArrayBuffer && li(t, 0, n)) { return n; }
  }
  return null;
}
function Jl (e, t) {
  return t.testText ? t.testText(e) : (Array.isArray(t.tests) ? t.tests : [t.tests]).some((s) => e.startsWith(s));
}
function li (e, t, n) {
  return (Array.isArray(n.tests) ? n.tests : [n.tests]).some((r) => Vl(e, t, n, r));
}
function Vl (e, t, n, s) {
  if (s instanceof ArrayBuffer) { return Lu(s, e, s.byteLength); }
  switch (typeof s) {
    case 'function':
      return s(e);
    case 'string':
      const r = js(e, t, s.length);
      return s === r;
    default:
      return !1;
  }
}
function ma (e) {
  const t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 5;
  return typeof e === 'string' ? e.slice(0, t) : ArrayBuffer.isView(e) ? js(e.buffer, e.byteOffset, t) : e instanceof ArrayBuffer ? js(e, 0, t) : '';
}
function js (e, t, n) {
  if (e.byteLength < t + n) { return ''; }
  const s = new DataView(e);
  let r = '';
  for (let i = 0; i < n; i++) { r += String.fromCharCode(s.getUint8(t + i)); }
  return r;
}
const jl = 256 * 1024;
function * kl (e, t) {
  const n = (t == null ? void 0 : t.chunkSize) || jl;
  let s = 0;
  const r = new TextEncoder();
  for (; s < e.length;) {
    const i = Math.min(e.length - s, n); const o = e.slice(s, s + i);
    s += i, yield r.encode(o);
  }
}
const Kl = 256 * 1024;
function zl (e) {
  const t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return (function * () {
    const {
      chunkSize: n = Kl
    } = t;
    let s = 0;
    for (; s < e.byteLength;) {
      const r = Math.min(e.byteLength - s, n); const i = new ArrayBuffer(r); const o = new Uint8Array(e, s, r);
      new Uint8Array(i).set(o), s += r, yield i;
    }
  }());
}
const Wl = 1024 * 1024;
async function * Xl (e, t) {
  const n = (t == null ? void 0 : t.chunkSize) || Wl;
  let s = 0;
  for (; s < e.size;) {
    const r = s + n; const i = await e.slice(s, r).arrayBuffer();
    s = r, yield i;
  }
}
function hi (e, t) {
  return kn ? Ql(e, t) : ql(e);
}
async function * Ql (e, t) {
  const n = e.getReader();
  let s;
  try {
    for (; ;) {
      const r = s || n.read();
      t != null && t._streamReadAhead && (s = n.read());
      const {
        done: i,
        value: o
      } = await r;
      if (i) { return; }
      yield Zo(o);
    }
  } catch {
    n.releaseLock();
  }
}
async function * ql (e, t) {
  for await (const n of e) { yield Zo(n); }
}
function Yl (e, t) {
  if (typeof e === 'string') { return kl(e, t); }
  if (e instanceof ArrayBuffer) { return zl(e, t); }
  if (re(e)) { return Xl(e, t); }
  if (na(e)) { return hi(e, t); }
  if (se(e)) { return hi(e.body, t); }
  throw new Error('makeIterator');
}
const ga = 'Cannot convert supplied data type';
function $l (e, t, n) {
  if (t.text && typeof e === 'string') { return e; }
  if (Qu(e) && (e = e.buffer), e instanceof ArrayBuffer) {
    const s = e;
    return t.text && !t.binary ? new TextDecoder('utf8').decode(s) : s;
  }
  if (ArrayBuffer.isView(e)) {
    if (t.text && !t.binary) { return new TextDecoder('utf8').decode(e); }
    let s = e.buffer;
    const r = e.byteLength || e.length;
    return (e.byteOffset !== 0 || r !== s.byteLength) && (s = s.slice(e.byteOffset, e.byteOffset + r)), s;
  }
  throw new Error(ga);
}
async function Zl (e, t, n) {
  const s = e instanceof ArrayBuffer || ArrayBuffer.isView(e);
  if (typeof e === 'string' || s) { return $l(e, t); }
  if (re(e) && (e = await ra(e)), se(e)) {
    const r = e;
    return await sl(r), t.binary ? await r.arrayBuffer() : await r.text();
  }
  if (na(e) && (e = Yl(e, n)), Wu(e) || Xu(e)) { return Uu(e); }
  throw new Error(ga);
}
function Aa (e, t) {
  const n = la(); const s = e || n;
  return typeof s.fetch === 'function' ? s.fetch : We(s.fetch) ? (r) => Ge(r, s.fetch) : t != null && t.fetch ? t == null ? void 0 : t.fetch : Ge;
}
function th (e, t, n) {
  if (n) { return n; }
  const s = {
    fetch: Aa(t, e),
    ...e
  };
  if (s.url) {
    const r = mr(s.url);
    s.baseUrl = r, s.queryString = el(s.url), s.filename = ta(r), s.baseUrl = ea(r);
  }
  return Array.isArray(s.loaders) || (s.loaders = null), s;
}
function eh (e, t) {
  if (e && !Array.isArray(e)) { return e; }
  let n;
  if (e && (n = Array.isArray(e) ? e : [e]), t && t.loaders) {
    const s = Array.isArray(t.loaders) ? t.loaders : [t.loaders];
    n = n ? [...n, ...s] : s;
  }
  return n && n.length ? n : void 0;
}
async function vn (e, t, n, s) {
  t && !Array.isArray(t) && !Ar(t) && (s = void 0, n = t, t = void 0), e = await e, n = n || {};
  const r = Kn(e); const o = eh(t, s); const a = await Ll(e, o, n);
  return a
    ? (n = Rl(n, a, o, r), s = th({
        url: r,
        _parse: vn,
        loaders: o
      }, n, s || null), await nh(a, e, n, s))
    : null;
}
async function nh (e, t, n, s) {
  if (Tu(e), n = hu(e.options, n), se(t)) {
    const i = t; const {
      ok: o,
      redirected: a,
      status: c,
      statusText: u,
      type: l,
      url: h
    } = i; const f = Object.fromEntries(i.headers.entries());
    s.response = {
      headers: f,
      ok: o,
      redirected: a,
      status: c,
      statusText: u,
      type: l,
      url: h
    };
  }
  t = await Zl(t, e, n);
  const r = e;
  if (r.parseTextSync && typeof t === 'string') { return r.parseTextSync(t, n, s); }
  if (xu(e, n)) { return await vu(e, t, n, s, vn); }
  if (r.parseText && typeof t === 'string') { return await r.parseText(t, n, s); }
  if (r.parse) { return await r.parse(t, n, s); }
  throw Jt(!r.parseSync), new Error(`${e.id} loader - no parser found and worker is disabled`);
}
function sh (e) {
  switch (e.constructor) {
    case Int8Array:
      return 'int8';
    case Uint8Array:
    case Uint8ClampedArray:
      return 'uint8';
    case Int16Array:
      return 'int16';
    case Uint16Array:
      return 'uint16';
    case Int32Array:
      return 'int32';
    case Uint32Array:
      return 'uint32';
    case Float32Array:
      return 'float32';
    case Float64Array:
      return 'float64';
    default:
      return 'null';
  }
}
function rh (e) {
  let t = 1 / 0; let n = 1 / 0; let s = 1 / 0; let r = -1 / 0; let i = -1 / 0; let o = -1 / 0;
  const a = e.POSITION ? e.POSITION.value : []; const c = a && a.length;
  for (let u = 0; u < c; u += 3) {
    const l = a[u]; const h = a[u + 1]; const f = a[u + 2];
    t = l < t ? l : t, n = h < n ? h : n, s = f < s ? f : s, r = l > r ? l : r, i = h > i ? h : i, o = f > o ? f : o;
  }
  return [[t, n, s], [r, i, o]];
}
function ih (e, t, n) {
  const s = sh(t.value); const r = n || oh(t);
  return {
    name: e,
    type: {
      type: 'fixed-size-list',
      listSize: t.size,
      children: [{
        name: 'value',
        type: s
      }]
    },
    nullable: !1,
    metadata: r
  };
}
function oh (e) {
  const t = {};
  return 'byteOffset' in e && (t.byteOffset = e.byteOffset.toString(10)), 'byteStride' in e && (t.byteStride = e.byteStride.toString(10)), 'normalized' in e && (t.normalized = e.normalized.toString()), t;
}
async function Ae (e, t, n, s) {
  let r, i;
  !Array.isArray(t) && !Ar(t) ? (r = [], i = t) : (r = t, i = n);
  const o = Aa(i);
  let a = e;
  return typeof e === 'string' && (a = await o(e)), re(e) && (a = await o(e)), Array.isArray(r) ? await vn(a, r, i) : await vn(a, r, i);
}
const ah = 1 / Math.PI * 180; const ch = 1 / 180 * Math.PI; const uh = {
  EPSILON: 1e-12,
  debug: !1,
  precision: 4,
  printTypes: !1,
  printDegrees: !1,
  printRowMajor: !0,
  _cartographicRadians: !1
};
globalThis.mathgl = globalThis.mathgl || {
  config: {
    ...uh
  }
};
const et = globalThis.mathgl.config;
function lh (e, {
  precision: t = et.precision
} = {}) {
  return e = gh(e), ''.concat(parseFloat(e.toPrecision(t)));
}
function ee (e) {
  return Array.isArray(e) || ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function hh (e) {
  return dh(e);
}
function fh (e) {
  return Rt(e);
}
function dh (e, t) {
  return pr(e, (n) => n * ch, t);
}
function Rt (e, t) {
  return pr(e, (n) => n * ah, t);
}
function mh (e, t, n) {
  return pr(e, (s) => Math.max(t, Math.min(n, s)));
}
function Kt (e, t, n) {
  const s = et.EPSILON;
  n && (et.EPSILON = n);
  try {
    if (e === t) { return !0; }
    if (ee(e) && ee(t)) {
      if (e.length !== t.length) { return !1; }
      for (let r = 0; r < e.length; ++r) {
        if (!Kt(e[r], t[r])) { return !1; }
      }
      return !0;
    }
    return e && e.equals ? e.equals(t) : t && t.equals ? t.equals(e) : typeof e === 'number' && typeof t === 'number' ? Math.abs(e - t) <= et.EPSILON * Math.max(1, Math.abs(e), Math.abs(t)) : !1;
  } finally {
    et.EPSILON = s;
  }
}
function gh (e) {
  return Math.round(e / et.EPSILON) * et.EPSILON;
}
function Ah (e) {
  return e.clone ? e.clone() : new Array(e.length);
}
function pr (e, t, n) {
  if (ee(e)) {
    const s = e;
    n = n || Ah(s);
    for (let r = 0; r < n.length && r < s.length; ++r) {
      const i = typeof e === 'number' ? e : e[r];
      n[r] = t(i, r, n);
    }
    return n;
  }
  return t(e);
}
function ph (e) {
  function t () {
    const n = Reflect.construct(e, Array.from(arguments));
    return Object.setPrototypeOf(n, Object.getPrototypeOf(this)), n;
  }
  return t.prototype = Object.create(e.prototype, {
    constructor: {
      value: e,
      enumerable: !1,
      writable: !0,
      configurable: !0
    }
  }), Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e, t;
}
class yr extends ph(Array) {
  clone () {
    return new this.constructor().copy(this);
  }

  fromArray (t, n = 0) {
    for (let s = 0; s < this.ELEMENTS; ++s) { this[s] = t[s + n]; }
    return this.check();
  }

  toArray (t = [], n = 0) {
    for (let s = 0; s < this.ELEMENTS; ++s) { t[n + s] = this[s]; }
    return t;
  }

  toObject (t) {
    return t;
  }

  from (t) {
    return Array.isArray(t) ? this.copy(t) : this.fromObject(t);
  }

  to (t) {
    return t === this ? this : ee(t) ? this.toArray(t) : this.toObject(t);
  }

  toTarget (t) {
    return t ? this.to(t) : this;
  }

  toFloat32Array () {
    return new Float32Array(this);
  }

  toString () {
    return this.formatString(et);
  }

  formatString (t) {
    let n = '';
    for (let s = 0; s < this.ELEMENTS; ++s) { n += (s > 0 ? ', ' : '') + lh(this[s], t); }
    return ''.concat(t.printTypes ? this.constructor.name : '', '[').concat(n, ']');
  }

  equals (t) {
    if (!t || this.length !== t.length) { return !1; }
    for (let n = 0; n < this.ELEMENTS; ++n) {
      if (!Kt(this[n], t[n])) { return !1; }
    }
    return !0;
  }

  exactEquals (t) {
    if (!t || this.length !== t.length) { return !1; }
    for (let n = 0; n < this.ELEMENTS; ++n) {
      if (this[n] !== t[n]) { return !1; }
    }
    return !0;
  }

  negate () {
    for (let t = 0; t < this.ELEMENTS; ++t) { this[t] = -this[t]; }
    return this.check();
  }

  lerp (t, n, s) {
    if (s === void 0) { return this.lerp(this, t, n); }
    for (let r = 0; r < this.ELEMENTS; ++r) {
      const i = t[r]; const o = typeof n === 'number' ? n : n[r];
      this[r] = i + s * (o - i);
    }
    return this.check();
  }

  min (t) {
    for (let n = 0; n < this.ELEMENTS; ++n) { this[n] = Math.min(t[n], this[n]); }
    return this.check();
  }

  max (t) {
    for (let n = 0; n < this.ELEMENTS; ++n) { this[n] = Math.max(t[n], this[n]); }
    return this.check();
  }

  clamp (t, n) {
    for (let s = 0; s < this.ELEMENTS; ++s) { this[s] = Math.min(Math.max(this[s], t[s]), n[s]); }
    return this.check();
  }

  add (...t) {
    for (const n of t) {
      for (let s = 0; s < this.ELEMENTS; ++s) { this[s] += n[s]; }
    }
    return this.check();
  }

  subtract (...t) {
    for (const n of t) {
      for (let s = 0; s < this.ELEMENTS; ++s) { this[s] -= n[s]; }
    }
    return this.check();
  }

  scale (t) {
    if (typeof t === 'number') {
      for (let n = 0; n < this.ELEMENTS; ++n) { this[n] *= t; }
    } else {
      for (let n = 0; n < this.ELEMENTS && n < t.length; ++n) { this[n] *= t[n]; }
    }
    return this.check();
  }

  multiplyByScalar (t) {
    for (let n = 0; n < this.ELEMENTS; ++n) { this[n] *= t; }
    return this.check();
  }

  check () {
    if (et.debug && !this.validate()) { throw new Error('math.gl: '.concat(this.constructor.name, " some fields set to invalid numbers'")); }
    return this;
  }

  validate () {
    let t = this.length === this.ELEMENTS;
    for (let n = 0; n < this.ELEMENTS; ++n) { t = t && Number.isFinite(this[n]); }
    return t;
  }

  sub (t) {
    return this.subtract(t);
  }

  setScalar (t) {
    for (let n = 0; n < this.ELEMENTS; ++n) { this[n] = t; }
    return this.check();
  }

  addScalar (t) {
    for (let n = 0; n < this.ELEMENTS; ++n) { this[n] += t; }
    return this.check();
  }

  subScalar (t) {
    return this.addScalar(-t);
  }

  multiplyScalar (t) {
    for (let n = 0; n < this.ELEMENTS; ++n) { this[n] *= t; }
    return this.check();
  }

  divideScalar (t) {
    return this.multiplyByScalar(1 / t);
  }

  clampScalar (t, n) {
    for (let s = 0; s < this.ELEMENTS; ++s) { this[s] = Math.min(Math.max(this[s], t), n); }
    return this.check();
  }

  get elements () {
    return this;
  }
}
function yh (e, t) {
  if (e.length !== t) { return !1; }
  for (let n = 0; n < e.length; ++n) {
    if (!Number.isFinite(e[n])) { return !1; }
  }
  return !0;
}
function U (e) {
  if (!Number.isFinite(e)) { throw new Error('Invalid number '.concat(JSON.stringify(e))); }
  return e;
}
function Oe (e, t, n = '') {
  if (et.debug && !yh(e, t)) { throw new Error('math.gl: '.concat(n, " some fields set to invalid numbers'")); }
  return e;
}
function j (e, t) {
  if (!e) { throw new Error('math.gl assertion '.concat(t)); }
}
class Br extends yr {
  get x () {
    return this[0];
  }

  set x (t) {
    this[0] = U(t);
  }

  get y () {
    return this[1];
  }

  set y (t) {
    this[1] = U(t);
  }

  len () {
    return Math.sqrt(this.lengthSquared());
  }

  magnitude () {
    return this.len();
  }

  lengthSquared () {
    let t = 0;
    for (let n = 0; n < this.ELEMENTS; ++n) { t += this[n] * this[n]; }
    return t;
  }

  magnitudeSquared () {
    return this.lengthSquared();
  }

  distance (t) {
    return Math.sqrt(this.distanceSquared(t));
  }

  distanceSquared (t) {
    let n = 0;
    for (let s = 0; s < this.ELEMENTS; ++s) {
      const r = this[s] - t[s];
      n += r * r;
    }
    return U(n);
  }

  dot (t) {
    let n = 0;
    for (let s = 0; s < this.ELEMENTS; ++s) { n += this[s] * t[s]; }
    return U(n);
  }

  normalize () {
    const t = this.magnitude();
    if (t !== 0) {
      for (let n = 0; n < this.ELEMENTS; ++n) { this[n] /= t; }
    }
    return this.check();
  }

  multiply (...t) {
    for (const n of t) {
      for (let s = 0; s < this.ELEMENTS; ++s) { this[s] *= n[s]; }
    }
    return this.check();
  }

  divide (...t) {
    for (const n of t) {
      for (let s = 0; s < this.ELEMENTS; ++s) { this[s] /= n[s]; }
    }
    return this.check();
  }

  lengthSq () {
    return this.lengthSquared();
  }

  distanceTo (t) {
    return this.distance(t);
  }

  distanceToSquared (t) {
    return this.distanceSquared(t);
  }

  getComponent (t) {
    return j(t >= 0 && t < this.ELEMENTS, 'index is out of range'), U(this[t]);
  }

  setComponent (t, n) {
    return j(t >= 0 && t < this.ELEMENTS, 'index is out of range'), this[t] = n, this.check();
  }

  addVectors (t, n) {
    return this.copy(t).add(n);
  }

  subVectors (t, n) {
    return this.copy(t).subtract(n);
  }

  multiplyVectors (t, n) {
    return this.copy(t).multiply(n);
  }

  addScaledVector (t, n) {
    return this.add(new this.constructor(t).multiplyScalar(n));
  }
}
const Fe = 1e-6;
const It = typeof Float32Array < 'u' ? Float32Array : Array;
function Bh () {
  const e = new It(2);
  return It != Float32Array && (e[0] = 0, e[1] = 0), e;
}
function Ch (e, t, n) {
  const s = t[0]; const r = t[1];
  return e[0] = n[0] * s + n[2] * r, e[1] = n[1] * s + n[3] * r, e;
}
function Eh (e, t, n) {
  const s = t[0]; const r = t[1];
  return e[0] = n[0] * s + n[2] * r + n[4], e[1] = n[1] * s + n[3] * r + n[5], e;
}
function pa (e, t, n) {
  const s = t[0]; const r = t[1];
  return e[0] = n[0] * s + n[3] * r + n[6], e[1] = n[1] * s + n[4] * r + n[7], e;
}
function ya (e, t, n) {
  const s = t[0]; const r = t[1];
  return e[0] = n[0] * s + n[4] * r + n[12], e[1] = n[1] * s + n[5] * r + n[13], e;
}
(function () {
  const e = Bh();
  return function (t, n, s, r, i, o) {
    let a, c;
    for (n || (n = 2), s || (s = 0), r ? c = Math.min(r * n + s, t.length) : c = t.length, a = s; a < c; a += n) { e[0] = t[a], e[1] = t[a + 1], i(e, e, o), t[a] = e[0], t[a + 1] = e[1]; }
    return t;
  };
})();
function Ba (e, t, n) {
  const s = t[0]; const r = t[1]; const i = n[3] * s + n[7] * r || 1;
  return e[0] = (n[0] * s + n[4] * r) / i, e[1] = (n[1] * s + n[5] * r) / i, e;
}
function Ca (e, t, n) {
  const s = t[0]; const r = t[1]; const i = t[2]; const o = n[3] * s + n[7] * r + n[11] * i || 1;
  return e[0] = (n[0] * s + n[4] * r + n[8] * i) / o, e[1] = (n[1] * s + n[5] * r + n[9] * i) / o, e[2] = (n[2] * s + n[6] * r + n[10] * i) / o, e;
}
function Th (e, t, n) {
  const s = t[0]; const r = t[1];
  return e[0] = n[0] * s + n[2] * r, e[1] = n[1] * s + n[3] * r, e[2] = t[2], e;
}
function bh (e, t, n) {
  const s = t[0]; const r = t[1];
  return e[0] = n[0] * s + n[2] * r, e[1] = n[1] * s + n[3] * r, e[2] = t[2], e[3] = t[3], e;
}
function Ea (e, t, n) {
  const s = t[0]; const r = t[1]; const i = t[2];
  return e[0] = n[0] * s + n[3] * r + n[6] * i, e[1] = n[1] * s + n[4] * r + n[7] * i, e[2] = n[2] * s + n[5] * r + n[8] * i, e[3] = t[3], e;
}
class Wn extends Br {
  constructor (t = 0, n = 0) {
    super(2), ee(t) && arguments.length === 1 ? this.copy(t) : (et.debug && (U(t), U(n)), this[0] = t, this[1] = n);
  }

  set (t, n) {
    return this[0] = t, this[1] = n, this.check();
  }

  copy (t) {
    return this[0] = t[0], this[1] = t[1], this.check();
  }

  fromObject (t) {
    return et.debug && (U(t.x), U(t.y)), this[0] = t.x, this[1] = t.y, this.check();
  }

  toObject (t) {
    return t.x = this[0], t.y = this[1], t;
  }

  get ELEMENTS () {
    return 2;
  }

  horizontalAngle () {
    return Math.atan2(this.y, this.x);
  }

  verticalAngle () {
    return Math.atan2(this.x, this.y);
  }

  transform (t) {
    return this.transformAsPoint(t);
  }

  transformAsPoint (t) {
    return ya(this, this, t), this.check();
  }

  transformAsVector (t) {
    return Ba(this, this, t), this.check();
  }

  transformByMatrix3 (t) {
    return pa(this, this, t), this.check();
  }

  transformByMatrix2x3 (t) {
    return Eh(this, this, t), this.check();
  }

  transformByMatrix2 (t) {
    return Ch(this, this, t), this.check();
  }
}
function Ta () {
  const e = new It(3);
  return It != Float32Array && (e[0] = 0, e[1] = 0, e[2] = 0), e;
}
function ba (e) {
  const t = e[0]; const n = e[1]; const s = e[2];
  return Math.sqrt(t * t + n * n + s * s);
}
function fi (e, t, n) {
  const s = new It(3);
  return s[0] = e, s[1] = t, s[2] = n, s;
}
function _h (e, t) {
  const n = t[0]; const s = t[1]; const r = t[2];
  let i = n * n + s * s + r * r;
  return i > 0 && (i = 1 / Math.sqrt(i)), e[0] = t[0] * i, e[1] = t[1] * i, e[2] = t[2] * i, e;
}
function Cr (e, t) {
  return e[0] * t[0] + e[1] * t[1] + e[2] * t[2];
}
function Tn (e, t, n) {
  const s = t[0]; const r = t[1]; const i = t[2]; const o = n[0]; const a = n[1]; const c = n[2];
  return e[0] = r * c - i * a, e[1] = i * o - s * c, e[2] = s * a - r * o, e;
}
function Er (e, t, n) {
  const s = t[0]; const r = t[1]; const i = t[2];
  let o = n[3] * s + n[7] * r + n[11] * i + n[15];
  return o = o || 1, e[0] = (n[0] * s + n[4] * r + n[8] * i + n[12]) / o, e[1] = (n[1] * s + n[5] * r + n[9] * i + n[13]) / o, e[2] = (n[2] * s + n[6] * r + n[10] * i + n[14]) / o, e;
}
function _a (e, t, n) {
  const s = t[0]; const r = t[1]; const i = t[2];
  return e[0] = s * n[0] + r * n[3] + i * n[6], e[1] = s * n[1] + r * n[4] + i * n[7], e[2] = s * n[2] + r * n[5] + i * n[8], e;
}
function wa (e, t, n) {
  const s = n[0]; const r = n[1]; const i = n[2]; const o = n[3]; const a = t[0]; const c = t[1]; const u = t[2];
  let l = r * u - i * c; let h = i * a - s * u; let f = s * c - r * a; let d = r * f - i * h; let m = i * l - s * f; let g = s * h - r * l;
  const y = o * 2;
  return l *= y, h *= y, f *= y, d *= 2, m *= 2, g *= 2, e[0] = a + l + d, e[1] = c + h + m, e[2] = u + f + g, e;
}
function wh (e, t, n, s) {
  const r = []; const i = [];
  return r[0] = t[0] - n[0], r[1] = t[1] - n[1], r[2] = t[2] - n[2], i[0] = r[0], i[1] = r[1] * Math.cos(s) - r[2] * Math.sin(s), i[2] = r[1] * Math.sin(s) + r[2] * Math.cos(s), e[0] = i[0] + n[0], e[1] = i[1] + n[1], e[2] = i[2] + n[2], e;
}
function Rh (e, t, n, s) {
  const r = []; const i = [];
  return r[0] = t[0] - n[0], r[1] = t[1] - n[1], r[2] = t[2] - n[2], i[0] = r[2] * Math.sin(s) + r[0] * Math.cos(s), i[1] = r[1], i[2] = r[2] * Math.cos(s) - r[0] * Math.sin(s), e[0] = i[0] + n[0], e[1] = i[1] + n[1], e[2] = i[2] + n[2], e;
}
function Mh (e, t, n, s) {
  const r = []; const i = [];
  return r[0] = t[0] - n[0], r[1] = t[1] - n[1], r[2] = t[2] - n[2], i[0] = r[0] * Math.cos(s) - r[1] * Math.sin(s), i[1] = r[0] * Math.sin(s) + r[1] * Math.cos(s), i[2] = r[2], e[0] = i[0] + n[0], e[1] = i[1] + n[1], e[2] = i[2] + n[2], e;
}
function Sh (e, t) {
  const n = e[0]; const s = e[1]; const r = e[2]; const i = t[0]; const o = t[1]; const a = t[2]; const c = Math.sqrt((n * n + s * s + r * r) * (i * i + o * o + a * a)); const u = c && Cr(e, t) / c;
  return Math.acos(Math.min(Math.max(u, -1), 1));
}
const Ih = ba;
(function () {
  const e = Ta();
  return function (t, n, s, r, i, o) {
    let a, c;
    for (n || (n = 3), s || (s = 0), r ? c = Math.min(r * n + s, t.length) : c = t.length, a = s; a < c; a += n) { e[0] = t[a], e[1] = t[a + 1], e[2] = t[a + 2], i(e, e, o), t[a] = e[0], t[a + 1] = e[1], t[a + 2] = e[2]; }
    return t;
  };
})();
const fs = [0, 0, 0];
let tn;
class A extends Br {
  static get ZERO () {
    return tn || (tn = new A(0, 0, 0), Object.freeze(tn)), tn;
  }

  constructor (t = 0, n = 0, s = 0) {
    super(-0, -0, -0), arguments.length === 1 && ee(t) ? this.copy(t) : (et.debug && (U(t), U(n), U(s)), this[0] = t, this[1] = n, this[2] = s);
  }

  set (t, n, s) {
    return this[0] = t, this[1] = n, this[2] = s, this.check();
  }

  copy (t) {
    return this[0] = t[0], this[1] = t[1], this[2] = t[2], this.check();
  }

  fromObject (t) {
    return et.debug && (U(t.x), U(t.y), U(t.z)), this[0] = t.x, this[1] = t.y, this[2] = t.z, this.check();
  }

  toObject (t) {
    return t.x = this[0], t.y = this[1], t.z = this[2], t;
  }

  get ELEMENTS () {
    return 3;
  }

  get z () {
    return this[2];
  }

  set z (t) {
    this[2] = U(t);
  }

  angle (t) {
    return Sh(this, t);
  }

  cross (t) {
    return Tn(this, this, t), this.check();
  }

  rotateX ({
    radians: t,
    origin: n = fs
  }) {
    return wh(this, this, n, t), this.check();
  }

  rotateY ({
    radians: t,
    origin: n = fs
  }) {
    return Rh(this, this, n, t), this.check();
  }

  rotateZ ({
    radians: t,
    origin: n = fs
  }) {
    return Mh(this, this, n, t), this.check();
  }

  transform (t) {
    return this.transformAsPoint(t);
  }

  transformAsPoint (t) {
    return Er(this, this, t), this.check();
  }

  transformAsVector (t) {
    return Ca(this, this, t), this.check();
  }

  transformByMatrix3 (t) {
    return _a(this, this, t), this.check();
  }

  transformByMatrix2 (t) {
    return Th(this, this, t), this.check();
  }

  transformByQuaternion (t) {
    return wa(this, this, t), this.check();
  }
}
let en;
class Tr extends Br {
  static get ZERO () {
    return en || (en = new Tr(0, 0, 0, 0), Object.freeze(en)), en;
  }

  constructor (t = 0, n = 0, s = 0, r = 0) {
    super(-0, -0, -0, -0), ee(t) && arguments.length === 1 ? this.copy(t) : (et.debug && (U(t), U(n), U(s), U(r)), this[0] = t, this[1] = n, this[2] = s, this[3] = r);
  }

  set (t, n, s, r) {
    return this[0] = t, this[1] = n, this[2] = s, this[3] = r, this.check();
  }

  copy (t) {
    return this[0] = t[0], this[1] = t[1], this[2] = t[2], this[3] = t[3], this.check();
  }

  fromObject (t) {
    return et.debug && (U(t.x), U(t.y), U(t.z), U(t.w)), this[0] = t.x, this[1] = t.y, this[2] = t.z, this[3] = t.w, this;
  }

  toObject (t) {
    return t.x = this[0], t.y = this[1], t.z = this[2], t.w = this[3], t;
  }

  get ELEMENTS () {
    return 4;
  }

  get z () {
    return this[2];
  }

  set z (t) {
    this[2] = U(t);
  }

  get w () {
    return this[3];
  }

  set w (t) {
    this[3] = U(t);
  }

  transform (t) {
    return Er(this, this, t), this.check();
  }

  transformByMatrix3 (t) {
    return Ea(this, this, t), this.check();
  }

  transformByMatrix2 (t) {
    return bh(this, this, t), this.check();
  }

  transformByQuaternion (t) {
    return wa(this, this, t), this.check();
  }

  applyMatrix4 (t) {
    return t.transform(this, this), this;
  }
}
class Ra extends yr {
  toString () {
    let t = '[';
    if (et.printRowMajor) {
      t += 'row-major:';
      for (let n = 0; n < this.RANK; ++n) {
        for (let s = 0; s < this.RANK; ++s) { t += ' '.concat(this[s * this.RANK + n]); }
      }
    } else {
      t += 'column-major:';
      for (let n = 0; n < this.ELEMENTS; ++n) { t += ' '.concat(this[n]); }
    }
    return t += ']', t;
  }

  getElementIndex (t, n) {
    return n * this.RANK + t;
  }

  getElement (t, n) {
    return this[n * this.RANK + t];
  }

  setElement (t, n, s) {
    return this[n * this.RANK + t] = U(s), this;
  }

  getColumn (t, n = new Array(this.RANK).fill(-0)) {
    const s = t * this.RANK;
    for (let r = 0; r < this.RANK; ++r) { n[r] = this[s + r]; }
    return n;
  }

  setColumn (t, n) {
    const s = t * this.RANK;
    for (let r = 0; r < this.RANK; ++r) { this[s + r] = n[r]; }
    return this;
  }
}
function xh () {
  const e = new It(9);
  return It != Float32Array && (e[1] = 0, e[2] = 0, e[3] = 0, e[5] = 0, e[6] = 0, e[7] = 0), e[0] = 1, e[4] = 1, e[8] = 1, e;
}
function vh (e, t) {
  if (e === t) {
    const n = t[1]; const s = t[2]; const r = t[5];
    e[1] = t[3], e[2] = t[6], e[3] = n, e[5] = t[7], e[6] = s, e[7] = r;
  } else { e[0] = t[0], e[1] = t[3], e[2] = t[6], e[3] = t[1], e[4] = t[4], e[5] = t[7], e[6] = t[2], e[7] = t[5], e[8] = t[8]; }
  return e;
}
function Oh (e, t) {
  const n = t[0]; const s = t[1]; const r = t[2]; const i = t[3]; const o = t[4]; const a = t[5]; const c = t[6]; const u = t[7]; const l = t[8]; const h = l * o - a * u; const f = -l * i + a * c; const d = u * i - o * c;
  let m = n * h + s * f + r * d;
  return m ? (m = 1 / m, e[0] = h * m, e[1] = (-l * s + r * u) * m, e[2] = (a * s - r * o) * m, e[3] = f * m, e[4] = (l * n - r * c) * m, e[5] = (-a * n + r * i) * m, e[6] = d * m, e[7] = (-u * n + s * c) * m, e[8] = (o * n - s * i) * m, e) : null;
}
function Fh (e) {
  const t = e[0]; const n = e[1]; const s = e[2]; const r = e[3]; const i = e[4]; const o = e[5]; const a = e[6]; const c = e[7]; const u = e[8];
  return t * (u * i - o * c) + n * (-u * r + o * a) + s * (c * r - i * a);
}
function di (e, t, n) {
  const s = t[0]; const r = t[1]; const i = t[2]; const o = t[3]; const a = t[4]; const c = t[5]; const u = t[6]; const l = t[7]; const h = t[8]; const f = n[0]; const d = n[1]; const m = n[2]; const g = n[3]; const y = n[4]; const E = n[5]; const R = n[6]; const B = n[7]; const C = n[8];
  return e[0] = f * s + d * o + m * u, e[1] = f * r + d * a + m * l, e[2] = f * i + d * c + m * h, e[3] = g * s + y * o + E * u, e[4] = g * r + y * a + E * l, e[5] = g * i + y * c + E * h, e[6] = R * s + B * o + C * u, e[7] = R * r + B * a + C * l, e[8] = R * i + B * c + C * h, e;
}
function Dh (e, t, n) {
  const s = t[0]; const r = t[1]; const i = t[2]; const o = t[3]; const a = t[4]; const c = t[5]; const u = t[6]; const l = t[7]; const h = t[8]; const f = n[0]; const d = n[1];
  return e[0] = s, e[1] = r, e[2] = i, e[3] = o, e[4] = a, e[5] = c, e[6] = f * s + d * o + u, e[7] = f * r + d * a + l, e[8] = f * i + d * c + h, e;
}
function Lh (e, t, n) {
  const s = t[0]; const r = t[1]; const i = t[2]; const o = t[3]; const a = t[4]; const c = t[5]; const u = t[6]; const l = t[7]; const h = t[8]; const f = Math.sin(n); const d = Math.cos(n);
  return e[0] = d * s + f * o, e[1] = d * r + f * a, e[2] = d * i + f * c, e[3] = d * o - f * s, e[4] = d * a - f * r, e[5] = d * c - f * i, e[6] = u, e[7] = l, e[8] = h, e;
}
function mi (e, t, n) {
  const s = n[0]; const r = n[1];
  return e[0] = s * t[0], e[1] = s * t[1], e[2] = s * t[2], e[3] = r * t[3], e[4] = r * t[4], e[5] = r * t[5], e[6] = t[6], e[7] = t[7], e[8] = t[8], e;
}
function Ph (e, t) {
  const n = t[0]; const s = t[1]; const r = t[2]; const i = t[3]; const o = n + n; const a = s + s; const c = r + r; const u = n * o; const l = s * o; const h = s * a; const f = r * o; const d = r * a; const m = r * c; const g = i * o; const y = i * a; const E = i * c;
  return e[0] = 1 - h - m, e[3] = l - E, e[6] = f + y, e[1] = l + E, e[4] = 1 - u - m, e[7] = d - g, e[2] = f - y, e[5] = d + g, e[8] = 1 - u - h, e;
}
let ks;
(function (e) {
  e[e.COL0ROW0 = 0] = 'COL0ROW0', e[e.COL0ROW1 = 1] = 'COL0ROW1', e[e.COL0ROW2 = 2] = 'COL0ROW2', e[e.COL1ROW0 = 3] = 'COL1ROW0', e[e.COL1ROW1 = 4] = 'COL1ROW1', e[e.COL1ROW2 = 5] = 'COL1ROW2', e[e.COL2ROW0 = 6] = 'COL2ROW0', e[e.COL2ROW1 = 7] = 'COL2ROW1', e[e.COL2ROW2 = 8] = 'COL2ROW2';
})(ks || (ks = {}));
const Gh = Object.freeze([1, 0, 0, 0, 1, 0, 0, 0, 1]);
class X extends Ra {
  static get IDENTITY () {
    return Uh();
  }

  static get ZERO () {
    return Nh();
  }

  get ELEMENTS () {
    return 9;
  }

  get RANK () {
    return 3;
  }

  get INDICES () {
    return ks;
  }

  constructor (t, ...n) {
    super(-0, -0, -0, -0, -0, -0, -0, -0, -0), arguments.length === 1 && Array.isArray(t) ? this.copy(t) : n.length > 0 ? this.copy([t, ...n]) : this.identity();
  }

  copy (t) {
    return this[0] = t[0], this[1] = t[1], this[2] = t[2], this[3] = t[3], this[4] = t[4], this[5] = t[5], this[6] = t[6], this[7] = t[7], this[8] = t[8], this.check();
  }

  identity () {
    return this.copy(Gh);
  }

  fromObject (t) {
    return this.check();
  }

  fromQuaternion (t) {
    return Ph(this, t), this.check();
  }

  set (t, n, s, r, i, o, a, c, u) {
    return this[0] = t, this[1] = n, this[2] = s, this[3] = r, this[4] = i, this[5] = o, this[6] = a, this[7] = c, this[8] = u, this.check();
  }

  setRowMajor (t, n, s, r, i, o, a, c, u) {
    return this[0] = t, this[1] = r, this[2] = a, this[3] = n, this[4] = i, this[5] = c, this[6] = s, this[7] = o, this[8] = u, this.check();
  }

  determinant () {
    return Fh(this);
  }

  transpose () {
    return vh(this, this), this.check();
  }

  invert () {
    return Oh(this, this), this.check();
  }

  multiplyLeft (t) {
    return di(this, t, this), this.check();
  }

  multiplyRight (t) {
    return di(this, this, t), this.check();
  }

  rotate (t) {
    return Lh(this, this, t), this.check();
  }

  scale (t) {
    return Array.isArray(t) ? mi(this, this, t) : mi(this, this, [t, t]), this.check();
  }

  translate (t) {
    return Dh(this, this, t), this.check();
  }

  transform (t, n) {
    let s;
    switch (t.length) {
      case 2:
        s = pa(n || [-0, -0], t, this);
        break;
      case 3:
        s = _a(n || [-0, -0, -0], t, this);
        break;
      case 4:
        s = Ea(n || [-0, -0, -0, -0], t, this);
        break;
      default:
        throw new Error('Illegal vector');
    }
    return Oe(s, t.length), s;
  }

  transformVector (t, n) {
    return this.transform(t, n);
  }

  transformVector2 (t, n) {
    return this.transform(t, n);
  }

  transformVector3 (t, n) {
    return this.transform(t, n);
  }
}
let nn; let sn = null;
function Nh () {
  return nn || (nn = new X([0, 0, 0, 0, 0, 0, 0, 0, 0]), Object.freeze(nn)), nn;
}
function Uh () {
  return sn || (sn = new X(), Object.freeze(sn)), sn;
}
function Hh (e) {
  return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
}
function Jh (e, t) {
  if (e === t) {
    const n = t[1]; const s = t[2]; const r = t[3]; const i = t[6]; const o = t[7]; const a = t[11];
    e[1] = t[4], e[2] = t[8], e[3] = t[12], e[4] = n, e[6] = t[9], e[7] = t[13], e[8] = s, e[9] = i, e[11] = t[14], e[12] = r, e[13] = o, e[14] = a;
  } else { e[0] = t[0], e[1] = t[4], e[2] = t[8], e[3] = t[12], e[4] = t[1], e[5] = t[5], e[6] = t[9], e[7] = t[13], e[8] = t[2], e[9] = t[6], e[10] = t[10], e[11] = t[14], e[12] = t[3], e[13] = t[7], e[14] = t[11], e[15] = t[15]; }
  return e;
}
function Vh (e, t) {
  const n = t[0]; const s = t[1]; const r = t[2]; const i = t[3]; const o = t[4]; const a = t[5]; const c = t[6]; const u = t[7]; const l = t[8]; const h = t[9]; const f = t[10]; const d = t[11]; const m = t[12]; const g = t[13]; const y = t[14]; const E = t[15]; const R = n * a - s * o; const B = n * c - r * o; const C = n * u - i * o; const M = s * c - r * a; const b = s * u - i * a; const O = r * u - i * c; const F = l * g - h * m; const v = l * y - f * m; const L = l * E - d * m; const k = h * y - f * g; const q = h * E - d * g; const Y = f * E - d * y;
  let P = R * Y - B * q + C * k + M * L - b * v + O * F;
  return P ? (P = 1 / P, e[0] = (a * Y - c * q + u * k) * P, e[1] = (r * q - s * Y - i * k) * P, e[2] = (g * O - y * b + E * M) * P, e[3] = (f * b - h * O - d * M) * P, e[4] = (c * L - o * Y - u * v) * P, e[5] = (n * Y - r * L + i * v) * P, e[6] = (y * C - m * O - E * B) * P, e[7] = (l * O - f * C + d * B) * P, e[8] = (o * q - a * L + u * F) * P, e[9] = (s * L - n * q - i * F) * P, e[10] = (m * b - g * C + E * R) * P, e[11] = (h * C - l * b - d * R) * P, e[12] = (a * v - o * k - c * F) * P, e[13] = (n * k - s * v + r * F) * P, e[14] = (g * B - m * M - y * R) * P, e[15] = (l * M - h * B + f * R) * P, e) : null;
}
function jh (e) {
  const t = e[0]; const n = e[1]; const s = e[2]; const r = e[3]; const i = e[4]; const o = e[5]; const a = e[6]; const c = e[7]; const u = e[8]; const l = e[9]; const h = e[10]; const f = e[11]; const d = e[12]; const m = e[13]; const g = e[14]; const y = e[15]; const E = t * o - n * i; const R = t * a - s * i; const B = n * a - s * o; const C = u * m - l * d; const M = u * g - h * d; const b = l * g - h * m; const O = t * b - n * M + s * C; const F = i * b - o * M + a * C; const v = u * B - l * R + h * E; const L = d * B - m * R + g * E;
  return c * O - r * F + y * v - f * L;
}
function gi (e, t, n) {
  const s = t[0]; const r = t[1]; const i = t[2]; const o = t[3]; const a = t[4]; const c = t[5]; const u = t[6]; const l = t[7]; const h = t[8]; const f = t[9]; const d = t[10]; const m = t[11]; const g = t[12]; const y = t[13]; const E = t[14]; const R = t[15];
  let B = n[0]; let C = n[1]; let M = n[2]; let b = n[3];
  return e[0] = B * s + C * a + M * h + b * g, e[1] = B * r + C * c + M * f + b * y, e[2] = B * i + C * u + M * d + b * E, e[3] = B * o + C * l + M * m + b * R, B = n[4], C = n[5], M = n[6], b = n[7], e[4] = B * s + C * a + M * h + b * g, e[5] = B * r + C * c + M * f + b * y, e[6] = B * i + C * u + M * d + b * E, e[7] = B * o + C * l + M * m + b * R, B = n[8], C = n[9], M = n[10], b = n[11], e[8] = B * s + C * a + M * h + b * g, e[9] = B * r + C * c + M * f + b * y, e[10] = B * i + C * u + M * d + b * E, e[11] = B * o + C * l + M * m + b * R, B = n[12], C = n[13], M = n[14], b = n[15], e[12] = B * s + C * a + M * h + b * g, e[13] = B * r + C * c + M * f + b * y, e[14] = B * i + C * u + M * d + b * E, e[15] = B * o + C * l + M * m + b * R, e;
}
function kh (e, t, n) {
  const s = n[0]; const r = n[1]; const i = n[2];
  let o, a, c, u, l, h, f, d, m, g, y, E;
  return t === e ? (e[12] = t[0] * s + t[4] * r + t[8] * i + t[12], e[13] = t[1] * s + t[5] * r + t[9] * i + t[13], e[14] = t[2] * s + t[6] * r + t[10] * i + t[14], e[15] = t[3] * s + t[7] * r + t[11] * i + t[15]) : (o = t[0], a = t[1], c = t[2], u = t[3], l = t[4], h = t[5], f = t[6], d = t[7], m = t[8], g = t[9], y = t[10], E = t[11], e[0] = o, e[1] = a, e[2] = c, e[3] = u, e[4] = l, e[5] = h, e[6] = f, e[7] = d, e[8] = m, e[9] = g, e[10] = y, e[11] = E, e[12] = o * s + l * r + m * i + t[12], e[13] = a * s + h * r + g * i + t[13], e[14] = c * s + f * r + y * i + t[14], e[15] = u * s + d * r + E * i + t[15]), e;
}
function Kh (e, t, n) {
  const s = n[0]; const r = n[1]; const i = n[2];
  return e[0] = t[0] * s, e[1] = t[1] * s, e[2] = t[2] * s, e[3] = t[3] * s, e[4] = t[4] * r, e[5] = t[5] * r, e[6] = t[6] * r, e[7] = t[7] * r, e[8] = t[8] * i, e[9] = t[9] * i, e[10] = t[10] * i, e[11] = t[11] * i, e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15], e;
}
function zh (e, t, n, s) {
  let r = s[0]; let i = s[1]; let o = s[2]; let a = Math.sqrt(r * r + i * i + o * o); let c; let u; let l; let h; let f; let d; let m; let g; let y; let E; let R; let B; let C; let M; let b; let O; let F; let v; let L; let k; let q; let Y; let P; let ct;
  return a < Fe ? null : (a = 1 / a, r *= a, i *= a, o *= a, u = Math.sin(n), c = Math.cos(n), l = 1 - c, h = t[0], f = t[1], d = t[2], m = t[3], g = t[4], y = t[5], E = t[6], R = t[7], B = t[8], C = t[9], M = t[10], b = t[11], O = r * r * l + c, F = i * r * l + o * u, v = o * r * l - i * u, L = r * i * l - o * u, k = i * i * l + c, q = o * i * l + r * u, Y = r * o * l + i * u, P = i * o * l - r * u, ct = o * o * l + c, e[0] = h * O + g * F + B * v, e[1] = f * O + y * F + C * v, e[2] = d * O + E * F + M * v, e[3] = m * O + R * F + b * v, e[4] = h * L + g * k + B * q, e[5] = f * L + y * k + C * q, e[6] = d * L + E * k + M * q, e[7] = m * L + R * k + b * q, e[8] = h * Y + g * P + B * ct, e[9] = f * Y + y * P + C * ct, e[10] = d * Y + E * P + M * ct, e[11] = m * Y + R * P + b * ct, t !== e && (e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15]), e);
}
function Wh (e, t, n) {
  const s = Math.sin(n); const r = Math.cos(n); const i = t[4]; const o = t[5]; const a = t[6]; const c = t[7]; const u = t[8]; const l = t[9]; const h = t[10]; const f = t[11];
  return t !== e && (e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[4] = i * r + u * s, e[5] = o * r + l * s, e[6] = a * r + h * s, e[7] = c * r + f * s, e[8] = u * r - i * s, e[9] = l * r - o * s, e[10] = h * r - a * s, e[11] = f * r - c * s, e;
}
function Xh (e, t, n) {
  const s = Math.sin(n); const r = Math.cos(n); const i = t[0]; const o = t[1]; const a = t[2]; const c = t[3]; const u = t[8]; const l = t[9]; const h = t[10]; const f = t[11];
  return t !== e && (e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[0] = i * r - u * s, e[1] = o * r - l * s, e[2] = a * r - h * s, e[3] = c * r - f * s, e[8] = i * s + u * r, e[9] = o * s + l * r, e[10] = a * s + h * r, e[11] = c * s + f * r, e;
}
function Qh (e, t, n) {
  const s = Math.sin(n); const r = Math.cos(n); const i = t[0]; const o = t[1]; const a = t[2]; const c = t[3]; const u = t[4]; const l = t[5]; const h = t[6]; const f = t[7];
  return t !== e && (e[8] = t[8], e[9] = t[9], e[10] = t[10], e[11] = t[11], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[0] = i * r + u * s, e[1] = o * r + l * s, e[2] = a * r + h * s, e[3] = c * r + f * s, e[4] = u * r - i * s, e[5] = l * r - o * s, e[6] = h * r - a * s, e[7] = f * r - c * s, e;
}
function qh (e, t) {
  const n = t[0]; const s = t[1]; const r = t[2]; const i = t[4]; const o = t[5]; const a = t[6]; const c = t[8]; const u = t[9]; const l = t[10];
  return e[0] = Math.sqrt(n * n + s * s + r * r), e[1] = Math.sqrt(i * i + o * o + a * a), e[2] = Math.sqrt(c * c + u * u + l * l), e;
}
function Yh (e, t) {
  const n = t[0]; const s = t[1]; const r = t[2]; const i = t[3]; const o = n + n; const a = s + s; const c = r + r; const u = n * o; const l = s * o; const h = s * a; const f = r * o; const d = r * a; const m = r * c; const g = i * o; const y = i * a; const E = i * c;
  return e[0] = 1 - h - m, e[1] = l + E, e[2] = f - y, e[3] = 0, e[4] = l - E, e[5] = 1 - u - m, e[6] = d + g, e[7] = 0, e[8] = f + y, e[9] = d - g, e[10] = 1 - u - h, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
}
function $h (e, t, n, s, r, i, o) {
  const a = 1 / (n - t); const c = 1 / (r - s); const u = 1 / (i - o);
  return e[0] = i * 2 * a, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = i * 2 * c, e[6] = 0, e[7] = 0, e[8] = (n + t) * a, e[9] = (r + s) * c, e[10] = (o + i) * u, e[11] = -1, e[12] = 0, e[13] = 0, e[14] = o * i * 2 * u, e[15] = 0, e;
}
function Zh (e, t, n, s, r) {
  const i = 1 / Math.tan(t / 2);
  if (e[0] = i / n, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = i, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[11] = -1, e[12] = 0, e[13] = 0, e[15] = 0, r != null && r !== 1 / 0) {
    const o = 1 / (s - r);
    e[10] = (r + s) * o, e[14] = 2 * r * s * o;
  } else { e[10] = -1, e[14] = -2 * s; }
  return e;
}
const tf = Zh;
function ef (e, t, n, s, r, i, o) {
  const a = 1 / (t - n); const c = 1 / (s - r); const u = 1 / (i - o);
  return e[0] = -2 * a, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = -2 * c, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 2 * u, e[11] = 0, e[12] = (t + n) * a, e[13] = (r + s) * c, e[14] = (o + i) * u, e[15] = 1, e;
}
const nf = ef;
function sf (e, t, n, s) {
  let r, i, o, a, c, u, l, h, f, d;
  const m = t[0]; const g = t[1]; const y = t[2]; const E = s[0]; const R = s[1]; const B = s[2]; const C = n[0]; const M = n[1]; const b = n[2];
  return Math.abs(m - C) < Fe && Math.abs(g - M) < Fe && Math.abs(y - b) < Fe ? Hh(e) : (h = m - C, f = g - M, d = y - b, r = 1 / Math.sqrt(h * h + f * f + d * d), h *= r, f *= r, d *= r, i = R * d - B * f, o = B * h - E * d, a = E * f - R * h, r = Math.sqrt(i * i + o * o + a * a), r ? (r = 1 / r, i *= r, o *= r, a *= r) : (i = 0, o = 0, a = 0), c = f * a - d * o, u = d * i - h * a, l = h * o - f * i, r = Math.sqrt(c * c + u * u + l * l), r ? (r = 1 / r, c *= r, u *= r, l *= r) : (c = 0, u = 0, l = 0), e[0] = i, e[1] = c, e[2] = h, e[3] = 0, e[4] = o, e[5] = u, e[6] = f, e[7] = 0, e[8] = a, e[9] = l, e[10] = d, e[11] = 0, e[12] = -(i * m + o * g + a * y), e[13] = -(c * m + u * g + l * y), e[14] = -(h * m + f * g + d * y), e[15] = 1, e);
}
function rf () {
  const e = new It(4);
  return It != Float32Array && (e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 0), e;
}
function of (e, t, n) {
  return e[0] = t[0] + n[0], e[1] = t[1] + n[1], e[2] = t[2] + n[2], e[3] = t[3] + n[3], e;
}
function af (e, t, n) {
  return e[0] = t[0] * n, e[1] = t[1] * n, e[2] = t[2] * n, e[3] = t[3] * n, e;
}
function cf (e) {
  const t = e[0]; const n = e[1]; const s = e[2]; const r = e[3];
  return Math.sqrt(t * t + n * n + s * s + r * r);
}
function uf (e) {
  const t = e[0]; const n = e[1]; const s = e[2]; const r = e[3];
  return t * t + n * n + s * s + r * r;
}
function lf (e, t) {
  const n = t[0]; const s = t[1]; const r = t[2]; const i = t[3];
  let o = n * n + s * s + r * r + i * i;
  return o > 0 && (o = 1 / Math.sqrt(o)), e[0] = n * o, e[1] = s * o, e[2] = r * o, e[3] = i * o, e;
}
function hf (e, t) {
  return e[0] * t[0] + e[1] * t[1] + e[2] * t[2] + e[3] * t[3];
}
function ff (e, t, n, s) {
  const r = t[0]; const i = t[1]; const o = t[2]; const a = t[3];
  return e[0] = r + s * (n[0] - r), e[1] = i + s * (n[1] - i), e[2] = o + s * (n[2] - o), e[3] = a + s * (n[3] - a), e;
}
function df (e, t, n) {
  const s = t[0]; const r = t[1]; const i = t[2]; const o = t[3];
  return e[0] = n[0] * s + n[4] * r + n[8] * i + n[12] * o, e[1] = n[1] * s + n[5] * r + n[9] * i + n[13] * o, e[2] = n[2] * s + n[6] * r + n[10] * i + n[14] * o, e[3] = n[3] * s + n[7] * r + n[11] * i + n[15] * o, e;
}
function mf (e, t, n) {
  const s = t[0]; const r = t[1]; const i = t[2]; const o = n[0]; const a = n[1]; const c = n[2]; const u = n[3]; const l = u * s + a * i - c * r; const h = u * r + c * s - o * i; const f = u * i + o * r - a * s; const d = -o * s - a * r - c * i;
  return e[0] = l * u + d * -o + h * -c - f * -a, e[1] = h * u + d * -a + f * -o - l * -c, e[2] = f * u + d * -c + l * -a - h * -o, e[3] = t[3], e;
}
(function () {
  const e = rf();
  return function (t, n, s, r, i, o) {
    let a, c;
    for (n || (n = 4), s || (s = 0), r ? c = Math.min(r * n + s, t.length) : c = t.length, a = s; a < c; a += n) { e[0] = t[a], e[1] = t[a + 1], e[2] = t[a + 2], e[3] = t[a + 3], i(e, e, o), t[a] = e[0], t[a + 1] = e[1], t[a + 2] = e[2], t[a + 3] = e[3]; }
    return t;
  };
})();
let Ks;
(function (e) {
  e[e.COL0ROW0 = 0] = 'COL0ROW0', e[e.COL0ROW1 = 1] = 'COL0ROW1', e[e.COL0ROW2 = 2] = 'COL0ROW2', e[e.COL0ROW3 = 3] = 'COL0ROW3', e[e.COL1ROW0 = 4] = 'COL1ROW0', e[e.COL1ROW1 = 5] = 'COL1ROW1', e[e.COL1ROW2 = 6] = 'COL1ROW2', e[e.COL1ROW3 = 7] = 'COL1ROW3', e[e.COL2ROW0 = 8] = 'COL2ROW0', e[e.COL2ROW1 = 9] = 'COL2ROW1', e[e.COL2ROW2 = 10] = 'COL2ROW2', e[e.COL2ROW3 = 11] = 'COL2ROW3', e[e.COL3ROW0 = 12] = 'COL3ROW0', e[e.COL3ROW1 = 13] = 'COL3ROW1', e[e.COL3ROW2 = 14] = 'COL3ROW2', e[e.COL3ROW3 = 15] = 'COL3ROW3';
})(Ks || (Ks = {}));
const gf = 45 * Math.PI / 180; const Af = 1; const ds = 0.1; const ms = 500; const pf = Object.freeze([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
class V extends Ra {
  static get IDENTITY () {
    return Bf();
  }

  static get ZERO () {
    return yf();
  }

  get ELEMENTS () {
    return 16;
  }

  get RANK () {
    return 4;
  }

  get INDICES () {
    return Ks;
  }

  constructor (t) {
    super(-0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0), arguments.length === 1 && Array.isArray(t) ? this.copy(t) : this.identity();
  }

  copy (t) {
    return this[0] = t[0], this[1] = t[1], this[2] = t[2], this[3] = t[3], this[4] = t[4], this[5] = t[5], this[6] = t[6], this[7] = t[7], this[8] = t[8], this[9] = t[9], this[10] = t[10], this[11] = t[11], this[12] = t[12], this[13] = t[13], this[14] = t[14], this[15] = t[15], this.check();
  }

  set (t, n, s, r, i, o, a, c, u, l, h, f, d, m, g, y) {
    return this[0] = t, this[1] = n, this[2] = s, this[3] = r, this[4] = i, this[5] = o, this[6] = a, this[7] = c, this[8] = u, this[9] = l, this[10] = h, this[11] = f, this[12] = d, this[13] = m, this[14] = g, this[15] = y, this.check();
  }

  setRowMajor (t, n, s, r, i, o, a, c, u, l, h, f, d, m, g, y) {
    return this[0] = t, this[1] = i, this[2] = u, this[3] = d, this[4] = n, this[5] = o, this[6] = l, this[7] = m, this[8] = s, this[9] = a, this[10] = h, this[11] = g, this[12] = r, this[13] = c, this[14] = f, this[15] = y, this.check();
  }

  toRowMajor (t) {
    return t[0] = this[0], t[1] = this[4], t[2] = this[8], t[3] = this[12], t[4] = this[1], t[5] = this[5], t[6] = this[9], t[7] = this[13], t[8] = this[2], t[9] = this[6], t[10] = this[10], t[11] = this[14], t[12] = this[3], t[13] = this[7], t[14] = this[11], t[15] = this[15], t;
  }

  identity () {
    return this.copy(pf);
  }

  fromObject (t) {
    return this.check();
  }

  fromQuaternion (t) {
    return Yh(this, t), this.check();
  }

  frustum (t) {
    const {
      left: n,
      right: s,
      bottom: r,
      top: i,
      near: o = ds,
      far: a = ms
    } = t;
    return a === 1 / 0 ? Cf(this, n, s, r, i, o) : $h(this, n, s, r, i, o, a), this.check();
  }

  lookAt (t) {
    const {
      eye: n,
      center: s = [0, 0, 0],
      up: r = [0, 1, 0]
    } = t;
    return sf(this, n, s, r), this.check();
  }

  ortho (t) {
    const {
      left: n,
      right: s,
      bottom: r,
      top: i,
      near: o = ds,
      far: a = ms
    } = t;
    return nf(this, n, s, r, i, o, a), this.check();
  }

  orthographic (t) {
    const {
      fovy: n = gf,
      aspect: s = Af,
      focalDistance: r = 1,
      near: i = ds,
      far: o = ms
    } = t;
    Ai(n);
    const a = n / 2; const c = r * Math.tan(a); const u = c * s;
    return this.ortho({
      left: -u,
      right: u,
      bottom: -c,
      top: c,
      near: i,
      far: o
    });
  }

  perspective (t) {
    const {
      fovy: n = 45 * Math.PI / 180,
      aspect: s = 1,
      near: r = 0.1,
      far: i = 500
    } = t;
    return Ai(n), tf(this, n, s, r, i), this.check();
  }

  determinant () {
    return jh(this);
  }

  getScale (t = [-0, -0, -0]) {
    return t[0] = Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2]), t[1] = Math.sqrt(this[4] * this[4] + this[5] * this[5] + this[6] * this[6]), t[2] = Math.sqrt(this[8] * this[8] + this[9] * this[9] + this[10] * this[10]), t;
  }

  getTranslation (t = [-0, -0, -0]) {
    return t[0] = this[12], t[1] = this[13], t[2] = this[14], t;
  }

  getRotation (t, n) {
    t = t || [-0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0], n = n || [-0, -0, -0];
    const s = this.getScale(n); const r = 1 / s[0]; const i = 1 / s[1]; const o = 1 / s[2];
    return t[0] = this[0] * r, t[1] = this[1] * i, t[2] = this[2] * o, t[3] = 0, t[4] = this[4] * r, t[5] = this[5] * i, t[6] = this[6] * o, t[7] = 0, t[8] = this[8] * r, t[9] = this[9] * i, t[10] = this[10] * o, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
  }

  getRotationMatrix3 (t, n) {
    t = t || [-0, -0, -0, -0, -0, -0, -0, -0, -0], n = n || [-0, -0, -0];
    const s = this.getScale(n); const r = 1 / s[0]; const i = 1 / s[1]; const o = 1 / s[2];
    return t[0] = this[0] * r, t[1] = this[1] * i, t[2] = this[2] * o, t[3] = this[4] * r, t[4] = this[5] * i, t[5] = this[6] * o, t[6] = this[8] * r, t[7] = this[9] * i, t[8] = this[10] * o, t;
  }

  transpose () {
    return Jh(this, this), this.check();
  }

  invert () {
    return Vh(this, this), this.check();
  }

  multiplyLeft (t) {
    return gi(this, t, this), this.check();
  }

  multiplyRight (t) {
    return gi(this, this, t), this.check();
  }

  rotateX (t) {
    return Wh(this, this, t), this.check();
  }

  rotateY (t) {
    return Xh(this, this, t), this.check();
  }

  rotateZ (t) {
    return Qh(this, this, t), this.check();
  }

  rotateXYZ (t) {
    return this.rotateX(t[0]).rotateY(t[1]).rotateZ(t[2]);
  }

  rotateAxis (t, n) {
    return zh(this, this, t, n), this.check();
  }

  scale (t) {
    return Kh(this, this, Array.isArray(t) ? t : [t, t, t]), this.check();
  }

  translate (t) {
    return kh(this, this, t), this.check();
  }

  transform (t, n) {
    return t.length === 4 ? (n = df(n || [-0, -0, -0, -0], t, this), Oe(n, 4), n) : this.transformAsPoint(t, n);
  }

  transformAsPoint (t, n) {
    const {
      length: s
    } = t;
    let r;
    switch (s) {
      case 2:
        r = ya(n || [-0, -0], t, this);
        break;
      case 3:
        r = Er(n || [-0, -0, -0], t, this);
        break;
      default:
        throw new Error('Illegal vector');
    }
    return Oe(r, t.length), r;
  }

  transformAsVector (t, n) {
    let s;
    switch (t.length) {
      case 2:
        s = Ba(n || [-0, -0], t, this);
        break;
      case 3:
        s = Ca(n || [-0, -0, -0], t, this);
        break;
      default:
        throw new Error('Illegal vector');
    }
    return Oe(s, t.length), s;
  }

  transformPoint (t, n) {
    return this.transformAsPoint(t, n);
  }

  transformVector (t, n) {
    return this.transformAsPoint(t, n);
  }

  transformDirection (t, n) {
    return this.transformAsVector(t, n);
  }

  makeRotationX (t) {
    return this.identity().rotateX(t);
  }

  makeTranslation (t, n, s) {
    return this.identity().translate([t, n, s]);
  }
}
let rn, on;
function yf () {
  return rn || (rn = new V([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), Object.freeze(rn)), rn;
}
function Bf () {
  return on || (on = new V(), Object.freeze(on)), on;
}
function Ai (e) {
  if (e > Math.PI * 2) { throw Error('expected radians'); }
}
function Cf (e, t, n, s, r, i) {
  const o = 2 * i / (n - t); const a = 2 * i / (r - s); const c = (n + t) / (n - t); const u = (r + s) / (r - s); const l = -1; const h = -1; const f = -2 * i;
  return e[0] = o, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = a, e[6] = 0, e[7] = 0, e[8] = c, e[9] = u, e[10] = l, e[11] = h, e[12] = 0, e[13] = 0, e[14] = f, e[15] = 0, e;
}
function pi () {
  const e = new It(4);
  return It != Float32Array && (e[0] = 0, e[1] = 0, e[2] = 0), e[3] = 1, e;
}
function Ef (e) {
  return e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 1, e;
}
function Ma (e, t, n) {
  n = n * 0.5;
  const s = Math.sin(n);
  return e[0] = s * t[0], e[1] = s * t[1], e[2] = s * t[2], e[3] = Math.cos(n), e;
}
function yi (e, t, n) {
  const s = t[0]; const r = t[1]; const i = t[2]; const o = t[3]; const a = n[0]; const c = n[1]; const u = n[2]; const l = n[3];
  return e[0] = s * l + o * a + r * u - i * c, e[1] = r * l + o * c + i * a - s * u, e[2] = i * l + o * u + s * c - r * a, e[3] = o * l - s * a - r * c - i * u, e;
}
function Tf (e, t, n) {
  n *= 0.5;
  const s = t[0]; const r = t[1]; const i = t[2]; const o = t[3]; const a = Math.sin(n); const c = Math.cos(n);
  return e[0] = s * c + o * a, e[1] = r * c + i * a, e[2] = i * c - r * a, e[3] = o * c - s * a, e;
}
function bf (e, t, n) {
  n *= 0.5;
  const s = t[0]; const r = t[1]; const i = t[2]; const o = t[3]; const a = Math.sin(n); const c = Math.cos(n);
  return e[0] = s * c - i * a, e[1] = r * c + o * a, e[2] = i * c + s * a, e[3] = o * c - r * a, e;
}
function _f (e, t, n) {
  n *= 0.5;
  const s = t[0]; const r = t[1]; const i = t[2]; const o = t[3]; const a = Math.sin(n); const c = Math.cos(n);
  return e[0] = s * c + r * a, e[1] = r * c - s * a, e[2] = i * c + o * a, e[3] = o * c - i * a, e;
}
function wf (e, t) {
  const n = t[0]; const s = t[1]; const r = t[2];
  return e[0] = n, e[1] = s, e[2] = r, e[3] = Math.sqrt(Math.abs(1 - n * n - s * s - r * r)), e;
}
function bn (e, t, n, s) {
  const r = t[0]; const i = t[1]; const o = t[2]; const a = t[3];
  let c = n[0]; let u = n[1]; let l = n[2]; let h = n[3]; let f; let d; let m; let g; let y;
  return f = r * c + i * u + o * l + a * h, f < 0 && (f = -f, c = -c, u = -u, l = -l, h = -h), 1 - f > Fe ? (d = Math.acos(f), y = Math.sin(d), m = Math.sin((1 - s) * d) / y, g = Math.sin(s * d) / y) : (m = 1 - s, g = s), e[0] = m * r + g * c, e[1] = m * i + g * u, e[2] = m * o + g * l, e[3] = m * a + g * h, e;
}
function Rf (e, t) {
  const n = t[0]; const s = t[1]; const r = t[2]; const i = t[3]; const o = n * n + s * s + r * r + i * i; const a = o ? 1 / o : 0;
  return e[0] = -n * a, e[1] = -s * a, e[2] = -r * a, e[3] = i * a, e;
}
function Mf (e, t) {
  return e[0] = -t[0], e[1] = -t[1], e[2] = -t[2], e[3] = t[3], e;
}
function Sa (e, t) {
  const n = t[0] + t[4] + t[8];
  let s;
  if (n > 0) { s = Math.sqrt(n + 1), e[3] = 0.5 * s, s = 0.5 / s, e[0] = (t[5] - t[7]) * s, e[1] = (t[6] - t[2]) * s, e[2] = (t[1] - t[3]) * s; } else {
    let r = 0;
    t[4] > t[0] && (r = 1), t[8] > t[r * 3 + r] && (r = 2);
    const i = (r + 1) % 3; const o = (r + 2) % 3;
    s = Math.sqrt(t[r * 3 + r] - t[i * 3 + i] - t[o * 3 + o] + 1), e[r] = 0.5 * s, s = 0.5 / s, e[3] = (t[i * 3 + o] - t[o * 3 + i]) * s, e[i] = (t[i * 3 + r] + t[r * 3 + i]) * s, e[o] = (t[o * 3 + r] + t[r * 3 + o]) * s;
  }
  return e;
}
const Sf = of; const If = af; const xf = hf; const vf = ff; const Of = cf; const Ff = uf; const Ia = lf; const Df = (function () {
  const e = Ta(); const t = fi(1, 0, 0); const n = fi(0, 1, 0);
  return function (s, r, i) {
    const o = Cr(r, i);
    return o < -0.999999 ? (Tn(e, t, r), Ih(e) < 1e-6 && Tn(e, n, r), _h(e, e), Ma(s, e, Math.PI), s) : o > 0.999999 ? (s[0] = 0, s[1] = 0, s[2] = 0, s[3] = 1, s) : (Tn(e, r, i), s[0] = e[0], s[1] = e[1], s[2] = e[2], s[3] = 1 + o, Ia(s, s));
  };
}());
(function () {
  const e = pi(); const t = pi();
  return function (n, s, r, i, o, a) {
    return bn(e, s, o, a), bn(t, r, i, a), bn(n, e, t, 2 * a * (1 - a)), n;
  };
})();
(function () {
  const e = xh();
  return function (t, n, s, r) {
    return e[0] = s[0], e[3] = s[1], e[6] = s[2], e[1] = r[0], e[4] = r[1], e[7] = r[2], e[2] = -n[0], e[5] = -n[1], e[8] = -n[2], Ia(t, Sa(t, e));
  };
})();
const Lf = [0, 0, 0, 1];
class On extends yr {
  constructor (t = 0, n = 0, s = 0, r = 1) {
    super(-0, -0, -0, -0), Array.isArray(t) && arguments.length === 1 ? this.copy(t) : this.set(t, n, s, r);
  }

  copy (t) {
    return this[0] = t[0], this[1] = t[1], this[2] = t[2], this[3] = t[3], this.check();
  }

  set (t, n, s, r) {
    return this[0] = t, this[1] = n, this[2] = s, this[3] = r, this.check();
  }

  fromObject (t) {
    return this[0] = t.x, this[1] = t.y, this[2] = t.z, this[3] = t.w, this.check();
  }

  fromMatrix3 (t) {
    return Sa(this, t), this.check();
  }

  fromAxisRotation (t, n) {
    return Ma(this, t, n), this.check();
  }

  identity () {
    return Ef(this), this.check();
  }

  setAxisAngle (t, n) {
    return this.fromAxisRotation(t, n);
  }

  get ELEMENTS () {
    return 4;
  }

  get x () {
    return this[0];
  }

  set x (t) {
    this[0] = U(t);
  }

  get y () {
    return this[1];
  }

  set y (t) {
    this[1] = U(t);
  }

  get z () {
    return this[2];
  }

  set z (t) {
    this[2] = U(t);
  }

  get w () {
    return this[3];
  }

  set w (t) {
    this[3] = U(t);
  }

  len () {
    return Of(this);
  }

  lengthSquared () {
    return Ff(this);
  }

  dot (t) {
    return xf(this, t);
  }

  rotationTo (t, n) {
    return Df(this, t, n), this.check();
  }

  add (t) {
    return Sf(this, this, t), this.check();
  }

  calculateW () {
    return wf(this, this), this.check();
  }

  conjugate () {
    return Mf(this, this), this.check();
  }

  invert () {
    return Rf(this, this), this.check();
  }

  lerp (t, n, s) {
    return s === void 0 ? this.lerp(this, t, n) : (vf(this, t, n, s), this.check());
  }

  multiplyRight (t) {
    return yi(this, this, t), this.check();
  }

  multiplyLeft (t) {
    return yi(this, t, this), this.check();
  }

  normalize () {
    const t = this.len(); const n = t > 0 ? 1 / t : 0;
    return this[0] = this[0] * n, this[1] = this[1] * n, this[2] = this[2] * n, this[3] = this[3] * n, t === 0 && (this[3] = 1), this.check();
  }

  rotateX (t) {
    return Tf(this, this, t), this.check();
  }

  rotateY (t) {
    return bf(this, this, t), this.check();
  }

  rotateZ (t) {
    return _f(this, this, t), this.check();
  }

  scale (t) {
    return If(this, this, t), this.check();
  }

  slerp (t, n, s) {
    let r, i, o;
    switch (arguments.length) {
      case 1:
        ({
          start: r = Lf,
          target: i,
          ratio: o
        } = t);
        break;
      case 2:
        r = this, i = t, o = n;
        break;
      default:
        r = t, i = n, o = s;
    }
    return bn(this, r, i, o), this.check();
  }

  transformVector4 (t, n = new Tr()) {
    return mf(n, t, this), Oe(n, 4);
  }

  lengthSq () {
    return this.lengthSquared();
  }

  setFromAxisAngle (t, n) {
    return this.setAxisAngle(t, n);
  }

  premultiply (t) {
    return this.multiplyLeft(t);
  }

  multiply (t) {
    return this.multiplyRight(t);
  }
}
function Ne (e) {
  '@babel/helpers - typeof';
  return Ne = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
    ? function (t) {
      return typeof t;
    }
    : function (t) {
      return t && typeof Symbol === 'function' && t.constructor === Symbol && t !== Symbol.prototype ? 'symbol' : typeof t;
    }, Ne(e);
}
function Pf (e, t) {
  if (Ne(e) != 'object' || !e) { return e; }
  const n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    const s = n.call(e, t || 'default');
    if (Ne(s) != 'object') { return s; }
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
function Gf (e) {
  const t = Pf(e, 'string');
  return Ne(t) == 'symbol' ? t : String(t);
}
function x (e, t, n) {
  return t = Gf(t), t in e
    ? Object.defineProperty(e, t, {
      value: n,
      enumerable: !0,
      configurable: !0,
      writable: !0
    })
    : e[t] = n, e;
}
const Nf = 0.1; const Uf = 1e-12; const xa = 1e-15; const Hf = 1e-20; const Jf = 6378137; const Vf = 6378137; const jf = 6356752314245179e-9;
function Xn (e) {
  return e;
}
new A();
function kf (e, t = [], n = Xn) {
  return 'longitude' in e ? (t[0] = n(e.longitude), t[1] = n(e.latitude), t[2] = e.height) : 'x' in e ? (t[0] = n(e.x), t[1] = n(e.y), t[2] = e.z) : (t[0] = n(e[0]), t[1] = n(e[1]), t[2] = e[2]), t;
}
function Kf (e, t = []) {
  return kf(e, t, et._cartographicRadians ? Xn : hh);
}
function zf (e, t, n = Xn) {
  return 'longitude' in t ? (t.longitude = n(e[0]), t.latitude = n(e[1]), t.height = e[2]) : 'x' in t ? (t.x = n(e[0]), t.y = n(e[1]), t.z = e[2]) : (t[0] = n(e[0]), t[1] = n(e[1]), t[2] = e[2]), t;
}
function Wf (e, t) {
  return zf(e, t, et._cartographicRadians ? Xn : fh);
}
const Bi = 1e-14; const Xf = new A(); const Ci = {
  up: {
    south: 'east',
    north: 'west',
    west: 'south',
    east: 'north'
  },
  down: {
    south: 'west',
    north: 'east',
    west: 'north',
    east: 'south'
  },
  south: {
    up: 'west',
    down: 'east',
    west: 'down',
    east: 'up'
  },
  north: {
    up: 'east',
    down: 'west',
    west: 'up',
    east: 'down'
  },
  west: {
    up: 'north',
    down: 'south',
    north: 'down',
    south: 'up'
  },
  east: {
    up: 'south',
    down: 'north',
    north: 'up',
    south: 'down'
  }
}; const gs = {
  north: [-1, 0, 0],
  east: [0, 1, 0],
  up: [0, 0, 1],
  south: [1, 0, 0],
  west: [0, -1, 0],
  down: [0, 0, -1]
}; const Te = {
  east: new A(),
  north: new A(),
  up: new A(),
  west: new A(),
  south: new A(),
  down: new A()
}; const Qf = new A(); const qf = new A(); const Yf = new A();
function Ei (e, t, n, s, r, i) {
  const o = Ci[t] && Ci[t][n];
  j(o && (!s || s === o));
  let a, c, u;
  const l = Xf.copy(r);
  if (Kt(l.x, 0, Bi) && Kt(l.y, 0, Bi)) {
    const f = Math.sign(l.z);
    a = Qf.fromArray(gs[t]), t !== 'east' && t !== 'west' && a.scale(f), c = qf.fromArray(gs[n]), n !== 'east' && n !== 'west' && c.scale(f), u = Yf.fromArray(gs[s]), s !== 'east' && s !== 'west' && u.scale(f);
  } else {
    const {
      up: f,
      east: d,
      north: m
    } = Te;
    d.set(-l.y, l.x, 0).normalize(), e.geodeticSurfaceNormal(l, f), m.copy(f).cross(d);
    const {
      down: g,
      west: y,
      south: E
    } = Te;
    g.copy(f).scale(-1), y.copy(d).scale(-1), E.copy(m).scale(-1), a = Te[t], c = Te[n], u = Te[s];
  }
  return i[0] = a.x, i[1] = a.y, i[2] = a.z, i[3] = 0, i[4] = c.x, i[5] = c.y, i[6] = c.z, i[7] = 0, i[8] = u.x, i[9] = u.y, i[10] = u.z, i[11] = 0, i[12] = l.x, i[13] = l.y, i[14] = l.z, i[15] = 1, i;
}
const ue = new A(); const $f = new A(); const Zf = new A();
function td (e, t, n = []) {
  const {
    oneOverRadii: s,
    oneOverRadiiSquared: r,
    centerToleranceSquared: i
  } = t;
  ue.from(e);
  const o = ue.x; const a = ue.y; const c = ue.z; const u = s.x; const l = s.y; const h = s.z; const f = o * o * u * u; const d = a * a * l * l; const m = c * c * h * h; const g = f + d + m; const y = Math.sqrt(1 / g);
  if (!Number.isFinite(y)) { return; }
  const E = $f;
  if (E.copy(e).scale(y), g < i) { return E.to(n); }
  const R = r.x; const B = r.y; const C = r.z; const M = Zf;
  M.set(E.x * R * 2, E.y * B * 2, E.z * C * 2);
  let b = (1 - y) * ue.len() / (0.5 * M.len()); let O = 0; let F; let v; let L; let k;
  do {
    b -= O, F = 1 / (1 + b * R), v = 1 / (1 + b * B), L = 1 / (1 + b * C);
    const q = F * F; const Y = v * v; const P = L * L; const ct = q * F; const Wt = Y * v; const oe = P * L;
    k = f * q + d * Y + m * P - 1;
    const vt = -2 * (f * ct * R + d * Wt * B + m * oe * C);
    O = k / vt;
  } while (Math.abs(k) > Uf);
  return ue.scale([F, v, L]).to(n);
}
const an = new A(); const Ti = new A(); const ed = new A(); const wt = new A(); const nd = new A(); const cn = new A();
class J {
  constructor (t = 0, n = 0, s = 0) {
    x(this, 'radii', void 0), x(this, 'radiiSquared', void 0), x(this, 'radiiToTheFourth', void 0), x(this, 'oneOverRadii', void 0), x(this, 'oneOverRadiiSquared', void 0), x(this, 'minimumRadius', void 0), x(this, 'maximumRadius', void 0), x(this, 'centerToleranceSquared', Nf), x(this, 'squaredXOverSquaredZ', void 0), j(t >= 0), j(n >= 0), j(s >= 0), this.radii = new A(t, n, s), this.radiiSquared = new A(t * t, n * n, s * s), this.radiiToTheFourth = new A(t * t * t * t, n * n * n * n, s * s * s * s), this.oneOverRadii = new A(t === 0 ? 0 : 1 / t, n === 0 ? 0 : 1 / n, s === 0 ? 0 : 1 / s), this.oneOverRadiiSquared = new A(t === 0 ? 0 : 1 / (t * t), n === 0 ? 0 : 1 / (n * n), s === 0 ? 0 : 1 / (s * s)), this.minimumRadius = Math.min(t, n, s), this.maximumRadius = Math.max(t, n, s), this.radiiSquared.z !== 0 && (this.squaredXOverSquaredZ = this.radiiSquared.x / this.radiiSquared.z), Object.freeze(this);
  }

  equals (t) {
    return this === t || !!(t && this.radii.equals(t.radii));
  }

  toString () {
    return this.radii.toString();
  }

  cartographicToCartesian (t, n = [0, 0, 0]) {
    const s = Ti; const r = ed; const [, , i] = t;
    this.geodeticSurfaceNormalCartographic(t, s), r.copy(this.radiiSquared).scale(s);
    const o = Math.sqrt(s.dot(r));
    return r.scale(1 / o), s.scale(i), r.add(s), r.to(n);
  }

  cartesianToCartographic (t, n = [0, 0, 0]) {
    cn.from(t);
    const s = this.scaleToGeodeticSurface(cn, wt);
    if (!s) { return; }
    const r = this.geodeticSurfaceNormal(s, Ti); const i = nd;
    i.copy(cn).subtract(s);
    const o = Math.atan2(r.y, r.x); const a = Math.asin(r.z); const c = Math.sign(Cr(i, cn)) * ba(i);
    return Wf([o, a, c], n);
  }

  eastNorthUpToFixedFrame (t, n = new V()) {
    return Ei(this, 'east', 'north', 'up', t, n);
  }

  localFrameToFixedFrame (t, n, s, r, i = new V()) {
    return Ei(this, t, n, s, r, i);
  }

  geocentricSurfaceNormal (t, n = [0, 0, 0]) {
    return an.from(t).normalize().to(n);
  }

  geodeticSurfaceNormalCartographic (t, n = [0, 0, 0]) {
    const s = Kf(t); const r = s[0]; const i = s[1]; const o = Math.cos(i);
    return an.set(o * Math.cos(r), o * Math.sin(r), Math.sin(i)).normalize(), an.to(n);
  }

  geodeticSurfaceNormal (t, n = [0, 0, 0]) {
    return an.from(t).scale(this.oneOverRadiiSquared).normalize().to(n);
  }

  scaleToGeodeticSurface (t, n) {
    return td(t, this, n);
  }

  scaleToGeocentricSurface (t, n = [0, 0, 0]) {
    wt.from(t);
    const s = wt.x; const r = wt.y; const i = wt.z; const o = this.oneOverRadiiSquared; const a = 1 / Math.sqrt(s * s * o.x + r * r * o.y + i * i * o.z);
    return wt.multiplyScalar(a).to(n);
  }

  transformPositionToScaledSpace (t, n = [0, 0, 0]) {
    return wt.from(t).scale(this.oneOverRadii).to(n);
  }

  transformPositionFromScaledSpace (t, n = [0, 0, 0]) {
    return wt.from(t).scale(this.radii).to(n);
  }

  getSurfaceNormalIntersectionWithZAxis (t, n = 0, s = [0, 0, 0]) {
    j(Kt(this.radii.x, this.radii.y, xa)), j(this.radii.z > 0), wt.from(t);
    const r = wt.z * (1 - this.squaredXOverSquaredZ);
    if (!(Math.abs(r) >= this.radii.z - n)) { return wt.set(0, 0, r).to(s); }
  }
}
x(J, 'WGS84', new J(Jf, Vf, jf));
const pt = {
  OUTSIDE: -1,
  INTERSECTING: 0,
  INSIDE: 1
};
new A();
new A();
const be = new A(); const bi = new A();
class Qe {
  constructor (t = [0, 0, 0], n = 0) {
    x(this, 'center', void 0), x(this, 'radius', void 0), this.radius = -0, this.center = new A(), this.fromCenterRadius(t, n);
  }

  fromCenterRadius (t, n) {
    return this.center.from(t), this.radius = n, this;
  }

  fromCornerPoints (t, n) {
    return n = be.from(n), this.center = new A().from(t).add(n).scale(0.5), this.radius = this.center.distance(n), this;
  }

  equals (t) {
    return this === t || !!t && this.center.equals(t.center) && this.radius === t.radius;
  }

  clone () {
    return new Qe(this.center, this.radius);
  }

  union (t) {
    const n = this.center; const s = this.radius; const r = t.center; const i = t.radius; const o = be.copy(r).subtract(n); const a = o.magnitude();
    if (s >= a + i) { return this.clone(); }
    if (i >= a + s) { return t.clone(); }
    const c = (s + a + i) * 0.5;
    return bi.copy(o).scale((-s + c) / a).add(n), this.center.copy(bi), this.radius = c, this;
  }

  expand (t) {
    const s = be.from(t).subtract(this.center).magnitude();
    return s > this.radius && (this.radius = s), this;
  }

  transform (t) {
    this.center.transform(t);
    const n = qh(be, t);
    return this.radius = Math.max(n[0], Math.max(n[1], n[2])) * this.radius, this;
  }

  distanceSquaredTo (t) {
    const n = this.distanceTo(t);
    return n * n;
  }

  distanceTo (t) {
    const s = be.from(t).subtract(this.center);
    return Math.max(0, s.len() - this.radius);
  }

  intersectPlane (t) {
    const n = this.center; const s = this.radius; const i = t.normal.dot(n) + t.distance;
    return i < -s ? pt.OUTSIDE : i < s ? pt.INTERSECTING : pt.INSIDE;
  }
}
const sd = new A(); const rd = new A(); const un = new A(); const ln = new A(); const hn = new A(); const id = new A(); const od = new A(); const Gt = {
  COLUMN0ROW0: 0,
  COLUMN0ROW1: 1,
  COLUMN0ROW2: 2,
  COLUMN1ROW0: 3,
  COLUMN1ROW1: 4,
  COLUMN1ROW2: 5,
  COLUMN2ROW0: 6,
  COLUMN2ROW1: 7,
  COLUMN2ROW2: 8
};
class qe {
  constructor (t = [0, 0, 0], n = [0, 0, 0, 0, 0, 0, 0, 0, 0]) {
    x(this, 'center', void 0), x(this, 'halfAxes', void 0), this.center = new A().from(t), this.halfAxes = new X(n);
  }

  get halfSize () {
    const t = this.halfAxes.getColumn(0); const n = this.halfAxes.getColumn(1); const s = this.halfAxes.getColumn(2);
    return [new A(t).len(), new A(n).len(), new A(s).len()];
  }

  get quaternion () {
    const t = this.halfAxes.getColumn(0); const n = this.halfAxes.getColumn(1); const s = this.halfAxes.getColumn(2); const r = new A(t).normalize(); const i = new A(n).normalize(); const o = new A(s).normalize();
    return new On().fromMatrix3(new X([...r, ...i, ...o]));
  }

  fromCenterHalfSizeQuaternion (t, n, s) {
    const r = new On(s); const i = new X().fromQuaternion(r);
    return i[0] = i[0] * n[0], i[1] = i[1] * n[0], i[2] = i[2] * n[0], i[3] = i[3] * n[1], i[4] = i[4] * n[1], i[5] = i[5] * n[1], i[6] = i[6] * n[2], i[7] = i[7] * n[2], i[8] = i[8] * n[2], this.center = new A().from(t), this.halfAxes = i, this;
  }

  clone () {
    return new qe(this.center, this.halfAxes);
  }

  equals (t) {
    return this === t || !!t && this.center.equals(t.center) && this.halfAxes.equals(t.halfAxes);
  }

  getBoundingSphere (t = new Qe()) {
    const n = this.halfAxes; const s = n.getColumn(0, un); const r = n.getColumn(1, ln); const i = n.getColumn(2, hn); const o = sd.copy(s).add(r).add(i);
    return t.center.copy(this.center), t.radius = o.magnitude(), t;
  }

  intersectPlane (t) {
    const n = this.center; const s = t.normal; const r = this.halfAxes; const i = s.x; const o = s.y; const a = s.z; const c = Math.abs(i * r[Gt.COLUMN0ROW0] + o * r[Gt.COLUMN0ROW1] + a * r[Gt.COLUMN0ROW2]) + Math.abs(i * r[Gt.COLUMN1ROW0] + o * r[Gt.COLUMN1ROW1] + a * r[Gt.COLUMN1ROW2]) + Math.abs(i * r[Gt.COLUMN2ROW0] + o * r[Gt.COLUMN2ROW1] + a * r[Gt.COLUMN2ROW2]); const u = s.dot(n) + t.distance;
    return u <= -c ? pt.OUTSIDE : u >= c ? pt.INSIDE : pt.INTERSECTING;
  }

  distanceTo (t) {
    return Math.sqrt(this.distanceSquaredTo(t));
  }

  distanceSquaredTo (t) {
    const n = rd.from(t).subtract(this.center); const s = this.halfAxes; const r = s.getColumn(0, un); const i = s.getColumn(1, ln); const o = s.getColumn(2, hn); const a = r.magnitude(); const c = i.magnitude(); const u = o.magnitude();
    r.normalize(), i.normalize(), o.normalize();
    let l = 0; let h;
    return h = Math.abs(n.dot(r)) - a, h > 0 && (l += h * h), h = Math.abs(n.dot(i)) - c, h > 0 && (l += h * h), h = Math.abs(n.dot(o)) - u, h > 0 && (l += h * h), l;
  }

  computePlaneDistances (t, n, s = [-0, -0]) {
    let r = Number.POSITIVE_INFINITY; let i = Number.NEGATIVE_INFINITY;
    const o = this.center; const a = this.halfAxes; const c = a.getColumn(0, un); const u = a.getColumn(1, ln); const l = a.getColumn(2, hn); const h = id.copy(c).add(u).add(l).add(o); const f = od.copy(h).subtract(t);
    let d = n.dot(f);
    return r = Math.min(d, r), i = Math.max(d, i), h.copy(o).add(c).add(u).subtract(l), f.copy(h).subtract(t), d = n.dot(f), r = Math.min(d, r), i = Math.max(d, i), h.copy(o).add(c).subtract(u).add(l), f.copy(h).subtract(t), d = n.dot(f), r = Math.min(d, r), i = Math.max(d, i), h.copy(o).add(c).subtract(u).subtract(l), f.copy(h).subtract(t), d = n.dot(f), r = Math.min(d, r), i = Math.max(d, i), o.copy(h).subtract(c).add(u).add(l), f.copy(h).subtract(t), d = n.dot(f), r = Math.min(d, r), i = Math.max(d, i), o.copy(h).subtract(c).add(u).subtract(l), f.copy(h).subtract(t), d = n.dot(f), r = Math.min(d, r), i = Math.max(d, i), o.copy(h).subtract(c).subtract(u).add(l), f.copy(h).subtract(t), d = n.dot(f), r = Math.min(d, r), i = Math.max(d, i), o.copy(h).subtract(c).subtract(u).subtract(l), f.copy(h).subtract(t), d = n.dot(f), r = Math.min(d, r), i = Math.max(d, i), s[0] = r, s[1] = i, s;
  }

  transform (t) {
    this.center.transformAsPoint(t);
    const n = this.halfAxes.getColumn(0, un);
    n.transformAsPoint(t);
    const s = this.halfAxes.getColumn(1, ln);
    s.transformAsPoint(t);
    const r = this.halfAxes.getColumn(2, hn);
    return r.transformAsPoint(t), this.halfAxes = new X([...n, ...s, ...r]), this;
  }

  getTransform () {
    throw new Error('not implemented');
  }
}
const _i = new A(); const wi = new A();
class nt {
  constructor (t = [0, 0, 1], n = 0) {
    x(this, 'normal', void 0), x(this, 'distance', void 0), this.normal = new A(), this.distance = -0, this.fromNormalDistance(t, n);
  }

  fromNormalDistance (t, n) {
    return j(Number.isFinite(n)), this.normal.from(t).normalize(), this.distance = n, this;
  }

  fromPointNormal (t, n) {
    t = _i.from(t), this.normal.from(n).normalize();
    const s = -this.normal.dot(t);
    return this.distance = s, this;
  }

  fromCoefficients (t, n, s, r) {
    return this.normal.set(t, n, s), j(Kt(this.normal.len(), 1)), this.distance = r, this;
  }

  clone () {
    return new nt(this.normal, this.distance);
  }

  equals (t) {
    return Kt(this.distance, t.distance) && Kt(this.normal, t.normal);
  }

  getPointDistance (t) {
    return this.normal.dot(t) + this.distance;
  }

  transform (t) {
    const n = wi.copy(this.normal).transformAsVector(t).normalize(); const s = this.normal.scale(-this.distance).transform(t);
    return this.fromPointNormal(s, n);
  }

  projectPointOntoPlane (t, n = [0, 0, 0]) {
    const s = _i.from(t); const r = this.getPointDistance(s); const i = wi.copy(this.normal).scale(r);
    return s.subtract(i).to(n);
  }
}
const Ri = [new A([1, 0, 0]), new A([0, 1, 0]), new A([0, 0, 1])]; const Mi = new A(); const ad = new A();
class dt {
  constructor (t = []) {
    x(this, 'planes', void 0), this.planes = t;
  }

  fromBoundingSphere (t) {
    this.planes.length = 2 * Ri.length;
    const n = t.center; const s = t.radius;
    let r = 0;
    for (const i of Ri) {
      let o = this.planes[r]; let a = this.planes[r + 1];
      o || (o = this.planes[r] = new nt()), a || (a = this.planes[r + 1] = new nt());
      const c = Mi.copy(i).scale(-s).add(n);
      o.fromPointNormal(c, i);
      const u = Mi.copy(i).scale(s).add(n); const l = ad.copy(i).negate();
      a.fromPointNormal(u, l), r += 2;
    }
    return this;
  }

  computeVisibility (t) {
    let n = pt.INSIDE;
    for (const s of this.planes) {
      switch (t.intersectPlane(s)) {
        case pt.OUTSIDE:
          return pt.OUTSIDE;
        case pt.INTERSECTING:
          n = pt.INTERSECTING;
          break;
      }
    }
    return n;
  }

  computeVisibilityWithPlaneMask (t, n) {
    if (j(Number.isFinite(n), 'parentPlaneMask is required.'), n === dt.MASK_OUTSIDE || n === dt.MASK_INSIDE) { return n; }
    let s = dt.MASK_INSIDE;
    const r = this.planes;
    for (let i = 0; i < this.planes.length; ++i) {
      const o = i < 31 ? 1 << i : 0;
      if (i < 31 && !(n & o)) { continue; }
      const a = r[i]; const c = t.intersectPlane(a);
      if (c === pt.OUTSIDE) { return dt.MASK_OUTSIDE; }
      c === pt.INTERSECTING && (s |= o);
    }
    return s;
  }
}
x(dt, 'MASK_OUTSIDE', 4294967295);
x(dt, 'MASK_INSIDE', 0);
x(dt, 'MASK_INDETERMINATE', 2147483647);
const cd = new A(); const ud = new A(); const ld = new A(); const hd = new A(); const fd = new A();
class Fn {
  constructor (t = {}) {
    x(this, 'left', void 0), x(this, '_left', void 0), x(this, 'right', void 0), x(this, '_right', void 0), x(this, 'top', void 0), x(this, '_top', void 0), x(this, 'bottom', void 0), x(this, '_bottom', void 0), x(this, 'near', void 0), x(this, '_near', void 0), x(this, 'far', void 0), x(this, '_far', void 0), x(this, '_cullingVolume', new dt([new nt(), new nt(), new nt(), new nt(), new nt(), new nt()])), x(this, '_perspectiveMatrix', new V()), x(this, '_infinitePerspective', new V());
    const {
      near: n = 1,
      far: s = 5e8
    } = t;
    this.left = t.left, this._left = void 0, this.right = t.right, this._right = void 0, this.top = t.top, this._top = void 0, this.bottom = t.bottom, this._bottom = void 0, this.near = n, this._near = n, this.far = s, this._far = s;
  }

  clone () {
    return new Fn({
      right: this.right,
      left: this.left,
      top: this.top,
      bottom: this.bottom,
      near: this.near,
      far: this.far
    });
  }

  equals (t) {
    return t && t instanceof Fn && this.right === t.right && this.left === t.left && this.top === t.top && this.bottom === t.bottom && this.near === t.near && this.far === t.far;
  }

  get projectionMatrix () {
    return this._update(), this._perspectiveMatrix;
  }

  get infiniteProjectionMatrix () {
    return this._update(), this._infinitePerspective;
  }

  computeCullingVolume (t, n, s) {
    j(t, 'position is required.'), j(n, 'direction is required.'), j(s, 'up is required.');
    const r = this._cullingVolume.planes;
    s = cd.copy(s).normalize();
    const i = ud.copy(n).cross(s).normalize(); const o = ld.copy(n).multiplyByScalar(this.near).add(t); const a = hd.copy(n).multiplyByScalar(this.far).add(t);
    let c = fd;
    return c.copy(i).multiplyByScalar(this.left).add(o).subtract(t).cross(s), r[0].fromPointNormal(t, c), c.copy(i).multiplyByScalar(this.right).add(o).subtract(t).cross(s).negate(), r[1].fromPointNormal(t, c), c.copy(s).multiplyByScalar(this.bottom).add(o).subtract(t).cross(i).negate(), r[2].fromPointNormal(t, c), c.copy(s).multiplyByScalar(this.top).add(o).subtract(t).cross(i), r[3].fromPointNormal(t, c), c = new A().copy(n), r[4].fromPointNormal(o, c), c.negate(), r[5].fromPointNormal(a, c), this._cullingVolume;
  }

  getPixelDimensions (t, n, s, r) {
    this._update(), j(Number.isFinite(t) && Number.isFinite(n)), j(t > 0), j(n > 0), j(s > 0), j(r);
    const i = 1 / this.near;
    let o = this.top * i;
    const a = 2 * s * o / n;
    o = this.right * i;
    const c = 2 * s * o / t;
    return r.x = c, r.y = a, r;
  }

  _update () {
    j(Number.isFinite(this.right) && Number.isFinite(this.left) && Number.isFinite(this.top) && Number.isFinite(this.bottom) && Number.isFinite(this.near) && Number.isFinite(this.far));
    const {
      top: t,
      bottom: n,
      right: s,
      left: r,
      near: i,
      far: o
    } = this;
    (t !== this._top || n !== this._bottom || r !== this._left || s !== this._right || i !== this._near || o !== this._far) && (j(this.near > 0 && this.near < this.far, 'near must be greater than zero and less than far.'), this._left = r, this._right = s, this._top = t, this._bottom = n, this._near = i, this._far = o, this._perspectiveMatrix = new V().frustum({
      left: r,
      right: s,
      bottom: n,
      top: t,
      near: i,
      far: o
    }), this._infinitePerspective = new V().frustum({
      left: r,
      right: s,
      bottom: n,
      top: t,
      near: i,
      far: 1 / 0
    }));
  }
}
const dd = (e) => e !== null && typeof e < 'u';
class Dn {
  constructor (t = {}) {
    x(this, '_offCenterFrustum', new Fn()), x(this, 'fov', void 0), x(this, '_fov', void 0), x(this, '_fovy', void 0), x(this, '_sseDenominator', void 0), x(this, 'aspectRatio', void 0), x(this, '_aspectRatio', void 0), x(this, 'near', void 0), x(this, '_near', void 0), x(this, 'far', void 0), x(this, '_far', void 0), x(this, 'xOffset', void 0), x(this, '_xOffset', void 0), x(this, 'yOffset', void 0), x(this, '_yOffset', void 0);
    const {
      fov: n,
      aspectRatio: s,
      near: r = 1,
      far: i = 5e8,
      xOffset: o = 0,
      yOffset: a = 0
    } = t;
    this.fov = n, this.aspectRatio = s, this.near = r, this.far = i, this.xOffset = o, this.yOffset = a;
  }

  clone () {
    return new Dn({
      aspectRatio: this.aspectRatio,
      fov: this.fov,
      near: this.near,
      far: this.far
    });
  }

  equals (t) {
    return !dd(t) || !(t instanceof Dn) ? !1 : (this._update(), t._update(), this.fov === t.fov && this.aspectRatio === t.aspectRatio && this.near === t.near && this.far === t.far && this._offCenterFrustum.equals(t._offCenterFrustum));
  }

  get projectionMatrix () {
    return this._update(), this._offCenterFrustum.projectionMatrix;
  }

  get infiniteProjectionMatrix () {
    return this._update(), this._offCenterFrustum.infiniteProjectionMatrix;
  }

  get fovy () {
    return this._update(), this._fovy;
  }

  get sseDenominator () {
    return this._update(), this._sseDenominator;
  }

  computeCullingVolume (t, n, s) {
    return this._update(), this._offCenterFrustum.computeCullingVolume(t, n, s);
  }

  getPixelDimensions (t, n, s, r) {
    return this._update(), this._offCenterFrustum.getPixelDimensions(t, n, s, r || new Wn());
  }

  _update () {
    j(Number.isFinite(this.fov) && Number.isFinite(this.aspectRatio) && Number.isFinite(this.near) && Number.isFinite(this.far));
    const t = this._offCenterFrustum;
    (this.fov !== this._fov || this.aspectRatio !== this._aspectRatio || this.near !== this._near || this.far !== this._far || this.xOffset !== this._xOffset || this.yOffset !== this._yOffset) && (j(this.fov >= 0 && this.fov < Math.PI), j(this.aspectRatio > 0), j(this.near >= 0 && this.near < this.far), this._aspectRatio = this.aspectRatio, this._fov = this.fov, this._fovy = this.aspectRatio <= 1 ? this.fov : Math.atan(Math.tan(this.fov * 0.5) / this.aspectRatio) * 2, this._near = this.near, this._far = this.far, this._sseDenominator = 2 * Math.tan(0.5 * this._fovy), this._xOffset = this.xOffset, this._yOffset = this.yOffset, t.top = this.near * Math.tan(0.5 * this._fovy), t.bottom = -t.top, t.right = this.aspectRatio * t.top, t.left = -t.right, t.near = this.near, t.far = this.far, t.right += this.xOffset, t.left += this.xOffset, t.top += this.yOffset, t.bottom += this.yOffset);
  }
}
new A();
new A();
new A();
new A();
new A();
new A();
new A();
new A();
new A();
new A();
new A();
new A();
const Ot = new X(); const md = new X(); const gd = new X(); const fn = new X(); const Si = new X();
function Ad (e, t = {}) {
  const n = Hf; const s = 10;
  let r = 0; let i = 0;
  const o = md; const a = gd;
  o.identity(), a.copy(e);
  const c = n * pd(a);
  for (; i < s && yd(a) > c;) { Bd(a, fn), Si.copy(fn).transpose(), a.multiplyRight(fn), a.multiplyLeft(Si), o.multiplyRight(fn), ++r > 2 && (++i, r = 0); }
  return t.unitary = o.toTarget(t.unitary), t.diagonal = a.toTarget(t.diagonal), t;
}
function pd (e) {
  let t = 0;
  for (let n = 0; n < 9; ++n) {
    const s = e[n];
    t += s * s;
  }
  return Math.sqrt(t);
}
const zs = [1, 0, 0]; const Ws = [2, 2, 1];
function yd (e) {
  let t = 0;
  for (let n = 0; n < 3; ++n) {
    const s = e[Ot.getElementIndex(Ws[n], zs[n])];
    t += 2 * s * s;
  }
  return Math.sqrt(t);
}
function Bd (e, t) {
  const n = xa;
  let s = 0; let r = 1;
  for (let u = 0; u < 3; ++u) {
    const l = Math.abs(e[Ot.getElementIndex(Ws[u], zs[u])]);
    l > s && (r = u, s = l);
  }
  const i = zs[r]; const o = Ws[r];
  let a = 1; let c = 0;
  if (Math.abs(e[Ot.getElementIndex(o, i)]) > n) {
    const u = e[Ot.getElementIndex(o, o)]; const l = e[Ot.getElementIndex(i, i)]; const h = e[Ot.getElementIndex(o, i)]; const f = (u - l) / 2 / h;
    let d;
    f < 0 ? d = -1 / (-f + Math.sqrt(1 + f * f)) : d = 1 / (f + Math.sqrt(1 + f * f)), a = 1 / Math.sqrt(1 + d * d), c = d * a;
  }
  return X.IDENTITY.to(t), t[Ot.getElementIndex(i, i)] = t[Ot.getElementIndex(o, o)] = a, t[Ot.getElementIndex(o, i)] = c, t[Ot.getElementIndex(i, o)] = -c, t;
}
const Vt = new A(); const Cd = new A(); const Ed = new A(); const Td = new A(); const bd = new A(); const _d = new X(); const wd = {
  diagonal: new X(),
  unitary: new X()
};
function Rd (e, t = new qe()) {
  if (!e || e.length === 0) { return t.halfAxes = new X([0, 0, 0, 0, 0, 0, 0, 0, 0]), t.center = new A(), t; }
  const n = e.length; const s = new A(0, 0, 0);
  for (const v of e) { s.add(v); }
  const r = 1 / n;
  s.multiplyByScalar(r);
  let i = 0; let o = 0; let a = 0; let c = 0; let u = 0; let l = 0;
  for (const v of e) {
    const L = Vt.copy(v).subtract(s);
    i += L.x * L.x, o += L.x * L.y, a += L.x * L.z, c += L.y * L.y, u += L.y * L.z, l += L.z * L.z;
  }
  i *= r, o *= r, a *= r, c *= r, u *= r, l *= r;
  const h = _d;
  h[0] = i, h[1] = o, h[2] = a, h[3] = o, h[4] = c, h[5] = u, h[6] = a, h[7] = u, h[8] = l;
  const {
    unitary: f
  } = Ad(h, wd); const d = t.halfAxes.copy(f);
  let m = d.getColumn(0, Ed); let g = d.getColumn(1, Td); let y = d.getColumn(2, bd); let E = -Number.MAX_VALUE; let R = -Number.MAX_VALUE; let B = -Number.MAX_VALUE; let C = Number.MAX_VALUE; let M = Number.MAX_VALUE; let b = Number.MAX_VALUE;
  for (const v of e) { Vt.copy(v), E = Math.max(Vt.dot(m), E), R = Math.max(Vt.dot(g), R), B = Math.max(Vt.dot(y), B), C = Math.min(Vt.dot(m), C), M = Math.min(Vt.dot(g), M), b = Math.min(Vt.dot(y), b); }
  m = m.multiplyByScalar(0.5 * (C + E)), g = g.multiplyByScalar(0.5 * (M + R)), y = y.multiplyByScalar(0.5 * (b + B)), t.center.copy(m).add(g).add(y);
  const O = Cd.set(E - C, R - M, B - b).multiplyByScalar(0.5); const F = new X([O[0], 0, 0, 0, O[1], 0, 0, 0, O[2]]);
  return t.halfAxes.multiplyRight(F), t;
}
const Ii = (function (e) {
  return e[e.ADD = 1] = 'ADD', e[e.REPLACE = 2] = 'REPLACE', e;
}({})); const dn = (function (e) {
  return e.EMPTY = 'empty', e.SCENEGRAPH = 'scenegraph', e.POINTCLOUD = 'pointcloud', e.MESH = 'mesh', e;
}({})); const Md = (function (e) {
  return e.I3S = 'I3S', e.TILES3D = 'TILES3D', e;
}({})); const Qn = (function (e) {
  return e.GEOMETRIC_ERROR = 'geometricError', e.MAX_SCREEN_THRESHOLD = 'maxScreenThreshold', e;
}({}));
const va = '4.1.1'; const _e = {
  COMPOSITE: 'cmpt',
  POINT_CLOUD: 'pnts',
  BATCHED_3D_MODEL: 'b3dm',
  INSTANCED_3D_MODEL: 'i3dm',
  GEOMETRY: 'geom',
  VECTOR: 'vect',
  GLTF: 'glTF'
};
function Oa (e, t, n) {
  z(e instanceof ArrayBuffer);
  const s = new TextDecoder('utf8'); const r = new Uint8Array(e, t, n);
  return s.decode(r);
}
function Sd (e) {
  const t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  const n = new DataView(e);
  return `${String.fromCharCode(n.getUint8(t + 0))}${String.fromCharCode(n.getUint8(t + 1))}${String.fromCharCode(n.getUint8(t + 2))}${String.fromCharCode(n.getUint8(t + 3))}`;
}
const Id = '4.1.1'; const xd = {
  name: 'Draco',
  id: 'draco',
  module: 'draco',
  version: Id,
  worker: !0,
  extensions: ['drc'],
  mimeTypes: ['application/octet-stream'],
  binary: !0,
  tests: ['DRACO'],
  options: {
    draco: {
      decoderType: typeof WebAssembly === 'object' ? 'wasm' : 'js',
      libraryPath: 'libs/',
      extraAttributes: {},
      attributeNameEntry: void 0
    }
  }
};
function vd (e, t, n) {
  const s = Fa(t.metadata); const r = []; const i = Od(t.attributes);
  for (const o in e) {
    const a = e[o]; const c = xi(o, a, i[o]);
    r.push(c);
  }
  if (n) {
    const o = xi('indices', n);
    r.push(o);
  }
  return {
    fields: r,
    metadata: s
  };
}
function Od (e) {
  const t = {};
  for (const n in e) {
    const s = e[n];
    t[s.name || 'undefined'] = s;
  }
  return t;
}
function xi (e, t, n) {
  const s = n ? Fa(n.metadata) : void 0;
  return ih(e, t, s);
}
function Fa (e) {
  Object.entries(e);
  const t = {};
  for (const n in e) { t[`${n}.string`] = JSON.stringify(e[n]); }
  return t;
}
const vi = {
  POSITION: 'POSITION',
  NORMAL: 'NORMAL',
  COLOR: 'COLOR_0',
  TEX_COORD: 'TEXCOORD_0'
}; const Fd = {
  1: Int8Array,
  2: Uint8Array,
  3: Int16Array,
  4: Uint16Array,
  5: Int32Array,
  6: Uint32Array,
  9: Float32Array
}; const Dd = 4;
class Ld {
  constructor (t) {
    this.draco = void 0, this.decoder = void 0, this.metadataQuerier = void 0, this.draco = t, this.decoder = new this.draco.Decoder(), this.metadataQuerier = new this.draco.MetadataQuerier();
  }

  destroy () {
    this.draco.destroy(this.decoder), this.draco.destroy(this.metadataQuerier);
  }

  parseSync (t) {
    const n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const s = new this.draco.DecoderBuffer();
    s.Init(new Int8Array(t), t.byteLength), this._disableAttributeTransforms(n);
    const r = this.decoder.GetEncodedGeometryType(s); const i = r === this.draco.TRIANGULAR_MESH ? new this.draco.Mesh() : new this.draco.PointCloud();
    try {
      let o;
      switch (r) {
        case this.draco.TRIANGULAR_MESH:
          o = this.decoder.DecodeBufferToMesh(s, i);
          break;
        case this.draco.POINT_CLOUD:
          o = this.decoder.DecodeBufferToPointCloud(s, i);
          break;
        default:
          throw new Error('DRACO: Unknown geometry type.');
      }
      if (!o.ok() || !i.ptr) {
        const f = `DRACO decompression failed: ${o.error_msg()}`;
        throw new Error(f);
      }
      const a = this._getDracoLoaderData(i, r, n); const c = this._getMeshData(i, a, n); const u = rh(c.attributes); const l = vd(c.attributes, a, c.indices);
      return {
        loader: 'draco',
        loaderData: a,
        header: {
          vertexCount: i.num_points(),
          boundingBox: u
        },
        ...c,
        schema: l
      };
    } finally {
      this.draco.destroy(s), i && this.draco.destroy(i);
    }
  }

  _getDracoLoaderData (t, n, s) {
    const r = this._getTopLevelMetadata(t); const i = this._getDracoAttributes(t, s);
    return {
      geometry_type: n,
      num_attributes: t.num_attributes(),
      num_points: t.num_points(),
      num_faces: t instanceof this.draco.Mesh ? t.num_faces() : 0,
      metadata: r,
      attributes: i
    };
  }

  _getDracoAttributes (t, n) {
    const s = {};
    for (let r = 0; r < t.num_attributes(); r++) {
      const i = this.decoder.GetAttribute(t, r); const o = this._getAttributeMetadata(t, r);
      s[i.unique_id()] = {
        unique_id: i.unique_id(),
        attribute_type: i.attribute_type(),
        data_type: i.data_type(),
        num_components: i.num_components(),
        byte_offset: i.byte_offset(),
        byte_stride: i.byte_stride(),
        normalized: i.normalized(),
        attribute_index: r,
        metadata: o
      };
      const a = this._getQuantizationTransform(i, n);
      a && (s[i.unique_id()].quantization_transform = a);
      const c = this._getOctahedronTransform(i, n);
      c && (s[i.unique_id()].octahedron_transform = c);
    }
    return s;
  }

  _getMeshData (t, n, s) {
    const r = this._getMeshAttributes(n, t, s);
    if (!r.POSITION) { throw new Error('DRACO: No position attribute found.'); }
    if (t instanceof this.draco.Mesh) {
      switch (s.topology) {
        case 'triangle-strip':
          return {
            topology: 'triangle-strip',
            mode: 4,
            attributes: r,
            indices: {
              value: this._getTriangleStripIndices(t),
              size: 1
            }
          };
        case 'triangle-list':
        default:
          return {
            topology: 'triangle-list',
            mode: 5,
            attributes: r,
            indices: {
              value: this._getTriangleListIndices(t),
              size: 1
            }
          };
      }
    }
    return {
      topology: 'point-list',
      mode: 0,
      attributes: r
    };
  }

  _getMeshAttributes (t, n, s) {
    const r = {};
    for (const i of Object.values(t.attributes)) {
      const o = this._deduceAttributeName(i, s);
      i.name = o;
      const {
        value: a,
        size: c
      } = this._getAttributeValues(n, i);
      r[o] = {
        value: a,
        size: c,
        byteOffset: i.byte_offset,
        byteStride: i.byte_stride,
        normalized: i.normalized
      };
    }
    return r;
  }

  _getTriangleListIndices (t) {
    const s = t.num_faces() * 3; const r = s * Dd; const i = this.draco._malloc(r);
    try {
      return this.decoder.GetTrianglesUInt32Array(t, r, i), new Uint32Array(this.draco.HEAPF32.buffer, i, s).slice();
    } finally {
      this.draco._free(i);
    }
  }

  _getTriangleStripIndices (t) {
    const n = new this.draco.DracoInt32Array();
    try {
      return this.decoder.GetTriangleStripsFromMesh(t, n), Nd(n);
    } finally {
      this.draco.destroy(n);
    }
  }

  _getAttributeValues (t, n) {
    const s = Fd[n.data_type]; const r = n.num_components; const o = t.num_points() * r; const a = o * s.BYTES_PER_ELEMENT; const c = Pd(this.draco, s);
    let u;
    const l = this.draco._malloc(a);
    try {
      const h = this.decoder.GetAttribute(t, n.attribute_index);
      this.decoder.GetAttributeDataArrayForAllPoints(t, h, c, a, l), u = new s(this.draco.HEAPF32.buffer, l, o).slice();
    } finally {
      this.draco._free(l);
    }
    return {
      value: u,
      size: r
    };
  }

  _deduceAttributeName (t, n) {
    const s = t.unique_id;
    for (const [o, a] of Object.entries(n.extraAttributes || {})) {
      if (a === s) { return o; }
    }
    const r = t.attribute_type;
    for (const o in vi) {
      if (this.draco[o] === r) { return vi[o]; }
    }
    const i = n.attributeNameEntry || 'name';
    return t.metadata[i] ? t.metadata[i].string : `CUSTOM_ATTRIBUTE_${s}`;
  }

  _getTopLevelMetadata (t) {
    const n = this.decoder.GetMetadata(t);
    return this._getDracoMetadata(n);
  }

  _getAttributeMetadata (t, n) {
    const s = this.decoder.GetAttributeMetadata(t, n);
    return this._getDracoMetadata(s);
  }

  _getDracoMetadata (t) {
    if (!t || !t.ptr) { return {}; }
    const n = {}; const s = this.metadataQuerier.NumEntries(t);
    for (let r = 0; r < s; r++) {
      const i = this.metadataQuerier.GetEntryName(t, r);
      n[i] = this._getDracoMetadataField(t, i);
    }
    return n;
  }

  _getDracoMetadataField (t, n) {
    const s = new this.draco.DracoInt32Array();
    try {
      this.metadataQuerier.GetIntEntryArray(t, n, s);
      const r = Gd(s);
      return {
        int: this.metadataQuerier.GetIntEntry(t, n),
        string: this.metadataQuerier.GetStringEntry(t, n),
        double: this.metadataQuerier.GetDoubleEntry(t, n),
        intArray: r
      };
    } finally {
      this.draco.destroy(s);
    }
  }

  _disableAttributeTransforms (t) {
    const {
      quantizedAttributes: n = [],
      octahedronAttributes: s = []
    } = t; const r = [...n, ...s];
    for (const i of r) { this.decoder.SkipAttributeTransform(this.draco[i]); }
  }

  _getQuantizationTransform (t, n) {
    const {
      quantizedAttributes: s = []
    } = n; const r = t.attribute_type();
    if (s.map((o) => this.decoder[o]).includes(r)) {
      const o = new this.draco.AttributeQuantizationTransform();
      try {
        if (o.InitFromAttribute(t)) {
          return {
            quantization_bits: o.quantization_bits(),
            range: o.range(),
            min_values: new Float32Array([1, 2, 3]).map((a) => o.min_value(a))
          };
        }
      } finally {
        this.draco.destroy(o);
      }
    }
    return null;
  }

  _getOctahedronTransform (t, n) {
    const {
      octahedronAttributes: s = []
    } = n; const r = t.attribute_type();
    if (s.map((o) => this.decoder[o]).includes(r)) {
      const o = new this.draco.AttributeQuantizationTransform();
      try {
        if (o.InitFromAttribute(t)) {
          return {
            quantization_bits: o.quantization_bits()
          };
        }
      } finally {
        this.draco.destroy(o);
      }
    }
    return null;
  }
}
function Pd (e, t) {
  switch (t) {
    case Float32Array:
      return e.DT_FLOAT32;
    case Int8Array:
      return e.DT_INT8;
    case Int16Array:
      return e.DT_INT16;
    case Int32Array:
      return e.DT_INT32;
    case Uint8Array:
      return e.DT_UINT8;
    case Uint16Array:
      return e.DT_UINT16;
    case Uint32Array:
      return e.DT_UINT32;
    default:
      return e.DT_INVALID;
  }
}
function Gd (e) {
  const t = e.size(); const n = new Int32Array(t);
  for (let s = 0; s < t; s++) { n[s] = e.GetValue(s); }
  return n;
}
function Nd (e) {
  const t = e.size(); const n = new Int32Array(t);
  for (let s = 0; s < t; s++) { n[s] = e.GetValue(s); }
  return n;
}
const Ud = '1.5.6'; const Hd = '1.4.1'; const As = `https://www.gstatic.com/draco/versioned/decoders/${Ud}`; const ft = {
  DECODER: 'draco_wasm_wrapper.js',
  DECODER_WASM: 'draco_decoder.wasm',
  FALLBACK_DECODER: 'draco_decoder.js',
  ENCODER: 'draco_encoder.js'
}; const ps = {
  [ft.DECODER]: `${As}/${ft.DECODER}`,
  [ft.DECODER_WASM]: `${As}/${ft.DECODER_WASM}`,
  [ft.FALLBACK_DECODER]: `${As}/${ft.FALLBACK_DECODER}`,
  [ft.ENCODER]: `https://raw.githubusercontent.com/google/draco/${Hd}/javascript/${ft.ENCODER}`
};
let we;
async function Jd (e) {
  const t = e.modules || {};
  return t.draco3d
    ? we = we || t.draco3d.createDecoderModule({}).then((n) => ({
      draco: n
    }))
    : we = we || Vd(e), await we;
}
async function Vd (e) {
  let t, n;
  switch (e.draco && e.draco.decoderType) {
    case 'js':
      t = await Zt(ps[ft.FALLBACK_DECODER], 'draco', e, ft.FALLBACK_DECODER);
      break;
    case 'wasm':
    default:
      [t, n] = await Promise.all([await Zt(ps[ft.DECODER], 'draco', e, ft.DECODER), await Zt(ps[ft.DECODER_WASM], 'draco', e, ft.DECODER_WASM)]);
  }
  return t = t || globalThis.DracoDecoderModule, await jd(t, n);
}
function jd (e, t) {
  const n = {};
  return t && (n.wasmBinary = t), new Promise((s) => {
    e({
      ...n,
      onModuleLoaded: (r) => s({
        draco: r
      })
    });
  });
}
const Da = {
  ...xd,
  parse: kd
};
async function kd (e, t) {
  const {
    draco: n
  } = await Jd(t); const s = new Ld(n);
  try {
    return s.parseSync(e, t == null ? void 0 : t.draco);
  } finally {
    s.destroy();
  }
}
const Kd = {
  POINTS: 0,
  LINES: 1,
  LINE_LOOP: 2,
  LINE_STRIP: 3,
  TRIANGLES: 4,
  TRIANGLE_STRIP: 5,
  TRIANGLE_FAN: 6
}; const $ = {
  BYTE: 5120,
  UNSIGNED_BYTE: 5121,
  SHORT: 5122,
  UNSIGNED_SHORT: 5123,
  INT: 5124,
  UNSIGNED_INT: 5125,
  FLOAT: 5126,
  DOUBLE: 5130
}; const G = {
  ...Kd,
  ...$
}; const ys = {
  [$.DOUBLE]: Float64Array,
  [$.FLOAT]: Float32Array,
  [$.UNSIGNED_SHORT]: Uint16Array,
  [$.UNSIGNED_INT]: Uint32Array,
  [$.UNSIGNED_BYTE]: Uint8Array,
  [$.BYTE]: Int8Array,
  [$.SHORT]: Int16Array,
  [$.INT]: Int32Array
}; const zd = {
  DOUBLE: $.DOUBLE,
  FLOAT: $.FLOAT,
  UNSIGNED_SHORT: $.UNSIGNED_SHORT,
  UNSIGNED_INT: $.UNSIGNED_INT,
  UNSIGNED_BYTE: $.UNSIGNED_BYTE,
  BYTE: $.BYTE,
  SHORT: $.SHORT,
  INT: $.INT
}; const Bs = 'Failed to convert GL type';
class Lt {
  static fromTypedArray (t) {
    t = ArrayBuffer.isView(t) ? t.constructor : t;
    for (const n in ys) {
      if (ys[n] === t) { return n; }
    }
    throw new Error(Bs);
  }

  static fromName (t) {
    const n = zd[t];
    if (!n) { throw new Error(Bs); }
    return n;
  }

  static getArrayType (t) {
    switch (t) {
      case $.UNSIGNED_SHORT_5_6_5:
      case $.UNSIGNED_SHORT_4_4_4_4:
      case $.UNSIGNED_SHORT_5_5_5_1:
        return Uint16Array;
      default:
        const n = ys[t];
        if (!n) { throw new Error(Bs); }
        return n;
    }
  }

  static getByteSize (t) {
    return Lt.getArrayType(t).BYTES_PER_ELEMENT;
  }

  static validate (t) {
    return !!Lt.getArrayType(t);
  }

  static createTypedArray (t, n) {
    const s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0; let r = arguments.length > 3 ? arguments[3] : void 0;
    r === void 0 && (r = (n.byteLength - s) / Lt.getByteSize(t));
    const i = Lt.getArrayType(t);
    return new i(n, s, r);
  }
}
function Wd (e, t) {
  if (!e) { throw new Error(`math.gl assertion failed. ${t}`); }
}
function Xd (e) {
  const t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [0, 0, 0];
  const n = e >> 11 & 31; const s = e >> 5 & 63; const r = e & 31;
  return t[0] = n << 3, t[1] = s << 2, t[2] = r << 3, t;
}
new Wn();
new A();
new Wn();
new Wn();
function Oi (e) {
  const t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 255;
  return mh(e, 0, t) / t * 2 - 1;
}
function Fi (e) {
  return e < 0 ? -1 : 1;
}
function Qd (e, t, n, s) {
  if (Wd(s), e < 0 || e > n || t < 0 || t > n) { throw new Error(`x and y must be unsigned normalized integers between 0 and ${n}`); }
  if (s.x = Oi(e, n), s.y = Oi(t, n), s.z = 1 - (Math.abs(s.x) + Math.abs(s.y)), s.z < 0) {
    const r = s.x;
    s.x = (1 - Math.abs(s.y)) * Fi(r), s.y = (1 - Math.abs(r)) * Fi(s.y);
  }
  return s.normalize();
}
function qd (e, t, n) {
  return Qd(e, t, 255, n);
}
class br {
  constructor (t, n) {
    this.json = void 0, this.buffer = void 0, this.featuresLength = 0, this._cachedTypedArrays = {}, this.json = t, this.buffer = n;
  }

  getExtension (t) {
    return this.json.extensions && this.json.extensions[t];
  }

  hasProperty (t) {
    return !!this.json[t];
  }

  getGlobalProperty (t) {
    const n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : G.UNSIGNED_INT; const s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
    const r = this.json[t];
    return r && Number.isFinite(r.byteOffset) ? this._getTypedArrayFromBinary(t, n, s, 1, r.byteOffset) : r;
  }

  getPropertyArray (t, n, s) {
    const r = this.json[t];
    return r && Number.isFinite(r.byteOffset) ? ('componentType' in r && (n = Lt.fromName(r.componentType)), this._getTypedArrayFromBinary(t, n, s, this.featuresLength, r.byteOffset)) : this._getTypedArrayFromArray(t, n, r);
  }

  getProperty (t, n, s, r, i) {
    const o = this.json[t];
    if (!o) { return o; }
    const a = this.getPropertyArray(t, n, s);
    if (s === 1) { return a[r]; }
    for (let c = 0; c < s; ++c) { i[c] = a[s * r + c]; }
    return i;
  }

  _getTypedArrayFromBinary (t, n, s, r, i) {
    const o = this._cachedTypedArrays;
    let a = o[t];
    return a || (a = Lt.createTypedArray(n, this.buffer.buffer, this.buffer.byteOffset + i, r * s), o[t] = a), a;
  }

  _getTypedArrayFromArray (t, n, s) {
    const r = this._cachedTypedArrays;
    let i = r[t];
    return i || (i = Lt.createTypedArray(n, s), r[t] = i), i;
  }
}
const Yd = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
}; const $d = {
  SCALAR: (e, t) => e[t],
  VEC2: (e, t) => [e[2 * t + 0], e[2 * t + 1]],
  VEC3: (e, t) => [e[3 * t + 0], e[3 * t + 1], e[3 * t + 2]],
  VEC4: (e, t) => [e[4 * t + 0], e[4 * t + 1], e[4 * t + 2], e[4 * t + 3]],
  MAT2: (e, t) => [e[4 * t + 0], e[4 * t + 1], e[4 * t + 2], e[4 * t + 3]],
  MAT3: (e, t) => [e[9 * t + 0], e[9 * t + 1], e[9 * t + 2], e[9 * t + 3], e[9 * t + 4], e[9 * t + 5], e[9 * t + 6], e[9 * t + 7], e[9 * t + 8]],
  MAT4: (e, t) => [e[16 * t + 0], e[16 * t + 1], e[16 * t + 2], e[16 * t + 3], e[16 * t + 4], e[16 * t + 5], e[16 * t + 6], e[16 * t + 7], e[16 * t + 8], e[16 * t + 9], e[16 * t + 10], e[16 * t + 11], e[16 * t + 12], e[16 * t + 13], e[16 * t + 14], e[16 * t + 15]]
}; const Zd = {
  SCALAR: (e, t, n) => {
    t[n] = e;
  },
  VEC2: (e, t, n) => {
    t[2 * n + 0] = e[0], t[2 * n + 1] = e[1];
  },
  VEC3: (e, t, n) => {
    t[3 * n + 0] = e[0], t[3 * n + 1] = e[1], t[3 * n + 2] = e[2];
  },
  VEC4: (e, t, n) => {
    t[4 * n + 0] = e[0], t[4 * n + 1] = e[1], t[4 * n + 2] = e[2], t[4 * n + 3] = e[3];
  },
  MAT2: (e, t, n) => {
    t[4 * n + 0] = e[0], t[4 * n + 1] = e[1], t[4 * n + 2] = e[2], t[4 * n + 3] = e[3];
  },
  MAT3: (e, t, n) => {
    t[9 * n + 0] = e[0], t[9 * n + 1] = e[1], t[9 * n + 2] = e[2], t[9 * n + 3] = e[3], t[9 * n + 4] = e[4], t[9 * n + 5] = e[5], t[9 * n + 6] = e[6], t[9 * n + 7] = e[7], t[9 * n + 8] = e[8], t[9 * n + 9] = e[9];
  },
  MAT4: (e, t, n) => {
    t[16 * n + 0] = e[0], t[16 * n + 1] = e[1], t[16 * n + 2] = e[2], t[16 * n + 3] = e[3], t[16 * n + 4] = e[4], t[16 * n + 5] = e[5], t[16 * n + 6] = e[6], t[16 * n + 7] = e[7], t[16 * n + 8] = e[8], t[16 * n + 9] = e[9], t[16 * n + 10] = e[10], t[16 * n + 11] = e[11], t[16 * n + 12] = e[12], t[16 * n + 13] = e[13], t[16 * n + 14] = e[14], t[16 * n + 15] = e[15];
  }
};
function tm (e, t, n, s) {
  const {
    componentType: r
  } = e;
  z(e.componentType);
  const i = typeof r === 'string' ? Lt.fromName(r) : r; const o = Yd[e.type]; const a = $d[e.type]; const c = Zd[e.type];
  return n += e.byteOffset, {
    values: Lt.createTypedArray(i, t, n, o * s),
    type: i,
    size: o,
    unpacker: a,
    packer: c
  };
}
const Ft = (e) => e !== void 0;
function em (e, t, n) {
  if (!t) { return null; }
  let s = e.getExtension('3DTILES_batch_table_hierarchy');
  const r = t.HIERARCHY;
  return r && (console.warn('3D Tile Parser: HIERARCHY is deprecated. Use 3DTILES_batch_table_hierarchy.'), t.extensions = t.extensions || {}, t.extensions['3DTILES_batch_table_hierarchy'] = r, s = r), s ? nm(s, n) : null;
}
function nm (e, t) {
  let n, s, r;
  const i = e.instancesLength; const o = e.classes;
  let a = e.classIds; let c = e.parentCounts; let u = e.parentIds; let l = i;
  Ft(a.byteOffset) && (a.componentType = defaultValue(a.componentType, GL.UNSIGNED_SHORT), a.type = AttributeType.SCALAR, r = getBinaryAccessor(a), a = r.createArrayBufferView(t.buffer, t.byteOffset + a.byteOffset, i));
  let h;
  if (Ft(c)) {
    for (Ft(c.byteOffset) && (c.componentType = defaultValue(c.componentType, GL.UNSIGNED_SHORT), c.type = AttributeType.SCALAR, r = getBinaryAccessor(c), c = r.createArrayBufferView(t.buffer, t.byteOffset + c.byteOffset, i)), h = new Uint16Array(i), l = 0, n = 0; n < i; ++n) { h[n] = l, l += c[n]; }
  }
  Ft(u) && Ft(u.byteOffset) && (u.componentType = defaultValue(u.componentType, GL.UNSIGNED_SHORT), u.type = AttributeType.SCALAR, r = getBinaryAccessor(u), u = r.createArrayBufferView(t.buffer, t.byteOffset + u.byteOffset, l));
  const f = o.length;
  for (n = 0; n < f; ++n) {
    const y = o[n].length; const E = o[n].instances; const R = getBinaryProperties(y, E, t);
    o[n].instances = combine(R, E);
  }
  const d = new Array(f).fill(0); const m = new Uint16Array(i);
  for (n = 0; n < i; ++n) { s = a[n], m[n] = d[s], ++d[s]; }
  const g = {
    classes: o,
    classIds: a,
    classIndexes: m,
    parentCounts: c,
    parentIndexes: h,
    parentIds: u
  };
  return im(g), g;
}
function Re (e, t, n) {
  if (!e) { return; }
  const s = e.parentCounts;
  return e.parentIds ? n(e, t) : s > 0 ? sm(e, t, n) : rm(e, t, n);
}
function sm (e, t, n) {
  const s = e.classIds; const r = e.parentCounts; const i = e.parentIds; const o = e.parentIndexes; const a = s.length; const c = scratchVisited;
  c.length = Math.max(c.length, a);
  const u = ++marker; const l = scratchStack;
  for (l.length = 0, l.push(t); l.length > 0;) {
    if (t = l.pop(), c[t] === u) { continue; }
    c[t] = u;
    const h = n(e, t);
    if (Ft(h)) { return h; }
    const f = r[t]; const d = o[t];
    for (let m = 0; m < f; ++m) {
      const g = i[d + m];
      g !== t && l.push(g);
    }
  }
  return null;
}
function rm (e, t, n) {
  let s = !0;
  for (; s;) {
    const r = n(e, t);
    if (Ft(r)) { return r; }
    const i = e.parentIds[t];
    s = i !== t, t = i;
  }
  throw new Error('traverseHierarchySingleParent');
}
function im (e) {
  const n = e.classIds.length;
  for (let s = 0; s < n; ++s) { La(e, s, stack); }
}
function La (e, t, n) {
  const s = e.parentCounts; const r = e.parentIds; const i = e.parentIndexes; const a = e.classIds.length;
  if (!Ft(r)) { return; }
  assert(t < a, `Parent index ${t} exceeds the total number of instances: ${a}`), assert(n.indexOf(t) === -1, 'Circular dependency detected in the batch table hierarchy.'), n.push(t);
  const c = Ft(s) ? s[t] : 1; const u = Ft(s) ? i[t] : t;
  for (let l = 0; l < c; ++l) {
    const h = r[u + l];
    h !== t && La(e, h, n);
  }
  n.pop(t);
}
function ut (e) {
  return e != null;
}
const mn = (e, t) => e; const om = {
  HIERARCHY: !0,
  extensions: !0,
  extras: !0
};
class Pa {
  constructor (t, n, s) {
    let r;
    const i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    this.json = void 0, this.binary = void 0, this.featureCount = void 0, this._extensions = void 0, this._properties = void 0, this._binaryProperties = void 0, this._hierarchy = void 0, z(s >= 0), this.json = t || {}, this.binary = n, this.featureCount = s, this._extensions = ((r = this.json) === null || r === void 0 ? void 0 : r.extensions) || {}, this._properties = {};
    for (const o in this.json) { om[o] || (this._properties[o] = this.json[o]); }
    this._binaryProperties = this._initializeBinaryProperties(), i['3DTILES_batch_table_hierarchy'] && (this._hierarchy = em(this, this.json, this.binary));
  }

  getExtension (t) {
    return this.json && this.json.extensions && this.json.extensions[t];
  }

  memorySizeInBytes () {
    return 0;
  }

  isClass (t, n) {
    if (this._checkBatchId(t), z(typeof n === 'string', n), this._hierarchy) {
      const s = Re(this._hierarchy, t, (r, i) => {
        const o = r.classIds[i];
        return r.classes[o].name === n;
      });
      return ut(s);
    }
    return !1;
  }

  isExactClass (t, n) {
    return z(typeof n === 'string', n), this.getExactClassName(t) === n;
  }

  getExactClassName (t) {
    if (this._checkBatchId(t), this._hierarchy) {
      const n = this._hierarchy.classIds[t];
      return this._hierarchy.classes[n].name;
    }
  }

  hasProperty (t, n) {
    return this._checkBatchId(t), z(typeof n === 'string', n), ut(this._properties[n]) || this._hasPropertyInHierarchy(t, n);
  }

  getPropertyNames (t, n) {
    this._checkBatchId(t), n = ut(n) ? n : [], n.length = 0;
    const s = Object.keys(this._properties);
    return n.push(...s), this._hierarchy && this._getPropertyNamesInHierarchy(t, n), n;
  }

  getProperty (t, n) {
    if (this._checkBatchId(t), z(typeof n === 'string', n), this._binaryProperties) {
      const r = this._binaryProperties[n];
      if (ut(r)) { return this._getBinaryProperty(r, t); }
    }
    const s = this._properties[n];
    if (ut(s)) { return mn(s[t]); }
    if (this._hierarchy) {
      const r = this._getHierarchyProperty(t, n);
      if (ut(r)) { return r; }
    }
  }

  setProperty (t, n, s) {
    const r = this.featureCount;
    if (this._checkBatchId(t), z(typeof n === 'string', n), this._binaryProperties) {
      const o = this._binaryProperties[n];
      if (o) {
        this._setBinaryProperty(o, t, s);
        return;
      }
    }
    if (this._hierarchy && this._setHierarchyProperty(this, t, n, s)) { return; }
    let i = this._properties[n];
    ut(i) || (this._properties[n] = new Array(r), i = this._properties[n]), i[t] = mn(s);
  }

  _checkBatchId (t) {
    if (!(t >= 0 && t < this.featureCount)) { throw new Error('batchId not in range [0, featureCount - 1].'); }
  }

  _getBinaryProperty (t, n) {
    return t.unpack(t.typedArray, n);
  }

  _setBinaryProperty (t, n, s) {
    t.pack(s, t.typedArray, n);
  }

  _initializeBinaryProperties () {
    let t = null;
    for (const n in this._properties) {
      const s = this._properties[n]; const r = this._initializeBinaryProperty(n, s);
      r && (t = t || {}, t[n] = r);
    }
    return t;
  }

  _initializeBinaryProperty (t, n) {
    if ('byteOffset' in n) {
      const s = n;
      z(this.binary, `Property ${t} requires a batch table binary.`), z(s.type, `Property ${t} requires a type.`);
      const r = tm(s, this.binary.buffer, this.binary.byteOffset | 0, this.featureCount);
      return {
        typedArray: r.values,
        componentCount: r.size,
        unpack: r.unpacker,
        pack: r.packer
      };
    }
    return null;
  }

  _hasPropertyInHierarchy (t, n) {
    if (!this._hierarchy) { return !1; }
    const s = Re(this._hierarchy, t, (r, i) => {
      const o = r.classIds[i]; const a = r.classes[o].instances;
      return ut(a[n]);
    });
    return ut(s);
  }

  _getPropertyNamesInHierarchy (t, n) {
    Re(this._hierarchy, t, (s, r) => {
      const i = s.classIds[r]; const o = s.classes[i].instances;
      for (const a in o) { o.hasOwnProperty(a) && n.indexOf(a) === -1 && n.push(a); }
    });
  }

  _getHierarchyProperty (t, n) {
    return Re(this._hierarchy, t, (s, r) => {
      const i = s.classIds[r]; const o = s.classes[i]; const a = s.classIndexes[r]; const c = o.instances[n];
      return ut(c) ? ut(c.typedArray) ? this._getBinaryProperty(c, a) : mn(c[a]) : null;
    });
  }

  _setHierarchyProperty (t, n, s, r) {
    const i = Re(this._hierarchy, n, (o, a) => {
      const c = o.classIds[a]; const u = o.classes[c]; const l = o.classIndexes[a]; const h = u.instances[s];
      return ut(h) ? (z(a === n, `Inherited property "${s}" is read-only.`), ut(h.typedArray) ? this._setBinaryProperty(h, l, r) : h[l] = mn(r), !0) : !1;
    });
    return ut(i);
  }
}
const Cs = 4;
function qn (e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
  const s = new DataView(t);
  if (e.magic = s.getUint32(n, !0), n += Cs, e.version = s.getUint32(n, !0), n += Cs, e.byteLength = s.getUint32(n, !0), n += Cs, e.version !== 1) { throw new Error(`3D Tile Version ${e.version} not supported`); }
  return n;
}
const le = 4; const Di = 'b3dm tile in legacy format.';
function _r (e, t, n) {
  const s = new DataView(t);
  let r;
  e.header = e.header || {};
  let i = s.getUint32(n, !0);
  n += le;
  let o = s.getUint32(n, !0);
  n += le;
  let a = s.getUint32(n, !0);
  n += le;
  let c = s.getUint32(n, !0);
  return n += le, a >= 570425344 ? (n -= le * 2, r = i, a = o, c = 0, i = 0, o = 0, console.warn(Di)) : c >= 570425344 && (n -= le, r = a, a = i, c = o, i = 0, o = 0, console.warn(Di)), e.header.featureTableJsonByteLength = i, e.header.featureTableBinaryByteLength = o, e.header.batchTableJsonByteLength = a, e.header.batchTableBinaryByteLength = c, e.header.batchLength = r, n;
}
function wr (e, t, n, s) {
  return n = am(e, t, n), n = cm(e, t, n), n;
}
function am (e, t, n, s) {
  const {
    featureTableJsonByteLength: r,
    featureTableBinaryByteLength: i,
    batchLength: o
  } = e.header || {};
  if (e.featureTableJson = {
    BATCH_LENGTH: o || 0
  }, r && r > 0) {
    const a = Oa(t, n, r);
    e.featureTableJson = JSON.parse(a);
  }
  return n += r || 0, e.featureTableBinary = new Uint8Array(t, n, i), n += i || 0, n;
}
function cm (e, t, n, s) {
  const {
    batchTableJsonByteLength: r,
    batchTableBinaryByteLength: i
  } = e.header || {};
  if (r && r > 0) {
    const o = Oa(t, n, r);
    e.batchTableJson = JSON.parse(o), n += r, i && i > 0 && (e.batchTableBinary = new Uint8Array(t, n, i), e.batchTableBinary = new Uint8Array(e.batchTableBinary), n += i);
  }
  return n;
}
function Ga (e, t, n) {
  if (!t && (!e || !e.batchIds || !n)) { return null; }
  const {
    batchIds: s,
    isRGB565: r,
    pointCount: i = 0
  } = e;
  if (s && n) {
    const o = new Uint8ClampedArray(i * 3);
    for (let a = 0; a < i; a++) {
      const c = s[a]; const l = n.getProperty(c, 'dimensions').map((h) => h * 255);
      o[a * 3] = l[0], o[a * 3 + 1] = l[1], o[a * 3 + 2] = l[2];
    }
    return {
      type: G.UNSIGNED_BYTE,
      value: o,
      size: 3,
      normalized: !0
    };
  }
  if (t && r) {
    const o = new Uint8ClampedArray(i * 3);
    for (let a = 0; a < i; a++) {
      const c = Xd(t[a]);
      o[a * 3] = c[0], o[a * 3 + 1] = c[1], o[a * 3 + 2] = c[2];
    }
    return {
      type: G.UNSIGNED_BYTE,
      value: o,
      size: 3,
      normalized: !0
    };
  }
  return t && t.length === i * 3
    ? {
        type: G.UNSIGNED_BYTE,
        value: t,
        size: 3,
        normalized: !0
      }
    : {
        type: G.UNSIGNED_BYTE,
        value: t || new Uint8ClampedArray(),
        size: 4,
        normalized: !0
      };
}
const Li = new A();
function um (e, t) {
  if (!t) { return null; }
  if (e.isOctEncoded16P) {
    const n = new Float32Array((e.pointsLength || 0) * 3);
    for (let s = 0; s < (e.pointsLength || 0); s++) { qd(t[s * 2], t[s * 2 + 1], Li), Li.toArray(n, s * 3); }
    return {
      type: G.FLOAT,
      size: 2,
      value: n
    };
  }
  return {
    type: G.FLOAT,
    size: 2,
    value: t
  };
}
function lm (e, t, n) {
  return e.isQuantized
    ? n['3d-tiles'] && n['3d-tiles'].decodeQuantizedPositions
      ? (e.isQuantized = !1, hm(e, t))
      : {
          type: G.UNSIGNED_SHORT,
          value: t,
          size: 3,
          normalized: !0
        }
    : t;
}
function hm (e, t) {
  const n = new A(); const s = new Float32Array(e.pointCount * 3);
  for (let r = 0; r < e.pointCount; r++) { n.set(t[r * 3], t[r * 3 + 1], t[r * 3 + 2]).scale(1 / e.quantizedRange).multiply(e.quantizedVolumeScale).add(e.quantizedVolumeOffset).toArray(s, r * 3); }
  return s;
}
async function fm (e, t, n, s, r) {
  n = qn(e, t, n), n = _r(e, t, n), n = wr(e, t, n), dm(e);
  const {
    featureTable: i,
    batchTable: o
  } = mm(e);
  return await Bm(e, i, o, s, r), gm(e, i, s), Am(e, i, o), pm(e, i), n;
}
function dm (e) {
  e.attributes = {
    positions: null,
    colors: null,
    normals: null,
    batchIds: null
  }, e.isQuantized = !1, e.isTranslucent = !1, e.isRGB565 = !1, e.isOctEncoded16P = !1;
}
function mm (e) {
  const t = new br(e.featureTableJson, e.featureTableBinary); const n = t.getGlobalProperty('POINTS_LENGTH');
  if (!Number.isFinite(n)) { throw new Error('POINTS_LENGTH must be defined'); }
  t.featuresLength = n, e.featuresLength = n, e.pointsLength = n, e.pointCount = n, e.rtcCenter = t.getGlobalProperty('RTC_CENTER', G.FLOAT, 3);
  const s = ym(e, t);
  return {
    featureTable: t,
    batchTable: s
  };
}
function gm (e, t, n) {
  if (e.attributes = e.attributes || {
    positions: null,
    colors: null,
    normals: null,
    batchIds: null
  }, !e.attributes.positions) {
    if (t.hasProperty('POSITION')) { e.attributes.positions = t.getPropertyArray('POSITION', G.FLOAT, 3); } else if (t.hasProperty('POSITION_QUANTIZED')) {
      const s = t.getPropertyArray('POSITION_QUANTIZED', G.UNSIGNED_SHORT, 3);
      if (e.isQuantized = !0, e.quantizedRange = 65535, e.quantizedVolumeScale = t.getGlobalProperty('QUANTIZED_VOLUME_SCALE', G.FLOAT, 3), !e.quantizedVolumeScale) { throw new Error('QUANTIZED_VOLUME_SCALE must be defined for quantized positions.'); }
      if (e.quantizedVolumeOffset = t.getGlobalProperty('QUANTIZED_VOLUME_OFFSET', G.FLOAT, 3), !e.quantizedVolumeOffset) { throw new Error('QUANTIZED_VOLUME_OFFSET must be defined for quantized positions.'); }
      e.attributes.positions = lm(e, s, n);
    }
  }
  if (!e.attributes.positions) { throw new Error('Either POSITION or POSITION_QUANTIZED must be defined.'); }
}
function Am (e, t, n) {
  if (e.attributes = e.attributes || {
    positions: null,
    colors: null,
    normals: null,
    batchIds: null
  }, !e.attributes.colors) {
    let s = null;
    t.hasProperty('RGBA') ? (s = t.getPropertyArray('RGBA', G.UNSIGNED_BYTE, 4), e.isTranslucent = !0) : t.hasProperty('RGB') ? s = t.getPropertyArray('RGB', G.UNSIGNED_BYTE, 3) : t.hasProperty('RGB565') && (s = t.getPropertyArray('RGB565', G.UNSIGNED_SHORT, 1), e.isRGB565 = !0), e.attributes.colors = Ga(e, s, n);
  }
  t.hasProperty('CONSTANT_RGBA') && (e.constantRGBA = t.getGlobalProperty('CONSTANT_RGBA', G.UNSIGNED_BYTE, 4));
}
function pm (e, t) {
  if (e.attributes = e.attributes || {
    positions: null,
    colors: null,
    normals: null,
    batchIds: null
  }, !e.attributes.normals) {
    let n = null;
    t.hasProperty('NORMAL') ? n = t.getPropertyArray('NORMAL', G.FLOAT, 3) : t.hasProperty('NORMAL_OCT16P') && (n = t.getPropertyArray('NORMAL_OCT16P', G.UNSIGNED_BYTE, 2), e.isOctEncoded16P = !0), e.attributes.normals = um(e, n);
  }
}
function ym (e, t) {
  let n = null;
  if (!e.batchIds && t.hasProperty('BATCH_ID') && (e.batchIds = t.getPropertyArray('BATCH_ID', G.UNSIGNED_SHORT, 1), e.batchIds)) {
    const s = t.getGlobalProperty('BATCH_LENGTH');
    if (!s) { throw new Error('Global property: BATCH_LENGTH must be defined when BATCH_ID is defined.'); }
    const {
      batchTableJson: r,
      batchTableBinary: i
    } = e;
    n = new Pa(r, i, s);
  }
  return n;
}
async function Bm (e, t, n, s, r) {
  let i, o, a;
  const c = e.batchTableJson && e.batchTableJson.extensions && e.batchTableJson.extensions['3DTILES_draco_point_compression'];
  c && (a = c.properties);
  const u = t.getExtension('3DTILES_draco_point_compression');
  if (u) {
    o = u.properties;
    const h = u.byteOffset; const f = u.byteLength;
    if (!o || !Number.isFinite(h) || !f) { throw new Error('Draco properties, byteOffset, and byteLength must be defined'); }
    i = (e.featureTableBinary || []).slice(h, h + f), e.hasPositions = Number.isFinite(o.POSITION), e.hasColors = Number.isFinite(o.RGB) || Number.isFinite(o.RGBA), e.hasNormals = Number.isFinite(o.NORMAL), e.hasBatchIds = Number.isFinite(o.BATCH_ID), e.isTranslucent = Number.isFinite(o.RGBA);
  }
  if (!i) { return !0; }
  const l = {
    buffer: i,
    properties: {
      ...o,
      ...a
    },
    featureTableProperties: o,
    batchTableProperties: a,
    dequantizeInShader: !1
  };
  return await Cm(e, l, s, r);
}
async function Cm (e, t, n, s) {
  if (!s) { return; }
  const r = {
    ...n,
    draco: {
      ...n == null ? void 0 : n.draco,
      extraAttributes: t.batchTableProperties || {}
    }
  };
  delete r['3d-tiles'];
  const i = await Ke(t.buffer, Da, r, s); const o = i.attributes.POSITION && i.attributes.POSITION.value; const a = i.attributes.COLOR_0 && i.attributes.COLOR_0.value; const c = i.attributes.NORMAL && i.attributes.NORMAL.value; const u = i.attributes.BATCH_ID && i.attributes.BATCH_ID.value; const l = o && i.attributes.POSITION.value.quantization; const h = c && i.attributes.NORMAL.value.quantization;
  if (l) {
    const d = i.POSITION.data.quantization; const m = d.range;
    e.quantizedVolumeScale = new A(m, m, m), e.quantizedVolumeOffset = new A(d.minValues), e.quantizedRange = (1 << d.quantizationBits) - 1, e.isQuantizedDraco = !0;
  }
  h && (e.octEncodedRange = (1 << i.NORMAL.data.quantization.quantizationBits) - 1, e.isOctEncodedDraco = !0);
  const f = {};
  if (t.batchTableProperties) {
    for (const d of Object.keys(t.batchTableProperties)) { i.attributes[d] && i.attributes[d].value && (f[d.toLowerCase()] = i.attributes[d].value); }
  }
  e.attributes = {
    positions: o,
    colors: Ga(e, a, void 0),
    normals: c,
    batchIds: u,
    ...f
  };
}
const Em = '4.1.1';
let Es;
const Tm = (Es = globalThis.loaders) === null || Es === void 0 ? void 0 : Es.parseImageNode; const Xs = typeof Image < 'u'; const Qs = typeof ImageBitmap < 'u'; const bm = !!Tm; const qs = kn ? !0 : bm;
function _m (e) {
  switch (e) {
    case 'auto':
      return Qs || Xs || qs;
    case 'imagebitmap':
      return Qs;
    case 'image':
      return Xs;
    case 'data':
      return qs;
    default:
      throw new Error(`@loaders.gl/images: image ${e} not supported in this environment`);
  }
}
function wm () {
  if (Qs) { return 'imagebitmap'; }
  if (Xs) { return 'image'; }
  if (qs) { return 'data'; }
  throw new Error("Install '@loaders.gl/polyfills' to parse images under Node.js");
}
function Rm (e) {
  const t = Mm(e);
  if (!t) { throw new Error('Not an image'); }
  return t;
}
function Na (e) {
  switch (Rm(e)) {
    case 'data':
      return e;
    case 'image':
    case 'imagebitmap':
      const t = document.createElement('canvas'); const n = t.getContext('2d');
      if (!n) { throw new Error('getImageData'); }
      return t.width = e.width, t.height = e.height, n.drawImage(e, 0, 0), n.getImageData(0, 0, e.width, e.height);
    default:
      throw new Error('getImageData');
  }
}
function Mm (e) {
  return typeof ImageBitmap < 'u' && e instanceof ImageBitmap ? 'imagebitmap' : typeof Image < 'u' && e instanceof Image ? 'image' : e && typeof e === 'object' && e.data && e.width && e.height ? 'data' : null;
}
const Sm = /^data:image\/svg\+xml/; const Im = /\.svg((\?|#).*)?$/;
function Rr (e) {
  return e && (Sm.test(e) || Im.test(e));
}
function xm (e, t) {
  if (Rr(t)) {
    let s = new TextDecoder().decode(e);
    try {
      typeof unescape === 'function' && typeof encodeURIComponent === 'function' && (s = unescape(encodeURIComponent(s)));
    } catch (i) {
      throw new Error(i.message);
    }
    return `data:image/svg+xml;base64,${btoa(s)}`;
  }
  return Ua(e, t);
}
function Ua (e, t) {
  if (Rr(t)) { throw new Error('SVG cannot be parsed directly to imagebitmap'); }
  return new Blob([new Uint8Array(e)]);
}
async function Ha (e, t, n) {
  const s = xm(e, n); const r = self.URL || self.webkitURL; const i = typeof s !== 'string' && r.createObjectURL(s);
  try {
    return await vm(i || s, t);
  } finally {
    i && r.revokeObjectURL(i);
  }
}
async function vm (e, t) {
  const n = new Image();
  return n.src = e, t.image && t.image.decode && n.decode
    ? (await n.decode(), n)
    : await new Promise((s, r) => {
      try {
        n.onload = () => s(n), n.onerror = (i) => {
          const o = i instanceof Error ? i.message : 'error';
          r(new Error(o));
        };
      } catch (i) {
        r(i);
      }
    });
}
const Om = {};
let Pi = !0;
async function Fm (e, t, n) {
  let s;
  Rr(n) ? s = await Ha(e, t, n) : s = Ua(e, n);
  const r = t && t.imagebitmap;
  return await Dm(s, r);
}
async function Dm (e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
  if ((Lm(t) || !Pi) && (t = null), t) {
    try {
      return await createImageBitmap(e, t);
    } catch (n) {
      console.warn(n), Pi = !1;
    }
  }
  return await createImageBitmap(e);
}
function Lm (e) {
  for (const t in e || Om) { return !1; }
  return !0;
}
function Pm (e) {
  return !Hm(e, 'ftyp', 4) || !(e[8] & 96) ? null : Gm(e);
}
function Gm (e) {
  switch (Nm(e, 8, 12).replace('\0', ' ').trim()) {
    case 'avif':
    case 'avis':
      return {
        extension: 'avif',
        mimeType: 'image/avif'
      };
    default:
      return null;
  }
}
function Nm (e, t, n) {
  return String.fromCharCode(...e.slice(t, n));
}
function Um (e) {
  return [...e].map((t) => t.charCodeAt(0));
}
function Hm (e, t) {
  const n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
  const s = Um(t);
  for (let r = 0; r < s.length; ++r) {
    if (s[r] !== e[r + n]) { return !1; }
  }
  return !0;
}
const Dt = !1; const De = !0;
function Mr (e) {
  const t = Ye(e);
  return Vm(t) || Km(t) || jm(t) || km(t) || Jm(t);
}
function Jm (e) {
  const t = new Uint8Array(e instanceof DataView ? e.buffer : e); const n = Pm(t);
  return n
    ? {
        mimeType: n.mimeType,
        width: 0,
        height: 0
      }
    : null;
}
function Vm (e) {
  const t = Ye(e);
  return t.byteLength >= 24 && t.getUint32(0, Dt) === 2303741511
    ? {
        mimeType: 'image/png',
        width: t.getUint32(16, Dt),
        height: t.getUint32(20, Dt)
      }
    : null;
}
function jm (e) {
  const t = Ye(e);
  return t.byteLength >= 10 && t.getUint32(0, Dt) === 1195984440
    ? {
        mimeType: 'image/gif',
        width: t.getUint16(6, De),
        height: t.getUint16(8, De)
      }
    : null;
}
function km (e) {
  const t = Ye(e);
  return t.byteLength >= 14 && t.getUint16(0, Dt) === 16973 && t.getUint32(2, De) === t.byteLength
    ? {
        mimeType: 'image/bmp',
        width: t.getUint32(18, De),
        height: t.getUint32(22, De)
      }
    : null;
}
function Km (e) {
  const t = Ye(e);
  if (!(t.byteLength >= 3 && t.getUint16(0, Dt) === 65496 && t.getUint8(2) === 255)) { return null; }
  const {
    tableMarkers: s,
    sofMarkers: r
  } = zm();
  let i = 2;
  for (; i + 9 < t.byteLength;) {
    const o = t.getUint16(i, Dt);
    if (r.has(o)) {
      return {
        mimeType: 'image/jpeg',
        height: t.getUint16(i + 5, Dt),
        width: t.getUint16(i + 7, Dt)
      };
    }
    if (!s.has(o)) { return null; }
    i += 2, i += t.getUint16(i, Dt);
  }
  return null;
}
function zm () {
  const e = /* @__PURE__ */ new Set([65499, 65476, 65484, 65501, 65534]);
  for (let n = 65504; n < 65520; ++n) { e.add(n); }
  return {
    tableMarkers: e,
    sofMarkers: /* @__PURE__ */ new Set([65472, 65473, 65474, 65475, 65477, 65478, 65479, 65481, 65482, 65483, 65485, 65486, 65487, 65502])
  };
}
function Ye (e) {
  if (e instanceof DataView) { return e; }
  if (ArrayBuffer.isView(e)) { return new DataView(e.buffer); }
  if (e instanceof ArrayBuffer) { return new DataView(e); }
  throw new Error('toDataView');
}
async function Wm (e, t) {
  let n;
  const {
    mimeType: s
  } = Mr(e) || {}; const r = (n = globalThis.loaders) === null || n === void 0 ? void 0 : n.parseImageNode;
  return z(r), await r(e, s);
}
async function Xm (e, t, n) {
  t = t || {};
  const r = (t.image || {}).type || 'auto'; const {
    url: i
  } = n || {}; const o = Qm(r);
  let a;
  switch (o) {
    case 'imagebitmap':
      a = await Fm(e, t, i);
      break;
    case 'image':
      a = await Ha(e, t, i);
      break;
    case 'data':
      a = await Wm(e);
      break;
    default:
      z(!1);
  }
  return r === 'data' && (a = Na(a)), a;
}
function Qm (e) {
  switch (e) {
    case 'auto':
    case 'data':
      return wm();
    default:
      return _m(e), e;
  }
}
const qm = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'ico', 'svg', 'avif']; const Ym = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif', 'image/bmp', 'image/vnd.microsoft.icon', 'image/svg+xml']; const $m = {
  image: {
    type: 'auto',
    decode: !0
  }
}; const Zm = {
  id: 'image',
  module: 'images',
  name: 'Images',
  version: Em,
  mimeTypes: Ym,
  extensions: qm,
  parse: Xm,
  tests: [(e) => !!Mr(new DataView(e))],
  options: $m
}; const Ts = {};
function tg (e) {
  if (Ts[e] === void 0) {
    const t = kn ? ng(e) : eg(e);
    Ts[e] = t;
  }
  return Ts[e];
}
function eg (e) {
  let t, n;
  const s = ['image/png', 'image/jpeg', 'image/gif']; const r = ((t = globalThis.loaders) === null || t === void 0 ? void 0 : t.imageFormatsNode) || s;
  return !!((n = globalThis.loaders) === null || n === void 0 ? void 0 : n.parseImageNode) && r.includes(e);
}
function ng (e) {
  switch (e) {
    case 'image/avif':
    case 'image/webp':
      return sg(e);
    default:
      return !0;
  }
}
function sg (e) {
  try {
    return document.createElement('canvas').toDataURL(e).indexOf(`data:${e}`) === 0;
  } catch {
    return !1;
  }
}
function yt (e, t) {
  if (!e) { throw new Error(t || 'assert failed: gltf'); }
}
const Ja = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
}; const Va = {
  5120: 1,
  5121: 1,
  5122: 2,
  5123: 2,
  5125: 4,
  5126: 4
}; const rg = 1.33; const Gi = ['SCALAR', 'VEC2', 'VEC3', 'VEC4']; const ig = [[Int8Array, 5120], [Uint8Array, 5121], [Int16Array, 5122], [Uint16Array, 5123], [Uint32Array, 5125], [Float32Array, 5126], [Float64Array, 5130]]; const og = new Map(ig); const ag = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
}; const cg = {
  5120: 1,
  5121: 1,
  5122: 2,
  5123: 2,
  5125: 4,
  5126: 4
}; const ug = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array
};
function ja (e) {
  return Gi[e - 1] || Gi[0];
}
function Sr (e) {
  const t = og.get(e.constructor);
  if (!t) { throw new Error('Illegal typed array'); }
  return t;
}
function Ir (e, t) {
  const n = ug[e.componentType]; const s = ag[e.type]; const r = cg[e.componentType]; const i = e.count * s; const o = e.count * s * r;
  yt(o >= 0 && o <= t.byteLength);
  const a = Va[e.componentType]; const c = Ja[e.type];
  return {
    ArrayType: n,
    length: i,
    byteLength: o,
    componentByteSize: a,
    numberOfComponentsInElement: c
  };
}
function ka (e) {
  let {
    images: t,
    bufferViews: n
  } = e;
  t = t || [], n = n || [];
  const s = t.map((o) => o.bufferView);
  n = n.filter((o) => !s.includes(o));
  const r = n.reduce((o, a) => o + a.byteLength, 0); const i = t.reduce((o, a) => {
    const {
      width: c,
      height: u
    } = a.image;
    return o + c * u;
  }, 0);
  return r + Math.ceil(4 * i * rg);
}
function lg (e, t, n) {
  const s = e.bufferViews[n];
  yt(s);
  const r = s.buffer; const i = t[r];
  yt(i);
  const o = (s.byteOffset || 0) + i.byteOffset;
  return new Uint8Array(i.arrayBuffer, o, s.byteLength);
}
function hg (e, t, n) {
  let s, r;
  const i = typeof n === 'number' ? (s = e.accessors) === null || s === void 0 ? void 0 : s[n] : n;
  if (!i) { throw new Error(`No gltf accessor ${JSON.stringify(n)}`); }
  const o = (r = e.bufferViews) === null || r === void 0 ? void 0 : r[i.bufferView || 0];
  if (!o) { throw new Error(`No gltf buffer view for accessor ${o}`); }
  const {
    arrayBuffer: a,
    byteOffset: c
  } = t[o.buffer]; const u = (c || 0) + (i.byteOffset || 0) + (o.byteOffset || 0); const {
    ArrayType: l,
    length: h,
    componentByteSize: f,
    numberOfComponentsInElement: d
  } = Ir(i, o); const m = f * d; const g = o.byteStride || m;
  if (typeof o.byteStride > 'u' || o.byteStride === m) { return new l(a, u, h); }
  const y = new l(h);
  for (let E = 0; E < i.count; E++) {
    const R = new l(a, u + E * g, d);
    y.set(R, E * d);
  }
  return y;
}
function fg () {
  return {
    asset: {
      version: '2.0',
      generator: 'loaders.gl'
    },
    buffers: [],
    extensions: {},
    extensionsRequired: [],
    extensionsUsed: []
  };
}
class ot {
  constructor (t) {
    this.gltf = void 0, this.sourceBuffers = void 0, this.byteLength = void 0, this.gltf = {
      json: (t == null ? void 0 : t.json) || fg(),
      buffers: (t == null ? void 0 : t.buffers) || [],
      images: (t == null ? void 0 : t.images) || []
    }, this.sourceBuffers = [], this.byteLength = 0, this.gltf.buffers && this.gltf.buffers[0] && (this.byteLength = this.gltf.buffers[0].byteLength, this.sourceBuffers = [this.gltf.buffers[0]]);
  }

  get json () {
    return this.gltf.json;
  }

  getApplicationData (t) {
    return this.json[t];
  }

  getExtraData (t) {
    return (this.json.extras || {})[t];
  }

  hasExtension (t) {
    const n = this.getUsedExtensions().find((r) => r === t); const s = this.getRequiredExtensions().find((r) => r === t);
    return typeof n === 'string' || typeof s === 'string';
  }

  getExtension (t) {
    const n = this.getUsedExtensions().find((r) => r === t); const s = this.json.extensions || {};
    return n ? s[t] : null;
  }

  getRequiredExtension (t) {
    return this.getRequiredExtensions().find((s) => s === t) ? this.getExtension(t) : null;
  }

  getRequiredExtensions () {
    return this.json.extensionsRequired || [];
  }

  getUsedExtensions () {
    return this.json.extensionsUsed || [];
  }

  getRemovedExtensions () {
    return this.json.extensionsRemoved || [];
  }

  getObjectExtension (t, n) {
    return (t.extensions || {})[n];
  }

  getScene (t) {
    return this.getObject('scenes', t);
  }

  getNode (t) {
    return this.getObject('nodes', t);
  }

  getSkin (t) {
    return this.getObject('skins', t);
  }

  getMesh (t) {
    return this.getObject('meshes', t);
  }

  getMaterial (t) {
    return this.getObject('materials', t);
  }

  getAccessor (t) {
    return this.getObject('accessors', t);
  }

  getTexture (t) {
    return this.getObject('textures', t);
  }

  getSampler (t) {
    return this.getObject('samplers', t);
  }

  getImage (t) {
    return this.getObject('images', t);
  }

  getBufferView (t) {
    return this.getObject('bufferViews', t);
  }

  getBuffer (t) {
    return this.getObject('buffers', t);
  }

  getObject (t, n) {
    if (typeof n === 'object') { return n; }
    const s = this.json[t] && this.json[t][n];
    if (!s) { throw new Error(`glTF file error: Could not find ${t}[${n}]`); }
    return s;
  }

  getTypedArrayForBufferView (t) {
    t = this.getBufferView(t);
    const n = t.buffer; const s = this.gltf.buffers[n];
    yt(s);
    const r = (t.byteOffset || 0) + s.byteOffset;
    return new Uint8Array(s.arrayBuffer, r, t.byteLength);
  }

  getTypedArrayForAccessor (t) {
    const n = this.getAccessor(t);
    return hg(this.gltf.json, this.gltf.buffers, n);
  }

  getTypedArrayForImageData (t) {
    t = this.getAccessor(t);
    const n = this.getBufferView(t.bufferView); const r = this.getBuffer(n.buffer).data; const i = n.byteOffset || 0;
    return new Uint8Array(r, i, n.byteLength);
  }

  addApplicationData (t, n) {
    return this.json[t] = n, this;
  }

  addExtraData (t, n) {
    return this.json.extras = this.json.extras || {}, this.json.extras[t] = n, this;
  }

  addObjectExtension (t, n, s) {
    return t.extensions = t.extensions || {}, t.extensions[n] = s, this.registerUsedExtension(n), this;
  }

  setObjectExtension (t, n, s) {
    const r = t.extensions || {};
    r[n] = s;
  }

  removeObjectExtension (t, n) {
    const s = (t == null ? void 0 : t.extensions) || {};
    if (s[n]) {
      this.json.extensionsRemoved = this.json.extensionsRemoved || [];
      const r = this.json.extensionsRemoved;
      r.includes(n) || r.push(n);
    }
    delete s[n];
  }

  addExtension (t) {
    const n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return yt(n), this.json.extensions = this.json.extensions || {}, this.json.extensions[t] = n, this.registerUsedExtension(t), n;
  }

  addRequiredExtension (t) {
    const n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return yt(n), this.addExtension(t, n), this.registerRequiredExtension(t), n;
  }

  registerUsedExtension (t) {
    this.json.extensionsUsed = this.json.extensionsUsed || [], this.json.extensionsUsed.find((n) => n === t) || this.json.extensionsUsed.push(t);
  }

  registerRequiredExtension (t) {
    this.registerUsedExtension(t), this.json.extensionsRequired = this.json.extensionsRequired || [], this.json.extensionsRequired.find((n) => n === t) || this.json.extensionsRequired.push(t);
  }

  removeExtension (t) {
    let n;
    if ((n = this.json.extensions) !== null && n !== void 0 && n[t]) {
      this.json.extensionsRemoved = this.json.extensionsRemoved || [];
      const s = this.json.extensionsRemoved;
      s.includes(t) || s.push(t);
    }
    this.json.extensions && delete this.json.extensions[t], this.json.extensionsRequired && this._removeStringFromArray(this.json.extensionsRequired, t), this.json.extensionsUsed && this._removeStringFromArray(this.json.extensionsUsed, t);
  }

  setDefaultScene (t) {
    this.json.scene = t;
  }

  addScene (t) {
    const {
      nodeIndices: n
    } = t;
    return this.json.scenes = this.json.scenes || [], this.json.scenes.push({
      nodes: n
    }), this.json.scenes.length - 1;
  }

  addNode (t) {
    const {
      meshIndex: n,
      matrix: s
    } = t;
    this.json.nodes = this.json.nodes || [];
    const r = {
      mesh: n
    };
    return s && (r.matrix = s), this.json.nodes.push(r), this.json.nodes.length - 1;
  }

  addMesh (t) {
    const {
      attributes: n,
      indices: s,
      material: r,
      mode: i = 4
    } = t; const a = {
      primitives: [{
        attributes: this._addAttributes(n),
        mode: i
      }]
    };
    if (s) {
      const c = this._addIndices(s);
      a.primitives[0].indices = c;
    }
    return Number.isFinite(r) && (a.primitives[0].material = r), this.json.meshes = this.json.meshes || [], this.json.meshes.push(a), this.json.meshes.length - 1;
  }

  addPointCloud (t) {
    const s = {
      primitives: [{
        attributes: this._addAttributes(t),
        mode: 0
      }]
    };
    return this.json.meshes = this.json.meshes || [], this.json.meshes.push(s), this.json.meshes.length - 1;
  }

  addImage (t, n) {
    const s = Mr(t); const r = n || (s == null ? void 0 : s.mimeType); const o = {
      bufferView: this.addBufferView(t),
      mimeType: r
    };
    return this.json.images = this.json.images || [], this.json.images.push(o), this.json.images.length - 1;
  }

  addBufferView (t) {
    const n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0; const s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : this.byteLength;
    const r = t.byteLength;
    yt(Number.isFinite(r)), this.sourceBuffers = this.sourceBuffers || [], this.sourceBuffers.push(t);
    const i = {
      buffer: n,
      byteOffset: s,
      byteLength: r
    };
    return this.byteLength += ze(r, 4), this.json.bufferViews = this.json.bufferViews || [], this.json.bufferViews.push(i), this.json.bufferViews.length - 1;
  }

  addAccessor (t, n) {
    const s = {
      bufferView: t,
      type: ja(n.size),
      componentType: n.componentType,
      count: n.count,
      max: n.max,
      min: n.min
    };
    return this.json.accessors = this.json.accessors || [], this.json.accessors.push(s), this.json.accessors.length - 1;
  }

  addBinaryBuffer (t) {
    const n = arguments.length > 1 && arguments[1] !== void 0
      ? arguments[1]
      : {
          size: 3
        };
    const s = this.addBufferView(t);
    let r = {
      min: n.min,
      max: n.max
    };
    (!r.min || !r.max) && (r = this._getAccessorMinMax(t, n.size));
    const i = {
      size: n.size,
      componentType: Sr(t),
      count: Math.round(t.length / n.size),
      min: r.min,
      max: r.max
    };
    return this.addAccessor(s, Object.assign(i, n));
  }

  addTexture (t) {
    const {
      imageIndex: n
    } = t; const s = {
      source: n
    };
    return this.json.textures = this.json.textures || [], this.json.textures.push(s), this.json.textures.length - 1;
  }

  addMaterial (t) {
    return this.json.materials = this.json.materials || [], this.json.materials.push(t), this.json.materials.length - 1;
  }

  createBinaryChunk () {
    let t, n;
    this.gltf.buffers = [];
    const s = this.byteLength; const r = new ArrayBuffer(s); const i = new Uint8Array(r);
    let o = 0;
    for (const a of this.sourceBuffers || []) { o = Nu(a, i, o); }
    (t = this.json) !== null && t !== void 0 && (n = t.buffers) !== null && n !== void 0 && n[0]
      ? this.json.buffers[0].byteLength = s
      : this.json.buffers = [{
        byteLength: s
      }], this.gltf.binary = r, this.sourceBuffers = [r];
  }

  _removeStringFromArray (t, n) {
    let s = !0;
    for (; s;) {
      const r = t.indexOf(n);
      r > -1 ? t.splice(r, 1) : s = !1;
    }
  }

  _addAttributes () {
    const t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    const n = {};
    for (const s in t) {
      const r = t[s]; const i = this._getGltfAttributeName(s); const o = this.addBinaryBuffer(r.value, r);
      n[i] = o;
    }
    return n;
  }

  _addIndices (t) {
    return this.addBinaryBuffer(t, {
      size: 1
    });
  }

  _getGltfAttributeName (t) {
    switch (t.toLowerCase()) {
      case 'position':
      case 'positions':
      case 'vertices':
        return 'POSITION';
      case 'normal':
      case 'normals':
        return 'NORMAL';
      case 'color':
      case 'colors':
        return 'COLOR_0';
      case 'texcoord':
      case 'texcoords':
        return 'TEXCOORD_0';
      default:
        return t;
    }
  }

  _getAccessorMinMax (t, n) {
    const s = {
      min: null,
      max: null
    };
    if (t.length < n) { return s; }
    s.min = [], s.max = [];
    const r = t.subarray(0, n);
    for (const i of r) { s.min.push(i), s.max.push(i); }
    for (let i = n; i < t.length; i += n) {
      for (let o = 0; o < n; o++) { s.min[0 + o] = Math.min(s.min[0 + o], t[i + o]), s.max[0 + o] = Math.max(s.max[0 + o], t[i + o]); }
    }
    return s;
  }
}
function Ni (e) {
  return (e % 1 + 1) % 1;
}
const Ka = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16,
  BOOLEAN: 1,
  STRING: 1,
  ENUM: 1
}; const dg = {
  INT8: Int8Array,
  UINT8: Uint8Array,
  INT16: Int16Array,
  UINT16: Uint16Array,
  INT32: Int32Array,
  UINT32: Uint32Array,
  INT64: BigInt64Array,
  UINT64: BigUint64Array,
  FLOAT32: Float32Array,
  FLOAT64: Float64Array
}; const za = {
  INT8: 1,
  UINT8: 1,
  INT16: 2,
  UINT16: 2,
  INT32: 4,
  UINT32: 4,
  INT64: 8,
  UINT64: 8,
  FLOAT32: 4,
  FLOAT64: 8
};
function xr (e, t) {
  return za[t] * Ka[e];
}
function Yn (e, t, n, s) {
  if (n !== 'UINT8' && n !== 'UINT16' && n !== 'UINT32' && n !== 'UINT64') { return null; }
  const r = e.getTypedArrayForBufferView(t); const i = $n(r, 'SCALAR', n, s + 1);
  return i instanceof BigInt64Array || i instanceof BigUint64Array ? null : i;
}
function $n (e, t, n) {
  const s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 1;
  const r = Ka[t]; const i = dg[n]; const o = za[n]; const a = s * r; const c = a * o;
  let u = e.buffer; let l = e.byteOffset;
  return l % o !== 0 && (u = new Uint8Array(u).slice(l, l + c).buffer, l = 0), new i(u, l, a);
}
function vr (e, t, n) {
  let s, r;
  const i = `TEXCOORD_${t.texCoord || 0}`; const o = n.attributes[i]; const a = e.getTypedArrayForAccessor(o); const c = e.gltf.json; const u = t.index; const l = (s = c.textures) === null || s === void 0 || (r = s[u]) === null || r === void 0 ? void 0 : r.source;
  if (typeof l < 'u') {
    let h, f, d;
    const m = (h = c.images) === null || h === void 0 || (f = h[l]) === null || f === void 0 ? void 0 : f.mimeType; const g = (d = e.gltf.images) === null || d === void 0 ? void 0 : d[l];
    if (g && typeof g.width < 'u') {
      const y = [];
      for (let E = 0; E < a.length; E += 2) {
        const R = mg(g, m, a, E, t.channels);
        y.push(R);
      }
      return y;
    }
  }
  return [];
}
function Wa (e, t, n, s, r) {
  if (!(n != null && n.length)) { return; }
  const i = [];
  for (const l of n) {
    let h = s.findIndex((f) => f === l);
    h === -1 && (h = s.push(l) - 1), i.push(h);
  }
  const o = new Uint32Array(i); const a = e.gltf.buffers.push({
    arrayBuffer: o.buffer,
    byteOffset: o.byteOffset,
    byteLength: o.byteLength
  }) - 1; const c = e.addBufferView(o, a, 0); const u = e.addAccessor(c, {
    size: 1,
    componentType: Sr(o),
    count: o.length
  });
  r.attributes[t] = u;
}
function mg (e, t, n, s) {
  const r = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : [0];
  const i = {
    r: {
      offset: 0,
      shift: 0
    },
    g: {
      offset: 1,
      shift: 8
    },
    b: {
      offset: 2,
      shift: 16
    },
    a: {
      offset: 3,
      shift: 24
    }
  }; const o = n[s]; const a = n[s + 1];
  let c = 1;
  t && (t.indexOf('image/jpeg') !== -1 || t.indexOf('image/png') !== -1) && (c = 4);
  const u = gg(o, a, e, c);
  let l = 0;
  for (const h of r) {
    const f = typeof h === 'number' ? Object.values(i)[h] : i[h]; const d = u + f.offset; const m = Na(e);
    if (m.data.length <= d) { throw new Error(`${m.data.length} <= ${d}`); }
    const g = m.data[d];
    l |= g << f.shift;
  }
  return l;
}
function gg (e, t, n) {
  const s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 1;
  const r = n.width; const i = Ni(e) * (r - 1); const o = Math.round(i); const a = n.height; const c = Ni(t) * (a - 1); const u = Math.round(c); const l = n.components ? n.components : s;
  return (u * r + o) * l;
}
function Xa (e, t, n, s, r) {
  const i = [];
  for (let o = 0; o < t; o++) {
    const a = n[o]; const c = n[o + 1] - n[o];
    if (c + a > s) { break; }
    const u = a / r; const l = c / r;
    i.push(e.slice(u, u + l));
  }
  return i;
}
function Qa (e, t, n) {
  const s = [];
  for (let r = 0; r < t; r++) {
    const i = r * n;
    s.push(e.slice(i, i + n));
  }
  return s;
}
function qa (e, t, n, s) {
  if (n) { throw new Error('Not implemented - arrayOffsets for strings is specified'); }
  if (s) {
    const r = []; const i = new TextDecoder('utf8');
    let o = 0;
    for (let a = 0; a < e; a++) {
      const c = s[a + 1] - s[a];
      if (c + o <= t.length) {
        const u = t.subarray(o, c + o); const l = i.decode(u);
        r.push(l), o += c;
      }
    }
    return r;
  }
  return [];
}
const Ya = 'EXT_mesh_features'; const Ag = Ya;
async function pg (e, t) {
  const n = new ot(e);
  yg(n, t);
}
function yg (e, t) {
  const n = e.gltf.json;
  if (n.meshes) {
    for (const s of n.meshes) {
      for (const r of s.primitives) { Bg(e, r, t); }
    }
  }
}
function Bg (e, t, n) {
  let s, r;
  if (!(n != null && (s = n.gltf) !== null && s !== void 0 && s.loadBuffers)) { return; }
  const i = (r = t.extensions) === null || r === void 0 ? void 0 : r[Ya]; const o = i == null ? void 0 : i.featureIds;
  if (o) {
    for (const c of o) {
      var a;
      let u;
      if (typeof c.attribute < 'u') {
        const l = `_FEATURE_ID_${c.attribute}`; const h = t.attributes[l];
        u = e.getTypedArrayForAccessor(h);
      } else { typeof c.texture < 'u' && n !== null && n !== void 0 && (a = n.gltf) !== null && a !== void 0 && a.loadImages ? u = vr(e, c.texture, t) : u = []; }
      c.data = u;
    }
  }
}
const Cg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  decode: pg,
  name: Ag
}, Symbol.toStringTag, { value: 'Module' })); const Or = 'EXT_structural_metadata'; const Eg = Or;
async function Tg (e, t) {
  const n = new ot(e);
  bg(n, t);
}
function bg (e, t) {
  let n, s;
  if (!((n = t.gltf) !== null && n !== void 0 && n.loadBuffers)) { return; }
  const r = e.getExtension(Or);
  r && ((s = t.gltf) !== null && s !== void 0 && s.loadImages && _g(e, r), wg(e, r));
}
function _g (e, t) {
  const n = t.propertyTextures; const s = e.gltf.json;
  if (n && s.meshes) {
    for (const r of s.meshes) {
      for (const i of r.primitives) { Mg(e, n, i, t); }
    }
  }
}
function wg (e, t) {
  const n = t.schema;
  if (!n) { return; }
  const s = n.classes; const r = t.propertyTables;
  if (s && r) {
    for (const i in s) {
      const o = Rg(r, i);
      o && Ig(e, n, o);
    }
  }
}
function Rg (e, t) {
  for (const n of e) {
    if (n.class === t) { return n; }
  }
  return null;
}
function Mg (e, t, n, s) {
  let r;
  if (!t) { return; }
  const i = (r = n.extensions) === null || r === void 0 ? void 0 : r[Or]; const o = i == null ? void 0 : i.propertyTextures;
  if (o) {
    for (const a of o) {
      const c = t[a];
      Sg(e, c, n, s);
    }
  }
}
function Sg (e, t, n, s) {
  if (!t.properties) { return; }
  s.dataAttributeNames || (s.dataAttributeNames = []);
  const r = t.class;
  for (const o in t.properties) {
    var i;
    const a = `${r}_${o}`; const c = (i = t.properties) === null || i === void 0 ? void 0 : i[o];
    if (!c) { continue; }
    c.data || (c.data = []);
    const u = c.data; const l = vr(e, c, n);
    l !== null && (Wa(e, a, l, u, n), c.data = u, s.dataAttributeNames.push(a));
  }
}
function Ig (e, t, n) {
  let s;
  const r = (s = t.classes) === null || s === void 0 ? void 0 : s[n.class];
  if (!r) { throw new Error(`Incorrect data in the EXT_structural_metadata extension: no schema class with name ${n.class}`); }
  const i = n.count;
  for (const a in r.properties) {
    var o;
    const c = r.properties[a]; const u = (o = n.properties) === null || o === void 0 ? void 0 : o[a];
    if (u) {
      const l = xg(e, t, c, i, u);
      u.data = l;
    }
  }
}
function xg (e, t, n, s, r) {
  let i = [];
  const o = r.values; const a = e.getTypedArrayForBufferView(o); const c = vg(e, n, r, s); const u = Og(e, r, s);
  switch (n.type) {
    case 'SCALAR':
    case 'VEC2':
    case 'VEC3':
    case 'VEC4':
    case 'MAT2':
    case 'MAT3':
    case 'MAT4': {
      i = Fg(n, s, a, c);
      break;
    }
    case 'BOOLEAN':
      throw new Error(`Not implemented - classProperty.type=${n.type}`);
    case 'STRING': {
      i = qa(s, a, c, u);
      break;
    }
    case 'ENUM': {
      i = Dg(t, n, s, a, c);
      break;
    }
    default:
      throw new Error(`Unknown classProperty type ${n.type}`);
  }
  return i;
}
function vg (e, t, n, s) {
  return t.array && typeof t.count > 'u' && typeof n.arrayOffsets < 'u' ? Yn(e, n.arrayOffsets, n.arrayOffsetType || 'UINT32', s) : null;
}
function Og (e, t, n) {
  return typeof t.stringOffsets < 'u' ? Yn(e, t.stringOffsets, t.stringOffsetType || 'UINT32', n) : null;
}
function Fg (e, t, n, s) {
  const r = e.array; const i = e.count; const o = xr(e.type, e.componentType); const a = n.byteLength / o;
  let c;
  return e.componentType ? c = $n(n, e.type, e.componentType, a) : c = n, r ? s ? Xa(c, t, s, n.length, o) : i ? Qa(c, t, i) : [] : c;
}
function Dg (e, t, n, s, r) {
  let i;
  const o = t.enumType;
  if (!o) { throw new Error('Incorrect data in the EXT_structural_metadata extension: classProperty.enumType is not set for type ENUM'); }
  const a = (i = e.enums) === null || i === void 0 ? void 0 : i[o];
  if (!a) { throw new Error(`Incorrect data in the EXT_structural_metadata extension: schema.enums does't contain ${o}`); }
  const c = a.valueType || 'UINT16'; const u = xr(t.type, c); const l = s.byteLength / u;
  let h = $n(s, t.type, c, l);
  if (h || (h = s), t.array) {
    if (r) {
      return Lg({
        valuesData: h,
        numberOfElements: n,
        arrayOffsets: r,
        valuesDataBytesLength: s.length,
        elementSize: u,
        enumEntry: a
      });
    }
    const f = t.count;
    return f ? Pg(h, n, f, a) : [];
  }
  return Fr(h, 0, n, a);
}
function Lg (e) {
  const {
    valuesData: t,
    numberOfElements: n,
    arrayOffsets: s,
    valuesDataBytesLength: r,
    elementSize: i,
    enumEntry: o
  } = e; const a = [];
  for (let c = 0; c < n; c++) {
    const u = s[c]; const l = s[c + 1] - s[c];
    if (l + u > r) { break; }
    const h = u / i; const f = l / i; const d = Fr(t, h, f, o);
    a.push(d);
  }
  return a;
}
function Pg (e, t, n, s) {
  const r = [];
  for (let i = 0; i < t; i++) {
    const o = n * i; const a = Fr(e, o, n, s);
    r.push(a);
  }
  return r;
}
function Fr (e, t, n, s) {
  const r = [];
  for (let i = 0; i < n; i++) {
    if (e instanceof BigInt64Array || e instanceof BigUint64Array) { r.push(''); } else {
      const o = e[t + i]; const a = Gg(s, o);
      a ? r.push(a.name) : r.push('');
    }
  }
  return r;
}
function Gg (e, t) {
  for (const n of e.values) {
    if (n.value === t) { return n; }
  }
  return null;
}
const Ng = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  decode: Tg,
  name: Eg
}, Symbol.toStringTag, { value: 'Module' })); const $a = 'EXT_feature_metadata'; const Ug = $a;
async function Hg (e, t) {
  const n = new ot(e);
  Jg(n, t);
}
function Jg (e, t) {
  let n, s;
  if (!((n = t.gltf) !== null && n !== void 0 && n.loadBuffers)) { return; }
  const r = e.getExtension($a);
  r && ((s = t.gltf) !== null && s !== void 0 && s.loadImages && Vg(e, r), jg(e, r));
}
function Vg (e, t) {
  const n = t.schema;
  if (!n) { return; }
  const s = n.classes; const {
    featureTextures: r
  } = t;
  if (s && r) {
    for (const i in s) {
      const o = s[i]; const a = Kg(r, i);
      a && Wg(e, a, o);
    }
  }
}
function jg (e, t) {
  const n = t.schema;
  if (!n) { return; }
  const s = n.classes; const r = t.featureTables;
  if (s && r) {
    for (const i in s) {
      const o = kg(r, i);
      o && zg(e, n, o);
    }
  }
}
function kg (e, t) {
  for (const n in e) {
    const s = e[n];
    if (s.class === t) { return s; }
  }
  return null;
}
function Kg (e, t) {
  for (const n in e) {
    const s = e[n];
    if (s.class === t) { return s; }
  }
  return null;
}
function zg (e, t, n) {
  let s;
  if (!n.class) { return; }
  const r = (s = t.classes) === null || s === void 0 ? void 0 : s[n.class];
  if (!r) { throw new Error(`Incorrect data in the EXT_structural_metadata extension: no schema class with name ${n.class}`); }
  const i = n.count;
  for (const a in r.properties) {
    var o;
    const c = r.properties[a]; const u = (o = n.properties) === null || o === void 0 ? void 0 : o[a];
    if (u) {
      const l = Xg(e, t, c, i, u);
      u.data = l;
    }
  }
}
function Wg (e, t, n) {
  const s = t.class;
  for (const i in n.properties) {
    var r;
    const o = t == null || (r = t.properties) === null || r === void 0 ? void 0 : r[i];
    if (o) {
      const a = Zg(e, o, s);
      o.data = a;
    }
  }
}
function Xg (e, t, n, s, r) {
  let i = [];
  const o = r.bufferView; const a = e.getTypedArrayForBufferView(o); const c = Qg(e, n, r, s); const u = qg(e, n, r, s);
  return n.type === 'STRING' || n.componentType === 'STRING' ? i = qa(s, a, c, u) : Yg(n) && (i = $g(n, s, a, c)), i;
}
function Qg (e, t, n, s) {
  return t.type === 'ARRAY' && typeof t.componentCount > 'u' && typeof n.arrayOffsetBufferView < 'u' ? Yn(e, n.arrayOffsetBufferView, n.offsetType || 'UINT32', s) : null;
}
function qg (e, t, n, s) {
  return typeof n.stringOffsetBufferView < 'u' ? Yn(e, n.stringOffsetBufferView, n.offsetType || 'UINT32', s) : null;
}
function Yg (e) {
  const t = ['UINT8', 'INT16', 'UINT16', 'INT32', 'UINT32', 'INT64', 'UINT64', 'FLOAT32', 'FLOAT64'];
  return t.includes(e.type) || typeof e.componentType < 'u' && t.includes(e.componentType);
}
function $g (e, t, n, s) {
  const r = e.type === 'ARRAY'; const i = e.componentCount; const o = 'SCALAR'; const a = e.componentType || e.type; const c = xr(o, a); const u = n.byteLength / c; const l = $n(n, o, a, u);
  return r ? s ? Xa(l, t, s, n.length, c) : i ? Qa(l, t, i) : [] : l;
}
function Zg (e, t, n) {
  const s = e.gltf.json;
  if (!s.meshes) { return []; }
  const r = [];
  for (const i of s.meshes) {
    for (const o of i.primitives) { t0(e, n, t, r, o); }
  }
  return r;
}
function t0 (e, t, n, s, r) {
  const i = {
    channels: n.channels,
    ...n.texture
  }; const o = vr(e, i, r);
  o && Wa(e, t, o, s, r);
}
const e0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  decode: Hg,
  name: Ug
}, Symbol.toStringTag, { value: 'Module' })); const n0 = '4.1.1'; const s0 = '4.1.1'; const Ln = {
  TRANSCODER: 'basis_transcoder.js',
  TRANSCODER_WASM: 'basis_transcoder.wasm',
  ENCODER: 'basis_encoder.js',
  ENCODER_WASM: 'basis_encoder.wasm'
};
let bs;
async function Ui (e) {
  const t = e.modules || {};
  return t.basis ? t.basis : (bs = bs || r0(e), await bs);
}
async function r0 (e) {
  let t = null; let n = null;
  return [t, n] = await Promise.all([await Zt(Ln.TRANSCODER, 'textures', e), await Zt(Ln.TRANSCODER_WASM, 'textures', e)]), t = t || globalThis.BASIS, await i0(t, n);
}
function i0 (e, t) {
  const n = {};
  return t && (n.wasmBinary = t), new Promise((s) => {
    e(n).then((r) => {
      const {
        BasisFile: i,
        initializeBasis: o
      } = r;
      o(), s({
        BasisFile: i
      });
    });
  });
}
let _s;
async function Hi (e) {
  const t = e.modules || {};
  return t.basisEncoder ? t.basisEncoder : (_s = _s || o0(e), await _s);
}
async function o0 (e) {
  let t = null; let n = null;
  return [t, n] = await Promise.all([await Zt(Ln.ENCODER, 'textures', e), await Zt(Ln.ENCODER_WASM, 'textures', e)]), t = t || globalThis.BASIS, await a0(t, n);
}
function a0 (e, t) {
  const n = {};
  return t && (n.wasmBinary = t), new Promise((s) => {
    e(n).then((r) => {
      const {
        BasisFile: i,
        KTX2File: o,
        initializeBasis: a,
        BasisEncoder: c
      } = r;
      a(), s({
        BasisFile: i,
        KTX2File: o,
        BasisEncoder: c
      });
    });
  });
}
const he = {
  COMPRESSED_RGB_S3TC_DXT1_EXT: 33776,
  COMPRESSED_RGBA_S3TC_DXT1_EXT: 33777,
  COMPRESSED_RGBA_S3TC_DXT3_EXT: 33778,
  COMPRESSED_RGBA_S3TC_DXT5_EXT: 33779,
  COMPRESSED_R11_EAC: 37488,
  COMPRESSED_SIGNED_R11_EAC: 37489,
  COMPRESSED_RG11_EAC: 37490,
  COMPRESSED_SIGNED_RG11_EAC: 37491,
  COMPRESSED_RGB8_ETC2: 37492,
  COMPRESSED_RGBA8_ETC2_EAC: 37493,
  COMPRESSED_SRGB8_ETC2: 37494,
  COMPRESSED_SRGB8_ALPHA8_ETC2_EAC: 37495,
  COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2: 37496,
  COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2: 37497,
  COMPRESSED_RGB_PVRTC_4BPPV1_IMG: 35840,
  COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: 35842,
  COMPRESSED_RGB_PVRTC_2BPPV1_IMG: 35841,
  COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: 35843,
  COMPRESSED_RGB_ETC1_WEBGL: 36196,
  COMPRESSED_RGB_ATC_WEBGL: 35986,
  COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL: 35987,
  COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL: 34798,
  COMPRESSED_RGBA_ASTC_4X4_KHR: 37808,
  COMPRESSED_RGBA_ASTC_5X4_KHR: 37809,
  COMPRESSED_RGBA_ASTC_5X5_KHR: 37810,
  COMPRESSED_RGBA_ASTC_6X5_KHR: 37811,
  COMPRESSED_RGBA_ASTC_6X6_KHR: 37812,
  COMPRESSED_RGBA_ASTC_8X5_KHR: 37813,
  COMPRESSED_RGBA_ASTC_8X6_KHR: 37814,
  COMPRESSED_RGBA_ASTC_8X8_KHR: 37815,
  COMPRESSED_RGBA_ASTC_10X5_KHR: 37816,
  COMPRESSED_RGBA_ASTC_10X6_KHR: 37817,
  COMPRESSED_RGBA_ASTC_10X8_KHR: 37818,
  COMPRESSED_RGBA_ASTC_10X10_KHR: 37819,
  COMPRESSED_RGBA_ASTC_12X10_KHR: 37820,
  COMPRESSED_RGBA_ASTC_12X12_KHR: 37821,
  COMPRESSED_SRGB8_ALPHA8_ASTC_4X4_KHR: 37840,
  COMPRESSED_SRGB8_ALPHA8_ASTC_5X4_KHR: 37841,
  COMPRESSED_SRGB8_ALPHA8_ASTC_5X5_KHR: 37842,
  COMPRESSED_SRGB8_ALPHA8_ASTC_6X5_KHR: 37843,
  COMPRESSED_SRGB8_ALPHA8_ASTC_6X6_KHR: 37844,
  COMPRESSED_SRGB8_ALPHA8_ASTC_8X5_KHR: 37845,
  COMPRESSED_SRGB8_ALPHA8_ASTC_8X6_KHR: 37846,
  COMPRESSED_SRGB8_ALPHA8_ASTC_8X8_KHR: 37847,
  COMPRESSED_SRGB8_ALPHA8_ASTC_10X5_KHR: 37848,
  COMPRESSED_SRGB8_ALPHA8_ASTC_10X6_KHR: 37849,
  COMPRESSED_SRGB8_ALPHA8_ASTC_10X8_KHR: 37850,
  COMPRESSED_SRGB8_ALPHA8_ASTC_10X10_KHR: 37851,
  COMPRESSED_SRGB8_ALPHA8_ASTC_12X10_KHR: 37852,
  COMPRESSED_SRGB8_ALPHA8_ASTC_12X12_KHR: 37853,
  COMPRESSED_RED_RGTC1_EXT: 36283,
  COMPRESSED_SIGNED_RED_RGTC1_EXT: 36284,
  COMPRESSED_RED_GREEN_RGTC2_EXT: 36285,
  COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT: 36286,
  COMPRESSED_SRGB_S3TC_DXT1_EXT: 35916,
  COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT: 35917,
  COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT: 35918,
  COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT: 35919
}; const c0 = ['', 'WEBKIT_', 'MOZ_']; const Ji = {
  WEBGL_compressed_texture_s3tc: 'dxt',
  WEBGL_compressed_texture_s3tc_srgb: 'dxt-srgb',
  WEBGL_compressed_texture_etc1: 'etc1',
  WEBGL_compressed_texture_etc: 'etc2',
  WEBGL_compressed_texture_pvrtc: 'pvrtc',
  WEBGL_compressed_texture_atc: 'atc',
  WEBGL_compressed_texture_astc: 'astc',
  EXT_texture_compression_rgtc: 'rgtc'
};
let gn = null;
function u0 (e) {
  if (!gn) {
    e = e || l0() || void 0, gn = /* @__PURE__ */ new Set();
    for (const t of c0) {
      for (const n in Ji) {
        if (e && e.getExtension(`${t}${n}`)) {
          const s = Ji[n];
          gn.add(s);
        }
      }
    }
  }
  return gn;
}
function l0 () {
  try {
    return document.createElement('canvas').getContext('webgl');
  } catch {
    return null;
  }
}
let Vi, ji, ki, Ki, zi, Wi, Xi, Qi;
(function (e) {
  e[e.NONE = 0] = 'NONE', e[e.BASISLZ = 1] = 'BASISLZ', e[e.ZSTD = 2] = 'ZSTD', e[e.ZLIB = 3] = 'ZLIB';
})(Vi || (Vi = {})), (function (e) {
  e[e.BASICFORMAT = 0] = 'BASICFORMAT';
}(ji || (ji = {}))), (function (e) {
  e[e.UNSPECIFIED = 0] = 'UNSPECIFIED', e[e.ETC1S = 163] = 'ETC1S', e[e.UASTC = 166] = 'UASTC';
}(ki || (ki = {}))), (function (e) {
  e[e.UNSPECIFIED = 0] = 'UNSPECIFIED', e[e.SRGB = 1] = 'SRGB';
}(Ki || (Ki = {}))), (function (e) {
  e[e.UNSPECIFIED = 0] = 'UNSPECIFIED', e[e.LINEAR = 1] = 'LINEAR', e[e.SRGB = 2] = 'SRGB', e[e.ITU = 3] = 'ITU', e[e.NTSC = 4] = 'NTSC', e[e.SLOG = 5] = 'SLOG', e[e.SLOG2 = 6] = 'SLOG2';
}(zi || (zi = {}))), (function (e) {
  e[e.ALPHA_STRAIGHT = 0] = 'ALPHA_STRAIGHT', e[e.ALPHA_PREMULTIPLIED = 1] = 'ALPHA_PREMULTIPLIED';
}(Wi || (Wi = {}))), (function (e) {
  e[e.RGB = 0] = 'RGB', e[e.RRR = 3] = 'RRR', e[e.GGG = 4] = 'GGG', e[e.AAA = 15] = 'AAA';
}(Xi || (Xi = {}))), (function (e) {
  e[e.RGB = 0] = 'RGB', e[e.RGBA = 3] = 'RGBA', e[e.RRR = 4] = 'RRR', e[e.RRRG = 5] = 'RRRG';
}(Qi || (Qi = {})));
const gt = [171, 75, 84, 88, 32, 50, 48, 187, 13, 10, 26, 10];
function h0 (e) {
  const t = new Uint8Array(e);
  return !(t.byteLength < gt.length || t[0] !== gt[0] || t[1] !== gt[1] || t[2] !== gt[2] || t[3] !== gt[3] || t[4] !== gt[4] || t[5] !== gt[5] || t[6] !== gt[6] || t[7] !== gt[7] || t[8] !== gt[8] || t[9] !== gt[9] || t[10] !== gt[10] || t[11] !== gt[11]);
}
const f0 = {
  etc1: {
    basisFormat: 0,
    compressed: !0,
    format: he.COMPRESSED_RGB_ETC1_WEBGL
  },
  etc2: {
    basisFormat: 1,
    compressed: !0
  },
  bc1: {
    basisFormat: 2,
    compressed: !0,
    format: he.COMPRESSED_RGB_S3TC_DXT1_EXT
  },
  bc3: {
    basisFormat: 3,
    compressed: !0,
    format: he.COMPRESSED_RGBA_S3TC_DXT5_EXT
  },
  bc4: {
    basisFormat: 4,
    compressed: !0
  },
  bc5: {
    basisFormat: 5,
    compressed: !0
  },
  'bc7-m6-opaque-only': {
    basisFormat: 6,
    compressed: !0
  },
  'bc7-m5': {
    basisFormat: 7,
    compressed: !0
  },
  'pvrtc1-4-rgb': {
    basisFormat: 8,
    compressed: !0,
    format: he.COMPRESSED_RGB_PVRTC_4BPPV1_IMG
  },
  'pvrtc1-4-rgba': {
    basisFormat: 9,
    compressed: !0,
    format: he.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG
  },
  'astc-4x4': {
    basisFormat: 10,
    compressed: !0,
    format: he.COMPRESSED_RGBA_ASTC_4X4_KHR
  },
  'atc-rgb': {
    basisFormat: 11,
    compressed: !0
  },
  'atc-rgba-interpolated-alpha': {
    basisFormat: 12,
    compressed: !0
  },
  rgba32: {
    basisFormat: 13,
    compressed: !1
  },
  rgb565: {
    basisFormat: 14,
    compressed: !1
  },
  bgr565: {
    basisFormat: 15,
    compressed: !1
  },
  rgba4444: {
    basisFormat: 16,
    compressed: !1
  }
};
async function d0 (e, t) {
  if (t.basis.containerFormat === 'auto') {
    if (h0(e)) {
      const s = await Hi(t);
      return qi(s.KTX2File, e, t);
    }
    const {
      BasisFile: n
    } = await Ui(t);
    return ws(n, e, t);
  }
  switch (t.basis.module) {
    case 'encoder':
      const n = await Hi(t);
      switch (t.basis.containerFormat) {
        case 'ktx2':
          return qi(n.KTX2File, e, t);
        case 'basis':
        default:
          return ws(n.BasisFile, e, t);
      }
    case 'transcoder':
    default:
      const {
        BasisFile: s
      } = await Ui(t);
      return ws(s, e, t);
  }
}
function ws (e, t, n) {
  const s = new e(new Uint8Array(t));
  try {
    if (!s.startTranscoding()) { throw new Error('Failed to start basis transcoding'); }
    const r = s.getNumImages(); const i = [];
    for (let o = 0; o < r; o++) {
      const a = s.getNumLevels(o); const c = [];
      for (let u = 0; u < a; u++) { c.push(m0(s, o, u, n)); }
      i.push(c);
    }
    return i;
  } finally {
    s.close(), s.delete();
  }
}
function m0 (e, t, n, s) {
  const r = e.getImageWidth(t, n); const i = e.getImageHeight(t, n); const o = e.getHasAlpha(); const {
    compressed: a,
    format: c,
    basisFormat: u
  } = Za(s, o); const l = e.getImageTranscodedSizeInBytes(t, n, u); const h = new Uint8Array(l);
  if (!e.transcodeImage(h, t, n, u, 0, 0)) { throw new Error('failed to start Basis transcoding'); }
  return {
    width: r,
    height: i,
    data: h,
    compressed: a,
    format: c,
    hasAlpha: o
  };
}
function qi (e, t, n) {
  const s = new e(new Uint8Array(t));
  try {
    if (!s.startTranscoding()) { throw new Error('failed to start KTX2 transcoding'); }
    const r = s.getLevels(); const i = [];
    for (let o = 0; o < r; o++) {
      i.push(g0(s, o, n));
      break;
    }
    return [i];
  } finally {
    s.close(), s.delete();
  }
}
function g0 (e, t, n) {
  const {
    alphaFlag: s,
    height: r,
    width: i
  } = e.getImageLevelInfo(t, 0, 0); const {
    compressed: o,
    format: a,
    basisFormat: c
  } = Za(n, s); const u = e.getImageTranscodedSizeInBytes(t, 0, 0, c); const l = new Uint8Array(u);
  if (!e.transcodeImage(l, t, 0, 0, c, 0, -1, -1)) { throw new Error('Failed to transcode KTX2 image'); }
  return {
    width: i,
    height: r,
    data: l,
    compressed: o,
    levelSize: u,
    hasAlpha: s,
    format: a
  };
}
function Za (e, t) {
  let n = e && e.basis && e.basis.format;
  return n === 'auto' && (n = tc()), typeof n === 'object' && (n = t ? n.alpha : n.noAlpha), n = n.toLowerCase(), f0[n];
}
function tc () {
  const e = u0();
  return e.has('astc')
    ? 'astc-4x4'
    : e.has('dxt')
      ? {
          alpha: 'bc3',
          noAlpha: 'bc1'
        }
      : e.has('pvrtc')
        ? {
            alpha: 'pvrtc1-4-rgba',
            noAlpha: 'pvrtc1-4-rgb'
          }
        : e.has('etc1') ? 'etc1' : e.has('etc2') ? 'etc2' : 'rgb565';
}
const A0 = {
  name: 'Basis',
  id: 'basis',
  module: 'textures',
  version: s0,
  worker: !0,
  extensions: ['basis', 'ktx2'],
  mimeTypes: ['application/octet-stream', 'image/ktx2'],
  tests: ['sB'],
  binary: !0,
  options: {
    basis: {
      format: 'auto',
      libraryPath: 'libs/',
      containerFormat: 'auto',
      module: 'transcoder'
    }
  }
}; const p0 = {
  ...A0,
  parse: d0
}; const pe = !0; const Yi = 1735152710; const Dr = 12; const Pn = 8; const y0 = 1313821514; const B0 = 5130562; const C0 = 0; const E0 = 0; const T0 = 1;
function b0 (e) {
  const t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  return `${String.fromCharCode(e.getUint8(t + 0))}${String.fromCharCode(e.getUint8(t + 1))}${String.fromCharCode(e.getUint8(t + 2))}${String.fromCharCode(e.getUint8(t + 3))}`;
}
function _0 (e) {
  const t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0; const n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  const s = new DataView(e); const {
    magic: r = Yi
  } = n; const i = s.getUint32(t, !1);
  return i === r || i === Yi;
}
function w0 (e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
  const s = new DataView(t); const r = b0(s, n + 0); const i = s.getUint32(n + 4, pe); const o = s.getUint32(n + 8, pe);
  switch (Object.assign(e, {
    header: {
      byteOffset: n,
      byteLength: o,
      hasBinChunk: !1
    },
    type: r,
    version: i,
    json: {},
    binChunks: []
  }), n += Dr, e.version) {
    case 1:
      return R0(e, s, n);
    case 2:
      return M0(e, s, n, {});
    default:
      throw new Error(`Invalid GLB version ${e.version}. Only supports version 1 and 2.`);
  }
}
function R0 (e, t, n) {
  z(e.header.byteLength > Dr + Pn);
  const s = t.getUint32(n + 0, pe); const r = t.getUint32(n + 4, pe);
  return n += Pn, z(r === C0), Ys(e, t, n, s), n += s, n += $s(e, t, n, e.header.byteLength), n;
}
function M0 (e, t, n, s) {
  return z(e.header.byteLength > Dr + Pn), S0(e, t, n, s), n + e.header.byteLength;
}
function S0 (e, t, n, s) {
  for (; n + 8 <= e.header.byteLength;) {
    const r = t.getUint32(n + 0, pe); const i = t.getUint32(n + 4, pe);
    switch (n += Pn, i) {
      case y0:
        Ys(e, t, n, r);
        break;
      case B0:
        $s(e, t, n, r);
        break;
      case E0:
        s.strict || Ys(e, t, n, r);
        break;
      case T0:
        s.strict || $s(e, t, n, r);
        break;
    }
    n += ze(r, 4);
  }
  return n;
}
function Ys (e, t, n, s) {
  const r = new Uint8Array(t.buffer, n, s); const o = new TextDecoder('utf8').decode(r);
  return e.json = JSON.parse(o), ze(s, 4);
}
function $s (e, t, n, s) {
  return e.header.hasBinChunk = !0, e.binChunks.push({
    byteOffset: n,
    byteLength: s,
    arrayBuffer: t.buffer
  }), ze(s, 4);
}
function ec (e, t) {
  if (e.startsWith('data:') || e.startsWith('http:') || e.startsWith('https:')) { return e; }
  const s = t.baseUri || t.uri;
  if (!s) { throw new Error(`'baseUri' must be provided to resolve relative url ${e}`); }
  return s.substr(0, s.lastIndexOf('/') + 1) + e;
}
const I0 = 'B9h9z9tFBBBF8fL9gBB9gLaaaaaFa9gEaaaB9gFaFa9gEaaaFaEMcBFFFGGGEIIILF9wFFFLEFBFKNFaFCx/IFMO/LFVK9tv9t9vq95GBt9f9f939h9z9t9f9j9h9s9s9f9jW9vq9zBBp9tv9z9o9v9wW9f9kv9j9v9kv9WvqWv94h919m9mvqBF8Z9tv9z9o9v9wW9f9kv9j9v9kv9J9u9kv94h919m9mvqBGy9tv9z9o9v9wW9f9kv9j9v9kv9J9u9kv949TvZ91v9u9jvBEn9tv9z9o9v9wW9f9kv9j9v9kv69p9sWvq9P9jWBIi9tv9z9o9v9wW9f9kv9j9v9kv69p9sWvq9R919hWBLn9tv9z9o9v9wW9f9kv9j9v9kv69p9sWvq9F949wBKI9z9iqlBOc+x8ycGBM/qQFTa8jUUUUBCU/EBlHL8kUUUUBC9+RKGXAGCFJAI9LQBCaRKAE2BBC+gF9HQBALAEAIJHOAGlAGTkUUUBRNCUoBAG9uC/wgBZHKCUGAKCUG9JyRVAECFJRICBRcGXEXAcAF9PQFAVAFAclAcAVJAF9JyRMGXGXAG9FQBAMCbJHKC9wZRSAKCIrCEJCGrRQANCUGJRfCBRbAIRTEXGXAOATlAQ9PQBCBRISEMATAQJRIGXAS9FQBCBRtCBREEXGXAOAIlCi9PQBCBRISLMANCU/CBJAEJRKGXGXGXGXGXATAECKrJ2BBAtCKZrCEZfIBFGEBMAKhB83EBAKCNJhB83EBSEMAKAI2BIAI2BBHmCKrHYAYCE6HYy86BBAKCFJAICIJAYJHY2BBAmCIrCEZHPAPCE6HPy86BBAKCGJAYAPJHY2BBAmCGrCEZHPAPCE6HPy86BBAKCEJAYAPJHY2BBAmCEZHmAmCE6Hmy86BBAKCIJAYAmJHY2BBAI2BFHmCKrHPAPCE6HPy86BBAKCLJAYAPJHY2BBAmCIrCEZHPAPCE6HPy86BBAKCKJAYAPJHY2BBAmCGrCEZHPAPCE6HPy86BBAKCOJAYAPJHY2BBAmCEZHmAmCE6Hmy86BBAKCNJAYAmJHY2BBAI2BGHmCKrHPAPCE6HPy86BBAKCVJAYAPJHY2BBAmCIrCEZHPAPCE6HPy86BBAKCcJAYAPJHY2BBAmCGrCEZHPAPCE6HPy86BBAKCMJAYAPJHY2BBAmCEZHmAmCE6Hmy86BBAKCSJAYAmJHm2BBAI2BEHICKrHYAYCE6HYy86BBAKCQJAmAYJHm2BBAICIrCEZHYAYCE6HYy86BBAKCfJAmAYJHm2BBAICGrCEZHYAYCE6HYy86BBAKCbJAmAYJHK2BBAICEZHIAICE6HIy86BBAKAIJRISGMAKAI2BNAI2BBHmCIrHYAYCb6HYy86BBAKCFJAICNJAYJHY2BBAmCbZHmAmCb6Hmy86BBAKCGJAYAmJHm2BBAI2BFHYCIrHPAPCb6HPy86BBAKCEJAmAPJHm2BBAYCbZHYAYCb6HYy86BBAKCIJAmAYJHm2BBAI2BGHYCIrHPAPCb6HPy86BBAKCLJAmAPJHm2BBAYCbZHYAYCb6HYy86BBAKCKJAmAYJHm2BBAI2BEHYCIrHPAPCb6HPy86BBAKCOJAmAPJHm2BBAYCbZHYAYCb6HYy86BBAKCNJAmAYJHm2BBAI2BIHYCIrHPAPCb6HPy86BBAKCVJAmAPJHm2BBAYCbZHYAYCb6HYy86BBAKCcJAmAYJHm2BBAI2BLHYCIrHPAPCb6HPy86BBAKCMJAmAPJHm2BBAYCbZHYAYCb6HYy86BBAKCSJAmAYJHm2BBAI2BKHYCIrHPAPCb6HPy86BBAKCQJAmAPJHm2BBAYCbZHYAYCb6HYy86BBAKCfJAmAYJHm2BBAI2BOHICIrHYAYCb6HYy86BBAKCbJAmAYJHK2BBAICbZHIAICb6HIy86BBAKAIJRISFMAKAI8pBB83BBAKCNJAICNJ8pBB83BBAICTJRIMAtCGJRtAECTJHEAS9JQBMMGXAIQBCBRISEMGXAM9FQBANAbJ2BBRtCBRKAfREEXAEANCU/CBJAKJ2BBHTCFrCBATCFZl9zAtJHt86BBAEAGJREAKCFJHKAM9HQBMMAfCFJRfAIRTAbCFJHbAG9HQBMMABAcAG9sJANCUGJAMAG9sTkUUUBpANANCUGJAMCaJAG9sJAGTkUUUBpMAMCBAIyAcJRcAIQBMC9+RKSFMCBC99AOAIlAGCAAGCA9Ly6yRKMALCU/EBJ8kUUUUBAKM+OmFTa8jUUUUBCoFlHL8kUUUUBC9+RKGXAFCE9uHOCtJAI9LQBCaRKAE2BBHNC/wFZC/gF9HQBANCbZHVCF9LQBALCoBJCgFCUFT+JUUUBpALC84Jha83EBALC8wJha83EBALC8oJha83EBALCAJha83EBALCiJha83EBALCTJha83EBALha83ENALha83EBAEAIJC9wJRcAECFJHNAOJRMGXAF9FQBCQCbAVCF6yRSABRECBRVCBRQCBRfCBRICBRKEXGXAMAcuQBC9+RKSEMGXGXAN2BBHOC/vF9LQBALCoBJAOCIrCa9zAKJCbZCEWJHb8oGIRTAb8oGBRtGXAOCbZHbAS9PQBALAOCa9zAIJCbZCGWJ8oGBAVAbyROAb9FRbGXGXAGCG9HQBABAt87FBABCIJAO87FBABCGJAT87FBSFMAEAtjGBAECNJAOjGBAECIJATjGBMAVAbJRVALCoBJAKCEWJHmAOjGBAmATjGIALAICGWJAOjGBALCoBJAKCFJCbZHKCEWJHTAtjGBATAOjGIAIAbJRIAKCFJRKSGMGXGXAbCb6QBAQAbJAbC989zJCFJRQSFMAM1BBHbCgFZROGXGXAbCa9MQBAMCFJRMSFMAM1BFHbCgBZCOWAOCgBZqROGXAbCa9MQBAMCGJRMSFMAM1BGHbCgBZCfWAOqROGXAbCa9MQBAMCEJRMSFMAM1BEHbCgBZCdWAOqROGXAbCa9MQBAMCIJRMSFMAM2BIC8cWAOqROAMCLJRMMAOCFrCBAOCFZl9zAQJRQMGXGXAGCG9HQBABAt87FBABCIJAQ87FBABCGJAT87FBSFMAEAtjGBAECNJAQjGBAECIJATjGBMALCoBJAKCEWJHOAQjGBAOATjGIALAICGWJAQjGBALCoBJAKCFJCbZHKCEWJHOAtjGBAOAQjGIAICFJRIAKCFJRKSFMGXAOCDF9LQBALAIAcAOCbZJ2BBHbCIrHTlCbZCGWJ8oGBAVCFJHtATyROALAIAblCbZCGWJ8oGBAtAT9FHmJHtAbCbZHTyRbAT9FRTGXGXAGCG9HQBABAV87FBABCIJAb87FBABCGJAO87FBSFMAEAVjGBAECNJAbjGBAECIJAOjGBMALAICGWJAVjGBALCoBJAKCEWJHYAOjGBAYAVjGIALAICFJHICbZCGWJAOjGBALCoBJAKCFJCbZCEWJHYAbjGBAYAOjGIALAIAmJCbZHICGWJAbjGBALCoBJAKCGJCbZHKCEWJHOAVjGBAOAbjGIAKCFJRKAIATJRIAtATJRVSFMAVCBAM2BBHYyHTAOC/+F6HPJROAYCbZRtGXGXAYCIrHmQBAOCFJRbSFMAORbALAIAmlCbZCGWJ8oGBROMGXGXAtQBAbCFJRVSFMAbRVALAIAYlCbZCGWJ8oGBRbMGXGXAP9FQBAMCFJRYSFMAM1BFHYCgFZRTGXGXAYCa9MQBAMCGJRYSFMAM1BGHYCgBZCOWATCgBZqRTGXAYCa9MQBAMCEJRYSFMAM1BEHYCgBZCfWATqRTGXAYCa9MQBAMCIJRYSFMAM1BIHYCgBZCdWATqRTGXAYCa9MQBAMCLJRYSFMAMCKJRYAM2BLC8cWATqRTMATCFrCBATCFZl9zAQJHQRTMGXGXAmCb6QBAYRPSFMAY1BBHMCgFZROGXGXAMCa9MQBAYCFJRPSFMAY1BFHMCgBZCOWAOCgBZqROGXAMCa9MQBAYCGJRPSFMAY1BGHMCgBZCfWAOqROGXAMCa9MQBAYCEJRPSFMAY1BEHMCgBZCdWAOqROGXAMCa9MQBAYCIJRPSFMAYCLJRPAY2BIC8cWAOqROMAOCFrCBAOCFZl9zAQJHQROMGXGXAtCb6QBAPRMSFMAP1BBHMCgFZRbGXGXAMCa9MQBAPCFJRMSFMAP1BFHMCgBZCOWAbCgBZqRbGXAMCa9MQBAPCGJRMSFMAP1BGHMCgBZCfWAbqRbGXAMCa9MQBAPCEJRMSFMAP1BEHMCgBZCdWAbqRbGXAMCa9MQBAPCIJRMSFMAPCLJRMAP2BIC8cWAbqRbMAbCFrCBAbCFZl9zAQJHQRbMGXGXAGCG9HQBABAT87FBABCIJAb87FBABCGJAO87FBSFMAEATjGBAECNJAbjGBAECIJAOjGBMALCoBJAKCEWJHYAOjGBAYATjGIALAICGWJATjGBALCoBJAKCFJCbZCEWJHYAbjGBAYAOjGIALAICFJHICbZCGWJAOjGBALCoBJAKCGJCbZCEWJHOATjGBAOAbjGIALAIAm9FAmCb6qJHICbZCGWJAbjGBAIAt9FAtCb6qJRIAKCEJRKMANCFJRNABCKJRBAECSJREAKCbZRKAICbZRIAfCEJHfAF9JQBMMCBC99AMAc6yRKMALCoFJ8kUUUUBAKM/tIFGa8jUUUUBCTlRLC9+RKGXAFCLJAI9LQBCaRKAE2BBC/+FZC/QF9HQBALhB83ENAECFJRKAEAIJC98JREGXAF9FQBGXAGCG6QBEXGXAKAE9JQBC9+bMAK1BBHGCgFZRIGXGXAGCa9MQBAKCFJRKSFMAK1BFHGCgBZCOWAICgBZqRIGXAGCa9MQBAKCGJRKSFMAK1BGHGCgBZCfWAIqRIGXAGCa9MQBAKCEJRKSFMAK1BEHGCgBZCdWAIqRIGXAGCa9MQBAKCIJRKSFMAK2BIC8cWAIqRIAKCLJRKMALCNJAICFZCGWqHGAICGrCBAICFrCFZl9zAG8oGBJHIjGBABAIjGBABCIJRBAFCaJHFQBSGMMEXGXAKAE9JQBC9+bMAK1BBHGCgFZRIGXGXAGCa9MQBAKCFJRKSFMAK1BFHGCgBZCOWAICgBZqRIGXAGCa9MQBAKCGJRKSFMAK1BGHGCgBZCfWAIqRIGXAGCa9MQBAKCEJRKSFMAK1BEHGCgBZCdWAIqRIGXAGCa9MQBAKCIJRKSFMAK2BIC8cWAIqRIAKCLJRKMABAICGrCBAICFrCFZl9zALCNJAICFZCGWqHI8oGBJHG87FBAIAGjGBABCGJRBAFCaJHFQBMMCBC99AKAE6yRKMAKM+lLKFaF99GaG99FaG99GXGXAGCI9HQBAF9FQFEXGXGX9DBBB8/9DBBB+/ABCGJHG1BB+yAB1BBHE+yHI+L+TABCFJHL1BBHK+yHO+L+THN9DBBBB9gHVyAN9DBB/+hANAN+U9DBBBBANAVyHcAc+MHMAECa3yAI+SHIAI+UAcAMAKCa3yAO+SHcAc+U+S+S+R+VHO+U+SHN+L9DBBB9P9d9FQBAN+oRESFMCUUUU94REMAGAE86BBGXGX9DBBB8/9DBBB+/Ac9DBBBB9gyAcAO+U+SHN+L9DBBB9P9d9FQBAN+oRGSFMCUUUU94RGMALAG86BBGXGX9DBBB8/9DBBB+/AI9DBBBB9gyAIAO+U+SHN+L9DBBB9P9d9FQBAN+oRGSFMCUUUU94RGMABAG86BBABCIJRBAFCaJHFQBSGMMAF9FQBEXGXGX9DBBB8/9DBBB+/ABCIJHG8uFB+yAB8uFBHE+yHI+L+TABCGJHL8uFBHK+yHO+L+THN9DBBBB9gHVyAN9DB/+g6ANAN+U9DBBBBANAVyHcAc+MHMAECa3yAI+SHIAI+UAcAMAKCa3yAO+SHcAc+U+S+S+R+VHO+U+SHN+L9DBBB9P9d9FQBAN+oRESFMCUUUU94REMAGAE87FBGXGX9DBBB8/9DBBB+/Ac9DBBBB9gyAcAO+U+SHN+L9DBBB9P9d9FQBAN+oRGSFMCUUUU94RGMALAG87FBGXGX9DBBB8/9DBBB+/AI9DBBBB9gyAIAO+U+SHN+L9DBBB9P9d9FQBAN+oRGSFMCUUUU94RGMABAG87FBABCNJRBAFCaJHFQBMMM/SEIEaE99EaF99GXAF9FQBCBREABRIEXGXGX9D/zI818/AICKJ8uFBHLCEq+y+VHKAI8uFB+y+UHO9DB/+g6+U9DBBB8/9DBBB+/AO9DBBBB9gy+SHN+L9DBBB9P9d9FQBAN+oRVSFMCUUUU94RVMAICIJ8uFBRcAICGJ8uFBRMABALCFJCEZAEqCFWJAV87FBGXGXAKAM+y+UHN9DB/+g6+U9DBBB8/9DBBB+/AN9DBBBB9gy+SHS+L9DBBB9P9d9FQBAS+oRMSFMCUUUU94RMMABALCGJCEZAEqCFWJAM87FBGXGXAKAc+y+UHK9DB/+g6+U9DBBB8/9DBBB+/AK9DBBBB9gy+SHS+L9DBBB9P9d9FQBAS+oRcSFMCUUUU94RcMABALCaJCEZAEqCFWJAc87FBGXGX9DBBU8/AOAO+U+TANAN+U+TAKAK+U+THO9DBBBBAO9DBBBB9gy+R9DB/+g6+U9DBBB8/+SHO+L9DBBB9P9d9FQBAO+oRcSFMCUUUU94RcMABALCEZAEqCFWJAc87FBAICNJRIAECIJREAFCaJHFQBMMM9JBGXAGCGrAF9sHF9FQBEXABAB8oGBHGCNWCN91+yAGCi91CnWCUUU/8EJ+++U84GBABCIJRBAFCaJHFQBMMM9TFEaCBCB8oGUkUUBHFABCEJC98ZJHBjGUkUUBGXGXAB8/BCTWHGuQBCaREABAGlCggEJCTrXBCa6QFMAFREMAEM/lFFFaGXGXAFABqCEZ9FQBABRESFMGXGXAGCT9PQBABRESFMABREEXAEAF8oGBjGBAECIJAFCIJ8oGBjGBAECNJAFCNJ8oGBjGBAECSJAFCSJ8oGBjGBAECTJREAFCTJRFAGC9wJHGCb9LQBMMAGCI9JQBEXAEAF8oGBjGBAFCIJRFAECIJREAGC98JHGCE9LQBMMGXAG9FQBEXAEAF2BB86BBAECFJREAFCFJRFAGCaJHGQBMMABMoFFGaGXGXABCEZ9FQBABRESFMAFCgFZC+BwsN9sRIGXGXAGCT9PQBABRESFMABREEXAEAIjGBAECSJAIjGBAECNJAIjGBAECIJAIjGBAECTJREAGC9wJHGCb9LQBMMAGCI9JQBEXAEAIjGBAECIJREAGC98JHGCE9LQBMMGXAG9FQBEXAEAF86BBAECFJREAGCaJHGQBMMABMMMFBCUNMIT9kBB'; const x0 = 'B9h9z9tFBBBF8dL9gBB9gLaaaaaFa9gEaaaB9gGaaB9gFaFaEQSBBFBFFGEGEGIILF9wFFFLEFBFKNFaFCx/aFMO/LFVK9tv9t9vq95GBt9f9f939h9z9t9f9j9h9s9s9f9jW9vq9zBBp9tv9z9o9v9wW9f9kv9j9v9kv9WvqWv94h919m9mvqBG8Z9tv9z9o9v9wW9f9kv9j9v9kv9J9u9kv94h919m9mvqBIy9tv9z9o9v9wW9f9kv9j9v9kv9J9u9kv949TvZ91v9u9jvBLn9tv9z9o9v9wW9f9kv9j9v9kv69p9sWvq9P9jWBKi9tv9z9o9v9wW9f9kv9j9v9kv69p9sWvq9R919hWBNn9tv9z9o9v9wW9f9kv9j9v9kv69p9sWvq9F949wBcI9z9iqlBMc/j9JSIBTEM9+FLa8jUUUUBCTlRBCBRFEXCBRGCBREEXABCNJAGJAECUaAFAGrCFZHIy86BBAEAIJREAGCFJHGCN9HQBMAFCx+YUUBJAE86BBAFCEWCxkUUBJAB8pEN83EBAFCFJHFCUG9HQBMMkRIbaG97FaK978jUUUUBCU/KBlHL8kUUUUBC9+RKGXAGCFJAI9LQBCaRKAE2BBC+gF9HQBALAEAIJHOAGlAG/8cBBCUoBAG9uC/wgBZHKCUGAKCUG9JyRNAECFJRKCBRVGXEXAVAF9PQFANAFAVlAVANJAF9JyRcGXGXAG9FQBAcCbJHIC9wZHMCE9sRSAMCFWRQAICIrCEJCGrRfCBRbEXAKRTCBRtGXEXGXAOATlAf9PQBCBRKSLMALCU/CBJAtAM9sJRmATAfJRKCBREGXAMCoB9JQBAOAKlC/gB9JQBCBRIEXAmAIJREGXGXGXGXGXATAICKrJ2BBHYCEZfIBFGEBMAECBDtDMIBSEMAEAKDBBIAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnHPCGD+MFAPDQBTFtGmEYIPLdKeOnC0+G+MiDtD9OHdCEDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBAeCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMIBAKCIJAnDeBJAeCx+YUUBJ2BBJRKSGMAEAKDBBNAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnC+P+e+8/4BDtD9OHdCbDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBAeCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMIBAKCNJAnDeBJAeCx+YUUBJ2BBJRKSFMAEAKDBBBDMIBAKCTJRKMGXGXGXGXGXAYCGrCEZfIBFGEBMAECBDtDMITSEMAEAKDBBIAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnHPCGD+MFAPDQBTFtGmEYIPLdKeOnC0+G+MiDtD9OHdCEDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBAeCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMITAKCIJAnDeBJAeCx+YUUBJ2BBJRKSGMAEAKDBBNAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnC+P+e+8/4BDtD9OHdCbDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBAeCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMITAKCNJAnDeBJAeCx+YUUBJ2BBJRKSFMAEAKDBBBDMITAKCTJRKMGXGXGXGXGXAYCIrCEZfIBFGEBMAECBDtDMIASEMAEAKDBBIAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnHPCGD+MFAPDQBTFtGmEYIPLdKeOnC0+G+MiDtD9OHdCEDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBAeCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMIAAKCIJAnDeBJAeCx+YUUBJ2BBJRKSGMAEAKDBBNAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnC+P+e+8/4BDtD9OHdCbDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBAeCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMIAAKCNJAnDeBJAeCx+YUUBJ2BBJRKSFMAEAKDBBBDMIAAKCTJRKMGXGXGXGXGXAYCKrfIBFGEBMAECBDtDMI8wSEMAEAKDBBIAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnHPCGD+MFAPDQBTFtGmEYIPLdKeOnC0+G+MiDtD9OHdCEDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HYCEWCxkUUBJDBEBAYCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HYCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMI8wAKCIJAnDeBJAYCx+YUUBJ2BBJRKSGMAEAKDBBNAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnC+P+e+8/4BDtD9OHdCbDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HYCEWCxkUUBJDBEBAYCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HYCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMI8wAKCNJAnDeBJAYCx+YUUBJ2BBJRKSFMAEAKDBBBDMI8wAKCTJRKMAICoBJREAICUFJAM9LQFAERIAOAKlC/fB9LQBMMGXAEAM9PQBAECErRIEXGXAOAKlCi9PQBCBRKSOMAmAEJRYGXGXGXGXGXATAECKrJ2BBAICKZrCEZfIBFGEBMAYCBDtDMIBSEMAYAKDBBIAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnHPCGD+MFAPDQBTFtGmEYIPLdKeOnC0+G+MiDtD9OHdCEDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBAeCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMIBAKCIJAnDeBJAeCx+YUUBJ2BBJRKSGMAYAKDBBNAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnC+P+e+8/4BDtD9OHdCbDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBAeCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMIBAKCNJAnDeBJAeCx+YUUBJ2BBJRKSFMAYAKDBBBDMIBAKCTJRKMAICGJRIAECTJHEAM9JQBMMGXAK9FQBAKRTAtCFJHtCI6QGSFMMCBRKSEMGXAM9FQBALCUGJAbJREALAbJDBGBRnCBRYEXAEALCU/CBJAYJHIDBIBHdCFD9tAdCFDbHPD9OD9hD9RHdAIAMJDBIBHiCFD9tAiAPD9OD9hD9RHiDQBTFtGmEYIPLdKeOnH8ZAIAQJDBIBHpCFD9tApAPD9OD9hD9RHpAIASJDBIBHyCFD9tAyAPD9OD9hD9RHyDQBTFtGmEYIPLdKeOnH8cDQBFTtGEmYILPdKOenHPAPDQBFGEBFGEBFGEBFGEAnD9uHnDyBjGBAEAGJHIAnAPAPDQILKOILKOILKOILKOD9uHnDyBjGBAIAGJHIAnAPAPDQNVcMNVcMNVcMNVcMD9uHnDyBjGBAIAGJHIAnAPAPDQSQfbSQfbSQfbSQfbD9uHnDyBjGBAIAGJHIAnA8ZA8cDQNVi8ZcMpySQ8c8dfb8e8fHPAPDQBFGEBFGEBFGEBFGED9uHnDyBjGBAIAGJHIAnAPAPDQILKOILKOILKOILKOD9uHnDyBjGBAIAGJHIAnAPAPDQNVcMNVcMNVcMNVcMD9uHnDyBjGBAIAGJHIAnAPAPDQSQfbSQfbSQfbSQfbD9uHnDyBjGBAIAGJHIAnAdAiDQNiV8ZcpMyS8cQ8df8eb8fHdApAyDQNiV8ZcpMyS8cQ8df8eb8fHiDQBFTtGEmYILPdKOenHPAPDQBFGEBFGEBFGEBFGED9uHnDyBjGBAIAGJHIAnAPAPDQILKOILKOILKOILKOD9uHnDyBjGBAIAGJHIAnAPAPDQNVcMNVcMNVcMNVcMD9uHnDyBjGBAIAGJHIAnAPAPDQSQfbSQfbSQfbSQfbD9uHnDyBjGBAIAGJHIAnAdAiDQNVi8ZcMpySQ8c8dfb8e8fHPAPDQBFGEBFGEBFGEBFGED9uHnDyBjGBAIAGJHIAnAPAPDQILKOILKOILKOILKOD9uHnDyBjGBAIAGJHIAnAPAPDQNVcMNVcMNVcMNVcMD9uHnDyBjGBAIAGJHIAnAPAPDQSQfbSQfbSQfbSQfbD9uHnDyBjGBAIAGJREAYCTJHYAM9JQBMMAbCIJHbAG9JQBMMABAVAG9sJALCUGJAcAG9s/8cBBALALCUGJAcCaJAG9sJAG/8cBBMAcCBAKyAVJRVAKQBMC9+RKSFMCBC99AOAKlAGCAAGCA9Ly6yRKMALCU/KBJ8kUUUUBAKMNBT+BUUUBM+KmFTa8jUUUUBCoFlHL8kUUUUBC9+RKGXAFCE9uHOCtJAI9LQBCaRKAE2BBHNC/wFZC/gF9HQBANCbZHVCF9LQBALCoBJCgFCUF/8MBALC84Jha83EBALC8wJha83EBALC8oJha83EBALCAJha83EBALCiJha83EBALCTJha83EBALha83ENALha83EBAEAIJC9wJRcAECFJHNAOJRMGXAF9FQBCQCbAVCF6yRSABRECBRVCBRQCBRfCBRICBRKEXGXAMAcuQBC9+RKSEMGXGXAN2BBHOC/vF9LQBALCoBJAOCIrCa9zAKJCbZCEWJHb8oGIRTAb8oGBRtGXAOCbZHbAS9PQBALAOCa9zAIJCbZCGWJ8oGBAVAbyROAb9FRbGXGXAGCG9HQBABAt87FBABCIJAO87FBABCGJAT87FBSFMAEAtjGBAECNJAOjGBAECIJATjGBMAVAbJRVALCoBJAKCEWJHmAOjGBAmATjGIALAICGWJAOjGBALCoBJAKCFJCbZHKCEWJHTAtjGBATAOjGIAIAbJRIAKCFJRKSGMGXGXAbCb6QBAQAbJAbC989zJCFJRQSFMAM1BBHbCgFZROGXGXAbCa9MQBAMCFJRMSFMAM1BFHbCgBZCOWAOCgBZqROGXAbCa9MQBAMCGJRMSFMAM1BGHbCgBZCfWAOqROGXAbCa9MQBAMCEJRMSFMAM1BEHbCgBZCdWAOqROGXAbCa9MQBAMCIJRMSFMAM2BIC8cWAOqROAMCLJRMMAOCFrCBAOCFZl9zAQJRQMGXGXAGCG9HQBABAt87FBABCIJAQ87FBABCGJAT87FBSFMAEAtjGBAECNJAQjGBAECIJATjGBMALCoBJAKCEWJHOAQjGBAOATjGIALAICGWJAQjGBALCoBJAKCFJCbZHKCEWJHOAtjGBAOAQjGIAICFJRIAKCFJRKSFMGXAOCDF9LQBALAIAcAOCbZJ2BBHbCIrHTlCbZCGWJ8oGBAVCFJHtATyROALAIAblCbZCGWJ8oGBAtAT9FHmJHtAbCbZHTyRbAT9FRTGXGXAGCG9HQBABAV87FBABCIJAb87FBABCGJAO87FBSFMAEAVjGBAECNJAbjGBAECIJAOjGBMALAICGWJAVjGBALCoBJAKCEWJHYAOjGBAYAVjGIALAICFJHICbZCGWJAOjGBALCoBJAKCFJCbZCEWJHYAbjGBAYAOjGIALAIAmJCbZHICGWJAbjGBALCoBJAKCGJCbZHKCEWJHOAVjGBAOAbjGIAKCFJRKAIATJRIAtATJRVSFMAVCBAM2BBHYyHTAOC/+F6HPJROAYCbZRtGXGXAYCIrHmQBAOCFJRbSFMAORbALAIAmlCbZCGWJ8oGBROMGXGXAtQBAbCFJRVSFMAbRVALAIAYlCbZCGWJ8oGBRbMGXGXAP9FQBAMCFJRYSFMAM1BFHYCgFZRTGXGXAYCa9MQBAMCGJRYSFMAM1BGHYCgBZCOWATCgBZqRTGXAYCa9MQBAMCEJRYSFMAM1BEHYCgBZCfWATqRTGXAYCa9MQBAMCIJRYSFMAM1BIHYCgBZCdWATqRTGXAYCa9MQBAMCLJRYSFMAMCKJRYAM2BLC8cWATqRTMATCFrCBATCFZl9zAQJHQRTMGXGXAmCb6QBAYRPSFMAY1BBHMCgFZROGXGXAMCa9MQBAYCFJRPSFMAY1BFHMCgBZCOWAOCgBZqROGXAMCa9MQBAYCGJRPSFMAY1BGHMCgBZCfWAOqROGXAMCa9MQBAYCEJRPSFMAY1BEHMCgBZCdWAOqROGXAMCa9MQBAYCIJRPSFMAYCLJRPAY2BIC8cWAOqROMAOCFrCBAOCFZl9zAQJHQROMGXGXAtCb6QBAPRMSFMAP1BBHMCgFZRbGXGXAMCa9MQBAPCFJRMSFMAP1BFHMCgBZCOWAbCgBZqRbGXAMCa9MQBAPCGJRMSFMAP1BGHMCgBZCfWAbqRbGXAMCa9MQBAPCEJRMSFMAP1BEHMCgBZCdWAbqRbGXAMCa9MQBAPCIJRMSFMAPCLJRMAP2BIC8cWAbqRbMAbCFrCBAbCFZl9zAQJHQRbMGXGXAGCG9HQBABAT87FBABCIJAb87FBABCGJAO87FBSFMAEATjGBAECNJAbjGBAECIJAOjGBMALCoBJAKCEWJHYAOjGBAYATjGIALAICGWJATjGBALCoBJAKCFJCbZCEWJHYAbjGBAYAOjGIALAICFJHICbZCGWJAOjGBALCoBJAKCGJCbZCEWJHOATjGBAOAbjGIALAIAm9FAmCb6qJHICbZCGWJAbjGBAIAt9FAtCb6qJRIAKCEJRKMANCFJRNABCKJRBAECSJREAKCbZRKAICbZRIAfCEJHfAF9JQBMMCBC99AMAc6yRKMALCoFJ8kUUUUBAKM/tIFGa8jUUUUBCTlRLC9+RKGXAFCLJAI9LQBCaRKAE2BBC/+FZC/QF9HQBALhB83ENAECFJRKAEAIJC98JREGXAF9FQBGXAGCG6QBEXGXAKAE9JQBC9+bMAK1BBHGCgFZRIGXGXAGCa9MQBAKCFJRKSFMAK1BFHGCgBZCOWAICgBZqRIGXAGCa9MQBAKCGJRKSFMAK1BGHGCgBZCfWAIqRIGXAGCa9MQBAKCEJRKSFMAK1BEHGCgBZCdWAIqRIGXAGCa9MQBAKCIJRKSFMAK2BIC8cWAIqRIAKCLJRKMALCNJAICFZCGWqHGAICGrCBAICFrCFZl9zAG8oGBJHIjGBABAIjGBABCIJRBAFCaJHFQBSGMMEXGXAKAE9JQBC9+bMAK1BBHGCgFZRIGXGXAGCa9MQBAKCFJRKSFMAK1BFHGCgBZCOWAICgBZqRIGXAGCa9MQBAKCGJRKSFMAK1BGHGCgBZCfWAIqRIGXAGCa9MQBAKCEJRKSFMAK1BEHGCgBZCdWAIqRIGXAGCa9MQBAKCIJRKSFMAK2BIC8cWAIqRIAKCLJRKMABAICGrCBAICFrCFZl9zALCNJAICFZCGWqHI8oGBJHG87FBAIAGjGBABCGJRBAFCaJHFQBMMCBC99AKAE6yRKMAKM/xLGEaK978jUUUUBCAlHE8kUUUUBGXGXAGCI9HQBGXAFC98ZHI9FQBABRGCBRLEXAGAGDBBBHKCiD+rFCiD+sFD/6FHOAKCND+rFCiD+sFD/6FAOD/gFAKCTD+rFCiD+sFD/6FHND/gFD/kFD/lFHVCBDtD+2FHcAOCUUUU94DtHMD9OD9RD/kFHO9DBB/+hDYAOAOD/mFAVAVD/mFANAcANAMD9OD9RD/kFHOAOD/mFD/kFD/kFD/jFD/nFHND/mF9DBBX9LDYHcD/kFCgFDtD9OAKCUUU94DtD9OD9QAOAND/mFAcD/kFCND+rFCU/+EDtD9OD9QAVAND/mFAcD/kFCTD+rFCUU/8ODtD9OD9QDMBBAGCTJRGALCIJHLAI9JQBMMAIAF9PQFAEAFCEZHLCGWHGqCBCTAGl/8MBAEABAICGWJHIAG/8cBBGXAL9FQBAEAEDBIBHKCiD+rFCiD+sFD/6FHOAKCND+rFCiD+sFD/6FAOD/gFAKCTD+rFCiD+sFD/6FHND/gFD/kFD/lFHVCBDtD+2FHcAOCUUUU94DtHMD9OD9RD/kFHO9DBB/+hDYAOAOD/mFAVAVD/mFANAcANAMD9OD9RD/kFHOAOD/mFD/kFD/kFD/jFD/nFHND/mF9DBBX9LDYHcD/kFCgFDtD9OAKCUUU94DtD9OD9QAOAND/mFAcD/kFCND+rFCU/+EDtD9OD9QAVAND/mFAcD/kFCTD+rFCUU/8ODtD9OD9QDMIBMAIAEAG/8cBBSFMABAFC98ZHGT+HUUUBAGAF9PQBAEAFCEZHICEWHLJCBCAALl/8MBAEABAGCEWJHGAL/8cBBAEAIT+HUUUBAGAEAL/8cBBMAECAJ8kUUUUBM+yEGGaO97GXAF9FQBCBRGEXABCTJHEAEDBBBHICBDtHLCUU98D8cFCUU98D8cEHKD9OABDBBBHOAIDQILKOSQfbPden8c8d8e8fCggFDtD9OD/6FAOAIDQBFGENVcMTtmYi8ZpyHICTD+sFD/6FHND/gFAICTD+rFCTD+sFD/6FHVD/gFD/kFD/lFHI9DB/+g6DYAVAIALD+2FHLAVCUUUU94DtHcD9OD9RD/kFHVAVD/mFAIAID/mFANALANAcD9OD9RD/kFHIAID/mFD/kFD/kFD/jFD/nFHND/mF9DBBX9LDYHLD/kFCTD+rFAVAND/mFALD/kFCggEDtD9OD9QHVAIAND/mFALD/kFCaDbCBDnGCBDnECBDnKCBDnOCBDncCBDnMCBDnfCBDnbD9OHIDQNVi8ZcMpySQ8c8dfb8e8fD9QDMBBABAOAKD9OAVAIDQBFTtGEmYILPdKOenD9QDMBBABCAJRBAGCIJHGAF9JQBMMM94FEa8jUUUUBCAlHE8kUUUUBABAFC98ZHIT+JUUUBGXAIAF9PQBAEAFCEZHLCEWHFJCBCAAFl/8MBAEABAICEWJHBAF/8cBBAEALT+JUUUBABAEAF/8cBBMAECAJ8kUUUUBM/hEIGaF97FaL978jUUUUBCTlRGGXAF9FQBCBREEXAGABDBBBHIABCTJHLDBBBHKDQILKOSQfbPden8c8d8e8fHOCTD+sFHNCID+rFDMIBAB9DBBU8/DY9D/zI818/DYANCEDtD9QD/6FD/nFHNAIAKDQBFGENVcMTtmYi8ZpyHICTD+rFCTD+sFD/6FD/mFHKAKD/mFANAICTD+sFD/6FD/mFHVAVD/mFANAOCTD+rFCTD+sFD/6FD/mFHOAOD/mFD/kFD/kFD/lFCBDtD+4FD/jF9DB/+g6DYHND/mF9DBBX9LDYHID/kFCggEDtHcD9OAVAND/mFAID/kFCTD+rFD9QHVAOAND/mFAID/kFCTD+rFAKAND/mFAID/kFAcD9OD9QHNDQBFTtGEmYILPdKOenHID8dBAGDBIBDyB+t+J83EBABCNJAID8dFAGDBIBDyF+t+J83EBALAVANDQNVi8ZcMpySQ8c8dfb8e8fHND8dBAGDBIBDyG+t+J83EBABCiJAND8dFAGDBIBDyE+t+J83EBABCAJRBAECIJHEAF9JQBMMM/3FGEaF978jUUUUBCoBlREGXAGCGrAF9sHIC98ZHL9FQBCBRGABRFEXAFAFDBBBHKCND+rFCND+sFD/6FAKCiD+sFCnD+rFCUUU/8EDtD+uFD/mFDMBBAFCTJRFAGCIJHGAL9JQBMMGXALAI9PQBAEAICEZHGCGWHFqCBCoBAFl/8MBAEABALCGWJHLAF/8cBBGXAG9FQBAEAEDBIBHKCND+rFCND+sFD/6FAKCiD+sFCnD+rFCUUU/8EDtD+uFD/mFDMIBMALAEAF/8cBBMM9TFEaCBCB8oGUkUUBHFABCEJC98ZJHBjGUkUUBGXGXAB8/BCTWHGuQBCaREABAGlCggEJCTrXBCa6QFMAFREMAEMMMFBCUNMIT9tBB'; const v0 = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 3, 2, 0, 0, 5, 3, 1, 0, 1, 12, 1, 0, 10, 22, 2, 12, 0, 65, 0, 65, 0, 65, 0, 252, 10, 0, 0, 11, 7, 0, 65, 0, 253, 15, 26, 11]); const O0 = new Uint8Array([32, 0, 65, 253, 3, 1, 2, 34, 4, 106, 6, 5, 11, 8, 7, 20, 13, 33, 12, 16, 128, 9, 116, 64, 19, 113, 127, 15, 10, 21, 22, 14, 255, 66, 24, 54, 136, 107, 18, 23, 192, 26, 114, 118, 132, 17, 77, 101, 130, 144, 27, 87, 131, 44, 45, 74, 156, 154, 70, 167]); const F0 = {
  0: '',
  1: 'meshopt_decodeFilterOct',
  2: 'meshopt_decodeFilterQuat',
  3: 'meshopt_decodeFilterExp',
  NONE: '',
  OCTAHEDRAL: 'meshopt_decodeFilterOct',
  QUATERNION: 'meshopt_decodeFilterQuat',
  EXPONENTIAL: 'meshopt_decodeFilterExp'
}; const D0 = {
  0: 'meshopt_decodeVertexBuffer',
  1: 'meshopt_decodeIndexBuffer',
  2: 'meshopt_decodeIndexSequence',
  ATTRIBUTES: 'meshopt_decodeVertexBuffer',
  TRIANGLES: 'meshopt_decodeIndexBuffer',
  INDICES: 'meshopt_decodeIndexSequence'
};
async function L0 (e, t, n, s, r) {
  const i = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : 'NONE';
  const o = await P0();
  U0(o, o.exports[D0[r]], e, t, n, s, o.exports[F0[i || 'NONE']]);
}
let Rs;
async function P0 () {
  return Rs || (Rs = G0()), Rs;
}
async function G0 () {
  let e = I0;
  WebAssembly.validate(v0) && (e = x0, console.log('Warning: meshopt_decoder is using experimental SIMD support'));
  const t = await WebAssembly.instantiate(N0(e), {});
  return await t.instance.exports.__wasm_call_ctors(), t.instance;
}
function N0 (e) {
  const t = new Uint8Array(e.length);
  for (let s = 0; s < e.length; ++s) {
    const r = e.charCodeAt(s);
    t[s] = r > 96 ? r - 71 : r > 64 ? r - 65 : r > 47 ? r + 4 : r > 46 ? 63 : 62;
  }
  let n = 0;
  for (let s = 0; s < e.length; ++s) { t[n++] = t[s] < 60 ? O0[t[s]] : (t[s] - 60) * 64 + t[++s]; }
  return t.buffer.slice(0, n);
}
function U0 (e, t, n, s, r, i, o) {
  const a = e.exports.sbrk; const c = s + 3 & -4; const u = a(c * r); const l = a(i.length); const h = new Uint8Array(e.exports.memory.buffer);
  h.set(i, l);
  const f = t(u, s, r, l, i.length);
  if (f === 0 && o && o(u, c, r), n.set(h.subarray(u, u + s * r)), a(u - a(0)), f !== 0) { throw new Error(`Malformed buffer data: ${f}`); }
}
const Gn = 'EXT_meshopt_compression'; const H0 = Gn;
async function J0 (e, t) {
  let n, s;
  const r = new ot(e);
  if (!(t != null && (n = t.gltf) !== null && n !== void 0 && n.decompressMeshes) || !((s = t.gltf) !== null && s !== void 0 && s.loadBuffers)) { return; }
  const i = [];
  for (const o of e.json.bufferViews || []) { i.push(V0(r, o)); }
  await Promise.all(i), r.removeExtension(Gn);
}
async function V0 (e, t) {
  const n = e.getObjectExtension(t, Gn);
  if (n) {
    const {
      byteOffset: s = 0,
      byteLength: r = 0,
      byteStride: i,
      count: o,
      mode: a,
      filter: c = 'NONE',
      buffer: u
    } = n; const l = e.gltf.buffers[u]; const h = new Uint8Array(l.arrayBuffer, l.byteOffset + s, r); const f = new Uint8Array(e.gltf.buffers[t.buffer].arrayBuffer, t.byteOffset, t.byteLength);
    await L0(f, o, i, h, a, c), e.removeObjectExtension(t, Gn);
  }
}
const j0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  decode: J0,
  name: H0
}, Symbol.toStringTag, { value: 'Module' })); const fe = 'EXT_texture_webp'; const k0 = fe;
function K0 (e, t) {
  const n = new ot(e);
  if (!tg('image/webp')) {
    if (n.getRequiredExtensions().includes(fe)) { throw new Error(`gltf: Required extension ${fe} not supported by browser`); }
    return;
  }
  const {
    json: s
  } = n;
  for (const r of s.textures || []) {
    const i = n.getObjectExtension(r, fe);
    i && (r.source = i.source), n.removeObjectExtension(r, fe);
  }
  n.removeExtension(fe);
}
const z0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  name: k0,
  preprocess: K0
}, Symbol.toStringTag, { value: 'Module' })); const _n = 'KHR_texture_basisu'; const W0 = _n;
function X0 (e, t) {
  const n = new ot(e); const {
    json: s
  } = n;
  for (const r of s.textures || []) {
    const i = n.getObjectExtension(r, _n);
    i && (r.source = i.source, n.removeObjectExtension(r, _n));
  }
  n.removeExtension(_n);
}
const Q0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  name: W0,
  preprocess: X0
}, Symbol.toStringTag, { value: 'Module' }));
function q0 (e) {
  const t = {};
  for (const n in e) {
    const s = e[n];
    if (n !== 'indices') {
      const r = nc(s);
      t[n] = r;
    }
  }
  return t;
}
function nc (e) {
  const {
    buffer: t,
    size: n,
    count: s
  } = Y0(e);
  return {
    value: t,
    size: n,
    byteOffset: 0,
    count: s,
    type: ja(n),
    componentType: Sr(t)
  };
}
function Y0 (e) {
  let t = e; let n = 1; let s = 0;
  return e && e.value && (t = e.value, n = e.size || 1), t && (ArrayBuffer.isView(t) || (t = $0(t, Float32Array)), s = t.length / n), {
    buffer: t,
    size: n,
    count: s
  };
}
function $0 (e, t) {
  const n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
  return e ? Array.isArray(e) ? new t(e) : n && !(e instanceof t) ? new t(e) : e : null;
}
const zt = 'KHR_draco_mesh_compression'; const Z0 = zt;
function tA (e, t, n) {
  const s = new ot(e);
  for (const r of sc(s)) { s.getObjectExtension(r, zt); }
}
async function eA (e, t, n) {
  let s;
  if (!(t != null && (s = t.gltf) !== null && s !== void 0 && s.decompressMeshes)) { return; }
  const r = new ot(e); const i = [];
  for (const o of sc(r)) { r.getObjectExtension(o, zt) && i.push(sA(r, o, t, n)); }
  await Promise.all(i), r.removeExtension(zt);
}
function nA (e) {
  const t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const n = new ot(e);
  for (const s of n.json.meshes || []) { rA(s, t), n.addRequiredExtension(zt); }
}
async function sA (e, t, n, s) {
  const r = e.getObjectExtension(t, zt);
  if (!r) { return; }
  const i = e.getTypedArrayForBufferView(r.bufferView); const o = dr(i.buffer, i.byteOffset); const a = {
    ...n
  };
  delete a['3d-tiles'];
  const c = await Ke(o, Da, a, s); const u = q0(c.attributes);
  for (const [l, h] of Object.entries(u)) {
    if (l in t.attributes) {
      const f = t.attributes[l]; const d = e.getAccessor(f);
      d != null && d.min && d !== null && d !== void 0 && d.max && (h.min = d.min, h.max = d.max);
    }
  }
  t.attributes = u, c.indices && (t.indices = nc(c.indices)), e.removeObjectExtension(t, zt), iA(t);
}
function rA (e, t) {
  let n;
  const s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 4; const r = arguments.length > 3 ? arguments[3] : void 0; const i = arguments.length > 4 ? arguments[4] : void 0;
  if (!r.DracoWriter) { throw new Error('options.gltf.DracoWriter not provided'); }
  const o = r.DracoWriter.encodeSync({
    attributes: e
  }); const a = i == null || (n = i.parseSync) === null || n === void 0
    ? void 0
    : n.call(i, {
      attributes: e
    }); const c = r._addFauxAttributes(a.attributes); const u = r.addBufferView(o);
  return {
    primitives: [{
      attributes: c,
      mode: s,
      extensions: {
        [zt]: {
          bufferView: u,
          attributes: c
        }
      }
    }]
  };
}
function iA (e) {
  if (!e.attributes && Object.keys(e.attributes).length > 0) { throw new Error('glTF: Empty primitive detected: Draco decompression failure?'); }
}
function * sc (e) {
  for (const t of e.json.meshes || []) {
    for (const n of t.primitives) { yield n; }
  }
}
const oA = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  decode: eA,
  encode: nA,
  name: Z0,
  preprocess: tA
}, Symbol.toStringTag, { value: 'Module' })); const Lr = 'KHR_texture_transform'; const aA = Lr; const An = new A(); const cA = new X(); const uA = new X();
async function lA (e, t) {
  let n;
  if (!new ot(e).hasExtension(Lr) || !((n = t.gltf) !== null && n !== void 0 && n.loadBuffers)) { return; }
  const i = e.json.materials || [];
  for (let o = 0; o < i.length; o++) { hA(o, e); }
}
function hA (e, t) {
  let n, s, r;
  const i = []; const o = (n = t.json.materials) === null || n === void 0 ? void 0 : n[e]; const a = o == null || (s = o.pbrMetallicRoughness) === null || s === void 0 ? void 0 : s.baseColorTexture;
  a && Me(t, e, a, i);
  const c = o == null ? void 0 : o.emissiveTexture;
  c && Me(t, e, c, i);
  const u = o == null ? void 0 : o.normalTexture;
  u && Me(t, e, u, i);
  const l = o == null ? void 0 : o.occlusionTexture;
  l && Me(t, e, l, i);
  const h = o == null || (r = o.pbrMetallicRoughness) === null || r === void 0 ? void 0 : r.metallicRoughnessTexture;
  h && Me(t, e, h, i);
}
function Me (e, t, n, s) {
  const r = fA(n, s);
  if (!r) { return; }
  const i = e.json.meshes || [];
  for (const o of i) {
    for (const a of o.primitives) {
      const c = a.material;
      Number.isFinite(c) && t === c && dA(e, a, r);
    }
  }
}
function fA (e, t) {
  let n;
  const s = (n = e.extensions) === null || n === void 0 ? void 0 : n[Lr]; const {
    texCoord: r = 0
  } = e; const {
    texCoord: i = r
  } = s;
  if (!(t.findIndex((a) => {
    const [c, u] = a;
    return c === r && u === i;
  }) !== -1)) {
    const a = AA(s);
    return r !== i && (e.texCoord = i), t.push([r, i]), {
      originalTexCoord: r,
      texCoord: i,
      matrix: a
    };
  }
  return null;
}
function dA (e, t, n) {
  const {
    originalTexCoord: s,
    texCoord: r,
    matrix: i
  } = n; const o = t.attributes[`TEXCOORD_${s}`];
  if (Number.isFinite(o)) {
    let a;
    const u = (a = e.json.accessors) === null || a === void 0 ? void 0 : a[o];
    if (u && u.bufferView) {
      let c;
      const l = (c = e.json.bufferViews) === null || c === void 0 ? void 0 : c[u.bufferView];
      if (l) {
        const {
          arrayBuffer: h,
          byteOffset: f
        } = e.buffers[l.buffer]; const d = (f || 0) + (u.byteOffset || 0) + (l.byteOffset || 0); const {
          ArrayType: m,
          length: g
        } = Ir(u, l); const y = Va[u.componentType]; const E = Ja[u.type]; const R = l.byteStride || y * E; const B = new Float32Array(g);
        for (let C = 0; C < u.count; C++) {
          const M = new m(h, d + C * R, 2);
          An.set(M[0], M[1], 1), An.transformByMatrix3(i), B.set([An[0], An[1]], C * E);
        }
        s === r ? mA(u, l, e.buffers, B) : gA(r, u, t, e, B);
      }
    }
  }
}
function mA (e, t, n, s) {
  e.componentType = 5126, n.push({
    arrayBuffer: s.buffer,
    byteOffset: 0,
    byteLength: s.buffer.byteLength
  }), t.buffer = n.length - 1, t.byteLength = s.buffer.byteLength, t.byteOffset = 0, delete t.byteStride;
}
function gA (e, t, n, s, r) {
  s.buffers.push({
    arrayBuffer: r.buffer,
    byteOffset: 0,
    byteLength: r.buffer.byteLength
  });
  const i = s.json.bufferViews;
  if (!i) { return; }
  i.push({
    buffer: s.buffers.length - 1,
    byteLength: r.buffer.byteLength,
    byteOffset: 0
  });
  const o = s.json.accessors;
  o && (o.push({
    bufferView: (i == null ? void 0 : i.length) - 1,
    byteOffset: 0,
    componentType: 5126,
    count: t.count,
    type: 'VEC2'
  }), n.attributes[`TEXCOORD_${e}`] = o.length - 1);
}
function AA (e) {
  const {
    offset: t = [0, 0],
    rotation: n = 0,
    scale: s = [1, 1]
  } = e; const r = new X().set(1, 0, 0, 0, 1, 0, t[0], t[1], 1); const i = cA.set(Math.cos(n), Math.sin(n), 0, -Math.sin(n), Math.cos(n), 0, 0, 0, 1); const o = uA.set(s[0], 0, 0, 0, s[1], 0, 0, 0, 1);
  return r.multiplyRight(i).multiplyRight(o);
}
const pA = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  decode: lA,
  name: aA
}, Symbol.toStringTag, { value: 'Module' })); const Yt = 'KHR_lights_punctual'; const yA = Yt;
async function BA (e) {
  const t = new ot(e); const {
    json: n
  } = t; const s = t.getExtension(Yt);
  s && (t.json.lights = s.lights, t.removeExtension(Yt));
  for (const r of n.nodes || []) {
    const i = t.getObjectExtension(r, Yt);
    i && (r.light = i.light), t.removeObjectExtension(r, Yt);
  }
}
async function CA (e) {
  const t = new ot(e); const {
    json: n
  } = t;
  if (n.lights) {
    const s = t.addExtension(Yt);
    yt(!s.lights), s.lights = n.lights, delete n.lights;
  }
  if (t.json.lights) {
    for (const s of t.json.lights) {
      const r = s.node;
      t.addObjectExtension(r, Yt, s);
    }
    delete t.json.lights;
  }
}
const EA = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  decode: BA,
  encode: CA,
  name: yA
}, Symbol.toStringTag, { value: 'Module' })); const Ue = 'KHR_materials_unlit'; const TA = Ue;
async function bA (e) {
  const t = new ot(e); const {
    json: n
  } = t;
  for (const s of n.materials || []) { s.extensions && s.extensions.KHR_materials_unlit && (s.unlit = !0), t.removeObjectExtension(s, Ue); }
  t.removeExtension(Ue);
}
function _A (e) {
  const t = new ot(e); const {
    json: n
  } = t;
  if (t.materials) {
    for (const s of n.materials || []) { s.unlit && (delete s.unlit, t.addObjectExtension(s, Ue, {}), t.addExtension(Ue)); }
  }
}
const wA = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  decode: bA,
  encode: _A,
  name: TA
}, Symbol.toStringTag, { value: 'Module' })); const xe = 'KHR_techniques_webgl'; const RA = xe;
async function MA (e) {
  const t = new ot(e); const {
    json: n
  } = t; const s = t.getExtension(xe);
  if (s) {
    const r = IA(s, t);
    for (const i of n.materials || []) {
      const o = t.getObjectExtension(i, xe);
      o && (i.technique = Object.assign({}, o, r[o.technique]), i.technique.values = xA(i.technique, t)), t.removeObjectExtension(i, xe);
    }
    t.removeExtension(xe);
  }
}
async function SA (e, t) {
}
function IA (e, t) {
  const {
    programs: n = [],
    shaders: s = [],
    techniques: r = []
  } = e; const i = new TextDecoder();
  return s.forEach((o) => {
    if (Number.isFinite(o.bufferView)) { o.code = i.decode(t.getTypedArrayForBufferView(o.bufferView)); } else { throw new Error('KHR_techniques_webgl: no shader code'); }
  }), n.forEach((o) => {
    o.fragmentShader = s[o.fragmentShader], o.vertexShader = s[o.vertexShader];
  }), r.forEach((o) => {
    o.program = n[o.program];
  }), r;
}
function xA (e, t) {
  const n = Object.assign({}, e.values);
  return Object.keys(e.uniforms || {}).forEach((s) => {
    e.uniforms[s].value && !(s in n) && (n[s] = e.uniforms[s].value);
  }), Object.keys(n).forEach((s) => {
    typeof n[s] === 'object' && n[s].index !== void 0 && (n[s].texture = t.getTexture(n[s].index));
  }), n;
}
const vA = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  decode: MA,
  encode: SA,
  name: RA
}, Symbol.toStringTag, { value: 'Module' })); const rc = [Ng, Cg, j0, z0, Q0, oA, EA, wA, vA, pA, e0];
function OA (e) {
  const t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}; const n = arguments.length > 2 ? arguments[2] : void 0;
  const s = rc.filter((i) => ic(i.name, t));
  for (const i of s) {
    var r;
    (r = i.preprocess) === null || r === void 0 || r.call(i, e, t, n);
  }
}
async function FA (e) {
  const t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}; const n = arguments.length > 2 ? arguments[2] : void 0;
  const s = rc.filter((i) => ic(i.name, t));
  for (const i of s) {
    var r;
    await ((r = i.decode) === null || r === void 0 ? void 0 : r.call(i, e, t, n));
  }
}
function ic (e, t) {
  let n;
  const s = (t == null || (n = t.gltf) === null || n === void 0 ? void 0 : n.excludeExtensions) || {};
  return !(e in s && !s[e]);
}
const Ms = 'KHR_binary_glTF';
function DA (e) {
  const t = new ot(e); const {
    json: n
  } = t;
  for (const s of n.images || []) {
    const r = t.getObjectExtension(s, Ms);
    r && Object.assign(s, r), t.removeObjectExtension(s, Ms);
  }
  n.buffers && n.buffers[0] && delete n.buffers[0].uri, t.removeExtension(Ms);
}
const $i = {
  accessors: 'accessor',
  animations: 'animation',
  buffers: 'buffer',
  bufferViews: 'bufferView',
  images: 'image',
  materials: 'material',
  meshes: 'mesh',
  nodes: 'node',
  samplers: 'sampler',
  scenes: 'scene',
  skins: 'skin',
  textures: 'texture'
}; const LA = {
  accessor: 'accessors',
  animations: 'animation',
  buffer: 'buffers',
  bufferView: 'bufferViews',
  image: 'images',
  material: 'materials',
  mesh: 'meshes',
  node: 'nodes',
  sampler: 'samplers',
  scene: 'scenes',
  skin: 'skins',
  texture: 'textures'
};
class PA {
  constructor () {
    this.idToIndexMap = {
      animations: {},
      accessors: {},
      buffers: {},
      bufferViews: {},
      images: {},
      materials: {},
      meshes: {},
      nodes: {},
      samplers: {},
      scenes: {},
      skins: {},
      textures: {}
    }, this.json = void 0;
  }

  normalize (t, n) {
    this.json = t.json;
    const s = t.json;
    switch (s.asset && s.asset.version) {
      case '2.0':
        return;
      case void 0:
      case '1.0':
        break;
      default:
        console.warn(`glTF: Unknown version ${s.asset.version}`);
        return;
    }
    if (!n.normalize) { throw new Error('glTF v1 is not supported.'); }
    console.warn('Converting glTF v1 to glTF v2 format. This is experimental and may fail.'), this._addAsset(s), this._convertTopLevelObjectsToArrays(s), DA(t), this._convertObjectIdsToArrayIndices(s), this._updateObjects(s), this._updateMaterial(s);
  }

  _addAsset (t) {
    t.asset = t.asset || {}, t.asset.version = '2.0', t.asset.generator = t.asset.generator || 'Normalized to glTF 2.0 by loaders.gl';
  }

  _convertTopLevelObjectsToArrays (t) {
    for (const n in $i) { this._convertTopLevelObjectToArray(t, n); }
  }

  _convertTopLevelObjectToArray (t, n) {
    const s = t[n];
    if (!(!s || Array.isArray(s))) {
      t[n] = [];
      for (const r in s) {
        const i = s[r];
        i.id = i.id || r;
        const o = t[n].length;
        t[n].push(i), this.idToIndexMap[n][r] = o;
      }
    }
  }

  _convertObjectIdsToArrayIndices (t) {
    for (const n in $i) { this._convertIdsToIndices(t, n); }
    'scene' in t && (t.scene = this._convertIdToIndex(t.scene, 'scene'));
    for (const n of t.textures) { this._convertTextureIds(n); }
    for (const n of t.meshes) { this._convertMeshIds(n); }
    for (const n of t.nodes) { this._convertNodeIds(n); }
    for (const n of t.scenes) { this._convertSceneIds(n); }
  }

  _convertTextureIds (t) {
    t.source && (t.source = this._convertIdToIndex(t.source, 'image'));
  }

  _convertMeshIds (t) {
    for (const n of t.primitives) {
      const {
        attributes: s,
        indices: r,
        material: i
      } = n;
      for (const o in s) { s[o] = this._convertIdToIndex(s[o], 'accessor'); }
      r && (n.indices = this._convertIdToIndex(r, 'accessor')), i && (n.material = this._convertIdToIndex(i, 'material'));
    }
  }

  _convertNodeIds (t) {
    t.children && (t.children = t.children.map((n) => this._convertIdToIndex(n, 'node'))), t.meshes && (t.meshes = t.meshes.map((n) => this._convertIdToIndex(n, 'mesh')));
  }

  _convertSceneIds (t) {
    t.nodes && (t.nodes = t.nodes.map((n) => this._convertIdToIndex(n, 'node')));
  }

  _convertIdsToIndices (t, n) {
    t[n] || (console.warn(`gltf v1: json doesn't contain attribute ${n}`), t[n] = []);
    for (const s of t[n]) {
      for (const r in s) {
        const i = s[r]; const o = this._convertIdToIndex(i, r);
        s[r] = o;
      }
    }
  }

  _convertIdToIndex (t, n) {
    const s = LA[n];
    if (s in this.idToIndexMap) {
      const r = this.idToIndexMap[s][t];
      if (!Number.isFinite(r)) { throw new Error(`gltf v1: failed to resolve ${n} with id ${t}`); }
      return r;
    }
    return t;
  }

  _updateObjects (t) {
    for (const n of this.json.buffers) { delete n.type; }
  }

  _updateMaterial (t) {
    for (const i of t.materials) {
      var n, s, r;
      i.pbrMetallicRoughness = {
        baseColorFactor: [1, 1, 1, 1],
        metallicFactor: 1,
        roughnessFactor: 1
      };
      const o = ((n = i.values) === null || n === void 0 ? void 0 : n.tex) || ((s = i.values) === null || s === void 0 ? void 0 : s.texture2d_0) || ((r = i.values) === null || r === void 0 ? void 0 : r.diffuseTex); const a = t.textures.findIndex((c) => c.id === o);
      a !== -1 && (i.pbrMetallicRoughness.baseColorTexture = {
        index: a
      });
    }
  }
}
function GA (e) {
  const t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return new PA().normalize(e, t);
}
async function NA (e, t) {
  let n, s, r;
  const i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0; const o = arguments.length > 3 ? arguments[3] : void 0; const a = arguments.length > 4 ? arguments[4] : void 0;
  return UA(e, t, i, o), GA(e, {
    normalize: o == null || (n = o.gltf) === null || n === void 0 ? void 0 : n.normalize
  }), OA(e, o, a), o != null && (s = o.gltf) !== null && s !== void 0 && s.loadBuffers && e.json.buffers && await HA(e, o, a), o != null && (r = o.gltf) !== null && r !== void 0 && r.loadImages && await JA(e, o, a), await FA(e, o, a), e;
}
function UA (e, t, n, s) {
  if (s.uri && (e.baseUri = s.uri), t instanceof ArrayBuffer && !_0(t, n, s) && (t = new TextDecoder().decode(t)), typeof t === 'string') { e.json = Du(t); } else if (t instanceof ArrayBuffer) {
    const o = {};
    n = w0(o, t, n, s.glb), yt(o.type === 'glTF', `Invalid GLB magic string ${o.type}`), e._glb = o, e.json = o.json;
  } else { yt(!1, 'GLTF: must be ArrayBuffer or string'); }
  const r = e.json.buffers || [];
  if (e.buffers = new Array(r.length).fill(null), e._glb && e._glb.header.hasBinChunk) {
    const {
      binChunks: o
    } = e._glb;
    e.buffers[0] = {
      arrayBuffer: o[0].arrayBuffer,
      byteOffset: o[0].byteOffset,
      byteLength: o[0].byteLength
    };
  }
  const i = e.json.images || [];
  e.images = new Array(i.length).fill({});
}
async function HA (e, t, n) {
  const s = e.json.buffers || [];
  for (let o = 0; o < s.length; ++o) {
    const a = s[o];
    if (a.uri) {
      var r, i;
      const {
        fetch: c
      } = n;
      yt(c);
      const u = ec(a.uri, t); const l = await (n == null || (r = n.fetch) === null || r === void 0 ? void 0 : r.call(n, u)); const h = await (l == null || (i = l.arrayBuffer) === null || i === void 0 ? void 0 : i.call(l));
      e.buffers[o] = {
        arrayBuffer: h,
        byteOffset: 0,
        byteLength: h.byteLength
      }, delete a.uri;
    } else {
      e.buffers[o] === null && (e.buffers[o] = {
        arrayBuffer: new ArrayBuffer(a.byteLength),
        byteOffset: 0,
        byteLength: a.byteLength
      });
    }
  }
}
async function JA (e, t, n) {
  const s = VA(e); const r = e.json.images || []; const i = [];
  for (const o of s) { i.push(jA(e, r[o], o, t, n)); }
  return await Promise.all(i);
}
function VA (e) {
  const t = /* @__PURE__ */ new Set(); const n = e.json.textures || [];
  for (const s of n) { s.source !== void 0 && t.add(s.source); }
  return Array.from(t).sort();
}
async function jA (e, t, n, s, r) {
  let i;
  if (t.uri && !t.hasOwnProperty('bufferView')) {
    const a = ec(t.uri, s); const {
      fetch: c
    } = r;
    i = await (await c(a)).arrayBuffer(), t.bufferView = {
      data: i
    };
  }
  if (Number.isFinite(t.bufferView)) {
    const a = lg(e.json, e.buffers, t.bufferView);
    i = dr(a.buffer, a.byteOffset, a.byteLength);
  }
  yt(i, 'glTF image has no data');
  let o = await Ke(i, [Zm, p0], {
    ...s,
    mimeType: t.mimeType,
    basis: s.basis || {
      format: tc()
    }
  }, r);
  o && o[0] && (o = {
    compressed: !0,
    mipmaps: !1,
    width: o[0].width,
    height: o[0].height,
    data: o[0]
  }), e.images = e.images || [], e.images[n] = o;
}
const Nn = {
  name: 'glTF',
  id: 'gltf',
  module: 'gltf',
  version: n0,
  extensions: ['gltf', 'glb'],
  mimeTypes: ['model/gltf+json', 'model/gltf-binary'],
  text: !0,
  binary: !0,
  tests: ['glTF'],
  parse: kA,
  options: {
    gltf: {
      normalize: !0,
      loadBuffers: !0,
      loadImages: !0,
      decompressMeshes: !0
    },
    log: console
  }
};
async function kA (e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}; const n = arguments.length > 2 ? arguments[2] : void 0;
  t = {
    ...Nn.options,
    ...t
  }, t.gltf = {
    ...Nn.options.gltf,
    ...t.gltf
  };
  const {
    byteOffset: s = 0
  } = t;
  return await NA({}, e, s, t, n);
}
const KA = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
}; const zA = {
  5120: 1,
  5121: 1,
  5122: 2,
  5123: 2,
  5125: 4,
  5126: 4
}; const Bt = {
  TEXTURE_MAG_FILTER: 10240,
  TEXTURE_MIN_FILTER: 10241,
  TEXTURE_WRAP_S: 10242,
  TEXTURE_WRAP_T: 10243,
  REPEAT: 10497,
  LINEAR: 9729,
  NEAREST_MIPMAP_LINEAR: 9986
}; const WA = {
  magFilter: Bt.TEXTURE_MAG_FILTER,
  minFilter: Bt.TEXTURE_MIN_FILTER,
  wrapS: Bt.TEXTURE_WRAP_S,
  wrapT: Bt.TEXTURE_WRAP_T
}; const XA = {
  [Bt.TEXTURE_MAG_FILTER]: Bt.LINEAR,
  [Bt.TEXTURE_MIN_FILTER]: Bt.NEAREST_MIPMAP_LINEAR,
  [Bt.TEXTURE_WRAP_S]: Bt.REPEAT,
  [Bt.TEXTURE_WRAP_T]: Bt.REPEAT
};
function QA () {
  return {
    id: 'default-sampler',
    parameters: XA
  };
}
function qA (e) {
  return zA[e];
}
function YA (e) {
  return KA[e];
}
class $A {
  constructor () {
    this.baseUri = '', this.jsonUnprocessed = void 0, this.json = void 0, this.buffers = [], this.images = [];
  }

  postProcess (t) {
    const n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const {
      json: s,
      buffers: r = [],
      images: i = []
    } = t; const {
      baseUri: o = ''
    } = t;
    return yt(s), this.baseUri = o, this.buffers = r, this.images = i, this.jsonUnprocessed = s, this.json = this._resolveTree(t.json, n), this.json;
  }

  _resolveTree (t) {
    const n = {
      ...t
    };
    return this.json = n, t.bufferViews && (n.bufferViews = t.bufferViews.map((s, r) => this._resolveBufferView(s, r))), t.images && (n.images = t.images.map((s, r) => this._resolveImage(s, r))), t.samplers && (n.samplers = t.samplers.map((s, r) => this._resolveSampler(s, r))), t.textures && (n.textures = t.textures.map((s, r) => this._resolveTexture(s, r))), t.accessors && (n.accessors = t.accessors.map((s, r) => this._resolveAccessor(s, r))), t.materials && (n.materials = t.materials.map((s, r) => this._resolveMaterial(s, r))), t.meshes && (n.meshes = t.meshes.map((s, r) => this._resolveMesh(s, r))), t.nodes && (n.nodes = t.nodes.map((s, r) => this._resolveNode(s, r)), n.nodes = n.nodes.map((s, r) => this._resolveNodeChildren(s))), t.skins && (n.skins = t.skins.map((s, r) => this._resolveSkin(s, r))), t.scenes && (n.scenes = t.scenes.map((s, r) => this._resolveScene(s, r))), typeof this.json.scene === 'number' && n.scenes && (n.scene = n.scenes[this.json.scene]), n;
  }

  getScene (t) {
    return this._get(this.json.scenes, t);
  }

  getNode (t) {
    return this._get(this.json.nodes, t);
  }

  getSkin (t) {
    return this._get(this.json.skins, t);
  }

  getMesh (t) {
    return this._get(this.json.meshes, t);
  }

  getMaterial (t) {
    return this._get(this.json.materials, t);
  }

  getAccessor (t) {
    return this._get(this.json.accessors, t);
  }

  getCamera (t) {
    return this._get(this.json.cameras, t);
  }

  getTexture (t) {
    return this._get(this.json.textures, t);
  }

  getSampler (t) {
    return this._get(this.json.samplers, t);
  }

  getImage (t) {
    return this._get(this.json.images, t);
  }

  getBufferView (t) {
    return this._get(this.json.bufferViews, t);
  }

  getBuffer (t) {
    return this._get(this.json.buffers, t);
  }

  _get (t, n) {
    if (typeof n === 'object') { return n; }
    const s = t && t[n];
    return s || console.warn(`glTF file error: Could not find ${t}[${n}]`), s;
  }

  _resolveScene (t, n) {
    return {
      ...t,
      id: t.id || `scene-${n}`,
      nodes: (t.nodes || []).map((s) => this.getNode(s))
    };
  }

  _resolveNode (t, n) {
    const s = {
      ...t,
      id: (t == null ? void 0 : t.id) || `node-${n}`
    };
    return t.mesh !== void 0 && (s.mesh = this.getMesh(t.mesh)), t.camera !== void 0 && (s.camera = this.getCamera(t.camera)), t.skin !== void 0 && (s.skin = this.getSkin(t.skin)), t.meshes !== void 0 && t.meshes.length && (s.mesh = t.meshes.reduce((r, i) => {
      const o = this.getMesh(i);
      return r.id = o.id, r.primitives = r.primitives.concat(o.primitives), r;
    }, {
      primitives: []
    })), s;
  }

  _resolveNodeChildren (t) {
    return t.children && (t.children = t.children.map((n) => this.getNode(n))), t;
  }

  _resolveSkin (t, n) {
    const s = typeof t.inverseBindMatrices === 'number' ? this.getAccessor(t.inverseBindMatrices) : void 0;
    return {
      ...t,
      id: t.id || `skin-${n}`,
      inverseBindMatrices: s
    };
  }

  _resolveMesh (t, n) {
    const s = {
      ...t,
      id: t.id || `mesh-${n}`,
      primitives: []
    };
    return t.primitives && (s.primitives = t.primitives.map((r) => {
      const i = {
        ...r,
        attributes: {},
        indices: void 0,
        material: void 0
      }; const o = r.attributes;
      for (const a in o) { i.attributes[a] = this.getAccessor(o[a]); }
      return r.indices !== void 0 && (i.indices = this.getAccessor(r.indices)), r.material !== void 0 && (i.material = this.getMaterial(r.material)), i;
    })), s;
  }

  _resolveMaterial (t, n) {
    const s = {
      ...t,
      id: t.id || `material-${n}`
    };
    if (s.normalTexture && (s.normalTexture = {
      ...s.normalTexture
    }, s.normalTexture.texture = this.getTexture(s.normalTexture.index)), s.occlusionTexture && (s.occlusionTexture = {
      ...s.occlusionTexture
    }, s.occlusionTexture.texture = this.getTexture(s.occlusionTexture.index)), s.emissiveTexture && (s.emissiveTexture = {
      ...s.emissiveTexture
    }, s.emissiveTexture.texture = this.getTexture(s.emissiveTexture.index)), s.emissiveFactor || (s.emissiveFactor = s.emissiveTexture ? [1, 1, 1] : [0, 0, 0]), s.pbrMetallicRoughness) {
      s.pbrMetallicRoughness = {
        ...s.pbrMetallicRoughness
      };
      const r = s.pbrMetallicRoughness;
      r.baseColorTexture && (r.baseColorTexture = {
        ...r.baseColorTexture
      }, r.baseColorTexture.texture = this.getTexture(r.baseColorTexture.index)), r.metallicRoughnessTexture && (r.metallicRoughnessTexture = {
        ...r.metallicRoughnessTexture
      }, r.metallicRoughnessTexture.texture = this.getTexture(r.metallicRoughnessTexture.index));
    }
    return s;
  }

  _resolveAccessor (t, n) {
    const s = qA(t.componentType); const r = YA(t.type); const i = s * r; const o = {
      ...t,
      id: t.id || `accessor-${n}`,
      bytesPerComponent: s,
      components: r,
      bytesPerElement: i,
      value: void 0,
      bufferView: void 0,
      sparse: void 0
    };
    if (t.bufferView !== void 0 && (o.bufferView = this.getBufferView(t.bufferView)), o.bufferView) {
      const a = o.bufferView.buffer; const {
        ArrayType: c,
        byteLength: u
      } = Ir(o, o.bufferView); const l = (o.bufferView.byteOffset || 0) + (o.byteOffset || 0) + a.byteOffset;
      let h = a.arrayBuffer.slice(l, l + u);
      o.bufferView.byteStride && (h = this._getValueFromInterleavedBuffer(a, l, o.bufferView.byteStride, o.bytesPerElement, o.count)), o.value = new c(h);
    }
    return o;
  }

  _getValueFromInterleavedBuffer (t, n, s, r, i) {
    const o = new Uint8Array(i * r);
    for (let a = 0; a < i; a++) {
      const c = n + a * s;
      o.set(new Uint8Array(t.arrayBuffer.slice(c, c + r)), a * r);
    }
    return o.buffer;
  }

  _resolveTexture (t, n) {
    return {
      ...t,
      id: t.id || `texture-${n}`,
      sampler: typeof t.sampler === 'number' ? this.getSampler(t.sampler) : QA(),
      source: typeof t.source === 'number' ? this.getImage(t.source) : void 0
    };
  }

  _resolveSampler (t, n) {
    const s = {
      id: t.id || `sampler-${n}`,
      ...t,
      parameters: {}
    };
    for (const r in s) {
      const i = this._enumSamplerParameter(r);
      i !== void 0 && (s.parameters[i] = s[r]);
    }
    return s;
  }

  _enumSamplerParameter (t) {
    return WA[t];
  }

  _resolveImage (t, n) {
    const s = {
      ...t,
      id: t.id || `image-${n}`,
      image: null,
      bufferView: t.bufferView !== void 0 ? this.getBufferView(t.bufferView) : void 0
    }; const r = this.images[n];
    return r && (s.image = r), s;
  }

  _resolveBufferView (t, n) {
    const s = t.buffer; const r = this.buffers[s].arrayBuffer;
    let i = this.buffers[s].byteOffset || 0;
    return t.byteOffset && (i += t.byteOffset), {
      id: `bufferView-${n}`,
      ...t,
      buffer: this.buffers[s],
      data: new Uint8Array(r, i, t.byteLength)
    };
  }

  _resolveCamera (t, n) {
    const s = {
      ...t,
      id: t.id || `camera-${n}`
    };
    return s.perspective, s.orthographic, s;
  }
}
function oc (e, t) {
  return new $A().postProcess(e, t);
}
const Zs = {
  URI: 0,
  EMBEDDED: 1
};
function ac (e, t, n, s) {
  e.rotateYtoZ = !0;
  const r = (e.byteOffset || 0) + (e.byteLength || 0) - n;
  if (r === 0) { throw new Error('glTF byte length must be greater than 0.'); }
  return e.gltfUpAxis = s != null && s['3d-tiles'] && s['3d-tiles'].assetGltfUpAxis ? s['3d-tiles'].assetGltfUpAxis : 'Y', e.gltfArrayBuffer = dr(t, n, r), e.gltfByteOffset = 0, e.gltfByteLength = r, n % 4 === 0 || console.warn(`${e.type}: embedded glb is not aligned to a 4-byte boundary.`), (e.byteOffset || 0) + (e.byteLength || 0);
}
async function cc (e, t, n, s) {
  const r = (n == null ? void 0 : n['3d-tiles']) || {};
  if (ZA(e, t), r.loadGLTF) {
    if (!s) { return; }
    if (e.gltfUrl) {
      const {
        fetch: i
      } = s; const o = await i(e.gltfUrl, n);
      e.gltfArrayBuffer = await o.arrayBuffer(), e.gltfByteOffset = 0;
    }
    if (e.gltfArrayBuffer) {
      const i = await Ke(e.gltfArrayBuffer, Nn, n, s);
      e.gltf = oc(i), e.gpuMemoryUsageInBytes = ka(e.gltf), delete e.gltfArrayBuffer, delete e.gltfByteOffset, delete e.gltfByteLength;
    }
  }
}
function ZA (e, t, n) {
  switch (t) {
    case Zs.URI:
      if (e.gltfArrayBuffer) {
        const s = new Uint8Array(e.gltfArrayBuffer, e.gltfByteOffset); const i = new TextDecoder().decode(s);
        e.gltfUrl = i.replace(/[\s\0]+$/, '');
      }
      delete e.gltfArrayBuffer, delete e.gltfByteOffset, delete e.gltfByteLength;
      break;
    case Zs.EMBEDDED:
      break;
    default:
      throw new Error('b3dm: Illegal glTF format field');
  }
}
async function tp (e, t, n, s, r) {
  let i;
  n = ep(e, t, n, s), await cc(e, Zs.EMBEDDED, s, r);
  const o = e == null || (i = e.gltf) === null || i === void 0 ? void 0 : i.extensions;
  return o && o.CESIUM_RTC && (e.rtcCenter = o.CESIUM_RTC.center), n;
}
function ep (e, t, n, s, r) {
  n = qn(e, t, n), n = _r(e, t, n), n = wr(e, t, n), n = ac(e, t, n, s);
  const i = new br(e.featureTableJson, e.featureTableBinary);
  return e.rtcCenter = i.getGlobalProperty('RTC_CENTER', G.FLOAT, 3), n;
}
async function np (e, t, n, s, r) {
  return n = sp(e, t, n, s), await cc(e, e.gltfFormat || 0, s, r), n;
}
function sp (e, t, n, s, r) {
  let i;
  if (n = qn(e, t, n), e.version !== 1) { throw new Error(`Instanced 3D Model version ${e.version} is not supported`); }
  n = _r(e, t, n);
  const o = new DataView(t);
  if (e.gltfFormat = o.getUint32(n, !0), n += 4, n = wr(e, t, n), n = ac(e, t, n, s), !(e != null && (i = e.header) !== null && i !== void 0 && i.featureTableJsonByteLength) || e.header.featureTableJsonByteLength === 0) { throw new Error('i3dm parser: featureTableJsonByteLength is zero.'); }
  const a = new br(e.featureTableJson, e.featureTableBinary); const c = a.getGlobalProperty('INSTANCES_LENGTH');
  if (a.featuresLength = c, !Number.isFinite(c)) { throw new Error('i3dm parser: INSTANCES_LENGTH must be defined'); }
  e.eastNorthUp = a.getGlobalProperty('EAST_NORTH_UP'), e.rtcCenter = a.getGlobalProperty('RTC_CENTER', G.FLOAT, 3);
  const u = new Pa(e.batchTableJson, e.batchTableBinary, c);
  return rp(e, a, u, c), n;
}
function rp (e, t, n, s) {
  const r = new Array(s); const i = new A();
  new A(), new A(), new A();
  const o = new X(); const a = new On(); const c = new A(); const u = {}; const l = new V(); const h = []; const f = []; const d = []; const m = [];
  for (let g = 0; g < s; g++) {
    let y;
    if (t.hasProperty('POSITION')) { y = t.getProperty('POSITION', G.FLOAT, 3, g, i); } else if (t.hasProperty('POSITION_QUANTIZED')) {
      y = t.getProperty('POSITION_QUANTIZED', G.UNSIGNED_SHORT, 3, g, i);
      const b = t.getGlobalProperty('QUANTIZED_VOLUME_OFFSET', G.FLOAT, 3);
      if (!b) { throw new Error('i3dm parser: QUANTIZED_VOLUME_OFFSET must be defined for quantized positions.'); }
      const O = t.getGlobalProperty('QUANTIZED_VOLUME_SCALE', G.FLOAT, 3);
      if (!O) { throw new Error('i3dm parser: QUANTIZED_VOLUME_SCALE must be defined for quantized positions.'); }
      const F = 65535;
      for (let v = 0; v < 3; v++) { y[v] = y[v] / F * O[v] + b[v]; }
    }
    if (!y) { throw new Error('i3dm: POSITION or POSITION_QUANTIZED must be defined for each instance.'); }
    if (i.copy(y), u.translation = i, e.normalUp = t.getProperty('NORMAL_UP', G.FLOAT, 3, g, h), e.normalRight = t.getProperty('NORMAL_RIGHT', G.FLOAT, 3, g, f), e.normalUp) {
      if (!e.normalRight) { throw new Error('i3dm: Custom orientation requires both NORMAL_UP and NORMAL_RIGHT.'); }
      e.hasCustomOrientation = !0;
    } else {
      if (e.octNormalUp = t.getProperty('NORMAL_UP_OCT32P', G.UNSIGNED_SHORT, 2, g, h), e.octNormalRight = t.getProperty('NORMAL_RIGHT_OCT32P', G.UNSIGNED_SHORT, 2, g, f), e.octNormalUp) { throw e.octNormalRight ? new Error('i3dm: oct-encoded orientation not implemented') : new Error('i3dm: oct-encoded orientation requires NORMAL_UP_OCT32P and NORMAL_RIGHT_OCT32P'); }
      e.eastNorthUp ? (J.WGS84.eastNorthUpToFixedFrame(i, l), l.getRotationMatrix3(o)) : o.identity();
    }
    a.fromMatrix3(o), u.rotation = a, c.set(1, 1, 1);
    const E = t.getProperty('SCALE', G.FLOAT, 1, g, d);
    Number.isFinite(E) && c.multiplyByScalar(E);
    const R = t.getProperty('SCALE_NON_UNIFORM', G.FLOAT, 3, g, h);
    R && c.scale(R), u.scale = c;
    let B = t.getProperty('BATCH_ID', G.UNSIGNED_SHORT, 1, g, m);
    B === void 0 && (B = g);
    const C = new V().fromQuaternion(u.rotation);
    l.identity(), l.translate(u.translation), l.multiplyRight(C), l.scale(u.scale);
    const M = l.clone();
    r[g] = {
      modelMatrix: M,
      batchId: B
    };
  }
  e.instances = r;
}
async function ip (e, t, n, s, r, i) {
  n = qn(e, t, n);
  const o = new DataView(t);
  for (e.tilesLength = o.getUint32(n, !0), n += 4, e.tiles = []; e.tiles.length < e.tilesLength && (e.byteLength || 0) - n > 12;) {
    const a = {
      shape: 'tile3d'
    };
    e.tiles.push(a), n = await i(t, n, s, r, a);
  }
  return n;
}
async function op (e, t, n, s) {
  let r, i;
  if (e.rotateYtoZ = !0, e.gltfUpAxis = n != null && (r = n['3d-tiles']) !== null && r !== void 0 && r.assetGltfUpAxis ? n['3d-tiles'].assetGltfUpAxis : 'Y', n != null && (i = n['3d-tiles']) !== null && i !== void 0 && i.loadGLTF) {
    if (!s) { return t.byteLength; }
    const o = await Ke(t, Nn, n, s);
    e.gltf = oc(o), e.gpuMemoryUsageInBytes = ka(e.gltf);
  } else { e.gltfArrayBuffer = t; }
  return t.byteLength;
}
async function uc (e) {
  const t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0; const n = arguments.length > 2 ? arguments[2] : void 0; const s = arguments.length > 3 ? arguments[3] : void 0; const r = arguments.length > 4 && arguments[4] !== void 0
    ? arguments[4]
    : {
        shape: 'tile3d'
      };
  switch (r.byteOffset = t, r.type = Sd(e, t), r.type) {
    case _e.COMPOSITE:
      return await ip(r, e, t, n, s, uc);
    case _e.BATCHED_3D_MODEL:
      return await tp(r, e, t, n, s);
    case _e.GLTF:
      return await op(r, e, n, s);
    case _e.INSTANCED_3D_MODEL:
      return await np(r, e, t, n, s);
    case _e.POINT_CLOUD:
      return await fm(r, e, t, n, s);
    default:
      throw new Error(`3DTileLoader: unknown type ${r.type}`);
  }
}
const ap = 1952609651; const cp = 1;
async function up (e, t, n) {
  if (new Uint32Array(e.slice(0, 4))[0] !== ap) { throw new Error('Wrong subtree file magic number'); }
  if (new Uint32Array(e.slice(4, 8))[0] !== cp) { throw new Error('Wrong subtree file verson, must be 1'); }
  const i = Zi(e.slice(8, 16)); const o = new Uint8Array(e, 24, i); const c = new TextDecoder('utf8').decode(o); const u = JSON.parse(c); const l = Zi(e.slice(16, 24));
  let h = new ArrayBuffer(0);
  if (l && (h = e.slice(24 + i)), await pn(u, u.tileAvailability, h, n), Array.isArray(u.contentAvailability)) {
    for (const f of u.contentAvailability) { await pn(u, f, h, n); }
  } else { await pn(u, u.contentAvailability, h, n); }
  return await pn(u, u.childSubtreeAvailability, h, n), u;
}
async function pn (e, t, n, s) {
  const r = Number.isFinite(t.bitstream) ? t.bitstream : t.bufferView;
  if (typeof r !== 'number') { return; }
  const i = e.bufferViews[r]; const o = e.buffers[i.buffer];
  if (!(s != null && s.baseUrl)) { throw new Error('Url is not provided'); }
  if (!s.fetch) { throw new Error('fetch is not provided'); }
  if (o.uri) {
    const c = `${(s == null ? void 0 : s.baseUrl) || ''}/${o.uri}`; const l = await (await s.fetch(c)).arrayBuffer();
    t.explicitBitstream = new Uint8Array(l, i.byteOffset, i.byteLength);
    return;
  }
  const a = e.buffers.slice(0, i.buffer).reduce((c, u) => c + u.byteLength, 0);
  t.explicitBitstream = new Uint8Array(n.slice(a, a + o.byteLength), i.byteOffset, i.byteLength);
}
function Zi (e) {
  const t = new DataView(e); const n = t.getUint32(0, !0); const s = t.getUint32(4, !0);
  return n + 2 ** 32 * s;
}
const lc = {
  id: '3d-tiles-subtree',
  name: '3D Tiles Subtree',
  module: '3d-tiles',
  version: va,
  extensions: ['subtree'],
  mimeTypes: ['application/octet-stream'],
  tests: ['subtree'],
  parse: up,
  options: {}
};
/**
 * @license
 * Copyright 2009 The Closure Library Authors
 * Copyright 2020 Daniel Wirtz / The long.js Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
let Et = null;
try {
  Et = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
    0,
    97,
    115,
    109,
    1,
    0,
    0,
    0,
    1,
    13,
    2,
    96,
    0,
    1,
    127,
    96,
    4,
    127,
    127,
    127,
    127,
    1,
    127,
    3,
    7,
    6,
    0,
    1,
    1,
    1,
    1,
    1,
    6,
    6,
    1,
    127,
    1,
    65,
    0,
    11,
    7,
    50,
    6,
    3,
    109,
    117,
    108,
    0,
    1,
    5,
    100,
    105,
    118,
    95,
    115,
    0,
    2,
    5,
    100,
    105,
    118,
    95,
    117,
    0,
    3,
    5,
    114,
    101,
    109,
    95,
    115,
    0,
    4,
    5,
    114,
    101,
    109,
    95,
    117,
    0,
    5,
    8,
    103,
    101,
    116,
    95,
    104,
    105,
    103,
    104,
    0,
    0,
    10,
    191,
    1,
    6,
    4,
    0,
    35,
    0,
    11,
    36,
    1,
    1,
    126,
    32,
    0,
    173,
    32,
    1,
    173,
    66,
    32,
    134,
    132,
    32,
    2,
    173,
    32,
    3,
    173,
    66,
    32,
    134,
    132,
    126,
    34,
    4,
    66,
    32,
    135,
    167,
    36,
    0,
    32,
    4,
    167,
    11,
    36,
    1,
    1,
    126,
    32,
    0,
    173,
    32,
    1,
    173,
    66,
    32,
    134,
    132,
    32,
    2,
    173,
    32,
    3,
    173,
    66,
    32,
    134,
    132,
    127,
    34,
    4,
    66,
    32,
    135,
    167,
    36,
    0,
    32,
    4,
    167,
    11,
    36,
    1,
    1,
    126,
    32,
    0,
    173,
    32,
    1,
    173,
    66,
    32,
    134,
    132,
    32,
    2,
    173,
    32,
    3,
    173,
    66,
    32,
    134,
    132,
    128,
    34,
    4,
    66,
    32,
    135,
    167,
    36,
    0,
    32,
    4,
    167,
    11,
    36,
    1,
    1,
    126,
    32,
    0,
    173,
    32,
    1,
    173,
    66,
    32,
    134,
    132,
    32,
    2,
    173,
    32,
    3,
    173,
    66,
    32,
    134,
    132,
    129,
    34,
    4,
    66,
    32,
    135,
    167,
    36,
    0,
    32,
    4,
    167,
    11,
    36,
    1,
    1,
    126,
    32,
    0,
    173,
    32,
    1,
    173,
    66,
    32,
    134,
    132,
    32,
    2,
    173,
    32,
    3,
    173,
    66,
    32,
    134,
    132,
    130,
    34,
    4,
    66,
    32,
    135,
    167,
    36,
    0,
    32,
    4,
    167,
    11
  ])), {}).exports;
} catch {
}
function H (e, t, n) {
  this.low = e | 0, this.high = t | 0, this.unsigned = !!n;
}
H.prototype.__isLong__;
Object.defineProperty(H.prototype, '__isLong__', { value: !0 });
function at (e) {
  return (e && e.__isLong__) === !0;
}
function to (e) {
  const t = Math.clz32(e & -e);
  return e ? 31 - t : t;
}
H.isLong = at;
const eo = {}; const no = {};
function ie (e, t) {
  let n, s, r;
  return t ? (e >>>= 0, (r = e >= 0 && e < 256) && (s = no[e], s) ? s : (n = N(e, 0, !0), r && (no[e] = n), n)) : (e |= 0, (r = e >= -128 && e < 128) && (s = eo[e], s) ? s : (n = N(e, e < 0 ? -1 : 0, !1), r && (eo[e] = n), n));
}
H.fromInt = ie;
function Tt (e, t) {
  if (isNaN(e)) { return t ? Ut : St; }
  if (t) {
    if (e < 0) { return Ut; }
    if (e >= hc) { return mc; }
  } else {
    if (e <= -ro) { return mt; }
    if (e + 1 >= ro) { return dc; }
  }
  return e < 0 ? Tt(-e, t).neg() : N(e % ye | 0, e / ye | 0, t);
}
H.fromNumber = Tt;
function N (e, t, n) {
  return new H(e, t, n);
}
H.fromBits = N;
const Un = Math.pow;
function Pr (e, t, n) {
  if (e.length === 0) { throw Error('empty string'); }
  if (typeof t === 'number' ? (n = t, t = !1) : t = !!t, e === 'NaN' || e === 'Infinity' || e === '+Infinity' || e === '-Infinity') { return t ? Ut : St; }
  if (n = n || 10, n < 2 || n > 36) { throw RangeError('radix'); }
  let s;
  if ((s = e.indexOf('-')) > 0) { throw Error('interior hyphen'); }
  if (s === 0) { return Pr(e.substring(1), t, n).neg(); }
  for (var r = Tt(Un(n, 8)), i = St, o = 0; o < e.length; o += 8) {
    const a = Math.min(8, e.length - o); const c = parseInt(e.substring(o, o + a), n);
    if (a < 8) {
      const u = Tt(Un(n, a));
      i = i.mul(u).add(Tt(c));
    } else { i = i.mul(r), i = i.add(Tt(c)); }
  }
  return i.unsigned = t, i;
}
H.fromString = Pr;
function xt (e, t) {
  return typeof e === 'number' ? Tt(e, t) : typeof e === 'string' ? Pr(e, t) : N(e.low, e.high, typeof t === 'boolean' ? t : e.unsigned);
}
H.fromValue = xt;
const so = 65536; const lp = 1 << 24; var ye = so * so; var hc = ye * ye; var ro = hc / 2; const io = ie(lp); var St = ie(0);
H.ZERO = St;
var Ut = ie(0, !0);
H.UZERO = Ut;
const de = ie(1);
H.ONE = de;
const fc = ie(1, !0);
H.UONE = fc;
const tr = ie(-1);
H.NEG_ONE = tr;
var dc = N(-1, 2147483647, !1);
H.MAX_VALUE = dc;
var mc = N(-1, -1, !0);
H.MAX_UNSIGNED_VALUE = mc;
var mt = N(0, -2147483648, !1);
H.MIN_VALUE = mt;
const _ = H.prototype;
_.toInt = function () {
  return this.unsigned ? this.low >>> 0 : this.low;
};
_.toNumber = function () {
  return this.unsigned ? (this.high >>> 0) * ye + (this.low >>> 0) : this.high * ye + (this.low >>> 0);
};
_.toString = function (t) {
  if (t = t || 10, t < 2 || t > 36) { throw RangeError('radix'); }
  if (this.isZero()) { return '0'; }
  if (this.isNegative()) {
    if (this.eq(mt)) {
      const n = Tt(t); const s = this.div(n); const r = s.mul(n).sub(this);
      return s.toString(t) + r.toInt().toString(t);
    } else { return '-' + this.neg().toString(t); }
  }
  for (let i = Tt(Un(t, 6), this.unsigned), o = this, a = ''; ;) {
    const c = o.div(i); const u = o.sub(c.mul(i)).toInt() >>> 0; let l = u.toString(t);
    if (o = c, o.isZero()) { return l + a; }
    for (; l.length < 6;) { l = '0' + l; }
    a = '' + l + a;
  }
};
_.getHighBits = function () {
  return this.high;
};
_.getHighBitsUnsigned = function () {
  return this.high >>> 0;
};
_.getLowBits = function () {
  return this.low;
};
_.getLowBitsUnsigned = function () {
  return this.low >>> 0;
};
_.getNumBitsAbs = function () {
  if (this.isNegative()) { return this.eq(mt) ? 64 : this.neg().getNumBitsAbs(); }
  for (var t = this.high != 0 ? this.high : this.low, n = 31; n > 0 && !(t & 1 << n); n--)
    ;
  return this.high != 0 ? n + 33 : n + 1;
};
_.isZero = function () {
  return this.high === 0 && this.low === 0;
};
_.eqz = _.isZero;
_.isNegative = function () {
  return !this.unsigned && this.high < 0;
};
_.isPositive = function () {
  return this.unsigned || this.high >= 0;
};
_.isOdd = function () {
  return (this.low & 1) === 1;
};
_.isEven = function () {
  return (this.low & 1) === 0;
};
_.equals = function (t) {
  return at(t) || (t = xt(t)), this.unsigned !== t.unsigned && this.high >>> 31 === 1 && t.high >>> 31 === 1 ? !1 : this.high === t.high && this.low === t.low;
};
_.eq = _.equals;
_.notEquals = function (t) {
  return !this.eq(
    /* validates */
    t
  );
};
_.neq = _.notEquals;
_.ne = _.notEquals;
_.lessThan = function (t) {
  return this.comp(
    /* validates */
    t
  ) < 0;
};
_.lt = _.lessThan;
_.lessThanOrEqual = function (t) {
  return this.comp(
    /* validates */
    t
  ) <= 0;
};
_.lte = _.lessThanOrEqual;
_.le = _.lessThanOrEqual;
_.greaterThan = function (t) {
  return this.comp(
    /* validates */
    t
  ) > 0;
};
_.gt = _.greaterThan;
_.greaterThanOrEqual = function (t) {
  return this.comp(
    /* validates */
    t
  ) >= 0;
};
_.gte = _.greaterThanOrEqual;
_.ge = _.greaterThanOrEqual;
_.compare = function (t) {
  if (at(t) || (t = xt(t)), this.eq(t)) { return 0; }
  const n = this.isNegative(); const s = t.isNegative();
  return n && !s ? -1 : !n && s ? 1 : this.unsigned ? t.high >>> 0 > this.high >>> 0 || t.high === this.high && t.low >>> 0 > this.low >>> 0 ? -1 : 1 : this.sub(t).isNegative() ? -1 : 1;
};
_.comp = _.compare;
_.negate = function () {
  return !this.unsigned && this.eq(mt) ? mt : this.not().add(de);
};
_.neg = _.negate;
_.add = function (t) {
  at(t) || (t = xt(t));
  const n = this.high >>> 16; const s = this.high & 65535; const r = this.low >>> 16; const i = this.low & 65535; const o = t.high >>> 16; const a = t.high & 65535; const c = t.low >>> 16; const u = t.low & 65535; let l = 0; let h = 0; let f = 0; let d = 0;
  return d += i + u, f += d >>> 16, d &= 65535, f += r + c, h += f >>> 16, f &= 65535, h += s + a, l += h >>> 16, h &= 65535, l += n + o, l &= 65535, N(f << 16 | d, l << 16 | h, this.unsigned);
};
_.subtract = function (t) {
  return at(t) || (t = xt(t)), this.add(t.neg());
};
_.sub = _.subtract;
_.multiply = function (t) {
  if (this.isZero()) { return this; }
  if (at(t) || (t = xt(t)), Et) {
    const n = Et.mul(
      this.low,
      this.high,
      t.low,
      t.high
    );
    return N(n, Et.get_high(), this.unsigned);
  }
  if (t.isZero()) { return this.unsigned ? Ut : St; }
  if (this.eq(mt)) { return t.isOdd() ? mt : St; }
  if (t.eq(mt)) { return this.isOdd() ? mt : St; }
  if (this.isNegative()) { return t.isNegative() ? this.neg().mul(t.neg()) : this.neg().mul(t).neg(); }
  if (t.isNegative()) { return this.mul(t.neg()).neg(); }
  if (this.lt(io) && t.lt(io)) { return Tt(this.toNumber() * t.toNumber(), this.unsigned); }
  const s = this.high >>> 16; const r = this.high & 65535; const i = this.low >>> 16; const o = this.low & 65535; const a = t.high >>> 16; const c = t.high & 65535; const u = t.low >>> 16; const l = t.low & 65535; let h = 0; let f = 0; let d = 0; let m = 0;
  return m += o * l, d += m >>> 16, m &= 65535, d += i * l, f += d >>> 16, d &= 65535, d += o * u, f += d >>> 16, d &= 65535, f += r * l, h += f >>> 16, f &= 65535, f += i * u, h += f >>> 16, f &= 65535, f += o * c, h += f >>> 16, f &= 65535, h += s * l + r * u + i * c + o * a, h &= 65535, N(d << 16 | m, h << 16 | f, this.unsigned);
};
_.mul = _.multiply;
_.divide = function (t) {
  if (at(t) || (t = xt(t)), t.isZero()) { throw Error('division by zero'); }
  if (Et) {
    if (!this.unsigned && this.high === -2147483648 && t.low === -1 && t.high === -1) { return this; }
    const n = (this.unsigned ? Et.div_u : Et.div_s)(
      this.low,
      this.high,
      t.low,
      t.high
    );
    return N(n, Et.get_high(), this.unsigned);
  }
  if (this.isZero()) { return this.unsigned ? Ut : St; }
  let s, r, i;
  if (this.unsigned) {
    if (t.unsigned || (t = t.toUnsigned()), t.gt(this)) { return Ut; }
    if (t.gt(this.shru(1))) { return fc; }
    i = Ut;
  } else {
    if (this.eq(mt)) {
      if (t.eq(de) || t.eq(tr)) { return mt; }
      if (t.eq(mt)) { return de; }
      const o = this.shr(1);
      return s = o.div(t).shl(1), s.eq(St) ? t.isNegative() ? de : tr : (r = this.sub(t.mul(s)), i = s.add(r.div(t)), i);
    } else if (t.eq(mt)) { return this.unsigned ? Ut : St; }
    if (this.isNegative()) { return t.isNegative() ? this.neg().div(t.neg()) : this.neg().div(t).neg(); }
    if (t.isNegative()) { return this.div(t.neg()).neg(); }
    i = St;
  }
  for (r = this; r.gte(t);) {
    s = Math.max(1, Math.floor(r.toNumber() / t.toNumber()));
    for (var a = Math.ceil(Math.log(s) / Math.LN2), c = a <= 48 ? 1 : Un(2, a - 48), u = Tt(s), l = u.mul(t); l.isNegative() || l.gt(r);) { s -= c, u = Tt(s, this.unsigned), l = u.mul(t); }
    u.isZero() && (u = de), i = i.add(u), r = r.sub(l);
  }
  return i;
};
_.div = _.divide;
_.modulo = function (t) {
  if (at(t) || (t = xt(t)), Et) {
    const n = (this.unsigned ? Et.rem_u : Et.rem_s)(
      this.low,
      this.high,
      t.low,
      t.high
    );
    return N(n, Et.get_high(), this.unsigned);
  }
  return this.sub(this.div(t).mul(t));
};
_.mod = _.modulo;
_.rem = _.modulo;
_.not = function () {
  return N(~this.low, ~this.high, this.unsigned);
};
_.countLeadingZeros = function () {
  return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32;
};
_.clz = _.countLeadingZeros;
_.countTrailingZeros = function () {
  return this.low ? to(this.low) : to(this.high) + 32;
};
_.ctz = _.countTrailingZeros;
_.and = function (t) {
  return at(t) || (t = xt(t)), N(this.low & t.low, this.high & t.high, this.unsigned);
};
_.or = function (t) {
  return at(t) || (t = xt(t)), N(this.low | t.low, this.high | t.high, this.unsigned);
};
_.xor = function (t) {
  return at(t) || (t = xt(t)), N(this.low ^ t.low, this.high ^ t.high, this.unsigned);
};
_.shiftLeft = function (t) {
  return at(t) && (t = t.toInt()), (t &= 63) === 0 ? this : t < 32 ? N(this.low << t, this.high << t | this.low >>> 32 - t, this.unsigned) : N(0, this.low << t - 32, this.unsigned);
};
_.shl = _.shiftLeft;
_.shiftRight = function (t) {
  return at(t) && (t = t.toInt()), (t &= 63) === 0 ? this : t < 32 ? N(this.low >>> t | this.high << 32 - t, this.high >> t, this.unsigned) : N(this.high >> t - 32, this.high >= 0 ? 0 : -1, this.unsigned);
};
_.shr = _.shiftRight;
_.shiftRightUnsigned = function (t) {
  return at(t) && (t = t.toInt()), (t &= 63) === 0 ? this : t < 32 ? N(this.low >>> t | this.high << 32 - t, this.high >>> t, this.unsigned) : t === 32 ? N(this.high, 0, this.unsigned) : N(this.high >>> t - 32, 0, this.unsigned);
};
_.shru = _.shiftRightUnsigned;
_.shr_u = _.shiftRightUnsigned;
_.rotateLeft = function (t) {
  let n;
  return at(t) && (t = t.toInt()), (t &= 63) === 0 ? this : t === 32 ? N(this.high, this.low, this.unsigned) : t < 32 ? (n = 32 - t, N(this.low << t | this.high >>> n, this.high << t | this.low >>> n, this.unsigned)) : (t -= 32, n = 32 - t, N(this.high << t | this.low >>> n, this.low << t | this.high >>> n, this.unsigned));
};
_.rotl = _.rotateLeft;
_.rotateRight = function (t) {
  let n;
  return at(t) && (t = t.toInt()), (t &= 63) === 0 ? this : t === 32 ? N(this.high, this.low, this.unsigned) : t < 32 ? (n = 32 - t, N(this.high << n | this.low >>> t, this.low << n | this.high >>> t, this.unsigned)) : (t -= 32, n = 32 - t, N(this.low << n | this.high >>> t, this.high << n | this.low >>> t, this.unsigned));
};
_.rotr = _.rotateRight;
_.toSigned = function () {
  return this.unsigned ? N(this.low, this.high, !1) : this;
};
_.toUnsigned = function () {
  return this.unsigned ? this : N(this.low, this.high, !0);
};
_.toBytes = function (t) {
  return t ? this.toBytesLE() : this.toBytesBE();
};
_.toBytesLE = function () {
  const t = this.high; const n = this.low;
  return [
    n & 255,
    n >>> 8 & 255,
    n >>> 16 & 255,
    n >>> 24,
    t & 255,
    t >>> 8 & 255,
    t >>> 16 & 255,
    t >>> 24
  ];
};
_.toBytesBE = function () {
  const t = this.high; const n = this.low;
  return [
    t >>> 24,
    t >>> 16 & 255,
    t >>> 8 & 255,
    t & 255,
    n >>> 24,
    n >>> 16 & 255,
    n >>> 8 & 255,
    n & 255
  ];
};
H.fromBytes = function (t, n, s) {
  return s ? H.fromBytesLE(t, n) : H.fromBytesBE(t, n);
};
H.fromBytesLE = function (t, n) {
  return new H(
    t[0] | t[1] << 8 | t[2] << 16 | t[3] << 24,
    t[4] | t[5] << 8 | t[6] << 16 | t[7] << 24,
    n
  );
};
H.fromBytesBE = function (t, n) {
  return new H(
    t[4] << 24 | t[5] << 16 | t[6] << 8 | t[7],
    t[0] << 24 | t[1] << 16 | t[2] << 8 | t[3],
    n
  );
};
const hp = 16;
function gc (e) {
  e === 'X' && (e = '');
  const t = e.padEnd(hp, '0');
  return H.fromString(t, !0, 16);
}
function fp (e) {
  if (e.isZero()) { return 'X'; }
  let t = e.countTrailingZeros();
  const n = t % 4;
  t = (t - n) / 4;
  const s = t;
  t *= 4;
  const i = e.shiftRightUnsigned(t).toString(16).replace(/0+$/, '');
  return Array(17 - s - i.length).join('0') + i;
}
function dp (e, t) {
  const n = mp(e).shiftRightUnsigned(2);
  return e.add(H.fromNumber(2 * t + 1 - 4).multiply(n));
}
function mp (e) {
  return e.and(e.not().add(1));
}
const gp = 3; const Ap = 30; const pp = 2 * Ap + 1; const oo = 180 / Math.PI;
function yp (e) {
  if (e.length === 0) { throw new Error(`Invalid Hilbert quad key ${e}`); }
  const t = e.split('/'); const n = parseInt(t[0], 10); const s = t[1]; const r = s.length;
  let i = 0;
  const o = [0, 0];
  for (let a = r - 1; a >= 0; a--) {
    i = r - a;
    const c = s[a];
    let u = 0; let l = 0;
    c === '1' ? l = 1 : c === '2' ? (u = 1, l = 1) : c === '3' && (u = 1);
    const h = Math.pow(2, i - 1);
    Cp(h, o, u, l), o[0] += h * u, o[1] += h * l;
  }
  if (n % 2 === 1) {
    const a = o[0];
    o[0] = o[1], o[1] = a;
  }
  return {
    face: n,
    ij: o,
    level: i
  };
}
function Bp (e) {
  if (e.isZero()) { return ''; }
  let t = e.toString(2);
  for (; t.length < gp + pp;) { t = '0' + t; }
  const n = t.lastIndexOf('1'); const s = t.substring(0, 3); const r = t.substring(3, n); const i = r.length / 2; const o = H.fromString(s, !0, 2).toString(10);
  let a = '';
  if (i !== 0) {
    for (a = H.fromString(r, !0, 2).toString(4); a.length < i;) { a = '0' + a; }
  }
  return `${o}/${a}`;
}
function Ac (e, t, n) {
  const s = 1 << t;
  return [(e[0] + n[0]) / s, (e[1] + n[1]) / s];
}
function ao (e) {
  return e >= 0.5 ? 1 / 3 * (4 * e * e - 1) : 1 / 3 * (1 - 4 * (1 - e) * (1 - e));
}
function pc (e) {
  return [ao(e[0]), ao(e[1])];
}
function yc (e, t) {
  const [n, s] = t;
  switch (e) {
    case 0:
      return [1, n, s];
    case 1:
      return [-n, 1, s];
    case 2:
      return [-n, -s, 1];
    case 3:
      return [-1, -s, -n];
    case 4:
      return [s, -1, -n];
    case 5:
      return [s, n, -1];
    default:
      throw new Error('Invalid face');
  }
}
function Bc (e) {
  const [t, n, s] = e;
  const r = Math.atan2(s, Math.sqrt(t * t + n * n));
  return [Math.atan2(n, t) * oo, r * oo];
}
function Cp (e, t, n, s) {
  if (s === 0) {
    n === 1 && (t[0] = e - 1 - t[0], t[1] = e - 1 - t[1]);
    const r = t[0];
    t[0] = t[1], t[1] = r;
  }
}
function Ep (e) {
  const t = Ac(e.ij, e.level, [0.5, 0.5]); const n = pc(t); const s = yc(e.face, n);
  return Bc(s);
}
const Tp = 100;
function co (e) {
  const {
    face: t,
    ij: n,
    level: s
  } = e; const r = [[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]; const i = Math.max(1, Math.ceil(Tp * Math.pow(2, -s))); const o = new Float64Array(4 * i * 2 + 2);
  let a = 0; let c = 0;
  for (let u = 0; u < 4; u++) {
    const l = r[u].slice(0); const h = r[u + 1]; const f = (h[0] - l[0]) / i; const d = (h[1] - l[1]) / i;
    for (let m = 0; m < i; m++) {
      l[0] += f, l[1] += d;
      const g = Ac(n, s, l); const y = pc(g); const E = yc(t, y); const R = Bc(E);
      Math.abs(R[1]) > 89.999 && (R[0] = c);
      const B = R[0] - c;
      R[0] += B > 180 ? -360 : B < -180 ? 360 : 0, o[a++] = R[0], o[a++] = R[1], c = R[0];
    }
  }
  return o[a++] = o[0], o[a++] = o[1], o;
}
function Gr (e) {
  const t = bp(e);
  return yp(t);
}
function bp (e) {
  if (e.indexOf('/') > 0) { return e; }
  const t = gc(e);
  return Bp(t);
}
function _p (e) {
  const t = Gr(e);
  return Ep(t);
}
function wp (e) {
  let t;
  if (e.face === 2 || e.face === 5) {
    let n = null; let s = 0;
    for (let r = 0; r < 4; r++) {
      const i = `${e.face}/${r}`; const o = Gr(i); const a = co(o);
      (typeof n > 'u' || n === null) && (n = new Float64Array(4 * a.length)), n.set(a, s), s += a.length;
    }
    t = uo(n);
  } else {
    const n = co(e);
    t = uo(n);
  }
  return t;
}
function uo (e) {
  if (e.length % 2 !== 0) { throw new Error('Invalid corners'); }
  const t = []; const n = [];
  for (let s = 0; s < e.length; s += 2) { t.push(e[s]), n.push(e[s + 1]); }
  return t.sort((s, r) => s - r), n.sort((s, r) => s - r), {
    west: t[0],
    east: t[t.length - 1],
    north: n[n.length - 1],
    south: n[0]
  };
}
function Rp (e, t) {
  const n = (t == null ? void 0 : t.minimumHeight) || 0; const s = (t == null ? void 0 : t.maximumHeight) || 0; const r = Gr(e); const i = wp(r); const o = i.west; const a = i.south; const c = i.east; const u = i.north; const l = [];
  return l.push(new A(o, u, n)), l.push(new A(c, u, n)), l.push(new A(c, a, n)), l.push(new A(o, a, n)), l.push(new A(o, u, s)), l.push(new A(c, u, s)), l.push(new A(c, a, s)), l.push(new A(o, a, s)), l;
}
function Cc (e) {
  const t = e.token; const n = {
    minimumHeight: e.minimumHeight,
    maximumHeight: e.maximumHeight
  }; const s = Rp(t, n); const r = _p(t); const i = r[0]; const o = r[1]; const a = J.WGS84.cartographicToCartesian([i, o, n.maximumHeight]); const c = new A(a[0], a[1], a[2]);
  s.push(c);
  const u = Rd(s);
  return [...u.center, ...u.halfAxes];
}
const Mp = 4; const Sp = 8; const Ip = {
  QUADTREE: Mp,
  OCTREE: Sp
};
function xp (e, t, n) {
  if (e != null && e.box) {
    const s = gc(e.s2VolumeInfo.token); const r = dp(s, t); const i = fp(r); const o = {
      ...e.s2VolumeInfo
    };
    switch (o.token = i, n) {
      case 'OCTREE':
        const u = e.s2VolumeInfo; const l = u.maximumHeight - u.minimumHeight; const h = l / 2; const f = u.minimumHeight + l / 2;
        u.minimumHeight = f - h, u.maximumHeight = f + h;
        break;
    }
    return {
      box: Cc(o),
      s2VolumeInfo: o
    };
  }
}
async function Ec (e) {
  const {
    implicitOptions: t,
    parentData: n = {
      mortonIndex: 0,
      x: 0,
      y: 0,
      z: 0
    },
    childIndex: s = 0,
    s2VolumeBox: r,
    loaderOptions: i
  } = e;
  let {
    subtree: o,
    level: a = 0,
    globalData: c = {
      level: 0,
      mortonIndex: 0,
      x: 0,
      y: 0,
      z: 0
    }
  } = e;
  const {
    subdivisionScheme: u,
    subtreeLevels: l,
    maximumLevel: h,
    contentUrlTemplate: f,
    subtreesUriTemplate: d,
    basePath: m
  } = t; const g = {
    children: [],
    lodMetricValue: 0,
    contentUrl: ''
  };
  if (!h) { return aa.once(`Missing 'maximumLevel' or 'availableLevels' property. The subtree ${f} won't be loaded...`), g; }
  const y = a + c.level;
  if (y > h) { return g; }
  const E = Ip[u]; const R = Math.log2(E); const B = s & 1; const C = s >> 1 & 1; const M = s >> 2 & 1; const b = (E ** a - 1) / (E - 1);
  let O = Qt(n.mortonIndex, s, R); let F = b + O; let v = Qt(n.x, B, 1); let L = Qt(n.y, C, 1); let k = Qt(n.z, M, 1); let q = !1;
  a >= l && (q = Ss(o.childSubtreeAvailability, O));
  const Y = Qt(c.x, v, a); const P = Qt(c.y, L, a); const ct = Qt(c.z, k, a);
  if (q) {
    const st = `${m}/${d}`; const Pt = er(st, y, Y, P, ct);
    o = await Ae(Pt, lc, i), c = {
      mortonIndex: O,
      x: v,
      y: L,
      z: k,
      level: a
    }, O = 0, F = 0, v = 0, L = 0, k = 0, a = 0;
  }
  if (!Ss(o.tileAvailability, F)) { return g; }
  Ss(o.contentAvailability, F) && (g.contentUrl = er(f, y, Y, P, ct));
  const Be = a + 1; const vt = {
    mortonIndex: O,
    x: v,
    y: L,
    z: k
  };
  for (let st = 0; st < E; st++) {
    const Pt = xp(r, st, u); const Xt = await Ec({
      subtree: o,
      implicitOptions: t,
      loaderOptions: i,
      parentData: vt,
      childIndex: st,
      level: Be,
      globalData: {
        ...c
      },
      s2VolumeBox: Pt
    });
    if (Xt.contentUrl || Xt.children.length) {
      const Ce = y + 1; const es = vp(Xt, Ce, {
        childTileX: v,
        childTileY: L,
        childTileZ: k
      }, t, r);
      g.children.push(es);
    }
  }
  return g;
}
function Ss (e, t) {
  let n;
  return Array.isArray(e) ? (n = e[0], e.length > 1 && aa.once('Not supported extension "3DTILES_multiple_contents" has been detected')) : n = e, 'constant' in n ? !!n.constant : n.explicitBitstream ? Dp(t, n.explicitBitstream) : !1;
}
function vp (e, t, n, s, r) {
  const {
    basePath: i,
    refine: o,
    getRefine: a,
    lodMetricType: c,
    getTileType: u,
    rootLodMetricValue: l,
    rootBoundingVolume: h
  } = s; const f = e.contentUrl && e.contentUrl.replace(`${i}/`, ''); const d = l / 2 ** t; const m = r != null && r.box
    ? {
        box: r.box
      }
    : h; const g = Op(t, m, n);
  return {
    children: e.children,
    contentUrl: e.contentUrl,
    content: {
      uri: f
    },
    id: e.contentUrl,
    refine: a(o),
    type: u(e),
    lodMetricType: c,
    lodMetricValue: d,
    geometricError: d,
    transform: e.transform,
    boundingVolume: g
  };
}
function Op (e, t, n) {
  if (t.region) {
    const {
      childTileX: s,
      childTileY: r,
      childTileZ: i
    } = n; const [o, a, c, u, l, h] = t.region; const f = 2 ** e; const d = (c - o) / f; const m = (u - a) / f; const g = (h - l) / f; const [y, E] = [o + d * s, o + d * (s + 1)]; const [R, B] = [a + m * r, a + m * (r + 1)]; const [C, M] = [l + g * i, l + g * (i + 1)];
    return {
      region: [y, R, E, B, C, M]
    };
  }
  if (t.box) { return t; }
  throw new Error(`Unsupported bounding volume type ${t}`);
}
function Qt (e, t, n) {
  return (e << n) + t;
}
function er (e, t, n, s, r) {
  const i = Fp({
    level: t,
    x: n,
    y: s,
    z: r
  });
  return e.replace(/{level}|{x}|{y}|{z}/gi, (o) => i[o]);
}
function Fp (e) {
  const t = {};
  for (const n in e) { t[`{${n}}`] = e[n]; }
  return t;
}
function Dp (e, t) {
  const n = Math.floor(e / 8); const s = e % 8;
  return (t[n] >> s & 1) === 1;
}
function Nr (e) {
  const t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : '';
  if (!t) { return dn.EMPTY; }
  const s = t.split('?')[0].split('.').pop();
  switch (s) {
    case 'pnts':
      return dn.POINTCLOUD;
    case 'i3dm':
    case 'b3dm':
    case 'glb':
    case 'gltf':
      return dn.SCENEGRAPH;
    default:
      return s || dn.EMPTY;
  }
}
function Ur (e) {
  switch (e) {
    case 'REPLACE':
    case 'replace':
      return Ii.REPLACE;
    case 'ADD':
    case 'add':
      return Ii.ADD;
    default:
      return e;
  }
}
function nr (e, t) {
  if (/^[a-z][0-9a-z+.-]*:/i.test(t)) {
    const s = new URL(e, `${t}/`);
    return decodeURI(s.toString());
  } else if (e.startsWith('/')) { return e; }
  return ku(t, e);
}
function lo (e, t) {
  if (!e) { return null; }
  let n;
  if (e.content) {
    let s;
    const i = e.content.uri || ((s = e.content) === null || s === void 0 ? void 0 : s.url);
    typeof i < 'u' && (n = nr(i, t));
  }
  return {
    ...e,
    id: n,
    contentUrl: n,
    lodMetricType: Qn.GEOMETRIC_ERROR,
    lodMetricValue: e.geometricError,
    transformMatrix: e.transform,
    type: Nr(e, n),
    refine: Ur(e.refine)
  };
}
async function Lp (e, t, n) {
  let s = null;
  const r = fo(e.root);
  r && e.root ? s = await ho(e.root, e, t, r, n) : s = lo(e.root, t);
  const i = [];
  for (i.push(s); i.length > 0;) {
    const o = i.pop() || {}; const a = o.children || []; const c = [];
    for (const u of a) {
      const l = fo(u);
      let h;
      l ? h = await ho(u, e, t, l, n) : h = lo(u, t), h && (c.push(h), i.push(h));
    }
    o.children = c;
  }
  return s;
}
async function ho (e, t, n, s, r) {
  let i, o, a;
  const {
    subdivisionScheme: c,
    maximumLevel: u,
    availableLevels: l,
    subtreeLevels: h,
    subtrees: {
      uri: f
    }
  } = s; const d = er(f, 0, 0, 0, 0); const m = nr(d, n); const g = await Ae(m, lc, r); const y = (i = e.content) === null || i === void 0 ? void 0 : i.uri; const E = y ? nr(y, n) : ''; const R = t == null || (o = t.root) === null || o === void 0 ? void 0 : o.refine; const B = e.geometricError; const C = (a = e.boundingVolume.extensions) === null || a === void 0 ? void 0 : a['3DTILES_bounding_volume_S2'];
  if (C) {
    const F = {
      box: Cc(C),
      s2VolumeInfo: C
    };
    e.boundingVolume = F;
  }
  const M = e.boundingVolume; const b = {
    contentUrlTemplate: E,
    subtreesUriTemplate: f,
    subdivisionScheme: c,
    subtreeLevels: h,
    maximumLevel: Number.isFinite(l) ? l - 1 : u,
    refine: R,
    basePath: n,
    lodMetricType: Qn.GEOMETRIC_ERROR,
    rootLodMetricValue: B,
    rootBoundingVolume: M,
    getTileType: Nr,
    getRefine: Ur
  };
  return await Pp(e, n, g, b, r);
}
async function Pp (e, t, n, s, r) {
  if (!e) { return null; }
  const {
    children: i,
    contentUrl: o
  } = await Ec({
    subtree: n,
    implicitOptions: s,
    loaderOptions: r
  });
  let a; let c = null;
  return o && (a = o, c = {
    uri: o.replace(`${t}/`, '')
  }), {
    ...e,
    id: a,
    contentUrl: a,
    lodMetricType: Qn.GEOMETRIC_ERROR,
    lodMetricValue: e.geometricError,
    transformMatrix: e.transform,
    type: Nr(e, a),
    refine: Ur(e.refine),
    content: c || e.content,
    children: i
  };
}
function fo (e) {
  let t;
  return (e == null || (t = e.extensions) === null || t === void 0 ? void 0 : t['3DTILES_implicit_tiling']) || (e == null ? void 0 : e.implicitTiling);
}
const Le = {
  id: '3d-tiles',
  name: '3D Tiles',
  module: '3d-tiles',
  version: va,
  extensions: ['cmpt', 'pnts', 'b3dm', 'i3dm'],
  mimeTypes: ['application/octet-stream'],
  tests: ['cmpt', 'pnts', 'b3dm', 'i3dm'],
  parse: Gp,
  options: {
    '3d-tiles': {
      loadGLTF: !0,
      decodeQuantizedPositions: !1,
      isTileset: 'auto',
      assetGltfUpAxis: null
    }
  }
};
async function Gp (e) {
  const t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}; const n = arguments.length > 2 ? arguments[2] : void 0;
  const s = t['3d-tiles'] || {};
  let r;
  return s.isTileset === 'auto' ? r = (n == null ? void 0 : n.url) && n.url.indexOf('.json') !== -1 : r = s.isTileset, r ? Np(e, t, n) : Up(e, t, n);
}
async function Np (e, t, n) {
  let s;
  const r = JSON.parse(new TextDecoder().decode(e)); const i = (n == null ? void 0 : n.url) || ''; const o = Hp(i); const a = await Lp(r, o, t || {});
  return {
    ...r,
    shape: 'tileset3d',
    loader: Le,
    url: i,
    queryString: (n == null ? void 0 : n.queryString) || '',
    basePath: o,
    root: a || r.root,
    type: Md.TILES3D,
    lodMetricType: Qn.GEOMETRIC_ERROR,
    lodMetricValue: ((s = r.root) === null || s === void 0 ? void 0 : s.geometricError) || 0
  };
}
async function Up (e, t, n) {
  const s = {
    content: {
      shape: 'tile3d',
      featureIds: null
    }
  };
  return await uc(e, 0, t, n, s.content), s.content;
}
function Hp (e) {
  return ea(e);
}
const Tc = 'https://api.cesium.com/v1/assets';
async function Jp (e, t) {
  if (!t) {
    const i = await Vp(e);
    for (const o of i.items) { o.type === '3DTILES' && (t = o.id); }
  }
  const n = await jp(e, t); const {
    type: s,
    url: r
  } = n;
  return z(s === '3DTILES' && r), n.headers = {
    Authorization: `Bearer ${n.accessToken}`
  }, n;
}
async function Vp (e) {
  z(e);
  const t = Tc; const n = {
    Authorization: `Bearer ${e}`
  }; const s = await Ge(t, {
    headers: n
  });
  if (!s.ok) { throw new Error(s.statusText); }
  return await s.json();
}
async function jp (e, t) {
  z(e, t);
  const n = {
    Authorization: `Bearer ${e}`
  }; const s = `${Tc}/${t}`;
  let r = await Ge(`${s}`, {
    headers: n
  });
  if (!r.ok) { throw new Error(r.statusText); }
  let i = await r.json();
  if (r = await Ge(`${s}/endpoint`, {
    headers: n
  }), !r.ok) { throw new Error(r.statusText); }
  const o = await r.json();
  return i = {
    ...i,
    ...o
  }, i;
}
async function kp (e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  t = t['cesium-ion'] || {};
  const {
    accessToken: n
  } = t;
  let s = t.assetId;
  if (!Number.isFinite(s)) {
    const r = e.match(/\/([0-9]+)\/tileset.json/);
    s = r && r[1];
  }
  return Jp(n, s);
}
const bc = {
  ...Le,
  id: 'cesium-ion',
  name: 'Cesium Ion',
  preload: kp,
  parse: async (e, t, n) => (t = {
    ...t
  }, t['3d-tiles'] = t['cesium-ion'], t.loader = bc, Le.parse(e, t, n)),
  options: {
    'cesium-ion': {
      ...Le.options['3d-tiles'],
      accessToken: null
    }
  }
}; const mo = 100;
class Kp {
  constructor (t, n) {
    if (this.schema = void 0, this.options = void 0, this.shape = void 0, this.length = 0, this.rows = null, this.cursor = 0, this._headers = [], this.options = n, this.schema = t, !Array.isArray(t)) {
      this._headers = [];
      for (const s in t) { this._headers[t[s].index] = t[s].name; }
    }
  }

  rowCount () {
    return this.length;
  }

  addArrayRow (t, n) {
    Number.isFinite(n) && (this.cursor = n), this.shape = 'array-row-table', this.rows = this.rows || new Array(mo), this.rows[this.length] = t, this.length++;
  }

  addObjectRow (t, n) {
    Number.isFinite(n) && (this.cursor = n), this.shape = 'object-row-table', this.rows = this.rows || new Array(mo), this.rows[this.length] = t, this.length++;
  }

  getBatch () {
    let t = this.rows;
    return t
      ? (t = t.slice(0, this.length), this.rows = null, {
          shape: this.shape || 'array-row-table',
          batchType: 'data',
          data: t,
          length: this.length,
          schema: this.schema,
          cursor: this.cursor
        })
      : null;
  }
}
function zp (e, t) {
  if (!e) { throw new Error('null row'); }
  const n = {};
  if (t) {
    for (let s = 0; s < t.length; s++) { n[t[s]] = e[s]; }
  } else {
    for (let s = 0; s < e.length; s++) {
      const r = `column-${s}`;
      n[r] = e[s];
    }
  }
  return n;
}
function Wp (e, t) {
  if (!e) { throw new Error('null row'); }
  if (t) {
    const n = new Array(t.length);
    for (let s = 0; s < t.length; s++) { n[s] = e[t[s]]; }
    return n;
  }
  return Object.values(e);
}
function Xp (e) {
  const t = [];
  for (let n = 0; n < e.length; n++) {
    const s = `column-${n}`;
    t.push(s);
  }
  return t;
}
function Qp (e) {
  return Object.keys(e);
}
const go = 100;
class qp {
  constructor (t, n) {
    if (this.schema = void 0, this.options = void 0, this.length = 0, this.objectRows = null, this.arrayRows = null, this.cursor = 0, this._headers = null, this.options = n, this.schema = t, t) {
      this._headers = [];
      for (const s in t) { this._headers[t[s].index] = t[s].name; }
    }
  }

  rowCount () {
    return this.length;
  }

  addArrayRow (t, n) {
    switch (Number.isFinite(n) && (this.cursor = n), this._headers || (this._headers = Xp(t)), this.options.shape) {
      case 'object-row-table':
        const s = zp(t, this._headers);
        this.addObjectRow(s, n);
        break;
      case 'array-row-table':
        this.arrayRows = this.arrayRows || new Array(go), this.arrayRows[this.length] = t, this.length++;
        break;
    }
  }

  addObjectRow (t, n) {
    switch (Number.isFinite(n) && (this.cursor = n), this._headers || (this._headers = Qp(t)), this.options.shape) {
      case 'array-row-table':
        const s = Wp(t, this._headers);
        this.addArrayRow(s, n);
        break;
      case 'object-row-table':
        this.objectRows = this.objectRows || new Array(go), this.objectRows[this.length] = t, this.length++;
        break;
    }
  }

  getBatch () {
    let t = this.arrayRows || this.objectRows;
    return t
      ? (t = t.slice(0, this.length), this.arrayRows = null, this.objectRows = null, {
          shape: this.options.shape,
          batchType: 'data',
          data: t,
          length: this.length,
          schema: this.schema,
          cursor: this.cursor
        })
      : null;
  }
}
const Yp = 100;
class $p {
  constructor (t, n) {
    this.schema = void 0, this.length = 0, this.allocated = 0, this.columns = {}, this.schema = t, this._reallocateColumns();
  }

  rowCount () {
    return this.length;
  }

  addArrayRow (t) {
    this._reallocateColumns();
    let n = 0;
    for (const s in this.columns) { this.columns[s][this.length] = t[n++]; }
    this.length++;
  }

  addObjectRow (t) {
    this._reallocateColumns();
    for (const n in t) { this.columns[n][this.length] = t[n]; }
    this.length++;
  }

  getBatch () {
    this._pruneColumns();
    const t = Array.isArray(this.schema) ? this.columns : {};
    if (!Array.isArray(this.schema)) {
      for (const s in this.schema) {
        const r = this.schema[s];
        t[r.name] = this.columns[r.index];
      }
    }
    return this.columns = {}, {
      shape: 'columnar-table',
      batchType: 'data',
      data: t,
      schema: this.schema,
      length: this.length
    };
  }

  _reallocateColumns () {
    if (!(this.length < this.allocated)) {
      this.allocated = this.allocated > 0 ? this.allocated *= 2 : Yp, this.columns = {};
      for (const t in this.schema) {
        const n = this.schema[t]; const s = n.type || Float32Array; const r = this.columns[n.index];
        if (r && ArrayBuffer.isView(r)) {
          const i = new s(this.allocated);
          i.set(r), this.columns[n.index] = i;
        } else { r ? (r.length = this.allocated, this.columns[n.index] = r) : this.columns[n.index] = new s(this.allocated); }
      }
    }
  }

  _pruneColumns () {
    for (const [t, n] of Object.entries(this.columns)) { this.columns[t] = n.slice(0, this.length); }
  }
}
const Zp = {
  shape: void 0,
  batchSize: 'auto',
  batchDebounceMs: 0,
  limit: 0,
  _limitMB: 0
}; const ty = 'TableBatchBuilder';
class He {
  constructor (t, n) {
    this.schema = void 0, this.options = void 0, this.aggregator = null, this.batchCount = 0, this.bytesUsed = 0, this.isChunkComplete = !1, this.lastBatchEmittedMs = Date.now(), this.totalLength = 0, this.totalBytes = 0, this.rowBytes = 0, this.schema = t, this.options = {
      ...Zp,
      ...n
    };
  }

  limitReached () {
    let t, n;
    return !!(!((t = this.options) === null || t === void 0) && t.limit && this.totalLength >= this.options.limit || !((n = this.options) === null || n === void 0) && n._limitMB && this.totalBytes / 1e6 >= this.options._limitMB);
  }

  addRow (t) {
    this.limitReached() || (this.totalLength++, this.rowBytes = this.rowBytes || this._estimateRowMB(t), this.totalBytes += this.rowBytes, Array.isArray(t) ? this.addArrayRow(t) : this.addObjectRow(t));
  }

  addArrayRow (t) {
    if (!this.aggregator) {
      const n = this._getTableBatchType();
      this.aggregator = new n(this.schema, this.options);
    }
    this.aggregator.addArrayRow(t);
  }

  addObjectRow (t) {
    if (!this.aggregator) {
      const n = this._getTableBatchType();
      this.aggregator = new n(this.schema, this.options);
    }
    this.aggregator.addObjectRow(t);
  }

  chunkComplete (t) {
    t instanceof ArrayBuffer && (this.bytesUsed += t.byteLength), typeof t === 'string' && (this.bytesUsed += t.length), this.isChunkComplete = !0;
  }

  getFullBatch (t) {
    return this._isFull() ? this._getBatch(t) : null;
  }

  getFinalBatch (t) {
    return this._getBatch(t);
  }

  _estimateRowMB (t) {
    return Array.isArray(t) ? t.length * 8 : Object.keys(t).length * 8;
  }

  _isFull () {
    if (!this.aggregator || this.aggregator.rowCount() === 0) { return !1; }
    if (this.options.batchSize === 'auto') {
      if (!this.isChunkComplete) { return !1; }
    } else if (this.options.batchSize > this.aggregator.rowCount()) { return !1; }
    return this.options.batchDebounceMs > Date.now() - this.lastBatchEmittedMs ? !1 : (this.isChunkComplete = !1, this.lastBatchEmittedMs = Date.now(), !0);
  }

  _getBatch (t) {
    if (!this.aggregator) { return null; }
    t != null && t.bytesUsed && (this.bytesUsed = t.bytesUsed);
    const n = this.aggregator.getBatch();
    return n.count = this.batchCount, n.bytesUsed = this.bytesUsed, Object.assign(n, t), this.batchCount++, this.aggregator = null, n;
  }

  _getTableBatchType () {
    switch (this.options.shape) {
      case 'array-row-table':
      case 'object-row-table':
        return qp;
      case 'columnar-table':
        return $p;
      case 'arrow-table':
        if (!He.ArrowBatch) { throw new Error(ty); }
        return He.ArrowBatch;
      default:
        return Kp;
    }
  }
}
He.ArrowBatch = void 0;
function ey (e) {
  try {
    const t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return (async function * () {
      const n = new TextDecoder(void 0, t);
      for await (const s of e) {
        yield typeof s === 'string'
          ? s
          : n.decode(s, {
            stream: !0
          });
      }
    }());
  } catch (t) {
    return Promise.reject(t);
  }
}
const sr = Number.MAX_SAFE_INTEGER;
var S = (function (e) {
  return e[e.BEGIN = 0] = 'BEGIN', e[e.VALUE = 1] = 'VALUE', e[e.OPEN_OBJECT = 2] = 'OPEN_OBJECT', e[e.CLOSE_OBJECT = 3] = 'CLOSE_OBJECT', e[e.OPEN_ARRAY = 4] = 'OPEN_ARRAY', e[e.CLOSE_ARRAY = 5] = 'CLOSE_ARRAY', e[e.TEXT_ESCAPE = 6] = 'TEXT_ESCAPE', e[e.STRING = 7] = 'STRING', e[e.BACKSLASH = 8] = 'BACKSLASH', e[e.END = 9] = 'END', e[e.OPEN_KEY = 10] = 'OPEN_KEY', e[e.CLOSE_KEY = 11] = 'CLOSE_KEY', e[e.TRUE = 12] = 'TRUE', e[e.TRUE2 = 13] = 'TRUE2', e[e.TRUE3 = 14] = 'TRUE3', e[e.FALSE = 15] = 'FALSE', e[e.FALSE2 = 16] = 'FALSE2', e[e.FALSE3 = 17] = 'FALSE3', e[e.FALSE4 = 18] = 'FALSE4', e[e.NULL = 19] = 'NULL', e[e.NULL2 = 20] = 'NULL2', e[e.NULL3 = 21] = 'NULL3', e[e.NUMBER_DECIMAL_POINT = 22] = 'NUMBER_DECIMAL_POINT', e[e.NUMBER_DIGIT = 23] = 'NUMBER_DIGIT', e;
}(S || {}));
const I = {
  tab: 9,
  lineFeed: 10,
  carriageReturn: 13,
  space: 32,
  doubleQuote: 34,
  plus: 43,
  comma: 44,
  minus: 45,
  period: 46,
  _0: 48,
  _9: 57,
  colon: 58,
  E: 69,
  openBracket: 91,
  backslash: 92,
  closeBracket: 93,
  a: 97,
  b: 98,
  e: 101,
  f: 102,
  l: 108,
  n: 110,
  r: 114,
  s: 115,
  t: 116,
  u: 117,
  openBrace: 123,
  closeBrace: 125
}; const Ao = /[\\"\n]/g; const po = {
  onready: () => {
  },
  onopenobject: () => {
  },
  onkey: () => {
  },
  oncloseobject: () => {
  },
  onopenarray: () => {
  },
  onclosearray: () => {
  },
  onvalue: () => {
  },
  onerror: () => {
  },
  onend: () => {
  },
  onchunkparsed: () => {
  }
};
class ny {
  constructor () {
    const t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    this.options = po, this.bufferCheckPosition = sr, this.q = '', this.c = '', this.p = '', this.closed = !1, this.closedRoot = !1, this.sawRoot = !1, this.error = null, this.state = S.BEGIN, this.stack = [], this.position = 0, this.column = 0, this.line = 1, this.slashed = !1, this.unicodeI = 0, this.unicodeS = null, this.depth = 0, this.textNode = void 0, this.numberNode = void 0, this.options = {
      ...po,
      ...t
    }, this.textNode = void 0, this.numberNode = '', this.emit('onready');
  }

  end () {
    return (this.state !== S.VALUE || this.depth !== 0) && this._error('Unexpected end'), this._closeValue(), this.c = '', this.closed = !0, this.emit('onend'), this;
  }

  resume () {
    return this.error = null, this;
  }

  close () {
    return this.write(null);
  }

  emit (t, n) {
    let s, r;
    (s = (r = this.options)[t]) === null || s === void 0 || s.call(r, n, this);
  }

  emitNode (t, n) {
    this._closeValue(), this.emit(t, n);
  }

  write (t) {
    if (this.error) { throw this.error; }
    if (this.closed) { return this._error('Cannot write after close. Assign an onready handler.'); }
    if (t === null) { return this.end(); }
    let n = 0; let s = t.charCodeAt(0); let r = this.p;
    for (; s && (r = s, this.c = s = t.charCodeAt(n++), r !== s ? this.p = r : r = this.p, !!s);) {
      switch (this.position++, s === I.lineFeed ? (this.line++, this.column = 0) : this.column++, this.state) {
        case S.BEGIN:
          s === I.openBrace ? this.state = S.OPEN_OBJECT : s === I.openBracket ? this.state = S.OPEN_ARRAY : Se(s) || this._error('Non-whitespace before {[.');
          continue;
        case S.OPEN_KEY:
        case S.OPEN_OBJECT:
          if (Se(s)) { continue; }
          if (this.state === S.OPEN_KEY) { this.stack.push(S.CLOSE_KEY); } else if (s === I.closeBrace) {
            this.emit('onopenobject'), this.depth++, this.emit('oncloseobject'), this.depth--, this.state = this.stack.pop() || S.VALUE;
            continue;
          } else { this.stack.push(S.CLOSE_OBJECT); }
          s === I.doubleQuote ? this.state = S.STRING : this._error('Malformed object key should start with "');
          continue;
        case S.CLOSE_KEY:
        case S.CLOSE_OBJECT:
          if (Se(s)) { continue; }
          s === I.colon ? (this.state === S.CLOSE_OBJECT ? (this.stack.push(S.CLOSE_OBJECT), this._closeValue('onopenobject'), this.depth++) : this._closeValue('onkey'), this.state = S.VALUE) : s === I.closeBrace ? (this.emitNode('oncloseobject'), this.depth--, this.state = this.stack.pop() || S.VALUE) : s === I.comma ? (this.state === S.CLOSE_OBJECT && this.stack.push(S.CLOSE_OBJECT), this._closeValue(), this.state = S.OPEN_KEY) : this._error('Bad object');
          continue;
        case S.OPEN_ARRAY:
        case S.VALUE:
          if (Se(s)) { continue; }
          if (this.state === S.OPEN_ARRAY) {
            if (this.emit('onopenarray'), this.depth++, this.state = S.VALUE, s === I.closeBracket) {
              this.emit('onclosearray'), this.depth--, this.state = this.stack.pop() || S.VALUE;
              continue;
            } else { this.stack.push(S.CLOSE_ARRAY); }
          }
          s === I.doubleQuote ? this.state = S.STRING : s === I.openBrace ? this.state = S.OPEN_OBJECT : s === I.openBracket ? this.state = S.OPEN_ARRAY : s === I.t ? this.state = S.TRUE : s === I.f ? this.state = S.FALSE : s === I.n ? this.state = S.NULL : s === I.minus ? this.numberNode += '-' : I._0 <= s && s <= I._9 ? (this.numberNode += String.fromCharCode(s), this.state = S.NUMBER_DIGIT) : this._error('Bad value');
          continue;
        case S.CLOSE_ARRAY:
          if (s === I.comma) { this.stack.push(S.CLOSE_ARRAY), this._closeValue('onvalue'), this.state = S.VALUE; } else if (s === I.closeBracket) { this.emitNode('onclosearray'), this.depth--, this.state = this.stack.pop() || S.VALUE; } else {
            if (Se(s)) { continue; }
            this._error('Bad array');
          }
          continue;
        case S.STRING:
          this.textNode === void 0 && (this.textNode = '');
          let i = n - 1; let o = this.slashed; let a = this.unicodeI;
          t:
          for (; ;) {
            for (; a > 0;) {
              if (this.unicodeS += String.fromCharCode(s), s = t.charCodeAt(n++), this.position++, a === 4 ? (this.textNode += String.fromCharCode(parseInt(this.unicodeS, 16)), a = 0, i = n - 1) : a++, !s) { break t; }
            }
            if (s === I.doubleQuote && !o) {
              this.state = this.stack.pop() || S.VALUE, this.textNode += t.substring(i, n - 1), this.position += n - 1 - i;
              break;
            }
            if (s === I.backslash && !o && (o = !0, this.textNode += t.substring(i, n - 1), this.position += n - 1 - i, s = t.charCodeAt(n++), this.position++, !s)) { break; }
            if (o) {
              if (o = !1, s === I.n
                ? this.textNode += `
`
                : s === I.r ? this.textNode += '\r' : s === I.t ? this.textNode += '	' : s === I.f ? this.textNode += '\f' : s === I.b ? this.textNode += '\b' : s === I.u ? (a = 1, this.unicodeS = '') : this.textNode += String.fromCharCode(s), s = t.charCodeAt(n++), this.position++, i = n - 1, s) { continue; }
              break;
            }
            Ao.lastIndex = n;
            const c = Ao.exec(t);
            if (c === null) {
              n = t.length + 1, this.textNode += t.substring(i, n - 1), this.position += n - 1 - i;
              break;
            }
            if (n = c.index + 1, s = t.charCodeAt(c.index), !s) {
              this.textNode += t.substring(i, n - 1), this.position += n - 1 - i;
              break;
            }
          }
          this.slashed = o, this.unicodeI = a;
          continue;
        case S.TRUE:
          s === I.r ? this.state = S.TRUE2 : this._error(`Invalid true started with t${s}`);
          continue;
        case S.TRUE2:
          s === I.u ? this.state = S.TRUE3 : this._error(`Invalid true started with tr${s}`);
          continue;
        case S.TRUE3:
          s === I.e ? (this.emit('onvalue', !0), this.state = this.stack.pop() || S.VALUE) : this._error(`Invalid true started with tru${s}`);
          continue;
        case S.FALSE:
          s === I.a ? this.state = S.FALSE2 : this._error(`Invalid false started with f${s}`);
          continue;
        case S.FALSE2:
          s === I.l ? this.state = S.FALSE3 : this._error(`Invalid false started with fa${s}`);
          continue;
        case S.FALSE3:
          s === I.s ? this.state = S.FALSE4 : this._error(`Invalid false started with fal${s}`);
          continue;
        case S.FALSE4:
          s === I.e ? (this.emit('onvalue', !1), this.state = this.stack.pop() || S.VALUE) : this._error(`Invalid false started with fals${s}`);
          continue;
        case S.NULL:
          s === I.u ? this.state = S.NULL2 : this._error(`Invalid null started with n${s}`);
          continue;
        case S.NULL2:
          s === I.l ? this.state = S.NULL3 : this._error(`Invalid null started with nu${s}`);
          continue;
        case S.NULL3:
          s === I.l ? (this.emit('onvalue', null), this.state = this.stack.pop() || S.VALUE) : this._error(`Invalid null started with nul${s}`);
          continue;
        case S.NUMBER_DECIMAL_POINT:
          s === I.period ? (this.numberNode += '.', this.state = S.NUMBER_DIGIT) : this._error('Leading zero not followed by .');
          continue;
        case S.NUMBER_DIGIT:
          I._0 <= s && s <= I._9 ? this.numberNode += String.fromCharCode(s) : s === I.period ? (this.numberNode.indexOf('.') !== -1 && this._error('Invalid number has two dots'), this.numberNode += '.') : s === I.e || s === I.E ? ((this.numberNode.indexOf('e') !== -1 || this.numberNode.indexOf('E') !== -1) && this._error('Invalid number has two exponential'), this.numberNode += 'e') : s === I.plus || s === I.minus ? (r === I.e || r === I.E || this._error('Invalid symbol in number'), this.numberNode += String.fromCharCode(s)) : (this._closeNumber(), n--, this.state = this.stack.pop() || S.VALUE);
          continue;
        default:
          this._error(`Unknown state: ${this.state}`);
      }
    }
    return this.position >= this.bufferCheckPosition && sy(this), this.emit('onchunkparsed'), this;
  }

  _closeValue () {
    const t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'onvalue';
    this.textNode !== void 0 && this.emit(t, this.textNode), this.textNode = void 0;
  }

  _closeNumber () {
    this.numberNode && this.emit('onvalue', parseFloat(this.numberNode)), this.numberNode = '';
  }

  _error () {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : '';
    this._closeValue(), t += `
Line: ${this.line}
Column: ${this.column}
Char: ${this.c}`;
    const n = new Error(t);
    this.error = n, this.emit('onerror', n);
  }
}
function Se (e) {
  return e === I.carriageReturn || e === I.lineFeed || e === I.space || e === I.tab;
}
function sy (e) {
  const t = Math.max(sr, 10);
  let n = 0;
  for (const s of ['textNode', 'numberNode']) {
    const r = e[s] === void 0 ? 0 : e[s].length;
    if (r > t) {
      switch (s) {
        case 'text':
          break;
        default:
          e._error(`Max buffer length exceeded: ${s}`);
      }
    }
    n = Math.max(n, r);
  }
  e.bufferCheckPosition = sr - n + e.position;
}
class te {
  constructor () {
    const t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
    if (this.path = void 0, this.path = ['$'], t instanceof te) {
      this.path = [...t.path];
      return;
    }
    if (Array.isArray(t)) {
      this.path.push(...t);
      return;
    }
    if (typeof t === 'string' && (this.path = t.split('.'), this.path[0] !== '$')) { throw new Error('JSONPaths must start with $'); }
  }

  clone () {
    return new te(this);
  }

  toString () {
    return this.path.join('.');
  }

  push (t) {
    this.path.push(t);
  }

  pop () {
    return this.path.pop();
  }

  set (t) {
    this.path[this.path.length - 1] = t;
  }

  equals (t) {
    if (!this || !t || this.path.length !== t.path.length) { return !1; }
    for (let n = 0; n < this.path.length; ++n) {
      if (this.path[n] !== t.path[n]) { return !1; }
    }
    return !0;
  }

  setFieldAtPath (t, n) {
    const s = [...this.path];
    s.shift();
    const r = s.pop();
    for (const i of s) { t = t[i]; }
    t[r] = n;
  }

  getFieldAtPath (t) {
    const n = [...this.path];
    n.shift();
    const s = n.pop();
    for (const r of n) { t = t[r]; }
    return t[s];
  }
}
class ry {
  constructor (t) {
    this.parser = void 0, this.result = void 0, this.previousStates = [], this.currentState = Object.freeze({
      container: [],
      key: null
    }), this.jsonpath = new te(), this.reset(), this.parser = new ny({
      onready: () => {
        this.jsonpath = new te(), this.previousStates.length = 0, this.currentState.container.length = 0;
      },
      onopenobject: (n) => {
        this._openObject({}), typeof n < 'u' && this.parser.emit('onkey', n);
      },
      onkey: (n) => {
        this.jsonpath.set(n), this.currentState.key = n;
      },
      oncloseobject: () => {
        this._closeObject();
      },
      onopenarray: () => {
        this._openArray();
      },
      onclosearray: () => {
        this._closeArray();
      },
      onvalue: (n) => {
        this._pushOrSet(n);
      },
      onerror: (n) => {
        throw n;
      },
      onend: () => {
        this.result = this.currentState.container.pop();
      },
      ...t
    });
  }

  reset () {
    this.result = void 0, this.previousStates = [], this.currentState = Object.freeze({
      container: [],
      key: null
    }), this.jsonpath = new te();
  }

  write (t) {
    this.parser.write(t);
  }

  close () {
    this.parser.close();
  }

  _pushOrSet (t) {
    const {
      container: n,
      key: s
    } = this.currentState;
    s !== null ? (n[s] = t, this.currentState.key = null) : n.push(t);
  }

  _openArray () {
    const t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    this.jsonpath.push(null), this._pushOrSet(t), this.previousStates.push(this.currentState), this.currentState = {
      container: t,
      isArray: !0,
      key: null
    };
  }

  _closeArray () {
    this.jsonpath.pop(), this.currentState = this.previousStates.pop();
  }

  _openObject () {
    const t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    this.jsonpath.push(null), this._pushOrSet(t), this.previousStates.push(this.currentState), this.currentState = {
      container: t,
      isArray: !1,
      key: null
    };
  }

  _closeObject () {
    this.jsonpath.pop(), this.currentState = this.previousStates.pop();
  }
}
class iy extends ry {
  constructor () {
    const t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    super({
      onopenarray: () => {
        if (!this.streamingArray && this._matchJSONPath()) {
          this.streamingJsonPath = this.getJsonPath().clone(), this.streamingArray = [], this._openArray(this.streamingArray);
          return;
        }
        this._openArray();
      },
      onopenobject: (s) => {
        this.topLevelObject ? this._openObject({}) : (this.topLevelObject = {}, this._openObject(this.topLevelObject)), typeof s < 'u' && this.parser.emit('onkey', s);
      }
    }), this.jsonPaths = void 0, this.streamingJsonPath = null, this.streamingArray = null, this.topLevelObject = null;
    const n = t.jsonpaths || [];
    this.jsonPaths = n.map((s) => new te(s));
  }

  write (t) {
    super.write(t);
    let n = [];
    return this.streamingArray && (n = [...this.streamingArray], this.streamingArray.length = 0), n;
  }

  getPartialResult () {
    return this.topLevelObject;
  }

  getStreamingJsonPath () {
    return this.streamingJsonPath;
  }

  getStreamingJsonPathAsString () {
    return this.streamingJsonPath && this.streamingJsonPath.toString();
  }

  getJsonPath () {
    return this.jsonpath;
  }

  _matchJSONPath () {
    const t = this.getJsonPath();
    if (this.jsonPaths.length === 0) { return !0; }
    for (const n of this.jsonPaths) {
      if (n.equals(t)) { return !0; }
    }
    return !1;
  }
}
async function * oy (e, t) {
  const n = ey(e); const {
    metadata: s
  } = t; const {
    jsonpaths: r
  } = t.json || {};
  let i = !0;
  const o = null; const a = new He(o, t); const c = new iy({
    jsonpaths: r
  });
  for await (const f of n) {
    const d = c.write(f); const m = d.length > 0 && c.getStreamingJsonPathAsString();
    if (d.length > 0 && i) {
      if (s) {
        var u;
        yield {
          shape: (t == null || (u = t.json) === null || u === void 0 ? void 0 : u.shape) || 'array-row-table',
          batchType: 'partial-result',
          data: [],
          length: 0,
          bytesUsed: 0,
          container: c.getPartialResult(),
          jsonpath: m
        };
      }
      i = !1;
    }
    for (const y of d) {
      a.addRow(y);
      const E = a.getFullBatch({
        jsonpath: m
      });
      E && (yield E);
    }
    a.chunkComplete(f);
    const g = a.getFullBatch({
      jsonpath: m
    });
    g && (yield g);
  }
  const l = c.getStreamingJsonPathAsString(); const h = a.getFinalBatch({
    jsonpath: l
  });
  h && (yield h), s && (yield {
    shape: 'json',
    batchType: 'final-result',
    container: c.getPartialResult(),
    jsonpath: c.getStreamingJsonPathAsString(),
    data: [],
    length: 0
  });
}
const Hn = {
  x: 0,
  y: 1,
  z: 2
};
function _c (e, t = {}) {
  const { start: n = 0, end: s = e.length, plane: r = 'xy' } = t; const i = t.size || 2;
  let o = 0;
  const a = Hn[r[0]]; const c = Hn[r[1]];
  for (let u = n, l = s - i; u < s; u += i) { o += (e[u + a] - e[l + a]) * (e[u + c] + e[l + c]), l = u; }
  return o / 2;
}
function ay (e, t, n = 2, s, r = 'xy') {
  const i = t && t.length; const o = i ? t[0] * n : e.length;
  let a = wc(e, 0, o, n, !0, s && s[0], r);
  const c = [];
  if (!a || a.next === a.prev) { return c; }
  let u, l, h, f, d, m, g;
  if (i && (a = fy(e, t, a, n, s, r)), e.length > 80 * n) {
    f = l = e[0], d = h = e[1];
    for (let y = n; y < o; y += n) { m = e[y], g = e[y + 1], m < f && (f = m), g < d && (d = g), m > l && (l = m), g > h && (h = g); }
    u = Math.max(l - f, h - d), u = u !== 0 ? 32767 / u : 0;
  }
  return Je(a, c, n, f, d, u, 0), c;
}
function wc (e, t, n, s, r, i, o) {
  let a, c;
  i === void 0 && (i = _c(e, { start: t, end: n, size: s, plane: o }));
  const u = Hn[o[0]]; const l = Hn[o[1]];
  if (r === i < 0) {
    for (a = t; a < n; a += s) { c = yo(a, e[a + u], e[a + l], c); }
  } else {
    for (a = n - s; a >= t; a -= s) { c = yo(a, e[a + u], e[a + l], c); }
  }
  return c && Zn(c, c.next) && (je(c), c = c.next), c;
}
function ne (e, t) {
  if (!e) { return e; }
  t || (t = e);
  let n = e; let s;
  do {
    if (s = !1, !n.steiner && (Zn(n, n.next) || W(n.prev, n, n.next) === 0)) {
      if (je(n), n = t = n.prev, n === n.next) { break; }
      s = !0;
    } else { n = n.next; }
  }
  while (s || n !== t);
  return t;
}
function Je (e, t, n, s, r, i, o) {
  if (!e) { return; }
  !o && i && py(e, s, r, i);
  let a = e; let c; let u;
  for (; e.prev !== e.next;) {
    if (c = e.prev, u = e.next, i ? uy(e, s, r, i) : cy(e)) {
      t.push(c.i / n | 0), t.push(e.i / n | 0), t.push(u.i / n | 0), je(e), e = u.next, a = u.next;
      continue;
    }
    if (e = u, e === a) {
      o ? o === 1 ? (e = ly(ne(e), t, n), Je(e, t, n, s, r, i, 2)) : o === 2 && hy(e, t, n, s, r, i) : Je(ne(e), t, n, s, r, i, 1);
      break;
    }
  }
}
function cy (e) {
  const t = e.prev; const n = e; const s = e.next;
  if (W(t, n, s) >= 0) { return !1; }
  const r = t.x; const i = n.x; const o = s.x; const a = t.y; const c = n.y; const u = s.y; const l = r < i ? r < o ? r : o : i < o ? i : o; const h = a < c ? a < u ? a : u : c < u ? c : u; const f = r > i ? r > o ? r : o : i > o ? i : o; const d = a > c ? a > u ? a : u : c > u ? c : u;
  let m = s.next;
  for (; m !== t;) {
    if (m.x >= l && m.x <= f && m.y >= h && m.y <= d && me(r, a, i, c, o, u, m.x, m.y) && W(m.prev, m, m.next) >= 0) { return !1; }
    m = m.next;
  }
  return !0;
}
function uy (e, t, n, s) {
  const r = e.prev; const i = e; const o = e.next;
  if (W(r, i, o) >= 0) { return !1; }
  const a = r.x; const c = i.x; const u = o.x; const l = r.y; const h = i.y; const f = o.y; const d = a < c ? a < u ? a : u : c < u ? c : u; const m = l < h ? l < f ? l : f : h < f ? h : f; const g = a > c ? a > u ? a : u : c > u ? c : u; const y = l > h ? l > f ? l : f : h > f ? h : f; const E = rr(d, m, t, n, s); const R = rr(g, y, t, n, s);
  let B = e.prevZ; let C = e.nextZ;
  for (; B && B.z >= E && C && C.z <= R;) {
    if (B.x >= d && B.x <= g && B.y >= m && B.y <= y && B !== r && B !== o && me(a, l, c, h, u, f, B.x, B.y) && W(B.prev, B, B.next) >= 0 || (B = B.prevZ, C.x >= d && C.x <= g && C.y >= m && C.y <= y && C !== r && C !== o && me(a, l, c, h, u, f, C.x, C.y) && W(C.prev, C, C.next) >= 0)) { return !1; }
    C = C.nextZ;
  }
  for (; B && B.z >= E;) {
    if (B.x >= d && B.x <= g && B.y >= m && B.y <= y && B !== r && B !== o && me(a, l, c, h, u, f, B.x, B.y) && W(B.prev, B, B.next) >= 0) { return !1; }
    B = B.prevZ;
  }
  for (; C && C.z <= R;) {
    if (C.x >= d && C.x <= g && C.y >= m && C.y <= y && C !== r && C !== o && me(a, l, c, h, u, f, C.x, C.y) && W(C.prev, C, C.next) >= 0) { return !1; }
    C = C.nextZ;
  }
  return !0;
}
function ly (e, t, n) {
  let s = e;
  do {
    const r = s.prev; const i = s.next.next;
    !Zn(r, i) && Rc(r, s, s.next, i) && Ve(r, i) && Ve(i, r) && (t.push(r.i / n | 0), t.push(s.i / n | 0), t.push(i.i / n | 0), je(s), je(s.next), s = e = i), s = s.next;
  } while (s !== e);
  return ne(s);
}
function hy (e, t, n, s, r, i) {
  let o = e;
  do {
    let a = o.next.next;
    for (; a !== o.prev;) {
      if (o.i !== a.i && Cy(o, a)) {
        let c = Mc(o, a);
        o = ne(o, o.next), c = ne(c, c.next), Je(o, t, n, s, r, i, 0), Je(c, t, n, s, r, i, 0);
        return;
      }
      a = a.next;
    }
    o = o.next;
  } while (o !== e);
}
function fy (e, t, n, s, r, i) {
  const o = [];
  let a, c, u, l, h;
  for (a = 0, c = t.length; a < c; a++) { u = t[a] * s, l = a < c - 1 ? t[a + 1] * s : e.length, h = wc(e, u, l, s, !1, r && r[a + 1], i), h === h.next && (h.steiner = !0), o.push(By(h)); }
  for (o.sort(dy), a = 0; a < o.length; a++) { n = my(o[a], n); }
  return n;
}
function dy (e, t) {
  return e.x - t.x;
}
function my (e, t) {
  const n = gy(e, t);
  if (!n) { return t; }
  const s = Mc(n, e);
  return ne(s, s.next), ne(n, n.next);
}
function gy (e, t) {
  let n = t;
  const s = e.x; const r = e.y;
  let i = -1 / 0; let o;
  do {
    if (r <= n.y && r >= n.next.y && n.next.y !== n.y) {
      const f = n.x + (r - n.y) * (n.next.x - n.x) / (n.next.y - n.y);
      if (f <= s && f > i && (i = f, o = n.x < n.next.x ? n : n.next, f === s)) { return o; }
    }
    n = n.next;
  } while (n !== t);
  if (!o) { return null; }
  const a = o; const c = o.x; const u = o.y;
  let l = 1 / 0; let h;
  n = o;
  do { s >= n.x && n.x >= c && s !== n.x && me(r < u ? s : i, r, c, u, r < u ? i : s, r, n.x, n.y) && (h = Math.abs(r - n.y) / (s - n.x), Ve(n, e) && (h < l || h === l && (n.x > o.x || n.x === o.x && Ay(o, n))) && (o = n, l = h)), n = n.next; }
  while (n !== a);
  return o;
}
function Ay (e, t) {
  return W(e.prev, e, t.prev) < 0 && W(t.next, e, e.next) < 0;
}
function py (e, t, n, s) {
  let r = e;
  do { r.z === 0 && (r.z = rr(r.x, r.y, t, n, s)), r.prevZ = r.prev, r.nextZ = r.next, r = r.next; }
  while (r !== e);
  r.prevZ.nextZ = null, r.prevZ = null, yy(r);
}
function yy (e) {
  let t; let n; let s = 1; let r; let i; let o; let a; let c; let u;
  do {
    for (i = e, e = null, u = null, r = 0; i;) {
      for (r++, a = i, o = 0, n = 0; n < s && (o++, a = a.nextZ, !!a); n++)
        ;
      for (c = s; o > 0 || c > 0 && a;) { o !== 0 && (c === 0 || !a || i.z <= a.z) ? (t = i, i = i.nextZ, o--) : (t = a, a = a.nextZ, c--), u ? u.nextZ = t : e = t, t.prevZ = u, u = t; }
      i = a;
    }
    u.nextZ = null, s *= 2;
  } while (r > 1);
  return e;
}
function rr (e, t, n, s, r) {
  return e = (e - n) * r | 0, t = (t - s) * r | 0, e = (e | e << 8) & 16711935, e = (e | e << 4) & 252645135, e = (e | e << 2) & 858993459, e = (e | e << 1) & 1431655765, t = (t | t << 8) & 16711935, t = (t | t << 4) & 252645135, t = (t | t << 2) & 858993459, t = (t | t << 1) & 1431655765, e | t << 1;
}
function By (e) {
  let t = e; let n = e;
  do { (t.x < n.x || t.x === n.x && t.y < n.y) && (n = t), t = t.next; }
  while (t !== e);
  return n;
}
function me (e, t, n, s, r, i, o, a) {
  return (r - o) * (t - a) >= (e - o) * (i - a) && (e - o) * (s - a) >= (n - o) * (t - a) && (n - o) * (i - a) >= (r - o) * (s - a);
}
function Cy (e, t) {
  return e.next.i !== t.i && e.prev.i !== t.i && !Ey(e, t) && // dones't intersect other edges
  (Ve(e, t) && Ve(t, e) && Ty(e, t) && // locally visible
  (W(e.prev, e, t.prev) || W(e, t.prev, t)) || // does not create opposite-facing sectors
  Zn(e, t) && W(e.prev, e, e.next) > 0 && W(t.prev, t, t.next) > 0);
}
function W (e, t, n) {
  return (t.y - e.y) * (n.x - t.x) - (t.x - e.x) * (n.y - t.y);
}
function Zn (e, t) {
  return e.x === t.x && e.y === t.y;
}
function Rc (e, t, n, s) {
  const r = Bn(W(e, t, n)); const i = Bn(W(e, t, s)); const o = Bn(W(n, s, e)); const a = Bn(W(n, s, t));
  return !!(r !== i && o !== a || r === 0 && yn(e, n, t) || i === 0 && yn(e, s, t) || o === 0 && yn(n, e, s) || a === 0 && yn(n, t, s));
}
function yn (e, t, n) {
  return t.x <= Math.max(e.x, n.x) && t.x >= Math.min(e.x, n.x) && t.y <= Math.max(e.y, n.y) && t.y >= Math.min(e.y, n.y);
}
function Bn (e) {
  return e > 0 ? 1 : e < 0 ? -1 : 0;
}
function Ey (e, t) {
  let n = e;
  do {
    if (n.i !== e.i && n.next.i !== e.i && n.i !== t.i && n.next.i !== t.i && Rc(n, n.next, e, t)) { return !0; }
    n = n.next;
  } while (n !== e);
  return !1;
}
function Ve (e, t) {
  return W(e.prev, e, e.next) < 0 ? W(e, t, e.next) >= 0 && W(e, e.prev, t) >= 0 : W(e, t, e.prev) < 0 || W(e, e.next, t) < 0;
}
function Ty (e, t) {
  let n = e; let s = !1;
  const r = (e.x + t.x) / 2; const i = (e.y + t.y) / 2;
  do { n.y > i != n.next.y > i && n.next.y !== n.y && r < (n.next.x - n.x) * (i - n.y) / (n.next.y - n.y) + n.x && (s = !s), n = n.next; }
  while (n !== e);
  return s;
}
function Mc (e, t) {
  const n = new ir(e.i, e.x, e.y); const s = new ir(t.i, t.x, t.y); const r = e.next; const i = t.prev;
  return e.next = t, t.prev = e, n.next = r, r.prev = n, s.next = n, n.prev = s, i.next = s, s.prev = i, s;
}
function yo (e, t, n, s) {
  const r = new ir(e, t, n);
  return s ? (r.next = s.next, r.prev = s, s.next.prev = r, s.next = r) : (r.prev = r, r.next = r), r;
}
function je (e) {
  e.next.prev = e.prev, e.prev.next = e.next, e.prevZ && (e.prevZ.nextZ = e.nextZ), e.nextZ && (e.nextZ.prevZ = e.prevZ);
}
class ir {
  constructor (t, n, s) {
    this.prev = null, this.next = null, this.z = 0, this.prevZ = null, this.nextZ = null, this.steiner = !1, this.i = t, this.x = n, this.y = s;
  }
}
function by (e, t, n) {
  const s = _y(e); const r = Object.keys(s).filter((i) => s[i] !== Array);
  return wy(e, {
    propArrayTypes: s,
    ...t
  }, {
    numericPropKeys: n && n.numericPropKeys || r,
    PositionDataType: n ? n.PositionDataType : Float32Array,
    triangulate: n ? n.triangulate : !0
  });
}
function _y (e) {
  const t = {};
  for (const n of e) {
    if (n.properties) {
      for (const s in n.properties) {
        const r = n.properties[s];
        t[s] = vy(r, t[s]);
      }
    }
  }
  return t;
}
function wy (e, t, n) {
  const {
    pointPositionsCount: s,
    pointFeaturesCount: r,
    linePositionsCount: i,
    linePathsCount: o,
    lineFeaturesCount: a,
    polygonPositionsCount: c,
    polygonObjectsCount: u,
    polygonRingsCount: l,
    polygonFeaturesCount: h,
    propArrayTypes: f,
    coordLength: d
  } = t; const {
    numericPropKeys: m = [],
    PositionDataType: g = Float32Array,
    triangulate: y = !0
  } = n; const E = e[0] && 'id' in e[0]; const R = e.length > 65535 ? Uint32Array : Uint16Array; const B = {
    type: 'Point',
    positions: new g(s * d),
    globalFeatureIds: new R(s),
    featureIds: r > 65535 ? new Uint32Array(s) : new Uint16Array(s),
    numericProps: {},
    properties: [],
    fields: []
  }; const C = {
    type: 'LineString',
    pathIndices: i > 65535 ? new Uint32Array(o + 1) : new Uint16Array(o + 1),
    positions: new g(i * d),
    globalFeatureIds: new R(i),
    featureIds: a > 65535 ? new Uint32Array(i) : new Uint16Array(i),
    numericProps: {},
    properties: [],
    fields: []
  }; const M = {
    type: 'Polygon',
    polygonIndices: c > 65535 ? new Uint32Array(u + 1) : new Uint16Array(u + 1),
    primitivePolygonIndices: c > 65535 ? new Uint32Array(l + 1) : new Uint16Array(l + 1),
    positions: new g(c * d),
    globalFeatureIds: new R(c),
    featureIds: h > 65535 ? new Uint32Array(c) : new Uint16Array(c),
    numericProps: {},
    properties: [],
    fields: []
  };
  y && (M.triangles = []);
  for (const O of [B, C, M]) {
    for (const F of m) {
      const v = f[F];
      O.numericProps[F] = new v(O.positions.length / d);
    }
  }
  C.pathIndices[o] = i, M.polygonIndices[u] = c, M.primitivePolygonIndices[l] = c;
  const b = {
    pointPosition: 0,
    pointFeature: 0,
    linePosition: 0,
    linePath: 0,
    lineFeature: 0,
    polygonPosition: 0,
    polygonObject: 0,
    polygonRing: 0,
    polygonFeature: 0,
    feature: 0
  };
  for (const O of e) {
    const F = O.geometry; const v = O.properties || {};
    switch (F.type) {
      case 'Point':
        Ry(F, B, b, d, v), B.properties.push(xs(v, m)), E && B.fields.push({
          id: O.id
        }), b.pointFeature++;
        break;
      case 'LineString':
        My(F, C, b, d, v), C.properties.push(xs(v, m)), E && C.fields.push({
          id: O.id
        }), b.lineFeature++;
        break;
      case 'Polygon':
        Sy(F, M, b, d, v), M.properties.push(xs(v, m)), E && M.fields.push({
          id: O.id
        }), b.polygonFeature++;
        break;
      default:
        throw new Error('Invalid geometry type');
    }
    b.feature++;
  }
  return xy(B, C, M, d);
}
function Ry (e, t, n, s, r) {
  t.positions.set(e.data, n.pointPosition * s);
  const i = e.data.length / s;
  Hr(t, r, n.pointPosition, i), t.globalFeatureIds.fill(n.feature, n.pointPosition, n.pointPosition + i), t.featureIds.fill(n.pointFeature, n.pointPosition, n.pointPosition + i), n.pointPosition += i;
}
function My (e, t, n, s, r) {
  t.positions.set(e.data, n.linePosition * s);
  const i = e.data.length / s;
  Hr(t, r, n.linePosition, i), t.globalFeatureIds.fill(n.feature, n.linePosition, n.linePosition + i), t.featureIds.fill(n.lineFeature, n.linePosition, n.linePosition + i);
  for (let o = 0, a = e.indices.length; o < a; ++o) {
    const c = e.indices[o]; const u = o === a - 1 ? e.data.length : e.indices[o + 1];
    t.pathIndices[n.linePath++] = n.linePosition, n.linePosition += (u - c) / s;
  }
}
function Sy (e, t, n, s, r) {
  t.positions.set(e.data, n.polygonPosition * s);
  const i = e.data.length / s;
  Hr(t, r, n.polygonPosition, i), t.globalFeatureIds.fill(n.feature, n.polygonPosition, n.polygonPosition + i), t.featureIds.fill(n.polygonFeature, n.polygonPosition, n.polygonPosition + i);
  for (let o = 0, a = e.indices.length; o < a; ++o) {
    const c = n.polygonPosition;
    t.polygonIndices[n.polygonObject++] = c;
    const u = e.areas[o]; const l = e.indices[o]; const h = e.indices[o + 1];
    for (let d = 0, m = l.length; d < m; ++d) {
      const g = l[d]; const y = d === m - 1 ? h === void 0 ? e.data.length : h[0] : l[d + 1];
      t.primitivePolygonIndices[n.polygonRing++] = n.polygonPosition, n.polygonPosition += (y - g) / s;
    }
    const f = n.polygonPosition;
    Iy(t, u, l, {
      startPosition: c,
      endPosition: f,
      coordLength: s
    });
  }
}
function Iy (e, t, n, s) {
  const {
    startPosition: r,
    endPosition: i,
    coordLength: o
  } = s;
  if (!e.triangles) { return; }
  const a = r * o; const c = i * o; const u = e.positions.subarray(a, c); const l = n[0]; const h = n.slice(1).map((d) => (d - l) / o); const f = ay(u, h, o, t);
  for (let d = 0, m = f.length; d < m; ++d) { e.triangles.push(r + f[d]); }
}
function Is (e, t) {
  const n = {};
  for (const s in e) {
    n[s] = {
      value: e[s],
      size: t
    };
  }
  return n;
}
function xy (e, t, n, s) {
  const r = {
    shape: 'binary-feature-collection',
    points: {
      ...e,
      positions: {
        value: e.positions,
        size: s
      },
      globalFeatureIds: {
        value: e.globalFeatureIds,
        size: 1
      },
      featureIds: {
        value: e.featureIds,
        size: 1
      },
      numericProps: Is(e.numericProps, 1)
    },
    lines: {
      ...t,
      positions: {
        value: t.positions,
        size: s
      },
      pathIndices: {
        value: t.pathIndices,
        size: 1
      },
      globalFeatureIds: {
        value: t.globalFeatureIds,
        size: 1
      },
      featureIds: {
        value: t.featureIds,
        size: 1
      },
      numericProps: Is(t.numericProps, 1)
    },
    polygons: {
      ...n,
      positions: {
        value: n.positions,
        size: s
      },
      polygonIndices: {
        value: n.polygonIndices,
        size: 1
      },
      primitivePolygonIndices: {
        value: n.primitivePolygonIndices,
        size: 1
      },
      globalFeatureIds: {
        value: n.globalFeatureIds,
        size: 1
      },
      featureIds: {
        value: n.featureIds,
        size: 1
      },
      numericProps: Is(n.numericProps, 1)
    }
  };
  return r.polygons && n.triangles && (r.polygons.triangles = {
    value: new Uint32Array(n.triangles),
    size: 1
  }), r;
}
function Hr (e, t, n, s) {
  for (const r in e.numericProps) {
    if (r in t) {
      const i = t[r];
      e.numericProps[r].fill(i, n, n + s);
    }
  }
}
function xs (e, t) {
  const n = {};
  for (const s in e) { t.includes(s) || (n[s] = e[s]); }
  return n;
}
function vy (e, t) {
  return t === Array || !Number.isFinite(e) ? Array : t === Float64Array || Math.fround(e) !== e ? Float64Array : Float32Array;
}
function Oy (e) {
  let t = 0; let n = 0; let s = 0; let r = 0; let i = 0; let o = 0; let a = 0; let c = 0; let u = 0;
  const l = /* @__PURE__ */ new Set();
  for (const h of e) {
    const f = h.geometry;
    switch (f.type) {
      case 'Point':
        n++, t++, l.add(f.coordinates.length);
        break;
      case 'MultiPoint':
        n++, t += f.coordinates.length;
        for (const m of f.coordinates) { l.add(m.length); }
        break;
      case 'LineString':
        i++, s += f.coordinates.length, r++;
        for (const m of f.coordinates) { l.add(m.length); }
        break;
      case 'MultiLineString':
        i++;
        for (const m of f.coordinates) {
          s += m.length, r++;
          for (const g of m) { l.add(g.length); }
        }
        break;
      case 'Polygon':
        u++, a++, c += f.coordinates.length;
        const d = f.coordinates.flat();
        o += d.length;
        for (const m of d) { l.add(m.length); }
        break;
      case 'MultiPolygon':
        u++;
        for (const m of f.coordinates) {
          a++, c += m.length;
          const g = m.flat();
          o += g.length;
          for (const y of g) { l.add(y.length); }
        }
        break;
      default:
        throw new Error(`Unsupported geometry type: ${f.type}`);
    }
  }
  return {
    coordLength: l.size > 0 ? Math.max(...l) : 2,
    pointPositionsCount: t,
    pointFeaturesCount: n,
    linePositionsCount: s,
    linePathsCount: r,
    lineFeaturesCount: i,
    polygonPositionsCount: o,
    polygonObjectsCount: a,
    polygonRingsCount: c,
    polygonFeaturesCount: u
  };
}
function Fy (e) {
  const t = arguments.length > 1 && arguments[1] !== void 0
    ? arguments[1]
    : {
        coordLength: 2,
        fixRingWinding: !0
      };
  return e.map((n) => Dy(n, t));
}
function Bo (e, t, n, s) {
  n.push(t.length), t.push(...e);
  for (let r = e.length; r < s.coordLength; r++) { t.push(0); }
}
function or (e, t, n, s) {
  n.push(t.length);
  for (const r of e) {
    t.push(...r);
    for (let i = r.length; i < s.coordLength; i++) { t.push(0); }
  }
}
function Co (e, t, n, s, r) {
  let i = 0;
  const o = []; const a = [];
  for (const c of e) {
    const u = c.map((f) => f.slice(0, 2));
    let l = _c(u.flat());
    const h = l < 0;
    r.fixRingWinding && (i === 0 && !h || i > 0 && h) && (c.reverse(), l = -l), o.push(l), or(c, t, a, r), i++;
  }
  i > 0 && (s.push(o), n.push(a));
}
function Dy (e, t) {
  const {
    geometry: n
  } = e;
  if (n.type === 'GeometryCollection') { throw new Error('GeometryCollection type not supported'); }
  const s = []; const r = [];
  let i, o;
  switch (n.type) {
    case 'Point':
      o = 'Point', Bo(n.coordinates, s, r, t);
      break;
    case 'MultiPoint':
      o = 'Point', n.coordinates.map((a) => Bo(a, s, r, t));
      break;
    case 'LineString':
      o = 'LineString', or(n.coordinates, s, r, t);
      break;
    case 'MultiLineString':
      o = 'LineString', n.coordinates.map((a) => or(a, s, r, t));
      break;
    case 'Polygon':
      o = 'Polygon', i = [], Co(n.coordinates, s, r, i, t);
      break;
    case 'MultiPolygon':
      o = 'Polygon', i = [], n.coordinates.map((a) => Co(a, s, r, i, t));
      break;
    default:
      throw new Error(`Unknown type: ${o}`);
  }
  return {
    ...e,
    geometry: {
      type: o,
      indices: r,
      data: s,
      areas: i
    }
  };
}
function Sc (e) {
  const t = arguments.length > 1 && arguments[1] !== void 0
    ? arguments[1]
    : {
        fixRingWinding: !0,
        triangulate: !0
      };
  const n = Oy(e); const s = n.coordLength; const {
    fixRingWinding: r
  } = t; const i = Fy(e, {
    coordLength: s,
    fixRingWinding: r
  });
  return by(i, n, {
    numericPropKeys: t.numericPropKeys,
    PositionDataType: t.PositionDataType || Float32Array,
    triangulate: t.triangulate
  });
}
const Ly = '4.1.4'; const Py = {
  name: 'GeoJSON',
  id: 'geojson',
  module: 'geojson',
  version: Ly,
  worker: !0,
  extensions: ['geojson'],
  mimeTypes: ['application/geo+json'],
  category: 'geometry',
  text: !0,
  options: {
    geojson: {
      shape: 'object-row-table'
    },
    json: {
      shape: 'object-row-table',
      jsonpaths: ['$', '$.features']
    },
    gis: {
      format: 'geojson'
    }
  }
}; const ke = {
  ...Py,
  parse: Gy,
  parseTextSync: Ic,
  parseInBatches: Ny
};
async function Gy (e, t) {
  return Ic(new TextDecoder().decode(e), t);
}
function Ic (e, t) {
  let n;
  t = {
    ...ke.options,
    ...t
  }, t.geojson = {
    ...ke.options.geojson,
    ...t.geojson
  }, t.gis = t.gis || {};
  let s;
  try {
    s = JSON.parse(e);
  } catch {
    s = {};
  }
  const r = {
    shape: 'geojson-table',
    type: 'FeatureCollection',
    features: ((n = s) === null || n === void 0 ? void 0 : n.features) || []
  };
  switch (t.gis.format) {
    case 'binary':
      return Sc(r.features);
    default:
      return r;
  }
}
function Ny (e, t) {
  t = {
    ...ke.options,
    ...t
  }, t.json = {
    ...ke.options.geojson,
    ...t.geojson
  };
  const n = oy(e, t);
  switch (t.gis.format) {
    case 'binary':
      return Uy(n);
    default:
      return n;
  }
}
async function * Uy (e) {
  for await (const t of e) { t.data = Sc(t.data), yield t; }
}
function $t (e, t) {
  if (!e) { throw new Error(t || 'loader assertion failed.'); }
}
const Hy = 'Queued Requests'; const Jy = 'Active Requests'; const Vy = 'Cancelled Requests'; const jy = 'Queued Requests Ever'; const ky = 'Active Requests Ever'; const Ky = {
  id: 'request-scheduler',
  /** Specifies if the request scheduler should throttle incoming requests, mainly for comparative testing. */
  throttleRequests: !0,
  /** The maximum number of simultaneous active requests. Un-throttled requests do not observe this limit. */
  maxRequests: 6,
  /**
   * Specifies a debounce time, in milliseconds. All requests are queued, until no new requests have
   * been added to the queue for this amount of time.
   */
  debounceTime: 0
};
class zy {
  constructor (t = {}) {
    p(this, 'props');
    p(this, 'stats');
    p(this, 'activeRequestCount', 0);
    /** Tracks the number of active requests and prioritizes/cancels queued requests. */
    p(this, 'requestQueue', []);
    p(this, 'requestMap', /* @__PURE__ */ new Map());
    p(this, 'updateTimer', null);
    this.props = { ...Ky, ...t }, this.stats = new $o({ id: this.props.id }), this.stats.get(Hy), this.stats.get(Jy), this.stats.get(Vy), this.stats.get(jy), this.stats.get(ky);
  }

  /**
   * Called by an application that wants to issue a request, without having it deeply queued by the browser
   *
   * When the returned promise resolved, it is OK for the application to issue a request.
   * The promise resolves to an object that contains a `done` method.
   * When the application's request has completed (or failed), the application must call the `done` function
   *
   * @param handle
   * @param getPriority will be called when request "slots" open up,
   *    allowing the caller to update priority or cancel the request
   *    Highest priority executes first, priority < 0 cancels the request
   * @returns a promise
   *   - resolves to a object (with a `done` field) when the request can be issued without queueing,
   *   - resolves to `null` if the request has been cancelled (by the callback return < 0).
   *     In this case the application should not issue the request
   */
  scheduleRequest (t, n = () => 0) {
    if (!this.props.throttleRequests) {
      return Promise.resolve({
        done: () => {
        }
      });
    }
    if (this.requestMap.has(t)) { return this.requestMap.get(t); }
    const s = { handle: t, priority: 0, getPriority: n }; const r = new Promise((i) => (s.resolve = i, s));
    return this.requestQueue.push(s), this.requestMap.set(t, r), this._issueNewRequests(), r;
  }

  // PRIVATE
  _issueRequest (t) {
    const { handle: n, resolve: s } = t;
    let r = !1;
    const i = () => {
      r || (r = !0, this.requestMap.delete(n), this.activeRequestCount--, this._issueNewRequests());
    };
    return this.activeRequestCount++, s ? s({ done: i }) : Promise.resolve({ done: i });
  }

  /** We check requests asynchronously, to prevent multiple updates */
  _issueNewRequests () {
    this.updateTimer !== null && clearTimeout(this.updateTimer), this.updateTimer = setTimeout(() => this._issueNewRequestsAsync(), this.props.debounceTime);
  }

  /** Refresh all requests  */
  _issueNewRequestsAsync () {
    this.updateTimer !== null && clearTimeout(this.updateTimer), this.updateTimer = null;
    const t = Math.max(this.props.maxRequests - this.activeRequestCount, 0);
    if (t !== 0) {
      this._updateAllRequests();
      for (let n = 0; n < t; ++n) {
        const s = this.requestQueue.shift();
        s && this._issueRequest(s);
      }
    }
  }

  /** Ensure all requests have updated priorities, and that no longer valid requests are cancelled */
  _updateAllRequests () {
    const t = this.requestQueue;
    for (let n = 0; n < t.length; ++n) {
      const s = t[n];
      this._updateRequest(s) || (t.splice(n, 1), this.requestMap.delete(s.handle), n--);
    }
    t.sort((n, s) => n.priority - s.priority);
  }

  /** Update a single request by calling the callback */
  _updateRequest (t) {
    return t.priority = t.getPriority(t.handle), t.priority < 0 ? (t.resolve(null), !1) : !0;
  }
}
function Wy (e) {
  const t = e ? e.lastIndexOf('/') : -1;
  return t >= 0 ? e.substr(0, t) : '';
}
class Xy {
  constructor (t, n, s) {
    p(this, 'item');
    p(this, 'previous');
    p(this, 'next');
    this.item = t, this.previous = n, this.next = s;
  }
}
class Qy {
  constructor () {
    p(this, 'head', null);
    p(this, 'tail', null);
    p(this, '_length', 0);
  }

  get length () {
    return this._length;
  }

  /**
   * Adds the item to the end of the list
   * @param {*} [item]
   * @return {DoublyLinkedListNode}
   */
  add (t) {
    const n = new Xy(t, this.tail, null);
    return this.tail ? (this.tail.next = n, this.tail = n) : (this.head = n, this.tail = n), ++this._length, n;
  }

  /**
   * Removes the given node from the list
   * @param {DoublyLinkedListNode} node
   */
  remove (t) {
    t && (t.previous && t.next ? (t.previous.next = t.next, t.next.previous = t.previous) : t.previous ? (t.previous.next = null, this.tail = t.previous) : t.next ? (t.next.previous = null, this.head = t.next) : (this.head = null, this.tail = null), t.next = null, t.previous = null, --this._length);
  }

  /**
   * Moves nextNode after node
   * @param {DoublyLinkedListNode} node
   * @param {DoublyLinkedListNode} nextNode
   */
  splice (t, n) {
    t !== n && (this.remove(n), this._insert(t, n));
  }

  _insert (t, n) {
    const s = t.next;
    t.next = n, this.tail === t ? this.tail = n : s.previous = n, n.next = s, n.previous = t, ++this._length;
  }
}
class qy {
  constructor () {
    p(this, '_list');
    p(this, '_sentinel');
    p(this, '_trimTiles');
    this._list = new Qy(), this._sentinel = this._list.add('sentinel'), this._trimTiles = !1;
  }

  reset () {
    this._list.splice(this._list.tail, this._sentinel);
  }

  touch (t) {
    const n = t._cacheNode;
    n && this._list.splice(this._sentinel, n);
  }

  add (t, n, s) {
    n._cacheNode || (n._cacheNode = this._list.add(n), s && s(t, n));
  }

  unloadTile (t, n, s) {
    const r = n._cacheNode;
    r && (this._list.remove(r), n._cacheNode = null, s && s(t, n));
  }

  unloadTiles (t, n) {
    const s = this._trimTiles;
    this._trimTiles = !1;
    const r = this._list; const i = t.maximumMemoryUsage * 1024 * 1024; const o = this._sentinel;
    let a = r.head;
    for (; a !== o && (t.gpuMemoryUsageInBytes > i || s);) {
      const c = a.item;
      a = a.next, this.unloadTile(t, c, n);
    }
  }

  trim () {
    this._trimTiles = !0;
  }
}
function Yy (e, t) {
  $t(e), $t(t);
  const { rtcCenter: n, gltfUpAxis: s } = t; const { computedTransform: r, boundingVolume: { center: i } } = e;
  let o = new V(r);
  switch (n && o.translate(n), s) {
    case 'Z':
      break;
    case 'Y':
      const h = new V().rotateX(Math.PI / 2);
      o = o.multiplyRight(h);
      break;
    case 'X':
      const f = new V().rotateY(-Math.PI / 2);
      o = o.multiplyRight(f);
      break;
  }
  t.isQuantized && o.translate(t.quantizedVolumeOffset).scale(t.quantizedVolumeScale);
  const a = new A(i);
  t.cartesianModelMatrix = o, t.cartesianOrigin = a;
  const c = J.WGS84.cartesianToCartographic(a, new A()); const l = J.WGS84.eastNorthUpToFixedFrame(a).invert();
  t.cartographicModelMatrix = l.multiplyRight(o), t.cartographicOrigin = c, t.coordinateSystem || (t.modelMatrix = t.cartographicModelMatrix);
}
const Eo = new A(); const vs = new A(); const ar = new dt([
  new nt(),
  new nt(),
  new nt(),
  new nt(),
  new nt(),
  new nt()
]);
function $y (e, t) {
  const { cameraDirection: n, cameraUp: s, height: r } = e; const { metersPerUnit: i } = e.distanceScales; const o = wn(e, e.center); const a = J.WGS84.eastNorthUpToFixedFrame(o); const c = e.unprojectPosition(e.cameraPosition); const u = J.WGS84.cartographicToCartesian(c, new A()); const l = new A(
    // @ts-ignore
    a.transformAsVector(new A(n).scale(i))
  ).normalize(); const h = new A(
    // @ts-ignore
    a.transformAsVector(new A(s).scale(i))
  ).normalize();
  tB(e);
  const f = e.constructor; const { longitude: d, latitude: m, width: g, bearing: y, zoom: E } = e; const R = new f({
    longitude: d,
    latitude: m,
    height: r,
    width: g,
    bearing: y,
    zoom: E,
    pitch: 0
  });
  return {
    camera: {
      position: u,
      direction: l,
      up: h
    },
    viewport: e,
    topDownViewport: R,
    height: r,
    cullingVolume: ar,
    frameNumber: t,
    // TODO: This can be the same between updates, what number is unique for between updates?
    sseDenominator: 1.15
    // Assumes fovy = 60 degrees
  };
}
function Zy (e, t, n) {
  if (n === 0 || e.length <= n) { return [e, []]; }
  const s = []; const { longitude: r, latitude: i } = t.viewport;
  for (const [u, l] of e.entries()) {
    const [h, f] = l.header.mbs; const d = Math.abs(r - h); const m = Math.abs(i - f); const g = Math.sqrt(m * m + d * d);
    s.push([u, g]);
  }
  const o = s.sort((u, l) => u[1] - l[1]); const a = [];
  for (let u = 0; u < n; u++) { a.push(e[o[u][0]]); }
  const c = [];
  for (let u = n; u < o.length; u++) { c.push(e[o[u][0]]); }
  return [a, c];
}
function tB (e) {
  const t = e.getFrustumPlanes(); const n = To(t.near, e.cameraPosition); const s = wn(e, n); const r = wn(e, e.cameraPosition, vs);
  let i = 0;
  ar.planes[i++].fromPointNormal(s, Eo.copy(s).subtract(r));
  for (const o in t) {
    if (o === 'near') { continue; }
    const a = t[o]; const c = To(a, n, vs); const u = wn(e, c, vs);
    ar.planes[i++].fromPointNormal(
      u,
      // Want the normal to point into the frustum since that's what culling expects
      Eo.copy(s).subtract(u)
    );
  }
}
function To (e, t, n = new A()) {
  const s = e.normal.dot(t);
  return n.copy(e.normal).scale(e.distance - s).add(t), n;
}
function wn (e, t, n = new A()) {
  const s = e.unprojectPosition(t);
  return J.WGS84.cartographicToCartesian(s, n);
}
const eB = 6378137; const nB = 6378137; const cr = 6356752314245179e-9; const ge = new A();
function sB (e, t) {
  if (e instanceof qe) {
    const { halfAxes: n } = e; const s = iB(n);
    return Math.log2(cr / (s + t[2]));
  } else if (e instanceof Qe) {
    const { radius: n } = e;
    return Math.log2(cr / (n + t[2]));
  } else if (e.width && e.height) {
    const { width: n, height: s } = e; const r = Math.log2(eB / n); const i = Math.log2(nB / s);
    return (r + i) / 2;
  }
  return 1;
}
function xc (e, t, n) {
  J.WGS84.cartographicToCartesian([e.xmax, e.ymax, e.zmax], ge);
  const s = Math.sqrt(Math.pow(ge[0] - n[0], 2) + Math.pow(ge[1] - n[1], 2) + Math.pow(ge[2] - n[2], 2));
  return Math.log2(cr / (s + t[2]));
}
function rB (e, t, n) {
  const [s, r, i, o] = e;
  return xc({ xmin: s, xmax: i, ymin: r, ymax: o, zmin: 0, zmax: 0 }, t, n);
}
function iB (e) {
  e.getColumn(0, ge);
  const t = e.getColumn(1); const n = e.getColumn(2);
  return ge.add(t).add(n).len();
}
const lt = {
  UNLOADED: 0,
  // Has never been requested
  LOADING: 1,
  // Is waiting on a pending request
  PROCESSING: 2,
  // Request received.  Contents are being processed for rendering.  Depending on the content, it might make its own requests for external data.
  READY: 3,
  // Ready to render.
  EXPIRED: 4,
  // Is expired and will be unloaded once new content is loaded.
  FAILED: 5
  // Request failed.
};
let Ht;
(function (e) {
  e[e.ADD = 1] = 'ADD', e[e.REPLACE = 2] = 'REPLACE';
})(Ht || (Ht = {}));
let Pe;
(function (e) {
  e.EMPTY = 'empty', e.SCENEGRAPH = 'scenegraph', e.POINTCLOUD = 'pointcloud', e.MESH = 'mesh';
})(Pe || (Pe = {}));
let At;
(function (e) {
  e.I3S = 'I3S', e.TILES3D = 'TILES3D';
})(At || (At = {}));
let bo;
(function (e) {
  e.GEOMETRIC_ERROR = 'geometricError', e.MAX_SCREEN_THRESHOLD = 'maxScreenThreshold';
})(bo || (bo = {}));
const oB = {
  NOT_COMPUTED: -1,
  USE_OPTIMIZATION: 1,
  SKIP_OPTIMIZATION: 0
};
function vc (e) {
  return e != null;
}
const it = new A(); const Rn = new A(); const aB = new A(); const cB = new A(); const qt = new A(); const _o = new A(); const wo = new A(); const Ro = new A();
function Os (e, t, n) {
  if ($t(e, '3D Tile: boundingVolume must be defined'), e.box) { return Oc(e.box, t, n); }
  if (e.region) { return hB(e.region); }
  if (e.sphere) { return lB(e.sphere, t, n); }
  throw new Error('3D Tile: boundingVolume must contain a sphere, region, or box');
}
function uB (e, t) {
  if (e.box) { return fB(t); }
  if (e.region) {
    const [n, s, r, i, o, a] = e.region;
    return [
      [Rt(n), Rt(s), o],
      [Rt(r), Rt(i), a]
    ];
  }
  if (e.sphere) { return dB(t); }
  throw new Error('Unkown boundingVolume type');
}
function Oc (e, t, n) {
  const s = new A(e[0], e[1], e[2]);
  t.transform(s, s);
  let r = [];
  if (e.length === 10) {
    const u = e.slice(3, 6); const l = new On();
    l.fromArray(e, 6);
    const h = new A([1, 0, 0]); const f = new A([0, 1, 0]); const d = new A([0, 0, 1]);
    h.transformByQuaternion(l), h.scale(u[0]), f.transformByQuaternion(l), f.scale(u[1]), d.transformByQuaternion(l), d.scale(u[2]), r = [...h.toArray(), ...f.toArray(), ...d.toArray()];
  } else { r = [...e.slice(3, 6), ...e.slice(6, 9), ...e.slice(9, 12)]; }
  const i = t.transformAsVector(r.slice(0, 3)); const o = t.transformAsVector(r.slice(3, 6)); const a = t.transformAsVector(r.slice(6, 9)); const c = new X([
    i[0],
    i[1],
    i[2],
    o[0],
    o[1],
    o[2],
    a[0],
    a[1],
    a[2]
  ]);
  return vc(n) ? (n.center = s, n.halfAxes = c, n) : new qe(s, c);
}
function lB (e, t, n) {
  const s = new A(e[0], e[1], e[2]);
  t.transform(s, s);
  const r = t.getScale(Rn); const i = Math.max(Math.max(r[0], r[1]), r[2]); const o = e[3] * i;
  return vc(n) ? (n.center = s, n.radius = o, n) : new Qe(s, o);
}
function hB (e) {
  const [t, n, s, r, i, o] = e; const a = J.WGS84.cartographicToCartesian([Rt(t), Rt(r), i], aB); const c = J.WGS84.cartographicToCartesian([Rt(s), Rt(n), o], cB); const u = new A().addVectors(a, c).multiplyByScalar(0.5);
  return J.WGS84.cartesianToCartographic(u, qt), J.WGS84.cartographicToCartesian([Rt(s), qt[1], qt[2]], _o), J.WGS84.cartographicToCartesian([qt[0], Rt(r), qt[2]], wo), J.WGS84.cartographicToCartesian([qt[0], qt[1], o], Ro), Oc([
    ...u,
    ..._o.subtract(u),
    ...wo.subtract(u),
    ...Ro.subtract(u)
  ], new V());
}
function fB (e) {
  const t = Fc(); const { halfAxes: n } = e; const s = new A(n.getColumn(0)); const r = new A(n.getColumn(1)); const i = new A(n.getColumn(2));
  for (let o = 0; o < 2; o++) {
    for (let a = 0; a < 2; a++) {
      for (let c = 0; c < 2; c++) { it.copy(e.center), it.add(s), it.add(r), it.add(i), Dc(t, it), i.negate(); }
      r.negate();
    }
    s.negate();
  }
  return t;
}
function dB (e) {
  const t = Fc(); const { center: n, radius: s } = e; const r = J.WGS84.scaleToGeodeticSurface(n, it);
  let i;
  r ? i = J.WGS84.geodeticSurfaceNormal(r) : i = new A(0, 0, 1);
  let o = new A(i[2], -i[1], 0);
  o.len() > 0 ? o.normalize() : o = new A(0, 1, 0);
  const a = o.clone().cross(i);
  for (const c of [o, a, i]) {
    Rn.copy(c).scale(s);
    for (let u = 0; u < 2; u++) { it.copy(n), it.add(Rn), Dc(t, it), Rn.negate(); }
  }
  return t;
}
function Fc () {
  return [
    [1 / 0, 1 / 0, 1 / 0],
    [-1 / 0, -1 / 0, -1 / 0]
  ];
}
function Dc (e, t) {
  J.WGS84.cartesianToCartographic(t, it), e[0][0] = Math.min(e[0][0], it[0]), e[0][1] = Math.min(e[0][1], it[1]), e[0][2] = Math.min(e[0][2], it[2]), e[1][0] = Math.max(e[1][0], it[0]), e[1][1] = Math.max(e[1][1], it[1]), e[1][2] = Math.max(e[1][2], it[2]);
}
new A();
new A();
new V();
new A();
new A();
new A();
function mB (e, t) {
  const n = e * t;
  return 1 - Math.exp(-(n * n));
}
function gB (e, t) {
  if (e.dynamicScreenSpaceError && e.dynamicScreenSpaceErrorComputedDensity) {
    const n = e.dynamicScreenSpaceErrorComputedDensity; const s = e.dynamicScreenSpaceErrorFactor;
    return mB(t, n) * s;
  }
  return 0;
}
function AB (e, t, n) {
  const s = e.tileset; const r = e.parent && e.parent.lodMetricValue || e.lodMetricValue; const i = n ? r : e.lodMetricValue;
  if (i === 0) { return 0; }
  const o = Math.max(e._distanceToCamera, 1e-7); const { height: a, sseDenominator: c } = t; const { viewDistanceScale: u } = s.options;
  let l = i * a * (u || 1) / (o * c);
  return l -= gB(s, o), l;
}
const Fs = new A(); const Mo = new A(); const jt = new A(); const So = new A(); const pB = new A(); const Ds = new V(); const Io = new V();
function yB (e, t) {
  if (e.lodMetricValue === 0 || isNaN(e.lodMetricValue)) { return 'DIG'; }
  const n = 2 * Lc(e, t);
  return n < 2 ? 'OUT' : !e.header.children || n <= e.lodMetricValue ? 'DRAW' : e.header.children ? 'DIG' : 'OUT';
}
function Lc (e, t) {
  const { topDownViewport: n } = t; const s = e.header.mbs[1]; const r = e.header.mbs[0]; const i = e.header.mbs[2]; const o = e.header.mbs[3]; const a = [...e.boundingVolume.center]; const c = n.unprojectPosition(n.cameraPosition);
  J.WGS84.cartographicToCartesian(c, Fs), Mo.copy(Fs).subtract(a).normalize(), J.WGS84.eastNorthUpToFixedFrame(a, Ds), Io.copy(Ds).invert(), jt.copy(Fs).transform(Io);
  const u = Math.sqrt(jt[0] * jt[0] + jt[1] * jt[1]); const l = u * u / jt[2];
  So.copy([jt[0], jt[1], l]);
  const f = So.transform(Ds).subtract(a).normalize(); const m = Mo.cross(f).normalize().scale(o).add(a); const g = J.WGS84.cartesianToCartographic(m); const y = n.project([r, s, i]); const E = n.project(g);
  return pB.copy(y).subtract(E).magnitude();
}
function BB (e) {
  return {
    assetGltfUpAxis: e.asset && e.asset.gltfUpAxis || 'Y'
  };
}
class xo {
  constructor (t = 0) {
    p(this, '_map', /* @__PURE__ */ new Map());
    p(this, '_array');
    p(this, '_length');
    this._array = new Array(t), this._length = t;
  }

  /**
   * Gets or sets the length of the array.
   * If the set length is greater than the length of the internal array, the internal array is resized.
   *
   * @memberof ManagedArray.prototype
   * @type Number
   */
  get length () {
    return this._length;
  }

  set length (t) {
    this._length = t, t > this._array.length && (this._array.length = t);
  }

  /**
   * Gets the internal array.
   *
   * @memberof ManagedArray.prototype
   * @type Array
   * @readonly
   */
  get values () {
    return this._array;
  }

  /**
   * Gets the element at an index.
   *
   * @param {Number} index The index to get.
   */
  get (t) {
    return $t(t < this._array.length), this._array[t];
  }

  /**
   * Sets the element at an index. Resizes the array if index is greater than the length of the array.
   *
   * @param {Number} index The index to set.
   * @param {*} element The element to set at index.
   */
  set (t, n) {
    $t(t >= 0), t >= this.length && (this.length = t + 1), this._map.has(this._array[t]) && this._map.delete(this._array[t]), this._array[t] = n, this._map.set(n, t);
  }

  delete (t) {
    const n = this._map.get(t);
    n >= 0 && (this._array.splice(n, 1), this._map.delete(t), this.length--);
  }

  /**
   * Returns the last element in the array without modifying the array.
   *
   * @returns {*} The last element in the array.
   */
  peek () {
    return this._array[this._length - 1];
  }

  /**
   * Push an element into the array.
   *
   * @param {*} element The element to push.
   */
  push (t) {
    if (!this._map.has(t)) {
      const n = this.length++;
      this._array[n] = t, this._map.set(t, n);
    }
  }

  /**
   * Pop an element from the array.
   *
   * @returns {*} The last element in the array.
   */
  pop () {
    const t = this._array[--this.length];
    return this._map.delete(t), t;
  }

  /**
   * Resize the internal array if length > _array.length.
   *
   * @param {Number} length The length.
   */
  reserve (t) {
    $t(t >= 0), t > this._array.length && (this._array.length = t);
  }

  /**
   * Resize the array.
   *
   * @param {Number} length The length.
   */
  resize (t) {
    $t(t >= 0), this.length = t;
  }

  /**
   * Trim the internal array to the specified length. Defaults to the current length.
   *
   * @param {Number} [length] The length.
   */
  trim (t) {
    t == null && (t = this.length), this._array.length = t;
  }

  reset () {
    this._array = [], this._map = /* @__PURE__ */ new Map(), this._length = 0;
  }

  find (t) {
    return this._map.has(t);
  }
}
const CB = {
  loadSiblings: !1,
  skipLevelOfDetail: !1,
  updateTransforms: !0,
  onTraversalEnd: () => {
  },
  viewportTraversersMap: {},
  basePath: ''
};
class ts {
  // TODO nested props
  constructor (t) {
    p(this, 'options');
    // fulfill in traverse call
    p(this, 'root', null);
    // tiles should be rendered
    p(this, 'selectedTiles', {});
    // tiles should be loaded from server
    p(this, 'requestedTiles', {});
    // tiles does not have render content
    p(this, 'emptyTiles', {});
    p(this, 'lastUpdate', (/* @__PURE__ */ new Date()).getTime());
    p(this, 'updateDebounceTime', 1e3);
    /** temporary storage to hold the traversed tiles during a traversal */
    p(this, '_traversalStack', new xo());
    p(this, '_emptyTraversalStack', new xo());
    /** set in every traverse cycle */
    p(this, '_frameNumber', null);
    this.options = { ...CB, ...t };
  }

  // RESULT
  traversalFinished (t) {
    return !0;
  }

  // tiles should be visible
  traverse (t, n, s) {
    this.root = t, this.options = { ...this.options, ...s }, this.reset(), this.updateTile(t, n), this._frameNumber = n.frameNumber, this.executeTraversal(t, n);
  }

  reset () {
    this.requestedTiles = {}, this.selectedTiles = {}, this.emptyTiles = {}, this._traversalStack.reset(), this._emptyTraversalStack.reset();
  }

  /**
   * Execute traverse
   * Depth-first traversal that traverses all visible tiles and marks tiles for selection.
   * If skipLevelOfDetail is off then a tile does not refine until all children are loaded.
   * This is the traditional replacement refinement approach and is called the base traversal.
   * Tiles that have a greater screen space error than the base screen space error are part of the base traversal,
   * all other tiles are part of the skip traversal. The skip traversal allows for skipping levels of the tree
   * and rendering children and parent tiles simultaneously.
   */
  /* eslint-disable-next-line complexity, max-statements */
  executeTraversal (t, n) {
    const s = this._traversalStack;
    for (t._selectionDepth = 1, s.push(t); s.length > 0;) {
      const i = s.pop();
      let o = !1;
      this.canTraverse(i, n) && (this.updateChildTiles(i, n), o = this.updateAndPushChildren(i, n, s, i.hasRenderContent ? i._selectionDepth + 1 : i._selectionDepth));
      const a = i.parent; const c = !!(!a || a._shouldRefine); const u = !o;
      i.hasRenderContent ? i.refine === Ht.ADD ? (this.loadTile(i, n), this.selectTile(i, n)) : i.refine === Ht.REPLACE && (this.loadTile(i, n), u && this.selectTile(i, n)) : (this.emptyTiles[i.id] = i, this.loadTile(i, n), u && this.selectTile(i, n)), this.touchTile(i, n), i._shouldRefine = o && c;
    }
    const r = (/* @__PURE__ */ new Date()).getTime();
    (this.traversalFinished(n) || r - this.lastUpdate > this.updateDebounceTime) && (this.lastUpdate = r, this.options.onTraversalEnd(n));
  }

  updateChildTiles (t, n) {
    const s = t.children;
    for (const r of s) { this.updateTile(r, n); }
  }

  /* eslint-disable complexity, max-statements */
  updateAndPushChildren (t, n, s, r) {
    const { loadSiblings: i, skipLevelOfDetail: o } = this.options; const a = t.children;
    a.sort(this.compareDistanceToCamera.bind(this));
    const c = t.refine === Ht.REPLACE && t.hasRenderContent && !o;
    let u = !1; let l = !0;
    for (const h of a) {
      if (h._selectionDepth = r, h.isVisibleAndInRequestVolume ? (s.find(h) && s.delete(h), s.push(h), u = !0) : (c || i) && (this.loadTile(h, n), this.touchTile(h, n)), c) {
        let f;
        if (h._inRequestVolume ? h.hasRenderContent ? f = h.contentAvailable : f = this.executeEmptyTraversal(h, n) : f = !1, l = l && f, !l) { return !1; }
      }
    }
    return u || (l = !1), l;
  }

  /* eslint-enable complexity, max-statements */
  updateTile (t, n) {
    this.updateTileVisibility(t, n);
  }

  // tile to render in the browser
  selectTile (t, n) {
    this.shouldSelectTile(t) && (t._selectedFrame = n.frameNumber, this.selectedTiles[t.id] = t);
  }

  // tile to load from server
  loadTile (t, n) {
    this.shouldLoadTile(t) && (t._requestedFrame = n.frameNumber, t._priority = t._getPriority(), this.requestedTiles[t.id] = t);
  }

  // cache tile
  touchTile (t, n) {
    t.tileset._cache.touch(t), t._touchedFrame = n.frameNumber;
  }

  // tile should be visible
  // tile should have children
  // tile LoD (level of detail) is not sufficient under current viewport
  canTraverse (t, n) {
    return t.hasChildren ? t.hasTilesetContent ? !t.contentExpired : this.shouldRefine(t, n) : !1;
  }

  shouldLoadTile (t) {
    return t.hasUnloadedContent || t.contentExpired;
  }

  shouldSelectTile (t) {
    return t.contentAvailable && !this.options.skipLevelOfDetail;
  }

  /** Decide if tile LoD (level of detail) is not sufficient under current viewport */
  shouldRefine (t, n, s = !1) {
    let r = t._screenSpaceError;
    return s && (r = t.getScreenSpaceError(n, !0)), r > t.tileset.memoryAdjustedScreenSpaceError;
  }

  updateTileVisibility (t, n) {
    const s = [];
    if (this.options.viewportTraversersMap) {
      for (const r in this.options.viewportTraversersMap) { this.options.viewportTraversersMap[r] === n.viewport.id && s.push(r); }
    } else { s.push(n.viewport.id); }
    t.updateVisibility(n, s);
  }

  // UTILITIES
  compareDistanceToCamera (t, n) {
    return t._distanceToCamera - n._distanceToCamera;
  }

  anyChildrenVisible (t, n) {
    let s = !1;
    for (const r of t.children) { r.updateVisibility(n), s = s || r.isVisibleAndInRequestVolume; }
    return s;
  }

  // Depth-first traversal that checks if all nearest descendants with content are loaded.
  // Ignores visibility.
  executeEmptyTraversal (t, n) {
    let s = !0;
    const r = this._emptyTraversalStack;
    for (r.push(t); r.length > 0;) {
      const i = r.pop(); const o = !i.hasRenderContent && this.canTraverse(i, n); const a = !i.hasRenderContent && i.children.length === 0;
      if (!o && !i.contentAvailable && !a && (s = !1), this.updateTile(i, n), i.isVisibleAndInRequestVolume || (this.loadTile(i, n), this.touchTile(i, n)), o) {
        const c = i.children;
        for (const u of c) { r.push(u); }
      }
    }
    return s;
  }
}
const vo = new A();
function EB (e) {
  return e != null;
}
class ur {
  // TODO i3s specific, needs to remove
  /**
   * @constructs
   * Create a Tile3D instance
   * @param tileset - Tileset3D instance
   * @param header - tile header - JSON loaded from a dataset
   * @param parentHeader - parent Tile3D instance
   * @param extendedId - optional ID to separate copies of a tile for different viewports.
   *    const extendedId = `${tile.id}-${frameState.viewport.id}`;
   */
  // eslint-disable-next-line max-statements
  constructor (t, n, s, r = '') {
    p(this, 'tileset');
    p(this, 'header');
    p(this, 'id');
    p(this, 'url');
    p(this, 'parent');
    /* Specifies the type of refine that is used when traversing this tile for rendering. */
    p(this, 'refine');
    p(this, 'type');
    p(this, 'contentUrl');
    /** Different refinement algorithms used by I3S and 3D tiles */
    p(this, 'lodMetricType', 'geometricError');
    /** The error, in meters, introduced if this tile is rendered and its children are not. */
    p(this, 'lodMetricValue', 0);
    /** @todo math.gl is not exporting BoundingVolume base type? */
    p(this, 'boundingVolume', null);
    /**
     * The tile's content.  This represents the actual tile's payload,
     * not the content's metadata in the tileset JSON file.
     */
    p(this, 'content', null);
    p(this, 'contentState', lt.UNLOADED);
    p(this, 'gpuMemoryUsageInBytes', 0);
    /** The tile's children - an array of Tile3D objects. */
    p(this, 'children', []);
    p(this, 'depth', 0);
    p(this, 'viewportIds', []);
    p(this, 'transform', new V());
    p(this, 'extensions', null);
    /** TODO Cesium 3d tiles specific */
    p(this, 'implicitTiling', null);
    /** Container to store application specific data */
    p(this, 'userData', {});
    p(this, 'computedTransform');
    p(this, 'hasEmptyContent', !1);
    p(this, 'hasTilesetContent', !1);
    p(this, 'traverser', new ts({}));
    /** Used by TilesetCache */
    p(this, '_cacheNode', null);
    p(this, '_frameNumber', null);
    // TODO Cesium 3d tiles specific
    p(this, '_expireDate', null);
    p(this, '_expiredContent', null);
    p(this, '_boundingBox');
    /** updated every frame for tree traversal and rendering optimizations: */
    p(this, '_distanceToCamera', 0);
    p(this, '_screenSpaceError', 0);
    p(this, '_visibilityPlaneMask');
    p(this, '_visible');
    p(this, '_contentBoundingVolume');
    p(this, '_viewerRequestVolume');
    p(this, '_initialTransform', new V());
    // Used by traverser, cannot be marked private
    p(this, '_priority', 0);
    p(this, '_selectedFrame', 0);
    p(this, '_requestedFrame', 0);
    p(this, '_selectionDepth', 0);
    p(this, '_touchedFrame', 0);
    p(this, '_centerZDepth', 0);
    p(this, '_shouldRefine', !1);
    p(this, '_stackLength', 0);
    p(this, '_visitedFrame', 0);
    p(this, '_inRequestVolume', !1);
    p(this, '_lodJudge', null);
    this.header = n, this.tileset = t, this.id = r || n.id, this.url = n.url, this.parent = s, this.refine = this._getRefine(n.refine), this.type = n.type, this.contentUrl = n.contentUrl, this._initializeLodMetric(n), this._initializeTransforms(n), this._initializeBoundingVolumes(n), this._initializeContent(n), this._initializeRenderingState(n), Object.seal(this);
  }

  destroy () {
    this.header = null;
  }

  isDestroyed () {
    return this.header === null;
  }

  get selected () {
    return this._selectedFrame === this.tileset._frameNumber;
  }

  get isVisible () {
    return this._visible;
  }

  get isVisibleAndInRequestVolume () {
    return this._visible && this._inRequestVolume;
  }

  /** Returns true if tile is not an empty tile and not an external tileset */
  get hasRenderContent () {
    return !this.hasEmptyContent && !this.hasTilesetContent;
  }

  /** Returns true if tile has children */
  get hasChildren () {
    return this.children.length > 0 || this.header.children && this.header.children.length > 0;
  }

  /**
   * Determines if the tile's content is ready. This is automatically `true` for
   * tiles with empty content.
   */
  get contentReady () {
    return this.contentState === lt.READY || this.hasEmptyContent;
  }

  /**
   * Determines if the tile has available content to render.  `true` if the tile's
   * content is ready or if it has expired content this renders while new content loads; otherwise,
   */
  get contentAvailable () {
    return !!(this.contentReady && this.hasRenderContent || this._expiredContent && !this.contentFailed);
  }

  /** Returns true if tile has renderable content but it's unloaded */
  get hasUnloadedContent () {
    return this.hasRenderContent && this.contentUnloaded;
  }

  /**
   * Determines if the tile's content has not be requested. `true` if tile's
   * content has not be requested; otherwise, `false`.
   */
  get contentUnloaded () {
    return this.contentState === lt.UNLOADED;
  }

  /**
   * Determines if the tile's content is expired. `true` if tile's
   * content is expired; otherwise, `false`.
   */
  get contentExpired () {
    return this.contentState === lt.EXPIRED;
  }

  // Determines if the tile's content failed to load.  `true` if the tile's
  // content failed to load; otherwise, `false`.
  get contentFailed () {
    return this.contentState === lt.FAILED;
  }

  /**
   * Distance from the tile's bounding volume center to the camera
   */
  get distanceToCamera () {
    return this._distanceToCamera;
  }

  /**
   * Screen space error for LOD selection
   */
  get screenSpaceError () {
    return this._screenSpaceError;
  }

  /**
   * Get bounding box in cartographic coordinates
   * @returns [min, max] each in [longitude, latitude, altitude]
   */
  get boundingBox () {
    return this._boundingBox || (this._boundingBox = uB(this.header.boundingVolume, this.boundingVolume)), this._boundingBox;
  }

  /** Get the tile's screen space error. */
  getScreenSpaceError (t, n) {
    switch (this.tileset.type) {
      case At.I3S:
        return Lc(this, t);
      case At.TILES3D:
        return AB(this, t, n);
      default:
        throw new Error('Unsupported tileset type');
    }
  }

  /**
   * Make tile unselected than means it won't be shown
   * but it can be still loaded in memory
   */
  unselect () {
    this._selectedFrame = 0;
  }

  /**
   * Memory usage of tile on GPU
   */
  _getGpuMemoryUsageInBytes () {
    return this.content.gpuMemoryUsageInBytes || this.content.byteLength || 0;
  }

  /*
   * If skipLevelOfDetail is off try to load child tiles as soon as possible so that their parent can refine sooner.
   * Tiles are prioritized by screen space error.
   */
  // eslint-disable-next-line complexity
  _getPriority () {
    const t = this.tileset._traverser; const { skipLevelOfDetail: n } = t.options; const s = this.refine === Ht.ADD || n;
    if (s && !this.isVisible && this._visible !== void 0 || this.tileset._frameNumber - this._touchedFrame >= 1 || this.contentState === lt.UNLOADED) { return -1; }
    const r = this.parent; const o = r && (!s || this._screenSpaceError === 0 || r.hasTilesetContent) ? r._screenSpaceError : this._screenSpaceError; const a = t.root ? t.root._screenSpaceError : 0;
    return Math.max(a - o, 0);
  }

  /**
   *  Requests the tile's content.
   * The request may not be made if the Request Scheduler can't prioritize it.
   */
  // eslint-disable-next-line max-statements, complexity
  async loadContent () {
    if (this.hasEmptyContent) { return !1; }
    if (this.content) { return !0; }
    this.contentExpired && (this._expireDate = null), this.contentState = lt.LOADING;
    const n = await this.tileset._requestScheduler.scheduleRequest(this.id, this._getPriority.bind(this));
    if (!n) { return this.contentState = lt.UNLOADED, !1; }
    try {
      const s = this.tileset.getTileUrl(this.contentUrl); const r = this.tileset.loader; const i = {
        ...this.tileset.loadOptions,
        [r.id]: {
          // @ts-expect-error
          ...this.tileset.loadOptions[r.id],
          isTileset: this.type === 'json',
          ...this._getLoaderSpecificOptions(r.id)
        }
      };
      return this.content = await Ae(s, r, i), this.tileset.options.contentLoader && await this.tileset.options.contentLoader(this), this._isTileset() && this.tileset._initializeTileHeaders(this.content, this), this.contentState = lt.READY, this._onContentLoaded(), !0;
    } catch (s) {
      throw this.contentState = lt.FAILED, s;
    } finally {
      n.done();
    }
  }

  // Unloads the tile's content.
  unloadContent () {
    return this.content && this.content.destroy && this.content.destroy(), this.content = null, this.header.content && this.header.content.destroy && this.header.content.destroy(), this.header.content = null, this.contentState = lt.UNLOADED, !0;
  }

  /**
   * Update the tile's visibility
   * @param {Object} frameState - frame state for tile culling
   * @param {string[]} viewportIds - a list of viewport ids that show this tile
   * @return {void}
   */
  updateVisibility (t, n) {
    if (this._frameNumber === t.frameNumber) { return; }
    const s = this.parent; const r = s ? s._visibilityPlaneMask : dt.MASK_INDETERMINATE;
    if (this.tileset._traverser.options.updateTransforms) {
      const i = s ? s.computedTransform : this.tileset.modelMatrix;
      this._updateTransform(i);
    }
    this._distanceToCamera = this.distanceToTile(t), this._screenSpaceError = this.getScreenSpaceError(t, !1), this._visibilityPlaneMask = this.visibility(t, r), this._visible = this._visibilityPlaneMask !== dt.MASK_OUTSIDE, this._inRequestVolume = this.insideViewerRequestVolume(t), this._frameNumber = t.frameNumber, this.viewportIds = n;
  }

  // Determines whether the tile's bounding volume intersects the culling volume.
  // @param {FrameState} frameState The frame state.
  // @param {Number} parentVisibilityPlaneMask The parent's plane mask to speed up the visibility check.
  // @returns {Number} A plane mask as described above in {@link CullingVolume#computeVisibilityWithPlaneMask}.
  visibility (t, n) {
    const { cullingVolume: s } = t; const { boundingVolume: r } = this;
    return s.computeVisibilityWithPlaneMask(r, n);
  }

  // Assuming the tile's bounding volume intersects the culling volume, determines
  // whether the tile's content's bounding volume intersects the culling volume.
  // @param {FrameState} frameState The frame state.
  // @returns {Intersect} The result of the intersection: the tile's content is completely outside, completely inside, or intersecting the culling volume.
  contentVisibility () {
    return !0;
  }

  /**
   * Computes the (potentially approximate) distance from the closest point of the tile's bounding volume to the camera.
   * @param frameState The frame state.
   * @returns {Number} The distance, in meters, or zero if the camera is inside the bounding volume.
   */
  distanceToTile (t) {
    const n = this.boundingVolume;
    return Math.sqrt(Math.max(n.distanceSquaredTo(t.camera.position), 0));
  }

  /**
   * Computes the tile's camera-space z-depth.
   * @param frameState The frame state.
   * @returns The distance, in meters.
   */
  cameraSpaceZDepth ({ camera: t }) {
    const n = this.boundingVolume;
    return vo.subVectors(n.center, t.position), t.direction.dot(vo);
  }

  /**
   * Checks if the camera is inside the viewer request volume.
   * @param {FrameState} frameState The frame state.
   * @returns {Boolean} Whether the camera is inside the volume.
   */
  insideViewerRequestVolume (t) {
    const n = this._viewerRequestVolume;
    return !n || n.distanceSquaredTo(t.camera.position) <= 0;
  }

  // TODO Cesium specific
  // Update whether the tile has expired.
  updateExpiration () {
    if (EB(this._expireDate) && this.contentReady && !this.hasEmptyContent) {
      const t = Date.now();
      Date.lessThan(this._expireDate, t) && (this.contentState = lt.EXPIRED, this._expiredContent = this.content);
    }
  }

  get extras () {
    return this.header.extras;
  }

  // INTERNAL METHODS
  _initializeLodMetric (t) {
    'lodMetricType' in t ? this.lodMetricType = t.lodMetricType : (this.lodMetricType = this.parent && this.parent.lodMetricType || this.tileset.lodMetricType, console.warn('3D Tile: Required prop lodMetricType is undefined. Using parent lodMetricType')), 'lodMetricValue' in t ? this.lodMetricValue = t.lodMetricValue : (this.lodMetricValue = this.parent && this.parent.lodMetricValue || this.tileset.lodMetricValue, console.warn('3D Tile: Required prop lodMetricValue is undefined. Using parent lodMetricValue'));
  }

  _initializeTransforms (t) {
    this.transform = t.transform ? new V(t.transform) : new V();
    const n = this.parent; const s = this.tileset; const r = n && n.computedTransform ? n.computedTransform.clone() : s.modelMatrix.clone();
    this.computedTransform = new V(r).multiplyRight(this.transform);
    const i = n && n._initialTransform ? n._initialTransform.clone() : new V();
    this._initialTransform = new V(i).multiplyRight(this.transform);
  }

  _initializeBoundingVolumes (t) {
    this._contentBoundingVolume = null, this._viewerRequestVolume = null, this._updateBoundingVolume(t);
  }

  _initializeContent (t) {
    this.content = { _tileset: this.tileset, _tile: this }, this.hasEmptyContent = !0, this.contentState = lt.UNLOADED, this.hasTilesetContent = !1, t.contentUrl && (this.content = null, this.hasEmptyContent = !1);
  }

  // TODO - remove anything not related to basic visibility detection
  _initializeRenderingState (t) {
    this.depth = t.level || (this.parent ? this.parent.depth + 1 : 0), this._shouldRefine = !1, this._distanceToCamera = 0, this._centerZDepth = 0, this._screenSpaceError = 0, this._visibilityPlaneMask = dt.MASK_INDETERMINATE, this._visible = void 0, this._inRequestVolume = !1, this._stackLength = 0, this._selectionDepth = 0, this._frameNumber = 0, this._touchedFrame = 0, this._visitedFrame = 0, this._selectedFrame = 0, this._requestedFrame = 0, this._priority = 0;
  }

  _getRefine (t) {
    return t || this.parent && this.parent.refine || Ht.REPLACE;
  }

  _isTileset () {
    return this.contentUrl.indexOf('.json') !== -1;
  }

  _onContentLoaded () {
    switch (this.content && this.content.type) {
      case 'vctr':
      case 'geom':
        this.tileset._traverser.disableSkipLevelOfDetail = !0;
        break;
    }
    this._isTileset() ? this.hasTilesetContent = !0 : this.gpuMemoryUsageInBytes = this._getGpuMemoryUsageInBytes();
  }

  _updateBoundingVolume (t) {
    this.boundingVolume = Os(t.boundingVolume, this.computedTransform, this.boundingVolume);
    const n = t.content;
    n && (n.boundingVolume && (this._contentBoundingVolume = Os(n.boundingVolume, this.computedTransform, this._contentBoundingVolume)), t.viewerRequestVolume && (this._viewerRequestVolume = Os(t.viewerRequestVolume, this.computedTransform, this._viewerRequestVolume)));
  }

  // Update the tile's transform. The transform is applied to the tile's bounding volumes.
  _updateTransform (t = new V()) {
    const n = t.clone().multiplyRight(this.transform);
    n.equals(this.computedTransform) || (this.computedTransform = n, this._updateBoundingVolume(this.header));
  }

  // Get options which are applicable only for the particular loader
  _getLoaderSpecificOptions (t) {
    switch (t) {
      case 'i3s':
        return {
          ...this.tileset.options.i3s,
          _tileOptions: {
            attributeUrls: this.header.attributeUrls,
            textureUrl: this.header.textureUrl,
            textureFormat: this.header.textureFormat,
            textureLoaderOptions: this.header.textureLoaderOptions,
            materialDefinition: this.header.materialDefinition,
            isDracoGeometry: this.header.isDracoGeometry,
            mbs: this.header.mbs
          },
          _tilesetOptions: {
            store: this.tileset.tileset.store,
            attributeStorageInfo: this.tileset.tileset.attributeStorageInfo,
            fields: this.tileset.tileset.fields
          },
          isTileHeader: !1
        };
      case '3d-tiles':
      case 'cesium-ion':
      default:
        return BB(this.tileset.tileset);
    }
  }
}
class TB extends ts {
  compareDistanceToCamera (t, n) {
    return n._distanceToCamera === 0 && t._distanceToCamera === 0 ? n._centerZDepth - t._centerZDepth : n._distanceToCamera - t._distanceToCamera;
  }

  updateTileVisibility (t, n) {
    if (super.updateTileVisibility(t, n), !t.isVisibleAndInRequestVolume) { return; }
    const s = t.children.length > 0;
    if (t.hasTilesetContent && s) {
      const o = t.children[0];
      this.updateTileVisibility(o, n), t._visible = o._visible;
      return;
    }
    if (this.meetsScreenSpaceErrorEarly(t, n)) {
      t._visible = !1;
      return;
    }
    const r = t.refine === Ht.REPLACE; const i = t._optimChildrenWithinParent === oB.USE_OPTIMIZATION;
    if (r && i && s && !this.anyChildrenVisible(t, n)) {
      t._visible = !1;
    }
  }

  meetsScreenSpaceErrorEarly (t, n) {
    const { parent: s } = t;
    return !s || s.hasTilesetContent || s.refine !== Ht.ADD ? !1 : !this.shouldRefine(t, n, !0);
  }
}
class bB {
  constructor () {
    p(this, 'frameNumberMap', /* @__PURE__ */ new Map());
  }

  /**
   * Register a new pending tile header for the particular frameNumber
   * @param viewportId
   * @param frameNumber
   */
  register (t, n) {
    const s = this.frameNumberMap.get(t) || /* @__PURE__ */ new Map(); const r = s.get(n) || 0;
    s.set(n, r + 1), this.frameNumberMap.set(t, s);
  }

  /**
   * Deregister a pending tile header for the particular frameNumber
   * @param viewportId
   * @param frameNumber
   */
  deregister (t, n) {
    const s = this.frameNumberMap.get(t);
    if (!s) { return; }
    const r = s.get(n) || 1;
    s.set(n, r - 1);
  }

  /**
   * Check is there are no pending tile headers registered for the particular frameNumber
   * @param viewportId
   * @param frameNumber
   * @returns
   */
  isZero (t, n) {
    let r;
    return (((r = this.frameNumberMap.get(t)) == null ? void 0 : r.get(n)) || 0) === 0;
  }
}
const Ls = {
  REQUESTED: 'REQUESTED',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR'
};
class _B {
  constructor () {
    p(this, '_statusMap');
    p(this, 'pendingTilesRegister', new bB());
    this._statusMap = {};
  }

  /**
   * Add request to map
   * @param request - node metadata request
   * @param key - unique key
   * @param callback - callback after request completed
   * @param frameState - frameState data
   */
  add (t, n, s, r) {
    if (!this._statusMap[n]) {
      const { frameNumber: i, viewport: { id: o } } = r;
      this._statusMap[n] = { request: t, callback: s, key: n, frameState: r, status: Ls.REQUESTED }, this.pendingTilesRegister.register(o, i), t().then((a) => {
        this._statusMap[n].status = Ls.COMPLETED;
        const { frameNumber: c, viewport: { id: u } } = this._statusMap[n].frameState;
        this.pendingTilesRegister.deregister(u, c), this._statusMap[n].callback(a, r);
      }).catch((a) => {
        this._statusMap[n].status = Ls.ERROR;
        const { frameNumber: c, viewport: { id: u } } = this._statusMap[n].frameState;
        this.pendingTilesRegister.deregister(u, c), s(a);
      });
    }
  }

  /**
   * Update request if it is still actual for the new frameState
   * @param key - unique key
   * @param frameState - frameState data
   */
  update (t, n) {
    if (this._statusMap[t]) {
      const { frameNumber: s, viewport: { id: r } } = this._statusMap[t].frameState;
      this.pendingTilesRegister.deregister(r, s);
      const { frameNumber: i, viewport: { id: o } } = n;
      this.pendingTilesRegister.register(o, i), this._statusMap[t].frameState = n;
    }
  }

  /**
   * Find request in the map
   * @param key - unique key
   * @returns
   */
  find (t) {
    return this._statusMap[t];
  }

  /**
   * Check it there are pending tile headers for the particular frameNumber
   * @param viewportId
   * @param frameNumber
   * @returns
   */
  hasPendingTiles (t, n) {
    return !this.pendingTilesRegister.isZero(t, n);
  }
}
class wB extends ts {
  constructor (n) {
    super(n);
    p(this, '_tileManager');
    this._tileManager = new _B();
  }

  /**
   * Check if there are no penging tile header requests,
   * that means the traversal is finished and we can call
   * following-up callbacks.
   */
  traversalFinished (n) {
    return !this._tileManager.hasPendingTiles(n.viewport.id, this._frameNumber || 0);
  }

  shouldRefine (n, s) {
    return n._lodJudge = yB(n, s), n._lodJudge === 'DIG';
  }

  updateChildTiles (n, s) {
    const r = n.header.children || []; const i = n.children; const o = n.tileset;
    for (const a of r) {
      const c = `${a.id}-${s.viewport.id}`; const u = i && i.find((l) => l.id === c);
      if (u) { u && this.updateTile(u, s); } else {
        let l = () => this._loadTile(a.id, o);
        this._tileManager.find(c) ? this._tileManager.update(c, s) : (o.tileset.nodePages && (l = () => o.tileset.nodePagesTile.formTileFromNodePages(a.id)), this._tileManager.add(l, c, (f) => this._onTileLoad(f, n, c), s));
      }
    }
    return !1;
  }

  async _loadTile (n, s) {
    const { loader: r } = s; const i = s.getTileUrl(`${s.url}/nodes/${n}`); const o = {
      ...s.loadOptions,
      i3s: {
        ...s.loadOptions.i3s,
        isTileHeader: !0
      }
    };
    return await Ae(i, r, o);
  }

  /**
   * The callback to init Tile3D instance after loading the tile JSON
   * @param {Object} header - the tile JSON from a dataset
   * @param {Tile3D} tile - the parent Tile3D instance
   * @param {string} extendedId - optional ID to separate copies of a tile for different viewports.
   *                              const extendedId = `${tile.id}-${frameState.viewport.id}`;
   * @return {void}
   */
  _onTileLoad (n, s, r) {
    const i = new ur(s.tileset, n, s, r);
    s.children.push(i);
    const o = this._tileManager.find(i.id).frameState;
    this.updateTile(i, o), this._frameNumber === o.frameNumber && (this.traversalFinished(o) || (/* @__PURE__ */ new Date()).getTime() - this.lastUpdate > this.updateDebounceTime) && this.executeTraversal(i, o);
  }
}
const RB = {
  description: '',
  ellipsoid: J.WGS84,
  modelMatrix: new V(),
  throttleRequests: !0,
  maxRequests: 64,
  /** Default memory values optimized for viewing mesh-based 3D Tiles on both mobile and desktop devices */
  maximumMemoryUsage: 32,
  memoryCacheOverflow: 1,
  maximumTilesSelected: 0,
  debounceTime: 0,
  onTileLoad: () => {
  },
  onTileUnload: () => {
  },
  onTileError: () => {
  },
  onTraversalComplete: (e) => e,
  contentLoader: void 0,
  viewDistanceScale: 1,
  maximumScreenSpaceError: 8,
  memoryAdjustedScreenSpaceError: !1,
  loadTiles: !0,
  updateTransforms: !0,
  viewportTraversersMap: null,
  loadOptions: { fetch: {} },
  attributions: [],
  basePath: '',
  i3s: {}
}; const Cn = 'Tiles In Tileset(s)'; const Ps = 'Tiles In Memory'; const Oo = 'Tiles In View'; const Fo = 'Tiles To Render'; const Do = 'Tiles Loaded'; const Gs = 'Tiles Loading'; const Lo = 'Tiles Unloaded'; const Po = 'Failed Tile Loads'; const Go = 'Points/Vertices'; const Ns = 'Tile Memory Use'; const No = 'Maximum Screen Space Error';
class MB {
  /**
   * Create a new Tileset3D
   * @param json
   * @param props
   */
  // eslint-disable-next-line max-statements
  constructor (t, n) {
    // props: Tileset3DProps;
    p(this, 'options');
    p(this, 'loadOptions');
    p(this, 'type');
    p(this, 'tileset');
    p(this, 'loader');
    p(this, 'url');
    p(this, 'basePath');
    p(this, 'modelMatrix');
    p(this, 'ellipsoid');
    p(this, 'lodMetricType');
    p(this, 'lodMetricValue');
    p(this, 'refine');
    p(this, 'root', null);
    p(this, 'roots', {});
    /** @todo any->unknown */
    p(this, 'asset', {});
    // Metadata for the entire tileset
    p(this, 'description', '');
    p(this, 'properties');
    p(this, 'extras', null);
    p(this, 'attributions', {});
    p(this, 'credits', {});
    p(this, 'stats');
    /** flags that contain information about data types in nested tiles */
    p(this, 'contentFormats', { draco: !1, meshopt: !1, dds: !1, ktx2: !1 });
    // view props
    p(this, 'cartographicCenter', null);
    p(this, 'cartesianCenter', null);
    p(this, 'zoom', 1);
    p(this, 'boundingVolume', null);
    /** Updated based on the camera position and direction */
    p(this, 'dynamicScreenSpaceErrorComputedDensity', 0);
    // METRICS
    /**
     * The maximum amount of GPU memory (in MB) that may be used to cache tiles
     * Tiles not in view are unloaded to enforce private
     */
    p(this, 'maximumMemoryUsage', 32);
    /** The total amount of GPU memory in bytes used by the tileset. */
    p(this, 'gpuMemoryUsageInBytes', 0);
    /**
     * If loading the level of detail required by maximumScreenSpaceError
     * results in the memory usage exceeding maximumMemoryUsage (GPU), level of detail refinement
     * will instead use this (larger) adjusted screen space error to achieve the
     * best possible visual quality within the available memory.
     */
    p(this, 'memoryAdjustedScreenSpaceError', 0);
    p(this, '_cacheBytes', 0);
    p(this, '_cacheOverflowBytes', 0);
    /** Update tracker. increase in each update cycle. */
    p(this, '_frameNumber', 0);
    p(this, '_queryParams', {});
    p(this, '_extensionsUsed', []);
    p(this, '_tiles', {});
    /** counter for tracking tiles requests */
    p(this, '_pendingCount', 0);
    /** Hold traversal results */
    p(this, 'selectedTiles', []);
    // TRAVERSAL
    p(this, 'traverseCounter', 0);
    p(this, 'geometricError', 0);
    p(this, 'lastUpdatedVieports', null);
    p(this, '_requestedTiles', []);
    p(this, '_emptyTiles', []);
    p(this, 'frameStateData', {});
    p(this, '_traverser');
    p(this, '_cache', new qy());
    p(this, '_requestScheduler');
    // Promise tracking
    p(this, 'updatePromise', null);
    p(this, 'tilesetInitializationPromise');
    this.options = { ...RB, ...n }, this.tileset = t, this.loader = t.loader, this.type = t.type, this.url = t.url, this.basePath = t.basePath || Wy(this.url), this.modelMatrix = this.options.modelMatrix, this.ellipsoid = this.options.ellipsoid, this.lodMetricType = t.lodMetricType, this.lodMetricValue = t.lodMetricValue, this.refine = t.root.refine, this.loadOptions = this.options.loadOptions || {}, this._traverser = this._initializeTraverser(), this._requestScheduler = new zy({
      throttleRequests: this.options.throttleRequests,
      maxRequests: this.options.maxRequests
    }), this.memoryAdjustedScreenSpaceError = this.options.maximumScreenSpaceError, this._cacheBytes = this.options.maximumMemoryUsage * 1024 * 1024, this._cacheOverflowBytes = this.options.memoryCacheOverflow * 1024 * 1024, this.stats = new $o({ id: this.url }), this._initializeStats(), this.tilesetInitializationPromise = this._initializeTileSet(t);
  }

  /** Release resources */
  destroy () {
    this._destroy();
  }

  /** Is the tileset loaded (update needs to have been called at least once) */
  isLoaded () {
    return this._pendingCount === 0 && this._frameNumber !== 0 && this._requestedTiles.length === 0;
  }

  get tiles () {
    return Object.values(this._tiles);
  }

  get frameNumber () {
    return this._frameNumber;
  }

  get queryParams () {
    return new URLSearchParams(this._queryParams).toString();
  }

  setProps (t) {
    this.options = { ...this.options, ...t };
  }

  /** @deprecated */
  // setOptions(options: Tileset3DProps): void {
  //   this.options = {...this.options, ...options};
  // }
  /**
   * Return a loadable tile url for a specific tile subpath
   * @param tilePath a tile subpath
   */
  getTileUrl (t) {
    if (t.startsWith('data:')) { return t; }
    let s = t;
    return this.queryParams.length && (s = `${t}${t.includes('?') ? '&' : '?'}${this.queryParams}`), s;
  }

  // TODO CESIUM specific
  hasExtension (t) {
    return this._extensionsUsed.indexOf(t) > -1;
  }

  /**
   * Update visible tiles relying on a list of viewports
   * @param viewports - list of viewports
   * @deprecated
   */
  update (t = null) {
    this.tilesetInitializationPromise.then(() => {
      !t && this.lastUpdatedVieports ? t = this.lastUpdatedVieports : this.lastUpdatedVieports = t, t && this.doUpdate(t);
    });
  }

  /**
   * Update visible tiles relying on a list of viewports.
   * Do it with debounce delay to prevent update spam
   * @param viewports viewports
   * @returns Promise of new frameNumber
   */
  async selectTiles (t = null) {
    return await this.tilesetInitializationPromise, t && (this.lastUpdatedVieports = t), this.updatePromise || (this.updatePromise = new Promise((n) => {
      setTimeout(() => {
        this.lastUpdatedVieports && this.doUpdate(this.lastUpdatedVieports), n(this._frameNumber), this.updatePromise = null;
      }, this.options.debounceTime);
    })), this.updatePromise;
  }

  adjustScreenSpaceError () {
    this.gpuMemoryUsageInBytes < this._cacheBytes ? this.memoryAdjustedScreenSpaceError = Math.max(this.memoryAdjustedScreenSpaceError / 1.02, this.options.maximumScreenSpaceError) : this.gpuMemoryUsageInBytes > this._cacheBytes + this._cacheOverflowBytes && (this.memoryAdjustedScreenSpaceError *= 1.02);
  }

  /**
   * Update visible tiles relying on a list of viewports
   * @param viewports viewports
   */
  // eslint-disable-next-line max-statements, complexity
  doUpdate (t) {
    if ('loadTiles' in this.options && !this.options.loadTiles || this.traverseCounter > 0) { return; }
    const n = t instanceof Array ? t : [t];
    this._cache.reset(), this._frameNumber++, this.traverseCounter = n.length;
    const s = [];
    for (const r of n) {
      const i = r.id;
      this._needTraverse(i) ? s.push(i) : this.traverseCounter--;
    }
    for (const r of n) {
      const i = r.id;
      if (this.roots[i] || (this.roots[i] = this._initializeTileHeaders(this.tileset, null)), !s.includes(i)) { continue; }
      const o = $y(r, this._frameNumber);
      this._traverser.traverse(this.roots[i], o, this.options);
    }
  }

  /**
   * Check if traversal is needed for particular viewport
   * @param {string} viewportId - id of a viewport
   * @return {boolean}
   */
  _needTraverse (t) {
    let n = t;
    return this.options.viewportTraversersMap && (n = this.options.viewportTraversersMap[t]), n === t;
  }

  /**
   * The callback to post-process tiles after traversal procedure
   * @param frameState - frame state for tile culling
   */
  _onTraversalEnd (t) {
    const n = t.viewport.id;
    this.frameStateData[n] || (this.frameStateData[n] = { selectedTiles: [], _requestedTiles: [], _emptyTiles: [] });
    const s = this.frameStateData[n]; const r = Object.values(this._traverser.selectedTiles); const [i, o] = Zy(r, t, this.options.maximumTilesSelected);
    s.selectedTiles = i;
    for (const a of o) { a.unselect(); }
    s._requestedTiles = Object.values(this._traverser.requestedTiles), s._emptyTiles = Object.values(this._traverser.emptyTiles), this.traverseCounter--, !(this.traverseCounter > 0) && this._updateTiles();
  }

  /**
   * Update tiles relying on data from all traversers
   */
  _updateTiles () {
    this.selectedTiles = [], this._requestedTiles = [], this._emptyTiles = [];
    for (const t in this.frameStateData) {
      const n = this.frameStateData[t];
      this.selectedTiles = this.selectedTiles.concat(n.selectedTiles), this._requestedTiles = this._requestedTiles.concat(n._requestedTiles), this._emptyTiles = this._emptyTiles.concat(n._emptyTiles);
    }
    this.selectedTiles = this.options.onTraversalComplete(this.selectedTiles);
    for (const t of this.selectedTiles) { this._tiles[t.id] = t; }
    this._loadTiles(), this._unloadTiles(), this._updateStats();
  }

  _tilesChanged (t, n) {
    if (t.length !== n.length) { return !0; }
    const s = new Set(t.map((o) => o.id)); const r = new Set(n.map((o) => o.id));
    let i = t.filter((o) => !r.has(o.id)).length > 0;
    return i = i || n.filter((o) => !s.has(o.id)).length > 0, i;
  }

  _loadTiles () {
    for (const t of this._requestedTiles) { t.contentUnloaded && this._loadTile(t); }
  }

  _unloadTiles () {
    this._cache.unloadTiles(this, (t, n) => t._unloadTile(n));
  }

  _updateStats () {
    let t = 0; let n = 0;
    for (const s of this.selectedTiles) { s.contentAvailable && s.content && (t++, s.content.pointCount ? n += s.content.pointCount : n += s.content.vertexCount); }
    this.stats.get(Oo).count = this.selectedTiles.length, this.stats.get(Fo).count = t, this.stats.get(Go).count = n, this.stats.get(No).count = this.memoryAdjustedScreenSpaceError;
  }

  async _initializeTileSet (t) {
    this.type === At.I3S && (this.calculateViewPropsI3S(), t.root = await t.root), this.root = this._initializeTileHeaders(t, null), this.type === At.TILES3D && (this._initializeTiles3DTileset(t), this.calculateViewPropsTiles3D()), this.type === At.I3S && this._initializeI3STileset();
  }

  /**
   * Called during initialize Tileset to initialize the tileset's cartographic center (longitude, latitude) and zoom.
   * These metrics help apps center view on tileset
   * For I3S there is extent (<1.8 version) or fullExtent (>=1.8 version) to calculate view props
   * @returns
   */
  calculateViewPropsI3S () {
    let s;
    const t = this.tileset.fullExtent;
    if (t) {
      const { xmin: r, xmax: i, ymin: o, ymax: a, zmin: c, zmax: u } = t;
      this.cartographicCenter = new A(r + (i - r) / 2, o + (a - o) / 2, c + (u - c) / 2), this.cartesianCenter = new A(), J.WGS84.cartographicToCartesian(this.cartographicCenter, this.cartesianCenter), this.zoom = xc(t, this.cartographicCenter, this.cartesianCenter);
      return;
    }
    const n = (s = this.tileset.store) == null ? void 0 : s.extent;
    if (n) {
      const [r, i, o, a] = n;
      this.cartographicCenter = new A(r + (o - r) / 2, i + (a - i) / 2, 0), this.cartesianCenter = new A(), J.WGS84.cartographicToCartesian(this.cartographicCenter, this.cartesianCenter), this.zoom = rB(n, this.cartographicCenter, this.cartesianCenter);
      return;
    }
    console.warn('Extent is not defined in the tileset header'), this.cartographicCenter = new A(), this.zoom = 1;
  }

  /**
   * Called during initialize Tileset to initialize the tileset's cartographic center (longitude, latitude) and zoom.
   * These metrics help apps center view on tileset.
   * For 3DTiles the root tile data is used to calculate view props.
   * @returns
   */
  calculateViewPropsTiles3D () {
    const t = this.root; const { center: n } = t.boundingVolume;
    if (!n) {
      console.warn('center was not pre-calculated for the root tile'), this.cartographicCenter = new A(), this.zoom = 1;
      return;
    }
    n[0] !== 0 || n[1] !== 0 || n[2] !== 0 ? (this.cartographicCenter = new A(), J.WGS84.cartesianToCartographic(n, this.cartographicCenter)) : this.cartographicCenter = new A(0, 0, -J.WGS84.radii[0]), this.cartesianCenter = n, this.zoom = sB(t.boundingVolume, this.cartographicCenter);
  }

  _initializeStats () {
    this.stats.get(Cn), this.stats.get(Gs), this.stats.get(Ps), this.stats.get(Oo), this.stats.get(Fo), this.stats.get(Do), this.stats.get(Lo), this.stats.get(Po), this.stats.get(Go), this.stats.get(Ns, 'memory'), this.stats.get(No);
  }

  // Installs the main tileset JSON file or a tileset JSON file referenced from a tile.
  // eslint-disable-next-line max-statements
  _initializeTileHeaders (t, n) {
    let r;
    const s = new ur(this, t.root, n);
    if (n && (n.children.push(s), s.depth = n.depth + 1), this.type === At.TILES3D) {
      const i = [];
      for (i.push(s); i.length > 0;) {
        const o = i.pop();
        this.stats.get(Cn).incrementCount();
        const a = o.header.children || [];
        for (const c of a) {
          const u = new ur(this, c, o);
          if ((r = u.contentUrl) != null && r.includes('?session=')) {
            const h = new URL(u.contentUrl).searchParams.get('session');
            h && (this._queryParams.session = h);
          }
          o.children.push(u), u.depth = o.depth + 1, i.push(u);
        }
      }
    }
    return s;
  }

  _initializeTraverser () {
    let t;
    switch (this.type) {
      case At.TILES3D:
        t = TB;
        break;
      case At.I3S:
        t = wB;
        break;
      default:
        t = ts;
    }
    return new t({
      basePath: this.basePath,
      onTraversalEnd: this._onTraversalEnd.bind(this)
    });
  }

  _destroyTileHeaders (t) {
    this._destroySubtree(t);
  }

  async _loadTile (t) {
    let n;
    try {
      this._onStartTileLoading(), n = await t.loadContent();
    } catch (s) {
      this._onTileLoadError(t, s instanceof Error ? s : new Error('load failed'));
    } finally {
      this._onEndTileLoading(), this._onTileLoad(t, n);
    }
  }

  _onTileLoadError (t, n) {
    this.stats.get(Po).incrementCount();
    const s = n.message || n.toString(); const r = t.url;
    console.error(`A 3D tile failed to load: ${t.url} ${s}`), this.options.onTileError(t, s, r);
  }

  _onTileLoad (t, n) {
    let s, r;
    if (n) {
      if (this.type === At.I3S) {
        const i = ((r = (s = this.tileset) == null ? void 0 : s.nodePagesTile) == null ? void 0 : r.nodesInNodePages) || 0;
        this.stats.get(Cn).reset(), this.stats.get(Cn).addCount(i);
      }
      t && t.content && Yy(t, t.content), this.updateContentTypes(t), this._addTileToCache(t), this.options.onTileLoad(t);
    }
  }

  /**
   * Update information about data types in nested tiles
   * @param tile instance of a nested Tile3D
   */
  updateContentTypes (t) {
    let n;
    if (this.type === At.I3S) {
      switch (t.header.isDracoGeometry && (this.contentFormats.draco = !0), t.header.textureFormat) {
        case 'dds':
          this.contentFormats.dds = !0;
          break;
        case 'ktx2':
          this.contentFormats.ktx2 = !0;
          break;
      }
    } else if (this.type === At.TILES3D) {
      const { extensionsRemoved: s = [] } = ((n = t.content) == null ? void 0 : n.gltf) || {};
      s.includes('KHR_draco_mesh_compression') && (this.contentFormats.draco = !0), s.includes('EXT_meshopt_compression') && (this.contentFormats.meshopt = !0), s.includes('KHR_texture_basisu') && (this.contentFormats.ktx2 = !0);
    }
  }

  _onStartTileLoading () {
    this._pendingCount++, this.stats.get(Gs).incrementCount();
  }

  _onEndTileLoading () {
    this._pendingCount--, this.stats.get(Gs).decrementCount();
  }

  _addTileToCache (t) {
    this._cache.add(this, t, (n) => n._updateCacheStats(t));
  }

  _updateCacheStats (t) {
    this.stats.get(Do).incrementCount(), this.stats.get(Ps).incrementCount(), this.gpuMemoryUsageInBytes += t.gpuMemoryUsageInBytes || 0, this.stats.get(Ns).count = this.gpuMemoryUsageInBytes, this.options.memoryAdjustedScreenSpaceError && this.adjustScreenSpaceError();
  }

  _unloadTile (t) {
    this.gpuMemoryUsageInBytes -= t.gpuMemoryUsageInBytes || 0, this.stats.get(Ps).decrementCount(), this.stats.get(Lo).incrementCount(), this.stats.get(Ns).count = this.gpuMemoryUsageInBytes, this.options.onTileUnload(t), t.unloadContent();
  }

  // Traverse the tree and destroy all tiles
  _destroy () {
    const t = [];
    for (this.root && t.push(this.root); t.length > 0;) {
      const n = t.pop();
      for (const s of n.children) { t.push(s); }
      this._destroyTile(n);
    }
    this.root = null;
  }

  // Traverse the tree and destroy all sub tiles
  _destroySubtree (t) {
    const n = t; const s = [];
    for (s.push(n); s.length > 0;) {
      t = s.pop();
      for (const r of t.children) { s.push(r); }
      t !== n && this._destroyTile(t);
    }
    n.children = [];
  }

  _destroyTile (t) {
    this._cache.unloadTile(this, t), this._unloadTile(t), t.destroy();
  }

  _initializeTiles3DTileset (t) {
    if (t.queryString) {
      const n = new URLSearchParams(t.queryString); const s = Object.fromEntries(n.entries());
      this._queryParams = { ...this._queryParams, ...s };
    }
    if (this.asset = t.asset, !this.asset) { throw new Error('Tileset must have an asset property.'); }
    if (this.asset.version !== '0.0' && this.asset.version !== '1.0' && this.asset.version !== '1.1') { throw new Error('The tileset must be 3D Tiles version either 0.0 or 1.0 or 1.1.'); }
    'tilesetVersion' in this.asset && (this._queryParams.v = this.asset.tilesetVersion), this.credits = {
      attributions: this.options.attributions || []
    }, this.description = this.options.description || '', this.properties = t.properties, this.geometricError = t.geometricError, this._extensionsUsed = t.extensionsUsed || [], this.extras = t.extras;
  }

  _initializeI3STileset () {
    this.loadOptions.i3s && 'token' in this.loadOptions.i3s && (this._queryParams.token = this.loadOptions.i3s.token);
  }
}
function SB (e) {
  let t = 0;
  for (const s in e.attributes) {
    const r = e.getAttribute(s);
    t += r.count * r.itemSize * r.array.BYTES_PER_ELEMENT;
  }
  const n = e.getIndex();
  return t += n ? n.count * n.itemSize * n.array.BYTES_PER_ELEMENT : 0, t;
}
function Pc (e) {
  const n = document.createElement('canvas');
  n.width = 64, n.height = 64;
  const s = n.getContext('2d');
  s.rect(0, 0, 64, 64);
  const r = s.createLinearGradient(0, 0, 64, 64);
  for (let o = 0; o < e.length; o++) {
    const a = e[o];
    r.addColorStop(a[0], '#' + a[1].getHexString());
  }
  s.fillStyle = r, s.fill();
  const i = new Kc(n);
  return i.needsUpdate = !0, i.minFilter = zc, i.wrapS = kr, i.wrapT = kr, i.repeat.set(2, 2), i;
}
function Uo (e) {
  e.updateMatrix(), e.updateMatrixWorld(), e.matrixWorldInverse.copy(e.matrixWorld).invert();
  const t = new Wc();
  return t.setFromProjectionMatrix(new tt().multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse)), t;
}
function IB (e) {
  const t = new En(); const n = new Xc(10, 5); const s = new rt(...e.projectPointOntoPlane([0, 0, 0])); const r = new rt(e.normal.x, e.normal.y, e.normal.z); const i = new rt().copy(s).add(r);
  n.lookAt(i), n.translate(s.x, s.y, s.z);
  const o = new Hs({ color: 65535, side: jo }); const a = new Js(n, o); const c = new Qc(r, s, 5, 16776960);
  return t.add(c), t.add(a), t;
}
function Ho (e) {
  const { boundingVolume: t } = e;
  let n = 0;
  e.content && (n = Math.min(e.content.byteLength / 5e5, 1));
  const s = new w(n, 1, 0); const r = new qc(1, 1, 1); const i = new tt();
  t.halfAxes ? i.copy(Gc(t.halfAxes)) : t.radius && r.scale(t.radius * 2, t.radius * 2, t.radius * 2), r.applyMatrix4(i);
  const o = new Yc(r); const a = new $c(o, new Zc({ color: s }));
  return a.position.copy(new rt(...t.center)), a;
}
function Gc (e) {
  const t = e;
  return new tt().fromArray([
    t[0] * 2,
    t[1] * 2,
    t[2] * 2,
    0,
    t[3] * 2,
    t[4] * 2,
    t[5] * 2,
    0,
    t[6] * 2,
    t[7] * 2,
    t[8] * 2,
    0,
    0,
    0,
    0,
    1
  ]);
}
function xB (e, t) {
  const r = 2 * Math.PI * 6378137 / 2; const i = t * r / 180;
  let o = Math.log(Math.tan((90 + e) * Math.PI / 360)) / (Math.PI / 180);
  return o = o * r / 180, new ko(i, o);
}
function vB (e) {
  let t = 0;
  if ((e == null ? void 0 : e.userData.mimeType) == 'image/ktx2' && e.mipmaps) {
    for (let n = 0; n < e.mipmaps.length; n++) { t += e.mipmaps[n].data.byteLength; }
    return t;
  } else if (e.image) {
    const { image: n } = e; const s = 4;
    const r = [n.width, n.height];
    for (; r[0] > 1 || r[1] > 1;) { t += r[0] * r[1] * s, r[0] = Math.max(Math.floor(r[0] / 2), 1), r[1] = Math.max(Math.floor(r[1] / 2), 1); }
    return t += 1 * 1 * s, t;
  } else {}
}
function Nc (e) {
  return SB(e);
}
let ht = null; let Mt = null; let Jn = null; let Mn = null;
const Jo = {
  minHeight: 0,
  maxHeight: 300,
  samples: 4,
  sampleStep: 4,
  opacity: 0.5,
  blendingType: hr
};
function OB (e, t, n, s = Jo) {
  ht && ht.dispose(), Mt || (Mt = n);
  const r = { ...Jo, ...s };
  ht = new tu(e.width * e.devicePixelRatio, e.height * e.devicePixelRatio), ht.texture.minFilter = Kr, ht.texture.magFilter = Kr, ht.stencilBuffer = !1, ht.texture.format = eu, ht.texture.type = nu, Mt.setPixelRatio(devicePixelRatio), Mt.setSize(e.width, e.height), Mt.setRenderTarget(ht), Jn = new su(), Jn.overrideMaterial = LB, Mn = t, kt.uniforms.tPosition.value = ht.texture, kt.uniforms.minHeight.value = r.minHeight, kt.uniforms.maxHeight.value = r.maxHeight, kt.uniforms.samples.value = r.samples, kt.uniforms.sampleStep.value = r.sampleStep, kt.uniforms.opacity.value = r.opacity, kt.blending = r.blendingType;
}
function FB (e) {
  ht.setSize(e.width * e.devicePixelRatio, e.height * e.devicePixelRatio), Mt.setPixelRatio(devicePixelRatio), Mt.setSize(e.width, e.height);
}
function DB (e) {
  if (Mt) {
    const t = Mn.parent;
    Jn.add(Mn), Mt.setRenderTarget(ht), Mt.render(Jn, e), t && t.add(Mn), Mt.setRenderTarget(null);
  }
}
const Vn = (e) => e.toString(); const LB = new lr({
  vertexShader: Vn`
        varying vec3 vPosition;
        void main() {
            vPosition =  (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
  fragmentShader: Vn`
        varying vec3 vPosition;
        void main() {
            gl_FragColor = vec4(vPosition, 1.0);
        }
    `,
  side: jo
}); const PB = Vn`
    #include <packing>

    varying vec2 vUv;
    varying vec3 vColor;
    uniform sampler2D tPosition;
    uniform float minHeight;
    uniform float maxHeight;
    uniform int samples;
    uniform float sampleStep;

    mat4 MVP;

    // Convert to normalized screen coordinates
    vec4 toNSC(const in vec4 v) {
        return vec4(0.5 * (v.xyz / v.w) + 0.5, v.w);
    }
    vec4 vertexDraping(
        const in sampler2D positionTex, // Position G-Buffer
        const in vec4 Vin // Vertex to drape
    ) {
        float texSize = float(textureSize(positionTex, 0).x);
        float pixelSize = 1.0 / texSize;
        vec2 stepSize = vec2(sampleStep/texSize);
        vec4 VinWorld = modelMatrix * Vin;

        vec4 lineStart = projectionMatrix * viewMatrix * vec4(VinWorld.x, minHeight, VinWorld.z, 1.0);
        vec4 lineEnd = projectionMatrix * viewMatrix * vec4(VinWorld.x, maxHeight, VinWorld.z, 1.0);

        vec4 Vout = VinWorld;

        // Binary search for line-terrain intersection
        float first = 0.0, last = 1.0;
        while(first <= last) {
            // Compute mid-point
            float mid = first + (last-first) / 2.0;
            // Compute texture coordinates along line
            vec4 texCoords = toNSC(mix(lineStart, lineEnd, mid));
            vec4 texSample = vec4(0.0); // Sample terrain
            for(int s = -samples; s < samples; s++) {
                for(int t = -samples; t < samples; t++) {
                    texSample += texture(positionTex,
                    texCoords.st + vec2(s,t) * stepSize);
                }
            }
            // Smooth samples obtain from G-Buffer
            texSample = texSample / (float(samples) * float(samples) * 4.0);
            float terrainHeight = texSample.y;
            Vout.y = terrainHeight;
           
            if((last-first) < pixelSize) { // Termination criteria
                return Vout;
            }
            // Perform intersection test
            float depthScene = toNSC(projectionMatrix * viewMatrix * Vout).y;
            if(depthScene >= texCoords.y) {
                first = mid;
            }
            else
                last = mid;
        }
        return Vout;
    }

    void main() {
        vColor = color;
        vUv = uv;
        MVP = projectionMatrix * modelViewMatrix;
        vec4 inputVertex = vec4(position, 1.0);
        vec4 outputVertex = vertexDraping(tPosition, inputVertex);
        vec4 finalPosition = projectionMatrix * viewMatrix * outputVertex;
        gl_Position = finalPosition;
    }
`; const GB = Vn`
    varying vec3 vColor;
    uniform float opacity;

    void main() {
        gl_FragColor = vec4(vColor, opacity);
    }
`; const kt = new lr({
  vertexShader: PB,
  fragmentShader: GB,
  uniforms: {
    tPosition: { value: null },
    minHeight: { value: 0 },
    maxHeight: { value: 300 },
    opacity: { value: 0.5 },
    samples: { value: 4 },
    sampleStep: { value: 4 }
  },
  vertexColors: !0,
  transparent: !0,
  depthTest: !1,
  blending: hr
}); const Uc = {
  // From chroma spectral http://gka.github.io/chroma.js/
  SPECTRAL: [
    [0, new w(0.3686, 0.3098, 0.6353)],
    [0.1, new w(0.1961, 0.5333, 0.7412)],
    [0.2, new w(0.4, 0.7608, 0.6471)],
    [0.3, new w(0.6706, 0.8667, 0.6431)],
    [0.4, new w(0.902, 0.9608, 0.5961)],
    [0.5, new w(1, 1, 0.749)],
    [0.6, new w(0.9961, 0.8784, 0.5451)],
    [0.7, new w(0.9922, 0.6824, 0.3804)],
    [0.8, new w(0.9569, 0.4275, 0.2627)],
    [0.9, new w(0.8353, 0.2431, 0.3098)],
    [1, new w(0.6196, 39e-4, 0.2588)]
  ],
  PLASMA: [
    [0, new w(0.241, 0.015, 0.61)],
    [0.1, new w(0.387, 1e-3, 0.654)],
    [0.2, new w(0.524, 0.025, 0.653)],
    [0.3, new w(0.651, 0.125, 0.596)],
    [0.4, new w(0.752, 0.227, 0.513)],
    [0.5, new w(0.837, 0.329, 0.431)],
    [0.6, new w(0.907, 0.435, 0.353)],
    [0.7, new w(0.963, 0.554, 0.272)],
    [0.8, new w(0.992, 0.681, 0.195)],
    [0.9, new w(0.987, 0.822, 0.144)],
    [1, new w(0.94, 0.975, 0.131)]
  ],
  YELLOW_GREEN: [
    [0, new w(0.1647, 0.2824, 0.3451)],
    [0.1, new w(0.1338, 0.3555, 0.4227)],
    [0.2, new w(0.061, 0.4319, 0.4864)],
    [0.3, new w(0, 0.5099, 0.5319)],
    [0.4, new w(0, 0.5881, 0.5569)],
    [0.5, new w(0.137, 0.665, 0.5614)],
    [0.6, new w(0.2906, 0.7395, 0.5477)],
    [0.7, new w(0.4453, 0.8099, 0.5201)],
    [0.8, new w(0.6102, 0.8748, 0.485)],
    [0.9, new w(0.7883, 0.9323, 0.4514)],
    [1, new w(0.9804, 0.9804, 0.4314)]
  ],
  VIRIDIS: [
    [0, new w(0.267, 5e-3, 0.329)],
    [0.1, new w(0.283, 0.141, 0.458)],
    [0.2, new w(0.254, 0.265, 0.53)],
    [0.3, new w(0.207, 0.372, 0.553)],
    [0.4, new w(0.164, 0.471, 0.558)],
    [0.5, new w(0.128, 0.567, 0.551)],
    [0.6, new w(0.135, 0.659, 0.518)],
    [0.7, new w(0.267, 0.749, 0.441)],
    [0.8, new w(0.478, 0.821, 0.318)],
    [0.9, new w(0.741, 0.873, 0.15)],
    [1, new w(0.993, 0.906, 0.144)]
  ],
  INFERNO: [
    [0, new w(0.077, 0.042, 0.206)],
    [0.1, new w(0.225, 0.036, 0.388)],
    [0.2, new w(0.373, 0.074, 0.432)],
    [0.3, new w(0.522, 0.128, 0.42)],
    [0.4, new w(0.665, 0.182, 0.37)],
    [0.5, new w(0.797, 0.255, 0.287)],
    [0.6, new w(0.902, 0.364, 0.184)],
    [0.7, new w(0.969, 0.516, 0.063)],
    [0.8, new w(0.988, 0.683, 0.072)],
    [0.9, new w(0.961, 0.859, 0.298)],
    [1, new w(0.988, 0.998, 0.645)]
  ],
  GRAYSCALE: [
    [0, new w(0, 0, 0)],
    [1, new w(1, 1, 1)]
  ],
  // 16 samples of the TURBU color scheme
  // values taken from: https://gist.github.com/mikhailov-work/ee72ba4191942acecc03fe6da94fc73f
  // original file licensed under Apache-2.0
  TURBO: [
    [0, new w(0.18995, 0.07176, 0.23217)],
    [0.07, new w(0.25107, 0.25237, 0.63374)],
    [0.13, new w(0.27628, 0.42118, 0.89123)],
    [0.2, new w(0.25862, 0.57958, 0.99876)],
    [0.27, new w(0.15844, 0.73551, 0.92305)],
    [0.33, new w(0.09267, 0.86554, 0.7623)],
    [0.4, new w(0.19659, 0.94901, 0.59466)],
    [0.47, new w(0.42778, 0.99419, 0.38575)],
    [0.53, new w(0.64362, 0.98999, 0.23356)],
    [0.6, new w(0.80473, 0.92452, 0.20459)],
    [0.67, new w(0.93301, 0.81236, 0.22667)],
    [0.73, new w(0.99314, 0.67408, 0.20348)],
    [0.8, new w(0.9836, 0.49291, 0.12849)],
    [0.87, new w(0.92105, 0.31489, 0.05475)],
    [0.93, new w(0.81608, 0.18462, 0.01809)],
    [1, new w(0.66449, 0.08436, 424e-5)]
  ],
  RAINBOW: [
    [0, new w(0.278, 0, 0.714)],
    [1 / 6, new w(0, 0, 1)],
    [2 / 6, new w(0, 1, 1)],
    [3 / 6, new w(0, 1, 0)],
    [4 / 6, new w(1, 1, 0)],
    [5 / 6, new w(1, 0.64, 0)],
    [1, new w(1, 0, 0)]
  ],
  CONTOUR: [
    [0, new w(0, 0, 0)],
    [0.03, new w(0, 0, 0)],
    [0.04, new w(1, 1, 1)],
    [1, new w(1, 1, 1)]
  ]
}; const NB = `
  varying vec3 vColor;
  uniform float alpha;

  void main() {
    if (vColor == vec3(0.0, 0.0, 0.0)) {
      discard;
    } else {
      gl_FragColor = vec4( vColor, alpha);
    }
  }
`; const UB = `
  varying vec3 vColor;
  uniform sampler2D gradient;
  uniform sampler2D grayscale;
  attribute float intensity;
  attribute float classification;
  uniform vec3 rootCenter;
  uniform vec3 rootNormal;
  uniform vec2 elevationRange;
  uniform int coloring;
  uniform bool hideGround;
  uniform float maxIntensity;
  uniform float intensityContrast;
  uniform float pointSize;

  #ifdef USE_COLOR
  vec3 getRGB() {
      vec3 rgb = color;
      return rgb;
  }
  #endif

  vec3 getElevation(){
    vec4 world = modelMatrix * vec4( position, 1.0 );
    float diff = abs(dot(rootNormal, (vec3(world) - rootCenter)));
    float w = max(diff - elevationRange.x,0.0) / max(elevationRange.y - elevationRange.x,1.0);
    vec3 cElevation = texture2D(gradient, vec2(w,1.0-w)).rgb;

    return cElevation;
  }

  vec3 getIntensity(){
    // TODO: real contrast enhancement. Check https://github.com/yuki-koyama/enhancer/blob/master/shaders/enhancer.fs
    float intmod = pow(intensity, intensityContrast);
    vec3 cIntensity = texture2D(grayscale, vec2(intmod / maxIntensity ,1.0-(intmod / maxIntensity))).rgb;
    return cIntensity;
  }

  vec3 getClassification(){
    float classNormalized = classification / 255.0;
    vec3 cClassification = texture2D(gradient, vec2(classNormalized * 5.0,1.0-classNormalized * 5.0)).rgb;
    return cClassification;
  }

  vec3 getColor(){
      vec3 color;
      if (hideGround && classification == 2.0) {
         return vec3(0.0, 0.0, 0.0);               
      }

      if (coloring == 1) {
        color = getIntensity();
      }
      else if (coloring == 2) {
        color = getClassification();
      } else if (coloring == 3) {
        color = getElevation();
      } 
      #ifdef USE_COLOR
      else if (coloring == 4) {
        color = getRGB();
      }
      #endif
      else {
        color = vec3(1.0, 1.0, 1.0);
      }
      return color;
  }

  void main() {
      vColor = getColor();

      gl_PointSize = pointSize;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;
var Hc = /* @__PURE__ */ ((e) => (e[e.Intensity = 1] = 'Intensity', e[e.Classification = 2] = 'Classification', e[e.Elevation = 3] = 'Elevation', e[e.RGB = 4] = 'RGB', e[e.White = 5] = 'White', e))(Hc || {}); var jn = /* @__PURE__ */ ((e) => (e[e.FlatTexture = 1] = 'FlatTexture', e[e.ShadedTexture = 2] = 'ShadedTexture', e[e.ShadedNoTexture = 3] = 'ShadedNoTexture', e))(jn || {});
const HB = Uc.RAINBOW; const JB = typeof document < 'u' ? Pc(HB) : null; const VB = Uc.GRAYSCALE; const jB = typeof document < 'u' ? Pc(VB) : null; const kB = {
  throttleRequests: !0,
  maxRequests: 64,
  updateInterval: 0.1,
  maxConcurrency: 1,
  maximumScreenSpaceError: 16,
  memoryAdjustedScreenSpaceError: !0,
  maximumMemoryUsage: 400,
  memoryCacheOverflow: 128,
  viewDistanceScale: 1,
  skipLevelOfDetail: !1,
  resetTransform: !1,
  updateTransforms: !0,
  shading: jn.FlatTexture,
  transparent: !1,
  pointCloudColoring: Hc.White,
  pointSize: 1,
  worker: !0,
  wireframe: !1,
  debug: !1,
  gltfLoader: null,
  basisTranscoderPath: null,
  dracoDecoderPath: null,
  material: null,
  contentPostProcess: void 0,
  preloadTilesCount: null,
  collectAttributions: !1
};
class t1 {
  /**
  * Loads a tileset of 3D Tiles according to the given {@link LoaderProps}
  * @public
  *
  * @param props - Properties for this load call {@link LoaderProps}.
  * @returns An object containing the 3D Model to be added to the scene
  * and a runtime engine to be updated every frame.
  */
  static async load (t) {
    const n = { ...kB, ...t.options }; const { url: s } = t;
    let { viewport: r, renderer: i } = t;
    const o = n.updateInterval; const a = 5; const c = {};
    if (n.cesiumIONToken) {
      c['cesium-ion'] = {
        accessToken: n.cesiumIONToken
      };
      const T = await bc.preload(s, c);
      c.fetch = { headers: T.headers };
    }
    n.googleApiKey && (c.fetch = { headers: { 'X-GOOG-API-KEY': n.googleApiKey } }, t.options.hasOwnProperty('collectAttributions') || (n.collectAttributions = !0)), t.loadingManager && t.loadingManager.itemStart(s);
    const u = await Ae(s, Le, {
      ...c
    }); const l = {}; const h = {}; const f = []; const d = new En(); const m = new En();
    n.debug || (m.visible = !1);
    const g = {
      pointSize: { type: 'f', value: n.pointSize },
      gradient: { type: 't', value: JB },
      grayscale: { type: 't', value: jB },
      rootCenter: { type: 'vec3', value: new rt() },
      rootNormal: { type: 'vec3', value: new rt() },
      coloring: { type: 'i', value: n.pointCloudColoring },
      hideGround: { type: 'b', value: !0 },
      elevationRange: { type: 'vec2', value: new ko(0, 400) },
      maxIntensity: { type: 'f', value: 1 },
      intensityContrast: { type: 'f', value: 1 },
      alpha: { type: 'f', value: 1 }
    }; const y = new lr({
      uniforms: g,
      vertexShader: UB,
      fragmentShader: NB,
      transparent: n.transparent,
      vertexColors: !0
    });
    let E, R, B;
    n.gltfLoader ? E = n.gltfLoader : (E = new cu(), n.basisTranscoderPath && (R = new lu(), R.detectSupport(i ?? new ru()), R.setTranscoderPath(n.basisTranscoderPath + '/'), R.setWorkerLimit(1), E.setKTX2Loader(R)), n.dracoDecoderPath && (B = new uu(), B.setDecoderPath(n.dracoDecoderPath + '/'), B.setWorkerLimit(n.maxConcurrency), E.setDRACOLoader(B)));
    const C = new Hs({ transparent: n.transparent }); const M = {
      maximumMemoryUsage: n.maximumMemoryUsage,
      maximumScreenSpaceError: n.maximumScreenSpaceError,
      memoryAdjustedScreenSpaceError: n.memoryAdjustedScreenSpaceError,
      memoryCacheOverflow: n.memoryCacheOverflow,
      viewDistanceScale: n.viewDistanceScale,
      skipLevelOfDetail: n.skipLevelOfDetail,
      updateTransforms: n.updateTransforms,
      throttleRequests: n.throttleRequests,
      maxRequests: n.maxRequests,
      contentLoader: async (T) => {
        let D = null;
        switch (T.type) {
          case Pe.POINTCLOUD: {
            D = zB(T, y, n, Pt);
            break;
          }
          case Pe.SCENEGRAPH:
          case Pe.MESH: {
            D = await KB(E, T, C, n, Pt);
            break;
          }
        }
        if (D && (D.visible = !1, l[T.id] = D, d.add(l[T.id]), n.debug)) {
          const Z = Ho(T);
          m.add(Z), h[T.id] = Z;
        }
      },
      onTileLoad: async (T) => {
        b && (n.resetTransform && !L && (T == null ? void 0 : T.depth) <= a && Xt(T), Wt = !0);
      },
      onTileUnload: (T) => {
        f.push(T);
      },
      onTileError: (T, D) => {
        console.warn('Tile error', T.id, D);
      },
      onTraversalComplete (T) {
        return n.collectAttributions && (k = XB(T)), T;
      }
    }; const b = new MB(u, {
      ...M,
      loadOptions: {
        ...c,
        maxConcurrency: n.maxConcurrency,
        worker: n.worker,
        gltf: {
          loadImages: !1
        },
        '3d-tiles': {
          loadGLTF: !1
        }
      }
    }); const O = new tt(); const F = new tt(); const v = new rt();
    let L = !1; let k = '';
    if (b.root.boundingVolume
      ? (b.root.header.boundingVolume.region && console.warn('Cannot apply a model matrix to bounding volumes of type region. Tileset stays in original geo-coordinates.'), F.setPosition(
          b.root.boundingVolume.center[0],
          b.root.boundingVolume.center[1],
          b.root.boundingVolume.center[2]
        ))
      : console.warn('Bounding volume not found, no transformations applied'), n.debug) {
      const T = Ho(b.root);
      m.add(T), h[b.root.id] = T;
    }
    let q = !1; let Y = !1;
    g.rootCenter.value.copy(v), g.rootNormal.value.copy(new rt(0, 0, 1).normalize()), b.stats.get('Loader concurrency').count = n.maxConcurrency, b.stats.get('Maximum mem usage').count = n.maximumMemoryUsage;
    let P = 0; let ct = null; let Wt = !0; let oe = null;
    const Be = new rt(1 / 0, 1 / 0, 1 / 0);
    let vt = null;
    d.updateMatrixWorld(!0);
    const st = new tt().copy(d.matrixWorld); const Pt = new tt().copy(st).invert();
    n.resetTransform && Xt(b.root), n.debug && (h[b.root.id].applyMatrix4(O), m.matrixWorld.copy(d.matrixWorld));
    function Xt (T) {
      if (!T.boundingVolume.halfAxes) { return; }
      const D = T.boundingVolume.halfAxes; const Z = new tt().extractRotation(Gc(D)).premultiply(new tt().extractRotation(Pt));
      if (!new rs().setFromRotationMatrix(Z).equals(new rs())) {
        L = !0;
        const _t = new rt(
          F.elements[12],
          F.elements[13],
          F.elements[14]
        );
        F.extractRotation(Z), F.setPosition(_t);
      }
      Ce();
    }
    function Ce () {
      O.copy(st), n.resetTransform && O.multiply(new tt().copy(F).invert()), b.modelMatrix = new V(O.toArray());
    }
    function $e (T, D, Z, Q) {
      if (q || !Q) { return; }
      if (!vt) {
        if (Q instanceof Wo) {
          vt = new Dn({
            fov: Q.fov / 180 * Math.PI,
            aspectRatio: Q.aspect,
            near: Q.near,
            far: Q.far
          }).sseDenominator;
        } else if (Q instanceof iu) {
          const K = Q.right - Q.left; const jr = Q.top - Q.bottom; const Vc = K / jr;
          vt = Math.max(jr / Z.height, K / (Z.height * Vc));
        }
        n.debug && console.log('Updated sse denonimator:', vt);
      }
      const ns = Uo(Q).planes.map((K) => new nt(K.normal.toArray(), K.constant)); const Jc = new dt(ns); const Jr = {
        camera: {
          position: Be.toArray()
        },
        height: Z.height * Z.devicePixelRatio,
        frameNumber: T._frameNumber,
        sseDenominator: vt,
        cullingVolume: Jc,
        viewport: {
          id: 0
        }
      };
      T._cache.reset(), T._traverser.traverse(T.root, Jr, T.options);
      for (const K of T.tiles) { K.selected ? D[K.id] ? D[K.id].visible = !0 : console.error('TILE SELECTED BUT NOT LOADED!!', K.id) : D[K.id] && (D[K.id].visible = !1); }
      for (; f.length > 0;) {
        const K = f.pop();
        D[K.id] && K.contentState == lt.UNLOADED && (d.remove(D[K.id]), Us(D[K.id]), delete D[K.id]), h[K.id] && (Us(h[K.id]), m.remove(h[K.id]), delete h[K.id]);
      }
      const ss = T.stats.get('Tiles Loaded').count; const Vr = T.stats.get('Tiles Loading').count;
      return t.onProgress && t.onProgress(
        ss,
        ss + Vr
      ), t.loadingManager && !Y && Vr == 0 && (n.preloadTilesCount == null || ss >= n.preloadTilesCount) && (Y = !0, t.loadingManager.itemEnd(t.url)), Jr;
    }
    function es (T) {
      const D = new rt(); const Z = new ou(); const Q = new rt();
      T.decompose(D, Z, Q), d.position.copy(D), d.quaternion.copy(Z), d.scale.copy(Q), d.updateMatrix(), d.updateMatrixWorld(!0), st.copy(d.matrixWorld), Pt.copy(st).invert(), Ce();
    }
    return {
      model: d,
      runtime: {
        getTileset: () => b,
        getStats: () => b.stats,
        getDataAttributions: () => k,
        showTiles: (T) => {
          m.visible = T;
        },
        setWireframe: (T) => {
          n.wireframe = T, d.traverse((D) => {
            D instanceof Js && (D.material.wireframe = T);
          });
        },
        setDebug: (T) => {
          n.debug = T, m.visible = T;
        },
        setShading: (T) => {
          n.shading = T;
        },
        getTileBoxes: () => m,
        setViewDistanceScale: (T) => {
          b.options.viewDistanceScale = T, b._frameNumber++, $e(b, l, r, oe);
        },
        setMaximumScreenSpaceError: (T) => {
          b.options.maximumScreenSpaceError = T, b._frameNumber++, $e(b, l, r, oe);
        },
        setHideGround: (T) => {
          g.hideGround.value = T;
        },
        setPointCloudColoring: (T) => {
          g.coloring.value = T;
        },
        setElevationRange: (T) => {
          g.elevationRange.value.set(T[0], T[1]);
        },
        setMaxIntensity: (T) => {
          g.maxIntensity.value = T;
        },
        setIntensityContrast: (T) => {
          g.intensityContrast.value = T;
        },
        setPointAlpha: (T) => {
          g.alpha.value = T;
        },
        getLatLongHeightFromPosition: (T) => {
          const D = b.ellipsoid.cartesianToCartographic(
            new rt().copy(T).applyMatrix4(new tt().copy(O).invert()).toArray()
          );
          return {
            lat: D[1],
            long: D[0],
            height: D[2]
          };
        },
        getPositionFromLatLongHeight: (T) => {
          const D = b.ellipsoid.cartographicToCartesian([
            T.long,
            T.lat,
            T.height
          ]);
          return new rt(...D).applyMatrix4(O);
        },
        orientToGeocoord: (T) => {
          const D = [T.long, T.lat, T.height]; const Z = b.ellipsoid.cartographicToCartesian(D); const Q = new tt().fromArray(b.ellipsoid.eastNorthUpToFixedFrame(Z)); const _t = new tt().makeRotationFromEuler(
            new rs(Math.PI / 2, Math.PI / 2, 0)
          ); const ns = new tt().copy(Q).multiply(_t).invert();
          es(ns);
        },
        getWebMercatorCoord: (T) => xB(T.lat, T.long),
        getCameraFrustum: (T) => {
          const Z = Uo(T).planes.map((_t) => new nt(_t.normal.toArray(), _t.constant)).map((_t) => IB(_t)); const Q = new En();
          for (const _t of Z) { Q.add(_t); }
          return Q;
        },
        overlayGeoJSON: (T, D) => {
          if (T.applyMatrix4(O), T.updateMatrixWorld(), !i) { throw new Error('GeoJSON draping requires a renderer reference via LoaderProps'); }
          return OB(r, d, i, D), T.material.dispose(), T.material = kt, T;
        },
        setViewport: (T) => {
          r = T, vt = null, Wt = !0, ht && FB(r);
        },
        setRenderer: (T) => {
          i = T;
        },
        update: function (T, D) {
          if (oe = D, P += T, ht && DB(D), b && P >= o) {
            if (!st.equals(d.matrixWorld)) {
              P = 0, st.copy(d.matrixWorld), n.updateTransforms && Ce();
              const Z = new rt().setFromMatrixPosition(st);
              g.rootCenter.value.copy(Z), g.rootNormal.value.copy(new rt(0, 0, 1).applyMatrix4(st).normalize()), Pt.copy(st).invert(), n.debug && (h[b.root.id].matrixWorld.copy(O), h[b.root.id].applyMatrix4(st));
            }
            ct == null ? ct = new tt().copy(D.matrixWorld) : (Wt || WB(D, ct)) && (P = 0, Wt = !1, b._frameNumber++, D.getWorldPosition(Be), ct.copy(D.matrixWorld), $e(b, l, r, D));
          }
        },
        dispose: function () {
          for (q = !0, b._destroy(); d.children.length > 0;) {
            const T = d.children[0];
            Us(T), d.remove(T);
          }
          for (; m.children.length > 0;) {
            const T = m.children[0];
            m.remove(T), T.geometry.dispose(), T.material.dispose();
          }
          R && R.dispose(), B && B.dispose();
        }
      }
    };
  }

  /**
  * Loads a tileset of 3D Tiles according to the given {@link GeoJSONLoaderProps}
  * Could be overlayed on geograpical 3D Tiles using {@link Runtime.overlayGeoJSON}
  * @public
  *
  * @param props - Properties for this load call {@link GeoJSONLoaderProps}.
  * @returns An object containing the 3D Model to be added to the scene
  */
  static async loadGeoJSON (t) {
    const { url: n, height: s, featureToColor: r } = t;
    return Ae(n, ke, { worker: !1, gis: { format: 'binary' } }).then((i) => {
      const o = i; const a = new Ko(); const c = o.polygons.positions.value.reduce((h, f, d, m) => {
        if (d % 2 == 0) {
          const g = [f, m[d + 1], s ?? 0]; const y = J.WGS84.cartographicToCartesian(g);
          h.push(...y);
        }
        return h;
      }, []);
      if (a.setAttribute('position', new Sn(
        c,
        3
      )), r) {
        const h = o.polygons.numericProps[r.feature].value.reduce((f, d, m, g) => {
          const y = r.colorMap(d);
          return f[m * 3] = y.r, f[m * 3 + 1] = y.g, f[m * 3 + 2] = y.b, f;
        }, []);
        a.setAttribute('color', new Sn(
          h,
          3
        ));
      }
      a.setIndex(
        new zo(o.polygons.triangles.value, 1)
      );
      const u = new Hs({
        transparent: !0,
        vertexColors: !0,
        opacity: 0.5,
        blending: hr
      });
      return new Js(a, u);
    });
  }
}
async function KB (e, t, n, s, r) {
  return new Promise((i, o) => {
    const a = new tt().makeRotationAxis(new rt(1, 0, 0), Math.PI / 2); const c = t.content.gltfUpAxis !== 'Z'; const u = new tt().fromArray(t.computedTransform).premultiply(r);
    c && u.multiply(a), t.content.byteLength || (t.content.byteLength = t.content.gltfArrayBuffer.byteLength), e.parse(
      t.content.gltfArrayBuffer,
      t.contentUrl ? t.contentUrl.substr(0, t.contentUrl.lastIndexOf('/') + 1) : null,
      (l) => {
        t.userData.asset = l.asset;
        const h = l.scenes[0];
        h.applyMatrix4(u), t.content.texturesByteLength = 0, t.content.geometriesByteLength = 0, h.traverse((f) => {
          if (f.type == 'Mesh') {
            const d = f;
            t.content.geometriesByteLength += Nc(d.geometry);
            const m = d.material; const g = m.map;
            if (g) {
              const y = vB(g);
              y && (t.content.texturesByteLength += y);
            }
            s.material ? (d.material = s.material.clone(), m.dispose()) : s.shading == jn.FlatTexture && d.material.type !== 'MeshBasicMaterial' && (d.material = n.clone(), m.dispose()), s.shading != jn.ShadedNoTexture ? d.material.type == 'ShaderMaterial' ? d.material.uniforms.map = { value: g } : d.material.map = g : (g && g.dispose(), d.material.map = null), d.material.wireframe = s.wireframe, s.contentPostProcess && s.contentPostProcess(d);
          }
        }), t.content.gpuMemoryUsageInBytes = t.content.texturesByteLength + t.content.geometriesByteLength, i(h);
      },
      (l) => {
        o(new Error(`error parsing gltf in tile ${t.id}: ${l}`));
      }
    );
  });
}
function zB (e, t, n, s) {
  const r = {
    rtc_center: e.content.rtcCenter,
    // eslint-disable-line camelcase
    points: e.content.attributes.positions,
    intensities: e.content.attributes.intensity,
    classifications: e.content.attributes.classification,
    rgb: null,
    rgba: null
  }; const { colors: i } = e.content.attributes;
  i && i.size === 3 && (r.rgb = i.value), i && i.size === 4 && (r.rgba = i.value);
  const o = new Ko();
  o.setAttribute('position', new Sn(r.points, 3));
  const a = new tt().fromArray(e.computedTransform).premultiply(s);
  r.rgba ? o.setAttribute('color', new Sn(r.rgba, 4)) : r.rgb && o.setAttribute('color', new zr(r.rgb, 3, !0)), r.intensities && o.setAttribute(
    'intensity',
    // Handles both 16bit or 8bit intensity values
    new zo(r.intensities, 1, !0)
  ), r.classifications && o.setAttribute('classification', new zr(r.classifications, 1, !1)), e.content.geometriesByteLength = Nc(o), e.content.gpuMemoryUsageInBytes = e.content.geometriesByteLength;
  const c = new au(o, n.material || t);
  if (r.rtc_center) {
    const u = r.rtc_center;
    a.multiply(new tt().makeTranslation(u[0], u[1], u[2]));
  }
  return c.applyMatrix4(a), n.contentPostProcess && n.contentPostProcess(c), c;
}
function Vo (e) {
  let t, n, s, r;
  (t = e == null ? void 0 : e.uniforms) != null && t.map ? (s = (n = e == null ? void 0 : e.uniforms) == null ? void 0 : n.map.value) == null || s.dispose() : e.map && ((r = e.map) == null || r.dispose()), e.dispose();
}
function Us (e) {
  e.traverse((t) => {
    if (t.isMesh) {
      if (t.geometry.dispose(), t.material.isMaterial) { Vo(t.material); } else {
        for (const n of t.material) { Vo(n); }
      }
    }
  });
  for (let t = e.children.length - 1; t >= 0; t--) {
    const n = e.children[t];
    e.remove(n);
  }
}
function WB (e, t, n) {
  const s = !e.matrixWorld.equals(t);
  return e instanceof Wo ? s || e.aspect !== n : s;
}
function XB (e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((r) => {
    let o, a;
    const i = (a = (o = r == null ? void 0 : r.userData) == null ? void 0 : o.asset) == null ? void 0 : a.copyright;
    i && i.split(/;/g).map((u) => u.trim()).forEach((u) => {
      u && t.set(u, (t.get(u) || 0) + 1);
    });
  }), Array.from(t).sort((r, i) => i[1] - r[1]).map(([r]) => r).join('; ');
}
export {
  t1 as Loader3DTiles,
  Hc as PointCloudColoring,
  jn as Shading
};
