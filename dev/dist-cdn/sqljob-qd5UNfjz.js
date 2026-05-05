import { bg as se, db as V, b4 as S, T as j, fV as ct, fk as Be, d6 as $e, d7 as Pt, co as xt, ce as f, gq as T, e7 as gt, cm as O, az as ee, e6 as Fe, f as b, dj as ne, bO as me, dN as be, d0 as He, cx as B, a0 as ze, dO as Le, ay as $, e$ as G, gG as Mt, gH as ae, f_ as P, gI as he, gl as le, dt as jt, gN as mt, b3 as H, de as z, bk as m, bm as E, bb as L, h as Z, bz as _t, ba as wt, bc as Wt } from "./sqljob-Bvaal8oZ.js";
import { $ as kt, G as Dt, K as Nt, R as We, F as De } from "./sqljob-vVRkcy6t.js";
import { fM as Tt, fP as Ot, fQ as Vt, fW as At, fX as Bt, fN as $t, g0 as Ft, fV as Ht, g4 as zt, fU as Lt, fZ as Gt, g1 as Jt, fR as Yt, fO as qt, fY as Kt, fK as Xt, fS as Zt, fL as Qt, g3 as ei, fT as ti, f$ as ii, g5 as ri, S as Ne, gl as si, gk as ni, g8 as oi, gf as ai, ga as hi, gd as li, gh as di, gb as ui, gp as ci, g7 as gi, g9 as mi, gc as _i, ge as wi, gn as ki, go as Si, X as Ii, gm as bi, g6 as Ci, gq as St, f as It, ck as de, eK as Y, dr as Ce, eY as Ge, eV as fe, eB as Je, eU as Ye, e8 as ve, fz as pe, az as fi, hB as vi, fr as pi, fq as Ri, fo as yi, fs as Ei, eH as Ui, ht as ue, et as Te, aK as Pi, eX as xi, dC as K, d_ as Re, fm as bt, d9 as Mi, fD as ji, d2 as Wi, af as Di, b1 as Ni, hi as Ti, hj as qe, e_ as Oi, a7 as Ct, fI as x, bb as M, a$ as ft, eh as vt, ii as Oe, eR as Vi, dT as Ke, ek as Xe, gK as Ai, gC as te, cg as Ze, dn as Bi, cC as $i, eo as Qe, ev as et, eE as ye, fd as Fi, en as tt, h as _e, c3 as it, de as Hi, cx as zi, dW as rt, eu as st, dZ as Li, e5 as we, aC as Gi, eA as Ji, r as nt, eT as Yi, ff as qi, aH as pt, aI as Rt, aJ as yt, ag as Ki, f8 as Xi, eN as Zi, eg as ot, dO as Qi, ex as N, eD as er, n as J, eG as tr, ea as ir, gs as ke, hf as at, dv as rr, ik as sr, ft as nr, f1 as or, b2 as ar, cc as hr, cd as lr, aZ as dr, aY as ur, ao as cr, iu as W, dh as gr, cR as mr, hr as _r, cW as wr, cX as kr, cY as Sr, d as Ir, gj as Ve, c$ as Q, gi as Ae, p as Et, f_ as br, Y as Ut, F as Cr } from "./sqljob-Dc9t4pKa.js";
function X(e) {
  "@babel/helpers - typeof";
  return X = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, X(e);
}
function fr(e, t) {
  if (X(e) != "object" || !e) return e;
  var i = e[Symbol.toPrimitive];
  if (i !== void 0) {
    var r = i.call(e, t);
    if (X(r) != "object") return r;
    throw TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function vr(e) {
  var t = fr(e, "string");
  return X(t) == "symbol" ? t : t + "";
}
function w(e, t, i) {
  return (t = vr(t)) in e ? Object.defineProperty(e, t, { value: i, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = i, e;
}
function u(e, t) {
  return function(i, r) {
    t(i, r, e);
  };
}
function U(e, t, i, r) {
  var s = arguments.length, n = s < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, i) : r, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(e, t, i, r);
  else for (var a = e.length - 1; a >= 0; a--) (o = e[a]) && (n = (s < 3 ? o(n) : s > 3 ? o(t, i, n) : o(t, i)) || n);
  return s > 3 && n && Object.defineProperty(t, i, n), n;
}
function pr(e, t, i) {
  let r = i.getDefinedNameMap(e);
  if (r == null) return t.t("definedName.defaultName") + 1;
  let s = Array.from(Object.values(r)).length + 1, n = t.t("definedName.defaultName") + s;
  if (i.getValueByName(e, n) == null) return n;
  let o = s + 1;
  for (; ; ) {
    let a = t.t("definedName.defaultName") + o;
    if (i.getValueByName(e, a) == null) return a;
    o++;
  }
}
var ge = class {
  constructor() {
    w(this, "_definedNameParam", void 0), this._definedNameParam = { id: gt(10), unitId: "", name: "", formulaOrRefString: "", localSheetId: K };
  }
  setName(e) {
    return this._definedNameParam.name = e, this;
  }
  setFormula(e) {
    return this._definedNameParam.formulaOrRefString = `=${e}`, this;
  }
  setRef(e) {
    return this._definedNameParam.formulaOrRefString = e, this;
  }
  setRefByRange(e, t, i, r) {
    return this._definedNameParam.formulaOrRefString = Oe({ startRow: e, endRow: e + (i ?? 1) - 1, startColumn: t, endColumn: t + (r ?? 1) - 1 }), this;
  }
  setComment(e) {
    return this._definedNameParam.comment = e, this;
  }
  setScopeToWorksheet(e) {
    return this._definedNameParam.localSheetId = e.getSheetId(), this;
  }
  setScopeToWorkbook() {
    return this._definedNameParam.localSheetId = K, this;
  }
  setHidden(e) {
    return this._definedNameParam.hidden = e, this;
  }
  build() {
    return this._definedNameParam;
  }
  load(e) {
    return this._definedNameParam = e, this;
  }
};
let ce = class extends De {
  constructor(e, t, i, r, s, n, o, a, h, l) {
    super(), this._definedNameParam = e, this._injector = t, this._commandService = i, this._permissionService = r, this._worksheetProtectionRuleModel = s, this._rangeProtectionRuleModel = n, this._worksheetProtectionPointRuleModel = o, this._authzIoService = a, this._localeService = h, this._definedNamesService = l;
  }
  _apply() {
    this._definedNameParam.name === "" && (this._definedNameParam.name = pr(this._definedNameParam.unitId, this._localeService, this._definedNamesService)), this._commandService.syncExecuteCommand(Re.id, this._definedNameParam);
  }
  getName() {
    return this._definedNameParam.name;
  }
  setName(e) {
    this._definedNameParam.name = e, this._apply();
  }
  setFormula(e) {
    this._definedNameParam.formulaOrRefString = `=${e}`, this._apply();
  }
  setRef(e) {
    this._definedNameParam.formulaOrRefString = e, this._apply();
  }
  getFormulaOrRefString() {
    return this._definedNameParam.formulaOrRefString;
  }
  setRefByRange(e, t, i, r) {
    this._definedNameParam.formulaOrRefString = Oe({ startRow: e, endRow: e + (i ?? 1) - 1, startColumn: t, endColumn: t + (r ?? 1) - 1 }), this._apply();
  }
  getComment() {
    return this._definedNameParam.comment;
  }
  setComment(e) {
    this._definedNameParam.comment = e, this._apply();
  }
  setScopeToWorksheet(e) {
    this._definedNameParam.localSheetId = e.getSheetId(), this._apply();
  }
  setScopeToWorkbook() {
    this._definedNameParam.localSheetId = K, this._apply();
  }
  setHidden(e) {
    this._definedNameParam.hidden = e, this._apply();
  }
  delete() {
    this._commandService.syncExecuteCommand(gr.id, this._definedNameParam);
  }
  getLocalSheetId() {
    return this._definedNameParam.localSheetId;
  }
  isWorkbookScope() {
    return this._definedNameParam.localSheetId === K;
  }
  toBuilder() {
    let e = this._injector.createInstance(ge);
    return e.load(this._definedNameParam), e;
  }
};
ce = U([u(1, m(E)), u(2, S), u(3, L), u(4, m(Ve)), u(5, m(Q)), u(6, m(Ae)), u(7, m(Z)), u(8, m(_t)), u(9, Et)], ce);
let F = function(e) {
  return e[e.Reader = 0] = "Reader", e[e.Editor = 1] = "Editor", e[e.Owner = 2] = "Owner", e;
}({}), d = function(e) {
  return e.Edit = "WorkbookEdit", e.View = "WorkbookView", e.Print = "WorkbookPrint", e.Export = "WorkbookExport", e.Share = "WorkbookShare", e.CopyContent = "WorkbookCopy", e.DuplicateFile = "WorkbookDuplicate", e.Comment = "WorkbookComment", e.ManageCollaborator = "WorkbookManageCollaborator", e.CreateSheet = "WorkbookCreateSheet", e.DeleteSheet = "WorkbookDeleteSheet", e.RenameSheet = "WorkbookRenameSheet", e.MoveSheet = "WorkbookMoveSheet", e.HideSheet = "WorkbookHideSheet", e.ViewHistory = "WorkbookViewHistory", e.ManageHistory = "WorkbookHistory", e.RecoverHistory = "WorkbookRecoverHistory", e.CreateProtection = "WorkbookCreateProtect", e.InsertRow = "WorkbookInsertRow", e.InsertColumn = "WorkbookInsertColumn", e.DeleteRow = "WorkbookDeleteRow", e.DeleteColumn = "WorkbookDeleteColumn", e.CopySheet = "WorkbookCopySheet", e;
}({}), _ = function(e) {
  return e.Edit = "WorksheetEdit", e.View = "WorksheetView", e.Copy = "WorksheetCopy", e.SetCellValue = "WorksheetSetCellValue", e.SetCellStyle = "WorksheetSetCellStyle", e.SetRowStyle = "WorksheetSetRowStyle", e.SetColumnStyle = "WorksheetSetColumnStyle", e.InsertRow = "WorksheetInsertRow", e.InsertColumn = "WorksheetInsertColumn", e.DeleteRow = "WorksheetDeleteRow", e.DeleteColumn = "WorksheetDeleteColumn", e.Sort = "WorksheetSort", e.Filter = "WorksheetFilter", e.PivotTable = "WorksheetPivotTable", e.InsertHyperlink = "WorksheetInsertHyperlink", e.EditExtraObject = "WorksheetEditExtraObject", e.ManageCollaborator = "WorksheetManageCollaborator", e.DeleteProtection = "WorksheetDeleteProtection", e.SelectProtectedCells = "WorksheetSelectProtectedCells", e.SelectUnProtectedCells = "WorksheetSelectUnProtectedCells", e;
}({}), C = function(e) {
  return e.Edit = "RangeEdit", e.View = "RangeView", e.ManageCollaborator = "RangeManageCollaborator", e.Delete = "RangeDeleteProtection", e;
}({}), A = class extends De {
  constructor(e, t, i, r, s, n, o, a) {
    super(), this._injector = e, this._commandService = t, this._permissionService = i, this._worksheetProtectionRuleModel = r, this._rangeProtectionRuleModel = s, this._worksheetProtectionPointRuleModel = n, this._workbookPermissionService = o, this._authzIoService = a, w(this, "permissionPointsDefinition", mr), w(this, "rangeRuleChangedAfterAuth$", void 0), w(this, "sheetRuleChangedAfterAuth$", void 0), w(this, "unitPermissionInitStateChange$", void 0), this.rangeRuleChangedAfterAuth$ = this._rangeProtectionRuleModel.ruleRefresh$, this.sheetRuleChangedAfterAuth$ = this._worksheetProtectionRuleModel.ruleRefresh$, this.unitPermissionInitStateChange$ = this._workbookPermissionService.unitPermissionInitStateChange$;
  }
  setWorkbookPermissionPoint(e, t, i) {
    let r = new t(e);
    this._permissionService.getPermissionPoint(r.id) || this._permissionService.addPermissionPoint(r), this._permissionService.updatePermissionPoint(r.id, i);
  }
  checkWorkbookPermissionPoint(e, t) {
    let i = new t(e), r = this._permissionService.getPermissionPoint(i.id);
    if (r) return r.value;
  }
  setWorkbookEditPermission(e, t) {
    this.setWorkbookPermissionPoint(e, Ne, t);
  }
  async addWorksheetBasePermission(e, t, i) {
    let r = [];
    if (i != null && i.allowedUsers) {
      let n = await this._authzIoService.listCollaborators({ objectID: e, unitID: e }), o = new Set(i.allowedUsers);
      r = n.filter((h) => {
        var l;
        return o.has(((l = h.subject) == null ? void 0 : l.userID) || h.id);
      }).map((h) => ({ id: h.id, role: F.Editor, subject: h.subject }));
      let a = new Set(r.map((h) => {
        var l;
        return ((l = h.subject) == null ? void 0 : l.userID) || h.id;
      }));
      i.allowedUsers.forEach((h) => {
        a.has(h) || console.error(`User ${h} not found in collaborators list`);
      });
    }
    let s = await this._authzIoService.create({ objectType: T.Worksheet, worksheetObject: { collaborators: r, unitID: e, strategies: [], name: (i == null ? void 0 : i.name) || "", scope: void 0 } });
    if (this._commandService.syncExecuteCommand(Di.id, { unitId: e, subUnitId: t, rule: { permissionId: s, unitType: T.Worksheet, unitId: e, subUnitId: t } })) return s;
  }
  removeWorksheetPermission(e, t) {
    this._commandService.syncExecuteCommand(Ni.id, { unitId: e, subUnitId: t }), [...Ti(), ...qe()].forEach((i) => {
      let r = new i(e, t);
      this._permissionService.updatePermissionPoint(r.id, !0);
    }), this._worksheetProtectionPointRuleModel.deleteRule(e, t);
  }
  async setWorksheetPermissionPoint(e, t, i, r) {
    let s = this._worksheetProtectionRuleModel.getRule(e, t), n;
    if (i === It || i === St) n = s ? s.permissionId : await this.addWorksheetBasePermission(e, t);
    else {
      let a = this._worksheetProtectionPointRuleModel.getRule(e, t);
      a ? n = a.permissionId : (n = await this._authzIoService.create({ objectType: T.Worksheet, worksheetObject: { collaborators: [], unitID: e, strategies: [], name: "", scope: void 0 } }), this._commandService.syncExecuteCommand(Oi.id, { unitId: e, subUnitId: t, rule: { unitId: e, subUnitId: t, permissionId: n } }));
    }
    let o = new i(e, t);
    if (this._permissionService.getPermissionPoint(o.id) || this._permissionService.addPermissionPoint(o), n) {
      let a = o.subType;
      await this._authzIoService.update({ objectType: T.Worksheet, objectID: n, strategies: [{ action: a, role: r ? F.Owner : F.Reader }], unitID: e, share: void 0, name: "", scope: void 0, collaborators: void 0 });
    }
    return this._permissionService.updatePermissionPoint(o.id, r), n;
  }
  checkWorksheetPermissionPoint(e, t, i) {
    let r = new i(e, t), s = this._permissionService.getPermissionPoint(r.id);
    if (s) return s.value;
  }
  async addRangeBaseProtection(e, t, i, r) {
    let s = [];
    if (r != null && r.allowedUsers) {
      let c = await this._authzIoService.listCollaborators({ objectID: e, unitID: e }), g = new Set(r.allowedUsers);
      s = c.filter((k) => {
        var I;
        return g.has(((I = k.subject) == null ? void 0 : I.userID) || k.id);
      }).map((k) => ({ id: k.id, role: F.Editor, subject: k.subject }));
      let R = new Set(s.map((k) => {
        var I;
        return ((I = k.subject) == null ? void 0 : I.userID) || k.id;
      }));
      r.allowedUsers.forEach((k) => {
        R.has(k) || console.error(`User ${k} not found in collaborators list`);
      });
    }
    let n = await this._authzIoService.create({ objectType: T.SelectRange, selectRangeObject: { collaborators: s, unitID: e, name: (r == null ? void 0 : r.name) || "", scope: void 0 } }), o = `ruleId_${gt(6)}`;
    if (this._rangeProtectionRuleModel.getSubunitRuleList(e, t).some((c) => c.ranges.some((g) => i.some((R) => O.intersects(R.getRange(), g))))) throw Error("range protection cannot intersect");
    let a = this._determineRangeViewState(r), h = this._determineRangeEditState(r), l = { unitId: e, subUnitId: t, rules: [{ permissionId: n, unitType: T.SelectRange, unitId: e, subUnitId: t, ranges: i.map((c) => c.getRange()), id: o, description: r == null ? void 0 : r.name, viewState: a, editState: h }] };
    if (this._commandService.syncExecuteCommand(Ct.id, l)) return { permissionId: n, ruleId: o };
  }
  _determineRangeViewState(e) {
    return (e == null ? void 0 : e.allowViewByOthers) === !1 ? x.NoOneElseCanView : x.OthersCanView;
  }
  _determineRangeEditState(e) {
    var t;
    return (e == null ? void 0 : e.allowEdit) === !0 && !(e == null || (t = e.allowedUsers) == null) && t.length ? M.DesignedUserCanEdit : M.OnlyMe;
  }
  removeRangeProtection(e, t, i) {
    this._commandService.syncExecuteCommand(ft.id, { unitId: e, subUnitId: t, ruleIds: i }) && this._rangeProtectionRuleModel.getSubunitRuleList(e, t).length === 0 && (this._worksheetProtectionPointRuleModel.deleteRule(e, t), [...qe()].forEach((r) => {
      let s = new r(e, t);
      this._permissionService.updatePermissionPoint(s.id, s.value);
    }));
  }
  setRangeProtectionPermissionPoint(e, t, i, r, s) {
    let n = new r(e, t, i);
    this._permissionService.getPermissionPoint(n.id) || this._permissionService.addPermissionPoint(n), this._permissionService.updatePermissionPoint(n.id, s);
  }
  setRangeProtectionRanges(e, t, i, r) {
    let s = this._rangeProtectionRuleModel.getRule(e, t, i);
    if (s) {
      if (this._rangeProtectionRuleModel.getSubunitRuleList(e, t).filter((n) => n.id !== i).some((n) => n.ranges.some((o) => r.some((a) => O.intersects(a.getRange(), o))))) throw Error("range protection cannot intersect");
      this._commandService.syncExecuteCommand(vt.id, { unitId: e, subUnitId: t, ruleId: i, rule: { ...s, ranges: r.map((n) => n.getRange()) } });
    }
  }
  getPermissionInfoWithCell(e, t, i, r) {
    let s = jt(i, r), n = this._rangeProtectionRuleModel.getSubunitRuleList(e, t).find((o) => o.ranges.some((a) => O.intersects(s, a)));
    if (n) return { permissionId: n.permissionId, ruleId: n.id };
  }
};
A = U([u(0, m(E)), u(1, S), u(2, L), u(3, m(Ve)), u(4, m(Q)), u(5, m(Ae)), u(6, m(br)), u(7, m(Z))], A);
var Ee;
let Ue = Ee = class {
  constructor(e, t, i, r) {
    this._workbook = e, this._worksheet = t, this._selections = i, this._injector = r;
  }
  getActiveRange() {
    let e = this._selections.find((t) => !!t.primary);
    return e ? this._injector.createInstance(p, this._workbook, this._worksheet, e.range) : null;
  }
  getActiveRangeList() {
    return this._selections.map((e) => this._injector.createInstance(p, this._workbook, this._worksheet, e.range));
  }
  getCurrentCell() {
    let e = this._selections.find((t) => !!t.primary);
    return e ? e.primary : null;
  }
  getActiveSheet() {
    let e = this._injector.createInstance(y, this._workbook);
    return this._injector.createInstance(v, e, this._workbook, this._worksheet);
  }
  updatePrimaryCell(e) {
    let t = this._injector.get(S), i = [], r = !1;
    for (let { range: n, style: o } of this._selections) O.contains(n, e.getRange()) ? (i.push({ range: n, primary: ue(e.getRange(), this._worksheet), style: o }), r = !0) : i.push({ range: n, primary: null, style: o });
    r || (i = [{ range: e.getRange(), primary: ue(e.getRange(), this._worksheet) }]);
    let s = { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), selections: i };
    return t.syncExecuteCommand(Te.id, s), new Ee(this._workbook, this._worksheet, i, this._injector);
  }
  getNextDataRange(e) {
    if (!this._selections.find((i) => !!i.primary)) return null;
    let t = _r(this._selections.concat(), e, this._worksheet);
    return t ? this._injector.createInstance(p, this._workbook, this._worksheet, t) : null;
  }
};
Ue = Ee = U([u(3, m(E))], Ue);
let D = class {
  constructor(e, t, i, r, s, n, o, a, h) {
    this._unitId = e, this._subUnitId = t, this._ruleId = i, this._permissionId = r, this._ranges = s, this._options = n, this._injector = o, this._commandService = a, this._rangeProtectionRuleModel = h;
  }
  get id() {
    return this._ruleId;
  }
  get ranges() {
    return this._ranges;
  }
  get options() {
    return { ...this._options };
  }
  async updateRanges(e) {
    if (!e || e.length === 0) throw Error("Ranges cannot be empty");
    let t = this._rangeProtectionRuleModel.getRule(this._unitId, this._subUnitId, this._ruleId);
    if (!t) throw Error(`Rule ${this._ruleId} not found`);
    if (this._rangeProtectionRuleModel.getSubunitRuleList(this._unitId, this._subUnitId).filter((i) => i.id !== this._ruleId).some((i) => i.ranges.some((r) => e.some((s) => {
      let n = s.getRange();
      return this._rangesIntersect(n, r);
    })))) throw Error("Range protection cannot intersect with other protection rules");
    await this._commandService.executeCommand(vt.id, { unitId: this._unitId, subUnitId: this._subUnitId, ruleId: this._ruleId, rule: { ...t, ranges: e.map((i) => i.getRange()) } }), this._ranges.length = 0, this._ranges.push(...e);
  }
  async remove() {
    await this._commandService.executeCommand(ft.id, { unitId: this._unitId, subUnitId: this._subUnitId, ruleIds: [this._ruleId] });
  }
  _rangesIntersect(e, t) {
    return !(e.endRow < t.startRow || e.startRow > t.endRow || e.endColumn < t.startColumn || e.startColumn > t.endColumn);
  }
};
D = U([u(6, m(E)), u(7, m(S)), u(8, m(Q))], D);
const ie = { [d.Edit]: Ne, [d.View]: ri, [d.Print]: ii, [d.Export]: ti, [d.Share]: ei, [d.CopyContent]: Qt, [d.DuplicateFile]: Zt, [d.Comment]: Xt, [d.ManageCollaborator]: Kt, [d.CreateSheet]: qt, [d.DeleteSheet]: Yt, [d.RenameSheet]: Jt, [d.MoveSheet]: Gt, [d.HideSheet]: Lt, [d.ViewHistory]: zt, [d.ManageHistory]: Ht, [d.RecoverHistory]: Ft, [d.CreateProtection]: $t, [d.InsertRow]: Bt, [d.InsertColumn]: At, [d.DeleteRow]: Vt, [d.DeleteColumn]: Ot, [d.CopySheet]: Tt }, re = { [_.Edit]: It, [_.View]: St, [_.Copy]: Ci, [_.SetCellValue]: bi, [_.SetCellStyle]: Ii, [_.SetRowStyle]: Si, [_.SetColumnStyle]: ki, [_.InsertRow]: wi, [_.InsertColumn]: _i, [_.DeleteRow]: mi, [_.DeleteColumn]: gi, [_.Sort]: ci, [_.Filter]: ui, [_.PivotTable]: di, [_.InsertHyperlink]: li, [_.EditExtraObject]: hi, [_.ManageCollaborator]: ai, [_.DeleteProtection]: oi, [_.SelectProtectedCells]: ni, [_.SelectUnProtectedCells]: si }, q = { [C.Edit]: Ir, [C.View]: Sr, [C.ManageCollaborator]: kr, [C.Delete]: wr };
let Pe = class {
  constructor(e, t, i, r, s, n, o, a) {
    this._worksheet = e, this._injector = t, this._permissionService = i, this._authzIoService = r, this._commandService = s, this._rangeProtectionRuleModel = n, this._worksheetProtectionPointModel = o, this._worksheetProtectionRuleModel = a, w(this, "_permissionSubject", void 0), w(this, "_rangeRulesSubject", void 0), w(this, "permission$", void 0), w(this, "pointChange$", void 0), w(this, "rangeProtectionChange$", void 0), w(this, "rangeProtectionRules$", void 0), w(this, "_unitId", void 0), w(this, "_subUnitId", void 0), w(this, "_subscriptions", []), w(this, "_fPermission", void 0), this._unitId = this._worksheet.getWorkbook().getUnitId(), this._subUnitId = this._worksheet.getSheetId(), this._fPermission = this._injector.createInstance(A), this._permissionSubject = new ae(this._buildSnapshot()), this._rangeRulesSubject = new ae(this._buildRangeProtectionRules()), this.permission$ = this._createPermissionStream(), this.pointChange$ = this._createPointChangeStream(), this.rangeProtectionChange$ = this._createRangeProtectionChangeStream(), this.rangeProtectionRules$ = this._createRangeProtectionRulesStream();
  }
  _createPermissionStream() {
    let e = this._permissionService.permissionPointUpdate$.pipe(P((t) => t.id.includes(this._unitId) && t.id.includes(this._subUnitId))).subscribe(() => {
      this._permissionSubject.next(this._buildSnapshot());
    });
    return this._subscriptions.push(e), this._permissionSubject.asObservable().pipe(he((t, i) => JSON.stringify(t) === JSON.stringify(i)), W({ bufferSize: 1, refCount: !0 }));
  }
  _createPointChangeStream() {
    return this._permissionService.permissionPointUpdate$.pipe(P((e) => e.id.includes(this._unitId) && e.id.includes(this._subUnitId)), le((e) => {
      var t, i;
      let r = this._extractWorksheetPointType(e.id);
      return r ? { point: r, value: (t = e.value) == null ? !1 : t, oldValue: !((i = e.value) != null && i) } : null;
    }), P((e) => e !== null), W({ bufferSize: 1, refCount: !0 }));
  }
  _createRangeProtectionChangeStream() {
    return this._rangeProtectionRuleModel.ruleChange$.pipe(P((e) => e.unitId === this._unitId && e.subUnitId === this._subUnitId), le((e) => {
      let t = this._buildRangeProtectionRules();
      return { type: e.type === "delete" ? "delete" : e.type === "set" ? "update" : "add", rules: t };
    }), W({ bufferSize: 1, refCount: !0 }));
  }
  _createRangeProtectionRulesStream() {
    let e = this._rangeProtectionRuleModel.ruleChange$.pipe(P((t) => t.unitId === this._unitId && t.subUnitId === this._subUnitId)).subscribe(() => {
      this._rangeRulesSubject.next(this._buildRangeProtectionRules());
    });
    return this._subscriptions.push(e), this._rangeRulesSubject.asObservable().pipe(he((t, i) => t.length === i.length ? t.every((r, s) => r.id === i[s].id) : !1), W({ bufferSize: 1, refCount: !0 }));
  }
  _extractWorksheetPointType(e) {
    for (let [t, i] of Object.entries(re)) if (new i(this._unitId, this._subUnitId).id === e) return t;
    return null;
  }
  _getRuleEditPermission(e) {
    var t;
    let i = q[C.Edit];
    if (!i) return !1;
    let r = new i(this._unitId, this._subUnitId, e.permissionId), s = this._permissionService.getPermissionPoint(r.id);
    return (t = s == null ? void 0 : s.value) == null ? !1 : t;
  }
  _buildSnapshot() {
    let e = {};
    for (let t in _) {
      let i = _[t];
      e[i] = this.getPoint(i);
    }
    return e;
  }
  _buildRangeProtectionRules() {
    return this._rangeProtectionRuleModel.getSubunitRuleList(this._unitId, this._subUnitId).map((e) => {
      let t = e.ranges.map((i) => this._worksheet.getRange(i.startRow, i.startColumn, i.endRow - i.startRow + 1, i.endColumn - i.startColumn + 1));
      return this._injector.createInstance(D, this._unitId, this._subUnitId, e.id, e.permissionId, t, { name: e.description || "", allowEdit: this._getRuleEditPermission(e) });
    });
  }
  _buildProtectionRule(e) {
    let t = e.ranges.map((r) => this._worksheet.getRange(r)), i = { name: e.description || "", allowViewByOthers: e.viewState !== x.NoOneElseCanView };
    return e.editState === M.DesignedUserCanEdit ? i.allowEdit = !0 : i.allowEdit = !1, this._injector.createInstance(D, this._unitId, this._subUnitId, e.id, e.permissionId, t, i);
  }
  debugCellPermission(e, t) {
    let i = this._fPermission.getPermissionInfoWithCell(this._unitId, this._subUnitId, e, t);
    if (!i) return;
    let { ruleId: r } = i, s = this._rangeProtectionRuleModel.getRule(this._unitId, this._subUnitId, r);
    if (s) return this._buildProtectionRule(s);
  }
  async protect(e) {
    if (this.isProtected()) throw Error("Worksheet is already protected. Call unprotect() first.");
    let t = await this._fPermission.addWorksheetBasePermission(this._unitId, this._subUnitId, e);
    if (!t) throw Error("Failed to create worksheet protection");
    return t;
  }
  async unprotect() {
    if (!this.isProtected()) return;
    this._fPermission.removeWorksheetPermission(this._unitId, this._subUnitId);
    let e = this._buildSnapshot();
    this._permissionSubject.next(e);
  }
  isProtected() {
    return !!this._worksheetProtectionRuleModel.getRule(this._unitId, this._subUnitId);
  }
  async setMode(e) {
    let t = this._getModePermissions(e);
    await this._batchSetPermissionPoints(t);
  }
  _getModePermissions(e) {
    let t = {};
    switch (Object.values(_).forEach((i) => {
      t[i] = !1;
    }), e) {
      case "editable":
        Object.values(_).forEach((i) => {
          t[i] = !0;
        });
        break;
      case "readOnly":
        t[_.View] = !0;
        break;
      case "filterOnly":
        t[_.View] = !0, t[_.Sort] = !0, t[_.Filter] = !0;
        break;
    }
    return t;
  }
  async _batchSetPermissionPoints(e) {
    let t = [];
    for (let [i, r] of Object.entries(e)) {
      let s = i, n = re[s];
      if (!n) throw Error(`Unknown worksheet permission point: ${s}`);
      let o = this.getPoint(s);
      o !== r && (await this._fPermission.setWorksheetPermissionPoint(this._unitId, this._subUnitId, n, r), t.push({ point: s, value: r, oldValue: o }));
    }
    if (t.length > 0) {
      let i = this._buildSnapshot();
      this._permissionSubject.next(i);
    }
  }
  async setReadOnly() {
    await this.setMode("readOnly");
  }
  async setEditable() {
    await this.setMode("editable");
  }
  canEdit() {
    return this.getPoint(_.Edit);
  }
  canEditCell(e, t) {
    if (!this.canEdit()) return !1;
    let i = this._rangeProtectionRuleModel.getSubunitRuleList(this._unitId, this._subUnitId);
    for (let r of i) for (let s of r.ranges) if (e >= s.startRow && e <= s.endRow && t >= s.startColumn && t <= s.endColumn) return this._getRuleEditPermission(r);
    return !0;
  }
  canViewCell(e, t) {
    return this.getPoint(_.View);
  }
  async setPoint(e, t) {
    let i = re[e];
    if (!i) throw Error(`Unknown worksheet permission point: ${e}`);
    if (this.getPoint(e) === t) return;
    await this._fPermission.setWorksheetPermissionPoint(this._unitId, this._subUnitId, i, t);
    let r = this._buildSnapshot();
    this._permissionSubject.next(r);
  }
  getPoint(e) {
    var t;
    let i = re[e];
    if (!i) throw Error(`Unknown worksheet permission point: ${e}`);
    let r = new i(this._unitId, this._subUnitId), s = this._permissionService.getPermissionPoint(r.id);
    return (t = s == null ? void 0 : s.value) == null ? !0 : t;
  }
  getSnapshot() {
    return this._buildSnapshot();
  }
  async applyConfig(e) {
    if (e.mode && await this.setMode(e.mode), e.points) for (let [t, i] of Object.entries(e.points)) typeof i == "boolean" && await this.setPoint(t, i);
    if (e.rangeProtections && e.rangeProtections.length > 0) {
      let t = e.rangeProtections.map((i) => ({ ranges: i.rangeRefs.map((r) => this._worksheet.getRange(r)), options: i.options }));
      await this.protectRanges(t);
    }
  }
  async protectRanges(e) {
    if (!e || e.length === 0) throw Error("Configs cannot be empty");
    let t = [];
    e.some((s) => {
      var n;
      return (n = s.options) == null || (n = n.allowedUsers) == null ? void 0 : n.length;
    }) && (t = await this._authzIoService.listCollaborators({ objectID: this._unitId, unitID: this._unitId }));
    let i = await Promise.all(e.map((s) => {
      var n, o;
      let a = [];
      if ((n = s.options) != null && n.allowedUsers) {
        let h = new Set(s.options.allowedUsers);
        a = t.filter((c) => {
          var g;
          return h.has(((g = c.subject) == null ? void 0 : g.userID) || c.id);
        }).map((c) => ({ id: c.id, role: mt.Editor, subject: c.subject }));
        let l = new Set(a.map((c) => {
          var g;
          return ((g = c.subject) == null ? void 0 : g.userID) || c.id;
        }));
        s.options.allowedUsers.forEach((c) => {
          l.has(c) || console.error(`User ${c} not found in collaborators list`);
        });
      }
      return this._authzIoService.create({ objectType: T.SelectRange, selectRangeObject: { collaborators: a, unitID: this._unitId, name: ((o = s.options) == null ? void 0 : o.name) || "", scope: void 0 } });
    })), r = e.map((s, n) => {
      var o;
      let a = this._determineViewState(s.options), h = this._determineEditState(s.options);
      return { permissionId: i[n], unitType: T.SelectRange, unitId: this._unitId, subUnitId: this._subUnitId, ranges: s.ranges.map((l) => l.getRange()), id: this._rangeProtectionRuleModel.createRuleId(this._unitId, this._subUnitId), description: ((o = s.options) == null ? void 0 : o.name) || "", viewState: a, editState: h };
    });
    if (!await this._commandService.executeCommand(Ct.id, { unitId: this._unitId, subUnitId: this._subUnitId, rules: r })) throw Error("Failed to create range protection rules");
    return await Promise.all(e.map((s, n) => this._setPermissionPoints(i[n], s.options))), r.map((s, n) => this._injector.createInstance(D, this._unitId, this._subUnitId, s.id, s.permissionId, e[n].ranges, e[n].options || {}));
  }
  _determineViewState(e) {
    return (e == null ? void 0 : e.allowViewByOthers) === !1 ? x.NoOneElseCanView : x.OthersCanView;
  }
  _determineEditState(e) {
    var t;
    return (e == null ? void 0 : e.allowEdit) === !0 && !(e == null || (t = e.allowedUsers) == null) && t.length ? M.DesignedUserCanEdit : M.OnlyMe;
  }
  async _setPermissionPoints(e, t) {
    if (!t) return;
    let i = (r, s) => r === void 0 ? s : typeof r == "boolean" ? r : !0;
    await this._setPermissionPoint(e, C.Edit, i(t.allowEdit, !1)), await this._setPermissionPoint(e, C.View, i(t.allowViewByOthers, !0));
  }
  async _setPermissionPoint(e, t, i) {
    let r = q[t];
    r && this._fPermission.setRangeProtectionPermissionPoint(this._unitId, this._subUnitId, e, r, i);
  }
  async unprotectRules(e) {
    !e || e.length === 0 || this._fPermission.removeRangeProtection(this._unitId, this._subUnitId, e);
  }
  async listRangeProtectionRules() {
    return this._buildRangeProtectionRules();
  }
  subscribe(e) {
    let t = this.permission$.subscribe(e);
    return () => t.unsubscribe();
  }
  dispose() {
    this._subscriptions.forEach((e) => e.unsubscribe()), this._permissionSubject.complete(), this._rangeRulesSubject.complete();
  }
};
Pe = U([u(1, m(E)), u(2, L), u(3, Z), u(4, S), u(5, m(Q)), u(6, m(Ae)), u(7, m(Ve))], Pe);
function Rr(e) {
  switch (e) {
    case "left":
      return H.LEFT;
    case "center":
      return H.CENTER;
    case "normal":
      return H.RIGHT;
    default:
      throw Error(`Invalid horizontal alignment: ${e}`);
  }
}
function ht(e) {
  switch (e) {
    case H.LEFT:
      return "left";
    case H.CENTER:
      return "center";
    case H.RIGHT:
      return "normal";
    default:
      return "general";
  }
}
function yr(e) {
  switch (e) {
    case "top":
      return z.TOP;
    case "middle":
      return z.MIDDLE;
    case "bottom":
      return z.BOTTOM;
    default:
      throw Error(`Invalid vertical alignment: ${e}`);
  }
}
function lt(e) {
  switch (e) {
    case z.TOP:
      return "top";
    case z.MIDDLE:
      return "middle";
    case z.BOTTOM:
      return "bottom";
    default:
      return "general";
  }
}
function Se(e, t) {
  return { startRow: e.startRow, endRow: e.endRow, startColumn: 0, endColumn: t.getColumnCount() - 1, rangeType: f.ROW };
}
function Ie(e, t) {
  return { startRow: 0, endRow: t.getRowCount() - 1, startColumn: e.startColumn, endColumn: e.endColumn, rangeType: f.COLUMN };
}
var xe;
let v = xe = class extends We {
  constructor(e, t, i, r, s, n, o) {
    super(r), this._fWorkbook = e, this._workbook = t, this._worksheet = i, this._injector = r, this._selectionManagerService = s, this._logService = n, this._commandService = o, w(this, "setActiveSelection", this.setActiveRange);
  }
  dispose() {
    super.dispose(), delete this._fWorkbook, delete this._workbook, delete this._worksheet;
  }
  getSheet() {
    return this._worksheet;
  }
  getInject() {
    return this._injector;
  }
  getWorkbook() {
    return this._workbook;
  }
  getSheetId() {
    return this._worksheet.getSheetId();
  }
  getSheetName() {
    return this._worksheet.getName();
  }
  getSelection() {
    let e = this._selectionManagerService.getCurrentSelections();
    return e ? this._injector.createInstance(Ue, this._workbook, this._worksheet, e) : null;
  }
  getDefaultStyle() {
    return this._worksheet.getDefaultCellStyle();
  }
  getRowDefaultStyle(e, t = !1) {
    return t ? this._worksheet.getRowStyle(e, t) : this._worksheet.getRowStyle(e);
  }
  getColumnDefaultStyle(e, t = !1) {
    return t ? this._worksheet.getColumnStyle(e, t) : this._worksheet.getColumnStyle(e);
  }
  setDefaultStyle(e) {
    let t = this._workbook.getUnitId(), i = this._worksheet.getSheetId();
    return this._commandService.syncExecuteCommand(Vi.id, { unitId: t, subUnitId: i, defaultStyle: e }), this._worksheet.setDefaultCellStyle(e), this;
  }
  setColumnDefaultStyle(e, t) {
    let i = { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), columnData: { [e]: { s: t } } };
    return this._commandService.syncExecuteCommand(Ke.id, i), this;
  }
  setRowDefaultStyle(e, t) {
    let i = { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), rowData: { [e]: { s: t } } };
    return this._commandService.syncExecuteCommand(Xe.id, i), this;
  }
  getRange(e, t, i, r) {
    let s, n;
    if (typeof e == "object") s = e, n = this._worksheet;
    else if (typeof e == "string") {
      let { range: o, sheetName: a } = Ai(e), h = a ? this._workbook.getSheetBySheetName(a) : this._worksheet;
      if (!h) throw Error("Range not found");
      n = h, s = { ...o, unitId: this._workbook.getUnitId(), sheetId: n.getSheetId(), rangeType: f.NORMAL, startRow: o.rangeType === f.COLUMN ? 0 : o.startRow, endRow: o.rangeType === f.COLUMN ? n.getMaxRows() - 1 : o.endRow, startColumn: o.rangeType === f.ROW ? 0 : o.startColumn, endColumn: o.rangeType === f.ROW ? n.getMaxColumns() - 1 : o.endColumn };
    } else if (typeof e == "number" && t !== void 0) n = this._worksheet, s = { startRow: e, endRow: e + (i ?? 1) - 1, startColumn: t, endColumn: t + (r ?? 1) - 1, unitId: this._workbook.getUnitId(), sheetId: this._worksheet.getSheetId() };
    else throw Error("Invalid range specification");
    return this._injector.createInstance(p, this._workbook, n, s);
  }
  getMaxColumns() {
    return this._worksheet.getMaxColumns();
  }
  getMaxRows() {
    return this._worksheet.getMaxRows();
  }
  insertRowAfter(e) {
    return this.insertRowsAfter(e, 1);
  }
  insertRowBefore(e) {
    return this.insertRowsBefore(e, 1);
  }
  insertRows(e, t = 1) {
    return this.insertRowsBefore(e, t);
  }
  insertRowsAfter(e, t) {
    let i = this._workbook.getUnitId(), r = this._worksheet.getSheetId(), s = ee.DOWN, n = e + 1, o = e + t, a = this._worksheet.getColumnCount() - 1, h = te(this._worksheet, n, o, 0, a, !0, e);
    return this._commandService.syncExecuteCommand(Ze.id, { unitId: i, subUnitId: r, direction: s, range: { startRow: n, endRow: o, startColumn: 0, endColumn: a }, cellValue: h }), this;
  }
  insertRowsBefore(e, t) {
    let i = this._workbook.getUnitId(), r = this._worksheet.getSheetId(), s = ee.UP, n = e, o = e + t - 1, a = this._worksheet.getColumnCount() - 1, h = te(this._worksheet, n, o, 0, a, !0, e - 1);
    return this._commandService.syncExecuteCommand(Ze.id, { unitId: i, subUnitId: r, direction: s, range: { startRow: n, endRow: o, startColumn: 0, endColumn: a }, cellValue: h }), this;
  }
  deleteRow(e) {
    return this.deleteRows(e, 1);
  }
  deleteRows(e, t) {
    let i = { startRow: e, endRow: e + t - 1, startColumn: 0, endColumn: this._worksheet.getColumnCount() - 1 };
    return this._commandService.syncExecuteCommand(Bi.id, { range: i, unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId() }), this;
  }
  deleteRowsByPoints(e) {
    return Fe(e).reverse().forEach((t) => {
      this.deleteRows(t[0], t[1] - t[0] + 1);
    }), this;
  }
  moveRows(e, t) {
    let i = this._workbook.getUnitId(), r = this._worksheet.getSheetId(), s = Se(e.getRange(), this._worksheet), n = s, o = { startRow: t, endRow: t, startColumn: s.startColumn, endColumn: s.endColumn };
    return this._commandService.syncExecuteCommand($i.id, { unitId: i, subUnitId: r, range: s, fromRange: n, toRange: o }), this;
  }
  hideRow(e) {
    let t = this._workbook.getUnitId(), i = this._worksheet.getSheetId(), r = Se(e.getRange(), this._worksheet);
    return this._commandService.syncExecuteCommand(Qe.id, { unitId: t, subUnitId: i, ranges: [r] }), this;
  }
  hideRows(e, t = 1) {
    let i = this._workbook.getUnitId(), r = this._worksheet.getSheetId(), s = { startRow: e, endRow: e + t - 1, startColumn: 0, endColumn: this._worksheet.getColumnCount() - 1, rangeType: f.ROW };
    return this._commandService.syncExecuteCommand(Qe.id, { unitId: i, subUnitId: r, ranges: [s] }), this;
  }
  unhideRow(e) {
    let t = this._workbook.getUnitId(), i = this._worksheet.getSheetId(), r = Se(e.getRange(), this._worksheet);
    return this._commandService.syncExecuteCommand(et.id, { unitId: t, subUnitId: i, ranges: [r] }), this;
  }
  showRows(e, t = 1) {
    let i = this._workbook.getUnitId(), r = this._worksheet.getSheetId(), s = { startRow: e, endRow: e + t - 1, startColumn: 0, endColumn: this._worksheet.getColumnCount() - 1, rangeType: f.ROW };
    return this._commandService.syncExecuteCommand(et.id, { unitId: i, subUnitId: r, ranges: [s] }), this;
  }
  setRowHeight(e, t) {
    return this.setRowHeights(e, 1, t);
  }
  autoFitRow(e, t = b.TRUE) {
    let i = this._workbook.getUnitId(), r = this._worksheet.getSheetId(), s = [{ startRow: e, endRow: e, startColumn: 0, endColumn: this._worksheet.getColumnCount() - 1 }];
    return this._commandService.syncExecuteCommand(ye.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), range: s[0], value: ne.WRAP }), this._commandService.syncExecuteCommand(Fi.id, { unitId: i, subUnitId: r, ranges: s, autoHeightInfo: t }), this;
  }
  setRowHeights(e, t, i) {
    let r = this._workbook.getUnitId(), s = this._worksheet.getSheetId(), n = this._worksheet.getRowManager(), o = [], a = [];
    for (let l = e; l < e + t; l++) {
      var h;
      let c = ((h = n.getRow(l)) == null ? void 0 : h.ah) || this._worksheet.getConfig().defaultRowHeight, g = { startRow: l, endRow: l, startColumn: 0, endColumn: this._worksheet.getColumnCount() - 1 };
      i <= c ? o.push(g) : a.push(g);
    }
    return a.length > 0 && this._commandService.syncExecuteCommand(tt.id, { unitId: r, subUnitId: s, ranges: a, value: i }), o.length > 0 && this._commandService.syncExecuteCommand(_e.id, { unitId: r, subUnitId: s, ranges: o }), this;
  }
  getRowHeight(e) {
    return this._worksheet.getRowHeight(e);
  }
  setRowAutoHeight(e, t) {
    let i = this._workbook.getUnitId(), r = this._worksheet.getSheetId(), s = [{ startRow: e, endRow: e + t - 1, startColumn: 0, endColumn: this._worksheet.getColumnCount() - 1 }];
    return this._commandService.syncExecuteCommand(_e.id, { unitId: i, subUnitId: r, ranges: s }), this;
  }
  setRangesAutoHeight(e) {
    let t = this._workbook.getUnitId(), i = this._worksheet.getSheetId();
    return this._commandService.syncExecuteCommand(_e.id, { unitId: t, subUnitId: i, ranges: e }), this;
  }
  setRowHeightsForced(e, t, i) {
    let r = this._workbook.getUnitId(), s = this._worksheet.getSheetId(), n = [{ startRow: e, endRow: e + t - 1, startColumn: 0, endColumn: this._worksheet.getColumnCount() - 1 }];
    return this._commandService.syncExecuteCommand(tt.id, { unitId: r, subUnitId: s, ranges: n, value: i }), this;
  }
  setRowCustom(e) {
    let t = this._workbook.getUnitId(), i = this._worksheet.getSheetId(), r = {};
    for (let [n, o] of Object.entries(e)) r[Number(n)] = { custom: o };
    let s = { unitId: t, subUnitId: i, rowData: r };
    return this._commandService.syncExecuteCommand(Xe.id, s), this;
  }
  insertColumnAfter(e) {
    return this.insertColumnsAfter(e, 1);
  }
  insertColumnBefore(e) {
    return this.insertColumnsBefore(e, 1);
  }
  insertColumns(e, t = 1) {
    return this.insertColumnsBefore(e, t);
  }
  insertColumnsAfter(e, t) {
    let i = this._workbook.getUnitId(), r = this._worksheet.getSheetId(), s = ee.RIGHT, n = this._worksheet.getRowCount() - 1, o = e + 1, a = e + t, h = te(this._worksheet, 0, n, o, a, !1, e);
    return this._commandService.syncExecuteCommand(it.id, { unitId: i, subUnitId: r, direction: s, range: { startRow: 0, endRow: n, startColumn: o, endColumn: a }, cellValue: h }), this;
  }
  insertColumnsBefore(e, t) {
    let i = this._workbook.getUnitId(), r = this._worksheet.getSheetId(), s = ee.LEFT, n = this._worksheet.getRowCount() - 1, o = e, a = e + t - 1, h = te(this._worksheet, 0, n, o, a, !1, e - 1);
    return this._commandService.syncExecuteCommand(it.id, { unitId: i, subUnitId: r, direction: s, range: { startRow: 0, endRow: n, startColumn: o, endColumn: a }, cellValue: h }), this;
  }
  deleteColumn(e) {
    return this.deleteColumns(e, 1);
  }
  deleteColumns(e, t) {
    let i = { startRow: 0, endRow: this._worksheet.getRowCount() - 1, startColumn: e, endColumn: e + t - 1 };
    return this._commandService.syncExecuteCommand(Hi.id, { range: i, unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId() }), this;
  }
  deleteColumnsByPoints(e) {
    return Fe(e).reverse().forEach((t) => {
      this.deleteColumns(t[0], t[1] - t[0] + 1);
    }), this;
  }
  moveColumns(e, t) {
    let i = this._workbook.getUnitId(), r = this._worksheet.getSheetId(), s = Ie(e.getRange(), this._worksheet), n = s, o = { startRow: 0, endRow: this._worksheet.getRowCount() - 1, startColumn: t, endColumn: t };
    return this._commandService.syncExecuteCommand(zi.id, { unitId: i, subUnitId: r, range: s, fromRange: n, toRange: o }), this;
  }
  hideColumn(e) {
    let t = this._workbook.getUnitId(), i = this._worksheet.getSheetId(), r = Ie(e.getRange(), this._worksheet);
    return this._commandService.syncExecuteCommand(rt.id, { unitId: t, subUnitId: i, ranges: [r] }), this;
  }
  hideColumns(e, t = 1) {
    let i = this._workbook.getUnitId(), r = this._worksheet.getSheetId(), s = { startRow: 0, endRow: this._worksheet.getRowCount() - 1, startColumn: e, endColumn: e + t - 1, rangeType: f.COLUMN };
    return this._commandService.syncExecuteCommand(rt.id, { unitId: i, subUnitId: r, ranges: [s] }), this;
  }
  unhideColumn(e) {
    let t = this._workbook.getUnitId(), i = this._worksheet.getSheetId(), r = Ie(e.getRange(), this._worksheet);
    return this._commandService.syncExecuteCommand(st.id, { unitId: t, subUnitId: i, ranges: [r] }), this;
  }
  showColumns(e, t = 1) {
    let i = this._workbook.getUnitId(), r = this._worksheet.getSheetId(), s = { startRow: 0, endRow: this._worksheet.getRowCount() - 1, startColumn: e, endColumn: e + t - 1, rangeType: f.COLUMN };
    return this._commandService.syncExecuteCommand(st.id, { unitId: i, subUnitId: r, ranges: [s] }), this;
  }
  setColumnWidth(e, t) {
    return this.setColumnWidths(e, 1, t);
  }
  setColumnWidths(e, t, i) {
    let r = this._workbook.getUnitId(), s = this._worksheet.getSheetId(), n = [{ startColumn: e, endColumn: e + t - 1, startRow: 0, endRow: this._worksheet.getRowCount() - 1 }];
    return this._commandService.syncExecuteCommand(Li.id, { unitId: r, subUnitId: s, ranges: n, value: i }), this;
  }
  getColumnWidth(e) {
    return this._worksheet.getColumnWidth(e);
  }
  setColumnCustom(e) {
    let t = this._workbook.getUnitId(), i = this._worksheet.getSheetId(), r = {};
    for (let [n, o] of Object.entries(e)) r[Number(n)] = { custom: o };
    let s = { unitId: t, subUnitId: i, columnData: r };
    return this._commandService.syncExecuteCommand(Ke.id, s), this;
  }
  getMergeData() {
    return this._worksheet.getMergeData().map((e) => this._injector.createInstance(p, this._workbook, this._worksheet, e));
  }
  getMergedRanges() {
    return this._worksheet.getSnapshot().mergeData.map((e) => this._injector.createInstance(p, this._workbook, this._worksheet, e));
  }
  getCellMergeData(e, t) {
    let i = this._worksheet.getMergedCell(e, t);
    if (i) return this._injector.createInstance(p, this._workbook, this._worksheet, i);
  }
  getActiveRange() {
    return this._fWorkbook.getActiveRange();
  }
  setActiveRange(e) {
    let { unitId: t, sheetId: i } = e.getRange();
    if (t !== this._workbook.getUnitId() || i !== this._worksheet.getSheetId()) throw Error("Specified range must be part of the sheet.");
    return this._fWorkbook.setActiveRange(e), this;
  }
  getActiveCell() {
    return this._fWorkbook.getActiveCell();
  }
  setFreeze(e) {
    return this._logService.warn("setFreeze is deprecated, use setFrozenRows and setFrozenColumns instead"), this._commandService.syncExecuteCommand(we.id, { ...e, unitId: this._workbook.getUnitId(), subUnitId: this.getSheetId() }), this;
  }
  cancelFreeze() {
    return this._commandService.syncExecuteCommand(Gi.id, { unitId: this._workbook.getUnitId(), subUnitId: this.getSheetId() }), this;
  }
  getFreeze() {
    return this._worksheet.getFreeze();
  }
  setFrozenColumns(...e) {
    let t = this.getFreeze();
    if (arguments.length === 1) {
      let i = e[0];
      this.setFreeze({ ...t, startColumn: i > 0 ? i : -1, xSplit: i });
    } else if (arguments.length === 2) {
      let [i = 0, r = 0] = e;
      i > r && ([i, r] = [r, i]), this._commandService.syncExecuteCommand(we.id, { startColumn: r + 1, xSplit: r - i + 1, startRow: t.startRow, ySplit: t.ySplit, unitId: this._workbook.getUnitId(), subUnitId: this.getSheetId() });
    }
    return this;
  }
  setFrozenRows(...e) {
    let t = this.getFreeze();
    if (arguments.length === 1) {
      let i = e[0];
      this.setFreeze({ ...t, startRow: i > 0 ? i : -1, ySplit: i });
    } else if (arguments.length === 2) {
      let [i = 0, r = 0] = e;
      i > r && ([i, r] = [r, i]), this._commandService.syncExecuteCommand(we.id, { startRow: r + 1, ySplit: r - i + 1, startColumn: t.startColumn, xSplit: t.xSplit, unitId: this._workbook.getUnitId(), subUnitId: this.getSheetId() });
    }
    return this;
  }
  getFrozenColumns() {
    let e = this.getFreeze();
    return e.startColumn === -1 ? 0 : e.startColumn;
  }
  getFrozenRows() {
    let e = this.getFreeze();
    return e.startRow === -1 ? 0 : e.startRow;
  }
  getFrozenRowRange() {
    let e = this._worksheet.getFreeze();
    return { startRow: e.startRow - e.ySplit, endRow: e.startRow - 1 };
  }
  getFrozenColumnRange() {
    let e = this._worksheet.getFreeze();
    return { startColumn: e.startColumn - e.xSplit, endColumn: e.startColumn - 1 };
  }
  hasHiddenGridLines() {
    return this._worksheet.getConfig().showGridlines === b.FALSE;
  }
  setHiddenGridlines(e) {
    return this._commandService.syncExecuteCommand(pe.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), showGridlines: e ? b.FALSE : b.TRUE }), this;
  }
  setGridLinesColor(e) {
    return this._commandService.syncExecuteCommand(ve.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), color: e }), this;
  }
  getGridLinesColor() {
    return this._worksheet.getGridlinesColor();
  }
  setTabColor(e) {
    return this._commandService.syncExecuteCommand(Ji.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), value: e }), this;
  }
  getTabColor() {
    return this._worksheet.getTabColor();
  }
  onCellDataChange(e) {
    return this._injector.get(S).onCommandExecuted((t) => {
      if (t.id === nt.id) {
        let i = t.params;
        i.unitId === this._workbook.getUnitId() && i.subUnitId === this._worksheet.getSheetId() && i.cellValue && e(new me(i.cellValue));
      }
    });
  }
  onBeforeCellDataChange(e) {
    return this._injector.get(S).beforeCommandExecuted((t) => {
      if (t.id === nt.id) {
        let i = t.params;
        i.unitId === this._workbook.getUnitId() && i.subUnitId === this._worksheet.getSheetId() && i.cellValue && e(new me(i.cellValue));
      }
    });
  }
  hideSheet() {
    let e = this._injector.get(S);
    if (this._workbook.getSheets().filter((t) => t.isSheetHidden() !== b.TRUE).length <= 1) throw Error("Cannot hide the only visible sheet");
    return e.syncExecuteCommand(Yi.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId() }), this;
  }
  showSheet() {
    return this._injector.get(S).syncExecuteCommand(qi.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId() }), this;
  }
  isSheetHidden() {
    return this._worksheet.isSheetHidden() === b.TRUE;
  }
  setName(e) {
    return this._commandService.syncExecuteCommand(fe.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), name: e }), this;
  }
  activate() {
    return this._fWorkbook.setActiveSheet(this), this;
  }
  getIndex() {
    return this._workbook.getSheetIndex(this._worksheet);
  }
  clear(e) {
    if (e && e.contentsOnly && !e.formatOnly) return this.clearContents();
    if (e && e.formatOnly && !e.contentsOnly) return this.clearFormats();
    let t = this._workbook.getUnitId(), i = this._worksheet.getSheetId(), r = this._injector.get(S), s = { startRow: 0, endRow: this._worksheet.getRowCount() - 1, startColumn: 0, endColumn: this._worksheet.getColumnCount() - 1 };
    return r.syncExecuteCommand(pt.id, { unitId: t, subUnitId: i, ranges: [s], options: e }), this;
  }
  clearContents() {
    let e = this._workbook.getUnitId(), t = this._worksheet.getSheetId(), i = this._injector.get(S), r = { startRow: 0, endRow: this._worksheet.getRowCount() - 1, startColumn: 0, endColumn: this._worksheet.getColumnCount() - 1 };
    return i.syncExecuteCommand(Rt.id, { unitId: e, subUnitId: t, ranges: [r] }), this;
  }
  clearFormats() {
    let e = this._workbook.getUnitId(), t = this._worksheet.getSheetId(), i = this._injector.get(S), r = { startRow: 0, endRow: this._worksheet.getRowCount() - 1, startColumn: 0, endColumn: this._worksheet.getColumnCount() - 1 };
    return i.syncExecuteCommand(yt.id, { unitId: e, subUnitId: t, ranges: [r] }), this;
  }
  getDataRange() {
    let { startRow: e, endRow: t, startColumn: i, endColumn: r } = this._worksheet.getDataRealRange();
    return this.getRange(e, i, t - e + 1, r - i + 1);
  }
  getLastColumns() {
    return this._worksheet.getLastColumnWithContent();
  }
  getLastColumn() {
    return this._worksheet.getLastColumnWithContent();
  }
  getLastRows() {
    return this._worksheet.getLastRowWithContent();
  }
  getLastRow() {
    return this._worksheet.getLastRowWithContent();
  }
  equalTo(e) {
    return e instanceof xe ? this._worksheet.getSheetId() === e.getSheetId() && this._workbook.getUnitId() === e.getWorkbook().getUnitId() : !1;
  }
  insertDefinedName(e, t) {
    let i = this._injector.createInstance(ge).setName(e).setRef(t).build();
    i.localSheetId = this.getSheetId(), this._fWorkbook.insertDefinedNameBuilder(i);
  }
  getDefinedNames() {
    return this._fWorkbook.getDefinedNames().filter((e) => e.getLocalSheetId() === this.getSheetId());
  }
  setCustomMetadata(e) {
    return this._worksheet.setCustomMetadata(e), this;
  }
  getCustomMetadata() {
    return this._worksheet.getCustomMetadata();
  }
  setRowCustomMetadata(e, t) {
    return this._worksheet.getRowManager().setCustomMetadata(e, t), this;
  }
  setColumnCustomMetadata(e, t) {
    return this._worksheet.getColumnManager().setCustomMetadata(e, t), this;
  }
  getRowCustomMetadata(e) {
    return this._worksheet.getRowManager().getCustomMetadata(e);
  }
  getColumnCustomMetadata(e) {
    return this._worksheet.getColumnManager().getCustomMetadata(e);
  }
  appendRow(e) {
    let t = this._worksheet.getCellMatrix().hasValue(), i = this._worksheet.getLastRowWithContent(), r = this._worksheet.getRowCount(), s = this._worksheet.getColumnCount(), n = t ? i + 1 : i, o = new me();
    for (let a = 0; a < e.length; a++) o.setValue(n, a, be(e[a]));
    return this._commandService.syncExecuteCommand(Ki.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), cellValue: o.getMatrix(), insertRowNums: n > r - 1 ? 1 : 0, insertColumnNums: e.length > s ? e.length - s : 0, maxRows: r, maxColumns: s }), this;
  }
  setRowCount(e) {
    return this._commandService.syncExecuteCommand(Xi.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), rowCount: e }), this;
  }
  setColumnCount(e) {
    return this._commandService.syncExecuteCommand(Zi.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), columnCount: e }), this;
  }
  getWorksheetPermission() {
    return this._injector.createInstance(Pe, this);
  }
};
v = xe = U([u(3, m(E)), u(4, m(Ut)), u(5, m(wt)), u(6, S)], v);
let Me = class {
  constructor(e, t, i, r, s, n, o, a, h) {
    this._unitId = e, this._subUnitId = t, this._range = i, this._worksheet = r, this._injector = s, this._permissionService = n, this._authzIoService = o, this._commandService = a, this._rangeProtectionRuleModel = h, w(this, "_permissionSubject", void 0), w(this, "_subscriptions", []), w(this, "_fPermission", void 0), w(this, "permission$", void 0), w(this, "protectionChange$", void 0), this._fPermission = this._injector.createInstance(A), this._permissionSubject = new ae(this._buildSnapshot()), this.permission$ = this._createPermissionStream(), this.protectionChange$ = this._createProtectionChangeStream();
  }
  _createPermissionStream() {
    let e = this._permissionService.permissionPointUpdate$.pipe(P((t) => {
      let i = t.id;
      return i.includes(this._unitId) && i.includes(this._subUnitId);
    })).subscribe(() => {
      this._permissionSubject.next(this._buildSnapshot());
    });
    return this._subscriptions.push(e), this._permissionSubject.asObservable().pipe(he((t, i) => JSON.stringify(t) === JSON.stringify(i)), W({ bufferSize: 1, refCount: !0 }));
  }
  _createProtectionChangeStream() {
    return this._rangeProtectionRuleModel.ruleChange$.pipe(P((e) => e.unitId !== this._unitId || e.subUnitId !== this._subUnitId ? !1 : e.type === "delete" || e.type === "add" ? this._rangeMatches(e.rule) : !1), le((e) => (this._permissionSubject.next(this._buildSnapshot()), e.type === "delete" ? { type: "unprotected", ruleId: e.rule.id } : { type: "protected", rule: this._createFacadeRule(e.rule) })), W({ bufferSize: 1, refCount: !0 }));
  }
  _rangeMatches(e) {
    let t = this._range.getRange();
    return e.ranges.some((i) => t.startRow === i.startRow && t.startColumn === i.startColumn && t.endRow === i.endRow && t.endColumn === i.endColumn);
  }
  _createFacadeRule(e) {
    let t = e.ranges.map((r) => this._worksheet.getRange(r.startRow, r.startColumn, r.endRow - r.startRow + 1, r.endColumn - r.startColumn + 1)), i = { name: e.description || "", allowViewByOthers: e.viewState !== x.NoOneElseCanView, allowEdit: e.editState === M.DesignedUserCanEdit };
    return this._injector.createInstance(D, this._unitId, this._subUnitId, e.id, e.permissionId, t, i);
  }
  getPoint(e) {
    let t = q[e];
    if (!t) return console.warn(`Unknown permission point: ${e}`), !1;
    let i = this._getProtectionRule();
    if (i) {
      let r = new t(this._unitId, this._subUnitId, i.permissionId), s = this._permissionService.getPermissionPoint(r.id);
      if (s) return s.value;
    }
    return !0;
  }
  getSnapshot() {
    return this._buildSnapshot();
  }
  isProtected() {
    return this._getProtectionRule() !== null;
  }
  canEdit() {
    return this.getPoint(C.Edit);
  }
  canView() {
    return this.getPoint(C.View);
  }
  canManageCollaborator() {
    return this.getPoint(C.ManageCollaborator);
  }
  canDelete() {
    return this.getPoint(C.Delete);
  }
  async setPoint(e, t) {
    let i = q[e];
    if (!i) throw Error(`Unknown permission point: ${e}`);
    let r = this._getProtectionRule();
    if (!r) throw Error("Cannot set permission point: No protection rule exists for this range. Call protect() first.");
    if (this.getPoint(e) === t) return;
    let s = r.permissionId;
    this._fPermission.setRangeProtectionPermissionPoint(this._unitId, this._subUnitId, s, i, t), this._permissionSubject.next(this._buildSnapshot());
  }
  async protect(e) {
    if (this.isProtected()) throw Error("Range is already protected");
    let t = await this._fPermission.addRangeBaseProtection(this._unitId, this._subUnitId, [this._range], e);
    if (!t) throw Error("Failed to create range protection");
    let { permissionId: i, ruleId: r } = t;
    return await this._setPermissionPoints(i, e), this._injector.createInstance(D, this._unitId, this._subUnitId, r, i, [this._range], e || {});
  }
  _determineViewState(e) {
    return (e == null ? void 0 : e.allowViewByOthers) === !1 ? x.NoOneElseCanView : x.OthersCanView;
  }
  _determineEditState(e) {
    var t;
    return (e == null ? void 0 : e.allowEdit) === !0 && !(e == null || (t = e.allowedUsers) == null) && t.length ? M.DesignedUserCanEdit : M.OnlyMe;
  }
  async _setPermissionPoints(e, t) {
    if (!t) return;
    let i = (r, s) => r === void 0 ? s : typeof r == "boolean" ? r : !0;
    await this._setPermissionPoint(e, C.Edit, i(t.allowEdit, !1)), await this._setPermissionPoint(e, C.View, i(t.allowViewByOthers, !0));
  }
  async _setPermissionPoint(e, t, i) {
    let r = q[t];
    r && this._fPermission.setRangeProtectionPermissionPoint(this._unitId, this._subUnitId, e, r, i);
  }
  async unprotect() {
    let e = this._getProtectionRule();
    if (!e) return;
    let t = e.id;
    this._fPermission.removeRangeProtection(this._unitId, this._subUnitId, [t]);
  }
  async listRules() {
    return await this._buildProtectionRulesAsync();
  }
  subscribe(e) {
    let t = this.permission$.subscribe(e);
    return () => t.unsubscribe();
  }
  _getProtectionRule() {
    let e = this._rangeProtectionRuleModel.getSubunitRuleList(this._unitId, this._subUnitId), t = this._range.getRange();
    for (let i of e) for (let r of i.ranges) if (t.startRow === r.startRow && t.startColumn === r.startColumn && t.endRow === r.endRow && t.endColumn === r.endColumn) return i;
    return null;
  }
  _buildProtectionRules() {
    return this._rangeProtectionRuleModel.getSubunitRuleList(this._unitId, this._subUnitId).map((e) => {
      let t = e.ranges.map((r) => this._worksheet.getRange(r.startRow, r.startColumn, r.endRow - r.startRow + 1, r.endColumn - r.startColumn + 1)), i = { name: e.description || "", allowViewByOthers: e.viewState !== x.NoOneElseCanView };
      return e.editState === M.DesignedUserCanEdit ? i.allowEdit = !0 : i.allowEdit = !1, this._injector.createInstance(D, this._unitId, this._subUnitId, e.id, e.permissionId, t, i);
    });
  }
  async _buildProtectionRulesAsync() {
    let e = this._rangeProtectionRuleModel.getSubunitRuleList(this._unitId, this._subUnitId);
    return (await Promise.all(e.map(async (t) => {
      let i = t.ranges.map((s) => this._worksheet.getRange(s.startRow, s.startColumn, s.endRow - s.startRow + 1, s.endColumn - s.startColumn + 1)), r = { name: t.description || "", allowViewByOthers: t.viewState !== x.NoOneElseCanView };
      if (t.editState === M.DesignedUserCanEdit) try {
        r.allowEdit = (await this._authzIoService.listCollaborators({ objectID: t.permissionId, unitID: this._unitId })).filter((s) => s.role === mt.Editor).map((s) => {
          var n;
          return ((n = s.subject) == null ? void 0 : n.userID) || s.id;
        }).length > 0;
      } catch (s) {
        console.warn(`Failed to fetch collaborators for rule ${t.id}:`, s), r.allowEdit = !1;
      }
      else r.allowEdit = !1;
      return { rule: t, ranges: i, options: r };
    }))).map(({ rule: t, ranges: i, options: r }) => this._injector.createInstance(D, this._unitId, this._subUnitId, t.id, t.permissionId, i, r));
  }
  _buildSnapshot() {
    let e = {};
    return Object.values(C).forEach((t) => {
      e[t] = this.getPoint(t);
    }), e;
  }
  dispose() {
    this._subscriptions.forEach((e) => e.unsubscribe()), this._permissionSubject.complete();
  }
};
Me = U([u(4, m(E)), u(5, m(L)), u(6, m(Z)), u(7, m(S)), u(8, m(Q))], Me);
var oe, dt;
let p = oe = class extends We {
  constructor(e, t, i, r, s, n) {
    super(r), this._workbook = e, this._worksheet = t, this._range = i, this._injector = r, this._commandService = s, this._formulaDataModel = n;
    let o = this._worksheet.getRowCount(), a = this._worksheet.getColumnCount();
    if (this._range.startRow < 0 || this._range.startColumn < 0 || this._range.endRow >= o || this._range.endColumn >= a) throw Error(`Range is out of bounds. Max rows: ${o}, Max columns: ${a}, Given range: ${JSON.stringify(this._range)}`);
    this._runInitializers(this._injector, this._workbook, this._worksheet, this._range, this._commandService, this._formulaDataModel);
  }
  getUnitId() {
    return this._workbook.getUnitId();
  }
  getSheetName() {
    return this._worksheet.getName();
  }
  getSheetId() {
    return this._worksheet.getSheetId();
  }
  getRange() {
    return this._range;
  }
  getRow() {
    return this._range.startRow;
  }
  getLastRow() {
    return this._range.endRow;
  }
  getColumn() {
    return this._range.startColumn;
  }
  getLastColumn() {
    return this._range.endColumn;
  }
  getWidth() {
    return this._range.endColumn - this._range.startColumn + 1;
  }
  getHeight() {
    return this._range.endRow - this._range.startRow + 1;
  }
  isMerged() {
    let { startColumn: e, startRow: t, endColumn: i, endRow: r } = this._range;
    return this._worksheet.getMergedCellRange(t, e, r, i).some((s) => O.equals(s, this._range));
  }
  getCellStyleData(e = "row") {
    return e === "cell" ? this._worksheet.getCellStyle(this._range.startRow, this._range.startColumn) : this._worksheet.getComposedCellStyle(this._range.startRow, this._range.startColumn, e === "row");
  }
  getFontFamily(e = "row") {
    var t, i;
    return (t = (i = this.getCellStyleData(e)) == null ? void 0 : i.ff) == null ? null : t;
  }
  getFontSize(e = "row") {
    var t, i;
    return (t = (i = this.getCellStyleData(e)) == null ? void 0 : i.fs) == null ? null : t;
  }
  getCellStyle(e = "row") {
    let t = this.getCellStyleData(e);
    return t ? He.create(t) : null;
  }
  getCellStyles(e = "row") {
    return this.getCellDatas().map((t, i) => t.map((r, s) => {
      if (!r) return null;
      let n = e === "cell" ? this._worksheet.getCellStyle(i + this._range.startRow, s + this._range.startColumn) : this._worksheet.getComposedCellStyle(i + this._range.startRow, s + this._range.startColumn, e === "row");
      return n ? He.create(n) : null;
    }));
  }
  getValue(e) {
    var t, i;
    return e ? this.getValueAndRichTextValue() : (t = (i = this._worksheet.getCell(this._range.startRow, this._range.startColumn)) == null ? void 0 : i.v) == null ? null : t;
  }
  getRawValue() {
    var e, t;
    let i = this._worksheet.getCellMatrix().getValue(this._range.startRow, this._range.startColumn);
    return i != null && i.p && (e = i.p.body) != null && e.dataStream ? i.p.body.dataStream : (t = i == null ? void 0 : i.v) == null ? null : t;
  }
  getDisplayValue() {
    var e, t, i;
    let r = this._worksheet.getCell(this._range.startRow, this._range.startColumn);
    return r != null && r.p && (e = r.p.body) != null && e.dataStream ? r.p.body.dataStream : (t = r == null || (i = r.v) == null ? void 0 : i.toString()) == null ? "" : t;
  }
  getValues(e) {
    if (e) return this.getValueAndRichTextValues();
    let { startRow: t, endRow: i, startColumn: r, endColumn: s } = this._range, n = [];
    for (let h = t; h <= i; h++) {
      let l = [];
      for (let c = r; c <= s; c++) {
        var o, a;
        l.push((o = (a = this._worksheet.getCell(h, c)) == null ? void 0 : a.v) == null ? null : o);
      }
      n.push(l);
    }
    return n;
  }
  getRawValues() {
    let e = this._worksheet.getCellMatrix(), { startRow: t, endRow: i, startColumn: r, endColumn: s } = this._range, n = [];
    for (let h = t; h <= i; h++) {
      let l = [];
      for (let c = r; c <= s; c++) {
        var o;
        let g = e.getValue(h, c);
        if (g != null && g.p && (o = g.p.body) != null && o.dataStream) l.push(g.p.body.dataStream);
        else {
          var a;
          l.push((a = g == null ? void 0 : g.v) == null ? null : a);
        }
      }
      n.push(l);
    }
    return n;
  }
  getDisplayValues() {
    let { startRow: e, endRow: t, startColumn: i, endColumn: r } = this._range, s = [];
    for (let h = e; h <= t; h++) {
      let l = [];
      for (let c = i; c <= r; c++) {
        var n;
        let g = this._worksheet.getCell(h, c);
        if (g != null && g.p && (n = g.p.body) != null && n.dataStream) l.push(g.p.body.dataStream);
        else {
          var o, a;
          l.push((o = g == null || (a = g.v) == null ? void 0 : a.toString()) == null ? "" : o);
        }
      }
      s.push(l);
    }
    return s;
  }
  getCellData() {
    var e;
    return (e = this._worksheet.getCell(this._range.startRow, this._range.startColumn)) == null ? null : e;
  }
  getCellDatas() {
    return this.getCellDataGrid();
  }
  getCellDataGrid() {
    let { startRow: e, endRow: t, startColumn: i, endColumn: r } = this._range, s = [];
    for (let n = e; n <= t; n++) {
      let o = [];
      for (let a = i; a <= r; a++) o.push(this._worksheet.getCellRaw(n, a));
      s.push(o);
    }
    return s;
  }
  getRichTextValue() {
    let e = this.getCellData();
    return e != null && e.p ? new B(e.p) : null;
  }
  getRichTextValues() {
    return this.getCellDataGrid().map((e) => e.map((t) => t != null && t.p ? new B(t.p) : null));
  }
  getValueAndRichTextValue() {
    let e = this.getCellData();
    return e != null && e.p ? new B(e.p) : e == null ? void 0 : e.v;
  }
  getValueAndRichTextValues() {
    return this.getCellDatas().map((e) => e.map((t) => t != null && t.p ? new B(t.p) : t == null ? void 0 : t.v));
  }
  getFormula() {
    var e;
    return (e = this._formulaDataModel.getFormulaStringByCell(this._range.startRow, this._range.startColumn, this._worksheet.getSheetId(), this._workbook.getUnitId())) == null ? "" : e;
  }
  getFormulas() {
    let e = [], { startRow: t, endRow: i, startColumn: r, endColumn: s } = this._range, n = this._worksheet.getSheetId(), o = this._workbook.getUnitId();
    for (let a = t; a <= i; a++) {
      let h = [];
      for (let l = r; l <= s; l++) {
        let c = this._formulaDataModel.getFormulaStringByCell(a, l, n, o);
        h.push(c || "");
      }
      e.push(h);
    }
    return e;
  }
  getWrap() {
    return this._worksheet.getRange(this._range).getWrap() === b.TRUE;
  }
  getWraps() {
    let e = this.getCellDatas(), t = this._workbook.getStyles();
    return e.map((i) => i.map((r) => {
      var s;
      return ((s = t.getStyleByCell(r)) == null ? void 0 : s.tb) === ne.WRAP;
    }));
  }
  getWrapStrategy() {
    return this._worksheet.getRange(this._range).getWrapStrategy();
  }
  getHorizontalAlignment() {
    return ht(this._worksheet.getRange(this._range).getHorizontalAlignment());
  }
  getHorizontalAlignments() {
    return this._worksheet.getRange(this._range).getHorizontalAlignments().map((e) => e.map((t) => ht(t)));
  }
  getVerticalAlignment() {
    return lt(this._worksheet.getRange(this._range).getVerticalAlignment());
  }
  getVerticalAlignments() {
    return this._worksheet.getRange(this._range).getVerticalAlignments().map((e) => e.map((t) => lt(t)));
  }
  setCustomMetaData(e) {
    let t = { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), range: this._range, customMetadata: { custom: e } };
    return this._commandService.syncExecuteCommand(ot.id, t), this;
  }
  setCustomMetaDatas(e) {
    let t = { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), range: this._range, customMetadata: e.map((i) => i.map((r) => ({ custom: r }))) };
    return this._commandService.syncExecuteCommand(ot.id, t), this;
  }
  getCustomMetaData() {
    var e;
    let t = this.getCellData();
    return (e = t == null ? void 0 : t.custom) == null ? null : e;
  }
  getCustomMetaDatas() {
    return this.getCellDataGrid().map((e) => e.map((t) => {
      var i;
      return (i = t == null ? void 0 : t.custom) == null ? null : i;
    }));
  }
  setBorder(e, t, i) {
    return this._commandService.syncExecuteCommand(Qi.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), ranges: [this._range], value: { type: e, style: t, color: i } }), this;
  }
  getBackground() {
    var e, t;
    let i = this.getCellStyle();
    return (e = i == null || (t = i.background) == null ? void 0 : t.rgb) == null ? ze.bg.rgb : e;
  }
  getBackgrounds() {
    return this.getCellStyles().map((e) => e.map((t) => {
      var i, r;
      return (i = t == null || (r = t.background) == null ? void 0 : r.rgb) == null ? ze.bg.rgb : i;
    }));
  }
  setBackgroundColor(e) {
    return this._commandService.syncExecuteCommand(N.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), range: this._range, style: { type: "bg", value: { rgb: e } } }), this;
  }
  setBackground(e) {
    return this.setBackgroundColor(e), this;
  }
  setTextRotation(e) {
    return this._commandService.syncExecuteCommand(er.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), range: this._range, value: e }), this;
  }
  setValue(e) {
    let t = be(e);
    if (!t) throw Error("Invalid value");
    return this._commandService.syncExecuteCommand(J.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), range: this._range, value: t }), this;
  }
  setValueForCell(e) {
    let t = be(e);
    if (!t) throw Error("Invalid value");
    return this._commandService.syncExecuteCommand(J.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), range: { startColumn: this._range.startColumn, startRow: this._range.startRow, endColumn: this._range.startColumn, endRow: this._range.startRow }, value: t }), this;
  }
  setRichTextValueForCell(e) {
    let t = e instanceof B ? e.getData() : e, i = { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), range: { startColumn: this._range.startColumn, startRow: this._range.startRow, endColumn: this._range.startColumn, endRow: this._range.startRow }, value: { p: t } };
    return this._commandService.syncExecuteCommand(J.id, i), this;
  }
  setRichTextValues(e) {
    let t = Le(e.map((r) => r.map((s) => s && { p: s instanceof B ? s.getData() : s })), this._range), i = { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), range: this._range, value: t };
    return this._commandService.syncExecuteCommand(J.id, i), this;
  }
  setWrap(e) {
    return this._commandService.syncExecuteCommand(ye.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), range: this._range, value: e ? ne.WRAP : ne.UNSPECIFIED }), this;
  }
  setWrapStrategy(e) {
    return this._commandService.syncExecuteCommand(ye.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), range: this._range, value: e }), this;
  }
  setVerticalAlignment(e) {
    return this._commandService.syncExecuteCommand(tr.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), range: this._range, value: yr(e) }), this;
  }
  setHorizontalAlignment(e) {
    return this._commandService.syncExecuteCommand(ir.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), range: this._range, value: Rr(e) }), this;
  }
  setValues(e) {
    let t = Le(e, this._range);
    return this._commandService.syncExecuteCommand(J.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), range: this._range, value: t }), this;
  }
  setFontWeight(e) {
    let t;
    if (e === "bold") t = b.TRUE;
    else if (e === "normal") t = b.FALSE;
    else if (e === null) t = null;
    else throw Error("Invalid fontWeight");
    let i = { type: "bl", value: t }, r = { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), range: this._range, style: i };
    return this._commandService.syncExecuteCommand(N.id, r), this;
  }
  setFontStyle(e) {
    let t;
    if (e === "italic") t = b.TRUE;
    else if (e === "normal") t = b.FALSE;
    else if (e === null) t = null;
    else throw Error("Invalid fontStyle");
    let i = { type: "it", value: t }, r = { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), range: this._range, style: i };
    return this._commandService.syncExecuteCommand(N.id, r), this;
  }
  setFontLine(e) {
    if (e === "underline") this._setFontUnderline({ s: b.TRUE });
    else if (e === "line-through") this._setFontStrikethrough({ s: b.TRUE });
    else if (e === "none") this._setFontUnderline({ s: b.FALSE }), this._setFontStrikethrough({ s: b.FALSE });
    else if (e === null) this._setFontUnderline(null), this._setFontStrikethrough(null);
    else throw Error("Invalid fontLine");
    return this;
  }
  _setFontUnderline(e) {
    let t = { type: "ul", value: e }, i = { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), range: this._range, style: t };
    this._commandService.syncExecuteCommand(N.id, i);
  }
  _setFontStrikethrough(e) {
    let t = { type: "st", value: e }, i = { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), range: this._range, style: t };
    this._commandService.syncExecuteCommand(N.id, i);
  }
  setFontFamily(e) {
    let t = { type: "ff", value: e }, i = { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), range: this._range, style: t };
    return this._commandService.syncExecuteCommand(N.id, i), this;
  }
  setFontSize(e) {
    let t = { type: "fs", value: e }, i = { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), range: this._range, style: t };
    return this._commandService.syncExecuteCommand(N.id, i), this;
  }
  setFontColor(e) {
    let t = { type: "cl", value: e === null ? null : { rgb: e } }, i = { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), range: this._range, style: t };
    return this._commandService.syncExecuteCommand(N.id, i), this;
  }
  merge(e) {
    let t = this._workbook.getUnitId(), i = this._worksheet.getSheetId();
    return ke(this._injector, t, i, [this._range], e), this;
  }
  mergeAcross(e) {
    let t = at([this._range], $.ROWS), i = this._workbook.getUnitId(), r = this._worksheet.getSheetId();
    return ke(this._injector, i, r, t, e), this;
  }
  mergeVertically(e) {
    let t = at([this._range], $.COLUMNS), i = this._workbook.getUnitId(), r = this._worksheet.getSheetId();
    return ke(this._injector, i, r, t, e), this;
  }
  isPartOfMerge() {
    let { startRow: e, startColumn: t, endRow: i, endColumn: r } = this._range;
    return this._worksheet.getMergedCellRange(e, t, i, r).length > 0;
  }
  breakApart() {
    return this._commandService.syncExecuteCommand(rr.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), ranges: [this._range] }), this;
  }
  forEach(e) {
    let { startColumn: t, startRow: i, endColumn: r, endRow: s } = this._range;
    this._worksheet.getMatrixWithMergedCells(i, t, s, r).forValue((n, o, a) => {
      e(n, o, a);
    });
  }
  getA1Notation(e, t, i) {
    let r = { ...this._range, startAbsoluteRefType: t, endAbsoluteRefType: i };
    return e ? sr(this._worksheet.getName(), r) : Oe(r);
  }
  activate() {
    return this._injector.createInstance(y, this._workbook).setActiveRange(this), this;
  }
  activateAsCurrentCell() {
    let e = this._worksheet.getMergedCell(this._range.startRow, this._range.startColumn);
    if (e && O.equals(e, this._range) || !e && this._range.startRow === this._range.endRow && this._range.startColumn === this._range.endColumn) {
      let t = this._injector.createInstance(y, this._workbook).getActiveRange();
      if (!t || t.getUnitId() !== this.getUnitId() || t.getSheetId() !== this.getSheetId()) return this.activate();
      if (O.contains(t.getRange(), this._range)) {
        let i = { unitId: this.getUnitId(), subUnitId: this.getSheetId(), selections: [{ range: t.getRange(), primary: ue(this.getRange(), this._worksheet), style: null }] };
        return this._commandService.syncExecuteCommand(Te.id, i), this;
      }
      return this.activate();
    } else throw Error("The range is not a single cell");
  }
  splitTextToColumns(e, t, i) {
    this._commandService.syncExecuteCommand(nr.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), range: this._range, delimiter: t, customDelimiter: i, treatMultipleDelimitersAsOne: e });
  }
  useThemeStyle(e) {
    if (e == null) {
      let t = this.getUsedThemeStyle();
      t && this.removeThemeStyle(t);
    } else this._commandService.syncExecuteCommand(or.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), range: this._range, themeName: e });
  }
  removeThemeStyle(e) {
    this._commandService.syncExecuteCommand(ar.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), range: this._range, themeName: e });
  }
  getUsedThemeStyle() {
    return this._injector.get(bt).getAppliedRangeThemeStyle({ unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), range: this._range });
  }
  clear(e) {
    return e && e.contentsOnly && !e.formatOnly ? this.clearContent() : e && e.formatOnly && !e.contentsOnly ? this.clearFormat() : (this._commandService.syncExecuteCommand(pt.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), ranges: [this._range], options: e }), this);
  }
  clearContent() {
    return this._commandService.syncExecuteCommand(Rt.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), ranges: [this._range] }), this;
  }
  clearFormat() {
    return this._commandService.syncExecuteCommand(yt.id, { unitId: this._workbook.getUnitId(), subUnitId: this._worksheet.getSheetId(), ranges: [this._range] }), this;
  }
  insertCells(e) {
    e === $.ROWS ? this._commandService.executeCommand(hr.id, { range: this._range }) : this._commandService.executeCommand(lr.id, { range: this._range });
  }
  deleteCells(e) {
    e === $.ROWS ? this._commandService.executeCommand(dr.id, { range: this._range }) : this._commandService.executeCommand(ur.id, { range: this._range });
  }
  getDataRegion(e) {
    let { startRow: t, startColumn: i, endRow: r, endColumn: s } = this._range, n = this._worksheet.getMaxRows(), o = this._worksheet.getMaxColumns(), a = this._worksheet.getCellMatrix(), h = t, l = i, c = r, g = s;
    if (e !== $.COLUMNS) {
      let R = !1, k = !1;
      for (let I = i; I <= s && (t > 0 && !G(a.getValue(t - 1, I)) && (R = !0), r < n - 1 && !G(a.getValue(r + 1, I)) && (k = !0), !(R && k)); I++) ;
      R && (h = t - 1), k && (c = r + 1);
    }
    if (e !== $.ROWS) {
      let R = !1, k = !1;
      for (let I = t; I <= r && (i > 0 && !G(a.getValue(I, i - 1)) && (R = !0), s < o - 1 && !G(a.getValue(I, s + 1)) && (k = !0), !(R && k)); I++) ;
      R && (l = i - 1), k && (g = s + 1);
    }
    return this._injector.createInstance(oe, this._workbook, this._worksheet, { startRow: h, startColumn: l, endRow: c, endColumn: g });
  }
  isBlank() {
    let e = this._worksheet.getCellMatrix(), { startRow: t, startColumn: i, endRow: r, endColumn: s } = this._range, n = !0;
    for (let o = t; o <= r; o++) {
      for (let a = i; a <= s; a++) if (!G(e.getValue(o, a))) {
        n = !1;
        break;
      }
      if (!n) break;
    }
    return n;
  }
  offset(e, t, i, r) {
    let { startRow: s, startColumn: n, endRow: o, endColumn: a } = this._range, h = s + e, l = n + t, c = i ? h + i - 1 : o + e, g = r ? l + r - 1 : a + t;
    if (h < 0 || l < 0 || c < 0 || g < 0) throw Error("The row or column index is out of range");
    return this._injector.createInstance(oe, this._workbook, this._worksheet, { startRow: h, startColumn: l, endRow: c, endColumn: g });
  }
  setFormula(e) {
    return this.setValue({ f: e });
  }
  setFormulas(e) {
    return this.setValues(e.map((t) => t.map((i) => ({ f: i }))));
  }
  getRangePermission() {
    let e = this._injector.createInstance(v, this._injector.createInstance(y, this._workbook), this._workbook, this._worksheet);
    return this._injector.createInstance(Me, this._workbook.getUnitId(), this._worksheet.getSheetId(), this, e);
  }
  autoFill(e, t) {
    let i = this.getRange(), r = e.getRange();
    if (!O.contains(r, i)) throw Error("AutoFill target range must contain source range");
    let { startRow: s, startColumn: n, endRow: o, endColumn: a } = i, { startRow: h, startColumn: l, endRow: c, endColumn: g } = r;
    if (o - s !== c - h && a - n !== g - l || o - s === c - h && n !== l && a !== g || a - n === g - l && s !== h && o !== c) throw Error("AutoFill can only fill in one direction");
    return this._commandService.executeCommand(cr.id, { sourceRange: i, targetRange: r, unitId: this.getUnitId(), subUnitId: this.getSheetId(), applyType: t });
  }
};
dt = p, dt._enableManualInit(), p = oe = U([u(3, m(E)), u(4, S), u(5, m(Cr))], p);
let je = class {
  constructor(e, t, i, r) {
    this._unitId = e, this._injector = t, this._permissionService = i, this._authzIoService = r, w(this, "_permissionSubject", void 0), w(this, "_collaboratorChangeSubject", new Mt()), w(this, "permission$", void 0), w(this, "pointChange$", void 0), w(this, "collaboratorChange$", void 0), w(this, "_subscriptions", []), w(this, "_fPermission", void 0), this._fPermission = this._injector.createInstance(A), this._permissionSubject = new ae(this._buildSnapshot()), this.permission$ = this._createPermissionStream(), this.pointChange$ = this._createPointChangeStream(), this.collaboratorChange$ = this._collaboratorChangeSubject.asObservable().pipe(W({ bufferSize: 1, refCount: !0 }));
  }
  _createPermissionStream() {
    let e = this._permissionService.permissionPointUpdate$.pipe(P((t) => t.id.includes(this._unitId))).subscribe(() => {
      this._permissionSubject.next(this._buildSnapshot());
    });
    return this._subscriptions.push(e), this._permissionSubject.asObservable().pipe(he((t, i) => JSON.stringify(t) === JSON.stringify(i)), W({ bufferSize: 1, refCount: !0 }));
  }
  _createPointChangeStream() {
    let e = /* @__PURE__ */ new Map();
    for (let t in d) {
      let i = d[t];
      e.set(i, this.getPoint(i));
    }
    return this._permissionService.permissionPointUpdate$.pipe(P((t) => t.id.includes(this._unitId)), le((t) => {
      let i = this._extractWorkbookPointType(t.id);
      if (!i) return null;
      let r = !!t.value, s = e.get(i);
      return e.set(i, r), s === r ? null : { point: i, value: r, oldValue: s };
    }), P((t) => t !== null), W({ bufferSize: 1, refCount: !0 }));
  }
  _extractWorkbookPointType(e) {
    for (let t in d) {
      let i = d[t], r = ie[i];
      if (r && new r(this._unitId).id === e) return i;
    }
    return null;
  }
  _buildSnapshot() {
    let e = {};
    for (let t in d) {
      let i = d[t];
      e[i] = this.getPoint(i);
    }
    return e;
  }
  async setMode(e) {
    let t = this._getModePermissions(e);
    await this._batchSetPermissionPoints(t);
  }
  _getModePermissions(e) {
    let t = {};
    switch (Object.values(d).forEach((i) => {
      t[i] = !1;
    }), e) {
      case "owner":
        Object.values(d).forEach((i) => {
          t[i] = !0;
        });
        break;
      case "editor":
        t[d.Edit] = !0, t[d.View] = !0, t[d.Print] = !0, t[d.Export] = !0, t[d.CopyContent] = !0, t[d.Comment] = !0, t[d.CreateSheet] = !0, t[d.DeleteSheet] = !0, t[d.RenameSheet] = !0, t[d.MoveSheet] = !0, t[d.HideSheet] = !0, t[d.InsertRow] = !0, t[d.InsertColumn] = !0, t[d.DeleteRow] = !0, t[d.DeleteColumn] = !0, t[d.CopySheet] = !0, t[d.CreateProtection] = !0;
        break;
      case "viewer":
        t[d.View] = !0, t[d.Print] = !0;
        break;
      case "commenter":
        t[d.View] = !0, t[d.Comment] = !0, t[d.Print] = !0;
        break;
    }
    return t;
  }
  async _batchSetPermissionPoints(e) {
    let t = [];
    for (let [i, r] of Object.entries(e)) {
      let s = i, n = ie[s];
      if (!n) throw Error(`Unknown workbook permission point: ${s}`);
      let o = this.getPoint(s);
      o !== r && (this._fPermission.setWorkbookPermissionPoint(this._unitId, n, r), t.push({ point: s, value: r, oldValue: o }));
    }
    if (t.length > 0) {
      let i = this._buildSnapshot();
      this._permissionSubject.next(i);
    }
  }
  async setReadOnly() {
    await this.setMode("viewer");
  }
  async setEditable() {
    await this.setMode("editor");
  }
  canEdit() {
    return this.getPoint(d.Edit);
  }
  async setPoint(e, t) {
    let i = ie[e];
    if (!i) throw Error(`Unknown workbook permission point: ${e}`);
    if (this.getPoint(e) === t) return;
    this._fPermission.setWorkbookPermissionPoint(this._unitId, i, t);
    let r = this._buildSnapshot();
    this._permissionSubject.next(r);
  }
  getPoint(e) {
    var t;
    let i = ie[e];
    if (!i) throw Error(`Unknown workbook permission point: ${e}`);
    let r = new i(this._unitId), s = this._permissionService.getPermissionPoint(r.id);
    return (t = s == null ? void 0 : s.value) == null ? !0 : t;
  }
  getSnapshot() {
    return this._buildSnapshot();
  }
  async setCollaborators(e) {
    let t = e.map((i) => ({ id: i.user.userID, subject: i.user, role: i.role }));
    await this._authzIoService.putCollaborators({ objectID: this._unitId, unitID: this._unitId, collaborators: t }), e.forEach((i) => {
      this._collaboratorChangeSubject.next({ type: "add", collaborator: { user: { id: i.user.userID }, role: i.role } });
    });
  }
  async addCollaborator(e, t) {
    await this._authzIoService.createCollaborator({ objectID: this._unitId, unitID: this._unitId, collaborators: [{ id: e.userID, subject: e, role: t }] }), this._collaboratorChangeSubject.next({ type: "add", collaborator: { user: { id: e.userID }, role: t } });
  }
  async updateCollaborator(e, t) {
    await this._authzIoService.updateCollaborator({ objectID: this._unitId, unitID: this._unitId, collaborator: { id: e.userID, subject: e, role: t } }), this._collaboratorChangeSubject.next({ type: "update", collaborator: { user: { id: e.userID }, role: t } });
  }
  async removeCollaborator(e) {
    await this._authzIoService.deleteCollaborator({ objectID: this._unitId, unitID: this._unitId, collaboratorID: e }), this._collaboratorChangeSubject.next({ type: "delete", collaborator: { user: { id: e }, role: F.Reader } });
  }
  async removeCollaborators(e) {
    for (let t of e) await this.removeCollaborator(t);
  }
  async listCollaborators() {
    return (await this._authzIoService.listCollaborators({ objectID: this._unitId, unitID: this._unitId })).map((e) => {
      var t, i;
      return { user: { id: ((t = e.subject) == null ? void 0 : t.userID) || e.id, displayName: ((i = e.subject) == null ? void 0 : i.name) || "" }, role: e.role };
    });
  }
  subscribe(e) {
    let t = this.permission$.subscribe(e);
    return () => t.unsubscribe();
  }
  dispose() {
    this._subscriptions.forEach((e) => e.unsubscribe()), this._permissionSubject.complete(), this._collaboratorChangeSubject.complete();
  }
};
je = U([u(1, m(E)), u(2, L), u(3, Z)], je);
let y = class extends We {
  constructor(e, t, i, r, s, n, o, a, h, l) {
    super(t), this._workbook = e, this._injector = t, this._resourceLoaderService = i, this._selectionManagerService = r, this._univerInstanceService = s, this._commandService = n, this._permissionService = o, this._logService = a, this._localeService = h, this._definedNamesService = l, w(this, "id", void 0), this.id = this._workbook.getUnitId();
  }
  getWorkbook() {
    return this._workbook;
  }
  dispose() {
    super.dispose(), this._workbook = null;
  }
  getId() {
    return this.id;
  }
  getName() {
    return this._workbook.name;
  }
  setName(e) {
    return this._commandService.syncExecuteCommand(Ui.id, { unitId: this._workbook.getUnitId(), name: e }), this;
  }
  save() {
    return this._resourceLoaderService.saveUnit(this._workbook.getUnitId());
  }
  getSnapshot() {
    return this._logService.warn("use 'save' instead of 'getSnapshot'"), this.save();
  }
  getActiveSheet() {
    let e = this._workbook.getActiveSheet();
    return this._injector.createInstance(v, this, this._workbook, e);
  }
  getSheets() {
    return this._workbook.getSheets().map((e) => this._injector.createInstance(v, this, this._workbook, e));
  }
  create(e, t, i, r) {
    var s, n, o;
    let a = Be($e.deepClone((s = r == null ? void 0 : r.sheet) == null ? {} : s));
    a.name = this._workbook.uniqueSheetName(e), a.rowCount = t, a.columnCount = i, a.id = r == null || (n = r.sheet) == null ? void 0 : n.id;
    let h = (o = r == null ? void 0 : r.index) == null ? this._workbook.getSheets().length : o;
    this._commandService.syncExecuteCommand(de.id, { unitId: this.id, index: h, sheet: a }), this._commandService.syncExecuteCommand(Y.id, { unitId: this.id, subUnitId: this._workbook.getSheets()[h].getSheetId() });
    let l = this._workbook.getActiveSheet();
    if (!l) throw Error("No active sheet found");
    return this._injector.createInstance(v, this, this._workbook, l);
  }
  getSheetBySheetId(e) {
    let t = this._workbook.getSheetBySheetId(e);
    return t ? this._injector.createInstance(v, this, this._workbook, t) : null;
  }
  getSheetByName(e) {
    let t = this._workbook.getSheetBySheetName(e);
    return t ? this._injector.createInstance(v, this, this._workbook, t) : null;
  }
  setActiveSheet(e) {
    return this._commandService.syncExecuteCommand(Y.id, { unitId: this.id, subUnitId: typeof e == "string" ? e : e.getSheetId() }), typeof e == "string" ? this.getSheetBySheetId(e) : e;
  }
  insertSheet(e, t) {
    var i, r, s;
    let n = Be($e.deepClone((i = t == null ? void 0 : t.sheet) == null ? {} : i));
    n.name = this._workbook.uniqueSheetName(e), n.id = t == null || (r = t.sheet) == null ? void 0 : r.id;
    let o = (s = t == null ? void 0 : t.index) == null ? this._workbook.getSheets().length : s;
    this._commandService.syncExecuteCommand(de.id, { unitId: this.id, index: o, sheet: n }), this._commandService.syncExecuteCommand(Y.id, { unitId: this.id, subUnitId: this._workbook.getSheets()[o].getSheetId() });
    let a = this._workbook.getActiveSheet();
    if (!a) throw Error("No active sheet found");
    return this._injector.createInstance(v, this, this._workbook, a);
  }
  deleteSheet(e) {
    let t = this.id, i = typeof e == "string" ? e : e.getSheetId();
    return this._commandService.syncExecuteCommand(Ce.id, { unitId: t, subUnitId: i });
  }
  undo() {
    return this._univerInstanceService.focusUnit(this.id), this._commandService.syncExecuteCommand(Pt.id), this;
  }
  redo() {
    return this._univerInstanceService.focusUnit(this.id), this._commandService.syncExecuteCommand(xt.id), this;
  }
  onBeforeCommandExecute(e) {
    return this._commandService.beforeCommandExecuted((t) => {
      var i;
      ((i = t.params) == null ? void 0 : i.unitId) === this.id && e(t);
    });
  }
  onCommandExecuted(e) {
    return this._commandService.onCommandExecuted((t) => {
      var i;
      ((i = t.params) == null ? void 0 : i.unitId) === this.id && e(t);
    });
  }
  onSelectionChange(e) {
    return ct(this._selectionManagerService.selectionMoveEnd$.subscribe((t) => {
      this._univerInstanceService.getCurrentUnitForType(V.UNIVER_SHEET).getUnitId() === this.id && (t != null && t.length ? e(t.map((i) => i.range)) : e([]));
    }));
  }
  setEditable(e) {
    let t = new Ne(this._workbook.getUnitId());
    return this._permissionService.getPermissionPoint(t.id) || this._permissionService.addPermissionPoint(t), this._permissionService.updatePermissionPoint(t.id, e), this;
  }
  setActiveRange(e) {
    let t = this.getActiveSheet(), i = e.getRange().sheetId || t.getSheetId(), r = i ? this._workbook.getSheetBySheetId(i) : this._workbook.getActiveSheet(!0);
    if (!r) throw Error("No active sheet found");
    r.getSheetId() !== t.getSheetId() && this.setActiveSheet(this._injector.createInstance(v, this, this._workbook, r));
    let s = { unitId: this.getId(), subUnitId: i, selections: [e].map((n) => ({ range: n.getRange(), primary: ue(n.getRange(), r), style: null })) };
    return this._commandService.syncExecuteCommand(Te.id, s), this;
  }
  getActiveRange() {
    let e = this._workbook.getActiveSheet(), t = this._selectionManagerService.getCurrentSelections().find((i) => !!i.primary);
    return t ? this._injector.createInstance(p, this._workbook, e, t.range) : null;
  }
  getActiveCell() {
    let e = this._workbook.getActiveSheet(), t = this._selectionManagerService.getCurrentSelections().find((r) => !!r.primary);
    if (!t) return null;
    let i = { ...t.primary, rangeType: f.NORMAL };
    return this._injector.createInstance(p, this._workbook, e, i);
  }
  deleteActiveSheet() {
    let e = this.getActiveSheet();
    return this.deleteSheet(e);
  }
  duplicateSheet(e) {
    return this._commandService.syncExecuteCommand(Pi.id, { unitId: e.getWorkbook().getUnitId(), subUnitId: e.getSheetId() }), this._injector.createInstance(v, this, this._workbook, this._workbook.getActiveSheet());
  }
  duplicateActiveSheet() {
    let e = this.getActiveSheet();
    return this.duplicateSheet(e);
  }
  getNumSheets() {
    return this._workbook.getSheets().length;
  }
  getLocale() {
    return this._localeService.getCurrentLocale();
  }
  setLocale(e) {
    this._localeService.setLocale(e);
  }
  setSpreadsheetLocale(e) {
    return this._localeService.setLocale(e), this;
  }
  getUrl() {
    return location.href;
  }
  moveSheet(e, t) {
    let i = t;
    return i < 0 ? i = 0 : i > this._workbook.getSheets().length - 1 && (i = this._workbook.getSheets().length - 1), this._commandService.syncExecuteCommand(xi.id, { unitId: e.getWorkbook().getUnitId(), order: i, subUnitId: e.getSheetId() }), this;
  }
  moveActiveSheet(e) {
    let t = this.getActiveSheet();
    return this.moveSheet(t, e);
  }
  getPermission() {
    return this._injector.createInstance(A);
  }
  getWorkbookPermission() {
    return this._injector.createInstance(je, this._workbook.getUnitId());
  }
  getDefinedName(e) {
    let t = this._definedNamesService.getValueByName(this.id, e);
    return t ? this._injector.createInstance(ce, { ...t, unitId: this.id }) : null;
  }
  getDefinedNames() {
    let e = this._definedNamesService.getDefinedNameMap(this.id);
    return e ? Object.values(e).map((t) => this._injector.createInstance(ce, { ...t, unitId: this.id })) : [];
  }
  insertDefinedName(e, t) {
    let i = this._injector.createInstance(ge).setName(e).setRef(t).build();
    return i.localSheetId = K, this.insertDefinedNameBuilder(i), this;
  }
  deleteDefinedName(e) {
    let t = this.getDefinedName(e);
    return t ? (t.delete(), !0) : !1;
  }
  insertDefinedNameBuilder(e) {
    e.unitId = this.getId(), this._commandService.syncExecuteCommand(Re.id, e);
  }
  updateDefinedNameBuilder(e) {
    this._commandService.syncExecuteCommand(Re.id, e);
  }
  getRegisteredRangeThemes() {
    return this._injector.get(bt).getRegisteredRangeThemes();
  }
  registerRangeTheme(e) {
    this._commandService.syncExecuteCommand(Mi.id, { unitId: this.getId(), rangeThemeStyle: e });
  }
  unregisterRangeTheme(e) {
    this._commandService.syncExecuteCommand(ji.id, { unitId: this.getId(), themeName: e });
  }
  createRangeThemeStyle(e, t) {
    return new Wi(e, t);
  }
  setCustomMetadata(e) {
    return this._workbook.setCustomMetadata(e), this;
  }
  getCustomMetadata() {
    return this._workbook.getCustomMetadata();
  }
  addStyles(e) {
    this._workbook.addStyles(e);
  }
  removeStyles(e) {
    this._workbook.removeStyles(e);
  }
};
y = U([u(1, m(E)), u(2, m(Wt)), u(3, m(Ut)), u(4, se), u(5, S), u(6, L), u(7, wt), u(8, m(_t)), u(9, Et)], y);
var Er = class extends kt {
  getCommandSheetTarget(e) {
    var t;
    let i = e.params;
    if (!i) return this.getActiveSheet();
    let r = i.unitId ? this.getUniverSheet(i.unitId) : (t = this.getActiveWorkbook) == null ? void 0 : t.call(this);
    if (!r) return;
    let s = r.getSheetBySheetId(i.subUnitId || i.sheetId) || r.getActiveSheet();
    if (s) return { workbook: r, worksheet: s };
  }
  getSheetTarget(e, t) {
    let i = this.getUniverSheet(e);
    if (!i) return;
    let r = i.getSheetBySheetId(t);
    if (r) return { workbook: i, worksheet: r };
  }
  _initWorkbookEvent(e) {
    let t = e.get(se);
    this.disposeWithMe(this.registerEventHandler(this.Event.WorkbookDisposed, () => t.unitDisposed$.subscribe((i) => {
      i.type === V.UNIVER_SHEET && this.fireEvent(this.Event.WorkbookDisposed, { unitId: i.getUnitId(), unitType: i.type, snapshot: i.getSnapshot() });
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.WorkbookCreated, () => t.unitAdded$.subscribe((i) => {
      if (i.type === V.UNIVER_SHEET) {
        let r = i, s = e.createInstance(y, r);
        this.fireEvent(this.Event.WorkbookCreated, { unitId: i.getUnitId(), type: i.type, workbook: s, unit: s });
      }
    })));
  }
  _initialize(e) {
    let t = e.get(se), i = e.get(S);
    this.disposeWithMe(this.registerEventHandler(this.Event.BeforeSheetCreate, () => i.beforeCommandExecuted((r) => {
      if (r.id === de.id) {
        var s;
        let { unitId: n, index: o, sheet: a } = r.params || {}, h = n ? this.getUniverSheet(n) : (s = this.getActiveWorkbook) == null ? void 0 : s.call(this);
        if (!h) return;
        let l = { workbook: h, index: o, sheet: a };
        if (this.fireEvent(this.Event.BeforeSheetCreate, l), l.cancel) throw new j();
      }
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.BeforeActiveSheetChange, () => i.beforeCommandExecuted((r) => {
      if (r.id === Y.id) {
        var s;
        let { subUnitId: n, unitId: o } = r.params, a = o ? this.getUniverSheet(o) : (s = this.getActiveWorkbook) == null ? void 0 : s.call(this);
        if (!a || !n) return;
        let h = a.getSheetBySheetId(n), l = a.getActiveSheet();
        if (!h || !l) return;
        let c = { workbook: a, activeSheet: h, oldActiveSheet: l };
        if (this.fireEvent(this.Event.BeforeActiveSheetChange, c), c.cancel) throw new j();
      }
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.BeforeSheetDelete, () => i.beforeCommandExecuted((r) => {
      if (r.id === Ce.id) {
        let s = this.getCommandSheetTarget(r);
        if (!s) return;
        let { workbook: n, worksheet: o } = s, a = { workbook: n, worksheet: o };
        if (this.fireEvent(this.Event.BeforeSheetDelete, a), a.cancel) throw new j();
      }
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.BeforeSheetMove, () => i.beforeCommandExecuted((r) => {
      if (r.id === Ge.id) {
        let { fromOrder: s, toOrder: n } = r.params, o = this.getCommandSheetTarget(r);
        if (!o) return;
        let a = { workbook: o.workbook, worksheet: o.worksheet, newIndex: n, oldIndex: s };
        if (this.fireEvent(this.Event.BeforeSheetMove, a), a.cancel) throw new j();
      }
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.BeforeSheetNameChange, () => i.beforeCommandExecuted((r) => {
      if (r.id === fe.id) {
        let { name: s } = r.params, n = this.getCommandSheetTarget(r);
        if (!n) return;
        let o = { workbook: n.workbook, worksheet: n.worksheet, newName: s, oldName: n.worksheet.getSheetName() };
        if (this.fireEvent(this.Event.BeforeSheetNameChange, o), o.cancel) throw new j();
      }
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.BeforeSheetTabColorChange, () => i.beforeCommandExecuted((r) => {
      if (r.id === Je.id) {
        let { color: s } = r.params, n = this.getCommandSheetTarget(r);
        if (!n) return;
        let o = { workbook: n.workbook, worksheet: n.worksheet, newColor: s, oldColor: n.worksheet.getTabColor() };
        if (this.fireEvent(this.Event.BeforeSheetTabColorChange, o), o.cancel) throw new j();
      }
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.BeforeSheetHideChange, () => i.beforeCommandExecuted((r) => {
      if (r.id === Ye.id) {
        let { hidden: s } = r.params, n = this.getCommandSheetTarget(r);
        if (!n) return;
        let o = { workbook: n.workbook, worksheet: n.worksheet, hidden: !!s };
        if (this.fireEvent(this.Event.BeforeSheetHideChange, o), o.cancel) throw new j();
      }
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.BeforeGridlineColorChange, () => i.beforeCommandExecuted((r) => {
      if (r.id === ve.id) {
        var s;
        let n = this.getCommandSheetTarget(r);
        if (!n) return;
        let o = { ...n, color: (s = r.params) == null ? void 0 : s.color };
        if (this.fireEvent(this.Event.BeforeGridlineColorChange, o), o.cancel) throw new j();
      }
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.BeforeGridlineEnableChange, () => i.beforeCommandExecuted((r) => {
      if (r.id === pe.id) {
        var s, n;
        let o = this.getCommandSheetTarget(r);
        if (!o) return;
        let a = (s = (n = r.params) == null ? void 0 : n.showGridlines) == null ? !o.worksheet.hasHiddenGridLines() : s, h = { ...o, enabled: !!a };
        if (this.fireEvent(this.Event.BeforeGridlineEnableChange, h), h.cancel) throw new j();
      }
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.SheetValueChanged, () => i.onCommandExecuted((r) => {
      if (fi.indexOf(r.id) > -1) {
        if (!this.getActiveSheet()) return;
        let s = vi(t, r).map((n) => {
          var o;
          return (o = this.getWorkbook(n.unitId)) == null || (o = o.getSheetBySheetId(n.subUnitId)) == null ? void 0 : o.getRange(n.range);
        }).filter(Boolean);
        if (!s.length) return;
        this.fireEvent(this.Event.SheetValueChanged, { payload: r, effectedRanges: s });
      }
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.SheetCreated, () => i.onCommandExecuted((r) => {
      if (r.id === de.id) {
        var s;
        let { unitId: n } = r.params || {}, o = n ? this.getUniverSheet(n) : (s = this.getActiveWorkbook) == null ? void 0 : s.call(this);
        if (!o) return;
        let a = o.getActiveSheet();
        if (!a) return;
        let h = { workbook: o, worksheet: a };
        this.fireEvent(this.Event.SheetCreated, h);
      }
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.ActiveSheetChanged, () => i.onCommandExecuted((r) => {
      if (r.id === Y.id) {
        let s = this.getActiveSheet();
        if (!s) return;
        let { workbook: n, worksheet: o } = s;
        this._fireActiveSheetChanged(n, o);
      }
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.SheetDeleted, () => i.onCommandExecuted((r) => {
      if (r.id === Ce.id) {
        var s;
        let { subUnitId: n, unitId: o } = r.params, a = o ? this.getUniverSheet(o) : (s = this.getActiveWorkbook) == null ? void 0 : s.call(this);
        if (!a || !n) return;
        this._fireSheetDeleted(a, n);
      }
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.SheetMoved, () => i.onCommandExecuted((r) => {
      if (r.id === Ge.id) {
        let { toOrder: s } = r.params, n = this.getCommandSheetTarget(r);
        if (!n) return;
        this._fireSheetMoved(n.workbook, n.worksheet, s);
      }
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.SheetNameChanged, () => i.onCommandExecuted((r) => {
      if (r.id === fe.id) {
        let { name: s } = r.params, n = this.getCommandSheetTarget(r);
        if (!n) return;
        this._fireSheetNameChanged(n.workbook, n.worksheet, s);
      }
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.SheetTabColorChanged, () => i.onCommandExecuted((r) => {
      if (r.id === Je.id) {
        let { color: s } = r.params, n = this.getCommandSheetTarget(r);
        if (!n) return;
        this._fireSheetTabColorChanged(n.workbook, n.worksheet, s);
      }
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.SheetHideChanged, () => i.onCommandExecuted((r) => {
      if (r.id === Ye.id) {
        let { hidden: s } = r.params, n = this.getCommandSheetTarget(r);
        if (!n) return;
        this._fireSheetHideChanged(n.workbook, n.worksheet, !!s);
      }
    }))), this.disposeWithMe(this.registerEventHandler(this.Event.GridlineChanged, () => i.onCommandExecuted((r) => {
      if (r.id === ve.id || r.id === pe.id) {
        let s = this.getCommandSheetTarget(r);
        if (!s) return;
        this.fireEvent(this.Event.GridlineChanged, { ...s, enabled: !s.worksheet.hasHiddenGridLines(), color: s.worksheet.getGridLinesColor() });
      }
    }))), this._initWorkbookEvent(e);
  }
  createUniverSheet(e, t) {
    let i = this._injector.get(se).createUnit(V.UNIVER_SHEET, e, t);
    return this._injector.createInstance(y, i);
  }
  createWorkbook(e, t) {
    return this.createUniverSheet(e, t);
  }
  getActiveWorkbook() {
    let e = this._univerInstanceService.getCurrentUnitForType(V.UNIVER_SHEET);
    return e ? this._injector.createInstance(y, e) : null;
  }
  getActiveUniverSheet() {
    return this.getActiveWorkbook();
  }
  getUniverSheet(e) {
    let t = this._univerInstanceService.getUnit(e, V.UNIVER_SHEET);
    return t ? this._injector.createInstance(y, t) : null;
  }
  getWorkbook(e) {
    return this.getUniverSheet(e);
  }
  getPermission() {
    return this._injector.createInstance(A);
  }
  onUniverSheetCreated(e) {
    return ct(this._univerInstanceService.getTypeOfUnitAdded$(V.UNIVER_SHEET).subscribe((t) => {
      e(this._injector.createInstance(y, t));
    }));
  }
  newDefinedName() {
    return this._injector.createInstance(ge);
  }
  getActiveSheet() {
    let e = this.getActiveWorkbook();
    if (!e) return null;
    let t = e.getActiveSheet();
    return t ? { workbook: e, worksheet: t } : null;
  }
  setFreezeSync(e) {
    this._injector.get(pi).setEnabled(e);
  }
  _fireActiveSheetChanged(e, t) {
    this.fireEvent(this.Event.ActiveSheetChanged, { workbook: e, activeSheet: t });
  }
  _fireSheetDeleted(e, t) {
    this.fireEvent(this.Event.SheetDeleted, { workbook: e, sheetId: t });
  }
  _fireSheetMoved(e, t, i) {
    this.fireEvent(this.Event.SheetMoved, { workbook: e, worksheet: t, newIndex: i });
  }
  _fireSheetNameChanged(e, t, i) {
    this.fireEvent(this.Event.SheetNameChanged, { workbook: e, worksheet: t, newName: i });
  }
  _fireSheetTabColorChanged(e, t, i) {
    this.fireEvent(this.Event.SheetTabColorChanged, { workbook: e, worksheet: t, newColor: i });
  }
  _fireSheetHideChanged(e, t, i) {
    this.fireEvent(this.Event.SheetHideChanged, { workbook: e, worksheet: t, hidden: i });
  }
};
kt.extend(Er);
var Ur = class {
  get SheetValueChangeType() {
    return Ri;
  }
  get SheetSkeletonChangeType() {
    return yi;
  }
  get SplitDelimiterType() {
    return Ei;
  }
  get UnitRole() {
    return F;
  }
  get WorkbookPermissionPoint() {
    return d;
  }
  get WorksheetPermissionPoint() {
    return _;
  }
  get RangePermissionPoint() {
    return C;
  }
};
Dt.extend(Ur);
var Pr = class {
  get SheetCreated() {
    return "SheetCreated";
  }
  get BeforeSheetCreate() {
    return "BeforeSheetCreate";
  }
  get WorkbookCreated() {
    return "WorkbookCreated";
  }
  get WorkbookDisposed() {
    return "WorkbookDisposed";
  }
  get GridlineChanged() {
    return "GridlineChanged";
  }
  get BeforeGridlineEnableChange() {
    return "BeforeGridlineEnableChange";
  }
  get BeforeGridlineColorChange() {
    return "BeforeGridlineColorChange";
  }
  get BeforeActiveSheetChange() {
    return "BeforeActiveSheetChange";
  }
  get ActiveSheetChanged() {
    return "ActiveSheetChanged";
  }
  get SheetDeleted() {
    return "SheetDeleted";
  }
  get BeforeSheetDelete() {
    return "BeforeSheetDelete";
  }
  get SheetMoved() {
    return "SheetMoved";
  }
  get BeforeSheetMove() {
    return "BeforeSheetMove";
  }
  get SheetNameChanged() {
    return "SheetNameChanged";
  }
  get BeforeSheetNameChange() {
    return "BeforeSheetNameChange";
  }
  get SheetTabColorChanged() {
    return "SheetTabColorChanged";
  }
  get BeforeSheetTabColorChange() {
    return "BeforeSheetTabColorChange";
  }
  get SheetHideChanged() {
    return "SheetHideChanged";
  }
  get BeforeSheetHideChange() {
    return "BeforeSheetHideChange";
  }
  get SheetValueChanged() {
    return "SheetValueChanged";
  }
};
Nt.extend(Pr);
let ut = class extends De {
  constructor(e) {
    super(), this._injector = e;
  }
};
ut = U([u(0, m(E))], ut);
export {
  y as $,
  A as K,
  p as Q,
  v as Z,
  ut as h,
  Pr as m
};
