(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("three"), require("three/examples/jsm/loaders/GLTFLoader.js"), require("three/examples/jsm/loaders/DRACOLoader.js"), require("three/examples/jsm/loaders/KTX2Loader.js")) : typeof define === "function" && define.amd ? define(["exports", "three", "three/examples/jsm/loaders/GLTFLoader.js", "three/examples/jsm/loaders/DRACOLoader.js", "three/examples/jsm/loaders/KTX2Loader.js"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.ThreeLoader3DTiles = {}, global.THREE, global.THREE, global.THREE, global.THREE));
})(this, function(exports2, three, GLTFLoader_js, DRACOLoader_js, KTX2Loader_js) {
  "use strict";
  async function parseFromContext(data, loaders, options, context) {
    return context._parse(data, loaders, options, context);
  }
  function assert$6(condition, message) {
    if (!condition) {
      throw new Error(message || "loader assertion failed.");
    }
  }
  const isBrowser$2 = Boolean(typeof process !== "object" || String(process) !== "[object process]" || process.browser);
  const matches$1 = typeof process !== "undefined" && process.version && /v([0-9]*)/.exec(process.version);
  matches$1 && parseFloat(matches$1[1]) || 0;
  function mergeLoaderOptions(baseOptions, newOptions) {
    return mergeOptionsRecursively(baseOptions || {}, newOptions);
  }
  function mergeOptionsRecursively(baseOptions, newOptions) {
    let level = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
    if (level > 3) {
      return newOptions;
    }
    const options = {
      ...baseOptions
    };
    for (const [key, newValue] of Object.entries(newOptions)) {
      if (newValue && typeof newValue === "object" && !Array.isArray(newValue)) {
        options[key] = mergeOptionsRecursively(options[key] || {}, newOptions[key], level + 1);
      } else {
        options[key] = newOptions[key];
      }
    }
    return options;
  }
  const NPM_TAG = "latest";
  function getVersion() {
    var _globalThis$_loadersg;
    if (!((_globalThis$_loadersg = globalThis._loadersgl_) !== null && _globalThis$_loadersg !== void 0 && _globalThis$_loadersg.version)) {
      globalThis._loadersgl_ = globalThis._loadersgl_ || {};
      {
        globalThis._loadersgl_.version = "4.1.1";
      }
    }
    return globalThis._loadersgl_.version;
  }
  const VERSION$7 = getVersion();
  function assert$5(condition, message) {
    if (!condition) {
      throw new Error(message || "loaders.gl assertion failed.");
    }
  }
  const isBrowser$1 = typeof process !== "object" || String(process) !== "[object process]" || process.browser;
  const isWorker = typeof importScripts === "function";
  const isMobile = typeof window !== "undefined" && typeof window.orientation !== "undefined";
  const matches = typeof process !== "undefined" && process.version && /v([0-9]*)/.exec(process.version);
  matches && parseFloat(matches[1]) || 0;
  class WorkerJob {
    constructor(jobName, workerThread) {
      this.name = void 0;
      this.workerThread = void 0;
      this.isRunning = true;
      this.result = void 0;
      this._resolve = () => {
      };
      this._reject = () => {
      };
      this.name = jobName;
      this.workerThread = workerThread;
      this.result = new Promise((resolve2, reject) => {
        this._resolve = resolve2;
        this._reject = reject;
      });
    }
    postMessage(type, payload) {
      this.workerThread.postMessage({
        source: "loaders.gl",
        type,
        payload
      });
    }
    done(value) {
      assert$5(this.isRunning);
      this.isRunning = false;
      this._resolve(value);
    }
    error(error) {
      assert$5(this.isRunning);
      this.isRunning = false;
      this._reject(error);
    }
  }
  class NodeWorker {
    terminate() {
    }
  }
  const workerURLCache = /* @__PURE__ */ new Map();
  function getLoadableWorkerURL(props) {
    assert$5(props.source && !props.url || !props.source && props.url);
    let workerURL = workerURLCache.get(props.source || props.url);
    if (!workerURL) {
      if (props.url) {
        workerURL = getLoadableWorkerURLFromURL(props.url);
        workerURLCache.set(props.url, workerURL);
      }
      if (props.source) {
        workerURL = getLoadableWorkerURLFromSource(props.source);
        workerURLCache.set(props.source, workerURL);
      }
    }
    assert$5(workerURL);
    return workerURL;
  }
  function getLoadableWorkerURLFromURL(url) {
    if (!url.startsWith("http")) {
      return url;
    }
    const workerSource = buildScriptSource(url);
    return getLoadableWorkerURLFromSource(workerSource);
  }
  function getLoadableWorkerURLFromSource(workerSource) {
    const blob = new Blob([workerSource], {
      type: "application/javascript"
    });
    return URL.createObjectURL(blob);
  }
  function buildScriptSource(workerUrl) {
    return `try {
  importScripts('${workerUrl}');
} catch (error) {
  console.error(error);
  throw error;
}`;
  }
  function getTransferList(object) {
    let recursive = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    let transfers = arguments.length > 2 ? arguments[2] : void 0;
    const transfersSet = transfers || /* @__PURE__ */ new Set();
    if (!object)
      ;
    else if (isTransferable(object)) {
      transfersSet.add(object);
    } else if (isTransferable(object.buffer)) {
      transfersSet.add(object.buffer);
    } else if (ArrayBuffer.isView(object))
      ;
    else if (recursive && typeof object === "object") {
      for (const key in object) {
        getTransferList(object[key], recursive, transfersSet);
      }
    }
    return transfers === void 0 ? Array.from(transfersSet) : [];
  }
  function isTransferable(object) {
    if (!object) {
      return false;
    }
    if (object instanceof ArrayBuffer) {
      return true;
    }
    if (typeof MessagePort !== "undefined" && object instanceof MessagePort) {
      return true;
    }
    if (typeof ImageBitmap !== "undefined" && object instanceof ImageBitmap) {
      return true;
    }
    if (typeof OffscreenCanvas !== "undefined" && object instanceof OffscreenCanvas) {
      return true;
    }
    return false;
  }
  const NOOP = () => {
  };
  class WorkerThread {
    static isSupported() {
      return typeof Worker !== "undefined" && isBrowser$1 || typeof NodeWorker !== "undefined" && !isBrowser$1;
    }
    constructor(props) {
      this.name = void 0;
      this.source = void 0;
      this.url = void 0;
      this.terminated = false;
      this.worker = void 0;
      this.onMessage = void 0;
      this.onError = void 0;
      this._loadableURL = "";
      const {
        name: name2,
        source,
        url
      } = props;
      assert$5(source || url);
      this.name = name2;
      this.source = source;
      this.url = url;
      this.onMessage = NOOP;
      this.onError = (error) => console.log(error);
      this.worker = isBrowser$1 ? this._createBrowserWorker() : this._createNodeWorker();
    }
    destroy() {
      this.onMessage = NOOP;
      this.onError = NOOP;
      this.worker.terminate();
      this.terminated = true;
    }
    get isRunning() {
      return Boolean(this.onMessage);
    }
    postMessage(data, transferList) {
      transferList = transferList || getTransferList(data);
      this.worker.postMessage(data, transferList);
    }
    _getErrorFromErrorEvent(event) {
      let message = "Failed to load ";
      message += `worker ${this.name} from ${this.url}. `;
      if (event.message) {
        message += `${event.message} in `;
      }
      if (event.lineno) {
        message += `:${event.lineno}:${event.colno}`;
      }
      return new Error(message);
    }
    _createBrowserWorker() {
      this._loadableURL = getLoadableWorkerURL({
        source: this.source,
        url: this.url
      });
      const worker = new Worker(this._loadableURL, {
        name: this.name
      });
      worker.onmessage = (event) => {
        if (!event.data) {
          this.onError(new Error("No data received"));
        } else {
          this.onMessage(event.data);
        }
      };
      worker.onerror = (error) => {
        this.onError(this._getErrorFromErrorEvent(error));
        this.terminated = true;
      };
      worker.onmessageerror = (event) => console.error(event);
      return worker;
    }
    _createNodeWorker() {
      let worker;
      if (this.url) {
        const absolute = this.url.includes(":/") || this.url.startsWith("/");
        const url = absolute ? this.url : `./${this.url}`;
        worker = new NodeWorker(url, {
          eval: false
        });
      } else if (this.source) {
        worker = new NodeWorker(this.source, {
          eval: true
        });
      } else {
        throw new Error("no worker");
      }
      worker.on("message", (data) => {
        this.onMessage(data);
      });
      worker.on("error", (error) => {
        this.onError(error);
      });
      worker.on("exit", (code) => {
      });
      return worker;
    }
  }
  class WorkerPool {
    static isSupported() {
      return WorkerThread.isSupported();
    }
    constructor(props) {
      this.name = "unnamed";
      this.source = void 0;
      this.url = void 0;
      this.maxConcurrency = 1;
      this.maxMobileConcurrency = 1;
      this.onDebug = () => {
      };
      this.reuseWorkers = true;
      this.props = {};
      this.jobQueue = [];
      this.idleQueue = [];
      this.count = 0;
      this.isDestroyed = false;
      this.source = props.source;
      this.url = props.url;
      this.setProps(props);
    }
    destroy() {
      this.idleQueue.forEach((worker) => worker.destroy());
      this.isDestroyed = true;
    }
    setProps(props) {
      this.props = {
        ...this.props,
        ...props
      };
      if (props.name !== void 0) {
        this.name = props.name;
      }
      if (props.maxConcurrency !== void 0) {
        this.maxConcurrency = props.maxConcurrency;
      }
      if (props.maxMobileConcurrency !== void 0) {
        this.maxMobileConcurrency = props.maxMobileConcurrency;
      }
      if (props.reuseWorkers !== void 0) {
        this.reuseWorkers = props.reuseWorkers;
      }
      if (props.onDebug !== void 0) {
        this.onDebug = props.onDebug;
      }
    }
    async startJob(name2) {
      let onMessage2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : (job, type, data) => job.done(data);
      let onError = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : (job, error) => job.error(error);
      const startPromise = new Promise((onStart) => {
        this.jobQueue.push({
          name: name2,
          onMessage: onMessage2,
          onError,
          onStart
        });
        return this;
      });
      this._startQueuedJob();
      return await startPromise;
    }
    async _startQueuedJob() {
      if (!this.jobQueue.length) {
        return;
      }
      const workerThread = this._getAvailableWorker();
      if (!workerThread) {
        return;
      }
      const queuedJob = this.jobQueue.shift();
      if (queuedJob) {
        this.onDebug({
          message: "Starting job",
          name: queuedJob.name,
          workerThread,
          backlog: this.jobQueue.length
        });
        const job = new WorkerJob(queuedJob.name, workerThread);
        workerThread.onMessage = (data) => queuedJob.onMessage(job, data.type, data.payload);
        workerThread.onError = (error) => queuedJob.onError(job, error);
        queuedJob.onStart(job);
        try {
          await job.result;
        } catch (error) {
          console.error(`Worker exception: ${error}`);
        } finally {
          this.returnWorkerToQueue(workerThread);
        }
      }
    }
    returnWorkerToQueue(worker) {
      const shouldDestroyWorker = !isBrowser$1 || this.isDestroyed || !this.reuseWorkers || this.count > this._getMaxConcurrency();
      if (shouldDestroyWorker) {
        worker.destroy();
        this.count--;
      } else {
        this.idleQueue.push(worker);
      }
      if (!this.isDestroyed) {
        this._startQueuedJob();
      }
    }
    _getAvailableWorker() {
      if (this.idleQueue.length > 0) {
        return this.idleQueue.shift() || null;
      }
      if (this.count < this._getMaxConcurrency()) {
        this.count++;
        const name2 = `${this.name.toLowerCase()} (#${this.count} of ${this.maxConcurrency})`;
        return new WorkerThread({
          name: name2,
          source: this.source,
          url: this.url
        });
      }
      return null;
    }
    _getMaxConcurrency() {
      return isMobile ? this.maxMobileConcurrency : this.maxConcurrency;
    }
  }
  const DEFAULT_PROPS$3 = {
    maxConcurrency: 3,
    maxMobileConcurrency: 1,
    reuseWorkers: true,
    onDebug: () => {
    }
  };
  class WorkerFarm {
    static isSupported() {
      return WorkerThread.isSupported();
    }
    static getWorkerFarm() {
      let props = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      WorkerFarm._workerFarm = WorkerFarm._workerFarm || new WorkerFarm({});
      WorkerFarm._workerFarm.setProps(props);
      return WorkerFarm._workerFarm;
    }
    constructor(props) {
      this.props = void 0;
      this.workerPools = /* @__PURE__ */ new Map();
      this.props = {
        ...DEFAULT_PROPS$3
      };
      this.setProps(props);
      this.workerPools = /* @__PURE__ */ new Map();
    }
    destroy() {
      for (const workerPool of this.workerPools.values()) {
        workerPool.destroy();
      }
      this.workerPools = /* @__PURE__ */ new Map();
    }
    setProps(props) {
      this.props = {
        ...this.props,
        ...props
      };
      for (const workerPool of this.workerPools.values()) {
        workerPool.setProps(this._getWorkerPoolProps());
      }
    }
    getWorkerPool(options) {
      const {
        name: name2,
        source,
        url
      } = options;
      let workerPool = this.workerPools.get(name2);
      if (!workerPool) {
        workerPool = new WorkerPool({
          name: name2,
          source,
          url
        });
        workerPool.setProps(this._getWorkerPoolProps());
        this.workerPools.set(name2, workerPool);
      }
      return workerPool;
    }
    _getWorkerPoolProps() {
      return {
        maxConcurrency: this.props.maxConcurrency,
        maxMobileConcurrency: this.props.maxMobileConcurrency,
        reuseWorkers: this.props.reuseWorkers,
        onDebug: this.props.onDebug
      };
    }
  }
  WorkerFarm._workerFarm = void 0;
  function getWorkerURL(worker) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const workerOptions = options[worker.id] || {};
    const workerFile = isBrowser$1 ? `${worker.id}-worker.js` : `${worker.id}-worker-node.js`;
    let url = workerOptions.workerUrl;
    if (!url && worker.id === "compression") {
      url = options.workerUrl;
    }
    if (options._workerType === "test") {
      if (isBrowser$1) {
        url = `modules/${worker.module}/dist/${workerFile}`;
      } else {
        url = `modules/${worker.module}/src/workers/${worker.id}-worker-node.ts`;
      }
    }
    if (!url) {
      let version = worker.version;
      if (version === "latest") {
        version = NPM_TAG;
      }
      const versionTag = version ? `@${version}` : "";
      url = `https://unpkg.com/@loaders.gl/${worker.module}${versionTag}/dist/${workerFile}`;
    }
    assert$5(url);
    return url;
  }
  function validateWorkerVersion(worker) {
    let coreVersion = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : VERSION$7;
    assert$5(worker, "no worker provided");
    const workerVersion = worker.version;
    if (!coreVersion || !workerVersion) {
      return false;
    }
    return true;
  }
  const ChildProcess = {};
  const node = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: ChildProcess
  }, Symbol.toStringTag, { value: "Module" }));
  const loadLibraryPromises = {};
  async function loadLibrary(libraryUrl) {
    let moduleName = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    let libraryName = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
    if (moduleName) {
      libraryUrl = getLibraryUrl(libraryUrl, moduleName, options, libraryName);
    }
    loadLibraryPromises[libraryUrl] = loadLibraryPromises[libraryUrl] || loadLibraryFromFile(libraryUrl);
    return await loadLibraryPromises[libraryUrl];
  }
  function getLibraryUrl(library, moduleName) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    let libraryName = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
    if (!options.useLocalLibraries && library.startsWith("http")) {
      return library;
    }
    libraryName = libraryName || library;
    const modules = options.modules || {};
    if (modules[libraryName]) {
      return modules[libraryName];
    }
    if (!isBrowser$1) {
      return `modules/${moduleName}/dist/libs/${libraryName}`;
    }
    if (options.CDN) {
      assert$5(options.CDN.startsWith("http"));
      return `${options.CDN}/${moduleName}@${VERSION$7}/dist/libs/${libraryName}`;
    }
    if (isWorker) {
      return `../src/libs/${libraryName}`;
    }
    return `modules/${moduleName}/src/libs/${libraryName}`;
  }
  async function loadLibraryFromFile(libraryUrl) {
    if (libraryUrl.endsWith("wasm")) {
      return await loadAsArrayBuffer(libraryUrl);
    }
    if (!isBrowser$1) {
      try {
        return node && void 0;
      } catch (error) {
        console.error(error);
        return null;
      }
    }
    if (isWorker) {
      return importScripts(libraryUrl);
    }
    const scriptSource = await loadAsText(libraryUrl);
    return loadLibraryFromString(scriptSource, libraryUrl);
  }
  function loadLibraryFromString(scriptSource, id) {
    if (!isBrowser$1) {
      return void 0;
    }
    if (isWorker) {
      eval.call(globalThis, scriptSource);
      return null;
    }
    const script = document.createElement("script");
    script.id = id;
    try {
      script.appendChild(document.createTextNode(scriptSource));
    } catch (e) {
      script.text = scriptSource;
    }
    document.body.appendChild(script);
    return null;
  }
  async function loadAsArrayBuffer(url) {
    if (isBrowser$1 || true) {
      const response = await fetch(url);
      return await response.arrayBuffer();
    }
    return await (void 0)(url);
  }
  async function loadAsText(url) {
    if (isBrowser$1 || true) {
      const response = await fetch(url);
      return await response.text();
    }
    return await (void 0)(url);
  }
  function canParseWithWorker(loader, options) {
    if (!WorkerFarm.isSupported()) {
      return false;
    }
    if (!isBrowser$1 && !(options !== null && options !== void 0 && options._nodeWorkers)) {
      return false;
    }
    return loader.worker && (options === null || options === void 0 ? void 0 : options.worker);
  }
  async function parseWithWorker(loader, data, options, context, parseOnMainThread) {
    const name2 = loader.id;
    const url = getWorkerURL(loader, options);
    const workerFarm = WorkerFarm.getWorkerFarm(options);
    const workerPool = workerFarm.getWorkerPool({
      name: name2,
      url
    });
    options = JSON.parse(JSON.stringify(options));
    context = JSON.parse(JSON.stringify(context || {}));
    const job = await workerPool.startJob("process-on-worker", onMessage.bind(null, parseOnMainThread));
    job.postMessage("process", {
      input: data,
      options,
      context
    });
    const result = await job.result;
    return await result.result;
  }
  async function onMessage(parseOnMainThread, job, type, payload) {
    switch (type) {
      case "done":
        job.done(payload);
        break;
      case "error":
        job.error(new Error(payload.error));
        break;
      case "process":
        const {
          id,
          input,
          options
        } = payload;
        try {
          const result = await parseOnMainThread(input, options);
          job.postMessage("done", {
            id,
            result
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "unknown error";
          job.postMessage("error", {
            id,
            error: message
          });
        }
        break;
      default:
        console.warn(`parse-with-worker unknown message ${type}`);
    }
  }
  function getFirstCharacters$1(data) {
    let length2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 5;
    if (typeof data === "string") {
      return data.slice(0, length2);
    } else if (ArrayBuffer.isView(data)) {
      return getMagicString$3(data.buffer, data.byteOffset, length2);
    } else if (data instanceof ArrayBuffer) {
      const byteOffset = 0;
      return getMagicString$3(data, byteOffset, length2);
    }
    return "";
  }
  function getMagicString$3(arrayBuffer, byteOffset, length2) {
    if (arrayBuffer.byteLength <= byteOffset + length2) {
      return "";
    }
    const dataView = new DataView(arrayBuffer);
    let magic = "";
    for (let i2 = 0; i2 < length2; i2++) {
      magic += String.fromCharCode(dataView.getUint8(byteOffset + i2));
    }
    return magic;
  }
  function parseJSON(string) {
    try {
      return JSON.parse(string);
    } catch (_) {
      throw new Error(`Failed to parse JSON from data starting with "${getFirstCharacters$1(string)}"`);
    }
  }
  function compareArrayBuffers(arrayBuffer1, arrayBuffer2, byteLength) {
    byteLength = byteLength || arrayBuffer1.byteLength;
    if (arrayBuffer1.byteLength < byteLength || arrayBuffer2.byteLength < byteLength) {
      return false;
    }
    const array1 = new Uint8Array(arrayBuffer1);
    const array2 = new Uint8Array(arrayBuffer2);
    for (let i2 = 0; i2 < array1.length; ++i2) {
      if (array1[i2] !== array2[i2]) {
        return false;
      }
    }
    return true;
  }
  function concatenateArrayBuffers() {
    for (var _len = arguments.length, sources = new Array(_len), _key = 0; _key < _len; _key++) {
      sources[_key] = arguments[_key];
    }
    return concatenateArrayBuffersFromArray(sources);
  }
  function concatenateArrayBuffersFromArray(sources) {
    const sourceArrays = sources.map((source2) => source2 instanceof ArrayBuffer ? new Uint8Array(source2) : source2);
    const byteLength = sourceArrays.reduce((length2, typedArray) => length2 + typedArray.byteLength, 0);
    const result = new Uint8Array(byteLength);
    let offset = 0;
    for (const sourceArray of sourceArrays) {
      result.set(sourceArray, offset);
      offset += sourceArray.byteLength;
    }
    return result.buffer;
  }
  function sliceArrayBuffer(arrayBuffer, byteOffset, byteLength) {
    const subArray = byteLength !== void 0 ? new Uint8Array(arrayBuffer).subarray(byteOffset, byteOffset + byteLength) : new Uint8Array(arrayBuffer).subarray(byteOffset);
    const arrayCopy = new Uint8Array(subArray);
    return arrayCopy.buffer;
  }
  function padToNBytes(byteLength, padding) {
    assert$6(byteLength >= 0);
    assert$6(padding > 0);
    return byteLength + (padding - 1) & ~(padding - 1);
  }
  function copyToArray(source, target, targetOffset) {
    let sourceArray;
    if (source instanceof ArrayBuffer) {
      sourceArray = new Uint8Array(source);
    } else {
      const srcByteOffset = source.byteOffset;
      const srcByteLength = source.byteLength;
      sourceArray = new Uint8Array(source.buffer || source.arrayBuffer, srcByteOffset, srcByteLength);
    }
    target.set(sourceArray, targetOffset);
    return targetOffset + padToNBytes(sourceArray.byteLength, 4);
  }
  async function concatenateArrayBuffersAsync(asyncIterator) {
    const arrayBuffers = [];
    for await (const chunk of asyncIterator) {
      arrayBuffers.push(chunk);
    }
    return concatenateArrayBuffers(...arrayBuffers);
  }
  function getHiResTimestamp$1() {
    let timestamp;
    if (typeof window !== "undefined" && window.performance) {
      timestamp = window.performance.now();
    } else if (typeof process !== "undefined" && process.hrtime) {
      const timeParts = process.hrtime();
      timestamp = timeParts[0] * 1e3 + timeParts[1] / 1e6;
    } else {
      timestamp = Date.now();
    }
    return timestamp;
  }
  class Stat {
    constructor(name2, type) {
      this.name = void 0;
      this.type = void 0;
      this.sampleSize = 1;
      this.time = 0;
      this.count = 0;
      this.samples = 0;
      this.lastTiming = 0;
      this.lastSampleTime = 0;
      this.lastSampleCount = 0;
      this._count = 0;
      this._time = 0;
      this._samples = 0;
      this._startTime = 0;
      this._timerPending = false;
      this.name = name2;
      this.type = type;
      this.reset();
    }
    reset() {
      this.time = 0;
      this.count = 0;
      this.samples = 0;
      this.lastTiming = 0;
      this.lastSampleTime = 0;
      this.lastSampleCount = 0;
      this._count = 0;
      this._time = 0;
      this._samples = 0;
      this._startTime = 0;
      this._timerPending = false;
      return this;
    }
    setSampleSize(samples) {
      this.sampleSize = samples;
      return this;
    }
    incrementCount() {
      this.addCount(1);
      return this;
    }
    decrementCount() {
      this.subtractCount(1);
      return this;
    }
    addCount(value) {
      this._count += value;
      this._samples++;
      this._checkSampling();
      return this;
    }
    subtractCount(value) {
      this._count -= value;
      this._samples++;
      this._checkSampling();
      return this;
    }
    addTime(time) {
      this._time += time;
      this.lastTiming = time;
      this._samples++;
      this._checkSampling();
      return this;
    }
    timeStart() {
      this._startTime = getHiResTimestamp$1();
      this._timerPending = true;
      return this;
    }
    timeEnd() {
      if (!this._timerPending) {
        return this;
      }
      this.addTime(getHiResTimestamp$1() - this._startTime);
      this._timerPending = false;
      this._checkSampling();
      return this;
    }
    getSampleAverageCount() {
      return this.sampleSize > 0 ? this.lastSampleCount / this.sampleSize : 0;
    }
    getSampleAverageTime() {
      return this.sampleSize > 0 ? this.lastSampleTime / this.sampleSize : 0;
    }
    getSampleHz() {
      return this.lastSampleTime > 0 ? this.sampleSize / (this.lastSampleTime / 1e3) : 0;
    }
    getAverageCount() {
      return this.samples > 0 ? this.count / this.samples : 0;
    }
    getAverageTime() {
      return this.samples > 0 ? this.time / this.samples : 0;
    }
    getHz() {
      return this.time > 0 ? this.samples / (this.time / 1e3) : 0;
    }
    _checkSampling() {
      if (this._samples === this.sampleSize) {
        this.lastSampleTime = this._time;
        this.lastSampleCount = this._count;
        this.count += this._count;
        this.time += this._time;
        this.samples += this._samples;
        this._time = 0;
        this._count = 0;
        this._samples = 0;
      }
    }
  }
  class Stats {
    constructor(options) {
      this.id = void 0;
      this.stats = {};
      this.id = options.id;
      this.stats = {};
      this._initializeStats(options.stats);
      Object.seal(this);
    }
    get(name2) {
      let type = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "count";
      return this._getOrCreate({
        name: name2,
        type
      });
    }
    get size() {
      return Object.keys(this.stats).length;
    }
    reset() {
      for (const stat of Object.values(this.stats)) {
        stat.reset();
      }
      return this;
    }
    forEach(fn) {
      for (const stat of Object.values(this.stats)) {
        fn(stat);
      }
    }
    getTable() {
      const table = {};
      this.forEach((stat) => {
        table[stat.name] = {
          time: stat.time || 0,
          count: stat.count || 0,
          average: stat.getAverageTime() || 0,
          hz: stat.getHz() || 0
        };
      });
      return table;
    }
    _initializeStats() {
      let stats = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
      stats.forEach((stat) => this._getOrCreate(stat));
    }
    _getOrCreate(stat) {
      const {
        name: name2,
        type
      } = stat;
      let result = this.stats[name2];
      if (!result) {
        if (stat instanceof Stat) {
          result = stat;
        } else {
          result = new Stat(name2, type);
        }
        this.stats[name2] = result;
      }
      return result;
    }
  }
  const STAT_QUEUED_REQUESTS = "Queued Requests";
  const STAT_ACTIVE_REQUESTS = "Active Requests";
  const STAT_CANCELLED_REQUESTS = "Cancelled Requests";
  const STAT_QUEUED_REQUESTS_EVER = "Queued Requests Ever";
  const STAT_ACTIVE_REQUESTS_EVER = "Active Requests Ever";
  const DEFAULT_PROPS$2 = {
    id: "request-scheduler",
    throttleRequests: true,
    maxRequests: 6
  };
  class RequestScheduler {
    constructor() {
      let props = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      this.props = void 0;
      this.stats = void 0;
      this.activeRequestCount = 0;
      this.requestQueue = [];
      this.requestMap = /* @__PURE__ */ new Map();
      this.deferredUpdate = null;
      this.props = {
        ...DEFAULT_PROPS$2,
        ...props
      };
      this.stats = new Stats({
        id: this.props.id
      });
      this.stats.get(STAT_QUEUED_REQUESTS);
      this.stats.get(STAT_ACTIVE_REQUESTS);
      this.stats.get(STAT_CANCELLED_REQUESTS);
      this.stats.get(STAT_QUEUED_REQUESTS_EVER);
      this.stats.get(STAT_ACTIVE_REQUESTS_EVER);
    }
    scheduleRequest(handle) {
      let getPriority = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : () => 0;
      if (!this.props.throttleRequests) {
        return Promise.resolve({
          done: () => {
          }
        });
      }
      if (this.requestMap.has(handle)) {
        return this.requestMap.get(handle);
      }
      const request = {
        handle,
        priority: 0,
        getPriority
      };
      const promise = new Promise((resolve2) => {
        request.resolve = resolve2;
        return request;
      });
      this.requestQueue.push(request);
      this.requestMap.set(handle, promise);
      this._issueNewRequests();
      return promise;
    }
    _issueRequest(request) {
      const {
        handle,
        resolve: resolve2
      } = request;
      let isDone = false;
      const done = () => {
        if (!isDone) {
          isDone = true;
          this.requestMap.delete(handle);
          this.activeRequestCount--;
          this._issueNewRequests();
        }
      };
      this.activeRequestCount++;
      return resolve2 ? resolve2({
        done
      }) : Promise.resolve({
        done
      });
    }
    _issueNewRequests() {
      if (!this.deferredUpdate) {
        this.deferredUpdate = setTimeout(() => this._issueNewRequestsAsync(), 0);
      }
    }
    _issueNewRequestsAsync() {
      this.deferredUpdate = null;
      const freeSlots = Math.max(this.props.maxRequests - this.activeRequestCount, 0);
      if (freeSlots === 0) {
        return;
      }
      this._updateAllRequests();
      for (let i2 = 0; i2 < freeSlots; ++i2) {
        const request = this.requestQueue.shift();
        if (request) {
          this._issueRequest(request);
        }
      }
    }
    _updateAllRequests() {
      const requestQueue = this.requestQueue;
      for (let i2 = 0; i2 < requestQueue.length; ++i2) {
        const request = requestQueue[i2];
        if (!this._updateRequest(request)) {
          requestQueue.splice(i2, 1);
          this.requestMap.delete(request.handle);
          i2--;
        }
      }
      requestQueue.sort((a2, b) => a2.priority - b.priority);
    }
    _updateRequest(request) {
      request.priority = request.getPriority(request.handle);
      if (request.priority < 0) {
        request.resolve(null);
        return false;
      }
      return true;
    }
  }
  let pathPrefix = "";
  const fileAliases = {};
  function resolvePath(filename2) {
    for (const alias in fileAliases) {
      if (filename2.startsWith(alias)) {
        const replacement = fileAliases[alias];
        filename2 = filename2.replace(alias, replacement);
      }
    }
    if (!filename2.startsWith("http://") && !filename2.startsWith("https://")) {
      filename2 = `${pathPrefix}${filename2}`;
    }
    return filename2;
  }
  function toArrayBuffer$1(buffer) {
    return buffer;
  }
  function isBuffer$1(value) {
    return value && typeof value === "object" && value.isBuffer;
  }
  function toArrayBuffer(data) {
    if (isBuffer$1(data)) {
      return toArrayBuffer$1(data);
    }
    if (data instanceof ArrayBuffer) {
      return data;
    }
    if (ArrayBuffer.isView(data)) {
      if (data.byteOffset === 0 && data.byteLength === data.buffer.byteLength) {
        return data.buffer;
      }
      return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
    }
    if (typeof data === "string") {
      const text = data;
      const uint8Array = new TextEncoder().encode(text);
      return uint8Array.buffer;
    }
    if (data && typeof data === "object" && data._toArrayBuffer) {
      return data._toArrayBuffer();
    }
    throw new Error("toArrayBuffer");
  }
  function getCWD() {
    var _window$location;
    if (typeof process !== "undefined" && typeof process.cwd !== "undefined") {
      return process.cwd();
    }
    const pathname = (_window$location = window.location) === null || _window$location === void 0 ? void 0 : _window$location.pathname;
    return (pathname === null || pathname === void 0 ? void 0 : pathname.slice(0, pathname.lastIndexOf("/") + 1)) || "";
  }
  function filename(url) {
    const slashIndex = url ? url.lastIndexOf("/") : -1;
    return slashIndex >= 0 ? url.substr(slashIndex + 1) : "";
  }
  function dirname(url) {
    const slashIndex = url ? url.lastIndexOf("/") : -1;
    return slashIndex >= 0 ? url.substr(0, slashIndex) : "";
  }
  function resolve() {
    const paths = [];
    for (let _i = 0; _i < arguments.length; _i++) {
      paths[_i] = _i < 0 || arguments.length <= _i ? void 0 : arguments[_i];
    }
    let resolvedPath = "";
    let resolvedAbsolute = false;
    let cwd;
    for (let i2 = paths.length - 1; i2 >= -1 && !resolvedAbsolute; i2--) {
      let path;
      if (i2 >= 0) {
        path = paths[i2];
      } else {
        if (cwd === void 0) {
          cwd = getCWD();
        }
        path = cwd;
      }
      if (path.length === 0) {
        continue;
      }
      resolvedPath = `${path}/${resolvedPath}`;
      resolvedAbsolute = path.charCodeAt(0) === SLASH;
    }
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
    if (resolvedAbsolute) {
      return `/${resolvedPath}`;
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    }
    return ".";
  }
  const SLASH = 47;
  const DOT = 46;
  function normalizeStringPosix(path, allowAboveRoot) {
    let res = "";
    let lastSlash = -1;
    let dots = 0;
    let code;
    let isAboveRoot = false;
    for (let i2 = 0; i2 <= path.length; ++i2) {
      if (i2 < path.length) {
        code = path.charCodeAt(i2);
      } else if (code === SLASH) {
        break;
      } else {
        code = SLASH;
      }
      if (code === SLASH) {
        if (lastSlash === i2 - 1 || dots === 1)
          ;
        else if (lastSlash !== i2 - 1 && dots === 2) {
          if (res.length < 2 || !isAboveRoot || res.charCodeAt(res.length - 1) !== DOT || res.charCodeAt(res.length - 2) !== DOT) {
            if (res.length > 2) {
              const start = res.length - 1;
              let j = start;
              for (; j >= 0; --j) {
                if (res.charCodeAt(j) === SLASH) {
                  break;
                }
              }
              if (j !== start) {
                res = j === -1 ? "" : res.slice(0, j);
                lastSlash = i2;
                dots = 0;
                isAboveRoot = false;
                continue;
              }
            } else if (res.length === 2 || res.length === 1) {
              res = "";
              lastSlash = i2;
              dots = 0;
              isAboveRoot = false;
              continue;
            }
          }
          if (allowAboveRoot) {
            if (res.length > 0) {
              res += "/..";
            } else {
              res = "..";
            }
            isAboveRoot = true;
          }
        } else {
          const slice = path.slice(lastSlash + 1, i2);
          if (res.length > 0) {
            res += `/${slice}`;
          } else {
            res = slice;
          }
          isAboveRoot = false;
        }
        lastSlash = i2;
        dots = 0;
      } else if (code === DOT && dots !== -1) {
        ++dots;
      } else {
        dots = -1;
      }
    }
    return res;
  }
  const isBoolean = (x) => typeof x === "boolean";
  const isFunction = (x) => typeof x === "function";
  const isObject = (x) => x !== null && typeof x === "object";
  const isPureObject = (x) => isObject(x) && x.constructor === {}.constructor;
  const isIterable = (x) => Boolean(x) && typeof x[Symbol.iterator] === "function";
  const isAsyncIterable = (x) => x && typeof x[Symbol.asyncIterator] === "function";
  const isResponse = (x) => typeof Response !== "undefined" && x instanceof Response || x && x.arrayBuffer && x.text && x.json;
  const isBlob = (x) => typeof Blob !== "undefined" && x instanceof Blob;
  const isBuffer = (x) => x && typeof x === "object" && x.isBuffer;
  const isReadableDOMStream = (x) => typeof ReadableStream !== "undefined" && x instanceof ReadableStream || isObject(x) && isFunction(x.tee) && isFunction(x.cancel) && isFunction(x.getReader);
  const isReadableNodeStream = (x) => isObject(x) && isFunction(x.read) && isFunction(x.pipe) && isBoolean(x.readable);
  const isReadableStream = (x) => isReadableDOMStream(x) || isReadableNodeStream(x);
  const DATA_URL_PATTERN = /^data:([-\w.]+\/[-\w.+]+)(;|,)/;
  const MIME_TYPE_PATTERN = /^([-\w.]+\/[-\w.+]+)/;
  function parseMIMEType(mimeString) {
    const matches2 = MIME_TYPE_PATTERN.exec(mimeString);
    if (matches2) {
      return matches2[1];
    }
    return mimeString;
  }
  function parseMIMETypeFromURL(url) {
    const matches2 = DATA_URL_PATTERN.exec(url);
    if (matches2) {
      return matches2[1];
    }
    return "";
  }
  const QUERY_STRING_PATTERN = /\?.*/;
  function extractQueryString(url) {
    const matches2 = url.match(QUERY_STRING_PATTERN);
    return matches2 && matches2[0];
  }
  function stripQueryString(url) {
    return url.replace(QUERY_STRING_PATTERN, "");
  }
  function getResourceUrl(resource) {
    if (isResponse(resource)) {
      const response = resource;
      return response.url;
    }
    if (isBlob(resource)) {
      const blob = resource;
      return blob.name || "";
    }
    if (typeof resource === "string") {
      return resource;
    }
    return "";
  }
  function getResourceMIMEType(resource) {
    if (isResponse(resource)) {
      const response = resource;
      const contentTypeHeader = response.headers.get("content-type") || "";
      const noQueryUrl = stripQueryString(response.url);
      return parseMIMEType(contentTypeHeader) || parseMIMETypeFromURL(noQueryUrl);
    }
    if (isBlob(resource)) {
      const blob = resource;
      return blob.type || "";
    }
    if (typeof resource === "string") {
      return parseMIMETypeFromURL(resource);
    }
    return "";
  }
  function getResourceContentLength(resource) {
    if (isResponse(resource)) {
      const response = resource;
      return response.headers["content-length"] || -1;
    }
    if (isBlob(resource)) {
      const blob = resource;
      return blob.size;
    }
    if (typeof resource === "string") {
      return resource.length;
    }
    if (resource instanceof ArrayBuffer) {
      return resource.byteLength;
    }
    if (ArrayBuffer.isView(resource)) {
      return resource.byteLength;
    }
    return -1;
  }
  async function makeResponse(resource) {
    if (isResponse(resource)) {
      return resource;
    }
    const headers = {};
    const contentLength = getResourceContentLength(resource);
    if (contentLength >= 0) {
      headers["content-length"] = String(contentLength);
    }
    const url = getResourceUrl(resource);
    const type = getResourceMIMEType(resource);
    if (type) {
      headers["content-type"] = type;
    }
    const initialDataUrl = await getInitialDataUrl(resource);
    if (initialDataUrl) {
      headers["x-first-bytes"] = initialDataUrl;
    }
    if (typeof resource === "string") {
      resource = new TextEncoder().encode(resource);
    }
    const response = new Response(resource, {
      headers
    });
    Object.defineProperty(response, "url", {
      value: url
    });
    return response;
  }
  async function checkResponse(response) {
    if (!response.ok) {
      const message = await getResponseError(response);
      throw new Error(message);
    }
  }
  async function getResponseError(response) {
    let message = `Failed to fetch resource ${response.url} (${response.status}): `;
    try {
      const contentType = response.headers.get("Content-Type");
      let text = response.statusText;
      if (contentType !== null && contentType !== void 0 && contentType.includes("application/json")) {
        text += ` ${await response.text()}`;
      }
      message += text;
      message = message.length > 60 ? `${message.slice(0, 60)}...` : message;
    } catch (error) {
    }
    return message;
  }
  async function getInitialDataUrl(resource) {
    const INITIAL_DATA_LENGTH = 5;
    if (typeof resource === "string") {
      return `data:,${resource.slice(0, INITIAL_DATA_LENGTH)}`;
    }
    if (resource instanceof Blob) {
      const blobSlice = resource.slice(0, 5);
      return await new Promise((resolve2) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          var _event$target;
          return resolve2(event === null || event === void 0 ? void 0 : (_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.result);
        };
        reader.readAsDataURL(blobSlice);
      });
    }
    if (resource instanceof ArrayBuffer) {
      const slice = resource.slice(0, INITIAL_DATA_LENGTH);
      const base64 = arrayBufferToBase64(slice);
      return `data:base64,${base64}`;
    }
    return null;
  }
  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i2 = 0; i2 < bytes.byteLength; i2++) {
      binary += String.fromCharCode(bytes[i2]);
    }
    return btoa(binary);
  }
  function isNodePath(url) {
    return !isRequestURL(url) && !isDataURL(url);
  }
  function isRequestURL(url) {
    return url.startsWith("http:") || url.startsWith("https:");
  }
  function isDataURL(url) {
    return url.startsWith("data:");
  }
  async function fetchFile(urlOrData, fetchOptions) {
    if (typeof urlOrData === "string") {
      const url = resolvePath(urlOrData);
      if (isNodePath(url)) {
        var _globalThis$loaders2;
        if ((_globalThis$loaders2 = globalThis.loaders) !== null && _globalThis$loaders2 !== void 0 && _globalThis$loaders2.fetchNode) {
          var _globalThis$loaders22;
          return (_globalThis$loaders22 = globalThis.loaders) === null || _globalThis$loaders22 === void 0 ? void 0 : _globalThis$loaders22.fetchNode(url, fetchOptions);
        }
      }
      return await fetch(url, fetchOptions);
    }
    return await makeResponse(urlOrData);
  }
  function isElectron(mockUserAgent) {
    if (typeof window !== "undefined" && typeof window.process === "object" && window.process.type === "renderer") {
      return true;
    }
    if (typeof process !== "undefined" && typeof process.versions === "object" && Boolean(process.versions["electron"])) {
      return true;
    }
    const realUserAgent = typeof navigator === "object" && typeof navigator.userAgent === "string" && navigator.userAgent;
    const userAgent = mockUserAgent || realUserAgent;
    if (userAgent && userAgent.indexOf("Electron") >= 0) {
      return true;
    }
    return false;
  }
  function isBrowser() {
    const isNode = typeof process === "object" && String(process) === "[object process]" && !process.browser;
    return !isNode || isElectron();
  }
  const window_ = globalThis.window || globalThis.self || globalThis.global;
  const process_ = globalThis.process || {};
  const VERSION$6 = typeof __VERSION__ !== "undefined" ? __VERSION__ : "untranspiled source";
  isBrowser();
  function getStorage(type) {
    try {
      const storage = window[type];
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return storage;
    } catch (e) {
      return null;
    }
  }
  class LocalStorage {
    constructor(id, defaultConfig) {
      let type = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "sessionStorage";
      this.storage = void 0;
      this.id = void 0;
      this.config = void 0;
      this.storage = getStorage(type);
      this.id = id;
      this.config = defaultConfig;
      this._loadConfiguration();
    }
    getConfiguration() {
      return this.config;
    }
    setConfiguration(configuration) {
      Object.assign(this.config, configuration);
      if (this.storage) {
        const serialized = JSON.stringify(this.config);
        this.storage.setItem(this.id, serialized);
      }
    }
    _loadConfiguration() {
      let configuration = {};
      if (this.storage) {
        const serializedConfiguration = this.storage.getItem(this.id);
        configuration = serializedConfiguration ? JSON.parse(serializedConfiguration) : {};
      }
      Object.assign(this.config, configuration);
      return this;
    }
  }
  function formatTime(ms) {
    let formatted;
    if (ms < 10) {
      formatted = "".concat(ms.toFixed(2), "ms");
    } else if (ms < 100) {
      formatted = "".concat(ms.toFixed(1), "ms");
    } else if (ms < 1e3) {
      formatted = "".concat(ms.toFixed(0), "ms");
    } else {
      formatted = "".concat((ms / 1e3).toFixed(2), "s");
    }
    return formatted;
  }
  function leftPad(string) {
    let length2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 8;
    const padLength = Math.max(length2 - string.length, 0);
    return "".concat(" ".repeat(padLength)).concat(string);
  }
  function formatImage(image, message, scale2) {
    let maxWidth = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 600;
    const imageUrl = image.src.replace(/\(/g, "%28").replace(/\)/g, "%29");
    if (image.width > maxWidth) {
      scale2 = Math.min(scale2, maxWidth / image.width);
    }
    const width = image.width * scale2;
    const height = image.height * scale2;
    const style = ["font-size:1px;", "padding:".concat(Math.floor(height / 2), "px ").concat(Math.floor(width / 2), "px;"), "line-height:".concat(height, "px;"), "background:url(".concat(imageUrl, ");"), "background-size:".concat(width, "px ").concat(height, "px;"), "color:transparent;"].join("");
    return ["".concat(message, " %c+"), style];
  }
  let COLOR;
  (function(COLOR2) {
    COLOR2[COLOR2["BLACK"] = 30] = "BLACK";
    COLOR2[COLOR2["RED"] = 31] = "RED";
    COLOR2[COLOR2["GREEN"] = 32] = "GREEN";
    COLOR2[COLOR2["YELLOW"] = 33] = "YELLOW";
    COLOR2[COLOR2["BLUE"] = 34] = "BLUE";
    COLOR2[COLOR2["MAGENTA"] = 35] = "MAGENTA";
    COLOR2[COLOR2["CYAN"] = 36] = "CYAN";
    COLOR2[COLOR2["WHITE"] = 37] = "WHITE";
    COLOR2[COLOR2["BRIGHT_BLACK"] = 90] = "BRIGHT_BLACK";
    COLOR2[COLOR2["BRIGHT_RED"] = 91] = "BRIGHT_RED";
    COLOR2[COLOR2["BRIGHT_GREEN"] = 92] = "BRIGHT_GREEN";
    COLOR2[COLOR2["BRIGHT_YELLOW"] = 93] = "BRIGHT_YELLOW";
    COLOR2[COLOR2["BRIGHT_BLUE"] = 94] = "BRIGHT_BLUE";
    COLOR2[COLOR2["BRIGHT_MAGENTA"] = 95] = "BRIGHT_MAGENTA";
    COLOR2[COLOR2["BRIGHT_CYAN"] = 96] = "BRIGHT_CYAN";
    COLOR2[COLOR2["BRIGHT_WHITE"] = 97] = "BRIGHT_WHITE";
  })(COLOR || (COLOR = {}));
  const BACKGROUND_INCREMENT = 10;
  function getColor(color) {
    if (typeof color !== "string") {
      return color;
    }
    color = color.toUpperCase();
    return COLOR[color] || COLOR.WHITE;
  }
  function addColor(string, color, background) {
    if (!isBrowser && typeof string === "string") {
      if (color) {
        const colorCode = getColor(color);
        string = "\x1B[".concat(colorCode, "m").concat(string, "\x1B[39m");
      }
      if (background) {
        const colorCode = getColor(background);
        string = "\x1B[".concat(colorCode + BACKGROUND_INCREMENT, "m").concat(string, "\x1B[49m");
      }
    }
    return string;
  }
  function autobind(obj) {
    let predefined = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : ["constructor"];
    const proto = Object.getPrototypeOf(obj);
    const propNames = Object.getOwnPropertyNames(proto);
    const object = obj;
    for (const key of propNames) {
      const value = object[key];
      if (typeof value === "function") {
        if (!predefined.find((name2) => key === name2)) {
          object[key] = value.bind(obj);
        }
      }
    }
  }
  function assert$4(condition, message) {
    if (!condition) {
      throw new Error(message || "Assertion failed");
    }
  }
  function getHiResTimestamp() {
    let timestamp;
    if (isBrowser() && window_.performance) {
      var _window$performance, _window$performance$n;
      timestamp = window_ === null || window_ === void 0 ? void 0 : (_window$performance = window_.performance) === null || _window$performance === void 0 ? void 0 : (_window$performance$n = _window$performance.now) === null || _window$performance$n === void 0 ? void 0 : _window$performance$n.call(_window$performance);
    } else if ("hrtime" in process_) {
      var _process$hrtime;
      const timeParts = process_ === null || process_ === void 0 ? void 0 : (_process$hrtime = process_.hrtime) === null || _process$hrtime === void 0 ? void 0 : _process$hrtime.call(process_);
      timestamp = timeParts[0] * 1e3 + timeParts[1] / 1e6;
    } else {
      timestamp = Date.now();
    }
    return timestamp;
  }
  const originalConsole = {
    debug: isBrowser() ? console.debug || console.log : console.log,
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error
  };
  const DEFAULT_LOG_CONFIGURATION = {
    enabled: true,
    level: 0
  };
  function noop() {
  }
  const cache = {};
  const ONCE = {
    once: true
  };
  class Log {
    constructor() {
      let {
        id
      } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
        id: ""
      };
      this.id = void 0;
      this.VERSION = VERSION$6;
      this._startTs = getHiResTimestamp();
      this._deltaTs = getHiResTimestamp();
      this._storage = void 0;
      this.userData = {};
      this.LOG_THROTTLE_TIMEOUT = 0;
      this.id = id;
      this.userData = {};
      this._storage = new LocalStorage("__probe-".concat(this.id, "__"), DEFAULT_LOG_CONFIGURATION);
      this.timeStamp("".concat(this.id, " started"));
      autobind(this);
      Object.seal(this);
    }
    set level(newLevel) {
      this.setLevel(newLevel);
    }
    get level() {
      return this.getLevel();
    }
    isEnabled() {
      return this._storage.config.enabled;
    }
    getLevel() {
      return this._storage.config.level;
    }
    getTotal() {
      return Number((getHiResTimestamp() - this._startTs).toPrecision(10));
    }
    getDelta() {
      return Number((getHiResTimestamp() - this._deltaTs).toPrecision(10));
    }
    set priority(newPriority) {
      this.level = newPriority;
    }
    get priority() {
      return this.level;
    }
    getPriority() {
      return this.level;
    }
    enable() {
      let enabled = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
      this._storage.setConfiguration({
        enabled
      });
      return this;
    }
    setLevel(level) {
      this._storage.setConfiguration({
        level
      });
      return this;
    }
    get(setting) {
      return this._storage.config[setting];
    }
    set(setting, value) {
      this._storage.setConfiguration({
        [setting]: value
      });
    }
    settings() {
      if (console.table) {
        console.table(this._storage.config);
      } else {
        console.log(this._storage.config);
      }
    }
    assert(condition, message) {
      assert$4(condition, message);
    }
    warn(message) {
      return this._getLogFunction(0, message, originalConsole.warn, arguments, ONCE);
    }
    error(message) {
      return this._getLogFunction(0, message, originalConsole.error, arguments);
    }
    deprecated(oldUsage, newUsage) {
      return this.warn("`".concat(oldUsage, "` is deprecated and will be removed in a later version. Use `").concat(newUsage, "` instead"));
    }
    removed(oldUsage, newUsage) {
      return this.error("`".concat(oldUsage, "` has been removed. Use `").concat(newUsage, "` instead"));
    }
    probe(logLevel, message) {
      return this._getLogFunction(logLevel, message, originalConsole.log, arguments, {
        time: true,
        once: true
      });
    }
    log(logLevel, message) {
      return this._getLogFunction(logLevel, message, originalConsole.debug, arguments);
    }
    info(logLevel, message) {
      return this._getLogFunction(logLevel, message, console.info, arguments);
    }
    once(logLevel, message) {
      return this._getLogFunction(logLevel, message, originalConsole.debug || originalConsole.info, arguments, ONCE);
    }
    table(logLevel, table, columns) {
      if (table) {
        return this._getLogFunction(logLevel, table, console.table || noop, columns && [columns], {
          tag: getTableHeader(table)
        });
      }
      return noop;
    }
    image(_ref) {
      let {
        logLevel,
        priority,
        image,
        message = "",
        scale: scale2 = 1
      } = _ref;
      if (!this._shouldLog(logLevel || priority)) {
        return noop;
      }
      return isBrowser() ? logImageInBrowser({
        image,
        message,
        scale: scale2
      }) : logImageInNode();
    }
    time(logLevel, message) {
      return this._getLogFunction(logLevel, message, console.time ? console.time : console.info);
    }
    timeEnd(logLevel, message) {
      return this._getLogFunction(logLevel, message, console.timeEnd ? console.timeEnd : console.info);
    }
    timeStamp(logLevel, message) {
      return this._getLogFunction(logLevel, message, console.timeStamp || noop);
    }
    group(logLevel, message) {
      let opts = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
        collapsed: false
      };
      const options = normalizeArguments({
        logLevel,
        message,
        opts
      });
      const {
        collapsed
      } = opts;
      options.method = (collapsed ? console.groupCollapsed : console.group) || console.info;
      return this._getLogFunction(options);
    }
    groupCollapsed(logLevel, message) {
      let opts = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return this.group(logLevel, message, Object.assign({}, opts, {
        collapsed: true
      }));
    }
    groupEnd(logLevel) {
      return this._getLogFunction(logLevel, "", console.groupEnd || noop);
    }
    withGroup(logLevel, message, func) {
      this.group(logLevel, message)();
      try {
        func();
      } finally {
        this.groupEnd(logLevel)();
      }
    }
    trace() {
      if (console.trace) {
        console.trace();
      }
    }
    _shouldLog(logLevel) {
      return this.isEnabled() && this.getLevel() >= normalizeLogLevel(logLevel);
    }
    _getLogFunction(logLevel, message, method, args, opts) {
      if (this._shouldLog(logLevel)) {
        opts = normalizeArguments({
          logLevel,
          message,
          args,
          opts
        });
        method = method || opts.method;
        assert$4(method);
        opts.total = this.getTotal();
        opts.delta = this.getDelta();
        this._deltaTs = getHiResTimestamp();
        const tag = opts.tag || opts.message;
        if (opts.once && tag) {
          if (!cache[tag]) {
            cache[tag] = getHiResTimestamp();
          } else {
            return noop;
          }
        }
        message = decorateMessage(this.id, opts.message, opts);
        return method.bind(console, message, ...opts.args);
      }
      return noop;
    }
  }
  Log.VERSION = VERSION$6;
  function normalizeLogLevel(logLevel) {
    if (!logLevel) {
      return 0;
    }
    let resolvedLevel;
    switch (typeof logLevel) {
      case "number":
        resolvedLevel = logLevel;
        break;
      case "object":
        resolvedLevel = logLevel.logLevel || logLevel.priority || 0;
        break;
      default:
        return 0;
    }
    assert$4(Number.isFinite(resolvedLevel) && resolvedLevel >= 0);
    return resolvedLevel;
  }
  function normalizeArguments(opts) {
    const {
      logLevel,
      message
    } = opts;
    opts.logLevel = normalizeLogLevel(logLevel);
    const args = opts.args ? Array.from(opts.args) : [];
    while (args.length && args.shift() !== message) {
    }
    switch (typeof logLevel) {
      case "string":
      case "function":
        if (message !== void 0) {
          args.unshift(message);
        }
        opts.message = logLevel;
        break;
      case "object":
        Object.assign(opts, logLevel);
        break;
    }
    if (typeof opts.message === "function") {
      opts.message = opts.message();
    }
    const messageType = typeof opts.message;
    assert$4(messageType === "string" || messageType === "object");
    return Object.assign(opts, {
      args
    }, opts.opts);
  }
  function decorateMessage(id, message, opts) {
    if (typeof message === "string") {
      const time = opts.time ? leftPad(formatTime(opts.total)) : "";
      message = opts.time ? "".concat(id, ": ").concat(time, "  ").concat(message) : "".concat(id, ": ").concat(message);
      message = addColor(message, opts.color, opts.background);
    }
    return message;
  }
  function logImageInNode(_ref2) {
    console.warn("removed");
    return noop;
  }
  function logImageInBrowser(_ref3) {
    let {
      image,
      message = "",
      scale: scale2 = 1
    } = _ref3;
    if (typeof image === "string") {
      const img = new Image();
      img.onload = () => {
        const args = formatImage(img, message, scale2);
        console.log(...args);
      };
      img.src = image;
      return noop;
    }
    const element = image.nodeName || "";
    if (element.toLowerCase() === "img") {
      console.log(...formatImage(image, message, scale2));
      return noop;
    }
    if (element.toLowerCase() === "canvas") {
      const img = new Image();
      img.onload = () => console.log(...formatImage(img, message, scale2));
      img.src = image.toDataURL();
      return noop;
    }
    return noop;
  }
  function getTableHeader(table) {
    for (const key in table) {
      for (const title in table[key]) {
        return title || "untitled";
      }
    }
    return "empty";
  }
  const log$1 = new Log({
    id: "@probe.gl/log"
  });
  const probeLog = new Log({
    id: "loaders.gl"
  });
  class NullLog {
    log() {
      return () => {
      };
    }
    info() {
      return () => {
      };
    }
    warn() {
      return () => {
      };
    }
    error() {
      return () => {
      };
    }
  }
  class ConsoleLog {
    constructor() {
      this.console = void 0;
      this.console = console;
    }
    log() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return this.console.log.bind(this.console, ...args);
    }
    info() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      return this.console.info.bind(this.console, ...args);
    }
    warn() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      return this.console.warn.bind(this.console, ...args);
    }
    error() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      return this.console.error.bind(this.console, ...args);
    }
  }
  const DEFAULT_LOADER_OPTIONS = {
    fetch: null,
    mimeType: void 0,
    nothrow: false,
    log: new ConsoleLog(),
    useLocalLibraries: false,
    CDN: "https://unpkg.com/@loaders.gl",
    worker: true,
    maxConcurrency: 3,
    maxMobileConcurrency: 1,
    reuseWorkers: isBrowser$2,
    _nodeWorkers: false,
    _workerType: "",
    limit: 0,
    _limitMB: 0,
    batchSize: "auto",
    batchDebounceMs: 0,
    metadata: false,
    transforms: []
  };
  const REMOVED_LOADER_OPTIONS = {
    throws: "nothrow",
    dataType: "(no longer used)",
    uri: "baseUri",
    method: "fetch.method",
    headers: "fetch.headers",
    body: "fetch.body",
    mode: "fetch.mode",
    credentials: "fetch.credentials",
    cache: "fetch.cache",
    redirect: "fetch.redirect",
    referrer: "fetch.referrer",
    referrerPolicy: "fetch.referrerPolicy",
    integrity: "fetch.integrity",
    keepalive: "fetch.keepalive",
    signal: "fetch.signal"
  };
  function getGlobalLoaderState() {
    globalThis.loaders = globalThis.loaders || {};
    const {
      loaders
    } = globalThis;
    loaders._state = loaders._state || {};
    return loaders._state;
  }
  function getGlobalLoaderOptions() {
    const state = getGlobalLoaderState();
    state.globalOptions = state.globalOptions || {
      ...DEFAULT_LOADER_OPTIONS
    };
    return state.globalOptions;
  }
  function normalizeOptions(options, loader, loaders, url) {
    loaders = loaders || [];
    loaders = Array.isArray(loaders) ? loaders : [loaders];
    validateOptions(options, loaders);
    return normalizeOptionsInternal(loader, options, url);
  }
  function validateOptions(options, loaders) {
    validateOptionsObject(options, null, DEFAULT_LOADER_OPTIONS, REMOVED_LOADER_OPTIONS, loaders);
    for (const loader of loaders) {
      const idOptions = options && options[loader.id] || {};
      const loaderOptions = loader.options && loader.options[loader.id] || {};
      const deprecatedOptions = loader.deprecatedOptions && loader.deprecatedOptions[loader.id] || {};
      validateOptionsObject(idOptions, loader.id, loaderOptions, deprecatedOptions, loaders);
    }
  }
  function validateOptionsObject(options, id, defaultOptions2, deprecatedOptions, loaders) {
    const loaderName = id || "Top level";
    const prefix = id ? `${id}.` : "";
    for (const key in options) {
      const isSubOptions = !id && isObject(options[key]);
      const isBaseUriOption = key === "baseUri" && !id;
      const isWorkerUrlOption = key === "workerUrl" && id;
      if (!(key in defaultOptions2) && !isBaseUriOption && !isWorkerUrlOption) {
        if (key in deprecatedOptions) {
          probeLog.warn(`${loaderName} loader option '${prefix}${key}' no longer supported, use '${deprecatedOptions[key]}'`)();
        } else if (!isSubOptions) {
          const suggestion = findSimilarOption(key, loaders);
          probeLog.warn(`${loaderName} loader option '${prefix}${key}' not recognized. ${suggestion}`)();
        }
      }
    }
  }
  function findSimilarOption(optionKey, loaders) {
    const lowerCaseOptionKey = optionKey.toLowerCase();
    let bestSuggestion = "";
    for (const loader of loaders) {
      for (const key in loader.options) {
        if (optionKey === key) {
          return `Did you mean '${loader.id}.${key}'?`;
        }
        const lowerCaseKey = key.toLowerCase();
        const isPartialMatch = lowerCaseOptionKey.startsWith(lowerCaseKey) || lowerCaseKey.startsWith(lowerCaseOptionKey);
        if (isPartialMatch) {
          bestSuggestion = bestSuggestion || `Did you mean '${loader.id}.${key}'?`;
        }
      }
    }
    return bestSuggestion;
  }
  function normalizeOptionsInternal(loader, options, url) {
    const loaderDefaultOptions = loader.options || {};
    const mergedOptions = {
      ...loaderDefaultOptions
    };
    addUrlOptions(mergedOptions, url);
    if (mergedOptions.log === null) {
      mergedOptions.log = new NullLog();
    }
    mergeNestedFields(mergedOptions, getGlobalLoaderOptions());
    mergeNestedFields(mergedOptions, options);
    return mergedOptions;
  }
  function mergeNestedFields(mergedOptions, options) {
    for (const key in options) {
      if (key in options) {
        const value = options[key];
        if (isPureObject(value) && isPureObject(mergedOptions[key])) {
          mergedOptions[key] = {
            ...mergedOptions[key],
            ...options[key]
          };
        } else {
          mergedOptions[key] = options[key];
        }
      }
    }
  }
  function addUrlOptions(options, url) {
    if (url && !("baseUri" in options)) {
      options.baseUri = url;
    }
  }
  function isLoaderObject(loader) {
    var _loader;
    if (!loader) {
      return false;
    }
    if (Array.isArray(loader)) {
      loader = loader[0];
    }
    const hasExtensions = Array.isArray((_loader = loader) === null || _loader === void 0 ? void 0 : _loader.extensions);
    return hasExtensions;
  }
  function normalizeLoader(loader) {
    var _loader2, _loader3;
    assert$6(loader, "null loader");
    assert$6(isLoaderObject(loader), "invalid loader");
    let options;
    if (Array.isArray(loader)) {
      options = loader[1];
      loader = loader[0];
      loader = {
        ...loader,
        options: {
          ...loader.options,
          ...options
        }
      };
    }
    if ((_loader2 = loader) !== null && _loader2 !== void 0 && _loader2.parseTextSync || (_loader3 = loader) !== null && _loader3 !== void 0 && _loader3.parseText) {
      loader.text = true;
    }
    if (!loader.text) {
      loader.binary = true;
    }
    return loader;
  }
  const getGlobalLoaderRegistry = () => {
    const state = getGlobalLoaderState();
    state.loaderRegistry = state.loaderRegistry || [];
    return state.loaderRegistry;
  };
  function getRegisteredLoaders() {
    return getGlobalLoaderRegistry();
  }
  const log = new Log({
    id: "loaders.gl"
  });
  const EXT_PATTERN = /\.([^.]+)$/;
  async function selectLoader(data) {
    let loaders = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
    let options = arguments.length > 2 ? arguments[2] : void 0;
    let context = arguments.length > 3 ? arguments[3] : void 0;
    if (!validHTTPResponse(data)) {
      return null;
    }
    let loader = selectLoaderSync(data, loaders, {
      ...options,
      nothrow: true
    }, context);
    if (loader) {
      return loader;
    }
    if (isBlob(data)) {
      data = await data.slice(0, 10).arrayBuffer();
      loader = selectLoaderSync(data, loaders, options, context);
    }
    if (!loader && !(options !== null && options !== void 0 && options.nothrow)) {
      throw new Error(getNoValidLoaderMessage(data));
    }
    return loader;
  }
  function selectLoaderSync(data) {
    let loaders = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
    let options = arguments.length > 2 ? arguments[2] : void 0;
    let context = arguments.length > 3 ? arguments[3] : void 0;
    if (!validHTTPResponse(data)) {
      return null;
    }
    if (loaders && !Array.isArray(loaders)) {
      return normalizeLoader(loaders);
    }
    let candidateLoaders = [];
    if (loaders) {
      candidateLoaders = candidateLoaders.concat(loaders);
    }
    if (!(options !== null && options !== void 0 && options.ignoreRegisteredLoaders)) {
      candidateLoaders.push(...getRegisteredLoaders());
    }
    normalizeLoaders(candidateLoaders);
    const loader = selectLoaderInternal(data, candidateLoaders, options, context);
    if (!loader && !(options !== null && options !== void 0 && options.nothrow)) {
      throw new Error(getNoValidLoaderMessage(data));
    }
    return loader;
  }
  function selectLoaderInternal(data, loaders, options, context) {
    const url = getResourceUrl(data);
    const type = getResourceMIMEType(data);
    const testUrl = stripQueryString(url) || (context === null || context === void 0 ? void 0 : context.url);
    let loader = null;
    let reason = "";
    if (options !== null && options !== void 0 && options.mimeType) {
      loader = findLoaderByMIMEType(loaders, options === null || options === void 0 ? void 0 : options.mimeType);
      reason = `match forced by supplied MIME type ${options === null || options === void 0 ? void 0 : options.mimeType}`;
    }
    loader = loader || findLoaderByUrl(loaders, testUrl);
    reason = reason || (loader ? `matched url ${testUrl}` : "");
    loader = loader || findLoaderByMIMEType(loaders, type);
    reason = reason || (loader ? `matched MIME type ${type}` : "");
    loader = loader || findLoaderByInitialBytes(loaders, data);
    reason = reason || (loader ? `matched initial data ${getFirstCharacters(data)}` : "");
    if (options !== null && options !== void 0 && options.fallbackMimeType) {
      loader = loader || findLoaderByMIMEType(loaders, options === null || options === void 0 ? void 0 : options.fallbackMimeType);
      reason = reason || (loader ? `matched fallback MIME type ${type}` : "");
    }
    if (reason) {
      var _loader;
      log.log(1, `selectLoader selected ${(_loader = loader) === null || _loader === void 0 ? void 0 : _loader.name}: ${reason}.`);
    }
    return loader;
  }
  function validHTTPResponse(data) {
    if (data instanceof Response) {
      if (data.status === 204) {
        return false;
      }
    }
    return true;
  }
  function getNoValidLoaderMessage(data) {
    const url = getResourceUrl(data);
    const type = getResourceMIMEType(data);
    let message = "No valid loader found (";
    message += url ? `${filename(url)}, ` : "no url provided, ";
    message += `MIME type: ${type ? `"${type}"` : "not provided"}, `;
    const firstCharacters = data ? getFirstCharacters(data) : "";
    message += firstCharacters ? ` first bytes: "${firstCharacters}"` : "first bytes: not available";
    message += ")";
    return message;
  }
  function normalizeLoaders(loaders) {
    for (const loader of loaders) {
      normalizeLoader(loader);
    }
  }
  function findLoaderByUrl(loaders, url) {
    const match = url && EXT_PATTERN.exec(url);
    const extension = match && match[1];
    return extension ? findLoaderByExtension(loaders, extension) : null;
  }
  function findLoaderByExtension(loaders, extension) {
    extension = extension.toLowerCase();
    for (const loader of loaders) {
      for (const loaderExtension of loader.extensions) {
        if (loaderExtension.toLowerCase() === extension) {
          return loader;
        }
      }
    }
    return null;
  }
  function findLoaderByMIMEType(loaders, mimeType) {
    for (const loader of loaders) {
      if (loader.mimeTypes && loader.mimeTypes.includes(mimeType)) {
        return loader;
      }
      if (mimeType === `application/x.${loader.id}`) {
        return loader;
      }
    }
    return null;
  }
  function findLoaderByInitialBytes(loaders, data) {
    if (!data) {
      return null;
    }
    for (const loader of loaders) {
      if (typeof data === "string") {
        if (testDataAgainstText(data, loader)) {
          return loader;
        }
      } else if (ArrayBuffer.isView(data)) {
        if (testDataAgainstBinary(data.buffer, data.byteOffset, loader)) {
          return loader;
        }
      } else if (data instanceof ArrayBuffer) {
        const byteOffset = 0;
        if (testDataAgainstBinary(data, byteOffset, loader)) {
          return loader;
        }
      }
    }
    return null;
  }
  function testDataAgainstText(data, loader) {
    if (loader.testText) {
      return loader.testText(data);
    }
    const tests = Array.isArray(loader.tests) ? loader.tests : [loader.tests];
    return tests.some((test) => data.startsWith(test));
  }
  function testDataAgainstBinary(data, byteOffset, loader) {
    const tests = Array.isArray(loader.tests) ? loader.tests : [loader.tests];
    return tests.some((test) => testBinary(data, byteOffset, loader, test));
  }
  function testBinary(data, byteOffset, loader, test) {
    if (test instanceof ArrayBuffer) {
      return compareArrayBuffers(test, data, test.byteLength);
    }
    switch (typeof test) {
      case "function":
        return test(data);
      case "string":
        const magic = getMagicString$2(data, byteOffset, test.length);
        return test === magic;
      default:
        return false;
    }
  }
  function getFirstCharacters(data) {
    let length2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 5;
    if (typeof data === "string") {
      return data.slice(0, length2);
    } else if (ArrayBuffer.isView(data)) {
      return getMagicString$2(data.buffer, data.byteOffset, length2);
    } else if (data instanceof ArrayBuffer) {
      const byteOffset = 0;
      return getMagicString$2(data, byteOffset, length2);
    }
    return "";
  }
  function getMagicString$2(arrayBuffer, byteOffset, length2) {
    if (arrayBuffer.byteLength < byteOffset + length2) {
      return "";
    }
    const dataView = new DataView(arrayBuffer);
    let magic = "";
    for (let i2 = 0; i2 < length2; i2++) {
      magic += String.fromCharCode(dataView.getUint8(byteOffset + i2));
    }
    return magic;
  }
  const DEFAULT_CHUNK_SIZE$2 = 256 * 1024;
  function* makeStringIterator(string, options) {
    const chunkSize = (options === null || options === void 0 ? void 0 : options.chunkSize) || DEFAULT_CHUNK_SIZE$2;
    let offset = 0;
    const textEncoder = new TextEncoder();
    while (offset < string.length) {
      const chunkLength = Math.min(string.length - offset, chunkSize);
      const chunk = string.slice(offset, offset + chunkLength);
      offset += chunkLength;
      yield textEncoder.encode(chunk);
    }
  }
  const DEFAULT_CHUNK_SIZE$1 = 256 * 1024;
  function makeArrayBufferIterator(arrayBuffer) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return function* () {
      const {
        chunkSize = DEFAULT_CHUNK_SIZE$1
      } = options;
      let byteOffset = 0;
      while (byteOffset < arrayBuffer.byteLength) {
        const chunkByteLength = Math.min(arrayBuffer.byteLength - byteOffset, chunkSize);
        const chunk = new ArrayBuffer(chunkByteLength);
        const sourceArray = new Uint8Array(arrayBuffer, byteOffset, chunkByteLength);
        const chunkArray = new Uint8Array(chunk);
        chunkArray.set(sourceArray);
        byteOffset += chunkByteLength;
        yield chunk;
      }
    }();
  }
  const DEFAULT_CHUNK_SIZE = 1024 * 1024;
  async function* makeBlobIterator(blob, options) {
    const chunkSize = (options === null || options === void 0 ? void 0 : options.chunkSize) || DEFAULT_CHUNK_SIZE;
    let offset = 0;
    while (offset < blob.size) {
      const end = offset + chunkSize;
      const chunk = await blob.slice(offset, end).arrayBuffer();
      offset = end;
      yield chunk;
    }
  }
  function makeStreamIterator(stream, options) {
    return isBrowser$2 ? makeBrowserStreamIterator(stream, options) : makeNodeStreamIterator(stream);
  }
  async function* makeBrowserStreamIterator(stream, options) {
    const reader = stream.getReader();
    let nextBatchPromise;
    try {
      while (true) {
        const currentBatchPromise = nextBatchPromise || reader.read();
        if (options !== null && options !== void 0 && options._streamReadAhead) {
          nextBatchPromise = reader.read();
        }
        const {
          done,
          value
        } = await currentBatchPromise;
        if (done) {
          return;
        }
        yield toArrayBuffer(value);
      }
    } catch (error) {
      reader.releaseLock();
    }
  }
  async function* makeNodeStreamIterator(stream, options) {
    for await (const chunk of stream) {
      yield toArrayBuffer(chunk);
    }
  }
  function makeIterator(data, options) {
    if (typeof data === "string") {
      return makeStringIterator(data, options);
    }
    if (data instanceof ArrayBuffer) {
      return makeArrayBufferIterator(data, options);
    }
    if (isBlob(data)) {
      return makeBlobIterator(data, options);
    }
    if (isReadableStream(data)) {
      return makeStreamIterator(data, options);
    }
    if (isResponse(data)) {
      const response = data;
      return makeStreamIterator(response.body, options);
    }
    throw new Error("makeIterator");
  }
  const ERR_DATA = "Cannot convert supplied data type";
  function getArrayBufferOrStringFromDataSync(data, loader, options) {
    if (loader.text && typeof data === "string") {
      return data;
    }
    if (isBuffer(data)) {
      data = data.buffer;
    }
    if (data instanceof ArrayBuffer) {
      const arrayBuffer = data;
      if (loader.text && !loader.binary) {
        const textDecoder = new TextDecoder("utf8");
        return textDecoder.decode(arrayBuffer);
      }
      return arrayBuffer;
    }
    if (ArrayBuffer.isView(data)) {
      if (loader.text && !loader.binary) {
        const textDecoder = new TextDecoder("utf8");
        return textDecoder.decode(data);
      }
      let arrayBuffer = data.buffer;
      const byteLength = data.byteLength || data.length;
      if (data.byteOffset !== 0 || byteLength !== arrayBuffer.byteLength) {
        arrayBuffer = arrayBuffer.slice(data.byteOffset, data.byteOffset + byteLength);
      }
      return arrayBuffer;
    }
    throw new Error(ERR_DATA);
  }
  async function getArrayBufferOrStringFromData(data, loader, options) {
    const isArrayBuffer = data instanceof ArrayBuffer || ArrayBuffer.isView(data);
    if (typeof data === "string" || isArrayBuffer) {
      return getArrayBufferOrStringFromDataSync(data, loader);
    }
    if (isBlob(data)) {
      data = await makeResponse(data);
    }
    if (isResponse(data)) {
      const response = data;
      await checkResponse(response);
      return loader.binary ? await response.arrayBuffer() : await response.text();
    }
    if (isReadableStream(data)) {
      data = makeIterator(data, options);
    }
    if (isIterable(data) || isAsyncIterable(data)) {
      return concatenateArrayBuffersAsync(data);
    }
    throw new Error(ERR_DATA);
  }
  function getFetchFunction(options, context) {
    const globalOptions = getGlobalLoaderOptions();
    const loaderOptions = options || globalOptions;
    if (typeof loaderOptions.fetch === "function") {
      return loaderOptions.fetch;
    }
    if (isObject(loaderOptions.fetch)) {
      return (url) => fetchFile(url, loaderOptions.fetch);
    }
    if (context !== null && context !== void 0 && context.fetch) {
      return context === null || context === void 0 ? void 0 : context.fetch;
    }
    return fetchFile;
  }
  function getLoaderContext(context, options, parentContext) {
    if (parentContext) {
      return parentContext;
    }
    const newContext = {
      fetch: getFetchFunction(options, context),
      ...context
    };
    if (newContext.url) {
      const baseUrl = stripQueryString(newContext.url);
      newContext.baseUrl = baseUrl;
      newContext.queryString = extractQueryString(newContext.url);
      newContext.filename = filename(baseUrl);
      newContext.baseUrl = dirname(baseUrl);
    }
    if (!Array.isArray(newContext.loaders)) {
      newContext.loaders = null;
    }
    return newContext;
  }
  function getLoadersFromContext(loaders, context) {
    if (loaders && !Array.isArray(loaders)) {
      return loaders;
    }
    let candidateLoaders;
    if (loaders) {
      candidateLoaders = Array.isArray(loaders) ? loaders : [loaders];
    }
    if (context && context.loaders) {
      const contextLoaders = Array.isArray(context.loaders) ? context.loaders : [context.loaders];
      candidateLoaders = candidateLoaders ? [...candidateLoaders, ...contextLoaders] : contextLoaders;
    }
    return candidateLoaders && candidateLoaders.length ? candidateLoaders : void 0;
  }
  async function parse$4(data, loaders, options, context) {
    if (loaders && !Array.isArray(loaders) && !isLoaderObject(loaders)) {
      context = void 0;
      options = loaders;
      loaders = void 0;
    }
    data = await data;
    options = options || {};
    const url = getResourceUrl(data);
    const typedLoaders = loaders;
    const candidateLoaders = getLoadersFromContext(typedLoaders, context);
    const loader = await selectLoader(data, candidateLoaders, options);
    if (!loader) {
      return null;
    }
    options = normalizeOptions(options, loader, candidateLoaders, url);
    context = getLoaderContext({
      url,
      _parse: parse$4,
      loaders: candidateLoaders
    }, options, context || null);
    return await parseWithLoader(loader, data, options, context);
  }
  async function parseWithLoader(loader, data, options, context) {
    validateWorkerVersion(loader);
    options = mergeLoaderOptions(loader.options, options);
    if (isResponse(data)) {
      const response = data;
      const {
        ok,
        redirected,
        status,
        statusText,
        type,
        url
      } = response;
      const headers = Object.fromEntries(response.headers.entries());
      context.response = {
        headers,
        ok,
        redirected,
        status,
        statusText,
        type,
        url
      };
    }
    data = await getArrayBufferOrStringFromData(data, loader, options);
    const loaderWithParser = loader;
    if (loaderWithParser.parseTextSync && typeof data === "string") {
      return loaderWithParser.parseTextSync(data, options, context);
    }
    if (canParseWithWorker(loader, options)) {
      return await parseWithWorker(loader, data, options, context, parse$4);
    }
    if (loaderWithParser.parseText && typeof data === "string") {
      return await loaderWithParser.parseText(data, options, context);
    }
    if (loaderWithParser.parse) {
      return await loaderWithParser.parse(data, options, context);
    }
    assert$5(!loaderWithParser.parseSync);
    throw new Error(`${loader.id} loader - no parser found and worker is disabled`);
  }
  function getDataTypeFromTypedArray(array) {
    switch (array.constructor) {
      case Int8Array:
        return "int8";
      case Uint8Array:
      case Uint8ClampedArray:
        return "uint8";
      case Int16Array:
        return "int16";
      case Uint16Array:
        return "uint16";
      case Int32Array:
        return "int32";
      case Uint32Array:
        return "uint32";
      case Float32Array:
        return "float32";
      case Float64Array:
        return "float64";
      default:
        return "null";
    }
  }
  function getMeshBoundingBox(attributes) {
    let minX = Infinity;
    let minY = Infinity;
    let minZ = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let maxZ = -Infinity;
    const positions = attributes.POSITION ? attributes.POSITION.value : [];
    const len2 = positions && positions.length;
    for (let i2 = 0; i2 < len2; i2 += 3) {
      const x = positions[i2];
      const y = positions[i2 + 1];
      const z = positions[i2 + 2];
      minX = x < minX ? x : minX;
      minY = y < minY ? y : minY;
      minZ = z < minZ ? z : minZ;
      maxX = x > maxX ? x : maxX;
      maxY = y > maxY ? y : maxY;
      maxZ = z > maxZ ? z : maxZ;
    }
    return [[minX, minY, minZ], [maxX, maxY, maxZ]];
  }
  function deduceMeshField(name2, attribute, optionalMetadata) {
    const type = getDataTypeFromTypedArray(attribute.value);
    const metadata = optionalMetadata ? optionalMetadata : makeMeshAttributeMetadata(attribute);
    return {
      name: name2,
      type: {
        type: "fixed-size-list",
        listSize: attribute.size,
        children: [{
          name: "value",
          type
        }]
      },
      nullable: false,
      metadata
    };
  }
  function makeMeshAttributeMetadata(attribute) {
    const result = {};
    if ("byteOffset" in attribute) {
      result.byteOffset = attribute.byteOffset.toString(10);
    }
    if ("byteStride" in attribute) {
      result.byteStride = attribute.byteStride.toString(10);
    }
    if ("normalized" in attribute) {
      result.normalized = attribute.normalized.toString();
    }
    return result;
  }
  async function load(url, loaders, options, context) {
    let resolvedLoaders;
    let resolvedOptions;
    if (!Array.isArray(loaders) && !isLoaderObject(loaders)) {
      resolvedLoaders = [];
      resolvedOptions = loaders;
    } else {
      resolvedLoaders = loaders;
      resolvedOptions = options;
    }
    const fetch2 = getFetchFunction(resolvedOptions);
    let data = url;
    if (typeof url === "string") {
      data = await fetch2(url);
    }
    if (isBlob(url)) {
      data = await fetch2(url);
    }
    return Array.isArray(resolvedLoaders) ? await parse$4(data, resolvedLoaders, resolvedOptions) : await parse$4(data, resolvedLoaders, resolvedOptions);
  }
  const RADIANS_TO_DEGREES = 1 / Math.PI * 180;
  const DEGREES_TO_RADIANS = 1 / 180 * Math.PI;
  const DEFAULT_CONFIG = {
    EPSILON: 1e-12,
    debug: false,
    precision: 4,
    printTypes: false,
    printDegrees: false,
    printRowMajor: true,
    _cartographicRadians: false
  };
  globalThis.mathgl = globalThis.mathgl || {
    config: {
      ...DEFAULT_CONFIG
    }
  };
  const config = globalThis.mathgl.config;
  function formatValue(value, {
    precision = config.precision
  } = {}) {
    value = round(value);
    return "".concat(parseFloat(value.toPrecision(precision)));
  }
  function isArray(value) {
    return Array.isArray(value) || ArrayBuffer.isView(value) && !(value instanceof DataView);
  }
  function toRadians(degrees2) {
    return radians(degrees2);
  }
  function toDegrees(radians2) {
    return degrees(radians2);
  }
  function radians(degrees2, result) {
    return map(degrees2, (degrees3) => degrees3 * DEGREES_TO_RADIANS, result);
  }
  function degrees(radians2, result) {
    return map(radians2, (radians3) => radians3 * RADIANS_TO_DEGREES, result);
  }
  function clamp(value, min, max) {
    return map(value, (value2) => Math.max(min, Math.min(max, value2)));
  }
  function equals$1(a2, b, epsilon) {
    const oldEpsilon = config.EPSILON;
    if (epsilon) {
      config.EPSILON = epsilon;
    }
    try {
      if (a2 === b) {
        return true;
      }
      if (isArray(a2) && isArray(b)) {
        if (a2.length !== b.length) {
          return false;
        }
        for (let i2 = 0; i2 < a2.length; ++i2) {
          if (!equals$1(a2[i2], b[i2])) {
            return false;
          }
        }
        return true;
      }
      if (a2 && a2.equals) {
        return a2.equals(b);
      }
      if (b && b.equals) {
        return b.equals(a2);
      }
      if (typeof a2 === "number" && typeof b === "number") {
        return Math.abs(a2 - b) <= config.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b));
      }
      return false;
    } finally {
      config.EPSILON = oldEpsilon;
    }
  }
  function round(value) {
    return Math.round(value / config.EPSILON) * config.EPSILON;
  }
  function duplicateArray(array) {
    return array.clone ? array.clone() : new Array(array.length);
  }
  function map(value, func, result) {
    if (isArray(value)) {
      const array = value;
      result = result || duplicateArray(array);
      for (let i2 = 0; i2 < result.length && i2 < array.length; ++i2) {
        const val = typeof value === "number" ? value : value[i2];
        result[i2] = func(val, i2, result);
      }
      return result;
    }
    return func(value);
  }
  function _extendableBuiltin(cls) {
    function ExtendableBuiltin() {
      var instance = Reflect.construct(cls, Array.from(arguments));
      Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
      return instance;
    }
    ExtendableBuiltin.prototype = Object.create(cls.prototype, {
      constructor: {
        value: cls,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(ExtendableBuiltin, cls);
    } else {
      ExtendableBuiltin.__proto__ = cls;
    }
    return ExtendableBuiltin;
  }
  class MathArray extends _extendableBuiltin(Array) {
    clone() {
      return new this.constructor().copy(this);
    }
    fromArray(array, offset = 0) {
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        this[i2] = array[i2 + offset];
      }
      return this.check();
    }
    toArray(targetArray = [], offset = 0) {
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        targetArray[offset + i2] = this[i2];
      }
      return targetArray;
    }
    toObject(targetObject) {
      return targetObject;
    }
    from(arrayOrObject) {
      return Array.isArray(arrayOrObject) ? this.copy(arrayOrObject) : this.fromObject(arrayOrObject);
    }
    to(arrayOrObject) {
      if (arrayOrObject === this) {
        return this;
      }
      return isArray(arrayOrObject) ? this.toArray(arrayOrObject) : this.toObject(arrayOrObject);
    }
    toTarget(target) {
      return target ? this.to(target) : this;
    }
    toFloat32Array() {
      return new Float32Array(this);
    }
    toString() {
      return this.formatString(config);
    }
    formatString(opts) {
      let string = "";
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        string += (i2 > 0 ? ", " : "") + formatValue(this[i2], opts);
      }
      return "".concat(opts.printTypes ? this.constructor.name : "", "[").concat(string, "]");
    }
    equals(array) {
      if (!array || this.length !== array.length) {
        return false;
      }
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        if (!equals$1(this[i2], array[i2])) {
          return false;
        }
      }
      return true;
    }
    exactEquals(array) {
      if (!array || this.length !== array.length) {
        return false;
      }
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        if (this[i2] !== array[i2]) {
          return false;
        }
      }
      return true;
    }
    negate() {
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        this[i2] = -this[i2];
      }
      return this.check();
    }
    lerp(a2, b, t) {
      if (t === void 0) {
        return this.lerp(this, a2, b);
      }
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        const ai = a2[i2];
        const endValue = typeof b === "number" ? b : b[i2];
        this[i2] = ai + t * (endValue - ai);
      }
      return this.check();
    }
    min(vector) {
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        this[i2] = Math.min(vector[i2], this[i2]);
      }
      return this.check();
    }
    max(vector) {
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        this[i2] = Math.max(vector[i2], this[i2]);
      }
      return this.check();
    }
    clamp(minVector, maxVector) {
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        this[i2] = Math.min(Math.max(this[i2], minVector[i2]), maxVector[i2]);
      }
      return this.check();
    }
    add(...vectors) {
      for (const vector of vectors) {
        for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
          this[i2] += vector[i2];
        }
      }
      return this.check();
    }
    subtract(...vectors) {
      for (const vector of vectors) {
        for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
          this[i2] -= vector[i2];
        }
      }
      return this.check();
    }
    scale(scale2) {
      if (typeof scale2 === "number") {
        for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
          this[i2] *= scale2;
        }
      } else {
        for (let i2 = 0; i2 < this.ELEMENTS && i2 < scale2.length; ++i2) {
          this[i2] *= scale2[i2];
        }
      }
      return this.check();
    }
    multiplyByScalar(scalar) {
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        this[i2] *= scalar;
      }
      return this.check();
    }
    check() {
      if (config.debug && !this.validate()) {
        throw new Error("math.gl: ".concat(this.constructor.name, " some fields set to invalid numbers'"));
      }
      return this;
    }
    validate() {
      let valid = this.length === this.ELEMENTS;
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        valid = valid && Number.isFinite(this[i2]);
      }
      return valid;
    }
    sub(a2) {
      return this.subtract(a2);
    }
    setScalar(a2) {
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        this[i2] = a2;
      }
      return this.check();
    }
    addScalar(a2) {
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        this[i2] += a2;
      }
      return this.check();
    }
    subScalar(a2) {
      return this.addScalar(-a2);
    }
    multiplyScalar(scalar) {
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        this[i2] *= scalar;
      }
      return this.check();
    }
    divideScalar(a2) {
      return this.multiplyByScalar(1 / a2);
    }
    clampScalar(min, max) {
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        this[i2] = Math.min(Math.max(this[i2], min), max);
      }
      return this.check();
    }
    get elements() {
      return this;
    }
  }
  function validateVector(v, length2) {
    if (v.length !== length2) {
      return false;
    }
    for (let i2 = 0; i2 < v.length; ++i2) {
      if (!Number.isFinite(v[i2])) {
        return false;
      }
    }
    return true;
  }
  function checkNumber(value) {
    if (!Number.isFinite(value)) {
      throw new Error("Invalid number ".concat(JSON.stringify(value)));
    }
    return value;
  }
  function checkVector(v, length2, callerName = "") {
    if (config.debug && !validateVector(v, length2)) {
      throw new Error("math.gl: ".concat(callerName, " some fields set to invalid numbers'"));
    }
    return v;
  }
  function assert$3(condition, message) {
    if (!condition) {
      throw new Error("math.gl assertion ".concat(message));
    }
  }
  class Vector extends MathArray {
    get x() {
      return this[0];
    }
    set x(value) {
      this[0] = checkNumber(value);
    }
    get y() {
      return this[1];
    }
    set y(value) {
      this[1] = checkNumber(value);
    }
    len() {
      return Math.sqrt(this.lengthSquared());
    }
    magnitude() {
      return this.len();
    }
    lengthSquared() {
      let length2 = 0;
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        length2 += this[i2] * this[i2];
      }
      return length2;
    }
    magnitudeSquared() {
      return this.lengthSquared();
    }
    distance(mathArray) {
      return Math.sqrt(this.distanceSquared(mathArray));
    }
    distanceSquared(mathArray) {
      let length2 = 0;
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        const dist = this[i2] - mathArray[i2];
        length2 += dist * dist;
      }
      return checkNumber(length2);
    }
    dot(mathArray) {
      let product = 0;
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        product += this[i2] * mathArray[i2];
      }
      return checkNumber(product);
    }
    normalize() {
      const length2 = this.magnitude();
      if (length2 !== 0) {
        for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
          this[i2] /= length2;
        }
      }
      return this.check();
    }
    multiply(...vectors) {
      for (const vector of vectors) {
        for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
          this[i2] *= vector[i2];
        }
      }
      return this.check();
    }
    divide(...vectors) {
      for (const vector of vectors) {
        for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
          this[i2] /= vector[i2];
        }
      }
      return this.check();
    }
    lengthSq() {
      return this.lengthSquared();
    }
    distanceTo(vector) {
      return this.distance(vector);
    }
    distanceToSquared(vector) {
      return this.distanceSquared(vector);
    }
    getComponent(i2) {
      assert$3(i2 >= 0 && i2 < this.ELEMENTS, "index is out of range");
      return checkNumber(this[i2]);
    }
    setComponent(i2, value) {
      assert$3(i2 >= 0 && i2 < this.ELEMENTS, "index is out of range");
      this[i2] = value;
      return this.check();
    }
    addVectors(a2, b) {
      return this.copy(a2).add(b);
    }
    subVectors(a2, b) {
      return this.copy(a2).subtract(b);
    }
    multiplyVectors(a2, b) {
      return this.copy(a2).multiply(b);
    }
    addScaledVector(a2, b) {
      return this.add(new this.constructor(a2).multiplyScalar(b));
    }
  }
  const EPSILON = 1e-6;
  let ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
  function create$4() {
    const out = new ARRAY_TYPE(2);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
    }
    return out;
  }
  function transformMat2(out, a2, m) {
    const x = a2[0];
    const y = a2[1];
    out[0] = m[0] * x + m[2] * y;
    out[1] = m[1] * x + m[3] * y;
    return out;
  }
  function transformMat2d(out, a2, m) {
    const x = a2[0];
    const y = a2[1];
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
  }
  function transformMat3$1(out, a2, m) {
    const x = a2[0];
    const y = a2[1];
    out[0] = m[0] * x + m[3] * y + m[6];
    out[1] = m[1] * x + m[4] * y + m[7];
    return out;
  }
  function transformMat4$2(out, a2, m) {
    const x = a2[0];
    const y = a2[1];
    out[0] = m[0] * x + m[4] * y + m[12];
    out[1] = m[1] * x + m[5] * y + m[13];
    return out;
  }
  (function() {
    const vec = create$4();
    return function(a2, stride, offset, count, fn, arg) {
      let i2;
      let l2;
      if (!stride) {
        stride = 2;
      }
      if (!offset) {
        offset = 0;
      }
      if (count) {
        l2 = Math.min(count * stride + offset, a2.length);
      } else {
        l2 = a2.length;
      }
      for (i2 = offset; i2 < l2; i2 += stride) {
        vec[0] = a2[i2];
        vec[1] = a2[i2 + 1];
        fn(vec, vec, arg);
        a2[i2] = vec[0];
        a2[i2 + 1] = vec[1];
      }
      return a2;
    };
  })();
  function vec2_transformMat4AsVector(out, a2, m) {
    const x = a2[0];
    const y = a2[1];
    const w = m[3] * x + m[7] * y || 1;
    out[0] = (m[0] * x + m[4] * y) / w;
    out[1] = (m[1] * x + m[5] * y) / w;
    return out;
  }
  function vec3_transformMat4AsVector(out, a2, m) {
    const x = a2[0];
    const y = a2[1];
    const z = a2[2];
    const w = m[3] * x + m[7] * y + m[11] * z || 1;
    out[0] = (m[0] * x + m[4] * y + m[8] * z) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z) / w;
    return out;
  }
  function vec3_transformMat2(out, a2, m) {
    const x = a2[0];
    const y = a2[1];
    out[0] = m[0] * x + m[2] * y;
    out[1] = m[1] * x + m[3] * y;
    out[2] = a2[2];
    return out;
  }
  function vec4_transformMat2(out, a2, m) {
    const x = a2[0];
    const y = a2[1];
    out[0] = m[0] * x + m[2] * y;
    out[1] = m[1] * x + m[3] * y;
    out[2] = a2[2];
    out[3] = a2[3];
    return out;
  }
  function vec4_transformMat3(out, a2, m) {
    const x = a2[0];
    const y = a2[1];
    const z = a2[2];
    out[0] = m[0] * x + m[3] * y + m[6] * z;
    out[1] = m[1] * x + m[4] * y + m[7] * z;
    out[2] = m[2] * x + m[5] * y + m[8] * z;
    out[3] = a2[3];
    return out;
  }
  class Vector2 extends Vector {
    constructor(x = 0, y = 0) {
      super(2);
      if (isArray(x) && arguments.length === 1) {
        this.copy(x);
      } else {
        if (config.debug) {
          checkNumber(x);
          checkNumber(y);
        }
        this[0] = x;
        this[1] = y;
      }
    }
    set(x, y) {
      this[0] = x;
      this[1] = y;
      return this.check();
    }
    copy(array) {
      this[0] = array[0];
      this[1] = array[1];
      return this.check();
    }
    fromObject(object) {
      if (config.debug) {
        checkNumber(object.x);
        checkNumber(object.y);
      }
      this[0] = object.x;
      this[1] = object.y;
      return this.check();
    }
    toObject(object) {
      object.x = this[0];
      object.y = this[1];
      return object;
    }
    get ELEMENTS() {
      return 2;
    }
    horizontalAngle() {
      return Math.atan2(this.y, this.x);
    }
    verticalAngle() {
      return Math.atan2(this.x, this.y);
    }
    transform(matrix4) {
      return this.transformAsPoint(matrix4);
    }
    transformAsPoint(matrix4) {
      transformMat4$2(this, this, matrix4);
      return this.check();
    }
    transformAsVector(matrix4) {
      vec2_transformMat4AsVector(this, this, matrix4);
      return this.check();
    }
    transformByMatrix3(matrix3) {
      transformMat3$1(this, this, matrix3);
      return this.check();
    }
    transformByMatrix2x3(matrix2x3) {
      transformMat2d(this, this, matrix2x3);
      return this.check();
    }
    transformByMatrix2(matrix2) {
      transformMat2(this, this, matrix2);
      return this.check();
    }
  }
  function create$3() {
    const out = new ARRAY_TYPE(3);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }
    return out;
  }
  function length$2(a2) {
    const x = a2[0];
    const y = a2[1];
    const z = a2[2];
    return Math.sqrt(x * x + y * y + z * z);
  }
  function fromValues(x, y, z) {
    const out = new ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  function normalize$2(out, a2) {
    const x = a2[0];
    const y = a2[1];
    const z = a2[2];
    let len2 = x * x + y * y + z * z;
    if (len2 > 0) {
      len2 = 1 / Math.sqrt(len2);
    }
    out[0] = a2[0] * len2;
    out[1] = a2[1] * len2;
    out[2] = a2[2] * len2;
    return out;
  }
  function dot$2(a2, b) {
    return a2[0] * b[0] + a2[1] * b[1] + a2[2] * b[2];
  }
  function cross(out, a2, b) {
    const ax = a2[0];
    const ay = a2[1];
    const az = a2[2];
    const bx = b[0];
    const by = b[1];
    const bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  }
  function transformMat4$1(out, a2, m) {
    const x = a2[0];
    const y = a2[1];
    const z = a2[2];
    let w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
  }
  function transformMat3(out, a2, m) {
    const x = a2[0];
    const y = a2[1];
    const z = a2[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
  }
  function transformQuat$1(out, a2, q) {
    const qx = q[0];
    const qy = q[1];
    const qz = q[2];
    const qw = q[3];
    const x = a2[0];
    const y = a2[1];
    const z = a2[2];
    let uvx = qy * z - qz * y;
    let uvy = qz * x - qx * z;
    let uvz = qx * y - qy * x;
    let uuvx = qy * uvz - qz * uvy;
    let uuvy = qz * uvx - qx * uvz;
    let uuvz = qx * uvy - qy * uvx;
    const w2 = qw * 2;
    uvx *= w2;
    uvy *= w2;
    uvz *= w2;
    uuvx *= 2;
    uuvy *= 2;
    uuvz *= 2;
    out[0] = x + uvx + uuvx;
    out[1] = y + uvy + uuvy;
    out[2] = z + uvz + uuvz;
    return out;
  }
  function rotateX$2(out, a2, b, rad) {
    const p = [];
    const r2 = [];
    p[0] = a2[0] - b[0];
    p[1] = a2[1] - b[1];
    p[2] = a2[2] - b[2];
    r2[0] = p[0];
    r2[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
    r2[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad);
    out[0] = r2[0] + b[0];
    out[1] = r2[1] + b[1];
    out[2] = r2[2] + b[2];
    return out;
  }
  function rotateY$2(out, a2, b, rad) {
    const p = [];
    const r2 = [];
    p[0] = a2[0] - b[0];
    p[1] = a2[1] - b[1];
    p[2] = a2[2] - b[2];
    r2[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
    r2[1] = p[1];
    r2[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad);
    out[0] = r2[0] + b[0];
    out[1] = r2[1] + b[1];
    out[2] = r2[2] + b[2];
    return out;
  }
  function rotateZ$2(out, a2, b, rad) {
    const p = [];
    const r2 = [];
    p[0] = a2[0] - b[0];
    p[1] = a2[1] - b[1];
    p[2] = a2[2] - b[2];
    r2[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
    r2[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
    r2[2] = p[2];
    out[0] = r2[0] + b[0];
    out[1] = r2[1] + b[1];
    out[2] = r2[2] + b[2];
    return out;
  }
  function angle(a2, b) {
    const ax = a2[0];
    const ay = a2[1];
    const az = a2[2];
    const bx = b[0];
    const by = b[1];
    const bz = b[2];
    const mag = Math.sqrt((ax * ax + ay * ay + az * az) * (bx * bx + by * by + bz * bz));
    const cosine = mag && dot$2(a2, b) / mag;
    return Math.acos(Math.min(Math.max(cosine, -1), 1));
  }
  const len = length$2;
  (function() {
    const vec = create$3();
    return function(a2, stride, offset, count, fn, arg) {
      let i2;
      let l2;
      if (!stride) {
        stride = 3;
      }
      if (!offset) {
        offset = 0;
      }
      if (count) {
        l2 = Math.min(count * stride + offset, a2.length);
      } else {
        l2 = a2.length;
      }
      for (i2 = offset; i2 < l2; i2 += stride) {
        vec[0] = a2[i2];
        vec[1] = a2[i2 + 1];
        vec[2] = a2[i2 + 2];
        fn(vec, vec, arg);
        a2[i2] = vec[0];
        a2[i2 + 1] = vec[1];
        a2[i2 + 2] = vec[2];
      }
      return a2;
    };
  })();
  const ORIGIN = [0, 0, 0];
  let ZERO$3;
  class Vector3 extends Vector {
    static get ZERO() {
      if (!ZERO$3) {
        ZERO$3 = new Vector3(0, 0, 0);
        Object.freeze(ZERO$3);
      }
      return ZERO$3;
    }
    constructor(x = 0, y = 0, z = 0) {
      super(-0, -0, -0);
      if (arguments.length === 1 && isArray(x)) {
        this.copy(x);
      } else {
        if (config.debug) {
          checkNumber(x);
          checkNumber(y);
          checkNumber(z);
        }
        this[0] = x;
        this[1] = y;
        this[2] = z;
      }
    }
    set(x, y, z) {
      this[0] = x;
      this[1] = y;
      this[2] = z;
      return this.check();
    }
    copy(array) {
      this[0] = array[0];
      this[1] = array[1];
      this[2] = array[2];
      return this.check();
    }
    fromObject(object) {
      if (config.debug) {
        checkNumber(object.x);
        checkNumber(object.y);
        checkNumber(object.z);
      }
      this[0] = object.x;
      this[1] = object.y;
      this[2] = object.z;
      return this.check();
    }
    toObject(object) {
      object.x = this[0];
      object.y = this[1];
      object.z = this[2];
      return object;
    }
    get ELEMENTS() {
      return 3;
    }
    get z() {
      return this[2];
    }
    set z(value) {
      this[2] = checkNumber(value);
    }
    angle(vector) {
      return angle(this, vector);
    }
    cross(vector) {
      cross(this, this, vector);
      return this.check();
    }
    rotateX({
      radians: radians2,
      origin = ORIGIN
    }) {
      rotateX$2(this, this, origin, radians2);
      return this.check();
    }
    rotateY({
      radians: radians2,
      origin = ORIGIN
    }) {
      rotateY$2(this, this, origin, radians2);
      return this.check();
    }
    rotateZ({
      radians: radians2,
      origin = ORIGIN
    }) {
      rotateZ$2(this, this, origin, radians2);
      return this.check();
    }
    transform(matrix4) {
      return this.transformAsPoint(matrix4);
    }
    transformAsPoint(matrix4) {
      transformMat4$1(this, this, matrix4);
      return this.check();
    }
    transformAsVector(matrix4) {
      vec3_transformMat4AsVector(this, this, matrix4);
      return this.check();
    }
    transformByMatrix3(matrix3) {
      transformMat3(this, this, matrix3);
      return this.check();
    }
    transformByMatrix2(matrix2) {
      vec3_transformMat2(this, this, matrix2);
      return this.check();
    }
    transformByQuaternion(quaternion) {
      transformQuat$1(this, this, quaternion);
      return this.check();
    }
  }
  let ZERO$2;
  class Vector4 extends Vector {
    static get ZERO() {
      if (!ZERO$2) {
        ZERO$2 = new Vector4(0, 0, 0, 0);
        Object.freeze(ZERO$2);
      }
      return ZERO$2;
    }
    constructor(x = 0, y = 0, z = 0, w = 0) {
      super(-0, -0, -0, -0);
      if (isArray(x) && arguments.length === 1) {
        this.copy(x);
      } else {
        if (config.debug) {
          checkNumber(x);
          checkNumber(y);
          checkNumber(z);
          checkNumber(w);
        }
        this[0] = x;
        this[1] = y;
        this[2] = z;
        this[3] = w;
      }
    }
    set(x, y, z, w) {
      this[0] = x;
      this[1] = y;
      this[2] = z;
      this[3] = w;
      return this.check();
    }
    copy(array) {
      this[0] = array[0];
      this[1] = array[1];
      this[2] = array[2];
      this[3] = array[3];
      return this.check();
    }
    fromObject(object) {
      if (config.debug) {
        checkNumber(object.x);
        checkNumber(object.y);
        checkNumber(object.z);
        checkNumber(object.w);
      }
      this[0] = object.x;
      this[1] = object.y;
      this[2] = object.z;
      this[3] = object.w;
      return this;
    }
    toObject(object) {
      object.x = this[0];
      object.y = this[1];
      object.z = this[2];
      object.w = this[3];
      return object;
    }
    get ELEMENTS() {
      return 4;
    }
    get z() {
      return this[2];
    }
    set z(value) {
      this[2] = checkNumber(value);
    }
    get w() {
      return this[3];
    }
    set w(value) {
      this[3] = checkNumber(value);
    }
    transform(matrix4) {
      transformMat4$1(this, this, matrix4);
      return this.check();
    }
    transformByMatrix3(matrix3) {
      vec4_transformMat3(this, this, matrix3);
      return this.check();
    }
    transformByMatrix2(matrix2) {
      vec4_transformMat2(this, this, matrix2);
      return this.check();
    }
    transformByQuaternion(quaternion) {
      transformQuat$1(this, this, quaternion);
      return this.check();
    }
    applyMatrix4(m) {
      m.transform(this, this);
      return this;
    }
  }
  class Matrix extends MathArray {
    toString() {
      let string = "[";
      if (config.printRowMajor) {
        string += "row-major:";
        for (let row = 0; row < this.RANK; ++row) {
          for (let col = 0; col < this.RANK; ++col) {
            string += " ".concat(this[col * this.RANK + row]);
          }
        }
      } else {
        string += "column-major:";
        for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
          string += " ".concat(this[i2]);
        }
      }
      string += "]";
      return string;
    }
    getElementIndex(row, col) {
      return col * this.RANK + row;
    }
    getElement(row, col) {
      return this[col * this.RANK + row];
    }
    setElement(row, col, value) {
      this[col * this.RANK + row] = checkNumber(value);
      return this;
    }
    getColumn(columnIndex, result = new Array(this.RANK).fill(-0)) {
      const firstIndex = columnIndex * this.RANK;
      for (let i2 = 0; i2 < this.RANK; ++i2) {
        result[i2] = this[firstIndex + i2];
      }
      return result;
    }
    setColumn(columnIndex, columnVector) {
      const firstIndex = columnIndex * this.RANK;
      for (let i2 = 0; i2 < this.RANK; ++i2) {
        this[firstIndex + i2] = columnVector[i2];
      }
      return this;
    }
  }
  function create$2() {
    const out = new ARRAY_TYPE(9);
    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[5] = 0;
      out[6] = 0;
      out[7] = 0;
    }
    out[0] = 1;
    out[4] = 1;
    out[8] = 1;
    return out;
  }
  function transpose$1(out, a2) {
    if (out === a2) {
      const a01 = a2[1];
      const a02 = a2[2];
      const a12 = a2[5];
      out[1] = a2[3];
      out[2] = a2[6];
      out[3] = a01;
      out[5] = a2[7];
      out[6] = a02;
      out[7] = a12;
    } else {
      out[0] = a2[0];
      out[1] = a2[3];
      out[2] = a2[6];
      out[3] = a2[1];
      out[4] = a2[4];
      out[5] = a2[7];
      out[6] = a2[2];
      out[7] = a2[5];
      out[8] = a2[8];
    }
    return out;
  }
  function invert$2(out, a2) {
    const a00 = a2[0];
    const a01 = a2[1];
    const a02 = a2[2];
    const a10 = a2[3];
    const a11 = a2[4];
    const a12 = a2[5];
    const a20 = a2[6];
    const a21 = a2[7];
    const a22 = a2[8];
    const b01 = a22 * a11 - a12 * a21;
    const b11 = -a22 * a10 + a12 * a20;
    const b21 = a21 * a10 - a11 * a20;
    let det = a00 * b01 + a01 * b11 + a02 * b21;
    if (!det) {
      return null;
    }
    det = 1 / det;
    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
  }
  function determinant$1(a2) {
    const a00 = a2[0];
    const a01 = a2[1];
    const a02 = a2[2];
    const a10 = a2[3];
    const a11 = a2[4];
    const a12 = a2[5];
    const a20 = a2[6];
    const a21 = a2[7];
    const a22 = a2[8];
    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
  }
  function multiply$2(out, a2, b) {
    const a00 = a2[0];
    const a01 = a2[1];
    const a02 = a2[2];
    const a10 = a2[3];
    const a11 = a2[4];
    const a12 = a2[5];
    const a20 = a2[6];
    const a21 = a2[7];
    const a22 = a2[8];
    const b00 = b[0];
    const b01 = b[1];
    const b02 = b[2];
    const b10 = b[3];
    const b11 = b[4];
    const b12 = b[5];
    const b20 = b[6];
    const b21 = b[7];
    const b22 = b[8];
    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;
    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;
    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
  }
  function translate$1(out, a2, v) {
    const a00 = a2[0];
    const a01 = a2[1];
    const a02 = a2[2];
    const a10 = a2[3];
    const a11 = a2[4];
    const a12 = a2[5];
    const a20 = a2[6];
    const a21 = a2[7];
    const a22 = a2[8];
    const x = v[0];
    const y = v[1];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a10;
    out[4] = a11;
    out[5] = a12;
    out[6] = x * a00 + y * a10 + a20;
    out[7] = x * a01 + y * a11 + a21;
    out[8] = x * a02 + y * a12 + a22;
    return out;
  }
  function rotate$1(out, a2, rad) {
    const a00 = a2[0];
    const a01 = a2[1];
    const a02 = a2[2];
    const a10 = a2[3];
    const a11 = a2[4];
    const a12 = a2[5];
    const a20 = a2[6];
    const a21 = a2[7];
    const a22 = a2[8];
    const s2 = Math.sin(rad);
    const c = Math.cos(rad);
    out[0] = c * a00 + s2 * a10;
    out[1] = c * a01 + s2 * a11;
    out[2] = c * a02 + s2 * a12;
    out[3] = c * a10 - s2 * a00;
    out[4] = c * a11 - s2 * a01;
    out[5] = c * a12 - s2 * a02;
    out[6] = a20;
    out[7] = a21;
    out[8] = a22;
    return out;
  }
  function scale$3(out, a2, v) {
    const x = v[0];
    const y = v[1];
    out[0] = x * a2[0];
    out[1] = x * a2[1];
    out[2] = x * a2[2];
    out[3] = y * a2[3];
    out[4] = y * a2[4];
    out[5] = y * a2[5];
    out[6] = a2[6];
    out[7] = a2[7];
    out[8] = a2[8];
    return out;
  }
  function fromQuat$1(out, q) {
    const x = q[0];
    const y = q[1];
    const z = q[2];
    const w = q[3];
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const yx = y * x2;
    const yy = y * y2;
    const zx = z * x2;
    const zy = z * y2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;
    out[0] = 1 - yy - zz;
    out[3] = yx - wz;
    out[6] = zx + wy;
    out[1] = yx + wz;
    out[4] = 1 - xx - zz;
    out[7] = zy - wx;
    out[2] = zx - wy;
    out[5] = zy + wx;
    out[8] = 1 - xx - yy;
    return out;
  }
  var INDICES$1;
  (function(INDICES2) {
    INDICES2[INDICES2["COL0ROW0"] = 0] = "COL0ROW0";
    INDICES2[INDICES2["COL0ROW1"] = 1] = "COL0ROW1";
    INDICES2[INDICES2["COL0ROW2"] = 2] = "COL0ROW2";
    INDICES2[INDICES2["COL1ROW0"] = 3] = "COL1ROW0";
    INDICES2[INDICES2["COL1ROW1"] = 4] = "COL1ROW1";
    INDICES2[INDICES2["COL1ROW2"] = 5] = "COL1ROW2";
    INDICES2[INDICES2["COL2ROW0"] = 6] = "COL2ROW0";
    INDICES2[INDICES2["COL2ROW1"] = 7] = "COL2ROW1";
    INDICES2[INDICES2["COL2ROW2"] = 8] = "COL2ROW2";
  })(INDICES$1 || (INDICES$1 = {}));
  const IDENTITY_MATRIX$1 = Object.freeze([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  class Matrix3 extends Matrix {
    static get IDENTITY() {
      return getIdentityMatrix$1();
    }
    static get ZERO() {
      return getZeroMatrix$1();
    }
    get ELEMENTS() {
      return 9;
    }
    get RANK() {
      return 3;
    }
    get INDICES() {
      return INDICES$1;
    }
    constructor(array, ...args) {
      super(-0, -0, -0, -0, -0, -0, -0, -0, -0);
      if (arguments.length === 1 && Array.isArray(array)) {
        this.copy(array);
      } else if (args.length > 0) {
        this.copy([array, ...args]);
      } else {
        this.identity();
      }
    }
    copy(array) {
      this[0] = array[0];
      this[1] = array[1];
      this[2] = array[2];
      this[3] = array[3];
      this[4] = array[4];
      this[5] = array[5];
      this[6] = array[6];
      this[7] = array[7];
      this[8] = array[8];
      return this.check();
    }
    identity() {
      return this.copy(IDENTITY_MATRIX$1);
    }
    fromObject(object) {
      return this.check();
    }
    fromQuaternion(q) {
      fromQuat$1(this, q);
      return this.check();
    }
    set(m00, m10, m20, m01, m11, m21, m02, m12, m22) {
      this[0] = m00;
      this[1] = m10;
      this[2] = m20;
      this[3] = m01;
      this[4] = m11;
      this[5] = m21;
      this[6] = m02;
      this[7] = m12;
      this[8] = m22;
      return this.check();
    }
    setRowMajor(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
      this[0] = m00;
      this[1] = m10;
      this[2] = m20;
      this[3] = m01;
      this[4] = m11;
      this[5] = m21;
      this[6] = m02;
      this[7] = m12;
      this[8] = m22;
      return this.check();
    }
    determinant() {
      return determinant$1(this);
    }
    transpose() {
      transpose$1(this, this);
      return this.check();
    }
    invert() {
      invert$2(this, this);
      return this.check();
    }
    multiplyLeft(a2) {
      multiply$2(this, a2, this);
      return this.check();
    }
    multiplyRight(a2) {
      multiply$2(this, this, a2);
      return this.check();
    }
    rotate(radians2) {
      rotate$1(this, this, radians2);
      return this.check();
    }
    scale(factor) {
      if (Array.isArray(factor)) {
        scale$3(this, this, factor);
      } else {
        scale$3(this, this, [factor, factor]);
      }
      return this.check();
    }
    translate(vec) {
      translate$1(this, this, vec);
      return this.check();
    }
    transform(vector, result) {
      let out;
      switch (vector.length) {
        case 2:
          out = transformMat3$1(result || [-0, -0], vector, this);
          break;
        case 3:
          out = transformMat3(result || [-0, -0, -0], vector, this);
          break;
        case 4:
          out = vec4_transformMat3(result || [-0, -0, -0, -0], vector, this);
          break;
        default:
          throw new Error("Illegal vector");
      }
      checkVector(out, vector.length);
      return out;
    }
    transformVector(vector, result) {
      return this.transform(vector, result);
    }
    transformVector2(vector, result) {
      return this.transform(vector, result);
    }
    transformVector3(vector, result) {
      return this.transform(vector, result);
    }
  }
  let ZERO_MATRIX3;
  let IDENTITY_MATRIX3 = null;
  function getZeroMatrix$1() {
    if (!ZERO_MATRIX3) {
      ZERO_MATRIX3 = new Matrix3([0, 0, 0, 0, 0, 0, 0, 0, 0]);
      Object.freeze(ZERO_MATRIX3);
    }
    return ZERO_MATRIX3;
  }
  function getIdentityMatrix$1() {
    if (!IDENTITY_MATRIX3) {
      IDENTITY_MATRIX3 = new Matrix3();
      Object.freeze(IDENTITY_MATRIX3);
    }
    return IDENTITY_MATRIX3;
  }
  function identity$2(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function transpose(out, a2) {
    if (out === a2) {
      const a01 = a2[1];
      const a02 = a2[2];
      const a03 = a2[3];
      const a12 = a2[6];
      const a13 = a2[7];
      const a23 = a2[11];
      out[1] = a2[4];
      out[2] = a2[8];
      out[3] = a2[12];
      out[4] = a01;
      out[6] = a2[9];
      out[7] = a2[13];
      out[8] = a02;
      out[9] = a12;
      out[11] = a2[14];
      out[12] = a03;
      out[13] = a13;
      out[14] = a23;
    } else {
      out[0] = a2[0];
      out[1] = a2[4];
      out[2] = a2[8];
      out[3] = a2[12];
      out[4] = a2[1];
      out[5] = a2[5];
      out[6] = a2[9];
      out[7] = a2[13];
      out[8] = a2[2];
      out[9] = a2[6];
      out[10] = a2[10];
      out[11] = a2[14];
      out[12] = a2[3];
      out[13] = a2[7];
      out[14] = a2[11];
      out[15] = a2[15];
    }
    return out;
  }
  function invert$1(out, a2) {
    const a00 = a2[0];
    const a01 = a2[1];
    const a02 = a2[2];
    const a03 = a2[3];
    const a10 = a2[4];
    const a11 = a2[5];
    const a12 = a2[6];
    const a13 = a2[7];
    const a20 = a2[8];
    const a21 = a2[9];
    const a22 = a2[10];
    const a23 = a2[11];
    const a30 = a2[12];
    const a31 = a2[13];
    const a32 = a2[14];
    const a33 = a2[15];
    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) {
      return null;
    }
    det = 1 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
  }
  function determinant(a2) {
    const a00 = a2[0];
    const a01 = a2[1];
    const a02 = a2[2];
    const a03 = a2[3];
    const a10 = a2[4];
    const a11 = a2[5];
    const a12 = a2[6];
    const a13 = a2[7];
    const a20 = a2[8];
    const a21 = a2[9];
    const a22 = a2[10];
    const a23 = a2[11];
    const a30 = a2[12];
    const a31 = a2[13];
    const a32 = a2[14];
    const a33 = a2[15];
    const b0 = a00 * a11 - a01 * a10;
    const b1 = a00 * a12 - a02 * a10;
    const b2 = a01 * a12 - a02 * a11;
    const b3 = a20 * a31 - a21 * a30;
    const b4 = a20 * a32 - a22 * a30;
    const b5 = a21 * a32 - a22 * a31;
    const b6 = a00 * b5 - a01 * b4 + a02 * b3;
    const b7 = a10 * b5 - a11 * b4 + a12 * b3;
    const b8 = a20 * b2 - a21 * b1 + a22 * b0;
    const b9 = a30 * b2 - a31 * b1 + a32 * b0;
    return a13 * b6 - a03 * b7 + a33 * b8 - a23 * b9;
  }
  function multiply$1(out, a2, b) {
    const a00 = a2[0];
    const a01 = a2[1];
    const a02 = a2[2];
    const a03 = a2[3];
    const a10 = a2[4];
    const a11 = a2[5];
    const a12 = a2[6];
    const a13 = a2[7];
    const a20 = a2[8];
    const a21 = a2[9];
    const a22 = a2[10];
    const a23 = a2[11];
    const a30 = a2[12];
    const a31 = a2[13];
    const a32 = a2[14];
    const a33 = a2[15];
    let b0 = b[0];
    let b1 = b[1];
    let b2 = b[2];
    let b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  }
  function translate(out, a2, v) {
    const x = v[0];
    const y = v[1];
    const z = v[2];
    let a00;
    let a01;
    let a02;
    let a03;
    let a10;
    let a11;
    let a12;
    let a13;
    let a20;
    let a21;
    let a22;
    let a23;
    if (a2 === out) {
      out[12] = a2[0] * x + a2[4] * y + a2[8] * z + a2[12];
      out[13] = a2[1] * x + a2[5] * y + a2[9] * z + a2[13];
      out[14] = a2[2] * x + a2[6] * y + a2[10] * z + a2[14];
      out[15] = a2[3] * x + a2[7] * y + a2[11] * z + a2[15];
    } else {
      a00 = a2[0];
      a01 = a2[1];
      a02 = a2[2];
      a03 = a2[3];
      a10 = a2[4];
      a11 = a2[5];
      a12 = a2[6];
      a13 = a2[7];
      a20 = a2[8];
      a21 = a2[9];
      a22 = a2[10];
      a23 = a2[11];
      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;
      out[12] = a00 * x + a10 * y + a20 * z + a2[12];
      out[13] = a01 * x + a11 * y + a21 * z + a2[13];
      out[14] = a02 * x + a12 * y + a22 * z + a2[14];
      out[15] = a03 * x + a13 * y + a23 * z + a2[15];
    }
    return out;
  }
  function scale$2(out, a2, v) {
    const x = v[0];
    const y = v[1];
    const z = v[2];
    out[0] = a2[0] * x;
    out[1] = a2[1] * x;
    out[2] = a2[2] * x;
    out[3] = a2[3] * x;
    out[4] = a2[4] * y;
    out[5] = a2[5] * y;
    out[6] = a2[6] * y;
    out[7] = a2[7] * y;
    out[8] = a2[8] * z;
    out[9] = a2[9] * z;
    out[10] = a2[10] * z;
    out[11] = a2[11] * z;
    out[12] = a2[12];
    out[13] = a2[13];
    out[14] = a2[14];
    out[15] = a2[15];
    return out;
  }
  function rotate(out, a2, rad, axis) {
    let x = axis[0];
    let y = axis[1];
    let z = axis[2];
    let len2 = Math.sqrt(x * x + y * y + z * z);
    let c;
    let s2;
    let t;
    let a00;
    let a01;
    let a02;
    let a03;
    let a10;
    let a11;
    let a12;
    let a13;
    let a20;
    let a21;
    let a22;
    let a23;
    let b00;
    let b01;
    let b02;
    let b10;
    let b11;
    let b12;
    let b20;
    let b21;
    let b22;
    if (len2 < EPSILON) {
      return null;
    }
    len2 = 1 / len2;
    x *= len2;
    y *= len2;
    z *= len2;
    s2 = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;
    a00 = a2[0];
    a01 = a2[1];
    a02 = a2[2];
    a03 = a2[3];
    a10 = a2[4];
    a11 = a2[5];
    a12 = a2[6];
    a13 = a2[7];
    a20 = a2[8];
    a21 = a2[9];
    a22 = a2[10];
    a23 = a2[11];
    b00 = x * x * t + c;
    b01 = y * x * t + z * s2;
    b02 = z * x * t - y * s2;
    b10 = x * y * t - z * s2;
    b11 = y * y * t + c;
    b12 = z * y * t + x * s2;
    b20 = x * z * t + y * s2;
    b21 = y * z * t - x * s2;
    b22 = z * z * t + c;
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    if (a2 !== out) {
      out[12] = a2[12];
      out[13] = a2[13];
      out[14] = a2[14];
      out[15] = a2[15];
    }
    return out;
  }
  function rotateX$1(out, a2, rad) {
    const s2 = Math.sin(rad);
    const c = Math.cos(rad);
    const a10 = a2[4];
    const a11 = a2[5];
    const a12 = a2[6];
    const a13 = a2[7];
    const a20 = a2[8];
    const a21 = a2[9];
    const a22 = a2[10];
    const a23 = a2[11];
    if (a2 !== out) {
      out[0] = a2[0];
      out[1] = a2[1];
      out[2] = a2[2];
      out[3] = a2[3];
      out[12] = a2[12];
      out[13] = a2[13];
      out[14] = a2[14];
      out[15] = a2[15];
    }
    out[4] = a10 * c + a20 * s2;
    out[5] = a11 * c + a21 * s2;
    out[6] = a12 * c + a22 * s2;
    out[7] = a13 * c + a23 * s2;
    out[8] = a20 * c - a10 * s2;
    out[9] = a21 * c - a11 * s2;
    out[10] = a22 * c - a12 * s2;
    out[11] = a23 * c - a13 * s2;
    return out;
  }
  function rotateY$1(out, a2, rad) {
    const s2 = Math.sin(rad);
    const c = Math.cos(rad);
    const a00 = a2[0];
    const a01 = a2[1];
    const a02 = a2[2];
    const a03 = a2[3];
    const a20 = a2[8];
    const a21 = a2[9];
    const a22 = a2[10];
    const a23 = a2[11];
    if (a2 !== out) {
      out[4] = a2[4];
      out[5] = a2[5];
      out[6] = a2[6];
      out[7] = a2[7];
      out[12] = a2[12];
      out[13] = a2[13];
      out[14] = a2[14];
      out[15] = a2[15];
    }
    out[0] = a00 * c - a20 * s2;
    out[1] = a01 * c - a21 * s2;
    out[2] = a02 * c - a22 * s2;
    out[3] = a03 * c - a23 * s2;
    out[8] = a00 * s2 + a20 * c;
    out[9] = a01 * s2 + a21 * c;
    out[10] = a02 * s2 + a22 * c;
    out[11] = a03 * s2 + a23 * c;
    return out;
  }
  function rotateZ$1(out, a2, rad) {
    const s2 = Math.sin(rad);
    const c = Math.cos(rad);
    const a00 = a2[0];
    const a01 = a2[1];
    const a02 = a2[2];
    const a03 = a2[3];
    const a10 = a2[4];
    const a11 = a2[5];
    const a12 = a2[6];
    const a13 = a2[7];
    if (a2 !== out) {
      out[8] = a2[8];
      out[9] = a2[9];
      out[10] = a2[10];
      out[11] = a2[11];
      out[12] = a2[12];
      out[13] = a2[13];
      out[14] = a2[14];
      out[15] = a2[15];
    }
    out[0] = a00 * c + a10 * s2;
    out[1] = a01 * c + a11 * s2;
    out[2] = a02 * c + a12 * s2;
    out[3] = a03 * c + a13 * s2;
    out[4] = a10 * c - a00 * s2;
    out[5] = a11 * c - a01 * s2;
    out[6] = a12 * c - a02 * s2;
    out[7] = a13 * c - a03 * s2;
    return out;
  }
  function getScaling(out, mat) {
    const m11 = mat[0];
    const m12 = mat[1];
    const m13 = mat[2];
    const m21 = mat[4];
    const m22 = mat[5];
    const m23 = mat[6];
    const m31 = mat[8];
    const m32 = mat[9];
    const m33 = mat[10];
    out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
    out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
    out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
    return out;
  }
  function fromQuat(out, q) {
    const x = q[0];
    const y = q[1];
    const z = q[2];
    const w = q[3];
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const yx = y * x2;
    const yy = y * y2;
    const zx = z * x2;
    const zy = z * y2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;
    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;
    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;
    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function frustum(out, left, right, bottom, top, near, far) {
    const rl = 1 / (right - left);
    const tb = 1 / (top - bottom);
    const nf = 1 / (near - far);
    out[0] = near * 2 * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = near * 2 * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = far * near * 2 * nf;
    out[15] = 0;
    return out;
  }
  function perspectiveNO(out, fovy, aspect, near, far) {
    const f2 = 1 / Math.tan(fovy / 2);
    out[0] = f2 / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f2;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      const nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }
    return out;
  }
  const perspective = perspectiveNO;
  function orthoNO(out, left, right, bottom, top, near, far) {
    const lr = 1 / (left - right);
    const bt = 1 / (bottom - top);
    const nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
  }
  const ortho = orthoNO;
  function lookAt(out, eye, center, up) {
    let len2;
    let x0;
    let x1;
    let x2;
    let y0;
    let y1;
    let y2;
    let z0;
    let z1;
    let z2;
    const eyex = eye[0];
    const eyey = eye[1];
    const eyez = eye[2];
    const upx = up[0];
    const upy = up[1];
    const upz = up[2];
    const centerx = center[0];
    const centery = center[1];
    const centerz = center[2];
    if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
      return identity$2(out);
    }
    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    len2 = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len2;
    z1 *= len2;
    z2 *= len2;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len2 = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len2) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len2 = 1 / len2;
      x0 *= len2;
      x1 *= len2;
      x2 *= len2;
    }
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len2 = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len2) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len2 = 1 / len2;
      y0 *= len2;
      y1 *= len2;
      y2 *= len2;
    }
    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;
    return out;
  }
  function create$1() {
    const out = new ARRAY_TYPE(4);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
    }
    return out;
  }
  function add$1(out, a2, b) {
    out[0] = a2[0] + b[0];
    out[1] = a2[1] + b[1];
    out[2] = a2[2] + b[2];
    out[3] = a2[3] + b[3];
    return out;
  }
  function scale$1(out, a2, b) {
    out[0] = a2[0] * b;
    out[1] = a2[1] * b;
    out[2] = a2[2] * b;
    out[3] = a2[3] * b;
    return out;
  }
  function length$1(a2) {
    const x = a2[0];
    const y = a2[1];
    const z = a2[2];
    const w = a2[3];
    return Math.sqrt(x * x + y * y + z * z + w * w);
  }
  function squaredLength$1(a2) {
    const x = a2[0];
    const y = a2[1];
    const z = a2[2];
    const w = a2[3];
    return x * x + y * y + z * z + w * w;
  }
  function normalize$1(out, a2) {
    const x = a2[0];
    const y = a2[1];
    const z = a2[2];
    const w = a2[3];
    let len2 = x * x + y * y + z * z + w * w;
    if (len2 > 0) {
      len2 = 1 / Math.sqrt(len2);
    }
    out[0] = x * len2;
    out[1] = y * len2;
    out[2] = z * len2;
    out[3] = w * len2;
    return out;
  }
  function dot$1(a2, b) {
    return a2[0] * b[0] + a2[1] * b[1] + a2[2] * b[2] + a2[3] * b[3];
  }
  function lerp$1(out, a2, b, t) {
    const ax = a2[0];
    const ay = a2[1];
    const az = a2[2];
    const aw = a2[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return out;
  }
  function transformMat4(out, a2, m) {
    const x = a2[0];
    const y = a2[1];
    const z = a2[2];
    const w = a2[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
  }
  function transformQuat(out, a2, q) {
    const x = a2[0];
    const y = a2[1];
    const z = a2[2];
    const qx = q[0];
    const qy = q[1];
    const qz = q[2];
    const qw = q[3];
    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    out[3] = a2[3];
    return out;
  }
  (function() {
    const vec = create$1();
    return function(a2, stride, offset, count, fn, arg) {
      let i2;
      let l2;
      if (!stride) {
        stride = 4;
      }
      if (!offset) {
        offset = 0;
      }
      if (count) {
        l2 = Math.min(count * stride + offset, a2.length);
      } else {
        l2 = a2.length;
      }
      for (i2 = offset; i2 < l2; i2 += stride) {
        vec[0] = a2[i2];
        vec[1] = a2[i2 + 1];
        vec[2] = a2[i2 + 2];
        vec[3] = a2[i2 + 3];
        fn(vec, vec, arg);
        a2[i2] = vec[0];
        a2[i2 + 1] = vec[1];
        a2[i2 + 2] = vec[2];
        a2[i2 + 3] = vec[3];
      }
      return a2;
    };
  })();
  var INDICES;
  (function(INDICES2) {
    INDICES2[INDICES2["COL0ROW0"] = 0] = "COL0ROW0";
    INDICES2[INDICES2["COL0ROW1"] = 1] = "COL0ROW1";
    INDICES2[INDICES2["COL0ROW2"] = 2] = "COL0ROW2";
    INDICES2[INDICES2["COL0ROW3"] = 3] = "COL0ROW3";
    INDICES2[INDICES2["COL1ROW0"] = 4] = "COL1ROW0";
    INDICES2[INDICES2["COL1ROW1"] = 5] = "COL1ROW1";
    INDICES2[INDICES2["COL1ROW2"] = 6] = "COL1ROW2";
    INDICES2[INDICES2["COL1ROW3"] = 7] = "COL1ROW3";
    INDICES2[INDICES2["COL2ROW0"] = 8] = "COL2ROW0";
    INDICES2[INDICES2["COL2ROW1"] = 9] = "COL2ROW1";
    INDICES2[INDICES2["COL2ROW2"] = 10] = "COL2ROW2";
    INDICES2[INDICES2["COL2ROW3"] = 11] = "COL2ROW3";
    INDICES2[INDICES2["COL3ROW0"] = 12] = "COL3ROW0";
    INDICES2[INDICES2["COL3ROW1"] = 13] = "COL3ROW1";
    INDICES2[INDICES2["COL3ROW2"] = 14] = "COL3ROW2";
    INDICES2[INDICES2["COL3ROW3"] = 15] = "COL3ROW3";
  })(INDICES || (INDICES = {}));
  const DEFAULT_FOVY = 45 * Math.PI / 180;
  const DEFAULT_ASPECT = 1;
  const DEFAULT_NEAR = 0.1;
  const DEFAULT_FAR = 500;
  const IDENTITY_MATRIX = Object.freeze([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  class Matrix4 extends Matrix {
    static get IDENTITY() {
      return getIdentityMatrix();
    }
    static get ZERO() {
      return getZeroMatrix();
    }
    get ELEMENTS() {
      return 16;
    }
    get RANK() {
      return 4;
    }
    get INDICES() {
      return INDICES;
    }
    constructor(array) {
      super(-0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0);
      if (arguments.length === 1 && Array.isArray(array)) {
        this.copy(array);
      } else {
        this.identity();
      }
    }
    copy(array) {
      this[0] = array[0];
      this[1] = array[1];
      this[2] = array[2];
      this[3] = array[3];
      this[4] = array[4];
      this[5] = array[5];
      this[6] = array[6];
      this[7] = array[7];
      this[8] = array[8];
      this[9] = array[9];
      this[10] = array[10];
      this[11] = array[11];
      this[12] = array[12];
      this[13] = array[13];
      this[14] = array[14];
      this[15] = array[15];
      return this.check();
    }
    set(m00, m10, m20, m30, m01, m11, m21, m31, m02, m12, m22, m32, m03, m13, m23, m33) {
      this[0] = m00;
      this[1] = m10;
      this[2] = m20;
      this[3] = m30;
      this[4] = m01;
      this[5] = m11;
      this[6] = m21;
      this[7] = m31;
      this[8] = m02;
      this[9] = m12;
      this[10] = m22;
      this[11] = m32;
      this[12] = m03;
      this[13] = m13;
      this[14] = m23;
      this[15] = m33;
      return this.check();
    }
    setRowMajor(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
      this[0] = m00;
      this[1] = m10;
      this[2] = m20;
      this[3] = m30;
      this[4] = m01;
      this[5] = m11;
      this[6] = m21;
      this[7] = m31;
      this[8] = m02;
      this[9] = m12;
      this[10] = m22;
      this[11] = m32;
      this[12] = m03;
      this[13] = m13;
      this[14] = m23;
      this[15] = m33;
      return this.check();
    }
    toRowMajor(result) {
      result[0] = this[0];
      result[1] = this[4];
      result[2] = this[8];
      result[3] = this[12];
      result[4] = this[1];
      result[5] = this[5];
      result[6] = this[9];
      result[7] = this[13];
      result[8] = this[2];
      result[9] = this[6];
      result[10] = this[10];
      result[11] = this[14];
      result[12] = this[3];
      result[13] = this[7];
      result[14] = this[11];
      result[15] = this[15];
      return result;
    }
    identity() {
      return this.copy(IDENTITY_MATRIX);
    }
    fromObject(object) {
      return this.check();
    }
    fromQuaternion(quaternion) {
      fromQuat(this, quaternion);
      return this.check();
    }
    frustum(view) {
      const {
        left,
        right,
        bottom,
        top,
        near = DEFAULT_NEAR,
        far = DEFAULT_FAR
      } = view;
      if (far === Infinity) {
        computeInfinitePerspectiveOffCenter(this, left, right, bottom, top, near);
      } else {
        frustum(this, left, right, bottom, top, near, far);
      }
      return this.check();
    }
    lookAt(view) {
      const {
        eye,
        center = [0, 0, 0],
        up = [0, 1, 0]
      } = view;
      lookAt(this, eye, center, up);
      return this.check();
    }
    ortho(view) {
      const {
        left,
        right,
        bottom,
        top,
        near = DEFAULT_NEAR,
        far = DEFAULT_FAR
      } = view;
      ortho(this, left, right, bottom, top, near, far);
      return this.check();
    }
    orthographic(view) {
      const {
        fovy = DEFAULT_FOVY,
        aspect = DEFAULT_ASPECT,
        focalDistance = 1,
        near = DEFAULT_NEAR,
        far = DEFAULT_FAR
      } = view;
      checkRadians(fovy);
      const halfY = fovy / 2;
      const top = focalDistance * Math.tan(halfY);
      const right = top * aspect;
      return this.ortho({
        left: -right,
        right,
        bottom: -top,
        top,
        near,
        far
      });
    }
    perspective(view) {
      const {
        fovy = 45 * Math.PI / 180,
        aspect = 1,
        near = 0.1,
        far = 500
      } = view;
      checkRadians(fovy);
      perspective(this, fovy, aspect, near, far);
      return this.check();
    }
    determinant() {
      return determinant(this);
    }
    getScale(result = [-0, -0, -0]) {
      result[0] = Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2]);
      result[1] = Math.sqrt(this[4] * this[4] + this[5] * this[5] + this[6] * this[6]);
      result[2] = Math.sqrt(this[8] * this[8] + this[9] * this[9] + this[10] * this[10]);
      return result;
    }
    getTranslation(result = [-0, -0, -0]) {
      result[0] = this[12];
      result[1] = this[13];
      result[2] = this[14];
      return result;
    }
    getRotation(result, scaleResult) {
      result = result || [-0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0];
      scaleResult = scaleResult || [-0, -0, -0];
      const scale2 = this.getScale(scaleResult);
      const inverseScale0 = 1 / scale2[0];
      const inverseScale1 = 1 / scale2[1];
      const inverseScale2 = 1 / scale2[2];
      result[0] = this[0] * inverseScale0;
      result[1] = this[1] * inverseScale1;
      result[2] = this[2] * inverseScale2;
      result[3] = 0;
      result[4] = this[4] * inverseScale0;
      result[5] = this[5] * inverseScale1;
      result[6] = this[6] * inverseScale2;
      result[7] = 0;
      result[8] = this[8] * inverseScale0;
      result[9] = this[9] * inverseScale1;
      result[10] = this[10] * inverseScale2;
      result[11] = 0;
      result[12] = 0;
      result[13] = 0;
      result[14] = 0;
      result[15] = 1;
      return result;
    }
    getRotationMatrix3(result, scaleResult) {
      result = result || [-0, -0, -0, -0, -0, -0, -0, -0, -0];
      scaleResult = scaleResult || [-0, -0, -0];
      const scale2 = this.getScale(scaleResult);
      const inverseScale0 = 1 / scale2[0];
      const inverseScale1 = 1 / scale2[1];
      const inverseScale2 = 1 / scale2[2];
      result[0] = this[0] * inverseScale0;
      result[1] = this[1] * inverseScale1;
      result[2] = this[2] * inverseScale2;
      result[3] = this[4] * inverseScale0;
      result[4] = this[5] * inverseScale1;
      result[5] = this[6] * inverseScale2;
      result[6] = this[8] * inverseScale0;
      result[7] = this[9] * inverseScale1;
      result[8] = this[10] * inverseScale2;
      return result;
    }
    transpose() {
      transpose(this, this);
      return this.check();
    }
    invert() {
      invert$1(this, this);
      return this.check();
    }
    multiplyLeft(a2) {
      multiply$1(this, a2, this);
      return this.check();
    }
    multiplyRight(a2) {
      multiply$1(this, this, a2);
      return this.check();
    }
    rotateX(radians2) {
      rotateX$1(this, this, radians2);
      return this.check();
    }
    rotateY(radians2) {
      rotateY$1(this, this, radians2);
      return this.check();
    }
    rotateZ(radians2) {
      rotateZ$1(this, this, radians2);
      return this.check();
    }
    rotateXYZ(angleXYZ) {
      return this.rotateX(angleXYZ[0]).rotateY(angleXYZ[1]).rotateZ(angleXYZ[2]);
    }
    rotateAxis(radians2, axis) {
      rotate(this, this, radians2, axis);
      return this.check();
    }
    scale(factor) {
      scale$2(this, this, Array.isArray(factor) ? factor : [factor, factor, factor]);
      return this.check();
    }
    translate(vector) {
      translate(this, this, vector);
      return this.check();
    }
    transform(vector, result) {
      if (vector.length === 4) {
        result = transformMat4(result || [-0, -0, -0, -0], vector, this);
        checkVector(result, 4);
        return result;
      }
      return this.transformAsPoint(vector, result);
    }
    transformAsPoint(vector, result) {
      const {
        length: length2
      } = vector;
      let out;
      switch (length2) {
        case 2:
          out = transformMat4$2(result || [-0, -0], vector, this);
          break;
        case 3:
          out = transformMat4$1(result || [-0, -0, -0], vector, this);
          break;
        default:
          throw new Error("Illegal vector");
      }
      checkVector(out, vector.length);
      return out;
    }
    transformAsVector(vector, result) {
      let out;
      switch (vector.length) {
        case 2:
          out = vec2_transformMat4AsVector(result || [-0, -0], vector, this);
          break;
        case 3:
          out = vec3_transformMat4AsVector(result || [-0, -0, -0], vector, this);
          break;
        default:
          throw new Error("Illegal vector");
      }
      checkVector(out, vector.length);
      return out;
    }
    transformPoint(vector, result) {
      return this.transformAsPoint(vector, result);
    }
    transformVector(vector, result) {
      return this.transformAsPoint(vector, result);
    }
    transformDirection(vector, result) {
      return this.transformAsVector(vector, result);
    }
    makeRotationX(radians2) {
      return this.identity().rotateX(radians2);
    }
    makeTranslation(x, y, z) {
      return this.identity().translate([x, y, z]);
    }
  }
  let ZERO$1;
  let IDENTITY;
  function getZeroMatrix() {
    if (!ZERO$1) {
      ZERO$1 = new Matrix4([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      Object.freeze(ZERO$1);
    }
    return ZERO$1;
  }
  function getIdentityMatrix() {
    if (!IDENTITY) {
      IDENTITY = new Matrix4();
      Object.freeze(IDENTITY);
    }
    return IDENTITY;
  }
  function checkRadians(possiblyDegrees) {
    if (possiblyDegrees > Math.PI * 2) {
      throw Error("expected radians");
    }
  }
  function computeInfinitePerspectiveOffCenter(result, left, right, bottom, top, near) {
    const column0Row0 = 2 * near / (right - left);
    const column1Row1 = 2 * near / (top - bottom);
    const column2Row0 = (right + left) / (right - left);
    const column2Row1 = (top + bottom) / (top - bottom);
    const column2Row2 = -1;
    const column2Row3 = -1;
    const column3Row2 = -2 * near;
    result[0] = column0Row0;
    result[1] = 0;
    result[2] = 0;
    result[3] = 0;
    result[4] = 0;
    result[5] = column1Row1;
    result[6] = 0;
    result[7] = 0;
    result[8] = column2Row0;
    result[9] = column2Row1;
    result[10] = column2Row2;
    result[11] = column2Row3;
    result[12] = 0;
    result[13] = 0;
    result[14] = column3Row2;
    result[15] = 0;
    return result;
  }
  function create() {
    const out = new ARRAY_TYPE(4);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }
    out[3] = 1;
    return out;
  }
  function identity$1(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
  }
  function setAxisAngle(out, axis, rad) {
    rad = rad * 0.5;
    const s2 = Math.sin(rad);
    out[0] = s2 * axis[0];
    out[1] = s2 * axis[1];
    out[2] = s2 * axis[2];
    out[3] = Math.cos(rad);
    return out;
  }
  function multiply(out, a2, b) {
    const ax = a2[0];
    const ay = a2[1];
    const az = a2[2];
    const aw = a2[3];
    const bx = b[0];
    const by = b[1];
    const bz = b[2];
    const bw = b[3];
    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
  }
  function rotateX(out, a2, rad) {
    rad *= 0.5;
    const ax = a2[0];
    const ay = a2[1];
    const az = a2[2];
    const aw = a2[3];
    const bx = Math.sin(rad);
    const bw = Math.cos(rad);
    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
  }
  function rotateY(out, a2, rad) {
    rad *= 0.5;
    const ax = a2[0];
    const ay = a2[1];
    const az = a2[2];
    const aw = a2[3];
    const by = Math.sin(rad);
    const bw = Math.cos(rad);
    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
  }
  function rotateZ(out, a2, rad) {
    rad *= 0.5;
    const ax = a2[0];
    const ay = a2[1];
    const az = a2[2];
    const aw = a2[3];
    const bz = Math.sin(rad);
    const bw = Math.cos(rad);
    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
  }
  function calculateW(out, a2) {
    const x = a2[0];
    const y = a2[1];
    const z = a2[2];
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = Math.sqrt(Math.abs(1 - x * x - y * y - z * z));
    return out;
  }
  function slerp(out, a2, b, t) {
    const ax = a2[0];
    const ay = a2[1];
    const az = a2[2];
    const aw = a2[3];
    let bx = b[0];
    let by = b[1];
    let bz = b[2];
    let bw = b[3];
    let cosom;
    let omega;
    let scale0;
    let scale1;
    let sinom;
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    if (cosom < 0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }
    if (1 - cosom > EPSILON) {
      omega = Math.acos(cosom);
      sinom = Math.sin(omega);
      scale0 = Math.sin((1 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      scale0 = 1 - t;
      scale1 = t;
    }
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    return out;
  }
  function invert(out, a2) {
    const a0 = a2[0];
    const a1 = a2[1];
    const a22 = a2[2];
    const a3 = a2[3];
    const dot2 = a0 * a0 + a1 * a1 + a22 * a22 + a3 * a3;
    const invDot = dot2 ? 1 / dot2 : 0;
    out[0] = -a0 * invDot;
    out[1] = -a1 * invDot;
    out[2] = -a22 * invDot;
    out[3] = a3 * invDot;
    return out;
  }
  function conjugate(out, a2) {
    out[0] = -a2[0];
    out[1] = -a2[1];
    out[2] = -a2[2];
    out[3] = a2[3];
    return out;
  }
  function fromMat3(out, m) {
    const fTrace = m[0] + m[4] + m[8];
    let fRoot;
    if (fTrace > 0) {
      fRoot = Math.sqrt(fTrace + 1);
      out[3] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      out[0] = (m[5] - m[7]) * fRoot;
      out[1] = (m[6] - m[2]) * fRoot;
      out[2] = (m[1] - m[3]) * fRoot;
    } else {
      let i2 = 0;
      if (m[4] > m[0])
        i2 = 1;
      if (m[8] > m[i2 * 3 + i2])
        i2 = 2;
      const j = (i2 + 1) % 3;
      const k = (i2 + 2) % 3;
      fRoot = Math.sqrt(m[i2 * 3 + i2] - m[j * 3 + j] - m[k * 3 + k] + 1);
      out[i2] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
      out[j] = (m[j * 3 + i2] + m[i2 * 3 + j]) * fRoot;
      out[k] = (m[k * 3 + i2] + m[i2 * 3 + k]) * fRoot;
    }
    return out;
  }
  const add = add$1;
  const scale = scale$1;
  const dot = dot$1;
  const lerp = lerp$1;
  const length = length$1;
  const squaredLength = squaredLength$1;
  const normalize = normalize$1;
  const rotationTo = function() {
    const tmpvec3 = create$3();
    const xUnitVec3 = fromValues(1, 0, 0);
    const yUnitVec3 = fromValues(0, 1, 0);
    return function(out, a2, b) {
      const dot2 = dot$2(a2, b);
      if (dot2 < -0.999999) {
        cross(tmpvec3, xUnitVec3, a2);
        if (len(tmpvec3) < 1e-6)
          cross(tmpvec3, yUnitVec3, a2);
        normalize$2(tmpvec3, tmpvec3);
        setAxisAngle(out, tmpvec3, Math.PI);
        return out;
      } else if (dot2 > 0.999999) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        return out;
      }
      cross(tmpvec3, a2, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot2;
      return normalize(out, out);
    };
  }();
  (function() {
    const temp1 = create();
    const temp2 = create();
    return function(out, a2, b, c, d, t) {
      slerp(temp1, a2, d, t);
      slerp(temp2, b, c, t);
      slerp(out, temp1, temp2, 2 * t * (1 - t));
      return out;
    };
  })();
  (function() {
    const matr = create$2();
    return function(out, view, right, up) {
      matr[0] = right[0];
      matr[3] = right[1];
      matr[6] = right[2];
      matr[1] = up[0];
      matr[4] = up[1];
      matr[7] = up[2];
      matr[2] = -view[0];
      matr[5] = -view[1];
      matr[8] = -view[2];
      return normalize(out, fromMat3(out, matr));
    };
  })();
  const IDENTITY_QUATERNION = [0, 0, 0, 1];
  class Quaternion extends MathArray {
    constructor(x = 0, y = 0, z = 0, w = 1) {
      super(-0, -0, -0, -0);
      if (Array.isArray(x) && arguments.length === 1) {
        this.copy(x);
      } else {
        this.set(x, y, z, w);
      }
    }
    copy(array) {
      this[0] = array[0];
      this[1] = array[1];
      this[2] = array[2];
      this[3] = array[3];
      return this.check();
    }
    set(x, y, z, w) {
      this[0] = x;
      this[1] = y;
      this[2] = z;
      this[3] = w;
      return this.check();
    }
    fromObject(object) {
      this[0] = object.x;
      this[1] = object.y;
      this[2] = object.z;
      this[3] = object.w;
      return this.check();
    }
    fromMatrix3(m) {
      fromMat3(this, m);
      return this.check();
    }
    fromAxisRotation(axis, rad) {
      setAxisAngle(this, axis, rad);
      return this.check();
    }
    identity() {
      identity$1(this);
      return this.check();
    }
    setAxisAngle(axis, rad) {
      return this.fromAxisRotation(axis, rad);
    }
    get ELEMENTS() {
      return 4;
    }
    get x() {
      return this[0];
    }
    set x(value) {
      this[0] = checkNumber(value);
    }
    get y() {
      return this[1];
    }
    set y(value) {
      this[1] = checkNumber(value);
    }
    get z() {
      return this[2];
    }
    set z(value) {
      this[2] = checkNumber(value);
    }
    get w() {
      return this[3];
    }
    set w(value) {
      this[3] = checkNumber(value);
    }
    len() {
      return length(this);
    }
    lengthSquared() {
      return squaredLength(this);
    }
    dot(a2) {
      return dot(this, a2);
    }
    rotationTo(vectorA, vectorB) {
      rotationTo(this, vectorA, vectorB);
      return this.check();
    }
    add(a2) {
      add(this, this, a2);
      return this.check();
    }
    calculateW() {
      calculateW(this, this);
      return this.check();
    }
    conjugate() {
      conjugate(this, this);
      return this.check();
    }
    invert() {
      invert(this, this);
      return this.check();
    }
    lerp(a2, b, t) {
      if (t === void 0) {
        return this.lerp(this, a2, b);
      }
      lerp(this, a2, b, t);
      return this.check();
    }
    multiplyRight(a2) {
      multiply(this, this, a2);
      return this.check();
    }
    multiplyLeft(a2) {
      multiply(this, a2, this);
      return this.check();
    }
    normalize() {
      const length2 = this.len();
      const l2 = length2 > 0 ? 1 / length2 : 0;
      this[0] = this[0] * l2;
      this[1] = this[1] * l2;
      this[2] = this[2] * l2;
      this[3] = this[3] * l2;
      if (length2 === 0) {
        this[3] = 1;
      }
      return this.check();
    }
    rotateX(rad) {
      rotateX(this, this, rad);
      return this.check();
    }
    rotateY(rad) {
      rotateY(this, this, rad);
      return this.check();
    }
    rotateZ(rad) {
      rotateZ(this, this, rad);
      return this.check();
    }
    scale(b) {
      scale(this, this, b);
      return this.check();
    }
    slerp(arg0, arg1, arg2) {
      let start;
      let target;
      let ratio;
      switch (arguments.length) {
        case 1:
          ({
            start = IDENTITY_QUATERNION,
            target,
            ratio
          } = arg0);
          break;
        case 2:
          start = this;
          target = arg0;
          ratio = arg1;
          break;
        default:
          start = arg0;
          target = arg1;
          ratio = arg2;
      }
      slerp(this, start, target, ratio);
      return this.check();
    }
    transformVector4(vector, result = new Vector4()) {
      transformQuat(result, vector, this);
      return checkVector(result, 4);
    }
    lengthSq() {
      return this.lengthSquared();
    }
    setFromAxisAngle(axis, rad) {
      return this.setAxisAngle(axis, rad);
    }
    premultiply(a2) {
      return this.multiplyLeft(a2);
    }
    multiply(a2) {
      return this.multiplyRight(a2);
    }
  }
  function _typeof(o2) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o3) {
      return typeof o3;
    } : function(o3) {
      return o3 && "function" == typeof Symbol && o3.constructor === Symbol && o3 !== Symbol.prototype ? "symbol" : typeof o3;
    }, _typeof(o2);
  }
  function toPrimitive(t, r2) {
    if ("object" != _typeof(t) || !t)
      return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i2 = e.call(t, r2 || "default");
      if ("object" != _typeof(i2))
        return i2;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r2 ? String : Number)(t);
  }
  function toPropertyKey(t) {
    var i2 = toPrimitive(t, "string");
    return "symbol" == _typeof(i2) ? i2 : String(i2);
  }
  function _defineProperty(obj, key, value) {
    key = toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  const EPSILON1 = 0.1;
  const EPSILON12 = 1e-12;
  const EPSILON15 = 1e-15;
  const EPSILON20 = 1e-20;
  const WGS84_RADIUS_X$1 = 6378137;
  const WGS84_RADIUS_Y$1 = 6378137;
  const WGS84_RADIUS_Z$1 = 6356752314245179e-9;
  function identity(x) {
    return x;
  }
  new Vector3();
  function fromCartographic(cartographic, result = [], map2 = identity) {
    if ("longitude" in cartographic) {
      result[0] = map2(cartographic.longitude);
      result[1] = map2(cartographic.latitude);
      result[2] = cartographic.height;
    } else if ("x" in cartographic) {
      result[0] = map2(cartographic.x);
      result[1] = map2(cartographic.y);
      result[2] = cartographic.z;
    } else {
      result[0] = map2(cartographic[0]);
      result[1] = map2(cartographic[1]);
      result[2] = cartographic[2];
    }
    return result;
  }
  function fromCartographicToRadians(cartographic, vector = []) {
    return fromCartographic(cartographic, vector, config._cartographicRadians ? identity : toRadians);
  }
  function toCartographic(vector, cartographic, map2 = identity) {
    if ("longitude" in cartographic) {
      cartographic.longitude = map2(vector[0]);
      cartographic.latitude = map2(vector[1]);
      cartographic.height = vector[2];
    } else if ("x" in cartographic) {
      cartographic.x = map2(vector[0]);
      cartographic.y = map2(vector[1]);
      cartographic.z = vector[2];
    } else {
      cartographic[0] = map2(vector[0]);
      cartographic[1] = map2(vector[1]);
      cartographic[2] = vector[2];
    }
    return cartographic;
  }
  function toCartographicFromRadians(vector, cartographic) {
    return toCartographic(vector, cartographic, config._cartographicRadians ? identity : toDegrees);
  }
  const EPSILON14 = 1e-14;
  const scratchOrigin = new Vector3();
  const VECTOR_PRODUCT_LOCAL_FRAME = {
    up: {
      south: "east",
      north: "west",
      west: "south",
      east: "north"
    },
    down: {
      south: "west",
      north: "east",
      west: "north",
      east: "south"
    },
    south: {
      up: "west",
      down: "east",
      west: "down",
      east: "up"
    },
    north: {
      up: "east",
      down: "west",
      west: "up",
      east: "down"
    },
    west: {
      up: "north",
      down: "south",
      north: "down",
      south: "up"
    },
    east: {
      up: "south",
      down: "north",
      north: "up",
      south: "down"
    }
  };
  const degeneratePositionLocalFrame = {
    north: [-1, 0, 0],
    east: [0, 1, 0],
    up: [0, 0, 1],
    south: [1, 0, 0],
    west: [0, -1, 0],
    down: [0, 0, -1]
  };
  const scratchAxisVectors = {
    east: new Vector3(),
    north: new Vector3(),
    up: new Vector3(),
    west: new Vector3(),
    south: new Vector3(),
    down: new Vector3()
  };
  const scratchVector1 = new Vector3();
  const scratchVector2$2 = new Vector3();
  const scratchVector3$2 = new Vector3();
  function localFrameToFixedFrame(ellipsoid, firstAxis, secondAxis, thirdAxis, cartesianOrigin, result) {
    const thirdAxisInferred = VECTOR_PRODUCT_LOCAL_FRAME[firstAxis] && VECTOR_PRODUCT_LOCAL_FRAME[firstAxis][secondAxis];
    assert$3(thirdAxisInferred && (!thirdAxis || thirdAxis === thirdAxisInferred));
    let firstAxisVector;
    let secondAxisVector;
    let thirdAxisVector;
    const origin = scratchOrigin.copy(cartesianOrigin);
    const atPole = equals$1(origin.x, 0, EPSILON14) && equals$1(origin.y, 0, EPSILON14);
    if (atPole) {
      const sign2 = Math.sign(origin.z);
      firstAxisVector = scratchVector1.fromArray(degeneratePositionLocalFrame[firstAxis]);
      if (firstAxis !== "east" && firstAxis !== "west") {
        firstAxisVector.scale(sign2);
      }
      secondAxisVector = scratchVector2$2.fromArray(degeneratePositionLocalFrame[secondAxis]);
      if (secondAxis !== "east" && secondAxis !== "west") {
        secondAxisVector.scale(sign2);
      }
      thirdAxisVector = scratchVector3$2.fromArray(degeneratePositionLocalFrame[thirdAxis]);
      if (thirdAxis !== "east" && thirdAxis !== "west") {
        thirdAxisVector.scale(sign2);
      }
    } else {
      const {
        up,
        east,
        north
      } = scratchAxisVectors;
      east.set(-origin.y, origin.x, 0).normalize();
      ellipsoid.geodeticSurfaceNormal(origin, up);
      north.copy(up).cross(east);
      const {
        down,
        west,
        south
      } = scratchAxisVectors;
      down.copy(up).scale(-1);
      west.copy(east).scale(-1);
      south.copy(north).scale(-1);
      firstAxisVector = scratchAxisVectors[firstAxis];
      secondAxisVector = scratchAxisVectors[secondAxis];
      thirdAxisVector = scratchAxisVectors[thirdAxis];
    }
    result[0] = firstAxisVector.x;
    result[1] = firstAxisVector.y;
    result[2] = firstAxisVector.z;
    result[3] = 0;
    result[4] = secondAxisVector.x;
    result[5] = secondAxisVector.y;
    result[6] = secondAxisVector.z;
    result[7] = 0;
    result[8] = thirdAxisVector.x;
    result[9] = thirdAxisVector.y;
    result[10] = thirdAxisVector.z;
    result[11] = 0;
    result[12] = origin.x;
    result[13] = origin.y;
    result[14] = origin.z;
    result[15] = 1;
    return result;
  }
  const scratchVector$6 = new Vector3();
  const scaleToGeodeticSurfaceIntersection = new Vector3();
  const scaleToGeodeticSurfaceGradient = new Vector3();
  function scaleToGeodeticSurface(cartesian, ellipsoid, result = []) {
    const {
      oneOverRadii,
      oneOverRadiiSquared,
      centerToleranceSquared
    } = ellipsoid;
    scratchVector$6.from(cartesian);
    const positionX = scratchVector$6.x;
    const positionY = scratchVector$6.y;
    const positionZ = scratchVector$6.z;
    const oneOverRadiiX = oneOverRadii.x;
    const oneOverRadiiY = oneOverRadii.y;
    const oneOverRadiiZ = oneOverRadii.z;
    const x2 = positionX * positionX * oneOverRadiiX * oneOverRadiiX;
    const y2 = positionY * positionY * oneOverRadiiY * oneOverRadiiY;
    const z2 = positionZ * positionZ * oneOverRadiiZ * oneOverRadiiZ;
    const squaredNorm = x2 + y2 + z2;
    const ratio = Math.sqrt(1 / squaredNorm);
    if (!Number.isFinite(ratio)) {
      return void 0;
    }
    const intersection = scaleToGeodeticSurfaceIntersection;
    intersection.copy(cartesian).scale(ratio);
    if (squaredNorm < centerToleranceSquared) {
      return intersection.to(result);
    }
    const oneOverRadiiSquaredX = oneOverRadiiSquared.x;
    const oneOverRadiiSquaredY = oneOverRadiiSquared.y;
    const oneOverRadiiSquaredZ = oneOverRadiiSquared.z;
    const gradient2 = scaleToGeodeticSurfaceGradient;
    gradient2.set(intersection.x * oneOverRadiiSquaredX * 2, intersection.y * oneOverRadiiSquaredY * 2, intersection.z * oneOverRadiiSquaredZ * 2);
    let lambda = (1 - ratio) * scratchVector$6.len() / (0.5 * gradient2.len());
    let correction = 0;
    let xMultiplier;
    let yMultiplier;
    let zMultiplier;
    let func;
    do {
      lambda -= correction;
      xMultiplier = 1 / (1 + lambda * oneOverRadiiSquaredX);
      yMultiplier = 1 / (1 + lambda * oneOverRadiiSquaredY);
      zMultiplier = 1 / (1 + lambda * oneOverRadiiSquaredZ);
      const xMultiplier2 = xMultiplier * xMultiplier;
      const yMultiplier2 = yMultiplier * yMultiplier;
      const zMultiplier2 = zMultiplier * zMultiplier;
      const xMultiplier3 = xMultiplier2 * xMultiplier;
      const yMultiplier3 = yMultiplier2 * yMultiplier;
      const zMultiplier3 = zMultiplier2 * zMultiplier;
      func = x2 * xMultiplier2 + y2 * yMultiplier2 + z2 * zMultiplier2 - 1;
      const denominator = x2 * xMultiplier3 * oneOverRadiiSquaredX + y2 * yMultiplier3 * oneOverRadiiSquaredY + z2 * zMultiplier3 * oneOverRadiiSquaredZ;
      const derivative = -2 * denominator;
      correction = func / derivative;
    } while (Math.abs(func) > EPSILON12);
    return scratchVector$6.scale([xMultiplier, yMultiplier, zMultiplier]).to(result);
  }
  const scratchVector$5 = new Vector3();
  const scratchNormal$2 = new Vector3();
  const scratchK = new Vector3();
  const scratchPosition$2 = new Vector3();
  const scratchHeight = new Vector3();
  const scratchCartesian = new Vector3();
  class Ellipsoid {
    constructor(x = 0, y = 0, z = 0) {
      _defineProperty(this, "radii", void 0);
      _defineProperty(this, "radiiSquared", void 0);
      _defineProperty(this, "radiiToTheFourth", void 0);
      _defineProperty(this, "oneOverRadii", void 0);
      _defineProperty(this, "oneOverRadiiSquared", void 0);
      _defineProperty(this, "minimumRadius", void 0);
      _defineProperty(this, "maximumRadius", void 0);
      _defineProperty(this, "centerToleranceSquared", EPSILON1);
      _defineProperty(this, "squaredXOverSquaredZ", void 0);
      assert$3(x >= 0);
      assert$3(y >= 0);
      assert$3(z >= 0);
      this.radii = new Vector3(x, y, z);
      this.radiiSquared = new Vector3(x * x, y * y, z * z);
      this.radiiToTheFourth = new Vector3(x * x * x * x, y * y * y * y, z * z * z * z);
      this.oneOverRadii = new Vector3(x === 0 ? 0 : 1 / x, y === 0 ? 0 : 1 / y, z === 0 ? 0 : 1 / z);
      this.oneOverRadiiSquared = new Vector3(x === 0 ? 0 : 1 / (x * x), y === 0 ? 0 : 1 / (y * y), z === 0 ? 0 : 1 / (z * z));
      this.minimumRadius = Math.min(x, y, z);
      this.maximumRadius = Math.max(x, y, z);
      if (this.radiiSquared.z !== 0) {
        this.squaredXOverSquaredZ = this.radiiSquared.x / this.radiiSquared.z;
      }
      Object.freeze(this);
    }
    equals(right) {
      return this === right || Boolean(right && this.radii.equals(right.radii));
    }
    toString() {
      return this.radii.toString();
    }
    cartographicToCartesian(cartographic, result = [0, 0, 0]) {
      const normal = scratchNormal$2;
      const k = scratchK;
      const [, , height] = cartographic;
      this.geodeticSurfaceNormalCartographic(cartographic, normal);
      k.copy(this.radiiSquared).scale(normal);
      const gamma = Math.sqrt(normal.dot(k));
      k.scale(1 / gamma);
      normal.scale(height);
      k.add(normal);
      return k.to(result);
    }
    cartesianToCartographic(cartesian, result = [0, 0, 0]) {
      scratchCartesian.from(cartesian);
      const point = this.scaleToGeodeticSurface(scratchCartesian, scratchPosition$2);
      if (!point) {
        return void 0;
      }
      const normal = this.geodeticSurfaceNormal(point, scratchNormal$2);
      const h = scratchHeight;
      h.copy(scratchCartesian).subtract(point);
      const longitude = Math.atan2(normal.y, normal.x);
      const latitude = Math.asin(normal.z);
      const height = Math.sign(dot$2(h, scratchCartesian)) * length$2(h);
      return toCartographicFromRadians([longitude, latitude, height], result);
    }
    eastNorthUpToFixedFrame(origin, result = new Matrix4()) {
      return localFrameToFixedFrame(this, "east", "north", "up", origin, result);
    }
    localFrameToFixedFrame(firstAxis, secondAxis, thirdAxis, origin, result = new Matrix4()) {
      return localFrameToFixedFrame(this, firstAxis, secondAxis, thirdAxis, origin, result);
    }
    geocentricSurfaceNormal(cartesian, result = [0, 0, 0]) {
      return scratchVector$5.from(cartesian).normalize().to(result);
    }
    geodeticSurfaceNormalCartographic(cartographic, result = [0, 0, 0]) {
      const cartographicVectorRadians = fromCartographicToRadians(cartographic);
      const longitude = cartographicVectorRadians[0];
      const latitude = cartographicVectorRadians[1];
      const cosLatitude = Math.cos(latitude);
      scratchVector$5.set(cosLatitude * Math.cos(longitude), cosLatitude * Math.sin(longitude), Math.sin(latitude)).normalize();
      return scratchVector$5.to(result);
    }
    geodeticSurfaceNormal(cartesian, result = [0, 0, 0]) {
      return scratchVector$5.from(cartesian).scale(this.oneOverRadiiSquared).normalize().to(result);
    }
    scaleToGeodeticSurface(cartesian, result) {
      return scaleToGeodeticSurface(cartesian, this, result);
    }
    scaleToGeocentricSurface(cartesian, result = [0, 0, 0]) {
      scratchPosition$2.from(cartesian);
      const positionX = scratchPosition$2.x;
      const positionY = scratchPosition$2.y;
      const positionZ = scratchPosition$2.z;
      const oneOverRadiiSquared = this.oneOverRadiiSquared;
      const beta = 1 / Math.sqrt(positionX * positionX * oneOverRadiiSquared.x + positionY * positionY * oneOverRadiiSquared.y + positionZ * positionZ * oneOverRadiiSquared.z);
      return scratchPosition$2.multiplyScalar(beta).to(result);
    }
    transformPositionToScaledSpace(position, result = [0, 0, 0]) {
      return scratchPosition$2.from(position).scale(this.oneOverRadii).to(result);
    }
    transformPositionFromScaledSpace(position, result = [0, 0, 0]) {
      return scratchPosition$2.from(position).scale(this.radii).to(result);
    }
    getSurfaceNormalIntersectionWithZAxis(position, buffer = 0, result = [0, 0, 0]) {
      assert$3(equals$1(this.radii.x, this.radii.y, EPSILON15));
      assert$3(this.radii.z > 0);
      scratchPosition$2.from(position);
      const z = scratchPosition$2.z * (1 - this.squaredXOverSquaredZ);
      if (Math.abs(z) >= this.radii.z - buffer) {
        return void 0;
      }
      return scratchPosition$2.set(0, 0, z).to(result);
    }
  }
  _defineProperty(Ellipsoid, "WGS84", new Ellipsoid(WGS84_RADIUS_X$1, WGS84_RADIUS_Y$1, WGS84_RADIUS_Z$1));
  class DoublyLinkedListNode {
    constructor(item, previous, next) {
      this.item = void 0;
      this.previous = void 0;
      this.next = void 0;
      this.item = item;
      this.previous = previous;
      this.next = next;
    }
  }
  class DoublyLinkedList {
    constructor() {
      this.head = null;
      this.tail = null;
      this._length = 0;
    }
    get length() {
      return this._length;
    }
    add(item) {
      const node2 = new DoublyLinkedListNode(item, this.tail, null);
      if (this.tail) {
        this.tail.next = node2;
        this.tail = node2;
      } else {
        this.head = node2;
        this.tail = node2;
      }
      ++this._length;
      return node2;
    }
    remove(node2) {
      if (!node2) {
        return;
      }
      if (node2.previous && node2.next) {
        node2.previous.next = node2.next;
        node2.next.previous = node2.previous;
      } else if (node2.previous) {
        node2.previous.next = null;
        this.tail = node2.previous;
      } else if (node2.next) {
        node2.next.previous = null;
        this.head = node2.next;
      } else {
        this.head = null;
        this.tail = null;
      }
      node2.next = null;
      node2.previous = null;
      --this._length;
    }
    splice(node2, nextNode) {
      if (node2 === nextNode) {
        return;
      }
      this.remove(nextNode);
      this._insert(node2, nextNode);
    }
    _insert(node2, nextNode) {
      const oldNodeNext = node2.next;
      node2.next = nextNode;
      if (this.tail === node2) {
        this.tail = nextNode;
      } else {
        oldNodeNext.previous = nextNode;
      }
      nextNode.next = oldNodeNext;
      nextNode.previous = node2;
      ++this._length;
    }
  }
  class TilesetCache {
    constructor() {
      this._list = void 0;
      this._sentinel = void 0;
      this._trimTiles = void 0;
      this._list = new DoublyLinkedList();
      this._sentinel = this._list.add("sentinel");
      this._trimTiles = false;
    }
    reset() {
      this._list.splice(this._list.tail, this._sentinel);
    }
    touch(tile) {
      const node2 = tile._cacheNode;
      if (node2) {
        this._list.splice(this._sentinel, node2);
      }
    }
    add(tileset, tile, addCallback) {
      if (!tile._cacheNode) {
        tile._cacheNode = this._list.add(tile);
        if (addCallback) {
          addCallback(tileset, tile);
        }
      }
    }
    unloadTile(tileset, tile, unloadCallback) {
      const node2 = tile._cacheNode;
      if (!node2) {
        return;
      }
      this._list.remove(node2);
      tile._cacheNode = null;
      if (unloadCallback) {
        unloadCallback(tileset, tile);
      }
    }
    unloadTiles(tileset, unloadCallback) {
      const trimTiles = this._trimTiles;
      this._trimTiles = false;
      const list = this._list;
      const maximumMemoryUsageInBytes = tileset.maximumMemoryUsage * 1024 * 1024;
      const sentinel = this._sentinel;
      let node2 = list.head;
      while (node2 !== sentinel && (tileset.gpuMemoryUsageInBytes > maximumMemoryUsageInBytes || trimTiles)) {
        const tile = node2.item;
        node2 = node2.next;
        this.unloadTile(tileset, tile, unloadCallback);
      }
    }
    trim() {
      this._trimTiles = true;
    }
  }
  function calculateTransformProps(tileHeader, tile) {
    assert$6(tileHeader);
    assert$6(tile);
    const {
      rtcCenter,
      gltfUpAxis
    } = tile;
    const {
      computedTransform,
      boundingVolume: {
        center
      }
    } = tileHeader;
    let modelMatrix = new Matrix4(computedTransform);
    if (rtcCenter) {
      modelMatrix.translate(rtcCenter);
    }
    switch (gltfUpAxis) {
      case "Z":
        break;
      case "Y":
        const rotationY = new Matrix4().rotateX(Math.PI / 2);
        modelMatrix = modelMatrix.multiplyRight(rotationY);
        break;
      case "X":
        const rotationX = new Matrix4().rotateY(-Math.PI / 2);
        modelMatrix = modelMatrix.multiplyRight(rotationX);
        break;
    }
    if (tile.isQuantized) {
      modelMatrix.translate(tile.quantizedVolumeOffset).scale(tile.quantizedVolumeScale);
    }
    const cartesianOrigin = new Vector3(center);
    tile.cartesianModelMatrix = modelMatrix;
    tile.cartesianOrigin = cartesianOrigin;
    const cartographicOrigin = Ellipsoid.WGS84.cartesianToCartographic(cartesianOrigin, new Vector3());
    const fromFixedFrameMatrix = Ellipsoid.WGS84.eastNorthUpToFixedFrame(cartesianOrigin);
    const toFixedFrameMatrix = fromFixedFrameMatrix.invert();
    tile.cartographicModelMatrix = toFixedFrameMatrix.multiplyRight(modelMatrix);
    tile.cartographicOrigin = cartographicOrigin;
    if (!tile.coordinateSystem) {
      tile.modelMatrix = tile.cartographicModelMatrix;
    }
  }
  const INTERSECTION = {
    OUTSIDE: -1,
    INTERSECTING: 0,
    INSIDE: 1
  };
  new Vector3();
  new Vector3();
  const scratchVector$4 = new Vector3();
  const scratchVector2$1 = new Vector3();
  class BoundingSphere {
    constructor(center = [0, 0, 0], radius = 0) {
      _defineProperty(this, "center", void 0);
      _defineProperty(this, "radius", void 0);
      this.radius = -0;
      this.center = new Vector3();
      this.fromCenterRadius(center, radius);
    }
    fromCenterRadius(center, radius) {
      this.center.from(center);
      this.radius = radius;
      return this;
    }
    fromCornerPoints(corner, oppositeCorner) {
      oppositeCorner = scratchVector$4.from(oppositeCorner);
      this.center = new Vector3().from(corner).add(oppositeCorner).scale(0.5);
      this.radius = this.center.distance(oppositeCorner);
      return this;
    }
    equals(right) {
      return this === right || Boolean(right) && this.center.equals(right.center) && this.radius === right.radius;
    }
    clone() {
      return new BoundingSphere(this.center, this.radius);
    }
    union(boundingSphere) {
      const leftCenter = this.center;
      const leftRadius = this.radius;
      const rightCenter = boundingSphere.center;
      const rightRadius = boundingSphere.radius;
      const toRightCenter = scratchVector$4.copy(rightCenter).subtract(leftCenter);
      const centerSeparation = toRightCenter.magnitude();
      if (leftRadius >= centerSeparation + rightRadius) {
        return this.clone();
      }
      if (rightRadius >= centerSeparation + leftRadius) {
        return boundingSphere.clone();
      }
      const halfDistanceBetweenTangentPoints = (leftRadius + centerSeparation + rightRadius) * 0.5;
      scratchVector2$1.copy(toRightCenter).scale((-leftRadius + halfDistanceBetweenTangentPoints) / centerSeparation).add(leftCenter);
      this.center.copy(scratchVector2$1);
      this.radius = halfDistanceBetweenTangentPoints;
      return this;
    }
    expand(point) {
      const scratchPoint2 = scratchVector$4.from(point);
      const radius = scratchPoint2.subtract(this.center).magnitude();
      if (radius > this.radius) {
        this.radius = radius;
      }
      return this;
    }
    transform(transform) {
      this.center.transform(transform);
      const scale2 = getScaling(scratchVector$4, transform);
      this.radius = Math.max(scale2[0], Math.max(scale2[1], scale2[2])) * this.radius;
      return this;
    }
    distanceSquaredTo(point) {
      const d = this.distanceTo(point);
      return d * d;
    }
    distanceTo(point) {
      const scratchPoint2 = scratchVector$4.from(point);
      const delta = scratchPoint2.subtract(this.center);
      return Math.max(0, delta.len() - this.radius);
    }
    intersectPlane(plane) {
      const center = this.center;
      const radius = this.radius;
      const normal = plane.normal;
      const distanceToPlane = normal.dot(center) + plane.distance;
      if (distanceToPlane < -radius) {
        return INTERSECTION.OUTSIDE;
      }
      if (distanceToPlane < radius) {
        return INTERSECTION.INTERSECTING;
      }
      return INTERSECTION.INSIDE;
    }
  }
  const scratchVector3$1 = new Vector3();
  const scratchOffset = new Vector3();
  const scratchVectorU = new Vector3();
  const scratchVectorV = new Vector3();
  const scratchVectorW = new Vector3();
  const scratchCorner = new Vector3();
  const scratchToCenter = new Vector3();
  const MATRIX3 = {
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
  class OrientedBoundingBox {
    constructor(center = [0, 0, 0], halfAxes = [0, 0, 0, 0, 0, 0, 0, 0, 0]) {
      _defineProperty(this, "center", void 0);
      _defineProperty(this, "halfAxes", void 0);
      this.center = new Vector3().from(center);
      this.halfAxes = new Matrix3(halfAxes);
    }
    get halfSize() {
      const xAxis = this.halfAxes.getColumn(0);
      const yAxis = this.halfAxes.getColumn(1);
      const zAxis = this.halfAxes.getColumn(2);
      return [new Vector3(xAxis).len(), new Vector3(yAxis).len(), new Vector3(zAxis).len()];
    }
    get quaternion() {
      const xAxis = this.halfAxes.getColumn(0);
      const yAxis = this.halfAxes.getColumn(1);
      const zAxis = this.halfAxes.getColumn(2);
      const normXAxis = new Vector3(xAxis).normalize();
      const normYAxis = new Vector3(yAxis).normalize();
      const normZAxis = new Vector3(zAxis).normalize();
      return new Quaternion().fromMatrix3(new Matrix3([...normXAxis, ...normYAxis, ...normZAxis]));
    }
    fromCenterHalfSizeQuaternion(center, halfSize, quaternion) {
      const quaternionObject = new Quaternion(quaternion);
      const directionsMatrix = new Matrix3().fromQuaternion(quaternionObject);
      directionsMatrix[0] = directionsMatrix[0] * halfSize[0];
      directionsMatrix[1] = directionsMatrix[1] * halfSize[0];
      directionsMatrix[2] = directionsMatrix[2] * halfSize[0];
      directionsMatrix[3] = directionsMatrix[3] * halfSize[1];
      directionsMatrix[4] = directionsMatrix[4] * halfSize[1];
      directionsMatrix[5] = directionsMatrix[5] * halfSize[1];
      directionsMatrix[6] = directionsMatrix[6] * halfSize[2];
      directionsMatrix[7] = directionsMatrix[7] * halfSize[2];
      directionsMatrix[8] = directionsMatrix[8] * halfSize[2];
      this.center = new Vector3().from(center);
      this.halfAxes = directionsMatrix;
      return this;
    }
    clone() {
      return new OrientedBoundingBox(this.center, this.halfAxes);
    }
    equals(right) {
      return this === right || Boolean(right) && this.center.equals(right.center) && this.halfAxes.equals(right.halfAxes);
    }
    getBoundingSphere(result = new BoundingSphere()) {
      const halfAxes = this.halfAxes;
      const u = halfAxes.getColumn(0, scratchVectorU);
      const v = halfAxes.getColumn(1, scratchVectorV);
      const w = halfAxes.getColumn(2, scratchVectorW);
      const cornerVector = scratchVector3$1.copy(u).add(v).add(w);
      result.center.copy(this.center);
      result.radius = cornerVector.magnitude();
      return result;
    }
    intersectPlane(plane) {
      const center = this.center;
      const normal = plane.normal;
      const halfAxes = this.halfAxes;
      const normalX = normal.x;
      const normalY = normal.y;
      const normalZ = normal.z;
      const radEffective = Math.abs(normalX * halfAxes[MATRIX3.COLUMN0ROW0] + normalY * halfAxes[MATRIX3.COLUMN0ROW1] + normalZ * halfAxes[MATRIX3.COLUMN0ROW2]) + Math.abs(normalX * halfAxes[MATRIX3.COLUMN1ROW0] + normalY * halfAxes[MATRIX3.COLUMN1ROW1] + normalZ * halfAxes[MATRIX3.COLUMN1ROW2]) + Math.abs(normalX * halfAxes[MATRIX3.COLUMN2ROW0] + normalY * halfAxes[MATRIX3.COLUMN2ROW1] + normalZ * halfAxes[MATRIX3.COLUMN2ROW2]);
      const distanceToPlane = normal.dot(center) + plane.distance;
      if (distanceToPlane <= -radEffective) {
        return INTERSECTION.OUTSIDE;
      } else if (distanceToPlane >= radEffective) {
        return INTERSECTION.INSIDE;
      }
      return INTERSECTION.INTERSECTING;
    }
    distanceTo(point) {
      return Math.sqrt(this.distanceSquaredTo(point));
    }
    distanceSquaredTo(point) {
      const offset = scratchOffset.from(point).subtract(this.center);
      const halfAxes = this.halfAxes;
      const u = halfAxes.getColumn(0, scratchVectorU);
      const v = halfAxes.getColumn(1, scratchVectorV);
      const w = halfAxes.getColumn(2, scratchVectorW);
      const uHalf = u.magnitude();
      const vHalf = v.magnitude();
      const wHalf = w.magnitude();
      u.normalize();
      v.normalize();
      w.normalize();
      let distanceSquared = 0;
      let d;
      d = Math.abs(offset.dot(u)) - uHalf;
      if (d > 0) {
        distanceSquared += d * d;
      }
      d = Math.abs(offset.dot(v)) - vHalf;
      if (d > 0) {
        distanceSquared += d * d;
      }
      d = Math.abs(offset.dot(w)) - wHalf;
      if (d > 0) {
        distanceSquared += d * d;
      }
      return distanceSquared;
    }
    computePlaneDistances(position, direction, result = [-0, -0]) {
      let minDist = Number.POSITIVE_INFINITY;
      let maxDist = Number.NEGATIVE_INFINITY;
      const center = this.center;
      const halfAxes = this.halfAxes;
      const u = halfAxes.getColumn(0, scratchVectorU);
      const v = halfAxes.getColumn(1, scratchVectorV);
      const w = halfAxes.getColumn(2, scratchVectorW);
      const corner = scratchCorner.copy(u).add(v).add(w).add(center);
      const toCenter = scratchToCenter.copy(corner).subtract(position);
      let mag = direction.dot(toCenter);
      minDist = Math.min(mag, minDist);
      maxDist = Math.max(mag, maxDist);
      corner.copy(center).add(u).add(v).subtract(w);
      toCenter.copy(corner).subtract(position);
      mag = direction.dot(toCenter);
      minDist = Math.min(mag, minDist);
      maxDist = Math.max(mag, maxDist);
      corner.copy(center).add(u).subtract(v).add(w);
      toCenter.copy(corner).subtract(position);
      mag = direction.dot(toCenter);
      minDist = Math.min(mag, minDist);
      maxDist = Math.max(mag, maxDist);
      corner.copy(center).add(u).subtract(v).subtract(w);
      toCenter.copy(corner).subtract(position);
      mag = direction.dot(toCenter);
      minDist = Math.min(mag, minDist);
      maxDist = Math.max(mag, maxDist);
      center.copy(corner).subtract(u).add(v).add(w);
      toCenter.copy(corner).subtract(position);
      mag = direction.dot(toCenter);
      minDist = Math.min(mag, minDist);
      maxDist = Math.max(mag, maxDist);
      center.copy(corner).subtract(u).add(v).subtract(w);
      toCenter.copy(corner).subtract(position);
      mag = direction.dot(toCenter);
      minDist = Math.min(mag, minDist);
      maxDist = Math.max(mag, maxDist);
      center.copy(corner).subtract(u).subtract(v).add(w);
      toCenter.copy(corner).subtract(position);
      mag = direction.dot(toCenter);
      minDist = Math.min(mag, minDist);
      maxDist = Math.max(mag, maxDist);
      center.copy(corner).subtract(u).subtract(v).subtract(w);
      toCenter.copy(corner).subtract(position);
      mag = direction.dot(toCenter);
      minDist = Math.min(mag, minDist);
      maxDist = Math.max(mag, maxDist);
      result[0] = minDist;
      result[1] = maxDist;
      return result;
    }
    transform(transformation) {
      this.center.transformAsPoint(transformation);
      const xAxis = this.halfAxes.getColumn(0, scratchVectorU);
      xAxis.transformAsPoint(transformation);
      const yAxis = this.halfAxes.getColumn(1, scratchVectorV);
      yAxis.transformAsPoint(transformation);
      const zAxis = this.halfAxes.getColumn(2, scratchVectorW);
      zAxis.transformAsPoint(transformation);
      this.halfAxes = new Matrix3([...xAxis, ...yAxis, ...zAxis]);
      return this;
    }
    getTransform() {
      throw new Error("not implemented");
    }
  }
  const scratchPosition$1 = new Vector3();
  const scratchNormal$1 = new Vector3();
  class Plane {
    constructor(normal = [0, 0, 1], distance = 0) {
      _defineProperty(this, "normal", void 0);
      _defineProperty(this, "distance", void 0);
      this.normal = new Vector3();
      this.distance = -0;
      this.fromNormalDistance(normal, distance);
    }
    fromNormalDistance(normal, distance) {
      assert$3(Number.isFinite(distance));
      this.normal.from(normal).normalize();
      this.distance = distance;
      return this;
    }
    fromPointNormal(point, normal) {
      point = scratchPosition$1.from(point);
      this.normal.from(normal).normalize();
      const distance = -this.normal.dot(point);
      this.distance = distance;
      return this;
    }
    fromCoefficients(a2, b, c, d) {
      this.normal.set(a2, b, c);
      assert$3(equals$1(this.normal.len(), 1));
      this.distance = d;
      return this;
    }
    clone() {
      return new Plane(this.normal, this.distance);
    }
    equals(right) {
      return equals$1(this.distance, right.distance) && equals$1(this.normal, right.normal);
    }
    getPointDistance(point) {
      return this.normal.dot(point) + this.distance;
    }
    transform(matrix4) {
      const normal = scratchNormal$1.copy(this.normal).transformAsVector(matrix4).normalize();
      const point = this.normal.scale(-this.distance).transform(matrix4);
      return this.fromPointNormal(point, normal);
    }
    projectPointOntoPlane(point, result = [0, 0, 0]) {
      const scratchPoint2 = scratchPosition$1.from(point);
      const pointDistance = this.getPointDistance(scratchPoint2);
      const scaledNormal = scratchNormal$1.copy(this.normal).scale(pointDistance);
      return scratchPoint2.subtract(scaledNormal).to(result);
    }
  }
  const faces = [new Vector3([1, 0, 0]), new Vector3([0, 1, 0]), new Vector3([0, 0, 1])];
  const scratchPlaneCenter = new Vector3();
  const scratchPlaneNormal$1 = new Vector3();
  class CullingVolume {
    constructor(planes = []) {
      _defineProperty(this, "planes", void 0);
      this.planes = planes;
    }
    fromBoundingSphere(boundingSphere) {
      this.planes.length = 2 * faces.length;
      const center = boundingSphere.center;
      const radius = boundingSphere.radius;
      let planeIndex = 0;
      for (const faceNormal of faces) {
        let plane0 = this.planes[planeIndex];
        let plane1 = this.planes[planeIndex + 1];
        if (!plane0) {
          plane0 = this.planes[planeIndex] = new Plane();
        }
        if (!plane1) {
          plane1 = this.planes[planeIndex + 1] = new Plane();
        }
        const plane0Center = scratchPlaneCenter.copy(faceNormal).scale(-radius).add(center);
        plane0.fromPointNormal(plane0Center, faceNormal);
        const plane1Center = scratchPlaneCenter.copy(faceNormal).scale(radius).add(center);
        const negatedFaceNormal = scratchPlaneNormal$1.copy(faceNormal).negate();
        plane1.fromPointNormal(plane1Center, negatedFaceNormal);
        planeIndex += 2;
      }
      return this;
    }
    computeVisibility(boundingVolume) {
      let intersect = INTERSECTION.INSIDE;
      for (const plane of this.planes) {
        const result = boundingVolume.intersectPlane(plane);
        switch (result) {
          case INTERSECTION.OUTSIDE:
            return INTERSECTION.OUTSIDE;
          case INTERSECTION.INTERSECTING:
            intersect = INTERSECTION.INTERSECTING;
            break;
        }
      }
      return intersect;
    }
    computeVisibilityWithPlaneMask(boundingVolume, parentPlaneMask) {
      assert$3(Number.isFinite(parentPlaneMask), "parentPlaneMask is required.");
      if (parentPlaneMask === CullingVolume.MASK_OUTSIDE || parentPlaneMask === CullingVolume.MASK_INSIDE) {
        return parentPlaneMask;
      }
      let mask = CullingVolume.MASK_INSIDE;
      const planes = this.planes;
      for (let k = 0; k < this.planes.length; ++k) {
        const flag = k < 31 ? 1 << k : 0;
        if (k < 31 && (parentPlaneMask & flag) === 0) {
          continue;
        }
        const plane = planes[k];
        const result = boundingVolume.intersectPlane(plane);
        if (result === INTERSECTION.OUTSIDE) {
          return CullingVolume.MASK_OUTSIDE;
        } else if (result === INTERSECTION.INTERSECTING) {
          mask |= flag;
        }
      }
      return mask;
    }
  }
  _defineProperty(CullingVolume, "MASK_OUTSIDE", 4294967295);
  _defineProperty(CullingVolume, "MASK_INSIDE", 0);
  _defineProperty(CullingVolume, "MASK_INDETERMINATE", 2147483647);
  const scratchPlaneUpVector = new Vector3();
  const scratchPlaneRightVector = new Vector3();
  const scratchPlaneNearCenter = new Vector3();
  const scratchPlaneFarCenter = new Vector3();
  const scratchPlaneNormal = new Vector3();
  class PerspectiveOffCenterFrustum {
    constructor(options = {}) {
      _defineProperty(this, "left", void 0);
      _defineProperty(this, "_left", void 0);
      _defineProperty(this, "right", void 0);
      _defineProperty(this, "_right", void 0);
      _defineProperty(this, "top", void 0);
      _defineProperty(this, "_top", void 0);
      _defineProperty(this, "bottom", void 0);
      _defineProperty(this, "_bottom", void 0);
      _defineProperty(this, "near", void 0);
      _defineProperty(this, "_near", void 0);
      _defineProperty(this, "far", void 0);
      _defineProperty(this, "_far", void 0);
      _defineProperty(this, "_cullingVolume", new CullingVolume([new Plane(), new Plane(), new Plane(), new Plane(), new Plane(), new Plane()]));
      _defineProperty(this, "_perspectiveMatrix", new Matrix4());
      _defineProperty(this, "_infinitePerspective", new Matrix4());
      const {
        near = 1,
        far = 5e8
      } = options;
      this.left = options.left;
      this._left = void 0;
      this.right = options.right;
      this._right = void 0;
      this.top = options.top;
      this._top = void 0;
      this.bottom = options.bottom;
      this._bottom = void 0;
      this.near = near;
      this._near = near;
      this.far = far;
      this._far = far;
    }
    clone() {
      return new PerspectiveOffCenterFrustum({
        right: this.right,
        left: this.left,
        top: this.top,
        bottom: this.bottom,
        near: this.near,
        far: this.far
      });
    }
    equals(other) {
      return other && other instanceof PerspectiveOffCenterFrustum && this.right === other.right && this.left === other.left && this.top === other.top && this.bottom === other.bottom && this.near === other.near && this.far === other.far;
    }
    get projectionMatrix() {
      this._update();
      return this._perspectiveMatrix;
    }
    get infiniteProjectionMatrix() {
      this._update();
      return this._infinitePerspective;
    }
    computeCullingVolume(position, direction, up) {
      assert$3(position, "position is required.");
      assert$3(direction, "direction is required.");
      assert$3(up, "up is required.");
      const planes = this._cullingVolume.planes;
      up = scratchPlaneUpVector.copy(up).normalize();
      const right = scratchPlaneRightVector.copy(direction).cross(up).normalize();
      const nearCenter = scratchPlaneNearCenter.copy(direction).multiplyByScalar(this.near).add(position);
      const farCenter = scratchPlaneFarCenter.copy(direction).multiplyByScalar(this.far).add(position);
      let normal = scratchPlaneNormal;
      normal.copy(right).multiplyByScalar(this.left).add(nearCenter).subtract(position).cross(up);
      planes[0].fromPointNormal(position, normal);
      normal.copy(right).multiplyByScalar(this.right).add(nearCenter).subtract(position).cross(up).negate();
      planes[1].fromPointNormal(position, normal);
      normal.copy(up).multiplyByScalar(this.bottom).add(nearCenter).subtract(position).cross(right).negate();
      planes[2].fromPointNormal(position, normal);
      normal.copy(up).multiplyByScalar(this.top).add(nearCenter).subtract(position).cross(right);
      planes[3].fromPointNormal(position, normal);
      normal = new Vector3().copy(direction);
      planes[4].fromPointNormal(nearCenter, normal);
      normal.negate();
      planes[5].fromPointNormal(farCenter, normal);
      return this._cullingVolume;
    }
    getPixelDimensions(drawingBufferWidth, drawingBufferHeight, distance, result) {
      this._update();
      assert$3(Number.isFinite(drawingBufferWidth) && Number.isFinite(drawingBufferHeight));
      assert$3(drawingBufferWidth > 0);
      assert$3(drawingBufferHeight > 0);
      assert$3(distance > 0);
      assert$3(result);
      const inverseNear = 1 / this.near;
      let tanTheta = this.top * inverseNear;
      const pixelHeight = 2 * distance * tanTheta / drawingBufferHeight;
      tanTheta = this.right * inverseNear;
      const pixelWidth = 2 * distance * tanTheta / drawingBufferWidth;
      result.x = pixelWidth;
      result.y = pixelHeight;
      return result;
    }
    _update() {
      assert$3(Number.isFinite(this.right) && Number.isFinite(this.left) && Number.isFinite(this.top) && Number.isFinite(this.bottom) && Number.isFinite(this.near) && Number.isFinite(this.far));
      const {
        top,
        bottom,
        right,
        left,
        near,
        far
      } = this;
      if (top !== this._top || bottom !== this._bottom || left !== this._left || right !== this._right || near !== this._near || far !== this._far) {
        assert$3(this.near > 0 && this.near < this.far, "near must be greater than zero and less than far.");
        this._left = left;
        this._right = right;
        this._top = top;
        this._bottom = bottom;
        this._near = near;
        this._far = far;
        this._perspectiveMatrix = new Matrix4().frustum({
          left,
          right,
          bottom,
          top,
          near,
          far
        });
        this._infinitePerspective = new Matrix4().frustum({
          left,
          right,
          bottom,
          top,
          near,
          far: Infinity
        });
      }
    }
  }
  const defined$4 = (val) => val !== null && typeof val !== "undefined";
  class PerspectiveFrustum {
    constructor(options = {}) {
      _defineProperty(this, "_offCenterFrustum", new PerspectiveOffCenterFrustum());
      _defineProperty(this, "fov", void 0);
      _defineProperty(this, "_fov", void 0);
      _defineProperty(this, "_fovy", void 0);
      _defineProperty(this, "_sseDenominator", void 0);
      _defineProperty(this, "aspectRatio", void 0);
      _defineProperty(this, "_aspectRatio", void 0);
      _defineProperty(this, "near", void 0);
      _defineProperty(this, "_near", void 0);
      _defineProperty(this, "far", void 0);
      _defineProperty(this, "_far", void 0);
      _defineProperty(this, "xOffset", void 0);
      _defineProperty(this, "_xOffset", void 0);
      _defineProperty(this, "yOffset", void 0);
      _defineProperty(this, "_yOffset", void 0);
      const {
        fov,
        aspectRatio,
        near = 1,
        far = 5e8,
        xOffset = 0,
        yOffset = 0
      } = options;
      this.fov = fov;
      this.aspectRatio = aspectRatio;
      this.near = near;
      this.far = far;
      this.xOffset = xOffset;
      this.yOffset = yOffset;
    }
    clone() {
      return new PerspectiveFrustum({
        aspectRatio: this.aspectRatio,
        fov: this.fov,
        near: this.near,
        far: this.far
      });
    }
    equals(other) {
      if (!defined$4(other) || !(other instanceof PerspectiveFrustum)) {
        return false;
      }
      this._update();
      other._update();
      return this.fov === other.fov && this.aspectRatio === other.aspectRatio && this.near === other.near && this.far === other.far && this._offCenterFrustum.equals(other._offCenterFrustum);
    }
    get projectionMatrix() {
      this._update();
      return this._offCenterFrustum.projectionMatrix;
    }
    get infiniteProjectionMatrix() {
      this._update();
      return this._offCenterFrustum.infiniteProjectionMatrix;
    }
    get fovy() {
      this._update();
      return this._fovy;
    }
    get sseDenominator() {
      this._update();
      return this._sseDenominator;
    }
    computeCullingVolume(position, direction, up) {
      this._update();
      return this._offCenterFrustum.computeCullingVolume(position, direction, up);
    }
    getPixelDimensions(drawingBufferWidth, drawingBufferHeight, distance, result) {
      this._update();
      return this._offCenterFrustum.getPixelDimensions(drawingBufferWidth, drawingBufferHeight, distance, result || new Vector2());
    }
    _update() {
      assert$3(Number.isFinite(this.fov) && Number.isFinite(this.aspectRatio) && Number.isFinite(this.near) && Number.isFinite(this.far));
      const f2 = this._offCenterFrustum;
      if (this.fov !== this._fov || this.aspectRatio !== this._aspectRatio || this.near !== this._near || this.far !== this._far || this.xOffset !== this._xOffset || this.yOffset !== this._yOffset) {
        assert$3(this.fov >= 0 && this.fov < Math.PI);
        assert$3(this.aspectRatio > 0);
        assert$3(this.near >= 0 && this.near < this.far);
        this._aspectRatio = this.aspectRatio;
        this._fov = this.fov;
        this._fovy = this.aspectRatio <= 1 ? this.fov : Math.atan(Math.tan(this.fov * 0.5) / this.aspectRatio) * 2;
        this._near = this.near;
        this._far = this.far;
        this._sseDenominator = 2 * Math.tan(0.5 * this._fovy);
        this._xOffset = this.xOffset;
        this._yOffset = this.yOffset;
        f2.top = this.near * Math.tan(0.5 * this._fovy);
        f2.bottom = -f2.top;
        f2.right = this.aspectRatio * f2.top;
        f2.left = -f2.right;
        f2.near = this.near;
        f2.far = this.far;
        f2.right += this.xOffset;
        f2.left += this.xOffset;
        f2.top += this.yOffset;
        f2.bottom += this.yOffset;
      }
    }
  }
  new Vector3();
  new Vector3();
  new Vector3();
  new Vector3();
  new Vector3();
  new Vector3();
  new Vector3();
  new Vector3();
  new Vector3();
  new Vector3();
  new Vector3();
  new Vector3();
  const scratchMatrix = new Matrix3();
  const scratchUnitary = new Matrix3();
  const scratchDiagonal = new Matrix3();
  const jMatrix = new Matrix3();
  const jMatrixTranspose = new Matrix3();
  function computeEigenDecomposition(matrix, result = {}) {
    const EIGEN_TOLERANCE = EPSILON20;
    const EIGEN_MAX_SWEEPS = 10;
    let count = 0;
    let sweep = 0;
    const unitaryMatrix = scratchUnitary;
    const diagonalMatrix = scratchDiagonal;
    unitaryMatrix.identity();
    diagonalMatrix.copy(matrix);
    const epsilon = EIGEN_TOLERANCE * computeFrobeniusNorm(diagonalMatrix);
    while (sweep < EIGEN_MAX_SWEEPS && offDiagonalFrobeniusNorm(diagonalMatrix) > epsilon) {
      shurDecomposition(diagonalMatrix, jMatrix);
      jMatrixTranspose.copy(jMatrix).transpose();
      diagonalMatrix.multiplyRight(jMatrix);
      diagonalMatrix.multiplyLeft(jMatrixTranspose);
      unitaryMatrix.multiplyRight(jMatrix);
      if (++count > 2) {
        ++sweep;
        count = 0;
      }
    }
    result.unitary = unitaryMatrix.toTarget(result.unitary);
    result.diagonal = diagonalMatrix.toTarget(result.diagonal);
    return result;
  }
  function computeFrobeniusNorm(matrix) {
    let norm = 0;
    for (let i2 = 0; i2 < 9; ++i2) {
      const temp = matrix[i2];
      norm += temp * temp;
    }
    return Math.sqrt(norm);
  }
  const rowVal = [1, 0, 0];
  const colVal = [2, 2, 1];
  function offDiagonalFrobeniusNorm(matrix) {
    let norm = 0;
    for (let i2 = 0; i2 < 3; ++i2) {
      const temp = matrix[scratchMatrix.getElementIndex(colVal[i2], rowVal[i2])];
      norm += 2 * temp * temp;
    }
    return Math.sqrt(norm);
  }
  function shurDecomposition(matrix, result) {
    const tolerance = EPSILON15;
    let maxDiagonal = 0;
    let rotAxis = 1;
    for (let i2 = 0; i2 < 3; ++i2) {
      const temp = Math.abs(matrix[scratchMatrix.getElementIndex(colVal[i2], rowVal[i2])]);
      if (temp > maxDiagonal) {
        rotAxis = i2;
        maxDiagonal = temp;
      }
    }
    const p = rowVal[rotAxis];
    const q = colVal[rotAxis];
    let c = 1;
    let s2 = 0;
    if (Math.abs(matrix[scratchMatrix.getElementIndex(q, p)]) > tolerance) {
      const qq = matrix[scratchMatrix.getElementIndex(q, q)];
      const pp = matrix[scratchMatrix.getElementIndex(p, p)];
      const qp = matrix[scratchMatrix.getElementIndex(q, p)];
      const tau = (qq - pp) / 2 / qp;
      let t;
      if (tau < 0) {
        t = -1 / (-tau + Math.sqrt(1 + tau * tau));
      } else {
        t = 1 / (tau + Math.sqrt(1 + tau * tau));
      }
      c = 1 / Math.sqrt(1 + t * t);
      s2 = t * c;
    }
    Matrix3.IDENTITY.to(result);
    result[scratchMatrix.getElementIndex(p, p)] = result[scratchMatrix.getElementIndex(q, q)] = c;
    result[scratchMatrix.getElementIndex(q, p)] = s2;
    result[scratchMatrix.getElementIndex(p, q)] = -s2;
    return result;
  }
  const scratchVector2 = new Vector3();
  const scratchVector3 = new Vector3();
  const scratchVector4 = new Vector3();
  const scratchVector5 = new Vector3();
  const scratchVector6 = new Vector3();
  const scratchCovarianceResult = new Matrix3();
  const scratchEigenResult = {
    diagonal: new Matrix3(),
    unitary: new Matrix3()
  };
  function makeOrientedBoundingBoxFromPoints(positions, result = new OrientedBoundingBox()) {
    if (!positions || positions.length === 0) {
      result.halfAxes = new Matrix3([0, 0, 0, 0, 0, 0, 0, 0, 0]);
      result.center = new Vector3();
      return result;
    }
    const length2 = positions.length;
    const meanPoint = new Vector3(0, 0, 0);
    for (const position of positions) {
      meanPoint.add(position);
    }
    const invLength = 1 / length2;
    meanPoint.multiplyByScalar(invLength);
    let exx = 0;
    let exy = 0;
    let exz = 0;
    let eyy = 0;
    let eyz = 0;
    let ezz = 0;
    for (const position of positions) {
      const p = scratchVector2.copy(position).subtract(meanPoint);
      exx += p.x * p.x;
      exy += p.x * p.y;
      exz += p.x * p.z;
      eyy += p.y * p.y;
      eyz += p.y * p.z;
      ezz += p.z * p.z;
    }
    exx *= invLength;
    exy *= invLength;
    exz *= invLength;
    eyy *= invLength;
    eyz *= invLength;
    ezz *= invLength;
    const covarianceMatrix = scratchCovarianceResult;
    covarianceMatrix[0] = exx;
    covarianceMatrix[1] = exy;
    covarianceMatrix[2] = exz;
    covarianceMatrix[3] = exy;
    covarianceMatrix[4] = eyy;
    covarianceMatrix[5] = eyz;
    covarianceMatrix[6] = exz;
    covarianceMatrix[7] = eyz;
    covarianceMatrix[8] = ezz;
    const {
      unitary
    } = computeEigenDecomposition(covarianceMatrix, scratchEigenResult);
    const rotation = result.halfAxes.copy(unitary);
    let v1 = rotation.getColumn(0, scratchVector4);
    let v2 = rotation.getColumn(1, scratchVector5);
    let v3 = rotation.getColumn(2, scratchVector6);
    let u1 = -Number.MAX_VALUE;
    let u2 = -Number.MAX_VALUE;
    let u3 = -Number.MAX_VALUE;
    let l1 = Number.MAX_VALUE;
    let l2 = Number.MAX_VALUE;
    let l3 = Number.MAX_VALUE;
    for (const position of positions) {
      scratchVector2.copy(position);
      u1 = Math.max(scratchVector2.dot(v1), u1);
      u2 = Math.max(scratchVector2.dot(v2), u2);
      u3 = Math.max(scratchVector2.dot(v3), u3);
      l1 = Math.min(scratchVector2.dot(v1), l1);
      l2 = Math.min(scratchVector2.dot(v2), l2);
      l3 = Math.min(scratchVector2.dot(v3), l3);
    }
    v1 = v1.multiplyByScalar(0.5 * (l1 + u1));
    v2 = v2.multiplyByScalar(0.5 * (l2 + u2));
    v3 = v3.multiplyByScalar(0.5 * (l3 + u3));
    result.center.copy(v1).add(v2).add(v3);
    const scale2 = scratchVector3.set(u1 - l1, u2 - l2, u3 - l3).multiplyByScalar(0.5);
    const scaleMatrix = new Matrix3([scale2[0], 0, 0, 0, scale2[1], 0, 0, 0, scale2[2]]);
    result.halfAxes.multiplyRight(scaleMatrix);
    return result;
  }
  const scratchVector$3 = new Vector3();
  const scratchPosition = new Vector3();
  const cullingVolume = new CullingVolume([new Plane(), new Plane(), new Plane(), new Plane(), new Plane(), new Plane()]);
  function getFrameState(viewport, frameNumber) {
    const {
      cameraDirection,
      cameraUp,
      height
    } = viewport;
    const {
      metersPerUnit
    } = viewport.distanceScales;
    const viewportCenterCartesian = worldToCartesian(viewport, viewport.center);
    const enuToFixedTransform = Ellipsoid.WGS84.eastNorthUpToFixedFrame(viewportCenterCartesian);
    const cameraPositionCartographic = viewport.unprojectPosition(viewport.cameraPosition);
    const cameraPositionCartesian2 = Ellipsoid.WGS84.cartographicToCartesian(cameraPositionCartographic, new Vector3());
    const cameraDirectionCartesian = new Vector3(enuToFixedTransform.transformAsVector(new Vector3(cameraDirection).scale(metersPerUnit))).normalize();
    const cameraUpCartesian = new Vector3(enuToFixedTransform.transformAsVector(new Vector3(cameraUp).scale(metersPerUnit))).normalize();
    commonSpacePlanesToWGS84(viewport);
    const ViewportClass = viewport.constructor;
    const {
      longitude,
      latitude,
      width,
      bearing,
      zoom
    } = viewport;
    const topDownViewport = new ViewportClass({
      longitude,
      latitude,
      height,
      width,
      bearing,
      zoom,
      pitch: 0
    });
    return {
      camera: {
        position: cameraPositionCartesian2,
        direction: cameraDirectionCartesian,
        up: cameraUpCartesian
      },
      viewport,
      topDownViewport,
      height,
      cullingVolume,
      frameNumber,
      sseDenominator: 1.15
    };
  }
  function limitSelectedTiles(tiles, frameState, maximumTilesSelected) {
    if (maximumTilesSelected === 0 || tiles.length <= maximumTilesSelected) {
      return [tiles, []];
    }
    const tuples = [];
    const {
      longitude: viewportLongitude,
      latitude: viewportLatitude
    } = frameState.viewport;
    for (const [index, tile] of tiles.entries()) {
      const [longitude, latitude] = tile.header.mbs;
      const deltaLon = Math.abs(viewportLongitude - longitude);
      const deltaLat = Math.abs(viewportLatitude - latitude);
      const distance = Math.sqrt(deltaLat * deltaLat + deltaLon * deltaLon);
      tuples.push([index, distance]);
    }
    const tuplesSorted = tuples.sort((a2, b) => a2[1] - b[1]);
    const selectedTiles = [];
    for (let i2 = 0; i2 < maximumTilesSelected; i2++) {
      selectedTiles.push(tiles[tuplesSorted[i2][0]]);
    }
    const unselectedTiles = [];
    for (let i2 = maximumTilesSelected; i2 < tuplesSorted.length; i2++) {
      unselectedTiles.push(tiles[tuplesSorted[i2][0]]);
    }
    return [selectedTiles, unselectedTiles];
  }
  function commonSpacePlanesToWGS84(viewport) {
    const frustumPlanes = viewport.getFrustumPlanes();
    const nearCenterCommon = closestPointOnPlane(frustumPlanes.near, viewport.cameraPosition);
    const nearCenterCartesian = worldToCartesian(viewport, nearCenterCommon);
    const cameraCartesian = worldToCartesian(viewport, viewport.cameraPosition, scratchPosition);
    let i2 = 0;
    cullingVolume.planes[i2++].fromPointNormal(nearCenterCartesian, scratchVector$3.copy(nearCenterCartesian).subtract(cameraCartesian));
    for (const dir in frustumPlanes) {
      if (dir === "near") {
        continue;
      }
      const plane = frustumPlanes[dir];
      const posCommon = closestPointOnPlane(plane, nearCenterCommon, scratchPosition);
      const cartesianPos = worldToCartesian(viewport, posCommon, scratchPosition);
      cullingVolume.planes[i2++].fromPointNormal(cartesianPos, scratchVector$3.copy(nearCenterCartesian).subtract(cartesianPos));
    }
  }
  function closestPointOnPlane(plane, refPoint) {
    let out = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : new Vector3();
    const distanceToRef = plane.normal.dot(refPoint);
    out.copy(plane.normal).scale(plane.distance - distanceToRef).add(refPoint);
    return out;
  }
  function worldToCartesian(viewport, point) {
    let out = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : new Vector3();
    const cartographicPos = viewport.unprojectPosition(point);
    return Ellipsoid.WGS84.cartographicToCartesian(cartographicPos, out);
  }
  const WGS84_RADIUS_X = 6378137;
  const WGS84_RADIUS_Y = 6378137;
  const WGS84_RADIUS_Z = 6356752314245179e-9;
  const scratchVector$2 = new Vector3();
  function getZoomFromBoundingVolume(boundingVolume, cartorgraphicCenter) {
    if (boundingVolume instanceof OrientedBoundingBox) {
      const {
        halfAxes
      } = boundingVolume;
      const obbSize = getObbSize(halfAxes);
      return Math.log2(WGS84_RADIUS_Z / (obbSize + cartorgraphicCenter[2]));
    } else if (boundingVolume instanceof BoundingSphere) {
      const {
        radius
      } = boundingVolume;
      return Math.log2(WGS84_RADIUS_Z / (radius + cartorgraphicCenter[2]));
    } else if (boundingVolume.width && boundingVolume.height) {
      const {
        width,
        height
      } = boundingVolume;
      const zoomX = Math.log2(WGS84_RADIUS_X / width);
      const zoomY = Math.log2(WGS84_RADIUS_Y / height);
      return (zoomX + zoomY) / 2;
    }
    return 1;
  }
  function getZoomFromFullExtent(fullExtent, cartorgraphicCenter, cartesianCenter) {
    Ellipsoid.WGS84.cartographicToCartesian([fullExtent.xmax, fullExtent.ymax, fullExtent.zmax], scratchVector$2);
    const extentSize = Math.sqrt(Math.pow(scratchVector$2[0] - cartesianCenter[0], 2) + Math.pow(scratchVector$2[1] - cartesianCenter[1], 2) + Math.pow(scratchVector$2[2] - cartesianCenter[2], 2));
    return Math.log2(WGS84_RADIUS_Z / (extentSize + cartorgraphicCenter[2]));
  }
  function getZoomFromExtent(extent, cartorgraphicCenter, cartesianCenter) {
    const [xmin, ymin, xmax, ymax] = extent;
    return getZoomFromFullExtent({
      xmin,
      xmax,
      ymin,
      ymax,
      zmin: 0,
      zmax: 0
    }, cartorgraphicCenter, cartesianCenter);
  }
  function getObbSize(halfAxes) {
    halfAxes.getColumn(0, scratchVector$2);
    const axeY = halfAxes.getColumn(1);
    const axeZ = halfAxes.getColumn(2);
    const farthestVertex = scratchVector$2.add(axeY).add(axeZ);
    const size = farthestVertex.len();
    return size;
  }
  const TILE_CONTENT_STATE = {
    UNLOADED: 0,
    LOADING: 1,
    PROCESSING: 2,
    READY: 3,
    EXPIRED: 4,
    FAILED: 5
  };
  let TILE_REFINEMENT = function(TILE_REFINEMENT2) {
    TILE_REFINEMENT2[TILE_REFINEMENT2["ADD"] = 1] = "ADD";
    TILE_REFINEMENT2[TILE_REFINEMENT2["REPLACE"] = 2] = "REPLACE";
    return TILE_REFINEMENT2;
  }({});
  let TILE_TYPE = function(TILE_TYPE2) {
    TILE_TYPE2["EMPTY"] = "empty";
    TILE_TYPE2["SCENEGRAPH"] = "scenegraph";
    TILE_TYPE2["POINTCLOUD"] = "pointcloud";
    TILE_TYPE2["MESH"] = "mesh";
    return TILE_TYPE2;
  }({});
  let TILESET_TYPE = function(TILESET_TYPE2) {
    TILESET_TYPE2["I3S"] = "I3S";
    TILESET_TYPE2["TILES3D"] = "TILES3D";
    return TILESET_TYPE2;
  }({});
  let LOD_METRIC_TYPE = function(LOD_METRIC_TYPE2) {
    LOD_METRIC_TYPE2["GEOMETRIC_ERROR"] = "geometricError";
    LOD_METRIC_TYPE2["MAX_SCREEN_THRESHOLD"] = "maxScreenThreshold";
    return LOD_METRIC_TYPE2;
  }({});
  const TILE3D_OPTIMIZATION_HINT = {
    NOT_COMPUTED: -1,
    USE_OPTIMIZATION: 1,
    SKIP_OPTIMIZATION: 0
  };
  function defined$3(x) {
    return x !== void 0 && x !== null;
  }
  const scratchPoint = new Vector3();
  const scratchScale = new Vector3();
  const scratchNorthWest = new Vector3();
  const scratchSouthEast = new Vector3();
  const scratchCenter = new Vector3();
  const scratchXAxis = new Vector3();
  const scratchYAxis = new Vector3();
  const scratchZAxis = new Vector3();
  function createBoundingVolume(boundingVolumeHeader, transform, result) {
    assert$6(boundingVolumeHeader, "3D Tile: boundingVolume must be defined");
    if (boundingVolumeHeader.box) {
      return createBox(boundingVolumeHeader.box, transform, result);
    }
    if (boundingVolumeHeader.region) {
      return createObbFromRegion(boundingVolumeHeader.region);
    }
    if (boundingVolumeHeader.sphere) {
      return createSphere(boundingVolumeHeader.sphere, transform, result);
    }
    throw new Error("3D Tile: boundingVolume must contain a sphere, region, or box");
  }
  function getCartographicBounds(boundingVolumeHeader, boundingVolume) {
    if (boundingVolumeHeader.box) {
      return orientedBoundingBoxToCartographicBounds(boundingVolume);
    }
    if (boundingVolumeHeader.region) {
      const [west, south, east, north, minHeight, maxHeight] = boundingVolumeHeader.region;
      return [[degrees(west), degrees(south), minHeight], [degrees(east), degrees(north), maxHeight]];
    }
    if (boundingVolumeHeader.sphere) {
      return boundingSphereToCartographicBounds(boundingVolume);
    }
    throw new Error("Unkown boundingVolume type");
  }
  function createBox(box, transform, result) {
    const center = new Vector3(box[0], box[1], box[2]);
    transform.transform(center, center);
    let origin = [];
    if (box.length === 10) {
      const halfSize = box.slice(3, 6);
      const quaternion = new Quaternion();
      quaternion.fromArray(box, 6);
      const x = new Vector3([1, 0, 0]);
      const y = new Vector3([0, 1, 0]);
      const z = new Vector3([0, 0, 1]);
      x.transformByQuaternion(quaternion);
      x.scale(halfSize[0]);
      y.transformByQuaternion(quaternion);
      y.scale(halfSize[1]);
      z.transformByQuaternion(quaternion);
      z.scale(halfSize[2]);
      origin = [...x.toArray(), ...y.toArray(), ...z.toArray()];
    } else {
      origin = [...box.slice(3, 6), ...box.slice(6, 9), ...box.slice(9, 12)];
    }
    const xAxis = transform.transformAsVector(origin.slice(0, 3));
    const yAxis = transform.transformAsVector(origin.slice(3, 6));
    const zAxis = transform.transformAsVector(origin.slice(6, 9));
    const halfAxes = new Matrix3([xAxis[0], xAxis[1], xAxis[2], yAxis[0], yAxis[1], yAxis[2], zAxis[0], zAxis[1], zAxis[2]]);
    if (defined$3(result)) {
      result.center = center;
      result.halfAxes = halfAxes;
      return result;
    }
    return new OrientedBoundingBox(center, halfAxes);
  }
  function createSphere(sphere, transform, result) {
    const center = new Vector3(sphere[0], sphere[1], sphere[2]);
    transform.transform(center, center);
    const scale2 = transform.getScale(scratchScale);
    const uniformScale = Math.max(Math.max(scale2[0], scale2[1]), scale2[2]);
    const radius = sphere[3] * uniformScale;
    if (defined$3(result)) {
      result.center = center;
      result.radius = radius;
      return result;
    }
    return new BoundingSphere(center, radius);
  }
  function createObbFromRegion(region) {
    const [west, south, east, north, minHeight, maxHeight] = region;
    const northWest = Ellipsoid.WGS84.cartographicToCartesian([degrees(west), degrees(north), minHeight], scratchNorthWest);
    const southEast = Ellipsoid.WGS84.cartographicToCartesian([degrees(east), degrees(south), maxHeight], scratchSouthEast);
    const centerInCartesian = new Vector3().addVectors(northWest, southEast).multiplyByScalar(0.5);
    Ellipsoid.WGS84.cartesianToCartographic(centerInCartesian, scratchCenter);
    Ellipsoid.WGS84.cartographicToCartesian([degrees(east), scratchCenter[1], scratchCenter[2]], scratchXAxis);
    Ellipsoid.WGS84.cartographicToCartesian([scratchCenter[0], degrees(north), scratchCenter[2]], scratchYAxis);
    Ellipsoid.WGS84.cartographicToCartesian([scratchCenter[0], scratchCenter[1], maxHeight], scratchZAxis);
    return createBox([...centerInCartesian, ...scratchXAxis.subtract(centerInCartesian), ...scratchYAxis.subtract(centerInCartesian), ...scratchZAxis.subtract(centerInCartesian)], new Matrix4());
  }
  function orientedBoundingBoxToCartographicBounds(boundingVolume) {
    const result = emptyCartographicBounds();
    const {
      halfAxes
    } = boundingVolume;
    const xAxis = new Vector3(halfAxes.getColumn(0));
    const yAxis = new Vector3(halfAxes.getColumn(1));
    const zAxis = new Vector3(halfAxes.getColumn(2));
    for (let x = 0; x < 2; x++) {
      for (let y = 0; y < 2; y++) {
        for (let z = 0; z < 2; z++) {
          scratchPoint.copy(boundingVolume.center);
          scratchPoint.add(xAxis);
          scratchPoint.add(yAxis);
          scratchPoint.add(zAxis);
          addToCartographicBounds(result, scratchPoint);
          zAxis.negate();
        }
        yAxis.negate();
      }
      xAxis.negate();
    }
    return result;
  }
  function boundingSphereToCartographicBounds(boundingVolume) {
    const result = emptyCartographicBounds();
    const {
      center,
      radius
    } = boundingVolume;
    const point = Ellipsoid.WGS84.scaleToGeodeticSurface(center, scratchPoint);
    let zAxis;
    if (point) {
      zAxis = Ellipsoid.WGS84.geodeticSurfaceNormal(point);
    } else {
      zAxis = new Vector3(0, 0, 1);
    }
    let xAxis = new Vector3(zAxis[2], -zAxis[1], 0);
    if (xAxis.len() > 0) {
      xAxis.normalize();
    } else {
      xAxis = new Vector3(0, 1, 0);
    }
    const yAxis = xAxis.clone().cross(zAxis);
    for (const axis of [xAxis, yAxis, zAxis]) {
      scratchScale.copy(axis).scale(radius);
      for (let dir = 0; dir < 2; dir++) {
        scratchPoint.copy(center);
        scratchPoint.add(scratchScale);
        addToCartographicBounds(result, scratchPoint);
        scratchScale.negate();
      }
    }
    return result;
  }
  function emptyCartographicBounds() {
    return [[Infinity, Infinity, Infinity], [-Infinity, -Infinity, -Infinity]];
  }
  function addToCartographicBounds(target, cartesian) {
    Ellipsoid.WGS84.cartesianToCartographic(cartesian, scratchPoint);
    target[0][0] = Math.min(target[0][0], scratchPoint[0]);
    target[0][1] = Math.min(target[0][1], scratchPoint[1]);
    target[0][2] = Math.min(target[0][2], scratchPoint[2]);
    target[1][0] = Math.max(target[1][0], scratchPoint[0]);
    target[1][1] = Math.max(target[1][1], scratchPoint[1]);
    target[1][2] = Math.max(target[1][2], scratchPoint[2]);
  }
  new Vector3();
  new Vector3();
  new Matrix4();
  new Vector3();
  new Vector3();
  new Vector3();
  function fog(distanceToCamera, density) {
    const scalar = distanceToCamera * density;
    return 1 - Math.exp(-(scalar * scalar));
  }
  function getDynamicScreenSpaceError(tileset, distanceToCamera) {
    if (tileset.dynamicScreenSpaceError && tileset.dynamicScreenSpaceErrorComputedDensity) {
      const density = tileset.dynamicScreenSpaceErrorComputedDensity;
      const factor = tileset.dynamicScreenSpaceErrorFactor;
      const dynamicError = fog(distanceToCamera, density) * factor;
      return dynamicError;
    }
    return 0;
  }
  function getTiles3DScreenSpaceError(tile, frameState, useParentLodMetric) {
    const tileset = tile.tileset;
    const parentLodMetricValue = tile.parent && tile.parent.lodMetricValue || tile.lodMetricValue;
    const lodMetricValue = useParentLodMetric ? parentLodMetricValue : tile.lodMetricValue;
    if (lodMetricValue === 0) {
      return 0;
    }
    const distance = Math.max(tile._distanceToCamera, 1e-7);
    const {
      height,
      sseDenominator
    } = frameState;
    const {
      viewDistanceScale
    } = tileset.options;
    let error = lodMetricValue * height * (viewDistanceScale || 1) / (distance * sseDenominator);
    error -= getDynamicScreenSpaceError(tileset, distance);
    return error;
  }
  const cameraPositionCartesian = new Vector3();
  const toEye = new Vector3();
  const cameraPositionEnu = new Vector3();
  const extraVertexEnu = new Vector3();
  const projectedOriginVector = new Vector3();
  const enuToCartesianMatrix = new Matrix4();
  const cartesianToEnuMatrix = new Matrix4();
  function getLodStatus(tile, frameState) {
    if (tile.lodMetricValue === 0 || isNaN(tile.lodMetricValue)) {
      return "DIG";
    }
    const screenSize = 2 * getProjectedRadius(tile, frameState);
    if (screenSize < 2) {
      return "OUT";
    }
    if (!tile.header.children || screenSize <= tile.lodMetricValue) {
      return "DRAW";
    } else if (tile.header.children) {
      return "DIG";
    }
    return "OUT";
  }
  function getProjectedRadius(tile, frameState) {
    const {
      topDownViewport: viewport
    } = frameState;
    const mbsLat = tile.header.mbs[1];
    const mbsLon = tile.header.mbs[0];
    const mbsZ = tile.header.mbs[2];
    const mbsR = tile.header.mbs[3];
    const mbsCenterCartesian = [...tile.boundingVolume.center];
    const cameraPositionCartographic = viewport.unprojectPosition(viewport.cameraPosition);
    Ellipsoid.WGS84.cartographicToCartesian(cameraPositionCartographic, cameraPositionCartesian);
    toEye.copy(cameraPositionCartesian).subtract(mbsCenterCartesian).normalize();
    Ellipsoid.WGS84.eastNorthUpToFixedFrame(mbsCenterCartesian, enuToCartesianMatrix);
    cartesianToEnuMatrix.copy(enuToCartesianMatrix).invert();
    cameraPositionEnu.copy(cameraPositionCartesian).transform(cartesianToEnuMatrix);
    const projection = Math.sqrt(cameraPositionEnu[0] * cameraPositionEnu[0] + cameraPositionEnu[1] * cameraPositionEnu[1]);
    const extraZ = projection * projection / cameraPositionEnu[2];
    extraVertexEnu.copy([cameraPositionEnu[0], cameraPositionEnu[1], extraZ]);
    const extraVertexCartesian = extraVertexEnu.transform(enuToCartesianMatrix);
    const extraVectorCartesian = extraVertexCartesian.subtract(mbsCenterCartesian).normalize();
    const radiusVector = toEye.cross(extraVectorCartesian).normalize().scale(mbsR);
    const sphereMbsBorderVertexCartesian = radiusVector.add(mbsCenterCartesian);
    const sphereMbsBorderVertexCartographic = Ellipsoid.WGS84.cartesianToCartographic(sphereMbsBorderVertexCartesian);
    const projectedOrigin = viewport.project([mbsLon, mbsLat, mbsZ]);
    const projectedMbsBorderVertex = viewport.project(sphereMbsBorderVertexCartographic);
    const projectedRadius = projectedOriginVector.copy(projectedOrigin).subtract(projectedMbsBorderVertex).magnitude();
    return projectedRadius;
  }
  function get3dTilesOptions(tileset) {
    return {
      assetGltfUpAxis: tileset.asset && tileset.asset.gltfUpAxis || "Y"
    };
  }
  class ManagedArray {
    constructor() {
      let length2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
      this._map = /* @__PURE__ */ new Map();
      this._array = void 0;
      this._length = void 0;
      this._array = new Array(length2);
      this._length = length2;
    }
    get length() {
      return this._length;
    }
    set length(length2) {
      this._length = length2;
      if (length2 > this._array.length) {
        this._array.length = length2;
      }
    }
    get values() {
      return this._array;
    }
    get(index) {
      assert$6(index < this._array.length);
      return this._array[index];
    }
    set(index, element) {
      assert$6(index >= 0);
      if (index >= this.length) {
        this.length = index + 1;
      }
      if (this._map.has(this._array[index])) {
        this._map.delete(this._array[index]);
      }
      this._array[index] = element;
      this._map.set(element, index);
    }
    delete(element) {
      const index = this._map.get(element);
      if (index >= 0) {
        this._array.splice(index, 1);
        this._map.delete(element);
        this.length--;
      }
    }
    peek() {
      return this._array[this._length - 1];
    }
    push(element) {
      if (!this._map.has(element)) {
        const index = this.length++;
        this._array[index] = element;
        this._map.set(element, index);
      }
    }
    pop() {
      const element = this._array[--this.length];
      this._map.delete(element);
      return element;
    }
    reserve(length2) {
      assert$6(length2 >= 0);
      if (length2 > this._array.length) {
        this._array.length = length2;
      }
    }
    resize(length2) {
      assert$6(length2 >= 0);
      this.length = length2;
    }
    trim(length2) {
      if (length2 === null || length2 === void 0) {
        length2 = this.length;
      }
      this._array.length = length2;
    }
    reset() {
      this._array = [];
      this._map = /* @__PURE__ */ new Map();
      this._length = 0;
    }
    find(target) {
      return this._map.has(target);
    }
  }
  const DEFAULT_PROPS$1 = {
    loadSiblings: false,
    skipLevelOfDetail: false,
    updateTransforms: true,
    onTraversalEnd: () => {
    },
    viewportTraversersMap: {},
    basePath: ""
  };
  class TilesetTraverser {
    traversalFinished(frameState) {
      return true;
    }
    constructor(options) {
      this.options = void 0;
      this.root = null;
      this.selectedTiles = {};
      this.requestedTiles = {};
      this.emptyTiles = {};
      this.lastUpdate = (/* @__PURE__ */ new Date()).getTime();
      this.updateDebounceTime = 1e3;
      this._traversalStack = new ManagedArray();
      this._emptyTraversalStack = new ManagedArray();
      this._frameNumber = null;
      this.options = {
        ...DEFAULT_PROPS$1,
        ...options
      };
    }
    traverse(root, frameState, options) {
      this.root = root;
      this.options = {
        ...this.options,
        ...options
      };
      this.reset();
      this.updateTile(root, frameState);
      this._frameNumber = frameState.frameNumber;
      this.executeTraversal(root, frameState);
    }
    reset() {
      this.requestedTiles = {};
      this.selectedTiles = {};
      this.emptyTiles = {};
      this._traversalStack.reset();
      this._emptyTraversalStack.reset();
    }
    executeTraversal(root, frameState) {
      const stack2 = this._traversalStack;
      root._selectionDepth = 1;
      stack2.push(root);
      while (stack2.length > 0) {
        const tile = stack2.pop();
        let shouldRefine = false;
        if (this.canTraverse(tile, frameState)) {
          this.updateChildTiles(tile, frameState);
          shouldRefine = this.updateAndPushChildren(tile, frameState, stack2, tile.hasRenderContent ? tile._selectionDepth + 1 : tile._selectionDepth);
        }
        const parent = tile.parent;
        const parentRefines = Boolean(!parent || parent._shouldRefine);
        const stoppedRefining = !shouldRefine;
        if (!tile.hasRenderContent) {
          this.emptyTiles[tile.id] = tile;
          this.loadTile(tile, frameState);
          if (stoppedRefining) {
            this.selectTile(tile, frameState);
          }
        } else if (tile.refine === TILE_REFINEMENT.ADD) {
          this.loadTile(tile, frameState);
          this.selectTile(tile, frameState);
        } else if (tile.refine === TILE_REFINEMENT.REPLACE) {
          this.loadTile(tile, frameState);
          if (stoppedRefining) {
            this.selectTile(tile, frameState);
          }
        }
        this.touchTile(tile, frameState);
        tile._shouldRefine = shouldRefine && parentRefines;
      }
      const newTime = (/* @__PURE__ */ new Date()).getTime();
      if (this.traversalFinished(frameState) || newTime - this.lastUpdate > this.updateDebounceTime) {
        this.lastUpdate = newTime;
        this.options.onTraversalEnd(frameState);
      }
    }
    updateChildTiles(tile, frameState) {
      const children = tile.children;
      for (const child of children) {
        this.updateTile(child, frameState);
      }
    }
    updateAndPushChildren(tile, frameState, stack2, depth) {
      const {
        loadSiblings,
        skipLevelOfDetail
      } = this.options;
      const children = tile.children;
      children.sort(this.compareDistanceToCamera.bind(this));
      const checkRefines = tile.refine === TILE_REFINEMENT.REPLACE && tile.hasRenderContent && !skipLevelOfDetail;
      let hasVisibleChild = false;
      let refines = true;
      for (const child of children) {
        child._selectionDepth = depth;
        if (child.isVisibleAndInRequestVolume) {
          if (stack2.find(child)) {
            stack2.delete(child);
          }
          stack2.push(child);
          hasVisibleChild = true;
        } else if (checkRefines || loadSiblings) {
          this.loadTile(child, frameState);
          this.touchTile(child, frameState);
        }
        if (checkRefines) {
          let childRefines;
          if (!child._inRequestVolume) {
            childRefines = false;
          } else if (!child.hasRenderContent) {
            childRefines = this.executeEmptyTraversal(child, frameState);
          } else {
            childRefines = child.contentAvailable;
          }
          refines = refines && childRefines;
          if (!refines) {
            return false;
          }
        }
      }
      if (!hasVisibleChild) {
        refines = false;
      }
      return refines;
    }
    updateTile(tile, frameState) {
      this.updateTileVisibility(tile, frameState);
    }
    selectTile(tile, frameState) {
      if (this.shouldSelectTile(tile)) {
        tile._selectedFrame = frameState.frameNumber;
        this.selectedTiles[tile.id] = tile;
      }
    }
    loadTile(tile, frameState) {
      if (this.shouldLoadTile(tile)) {
        tile._requestedFrame = frameState.frameNumber;
        tile._priority = tile._getPriority();
        this.requestedTiles[tile.id] = tile;
      }
    }
    touchTile(tile, frameState) {
      tile.tileset._cache.touch(tile);
      tile._touchedFrame = frameState.frameNumber;
    }
    canTraverse(tile, frameState) {
      let useParentMetric = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
      let ignoreVisibility = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
      if (!tile.hasChildren) {
        return false;
      }
      if (tile.hasTilesetContent) {
        return !tile.contentExpired;
      }
      if (!ignoreVisibility && !tile.isVisibleAndInRequestVolume) {
        return false;
      }
      return this.shouldRefine(tile, frameState, useParentMetric);
    }
    shouldLoadTile(tile) {
      return tile.hasUnloadedContent || tile.contentExpired;
    }
    shouldSelectTile(tile) {
      return tile.contentAvailable && !this.options.skipLevelOfDetail;
    }
    shouldRefine(tile, frameState) {
      let useParentMetric = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
      let screenSpaceError = tile._screenSpaceError;
      if (useParentMetric) {
        screenSpaceError = tile.getScreenSpaceError(frameState, true);
      }
      return screenSpaceError > tile.tileset.memoryAdjustedScreenSpaceError;
    }
    updateTileVisibility(tile, frameState) {
      const viewportIds = [];
      if (this.options.viewportTraversersMap) {
        for (const key in this.options.viewportTraversersMap) {
          const value = this.options.viewportTraversersMap[key];
          if (value === frameState.viewport.id) {
            viewportIds.push(key);
          }
        }
      } else {
        viewportIds.push(frameState.viewport.id);
      }
      tile.updateVisibility(frameState, viewportIds);
    }
    compareDistanceToCamera(b, a2) {
      return b._distanceToCamera - a2._distanceToCamera;
    }
    anyChildrenVisible(tile, frameState) {
      let anyVisible = false;
      for (const child of tile.children) {
        child.updateVisibility(frameState);
        anyVisible = anyVisible || child.isVisibleAndInRequestVolume;
      }
      return anyVisible;
    }
    executeEmptyTraversal(root, frameState) {
      let allDescendantsLoaded = true;
      const stack2 = this._emptyTraversalStack;
      stack2.push(root);
      while (stack2.length > 0) {
        const tile = stack2.pop();
        const traverse = !tile.hasRenderContent && this.canTraverse(tile, frameState, false, false);
        const emptyLeaf = !tile.hasRenderContent && tile.children.length === 0;
        if (!traverse && !tile.contentAvailable && !emptyLeaf) {
          allDescendantsLoaded = false;
        }
        this.updateTile(tile, frameState);
        if (!tile.isVisibleAndInRequestVolume) {
          this.loadTile(tile, frameState);
          this.touchTile(tile, frameState);
        }
        if (traverse) {
          const children = tile.children;
          for (const child of children) {
            stack2.push(child);
          }
        }
      }
      return allDescendantsLoaded;
    }
  }
  const scratchVector$1 = new Vector3();
  function defined$2(x) {
    return x !== void 0 && x !== null;
  }
  class Tile3D {
    constructor(tileset, header, parentHeader) {
      let extendedId = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "";
      this.tileset = void 0;
      this.header = void 0;
      this.id = void 0;
      this.url = void 0;
      this.parent = void 0;
      this.refine = void 0;
      this.type = void 0;
      this.contentUrl = void 0;
      this.lodMetricType = "geometricError";
      this.lodMetricValue = 0;
      this.boundingVolume = null;
      this.content = null;
      this.contentState = TILE_CONTENT_STATE.UNLOADED;
      this.gpuMemoryUsageInBytes = 0;
      this.children = [];
      this.depth = 0;
      this.viewportIds = [];
      this.transform = new Matrix4();
      this.extensions = null;
      this.implicitTiling = null;
      this.userData = {};
      this.computedTransform = void 0;
      this.hasEmptyContent = false;
      this.hasTilesetContent = false;
      this.traverser = new TilesetTraverser({});
      this._cacheNode = null;
      this._frameNumber = null;
      this._expireDate = null;
      this._expiredContent = null;
      this._boundingBox = void 0;
      this._distanceToCamera = 0;
      this._screenSpaceError = 0;
      this._visibilityPlaneMask = void 0;
      this._visible = void 0;
      this._contentBoundingVolume = void 0;
      this._viewerRequestVolume = void 0;
      this._initialTransform = new Matrix4();
      this._priority = 0;
      this._selectedFrame = 0;
      this._requestedFrame = 0;
      this._selectionDepth = 0;
      this._touchedFrame = 0;
      this._centerZDepth = 0;
      this._shouldRefine = false;
      this._stackLength = 0;
      this._visitedFrame = 0;
      this._inRequestVolume = false;
      this._lodJudge = null;
      this.header = header;
      this.tileset = tileset;
      this.id = extendedId || header.id;
      this.url = header.url;
      this.parent = parentHeader;
      this.refine = this._getRefine(header.refine);
      this.type = header.type;
      this.contentUrl = header.contentUrl;
      this._initializeLodMetric(header);
      this._initializeTransforms(header);
      this._initializeBoundingVolumes(header);
      this._initializeContent(header);
      this._initializeRenderingState(header);
      Object.seal(this);
    }
    destroy() {
      this.header = null;
    }
    isDestroyed() {
      return this.header === null;
    }
    get selected() {
      return this._selectedFrame === this.tileset._frameNumber;
    }
    get isVisible() {
      return this._visible;
    }
    get isVisibleAndInRequestVolume() {
      return this._visible && this._inRequestVolume;
    }
    get hasRenderContent() {
      return !this.hasEmptyContent && !this.hasTilesetContent;
    }
    get hasChildren() {
      return this.children.length > 0 || this.header.children && this.header.children.length > 0;
    }
    get contentReady() {
      return this.contentState === TILE_CONTENT_STATE.READY || this.hasEmptyContent;
    }
    get contentAvailable() {
      return Boolean(this.contentReady && this.hasRenderContent || this._expiredContent && !this.contentFailed);
    }
    get hasUnloadedContent() {
      return this.hasRenderContent && this.contentUnloaded;
    }
    get contentUnloaded() {
      return this.contentState === TILE_CONTENT_STATE.UNLOADED;
    }
    get contentExpired() {
      return this.contentState === TILE_CONTENT_STATE.EXPIRED;
    }
    get contentFailed() {
      return this.contentState === TILE_CONTENT_STATE.FAILED;
    }
    get distanceToCamera() {
      return this._distanceToCamera;
    }
    get screenSpaceError() {
      return this._screenSpaceError;
    }
    get boundingBox() {
      if (!this._boundingBox) {
        this._boundingBox = getCartographicBounds(this.header.boundingVolume, this.boundingVolume);
      }
      return this._boundingBox;
    }
    getScreenSpaceError(frameState, useParentLodMetric) {
      switch (this.tileset.type) {
        case TILESET_TYPE.I3S:
          return getProjectedRadius(this, frameState);
        case TILESET_TYPE.TILES3D:
          return getTiles3DScreenSpaceError(this, frameState, useParentLodMetric);
        default:
          throw new Error("Unsupported tileset type");
      }
    }
    unselect() {
      this._selectedFrame = 0;
    }
    _getGpuMemoryUsageInBytes() {
      return this.content.gpuMemoryUsageInBytes || this.content.byteLength || 0;
    }
    _getPriority() {
      const traverser = this.tileset._traverser;
      const {
        skipLevelOfDetail
      } = traverser.options;
      const maySkipTile = this.refine === TILE_REFINEMENT.ADD || skipLevelOfDetail;
      if (maySkipTile && !this.isVisible && this._visible !== void 0) {
        return -1;
      }
      if (this.tileset._frameNumber - this._touchedFrame >= 1) {
        return -1;
      }
      if (this.contentState === TILE_CONTENT_STATE.UNLOADED) {
        return -1;
      }
      const parent = this.parent;
      const useParentScreenSpaceError = parent && (!maySkipTile || this._screenSpaceError === 0 || parent.hasTilesetContent);
      const screenSpaceError = useParentScreenSpaceError ? parent._screenSpaceError : this._screenSpaceError;
      const rootScreenSpaceError = traverser.root ? traverser.root._screenSpaceError : 0;
      return Math.max(rootScreenSpaceError - screenSpaceError, 0);
    }
    async loadContent() {
      if (this.hasEmptyContent) {
        return false;
      }
      if (this.content) {
        return true;
      }
      const expired = this.contentExpired;
      if (expired) {
        this._expireDate = null;
      }
      this.contentState = TILE_CONTENT_STATE.LOADING;
      const requestToken = await this.tileset._requestScheduler.scheduleRequest(this.id, this._getPriority.bind(this));
      if (!requestToken) {
        this.contentState = TILE_CONTENT_STATE.UNLOADED;
        return false;
      }
      try {
        const contentUrl = this.tileset.getTileUrl(this.contentUrl);
        const loader = this.tileset.loader;
        const options = {
          ...this.tileset.loadOptions,
          [loader.id]: {
            ...this.tileset.loadOptions[loader.id],
            isTileset: this.type === "json",
            ...this._getLoaderSpecificOptions(loader.id)
          }
        };
        this.content = await load(contentUrl, loader, options);
        if (this.tileset.options.contentLoader) {
          await this.tileset.options.contentLoader(this);
        }
        if (this._isTileset()) {
          this.tileset._initializeTileHeaders(this.content, this);
        }
        this.contentState = TILE_CONTENT_STATE.READY;
        this._onContentLoaded();
        return true;
      } catch (error) {
        this.contentState = TILE_CONTENT_STATE.FAILED;
        throw error;
      } finally {
        requestToken.done();
      }
    }
    unloadContent() {
      if (this.content && this.content.destroy) {
        this.content.destroy();
      }
      this.content = null;
      if (this.header.content && this.header.content.destroy) {
        this.header.content.destroy();
      }
      this.header.content = null;
      this.contentState = TILE_CONTENT_STATE.UNLOADED;
      return true;
    }
    updateVisibility(frameState, viewportIds) {
      if (this._frameNumber === frameState.frameNumber) {
        return;
      }
      const parent = this.parent;
      const parentVisibilityPlaneMask = parent ? parent._visibilityPlaneMask : CullingVolume.MASK_INDETERMINATE;
      if (this.tileset._traverser.options.updateTransforms) {
        const parentTransform = parent ? parent.computedTransform : this.tileset.modelMatrix;
        this._updateTransform(parentTransform);
      }
      this._distanceToCamera = this.distanceToTile(frameState);
      this._screenSpaceError = this.getScreenSpaceError(frameState, false);
      this._visibilityPlaneMask = this.visibility(frameState, parentVisibilityPlaneMask);
      this._visible = this._visibilityPlaneMask !== CullingVolume.MASK_OUTSIDE;
      this._inRequestVolume = this.insideViewerRequestVolume(frameState);
      this._frameNumber = frameState.frameNumber;
      this.viewportIds = viewportIds;
    }
    visibility(frameState, parentVisibilityPlaneMask) {
      const {
        cullingVolume: cullingVolume2
      } = frameState;
      const {
        boundingVolume
      } = this;
      return cullingVolume2.computeVisibilityWithPlaneMask(boundingVolume, parentVisibilityPlaneMask);
    }
    contentVisibility() {
      return true;
    }
    distanceToTile(frameState) {
      const boundingVolume = this.boundingVolume;
      return Math.sqrt(Math.max(boundingVolume.distanceSquaredTo(frameState.camera.position), 0));
    }
    cameraSpaceZDepth(_ref) {
      let {
        camera
      } = _ref;
      const boundingVolume = this.boundingVolume;
      scratchVector$1.subVectors(boundingVolume.center, camera.position);
      return camera.direction.dot(scratchVector$1);
    }
    insideViewerRequestVolume(frameState) {
      const viewerRequestVolume = this._viewerRequestVolume;
      return !viewerRequestVolume || viewerRequestVolume.distanceSquaredTo(frameState.camera.position) <= 0;
    }
    updateExpiration() {
      if (defined$2(this._expireDate) && this.contentReady && !this.hasEmptyContent) {
        const now = Date.now();
        if (Date.lessThan(this._expireDate, now)) {
          this.contentState = TILE_CONTENT_STATE.EXPIRED;
          this._expiredContent = this.content;
        }
      }
    }
    get extras() {
      return this.header.extras;
    }
    _initializeLodMetric(header) {
      if ("lodMetricType" in header) {
        this.lodMetricType = header.lodMetricType;
      } else {
        this.lodMetricType = this.parent && this.parent.lodMetricType || this.tileset.lodMetricType;
        console.warn(`3D Tile: Required prop lodMetricType is undefined. Using parent lodMetricType`);
      }
      if ("lodMetricValue" in header) {
        this.lodMetricValue = header.lodMetricValue;
      } else {
        this.lodMetricValue = this.parent && this.parent.lodMetricValue || this.tileset.lodMetricValue;
        console.warn("3D Tile: Required prop lodMetricValue is undefined. Using parent lodMetricValue");
      }
    }
    _initializeTransforms(tileHeader) {
      this.transform = tileHeader.transform ? new Matrix4(tileHeader.transform) : new Matrix4();
      const parent = this.parent;
      const tileset = this.tileset;
      const parentTransform = parent && parent.computedTransform ? parent.computedTransform.clone() : tileset.modelMatrix.clone();
      this.computedTransform = new Matrix4(parentTransform).multiplyRight(this.transform);
      const parentInitialTransform = parent && parent._initialTransform ? parent._initialTransform.clone() : new Matrix4();
      this._initialTransform = new Matrix4(parentInitialTransform).multiplyRight(this.transform);
    }
    _initializeBoundingVolumes(tileHeader) {
      this._contentBoundingVolume = null;
      this._viewerRequestVolume = null;
      this._updateBoundingVolume(tileHeader);
    }
    _initializeContent(tileHeader) {
      this.content = {
        _tileset: this.tileset,
        _tile: this
      };
      this.hasEmptyContent = true;
      this.contentState = TILE_CONTENT_STATE.UNLOADED;
      this.hasTilesetContent = false;
      if (tileHeader.contentUrl) {
        this.content = null;
        this.hasEmptyContent = false;
      }
    }
    _initializeRenderingState(header) {
      this.depth = header.level || (this.parent ? this.parent.depth + 1 : 0);
      this._shouldRefine = false;
      this._distanceToCamera = 0;
      this._centerZDepth = 0;
      this._screenSpaceError = 0;
      this._visibilityPlaneMask = CullingVolume.MASK_INDETERMINATE;
      this._visible = void 0;
      this._inRequestVolume = false;
      this._stackLength = 0;
      this._selectionDepth = 0;
      this._frameNumber = 0;
      this._touchedFrame = 0;
      this._visitedFrame = 0;
      this._selectedFrame = 0;
      this._requestedFrame = 0;
      this._priority = 0;
    }
    _getRefine(refine) {
      return refine || this.parent && this.parent.refine || TILE_REFINEMENT.REPLACE;
    }
    _isTileset() {
      return this.contentUrl.indexOf(".json") !== -1;
    }
    _onContentLoaded() {
      switch (this.content && this.content.type) {
        case "vctr":
        case "geom":
          this.tileset._traverser.disableSkipLevelOfDetail = true;
          break;
      }
      if (this._isTileset()) {
        this.hasTilesetContent = true;
      } else {
        this.gpuMemoryUsageInBytes = this._getGpuMemoryUsageInBytes();
      }
    }
    _updateBoundingVolume(header) {
      this.boundingVolume = createBoundingVolume(header.boundingVolume, this.computedTransform, this.boundingVolume);
      const content = header.content;
      if (!content) {
        return;
      }
      if (content.boundingVolume) {
        this._contentBoundingVolume = createBoundingVolume(content.boundingVolume, this.computedTransform, this._contentBoundingVolume);
      }
      if (header.viewerRequestVolume) {
        this._viewerRequestVolume = createBoundingVolume(header.viewerRequestVolume, this.computedTransform, this._viewerRequestVolume);
      }
    }
    _updateTransform() {
      let parentTransform = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : new Matrix4();
      const computedTransform = parentTransform.clone().multiplyRight(this.transform);
      const didTransformChange = !computedTransform.equals(this.computedTransform);
      if (!didTransformChange) {
        return;
      }
      this.computedTransform = computedTransform;
      this._updateBoundingVolume(this.header);
    }
    _getLoaderSpecificOptions(loaderId) {
      switch (loaderId) {
        case "i3s":
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
            isTileHeader: false
          };
        case "3d-tiles":
        case "cesium-ion":
        default:
          return get3dTilesOptions(this.tileset.tileset);
      }
    }
  }
  class Tileset3DTraverser extends TilesetTraverser {
    compareDistanceToCamera(a2, b) {
      return b._distanceToCamera === 0 && a2._distanceToCamera === 0 ? b._centerZDepth - a2._centerZDepth : b._distanceToCamera - a2._distanceToCamera;
    }
    updateTileVisibility(tile, frameState) {
      super.updateTileVisibility(tile, frameState);
      if (!tile.isVisibleAndInRequestVolume) {
        return;
      }
      const hasChildren = tile.children.length > 0;
      if (tile.hasTilesetContent && hasChildren) {
        const firstChild = tile.children[0];
        this.updateTileVisibility(firstChild, frameState);
        tile._visible = firstChild._visible;
        return;
      }
      if (this.meetsScreenSpaceErrorEarly(tile, frameState)) {
        tile._visible = false;
        return;
      }
      const replace = tile.refine === TILE_REFINEMENT.REPLACE;
      const useOptimization = tile._optimChildrenWithinParent === TILE3D_OPTIMIZATION_HINT.USE_OPTIMIZATION;
      if (replace && useOptimization && hasChildren) {
        if (!this.anyChildrenVisible(tile, frameState)) {
          tile._visible = false;
          return;
        }
      }
    }
    meetsScreenSpaceErrorEarly(tile, frameState) {
      const {
        parent
      } = tile;
      if (!parent || parent.hasTilesetContent || parent.refine !== TILE_REFINEMENT.ADD) {
        return false;
      }
      return !this.shouldRefine(tile, frameState, true);
    }
  }
  class I3SPendingTilesRegister {
    constructor() {
      this.frameNumberMap = /* @__PURE__ */ new Map();
    }
    register(viewportId, frameNumber) {
      const viewportMap = this.frameNumberMap.get(viewportId) || /* @__PURE__ */ new Map();
      const oldCount = viewportMap.get(frameNumber) || 0;
      viewportMap.set(frameNumber, oldCount + 1);
      this.frameNumberMap.set(viewportId, viewportMap);
    }
    deregister(viewportId, frameNumber) {
      const viewportMap = this.frameNumberMap.get(viewportId);
      if (!viewportMap) {
        return;
      }
      const oldCount = viewportMap.get(frameNumber) || 1;
      viewportMap.set(frameNumber, oldCount - 1);
    }
    isZero(viewportId, frameNumber) {
      var _this$frameNumberMap$;
      const count = ((_this$frameNumberMap$ = this.frameNumberMap.get(viewportId)) === null || _this$frameNumberMap$ === void 0 ? void 0 : _this$frameNumberMap$.get(frameNumber)) || 0;
      return count === 0;
    }
  }
  const STATUS = {
    REQUESTED: "REQUESTED",
    COMPLETED: "COMPLETED",
    ERROR: "ERROR"
  };
  class I3STileManager {
    constructor() {
      this._statusMap = void 0;
      this.pendingTilesRegister = new I3SPendingTilesRegister();
      this._statusMap = {};
    }
    add(request, key, callback, frameState) {
      if (!this._statusMap[key]) {
        const {
          frameNumber,
          viewport: {
            id
          }
        } = frameState;
        this._statusMap[key] = {
          request,
          callback,
          key,
          frameState,
          status: STATUS.REQUESTED
        };
        this.pendingTilesRegister.register(id, frameNumber);
        request().then((data) => {
          this._statusMap[key].status = STATUS.COMPLETED;
          const {
            frameNumber: actualFrameNumber,
            viewport: {
              id: id2
            }
          } = this._statusMap[key].frameState;
          this.pendingTilesRegister.deregister(id2, actualFrameNumber);
          this._statusMap[key].callback(data, frameState);
        }).catch((error) => {
          this._statusMap[key].status = STATUS.ERROR;
          const {
            frameNumber: actualFrameNumber,
            viewport: {
              id: id2
            }
          } = this._statusMap[key].frameState;
          this.pendingTilesRegister.deregister(id2, actualFrameNumber);
          callback(error);
        });
      }
    }
    update(key, frameState) {
      if (this._statusMap[key]) {
        const {
          frameNumber,
          viewport: {
            id
          }
        } = this._statusMap[key].frameState;
        this.pendingTilesRegister.deregister(id, frameNumber);
        const {
          frameNumber: newFrameNumber,
          viewport: {
            id: newViewportId
          }
        } = frameState;
        this.pendingTilesRegister.register(newViewportId, newFrameNumber);
        this._statusMap[key].frameState = frameState;
      }
    }
    find(key) {
      return this._statusMap[key];
    }
    hasPendingTiles(viewportId, frameNumber) {
      return !this.pendingTilesRegister.isZero(viewportId, frameNumber);
    }
  }
  class I3STilesetTraverser extends TilesetTraverser {
    constructor(options) {
      super(options);
      this._tileManager = void 0;
      this._tileManager = new I3STileManager();
    }
    traversalFinished(frameState) {
      return !this._tileManager.hasPendingTiles(frameState.viewport.id, this._frameNumber || 0);
    }
    shouldRefine(tile, frameState) {
      tile._lodJudge = getLodStatus(tile, frameState);
      return tile._lodJudge === "DIG";
    }
    updateChildTiles(tile, frameState) {
      const children = tile.header.children || [];
      const childTiles = tile.children;
      const tileset = tile.tileset;
      for (const child of children) {
        const extendedId = `${child.id}-${frameState.viewport.id}`;
        const childTile = childTiles && childTiles.find((t) => t.id === extendedId);
        if (!childTile) {
          let request = () => this._loadTile(child.id, tileset);
          const cachedRequest = this._tileManager.find(extendedId);
          if (!cachedRequest) {
            if (tileset.tileset.nodePages) {
              request = () => tileset.tileset.nodePagesTile.formTileFromNodePages(child.id);
            }
            this._tileManager.add(request, extendedId, (header) => this._onTileLoad(header, tile, extendedId), frameState);
          } else {
            this._tileManager.update(extendedId, frameState);
          }
        } else if (childTile) {
          this.updateTile(childTile, frameState);
        }
      }
      return false;
    }
    async _loadTile(nodeId, tileset) {
      const {
        loader
      } = tileset;
      const nodeUrl = tileset.getTileUrl(`${tileset.url}/nodes/${nodeId}`);
      const options = {
        ...tileset.loadOptions,
        i3s: {
          ...tileset.loadOptions.i3s,
          isTileHeader: true
        }
      };
      return await load(nodeUrl, loader, options);
    }
    _onTileLoad(header, tile, extendedId) {
      const childTile = new Tile3D(tile.tileset, header, tile, extendedId);
      tile.children.push(childTile);
      const frameState = this._tileManager.find(childTile.id).frameState;
      this.updateTile(childTile, frameState);
      if (this._frameNumber === frameState.frameNumber && (this.traversalFinished(frameState) || (/* @__PURE__ */ new Date()).getTime() - this.lastUpdate > this.updateDebounceTime)) {
        this.executeTraversal(childTile, frameState);
      }
    }
  }
  const DEFAULT_PROPS = {
    description: "",
    ellipsoid: Ellipsoid.WGS84,
    modelMatrix: new Matrix4(),
    throttleRequests: true,
    maxRequests: 64,
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
    onTraversalComplete: (selectedTiles) => selectedTiles,
    contentLoader: void 0,
    viewDistanceScale: 1,
    maximumScreenSpaceError: 8,
    memoryAdjustedScreenSpaceError: false,
    loadTiles: true,
    updateTransforms: true,
    viewportTraversersMap: null,
    loadOptions: {
      fetch: {}
    },
    attributions: [],
    basePath: "",
    i3s: {}
  };
  const TILES_TOTAL = "Tiles In Tileset(s)";
  const TILES_IN_MEMORY = "Tiles In Memory";
  const TILES_IN_VIEW = "Tiles In View";
  const TILES_RENDERABLE = "Tiles To Render";
  const TILES_LOADED = "Tiles Loaded";
  const TILES_LOADING = "Tiles Loading";
  const TILES_UNLOADED = "Tiles Unloaded";
  const TILES_LOAD_FAILED = "Failed Tile Loads";
  const POINTS_COUNT = "Points/Vertices";
  const TILES_GPU_MEMORY = "Tile Memory Use";
  const MAXIMUM_SSE = "Maximum Screen Space Error";
  class Tileset3D {
    constructor(tileset, options) {
      this.options = void 0;
      this.loadOptions = void 0;
      this.type = void 0;
      this.tileset = void 0;
      this.loader = void 0;
      this.url = void 0;
      this.basePath = void 0;
      this.modelMatrix = void 0;
      this.ellipsoid = void 0;
      this.lodMetricType = void 0;
      this.lodMetricValue = void 0;
      this.refine = void 0;
      this.root = null;
      this.roots = {};
      this.asset = {};
      this.description = "";
      this.properties = void 0;
      this.extras = null;
      this.attributions = {};
      this.credits = {};
      this.stats = void 0;
      this.contentFormats = {
        draco: false,
        meshopt: false,
        dds: false,
        ktx2: false
      };
      this.cartographicCenter = null;
      this.cartesianCenter = null;
      this.zoom = 1;
      this.boundingVolume = null;
      this.dynamicScreenSpaceErrorComputedDensity = 0;
      this.maximumMemoryUsage = 32;
      this.gpuMemoryUsageInBytes = 0;
      this.memoryAdjustedScreenSpaceError = 0;
      this._cacheBytes = 0;
      this._cacheOverflowBytes = 0;
      this._frameNumber = 0;
      this._queryParams = {};
      this._extensionsUsed = [];
      this._tiles = {};
      this._pendingCount = 0;
      this.selectedTiles = [];
      this.traverseCounter = 0;
      this.geometricError = 0;
      this.lastUpdatedVieports = null;
      this._requestedTiles = [];
      this._emptyTiles = [];
      this.frameStateData = {};
      this._traverser = void 0;
      this._cache = new TilesetCache();
      this._requestScheduler = void 0;
      this.updatePromise = null;
      this.tilesetInitializationPromise = void 0;
      this.options = {
        ...DEFAULT_PROPS,
        ...options
      };
      this.tileset = tileset;
      this.loader = tileset.loader;
      this.type = tileset.type;
      this.url = tileset.url;
      this.basePath = tileset.basePath || dirname(this.url);
      this.modelMatrix = this.options.modelMatrix;
      this.ellipsoid = this.options.ellipsoid;
      this.lodMetricType = tileset.lodMetricType;
      this.lodMetricValue = tileset.lodMetricValue;
      this.refine = tileset.root.refine;
      this.loadOptions = this.options.loadOptions || {};
      this._traverser = this._initializeTraverser();
      this._requestScheduler = new RequestScheduler({
        throttleRequests: this.options.throttleRequests,
        maxRequests: this.options.maxRequests
      });
      this.memoryAdjustedScreenSpaceError = this.options.maximumScreenSpaceError;
      this._cacheBytes = this.options.maximumMemoryUsage * 1024 * 1024;
      this._cacheOverflowBytes = this.options.memoryCacheOverflow * 1024 * 1024;
      this.stats = new Stats({
        id: this.url
      });
      this._initializeStats();
      this.tilesetInitializationPromise = this._initializeTileSet(tileset);
    }
    destroy() {
      this._destroy();
    }
    isLoaded() {
      return this._pendingCount === 0 && this._frameNumber !== 0 && this._requestedTiles.length === 0;
    }
    get tiles() {
      return Object.values(this._tiles);
    }
    get frameNumber() {
      return this._frameNumber;
    }
    get queryParams() {
      return new URLSearchParams(this._queryParams).toString();
    }
    setProps(props) {
      this.options = {
        ...this.options,
        ...props
      };
    }
    getTileUrl(tilePath) {
      const isDataUrl = tilePath.startsWith("data:");
      if (isDataUrl) {
        return tilePath;
      }
      let tileUrl = tilePath;
      if (this.queryParams.length) {
        tileUrl = `${tilePath}${tilePath.includes("?") ? "&" : "?"}${this.queryParams}`;
      }
      return tileUrl;
    }
    hasExtension(extensionName) {
      return Boolean(this._extensionsUsed.indexOf(extensionName) > -1);
    }
    update() {
      let viewports = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
      this.tilesetInitializationPromise.then(() => {
        if (!viewports && this.lastUpdatedVieports) {
          viewports = this.lastUpdatedVieports;
        } else {
          this.lastUpdatedVieports = viewports;
        }
        if (viewports) {
          this.doUpdate(viewports);
        }
      });
    }
    async selectTiles() {
      let viewports = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
      await this.tilesetInitializationPromise;
      if (viewports) {
        this.lastUpdatedVieports = viewports;
      }
      if (!this.updatePromise) {
        this.updatePromise = new Promise((resolve2) => {
          setTimeout(() => {
            if (this.lastUpdatedVieports) {
              this.doUpdate(this.lastUpdatedVieports);
            }
            resolve2(this._frameNumber);
            this.updatePromise = null;
          }, this.options.debounceTime);
        });
      }
      return this.updatePromise;
    }
    adjustScreenSpaceError() {
      if (this.gpuMemoryUsageInBytes < this._cacheBytes) {
        this.memoryAdjustedScreenSpaceError = Math.max(this.memoryAdjustedScreenSpaceError / 1.02, this.options.maximumScreenSpaceError);
      } else if (this.gpuMemoryUsageInBytes > this._cacheBytes + this._cacheOverflowBytes) {
        this.memoryAdjustedScreenSpaceError *= 1.02;
      }
    }
    doUpdate(viewports) {
      if ("loadTiles" in this.options && !this.options.loadTiles) {
        return;
      }
      if (this.traverseCounter > 0) {
        return;
      }
      const preparedViewports = viewports instanceof Array ? viewports : [viewports];
      this._cache.reset();
      this._frameNumber++;
      this.traverseCounter = preparedViewports.length;
      const viewportsToTraverse = [];
      for (const viewport of preparedViewports) {
        const id = viewport.id;
        if (this._needTraverse(id)) {
          viewportsToTraverse.push(id);
        } else {
          this.traverseCounter--;
        }
      }
      for (const viewport of preparedViewports) {
        const id = viewport.id;
        if (!this.roots[id]) {
          this.roots[id] = this._initializeTileHeaders(this.tileset, null);
        }
        if (!viewportsToTraverse.includes(id)) {
          continue;
        }
        const frameState = getFrameState(viewport, this._frameNumber);
        this._traverser.traverse(this.roots[id], frameState, this.options);
      }
    }
    _needTraverse(viewportId) {
      let traverserId = viewportId;
      if (this.options.viewportTraversersMap) {
        traverserId = this.options.viewportTraversersMap[viewportId];
      }
      if (traverserId !== viewportId) {
        return false;
      }
      return true;
    }
    _onTraversalEnd(frameState) {
      const id = frameState.viewport.id;
      if (!this.frameStateData[id]) {
        this.frameStateData[id] = {
          selectedTiles: [],
          _requestedTiles: [],
          _emptyTiles: []
        };
      }
      const currentFrameStateData = this.frameStateData[id];
      const selectedTiles = Object.values(this._traverser.selectedTiles);
      const [filteredSelectedTiles, unselectedTiles] = limitSelectedTiles(selectedTiles, frameState, this.options.maximumTilesSelected);
      currentFrameStateData.selectedTiles = filteredSelectedTiles;
      for (const tile of unselectedTiles) {
        tile.unselect();
      }
      currentFrameStateData._requestedTiles = Object.values(this._traverser.requestedTiles);
      currentFrameStateData._emptyTiles = Object.values(this._traverser.emptyTiles);
      this.traverseCounter--;
      if (this.traverseCounter > 0) {
        return;
      }
      this._updateTiles();
    }
    _updateTiles() {
      this.selectedTiles = [];
      this._requestedTiles = [];
      this._emptyTiles = [];
      for (const frameStateKey in this.frameStateData) {
        const frameStateDataValue = this.frameStateData[frameStateKey];
        this.selectedTiles = this.selectedTiles.concat(frameStateDataValue.selectedTiles);
        this._requestedTiles = this._requestedTiles.concat(frameStateDataValue._requestedTiles);
        this._emptyTiles = this._emptyTiles.concat(frameStateDataValue._emptyTiles);
      }
      this.selectedTiles = this.options.onTraversalComplete(this.selectedTiles);
      for (const tile of this.selectedTiles) {
        this._tiles[tile.id] = tile;
      }
      this._loadTiles();
      this._unloadTiles();
      this._updateStats();
    }
    _tilesChanged(oldSelectedTiles, selectedTiles) {
      if (oldSelectedTiles.length !== selectedTiles.length) {
        return true;
      }
      const set1 = new Set(oldSelectedTiles.map((t) => t.id));
      const set2 = new Set(selectedTiles.map((t) => t.id));
      let changed = oldSelectedTiles.filter((x) => !set2.has(x.id)).length > 0;
      changed = changed || selectedTiles.filter((x) => !set1.has(x.id)).length > 0;
      return changed;
    }
    _loadTiles() {
      for (const tile of this._requestedTiles) {
        if (tile.contentUnloaded) {
          this._loadTile(tile);
        }
      }
    }
    _unloadTiles() {
      this._cache.unloadTiles(this, (tileset, tile) => tileset._unloadTile(tile));
    }
    _updateStats() {
      let tilesRenderable = 0;
      let pointsRenderable = 0;
      for (const tile of this.selectedTiles) {
        if (tile.contentAvailable && tile.content) {
          tilesRenderable++;
          if (tile.content.pointCount) {
            pointsRenderable += tile.content.pointCount;
          } else {
            pointsRenderable += tile.content.vertexCount;
          }
        }
      }
      this.stats.get(TILES_IN_VIEW).count = this.selectedTiles.length;
      this.stats.get(TILES_RENDERABLE).count = tilesRenderable;
      this.stats.get(POINTS_COUNT).count = pointsRenderable;
      this.stats.get(MAXIMUM_SSE).count = this.memoryAdjustedScreenSpaceError;
    }
    async _initializeTileSet(tilesetJson) {
      if (this.type === TILESET_TYPE.I3S) {
        this.calculateViewPropsI3S();
        tilesetJson.root = await tilesetJson.root;
      }
      this.root = this._initializeTileHeaders(tilesetJson, null);
      if (this.type === TILESET_TYPE.TILES3D) {
        this._initializeTiles3DTileset(tilesetJson);
        this.calculateViewPropsTiles3D();
      }
      if (this.type === TILESET_TYPE.I3S) {
        this._initializeI3STileset();
      }
    }
    calculateViewPropsI3S() {
      var _this$tileset$store;
      const fullExtent = this.tileset.fullExtent;
      if (fullExtent) {
        const {
          xmin,
          xmax,
          ymin,
          ymax,
          zmin,
          zmax
        } = fullExtent;
        this.cartographicCenter = new Vector3(xmin + (xmax - xmin) / 2, ymin + (ymax - ymin) / 2, zmin + (zmax - zmin) / 2);
        this.cartesianCenter = new Vector3();
        Ellipsoid.WGS84.cartographicToCartesian(this.cartographicCenter, this.cartesianCenter);
        this.zoom = getZoomFromFullExtent(fullExtent, this.cartographicCenter, this.cartesianCenter);
        return;
      }
      const extent = (_this$tileset$store = this.tileset.store) === null || _this$tileset$store === void 0 ? void 0 : _this$tileset$store.extent;
      if (extent) {
        const [xmin, ymin, xmax, ymax] = extent;
        this.cartographicCenter = new Vector3(xmin + (xmax - xmin) / 2, ymin + (ymax - ymin) / 2, 0);
        this.cartesianCenter = new Vector3();
        Ellipsoid.WGS84.cartographicToCartesian(this.cartographicCenter, this.cartesianCenter);
        this.zoom = getZoomFromExtent(extent, this.cartographicCenter, this.cartesianCenter);
        return;
      }
      console.warn("Extent is not defined in the tileset header");
      this.cartographicCenter = new Vector3();
      this.zoom = 1;
      return;
    }
    calculateViewPropsTiles3D() {
      const root = this.root;
      const {
        center
      } = root.boundingVolume;
      if (!center) {
        console.warn("center was not pre-calculated for the root tile");
        this.cartographicCenter = new Vector3();
        this.zoom = 1;
        return;
      }
      if (center[0] !== 0 || center[1] !== 0 || center[2] !== 0) {
        this.cartographicCenter = new Vector3();
        Ellipsoid.WGS84.cartesianToCartographic(center, this.cartographicCenter);
      } else {
        this.cartographicCenter = new Vector3(0, 0, -Ellipsoid.WGS84.radii[0]);
      }
      this.cartesianCenter = center;
      this.zoom = getZoomFromBoundingVolume(root.boundingVolume, this.cartographicCenter);
    }
    _initializeStats() {
      this.stats.get(TILES_TOTAL);
      this.stats.get(TILES_LOADING);
      this.stats.get(TILES_IN_MEMORY);
      this.stats.get(TILES_IN_VIEW);
      this.stats.get(TILES_RENDERABLE);
      this.stats.get(TILES_LOADED);
      this.stats.get(TILES_UNLOADED);
      this.stats.get(TILES_LOAD_FAILED);
      this.stats.get(POINTS_COUNT);
      this.stats.get(TILES_GPU_MEMORY, "memory");
      this.stats.get(MAXIMUM_SSE);
    }
    _initializeTileHeaders(tilesetJson, parentTileHeader) {
      const rootTile = new Tile3D(this, tilesetJson.root, parentTileHeader);
      if (parentTileHeader) {
        parentTileHeader.children.push(rootTile);
        rootTile.depth = parentTileHeader.depth + 1;
      }
      if (this.type === TILESET_TYPE.TILES3D) {
        const stack2 = [];
        stack2.push(rootTile);
        while (stack2.length > 0) {
          const tile = stack2.pop();
          this.stats.get(TILES_TOTAL).incrementCount();
          const children = tile.header.children || [];
          for (const childHeader of children) {
            var _childTile$contentUrl;
            const childTile = new Tile3D(this, childHeader, tile);
            if ((_childTile$contentUrl = childTile.contentUrl) !== null && _childTile$contentUrl !== void 0 && _childTile$contentUrl.includes("?session=")) {
              const url = new URL(childTile.contentUrl);
              const session = url.searchParams.get("session");
              if (session) {
                this._queryParams.session = session;
              }
            }
            tile.children.push(childTile);
            childTile.depth = tile.depth + 1;
            stack2.push(childTile);
          }
        }
      }
      return rootTile;
    }
    _initializeTraverser() {
      let TraverserClass;
      const type = this.type;
      switch (type) {
        case TILESET_TYPE.TILES3D:
          TraverserClass = Tileset3DTraverser;
          break;
        case TILESET_TYPE.I3S:
          TraverserClass = I3STilesetTraverser;
          break;
        default:
          TraverserClass = TilesetTraverser;
      }
      return new TraverserClass({
        basePath: this.basePath,
        onTraversalEnd: this._onTraversalEnd.bind(this)
      });
    }
    _destroyTileHeaders(parentTile) {
      this._destroySubtree(parentTile);
    }
    async _loadTile(tile) {
      let loaded;
      try {
        this._onStartTileLoading();
        loaded = await tile.loadContent();
      } catch (error) {
        this._onTileLoadError(tile, error instanceof Error ? error : new Error("load failed"));
      } finally {
        this._onEndTileLoading();
        this._onTileLoad(tile, loaded);
      }
    }
    _onTileLoadError(tile, error) {
      this.stats.get(TILES_LOAD_FAILED).incrementCount();
      const message = error.message || error.toString();
      const url = tile.url;
      console.error(`A 3D tile failed to load: ${tile.url} ${message}`);
      this.options.onTileError(tile, message, url);
    }
    _onTileLoad(tile, loaded) {
      if (!loaded) {
        return;
      }
      if (this.type === TILESET_TYPE.I3S) {
        var _this$tileset, _this$tileset$nodePag;
        const nodesInNodePages = ((_this$tileset = this.tileset) === null || _this$tileset === void 0 ? void 0 : (_this$tileset$nodePag = _this$tileset.nodePagesTile) === null || _this$tileset$nodePag === void 0 ? void 0 : _this$tileset$nodePag.nodesInNodePages) || 0;
        this.stats.get(TILES_TOTAL).reset();
        this.stats.get(TILES_TOTAL).addCount(nodesInNodePages);
      }
      if (tile && tile.content) {
        calculateTransformProps(tile, tile.content);
      }
      this.updateContentTypes(tile);
      this._addTileToCache(tile);
      this.options.onTileLoad(tile);
    }
    updateContentTypes(tile) {
      if (this.type === TILESET_TYPE.I3S) {
        if (tile.header.isDracoGeometry) {
          this.contentFormats.draco = true;
        }
        switch (tile.header.textureFormat) {
          case "dds":
            this.contentFormats.dds = true;
            break;
          case "ktx2":
            this.contentFormats.ktx2 = true;
            break;
        }
      } else if (this.type === TILESET_TYPE.TILES3D) {
        var _tile$content;
        const {
          extensionsRemoved = []
        } = ((_tile$content = tile.content) === null || _tile$content === void 0 ? void 0 : _tile$content.gltf) || {};
        if (extensionsRemoved.includes("KHR_draco_mesh_compression")) {
          this.contentFormats.draco = true;
        }
        if (extensionsRemoved.includes("EXT_meshopt_compression")) {
          this.contentFormats.meshopt = true;
        }
        if (extensionsRemoved.includes("KHR_texture_basisu")) {
          this.contentFormats.ktx2 = true;
        }
      }
    }
    _onStartTileLoading() {
      this._pendingCount++;
      this.stats.get(TILES_LOADING).incrementCount();
    }
    _onEndTileLoading() {
      this._pendingCount--;
      this.stats.get(TILES_LOADING).decrementCount();
    }
    _addTileToCache(tile) {
      this._cache.add(this, tile, (tileset) => tileset._updateCacheStats(tile));
    }
    _updateCacheStats(tile) {
      this.stats.get(TILES_LOADED).incrementCount();
      this.stats.get(TILES_IN_MEMORY).incrementCount();
      this.gpuMemoryUsageInBytes += tile.gpuMemoryUsageInBytes || 0;
      this.stats.get(TILES_GPU_MEMORY).count = this.gpuMemoryUsageInBytes;
      if (this.options.memoryAdjustedScreenSpaceError) {
        this.adjustScreenSpaceError();
      }
    }
    _unloadTile(tile) {
      this.gpuMemoryUsageInBytes -= tile.gpuMemoryUsageInBytes || 0;
      this.stats.get(TILES_IN_MEMORY).decrementCount();
      this.stats.get(TILES_UNLOADED).incrementCount();
      this.stats.get(TILES_GPU_MEMORY).count = this.gpuMemoryUsageInBytes;
      this.options.onTileUnload(tile);
      tile.unloadContent();
    }
    _destroy() {
      const stack2 = [];
      if (this.root) {
        stack2.push(this.root);
      }
      while (stack2.length > 0) {
        const tile = stack2.pop();
        for (const child of tile.children) {
          stack2.push(child);
        }
        this._destroyTile(tile);
      }
      this.root = null;
    }
    _destroySubtree(tile) {
      const root = tile;
      const stack2 = [];
      stack2.push(root);
      while (stack2.length > 0) {
        tile = stack2.pop();
        for (const child of tile.children) {
          stack2.push(child);
        }
        if (tile !== root) {
          this._destroyTile(tile);
        }
      }
      root.children = [];
    }
    _destroyTile(tile) {
      this._cache.unloadTile(this, tile);
      this._unloadTile(tile);
      tile.destroy();
    }
    _initializeTiles3DTileset(tilesetJson) {
      if (tilesetJson.queryString) {
        const searchParams = new URLSearchParams(tilesetJson.queryString);
        const queryParams = Object.fromEntries(searchParams.entries());
        this._queryParams = {
          ...this._queryParams,
          ...queryParams
        };
      }
      this.asset = tilesetJson.asset;
      if (!this.asset) {
        throw new Error("Tileset must have an asset property.");
      }
      if (this.asset.version !== "0.0" && this.asset.version !== "1.0" && this.asset.version !== "1.1") {
        throw new Error("The tileset must be 3D Tiles version either 0.0 or 1.0 or 1.1.");
      }
      if ("tilesetVersion" in this.asset) {
        this._queryParams.v = this.asset.tilesetVersion;
      }
      this.credits = {
        attributions: this.options.attributions || []
      };
      this.description = this.options.description || "";
      this.properties = tilesetJson.properties;
      this.geometricError = tilesetJson.geometricError;
      this._extensionsUsed = tilesetJson.extensionsUsed || [];
      this.extras = tilesetJson.extras;
    }
    _initializeI3STileset() {
      if (this.loadOptions.i3s && "token" in this.loadOptions.i3s) {
        this._queryParams.token = this.loadOptions.i3s.token;
      }
    }
  }
  const VERSION$5 = "4.1.1";
  const TILE3D_TYPE = {
    COMPOSITE: "cmpt",
    POINT_CLOUD: "pnts",
    BATCHED_3D_MODEL: "b3dm",
    INSTANCED_3D_MODEL: "i3dm",
    GEOMETRY: "geom",
    VECTOR: "vect",
    GLTF: "glTF"
  };
  function getStringFromArrayBuffer(arrayBuffer, byteOffset, byteLength) {
    assert$6(arrayBuffer instanceof ArrayBuffer);
    const textDecoder = new TextDecoder("utf8");
    const typedArray = new Uint8Array(arrayBuffer, byteOffset, byteLength);
    const string = textDecoder.decode(typedArray);
    return string;
  }
  function getMagicString$1(arrayBuffer) {
    let byteOffset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    const dataView = new DataView(arrayBuffer);
    return `${String.fromCharCode(dataView.getUint8(byteOffset + 0))}${String.fromCharCode(dataView.getUint8(byteOffset + 1))}${String.fromCharCode(dataView.getUint8(byteOffset + 2))}${String.fromCharCode(dataView.getUint8(byteOffset + 3))}`;
  }
  const VERSION$4 = "4.1.1";
  const DracoLoader$1 = {
    name: "Draco",
    id: "draco",
    module: "draco",
    version: VERSION$4,
    worker: true,
    extensions: ["drc"],
    mimeTypes: ["application/octet-stream"],
    binary: true,
    tests: ["DRACO"],
    options: {
      draco: {
        decoderType: typeof WebAssembly === "object" ? "wasm" : "js",
        libraryPath: "libs/",
        extraAttributes: {},
        attributeNameEntry: void 0
      }
    }
  };
  function getDracoSchema(attributes, loaderData, indices) {
    const metadata = makeMetadata(loaderData.metadata);
    const fields = [];
    const namedLoaderDataAttributes = transformAttributesLoaderData(loaderData.attributes);
    for (const attributeName in attributes) {
      const attribute = attributes[attributeName];
      const field = getArrowFieldFromAttribute(attributeName, attribute, namedLoaderDataAttributes[attributeName]);
      fields.push(field);
    }
    if (indices) {
      const indicesField = getArrowFieldFromAttribute("indices", indices);
      fields.push(indicesField);
    }
    return {
      fields,
      metadata
    };
  }
  function transformAttributesLoaderData(loaderData) {
    const result = {};
    for (const key in loaderData) {
      const dracoAttribute = loaderData[key];
      result[dracoAttribute.name || "undefined"] = dracoAttribute;
    }
    return result;
  }
  function getArrowFieldFromAttribute(attributeName, attribute, loaderData) {
    const metadataMap = loaderData ? makeMetadata(loaderData.metadata) : void 0;
    const field = deduceMeshField(attributeName, attribute, metadataMap);
    return field;
  }
  function makeMetadata(metadata) {
    Object.entries(metadata);
    const serializedMetadata = {};
    for (const key in metadata) {
      serializedMetadata[`${key}.string`] = JSON.stringify(metadata[key]);
    }
    return serializedMetadata;
  }
  const DRACO_TO_GLTF_ATTRIBUTE_NAME_MAP = {
    POSITION: "POSITION",
    NORMAL: "NORMAL",
    COLOR: "COLOR_0",
    TEX_COORD: "TEXCOORD_0"
  };
  const DRACO_DATA_TYPE_TO_TYPED_ARRAY_MAP = {
    1: Int8Array,
    2: Uint8Array,
    3: Int16Array,
    4: Uint16Array,
    5: Int32Array,
    6: Uint32Array,
    9: Float32Array
  };
  const INDEX_ITEM_SIZE = 4;
  class DracoParser {
    constructor(draco) {
      this.draco = void 0;
      this.decoder = void 0;
      this.metadataQuerier = void 0;
      this.draco = draco;
      this.decoder = new this.draco.Decoder();
      this.metadataQuerier = new this.draco.MetadataQuerier();
    }
    destroy() {
      this.draco.destroy(this.decoder);
      this.draco.destroy(this.metadataQuerier);
    }
    parseSync(arrayBuffer) {
      let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      const buffer = new this.draco.DecoderBuffer();
      buffer.Init(new Int8Array(arrayBuffer), arrayBuffer.byteLength);
      this._disableAttributeTransforms(options);
      const geometry_type = this.decoder.GetEncodedGeometryType(buffer);
      const dracoGeometry = geometry_type === this.draco.TRIANGULAR_MESH ? new this.draco.Mesh() : new this.draco.PointCloud();
      try {
        let dracoStatus;
        switch (geometry_type) {
          case this.draco.TRIANGULAR_MESH:
            dracoStatus = this.decoder.DecodeBufferToMesh(buffer, dracoGeometry);
            break;
          case this.draco.POINT_CLOUD:
            dracoStatus = this.decoder.DecodeBufferToPointCloud(buffer, dracoGeometry);
            break;
          default:
            throw new Error("DRACO: Unknown geometry type.");
        }
        if (!dracoStatus.ok() || !dracoGeometry.ptr) {
          const message = `DRACO decompression failed: ${dracoStatus.error_msg()}`;
          throw new Error(message);
        }
        const loaderData = this._getDracoLoaderData(dracoGeometry, geometry_type, options);
        const geometry = this._getMeshData(dracoGeometry, loaderData, options);
        const boundingBox = getMeshBoundingBox(geometry.attributes);
        const schema = getDracoSchema(geometry.attributes, loaderData, geometry.indices);
        const data = {
          loader: "draco",
          loaderData,
          header: {
            vertexCount: dracoGeometry.num_points(),
            boundingBox
          },
          ...geometry,
          schema
        };
        return data;
      } finally {
        this.draco.destroy(buffer);
        if (dracoGeometry) {
          this.draco.destroy(dracoGeometry);
        }
      }
    }
    _getDracoLoaderData(dracoGeometry, geometry_type, options) {
      const metadata = this._getTopLevelMetadata(dracoGeometry);
      const attributes = this._getDracoAttributes(dracoGeometry, options);
      return {
        geometry_type,
        num_attributes: dracoGeometry.num_attributes(),
        num_points: dracoGeometry.num_points(),
        num_faces: dracoGeometry instanceof this.draco.Mesh ? dracoGeometry.num_faces() : 0,
        metadata,
        attributes
      };
    }
    _getDracoAttributes(dracoGeometry, options) {
      const dracoAttributes = {};
      for (let attributeId = 0; attributeId < dracoGeometry.num_attributes(); attributeId++) {
        const dracoAttribute = this.decoder.GetAttribute(dracoGeometry, attributeId);
        const metadata = this._getAttributeMetadata(dracoGeometry, attributeId);
        dracoAttributes[dracoAttribute.unique_id()] = {
          unique_id: dracoAttribute.unique_id(),
          attribute_type: dracoAttribute.attribute_type(),
          data_type: dracoAttribute.data_type(),
          num_components: dracoAttribute.num_components(),
          byte_offset: dracoAttribute.byte_offset(),
          byte_stride: dracoAttribute.byte_stride(),
          normalized: dracoAttribute.normalized(),
          attribute_index: attributeId,
          metadata
        };
        const quantization = this._getQuantizationTransform(dracoAttribute, options);
        if (quantization) {
          dracoAttributes[dracoAttribute.unique_id()].quantization_transform = quantization;
        }
        const octahedron = this._getOctahedronTransform(dracoAttribute, options);
        if (octahedron) {
          dracoAttributes[dracoAttribute.unique_id()].octahedron_transform = octahedron;
        }
      }
      return dracoAttributes;
    }
    _getMeshData(dracoGeometry, loaderData, options) {
      const attributes = this._getMeshAttributes(loaderData, dracoGeometry, options);
      const positionAttribute = attributes.POSITION;
      if (!positionAttribute) {
        throw new Error("DRACO: No position attribute found.");
      }
      if (dracoGeometry instanceof this.draco.Mesh) {
        switch (options.topology) {
          case "triangle-strip":
            return {
              topology: "triangle-strip",
              mode: 4,
              attributes,
              indices: {
                value: this._getTriangleStripIndices(dracoGeometry),
                size: 1
              }
            };
          case "triangle-list":
          default:
            return {
              topology: "triangle-list",
              mode: 5,
              attributes,
              indices: {
                value: this._getTriangleListIndices(dracoGeometry),
                size: 1
              }
            };
        }
      }
      return {
        topology: "point-list",
        mode: 0,
        attributes
      };
    }
    _getMeshAttributes(loaderData, dracoGeometry, options) {
      const attributes = {};
      for (const loaderAttribute of Object.values(loaderData.attributes)) {
        const attributeName = this._deduceAttributeName(loaderAttribute, options);
        loaderAttribute.name = attributeName;
        const {
          value,
          size
        } = this._getAttributeValues(dracoGeometry, loaderAttribute);
        attributes[attributeName] = {
          value,
          size,
          byteOffset: loaderAttribute.byte_offset,
          byteStride: loaderAttribute.byte_stride,
          normalized: loaderAttribute.normalized
        };
      }
      return attributes;
    }
    _getTriangleListIndices(dracoGeometry) {
      const numFaces = dracoGeometry.num_faces();
      const numIndices = numFaces * 3;
      const byteLength = numIndices * INDEX_ITEM_SIZE;
      const ptr = this.draco._malloc(byteLength);
      try {
        this.decoder.GetTrianglesUInt32Array(dracoGeometry, byteLength, ptr);
        return new Uint32Array(this.draco.HEAPF32.buffer, ptr, numIndices).slice();
      } finally {
        this.draco._free(ptr);
      }
    }
    _getTriangleStripIndices(dracoGeometry) {
      const dracoArray = new this.draco.DracoInt32Array();
      try {
        this.decoder.GetTriangleStripsFromMesh(dracoGeometry, dracoArray);
        return getUint32Array(dracoArray);
      } finally {
        this.draco.destroy(dracoArray);
      }
    }
    _getAttributeValues(dracoGeometry, attribute) {
      const TypedArrayCtor = DRACO_DATA_TYPE_TO_TYPED_ARRAY_MAP[attribute.data_type];
      const numComponents = attribute.num_components;
      const numPoints = dracoGeometry.num_points();
      const numValues = numPoints * numComponents;
      const byteLength = numValues * TypedArrayCtor.BYTES_PER_ELEMENT;
      const dataType = getDracoDataType(this.draco, TypedArrayCtor);
      let value;
      const ptr = this.draco._malloc(byteLength);
      try {
        const dracoAttribute = this.decoder.GetAttribute(dracoGeometry, attribute.attribute_index);
        this.decoder.GetAttributeDataArrayForAllPoints(dracoGeometry, dracoAttribute, dataType, byteLength, ptr);
        value = new TypedArrayCtor(this.draco.HEAPF32.buffer, ptr, numValues).slice();
      } finally {
        this.draco._free(ptr);
      }
      return {
        value,
        size: numComponents
      };
    }
    _deduceAttributeName(attribute, options) {
      const uniqueId = attribute.unique_id;
      for (const [attributeName, attributeUniqueId] of Object.entries(options.extraAttributes || {})) {
        if (attributeUniqueId === uniqueId) {
          return attributeName;
        }
      }
      const thisAttributeType = attribute.attribute_type;
      for (const dracoAttributeConstant in DRACO_TO_GLTF_ATTRIBUTE_NAME_MAP) {
        const attributeType = this.draco[dracoAttributeConstant];
        if (attributeType === thisAttributeType) {
          return DRACO_TO_GLTF_ATTRIBUTE_NAME_MAP[dracoAttributeConstant];
        }
      }
      const entryName = options.attributeNameEntry || "name";
      if (attribute.metadata[entryName]) {
        return attribute.metadata[entryName].string;
      }
      return `CUSTOM_ATTRIBUTE_${uniqueId}`;
    }
    _getTopLevelMetadata(dracoGeometry) {
      const dracoMetadata = this.decoder.GetMetadata(dracoGeometry);
      return this._getDracoMetadata(dracoMetadata);
    }
    _getAttributeMetadata(dracoGeometry, attributeId) {
      const dracoMetadata = this.decoder.GetAttributeMetadata(dracoGeometry, attributeId);
      return this._getDracoMetadata(dracoMetadata);
    }
    _getDracoMetadata(dracoMetadata) {
      if (!dracoMetadata || !dracoMetadata.ptr) {
        return {};
      }
      const result = {};
      const numEntries = this.metadataQuerier.NumEntries(dracoMetadata);
      for (let entryIndex = 0; entryIndex < numEntries; entryIndex++) {
        const entryName = this.metadataQuerier.GetEntryName(dracoMetadata, entryIndex);
        result[entryName] = this._getDracoMetadataField(dracoMetadata, entryName);
      }
      return result;
    }
    _getDracoMetadataField(dracoMetadata, entryName) {
      const dracoArray = new this.draco.DracoInt32Array();
      try {
        this.metadataQuerier.GetIntEntryArray(dracoMetadata, entryName, dracoArray);
        const intArray = getInt32Array(dracoArray);
        return {
          int: this.metadataQuerier.GetIntEntry(dracoMetadata, entryName),
          string: this.metadataQuerier.GetStringEntry(dracoMetadata, entryName),
          double: this.metadataQuerier.GetDoubleEntry(dracoMetadata, entryName),
          intArray
        };
      } finally {
        this.draco.destroy(dracoArray);
      }
    }
    _disableAttributeTransforms(options) {
      const {
        quantizedAttributes = [],
        octahedronAttributes = []
      } = options;
      const skipAttributes = [...quantizedAttributes, ...octahedronAttributes];
      for (const dracoAttributeName of skipAttributes) {
        this.decoder.SkipAttributeTransform(this.draco[dracoAttributeName]);
      }
    }
    _getQuantizationTransform(dracoAttribute, options) {
      const {
        quantizedAttributes = []
      } = options;
      const attribute_type = dracoAttribute.attribute_type();
      const skip = quantizedAttributes.map((type) => this.decoder[type]).includes(attribute_type);
      if (skip) {
        const transform = new this.draco.AttributeQuantizationTransform();
        try {
          if (transform.InitFromAttribute(dracoAttribute)) {
            return {
              quantization_bits: transform.quantization_bits(),
              range: transform.range(),
              min_values: new Float32Array([1, 2, 3]).map((i2) => transform.min_value(i2))
            };
          }
        } finally {
          this.draco.destroy(transform);
        }
      }
      return null;
    }
    _getOctahedronTransform(dracoAttribute, options) {
      const {
        octahedronAttributes = []
      } = options;
      const attribute_type = dracoAttribute.attribute_type();
      const octahedron = octahedronAttributes.map((type) => this.decoder[type]).includes(attribute_type);
      if (octahedron) {
        const transform = new this.draco.AttributeQuantizationTransform();
        try {
          if (transform.InitFromAttribute(dracoAttribute)) {
            return {
              quantization_bits: transform.quantization_bits()
            };
          }
        } finally {
          this.draco.destroy(transform);
        }
      }
      return null;
    }
  }
  function getDracoDataType(draco, attributeType) {
    switch (attributeType) {
      case Float32Array:
        return draco.DT_FLOAT32;
      case Int8Array:
        return draco.DT_INT8;
      case Int16Array:
        return draco.DT_INT16;
      case Int32Array:
        return draco.DT_INT32;
      case Uint8Array:
        return draco.DT_UINT8;
      case Uint16Array:
        return draco.DT_UINT16;
      case Uint32Array:
        return draco.DT_UINT32;
      default:
        return draco.DT_INVALID;
    }
  }
  function getInt32Array(dracoArray) {
    const numValues = dracoArray.size();
    const intArray = new Int32Array(numValues);
    for (let i2 = 0; i2 < numValues; i2++) {
      intArray[i2] = dracoArray.GetValue(i2);
    }
    return intArray;
  }
  function getUint32Array(dracoArray) {
    const numValues = dracoArray.size();
    const intArray = new Int32Array(numValues);
    for (let i2 = 0; i2 < numValues; i2++) {
      intArray[i2] = dracoArray.GetValue(i2);
    }
    return intArray;
  }
  const DRACO_DECODER_VERSION = "1.5.6";
  const DRACO_ENCODER_VERSION = "1.4.1";
  const STATIC_DECODER_URL = `https://www.gstatic.com/draco/versioned/decoders/${DRACO_DECODER_VERSION}`;
  const DRACO_EXTERNAL_LIBRARIES = {
    DECODER: "draco_wasm_wrapper.js",
    DECODER_WASM: "draco_decoder.wasm",
    FALLBACK_DECODER: "draco_decoder.js",
    ENCODER: "draco_encoder.js"
  };
  const DRACO_EXTERNAL_LIBRARY_URLS = {
    [DRACO_EXTERNAL_LIBRARIES.DECODER]: `${STATIC_DECODER_URL}/${DRACO_EXTERNAL_LIBRARIES.DECODER}`,
    [DRACO_EXTERNAL_LIBRARIES.DECODER_WASM]: `${STATIC_DECODER_URL}/${DRACO_EXTERNAL_LIBRARIES.DECODER_WASM}`,
    [DRACO_EXTERNAL_LIBRARIES.FALLBACK_DECODER]: `${STATIC_DECODER_URL}/${DRACO_EXTERNAL_LIBRARIES.FALLBACK_DECODER}`,
    [DRACO_EXTERNAL_LIBRARIES.ENCODER]: `https://raw.githubusercontent.com/google/draco/${DRACO_ENCODER_VERSION}/javascript/${DRACO_EXTERNAL_LIBRARIES.ENCODER}`
  };
  let loadDecoderPromise;
  async function loadDracoDecoderModule(options) {
    const modules = options.modules || {};
    if (modules.draco3d) {
      loadDecoderPromise = loadDecoderPromise || modules.draco3d.createDecoderModule({}).then((draco) => {
        return {
          draco
        };
      });
    } else {
      loadDecoderPromise = loadDecoderPromise || loadDracoDecoder(options);
    }
    return await loadDecoderPromise;
  }
  async function loadDracoDecoder(options) {
    let DracoDecoderModule;
    let wasmBinary;
    switch (options.draco && options.draco.decoderType) {
      case "js":
        DracoDecoderModule = await loadLibrary(DRACO_EXTERNAL_LIBRARY_URLS[DRACO_EXTERNAL_LIBRARIES.FALLBACK_DECODER], "draco", options, DRACO_EXTERNAL_LIBRARIES.FALLBACK_DECODER);
        break;
      case "wasm":
      default:
        [DracoDecoderModule, wasmBinary] = await Promise.all([await loadLibrary(DRACO_EXTERNAL_LIBRARY_URLS[DRACO_EXTERNAL_LIBRARIES.DECODER], "draco", options, DRACO_EXTERNAL_LIBRARIES.DECODER), await loadLibrary(DRACO_EXTERNAL_LIBRARY_URLS[DRACO_EXTERNAL_LIBRARIES.DECODER_WASM], "draco", options, DRACO_EXTERNAL_LIBRARIES.DECODER_WASM)]);
    }
    DracoDecoderModule = DracoDecoderModule || globalThis.DracoDecoderModule;
    return await initializeDracoDecoder(DracoDecoderModule, wasmBinary);
  }
  function initializeDracoDecoder(DracoDecoderModule, wasmBinary) {
    const options = {};
    if (wasmBinary) {
      options.wasmBinary = wasmBinary;
    }
    return new Promise((resolve2) => {
      DracoDecoderModule({
        ...options,
        onModuleLoaded: (draco) => resolve2({
          draco
        })
      });
    });
  }
  const DracoLoader = {
    ...DracoLoader$1,
    parse: parse$3
  };
  async function parse$3(arrayBuffer, options) {
    const {
      draco
    } = await loadDracoDecoderModule(options);
    const dracoParser = new DracoParser(draco);
    try {
      return dracoParser.parseSync(arrayBuffer, options === null || options === void 0 ? void 0 : options.draco);
    } finally {
      dracoParser.destroy();
    }
  }
  const GL_PRIMITIVE_MODE = {
    POINTS: 0,
    LINES: 1,
    LINE_LOOP: 2,
    LINE_STRIP: 3,
    TRIANGLES: 4,
    TRIANGLE_STRIP: 5,
    TRIANGLE_FAN: 6
  };
  const GL_TYPE = {
    BYTE: 5120,
    UNSIGNED_BYTE: 5121,
    SHORT: 5122,
    UNSIGNED_SHORT: 5123,
    INT: 5124,
    UNSIGNED_INT: 5125,
    FLOAT: 5126,
    DOUBLE: 5130
  };
  const GL$1 = {
    ...GL_PRIMITIVE_MODE,
    ...GL_TYPE
  };
  const GL_TYPE_TO_ARRAY_TYPE = {
    [GL_TYPE.DOUBLE]: Float64Array,
    [GL_TYPE.FLOAT]: Float32Array,
    [GL_TYPE.UNSIGNED_SHORT]: Uint16Array,
    [GL_TYPE.UNSIGNED_INT]: Uint32Array,
    [GL_TYPE.UNSIGNED_BYTE]: Uint8Array,
    [GL_TYPE.BYTE]: Int8Array,
    [GL_TYPE.SHORT]: Int16Array,
    [GL_TYPE.INT]: Int32Array
  };
  const NAME_TO_GL_TYPE = {
    DOUBLE: GL_TYPE.DOUBLE,
    FLOAT: GL_TYPE.FLOAT,
    UNSIGNED_SHORT: GL_TYPE.UNSIGNED_SHORT,
    UNSIGNED_INT: GL_TYPE.UNSIGNED_INT,
    UNSIGNED_BYTE: GL_TYPE.UNSIGNED_BYTE,
    BYTE: GL_TYPE.BYTE,
    SHORT: GL_TYPE.SHORT,
    INT: GL_TYPE.INT
  };
  const ERR_TYPE_CONVERSION = "Failed to convert GL type";
  class GLType {
    static fromTypedArray(arrayOrType) {
      arrayOrType = ArrayBuffer.isView(arrayOrType) ? arrayOrType.constructor : arrayOrType;
      for (const glType in GL_TYPE_TO_ARRAY_TYPE) {
        const ArrayType = GL_TYPE_TO_ARRAY_TYPE[glType];
        if (ArrayType === arrayOrType) {
          return glType;
        }
      }
      throw new Error(ERR_TYPE_CONVERSION);
    }
    static fromName(name2) {
      const glType = NAME_TO_GL_TYPE[name2];
      if (!glType) {
        throw new Error(ERR_TYPE_CONVERSION);
      }
      return glType;
    }
    static getArrayType(glType) {
      switch (glType) {
        case GL_TYPE.UNSIGNED_SHORT_5_6_5:
        case GL_TYPE.UNSIGNED_SHORT_4_4_4_4:
        case GL_TYPE.UNSIGNED_SHORT_5_5_5_1:
          return Uint16Array;
        default:
          const ArrayType = GL_TYPE_TO_ARRAY_TYPE[glType];
          if (!ArrayType) {
            throw new Error(ERR_TYPE_CONVERSION);
          }
          return ArrayType;
      }
    }
    static getByteSize(glType) {
      const ArrayType = GLType.getArrayType(glType);
      return ArrayType.BYTES_PER_ELEMENT;
    }
    static validate(glType) {
      return Boolean(GLType.getArrayType(glType));
    }
    static createTypedArray(glType, buffer) {
      let byteOffset = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
      let length2 = arguments.length > 3 ? arguments[3] : void 0;
      if (length2 === void 0) {
        length2 = (buffer.byteLength - byteOffset) / GLType.getByteSize(glType);
      }
      const ArrayType = GLType.getArrayType(glType);
      return new ArrayType(buffer, byteOffset, length2);
    }
  }
  function assert$2(condition, message) {
    if (!condition) {
      throw new Error(`math.gl assertion failed. ${message}`);
    }
  }
  function decodeRGB565(rgb565) {
    let target = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [0, 0, 0];
    const r5 = rgb565 >> 11 & 31;
    const g6 = rgb565 >> 5 & 63;
    const b5 = rgb565 & 31;
    target[0] = r5 << 3;
    target[1] = g6 << 2;
    target[2] = b5 << 3;
    return target;
  }
  new Vector2();
  new Vector3();
  new Vector2();
  new Vector2();
  function fromSNorm(value) {
    let rangeMaximum = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 255;
    return clamp(value, 0, rangeMaximum) / rangeMaximum * 2 - 1;
  }
  function signNotZero(value) {
    return value < 0 ? -1 : 1;
  }
  function octDecodeInRange(x, y, rangeMax, result) {
    assert$2(result);
    if (x < 0 || x > rangeMax || y < 0 || y > rangeMax) {
      throw new Error(`x and y must be unsigned normalized integers between 0 and ${rangeMax}`);
    }
    result.x = fromSNorm(x, rangeMax);
    result.y = fromSNorm(y, rangeMax);
    result.z = 1 - (Math.abs(result.x) + Math.abs(result.y));
    if (result.z < 0) {
      const oldVX = result.x;
      result.x = (1 - Math.abs(result.y)) * signNotZero(oldVX);
      result.y = (1 - Math.abs(oldVX)) * signNotZero(result.y);
    }
    return result.normalize();
  }
  function octDecode(x, y, result) {
    return octDecodeInRange(x, y, 255, result);
  }
  class Tile3DFeatureTable {
    constructor(featureTableJson, featureTableBinary) {
      this.json = void 0;
      this.buffer = void 0;
      this.featuresLength = 0;
      this._cachedTypedArrays = {};
      this.json = featureTableJson;
      this.buffer = featureTableBinary;
    }
    getExtension(extensionName) {
      return this.json.extensions && this.json.extensions[extensionName];
    }
    hasProperty(propertyName) {
      return Boolean(this.json[propertyName]);
    }
    getGlobalProperty(propertyName) {
      let componentType = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : GL$1.UNSIGNED_INT;
      let componentLength = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
      const jsonValue = this.json[propertyName];
      if (jsonValue && Number.isFinite(jsonValue.byteOffset)) {
        return this._getTypedArrayFromBinary(propertyName, componentType, componentLength, 1, jsonValue.byteOffset);
      }
      return jsonValue;
    }
    getPropertyArray(propertyName, componentType, componentLength) {
      const jsonValue = this.json[propertyName];
      if (jsonValue && Number.isFinite(jsonValue.byteOffset)) {
        if ("componentType" in jsonValue) {
          componentType = GLType.fromName(jsonValue.componentType);
        }
        return this._getTypedArrayFromBinary(propertyName, componentType, componentLength, this.featuresLength, jsonValue.byteOffset);
      }
      return this._getTypedArrayFromArray(propertyName, componentType, jsonValue);
    }
    getProperty(propertyName, componentType, componentLength, featureId, result) {
      const jsonValue = this.json[propertyName];
      if (!jsonValue) {
        return jsonValue;
      }
      const typedArray = this.getPropertyArray(propertyName, componentType, componentLength);
      if (componentLength === 1) {
        return typedArray[featureId];
      }
      for (let i2 = 0; i2 < componentLength; ++i2) {
        result[i2] = typedArray[componentLength * featureId + i2];
      }
      return result;
    }
    _getTypedArrayFromBinary(propertyName, componentType, componentLength, count, byteOffset) {
      const cachedTypedArrays = this._cachedTypedArrays;
      let typedArray = cachedTypedArrays[propertyName];
      if (!typedArray) {
        typedArray = GLType.createTypedArray(componentType, this.buffer.buffer, this.buffer.byteOffset + byteOffset, count * componentLength);
        cachedTypedArrays[propertyName] = typedArray;
      }
      return typedArray;
    }
    _getTypedArrayFromArray(propertyName, componentType, array) {
      const cachedTypedArrays = this._cachedTypedArrays;
      let typedArray = cachedTypedArrays[propertyName];
      if (!typedArray) {
        typedArray = GLType.createTypedArray(componentType, array);
        cachedTypedArrays[propertyName] = typedArray;
      }
      return typedArray;
    }
  }
  const COMPONENTS_PER_ATTRIBUTE = {
    SCALAR: 1,
    VEC2: 2,
    VEC3: 3,
    VEC4: 4,
    MAT2: 4,
    MAT3: 9,
    MAT4: 16
  };
  const UNPACKER = {
    SCALAR: (values, i2) => values[i2],
    VEC2: (values, i2) => [values[2 * i2 + 0], values[2 * i2 + 1]],
    VEC3: (values, i2) => [values[3 * i2 + 0], values[3 * i2 + 1], values[3 * i2 + 2]],
    VEC4: (values, i2) => [values[4 * i2 + 0], values[4 * i2 + 1], values[4 * i2 + 2], values[4 * i2 + 3]],
    MAT2: (values, i2) => [values[4 * i2 + 0], values[4 * i2 + 1], values[4 * i2 + 2], values[4 * i2 + 3]],
    MAT3: (values, i2) => [values[9 * i2 + 0], values[9 * i2 + 1], values[9 * i2 + 2], values[9 * i2 + 3], values[9 * i2 + 4], values[9 * i2 + 5], values[9 * i2 + 6], values[9 * i2 + 7], values[9 * i2 + 8]],
    MAT4: (values, i2) => [values[16 * i2 + 0], values[16 * i2 + 1], values[16 * i2 + 2], values[16 * i2 + 3], values[16 * i2 + 4], values[16 * i2 + 5], values[16 * i2 + 6], values[16 * i2 + 7], values[16 * i2 + 8], values[16 * i2 + 9], values[16 * i2 + 10], values[16 * i2 + 11], values[16 * i2 + 12], values[16 * i2 + 13], values[16 * i2 + 14], values[16 * i2 + 15]]
  };
  const PACKER = {
    SCALAR: (x, values, i2) => {
      values[i2] = x;
    },
    VEC2: (x, values, i2) => {
      values[2 * i2 + 0] = x[0];
      values[2 * i2 + 1] = x[1];
    },
    VEC3: (x, values, i2) => {
      values[3 * i2 + 0] = x[0];
      values[3 * i2 + 1] = x[1];
      values[3 * i2 + 2] = x[2];
    },
    VEC4: (x, values, i2) => {
      values[4 * i2 + 0] = x[0];
      values[4 * i2 + 1] = x[1];
      values[4 * i2 + 2] = x[2];
      values[4 * i2 + 3] = x[3];
    },
    MAT2: (x, values, i2) => {
      values[4 * i2 + 0] = x[0];
      values[4 * i2 + 1] = x[1];
      values[4 * i2 + 2] = x[2];
      values[4 * i2 + 3] = x[3];
    },
    MAT3: (x, values, i2) => {
      values[9 * i2 + 0] = x[0];
      values[9 * i2 + 1] = x[1];
      values[9 * i2 + 2] = x[2];
      values[9 * i2 + 3] = x[3];
      values[9 * i2 + 4] = x[4];
      values[9 * i2 + 5] = x[5];
      values[9 * i2 + 6] = x[6];
      values[9 * i2 + 7] = x[7];
      values[9 * i2 + 8] = x[8];
      values[9 * i2 + 9] = x[9];
    },
    MAT4: (x, values, i2) => {
      values[16 * i2 + 0] = x[0];
      values[16 * i2 + 1] = x[1];
      values[16 * i2 + 2] = x[2];
      values[16 * i2 + 3] = x[3];
      values[16 * i2 + 4] = x[4];
      values[16 * i2 + 5] = x[5];
      values[16 * i2 + 6] = x[6];
      values[16 * i2 + 7] = x[7];
      values[16 * i2 + 8] = x[8];
      values[16 * i2 + 9] = x[9];
      values[16 * i2 + 10] = x[10];
      values[16 * i2 + 11] = x[11];
      values[16 * i2 + 12] = x[12];
      values[16 * i2 + 13] = x[13];
      values[16 * i2 + 14] = x[14];
      values[16 * i2 + 15] = x[15];
    }
  };
  function createTypedArrayFromAccessor(tile3DAccessor, buffer, byteOffset, length2) {
    const {
      componentType
    } = tile3DAccessor;
    assert$6(tile3DAccessor.componentType);
    const type = typeof componentType === "string" ? GLType.fromName(componentType) : componentType;
    const size = COMPONENTS_PER_ATTRIBUTE[tile3DAccessor.type];
    const unpacker = UNPACKER[tile3DAccessor.type];
    const packer = PACKER[tile3DAccessor.type];
    byteOffset += tile3DAccessor.byteOffset;
    const values = GLType.createTypedArray(type, buffer, byteOffset, size * length2);
    return {
      values,
      type,
      size,
      unpacker,
      packer
    };
  }
  const defined$1 = (x) => x !== void 0;
  function initializeHierarchy(batchTable, jsonHeader, binaryBody) {
    if (!jsonHeader) {
      return null;
    }
    let hierarchy = batchTable.getExtension("3DTILES_batch_table_hierarchy");
    const legacyHierarchy = jsonHeader.HIERARCHY;
    if (legacyHierarchy) {
      console.warn("3D Tile Parser: HIERARCHY is deprecated. Use 3DTILES_batch_table_hierarchy.");
      jsonHeader.extensions = jsonHeader.extensions || {};
      jsonHeader.extensions["3DTILES_batch_table_hierarchy"] = legacyHierarchy;
      hierarchy = legacyHierarchy;
    }
    if (!hierarchy) {
      return null;
    }
    return initializeHierarchyValues(hierarchy, binaryBody);
  }
  function initializeHierarchyValues(hierarchyJson, binaryBody) {
    let i2;
    let classId;
    let binaryAccessor;
    const instancesLength = hierarchyJson.instancesLength;
    const classes = hierarchyJson.classes;
    let classIds = hierarchyJson.classIds;
    let parentCounts = hierarchyJson.parentCounts;
    let parentIds = hierarchyJson.parentIds;
    let parentIdsLength = instancesLength;
    if (defined$1(classIds.byteOffset)) {
      classIds.componentType = defaultValue(classIds.componentType, GL.UNSIGNED_SHORT);
      classIds.type = AttributeType.SCALAR;
      binaryAccessor = getBinaryAccessor(classIds);
      classIds = binaryAccessor.createArrayBufferView(binaryBody.buffer, binaryBody.byteOffset + classIds.byteOffset, instancesLength);
    }
    let parentIndexes;
    if (defined$1(parentCounts)) {
      if (defined$1(parentCounts.byteOffset)) {
        parentCounts.componentType = defaultValue(parentCounts.componentType, GL.UNSIGNED_SHORT);
        parentCounts.type = AttributeType.SCALAR;
        binaryAccessor = getBinaryAccessor(parentCounts);
        parentCounts = binaryAccessor.createArrayBufferView(binaryBody.buffer, binaryBody.byteOffset + parentCounts.byteOffset, instancesLength);
      }
      parentIndexes = new Uint16Array(instancesLength);
      parentIdsLength = 0;
      for (i2 = 0; i2 < instancesLength; ++i2) {
        parentIndexes[i2] = parentIdsLength;
        parentIdsLength += parentCounts[i2];
      }
    }
    if (defined$1(parentIds) && defined$1(parentIds.byteOffset)) {
      parentIds.componentType = defaultValue(parentIds.componentType, GL.UNSIGNED_SHORT);
      parentIds.type = AttributeType.SCALAR;
      binaryAccessor = getBinaryAccessor(parentIds);
      parentIds = binaryAccessor.createArrayBufferView(binaryBody.buffer, binaryBody.byteOffset + parentIds.byteOffset, parentIdsLength);
    }
    const classesLength = classes.length;
    for (i2 = 0; i2 < classesLength; ++i2) {
      const classInstancesLength = classes[i2].length;
      const properties = classes[i2].instances;
      const binaryProperties = getBinaryProperties(classInstancesLength, properties, binaryBody);
      classes[i2].instances = combine(binaryProperties, properties);
    }
    const classCounts = new Array(classesLength).fill(0);
    const classIndexes = new Uint16Array(instancesLength);
    for (i2 = 0; i2 < instancesLength; ++i2) {
      classId = classIds[i2];
      classIndexes[i2] = classCounts[classId];
      ++classCounts[classId];
    }
    const hierarchy = {
      classes,
      classIds,
      classIndexes,
      parentCounts,
      parentIndexes,
      parentIds
    };
    validateHierarchy(hierarchy);
    return hierarchy;
  }
  function traverseHierarchy(hierarchy, instanceIndex, endConditionCallback) {
    if (!hierarchy) {
      return;
    }
    const parentCounts = hierarchy.parentCounts;
    const parentIds = hierarchy.parentIds;
    if (parentIds) {
      return endConditionCallback(hierarchy, instanceIndex);
    }
    if (parentCounts > 0) {
      return traverseHierarchyMultipleParents(hierarchy, instanceIndex, endConditionCallback);
    }
    return traverseHierarchySingleParent(hierarchy, instanceIndex, endConditionCallback);
  }
  function traverseHierarchyMultipleParents(hierarchy, instanceIndex, endConditionCallback) {
    const classIds = hierarchy.classIds;
    const parentCounts = hierarchy.parentCounts;
    const parentIds = hierarchy.parentIds;
    const parentIndexes = hierarchy.parentIndexes;
    const instancesLength = classIds.length;
    const visited = scratchVisited;
    visited.length = Math.max(visited.length, instancesLength);
    const visitedMarker = ++marker;
    const stack2 = scratchStack;
    stack2.length = 0;
    stack2.push(instanceIndex);
    while (stack2.length > 0) {
      instanceIndex = stack2.pop();
      if (visited[instanceIndex] === visitedMarker) {
        continue;
      }
      visited[instanceIndex] = visitedMarker;
      const result = endConditionCallback(hierarchy, instanceIndex);
      if (defined$1(result)) {
        return result;
      }
      const parentCount = parentCounts[instanceIndex];
      const parentIndex = parentIndexes[instanceIndex];
      for (let i2 = 0; i2 < parentCount; ++i2) {
        const parentId = parentIds[parentIndex + i2];
        if (parentId !== instanceIndex) {
          stack2.push(parentId);
        }
      }
    }
    return null;
  }
  function traverseHierarchySingleParent(hierarchy, instanceIndex, endConditionCallback) {
    let hasParent = true;
    while (hasParent) {
      const result = endConditionCallback(hierarchy, instanceIndex);
      if (defined$1(result)) {
        return result;
      }
      const parentId = hierarchy.parentIds[instanceIndex];
      hasParent = parentId !== instanceIndex;
      instanceIndex = parentId;
    }
    throw new Error("traverseHierarchySingleParent");
  }
  function validateHierarchy(hierarchy) {
    const classIds = hierarchy.classIds;
    const instancesLength = classIds.length;
    for (let i2 = 0; i2 < instancesLength; ++i2) {
      validateInstance(hierarchy, i2, stack);
    }
  }
  function validateInstance(hierarchy, instanceIndex, stack2) {
    const parentCounts = hierarchy.parentCounts;
    const parentIds = hierarchy.parentIds;
    const parentIndexes = hierarchy.parentIndexes;
    const classIds = hierarchy.classIds;
    const instancesLength = classIds.length;
    if (!defined$1(parentIds)) {
      return;
    }
    assert(instanceIndex < instancesLength, `Parent index ${instanceIndex} exceeds the total number of instances: ${instancesLength}`);
    assert(stack2.indexOf(instanceIndex) === -1, "Circular dependency detected in the batch table hierarchy.");
    stack2.push(instanceIndex);
    const parentCount = defined$1(parentCounts) ? parentCounts[instanceIndex] : 1;
    const parentIndex = defined$1(parentCounts) ? parentIndexes[instanceIndex] : instanceIndex;
    for (let i2 = 0; i2 < parentCount; ++i2) {
      const parentId = parentIds[parentIndex + i2];
      if (parentId !== instanceIndex) {
        validateInstance(hierarchy, parentId, stack2);
      }
    }
    stack2.pop(instanceIndex);
  }
  function defined(x) {
    return x !== void 0 && x !== null;
  }
  const clone = (x, y) => x;
  const IGNORED_PROPERTY_FIELDS = {
    HIERARCHY: true,
    extensions: true,
    extras: true
  };
  class Tile3DBatchTableParser {
    constructor(json, binary, featureCount) {
      var _this$json;
      let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
      this.json = void 0;
      this.binary = void 0;
      this.featureCount = void 0;
      this._extensions = void 0;
      this._properties = void 0;
      this._binaryProperties = void 0;
      this._hierarchy = void 0;
      assert$6(featureCount >= 0);
      this.json = json || {};
      this.binary = binary;
      this.featureCount = featureCount;
      this._extensions = ((_this$json = this.json) === null || _this$json === void 0 ? void 0 : _this$json.extensions) || {};
      this._properties = {};
      for (const propertyName in this.json) {
        if (!IGNORED_PROPERTY_FIELDS[propertyName]) {
          this._properties[propertyName] = this.json[propertyName];
        }
      }
      this._binaryProperties = this._initializeBinaryProperties();
      if (options["3DTILES_batch_table_hierarchy"]) {
        this._hierarchy = initializeHierarchy(this, this.json, this.binary);
      }
    }
    getExtension(extensionName) {
      return this.json && this.json.extensions && this.json.extensions[extensionName];
    }
    memorySizeInBytes() {
      return 0;
    }
    isClass(batchId, className) {
      this._checkBatchId(batchId);
      assert$6(typeof className === "string", className);
      if (this._hierarchy) {
        const result = traverseHierarchy(this._hierarchy, batchId, (hierarchy, instanceIndex) => {
          const classId = hierarchy.classIds[instanceIndex];
          const instanceClass = hierarchy.classes[classId];
          return instanceClass.name === className;
        });
        return defined(result);
      }
      return false;
    }
    isExactClass(batchId, className) {
      assert$6(typeof className === "string", className);
      return this.getExactClassName(batchId) === className;
    }
    getExactClassName(batchId) {
      this._checkBatchId(batchId);
      if (this._hierarchy) {
        const classId = this._hierarchy.classIds[batchId];
        const instanceClass = this._hierarchy.classes[classId];
        return instanceClass.name;
      }
      return void 0;
    }
    hasProperty(batchId, name2) {
      this._checkBatchId(batchId);
      assert$6(typeof name2 === "string", name2);
      return defined(this._properties[name2]) || this._hasPropertyInHierarchy(batchId, name2);
    }
    getPropertyNames(batchId, results) {
      this._checkBatchId(batchId);
      results = defined(results) ? results : [];
      results.length = 0;
      const propertyNames = Object.keys(this._properties);
      results.push(...propertyNames);
      if (this._hierarchy) {
        this._getPropertyNamesInHierarchy(batchId, results);
      }
      return results;
    }
    getProperty(batchId, name2) {
      this._checkBatchId(batchId);
      assert$6(typeof name2 === "string", name2);
      if (this._binaryProperties) {
        const binaryProperty = this._binaryProperties[name2];
        if (defined(binaryProperty)) {
          return this._getBinaryProperty(binaryProperty, batchId);
        }
      }
      const propertyValues = this._properties[name2];
      if (defined(propertyValues)) {
        return clone(propertyValues[batchId]);
      }
      if (this._hierarchy) {
        const hierarchyProperty = this._getHierarchyProperty(batchId, name2);
        if (defined(hierarchyProperty)) {
          return hierarchyProperty;
        }
      }
      return void 0;
    }
    setProperty(batchId, name2, value) {
      const featureCount = this.featureCount;
      this._checkBatchId(batchId);
      assert$6(typeof name2 === "string", name2);
      if (this._binaryProperties) {
        const binaryProperty = this._binaryProperties[name2];
        if (binaryProperty) {
          this._setBinaryProperty(binaryProperty, batchId, value);
          return;
        }
      }
      if (this._hierarchy) {
        if (this._setHierarchyProperty(this, batchId, name2, value)) {
          return;
        }
      }
      let propertyValues = this._properties[name2];
      if (!defined(propertyValues)) {
        this._properties[name2] = new Array(featureCount);
        propertyValues = this._properties[name2];
      }
      propertyValues[batchId] = clone(value);
    }
    _checkBatchId(batchId) {
      const valid = batchId >= 0 && batchId < this.featureCount;
      if (!valid) {
        throw new Error("batchId not in range [0, featureCount - 1].");
      }
    }
    _getBinaryProperty(binaryProperty, index) {
      return binaryProperty.unpack(binaryProperty.typedArray, index);
    }
    _setBinaryProperty(binaryProperty, index, value) {
      binaryProperty.pack(value, binaryProperty.typedArray, index);
    }
    _initializeBinaryProperties() {
      let binaryProperties = null;
      for (const name2 in this._properties) {
        const property = this._properties[name2];
        const binaryProperty = this._initializeBinaryProperty(name2, property);
        if (binaryProperty) {
          binaryProperties = binaryProperties || {};
          binaryProperties[name2] = binaryProperty;
        }
      }
      return binaryProperties;
    }
    _initializeBinaryProperty(name2, property) {
      if ("byteOffset" in property) {
        const tile3DAccessor = property;
        assert$6(this.binary, `Property ${name2} requires a batch table binary.`);
        assert$6(tile3DAccessor.type, `Property ${name2} requires a type.`);
        const accessor = createTypedArrayFromAccessor(tile3DAccessor, this.binary.buffer, this.binary.byteOffset | 0, this.featureCount);
        return {
          typedArray: accessor.values,
          componentCount: accessor.size,
          unpack: accessor.unpacker,
          pack: accessor.packer
        };
      }
      return null;
    }
    _hasPropertyInHierarchy(batchId, name2) {
      if (!this._hierarchy) {
        return false;
      }
      const result = traverseHierarchy(this._hierarchy, batchId, (hierarchy, instanceIndex) => {
        const classId = hierarchy.classIds[instanceIndex];
        const instances = hierarchy.classes[classId].instances;
        return defined(instances[name2]);
      });
      return defined(result);
    }
    _getPropertyNamesInHierarchy(batchId, results) {
      traverseHierarchy(this._hierarchy, batchId, (hierarchy, instanceIndex) => {
        const classId = hierarchy.classIds[instanceIndex];
        const instances = hierarchy.classes[classId].instances;
        for (const name2 in instances) {
          if (instances.hasOwnProperty(name2)) {
            if (results.indexOf(name2) === -1) {
              results.push(name2);
            }
          }
        }
      });
    }
    _getHierarchyProperty(batchId, name2) {
      return traverseHierarchy(this._hierarchy, batchId, (hierarchy, instanceIndex) => {
        const classId = hierarchy.classIds[instanceIndex];
        const instanceClass = hierarchy.classes[classId];
        const indexInClass = hierarchy.classIndexes[instanceIndex];
        const propertyValues = instanceClass.instances[name2];
        if (defined(propertyValues)) {
          if (defined(propertyValues.typedArray)) {
            return this._getBinaryProperty(propertyValues, indexInClass);
          }
          return clone(propertyValues[indexInClass]);
        }
        return null;
      });
    }
    _setHierarchyProperty(batchTable, batchId, name2, value) {
      const result = traverseHierarchy(this._hierarchy, batchId, (hierarchy, instanceIndex) => {
        const classId = hierarchy.classIds[instanceIndex];
        const instanceClass = hierarchy.classes[classId];
        const indexInClass = hierarchy.classIndexes[instanceIndex];
        const propertyValues = instanceClass.instances[name2];
        if (defined(propertyValues)) {
          assert$6(instanceIndex === batchId, `Inherited property "${name2}" is read-only.`);
          if (defined(propertyValues.typedArray)) {
            this._setBinaryProperty(propertyValues, indexInClass, value);
          } else {
            propertyValues[indexInClass] = clone(value);
          }
          return true;
        }
        return false;
      });
      return defined(result);
    }
  }
  const SIZEOF_UINT32$1 = 4;
  function parse3DTileHeaderSync(tile, arrayBuffer) {
    let byteOffset = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
    const view = new DataView(arrayBuffer);
    tile.magic = view.getUint32(byteOffset, true);
    byteOffset += SIZEOF_UINT32$1;
    tile.version = view.getUint32(byteOffset, true);
    byteOffset += SIZEOF_UINT32$1;
    tile.byteLength = view.getUint32(byteOffset, true);
    byteOffset += SIZEOF_UINT32$1;
    if (tile.version !== 1) {
      throw new Error(`3D Tile Version ${tile.version} not supported`);
    }
    return byteOffset;
  }
  const SIZEOF_UINT32 = 4;
  const DEPRECATION_WARNING = "b3dm tile in legacy format.";
  function parse3DTileTablesHeaderSync(tile, arrayBuffer, byteOffset) {
    const view = new DataView(arrayBuffer);
    let batchLength;
    tile.header = tile.header || {};
    let featureTableJsonByteLength = view.getUint32(byteOffset, true);
    byteOffset += SIZEOF_UINT32;
    let featureTableBinaryByteLength = view.getUint32(byteOffset, true);
    byteOffset += SIZEOF_UINT32;
    let batchTableJsonByteLength = view.getUint32(byteOffset, true);
    byteOffset += SIZEOF_UINT32;
    let batchTableBinaryByteLength = view.getUint32(byteOffset, true);
    byteOffset += SIZEOF_UINT32;
    if (batchTableJsonByteLength >= 570425344) {
      byteOffset -= SIZEOF_UINT32 * 2;
      batchLength = featureTableJsonByteLength;
      batchTableJsonByteLength = featureTableBinaryByteLength;
      batchTableBinaryByteLength = 0;
      featureTableJsonByteLength = 0;
      featureTableBinaryByteLength = 0;
      console.warn(DEPRECATION_WARNING);
    } else if (batchTableBinaryByteLength >= 570425344) {
      byteOffset -= SIZEOF_UINT32;
      batchLength = batchTableJsonByteLength;
      batchTableJsonByteLength = featureTableJsonByteLength;
      batchTableBinaryByteLength = featureTableBinaryByteLength;
      featureTableJsonByteLength = 0;
      featureTableBinaryByteLength = 0;
      console.warn(DEPRECATION_WARNING);
    }
    tile.header.featureTableJsonByteLength = featureTableJsonByteLength;
    tile.header.featureTableBinaryByteLength = featureTableBinaryByteLength;
    tile.header.batchTableJsonByteLength = batchTableJsonByteLength;
    tile.header.batchTableBinaryByteLength = batchTableBinaryByteLength;
    tile.header.batchLength = batchLength;
    return byteOffset;
  }
  function parse3DTileTablesSync(tile, arrayBuffer, byteOffset, options) {
    byteOffset = parse3DTileFeatureTable(tile, arrayBuffer, byteOffset);
    byteOffset = parse3DTileBatchTable(tile, arrayBuffer, byteOffset);
    return byteOffset;
  }
  function parse3DTileFeatureTable(tile, arrayBuffer, byteOffset, options) {
    const {
      featureTableJsonByteLength,
      featureTableBinaryByteLength,
      batchLength
    } = tile.header || {};
    tile.featureTableJson = {
      BATCH_LENGTH: batchLength || 0
    };
    if (featureTableJsonByteLength && featureTableJsonByteLength > 0) {
      const featureTableString = getStringFromArrayBuffer(arrayBuffer, byteOffset, featureTableJsonByteLength);
      tile.featureTableJson = JSON.parse(featureTableString);
    }
    byteOffset += featureTableJsonByteLength || 0;
    tile.featureTableBinary = new Uint8Array(arrayBuffer, byteOffset, featureTableBinaryByteLength);
    byteOffset += featureTableBinaryByteLength || 0;
    return byteOffset;
  }
  function parse3DTileBatchTable(tile, arrayBuffer, byteOffset, options) {
    const {
      batchTableJsonByteLength,
      batchTableBinaryByteLength
    } = tile.header || {};
    if (batchTableJsonByteLength && batchTableJsonByteLength > 0) {
      const batchTableString = getStringFromArrayBuffer(arrayBuffer, byteOffset, batchTableJsonByteLength);
      tile.batchTableJson = JSON.parse(batchTableString);
      byteOffset += batchTableJsonByteLength;
      if (batchTableBinaryByteLength && batchTableBinaryByteLength > 0) {
        tile.batchTableBinary = new Uint8Array(arrayBuffer, byteOffset, batchTableBinaryByteLength);
        tile.batchTableBinary = new Uint8Array(tile.batchTableBinary);
        byteOffset += batchTableBinaryByteLength;
      }
    }
    return byteOffset;
  }
  function normalize3DTileColorAttribute(tile, colors, batchTable) {
    if (!colors && (!tile || !tile.batchIds || !batchTable)) {
      return null;
    }
    const {
      batchIds,
      isRGB565,
      pointCount = 0
    } = tile;
    if (batchIds && batchTable) {
      const colorArray = new Uint8ClampedArray(pointCount * 3);
      for (let i2 = 0; i2 < pointCount; i2++) {
        const batchId = batchIds[i2];
        const dimensions = batchTable.getProperty(batchId, "dimensions");
        const color = dimensions.map((d) => d * 255);
        colorArray[i2 * 3] = color[0];
        colorArray[i2 * 3 + 1] = color[1];
        colorArray[i2 * 3 + 2] = color[2];
      }
      return {
        type: GL$1.UNSIGNED_BYTE,
        value: colorArray,
        size: 3,
        normalized: true
      };
    }
    if (colors && isRGB565) {
      const colorArray = new Uint8ClampedArray(pointCount * 3);
      for (let i2 = 0; i2 < pointCount; i2++) {
        const color = decodeRGB565(colors[i2]);
        colorArray[i2 * 3] = color[0];
        colorArray[i2 * 3 + 1] = color[1];
        colorArray[i2 * 3 + 2] = color[2];
      }
      return {
        type: GL$1.UNSIGNED_BYTE,
        value: colorArray,
        size: 3,
        normalized: true
      };
    }
    if (colors && colors.length === pointCount * 3) {
      return {
        type: GL$1.UNSIGNED_BYTE,
        value: colors,
        size: 3,
        normalized: true
      };
    }
    return {
      type: GL$1.UNSIGNED_BYTE,
      value: colors || new Uint8ClampedArray(),
      size: 4,
      normalized: true
    };
  }
  const scratchNormal = new Vector3();
  function normalize3DTileNormalAttribute(tile, normals) {
    if (!normals) {
      return null;
    }
    if (tile.isOctEncoded16P) {
      const decodedArray = new Float32Array((tile.pointsLength || 0) * 3);
      for (let i2 = 0; i2 < (tile.pointsLength || 0); i2++) {
        octDecode(normals[i2 * 2], normals[i2 * 2 + 1], scratchNormal);
        scratchNormal.toArray(decodedArray, i2 * 3);
      }
      return {
        type: GL$1.FLOAT,
        size: 2,
        value: decodedArray
      };
    }
    return {
      type: GL$1.FLOAT,
      size: 2,
      value: normals
    };
  }
  function normalize3DTilePositionAttribute(tile, positions, options) {
    if (!tile.isQuantized) {
      return positions;
    }
    if (options["3d-tiles"] && options["3d-tiles"].decodeQuantizedPositions) {
      tile.isQuantized = false;
      return decodeQuantizedPositions(tile, positions);
    }
    return {
      type: GL$1.UNSIGNED_SHORT,
      value: positions,
      size: 3,
      normalized: true
    };
  }
  function decodeQuantizedPositions(tile, positions) {
    const scratchPosition2 = new Vector3();
    const decodedArray = new Float32Array(tile.pointCount * 3);
    for (let i2 = 0; i2 < tile.pointCount; i2++) {
      scratchPosition2.set(positions[i2 * 3], positions[i2 * 3 + 1], positions[i2 * 3 + 2]).scale(1 / tile.quantizedRange).multiply(tile.quantizedVolumeScale).add(tile.quantizedVolumeOffset).toArray(decodedArray, i2 * 3);
    }
    return decodedArray;
  }
  async function parsePointCloud3DTile(tile, arrayBuffer, byteOffset, options, context) {
    byteOffset = parse3DTileHeaderSync(tile, arrayBuffer, byteOffset);
    byteOffset = parse3DTileTablesHeaderSync(tile, arrayBuffer, byteOffset);
    byteOffset = parse3DTileTablesSync(tile, arrayBuffer, byteOffset);
    initializeTile(tile);
    const {
      featureTable,
      batchTable
    } = parsePointCloudTables(tile);
    await parseDraco(tile, featureTable, batchTable, options, context);
    parsePositions(tile, featureTable, options);
    parseColors(tile, featureTable, batchTable);
    parseNormals(tile, featureTable);
    return byteOffset;
  }
  function initializeTile(tile) {
    tile.attributes = {
      positions: null,
      colors: null,
      normals: null,
      batchIds: null
    };
    tile.isQuantized = false;
    tile.isTranslucent = false;
    tile.isRGB565 = false;
    tile.isOctEncoded16P = false;
  }
  function parsePointCloudTables(tile) {
    const featureTable = new Tile3DFeatureTable(tile.featureTableJson, tile.featureTableBinary);
    const pointsLength = featureTable.getGlobalProperty("POINTS_LENGTH");
    if (!Number.isFinite(pointsLength)) {
      throw new Error("POINTS_LENGTH must be defined");
    }
    featureTable.featuresLength = pointsLength;
    tile.featuresLength = pointsLength;
    tile.pointsLength = pointsLength;
    tile.pointCount = pointsLength;
    tile.rtcCenter = featureTable.getGlobalProperty("RTC_CENTER", GL$1.FLOAT, 3);
    const batchTable = parseBatchIds(tile, featureTable);
    return {
      featureTable,
      batchTable
    };
  }
  function parsePositions(tile, featureTable, options) {
    tile.attributes = tile.attributes || {
      positions: null,
      colors: null,
      normals: null,
      batchIds: null
    };
    if (!tile.attributes.positions) {
      if (featureTable.hasProperty("POSITION")) {
        tile.attributes.positions = featureTable.getPropertyArray("POSITION", GL$1.FLOAT, 3);
      } else if (featureTable.hasProperty("POSITION_QUANTIZED")) {
        const positions = featureTable.getPropertyArray("POSITION_QUANTIZED", GL$1.UNSIGNED_SHORT, 3);
        tile.isQuantized = true;
        tile.quantizedRange = (1 << 16) - 1;
        tile.quantizedVolumeScale = featureTable.getGlobalProperty("QUANTIZED_VOLUME_SCALE", GL$1.FLOAT, 3);
        if (!tile.quantizedVolumeScale) {
          throw new Error("QUANTIZED_VOLUME_SCALE must be defined for quantized positions.");
        }
        tile.quantizedVolumeOffset = featureTable.getGlobalProperty("QUANTIZED_VOLUME_OFFSET", GL$1.FLOAT, 3);
        if (!tile.quantizedVolumeOffset) {
          throw new Error("QUANTIZED_VOLUME_OFFSET must be defined for quantized positions.");
        }
        tile.attributes.positions = normalize3DTilePositionAttribute(tile, positions, options);
      }
    }
    if (!tile.attributes.positions) {
      throw new Error("Either POSITION or POSITION_QUANTIZED must be defined.");
    }
  }
  function parseColors(tile, featureTable, batchTable) {
    tile.attributes = tile.attributes || {
      positions: null,
      colors: null,
      normals: null,
      batchIds: null
    };
    if (!tile.attributes.colors) {
      let colors = null;
      if (featureTable.hasProperty("RGBA")) {
        colors = featureTable.getPropertyArray("RGBA", GL$1.UNSIGNED_BYTE, 4);
        tile.isTranslucent = true;
      } else if (featureTable.hasProperty("RGB")) {
        colors = featureTable.getPropertyArray("RGB", GL$1.UNSIGNED_BYTE, 3);
      } else if (featureTable.hasProperty("RGB565")) {
        colors = featureTable.getPropertyArray("RGB565", GL$1.UNSIGNED_SHORT, 1);
        tile.isRGB565 = true;
      }
      tile.attributes.colors = normalize3DTileColorAttribute(tile, colors, batchTable);
    }
    if (featureTable.hasProperty("CONSTANT_RGBA")) {
      tile.constantRGBA = featureTable.getGlobalProperty("CONSTANT_RGBA", GL$1.UNSIGNED_BYTE, 4);
    }
  }
  function parseNormals(tile, featureTable) {
    tile.attributes = tile.attributes || {
      positions: null,
      colors: null,
      normals: null,
      batchIds: null
    };
    if (!tile.attributes.normals) {
      let normals = null;
      if (featureTable.hasProperty("NORMAL")) {
        normals = featureTable.getPropertyArray("NORMAL", GL$1.FLOAT, 3);
      } else if (featureTable.hasProperty("NORMAL_OCT16P")) {
        normals = featureTable.getPropertyArray("NORMAL_OCT16P", GL$1.UNSIGNED_BYTE, 2);
        tile.isOctEncoded16P = true;
      }
      tile.attributes.normals = normalize3DTileNormalAttribute(tile, normals);
    }
  }
  function parseBatchIds(tile, featureTable) {
    let batchTable = null;
    if (!tile.batchIds && featureTable.hasProperty("BATCH_ID")) {
      tile.batchIds = featureTable.getPropertyArray("BATCH_ID", GL$1.UNSIGNED_SHORT, 1);
      if (tile.batchIds) {
        const batchFeatureLength = featureTable.getGlobalProperty("BATCH_LENGTH");
        if (!batchFeatureLength) {
          throw new Error("Global property: BATCH_LENGTH must be defined when BATCH_ID is defined.");
        }
        const {
          batchTableJson,
          batchTableBinary
        } = tile;
        batchTable = new Tile3DBatchTableParser(batchTableJson, batchTableBinary, batchFeatureLength);
      }
    }
    return batchTable;
  }
  async function parseDraco(tile, featureTable, batchTable, options, context) {
    let dracoBuffer;
    let dracoFeatureTableProperties;
    let dracoBatchTableProperties;
    const batchTableDraco = tile.batchTableJson && tile.batchTableJson.extensions && tile.batchTableJson.extensions["3DTILES_draco_point_compression"];
    if (batchTableDraco) {
      dracoBatchTableProperties = batchTableDraco.properties;
    }
    const featureTableDraco = featureTable.getExtension("3DTILES_draco_point_compression");
    if (featureTableDraco) {
      dracoFeatureTableProperties = featureTableDraco.properties;
      const dracoByteOffset = featureTableDraco.byteOffset;
      const dracoByteLength = featureTableDraco.byteLength;
      if (!dracoFeatureTableProperties || !Number.isFinite(dracoByteOffset) || !dracoByteLength) {
        throw new Error("Draco properties, byteOffset, and byteLength must be defined");
      }
      dracoBuffer = (tile.featureTableBinary || []).slice(dracoByteOffset, dracoByteOffset + dracoByteLength);
      tile.hasPositions = Number.isFinite(dracoFeatureTableProperties.POSITION);
      tile.hasColors = Number.isFinite(dracoFeatureTableProperties.RGB) || Number.isFinite(dracoFeatureTableProperties.RGBA);
      tile.hasNormals = Number.isFinite(dracoFeatureTableProperties.NORMAL);
      tile.hasBatchIds = Number.isFinite(dracoFeatureTableProperties.BATCH_ID);
      tile.isTranslucent = Number.isFinite(dracoFeatureTableProperties.RGBA);
    }
    if (!dracoBuffer) {
      return true;
    }
    const dracoData = {
      buffer: dracoBuffer,
      properties: {
        ...dracoFeatureTableProperties,
        ...dracoBatchTableProperties
      },
      featureTableProperties: dracoFeatureTableProperties,
      batchTableProperties: dracoBatchTableProperties,
      dequantizeInShader: false
    };
    return await loadDraco(tile, dracoData, options, context);
  }
  async function loadDraco(tile, dracoData, options, context) {
    if (!context) {
      return;
    }
    const dracoOptions = {
      ...options,
      draco: {
        ...options === null || options === void 0 ? void 0 : options.draco,
        extraAttributes: dracoData.batchTableProperties || {}
      }
    };
    delete dracoOptions["3d-tiles"];
    const data = await parseFromContext(dracoData.buffer, DracoLoader, dracoOptions, context);
    const decodedPositions = data.attributes.POSITION && data.attributes.POSITION.value;
    const decodedColors = data.attributes.COLOR_0 && data.attributes.COLOR_0.value;
    const decodedNormals = data.attributes.NORMAL && data.attributes.NORMAL.value;
    const decodedBatchIds = data.attributes.BATCH_ID && data.attributes.BATCH_ID.value;
    const isQuantizedDraco = decodedPositions && data.attributes.POSITION.value.quantization;
    const isOctEncodedDraco = decodedNormals && data.attributes.NORMAL.value.quantization;
    if (isQuantizedDraco) {
      const quantization = data.POSITION.data.quantization;
      const range = quantization.range;
      tile.quantizedVolumeScale = new Vector3(range, range, range);
      tile.quantizedVolumeOffset = new Vector3(quantization.minValues);
      tile.quantizedRange = (1 << quantization.quantizationBits) - 1;
      tile.isQuantizedDraco = true;
    }
    if (isOctEncodedDraco) {
      tile.octEncodedRange = (1 << data.NORMAL.data.quantization.quantizationBits) - 1;
      tile.isOctEncodedDraco = true;
    }
    const batchTableAttributes = {};
    if (dracoData.batchTableProperties) {
      for (const attributeName of Object.keys(dracoData.batchTableProperties)) {
        if (data.attributes[attributeName] && data.attributes[attributeName].value) {
          batchTableAttributes[attributeName.toLowerCase()] = data.attributes[attributeName].value;
        }
      }
    }
    tile.attributes = {
      positions: decodedPositions,
      colors: normalize3DTileColorAttribute(tile, decodedColors, void 0),
      normals: decodedNormals,
      batchIds: decodedBatchIds,
      ...batchTableAttributes
    };
  }
  const VERSION$3 = "4.1.1";
  var _globalThis$loaders;
  const parseImageNode = (_globalThis$loaders = globalThis.loaders) === null || _globalThis$loaders === void 0 ? void 0 : _globalThis$loaders.parseImageNode;
  const IMAGE_SUPPORTED = typeof Image !== "undefined";
  const IMAGE_BITMAP_SUPPORTED = typeof ImageBitmap !== "undefined";
  const NODE_IMAGE_SUPPORTED = Boolean(parseImageNode);
  const DATA_SUPPORTED = isBrowser$2 ? true : NODE_IMAGE_SUPPORTED;
  function isImageTypeSupported(type) {
    switch (type) {
      case "auto":
        return IMAGE_BITMAP_SUPPORTED || IMAGE_SUPPORTED || DATA_SUPPORTED;
      case "imagebitmap":
        return IMAGE_BITMAP_SUPPORTED;
      case "image":
        return IMAGE_SUPPORTED;
      case "data":
        return DATA_SUPPORTED;
      default:
        throw new Error(`@loaders.gl/images: image ${type} not supported in this environment`);
    }
  }
  function getDefaultImageType() {
    if (IMAGE_BITMAP_SUPPORTED) {
      return "imagebitmap";
    }
    if (IMAGE_SUPPORTED) {
      return "image";
    }
    if (DATA_SUPPORTED) {
      return "data";
    }
    throw new Error("Install '@loaders.gl/polyfills' to parse images under Node.js");
  }
  function getImageType(image) {
    const format = getImageTypeOrNull(image);
    if (!format) {
      throw new Error("Not an image");
    }
    return format;
  }
  function getImageData(image) {
    switch (getImageType(image)) {
      case "data":
        return image;
      case "image":
      case "imagebitmap":
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("getImageData");
        }
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
        return context.getImageData(0, 0, image.width, image.height);
      default:
        throw new Error("getImageData");
    }
  }
  function getImageTypeOrNull(image) {
    if (typeof ImageBitmap !== "undefined" && image instanceof ImageBitmap) {
      return "imagebitmap";
    }
    if (typeof Image !== "undefined" && image instanceof Image) {
      return "image";
    }
    if (image && typeof image === "object" && image.data && image.width && image.height) {
      return "data";
    }
    return null;
  }
  const SVG_DATA_URL_PATTERN = /^data:image\/svg\+xml/;
  const SVG_URL_PATTERN = /\.svg((\?|#).*)?$/;
  function isSVG(url) {
    return url && (SVG_DATA_URL_PATTERN.test(url) || SVG_URL_PATTERN.test(url));
  }
  function getBlobOrSVGDataUrl(arrayBuffer, url) {
    if (isSVG(url)) {
      const textDecoder = new TextDecoder();
      let xmlText = textDecoder.decode(arrayBuffer);
      try {
        if (typeof unescape === "function" && typeof encodeURIComponent === "function") {
          xmlText = unescape(encodeURIComponent(xmlText));
        }
      } catch (error) {
        throw new Error(error.message);
      }
      const src = `data:image/svg+xml;base64,${btoa(xmlText)}`;
      return src;
    }
    return getBlob(arrayBuffer, url);
  }
  function getBlob(arrayBuffer, url) {
    if (isSVG(url)) {
      throw new Error("SVG cannot be parsed directly to imagebitmap");
    }
    return new Blob([new Uint8Array(arrayBuffer)]);
  }
  async function parseToImage(arrayBuffer, options, url) {
    const blobOrDataUrl = getBlobOrSVGDataUrl(arrayBuffer, url);
    const URL2 = self.URL || self.webkitURL;
    const objectUrl = typeof blobOrDataUrl !== "string" && URL2.createObjectURL(blobOrDataUrl);
    try {
      return await loadToImage(objectUrl || blobOrDataUrl, options);
    } finally {
      if (objectUrl) {
        URL2.revokeObjectURL(objectUrl);
      }
    }
  }
  async function loadToImage(url, options) {
    const image = new Image();
    image.src = url;
    if (options.image && options.image.decode && image.decode) {
      await image.decode();
      return image;
    }
    return await new Promise((resolve2, reject) => {
      try {
        image.onload = () => resolve2(image);
        image.onerror = (error) => {
          const message = error instanceof Error ? error.message : "error";
          reject(new Error(message));
        };
      } catch (error) {
        reject(error);
      }
    });
  }
  const EMPTY_OBJECT = {};
  let imagebitmapOptionsSupported = true;
  async function parseToImageBitmap(arrayBuffer, options, url) {
    let blob;
    if (isSVG(url)) {
      const image = await parseToImage(arrayBuffer, options, url);
      blob = image;
    } else {
      blob = getBlob(arrayBuffer, url);
    }
    const imagebitmapOptions = options && options.imagebitmap;
    return await safeCreateImageBitmap(blob, imagebitmapOptions);
  }
  async function safeCreateImageBitmap(blob) {
    let imagebitmapOptions = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
    if (isEmptyObject(imagebitmapOptions) || !imagebitmapOptionsSupported) {
      imagebitmapOptions = null;
    }
    if (imagebitmapOptions) {
      try {
        return await createImageBitmap(blob, imagebitmapOptions);
      } catch (error) {
        console.warn(error);
        imagebitmapOptionsSupported = false;
      }
    }
    return await createImageBitmap(blob);
  }
  function isEmptyObject(object) {
    for (const key in object || EMPTY_OBJECT) {
      return false;
    }
    return true;
  }
  function getISOBMFFMediaType(buffer) {
    if (!checkString(buffer, "ftyp", 4)) {
      return null;
    }
    if ((buffer[8] & 96) === 0) {
      return null;
    }
    return decodeMajorBrand(buffer);
  }
  function decodeMajorBrand(buffer) {
    const brandMajor = getUTF8String(buffer, 8, 12).replace("\0", " ").trim();
    switch (brandMajor) {
      case "avif":
      case "avis":
        return {
          extension: "avif",
          mimeType: "image/avif"
        };
      default:
        return null;
    }
  }
  function getUTF8String(array, start, end) {
    return String.fromCharCode(...array.slice(start, end));
  }
  function stringToBytes(string) {
    return [...string].map((character) => character.charCodeAt(0));
  }
  function checkString(buffer, header) {
    let offset = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
    const headerBytes = stringToBytes(header);
    for (let i2 = 0; i2 < headerBytes.length; ++i2) {
      if (headerBytes[i2] !== buffer[i2 + offset]) {
        return false;
      }
    }
    return true;
  }
  const BIG_ENDIAN = false;
  const LITTLE_ENDIAN$1 = true;
  function getBinaryImageMetadata(binaryData) {
    const dataView = toDataView(binaryData);
    return getPngMetadata(dataView) || getJpegMetadata(dataView) || getGifMetadata(dataView) || getBmpMetadata(dataView) || getISOBMFFMetadata(dataView);
  }
  function getISOBMFFMetadata(binaryData) {
    const buffer = new Uint8Array(binaryData instanceof DataView ? binaryData.buffer : binaryData);
    const mediaType = getISOBMFFMediaType(buffer);
    if (!mediaType) {
      return null;
    }
    return {
      mimeType: mediaType.mimeType,
      width: 0,
      height: 0
    };
  }
  function getPngMetadata(binaryData) {
    const dataView = toDataView(binaryData);
    const isPng = dataView.byteLength >= 24 && dataView.getUint32(0, BIG_ENDIAN) === 2303741511;
    if (!isPng) {
      return null;
    }
    return {
      mimeType: "image/png",
      width: dataView.getUint32(16, BIG_ENDIAN),
      height: dataView.getUint32(20, BIG_ENDIAN)
    };
  }
  function getGifMetadata(binaryData) {
    const dataView = toDataView(binaryData);
    const isGif = dataView.byteLength >= 10 && dataView.getUint32(0, BIG_ENDIAN) === 1195984440;
    if (!isGif) {
      return null;
    }
    return {
      mimeType: "image/gif",
      width: dataView.getUint16(6, LITTLE_ENDIAN$1),
      height: dataView.getUint16(8, LITTLE_ENDIAN$1)
    };
  }
  function getBmpMetadata(binaryData) {
    const dataView = toDataView(binaryData);
    const isBmp = dataView.byteLength >= 14 && dataView.getUint16(0, BIG_ENDIAN) === 16973 && dataView.getUint32(2, LITTLE_ENDIAN$1) === dataView.byteLength;
    if (!isBmp) {
      return null;
    }
    return {
      mimeType: "image/bmp",
      width: dataView.getUint32(18, LITTLE_ENDIAN$1),
      height: dataView.getUint32(22, LITTLE_ENDIAN$1)
    };
  }
  function getJpegMetadata(binaryData) {
    const dataView = toDataView(binaryData);
    const isJpeg = dataView.byteLength >= 3 && dataView.getUint16(0, BIG_ENDIAN) === 65496 && dataView.getUint8(2) === 255;
    if (!isJpeg) {
      return null;
    }
    const {
      tableMarkers,
      sofMarkers
    } = getJpegMarkers();
    let i2 = 2;
    while (i2 + 9 < dataView.byteLength) {
      const marker2 = dataView.getUint16(i2, BIG_ENDIAN);
      if (sofMarkers.has(marker2)) {
        return {
          mimeType: "image/jpeg",
          height: dataView.getUint16(i2 + 5, BIG_ENDIAN),
          width: dataView.getUint16(i2 + 7, BIG_ENDIAN)
        };
      }
      if (!tableMarkers.has(marker2)) {
        return null;
      }
      i2 += 2;
      i2 += dataView.getUint16(i2, BIG_ENDIAN);
    }
    return null;
  }
  function getJpegMarkers() {
    const tableMarkers = /* @__PURE__ */ new Set([65499, 65476, 65484, 65501, 65534]);
    for (let i2 = 65504; i2 < 65520; ++i2) {
      tableMarkers.add(i2);
    }
    const sofMarkers = /* @__PURE__ */ new Set([65472, 65473, 65474, 65475, 65477, 65478, 65479, 65481, 65482, 65483, 65485, 65486, 65487, 65502]);
    return {
      tableMarkers,
      sofMarkers
    };
  }
  function toDataView(data) {
    if (data instanceof DataView) {
      return data;
    }
    if (ArrayBuffer.isView(data)) {
      return new DataView(data.buffer);
    }
    if (data instanceof ArrayBuffer) {
      return new DataView(data);
    }
    throw new Error("toDataView");
  }
  async function parseToNodeImage(arrayBuffer, options) {
    var _globalThis$loaders2;
    const {
      mimeType
    } = getBinaryImageMetadata(arrayBuffer) || {};
    const parseImageNode2 = (_globalThis$loaders2 = globalThis.loaders) === null || _globalThis$loaders2 === void 0 ? void 0 : _globalThis$loaders2.parseImageNode;
    assert$6(parseImageNode2);
    return await parseImageNode2(arrayBuffer, mimeType);
  }
  async function parseImage(arrayBuffer, options, context) {
    options = options || {};
    const imageOptions = options.image || {};
    const imageType = imageOptions.type || "auto";
    const {
      url
    } = context || {};
    const loadType = getLoadableImageType(imageType);
    let image;
    switch (loadType) {
      case "imagebitmap":
        image = await parseToImageBitmap(arrayBuffer, options, url);
        break;
      case "image":
        image = await parseToImage(arrayBuffer, options, url);
        break;
      case "data":
        image = await parseToNodeImage(arrayBuffer);
        break;
      default:
        assert$6(false);
    }
    if (imageType === "data") {
      image = getImageData(image);
    }
    return image;
  }
  function getLoadableImageType(type) {
    switch (type) {
      case "auto":
      case "data":
        return getDefaultImageType();
      default:
        isImageTypeSupported(type);
        return type;
    }
  }
  const EXTENSIONS$1 = ["png", "jpg", "jpeg", "gif", "webp", "bmp", "ico", "svg", "avif"];
  const MIME_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp", "image/avif", "image/bmp", "image/vnd.microsoft.icon", "image/svg+xml"];
  const DEFAULT_IMAGE_LOADER_OPTIONS = {
    image: {
      type: "auto",
      decode: true
    }
  };
  const ImageLoader = {
    id: "image",
    module: "images",
    name: "Images",
    version: VERSION$3,
    mimeTypes: MIME_TYPES,
    extensions: EXTENSIONS$1,
    parse: parseImage,
    tests: [(arrayBuffer) => Boolean(getBinaryImageMetadata(new DataView(arrayBuffer)))],
    options: DEFAULT_IMAGE_LOADER_OPTIONS
  };
  const mimeTypeSupportedSync = {};
  function isImageFormatSupported(mimeType) {
    if (mimeTypeSupportedSync[mimeType] === void 0) {
      const supported = isBrowser$2 ? checkBrowserImageFormatSupport(mimeType) : checkNodeImageFormatSupport(mimeType);
      mimeTypeSupportedSync[mimeType] = supported;
    }
    return mimeTypeSupportedSync[mimeType];
  }
  function checkNodeImageFormatSupport(mimeType) {
    var _globalThis$loaders2, _globalThis$loaders22;
    const NODE_FORMAT_SUPPORT = ["image/png", "image/jpeg", "image/gif"];
    const imageFormatsNode = ((_globalThis$loaders2 = globalThis.loaders) === null || _globalThis$loaders2 === void 0 ? void 0 : _globalThis$loaders2.imageFormatsNode) || NODE_FORMAT_SUPPORT;
    const parseImageNode2 = (_globalThis$loaders22 = globalThis.loaders) === null || _globalThis$loaders22 === void 0 ? void 0 : _globalThis$loaders22.parseImageNode;
    return Boolean(parseImageNode2) && imageFormatsNode.includes(mimeType);
  }
  function checkBrowserImageFormatSupport(mimeType) {
    switch (mimeType) {
      case "image/avif":
      case "image/webp":
        return testBrowserImageFormatSupport(mimeType);
      default:
        return true;
    }
  }
  function testBrowserImageFormatSupport(mimeType) {
    try {
      const element = document.createElement("canvas");
      const dataURL = element.toDataURL(mimeType);
      return dataURL.indexOf(`data:${mimeType}`) === 0;
    } catch {
      return false;
    }
  }
  function assert$1(condition, message) {
    if (!condition) {
      throw new Error(message || "assert failed: gltf");
    }
  }
  const COMPONENTS$1 = {
    SCALAR: 1,
    VEC2: 2,
    VEC3: 3,
    VEC4: 4,
    MAT2: 4,
    MAT3: 9,
    MAT4: 16
  };
  const BYTES$1 = {
    5120: 1,
    5121: 1,
    5122: 2,
    5123: 2,
    5125: 4,
    5126: 4
  };
  const MIPMAP_FACTOR = 1.33;
  const TYPES = ["SCALAR", "VEC2", "VEC3", "VEC4"];
  const ARRAY_CONSTRUCTOR_TO_WEBGL_CONSTANT = [[Int8Array, 5120], [Uint8Array, 5121], [Int16Array, 5122], [Uint16Array, 5123], [Uint32Array, 5125], [Float32Array, 5126], [Float64Array, 5130]];
  const ARRAY_TO_COMPONENT_TYPE = new Map(ARRAY_CONSTRUCTOR_TO_WEBGL_CONSTANT);
  const ATTRIBUTE_TYPE_TO_COMPONENTS$1 = {
    SCALAR: 1,
    VEC2: 2,
    VEC3: 3,
    VEC4: 4,
    MAT2: 4,
    MAT3: 9,
    MAT4: 16
  };
  const ATTRIBUTE_COMPONENT_TYPE_TO_BYTE_SIZE$1 = {
    5120: 1,
    5121: 1,
    5122: 2,
    5123: 2,
    5125: 4,
    5126: 4
  };
  const ATTRIBUTE_COMPONENT_TYPE_TO_ARRAY$1 = {
    5120: Int8Array,
    5121: Uint8Array,
    5122: Int16Array,
    5123: Uint16Array,
    5125: Uint32Array,
    5126: Float32Array
  };
  function getAccessorTypeFromSize(size) {
    const type = TYPES[size - 1];
    return type || TYPES[0];
  }
  function getComponentTypeFromArray(typedArray) {
    const componentType = ARRAY_TO_COMPONENT_TYPE.get(typedArray.constructor);
    if (!componentType) {
      throw new Error("Illegal typed array");
    }
    return componentType;
  }
  function getAccessorArrayTypeAndLength(accessor, bufferView) {
    const ArrayType = ATTRIBUTE_COMPONENT_TYPE_TO_ARRAY$1[accessor.componentType];
    const components = ATTRIBUTE_TYPE_TO_COMPONENTS$1[accessor.type];
    const bytesPerComponent = ATTRIBUTE_COMPONENT_TYPE_TO_BYTE_SIZE$1[accessor.componentType];
    const length2 = accessor.count * components;
    const byteLength = accessor.count * components * bytesPerComponent;
    assert$1(byteLength >= 0 && byteLength <= bufferView.byteLength);
    const componentByteSize = BYTES$1[accessor.componentType];
    const numberOfComponentsInElement = COMPONENTS$1[accessor.type];
    return {
      ArrayType,
      length: length2,
      byteLength,
      componentByteSize,
      numberOfComponentsInElement
    };
  }
  function getMemoryUsageGLTF(gltf) {
    let {
      images,
      bufferViews
    } = gltf;
    images = images || [];
    bufferViews = bufferViews || [];
    const imageBufferViews = images.map((i2) => i2.bufferView);
    bufferViews = bufferViews.filter((view) => !imageBufferViews.includes(view));
    const bufferMemory = bufferViews.reduce((acc, view) => acc + view.byteLength, 0);
    const pixelCount = images.reduce((acc, image) => {
      const {
        width,
        height
      } = image.image;
      return acc + width * height;
    }, 0);
    return bufferMemory + Math.ceil(4 * pixelCount * MIPMAP_FACTOR);
  }
  function getTypedArrayForBufferView(json, buffers, bufferViewIndex) {
    const bufferView = json.bufferViews[bufferViewIndex];
    assert$1(bufferView);
    const bufferIndex = bufferView.buffer;
    const binChunk = buffers[bufferIndex];
    assert$1(binChunk);
    const byteOffset = (bufferView.byteOffset || 0) + binChunk.byteOffset;
    return new Uint8Array(binChunk.arrayBuffer, byteOffset, bufferView.byteLength);
  }
  function getTypedArrayForAccessor(json, buffers, accessor) {
    var _json$accessors, _json$bufferViews;
    const gltfAccessor = typeof accessor === "number" ? (_json$accessors = json.accessors) === null || _json$accessors === void 0 ? void 0 : _json$accessors[accessor] : accessor;
    if (!gltfAccessor) {
      throw new Error(`No gltf accessor ${JSON.stringify(accessor)}`);
    }
    const bufferView = (_json$bufferViews = json.bufferViews) === null || _json$bufferViews === void 0 ? void 0 : _json$bufferViews[gltfAccessor.bufferView || 0];
    if (!bufferView) {
      throw new Error(`No gltf buffer view for accessor ${bufferView}`);
    }
    const {
      arrayBuffer,
      byteOffset: bufferByteOffset
    } = buffers[bufferView.buffer];
    const byteOffset = (bufferByteOffset || 0) + (gltfAccessor.byteOffset || 0) + (bufferView.byteOffset || 0);
    const {
      ArrayType,
      length: length2,
      componentByteSize,
      numberOfComponentsInElement
    } = getAccessorArrayTypeAndLength(gltfAccessor, bufferView);
    const elementByteSize = componentByteSize * numberOfComponentsInElement;
    const elementAddressScale = bufferView.byteStride || elementByteSize;
    if (typeof bufferView.byteStride === "undefined" || bufferView.byteStride === elementByteSize) {
      const result2 = new ArrayType(arrayBuffer, byteOffset, length2);
      return result2;
    }
    const result = new ArrayType(length2);
    for (let i2 = 0; i2 < gltfAccessor.count; i2++) {
      const values = new ArrayType(arrayBuffer, byteOffset + i2 * elementAddressScale, numberOfComponentsInElement);
      result.set(values, i2 * numberOfComponentsInElement);
    }
    return result;
  }
  function makeDefaultGLTFJson() {
    return {
      asset: {
        version: "2.0",
        generator: "loaders.gl"
      },
      buffers: [],
      extensions: {},
      extensionsRequired: [],
      extensionsUsed: []
    };
  }
  class GLTFScenegraph {
    constructor(gltf) {
      this.gltf = void 0;
      this.sourceBuffers = void 0;
      this.byteLength = void 0;
      this.gltf = {
        json: (gltf === null || gltf === void 0 ? void 0 : gltf.json) || makeDefaultGLTFJson(),
        buffers: (gltf === null || gltf === void 0 ? void 0 : gltf.buffers) || [],
        images: (gltf === null || gltf === void 0 ? void 0 : gltf.images) || []
      };
      this.sourceBuffers = [];
      this.byteLength = 0;
      if (this.gltf.buffers && this.gltf.buffers[0]) {
        this.byteLength = this.gltf.buffers[0].byteLength;
        this.sourceBuffers = [this.gltf.buffers[0]];
      }
    }
    get json() {
      return this.gltf.json;
    }
    getApplicationData(key) {
      const data = this.json[key];
      return data;
    }
    getExtraData(key) {
      const extras = this.json.extras || {};
      return extras[key];
    }
    hasExtension(extensionName) {
      const isUsedExtension = this.getUsedExtensions().find((name2) => name2 === extensionName);
      const isRequiredExtension = this.getRequiredExtensions().find((name2) => name2 === extensionName);
      return typeof isUsedExtension === "string" || typeof isRequiredExtension === "string";
    }
    getExtension(extensionName) {
      const isExtension = this.getUsedExtensions().find((name2) => name2 === extensionName);
      const extensions = this.json.extensions || {};
      return isExtension ? extensions[extensionName] : null;
    }
    getRequiredExtension(extensionName) {
      const isRequired = this.getRequiredExtensions().find((name2) => name2 === extensionName);
      return isRequired ? this.getExtension(extensionName) : null;
    }
    getRequiredExtensions() {
      return this.json.extensionsRequired || [];
    }
    getUsedExtensions() {
      return this.json.extensionsUsed || [];
    }
    getRemovedExtensions() {
      return this.json.extensionsRemoved || [];
    }
    getObjectExtension(object, extensionName) {
      const extensions = object.extensions || {};
      return extensions[extensionName];
    }
    getScene(index) {
      return this.getObject("scenes", index);
    }
    getNode(index) {
      return this.getObject("nodes", index);
    }
    getSkin(index) {
      return this.getObject("skins", index);
    }
    getMesh(index) {
      return this.getObject("meshes", index);
    }
    getMaterial(index) {
      return this.getObject("materials", index);
    }
    getAccessor(index) {
      return this.getObject("accessors", index);
    }
    getTexture(index) {
      return this.getObject("textures", index);
    }
    getSampler(index) {
      return this.getObject("samplers", index);
    }
    getImage(index) {
      return this.getObject("images", index);
    }
    getBufferView(index) {
      return this.getObject("bufferViews", index);
    }
    getBuffer(index) {
      return this.getObject("buffers", index);
    }
    getObject(array, index) {
      if (typeof index === "object") {
        return index;
      }
      const object = this.json[array] && this.json[array][index];
      if (!object) {
        throw new Error(`glTF file error: Could not find ${array}[${index}]`);
      }
      return object;
    }
    getTypedArrayForBufferView(bufferView) {
      bufferView = this.getBufferView(bufferView);
      const bufferIndex = bufferView.buffer;
      const binChunk = this.gltf.buffers[bufferIndex];
      assert$1(binChunk);
      const byteOffset = (bufferView.byteOffset || 0) + binChunk.byteOffset;
      return new Uint8Array(binChunk.arrayBuffer, byteOffset, bufferView.byteLength);
    }
    getTypedArrayForAccessor(accessor) {
      const gltfAccessor = this.getAccessor(accessor);
      return getTypedArrayForAccessor(this.gltf.json, this.gltf.buffers, gltfAccessor);
    }
    getTypedArrayForImageData(image) {
      image = this.getAccessor(image);
      const bufferView = this.getBufferView(image.bufferView);
      const buffer = this.getBuffer(bufferView.buffer);
      const arrayBuffer = buffer.data;
      const byteOffset = bufferView.byteOffset || 0;
      return new Uint8Array(arrayBuffer, byteOffset, bufferView.byteLength);
    }
    addApplicationData(key, data) {
      this.json[key] = data;
      return this;
    }
    addExtraData(key, data) {
      this.json.extras = this.json.extras || {};
      this.json.extras[key] = data;
      return this;
    }
    addObjectExtension(object, extensionName, data) {
      object.extensions = object.extensions || {};
      object.extensions[extensionName] = data;
      this.registerUsedExtension(extensionName);
      return this;
    }
    setObjectExtension(object, extensionName, data) {
      const extensions = object.extensions || {};
      extensions[extensionName] = data;
    }
    removeObjectExtension(object, extensionName) {
      const extensions = (object === null || object === void 0 ? void 0 : object.extensions) || {};
      if (extensions[extensionName]) {
        this.json.extensionsRemoved = this.json.extensionsRemoved || [];
        const extensionsRemoved = this.json.extensionsRemoved;
        if (!extensionsRemoved.includes(extensionName)) {
          extensionsRemoved.push(extensionName);
        }
      }
      delete extensions[extensionName];
    }
    addExtension(extensionName) {
      let extensionData = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      assert$1(extensionData);
      this.json.extensions = this.json.extensions || {};
      this.json.extensions[extensionName] = extensionData;
      this.registerUsedExtension(extensionName);
      return extensionData;
    }
    addRequiredExtension(extensionName) {
      let extensionData = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      assert$1(extensionData);
      this.addExtension(extensionName, extensionData);
      this.registerRequiredExtension(extensionName);
      return extensionData;
    }
    registerUsedExtension(extensionName) {
      this.json.extensionsUsed = this.json.extensionsUsed || [];
      if (!this.json.extensionsUsed.find((ext) => ext === extensionName)) {
        this.json.extensionsUsed.push(extensionName);
      }
    }
    registerRequiredExtension(extensionName) {
      this.registerUsedExtension(extensionName);
      this.json.extensionsRequired = this.json.extensionsRequired || [];
      if (!this.json.extensionsRequired.find((ext) => ext === extensionName)) {
        this.json.extensionsRequired.push(extensionName);
      }
    }
    removeExtension(extensionName) {
      var _this$json$extensions;
      if ((_this$json$extensions = this.json.extensions) !== null && _this$json$extensions !== void 0 && _this$json$extensions[extensionName]) {
        this.json.extensionsRemoved = this.json.extensionsRemoved || [];
        const extensionsRemoved = this.json.extensionsRemoved;
        if (!extensionsRemoved.includes(extensionName)) {
          extensionsRemoved.push(extensionName);
        }
      }
      if (this.json.extensions) {
        delete this.json.extensions[extensionName];
      }
      if (this.json.extensionsRequired) {
        this._removeStringFromArray(this.json.extensionsRequired, extensionName);
      }
      if (this.json.extensionsUsed) {
        this._removeStringFromArray(this.json.extensionsUsed, extensionName);
      }
    }
    setDefaultScene(sceneIndex) {
      this.json.scene = sceneIndex;
    }
    addScene(scene) {
      const {
        nodeIndices
      } = scene;
      this.json.scenes = this.json.scenes || [];
      this.json.scenes.push({
        nodes: nodeIndices
      });
      return this.json.scenes.length - 1;
    }
    addNode(node2) {
      const {
        meshIndex,
        matrix
      } = node2;
      this.json.nodes = this.json.nodes || [];
      const nodeData = {
        mesh: meshIndex
      };
      if (matrix) {
        nodeData.matrix = matrix;
      }
      this.json.nodes.push(nodeData);
      return this.json.nodes.length - 1;
    }
    addMesh(mesh) {
      const {
        attributes,
        indices,
        material,
        mode = 4
      } = mesh;
      const accessors = this._addAttributes(attributes);
      const glTFMesh = {
        primitives: [{
          attributes: accessors,
          mode
        }]
      };
      if (indices) {
        const indicesAccessor = this._addIndices(indices);
        glTFMesh.primitives[0].indices = indicesAccessor;
      }
      if (Number.isFinite(material)) {
        glTFMesh.primitives[0].material = material;
      }
      this.json.meshes = this.json.meshes || [];
      this.json.meshes.push(glTFMesh);
      return this.json.meshes.length - 1;
    }
    addPointCloud(attributes) {
      const accessorIndices = this._addAttributes(attributes);
      const glTFMesh = {
        primitives: [{
          attributes: accessorIndices,
          mode: 0
        }]
      };
      this.json.meshes = this.json.meshes || [];
      this.json.meshes.push(glTFMesh);
      return this.json.meshes.length - 1;
    }
    addImage(imageData, mimeTypeOpt) {
      const metadata = getBinaryImageMetadata(imageData);
      const mimeType = mimeTypeOpt || (metadata === null || metadata === void 0 ? void 0 : metadata.mimeType);
      const bufferViewIndex = this.addBufferView(imageData);
      const glTFImage = {
        bufferView: bufferViewIndex,
        mimeType
      };
      this.json.images = this.json.images || [];
      this.json.images.push(glTFImage);
      return this.json.images.length - 1;
    }
    addBufferView(buffer) {
      let bufferIndex = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
      let byteOffset = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : this.byteLength;
      const byteLength = buffer.byteLength;
      assert$1(Number.isFinite(byteLength));
      this.sourceBuffers = this.sourceBuffers || [];
      this.sourceBuffers.push(buffer);
      const glTFBufferView = {
        buffer: bufferIndex,
        byteOffset,
        byteLength
      };
      this.byteLength += padToNBytes(byteLength, 4);
      this.json.bufferViews = this.json.bufferViews || [];
      this.json.bufferViews.push(glTFBufferView);
      return this.json.bufferViews.length - 1;
    }
    addAccessor(bufferViewIndex, accessor) {
      const glTFAccessor = {
        bufferView: bufferViewIndex,
        type: getAccessorTypeFromSize(accessor.size),
        componentType: accessor.componentType,
        count: accessor.count,
        max: accessor.max,
        min: accessor.min
      };
      this.json.accessors = this.json.accessors || [];
      this.json.accessors.push(glTFAccessor);
      return this.json.accessors.length - 1;
    }
    addBinaryBuffer(sourceBuffer) {
      let accessor = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
        size: 3
      };
      const bufferViewIndex = this.addBufferView(sourceBuffer);
      let minMax = {
        min: accessor.min,
        max: accessor.max
      };
      if (!minMax.min || !minMax.max) {
        minMax = this._getAccessorMinMax(sourceBuffer, accessor.size);
      }
      const accessorDefaults = {
        size: accessor.size,
        componentType: getComponentTypeFromArray(sourceBuffer),
        count: Math.round(sourceBuffer.length / accessor.size),
        min: minMax.min,
        max: minMax.max
      };
      return this.addAccessor(bufferViewIndex, Object.assign(accessorDefaults, accessor));
    }
    addTexture(texture) {
      const {
        imageIndex
      } = texture;
      const glTFTexture = {
        source: imageIndex
      };
      this.json.textures = this.json.textures || [];
      this.json.textures.push(glTFTexture);
      return this.json.textures.length - 1;
    }
    addMaterial(pbrMaterialInfo) {
      this.json.materials = this.json.materials || [];
      this.json.materials.push(pbrMaterialInfo);
      return this.json.materials.length - 1;
    }
    createBinaryChunk() {
      var _this$json, _this$json$buffers;
      this.gltf.buffers = [];
      const totalByteLength = this.byteLength;
      const arrayBuffer = new ArrayBuffer(totalByteLength);
      const targetArray = new Uint8Array(arrayBuffer);
      let dstByteOffset = 0;
      for (const sourceBuffer of this.sourceBuffers || []) {
        dstByteOffset = copyToArray(sourceBuffer, targetArray, dstByteOffset);
      }
      if ((_this$json = this.json) !== null && _this$json !== void 0 && (_this$json$buffers = _this$json.buffers) !== null && _this$json$buffers !== void 0 && _this$json$buffers[0]) {
        this.json.buffers[0].byteLength = totalByteLength;
      } else {
        this.json.buffers = [{
          byteLength: totalByteLength
        }];
      }
      this.gltf.binary = arrayBuffer;
      this.sourceBuffers = [arrayBuffer];
    }
    _removeStringFromArray(array, string) {
      let found = true;
      while (found) {
        const index = array.indexOf(string);
        if (index > -1) {
          array.splice(index, 1);
        } else {
          found = false;
        }
      }
    }
    _addAttributes() {
      let attributes = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      const result = {};
      for (const attributeKey in attributes) {
        const attributeData = attributes[attributeKey];
        const attrName = this._getGltfAttributeName(attributeKey);
        const accessor = this.addBinaryBuffer(attributeData.value, attributeData);
        result[attrName] = accessor;
      }
      return result;
    }
    _addIndices(indices) {
      return this.addBinaryBuffer(indices, {
        size: 1
      });
    }
    _getGltfAttributeName(attributeName) {
      switch (attributeName.toLowerCase()) {
        case "position":
        case "positions":
        case "vertices":
          return "POSITION";
        case "normal":
        case "normals":
          return "NORMAL";
        case "color":
        case "colors":
          return "COLOR_0";
        case "texcoord":
        case "texcoords":
          return "TEXCOORD_0";
        default:
          return attributeName;
      }
    }
    _getAccessorMinMax(buffer, size) {
      const result = {
        min: null,
        max: null
      };
      if (buffer.length < size) {
        return result;
      }
      result.min = [];
      result.max = [];
      const initValues = buffer.subarray(0, size);
      for (const value of initValues) {
        result.min.push(value);
        result.max.push(value);
      }
      for (let index = size; index < buffer.length; index += size) {
        for (let componentIndex = 0; componentIndex < size; componentIndex++) {
          result.min[0 + componentIndex] = Math.min(result.min[0 + componentIndex], buffer[index + componentIndex]);
          result.max[0 + componentIndex] = Math.max(result.max[0 + componentIndex], buffer[index + componentIndex]);
        }
      }
      return result;
    }
  }
  function emod(n2) {
    return (n2 % 1 + 1) % 1;
  }
  const ATTRIBUTE_TYPE_TO_COMPONENTS = {
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
  };
  const ATTRIBUTE_COMPONENT_TYPE_TO_ARRAY = {
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
  };
  const ATTRIBUTE_COMPONENT_TYPE_TO_BYTE_SIZE = {
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
  function getArrayElementByteSize(attributeType, componentType) {
    return ATTRIBUTE_COMPONENT_TYPE_TO_BYTE_SIZE[componentType] * ATTRIBUTE_TYPE_TO_COMPONENTS[attributeType];
  }
  function getOffsetsForProperty(scenegraph, bufferViewIndex, offsetType, numberOfElements) {
    if (offsetType !== "UINT8" && offsetType !== "UINT16" && offsetType !== "UINT32" && offsetType !== "UINT64") {
      return null;
    }
    const arrayOffsetsBytes = scenegraph.getTypedArrayForBufferView(bufferViewIndex);
    const arrayOffsets = convertRawBufferToMetadataArray(arrayOffsetsBytes, "SCALAR", offsetType, numberOfElements + 1);
    if (arrayOffsets instanceof BigInt64Array || arrayOffsets instanceof BigUint64Array) {
      return null;
    }
    return arrayOffsets;
  }
  function convertRawBufferToMetadataArray(data, attributeType, componentType) {
    let elementCount = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 1;
    const numberOfComponents = ATTRIBUTE_TYPE_TO_COMPONENTS[attributeType];
    const ArrayType = ATTRIBUTE_COMPONENT_TYPE_TO_ARRAY[componentType];
    const size = ATTRIBUTE_COMPONENT_TYPE_TO_BYTE_SIZE[componentType];
    const length2 = elementCount * numberOfComponents;
    const byteLength = length2 * size;
    let buffer = data.buffer;
    let offset = data.byteOffset;
    if (offset % size !== 0) {
      const bufferArray = new Uint8Array(buffer);
      buffer = bufferArray.slice(offset, offset + byteLength).buffer;
      offset = 0;
    }
    return new ArrayType(buffer, offset, length2);
  }
  function getPrimitiveTextureData(scenegraph, textureInfo, primitive) {
    var _json$textures, _json$textures$textur;
    const texCoordAccessorKey = `TEXCOORD_${textureInfo.texCoord || 0}`;
    const texCoordAccessorIndex = primitive.attributes[texCoordAccessorKey];
    const textureCoordinates = scenegraph.getTypedArrayForAccessor(texCoordAccessorIndex);
    const json = scenegraph.gltf.json;
    const textureIndex = textureInfo.index;
    const imageIndex = (_json$textures = json.textures) === null || _json$textures === void 0 ? void 0 : (_json$textures$textur = _json$textures[textureIndex]) === null || _json$textures$textur === void 0 ? void 0 : _json$textures$textur.source;
    if (typeof imageIndex !== "undefined") {
      var _json$images, _json$images$imageInd, _scenegraph$gltf$imag;
      const mimeType = (_json$images = json.images) === null || _json$images === void 0 ? void 0 : (_json$images$imageInd = _json$images[imageIndex]) === null || _json$images$imageInd === void 0 ? void 0 : _json$images$imageInd.mimeType;
      const parsedImage = (_scenegraph$gltf$imag = scenegraph.gltf.images) === null || _scenegraph$gltf$imag === void 0 ? void 0 : _scenegraph$gltf$imag[imageIndex];
      if (parsedImage && typeof parsedImage.width !== "undefined") {
        const textureData = [];
        for (let index = 0; index < textureCoordinates.length; index += 2) {
          const value = getImageValueByCoordinates(parsedImage, mimeType, textureCoordinates, index, textureInfo.channels);
          textureData.push(value);
        }
        return textureData;
      }
    }
    return [];
  }
  function primitivePropertyDataToAttributes(scenegraph, attributeName, propertyData, featureTable, primitive) {
    if (!(propertyData !== null && propertyData !== void 0 && propertyData.length)) {
      return;
    }
    const featureIndices = [];
    for (const texelData of propertyData) {
      let index = featureTable.findIndex((item) => item === texelData);
      if (index === -1) {
        index = featureTable.push(texelData) - 1;
      }
      featureIndices.push(index);
    }
    const typedArray = new Uint32Array(featureIndices);
    const bufferIndex = scenegraph.gltf.buffers.push({
      arrayBuffer: typedArray.buffer,
      byteOffset: typedArray.byteOffset,
      byteLength: typedArray.byteLength
    }) - 1;
    const bufferViewIndex = scenegraph.addBufferView(typedArray, bufferIndex, 0);
    const accessorIndex = scenegraph.addAccessor(bufferViewIndex, {
      size: 1,
      componentType: getComponentTypeFromArray(typedArray),
      count: typedArray.length
    });
    primitive.attributes[attributeName] = accessorIndex;
  }
  function getImageValueByCoordinates(parsedImage, mimeType, textureCoordinates, index) {
    let channels = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : [0];
    const CHANNELS_MAP = {
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
    };
    const u = textureCoordinates[index];
    const v = textureCoordinates[index + 1];
    let components = 1;
    if (mimeType && (mimeType.indexOf("image/jpeg") !== -1 || mimeType.indexOf("image/png") !== -1))
      components = 4;
    const offset = coordinatesToOffset(u, v, parsedImage, components);
    let value = 0;
    for (const c of channels) {
      const map2 = typeof c === "number" ? Object.values(CHANNELS_MAP)[c] : CHANNELS_MAP[c];
      const imageOffset = offset + map2.offset;
      const imageData = getImageData(parsedImage);
      if (imageData.data.length <= imageOffset) {
        throw new Error(`${imageData.data.length} <= ${imageOffset}`);
      }
      const imageValue = imageData.data[imageOffset];
      value |= imageValue << map2.shift;
    }
    return value;
  }
  function coordinatesToOffset(u, v, parsedImage) {
    let componentsCount = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 1;
    const w = parsedImage.width;
    const iX = emod(u) * (w - 1);
    const indX = Math.round(iX);
    const h = parsedImage.height;
    const iY = emod(v) * (h - 1);
    const indY = Math.round(iY);
    const components = parsedImage.components ? parsedImage.components : componentsCount;
    const offset = (indY * w + indX) * components;
    return offset;
  }
  function parseVariableLengthArrayNumeric(valuesData, numberOfElements, arrayOffsets, valuesDataBytesLength, valueSize) {
    const attributeValueArray = [];
    for (let index = 0; index < numberOfElements; index++) {
      const arrayOffset = arrayOffsets[index];
      const arrayByteSize = arrayOffsets[index + 1] - arrayOffsets[index];
      if (arrayByteSize + arrayOffset > valuesDataBytesLength) {
        break;
      }
      const typedArrayOffset = arrayOffset / valueSize;
      const elementCount = arrayByteSize / valueSize;
      attributeValueArray.push(valuesData.slice(typedArrayOffset, typedArrayOffset + elementCount));
    }
    return attributeValueArray;
  }
  function parseFixedLengthArrayNumeric(valuesData, numberOfElements, arrayCount) {
    const attributeValueArray = [];
    for (let index = 0; index < numberOfElements; index++) {
      const elementOffset = index * arrayCount;
      attributeValueArray.push(valuesData.slice(elementOffset, elementOffset + arrayCount));
    }
    return attributeValueArray;
  }
  function getPropertyDataString(numberOfElements, valuesDataBytes, arrayOffsets, stringOffsets) {
    if (arrayOffsets) {
      throw new Error("Not implemented - arrayOffsets for strings is specified");
    }
    if (stringOffsets) {
      const stringsArray = [];
      const textDecoder = new TextDecoder("utf8");
      let stringOffset = 0;
      for (let index = 0; index < numberOfElements; index++) {
        const stringByteSize = stringOffsets[index + 1] - stringOffsets[index];
        if (stringByteSize + stringOffset <= valuesDataBytes.length) {
          const stringData = valuesDataBytes.subarray(stringOffset, stringByteSize + stringOffset);
          const stringAttribute = textDecoder.decode(stringData);
          stringsArray.push(stringAttribute);
          stringOffset += stringByteSize;
        }
      }
      return stringsArray;
    }
    return [];
  }
  const EXT_MESH_FEATURES_NAME = "EXT_mesh_features";
  const name$a = EXT_MESH_FEATURES_NAME;
  async function decode$9(gltfData, options) {
    const scenegraph = new GLTFScenegraph(gltfData);
    decodeExtMeshFeatures(scenegraph, options);
  }
  function decodeExtMeshFeatures(scenegraph, options) {
    const json = scenegraph.gltf.json;
    if (!json.meshes) {
      return;
    }
    for (const mesh of json.meshes) {
      for (const primitive of mesh.primitives) {
        processMeshPrimitiveFeatures(scenegraph, primitive, options);
      }
    }
  }
  function processMeshPrimitiveFeatures(scenegraph, primitive, options) {
    var _options$gltf, _primitive$extensions;
    if (!(options !== null && options !== void 0 && (_options$gltf = options.gltf) !== null && _options$gltf !== void 0 && _options$gltf.loadBuffers)) {
      return;
    }
    const extension = (_primitive$extensions = primitive.extensions) === null || _primitive$extensions === void 0 ? void 0 : _primitive$extensions[EXT_MESH_FEATURES_NAME];
    const featureIds = extension === null || extension === void 0 ? void 0 : extension.featureIds;
    if (!featureIds) {
      return;
    }
    for (const featureId of featureIds) {
      var _options$gltf2;
      let featureIdData;
      if (typeof featureId.attribute !== "undefined") {
        const accessorKey = `_FEATURE_ID_${featureId.attribute}`;
        const accessorIndex = primitive.attributes[accessorKey];
        featureIdData = scenegraph.getTypedArrayForAccessor(accessorIndex);
      } else if (typeof featureId.texture !== "undefined" && options !== null && options !== void 0 && (_options$gltf2 = options.gltf) !== null && _options$gltf2 !== void 0 && _options$gltf2.loadImages) {
        featureIdData = getPrimitiveTextureData(scenegraph, featureId.texture, primitive);
      } else {
        featureIdData = [];
      }
      featureId.data = featureIdData;
    }
  }
  const EXT_mesh_features = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    decode: decode$9,
    name: name$a
  }, Symbol.toStringTag, { value: "Module" }));
  const EXT_STRUCTURAL_METADATA_NAME = "EXT_structural_metadata";
  const name$9 = EXT_STRUCTURAL_METADATA_NAME;
  async function decode$8(gltfData, options) {
    const scenegraph = new GLTFScenegraph(gltfData);
    decodeExtStructuralMetadata(scenegraph, options);
  }
  function decodeExtStructuralMetadata(scenegraph, options) {
    var _options$gltf, _options$gltf2;
    if (!((_options$gltf = options.gltf) !== null && _options$gltf !== void 0 && _options$gltf.loadBuffers)) {
      return;
    }
    const extension = scenegraph.getExtension(EXT_STRUCTURAL_METADATA_NAME);
    if (!extension) {
      return;
    }
    if ((_options$gltf2 = options.gltf) !== null && _options$gltf2 !== void 0 && _options$gltf2.loadImages) {
      decodePropertyTextures$1(scenegraph, extension);
    }
    decodePropertyTables$1(scenegraph, extension);
  }
  function decodePropertyTextures$1(scenegraph, extension) {
    const propertyTextures = extension.propertyTextures;
    const json = scenegraph.gltf.json;
    if (propertyTextures && json.meshes) {
      for (const mesh of json.meshes) {
        for (const primitive of mesh.primitives) {
          processPrimitivePropertyTextures(scenegraph, propertyTextures, primitive, extension);
        }
      }
    }
  }
  function decodePropertyTables$1(scenegraph, extension) {
    const schema = extension.schema;
    if (!schema) {
      return;
    }
    const schemaClasses = schema.classes;
    const propertyTables = extension.propertyTables;
    if (schemaClasses && propertyTables) {
      for (const schemaName in schemaClasses) {
        const propertyTable = findPropertyTableByClass$1(propertyTables, schemaName);
        if (propertyTable) {
          processPropertyTable$1(scenegraph, schema, propertyTable);
        }
      }
    }
  }
  function findPropertyTableByClass$1(propertyTables, schemaClassName) {
    for (const propertyTable of propertyTables) {
      if (propertyTable.class === schemaClassName) {
        return propertyTable;
      }
    }
    return null;
  }
  function processPrimitivePropertyTextures(scenegraph, propertyTextures, primitive, extension) {
    var _primitive$extensions;
    if (!propertyTextures) {
      return;
    }
    const primitiveExtension = (_primitive$extensions = primitive.extensions) === null || _primitive$extensions === void 0 ? void 0 : _primitive$extensions[EXT_STRUCTURAL_METADATA_NAME];
    const primitivePropertyTextureIndices = primitiveExtension === null || primitiveExtension === void 0 ? void 0 : primitiveExtension.propertyTextures;
    if (!primitivePropertyTextureIndices) {
      return;
    }
    for (const primitivePropertyTextureIndex of primitivePropertyTextureIndices) {
      const propertyTexture = propertyTextures[primitivePropertyTextureIndex];
      processPrimitivePropertyTexture(scenegraph, propertyTexture, primitive, extension);
    }
  }
  function processPrimitivePropertyTexture(scenegraph, propertyTexture, primitive, extension) {
    if (!propertyTexture.properties) {
      return;
    }
    if (!extension.dataAttributeNames) {
      extension.dataAttributeNames = [];
    }
    const className = propertyTexture.class;
    for (const propertyName in propertyTexture.properties) {
      var _propertyTexture$prop;
      const attributeName = `${className}_${propertyName}`;
      const textureInfoTopLevel = (_propertyTexture$prop = propertyTexture.properties) === null || _propertyTexture$prop === void 0 ? void 0 : _propertyTexture$prop[propertyName];
      if (!textureInfoTopLevel) {
        continue;
      }
      if (!textureInfoTopLevel.data) {
        textureInfoTopLevel.data = [];
      }
      const featureTextureTable = textureInfoTopLevel.data;
      const propertyData = getPrimitiveTextureData(scenegraph, textureInfoTopLevel, primitive);
      if (propertyData === null) {
        continue;
      }
      primitivePropertyDataToAttributes(scenegraph, attributeName, propertyData, featureTextureTable, primitive);
      textureInfoTopLevel.data = featureTextureTable;
      extension.dataAttributeNames.push(attributeName);
    }
  }
  function processPropertyTable$1(scenegraph, schema, propertyTable) {
    var _schema$classes;
    const schemaClass = (_schema$classes = schema.classes) === null || _schema$classes === void 0 ? void 0 : _schema$classes[propertyTable.class];
    if (!schemaClass) {
      throw new Error(`Incorrect data in the EXT_structural_metadata extension: no schema class with name ${propertyTable.class}`);
    }
    const numberOfElements = propertyTable.count;
    for (const propertyName in schemaClass.properties) {
      var _propertyTable$proper;
      const classProperty = schemaClass.properties[propertyName];
      const propertyTableProperty = (_propertyTable$proper = propertyTable.properties) === null || _propertyTable$proper === void 0 ? void 0 : _propertyTable$proper[propertyName];
      if (propertyTableProperty) {
        const data = getPropertyDataFromBinarySource$1(scenegraph, schema, classProperty, numberOfElements, propertyTableProperty);
        propertyTableProperty.data = data;
      }
    }
  }
  function getPropertyDataFromBinarySource$1(scenegraph, schema, classProperty, numberOfElements, propertyTableProperty) {
    let data = [];
    const valuesBufferView = propertyTableProperty.values;
    const valuesDataBytes = scenegraph.getTypedArrayForBufferView(valuesBufferView);
    const arrayOffsets = getArrayOffsetsForProperty$1(scenegraph, classProperty, propertyTableProperty, numberOfElements);
    const stringOffsets = getStringOffsetsForProperty$1(scenegraph, propertyTableProperty, numberOfElements);
    switch (classProperty.type) {
      case "SCALAR":
      case "VEC2":
      case "VEC3":
      case "VEC4":
      case "MAT2":
      case "MAT3":
      case "MAT4": {
        data = getPropertyDataNumeric$1(classProperty, numberOfElements, valuesDataBytes, arrayOffsets);
        break;
      }
      case "BOOLEAN": {
        throw new Error(`Not implemented - classProperty.type=${classProperty.type}`);
      }
      case "STRING": {
        data = getPropertyDataString(numberOfElements, valuesDataBytes, arrayOffsets, stringOffsets);
        break;
      }
      case "ENUM": {
        data = getPropertyDataENUM(schema, classProperty, numberOfElements, valuesDataBytes, arrayOffsets);
        break;
      }
      default:
        throw new Error(`Unknown classProperty type ${classProperty.type}`);
    }
    return data;
  }
  function getArrayOffsetsForProperty$1(scenegraph, classProperty, propertyTableProperty, numberOfElements) {
    if (classProperty.array && typeof classProperty.count === "undefined" && typeof propertyTableProperty.arrayOffsets !== "undefined") {
      return getOffsetsForProperty(scenegraph, propertyTableProperty.arrayOffsets, propertyTableProperty.arrayOffsetType || "UINT32", numberOfElements);
    }
    return null;
  }
  function getStringOffsetsForProperty$1(scenegraph, propertyTableProperty, numberOfElements) {
    if (typeof propertyTableProperty.stringOffsets !== "undefined") {
      return getOffsetsForProperty(scenegraph, propertyTableProperty.stringOffsets, propertyTableProperty.stringOffsetType || "UINT32", numberOfElements);
    }
    return null;
  }
  function getPropertyDataNumeric$1(classProperty, numberOfElements, valuesDataBytes, arrayOffsets) {
    const isArray2 = classProperty.array;
    const arrayCount = classProperty.count;
    const elementSize = getArrayElementByteSize(classProperty.type, classProperty.componentType);
    const elementCount = valuesDataBytes.byteLength / elementSize;
    let valuesData;
    if (classProperty.componentType) {
      valuesData = convertRawBufferToMetadataArray(valuesDataBytes, classProperty.type, classProperty.componentType, elementCount);
    } else {
      valuesData = valuesDataBytes;
    }
    if (isArray2) {
      if (arrayOffsets) {
        return parseVariableLengthArrayNumeric(valuesData, numberOfElements, arrayOffsets, valuesDataBytes.length, elementSize);
      }
      if (arrayCount) {
        return parseFixedLengthArrayNumeric(valuesData, numberOfElements, arrayCount);
      }
      return [];
    }
    return valuesData;
  }
  function getPropertyDataENUM(schema, classProperty, numberOfElements, valuesDataBytes, arrayOffsets) {
    var _schema$enums;
    const enumType = classProperty.enumType;
    if (!enumType) {
      throw new Error("Incorrect data in the EXT_structural_metadata extension: classProperty.enumType is not set for type ENUM");
    }
    const enumEntry = (_schema$enums = schema.enums) === null || _schema$enums === void 0 ? void 0 : _schema$enums[enumType];
    if (!enumEntry) {
      throw new Error(`Incorrect data in the EXT_structural_metadata extension: schema.enums does't contain ${enumType}`);
    }
    const enumValueType = enumEntry.valueType || "UINT16";
    const elementSize = getArrayElementByteSize(classProperty.type, enumValueType);
    const elementCount = valuesDataBytes.byteLength / elementSize;
    let valuesData = convertRawBufferToMetadataArray(valuesDataBytes, classProperty.type, enumValueType, elementCount);
    if (!valuesData) {
      valuesData = valuesDataBytes;
    }
    if (classProperty.array) {
      if (arrayOffsets) {
        return parseVariableLengthArrayENUM({
          valuesData,
          numberOfElements,
          arrayOffsets,
          valuesDataBytesLength: valuesDataBytes.length,
          elementSize,
          enumEntry
        });
      }
      const arrayCount = classProperty.count;
      if (arrayCount) {
        return parseFixedLengthArrayENUM(valuesData, numberOfElements, arrayCount, enumEntry);
      }
      return [];
    }
    return getEnumsArray(valuesData, 0, numberOfElements, enumEntry);
  }
  function parseVariableLengthArrayENUM(params) {
    const {
      valuesData,
      numberOfElements,
      arrayOffsets,
      valuesDataBytesLength,
      elementSize,
      enumEntry
    } = params;
    const attributeValueArray = [];
    for (let index = 0; index < numberOfElements; index++) {
      const arrayOffset = arrayOffsets[index];
      const arrayByteSize = arrayOffsets[index + 1] - arrayOffsets[index];
      if (arrayByteSize + arrayOffset > valuesDataBytesLength) {
        break;
      }
      const typedArrayOffset = arrayOffset / elementSize;
      const elementCount = arrayByteSize / elementSize;
      const array = getEnumsArray(valuesData, typedArrayOffset, elementCount, enumEntry);
      attributeValueArray.push(array);
    }
    return attributeValueArray;
  }
  function parseFixedLengthArrayENUM(valuesData, numberOfElements, arrayCount, enumEntry) {
    const attributeValueArray = [];
    for (let index = 0; index < numberOfElements; index++) {
      const elementOffset = arrayCount * index;
      const array = getEnumsArray(valuesData, elementOffset, arrayCount, enumEntry);
      attributeValueArray.push(array);
    }
    return attributeValueArray;
  }
  function getEnumsArray(valuesData, offset, count, enumEntry) {
    const array = [];
    for (let i2 = 0; i2 < count; i2++) {
      if (valuesData instanceof BigInt64Array || valuesData instanceof BigUint64Array) {
        array.push("");
      } else {
        const value = valuesData[offset + i2];
        const enumObject = getEnumByValue(enumEntry, value);
        if (enumObject) {
          array.push(enumObject.name);
        } else {
          array.push("");
        }
      }
    }
    return array;
  }
  function getEnumByValue(enumEntry, value) {
    for (const enumValue of enumEntry.values) {
      if (enumValue.value === value) {
        return enumValue;
      }
    }
    return null;
  }
  const EXT_structural_metadata = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    decode: decode$8,
    name: name$9
  }, Symbol.toStringTag, { value: "Module" }));
  const EXT_FEATURE_METADATA_NAME = "EXT_feature_metadata";
  const name$8 = EXT_FEATURE_METADATA_NAME;
  async function decode$7(gltfData, options) {
    const scenegraph = new GLTFScenegraph(gltfData);
    decodeExtFeatureMetadata(scenegraph, options);
  }
  function decodeExtFeatureMetadata(scenegraph, options) {
    var _options$gltf, _options$gltf2;
    if (!((_options$gltf = options.gltf) !== null && _options$gltf !== void 0 && _options$gltf.loadBuffers)) {
      return;
    }
    const extension = scenegraph.getExtension(EXT_FEATURE_METADATA_NAME);
    if (!extension) {
      return;
    }
    if ((_options$gltf2 = options.gltf) !== null && _options$gltf2 !== void 0 && _options$gltf2.loadImages) {
      decodePropertyTextures(scenegraph, extension);
    }
    decodePropertyTables(scenegraph, extension);
  }
  function decodePropertyTextures(scenegraph, extension) {
    const schema = extension.schema;
    if (!schema) {
      return;
    }
    const schemaClasses = schema.classes;
    const {
      featureTextures
    } = extension;
    if (schemaClasses && featureTextures) {
      for (const schemaName in schemaClasses) {
        const schemaClass = schemaClasses[schemaName];
        const featureTexture = findFeatureTextureByClass(featureTextures, schemaName);
        if (featureTexture) {
          handleFeatureTextureProperties(scenegraph, featureTexture, schemaClass);
        }
      }
    }
  }
  function decodePropertyTables(scenegraph, extension) {
    const schema = extension.schema;
    if (!schema) {
      return;
    }
    const schemaClasses = schema.classes;
    const propertyTables = extension.featureTables;
    if (schemaClasses && propertyTables) {
      for (const schemaName in schemaClasses) {
        const propertyTable = findPropertyTableByClass(propertyTables, schemaName);
        if (propertyTable) {
          processPropertyTable(scenegraph, schema, propertyTable);
        }
      }
    }
  }
  function findPropertyTableByClass(propertyTables, schemaClassName) {
    for (const propertyTableName in propertyTables) {
      const propertyTable = propertyTables[propertyTableName];
      if (propertyTable.class === schemaClassName) {
        return propertyTable;
      }
    }
    return null;
  }
  function findFeatureTextureByClass(featureTextures, schemaClassName) {
    for (const featureTexturesName in featureTextures) {
      const featureTable = featureTextures[featureTexturesName];
      if (featureTable.class === schemaClassName) {
        return featureTable;
      }
    }
    return null;
  }
  function processPropertyTable(scenegraph, schema, propertyTable) {
    var _schema$classes;
    if (!propertyTable.class) {
      return;
    }
    const schemaClass = (_schema$classes = schema.classes) === null || _schema$classes === void 0 ? void 0 : _schema$classes[propertyTable.class];
    if (!schemaClass) {
      throw new Error(`Incorrect data in the EXT_structural_metadata extension: no schema class with name ${propertyTable.class}`);
    }
    const numberOfElements = propertyTable.count;
    for (const propertyName in schemaClass.properties) {
      var _propertyTable$proper;
      const classProperty = schemaClass.properties[propertyName];
      const propertyTableProperty = (_propertyTable$proper = propertyTable.properties) === null || _propertyTable$proper === void 0 ? void 0 : _propertyTable$proper[propertyName];
      if (propertyTableProperty) {
        const data = getPropertyDataFromBinarySource(scenegraph, schema, classProperty, numberOfElements, propertyTableProperty);
        propertyTableProperty.data = data;
      }
    }
  }
  function handleFeatureTextureProperties(scenegraph, featureTexture, schemaClass) {
    const attributeName = featureTexture.class;
    for (const propertyName in schemaClass.properties) {
      var _featureTexture$prope;
      const featureTextureProperty = featureTexture === null || featureTexture === void 0 ? void 0 : (_featureTexture$prope = featureTexture.properties) === null || _featureTexture$prope === void 0 ? void 0 : _featureTexture$prope[propertyName];
      if (featureTextureProperty) {
        const data = getPropertyDataFromTexture(scenegraph, featureTextureProperty, attributeName);
        featureTextureProperty.data = data;
      }
    }
  }
  function getPropertyDataFromBinarySource(scenegraph, schema, classProperty, numberOfFeatures, featureTableProperty) {
    let data = [];
    const bufferView = featureTableProperty.bufferView;
    const dataArray = scenegraph.getTypedArrayForBufferView(bufferView);
    const arrayOffsets = getArrayOffsetsForProperty(scenegraph, classProperty, featureTableProperty, numberOfFeatures);
    const stringOffsets = getStringOffsetsForProperty(scenegraph, classProperty, featureTableProperty, numberOfFeatures);
    if (classProperty.type === "STRING" || classProperty.componentType === "STRING") {
      data = getPropertyDataString(numberOfFeatures, dataArray, arrayOffsets, stringOffsets);
    } else if (isNumericProperty(classProperty)) {
      data = getPropertyDataNumeric(classProperty, numberOfFeatures, dataArray, arrayOffsets);
    }
    return data;
  }
  function getArrayOffsetsForProperty(scenegraph, classProperty, propertyTableProperty, numberOfElements) {
    if (classProperty.type === "ARRAY" && typeof classProperty.componentCount === "undefined" && typeof propertyTableProperty.arrayOffsetBufferView !== "undefined") {
      return getOffsetsForProperty(scenegraph, propertyTableProperty.arrayOffsetBufferView, propertyTableProperty.offsetType || "UINT32", numberOfElements);
    }
    return null;
  }
  function getStringOffsetsForProperty(scenegraph, classProperty, propertyTableProperty, numberOfElements) {
    if (typeof propertyTableProperty.stringOffsetBufferView !== "undefined") {
      return getOffsetsForProperty(scenegraph, propertyTableProperty.stringOffsetBufferView, propertyTableProperty.offsetType || "UINT32", numberOfElements);
    }
    return null;
  }
  function isNumericProperty(schemaProperty) {
    const types = ["UINT8", "INT16", "UINT16", "INT32", "UINT32", "INT64", "UINT64", "FLOAT32", "FLOAT64"];
    return types.includes(schemaProperty.type) || typeof schemaProperty.componentType !== "undefined" && types.includes(schemaProperty.componentType);
  }
  function getPropertyDataNumeric(classProperty, numberOfElements, valuesDataBytes, arrayOffsets) {
    const isArray2 = classProperty.type === "ARRAY";
    const arrayCount = classProperty.componentCount;
    const attributeType = "SCALAR";
    const componentType = classProperty.componentType || classProperty.type;
    const elementSize = getArrayElementByteSize(attributeType, componentType);
    const elementCount = valuesDataBytes.byteLength / elementSize;
    const valuesData = convertRawBufferToMetadataArray(valuesDataBytes, attributeType, componentType, elementCount);
    if (isArray2) {
      if (arrayOffsets) {
        return parseVariableLengthArrayNumeric(valuesData, numberOfElements, arrayOffsets, valuesDataBytes.length, elementSize);
      }
      if (arrayCount) {
        return parseFixedLengthArrayNumeric(valuesData, numberOfElements, arrayCount);
      }
      return [];
    }
    return valuesData;
  }
  function getPropertyDataFromTexture(scenegraph, featureTextureProperty, attributeName) {
    const json = scenegraph.gltf.json;
    if (!json.meshes) {
      return [];
    }
    const featureTextureTable = [];
    for (const mesh of json.meshes) {
      for (const primitive of mesh.primitives) {
        processPrimitiveTextures(scenegraph, attributeName, featureTextureProperty, featureTextureTable, primitive);
      }
    }
    return featureTextureTable;
  }
  function processPrimitiveTextures(scenegraph, attributeName, featureTextureProperty, featureTextureTable, primitive) {
    const textureInfoTopLevel = {
      channels: featureTextureProperty.channels,
      ...featureTextureProperty.texture
    };
    const propertyData = getPrimitiveTextureData(scenegraph, textureInfoTopLevel, primitive);
    if (!propertyData) {
      return;
    }
    primitivePropertyDataToAttributes(scenegraph, attributeName, propertyData, featureTextureTable, primitive);
  }
  const EXT_feature_metadata = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    decode: decode$7,
    name: name$8
  }, Symbol.toStringTag, { value: "Module" }));
  const VERSION$2 = "4.1.1";
  const VERSION$1 = "4.1.1";
  const BASIS_EXTERNAL_LIBRARIES = {
    TRANSCODER: "basis_transcoder.js",
    TRANSCODER_WASM: "basis_transcoder.wasm",
    ENCODER: "basis_encoder.js",
    ENCODER_WASM: "basis_encoder.wasm"
  };
  let loadBasisTranscoderPromise;
  async function loadBasisTranscoderModule(options) {
    const modules = options.modules || {};
    if (modules.basis) {
      return modules.basis;
    }
    loadBasisTranscoderPromise = loadBasisTranscoderPromise || loadBasisTranscoder(options);
    return await loadBasisTranscoderPromise;
  }
  async function loadBasisTranscoder(options) {
    let BASIS = null;
    let wasmBinary = null;
    [BASIS, wasmBinary] = await Promise.all([await loadLibrary(BASIS_EXTERNAL_LIBRARIES.TRANSCODER, "textures", options), await loadLibrary(BASIS_EXTERNAL_LIBRARIES.TRANSCODER_WASM, "textures", options)]);
    BASIS = BASIS || globalThis.BASIS;
    return await initializeBasisTranscoderModule(BASIS, wasmBinary);
  }
  function initializeBasisTranscoderModule(BasisModule, wasmBinary) {
    const options = {};
    if (wasmBinary) {
      options.wasmBinary = wasmBinary;
    }
    return new Promise((resolve2) => {
      BasisModule(options).then((module2) => {
        const {
          BasisFile,
          initializeBasis
        } = module2;
        initializeBasis();
        resolve2({
          BasisFile
        });
      });
    });
  }
  let loadBasisEncoderPromise;
  async function loadBasisEncoderModule(options) {
    const modules = options.modules || {};
    if (modules.basisEncoder) {
      return modules.basisEncoder;
    }
    loadBasisEncoderPromise = loadBasisEncoderPromise || loadBasisEncoder(options);
    return await loadBasisEncoderPromise;
  }
  async function loadBasisEncoder(options) {
    let BASIS_ENCODER = null;
    let wasmBinary = null;
    [BASIS_ENCODER, wasmBinary] = await Promise.all([await loadLibrary(BASIS_EXTERNAL_LIBRARIES.ENCODER, "textures", options), await loadLibrary(BASIS_EXTERNAL_LIBRARIES.ENCODER_WASM, "textures", options)]);
    BASIS_ENCODER = BASIS_ENCODER || globalThis.BASIS;
    return await initializeBasisEncoderModule(BASIS_ENCODER, wasmBinary);
  }
  function initializeBasisEncoderModule(BasisEncoderModule, wasmBinary) {
    const options = {};
    if (wasmBinary) {
      options.wasmBinary = wasmBinary;
    }
    return new Promise((resolve2) => {
      BasisEncoderModule(options).then((module2) => {
        const {
          BasisFile,
          KTX2File,
          initializeBasis,
          BasisEncoder
        } = module2;
        initializeBasis();
        resolve2({
          BasisFile,
          KTX2File,
          BasisEncoder
        });
      });
    });
  }
  const GL_EXTENSIONS_CONSTANTS = {
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
  };
  const BROWSER_PREFIXES = ["", "WEBKIT_", "MOZ_"];
  const WEBGL_EXTENSIONS = {
    WEBGL_compressed_texture_s3tc: "dxt",
    WEBGL_compressed_texture_s3tc_srgb: "dxt-srgb",
    WEBGL_compressed_texture_etc1: "etc1",
    WEBGL_compressed_texture_etc: "etc2",
    WEBGL_compressed_texture_pvrtc: "pvrtc",
    WEBGL_compressed_texture_atc: "atc",
    WEBGL_compressed_texture_astc: "astc",
    EXT_texture_compression_rgtc: "rgtc"
  };
  let formats = null;
  function getSupportedGPUTextureFormats(gl) {
    if (!formats) {
      gl = gl || getWebGLContext() || void 0;
      formats = /* @__PURE__ */ new Set();
      for (const prefix of BROWSER_PREFIXES) {
        for (const extension in WEBGL_EXTENSIONS) {
          if (gl && gl.getExtension(`${prefix}${extension}`)) {
            const gpuTextureFormat = WEBGL_EXTENSIONS[extension];
            formats.add(gpuTextureFormat);
          }
        }
      }
    }
    return formats;
  }
  function getWebGLContext() {
    try {
      const canvas = document.createElement("canvas");
      return canvas.getContext("webgl");
    } catch (error) {
      return null;
    }
  }
  var n, i, s, a, r, o, l, f;
  !function(t) {
    t[t.NONE = 0] = "NONE", t[t.BASISLZ = 1] = "BASISLZ", t[t.ZSTD = 2] = "ZSTD", t[t.ZLIB = 3] = "ZLIB";
  }(n || (n = {})), function(t) {
    t[t.BASICFORMAT = 0] = "BASICFORMAT";
  }(i || (i = {})), function(t) {
    t[t.UNSPECIFIED = 0] = "UNSPECIFIED", t[t.ETC1S = 163] = "ETC1S", t[t.UASTC = 166] = "UASTC";
  }(s || (s = {})), function(t) {
    t[t.UNSPECIFIED = 0] = "UNSPECIFIED", t[t.SRGB = 1] = "SRGB";
  }(a || (a = {})), function(t) {
    t[t.UNSPECIFIED = 0] = "UNSPECIFIED", t[t.LINEAR = 1] = "LINEAR", t[t.SRGB = 2] = "SRGB", t[t.ITU = 3] = "ITU", t[t.NTSC = 4] = "NTSC", t[t.SLOG = 5] = "SLOG", t[t.SLOG2 = 6] = "SLOG2";
  }(r || (r = {})), function(t) {
    t[t.ALPHA_STRAIGHT = 0] = "ALPHA_STRAIGHT", t[t.ALPHA_PREMULTIPLIED = 1] = "ALPHA_PREMULTIPLIED";
  }(o || (o = {})), function(t) {
    t[t.RGB = 0] = "RGB", t[t.RRR = 3] = "RRR", t[t.GGG = 4] = "GGG", t[t.AAA = 15] = "AAA";
  }(l || (l = {})), function(t) {
    t[t.RGB = 0] = "RGB", t[t.RGBA = 3] = "RGBA", t[t.RRR = 4] = "RRR", t[t.RRRG = 5] = "RRRG";
  }(f || (f = {}));
  const KTX2_ID = [171, 75, 84, 88, 32, 50, 48, 187, 13, 10, 26, 10];
  function isKTX(data) {
    const id = new Uint8Array(data);
    const notKTX = id.byteLength < KTX2_ID.length || id[0] !== KTX2_ID[0] || id[1] !== KTX2_ID[1] || id[2] !== KTX2_ID[2] || id[3] !== KTX2_ID[3] || id[4] !== KTX2_ID[4] || id[5] !== KTX2_ID[5] || id[6] !== KTX2_ID[6] || id[7] !== KTX2_ID[7] || id[8] !== KTX2_ID[8] || id[9] !== KTX2_ID[9] || id[10] !== KTX2_ID[10] || id[11] !== KTX2_ID[11];
    return !notKTX;
  }
  const OutputFormat = {
    etc1: {
      basisFormat: 0,
      compressed: true,
      format: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGB_ETC1_WEBGL
    },
    etc2: {
      basisFormat: 1,
      compressed: true
    },
    bc1: {
      basisFormat: 2,
      compressed: true,
      format: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGB_S3TC_DXT1_EXT
    },
    bc3: {
      basisFormat: 3,
      compressed: true,
      format: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_S3TC_DXT5_EXT
    },
    bc4: {
      basisFormat: 4,
      compressed: true
    },
    bc5: {
      basisFormat: 5,
      compressed: true
    },
    "bc7-m6-opaque-only": {
      basisFormat: 6,
      compressed: true
    },
    "bc7-m5": {
      basisFormat: 7,
      compressed: true
    },
    "pvrtc1-4-rgb": {
      basisFormat: 8,
      compressed: true,
      format: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGB_PVRTC_4BPPV1_IMG
    },
    "pvrtc1-4-rgba": {
      basisFormat: 9,
      compressed: true,
      format: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG
    },
    "astc-4x4": {
      basisFormat: 10,
      compressed: true,
      format: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_4X4_KHR
    },
    "atc-rgb": {
      basisFormat: 11,
      compressed: true
    },
    "atc-rgba-interpolated-alpha": {
      basisFormat: 12,
      compressed: true
    },
    rgba32: {
      basisFormat: 13,
      compressed: false
    },
    rgb565: {
      basisFormat: 14,
      compressed: false
    },
    bgr565: {
      basisFormat: 15,
      compressed: false
    },
    rgba4444: {
      basisFormat: 16,
      compressed: false
    }
  };
  async function parseBasis(data, options) {
    if (options.basis.containerFormat === "auto") {
      if (isKTX(data)) {
        const fileConstructors = await loadBasisEncoderModule(options);
        return parseKTX2File(fileConstructors.KTX2File, data, options);
      }
      const {
        BasisFile
      } = await loadBasisTranscoderModule(options);
      return parseBasisFile(BasisFile, data, options);
    }
    switch (options.basis.module) {
      case "encoder":
        const fileConstructors = await loadBasisEncoderModule(options);
        switch (options.basis.containerFormat) {
          case "ktx2":
            return parseKTX2File(fileConstructors.KTX2File, data, options);
          case "basis":
          default:
            return parseBasisFile(fileConstructors.BasisFile, data, options);
        }
      case "transcoder":
      default:
        const {
          BasisFile
        } = await loadBasisTranscoderModule(options);
        return parseBasisFile(BasisFile, data, options);
    }
  }
  function parseBasisFile(BasisFile, data, options) {
    const basisFile = new BasisFile(new Uint8Array(data));
    try {
      if (!basisFile.startTranscoding()) {
        throw new Error("Failed to start basis transcoding");
      }
      const imageCount = basisFile.getNumImages();
      const images = [];
      for (let imageIndex = 0; imageIndex < imageCount; imageIndex++) {
        const levelsCount = basisFile.getNumLevels(imageIndex);
        const levels = [];
        for (let levelIndex = 0; levelIndex < levelsCount; levelIndex++) {
          levels.push(transcodeImage(basisFile, imageIndex, levelIndex, options));
        }
        images.push(levels);
      }
      return images;
    } finally {
      basisFile.close();
      basisFile.delete();
    }
  }
  function transcodeImage(basisFile, imageIndex, levelIndex, options) {
    const width = basisFile.getImageWidth(imageIndex, levelIndex);
    const height = basisFile.getImageHeight(imageIndex, levelIndex);
    const hasAlpha = basisFile.getHasAlpha();
    const {
      compressed,
      format,
      basisFormat
    } = getBasisOptions(options, hasAlpha);
    const decodedSize = basisFile.getImageTranscodedSizeInBytes(imageIndex, levelIndex, basisFormat);
    const decodedData = new Uint8Array(decodedSize);
    if (!basisFile.transcodeImage(decodedData, imageIndex, levelIndex, basisFormat, 0, 0)) {
      throw new Error("failed to start Basis transcoding");
    }
    return {
      width,
      height,
      data: decodedData,
      compressed,
      format,
      hasAlpha
    };
  }
  function parseKTX2File(KTX2File, data, options) {
    const ktx2File = new KTX2File(new Uint8Array(data));
    try {
      if (!ktx2File.startTranscoding()) {
        throw new Error("failed to start KTX2 transcoding");
      }
      const levelsCount = ktx2File.getLevels();
      const levels = [];
      for (let levelIndex = 0; levelIndex < levelsCount; levelIndex++) {
        levels.push(transcodeKTX2Image(ktx2File, levelIndex, options));
        break;
      }
      return [levels];
    } finally {
      ktx2File.close();
      ktx2File.delete();
    }
  }
  function transcodeKTX2Image(ktx2File, levelIndex, options) {
    const {
      alphaFlag,
      height,
      width
    } = ktx2File.getImageLevelInfo(levelIndex, 0, 0);
    const {
      compressed,
      format,
      basisFormat
    } = getBasisOptions(options, alphaFlag);
    const decodedSize = ktx2File.getImageTranscodedSizeInBytes(levelIndex, 0, 0, basisFormat);
    const decodedData = new Uint8Array(decodedSize);
    if (!ktx2File.transcodeImage(decodedData, levelIndex, 0, 0, basisFormat, 0, -1, -1)) {
      throw new Error("Failed to transcode KTX2 image");
    }
    return {
      width,
      height,
      data: decodedData,
      compressed,
      levelSize: decodedSize,
      hasAlpha: alphaFlag,
      format
    };
  }
  function getBasisOptions(options, hasAlpha) {
    let format = options && options.basis && options.basis.format;
    if (format === "auto") {
      format = selectSupportedBasisFormat();
    }
    if (typeof format === "object") {
      format = hasAlpha ? format.alpha : format.noAlpha;
    }
    format = format.toLowerCase();
    return OutputFormat[format];
  }
  function selectSupportedBasisFormat() {
    const supportedFormats = getSupportedGPUTextureFormats();
    if (supportedFormats.has("astc")) {
      return "astc-4x4";
    } else if (supportedFormats.has("dxt")) {
      return {
        alpha: "bc3",
        noAlpha: "bc1"
      };
    } else if (supportedFormats.has("pvrtc")) {
      return {
        alpha: "pvrtc1-4-rgba",
        noAlpha: "pvrtc1-4-rgb"
      };
    } else if (supportedFormats.has("etc1")) {
      return "etc1";
    } else if (supportedFormats.has("etc2")) {
      return "etc2";
    }
    return "rgb565";
  }
  const BasisWorkerLoader = {
    name: "Basis",
    id: "basis",
    module: "textures",
    version: VERSION$1,
    worker: true,
    extensions: ["basis", "ktx2"],
    mimeTypes: ["application/octet-stream", "image/ktx2"],
    tests: ["sB"],
    binary: true,
    options: {
      basis: {
        format: "auto",
        libraryPath: "libs/",
        containerFormat: "auto",
        module: "transcoder"
      }
    }
  };
  const BasisLoader = {
    ...BasisWorkerLoader,
    parse: parseBasis
  };
  const LITTLE_ENDIAN = true;
  const MAGIC_glTF = 1735152710;
  const GLB_FILE_HEADER_SIZE = 12;
  const GLB_CHUNK_HEADER_SIZE = 8;
  const GLB_CHUNK_TYPE_JSON = 1313821514;
  const GLB_CHUNK_TYPE_BIN = 5130562;
  const GLB_V1_CONTENT_FORMAT_JSON = 0;
  const GLB_CHUNK_TYPE_JSON_XVIZ_DEPRECATED = 0;
  const GLB_CHUNK_TYPE_BIX_XVIZ_DEPRECATED = 1;
  function getMagicString(dataView) {
    let byteOffset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    return `${String.fromCharCode(dataView.getUint8(byteOffset + 0))}${String.fromCharCode(dataView.getUint8(byteOffset + 1))}${String.fromCharCode(dataView.getUint8(byteOffset + 2))}${String.fromCharCode(dataView.getUint8(byteOffset + 3))}`;
  }
  function isGLB(arrayBuffer) {
    let byteOffset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const dataView = new DataView(arrayBuffer);
    const {
      magic = MAGIC_glTF
    } = options;
    const magic1 = dataView.getUint32(byteOffset, false);
    return magic1 === magic || magic1 === MAGIC_glTF;
  }
  function parseGLBSync(glb, arrayBuffer) {
    let byteOffset = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
    const dataView = new DataView(arrayBuffer);
    const type = getMagicString(dataView, byteOffset + 0);
    const version = dataView.getUint32(byteOffset + 4, LITTLE_ENDIAN);
    const byteLength = dataView.getUint32(byteOffset + 8, LITTLE_ENDIAN);
    Object.assign(glb, {
      header: {
        byteOffset,
        byteLength,
        hasBinChunk: false
      },
      type,
      version,
      json: {},
      binChunks: []
    });
    byteOffset += GLB_FILE_HEADER_SIZE;
    switch (glb.version) {
      case 1:
        return parseGLBV1(glb, dataView, byteOffset);
      case 2:
        return parseGLBV2(glb, dataView, byteOffset, {});
      default:
        throw new Error(`Invalid GLB version ${glb.version}. Only supports version 1 and 2.`);
    }
  }
  function parseGLBV1(glb, dataView, byteOffset) {
    assert$6(glb.header.byteLength > GLB_FILE_HEADER_SIZE + GLB_CHUNK_HEADER_SIZE);
    const contentLength = dataView.getUint32(byteOffset + 0, LITTLE_ENDIAN);
    const contentFormat = dataView.getUint32(byteOffset + 4, LITTLE_ENDIAN);
    byteOffset += GLB_CHUNK_HEADER_SIZE;
    assert$6(contentFormat === GLB_V1_CONTENT_FORMAT_JSON);
    parseJSONChunk(glb, dataView, byteOffset, contentLength);
    byteOffset += contentLength;
    byteOffset += parseBINChunk(glb, dataView, byteOffset, glb.header.byteLength);
    return byteOffset;
  }
  function parseGLBV2(glb, dataView, byteOffset, options) {
    assert$6(glb.header.byteLength > GLB_FILE_HEADER_SIZE + GLB_CHUNK_HEADER_SIZE);
    parseGLBChunksSync(glb, dataView, byteOffset, options);
    return byteOffset + glb.header.byteLength;
  }
  function parseGLBChunksSync(glb, dataView, byteOffset, options) {
    while (byteOffset + 8 <= glb.header.byteLength) {
      const chunkLength = dataView.getUint32(byteOffset + 0, LITTLE_ENDIAN);
      const chunkFormat = dataView.getUint32(byteOffset + 4, LITTLE_ENDIAN);
      byteOffset += GLB_CHUNK_HEADER_SIZE;
      switch (chunkFormat) {
        case GLB_CHUNK_TYPE_JSON:
          parseJSONChunk(glb, dataView, byteOffset, chunkLength);
          break;
        case GLB_CHUNK_TYPE_BIN:
          parseBINChunk(glb, dataView, byteOffset, chunkLength);
          break;
        case GLB_CHUNK_TYPE_JSON_XVIZ_DEPRECATED:
          if (!options.strict) {
            parseJSONChunk(glb, dataView, byteOffset, chunkLength);
          }
          break;
        case GLB_CHUNK_TYPE_BIX_XVIZ_DEPRECATED:
          if (!options.strict) {
            parseBINChunk(glb, dataView, byteOffset, chunkLength);
          }
          break;
      }
      byteOffset += padToNBytes(chunkLength, 4);
    }
    return byteOffset;
  }
  function parseJSONChunk(glb, dataView, byteOffset, chunkLength) {
    const jsonChunk = new Uint8Array(dataView.buffer, byteOffset, chunkLength);
    const textDecoder = new TextDecoder("utf8");
    const jsonText = textDecoder.decode(jsonChunk);
    glb.json = JSON.parse(jsonText);
    return padToNBytes(chunkLength, 4);
  }
  function parseBINChunk(glb, dataView, byteOffset, chunkLength) {
    glb.header.hasBinChunk = true;
    glb.binChunks.push({
      byteOffset,
      byteLength: chunkLength,
      arrayBuffer: dataView.buffer
    });
    return padToNBytes(chunkLength, 4);
  }
  function resolveUrl(url, options) {
    const absolute = url.startsWith("data:") || url.startsWith("http:") || url.startsWith("https:");
    if (absolute) {
      return url;
    }
    const baseUrl = options.baseUri || options.uri;
    if (!baseUrl) {
      throw new Error(`'baseUri' must be provided to resolve relative url ${url}`);
    }
    return baseUrl.substr(0, baseUrl.lastIndexOf("/") + 1) + url;
  }
  const wasm_base = "B9h9z9tFBBBF8fL9gBB9gLaaaaaFa9gEaaaB9gFaFa9gEaaaFaEMcBFFFGGGEIIILF9wFFFLEFBFKNFaFCx/IFMO/LFVK9tv9t9vq95GBt9f9f939h9z9t9f9j9h9s9s9f9jW9vq9zBBp9tv9z9o9v9wW9f9kv9j9v9kv9WvqWv94h919m9mvqBF8Z9tv9z9o9v9wW9f9kv9j9v9kv9J9u9kv94h919m9mvqBGy9tv9z9o9v9wW9f9kv9j9v9kv9J9u9kv949TvZ91v9u9jvBEn9tv9z9o9v9wW9f9kv9j9v9kv69p9sWvq9P9jWBIi9tv9z9o9v9wW9f9kv9j9v9kv69p9sWvq9R919hWBLn9tv9z9o9v9wW9f9kv9j9v9kv69p9sWvq9F949wBKI9z9iqlBOc+x8ycGBM/qQFTa8jUUUUBCU/EBlHL8kUUUUBC9+RKGXAGCFJAI9LQBCaRKAE2BBC+gF9HQBALAEAIJHOAGlAGTkUUUBRNCUoBAG9uC/wgBZHKCUGAKCUG9JyRVAECFJRICBRcGXEXAcAF9PQFAVAFAclAcAVJAF9JyRMGXGXAG9FQBAMCbJHKC9wZRSAKCIrCEJCGrRQANCUGJRfCBRbAIRTEXGXAOATlAQ9PQBCBRISEMATAQJRIGXAS9FQBCBRtCBREEXGXAOAIlCi9PQBCBRISLMANCU/CBJAEJRKGXGXGXGXGXATAECKrJ2BBAtCKZrCEZfIBFGEBMAKhB83EBAKCNJhB83EBSEMAKAI2BIAI2BBHmCKrHYAYCE6HYy86BBAKCFJAICIJAYJHY2BBAmCIrCEZHPAPCE6HPy86BBAKCGJAYAPJHY2BBAmCGrCEZHPAPCE6HPy86BBAKCEJAYAPJHY2BBAmCEZHmAmCE6Hmy86BBAKCIJAYAmJHY2BBAI2BFHmCKrHPAPCE6HPy86BBAKCLJAYAPJHY2BBAmCIrCEZHPAPCE6HPy86BBAKCKJAYAPJHY2BBAmCGrCEZHPAPCE6HPy86BBAKCOJAYAPJHY2BBAmCEZHmAmCE6Hmy86BBAKCNJAYAmJHY2BBAI2BGHmCKrHPAPCE6HPy86BBAKCVJAYAPJHY2BBAmCIrCEZHPAPCE6HPy86BBAKCcJAYAPJHY2BBAmCGrCEZHPAPCE6HPy86BBAKCMJAYAPJHY2BBAmCEZHmAmCE6Hmy86BBAKCSJAYAmJHm2BBAI2BEHICKrHYAYCE6HYy86BBAKCQJAmAYJHm2BBAICIrCEZHYAYCE6HYy86BBAKCfJAmAYJHm2BBAICGrCEZHYAYCE6HYy86BBAKCbJAmAYJHK2BBAICEZHIAICE6HIy86BBAKAIJRISGMAKAI2BNAI2BBHmCIrHYAYCb6HYy86BBAKCFJAICNJAYJHY2BBAmCbZHmAmCb6Hmy86BBAKCGJAYAmJHm2BBAI2BFHYCIrHPAPCb6HPy86BBAKCEJAmAPJHm2BBAYCbZHYAYCb6HYy86BBAKCIJAmAYJHm2BBAI2BGHYCIrHPAPCb6HPy86BBAKCLJAmAPJHm2BBAYCbZHYAYCb6HYy86BBAKCKJAmAYJHm2BBAI2BEHYCIrHPAPCb6HPy86BBAKCOJAmAPJHm2BBAYCbZHYAYCb6HYy86BBAKCNJAmAYJHm2BBAI2BIHYCIrHPAPCb6HPy86BBAKCVJAmAPJHm2BBAYCbZHYAYCb6HYy86BBAKCcJAmAYJHm2BBAI2BLHYCIrHPAPCb6HPy86BBAKCMJAmAPJHm2BBAYCbZHYAYCb6HYy86BBAKCSJAmAYJHm2BBAI2BKHYCIrHPAPCb6HPy86BBAKCQJAmAPJHm2BBAYCbZHYAYCb6HYy86BBAKCfJAmAYJHm2BBAI2BOHICIrHYAYCb6HYy86BBAKCbJAmAYJHK2BBAICbZHIAICb6HIy86BBAKAIJRISFMAKAI8pBB83BBAKCNJAICNJ8pBB83BBAICTJRIMAtCGJRtAECTJHEAS9JQBMMGXAIQBCBRISEMGXAM9FQBANAbJ2BBRtCBRKAfREEXAEANCU/CBJAKJ2BBHTCFrCBATCFZl9zAtJHt86BBAEAGJREAKCFJHKAM9HQBMMAfCFJRfAIRTAbCFJHbAG9HQBMMABAcAG9sJANCUGJAMAG9sTkUUUBpANANCUGJAMCaJAG9sJAGTkUUUBpMAMCBAIyAcJRcAIQBMC9+RKSFMCBC99AOAIlAGCAAGCA9Ly6yRKMALCU/EBJ8kUUUUBAKM+OmFTa8jUUUUBCoFlHL8kUUUUBC9+RKGXAFCE9uHOCtJAI9LQBCaRKAE2BBHNC/wFZC/gF9HQBANCbZHVCF9LQBALCoBJCgFCUFT+JUUUBpALC84Jha83EBALC8wJha83EBALC8oJha83EBALCAJha83EBALCiJha83EBALCTJha83EBALha83ENALha83EBAEAIJC9wJRcAECFJHNAOJRMGXAF9FQBCQCbAVCF6yRSABRECBRVCBRQCBRfCBRICBRKEXGXAMAcuQBC9+RKSEMGXGXAN2BBHOC/vF9LQBALCoBJAOCIrCa9zAKJCbZCEWJHb8oGIRTAb8oGBRtGXAOCbZHbAS9PQBALAOCa9zAIJCbZCGWJ8oGBAVAbyROAb9FRbGXGXAGCG9HQBABAt87FBABCIJAO87FBABCGJAT87FBSFMAEAtjGBAECNJAOjGBAECIJATjGBMAVAbJRVALCoBJAKCEWJHmAOjGBAmATjGIALAICGWJAOjGBALCoBJAKCFJCbZHKCEWJHTAtjGBATAOjGIAIAbJRIAKCFJRKSGMGXGXAbCb6QBAQAbJAbC989zJCFJRQSFMAM1BBHbCgFZROGXGXAbCa9MQBAMCFJRMSFMAM1BFHbCgBZCOWAOCgBZqROGXAbCa9MQBAMCGJRMSFMAM1BGHbCgBZCfWAOqROGXAbCa9MQBAMCEJRMSFMAM1BEHbCgBZCdWAOqROGXAbCa9MQBAMCIJRMSFMAM2BIC8cWAOqROAMCLJRMMAOCFrCBAOCFZl9zAQJRQMGXGXAGCG9HQBABAt87FBABCIJAQ87FBABCGJAT87FBSFMAEAtjGBAECNJAQjGBAECIJATjGBMALCoBJAKCEWJHOAQjGBAOATjGIALAICGWJAQjGBALCoBJAKCFJCbZHKCEWJHOAtjGBAOAQjGIAICFJRIAKCFJRKSFMGXAOCDF9LQBALAIAcAOCbZJ2BBHbCIrHTlCbZCGWJ8oGBAVCFJHtATyROALAIAblCbZCGWJ8oGBAtAT9FHmJHtAbCbZHTyRbAT9FRTGXGXAGCG9HQBABAV87FBABCIJAb87FBABCGJAO87FBSFMAEAVjGBAECNJAbjGBAECIJAOjGBMALAICGWJAVjGBALCoBJAKCEWJHYAOjGBAYAVjGIALAICFJHICbZCGWJAOjGBALCoBJAKCFJCbZCEWJHYAbjGBAYAOjGIALAIAmJCbZHICGWJAbjGBALCoBJAKCGJCbZHKCEWJHOAVjGBAOAbjGIAKCFJRKAIATJRIAtATJRVSFMAVCBAM2BBHYyHTAOC/+F6HPJROAYCbZRtGXGXAYCIrHmQBAOCFJRbSFMAORbALAIAmlCbZCGWJ8oGBROMGXGXAtQBAbCFJRVSFMAbRVALAIAYlCbZCGWJ8oGBRbMGXGXAP9FQBAMCFJRYSFMAM1BFHYCgFZRTGXGXAYCa9MQBAMCGJRYSFMAM1BGHYCgBZCOWATCgBZqRTGXAYCa9MQBAMCEJRYSFMAM1BEHYCgBZCfWATqRTGXAYCa9MQBAMCIJRYSFMAM1BIHYCgBZCdWATqRTGXAYCa9MQBAMCLJRYSFMAMCKJRYAM2BLC8cWATqRTMATCFrCBATCFZl9zAQJHQRTMGXGXAmCb6QBAYRPSFMAY1BBHMCgFZROGXGXAMCa9MQBAYCFJRPSFMAY1BFHMCgBZCOWAOCgBZqROGXAMCa9MQBAYCGJRPSFMAY1BGHMCgBZCfWAOqROGXAMCa9MQBAYCEJRPSFMAY1BEHMCgBZCdWAOqROGXAMCa9MQBAYCIJRPSFMAYCLJRPAY2BIC8cWAOqROMAOCFrCBAOCFZl9zAQJHQROMGXGXAtCb6QBAPRMSFMAP1BBHMCgFZRbGXGXAMCa9MQBAPCFJRMSFMAP1BFHMCgBZCOWAbCgBZqRbGXAMCa9MQBAPCGJRMSFMAP1BGHMCgBZCfWAbqRbGXAMCa9MQBAPCEJRMSFMAP1BEHMCgBZCdWAbqRbGXAMCa9MQBAPCIJRMSFMAPCLJRMAP2BIC8cWAbqRbMAbCFrCBAbCFZl9zAQJHQRbMGXGXAGCG9HQBABAT87FBABCIJAb87FBABCGJAO87FBSFMAEATjGBAECNJAbjGBAECIJAOjGBMALCoBJAKCEWJHYAOjGBAYATjGIALAICGWJATjGBALCoBJAKCFJCbZCEWJHYAbjGBAYAOjGIALAICFJHICbZCGWJAOjGBALCoBJAKCGJCbZCEWJHOATjGBAOAbjGIALAIAm9FAmCb6qJHICbZCGWJAbjGBAIAt9FAtCb6qJRIAKCEJRKMANCFJRNABCKJRBAECSJREAKCbZRKAICbZRIAfCEJHfAF9JQBMMCBC99AMAc6yRKMALCoFJ8kUUUUBAKM/tIFGa8jUUUUBCTlRLC9+RKGXAFCLJAI9LQBCaRKAE2BBC/+FZC/QF9HQBALhB83ENAECFJRKAEAIJC98JREGXAF9FQBGXAGCG6QBEXGXAKAE9JQBC9+bMAK1BBHGCgFZRIGXGXAGCa9MQBAKCFJRKSFMAK1BFHGCgBZCOWAICgBZqRIGXAGCa9MQBAKCGJRKSFMAK1BGHGCgBZCfWAIqRIGXAGCa9MQBAKCEJRKSFMAK1BEHGCgBZCdWAIqRIGXAGCa9MQBAKCIJRKSFMAK2BIC8cWAIqRIAKCLJRKMALCNJAICFZCGWqHGAICGrCBAICFrCFZl9zAG8oGBJHIjGBABAIjGBABCIJRBAFCaJHFQBSGMMEXGXAKAE9JQBC9+bMAK1BBHGCgFZRIGXGXAGCa9MQBAKCFJRKSFMAK1BFHGCgBZCOWAICgBZqRIGXAGCa9MQBAKCGJRKSFMAK1BGHGCgBZCfWAIqRIGXAGCa9MQBAKCEJRKSFMAK1BEHGCgBZCdWAIqRIGXAGCa9MQBAKCIJRKSFMAK2BIC8cWAIqRIAKCLJRKMABAICGrCBAICFrCFZl9zALCNJAICFZCGWqHI8oGBJHG87FBAIAGjGBABCGJRBAFCaJHFQBMMCBC99AKAE6yRKMAKM+lLKFaF99GaG99FaG99GXGXAGCI9HQBAF9FQFEXGXGX9DBBB8/9DBBB+/ABCGJHG1BB+yAB1BBHE+yHI+L+TABCFJHL1BBHK+yHO+L+THN9DBBBB9gHVyAN9DBB/+hANAN+U9DBBBBANAVyHcAc+MHMAECa3yAI+SHIAI+UAcAMAKCa3yAO+SHcAc+U+S+S+R+VHO+U+SHN+L9DBBB9P9d9FQBAN+oRESFMCUUUU94REMAGAE86BBGXGX9DBBB8/9DBBB+/Ac9DBBBB9gyAcAO+U+SHN+L9DBBB9P9d9FQBAN+oRGSFMCUUUU94RGMALAG86BBGXGX9DBBB8/9DBBB+/AI9DBBBB9gyAIAO+U+SHN+L9DBBB9P9d9FQBAN+oRGSFMCUUUU94RGMABAG86BBABCIJRBAFCaJHFQBSGMMAF9FQBEXGXGX9DBBB8/9DBBB+/ABCIJHG8uFB+yAB8uFBHE+yHI+L+TABCGJHL8uFBHK+yHO+L+THN9DBBBB9gHVyAN9DB/+g6ANAN+U9DBBBBANAVyHcAc+MHMAECa3yAI+SHIAI+UAcAMAKCa3yAO+SHcAc+U+S+S+R+VHO+U+SHN+L9DBBB9P9d9FQBAN+oRESFMCUUUU94REMAGAE87FBGXGX9DBBB8/9DBBB+/Ac9DBBBB9gyAcAO+U+SHN+L9DBBB9P9d9FQBAN+oRGSFMCUUUU94RGMALAG87FBGXGX9DBBB8/9DBBB+/AI9DBBBB9gyAIAO+U+SHN+L9DBBB9P9d9FQBAN+oRGSFMCUUUU94RGMABAG87FBABCNJRBAFCaJHFQBMMM/SEIEaE99EaF99GXAF9FQBCBREABRIEXGXGX9D/zI818/AICKJ8uFBHLCEq+y+VHKAI8uFB+y+UHO9DB/+g6+U9DBBB8/9DBBB+/AO9DBBBB9gy+SHN+L9DBBB9P9d9FQBAN+oRVSFMCUUUU94RVMAICIJ8uFBRcAICGJ8uFBRMABALCFJCEZAEqCFWJAV87FBGXGXAKAM+y+UHN9DB/+g6+U9DBBB8/9DBBB+/AN9DBBBB9gy+SHS+L9DBBB9P9d9FQBAS+oRMSFMCUUUU94RMMABALCGJCEZAEqCFWJAM87FBGXGXAKAc+y+UHK9DB/+g6+U9DBBB8/9DBBB+/AK9DBBBB9gy+SHS+L9DBBB9P9d9FQBAS+oRcSFMCUUUU94RcMABALCaJCEZAEqCFWJAc87FBGXGX9DBBU8/AOAO+U+TANAN+U+TAKAK+U+THO9DBBBBAO9DBBBB9gy+R9DB/+g6+U9DBBB8/+SHO+L9DBBB9P9d9FQBAO+oRcSFMCUUUU94RcMABALCEZAEqCFWJAc87FBAICNJRIAECIJREAFCaJHFQBMMM9JBGXAGCGrAF9sHF9FQBEXABAB8oGBHGCNWCN91+yAGCi91CnWCUUU/8EJ+++U84GBABCIJRBAFCaJHFQBMMM9TFEaCBCB8oGUkUUBHFABCEJC98ZJHBjGUkUUBGXGXAB8/BCTWHGuQBCaREABAGlCggEJCTrXBCa6QFMAFREMAEM/lFFFaGXGXAFABqCEZ9FQBABRESFMGXGXAGCT9PQBABRESFMABREEXAEAF8oGBjGBAECIJAFCIJ8oGBjGBAECNJAFCNJ8oGBjGBAECSJAFCSJ8oGBjGBAECTJREAFCTJRFAGC9wJHGCb9LQBMMAGCI9JQBEXAEAF8oGBjGBAFCIJRFAECIJREAGC98JHGCE9LQBMMGXAG9FQBEXAEAF2BB86BBAECFJREAFCFJRFAGCaJHGQBMMABMoFFGaGXGXABCEZ9FQBABRESFMAFCgFZC+BwsN9sRIGXGXAGCT9PQBABRESFMABREEXAEAIjGBAECSJAIjGBAECNJAIjGBAECIJAIjGBAECTJREAGC9wJHGCb9LQBMMAGCI9JQBEXAEAIjGBAECIJREAGC98JHGCE9LQBMMGXAG9FQBEXAEAF86BBAECFJREAGCaJHGQBMMABMMMFBCUNMIT9kBB";
  const wasm_simd = "B9h9z9tFBBBF8dL9gBB9gLaaaaaFa9gEaaaB9gGaaB9gFaFaEQSBBFBFFGEGEGIILF9wFFFLEFBFKNFaFCx/aFMO/LFVK9tv9t9vq95GBt9f9f939h9z9t9f9j9h9s9s9f9jW9vq9zBBp9tv9z9o9v9wW9f9kv9j9v9kv9WvqWv94h919m9mvqBG8Z9tv9z9o9v9wW9f9kv9j9v9kv9J9u9kv94h919m9mvqBIy9tv9z9o9v9wW9f9kv9j9v9kv9J9u9kv949TvZ91v9u9jvBLn9tv9z9o9v9wW9f9kv9j9v9kv69p9sWvq9P9jWBKi9tv9z9o9v9wW9f9kv9j9v9kv69p9sWvq9R919hWBNn9tv9z9o9v9wW9f9kv9j9v9kv69p9sWvq9F949wBcI9z9iqlBMc/j9JSIBTEM9+FLa8jUUUUBCTlRBCBRFEXCBRGCBREEXABCNJAGJAECUaAFAGrCFZHIy86BBAEAIJREAGCFJHGCN9HQBMAFCx+YUUBJAE86BBAFCEWCxkUUBJAB8pEN83EBAFCFJHFCUG9HQBMMkRIbaG97FaK978jUUUUBCU/KBlHL8kUUUUBC9+RKGXAGCFJAI9LQBCaRKAE2BBC+gF9HQBALAEAIJHOAGlAG/8cBBCUoBAG9uC/wgBZHKCUGAKCUG9JyRNAECFJRKCBRVGXEXAVAF9PQFANAFAVlAVANJAF9JyRcGXGXAG9FQBAcCbJHIC9wZHMCE9sRSAMCFWRQAICIrCEJCGrRfCBRbEXAKRTCBRtGXEXGXAOATlAf9PQBCBRKSLMALCU/CBJAtAM9sJRmATAfJRKCBREGXAMCoB9JQBAOAKlC/gB9JQBCBRIEXAmAIJREGXGXGXGXGXATAICKrJ2BBHYCEZfIBFGEBMAECBDtDMIBSEMAEAKDBBIAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnHPCGD+MFAPDQBTFtGmEYIPLdKeOnC0+G+MiDtD9OHdCEDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBAeCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMIBAKCIJAnDeBJAeCx+YUUBJ2BBJRKSGMAEAKDBBNAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnC+P+e+8/4BDtD9OHdCbDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBAeCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMIBAKCNJAnDeBJAeCx+YUUBJ2BBJRKSFMAEAKDBBBDMIBAKCTJRKMGXGXGXGXGXAYCGrCEZfIBFGEBMAECBDtDMITSEMAEAKDBBIAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnHPCGD+MFAPDQBTFtGmEYIPLdKeOnC0+G+MiDtD9OHdCEDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBAeCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMITAKCIJAnDeBJAeCx+YUUBJ2BBJRKSGMAEAKDBBNAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnC+P+e+8/4BDtD9OHdCbDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBAeCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMITAKCNJAnDeBJAeCx+YUUBJ2BBJRKSFMAEAKDBBBDMITAKCTJRKMGXGXGXGXGXAYCIrCEZfIBFGEBMAECBDtDMIASEMAEAKDBBIAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnHPCGD+MFAPDQBTFtGmEYIPLdKeOnC0+G+MiDtD9OHdCEDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBAeCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMIAAKCIJAnDeBJAeCx+YUUBJ2BBJRKSGMAEAKDBBNAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnC+P+e+8/4BDtD9OHdCbDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBAeCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMIAAKCNJAnDeBJAeCx+YUUBJ2BBJRKSFMAEAKDBBBDMIAAKCTJRKMGXGXGXGXGXAYCKrfIBFGEBMAECBDtDMI8wSEMAEAKDBBIAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnHPCGD+MFAPDQBTFtGmEYIPLdKeOnC0+G+MiDtD9OHdCEDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HYCEWCxkUUBJDBEBAYCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HYCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMI8wAKCIJAnDeBJAYCx+YUUBJ2BBJRKSGMAEAKDBBNAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnC+P+e+8/4BDtD9OHdCbDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HYCEWCxkUUBJDBEBAYCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HYCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMI8wAKCNJAnDeBJAYCx+YUUBJ2BBJRKSFMAEAKDBBBDMI8wAKCTJRKMAICoBJREAICUFJAM9LQFAERIAOAKlC/fB9LQBMMGXAEAM9PQBAECErRIEXGXAOAKlCi9PQBCBRKSOMAmAEJRYGXGXGXGXGXATAECKrJ2BBAICKZrCEZfIBFGEBMAYCBDtDMIBSEMAYAKDBBIAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnHPCGD+MFAPDQBTFtGmEYIPLdKeOnC0+G+MiDtD9OHdCEDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBAeCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMIBAKCIJAnDeBJAeCx+YUUBJ2BBJRKSGMAYAKDBBNAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnC+P+e+8/4BDtD9OHdCbDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBAeCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMIBAKCNJAnDeBJAeCx+YUUBJ2BBJRKSFMAYAKDBBBDMIBAKCTJRKMAICGJRIAECTJHEAM9JQBMMGXAK9FQBAKRTAtCFJHtCI6QGSFMMCBRKSEMGXAM9FQBALCUGJAbJREALAbJDBGBRnCBRYEXAEALCU/CBJAYJHIDBIBHdCFD9tAdCFDbHPD9OD9hD9RHdAIAMJDBIBHiCFD9tAiAPD9OD9hD9RHiDQBTFtGmEYIPLdKeOnH8ZAIAQJDBIBHpCFD9tApAPD9OD9hD9RHpAIASJDBIBHyCFD9tAyAPD9OD9hD9RHyDQBTFtGmEYIPLdKeOnH8cDQBFTtGEmYILPdKOenHPAPDQBFGEBFGEBFGEBFGEAnD9uHnDyBjGBAEAGJHIAnAPAPDQILKOILKOILKOILKOD9uHnDyBjGBAIAGJHIAnAPAPDQNVcMNVcMNVcMNVcMD9uHnDyBjGBAIAGJHIAnAPAPDQSQfbSQfbSQfbSQfbD9uHnDyBjGBAIAGJHIAnA8ZA8cDQNVi8ZcMpySQ8c8dfb8e8fHPAPDQBFGEBFGEBFGEBFGED9uHnDyBjGBAIAGJHIAnAPAPDQILKOILKOILKOILKOD9uHnDyBjGBAIAGJHIAnAPAPDQNVcMNVcMNVcMNVcMD9uHnDyBjGBAIAGJHIAnAPAPDQSQfbSQfbSQfbSQfbD9uHnDyBjGBAIAGJHIAnAdAiDQNiV8ZcpMyS8cQ8df8eb8fHdApAyDQNiV8ZcpMyS8cQ8df8eb8fHiDQBFTtGEmYILPdKOenHPAPDQBFGEBFGEBFGEBFGED9uHnDyBjGBAIAGJHIAnAPAPDQILKOILKOILKOILKOD9uHnDyBjGBAIAGJHIAnAPAPDQNVcMNVcMNVcMNVcMD9uHnDyBjGBAIAGJHIAnAPAPDQSQfbSQfbSQfbSQfbD9uHnDyBjGBAIAGJHIAnAdAiDQNVi8ZcMpySQ8c8dfb8e8fHPAPDQBFGEBFGEBFGEBFGED9uHnDyBjGBAIAGJHIAnAPAPDQILKOILKOILKOILKOD9uHnDyBjGBAIAGJHIAnAPAPDQNVcMNVcMNVcMNVcMD9uHnDyBjGBAIAGJHIAnAPAPDQSQfbSQfbSQfbSQfbD9uHnDyBjGBAIAGJREAYCTJHYAM9JQBMMAbCIJHbAG9JQBMMABAVAG9sJALCUGJAcAG9s/8cBBALALCUGJAcCaJAG9sJAG/8cBBMAcCBAKyAVJRVAKQBMC9+RKSFMCBC99AOAKlAGCAAGCA9Ly6yRKMALCU/KBJ8kUUUUBAKMNBT+BUUUBM+KmFTa8jUUUUBCoFlHL8kUUUUBC9+RKGXAFCE9uHOCtJAI9LQBCaRKAE2BBHNC/wFZC/gF9HQBANCbZHVCF9LQBALCoBJCgFCUF/8MBALC84Jha83EBALC8wJha83EBALC8oJha83EBALCAJha83EBALCiJha83EBALCTJha83EBALha83ENALha83EBAEAIJC9wJRcAECFJHNAOJRMGXAF9FQBCQCbAVCF6yRSABRECBRVCBRQCBRfCBRICBRKEXGXAMAcuQBC9+RKSEMGXGXAN2BBHOC/vF9LQBALCoBJAOCIrCa9zAKJCbZCEWJHb8oGIRTAb8oGBRtGXAOCbZHbAS9PQBALAOCa9zAIJCbZCGWJ8oGBAVAbyROAb9FRbGXGXAGCG9HQBABAt87FBABCIJAO87FBABCGJAT87FBSFMAEAtjGBAECNJAOjGBAECIJATjGBMAVAbJRVALCoBJAKCEWJHmAOjGBAmATjGIALAICGWJAOjGBALCoBJAKCFJCbZHKCEWJHTAtjGBATAOjGIAIAbJRIAKCFJRKSGMGXGXAbCb6QBAQAbJAbC989zJCFJRQSFMAM1BBHbCgFZROGXGXAbCa9MQBAMCFJRMSFMAM1BFHbCgBZCOWAOCgBZqROGXAbCa9MQBAMCGJRMSFMAM1BGHbCgBZCfWAOqROGXAbCa9MQBAMCEJRMSFMAM1BEHbCgBZCdWAOqROGXAbCa9MQBAMCIJRMSFMAM2BIC8cWAOqROAMCLJRMMAOCFrCBAOCFZl9zAQJRQMGXGXAGCG9HQBABAt87FBABCIJAQ87FBABCGJAT87FBSFMAEAtjGBAECNJAQjGBAECIJATjGBMALCoBJAKCEWJHOAQjGBAOATjGIALAICGWJAQjGBALCoBJAKCFJCbZHKCEWJHOAtjGBAOAQjGIAICFJRIAKCFJRKSFMGXAOCDF9LQBALAIAcAOCbZJ2BBHbCIrHTlCbZCGWJ8oGBAVCFJHtATyROALAIAblCbZCGWJ8oGBAtAT9FHmJHtAbCbZHTyRbAT9FRTGXGXAGCG9HQBABAV87FBABCIJAb87FBABCGJAO87FBSFMAEAVjGBAECNJAbjGBAECIJAOjGBMALAICGWJAVjGBALCoBJAKCEWJHYAOjGBAYAVjGIALAICFJHICbZCGWJAOjGBALCoBJAKCFJCbZCEWJHYAbjGBAYAOjGIALAIAmJCbZHICGWJAbjGBALCoBJAKCGJCbZHKCEWJHOAVjGBAOAbjGIAKCFJRKAIATJRIAtATJRVSFMAVCBAM2BBHYyHTAOC/+F6HPJROAYCbZRtGXGXAYCIrHmQBAOCFJRbSFMAORbALAIAmlCbZCGWJ8oGBROMGXGXAtQBAbCFJRVSFMAbRVALAIAYlCbZCGWJ8oGBRbMGXGXAP9FQBAMCFJRYSFMAM1BFHYCgFZRTGXGXAYCa9MQBAMCGJRYSFMAM1BGHYCgBZCOWATCgBZqRTGXAYCa9MQBAMCEJRYSFMAM1BEHYCgBZCfWATqRTGXAYCa9MQBAMCIJRYSFMAM1BIHYCgBZCdWATqRTGXAYCa9MQBAMCLJRYSFMAMCKJRYAM2BLC8cWATqRTMATCFrCBATCFZl9zAQJHQRTMGXGXAmCb6QBAYRPSFMAY1BBHMCgFZROGXGXAMCa9MQBAYCFJRPSFMAY1BFHMCgBZCOWAOCgBZqROGXAMCa9MQBAYCGJRPSFMAY1BGHMCgBZCfWAOqROGXAMCa9MQBAYCEJRPSFMAY1BEHMCgBZCdWAOqROGXAMCa9MQBAYCIJRPSFMAYCLJRPAY2BIC8cWAOqROMAOCFrCBAOCFZl9zAQJHQROMGXGXAtCb6QBAPRMSFMAP1BBHMCgFZRbGXGXAMCa9MQBAPCFJRMSFMAP1BFHMCgBZCOWAbCgBZqRbGXAMCa9MQBAPCGJRMSFMAP1BGHMCgBZCfWAbqRbGXAMCa9MQBAPCEJRMSFMAP1BEHMCgBZCdWAbqRbGXAMCa9MQBAPCIJRMSFMAPCLJRMAP2BIC8cWAbqRbMAbCFrCBAbCFZl9zAQJHQRbMGXGXAGCG9HQBABAT87FBABCIJAb87FBABCGJAO87FBSFMAEATjGBAECNJAbjGBAECIJAOjGBMALCoBJAKCEWJHYAOjGBAYATjGIALAICGWJATjGBALCoBJAKCFJCbZCEWJHYAbjGBAYAOjGIALAICFJHICbZCGWJAOjGBALCoBJAKCGJCbZCEWJHOATjGBAOAbjGIALAIAm9FAmCb6qJHICbZCGWJAbjGBAIAt9FAtCb6qJRIAKCEJRKMANCFJRNABCKJRBAECSJREAKCbZRKAICbZRIAfCEJHfAF9JQBMMCBC99AMAc6yRKMALCoFJ8kUUUUBAKM/tIFGa8jUUUUBCTlRLC9+RKGXAFCLJAI9LQBCaRKAE2BBC/+FZC/QF9HQBALhB83ENAECFJRKAEAIJC98JREGXAF9FQBGXAGCG6QBEXGXAKAE9JQBC9+bMAK1BBHGCgFZRIGXGXAGCa9MQBAKCFJRKSFMAK1BFHGCgBZCOWAICgBZqRIGXAGCa9MQBAKCGJRKSFMAK1BGHGCgBZCfWAIqRIGXAGCa9MQBAKCEJRKSFMAK1BEHGCgBZCdWAIqRIGXAGCa9MQBAKCIJRKSFMAK2BIC8cWAIqRIAKCLJRKMALCNJAICFZCGWqHGAICGrCBAICFrCFZl9zAG8oGBJHIjGBABAIjGBABCIJRBAFCaJHFQBSGMMEXGXAKAE9JQBC9+bMAK1BBHGCgFZRIGXGXAGCa9MQBAKCFJRKSFMAK1BFHGCgBZCOWAICgBZqRIGXAGCa9MQBAKCGJRKSFMAK1BGHGCgBZCfWAIqRIGXAGCa9MQBAKCEJRKSFMAK1BEHGCgBZCdWAIqRIGXAGCa9MQBAKCIJRKSFMAK2BIC8cWAIqRIAKCLJRKMABAICGrCBAICFrCFZl9zALCNJAICFZCGWqHI8oGBJHG87FBAIAGjGBABCGJRBAFCaJHFQBMMCBC99AKAE6yRKMAKM/xLGEaK978jUUUUBCAlHE8kUUUUBGXGXAGCI9HQBGXAFC98ZHI9FQBABRGCBRLEXAGAGDBBBHKCiD+rFCiD+sFD/6FHOAKCND+rFCiD+sFD/6FAOD/gFAKCTD+rFCiD+sFD/6FHND/gFD/kFD/lFHVCBDtD+2FHcAOCUUUU94DtHMD9OD9RD/kFHO9DBB/+hDYAOAOD/mFAVAVD/mFANAcANAMD9OD9RD/kFHOAOD/mFD/kFD/kFD/jFD/nFHND/mF9DBBX9LDYHcD/kFCgFDtD9OAKCUUU94DtD9OD9QAOAND/mFAcD/kFCND+rFCU/+EDtD9OD9QAVAND/mFAcD/kFCTD+rFCUU/8ODtD9OD9QDMBBAGCTJRGALCIJHLAI9JQBMMAIAF9PQFAEAFCEZHLCGWHGqCBCTAGl/8MBAEABAICGWJHIAG/8cBBGXAL9FQBAEAEDBIBHKCiD+rFCiD+sFD/6FHOAKCND+rFCiD+sFD/6FAOD/gFAKCTD+rFCiD+sFD/6FHND/gFD/kFD/lFHVCBDtD+2FHcAOCUUUU94DtHMD9OD9RD/kFHO9DBB/+hDYAOAOD/mFAVAVD/mFANAcANAMD9OD9RD/kFHOAOD/mFD/kFD/kFD/jFD/nFHND/mF9DBBX9LDYHcD/kFCgFDtD9OAKCUUU94DtD9OD9QAOAND/mFAcD/kFCND+rFCU/+EDtD9OD9QAVAND/mFAcD/kFCTD+rFCUU/8ODtD9OD9QDMIBMAIAEAG/8cBBSFMABAFC98ZHGT+HUUUBAGAF9PQBAEAFCEZHICEWHLJCBCAALl/8MBAEABAGCEWJHGAL/8cBBAEAIT+HUUUBAGAEAL/8cBBMAECAJ8kUUUUBM+yEGGaO97GXAF9FQBCBRGEXABCTJHEAEDBBBHICBDtHLCUU98D8cFCUU98D8cEHKD9OABDBBBHOAIDQILKOSQfbPden8c8d8e8fCggFDtD9OD/6FAOAIDQBFGENVcMTtmYi8ZpyHICTD+sFD/6FHND/gFAICTD+rFCTD+sFD/6FHVD/gFD/kFD/lFHI9DB/+g6DYAVAIALD+2FHLAVCUUUU94DtHcD9OD9RD/kFHVAVD/mFAIAID/mFANALANAcD9OD9RD/kFHIAID/mFD/kFD/kFD/jFD/nFHND/mF9DBBX9LDYHLD/kFCTD+rFAVAND/mFALD/kFCggEDtD9OD9QHVAIAND/mFALD/kFCaDbCBDnGCBDnECBDnKCBDnOCBDncCBDnMCBDnfCBDnbD9OHIDQNVi8ZcMpySQ8c8dfb8e8fD9QDMBBABAOAKD9OAVAIDQBFTtGEmYILPdKOenD9QDMBBABCAJRBAGCIJHGAF9JQBMMM94FEa8jUUUUBCAlHE8kUUUUBABAFC98ZHIT+JUUUBGXAIAF9PQBAEAFCEZHLCEWHFJCBCAAFl/8MBAEABAICEWJHBAF/8cBBAEALT+JUUUBABAEAF/8cBBMAECAJ8kUUUUBM/hEIGaF97FaL978jUUUUBCTlRGGXAF9FQBCBREEXAGABDBBBHIABCTJHLDBBBHKDQILKOSQfbPden8c8d8e8fHOCTD+sFHNCID+rFDMIBAB9DBBU8/DY9D/zI818/DYANCEDtD9QD/6FD/nFHNAIAKDQBFGENVcMTtmYi8ZpyHICTD+rFCTD+sFD/6FD/mFHKAKD/mFANAICTD+sFD/6FD/mFHVAVD/mFANAOCTD+rFCTD+sFD/6FD/mFHOAOD/mFD/kFD/kFD/lFCBDtD+4FD/jF9DB/+g6DYHND/mF9DBBX9LDYHID/kFCggEDtHcD9OAVAND/mFAID/kFCTD+rFD9QHVAOAND/mFAID/kFCTD+rFAKAND/mFAID/kFAcD9OD9QHNDQBFTtGEmYILPdKOenHID8dBAGDBIBDyB+t+J83EBABCNJAID8dFAGDBIBDyF+t+J83EBALAVANDQNVi8ZcMpySQ8c8dfb8e8fHND8dBAGDBIBDyG+t+J83EBABCiJAND8dFAGDBIBDyE+t+J83EBABCAJRBAECIJHEAF9JQBMMM/3FGEaF978jUUUUBCoBlREGXAGCGrAF9sHIC98ZHL9FQBCBRGABRFEXAFAFDBBBHKCND+rFCND+sFD/6FAKCiD+sFCnD+rFCUUU/8EDtD+uFD/mFDMBBAFCTJRFAGCIJHGAL9JQBMMGXALAI9PQBAEAICEZHGCGWHFqCBCoBAFl/8MBAEABALCGWJHLAF/8cBBGXAG9FQBAEAEDBIBHKCND+rFCND+sFD/6FAKCiD+sFCnD+rFCUUU/8EDtD+uFD/mFDMIBMALAEAF/8cBBMM9TFEaCBCB8oGUkUUBHFABCEJC98ZJHBjGUkUUBGXGXAB8/BCTWHGuQBCaREABAGlCggEJCTrXBCa6QFMAFREMAEMMMFBCUNMIT9tBB";
  const detector = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 3, 2, 0, 0, 5, 3, 1, 0, 1, 12, 1, 0, 10, 22, 2, 12, 0, 65, 0, 65, 0, 65, 0, 252, 10, 0, 0, 11, 7, 0, 65, 0, 253, 15, 26, 11]);
  const wasmpack = new Uint8Array([32, 0, 65, 253, 3, 1, 2, 34, 4, 106, 6, 5, 11, 8, 7, 20, 13, 33, 12, 16, 128, 9, 116, 64, 19, 113, 127, 15, 10, 21, 22, 14, 255, 66, 24, 54, 136, 107, 18, 23, 192, 26, 114, 118, 132, 17, 77, 101, 130, 144, 27, 87, 131, 44, 45, 74, 156, 154, 70, 167]);
  const FILTERS = {
    0: "",
    1: "meshopt_decodeFilterOct",
    2: "meshopt_decodeFilterQuat",
    3: "meshopt_decodeFilterExp",
    NONE: "",
    OCTAHEDRAL: "meshopt_decodeFilterOct",
    QUATERNION: "meshopt_decodeFilterQuat",
    EXPONENTIAL: "meshopt_decodeFilterExp"
  };
  const DECODERS = {
    0: "meshopt_decodeVertexBuffer",
    1: "meshopt_decodeIndexBuffer",
    2: "meshopt_decodeIndexSequence",
    ATTRIBUTES: "meshopt_decodeVertexBuffer",
    TRIANGLES: "meshopt_decodeIndexBuffer",
    INDICES: "meshopt_decodeIndexSequence"
  };
  async function meshoptDecodeGltfBuffer(target, count, size, source, mode) {
    let filter = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : "NONE";
    const instance = await loadWasmInstance();
    decode$6(instance, instance.exports[DECODERS[mode]], target, count, size, source, instance.exports[FILTERS[filter || "NONE"]]);
  }
  let wasmPromise;
  async function loadWasmInstance() {
    if (!wasmPromise) {
      wasmPromise = loadWasmModule();
    }
    return wasmPromise;
  }
  async function loadWasmModule() {
    let wasm2 = wasm_base;
    if (WebAssembly.validate(detector)) {
      wasm2 = wasm_simd;
      console.log("Warning: meshopt_decoder is using experimental SIMD support");
    }
    const result = await WebAssembly.instantiate(unpack(wasm2), {});
    await result.instance.exports.__wasm_call_ctors();
    return result.instance;
  }
  function unpack(data) {
    const result = new Uint8Array(data.length);
    for (let i2 = 0; i2 < data.length; ++i2) {
      const ch = data.charCodeAt(i2);
      result[i2] = ch > 96 ? ch - 71 : ch > 64 ? ch - 65 : ch > 47 ? ch + 4 : ch > 46 ? 63 : 62;
    }
    let write = 0;
    for (let i2 = 0; i2 < data.length; ++i2) {
      result[write++] = result[i2] < 60 ? wasmpack[result[i2]] : (result[i2] - 60) * 64 + result[++i2];
    }
    return result.buffer.slice(0, write);
  }
  function decode$6(instance, fun, target, count, size, source, filter) {
    const sbrk = instance.exports.sbrk;
    const count4 = count + 3 & ~3;
    const tp = sbrk(count4 * size);
    const sp = sbrk(source.length);
    const heap = new Uint8Array(instance.exports.memory.buffer);
    heap.set(source, sp);
    const res = fun(tp, count, size, sp, source.length);
    if (res === 0 && filter) {
      filter(tp, count4, size);
    }
    target.set(heap.subarray(tp, tp + count * size));
    sbrk(tp - sbrk(0));
    if (res !== 0) {
      throw new Error(`Malformed buffer data: ${res}`);
    }
  }
  const EXT_MESHOPT_COMPRESSION = "EXT_meshopt_compression";
  const name$7 = EXT_MESHOPT_COMPRESSION;
  async function decode$5(gltfData, options) {
    var _options$gltf, _options$gltf2;
    const scenegraph = new GLTFScenegraph(gltfData);
    if (!(options !== null && options !== void 0 && (_options$gltf = options.gltf) !== null && _options$gltf !== void 0 && _options$gltf.decompressMeshes) || !((_options$gltf2 = options.gltf) !== null && _options$gltf2 !== void 0 && _options$gltf2.loadBuffers)) {
      return;
    }
    const promises = [];
    for (const bufferViewIndex of gltfData.json.bufferViews || []) {
      promises.push(decodeMeshoptBufferView(scenegraph, bufferViewIndex));
    }
    await Promise.all(promises);
    scenegraph.removeExtension(EXT_MESHOPT_COMPRESSION);
  }
  async function decodeMeshoptBufferView(scenegraph, bufferView) {
    const meshoptExtension = scenegraph.getObjectExtension(bufferView, EXT_MESHOPT_COMPRESSION);
    if (meshoptExtension) {
      const {
        byteOffset = 0,
        byteLength = 0,
        byteStride,
        count,
        mode,
        filter = "NONE",
        buffer: bufferIndex
      } = meshoptExtension;
      const buffer = scenegraph.gltf.buffers[bufferIndex];
      const source = new Uint8Array(buffer.arrayBuffer, buffer.byteOffset + byteOffset, byteLength);
      const result = new Uint8Array(scenegraph.gltf.buffers[bufferView.buffer].arrayBuffer, bufferView.byteOffset, bufferView.byteLength);
      await meshoptDecodeGltfBuffer(result, count, byteStride, source, mode, filter);
      scenegraph.removeObjectExtension(bufferView, EXT_MESHOPT_COMPRESSION);
    }
  }
  const EXT_meshopt_compression = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    decode: decode$5,
    name: name$7
  }, Symbol.toStringTag, { value: "Module" }));
  const EXT_TEXTURE_WEBP = "EXT_texture_webp";
  const name$6 = EXT_TEXTURE_WEBP;
  function preprocess$3(gltfData, options) {
    const scenegraph = new GLTFScenegraph(gltfData);
    if (!isImageFormatSupported("image/webp")) {
      if (scenegraph.getRequiredExtensions().includes(EXT_TEXTURE_WEBP)) {
        throw new Error(`gltf: Required extension ${EXT_TEXTURE_WEBP} not supported by browser`);
      }
      return;
    }
    const {
      json
    } = scenegraph;
    for (const texture of json.textures || []) {
      const extension = scenegraph.getObjectExtension(texture, EXT_TEXTURE_WEBP);
      if (extension) {
        texture.source = extension.source;
      }
      scenegraph.removeObjectExtension(texture, EXT_TEXTURE_WEBP);
    }
    scenegraph.removeExtension(EXT_TEXTURE_WEBP);
  }
  const EXT_texture_webp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    name: name$6,
    preprocess: preprocess$3
  }, Symbol.toStringTag, { value: "Module" }));
  const KHR_TEXTURE_BASISU = "KHR_texture_basisu";
  const name$5 = KHR_TEXTURE_BASISU;
  function preprocess$2(gltfData, options) {
    const scene = new GLTFScenegraph(gltfData);
    const {
      json
    } = scene;
    for (const texture of json.textures || []) {
      const extension = scene.getObjectExtension(texture, KHR_TEXTURE_BASISU);
      if (extension) {
        texture.source = extension.source;
        scene.removeObjectExtension(texture, KHR_TEXTURE_BASISU);
      }
    }
    scene.removeExtension(KHR_TEXTURE_BASISU);
  }
  const KHR_texture_basisu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    name: name$5,
    preprocess: preprocess$2
  }, Symbol.toStringTag, { value: "Module" }));
  function getGLTFAccessors(attributes) {
    const accessors = {};
    for (const name2 in attributes) {
      const attribute = attributes[name2];
      if (name2 !== "indices") {
        const glTFAccessor = getGLTFAccessor(attribute);
        accessors[name2] = glTFAccessor;
      }
    }
    return accessors;
  }
  function getGLTFAccessor(attribute) {
    const {
      buffer,
      size,
      count
    } = getAccessorData(attribute);
    const glTFAccessor = {
      value: buffer,
      size,
      byteOffset: 0,
      count,
      type: getAccessorTypeFromSize(size),
      componentType: getComponentTypeFromArray(buffer)
    };
    return glTFAccessor;
  }
  function getAccessorData(attribute) {
    let buffer = attribute;
    let size = 1;
    let count = 0;
    if (attribute && attribute.value) {
      buffer = attribute.value;
      size = attribute.size || 1;
    }
    if (buffer) {
      if (!ArrayBuffer.isView(buffer)) {
        buffer = toTypedArray(buffer, Float32Array);
      }
      count = buffer.length / size;
    }
    return {
      buffer,
      size,
      count
    };
  }
  function toTypedArray(array, ArrayType) {
    let convertTypedArrays = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
    if (!array) {
      return null;
    }
    if (Array.isArray(array)) {
      return new ArrayType(array);
    }
    if (convertTypedArrays && !(array instanceof ArrayType)) {
      return new ArrayType(array);
    }
    return array;
  }
  const KHR_DRACO_MESH_COMPRESSION = "KHR_draco_mesh_compression";
  const name$4 = KHR_DRACO_MESH_COMPRESSION;
  function preprocess$1(gltfData, options, context) {
    const scenegraph = new GLTFScenegraph(gltfData);
    for (const primitive of makeMeshPrimitiveIterator(scenegraph)) {
      if (scenegraph.getObjectExtension(primitive, KHR_DRACO_MESH_COMPRESSION))
        ;
    }
  }
  async function decode$4(gltfData, options, context) {
    var _options$gltf;
    if (!(options !== null && options !== void 0 && (_options$gltf = options.gltf) !== null && _options$gltf !== void 0 && _options$gltf.decompressMeshes)) {
      return;
    }
    const scenegraph = new GLTFScenegraph(gltfData);
    const promises = [];
    for (const primitive of makeMeshPrimitiveIterator(scenegraph)) {
      if (scenegraph.getObjectExtension(primitive, KHR_DRACO_MESH_COMPRESSION)) {
        promises.push(decompressPrimitive(scenegraph, primitive, options, context));
      }
    }
    await Promise.all(promises);
    scenegraph.removeExtension(KHR_DRACO_MESH_COMPRESSION);
  }
  function encode$3(gltfData) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const scenegraph = new GLTFScenegraph(gltfData);
    for (const mesh of scenegraph.json.meshes || []) {
      compressMesh(mesh, options);
      scenegraph.addRequiredExtension(KHR_DRACO_MESH_COMPRESSION);
    }
  }
  async function decompressPrimitive(scenegraph, primitive, options, context) {
    const dracoExtension = scenegraph.getObjectExtension(primitive, KHR_DRACO_MESH_COMPRESSION);
    if (!dracoExtension) {
      return;
    }
    const buffer = scenegraph.getTypedArrayForBufferView(dracoExtension.bufferView);
    const bufferCopy = sliceArrayBuffer(buffer.buffer, buffer.byteOffset);
    const dracoOptions = {
      ...options
    };
    delete dracoOptions["3d-tiles"];
    const decodedData = await parseFromContext(bufferCopy, DracoLoader, dracoOptions, context);
    const decodedAttributes = getGLTFAccessors(decodedData.attributes);
    for (const [attributeName, decodedAttribute] of Object.entries(decodedAttributes)) {
      if (attributeName in primitive.attributes) {
        const accessorIndex = primitive.attributes[attributeName];
        const accessor = scenegraph.getAccessor(accessorIndex);
        if (accessor !== null && accessor !== void 0 && accessor.min && accessor !== null && accessor !== void 0 && accessor.max) {
          decodedAttribute.min = accessor.min;
          decodedAttribute.max = accessor.max;
        }
      }
    }
    primitive.attributes = decodedAttributes;
    if (decodedData.indices) {
      primitive.indices = getGLTFAccessor(decodedData.indices);
    }
    scenegraph.removeObjectExtension(primitive, KHR_DRACO_MESH_COMPRESSION);
    checkPrimitive(primitive);
  }
  function compressMesh(attributes, indices) {
    var _context$parseSync;
    let mode = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 4;
    let options = arguments.length > 3 ? arguments[3] : void 0;
    let context = arguments.length > 4 ? arguments[4] : void 0;
    if (!options.DracoWriter) {
      throw new Error("options.gltf.DracoWriter not provided");
    }
    const compressedData = options.DracoWriter.encodeSync({
      attributes
    });
    const decodedData = context === null || context === void 0 ? void 0 : (_context$parseSync = context.parseSync) === null || _context$parseSync === void 0 ? void 0 : _context$parseSync.call(context, {
      attributes
    });
    const fauxAccessors = options._addFauxAttributes(decodedData.attributes);
    const bufferViewIndex = options.addBufferView(compressedData);
    const glTFMesh = {
      primitives: [{
        attributes: fauxAccessors,
        mode,
        extensions: {
          [KHR_DRACO_MESH_COMPRESSION]: {
            bufferView: bufferViewIndex,
            attributes: fauxAccessors
          }
        }
      }]
    };
    return glTFMesh;
  }
  function checkPrimitive(primitive) {
    if (!primitive.attributes && Object.keys(primitive.attributes).length > 0) {
      throw new Error("glTF: Empty primitive detected: Draco decompression failure?");
    }
  }
  function* makeMeshPrimitiveIterator(scenegraph) {
    for (const mesh of scenegraph.json.meshes || []) {
      for (const primitive of mesh.primitives) {
        yield primitive;
      }
    }
  }
  const KHR_draco_mesh_compression = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    decode: decode$4,
    encode: encode$3,
    name: name$4,
    preprocess: preprocess$1
  }, Symbol.toStringTag, { value: "Module" }));
  const EXT_MESHOPT_TRANSFORM = "KHR_texture_transform";
  const name$3 = EXT_MESHOPT_TRANSFORM;
  const scratchVector = new Vector3();
  const scratchRotationMatrix = new Matrix3();
  const scratchScaleMatrix = new Matrix3();
  async function decode$3(gltfData, options) {
    var _options$gltf;
    const gltfScenegraph = new GLTFScenegraph(gltfData);
    const hasExtension = gltfScenegraph.hasExtension(EXT_MESHOPT_TRANSFORM);
    if (!hasExtension || !((_options$gltf = options.gltf) !== null && _options$gltf !== void 0 && _options$gltf.loadBuffers)) {
      return;
    }
    const materials = gltfData.json.materials || [];
    for (let i2 = 0; i2 < materials.length; i2++) {
      transformTexCoords(i2, gltfData);
    }
  }
  function transformTexCoords(materialIndex, gltfData) {
    var _gltfData$json$materi, _material$pbrMetallic, _material$pbrMetallic2;
    const processedTexCoords = [];
    const material = (_gltfData$json$materi = gltfData.json.materials) === null || _gltfData$json$materi === void 0 ? void 0 : _gltfData$json$materi[materialIndex];
    const baseColorTexture = material === null || material === void 0 ? void 0 : (_material$pbrMetallic = material.pbrMetallicRoughness) === null || _material$pbrMetallic === void 0 ? void 0 : _material$pbrMetallic.baseColorTexture;
    if (baseColorTexture) {
      transformPrimitives(gltfData, materialIndex, baseColorTexture, processedTexCoords);
    }
    const emisiveTexture = material === null || material === void 0 ? void 0 : material.emissiveTexture;
    if (emisiveTexture) {
      transformPrimitives(gltfData, materialIndex, emisiveTexture, processedTexCoords);
    }
    const normalTexture = material === null || material === void 0 ? void 0 : material.normalTexture;
    if (normalTexture) {
      transformPrimitives(gltfData, materialIndex, normalTexture, processedTexCoords);
    }
    const occlusionTexture = material === null || material === void 0 ? void 0 : material.occlusionTexture;
    if (occlusionTexture) {
      transformPrimitives(gltfData, materialIndex, occlusionTexture, processedTexCoords);
    }
    const metallicRoughnessTexture = material === null || material === void 0 ? void 0 : (_material$pbrMetallic2 = material.pbrMetallicRoughness) === null || _material$pbrMetallic2 === void 0 ? void 0 : _material$pbrMetallic2.metallicRoughnessTexture;
    if (metallicRoughnessTexture) {
      transformPrimitives(gltfData, materialIndex, metallicRoughnessTexture, processedTexCoords);
    }
  }
  function transformPrimitives(gltfData, materialIndex, texture, processedTexCoords) {
    const transformParameters = getTransformParameters(texture, processedTexCoords);
    if (!transformParameters) {
      return;
    }
    const meshes = gltfData.json.meshes || [];
    for (const mesh of meshes) {
      for (const primitive of mesh.primitives) {
        const material = primitive.material;
        if (Number.isFinite(material) && materialIndex === material) {
          transformPrimitive(gltfData, primitive, transformParameters);
        }
      }
    }
  }
  function getTransformParameters(texture, processedTexCoords) {
    var _texture$extensions;
    const textureInfo = (_texture$extensions = texture.extensions) === null || _texture$extensions === void 0 ? void 0 : _texture$extensions[EXT_MESHOPT_TRANSFORM];
    const {
      texCoord: originalTexCoord = 0
    } = texture;
    const {
      texCoord = originalTexCoord
    } = textureInfo;
    const isProcessed = processedTexCoords.findIndex((_ref) => {
      let [original, newTexCoord] = _ref;
      return original === originalTexCoord && newTexCoord === texCoord;
    }) !== -1;
    if (!isProcessed) {
      const matrix = makeTransformationMatrix(textureInfo);
      if (originalTexCoord !== texCoord) {
        texture.texCoord = texCoord;
      }
      processedTexCoords.push([originalTexCoord, texCoord]);
      return {
        originalTexCoord,
        texCoord,
        matrix
      };
    }
    return null;
  }
  function transformPrimitive(gltfData, primitive, transformParameters) {
    const {
      originalTexCoord,
      texCoord,
      matrix
    } = transformParameters;
    const texCoordAccessor = primitive.attributes[`TEXCOORD_${originalTexCoord}`];
    if (Number.isFinite(texCoordAccessor)) {
      var _gltfData$json$access;
      const accessor = (_gltfData$json$access = gltfData.json.accessors) === null || _gltfData$json$access === void 0 ? void 0 : _gltfData$json$access[texCoordAccessor];
      if (accessor && accessor.bufferView) {
        var _gltfData$json$buffer;
        const bufferView = (_gltfData$json$buffer = gltfData.json.bufferViews) === null || _gltfData$json$buffer === void 0 ? void 0 : _gltfData$json$buffer[accessor.bufferView];
        if (bufferView) {
          const {
            arrayBuffer,
            byteOffset: bufferByteOffset
          } = gltfData.buffers[bufferView.buffer];
          const byteOffset = (bufferByteOffset || 0) + (accessor.byteOffset || 0) + (bufferView.byteOffset || 0);
          const {
            ArrayType,
            length: length2
          } = getAccessorArrayTypeAndLength(accessor, bufferView);
          const bytes = BYTES$1[accessor.componentType];
          const components = COMPONENTS$1[accessor.type];
          const elementAddressScale = bufferView.byteStride || bytes * components;
          const result = new Float32Array(length2);
          for (let i2 = 0; i2 < accessor.count; i2++) {
            const uv = new ArrayType(arrayBuffer, byteOffset + i2 * elementAddressScale, 2);
            scratchVector.set(uv[0], uv[1], 1);
            scratchVector.transformByMatrix3(matrix);
            result.set([scratchVector[0], scratchVector[1]], i2 * components);
          }
          if (originalTexCoord === texCoord) {
            updateGltf(accessor, bufferView, gltfData.buffers, result);
          } else {
            createAttribute(texCoord, accessor, primitive, gltfData, result);
          }
        }
      }
    }
  }
  function updateGltf(accessor, bufferView, buffers, newTexCoordArray) {
    accessor.componentType = 5126;
    buffers.push({
      arrayBuffer: newTexCoordArray.buffer,
      byteOffset: 0,
      byteLength: newTexCoordArray.buffer.byteLength
    });
    bufferView.buffer = buffers.length - 1;
    bufferView.byteLength = newTexCoordArray.buffer.byteLength;
    bufferView.byteOffset = 0;
    delete bufferView.byteStride;
  }
  function createAttribute(newTexCoord, originalAccessor, primitive, gltfData, newTexCoordArray) {
    gltfData.buffers.push({
      arrayBuffer: newTexCoordArray.buffer,
      byteOffset: 0,
      byteLength: newTexCoordArray.buffer.byteLength
    });
    const bufferViews = gltfData.json.bufferViews;
    if (!bufferViews) {
      return;
    }
    bufferViews.push({
      buffer: gltfData.buffers.length - 1,
      byteLength: newTexCoordArray.buffer.byteLength,
      byteOffset: 0
    });
    const accessors = gltfData.json.accessors;
    if (!accessors) {
      return;
    }
    accessors.push({
      bufferView: (bufferViews === null || bufferViews === void 0 ? void 0 : bufferViews.length) - 1,
      byteOffset: 0,
      componentType: 5126,
      count: originalAccessor.count,
      type: "VEC2"
    });
    primitive.attributes[`TEXCOORD_${newTexCoord}`] = accessors.length - 1;
  }
  function makeTransformationMatrix(extensionData) {
    const {
      offset = [0, 0],
      rotation = 0,
      scale: scale2 = [1, 1]
    } = extensionData;
    const translationMatrix = new Matrix3().set(1, 0, 0, 0, 1, 0, offset[0], offset[1], 1);
    const rotationMatrix = scratchRotationMatrix.set(Math.cos(rotation), Math.sin(rotation), 0, -Math.sin(rotation), Math.cos(rotation), 0, 0, 0, 1);
    const scaleMatrix = scratchScaleMatrix.set(scale2[0], 0, 0, 0, scale2[1], 0, 0, 0, 1);
    return translationMatrix.multiplyRight(rotationMatrix).multiplyRight(scaleMatrix);
  }
  const KHR_texture_transform = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    decode: decode$3,
    name: name$3
  }, Symbol.toStringTag, { value: "Module" }));
  const KHR_LIGHTS_PUNCTUAL = "KHR_lights_punctual";
  const name$2 = KHR_LIGHTS_PUNCTUAL;
  async function decode$2(gltfData) {
    const gltfScenegraph = new GLTFScenegraph(gltfData);
    const {
      json
    } = gltfScenegraph;
    const extension = gltfScenegraph.getExtension(KHR_LIGHTS_PUNCTUAL);
    if (extension) {
      gltfScenegraph.json.lights = extension.lights;
      gltfScenegraph.removeExtension(KHR_LIGHTS_PUNCTUAL);
    }
    for (const node2 of json.nodes || []) {
      const nodeExtension = gltfScenegraph.getObjectExtension(node2, KHR_LIGHTS_PUNCTUAL);
      if (nodeExtension) {
        node2.light = nodeExtension.light;
      }
      gltfScenegraph.removeObjectExtension(node2, KHR_LIGHTS_PUNCTUAL);
    }
  }
  async function encode$2(gltfData) {
    const gltfScenegraph = new GLTFScenegraph(gltfData);
    const {
      json
    } = gltfScenegraph;
    if (json.lights) {
      const extension = gltfScenegraph.addExtension(KHR_LIGHTS_PUNCTUAL);
      assert$1(!extension.lights);
      extension.lights = json.lights;
      delete json.lights;
    }
    if (gltfScenegraph.json.lights) {
      for (const light of gltfScenegraph.json.lights) {
        const node2 = light.node;
        gltfScenegraph.addObjectExtension(node2, KHR_LIGHTS_PUNCTUAL, light);
      }
      delete gltfScenegraph.json.lights;
    }
  }
  const KHR_lights_punctual = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    decode: decode$2,
    encode: encode$2,
    name: name$2
  }, Symbol.toStringTag, { value: "Module" }));
  const KHR_MATERIALS_UNLIT = "KHR_materials_unlit";
  const name$1 = KHR_MATERIALS_UNLIT;
  async function decode$1(gltfData) {
    const gltfScenegraph = new GLTFScenegraph(gltfData);
    const {
      json
    } = gltfScenegraph;
    for (const material of json.materials || []) {
      const extension = material.extensions && material.extensions.KHR_materials_unlit;
      if (extension) {
        material.unlit = true;
      }
      gltfScenegraph.removeObjectExtension(material, KHR_MATERIALS_UNLIT);
    }
    gltfScenegraph.removeExtension(KHR_MATERIALS_UNLIT);
  }
  function encode$1(gltfData) {
    const gltfScenegraph = new GLTFScenegraph(gltfData);
    const {
      json
    } = gltfScenegraph;
    if (gltfScenegraph.materials) {
      for (const material of json.materials || []) {
        if (material.unlit) {
          delete material.unlit;
          gltfScenegraph.addObjectExtension(material, KHR_MATERIALS_UNLIT, {});
          gltfScenegraph.addExtension(KHR_MATERIALS_UNLIT);
        }
      }
    }
  }
  const KHR_materials_unlit = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    decode: decode$1,
    encode: encode$1,
    name: name$1
  }, Symbol.toStringTag, { value: "Module" }));
  const KHR_TECHNIQUES_WEBGL = "KHR_techniques_webgl";
  const name = KHR_TECHNIQUES_WEBGL;
  async function decode(gltfData) {
    const gltfScenegraph = new GLTFScenegraph(gltfData);
    const {
      json
    } = gltfScenegraph;
    const extension = gltfScenegraph.getExtension(KHR_TECHNIQUES_WEBGL);
    if (extension) {
      const techniques = resolveTechniques(extension, gltfScenegraph);
      for (const material of json.materials || []) {
        const materialExtension = gltfScenegraph.getObjectExtension(material, KHR_TECHNIQUES_WEBGL);
        if (materialExtension) {
          material.technique = Object.assign({}, materialExtension, techniques[materialExtension.technique]);
          material.technique.values = resolveValues(material.technique, gltfScenegraph);
        }
        gltfScenegraph.removeObjectExtension(material, KHR_TECHNIQUES_WEBGL);
      }
      gltfScenegraph.removeExtension(KHR_TECHNIQUES_WEBGL);
    }
  }
  async function encode(gltfData, options) {
  }
  function resolveTechniques(techniquesExtension, gltfScenegraph) {
    const {
      programs = [],
      shaders = [],
      techniques = []
    } = techniquesExtension;
    const textDecoder = new TextDecoder();
    shaders.forEach((shader) => {
      if (Number.isFinite(shader.bufferView)) {
        shader.code = textDecoder.decode(gltfScenegraph.getTypedArrayForBufferView(shader.bufferView));
      } else {
        throw new Error("KHR_techniques_webgl: no shader code");
      }
    });
    programs.forEach((program) => {
      program.fragmentShader = shaders[program.fragmentShader];
      program.vertexShader = shaders[program.vertexShader];
    });
    techniques.forEach((technique) => {
      technique.program = programs[technique.program];
    });
    return techniques;
  }
  function resolveValues(technique, gltfScenegraph) {
    const values = Object.assign({}, technique.values);
    Object.keys(technique.uniforms || {}).forEach((uniform) => {
      if (technique.uniforms[uniform].value && !(uniform in values)) {
        values[uniform] = technique.uniforms[uniform].value;
      }
    });
    Object.keys(values).forEach((uniform) => {
      if (typeof values[uniform] === "object" && values[uniform].index !== void 0) {
        values[uniform].texture = gltfScenegraph.getTexture(values[uniform].index);
      }
    });
    return values;
  }
  const KHR_techniques_webgl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    decode,
    encode,
    name
  }, Symbol.toStringTag, { value: "Module" }));
  const EXTENSIONS = [EXT_structural_metadata, EXT_mesh_features, EXT_meshopt_compression, EXT_texture_webp, KHR_texture_basisu, KHR_draco_mesh_compression, KHR_lights_punctual, KHR_materials_unlit, KHR_techniques_webgl, KHR_texture_transform, EXT_feature_metadata];
  function preprocessExtensions(gltf) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let context = arguments.length > 2 ? arguments[2] : void 0;
    const extensions = EXTENSIONS.filter((extension) => useExtension(extension.name, options));
    for (const extension of extensions) {
      var _extension$preprocess;
      (_extension$preprocess = extension.preprocess) === null || _extension$preprocess === void 0 ? void 0 : _extension$preprocess.call(extension, gltf, options, context);
    }
  }
  async function decodeExtensions(gltf) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let context = arguments.length > 2 ? arguments[2] : void 0;
    const extensions = EXTENSIONS.filter((extension) => useExtension(extension.name, options));
    for (const extension of extensions) {
      var _extension$decode;
      await ((_extension$decode = extension.decode) === null || _extension$decode === void 0 ? void 0 : _extension$decode.call(extension, gltf, options, context));
    }
  }
  function useExtension(extensionName, options) {
    var _options$gltf;
    const excludes = (options === null || options === void 0 ? void 0 : (_options$gltf = options.gltf) === null || _options$gltf === void 0 ? void 0 : _options$gltf.excludeExtensions) || {};
    const exclude = extensionName in excludes && !excludes[extensionName];
    return !exclude;
  }
  const KHR_BINARY_GLTF = "KHR_binary_glTF";
  function preprocess(gltfData) {
    const gltfScenegraph = new GLTFScenegraph(gltfData);
    const {
      json
    } = gltfScenegraph;
    for (const image of json.images || []) {
      const extension = gltfScenegraph.getObjectExtension(image, KHR_BINARY_GLTF);
      if (extension) {
        Object.assign(image, extension);
      }
      gltfScenegraph.removeObjectExtension(image, KHR_BINARY_GLTF);
    }
    if (json.buffers && json.buffers[0]) {
      delete json.buffers[0].uri;
    }
    gltfScenegraph.removeExtension(KHR_BINARY_GLTF);
  }
  const GLTF_ARRAYS = {
    accessors: "accessor",
    animations: "animation",
    buffers: "buffer",
    bufferViews: "bufferView",
    images: "image",
    materials: "material",
    meshes: "mesh",
    nodes: "node",
    samplers: "sampler",
    scenes: "scene",
    skins: "skin",
    textures: "texture"
  };
  const GLTF_KEYS = {
    accessor: "accessors",
    animations: "animation",
    buffer: "buffers",
    bufferView: "bufferViews",
    image: "images",
    material: "materials",
    mesh: "meshes",
    node: "nodes",
    sampler: "samplers",
    scene: "scenes",
    skin: "skins",
    texture: "textures"
  };
  class GLTFV1Normalizer {
    constructor() {
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
      };
      this.json = void 0;
    }
    normalize(gltf, options) {
      this.json = gltf.json;
      const json = gltf.json;
      switch (json.asset && json.asset.version) {
        case "2.0":
          return;
        case void 0:
        case "1.0":
          break;
        default:
          console.warn(`glTF: Unknown version ${json.asset.version}`);
          return;
      }
      if (!options.normalize) {
        throw new Error("glTF v1 is not supported.");
      }
      console.warn("Converting glTF v1 to glTF v2 format. This is experimental and may fail.");
      this._addAsset(json);
      this._convertTopLevelObjectsToArrays(json);
      preprocess(gltf);
      this._convertObjectIdsToArrayIndices(json);
      this._updateObjects(json);
      this._updateMaterial(json);
    }
    _addAsset(json) {
      json.asset = json.asset || {};
      json.asset.version = "2.0";
      json.asset.generator = json.asset.generator || "Normalized to glTF 2.0 by loaders.gl";
    }
    _convertTopLevelObjectsToArrays(json) {
      for (const arrayName in GLTF_ARRAYS) {
        this._convertTopLevelObjectToArray(json, arrayName);
      }
    }
    _convertTopLevelObjectToArray(json, mapName) {
      const objectMap = json[mapName];
      if (!objectMap || Array.isArray(objectMap)) {
        return;
      }
      json[mapName] = [];
      for (const id in objectMap) {
        const object = objectMap[id];
        object.id = object.id || id;
        const index = json[mapName].length;
        json[mapName].push(object);
        this.idToIndexMap[mapName][id] = index;
      }
    }
    _convertObjectIdsToArrayIndices(json) {
      for (const arrayName in GLTF_ARRAYS) {
        this._convertIdsToIndices(json, arrayName);
      }
      if ("scene" in json) {
        json.scene = this._convertIdToIndex(json.scene, "scene");
      }
      for (const texture of json.textures) {
        this._convertTextureIds(texture);
      }
      for (const mesh of json.meshes) {
        this._convertMeshIds(mesh);
      }
      for (const node2 of json.nodes) {
        this._convertNodeIds(node2);
      }
      for (const node2 of json.scenes) {
        this._convertSceneIds(node2);
      }
    }
    _convertTextureIds(texture) {
      if (texture.source) {
        texture.source = this._convertIdToIndex(texture.source, "image");
      }
    }
    _convertMeshIds(mesh) {
      for (const primitive of mesh.primitives) {
        const {
          attributes,
          indices,
          material
        } = primitive;
        for (const attributeName in attributes) {
          attributes[attributeName] = this._convertIdToIndex(attributes[attributeName], "accessor");
        }
        if (indices) {
          primitive.indices = this._convertIdToIndex(indices, "accessor");
        }
        if (material) {
          primitive.material = this._convertIdToIndex(material, "material");
        }
      }
    }
    _convertNodeIds(node2) {
      if (node2.children) {
        node2.children = node2.children.map((child) => this._convertIdToIndex(child, "node"));
      }
      if (node2.meshes) {
        node2.meshes = node2.meshes.map((mesh) => this._convertIdToIndex(mesh, "mesh"));
      }
    }
    _convertSceneIds(scene) {
      if (scene.nodes) {
        scene.nodes = scene.nodes.map((node2) => this._convertIdToIndex(node2, "node"));
      }
    }
    _convertIdsToIndices(json, topLevelArrayName) {
      if (!json[topLevelArrayName]) {
        console.warn(`gltf v1: json doesn't contain attribute ${topLevelArrayName}`);
        json[topLevelArrayName] = [];
      }
      for (const object of json[topLevelArrayName]) {
        for (const key in object) {
          const id = object[key];
          const index = this._convertIdToIndex(id, key);
          object[key] = index;
        }
      }
    }
    _convertIdToIndex(id, key) {
      const arrayName = GLTF_KEYS[key];
      if (arrayName in this.idToIndexMap) {
        const index = this.idToIndexMap[arrayName][id];
        if (!Number.isFinite(index)) {
          throw new Error(`gltf v1: failed to resolve ${key} with id ${id}`);
        }
        return index;
      }
      return id;
    }
    _updateObjects(json) {
      for (const buffer of this.json.buffers) {
        delete buffer.type;
      }
    }
    _updateMaterial(json) {
      for (const material of json.materials) {
        var _material$values, _material$values2, _material$values3;
        material.pbrMetallicRoughness = {
          baseColorFactor: [1, 1, 1, 1],
          metallicFactor: 1,
          roughnessFactor: 1
        };
        const textureId = ((_material$values = material.values) === null || _material$values === void 0 ? void 0 : _material$values.tex) || ((_material$values2 = material.values) === null || _material$values2 === void 0 ? void 0 : _material$values2.texture2d_0) || ((_material$values3 = material.values) === null || _material$values3 === void 0 ? void 0 : _material$values3.diffuseTex);
        const textureIndex = json.textures.findIndex((texture) => texture.id === textureId);
        if (textureIndex !== -1) {
          material.pbrMetallicRoughness.baseColorTexture = {
            index: textureIndex
          };
        }
      }
    }
  }
  function normalizeGLTFV1(gltf) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return new GLTFV1Normalizer().normalize(gltf, options);
  }
  async function parseGLTF(gltf, arrayBufferOrString) {
    var _options$gltf, _options$gltf2, _options$gltf3;
    let byteOffset = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
    let options = arguments.length > 3 ? arguments[3] : void 0;
    let context = arguments.length > 4 ? arguments[4] : void 0;
    parseGLTFContainerSync(gltf, arrayBufferOrString, byteOffset, options);
    normalizeGLTFV1(gltf, {
      normalize: options === null || options === void 0 ? void 0 : (_options$gltf = options.gltf) === null || _options$gltf === void 0 ? void 0 : _options$gltf.normalize
    });
    preprocessExtensions(gltf, options, context);
    if (options !== null && options !== void 0 && (_options$gltf2 = options.gltf) !== null && _options$gltf2 !== void 0 && _options$gltf2.loadBuffers && gltf.json.buffers) {
      await loadBuffers(gltf, options, context);
    }
    if (options !== null && options !== void 0 && (_options$gltf3 = options.gltf) !== null && _options$gltf3 !== void 0 && _options$gltf3.loadImages) {
      await loadImages(gltf, options, context);
    }
    await decodeExtensions(gltf, options, context);
    return gltf;
  }
  function parseGLTFContainerSync(gltf, data, byteOffset, options) {
    if (options.uri) {
      gltf.baseUri = options.uri;
    }
    if (data instanceof ArrayBuffer && !isGLB(data, byteOffset, options)) {
      const textDecoder = new TextDecoder();
      data = textDecoder.decode(data);
    }
    if (typeof data === "string") {
      gltf.json = parseJSON(data);
    } else if (data instanceof ArrayBuffer) {
      const glb = {};
      byteOffset = parseGLBSync(glb, data, byteOffset, options.glb);
      assert$1(glb.type === "glTF", `Invalid GLB magic string ${glb.type}`);
      gltf._glb = glb;
      gltf.json = glb.json;
    } else {
      assert$1(false, "GLTF: must be ArrayBuffer or string");
    }
    const buffers = gltf.json.buffers || [];
    gltf.buffers = new Array(buffers.length).fill(null);
    if (gltf._glb && gltf._glb.header.hasBinChunk) {
      const {
        binChunks
      } = gltf._glb;
      gltf.buffers[0] = {
        arrayBuffer: binChunks[0].arrayBuffer,
        byteOffset: binChunks[0].byteOffset,
        byteLength: binChunks[0].byteLength
      };
    }
    const images = gltf.json.images || [];
    gltf.images = new Array(images.length).fill({});
  }
  async function loadBuffers(gltf, options, context) {
    const buffers = gltf.json.buffers || [];
    for (let i2 = 0; i2 < buffers.length; ++i2) {
      const buffer = buffers[i2];
      if (buffer.uri) {
        var _context$fetch, _response$arrayBuffer;
        const {
          fetch: fetch2
        } = context;
        assert$1(fetch2);
        const uri = resolveUrl(buffer.uri, options);
        const response = await (context === null || context === void 0 ? void 0 : (_context$fetch = context.fetch) === null || _context$fetch === void 0 ? void 0 : _context$fetch.call(context, uri));
        const arrayBuffer = await (response === null || response === void 0 ? void 0 : (_response$arrayBuffer = response.arrayBuffer) === null || _response$arrayBuffer === void 0 ? void 0 : _response$arrayBuffer.call(response));
        gltf.buffers[i2] = {
          arrayBuffer,
          byteOffset: 0,
          byteLength: arrayBuffer.byteLength
        };
        delete buffer.uri;
      } else if (gltf.buffers[i2] === null) {
        gltf.buffers[i2] = {
          arrayBuffer: new ArrayBuffer(buffer.byteLength),
          byteOffset: 0,
          byteLength: buffer.byteLength
        };
      }
    }
  }
  async function loadImages(gltf, options, context) {
    const imageIndices = getReferencesImageIndices(gltf);
    const images = gltf.json.images || [];
    const promises = [];
    for (const imageIndex of imageIndices) {
      promises.push(loadImage(gltf, images[imageIndex], imageIndex, options, context));
    }
    return await Promise.all(promises);
  }
  function getReferencesImageIndices(gltf) {
    const imageIndices = /* @__PURE__ */ new Set();
    const textures = gltf.json.textures || [];
    for (const texture of textures) {
      if (texture.source !== void 0) {
        imageIndices.add(texture.source);
      }
    }
    return Array.from(imageIndices).sort();
  }
  async function loadImage(gltf, image, index, options, context) {
    let arrayBuffer;
    if (image.uri && !image.hasOwnProperty("bufferView")) {
      const uri = resolveUrl(image.uri, options);
      const {
        fetch: fetch2
      } = context;
      const response = await fetch2(uri);
      arrayBuffer = await response.arrayBuffer();
      image.bufferView = {
        data: arrayBuffer
      };
    }
    if (Number.isFinite(image.bufferView)) {
      const array = getTypedArrayForBufferView(gltf.json, gltf.buffers, image.bufferView);
      arrayBuffer = sliceArrayBuffer(array.buffer, array.byteOffset, array.byteLength);
    }
    assert$1(arrayBuffer, "glTF image has no data");
    let parsedImage = await parseFromContext(arrayBuffer, [ImageLoader, BasisLoader], {
      ...options,
      mimeType: image.mimeType,
      basis: options.basis || {
        format: selectSupportedBasisFormat()
      }
    }, context);
    if (parsedImage && parsedImage[0]) {
      parsedImage = {
        compressed: true,
        mipmaps: false,
        width: parsedImage[0].width,
        height: parsedImage[0].height,
        data: parsedImage[0]
      };
    }
    gltf.images = gltf.images || [];
    gltf.images[index] = parsedImage;
  }
  const GLTFLoader = {
    name: "glTF",
    id: "gltf",
    module: "gltf",
    version: VERSION$2,
    extensions: ["gltf", "glb"],
    mimeTypes: ["model/gltf+json", "model/gltf-binary"],
    text: true,
    binary: true,
    tests: ["glTF"],
    parse: parse$2,
    options: {
      gltf: {
        normalize: true,
        loadBuffers: true,
        loadImages: true,
        decompressMeshes: true
      },
      log: console
    }
  };
  async function parse$2(arrayBuffer) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let context = arguments.length > 2 ? arguments[2] : void 0;
    options = {
      ...GLTFLoader.options,
      ...options
    };
    options.gltf = {
      ...GLTFLoader.options.gltf,
      ...options.gltf
    };
    const {
      byteOffset = 0
    } = options;
    const gltf = {};
    return await parseGLTF(gltf, arrayBuffer, byteOffset, options, context);
  }
  const COMPONENTS = {
    SCALAR: 1,
    VEC2: 2,
    VEC3: 3,
    VEC4: 4,
    MAT2: 4,
    MAT3: 9,
    MAT4: 16
  };
  const BYTES = {
    5120: 1,
    5121: 1,
    5122: 2,
    5123: 2,
    5125: 4,
    5126: 4
  };
  const GL_SAMPLER = {
    TEXTURE_MAG_FILTER: 10240,
    TEXTURE_MIN_FILTER: 10241,
    TEXTURE_WRAP_S: 10242,
    TEXTURE_WRAP_T: 10243,
    REPEAT: 10497,
    LINEAR: 9729,
    NEAREST_MIPMAP_LINEAR: 9986
  };
  const SAMPLER_PARAMETER_GLTF_TO_GL = {
    magFilter: GL_SAMPLER.TEXTURE_MAG_FILTER,
    minFilter: GL_SAMPLER.TEXTURE_MIN_FILTER,
    wrapS: GL_SAMPLER.TEXTURE_WRAP_S,
    wrapT: GL_SAMPLER.TEXTURE_WRAP_T
  };
  const DEFAULT_SAMPLER_PARAMETERS = {
    [GL_SAMPLER.TEXTURE_MAG_FILTER]: GL_SAMPLER.LINEAR,
    [GL_SAMPLER.TEXTURE_MIN_FILTER]: GL_SAMPLER.NEAREST_MIPMAP_LINEAR,
    [GL_SAMPLER.TEXTURE_WRAP_S]: GL_SAMPLER.REPEAT,
    [GL_SAMPLER.TEXTURE_WRAP_T]: GL_SAMPLER.REPEAT
  };
  function makeDefaultSampler() {
    return {
      id: "default-sampler",
      parameters: DEFAULT_SAMPLER_PARAMETERS
    };
  }
  function getBytesFromComponentType(componentType) {
    return BYTES[componentType];
  }
  function getSizeFromAccessorType(type) {
    return COMPONENTS[type];
  }
  class GLTFPostProcessor {
    constructor() {
      this.baseUri = "";
      this.jsonUnprocessed = void 0;
      this.json = void 0;
      this.buffers = [];
      this.images = [];
    }
    postProcess(gltf) {
      let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      const {
        json,
        buffers = [],
        images = []
      } = gltf;
      const {
        baseUri = ""
      } = gltf;
      assert$1(json);
      this.baseUri = baseUri;
      this.buffers = buffers;
      this.images = images;
      this.jsonUnprocessed = json;
      this.json = this._resolveTree(gltf.json, options);
      return this.json;
    }
    _resolveTree(gltf) {
      const json = {
        ...gltf
      };
      this.json = json;
      if (gltf.bufferViews) {
        json.bufferViews = gltf.bufferViews.map((bufView, i2) => this._resolveBufferView(bufView, i2));
      }
      if (gltf.images) {
        json.images = gltf.images.map((image, i2) => this._resolveImage(image, i2));
      }
      if (gltf.samplers) {
        json.samplers = gltf.samplers.map((sampler, i2) => this._resolveSampler(sampler, i2));
      }
      if (gltf.textures) {
        json.textures = gltf.textures.map((texture, i2) => this._resolveTexture(texture, i2));
      }
      if (gltf.accessors) {
        json.accessors = gltf.accessors.map((accessor, i2) => this._resolveAccessor(accessor, i2));
      }
      if (gltf.materials) {
        json.materials = gltf.materials.map((material, i2) => this._resolveMaterial(material, i2));
      }
      if (gltf.meshes) {
        json.meshes = gltf.meshes.map((mesh, i2) => this._resolveMesh(mesh, i2));
      }
      if (gltf.nodes) {
        json.nodes = gltf.nodes.map((node2, i2) => this._resolveNode(node2, i2));
        json.nodes = json.nodes.map((node2, i2) => this._resolveNodeChildren(node2));
      }
      if (gltf.skins) {
        json.skins = gltf.skins.map((skin, i2) => this._resolveSkin(skin, i2));
      }
      if (gltf.scenes) {
        json.scenes = gltf.scenes.map((scene, i2) => this._resolveScene(scene, i2));
      }
      if (typeof this.json.scene === "number" && json.scenes) {
        json.scene = json.scenes[this.json.scene];
      }
      return json;
    }
    getScene(index) {
      return this._get(this.json.scenes, index);
    }
    getNode(index) {
      return this._get(this.json.nodes, index);
    }
    getSkin(index) {
      return this._get(this.json.skins, index);
    }
    getMesh(index) {
      return this._get(this.json.meshes, index);
    }
    getMaterial(index) {
      return this._get(this.json.materials, index);
    }
    getAccessor(index) {
      return this._get(this.json.accessors, index);
    }
    getCamera(index) {
      return this._get(this.json.cameras, index);
    }
    getTexture(index) {
      return this._get(this.json.textures, index);
    }
    getSampler(index) {
      return this._get(this.json.samplers, index);
    }
    getImage(index) {
      return this._get(this.json.images, index);
    }
    getBufferView(index) {
      return this._get(this.json.bufferViews, index);
    }
    getBuffer(index) {
      return this._get(this.json.buffers, index);
    }
    _get(array, index) {
      if (typeof index === "object") {
        return index;
      }
      const object = array && array[index];
      if (!object) {
        console.warn(`glTF file error: Could not find ${array}[${index}]`);
      }
      return object;
    }
    _resolveScene(scene, index) {
      return {
        ...scene,
        id: scene.id || `scene-${index}`,
        nodes: (scene.nodes || []).map((node2) => this.getNode(node2))
      };
    }
    _resolveNode(gltfNode, index) {
      const node2 = {
        ...gltfNode,
        id: (gltfNode === null || gltfNode === void 0 ? void 0 : gltfNode.id) || `node-${index}`
      };
      if (gltfNode.mesh !== void 0) {
        node2.mesh = this.getMesh(gltfNode.mesh);
      }
      if (gltfNode.camera !== void 0) {
        node2.camera = this.getCamera(gltfNode.camera);
      }
      if (gltfNode.skin !== void 0) {
        node2.skin = this.getSkin(gltfNode.skin);
      }
      if (gltfNode.meshes !== void 0 && gltfNode.meshes.length) {
        node2.mesh = gltfNode.meshes.reduce((accum, meshIndex) => {
          const mesh = this.getMesh(meshIndex);
          accum.id = mesh.id;
          accum.primitives = accum.primitives.concat(mesh.primitives);
          return accum;
        }, {
          primitives: []
        });
      }
      return node2;
    }
    _resolveNodeChildren(node2) {
      if (node2.children) {
        node2.children = node2.children.map((child) => this.getNode(child));
      }
      return node2;
    }
    _resolveSkin(gltfSkin, index) {
      const inverseBindMatrices = typeof gltfSkin.inverseBindMatrices === "number" ? this.getAccessor(gltfSkin.inverseBindMatrices) : void 0;
      return {
        ...gltfSkin,
        id: gltfSkin.id || `skin-${index}`,
        inverseBindMatrices
      };
    }
    _resolveMesh(gltfMesh, index) {
      const mesh = {
        ...gltfMesh,
        id: gltfMesh.id || `mesh-${index}`,
        primitives: []
      };
      if (gltfMesh.primitives) {
        mesh.primitives = gltfMesh.primitives.map((gltfPrimitive) => {
          const primitive = {
            ...gltfPrimitive,
            attributes: {},
            indices: void 0,
            material: void 0
          };
          const attributes = gltfPrimitive.attributes;
          for (const attribute in attributes) {
            primitive.attributes[attribute] = this.getAccessor(attributes[attribute]);
          }
          if (gltfPrimitive.indices !== void 0) {
            primitive.indices = this.getAccessor(gltfPrimitive.indices);
          }
          if (gltfPrimitive.material !== void 0) {
            primitive.material = this.getMaterial(gltfPrimitive.material);
          }
          return primitive;
        });
      }
      return mesh;
    }
    _resolveMaterial(gltfMaterial, index) {
      const material = {
        ...gltfMaterial,
        id: gltfMaterial.id || `material-${index}`
      };
      if (material.normalTexture) {
        material.normalTexture = {
          ...material.normalTexture
        };
        material.normalTexture.texture = this.getTexture(material.normalTexture.index);
      }
      if (material.occlusionTexture) {
        material.occlusionTexture = {
          ...material.occlusionTexture
        };
        material.occlusionTexture.texture = this.getTexture(material.occlusionTexture.index);
      }
      if (material.emissiveTexture) {
        material.emissiveTexture = {
          ...material.emissiveTexture
        };
        material.emissiveTexture.texture = this.getTexture(material.emissiveTexture.index);
      }
      if (!material.emissiveFactor) {
        material.emissiveFactor = material.emissiveTexture ? [1, 1, 1] : [0, 0, 0];
      }
      if (material.pbrMetallicRoughness) {
        material.pbrMetallicRoughness = {
          ...material.pbrMetallicRoughness
        };
        const mr = material.pbrMetallicRoughness;
        if (mr.baseColorTexture) {
          mr.baseColorTexture = {
            ...mr.baseColorTexture
          };
          mr.baseColorTexture.texture = this.getTexture(mr.baseColorTexture.index);
        }
        if (mr.metallicRoughnessTexture) {
          mr.metallicRoughnessTexture = {
            ...mr.metallicRoughnessTexture
          };
          mr.metallicRoughnessTexture.texture = this.getTexture(mr.metallicRoughnessTexture.index);
        }
      }
      return material;
    }
    _resolveAccessor(gltfAccessor, index) {
      const bytesPerComponent = getBytesFromComponentType(gltfAccessor.componentType);
      const components = getSizeFromAccessorType(gltfAccessor.type);
      const bytesPerElement = bytesPerComponent * components;
      const accessor = {
        ...gltfAccessor,
        id: gltfAccessor.id || `accessor-${index}`,
        bytesPerComponent,
        components,
        bytesPerElement,
        value: void 0,
        bufferView: void 0,
        sparse: void 0
      };
      if (gltfAccessor.bufferView !== void 0) {
        accessor.bufferView = this.getBufferView(gltfAccessor.bufferView);
      }
      if (accessor.bufferView) {
        const buffer = accessor.bufferView.buffer;
        const {
          ArrayType,
          byteLength
        } = getAccessorArrayTypeAndLength(accessor, accessor.bufferView);
        const byteOffset = (accessor.bufferView.byteOffset || 0) + (accessor.byteOffset || 0) + buffer.byteOffset;
        let cutBuffer = buffer.arrayBuffer.slice(byteOffset, byteOffset + byteLength);
        if (accessor.bufferView.byteStride) {
          cutBuffer = this._getValueFromInterleavedBuffer(buffer, byteOffset, accessor.bufferView.byteStride, accessor.bytesPerElement, accessor.count);
        }
        accessor.value = new ArrayType(cutBuffer);
      }
      return accessor;
    }
    _getValueFromInterleavedBuffer(buffer, byteOffset, byteStride, bytesPerElement, count) {
      const result = new Uint8Array(count * bytesPerElement);
      for (let i2 = 0; i2 < count; i2++) {
        const elementOffset = byteOffset + i2 * byteStride;
        result.set(new Uint8Array(buffer.arrayBuffer.slice(elementOffset, elementOffset + bytesPerElement)), i2 * bytesPerElement);
      }
      return result.buffer;
    }
    _resolveTexture(gltfTexture, index) {
      return {
        ...gltfTexture,
        id: gltfTexture.id || `texture-${index}`,
        sampler: typeof gltfTexture.sampler === "number" ? this.getSampler(gltfTexture.sampler) : makeDefaultSampler(),
        source: typeof gltfTexture.source === "number" ? this.getImage(gltfTexture.source) : void 0
      };
    }
    _resolveSampler(gltfSampler, index) {
      const sampler = {
        id: gltfSampler.id || `sampler-${index}`,
        ...gltfSampler,
        parameters: {}
      };
      for (const key in sampler) {
        const glEnum = this._enumSamplerParameter(key);
        if (glEnum !== void 0) {
          sampler.parameters[glEnum] = sampler[key];
        }
      }
      return sampler;
    }
    _enumSamplerParameter(key) {
      return SAMPLER_PARAMETER_GLTF_TO_GL[key];
    }
    _resolveImage(gltfImage, index) {
      const image = {
        ...gltfImage,
        id: gltfImage.id || `image-${index}`,
        image: null,
        bufferView: gltfImage.bufferView !== void 0 ? this.getBufferView(gltfImage.bufferView) : void 0
      };
      const preloadedImage = this.images[index];
      if (preloadedImage) {
        image.image = preloadedImage;
      }
      return image;
    }
    _resolveBufferView(gltfBufferView, index) {
      const bufferIndex = gltfBufferView.buffer;
      const arrayBuffer = this.buffers[bufferIndex].arrayBuffer;
      let byteOffset = this.buffers[bufferIndex].byteOffset || 0;
      if (gltfBufferView.byteOffset) {
        byteOffset += gltfBufferView.byteOffset;
      }
      const bufferView = {
        id: `bufferView-${index}`,
        ...gltfBufferView,
        buffer: this.buffers[bufferIndex],
        data: new Uint8Array(arrayBuffer, byteOffset, gltfBufferView.byteLength)
      };
      return bufferView;
    }
    _resolveCamera(gltfCamera, index) {
      const camera = {
        ...gltfCamera,
        id: gltfCamera.id || `camera-${index}`
      };
      if (camera.perspective)
        ;
      if (camera.orthographic)
        ;
      return camera;
    }
  }
  function postProcessGLTF(gltf, options) {
    return new GLTFPostProcessor().postProcess(gltf, options);
  }
  const GLTF_FORMAT = {
    URI: 0,
    EMBEDDED: 1
  };
  function parse3DTileGLTFViewSync(tile, arrayBuffer, byteOffset, options) {
    tile.rotateYtoZ = true;
    const gltfByteLength = (tile.byteOffset || 0) + (tile.byteLength || 0) - byteOffset;
    if (gltfByteLength === 0) {
      throw new Error("glTF byte length must be greater than 0.");
    }
    tile.gltfUpAxis = options !== null && options !== void 0 && options["3d-tiles"] && options["3d-tiles"].assetGltfUpAxis ? options["3d-tiles"].assetGltfUpAxis : "Y";
    tile.gltfArrayBuffer = sliceArrayBuffer(arrayBuffer, byteOffset, gltfByteLength);
    tile.gltfByteOffset = 0;
    tile.gltfByteLength = gltfByteLength;
    if (byteOffset % 4 === 0)
      ;
    else {
      console.warn(`${tile.type}: embedded glb is not aligned to a 4-byte boundary.`);
    }
    return (tile.byteOffset || 0) + (tile.byteLength || 0);
  }
  async function extractGLTF(tile, gltfFormat, options, context) {
    const tile3DOptions = (options === null || options === void 0 ? void 0 : options["3d-tiles"]) || {};
    extractGLTFBufferOrURL(tile, gltfFormat);
    if (tile3DOptions.loadGLTF) {
      if (!context) {
        return;
      }
      if (tile.gltfUrl) {
        const {
          fetch: fetch2
        } = context;
        const response = await fetch2(tile.gltfUrl, options);
        tile.gltfArrayBuffer = await response.arrayBuffer();
        tile.gltfByteOffset = 0;
      }
      if (tile.gltfArrayBuffer) {
        const gltfWithBuffers = await parseFromContext(tile.gltfArrayBuffer, GLTFLoader, options, context);
        tile.gltf = postProcessGLTF(gltfWithBuffers);
        tile.gpuMemoryUsageInBytes = getMemoryUsageGLTF(tile.gltf);
        delete tile.gltfArrayBuffer;
        delete tile.gltfByteOffset;
        delete tile.gltfByteLength;
      }
    }
  }
  function extractGLTFBufferOrURL(tile, gltfFormat, options) {
    switch (gltfFormat) {
      case GLTF_FORMAT.URI:
        if (tile.gltfArrayBuffer) {
          const gltfUrlBytes = new Uint8Array(tile.gltfArrayBuffer, tile.gltfByteOffset);
          const textDecoder = new TextDecoder();
          const gltfUrl = textDecoder.decode(gltfUrlBytes);
          tile.gltfUrl = gltfUrl.replace(/[\s\0]+$/, "");
        }
        delete tile.gltfArrayBuffer;
        delete tile.gltfByteOffset;
        delete tile.gltfByteLength;
        break;
      case GLTF_FORMAT.EMBEDDED:
        break;
      default:
        throw new Error("b3dm: Illegal glTF format field");
    }
  }
  async function parseBatchedModel3DTile(tile, arrayBuffer, byteOffset, options, context) {
    var _tile$gltf;
    byteOffset = parseBatchedModel(tile, arrayBuffer, byteOffset, options);
    await extractGLTF(tile, GLTF_FORMAT.EMBEDDED, options, context);
    const extensions = tile === null || tile === void 0 ? void 0 : (_tile$gltf = tile.gltf) === null || _tile$gltf === void 0 ? void 0 : _tile$gltf.extensions;
    if (extensions && extensions.CESIUM_RTC) {
      tile.rtcCenter = extensions.CESIUM_RTC.center;
    }
    return byteOffset;
  }
  function parseBatchedModel(tile, arrayBuffer, byteOffset, options, context) {
    byteOffset = parse3DTileHeaderSync(tile, arrayBuffer, byteOffset);
    byteOffset = parse3DTileTablesHeaderSync(tile, arrayBuffer, byteOffset);
    byteOffset = parse3DTileTablesSync(tile, arrayBuffer, byteOffset);
    byteOffset = parse3DTileGLTFViewSync(tile, arrayBuffer, byteOffset, options);
    const featureTable = new Tile3DFeatureTable(tile.featureTableJson, tile.featureTableBinary);
    tile.rtcCenter = featureTable.getGlobalProperty("RTC_CENTER", GL$1.FLOAT, 3);
    return byteOffset;
  }
  async function parseInstancedModel3DTile(tile, arrayBuffer, byteOffset, options, context) {
    byteOffset = parseInstancedModel(tile, arrayBuffer, byteOffset, options);
    await extractGLTF(tile, tile.gltfFormat || 0, options, context);
    return byteOffset;
  }
  function parseInstancedModel(tile, arrayBuffer, byteOffset, options, context) {
    var _tile$header;
    byteOffset = parse3DTileHeaderSync(tile, arrayBuffer, byteOffset);
    if (tile.version !== 1) {
      throw new Error(`Instanced 3D Model version ${tile.version} is not supported`);
    }
    byteOffset = parse3DTileTablesHeaderSync(tile, arrayBuffer, byteOffset);
    const view = new DataView(arrayBuffer);
    tile.gltfFormat = view.getUint32(byteOffset, true);
    byteOffset += 4;
    byteOffset = parse3DTileTablesSync(tile, arrayBuffer, byteOffset);
    byteOffset = parse3DTileGLTFViewSync(tile, arrayBuffer, byteOffset, options);
    if (!(tile !== null && tile !== void 0 && (_tile$header = tile.header) !== null && _tile$header !== void 0 && _tile$header.featureTableJsonByteLength) || tile.header.featureTableJsonByteLength === 0) {
      throw new Error("i3dm parser: featureTableJsonByteLength is zero.");
    }
    const featureTable = new Tile3DFeatureTable(tile.featureTableJson, tile.featureTableBinary);
    const instancesLength = featureTable.getGlobalProperty("INSTANCES_LENGTH");
    featureTable.featuresLength = instancesLength;
    if (!Number.isFinite(instancesLength)) {
      throw new Error("i3dm parser: INSTANCES_LENGTH must be defined");
    }
    tile.eastNorthUp = featureTable.getGlobalProperty("EAST_NORTH_UP");
    tile.rtcCenter = featureTable.getGlobalProperty("RTC_CENTER", GL$1.FLOAT, 3);
    const batchTable = new Tile3DBatchTableParser(tile.batchTableJson, tile.batchTableBinary, instancesLength);
    extractInstancedAttributes(tile, featureTable, batchTable, instancesLength);
    return byteOffset;
  }
  function extractInstancedAttributes(tile, featureTable, batchTable, instancesLength) {
    const instances = new Array(instancesLength);
    const instancePosition = new Vector3();
    new Vector3();
    new Vector3();
    new Vector3();
    const instanceRotation = new Matrix3();
    const instanceQuaternion = new Quaternion();
    const instanceScale = new Vector3();
    const instanceTranslationRotationScale = {};
    const instanceTransform = new Matrix4();
    const scratch1 = [];
    const scratch2 = [];
    const scratch3 = [];
    const scratch4 = [];
    for (let i2 = 0; i2 < instancesLength; i2++) {
      let position;
      if (featureTable.hasProperty("POSITION")) {
        position = featureTable.getProperty("POSITION", GL$1.FLOAT, 3, i2, instancePosition);
      } else if (featureTable.hasProperty("POSITION_QUANTIZED")) {
        position = featureTable.getProperty("POSITION_QUANTIZED", GL$1.UNSIGNED_SHORT, 3, i2, instancePosition);
        const quantizedVolumeOffset = featureTable.getGlobalProperty("QUANTIZED_VOLUME_OFFSET", GL$1.FLOAT, 3);
        if (!quantizedVolumeOffset) {
          throw new Error("i3dm parser: QUANTIZED_VOLUME_OFFSET must be defined for quantized positions.");
        }
        const quantizedVolumeScale = featureTable.getGlobalProperty("QUANTIZED_VOLUME_SCALE", GL$1.FLOAT, 3);
        if (!quantizedVolumeScale) {
          throw new Error("i3dm parser: QUANTIZED_VOLUME_SCALE must be defined for quantized positions.");
        }
        const MAX_UNSIGNED_SHORT = 65535;
        for (let j = 0; j < 3; j++) {
          position[j] = position[j] / MAX_UNSIGNED_SHORT * quantizedVolumeScale[j] + quantizedVolumeOffset[j];
        }
      }
      if (!position) {
        throw new Error("i3dm: POSITION or POSITION_QUANTIZED must be defined for each instance.");
      }
      instancePosition.copy(position);
      instanceTranslationRotationScale.translation = instancePosition;
      tile.normalUp = featureTable.getProperty("NORMAL_UP", GL$1.FLOAT, 3, i2, scratch1);
      tile.normalRight = featureTable.getProperty("NORMAL_RIGHT", GL$1.FLOAT, 3, i2, scratch2);
      if (tile.normalUp) {
        if (!tile.normalRight) {
          throw new Error("i3dm: Custom orientation requires both NORMAL_UP and NORMAL_RIGHT.");
        }
        tile.hasCustomOrientation = true;
      } else {
        tile.octNormalUp = featureTable.getProperty("NORMAL_UP_OCT32P", GL$1.UNSIGNED_SHORT, 2, i2, scratch1);
        tile.octNormalRight = featureTable.getProperty("NORMAL_RIGHT_OCT32P", GL$1.UNSIGNED_SHORT, 2, i2, scratch2);
        if (tile.octNormalUp) {
          if (!tile.octNormalRight) {
            throw new Error("i3dm: oct-encoded orientation requires NORMAL_UP_OCT32P and NORMAL_RIGHT_OCT32P");
          }
          throw new Error("i3dm: oct-encoded orientation not implemented");
        } else if (tile.eastNorthUp) {
          Ellipsoid.WGS84.eastNorthUpToFixedFrame(instancePosition, instanceTransform);
          instanceTransform.getRotationMatrix3(instanceRotation);
        } else {
          instanceRotation.identity();
        }
      }
      instanceQuaternion.fromMatrix3(instanceRotation);
      instanceTranslationRotationScale.rotation = instanceQuaternion;
      instanceScale.set(1, 1, 1);
      const scale2 = featureTable.getProperty("SCALE", GL$1.FLOAT, 1, i2, scratch3);
      if (Number.isFinite(scale2)) {
        instanceScale.multiplyByScalar(scale2);
      }
      const nonUniformScale = featureTable.getProperty("SCALE_NON_UNIFORM", GL$1.FLOAT, 3, i2, scratch1);
      if (nonUniformScale) {
        instanceScale.scale(nonUniformScale);
      }
      instanceTranslationRotationScale.scale = instanceScale;
      let batchId = featureTable.getProperty("BATCH_ID", GL$1.UNSIGNED_SHORT, 1, i2, scratch4);
      if (batchId === void 0) {
        batchId = i2;
      }
      const rotationMatrix = new Matrix4().fromQuaternion(instanceTranslationRotationScale.rotation);
      instanceTransform.identity();
      instanceTransform.translate(instanceTranslationRotationScale.translation);
      instanceTransform.multiplyRight(rotationMatrix);
      instanceTransform.scale(instanceTranslationRotationScale.scale);
      const modelMatrix = instanceTransform.clone();
      instances[i2] = {
        modelMatrix,
        batchId
      };
    }
    tile.instances = instances;
  }
  async function parseComposite3DTile(tile, arrayBuffer, byteOffset, options, context, parse3DTile2) {
    byteOffset = parse3DTileHeaderSync(tile, arrayBuffer, byteOffset);
    const view = new DataView(arrayBuffer);
    tile.tilesLength = view.getUint32(byteOffset, true);
    byteOffset += 4;
    tile.tiles = [];
    while (tile.tiles.length < tile.tilesLength && (tile.byteLength || 0) - byteOffset > 12) {
      const subtile = {
        shape: "tile3d"
      };
      tile.tiles.push(subtile);
      byteOffset = await parse3DTile2(arrayBuffer, byteOffset, options, context, subtile);
    }
    return byteOffset;
  }
  async function parseGltf3DTile(tile, arrayBuffer, options, context) {
    var _options$3dTiles, _options$3dTiles2;
    tile.rotateYtoZ = true;
    tile.gltfUpAxis = options !== null && options !== void 0 && (_options$3dTiles = options["3d-tiles"]) !== null && _options$3dTiles !== void 0 && _options$3dTiles.assetGltfUpAxis ? options["3d-tiles"].assetGltfUpAxis : "Y";
    if (options !== null && options !== void 0 && (_options$3dTiles2 = options["3d-tiles"]) !== null && _options$3dTiles2 !== void 0 && _options$3dTiles2.loadGLTF) {
      if (!context) {
        return arrayBuffer.byteLength;
      }
      const gltfWithBuffers = await parseFromContext(arrayBuffer, GLTFLoader, options, context);
      tile.gltf = postProcessGLTF(gltfWithBuffers);
      tile.gpuMemoryUsageInBytes = getMemoryUsageGLTF(tile.gltf);
    } else {
      tile.gltfArrayBuffer = arrayBuffer;
    }
    return arrayBuffer.byteLength;
  }
  async function parse3DTile(arrayBuffer) {
    let byteOffset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    let options = arguments.length > 2 ? arguments[2] : void 0;
    let context = arguments.length > 3 ? arguments[3] : void 0;
    let tile = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {
      shape: "tile3d"
    };
    tile.byteOffset = byteOffset;
    tile.type = getMagicString$1(arrayBuffer, byteOffset);
    switch (tile.type) {
      case TILE3D_TYPE.COMPOSITE:
        return await parseComposite3DTile(tile, arrayBuffer, byteOffset, options, context, parse3DTile);
      case TILE3D_TYPE.BATCHED_3D_MODEL:
        return await parseBatchedModel3DTile(tile, arrayBuffer, byteOffset, options, context);
      case TILE3D_TYPE.GLTF:
        return await parseGltf3DTile(tile, arrayBuffer, options, context);
      case TILE3D_TYPE.INSTANCED_3D_MODEL:
        return await parseInstancedModel3DTile(tile, arrayBuffer, byteOffset, options, context);
      case TILE3D_TYPE.POINT_CLOUD:
        return await parsePointCloud3DTile(tile, arrayBuffer, byteOffset, options, context);
      default:
        throw new Error(`3DTileLoader: unknown type ${tile.type}`);
    }
  }
  const SUBTREE_FILE_MAGIC = 1952609651;
  const SUBTREE_FILE_VERSION = 1;
  async function parse3DTilesSubtree(data, options, context) {
    const magic = new Uint32Array(data.slice(0, 4));
    if (magic[0] !== SUBTREE_FILE_MAGIC) {
      throw new Error("Wrong subtree file magic number");
    }
    const version = new Uint32Array(data.slice(4, 8));
    if (version[0] !== SUBTREE_FILE_VERSION) {
      throw new Error("Wrong subtree file verson, must be 1");
    }
    const jsonByteLength = parseUint64Value(data.slice(8, 16));
    const stringAttribute = new Uint8Array(data, 24, jsonByteLength);
    const textDecoder = new TextDecoder("utf8");
    const string = textDecoder.decode(stringAttribute);
    const subtree = JSON.parse(string);
    const binaryByteLength = parseUint64Value(data.slice(16, 24));
    let internalBinaryBuffer = new ArrayBuffer(0);
    if (binaryByteLength) {
      internalBinaryBuffer = data.slice(24 + jsonByteLength);
    }
    await loadExplicitBitstream(subtree, subtree.tileAvailability, internalBinaryBuffer, context);
    if (Array.isArray(subtree.contentAvailability)) {
      for (const contentAvailability of subtree.contentAvailability) {
        await loadExplicitBitstream(subtree, contentAvailability, internalBinaryBuffer, context);
      }
    } else {
      await loadExplicitBitstream(subtree, subtree.contentAvailability, internalBinaryBuffer, context);
    }
    await loadExplicitBitstream(subtree, subtree.childSubtreeAvailability, internalBinaryBuffer, context);
    return subtree;
  }
  async function loadExplicitBitstream(subtree, availabilityObject, internalBinaryBuffer, context) {
    const bufferViewIndex = Number.isFinite(availabilityObject.bitstream) ? availabilityObject.bitstream : availabilityObject.bufferView;
    if (typeof bufferViewIndex !== "number") {
      return;
    }
    const bufferView = subtree.bufferViews[bufferViewIndex];
    const buffer = subtree.buffers[bufferView.buffer];
    if (!(context !== null && context !== void 0 && context.baseUrl)) {
      throw new Error("Url is not provided");
    }
    if (!context.fetch) {
      throw new Error("fetch is not provided");
    }
    if (buffer.uri) {
      const bufferUri = `${(context === null || context === void 0 ? void 0 : context.baseUrl) || ""}/${buffer.uri}`;
      const response = await context.fetch(bufferUri);
      const data = await response.arrayBuffer();
      availabilityObject.explicitBitstream = new Uint8Array(data, bufferView.byteOffset, bufferView.byteLength);
      return;
    }
    const bufferStart = subtree.buffers.slice(0, bufferView.buffer).reduce((offset, buf) => offset + buf.byteLength, 0);
    availabilityObject.explicitBitstream = new Uint8Array(internalBinaryBuffer.slice(bufferStart, bufferStart + buffer.byteLength), bufferView.byteOffset, bufferView.byteLength);
  }
  function parseUint64Value(buffer) {
    const dataView = new DataView(buffer);
    const left = dataView.getUint32(0, true);
    const right = dataView.getUint32(4, true);
    return left + 2 ** 32 * right;
  }
  const Tile3DSubtreeLoader = {
    id: "3d-tiles-subtree",
    name: "3D Tiles Subtree",
    module: "3d-tiles",
    version: VERSION$5,
    extensions: ["subtree"],
    mimeTypes: ["application/octet-stream"],
    tests: ["subtree"],
    parse: parse3DTilesSubtree,
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
  var wasm = null;
  try {
    wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
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
  } catch (e) {
  }
  function Long(low, high, unsigned) {
    this.low = low | 0;
    this.high = high | 0;
    this.unsigned = !!unsigned;
  }
  Long.prototype.__isLong__;
  Object.defineProperty(Long.prototype, "__isLong__", { value: true });
  function isLong(obj) {
    return (obj && obj["__isLong__"]) === true;
  }
  function ctz32(value) {
    var c = Math.clz32(value & -value);
    return value ? 31 - c : c;
  }
  Long.isLong = isLong;
  var INT_CACHE = {};
  var UINT_CACHE = {};
  function fromInt(value, unsigned) {
    var obj, cachedObj, cache2;
    if (unsigned) {
      value >>>= 0;
      if (cache2 = 0 <= value && value < 256) {
        cachedObj = UINT_CACHE[value];
        if (cachedObj)
          return cachedObj;
      }
      obj = fromBits(value, 0, true);
      if (cache2)
        UINT_CACHE[value] = obj;
      return obj;
    } else {
      value |= 0;
      if (cache2 = -128 <= value && value < 128) {
        cachedObj = INT_CACHE[value];
        if (cachedObj)
          return cachedObj;
      }
      obj = fromBits(value, value < 0 ? -1 : 0, false);
      if (cache2)
        INT_CACHE[value] = obj;
      return obj;
    }
  }
  Long.fromInt = fromInt;
  function fromNumber(value, unsigned) {
    if (isNaN(value))
      return unsigned ? UZERO : ZERO;
    if (unsigned) {
      if (value < 0)
        return UZERO;
      if (value >= TWO_PWR_64_DBL)
        return MAX_UNSIGNED_VALUE;
    } else {
      if (value <= -TWO_PWR_63_DBL)
        return MIN_VALUE;
      if (value + 1 >= TWO_PWR_63_DBL)
        return MAX_VALUE;
    }
    if (value < 0)
      return fromNumber(-value, unsigned).neg();
    return fromBits(value % TWO_PWR_32_DBL | 0, value / TWO_PWR_32_DBL | 0, unsigned);
  }
  Long.fromNumber = fromNumber;
  function fromBits(lowBits, highBits, unsigned) {
    return new Long(lowBits, highBits, unsigned);
  }
  Long.fromBits = fromBits;
  var pow_dbl = Math.pow;
  function fromString(str, unsigned, radix) {
    if (str.length === 0)
      throw Error("empty string");
    if (typeof unsigned === "number") {
      radix = unsigned;
      unsigned = false;
    } else {
      unsigned = !!unsigned;
    }
    if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
      return unsigned ? UZERO : ZERO;
    radix = radix || 10;
    if (radix < 2 || 36 < radix)
      throw RangeError("radix");
    var p;
    if ((p = str.indexOf("-")) > 0)
      throw Error("interior hyphen");
    else if (p === 0) {
      return fromString(str.substring(1), unsigned, radix).neg();
    }
    var radixToPower = fromNumber(pow_dbl(radix, 8));
    var result = ZERO;
    for (var i2 = 0; i2 < str.length; i2 += 8) {
      var size = Math.min(8, str.length - i2), value = parseInt(str.substring(i2, i2 + size), radix);
      if (size < 8) {
        var power = fromNumber(pow_dbl(radix, size));
        result = result.mul(power).add(fromNumber(value));
      } else {
        result = result.mul(radixToPower);
        result = result.add(fromNumber(value));
      }
    }
    result.unsigned = unsigned;
    return result;
  }
  Long.fromString = fromString;
  function fromValue(val, unsigned) {
    if (typeof val === "number")
      return fromNumber(val, unsigned);
    if (typeof val === "string")
      return fromString(val, unsigned);
    return fromBits(val.low, val.high, typeof unsigned === "boolean" ? unsigned : val.unsigned);
  }
  Long.fromValue = fromValue;
  var TWO_PWR_16_DBL = 1 << 16;
  var TWO_PWR_24_DBL = 1 << 24;
  var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
  var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
  var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
  var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);
  var ZERO = fromInt(0);
  Long.ZERO = ZERO;
  var UZERO = fromInt(0, true);
  Long.UZERO = UZERO;
  var ONE = fromInt(1);
  Long.ONE = ONE;
  var UONE = fromInt(1, true);
  Long.UONE = UONE;
  var NEG_ONE = fromInt(-1);
  Long.NEG_ONE = NEG_ONE;
  var MAX_VALUE = fromBits(4294967295 | 0, 2147483647 | 0, false);
  Long.MAX_VALUE = MAX_VALUE;
  var MAX_UNSIGNED_VALUE = fromBits(4294967295 | 0, 4294967295 | 0, true);
  Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;
  var MIN_VALUE = fromBits(0, 2147483648 | 0, false);
  Long.MIN_VALUE = MIN_VALUE;
  var LongPrototype = Long.prototype;
  LongPrototype.toInt = function toInt() {
    return this.unsigned ? this.low >>> 0 : this.low;
  };
  LongPrototype.toNumber = function toNumber() {
    if (this.unsigned)
      return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
    return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
  };
  LongPrototype.toString = function toString(radix) {
    radix = radix || 10;
    if (radix < 2 || 36 < radix)
      throw RangeError("radix");
    if (this.isZero())
      return "0";
    if (this.isNegative()) {
      if (this.eq(MIN_VALUE)) {
        var radixLong = fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
        return div.toString(radix) + rem1.toInt().toString(radix);
      } else
        return "-" + this.neg().toString(radix);
    }
    var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned), rem = this;
    var result = "";
    while (true) {
      var remDiv = rem.div(radixToPower), intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0, digits = intval.toString(radix);
      rem = remDiv;
      if (rem.isZero())
        return digits + result;
      else {
        while (digits.length < 6)
          digits = "0" + digits;
        result = "" + digits + result;
      }
    }
  };
  LongPrototype.getHighBits = function getHighBits() {
    return this.high;
  };
  LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
    return this.high >>> 0;
  };
  LongPrototype.getLowBits = function getLowBits() {
    return this.low;
  };
  LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
    return this.low >>> 0;
  };
  LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
    if (this.isNegative())
      return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
    var val = this.high != 0 ? this.high : this.low;
    for (var bit = 31; bit > 0; bit--)
      if ((val & 1 << bit) != 0)
        break;
    return this.high != 0 ? bit + 33 : bit + 1;
  };
  LongPrototype.isZero = function isZero() {
    return this.high === 0 && this.low === 0;
  };
  LongPrototype.eqz = LongPrototype.isZero;
  LongPrototype.isNegative = function isNegative() {
    return !this.unsigned && this.high < 0;
  };
  LongPrototype.isPositive = function isPositive() {
    return this.unsigned || this.high >= 0;
  };
  LongPrototype.isOdd = function isOdd() {
    return (this.low & 1) === 1;
  };
  LongPrototype.isEven = function isEven() {
    return (this.low & 1) === 0;
  };
  LongPrototype.equals = function equals2(other) {
    if (!isLong(other))
      other = fromValue(other);
    if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1)
      return false;
    return this.high === other.high && this.low === other.low;
  };
  LongPrototype.eq = LongPrototype.equals;
  LongPrototype.notEquals = function notEquals(other) {
    return !this.eq(
      /* validates */
      other
    );
  };
  LongPrototype.neq = LongPrototype.notEquals;
  LongPrototype.ne = LongPrototype.notEquals;
  LongPrototype.lessThan = function lessThan(other) {
    return this.comp(
      /* validates */
      other
    ) < 0;
  };
  LongPrototype.lt = LongPrototype.lessThan;
  LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
    return this.comp(
      /* validates */
      other
    ) <= 0;
  };
  LongPrototype.lte = LongPrototype.lessThanOrEqual;
  LongPrototype.le = LongPrototype.lessThanOrEqual;
  LongPrototype.greaterThan = function greaterThan(other) {
    return this.comp(
      /* validates */
      other
    ) > 0;
  };
  LongPrototype.gt = LongPrototype.greaterThan;
  LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
    return this.comp(
      /* validates */
      other
    ) >= 0;
  };
  LongPrototype.gte = LongPrototype.greaterThanOrEqual;
  LongPrototype.ge = LongPrototype.greaterThanOrEqual;
  LongPrototype.compare = function compare(other) {
    if (!isLong(other))
      other = fromValue(other);
    if (this.eq(other))
      return 0;
    var thisNeg = this.isNegative(), otherNeg = other.isNegative();
    if (thisNeg && !otherNeg)
      return -1;
    if (!thisNeg && otherNeg)
      return 1;
    if (!this.unsigned)
      return this.sub(other).isNegative() ? -1 : 1;
    return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
  };
  LongPrototype.comp = LongPrototype.compare;
  LongPrototype.negate = function negate() {
    if (!this.unsigned && this.eq(MIN_VALUE))
      return MIN_VALUE;
    return this.not().add(ONE);
  };
  LongPrototype.neg = LongPrototype.negate;
  LongPrototype.add = function add2(addend) {
    if (!isLong(addend))
      addend = fromValue(addend);
    var a48 = this.high >>> 16;
    var a32 = this.high & 65535;
    var a16 = this.low >>> 16;
    var a00 = this.low & 65535;
    var b48 = addend.high >>> 16;
    var b32 = addend.high & 65535;
    var b16 = addend.low >>> 16;
    var b00 = addend.low & 65535;
    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 + b00;
    c16 += c00 >>> 16;
    c00 &= 65535;
    c16 += a16 + b16;
    c32 += c16 >>> 16;
    c16 &= 65535;
    c32 += a32 + b32;
    c48 += c32 >>> 16;
    c32 &= 65535;
    c48 += a48 + b48;
    c48 &= 65535;
    return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
  };
  LongPrototype.subtract = function subtract(subtrahend) {
    if (!isLong(subtrahend))
      subtrahend = fromValue(subtrahend);
    return this.add(subtrahend.neg());
  };
  LongPrototype.sub = LongPrototype.subtract;
  LongPrototype.multiply = function multiply2(multiplier) {
    if (this.isZero())
      return this;
    if (!isLong(multiplier))
      multiplier = fromValue(multiplier);
    if (wasm) {
      var low = wasm["mul"](
        this.low,
        this.high,
        multiplier.low,
        multiplier.high
      );
      return fromBits(low, wasm["get_high"](), this.unsigned);
    }
    if (multiplier.isZero())
      return this.unsigned ? UZERO : ZERO;
    if (this.eq(MIN_VALUE))
      return multiplier.isOdd() ? MIN_VALUE : ZERO;
    if (multiplier.eq(MIN_VALUE))
      return this.isOdd() ? MIN_VALUE : ZERO;
    if (this.isNegative()) {
      if (multiplier.isNegative())
        return this.neg().mul(multiplier.neg());
      else
        return this.neg().mul(multiplier).neg();
    } else if (multiplier.isNegative())
      return this.mul(multiplier.neg()).neg();
    if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
      return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);
    var a48 = this.high >>> 16;
    var a32 = this.high & 65535;
    var a16 = this.low >>> 16;
    var a00 = this.low & 65535;
    var b48 = multiplier.high >>> 16;
    var b32 = multiplier.high & 65535;
    var b16 = multiplier.low >>> 16;
    var b00 = multiplier.low & 65535;
    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 * b00;
    c16 += c00 >>> 16;
    c00 &= 65535;
    c16 += a16 * b00;
    c32 += c16 >>> 16;
    c16 &= 65535;
    c16 += a00 * b16;
    c32 += c16 >>> 16;
    c16 &= 65535;
    c32 += a32 * b00;
    c48 += c32 >>> 16;
    c32 &= 65535;
    c32 += a16 * b16;
    c48 += c32 >>> 16;
    c32 &= 65535;
    c32 += a00 * b32;
    c48 += c32 >>> 16;
    c32 &= 65535;
    c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
    c48 &= 65535;
    return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
  };
  LongPrototype.mul = LongPrototype.multiply;
  LongPrototype.divide = function divide(divisor) {
    if (!isLong(divisor))
      divisor = fromValue(divisor);
    if (divisor.isZero())
      throw Error("division by zero");
    if (wasm) {
      if (!this.unsigned && this.high === -2147483648 && divisor.low === -1 && divisor.high === -1) {
        return this;
      }
      var low = (this.unsigned ? wasm["div_u"] : wasm["div_s"])(
        this.low,
        this.high,
        divisor.low,
        divisor.high
      );
      return fromBits(low, wasm["get_high"](), this.unsigned);
    }
    if (this.isZero())
      return this.unsigned ? UZERO : ZERO;
    var approx, rem, res;
    if (!this.unsigned) {
      if (this.eq(MIN_VALUE)) {
        if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
          return MIN_VALUE;
        else if (divisor.eq(MIN_VALUE))
          return ONE;
        else {
          var halfThis = this.shr(1);
          approx = halfThis.div(divisor).shl(1);
          if (approx.eq(ZERO)) {
            return divisor.isNegative() ? ONE : NEG_ONE;
          } else {
            rem = this.sub(divisor.mul(approx));
            res = approx.add(rem.div(divisor));
            return res;
          }
        }
      } else if (divisor.eq(MIN_VALUE))
        return this.unsigned ? UZERO : ZERO;
      if (this.isNegative()) {
        if (divisor.isNegative())
          return this.neg().div(divisor.neg());
        return this.neg().div(divisor).neg();
      } else if (divisor.isNegative())
        return this.div(divisor.neg()).neg();
      res = ZERO;
    } else {
      if (!divisor.unsigned)
        divisor = divisor.toUnsigned();
      if (divisor.gt(this))
        return UZERO;
      if (divisor.gt(this.shru(1)))
        return UONE;
      res = UZERO;
    }
    rem = this;
    while (rem.gte(divisor)) {
      approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
      var log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48), approxRes = fromNumber(approx), approxRem = approxRes.mul(divisor);
      while (approxRem.isNegative() || approxRem.gt(rem)) {
        approx -= delta;
        approxRes = fromNumber(approx, this.unsigned);
        approxRem = approxRes.mul(divisor);
      }
      if (approxRes.isZero())
        approxRes = ONE;
      res = res.add(approxRes);
      rem = rem.sub(approxRem);
    }
    return res;
  };
  LongPrototype.div = LongPrototype.divide;
  LongPrototype.modulo = function modulo(divisor) {
    if (!isLong(divisor))
      divisor = fromValue(divisor);
    if (wasm) {
      var low = (this.unsigned ? wasm["rem_u"] : wasm["rem_s"])(
        this.low,
        this.high,
        divisor.low,
        divisor.high
      );
      return fromBits(low, wasm["get_high"](), this.unsigned);
    }
    return this.sub(this.div(divisor).mul(divisor));
  };
  LongPrototype.mod = LongPrototype.modulo;
  LongPrototype.rem = LongPrototype.modulo;
  LongPrototype.not = function not() {
    return fromBits(~this.low, ~this.high, this.unsigned);
  };
  LongPrototype.countLeadingZeros = function countLeadingZeros() {
    return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32;
  };
  LongPrototype.clz = LongPrototype.countLeadingZeros;
  LongPrototype.countTrailingZeros = function countTrailingZeros() {
    return this.low ? ctz32(this.low) : ctz32(this.high) + 32;
  };
  LongPrototype.ctz = LongPrototype.countTrailingZeros;
  LongPrototype.and = function and(other) {
    if (!isLong(other))
      other = fromValue(other);
    return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
  };
  LongPrototype.or = function or(other) {
    if (!isLong(other))
      other = fromValue(other);
    return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
  };
  LongPrototype.xor = function xor(other) {
    if (!isLong(other))
      other = fromValue(other);
    return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
  };
  LongPrototype.shiftLeft = function shiftLeft(numBits) {
    if (isLong(numBits))
      numBits = numBits.toInt();
    if ((numBits &= 63) === 0)
      return this;
    else if (numBits < 32)
      return fromBits(this.low << numBits, this.high << numBits | this.low >>> 32 - numBits, this.unsigned);
    else
      return fromBits(0, this.low << numBits - 32, this.unsigned);
  };
  LongPrototype.shl = LongPrototype.shiftLeft;
  LongPrototype.shiftRight = function shiftRight(numBits) {
    if (isLong(numBits))
      numBits = numBits.toInt();
    if ((numBits &= 63) === 0)
      return this;
    else if (numBits < 32)
      return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >> numBits, this.unsigned);
    else
      return fromBits(this.high >> numBits - 32, this.high >= 0 ? 0 : -1, this.unsigned);
  };
  LongPrototype.shr = LongPrototype.shiftRight;
  LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
    if (isLong(numBits))
      numBits = numBits.toInt();
    if ((numBits &= 63) === 0)
      return this;
    if (numBits < 32)
      return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >>> numBits, this.unsigned);
    if (numBits === 32)
      return fromBits(this.high, 0, this.unsigned);
    return fromBits(this.high >>> numBits - 32, 0, this.unsigned);
  };
  LongPrototype.shru = LongPrototype.shiftRightUnsigned;
  LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;
  LongPrototype.rotateLeft = function rotateLeft(numBits) {
    var b;
    if (isLong(numBits))
      numBits = numBits.toInt();
    if ((numBits &= 63) === 0)
      return this;
    if (numBits === 32)
      return fromBits(this.high, this.low, this.unsigned);
    if (numBits < 32) {
      b = 32 - numBits;
      return fromBits(this.low << numBits | this.high >>> b, this.high << numBits | this.low >>> b, this.unsigned);
    }
    numBits -= 32;
    b = 32 - numBits;
    return fromBits(this.high << numBits | this.low >>> b, this.low << numBits | this.high >>> b, this.unsigned);
  };
  LongPrototype.rotl = LongPrototype.rotateLeft;
  LongPrototype.rotateRight = function rotateRight(numBits) {
    var b;
    if (isLong(numBits))
      numBits = numBits.toInt();
    if ((numBits &= 63) === 0)
      return this;
    if (numBits === 32)
      return fromBits(this.high, this.low, this.unsigned);
    if (numBits < 32) {
      b = 32 - numBits;
      return fromBits(this.high << b | this.low >>> numBits, this.low << b | this.high >>> numBits, this.unsigned);
    }
    numBits -= 32;
    b = 32 - numBits;
    return fromBits(this.low << b | this.high >>> numBits, this.high << b | this.low >>> numBits, this.unsigned);
  };
  LongPrototype.rotr = LongPrototype.rotateRight;
  LongPrototype.toSigned = function toSigned() {
    if (!this.unsigned)
      return this;
    return fromBits(this.low, this.high, false);
  };
  LongPrototype.toUnsigned = function toUnsigned() {
    if (this.unsigned)
      return this;
    return fromBits(this.low, this.high, true);
  };
  LongPrototype.toBytes = function toBytes(le) {
    return le ? this.toBytesLE() : this.toBytesBE();
  };
  LongPrototype.toBytesLE = function toBytesLE() {
    var hi = this.high, lo = this.low;
    return [
      lo & 255,
      lo >>> 8 & 255,
      lo >>> 16 & 255,
      lo >>> 24,
      hi & 255,
      hi >>> 8 & 255,
      hi >>> 16 & 255,
      hi >>> 24
    ];
  };
  LongPrototype.toBytesBE = function toBytesBE() {
    var hi = this.high, lo = this.low;
    return [
      hi >>> 24,
      hi >>> 16 & 255,
      hi >>> 8 & 255,
      hi & 255,
      lo >>> 24,
      lo >>> 16 & 255,
      lo >>> 8 & 255,
      lo & 255
    ];
  };
  Long.fromBytes = function fromBytes(bytes, unsigned, le) {
    return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
  };
  Long.fromBytesLE = function fromBytesLE(bytes, unsigned) {
    return new Long(
      bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24,
      bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24,
      unsigned
    );
  };
  Long.fromBytesBE = function fromBytesBE(bytes, unsigned) {
    return new Long(
      bytes[4] << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7],
      bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3],
      unsigned
    );
  };
  const MAXIMUM_TOKEN_LENGTH = 16;
  function getS2CellIdFromToken(token) {
    if (token === "X") {
      token = "";
    }
    const paddedToken = token.padEnd(MAXIMUM_TOKEN_LENGTH, "0");
    return Long.fromString(paddedToken, true, 16);
  }
  function getS2TokenFromCellId(cellId) {
    if (cellId.isZero()) {
      return "X";
    }
    let numZeroDigits = cellId.countTrailingZeros();
    const remainder = numZeroDigits % 4;
    numZeroDigits = (numZeroDigits - remainder) / 4;
    const trailingZeroHexChars = numZeroDigits;
    numZeroDigits *= 4;
    const x = cellId.shiftRightUnsigned(numZeroDigits);
    const hexString = x.toString(16).replace(/0+$/, "");
    const zeroString = Array(17 - trailingZeroHexChars - hexString.length).join("0");
    return zeroString + hexString;
  }
  function getS2ChildCellId(cellId, index) {
    const newLsb = lsb(cellId).shiftRightUnsigned(2);
    const childCellId = cellId.add(Long.fromNumber(2 * index + 1 - 4).multiply(newLsb));
    return childCellId;
  }
  function lsb(cellId) {
    return cellId.and(cellId.not().add(1));
  }
  const FACE_BITS = 3;
  const MAX_LEVEL = 30;
  const POS_BITS = 2 * MAX_LEVEL + 1;
  const RADIAN_TO_DEGREE = 180 / Math.PI;
  function getS2CellFromQuadKey(hilbertQuadkey) {
    if (hilbertQuadkey.length === 0) {
      throw new Error(`Invalid Hilbert quad key ${hilbertQuadkey}`);
    }
    const parts = hilbertQuadkey.split("/");
    const face = parseInt(parts[0], 10);
    const position = parts[1];
    const maxLevel = position.length;
    let level = 0;
    const point = [0, 0];
    for (let i2 = maxLevel - 1; i2 >= 0; i2--) {
      level = maxLevel - i2;
      const bit = position[i2];
      let rx = 0;
      let ry = 0;
      if (bit === "1") {
        ry = 1;
      } else if (bit === "2") {
        rx = 1;
        ry = 1;
      } else if (bit === "3") {
        rx = 1;
      }
      const val = Math.pow(2, level - 1);
      rotateAndFlipQuadrant(val, point, rx, ry);
      point[0] += val * rx;
      point[1] += val * ry;
    }
    if (face % 2 === 1) {
      const t = point[0];
      point[0] = point[1];
      point[1] = t;
    }
    return {
      face,
      ij: point,
      level
    };
  }
  function getS2QuadkeyFromCellId(cellId) {
    if (cellId.isZero()) {
      return "";
    }
    let bin = cellId.toString(2);
    while (bin.length < FACE_BITS + POS_BITS) {
      bin = "0" + bin;
    }
    const lsbIndex = bin.lastIndexOf("1");
    const faceB = bin.substring(0, 3);
    const posB = bin.substring(3, lsbIndex);
    const levelN = posB.length / 2;
    const faceS = Long.fromString(faceB, true, 2).toString(10);
    let posS = "";
    if (levelN !== 0) {
      posS = Long.fromString(posB, true, 2).toString(4);
      while (posS.length < levelN) {
        posS = "0" + posS;
      }
    }
    return `${faceS}/${posS}`;
  }
  function IJToST(ij, level, offsets) {
    const maxSize = 1 << level;
    return [(ij[0] + offsets[0]) / maxSize, (ij[1] + offsets[1]) / maxSize];
  }
  function singleSTtoUV(st) {
    if (st >= 0.5) {
      return 1 / 3 * (4 * st * st - 1);
    }
    return 1 / 3 * (1 - 4 * (1 - st) * (1 - st));
  }
  function STToUV(st) {
    return [singleSTtoUV(st[0]), singleSTtoUV(st[1])];
  }
  function FaceUVToXYZ(face, _ref) {
    let [u, v] = _ref;
    switch (face) {
      case 0:
        return [1, u, v];
      case 1:
        return [-u, 1, v];
      case 2:
        return [-u, -v, 1];
      case 3:
        return [-1, -v, -u];
      case 4:
        return [v, -1, -u];
      case 5:
        return [v, u, -1];
      default:
        throw new Error("Invalid face");
    }
  }
  function XYZToLngLat(_ref2) {
    let [x, y, z] = _ref2;
    const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
    const lng = Math.atan2(y, x);
    return [lng * RADIAN_TO_DEGREE, lat * RADIAN_TO_DEGREE];
  }
  function rotateAndFlipQuadrant(n2, point, rx, ry) {
    if (ry === 0) {
      if (rx === 1) {
        point[0] = n2 - 1 - point[0];
        point[1] = n2 - 1 - point[1];
      }
      const x = point[0];
      point[0] = point[1];
      point[1] = x;
    }
  }
  function getS2LngLatFromS2Cell(s2Cell) {
    const st = IJToST(s2Cell.ij, s2Cell.level, [0.5, 0.5]);
    const uv = STToUV(st);
    const xyz = FaceUVToXYZ(s2Cell.face, uv);
    return XYZToLngLat(xyz);
  }
  const MAX_RESOLUTION = 100;
  function getS2BoundaryFlatFromS2Cell(s2cell) {
    const {
      face,
      ij,
      level
    } = s2cell;
    const offsets = [[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]];
    const resolution = Math.max(1, Math.ceil(MAX_RESOLUTION * Math.pow(2, -level)));
    const result = new Float64Array(4 * resolution * 2 + 2);
    let ptIndex = 0;
    let prevLng = 0;
    for (let i2 = 0; i2 < 4; i2++) {
      const offset = offsets[i2].slice(0);
      const nextOffset = offsets[i2 + 1];
      const stepI = (nextOffset[0] - offset[0]) / resolution;
      const stepJ = (nextOffset[1] - offset[1]) / resolution;
      for (let j = 0; j < resolution; j++) {
        offset[0] += stepI;
        offset[1] += stepJ;
        const st = IJToST(ij, level, offset);
        const uv = STToUV(st);
        const xyz = FaceUVToXYZ(face, uv);
        const lngLat = XYZToLngLat(xyz);
        if (Math.abs(lngLat[1]) > 89.999) {
          lngLat[0] = prevLng;
        }
        const deltaLng = lngLat[0] - prevLng;
        lngLat[0] += deltaLng > 180 ? -360 : deltaLng < -180 ? 360 : 0;
        result[ptIndex++] = lngLat[0];
        result[ptIndex++] = lngLat[1];
        prevLng = lngLat[0];
      }
    }
    result[ptIndex++] = result[0];
    result[ptIndex++] = result[1];
    return result;
  }
  function getS2Cell(tokenOrKey) {
    const key = getS2QuadKey(tokenOrKey);
    const s2cell = getS2CellFromQuadKey(key);
    return s2cell;
  }
  function getS2QuadKey(tokenOrKey) {
    if (tokenOrKey.indexOf("/") > 0) {
      return tokenOrKey;
    }
    const id = getS2CellIdFromToken(tokenOrKey);
    return getS2QuadkeyFromCellId(id);
  }
  function getS2LngLat(s2Token) {
    const s2cell = getS2Cell(s2Token);
    return getS2LngLatFromS2Cell(s2cell);
  }
  function getS2Region(s2cell) {
    let region;
    if (s2cell.face === 2 || s2cell.face === 5) {
      let corners = null;
      let len2 = 0;
      for (let i2 = 0; i2 < 4; i2++) {
        const key = `${s2cell.face}/${i2}`;
        const cell = getS2Cell(key);
        const corns = getS2BoundaryFlatFromS2Cell(cell);
        if (typeof corners === "undefined" || corners === null)
          corners = new Float64Array(4 * corns.length);
        corners.set(corns, len2);
        len2 += corns.length;
      }
      region = get2DRegionFromS2Corners(corners);
    } else {
      const corners = getS2BoundaryFlatFromS2Cell(s2cell);
      region = get2DRegionFromS2Corners(corners);
    }
    return region;
  }
  function get2DRegionFromS2Corners(corners) {
    if (corners.length % 2 !== 0) {
      throw new Error("Invalid corners");
    }
    const longitudes = [];
    const latitudes = [];
    for (let i2 = 0; i2 < corners.length; i2 += 2) {
      longitudes.push(corners[i2]);
      latitudes.push(corners[i2 + 1]);
    }
    longitudes.sort((a2, b) => a2 - b);
    latitudes.sort((a2, b) => a2 - b);
    return {
      west: longitudes[0],
      east: longitudes[longitudes.length - 1],
      north: latitudes[latitudes.length - 1],
      south: latitudes[0]
    };
  }
  function getS2OrientedBoundingBoxCornerPoints(tokenOrKey, heightInfo) {
    const min = (heightInfo === null || heightInfo === void 0 ? void 0 : heightInfo.minimumHeight) || 0;
    const max = (heightInfo === null || heightInfo === void 0 ? void 0 : heightInfo.maximumHeight) || 0;
    const s2cell = getS2Cell(tokenOrKey);
    const region = getS2Region(s2cell);
    const W = region.west;
    const S = region.south;
    const E = region.east;
    const N = region.north;
    const points = [];
    points.push(new Vector3(W, N, min));
    points.push(new Vector3(E, N, min));
    points.push(new Vector3(E, S, min));
    points.push(new Vector3(W, S, min));
    points.push(new Vector3(W, N, max));
    points.push(new Vector3(E, N, max));
    points.push(new Vector3(E, S, max));
    points.push(new Vector3(W, S, max));
    return points;
  }
  function convertS2BoundingVolumetoOBB(s2VolumeInfo) {
    const token = s2VolumeInfo.token;
    const heightInfo = {
      minimumHeight: s2VolumeInfo.minimumHeight,
      maximumHeight: s2VolumeInfo.maximumHeight
    };
    const corners = getS2OrientedBoundingBoxCornerPoints(token, heightInfo);
    const center = getS2LngLat(token);
    const centerLng = center[0];
    const centerLat = center[1];
    const point = Ellipsoid.WGS84.cartographicToCartesian([centerLng, centerLat, heightInfo.maximumHeight]);
    const centerPointAdditional = new Vector3(point[0], point[1], point[2]);
    corners.push(centerPointAdditional);
    const obb = makeOrientedBoundingBoxFromPoints(corners);
    const box = [...obb.center, ...obb.halfAxes];
    return box;
  }
  const QUADTREE_DIVISION_COUNT = 4;
  const OCTREE_DIVISION_COUNT = 8;
  const SUBDIVISION_COUNT_MAP = {
    QUADTREE: QUADTREE_DIVISION_COUNT,
    OCTREE: OCTREE_DIVISION_COUNT
  };
  function getChildS2VolumeBox(s2VolumeBox, index, subdivisionScheme) {
    if (s2VolumeBox !== null && s2VolumeBox !== void 0 && s2VolumeBox.box) {
      const cellId = getS2CellIdFromToken(s2VolumeBox.s2VolumeInfo.token);
      const childCellId = getS2ChildCellId(cellId, index);
      const childToken = getS2TokenFromCellId(childCellId);
      const s2ChildVolumeInfo = {
        ...s2VolumeBox.s2VolumeInfo
      };
      s2ChildVolumeInfo.token = childToken;
      switch (subdivisionScheme) {
        case "OCTREE":
          const s2VolumeInfo = s2VolumeBox.s2VolumeInfo;
          const delta = s2VolumeInfo.maximumHeight - s2VolumeInfo.minimumHeight;
          const sizeZ = delta / 2;
          const midZ = s2VolumeInfo.minimumHeight + delta / 2;
          s2VolumeInfo.minimumHeight = midZ - sizeZ;
          s2VolumeInfo.maximumHeight = midZ + sizeZ;
          break;
      }
      const box = convertS2BoundingVolumetoOBB(s2ChildVolumeInfo);
      const childS2VolumeBox = {
        box,
        s2VolumeInfo: s2ChildVolumeInfo
      };
      return childS2VolumeBox;
    }
    return void 0;
  }
  async function parseImplicitTiles(params) {
    const {
      implicitOptions,
      parentData = {
        mortonIndex: 0,
        x: 0,
        y: 0,
        z: 0
      },
      childIndex = 0,
      s2VolumeBox,
      loaderOptions
    } = params;
    let {
      subtree,
      level = 0,
      globalData = {
        level: 0,
        mortonIndex: 0,
        x: 0,
        y: 0,
        z: 0
      }
    } = params;
    const {
      subdivisionScheme,
      subtreeLevels,
      maximumLevel,
      contentUrlTemplate,
      subtreesUriTemplate,
      basePath
    } = implicitOptions;
    const tile = {
      children: [],
      lodMetricValue: 0,
      contentUrl: ""
    };
    if (!maximumLevel) {
      log$1.once(`Missing 'maximumLevel' or 'availableLevels' property. The subtree ${contentUrlTemplate} won't be loaded...`);
      return tile;
    }
    const lev = level + globalData.level;
    if (lev > maximumLevel) {
      return tile;
    }
    const childrenPerTile = SUBDIVISION_COUNT_MAP[subdivisionScheme];
    const bitsPerTile = Math.log2(childrenPerTile);
    const childX = childIndex & 1;
    const childY = childIndex >> 1 & 1;
    const childZ = childIndex >> 2 & 1;
    const levelOffset = (childrenPerTile ** level - 1) / (childrenPerTile - 1);
    let childTileMortonIndex = concatBits(parentData.mortonIndex, childIndex, bitsPerTile);
    let tileAvailabilityIndex = levelOffset + childTileMortonIndex;
    let childTileX = concatBits(parentData.x, childX, 1);
    let childTileY = concatBits(parentData.y, childY, 1);
    let childTileZ = concatBits(parentData.z, childZ, 1);
    let isChildSubtreeAvailable = false;
    if (level >= subtreeLevels) {
      isChildSubtreeAvailable = getAvailabilityResult(subtree.childSubtreeAvailability, childTileMortonIndex);
    }
    const x = concatBits(globalData.x, childTileX, level);
    const y = concatBits(globalData.y, childTileY, level);
    const z = concatBits(globalData.z, childTileZ, level);
    if (isChildSubtreeAvailable) {
      const subtreePath = `${basePath}/${subtreesUriTemplate}`;
      const childSubtreeUrl = replaceContentUrlTemplate(subtreePath, lev, x, y, z);
      const childSubtree = await load(childSubtreeUrl, Tile3DSubtreeLoader, loaderOptions);
      subtree = childSubtree;
      globalData = {
        mortonIndex: childTileMortonIndex,
        x: childTileX,
        y: childTileY,
        z: childTileZ,
        level
      };
      childTileMortonIndex = 0;
      tileAvailabilityIndex = 0;
      childTileX = 0;
      childTileY = 0;
      childTileZ = 0;
      level = 0;
    }
    const isTileAvailable = getAvailabilityResult(subtree.tileAvailability, tileAvailabilityIndex);
    if (!isTileAvailable) {
      return tile;
    }
    const isContentAvailable = getAvailabilityResult(subtree.contentAvailability, tileAvailabilityIndex);
    if (isContentAvailable) {
      tile.contentUrl = replaceContentUrlTemplate(contentUrlTemplate, lev, x, y, z);
    }
    const childTileLevel = level + 1;
    const pData = {
      mortonIndex: childTileMortonIndex,
      x: childTileX,
      y: childTileY,
      z: childTileZ
    };
    for (let index = 0; index < childrenPerTile; index++) {
      const childS2VolumeBox = getChildS2VolumeBox(s2VolumeBox, index, subdivisionScheme);
      const childTileParsed = await parseImplicitTiles({
        subtree,
        implicitOptions,
        loaderOptions,
        parentData: pData,
        childIndex: index,
        level: childTileLevel,
        globalData: {
          ...globalData
        },
        s2VolumeBox: childS2VolumeBox
      });
      if (childTileParsed.contentUrl || childTileParsed.children.length) {
        const globalLevel = lev + 1;
        const childCoordinates = {
          childTileX,
          childTileY,
          childTileZ
        };
        const formattedTile = formatTileData(childTileParsed, globalLevel, childCoordinates, implicitOptions, s2VolumeBox);
        tile.children.push(formattedTile);
      }
    }
    return tile;
  }
  function getAvailabilityResult(availabilityData, index) {
    let availabilityObject;
    if (Array.isArray(availabilityData)) {
      availabilityObject = availabilityData[0];
      if (availabilityData.length > 1) {
        log$1.once('Not supported extension "3DTILES_multiple_contents" has been detected');
      }
    } else {
      availabilityObject = availabilityData;
    }
    if ("constant" in availabilityObject) {
      return Boolean(availabilityObject.constant);
    }
    if (availabilityObject.explicitBitstream) {
      return getBooleanValueFromBitstream(index, availabilityObject.explicitBitstream);
    }
    return false;
  }
  function formatTileData(tile, level, childCoordinates, options, s2VolumeBox) {
    const {
      basePath,
      refine,
      getRefine: getRefine2,
      lodMetricType,
      getTileType: getTileType2,
      rootLodMetricValue,
      rootBoundingVolume
    } = options;
    const uri = tile.contentUrl && tile.contentUrl.replace(`${basePath}/`, "");
    const lodMetricValue = rootLodMetricValue / 2 ** level;
    const boundingVolume = s2VolumeBox !== null && s2VolumeBox !== void 0 && s2VolumeBox.box ? {
      box: s2VolumeBox.box
    } : rootBoundingVolume;
    const boundingVolumeForChildTile = calculateBoundingVolumeForChildTile(level, boundingVolume, childCoordinates);
    return {
      children: tile.children,
      contentUrl: tile.contentUrl,
      content: {
        uri
      },
      id: tile.contentUrl,
      refine: getRefine2(refine),
      type: getTileType2(tile),
      lodMetricType,
      lodMetricValue,
      geometricError: lodMetricValue,
      transform: tile.transform,
      boundingVolume: boundingVolumeForChildTile
    };
  }
  function calculateBoundingVolumeForChildTile(level, rootBoundingVolume, childCoordinates) {
    if (rootBoundingVolume.region) {
      const {
        childTileX,
        childTileY,
        childTileZ
      } = childCoordinates;
      const [west, south, east, north, minimumHeight, maximumHeight] = rootBoundingVolume.region;
      const boundingVolumesCount = 2 ** level;
      const sizeX = (east - west) / boundingVolumesCount;
      const sizeY = (north - south) / boundingVolumesCount;
      const sizeZ = (maximumHeight - minimumHeight) / boundingVolumesCount;
      const [childWest, childEast] = [west + sizeX * childTileX, west + sizeX * (childTileX + 1)];
      const [childSouth, childNorth] = [south + sizeY * childTileY, south + sizeY * (childTileY + 1)];
      const [childMinimumHeight, childMaximumHeight] = [minimumHeight + sizeZ * childTileZ, minimumHeight + sizeZ * (childTileZ + 1)];
      return {
        region: [childWest, childSouth, childEast, childNorth, childMinimumHeight, childMaximumHeight]
      };
    }
    if (rootBoundingVolume.box) {
      return rootBoundingVolume;
    }
    throw new Error(`Unsupported bounding volume type ${rootBoundingVolume}`);
  }
  function concatBits(higher, lower, shift) {
    return (higher << shift) + lower;
  }
  function replaceContentUrlTemplate(templateUrl, level, x, y, z) {
    const mapUrl = generateMapUrl({
      level,
      x,
      y,
      z
    });
    return templateUrl.replace(/{level}|{x}|{y}|{z}/gi, (matched) => mapUrl[matched]);
  }
  function generateMapUrl(items) {
    const mapUrl = {};
    for (const key in items) {
      mapUrl[`{${key}}`] = items[key];
    }
    return mapUrl;
  }
  function getBooleanValueFromBitstream(availabilityIndex, availabilityBuffer) {
    const byteIndex = Math.floor(availabilityIndex / 8);
    const bitIndex = availabilityIndex % 8;
    const bitValue = availabilityBuffer[byteIndex] >> bitIndex & 1;
    return bitValue === 1;
  }
  function getTileType(tile) {
    let tileContentUrl = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    if (!tileContentUrl) {
      return TILE_TYPE.EMPTY;
    }
    const contentUrl = tileContentUrl.split("?")[0];
    const fileExtension = contentUrl.split(".").pop();
    switch (fileExtension) {
      case "pnts":
        return TILE_TYPE.POINTCLOUD;
      case "i3dm":
      case "b3dm":
      case "glb":
      case "gltf":
        return TILE_TYPE.SCENEGRAPH;
      default:
        return fileExtension || TILE_TYPE.EMPTY;
    }
  }
  function getRefine(refine) {
    switch (refine) {
      case "REPLACE":
      case "replace":
        return TILE_REFINEMENT.REPLACE;
      case "ADD":
      case "add":
        return TILE_REFINEMENT.ADD;
      default:
        return refine;
    }
  }
  function resolveUri(uri, basePath) {
    const urlSchemeRegex = /^[a-z][0-9a-z+.-]*:/i;
    if (urlSchemeRegex.test(basePath)) {
      const url = new URL(uri, `${basePath}/`);
      return decodeURI(url.toString());
    } else if (uri.startsWith("/")) {
      return uri;
    }
    return resolve(basePath, uri);
  }
  function normalizeTileData(tile, basePath) {
    if (!tile) {
      return null;
    }
    let tileContentUrl;
    if (tile.content) {
      var _tile$content;
      const contentUri = tile.content.uri || ((_tile$content = tile.content) === null || _tile$content === void 0 ? void 0 : _tile$content.url);
      if (typeof contentUri !== "undefined") {
        tileContentUrl = resolveUri(contentUri, basePath);
      }
    }
    const tilePostprocessed = {
      ...tile,
      id: tileContentUrl,
      contentUrl: tileContentUrl,
      lodMetricType: LOD_METRIC_TYPE.GEOMETRIC_ERROR,
      lodMetricValue: tile.geometricError,
      transformMatrix: tile.transform,
      type: getTileType(tile, tileContentUrl),
      refine: getRefine(tile.refine)
    };
    return tilePostprocessed;
  }
  async function normalizeTileHeaders(tileset, basePath, options) {
    let root = null;
    const rootImplicitTilingExtension = getImplicitTilingExtensionData(tileset.root);
    if (rootImplicitTilingExtension && tileset.root) {
      root = await normalizeImplicitTileHeaders(tileset.root, tileset, basePath, rootImplicitTilingExtension, options);
    } else {
      root = normalizeTileData(tileset.root, basePath);
    }
    const stack2 = [];
    stack2.push(root);
    while (stack2.length > 0) {
      const tile = stack2.pop() || {};
      const children = tile.children || [];
      const childrenPostprocessed = [];
      for (const childHeader of children) {
        const childImplicitTilingExtension = getImplicitTilingExtensionData(childHeader);
        let childHeaderPostprocessed;
        if (childImplicitTilingExtension) {
          childHeaderPostprocessed = await normalizeImplicitTileHeaders(childHeader, tileset, basePath, childImplicitTilingExtension, options);
        } else {
          childHeaderPostprocessed = normalizeTileData(childHeader, basePath);
        }
        if (childHeaderPostprocessed) {
          childrenPostprocessed.push(childHeaderPostprocessed);
          stack2.push(childHeaderPostprocessed);
        }
      }
      tile.children = childrenPostprocessed;
    }
    return root;
  }
  async function normalizeImplicitTileHeaders(tile, tileset, basePath, implicitTilingExtension, options) {
    var _tile$content2, _tileset$root, _tile$boundingVolume$;
    const {
      subdivisionScheme,
      maximumLevel,
      availableLevels,
      subtreeLevels,
      subtrees: {
        uri: subtreesUriTemplate
      }
    } = implicitTilingExtension;
    const replacedUrlTemplate = replaceContentUrlTemplate(subtreesUriTemplate, 0, 0, 0, 0);
    const subtreeUrl = resolveUri(replacedUrlTemplate, basePath);
    const subtree = await load(subtreeUrl, Tile3DSubtreeLoader, options);
    const tileContentUri = (_tile$content2 = tile.content) === null || _tile$content2 === void 0 ? void 0 : _tile$content2.uri;
    const contentUrlTemplate = tileContentUri ? resolveUri(tileContentUri, basePath) : "";
    const refine = tileset === null || tileset === void 0 ? void 0 : (_tileset$root = tileset.root) === null || _tileset$root === void 0 ? void 0 : _tileset$root.refine;
    const rootLodMetricValue = tile.geometricError;
    const s2VolumeInfo = (_tile$boundingVolume$ = tile.boundingVolume.extensions) === null || _tile$boundingVolume$ === void 0 ? void 0 : _tile$boundingVolume$["3DTILES_bounding_volume_S2"];
    if (s2VolumeInfo) {
      const box = convertS2BoundingVolumetoOBB(s2VolumeInfo);
      const s2VolumeBox = {
        box,
        s2VolumeInfo
      };
      tile.boundingVolume = s2VolumeBox;
    }
    const rootBoundingVolume = tile.boundingVolume;
    const implicitOptions = {
      contentUrlTemplate,
      subtreesUriTemplate,
      subdivisionScheme,
      subtreeLevels,
      maximumLevel: Number.isFinite(availableLevels) ? availableLevels - 1 : maximumLevel,
      refine,
      basePath,
      lodMetricType: LOD_METRIC_TYPE.GEOMETRIC_ERROR,
      rootLodMetricValue,
      rootBoundingVolume,
      getTileType,
      getRefine
    };
    return await normalizeImplicitTileData(tile, basePath, subtree, implicitOptions, options);
  }
  async function normalizeImplicitTileData(tile, basePath, rootSubtree, implicitOptions, loaderOptions) {
    if (!tile) {
      return null;
    }
    const {
      children,
      contentUrl
    } = await parseImplicitTiles({
      subtree: rootSubtree,
      implicitOptions,
      loaderOptions
    });
    let tileContentUrl;
    let tileContent = null;
    if (contentUrl) {
      tileContentUrl = contentUrl;
      tileContent = {
        uri: contentUrl.replace(`${basePath}/`, "")
      };
    }
    const tilePostprocessed = {
      ...tile,
      id: tileContentUrl,
      contentUrl: tileContentUrl,
      lodMetricType: LOD_METRIC_TYPE.GEOMETRIC_ERROR,
      lodMetricValue: tile.geometricError,
      transformMatrix: tile.transform,
      type: getTileType(tile, tileContentUrl),
      refine: getRefine(tile.refine),
      content: tileContent || tile.content,
      children
    };
    return tilePostprocessed;
  }
  function getImplicitTilingExtensionData(tile) {
    var _tile$extensions;
    return (tile === null || tile === void 0 ? void 0 : (_tile$extensions = tile.extensions) === null || _tile$extensions === void 0 ? void 0 : _tile$extensions["3DTILES_implicit_tiling"]) || (tile === null || tile === void 0 ? void 0 : tile.implicitTiling);
  }
  const Tiles3DLoader = {
    id: "3d-tiles",
    name: "3D Tiles",
    module: "3d-tiles",
    version: VERSION$5,
    extensions: ["cmpt", "pnts", "b3dm", "i3dm"],
    mimeTypes: ["application/octet-stream"],
    tests: ["cmpt", "pnts", "b3dm", "i3dm"],
    parse: parse$1,
    options: {
      "3d-tiles": {
        loadGLTF: true,
        decodeQuantizedPositions: false,
        isTileset: "auto",
        assetGltfUpAxis: null
      }
    }
  };
  async function parse$1(data) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let context = arguments.length > 2 ? arguments[2] : void 0;
    const loaderOptions = options["3d-tiles"] || {};
    let isTileset;
    if (loaderOptions.isTileset === "auto") {
      isTileset = (context === null || context === void 0 ? void 0 : context.url) && context.url.indexOf(".json") !== -1;
    } else {
      isTileset = loaderOptions.isTileset;
    }
    return isTileset ? parseTileset(data, options, context) : parseTile(data, options, context);
  }
  async function parseTileset(data, options, context) {
    var _tilesetJson$root;
    const tilesetJson = JSON.parse(new TextDecoder().decode(data));
    const tilesetUrl = (context === null || context === void 0 ? void 0 : context.url) || "";
    const basePath = getBaseUri(tilesetUrl);
    const normalizedRoot = await normalizeTileHeaders(tilesetJson, basePath, options || {});
    const tilesetJsonPostprocessed = {
      ...tilesetJson,
      shape: "tileset3d",
      loader: Tiles3DLoader,
      url: tilesetUrl,
      queryString: (context === null || context === void 0 ? void 0 : context.queryString) || "",
      basePath,
      root: normalizedRoot || tilesetJson.root,
      type: TILESET_TYPE.TILES3D,
      lodMetricType: LOD_METRIC_TYPE.GEOMETRIC_ERROR,
      lodMetricValue: ((_tilesetJson$root = tilesetJson.root) === null || _tilesetJson$root === void 0 ? void 0 : _tilesetJson$root.geometricError) || 0
    };
    return tilesetJsonPostprocessed;
  }
  async function parseTile(arrayBuffer, options, context) {
    const tile = {
      content: {
        shape: "tile3d",
        featureIds: null
      }
    };
    const byteOffset = 0;
    await parse3DTile(arrayBuffer, byteOffset, options, context, tile.content);
    return tile.content;
  }
  function getBaseUri(tilesetUrl) {
    return dirname(tilesetUrl);
  }
  const CESIUM_ION_URL = "https://api.cesium.com/v1/assets";
  async function getIonTilesetMetadata(accessToken, assetId) {
    if (!assetId) {
      const assets = await getIonAssets(accessToken);
      for (const item of assets.items) {
        if (item.type === "3DTILES") {
          assetId = item.id;
        }
      }
    }
    const ionAssetMetadata = await getIonAssetMetadata(accessToken, assetId);
    const {
      type,
      url
    } = ionAssetMetadata;
    assert$6(type === "3DTILES" && url);
    ionAssetMetadata.headers = {
      Authorization: `Bearer ${ionAssetMetadata.accessToken}`
    };
    return ionAssetMetadata;
  }
  async function getIonAssets(accessToken) {
    assert$6(accessToken);
    const url = CESIUM_ION_URL;
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };
    const response = await fetchFile(url, {
      headers
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  }
  async function getIonAssetMetadata(accessToken, assetId) {
    assert$6(accessToken, assetId);
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };
    const url = `${CESIUM_ION_URL}/${assetId}`;
    let response = await fetchFile(`${url}`, {
      headers
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    let metadata = await response.json();
    response = await fetchFile(`${url}/endpoint`, {
      headers
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const tilesetInfo = await response.json();
    metadata = {
      ...metadata,
      ...tilesetInfo
    };
    return metadata;
  }
  async function preload(url) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    options = options["cesium-ion"] || {};
    const {
      accessToken
    } = options;
    let assetId = options.assetId;
    if (!Number.isFinite(assetId)) {
      const matched = url.match(/\/([0-9]+)\/tileset.json/);
      assetId = matched && matched[1];
    }
    return getIonTilesetMetadata(accessToken, assetId);
  }
  const CesiumIonLoader = {
    ...Tiles3DLoader,
    id: "cesium-ion",
    name: "Cesium Ion",
    preload,
    parse: async (data, options, context) => {
      options = {
        ...options
      };
      options["3d-tiles"] = options["cesium-ion"];
      options.loader = CesiumIonLoader;
      return Tiles3DLoader.parse(data, options, context);
    },
    options: {
      "cesium-ion": {
        ...Tiles3DLoader.options["3d-tiles"],
        accessToken: null
      }
    }
  };
  const DEFAULT_ROW_COUNT$2 = 100;
  class BaseTableBatchAggregator {
    constructor(schema, options) {
      this.schema = void 0;
      this.options = void 0;
      this.shape = void 0;
      this.length = 0;
      this.rows = null;
      this.cursor = 0;
      this._headers = [];
      this.options = options;
      this.schema = schema;
      if (!Array.isArray(schema)) {
        this._headers = [];
        for (const key in schema) {
          this._headers[schema[key].index] = schema[key].name;
        }
      }
    }
    rowCount() {
      return this.length;
    }
    addArrayRow(row, cursor) {
      if (Number.isFinite(cursor)) {
        this.cursor = cursor;
      }
      this.shape = "array-row-table";
      this.rows = this.rows || new Array(DEFAULT_ROW_COUNT$2);
      this.rows[this.length] = row;
      this.length++;
    }
    addObjectRow(row, cursor) {
      if (Number.isFinite(cursor)) {
        this.cursor = cursor;
      }
      this.shape = "object-row-table";
      this.rows = this.rows || new Array(DEFAULT_ROW_COUNT$2);
      this.rows[this.length] = row;
      this.length++;
    }
    getBatch() {
      let rows = this.rows;
      if (!rows) {
        return null;
      }
      rows = rows.slice(0, this.length);
      this.rows = null;
      const batch = {
        shape: this.shape || "array-row-table",
        batchType: "data",
        data: rows,
        length: this.length,
        schema: this.schema,
        cursor: this.cursor
      };
      return batch;
    }
  }
  function convertToObjectRow(arrayRow, headers) {
    if (!arrayRow) {
      throw new Error("null row");
    }
    const objectRow = {};
    if (headers) {
      for (let i2 = 0; i2 < headers.length; i2++) {
        objectRow[headers[i2]] = arrayRow[i2];
      }
    } else {
      for (let i2 = 0; i2 < arrayRow.length; i2++) {
        const columnName = `column-${i2}`;
        objectRow[columnName] = arrayRow[i2];
      }
    }
    return objectRow;
  }
  function convertToArrayRow(objectRow, headers) {
    if (!objectRow) {
      throw new Error("null row");
    }
    if (headers) {
      const arrayRow = new Array(headers.length);
      for (let i2 = 0; i2 < headers.length; i2++) {
        arrayRow[i2] = objectRow[headers[i2]];
      }
      return arrayRow;
    }
    return Object.values(objectRow);
  }
  function inferHeadersFromArrayRow(arrayRow) {
    const headers = [];
    for (let i2 = 0; i2 < arrayRow.length; i2++) {
      const columnName = `column-${i2}`;
      headers.push(columnName);
    }
    return headers;
  }
  function inferHeadersFromObjectRow(row) {
    return Object.keys(row);
  }
  const DEFAULT_ROW_COUNT$1 = 100;
  class RowTableBatchAggregator {
    constructor(schema, options) {
      this.schema = void 0;
      this.options = void 0;
      this.length = 0;
      this.objectRows = null;
      this.arrayRows = null;
      this.cursor = 0;
      this._headers = null;
      this.options = options;
      this.schema = schema;
      if (schema) {
        this._headers = [];
        for (const key in schema) {
          this._headers[schema[key].index] = schema[key].name;
        }
      }
    }
    rowCount() {
      return this.length;
    }
    addArrayRow(row, cursor) {
      if (Number.isFinite(cursor)) {
        this.cursor = cursor;
      }
      this._headers || (this._headers = inferHeadersFromArrayRow(row));
      switch (this.options.shape) {
        case "object-row-table":
          const rowObject = convertToObjectRow(row, this._headers);
          this.addObjectRow(rowObject, cursor);
          break;
        case "array-row-table":
          this.arrayRows = this.arrayRows || new Array(DEFAULT_ROW_COUNT$1);
          this.arrayRows[this.length] = row;
          this.length++;
          break;
      }
    }
    addObjectRow(row, cursor) {
      if (Number.isFinite(cursor)) {
        this.cursor = cursor;
      }
      this._headers || (this._headers = inferHeadersFromObjectRow(row));
      switch (this.options.shape) {
        case "array-row-table":
          const rowArray = convertToArrayRow(row, this._headers);
          this.addArrayRow(rowArray, cursor);
          break;
        case "object-row-table":
          this.objectRows = this.objectRows || new Array(DEFAULT_ROW_COUNT$1);
          this.objectRows[this.length] = row;
          this.length++;
          break;
      }
    }
    getBatch() {
      let rows = this.arrayRows || this.objectRows;
      if (!rows) {
        return null;
      }
      rows = rows.slice(0, this.length);
      this.arrayRows = null;
      this.objectRows = null;
      return {
        shape: this.options.shape,
        batchType: "data",
        data: rows,
        length: this.length,
        schema: this.schema,
        cursor: this.cursor
      };
    }
  }
  const DEFAULT_ROW_COUNT = 100;
  class ColumnarTableBatchAggregator {
    constructor(schema, options) {
      this.schema = void 0;
      this.length = 0;
      this.allocated = 0;
      this.columns = {};
      this.schema = schema;
      this._reallocateColumns();
    }
    rowCount() {
      return this.length;
    }
    addArrayRow(row) {
      this._reallocateColumns();
      let i2 = 0;
      for (const fieldName in this.columns) {
        this.columns[fieldName][this.length] = row[i2++];
      }
      this.length++;
    }
    addObjectRow(row) {
      this._reallocateColumns();
      for (const fieldName in row) {
        this.columns[fieldName][this.length] = row[fieldName];
      }
      this.length++;
    }
    getBatch() {
      this._pruneColumns();
      const columns = Array.isArray(this.schema) ? this.columns : {};
      if (!Array.isArray(this.schema)) {
        for (const fieldName in this.schema) {
          const field = this.schema[fieldName];
          columns[field.name] = this.columns[field.index];
        }
      }
      this.columns = {};
      const batch = {
        shape: "columnar-table",
        batchType: "data",
        data: columns,
        schema: this.schema,
        length: this.length
      };
      return batch;
    }
    _reallocateColumns() {
      if (this.length < this.allocated) {
        return;
      }
      this.allocated = this.allocated > 0 ? this.allocated *= 2 : DEFAULT_ROW_COUNT;
      this.columns = {};
      for (const fieldName in this.schema) {
        const field = this.schema[fieldName];
        const ArrayType = field.type || Float32Array;
        const oldColumn = this.columns[field.index];
        if (oldColumn && ArrayBuffer.isView(oldColumn)) {
          const typedArray = new ArrayType(this.allocated);
          typedArray.set(oldColumn);
          this.columns[field.index] = typedArray;
        } else if (oldColumn) {
          oldColumn.length = this.allocated;
          this.columns[field.index] = oldColumn;
        } else {
          this.columns[field.index] = new ArrayType(this.allocated);
        }
      }
    }
    _pruneColumns() {
      for (const [columnName, column] of Object.entries(this.columns)) {
        this.columns[columnName] = column.slice(0, this.length);
      }
    }
  }
  const DEFAULT_OPTIONS$1 = {
    shape: void 0,
    batchSize: "auto",
    batchDebounceMs: 0,
    limit: 0,
    _limitMB: 0
  };
  const ERR_MESSAGE = "TableBatchBuilder";
  class TableBatchBuilder {
    constructor(schema, options) {
      this.schema = void 0;
      this.options = void 0;
      this.aggregator = null;
      this.batchCount = 0;
      this.bytesUsed = 0;
      this.isChunkComplete = false;
      this.lastBatchEmittedMs = Date.now();
      this.totalLength = 0;
      this.totalBytes = 0;
      this.rowBytes = 0;
      this.schema = schema;
      this.options = {
        ...DEFAULT_OPTIONS$1,
        ...options
      };
    }
    limitReached() {
      var _this$options, _this$options2;
      if (Boolean((_this$options = this.options) === null || _this$options === void 0 ? void 0 : _this$options.limit) && this.totalLength >= this.options.limit) {
        return true;
      }
      if (Boolean((_this$options2 = this.options) === null || _this$options2 === void 0 ? void 0 : _this$options2._limitMB) && this.totalBytes / 1e6 >= this.options._limitMB) {
        return true;
      }
      return false;
    }
    addRow(row) {
      if (this.limitReached()) {
        return;
      }
      this.totalLength++;
      this.rowBytes = this.rowBytes || this._estimateRowMB(row);
      this.totalBytes += this.rowBytes;
      if (Array.isArray(row)) {
        this.addArrayRow(row);
      } else {
        this.addObjectRow(row);
      }
    }
    addArrayRow(row) {
      if (!this.aggregator) {
        const TableBatchType = this._getTableBatchType();
        this.aggregator = new TableBatchType(this.schema, this.options);
      }
      this.aggregator.addArrayRow(row);
    }
    addObjectRow(row) {
      if (!this.aggregator) {
        const TableBatchType = this._getTableBatchType();
        this.aggregator = new TableBatchType(this.schema, this.options);
      }
      this.aggregator.addObjectRow(row);
    }
    chunkComplete(chunk) {
      if (chunk instanceof ArrayBuffer) {
        this.bytesUsed += chunk.byteLength;
      }
      if (typeof chunk === "string") {
        this.bytesUsed += chunk.length;
      }
      this.isChunkComplete = true;
    }
    getFullBatch(options) {
      return this._isFull() ? this._getBatch(options) : null;
    }
    getFinalBatch(options) {
      return this._getBatch(options);
    }
    _estimateRowMB(row) {
      return Array.isArray(row) ? row.length * 8 : Object.keys(row).length * 8;
    }
    _isFull() {
      if (!this.aggregator || this.aggregator.rowCount() === 0) {
        return false;
      }
      if (this.options.batchSize === "auto") {
        if (!this.isChunkComplete) {
          return false;
        }
      } else if (this.options.batchSize > this.aggregator.rowCount()) {
        return false;
      }
      if (this.options.batchDebounceMs > Date.now() - this.lastBatchEmittedMs) {
        return false;
      }
      this.isChunkComplete = false;
      this.lastBatchEmittedMs = Date.now();
      return true;
    }
    _getBatch(options) {
      if (!this.aggregator) {
        return null;
      }
      if (options !== null && options !== void 0 && options.bytesUsed) {
        this.bytesUsed = options.bytesUsed;
      }
      const normalizedBatch = this.aggregator.getBatch();
      normalizedBatch.count = this.batchCount;
      normalizedBatch.bytesUsed = this.bytesUsed;
      Object.assign(normalizedBatch, options);
      this.batchCount++;
      this.aggregator = null;
      return normalizedBatch;
    }
    _getTableBatchType() {
      switch (this.options.shape) {
        case "array-row-table":
        case "object-row-table":
          return RowTableBatchAggregator;
        case "columnar-table":
          return ColumnarTableBatchAggregator;
        case "arrow-table":
          if (!TableBatchBuilder.ArrowBatch) {
            throw new Error(ERR_MESSAGE);
          }
          return TableBatchBuilder.ArrowBatch;
        default:
          return BaseTableBatchAggregator;
      }
    }
  }
  TableBatchBuilder.ArrowBatch = void 0;
  function makeTextDecoderIterator(arrayBufferIterator) {
    try {
      let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return async function* () {
        const textDecoder = new TextDecoder(void 0, options);
        for await (const arrayBuffer of arrayBufferIterator) {
          yield typeof arrayBuffer === "string" ? arrayBuffer : textDecoder.decode(arrayBuffer, {
            stream: true
          });
        }
      }();
    } catch (e) {
      return Promise.reject(e);
    }
  }
  const MAX_BUFFER_LENGTH = Number.MAX_SAFE_INTEGER;
  var STATE = function(STATE2) {
    STATE2[STATE2["BEGIN"] = 0] = "BEGIN";
    STATE2[STATE2["VALUE"] = 1] = "VALUE";
    STATE2[STATE2["OPEN_OBJECT"] = 2] = "OPEN_OBJECT";
    STATE2[STATE2["CLOSE_OBJECT"] = 3] = "CLOSE_OBJECT";
    STATE2[STATE2["OPEN_ARRAY"] = 4] = "OPEN_ARRAY";
    STATE2[STATE2["CLOSE_ARRAY"] = 5] = "CLOSE_ARRAY";
    STATE2[STATE2["TEXT_ESCAPE"] = 6] = "TEXT_ESCAPE";
    STATE2[STATE2["STRING"] = 7] = "STRING";
    STATE2[STATE2["BACKSLASH"] = 8] = "BACKSLASH";
    STATE2[STATE2["END"] = 9] = "END";
    STATE2[STATE2["OPEN_KEY"] = 10] = "OPEN_KEY";
    STATE2[STATE2["CLOSE_KEY"] = 11] = "CLOSE_KEY";
    STATE2[STATE2["TRUE"] = 12] = "TRUE";
    STATE2[STATE2["TRUE2"] = 13] = "TRUE2";
    STATE2[STATE2["TRUE3"] = 14] = "TRUE3";
    STATE2[STATE2["FALSE"] = 15] = "FALSE";
    STATE2[STATE2["FALSE2"] = 16] = "FALSE2";
    STATE2[STATE2["FALSE3"] = 17] = "FALSE3";
    STATE2[STATE2["FALSE4"] = 18] = "FALSE4";
    STATE2[STATE2["NULL"] = 19] = "NULL";
    STATE2[STATE2["NULL2"] = 20] = "NULL2";
    STATE2[STATE2["NULL3"] = 21] = "NULL3";
    STATE2[STATE2["NUMBER_DECIMAL_POINT"] = 22] = "NUMBER_DECIMAL_POINT";
    STATE2[STATE2["NUMBER_DIGIT"] = 23] = "NUMBER_DIGIT";
    return STATE2;
  }(STATE || {});
  const Char = {
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
  };
  const stringTokenPattern = /[\\"\n]/g;
  const DEFAULT_OPTIONS = {
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
  class ClarinetParser {
    constructor() {
      let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      this.options = DEFAULT_OPTIONS;
      this.bufferCheckPosition = MAX_BUFFER_LENGTH;
      this.q = "";
      this.c = "";
      this.p = "";
      this.closed = false;
      this.closedRoot = false;
      this.sawRoot = false;
      this.error = null;
      this.state = STATE.BEGIN;
      this.stack = [];
      this.position = 0;
      this.column = 0;
      this.line = 1;
      this.slashed = false;
      this.unicodeI = 0;
      this.unicodeS = null;
      this.depth = 0;
      this.textNode = void 0;
      this.numberNode = void 0;
      this.options = {
        ...DEFAULT_OPTIONS,
        ...options
      };
      this.textNode = void 0;
      this.numberNode = "";
      this.emit("onready");
    }
    end() {
      if (this.state !== STATE.VALUE || this.depth !== 0)
        this._error("Unexpected end");
      this._closeValue();
      this.c = "";
      this.closed = true;
      this.emit("onend");
      return this;
    }
    resume() {
      this.error = null;
      return this;
    }
    close() {
      return this.write(null);
    }
    emit(event, data) {
      var _this$options$event, _this$options;
      (_this$options$event = (_this$options = this.options)[event]) === null || _this$options$event === void 0 ? void 0 : _this$options$event.call(_this$options, data, this);
    }
    emitNode(event, data) {
      this._closeValue();
      this.emit(event, data);
    }
    write(chunk) {
      if (this.error) {
        throw this.error;
      }
      if (this.closed) {
        return this._error("Cannot write after close. Assign an onready handler.");
      }
      if (chunk === null) {
        return this.end();
      }
      let i2 = 0;
      let c = chunk.charCodeAt(0);
      let p = this.p;
      while (c) {
        p = c;
        this.c = c = chunk.charCodeAt(i2++);
        if (p !== c) {
          this.p = p;
        } else {
          p = this.p;
        }
        if (!c)
          break;
        this.position++;
        if (c === Char.lineFeed) {
          this.line++;
          this.column = 0;
        } else
          this.column++;
        switch (this.state) {
          case STATE.BEGIN:
            if (c === Char.openBrace)
              this.state = STATE.OPEN_OBJECT;
            else if (c === Char.openBracket)
              this.state = STATE.OPEN_ARRAY;
            else if (!isWhitespace(c)) {
              this._error("Non-whitespace before {[.");
            }
            continue;
          case STATE.OPEN_KEY:
          case STATE.OPEN_OBJECT:
            if (isWhitespace(c))
              continue;
            if (this.state === STATE.OPEN_KEY)
              this.stack.push(STATE.CLOSE_KEY);
            else if (c === Char.closeBrace) {
              this.emit("onopenobject");
              this.depth++;
              this.emit("oncloseobject");
              this.depth--;
              this.state = this.stack.pop() || STATE.VALUE;
              continue;
            } else
              this.stack.push(STATE.CLOSE_OBJECT);
            if (c === Char.doubleQuote)
              this.state = STATE.STRING;
            else
              this._error('Malformed object key should start with "');
            continue;
          case STATE.CLOSE_KEY:
          case STATE.CLOSE_OBJECT:
            if (isWhitespace(c))
              continue;
            if (c === Char.colon) {
              if (this.state === STATE.CLOSE_OBJECT) {
                this.stack.push(STATE.CLOSE_OBJECT);
                this._closeValue("onopenobject");
                this.depth++;
              } else
                this._closeValue("onkey");
              this.state = STATE.VALUE;
            } else if (c === Char.closeBrace) {
              this.emitNode("oncloseobject");
              this.depth--;
              this.state = this.stack.pop() || STATE.VALUE;
            } else if (c === Char.comma) {
              if (this.state === STATE.CLOSE_OBJECT)
                this.stack.push(STATE.CLOSE_OBJECT);
              this._closeValue();
              this.state = STATE.OPEN_KEY;
            } else
              this._error("Bad object");
            continue;
          case STATE.OPEN_ARRAY:
          case STATE.VALUE:
            if (isWhitespace(c))
              continue;
            if (this.state === STATE.OPEN_ARRAY) {
              this.emit("onopenarray");
              this.depth++;
              this.state = STATE.VALUE;
              if (c === Char.closeBracket) {
                this.emit("onclosearray");
                this.depth--;
                this.state = this.stack.pop() || STATE.VALUE;
                continue;
              } else {
                this.stack.push(STATE.CLOSE_ARRAY);
              }
            }
            if (c === Char.doubleQuote)
              this.state = STATE.STRING;
            else if (c === Char.openBrace)
              this.state = STATE.OPEN_OBJECT;
            else if (c === Char.openBracket)
              this.state = STATE.OPEN_ARRAY;
            else if (c === Char.t)
              this.state = STATE.TRUE;
            else if (c === Char.f)
              this.state = STATE.FALSE;
            else if (c === Char.n)
              this.state = STATE.NULL;
            else if (c === Char.minus) {
              this.numberNode += "-";
            } else if (Char._0 <= c && c <= Char._9) {
              this.numberNode += String.fromCharCode(c);
              this.state = STATE.NUMBER_DIGIT;
            } else
              this._error("Bad value");
            continue;
          case STATE.CLOSE_ARRAY:
            if (c === Char.comma) {
              this.stack.push(STATE.CLOSE_ARRAY);
              this._closeValue("onvalue");
              this.state = STATE.VALUE;
            } else if (c === Char.closeBracket) {
              this.emitNode("onclosearray");
              this.depth--;
              this.state = this.stack.pop() || STATE.VALUE;
            } else if (isWhitespace(c))
              continue;
            else
              this._error("Bad array");
            continue;
          case STATE.STRING:
            if (this.textNode === void 0) {
              this.textNode = "";
            }
            let starti = i2 - 1;
            let slashed = this.slashed;
            let unicodeI = this.unicodeI;
            STRING_BIGLOOP:
              while (true) {
                while (unicodeI > 0) {
                  this.unicodeS += String.fromCharCode(c);
                  c = chunk.charCodeAt(i2++);
                  this.position++;
                  if (unicodeI === 4) {
                    this.textNode += String.fromCharCode(parseInt(this.unicodeS, 16));
                    unicodeI = 0;
                    starti = i2 - 1;
                  } else {
                    unicodeI++;
                  }
                  if (!c)
                    break STRING_BIGLOOP;
                }
                if (c === Char.doubleQuote && !slashed) {
                  this.state = this.stack.pop() || STATE.VALUE;
                  this.textNode += chunk.substring(starti, i2 - 1);
                  this.position += i2 - 1 - starti;
                  break;
                }
                if (c === Char.backslash && !slashed) {
                  slashed = true;
                  this.textNode += chunk.substring(starti, i2 - 1);
                  this.position += i2 - 1 - starti;
                  c = chunk.charCodeAt(i2++);
                  this.position++;
                  if (!c)
                    break;
                }
                if (slashed) {
                  slashed = false;
                  if (c === Char.n) {
                    this.textNode += "\n";
                  } else if (c === Char.r) {
                    this.textNode += "\r";
                  } else if (c === Char.t) {
                    this.textNode += "	";
                  } else if (c === Char.f) {
                    this.textNode += "\f";
                  } else if (c === Char.b) {
                    this.textNode += "\b";
                  } else if (c === Char.u) {
                    unicodeI = 1;
                    this.unicodeS = "";
                  } else {
                    this.textNode += String.fromCharCode(c);
                  }
                  c = chunk.charCodeAt(i2++);
                  this.position++;
                  starti = i2 - 1;
                  if (!c)
                    break;
                  else
                    continue;
                }
                stringTokenPattern.lastIndex = i2;
                const reResult = stringTokenPattern.exec(chunk);
                if (reResult === null) {
                  i2 = chunk.length + 1;
                  this.textNode += chunk.substring(starti, i2 - 1);
                  this.position += i2 - 1 - starti;
                  break;
                }
                i2 = reResult.index + 1;
                c = chunk.charCodeAt(reResult.index);
                if (!c) {
                  this.textNode += chunk.substring(starti, i2 - 1);
                  this.position += i2 - 1 - starti;
                  break;
                }
              }
            this.slashed = slashed;
            this.unicodeI = unicodeI;
            continue;
          case STATE.TRUE:
            if (c === Char.r)
              this.state = STATE.TRUE2;
            else
              this._error(`Invalid true started with t${c}`);
            continue;
          case STATE.TRUE2:
            if (c === Char.u)
              this.state = STATE.TRUE3;
            else
              this._error(`Invalid true started with tr${c}`);
            continue;
          case STATE.TRUE3:
            if (c === Char.e) {
              this.emit("onvalue", true);
              this.state = this.stack.pop() || STATE.VALUE;
            } else
              this._error(`Invalid true started with tru${c}`);
            continue;
          case STATE.FALSE:
            if (c === Char.a)
              this.state = STATE.FALSE2;
            else
              this._error(`Invalid false started with f${c}`);
            continue;
          case STATE.FALSE2:
            if (c === Char.l)
              this.state = STATE.FALSE3;
            else
              this._error(`Invalid false started with fa${c}`);
            continue;
          case STATE.FALSE3:
            if (c === Char.s)
              this.state = STATE.FALSE4;
            else
              this._error(`Invalid false started with fal${c}`);
            continue;
          case STATE.FALSE4:
            if (c === Char.e) {
              this.emit("onvalue", false);
              this.state = this.stack.pop() || STATE.VALUE;
            } else
              this._error(`Invalid false started with fals${c}`);
            continue;
          case STATE.NULL:
            if (c === Char.u)
              this.state = STATE.NULL2;
            else
              this._error(`Invalid null started with n${c}`);
            continue;
          case STATE.NULL2:
            if (c === Char.l)
              this.state = STATE.NULL3;
            else
              this._error(`Invalid null started with nu${c}`);
            continue;
          case STATE.NULL3:
            if (c === Char.l) {
              this.emit("onvalue", null);
              this.state = this.stack.pop() || STATE.VALUE;
            } else
              this._error(`Invalid null started with nul${c}`);
            continue;
          case STATE.NUMBER_DECIMAL_POINT:
            if (c === Char.period) {
              this.numberNode += ".";
              this.state = STATE.NUMBER_DIGIT;
            } else
              this._error("Leading zero not followed by .");
            continue;
          case STATE.NUMBER_DIGIT:
            if (Char._0 <= c && c <= Char._9)
              this.numberNode += String.fromCharCode(c);
            else if (c === Char.period) {
              if (this.numberNode.indexOf(".") !== -1)
                this._error("Invalid number has two dots");
              this.numberNode += ".";
            } else if (c === Char.e || c === Char.E) {
              if (this.numberNode.indexOf("e") !== -1 || this.numberNode.indexOf("E") !== -1)
                this._error("Invalid number has two exponential");
              this.numberNode += "e";
            } else if (c === Char.plus || c === Char.minus) {
              if (!(p === Char.e || p === Char.E))
                this._error("Invalid symbol in number");
              this.numberNode += String.fromCharCode(c);
            } else {
              this._closeNumber();
              i2--;
              this.state = this.stack.pop() || STATE.VALUE;
            }
            continue;
          default:
            this._error(`Unknown state: ${this.state}`);
        }
      }
      if (this.position >= this.bufferCheckPosition) {
        checkBufferLength(this);
      }
      this.emit("onchunkparsed");
      return this;
    }
    _closeValue() {
      let event = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "onvalue";
      if (this.textNode !== void 0) {
        this.emit(event, this.textNode);
      }
      this.textNode = void 0;
    }
    _closeNumber() {
      if (this.numberNode)
        this.emit("onvalue", parseFloat(this.numberNode));
      this.numberNode = "";
    }
    _error() {
      let message = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      this._closeValue();
      message += `
Line: ${this.line}
Column: ${this.column}
Char: ${this.c}`;
      const error = new Error(message);
      this.error = error;
      this.emit("onerror", error);
    }
  }
  function isWhitespace(c) {
    return c === Char.carriageReturn || c === Char.lineFeed || c === Char.space || c === Char.tab;
  }
  function checkBufferLength(parser) {
    const maxAllowed = Math.max(MAX_BUFFER_LENGTH, 10);
    let maxActual = 0;
    for (const buffer of ["textNode", "numberNode"]) {
      const len2 = parser[buffer] === void 0 ? 0 : parser[buffer].length;
      if (len2 > maxAllowed) {
        switch (buffer) {
          case "text":
            break;
          default:
            parser._error(`Max buffer length exceeded: ${buffer}`);
        }
      }
      maxActual = Math.max(maxActual, len2);
    }
    parser.bufferCheckPosition = MAX_BUFFER_LENGTH - maxActual + parser.position;
  }
  class JSONPath {
    constructor() {
      let path = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
      this.path = void 0;
      this.path = ["$"];
      if (path instanceof JSONPath) {
        this.path = [...path.path];
        return;
      }
      if (Array.isArray(path)) {
        this.path.push(...path);
        return;
      }
      if (typeof path === "string") {
        this.path = path.split(".");
        if (this.path[0] !== "$") {
          throw new Error("JSONPaths must start with $");
        }
      }
    }
    clone() {
      return new JSONPath(this);
    }
    toString() {
      return this.path.join(".");
    }
    push(name2) {
      this.path.push(name2);
    }
    pop() {
      return this.path.pop();
    }
    set(name2) {
      this.path[this.path.length - 1] = name2;
    }
    equals(other) {
      if (!this || !other || this.path.length !== other.path.length) {
        return false;
      }
      for (let i2 = 0; i2 < this.path.length; ++i2) {
        if (this.path[i2] !== other.path[i2]) {
          return false;
        }
      }
      return true;
    }
    setFieldAtPath(object, value) {
      const path = [...this.path];
      path.shift();
      const field = path.pop();
      for (const component of path) {
        object = object[component];
      }
      object[field] = value;
    }
    getFieldAtPath(object) {
      const path = [...this.path];
      path.shift();
      const field = path.pop();
      for (const component of path) {
        object = object[component];
      }
      return object[field];
    }
  }
  class JSONParser {
    constructor(options) {
      this.parser = void 0;
      this.result = void 0;
      this.previousStates = [];
      this.currentState = Object.freeze({
        container: [],
        key: null
      });
      this.jsonpath = new JSONPath();
      this.reset();
      this.parser = new ClarinetParser({
        onready: () => {
          this.jsonpath = new JSONPath();
          this.previousStates.length = 0;
          this.currentState.container.length = 0;
        },
        onopenobject: (name2) => {
          this._openObject({});
          if (typeof name2 !== "undefined") {
            this.parser.emit("onkey", name2);
          }
        },
        onkey: (name2) => {
          this.jsonpath.set(name2);
          this.currentState.key = name2;
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
        onvalue: (value) => {
          this._pushOrSet(value);
        },
        onerror: (error) => {
          throw error;
        },
        onend: () => {
          this.result = this.currentState.container.pop();
        },
        ...options
      });
    }
    reset() {
      this.result = void 0;
      this.previousStates = [];
      this.currentState = Object.freeze({
        container: [],
        key: null
      });
      this.jsonpath = new JSONPath();
    }
    write(chunk) {
      this.parser.write(chunk);
    }
    close() {
      this.parser.close();
    }
    _pushOrSet(value) {
      const {
        container,
        key
      } = this.currentState;
      if (key !== null) {
        container[key] = value;
        this.currentState.key = null;
      } else {
        container.push(value);
      }
    }
    _openArray() {
      let newContainer = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
      this.jsonpath.push(null);
      this._pushOrSet(newContainer);
      this.previousStates.push(this.currentState);
      this.currentState = {
        container: newContainer,
        isArray: true,
        key: null
      };
    }
    _closeArray() {
      this.jsonpath.pop();
      this.currentState = this.previousStates.pop();
    }
    _openObject() {
      let newContainer = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      this.jsonpath.push(null);
      this._pushOrSet(newContainer);
      this.previousStates.push(this.currentState);
      this.currentState = {
        container: newContainer,
        isArray: false,
        key: null
      };
    }
    _closeObject() {
      this.jsonpath.pop();
      this.currentState = this.previousStates.pop();
    }
  }
  class StreamingJSONParser extends JSONParser {
    constructor() {
      let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      super({
        onopenarray: () => {
          if (!this.streamingArray) {
            if (this._matchJSONPath()) {
              this.streamingJsonPath = this.getJsonPath().clone();
              this.streamingArray = [];
              this._openArray(this.streamingArray);
              return;
            }
          }
          this._openArray();
        },
        onopenobject: (name2) => {
          if (!this.topLevelObject) {
            this.topLevelObject = {};
            this._openObject(this.topLevelObject);
          } else {
            this._openObject({});
          }
          if (typeof name2 !== "undefined") {
            this.parser.emit("onkey", name2);
          }
        }
      });
      this.jsonPaths = void 0;
      this.streamingJsonPath = null;
      this.streamingArray = null;
      this.topLevelObject = null;
      const jsonpaths = options.jsonpaths || [];
      this.jsonPaths = jsonpaths.map((jsonpath) => new JSONPath(jsonpath));
    }
    write(chunk) {
      super.write(chunk);
      let array = [];
      if (this.streamingArray) {
        array = [...this.streamingArray];
        this.streamingArray.length = 0;
      }
      return array;
    }
    getPartialResult() {
      return this.topLevelObject;
    }
    getStreamingJsonPath() {
      return this.streamingJsonPath;
    }
    getStreamingJsonPathAsString() {
      return this.streamingJsonPath && this.streamingJsonPath.toString();
    }
    getJsonPath() {
      return this.jsonpath;
    }
    _matchJSONPath() {
      const currentPath = this.getJsonPath();
      if (this.jsonPaths.length === 0) {
        return true;
      }
      for (const jsonPath of this.jsonPaths) {
        if (jsonPath.equals(currentPath)) {
          return true;
        }
      }
      return false;
    }
  }
  async function* parseJSONInBatches(binaryAsyncIterator, options) {
    const asyncIterator = makeTextDecoderIterator(binaryAsyncIterator);
    const {
      metadata
    } = options;
    const {
      jsonpaths
    } = options.json || {};
    let isFirstChunk = true;
    const schema = null;
    const tableBatchBuilder = new TableBatchBuilder(schema, options);
    const parser = new StreamingJSONParser({
      jsonpaths
    });
    for await (const chunk of asyncIterator) {
      const rows = parser.write(chunk);
      const jsonpath2 = rows.length > 0 && parser.getStreamingJsonPathAsString();
      if (rows.length > 0 && isFirstChunk) {
        if (metadata) {
          var _options$json;
          const initialBatch = {
            shape: (options === null || options === void 0 ? void 0 : (_options$json = options.json) === null || _options$json === void 0 ? void 0 : _options$json.shape) || "array-row-table",
            batchType: "partial-result",
            data: [],
            length: 0,
            bytesUsed: 0,
            container: parser.getPartialResult(),
            jsonpath: jsonpath2
          };
          yield initialBatch;
        }
        isFirstChunk = false;
      }
      for (const row of rows) {
        tableBatchBuilder.addRow(row);
        const batch3 = tableBatchBuilder.getFullBatch({
          jsonpath: jsonpath2
        });
        if (batch3) {
          yield batch3;
        }
      }
      tableBatchBuilder.chunkComplete(chunk);
      const batch2 = tableBatchBuilder.getFullBatch({
        jsonpath: jsonpath2
      });
      if (batch2) {
        yield batch2;
      }
    }
    const jsonpath = parser.getStreamingJsonPathAsString();
    const batch = tableBatchBuilder.getFinalBatch({
      jsonpath
    });
    if (batch) {
      yield batch;
    }
    if (metadata) {
      const finalBatch = {
        shape: "json",
        batchType: "final-result",
        container: parser.getPartialResult(),
        jsonpath: parser.getStreamingJsonPathAsString(),
        data: [],
        length: 0
      };
      yield finalBatch;
    }
  }
  const DimIndex = {
    x: 0,
    y: 1,
    z: 2
  };
  function getPolygonSignedArea(points, options = {}) {
    const { start = 0, end = points.length, plane = "xy" } = options;
    const dim = options.size || 2;
    let area2 = 0;
    const i0 = DimIndex[plane[0]];
    const i1 = DimIndex[plane[1]];
    for (let i2 = start, j = end - dim; i2 < end; i2 += dim) {
      area2 += (points[i2 + i0] - points[j + i0]) * (points[i2 + i1] + points[j + i1]);
      j = i2;
    }
    return area2 / 2;
  }
  function earcut(positions, holeIndices, dim = 2, areas, plane = "xy") {
    const hasHoles = holeIndices && holeIndices.length;
    const outerLen = hasHoles ? holeIndices[0] * dim : positions.length;
    let outerNode = linkedList(positions, 0, outerLen, dim, true, areas && areas[0], plane);
    const triangles = [];
    if (!outerNode || outerNode.next === outerNode.prev)
      return triangles;
    let invSize;
    let maxX;
    let maxY;
    let minX;
    let minY;
    let x;
    let y;
    if (hasHoles)
      outerNode = eliminateHoles(positions, holeIndices, outerNode, dim, areas, plane);
    if (positions.length > 80 * dim) {
      minX = maxX = positions[0];
      minY = maxY = positions[1];
      for (let i2 = dim; i2 < outerLen; i2 += dim) {
        x = positions[i2];
        y = positions[i2 + 1];
        if (x < minX)
          minX = x;
        if (y < minY)
          minY = y;
        if (x > maxX)
          maxX = x;
        if (y > maxY)
          maxY = y;
      }
      invSize = Math.max(maxX - minX, maxY - minY);
      invSize = invSize !== 0 ? 32767 / invSize : 0;
    }
    earcutLinked(outerNode, triangles, dim, minX, minY, invSize, 0);
    return triangles;
  }
  function linkedList(data, start, end, dim, clockwise, area2, plane) {
    let i2;
    let last;
    if (area2 === void 0) {
      area2 = getPolygonSignedArea(data, { start, end, size: dim, plane });
    }
    let i0 = DimIndex[plane[0]];
    let i1 = DimIndex[plane[1]];
    if (clockwise === area2 < 0) {
      for (i2 = start; i2 < end; i2 += dim)
        last = insertNode(i2, data[i2 + i0], data[i2 + i1], last);
    } else {
      for (i2 = end - dim; i2 >= start; i2 -= dim)
        last = insertNode(i2, data[i2 + i0], data[i2 + i1], last);
    }
    if (last && equals(last, last.next)) {
      removeNode(last);
      last = last.next;
    }
    return last;
  }
  function filterPoints(start, end) {
    if (!start)
      return start;
    if (!end)
      end = start;
    let p = start;
    let again;
    do {
      again = false;
      if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
        removeNode(p);
        p = end = p.prev;
        if (p === p.next)
          break;
        again = true;
      } else {
        p = p.next;
      }
    } while (again || p !== end);
    return end;
  }
  function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
    if (!ear)
      return;
    if (!pass && invSize)
      indexCurve(ear, minX, minY, invSize);
    let stop = ear;
    let prev;
    let next;
    while (ear.prev !== ear.next) {
      prev = ear.prev;
      next = ear.next;
      if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
        triangles.push(prev.i / dim | 0);
        triangles.push(ear.i / dim | 0);
        triangles.push(next.i / dim | 0);
        removeNode(ear);
        ear = next.next;
        stop = next.next;
        continue;
      }
      ear = next;
      if (ear === stop) {
        if (!pass) {
          earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);
        } else if (pass === 1) {
          ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
          earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);
        } else if (pass === 2) {
          splitEarcut(ear, triangles, dim, minX, minY, invSize);
        }
        break;
      }
    }
  }
  function isEar(ear) {
    const a2 = ear.prev;
    const b = ear;
    const c = ear.next;
    if (area(a2, b, c) >= 0)
      return false;
    const ax = a2.x;
    const bx = b.x;
    const cx = c.x;
    const ay = a2.y;
    const by = b.y;
    const cy = c.y;
    const x0 = ax < bx ? ax < cx ? ax : cx : bx < cx ? bx : cx;
    const y0 = ay < by ? ay < cy ? ay : cy : by < cy ? by : cy;
    const x1 = ax > bx ? ax > cx ? ax : cx : bx > cx ? bx : cx;
    const y1 = ay > by ? ay > cy ? ay : cy : by > cy ? by : cy;
    let p = c.next;
    while (p !== a2) {
      if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0)
        return false;
      p = p.next;
    }
    return true;
  }
  function isEarHashed(ear, minX, minY, invSize) {
    const a2 = ear.prev;
    const b = ear;
    const c = ear.next;
    if (area(a2, b, c) >= 0)
      return false;
    const ax = a2.x;
    const bx = b.x;
    const cx = c.x;
    const ay = a2.y;
    const by = b.y;
    const cy = c.y;
    const x0 = ax < bx ? ax < cx ? ax : cx : bx < cx ? bx : cx;
    const y0 = ay < by ? ay < cy ? ay : cy : by < cy ? by : cy;
    const x1 = ax > bx ? ax > cx ? ax : cx : bx > cx ? bx : cx;
    const y1 = ay > by ? ay > cy ? ay : cy : by > cy ? by : cy;
    const minZ = zOrder(x0, y0, minX, minY, invSize);
    const maxZ = zOrder(x1, y1, minX, minY, invSize);
    let p = ear.prevZ;
    let n2 = ear.nextZ;
    while (p && p.z >= minZ && n2 && n2.z <= maxZ) {
      if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a2 && p !== c && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0)
        return false;
      p = p.prevZ;
      if (n2.x >= x0 && n2.x <= x1 && n2.y >= y0 && n2.y <= y1 && n2 !== a2 && n2 !== c && pointInTriangle(ax, ay, bx, by, cx, cy, n2.x, n2.y) && area(n2.prev, n2, n2.next) >= 0)
        return false;
      n2 = n2.nextZ;
    }
    while (p && p.z >= minZ) {
      if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a2 && p !== c && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0)
        return false;
      p = p.prevZ;
    }
    while (n2 && n2.z <= maxZ) {
      if (n2.x >= x0 && n2.x <= x1 && n2.y >= y0 && n2.y <= y1 && n2 !== a2 && n2 !== c && pointInTriangle(ax, ay, bx, by, cx, cy, n2.x, n2.y) && area(n2.prev, n2, n2.next) >= 0)
        return false;
      n2 = n2.nextZ;
    }
    return true;
  }
  function cureLocalIntersections(start, triangles, dim) {
    let p = start;
    do {
      const a2 = p.prev;
      const b = p.next.next;
      if (!equals(a2, b) && intersects(a2, p, p.next, b) && locallyInside(a2, b) && locallyInside(b, a2)) {
        triangles.push(a2.i / dim | 0);
        triangles.push(p.i / dim | 0);
        triangles.push(b.i / dim | 0);
        removeNode(p);
        removeNode(p.next);
        p = start = b;
      }
      p = p.next;
    } while (p !== start);
    return filterPoints(p);
  }
  function splitEarcut(start, triangles, dim, minX, minY, invSize) {
    let a2 = start;
    do {
      let b = a2.next.next;
      while (b !== a2.prev) {
        if (a2.i !== b.i && isValidDiagonal(a2, b)) {
          let c = splitPolygon(a2, b);
          a2 = filterPoints(a2, a2.next);
          c = filterPoints(c, c.next);
          earcutLinked(a2, triangles, dim, minX, minY, invSize, 0);
          earcutLinked(c, triangles, dim, minX, minY, invSize, 0);
          return;
        }
        b = b.next;
      }
      a2 = a2.next;
    } while (a2 !== start);
  }
  function eliminateHoles(data, holeIndices, outerNode, dim, areas, plane) {
    const queue = [];
    let i2;
    let len2;
    let start;
    let end;
    let list;
    for (i2 = 0, len2 = holeIndices.length; i2 < len2; i2++) {
      start = holeIndices[i2] * dim;
      end = i2 < len2 - 1 ? holeIndices[i2 + 1] * dim : data.length;
      list = linkedList(data, start, end, dim, false, areas && areas[i2 + 1], plane);
      if (list === list.next)
        list.steiner = true;
      queue.push(getLeftmost(list));
    }
    queue.sort(compareX);
    for (i2 = 0; i2 < queue.length; i2++) {
      outerNode = eliminateHole(queue[i2], outerNode);
    }
    return outerNode;
  }
  function compareX(a2, b) {
    return a2.x - b.x;
  }
  function eliminateHole(hole, outerNode) {
    const bridge = findHoleBridge(hole, outerNode);
    if (!bridge) {
      return outerNode;
    }
    const bridgeReverse = splitPolygon(bridge, hole);
    filterPoints(bridgeReverse, bridgeReverse.next);
    return filterPoints(bridge, bridge.next);
  }
  function findHoleBridge(hole, outerNode) {
    let p = outerNode;
    const hx = hole.x;
    const hy = hole.y;
    let qx = -Infinity;
    let m;
    do {
      if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
        const x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
        if (x <= hx && x > qx) {
          qx = x;
          m = p.x < p.next.x ? p : p.next;
          if (x === hx)
            return m;
        }
      }
      p = p.next;
    } while (p !== outerNode);
    if (!m)
      return null;
    const stop = m;
    const mx = m.x;
    const my = m.y;
    let tanMin = Infinity;
    let tan;
    p = m;
    do {
      if (hx >= p.x && p.x >= mx && hx !== p.x && pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {
        tan = Math.abs(hy - p.y) / (hx - p.x);
        if (locallyInside(p, hole) && (tan < tanMin || tan === tanMin && (p.x > m.x || p.x === m.x && sectorContainsSector(m, p)))) {
          m = p;
          tanMin = tan;
        }
      }
      p = p.next;
    } while (p !== stop);
    return m;
  }
  function sectorContainsSector(m, p) {
    return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
  }
  function indexCurve(start, minX, minY, invSize) {
    let p = start;
    do {
      if (p.z === 0)
        p.z = zOrder(p.x, p.y, minX, minY, invSize);
      p.prevZ = p.prev;
      p.nextZ = p.next;
      p = p.next;
    } while (p !== start);
    p.prevZ.nextZ = null;
    p.prevZ = null;
    sortLinked(p);
  }
  function sortLinked(list) {
    let e;
    let i2;
    let inSize = 1;
    let numMerges;
    let p;
    let pSize;
    let q;
    let qSize;
    let tail;
    do {
      p = list;
      list = null;
      tail = null;
      numMerges = 0;
      while (p) {
        numMerges++;
        q = p;
        pSize = 0;
        for (i2 = 0; i2 < inSize; i2++) {
          pSize++;
          q = q.nextZ;
          if (!q)
            break;
        }
        qSize = inSize;
        while (pSize > 0 || qSize > 0 && q) {
          if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
            e = p;
            p = p.nextZ;
            pSize--;
          } else {
            e = q;
            q = q.nextZ;
            qSize--;
          }
          if (tail)
            tail.nextZ = e;
          else
            list = e;
          e.prevZ = tail;
          tail = e;
        }
        p = q;
      }
      tail.nextZ = null;
      inSize *= 2;
    } while (numMerges > 1);
    return list;
  }
  function zOrder(x, y, minX, minY, invSize) {
    x = (x - minX) * invSize | 0;
    y = (y - minY) * invSize | 0;
    x = (x | x << 8) & 16711935;
    x = (x | x << 4) & 252645135;
    x = (x | x << 2) & 858993459;
    x = (x | x << 1) & 1431655765;
    y = (y | y << 8) & 16711935;
    y = (y | y << 4) & 252645135;
    y = (y | y << 2) & 858993459;
    y = (y | y << 1) & 1431655765;
    return x | y << 1;
  }
  function getLeftmost(start) {
    let p = start;
    let leftmost = start;
    do {
      if (p.x < leftmost.x || p.x === leftmost.x && p.y < leftmost.y)
        leftmost = p;
      p = p.next;
    } while (p !== start);
    return leftmost;
  }
  function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
    return (cx - px) * (ay - py) >= (ax - px) * (cy - py) && (ax - px) * (by - py) >= (bx - px) * (ay - py) && (bx - px) * (cy - py) >= (cx - px) * (by - py);
  }
  function isValidDiagonal(a2, b) {
    return a2.next.i !== b.i && a2.prev.i !== b.i && !intersectsPolygon(a2, b) && // dones't intersect other edges
    (locallyInside(a2, b) && locallyInside(b, a2) && middleInside(a2, b) && // locally visible
    (area(a2.prev, a2, b.prev) || area(a2, b.prev, b)) || // does not create opposite-facing sectors
    equals(a2, b) && area(a2.prev, a2, a2.next) > 0 && area(b.prev, b, b.next) > 0);
  }
  function area(p, q, r2) {
    return (q.y - p.y) * (r2.x - q.x) - (q.x - p.x) * (r2.y - q.y);
  }
  function equals(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
  }
  function intersects(p1, q1, p2, q2) {
    const o1 = sign(area(p1, q1, p2));
    const o2 = sign(area(p1, q1, q2));
    const o3 = sign(area(p2, q2, p1));
    const o4 = sign(area(p2, q2, q1));
    if (o1 !== o2 && o3 !== o4)
      return true;
    if (o1 === 0 && onSegment(p1, p2, q1))
      return true;
    if (o2 === 0 && onSegment(p1, q2, q1))
      return true;
    if (o3 === 0 && onSegment(p2, p1, q2))
      return true;
    if (o4 === 0 && onSegment(p2, q1, q2))
      return true;
    return false;
  }
  function onSegment(p, q, r2) {
    return q.x <= Math.max(p.x, r2.x) && q.x >= Math.min(p.x, r2.x) && q.y <= Math.max(p.y, r2.y) && q.y >= Math.min(p.y, r2.y);
  }
  function sign(num) {
    return num > 0 ? 1 : num < 0 ? -1 : 0;
  }
  function intersectsPolygon(a2, b) {
    let p = a2;
    do {
      if (p.i !== a2.i && p.next.i !== a2.i && p.i !== b.i && p.next.i !== b.i && intersects(p, p.next, a2, b))
        return true;
      p = p.next;
    } while (p !== a2);
    return false;
  }
  function locallyInside(a2, b) {
    return area(a2.prev, a2, a2.next) < 0 ? area(a2, b, a2.next) >= 0 && area(a2, a2.prev, b) >= 0 : area(a2, b, a2.prev) < 0 || area(a2, a2.next, b) < 0;
  }
  function middleInside(a2, b) {
    let p = a2;
    let inside = false;
    const px = (a2.x + b.x) / 2;
    const py = (a2.y + b.y) / 2;
    do {
      if (p.y > py !== p.next.y > py && p.next.y !== p.y && px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x)
        inside = !inside;
      p = p.next;
    } while (p !== a2);
    return inside;
  }
  function splitPolygon(a2, b) {
    const a22 = new Vertex(a2.i, a2.x, a2.y);
    const b2 = new Vertex(b.i, b.x, b.y);
    const an = a2.next;
    const bp = b.prev;
    a2.next = b;
    b.prev = a2;
    a22.next = an;
    an.prev = a22;
    b2.next = a22;
    a22.prev = b2;
    bp.next = b2;
    b2.prev = bp;
    return b2;
  }
  function insertNode(i2, x, y, last) {
    const p = new Vertex(i2, x, y);
    if (!last) {
      p.prev = p;
      p.next = p;
    } else {
      p.next = last.next;
      p.prev = last;
      last.next.prev = p;
      last.next = p;
    }
    return p;
  }
  function removeNode(p) {
    p.next.prev = p.prev;
    p.prev.next = p.next;
    if (p.prevZ)
      p.prevZ.nextZ = p.nextZ;
    if (p.nextZ)
      p.nextZ.prevZ = p.prevZ;
  }
  class Vertex {
    constructor(i2, x, y) {
      this.prev = null;
      this.next = null;
      this.z = 0;
      this.prevZ = null;
      this.nextZ = null;
      this.steiner = false;
      this.i = i2;
      this.x = x;
      this.y = y;
    }
  }
  function flatGeojsonToBinary(features, geometryInfo, options) {
    const propArrayTypes = extractNumericPropTypes(features);
    const numericPropKeys = Object.keys(propArrayTypes).filter((k) => propArrayTypes[k] !== Array);
    return fillArrays(features, {
      propArrayTypes,
      ...geometryInfo
    }, {
      numericPropKeys: options && options.numericPropKeys || numericPropKeys,
      PositionDataType: options ? options.PositionDataType : Float32Array,
      triangulate: options ? options.triangulate : true
    });
  }
  function extractNumericPropTypes(features) {
    const propArrayTypes = {};
    for (const feature of features) {
      if (feature.properties) {
        for (const key in feature.properties) {
          const val = feature.properties[key];
          propArrayTypes[key] = deduceArrayType(val, propArrayTypes[key]);
        }
      }
    }
    return propArrayTypes;
  }
  function fillArrays(features, geometryInfo, options) {
    const {
      pointPositionsCount,
      pointFeaturesCount,
      linePositionsCount,
      linePathsCount,
      lineFeaturesCount,
      polygonPositionsCount,
      polygonObjectsCount,
      polygonRingsCount,
      polygonFeaturesCount,
      propArrayTypes,
      coordLength
    } = geometryInfo;
    const {
      numericPropKeys = [],
      PositionDataType = Float32Array,
      triangulate = true
    } = options;
    const hasGlobalId = features[0] && "id" in features[0];
    const GlobalFeatureIdsDataType = features.length > 65535 ? Uint32Array : Uint16Array;
    const points = {
      type: "Point",
      positions: new PositionDataType(pointPositionsCount * coordLength),
      globalFeatureIds: new GlobalFeatureIdsDataType(pointPositionsCount),
      featureIds: pointFeaturesCount > 65535 ? new Uint32Array(pointPositionsCount) : new Uint16Array(pointPositionsCount),
      numericProps: {},
      properties: [],
      fields: []
    };
    const lines = {
      type: "LineString",
      pathIndices: linePositionsCount > 65535 ? new Uint32Array(linePathsCount + 1) : new Uint16Array(linePathsCount + 1),
      positions: new PositionDataType(linePositionsCount * coordLength),
      globalFeatureIds: new GlobalFeatureIdsDataType(linePositionsCount),
      featureIds: lineFeaturesCount > 65535 ? new Uint32Array(linePositionsCount) : new Uint16Array(linePositionsCount),
      numericProps: {},
      properties: [],
      fields: []
    };
    const polygons = {
      type: "Polygon",
      polygonIndices: polygonPositionsCount > 65535 ? new Uint32Array(polygonObjectsCount + 1) : new Uint16Array(polygonObjectsCount + 1),
      primitivePolygonIndices: polygonPositionsCount > 65535 ? new Uint32Array(polygonRingsCount + 1) : new Uint16Array(polygonRingsCount + 1),
      positions: new PositionDataType(polygonPositionsCount * coordLength),
      globalFeatureIds: new GlobalFeatureIdsDataType(polygonPositionsCount),
      featureIds: polygonFeaturesCount > 65535 ? new Uint32Array(polygonPositionsCount) : new Uint16Array(polygonPositionsCount),
      numericProps: {},
      properties: [],
      fields: []
    };
    if (triangulate) {
      polygons.triangles = [];
    }
    for (const object of [points, lines, polygons]) {
      for (const propName of numericPropKeys) {
        const T = propArrayTypes[propName];
        object.numericProps[propName] = new T(object.positions.length / coordLength);
      }
    }
    lines.pathIndices[linePathsCount] = linePositionsCount;
    polygons.polygonIndices[polygonObjectsCount] = polygonPositionsCount;
    polygons.primitivePolygonIndices[polygonRingsCount] = polygonPositionsCount;
    const indexMap = {
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
    for (const feature of features) {
      const geometry = feature.geometry;
      const properties = feature.properties || {};
      switch (geometry.type) {
        case "Point":
          handlePoint(geometry, points, indexMap, coordLength, properties);
          points.properties.push(keepStringProperties(properties, numericPropKeys));
          if (hasGlobalId) {
            points.fields.push({
              id: feature.id
            });
          }
          indexMap.pointFeature++;
          break;
        case "LineString":
          handleLineString(geometry, lines, indexMap, coordLength, properties);
          lines.properties.push(keepStringProperties(properties, numericPropKeys));
          if (hasGlobalId) {
            lines.fields.push({
              id: feature.id
            });
          }
          indexMap.lineFeature++;
          break;
        case "Polygon":
          handlePolygon(geometry, polygons, indexMap, coordLength, properties);
          polygons.properties.push(keepStringProperties(properties, numericPropKeys));
          if (hasGlobalId) {
            polygons.fields.push({
              id: feature.id
            });
          }
          indexMap.polygonFeature++;
          break;
        default:
          throw new Error("Invalid geometry type");
      }
      indexMap.feature++;
    }
    return makeAccessorObjects(points, lines, polygons, coordLength);
  }
  function handlePoint(geometry, points, indexMap, coordLength, properties) {
    points.positions.set(geometry.data, indexMap.pointPosition * coordLength);
    const nPositions = geometry.data.length / coordLength;
    fillNumericProperties(points, properties, indexMap.pointPosition, nPositions);
    points.globalFeatureIds.fill(indexMap.feature, indexMap.pointPosition, indexMap.pointPosition + nPositions);
    points.featureIds.fill(indexMap.pointFeature, indexMap.pointPosition, indexMap.pointPosition + nPositions);
    indexMap.pointPosition += nPositions;
  }
  function handleLineString(geometry, lines, indexMap, coordLength, properties) {
    lines.positions.set(geometry.data, indexMap.linePosition * coordLength);
    const nPositions = geometry.data.length / coordLength;
    fillNumericProperties(lines, properties, indexMap.linePosition, nPositions);
    lines.globalFeatureIds.fill(indexMap.feature, indexMap.linePosition, indexMap.linePosition + nPositions);
    lines.featureIds.fill(indexMap.lineFeature, indexMap.linePosition, indexMap.linePosition + nPositions);
    for (let i2 = 0, il = geometry.indices.length; i2 < il; ++i2) {
      const start = geometry.indices[i2];
      const end = i2 === il - 1 ? geometry.data.length : geometry.indices[i2 + 1];
      lines.pathIndices[indexMap.linePath++] = indexMap.linePosition;
      indexMap.linePosition += (end - start) / coordLength;
    }
  }
  function handlePolygon(geometry, polygons, indexMap, coordLength, properties) {
    polygons.positions.set(geometry.data, indexMap.polygonPosition * coordLength);
    const nPositions = geometry.data.length / coordLength;
    fillNumericProperties(polygons, properties, indexMap.polygonPosition, nPositions);
    polygons.globalFeatureIds.fill(indexMap.feature, indexMap.polygonPosition, indexMap.polygonPosition + nPositions);
    polygons.featureIds.fill(indexMap.polygonFeature, indexMap.polygonPosition, indexMap.polygonPosition + nPositions);
    for (let l2 = 0, ll = geometry.indices.length; l2 < ll; ++l2) {
      const startPosition = indexMap.polygonPosition;
      polygons.polygonIndices[indexMap.polygonObject++] = startPosition;
      const areas = geometry.areas[l2];
      const indices = geometry.indices[l2];
      const nextIndices = geometry.indices[l2 + 1];
      for (let i2 = 0, il = indices.length; i2 < il; ++i2) {
        const start = indices[i2];
        const end = i2 === il - 1 ? nextIndices === void 0 ? geometry.data.length : nextIndices[0] : indices[i2 + 1];
        polygons.primitivePolygonIndices[indexMap.polygonRing++] = indexMap.polygonPosition;
        indexMap.polygonPosition += (end - start) / coordLength;
      }
      const endPosition = indexMap.polygonPosition;
      triangulatePolygon(polygons, areas, indices, {
        startPosition,
        endPosition,
        coordLength
      });
    }
  }
  function triangulatePolygon(polygons, areas, indices, _ref) {
    let {
      startPosition,
      endPosition,
      coordLength
    } = _ref;
    if (!polygons.triangles) {
      return;
    }
    const start = startPosition * coordLength;
    const end = endPosition * coordLength;
    const polygonPositions = polygons.positions.subarray(start, end);
    const offset = indices[0];
    const holes = indices.slice(1).map((n2) => (n2 - offset) / coordLength);
    const triangles = earcut(polygonPositions, holes, coordLength, areas);
    for (let t = 0, tl = triangles.length; t < tl; ++t) {
      polygons.triangles.push(startPosition + triangles[t]);
    }
  }
  function wrapProps(obj, size) {
    const returnObj = {};
    for (const key in obj) {
      returnObj[key] = {
        value: obj[key],
        size
      };
    }
    return returnObj;
  }
  function makeAccessorObjects(points, lines, polygons, coordLength) {
    const binaryFeatures = {
      shape: "binary-feature-collection",
      points: {
        ...points,
        positions: {
          value: points.positions,
          size: coordLength
        },
        globalFeatureIds: {
          value: points.globalFeatureIds,
          size: 1
        },
        featureIds: {
          value: points.featureIds,
          size: 1
        },
        numericProps: wrapProps(points.numericProps, 1)
      },
      lines: {
        ...lines,
        positions: {
          value: lines.positions,
          size: coordLength
        },
        pathIndices: {
          value: lines.pathIndices,
          size: 1
        },
        globalFeatureIds: {
          value: lines.globalFeatureIds,
          size: 1
        },
        featureIds: {
          value: lines.featureIds,
          size: 1
        },
        numericProps: wrapProps(lines.numericProps, 1)
      },
      polygons: {
        ...polygons,
        positions: {
          value: polygons.positions,
          size: coordLength
        },
        polygonIndices: {
          value: polygons.polygonIndices,
          size: 1
        },
        primitivePolygonIndices: {
          value: polygons.primitivePolygonIndices,
          size: 1
        },
        globalFeatureIds: {
          value: polygons.globalFeatureIds,
          size: 1
        },
        featureIds: {
          value: polygons.featureIds,
          size: 1
        },
        numericProps: wrapProps(polygons.numericProps, 1)
      }
    };
    if (binaryFeatures.polygons && polygons.triangles) {
      binaryFeatures.polygons.triangles = {
        value: new Uint32Array(polygons.triangles),
        size: 1
      };
    }
    return binaryFeatures;
  }
  function fillNumericProperties(object, properties, index, length2) {
    for (const numericPropName in object.numericProps) {
      if (numericPropName in properties) {
        const value = properties[numericPropName];
        object.numericProps[numericPropName].fill(value, index, index + length2);
      }
    }
  }
  function keepStringProperties(properties, numericKeys) {
    const props = {};
    for (const key in properties) {
      if (!numericKeys.includes(key)) {
        props[key] = properties[key];
      }
    }
    return props;
  }
  function deduceArrayType(x, constructor) {
    if (constructor === Array || !Number.isFinite(x)) {
      return Array;
    }
    return constructor === Float64Array || Math.fround(x) !== x ? Float64Array : Float32Array;
  }
  function extractGeometryInfo(features) {
    let pointPositionsCount = 0;
    let pointFeaturesCount = 0;
    let linePositionsCount = 0;
    let linePathsCount = 0;
    let lineFeaturesCount = 0;
    let polygonPositionsCount = 0;
    let polygonObjectsCount = 0;
    let polygonRingsCount = 0;
    let polygonFeaturesCount = 0;
    const coordLengths = /* @__PURE__ */ new Set();
    for (const feature of features) {
      const geometry = feature.geometry;
      switch (geometry.type) {
        case "Point":
          pointFeaturesCount++;
          pointPositionsCount++;
          coordLengths.add(geometry.coordinates.length);
          break;
        case "MultiPoint":
          pointFeaturesCount++;
          pointPositionsCount += geometry.coordinates.length;
          for (const point of geometry.coordinates) {
            coordLengths.add(point.length);
          }
          break;
        case "LineString":
          lineFeaturesCount++;
          linePositionsCount += geometry.coordinates.length;
          linePathsCount++;
          for (const coord of geometry.coordinates) {
            coordLengths.add(coord.length);
          }
          break;
        case "MultiLineString":
          lineFeaturesCount++;
          for (const line of geometry.coordinates) {
            linePositionsCount += line.length;
            linePathsCount++;
            for (const coord of line) {
              coordLengths.add(coord.length);
            }
          }
          break;
        case "Polygon":
          polygonFeaturesCount++;
          polygonObjectsCount++;
          polygonRingsCount += geometry.coordinates.length;
          const flattened = geometry.coordinates.flat();
          polygonPositionsCount += flattened.length;
          for (const coord of flattened) {
            coordLengths.add(coord.length);
          }
          break;
        case "MultiPolygon":
          polygonFeaturesCount++;
          for (const polygon of geometry.coordinates) {
            polygonObjectsCount++;
            polygonRingsCount += polygon.length;
            const flattened2 = polygon.flat();
            polygonPositionsCount += flattened2.length;
            for (const coord of flattened2) {
              coordLengths.add(coord.length);
            }
          }
          break;
        default:
          throw new Error(`Unsupported geometry type: ${geometry.type}`);
      }
    }
    return {
      coordLength: coordLengths.size > 0 ? Math.max(...coordLengths) : 2,
      pointPositionsCount,
      pointFeaturesCount,
      linePositionsCount,
      linePathsCount,
      lineFeaturesCount,
      polygonPositionsCount,
      polygonObjectsCount,
      polygonRingsCount,
      polygonFeaturesCount
    };
  }
  function geojsonToFlatGeojson(features) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      coordLength: 2,
      fixRingWinding: true
    };
    return features.map((feature) => flattenFeature(feature, options));
  }
  function flattenPoint(coordinates, data, indices, options) {
    indices.push(data.length);
    data.push(...coordinates);
    for (let i2 = coordinates.length; i2 < options.coordLength; i2++) {
      data.push(0);
    }
  }
  function flattenLineString(coordinates, data, indices, options) {
    indices.push(data.length);
    for (const c of coordinates) {
      data.push(...c);
      for (let i2 = c.length; i2 < options.coordLength; i2++) {
        data.push(0);
      }
    }
  }
  function flattenPolygon(coordinates, data, indices, areas, options) {
    let count = 0;
    const ringAreas = [];
    const polygons = [];
    for (const lineString of coordinates) {
      const lineString2d = lineString.map((p) => p.slice(0, 2));
      let area2 = getPolygonSignedArea(lineString2d.flat());
      const ccw = area2 < 0;
      if (options.fixRingWinding && (count === 0 && !ccw || count > 0 && ccw)) {
        lineString.reverse();
        area2 = -area2;
      }
      ringAreas.push(area2);
      flattenLineString(lineString, data, polygons, options);
      count++;
    }
    if (count > 0) {
      areas.push(ringAreas);
      indices.push(polygons);
    }
  }
  function flattenFeature(feature, options) {
    const {
      geometry
    } = feature;
    if (geometry.type === "GeometryCollection") {
      throw new Error("GeometryCollection type not supported");
    }
    const data = [];
    const indices = [];
    let areas;
    let type;
    switch (geometry.type) {
      case "Point":
        type = "Point";
        flattenPoint(geometry.coordinates, data, indices, options);
        break;
      case "MultiPoint":
        type = "Point";
        geometry.coordinates.map((c) => flattenPoint(c, data, indices, options));
        break;
      case "LineString":
        type = "LineString";
        flattenLineString(geometry.coordinates, data, indices, options);
        break;
      case "MultiLineString":
        type = "LineString";
        geometry.coordinates.map((c) => flattenLineString(c, data, indices, options));
        break;
      case "Polygon":
        type = "Polygon";
        areas = [];
        flattenPolygon(geometry.coordinates, data, indices, areas, options);
        break;
      case "MultiPolygon":
        type = "Polygon";
        areas = [];
        geometry.coordinates.map((c) => flattenPolygon(c, data, indices, areas, options));
        break;
      default:
        throw new Error(`Unknown type: ${type}`);
    }
    return {
      ...feature,
      geometry: {
        type,
        indices,
        data,
        areas
      }
    };
  }
  function geojsonToBinary(features) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      fixRingWinding: true,
      triangulate: true
    };
    const geometryInfo = extractGeometryInfo(features);
    const coordLength = geometryInfo.coordLength;
    const {
      fixRingWinding
    } = options;
    const flatFeatures = geojsonToFlatGeojson(features, {
      coordLength,
      fixRingWinding
    });
    return flatGeojsonToBinary(flatFeatures, geometryInfo, {
      numericPropKeys: options.numericPropKeys,
      PositionDataType: options.PositionDataType || Float32Array,
      triangulate: options.triangulate
    });
  }
  const VERSION = "4.1.4";
  const GeoJSONWorkerLoader = {
    name: "GeoJSON",
    id: "geojson",
    module: "geojson",
    version: VERSION,
    worker: true,
    extensions: ["geojson"],
    mimeTypes: ["application/geo+json"],
    category: "geometry",
    text: true,
    options: {
      geojson: {
        shape: "object-row-table"
      },
      json: {
        shape: "object-row-table",
        jsonpaths: ["$", "$.features"]
      },
      gis: {
        format: "geojson"
      }
    }
  };
  const GeoJSONLoader = {
    ...GeoJSONWorkerLoader,
    parse,
    parseTextSync,
    parseInBatches
  };
  async function parse(arrayBuffer, options) {
    return parseTextSync(new TextDecoder().decode(arrayBuffer), options);
  }
  function parseTextSync(text, options) {
    var _geojson;
    options = {
      ...GeoJSONLoader.options,
      ...options
    };
    options.geojson = {
      ...GeoJSONLoader.options.geojson,
      ...options.geojson
    };
    options.gis = options.gis || {};
    let geojson;
    try {
      geojson = JSON.parse(text);
    } catch {
      geojson = {};
    }
    const table = {
      shape: "geojson-table",
      type: "FeatureCollection",
      features: ((_geojson = geojson) === null || _geojson === void 0 ? void 0 : _geojson.features) || []
    };
    switch (options.gis.format) {
      case "binary":
        return geojsonToBinary(table.features);
      default:
        return table;
    }
  }
  function parseInBatches(asyncIterator, options) {
    options = {
      ...GeoJSONLoader.options,
      ...options
    };
    options.json = {
      ...GeoJSONLoader.options.geojson,
      ...options.geojson
    };
    const geojsonIterator = parseJSONInBatches(asyncIterator, options);
    switch (options.gis.format) {
      case "binary":
        return makeBinaryGeometryIterator(geojsonIterator);
      default:
        return geojsonIterator;
    }
  }
  async function* makeBinaryGeometryIterator(geojsonIterator) {
    for await (const batch of geojsonIterator) {
      batch.data = geojsonToBinary(batch.data);
      yield batch;
    }
  }
  function estimateBytesUsed(geometry) {
    let mem = 0;
    for (const name2 in geometry.attributes) {
      const attr = geometry.getAttribute(name2);
      mem += attr.count * attr.itemSize * attr.array.BYTES_PER_ELEMENT;
    }
    const indices = geometry.getIndex();
    mem += indices ? indices.count * indices.itemSize * indices.array.BYTES_PER_ELEMENT : 0;
    return mem;
  }
  function generateGradientTexture(gradient2) {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    context.rect(0, 0, size, size);
    const ctxGradient = context.createLinearGradient(0, 0, size, size);
    for (let i2 = 0; i2 < gradient2.length; i2++) {
      const step = gradient2[i2];
      ctxGradient.addColorStop(step[0], "#" + step[1].getHexString());
    }
    context.fillStyle = ctxGradient;
    context.fill();
    const texture = new three.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.minFilter = three.LinearFilter;
    texture.wrapS = three.RepeatWrapping;
    texture.wrapT = three.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  }
  function getCameraFrustum(camera) {
    camera.updateMatrix();
    camera.updateMatrixWorld();
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
    const frustum2 = new three.Frustum();
    frustum2.setFromProjectionMatrix(new three.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
    return frustum2;
  }
  function loadersPlaneToMesh(plane) {
    const group = new three.Group();
    const planeGeometry = new three.PlaneGeometry(10, 5);
    const coplanarPoint = new three.Vector3(...plane.projectPointOntoPlane([0, 0, 0]));
    const normal = new three.Vector3(plane.normal.x, plane.normal.y, plane.normal.z);
    const focalPoint = new three.Vector3().copy(coplanarPoint).add(normal);
    planeGeometry.lookAt(focalPoint);
    planeGeometry.translate(coplanarPoint.x, coplanarPoint.y, coplanarPoint.z);
    const material = new three.MeshBasicMaterial({ color: 65535, side: three.DoubleSide });
    const mesh = new three.Mesh(planeGeometry, material);
    const arrowHelper = new three.ArrowHelper(normal, coplanarPoint, 5, 16776960);
    group.add(arrowHelper);
    group.add(mesh);
    return group;
  }
  function loadersBoundingBoxToMesh(tile) {
    const { boundingVolume } = tile;
    let redColor = 0;
    if (tile.content) {
      redColor = Math.min(tile.content.byteLength / 5e5, 1);
    }
    const boxColor = new three.Color(redColor, 1, 0);
    const boxGeometry = new three.BoxGeometry(1, 1, 1);
    const boxTransform = new three.Matrix4();
    if (boundingVolume.halfAxes) {
      boxTransform.copy(getMatrix4FromHalfAxes(boundingVolume.halfAxes));
    } else if (boundingVolume.radius) {
      boxGeometry.scale(boundingVolume.radius * 2, boundingVolume.radius * 2, boundingVolume.radius * 2);
    }
    boxGeometry.applyMatrix4(boxTransform);
    const edges = new three.EdgesGeometry(boxGeometry);
    const dispPlane = new three.LineSegments(edges, new three.LineBasicMaterial({ color: boxColor }));
    dispPlane.position.copy(new three.Vector3(...boundingVolume.center));
    return dispPlane;
  }
  function getMatrix4FromHalfAxes(halfAxes) {
    const m = halfAxes;
    const rotateMatrix = new three.Matrix4().fromArray([
      m[0] * 2,
      m[1] * 2,
      m[2] * 2,
      0,
      m[3] * 2,
      m[4] * 2,
      m[5] * 2,
      0,
      m[6] * 2,
      m[7] * 2,
      m[8] * 2,
      0,
      0,
      0,
      0,
      1
    ]);
    return rotateMatrix;
  }
  function datumsToSpherical(latitude, longitude) {
    const EARTH_RADIUS = 6378137;
    const EARTH_PERIMETER = 2 * Math.PI * EARTH_RADIUS;
    const EARTH_ORIGIN = EARTH_PERIMETER / 2;
    const x = longitude * EARTH_ORIGIN / 180;
    let y = Math.log(Math.tan((90 + latitude) * Math.PI / 360)) / (Math.PI / 180);
    y = y * EARTH_ORIGIN / 180;
    return new three.Vector2(x, y);
  }
  function getTextureVRAMByteLength(texture) {
    let uncompressedBytes = 0;
    if (texture.userData.mimeType == "image/ktx2" && texture.mipmaps) {
      for (let i2 = 0; i2 < texture.mipmaps.length; i2++) {
        uncompressedBytes += texture.mipmaps[i2].data.byteLength;
      }
      return uncompressedBytes;
    } else if (texture.image) {
      const { image } = texture;
      const channels = 4;
      let resolution = [image.width, image.height];
      while (resolution[0] > 1 || resolution[1] > 1) {
        uncompressedBytes += resolution[0] * resolution[1] * channels;
        resolution[0] = Math.max(Math.floor(resolution[0] / 2), 1);
        resolution[1] = Math.max(Math.floor(resolution[1] / 2), 1);
      }
      uncompressedBytes += 1 * 1 * channels;
      return uncompressedBytes;
    } else {
      return void 0;
    }
  }
  function getGeometryVRAMByteLength(geometry) {
    return estimateBytesUsed(geometry);
  }
  const Gradients = {
    // From chroma spectral http://gka.github.io/chroma.js/
    SPECTRAL: [
      [0, new three.Color(0.3686, 0.3098, 0.6353)],
      [0.1, new three.Color(0.1961, 0.5333, 0.7412)],
      [0.2, new three.Color(0.4, 0.7608, 0.6471)],
      [0.3, new three.Color(0.6706, 0.8667, 0.6431)],
      [0.4, new three.Color(0.902, 0.9608, 0.5961)],
      [0.5, new three.Color(1, 1, 0.749)],
      [0.6, new three.Color(0.9961, 0.8784, 0.5451)],
      [0.7, new three.Color(0.9922, 0.6824, 0.3804)],
      [0.8, new three.Color(0.9569, 0.4275, 0.2627)],
      [0.9, new three.Color(0.8353, 0.2431, 0.3098)],
      [1, new three.Color(0.6196, 39e-4, 0.2588)]
    ],
    PLASMA: [
      [0, new three.Color(0.241, 0.015, 0.61)],
      [0.1, new three.Color(0.387, 1e-3, 0.654)],
      [0.2, new three.Color(0.524, 0.025, 0.653)],
      [0.3, new three.Color(0.651, 0.125, 0.596)],
      [0.4, new three.Color(0.752, 0.227, 0.513)],
      [0.5, new three.Color(0.837, 0.329, 0.431)],
      [0.6, new three.Color(0.907, 0.435, 0.353)],
      [0.7, new three.Color(0.963, 0.554, 0.272)],
      [0.8, new three.Color(0.992, 0.681, 0.195)],
      [0.9, new three.Color(0.987, 0.822, 0.144)],
      [1, new three.Color(0.94, 0.975, 0.131)]
    ],
    YELLOW_GREEN: [
      [0, new three.Color(0.1647, 0.2824, 0.3451)],
      [0.1, new three.Color(0.1338, 0.3555, 0.4227)],
      [0.2, new three.Color(0.061, 0.4319, 0.4864)],
      [0.3, new three.Color(0, 0.5099, 0.5319)],
      [0.4, new three.Color(0, 0.5881, 0.5569)],
      [0.5, new three.Color(0.137, 0.665, 0.5614)],
      [0.6, new three.Color(0.2906, 0.7395, 0.5477)],
      [0.7, new three.Color(0.4453, 0.8099, 0.5201)],
      [0.8, new three.Color(0.6102, 0.8748, 0.485)],
      [0.9, new three.Color(0.7883, 0.9323, 0.4514)],
      [1, new three.Color(0.9804, 0.9804, 0.4314)]
    ],
    VIRIDIS: [
      [0, new three.Color(0.267, 5e-3, 0.329)],
      [0.1, new three.Color(0.283, 0.141, 0.458)],
      [0.2, new three.Color(0.254, 0.265, 0.53)],
      [0.3, new three.Color(0.207, 0.372, 0.553)],
      [0.4, new three.Color(0.164, 0.471, 0.558)],
      [0.5, new three.Color(0.128, 0.567, 0.551)],
      [0.6, new three.Color(0.135, 0.659, 0.518)],
      [0.7, new three.Color(0.267, 0.749, 0.441)],
      [0.8, new three.Color(0.478, 0.821, 0.318)],
      [0.9, new three.Color(0.741, 0.873, 0.15)],
      [1, new three.Color(0.993, 0.906, 0.144)]
    ],
    INFERNO: [
      [0, new three.Color(0.077, 0.042, 0.206)],
      [0.1, new three.Color(0.225, 0.036, 0.388)],
      [0.2, new three.Color(0.373, 0.074, 0.432)],
      [0.3, new three.Color(0.522, 0.128, 0.42)],
      [0.4, new three.Color(0.665, 0.182, 0.37)],
      [0.5, new three.Color(0.797, 0.255, 0.287)],
      [0.6, new three.Color(0.902, 0.364, 0.184)],
      [0.7, new three.Color(0.969, 0.516, 0.063)],
      [0.8, new three.Color(0.988, 0.683, 0.072)],
      [0.9, new three.Color(0.961, 0.859, 0.298)],
      [1, new three.Color(0.988, 0.998, 0.645)]
    ],
    GRAYSCALE: [
      [0, new three.Color(0, 0, 0)],
      [1, new three.Color(1, 1, 1)]
    ],
    // 16 samples of the TURBU color scheme
    // values taken from: https://gist.github.com/mikhailov-work/ee72ba4191942acecc03fe6da94fc73f
    // original file licensed under Apache-2.0
    TURBO: [
      [0, new three.Color(0.18995, 0.07176, 0.23217)],
      [0.07, new three.Color(0.25107, 0.25237, 0.63374)],
      [0.13, new three.Color(0.27628, 0.42118, 0.89123)],
      [0.2, new three.Color(0.25862, 0.57958, 0.99876)],
      [0.27, new three.Color(0.15844, 0.73551, 0.92305)],
      [0.33, new three.Color(0.09267, 0.86554, 0.7623)],
      [0.4, new three.Color(0.19659, 0.94901, 0.59466)],
      [0.47, new three.Color(0.42778, 0.99419, 0.38575)],
      [0.53, new three.Color(0.64362, 0.98999, 0.23356)],
      [0.6, new three.Color(0.80473, 0.92452, 0.20459)],
      [0.67, new three.Color(0.93301, 0.81236, 0.22667)],
      [0.73, new three.Color(0.99314, 0.67408, 0.20348)],
      [0.8, new three.Color(0.9836, 0.49291, 0.12849)],
      [0.87, new three.Color(0.92105, 0.31489, 0.05475)],
      [0.93, new three.Color(0.81608, 0.18462, 0.01809)],
      [1, new three.Color(0.66449, 0.08436, 424e-5)]
    ],
    RAINBOW: [
      [0, new three.Color(0.278, 0, 0.714)],
      [1 / 6, new three.Color(0, 0, 1)],
      [2 / 6, new three.Color(0, 1, 1)],
      [3 / 6, new three.Color(0, 1, 0)],
      [4 / 6, new three.Color(1, 1, 0)],
      [5 / 6, new three.Color(1, 0.64, 0)],
      [1, new three.Color(1, 0, 0)]
    ],
    CONTOUR: [
      [0, new three.Color(0, 0, 0)],
      [0.03, new three.Color(0, 0, 0)],
      [0.04, new three.Color(1, 1, 1)],
      [1, new three.Color(1, 1, 1)]
    ]
  };
  const PointCloudFS = `
  varying vec3 vColor;
  uniform float alpha;

  void main() {
    if (vColor == vec3(0.0, 0.0, 0.0)) {
      discard;
    } else {
      gl_FragColor = vec4( vColor, alpha);
    }
  }
`;
  const PointCloudVS = `
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
  var PointCloudColoring = /* @__PURE__ */ ((PointCloudColoring2) => {
    PointCloudColoring2[PointCloudColoring2["Intensity"] = 1] = "Intensity";
    PointCloudColoring2[PointCloudColoring2["Classification"] = 2] = "Classification";
    PointCloudColoring2[PointCloudColoring2["Elevation"] = 3] = "Elevation";
    PointCloudColoring2[PointCloudColoring2["RGB"] = 4] = "RGB";
    PointCloudColoring2[PointCloudColoring2["White"] = 5] = "White";
    return PointCloudColoring2;
  })(PointCloudColoring || {});
  var Shading = /* @__PURE__ */ ((Shading2) => {
    Shading2[Shading2["FlatTexture"] = 1] = "FlatTexture";
    Shading2[Shading2["ShadedTexture"] = 2] = "ShadedTexture";
    Shading2[Shading2["ShadedNoTexture"] = 3] = "ShadedNoTexture";
    return Shading2;
  })(Shading || {});
  const gradient = Gradients.RAINBOW;
  const gradientTexture = typeof document != "undefined" ? generateGradientTexture(gradient) : null;
  const grayscale = Gradients.GRAYSCALE;
  const grayscaleTexture = typeof document != "undefined" ? generateGradientTexture(grayscale) : null;
  const defaultOptions = {
    throttleRequests: true,
    maxRequests: 64,
    updateInterval: 0.1,
    maxConcurrency: 1,
    maximumScreenSpaceError: 16,
    memoryAdjustedScreenSpaceError: true,
    maximumMemoryUsage: 400,
    memoryCacheOverflow: 128,
    viewDistanceScale: 1,
    skipLevelOfDetail: false,
    resetTransform: false,
    updateTransforms: true,
    shading: Shading.FlatTexture,
    transparent: false,
    pointCloudColoring: PointCloudColoring.White,
    pointSize: 1,
    worker: true,
    wireframe: false,
    debug: false,
    gltfLoader: null,
    basisTranscoderPath: null,
    dracoDecoderPath: null,
    material: null,
    contentPostProcess: void 0,
    preloadTilesCount: null,
    collectAttributions: false
  };
  class Loader3DTiles {
    /**
    * Loads a tileset of 3D Tiles according to the given {@link LoaderProps}
    * @public
    *
    * @param props - Properties for this load call {@link LoaderProps}.
    * @returns An object containing the 3D Model to be added to the scene
    * and a runtime engine to be updated every frame.
    */
    static async load(props) {
      const options = { ...defaultOptions, ...props.options };
      const { url } = props;
      const UPDATE_INTERVAL = options.updateInterval;
      const MAX_DEPTH_FOR_ORIENTATION = 5;
      const loadersGLOptions = {};
      if (options.cesiumIONToken) {
        loadersGLOptions["cesium-ion"] = {
          accessToken: options.cesiumIONToken
        };
        const metadata = await CesiumIonLoader.preload(url, loadersGLOptions);
        loadersGLOptions["fetch"] = { headers: metadata.headers };
      }
      if (options.googleApiKey) {
        loadersGLOptions["fetch"] = { headers: { "X-GOOG-API-KEY": options.googleApiKey } };
        if (!props.options.hasOwnProperty("collectAttributions")) {
          options.collectAttributions = true;
        }
      }
      if (props.loadingManager) {
        props.loadingManager.itemStart(url);
      }
      const tilesetJson = await load(url, Tiles3DLoader, {
        ...loadersGLOptions
      });
      const renderMap = {};
      const boxMap = {};
      const unloadQueue = [];
      const root = new three.Group();
      const tileBoxes = new three.Group();
      if (!options.debug) {
        tileBoxes.visible = false;
      }
      const pointcloudUniforms = {
        pointSize: { type: "f", value: options.pointSize },
        gradient: { type: "t", value: gradientTexture },
        grayscale: { type: "t", value: grayscaleTexture },
        rootCenter: { type: "vec3", value: new three.Vector3() },
        rootNormal: { type: "vec3", value: new three.Vector3() },
        coloring: { type: "i", value: options.pointCloudColoring },
        hideGround: { type: "b", value: true },
        elevationRange: { type: "vec2", value: new three.Vector2(0, 400) },
        maxIntensity: { type: "f", value: 1 },
        intensityContrast: { type: "f", value: 1 },
        alpha: { type: "f", value: 1 }
      };
      const pointcloudMaterial = new three.ShaderMaterial({
        uniforms: pointcloudUniforms,
        vertexShader: PointCloudVS,
        fragmentShader: PointCloudFS,
        transparent: options.transparent,
        vertexColors: true
      });
      let cameraReference = null;
      let lastViewportSize = new three.Vector2();
      let gltfLoader = void 0;
      let ktx2Loader = void 0;
      let dracoLoader = void 0;
      if (options.gltfLoader) {
        gltfLoader = options.gltfLoader;
      } else {
        gltfLoader = new GLTFLoader_js.GLTFLoader();
        if (options.basisTranscoderPath) {
          ktx2Loader = new KTX2Loader_js.KTX2Loader();
          ktx2Loader.detectSupport(props.renderer);
          ktx2Loader.setTranscoderPath(options.basisTranscoderPath + "/");
          ktx2Loader.setWorkerLimit(1);
          gltfLoader.setKTX2Loader(ktx2Loader);
        }
        if (options.dracoDecoderPath) {
          dracoLoader = new DRACOLoader_js.DRACOLoader();
          dracoLoader.setDecoderPath(options.dracoDecoderPath + "/");
          dracoLoader.setWorkerLimit(options.maxConcurrency);
          gltfLoader.setDRACOLoader(dracoLoader);
        }
      }
      const unlitMaterial = new three.MeshBasicMaterial({ transparent: options.transparent });
      const tileOptions = {
        maximumMemoryUsage: options.maximumMemoryUsage,
        maximumScreenSpaceError: options.maximumScreenSpaceError,
        memoryAdjustedScreenSpaceError: options.memoryAdjustedScreenSpaceError,
        memoryCacheOverflow: options.memoryCacheOverflow,
        viewDistanceScale: options.viewDistanceScale,
        skipLevelOfDetail: options.skipLevelOfDetail,
        updateTransforms: options.updateTransforms,
        throttleRequests: options.throttleRequests,
        maxRequests: options.maxRequests,
        contentLoader: async (tile) => {
          let tileContent = null;
          switch (tile.type) {
            case TILE_TYPE.POINTCLOUD: {
              tileContent = createPointNodes(tile, pointcloudMaterial, options, rootTransformInverse);
              break;
            }
            case TILE_TYPE.SCENEGRAPH:
            case TILE_TYPE.MESH: {
              tileContent = await createGLTFNodes(gltfLoader, tile, unlitMaterial, options, rootTransformInverse);
              break;
            }
          }
          if (tileContent) {
            tileContent.visible = false;
            renderMap[tile.id] = tileContent;
            root.add(renderMap[tile.id]);
            if (options.debug) {
              const box = loadersBoundingBoxToMesh(tile);
              tileBoxes.add(box);
              boxMap[tile.id] = box;
            }
          }
        },
        onTileLoad: async (tile) => {
          if (tileset) {
            if (options.resetTransform && !orientationDetected && (tile == null ? void 0 : tile.depth) <= MAX_DEPTH_FOR_ORIENTATION) {
              detectOrientation(tile);
            }
            needsUpdate = true;
          }
        },
        onTileUnload: (tile) => {
          unloadQueue.push(tile);
        },
        onTileError: (tile, message) => {
          console.error("Tile error", tile.id, message);
        },
        onTraversalComplete(selectedTiles) {
          if (options.collectAttributions) {
            dataAttributions = collectAttributions(selectedTiles);
          }
          return selectedTiles;
        }
      };
      const tileset = new Tileset3D(tilesetJson, {
        ...tileOptions,
        loadOptions: {
          ...loadersGLOptions,
          maxConcurrency: options.maxConcurrency,
          worker: options.worker,
          gltf: {
            loadImages: false
          },
          "3d-tiles": {
            loadGLTF: false
          }
        }
      });
      const threeMat = new three.Matrix4();
      const tileTransform = new three.Matrix4();
      const rootCenter = new three.Vector3();
      let orientationDetected = false;
      let dataAttributions = "";
      if (tileset.root.boundingVolume) {
        if (tileset.root.header.boundingVolume.region) {
          console.warn("Cannot apply a model matrix to bounding volumes of type region. Tileset stays in original geo-coordinates.");
        }
        tileTransform.setPosition(
          tileset.root.boundingVolume.center[0],
          tileset.root.boundingVolume.center[1],
          tileset.root.boundingVolume.center[2]
        );
      } else {
        console.warn("Bounding volume not found, no transformations applied");
      }
      if (options.debug) {
        const box = loadersBoundingBoxToMesh(tileset.root);
        tileBoxes.add(box);
        boxMap[tileset.root.id] = box;
      }
      let disposeFlag = false;
      let loadingEnded = false;
      pointcloudUniforms.rootCenter.value.copy(rootCenter);
      pointcloudUniforms.rootNormal.value.copy(new three.Vector3(0, 0, 1).normalize());
      tileset.stats.get("Loader concurrency").count = options.maxConcurrency;
      tileset.stats.get("Maximum mem usage").count = options.maximumMemoryUsage;
      let timer = 0;
      let lastCameraTransform = null;
      let lastCameraAspect = null;
      let needsUpdate = false;
      const lastCameraPosition = new three.Vector3(Infinity, Infinity, Infinity);
      let sseDenominator = null;
      root.updateMatrixWorld(true);
      const lastRootTransform = new three.Matrix4().copy(root.matrixWorld);
      const rootTransformInverse = new three.Matrix4().copy(lastRootTransform).invert();
      if (options.resetTransform) {
        detectOrientation(tileset.root);
      }
      if (options.debug) {
        boxMap[tileset.root.id].applyMatrix4(threeMat);
        tileBoxes.matrixWorld.copy(root.matrixWorld);
      }
      function detectOrientation(tile) {
        if (!tile.boundingVolume.halfAxes) {
          return;
        }
        const halfAxes = tile.boundingVolume.halfAxes;
        const orientationMatrix = new three.Matrix4().extractRotation(getMatrix4FromHalfAxes(halfAxes)).premultiply(new three.Matrix4().extractRotation(rootTransformInverse));
        const rotation = new three.Euler().setFromRotationMatrix(orientationMatrix);
        if (!rotation.equals(new three.Euler())) {
          orientationDetected = true;
          const pos = new three.Vector3(
            tileTransform.elements[12],
            tileTransform.elements[13],
            tileTransform.elements[14]
          );
          tileTransform.extractRotation(orientationMatrix);
          tileTransform.setPosition(pos);
        }
      }
      function updateTransform() {
        threeMat.copy(lastRootTransform);
        if (options.resetTransform) {
          threeMat.multiply(new three.Matrix4().copy(tileTransform).invert());
        }
        tileset.modelMatrix = new Matrix4(threeMat.toArray());
      }
      function tilesetUpdate(tileset2, renderMap2, viewportHeight, camera) {
        if (disposeFlag || !camera) {
          return;
        }
        if (!sseDenominator || camera.aspect != lastCameraAspect) {
          if (camera instanceof three.PerspectiveCamera) {
            const loadersFrustum = new PerspectiveFrustum({
              fov: camera.fov / 180 * Math.PI,
              aspectRatio: camera.aspect,
              near: camera.near,
              far: camera.far
            });
            sseDenominator = loadersFrustum.sseDenominator;
          } else if (camera instanceof three.OrthographicCamera) {
            const width = camera.right - camera.left;
            const height = camera.top - camera.bottom;
            const aspect = width / height;
            sseDenominator = Math.max(height / viewportHeight, width / (viewportHeight * aspect));
          }
          lastCameraAspect = camera.aspect;
          if (options.debug) {
            console.log("Updated sse denonimator:", sseDenominator);
          }
        }
        const frustum2 = getCameraFrustum(camera);
        const planes = frustum2.planes.map((plane) => new Plane(plane.normal.toArray(), plane.constant));
        const cullingVolume2 = new CullingVolume(planes);
        const frameState = {
          camera: {
            position: lastCameraPosition.toArray()
          },
          height: viewportHeight,
          frameNumber: tileset2._frameNumber,
          sseDenominator,
          cullingVolume: cullingVolume2,
          viewport: {
            id: 0
          }
        };
        tileset2._cache.reset();
        tileset2._traverser.traverse(tileset2.root, frameState, tileset2.options);
        for (const tile of tileset2.tiles) {
          if (tile.selected) {
            if (!renderMap2[tile.id]) {
              console.error("TILE SELECTED BUT NOT LOADED!!", tile.id);
            } else {
              renderMap2[tile.id].visible = true;
            }
          } else {
            if (renderMap2[tile.id]) {
              renderMap2[tile.id].visible = false;
            }
          }
        }
        while (unloadQueue.length > 0) {
          const tile = unloadQueue.pop();
          if (renderMap2[tile.id] && tile.contentState == TILE_CONTENT_STATE.UNLOADED) {
            root.remove(renderMap2[tile.id]);
            disposeNode(renderMap2[tile.id]);
            delete renderMap2[tile.id];
          }
          if (boxMap[tile.id]) {
            disposeNode(boxMap[tile.id]);
            tileBoxes.remove(boxMap[tile.id]);
            delete boxMap[tile.id];
          }
        }
        const tilesLoaded = tileset2.stats.get("Tiles Loaded").count;
        const tilesLoading = tileset2.stats.get("Tiles Loading").count;
        if (props.onProgress) {
          props.onProgress(
            tilesLoaded,
            tilesLoaded + tilesLoading
          );
        }
        if (props.loadingManager && !loadingEnded) {
          if (tilesLoading == 0 && (options.preloadTilesCount == null || tilesLoaded >= options.preloadTilesCount)) {
            loadingEnded = true;
            props.loadingManager.itemEnd(props.url);
          }
        }
        return frameState;
      }
      function setGeoTransformation(transformationMatrix) {
        const position = new three.Vector3();
        const quaternion = new three.Quaternion();
        const scale2 = new three.Vector3();
        transformationMatrix.decompose(position, quaternion, scale2);
        root.position.copy(position);
        root.quaternion.copy(quaternion);
        root.scale.copy(scale2);
        root.updateMatrix();
        root.updateMatrixWorld(true);
        lastRootTransform.copy(root.matrixWorld);
        rootTransformInverse.copy(lastRootTransform).invert();
        updateTransform();
      }
      return {
        model: root,
        runtime: {
          getTileset: () => {
            return tileset;
          },
          getStats: () => {
            return tileset.stats;
          },
          getDataAttributions: () => {
            return dataAttributions;
          },
          showTiles: (visible) => {
            tileBoxes.visible = visible;
          },
          setWireframe: (wireframe) => {
            options.wireframe = wireframe;
            root.traverse((object) => {
              if (object instanceof three.Mesh) {
                object.material.wireframe = wireframe;
              }
            });
          },
          setDebug: (debug) => {
            options.debug = debug;
            tileBoxes.visible = debug;
          },
          setShading: (shading) => {
            options.shading = shading;
          },
          getTileBoxes: () => {
            return tileBoxes;
          },
          setViewDistanceScale: (scale2) => {
            tileset.options.viewDistanceScale = scale2;
            tileset._frameNumber++;
            tilesetUpdate(tileset, renderMap, lastViewportSize.y, cameraReference);
          },
          setMaximumScreenSpaceError: (sse) => {
            tileset.options.maximumScreenSpaceError = sse;
            tileset._frameNumber++;
            tilesetUpdate(tileset, renderMap, lastViewportSize.y, cameraReference);
          },
          setHideGround: (enabled) => {
            pointcloudUniforms.hideGround.value = enabled;
          },
          setPointCloudColoring: (selection) => {
            pointcloudUniforms.coloring.value = selection;
          },
          setElevationRange: (range) => {
            pointcloudUniforms.elevationRange.value.set(range[0], range[1]);
          },
          setMaxIntensity: (intensity) => {
            pointcloudUniforms.maxIntensity.value = intensity;
          },
          setIntensityContrast: (contrast) => {
            pointcloudUniforms.intensityContrast.value = contrast;
          },
          setPointAlpha: (alpha) => {
            pointcloudUniforms.alpha.value = alpha;
          },
          getLatLongHeightFromPosition: (position) => {
            const cartographicPosition = tileset.ellipsoid.cartesianToCartographic(
              new three.Vector3().copy(position).applyMatrix4(new three.Matrix4().copy(threeMat).invert()).toArray()
            );
            return {
              lat: cartographicPosition[1],
              long: cartographicPosition[0],
              height: cartographicPosition[2]
            };
          },
          getPositionFromLatLongHeight: (coord) => {
            const cartesianPosition = tileset.ellipsoid.cartographicToCartesian([
              coord.long,
              coord.lat,
              coord.height
            ]);
            return new three.Vector3(...cartesianPosition).applyMatrix4(threeMat);
          },
          orientToGeocoord: (coord) => {
            const cartographicPosition = [coord.long, coord.lat, coord.height];
            const cartesianPosition = tileset.ellipsoid.cartographicToCartesian(cartographicPosition);
            const ellipsoidTransform = new three.Matrix4().fromArray(tileset.ellipsoid.eastNorthUpToFixedFrame(cartesianPosition));
            const alignRotation = new three.Matrix4().makeRotationFromEuler(
              new three.Euler(Math.PI / 2, Math.PI / 2, 0)
            );
            const geoTransform = new three.Matrix4().copy(ellipsoidTransform).multiply(alignRotation).invert();
            setGeoTransformation(geoTransform);
          },
          getWebMercatorCoord: (coord) => {
            return datumsToSpherical(coord.lat, coord.long);
          },
          getCameraFrustum: (camera) => {
            const frustum2 = getCameraFrustum(camera);
            const meshes = frustum2.planes.map((plane) => new Plane(plane.normal.toArray(), plane.constant)).map((loadersPlane) => loadersPlaneToMesh(loadersPlane));
            const model = new three.Group();
            for (const mesh of meshes)
              model.add(mesh);
            return model;
          },
          overlayGeoJSON: (geoJSONMesh) => {
            geoJSONMesh.applyMatrix4(threeMat);
            geoJSONMesh.updateMatrixWorld();
            return geoJSONMesh;
          },
          subtractBox: (subtractBoxMesh) => {
            subtractBoxMesh.applyMatrix4(threeMat);
            subtractBoxMesh.updateMatrixWorld();
            return subtractBoxMesh;
          },
          update: function(dt, viewportSize, camera) {
            cameraReference = camera;
            lastViewportSize.copy(viewportSize);
            timer += dt;
            if (tileset && timer >= UPDATE_INTERVAL) {
              if (!lastRootTransform.equals(root.matrixWorld)) {
                timer = 0;
                lastRootTransform.copy(root.matrixWorld);
                if (options.updateTransforms) {
                  updateTransform();
                }
                const rootCenter2 = new three.Vector3().setFromMatrixPosition(lastRootTransform);
                pointcloudUniforms.rootCenter.value.copy(rootCenter2);
                pointcloudUniforms.rootNormal.value.copy(new three.Vector3(0, 0, 1).applyMatrix4(lastRootTransform).normalize());
                rootTransformInverse.copy(lastRootTransform).invert();
                if (options.debug) {
                  boxMap[tileset.root.id].matrixWorld.copy(threeMat);
                  boxMap[tileset.root.id].applyMatrix4(lastRootTransform);
                }
              }
              if (lastCameraTransform == null) {
                lastCameraTransform = new three.Matrix4().copy(camera.matrixWorld);
              } else {
                if (needsUpdate || cameraChanged(camera, lastCameraTransform, lastCameraAspect)) {
                  timer = 0;
                  needsUpdate = false;
                  tileset._frameNumber++;
                  camera.getWorldPosition(lastCameraPosition);
                  lastCameraTransform.copy(camera.matrixWorld);
                  tilesetUpdate(tileset, renderMap, lastViewportSize.y, camera);
                }
              }
            }
          },
          dispose: function() {
            disposeFlag = true;
            tileset._destroy();
            while (root.children.length > 0) {
              const obj = root.children[0];
              disposeNode(obj);
              root.remove(obj);
            }
            while (tileBoxes.children.length > 0) {
              const obj = tileBoxes.children[0];
              tileBoxes.remove(obj);
              obj.geometry.dispose();
              obj.material.dispose();
            }
            if (ktx2Loader) {
              ktx2Loader.dispose();
            }
            if (dracoLoader) {
              dracoLoader.dispose();
            }
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
    static async loadGeoJSON(props) {
      const { url, height, featureToColor } = props;
      return load(url, GeoJSONLoader, { worker: false, gis: { format: "binary" } }).then((data) => {
        const featureCollection = data;
        const geometry = new three.BufferGeometry();
        const cartesianPositions = featureCollection.polygons.positions.value.reduce((acc, val, i2, src) => {
          if (i2 % 2 == 0) {
            const cartographic = [val, src[i2 + 1], height];
            const cartesian = Ellipsoid.WGS84.cartographicToCartesian(cartographic);
            acc.push(...cartesian);
          }
          return acc;
        }, []);
        if (featureToColor) {
          const colors = featureCollection.polygons.numericProps[featureToColor.feature].value.reduce((acc, val, i2, src) => {
            const color = featureToColor.colorMap(val);
            acc[i2 * 3] = color.r;
            acc[i2 * 3 + 1] = color.g;
            acc[i2 * 3 + 2] = color.b;
            return acc;
          }, []);
          geometry.setAttribute("color", new three.Float32BufferAttribute(
            colors,
            3
          ));
        }
        geometry.setAttribute("position", new three.Float32BufferAttribute(
          cartesianPositions,
          3
        ));
        geometry.setIndex(
          new three.BufferAttribute(featureCollection.polygons.triangles.value, 1)
        );
        const material = new three.MeshBasicMaterial({ transparent: true });
        material.vertexColors = true;
        const mesh = new three.Mesh(geometry, material);
        return mesh;
      });
    }
  }
  async function createGLTFNodes(gltfLoader, tile, unlitMaterial, options, rootTransformInverse) {
    return new Promise((resolve2, reject) => {
      const rotateX2 = new three.Matrix4().makeRotationAxis(new three.Vector3(1, 0, 0), Math.PI / 2);
      const shouldRotate = tile.content.gltfUpAxis !== "Z";
      const contentTransform = new three.Matrix4().fromArray(tile.computedTransform).premultiply(rootTransformInverse);
      if (shouldRotate) {
        contentTransform.multiply(rotateX2);
      }
      if (!tile.content.byteLength) {
        tile.content.byteLength = tile.content.gltfArrayBuffer.byteLength;
      }
      gltfLoader.parse(
        tile.content.gltfArrayBuffer,
        tile.contentUrl ? tile.contentUrl.substr(0, tile.contentUrl.lastIndexOf("/") + 1) : "",
        (gltf) => {
          tile.userData.asset = gltf.asset;
          const tileContent = gltf.scenes[0];
          tileContent.applyMatrix4(contentTransform);
          tile.content.texturesByteLength = 0;
          tile.content.geometriesByteLength = 0;
          tileContent.traverse((object) => {
            if (object.type == "Mesh") {
              const mesh = object;
              tile.content.geometriesByteLength += getGeometryVRAMByteLength(mesh.geometry);
              const originalMaterial = mesh.material;
              const originalMap = originalMaterial.map;
              const textureByteLength = getTextureVRAMByteLength(originalMap);
              if (textureByteLength) {
                tile.content.texturesByteLength += textureByteLength;
              }
              if (options.material) {
                mesh.material = options.material.clone();
                originalMaterial.dispose();
              } else if (options.shading == Shading.FlatTexture && mesh.material.type !== "MeshBasicMaterial") {
                mesh.material = unlitMaterial.clone();
                originalMaterial.dispose();
              }
              if (options.shading != Shading.ShadedNoTexture) {
                if (mesh.material.type == "ShaderMaterial") {
                  mesh.material.uniforms.map = { value: originalMap };
                } else {
                  mesh.material.map = originalMap;
                }
              } else {
                if (originalMap) {
                  originalMap.dispose();
                }
                mesh.material.map = null;
              }
              mesh.material.wireframe = options.wireframe;
              if (options.contentPostProcess) {
                options.contentPostProcess(mesh);
              }
            }
          });
          tile.content.gpuMemoryUsageInBytes = tile.content.texturesByteLength + tile.content.geometriesByteLength;
          resolve2(tileContent);
        },
        (e) => {
          reject(new Error(`error parsing gltf in tile ${tile.id}: ${e}`));
        }
      );
    });
  }
  function createPointNodes(tile, pointcloudMaterial, options, rootTransformInverse) {
    const d = {
      rtc_center: tile.content.rtcCenter,
      // eslint-disable-line camelcase
      points: tile.content.attributes.positions,
      intensities: tile.content.attributes.intensity,
      classifications: tile.content.attributes.classification,
      rgb: null,
      rgba: null
    };
    const { colors } = tile.content.attributes;
    if (colors && colors.size === 3) {
      d.rgb = colors.value;
    }
    if (colors && colors.size === 4) {
      d.rgba = colors.value;
    }
    const geometry = new three.BufferGeometry();
    geometry.setAttribute("position", new three.Float32BufferAttribute(d.points, 3));
    const contentTransform = new three.Matrix4().fromArray(tile.computedTransform).premultiply(rootTransformInverse);
    if (d.rgba) {
      geometry.setAttribute("color", new three.Float32BufferAttribute(d.rgba, 4));
    } else if (d.rgb) {
      geometry.setAttribute("color", new three.Uint8BufferAttribute(d.rgb, 3, true));
    }
    if (d.intensities) {
      geometry.setAttribute(
        "intensity",
        // Handles both 16bit or 8bit intensity values
        new three.BufferAttribute(d.intensities, 1, true)
      );
    }
    if (d.classifications) {
      geometry.setAttribute("classification", new three.Uint8BufferAttribute(d.classifications, 1, false));
    }
    tile.content.geometriesByteLength = getGeometryVRAMByteLength(geometry);
    tile.content.gpuMemoryUsageInBytes = tile.content.geometriesByteLength;
    const tileContent = new three.Points(geometry, options.material || pointcloudMaterial);
    if (d.rtc_center) {
      const c = d.rtc_center;
      contentTransform.multiply(new three.Matrix4().makeTranslation(c[0], c[1], c[2]));
    }
    tileContent.applyMatrix4(contentTransform);
    if (options.contentPostProcess) {
      options.contentPostProcess(tileContent);
    }
    return tileContent;
  }
  function disposeMaterial(material) {
    var _a, _b, _c, _d;
    if ((_a = material == null ? void 0 : material.uniforms) == null ? void 0 : _a.map) {
      (_c = (_b = material == null ? void 0 : material.uniforms) == null ? void 0 : _b.map.value) == null ? void 0 : _c.dispose();
    } else if (material.map) {
      (_d = material.map) == null ? void 0 : _d.dispose();
    }
    material.dispose();
  }
  function disposeNode(node2) {
    node2.traverse((object) => {
      if (object.isMesh) {
        object.geometry.dispose();
        if (object.material.isMaterial) {
          disposeMaterial(object.material);
        } else {
          for (const material of object.material) {
            disposeMaterial(material);
          }
        }
      }
    });
    for (let i2 = node2.children.length - 1; i2 >= 0; i2--) {
      const obj = node2.children[i2];
      node2.remove(obj);
    }
  }
  function cameraChanged(camera, lastCameraTransform, lastCameraAspect) {
    const positionChanged = !camera.matrixWorld.equals(lastCameraTransform);
    if (camera instanceof three.PerspectiveCamera) {
      return positionChanged || camera.aspect !== lastCameraAspect;
    }
    return positionChanged;
  }
  function collectAttributions(tiles) {
    const copyrightCounts = /* @__PURE__ */ new Map();
    tiles.forEach((tile) => {
      var _a, _b;
      const copyright = (_b = (_a = tile == null ? void 0 : tile.userData) == null ? void 0 : _a.asset) == null ? void 0 : _b.copyright;
      if (copyright) {
        const attributions = copyright.split(/;/g).map((attr) => attr.trim());
        attributions.forEach((attr) => {
          if (attr) {
            copyrightCounts.set(attr, (copyrightCounts.get(attr) || 0) + 1);
          }
        });
      }
    });
    const sortedAttributions = Array.from(copyrightCounts).sort((a2, b) => b[1] - a2[1]).map(([attr]) => attr);
    const attributionString = sortedAttributions.join("; ");
    return attributionString;
  }
  exports2.Loader3DTiles = Loader3DTiles;
  exports2.PointCloudColoring = PointCloudColoring;
  exports2.Shading = Shading;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});
