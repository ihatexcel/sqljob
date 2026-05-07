import { w as j, b4 as E, bg as D, cl as C, q as w, eR as L, bz as q, t as oe, f6 as J, bO as x, fH as ie, aA as ue, gH as ce, bA as i, gj as fe, bn as Z, db as X, gV as me, c5 as de, fg as he, fv as ge, fW as pe, go as ee, gW as be, gO as ve, M as _e, gi as Se, av as ye, bk as I, d5 as $e, b5 as te, bm as we } from "./sqljob-Ckiwm-yX.js";
import { Y as P, Z as W, hy as B, c as Re, gw as K, ic as z, $ as re, Q as xe, e as Ce, r as H, t as Me, B as Ee, V as Ne, a as Ie, b as Ve, P as Ue, K as Oe } from "./sqljob-ClRmJtPV.js";
import { Q as le, $ as ae } from "./sqljob-D1ZbNYA7.js";
const se = "$.£.¥.¤.֏.؋.৳.฿.៛.₡.₦.₩.₪.₫.€.₭.₮.₱.₲.₴.₸.₹.₺.₼.₽.₾.₿.﷼".split("."), A = /* @__PURE__ */ new Map([[i.EN_US, "$"], [i.RU_RU, "₽"], [i.VI_VN, "₫"], [i.ZH_CN, "¥"], [i.ZH_TW, "NT$"], [i.FR_FR, "€"], [i.FA_IR, "﷼"], [i.KO_KR, "₩"], [i.ES_ES, "€"], [i.CA_ES, "€"], [i.SK_SK, "€"]]);
function ke(e) {
  switch (e) {
    case i.CA_ES:
    case i.ES_ES:
    case i.FR_FR:
    case i.SK_SK:
      return { icon: "EuroIcon", symbol: A.get(e) || "€", locale: e };
    case i.RU_RU:
      return { icon: "RoubleIcon", symbol: A.get(e) || "₽", locale: e };
    case i.ZH_CN:
      return { icon: "RmbIcon", symbol: A.get(e) || "¥", locale: e };
    case i.EN_US:
    default:
      return { icon: "DollarIcon", symbol: "$", locale: i.EN_US };
  }
}
function G(e) {
  return A.get(e) || "$";
}
function je(e, t = 2) {
  let r = t;
  t > 127 && (r = 127);
  let l = "";
  return r > 0 && (l = `.${"0".repeat(r)}`), `"${G(e)}"#,##0${l}_);[Red]("${G(e)}"#,##0${l})`;
}
const Ae = [{ label: "1930-08-05", suffix: "yyyy-MM-dd" }, { label: "1930/08/05", suffix: "yyyy/MM/dd" }, { label: "1930年08月05日", suffix: 'yyyy"年"MM"月"dd"日"' }, { label: "08-05", suffix: "MM-dd" }, { label: "8月5日", suffix: 'M"月"d"日"' }, { label: "13:30:30", suffix: "h:mm:ss" }, { label: "13:30", suffix: "h:mm" }, { label: "下午01:30", suffix: "A/P hh:mm" }, { label: "下午1:30", suffix: "A/P h:mm" }, { label: "下午1:30:30", suffix: "A/P h:mm:ss" }, { label: "08-05 下午 01:30", suffix: "MM-dd A/P hh:mm" }], Fe = [{ label: "(1,235)", suffix: "#,##0_);(#,##0)" }, { label: "(1,235) ", suffix: "#,##0_);[Red](#,##0)", color: "red" }, { label: "1,234.56", suffix: "#,##0.00_);#,##0.00" }, { label: "1,234.56", suffix: "#,##0.00_);[Red]#,##0.00", color: "red" }, { label: "-1,234.56", suffix: "#,##0.00_);-#,##0.00" }, { label: "-1,234.56", suffix: "#,##0.00_);[Red]-#,##0.00", color: "red" }], Te = [{ label: (e) => `${e}1,235`, suffix: (e) => `"${e}"#,##0.00_);"${e}"#,##0.00` }, { label: (e) => `${e}1,235`, suffix: (e) => `"${e}"#,##0.00_);[Red]"${e}"#,##0.00`, color: "red" }, { label: (e) => `(${e}1,235)`, suffix: (e) => `"${e}"#,##0.00_);("${e}"#,##0.00)` }, { label: (e) => `(${e}1,235)`, suffix: (e) => `"${e}"#,##0.00_);[Red]("${e}"#,##0.00)`, color: "red" }, { label: (e) => `-${e}1,235`, suffix: (e) => `"${e}"#,##0.00_);-"${e}"#,##0.00` }, { label: (e) => `-${e}1,235`, suffix: (e) => `"${e}"#,##0.00_);[Red]-"${e}"#,##0.00`, color: "red" }], F = (e, t = 0) => {
  var r;
  return e ? (r = ee(e).maxDecimals) == null ? t : r : t;
}, Q = (e) => Array(Math.min(Math.max(0, Number(e)), 30)).fill(0).join(""), T = (e, t) => e.split(";").map((r) => /\.0?/.test(r) ? r.replace(/\.0*/g, `${t > 0 ? "." : ""}${Q(Number(t || 0))}`) : /0([^0]?)|0$/.test(r) ? r.replace(/0([^0]+)|0$/, `0${t > 0 ? "." : ""}${Q(Number(t || 0))}$1`) : r).join(";"), rt = (e) => /\.0?/.test(e) || /0([^0]?)|0$/.test(e), M = { id: "sheet.command.numfmt.set.numfmt", type: j.COMMAND, handler: (e, t) => {
  if (!t) return !1;
  let r = e.get(E), l = e.get(D), n = e.get(oe), s = B(l, t);
  if (!s) return !1;
  let { unitId: a, subUnitId: u, worksheet: h } = s, f = t.values.filter((o) => !!o.pattern), S = t.values.filter((o) => !o.pattern), y = Re(a, u, f), g = { unitId: a, subUnitId: u, ranges: S.map((o) => ({ startColumn: o.col, startRow: o.row, endColumn: o.col, endRow: o.row })) }, _ = [], m = [];
  if (f.length) {
    let o = f.reduce((d, c) => {
      J(c.pattern) && d.setValue(c.row, c.col, { t: w.STRING });
      let $ = h.getCellRaw(c.row, c.col);
      if ($) {
        let U = K($.v);
        U !== $.t && d.setValue(c.row, c.col, { t: U });
      }
      return d;
    }, new x()).getMatrix(), b = new x();
    new x(o).forValue((d, c) => {
      let $ = h.getCellRaw(d, c);
      $ ? b.setValue(d, c, { t: $.t }) : b.setValue(d, c, { t: void 0 });
    }), Object.keys(y.values).forEach((d) => {
      let c = y.values[d];
      c.ranges = z(c.ranges);
    }), _.push({ id: re.id, params: y });
    let v = xe(e, y);
    m.push(...v);
  }
  if (S.length) {
    g.ranges = z(g.ranges);
    let o = S.reduce((d, c) => {
      let $ = h.getCellRaw(c.row, c.col);
      if ($) {
        let U = K($.v);
        U !== $.t && d.setValue(c.row, c.col, { t: U });
      }
      return d;
    }, new x()).getMatrix(), b = new x();
    new x(o).forValue((d, c) => {
      let $ = h.getCellRaw(d, c);
      $ ? b.setValue(d, c, { t: $.t }) : b.setValue(d, c, { t: void 0 });
    }), _.push({ id: Ce.id, params: g }, { id: H.id, params: { unitId: a, subUnitId: u, cellValue: o } });
    let v = Me(e, g);
    m.push({ id: H.id, params: { unitId: a, subUnitId: u, cellValue: b.getMatrix() } }, ...v);
  }
  let p = ie(_, r).result;
  return p && n.pushUndoRedo({ unitID: a, undoMutations: m, redoMutations: _ }), p;
} }, De = { id: "sheet.command.numfmt.add.decimal.command", type: j.COMMAND, handler: async (e) => {
  let t = e.get(E), r = e.get(P), l = e.get(W), n = e.get(D), s = r.getCurrentSelections();
  if (!s || !s.length) return !1;
  let a = B(n);
  if (!a) return !1;
  let { unitId: u, subUnitId: h } = a, f = 0;
  s.forEach((_) => {
    C.foreach(_.range, (m, p) => {
      let o = l.getValue(u, h, m, p);
      if (!o) {
        let v = a.worksheet.getCellRaw(m, p);
        if (!f && v && v.t === w.NUMBER && v.v) {
          let d = /\.(\d*)$/.exec(String(v.v));
          if (d) {
            let c = d[1].length;
            if (!c) return;
            f = Math.max(f, c);
          }
        }
        return;
      }
      let b = F(o.pattern);
      f = b > f ? b : f;
    });
  });
  let S = f + 1, y = T(`0${S > 0 ? ".0" : ""}`, S), g = [];
  return s.forEach((_) => {
    C.foreach(_.range, (m, p) => {
      let o = l.getValue(u, h, m, p);
      if (L(o == null ? void 0 : o.pattern)) g.push({ row: m, col: p, pattern: y });
      else {
        let b = F(o.pattern), v = T(o.pattern, b + 1);
        v !== o.pattern && g.push({ row: m, col: p, pattern: v });
      }
    });
  }), g.length ? await t.executeCommand(M.id, { values: g }) : !1;
} }, Pe = { id: "sheet.command.numfmt.set.currency", type: j.COMMAND, handler: async (e) => {
  let t = e.get(E), r = e.get(P), l = e.get(q), n = r.getCurrentSelections();
  if (!n || !n.length) return !1;
  let s = [], a = je(ke(l.getCurrentLocale()).locale);
  return n.forEach((u) => {
    C.foreach(u.range, (h, f) => {
      s.push({ row: h, col: f, pattern: a, type: "currency" });
    });
  }), await t.executeCommand(M.id, { values: s });
} }, Ke = { id: "sheet.command.numfmt.set.percent", type: j.COMMAND, handler: async (e) => {
  let t = e.get(E), r = e.get(P).getCurrentSelections();
  if (!r || !r.length) return !1;
  let l = [];
  return r.forEach((n) => {
    C.foreach(n.range, (s, a) => {
      l.push({ row: s, col: a, pattern: "0%", type: "percent" });
    });
  }), await t.executeCommand(M.id, { values: l });
} }, He = { id: "sheet.command.numfmt.subtract.decimal.command", type: j.COMMAND, handler: async (e) => {
  let t = e.get(E), r = e.get(P), l = e.get(W), n = e.get(D), s = r.getCurrentSelections();
  if (!s || !s.length) return !1;
  let a = B(n);
  if (!a) return !1;
  let { unitId: u, subUnitId: h } = a, f = 0;
  s.forEach((_) => {
    C.foreach(_.range, (m, p) => {
      let o = l.getValue(u, h, m, p);
      if (!o) {
        let v = a.worksheet.getCellRaw(m, p);
        if (!f && v && v.t === w.NUMBER && v.v) {
          let d = /\.(\d*)$/.exec(String(v.v));
          if (d) {
            let c = d[1].length;
            if (!c) return;
            f = Math.max(f, c);
          }
        }
        return;
      }
      let b = F(o.pattern);
      f = b > f ? b : f;
    });
  });
  let S = f - 1, y = T(`0${S > 0 ? ".0" : "."}`, S), g = [];
  return s.forEach((_) => {
    C.foreach(_.range, (m, p) => {
      let o = l.getValue(u, h, m, p);
      if (L(o == null ? void 0 : o.pattern)) g.push({ row: m, col: p, pattern: y });
      else {
        let b = F(o.pattern);
        g.push({ row: m, col: p, pattern: T(o.pattern, b - 1) });
      }
    });
  }), await t.executeCommand(M.id, { values: g });
} }, Le = "sheets-numfmt.config", Y = {}, lt = (e) => ee(e).type || "unknown", We = (e, t, r = "en") => {
  try {
    let l = be(e, t), n = l ? String(l) : void 0, s = ve(e, t, { locale: r, throws: !1 });
    return t < 0 ? { result: s, color: n } : { result: s };
  } catch (l) {
    console.warn("getPatternPreview error:", e, l);
  }
  return { result: String(t) };
}, Be = (e, t, r) => e === _e ? { result: String(Ve(t)) } : We(e, t, r);
function O(e) {
  "@babel/helpers - typeof";
  return O = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, O(e);
}
function Ze(e, t) {
  if (O(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var l = r.call(e, t);
    if (O(l) != "object") return l;
    throw TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function ze(e) {
  var t = Ze(e, "string");
  return O(t) == "symbol" ? t : t + "";
}
function V(e, t, r) {
  return (t = ze(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function R(e, t) {
  return function(r, l) {
    t(r, l, e);
  };
}
function ne(e, t, r, l) {
  var n = arguments.length, s = n < 3 ? t : l === null ? l = Object.getOwnPropertyDescriptor(t, r) : l, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") s = Reflect.decorate(e, t, r, l);
  else for (var u = e.length - 1; u >= 0; u--) (a = e[u]) && (s = (n < 3 ? a(s) : n > 3 ? a(t, r, s) : a(t, r)) || s);
  return n > 3 && s && Object.defineProperty(t, r, s), s;
}
const Ge = { tl: { size: 6, color: "#409f11" } };
let k = class extends ue {
  constructor(e, t, r, l, n, s, a) {
    super(), this._instanceService = e, this._sheetInterceptorService = t, this._themeService = r, this._commandService = l, this._numfmtService = n, this._localeService = s, this._configService = a, V(this, "_locale$", new ce("en")), V(this, "locale$", this._locale$.asObservable()), this._initInterceptorCellContent();
  }
  get locale() {
    let e = this._locale$.getValue();
    if (e) return e;
    switch (this._localeService.getCurrentLocale()) {
      case i.FR_FR:
        return "fr";
      case i.RU_RU:
        return "ru";
      case i.VI_VN:
        return "vi";
      case i.ZH_CN:
        return "zh-CN";
      case i.KO_KR:
        return "ko";
      case i.ZH_TW:
        return "zh-TW";
      case i.ES_ES:
      case i.CA_ES:
        return "es";
      case i.SK_SK:
        return "sk";
      case i.EN_US:
      case i.FA_IR:
      default:
        return "en";
    }
  }
  _initInterceptorCellContent() {
    let e = new x();
    this.disposeWithMe(fe(this._locale$, this._localeService.currentLocale$).subscribe(() => {
      e.reset();
    })), this.disposeWithMe(this._sheetInterceptorService.intercept(Ee.CELL_CONTENT, { effect: Z.Value | Z.Style, handler: (t, r, l) => {
      if (!t || t.v === void 0 || t.v === null || t.t === w.BOOLEAN || t.t === w.FORCE_STRING) return l(t);
      let n = r.unitId, s = r.subUnitId, a;
      if (t != null && t.s) {
        let m = r.workbook.getStyles().get(t.s);
        m != null && m.n && (a = m.n);
      }
      if (a || (a = this._numfmtService.getValue(n, s, r.row, r.col)), L(a == null ? void 0 : a.pattern) || t.t !== w.NUMBER && K(t.v, t.t) !== w.NUMBER) return l(t);
      let u = t;
      if ((!t || t === r.rawData) && (t = { ...r.rawData }), J(a == null ? void 0 : a.pattern)) {
        var h;
        return (h = this._configService.getConfig("sheets-numfmt.config")) != null && h.disableTextFormatMark ? (t.t = w.STRING, l(t)) : (t.t = w.STRING, t.markers = { ...t == null ? void 0 : t.markers, ...Ge }, l(t));
      }
      let f = "", S = e.getValue(r.row, r.col);
      if (S && S.parameters === `${u.v}_${a == null ? void 0 : a.pattern}`) return l({ ...t, ...S.result });
      let y = Be(a == null ? void 0 : a.pattern, Number(u.v), this.locale);
      if (f = y.result, !f) return l(t);
      let g = { v: f, t: w.NUMBER };
      if (y.color) {
        var _;
        let m = (_ = this._themeService.getColorFromTheme(`${y.color}.500`)) == null ? y.color : _;
        m && (g.interceptorStyle = { cl: { rgb: m } });
      }
      return e.setValue(r.row, r.col, { result: g, parameters: `${u.v}_${a == null ? void 0 : a.pattern}` }), Object.assign(t, g), l(t);
    }, priority: Ne.NUMFMT })), this.disposeWithMe(this._commandService.onCommandExecuted((t) => {
      if (t.id === re.id) {
        let r = t.params;
        Object.keys(r.values).forEach((l) => {
          r.values[l].ranges.forEach((n) => {
            C.foreach(n, (s, a) => {
              e.realDeleteValue(s, a);
            });
          });
        });
      } else if (t.id === H.id) {
        let r = t.params;
        new x(r.cellValue).forValue((l, n) => {
          e.realDeleteValue(l, n);
        });
      }
    })), this.disposeWithMe(this._instanceService.getCurrentTypeOfUnit$(X.UNIVER_SHEET).pipe(Ie((t) => {
      var r;
      return (r = t == null ? void 0 : t.activeSheet$) == null ? Se(null) : r;
    }), me(1)).subscribe(() => e.reset()));
  }
  setNumfmtLocal(e) {
    this._locale$.next(e);
  }
};
k = ne([R(0, D), R(1, I(Oe)), R(2, I($e)), R(3, I(E)), R(4, I(W)), R(5, I(q)), R(6, te)], k);
var Qe = "@univerjs/sheets-numfmt", Ye = "0.19.0";
let N = class extends de {
  constructor(e = Y, t, r, l) {
    super(), this._config = e, this._injector = t, this._configService = r, this._commandService = l;
    let { ...n } = he({}, Y, this._config);
    this._configService.setConfig(Le, n);
  }
  onStarting() {
    ge(this._injector, [[k]]), pe(this._injector, [[k]]), [De, He, Pe, Ke, M].forEach((e) => {
      this.disposeWithMe(this._commandService.registerCommand(e));
    });
  }
};
V(N, "pluginName", "SHEET_NUMFMT_PLUGIN"), V(N, "packageName", Qe), V(N, "version", Ye), V(N, "type", X.UNIVER_SHEET), N = ne([ye(Ue), R(1, I(we)), R(2, te), R(3, E)], N);
const at = (e) => se.find((t) => e.includes(t)), st = () => se.map((e) => ({ label: e, value: e })), nt = (e) => Te.map((t) => ({ label: t.label(e), value: t.suffix(e), color: t.color })), ot = () => Ae.map((e) => ({ label: e.label, value: e.suffix })), it = () => Fe.map((e) => ({ label: e.label, value: e.suffix, color: e.color }));
var qe = class extends le {
  setNumberFormat(e) {
    let t = [], { startColumn: r, startRow: l, endColumn: n, endRow: s } = this._range;
    for (let a = l; a <= s; a++) for (let u = r; u <= n; u++) t.push({ row: a, col: u, pattern: e });
    return this._commandService.syncExecuteCommand(M.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), values: t }), this;
  }
  setNumberFormats(e) {
    let t = [], { startColumn: r, startRow: l, endColumn: n, endRow: s } = this._range;
    for (let u = l; u <= s; u++) for (let h = r; h <= n; h++) {
      var a;
      let f = (a = e[u - l]) == null ? void 0 : a[h - r];
      t.push({ row: u, col: h, pattern: f });
    }
    return this._commandService.syncExecuteCommand(M.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), values: t }), this;
  }
  getNumberFormat() {
    var e, t;
    let r = this.getCellStyle();
    return (e = r == null || (t = r.numberFormat) == null ? void 0 : t.pattern) == null ? "" : e;
  }
  getNumberFormats() {
    return this.getCellStyles().map((e) => e.map((t) => {
      var r, l;
      return (r = t == null || (l = t.numberFormat) == null ? void 0 : l.pattern) == null ? "" : r;
    }));
  }
};
le.extend(qe);
var Je = class extends ae {
  setNumfmtLocal(e) {
    return this._injector.get(k).setNumfmtLocal(e), this;
  }
};
ae.extend(Je);
const ut = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
export {
  N as $,
  A,
  M as B,
  st as D,
  at as E,
  Fe as F,
  Le as G,
  Pe as H,
  Te as I,
  Be as J,
  F as L,
  G as M,
  je as N,
  nt as O,
  Ae as P,
  k as Q,
  Q as R,
  Ke as U,
  De as V,
  He as W,
  it as a,
  se as b,
  ut as f,
  ke as j,
  ot as k,
  We as q,
  rt as v,
  lt as y,
  T as z
};
