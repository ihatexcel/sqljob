var qe = Object.defineProperty;
var Be = (i, t, e) => t in i ? qe(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var x = (i, t, e) => Be(i, typeof t != "symbol" ? t + "" : t, e);
const ee = (i) => Object.prototype.toString.call(i) === "[object Object]", ze = (i) => {
  let t = !1;
  try {
    t = JSON.parse(i);
  } catch {
    return !1;
  }
  return !(t === null || !Array.isArray(t) && !ee(t)) && t;
}, U = (i, t) => {
  const e = document.createElement(i);
  if (t && typeof t == "object") for (const s in t) s === "html" ? e.innerHTML = t[s] : e.setAttribute(s, t[s]);
  return e;
}, he = (i) => ["#text", "#comment"].includes(i.nodeName) ? i.data : i.childNodes ? i.childNodes.map((t) => he(t)).join("") : "", z = (i) => {
  if (i == null) return "";
  if (i.hasOwnProperty("text") || i.hasOwnProperty("data")) {
    const t = i;
    return t.text ?? z(t.data);
  }
  return i.hasOwnProperty("nodeName") ? he(i) : String(i);
}, re = function(i) {
  return i.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}, me = function(i, t) {
  let e = 0, s = 0;
  for (; e < i + 1; )
    t[s].hidden || (e += 1), s += 1;
  return s - 1;
}, He = function(i) {
  const t = {};
  if (i) for (const e of i) t[e.name] = e.value;
  return t;
}, B = (i) => i ? i.trim().split(" ").map((t) => `.${t}`).join("") : null, Me = (i, t) => !(t == null ? void 0 : t.split(" ").some((s) => !i.classList.contains(s))), Q = (i, t) => i ? t ? `${i} ${t}` : i : t || "", Ie = function(i, t = 300) {
  let e;
  return (...s) => {
    clearTimeout(e), e = window.setTimeout(() => i(), t);
  };
};
var Oe = function() {
  return Oe = Object.assign || function(i) {
    for (var t, e = arguments, s = 1, n = arguments.length; s < n; s++) for (var a in t = e[s]) Object.prototype.hasOwnProperty.call(t, a) && (i[a] = t[a]);
    return i;
  }, Oe.apply(this, arguments);
};
function ge(i, t, e) {
  for (var s, n = 0, a = t.length; n < a; n++) !s && n in t || (s || (s = Array.prototype.slice.call(t, 0, n)), s[n] = t[n]);
  return i.concat(s || Array.prototype.slice.call(t));
}
var H = function() {
  function i(t) {
    t === void 0 && (t = {});
    var e = this;
    Object.entries(t).forEach(function(s) {
      var n = s[0], a = s[1];
      return e[n] = a;
    });
  }
  return i.prototype.toString = function() {
    return JSON.stringify(this);
  }, i.prototype.setValue = function(t, e) {
    return this[t] = e, this;
  }, i;
}();
function Y(i, t) {
  var e = arguments;
  t === void 0 && (t = !1);
  for (var s = [], n = 2; n < arguments.length; n++) s[n - 2] = e[n];
  return i != null && (t ? !!s.some(function(a) {
    if (a === "Element") return i.nodeType === 1 || typeof i.nodeName == "string" && i.nodeName !== "#text" && i.nodeName !== "#comment" || i.tagName && typeof i.tagName == "string" || i.setAttribute && typeof i.setAttribute == "function";
    if (a === "Text") return i.nodeType === 3 || i.nodeName === "#text";
    if (a === "Comment") return i.nodeType === 8 || i.nodeName === "#comment";
    if (a.startsWith("HTML") && a.endsWith("Element")) {
      var o = a.slice(4, -7).toLowerCase();
      return i.nodeName && i.nodeName.toLowerCase() === o || i.tagName && i.tagName.toLowerCase() === o;
    }
    return !1;
  }) || !!i.ownerDocument && s.some(function(a) {
    var o, l;
    return typeof ((l = (o = i == null ? void 0 : i.ownerDocument) === null || o === void 0 ? void 0 : o.defaultView) === null || l === void 0 ? void 0 : l[a]) == "function" && i instanceof i.ownerDocument.defaultView[a];
  }) : s.some(function(a) {
    var o, l;
    return typeof ((l = (o = i == null ? void 0 : i.ownerDocument) === null || o === void 0 ? void 0 : o.defaultView) === null || l === void 0 ? void 0 : l[a]) == "function" && i instanceof i.ownerDocument.defaultView[a];
  }));
}
function Ve(i, t, e) {
  var s;
  return i.nodeName === "#text" ? s = e.document.createTextNode(i.data) : i.nodeName === "#comment" ? s = e.document.createComment(i.data) : (t ? (s = e.document.createElementNS("http://www.w3.org/2000/svg", i.nodeName), i.nodeName === "foreignObject" && (t = !1)) : i.nodeName.toLowerCase() === "svg" ? (s = e.document.createElementNS("http://www.w3.org/2000/svg", "svg"), t = !0) : s = e.document.createElement(i.nodeName), i.attributes && Object.entries(i.attributes).forEach(function(n) {
    var a = n[0], o = n[1];
    return s.setAttribute(a, o);
  }), i.childNodes && i.childNodes.forEach(function(n) {
    return s.appendChild(Ve(n, t, e));
  }), e.valueDiffing && (i.value && Y(s, e.simplifiedElementCheck, "HTMLButtonElement", "HTMLDataElement", "HTMLInputElement", "HTMLLIElement", "HTMLMeterElement", "HTMLOptionElement", "HTMLProgressElement", "HTMLParamElement") && (s.value = i.value), i.checked && Y(s, e.simplifiedElementCheck, "HTMLInputElement") && (s.checked = i.checked), i.selected && Y(s, e.simplifiedElementCheck, "HTMLOptionElement") && (s.selected = i.selected))), s;
}
var Ne = function(i, t) {
  for (t = t.slice(); t.length > 0; ) {
    var e = t.splice(0, 1)[0];
    i = i.childNodes[e];
  }
  return i;
};
function Z(i, t, e) {
  var s, n, a, o = t[e._const.action], l = t[e._const.route];
  [e._const.addElement, e._const.addTextElement].includes(o) || (s = Ne(i, l));
  var r = { diff: t, node: s };
  if (e.preDiffApply(r)) return !0;
  switch (o) {
    case e._const.addAttribute:
      if (!s || !Y(s, e.simplifiedElementCheck, "Element")) return !1;
      s.setAttribute(t[e._const.name], t[e._const.value]);
      break;
    case e._const.modifyAttribute:
      if (!s || !Y(s, e.simplifiedElementCheck, "Element")) return !1;
      s.setAttribute(t[e._const.name], t[e._const.newValue]), Y(s, e.simplifiedElementCheck, "HTMLInputElement") && t[e._const.name] === "value" && (s.value = t[e._const.newValue]);
      break;
    case e._const.removeAttribute:
      if (!s || !Y(s, e.simplifiedElementCheck, "Element")) return !1;
      s.removeAttribute(t[e._const.name]);
      break;
    case e._const.modifyTextElement:
      if (!s || !Y(s, e.simplifiedElementCheck, "Text")) return !1;
      e.textDiff(s, s.data, t[e._const.oldValue], t[e._const.newValue]), Y(s.parentNode, e.simplifiedElementCheck, "HTMLTextAreaElement") && (s.parentNode.value = t[e._const.newValue]);
      break;
    case e._const.modifyValue:
      if (!s || s.value === void 0) return !1;
      s.value = t[e._const.newValue];
      break;
    case e._const.modifyComment:
      if (!s || !Y(s, e.simplifiedElementCheck, "Comment")) return !1;
      e.textDiff(s, s.data, t[e._const.oldValue], t[e._const.newValue]);
      break;
    case e._const.modifyChecked:
      if (!s || s.checked === void 0) return !1;
      s.checked = t[e._const.newValue];
      break;
    case e._const.modifySelected:
      if (!s || s.selected === void 0) return !1;
      s.selected = t[e._const.newValue];
      break;
    case e._const.replaceElement:
      var d = t[e._const.newValue].nodeName.toLowerCase() === "svg" || s.parentNode.namespaceURI === "http://www.w3.org/2000/svg";
      s.parentNode.replaceChild(Ve(t[e._const.newValue], d, e), s);
      break;
    case e._const.relocateGroup:
      ge([], new Array(t[e._const.groupLength])).map(function() {
        return s.removeChild(s.childNodes[t[e._const.from]]);
      }).forEach(function(m, h) {
        h === 0 && (a = s.childNodes[t[e._const.to]]), s.insertBefore(m, a || null);
      });
      break;
    case e._const.removeElement:
      s.parentNode.removeChild(s);
      break;
    case e._const.addElement:
      var c = (f = l.slice()).splice(f.length - 1, 1)[0];
      if (!Y(s = Ne(i, f), e.simplifiedElementCheck, "Element")) return !1;
      s.insertBefore(Ve(t[e._const.element], s.namespaceURI === "http://www.w3.org/2000/svg", e), s.childNodes[c] || null);
      break;
    case e._const.removeTextElement:
      if (!s || s.nodeType !== 3) return !1;
      var p = s.parentNode;
      p.removeChild(s), Y(p, e.simplifiedElementCheck, "HTMLTextAreaElement") && (p.value = "");
      break;
    case e._const.addTextElement:
      var f;
      if (c = (f = l.slice()).splice(f.length - 1, 1)[0], n = e.document.createTextNode(t[e._const.value]), !(s = Ne(i, f)).childNodes) return !1;
      s.insertBefore(n, s.childNodes[c] || null), Y(s.parentNode, e.simplifiedElementCheck, "HTMLTextAreaElement") && (s.parentNode.value = t[e._const.value]);
      break;
    default:
      console.log("unknown action");
  }
  return e.postDiffApply({ diff: r.diff, node: r.node, newNode: n }), !0;
}
function xe(i, t, e) {
  var s = i[t];
  i[t] = i[e], i[e] = s;
}
function Ue(i, t, e) {
  (t = t.slice()).reverse(), t.forEach(function(s) {
    (function(n, a, o) {
      switch (a[o._const.action]) {
        case o._const.addAttribute:
          a[o._const.action] = o._const.removeAttribute, Z(n, a, o);
          break;
        case o._const.modifyAttribute:
          xe(a, o._const.oldValue, o._const.newValue), Z(n, a, o);
          break;
        case o._const.removeAttribute:
          a[o._const.action] = o._const.addAttribute, Z(n, a, o);
          break;
        case o._const.modifyTextElement:
        case o._const.modifyValue:
        case o._const.modifyComment:
        case o._const.modifyChecked:
        case o._const.modifySelected:
        case o._const.replaceElement:
          xe(a, o._const.oldValue, o._const.newValue), Z(n, a, o);
          break;
        case o._const.relocateGroup:
          xe(a, o._const.from, o._const.to), Z(n, a, o);
          break;
        case o._const.removeElement:
          a[o._const.action] = o._const.addElement, Z(n, a, o);
          break;
        case o._const.addElement:
          a[o._const.action] = o._const.removeElement, Z(n, a, o);
          break;
        case o._const.removeTextElement:
          a[o._const.action] = o._const.addTextElement, Z(n, a, o);
          break;
        case o._const.addTextElement:
          a[o._const.action] = o._const.removeTextElement, Z(n, a, o);
          break;
        default:
          console.log("unknown action");
      }
    })(i, s, e);
  });
}
var Ce = function(i) {
  var t = [];
  return t.push(i.nodeName), i.nodeName !== "#text" && i.nodeName !== "#comment" && i.attributes && (i.attributes.class && t.push("".concat(i.nodeName, ".").concat(i.attributes.class.replace(/ /g, "."))), i.attributes.id && t.push("".concat(i.nodeName, "#").concat(i.attributes.id))), t;
}, Te = function(i) {
  var t = {}, e = {};
  return i.forEach(function(s) {
    Ce(s).forEach(function(n) {
      var a = n in t;
      a || n in e ? a && (delete t[n], e[n] = !0) : t[n] = !0;
    });
  }), t;
}, Ye = function(i, t) {
  var e = Te(i), s = Te(t), n = {};
  return Object.keys(e).forEach(function(a) {
    s[a] && (n[a] = !0);
  }), n;
}, je = function(i) {
  return delete i.outerDone, delete i.innerDone, delete i.valueDone, !i.childNodes || i.childNodes.every(je);
}, j = function(i) {
  if (Object.prototype.hasOwnProperty.call(i, "data")) return { nodeName: i.nodeName === "#text" ? "#text" : "#comment", data: i.data };
  var t = { nodeName: i.nodeName };
  return Object.prototype.hasOwnProperty.call(i, "attributes") && (t.attributes = Oe({}, i.attributes)), Object.prototype.hasOwnProperty.call(i, "checked") && (t.checked = i.checked), Object.prototype.hasOwnProperty.call(i, "value") && (t.value = i.value), Object.prototype.hasOwnProperty.call(i, "selected") && (t.selected = i.selected), Object.prototype.hasOwnProperty.call(i, "childNodes") && (t.childNodes = i.childNodes.map(function(e) {
    return j(e);
  })), t;
}, ke = function(i, t) {
  if (!["nodeName", "value", "checked", "selected", "data"].every(function(n) {
    return i[n] === t[n];
  })) return !1;
  if (Object.prototype.hasOwnProperty.call(i, "data")) return !0;
  if (!!i.attributes != !!t.attributes || !!i.childNodes != !!t.childNodes) return !1;
  if (i.attributes) {
    var e = Object.keys(i.attributes), s = Object.keys(t.attributes);
    if (e.length !== s.length || !e.every(function(n) {
      return i.attributes[n] === t.attributes[n];
    })) return !1;
  }
  return !(i.childNodes && (i.childNodes.length !== t.childNodes.length || !i.childNodes.every(function(n, a) {
    return ke(n, t.childNodes[a]);
  })));
}, Se = function(i, t, e, s, n) {
  if (n === void 0 && (n = !1), !i || !t || i.nodeName !== t.nodeName) return !1;
  if (["#text", "#comment"].includes(i.nodeName)) return !!n || i.data === t.data;
  if (i.nodeName in e) return !0;
  if (i.attributes && t.attributes) {
    if (i.attributes.id) {
      if (i.attributes.id !== t.attributes.id) return !1;
      if ("".concat(i.nodeName, "#").concat(i.attributes.id) in e) return !0;
    }
    if (i.attributes.class && i.attributes.class === t.attributes.class && "".concat(i.nodeName, ".").concat(i.attributes.class.replace(/ /g, ".")) in e) return !0;
  }
  if (s) return !0;
  var a = i.childNodes ? i.childNodes.slice().reverse() : [], o = t.childNodes ? t.childNodes.slice().reverse() : [];
  if (a.length !== o.length) return !1;
  if (n) return a.every(function(r, d) {
    return r.nodeName === o[d].nodeName;
  });
  var l = Ye(a, o);
  return a.every(function(r, d) {
    return Se(r, o[d], l, !0, !0);
  });
}, be = function(i, t) {
  return ge([], new Array(i)).map(function() {
    return t;
  });
}, We = function(i, t) {
  for (var e = i.childNodes ? i.childNodes : [], s = t.childNodes ? t.childNodes : [], n = be(e.length, !1), a = be(s.length, !1), o = [], l = function() {
    return arguments[1];
  }, r = !1, d = function() {
    var c = function(p, f, m, h) {
      var g = 0, _ = [], b = p.length, u = f.length, v = ge([], new Array(b + 1)).map(function() {
        return [];
      }), V = Ye(p, f), S = b === u;
      S && p.some(function(L, P) {
        var N = Ce(L), y = Ce(f[P]);
        return N.length !== y.length ? (S = !1, !0) : (N.some(function(w, M) {
          if (w !== y[M]) return S = !1, !0;
        }), !S || void 0);
      });
      for (var C = 0; C < b; C++) for (var A = p[C], k = 0; k < u; k++) {
        var E = f[k];
        m[C] || h[k] || !Se(A, E, V, S) ? v[C + 1][k + 1] = 0 : (v[C + 1][k + 1] = v[C][k] ? v[C][k] + 1 : 1, v[C + 1][k + 1] >= g && (g = v[C + 1][k + 1], _ = [C + 1, k + 1]));
      }
      return g !== 0 && { oldValue: _[0] - g, newValue: _[1] - g, length: g };
    }(e, s, n, a);
    c ? (o.push(c), ge([], new Array(c.length)).map(l).forEach(function(p) {
      return function(f, m, h, g) {
        f[h.oldValue + g] = !0, m[h.newValue + g] = !0;
      }(n, a, c, p);
    })) : r = !0;
  }; !r; ) d();
  return i.subsets = o, i.subsetsAge = 100, o;
}, Je = function() {
  function i() {
    this.list = [];
  }
  return i.prototype.add = function(t) {
    var e;
    (e = this.list).push.apply(e, t);
  }, i.prototype.forEach = function(t) {
    this.list.forEach(function(e) {
      return t(e);
    });
  }, i;
}();
function Ee(i, t) {
  var e, s, n = i;
  for (t = t.slice(); t.length > 0; ) s = t.splice(0, 1)[0], e = n, n = n.childNodes ? n.childNodes[s] : void 0;
  return { node: n, parentNode: e, nodeIndex: s };
}
function Qe(i, t, e) {
  return t.forEach(function(s) {
    (function(n, a, o) {
      var l, r, d, c;
      if (![o._const.addElement, o._const.addTextElement].includes(a[o._const.action])) {
        var p = Ee(n, a[o._const.route]);
        r = p.node, d = p.parentNode, c = p.nodeIndex;
      }
      var f, m, h = [], g = { diff: a, node: r };
      if (o.preVirtualDiffApply(g)) return !0;
      switch (a[o._const.action]) {
        case o._const.addAttribute:
          r.attributes || (r.attributes = {}), r.attributes[a[o._const.name]] = a[o._const.value], a[o._const.name] === "checked" ? r.checked = !0 : a[o._const.name] === "selected" ? r.selected = !0 : r.nodeName === "INPUT" && a[o._const.name] === "value" && (r.value = a[o._const.value]);
          break;
        case o._const.modifyAttribute:
          r.attributes[a[o._const.name]] = a[o._const.newValue];
          break;
        case o._const.removeAttribute:
          delete r.attributes[a[o._const.name]], Object.keys(r.attributes).length === 0 && delete r.attributes, a[o._const.name] === "checked" ? r.checked = !1 : a[o._const.name] === "selected" ? delete r.selected : r.nodeName === "INPUT" && a[o._const.name] === "value" && delete r.value;
          break;
        case o._const.modifyTextElement:
          r.data = a[o._const.newValue], d.nodeName === "TEXTAREA" && (d.value = a[o._const.newValue]);
          break;
        case o._const.modifyValue:
          r.value = a[o._const.newValue];
          break;
        case o._const.modifyComment:
          r.data = a[o._const.newValue];
          break;
        case o._const.modifyChecked:
          r.checked = a[o._const.newValue];
          break;
        case o._const.modifySelected:
          r.selected = a[o._const.newValue];
          break;
        case o._const.replaceElement:
          f = j(a[o._const.newValue]), d.childNodes[c] = f;
          break;
        case o._const.relocateGroup:
          r.childNodes.splice(a[o._const.from], a[o._const.groupLength]).reverse().forEach(function(u) {
            return r.childNodes.splice(a[o._const.to], 0, u);
          }), r.subsets && r.subsets.forEach(function(u) {
            if (a[o._const.from] < a[o._const.to] && u.oldValue <= a[o._const.to] && u.oldValue > a[o._const.from]) u.oldValue -= a[o._const.groupLength], (v = u.oldValue + u.length - a[o._const.to]) > 0 && (h.push({ oldValue: a[o._const.to] + a[o._const.groupLength], newValue: u.newValue + u.length - v, length: v }), u.length -= v);
            else if (a[o._const.from] > a[o._const.to] && u.oldValue > a[o._const.to] && u.oldValue < a[o._const.from]) {
              var v;
              u.oldValue += a[o._const.groupLength], (v = u.oldValue + u.length - a[o._const.to]) > 0 && (h.push({ oldValue: a[o._const.to] + a[o._const.groupLength], newValue: u.newValue + u.length - v, length: v }), u.length -= v);
            } else u.oldValue === a[o._const.from] && (u.oldValue = a[o._const.to]);
          });
          break;
        case o._const.removeElement:
          d.childNodes.splice(c, 1), d.subsets && d.subsets.forEach(function(u) {
            u.oldValue > c ? u.oldValue -= 1 : u.oldValue === c ? u.delete = !0 : u.oldValue < c && u.oldValue + u.length > c && (u.oldValue + u.length - 1 === c ? u.length-- : (h.push({ newValue: u.newValue + c - u.oldValue, oldValue: c, length: u.length - c + u.oldValue - 1 }), u.length = c - u.oldValue));
          }), r = d;
          break;
        case o._const.addElement:
          var _ = (m = a[o._const.route].slice()).splice(m.length - 1, 1)[0];
          r = (l = Ee(n, m)) === null || l === void 0 ? void 0 : l.node, f = j(a[o._const.element]), r.childNodes || (r.childNodes = []), _ >= r.childNodes.length ? r.childNodes.push(f) : r.childNodes.splice(_, 0, f), r.subsets && r.subsets.forEach(function(u) {
            if (u.oldValue >= _) u.oldValue += 1;
            else if (u.oldValue < _ && u.oldValue + u.length > _) {
              var v = u.oldValue + u.length - _;
              h.push({ newValue: u.newValue + u.length - v, oldValue: _ + 1, length: v }), u.length -= v;
            }
          });
          break;
        case o._const.removeTextElement:
          d.childNodes.splice(c, 1), d.nodeName === "TEXTAREA" && delete d.value, d.subsets && d.subsets.forEach(function(u) {
            u.oldValue > c ? u.oldValue -= 1 : u.oldValue === c ? u.delete = !0 : u.oldValue < c && u.oldValue + u.length > c && (u.oldValue + u.length - 1 === c ? u.length-- : (h.push({ newValue: u.newValue + c - u.oldValue, oldValue: c, length: u.length - c + u.oldValue - 1 }), u.length = c - u.oldValue));
          }), r = d;
          break;
        case o._const.addTextElement:
          var b = (m = a[o._const.route].slice()).splice(m.length - 1, 1)[0];
          f = { nodeName: "#text", data: a[o._const.value] }, (r = Ee(n, m).node).childNodes || (r.childNodes = []), b >= r.childNodes.length ? r.childNodes.push(f) : r.childNodes.splice(b, 0, f), r.nodeName === "TEXTAREA" && (r.value = a[o._const.newValue]), r.subsets && r.subsets.forEach(function(u) {
            if (u.oldValue >= b && (u.oldValue += 1), u.oldValue < b && u.oldValue + u.length > b) {
              var v = u.oldValue + u.length - b;
              h.push({ newValue: u.newValue + u.length - v, oldValue: b + 1, length: v }), u.length -= v;
            }
          });
          break;
        default:
          console.log("unknown action");
      }
      r.subsets && (r.subsets = r.subsets.filter(function(u) {
        return !u.delete && u.oldValue !== u.newValue;
      }), h.length && (r.subsets = r.subsets.concat(h))), o.postVirtualDiffApply({ node: g.node, diff: g.diff, newNode: f });
    })(i, s, e);
  }), !0;
}
function ie(i, t) {
  t === void 0 && (t = { valueDiffing: !0, simplifiedElementCheck: !0 });
  var e = { nodeName: i.nodeName };
  return Y(i, t.simplifiedElementCheck, "Text", "Comment") ? e.data = i.data : (i.attributes && i.attributes.length > 0 && (e.attributes = {}, Array.prototype.slice.call(i.attributes).forEach(function(s) {
    return e.attributes[s.name] = s.value;
  })), i.childNodes && i.childNodes.length > 0 && (e.childNodes = [], Array.prototype.slice.call(i.childNodes).forEach(function(s) {
    return e.childNodes.push(ie(s, t));
  })), t.valueDiffing && (Y(i, t.simplifiedElementCheck, "HTMLTextAreaElement") && (e.value = i.value), Y(i, t.simplifiedElementCheck, "HTMLInputElement") && ["radio", "checkbox"].includes(i.type.toLowerCase()) && i.checked !== void 0 ? e.checked = i.checked : Y(i, t.simplifiedElementCheck, "HTMLButtonElement", "HTMLDataElement", "HTMLInputElement", "HTMLLIElement", "HTMLMeterElement", "HTMLOptionElement", "HTMLProgressElement", "HTMLParamElement") && (e.value = i.value), Y(i, t.simplifiedElementCheck, "HTMLOptionElement") && (e.selected = i.selected))), e;
}
var Xe = /<\s*\/*[a-zA-Z:_][a-zA-Z0-9:_\-.]*\s*(?:"[^"]*"['"]*|'[^']*'['"]*|[^'"/>])*\/*\s*>|<!--(?:.|\n|\r)*?-->/g, Ze = /\s([^'"/\s><]+?)[\s/>]|([^\s=]+)=\s?("[^"]*"|'[^']*')/g;
function Ae(i) {
  return i.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
var Ge = { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, menuItem: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 }, Le = function(i, t) {
  var e = { nodeName: "", attributes: {} }, s = !1, n = i.match(/<\/?([^\s]+?)[/\s>]/);
  if (n && (e.nodeName = t || n[1] === "svg" ? n[1] : n[1].toUpperCase(), (Ge[n[1]] || i.charAt(i.length - 2) === "/") && (s = !0), e.nodeName.startsWith("!--"))) {
    var a = i.indexOf("-->");
    return { type: "comment", node: { nodeName: "#comment", data: a !== -1 ? i.slice(4, a) : "" }, voidElement: s };
  }
  for (var o = new RegExp(Ze), l = null, r = !1; !r; ) if ((l = o.exec(i)) === null) r = !0;
  else if (l[0].trim()) if (l[1]) {
    var d = l[1].trim(), c = [d, ""];
    d.indexOf("=") > -1 && (c = d.split("=")), e.attributes[c[0]] = c[1], o.lastIndex--;
  } else l[2] && (e.attributes[l[2]] = l[3].trim().substring(1, l[3].length - 1));
  return { type: "tag", node: e, voidElement: s };
}, ne = function(i, t) {
  t === void 0 && (t = { valueDiffing: !0, caseSensitive: !1 });
  var e, s = [], n = -1, a = [], o = !1;
  if (i.indexOf("<") !== 0) {
    var l = i.indexOf("<");
    s.push({ nodeName: "#text", data: l === -1 ? i : i.substring(0, l) });
  }
  return i.replace(Xe, function(r, d) {
    var c = r.charAt(1) !== "/", p = r.startsWith("<!--"), f = d + r.length, m = i.charAt(f);
    if (p) {
      var h = Le(r, t.caseSensitive).node;
      if (n < 0) return s.push(h), "";
      var g = a[n];
      return g && h.nodeName && (g.node.childNodes || (g.node.childNodes = []), g.node.childNodes.push(h)), "";
    }
    if (c) {
      if ((e = Le(r, t.caseSensitive || o)).node.nodeName === "svg" && (o = !0), n++, !e.voidElement && m && m !== "<") {
        e.node.childNodes || (e.node.childNodes = []);
        var _ = Ae(i.slice(f, i.indexOf("<", f)));
        e.node.childNodes.push({ nodeName: "#text", data: _ }), t.valueDiffing && e.node.nodeName === "TEXTAREA" && (e.node.value = _);
      }
      n === 0 && e.node.nodeName && s.push(e.node);
      var b = a[n - 1];
      b && e.node.nodeName && (b.node.childNodes || (b.node.childNodes = []), b.node.childNodes.push(e.node)), a[n] = e;
    }
    if ((!c || e.voidElement) && (n > -1 && (e.voidElement || t.caseSensitive && e.node.nodeName === r.slice(2, -1) || !t.caseSensitive && e.node.nodeName.toUpperCase() === r.slice(2, -1).toUpperCase()) && --n > -1 && (e.node.nodeName === "svg" && (o = !1), e = a[n]), m !== "<" && m)) {
      var u = n === -1 ? s : a[n].node.childNodes || [], v = i.indexOf("<", f);
      _ = Ae(i.slice(f, v === -1 ? void 0 : v)), u.push({ nodeName: "#text", data: _ });
    }
    return "";
  }), s[0];
}, Ke = function() {
  function i(t, e, s) {
    this.options = s, this.t1 = typeof Element < "u" && Y(t, this.options.simplifiedElementCheck, "Element") ? ie(t, this.options) : typeof t == "string" ? ne(t, this.options) : JSON.parse(JSON.stringify(t)), this.t2 = typeof Element < "u" && Y(e, this.options.simplifiedElementCheck, "Element") ? ie(e, this.options) : typeof e == "string" ? ne(e, this.options) : JSON.parse(JSON.stringify(e)), this.diffcount = 0, this.foundAll = !1, this.debug && (this.t1Orig = typeof Element < "u" && Y(t, this.options.simplifiedElementCheck, "Element") ? ie(t, this.options) : typeof t == "string" ? ne(t, this.options) : JSON.parse(JSON.stringify(t)), this.t2Orig = typeof Element < "u" && Y(e, this.options.simplifiedElementCheck, "Element") ? ie(e, this.options) : typeof e == "string" ? ne(e, this.options) : JSON.parse(JSON.stringify(e))), this.tracker = new Je();
  }
  return i.prototype.init = function() {
    return this.findDiffs(this.t1, this.t2);
  }, i.prototype.findDiffs = function(t, e) {
    var s;
    do {
      if (this.options.debug && (this.diffcount += 1, this.diffcount > this.options.diffcap)) throw new Error("surpassed diffcap:".concat(JSON.stringify(this.t1Orig), " -> ").concat(JSON.stringify(this.t2Orig)));
      (s = this.findNextDiff(t, e, [])).length === 0 && (ke(t, e) || (this.foundAll ? console.error("Could not find remaining diffs!") : (this.foundAll = !0, je(t), s = this.findNextDiff(t, e, [])))), s.length > 0 && (this.foundAll = !1, this.tracker.add(s), Qe(t, s, this.options));
    } while (s.length > 0);
    return this.tracker.list;
  }, i.prototype.findNextDiff = function(t, e, s) {
    var n, a;
    if (this.options.maxDepth && s.length > this.options.maxDepth) return [];
    if (!t.outerDone) {
      if (n = this.findOuterDiff(t, e, s), this.options.filterOuterDiff && (a = this.options.filterOuterDiff(t, e, n)) && (n = a), n.length > 0) return t.outerDone = !0, n;
      t.outerDone = !0;
    }
    if (Object.prototype.hasOwnProperty.call(t, "data")) return [];
    if (!t.innerDone) {
      if ((n = this.findInnerDiff(t, e, s)).length > 0) return n;
      t.innerDone = !0;
    }
    if (this.options.valueDiffing && !t.valueDone) {
      if ((n = this.findValueDiff(t, e, s)).length > 0) return t.valueDone = !0, n;
      t.valueDone = !0;
    }
    return [];
  }, i.prototype.findOuterDiff = function(t, e, s) {
    var n, a, o, l, r, d, c = [];
    if (t.nodeName !== e.nodeName) {
      if (!s.length) throw new Error("Top level nodes have to be of the same kind.");
      return [new H().setValue(this.options._const.action, this.options._const.replaceElement).setValue(this.options._const.oldValue, j(t)).setValue(this.options._const.newValue, j(e)).setValue(this.options._const.route, s)];
    }
    if (s.length && this.options.diffcap < Math.abs((t.childNodes || []).length - (e.childNodes || []).length)) return [new H().setValue(this.options._const.action, this.options._const.replaceElement).setValue(this.options._const.oldValue, j(t)).setValue(this.options._const.newValue, j(e)).setValue(this.options._const.route, s)];
    if (Object.prototype.hasOwnProperty.call(t, "data") && t.data !== e.data) return t.nodeName === "#text" ? [new H().setValue(this.options._const.action, this.options._const.modifyTextElement).setValue(this.options._const.route, s).setValue(this.options._const.oldValue, t.data).setValue(this.options._const.newValue, e.data)] : [new H().setValue(this.options._const.action, this.options._const.modifyComment).setValue(this.options._const.route, s).setValue(this.options._const.oldValue, t.data).setValue(this.options._const.newValue, e.data)];
    for (a = t.attributes ? Object.keys(t.attributes).sort() : [], o = e.attributes ? Object.keys(e.attributes).sort() : [], l = a.length, d = 0; d < l; d++) n = a[d], (r = o.indexOf(n)) === -1 ? c.push(new H().setValue(this.options._const.action, this.options._const.removeAttribute).setValue(this.options._const.route, s).setValue(this.options._const.name, n).setValue(this.options._const.value, t.attributes[n])) : (o.splice(r, 1), t.attributes[n] !== e.attributes[n] && c.push(new H().setValue(this.options._const.action, this.options._const.modifyAttribute).setValue(this.options._const.route, s).setValue(this.options._const.name, n).setValue(this.options._const.oldValue, t.attributes[n]).setValue(this.options._const.newValue, e.attributes[n])));
    for (l = o.length, d = 0; d < l; d++) n = o[d], c.push(new H().setValue(this.options._const.action, this.options._const.addAttribute).setValue(this.options._const.route, s).setValue(this.options._const.name, n).setValue(this.options._const.value, e.attributes[n]));
    return c;
  }, i.prototype.findInnerDiff = function(t, e, s) {
    var n = t.childNodes ? t.childNodes.slice() : [], a = e.childNodes ? e.childNodes.slice() : [], o = Math.max(n.length, a.length), l = Math.abs(n.length - a.length), r = [], d = 0;
    if (!this.options.maxChildCount || o < this.options.maxChildCount) {
      var c = !!(t.subsets && t.subsetsAge--), p = c ? t.subsets : t.childNodes && e.childNodes ? We(t, e) : [];
      if (p.length > 0 && (r = this.attemptGroupRelocation(t, e, p, s, c)).length > 0) return r;
    }
    for (var f = 0; f < o; f += 1) {
      var m = n[f], h = a[f];
      l && (m && !h ? m.nodeName === "#text" ? (r.push(new H().setValue(this.options._const.action, this.options._const.removeTextElement).setValue(this.options._const.route, s.concat(d)).setValue(this.options._const.value, m.data)), d -= 1) : (r.push(new H().setValue(this.options._const.action, this.options._const.removeElement).setValue(this.options._const.route, s.concat(d)).setValue(this.options._const.element, j(m))), d -= 1) : h && !m && (h.nodeName === "#text" ? r.push(new H().setValue(this.options._const.action, this.options._const.addTextElement).setValue(this.options._const.route, s.concat(d)).setValue(this.options._const.value, h.data)) : r.push(new H().setValue(this.options._const.action, this.options._const.addElement).setValue(this.options._const.route, s.concat(d)).setValue(this.options._const.element, j(h))))), m && h && (!this.options.maxChildCount || o < this.options.maxChildCount ? r = r.concat(this.findNextDiff(m, h, s.concat(d))) : ke(m, h) || (n.length > a.length ? (m.nodeName === "#text" ? r.push(new H().setValue(this.options._const.action, this.options._const.removeTextElement).setValue(this.options._const.route, s.concat(d)).setValue(this.options._const.value, m.data)) : r.push(new H().setValue(this.options._const.action, this.options._const.removeElement).setValue(this.options._const.element, j(m)).setValue(this.options._const.route, s.concat(d))), n.splice(f, 1), f -= 1, d -= 1, l -= 1) : n.length < a.length ? (r = r.concat([new H().setValue(this.options._const.action, this.options._const.addElement).setValue(this.options._const.element, j(h)).setValue(this.options._const.route, s.concat(d))]), n.splice(f, 0, j(h)), l -= 1) : r = r.concat([new H().setValue(this.options._const.action, this.options._const.replaceElement).setValue(this.options._const.oldValue, j(m)).setValue(this.options._const.newValue, j(h)).setValue(this.options._const.route, s.concat(d))]))), d += 1;
    }
    return t.innerDone = !0, r;
  }, i.prototype.attemptGroupRelocation = function(t, e, s, n, a) {
    for (var o, l, r, d, c, p = function(C, A, k) {
      var E = C.childNodes ? be(C.childNodes.length, !0) : [], L = A.childNodes ? be(A.childNodes.length, !0) : [], P = 0;
      return k.forEach(function(N) {
        for (var y = N.oldValue + N.length, w = N.newValue + N.length, M = N.oldValue; M < y; M += 1) E[M] = P;
        for (M = N.newValue; M < w; M += 1) L[M] = P;
        P += 1;
      }), { gaps1: E, gaps2: L };
    }(t, e, s), f = p.gaps1, m = p.gaps2, h = t.childNodes.slice(), g = e.childNodes.slice(), _ = Math.min(f.length, m.length), b = [], u = 0, v = 0; u < _; v += 1, u += 1) if (!a || f[u] !== !0 && m[u] !== !0) {
      if (f[v] === !0) if ((d = h[v]).nodeName === "#text") if (g[u].nodeName === "#text") {
        if (d.data !== g[u].data) {
          for (var V = v; h.length > V + 1 && h[V + 1].nodeName === "#text"; ) if (V += 1, g[u].data === h[V].data) {
            c = !0;
            break;
          }
          c || b.push(new H().setValue(this.options._const.action, this.options._const.modifyTextElement).setValue(this.options._const.route, n.concat(v)).setValue(this.options._const.oldValue, d.data).setValue(this.options._const.newValue, g[u].data));
        }
      } else b.push(new H().setValue(this.options._const.action, this.options._const.removeTextElement).setValue(this.options._const.route, n.concat(v)).setValue(this.options._const.value, d.data)), f.splice(v, 1), h.splice(v, 1), _ = Math.min(f.length, m.length), v -= 1, u -= 1;
      else m[u] === !0 ? b.push(new H().setValue(this.options._const.action, this.options._const.replaceElement).setValue(this.options._const.oldValue, j(d)).setValue(this.options._const.newValue, j(g[u])).setValue(this.options._const.route, n.concat(v))) : (b.push(new H().setValue(this.options._const.action, this.options._const.removeElement).setValue(this.options._const.route, n.concat(v)).setValue(this.options._const.element, j(d))), f.splice(v, 1), h.splice(v, 1), _ = Math.min(f.length, m.length), v -= 1, u -= 1);
      else if (m[u] === !0) (d = g[u]).nodeName === "#text" ? (b.push(new H().setValue(this.options._const.action, this.options._const.addTextElement).setValue(this.options._const.route, n.concat(v)).setValue(this.options._const.value, d.data)), f.splice(v, 0, !0), h.splice(v, 0, { nodeName: "#text", data: d.data }), _ = Math.min(f.length, m.length)) : (b.push(new H().setValue(this.options._const.action, this.options._const.addElement).setValue(this.options._const.route, n.concat(v)).setValue(this.options._const.element, j(d))), f.splice(v, 0, !0), h.splice(v, 0, j(d)), _ = Math.min(f.length, m.length));
      else if (f[v] !== m[u]) {
        if (b.length > 0) return b;
        if (r = s[f[v]], (l = Math.min(r.newValue, h.length - r.length)) !== r.oldValue && l > -1) {
          o = !1;
          for (var S = 0; S < r.length; S += 1) Se(h[l + S], h[r.oldValue + S], {}, !1, !0) || (o = !0);
          if (o) return [new H().setValue(this.options._const.action, this.options._const.relocateGroup).setValue(this.options._const.groupLength, r.length).setValue(this.options._const.from, r.oldValue).setValue(this.options._const.to, l).setValue(this.options._const.route, n)];
        }
      }
    }
    return b;
  }, i.prototype.findValueDiff = function(t, e, s) {
    var n = [];
    return t.selected !== e.selected && n.push(new H().setValue(this.options._const.action, this.options._const.modifySelected).setValue(this.options._const.oldValue, t.selected).setValue(this.options._const.newValue, e.selected).setValue(this.options._const.route, s)), (t.value || e.value) && t.value !== e.value && t.nodeName !== "OPTION" && n.push(new H().setValue(this.options._const.action, this.options._const.modifyValue).setValue(this.options._const.oldValue, t.value || "").setValue(this.options._const.newValue, e.value || "").setValue(this.options._const.route, s)), t.checked !== e.checked && n.push(new H().setValue(this.options._const.action, this.options._const.modifyChecked).setValue(this.options._const.oldValue, t.checked).setValue(this.options._const.newValue, e.checked).setValue(this.options._const.route, s)), n;
  }, i;
}(), et = { debug: !1, diffcap: 10, maxDepth: !1, maxChildCount: 50, valueDiffing: !0, simplifiedElementCheck: !1, textDiff: function(i, t, e, s) {
  i.data = s;
}, preVirtualDiffApply: function() {
}, postVirtualDiffApply: function() {
}, preDiffApply: function() {
}, postDiffApply: function() {
}, filterOuterDiff: null, compress: !1, _const: !1, document: !(typeof window > "u" || !window.document) && window.document, components: [] }, tt = function() {
  function i(t) {
    if (t === void 0 && (t = {}), Object.entries(et).forEach(function(n) {
      var a = n[0], o = n[1];
      Object.prototype.hasOwnProperty.call(t, a) || (t[a] = o);
    }), !t._const) {
      var e = ["addAttribute", "modifyAttribute", "removeAttribute", "modifyTextElement", "relocateGroup", "removeElement", "addElement", "removeTextElement", "addTextElement", "replaceElement", "modifyValue", "modifyChecked", "modifySelected", "modifyComment", "action", "route", "oldValue", "newValue", "element", "group", "groupLength", "from", "to", "name", "value", "data", "attributes", "nodeName", "childNodes", "checked", "selected"], s = {};
      t.compress ? e.forEach(function(n, a) {
        return s[n] = a;
      }) : e.forEach(function(n) {
        return s[n] = n;
      }), t._const = s;
    }
    this.options = t;
  }
  return i.prototype.apply = function(t, e) {
    return function(s, n, a) {
      return n.every(function(o) {
        return Z(s, o, a);
      });
    }(t, e, this.options);
  }, i.prototype.undo = function(t, e) {
    return Ue(t, e, this.options);
  }, i.prototype.diff = function(t, e) {
    return new Ke(t, e, this.options).init();
  }, i;
}();
const $e = (i, t, e, { classes: s, format: n, hiddenHeader: a, sortable: o, scrollY: l, type: r }, { noColumnWidths: d, unhideHeader: c }) => ({ nodeName: "TR", childNodes: i.map((p, f) => {
  var _;
  const m = t[f] || { sortable: !0 };
  if (m.hidden || ((_ = p.attributes) == null ? void 0 : _["data-colspan-placeholder"]) === "true") return;
  const h = p.attributes ? { ...p.attributes } : {};
  if (m.sortable && o && (!l.length || c) && (m.filter ? h["data-filterable"] = "true" : h["data-sortable"] = "true"), m.headerClass && (h.class = Q(h.class, m.headerClass)), e.sort && e.sort.column === f) {
    const b = e.sort.dir === "asc" ? s.ascending : s.descending;
    h.class = Q(h.class, b), h["aria-sort"] = e.sort.dir === "asc" ? "ascending" : "descending";
  } else e.filters[f] && (h.class = Q(h.class, s.filterActive));
  if (e.widths[f] && !d) {
    const b = `width: ${e.widths[f]}%;`;
    h.style = Q(h.style, b);
  }
  if (l.length && !c) {
    const b = "padding-bottom: 0;padding-top: 0;border: 0;";
    h.style = Q(h.style, b);
  }
  const g = p.type === "html" ? p.data : [{ nodeName: "#text", data: p.text ?? String(p.data) }];
  return { nodeName: "TH", attributes: h, childNodes: !a && !l.length || c ? m.sortable && o ? [{ nodeName: "BUTTON", attributes: { class: m.filter ? s.filter : s.sorter }, childNodes: g }] : g : [{ nodeName: "#text", data: "" }] };
}).filter((p) => p) }), Pe = (i, t, e, s, n, a, { classes: o, hiddenHeader: l, header: r, footer: d, format: c, sortable: p, scrollY: f, type: m, rowRender: h, tabIndex: g }, { noColumnWidths: _, unhideHeader: b, renderHeader: u }, v, V) => {
  const S = { nodeName: "TABLE", attributes: { ...i }, childNodes: [{ nodeName: "TBODY", childNodes: e.map(({ row: C, index: A }) => {
    const k = { nodeName: "TR", attributes: { ...C.attributes, "data-index": String(A) }, childNodes: C.cells.map((E, L) => {
      var y, w;
      const P = s[L] || { type: m, format: c, sortable: !0, searchable: !0 };
      if (P.hidden || ((y = E.attributes) == null ? void 0 : y["data-colspan-placeholder"]) === "true" || ((w = E.attributes) == null ? void 0 : w["data-rowspan-placeholder"]) === "true") return;
      const N = { nodeName: "TD", attributes: E.attributes ? { ...E.attributes } : {}, childNodes: P.type === "html" ? E.data : [{ nodeName: "#text", data: z(E) }] };
      if (r || d || !n.widths[L] || _ || (N.attributes.style = Q(N.attributes.style, `width: ${n.widths[L]}%;`)), P.cellClass && (N.attributes.class = Q(N.attributes.class, P.cellClass)), P.render) {
        const M = P.render(E.data, N, A, L);
        if (M) {
          if (typeof M != "string") return M;
          {
            const D = ne(`<td>${M}</td>`);
            D.childNodes.length === 1 && ["#text", "#comment"].includes(D.childNodes[0].nodeName) ? N.childNodes[0].data = M : N.childNodes = D.childNodes;
          }
        }
      }
      return N;
    }).filter((E) => E) };
    if (A === a && (k.attributes.class = Q(k.attributes.class, o.cursor)), h) {
      const E = h(C, k, A);
      if (E) {
        if (typeof E != "string") return E;
        {
          const L = ne(`<tr>${E}</tr>`);
          !L.childNodes || L.childNodes.length === 1 && ["#text", "#comment"].includes(L.childNodes[0].nodeName) ? k.childNodes[0].data = E : k.childNodes = L.childNodes;
        }
      }
    }
    return k;
  }) }] };
  if (S.attributes.class = Q(S.attributes.class, o.table), r || d || u) {
    const C = $e(t, s, n, { classes: o, hiddenHeader: l, sortable: p, scrollY: f }, { noColumnWidths: _, unhideHeader: b });
    if (r || u) {
      const A = { nodeName: "THEAD", childNodes: [C] };
      !f.length && !l || b || (A.attributes = { style: "height: 0px;" }), S.childNodes.unshift(A);
    }
    if (d) {
      const A = { nodeName: "TFOOT", childNodes: [r ? structuredClone(C) : C] };
      !f.length && !l || b || (A.attributes = { style: "height: 0px;" }), S.childNodes.push(A);
    }
  }
  return v.forEach((C) => S.childNodes.push(C)), V.forEach((C) => S.childNodes.push(C)), g !== !1 && (S.attributes.tabindex = String(g)), S;
};
function Fe(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
var de = Fe(function() {
  var i = 1e3, t = 6e4, e = 36e5, s = "millisecond", n = "second", a = "minute", o = "hour", l = "day", r = "week", d = "month", c = "quarter", p = "year", f = "date", m = "Invalid Date", h = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, g = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, _ = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(N) {
    var y = ["th", "st", "nd", "rd"], w = N % 100;
    return "[" + N + (y[(w - 20) % 10] || y[w] || y[0]) + "]";
  } }, b = function(N, y, w) {
    var M = String(N);
    return !M || M.length >= y ? N : "" + Array(y + 1 - M.length).join(w) + N;
  }, u = { s: b, z: function(N) {
    var y = -N.utcOffset(), w = Math.abs(y), M = Math.floor(w / 60), D = w % 60;
    return (y <= 0 ? "+" : "-") + b(M, 2, "0") + ":" + b(D, 2, "0");
  }, m: function N(y, w) {
    if (y.date() < w.date()) return -N(w, y);
    var M = 12 * (w.year() - y.year()) + (w.month() - y.month()), D = y.clone().add(M, d), O = w - D < 0, $ = y.clone().add(M + (O ? -1 : 1), d);
    return +(-(M + (w - D) / (O ? D - $ : $ - D)) || 0);
  }, a: function(N) {
    return N < 0 ? Math.ceil(N) || 0 : Math.floor(N);
  }, p: function(N) {
    return { M: d, y: p, w: r, d: l, D: f, h: o, m: a, s: n, ms: s, Q: c }[N] || String(N || "").toLowerCase().replace(/s$/, "");
  }, u: function(N) {
    return N === void 0;
  } }, v = "en", V = {};
  V[v] = _;
  var S = "$isDayjsObject", C = function(N) {
    return N instanceof L || !(!N || !N[S]);
  }, A = function N(y, w, M) {
    var D;
    if (!y) return v;
    if (typeof y == "string") {
      var O = y.toLowerCase();
      V[O] && (D = O), w && (V[O] = w, D = O);
      var $ = y.split("-");
      if (!D && $.length > 1) return N($[0]);
    } else {
      var T = y.name;
      V[T] = y, D = T;
    }
    return !M && D && (v = D), D || !M && v;
  }, k = function(N, y) {
    if (C(N)) return N.clone();
    var w = typeof y == "object" ? y : {};
    return w.date = N, w.args = arguments, new L(w);
  }, E = u;
  E.l = A, E.i = C, E.w = function(N, y) {
    return k(N, { locale: y.$L, utc: y.$u, x: y.$x, $offset: y.$offset });
  };
  var L = function() {
    function N(w) {
      this.$L = A(w.locale, null, !0), this.parse(w), this.$x = this.$x || w.x || {}, this[S] = !0;
    }
    var y = N.prototype;
    return y.parse = function(w) {
      this.$d = function(M) {
        var D = M.date, O = M.utc;
        if (D === null) return /* @__PURE__ */ new Date(NaN);
        if (E.u(D)) return /* @__PURE__ */ new Date();
        if (D instanceof Date) return new Date(D);
        if (typeof D == "string" && !/Z$/i.test(D)) {
          var $ = D.match(h);
          if ($) {
            var T = $[2] - 1 || 0, R = ($[7] || "0").substring(0, 3);
            return O ? new Date(Date.UTC($[1], T, $[3] || 1, $[4] || 0, $[5] || 0, $[6] || 0, R)) : new Date($[1], T, $[3] || 1, $[4] || 0, $[5] || 0, $[6] || 0, R);
          }
        }
        return new Date(D);
      }(w), this.init();
    }, y.init = function() {
      var w = this.$d;
      this.$y = w.getFullYear(), this.$M = w.getMonth(), this.$D = w.getDate(), this.$W = w.getDay(), this.$H = w.getHours(), this.$m = w.getMinutes(), this.$s = w.getSeconds(), this.$ms = w.getMilliseconds();
    }, y.$utils = function() {
      return E;
    }, y.isValid = function() {
      return this.$d.toString() !== m;
    }, y.isSame = function(w, M) {
      var D = k(w);
      return this.startOf(M) <= D && D <= this.endOf(M);
    }, y.isAfter = function(w, M) {
      return k(w) < this.startOf(M);
    }, y.isBefore = function(w, M) {
      return this.endOf(M) < k(w);
    }, y.$g = function(w, M, D) {
      return E.u(w) ? this[M] : this.set(D, w);
    }, y.unix = function() {
      return Math.floor(this.valueOf() / 1e3);
    }, y.valueOf = function() {
      return this.$d.getTime();
    }, y.startOf = function(w, M) {
      var D = this, O = !!E.u(M) || M, $ = E.p(w), T = function(X, q) {
        var J = E.w(D.$u ? Date.UTC(D.$y, q, X) : new Date(D.$y, q, X), D);
        return O ? J : J.endOf(l);
      }, R = function(X, q) {
        return E.w(D.toDate()[X].apply(D.toDate("s"), (O ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(q)), D);
      }, I = this.$W, F = this.$M, W = this.$D, te = "set" + (this.$u ? "UTC" : "");
      switch ($) {
        case p:
          return O ? T(1, 0) : T(31, 11);
        case d:
          return O ? T(1, F) : T(0, F + 1);
        case r:
          var G = this.$locale().weekStart || 0, oe = (I < G ? I + 7 : I) - G;
          return T(O ? W - oe : W + (6 - oe), F);
        case l:
        case f:
          return R(te + "Hours", 0);
        case o:
          return R(te + "Minutes", 1);
        case a:
          return R(te + "Seconds", 2);
        case n:
          return R(te + "Milliseconds", 3);
        default:
          return this.clone();
      }
    }, y.endOf = function(w) {
      return this.startOf(w, !1);
    }, y.$set = function(w, M) {
      var D, O = E.p(w), $ = "set" + (this.$u ? "UTC" : ""), T = (D = {}, D[l] = $ + "Date", D[f] = $ + "Date", D[d] = $ + "Month", D[p] = $ + "FullYear", D[o] = $ + "Hours", D[a] = $ + "Minutes", D[n] = $ + "Seconds", D[s] = $ + "Milliseconds", D)[O], R = O === l ? this.$D + (M - this.$W) : M;
      if (O === d || O === p) {
        var I = this.clone().set(f, 1);
        I.$d[T](R), I.init(), this.$d = I.set(f, Math.min(this.$D, I.daysInMonth())).$d;
      } else T && this.$d[T](R);
      return this.init(), this;
    }, y.set = function(w, M) {
      return this.clone().$set(w, M);
    }, y.get = function(w) {
      return this[E.p(w)]();
    }, y.add = function(w, M) {
      var D, O = this;
      w = Number(w);
      var $ = E.p(M), T = function(F) {
        var W = k(O);
        return E.w(W.date(W.date() + Math.round(F * w)), O);
      };
      if ($ === d) return this.set(d, this.$M + w);
      if ($ === p) return this.set(p, this.$y + w);
      if ($ === l) return T(1);
      if ($ === r) return T(7);
      var R = (D = {}, D[a] = t, D[o] = e, D[n] = i, D)[$] || 1, I = this.$d.getTime() + w * R;
      return E.w(I, this);
    }, y.subtract = function(w, M) {
      return this.add(-1 * w, M);
    }, y.format = function(w) {
      var M = this, D = this.$locale();
      if (!this.isValid()) return D.invalidDate || m;
      var O = w || "YYYY-MM-DDTHH:mm:ssZ", $ = E.z(this), T = this.$H, R = this.$m, I = this.$M, F = D.weekdays, W = D.months, te = D.meridiem, G = function(q, J, K, se) {
        return q && (q[J] || q(M, O)) || K[J].slice(0, se);
      }, oe = function(q) {
        return E.s(T % 12 || 12, q, "0");
      }, X = te || function(q, J, K) {
        var se = q < 12 ? "AM" : "PM";
        return K ? se.toLowerCase() : se;
      };
      return O.replace(g, function(q, J) {
        return J || function(K) {
          switch (K) {
            case "YY":
              return String(M.$y).slice(-2);
            case "YYYY":
              return E.s(M.$y, 4, "0");
            case "M":
              return I + 1;
            case "MM":
              return E.s(I + 1, 2, "0");
            case "MMM":
              return G(D.monthsShort, I, W, 3);
            case "MMMM":
              return G(W, I);
            case "D":
              return M.$D;
            case "DD":
              return E.s(M.$D, 2, "0");
            case "d":
              return String(M.$W);
            case "dd":
              return G(D.weekdaysMin, M.$W, F, 2);
            case "ddd":
              return G(D.weekdaysShort, M.$W, F, 3);
            case "dddd":
              return F[M.$W];
            case "H":
              return String(T);
            case "HH":
              return E.s(T, 2, "0");
            case "h":
              return oe(1);
            case "hh":
              return oe(2);
            case "a":
              return X(T, R, !0);
            case "A":
              return X(T, R, !1);
            case "m":
              return String(R);
            case "mm":
              return E.s(R, 2, "0");
            case "s":
              return String(M.$s);
            case "ss":
              return E.s(M.$s, 2, "0");
            case "SSS":
              return E.s(M.$ms, 3, "0");
            case "Z":
              return $;
          }
          return null;
        }(q) || $.replace(":", "");
      });
    }, y.utcOffset = function() {
      return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
    }, y.diff = function(w, M, D) {
      var O, $ = this, T = E.p(M), R = k(w), I = (R.utcOffset() - this.utcOffset()) * t, F = this - R, W = function() {
        return E.m($, R);
      };
      switch (T) {
        case p:
          O = W() / 12;
          break;
        case d:
          O = W();
          break;
        case c:
          O = W() / 3;
          break;
        case r:
          O = (F - I) / 6048e5;
          break;
        case l:
          O = (F - I) / 864e5;
          break;
        case o:
          O = F / e;
          break;
        case a:
          O = F / t;
          break;
        case n:
          O = F / i;
          break;
        default:
          O = F;
      }
      return D ? O : E.a(O);
    }, y.daysInMonth = function() {
      return this.endOf(d).$D;
    }, y.$locale = function() {
      return V[this.$L];
    }, y.locale = function(w, M) {
      if (!w) return this.$L;
      var D = this.clone(), O = A(w, M, !0);
      return O && (D.$L = O), D;
    }, y.clone = function() {
      return E.w(this.$d, this);
    }, y.toDate = function() {
      return new Date(this.valueOf());
    }, y.toJSON = function() {
      return this.isValid() ? this.toISOString() : null;
    }, y.toISOString = function() {
      return this.$d.toISOString();
    }, y.toString = function() {
      return this.$d.toUTCString();
    }, N;
  }(), P = L.prototype;
  return k.prototype = P, [["$ms", s], ["$s", n], ["$m", a], ["$H", o], ["$W", l], ["$M", d], ["$y", p], ["$D", f]].forEach(function(N) {
    P[N[1]] = function(y) {
      return this.$g(y, N[0], N[1]);
    };
  }), k.extend = function(N, y) {
    return N.$i || (N(y, L, k), N.$i = !0), k;
  }, k.locale = A, k.isDayjs = C, k.unix = function(N) {
    return k(1e3 * N);
  }, k.en = V[v], k.Ls = V, k.p = {}, k;
}()), st = Fe(function() {
  var i = { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A" }, t = /(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g, e = /\d/, s = /\d\d/, n = /\d\d?/, a = /\d*[^-_:/,()\s\d]+/, o = {}, l = function(h) {
    return (h = +h) + (h > 68 ? 1900 : 2e3);
  }, r = function(h) {
    return function(g) {
      this[h] = +g;
    };
  }, d = [/[+-]\d\d:?(\d\d)?|Z/, function(h) {
    (this.zone || (this.zone = {})).offset = function(g) {
      if (!g || g === "Z") return 0;
      var _ = g.match(/([+-]|\d\d)/g), b = 60 * _[1] + (+_[2] || 0);
      return b === 0 ? 0 : _[0] === "+" ? -b : b;
    }(h);
  }], c = function(h) {
    var g = o[h];
    return g && (g.indexOf ? g : g.s.concat(g.f));
  }, p = function(h, g) {
    var _, b = o.meridiem;
    if (b) {
      for (var u = 1; u <= 24; u += 1) if (h.indexOf(b(u, 0, g)) > -1) {
        _ = u > 12;
        break;
      }
    } else _ = h === (g ? "pm" : "PM");
    return _;
  }, f = { A: [a, function(h) {
    this.afternoon = p(h, !1);
  }], a: [a, function(h) {
    this.afternoon = p(h, !0);
  }], Q: [e, function(h) {
    this.month = 3 * (h - 1) + 1;
  }], S: [e, function(h) {
    this.milliseconds = 100 * +h;
  }], SS: [s, function(h) {
    this.milliseconds = 10 * +h;
  }], SSS: [/\d{3}/, function(h) {
    this.milliseconds = +h;
  }], s: [n, r("seconds")], ss: [n, r("seconds")], m: [n, r("minutes")], mm: [n, r("minutes")], H: [n, r("hours")], h: [n, r("hours")], HH: [n, r("hours")], hh: [n, r("hours")], D: [n, r("day")], DD: [s, r("day")], Do: [a, function(h) {
    var g = o.ordinal, _ = h.match(/\d+/);
    if (this.day = _[0], g) for (var b = 1; b <= 31; b += 1) g(b).replace(/\[|\]/g, "") === h && (this.day = b);
  }], w: [n, r("week")], ww: [s, r("week")], M: [n, r("month")], MM: [s, r("month")], MMM: [a, function(h) {
    var g = c("months"), _ = (c("monthsShort") || g.map(function(b) {
      return b.slice(0, 3);
    })).indexOf(h) + 1;
    if (_ < 1) throw new Error();
    this.month = _ % 12 || _;
  }], MMMM: [a, function(h) {
    var g = c("months").indexOf(h) + 1;
    if (g < 1) throw new Error();
    this.month = g % 12 || g;
  }], Y: [/[+-]?\d+/, r("year")], YY: [s, function(h) {
    this.year = l(h);
  }], YYYY: [/\d{4}/, r("year")], Z: d, ZZ: d };
  function m(h) {
    var g, _;
    g = h, _ = o && o.formats;
    for (var b = (h = g.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, function(k, E, L) {
      var P = L && L.toUpperCase();
      return E || _[L] || i[L] || _[P].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function(N, y, w) {
        return y || w.slice(1);
      });
    })).match(t), u = b.length, v = 0; v < u; v += 1) {
      var V = b[v], S = f[V], C = S && S[0], A = S && S[1];
      b[v] = A ? { regex: C, parser: A } : V.replace(/^\[|\]$/g, "");
    }
    return function(k) {
      for (var E = {}, L = 0, P = 0; L < u; L += 1) {
        var N = b[L];
        if (typeof N == "string") P += N.length;
        else {
          var y = N.regex, w = N.parser, M = k.slice(P), D = y.exec(M)[0];
          w.call(E, D), k = k.replace(D, "");
        }
      }
      return function(O) {
        var $ = O.afternoon;
        if ($ !== void 0) {
          var T = O.hours;
          $ ? T < 12 && (O.hours += 12) : T === 12 && (O.hours = 0), delete O.afternoon;
        }
      }(E), E;
    };
  }
  return function(h, g, _) {
    _.p.customParseFormat = !0, h && h.parseTwoDigitYear && (l = h.parseTwoDigitYear);
    var b = g.prototype, u = b.parse;
    b.parse = function(v) {
      var V = v.date, S = v.utc, C = v.args;
      this.$u = S;
      var A = C[1];
      if (typeof A == "string") {
        var k = C[2] === !0, E = C[3] === !0, L = k || E, P = C[2];
        E && (P = C[2]), o = this.$locale(), !k && P && (o = _.Ls[P]), this.$d = function(M, D, O, $) {
          try {
            if (["x", "X"].indexOf(D) > -1) return new Date((D === "X" ? 1e3 : 1) * M);
            var T = m(D)(M), R = T.year, I = T.month, F = T.day, W = T.hours, te = T.minutes, G = T.seconds, oe = T.milliseconds, X = T.zone, q = T.week, J = /* @__PURE__ */ new Date(), K = F || (R || I ? 1 : J.getDate()), se = R || J.getFullYear(), ue = 0;
            R && !I || (ue = I > 0 ? I - 1 : J.getMonth());
            var pe, we = W || 0, _e = te || 0, ye = G || 0, De = oe || 0;
            return X ? new Date(Date.UTC(se, ue, K, we, _e, ye, De + 60 * X.offset * 1e3)) : O ? new Date(Date.UTC(se, ue, K, we, _e, ye, De)) : (pe = new Date(se, ue, K, we, _e, ye, De), q && (pe = $(pe).week(q).toDate()), pe);
          } catch {
            return /* @__PURE__ */ new Date("");
          }
        }(V, A, S, _), this.init(), P && P !== !0 && (this.$L = this.locale(P).$L), L && V != this.format(A) && (this.$d = /* @__PURE__ */ new Date("")), o = {};
      } else if (A instanceof Array) for (var N = A.length, y = 1; y <= N; y += 1) {
        C[1] = A[y - 1];
        var w = _.apply(this, C);
        if (w.isValid()) {
          this.$d = w.$d, this.$L = w.$L, this.init();
          break;
        }
        y === N && (this.$d = /* @__PURE__ */ new Date(""));
      }
      else u.call(this, v);
    };
  };
}());
de.extend(st);
const ve = (i, t) => {
  let e;
  if (t) switch (t) {
    case "ISO_8601":
      e = i;
      break;
    case "RFC_2822":
      e = de(i.slice(5), "DD MMM YYYY HH:mm:ss ZZ").unix();
      break;
    case "MYSQL":
      e = de(i, "YYYY-MM-DD hh:mm:ss").unix();
      break;
    case "UNIX":
      e = de(i).unix();
      break;
    default:
      e = de(i, t, !0).valueOf();
  }
  return e;
}, ae = (i, t) => {
  let e, s, n;
  if ((i == null ? void 0 : i.constructor) === Object && Object.prototype.hasOwnProperty.call(i, "data") && !Object.keys(i).find((a) => !["text", "order", "data", "attributes"].includes(a))) {
    const a = i;
    if (s = a.data, n = a.attributes, a.text !== void 0 && a.order !== void 0) return a;
    e = { data: a.data, text: a.text, order: a.order, attributes: a.attributes };
  } else s = i, e = { data: i };
  if (e.text === void 0 || e.order === void 0) switch (t.type) {
    case "string":
      typeof s != "string" && (e.text = e.text ?? String(e.data), e.order = e.order ?? e.text);
      break;
    case "date":
      t.format && (e.order = e.order ?? ve(String(e.data), t.format));
      break;
    case "number":
      e.text = e.text ?? String(e.data), e.data = parseFloat(e.data), e.order = e.order ?? e.data;
      break;
    case "html": {
      const a = Array.isArray(e.data) ? { nodeName: "TD", childNodes: e.data } : ne(`<td>${String(e.data)}</td>`);
      e.data = a.childNodes || [];
      const o = he(a);
      e.text = e.text ?? o, e.order = e.order ?? o;
      break;
    }
    case "boolean":
      typeof e.data == "string" && (e.data = e.data.toLowerCase().trim()), e.data = !["false", !1, null, void 0, 0].includes(e.data), e.order = e.order ?? (e.data ? 1 : 0), e.text = e.text ?? String(e.data);
      break;
    case "other":
      e.text = e.text ?? "", e.order = e.order ?? 0;
      break;
    default:
      e.text = e.text ?? JSON.stringify(e.data);
  }
  return n && (e.attributes = n), e;
}, it = (i, t) => {
  let e;
  switch (t.type) {
    case "string":
      e = { data: i.innerText };
      break;
    case "date": {
      const s = i.innerText;
      e = { data: s, order: ve(s, t.format) };
      break;
    }
    case "number": {
      const s = parseFloat(i.innerText);
      e = { data: s, order: s, text: i.innerText };
      break;
    }
    case "boolean": {
      const s = !["false", "0", "null", "undefined"].includes(i.innerText.toLowerCase().trim());
      e = { data: s, text: s ? "1" : "0", order: s ? 1 : 0 };
      break;
    }
    default:
      e = { data: ie(i, { valueDiffing: !1 }).childNodes || [], text: i.innerText, order: i.innerText };
      break;
  }
  return e.attributes = He(i.attributes), e;
}, ce = (i) => {
  if (i instanceof Object && i.constructor === Object && i.hasOwnProperty("data")) {
    const e = i;
    return typeof e.data == "string" && (e.text || (e.text = e.data), e.type || (e.type = "string")), e;
  }
  const t = { data: i };
  if (typeof i == "string") {
    if (i.length) {
      const e = ne(`<th>${i}</th>`);
      if (e.childNodes && (e.childNodes.length !== 1 || e.childNodes[0].nodeName !== "#text")) {
        t.data = e.childNodes, t.type = "html";
        const s = he(e);
        t.text = s;
      }
    }
  } else [null, void 0].includes(i) ? t.text = "" : t.text = JSON.stringify(i);
  return t;
}, Re = (i, t = void 0, e, s, n) => {
  var o, l;
  const a = { data: [], headings: [] };
  if (i.headings) {
    const r = [];
    i.headings.forEach((d) => {
      var f;
      const c = ce(d), p = parseInt(((f = c.attributes) == null ? void 0 : f.colspan) || "1", 10);
      r.push(c);
      for (let m = 1; m < p; m++) r.push({ data: "", text: "", attributes: { "data-colspan-placeholder": "true" } });
    }), a.headings = r;
  } else if (t != null && t.tHead) {
    const r = [];
    Array.from(t.tHead.querySelectorAll("th")).forEach((c) => {
      const p = parseInt(c.getAttribute("colspan") || "1", 10), f = ((m) => {
        const h = ie(m, { valueDiffing: !1 });
        let g;
        return g = !h.childNodes || h.childNodes.length === 1 && h.childNodes[0].nodeName === "#text" ? { data: m.innerText, type: "string" } : { data: h.childNodes, type: "html", text: he(h) }, g.attributes = h.attributes, g;
      })(c);
      r.push(f);
      for (let m = 1; m < p; m++) r.push({ data: "", text: "", attributes: { "data-colspan-placeholder": "true" } });
    }), a.headings = r;
    let d = 0;
    Array.from(t.tHead.querySelectorAll("th")).forEach((c) => {
      var f, m, h, g, _;
      const p = parseInt(c.getAttribute("colspan") || "1", 10);
      for (let b = 0; b < p; b++) {
        e[d] || (e[d] = { type: s, format: n, searchable: !0, sortable: !0 });
        const u = e[d];
        b === 0 && (((f = c.dataset.sortable) == null ? void 0 : f.trim().toLowerCase()) !== "false" && ((m = c.dataset.sort) == null ? void 0 : m.trim().toLowerCase()) !== "false" || (u.sortable = !1), ((h = c.dataset.searchable) == null ? void 0 : h.trim().toLowerCase()) === "false" && (u.searchable = !1), ((g = c.dataset.hidden) == null ? void 0 : g.trim().toLowerCase()) !== "true" && ((_ = c.getAttribute("hidden")) == null ? void 0 : _.trim().toLowerCase()) !== "true" || (u.hidden = !0), c.dataset.type && ["number", "string", "html", "date", "boolean", "other"].includes(c.dataset.type) && (u.type = c.dataset.type, u.type === "date" && c.dataset.format && (u.format = c.dataset.format))), d++;
      }
    });
  } else if ((o = i.data) != null && o.length) {
    const r = i.data[0], d = Array.isArray(r) ? r : r.cells;
    a.headings = d.map((c) => ce(""));
  } else t != null && t.tBodies.length && (a.headings = Array.from(t.tBodies[0].rows[0].cells).map((r) => ce("")));
  for (let r = 0; r < a.headings.length; r++) e[r] || (e[r] = { type: s, format: n, sortable: !0, searchable: !0 });
  if (i.data) {
    const r = a.headings.map((c) => c.data ? String(c.data) : c.text), d = /* @__PURE__ */ new Map();
    a.data = i.data.map((c, p) => {
      var b, u;
      let f, m;
      Array.isArray(c) ? (f = {}, m = c) : c.hasOwnProperty("cells") && Object.keys(c).every((v) => ["cells", "attributes"].includes(v)) ? (f = c.attributes, m = c.cells) : (f = {}, m = [], Object.entries(c).forEach(([v, V]) => {
        const S = r.indexOf(v);
        S > -1 && (m[S] = V);
      }));
      const h = [];
      let g = 0, _ = 0;
      for (; g < a.headings.length; ) if (d.has(g)) {
        const v = d.get(g);
        h.push({ data: "", text: "", order: "", attributes: { "data-rowspan-placeholder": "true" } }), v.remainingRows--, v.remainingRows <= 0 && d.delete(g), g++;
      } else {
        if (!(_ < m.length)) break;
        {
          const v = m[_], V = ae(v, e[g]), S = parseInt(((b = V.attributes) == null ? void 0 : b.colspan) || "1", 10), C = parseInt(((u = V.attributes) == null ? void 0 : u.rowspan) || "1", 10);
          h.push(V), C > 1 && d.set(g, { remainingRows: C - 1, cellData: V }), g++, _++;
          for (let A = 1; A < S; A++) h.push({ data: "", text: "", order: "", attributes: { "data-colspan-placeholder": "true" } }), g++;
        }
      }
      return { attributes: f, cells: h };
    });
  } else if ((l = t == null ? void 0 : t.tBodies) != null && l.length) {
    const r = /* @__PURE__ */ new Map();
    a.data = Array.from(t.tBodies[0].rows).map((d) => {
      const c = [];
      let p = 0, f = 0;
      const m = Array.from(d.cells);
      for (; p < a.headings.length; ) if (r.has(p)) {
        const h = r.get(p);
        c.push({ data: "", text: "", order: "", attributes: { "data-rowspan-placeholder": "true" } }), h.remainingRows--, h.remainingRows <= 0 && r.delete(p), p++;
      } else {
        if (!(f < m.length)) break;
        {
          const h = m[f], g = parseInt(h.getAttribute("colspan") || "1", 10), _ = parseInt(h.getAttribute("rowspan") || "1", 10), b = h.dataset.content ? ae(h.dataset.content, e[p]) : it(h, e[p]);
          h.dataset.order && (b.order = isNaN(parseFloat(h.dataset.order)) ? h.dataset.order : parseFloat(h.dataset.order)), c.push(b), _ > 1 && r.set(p, { remainingRows: _ - 1, cellData: b }), p++, f++;
          for (let u = 1; u < g; u++) c.push({ data: "", text: "", order: "", attributes: { "data-colspan-placeholder": "true" } }), p++;
        }
      }
      return { attributes: He(d.attributes), cells: c };
    });
  }
  if (a.data.length && a.data[0].cells.length !== a.headings.length) throw new Error("Data heading length mismatch.");
  return a;
};
class nt {
  constructor(t) {
    x(this, "cursor");
    x(this, "dt");
    this.dt = t, this.cursor = !1;
  }
  setCursor(t = !1) {
    if (t === this.cursor) return;
    const e = this.cursor;
    if (this.cursor = t, this.dt._renderTable(), t !== !1 && this.dt.options.scrollY) {
      const s = B(this.dt.options.classes.cursor), n = this.dt.dom.querySelector(`tr${s}`);
      n && n.scrollIntoView({ block: "nearest" });
    }
    this.dt.emit("datatable.cursormove", this.cursor, e);
  }
  add(t) {
    if (!Array.isArray(t) || t.length < 1) return;
    const e = { cells: t.map((s, n) => {
      const a = this.dt.columns.settings[n];
      return ae(s, a);
    }) };
    this.dt.data.data.push(e), this.dt.hasRows = !0, this.dt.update(!0);
  }
  remove(t) {
    if (!Array.isArray(t)) return this.remove([t]);
    this.dt.data.data = this.dt.data.data.filter((e, s) => !t.includes(s)), this.dt.data.data.length || (this.dt.hasRows = !1), this.dt.update(!0);
  }
  findRowIndex(t, e) {
    return this.dt.data.data.findIndex((s) => {
      const n = s.cells[t];
      return z(n).toLowerCase().includes(String(e).toLowerCase());
    });
  }
  findRow(t, e) {
    const s = this.findRowIndex(t, e);
    if (s < 0) return { index: -1, row: null, cols: [] };
    const n = this.dt.data.data[s], a = n.cells.map((o) => o.data);
    return { index: s, row: n, cols: a };
  }
  updateRow(t, e) {
    const s = { cells: e.map((n, a) => {
      const o = this.dt.columns.settings[a];
      return ae(n, o);
    }) };
    this.dt.data.data.splice(t, 1, s), this.dt.update(!0);
  }
}
class at {
  constructor(t) {
    x(this, "dt");
    x(this, "settings");
    x(this, "_state");
    this.dt = t, this.init();
  }
  init() {
    [this.settings, this._state] = ((t = [], e, s) => {
      let n = [], a = !1;
      const o = [];
      return t.forEach((l) => {
        (Array.isArray(l.select) ? l.select : [l.select]).forEach((r) => {
          n[r] ? l.type && (n[r].type = l.type) : n[r] = { type: l.type || e, sortable: !0, searchable: !0 };
          const d = n[r];
          l.render && (d.render = l.render), l.format ? d.format = l.format : l.type === "date" && (d.format = s), l.cellClass && (d.cellClass = l.cellClass), l.headerClass && (d.headerClass = l.headerClass), l.locale && (d.locale = l.locale), l.sortable === !1 ? d.sortable = !1 : (l.numeric && (d.numeric = l.numeric), l.caseFirst && (d.caseFirst = l.caseFirst)), l.searchable === !1 ? d.searchable = !1 : l.sensitivity && (d.sensitivity = l.sensitivity), (d.searchable || d.sortable) && l.ignorePunctuation !== void 0 && (d.ignorePunctuation = l.ignorePunctuation), l.searchMethod && (d.searchMethod = l.searchMethod), l.hidden && (d.hidden = !0), l.filter && (d.filter = l.filter), l.sortSequence && (d.sortSequence = l.sortSequence), l.sort && (l.filter ? o[r] = l.sort : a = { column: r, dir: l.sort }), l.searchItemSeparator !== void 0 && (d.searchItemSeparator = l.searchItemSeparator);
        });
      }), n = n.map((l) => l || { type: e, format: e === "date" ? s : void 0, sortable: !0, searchable: !0 }), [n, { filters: o, sort: a, widths: [] }];
    })(this.dt.options.columns, this.dt.options.type, this.dt.options.format);
  }
  get(t) {
    return t < 0 || t >= this.size() ? null : { ...this.settings[t] };
  }
  size() {
    return this.settings.length;
  }
  swap(t) {
    if (t.length === 2) {
      const e = this.dt.data.headings.map((o, l) => l), s = t[0], n = t[1], a = e[n];
      return e[n] = e[s], e[s] = a, this.order(e);
    }
  }
  order(t) {
    this.dt.data.headings = t.map((e) => this.dt.data.headings[e]), this.dt.data.data.forEach((e) => e.cells = t.map((s) => e.cells[s])), this.settings = t.map((e) => this.settings[e]), this.dt.update();
  }
  hide(t) {
    Array.isArray(t) || (t = [t]), t.length && (t.forEach((e) => {
      this.settings[e] || (this.settings[e] = { type: "string" }), this.settings[e].hidden = !0;
    }), this.dt.update());
  }
  show(t) {
    Array.isArray(t) || (t = [t]), t.length && (t.forEach((e) => {
      this.settings[e] || (this.settings[e] = { type: "string", sortable: !0 }), delete this.settings[e].hidden;
    }), this.dt.update());
  }
  visible(t) {
    var e;
    return t === void 0 && (t = [...Array(this.dt.data.headings.length).keys()]), Array.isArray(t) ? t.map((s) => {
      var n;
      return !((n = this.settings[s]) != null && n.hidden);
    }) : !((e = this.settings[t]) != null && e.hidden);
  }
  add(t) {
    const e = this.dt.data.headings.length;
    if (this.dt.data.headings = this.dt.data.headings.concat([ce(t.heading)]), this.dt.data.data.forEach((s, n) => {
      s.cells = s.cells.concat([ae(t.data[n], t)]);
    }), this.settings[e] = { type: t.type || "string", sortable: !0, searchable: !0 }, t.type || t.format || t.sortable || t.render || t.filter) {
      const s = this.settings[e];
      t.render && (s.render = t.render), t.format && (s.format = t.format), t.cellClass && (s.cellClass = t.cellClass), t.headerClass && (s.headerClass = t.headerClass), t.locale && (s.locale = t.locale), t.sortable === !1 ? s.sortable = !1 : (t.numeric && (s.numeric = t.numeric), t.caseFirst && (s.caseFirst = t.caseFirst)), t.searchable === !1 ? s.searchable = !1 : t.sensitivity && (s.sensitivity = t.sensitivity), (s.searchable || s.sortable) && t.ignorePunctuation && (s.ignorePunctuation = t.ignorePunctuation), t.hidden && (s.hidden = !0), t.filter && (s.filter = t.filter), t.sortSequence && (s.sortSequence = t.sortSequence);
    }
    this.dt.update(!0);
  }
  remove(t) {
    Array.isArray(t) || (t = [t]), this.dt.data.headings = this.dt.data.headings.filter((e, s) => !t.includes(s)), this.dt.data.data.forEach((e) => e.cells = e.cells.filter((s, n) => !t.includes(n))), this.dt.update(!0);
  }
  filter(t, e = !1) {
    var a, o;
    if (!((o = (a = this.settings[t]) == null ? void 0 : a.filter) != null && o.length)) return;
    const s = this._state.filters[t];
    let n;
    if (s) {
      let l = !1;
      n = this.settings[t].filter.find((r) => !!l || (r === s && (l = !0), !1));
    } else {
      const l = this.settings[t].filter;
      n = l ? l[0] : void 0;
    }
    n ? this._state.filters[t] = n : s && (this._state.filters[t] = void 0), this.dt._currentPage = 1, this.dt.update(), e || this.dt.emit("datatable.filter", t, n);
  }
  sort(t, e = void 0, s = !1) {
    var d;
    const n = this.settings[t];
    if (s || this.dt.emit("datatable.sorting", t, e), !e) {
      const c = !(!this._state.sort || this._state.sort.column !== t) && ((d = this._state.sort) == null ? void 0 : d.dir), p = (n == null ? void 0 : n.sortSequence) || ["asc", "desc"];
      if (c) {
        const f = p.indexOf(c);
        e = f === -1 ? p[0] || "asc" : f === p.length - 1 ? p[0] : p[f + 1];
      } else e = p.length ? p[0] : "asc";
    }
    const a = !(!n || !["string", "html"].includes(n.type)) && new Intl.Collator(n.locale || this.dt.options.locale, { usage: "sort", numeric: n.numeric || this.dt.options.numeric, caseFirst: n.caseFirst || this.dt.options.caseFirst, ignorePunctuation: n.ignorePunctuation || this.dt.options.ignorePunctuation }), o = [], l = /* @__PURE__ */ new Map();
    this.dt.data.data.forEach((c, p) => {
      if (c.cells.some((f) => {
        var m;
        return ((m = f.attributes) == null ? void 0 : m["data-rowspan-placeholder"]) === "true";
      })) {
        for (let m = p - 1; m >= 0; m--) if (l.has(m)) {
          const h = l.get(m);
          return o[h].push(p), void l.set(p, h);
        }
        const f = o.length;
        o.push([p]), l.set(p, f);
      } else if (c.cells.some((f) => {
        var m;
        return ((m = f.attributes) == null ? void 0 : m.rowspan) && parseInt(f.attributes.rowspan, 10) > 1;
      })) {
        const f = o.length;
        o.push([p]), l.set(p, f);
      } else {
        const f = o.length;
        o.push([p]), l.set(p, f);
      }
    }), o.sort((c, p) => {
      const f = (g, _) => {
        var u, v;
        const b = this.dt.data.data[g].cells[_];
        if (((u = b.attributes) == null ? void 0 : u["data-rowspan-placeholder"]) === "true") {
          for (let V = g - 1; V >= 0; V--) {
            const S = this.dt.data.data[V].cells[_];
            if (((v = S.attributes) == null ? void 0 : v["data-rowspan-placeholder"]) !== "true") return S.order ?? z(S);
          }
          return "";
        }
        return b.order ?? z(b);
      };
      let m = f(c[0], t), h = f(p[0], t);
      if (e === "desc") {
        const g = m;
        m = h, h = g;
      }
      return a && typeof m != "number" && typeof h != "number" ? a.compare(String(m), String(h)) : m < h ? -1 : m > h ? 1 : 0;
    });
    const r = [];
    o.forEach((c) => {
      c.forEach((p) => {
        r.push(this.dt.data.data[p]);
      });
    }), this.dt.data.data = r, this._state.sort = { column: t, dir: e }, this.dt._searchQueries.length ? (this.dt.multiSearch(this.dt._searchQueries), this.dt.emit("datatable.sort", t, e)) : s || (this.dt._currentPage = 1, this.dt.update(), this.dt.emit("datatable.sort", t, e));
  }
  _measureWidths() {
    var e, s, n, a;
    const t = this.dt.data.headings.filter((o, l) => {
      var r;
      return !((r = this.settings[l]) != null && r.hidden);
    });
    if ((this.dt.options.scrollY.length || this.dt.options.fixedColumns) && (t != null && t.length)) {
      this._state.widths = [];
      const o = { noPaging: !0 };
      if (this.dt.options.header || this.dt.options.footer) {
        this.dt.options.scrollY.length && (o.unhideHeader = !0), this.dt.headerDOM && this.dt.headerDOM.parentElement.removeChild(this.dt.headerDOM), o.noColumnWidths = !0, this.dt._renderTable(o);
        const l = Array.from(((s = (e = this.dt.dom.querySelector("thead, tfoot")) == null ? void 0 : e.firstElementChild) == null ? void 0 : s.querySelectorAll("th")) || []);
        let r = 0;
        const d = this.dt.data.headings.map((p, f) => {
          var h;
          if ((h = this.settings[f]) != null && h.hidden) return 0;
          const m = l[r].offsetWidth;
          return r += 1, m;
        }), c = d.reduce((p, f) => p + f, 0);
        this._state.widths = d.map((p) => p / c * 100);
      } else {
        o.renderHeader = !0, this.dt._renderTable(o);
        const l = Array.from(((a = (n = this.dt.dom.querySelector("thead, tfoot")) == null ? void 0 : n.firstElementChild) == null ? void 0 : a.querySelectorAll("th")) || []);
        let r = 0;
        const d = this.dt.data.headings.map((p, f) => {
          var h;
          if ((h = this.settings[f]) != null && h.hidden) return 0;
          const m = l[r].offsetWidth;
          return r += 1, m;
        }), c = d.reduce((p, f) => p + f, 0);
        this._state.widths = d.map((p) => p / c * 100);
      }
      this.dt._renderTable();
    }
  }
}
const fe = { sortable: !0, locale: "en", numeric: !0, caseFirst: "false", searchable: !0, sensitivity: "base", ignorePunctuation: !0, destroyable: !0, searchItemSeparator: "", searchQuerySeparator: " ", searchAnd: !1, searchMethod: !1, data: {}, type: "html", format: "YYYY-MM-DD", columns: [], paging: !0, perPage: 10, perPageSelect: [5, 10, 15, 20, 25], nextPrev: !0, firstLast: !1, prevText: "‹", nextText: "›", firstText: "«", lastText: "»", ellipsisText: "…", truncatePager: !0, pagerDelta: 2, scrollY: "", fixedColumns: !0, fixedHeight: !1, footer: !1, header: !0, hiddenHeader: !1, caption: void 0, rowNavigation: !1, rowSelectionKeys: ["Enter", " "], tabIndex: !1, pagerRender: !1, rowRender: !1, tableRender: !1, diffDomOptions: { valueDiffing: !1, simplifiedElementCheck: !1 }, labels: { placeholder: "Search...", searchTitle: "Search within table", perPage: "entries per page", pageTitle: "Page {page}", noRows: "No entries found", noResults: "No results match your search query", info: "Showing {start} to {end} of {rows} entries" }, template: (i, t) => `<div class='${i.classes.top}'>
    ${i.paging && i.perPageSelect ? `<div class='${i.classes.dropdown}'>
            <label>
                <select class='${i.classes.selector}' name="per-page"></select> ${i.labels.perPage}
            </label>
        </div>` : ""}
    ${i.searchable ? `<div class='${i.classes.search}'>
            <input class='${i.classes.input}' placeholder='${i.labels.placeholder}' type='search' name="search" title='${i.labels.searchTitle}'${t.id ? ` aria-controls="${t.id}"` : ""}>
        </div>` : ""}
</div>
<div class='${i.classes.container}'${i.scrollY.length ? ` style='height: ${i.scrollY}; overflow-Y: auto;'` : ""}></div>
<div class='${i.classes.bottom}'>
    ${i.paging ? `<div class='${i.classes.info}'></div>` : ""}
    <nav class='${i.classes.pagination}'></nav>
</div>`, classes: { active: "datatable-active", ascending: "datatable-ascending", bottom: "datatable-bottom", container: "datatable-container", cursor: "datatable-cursor", descending: "datatable-descending", disabled: "datatable-disabled", dropdown: "datatable-dropdown", ellipsis: "datatable-ellipsis", filter: "datatable-filter", filterActive: "datatable-filter-active", empty: "datatable-empty", headercontainer: "datatable-headercontainer", hidden: "datatable-hidden", info: "datatable-info", input: "datatable-input", loading: "datatable-loading", pagination: "datatable-pagination", paginationList: "datatable-pagination-list", paginationListItem: "datatable-pagination-list-item", paginationListItemLink: "datatable-pagination-list-item-link", search: "datatable-search", selector: "datatable-selector", sorter: "datatable-sorter", table: "datatable-table", top: "datatable-top", wrapper: "datatable-wrapper" } }, le = (i, t, e, s = {}) => ({ nodeName: "LI", attributes: { class: s.active && !s.hidden ? `${e.classes.paginationListItem} ${e.classes.active}` : s.hidden ? `${e.classes.paginationListItem} ${e.classes.hidden} ${e.classes.disabled}` : e.classes.paginationListItem }, childNodes: [{ nodeName: "BUTTON", attributes: { "data-page": String(i), class: e.classes.paginationListItemLink, "aria-label": e.labels.pageTitle.replace("{page}", String(i)) }, childNodes: [{ nodeName: "#text", data: t }] }] }), ot = (i, t, e, s, n) => {
  let a = [];
  if (n.firstLast && a.push(le(1, n.firstText, n)), n.nextPrev) {
    const l = i ? 1 : e - 1;
    a.push(le(l, n.prevText, n, { hidden: i }));
  }
  let o = [...Array(s).keys()].map((l) => le(l + 1, String(l + 1), n, { active: l === e - 1 }));
  if (n.truncatePager && (o = ((l, r, d, c) => {
    const p = c.pagerDelta, f = c.classes, m = c.ellipsisText, h = 2 * p;
    let g = r - p, _ = r + p;
    r < 4 - p + h ? _ = 3 + h : r > d - (3 - p + h) && (g = d - (2 + h));
    const b = [];
    for (let V = 1; V <= d; V++) if (V == 1 || V == d || V >= g && V <= _) {
      const S = l[V - 1];
      b.push(S);
    }
    let u;
    const v = [];
    return b.forEach((V) => {
      const S = parseInt(V.childNodes[0].attributes["data-page"], 10);
      if (u) {
        const C = parseInt(u.childNodes[0].attributes["data-page"], 10);
        if (S - C == 2) v.push(l[C]);
        else if (S - C != 1) {
          const A = { nodeName: "LI", attributes: { class: `${f.paginationListItem} ${f.ellipsis} ${f.disabled}` }, childNodes: [{ nodeName: "BUTTON", attributes: { class: f.paginationListItemLink }, childNodes: [{ nodeName: "#text", data: m }] }] };
          v.push(A);
        }
      }
      v.push(V), u = V;
    }), v;
  })(o, e, s, n)), a = a.concat(o), n.nextPrev) {
    const l = t ? s : e + 1;
    a.push(le(l, n.nextText, n, { hidden: t }));
  }
  return n.firstLast && a.push(le(s, n.lastText, n)), { nodeName: "UL", attributes: { class: n.classes.paginationList }, childNodes: o.length > 1 ? a : [] };
};
class pt {
  constructor(t, e = {}) {
    x(this, "columns");
    x(this, "containerDOM");
    x(this, "_currentPage");
    x(this, "data");
    x(this, "_dd");
    x(this, "dom");
    x(this, "_events");
    x(this, "hasHeadings");
    x(this, "hasRows");
    x(this, "headerDOM");
    x(this, "_initialHTML");
    x(this, "initialized");
    x(this, "_label");
    x(this, "lastPage");
    x(this, "_listeners");
    x(this, "onFirstPage");
    x(this, "onLastPage");
    x(this, "options");
    x(this, "_pagerDOMs");
    x(this, "_virtualPagerDOM");
    x(this, "pages");
    x(this, "_rect");
    x(this, "rows");
    x(this, "_searchData");
    x(this, "_searchQueries");
    x(this, "_tableAttributes");
    x(this, "_tableFooters");
    x(this, "_tableCaptions");
    x(this, "totalPages");
    x(this, "_virtualDOM");
    x(this, "_virtualHeaderDOM");
    x(this, "wrapperDOM");
    x(this, "_onResize", Ie(() => {
      this._rect = this.containerDOM.getBoundingClientRect(), this._rect.width && this.update(!0);
    }, 250));
    const s = typeof t == "string" ? document.querySelector(t) : t;
    s instanceof HTMLTableElement ? this.dom = s : (this.dom = document.createElement("table"), s.appendChild(this.dom));
    const n = { ...fe.diffDomOptions, ...e.diffDomOptions }, a = { ...fe.labels, ...e.labels }, o = { ...fe.classes, ...e.classes };
    this.options = { ...fe, ...e, diffDomOptions: n, labels: a, classes: o }, this._initialHTML = this.options.destroyable ? s.outerHTML : "", this.options.tabIndex ? this.dom.tabIndex = this.options.tabIndex : this.options.rowNavigation && this.dom.tabIndex === -1 && (this.dom.tabIndex = 0), this._listeners = { onResize: () => this._onResize() }, this._dd = new tt(this.options.diffDomOptions || {}), this.initialized = !1, this._events = {}, this._currentPage = 0, this.onFirstPage = !0, this.hasHeadings = !1, this.hasRows = !1, this._searchQueries = [], this.init();
  }
  init() {
    var t, e;
    if (this.initialized || Me(this.dom, this.options.classes.table)) return !1;
    this._virtualDOM = ie(this.dom, this.options.diffDomOptions || {}), this._tableAttributes = { ...this._virtualDOM.attributes }, this._tableFooters = ((t = this._virtualDOM.childNodes) == null ? void 0 : t.filter((s) => s.nodeName === "TFOOT")) ?? [], this._tableCaptions = ((e = this._virtualDOM.childNodes) == null ? void 0 : e.filter((s) => s.nodeName === "CAPTION")) ?? [], this.options.caption !== void 0 && this._tableCaptions.push({ nodeName: "CAPTION", childNodes: [{ nodeName: "#text", data: this.options.caption }] }), this.rows = new nt(this), this.columns = new at(this), this.data = Re(this.options.data, this.dom, this.columns.settings, this.options.type, this.options.format), this._render(), setTimeout(() => {
      this.emit("datatable.init"), this.initialized = !0;
    }, 10);
  }
  _render() {
    this.wrapperDOM = U("div", { class: `${this.options.classes.wrapper} ${this.options.classes.loading}` }), this.wrapperDOM.innerHTML = this.options.template(this.options, this.dom);
    const t = B(this.options.classes.selector), e = this.wrapperDOM.querySelector(`select${t}`);
    e && this.options.paging && this.options.perPageSelect ? this.options.perPageSelect.forEach((o) => {
      const [l, r] = Array.isArray(o) ? [o[0], o[1]] : [String(o), o], d = r === this.options.perPage, c = new Option(l, String(r), d, d);
      e.appendChild(c);
    }) : e && e.parentElement.removeChild(e);
    const s = B(this.options.classes.container);
    this.containerDOM = this.wrapperDOM.querySelector(s), this._pagerDOMs = [];
    const n = B(this.options.classes.pagination);
    Array.from(this.wrapperDOM.querySelectorAll(n)).forEach((o) => {
      o instanceof HTMLElement && (o.innerHTML = `<ul class="${this.options.classes.paginationList}"></ul>`, this._pagerDOMs.push(o.firstElementChild));
    }), this._virtualPagerDOM = { nodeName: "UL", attributes: { class: this.options.classes.paginationList } };
    const a = B(this.options.classes.info);
    this._label = this.wrapperDOM.querySelector(a), this.dom.parentElement.replaceChild(this.wrapperDOM, this.dom), this.containerDOM.appendChild(this.dom), this._rect = this.dom.getBoundingClientRect(), this._fixHeight(), this.options.header || this.wrapperDOM.classList.add("no-header"), this.options.footer || this.wrapperDOM.classList.add("no-footer"), this.options.sortable && this.wrapperDOM.classList.add("sortable"), this.options.searchable && this.wrapperDOM.classList.add("searchable"), this.options.fixedHeight && this.wrapperDOM.classList.add("fixed-height"), this.options.fixedColumns && this.wrapperDOM.classList.add("fixed-columns"), this._bindEvents(), this.columns._state.sort && this.columns.sort(this.columns._state.sort.column, this.columns._state.sort.dir, !0), this.update(!0);
  }
  _renderTable(t = {}) {
    let e;
    e = (this.options.paging || this._searchQueries.length || this.columns._state.filters.length) && this._currentPage && this.pages.length && !t.noPaging ? this.pages[this._currentPage - 1] : this.data.data.map((a, o) => ({ row: a, index: o }));
    let s = Pe(this._tableAttributes, this.data.headings, e, this.columns.settings, this.columns._state, this.rows.cursor, this.options, t, this._tableFooters, this._tableCaptions);
    if (this.options.tableRender) {
      const a = this.options.tableRender(this.data, s, "main");
      a && (s = a);
    }
    const n = this._dd.diff(this._virtualDOM, s);
    this._dd.apply(this.dom, n), this._virtualDOM = s;
  }
  _renderPage(t = !1) {
    this.hasRows && this.totalPages ? (this._currentPage > this.totalPages && (this._currentPage = 1), this._renderTable(), this.onFirstPage = this._currentPage === 1, this.onLastPage = this._currentPage === this.lastPage) : this.setMessage(this.options.labels.noRows);
    let e, s = 0, n = 0, a = 0;
    if (this.totalPages && (s = this._currentPage - 1, n = s * this.options.perPage, a = n + this.pages[s].length, n += 1, e = this._searchQueries.length ? this._searchData.length : this.data.data.length), this._label && this.options.labels.info.length) {
      const o = this.options.labels.info.replace("{start}", String(n)).replace("{end}", String(a)).replace("{page}", String(this._currentPage)).replace("{pages}", String(this.totalPages)).replace("{rows}", String(e));
      this._label.innerHTML = e ? o : "";
    }
    if (this._currentPage == 1 && this._fixHeight(), this.options.rowNavigation && this._currentPage && (!this.rows.cursor || !this.pages[this._currentPage - 1].find((o) => o.index === this.rows.cursor))) {
      const o = this.pages[this._currentPage - 1];
      o.length && (t ? this.rows.setCursor(o[o.length - 1].index) : this.rows.setCursor(o[0].index));
    }
  }
  _renderPagers() {
    if (!this.options.paging) return;
    let t = ot(this.onFirstPage, this.onLastPage, this._currentPage, this.totalPages, this.options);
    if (this.options.pagerRender) {
      const s = this.options.pagerRender([this.onFirstPage, this.onLastPage, this._currentPage, this.totalPages], t);
      s && (t = s);
    }
    const e = this._dd.diff(this._virtualPagerDOM, t);
    this._pagerDOMs.forEach((s) => {
      this._dd.apply(s, e);
    }), this._virtualPagerDOM = t;
  }
  _renderSeparateHeader() {
    var o;
    const t = this.dom.parentElement;
    this.headerDOM || (this.headerDOM = document.createElement("div"), this._virtualHeaderDOM = { nodeName: "DIV" }), t.parentElement.insertBefore(this.headerDOM, t);
    let e = { nodeName: "TABLE", attributes: this._tableAttributes, childNodes: [{ nodeName: "THEAD", childNodes: [$e(this.data.headings, this.columns.settings, this.columns._state, this.options, { unhideHeader: !0 })] }] };
    if ((o = e.attributes.class) != null && o.includes(this.options.classes.table) || (e.attributes.class = Q(e.attributes.class, this.options.classes.table)), this.options.tableRender) {
      const l = this.options.tableRender(this.data, e, "header");
      l && (e = l);
    }
    const s = { nodeName: "DIV", attributes: { class: this.options.classes.headercontainer }, childNodes: [e] }, n = this._dd.diff(this._virtualHeaderDOM, s);
    this._dd.apply(this.headerDOM, n), this._virtualHeaderDOM = s;
    const a = this.headerDOM.firstElementChild.clientWidth - this.dom.clientWidth;
    if (a) {
      const l = structuredClone(this._virtualHeaderDOM);
      l.attributes.style = `padding-right: ${a}px;`;
      const r = this._dd.diff(this._virtualHeaderDOM, l);
      this._dd.apply(this.headerDOM, r), this._virtualHeaderDOM = l;
    }
    t.scrollHeight > t.clientHeight && (t.style.overflowY = "scroll");
  }
  _bindEvents() {
    if (this.options.perPageSelect) {
      const t = B(this.options.classes.selector), e = this.wrapperDOM.querySelector(t);
      e && e instanceof HTMLSelectElement && e.addEventListener("change", () => {
        this.emit("datatable.perpage:before", this.options.perPage), this.options.perPage = parseInt(e.value, 10), this.update(), this._fixHeight(), this.emit("datatable.perpage", this.options.perPage);
      }, !1);
    }
    this.options.searchable && this.wrapperDOM.addEventListener("input", (t) => {
      const e = B(this.options.classes.input), s = t.target;
      if (!(s instanceof HTMLInputElement && s.matches(e))) return;
      t.preventDefault();
      const n = [];
      if (Array.from(this.wrapperDOM.querySelectorAll(e)).filter((a) => a.value.length).forEach((a) => {
        const o = a.dataset.and || this.options.searchAnd, l = a.dataset.querySeparator || this.options.searchQuerySeparator ? a.value.split(this.options.searchQuerySeparator) : [a.value];
        o ? l.forEach((r) => {
          a.dataset.columns ? n.push({ terms: [r], columns: JSON.parse(a.dataset.columns) }) : n.push({ terms: [r], columns: void 0 });
        }) : a.dataset.columns ? n.push({ terms: l, columns: JSON.parse(a.dataset.columns) }) : n.push({ terms: l, columns: void 0 });
      }), n.length === 1 && n[0].terms.length === 1) {
        const a = n[0];
        this.search(a.terms[0], a.columns);
      } else this.multiSearch(n);
    }), this.wrapperDOM.addEventListener("click", (t) => {
      const e = t.target.closest("a, button");
      if (e) {
        if (e.hasAttribute("data-page")) this.page(parseInt(e.getAttribute("data-page"), 10)), t.preventDefault();
        else if (Me(e, this.options.classes.sorter)) {
          const s = Array.from(e.parentElement.parentElement.children).indexOf(e.parentElement), n = me(s, this.columns.settings);
          this.columns.sort(n), t.preventDefault();
        } else if (Me(e, this.options.classes.filter)) {
          const s = Array.from(e.parentElement.parentElement.children).indexOf(e.parentElement), n = me(s, this.columns.settings);
          this.columns.filter(n), t.preventDefault();
        }
      }
    }, !1), this.options.rowNavigation && this.dom.addEventListener("keydown", (t) => {
      if (t.key === "ArrowUp") {
        let e;
        t.preventDefault(), t.stopPropagation(), this.pages[this._currentPage - 1].find((s) => s.index === this.rows.cursor || (e = s, !1)), e ? this.rows.setCursor(e.index) : this.onFirstPage || this.page(this._currentPage - 1, !0);
      } else if (t.key === "ArrowDown") {
        let e;
        t.preventDefault(), t.stopPropagation();
        const s = this.pages[this._currentPage - 1].find((n) => !!e || (n.index === this.rows.cursor && (e = !0), !1));
        s ? this.rows.setCursor(s.index) : this.onLastPage || this.page(this._currentPage + 1);
      } else this.options.rowSelectionKeys.includes(t.key) && this.emit("datatable.selectrow", this.rows.cursor, t, !0);
    }), this.dom.addEventListener("mousedown", (t) => {
      const e = t.target;
      if (!(e instanceof Element)) return;
      const s = Array.from(this.dom.querySelectorAll("tbody > tr")).find((n) => n.contains(e));
      s && s instanceof HTMLElement && this.emit("datatable.selectrow", parseInt(s.dataset.index, 10), t, this.dom.matches(":focus"));
    }), window.addEventListener("resize", this._listeners.onResize);
  }
  destroy() {
    var t;
    if (this.options.destroyable) {
      if (this.emit("datatable.destroy:before"), this.wrapperDOM) {
        const e = this.wrapperDOM.parentElement;
        if (e) {
          const s = U("div");
          s.innerHTML = this._initialHTML;
          const n = s.firstElementChild;
          e.replaceChild(n, this.wrapperDOM), this.dom = n;
        } else (t = this.options.classes.table) == null || t.split(" ").forEach((s) => this.wrapperDOM.classList.remove(s));
      }
      window.removeEventListener("resize", this._listeners.onResize), this.initialized = !1, this.emit("datatable.destroy");
    }
  }
  update(t = !1) {
    var e;
    this.emit("datatable.update:before"), t && (this.columns._measureWidths(), this.hasRows = !!this.data.data.length, this.hasHeadings = !!this.data.headings.length), (e = this.options.classes.empty) == null || e.split(" ").forEach((s) => this.wrapperDOM.classList.remove(s)), this._paginate(), this._renderPage(), this._renderPagers(), this.options.scrollY.length && this._renderSeparateHeader(), this.emit("datatable.update");
  }
  _paginate() {
    let t = this.data.data.map((e, s) => ({ row: e, index: s }));
    return this._searchQueries.length && (t = [], this._searchData.forEach((e) => t.push({ index: e, row: this.data.data[e] }))), this.columns._state.filters.length && this.columns._state.filters.forEach((e, s) => {
      e && (t = t.filter((n) => {
        const a = n.row.cells[s];
        return typeof e == "function" ? e(a.data) : z(a) === e;
      }));
    }), this.options.paging && this.options.perPage > 0 ? this.pages = t.map((e, s) => s % this.options.perPage === 0 ? t.slice(s, s + this.options.perPage) : null).filter((e) => e) : this.pages = [t], this.totalPages = this.lastPage = this.pages.length, this._currentPage || (this._currentPage = 1), this.totalPages;
  }
  _fixHeight() {
    this.options.fixedHeight && (this.containerDOM.style.height = null, this._rect = this.containerDOM.getBoundingClientRect(), this.containerDOM.style.height = `${this._rect.height}px`);
  }
  search(t, e = void 0, s = "search") {
    if (this.emit("datatable.search:before", t, this._searchData), !t.length) return this._currentPage = 1, this._searchQueries = [], this._searchData = [], this.update(), this.emit("datatable.search", "", []), this.wrapperDOM.classList.remove("search-results"), !1;
    this.multiSearch([{ terms: [t], columns: e || void 0 }], s), this.emit("datatable.search", t, this._searchData);
  }
  multiSearch(t, e = "search") {
    if (!this.hasRows) return !1;
    this._currentPage = 1, this._searchData = [];
    let s = t.map((a) => ({ columns: a.columns, terms: a.terms.map((o) => o.trim()).filter((o) => o), source: e })).filter((a) => a.terms.length);
    if (this.emit("datatable.multisearch:before", s, this._searchData), e.length && (s = s.concat(this._searchQueries.filter((a) => a.source !== e))), this._searchQueries = s, !s.length) return this.update(), this.emit("datatable.multisearch", s, this._searchData), this.wrapperDOM.classList.remove("search-results"), !1;
    const n = s.map((a) => this.columns.settings.map((o, l) => {
      if (!o || o.hidden || !o.searchable || a.columns && !a.columns.includes(l)) return !1;
      let r = a.terms;
      const d = o.sensitivity || this.options.sensitivity;
      return ["base", "accent"].includes(d) && (r = r.map((c) => c.toLowerCase())), ["base", "case"].includes(d) && (r = r.map((c) => c.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""))), (o.ignorePunctuation ?? this.options.ignorePunctuation) && (r = r.map((c) => c.replace(/[.,/#!$%^&*;:{}=-_`~()]/g, ""))), r;
    }));
    this.data.data.forEach((a, o) => {
      const l = a.cells.map((r, d) => {
        var g, _;
        const c = this.columns.settings[d], p = (c == null ? void 0 : c.searchMethod) || this.options.searchMethod;
        let f = r;
        if (((g = r.attributes) == null ? void 0 : g["data-rowspan-placeholder"]) === "true") for (let b = o - 1; b >= 0; b--) {
          const u = this.data.data[b].cells[d];
          if (((_ = u.attributes) == null ? void 0 : _["data-rowspan-placeholder"]) !== "true") {
            f = u;
            break;
          }
        }
        if (p) return f;
        let m = z(f).trim();
        if (m.length) {
          const b = (c == null ? void 0 : c.sensitivity) || this.options.sensitivity;
          ["base", "accent"].includes(b) && (m = m.toLowerCase()), ["base", "case"].includes(b) && (m = m.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "")), ((c == null ? void 0 : c.ignorePunctuation) ?? this.options.ignorePunctuation) && (m = m.replace(/[.,/#!$%^&*;:{}=-_`~()]/g, ""));
        }
        const h = (c == null ? void 0 : c.searchItemSeparator) || this.options.searchItemSeparator;
        return h ? m.split(h) : [m];
      });
      n.every((r, d) => r.find((c, p) => {
        if (!c) return !1;
        const f = this.columns.settings[p], m = (f == null ? void 0 : f.searchMethod) || this.options.searchMethod;
        return m ? m(c, l[p], a, p, s[d].source) : c.find((h) => {
          var g;
          return (g = l[p]) == null ? void 0 : g.find((_) => _ == null ? void 0 : _.includes(h));
        });
      })) && this._searchData.push(o);
    }), this.wrapperDOM.classList.add("search-results"), this._searchData.length ? this.update() : (this.wrapperDOM.classList.remove("search-results"), this.setMessage(this.options.labels.noResults)), this.emit("datatable.multisearch", s, this._searchData);
  }
  page(t, e = !1) {
    return this.emit("datatable.page:before", t), t !== this._currentPage && (isNaN(t) || (this._currentPage = t), !(t > this.pages.length || t < 0) && (this._renderPage(e), this._renderPagers(), void this.emit("datatable.page", t)));
  }
  insert(t) {
    let e = [];
    if (Array.isArray(t)) {
      const s = this.data.headings.map((n) => n.data ? String(n.data) : n.text);
      t.forEach((n, a) => {
        const o = [];
        Object.entries(n).forEach(([l, r]) => {
          const d = s.indexOf(l);
          d > -1 ? o[d] = ae(r, this.columns.settings[d]) : this.hasHeadings || this.hasRows || a !== 0 || (o[s.length] = ae(r, this.columns.settings[s.length]), s.push(l), this.data.headings.push(ce(l)));
        }), e.push({ cells: o });
      });
    } else ee(t) && (!t.headings || this.hasHeadings || this.hasRows ? t.data && Array.isArray(t.data) && (e = t.data.map((s) => {
      let n, a;
      return Array.isArray(s) ? (n = {}, a = s) : (n = s.attributes, a = s.cells), { attributes: n, cells: a.map((o, l) => ae(o, this.columns.settings[l])) };
    })) : this.data = Re(t, void 0, this.columns.settings, this.options.type, this.options.format));
    e.length && e.forEach((s) => this.data.data.push(s)), this.hasHeadings = !!this.data.headings.length, this.columns._state.sort && this.columns.sort(this.columns._state.sort.column, this.columns._state.sort.dir, !0), this.update(!0);
  }
  refresh() {
    if (this.emit("datatable.refresh:before"), this.options.searchable) {
      const t = B(this.options.classes.input);
      Array.from(this.wrapperDOM.querySelectorAll(t)).forEach((e) => e.value = ""), this._searchQueries = [];
    }
    this._currentPage = 1, this.onFirstPage = !0, this.update(!0), this.emit("datatable.refresh");
  }
  print() {
    const t = U("table");
    let e = Pe(this._tableAttributes, this.data.headings, this.data.data.map((a, o) => ({ row: a, index: o })), this.columns.settings, this.columns._state, !1, this.options, { noColumnWidths: !0, unhideHeader: !0 }, this._tableFooters, this._tableCaptions);
    if (this.options.tableRender) {
      const a = this.options.tableRender(this.data, e, "print");
      a && (e = a);
    }
    const s = this._dd.diff({ nodeName: "TABLE" }, e);
    this._dd.apply(t, s);
    const n = window.open();
    n.document.body.appendChild(t), n.print();
  }
  setMessage(t) {
    var a, o;
    const e = this.data.headings.filter((l, r) => {
      var d;
      return !((d = this.columns.settings[r]) != null && d.hidden);
    }).length || 1;
    (a = this.options.classes.empty) == null || a.split(" ").forEach((l) => this.wrapperDOM.classList.add(l)), this._label && (this._label.innerHTML = ""), this.totalPages = 0, this._renderPagers();
    let s = { nodeName: "TABLE", attributes: this._tableAttributes, childNodes: [{ nodeName: "THEAD", childNodes: [$e(this.data.headings, this.columns.settings, this.columns._state, this.options, {})] }, { nodeName: "TBODY", childNodes: [{ nodeName: "TR", childNodes: [{ nodeName: "TD", attributes: { class: this.options.classes.empty, colspan: String(e) }, childNodes: [{ nodeName: "#text", data: t }] }] }] }] };
    if (this._tableFooters.forEach((l) => s.childNodes.push(l)), this._tableCaptions.forEach((l) => s.childNodes.push(l)), (o = s.attributes.class) != null && o.includes(this.options.classes.table) || (s.attributes.class = Q(s.attributes.class, this.options.classes.table)), this.options.tableRender) {
      const l = this.options.tableRender(this.data, s, "message");
      l && (s = l);
    }
    const n = this._dd.diff(this._virtualDOM, s);
    this._dd.apply(this.dom, n), this._virtualDOM = s;
  }
  on(t, e) {
    this._events[t] = this._events[t] || [], this._events[t].push(e);
  }
  off(t, e) {
    t in this._events && this._events[t].splice(this._events[t].indexOf(e), 1);
  }
  emit(t, ...e) {
    if (t in this._events) for (let s = 0; s < this._events[t].length; s++) this._events[t][s](...e);
  }
}
const ft = function(i) {
  let t;
  if (!ee(i)) return !1;
  const e = { lineDelimiter: `
`, columnDelimiter: ",", removeDoubleQuotes: !1, ...i };
  if (e.data.length) {
    t = { data: [] };
    const s = e.data.split(e.lineDelimiter);
    if (s.length && (e.headings && (t.headings = s[0].split(e.columnDelimiter), e.removeDoubleQuotes && (t.headings = t.headings.map((n) => n.trim().replace(/(^"|"$)/g, ""))), s.shift()), s.forEach((n, a) => {
      t.data[a] = [];
      const o = n.split(e.columnDelimiter);
      o.length && o.forEach((l) => {
        e.removeDoubleQuotes && (l = l.trim().replace(/(^"|"$)/g, "")), t.data[a].push(l);
      });
    })), t) return t;
  }
  return !1;
}, mt = function(i) {
  let t;
  if (!ee(i)) return !1;
  const e = { data: "", ...i };
  if (e.data.length || ee(e.data)) {
    const s = !!ze(e.data) && JSON.parse(e.data);
    if (s ? (t = { headings: [], data: [] }, s.forEach((n, a) => {
      t.data[a] = [], Object.entries(n).forEach(([o, l]) => {
        t.headings.includes(o) || t.headings.push(o), t.data[a].push(l);
      });
    })) : console.warn("That's not valid JSON!"), t) return t;
  }
  return !1;
}, gt = function(i, t = {}) {
  if (!i.hasHeadings && !i.hasRows || !ee(t)) return !1;
  const e = { download: !0, skipColumn: [], lineDelimiter: `
`, columnDelimiter: ",", ...t }, s = (r) => {
    var d;
    return !e.skipColumn.includes(r) && !((d = i.columns.settings[r]) != null && d.hidden);
  }, n = i.data.headings.filter((r, d) => s(d)).map((r) => {
    var c;
    const d = Number(((c = r.attributes) == null ? void 0 : c.colspan) || 1);
    return [r.text ?? r.data, ...Array(d - 1).fill("")];
  }).flat(), a = /* @__PURE__ */ new Map();
  let o;
  if (e.selection) if (Array.isArray(e.selection)) {
    o = [];
    for (let r = 0; r < e.selection.length; r++) o = o.concat(i.pages[e.selection[r] - 1].map((d) => d.row));
  } else o = i.pages[e.selection - 1].map((r) => r.row);
  else o = i.data.data;
  let l = [];
  if (l[0] = n, l = l.concat(o.map((r) => {
    var f, m, h, g;
    const d = [];
    let c = 0, p = 0;
    for (; p < r.cells.length; ) {
      const _ = r.cells[p];
      if (s(p)) if (a.has(c)) {
        const b = a.get(c);
        d.push(b.cellText), b.remainingRows--, b.remainingRows <= 0 && a.delete(c), c++, p++;
      } else if (((f = _.attributes) == null ? void 0 : f["data-rowspan-placeholder"]) === "true") p++;
      else if (((m = _.attributes) == null ? void 0 : m["data-colspan-placeholder"]) === "true") d.push(""), c++, p++;
      else {
        const b = Number(((h = _.attributes) == null ? void 0 : h.colspan) || 1), u = Number(((g = _.attributes) == null ? void 0 : g.rowspan) || 1), v = z(_);
        d.push(v);
        for (let V = 1; V < b; V++) d.push("");
        u > 1 && a.set(c, { remainingRows: u - 1, cellText: v }), c++, p++;
      }
      else p++;
    }
    return d;
  })), l.length) {
    let r = "";
    if (l.forEach((d) => {
      d.forEach((c) => {
        typeof c == "string" && (c = (c = (c = (c = (c = c.trim()).replace(/\s{2,}/g, " ")).replace(/\n/g, "  ")).replace(/"/g, '""')).replace(/#/g, "%23")).includes(",") && (c = `"${c}"`), r += c + e.columnDelimiter;
      }), r = r.trim().substring(0, r.length - 1), r += e.lineDelimiter;
    }), r = r.trim().substring(0, r.length - 1), e.download) {
      const d = document.createElement("a");
      d.href = encodeURI(`data:text/csv;charset=utf-8,${r}`), d.download = `${e.filename || "datatable_export"}.csv`, document.body.appendChild(d), d.click(), document.body.removeChild(d);
    }
    return r;
  }
  return !1;
}, bt = function(i, t = {}) {
  if (!i.hasHeadings && !i.hasRows || !ee(t)) return !1;
  const e = { download: !0, skipColumn: [], replacer: null, space: 4, ...t }, s = (l) => {
    var r;
    return !e.skipColumn.includes(l) && !((r = i.columns.settings[l]) != null && r.hidden);
  };
  let n;
  if (e.selection) if (Array.isArray(e.selection)) {
    n = [];
    for (let l = 0; l < e.selection.length; l++) n = n.concat(i.pages[e.selection[l] - 1].map((r) => r.row));
  } else n = i.pages[e.selection - 1].map((l) => l.row);
  else n = i.data.data;
  const a = n.map((l) => l.cells.filter((r, d) => s(d)).map((r) => z(r))), o = i.data.headings.filter((l, r) => s(r)).map((l) => l.text ?? String(l.data));
  if (a.length) {
    const l = [];
    a.forEach((d, c) => {
      l[c] = l[c] || {}, d.forEach((p, f) => {
        l[c][o[f]] = p;
      });
    });
    const r = JSON.stringify(l, e.replacer, e.space);
    if (e.download) {
      const d = new Blob([r], { type: "data:application/json;charset=utf-8" }), c = URL.createObjectURL(d), p = document.createElement("a");
      p.href = c, p.download = `${e.filename || "datatable_export"}.json`, document.body.appendChild(p), p.click(), document.body.removeChild(p), URL.revokeObjectURL(c);
    }
    return r;
  }
  return !1;
}, vt = function(i, t = {}) {
  if (!i.hasHeadings && !i.hasRows || !ee(t)) return !1;
  const e = { download: !0, skipColumn: [], tableName: "myTable", ...t }, s = (l) => {
    var r;
    return !e.skipColumn.includes(l) && !((r = i.columns.settings[l]) != null && r.hidden);
  };
  let n = [];
  if (e.selection) if (Array.isArray(e.selection)) for (let l = 0; l < e.selection.length; l++) n = n.concat(i.pages[e.selection[l] - 1].map((r) => r.row));
  else n = i.pages[e.selection - 1].map((l) => l.row);
  else n = i.data.data;
  const a = n.map((l) => l.cells.filter((r, d) => s(d)).map((r) => z(r))), o = i.data.headings.filter((l, r) => s(r)).map((l) => l.text ?? String(l.data));
  if (a.length) {
    let l = `INSERT INTO \`${e.tableName}\` (`;
    if (o.forEach((r) => {
      l += `\`${r}\`,`;
    }), l = l.trim().substring(0, l.length - 1), l += ") VALUES ", a.forEach((r) => {
      l += "(", r.forEach((d) => {
        l += typeof d == "string" ? `"${d}",` : `${d},`;
      }), l = l.trim().substring(0, l.length - 1), l += "),";
    }), l = l.trim().substring(0, l.length - 1), l += ";", e.download && (l = `data:application/sql;charset=utf-8,${l}`), e.download) {
      const r = document.createElement("a");
      r.href = encodeURI(l), r.download = `${e.filename || "datatable_export"}.sql`, document.body.appendChild(r), r.click(), document.body.removeChild(r);
    }
    return l;
  }
  return !1;
}, wt = function(i, t = {}) {
  if (!i.hasHeadings && !i.hasRows || !ee(t)) return !1;
  const e = { download: !0, skipColumn: [], lineDelimiter: `
`, columnDelimiter: ",", ...t }, s = (l) => {
    var r;
    return !e.skipColumn.includes(l) && !((r = i.columns.settings[l]) != null && r.hidden);
  }, n = i.data.headings.filter((l, r) => s(r)).map((l) => l.text ?? l.data);
  let a;
  if (e.selection) if (Array.isArray(e.selection)) {
    a = [];
    for (let l = 0; l < e.selection.length; l++) a = a.concat(i.pages[e.selection[l] - 1].map((r) => r.row));
  } else a = i.pages[e.selection - 1].map((l) => l.row);
  else a = i.data.data;
  let o = [];
  if (o[0] = n, o = o.concat(a.map((l) => l.cells.filter((r, d) => s(d)).map((r) => z(r)))), o.length) {
    let l = "";
    if (o.forEach((r) => {
      r.forEach((d) => {
        typeof d == "string" && (d = (d = (d = (d = (d = d.trim()).replace(/\s{2,}/g, " ")).replace(/\n/g, "  ")).replace(/"/g, '""')).replace(/#/g, "%23")).includes(",") && (d = `"${d}"`), l += d + e.columnDelimiter;
      }), l = l.trim().substring(0, l.length - 1), l += e.lineDelimiter;
    }), l = l.trim().substring(0, l.length - 1), e.download && (l = `data:text/csv;charset=utf-8,${l}`), e.download) {
      const r = document.createElement("a");
      r.href = encodeURI(l), r.download = `${e.filename || "datatable_export"}.txt`, document.body.appendChild(r), r.click(), document.body.removeChild(r);
    }
    return l;
  }
  return !1;
}, rt = { classes: { row: "datatable-editor-row", form: "datatable-editor-form", item: "datatable-editor-item", menu: "datatable-editor-menu", save: "datatable-editor-save", block: "datatable-editor-block", cancel: "datatable-editor-cancel", close: "datatable-editor-close", inner: "datatable-editor-inner", input: "datatable-editor-input", label: "datatable-editor-label", modal: "datatable-editor-modal", action: "datatable-editor-action", header: "datatable-editor-header", wrapper: "datatable-editor-wrapper", editable: "datatable-editor-editable", container: "datatable-editor-container", separator: "datatable-editor-separator" }, labels: { closeX: "x", editCell: "Edit Cell", editRow: "Edit Row", removeRow: "Remove Row", reallyRemove: "Are you sure?", reallyCancel: "Do you really want to cancel?", save: "Save", cancel: "Cancel" }, cancelModal: (i) => confirm(i.options.labels.reallyCancel), inline: !0, hiddenColumns: !1, contextMenu: !0, clickEvent: "dblclick", excludeColumns: [], menuItems: [{ text: (i) => i.options.labels.editCell, action: (i, t) => {
  if (!(i.event.target instanceof Element)) return;
  const e = i.event.target.closest("td");
  return i.editCell(e);
} }, { text: (i) => i.options.labels.editRow, action: (i, t) => {
  if (!(i.event.target instanceof Element)) return;
  const e = i.event.target.closest("tr");
  return i.editRow(e);
} }, { separator: !0 }, { text: (i) => i.options.labels.removeRow, action: (i, t) => {
  if (i.event.target instanceof Element && confirm(i.options.labels.reallyRemove)) {
    const e = i.event.target.closest("tr");
    i.removeRow(e);
  }
} }] };
class lt {
  constructor(t, e = {}) {
    x(this, "menuOpen");
    x(this, "containerDOM");
    x(this, "data");
    x(this, "disabled");
    x(this, "dt");
    x(this, "editing");
    x(this, "editingCell");
    x(this, "editingRow");
    x(this, "event");
    x(this, "events");
    x(this, "initialized");
    x(this, "limits");
    x(this, "menuDOM");
    x(this, "modalDOM");
    x(this, "options");
    x(this, "originalRowRender");
    x(this, "rect");
    x(this, "wrapperDOM");
    this.dt = t, this.options = { ...rt, ...e };
  }
  init() {
    var t;
    this.initialized || ((t = this.options.classes.editable) == null || t.split(" ").forEach((e) => this.dt.wrapperDOM.classList.add(e)), this.options.inline && (this.originalRowRender = this.dt.options.rowRender, this.dt.options.rowRender = (e, s, n) => {
      let a = this.rowRender(e, s, n);
      return this.originalRowRender && (a = this.originalRowRender(e, a, n)), a;
    }), this.options.contextMenu && (this.containerDOM = U("div", { id: this.options.classes.container }), this.wrapperDOM = U("div", { class: this.options.classes.wrapper }), this.menuDOM = U("ul", { class: this.options.classes.menu }), this.options.menuItems && this.options.menuItems.length && this.options.menuItems.forEach((e) => {
      const s = U("li", { class: e.separator ? this.options.classes.separator : this.options.classes.item });
      if (!e.separator) {
        const n = U("a", { class: this.options.classes.action, href: e.url || "#", html: typeof e.text == "function" ? e.text(this) : e.text });
        s.appendChild(n), e.action && typeof e.action == "function" && n.addEventListener("click", (a) => {
          a.preventDefault(), e.action(this, a);
        });
      }
      this.menuDOM.appendChild(s);
    }), this.wrapperDOM.appendChild(this.menuDOM), this.containerDOM.appendChild(this.wrapperDOM), this.updateMenu()), this.data = {}, this.menuOpen = !1, this.editing = !1, this.editingRow = !1, this.editingCell = !1, this.bindEvents(), setTimeout(() => {
      this.initialized = !0, this.dt.emit("editable.init");
    }, 10));
  }
  bindEvents() {
    this.events = { keydown: this.keydown.bind(this), click: this.click.bind(this) }, this.dt.dom.addEventListener(this.options.clickEvent, this.events.click), document.addEventListener("keydown", this.events.keydown), this.options.contextMenu && (this.events.context = this.context.bind(this), this.events.updateMenu = this.updateMenu.bind(this), this.events.dismissMenu = this.dismissMenu.bind(this), this.events.reset = Ie(() => this.events.updateMenu(), 50), this.dt.dom.addEventListener("contextmenu", this.events.context), document.addEventListener("click", this.events.dismissMenu), window.addEventListener("resize", this.events.reset), window.addEventListener("scroll", this.events.reset));
  }
  context(t) {
    const e = t.target;
    if (!(e instanceof Element)) return;
    this.event = t;
    const s = e.closest("tbody td");
    if (!this.disabled && s) {
      t.preventDefault();
      let n = t.pageX, a = t.pageY;
      n > this.limits.x && (n -= this.rect.width), a > this.limits.y && (a -= this.rect.height), this.wrapperDOM.style.top = `${a}px`, this.wrapperDOM.style.left = `${n}px`, this.openMenu(), this.updateMenu();
    }
  }
  click(t) {
    const e = t.target;
    if (e instanceof Element) {
      if (this.editing && this.data && this.editingCell) {
        const s = B(this.options.classes.input), n = this.modalDOM ? this.modalDOM.querySelector(`input${s}[type=text]`) : this.dt.wrapperDOM.querySelector(`input${s}[type=text]`);
        this.saveCell(n.value);
      } else if (!this.editing) {
        const s = e.closest("tbody td");
        s && (this.editCell(s), t.preventDefault());
      }
    }
  }
  keydown(t) {
    const e = B(this.options.classes.input);
    if (this.modalDOM) {
      if (t.key === "Escape") this.options.cancelModal(this) && this.closeModal();
      else if (t.key === "Enter") if (this.editingCell) {
        const s = this.modalDOM.querySelector(`input${e}[type=text]`);
        this.saveCell(s.value);
      } else {
        const s = Array.from(this.modalDOM.querySelectorAll(`input${e}[type=text]`)).map((n) => n.value.trim());
        this.saveRow(s, this.data.row);
      }
    } else if (this.editing && this.data) if (t.key === "Enter") {
      if (this.editingCell) {
        const s = this.dt.wrapperDOM.querySelector(`input${e}[type=text]`);
        this.saveCell(s.value);
      } else if (this.editingRow) {
        const s = Array.from(this.dt.wrapperDOM.querySelectorAll(`input${e}[type=text]`)).map((n) => n.value.trim());
        this.saveRow(s, this.data.row);
      }
    } else t.key === "Escape" && (this.editingCell ? this.saveCell(this.data.content) : this.editingRow && this.saveRow(null, this.data.row));
  }
  editCell(t) {
    const e = me(t.cellIndex, this.dt.columns.settings);
    if (this.options.excludeColumns.includes(e)) return void this.closeMenu();
    const s = parseInt(t.parentElement.dataset.index, 10), n = this.dt.data.data[s].cells[e];
    this.data = { cell: n, rowIndex: s, columnIndex: e, content: z(n) }, this.editing = !0, this.editingCell = !0, this.options.inline ? this.dt.update() : this.editCellModal(), this.closeMenu();
  }
  editCellModal() {
    const t = this.data.cell, e = this.data.columnIndex, s = this.dt.data.headings[e].text || String(this.dt.data.headings[e].data), n = [`<div class='${this.options.classes.inner}'>`, `<div class='${this.options.classes.header}'>`, `<h4>${this.options.labels.editCell}</h4>`, `<button class='${this.options.classes.close}' type='button' data-editor-cancel>${this.options.labels.closeX}</button>`, " </div>", `<div class='${this.options.classes.block}'>`, `<form class='${this.options.classes.form}'>`, `<div class='${this.options.classes.row}'>`, `<label class='${this.options.classes.label}'>${re(s)}</label>`, `<input class='${this.options.classes.input}' value='${re(z(t))}' type='text'>`, "</div>", `<div class='${this.options.classes.row}'>`, `<button class='${this.options.classes.cancel}' type='button' data-editor-cancel>${this.options.labels.cancel}</button>`, `<button class='${this.options.classes.save}' type='button' data-editor-save>${this.options.labels.save}</button>`, "</div>", "</form>", "</div>", "</div>"].join(""), a = U("div", { class: this.options.classes.modal, html: n });
    this.modalDOM = a, this.openModal();
    const o = B(this.options.classes.input), l = a.querySelector(`input${o}[type=text]`);
    l.focus(), l.selectionStart = l.selectionEnd = l.value.length, a.addEventListener("click", (r) => {
      const d = r.target;
      d instanceof Element && (d.hasAttribute("data-editor-cancel") ? (r.preventDefault(), this.options.cancelModal(this) && this.closeModal()) : d.hasAttribute("data-editor-save") && (r.preventDefault(), this.saveCell(l.value)));
    });
  }
  saveCell(t) {
    const e = this.data.content, s = this.dt.columns.settings[this.data.columnIndex].type || this.dt.options.type, n = t.trim();
    let a;
    if (s === "number") a = { data: parseFloat(n) };
    else if (s === "boolean") a = ["", "false", "0"].includes(n) ? { data: !1, text: "false", order: 0 } : { data: !0, text: "true", order: 1 };
    else if (s === "html") a = { data: [{ nodeName: "#text", data: t }], text: t, order: t };
    else if (s === "string") a = { data: t };
    else if (s === "date") {
      const r = this.dt.columns.settings[this.data.columnIndex].format || this.dt.options.format;
      a = { data: t, order: ve(String(t), r) };
    } else a = { data: t };
    this.dt.data.data[this.data.rowIndex].cells[this.data.columnIndex] = a, this.closeModal();
    const o = this.data.rowIndex, l = this.data.columnIndex;
    this.data = {}, this.dt.update(!0), this.editing = !1, this.editingCell = !1, this.dt.emit("editable.save.cell", t, e, o, l);
  }
  editRow(t) {
    if (!t || t.nodeName !== "TR" || this.editing) return;
    const e = parseInt(t.dataset.index, 10), s = this.dt.data.data[e];
    this.data = { row: s.cells, rowIndex: e }, this.editing = !0, this.editingRow = !0, this.options.inline ? this.dt.update() : this.editRowModal(), this.closeMenu();
  }
  editRowModal() {
    var r;
    const t = this.data.row, e = [`<div class='${this.options.classes.inner}'>`, `<div class='${this.options.classes.header}'>`, `<h4>${this.options.labels.editRow}</h4>`, `<button class='${this.options.classes.close}' type='button' data-editor-cancel>${this.options.labels.closeX}</button>`, " </div>", `<div class='${this.options.classes.block}'>`, `<form class='${this.options.classes.form}'>`, `<div class='${this.options.classes.row}'>`, `<button class='${this.options.classes.cancel}' type='button' data-editor-cancel>${this.options.labels.cancel}</button>`, `<button class='${this.options.classes.save}' type='button' data-editor-save>${this.options.labels.save}</button>`, "</div>", "</form>", "</div>", "</div>"].join(""), s = U("div", { class: this.options.classes.modal, html: e }), n = s.firstElementChild;
    if (!n) return;
    const a = (r = n.lastElementChild) == null ? void 0 : r.firstElementChild;
    if (!a) return;
    t.forEach((d, c) => {
      const p = this.dt.columns.settings[c];
      if ((!p.hidden || p.hidden && this.options.hiddenColumns) && !this.options.excludeColumns.includes(c)) {
        const f = this.dt.data.headings[c].text || String(this.dt.data.headings[c].data);
        a.insertBefore(U("div", { class: this.options.classes.row, html: [`<div class='${this.options.classes.row}'>`, `<label class='${this.options.classes.label}'>${re(f)}</label>`, `<input class='${this.options.classes.input}' value='${re(z(d))}' type='text'>`, "</div>"].join("") }), a.lastElementChild);
      }
    }), this.modalDOM = s, this.openModal();
    const o = B(this.options.classes.input), l = Array.from(a.querySelectorAll(`input${o}[type=text]`));
    s.addEventListener("click", (d) => {
      const c = d.target;
      if (c instanceof Element) {
        if (c.hasAttribute("data-editor-cancel")) this.options.cancelModal(this) && this.closeModal();
        else if (c.hasAttribute("data-editor-save")) {
          const p = l.map((f) => f.value.trim());
          this.saveRow(p, this.data.row);
        }
      }
    });
  }
  saveRow(t, e) {
    const s = e.map((o) => z(o)), n = this.dt.data.data[this.data.rowIndex];
    if (t) {
      let o = 0;
      n.cells = e.map((l, r) => {
        if (this.options.excludeColumns.includes(r) || this.dt.columns.settings[r].hidden) return l;
        const d = this.dt.columns.settings[r].type || this.dt.options.type, c = t[o++];
        let p;
        if (d === "number") p = { data: parseFloat(c) };
        else if (d === "boolean") p = ["", "false", "0"].includes(c) ? { data: !1, text: "false", order: 0 } : { data: !0, text: "true", order: 1 };
        else if (d === "html") p = { data: [{ nodeName: "#text", data: c }], text: c, order: c };
        else if (d === "string") p = { data: c };
        else if (d === "date") {
          const f = this.dt.columns.settings[r].format || this.dt.options.format;
          p = { data: c, order: ve(String(c), f) };
        } else p = { data: c };
        return p;
      });
    }
    const a = n.cells.map((o) => z(o));
    this.data = {}, this.dt.update(!0), this.closeModal(), this.editing = !1, this.dt.emit("editable.save.row", a, s, e);
  }
  openModal() {
    this.modalDOM && document.body.appendChild(this.modalDOM);
  }
  closeModal() {
    this.editing && this.modalDOM && (document.body.removeChild(this.modalDOM), this.modalDOM = this.editing = this.editingRow = this.editingCell = !1);
  }
  removeRow(t) {
    if (!t || t.nodeName !== "TR" || this.editing) return;
    const e = parseInt(t.dataset.index, 10);
    this.dt.rows.remove(e), this.closeMenu();
  }
  updateMenu() {
    const t = window.scrollX || window.pageXOffset, e = window.scrollY || window.pageYOffset;
    this.rect = this.wrapperDOM.getBoundingClientRect(), this.limits = { x: window.innerWidth + t - this.rect.width, y: window.innerHeight + e - this.rect.height };
  }
  dismissMenu(t) {
    const e = t.target;
    if (!(e instanceof Element) || this.wrapperDOM.contains(e)) return;
    let s = !0;
    if (this.editing) {
      const n = B(this.options.classes.input);
      s = !e.matches(`input${n}[type=text]`);
    }
    s && this.closeMenu();
  }
  openMenu() {
    if (this.editing && this.data && this.editingCell) {
      const t = B(this.options.classes.input), e = this.modalDOM ? this.modalDOM.querySelector(`input${t}[type=text]`) : this.dt.wrapperDOM.querySelector(`input${t}[type=text]`);
      this.saveCell(e.value);
    }
    document.body.appendChild(this.containerDOM), this.menuOpen = !0, this.dt.emit("editable.context.open");
  }
  closeMenu() {
    this.menuOpen && (this.menuOpen = !1, document.body.removeChild(this.containerDOM), this.dt.emit("editable.context.close"));
  }
  destroy() {
    this.dt.dom.removeEventListener(this.options.clickEvent, this.events.click), this.dt.dom.removeEventListener("contextmenu", this.events.context), document.removeEventListener("click", this.events.dismissMenu), document.removeEventListener("keydown", this.events.keydown), window.removeEventListener("resize", this.events.reset), window.removeEventListener("scroll", this.events.reset), document.body.contains(this.containerDOM) && document.body.removeChild(this.containerDOM), this.options.inline && (this.dt.options.rowRender = this.originalRowRender), this.initialized = !1;
  }
  rowRender(t, e, s) {
    return !this.data || this.data.rowIndex !== s || (this.editingCell ? e.childNodes[function(n, a) {
      let o = n, l = 0;
      for (; l < n; ) a[l].hidden && (o -= 1), l++;
      return o;
    }(this.data.columnIndex, this.dt.columns.settings)].childNodes = [{ nodeName: "INPUT", attributes: { type: "text", value: this.data.content, class: this.options.classes.input } }] : e.childNodes.forEach((n, a) => {
      const o = me(a, this.dt.columns.settings), l = t[o];
      this.options.excludeColumns.includes(o) || (e.childNodes[a].childNodes = [{ nodeName: "INPUT", attributes: { type: "text", value: re(l.text || String(l.data) || ""), class: this.options.classes.input } }]);
    })), e;
  }
}
const _t = function(i, t = {}) {
  const e = new lt(i, t);
  return i.initialized ? e.init() : i.on("datatable.init", () => e.init()), e;
}, dt = { classes: { button: "datatable-column-filter-button", menu: "datatable-column-filter-menu", container: "datatable-column-filter-container", wrapper: "datatable-column-filter-wrapper" }, labels: { button: "Filter columns within the table" }, hiddenColumns: [] };
class ct {
  constructor(t, e = {}) {
    x(this, "addedButtonDOM");
    x(this, "menuOpen");
    x(this, "buttonDOM");
    x(this, "dt");
    x(this, "events");
    x(this, "initialized");
    x(this, "options");
    x(this, "menuDOM");
    x(this, "containerDOM");
    x(this, "wrapperDOM");
    x(this, "limits");
    x(this, "rect");
    x(this, "event");
    this.dt = t, this.options = { ...dt, ...e };
  }
  init() {
    if (this.initialized) return;
    const t = B(this.options.classes.button);
    let e = this.dt.wrapperDOM.querySelector(t);
    if (!e) {
      e = U("button", { class: this.options.classes.button, html: "▦" });
      const s = B(this.dt.options.classes.search), n = this.dt.wrapperDOM.querySelector(s);
      n ? n.appendChild(e) : this.dt.wrapperDOM.appendChild(e), this.addedButtonDOM = !0;
    }
    this.buttonDOM = e, this.containerDOM = U("div", { id: this.options.classes.container }), this.wrapperDOM = U("div", { class: this.options.classes.wrapper }), this.menuDOM = U("ul", { class: this.options.classes.menu, html: this.dt.data.headings.map((s, n) => {
      const a = this.dt.columns.settings[n];
      return this.options.hiddenColumns.includes(n) ? "" : `<li data-column="${n}">
                        <input type="checkbox" value="${s.text || s.data}" ${a.hidden ? "" : "checked=''"}>
                        <label>
                            ${s.text || s.data}
                        </label>
                    </li>`;
    }).join("") }), this.wrapperDOM.appendChild(this.menuDOM), this.containerDOM.appendChild(this.wrapperDOM), this._measureSpace(), this._bind(), this.initialized = !0;
  }
  dismiss() {
    this.addedButtonDOM && this.buttonDOM.parentElement && this.buttonDOM.parentElement.removeChild(this.buttonDOM), document.removeEventListener("click", this.events.click);
  }
  _bind() {
    this.events = { click: this._click.bind(this) }, document.addEventListener("click", this.events.click);
  }
  _openMenu() {
    document.body.appendChild(this.containerDOM), this._measureSpace(), this.menuOpen = !0, this.dt.emit("columnFilter.menu.open");
  }
  _closeMenu() {
    this.menuOpen && (this.menuOpen = !1, document.body.removeChild(this.containerDOM), this.dt.emit("columnFilter.menu.close"));
  }
  _measureSpace() {
    const t = window.scrollX || window.pageXOffset, e = window.scrollY || window.pageYOffset;
    this.rect = this.wrapperDOM.getBoundingClientRect(), this.limits = { x: window.innerWidth + t - this.rect.width, y: window.innerHeight + e - this.rect.height };
  }
  _click(t) {
    const e = t.target;
    if (e instanceof Element) if (this.event = t, this.buttonDOM.contains(e)) {
      if (t.preventDefault(), this.menuOpen) return void this._closeMenu();
      this._openMenu();
      let s = t.pageX, n = t.pageY;
      s > this.limits.x && (s -= this.rect.width), n > this.limits.y && (n -= this.rect.height), this.wrapperDOM.style.top = `${n}px`, this.wrapperDOM.style.left = `${s}px`;
    } else if (this.menuDOM.contains(e)) {
      const s = B(this.options.classes.menu), n = e.closest(`${s} > li`);
      if (!n) return;
      const a = n.querySelector("input[type=checkbox]");
      a.contains(e) || (a.checked = !a.checked);
      const o = Number(n.dataset.column);
      a.checked ? this.dt.columns.show([o]) : this.dt.columns.hide([o]);
    } else this.menuOpen && this._closeMenu();
  }
}
const yt = function(i, t = {}) {
  const e = new ct(i, t);
  return i.initialized ? e.init() : i.on("datatable.init", () => e.init()), e;
};
export {
  pt as DataTable,
  yt as addColumnFilter,
  ft as convertCSV,
  mt as convertJSON,
  U as createElement,
  gt as exportCSV,
  bt as exportJSON,
  vt as exportSQL,
  wt as exportTXT,
  ze as isJson,
  ee as isObject,
  _t as makeEditable
};
