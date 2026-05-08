import { aA as P, a as k, db as S, bv as y, at as F, ao as q, ar as G, aq as X, as as Y, w as Z, e as J, f as K, b3 as Q, cX as ee, cZ as te, de as re, dj as ne, O as ie, g as se, D as oe, s as ae, x as ce, z as de, au as le, ax as ue, ay as he, az as pe, bp as ge, bA as ye, bI as me, c9 as fe, ct as ve, cE as Ee, d3 as be, fV as d, f_ as E, b4 as g, d7 as h, t as b, co as p, k as _e, T as j, bg as $, bu as M, d5 as Ce, bz as I, cw as xe, cx as je, c1 as we, c2 as Se, c$ as Re, d0 as De, cY as Oe, cm as Te, ft as Be, d6 as He, cr as Pe, bk as u, bm as f, dd as Me } from "./sqljob-DhC1FfSK.js";
var U = class extends P {
  static extend(t) {
    Object.getOwnPropertyNames(t.prototype).forEach((e) => {
      e !== "constructor" && (this.prototype[e] = t.prototype[e]);
    }), Object.getOwnPropertyNames(t).forEach((e) => {
      e !== "prototype" && e !== "name" && e !== "length" && (this[e] = t[e]);
    });
  }
};
const _ = Symbol("initializers"), z = Symbol("manualInit");
var Ue = class extends P {
  constructor(t) {
    if (super(), this._injector = t, this.constructor[z]) return;
    let e = this, r = Object.getPrototypeOf(this)[_];
    r && r.forEach(function(n) {
      n.apply(e, [t]);
    });
  }
  _initialize(t, ...e) {
  }
  _runInitializers(...t) {
    let e = Object.getPrototypeOf(this)[_];
    e != null && e.length && e.forEach((r) => r.apply(this, t));
  }
  static _enableManualInit() {
    this[z] = !0;
  }
  static extend(t) {
    Object.getOwnPropertyNames(t.prototype).forEach((e) => {
      if (e === "_initialize") {
        let r = this.prototype[_];
        r || (r = [], this.prototype[_] = r), r.push(t.prototype._initialize);
      } else e !== "constructor" && (this.prototype[e] = t.prototype[e]);
    }), Object.getOwnPropertyNames(t).forEach((e) => {
      e !== "prototype" && e !== "name" && e !== "length" && (this[e] = t[e]);
    });
  }
};
function a(t, e) {
  return function(r, n) {
    e(r, n, t);
  };
}
function v(t, e, r, n) {
  var i = arguments.length, s = i < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, r) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") s = Reflect.decorate(t, e, r, n);
  else for (var c = t.length - 1; c >= 0; c--) (o = t[c]) && (s = (i < 3 ? o(s) : i > 3 ? o(e, r, s) : o(e, r)) || s);
  return i > 3 && s && Object.defineProperty(e, r, s), s;
}
var R;
let D = R = class extends U {
  constructor(t, e) {
    super(), this._blob = t, this._injector = e;
  }
  copyBlob() {
    return this._injector.createInstance(R, this._blob);
  }
  getAs(t) {
    let e = this.copyBlob();
    return e.setContentType(t), e;
  }
  getDataAsString(t) {
    return this._blob === null ? Promise.resolve("") : t === void 0 ? this._blob.text() : new Promise((e, r) => {
      this._blob.arrayBuffer().then((n) => {
        e(new TextDecoder(t).decode(n));
      }).catch((n) => {
        r(Error(`Failed to read Blob as ArrayBuffer: ${n.message}`));
      });
    });
  }
  getBytes() {
    return this._blob ? this._blob.arrayBuffer().then((t) => new Uint8Array(t)) : Promise.reject(Error("Blob is undefined or null."));
  }
  setBytes(t) {
    return this._blob = new Blob([t.buffer]), this;
  }
  setDataFromString(t, e) {
    let r = e ?? "text/plain";
    return this._blob = new Blob([t], { type: r }), this;
  }
  getContentType() {
    var t;
    return (t = this._blob) == null ? void 0 : t.type;
  }
  setContentType(t) {
    var e;
    return this._blob = (e = this._blob) == null ? void 0 : e.slice(0, this._blob.size, t), this;
  }
};
D = R = v([a(1, u(f))], D);
function m(t) {
  "@babel/helpers - typeof";
  return m = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, m(t);
}
function Ie(t, e) {
  if (m(t) != "object" || !t) return t;
  var r = t[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(t, e);
    if (m(n) != "object") return n;
    throw TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function ze(t) {
  var e = Ie(t, "string");
  return m(e) == "symbol" ? e : e + "";
}
function l(t, e, r) {
  return (e = ze(e)) in t ? Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = r, t;
}
var V = class C {
  static get() {
    if (this._instance) return this._instance;
    let e = new C();
    return this._instance = e, e;
  }
  static extend(e) {
    Object.getOwnPropertyNames(e.prototype).forEach((r) => {
      r !== "constructor" && (this.prototype[r] = e.prototype[r]);
    }), Object.getOwnPropertyNames(e).forEach((r) => {
      r !== "prototype" && r !== "name" && r !== "length" && (this[r] = e[r]);
    });
  }
  constructor() {
    for (let e in C.prototype) this[e] = C.prototype[e];
  }
  get AbsoluteRefType() {
    return k;
  }
  get UniverInstanceType() {
    return S;
  }
  get LifecycleStages() {
    return y;
  }
  get DataValidationType() {
    return F;
  }
  get DataValidationErrorStyle() {
    return q;
  }
  get DataValidationRenderMode() {
    return G;
  }
  get DataValidationOperator() {
    return X;
  }
  get DataValidationStatus() {
    return Y;
  }
  get CommandType() {
    return Z;
  }
  get BaselineOffset() {
    return J;
  }
  get BooleanNumber() {
    return K;
  }
  get HorizontalAlign() {
    return Q;
  }
  get TextDecoration() {
    return ee;
  }
  get TextDirection() {
    return te;
  }
  get VerticalAlign() {
    return re;
  }
  get WrapStrategy() {
    return ne;
  }
  get BorderType() {
    return ie;
  }
  get BorderStyleTypes() {
    return se;
  }
  get AutoFillSeries() {
    return oe;
  }
  get ColorType() {
    return ae;
  }
  get CommonHideTypes() {
    return ce;
  }
  get CopyPasteType() {
    return de;
  }
  get DeleteDirection() {
    return le;
  }
  get DeveloperMetadataVisibility() {
    return ue;
  }
  get Dimension() {
    return he;
  }
  get Direction() {
    return pe;
  }
  get InterpolationPointType() {
    return ge;
  }
  get LocaleType() {
    return ye;
  }
  get MentionType() {
    return me;
  }
  get ProtectionType() {
    return fe;
  }
  get RelativeDate() {
    return ve;
  }
  get SheetTypes() {
    return Ee;
  }
  get ThemeColorType() {
    return be;
  }
};
l(V, "_instance", void 0);
var A = class x {
  static get() {
    if (this._instance) return this._instance;
    let e = new x();
    return this._instance = e, e;
  }
  static extend(e) {
    Object.getOwnPropertyNames(e.prototype).forEach((r) => {
      r !== "constructor" && (this.prototype[r] = e.prototype[r]);
    }), Object.getOwnPropertyNames(e).forEach((r) => {
      r !== "prototype" && r !== "name" && r !== "length" && (this[r] = e[r]);
    });
  }
  constructor() {
    for (let e in x.prototype) this[e] = x.prototype[e];
  }
  get DocCreated() {
    return "DocCreated";
  }
  get DocDisposed() {
    return "DocDisposed";
  }
  get LifeCycleChanged() {
    return "LifeCycleChanged";
  }
  get Redo() {
    return "Redo";
  }
  get Undo() {
    return "Undo";
  }
  get BeforeRedo() {
    return "BeforeRedo";
  }
  get BeforeUndo() {
    return "BeforeUndo";
  }
  get CommandExecuted() {
    return "CommandExecuted";
  }
  get BeforeCommandExecute() {
    return "BeforeCommandExecute";
  }
};
l(A, "_instance", void 0);
let O = class extends U {
  constructor(t, e) {
    super(), this._injector = t, this._lifecycleService = e;
  }
  onStarting(t) {
    return d(this._lifecycleService.lifecycle$.pipe(E((e) => e === y.Starting)).subscribe(t));
  }
  onReady(t) {
    return d(this._lifecycleService.lifecycle$.pipe(E((e) => e === y.Ready)).subscribe(t));
  }
  onRendered(t) {
    return d(this._lifecycleService.lifecycle$.pipe(E((e) => e === y.Rendered)).subscribe(t));
  }
  onSteady(t) {
    return d(this._lifecycleService.lifecycle$.pipe(E((e) => e === y.Steady)).subscribe(t));
  }
  onBeforeUndo(t) {
    return this._injector.get(g).beforeCommandExecuted((e) => {
      if (e.id === h.id) {
        let r = this._injector.get(b).pitchTopUndoElement();
        r && t(r);
      }
    });
  }
  onUndo(t) {
    return this._injector.get(g).onCommandExecuted((e) => {
      if (e.id === h.id) {
        let r = this._injector.get(b).pitchTopUndoElement();
        r && t(r);
      }
    });
  }
  onBeforeRedo(t) {
    return this._injector.get(g).beforeCommandExecuted((e) => {
      if (e.id === p.id) {
        let r = this._injector.get(b).pitchTopRedoElement();
        r && t(r);
      }
    });
  }
  onRedo(t) {
    return this._injector.get(g).onCommandExecuted((e) => {
      if (e.id === p.id) {
        let r = this._injector.get(b).pitchTopRedoElement();
        r && t(r);
      }
    });
  }
};
O = v([a(0, u(f)), a(1, u(M))], O);
let T = class extends Ue {
  constructor(t, e) {
    super(e), this.doc = t;
  }
};
T = v([a(1, u(f))], T);
var Ne = class {
  constructor() {
    l(this, "_eventRegistry", /* @__PURE__ */ new Map()), l(this, "_eventHandlerMap", /* @__PURE__ */ new Map()), l(this, "_eventHandlerRegisted", /* @__PURE__ */ new Map());
  }
  _ensureEventRegistry(t) {
    return this._eventRegistry.has(t) || this._eventRegistry.set(t, new Pe()), this._eventRegistry.get(t);
  }
  registerEventHandler(t, e) {
    let r = this._eventHandlerMap.get(t);
    return r ? r.add(e) : this._eventHandlerMap.set(t, /* @__PURE__ */ new Set([e])), this._ensureEventRegistry(t).getData().length && this._initEventHandler(t), d(() => {
      var n, i, s;
      (n = this._eventHandlerMap.get(t)) == null || n.delete(e), (i = this._eventHandlerRegisted.get(t)) == null || (i = i.get(e)) == null || i.dispose(), (s = this._eventHandlerRegisted.get(t)) == null || s.delete(e);
    });
  }
  removeEvent(t, e) {
    let r = this._ensureEventRegistry(t);
    if (r.delete(e), r.getData().length === 0) {
      let n = this._eventHandlerRegisted.get(t);
      n == null || n.forEach((i) => i.dispose()), this._eventHandlerRegisted.delete(t);
    }
  }
  _initEventHandler(t) {
    let e = this._eventHandlerRegisted.get(t), r = this._eventHandlerMap.get(t);
    r && (!e || e.size === 0) && (e = /* @__PURE__ */ new Map(), this._eventHandlerRegisted.set(t, e), r == null || r.forEach((n) => {
      e == null || e.set(n, d(n()));
    }));
  }
  addEvent(t, e) {
    return this._ensureEventRegistry(t).add(e), this._initEventHandler(t), d(() => this.removeEvent(t, e));
  }
  fireEvent(t, e) {
    var r;
    return (r = this._eventRegistry.get(t)) == null || r.getData().forEach((n) => {
      n(e);
    }), e.cancel;
  }
};
let B = class extends U {
  constructor(t, e) {
    super(), this._injector = t, this._userManagerService = e;
  }
  getCurrentUser() {
    return this._userManagerService.getCurrentUser();
  }
};
B = v([a(0, u(f)), a(1, u(Me))], B);
var L = class W {
  static get() {
    if (this._instance) return this._instance;
    let e = new W();
    return this._instance = e, e;
  }
  static extend(e) {
    Object.getOwnPropertyNames(e.prototype).forEach((r) => {
      r !== "constructor" && (this.prototype[r] = e.prototype[r]);
    }), Object.getOwnPropertyNames(e).forEach((r) => {
      r !== "prototype" && r !== "name" && r !== "length" && (this[r] = e[r]);
    });
  }
  get rectangle() {
    return Te;
  }
  get numfmt() {
    return Be;
  }
  get tools() {
    return He;
  }
};
l(L, "_instance", void 0);
var H;
const w = Symbol("initializers");
let N = H = class extends P {
  static newAPI(t) {
    return (t instanceof _e ? t.__getInjector() : t).createInstance(H);
  }
  _initialize(t) {
  }
  static extend(t) {
    Object.getOwnPropertyNames(t.prototype).forEach((e) => {
      if (e === "_initialize") {
        let r = this.prototype[w];
        r || (r = [], this.prototype[w] = r), r.push(t.prototype._initialize);
      } else e !== "constructor" && (this.prototype[e] = t.prototype[e]);
    }), Object.getOwnPropertyNames(t).forEach((e) => {
      e !== "prototype" && e !== "name" && e !== "length" && (this[e] = t[e]);
    });
  }
  constructor(t, e, r, n) {
    super(), this._injector = t, this._commandService = e, this._univerInstanceService = r, this._lifecycleService = n, l(this, "_eventRegistry", new Ne()), l(this, "registerEventHandler", (s, o) => this._eventRegistry.registerEventHandler(s, o)), this.disposeWithMe(this.registerEventHandler(this.Event.LifeCycleChanged, () => d(this._lifecycleService.lifecycle$.subscribe((s) => {
      this.fireEvent(this.Event.LifeCycleChanged, { stage: s });
    })))), this._initUnitEvent(this._injector), this._initBeforeCommandEvent(this._injector), this._initCommandEvent(this._injector), this._injector.onDispose(() => {
      this.dispose();
    });
    let i = Object.getPrototypeOf(this)[w];
    if (i) {
      let s = this;
      i.forEach(function(o) {
        o.apply(s, [t]);
      });
    }
  }
  _initCommandEvent(t) {
    let e = t.get(g);
    this.disposeWithMe(this.registerEventHandler(this.Event.Redo, () => e.onCommandExecuted((r) => {
      let { id: n, type: i, params: s } = r;
      if (r.id === p.id) {
        let o = { id: n, type: i, params: s };
        this.fireEvent(this.Event.Redo, o);
      }
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.Undo, () => e.onCommandExecuted((r) => {
      let { id: n, type: i, params: s } = r;
      if (r.id === h.id) {
        let o = { id: n, type: i, params: s };
        this.fireEvent(this.Event.Undo, o);
      }
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.CommandExecuted, () => e.onCommandExecuted((r, n) => {
      let { id: i, type: s, params: o } = r;
      if (r.id !== p.id && r.id !== h.id) {
        let c = { id: i, type: s, params: o, options: n };
        this.fireEvent(this.Event.CommandExecuted, c);
      }
    })));
  }
  _initBeforeCommandEvent(t) {
    let e = t.get(g);
    this.disposeWithMe(this.registerEventHandler(this.Event.BeforeRedo, () => e.beforeCommandExecuted((r) => {
      let { id: n, type: i, params: s } = r;
      if (r.id === p.id) {
        let o = { id: n, type: i, params: s };
        if (this.fireEvent(this.Event.BeforeRedo, o), o.cancel) throw new j();
      }
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.BeforeUndo, () => e.beforeCommandExecuted((r) => {
      let { id: n, type: i, params: s } = r;
      if (r.id === h.id) {
        let o = { id: n, type: i, params: s };
        if (this.fireEvent(this.Event.BeforeUndo, o), o.cancel) throw new j();
      }
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.BeforeCommandExecute, () => e.beforeCommandExecuted((r, n) => {
      let { id: i, type: s, params: o } = r;
      if (r.id !== p.id && r.id !== h.id) {
        let c = { id: i, type: s, params: o, options: n };
        if (this.fireEvent(this.Event.BeforeCommandExecute, c), c.cancel) throw new j();
      }
    })));
  }
  _initUnitEvent(t) {
    let e = t.get($);
    this.disposeWithMe(this.registerEventHandler(this.Event.DocDisposed, () => e.unitDisposed$.subscribe((r) => {
      r.type === S.UNIVER_DOC && this.fireEvent(this.Event.DocDisposed, { unitId: r.getUnitId(), unitType: r.type, snapshot: r.getSnapshot() });
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.DocCreated, () => e.unitAdded$.subscribe((r) => {
      if (r.type === S.UNIVER_DOC) {
        let n = r, i = t.createInstance(T, n);
        this.fireEvent(this.Event.DocCreated, { unitId: r.getUnitId(), type: r.type, doc: i, unit: i });
      }
    })));
  }
  disposeUnit(t) {
    return this._univerInstanceService.disposeUnit(t);
  }
  getCurrentLifecycleStage() {
    return this._injector.get(M).stage;
  }
  undo() {
    return this._commandService.executeCommand(h.id);
  }
  redo() {
    return this._commandService.executeCommand(p.id);
  }
  toggleDarkMode(t) {
    this._injector.get(Ce).setDarkMode(t);
  }
  loadLocales(t, e) {
    this._injector.get(I).load({ [t]: e });
  }
  setLocale(t) {
    this._injector.get(I).setLocale(t);
  }
  onBeforeCommandExecute(t) {
    return this._commandService.beforeCommandExecuted((e, r) => {
      t(e, r);
    });
  }
  onCommandExecuted(t) {
    return this._commandService.onCommandExecuted((e, r) => {
      t(e, r);
    });
  }
  executeCommand(t, e, r) {
    return this._commandService.executeCommand(t, e, r);
  }
  syncExecuteCommand(t, e, r) {
    return this._commandService.syncExecuteCommand(t, e, r);
  }
  getHooks() {
    return this._injector.createInstance(O);
  }
  get Enum() {
    return V.get();
  }
  get Event() {
    return A.get();
  }
  get Util() {
    return L.get();
  }
  addEvent(t, e) {
    if (!t || !e) throw Error("Cannot add empty event");
    return this._eventRegistry.addEvent(t, e);
  }
  fireEvent(t, e) {
    return this._eventRegistry.fireEvent(t, e);
  }
  getUserManager() {
    return this._injector.createInstance(B);
  }
  newBlob() {
    return this._injector.createInstance(D, null);
  }
  newRichText(t) {
    return xe.create(t);
  }
  newRichTextValue(t) {
    return je.create(t);
  }
  newParagraphStyle(t) {
    return we.create(t);
  }
  newParagraphStyleValue(t) {
    return Se.create(t);
  }
  newTextStyle(t) {
    return Re.create(t);
  }
  newTextStyleValue(t) {
    return De.create(t);
  }
  newTextDecoration(t) {
    return new Oe(t);
  }
};
N = H = v([a(0, u(f)), a(1, g), a(2, $), a(3, u(M))], N);
export {
  N as $,
  U as F,
  V as G,
  D as H,
  A as K,
  Ue as R,
  L as X,
  O as q
};
