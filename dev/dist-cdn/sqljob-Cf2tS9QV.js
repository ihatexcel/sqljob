import { gq as L, gr as x, gs as N, gt as B, gu as R, gv as $, gw as b, gx as F, gy as P } from "./sqljob-CMmUvraI.js";
var k = /\s/;
function q(n) {
  for (var e = n.length; e-- && k.test(n.charAt(e)); )
    ;
  return e;
}
var z = /^\s+/;
function D(n) {
  return n && n.slice(0, q(n) + 1).replace(z, "");
}
var W = NaN, H = /^[-+]0x[0-9a-f]+$/i, K = /^0b[01]+$/i, U = /^0o[0-7]+$/i, X = parseInt;
function _(n) {
  if (typeof n == "number")
    return n;
  if (L(n))
    return W;
  if (x(n)) {
    var e = typeof n.valueOf == "function" ? n.valueOf() : n;
    n = x(e) ? e + "" : e;
  }
  if (typeof n != "string")
    return n === 0 ? n : +n;
  n = D(n);
  var t = K.test(n);
  return t || U.test(n) ? X(n.slice(2), t ? 2 : 8) : H.test(n) ? W : +n;
}
var p = function() {
  return N.Date.now();
}, G = "Expected a function", J = Math.max, Q = Math.min;
function w(n, e, t) {
  var u, s, c, d, i, a, f = 0, m = !1, g = !1, I = !0;
  if (typeof n != "function")
    throw new TypeError(G);
  e = _(e) || 0, x(t) && (m = !!t.leading, g = "maxWait" in t, c = g ? J(_(t.maxWait) || 0, e) : c, I = "trailing" in t ? !!t.trailing : I);
  function T(r) {
    var o = u, l = s;
    return u = s = void 0, f = r, d = n.apply(l, o), d;
  }
  function A(r) {
    return f = r, i = setTimeout(v, e), m ? T(r) : d;
  }
  function M(r) {
    var o = r - a, l = r - f, S = e - o;
    return g ? Q(S, c - l) : S;
  }
  function E(r) {
    var o = r - a, l = r - f;
    return a === void 0 || o >= e || o < 0 || g && l >= c;
  }
  function v() {
    var r = p();
    if (E(r))
      return y(r);
    i = setTimeout(v, M(r));
  }
  function y(r) {
    return i = void 0, I && u ? T(r) : (u = s = void 0, d);
  }
  function O() {
    i !== void 0 && clearTimeout(i), f = 0, u = a = s = i = void 0;
  }
  function C() {
    return i === void 0 ? d : y(p());
  }
  function h() {
    var r = p(), o = E(r);
    if (u = arguments, s = this, a = r, o) {
      if (i === void 0)
        return A(a);
      if (g)
        return clearTimeout(i), i = setTimeout(v, e), T(a);
    }
    return i === void 0 && (i = setTimeout(v, e)), d;
  }
  return h.cancel = O, h.flush = C, h;
}
var V = B(function(n, e, t, u) {
  R(n, e, t, u);
});
function Y(n, e, t, u) {
  if (!x(n))
    return n;
  e = $(e, n);
  for (var s = -1, c = e.length, d = c - 1, i = n; i != null && ++s < c; ) {
    var a = b(e[s]), f = t;
    if (a === "__proto__" || a === "constructor" || a === "prototype")
      return n;
    if (s != d) {
      var m = i[a];
      f = void 0, f === void 0 && (f = x(m) ? m : F(e[s + 1]) ? [] : {});
    }
    P(i, a, f), i = i[a];
  }
  return n;
}
function j(n, e, t) {
  return n == null ? n : Y(n, e, t);
}
export {
  w as d,
  V as m,
  j as s
};
