import { f$ as L, g0 as x, g1 as N, g2 as $, g3 as B, g4 as R, g5 as b, g6 as F, g7 as P } from "./sqljob-K6a4RyuV.js";
var k = /\s/;
function z(n) {
  for (var e = n.length; e-- && k.test(n.charAt(e)); )
    ;
  return e;
}
var D = /^\s+/;
function H(n) {
  return n && n.slice(0, z(n) + 1).replace(D, "");
}
var y = NaN, K = /^[-+]0x[0-9a-f]+$/i, U = /^0b[01]+$/i, X = /^0o[0-7]+$/i, q = parseInt;
function _(n) {
  if (typeof n == "number")
    return n;
  if (L(n))
    return y;
  if (x(n)) {
    var e = typeof n.valueOf == "function" ? n.valueOf() : n;
    n = x(e) ? e + "" : e;
  }
  if (typeof n != "string")
    return n === 0 ? n : +n;
  n = H(n);
  var t = U.test(n);
  return t || X.test(n) ? q(n.slice(2), t ? 2 : 8) : K.test(n) ? y : +n;
}
var p = function() {
  return N.Date.now();
}, G = "Expected a function", J = Math.max, Q = Math.min;
function V(n, e, t) {
  var u, f, c, d, i, a, s = 0, m = !1, g = !1, I = !0;
  if (typeof n != "function")
    throw new TypeError(G);
  e = _(e) || 0, x(t) && (m = !!t.leading, g = "maxWait" in t, c = g ? J(_(t.maxWait) || 0, e) : c, I = "trailing" in t ? !!t.trailing : I);
  function T(r) {
    var o = u, l = f;
    return u = f = void 0, s = r, d = n.apply(l, o), d;
  }
  function A(r) {
    return s = r, i = setTimeout(v, e), m ? T(r) : d;
  }
  function M(r) {
    var o = r - a, l = r - s, W = e - o;
    return g ? Q(W, c - l) : W;
  }
  function E(r) {
    var o = r - a, l = r - s;
    return a === void 0 || o >= e || o < 0 || g && l >= c;
  }
  function v() {
    var r = p();
    if (E(r))
      return S(r);
    i = setTimeout(v, M(r));
  }
  function S(r) {
    return i = void 0, I && u ? T(r) : (u = f = void 0, d);
  }
  function O() {
    i !== void 0 && clearTimeout(i), s = 0, u = a = f = i = void 0;
  }
  function C() {
    return i === void 0 ? d : S(p());
  }
  function h() {
    var r = p(), o = E(r);
    if (u = arguments, f = this, a = r, o) {
      if (i === void 0)
        return A(a);
      if (g)
        return clearTimeout(i), i = setTimeout(v, e), T(a);
    }
    return i === void 0 && (i = setTimeout(v, e)), d;
  }
  return h.cancel = O, h.flush = C, h;
}
var w = $(function(n, e, t, u) {
  B(n, e, t, u);
});
function Y(n, e, t, u) {
  if (!x(n))
    return n;
  e = R(e, n);
  for (var f = -1, c = e.length, d = c - 1, i = n; i != null && ++f < c; ) {
    var a = b(e[f]), s = t;
    if (a === "__proto__" || a === "constructor" || a === "prototype")
      return n;
    if (f != d) {
      var m = i[a];
      s = void 0, s === void 0 && (s = x(m) ? m : F(e[f + 1]) ? [] : {});
    }
    P(i, a, s), i = i[a];
  }
  return n;
}
function j(n, e, t) {
  return n == null ? n : Y(n, e, t);
}
export {
  V as d,
  w as m,
  j as s
};
