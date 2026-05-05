import { f_ as he, f$ as C, g0 as pe, g1 as ge, g2 as fe, g3 as me, g4 as ye, g5 as ve, g6 as Ee, aA as X, a as _e, db as z, bv as x, at as be, ao as xe, ar as Ce, aq as Se, as as Te, w as Re, e as we, f as je, b3 as Oe, cX as De, cZ as Ie, de as Be, dj as Me, O as He, g as Pe, D as Ue, s as Ne, x as $e, z as ze, au as Ae, ax as We, ay as Le, az as Ve, bp as ke, bA as Fe, bI as Xe, c9 as qe, ct as Ge, cE as Ke, d3 as Ye, fV as p, g7 as j, b4 as v, d7 as m, t as O, co as y, k as Ze, T as U, bg as ne, bu as q, d5 as Je, bz as J, cw as Qe, cx as et, c1 as tt, c2 as rt, c$ as nt, d0 as it, cY as st, cm as ot, ft as at, d6 as ct, cr as dt, bk as f, bm as T, dd as ut } from "./sqljob-DrRFST-L.js";
var lt = /\s/;
function ht(t) {
  for (var e = t.length; e-- && lt.test(t.charAt(e)); )
    ;
  return e;
}
var pt = /^\s+/;
function gt(t) {
  return t && t.slice(0, ht(t) + 1).replace(pt, "");
}
var Q = NaN, ft = /^[-+]0x[0-9a-f]+$/i, mt = /^0b[01]+$/i, yt = /^0o[0-7]+$/i, vt = parseInt;
function ee(t) {
  if (typeof t == "number")
    return t;
  if (he(t))
    return Q;
  if (C(t)) {
    var e = typeof t.valueOf == "function" ? t.valueOf() : t;
    t = C(e) ? e + "" : e;
  }
  if (typeof t != "string")
    return t === 0 ? t : +t;
  t = gt(t);
  var r = mt.test(t);
  return r || yt.test(t) ? vt(t.slice(2), r ? 2 : 8) : ft.test(t) ? Q : +t;
}
var N = function() {
  return pe.Date.now();
}, Et = "Expected a function", _t = Math.max, bt = Math.min;
function jt(t, e, r) {
  var n, i, s, o, a, d, u = 0, E = !1, _ = !1, M = !0;
  if (typeof t != "function")
    throw new TypeError(Et);
  e = ee(e) || 0, C(r) && (E = !!r.leading, _ = "maxWait" in r, s = _ ? _t(ee(r.maxWait) || 0, e) : s, M = "trailing" in r ? !!r.trailing : M);
  function H(c) {
    var h = n, b = i;
    return n = i = void 0, u = c, o = t.apply(b, h), o;
  }
  function ce(c) {
    return u = c, a = setTimeout(w, e), E ? H(c) : o;
  }
  function de(c) {
    var h = c - d, b = c - u, Z = e - h;
    return _ ? bt(Z, s - b) : Z;
  }
  function K(c) {
    var h = c - d, b = c - u;
    return d === void 0 || h >= e || h < 0 || _ && b >= s;
  }
  function w() {
    var c = N();
    if (K(c))
      return Y(c);
    a = setTimeout(w, de(c));
  }
  function Y(c) {
    return a = void 0, M && n ? H(c) : (n = i = void 0, o);
  }
  function ue() {
    a !== void 0 && clearTimeout(a), u = 0, n = d = i = a = void 0;
  }
  function le() {
    return a === void 0 ? o : Y(N());
  }
  function P() {
    var c = N(), h = K(c);
    if (n = arguments, i = this, d = c, h) {
      if (a === void 0)
        return ce(d);
      if (_)
        return clearTimeout(a), a = setTimeout(w, e), H(d);
    }
    return a === void 0 && (a = setTimeout(w, e)), o;
  }
  return P.cancel = ue, P.flush = le, P;
}
var Ot = ge(function(t, e, r, n) {
  fe(t, e, r, n);
});
function xt(t, e, r, n) {
  if (!C(t))
    return t;
  e = me(e, t);
  for (var i = -1, s = e.length, o = s - 1, a = t; a != null && ++i < s; ) {
    var d = ye(e[i]), u = r;
    if (d === "__proto__" || d === "constructor" || d === "prototype")
      return t;
    if (i != o) {
      var E = a[d];
      u = void 0, u === void 0 && (u = C(E) ? E : ve(e[i + 1]) ? [] : {});
    }
    Ee(a, d, u), a = a[d];
  }
  return t;
}
function Dt(t, e, r) {
  return t == null ? t : xt(t, e, r);
}
var G = class extends X {
  static extend(t) {
    Object.getOwnPropertyNames(t.prototype).forEach((e) => {
      e !== "constructor" && (this.prototype[e] = t.prototype[e]);
    }), Object.getOwnPropertyNames(t).forEach((e) => {
      e !== "prototype" && e !== "name" && e !== "length" && (this[e] = t[e]);
    });
  }
};
const D = Symbol("initializers"), te = Symbol("manualInit");
var Ct = class extends X {
  constructor(t) {
    if (super(), this._injector = t, this.constructor[te]) return;
    let e = this, r = Object.getPrototypeOf(this)[D];
    r && r.forEach(function(n) {
      n.apply(e, [t]);
    });
  }
  _initialize(t, ...e) {
  }
  _runInitializers(...t) {
    let e = Object.getPrototypeOf(this)[D];
    e != null && e.length && e.forEach((r) => r.apply(this, t));
  }
  static _enableManualInit() {
    this[te] = !0;
  }
  static extend(t) {
    Object.getOwnPropertyNames(t.prototype).forEach((e) => {
      if (e === "_initialize") {
        let r = this.prototype[D];
        r || (r = [], this.prototype[D] = r), r.push(t.prototype._initialize);
      } else e !== "constructor" && (this.prototype[e] = t.prototype[e]);
    }), Object.getOwnPropertyNames(t).forEach((e) => {
      e !== "prototype" && e !== "name" && e !== "length" && (this[e] = t[e]);
    });
  }
};
function l(t, e) {
  return function(r, n) {
    e(r, n, t);
  };
}
function R(t, e, r, n) {
  var i = arguments.length, s = i < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, r) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") s = Reflect.decorate(t, e, r, n);
  else for (var a = t.length - 1; a >= 0; a--) (o = t[a]) && (s = (i < 3 ? o(s) : i > 3 ? o(e, r, s) : o(e, r)) || s);
  return i > 3 && s && Object.defineProperty(e, r, s), s;
}
var A;
let W = A = class extends G {
  constructor(t, e) {
    super(), this._blob = t, this._injector = e;
  }
  copyBlob() {
    return this._injector.createInstance(A, this._blob);
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
W = A = R([l(1, f(T))], W);
function S(t) {
  "@babel/helpers - typeof";
  return S = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, S(t);
}
function St(t, e) {
  if (S(t) != "object" || !t) return t;
  var r = t[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(t, e);
    if (S(n) != "object") return n;
    throw TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function Tt(t) {
  var e = St(t, "string");
  return S(e) == "symbol" ? e : e + "";
}
function g(t, e, r) {
  return (e = Tt(e)) in t ? Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = r, t;
}
var ie = class I {
  static get() {
    if (this._instance) return this._instance;
    let e = new I();
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
    for (let e in I.prototype) this[e] = I.prototype[e];
  }
  get AbsoluteRefType() {
    return _e;
  }
  get UniverInstanceType() {
    return z;
  }
  get LifecycleStages() {
    return x;
  }
  get DataValidationType() {
    return be;
  }
  get DataValidationErrorStyle() {
    return xe;
  }
  get DataValidationRenderMode() {
    return Ce;
  }
  get DataValidationOperator() {
    return Se;
  }
  get DataValidationStatus() {
    return Te;
  }
  get CommandType() {
    return Re;
  }
  get BaselineOffset() {
    return we;
  }
  get BooleanNumber() {
    return je;
  }
  get HorizontalAlign() {
    return Oe;
  }
  get TextDecoration() {
    return De;
  }
  get TextDirection() {
    return Ie;
  }
  get VerticalAlign() {
    return Be;
  }
  get WrapStrategy() {
    return Me;
  }
  get BorderType() {
    return He;
  }
  get BorderStyleTypes() {
    return Pe;
  }
  get AutoFillSeries() {
    return Ue;
  }
  get ColorType() {
    return Ne;
  }
  get CommonHideTypes() {
    return $e;
  }
  get CopyPasteType() {
    return ze;
  }
  get DeleteDirection() {
    return Ae;
  }
  get DeveloperMetadataVisibility() {
    return We;
  }
  get Dimension() {
    return Le;
  }
  get Direction() {
    return Ve;
  }
  get InterpolationPointType() {
    return ke;
  }
  get LocaleType() {
    return Fe;
  }
  get MentionType() {
    return Xe;
  }
  get ProtectionType() {
    return qe;
  }
  get RelativeDate() {
    return Ge;
  }
  get SheetTypes() {
    return Ke;
  }
  get ThemeColorType() {
    return Ye;
  }
};
g(ie, "_instance", void 0);
var se = class B {
  static get() {
    if (this._instance) return this._instance;
    let e = new B();
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
    for (let e in B.prototype) this[e] = B.prototype[e];
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
g(se, "_instance", void 0);
let L = class extends G {
  constructor(t, e) {
    super(), this._injector = t, this._lifecycleService = e;
  }
  onStarting(t) {
    return p(this._lifecycleService.lifecycle$.pipe(j((e) => e === x.Starting)).subscribe(t));
  }
  onReady(t) {
    return p(this._lifecycleService.lifecycle$.pipe(j((e) => e === x.Ready)).subscribe(t));
  }
  onRendered(t) {
    return p(this._lifecycleService.lifecycle$.pipe(j((e) => e === x.Rendered)).subscribe(t));
  }
  onSteady(t) {
    return p(this._lifecycleService.lifecycle$.pipe(j((e) => e === x.Steady)).subscribe(t));
  }
  onBeforeUndo(t) {
    return this._injector.get(v).beforeCommandExecuted((e) => {
      if (e.id === m.id) {
        let r = this._injector.get(O).pitchTopUndoElement();
        r && t(r);
      }
    });
  }
  onUndo(t) {
    return this._injector.get(v).onCommandExecuted((e) => {
      if (e.id === m.id) {
        let r = this._injector.get(O).pitchTopUndoElement();
        r && t(r);
      }
    });
  }
  onBeforeRedo(t) {
    return this._injector.get(v).beforeCommandExecuted((e) => {
      if (e.id === y.id) {
        let r = this._injector.get(O).pitchTopRedoElement();
        r && t(r);
      }
    });
  }
  onRedo(t) {
    return this._injector.get(v).onCommandExecuted((e) => {
      if (e.id === y.id) {
        let r = this._injector.get(O).pitchTopRedoElement();
        r && t(r);
      }
    });
  }
};
L = R([l(0, f(T)), l(1, f(q))], L);
let V = class extends Ct {
  constructor(t, e) {
    super(e), this.doc = t;
  }
};
V = R([l(1, f(T))], V);
var Rt = class {
  constructor() {
    g(this, "_eventRegistry", /* @__PURE__ */ new Map()), g(this, "_eventHandlerMap", /* @__PURE__ */ new Map()), g(this, "_eventHandlerRegisted", /* @__PURE__ */ new Map());
  }
  _ensureEventRegistry(t) {
    return this._eventRegistry.has(t) || this._eventRegistry.set(t, new dt()), this._eventRegistry.get(t);
  }
  registerEventHandler(t, e) {
    let r = this._eventHandlerMap.get(t);
    return r ? r.add(e) : this._eventHandlerMap.set(t, /* @__PURE__ */ new Set([e])), this._ensureEventRegistry(t).getData().length && this._initEventHandler(t), p(() => {
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
      e == null || e.set(n, p(n()));
    }));
  }
  addEvent(t, e) {
    return this._ensureEventRegistry(t).add(e), this._initEventHandler(t), p(() => this.removeEvent(t, e));
  }
  fireEvent(t, e) {
    var r;
    return (r = this._eventRegistry.get(t)) == null || r.getData().forEach((n) => {
      n(e);
    }), e.cancel;
  }
};
let k = class extends G {
  constructor(t, e) {
    super(), this._injector = t, this._userManagerService = e;
  }
  getCurrentUser() {
    return this._userManagerService.getCurrentUser();
  }
};
k = R([l(0, f(T)), l(1, f(ut))], k);
var oe = class ae {
  static get() {
    if (this._instance) return this._instance;
    let e = new ae();
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
    return ot;
  }
  get numfmt() {
    return at;
  }
  get tools() {
    return ct;
  }
};
g(oe, "_instance", void 0);
var F;
const $ = Symbol("initializers");
let re = F = class extends X {
  static newAPI(t) {
    return (t instanceof Ze ? t.__getInjector() : t).createInstance(F);
  }
  _initialize(t) {
  }
  static extend(t) {
    Object.getOwnPropertyNames(t.prototype).forEach((e) => {
      if (e === "_initialize") {
        let r = this.prototype[$];
        r || (r = [], this.prototype[$] = r), r.push(t.prototype._initialize);
      } else e !== "constructor" && (this.prototype[e] = t.prototype[e]);
    }), Object.getOwnPropertyNames(t).forEach((e) => {
      e !== "prototype" && e !== "name" && e !== "length" && (this[e] = t[e]);
    });
  }
  constructor(t, e, r, n) {
    super(), this._injector = t, this._commandService = e, this._univerInstanceService = r, this._lifecycleService = n, g(this, "_eventRegistry", new Rt()), g(this, "registerEventHandler", (s, o) => this._eventRegistry.registerEventHandler(s, o)), this.disposeWithMe(this.registerEventHandler(this.Event.LifeCycleChanged, () => p(this._lifecycleService.lifecycle$.subscribe((s) => {
      this.fireEvent(this.Event.LifeCycleChanged, { stage: s });
    })))), this._initUnitEvent(this._injector), this._initBeforeCommandEvent(this._injector), this._initCommandEvent(this._injector), this._injector.onDispose(() => {
      this.dispose();
    });
    let i = Object.getPrototypeOf(this)[$];
    if (i) {
      let s = this;
      i.forEach(function(o) {
        o.apply(s, [t]);
      });
    }
  }
  _initCommandEvent(t) {
    let e = t.get(v);
    this.disposeWithMe(this.registerEventHandler(this.Event.Redo, () => e.onCommandExecuted((r) => {
      let { id: n, type: i, params: s } = r;
      if (r.id === y.id) {
        let o = { id: n, type: i, params: s };
        this.fireEvent(this.Event.Redo, o);
      }
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.Undo, () => e.onCommandExecuted((r) => {
      let { id: n, type: i, params: s } = r;
      if (r.id === m.id) {
        let o = { id: n, type: i, params: s };
        this.fireEvent(this.Event.Undo, o);
      }
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.CommandExecuted, () => e.onCommandExecuted((r, n) => {
      let { id: i, type: s, params: o } = r;
      if (r.id !== y.id && r.id !== m.id) {
        let a = { id: i, type: s, params: o, options: n };
        this.fireEvent(this.Event.CommandExecuted, a);
      }
    })));
  }
  _initBeforeCommandEvent(t) {
    let e = t.get(v);
    this.disposeWithMe(this.registerEventHandler(this.Event.BeforeRedo, () => e.beforeCommandExecuted((r) => {
      let { id: n, type: i, params: s } = r;
      if (r.id === y.id) {
        let o = { id: n, type: i, params: s };
        if (this.fireEvent(this.Event.BeforeRedo, o), o.cancel) throw new U();
      }
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.BeforeUndo, () => e.beforeCommandExecuted((r) => {
      let { id: n, type: i, params: s } = r;
      if (r.id === m.id) {
        let o = { id: n, type: i, params: s };
        if (this.fireEvent(this.Event.BeforeUndo, o), o.cancel) throw new U();
      }
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.BeforeCommandExecute, () => e.beforeCommandExecuted((r, n) => {
      let { id: i, type: s, params: o } = r;
      if (r.id !== y.id && r.id !== m.id) {
        let a = { id: i, type: s, params: o, options: n };
        if (this.fireEvent(this.Event.BeforeCommandExecute, a), a.cancel) throw new U();
      }
    })));
  }
  _initUnitEvent(t) {
    let e = t.get(ne);
    this.disposeWithMe(this.registerEventHandler(this.Event.DocDisposed, () => e.unitDisposed$.subscribe((r) => {
      r.type === z.UNIVER_DOC && this.fireEvent(this.Event.DocDisposed, { unitId: r.getUnitId(), unitType: r.type, snapshot: r.getSnapshot() });
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.DocCreated, () => e.unitAdded$.subscribe((r) => {
      if (r.type === z.UNIVER_DOC) {
        let n = r, i = t.createInstance(V, n);
        this.fireEvent(this.Event.DocCreated, { unitId: r.getUnitId(), type: r.type, doc: i, unit: i });
      }
    })));
  }
  disposeUnit(t) {
    return this._univerInstanceService.disposeUnit(t);
  }
  getCurrentLifecycleStage() {
    return this._injector.get(q).stage;
  }
  undo() {
    return this._commandService.executeCommand(m.id);
  }
  redo() {
    return this._commandService.executeCommand(y.id);
  }
  toggleDarkMode(t) {
    this._injector.get(Je).setDarkMode(t);
  }
  loadLocales(t, e) {
    this._injector.get(J).load({ [t]: e });
  }
  setLocale(t) {
    this._injector.get(J).setLocale(t);
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
    return this._injector.createInstance(L);
  }
  get Enum() {
    return ie.get();
  }
  get Event() {
    return se.get();
  }
  get Util() {
    return oe.get();
  }
  addEvent(t, e) {
    if (!t || !e) throw Error("Cannot add empty event");
    return this._eventRegistry.addEvent(t, e);
  }
  fireEvent(t, e) {
    return this._eventRegistry.fireEvent(t, e);
  }
  getUserManager() {
    return this._injector.createInstance(k);
  }
  newBlob() {
    return this._injector.createInstance(W, null);
  }
  newRichText(t) {
    return Qe.create(t);
  }
  newRichTextValue(t) {
    return et.create(t);
  }
  newParagraphStyle(t) {
    return tt.create(t);
  }
  newParagraphStyleValue(t) {
    return rt.create(t);
  }
  newTextStyle(t) {
    return nt.create(t);
  }
  newTextStyleValue(t) {
    return it.create(t);
  }
  newTextDecoration(t) {
    return new st(t);
  }
};
re = F = R([l(0, f(T)), l(1, v), l(2, ne), l(3, f(q))], re);
export {
  re as $,
  G as F,
  ie as G,
  W as H,
  se as K,
  Ct as R,
  oe as X,
  jt as d,
  Ot as m,
  L as q,
  Dt as s
};
