import { t as ca, a as Z, C as w, c as We, b as xr, P as bt, d as V0, e as q, f as sc, g as x, M as Lt, h as vn, U as Nn, i as Oo, j as is, k as Po, p as ut, l as jn, s as Ka, r as Pr, m as Dr, n as G0, o as oc, I as cc, q as la, E as Ra, F as Yc, u as Kh, v as X0, w as Y0, x as J0, y as Q0, z as eu, A as tu, B as ru, D as iu, G as Tr, H as lc, J as _n, K as nu, L as au, N as _s, O as su, Q as In, R as ks, S as ou, T as Do, V as Eo, W as To, X as cu, Y as lu, Z as uu, _ as du, $ as Vh, a0 as hu, a1 as Ss, a2 as fu, a3 as bu, a4 as xu, a5 as gu, a6 as dt, a7 as he, a8 as ln, a9 as Oe, aa as Qe, ab as Xe, ac as un, ad as ye, ae as Xt, af as ci, ag as $i, ah as we, ai as ua, aj as As, ak as Cs, al as ve, am as J, an as H, ao as Wi, ap as Hi, aq as qi, ar as Yt, as as da, at as ha, au as Fs, av as Os, aw as Ps, ax as fa, ay as pu, az as Ds, aA as Es, aB as mu, aC as Ts, aD as Rs, aE as Bs, aF as uc, aG as dc, aH as zn, aI as wu, aJ as hc, aK as ba, aL as yu, aM as fc, aN as vu, aO as Ar, aP as Cr, aQ as se, aR as Ne, aS as _u, aT as ku, aU as F, aV as R, aW as bc, aX as xc, aY as Ro, aZ as Su, a_ as xa, a$ as Au, b0 as et, b1 as kn, b2 as Ln, b3 as yi, b4 as Cu, b5 as $e, b6 as Bo, b7 as Fu, b8 as Ou, b9 as Pu, ba as Du, bb as Va, bc as lr, bd as Eu, be as No, bf as dn, bg as Tu, bh as Gh, bi as Xh, bj as Yh, bk as Jh, bl as Qh, bm as ef, bn as tf, bo as rf, bp as nf, bq as af, br as sf, bs as of, bt as cf, bu as lf, bv as uf, bw as df, bx as hf, by as ff, bz as bf, bA as xf, bB as gf, bC as pf, bD as mf, bE as wf, bF as yf, bG as vf, bH as _f, bI as kf, bJ as Sf, bK as Af, bL as Cf, bM as Ff, bN as Of, bO as Pf, bP as Df, bQ as Ef, bR as Tf, bS as Rf, bT as Bf, bU as Nf, bV as jf, bW as If, bX as zf, bY as Lf, bZ as Mf, b_ as Uf, b$ as $f, c0 as Wf, c1 as Hf, c2 as qf } from "./sqljob-BJYDrqzR.js";
import { g as Zf, c as ns } from "./sqljob-CwswMsSl.js";
import { q as gc, m as Kf, s as Jc, f as Vf, l as Gf, t as Qc } from "./sqljob-CiNH89nQ.js";
import { p as Xf, g as Yf, r as el } from "./sqljob-D7vrP-w6.js";
const Hr = () => new Promise((r) => {
  setTimeout(() => r(), 0);
}), Jf = (r, e = !0) => {
  const t = [];
  e && t.push(239, 187, 191);
  for (let i = 0, n = r.length; i < n; ) {
    const a = r.codePointAt(i);
    if (a < 128) {
      const s = a & 127;
      t.push(s), i += 1;
    } else if (a < 2048) {
      const s = a >> 6 & 31 | 192, o = a & 63 | 128;
      t.push(s, o), i += 1;
    } else if (a < 65536) {
      const s = a >> 12 & 15 | 224, o = a >> 6 & 63 | 128, l = a & 63 | 128;
      t.push(s, o, l), i += 1;
    } else if (a < 1114112) {
      const s = a >> 18 & 7 | 240, o = a >> 12 & 63 | 128, l = a >> 6 & 63 | 128, c = a >> 0 & 63 | 128;
      t.push(s, o, l, c), i += 2;
    } else
      throw new Error(`Invalid code point: 0x${ca(a)}`);
  }
  return new Uint8Array(t);
}, Ru = (r, e = !0) => {
  const t = [];
  e && t.push(65279);
  for (let i = 0, n = r.length; i < n; ) {
    const a = r.codePointAt(i);
    if (a < 65536)
      t.push(a), i += 1;
    else if (a < 1114112)
      t.push(pc(a), mc(a)), i += 2;
    else
      throw new Error(`Invalid code point: 0x${ca(a)}`);
  }
  return new Uint16Array(t);
}, Bu = (r) => r >= 0 && r <= 65535, Nu = (r) => r >= 65536 && r <= 1114111, pc = (r) => Math.floor((r - 65536) / 1024) + 55296, mc = (r) => (r - 65536) % 1024 + 56320;
var gr;
(function(r) {
  r.BigEndian = "BigEndian", r.LittleEndian = "LittleEndian";
})(gr || (gr = {}));
const rn = "�".codePointAt(0), wc = (r, e = !0) => {
  if (r.length <= 1)
    return String.fromCodePoint(rn);
  const t = e ? eb(r) : gr.BigEndian;
  let i = e ? 2 : 0;
  const n = [];
  for (; r.length - i >= 2; ) {
    const a = rl(r[i++], r[i++], t);
    if (Qf(a))
      if (r.length - i < 2)
        n.push(rn);
      else {
        const s = rl(r[i++], r[i++], t);
        tl(s) ? n.push(a, s) : n.push(rn);
      }
    else tl(a) ? (i += 2, n.push(rn)) : n.push(a);
  }
  return i < r.length && n.push(rn), String.fromCodePoint(...n);
}, Qf = (r) => r >= 55296 && r <= 56319, tl = (r) => r >= 56320 && r <= 57343, rl = (r, e, t) => {
  if (t === gr.LittleEndian)
    return e << 8 | r;
  if (t === gr.BigEndian)
    return r << 8 | e;
  throw new Error(`Invalid byteOrder: ${t}`);
}, eb = (r) => ju(r) ? gr.BigEndian : Iu(r) ? gr.LittleEndian : gr.BigEndian, ju = (r) => r[0] === 254 && r[1] === 255, Iu = (r) => r[0] === 255 && r[1] === 254, yc = (r) => ju(r) || Iu(r), K = new Uint16Array(256);
for (let r = 0; r < 256; r++)
  K[r] = r;
K[22] = Z("");
K[24] = Z("˘");
K[25] = Z("ˇ");
K[26] = Z("ˆ");
K[27] = Z("˙");
K[28] = Z("˝");
K[29] = Z("˛");
K[30] = Z("˚");
K[31] = Z("˜");
K[127] = Z("�");
K[128] = Z("•");
K[129] = Z("†");
K[130] = Z("‡");
K[131] = Z("…");
K[132] = Z("—");
K[133] = Z("–");
K[134] = Z("ƒ");
K[135] = Z("⁄");
K[136] = Z("‹");
K[137] = Z("›");
K[138] = Z("−");
K[139] = Z("‰");
K[140] = Z("„");
K[141] = Z("“");
K[142] = Z("”");
K[143] = Z("‘");
K[144] = Z("’");
K[145] = Z("‚");
K[146] = Z("™");
K[147] = Z("ﬁ");
K[148] = Z("ﬂ");
K[149] = Z("Ł");
K[150] = Z("Œ");
K[151] = Z("Š");
K[152] = Z("Ÿ");
K[153] = Z("Ž");
K[154] = Z("ı");
K[155] = Z("ł");
K[156] = Z("œ");
K[157] = Z("š");
K[158] = Z("ž");
K[159] = Z("�");
K[160] = Z("€");
K[173] = Z("�");
const vc = (r) => {
  const e = new Array(r.length);
  for (let t = 0, i = r.length; t < i; t++)
    e[t] = K[r[t]];
  return String.fromCodePoint(...e);
};
class it {
  constructor(e) {
    Object.defineProperty(this, "populate", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "value", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.populate = e, this.value = void 0;
  }
  getValue() {
    return this.value;
  }
  access() {
    return this.value || (this.value = this.populate()), this.value;
  }
  invalidate() {
    this.value = void 0;
  }
}
Object.defineProperty(it, "populatedBy", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => new it(r)
});
/*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) */
const tb = 4, il = 0, nl = 1, rb = 2;
function Zi(r) {
  let e = r.length;
  for (; --e >= 0; )
    r[e] = 0;
}
const ib = 0, zu = 1, nb = 2, ab = 3, sb = 258, _c = 29, ga = 256, Mn = ga + 1 + _c, Si = 30, kc = 19, Lu = 2 * Mn + 1, Rr = 15, Ys = 16, ob = 7, Sc = 256, Mu = 16, Uu = 17, $u = 18, jo = (
  /* extra bits for each length code */
  new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0])
), Ga = (
  /* extra bits for each distance code */
  new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13])
), cb = (
  /* extra bits for each bit length code */
  new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7])
), Wu = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), lb = 512, jt = new Array((Mn + 2) * 2);
Zi(jt);
const Sn = new Array(Si * 2);
Zi(Sn);
const Un = new Array(lb);
Zi(Un);
const $n = new Array(sb - ab + 1);
Zi($n);
const Ac = new Array(_c);
Zi(Ac);
const as = new Array(Si);
Zi(as);
function Js(r, e, t, i, n) {
  this.static_tree = r, this.extra_bits = e, this.extra_base = t, this.elems = i, this.max_length = n, this.has_stree = r && r.length;
}
let Hu, qu, Zu;
function Qs(r, e) {
  this.dyn_tree = r, this.max_code = 0, this.stat_desc = e;
}
const Ku = (r) => r < 256 ? Un[r] : Un[256 + (r >>> 7)], Wn = (r, e) => {
  r.pending_buf[r.pending++] = e & 255, r.pending_buf[r.pending++] = e >>> 8 & 255;
}, He = (r, e, t) => {
  r.bi_valid > Ys - t ? (r.bi_buf |= e << r.bi_valid & 65535, Wn(r, r.bi_buf), r.bi_buf = e >> Ys - r.bi_valid, r.bi_valid += t - Ys) : (r.bi_buf |= e << r.bi_valid & 65535, r.bi_valid += t);
}, vt = (r, e, t) => {
  He(
    r,
    t[e * 2],
    t[e * 2 + 1]
    /*.Len*/
  );
}, Vu = (r, e) => {
  let t = 0;
  do
    t |= r & 1, r >>>= 1, t <<= 1;
  while (--e > 0);
  return t >>> 1;
}, ub = (r) => {
  r.bi_valid === 16 ? (Wn(r, r.bi_buf), r.bi_buf = 0, r.bi_valid = 0) : r.bi_valid >= 8 && (r.pending_buf[r.pending++] = r.bi_buf & 255, r.bi_buf >>= 8, r.bi_valid -= 8);
}, db = (r, e) => {
  const t = e.dyn_tree, i = e.max_code, n = e.stat_desc.static_tree, a = e.stat_desc.has_stree, s = e.stat_desc.extra_bits, o = e.stat_desc.extra_base, l = e.stat_desc.max_length;
  let c, u, f, h, d, b, p = 0;
  for (h = 0; h <= Rr; h++)
    r.bl_count[h] = 0;
  for (t[r.heap[r.heap_max] * 2 + 1] = 0, c = r.heap_max + 1; c < Lu; c++)
    u = r.heap[c], h = t[t[u * 2 + 1] * 2 + 1] + 1, h > l && (h = l, p++), t[u * 2 + 1] = h, !(u > i) && (r.bl_count[h]++, d = 0, u >= o && (d = s[u - o]), b = t[u * 2], r.opt_len += b * (h + d), a && (r.static_len += b * (n[u * 2 + 1] + d)));
  if (p !== 0) {
    do {
      for (h = l - 1; r.bl_count[h] === 0; )
        h--;
      r.bl_count[h]--, r.bl_count[h + 1] += 2, r.bl_count[l]--, p -= 2;
    } while (p > 0);
    for (h = l; h !== 0; h--)
      for (u = r.bl_count[h]; u !== 0; )
        f = r.heap[--c], !(f > i) && (t[f * 2 + 1] !== h && (r.opt_len += (h - t[f * 2 + 1]) * t[f * 2], t[f * 2 + 1] = h), u--);
  }
}, Gu = (r, e, t) => {
  const i = new Array(Rr + 1);
  let n = 0, a, s;
  for (a = 1; a <= Rr; a++)
    n = n + t[a - 1] << 1, i[a] = n;
  for (s = 0; s <= e; s++) {
    let o = r[s * 2 + 1];
    o !== 0 && (r[s * 2] = Vu(i[o]++, o));
  }
}, hb = () => {
  let r, e, t, i, n;
  const a = new Array(Rr + 1);
  for (t = 0, i = 0; i < _c - 1; i++)
    for (Ac[i] = t, r = 0; r < 1 << jo[i]; r++)
      $n[t++] = i;
  for ($n[t - 1] = i, n = 0, i = 0; i < 16; i++)
    for (as[i] = n, r = 0; r < 1 << Ga[i]; r++)
      Un[n++] = i;
  for (n >>= 7; i < Si; i++)
    for (as[i] = n << 7, r = 0; r < 1 << Ga[i] - 7; r++)
      Un[256 + n++] = i;
  for (e = 0; e <= Rr; e++)
    a[e] = 0;
  for (r = 0; r <= 143; )
    jt[r * 2 + 1] = 8, r++, a[8]++;
  for (; r <= 255; )
    jt[r * 2 + 1] = 9, r++, a[9]++;
  for (; r <= 279; )
    jt[r * 2 + 1] = 7, r++, a[7]++;
  for (; r <= 287; )
    jt[r * 2 + 1] = 8, r++, a[8]++;
  for (Gu(jt, Mn + 1, a), r = 0; r < Si; r++)
    Sn[r * 2 + 1] = 5, Sn[r * 2] = Vu(r, 5);
  Hu = new Js(jt, jo, ga + 1, Mn, Rr), qu = new Js(Sn, Ga, 0, Si, Rr), Zu = new Js(new Array(0), cb, 0, kc, ob);
}, Xu = (r) => {
  let e;
  for (e = 0; e < Mn; e++)
    r.dyn_ltree[e * 2] = 0;
  for (e = 0; e < Si; e++)
    r.dyn_dtree[e * 2] = 0;
  for (e = 0; e < kc; e++)
    r.bl_tree[e * 2] = 0;
  r.dyn_ltree[Sc * 2] = 1, r.opt_len = r.static_len = 0, r.sym_next = r.matches = 0;
}, Yu = (r) => {
  r.bi_valid > 8 ? Wn(r, r.bi_buf) : r.bi_valid > 0 && (r.pending_buf[r.pending++] = r.bi_buf), r.bi_buf = 0, r.bi_valid = 0;
}, al = (r, e, t, i) => {
  const n = e * 2, a = t * 2;
  return r[n] < r[a] || r[n] === r[a] && i[e] <= i[t];
}, eo = (r, e, t) => {
  const i = r.heap[t];
  let n = t << 1;
  for (; n <= r.heap_len && (n < r.heap_len && al(e, r.heap[n + 1], r.heap[n], r.depth) && n++, !al(e, i, r.heap[n], r.depth)); )
    r.heap[t] = r.heap[n], t = n, n <<= 1;
  r.heap[t] = i;
}, sl = (r, e, t) => {
  let i, n, a = 0, s, o;
  if (r.sym_next !== 0)
    do
      i = r.pending_buf[r.sym_buf + a++] & 255, i += (r.pending_buf[r.sym_buf + a++] & 255) << 8, n = r.pending_buf[r.sym_buf + a++], i === 0 ? vt(r, n, e) : (s = $n[n], vt(r, s + ga + 1, e), o = jo[s], o !== 0 && (n -= Ac[s], He(r, n, o)), i--, s = Ku(i), vt(r, s, t), o = Ga[s], o !== 0 && (i -= as[s], He(r, i, o)));
    while (a < r.sym_next);
  vt(r, Sc, e);
}, Io = (r, e) => {
  const t = e.dyn_tree, i = e.stat_desc.static_tree, n = e.stat_desc.has_stree, a = e.stat_desc.elems;
  let s, o, l = -1, c;
  for (r.heap_len = 0, r.heap_max = Lu, s = 0; s < a; s++)
    t[s * 2] !== 0 ? (r.heap[++r.heap_len] = l = s, r.depth[s] = 0) : t[s * 2 + 1] = 0;
  for (; r.heap_len < 2; )
    c = r.heap[++r.heap_len] = l < 2 ? ++l : 0, t[c * 2] = 1, r.depth[c] = 0, r.opt_len--, n && (r.static_len -= i[c * 2 + 1]);
  for (e.max_code = l, s = r.heap_len >> 1; s >= 1; s--)
    eo(r, t, s);
  c = a;
  do
    s = r.heap[
      1
      /*SMALLEST*/
    ], r.heap[
      1
      /*SMALLEST*/
    ] = r.heap[r.heap_len--], eo(
      r,
      t,
      1
      /*SMALLEST*/
    ), o = r.heap[
      1
      /*SMALLEST*/
    ], r.heap[--r.heap_max] = s, r.heap[--r.heap_max] = o, t[c * 2] = t[s * 2] + t[o * 2], r.depth[c] = (r.depth[s] >= r.depth[o] ? r.depth[s] : r.depth[o]) + 1, t[s * 2 + 1] = t[o * 2 + 1] = c, r.heap[
      1
      /*SMALLEST*/
    ] = c++, eo(
      r,
      t,
      1
      /*SMALLEST*/
    );
  while (r.heap_len >= 2);
  r.heap[--r.heap_max] = r.heap[
    1
    /*SMALLEST*/
  ], db(r, e), Gu(t, l, r.bl_count);
}, ol = (r, e, t) => {
  let i, n = -1, a, s = e[0 * 2 + 1], o = 0, l = 7, c = 4;
  for (s === 0 && (l = 138, c = 3), e[(t + 1) * 2 + 1] = 65535, i = 0; i <= t; i++)
    a = s, s = e[(i + 1) * 2 + 1], !(++o < l && a === s) && (o < c ? r.bl_tree[a * 2] += o : a !== 0 ? (a !== n && r.bl_tree[a * 2]++, r.bl_tree[Mu * 2]++) : o <= 10 ? r.bl_tree[Uu * 2]++ : r.bl_tree[$u * 2]++, o = 0, n = a, s === 0 ? (l = 138, c = 3) : a === s ? (l = 6, c = 3) : (l = 7, c = 4));
}, cl = (r, e, t) => {
  let i, n = -1, a, s = e[0 * 2 + 1], o = 0, l = 7, c = 4;
  for (s === 0 && (l = 138, c = 3), i = 0; i <= t; i++)
    if (a = s, s = e[(i + 1) * 2 + 1], !(++o < l && a === s)) {
      if (o < c)
        do
          vt(r, a, r.bl_tree);
        while (--o !== 0);
      else a !== 0 ? (a !== n && (vt(r, a, r.bl_tree), o--), vt(r, Mu, r.bl_tree), He(r, o - 3, 2)) : o <= 10 ? (vt(r, Uu, r.bl_tree), He(r, o - 3, 3)) : (vt(r, $u, r.bl_tree), He(r, o - 11, 7));
      o = 0, n = a, s === 0 ? (l = 138, c = 3) : a === s ? (l = 6, c = 3) : (l = 7, c = 4);
    }
}, fb = (r) => {
  let e;
  for (ol(r, r.dyn_ltree, r.l_desc.max_code), ol(r, r.dyn_dtree, r.d_desc.max_code), Io(r, r.bl_desc), e = kc - 1; e >= 3 && r.bl_tree[Wu[e] * 2 + 1] === 0; e--)
    ;
  return r.opt_len += 3 * (e + 1) + 5 + 5 + 4, e;
}, bb = (r, e, t, i) => {
  let n;
  for (He(r, e - 257, 5), He(r, t - 1, 5), He(r, i - 4, 4), n = 0; n < i; n++)
    He(r, r.bl_tree[Wu[n] * 2 + 1], 3);
  cl(r, r.dyn_ltree, e - 1), cl(r, r.dyn_dtree, t - 1);
}, xb = (r) => {
  let e = 4093624447, t;
  for (t = 0; t <= 31; t++, e >>>= 1)
    if (e & 1 && r.dyn_ltree[t * 2] !== 0)
      return il;
  if (r.dyn_ltree[9 * 2] !== 0 || r.dyn_ltree[10 * 2] !== 0 || r.dyn_ltree[13 * 2] !== 0)
    return nl;
  for (t = 32; t < ga; t++)
    if (r.dyn_ltree[t * 2] !== 0)
      return nl;
  return il;
};
let ll = !1;
const gb = (r) => {
  ll || (hb(), ll = !0), r.l_desc = new Qs(r.dyn_ltree, Hu), r.d_desc = new Qs(r.dyn_dtree, qu), r.bl_desc = new Qs(r.bl_tree, Zu), r.bi_buf = 0, r.bi_valid = 0, Xu(r);
}, Ju = (r, e, t, i) => {
  He(r, (ib << 1) + (i ? 1 : 0), 3), Yu(r), Wn(r, t), Wn(r, ~t), t && r.pending_buf.set(r.window.subarray(e, e + t), r.pending), r.pending += t;
}, pb = (r) => {
  He(r, zu << 1, 3), vt(r, Sc, jt), ub(r);
}, mb = (r, e, t, i) => {
  let n, a, s = 0;
  r.level > 0 ? (r.strm.data_type === rb && (r.strm.data_type = xb(r)), Io(r, r.l_desc), Io(r, r.d_desc), s = fb(r), n = r.opt_len + 3 + 7 >>> 3, a = r.static_len + 3 + 7 >>> 3, a <= n && (n = a)) : n = a = t + 5, t + 4 <= n && e !== -1 ? Ju(r, e, t, i) : r.strategy === tb || a === n ? (He(r, (zu << 1) + (i ? 1 : 0), 3), sl(r, jt, Sn)) : (He(r, (nb << 1) + (i ? 1 : 0), 3), bb(r, r.l_desc.max_code + 1, r.d_desc.max_code + 1, s + 1), sl(r, r.dyn_ltree, r.dyn_dtree)), Xu(r), i && Yu(r);
}, wb = (r, e, t) => (r.pending_buf[r.sym_buf + r.sym_next++] = e, r.pending_buf[r.sym_buf + r.sym_next++] = e >> 8, r.pending_buf[r.sym_buf + r.sym_next++] = t, e === 0 ? r.dyn_ltree[t * 2]++ : (r.matches++, e--, r.dyn_ltree[($n[t] + ga + 1) * 2]++, r.dyn_dtree[Ku(e) * 2]++), r.sym_next === r.sym_end);
var yb = gb, vb = Ju, _b = mb, kb = wb, Sb = pb, Ab = {
  _tr_init: yb,
  _tr_stored_block: vb,
  _tr_flush_block: _b,
  _tr_tally: kb,
  _tr_align: Sb
};
const Cb = (r, e, t, i) => {
  let n = r & 65535 | 0, a = r >>> 16 & 65535 | 0, s = 0;
  for (; t !== 0; ) {
    s = t > 2e3 ? 2e3 : t, t -= s;
    do
      n = n + e[i++] | 0, a = a + n | 0;
    while (--s);
    n %= 65521, a %= 65521;
  }
  return n | a << 16 | 0;
};
var Hn = Cb;
const Fb = () => {
  let r, e = [];
  for (var t = 0; t < 256; t++) {
    r = t;
    for (var i = 0; i < 8; i++)
      r = r & 1 ? 3988292384 ^ r >>> 1 : r >>> 1;
    e[t] = r;
  }
  return e;
}, Ob = new Uint32Array(Fb()), Pb = (r, e, t, i) => {
  const n = Ob, a = i + t;
  r ^= -1;
  for (let s = i; s < a; s++)
    r = r >>> 8 ^ n[(r ^ e[s]) & 255];
  return r ^ -1;
};
var Ce = Pb, qr = {
  2: "need dictionary",
  /* Z_NEED_DICT       2  */
  1: "stream end",
  /* Z_STREAM_END      1  */
  0: "",
  /* Z_OK              0  */
  "-1": "file error",
  /* Z_ERRNO         (-1) */
  "-2": "stream error",
  /* Z_STREAM_ERROR  (-2) */
  "-3": "data error",
  /* Z_DATA_ERROR    (-3) */
  "-4": "insufficient memory",
  /* Z_MEM_ERROR     (-4) */
  "-5": "buffer error",
  /* Z_BUF_ERROR     (-5) */
  "-6": "incompatible version"
  /* Z_VERSION_ERROR (-6) */
}, pa = {
  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH: 0,
  Z_PARTIAL_FLUSH: 1,
  Z_SYNC_FLUSH: 2,
  Z_FULL_FLUSH: 3,
  Z_FINISH: 4,
  Z_BLOCK: 5,
  Z_TREES: 6,
  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK: 0,
  Z_STREAM_END: 1,
  Z_NEED_DICT: 2,
  Z_ERRNO: -1,
  Z_STREAM_ERROR: -2,
  Z_DATA_ERROR: -3,
  Z_MEM_ERROR: -4,
  Z_BUF_ERROR: -5,
  //Z_VERSION_ERROR: -6,
  /* compression levels */
  Z_NO_COMPRESSION: 0,
  Z_BEST_SPEED: 1,
  Z_BEST_COMPRESSION: 9,
  Z_DEFAULT_COMPRESSION: -1,
  Z_FILTERED: 1,
  Z_HUFFMAN_ONLY: 2,
  Z_RLE: 3,
  Z_FIXED: 4,
  Z_DEFAULT_STRATEGY: 0,
  /* Possible values of the data_type field (though see inflate()) */
  Z_BINARY: 0,
  Z_TEXT: 1,
  //Z_ASCII:                1, // = Z_TEXT (deprecated)
  Z_UNKNOWN: 2,
  /* The deflate compression method */
  Z_DEFLATED: 8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};
const { _tr_init: Db, _tr_stored_block: zo, _tr_flush_block: Eb, _tr_tally: pr, _tr_align: Tb } = Ab, {
  Z_NO_FLUSH: mr,
  Z_PARTIAL_FLUSH: Rb,
  Z_FULL_FLUSH: Bb,
  Z_FINISH: rt,
  Z_BLOCK: ul,
  Z_OK: Ee,
  Z_STREAM_END: dl,
  Z_STREAM_ERROR: Ct,
  Z_DATA_ERROR: Nb,
  Z_BUF_ERROR: to,
  Z_DEFAULT_COMPRESSION: jb,
  Z_FILTERED: Ib,
  Z_HUFFMAN_ONLY: Ba,
  Z_RLE: zb,
  Z_FIXED: Lb,
  Z_DEFAULT_STRATEGY: Mb,
  Z_UNKNOWN: Ub,
  Z_DEFLATED: Ns
} = pa, $b = 9, Wb = 15, Hb = 8, qb = 29, Zb = 256, Lo = Zb + 1 + qb, Kb = 30, Vb = 19, Gb = 2 * Lo + 1, Xb = 15, X = 3, ur = 258, Ft = ur + X + 1, Yb = 32, Bi = 42, Cc = 57, Mo = 69, Uo = 73, $o = 91, Wo = 103, Br = 113, hn = 666, Ue = 1, Ki = 2, Zr = 3, Vi = 4, Jb = 3, Nr = (r, e) => (r.msg = qr[e], e), hl = (r) => r * 2 - (r > 4 ? 9 : 0), or = (r) => {
  let e = r.length;
  for (; --e >= 0; )
    r[e] = 0;
}, Qb = (r) => {
  let e, t, i, n = r.w_size;
  e = r.hash_size, i = e;
  do
    t = r.head[--i], r.head[i] = t >= n ? t - n : 0;
  while (--e);
  e = n, i = e;
  do
    t = r.prev[--i], r.prev[i] = t >= n ? t - n : 0;
  while (--e);
};
let ex = (r, e, t) => (e << r.hash_shift ^ t) & r.hash_mask, wr = ex;
const Ke = (r) => {
  const e = r.state;
  let t = e.pending;
  t > r.avail_out && (t = r.avail_out), t !== 0 && (r.output.set(e.pending_buf.subarray(e.pending_out, e.pending_out + t), r.next_out), r.next_out += t, e.pending_out += t, r.total_out += t, r.avail_out -= t, e.pending -= t, e.pending === 0 && (e.pending_out = 0));
}, Ye = (r, e) => {
  Eb(r, r.block_start >= 0 ? r.block_start : -1, r.strstart - r.block_start, e), r.block_start = r.strstart, Ke(r.strm);
}, ae = (r, e) => {
  r.pending_buf[r.pending++] = e;
}, nn = (r, e) => {
  r.pending_buf[r.pending++] = e >>> 8 & 255, r.pending_buf[r.pending++] = e & 255;
}, Ho = (r, e, t, i) => {
  let n = r.avail_in;
  return n > i && (n = i), n === 0 ? 0 : (r.avail_in -= n, e.set(r.input.subarray(r.next_in, r.next_in + n), t), r.state.wrap === 1 ? r.adler = Hn(r.adler, e, n, t) : r.state.wrap === 2 && (r.adler = Ce(r.adler, e, n, t)), r.next_in += n, r.total_in += n, n);
}, Qu = (r, e) => {
  let t = r.max_chain_length, i = r.strstart, n, a, s = r.prev_length, o = r.nice_match;
  const l = r.strstart > r.w_size - Ft ? r.strstart - (r.w_size - Ft) : 0, c = r.window, u = r.w_mask, f = r.prev, h = r.strstart + ur;
  let d = c[i + s - 1], b = c[i + s];
  r.prev_length >= r.good_match && (t >>= 2), o > r.lookahead && (o = r.lookahead);
  do
    if (n = e, !(c[n + s] !== b || c[n + s - 1] !== d || c[n] !== c[i] || c[++n] !== c[i + 1])) {
      i += 2, n++;
      do
        ;
      while (c[++i] === c[++n] && c[++i] === c[++n] && c[++i] === c[++n] && c[++i] === c[++n] && c[++i] === c[++n] && c[++i] === c[++n] && c[++i] === c[++n] && c[++i] === c[++n] && i < h);
      if (a = ur - (h - i), i = h - ur, a > s) {
        if (r.match_start = e, s = a, a >= o)
          break;
        d = c[i + s - 1], b = c[i + s];
      }
    }
  while ((e = f[e & u]) > l && --t !== 0);
  return s <= r.lookahead ? s : r.lookahead;
}, Ni = (r) => {
  const e = r.w_size;
  let t, i, n;
  do {
    if (i = r.window_size - r.lookahead - r.strstart, r.strstart >= e + (e - Ft) && (r.window.set(r.window.subarray(e, e + e - i), 0), r.match_start -= e, r.strstart -= e, r.block_start -= e, r.insert > r.strstart && (r.insert = r.strstart), Qb(r), i += e), r.strm.avail_in === 0)
      break;
    if (t = Ho(r.strm, r.window, r.strstart + r.lookahead, i), r.lookahead += t, r.lookahead + r.insert >= X)
      for (n = r.strstart - r.insert, r.ins_h = r.window[n], r.ins_h = wr(r, r.ins_h, r.window[n + 1]); r.insert && (r.ins_h = wr(r, r.ins_h, r.window[n + X - 1]), r.prev[n & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = n, n++, r.insert--, !(r.lookahead + r.insert < X)); )
        ;
  } while (r.lookahead < Ft && r.strm.avail_in !== 0);
}, ed = (r, e) => {
  let t = r.pending_buf_size - 5 > r.w_size ? r.w_size : r.pending_buf_size - 5, i, n, a, s = 0, o = r.strm.avail_in;
  do {
    if (i = 65535, a = r.bi_valid + 42 >> 3, r.strm.avail_out < a || (a = r.strm.avail_out - a, n = r.strstart - r.block_start, i > n + r.strm.avail_in && (i = n + r.strm.avail_in), i > a && (i = a), i < t && (i === 0 && e !== rt || e === mr || i !== n + r.strm.avail_in)))
      break;
    s = e === rt && i === n + r.strm.avail_in ? 1 : 0, zo(r, 0, 0, s), r.pending_buf[r.pending - 4] = i, r.pending_buf[r.pending - 3] = i >> 8, r.pending_buf[r.pending - 2] = ~i, r.pending_buf[r.pending - 1] = ~i >> 8, Ke(r.strm), n && (n > i && (n = i), r.strm.output.set(r.window.subarray(r.block_start, r.block_start + n), r.strm.next_out), r.strm.next_out += n, r.strm.avail_out -= n, r.strm.total_out += n, r.block_start += n, i -= n), i && (Ho(r.strm, r.strm.output, r.strm.next_out, i), r.strm.next_out += i, r.strm.avail_out -= i, r.strm.total_out += i);
  } while (s === 0);
  return o -= r.strm.avail_in, o && (o >= r.w_size ? (r.matches = 2, r.window.set(r.strm.input.subarray(r.strm.next_in - r.w_size, r.strm.next_in), 0), r.strstart = r.w_size, r.insert = r.strstart) : (r.window_size - r.strstart <= o && (r.strstart -= r.w_size, r.window.set(r.window.subarray(r.w_size, r.w_size + r.strstart), 0), r.matches < 2 && r.matches++, r.insert > r.strstart && (r.insert = r.strstart)), r.window.set(r.strm.input.subarray(r.strm.next_in - o, r.strm.next_in), r.strstart), r.strstart += o, r.insert += o > r.w_size - r.insert ? r.w_size - r.insert : o), r.block_start = r.strstart), r.high_water < r.strstart && (r.high_water = r.strstart), s ? Vi : e !== mr && e !== rt && r.strm.avail_in === 0 && r.strstart === r.block_start ? Ki : (a = r.window_size - r.strstart, r.strm.avail_in > a && r.block_start >= r.w_size && (r.block_start -= r.w_size, r.strstart -= r.w_size, r.window.set(r.window.subarray(r.w_size, r.w_size + r.strstart), 0), r.matches < 2 && r.matches++, a += r.w_size, r.insert > r.strstart && (r.insert = r.strstart)), a > r.strm.avail_in && (a = r.strm.avail_in), a && (Ho(r.strm, r.window, r.strstart, a), r.strstart += a, r.insert += a > r.w_size - r.insert ? r.w_size - r.insert : a), r.high_water < r.strstart && (r.high_water = r.strstart), a = r.bi_valid + 42 >> 3, a = r.pending_buf_size - a > 65535 ? 65535 : r.pending_buf_size - a, t = a > r.w_size ? r.w_size : a, n = r.strstart - r.block_start, (n >= t || (n || e === rt) && e !== mr && r.strm.avail_in === 0 && n <= a) && (i = n > a ? a : n, s = e === rt && r.strm.avail_in === 0 && i === n ? 1 : 0, zo(r, r.block_start, i, s), r.block_start += i, Ke(r.strm)), s ? Zr : Ue);
}, ro = (r, e) => {
  let t, i;
  for (; ; ) {
    if (r.lookahead < Ft) {
      if (Ni(r), r.lookahead < Ft && e === mr)
        return Ue;
      if (r.lookahead === 0)
        break;
    }
    if (t = 0, r.lookahead >= X && (r.ins_h = wr(r, r.ins_h, r.window[r.strstart + X - 1]), t = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), t !== 0 && r.strstart - t <= r.w_size - Ft && (r.match_length = Qu(r, t)), r.match_length >= X)
      if (i = pr(r, r.strstart - r.match_start, r.match_length - X), r.lookahead -= r.match_length, r.match_length <= r.max_lazy_match && r.lookahead >= X) {
        r.match_length--;
        do
          r.strstart++, r.ins_h = wr(r, r.ins_h, r.window[r.strstart + X - 1]), t = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart;
        while (--r.match_length !== 0);
        r.strstart++;
      } else
        r.strstart += r.match_length, r.match_length = 0, r.ins_h = r.window[r.strstart], r.ins_h = wr(r, r.ins_h, r.window[r.strstart + 1]);
    else
      i = pr(r, 0, r.window[r.strstart]), r.lookahead--, r.strstart++;
    if (i && (Ye(r, !1), r.strm.avail_out === 0))
      return Ue;
  }
  return r.insert = r.strstart < X - 1 ? r.strstart : X - 1, e === rt ? (Ye(r, !0), r.strm.avail_out === 0 ? Zr : Vi) : r.sym_next && (Ye(r, !1), r.strm.avail_out === 0) ? Ue : Ki;
}, fi = (r, e) => {
  let t, i, n;
  for (; ; ) {
    if (r.lookahead < Ft) {
      if (Ni(r), r.lookahead < Ft && e === mr)
        return Ue;
      if (r.lookahead === 0)
        break;
    }
    if (t = 0, r.lookahead >= X && (r.ins_h = wr(r, r.ins_h, r.window[r.strstart + X - 1]), t = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), r.prev_length = r.match_length, r.prev_match = r.match_start, r.match_length = X - 1, t !== 0 && r.prev_length < r.max_lazy_match && r.strstart - t <= r.w_size - Ft && (r.match_length = Qu(r, t), r.match_length <= 5 && (r.strategy === Ib || r.match_length === X && r.strstart - r.match_start > 4096) && (r.match_length = X - 1)), r.prev_length >= X && r.match_length <= r.prev_length) {
      n = r.strstart + r.lookahead - X, i = pr(r, r.strstart - 1 - r.prev_match, r.prev_length - X), r.lookahead -= r.prev_length - 1, r.prev_length -= 2;
      do
        ++r.strstart <= n && (r.ins_h = wr(r, r.ins_h, r.window[r.strstart + X - 1]), t = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart);
      while (--r.prev_length !== 0);
      if (r.match_available = 0, r.match_length = X - 1, r.strstart++, i && (Ye(r, !1), r.strm.avail_out === 0))
        return Ue;
    } else if (r.match_available) {
      if (i = pr(r, 0, r.window[r.strstart - 1]), i && Ye(r, !1), r.strstart++, r.lookahead--, r.strm.avail_out === 0)
        return Ue;
    } else
      r.match_available = 1, r.strstart++, r.lookahead--;
  }
  return r.match_available && (i = pr(r, 0, r.window[r.strstart - 1]), r.match_available = 0), r.insert = r.strstart < X - 1 ? r.strstart : X - 1, e === rt ? (Ye(r, !0), r.strm.avail_out === 0 ? Zr : Vi) : r.sym_next && (Ye(r, !1), r.strm.avail_out === 0) ? Ue : Ki;
}, tx = (r, e) => {
  let t, i, n, a;
  const s = r.window;
  for (; ; ) {
    if (r.lookahead <= ur) {
      if (Ni(r), r.lookahead <= ur && e === mr)
        return Ue;
      if (r.lookahead === 0)
        break;
    }
    if (r.match_length = 0, r.lookahead >= X && r.strstart > 0 && (n = r.strstart - 1, i = s[n], i === s[++n] && i === s[++n] && i === s[++n])) {
      a = r.strstart + ur;
      do
        ;
      while (i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && n < a);
      r.match_length = ur - (a - n), r.match_length > r.lookahead && (r.match_length = r.lookahead);
    }
    if (r.match_length >= X ? (t = pr(r, 1, r.match_length - X), r.lookahead -= r.match_length, r.strstart += r.match_length, r.match_length = 0) : (t = pr(r, 0, r.window[r.strstart]), r.lookahead--, r.strstart++), t && (Ye(r, !1), r.strm.avail_out === 0))
      return Ue;
  }
  return r.insert = 0, e === rt ? (Ye(r, !0), r.strm.avail_out === 0 ? Zr : Vi) : r.sym_next && (Ye(r, !1), r.strm.avail_out === 0) ? Ue : Ki;
}, rx = (r, e) => {
  let t;
  for (; ; ) {
    if (r.lookahead === 0 && (Ni(r), r.lookahead === 0)) {
      if (e === mr)
        return Ue;
      break;
    }
    if (r.match_length = 0, t = pr(r, 0, r.window[r.strstart]), r.lookahead--, r.strstart++, t && (Ye(r, !1), r.strm.avail_out === 0))
      return Ue;
  }
  return r.insert = 0, e === rt ? (Ye(r, !0), r.strm.avail_out === 0 ? Zr : Vi) : r.sym_next && (Ye(r, !1), r.strm.avail_out === 0) ? Ue : Ki;
};
function gt(r, e, t, i, n) {
  this.good_length = r, this.max_lazy = e, this.nice_length = t, this.max_chain = i, this.func = n;
}
const fn = [
  /*      good lazy nice chain */
  new gt(0, 0, 0, 0, ed),
  /* 0 store only */
  new gt(4, 4, 8, 4, ro),
  /* 1 max speed, no lazy matches */
  new gt(4, 5, 16, 8, ro),
  /* 2 */
  new gt(4, 6, 32, 32, ro),
  /* 3 */
  new gt(4, 4, 16, 16, fi),
  /* 4 lazy matches */
  new gt(8, 16, 32, 32, fi),
  /* 5 */
  new gt(8, 16, 128, 128, fi),
  /* 6 */
  new gt(8, 32, 128, 256, fi),
  /* 7 */
  new gt(32, 128, 258, 1024, fi),
  /* 8 */
  new gt(32, 258, 258, 4096, fi)
  /* 9 max compression */
], ix = (r) => {
  r.window_size = 2 * r.w_size, or(r.head), r.max_lazy_match = fn[r.level].max_lazy, r.good_match = fn[r.level].good_length, r.nice_match = fn[r.level].nice_length, r.max_chain_length = fn[r.level].max_chain, r.strstart = 0, r.block_start = 0, r.lookahead = 0, r.insert = 0, r.match_length = r.prev_length = X - 1, r.match_available = 0, r.ins_h = 0;
};
function nx() {
  this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = Ns, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new Uint16Array(Gb * 2), this.dyn_dtree = new Uint16Array((2 * Kb + 1) * 2), this.bl_tree = new Uint16Array((2 * Vb + 1) * 2), or(this.dyn_ltree), or(this.dyn_dtree), or(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new Uint16Array(Xb + 1), this.heap = new Uint16Array(2 * Lo + 1), or(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new Uint16Array(2 * Lo + 1), or(this.depth), this.sym_buf = 0, this.lit_bufsize = 0, this.sym_next = 0, this.sym_end = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
}
const ma = (r) => {
  if (!r)
    return 1;
  const e = r.state;
  return !e || e.strm !== r || e.status !== Bi && //#ifdef GZIP
  e.status !== Cc && //#endif
  e.status !== Mo && e.status !== Uo && e.status !== $o && e.status !== Wo && e.status !== Br && e.status !== hn ? 1 : 0;
}, td = (r) => {
  if (ma(r))
    return Nr(r, Ct);
  r.total_in = r.total_out = 0, r.data_type = Ub;
  const e = r.state;
  return e.pending = 0, e.pending_out = 0, e.wrap < 0 && (e.wrap = -e.wrap), e.status = //#ifdef GZIP
  e.wrap === 2 ? Cc : (
    //#endif
    e.wrap ? Bi : Br
  ), r.adler = e.wrap === 2 ? 0 : 1, e.last_flush = -2, Db(e), Ee;
}, rd = (r) => {
  const e = td(r);
  return e === Ee && ix(r.state), e;
}, ax = (r, e) => ma(r) || r.state.wrap !== 2 ? Ct : (r.state.gzhead = e, Ee), id = (r, e, t, i, n, a) => {
  if (!r)
    return Ct;
  let s = 1;
  if (e === jb && (e = 6), i < 0 ? (s = 0, i = -i) : i > 15 && (s = 2, i -= 16), n < 1 || n > $b || t !== Ns || i < 8 || i > 15 || e < 0 || e > 9 || a < 0 || a > Lb || i === 8 && s !== 1)
    return Nr(r, Ct);
  i === 8 && (i = 9);
  const o = new nx();
  return r.state = o, o.strm = r, o.status = Bi, o.wrap = s, o.gzhead = null, o.w_bits = i, o.w_size = 1 << o.w_bits, o.w_mask = o.w_size - 1, o.hash_bits = n + 7, o.hash_size = 1 << o.hash_bits, o.hash_mask = o.hash_size - 1, o.hash_shift = ~~((o.hash_bits + X - 1) / X), o.window = new Uint8Array(o.w_size * 2), o.head = new Uint16Array(o.hash_size), o.prev = new Uint16Array(o.w_size), o.lit_bufsize = 1 << n + 6, o.pending_buf_size = o.lit_bufsize * 4, o.pending_buf = new Uint8Array(o.pending_buf_size), o.sym_buf = o.lit_bufsize, o.sym_end = (o.lit_bufsize - 1) * 3, o.level = e, o.strategy = a, o.method = t, rd(r);
}, sx = (r, e) => id(r, e, Ns, Wb, Hb, Mb), ox = (r, e) => {
  if (ma(r) || e > ul || e < 0)
    return r ? Nr(r, Ct) : Ct;
  const t = r.state;
  if (!r.output || r.avail_in !== 0 && !r.input || t.status === hn && e !== rt)
    return Nr(r, r.avail_out === 0 ? to : Ct);
  const i = t.last_flush;
  if (t.last_flush = e, t.pending !== 0) {
    if (Ke(r), r.avail_out === 0)
      return t.last_flush = -1, Ee;
  } else if (r.avail_in === 0 && hl(e) <= hl(i) && e !== rt)
    return Nr(r, to);
  if (t.status === hn && r.avail_in !== 0)
    return Nr(r, to);
  if (t.status === Bi && t.wrap === 0 && (t.status = Br), t.status === Bi) {
    let n = Ns + (t.w_bits - 8 << 4) << 8, a = -1;
    if (t.strategy >= Ba || t.level < 2 ? a = 0 : t.level < 6 ? a = 1 : t.level === 6 ? a = 2 : a = 3, n |= a << 6, t.strstart !== 0 && (n |= Yb), n += 31 - n % 31, nn(t, n), t.strstart !== 0 && (nn(t, r.adler >>> 16), nn(t, r.adler & 65535)), r.adler = 1, t.status = Br, Ke(r), t.pending !== 0)
      return t.last_flush = -1, Ee;
  }
  if (t.status === Cc) {
    if (r.adler = 0, ae(t, 31), ae(t, 139), ae(t, 8), t.gzhead)
      ae(
        t,
        (t.gzhead.text ? 1 : 0) + (t.gzhead.hcrc ? 2 : 0) + (t.gzhead.extra ? 4 : 0) + (t.gzhead.name ? 8 : 0) + (t.gzhead.comment ? 16 : 0)
      ), ae(t, t.gzhead.time & 255), ae(t, t.gzhead.time >> 8 & 255), ae(t, t.gzhead.time >> 16 & 255), ae(t, t.gzhead.time >> 24 & 255), ae(t, t.level === 9 ? 2 : t.strategy >= Ba || t.level < 2 ? 4 : 0), ae(t, t.gzhead.os & 255), t.gzhead.extra && t.gzhead.extra.length && (ae(t, t.gzhead.extra.length & 255), ae(t, t.gzhead.extra.length >> 8 & 255)), t.gzhead.hcrc && (r.adler = Ce(r.adler, t.pending_buf, t.pending, 0)), t.gzindex = 0, t.status = Mo;
    else if (ae(t, 0), ae(t, 0), ae(t, 0), ae(t, 0), ae(t, 0), ae(t, t.level === 9 ? 2 : t.strategy >= Ba || t.level < 2 ? 4 : 0), ae(t, Jb), t.status = Br, Ke(r), t.pending !== 0)
      return t.last_flush = -1, Ee;
  }
  if (t.status === Mo) {
    if (t.gzhead.extra) {
      let n = t.pending, a = (t.gzhead.extra.length & 65535) - t.gzindex;
      for (; t.pending + a > t.pending_buf_size; ) {
        let o = t.pending_buf_size - t.pending;
        if (t.pending_buf.set(t.gzhead.extra.subarray(t.gzindex, t.gzindex + o), t.pending), t.pending = t.pending_buf_size, t.gzhead.hcrc && t.pending > n && (r.adler = Ce(r.adler, t.pending_buf, t.pending - n, n)), t.gzindex += o, Ke(r), t.pending !== 0)
          return t.last_flush = -1, Ee;
        n = 0, a -= o;
      }
      let s = new Uint8Array(t.gzhead.extra);
      t.pending_buf.set(s.subarray(t.gzindex, t.gzindex + a), t.pending), t.pending += a, t.gzhead.hcrc && t.pending > n && (r.adler = Ce(r.adler, t.pending_buf, t.pending - n, n)), t.gzindex = 0;
    }
    t.status = Uo;
  }
  if (t.status === Uo) {
    if (t.gzhead.name) {
      let n = t.pending, a;
      do {
        if (t.pending === t.pending_buf_size) {
          if (t.gzhead.hcrc && t.pending > n && (r.adler = Ce(r.adler, t.pending_buf, t.pending - n, n)), Ke(r), t.pending !== 0)
            return t.last_flush = -1, Ee;
          n = 0;
        }
        t.gzindex < t.gzhead.name.length ? a = t.gzhead.name.charCodeAt(t.gzindex++) & 255 : a = 0, ae(t, a);
      } while (a !== 0);
      t.gzhead.hcrc && t.pending > n && (r.adler = Ce(r.adler, t.pending_buf, t.pending - n, n)), t.gzindex = 0;
    }
    t.status = $o;
  }
  if (t.status === $o) {
    if (t.gzhead.comment) {
      let n = t.pending, a;
      do {
        if (t.pending === t.pending_buf_size) {
          if (t.gzhead.hcrc && t.pending > n && (r.adler = Ce(r.adler, t.pending_buf, t.pending - n, n)), Ke(r), t.pending !== 0)
            return t.last_flush = -1, Ee;
          n = 0;
        }
        t.gzindex < t.gzhead.comment.length ? a = t.gzhead.comment.charCodeAt(t.gzindex++) & 255 : a = 0, ae(t, a);
      } while (a !== 0);
      t.gzhead.hcrc && t.pending > n && (r.adler = Ce(r.adler, t.pending_buf, t.pending - n, n));
    }
    t.status = Wo;
  }
  if (t.status === Wo) {
    if (t.gzhead.hcrc) {
      if (t.pending + 2 > t.pending_buf_size && (Ke(r), t.pending !== 0))
        return t.last_flush = -1, Ee;
      ae(t, r.adler & 255), ae(t, r.adler >> 8 & 255), r.adler = 0;
    }
    if (t.status = Br, Ke(r), t.pending !== 0)
      return t.last_flush = -1, Ee;
  }
  if (r.avail_in !== 0 || t.lookahead !== 0 || e !== mr && t.status !== hn) {
    let n = t.level === 0 ? ed(t, e) : t.strategy === Ba ? rx(t, e) : t.strategy === zb ? tx(t, e) : fn[t.level].func(t, e);
    if ((n === Zr || n === Vi) && (t.status = hn), n === Ue || n === Zr)
      return r.avail_out === 0 && (t.last_flush = -1), Ee;
    if (n === Ki && (e === Rb ? Tb(t) : e !== ul && (zo(t, 0, 0, !1), e === Bb && (or(t.head), t.lookahead === 0 && (t.strstart = 0, t.block_start = 0, t.insert = 0))), Ke(r), r.avail_out === 0))
      return t.last_flush = -1, Ee;
  }
  return e !== rt ? Ee : t.wrap <= 0 ? dl : (t.wrap === 2 ? (ae(t, r.adler & 255), ae(t, r.adler >> 8 & 255), ae(t, r.adler >> 16 & 255), ae(t, r.adler >> 24 & 255), ae(t, r.total_in & 255), ae(t, r.total_in >> 8 & 255), ae(t, r.total_in >> 16 & 255), ae(t, r.total_in >> 24 & 255)) : (nn(t, r.adler >>> 16), nn(t, r.adler & 65535)), Ke(r), t.wrap > 0 && (t.wrap = -t.wrap), t.pending !== 0 ? Ee : dl);
}, cx = (r) => {
  if (ma(r))
    return Ct;
  const e = r.state.status;
  return r.state = null, e === Br ? Nr(r, Nb) : Ee;
}, lx = (r, e) => {
  let t = e.length;
  if (ma(r))
    return Ct;
  const i = r.state, n = i.wrap;
  if (n === 2 || n === 1 && i.status !== Bi || i.lookahead)
    return Ct;
  if (n === 1 && (r.adler = Hn(r.adler, e, t, 0)), i.wrap = 0, t >= i.w_size) {
    n === 0 && (or(i.head), i.strstart = 0, i.block_start = 0, i.insert = 0);
    let l = new Uint8Array(i.w_size);
    l.set(e.subarray(t - i.w_size, t), 0), e = l, t = i.w_size;
  }
  const a = r.avail_in, s = r.next_in, o = r.input;
  for (r.avail_in = t, r.next_in = 0, r.input = e, Ni(i); i.lookahead >= X; ) {
    let l = i.strstart, c = i.lookahead - (X - 1);
    do
      i.ins_h = wr(i, i.ins_h, i.window[l + X - 1]), i.prev[l & i.w_mask] = i.head[i.ins_h], i.head[i.ins_h] = l, l++;
    while (--c);
    i.strstart = l, i.lookahead = X - 1, Ni(i);
  }
  return i.strstart += i.lookahead, i.block_start = i.strstart, i.insert = i.lookahead, i.lookahead = 0, i.match_length = i.prev_length = X - 1, i.match_available = 0, r.next_in = s, r.input = o, r.avail_in = a, i.wrap = n, Ee;
};
var ux = sx, dx = id, hx = rd, fx = td, bx = ax, xx = ox, gx = cx, px = lx, mx = "pako deflate (from Nodeca project)", An = {
  deflateInit: ux,
  deflateInit2: dx,
  deflateReset: hx,
  deflateResetKeep: fx,
  deflateSetHeader: bx,
  deflate: xx,
  deflateEnd: gx,
  deflateSetDictionary: px,
  deflateInfo: mx
};
const wx = (r, e) => Object.prototype.hasOwnProperty.call(r, e);
var yx = function(r) {
  const e = Array.prototype.slice.call(arguments, 1);
  for (; e.length; ) {
    const t = e.shift();
    if (t) {
      if (typeof t != "object")
        throw new TypeError(t + "must be non-object");
      for (const i in t)
        wx(t, i) && (r[i] = t[i]);
    }
  }
  return r;
}, vx = (r) => {
  let e = 0;
  for (let i = 0, n = r.length; i < n; i++)
    e += r[i].length;
  const t = new Uint8Array(e);
  for (let i = 0, n = 0, a = r.length; i < a; i++) {
    let s = r[i];
    t.set(s, n), n += s.length;
  }
  return t;
}, js = {
  assign: yx,
  flattenChunks: vx
};
let nd = !0;
try {
  String.fromCharCode.apply(null, new Uint8Array(1));
} catch {
  nd = !1;
}
const qn = new Uint8Array(256);
for (let r = 0; r < 256; r++)
  qn[r] = r >= 252 ? 6 : r >= 248 ? 5 : r >= 240 ? 4 : r >= 224 ? 3 : r >= 192 ? 2 : 1;
qn[254] = qn[254] = 1;
var _x = (r) => {
  if (typeof TextEncoder == "function" && TextEncoder.prototype.encode)
    return new TextEncoder().encode(r);
  let e, t, i, n, a, s = r.length, o = 0;
  for (n = 0; n < s; n++)
    t = r.charCodeAt(n), (t & 64512) === 55296 && n + 1 < s && (i = r.charCodeAt(n + 1), (i & 64512) === 56320 && (t = 65536 + (t - 55296 << 10) + (i - 56320), n++)), o += t < 128 ? 1 : t < 2048 ? 2 : t < 65536 ? 3 : 4;
  for (e = new Uint8Array(o), a = 0, n = 0; a < o; n++)
    t = r.charCodeAt(n), (t & 64512) === 55296 && n + 1 < s && (i = r.charCodeAt(n + 1), (i & 64512) === 56320 && (t = 65536 + (t - 55296 << 10) + (i - 56320), n++)), t < 128 ? e[a++] = t : t < 2048 ? (e[a++] = 192 | t >>> 6, e[a++] = 128 | t & 63) : t < 65536 ? (e[a++] = 224 | t >>> 12, e[a++] = 128 | t >>> 6 & 63, e[a++] = 128 | t & 63) : (e[a++] = 240 | t >>> 18, e[a++] = 128 | t >>> 12 & 63, e[a++] = 128 | t >>> 6 & 63, e[a++] = 128 | t & 63);
  return e;
};
const kx = (r, e) => {
  if (e < 65534 && r.subarray && nd)
    return String.fromCharCode.apply(null, r.length === e ? r : r.subarray(0, e));
  let t = "";
  for (let i = 0; i < e; i++)
    t += String.fromCharCode(r[i]);
  return t;
};
var Sx = (r, e) => {
  const t = e || r.length;
  if (typeof TextDecoder == "function" && TextDecoder.prototype.decode)
    return new TextDecoder().decode(r.subarray(0, e));
  let i, n;
  const a = new Array(t * 2);
  for (n = 0, i = 0; i < t; ) {
    let s = r[i++];
    if (s < 128) {
      a[n++] = s;
      continue;
    }
    let o = qn[s];
    if (o > 4) {
      a[n++] = 65533, i += o - 1;
      continue;
    }
    for (s &= o === 2 ? 31 : o === 3 ? 15 : 7; o > 1 && i < t; )
      s = s << 6 | r[i++] & 63, o--;
    if (o > 1) {
      a[n++] = 65533;
      continue;
    }
    s < 65536 ? a[n++] = s : (s -= 65536, a[n++] = 55296 | s >> 10 & 1023, a[n++] = 56320 | s & 1023);
  }
  return kx(a, n);
}, Ax = (r, e) => {
  e = e || r.length, e > r.length && (e = r.length);
  let t = e - 1;
  for (; t >= 0 && (r[t] & 192) === 128; )
    t--;
  return t < 0 || t === 0 ? e : t + qn[r[t]] > e ? t : e;
}, Zn = {
  string2buf: _x,
  buf2string: Sx,
  utf8border: Ax
};
function Cx() {
  this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
}
var ad = Cx;
const sd = Object.prototype.toString, {
  Z_NO_FLUSH: Fx,
  Z_SYNC_FLUSH: Ox,
  Z_FULL_FLUSH: Px,
  Z_FINISH: Dx,
  Z_OK: ss,
  Z_STREAM_END: Ex,
  Z_DEFAULT_COMPRESSION: Tx,
  Z_DEFAULT_STRATEGY: Rx,
  Z_DEFLATED: Bx
} = pa;
function wa(r) {
  this.options = js.assign({
    level: Tx,
    method: Bx,
    chunkSize: 16384,
    windowBits: 15,
    memLevel: 8,
    strategy: Rx
  }, r || {});
  let e = this.options;
  e.raw && e.windowBits > 0 ? e.windowBits = -e.windowBits : e.gzip && e.windowBits > 0 && e.windowBits < 16 && (e.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new ad(), this.strm.avail_out = 0;
  let t = An.deflateInit2(
    this.strm,
    e.level,
    e.method,
    e.windowBits,
    e.memLevel,
    e.strategy
  );
  if (t !== ss)
    throw new Error(qr[t]);
  if (e.header && An.deflateSetHeader(this.strm, e.header), e.dictionary) {
    let i;
    if (typeof e.dictionary == "string" ? i = Zn.string2buf(e.dictionary) : sd.call(e.dictionary) === "[object ArrayBuffer]" ? i = new Uint8Array(e.dictionary) : i = e.dictionary, t = An.deflateSetDictionary(this.strm, i), t !== ss)
      throw new Error(qr[t]);
    this._dict_set = !0;
  }
}
wa.prototype.push = function(r, e) {
  const t = this.strm, i = this.options.chunkSize;
  let n, a;
  if (this.ended)
    return !1;
  for (e === ~~e ? a = e : a = e === !0 ? Dx : Fx, typeof r == "string" ? t.input = Zn.string2buf(r) : sd.call(r) === "[object ArrayBuffer]" ? t.input = new Uint8Array(r) : t.input = r, t.next_in = 0, t.avail_in = t.input.length; ; ) {
    if (t.avail_out === 0 && (t.output = new Uint8Array(i), t.next_out = 0, t.avail_out = i), (a === Ox || a === Px) && t.avail_out <= 6) {
      this.onData(t.output.subarray(0, t.next_out)), t.avail_out = 0;
      continue;
    }
    if (n = An.deflate(t, a), n === Ex)
      return t.next_out > 0 && this.onData(t.output.subarray(0, t.next_out)), n = An.deflateEnd(this.strm), this.onEnd(n), this.ended = !0, n === ss;
    if (t.avail_out === 0) {
      this.onData(t.output);
      continue;
    }
    if (a > 0 && t.next_out > 0) {
      this.onData(t.output.subarray(0, t.next_out)), t.avail_out = 0;
      continue;
    }
    if (t.avail_in === 0) break;
  }
  return !0;
};
wa.prototype.onData = function(r) {
  this.chunks.push(r);
};
wa.prototype.onEnd = function(r) {
  r === ss && (this.result = js.flattenChunks(this.chunks)), this.chunks = [], this.err = r, this.msg = this.strm.msg;
};
function Fc(r, e) {
  const t = new wa(e);
  if (t.push(r, !0), t.err)
    throw t.msg || qr[t.err];
  return t.result;
}
function Nx(r, e) {
  return e = e || {}, e.raw = !0, Fc(r, e);
}
function jx(r, e) {
  return e = e || {}, e.gzip = !0, Fc(r, e);
}
var Ix = wa, zx = Fc, Lx = Nx, Mx = jx, Ux = {
  Deflate: Ix,
  deflate: zx,
  deflateRaw: Lx,
  gzip: Mx
};
const Na = 16209, $x = 16191;
var Wx = function(e, t) {
  let i, n, a, s, o, l, c, u, f, h, d, b, p, m, g, S, y, v, A, k, _, C, P, D;
  const O = e.state;
  i = e.next_in, P = e.input, n = i + (e.avail_in - 5), a = e.next_out, D = e.output, s = a - (t - e.avail_out), o = a + (e.avail_out - 257), l = O.dmax, c = O.wsize, u = O.whave, f = O.wnext, h = O.window, d = O.hold, b = O.bits, p = O.lencode, m = O.distcode, g = (1 << O.lenbits) - 1, S = (1 << O.distbits) - 1;
  e:
    do {
      b < 15 && (d += P[i++] << b, b += 8, d += P[i++] << b, b += 8), y = p[d & g];
      t:
        for (; ; ) {
          if (v = y >>> 24, d >>>= v, b -= v, v = y >>> 16 & 255, v === 0)
            D[a++] = y & 65535;
          else if (v & 16) {
            A = y & 65535, v &= 15, v && (b < v && (d += P[i++] << b, b += 8), A += d & (1 << v) - 1, d >>>= v, b -= v), b < 15 && (d += P[i++] << b, b += 8, d += P[i++] << b, b += 8), y = m[d & S];
            r:
              for (; ; ) {
                if (v = y >>> 24, d >>>= v, b -= v, v = y >>> 16 & 255, v & 16) {
                  if (k = y & 65535, v &= 15, b < v && (d += P[i++] << b, b += 8, b < v && (d += P[i++] << b, b += 8)), k += d & (1 << v) - 1, k > l) {
                    e.msg = "invalid distance too far back", O.mode = Na;
                    break e;
                  }
                  if (d >>>= v, b -= v, v = a - s, k > v) {
                    if (v = k - v, v > u && O.sane) {
                      e.msg = "invalid distance too far back", O.mode = Na;
                      break e;
                    }
                    if (_ = 0, C = h, f === 0) {
                      if (_ += c - v, v < A) {
                        A -= v;
                        do
                          D[a++] = h[_++];
                        while (--v);
                        _ = a - k, C = D;
                      }
                    } else if (f < v) {
                      if (_ += c + f - v, v -= f, v < A) {
                        A -= v;
                        do
                          D[a++] = h[_++];
                        while (--v);
                        if (_ = 0, f < A) {
                          v = f, A -= v;
                          do
                            D[a++] = h[_++];
                          while (--v);
                          _ = a - k, C = D;
                        }
                      }
                    } else if (_ += f - v, v < A) {
                      A -= v;
                      do
                        D[a++] = h[_++];
                      while (--v);
                      _ = a - k, C = D;
                    }
                    for (; A > 2; )
                      D[a++] = C[_++], D[a++] = C[_++], D[a++] = C[_++], A -= 3;
                    A && (D[a++] = C[_++], A > 1 && (D[a++] = C[_++]));
                  } else {
                    _ = a - k;
                    do
                      D[a++] = D[_++], D[a++] = D[_++], D[a++] = D[_++], A -= 3;
                    while (A > 2);
                    A && (D[a++] = D[_++], A > 1 && (D[a++] = D[_++]));
                  }
                } else if (v & 64) {
                  e.msg = "invalid distance code", O.mode = Na;
                  break e;
                } else {
                  y = m[(y & 65535) + (d & (1 << v) - 1)];
                  continue r;
                }
                break;
              }
          } else if (v & 64)
            if (v & 32) {
              O.mode = $x;
              break e;
            } else {
              e.msg = "invalid literal/length code", O.mode = Na;
              break e;
            }
          else {
            y = p[(y & 65535) + (d & (1 << v) - 1)];
            continue t;
          }
          break;
        }
    } while (i < n && a < o);
  A = b >> 3, i -= A, b -= A << 3, d &= (1 << b) - 1, e.next_in = i, e.next_out = a, e.avail_in = i < n ? 5 + (n - i) : 5 - (i - n), e.avail_out = a < o ? 257 + (o - a) : 257 - (a - o), O.hold = d, O.bits = b;
};
const bi = 15, fl = 852, bl = 592, xl = 0, io = 1, gl = 2, Hx = new Uint16Array([
  /* Length codes 257..285 base */
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  13,
  15,
  17,
  19,
  23,
  27,
  31,
  35,
  43,
  51,
  59,
  67,
  83,
  99,
  115,
  131,
  163,
  195,
  227,
  258,
  0,
  0
]), qx = new Uint8Array([
  /* Length codes 257..285 extra */
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  17,
  17,
  17,
  17,
  18,
  18,
  18,
  18,
  19,
  19,
  19,
  19,
  20,
  20,
  20,
  20,
  21,
  21,
  21,
  21,
  16,
  72,
  78
]), Zx = new Uint16Array([
  /* Distance codes 0..29 base */
  1,
  2,
  3,
  4,
  5,
  7,
  9,
  13,
  17,
  25,
  33,
  49,
  65,
  97,
  129,
  193,
  257,
  385,
  513,
  769,
  1025,
  1537,
  2049,
  3073,
  4097,
  6145,
  8193,
  12289,
  16385,
  24577,
  0,
  0
]), Kx = new Uint8Array([
  /* Distance codes 0..29 extra */
  16,
  16,
  16,
  16,
  17,
  17,
  18,
  18,
  19,
  19,
  20,
  20,
  21,
  21,
  22,
  22,
  23,
  23,
  24,
  24,
  25,
  25,
  26,
  26,
  27,
  27,
  28,
  28,
  29,
  29,
  64,
  64
]), Vx = (r, e, t, i, n, a, s, o) => {
  const l = o.bits;
  let c = 0, u = 0, f = 0, h = 0, d = 0, b = 0, p = 0, m = 0, g = 0, S = 0, y, v, A, k, _, C = null, P;
  const D = new Uint16Array(bi + 1), O = new Uint16Array(bi + 1);
  let j = null, B, W, I;
  for (c = 0; c <= bi; c++)
    D[c] = 0;
  for (u = 0; u < i; u++)
    D[e[t + u]]++;
  for (d = l, h = bi; h >= 1 && D[h] === 0; h--)
    ;
  if (d > h && (d = h), h === 0)
    return n[a++] = 1 << 24 | 64 << 16 | 0, n[a++] = 1 << 24 | 64 << 16 | 0, o.bits = 1, 0;
  for (f = 1; f < h && D[f] === 0; f++)
    ;
  for (d < f && (d = f), m = 1, c = 1; c <= bi; c++)
    if (m <<= 1, m -= D[c], m < 0)
      return -1;
  if (m > 0 && (r === xl || h !== 1))
    return -1;
  for (O[1] = 0, c = 1; c < bi; c++)
    O[c + 1] = O[c] + D[c];
  for (u = 0; u < i; u++)
    e[t + u] !== 0 && (s[O[e[t + u]]++] = u);
  if (r === xl ? (C = j = s, P = 20) : r === io ? (C = Hx, j = qx, P = 257) : (C = Zx, j = Kx, P = 0), S = 0, u = 0, c = f, _ = a, b = d, p = 0, A = -1, g = 1 << d, k = g - 1, r === io && g > fl || r === gl && g > bl)
    return 1;
  for (; ; ) {
    B = c - p, s[u] + 1 < P ? (W = 0, I = s[u]) : s[u] >= P ? (W = j[s[u] - P], I = C[s[u] - P]) : (W = 96, I = 0), y = 1 << c - p, v = 1 << b, f = v;
    do
      v -= y, n[_ + (S >> p) + v] = B << 24 | W << 16 | I | 0;
    while (v !== 0);
    for (y = 1 << c - 1; S & y; )
      y >>= 1;
    if (y !== 0 ? (S &= y - 1, S += y) : S = 0, u++, --D[c] === 0) {
      if (c === h)
        break;
      c = e[t + s[u]];
    }
    if (c > d && (S & k) !== A) {
      for (p === 0 && (p = d), _ += f, b = c - p, m = 1 << b; b + p < h && (m -= D[b + p], !(m <= 0)); )
        b++, m <<= 1;
      if (g += 1 << b, r === io && g > fl || r === gl && g > bl)
        return 1;
      A = S & k, n[A] = d << 24 | b << 16 | _ - a | 0;
    }
  }
  return S !== 0 && (n[_ + S] = c - p << 24 | 64 << 16 | 0), o.bits = d, 0;
};
var Cn = Vx;
const Gx = 0, od = 1, cd = 2, {
  Z_FINISH: pl,
  Z_BLOCK: Xx,
  Z_TREES: ja,
  Z_OK: Kr,
  Z_STREAM_END: Yx,
  Z_NEED_DICT: Jx,
  Z_STREAM_ERROR: st,
  Z_DATA_ERROR: ld,
  Z_MEM_ERROR: ud,
  Z_BUF_ERROR: Qx,
  Z_DEFLATED: ml
} = pa, Is = 16180, wl = 16181, yl = 16182, vl = 16183, _l = 16184, kl = 16185, Sl = 16186, Al = 16187, Cl = 16188, Fl = 16189, os = 16190, Rt = 16191, no = 16192, Ol = 16193, ao = 16194, Pl = 16195, Dl = 16196, El = 16197, Tl = 16198, Ia = 16199, za = 16200, Rl = 16201, Bl = 16202, Nl = 16203, jl = 16204, Il = 16205, so = 16206, zl = 16207, Ll = 16208, fe = 16209, dd = 16210, hd = 16211, eg = 852, tg = 592, rg = 15, ig = rg, Ml = (r) => (r >>> 24 & 255) + (r >>> 8 & 65280) + ((r & 65280) << 8) + ((r & 255) << 24);
function ng() {
  this.strm = null, this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new Uint16Array(320), this.work = new Uint16Array(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
}
const li = (r) => {
  if (!r)
    return 1;
  const e = r.state;
  return !e || e.strm !== r || e.mode < Is || e.mode > hd ? 1 : 0;
}, fd = (r) => {
  if (li(r))
    return st;
  const e = r.state;
  return r.total_in = r.total_out = e.total = 0, r.msg = "", e.wrap && (r.adler = e.wrap & 1), e.mode = Is, e.last = 0, e.havedict = 0, e.flags = -1, e.dmax = 32768, e.head = null, e.hold = 0, e.bits = 0, e.lencode = e.lendyn = new Int32Array(eg), e.distcode = e.distdyn = new Int32Array(tg), e.sane = 1, e.back = -1, Kr;
}, bd = (r) => {
  if (li(r))
    return st;
  const e = r.state;
  return e.wsize = 0, e.whave = 0, e.wnext = 0, fd(r);
}, xd = (r, e) => {
  let t;
  if (li(r))
    return st;
  const i = r.state;
  return e < 0 ? (t = 0, e = -e) : (t = (e >> 4) + 5, e < 48 && (e &= 15)), e && (e < 8 || e > 15) ? st : (i.window !== null && i.wbits !== e && (i.window = null), i.wrap = t, i.wbits = e, bd(r));
}, gd = (r, e) => {
  if (!r)
    return st;
  const t = new ng();
  r.state = t, t.strm = r, t.window = null, t.mode = Is;
  const i = xd(r, e);
  return i !== Kr && (r.state = null), i;
}, ag = (r) => gd(r, ig);
let Ul = !0, oo, co;
const sg = (r) => {
  if (Ul) {
    oo = new Int32Array(512), co = new Int32Array(32);
    let e = 0;
    for (; e < 144; )
      r.lens[e++] = 8;
    for (; e < 256; )
      r.lens[e++] = 9;
    for (; e < 280; )
      r.lens[e++] = 7;
    for (; e < 288; )
      r.lens[e++] = 8;
    for (Cn(od, r.lens, 0, 288, oo, 0, r.work, { bits: 9 }), e = 0; e < 32; )
      r.lens[e++] = 5;
    Cn(cd, r.lens, 0, 32, co, 0, r.work, { bits: 5 }), Ul = !1;
  }
  r.lencode = oo, r.lenbits = 9, r.distcode = co, r.distbits = 5;
}, pd = (r, e, t, i) => {
  let n;
  const a = r.state;
  return a.window === null && (a.wsize = 1 << a.wbits, a.wnext = 0, a.whave = 0, a.window = new Uint8Array(a.wsize)), i >= a.wsize ? (a.window.set(e.subarray(t - a.wsize, t), 0), a.wnext = 0, a.whave = a.wsize) : (n = a.wsize - a.wnext, n > i && (n = i), a.window.set(e.subarray(t - i, t - i + n), a.wnext), i -= n, i ? (a.window.set(e.subarray(t - i, t), 0), a.wnext = i, a.whave = a.wsize) : (a.wnext += n, a.wnext === a.wsize && (a.wnext = 0), a.whave < a.wsize && (a.whave += n))), 0;
}, og = (r, e) => {
  let t, i, n, a, s, o, l, c, u, f, h, d, b, p, m = 0, g, S, y, v, A, k, _, C;
  const P = new Uint8Array(4);
  let D, O;
  const j = (
    /* permutation of code lengths */
    new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15])
  );
  if (li(r) || !r.output || !r.input && r.avail_in !== 0)
    return st;
  t = r.state, t.mode === Rt && (t.mode = no), s = r.next_out, n = r.output, l = r.avail_out, a = r.next_in, i = r.input, o = r.avail_in, c = t.hold, u = t.bits, f = o, h = l, C = Kr;
  e:
    for (; ; )
      switch (t.mode) {
        case Is:
          if (t.wrap === 0) {
            t.mode = no;
            break;
          }
          for (; u < 16; ) {
            if (o === 0)
              break e;
            o--, c += i[a++] << u, u += 8;
          }
          if (t.wrap & 2 && c === 35615) {
            t.wbits === 0 && (t.wbits = 15), t.check = 0, P[0] = c & 255, P[1] = c >>> 8 & 255, t.check = Ce(t.check, P, 2, 0), c = 0, u = 0, t.mode = wl;
            break;
          }
          if (t.head && (t.head.done = !1), !(t.wrap & 1) || /* check if zlib header allowed */
          (((c & 255) << 8) + (c >> 8)) % 31) {
            r.msg = "incorrect header check", t.mode = fe;
            break;
          }
          if ((c & 15) !== ml) {
            r.msg = "unknown compression method", t.mode = fe;
            break;
          }
          if (c >>>= 4, u -= 4, _ = (c & 15) + 8, t.wbits === 0 && (t.wbits = _), _ > 15 || _ > t.wbits) {
            r.msg = "invalid window size", t.mode = fe;
            break;
          }
          t.dmax = 1 << t.wbits, t.flags = 0, r.adler = t.check = 1, t.mode = c & 512 ? Fl : Rt, c = 0, u = 0;
          break;
        case wl:
          for (; u < 16; ) {
            if (o === 0)
              break e;
            o--, c += i[a++] << u, u += 8;
          }
          if (t.flags = c, (t.flags & 255) !== ml) {
            r.msg = "unknown compression method", t.mode = fe;
            break;
          }
          if (t.flags & 57344) {
            r.msg = "unknown header flags set", t.mode = fe;
            break;
          }
          t.head && (t.head.text = c >> 8 & 1), t.flags & 512 && t.wrap & 4 && (P[0] = c & 255, P[1] = c >>> 8 & 255, t.check = Ce(t.check, P, 2, 0)), c = 0, u = 0, t.mode = yl;
        case yl:
          for (; u < 32; ) {
            if (o === 0)
              break e;
            o--, c += i[a++] << u, u += 8;
          }
          t.head && (t.head.time = c), t.flags & 512 && t.wrap & 4 && (P[0] = c & 255, P[1] = c >>> 8 & 255, P[2] = c >>> 16 & 255, P[3] = c >>> 24 & 255, t.check = Ce(t.check, P, 4, 0)), c = 0, u = 0, t.mode = vl;
        case vl:
          for (; u < 16; ) {
            if (o === 0)
              break e;
            o--, c += i[a++] << u, u += 8;
          }
          t.head && (t.head.xflags = c & 255, t.head.os = c >> 8), t.flags & 512 && t.wrap & 4 && (P[0] = c & 255, P[1] = c >>> 8 & 255, t.check = Ce(t.check, P, 2, 0)), c = 0, u = 0, t.mode = _l;
        case _l:
          if (t.flags & 1024) {
            for (; u < 16; ) {
              if (o === 0)
                break e;
              o--, c += i[a++] << u, u += 8;
            }
            t.length = c, t.head && (t.head.extra_len = c), t.flags & 512 && t.wrap & 4 && (P[0] = c & 255, P[1] = c >>> 8 & 255, t.check = Ce(t.check, P, 2, 0)), c = 0, u = 0;
          } else t.head && (t.head.extra = null);
          t.mode = kl;
        case kl:
          if (t.flags & 1024 && (d = t.length, d > o && (d = o), d && (t.head && (_ = t.head.extra_len - t.length, t.head.extra || (t.head.extra = new Uint8Array(t.head.extra_len)), t.head.extra.set(
            i.subarray(
              a,
              // extra field is limited to 65536 bytes
              // - no need for additional size check
              a + d
            ),
            /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
            _
          )), t.flags & 512 && t.wrap & 4 && (t.check = Ce(t.check, i, d, a)), o -= d, a += d, t.length -= d), t.length))
            break e;
          t.length = 0, t.mode = Sl;
        case Sl:
          if (t.flags & 2048) {
            if (o === 0)
              break e;
            d = 0;
            do
              _ = i[a + d++], t.head && _ && t.length < 65536 && (t.head.name += String.fromCharCode(_));
            while (_ && d < o);
            if (t.flags & 512 && t.wrap & 4 && (t.check = Ce(t.check, i, d, a)), o -= d, a += d, _)
              break e;
          } else t.head && (t.head.name = null);
          t.length = 0, t.mode = Al;
        case Al:
          if (t.flags & 4096) {
            if (o === 0)
              break e;
            d = 0;
            do
              _ = i[a + d++], t.head && _ && t.length < 65536 && (t.head.comment += String.fromCharCode(_));
            while (_ && d < o);
            if (t.flags & 512 && t.wrap & 4 && (t.check = Ce(t.check, i, d, a)), o -= d, a += d, _)
              break e;
          } else t.head && (t.head.comment = null);
          t.mode = Cl;
        case Cl:
          if (t.flags & 512) {
            for (; u < 16; ) {
              if (o === 0)
                break e;
              o--, c += i[a++] << u, u += 8;
            }
            if (t.wrap & 4 && c !== (t.check & 65535)) {
              r.msg = "header crc mismatch", t.mode = fe;
              break;
            }
            c = 0, u = 0;
          }
          t.head && (t.head.hcrc = t.flags >> 9 & 1, t.head.done = !0), r.adler = t.check = 0, t.mode = Rt;
          break;
        case Fl:
          for (; u < 32; ) {
            if (o === 0)
              break e;
            o--, c += i[a++] << u, u += 8;
          }
          r.adler = t.check = Ml(c), c = 0, u = 0, t.mode = os;
        case os:
          if (t.havedict === 0)
            return r.next_out = s, r.avail_out = l, r.next_in = a, r.avail_in = o, t.hold = c, t.bits = u, Jx;
          r.adler = t.check = 1, t.mode = Rt;
        case Rt:
          if (e === Xx || e === ja)
            break e;
        case no:
          if (t.last) {
            c >>>= u & 7, u -= u & 7, t.mode = so;
            break;
          }
          for (; u < 3; ) {
            if (o === 0)
              break e;
            o--, c += i[a++] << u, u += 8;
          }
          switch (t.last = c & 1, c >>>= 1, u -= 1, c & 3) {
            case 0:
              t.mode = Ol;
              break;
            case 1:
              if (sg(t), t.mode = Ia, e === ja) {
                c >>>= 2, u -= 2;
                break e;
              }
              break;
            case 2:
              t.mode = Dl;
              break;
            case 3:
              r.msg = "invalid block type", t.mode = fe;
          }
          c >>>= 2, u -= 2;
          break;
        case Ol:
          for (c >>>= u & 7, u -= u & 7; u < 32; ) {
            if (o === 0)
              break e;
            o--, c += i[a++] << u, u += 8;
          }
          if ((c & 65535) !== (c >>> 16 ^ 65535)) {
            r.msg = "invalid stored block lengths", t.mode = fe;
            break;
          }
          if (t.length = c & 65535, c = 0, u = 0, t.mode = ao, e === ja)
            break e;
        case ao:
          t.mode = Pl;
        case Pl:
          if (d = t.length, d) {
            if (d > o && (d = o), d > l && (d = l), d === 0)
              break e;
            n.set(i.subarray(a, a + d), s), o -= d, a += d, l -= d, s += d, t.length -= d;
            break;
          }
          t.mode = Rt;
          break;
        case Dl:
          for (; u < 14; ) {
            if (o === 0)
              break e;
            o--, c += i[a++] << u, u += 8;
          }
          if (t.nlen = (c & 31) + 257, c >>>= 5, u -= 5, t.ndist = (c & 31) + 1, c >>>= 5, u -= 5, t.ncode = (c & 15) + 4, c >>>= 4, u -= 4, t.nlen > 286 || t.ndist > 30) {
            r.msg = "too many length or distance symbols", t.mode = fe;
            break;
          }
          t.have = 0, t.mode = El;
        case El:
          for (; t.have < t.ncode; ) {
            for (; u < 3; ) {
              if (o === 0)
                break e;
              o--, c += i[a++] << u, u += 8;
            }
            t.lens[j[t.have++]] = c & 7, c >>>= 3, u -= 3;
          }
          for (; t.have < 19; )
            t.lens[j[t.have++]] = 0;
          if (t.lencode = t.lendyn, t.lenbits = 7, D = { bits: t.lenbits }, C = Cn(Gx, t.lens, 0, 19, t.lencode, 0, t.work, D), t.lenbits = D.bits, C) {
            r.msg = "invalid code lengths set", t.mode = fe;
            break;
          }
          t.have = 0, t.mode = Tl;
        case Tl:
          for (; t.have < t.nlen + t.ndist; ) {
            for (; m = t.lencode[c & (1 << t.lenbits) - 1], g = m >>> 24, S = m >>> 16 & 255, y = m & 65535, !(g <= u); ) {
              if (o === 0)
                break e;
              o--, c += i[a++] << u, u += 8;
            }
            if (y < 16)
              c >>>= g, u -= g, t.lens[t.have++] = y;
            else {
              if (y === 16) {
                for (O = g + 2; u < O; ) {
                  if (o === 0)
                    break e;
                  o--, c += i[a++] << u, u += 8;
                }
                if (c >>>= g, u -= g, t.have === 0) {
                  r.msg = "invalid bit length repeat", t.mode = fe;
                  break;
                }
                _ = t.lens[t.have - 1], d = 3 + (c & 3), c >>>= 2, u -= 2;
              } else if (y === 17) {
                for (O = g + 3; u < O; ) {
                  if (o === 0)
                    break e;
                  o--, c += i[a++] << u, u += 8;
                }
                c >>>= g, u -= g, _ = 0, d = 3 + (c & 7), c >>>= 3, u -= 3;
              } else {
                for (O = g + 7; u < O; ) {
                  if (o === 0)
                    break e;
                  o--, c += i[a++] << u, u += 8;
                }
                c >>>= g, u -= g, _ = 0, d = 11 + (c & 127), c >>>= 7, u -= 7;
              }
              if (t.have + d > t.nlen + t.ndist) {
                r.msg = "invalid bit length repeat", t.mode = fe;
                break;
              }
              for (; d--; )
                t.lens[t.have++] = _;
            }
          }
          if (t.mode === fe)
            break;
          if (t.lens[256] === 0) {
            r.msg = "invalid code -- missing end-of-block", t.mode = fe;
            break;
          }
          if (t.lenbits = 9, D = { bits: t.lenbits }, C = Cn(od, t.lens, 0, t.nlen, t.lencode, 0, t.work, D), t.lenbits = D.bits, C) {
            r.msg = "invalid literal/lengths set", t.mode = fe;
            break;
          }
          if (t.distbits = 6, t.distcode = t.distdyn, D = { bits: t.distbits }, C = Cn(cd, t.lens, t.nlen, t.ndist, t.distcode, 0, t.work, D), t.distbits = D.bits, C) {
            r.msg = "invalid distances set", t.mode = fe;
            break;
          }
          if (t.mode = Ia, e === ja)
            break e;
        case Ia:
          t.mode = za;
        case za:
          if (o >= 6 && l >= 258) {
            r.next_out = s, r.avail_out = l, r.next_in = a, r.avail_in = o, t.hold = c, t.bits = u, Wx(r, h), s = r.next_out, n = r.output, l = r.avail_out, a = r.next_in, i = r.input, o = r.avail_in, c = t.hold, u = t.bits, t.mode === Rt && (t.back = -1);
            break;
          }
          for (t.back = 0; m = t.lencode[c & (1 << t.lenbits) - 1], g = m >>> 24, S = m >>> 16 & 255, y = m & 65535, !(g <= u); ) {
            if (o === 0)
              break e;
            o--, c += i[a++] << u, u += 8;
          }
          if (S && !(S & 240)) {
            for (v = g, A = S, k = y; m = t.lencode[k + ((c & (1 << v + A) - 1) >> v)], g = m >>> 24, S = m >>> 16 & 255, y = m & 65535, !(v + g <= u); ) {
              if (o === 0)
                break e;
              o--, c += i[a++] << u, u += 8;
            }
            c >>>= v, u -= v, t.back += v;
          }
          if (c >>>= g, u -= g, t.back += g, t.length = y, S === 0) {
            t.mode = Il;
            break;
          }
          if (S & 32) {
            t.back = -1, t.mode = Rt;
            break;
          }
          if (S & 64) {
            r.msg = "invalid literal/length code", t.mode = fe;
            break;
          }
          t.extra = S & 15, t.mode = Rl;
        case Rl:
          if (t.extra) {
            for (O = t.extra; u < O; ) {
              if (o === 0)
                break e;
              o--, c += i[a++] << u, u += 8;
            }
            t.length += c & (1 << t.extra) - 1, c >>>= t.extra, u -= t.extra, t.back += t.extra;
          }
          t.was = t.length, t.mode = Bl;
        case Bl:
          for (; m = t.distcode[c & (1 << t.distbits) - 1], g = m >>> 24, S = m >>> 16 & 255, y = m & 65535, !(g <= u); ) {
            if (o === 0)
              break e;
            o--, c += i[a++] << u, u += 8;
          }
          if (!(S & 240)) {
            for (v = g, A = S, k = y; m = t.distcode[k + ((c & (1 << v + A) - 1) >> v)], g = m >>> 24, S = m >>> 16 & 255, y = m & 65535, !(v + g <= u); ) {
              if (o === 0)
                break e;
              o--, c += i[a++] << u, u += 8;
            }
            c >>>= v, u -= v, t.back += v;
          }
          if (c >>>= g, u -= g, t.back += g, S & 64) {
            r.msg = "invalid distance code", t.mode = fe;
            break;
          }
          t.offset = y, t.extra = S & 15, t.mode = Nl;
        case Nl:
          if (t.extra) {
            for (O = t.extra; u < O; ) {
              if (o === 0)
                break e;
              o--, c += i[a++] << u, u += 8;
            }
            t.offset += c & (1 << t.extra) - 1, c >>>= t.extra, u -= t.extra, t.back += t.extra;
          }
          if (t.offset > t.dmax) {
            r.msg = "invalid distance too far back", t.mode = fe;
            break;
          }
          t.mode = jl;
        case jl:
          if (l === 0)
            break e;
          if (d = h - l, t.offset > d) {
            if (d = t.offset - d, d > t.whave && t.sane) {
              r.msg = "invalid distance too far back", t.mode = fe;
              break;
            }
            d > t.wnext ? (d -= t.wnext, b = t.wsize - d) : b = t.wnext - d, d > t.length && (d = t.length), p = t.window;
          } else
            p = n, b = s - t.offset, d = t.length;
          d > l && (d = l), l -= d, t.length -= d;
          do
            n[s++] = p[b++];
          while (--d);
          t.length === 0 && (t.mode = za);
          break;
        case Il:
          if (l === 0)
            break e;
          n[s++] = t.length, l--, t.mode = za;
          break;
        case so:
          if (t.wrap) {
            for (; u < 32; ) {
              if (o === 0)
                break e;
              o--, c |= i[a++] << u, u += 8;
            }
            if (h -= l, r.total_out += h, t.total += h, t.wrap & 4 && h && (r.adler = t.check = /*UPDATE_CHECK(state.check, put - _out, _out);*/
            t.flags ? Ce(t.check, n, h, s - h) : Hn(t.check, n, h, s - h)), h = l, t.wrap & 4 && (t.flags ? c : Ml(c)) !== t.check) {
              r.msg = "incorrect data check", t.mode = fe;
              break;
            }
            c = 0, u = 0;
          }
          t.mode = zl;
        case zl:
          if (t.wrap && t.flags) {
            for (; u < 32; ) {
              if (o === 0)
                break e;
              o--, c += i[a++] << u, u += 8;
            }
            if (t.wrap & 4 && c !== (t.total & 4294967295)) {
              r.msg = "incorrect length check", t.mode = fe;
              break;
            }
            c = 0, u = 0;
          }
          t.mode = Ll;
        case Ll:
          C = Yx;
          break e;
        case fe:
          C = ld;
          break e;
        case dd:
          return ud;
        case hd:
        default:
          return st;
      }
  return r.next_out = s, r.avail_out = l, r.next_in = a, r.avail_in = o, t.hold = c, t.bits = u, (t.wsize || h !== r.avail_out && t.mode < fe && (t.mode < so || e !== pl)) && pd(r, r.output, r.next_out, h - r.avail_out), f -= r.avail_in, h -= r.avail_out, r.total_in += f, r.total_out += h, t.total += h, t.wrap & 4 && h && (r.adler = t.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
  t.flags ? Ce(t.check, n, h, r.next_out - h) : Hn(t.check, n, h, r.next_out - h)), r.data_type = t.bits + (t.last ? 64 : 0) + (t.mode === Rt ? 128 : 0) + (t.mode === Ia || t.mode === ao ? 256 : 0), (f === 0 && h === 0 || e === pl) && C === Kr && (C = Qx), C;
}, cg = (r) => {
  if (li(r))
    return st;
  let e = r.state;
  return e.window && (e.window = null), r.state = null, Kr;
}, lg = (r, e) => {
  if (li(r))
    return st;
  const t = r.state;
  return t.wrap & 2 ? (t.head = e, e.done = !1, Kr) : st;
}, ug = (r, e) => {
  const t = e.length;
  let i, n, a;
  return li(r) || (i = r.state, i.wrap !== 0 && i.mode !== os) ? st : i.mode === os && (n = 1, n = Hn(n, e, t, 0), n !== i.check) ? ld : (a = pd(r, e, t, t), a ? (i.mode = dd, ud) : (i.havedict = 1, Kr));
};
var dg = bd, hg = xd, fg = fd, bg = ag, xg = gd, gg = og, pg = cg, mg = lg, wg = ug, yg = "pako inflate (from Nodeca project)", It = {
  inflateReset: dg,
  inflateReset2: hg,
  inflateResetKeep: fg,
  inflateInit: bg,
  inflateInit2: xg,
  inflate: gg,
  inflateEnd: pg,
  inflateGetHeader: mg,
  inflateSetDictionary: wg,
  inflateInfo: yg
};
function vg() {
  this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
}
var _g = vg;
const md = Object.prototype.toString, {
  Z_NO_FLUSH: kg,
  Z_FINISH: Sg,
  Z_OK: Kn,
  Z_STREAM_END: lo,
  Z_NEED_DICT: uo,
  Z_STREAM_ERROR: Ag,
  Z_DATA_ERROR: $l,
  Z_MEM_ERROR: Cg
} = pa;
function ya(r) {
  this.options = js.assign({
    chunkSize: 1024 * 64,
    windowBits: 15,
    to: ""
  }, r || {});
  const e = this.options;
  e.raw && e.windowBits >= 0 && e.windowBits < 16 && (e.windowBits = -e.windowBits, e.windowBits === 0 && (e.windowBits = -15)), e.windowBits >= 0 && e.windowBits < 16 && !(r && r.windowBits) && (e.windowBits += 32), e.windowBits > 15 && e.windowBits < 48 && (e.windowBits & 15 || (e.windowBits |= 15)), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new ad(), this.strm.avail_out = 0;
  let t = It.inflateInit2(
    this.strm,
    e.windowBits
  );
  if (t !== Kn)
    throw new Error(qr[t]);
  if (this.header = new _g(), It.inflateGetHeader(this.strm, this.header), e.dictionary && (typeof e.dictionary == "string" ? e.dictionary = Zn.string2buf(e.dictionary) : md.call(e.dictionary) === "[object ArrayBuffer]" && (e.dictionary = new Uint8Array(e.dictionary)), e.raw && (t = It.inflateSetDictionary(this.strm, e.dictionary), t !== Kn)))
    throw new Error(qr[t]);
}
ya.prototype.push = function(r, e) {
  const t = this.strm, i = this.options.chunkSize, n = this.options.dictionary;
  let a, s, o;
  if (this.ended) return !1;
  for (e === ~~e ? s = e : s = e === !0 ? Sg : kg, md.call(r) === "[object ArrayBuffer]" ? t.input = new Uint8Array(r) : t.input = r, t.next_in = 0, t.avail_in = t.input.length; ; ) {
    for (t.avail_out === 0 && (t.output = new Uint8Array(i), t.next_out = 0, t.avail_out = i), a = It.inflate(t, s), a === uo && n && (a = It.inflateSetDictionary(t, n), a === Kn ? a = It.inflate(t, s) : a === $l && (a = uo)); t.avail_in > 0 && a === lo && t.state.wrap > 0 && r[t.next_in] !== 0; )
      It.inflateReset(t), a = It.inflate(t, s);
    switch (a) {
      case Ag:
      case $l:
      case uo:
      case Cg:
        return this.onEnd(a), this.ended = !0, !1;
    }
    if (o = t.avail_out, t.next_out && (t.avail_out === 0 || a === lo))
      if (this.options.to === "string") {
        let l = Zn.utf8border(t.output, t.next_out), c = t.next_out - l, u = Zn.buf2string(t.output, l);
        t.next_out = c, t.avail_out = i - c, c && t.output.set(t.output.subarray(l, l + c), 0), this.onData(u);
      } else
        this.onData(t.output.length === t.next_out ? t.output : t.output.subarray(0, t.next_out));
    if (!(a === Kn && o === 0)) {
      if (a === lo)
        return a = It.inflateEnd(this.strm), this.onEnd(a), this.ended = !0, !0;
      if (t.avail_in === 0) break;
    }
  }
  return !0;
};
ya.prototype.onData = function(r) {
  this.chunks.push(r);
};
ya.prototype.onEnd = function(r) {
  r === Kn && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = js.flattenChunks(this.chunks)), this.chunks = [], this.err = r, this.msg = this.strm.msg;
};
function Oc(r, e) {
  const t = new ya(e);
  if (t.push(r), t.err) throw t.msg || qr[t.err];
  return t.result;
}
function Fg(r, e) {
  return e = e || {}, e.raw = !0, Oc(r, e);
}
var Og = ya, Pg = Oc, Dg = Fg, Eg = Oc, Tg = {
  Inflate: Og,
  inflate: Pg,
  inflateRaw: Dg,
  ungzip: Eg
};
const { Deflate: Rg, deflate: Bg, deflateRaw: Ng, gzip: jg } = Ux, { Inflate: Ig, inflate: zg, inflateRaw: Lg, ungzip: Mg } = Tg;
var Ug = Rg, $g = Bg, Wg = Ng, Hg = jg, qg = Ig, Zg = zg, Kg = Lg, Vg = Mg, Gg = pa, wd = {
  Deflate: Ug,
  deflate: $g,
  deflateRaw: Wg,
  gzip: Hg,
  Inflate: qg,
  inflate: Zg,
  inflateRaw: Kg,
  ungzip: Vg,
  constants: Gg
};
class Vr {
  constructor(e, t) {
    Object.defineProperty(this, "major", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "minor", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.major = String(e), this.minor = String(t);
  }
  toString() {
    const e = xr(129);
    return `%PDF-${this.major}.${this.minor}
%${e}${e}${e}${e}`;
  }
  sizeInBytes() {
    return 12 + this.major.length + this.minor.length;
  }
  copyBytesInto(e, t) {
    const i = t;
    return e[t++] = w.Percent, e[t++] = w.P, e[t++] = w.D, e[t++] = w.F, e[t++] = w.Dash, t += We(this.major, e, t), e[t++] = w.Period, t += We(this.minor, e, t), e[t++] = w.Newline, e[t++] = w.Percent, e[t++] = 129, e[t++] = 129, e[t++] = 129, e[t++] = 129, t - i;
  }
}
Object.defineProperty(Vr, "forVersion", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e) => new Vr(r, e)
});
class V extends bt {
  constructor(e) {
    super(), Object.defineProperty(this, "array", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "context", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.array = [], this.context = e;
  }
  size() {
    return this.array.length;
  }
  push(e) {
    this.array.push(e);
  }
  insert(e, t) {
    this.array.splice(e, 0, t);
  }
  indexOf(e) {
    const t = this.array.indexOf(e);
    return t === -1 ? void 0 : t;
  }
  remove(e) {
    this.array.splice(e, 1);
  }
  set(e, t) {
    this.array[e] = t;
  }
  get(e) {
    return this.array[e];
  }
  lookupMaybe(e, ...t) {
    return this.context.lookupMaybe(
      this.get(e),
      ...t
    );
  }
  lookup(e, ...t) {
    return this.context.lookup(
      this.get(e),
      ...t
    );
  }
  asRectangle() {
    if (this.size() !== 4)
      throw new V0(this.size());
    const e = this.lookup(0, q).asNumber(), t = this.lookup(1, q).asNumber(), i = this.lookup(2, q).asNumber(), n = this.lookup(3, q).asNumber(), a = e, s = t, o = i - e, l = n - t;
    return { x: a, y: s, width: o, height: l };
  }
  asArray() {
    return this.array.slice();
  }
  clone(e) {
    const t = V.withContext(e || this.context);
    for (let i = 0, n = this.size(); i < n; i++)
      t.push(this.array[i]);
    return t;
  }
  toString() {
    let e = "[ ";
    for (let t = 0, i = this.size(); t < i; t++)
      e += this.get(t).toString(), e += " ";
    return e += "]", e;
  }
  sizeInBytes() {
    let e = 3;
    for (let t = 0, i = this.size(); t < i; t++)
      e += this.get(t).sizeInBytes() + 1;
    return e;
  }
  copyBytesInto(e, t) {
    const i = t;
    e[t++] = w.LeftSquareBracket, e[t++] = w.Space;
    for (let n = 0, a = this.size(); n < a; n++)
      t += this.get(n).copyBytesInto(e, t), e[t++] = w.Space;
    return e[t++] = w.RightSquareBracket, t - i;
  }
  scalePDFNumbers(e, t) {
    for (let i = 0, n = this.size(); i < n; i++) {
      const a = this.lookup(i);
      if (a instanceof q) {
        const s = i % 2 === 0 ? e : t;
        this.set(i, q.of(a.asNumber() * s));
      }
    }
  }
}
Object.defineProperty(V, "withContext", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => new V(r)
});
const Pc = {};
class Dt extends bt {
  constructor(e, t) {
    if (e !== Pc)
      throw new sc("PDFBool");
    super(), Object.defineProperty(this, "value", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.value = t;
  }
  asBoolean() {
    return this.value;
  }
  clone() {
    return this;
  }
  toString() {
    return String(this.value);
  }
  sizeInBytes() {
    return this.value ? 4 : 5;
  }
  copyBytesInto(e, t) {
    return this.value ? (e[t++] = w.t, e[t++] = w.r, e[t++] = w.u, e[t++] = w.e, 4) : (e[t++] = w.f, e[t++] = w.a, e[t++] = w.l, e[t++] = w.s, e[t++] = w.e, 5);
  }
}
Object.defineProperty(Dt, "True", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new Dt(Pc, !0)
});
Object.defineProperty(Dt, "False", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new Dt(Pc, !1)
});
class Xg extends bt {
  asNull() {
    return null;
  }
  clone() {
    return this;
  }
  toString() {
    return "null";
  }
  sizeInBytes() {
    return 4;
  }
  copyBytesInto(e, t) {
    return e[t++] = w.n, e[t++] = w.u, e[t++] = w.l, e[t++] = w.l, 4;
  }
}
const Le = new Xg();
class $ extends bt {
  constructor(e, t) {
    super(), Object.defineProperty(this, "context", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "dict", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "suppressEncryption", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: !1
    }), this.dict = e, this.context = t;
  }
  keys() {
    return Array.from(this.dict.keys());
  }
  values() {
    return Array.from(this.dict.values());
  }
  entries() {
    return Array.from(this.dict.entries());
  }
  set(e, t) {
    this.dict.set(e, t);
  }
  get(e, t = !1) {
    const i = this.dict.get(e);
    if (!(i === Le && !t))
      return i;
  }
  has(e) {
    const t = this.dict.get(e);
    return t !== void 0 && t !== Le;
  }
  lookupMaybe(e, ...t) {
    const i = t.includes(Le), n = this.context.lookupMaybe(
      this.get(e, i),
      ...t
    );
    if (!(n === Le && !i))
      return n;
  }
  lookup(e, ...t) {
    const i = t.includes(Le), n = this.context.lookup(
      this.get(e, i),
      ...t
    );
    if (!(n === Le && !i))
      return n;
  }
  delete(e) {
    return this.dict.delete(e);
  }
  asMap() {
    return new Map(this.dict);
  }
  /** Generate a random key that doesn't exist in current key set */
  uniqueKey(e = "") {
    const t = this.keys();
    let i = x.of(this.context.addRandomSuffix(e, 10));
    for (; t.includes(i); )
      i = x.of(this.context.addRandomSuffix(e, 10));
    return i;
  }
  clone(e) {
    const t = $.withContext(e || this.context), i = this.entries();
    for (let n = 0, a = i.length; n < a; n++) {
      const [s, o] = i[n];
      t.set(s, o);
    }
    return t;
  }
  toString() {
    let e = `<<
`;
    const t = this.entries();
    for (let i = 0, n = t.length; i < n; i++) {
      const [a, s] = t[i];
      e += a.toString() + " " + s.toString() + `
`;
    }
    return e += ">>", e;
  }
  sizeInBytes() {
    let e = 5;
    const t = this.entries();
    for (let i = 0, n = t.length; i < n; i++) {
      const [a, s] = t[i];
      e += a.sizeInBytes() + s.sizeInBytes() + 2;
    }
    return e;
  }
  copyBytesInto(e, t) {
    const i = t;
    e[t++] = w.LessThan, e[t++] = w.LessThan, e[t++] = w.Newline;
    const n = this.entries();
    for (let a = 0, s = n.length; a < s; a++) {
      const [o, l] = n[a];
      t += o.copyBytesInto(e, t), e[t++] = w.Space, t += l.copyBytesInto(e, t), e[t++] = w.Newline;
    }
    return e[t++] = w.GreaterThan, e[t++] = w.GreaterThan, t - i;
  }
}
Object.defineProperty($, "withContext", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => new $(/* @__PURE__ */ new Map(), r)
});
Object.defineProperty($, "fromMapWithContext", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e) => new $(r, e)
});
class Ze extends bt {
  constructor(e) {
    super(), Object.defineProperty(this, "dict", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.dict = e;
  }
  clone(e) {
    throw new Lt(this.constructor.name, "clone");
  }
  getContentsString() {
    throw new Lt(this.constructor.name, "getContentsString");
  }
  getContents() {
    throw new Lt(this.constructor.name, "getContents");
  }
  getContentsSize() {
    throw new Lt(this.constructor.name, "getContentsSize");
  }
  updateDict() {
    const e = this.getContentsSize();
    this.dict.set(x.Length, q.of(e));
  }
  sizeInBytes() {
    return this.updateDict(), this.dict.sizeInBytes() + this.getContentsSize() + 18;
  }
  toString() {
    this.updateDict();
    let e = this.dict.toString();
    return e += `
stream
`, e += this.getContentsString(), e += `
endstream`, e;
  }
  copyBytesInto(e, t) {
    this.updateDict();
    const i = t;
    t += this.dict.copyBytesInto(e, t), e[t++] = w.Newline, e[t++] = w.s, e[t++] = w.t, e[t++] = w.r, e[t++] = w.e, e[t++] = w.a, e[t++] = w.m, e[t++] = w.Newline;
    const n = this.getContents();
    for (let a = 0, s = n.length; a < s; a++)
      e[t++] = n[a];
    return e[t++] = w.Newline, e[t++] = w.e, e[t++] = w.n, e[t++] = w.d, e[t++] = w.s, e[t++] = w.t, e[t++] = w.r, e[t++] = w.e, e[t++] = w.a, e[t++] = w.m, t - i;
  }
}
class Et extends Ze {
  constructor(e, t, i) {
    super(e), Object.defineProperty(this, "contents", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "transform", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.contents = t, this.transform = i;
  }
  asUint8Array() {
    return this.contents.slice();
  }
  clone(e) {
    return Et.of(this.dict.clone(e), this.contents.slice());
  }
  getContentsString() {
    return vn(this.contents);
  }
  getContents() {
    return this.contents;
  }
  getContentsSize() {
    return this.contents.length;
  }
}
Object.defineProperty(Et, "of", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e, t) => new Et(r, e, t)
});
const yd = {}, Wl = /* @__PURE__ */ new Map();
class te extends bt {
  constructor(e, t, i) {
    if (e !== yd)
      throw new sc("PDFRef");
    super(), Object.defineProperty(this, "objectNumber", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "generationNumber", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "tag", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.objectNumber = t, this.generationNumber = i, this.tag = `${t} ${i} R`;
  }
  clone() {
    return this;
  }
  toString() {
    return this.tag;
  }
  sizeInBytes() {
    return this.tag.length;
  }
  copyBytesInto(e, t) {
    return t += We(this.tag, e, t), this.tag.length;
  }
}
Object.defineProperty(te, "of", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e = 0) => {
    const t = `${r} ${e} R`;
    let i = Wl.get(t);
    return i || (i = new te(yd, r, e), Wl.set(t, i)), i;
  }
});
class zs extends Ze {
  constructor(e, t) {
    super(e), Object.defineProperty(this, "contentsCache", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "encode", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "computeContents", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: () => {
        const i = this.getUnencodedContents();
        return this.encode ? wd.deflate(i) : i;
      }
    }), this.encode = t, t && e.set(x.of("Filter"), x.of("FlateDecode")), this.contentsCache = it.populatedBy(this.computeContents);
  }
  getContents() {
    return this.contentsCache.access();
  }
  getContentsSize() {
    return this.contentsCache.access().length;
  }
  getUnencodedContents() {
    throw new Lt(this.constructor.name, "getUnencodedContents");
  }
}
class Ot extends zs {
  constructor(e, t, i = !0) {
    super(e, i), Object.defineProperty(this, "operators", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.operators = t;
  }
  push(...e) {
    this.operators.push(...e);
  }
  clone(e) {
    const t = new Array(this.operators.length);
    for (let a = 0, s = this.operators.length; a < s; a++)
      t[a] = this.operators[a].clone(e);
    const { dict: i, encode: n } = this;
    return Ot.of(i.clone(e), t, n);
  }
  getContentsString() {
    let e = "";
    for (let t = 0, i = this.operators.length; t < i; t++)
      e += `${this.operators[t]}
`;
    return e;
  }
  getUnencodedContents() {
    const e = new Uint8Array(this.getUnencodedContentsSize());
    let t = 0;
    for (let i = 0, n = this.operators.length; i < n; i++)
      t += this.operators[i].copyBytesInto(e, t), e[t++] = w.Newline;
    return e;
  }
  getUnencodedContentsSize() {
    let e = 0;
    for (let t = 0, i = this.operators.length; t < i; t++)
      e += this.operators[t].sizeInBytes() + 1;
    return e;
  }
}
Object.defineProperty(Ot, "of", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e, t = !0) => new Ot(r, e, t)
});
class qo {
  constructor(e) {
    Object.defineProperty(this, "seed", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.seed = e;
  }
  nextInt() {
    const e = Math.sin(this.seed++) * 1e4;
    return e - Math.floor(e);
  }
}
Object.defineProperty(qo, "withSeed", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => new qo(r)
});
const Yg = ([r], [e]) => r.objectNumber - e.objectNumber;
class ji {
  constructor() {
    Object.defineProperty(this, "isDecrypted", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: !0
    }), Object.defineProperty(this, "largestObjectNumber", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "header", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "trailerInfo", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "rng", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "indirectObjects", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "pushGraphicsStateContentStreamRef", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "popGraphicsStateContentStreamRef", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.largestObjectNumber = 0, this.header = Vr.forVersion(1, 7), this.trailerInfo = {}, this.indirectObjects = /* @__PURE__ */ new Map(), this.rng = qo.withSeed(1);
  }
  assign(e, t) {
    this.indirectObjects.set(e, t), e.objectNumber > this.largestObjectNumber && (this.largestObjectNumber = e.objectNumber);
  }
  nextRef() {
    return this.largestObjectNumber += 1, te.of(this.largestObjectNumber);
  }
  register(e) {
    const t = this.nextRef();
    return this.assign(t, e), t;
  }
  delete(e) {
    return this.indirectObjects.delete(e);
  }
  lookupMaybe(e, ...t) {
    const i = t.includes(Le), n = e instanceof te ? this.indirectObjects.get(e) : e;
    if (!(!n || n === Le && !i)) {
      for (let a = 0, s = t.length; a < s; a++) {
        const o = t[a];
        if (o === Le) {
          if (n === Le)
            return n;
        } else if (n instanceof o)
          return n;
      }
      throw new Nn(t, n);
    }
  }
  lookup(e, ...t) {
    const i = e instanceof te ? this.indirectObjects.get(e) : e;
    if (t.length === 0)
      return i;
    for (let n = 0, a = t.length; n < a; n++) {
      const s = t[n];
      if (s === Le) {
        if (i === Le)
          return i;
      } else if (i instanceof s)
        return i;
    }
    throw new Nn(t, i);
  }
  getObjectRef(e) {
    const t = Array.from(this.indirectObjects.entries());
    for (let i = 0, n = t.length; i < n; i++) {
      const [a, s] = t[i];
      if (s === e)
        return a;
    }
  }
  enumerateIndirectObjects() {
    return Array.from(this.indirectObjects.entries()).sort(Yg);
  }
  obj(e) {
    if (e instanceof bt)
      return e;
    if (e == null)
      return Le;
    if (typeof e == "string")
      return x.of(e);
    if (typeof e == "number")
      return q.of(e);
    if (typeof e == "boolean")
      return e ? Dt.True : Dt.False;
    if (Array.isArray(e)) {
      const t = V.withContext(this);
      for (let i = 0, n = e.length; i < n; i++)
        t.push(this.obj(e[i]));
      return t;
    } else {
      const t = $.withContext(this), i = Object.keys(e);
      for (let n = 0, a = i.length; n < a; n++) {
        const s = i[n], o = e[s];
        o !== void 0 && t.set(x.of(s), this.obj(o));
      }
      return t;
    }
  }
  stream(e, t = {}) {
    return Et.of(this.obj(t), Oo(e));
  }
  flateStream(e, t = {}) {
    return this.stream(wd.deflate(Oo(e)), {
      ...t,
      Filter: "FlateDecode"
    });
  }
  contentStream(e, t = {}) {
    return Ot.of(this.obj(t), e);
  }
  formXObject(e, t = {}) {
    return this.contentStream(e, {
      BBox: this.obj([0, 0, 0, 0]),
      Matrix: this.obj([1, 0, 0, 1, 0, 0]),
      ...t,
      Type: "XObject",
      Subtype: "Form"
    });
  }
  /*
   * Reference to PDFContentStream that contains a single PDFOperator: `q`.
   * Used by [[PDFPageLeaf]] instances to ensure that when content streams are
   * added to a modified PDF, they start in the default, unchanged graphics
   * state.
   */
  getPushGraphicsStateContentStream() {
    if (this.pushGraphicsStateContentStreamRef)
      return this.pushGraphicsStateContentStreamRef;
    const e = this.obj({}), t = is.of(Po.PushGraphicsState), i = Ot.of(e, [t]);
    return this.pushGraphicsStateContentStreamRef = this.register(i), this.pushGraphicsStateContentStreamRef;
  }
  /*
   * Reference to PDFContentStream that contains a single PDFOperator: `Q`.
   * Used by [[PDFPageLeaf]] instances to ensure that when content streams are
   * added to a modified PDF, they start in the default, unchanged graphics
   * state.
   */
  getPopGraphicsStateContentStream() {
    if (this.popGraphicsStateContentStreamRef)
      return this.popGraphicsStateContentStreamRef;
    const e = this.obj({}), t = is.of(Po.PopGraphicsState), i = Ot.of(e, [t]);
    return this.popGraphicsStateContentStreamRef = this.register(i), this.popGraphicsStateContentStreamRef;
  }
  addRandomSuffix(e, t = 4) {
    return `${e}-${Math.floor(this.rng.nextInt() * 10 ** t)}`;
  }
}
Object.defineProperty(ji, "create", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: () => new ji()
});
class Be extends $ {
  constructor(e, t, i = !0) {
    super(e, t), Object.defineProperty(this, "normalized", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: !1
    }), Object.defineProperty(this, "autoNormalizeCTM", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.autoNormalizeCTM = i;
  }
  clone(e) {
    const t = Be.fromMapWithContext(/* @__PURE__ */ new Map(), e || this.context, this.autoNormalizeCTM), i = this.entries();
    for (let n = 0, a = i.length; n < a; n++) {
      const [s, o] = i[n];
      t.set(s, o);
    }
    return t;
  }
  Parent() {
    return this.lookupMaybe(x.Parent, $);
  }
  Contents() {
    return this.lookup(x.of("Contents"));
  }
  Annots() {
    return this.lookupMaybe(x.Annots, V);
  }
  BleedBox() {
    return this.lookupMaybe(x.BleedBox, V);
  }
  TrimBox() {
    return this.lookupMaybe(x.TrimBox, V);
  }
  ArtBox() {
    return this.lookupMaybe(x.ArtBox, V);
  }
  Resources() {
    const e = this.getInheritableAttribute(x.Resources);
    return this.context.lookupMaybe(e, $);
  }
  MediaBox() {
    const e = this.getInheritableAttribute(x.MediaBox);
    return this.context.lookup(e, V);
  }
  CropBox() {
    const e = this.getInheritableAttribute(x.CropBox);
    return this.context.lookupMaybe(e, V);
  }
  Rotate() {
    const e = this.getInheritableAttribute(x.Rotate);
    return this.context.lookupMaybe(e, q);
  }
  getInheritableAttribute(e) {
    let t;
    return this.ascend((i) => {
      t || (t = i.get(e));
    }), t;
  }
  setParent(e) {
    this.set(x.Parent, e);
  }
  addContentStream(e) {
    const t = this.normalizedEntries().Contents || this.context.obj([]);
    this.set(x.Contents, t), t.push(e);
  }
  wrapContentStreams(e, t) {
    const i = this.Contents();
    return i instanceof V ? (i.insert(0, e), i.push(t), !0) : !1;
  }
  addAnnot(e) {
    const { Annots: t } = this.normalizedEntries();
    t.push(e);
  }
  removeAnnot(e) {
    const { Annots: t } = this.normalizedEntries(), i = t.indexOf(e);
    i !== void 0 && t.remove(i);
  }
  setFontDictionary(e, t) {
    const { Font: i } = this.normalizedEntries();
    i.set(e, t);
  }
  newFontDictionaryKey(e) {
    const { Font: t } = this.normalizedEntries();
    return t.uniqueKey(e);
  }
  newFontDictionary(e, t) {
    const i = this.newFontDictionaryKey(e);
    return this.setFontDictionary(i, t), i;
  }
  setXObject(e, t) {
    const { XObject: i } = this.normalizedEntries();
    i.set(e, t);
  }
  newXObjectKey(e) {
    const { XObject: t } = this.normalizedEntries();
    return t.uniqueKey(e);
  }
  newXObject(e, t) {
    const i = this.newXObjectKey(e);
    return this.setXObject(i, t), i;
  }
  setExtGState(e, t) {
    const { ExtGState: i } = this.normalizedEntries();
    i.set(e, t);
  }
  newExtGStateKey(e) {
    const { ExtGState: t } = this.normalizedEntries();
    return t.uniqueKey(e);
  }
  newExtGState(e, t) {
    const i = this.newExtGStateKey(e);
    return this.setExtGState(i, t), i;
  }
  ascend(e) {
    e(this);
    const t = this.Parent();
    t && t.ascend(e);
  }
  normalize() {
    if (this.normalized)
      return;
    const { context: e } = this, t = this.get(x.Contents);
    this.context.lookup(t) instanceof Ze && this.set(x.Contents, e.obj([t])), this.autoNormalizeCTM && this.wrapContentStreams(this.context.getPushGraphicsStateContentStream(), this.context.getPopGraphicsStateContentStream());
    const n = this.getInheritableAttribute(x.Resources), a = e.lookupMaybe(n, $) || e.obj({});
    this.set(x.Resources, a);
    const s = a.lookupMaybe(x.Font, $) || e.obj({});
    a.set(x.Font, s);
    const o = a.lookupMaybe(x.XObject, $) || e.obj({});
    a.set(x.XObject, o);
    const l = a.lookupMaybe(x.ExtGState, $) || e.obj({});
    a.set(x.ExtGState, l);
    const c = this.Annots() || e.obj([]);
    this.set(x.Annots, c), this.normalized = !0;
  }
  normalizedEntries() {
    this.normalize();
    const e = this.Annots(), t = this.Resources(), i = this.Contents();
    return {
      Annots: e,
      Resources: t,
      Contents: i,
      Font: t.lookup(x.Font, $),
      XObject: t.lookup(x.XObject, $),
      ExtGState: t.lookup(x.ExtGState, $)
    };
  }
}
Object.defineProperty(Be, "InheritableEntries", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: ["Resources", "MediaBox", "CropBox", "Rotate"]
});
Object.defineProperty(Be, "withContextAndParent", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e) => {
    const t = /* @__PURE__ */ new Map();
    return t.set(x.Type, x.Page), t.set(x.Parent, e), t.set(x.Resources, r.obj({})), t.set(x.MediaBox, r.obj([0, 0, 612, 792])), new Be(t, r, !1);
  }
});
Object.defineProperty(Be, "fromMapWithContext", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e, t = !0) => new Be(r, e, t)
});
class Vn {
  constructor(e, t) {
    Object.defineProperty(this, "src", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "dest", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "traversedObjects", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: /* @__PURE__ */ new Map()
    }), Object.defineProperty(this, "copy", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (i) => i instanceof Be ? this.copyPDFPage(i) : i instanceof $ ? this.copyPDFDict(i) : i instanceof V ? this.copyPDFArray(i) : i instanceof Ze ? this.copyPDFStream(i) : i instanceof te ? this.copyPDFIndirectObject(i) : i.clone()
    }), Object.defineProperty(this, "copyPDFPage", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (i) => {
        const n = i.clone(), { InheritableEntries: a } = Be;
        for (let s = 0, o = a.length; s < o; s++) {
          const l = x.of(a[s]), c = n.getInheritableAttribute(l);
          !n.get(l) && c && n.set(l, c);
        }
        return n.delete(x.of("Parent")), this.copyPDFDict(n);
      }
    }), Object.defineProperty(this, "copyPDFDict", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (i) => {
        if (this.traversedObjects.has(i))
          return this.traversedObjects.get(i);
        const n = i.clone(this.dest);
        this.traversedObjects.set(i, n);
        const a = i.entries();
        for (let s = 0, o = a.length; s < o; s++) {
          const [l, c] = a[s];
          n.set(l, this.copy(c));
        }
        return n;
      }
    }), Object.defineProperty(this, "copyPDFArray", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (i) => {
        if (this.traversedObjects.has(i))
          return this.traversedObjects.get(i);
        const n = i.clone(this.dest);
        this.traversedObjects.set(i, n);
        for (let a = 0, s = i.size(); a < s; a++) {
          const o = i.get(a);
          n.set(a, this.copy(o));
        }
        return n;
      }
    }), Object.defineProperty(this, "copyPDFStream", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (i) => {
        if (this.traversedObjects.has(i))
          return this.traversedObjects.get(i);
        const n = i.clone(this.dest);
        this.traversedObjects.set(i, n);
        const a = i.dict.entries();
        for (let s = 0, o = a.length; s < o; s++) {
          const [l, c] = a[s];
          n.dict.set(l, this.copy(c));
        }
        return n;
      }
    }), Object.defineProperty(this, "copyPDFIndirectObject", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (i) => {
        if (!this.traversedObjects.has(i)) {
          const a = this.dest.nextRef();
          this.traversedObjects.set(i, a);
          const s = this.src.lookup(i);
          if (s) {
            const o = this.copy(s);
            this.dest.assign(a, o);
          }
        }
        return this.traversedObjects.get(i);
      }
    }), this.src = e, this.dest = t;
  }
}
Object.defineProperty(Vn, "for", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e) => new Vn(r, e)
});
class Gr {
  constructor(e) {
    Object.defineProperty(this, "subsections", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "chunkIdx", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "chunkLength", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.subsections = e ? [[e]] : [], this.chunkIdx = 0, this.chunkLength = e ? 1 : 0;
  }
  addEntry(e, t) {
    this.append({ ref: e, offset: t, deleted: !1 });
  }
  addDeletedEntry(e, t) {
    this.append({ ref: e, offset: t, deleted: !0 });
  }
  toString() {
    let e = `xref
`;
    for (let t = 0, i = this.subsections.length; t < i; t++) {
      const n = this.subsections[t];
      e += `${n[0].ref.objectNumber} ${n.length}
`;
      for (let a = 0, s = n.length; a < s; a++) {
        const o = n[a];
        e += ut(String(o.offset), 10, "0"), e += " ", e += ut(String(o.ref.generationNumber), 5, "0"), e += " ", e += o.deleted ? "f" : "n", e += ` 
`;
      }
    }
    return e;
  }
  sizeInBytes() {
    let e = 5;
    for (let t = 0, i = this.subsections.length; t < i; t++) {
      const n = this.subsections[t], a = n.length, [s] = n;
      e += 2, e += String(s.ref.objectNumber).length, e += String(a).length, e += 20 * a;
    }
    return e;
  }
  copyBytesInto(e, t) {
    const i = t;
    return e[t++] = w.x, e[t++] = w.r, e[t++] = w.e, e[t++] = w.f, e[t++] = w.Newline, t += this.copySubsectionsIntoBuffer(this.subsections, e, t), t - i;
  }
  copySubsectionsIntoBuffer(e, t, i) {
    const n = i, a = e.length;
    for (let s = 0; s < a; s++) {
      const o = this.subsections[s], l = String(o[0].ref.objectNumber);
      i += We(l, t, i), t[i++] = w.Space;
      const c = String(o.length);
      i += We(c, t, i), t[i++] = w.Newline, i += this.copyEntriesIntoBuffer(o, t, i);
    }
    return i - n;
  }
  copyEntriesIntoBuffer(e, t, i) {
    const n = e.length;
    for (let a = 0; a < n; a++) {
      const s = e[a], o = ut(String(s.offset), 10, "0");
      i += We(o, t, i), t[i++] = w.Space;
      const l = ut(String(s.ref.generationNumber), 5, "0");
      i += We(l, t, i), t[i++] = w.Space, t[i++] = s.deleted ? w.f : w.n, t[i++] = w.Space, t[i++] = w.Newline;
    }
    return 20 * n;
  }
  append(e) {
    if (this.chunkLength === 0) {
      this.subsections.push([e]), this.chunkIdx = 0, this.chunkLength = 1;
      return;
    }
    const t = this.subsections[this.chunkIdx], i = t[this.chunkLength - 1];
    e.ref.objectNumber - i.ref.objectNumber > 1 ? (this.subsections.push([e]), this.chunkIdx += 1, this.chunkLength = 1) : (t.push(e), this.chunkLength += 1);
  }
}
Object.defineProperty(Gr, "create", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: () => new Gr({
    ref: te.of(0, 65535),
    offset: 0,
    deleted: !0
  })
});
Object.defineProperty(Gr, "createEmpty", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: () => new Gr()
});
class Ii {
  constructor(e) {
    Object.defineProperty(this, "lastXRefOffset", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.lastXRefOffset = String(e);
  }
  toString() {
    return `startxref
${this.lastXRefOffset}
%%EOF`;
  }
  sizeInBytes() {
    return 16 + this.lastXRefOffset.length;
  }
  copyBytesInto(e, t) {
    const i = t;
    return e[t++] = w.s, e[t++] = w.t, e[t++] = w.a, e[t++] = w.r, e[t++] = w.t, e[t++] = w.x, e[t++] = w.r, e[t++] = w.e, e[t++] = w.f, e[t++] = w.Newline, t += We(this.lastXRefOffset, e, t), e[t++] = w.Newline, e[t++] = w.Percent, e[t++] = w.Percent, e[t++] = w.E, e[t++] = w.O, e[t++] = w.F, t - i;
  }
}
Object.defineProperty(Ii, "forLastCrossRefSectionOffset", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => new Ii(r)
});
class cs {
  constructor(e) {
    Object.defineProperty(this, "dict", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.dict = e;
  }
  toString() {
    return `trailer
${this.dict.toString()}`;
  }
  sizeInBytes() {
    return 8 + this.dict.sizeInBytes();
  }
  copyBytesInto(e, t) {
    const i = t;
    return e[t++] = w.t, e[t++] = w.r, e[t++] = w.a, e[t++] = w.i, e[t++] = w.l, e[t++] = w.e, e[t++] = w.r, e[t++] = w.Newline, t += this.dict.copyBytesInto(e, t), t - i;
  }
}
Object.defineProperty(cs, "of", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => new cs(r)
});
class Xr extends zs {
  constructor(e, t, i = !0) {
    super(e.obj({}), i), Object.defineProperty(this, "objects", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "offsets", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "offsetsString", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.objects = t, this.offsets = this.computeObjectOffsets(), this.offsetsString = this.computeOffsetsString(), this.dict.set(x.of("Type"), x.of("ObjStm")), this.dict.set(x.of("N"), q.of(this.objects.length)), this.dict.set(x.of("First"), q.of(this.offsetsString.length));
  }
  getObjectsCount() {
    return this.objects.length;
  }
  clone(e) {
    return Xr.withContextAndObjects(e || this.dict.context, this.objects.slice(), this.encode);
  }
  getContentsString() {
    let e = this.offsetsString;
    for (let t = 0, i = this.objects.length; t < i; t++) {
      const [, n] = this.objects[t];
      e += `${n}
`;
    }
    return e;
  }
  getUnencodedContents() {
    const e = new Uint8Array(this.getUnencodedContentsSize());
    let t = We(this.offsetsString, e, 0);
    for (let i = 0, n = this.objects.length; i < n; i++) {
      const [, a] = this.objects[i];
      t += a.copyBytesInto(e, t), e[t++] = w.Newline;
    }
    return e;
  }
  getUnencodedContentsSize() {
    return this.offsetsString.length + jn(this.offsets)[1] + jn(this.objects)[1].sizeInBytes() + 1;
  }
  computeOffsetsString() {
    let e = "";
    for (let t = 0, i = this.offsets.length; t < i; t++) {
      const [n, a] = this.offsets[t];
      e += `${n} ${a} `;
    }
    return e;
  }
  computeObjectOffsets() {
    let e = 0;
    const t = new Array(this.objects.length);
    for (let i = 0, n = this.objects.length; i < n; i++) {
      const [a, s] = this.objects[i];
      t[i] = [a.objectNumber, e], e += s.sizeInBytes() + 1;
    }
    return t;
  }
}
Object.defineProperty(Xr, "withContextAndObjects", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e, t = !0) => new Xr(r, e, t)
});
class Gn {
  constructor(e, t) {
    Object.defineProperty(this, "context", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "objectsPerTick", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "parsedObjects", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 0
    }), Object.defineProperty(this, "shouldWaitForTick", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: (i) => (this.parsedObjects += i, this.parsedObjects % this.objectsPerTick === 0)
    }), this.context = e, this.objectsPerTick = t;
  }
  async serializeToBuffer() {
    const { size: e, header: t, indirectObjects: i, xref: n, trailerDict: a, trailer: s } = await this.computeBufferSize();
    let o = 0;
    const l = new Uint8Array(e);
    o += t.copyBytesInto(l, o), l[o++] = w.Newline, l[o++] = w.Newline;
    for (let c = 0, u = i.length; c < u; c++) {
      const [f, h] = i[c], d = String(f.objectNumber);
      o += We(d, l, o), l[o++] = w.Space;
      const b = String(f.generationNumber);
      o += We(b, l, o), l[o++] = w.Space, l[o++] = w.o, l[o++] = w.b, l[o++] = w.j, l[o++] = w.Newline, o += h.copyBytesInto(l, o), l[o++] = w.Newline, l[o++] = w.e, l[o++] = w.n, l[o++] = w.d, l[o++] = w.o, l[o++] = w.b, l[o++] = w.j, l[o++] = w.Newline, l[o++] = w.Newline;
      const p = h instanceof Xr ? h.getObjectsCount() : 1;
      this.shouldWaitForTick(p) && await Hr();
    }
    return n && (o += n.copyBytesInto(l, o), l[o++] = w.Newline), a && (o += a.copyBytesInto(l, o), l[o++] = w.Newline, l[o++] = w.Newline), o += s.copyBytesInto(l, o), l;
  }
  computeIndirectObjectSize([e, t]) {
    const i = e.sizeInBytes() + 3, n = t.sizeInBytes() + 9;
    return i + n;
  }
  createTrailerDict() {
    return this.context.obj({
      Size: this.context.largestObjectNumber + 1,
      Root: this.context.trailerInfo.Root,
      Encrypt: this.context.trailerInfo.Encrypt,
      Info: this.context.trailerInfo.Info,
      ID: this.context.trailerInfo.ID
    });
  }
  async computeBufferSize() {
    const e = Vr.forVersion(1, 7);
    let t = e.sizeInBytes() + 2;
    const i = Gr.create(), n = this.context.enumerateIndirectObjects();
    for (let l = 0, c = n.length; l < c; l++) {
      const u = n[l], [f] = u;
      i.addEntry(f, t), t += this.computeIndirectObjectSize(u), this.shouldWaitForTick(1) && await Hr();
    }
    const a = t;
    t += i.sizeInBytes() + 1;
    const s = cs.of(this.createTrailerDict());
    t += s.sizeInBytes() + 2;
    const o = Ii.forLastCrossRefSectionOffset(a);
    return t += o.sizeInBytes(), { size: t, header: e, indirectObjects: n, xref: i, trailerDict: s, trailer: o };
  }
}
Object.defineProperty(Gn, "forContext", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e) => new Gn(r, e)
});
class Yr extends bt {
  constructor(e) {
    super(), Object.defineProperty(this, "data", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.data = e;
  }
  clone() {
    return Yr.of(this.data.slice());
  }
  toString() {
    return `PDFInvalidObject(${this.data.length} bytes)`;
  }
  sizeInBytes() {
    return this.data.length;
  }
  copyBytesInto(e, t) {
    const i = this.data.length;
    for (let n = 0; n < i; n++)
      e[t++] = this.data[n];
    return i;
  }
}
Object.defineProperty(Yr, "of", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => new Yr(r)
});
var sr;
(function(r) {
  r[r.Deleted = 0] = "Deleted", r[r.Uncompressed = 1] = "Uncompressed", r[r.Compressed = 2] = "Compressed";
})(sr || (sr = {}));
class vr extends zs {
  constructor(e, t, i = !0) {
    super(e, i), Object.defineProperty(this, "entries", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "entryTuplesCache", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "maxByteWidthsCache", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "indexCache", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "computeIndex", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: () => {
        const n = [];
        let a = 0;
        for (let s = 0, o = this.entries.length; s < o; s++) {
          const l = this.entries[s], c = this.entries[s - 1];
          s === 0 ? n.push(l.ref.objectNumber) : l.ref.objectNumber - c.ref.objectNumber > 1 && (n.push(a), n.push(l.ref.objectNumber), a = 0), a += 1;
        }
        return n.push(a), n;
      }
    }), Object.defineProperty(this, "computeEntryTuples", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: () => {
        const n = new Array(this.entries.length);
        for (let a = 0, s = this.entries.length; a < s; a++) {
          const o = this.entries[a];
          if (o.type === sr.Deleted) {
            const { type: l, nextFreeObjectNumber: c, ref: u } = o;
            n[a] = [l, c, u.generationNumber];
          }
          if (o.type === sr.Uncompressed) {
            const { type: l, offset: c, ref: u } = o;
            n[a] = [l, c, u.generationNumber];
          }
          if (o.type === sr.Compressed) {
            const { type: l, objectStreamRef: c, index: u } = o;
            n[a] = [l, c.objectNumber, u];
          }
        }
        return n;
      }
    }), Object.defineProperty(this, "computeMaxEntryByteWidths", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: () => {
        const n = this.entryTuplesCache.access(), a = [0, 0, 0];
        for (let s = 0, o = n.length; s < o; s++) {
          const [l, c, u] = n[s], f = Ka(l), h = Ka(c), d = Ka(u);
          f > a[0] && (a[0] = f), h > a[1] && (a[1] = h), d > a[2] && (a[2] = d);
        }
        return a;
      }
    }), this.entries = t || [], this.entryTuplesCache = it.populatedBy(this.computeEntryTuples), this.maxByteWidthsCache = it.populatedBy(this.computeMaxEntryByteWidths), this.indexCache = it.populatedBy(this.computeIndex), e.set(x.of("Type"), x.of("XRef"));
  }
  addDeletedEntry(e, t) {
    const i = sr.Deleted;
    this.entries.push({ type: i, ref: e, nextFreeObjectNumber: t }), this.entryTuplesCache.invalidate(), this.maxByteWidthsCache.invalidate(), this.indexCache.invalidate(), this.contentsCache.invalidate();
  }
  addUncompressedEntry(e, t) {
    const i = sr.Uncompressed;
    this.entries.push({ type: i, ref: e, offset: t }), this.entryTuplesCache.invalidate(), this.maxByteWidthsCache.invalidate(), this.indexCache.invalidate(), this.contentsCache.invalidate();
  }
  addCompressedEntry(e, t, i) {
    const n = sr.Compressed;
    this.entries.push({ type: n, ref: e, objectStreamRef: t, index: i }), this.entryTuplesCache.invalidate(), this.maxByteWidthsCache.invalidate(), this.indexCache.invalidate(), this.contentsCache.invalidate();
  }
  clone(e) {
    const { dict: t, entries: i, encode: n } = this;
    return vr.of(t.clone(e), i.slice(), n);
  }
  getContentsString() {
    const e = this.entryTuplesCache.access(), t = this.maxByteWidthsCache.access();
    let i = "";
    for (let n = 0, a = e.length; n < a; n++) {
      const [s, o, l] = e[n], c = Pr(Dr(s)), u = Pr(Dr(o)), f = Pr(Dr(l));
      for (let h = t[0] - 1; h >= 0; h--)
        i += (c[h] || 0).toString(2);
      for (let h = t[1] - 1; h >= 0; h--)
        i += (u[h] || 0).toString(2);
      for (let h = t[2] - 1; h >= 0; h--)
        i += (f[h] || 0).toString(2);
    }
    return i;
  }
  getUnencodedContents() {
    const e = this.entryTuplesCache.access(), t = this.maxByteWidthsCache.access(), i = new Uint8Array(this.getUnencodedContentsSize());
    let n = 0;
    for (let a = 0, s = e.length; a < s; a++) {
      const [o, l, c] = e[a], u = Pr(Dr(o)), f = Pr(Dr(l)), h = Pr(Dr(c));
      for (let d = t[0] - 1; d >= 0; d--)
        i[n++] = u[d] || 0;
      for (let d = t[1] - 1; d >= 0; d--)
        i[n++] = f[d] || 0;
      for (let d = t[2] - 1; d >= 0; d--)
        i[n++] = h[d] || 0;
    }
    return i;
  }
  getUnencodedContentsSize() {
    const e = this.maxByteWidthsCache.access();
    return G0(e) * this.entries.length;
  }
  updateDict() {
    super.updateDict();
    const e = this.maxByteWidthsCache.access(), t = this.indexCache.access(), { context: i } = this.dict;
    this.dict.set(x.of("W"), i.obj(e)), this.dict.set(x.of("Index"), i.obj(t));
  }
}
Object.defineProperty(vr, "create", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e = !0) => {
    const t = new vr(r, [], e);
    return t.addDeletedEntry(te.of(0, 65535), 0), t;
  }
});
Object.defineProperty(vr, "of", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e, t = !0) => new vr(r, e, t)
});
class ls extends Gn {
  constructor(e, t, i, n) {
    super(e, t), Object.defineProperty(this, "encodeStreams", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "objectsPerStream", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.encodeStreams = i, this.objectsPerStream = n;
  }
  async computeBufferSize() {
    let e = this.context.largestObjectNumber + 1;
    const t = Vr.forVersion(1, 7);
    let i = t.sizeInBytes() + 2;
    const n = vr.create(this.createTrailerDict(), this.encodeStreams), a = [], s = [], o = [], l = this.context.enumerateIndirectObjects();
    for (let h = 0, d = l.length; h < d; h++) {
      const b = l[h], [p, m] = b;
      if (p === this.context.trailerInfo.Encrypt || m instanceof Ze || m instanceof Yr || p.generationNumber !== 0)
        a.push(b), n.addUncompressedEntry(p, i), i += this.computeIndirectObjectSize(b), this.shouldWaitForTick(1) && await Hr();
      else {
        let S = jn(s), y = jn(o);
        (!S || S.length % this.objectsPerStream === 0) && (S = [], s.push(S), y = te.of(e++), o.push(y)), n.addCompressedEntry(p, y, S.length), S.push(b);
      }
    }
    for (let h = 0, d = s.length; h < d; h++) {
      const b = s[h], p = o[h], m = Xr.withContextAndObjects(this.context, b, this.encodeStreams);
      n.addUncompressedEntry(p, i), i += this.computeIndirectObjectSize([p, m]), a.push([p, m]), this.shouldWaitForTick(b.length) && await Hr();
    }
    const c = te.of(e++);
    n.dict.set(x.of("Size"), q.of(e)), n.addUncompressedEntry(c, i);
    const u = i;
    i += this.computeIndirectObjectSize([c, n]), a.push([c, n]);
    const f = Ii.forLastCrossRefSectionOffset(u);
    return i += f.sizeInBytes(), { size: i, header: t, indirectObjects: a, trailer: f };
  }
}
Object.defineProperty(ls, "forContext", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e, t = !0, i = 50) => new ls(r, e, t, i)
});
class z extends bt {
  constructor(e) {
    super(), Object.defineProperty(this, "value", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.value = e;
  }
  asBytes() {
    const e = this.value + (this.value.length % 2 === 1 ? "0" : ""), t = e.length, i = new Uint8Array(e.length / 2);
    let n = 0, a = 0;
    for (; n < t; ) {
      const s = parseInt(e.substring(n, n + 2), 16);
      i[a] = s, n += 2, a += 1;
    }
    return i;
  }
  decodeText() {
    const e = this.asBytes();
    return yc(e) ? wc(e) : vc(e);
  }
  decodeDate() {
    const e = this.decodeText(), t = oc(e);
    if (!t)
      throw new cc(e);
    return t;
  }
  asString() {
    return this.value;
  }
  clone() {
    return z.of(this.value);
  }
  toString() {
    return `<${this.value}>`;
  }
  sizeInBytes() {
    return this.value.length + 2;
  }
  copyBytesInto(e, t) {
    return e[t++] = w.LessThan, t += We(this.value, e, t), e[t++] = w.GreaterThan, this.value.length + 2;
  }
}
Object.defineProperty(z, "of", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => new z(r)
});
Object.defineProperty(z, "fromText", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => {
    const e = Ru(r);
    let t = "";
    for (let i = 0, n = e.length; i < n; i++)
      t += la(e[i], 4);
    return new z(t);
  }
});
class Jr {
  constructor(e, t) {
    Object.defineProperty(this, "font", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "encoding", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "fontName", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "customName", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.encoding = e === Yc.ZapfDingbats ? Ra.ZapfDingbats : e === Yc.Symbol ? Ra.Symbol : Ra.WinAnsi, this.font = Kh.load(e), this.fontName = this.font.FontName, this.customName = t;
  }
  /**
   * Encode the JavaScript string into this font. (JavaScript encodes strings in
   * Unicode, but standard fonts use either WinAnsi, ZapfDingbats, or Symbol
   * encodings)
   */
  encodeText(e) {
    const t = this.encodeTextAsGlyphs(e), i = new Array(t.length);
    for (let n = 0, a = t.length; n < a; n++)
      i[n] = ca(t[n].code);
    return z.of(i.join(""));
  }
  widthOfTextAtSize(e, t) {
    const i = this.encodeTextAsGlyphs(e);
    let n = 0;
    for (let s = 0, o = i.length; s < o; s++) {
      const l = i[s].name, c = (i[s + 1] || {}).name, u = this.font.getXAxisKerningForPair(l, c) || 0;
      n += this.widthOfGlyph(l) + u;
    }
    const a = t / 1e3;
    return n * a;
  }
  heightOfFontAtSize(e, t = {}) {
    const { descender: i = !0 } = t, { Ascender: n, Descender: a, FontBBox: s } = this.font, o = n || s[3], l = a || s[1];
    let c = o - l;
    return i || (c += a || 0), c / 1e3 * e;
  }
  sizeOfFontAtHeight(e) {
    const { Ascender: t, Descender: i, FontBBox: n } = this.font, a = t || n[3], s = i || n[1];
    return 1e3 * e / (a - s);
  }
  embedIntoContext(e, t) {
    const i = e.obj({
      Type: "Font",
      Subtype: "Type1",
      BaseFont: this.customName || this.fontName,
      Encoding: this.encoding === Ra.WinAnsi ? "WinAnsiEncoding" : void 0
    });
    return t ? (e.assign(t, i), t) : e.register(i);
  }
  widthOfGlyph(e) {
    return this.font.getWidthOfGlyph(e) || 250;
  }
  encodeTextAsGlyphs(e) {
    const t = Array.from(e), i = new Array(t.length);
    for (let n = 0, a = t.length; n < a; n++) {
      const s = X0(t[n]);
      i[n] = this.encoding.encodeUnicodeCodePoint(s);
    }
    return i;
  }
}
Object.defineProperty(Jr, "for", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e) => new Jr(r, e)
});
const Jg = (r, e) => {
  const t = new Array(r.length);
  for (let i = 0, n = r.length; i < n; i++) {
    const a = r[i], s = Hl(Xa(e(a))), o = Hl(...a.codePoints.map(e1));
    t[i] = [s, o];
  }
  return Qg(t);
}, Qg = (r) => `/CIDInit /ProcSet findresource begin
12 dict begin
begincmap
/CIDSystemInfo <<
  /Registry (Adobe)
  /Ordering (UCS)
  /Supplement 0
>> def
/CMapName /Adobe-Identity-UCS def
/CMapType 2 def
1 begincodespacerange
<0000><ffff>
endcodespacerange
${r.length} beginbfchar
${r.map(([e, t]) => `${e} ${t}`).join(`
`)}
endbfchar
endcmap
CMapName currentdict /CMap defineresource pop
end
end`, Hl = (...r) => `<${r.join("")}>`, Xa = (r) => la(r, 4), e1 = (r) => {
  if (Bu(r))
    return Xa(r);
  if (Nu(r)) {
    const i = pc(r), n = mc(r);
    return `${Xa(i)}${Xa(n)}`;
  }
  const t = `0x${ca(r)} is not a valid UTF-8 or UTF-16 codepoint.`;
  throw new Error(t);
}, t1 = (r) => {
  let e = 0;
  const t = (i) => {
    e |= 1 << i - 1;
  };
  return r.fixedPitch && t(1), r.serif && t(2), t(3), r.script && t(4), r.nonsymbolic && t(6), r.italic && t(7), r.allCap && t(17), r.smallCap && t(18), r.forceBold && t(19), e;
}, r1 = (r) => {
  const e = r["OS/2"] ? r["OS/2"].sFamilyClass : 0;
  return t1({
    fixedPitch: r.post.isFixedPitch,
    serif: 1 <= e && e <= 7,
    script: e === 10,
    italic: r.head.macStyle.italic
  });
};
class G extends bt {
  constructor(e) {
    super(), Object.defineProperty(this, "value", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.value = e;
  }
  asBytes() {
    const e = [];
    let t = "", i = !1;
    const n = (a) => {
      a !== void 0 && e.push(a), i = !1;
    };
    for (let a = 0, s = this.value.length; a < s; a++) {
      const o = this.value[a], l = Z(o), c = this.value[a + 1];
      i ? l === w.Newline || l === w.CarriageReturn ? n() : l === w.n ? n(w.Newline) : l === w.r ? n(w.CarriageReturn) : l === w.t ? n(w.Tab) : l === w.b ? n(w.Backspace) : l === w.f ? n(w.FormFeed) : l === w.LeftParen ? n(w.LeftParen) : l === w.RightParen ? n(w.RightParen) : l === w.Backspace ? n(w.BackSlash) : l >= w.Zero && l <= w.Seven ? (t += o, (t.length === 3 || !(c >= "0" && c <= "7")) && (n(parseInt(t, 8)), t = "")) : n(l) : l === w.BackSlash ? i = !0 : n(l);
    }
    return new Uint8Array(e);
  }
  decodeText() {
    const e = this.asBytes();
    return yc(e) ? wc(e) : vc(e);
  }
  decodeDate() {
    const e = this.decodeText(), t = oc(e);
    if (!t)
      throw new cc(e);
    return t;
  }
  asString() {
    return this.value;
  }
  clone() {
    return G.of(this.value);
  }
  toString() {
    return `(${this.value})`;
  }
  sizeInBytes() {
    return this.value.length + 2;
  }
  copyBytesInto(e, t) {
    return e[t++] = w.LeftParen, t += We(this.value, e, t), e[t++] = w.RightParen, this.value.length + 2;
  }
}
Object.defineProperty(G, "of", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => new G(r)
});
Object.defineProperty(G, "fromDate", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => {
    const e = ut(String(r.getUTCFullYear()), 4, "0"), t = ut(String(r.getUTCMonth() + 1), 2, "0"), i = ut(String(r.getUTCDate()), 2, "0"), n = ut(String(r.getUTCHours()), 2, "0"), a = ut(String(r.getUTCMinutes()), 2, "0"), s = ut(String(r.getUTCSeconds()), 2, "0");
    return new G(`D:${e}${t}${i}${n}${a}${s}Z`);
  }
});
class Gi {
  static async for(e, t, i, n) {
    const a = await e.create(t);
    return new Gi(a, t, i, n);
  }
  constructor(e, t, i, n) {
    Object.defineProperty(this, "font", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "scale", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "fontData", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "fontName", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "customName", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "fontFeatures", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "baseFontName", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "glyphCache", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "allGlyphsInFontSortedById", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: () => {
        const a = new Array(this.font.characterSet.length);
        for (let s = 0, o = a.length; s < o; s++) {
          const l = this.font.characterSet[s];
          a[s] = this.font.glyphForCodePoint(l);
        }
        return Y0(a.sort(J0), (s) => s.id);
      }
    }), this.font = e, this.scale = 1e3 / this.font.unitsPerEm, this.fontData = t, this.fontName = this.font.postscriptName || "Font", this.customName = i, this.fontFeatures = n, this.baseFontName = "", this.glyphCache = it.populatedBy(this.allGlyphsInFontSortedById);
  }
  /**
   * Encode the JavaScript string into this font. (JavaScript encodes strings in
   * Unicode, but embedded fonts use their own custom encodings)
   */
  encodeText(e) {
    const { glyphs: t } = this.font.layout(e, this.fontFeatures), i = new Array(t.length);
    for (let n = 0, a = t.length; n < a; n++)
      i[n] = la(t[n].id, 4);
    return z.of(i.join(""));
  }
  // The advanceWidth takes into account kerning automatically, so we don't
  // have to do that manually like we do for the standard fonts.
  widthOfTextAtSize(e, t) {
    const { glyphs: i } = this.font.layout(e, this.fontFeatures);
    let n = 0;
    for (let s = 0, o = i.length; s < o; s++)
      n += i[s].advanceWidth * this.scale;
    const a = t / 1e3;
    return n * a;
  }
  heightOfFontAtSize(e, t = {}) {
    const { descender: i = !0 } = t, { ascent: n, descent: a, bbox: s } = this.font, o = (n || s.maxY) * this.scale, l = (a || s.minY) * this.scale;
    let c = o - l;
    return i || (c -= Math.abs(a) || 0), c / 1e3 * e;
  }
  sizeOfFontAtHeight(e) {
    const { ascent: t, descent: i, bbox: n } = this.font, a = (t || n.maxY) * this.scale, s = (i || n.minY) * this.scale;
    return 1e3 * e / (a - s);
  }
  embedIntoContext(e, t) {
    return this.baseFontName = this.customName || e.addRandomSuffix(this.fontName), this.embedFontDict(e, t);
  }
  async embedFontDict(e, t) {
    const i = await this.embedCIDFontDict(e), n = this.embedUnicodeCmap(e), a = e.obj({
      Type: "Font",
      Subtype: "Type0",
      BaseFont: this.baseFontName,
      Encoding: "Identity-H",
      DescendantFonts: [i],
      ToUnicode: n
    });
    return t ? (e.assign(t, a), t) : e.register(a);
  }
  isCFF() {
    return this.font.cff;
  }
  async embedCIDFontDict(e) {
    const t = await this.embedFontDescriptor(e), i = e.obj({
      Type: "Font",
      Subtype: this.isCFF() ? "CIDFontType0" : "CIDFontType2",
      CIDToGIDMap: "Identity",
      BaseFont: this.baseFontName,
      CIDSystemInfo: {
        Registry: G.of("Adobe"),
        Ordering: G.of("Identity"),
        Supplement: 0
      },
      FontDescriptor: t,
      W: this.computeWidths()
    });
    return e.register(i);
  }
  async embedFontDescriptor(e) {
    const t = await this.embedFontStream(e), { scale: i } = this, { italicAngle: n, ascent: a, descent: s, capHeight: o, xHeight: l } = this.font, { minX: c, minY: u, maxX: f, maxY: h } = this.font.bbox, d = e.obj({
      Type: "FontDescriptor",
      FontName: this.baseFontName,
      Flags: r1(this.font),
      FontBBox: [c * i, u * i, f * i, h * i],
      ItalicAngle: n,
      Ascent: a * i,
      Descent: s * i,
      CapHeight: (o || a) * i,
      XHeight: (l || 0) * i,
      // Not sure how to compute/find this, nor is anybody else really:
      // https://stackoverflow.com/questions/35485179/stemv-value-of-the-truetype-font
      StemV: 0,
      [this.isCFF() ? "FontFile3" : "FontFile2"]: t
    });
    return e.register(d);
  }
  async serializeFont() {
    return this.fontData;
  }
  async embedFontStream(e) {
    const t = e.flateStream(await this.serializeFont(), {
      Subtype: this.isCFF() ? "CIDFontType0C" : void 0
    });
    return e.register(t);
  }
  embedUnicodeCmap(e) {
    const t = Jg(this.glyphCache.access(), this.glyphId.bind(this)), i = e.flateStream(t);
    return e.register(i);
  }
  glyphId(e) {
    return e ? e.id : -1;
  }
  computeWidths() {
    const e = this.glyphCache.access(), t = [];
    let i = [];
    for (let n = 0, a = e.length; n < a; n++) {
      const s = e[n], o = e[n - 1], l = this.glyphId(s), c = this.glyphId(o);
      n === 0 ? t.push(l) : l - c !== 1 && (t.push(i), t.push(l), i = []), i.push(s.advanceWidth * this.scale);
    }
    return t.push(i), t;
  }
}
class Ls extends Gi {
  static async for(e, t, i, n) {
    const a = await e.create(t);
    return new Ls(a, t, i, n);
  }
  constructor(e, t, i, n) {
    super(e, t, i, n), Object.defineProperty(this, "subset", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "glyphs", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "glyphIdMap", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.subset = this.font.createSubset(), this.glyphs = [], this.glyphCache = it.populatedBy(() => this.glyphs), this.glyphIdMap = /* @__PURE__ */ new Map();
  }
  encodeText(e) {
    const { glyphs: t } = this.font.layout(e, this.fontFeatures), i = new Array(t.length);
    for (let n = 0, a = t.length; n < a; n++) {
      const s = t[n], o = this.subset.includeGlyph(s);
      this.glyphs[o - 1] = s, this.glyphIdMap.set(s.id, o), i[n] = la(o, 4);
    }
    return this.glyphCache.invalidate(), z.of(i.join(""));
  }
  isCFF() {
    return this.subset.cff;
  }
  glyphId(e) {
    return e ? this.glyphIdMap.get(e.id) : -1;
  }
  serializeFont() {
    return new Promise((e, t) => {
      if ("encodeStream" in this.subset) {
        const i = [];
        this.subset.encodeStream().on("data", (n) => i.push(n)).on("end", () => e(Q0(i))).on("error", (n) => t(n));
      } else if ("encode" in this.subset)
        try {
          e(this.subset.encode());
        } catch (i) {
          t(i);
        }
      else
        t(new Error("Subset does not have an encode method"));
    });
  }
}
var us;
(function(r) {
  r.Source = "Source", r.Data = "Data", r.Alternative = "Alternative", r.Supplement = "Supplement", r.EncryptedPayload = "EncryptedPayload", r.FormData = "EncryptedPayload", r.Schema = "Schema", r.Unspecified = "Unspecified";
})(us || (us = {}));
class Ms {
  static for(e, t, i = {}) {
    return new Ms(e, t, i);
  }
  constructor(e, t, i = {}) {
    Object.defineProperty(this, "fileData", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "fileName", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "options", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.fileData = e, this.fileName = t, this.options = i;
  }
  async embedIntoContext(e, t) {
    const { mimeType: i, description: n, creationDate: a, modificationDate: s, afRelationship: o } = this.options, l = e.flateStream(this.fileData, {
      Type: "EmbeddedFile",
      Subtype: i ?? void 0,
      Params: {
        Size: this.fileData.length,
        CreationDate: a ? G.fromDate(a) : void 0,
        ModDate: s ? G.fromDate(s) : void 0
      }
    }), c = e.register(l), u = e.obj({
      Type: "Filespec",
      F: G.of(this.fileName),
      // TODO: Assert that this is plain ASCII
      UF: z.fromText(this.fileName),
      EF: { F: c },
      Desc: n ? z.fromText(n) : void 0,
      AFRelationship: o ?? void 0
    });
    return t ? (e.assign(t, u), t) : e.register(u);
  }
}
const ql = [
  65472,
  65473,
  65474,
  65475,
  65477,
  65478,
  65479,
  65480,
  65481,
  65482,
  65483,
  65484,
  65485,
  65486,
  65487
];
var Ai;
(function(r) {
  r.DeviceGray = "DeviceGray", r.DeviceRGB = "DeviceRGB", r.DeviceCMYK = "DeviceCMYK";
})(Ai || (Ai = {}));
const i1 = {
  1: Ai.DeviceGray,
  3: Ai.DeviceRGB,
  4: Ai.DeviceCMYK
};
class va {
  static async for(e) {
    const t = new DataView(e.buffer);
    if (t.getUint16(0) !== 65496)
      throw new Error("SOI not found in JPEG");
    let n = 2, a;
    for (; n < t.byteLength && (a = t.getUint16(n), n += 2, !ql.includes(a)); )
      n += t.getUint16(n);
    if (!ql.includes(a))
      throw new Error("Invalid JPEG");
    n += 2;
    const s = t.getUint8(n++), o = t.getUint16(n);
    n += 2;
    const l = t.getUint16(n);
    n += 2;
    const c = t.getUint8(n++), u = i1[c];
    if (!u)
      throw new Error("Unknown JPEG channel.");
    const f = u;
    return new va(e, s, l, o, f);
  }
  constructor(e, t, i, n, a) {
    Object.defineProperty(this, "bitsPerComponent", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "height", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "width", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "colorSpace", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "imageData", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.imageData = e, this.bitsPerComponent = t, this.width = i, this.height = n, this.colorSpace = a;
  }
  async embedIntoContext(e, t) {
    const i = e.stream(this.imageData, {
      Type: "XObject",
      Subtype: "Image",
      BitsPerComponent: this.bitsPerComponent,
      Width: this.width,
      Height: this.height,
      ColorSpace: this.colorSpace,
      Filter: "DCTDecode",
      // CMYK JPEG streams in PDF are typically stored complemented,
      // with 1 as 'off' and 0 as 'on' (PDF 32000-1:2008, 8.6.4.4).
      //
      // Standalone CMYK JPEG (usually exported by Photoshop) are
      // stored inverse, with 0 as 'off' and 1 as 'on', like RGB.
      //
      // Applying a swap here as a hedge that most bytes passing
      // through this method will benefit from it.
      Decode: this.colorSpace === Ai.DeviceCMYK ? [1, 0, 1, 0, 1, 0, 1, 0] : void 0
    });
    return t ? (e.assign(t, i), t) : e.register(i);
  }
}
var Jt = {};
(function(r) {
  var e = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
  function t(a, s) {
    return Object.prototype.hasOwnProperty.call(a, s);
  }
  r.assign = function(a) {
    for (var s = Array.prototype.slice.call(arguments, 1); s.length; ) {
      var o = s.shift();
      if (o) {
        if (typeof o != "object")
          throw new TypeError(o + "must be non-object");
        for (var l in o)
          t(o, l) && (a[l] = o[l]);
      }
    }
    return a;
  }, r.shrinkBuf = function(a, s) {
    return a.length === s ? a : a.subarray ? a.subarray(0, s) : (a.length = s, a);
  };
  var i = {
    arraySet: function(a, s, o, l, c) {
      if (s.subarray && a.subarray) {
        a.set(s.subarray(o, o + l), c);
        return;
      }
      for (var u = 0; u < l; u++)
        a[c + u] = s[o + u];
    },
    // Join array of chunks to single array.
    flattenChunks: function(a) {
      var s, o, l, c, u, f;
      for (l = 0, s = 0, o = a.length; s < o; s++)
        l += a[s].length;
      for (f = new Uint8Array(l), c = 0, s = 0, o = a.length; s < o; s++)
        u = a[s], f.set(u, c), c += u.length;
      return f;
    }
  }, n = {
    arraySet: function(a, s, o, l, c) {
      for (var u = 0; u < l; u++)
        a[c + u] = s[o + u];
    },
    // Join array of chunks to single array.
    flattenChunks: function(a) {
      return [].concat.apply([], a);
    }
  };
  r.setTyped = function(a) {
    a ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, i)) : (r.Buf8 = Array, r.Buf16 = Array, r.Buf32 = Array, r.assign(r, n));
  }, r.setTyped(e);
})(Jt);
var _a = {}, Tt = {}, Xi = {}, n1 = Jt, a1 = 4, Zl = 0, Kl = 1, s1 = 2;
function Yi(r) {
  for (var e = r.length; --e >= 0; )
    r[e] = 0;
}
var o1 = 0, vd = 1, c1 = 2, l1 = 3, u1 = 258, Dc = 29, ka = 256, Xn = ka + 1 + Dc, Ci = 30, Ec = 19, _d = 2 * Xn + 1, jr = 15, ho = 16, d1 = 7, Tc = 256, kd = 16, Sd = 17, Ad = 18, Zo = (
  /* extra bits for each length code */
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]
), Ya = (
  /* extra bits for each distance code */
  [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]
), h1 = (
  /* extra bits for each bit length code */
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]
), Cd = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], f1 = 512, zt = new Array((Xn + 2) * 2);
Yi(zt);
var Fn = new Array(Ci * 2);
Yi(Fn);
var Yn = new Array(f1);
Yi(Yn);
var Jn = new Array(u1 - l1 + 1);
Yi(Jn);
var Rc = new Array(Dc);
Yi(Rc);
var ds = new Array(Ci);
Yi(ds);
function fo(r, e, t, i, n) {
  this.static_tree = r, this.extra_bits = e, this.extra_base = t, this.elems = i, this.max_length = n, this.has_stree = r && r.length;
}
var Fd, Od, Pd;
function bo(r, e) {
  this.dyn_tree = r, this.max_code = 0, this.stat_desc = e;
}
function Dd(r) {
  return r < 256 ? Yn[r] : Yn[256 + (r >>> 7)];
}
function Qn(r, e) {
  r.pending_buf[r.pending++] = e & 255, r.pending_buf[r.pending++] = e >>> 8 & 255;
}
function qe(r, e, t) {
  r.bi_valid > ho - t ? (r.bi_buf |= e << r.bi_valid & 65535, Qn(r, r.bi_buf), r.bi_buf = e >> ho - r.bi_valid, r.bi_valid += t - ho) : (r.bi_buf |= e << r.bi_valid & 65535, r.bi_valid += t);
}
function _t(r, e, t) {
  qe(
    r,
    t[e * 2],
    t[e * 2 + 1]
    /*.Len*/
  );
}
function Ed(r, e) {
  var t = 0;
  do
    t |= r & 1, r >>>= 1, t <<= 1;
  while (--e > 0);
  return t >>> 1;
}
function b1(r) {
  r.bi_valid === 16 ? (Qn(r, r.bi_buf), r.bi_buf = 0, r.bi_valid = 0) : r.bi_valid >= 8 && (r.pending_buf[r.pending++] = r.bi_buf & 255, r.bi_buf >>= 8, r.bi_valid -= 8);
}
function x1(r, e) {
  var t = e.dyn_tree, i = e.max_code, n = e.stat_desc.static_tree, a = e.stat_desc.has_stree, s = e.stat_desc.extra_bits, o = e.stat_desc.extra_base, l = e.stat_desc.max_length, c, u, f, h, d, b, p = 0;
  for (h = 0; h <= jr; h++)
    r.bl_count[h] = 0;
  for (t[r.heap[r.heap_max] * 2 + 1] = 0, c = r.heap_max + 1; c < _d; c++)
    u = r.heap[c], h = t[t[u * 2 + 1] * 2 + 1] + 1, h > l && (h = l, p++), t[u * 2 + 1] = h, !(u > i) && (r.bl_count[h]++, d = 0, u >= o && (d = s[u - o]), b = t[u * 2], r.opt_len += b * (h + d), a && (r.static_len += b * (n[u * 2 + 1] + d)));
  if (p !== 0) {
    do {
      for (h = l - 1; r.bl_count[h] === 0; )
        h--;
      r.bl_count[h]--, r.bl_count[h + 1] += 2, r.bl_count[l]--, p -= 2;
    } while (p > 0);
    for (h = l; h !== 0; h--)
      for (u = r.bl_count[h]; u !== 0; )
        f = r.heap[--c], !(f > i) && (t[f * 2 + 1] !== h && (r.opt_len += (h - t[f * 2 + 1]) * t[f * 2], t[f * 2 + 1] = h), u--);
  }
}
function Td(r, e, t) {
  var i = new Array(jr + 1), n = 0, a, s;
  for (a = 1; a <= jr; a++)
    i[a] = n = n + t[a - 1] << 1;
  for (s = 0; s <= e; s++) {
    var o = r[s * 2 + 1];
    o !== 0 && (r[s * 2] = Ed(i[o]++, o));
  }
}
function g1() {
  var r, e, t, i, n, a = new Array(jr + 1);
  for (t = 0, i = 0; i < Dc - 1; i++)
    for (Rc[i] = t, r = 0; r < 1 << Zo[i]; r++)
      Jn[t++] = i;
  for (Jn[t - 1] = i, n = 0, i = 0; i < 16; i++)
    for (ds[i] = n, r = 0; r < 1 << Ya[i]; r++)
      Yn[n++] = i;
  for (n >>= 7; i < Ci; i++)
    for (ds[i] = n << 7, r = 0; r < 1 << Ya[i] - 7; r++)
      Yn[256 + n++] = i;
  for (e = 0; e <= jr; e++)
    a[e] = 0;
  for (r = 0; r <= 143; )
    zt[r * 2 + 1] = 8, r++, a[8]++;
  for (; r <= 255; )
    zt[r * 2 + 1] = 9, r++, a[9]++;
  for (; r <= 279; )
    zt[r * 2 + 1] = 7, r++, a[7]++;
  for (; r <= 287; )
    zt[r * 2 + 1] = 8, r++, a[8]++;
  for (Td(zt, Xn + 1, a), r = 0; r < Ci; r++)
    Fn[r * 2 + 1] = 5, Fn[r * 2] = Ed(r, 5);
  Fd = new fo(zt, Zo, ka + 1, Xn, jr), Od = new fo(Fn, Ya, 0, Ci, jr), Pd = new fo(new Array(0), h1, 0, Ec, d1);
}
function Rd(r) {
  var e;
  for (e = 0; e < Xn; e++)
    r.dyn_ltree[e * 2] = 0;
  for (e = 0; e < Ci; e++)
    r.dyn_dtree[e * 2] = 0;
  for (e = 0; e < Ec; e++)
    r.bl_tree[e * 2] = 0;
  r.dyn_ltree[Tc * 2] = 1, r.opt_len = r.static_len = 0, r.last_lit = r.matches = 0;
}
function Bd(r) {
  r.bi_valid > 8 ? Qn(r, r.bi_buf) : r.bi_valid > 0 && (r.pending_buf[r.pending++] = r.bi_buf), r.bi_buf = 0, r.bi_valid = 0;
}
function p1(r, e, t, i) {
  Bd(r), Qn(r, t), Qn(r, ~t), n1.arraySet(r.pending_buf, r.window, e, t, r.pending), r.pending += t;
}
function Vl(r, e, t, i) {
  var n = e * 2, a = t * 2;
  return r[n] < r[a] || r[n] === r[a] && i[e] <= i[t];
}
function xo(r, e, t) {
  for (var i = r.heap[t], n = t << 1; n <= r.heap_len && (n < r.heap_len && Vl(e, r.heap[n + 1], r.heap[n], r.depth) && n++, !Vl(e, i, r.heap[n], r.depth)); )
    r.heap[t] = r.heap[n], t = n, n <<= 1;
  r.heap[t] = i;
}
function Gl(r, e, t) {
  var i, n, a = 0, s, o;
  if (r.last_lit !== 0)
    do
      i = r.pending_buf[r.d_buf + a * 2] << 8 | r.pending_buf[r.d_buf + a * 2 + 1], n = r.pending_buf[r.l_buf + a], a++, i === 0 ? _t(r, n, e) : (s = Jn[n], _t(r, s + ka + 1, e), o = Zo[s], o !== 0 && (n -= Rc[s], qe(r, n, o)), i--, s = Dd(i), _t(r, s, t), o = Ya[s], o !== 0 && (i -= ds[s], qe(r, i, o)));
    while (a < r.last_lit);
  _t(r, Tc, e);
}
function Ko(r, e) {
  var t = e.dyn_tree, i = e.stat_desc.static_tree, n = e.stat_desc.has_stree, a = e.stat_desc.elems, s, o, l = -1, c;
  for (r.heap_len = 0, r.heap_max = _d, s = 0; s < a; s++)
    t[s * 2] !== 0 ? (r.heap[++r.heap_len] = l = s, r.depth[s] = 0) : t[s * 2 + 1] = 0;
  for (; r.heap_len < 2; )
    c = r.heap[++r.heap_len] = l < 2 ? ++l : 0, t[c * 2] = 1, r.depth[c] = 0, r.opt_len--, n && (r.static_len -= i[c * 2 + 1]);
  for (e.max_code = l, s = r.heap_len >> 1; s >= 1; s--)
    xo(r, t, s);
  c = a;
  do
    s = r.heap[
      1
      /*SMALLEST*/
    ], r.heap[
      1
      /*SMALLEST*/
    ] = r.heap[r.heap_len--], xo(
      r,
      t,
      1
      /*SMALLEST*/
    ), o = r.heap[
      1
      /*SMALLEST*/
    ], r.heap[--r.heap_max] = s, r.heap[--r.heap_max] = o, t[c * 2] = t[s * 2] + t[o * 2], r.depth[c] = (r.depth[s] >= r.depth[o] ? r.depth[s] : r.depth[o]) + 1, t[s * 2 + 1] = t[o * 2 + 1] = c, r.heap[
      1
      /*SMALLEST*/
    ] = c++, xo(
      r,
      t,
      1
      /*SMALLEST*/
    );
  while (r.heap_len >= 2);
  r.heap[--r.heap_max] = r.heap[
    1
    /*SMALLEST*/
  ], x1(r, e), Td(t, l, r.bl_count);
}
function Xl(r, e, t) {
  var i, n = -1, a, s = e[0 * 2 + 1], o = 0, l = 7, c = 4;
  for (s === 0 && (l = 138, c = 3), e[(t + 1) * 2 + 1] = 65535, i = 0; i <= t; i++)
    a = s, s = e[(i + 1) * 2 + 1], !(++o < l && a === s) && (o < c ? r.bl_tree[a * 2] += o : a !== 0 ? (a !== n && r.bl_tree[a * 2]++, r.bl_tree[kd * 2]++) : o <= 10 ? r.bl_tree[Sd * 2]++ : r.bl_tree[Ad * 2]++, o = 0, n = a, s === 0 ? (l = 138, c = 3) : a === s ? (l = 6, c = 3) : (l = 7, c = 4));
}
function Yl(r, e, t) {
  var i, n = -1, a, s = e[0 * 2 + 1], o = 0, l = 7, c = 4;
  for (s === 0 && (l = 138, c = 3), i = 0; i <= t; i++)
    if (a = s, s = e[(i + 1) * 2 + 1], !(++o < l && a === s)) {
      if (o < c)
        do
          _t(r, a, r.bl_tree);
        while (--o !== 0);
      else a !== 0 ? (a !== n && (_t(r, a, r.bl_tree), o--), _t(r, kd, r.bl_tree), qe(r, o - 3, 2)) : o <= 10 ? (_t(r, Sd, r.bl_tree), qe(r, o - 3, 3)) : (_t(r, Ad, r.bl_tree), qe(r, o - 11, 7));
      o = 0, n = a, s === 0 ? (l = 138, c = 3) : a === s ? (l = 6, c = 3) : (l = 7, c = 4);
    }
}
function m1(r) {
  var e;
  for (Xl(r, r.dyn_ltree, r.l_desc.max_code), Xl(r, r.dyn_dtree, r.d_desc.max_code), Ko(r, r.bl_desc), e = Ec - 1; e >= 3 && r.bl_tree[Cd[e] * 2 + 1] === 0; e--)
    ;
  return r.opt_len += 3 * (e + 1) + 5 + 5 + 4, e;
}
function w1(r, e, t, i) {
  var n;
  for (qe(r, e - 257, 5), qe(r, t - 1, 5), qe(r, i - 4, 4), n = 0; n < i; n++)
    qe(r, r.bl_tree[Cd[n] * 2 + 1], 3);
  Yl(r, r.dyn_ltree, e - 1), Yl(r, r.dyn_dtree, t - 1);
}
function y1(r) {
  var e = 4093624447, t;
  for (t = 0; t <= 31; t++, e >>>= 1)
    if (e & 1 && r.dyn_ltree[t * 2] !== 0)
      return Zl;
  if (r.dyn_ltree[9 * 2] !== 0 || r.dyn_ltree[10 * 2] !== 0 || r.dyn_ltree[13 * 2] !== 0)
    return Kl;
  for (t = 32; t < ka; t++)
    if (r.dyn_ltree[t * 2] !== 0)
      return Kl;
  return Zl;
}
var Jl = !1;
function v1(r) {
  Jl || (g1(), Jl = !0), r.l_desc = new bo(r.dyn_ltree, Fd), r.d_desc = new bo(r.dyn_dtree, Od), r.bl_desc = new bo(r.bl_tree, Pd), r.bi_buf = 0, r.bi_valid = 0, Rd(r);
}
function Nd(r, e, t, i) {
  qe(r, (o1 << 1) + (i ? 1 : 0), 3), p1(r, e, t);
}
function _1(r) {
  qe(r, vd << 1, 3), _t(r, Tc, zt), b1(r);
}
function k1(r, e, t, i) {
  var n, a, s = 0;
  r.level > 0 ? (r.strm.data_type === s1 && (r.strm.data_type = y1(r)), Ko(r, r.l_desc), Ko(r, r.d_desc), s = m1(r), n = r.opt_len + 3 + 7 >>> 3, a = r.static_len + 3 + 7 >>> 3, a <= n && (n = a)) : n = a = t + 5, t + 4 <= n && e !== -1 ? Nd(r, e, t, i) : r.strategy === a1 || a === n ? (qe(r, (vd << 1) + (i ? 1 : 0), 3), Gl(r, zt, Fn)) : (qe(r, (c1 << 1) + (i ? 1 : 0), 3), w1(r, r.l_desc.max_code + 1, r.d_desc.max_code + 1, s + 1), Gl(r, r.dyn_ltree, r.dyn_dtree)), Rd(r), i && Bd(r);
}
function S1(r, e, t) {
  return r.pending_buf[r.d_buf + r.last_lit * 2] = e >>> 8 & 255, r.pending_buf[r.d_buf + r.last_lit * 2 + 1] = e & 255, r.pending_buf[r.l_buf + r.last_lit] = t & 255, r.last_lit++, e === 0 ? r.dyn_ltree[t * 2]++ : (r.matches++, e--, r.dyn_ltree[(Jn[t] + ka + 1) * 2]++, r.dyn_dtree[Dd(e) * 2]++), r.last_lit === r.lit_bufsize - 1;
}
Xi._tr_init = v1;
Xi._tr_stored_block = Nd;
Xi._tr_flush_block = k1;
Xi._tr_tally = S1;
Xi._tr_align = _1;
function A1(r, e, t, i) {
  for (var n = r & 65535 | 0, a = r >>> 16 & 65535 | 0, s = 0; t !== 0; ) {
    s = t > 2e3 ? 2e3 : t, t -= s;
    do
      n = n + e[i++] | 0, a = a + n | 0;
    while (--s);
    n %= 65521, a %= 65521;
  }
  return n | a << 16 | 0;
}
var jd = A1;
function C1() {
  for (var r, e = [], t = 0; t < 256; t++) {
    r = t;
    for (var i = 0; i < 8; i++)
      r = r & 1 ? 3988292384 ^ r >>> 1 : r >>> 1;
    e[t] = r;
  }
  return e;
}
var F1 = C1();
function O1(r, e, t, i) {
  var n = F1, a = i + t;
  r ^= -1;
  for (var s = i; s < a; s++)
    r = r >>> 8 ^ n[(r ^ e[s]) & 255];
  return r ^ -1;
}
var Id = O1, Bc = {
  2: "need dictionary",
  /* Z_NEED_DICT       2  */
  1: "stream end",
  /* Z_STREAM_END      1  */
  0: "",
  /* Z_OK              0  */
  "-1": "file error",
  /* Z_ERRNO         (-1) */
  "-2": "stream error",
  /* Z_STREAM_ERROR  (-2) */
  "-3": "data error",
  /* Z_DATA_ERROR    (-3) */
  "-4": "insufficient memory",
  /* Z_MEM_ERROR     (-4) */
  "-5": "buffer error",
  /* Z_BUF_ERROR     (-5) */
  "-6": "incompatible version"
  /* Z_VERSION_ERROR (-6) */
}, Me = Jt, nt = Xi, zd = jd, ir = Id, P1 = Bc, ui = 0, D1 = 1, E1 = 3, yr = 4, Ql = 5, kt = 0, e0 = 1, at = -2, T1 = -3, go = -5, R1 = -1, B1 = 1, La = 2, N1 = 3, j1 = 4, I1 = 0, z1 = 2, Us = 8, L1 = 9, M1 = 15, U1 = 8, $1 = 29, W1 = 256, Vo = W1 + 1 + $1, H1 = 30, q1 = 19, Z1 = 2 * Vo + 1, K1 = 15, Y = 3, dr = 258, ht = dr + Y + 1, V1 = 32, $s = 42, Go = 69, Ja = 73, Qa = 91, es = 103, Ir = 113, bn = 666, Ae = 1, Sa = 2, Qr = 3, Ji = 4, G1 = 3;
function hr(r, e) {
  return r.msg = P1[e], e;
}
function t0(r) {
  return (r << 1) - (r > 4 ? 9 : 0);
}
function cr(r) {
  for (var e = r.length; --e >= 0; )
    r[e] = 0;
}
function nr(r) {
  var e = r.state, t = e.pending;
  t > r.avail_out && (t = r.avail_out), t !== 0 && (Me.arraySet(r.output, e.pending_buf, e.pending_out, t, r.next_out), r.next_out += t, e.pending_out += t, r.total_out += t, r.avail_out -= t, e.pending -= t, e.pending === 0 && (e.pending_out = 0));
}
function Re(r, e) {
  nt._tr_flush_block(r, r.block_start >= 0 ? r.block_start : -1, r.strstart - r.block_start, e), r.block_start = r.strstart, nr(r.strm);
}
function ie(r, e) {
  r.pending_buf[r.pending++] = e;
}
function an(r, e) {
  r.pending_buf[r.pending++] = e >>> 8 & 255, r.pending_buf[r.pending++] = e & 255;
}
function X1(r, e, t, i) {
  var n = r.avail_in;
  return n > i && (n = i), n === 0 ? 0 : (r.avail_in -= n, Me.arraySet(e, r.input, r.next_in, n, t), r.state.wrap === 1 ? r.adler = zd(r.adler, e, n, t) : r.state.wrap === 2 && (r.adler = ir(r.adler, e, n, t)), r.next_in += n, r.total_in += n, n);
}
function Ld(r, e) {
  var t = r.max_chain_length, i = r.strstart, n, a, s = r.prev_length, o = r.nice_match, l = r.strstart > r.w_size - ht ? r.strstart - (r.w_size - ht) : 0, c = r.window, u = r.w_mask, f = r.prev, h = r.strstart + dr, d = c[i + s - 1], b = c[i + s];
  r.prev_length >= r.good_match && (t >>= 2), o > r.lookahead && (o = r.lookahead);
  do
    if (n = e, !(c[n + s] !== b || c[n + s - 1] !== d || c[n] !== c[i] || c[++n] !== c[i + 1])) {
      i += 2, n++;
      do
        ;
      while (c[++i] === c[++n] && c[++i] === c[++n] && c[++i] === c[++n] && c[++i] === c[++n] && c[++i] === c[++n] && c[++i] === c[++n] && c[++i] === c[++n] && c[++i] === c[++n] && i < h);
      if (a = dr - (h - i), i = h - dr, a > s) {
        if (r.match_start = e, s = a, a >= o)
          break;
        d = c[i + s - 1], b = c[i + s];
      }
    }
  while ((e = f[e & u]) > l && --t !== 0);
  return s <= r.lookahead ? s : r.lookahead;
}
function ei(r) {
  var e = r.w_size, t, i, n, a, s;
  do {
    if (a = r.window_size - r.lookahead - r.strstart, r.strstart >= e + (e - ht)) {
      Me.arraySet(r.window, r.window, e, e, 0), r.match_start -= e, r.strstart -= e, r.block_start -= e, i = r.hash_size, t = i;
      do
        n = r.head[--t], r.head[t] = n >= e ? n - e : 0;
      while (--i);
      i = e, t = i;
      do
        n = r.prev[--t], r.prev[t] = n >= e ? n - e : 0;
      while (--i);
      a += e;
    }
    if (r.strm.avail_in === 0)
      break;
    if (i = X1(r.strm, r.window, r.strstart + r.lookahead, a), r.lookahead += i, r.lookahead + r.insert >= Y)
      for (s = r.strstart - r.insert, r.ins_h = r.window[s], r.ins_h = (r.ins_h << r.hash_shift ^ r.window[s + 1]) & r.hash_mask; r.insert && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[s + Y - 1]) & r.hash_mask, r.prev[s & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = s, s++, r.insert--, !(r.lookahead + r.insert < Y)); )
        ;
  } while (r.lookahead < ht && r.strm.avail_in !== 0);
}
function Y1(r, e) {
  var t = 65535;
  for (t > r.pending_buf_size - 5 && (t = r.pending_buf_size - 5); ; ) {
    if (r.lookahead <= 1) {
      if (ei(r), r.lookahead === 0 && e === ui)
        return Ae;
      if (r.lookahead === 0)
        break;
    }
    r.strstart += r.lookahead, r.lookahead = 0;
    var i = r.block_start + t;
    if ((r.strstart === 0 || r.strstart >= i) && (r.lookahead = r.strstart - i, r.strstart = i, Re(r, !1), r.strm.avail_out === 0) || r.strstart - r.block_start >= r.w_size - ht && (Re(r, !1), r.strm.avail_out === 0))
      return Ae;
  }
  return r.insert = 0, e === yr ? (Re(r, !0), r.strm.avail_out === 0 ? Qr : Ji) : (r.strstart > r.block_start && (Re(r, !1), r.strm.avail_out === 0), Ae);
}
function po(r, e) {
  for (var t, i; ; ) {
    if (r.lookahead < ht) {
      if (ei(r), r.lookahead < ht && e === ui)
        return Ae;
      if (r.lookahead === 0)
        break;
    }
    if (t = 0, r.lookahead >= Y && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + Y - 1]) & r.hash_mask, t = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), t !== 0 && r.strstart - t <= r.w_size - ht && (r.match_length = Ld(r, t)), r.match_length >= Y)
      if (i = nt._tr_tally(r, r.strstart - r.match_start, r.match_length - Y), r.lookahead -= r.match_length, r.match_length <= r.max_lazy_match && r.lookahead >= Y) {
        r.match_length--;
        do
          r.strstart++, r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + Y - 1]) & r.hash_mask, t = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart;
        while (--r.match_length !== 0);
        r.strstart++;
      } else
        r.strstart += r.match_length, r.match_length = 0, r.ins_h = r.window[r.strstart], r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + 1]) & r.hash_mask;
    else
      i = nt._tr_tally(r, 0, r.window[r.strstart]), r.lookahead--, r.strstart++;
    if (i && (Re(r, !1), r.strm.avail_out === 0))
      return Ae;
  }
  return r.insert = r.strstart < Y - 1 ? r.strstart : Y - 1, e === yr ? (Re(r, !0), r.strm.avail_out === 0 ? Qr : Ji) : r.last_lit && (Re(r, !1), r.strm.avail_out === 0) ? Ae : Sa;
}
function xi(r, e) {
  for (var t, i, n; ; ) {
    if (r.lookahead < ht) {
      if (ei(r), r.lookahead < ht && e === ui)
        return Ae;
      if (r.lookahead === 0)
        break;
    }
    if (t = 0, r.lookahead >= Y && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + Y - 1]) & r.hash_mask, t = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), r.prev_length = r.match_length, r.prev_match = r.match_start, r.match_length = Y - 1, t !== 0 && r.prev_length < r.max_lazy_match && r.strstart - t <= r.w_size - ht && (r.match_length = Ld(r, t), r.match_length <= 5 && (r.strategy === B1 || r.match_length === Y && r.strstart - r.match_start > 4096) && (r.match_length = Y - 1)), r.prev_length >= Y && r.match_length <= r.prev_length) {
      n = r.strstart + r.lookahead - Y, i = nt._tr_tally(r, r.strstart - 1 - r.prev_match, r.prev_length - Y), r.lookahead -= r.prev_length - 1, r.prev_length -= 2;
      do
        ++r.strstart <= n && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + Y - 1]) & r.hash_mask, t = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart);
      while (--r.prev_length !== 0);
      if (r.match_available = 0, r.match_length = Y - 1, r.strstart++, i && (Re(r, !1), r.strm.avail_out === 0))
        return Ae;
    } else if (r.match_available) {
      if (i = nt._tr_tally(r, 0, r.window[r.strstart - 1]), i && Re(r, !1), r.strstart++, r.lookahead--, r.strm.avail_out === 0)
        return Ae;
    } else
      r.match_available = 1, r.strstart++, r.lookahead--;
  }
  return r.match_available && (i = nt._tr_tally(r, 0, r.window[r.strstart - 1]), r.match_available = 0), r.insert = r.strstart < Y - 1 ? r.strstart : Y - 1, e === yr ? (Re(r, !0), r.strm.avail_out === 0 ? Qr : Ji) : r.last_lit && (Re(r, !1), r.strm.avail_out === 0) ? Ae : Sa;
}
function J1(r, e) {
  for (var t, i, n, a, s = r.window; ; ) {
    if (r.lookahead <= dr) {
      if (ei(r), r.lookahead <= dr && e === ui)
        return Ae;
      if (r.lookahead === 0)
        break;
    }
    if (r.match_length = 0, r.lookahead >= Y && r.strstart > 0 && (n = r.strstart - 1, i = s[n], i === s[++n] && i === s[++n] && i === s[++n])) {
      a = r.strstart + dr;
      do
        ;
      while (i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && n < a);
      r.match_length = dr - (a - n), r.match_length > r.lookahead && (r.match_length = r.lookahead);
    }
    if (r.match_length >= Y ? (t = nt._tr_tally(r, 1, r.match_length - Y), r.lookahead -= r.match_length, r.strstart += r.match_length, r.match_length = 0) : (t = nt._tr_tally(r, 0, r.window[r.strstart]), r.lookahead--, r.strstart++), t && (Re(r, !1), r.strm.avail_out === 0))
      return Ae;
  }
  return r.insert = 0, e === yr ? (Re(r, !0), r.strm.avail_out === 0 ? Qr : Ji) : r.last_lit && (Re(r, !1), r.strm.avail_out === 0) ? Ae : Sa;
}
function Q1(r, e) {
  for (var t; ; ) {
    if (r.lookahead === 0 && (ei(r), r.lookahead === 0)) {
      if (e === ui)
        return Ae;
      break;
    }
    if (r.match_length = 0, t = nt._tr_tally(r, 0, r.window[r.strstart]), r.lookahead--, r.strstart++, t && (Re(r, !1), r.strm.avail_out === 0))
      return Ae;
  }
  return r.insert = 0, e === yr ? (Re(r, !0), r.strm.avail_out === 0 ? Qr : Ji) : r.last_lit && (Re(r, !1), r.strm.avail_out === 0) ? Ae : Sa;
}
function pt(r, e, t, i, n) {
  this.good_length = r, this.max_lazy = e, this.nice_length = t, this.max_chain = i, this.func = n;
}
var _i;
_i = [
  /*      good lazy nice chain */
  new pt(0, 0, 0, 0, Y1),
  /* 0 store only */
  new pt(4, 4, 8, 4, po),
  /* 1 max speed, no lazy matches */
  new pt(4, 5, 16, 8, po),
  /* 2 */
  new pt(4, 6, 32, 32, po),
  /* 3 */
  new pt(4, 4, 16, 16, xi),
  /* 4 lazy matches */
  new pt(8, 16, 32, 32, xi),
  /* 5 */
  new pt(8, 16, 128, 128, xi),
  /* 6 */
  new pt(8, 32, 128, 256, xi),
  /* 7 */
  new pt(32, 128, 258, 1024, xi),
  /* 8 */
  new pt(32, 258, 258, 4096, xi)
  /* 9 max compression */
];
function ep(r) {
  r.window_size = 2 * r.w_size, cr(r.head), r.max_lazy_match = _i[r.level].max_lazy, r.good_match = _i[r.level].good_length, r.nice_match = _i[r.level].nice_length, r.max_chain_length = _i[r.level].max_chain, r.strstart = 0, r.block_start = 0, r.lookahead = 0, r.insert = 0, r.match_length = r.prev_length = Y - 1, r.match_available = 0, r.ins_h = 0;
}
function tp() {
  this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = Us, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new Me.Buf16(Z1 * 2), this.dyn_dtree = new Me.Buf16((2 * H1 + 1) * 2), this.bl_tree = new Me.Buf16((2 * q1 + 1) * 2), cr(this.dyn_ltree), cr(this.dyn_dtree), cr(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new Me.Buf16(K1 + 1), this.heap = new Me.Buf16(2 * Vo + 1), cr(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new Me.Buf16(2 * Vo + 1), cr(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
}
function Md(r) {
  var e;
  return !r || !r.state ? hr(r, at) : (r.total_in = r.total_out = 0, r.data_type = z1, e = r.state, e.pending = 0, e.pending_out = 0, e.wrap < 0 && (e.wrap = -e.wrap), e.status = e.wrap ? $s : Ir, r.adler = e.wrap === 2 ? 0 : 1, e.last_flush = ui, nt._tr_init(e), kt);
}
function Ud(r) {
  var e = Md(r);
  return e === kt && ep(r.state), e;
}
function rp(r, e) {
  return !r || !r.state || r.state.wrap !== 2 ? at : (r.state.gzhead = e, kt);
}
function $d(r, e, t, i, n, a) {
  if (!r)
    return at;
  var s = 1;
  if (e === R1 && (e = 6), i < 0 ? (s = 0, i = -i) : i > 15 && (s = 2, i -= 16), n < 1 || n > L1 || t !== Us || i < 8 || i > 15 || e < 0 || e > 9 || a < 0 || a > j1)
    return hr(r, at);
  i === 8 && (i = 9);
  var o = new tp();
  return r.state = o, o.strm = r, o.wrap = s, o.gzhead = null, o.w_bits = i, o.w_size = 1 << o.w_bits, o.w_mask = o.w_size - 1, o.hash_bits = n + 7, o.hash_size = 1 << o.hash_bits, o.hash_mask = o.hash_size - 1, o.hash_shift = ~~((o.hash_bits + Y - 1) / Y), o.window = new Me.Buf8(o.w_size * 2), o.head = new Me.Buf16(o.hash_size), o.prev = new Me.Buf16(o.w_size), o.lit_bufsize = 1 << n + 6, o.pending_buf_size = o.lit_bufsize * 4, o.pending_buf = new Me.Buf8(o.pending_buf_size), o.d_buf = 1 * o.lit_bufsize, o.l_buf = 3 * o.lit_bufsize, o.level = e, o.strategy = a, o.method = t, Ud(r);
}
function ip(r, e) {
  return $d(r, e, Us, M1, U1, I1);
}
function np(r, e) {
  var t, i, n, a;
  if (!r || !r.state || e > Ql || e < 0)
    return r ? hr(r, at) : at;
  if (i = r.state, !r.output || !r.input && r.avail_in !== 0 || i.status === bn && e !== yr)
    return hr(r, r.avail_out === 0 ? go : at);
  if (i.strm = r, t = i.last_flush, i.last_flush = e, i.status === $s)
    if (i.wrap === 2)
      r.adler = 0, ie(i, 31), ie(i, 139), ie(i, 8), i.gzhead ? (ie(
        i,
        (i.gzhead.text ? 1 : 0) + (i.gzhead.hcrc ? 2 : 0) + (i.gzhead.extra ? 4 : 0) + (i.gzhead.name ? 8 : 0) + (i.gzhead.comment ? 16 : 0)
      ), ie(i, i.gzhead.time & 255), ie(i, i.gzhead.time >> 8 & 255), ie(i, i.gzhead.time >> 16 & 255), ie(i, i.gzhead.time >> 24 & 255), ie(i, i.level === 9 ? 2 : i.strategy >= La || i.level < 2 ? 4 : 0), ie(i, i.gzhead.os & 255), i.gzhead.extra && i.gzhead.extra.length && (ie(i, i.gzhead.extra.length & 255), ie(i, i.gzhead.extra.length >> 8 & 255)), i.gzhead.hcrc && (r.adler = ir(r.adler, i.pending_buf, i.pending, 0)), i.gzindex = 0, i.status = Go) : (ie(i, 0), ie(i, 0), ie(i, 0), ie(i, 0), ie(i, 0), ie(i, i.level === 9 ? 2 : i.strategy >= La || i.level < 2 ? 4 : 0), ie(i, G1), i.status = Ir);
    else {
      var s = Us + (i.w_bits - 8 << 4) << 8, o = -1;
      i.strategy >= La || i.level < 2 ? o = 0 : i.level < 6 ? o = 1 : i.level === 6 ? o = 2 : o = 3, s |= o << 6, i.strstart !== 0 && (s |= V1), s += 31 - s % 31, i.status = Ir, an(i, s), i.strstart !== 0 && (an(i, r.adler >>> 16), an(i, r.adler & 65535)), r.adler = 1;
    }
  if (i.status === Go)
    if (i.gzhead.extra) {
      for (n = i.pending; i.gzindex < (i.gzhead.extra.length & 65535) && !(i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > n && (r.adler = ir(r.adler, i.pending_buf, i.pending - n, n)), nr(r), n = i.pending, i.pending === i.pending_buf_size)); )
        ie(i, i.gzhead.extra[i.gzindex] & 255), i.gzindex++;
      i.gzhead.hcrc && i.pending > n && (r.adler = ir(r.adler, i.pending_buf, i.pending - n, n)), i.gzindex === i.gzhead.extra.length && (i.gzindex = 0, i.status = Ja);
    } else
      i.status = Ja;
  if (i.status === Ja)
    if (i.gzhead.name) {
      n = i.pending;
      do {
        if (i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > n && (r.adler = ir(r.adler, i.pending_buf, i.pending - n, n)), nr(r), n = i.pending, i.pending === i.pending_buf_size)) {
          a = 1;
          break;
        }
        i.gzindex < i.gzhead.name.length ? a = i.gzhead.name.charCodeAt(i.gzindex++) & 255 : a = 0, ie(i, a);
      } while (a !== 0);
      i.gzhead.hcrc && i.pending > n && (r.adler = ir(r.adler, i.pending_buf, i.pending - n, n)), a === 0 && (i.gzindex = 0, i.status = Qa);
    } else
      i.status = Qa;
  if (i.status === Qa)
    if (i.gzhead.comment) {
      n = i.pending;
      do {
        if (i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > n && (r.adler = ir(r.adler, i.pending_buf, i.pending - n, n)), nr(r), n = i.pending, i.pending === i.pending_buf_size)) {
          a = 1;
          break;
        }
        i.gzindex < i.gzhead.comment.length ? a = i.gzhead.comment.charCodeAt(i.gzindex++) & 255 : a = 0, ie(i, a);
      } while (a !== 0);
      i.gzhead.hcrc && i.pending > n && (r.adler = ir(r.adler, i.pending_buf, i.pending - n, n)), a === 0 && (i.status = es);
    } else
      i.status = es;
  if (i.status === es && (i.gzhead.hcrc ? (i.pending + 2 > i.pending_buf_size && nr(r), i.pending + 2 <= i.pending_buf_size && (ie(i, r.adler & 255), ie(i, r.adler >> 8 & 255), r.adler = 0, i.status = Ir)) : i.status = Ir), i.pending !== 0) {
    if (nr(r), r.avail_out === 0)
      return i.last_flush = -1, kt;
  } else if (r.avail_in === 0 && t0(e) <= t0(t) && e !== yr)
    return hr(r, go);
  if (i.status === bn && r.avail_in !== 0)
    return hr(r, go);
  if (r.avail_in !== 0 || i.lookahead !== 0 || e !== ui && i.status !== bn) {
    var l = i.strategy === La ? Q1(i, e) : i.strategy === N1 ? J1(i, e) : _i[i.level].func(i, e);
    if ((l === Qr || l === Ji) && (i.status = bn), l === Ae || l === Qr)
      return r.avail_out === 0 && (i.last_flush = -1), kt;
    if (l === Sa && (e === D1 ? nt._tr_align(i) : e !== Ql && (nt._tr_stored_block(i, 0, 0, !1), e === E1 && (cr(i.head), i.lookahead === 0 && (i.strstart = 0, i.block_start = 0, i.insert = 0))), nr(r), r.avail_out === 0))
      return i.last_flush = -1, kt;
  }
  return e !== yr ? kt : i.wrap <= 0 ? e0 : (i.wrap === 2 ? (ie(i, r.adler & 255), ie(i, r.adler >> 8 & 255), ie(i, r.adler >> 16 & 255), ie(i, r.adler >> 24 & 255), ie(i, r.total_in & 255), ie(i, r.total_in >> 8 & 255), ie(i, r.total_in >> 16 & 255), ie(i, r.total_in >> 24 & 255)) : (an(i, r.adler >>> 16), an(i, r.adler & 65535)), nr(r), i.wrap > 0 && (i.wrap = -i.wrap), i.pending !== 0 ? kt : e0);
}
function ap(r) {
  var e;
  return !r || !r.state ? at : (e = r.state.status, e !== $s && e !== Go && e !== Ja && e !== Qa && e !== es && e !== Ir && e !== bn ? hr(r, at) : (r.state = null, e === Ir ? hr(r, T1) : kt));
}
function sp(r, e) {
  var t = e.length, i, n, a, s, o, l, c, u;
  if (!r || !r.state || (i = r.state, s = i.wrap, s === 2 || s === 1 && i.status !== $s || i.lookahead))
    return at;
  for (s === 1 && (r.adler = zd(r.adler, e, t, 0)), i.wrap = 0, t >= i.w_size && (s === 0 && (cr(i.head), i.strstart = 0, i.block_start = 0, i.insert = 0), u = new Me.Buf8(i.w_size), Me.arraySet(u, e, t - i.w_size, i.w_size, 0), e = u, t = i.w_size), o = r.avail_in, l = r.next_in, c = r.input, r.avail_in = t, r.next_in = 0, r.input = e, ei(i); i.lookahead >= Y; ) {
    n = i.strstart, a = i.lookahead - (Y - 1);
    do
      i.ins_h = (i.ins_h << i.hash_shift ^ i.window[n + Y - 1]) & i.hash_mask, i.prev[n & i.w_mask] = i.head[i.ins_h], i.head[i.ins_h] = n, n++;
    while (--a);
    i.strstart = n, i.lookahead = Y - 1, ei(i);
  }
  return i.strstart += i.lookahead, i.block_start = i.strstart, i.insert = i.lookahead, i.lookahead = 0, i.match_length = i.prev_length = Y - 1, i.match_available = 0, r.next_in = l, r.input = c, r.avail_in = o, i.wrap = s, kt;
}
Tt.deflateInit = ip;
Tt.deflateInit2 = $d;
Tt.deflateReset = Ud;
Tt.deflateResetKeep = Md;
Tt.deflateSetHeader = rp;
Tt.deflate = np;
Tt.deflateEnd = ap;
Tt.deflateSetDictionary = sp;
Tt.deflateInfo = "pako deflate (from Nodeca project)";
var di = {}, Ws = Jt, Wd = !0, Hd = !0;
try {
  String.fromCharCode.apply(null, [0]);
} catch {
  Wd = !1;
}
try {
  String.fromCharCode.apply(null, new Uint8Array(1));
} catch {
  Hd = !1;
}
var ea = new Ws.Buf8(256);
for (var tr = 0; tr < 256; tr++)
  ea[tr] = tr >= 252 ? 6 : tr >= 248 ? 5 : tr >= 240 ? 4 : tr >= 224 ? 3 : tr >= 192 ? 2 : 1;
ea[254] = ea[254] = 1;
di.string2buf = function(r) {
  var e, t, i, n, a, s = r.length, o = 0;
  for (n = 0; n < s; n++)
    t = r.charCodeAt(n), (t & 64512) === 55296 && n + 1 < s && (i = r.charCodeAt(n + 1), (i & 64512) === 56320 && (t = 65536 + (t - 55296 << 10) + (i - 56320), n++)), o += t < 128 ? 1 : t < 2048 ? 2 : t < 65536 ? 3 : 4;
  for (e = new Ws.Buf8(o), a = 0, n = 0; a < o; n++)
    t = r.charCodeAt(n), (t & 64512) === 55296 && n + 1 < s && (i = r.charCodeAt(n + 1), (i & 64512) === 56320 && (t = 65536 + (t - 55296 << 10) + (i - 56320), n++)), t < 128 ? e[a++] = t : t < 2048 ? (e[a++] = 192 | t >>> 6, e[a++] = 128 | t & 63) : t < 65536 ? (e[a++] = 224 | t >>> 12, e[a++] = 128 | t >>> 6 & 63, e[a++] = 128 | t & 63) : (e[a++] = 240 | t >>> 18, e[a++] = 128 | t >>> 12 & 63, e[a++] = 128 | t >>> 6 & 63, e[a++] = 128 | t & 63);
  return e;
};
function qd(r, e) {
  if (e < 65534 && (r.subarray && Hd || !r.subarray && Wd))
    return String.fromCharCode.apply(null, Ws.shrinkBuf(r, e));
  for (var t = "", i = 0; i < e; i++)
    t += String.fromCharCode(r[i]);
  return t;
}
di.buf2binstring = function(r) {
  return qd(r, r.length);
};
di.binstring2buf = function(r) {
  for (var e = new Ws.Buf8(r.length), t = 0, i = e.length; t < i; t++)
    e[t] = r.charCodeAt(t);
  return e;
};
di.buf2string = function(r, e) {
  var t, i, n, a, s = e || r.length, o = new Array(s * 2);
  for (i = 0, t = 0; t < s; ) {
    if (n = r[t++], n < 128) {
      o[i++] = n;
      continue;
    }
    if (a = ea[n], a > 4) {
      o[i++] = 65533, t += a - 1;
      continue;
    }
    for (n &= a === 2 ? 31 : a === 3 ? 15 : 7; a > 1 && t < s; )
      n = n << 6 | r[t++] & 63, a--;
    if (a > 1) {
      o[i++] = 65533;
      continue;
    }
    n < 65536 ? o[i++] = n : (n -= 65536, o[i++] = 55296 | n >> 10 & 1023, o[i++] = 56320 | n & 1023);
  }
  return qd(o, i);
};
di.utf8border = function(r, e) {
  var t;
  for (e = e || r.length, e > r.length && (e = r.length), t = e - 1; t >= 0 && (r[t] & 192) === 128; )
    t--;
  return t < 0 || t === 0 ? e : t + ea[r[t]] > e ? t : e;
};
function op() {
  this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
}
var Zd = op, On = Tt, Pn = Jt, Xo = di, Yo = Bc, cp = Zd, Kd = Object.prototype.toString, lp = 0, mo = 4, Fi = 0, r0 = 1, i0 = 2, up = -1, dp = 0, hp = 8;
function ti(r) {
  if (!(this instanceof ti)) return new ti(r);
  this.options = Pn.assign({
    level: up,
    method: hp,
    chunkSize: 16384,
    windowBits: 15,
    memLevel: 8,
    strategy: dp,
    to: ""
  }, r || {});
  var e = this.options;
  e.raw && e.windowBits > 0 ? e.windowBits = -e.windowBits : e.gzip && e.windowBits > 0 && e.windowBits < 16 && (e.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new cp(), this.strm.avail_out = 0;
  var t = On.deflateInit2(
    this.strm,
    e.level,
    e.method,
    e.windowBits,
    e.memLevel,
    e.strategy
  );
  if (t !== Fi)
    throw new Error(Yo[t]);
  if (e.header && On.deflateSetHeader(this.strm, e.header), e.dictionary) {
    var i;
    if (typeof e.dictionary == "string" ? i = Xo.string2buf(e.dictionary) : Kd.call(e.dictionary) === "[object ArrayBuffer]" ? i = new Uint8Array(e.dictionary) : i = e.dictionary, t = On.deflateSetDictionary(this.strm, i), t !== Fi)
      throw new Error(Yo[t]);
    this._dict_set = !0;
  }
}
ti.prototype.push = function(r, e) {
  var t = this.strm, i = this.options.chunkSize, n, a;
  if (this.ended)
    return !1;
  a = e === ~~e ? e : e === !0 ? mo : lp, typeof r == "string" ? t.input = Xo.string2buf(r) : Kd.call(r) === "[object ArrayBuffer]" ? t.input = new Uint8Array(r) : t.input = r, t.next_in = 0, t.avail_in = t.input.length;
  do {
    if (t.avail_out === 0 && (t.output = new Pn.Buf8(i), t.next_out = 0, t.avail_out = i), n = On.deflate(t, a), n !== r0 && n !== Fi)
      return this.onEnd(n), this.ended = !0, !1;
    (t.avail_out === 0 || t.avail_in === 0 && (a === mo || a === i0)) && (this.options.to === "string" ? this.onData(Xo.buf2binstring(Pn.shrinkBuf(t.output, t.next_out))) : this.onData(Pn.shrinkBuf(t.output, t.next_out)));
  } while ((t.avail_in > 0 || t.avail_out === 0) && n !== r0);
  return a === mo ? (n = On.deflateEnd(this.strm), this.onEnd(n), this.ended = !0, n === Fi) : (a === i0 && (this.onEnd(Fi), t.avail_out = 0), !0);
};
ti.prototype.onData = function(r) {
  this.chunks.push(r);
};
ti.prototype.onEnd = function(r) {
  r === Fi && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = Pn.flattenChunks(this.chunks)), this.chunks = [], this.err = r, this.msg = this.strm.msg;
};
function Nc(r, e) {
  var t = new ti(e);
  if (t.push(r, !0), t.err)
    throw t.msg || Yo[t.err];
  return t.result;
}
function fp(r, e) {
  return e = e || {}, e.raw = !0, Nc(r, e);
}
function bp(r, e) {
  return e = e || {}, e.gzip = !0, Nc(r, e);
}
_a.Deflate = ti;
_a.deflate = Nc;
_a.deflateRaw = fp;
_a.gzip = bp;
var Aa = {}, xt = {}, Ma = 30, xp = 12, gp = function(e, t) {
  var i, n, a, s, o, l, c, u, f, h, d, b, p, m, g, S, y, v, A, k, _, C, P, D, O;
  i = e.state, n = e.next_in, D = e.input, a = n + (e.avail_in - 5), s = e.next_out, O = e.output, o = s - (t - e.avail_out), l = s + (e.avail_out - 257), c = i.dmax, u = i.wsize, f = i.whave, h = i.wnext, d = i.window, b = i.hold, p = i.bits, m = i.lencode, g = i.distcode, S = (1 << i.lenbits) - 1, y = (1 << i.distbits) - 1;
  e:
    do {
      p < 15 && (b += D[n++] << p, p += 8, b += D[n++] << p, p += 8), v = m[b & S];
      t:
        for (; ; ) {
          if (A = v >>> 24, b >>>= A, p -= A, A = v >>> 16 & 255, A === 0)
            O[s++] = v & 65535;
          else if (A & 16) {
            k = v & 65535, A &= 15, A && (p < A && (b += D[n++] << p, p += 8), k += b & (1 << A) - 1, b >>>= A, p -= A), p < 15 && (b += D[n++] << p, p += 8, b += D[n++] << p, p += 8), v = g[b & y];
            r:
              for (; ; ) {
                if (A = v >>> 24, b >>>= A, p -= A, A = v >>> 16 & 255, A & 16) {
                  if (_ = v & 65535, A &= 15, p < A && (b += D[n++] << p, p += 8, p < A && (b += D[n++] << p, p += 8)), _ += b & (1 << A) - 1, _ > c) {
                    e.msg = "invalid distance too far back", i.mode = Ma;
                    break e;
                  }
                  if (b >>>= A, p -= A, A = s - o, _ > A) {
                    if (A = _ - A, A > f && i.sane) {
                      e.msg = "invalid distance too far back", i.mode = Ma;
                      break e;
                    }
                    if (C = 0, P = d, h === 0) {
                      if (C += u - A, A < k) {
                        k -= A;
                        do
                          O[s++] = d[C++];
                        while (--A);
                        C = s - _, P = O;
                      }
                    } else if (h < A) {
                      if (C += u + h - A, A -= h, A < k) {
                        k -= A;
                        do
                          O[s++] = d[C++];
                        while (--A);
                        if (C = 0, h < k) {
                          A = h, k -= A;
                          do
                            O[s++] = d[C++];
                          while (--A);
                          C = s - _, P = O;
                        }
                      }
                    } else if (C += h - A, A < k) {
                      k -= A;
                      do
                        O[s++] = d[C++];
                      while (--A);
                      C = s - _, P = O;
                    }
                    for (; k > 2; )
                      O[s++] = P[C++], O[s++] = P[C++], O[s++] = P[C++], k -= 3;
                    k && (O[s++] = P[C++], k > 1 && (O[s++] = P[C++]));
                  } else {
                    C = s - _;
                    do
                      O[s++] = O[C++], O[s++] = O[C++], O[s++] = O[C++], k -= 3;
                    while (k > 2);
                    k && (O[s++] = O[C++], k > 1 && (O[s++] = O[C++]));
                  }
                } else if (A & 64) {
                  e.msg = "invalid distance code", i.mode = Ma;
                  break e;
                } else {
                  v = g[(v & 65535) + (b & (1 << A) - 1)];
                  continue r;
                }
                break;
              }
          } else if (A & 64)
            if (A & 32) {
              i.mode = xp;
              break e;
            } else {
              e.msg = "invalid literal/length code", i.mode = Ma;
              break e;
            }
          else {
            v = m[(v & 65535) + (b & (1 << A) - 1)];
            continue t;
          }
          break;
        }
    } while (n < a && s < l);
  k = p >> 3, n -= k, p -= k << 3, b &= (1 << p) - 1, e.next_in = n, e.next_out = s, e.avail_in = n < a ? 5 + (a - n) : 5 - (n - a), e.avail_out = s < l ? 257 + (l - s) : 257 - (s - l), i.hold = b, i.bits = p;
}, n0 = Jt, gi = 15, a0 = 852, s0 = 592, o0 = 0, wo = 1, c0 = 2, pp = [
  /* Length codes 257..285 base */
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  13,
  15,
  17,
  19,
  23,
  27,
  31,
  35,
  43,
  51,
  59,
  67,
  83,
  99,
  115,
  131,
  163,
  195,
  227,
  258,
  0,
  0
], mp = [
  /* Length codes 257..285 extra */
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  17,
  17,
  17,
  17,
  18,
  18,
  18,
  18,
  19,
  19,
  19,
  19,
  20,
  20,
  20,
  20,
  21,
  21,
  21,
  21,
  16,
  72,
  78
], wp = [
  /* Distance codes 0..29 base */
  1,
  2,
  3,
  4,
  5,
  7,
  9,
  13,
  17,
  25,
  33,
  49,
  65,
  97,
  129,
  193,
  257,
  385,
  513,
  769,
  1025,
  1537,
  2049,
  3073,
  4097,
  6145,
  8193,
  12289,
  16385,
  24577,
  0,
  0
], yp = [
  /* Distance codes 0..29 extra */
  16,
  16,
  16,
  16,
  17,
  17,
  18,
  18,
  19,
  19,
  20,
  20,
  21,
  21,
  22,
  22,
  23,
  23,
  24,
  24,
  25,
  25,
  26,
  26,
  27,
  27,
  28,
  28,
  29,
  29,
  64,
  64
], vp = function(e, t, i, n, a, s, o, l) {
  var c = l.bits, u = 0, f = 0, h = 0, d = 0, b = 0, p = 0, m = 0, g = 0, S = 0, y = 0, v, A, k, _, C, P = null, D = 0, O, j = new n0.Buf16(gi + 1), B = new n0.Buf16(gi + 1), W = null, I = 0, N, L, re;
  for (u = 0; u <= gi; u++)
    j[u] = 0;
  for (f = 0; f < n; f++)
    j[t[i + f]]++;
  for (b = c, d = gi; d >= 1 && j[d] === 0; d--)
    ;
  if (b > d && (b = d), d === 0)
    return a[s++] = 1 << 24 | 64 << 16 | 0, a[s++] = 1 << 24 | 64 << 16 | 0, l.bits = 1, 0;
  for (h = 1; h < d && j[h] === 0; h++)
    ;
  for (b < h && (b = h), g = 1, u = 1; u <= gi; u++)
    if (g <<= 1, g -= j[u], g < 0)
      return -1;
  if (g > 0 && (e === o0 || d !== 1))
    return -1;
  for (B[1] = 0, u = 1; u < gi; u++)
    B[u + 1] = B[u] + j[u];
  for (f = 0; f < n; f++)
    t[i + f] !== 0 && (o[B[t[i + f]]++] = f);
  if (e === o0 ? (P = W = o, O = 19) : e === wo ? (P = pp, D -= 257, W = mp, I -= 257, O = 256) : (P = wp, W = yp, O = -1), y = 0, f = 0, u = h, C = s, p = b, m = 0, k = -1, S = 1 << b, _ = S - 1, e === wo && S > a0 || e === c0 && S > s0)
    return 1;
  for (; ; ) {
    N = u - m, o[f] < O ? (L = 0, re = o[f]) : o[f] > O ? (L = W[I + o[f]], re = P[D + o[f]]) : (L = 96, re = 0), v = 1 << u - m, A = 1 << p, h = A;
    do
      A -= v, a[C + (y >> m) + A] = N << 24 | L << 16 | re | 0;
    while (A !== 0);
    for (v = 1 << u - 1; y & v; )
      v >>= 1;
    if (v !== 0 ? (y &= v - 1, y += v) : y = 0, f++, --j[u] === 0) {
      if (u === d)
        break;
      u = t[i + o[f]];
    }
    if (u > b && (y & _) !== k) {
      for (m === 0 && (m = b), C += h, p = u - m, g = 1 << p; p + m < d && (g -= j[p + m], !(g <= 0)); )
        p++, g <<= 1;
      if (S += 1 << p, e === wo && S > a0 || e === c0 && S > s0)
        return 1;
      k = y & _, a[k] = b << 24 | p << 16 | C - s | 0;
    }
  }
  return y !== 0 && (a[C + y] = u - m << 24 | 64 << 16 | 0), l.bits = b, 0;
}, Je = Jt, Jo = jd, mt = Id, _p = gp, Dn = vp, kp = 0, Vd = 1, Gd = 2, l0 = 4, Sp = 5, Ua = 6, ri = 0, Ap = 1, Cp = 2, ot = -2, Xd = -3, Yd = -4, Fp = -5, u0 = 8, Jd = 1, d0 = 2, h0 = 3, f0 = 4, b0 = 5, x0 = 6, g0 = 7, p0 = 8, m0 = 9, w0 = 10, hs = 11, Bt = 12, yo = 13, y0 = 14, vo = 15, v0 = 16, _0 = 17, k0 = 18, S0 = 19, $a = 20, Wa = 21, A0 = 22, C0 = 23, F0 = 24, O0 = 25, P0 = 26, _o = 27, D0 = 28, E0 = 29, be = 30, Qd = 31, Op = 32, Pp = 852, Dp = 592, Ep = 15, Tp = Ep;
function T0(r) {
  return (r >>> 24 & 255) + (r >>> 8 & 65280) + ((r & 65280) << 8) + ((r & 255) << 24);
}
function Rp() {
  this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new Je.Buf16(320), this.work = new Je.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
}
function eh(r) {
  var e;
  return !r || !r.state ? ot : (e = r.state, r.total_in = r.total_out = e.total = 0, r.msg = "", e.wrap && (r.adler = e.wrap & 1), e.mode = Jd, e.last = 0, e.havedict = 0, e.dmax = 32768, e.head = null, e.hold = 0, e.bits = 0, e.lencode = e.lendyn = new Je.Buf32(Pp), e.distcode = e.distdyn = new Je.Buf32(Dp), e.sane = 1, e.back = -1, ri);
}
function th(r) {
  var e;
  return !r || !r.state ? ot : (e = r.state, e.wsize = 0, e.whave = 0, e.wnext = 0, eh(r));
}
function rh(r, e) {
  var t, i;
  return !r || !r.state || (i = r.state, e < 0 ? (t = 0, e = -e) : (t = (e >> 4) + 1, e < 48 && (e &= 15)), e && (e < 8 || e > 15)) ? ot : (i.window !== null && i.wbits !== e && (i.window = null), i.wrap = t, i.wbits = e, th(r));
}
function ih(r, e) {
  var t, i;
  return r ? (i = new Rp(), r.state = i, i.window = null, t = rh(r, e), t !== ri && (r.state = null), t) : ot;
}
function Bp(r) {
  return ih(r, Tp);
}
var R0 = !0, ko, So;
function Np(r) {
  if (R0) {
    var e;
    for (ko = new Je.Buf32(512), So = new Je.Buf32(32), e = 0; e < 144; )
      r.lens[e++] = 8;
    for (; e < 256; )
      r.lens[e++] = 9;
    for (; e < 280; )
      r.lens[e++] = 7;
    for (; e < 288; )
      r.lens[e++] = 8;
    for (Dn(Vd, r.lens, 0, 288, ko, 0, r.work, { bits: 9 }), e = 0; e < 32; )
      r.lens[e++] = 5;
    Dn(Gd, r.lens, 0, 32, So, 0, r.work, { bits: 5 }), R0 = !1;
  }
  r.lencode = ko, r.lenbits = 9, r.distcode = So, r.distbits = 5;
}
function nh(r, e, t, i) {
  var n, a = r.state;
  return a.window === null && (a.wsize = 1 << a.wbits, a.wnext = 0, a.whave = 0, a.window = new Je.Buf8(a.wsize)), i >= a.wsize ? (Je.arraySet(a.window, e, t - a.wsize, a.wsize, 0), a.wnext = 0, a.whave = a.wsize) : (n = a.wsize - a.wnext, n > i && (n = i), Je.arraySet(a.window, e, t - i, n, a.wnext), i -= n, i ? (Je.arraySet(a.window, e, t - i, i, 0), a.wnext = i, a.whave = a.wsize) : (a.wnext += n, a.wnext === a.wsize && (a.wnext = 0), a.whave < a.wsize && (a.whave += n))), 0;
}
function jp(r, e) {
  var t, i, n, a, s, o, l, c, u, f, h, d, b, p, m = 0, g, S, y, v, A, k, _, C, P = new Je.Buf8(4), D, O, j = (
    /* permutation of code lengths */
    [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
  );
  if (!r || !r.state || !r.output || !r.input && r.avail_in !== 0)
    return ot;
  t = r.state, t.mode === Bt && (t.mode = yo), s = r.next_out, n = r.output, l = r.avail_out, a = r.next_in, i = r.input, o = r.avail_in, c = t.hold, u = t.bits, f = o, h = l, C = ri;
  e:
    for (; ; )
      switch (t.mode) {
        case Jd:
          if (t.wrap === 0) {
            t.mode = yo;
            break;
          }
          for (; u < 16; ) {
            if (o === 0)
              break e;
            o--, c += i[a++] << u, u += 8;
          }
          if (t.wrap & 2 && c === 35615) {
            t.check = 0, P[0] = c & 255, P[1] = c >>> 8 & 255, t.check = mt(t.check, P, 2, 0), c = 0, u = 0, t.mode = d0;
            break;
          }
          if (t.flags = 0, t.head && (t.head.done = !1), !(t.wrap & 1) || /* check if zlib header allowed */
          (((c & 255) << 8) + (c >> 8)) % 31) {
            r.msg = "incorrect header check", t.mode = be;
            break;
          }
          if ((c & 15) !== u0) {
            r.msg = "unknown compression method", t.mode = be;
            break;
          }
          if (c >>>= 4, u -= 4, _ = (c & 15) + 8, t.wbits === 0)
            t.wbits = _;
          else if (_ > t.wbits) {
            r.msg = "invalid window size", t.mode = be;
            break;
          }
          t.dmax = 1 << _, r.adler = t.check = 1, t.mode = c & 512 ? w0 : Bt, c = 0, u = 0;
          break;
        case d0:
          for (; u < 16; ) {
            if (o === 0)
              break e;
            o--, c += i[a++] << u, u += 8;
          }
          if (t.flags = c, (t.flags & 255) !== u0) {
            r.msg = "unknown compression method", t.mode = be;
            break;
          }
          if (t.flags & 57344) {
            r.msg = "unknown header flags set", t.mode = be;
            break;
          }
          t.head && (t.head.text = c >> 8 & 1), t.flags & 512 && (P[0] = c & 255, P[1] = c >>> 8 & 255, t.check = mt(t.check, P, 2, 0)), c = 0, u = 0, t.mode = h0;
        case h0:
          for (; u < 32; ) {
            if (o === 0)
              break e;
            o--, c += i[a++] << u, u += 8;
          }
          t.head && (t.head.time = c), t.flags & 512 && (P[0] = c & 255, P[1] = c >>> 8 & 255, P[2] = c >>> 16 & 255, P[3] = c >>> 24 & 255, t.check = mt(t.check, P, 4, 0)), c = 0, u = 0, t.mode = f0;
        case f0:
          for (; u < 16; ) {
            if (o === 0)
              break e;
            o--, c += i[a++] << u, u += 8;
          }
          t.head && (t.head.xflags = c & 255, t.head.os = c >> 8), t.flags & 512 && (P[0] = c & 255, P[1] = c >>> 8 & 255, t.check = mt(t.check, P, 2, 0)), c = 0, u = 0, t.mode = b0;
        case b0:
          if (t.flags & 1024) {
            for (; u < 16; ) {
              if (o === 0)
                break e;
              o--, c += i[a++] << u, u += 8;
            }
            t.length = c, t.head && (t.head.extra_len = c), t.flags & 512 && (P[0] = c & 255, P[1] = c >>> 8 & 255, t.check = mt(t.check, P, 2, 0)), c = 0, u = 0;
          } else t.head && (t.head.extra = null);
          t.mode = x0;
        case x0:
          if (t.flags & 1024 && (d = t.length, d > o && (d = o), d && (t.head && (_ = t.head.extra_len - t.length, t.head.extra || (t.head.extra = new Array(t.head.extra_len)), Je.arraySet(
            t.head.extra,
            i,
            a,
            // extra field is limited to 65536 bytes
            // - no need for additional size check
            d,
            /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
            _
          )), t.flags & 512 && (t.check = mt(t.check, i, d, a)), o -= d, a += d, t.length -= d), t.length))
            break e;
          t.length = 0, t.mode = g0;
        case g0:
          if (t.flags & 2048) {
            if (o === 0)
              break e;
            d = 0;
            do
              _ = i[a + d++], t.head && _ && t.length < 65536 && (t.head.name += String.fromCharCode(_));
            while (_ && d < o);
            if (t.flags & 512 && (t.check = mt(t.check, i, d, a)), o -= d, a += d, _)
              break e;
          } else t.head && (t.head.name = null);
          t.length = 0, t.mode = p0;
        case p0:
          if (t.flags & 4096) {
            if (o === 0)
              break e;
            d = 0;
            do
              _ = i[a + d++], t.head && _ && t.length < 65536 && (t.head.comment += String.fromCharCode(_));
            while (_ && d < o);
            if (t.flags & 512 && (t.check = mt(t.check, i, d, a)), o -= d, a += d, _)
              break e;
          } else t.head && (t.head.comment = null);
          t.mode = m0;
        case m0:
          if (t.flags & 512) {
            for (; u < 16; ) {
              if (o === 0)
                break e;
              o--, c += i[a++] << u, u += 8;
            }
            if (c !== (t.check & 65535)) {
              r.msg = "header crc mismatch", t.mode = be;
              break;
            }
            c = 0, u = 0;
          }
          t.head && (t.head.hcrc = t.flags >> 9 & 1, t.head.done = !0), r.adler = t.check = 0, t.mode = Bt;
          break;
        case w0:
          for (; u < 32; ) {
            if (o === 0)
              break e;
            o--, c += i[a++] << u, u += 8;
          }
          r.adler = t.check = T0(c), c = 0, u = 0, t.mode = hs;
        case hs:
          if (t.havedict === 0)
            return r.next_out = s, r.avail_out = l, r.next_in = a, r.avail_in = o, t.hold = c, t.bits = u, Cp;
          r.adler = t.check = 1, t.mode = Bt;
        case Bt:
          if (e === Sp || e === Ua)
            break e;
        case yo:
          if (t.last) {
            c >>>= u & 7, u -= u & 7, t.mode = _o;
            break;
          }
          for (; u < 3; ) {
            if (o === 0)
              break e;
            o--, c += i[a++] << u, u += 8;
          }
          switch (t.last = c & 1, c >>>= 1, u -= 1, c & 3) {
            case 0:
              t.mode = y0;
              break;
            case 1:
              if (Np(t), t.mode = $a, e === Ua) {
                c >>>= 2, u -= 2;
                break e;
              }
              break;
            case 2:
              t.mode = _0;
              break;
            case 3:
              r.msg = "invalid block type", t.mode = be;
          }
          c >>>= 2, u -= 2;
          break;
        case y0:
          for (c >>>= u & 7, u -= u & 7; u < 32; ) {
            if (o === 0)
              break e;
            o--, c += i[a++] << u, u += 8;
          }
          if ((c & 65535) !== (c >>> 16 ^ 65535)) {
            r.msg = "invalid stored block lengths", t.mode = be;
            break;
          }
          if (t.length = c & 65535, c = 0, u = 0, t.mode = vo, e === Ua)
            break e;
        case vo:
          t.mode = v0;
        case v0:
          if (d = t.length, d) {
            if (d > o && (d = o), d > l && (d = l), d === 0)
              break e;
            Je.arraySet(n, i, a, d, s), o -= d, a += d, l -= d, s += d, t.length -= d;
            break;
          }
          t.mode = Bt;
          break;
        case _0:
          for (; u < 14; ) {
            if (o === 0)
              break e;
            o--, c += i[a++] << u, u += 8;
          }
          if (t.nlen = (c & 31) + 257, c >>>= 5, u -= 5, t.ndist = (c & 31) + 1, c >>>= 5, u -= 5, t.ncode = (c & 15) + 4, c >>>= 4, u -= 4, t.nlen > 286 || t.ndist > 30) {
            r.msg = "too many length or distance symbols", t.mode = be;
            break;
          }
          t.have = 0, t.mode = k0;
        case k0:
          for (; t.have < t.ncode; ) {
            for (; u < 3; ) {
              if (o === 0)
                break e;
              o--, c += i[a++] << u, u += 8;
            }
            t.lens[j[t.have++]] = c & 7, c >>>= 3, u -= 3;
          }
          for (; t.have < 19; )
            t.lens[j[t.have++]] = 0;
          if (t.lencode = t.lendyn, t.lenbits = 7, D = { bits: t.lenbits }, C = Dn(kp, t.lens, 0, 19, t.lencode, 0, t.work, D), t.lenbits = D.bits, C) {
            r.msg = "invalid code lengths set", t.mode = be;
            break;
          }
          t.have = 0, t.mode = S0;
        case S0:
          for (; t.have < t.nlen + t.ndist; ) {
            for (; m = t.lencode[c & (1 << t.lenbits) - 1], g = m >>> 24, S = m >>> 16 & 255, y = m & 65535, !(g <= u); ) {
              if (o === 0)
                break e;
              o--, c += i[a++] << u, u += 8;
            }
            if (y < 16)
              c >>>= g, u -= g, t.lens[t.have++] = y;
            else {
              if (y === 16) {
                for (O = g + 2; u < O; ) {
                  if (o === 0)
                    break e;
                  o--, c += i[a++] << u, u += 8;
                }
                if (c >>>= g, u -= g, t.have === 0) {
                  r.msg = "invalid bit length repeat", t.mode = be;
                  break;
                }
                _ = t.lens[t.have - 1], d = 3 + (c & 3), c >>>= 2, u -= 2;
              } else if (y === 17) {
                for (O = g + 3; u < O; ) {
                  if (o === 0)
                    break e;
                  o--, c += i[a++] << u, u += 8;
                }
                c >>>= g, u -= g, _ = 0, d = 3 + (c & 7), c >>>= 3, u -= 3;
              } else {
                for (O = g + 7; u < O; ) {
                  if (o === 0)
                    break e;
                  o--, c += i[a++] << u, u += 8;
                }
                c >>>= g, u -= g, _ = 0, d = 11 + (c & 127), c >>>= 7, u -= 7;
              }
              if (t.have + d > t.nlen + t.ndist) {
                r.msg = "invalid bit length repeat", t.mode = be;
                break;
              }
              for (; d--; )
                t.lens[t.have++] = _;
            }
          }
          if (t.mode === be)
            break;
          if (t.lens[256] === 0) {
            r.msg = "invalid code -- missing end-of-block", t.mode = be;
            break;
          }
          if (t.lenbits = 9, D = { bits: t.lenbits }, C = Dn(Vd, t.lens, 0, t.nlen, t.lencode, 0, t.work, D), t.lenbits = D.bits, C) {
            r.msg = "invalid literal/lengths set", t.mode = be;
            break;
          }
          if (t.distbits = 6, t.distcode = t.distdyn, D = { bits: t.distbits }, C = Dn(Gd, t.lens, t.nlen, t.ndist, t.distcode, 0, t.work, D), t.distbits = D.bits, C) {
            r.msg = "invalid distances set", t.mode = be;
            break;
          }
          if (t.mode = $a, e === Ua)
            break e;
        case $a:
          t.mode = Wa;
        case Wa:
          if (o >= 6 && l >= 258) {
            r.next_out = s, r.avail_out = l, r.next_in = a, r.avail_in = o, t.hold = c, t.bits = u, _p(r, h), s = r.next_out, n = r.output, l = r.avail_out, a = r.next_in, i = r.input, o = r.avail_in, c = t.hold, u = t.bits, t.mode === Bt && (t.back = -1);
            break;
          }
          for (t.back = 0; m = t.lencode[c & (1 << t.lenbits) - 1], g = m >>> 24, S = m >>> 16 & 255, y = m & 65535, !(g <= u); ) {
            if (o === 0)
              break e;
            o--, c += i[a++] << u, u += 8;
          }
          if (S && !(S & 240)) {
            for (v = g, A = S, k = y; m = t.lencode[k + ((c & (1 << v + A) - 1) >> v)], g = m >>> 24, S = m >>> 16 & 255, y = m & 65535, !(v + g <= u); ) {
              if (o === 0)
                break e;
              o--, c += i[a++] << u, u += 8;
            }
            c >>>= v, u -= v, t.back += v;
          }
          if (c >>>= g, u -= g, t.back += g, t.length = y, S === 0) {
            t.mode = P0;
            break;
          }
          if (S & 32) {
            t.back = -1, t.mode = Bt;
            break;
          }
          if (S & 64) {
            r.msg = "invalid literal/length code", t.mode = be;
            break;
          }
          t.extra = S & 15, t.mode = A0;
        case A0:
          if (t.extra) {
            for (O = t.extra; u < O; ) {
              if (o === 0)
                break e;
              o--, c += i[a++] << u, u += 8;
            }
            t.length += c & (1 << t.extra) - 1, c >>>= t.extra, u -= t.extra, t.back += t.extra;
          }
          t.was = t.length, t.mode = C0;
        case C0:
          for (; m = t.distcode[c & (1 << t.distbits) - 1], g = m >>> 24, S = m >>> 16 & 255, y = m & 65535, !(g <= u); ) {
            if (o === 0)
              break e;
            o--, c += i[a++] << u, u += 8;
          }
          if (!(S & 240)) {
            for (v = g, A = S, k = y; m = t.distcode[k + ((c & (1 << v + A) - 1) >> v)], g = m >>> 24, S = m >>> 16 & 255, y = m & 65535, !(v + g <= u); ) {
              if (o === 0)
                break e;
              o--, c += i[a++] << u, u += 8;
            }
            c >>>= v, u -= v, t.back += v;
          }
          if (c >>>= g, u -= g, t.back += g, S & 64) {
            r.msg = "invalid distance code", t.mode = be;
            break;
          }
          t.offset = y, t.extra = S & 15, t.mode = F0;
        case F0:
          if (t.extra) {
            for (O = t.extra; u < O; ) {
              if (o === 0)
                break e;
              o--, c += i[a++] << u, u += 8;
            }
            t.offset += c & (1 << t.extra) - 1, c >>>= t.extra, u -= t.extra, t.back += t.extra;
          }
          if (t.offset > t.dmax) {
            r.msg = "invalid distance too far back", t.mode = be;
            break;
          }
          t.mode = O0;
        case O0:
          if (l === 0)
            break e;
          if (d = h - l, t.offset > d) {
            if (d = t.offset - d, d > t.whave && t.sane) {
              r.msg = "invalid distance too far back", t.mode = be;
              break;
            }
            d > t.wnext ? (d -= t.wnext, b = t.wsize - d) : b = t.wnext - d, d > t.length && (d = t.length), p = t.window;
          } else
            p = n, b = s - t.offset, d = t.length;
          d > l && (d = l), l -= d, t.length -= d;
          do
            n[s++] = p[b++];
          while (--d);
          t.length === 0 && (t.mode = Wa);
          break;
        case P0:
          if (l === 0)
            break e;
          n[s++] = t.length, l--, t.mode = Wa;
          break;
        case _o:
          if (t.wrap) {
            for (; u < 32; ) {
              if (o === 0)
                break e;
              o--, c |= i[a++] << u, u += 8;
            }
            if (h -= l, r.total_out += h, t.total += h, h && (r.adler = t.check = /*UPDATE(state.check, put - _out, _out);*/
            t.flags ? mt(t.check, n, h, s - h) : Jo(t.check, n, h, s - h)), h = l, (t.flags ? c : T0(c)) !== t.check) {
              r.msg = "incorrect data check", t.mode = be;
              break;
            }
            c = 0, u = 0;
          }
          t.mode = D0;
        case D0:
          if (t.wrap && t.flags) {
            for (; u < 32; ) {
              if (o === 0)
                break e;
              o--, c += i[a++] << u, u += 8;
            }
            if (c !== (t.total & 4294967295)) {
              r.msg = "incorrect length check", t.mode = be;
              break;
            }
            c = 0, u = 0;
          }
          t.mode = E0;
        case E0:
          C = Ap;
          break e;
        case be:
          C = Xd;
          break e;
        case Qd:
          return Yd;
        case Op:
        default:
          return ot;
      }
  return r.next_out = s, r.avail_out = l, r.next_in = a, r.avail_in = o, t.hold = c, t.bits = u, (t.wsize || h !== r.avail_out && t.mode < be && (t.mode < _o || e !== l0)) && nh(r, r.output, r.next_out, h - r.avail_out), f -= r.avail_in, h -= r.avail_out, r.total_in += f, r.total_out += h, t.total += h, t.wrap && h && (r.adler = t.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
  t.flags ? mt(t.check, n, h, r.next_out - h) : Jo(t.check, n, h, r.next_out - h)), r.data_type = t.bits + (t.last ? 64 : 0) + (t.mode === Bt ? 128 : 0) + (t.mode === $a || t.mode === vo ? 256 : 0), (f === 0 && h === 0 || e === l0) && C === ri && (C = Fp), C;
}
function Ip(r) {
  if (!r || !r.state)
    return ot;
  var e = r.state;
  return e.window && (e.window = null), r.state = null, ri;
}
function zp(r, e) {
  var t;
  return !r || !r.state || (t = r.state, !(t.wrap & 2)) ? ot : (t.head = e, e.done = !1, ri);
}
function Lp(r, e) {
  var t = e.length, i, n, a;
  return !r || !r.state || (i = r.state, i.wrap !== 0 && i.mode !== hs) ? ot : i.mode === hs && (n = 1, n = Jo(n, e, t, 0), n !== i.check) ? Xd : (a = nh(r, e, t, t), a ? (i.mode = Qd, Yd) : (i.havedict = 1, ri));
}
xt.inflateReset = th;
xt.inflateReset2 = rh;
xt.inflateResetKeep = eh;
xt.inflateInit = Bp;
xt.inflateInit2 = ih;
xt.inflate = jp;
xt.inflateEnd = Ip;
xt.inflateGetHeader = zp;
xt.inflateSetDictionary = Lp;
xt.inflateInfo = "pako inflate (from Nodeca project)";
var ah = {
  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH: 0,
  Z_PARTIAL_FLUSH: 1,
  Z_SYNC_FLUSH: 2,
  Z_FULL_FLUSH: 3,
  Z_FINISH: 4,
  Z_BLOCK: 5,
  Z_TREES: 6,
  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK: 0,
  Z_STREAM_END: 1,
  Z_NEED_DICT: 2,
  Z_ERRNO: -1,
  Z_STREAM_ERROR: -2,
  Z_DATA_ERROR: -3,
  //Z_MEM_ERROR:     -4,
  Z_BUF_ERROR: -5,
  //Z_VERSION_ERROR: -6,
  /* compression levels */
  Z_NO_COMPRESSION: 0,
  Z_BEST_SPEED: 1,
  Z_BEST_COMPRESSION: 9,
  Z_DEFAULT_COMPRESSION: -1,
  Z_FILTERED: 1,
  Z_HUFFMAN_ONLY: 2,
  Z_RLE: 3,
  Z_FIXED: 4,
  Z_DEFAULT_STRATEGY: 0,
  /* Possible values of the data_type field (though see inflate()) */
  Z_BINARY: 0,
  Z_TEXT: 1,
  //Z_ASCII:                1, // = Z_TEXT (deprecated)
  Z_UNKNOWN: 2,
  /* The deflate compression method */
  Z_DEFLATED: 8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};
function Mp() {
  this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
}
var Up = Mp, Oi = xt, En = Jt, ts = di, me = ah, Qo = Bc, $p = Zd, Wp = Up, sh = Object.prototype.toString;
function ii(r) {
  if (!(this instanceof ii)) return new ii(r);
  this.options = En.assign({
    chunkSize: 16384,
    windowBits: 0,
    to: ""
  }, r || {});
  var e = this.options;
  e.raw && e.windowBits >= 0 && e.windowBits < 16 && (e.windowBits = -e.windowBits, e.windowBits === 0 && (e.windowBits = -15)), e.windowBits >= 0 && e.windowBits < 16 && !(r && r.windowBits) && (e.windowBits += 32), e.windowBits > 15 && e.windowBits < 48 && (e.windowBits & 15 || (e.windowBits |= 15)), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new $p(), this.strm.avail_out = 0;
  var t = Oi.inflateInit2(
    this.strm,
    e.windowBits
  );
  if (t !== me.Z_OK)
    throw new Error(Qo[t]);
  if (this.header = new Wp(), Oi.inflateGetHeader(this.strm, this.header), e.dictionary && (typeof e.dictionary == "string" ? e.dictionary = ts.string2buf(e.dictionary) : sh.call(e.dictionary) === "[object ArrayBuffer]" && (e.dictionary = new Uint8Array(e.dictionary)), e.raw && (t = Oi.inflateSetDictionary(this.strm, e.dictionary), t !== me.Z_OK)))
    throw new Error(Qo[t]);
}
ii.prototype.push = function(r, e) {
  var t = this.strm, i = this.options.chunkSize, n = this.options.dictionary, a, s, o, l, c, u = !1;
  if (this.ended)
    return !1;
  s = e === ~~e ? e : e === !0 ? me.Z_FINISH : me.Z_NO_FLUSH, typeof r == "string" ? t.input = ts.binstring2buf(r) : sh.call(r) === "[object ArrayBuffer]" ? t.input = new Uint8Array(r) : t.input = r, t.next_in = 0, t.avail_in = t.input.length;
  do {
    if (t.avail_out === 0 && (t.output = new En.Buf8(i), t.next_out = 0, t.avail_out = i), a = Oi.inflate(t, me.Z_NO_FLUSH), a === me.Z_NEED_DICT && n && (a = Oi.inflateSetDictionary(this.strm, n)), a === me.Z_BUF_ERROR && u === !0 && (a = me.Z_OK, u = !1), a !== me.Z_STREAM_END && a !== me.Z_OK)
      return this.onEnd(a), this.ended = !0, !1;
    t.next_out && (t.avail_out === 0 || a === me.Z_STREAM_END || t.avail_in === 0 && (s === me.Z_FINISH || s === me.Z_SYNC_FLUSH)) && (this.options.to === "string" ? (o = ts.utf8border(t.output, t.next_out), l = t.next_out - o, c = ts.buf2string(t.output, o), t.next_out = l, t.avail_out = i - l, l && En.arraySet(t.output, t.output, o, l, 0), this.onData(c)) : this.onData(En.shrinkBuf(t.output, t.next_out))), t.avail_in === 0 && t.avail_out === 0 && (u = !0);
  } while ((t.avail_in > 0 || t.avail_out === 0) && a !== me.Z_STREAM_END);
  return a === me.Z_STREAM_END && (s = me.Z_FINISH), s === me.Z_FINISH ? (a = Oi.inflateEnd(this.strm), this.onEnd(a), this.ended = !0, a === me.Z_OK) : (s === me.Z_SYNC_FLUSH && (this.onEnd(me.Z_OK), t.avail_out = 0), !0);
};
ii.prototype.onData = function(r) {
  this.chunks.push(r);
};
ii.prototype.onEnd = function(r) {
  r === me.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = En.flattenChunks(this.chunks)), this.chunks = [], this.err = r, this.msg = this.strm.msg;
};
function jc(r, e) {
  var t = new ii(e);
  if (t.push(r, !0), t.err)
    throw t.msg || Qo[t.err];
  return t.result;
}
function Hp(r, e) {
  return e = e || {}, e.raw = !0, jc(r, e);
}
Aa.Inflate = ii;
Aa.inflate = jc;
Aa.inflateRaw = Hp;
Aa.ungzip = jc;
var qp = Jt.assign, Zp = _a, Kp = Aa, Vp = ah, oh = {};
qp(oh, Zp, Kp, Vp);
var Gp = oh;
const Xp = /* @__PURE__ */ Zf(Gp);
var T = {};
T.toRGBA8 = function(r) {
  var e = r.width, t = r.height;
  if (r.tabs.acTL == null) return [T.toRGBA8.decodeImage(r.data, e, t, r).buffer];
  var i = [];
  r.frames[0].data == null && (r.frames[0].data = r.data);
  for (var n = e * t * 4, a = new Uint8Array(n), s = new Uint8Array(n), o = new Uint8Array(n), l = 0; l < r.frames.length; l++) {
    var c = r.frames[l], u = c.rect.x, f = c.rect.y, h = c.rect.width, d = c.rect.height, b = T.toRGBA8.decodeImage(c.data, h, d, r);
    if (l != 0) for (var p = 0; p < n; p++) o[p] = a[p];
    if (c.blend == 0 ? T._copyTile(b, h, d, a, e, t, u, f, 0) : c.blend == 1 && T._copyTile(b, h, d, a, e, t, u, f, 1), i.push(a.buffer.slice(0)), c.dispose != 0) {
      if (c.dispose == 1) T._copyTile(s, h, d, a, e, t, u, f, 0);
      else if (c.dispose == 2) for (var p = 0; p < n; p++) a[p] = o[p];
    }
  }
  return i;
};
T.toRGBA8.decodeImage = function(r, e, t, i) {
  var n = e * t, a = T.decode._getBPP(i), s = Math.ceil(e * a / 8), o = new Uint8Array(n * 4), l = new Uint32Array(o.buffer), c = i.ctype, u = i.depth, f = T._bin.readUshort;
  if (c == 6) {
    var h = n << 2;
    if (u == 8) for (var d = 0; d < h; d += 4)
      o[d] = r[d], o[d + 1] = r[d + 1], o[d + 2] = r[d + 2], o[d + 3] = r[d + 3];
    if (u == 16) for (var d = 0; d < h; d++)
      o[d] = r[d << 1];
  } else if (c == 2) {
    var b = i.tabs.tRNS;
    if (b == null) {
      if (u == 8) for (var d = 0; d < n; d++) {
        var p = d * 3;
        l[d] = 255 << 24 | r[p + 2] << 16 | r[p + 1] << 8 | r[p];
      }
      if (u == 16) for (var d = 0; d < n; d++) {
        var p = d * 6;
        l[d] = 255 << 24 | r[p + 4] << 16 | r[p + 2] << 8 | r[p];
      }
    } else {
      var m = b[0], g = b[1], S = b[2];
      if (u == 8) for (var d = 0; d < n; d++) {
        var y = d << 2, p = d * 3;
        l[d] = 255 << 24 | r[p + 2] << 16 | r[p + 1] << 8 | r[p], r[p] == m && r[p + 1] == g && r[p + 2] == S && (o[y + 3] = 0);
      }
      if (u == 16) for (var d = 0; d < n; d++) {
        var y = d << 2, p = d * 6;
        l[d] = 255 << 24 | r[p + 4] << 16 | r[p + 2] << 8 | r[p], f(r, p) == m && f(r, p + 2) == g && f(r, p + 4) == S && (o[y + 3] = 0);
      }
    }
  } else if (c == 3) {
    var v = i.tabs.PLTE, A = i.tabs.tRNS, k = A ? A.length : 0;
    if (u == 1) for (var _ = 0; _ < t; _++)
      for (var C = _ * s, P = _ * e, d = 0; d < e; d++) {
        var y = P + d << 2, D = r[C + (d >> 3)] >> 7 - ((d & 7) << 0) & 1, O = 3 * D;
        o[y] = v[O], o[y + 1] = v[O + 1], o[y + 2] = v[O + 2], o[y + 3] = D < k ? A[D] : 255;
      }
    if (u == 2) for (var _ = 0; _ < t; _++)
      for (var C = _ * s, P = _ * e, d = 0; d < e; d++) {
        var y = P + d << 2, D = r[C + (d >> 2)] >> 6 - ((d & 3) << 1) & 3, O = 3 * D;
        o[y] = v[O], o[y + 1] = v[O + 1], o[y + 2] = v[O + 2], o[y + 3] = D < k ? A[D] : 255;
      }
    if (u == 4) for (var _ = 0; _ < t; _++)
      for (var C = _ * s, P = _ * e, d = 0; d < e; d++) {
        var y = P + d << 2, D = r[C + (d >> 1)] >> 4 - ((d & 1) << 2) & 15, O = 3 * D;
        o[y] = v[O], o[y + 1] = v[O + 1], o[y + 2] = v[O + 2], o[y + 3] = D < k ? A[D] : 255;
      }
    if (u == 8) for (var d = 0; d < n; d++) {
      var y = d << 2, D = r[d], O = 3 * D;
      o[y] = v[O], o[y + 1] = v[O + 1], o[y + 2] = v[O + 2], o[y + 3] = D < k ? A[D] : 255;
    }
  } else if (c == 4) {
    if (u == 8) for (var d = 0; d < n; d++) {
      var y = d << 2, j = d << 1, B = r[j];
      o[y] = B, o[y + 1] = B, o[y + 2] = B, o[y + 3] = r[j + 1];
    }
    if (u == 16) for (var d = 0; d < n; d++) {
      var y = d << 2, j = d << 2, B = r[j];
      o[y] = B, o[y + 1] = B, o[y + 2] = B, o[y + 3] = r[j + 2];
    }
  } else if (c == 0)
    for (var m = i.tabs.tRNS ? i.tabs.tRNS : -1, _ = 0; _ < t; _++) {
      var W = _ * s, I = _ * e;
      if (u == 1) for (var N = 0; N < e; N++) {
        var B = 255 * (r[W + (N >>> 3)] >>> 7 - (N & 7) & 1), L = B == m * 255 ? 0 : 255;
        l[I + N] = L << 24 | B << 16 | B << 8 | B;
      }
      else if (u == 2) for (var N = 0; N < e; N++) {
        var B = 85 * (r[W + (N >>> 2)] >>> 6 - ((N & 3) << 1) & 3), L = B == m * 85 ? 0 : 255;
        l[I + N] = L << 24 | B << 16 | B << 8 | B;
      }
      else if (u == 4) for (var N = 0; N < e; N++) {
        var B = 17 * (r[W + (N >>> 1)] >>> 4 - ((N & 1) << 2) & 15), L = B == m * 17 ? 0 : 255;
        l[I + N] = L << 24 | B << 16 | B << 8 | B;
      }
      else if (u == 8) for (var N = 0; N < e; N++) {
        var B = r[W + N], L = B == m ? 0 : 255;
        l[I + N] = L << 24 | B << 16 | B << 8 | B;
      }
      else if (u == 16) for (var N = 0; N < e; N++) {
        var B = r[W + (N << 1)], L = f(r, W + (N << d)) == m ? 0 : 255;
        l[I + N] = L << 24 | B << 16 | B << 8 | B;
      }
    }
  return o;
};
T.decode = function(r) {
  for (var e = new Uint8Array(r), t = 8, i = T._bin, n = i.readUshort, a = i.readUint, s = { tabs: {}, frames: [] }, o = new Uint8Array(e.length), l = 0, c, u = 0, f = [137, 80, 78, 71, 13, 10, 26, 10], h = 0; h < 8; h++) if (e[h] != f[h]) throw "The input is not a PNG file!";
  for (; t < e.length; ) {
    var d = i.readUint(e, t);
    t += 4;
    var b = i.readASCII(e, t, 4);
    if (t += 4, b == "IHDR")
      T.decode._IHDR(e, t, s);
    else if (b == "IDAT") {
      for (var h = 0; h < d; h++) o[l + h] = e[t + h];
      l += d;
    } else if (b == "acTL")
      s.tabs[b] = { num_frames: a(e, t), num_plays: a(e, t + 4) }, c = new Uint8Array(e.length);
    else if (b == "fcTL") {
      if (u != 0) {
        var p = s.frames[s.frames.length - 1];
        p.data = T.decode._decompress(s, c.slice(0, u), p.rect.width, p.rect.height), u = 0;
      }
      var m = { x: a(e, t + 12), y: a(e, t + 16), width: a(e, t + 4), height: a(e, t + 8) }, g = n(e, t + 22);
      g = n(e, t + 20) / (g == 0 ? 100 : g);
      var S = { rect: m, delay: Math.round(g * 1e3), dispose: e[t + 24], blend: e[t + 25] };
      s.frames.push(S);
    } else if (b == "fdAT") {
      for (var h = 0; h < d - 4; h++) c[u + h] = e[t + h + 4];
      u += d - 4;
    } else if (b == "pHYs")
      s.tabs[b] = [i.readUint(e, t), i.readUint(e, t + 4), e[t + 8]];
    else if (b == "cHRM") {
      s.tabs[b] = [];
      for (var h = 0; h < 8; h++) s.tabs[b].push(i.readUint(e, t + h * 4));
    } else if (b == "tEXt") {
      s.tabs[b] == null && (s.tabs[b] = {});
      var y = i.nextZero(e, t), v = i.readASCII(e, t, y - t), A = i.readASCII(e, y + 1, t + d - y - 1);
      s.tabs[b][v] = A;
    } else if (b == "iTXt") {
      s.tabs[b] == null && (s.tabs[b] = {});
      var y = 0, k = t;
      y = i.nextZero(e, k);
      var v = i.readASCII(e, k, y - k);
      k = y + 1, e[k], e[k + 1], k += 2, y = i.nextZero(e, k), i.readASCII(e, k, y - k), k = y + 1, y = i.nextZero(e, k), i.readUTF8(e, k, y - k), k = y + 1;
      var A = i.readUTF8(e, k, d - (k - t));
      s.tabs[b][v] = A;
    } else if (b == "PLTE")
      s.tabs[b] = i.readBytes(e, t, d);
    else if (b == "hIST") {
      var _ = s.tabs.PLTE.length / 3;
      s.tabs[b] = [];
      for (var h = 0; h < _; h++) s.tabs[b].push(n(e, t + h * 2));
    } else if (b == "tRNS")
      s.ctype == 3 ? s.tabs[b] = i.readBytes(e, t, d) : s.ctype == 0 ? s.tabs[b] = n(e, t) : s.ctype == 2 && (s.tabs[b] = [n(e, t), n(e, t + 2), n(e, t + 4)]);
    else if (b == "gAMA") s.tabs[b] = i.readUint(e, t) / 1e5;
    else if (b == "sRGB") s.tabs[b] = e[t];
    else if (b == "bKGD")
      s.ctype == 0 || s.ctype == 4 ? s.tabs[b] = [n(e, t)] : s.ctype == 2 || s.ctype == 6 ? s.tabs[b] = [n(e, t), n(e, t + 2), n(e, t + 4)] : s.ctype == 3 && (s.tabs[b] = e[t]);
    else if (b == "IEND")
      break;
    t += d, i.readUint(e, t), t += 4;
  }
  if (u != 0) {
    var p = s.frames[s.frames.length - 1];
    p.data = T.decode._decompress(s, c.slice(0, u), p.rect.width, p.rect.height), u = 0;
  }
  return s.data = T.decode._decompress(s, o, s.width, s.height), delete s.compress, delete s.interlace, delete s.filter, s;
};
T.decode._decompress = function(r, e, t, i) {
  var n = T.decode._getBPP(r), a = Math.ceil(t * n / 8), s = new Uint8Array((a + 1 + r.interlace) * i);
  return e = T.decode._inflate(e, s), r.interlace == 0 ? e = T.decode._filterZero(e, r, 0, t, i) : r.interlace == 1 && (e = T.decode._readInterlace(e, r)), e;
};
T.decode._inflate = function(r, e) {
  var t = T.inflateRaw(new Uint8Array(r.buffer, 2, r.length - 6), e);
  return t;
};
T.inflateRaw = function() {
  var r = {};
  return r.H = {}, r.H.N = function(e, t) {
    var i = Uint8Array, n = 0, a = 0, s = 0, o = 0, l = 0, c = 0, u = 0, f = 0, h = 0, d, b;
    if (e[0] == 3 && e[1] == 0) return t || new i(0);
    var p = r.H, m = p.b, g = p.e, S = p.R, y = p.n, v = p.A, A = p.Z, k = p.m, _ = t == null;
    for (_ && (t = new i(e.length >>> 2 << 3)); n == 0; ) {
      if (n = m(e, h, 1), a = m(e, h + 1, 2), h += 3, a == 0) {
        h & 7 && (h += 8 - (h & 7));
        var C = (h >>> 3) + 4, P = e[C - 4] | e[C - 3] << 8;
        _ && (t = r.H.W(t, f + P)), t.set(new i(e.buffer, e.byteOffset + C, P), f), h = C + P << 3, f += P;
        continue;
      }
      if (_ && (t = r.H.W(t, f + (1 << 17))), a == 1 && (d = k.J, b = k.h, c = 511, u = 31), a == 2) {
        s = g(e, h, 5) + 257, o = g(e, h + 5, 5) + 1, l = g(e, h + 10, 4) + 4, h += 14;
        for (var D = 1, O = 0; O < 38; O += 2)
          k.Q[O] = 0, k.Q[O + 1] = 0;
        for (var O = 0; O < l; O++) {
          var j = g(e, h + O * 3, 3);
          k.Q[(k.X[O] << 1) + 1] = j, j > D && (D = j);
        }
        h += 3 * l, y(k.Q, D), v(k.Q, D, k.u), d = k.w, b = k.d, h = S(k.u, (1 << D) - 1, s + o, e, h, k.v);
        var B = p.V(k.v, 0, s, k.C);
        c = (1 << B) - 1;
        var W = p.V(k.v, s, o, k.D);
        u = (1 << W) - 1, y(k.C, B), v(k.C, B, d), y(k.D, W), v(k.D, W, b);
      }
      for (; ; ) {
        var I = d[A(e, h) & c];
        h += I & 15;
        var N = I >>> 4;
        if (!(N >>> 8))
          t[f++] = N;
        else {
          if (N == 256)
            break;
          var L = f + N - 254;
          if (N > 264) {
            var re = k.q[N - 257];
            L = f + (re >>> 3) + g(e, h, re & 7), h += re & 7;
          }
          var ce = b[A(e, h) & u];
          h += ce & 15;
          var de = ce >>> 4, ue = k.c[de], pe = (ue >>> 4) + m(e, h, ue & 15);
          for (h += ue & 15; f < L; )
            t[f] = t[f++ - pe], t[f] = t[f++ - pe], t[f] = t[f++ - pe], t[f] = t[f++ - pe];
          f = L;
        }
      }
    }
    return t.length == f ? t : t.slice(0, f);
  }, r.H.W = function(e, t) {
    var i = e.length;
    if (t <= i) return e;
    var n = new Uint8Array(i << 1);
    return n.set(e, 0), n;
  }, r.H.R = function(e, t, i, n, a, s) {
    for (var o = r.H.e, l = r.H.Z, c = 0; c < i; ) {
      var u = e[l(n, a) & t];
      a += u & 15;
      var f = u >>> 4;
      if (f <= 15)
        s[c] = f, c++;
      else {
        var h = 0, d = 0;
        f == 16 ? (d = 3 + o(n, a, 2), a += 2, h = s[c - 1]) : f == 17 ? (d = 3 + o(n, a, 3), a += 3) : f == 18 && (d = 11 + o(n, a, 7), a += 7);
        for (var b = c + d; c < b; )
          s[c] = h, c++;
      }
    }
    return a;
  }, r.H.V = function(e, t, i, n) {
    for (var a = 0, s = 0, o = n.length >>> 1; s < i; ) {
      var l = e[s + t];
      n[s << 1] = 0, n[(s << 1) + 1] = l, l > a && (a = l), s++;
    }
    for (; s < o; )
      n[s << 1] = 0, n[(s << 1) + 1] = 0, s++;
    return a;
  }, r.H.n = function(e, t) {
    for (var i = r.H.m, n = e.length, a, s, o, l, c, u = i.j, l = 0; l <= t; l++) u[l] = 0;
    for (l = 1; l < n; l += 2) u[e[l]]++;
    var f = i.K;
    for (a = 0, u[0] = 0, s = 1; s <= t; s++)
      a = a + u[s - 1] << 1, f[s] = a;
    for (o = 0; o < n; o += 2)
      c = e[o + 1], c != 0 && (e[o] = f[c], f[c]++);
  }, r.H.A = function(e, t, i) {
    for (var n = e.length, a = r.H.m, s = a.r, o = 0; o < n; o += 2) if (e[o + 1] != 0)
      for (var l = o >> 1, c = e[o + 1], u = l << 4 | c, f = t - c, h = e[o] << f, d = h + (1 << f); h != d; ) {
        var b = s[h] >>> 15 - t;
        i[b] = u, h++;
      }
  }, r.H.l = function(e, t) {
    for (var i = r.H.m.r, n = 15 - t, a = 0; a < e.length; a += 2) {
      var s = e[a] << t - e[a + 1];
      e[a] = i[s] >>> n;
    }
  }, r.H.M = function(e, t, i) {
    i = i << (t & 7);
    var n = t >>> 3;
    e[n] |= i, e[n + 1] |= i >>> 8;
  }, r.H.I = function(e, t, i) {
    i = i << (t & 7);
    var n = t >>> 3;
    e[n] |= i, e[n + 1] |= i >>> 8, e[n + 2] |= i >>> 16;
  }, r.H.e = function(e, t, i) {
    return (e[t >>> 3] | e[(t >>> 3) + 1] << 8) >>> (t & 7) & (1 << i) - 1;
  }, r.H.b = function(e, t, i) {
    return (e[t >>> 3] | e[(t >>> 3) + 1] << 8 | e[(t >>> 3) + 2] << 16) >>> (t & 7) & (1 << i) - 1;
  }, r.H.Z = function(e, t) {
    return (e[t >>> 3] | e[(t >>> 3) + 1] << 8 | e[(t >>> 3) + 2] << 16) >>> (t & 7);
  }, r.H.i = function(e, t) {
    return (e[t >>> 3] | e[(t >>> 3) + 1] << 8 | e[(t >>> 3) + 2] << 16 | e[(t >>> 3) + 3] << 24) >>> (t & 7);
  }, r.H.m = function() {
    var e = Uint16Array, t = Uint32Array;
    return { K: new e(16), j: new e(16), X: [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], S: [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 999, 999, 999], T: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0], q: new e(32), p: [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 65535, 65535], z: [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0], c: new t(32), J: new e(512), _: [], h: new e(32), $: [], w: new e(32768), C: [], v: [], d: new e(32768), D: [], u: new e(512), Q: [], r: new e(32768), s: new t(286), Y: new t(30), a: new t(19), t: new t(15e3), k: new e(65536), g: new e(32768) };
  }(), function() {
    for (var e = r.H.m, t = 32768, i = 0; i < t; i++) {
      var n = i;
      n = (n & 2863311530) >>> 1 | (n & 1431655765) << 1, n = (n & 3435973836) >>> 2 | (n & 858993459) << 2, n = (n & 4042322160) >>> 4 | (n & 252645135) << 4, n = (n & 4278255360) >>> 8 | (n & 16711935) << 8, e.r[i] = (n >>> 16 | n << 16) >>> 17;
    }
    function a(s, o, l) {
      for (; o-- != 0; ) s.push(0, l);
    }
    for (var i = 0; i < 32; i++)
      e.q[i] = e.S[i] << 3 | e.T[i], e.c[i] = e.p[i] << 4 | e.z[i];
    a(e._, 144, 8), a(e._, 112, 9), a(e._, 24, 7), a(e._, 8, 8), r.H.n(e._, 9), r.H.A(e._, 9, e.J), r.H.l(e._, 9), a(e.$, 32, 5), r.H.n(e.$, 5), r.H.A(e.$, 5, e.h), r.H.l(e.$, 5), a(e.Q, 19, 0), a(e.C, 286, 0), a(e.D, 30, 0), a(e.v, 320, 0);
  }(), r.H.N;
}();
T.decode._readInterlace = function(r, e) {
  for (var t = e.width, i = e.height, n = T.decode._getBPP(e), a = n >> 3, s = Math.ceil(t * n / 8), o = new Uint8Array(i * s), l = 0, c = [0, 0, 4, 0, 2, 0, 1], u = [0, 4, 0, 2, 0, 1, 0], f = [8, 8, 8, 4, 4, 2, 2], h = [8, 8, 4, 4, 2, 2, 1], d = 0; d < 7; ) {
    for (var b = f[d], p = h[d], m = 0, g = 0, S = c[d]; S < i; )
      S += b, g++;
    for (var y = u[d]; y < t; )
      y += p, m++;
    var v = Math.ceil(m * n / 8);
    T.decode._filterZero(r, e, l, m, g);
    for (var A = 0, k = c[d]; k < i; ) {
      for (var _ = u[d], C = l + A * v << 3; _ < t; ) {
        if (n == 1) {
          var P = r[C >> 3];
          P = P >> 7 - (C & 7) & 1, o[k * s + (_ >> 3)] |= P << 7 - ((_ & 7) << 0);
        }
        if (n == 2) {
          var P = r[C >> 3];
          P = P >> 6 - (C & 7) & 3, o[k * s + (_ >> 2)] |= P << 6 - ((_ & 3) << 1);
        }
        if (n == 4) {
          var P = r[C >> 3];
          P = P >> 4 - (C & 7) & 15, o[k * s + (_ >> 1)] |= P << 4 - ((_ & 1) << 2);
        }
        if (n >= 8)
          for (var D = k * s + _ * a, O = 0; O < a; O++) o[D + O] = r[(C >> 3) + O];
        C += n, _ += p;
      }
      A++, k += b;
    }
    m * g != 0 && (l += g * (1 + v)), d = d + 1;
  }
  return o;
};
T.decode._getBPP = function(r) {
  var e = [1, null, 3, 1, 2, null, 4][r.ctype];
  return e * r.depth;
};
T.decode._filterZero = function(r, e, t, i, n) {
  var a = T.decode._getBPP(e), s = Math.ceil(i * a / 8), o = T.decode._paeth;
  a = Math.ceil(a / 8);
  var l = 0, c = 1, u = r[t], f = 0;
  if (u > 1 && (r[t] = [0, 0, 1][u - 2]), u == 3) for (f = a; f < s; f++) r[f + 1] = r[f + 1] + (r[f + 1 - a] >>> 1) & 255;
  for (var h = 0; h < n; h++)
    if (l = t + h * s, c = l + h + 1, u = r[c - 1], f = 0, u == 0) for (; f < s; f++) r[l + f] = r[c + f];
    else if (u == 1) {
      for (; f < a; f++) r[l + f] = r[c + f];
      for (; f < s; f++) r[l + f] = r[c + f] + r[l + f - a];
    } else if (u == 2)
      for (; f < s; f++) r[l + f] = r[c + f] + r[l + f - s];
    else if (u == 3) {
      for (; f < a; f++) r[l + f] = r[c + f] + (r[l + f - s] >>> 1);
      for (; f < s; f++) r[l + f] = r[c + f] + (r[l + f - s] + r[l + f - a] >>> 1);
    } else {
      for (; f < a; f++) r[l + f] = r[c + f] + o(0, r[l + f - s], 0);
      for (; f < s; f++) r[l + f] = r[c + f] + o(r[l + f - a], r[l + f - s], r[l + f - a - s]);
    }
  return r;
};
T.decode._paeth = function(r, e, t) {
  var i = r + e - t, n = i - r, a = i - e, s = i - t;
  return n * n <= a * a && n * n <= s * s ? r : a * a <= s * s ? e : t;
};
T.decode._IHDR = function(r, e, t) {
  var i = T._bin;
  t.width = i.readUint(r, e), e += 4, t.height = i.readUint(r, e), e += 4, t.depth = r[e], e++, t.ctype = r[e], e++, t.compress = r[e], e++, t.filter = r[e], e++, t.interlace = r[e], e++;
};
T._bin = {
  nextZero: function(r, e) {
    for (; r[e] != 0; ) e++;
    return e;
  },
  readUshort: function(r, e) {
    return r[e] << 8 | r[e + 1];
  },
  writeUshort: function(r, e, t) {
    r[e] = t >> 8 & 255, r[e + 1] = t & 255;
  },
  readUint: function(r, e) {
    return r[e] * (256 * 256 * 256) + (r[e + 1] << 16 | r[e + 2] << 8 | r[e + 3]);
  },
  writeUint: function(r, e, t) {
    r[e] = t >> 24 & 255, r[e + 1] = t >> 16 & 255, r[e + 2] = t >> 8 & 255, r[e + 3] = t & 255;
  },
  readASCII: function(r, e, t) {
    for (var i = "", n = 0; n < t; n++) i += String.fromCharCode(r[e + n]);
    return i;
  },
  writeASCII: function(r, e, t) {
    for (var i = 0; i < t.length; i++) r[e + i] = t.charCodeAt(i);
  },
  readBytes: function(r, e, t) {
    for (var i = [], n = 0; n < t; n++) i.push(r[e + n]);
    return i;
  },
  pad: function(r) {
    return r.length < 2 ? "0" + r : r;
  },
  readUTF8: function(r, e, t) {
    for (var i = "", n, a = 0; a < t; a++) i += "%" + T._bin.pad(r[e + a].toString(16));
    try {
      n = decodeURIComponent(i);
    } catch {
      return T._bin.readASCII(r, e, t);
    }
    return n;
  }
};
T._copyTile = function(r, e, t, i, n, a, s, o, l) {
  for (var c = Math.min(e, n), u = Math.min(t, a), f = 0, h = 0, d = 0; d < u; d++)
    for (var b = 0; b < c; b++)
      if (s >= 0 && o >= 0 ? (f = d * e + b << 2, h = (o + d) * n + s + b << 2) : (f = (-o + d) * e - s + b << 2, h = d * n + b << 2), l == 0)
        i[h] = r[f], i[h + 1] = r[f + 1], i[h + 2] = r[f + 2], i[h + 3] = r[f + 3];
      else if (l == 1) {
        var p = r[f + 3] * 0.00392156862745098, m = r[f] * p, g = r[f + 1] * p, S = r[f + 2] * p, y = i[h + 3] * (1 / 255), v = i[h] * y, A = i[h + 1] * y, k = i[h + 2] * y, _ = 1 - p, C = p + y * _, P = C == 0 ? 0 : 1 / C;
        i[h + 3] = 255 * C, i[h + 0] = (m + v * _) * P, i[h + 1] = (g + A * _) * P, i[h + 2] = (S + k * _) * P;
      } else if (l == 2) {
        var p = r[f + 3], m = r[f], g = r[f + 1], S = r[f + 2], y = i[h + 3], v = i[h], A = i[h + 1], k = i[h + 2];
        p == y && m == v && g == A && S == k ? (i[h] = 0, i[h + 1] = 0, i[h + 2] = 0, i[h + 3] = 0) : (i[h] = m, i[h + 1] = g, i[h + 2] = S, i[h + 3] = p);
      } else if (l == 3) {
        var p = r[f + 3], m = r[f], g = r[f + 1], S = r[f + 2], y = i[h + 3], v = i[h], A = i[h + 1], k = i[h + 2];
        if (p == y && m == v && g == A && S == k) continue;
        if (p < 220 && y > 20) return !1;
      }
  return !0;
};
T.encode = function(r, e, t, i, n, a, s) {
  i == null && (i = 0), s == null && (s = !1);
  var o = T.encode.compress(r, e, t, i, [!1, !1, !1, 0, s]);
  return T.encode.compressPNG(o, -1), T.encode._main(o, e, t, n, a);
};
T.encodeLL = function(r, e, t, i, n, a, s, o) {
  for (var l = { ctype: 0 + (i == 1 ? 0 : 2) + (n == 0 ? 0 : 4), depth: a, frames: [] }, c = (i + n) * a, u = c * e, f = 0; f < r.length; f++)
    l.frames.push({ rect: { x: 0, y: 0, width: e, height: t }, img: new Uint8Array(r[f]), blend: 0, dispose: 1, bpp: Math.ceil(c / 8), bpl: Math.ceil(u / 8) });
  T.encode.compressPNG(l, 0, !0);
  var h = T.encode._main(l, e, t, s, o);
  return h;
};
T.encode._main = function(r, e, t, i, n) {
  n == null && (n = {});
  var a = T.crc.crc, s = T._bin.writeUint, o = T._bin.writeUshort, l = T._bin.writeASCII, c = 8, u = r.frames.length > 1, f = !1, h = 33 + (u ? 20 : 0);
  if (n.sRGB != null && (h += 13), n.pHYs != null && (h += 21), r.ctype == 3) {
    for (var d = r.plte.length, b = 0; b < d; b++) r.plte[b] >>> 24 != 255 && (f = !0);
    h += 8 + d * 3 + 4 + (f ? 8 + d * 1 + 4 : 0);
  }
  for (var p = 0; p < r.frames.length; p++) {
    var m = r.frames[p];
    u && (h += 38), h += m.cimg.length + 12, p != 0 && (h += 4);
  }
  h += 12;
  for (var g = new Uint8Array(h), S = [137, 80, 78, 71, 13, 10, 26, 10], b = 0; b < 8; b++) g[b] = S[b];
  if (s(g, c, 13), c += 4, l(g, c, "IHDR"), c += 4, s(g, c, e), c += 4, s(g, c, t), c += 4, g[c] = r.depth, c++, g[c] = r.ctype, c++, g[c] = 0, c++, g[c] = 0, c++, g[c] = 0, c++, s(g, c, a(g, c - 17, 17)), c += 4, n.sRGB != null && (s(g, c, 1), c += 4, l(g, c, "sRGB"), c += 4, g[c] = n.sRGB, c++, s(g, c, a(g, c - 5, 5)), c += 4), n.pHYs != null && (s(g, c, 9), c += 4, l(g, c, "pHYs"), c += 4, s(g, c, n.pHYs[0]), c += 4, s(g, c, n.pHYs[1]), c += 4, g[c] = n.pHYs[2], c++, s(g, c, a(g, c - 13, 13)), c += 4), u && (s(g, c, 8), c += 4, l(g, c, "acTL"), c += 4, s(g, c, r.frames.length), c += 4, s(g, c, n.loop != null ? n.loop : 0), c += 4, s(g, c, a(g, c - 12, 12)), c += 4), r.ctype == 3) {
    var d = r.plte.length;
    s(g, c, d * 3), c += 4, l(g, c, "PLTE"), c += 4;
    for (var b = 0; b < d; b++) {
      var y = b * 3, v = r.plte[b], A = v & 255, k = v >>> 8 & 255, _ = v >>> 16 & 255;
      g[c + y + 0] = A, g[c + y + 1] = k, g[c + y + 2] = _;
    }
    if (c += d * 3, s(g, c, a(g, c - d * 3 - 4, d * 3 + 4)), c += 4, f) {
      s(g, c, d), c += 4, l(g, c, "tRNS"), c += 4;
      for (var b = 0; b < d; b++) g[c + b] = r.plte[b] >>> 24 & 255;
      c += d, s(g, c, a(g, c - d - 4, d + 4)), c += 4;
    }
  }
  for (var C = 0, p = 0; p < r.frames.length; p++) {
    var m = r.frames[p];
    u && (s(g, c, 26), c += 4, l(g, c, "fcTL"), c += 4, s(g, c, C++), c += 4, s(g, c, m.rect.width), c += 4, s(g, c, m.rect.height), c += 4, s(g, c, m.rect.x), c += 4, s(g, c, m.rect.y), c += 4, o(g, c, i[p]), c += 2, o(g, c, 1e3), c += 2, g[c] = m.dispose, c++, g[c] = m.blend, c++, s(g, c, a(g, c - 30, 30)), c += 4);
    var P = m.cimg, d = P.length;
    s(g, c, d + (p == 0 ? 0 : 4)), c += 4;
    var D = c;
    l(g, c, p == 0 ? "IDAT" : "fdAT"), c += 4, p != 0 && (s(g, c, C++), c += 4), g.set(P, c), c += d, s(g, c, a(g, D, c - D)), c += 4;
  }
  return s(g, c, 0), c += 4, l(g, c, "IEND"), c += 4, s(g, c, a(g, c - 4, 4)), c += 4, g.buffer;
};
T.encode.compressPNG = function(r, e, t) {
  for (var i = 0; i < r.frames.length; i++) {
    var n = r.frames[i];
    n.rect.width;
    var a = n.rect.height, s = new Uint8Array(a * n.bpl + a);
    n.cimg = T.encode._filterZero(n.img, a, n.bpp, n.bpl, s, e, t);
  }
};
T.encode.compress = function(r, e, t, i, n) {
  for (var a = n[0], s = n[1], o = n[2], l = n[3], c = n[4], u = 6, f = 8, h = 255, d = 0; d < r.length; d++)
    for (var b = new Uint8Array(r[d]), p = b.length, m = 0; m < p; m += 4) h &= b[m + 3];
  var g = h != 255, S = T.encode.framize(r, e, t, a, s, o), y = {}, v = [], A = [];
  if (i != 0) {
    for (var k = [], m = 0; m < S.length; m++) k.push(S[m].img.buffer);
    for (var _ = T.encode.concatRGBA(k), C = T.quantize(_, i), P = 0, D = new Uint8Array(C.abuf), m = 0; m < S.length; m++) {
      var O = S[m].img, j = O.length;
      A.push(new Uint8Array(C.inds.buffer, P >> 2, j >> 2));
      for (var d = 0; d < j; d += 4)
        O[d] = D[P + d], O[d + 1] = D[P + d + 1], O[d + 2] = D[P + d + 2], O[d + 3] = D[P + d + 3];
      P += j;
    }
    for (var m = 0; m < C.plte.length; m++) v.push(C.plte[m].est.rgba);
  } else
    for (var d = 0; d < S.length; d++) {
      var B = S[d], W = new Uint32Array(B.img.buffer), I = B.rect.width, p = W.length, N = new Uint8Array(p);
      A.push(N);
      for (var m = 0; m < p; m++) {
        var L = W[m];
        if (m != 0 && L == W[m - 1]) N[m] = N[m - 1];
        else if (m > I && L == W[m - I]) N[m] = N[m - I];
        else {
          var re = y[L];
          if (re == null && (y[L] = re = v.length, v.push(L), v.length >= 300))
            break;
          N[m] = re;
        }
      }
    }
  var ce = v.length;
  ce <= 256 && c == !1 && (ce <= 2 ? f = 1 : ce <= 4 ? f = 2 : ce <= 16 ? f = 4 : f = 8, f = Math.max(f, l));
  for (var d = 0; d < S.length; d++) {
    var B = S[d];
    B.rect.x, B.rect.y;
    var I = B.rect.width, de = B.rect.height, ue = B.img;
    new Uint32Array(ue.buffer);
    var pe = 4 * I, ze = 4;
    if (ce <= 256 && c == !1) {
      pe = Math.ceil(f * I / 8);
      for (var oe = new Uint8Array(pe * de), er = A[d], Ea = 0; Ea < de; Ea++) {
        var m = Ea * pe, Ta = Ea * I;
        if (f == 8) for (var ge = 0; ge < I; ge++) oe[m + ge] = er[Ta + ge];
        else if (f == 4) for (var ge = 0; ge < I; ge++) oe[m + (ge >> 1)] |= er[Ta + ge] << 4 - (ge & 1) * 4;
        else if (f == 2) for (var ge = 0; ge < I; ge++) oe[m + (ge >> 2)] |= er[Ta + ge] << 6 - (ge & 3) * 2;
        else if (f == 1) for (var ge = 0; ge < I; ge++) oe[m + (ge >> 3)] |= er[Ta + ge] << 7 - (ge & 7) * 1;
      }
      ue = oe, u = 3, ze = 1;
    } else if (g == !1 && S.length == 1) {
      for (var oe = new Uint8Array(I * de * 3), Zh = I * de, m = 0; m < Zh; m++) {
        var O = m * 3, Xs = m * 4;
        oe[O] = ue[Xs], oe[O + 1] = ue[Xs + 1], oe[O + 2] = ue[Xs + 2];
      }
      ue = oe, u = 2, ze = 3, pe = 3 * I;
    }
    B.img = ue, B.bpl = pe, B.bpp = ze;
  }
  return { ctype: u, depth: f, plte: v, frames: S };
};
T.encode.framize = function(r, e, t, i, n, a) {
  for (var s = [], o = 0; o < r.length; o++) {
    var l = new Uint8Array(r[o]), c = new Uint32Array(l.buffer), u, f = 0, h = 0, d = e, b = t, p = i ? 1 : 0;
    if (o != 0) {
      for (var m = a || i || o == 1 || s[o - 2].dispose != 0 ? 1 : 2, g = 0, S = 1e9, y = 0; y < m; y++) {
        for (var B = new Uint8Array(r[o - 1 - y]), v = new Uint32Array(r[o - 1 - y]), A = e, k = t, _ = -1, C = -1, P = 0; P < t; P++) for (var D = 0; D < e; D++) {
          var O = P * e + D;
          c[O] != v[O] && (D < A && (A = D), D > _ && (_ = D), P < k && (k = P), P > C && (C = P));
        }
        _ == -1 && (A = k = _ = C = 0), n && ((A & 1) == 1 && A--, (k & 1) == 1 && k--);
        var j = (_ - A + 1) * (C - k + 1);
        j < S && (S = j, g = y, f = A, h = k, d = _ - A + 1, b = C - k + 1);
      }
      var B = new Uint8Array(r[o - 1 - g]);
      g == 1 && (s[o - 1].dispose = 2), u = new Uint8Array(d * b * 4), T._copyTile(B, e, t, u, d, b, -f, -h, 0), p = T._copyTile(l, e, t, u, d, b, -f, -h, 3) ? 1 : 0, p == 1 ? T.encode._prepareDiff(l, e, t, u, { x: f, y: h, width: d, height: b }) : T._copyTile(l, e, t, u, d, b, -f, -h, 0);
    } else u = l.slice(0);
    s.push({ rect: { x: f, y: h, width: d, height: b }, img: u, blend: p, dispose: 0 });
  }
  if (i) for (var o = 0; o < s.length; o++) {
    var W = s[o];
    if (W.blend != 1) {
      var I = W.rect, N = s[o - 1].rect, L = Math.min(I.x, N.x), re = Math.min(I.y, N.y), ce = Math.max(I.x + I.width, N.x + N.width), de = Math.max(I.y + I.height, N.y + N.height), ue = { x: L, y: re, width: ce - L, height: de - re };
      s[o - 1].dispose = 1, o - 1 != 0 && T.encode._updateFrame(r, e, t, s, o - 1, ue, n), T.encode._updateFrame(r, e, t, s, o, ue, n);
    }
  }
  var pe = 0;
  if (r.length != 1) for (var O = 0; O < s.length; O++) {
    var W = s[O];
    pe += W.rect.width * W.rect.height;
  }
  return s;
};
T.encode._updateFrame = function(r, e, t, i, n, a, s) {
  for (var o = Uint8Array, l = Uint32Array, c = new o(r[n - 1]), u = new l(r[n - 1]), f = n + 1 < r.length ? new o(r[n + 1]) : null, h = new o(r[n]), d = new l(h.buffer), b = e, p = t, m = -1, g = -1, S = 0; S < a.height; S++) for (var y = 0; y < a.width; y++) {
    var v = a.x + y, A = a.y + S, k = A * e + v, _ = d[k];
    _ == 0 || i[n - 1].dispose == 0 && u[k] == _ && (f == null || f[k * 4 + 3] != 0) || (v < b && (b = v), v > m && (m = v), A < p && (p = A), A > g && (g = A));
  }
  m == -1 && (b = p = m = g = 0), s && ((b & 1) == 1 && b--, (p & 1) == 1 && p--), a = { x: b, y: p, width: m - b + 1, height: g - p + 1 };
  var C = i[n];
  C.rect = a, C.blend = 1, C.img = new Uint8Array(a.width * a.height * 4), i[n - 1].dispose == 0 ? (T._copyTile(c, e, t, C.img, a.width, a.height, -a.x, -a.y, 0), T.encode._prepareDiff(h, e, t, C.img, a)) : T._copyTile(h, e, t, C.img, a.width, a.height, -a.x, -a.y, 0);
};
T.encode._prepareDiff = function(r, e, t, i, n) {
  T._copyTile(r, e, t, i, n.width, n.height, -n.x, -n.y, 2);
};
T.encode._filterZero = function(r, e, t, i, n, a, s) {
  var o = [], l = [0, 1, 2, 3, 4];
  a != -1 ? l = [a] : (e * i > 5e5 || t == 1) && (l = [0]);
  var c;
  s && (c = { level: 0 });
  for (var u = s && UZIP != null ? UZIP : Xp, f = 0; f < l.length; f++) {
    for (var h = 0; h < e; h++) T.encode._filterLine(n, r, h, i, t, l[f]);
    o.push(u.deflate(n, c));
  }
  for (var d, b = 1e9, f = 0; f < o.length; f++) o[f].length < b && (d = f, b = o[f].length);
  return o[d];
};
T.encode._filterLine = function(r, e, t, i, n, a) {
  var s = t * i, o = s + t, l = T.decode._paeth;
  if (r[o] = a, o++, a == 0)
    if (i < 500) for (var c = 0; c < i; c++) r[o + c] = e[s + c];
    else r.set(new Uint8Array(e.buffer, s, i), o);
  else if (a == 1) {
    for (var c = 0; c < n; c++) r[o + c] = e[s + c];
    for (var c = n; c < i; c++) r[o + c] = e[s + c] - e[s + c - n] + 256 & 255;
  } else if (t == 0) {
    for (var c = 0; c < n; c++) r[o + c] = e[s + c];
    if (a == 2) for (var c = n; c < i; c++) r[o + c] = e[s + c];
    if (a == 3) for (var c = n; c < i; c++) r[o + c] = e[s + c] - (e[s + c - n] >> 1) + 256 & 255;
    if (a == 4) for (var c = n; c < i; c++) r[o + c] = e[s + c] - l(e[s + c - n], 0, 0) + 256 & 255;
  } else {
    if (a == 2)
      for (var c = 0; c < i; c++) r[o + c] = e[s + c] + 256 - e[s + c - i] & 255;
    if (a == 3) {
      for (var c = 0; c < n; c++) r[o + c] = e[s + c] + 256 - (e[s + c - i] >> 1) & 255;
      for (var c = n; c < i; c++) r[o + c] = e[s + c] + 256 - (e[s + c - i] + e[s + c - n] >> 1) & 255;
    }
    if (a == 4) {
      for (var c = 0; c < n; c++) r[o + c] = e[s + c] + 256 - l(0, e[s + c - i], 0) & 255;
      for (var c = n; c < i; c++) r[o + c] = e[s + c] + 256 - l(e[s + c - n], e[s + c - i], e[s + c - n - i]) & 255;
    }
  }
};
T.crc = {
  table: function() {
    for (var r = new Uint32Array(256), e = 0; e < 256; e++) {
      for (var t = e, i = 0; i < 8; i++)
        t & 1 ? t = 3988292384 ^ t >>> 1 : t = t >>> 1;
      r[e] = t;
    }
    return r;
  }(),
  update: function(r, e, t, i) {
    for (var n = 0; n < i; n++) r = T.crc.table[(r ^ e[t + n]) & 255] ^ r >>> 8;
    return r;
  },
  crc: function(r, e, t) {
    return T.crc.update(4294967295, r, e, t) ^ 4294967295;
  }
};
T.quantize = function(r, e) {
  var t = new Uint8Array(r), i = t.slice(0), n = new Uint32Array(i.buffer), a = T.quantize.getKDtree(i, e), s = a[0], o = a[1];
  T.quantize.planeDst;
  for (var l = t, c = n, u = l.length, f = new Uint8Array(t.length >> 2), h = 0; h < u; h += 4) {
    var d = l[h] * 0.00392156862745098, b = l[h + 1] * (1 / 255), p = l[h + 2] * (1 / 255), m = l[h + 3] * (1 / 255), g = T.quantize.getNearest(s, d, b, p, m);
    f[h >> 2] = g.ind, c[h >> 2] = g.est.rgba;
  }
  return { abuf: i.buffer, inds: f, plte: o };
};
T.quantize.getKDtree = function(r, e, t) {
  t == null && (t = 1e-4);
  var i = new Uint32Array(r.buffer), n = { i0: 0, i1: r.length, bst: null, est: null, tdst: 0, left: null, right: null };
  n.bst = T.quantize.stats(r, n.i0, n.i1), n.est = T.quantize.estats(n.bst);
  for (var a = [n]; a.length < e; ) {
    for (var s = 0, o = 0, l = 0; l < a.length; l++) a[l].est.L > s && (s = a[l].est.L, o = l);
    if (s < t) break;
    var c = a[o], u = T.quantize.splitPixels(r, i, c.i0, c.i1, c.est.e, c.est.eMq255), f = c.i0 >= u || c.i1 <= u;
    if (f) {
      c.est.L = 0;
      continue;
    }
    var h = { i0: c.i0, i1: u, bst: null, est: null, tdst: 0, left: null, right: null };
    h.bst = T.quantize.stats(r, h.i0, h.i1), h.est = T.quantize.estats(h.bst);
    var d = { i0: u, i1: c.i1, bst: null, est: null, tdst: 0, left: null, right: null };
    d.bst = { R: [], m: [], N: c.bst.N - h.bst.N };
    for (var l = 0; l < 16; l++) d.bst.R[l] = c.bst.R[l] - h.bst.R[l];
    for (var l = 0; l < 4; l++) d.bst.m[l] = c.bst.m[l] - h.bst.m[l];
    d.est = T.quantize.estats(d.bst), c.left = h, c.right = d, a[o] = h, a.push(d);
  }
  a.sort(function(b, p) {
    return p.bst.N - b.bst.N;
  });
  for (var l = 0; l < a.length; l++) a[l].ind = l;
  return [n, a];
};
T.quantize.getNearest = function(r, e, t, i, n) {
  if (r.left == null)
    return r.tdst = T.quantize.dist(r.est.q, e, t, i, n), r;
  var a = T.quantize.planeDst(r.est, e, t, i, n), s = r.left, o = r.right;
  a > 0 && (s = r.right, o = r.left);
  var l = T.quantize.getNearest(s, e, t, i, n);
  if (l.tdst <= a * a) return l;
  var c = T.quantize.getNearest(o, e, t, i, n);
  return c.tdst < l.tdst ? c : l;
};
T.quantize.planeDst = function(r, e, t, i, n) {
  var a = r.e;
  return a[0] * e + a[1] * t + a[2] * i + a[3] * n - r.eMq;
};
T.quantize.dist = function(r, e, t, i, n) {
  var a = e - r[0], s = t - r[1], o = i - r[2], l = n - r[3];
  return a * a + s * s + o * o + l * l;
};
T.quantize.splitPixels = function(r, e, t, i, n, a) {
  var s = T.quantize.vecDot;
  for (i -= 4; t < i; ) {
    for (; s(r, t, n) <= a; ) t += 4;
    for (; s(r, i, n) > a; ) i -= 4;
    if (t >= i) break;
    var o = e[t >> 2];
    e[t >> 2] = e[i >> 2], e[i >> 2] = o, t += 4, i -= 4;
  }
  for (; s(r, t, n) > a; ) t -= 4;
  return t + 4;
};
T.quantize.vecDot = function(r, e, t) {
  return r[e] * t[0] + r[e + 1] * t[1] + r[e + 2] * t[2] + r[e + 3] * t[3];
};
T.quantize.stats = function(r, e, t) {
  for (var i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], n = [0, 0, 0, 0], a = t - e >> 2, s = e; s < t; s += 4) {
    var o = r[s] * 0.00392156862745098, l = r[s + 1] * (1 / 255), c = r[s + 2] * (1 / 255), u = r[s + 3] * (1 / 255);
    n[0] += o, n[1] += l, n[2] += c, n[3] += u, i[0] += o * o, i[1] += o * l, i[2] += o * c, i[3] += o * u, i[5] += l * l, i[6] += l * c, i[7] += l * u, i[10] += c * c, i[11] += c * u, i[15] += u * u;
  }
  return i[4] = i[1], i[8] = i[2], i[9] = i[6], i[12] = i[3], i[13] = i[7], i[14] = i[11], { R: i, m: n, N: a };
};
T.quantize.estats = function(r) {
  var e = r.R, t = r.m, i = r.N, n = t[0], a = t[1], s = t[2], o = t[3], l = i == 0 ? 0 : 1 / i, c = [
    e[0] - n * n * l,
    e[1] - n * a * l,
    e[2] - n * s * l,
    e[3] - n * o * l,
    e[4] - a * n * l,
    e[5] - a * a * l,
    e[6] - a * s * l,
    e[7] - a * o * l,
    e[8] - s * n * l,
    e[9] - s * a * l,
    e[10] - s * s * l,
    e[11] - s * o * l,
    e[12] - o * n * l,
    e[13] - o * a * l,
    e[14] - o * s * l,
    e[15] - o * o * l
  ], u = c, f = T.M4, h = [0.5, 0.5, 0.5, 0.5], d = 0, b = 0;
  if (i != 0)
    for (var p = 0; p < 10 && (h = f.multVec(u, h), b = Math.sqrt(f.dot(h, h)), h = f.sml(1 / b, h), !(Math.abs(b - d) < 1e-9)); p++)
      d = b;
  var m = [n * l, a * l, s * l, o * l], g = f.dot(f.sml(255, m), h);
  return {
    Cov: c,
    q: m,
    e: h,
    L: d,
    eMq255: g,
    eMq: f.dot(h, m),
    rgba: (Math.round(255 * m[3]) << 24 | Math.round(255 * m[2]) << 16 | Math.round(255 * m[1]) << 8 | Math.round(255 * m[0]) << 0) >>> 0
  };
};
T.M4 = {
  multVec: function(r, e) {
    return [
      r[0] * e[0] + r[1] * e[1] + r[2] * e[2] + r[3] * e[3],
      r[4] * e[0] + r[5] * e[1] + r[6] * e[2] + r[7] * e[3],
      r[8] * e[0] + r[9] * e[1] + r[10] * e[2] + r[11] * e[3],
      r[12] * e[0] + r[13] * e[1] + r[14] * e[2] + r[15] * e[3]
    ];
  },
  dot: function(r, e) {
    return r[0] * e[0] + r[1] * e[1] + r[2] * e[2] + r[3] * e[3];
  },
  sml: function(r, e) {
    return [r * e[0], r * e[1], r * e[2], r * e[3]];
  }
};
T.encode.concatRGBA = function(r) {
  for (var e = 0, t = 0; t < r.length; t++) e += r[t].byteLength;
  for (var i = new Uint8Array(e), n = 0, t = 0; t < r.length; t++) {
    for (var a = new Uint8Array(r[t]), s = a.length, o = 0; o < s; o += 4) {
      var l = a[o], c = a[o + 1], u = a[o + 2], f = a[o + 3];
      f == 0 && (l = c = u = 0), i[n + o] = l, i[n + o + 1] = c, i[n + o + 2] = u, i[n + o + 3] = f;
    }
    n += s;
  }
  return i.buffer;
};
const Yp = (r) => {
  if (r === 0)
    return Er.Greyscale;
  if (r === 2)
    return Er.Truecolour;
  if (r === 3)
    return Er.IndexedColour;
  if (r === 4)
    return Er.GreyscaleWithAlpha;
  if (r === 6)
    return Er.TruecolourWithAlpha;
  throw new Error(`Unknown color type: ${r}`);
}, Jp = (r) => {
  const e = Math.floor(r.length / 4), t = new Uint8Array(e * 3), i = new Uint8Array(e * 1);
  let n = 0, a = 0, s = 0;
  for (; n < r.length; )
    t[a++] = r[n++], t[a++] = r[n++], t[a++] = r[n++], i[s++] = r[n++];
  return { rgbChannel: t, alphaChannel: i };
};
var Er;
(function(r) {
  r.Greyscale = "Greyscale", r.Truecolour = "Truecolour", r.IndexedColour = "IndexedColour", r.GreyscaleWithAlpha = "GreyscaleWithAlpha", r.TruecolourWithAlpha = "TruecolourWithAlpha";
})(Er || (Er = {}));
class ec {
  constructor(e) {
    Object.defineProperty(this, "rgbChannel", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "alphaChannel", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "type", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "width", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "height", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "bitsPerComponent", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    });
    const t = T.decode(e.buffer), i = T.toRGBA8(t);
    if (i.length > 1)
      throw new Error("Animated PNGs are not supported");
    const n = new Uint8Array(i[0]), { rgbChannel: a, alphaChannel: s } = Jp(n);
    this.rgbChannel = a, s.some((l) => l < 255) && (this.alphaChannel = s), this.type = Yp(t.ctype), this.width = t.width, this.height = t.height, this.bitsPerComponent = 8;
  }
}
Object.defineProperty(ec, "load", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => new ec(r)
});
class Ca {
  static async for(e) {
    const t = ec.load(e);
    return new Ca(t);
  }
  constructor(e) {
    Object.defineProperty(this, "bitsPerComponent", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "height", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "width", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "colorSpace", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "image", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.image = e, this.bitsPerComponent = e.bitsPerComponent, this.width = e.width, this.height = e.height, this.colorSpace = "DeviceRGB";
  }
  async embedIntoContext(e, t) {
    const i = this.embedAlphaChannel(e), n = e.flateStream(this.image.rgbChannel, {
      Type: "XObject",
      Subtype: "Image",
      BitsPerComponent: this.image.bitsPerComponent,
      Width: this.image.width,
      Height: this.image.height,
      ColorSpace: this.colorSpace,
      SMask: i
    });
    return t ? (e.assign(t, n), t) : e.register(n);
  }
  embedAlphaChannel(e) {
    if (!this.image.alphaChannel)
      return;
    const t = e.flateStream(this.image.alphaChannel, {
      Type: "XObject",
      Subtype: "Image",
      Height: this.image.height,
      Width: this.image.width,
      BitsPerComponent: this.image.bitsPerComponent,
      ColorSpace: "DeviceGray",
      Decode: [0, 1]
    });
    return e.register(t);
  }
}
class Hs {
  constructor(e, t, i) {
    Object.defineProperty(this, "bytes", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "start", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "pos", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "end", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.bytes = e, this.start = t || 0, this.pos = this.start, this.end = t && i ? t + i : this.bytes.length;
  }
  get length() {
    return this.end - this.start;
  }
  get isEmpty() {
    return this.length === 0;
  }
  getByte() {
    return this.pos >= this.end ? -1 : this.bytes[this.pos++];
  }
  getUint16() {
    const e = this.getByte(), t = this.getByte();
    return e === -1 || t === -1 ? -1 : (e << 8) + t;
  }
  getInt32() {
    const e = this.getByte(), t = this.getByte(), i = this.getByte(), n = this.getByte();
    return (e << 24) + (t << 16) + (i << 8) + n;
  }
  // Returns subarray of original buffer, should only be read.
  getBytes(e, t = !1) {
    const i = this.bytes, n = this.pos, a = this.end;
    if (e) {
      let s = n + e;
      s > a && (s = a), this.pos = s;
      const o = i.subarray(n, s);
      return t ? new Uint8ClampedArray(o) : o;
    } else {
      const s = i.subarray(n, a);
      return t ? new Uint8ClampedArray(s) : s;
    }
  }
  peekByte() {
    const e = this.getByte();
    return this.pos--, e;
  }
  peekBytes(e, t = !1) {
    const i = this.getBytes(e, t);
    return this.pos -= i.length, i;
  }
  skip(e) {
    e || (e = 1), this.pos += e;
  }
  reset() {
    this.pos = this.start;
  }
  moveStart() {
    this.start = this.pos;
  }
  makeSubStream(e, t) {
    return new Hs(this.bytes, e, t);
  }
  decode() {
    return this.bytes;
  }
}
const Qp = new Uint8Array(0);
class Qi {
  constructor(e) {
    if (Object.defineProperty(this, "bufferLength", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "buffer", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "eof", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "pos", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "minBufferLength", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.pos = 0, this.bufferLength = 0, this.eof = !1, this.buffer = Qp, this.minBufferLength = 512, e)
      for (; this.minBufferLength < e; )
        this.minBufferLength *= 2;
  }
  get isEmpty() {
    for (; !this.eof && this.bufferLength === 0; )
      this.readBlock();
    return this.bufferLength === 0;
  }
  getByte() {
    const e = this.pos;
    for (; this.bufferLength <= e; ) {
      if (this.eof)
        return -1;
      this.readBlock();
    }
    return this.buffer[this.pos++];
  }
  getUint16() {
    const e = this.getByte(), t = this.getByte();
    return e === -1 || t === -1 ? -1 : (e << 8) + t;
  }
  getInt32() {
    const e = this.getByte(), t = this.getByte(), i = this.getByte(), n = this.getByte();
    return (e << 24) + (t << 16) + (i << 8) + n;
  }
  getBytes(e, t = !1) {
    let i;
    const n = this.pos;
    if (e) {
      for (this.ensureBuffer(n + e), i = n + e; !this.eof && this.bufferLength < i; )
        this.readBlock();
      const s = this.bufferLength;
      i > s && (i = s);
    } else {
      for (; !this.eof; )
        this.readBlock();
      i = this.bufferLength;
    }
    this.pos = i;
    const a = this.buffer.subarray(n, i);
    return t && !(a instanceof Uint8ClampedArray) ? new Uint8ClampedArray(a) : a;
  }
  peekByte() {
    const e = this.getByte();
    return this.pos--, e;
  }
  peekBytes(e, t = !1) {
    const i = this.getBytes(e, t);
    return this.pos -= i.length, i;
  }
  skip(e) {
    e || (e = 1), this.pos += e;
  }
  reset() {
    this.pos = 0;
  }
  makeSubStream(e, t) {
    const i = e + t;
    for (; this.bufferLength <= i && !this.eof; )
      this.readBlock();
    return new Hs(
      this.buffer,
      e,
      t
      /* dict */
    );
  }
  decode() {
    for (; !this.eof; )
      this.readBlock();
    return this.buffer.subarray(0, this.bufferLength);
  }
  readBlock() {
    throw new Lt(this.constructor.name, "readBlock");
  }
  ensureBuffer(e) {
    const t = this.buffer;
    if (e <= t.byteLength)
      return t;
    let i = this.minBufferLength;
    for (; i < e; )
      i *= 2;
    const n = new Uint8Array(i);
    return n.set(t), this.buffer = n;
  }
}
const B0 = (r) => r === 32 || r === 9 || r === 13 || r === 10;
class em extends Qi {
  constructor(e, t) {
    super(t), Object.defineProperty(this, "stream", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "input", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.stream = e, this.input = new Uint8Array(5), t && (t = 0.8 * t);
  }
  readBlock() {
    const n = this.stream;
    let a = n.getByte();
    for (; B0(a); )
      a = n.getByte();
    if (a === -1 || a === 126) {
      this.eof = !0;
      return;
    }
    const s = this.bufferLength;
    let o, l;
    if (a === 122) {
      for (o = this.ensureBuffer(s + 4), l = 0; l < 4; ++l)
        o[s + l] = 0;
      this.bufferLength += 4;
    } else {
      const c = this.input;
      for (c[0] = a, l = 1; l < 5; ++l) {
        for (a = n.getByte(); B0(a); )
          a = n.getByte();
        if (c[l] = a, a === -1 || a === 126)
          break;
      }
      if (o = this.ensureBuffer(s + l - 1), this.bufferLength += l - 1, l < 5) {
        for (; l < 5; ++l)
          c[l] = 117;
        this.eof = !0;
      }
      let u = 0;
      for (l = 0; l < 5; ++l)
        u = u * 85 + (c[l] - 33);
      for (l = 3; l >= 0; --l)
        o[s + l] = u & 255, u >>= 8;
    }
  }
}
class tm extends Qi {
  constructor(e, t) {
    super(t), Object.defineProperty(this, "stream", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "firstDigit", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.stream = e, this.firstDigit = -1, t && (t = 0.5 * t);
  }
  readBlock() {
    const t = this.stream.getBytes(8e3);
    if (!t.length) {
      this.eof = !0;
      return;
    }
    const i = t.length + 1 >> 1, n = this.ensureBuffer(this.bufferLength + i);
    let a = this.bufferLength, s = this.firstDigit;
    for (let o = 0, l = t.length; o < l; o++) {
      const c = t[o];
      let u;
      if (c >= 48 && c <= 57)
        u = c & 15;
      else if (c >= 65 && c <= 70 || c >= 97 && c <= 102)
        u = (c & 15) + 9;
      else if (c === 62) {
        this.eof = !0;
        break;
      } else
        continue;
      s < 0 ? s = u : (n[a++] = s << 4 | u, s = -1);
    }
    s >= 0 && this.eof && (n[a++] = s << 4, s = -1), this.firstDigit = s, this.bufferLength = a;
  }
}
const N0 = new Int32Array([
  16,
  17,
  18,
  0,
  8,
  7,
  9,
  6,
  10,
  5,
  11,
  4,
  12,
  3,
  13,
  2,
  14,
  1,
  15
]), rm = new Int32Array([
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  65547,
  65549,
  65551,
  65553,
  131091,
  131095,
  131099,
  131103,
  196643,
  196651,
  196659,
  196667,
  262211,
  262227,
  262243,
  262259,
  327811,
  327843,
  327875,
  327907,
  258,
  258,
  258
]), im = new Int32Array([
  1,
  2,
  3,
  4,
  65541,
  65543,
  131081,
  131085,
  196625,
  196633,
  262177,
  262193,
  327745,
  327777,
  393345,
  393409,
  459009,
  459137,
  524801,
  525057,
  590849,
  591361,
  657409,
  658433,
  724993,
  727041,
  794625,
  798721,
  868353,
  876545
]), nm = [new Int32Array([
  459008,
  524368,
  524304,
  524568,
  459024,
  524400,
  524336,
  590016,
  459016,
  524384,
  524320,
  589984,
  524288,
  524416,
  524352,
  590048,
  459012,
  524376,
  524312,
  589968,
  459028,
  524408,
  524344,
  590032,
  459020,
  524392,
  524328,
  59e4,
  524296,
  524424,
  524360,
  590064,
  459010,
  524372,
  524308,
  524572,
  459026,
  524404,
  524340,
  590024,
  459018,
  524388,
  524324,
  589992,
  524292,
  524420,
  524356,
  590056,
  459014,
  524380,
  524316,
  589976,
  459030,
  524412,
  524348,
  590040,
  459022,
  524396,
  524332,
  590008,
  524300,
  524428,
  524364,
  590072,
  459009,
  524370,
  524306,
  524570,
  459025,
  524402,
  524338,
  590020,
  459017,
  524386,
  524322,
  589988,
  524290,
  524418,
  524354,
  590052,
  459013,
  524378,
  524314,
  589972,
  459029,
  524410,
  524346,
  590036,
  459021,
  524394,
  524330,
  590004,
  524298,
  524426,
  524362,
  590068,
  459011,
  524374,
  524310,
  524574,
  459027,
  524406,
  524342,
  590028,
  459019,
  524390,
  524326,
  589996,
  524294,
  524422,
  524358,
  590060,
  459015,
  524382,
  524318,
  589980,
  459031,
  524414,
  524350,
  590044,
  459023,
  524398,
  524334,
  590012,
  524302,
  524430,
  524366,
  590076,
  459008,
  524369,
  524305,
  524569,
  459024,
  524401,
  524337,
  590018,
  459016,
  524385,
  524321,
  589986,
  524289,
  524417,
  524353,
  590050,
  459012,
  524377,
  524313,
  589970,
  459028,
  524409,
  524345,
  590034,
  459020,
  524393,
  524329,
  590002,
  524297,
  524425,
  524361,
  590066,
  459010,
  524373,
  524309,
  524573,
  459026,
  524405,
  524341,
  590026,
  459018,
  524389,
  524325,
  589994,
  524293,
  524421,
  524357,
  590058,
  459014,
  524381,
  524317,
  589978,
  459030,
  524413,
  524349,
  590042,
  459022,
  524397,
  524333,
  590010,
  524301,
  524429,
  524365,
  590074,
  459009,
  524371,
  524307,
  524571,
  459025,
  524403,
  524339,
  590022,
  459017,
  524387,
  524323,
  589990,
  524291,
  524419,
  524355,
  590054,
  459013,
  524379,
  524315,
  589974,
  459029,
  524411,
  524347,
  590038,
  459021,
  524395,
  524331,
  590006,
  524299,
  524427,
  524363,
  590070,
  459011,
  524375,
  524311,
  524575,
  459027,
  524407,
  524343,
  590030,
  459019,
  524391,
  524327,
  589998,
  524295,
  524423,
  524359,
  590062,
  459015,
  524383,
  524319,
  589982,
  459031,
  524415,
  524351,
  590046,
  459023,
  524399,
  524335,
  590014,
  524303,
  524431,
  524367,
  590078,
  459008,
  524368,
  524304,
  524568,
  459024,
  524400,
  524336,
  590017,
  459016,
  524384,
  524320,
  589985,
  524288,
  524416,
  524352,
  590049,
  459012,
  524376,
  524312,
  589969,
  459028,
  524408,
  524344,
  590033,
  459020,
  524392,
  524328,
  590001,
  524296,
  524424,
  524360,
  590065,
  459010,
  524372,
  524308,
  524572,
  459026,
  524404,
  524340,
  590025,
  459018,
  524388,
  524324,
  589993,
  524292,
  524420,
  524356,
  590057,
  459014,
  524380,
  524316,
  589977,
  459030,
  524412,
  524348,
  590041,
  459022,
  524396,
  524332,
  590009,
  524300,
  524428,
  524364,
  590073,
  459009,
  524370,
  524306,
  524570,
  459025,
  524402,
  524338,
  590021,
  459017,
  524386,
  524322,
  589989,
  524290,
  524418,
  524354,
  590053,
  459013,
  524378,
  524314,
  589973,
  459029,
  524410,
  524346,
  590037,
  459021,
  524394,
  524330,
  590005,
  524298,
  524426,
  524362,
  590069,
  459011,
  524374,
  524310,
  524574,
  459027,
  524406,
  524342,
  590029,
  459019,
  524390,
  524326,
  589997,
  524294,
  524422,
  524358,
  590061,
  459015,
  524382,
  524318,
  589981,
  459031,
  524414,
  524350,
  590045,
  459023,
  524398,
  524334,
  590013,
  524302,
  524430,
  524366,
  590077,
  459008,
  524369,
  524305,
  524569,
  459024,
  524401,
  524337,
  590019,
  459016,
  524385,
  524321,
  589987,
  524289,
  524417,
  524353,
  590051,
  459012,
  524377,
  524313,
  589971,
  459028,
  524409,
  524345,
  590035,
  459020,
  524393,
  524329,
  590003,
  524297,
  524425,
  524361,
  590067,
  459010,
  524373,
  524309,
  524573,
  459026,
  524405,
  524341,
  590027,
  459018,
  524389,
  524325,
  589995,
  524293,
  524421,
  524357,
  590059,
  459014,
  524381,
  524317,
  589979,
  459030,
  524413,
  524349,
  590043,
  459022,
  524397,
  524333,
  590011,
  524301,
  524429,
  524365,
  590075,
  459009,
  524371,
  524307,
  524571,
  459025,
  524403,
  524339,
  590023,
  459017,
  524387,
  524323,
  589991,
  524291,
  524419,
  524355,
  590055,
  459013,
  524379,
  524315,
  589975,
  459029,
  524411,
  524347,
  590039,
  459021,
  524395,
  524331,
  590007,
  524299,
  524427,
  524363,
  590071,
  459011,
  524375,
  524311,
  524575,
  459027,
  524407,
  524343,
  590031,
  459019,
  524391,
  524327,
  589999,
  524295,
  524423,
  524359,
  590063,
  459015,
  524383,
  524319,
  589983,
  459031,
  524415,
  524351,
  590047,
  459023,
  524399,
  524335,
  590015,
  524303,
  524431,
  524367,
  590079
]), 9], am = [new Int32Array([
  327680,
  327696,
  327688,
  327704,
  327684,
  327700,
  327692,
  327708,
  327682,
  327698,
  327690,
  327706,
  327686,
  327702,
  327694,
  0,
  327681,
  327697,
  327689,
  327705,
  327685,
  327701,
  327693,
  327709,
  327683,
  327699,
  327691,
  327707,
  327687,
  327703,
  327695,
  0
]), 5];
class sm extends Qi {
  constructor(e, t) {
    super(t), Object.defineProperty(this, "stream", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "codeSize", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "codeBuf", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.stream = e;
    const i = e.getByte(), n = e.getByte();
    if (i === -1 || n === -1)
      throw new Error(`Invalid header in flate stream: ${i}, ${n}`);
    if ((i & 15) !== 8)
      throw new Error(`Unknown compression method in flate stream: ${i}, ${n}`);
    if (((i << 8) + n) % 31 !== 0)
      throw new Error(`Bad FCHECK in flate stream: ${i}, ${n}`);
    if (n & 32)
      throw new Error(`FDICT bit set in flate stream: ${i}, ${n}`);
    this.codeSize = 0, this.codeBuf = 0;
  }
  readBlock() {
    let e, t;
    const i = this.stream;
    let n = this.getBits(3);
    if (n & 1 && (this.eof = !0), n >>= 1, n === 0) {
      let c;
      if ((c = i.getByte()) === -1)
        throw new Error("Bad block header in flate stream");
      let u = c;
      if ((c = i.getByte()) === -1)
        throw new Error("Bad block header in flate stream");
      if (u |= c << 8, (c = i.getByte()) === -1)
        throw new Error("Bad block header in flate stream");
      let f = c;
      if ((c = i.getByte()) === -1)
        throw new Error("Bad block header in flate stream");
      if (f |= c << 8, f !== (~u & 65535) && (u !== 0 || f !== 0))
        throw new Error("Bad uncompressed block length in flate stream");
      this.codeBuf = 0, this.codeSize = 0;
      const h = this.bufferLength;
      e = this.ensureBuffer(h + u);
      const d = h + u;
      if (this.bufferLength = d, u === 0)
        i.peekByte() === -1 && (this.eof = !0);
      else
        for (let b = h; b < d; ++b) {
          if ((c = i.getByte()) === -1) {
            this.eof = !0;
            break;
          }
          e[b] = c;
        }
      return;
    }
    let a, s;
    if (n === 1)
      a = nm, s = am;
    else if (n === 2) {
      const c = this.getBits(5) + 257, u = this.getBits(5) + 1, f = this.getBits(4) + 4, h = new Uint8Array(N0.length);
      let d;
      for (d = 0; d < f; ++d)
        h[N0[d]] = this.getBits(3);
      const b = this.generateHuffmanTable(h);
      t = 0, d = 0;
      const p = c + u, m = new Uint8Array(p);
      let g, S, y;
      for (; d < p; ) {
        const v = this.getCode(b);
        if (v === 16)
          g = 2, S = 3, y = t;
        else if (v === 17)
          g = 3, S = 3, y = t = 0;
        else if (v === 18)
          g = 7, S = 11, y = t = 0;
        else {
          m[d++] = t = v;
          continue;
        }
        let A = this.getBits(g) + S;
        for (; A-- > 0; )
          m[d++] = y;
      }
      a = this.generateHuffmanTable(m.subarray(0, c)), s = this.generateHuffmanTable(m.subarray(c, p));
    } else
      throw new Error("Unknown block type in flate stream");
    e = this.buffer;
    let o = e ? e.length : 0, l = this.bufferLength;
    for (; ; ) {
      let c = this.getCode(a);
      if (c < 256) {
        l + 1 >= o && (e = this.ensureBuffer(l + 1), o = e.length), e[l++] = c;
        continue;
      }
      if (c === 256) {
        this.bufferLength = l;
        return;
      }
      c -= 257, c = rm[c];
      let u = c >> 16;
      u > 0 && (u = this.getBits(u)), t = (c & 65535) + u, c = this.getCode(s), c = im[c], u = c >> 16, u > 0 && (u = this.getBits(u));
      const f = (c & 65535) + u;
      l + t >= o && (e = this.ensureBuffer(l + t), o = e.length);
      for (let h = 0; h < t; ++h, ++l)
        e[l] = e[l - f];
    }
  }
  getBits(e) {
    const t = this.stream;
    let i = this.codeSize, n = this.codeBuf, a;
    for (; i < e; ) {
      if ((a = t.getByte()) === -1)
        throw new Error("Bad encoding in flate stream");
      n |= a << i, i += 8;
    }
    return a = n & (1 << e) - 1, this.codeBuf = n >> e, this.codeSize = i -= e, a;
  }
  getCode(e) {
    const t = this.stream, i = e[0], n = e[1];
    let a = this.codeSize, s = this.codeBuf, o;
    for (; a < n && (o = t.getByte()) !== -1; )
      s |= o << a, a += 8;
    const l = i[s & (1 << n) - 1];
    typeof i == "number" && console.log("FLATE:", l);
    const c = l >> 16, u = l & 65535;
    if (c < 1 || a < c)
      throw new Error("Bad encoding in flate stream");
    return this.codeBuf = s >> c, this.codeSize = a - c, u;
  }
  generateHuffmanTable(e) {
    const t = e.length;
    let i = 0, n;
    for (n = 0; n < t; ++n)
      e[n] > i && (i = e[n]);
    const a = 1 << i, s = new Int32Array(a);
    for (let o = 1, l = 0, c = 2; o <= i; ++o, l <<= 1, c <<= 1)
      for (let u = 0; u < t; ++u)
        if (e[u] === o) {
          let f = 0, h = l;
          for (n = 0; n < o; ++n)
            f = f << 1 | h & 1, h >>= 1;
          for (n = f; n < a; n += c)
            s[n] = o << 16 | u;
          ++l;
        }
    return [s, i];
  }
}
class om extends Qi {
  constructor(e, t, i) {
    super(t), Object.defineProperty(this, "stream", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "cachedData", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "bitsCached", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "lzwState", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.stream = e, this.cachedData = 0, this.bitsCached = 0;
    const n = 4096, a = {
      earlyChange: i,
      codeLength: 9,
      nextCode: 258,
      dictionaryValues: new Uint8Array(n),
      dictionaryLengths: new Uint16Array(n),
      dictionaryPrevCodes: new Uint16Array(n),
      currentSequence: new Uint8Array(n),
      currentSequenceLength: 0
    };
    for (let s = 0; s < 256; ++s)
      a.dictionaryValues[s] = s, a.dictionaryLengths[s] = 1;
    this.lzwState = a;
  }
  readBlock() {
    let t = 1024;
    const i = 512;
    let n, a, s;
    const o = this.lzwState;
    if (!o)
      return;
    const l = o.earlyChange;
    let c = o.nextCode;
    const u = o.dictionaryValues, f = o.dictionaryLengths, h = o.dictionaryPrevCodes;
    let d = o.codeLength, b = o.prevCode;
    const p = o.currentSequence;
    let m = o.currentSequenceLength, g = 0, S = this.bufferLength, y = this.ensureBuffer(this.bufferLength + t);
    for (n = 0; n < 512; n++) {
      const v = this.readBits(d), A = m > 0;
      if (!v || v < 256)
        p[0] = v, m = 1;
      else if (v >= 258)
        if (v < c)
          for (m = f[v], a = m - 1, s = v; a >= 0; a--)
            p[a] = u[s], s = h[s];
        else
          p[m++] = p[0];
      else if (v === 256) {
        d = 9, c = 258, m = 0;
        continue;
      } else {
        this.eof = !0, delete this.lzwState;
        break;
      }
      if (A && (h[c] = b, f[c] = f[b] + 1, u[c] = p[0], c++, d = c + l & c + l - 1 ? d : Math.min(Math.log(c + l) / 0.6931471805599453 + 1, 12) | 0), b = v, g += m, t < g) {
        do
          t += i;
        while (t < g);
        y = this.ensureBuffer(this.bufferLength + t);
      }
      for (a = 0; a < m; a++)
        y[S++] = p[a];
    }
    o.nextCode = c, o.codeLength = d, o.prevCode = b, o.currentSequenceLength = m, this.bufferLength = S;
  }
  readBits(e) {
    let t = this.bitsCached, i = this.cachedData;
    for (; t < e; ) {
      const n = this.stream.getByte();
      if (n === -1)
        return this.eof = !0, null;
      i = i << 8 | n, t += 8;
    }
    return this.bitsCached = t -= e, this.cachedData = i, i >>> t & (1 << e) - 1;
  }
}
class cm extends Qi {
  constructor(e, t) {
    super(t), Object.defineProperty(this, "stream", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.stream = e;
  }
  readBlock() {
    const e = this.stream.getBytes(2);
    if (!e || e.length < 2 || e[0] === 128) {
      this.eof = !0;
      return;
    }
    let t, i = this.bufferLength, n = e[0];
    if (n < 128) {
      if (t = this.ensureBuffer(i + n + 1), t[i++] = e[1], n > 0) {
        const a = this.stream.getBytes(n);
        t.set(a, i), i += n;
      }
    } else {
      n = 257 - n;
      const a = e[1];
      t = this.ensureBuffer(i + n + 1);
      for (let s = 0; s < n; s++)
        t[i++] = a;
    }
    this.bufferLength = i;
  }
}
const j0 = (r, e, t) => {
  if (e === x.of("FlateDecode"))
    return new sm(r);
  if (e === x.of("LZWDecode")) {
    let i = 1;
    if (t instanceof $) {
      const n = t.lookup(x.of("EarlyChange"));
      n instanceof q && (i = n.asNumber());
    }
    return new om(r, void 0, i);
  }
  if (e === x.of("ASCII85Decode"))
    return new em(r);
  if (e === x.of("ASCIIHexDecode"))
    return new tm(r);
  if (e === x.of("RunLengthDecode"))
    return new cm(r);
  throw new eu(e.asString());
}, Ic = ({ dict: r, contents: e, transform: t }) => {
  let i = new Hs(e);
  t && (i = t.createStream(i, e.length));
  const n = r.lookup(x.of("Filter")), a = r.lookup(x.of("DecodeParms"));
  if (n instanceof x)
    i = j0(i, n, a);
  else if (n instanceof V)
    for (let s = 0, o = n.size(); s < o; s++)
      i = j0(i, n.lookup(s, x), a && a.lookupMaybe(s, $));
  else if (n)
    throw new Nn([x, V], n);
  return i;
}, lm = (r) => {
  const e = r.MediaBox(), t = e.lookup(2, q).asNumber() - e.lookup(0, q).asNumber(), i = e.lookup(3, q).asNumber() - e.lookup(1, q).asNumber();
  return { left: 0, bottom: 0, right: t, top: i };
}, um = (r) => [
  1,
  0,
  0,
  1,
  -r.left,
  -r.bottom
];
class Fa {
  static async for(e, t, i) {
    return new Fa(e, t, i);
  }
  constructor(e, t, i) {
    Object.defineProperty(this, "width", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "height", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "boundingBox", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "transformationMatrix", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "page", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.page = e;
    const n = t ?? lm(e);
    this.width = n.right - n.left, this.height = n.top - n.bottom, this.boundingBox = n, this.transformationMatrix = i ?? um(n);
  }
  async embedIntoContext(e, t) {
    const { Contents: i, Resources: n } = this.page.normalizedEntries();
    if (!i)
      throw new tu();
    const a = this.decodeContents(i), { left: s, bottom: o, right: l, top: c } = this.boundingBox, u = e.flateStream(a, {
      Type: "XObject",
      Subtype: "Form",
      FormType: 1,
      BBox: [s, o, l, c],
      Matrix: this.transformationMatrix,
      Resources: n
    });
    return t ? (e.assign(t, u), t) : e.register(u);
  }
  // `contents` is an array of streams which are merged to include them in the XObject.
  // This methods extracts each stream and joins them with a newline character.
  decodeContents(e) {
    const t = Uint8Array.of(w.Newline), i = [];
    for (let n = 0, a = e.size(); n < a; n++) {
      const s = e.lookup(n, Ze);
      let o;
      if (s instanceof Et)
        o = Ic(s).decode();
      else if (s instanceof Ot)
        o = s.getUnencodedContents();
      else
        throw new ru(s);
      i.push(o, t);
    }
    return iu(...i);
  }
}
const Ha = (r, e) => {
  if (r !== void 0)
    return e[r];
};
var Pi;
(function(r) {
  r.UseNone = "UseNone", r.UseOutlines = "UseOutlines", r.UseThumbs = "UseThumbs", r.UseOC = "UseOC";
})(Pi || (Pi = {}));
var Di;
(function(r) {
  r.L2R = "L2R", r.R2L = "R2L";
})(Di || (Di = {}));
var Ei;
(function(r) {
  r.None = "None", r.AppDefault = "AppDefault";
})(Ei || (Ei = {}));
var ta;
(function(r) {
  r.Simplex = "Simplex", r.DuplexFlipShortEdge = "DuplexFlipShortEdge", r.DuplexFlipLongEdge = "DuplexFlipLongEdge";
})(ta || (ta = {}));
class ni {
  /** @ignore */
  constructor(e) {
    Object.defineProperty(this, "dict", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.dict = e;
  }
  lookupBool(e) {
    const t = this.dict.lookup(x.of(e));
    if (t instanceof Dt)
      return t;
  }
  lookupName(e) {
    const t = this.dict.lookup(x.of(e));
    if (t instanceof x)
      return t;
  }
  /** @ignore */
  HideToolbar() {
    return this.lookupBool("HideToolbar");
  }
  /** @ignore */
  HideMenubar() {
    return this.lookupBool("HideMenubar");
  }
  /** @ignore */
  HideWindowUI() {
    return this.lookupBool("HideWindowUI");
  }
  /** @ignore */
  FitWindow() {
    return this.lookupBool("FitWindow");
  }
  /** @ignore */
  CenterWindow() {
    return this.lookupBool("CenterWindow");
  }
  /** @ignore */
  DisplayDocTitle() {
    return this.lookupBool("DisplayDocTitle");
  }
  /** @ignore */
  NonFullScreenPageMode() {
    return this.lookupName("NonFullScreenPageMode");
  }
  /** @ignore */
  Direction() {
    return this.lookupName("Direction");
  }
  /** @ignore */
  PrintScaling() {
    return this.lookupName("PrintScaling");
  }
  /** @ignore */
  Duplex() {
    return this.lookupName("Duplex");
  }
  /** @ignore */
  PickTrayByPDFSize() {
    return this.lookupBool("PickTrayByPDFSize");
  }
  /** @ignore */
  PrintPageRange() {
    const e = this.dict.lookup(x.of("PrintPageRange"));
    if (e instanceof V)
      return e;
  }
  /** @ignore */
  NumCopies() {
    const e = this.dict.lookup(x.of("NumCopies"));
    if (e instanceof q)
      return e;
  }
  /**
   * Returns `true` if PDF readers should hide the toolbar menus when displaying
   * this document.
   * @returns Whether or not toolbars should be hidden.
   */
  getHideToolbar() {
    var e;
    return ((e = this.HideToolbar()) == null ? void 0 : e.asBoolean()) ?? !1;
  }
  /**
   * Returns `true` if PDF readers should hide the menu bar when displaying this
   * document.
   * @returns Whether or not the menu bar should be hidden.
   */
  getHideMenubar() {
    var e;
    return ((e = this.HideMenubar()) == null ? void 0 : e.asBoolean()) ?? !1;
  }
  /**
   * Returns `true` if PDF readers should hide the user interface elements in
   * the document's window (such as scroll bars and navigation controls),
   * leaving only the document's contents displayed.
   * @returns Whether or not user interface elements should be hidden.
   */
  getHideWindowUI() {
    var e;
    return ((e = this.HideWindowUI()) == null ? void 0 : e.asBoolean()) ?? !1;
  }
  /**
   * Returns `true` if PDF readers should resize the document's window to fit
   * the size of the first displayed page.
   * @returns Whether or not the window should be resized to fit.
   */
  getFitWindow() {
    var e;
    return ((e = this.FitWindow()) == null ? void 0 : e.asBoolean()) ?? !1;
  }
  /**
   * Returns `true` if PDF readers should position the document's window in the
   * center of the screen.
   * @returns Whether or not to center the document window.
   */
  getCenterWindow() {
    var e;
    return ((e = this.CenterWindow()) == null ? void 0 : e.asBoolean()) ?? !1;
  }
  /**
   * Returns `true` if the window's title bar should display the document
   * `Title`, taken from the document metadata (see [[PDFDocument.getTitle]]).
   * Returns `false` if the title bar should instead display the filename of the
   * PDF file.
   * @returns Whether to display the document title.
   */
  getDisplayDocTitle() {
    var e;
    return ((e = this.DisplayDocTitle()) == null ? void 0 : e.asBoolean()) ?? !1;
  }
  /**
   * Returns the page mode, which tells the PDF reader how to display the
   * document after exiting full-screen mode.
   * @returns The page mode after exiting full-screen mode.
   */
  getNonFullScreenPageMode() {
    var t;
    const e = (t = this.NonFullScreenPageMode()) == null ? void 0 : t.decodeText();
    return Ha(e, Pi) ?? Pi.UseNone;
  }
  /**
   * Returns the predominant reading order for text.
   * @returns The text reading order.
   */
  getReadingDirection() {
    var t;
    const e = (t = this.Direction()) == null ? void 0 : t.decodeText();
    return Ha(e, Di) ?? Di.L2R;
  }
  /**
   * Returns the page scaling option that the PDF reader should select when the
   * print dialog is displayed.
   * @returns The page scaling option.
   */
  getPrintScaling() {
    var t;
    const e = (t = this.PrintScaling()) == null ? void 0 : t.decodeText();
    return Ha(e, Ei) ?? Ei.AppDefault;
  }
  /**
   * Returns the paper handling option that should be used when printing the
   * file from the print dialog.
   * @returns The paper handling option.
   */
  getDuplex() {
    var t;
    const e = (t = this.Duplex()) == null ? void 0 : t.decodeText();
    return Ha(e, ta);
  }
  /**
   * Returns `true` if the PDF page size should be used to select the input
   * paper tray.
   * @returns Whether or not the PDF page size should be used to select the
   *          input paper tray.
   */
  getPickTrayByPDFSize() {
    var e;
    return (e = this.PickTrayByPDFSize()) == null ? void 0 : e.asBoolean();
  }
  /**
   * Returns an array of page number ranges, which are the values used to
   * initialize the print dialog box when the file is printed. Each range
   * specifies the first (`start`) and last (`end`) pages in a sub-range of
   * pages to be printed. The first page of the PDF file is denoted by 0.
   * For example:
   * ```js
   * const viewerPrefs = pdfDoc.catalog.getOrCreateViewerPreferences()
   * const includesPage3 = viewerPrefs
   *   .getPrintRanges()
   *   .some(pr => pr.start =< 2 && pr.end >= 2)
   * if (includesPage3) console.log('printRange includes page 3')
   * ```
   * @returns An array of objects, each with the properties `start` and `end`,
   *          denoting page indices. If not, specified an empty array is
   *          returned.
   */
  getPrintPageRange() {
    const e = this.PrintPageRange();
    if (!e)
      return [];
    const t = [];
    for (let i = 0; i < e.size(); i += 2) {
      const n = e.lookup(i, q).asNumber(), a = e.lookup(i + 1, q).asNumber();
      t.push({ start: n, end: a });
    }
    return t;
  }
  /**
   * Returns the number of copies to be printed when the print dialog is opened
   * for this document.
   * @returns The default number of copies to be printed.
   */
  getNumCopies() {
    var e;
    return ((e = this.NumCopies()) == null ? void 0 : e.asNumber()) ?? 1;
  }
  /**
   * Choose whether the PDF reader's toolbars should be hidden while the
   * document is active.
   * @param hideToolbar `true` if the toolbar should be hidden.
   */
  setHideToolbar(e) {
    const t = this.dict.context.obj(e);
    this.dict.set(x.of("HideToolbar"), t);
  }
  /**
   * Choose whether the PDF reader's menu bar should be hidden while the
   * document is active.
   * @param hideMenubar `true` if the menu bar should be hidden.
   */
  setHideMenubar(e) {
    const t = this.dict.context.obj(e);
    this.dict.set(x.of("HideMenubar"), t);
  }
  /**
   * Choose whether the PDF reader should hide user interface elements in the
   * document's window (such as scroll bars and navigation controls), leaving
   * only the document's contents displayed.
   * @param hideWindowUI `true` if the user interface elements should be hidden.
   */
  setHideWindowUI(e) {
    const t = this.dict.context.obj(e);
    this.dict.set(x.of("HideWindowUI"), t);
  }
  /**
   * Choose whether the PDF reader should resize the document's window to fit
   * the size of the first displayed page.
   * @param fitWindow `true` if the window should be resized.
   */
  setFitWindow(e) {
    const t = this.dict.context.obj(e);
    this.dict.set(x.of("FitWindow"), t);
  }
  /**
   * Choose whether the PDF reader should position the document's window in the
   * center of the screen.
   * @param centerWindow `true` if the window should be centered.
   */
  setCenterWindow(e) {
    const t = this.dict.context.obj(e);
    this.dict.set(x.of("CenterWindow"), t);
  }
  /**
   * Choose whether the window's title bar should display the document `Title`
   * taken from the document metadata (see [[PDFDocument.setTitle]]). If
   * `false`, the title bar should instead display the PDF filename.
   * @param displayTitle `true` if the document title should be displayed.
   */
  setDisplayDocTitle(e) {
    const t = this.dict.context.obj(e);
    this.dict.set(x.of("DisplayDocTitle"), t);
  }
  /**
   * Choose how the PDF reader should display the document upon exiting
   * full-screen mode. This entry is meaningful only if the value of the
   * `PageMode` entry in the document's [[PDFCatalog]] is `FullScreen`.
   *
   * For example:
   * ```js
   * import { PDFDocument, NonFullScreenPageMode, PDFName } from 'pdf-lib'
   *
   * const pdfDoc = await PDFDocument.create()
   *
   * // Set the PageMode
   * pdfDoc.catalog.set(PDFName.of('PageMode'),PDFName.of('FullScreen'))
   *
   * // Set what happens when full-screen is closed
   * const viewerPrefs = pdfDoc.catalog.getOrCreateViewerPreferences()
   * viewerPrefs.setNonFullScreenPageMode(NonFullScreenPageMode.UseOutlines)
   * ```
   *
   * @param nonFullScreenPageMode How the document should be displayed upon
   *                              exiting full screen mode.
   */
  setNonFullScreenPageMode(e) {
    Tr(e, "nonFullScreenPageMode", Pi);
    const t = x.of(e);
    this.dict.set(x.of("NonFullScreenPageMode"), t);
  }
  /**
   * Choose the predominant reading order for text.
   *
   * This entry has no direct effect on the document's contents or page
   * numbering, but may be used to determine the relative positioning of pages
   * when displayed side by side or printed n-up.
   *
   * For example:
   * ```js
   * import { PDFDocument, ReadingDirection } from 'pdf-lib'
   *
   * const pdfDoc = await PDFDocument.create()
   * const viewerPrefs = pdfDoc.catalog.getOrCreateViewerPreferences()
   * viewerPrefs.setReadingDirection(ReadingDirection.R2L)
   * ```
   *
   * @param readingDirection The reading order for text.
   */
  setReadingDirection(e) {
    Tr(e, "readingDirection", Di);
    const t = x.of(e);
    this.dict.set(x.of("Direction"), t);
  }
  /**
   * Choose the page scaling option that should be selected when a print dialog
   * is displayed for this document.
   *
   * For example:
   * ```js
   * import { PDFDocument, PrintScaling } from 'pdf-lib'
   *
   * const pdfDoc = await PDFDocument.create()
   * const viewerPrefs = pdfDoc.catalog.getOrCreateViewerPreferences()
   * viewerPrefs.setPrintScaling(PrintScaling.None)
   * ```
   *
   * @param printScaling The print scaling option.
   */
  setPrintScaling(e) {
    Tr(e, "printScaling", Ei);
    const t = x.of(e);
    this.dict.set(x.of("PrintScaling"), t);
  }
  /**
   * Choose the paper handling option that should be selected by default in the
   * print dialog.
   *
   * For example:
   * ```js
   * import { PDFDocument, Duplex } from 'pdf-lib'
   *
   * const pdfDoc = await PDFDocument.create()
   * const viewerPrefs = pdfDoc.catalog.getOrCreateViewerPreferences()
   * viewerPrefs.setDuplex(Duplex.DuplexFlipShortEdge)
   * ```
   *
   * @param duplex The double or single sided printing option.
   */
  setDuplex(e) {
    Tr(e, "duplex", ta);
    const t = x.of(e);
    this.dict.set(x.of("Duplex"), t);
  }
  /**
   * Choose whether the PDF document's page size should be used to select the
   * input paper tray when printing. This setting influences only the preset
   * values used to populate the print dialog presented by a PDF reader.
   *
   * If PickTrayByPDFSize is true, the check box in the print dialog associated
   * with input paper tray should be checked. This setting has no effect on
   * operating systems that do not provide the ability to pick the input tray
   * by size.
   *
   * @param pickTrayByPDFSize `true` if the document's page size should be used
   *                          to select the input paper tray.
   */
  setPickTrayByPDFSize(e) {
    const t = this.dict.context.obj(e);
    this.dict.set(x.of("PickTrayByPDFSize"), t);
  }
  /**
   * Choose the page numbers used to initialize the print dialog box when the
   * file is printed. The first page of the PDF file is denoted by 0.
   *
   * For example:
   * ```js
   * import { PDFDocument } from 'pdf-lib'
   *
   * const pdfDoc = await PDFDocument.create()
   * const viewerPrefs = pdfDoc.catalog.getOrCreateViewerPreferences()
   *
   * // We can set the default print range to only the first page
   * viewerPrefs.setPrintPageRange({ start: 0, end: 0 })
   *
   * // Or we can supply noncontiguous ranges (e.g. pages 1, 3, and 5-7)
   * viewerPrefs.setPrintPageRange([
   *   { start: 0, end: 0 },
   *   { start: 2, end: 2 },
   *   { start: 4, end: 6 },
   * ])
   * ```
   *
   * @param printPageRange An object or array of objects, each with the
   *                       properties `start` and `end`, denoting a range of
   *                       page indices.
   */
  setPrintPageRange(e) {
    Array.isArray(e) || (e = [e]);
    const t = [];
    for (let n = 0, a = e.length; n < a; n++)
      t.push(e[n].start), t.push(e[n].end);
    lc(t, "printPageRange", ["number"]);
    const i = this.dict.context.obj(t);
    this.dict.set(x.of("PrintPageRange"), i);
  }
  /**
   * Choose the default number of copies to be printed when the print dialog is
   * opened for this file.
   * @param numCopies The default number of copies.
   */
  setNumCopies(e) {
    _n(e, "numCopies", 1, Number.MAX_VALUE), nu(e, "numCopies");
    const t = this.dict.context.obj(e);
    this.dict.set(x.of("NumCopies"), t);
  }
}
Object.defineProperty(ni, "fromDict", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => new ni(r)
});
Object.defineProperty(ni, "create", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => {
    const e = r.obj({});
    return new ni(e);
  }
});
const dm = /\/([^\0\t\n\f\r\ ]+)[\0\t\n\f\r\ ]*(\d*\.\d+|\d+)?[\0\t\n\f\r\ ]+Tf/;
class Oa {
  constructor(e, t) {
    Object.defineProperty(this, "dict", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "ref", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.dict = e, this.ref = t;
  }
  T() {
    return this.dict.lookupMaybe(x.of("T"), G, z);
  }
  Ff() {
    const e = this.getInheritableAttribute(x.of("Ff"));
    return this.dict.context.lookupMaybe(e, q);
  }
  V() {
    const e = this.getInheritableAttribute(x.of("V"));
    return this.dict.context.lookup(e);
  }
  Kids() {
    return this.dict.lookupMaybe(x.of("Kids"), V);
  }
  // Parent(): PDFDict | undefined {
  //   return this.dict.lookupMaybe(PDFName.of('Parent'), PDFDict);
  // }
  DA() {
    const e = this.dict.lookup(x.of("DA"));
    if (e instanceof G || e instanceof z)
      return e;
  }
  setKids(e) {
    this.dict.set(x.of("Kids"), this.dict.context.obj(e));
  }
  getParent() {
    const e = this.dict.get(x.of("Parent"));
    if (e instanceof te) {
      const t = this.dict.lookup(x.of("Parent"), $);
      return new Oa(t, e);
    }
  }
  setParent(e) {
    e ? this.dict.set(x.of("Parent"), e) : this.dict.delete(x.of("Parent"));
  }
  getFullyQualifiedName() {
    const e = this.getParent();
    return e ? `${e.getFullyQualifiedName()}.${this.getPartialName()}` : this.getPartialName();
  }
  getPartialName() {
    var e;
    return (e = this.T()) == null ? void 0 : e.decodeText();
  }
  setPartialName(e) {
    e ? this.dict.set(x.of("T"), z.fromText(e)) : this.dict.delete(x.of("T"));
  }
  setDefaultAppearance(e) {
    this.dict.set(x.of("DA"), G.of(e));
  }
  getDefaultAppearance() {
    const e = this.DA();
    return e instanceof z ? e.decodeText() : e == null ? void 0 : e.asString();
  }
  setFontSize(e) {
    const t = this.getFullyQualifiedName() ?? "", i = this.getDefaultAppearance();
    if (!i)
      throw new au(t);
    const n = _s(i, dm);
    if (!n.match)
      throw new su(t);
    const a = i.slice(0, n.pos - n.match[0].length), s = n.pos <= i.length ? i.slice(n.pos) : "", o = n.match[1], l = `${a} /${o} ${e} Tf ${s}`;
    this.setDefaultAppearance(l);
  }
  getFlags() {
    var e;
    return ((e = this.Ff()) == null ? void 0 : e.asNumber()) ?? 0;
  }
  setFlags(e) {
    this.dict.set(x.of("Ff"), q.of(e));
  }
  hasFlag(e) {
    return (this.getFlags() & e) !== 0;
  }
  setFlag(e) {
    const t = this.getFlags();
    this.setFlags(t | e);
  }
  clearFlag(e) {
    const t = this.getFlags();
    this.setFlags(t & ~e);
  }
  setFlagTo(e, t) {
    t ? this.setFlag(e) : this.clearFlag(e);
  }
  getInheritableAttribute(e) {
    let t;
    return this.ascend((i) => {
      t || (t = i.dict.get(e));
    }), t;
  }
  ascend(e) {
    e(this);
    const t = this.getParent();
    t && t.ascend(e);
  }
}
class Tn {
  constructor(e) {
    Object.defineProperty(this, "dict", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.dict = e;
  }
  W() {
    const e = this.dict.lookup(x.of("W"));
    if (e instanceof q)
      return e;
  }
  getWidth() {
    var e;
    return ((e = this.W()) == null ? void 0 : e.asNumber()) ?? 1;
  }
  setWidth(e) {
    const t = this.dict.context.obj(e);
    this.dict.set(x.of("W"), t);
  }
}
Object.defineProperty(Tn, "fromDict", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => new Tn(r)
});
class fs {
  constructor(e) {
    Object.defineProperty(this, "dict", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.dict = e;
  }
  // This is technically required by the PDF spec
  Rect() {
    return this.dict.lookup(x.of("Rect"), V);
  }
  AP() {
    return this.dict.lookupMaybe(x.of("AP"), $);
  }
  F() {
    const e = this.dict.lookup(x.of("F"));
    return this.dict.context.lookupMaybe(e, q);
  }
  getRectangle() {
    const e = this.Rect();
    return (e == null ? void 0 : e.asRectangle()) ?? { x: 0, y: 0, width: 0, height: 0 };
  }
  setRectangle(e) {
    const { x: t, y: i, width: n, height: a } = e, s = this.dict.context.obj([t, i, t + n, i + a]);
    this.dict.set(x.of("Rect"), s);
  }
  getAppearanceState() {
    const e = this.dict.lookup(x.of("AS"));
    if (e instanceof x)
      return e;
  }
  setAppearanceState(e) {
    this.dict.set(x.of("AS"), e);
  }
  setAppearances(e) {
    this.dict.set(x.of("AP"), e);
  }
  ensureAP() {
    let e = this.AP();
    return e || (e = this.dict.context.obj({}), this.dict.set(x.of("AP"), e)), e;
  }
  getNormalAppearance() {
    const t = this.ensureAP().get(x.of("N"));
    if (t instanceof te || t instanceof $)
      return t;
    throw new Error(`Unexpected N type: ${t == null ? void 0 : t.constructor.name}`);
  }
  /** @param appearance A PDFDict or PDFStream (direct or ref) */
  setNormalAppearance(e) {
    this.ensureAP().set(x.of("N"), e);
  }
  /** @param appearance A PDFDict or PDFStream (direct or ref) */
  setRolloverAppearance(e) {
    this.ensureAP().set(x.of("R"), e);
  }
  /** @param appearance A PDFDict or PDFStream (direct or ref) */
  setDownAppearance(e) {
    this.ensureAP().set(x.of("D"), e);
  }
  removeRolloverAppearance() {
    const e = this.AP();
    e == null || e.delete(x.of("R"));
  }
  removeDownAppearance() {
    const e = this.AP();
    e == null || e.delete(x.of("D"));
  }
  getAppearances() {
    const e = this.AP();
    if (!e)
      return;
    const t = e.lookup(x.of("N"), $, Ze), i = e.lookupMaybe(x.of("R"), $, Ze), n = e.lookupMaybe(x.of("D"), $, Ze);
    return { normal: t, rollover: i, down: n };
  }
  getFlags() {
    var e;
    return ((e = this.F()) == null ? void 0 : e.asNumber()) ?? 0;
  }
  setFlags(e) {
    this.dict.set(x.of("F"), q.of(e));
  }
  hasFlag(e) {
    return (this.getFlags() & e) !== 0;
  }
  setFlag(e) {
    const t = this.getFlags();
    this.setFlags(t | e);
  }
  clearFlag(e) {
    const t = this.getFlags();
    this.setFlags(t & ~e);
  }
  setFlagTo(e, t) {
    t ? this.setFlag(e) : this.clearFlag(e);
  }
}
Object.defineProperty(fs, "fromDict", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => new fs(r)
});
class Ti {
  constructor(e) {
    Object.defineProperty(this, "dict", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.dict = e;
  }
  R() {
    const e = this.dict.lookup(x.of("R"));
    if (e instanceof q)
      return e;
  }
  BC() {
    const e = this.dict.lookup(x.of("BC"));
    if (e instanceof V)
      return e;
  }
  BG() {
    const e = this.dict.lookup(x.of("BG"));
    if (e instanceof V)
      return e;
  }
  CA() {
    const e = this.dict.lookup(x.of("CA"));
    if (e instanceof z || e instanceof G)
      return e;
  }
  RC() {
    const e = this.dict.lookup(x.of("RC"));
    if (e instanceof z || e instanceof G)
      return e;
  }
  AC() {
    const e = this.dict.lookup(x.of("AC"));
    if (e instanceof z || e instanceof G)
      return e;
  }
  getRotation() {
    var e;
    return (e = this.R()) == null ? void 0 : e.asNumber();
  }
  getBorderColor() {
    const e = this.BC();
    if (!e)
      return;
    const t = [];
    for (let i = 0, n = e == null ? void 0 : e.size(); i < n; i++) {
      const a = e.get(i);
      a instanceof q && t.push(a.asNumber());
    }
    return t;
  }
  getBackgroundColor() {
    const e = this.BG();
    if (!e)
      return;
    const t = [];
    for (let i = 0, n = e == null ? void 0 : e.size(); i < n; i++) {
      const a = e.get(i);
      a instanceof q && t.push(a.asNumber());
    }
    return t;
  }
  getCaptions() {
    const e = this.CA(), t = this.RC(), i = this.AC();
    return {
      normal: e == null ? void 0 : e.decodeText(),
      rollover: t == null ? void 0 : t.decodeText(),
      down: i == null ? void 0 : i.decodeText()
    };
  }
  setRotation(e) {
    const t = this.dict.context.obj(e);
    this.dict.set(x.of("R"), t);
  }
  setBorderColor(e) {
    const t = this.dict.context.obj(e);
    this.dict.set(x.of("BC"), t);
  }
  setBackgroundColor(e) {
    const t = this.dict.context.obj(e);
    this.dict.set(x.of("BG"), t);
  }
  setCaptions(e) {
    const t = z.fromText(e.normal);
    if (this.dict.set(x.of("CA"), t), e.rollover) {
      const i = z.fromText(e.rollover);
      this.dict.set(x.of("RC"), i);
    } else
      this.dict.delete(x.of("RC"));
    if (e.down) {
      const i = z.fromText(e.down);
      this.dict.set(x.of("AC"), i);
    } else
      this.dict.delete(x.of("AC"));
  }
}
Object.defineProperty(Ti, "fromDict", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => new Ti(r)
});
class _r extends fs {
  MK() {
    const e = this.dict.lookup(x.of("MK"));
    if (e instanceof $)
      return e;
  }
  BS() {
    const e = this.dict.lookup(x.of("BS"));
    if (e instanceof $)
      return e;
  }
  DA() {
    const e = this.dict.lookup(x.of("DA"));
    if (e instanceof G || e instanceof z)
      return e;
  }
  P() {
    const e = this.dict.get(x.of("P"));
    if (e instanceof te)
      return e;
  }
  setP(e) {
    this.dict.set(x.of("P"), e);
  }
  setDefaultAppearance(e) {
    this.dict.set(x.of("DA"), G.of(e));
  }
  getDefaultAppearance() {
    const e = this.DA();
    return e instanceof z ? e.decodeText() : e == null ? void 0 : e.asString();
  }
  getAppearanceCharacteristics() {
    const e = this.MK();
    if (e)
      return Ti.fromDict(e);
  }
  getOrCreateAppearanceCharacteristics() {
    const e = this.MK();
    if (e)
      return Ti.fromDict(e);
    const t = Ti.fromDict(this.dict.context.obj({}));
    return this.dict.set(x.of("MK"), t.dict), t;
  }
  getBorderStyle() {
    const e = this.BS();
    if (e)
      return Tn.fromDict(e);
  }
  getOrCreateBorderStyle() {
    const e = this.BS();
    if (e)
      return Tn.fromDict(e);
    const t = Tn.fromDict(this.dict.context.obj({}));
    return this.dict.set(x.of("BS"), t.dict), t;
  }
  getOnValue() {
    var t;
    const e = (t = this.getAppearances()) == null ? void 0 : t.normal;
    if (e instanceof $) {
      const i = e.keys();
      for (let n = 0, a = i.length; n < a; n++) {
        const s = i[n];
        if (s !== x.of("Off"))
          return s;
      }
    }
  }
}
Object.defineProperty(_r, "fromDict", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => new _r(r)
});
Object.defineProperty(_r, "create", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e) => {
    const t = r.obj({
      Type: "Annot",
      Subtype: "Widget",
      Rect: [0, 0, 0, 0],
      Parent: e
    });
    return new _r(t);
  }
});
class Ut extends Oa {
  FT() {
    const e = this.getInheritableAttribute(x.of("FT"));
    return this.dict.context.lookup(e, x);
  }
  getWidgets() {
    const e = this.Kids();
    if (!e)
      return [_r.fromDict(this.dict)];
    const t = new Array(e.size());
    for (let i = 0, n = e.size(); i < n; i++) {
      const a = e.lookup(i, $);
      t[i] = _r.fromDict(a);
    }
    return t;
  }
  addWidget(e) {
    const { Kids: t } = this.normalizedEntries();
    t.push(e);
  }
  removeWidget(e) {
    const t = this.Kids();
    if (t) {
      if (e < 0 || e > t.size())
        throw new In(e, 0, t.size());
      t.remove(e);
    } else {
      if (e !== 0)
        throw new In(e, 0, 0);
      this.setKids([]);
    }
  }
  normalizedEntries() {
    let e = this.Kids();
    return e || (e = this.dict.context.obj([this.ref]), this.dict.set(x.of("Kids"), e)), { Kids: e };
  }
}
Object.defineProperty(Ut, "fromDict", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e) => new Ut(r, e)
});
class qs extends Ut {
  Opt() {
    return this.dict.lookupMaybe(x.of("Opt"), G, z, V);
  }
  setOpt(e) {
    this.dict.set(x.of("Opt"), this.dict.context.obj(e));
  }
  getExportValues() {
    const e = this.Opt();
    if (!e)
      return;
    if (e instanceof G || e instanceof z)
      return [e];
    const t = [];
    for (let i = 0, n = e.size(); i < n; i++) {
      const a = e.lookup(i);
      (a instanceof G || a instanceof z) && t.push(a);
    }
    return t;
  }
  removeExportValue(e) {
    const t = this.Opt();
    if (t)
      if (t instanceof G || t instanceof z) {
        if (e !== 0)
          throw new In(e, 0, 0);
        this.setOpt([]);
      } else {
        if (e < 0 || e > t.size())
          throw new In(e, 0, t.size());
        t.remove(e);
      }
  }
  // Enforce use use of /Opt even if it isn't strictly necessary
  normalizeExportValues() {
    var n;
    const e = this.getExportValues() ?? [], t = [], i = this.getWidgets();
    for (let a = 0, s = i.length; a < s; a++) {
      const o = i[a], l = e[a] ?? z.fromText(((n = o.getOnValue()) == null ? void 0 : n.decodeText()) ?? "");
      t.push(l);
    }
    this.setOpt(t);
  }
  /**
   * Reuses existing opt if one exists with the same value (assuming
   * `useExistingIdx` is `true`). Returns index of existing (or new) opt.
   */
  addOpt(e, t) {
    this.normalizeExportValues();
    const i = e.decodeText();
    let n;
    if (t) {
      const s = this.getExportValues() ?? [];
      for (let o = 0, l = s.length; o < l; o++)
        s[o].decodeText() === i && (n = o);
    }
    const a = this.Opt();
    return a.push(e), n ?? a.size() - 1;
  }
  addWidgetWithOpt(e, t, i) {
    const n = this.addOpt(t, i), a = x.of(String(n));
    return this.addWidget(e), a;
  }
}
class $t extends qs {
  setValue(e) {
    const t = this.getOnValue() ?? x.of("Yes");
    if (e !== t && e !== x.of("Off"))
      throw new ks();
    this.dict.set(x.of("V"), e);
    const i = this.getWidgets();
    for (let n = 0, a = i.length; n < a; n++) {
      const s = i[n], o = s.getOnValue() === e ? e : x.of("Off");
      s.setAppearanceState(o);
    }
  }
  getValue() {
    const e = this.V();
    return e instanceof x ? e : x.of("Off");
  }
  getOnValue() {
    const [e] = this.getWidgets();
    return e == null ? void 0 : e.getOnValue();
  }
}
Object.defineProperty($t, "fromDict", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e) => new $t(r, e)
});
Object.defineProperty($t, "create", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => {
    const e = r.obj({
      FT: "Btn",
      Kids: []
    }), t = r.register(e);
    return new $t(e, t);
  }
});
const _e = (r) => 1 << r;
var tt;
(function(r) {
  r[r.ReadOnly = _e(0)] = "ReadOnly", r[r.Required = _e(1)] = "Required", r[r.NoExport = _e(2)] = "NoExport";
})(tt || (tt = {}));
var Ge;
(function(r) {
  r[r.NoToggleToOff = _e(14)] = "NoToggleToOff", r[r.Radio = _e(15)] = "Radio", r[r.PushButton = _e(16)] = "PushButton", r[r.RadiosInUnison = _e(25)] = "RadiosInUnison";
})(Ge || (Ge = {}));
var xe;
(function(r) {
  r[r.Multiline = _e(12)] = "Multiline", r[r.Password = _e(13)] = "Password", r[r.FileSelect = _e(20)] = "FileSelect", r[r.DoNotSpellCheck = _e(22)] = "DoNotSpellCheck", r[r.DoNotScroll = _e(23)] = "DoNotScroll", r[r.Comb = _e(24)] = "Comb", r[r.RichText = _e(25)] = "RichText";
})(xe || (xe = {}));
var ne;
(function(r) {
  r[r.Combo = _e(17)] = "Combo", r[r.Edit = _e(18)] = "Edit", r[r.Sort = _e(19)] = "Sort", r[r.MultiSelect = _e(21)] = "MultiSelect", r[r.DoNotSpellCheck = _e(22)] = "DoNotSpellCheck", r[r.CommitOnSelChange = _e(26)] = "CommitOnSelChange";
})(ne || (ne = {}));
class zc extends Ut {
  setValues(e) {
    if (this.hasFlag(ne.Combo) && !this.hasFlag(ne.Edit) && !this.valuesAreValid(e))
      throw new ks();
    if (e.length === 0 && this.dict.delete(x.of("V")), e.length === 1 && this.dict.set(x.of("V"), e[0]), e.length > 1) {
      if (!this.hasFlag(ne.MultiSelect))
        throw new ou();
      this.dict.set(x.of("V"), this.dict.context.obj(e));
    }
    this.updateSelectedIndices(e);
  }
  valuesAreValid(e) {
    const t = this.getOptions();
    for (let i = 0, n = e.length; i < n; i++) {
      const a = e[i].decodeText();
      if (!t.find((s) => a === (s.display || s.value).decodeText()))
        return !1;
    }
    return !0;
  }
  updateSelectedIndices(e) {
    if (e.length > 1) {
      const t = new Array(e.length), i = this.getOptions();
      for (let n = 0, a = e.length; n < a; n++) {
        const s = e[n].decodeText();
        t[n] = i.findIndex((o) => s === (o.display || o.value).decodeText());
      }
      this.dict.set(x.of("I"), this.dict.context.obj(t.sort()));
    } else
      this.dict.delete(x.of("I"));
  }
  getValues() {
    const e = this.V();
    if (e instanceof G || e instanceof z)
      return [e];
    if (e instanceof V) {
      const t = [];
      for (let i = 0, n = e.size(); i < n; i++) {
        const a = e.lookup(i);
        (a instanceof G || a instanceof z) && t.push(a);
      }
      return t;
    }
    return [];
  }
  Opt() {
    return this.dict.lookupMaybe(x.of("Opt"), G, z, V);
  }
  setOptions(e) {
    const t = new Array(e.length);
    for (let i = 0, n = e.length; i < n; i++) {
      const { value: a, display: s } = e[i];
      t[i] = this.dict.context.obj([a, s || a]);
    }
    this.dict.set(x.of("Opt"), this.dict.context.obj(t));
  }
  getOptions() {
    const e = this.Opt();
    if (e instanceof G || e instanceof z)
      return [{ value: e, display: e }];
    if (e instanceof V) {
      const t = [];
      for (let i = 0, n = e.size(); i < n; i++) {
        const a = e.lookup(i);
        if ((a instanceof G || a instanceof z) && t.push({ value: a, display: a }), a instanceof V && a.size() > 0) {
          const s = a.lookup(0, G, z), o = a.lookupMaybe(1, G, z);
          t.push({ value: s, display: o || s });
        }
      }
      return t;
    }
    return [];
  }
}
class Wt extends zc {
}
Object.defineProperty(Wt, "fromDict", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e) => new Wt(r, e)
});
Object.defineProperty(Wt, "create", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => {
    const e = r.obj({
      FT: "Ch",
      Ff: ne.Combo,
      Kids: []
    }), t = r.register(e);
    return new Wt(e, t);
  }
});
class Ht extends Oa {
  addField(e) {
    const { Kids: t } = this.normalizedEntries();
    t == null || t.push(e);
  }
  normalizedEntries() {
    let e = this.Kids();
    return e || (e = this.dict.context.obj([]), this.dict.set(x.of("Kids"), e)), { Kids: e };
  }
}
Object.defineProperty(Ht, "fromDict", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e) => new Ht(r, e)
});
Object.defineProperty(Ht, "create", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => {
    const e = r.obj({}), t = r.register(e);
    return new Ht(e, t);
  }
});
class zi extends Ut {
}
Object.defineProperty(zi, "fromDict", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e) => new zi(r, e)
});
class qt extends Ut {
  MaxLen() {
    const e = this.dict.lookup(x.of("MaxLen"));
    if (e instanceof q)
      return e;
  }
  Q() {
    const e = this.dict.lookup(x.of("Q"));
    if (e instanceof q)
      return e;
  }
  setMaxLength(e) {
    this.dict.set(x.of("MaxLen"), q.of(e));
  }
  removeMaxLength() {
    this.dict.delete(x.of("MaxLen"));
  }
  getMaxLength() {
    var e;
    return (e = this.MaxLen()) == null ? void 0 : e.asNumber();
  }
  setQuadding(e) {
    this.dict.set(x.of("Q"), q.of(e));
  }
  getQuadding() {
    var e;
    return (e = this.Q()) == null ? void 0 : e.asNumber();
  }
  setValue(e) {
    this.dict.set(x.of("V"), e);
  }
  removeValue() {
    this.dict.delete(x.of("V"));
  }
  getValue() {
    const e = this.V();
    if (e instanceof G || e instanceof z)
      return e;
  }
}
Object.defineProperty(qt, "fromDict", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e) => new qt(r, e)
});
Object.defineProperty(qt, "create", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => {
    const e = r.obj({
      FT: "Tx",
      Kids: []
    }), t = r.register(e);
    return new qt(e, t);
  }
});
class Zt extends qs {
}
Object.defineProperty(Zt, "fromDict", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e) => new Zt(r, e)
});
Object.defineProperty(Zt, "create", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => {
    const e = r.obj({
      FT: "Btn",
      Ff: Ge.PushButton,
      Kids: []
    }), t = r.register(e);
    return new Zt(e, t);
  }
});
class Kt extends qs {
  setValue(e) {
    if (!this.getOnValues().includes(e) && e !== x.of("Off"))
      throw new ks();
    this.dict.set(x.of("V"), e);
    const i = this.getWidgets();
    for (let n = 0, a = i.length; n < a; n++) {
      const s = i[n], o = s.getOnValue() === e ? e : x.of("Off");
      s.setAppearanceState(o);
    }
  }
  getValue() {
    const e = this.V();
    return e instanceof x ? e : x.of("Off");
  }
  getOnValues() {
    const e = this.getWidgets(), t = [];
    for (let i = 0, n = e.length; i < n; i++) {
      const a = e[i].getOnValue();
      a && t.push(a);
    }
    return t;
  }
}
Object.defineProperty(Kt, "fromDict", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e) => new Kt(r, e)
});
Object.defineProperty(Kt, "create", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => {
    const e = r.obj({
      FT: "Btn",
      Ff: Ge.Radio,
      Kids: []
    }), t = r.register(e);
    return new Kt(e, t);
  }
});
class Vt extends zc {
}
Object.defineProperty(Vt, "fromDict", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e) => new Vt(r, e)
});
Object.defineProperty(Vt, "create", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => {
    const e = r.obj({
      FT: "Ch",
      Kids: []
    }), t = r.register(e);
    return new Vt(e, t);
  }
});
const Zs = (r) => {
  if (!r)
    return [];
  const e = [];
  for (let t = 0, i = r.size(); t < i; t++) {
    const n = r.get(t), a = r.lookup(t);
    n instanceof te && a instanceof $ && e.push([Lc(a, n), n]);
  }
  return e;
}, Lc = (r, e) => hm(r) ? Ht.fromDict(r, e) : fm(r, e), hm = (r) => {
  const e = r.lookup(x.of("Kids"));
  if (e instanceof V)
    for (let t = 0, i = e.size(); t < i; t++) {
      const n = e.lookup(t);
      if (n instanceof $ && n.has(x.of("T")))
        return !0;
    }
  return !1;
}, fm = (r, e) => {
  const t = Mc(r, x.of("FT")), i = r.context.lookup(t, x);
  return i === x.of("Btn") ? bm(r, e) : i === x.of("Ch") ? xm(r, e) : i === x.of("Tx") ? qt.fromDict(r, e) : i === x.of("Sig") ? zi.fromDict(r, e) : Ut.fromDict(r, e);
}, bm = (r, e) => {
  const t = Mc(r, x.of("Ff")), i = r.context.lookupMaybe(t, q), n = (i == null ? void 0 : i.asNumber()) ?? 0;
  return tc(n, Ge.PushButton) ? Zt.fromDict(r, e) : tc(n, Ge.Radio) ? Kt.fromDict(r, e) : $t.fromDict(r, e);
}, xm = (r, e) => {
  const t = Mc(r, x.of("Ff")), i = r.context.lookupMaybe(t, q), n = (i == null ? void 0 : i.asNumber()) ?? 0;
  return tc(n, ne.Combo) ? Wt.fromDict(r, e) : Vt.fromDict(r, e);
}, tc = (r, e) => (r & e) !== 0, Mc = (r, e) => {
  let t;
  return ch(r, (i) => {
    t || (t = i.get(e));
  }), t;
}, ch = (r, e) => {
  e(r);
  const t = r.lookupMaybe(x.of("Parent"), $);
  t && ch(t, e);
};
class Gt {
  constructor(e) {
    Object.defineProperty(this, "dict", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.dict = e;
  }
  Fields() {
    const e = this.dict.lookup(x.of("Fields"));
    if (e instanceof V)
      return e;
  }
  getFields() {
    const { Fields: e } = this.normalizedEntries(), t = new Array(e.size());
    for (let i = 0, n = e.size(); i < n; i++) {
      const a = e.get(i), s = e.lookup(i, $);
      t[i] = [Lc(s, a), a];
    }
    return t;
  }
  getAllFields() {
    const e = [], t = (i) => {
      if (i)
        for (let n = 0, a = i.length; n < a; n++) {
          const s = i[n];
          e.push(s);
          const [o] = s;
          o instanceof Ht && t(Zs(o.Kids()));
        }
    };
    return t(this.getFields()), e;
  }
  addField(e) {
    const { Fields: t } = this.normalizedEntries();
    t == null || t.push(e);
  }
  removeField(e) {
    const t = e.getParent(), i = t === void 0 ? this.normalizedEntries().Fields : t.Kids(), n = i == null ? void 0 : i.indexOf(e.ref);
    if (i === void 0 || n === void 0)
      throw new Error(`Tried to remove inexistent field ${e.getFullyQualifiedName()}`);
    i.remove(n), t !== void 0 && i.size() === 0 && this.removeField(t);
  }
  normalizedEntries() {
    let e = this.Fields();
    return e || (e = this.dict.context.obj([]), this.dict.set(x.of("Fields"), e)), { Fields: e };
  }
}
Object.defineProperty(Gt, "fromDict", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => new Gt(r)
});
Object.defineProperty(Gt, "create", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => {
    const e = r.obj({ Fields: [] });
    return new Gt(e);
  }
});
class ai extends $ {
  Pages() {
    return this.lookup(x.of("Pages"), $);
  }
  AcroForm() {
    return this.lookupMaybe(x.of("AcroForm"), $);
  }
  getAcroForm() {
    const e = this.AcroForm();
    if (e)
      return Gt.fromDict(e);
  }
  getOrCreateAcroForm() {
    let e = this.getAcroForm();
    if (!e) {
      e = Gt.create(this.context);
      const t = this.context.register(e.dict);
      this.set(x.of("AcroForm"), t);
    }
    return e;
  }
  ViewerPreferences() {
    return this.lookupMaybe(x.of("ViewerPreferences"), $);
  }
  getViewerPreferences() {
    const e = this.ViewerPreferences();
    if (e)
      return ni.fromDict(e);
  }
  getOrCreateViewerPreferences() {
    let e = this.getViewerPreferences();
    if (!e) {
      e = ni.create(this.context);
      const t = this.context.register(e.dict);
      this.set(x.of("ViewerPreferences"), t);
    }
    return e;
  }
  /**
   * Inserts the given ref as a leaf node of this catalog's page tree at the
   * specified index (zero-based). Also increments the `Count` of each node in
   * the page tree hierarchy to accomodate the new page.
   *
   * Returns the ref of the PDFPageTree node into which `leafRef` was inserted.
   */
  insertLeafNode(e, t) {
    const i = this.get(x.of("Pages"));
    return this.Pages().insertLeafNode(e, t) || i;
  }
  removeLeafNode(e) {
    this.Pages().removeLeafNode(e);
  }
}
Object.defineProperty(ai, "withContextAndPages", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e) => {
    const t = /* @__PURE__ */ new Map();
    return t.set(x.of("Type"), x.of("Catalog")), t.set(x.of("Pages"), e), new ai(t, r);
  }
});
Object.defineProperty(ai, "fromMapWithContext", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e) => new ai(r, e)
});
class ft extends $ {
  Parent() {
    return this.lookup(x.of("Parent"));
  }
  Kids() {
    return this.lookup(x.of("Kids"), V);
  }
  Count() {
    return this.lookup(x.of("Count"), q);
  }
  pushTreeNode(e) {
    this.Kids().push(e);
  }
  pushLeafNode(e) {
    const t = this.Kids();
    this.insertLeafKid(t.size(), e);
  }
  /**
   * Inserts the given ref as a leaf node of this page tree at the specified
   * index (zero-based). Also increments the `Count` of each page tree in the
   * hierarchy to accomodate the new page.
   *
   * Returns the ref of the PDFPageTree node into which `leafRef` was inserted,
   * or `undefined` if it was inserted into the root node (the PDFPageTree upon
   * which the method was first called).
   */
  insertLeafNode(e, t) {
    const i = this.Kids(), n = this.Count().asNumber();
    if (t > n)
      throw new Do(t, n);
    let a = t;
    for (let s = 0, o = i.size(); s < o; s++) {
      if (a === 0) {
        this.insertLeafKid(s, e);
        return;
      }
      const l = i.get(s), c = this.context.lookup(l);
      if (c instanceof ft) {
        if (c.Count().asNumber() > a)
          return c.insertLeafNode(e, a) || l;
        a -= c.Count().asNumber();
      }
      c instanceof Be && (a -= 1);
    }
    if (a === 0) {
      this.insertLeafKid(i.size(), e);
      return;
    }
    throw new Eo(t, "insertLeafNode");
  }
  /**
   * Removes the leaf node at the specified index (zero-based) from this page
   * tree. Also decrements the `Count` of each page tree in the hierarchy to
   * account for the removed page.
   *
   * If `prune` is true, then intermediate tree nodes will be removed from the
   * tree if they contain 0 children after the leaf node is removed.
   */
  removeLeafNode(e, t = !0) {
    const i = this.Kids(), n = this.Count().asNumber();
    if (e >= n)
      throw new Do(e, n);
    let a = e;
    for (let s = 0, o = i.size(); s < o; s++) {
      const l = i.get(s), c = this.context.lookup(l);
      if (c instanceof ft)
        if (c.Count().asNumber() > a) {
          c.removeLeafNode(a, t), t && c.Kids().size() === 0 && i.remove(s);
          return;
        } else
          a -= c.Count().asNumber();
      if (c instanceof Be)
        if (a === 0) {
          this.removeKid(s);
          return;
        } else
          a -= 1;
    }
    throw new Eo(e, "removeLeafNode");
  }
  ascend(e) {
    e(this);
    const t = this.Parent();
    t && t.ascend(e);
  }
  /** Performs a Post-Order traversal of this page tree */
  traverse(e) {
    const t = this.Kids();
    for (let i = 0, n = t.size(); i < n; i++) {
      const a = t.get(i), s = this.context.lookup(a);
      s instanceof ft && s.traverse(e), e(s, a);
    }
  }
  insertLeafKid(e, t) {
    const i = this.Kids();
    this.ascend((n) => {
      const a = n.Count().asNumber() + 1;
      n.set(x.of("Count"), q.of(a));
    }), i.insert(e, t);
  }
  removeKid(e) {
    const t = this.Kids();
    t.lookup(e) instanceof Be && this.ascend((n) => {
      const a = n.Count().asNumber() - 1;
      n.set(x.of("Count"), q.of(a));
    }), t.remove(e);
  }
}
Object.defineProperty(ft, "withContext", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e) => {
    const t = /* @__PURE__ */ new Map();
    return t.set(x.of("Type"), x.of("Pages")), t.set(x.of("Kids"), r.obj([])), t.set(x.of("Count"), r.obj(0)), e && t.set(x.of("Parent"), e), new ft(t, r);
  }
});
Object.defineProperty(ft, "fromMapWithContext", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e) => new ft(r, e)
});
const je = new Uint8Array(256);
je[w.Zero] = 1;
je[w.One] = 1;
je[w.Two] = 1;
je[w.Three] = 1;
je[w.Four] = 1;
je[w.Five] = 1;
je[w.Six] = 1;
je[w.Seven] = 1;
je[w.Eight] = 1;
je[w.Nine] = 1;
const Ks = new Uint8Array(256);
Ks[w.Period] = 1;
Ks[w.Plus] = 1;
Ks[w.Minus] = 1;
const Uc = new Uint8Array(256);
for (let r = 0, e = 256; r < e; r++)
  Uc[r] = je[r] || Ks[r] ? 1 : 0;
const { Newline: I0, CarriageReturn: z0 } = w;
class gm {
  constructor(e, t = !1) {
    Object.defineProperty(this, "bytes", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "capNumbers", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.bytes = e, this.capNumbers = t;
  }
  parseRawInt() {
    let e = "";
    for (; !this.bytes.done(); ) {
      const i = this.bytes.peek();
      if (!je[i])
        break;
      e += xr(this.bytes.next());
    }
    const t = Number(e);
    if (!e || !isFinite(t))
      throw new To(this.bytes.position(), e);
    return t;
  }
  // TODO: Maybe handle exponential format?
  // TODO: Compare performance of string concatenation to charFromCode(...bytes)
  parseRawNumber() {
    let e = "";
    for (; !this.bytes.done(); ) {
      const i = this.bytes.peek();
      if (!Uc[i] || (e += xr(this.bytes.next()), i === w.Period))
        break;
    }
    for (; !this.bytes.done(); ) {
      const i = this.bytes.peek();
      if (!je[i])
        break;
      e += xr(this.bytes.next());
    }
    const t = Number(e);
    if (!e || !isFinite(t))
      throw new To(this.bytes.position(), e);
    if (t > Number.MAX_SAFE_INTEGER)
      if (this.capNumbers) {
        const i = `Parsed number that is too large for some PDF readers: ${e}, using Number.MAX_SAFE_INTEGER instead.`;
        return console.warn(i), Number.MAX_SAFE_INTEGER;
      } else {
        const i = `Parsed number that is too large for some PDF readers: ${e}, not capping.`;
        console.warn(i);
      }
    return t;
  }
  skipWhitespace() {
    for (; !this.bytes.done() && cu[this.bytes.peek()]; )
      this.bytes.next();
  }
  skipLine() {
    for (; !this.bytes.done(); ) {
      const e = this.bytes.peek();
      if (e === I0 || e === z0)
        return;
      this.bytes.next();
    }
  }
  skipComment() {
    if (this.bytes.peek() !== w.Percent)
      return !1;
    for (; !this.bytes.done(); ) {
      const e = this.bytes.peek();
      if (e === I0 || e === z0)
        return !0;
      this.bytes.next();
    }
    return !0;
  }
  skipWhitespaceAndComments() {
    for (this.skipWhitespace(); this.skipComment(); )
      this.skipWhitespace();
  }
  matchKeyword(e) {
    const t = this.bytes.offset();
    for (let i = 0, n = e.length; i < n; i++)
      if (this.bytes.done() || this.bytes.next() !== e[i])
        return this.bytes.moveTo(t), !1;
    return !0;
  }
}
class kr {
  constructor(e) {
    Object.defineProperty(this, "bytes", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "length", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "idx", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 0
    }), Object.defineProperty(this, "line", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 0
    }), Object.defineProperty(this, "column", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 0
    }), this.bytes = e, this.length = this.bytes.length;
  }
  moveTo(e) {
    this.idx = e;
  }
  next() {
    const e = this.bytes[this.idx++];
    return e === w.Newline ? (this.line += 1, this.column = 0) : this.column += 1, e;
  }
  assertNext(e) {
    if (this.peek() !== e)
      throw new lu(this.position(), e, this.peek());
    return this.next();
  }
  peek() {
    return this.bytes[this.idx];
  }
  peekAhead(e) {
    return this.bytes[this.idx + e];
  }
  peekAt(e) {
    return this.bytes[e];
  }
  done() {
    return this.idx >= this.length;
  }
  offset() {
    return this.idx;
  }
  slice(e, t) {
    return this.bytes.slice(e, t);
  }
  position() {
    return { line: this.line, column: this.column, offset: this.idx };
  }
}
Object.defineProperty(kr, "of", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => new kr(r)
});
Object.defineProperty(kr, "fromPDFRawStream", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => kr.of(Ic(r).decode())
});
const { Space: pm, CarriageReturn: sn, Newline: on } = w, cn = [w.s, w.t, w.r, w.e, w.a, w.m], qa = [
  w.e,
  w.n,
  w.d,
  w.s,
  w.t,
  w.r,
  w.e,
  w.a,
  w.m
], le = {
  header: [w.Percent, w.P, w.D, w.F, w.Dash],
  eof: [w.Percent, w.Percent, w.E, w.O, w.F],
  obj: [w.o, w.b, w.j],
  endobj: [w.e, w.n, w.d, w.o, w.b, w.j],
  xref: [w.x, w.r, w.e, w.f],
  trailer: [
    w.t,
    w.r,
    w.a,
    w.i,
    w.l,
    w.e,
    w.r
  ],
  startxref: [
    w.s,
    w.t,
    w.a,
    w.r,
    w.t,
    w.x,
    w.r,
    w.e,
    w.f
  ],
  true: [w.t, w.r, w.u, w.e],
  false: [w.f, w.a, w.l, w.s, w.e],
  null: [w.n, w.u, w.l, w.l],
  stream: cn,
  streamEOF1: [...cn, pm, sn, on],
  streamEOF2: [...cn, sn, on],
  streamEOF3: [...cn, sn],
  streamEOF4: [...cn, on],
  endstream: qa,
  EOF1endstream: [sn, on, ...qa],
  EOF2endstream: [sn, ...qa],
  EOF3endstream: [on, ...qa]
};
class si extends gm {
  constructor(e, t, i = !1, n) {
    super(e, i), Object.defineProperty(this, "context", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "cryptoFactory", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.context = t, this.cryptoFactory = n;
  }
  // TODO: Is it possible to reduce duplicate parsing for ref lookaheads?
  parseObject(e) {
    if (this.skipWhitespaceAndComments(), this.matchKeyword(le.true))
      return Dt.True;
    if (this.matchKeyword(le.false))
      return Dt.False;
    if (this.matchKeyword(le.null))
      return Le;
    const t = this.bytes.peek();
    if (t === w.LessThan && this.bytes.peekAhead(1) === w.LessThan)
      return this.parseDictOrStream(e);
    if (t === w.LessThan)
      return this.parseHexString(e);
    if (t === w.LeftParen)
      return this.parseString(e);
    if (t === w.ForwardSlash)
      return this.parseName();
    if (t === w.LeftSquareBracket)
      return this.parseArray(e);
    if (Uc[t])
      return this.parseNumberOrRef();
    throw new uu(this.bytes.position(), t);
  }
  parseNumberOrRef() {
    const e = this.parseRawNumber();
    this.skipWhitespaceAndComments();
    const t = this.bytes.offset();
    if (je[this.bytes.peek()]) {
      const i = this.parseRawNumber();
      if (this.skipWhitespaceAndComments(), this.bytes.peek() === w.R)
        return this.bytes.assertNext(w.R), te.of(e, i);
    }
    return this.bytes.moveTo(t), q.of(e);
  }
  // TODO: Maybe update PDFHexString.of() logic to remove whitespace and validate input?
  parseHexString(e) {
    let t = "";
    for (this.bytes.assertNext(w.LessThan); !this.bytes.done() && this.bytes.peek() !== w.GreaterThan; )
      t += xr(this.bytes.next());
    return this.bytes.assertNext(w.GreaterThan), this.cryptoFactory && e && (t = this.cryptoFactory.createCipherTransform(e.objectNumber, e.generationNumber).decryptBytes(z.of(t).asBytes()).reduce((a, s) => a + s.toString(16).padStart(2, "0"), "")), z.of(t);
  }
  parseString(e) {
    let t = 0, i = !1, n = "";
    for (; !this.bytes.done(); ) {
      const a = this.bytes.next();
      if (n += xr(a), i || (a === w.LeftParen && (t += 1), a === w.RightParen && (t -= 1)), a === w.BackSlash ? i = !i : i && (i = !1), t === 0) {
        let s = n.substring(1, n.length - 1);
        return this.cryptoFactory && e && (s = this.cryptoFactory.createCipherTransform(e.objectNumber, e.generationNumber).decryptString(s)), G.of(s);
      }
    }
    throw new du(this.bytes.position());
  }
  // TODO: Compare performance of string concatenation to charFromCode(...bytes)
  // TODO: Maybe preallocate small Uint8Array if can use charFromCode?
  parseName() {
    this.bytes.assertNext(w.ForwardSlash);
    let e = "";
    for (; !this.bytes.done(); ) {
      const t = this.bytes.peek();
      if (cu[t] || Vh[t])
        break;
      e += xr(t), this.bytes.next();
    }
    return x.of(e);
  }
  parseArray(e) {
    this.bytes.assertNext(w.LeftSquareBracket), this.skipWhitespaceAndComments();
    const t = V.withContext(this.context);
    for (; this.bytes.peek() !== w.RightSquareBracket; ) {
      const i = this.parseObject(e);
      t.push(i), this.skipWhitespaceAndComments();
    }
    return this.bytes.assertNext(w.RightSquareBracket), t;
  }
  parseDict(e) {
    this.bytes.assertNext(w.LessThan), this.bytes.assertNext(w.LessThan), this.skipWhitespaceAndComments();
    const t = /* @__PURE__ */ new Map();
    for (; !this.bytes.done() && this.bytes.peek() !== w.GreaterThan && this.bytes.peekAhead(1) !== w.GreaterThan; ) {
      const n = this.parseName(), a = this.parseObject(e);
      t.set(n, a), this.skipWhitespaceAndComments();
    }
    this.skipWhitespaceAndComments(), this.bytes.assertNext(w.GreaterThan), this.bytes.assertNext(w.GreaterThan);
    const i = t.get(x.of("Type"));
    return i === x.of("Catalog") ? ai.fromMapWithContext(t, this.context) : i === x.of("Pages") ? ft.fromMapWithContext(t, this.context) : i === x.of("Page") ? Be.fromMapWithContext(t, this.context) : $.fromMapWithContext(t, this.context);
  }
  parseDictOrStream(e) {
    const t = this.bytes.position(), i = this.parseDict(e);
    if (this.skipWhitespaceAndComments(), !this.matchKeyword(le.streamEOF1) && !this.matchKeyword(le.streamEOF2) && !this.matchKeyword(le.streamEOF3) && !this.matchKeyword(le.streamEOF4) && !this.matchKeyword(le.stream))
      return i;
    const n = this.bytes.offset();
    let a;
    const s = i.get(x.of("Length"));
    s instanceof q ? (a = n + s.asNumber(), this.bytes.moveTo(a), this.skipWhitespaceAndComments(), this.matchKeyword(le.endstream) || (this.bytes.moveTo(n), a = this.findEndOfStreamFallback(t))) : a = this.findEndOfStreamFallback(t);
    let o = this.bytes.slice(n, a);
    return this.cryptoFactory && e && (o = this.cryptoFactory.createCipherTransform(e.objectNumber, e.generationNumber).decryptBytes(o)), Et.of(i, o);
  }
  findEndOfStreamFallback(e) {
    let t = 1, i = this.bytes.offset();
    for (; !this.bytes.done() && (i = this.bytes.offset(), this.matchKeyword(le.stream) ? t += 1 : this.matchKeyword(le.EOF1endstream) || this.matchKeyword(le.EOF2endstream) || this.matchKeyword(le.EOF3endstream) || this.matchKeyword(le.endstream) ? t -= 1 : this.bytes.next(), t !== 0); )
      ;
    if (t !== 0)
      throw new hu(e);
    return i;
  }
}
Object.defineProperty(si, "forBytes", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e, t) => new si(kr.of(r), e, t)
});
Object.defineProperty(si, "forByteStream", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e, t = !1) => new si(r, e, t)
});
class bs extends si {
  constructor(e, t) {
    super(kr.fromPDFRawStream(e), e.dict.context), Object.defineProperty(this, "alreadyParsed", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "shouldWaitForTick", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "firstOffset", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "objectCount", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    });
    const { dict: i } = e;
    this.alreadyParsed = !1, this.shouldWaitForTick = t || (() => !1), this.firstOffset = i.lookup(x.of("First"), q).asNumber(), this.objectCount = i.lookup(x.of("N"), q).asNumber();
  }
  async parseIntoContext() {
    if (this.alreadyParsed)
      throw new Ss("PDFObjectStreamParser", "parseIntoContext");
    this.alreadyParsed = !0;
    const e = this.parseOffsetsAndObjectNumbers();
    for (let t = 0, i = e.length; t < i; t++) {
      const { objectNumber: n, offset: a } = e[t];
      this.bytes.moveTo(this.firstOffset + a);
      const s = te.of(n, 0), o = this.parseObject(s);
      this.context.assign(s, o), this.shouldWaitForTick() && await Hr();
    }
  }
  parseOffsetsAndObjectNumbers() {
    const e = [];
    for (let t = 0, i = this.objectCount; t < i; t++) {
      this.skipWhitespaceAndComments();
      const n = this.parseRawInt();
      this.skipWhitespaceAndComments();
      const a = this.parseRawInt();
      e.push({ objectNumber: n, offset: a });
    }
    return e;
  }
}
Object.defineProperty(bs, "forStream", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e) => new bs(r, e)
});
class xs {
  constructor(e) {
    Object.defineProperty(this, "alreadyParsed", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "dict", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "context", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "bytes", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "subsections", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "byteWidths", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.alreadyParsed = !1, this.dict = e.dict, this.bytes = kr.fromPDFRawStream(e), this.context = this.dict.context;
    const t = this.dict.lookup(x.of("Size"), q), i = this.dict.lookup(x.of("Index"));
    if (i instanceof V) {
      this.subsections = [];
      for (let a = 0, s = i.size(); a < s; a += 2) {
        const o = i.lookup(a + 0, q).asNumber(), l = i.lookup(a + 1, q).asNumber();
        this.subsections.push({ firstObjectNumber: o, length: l });
      }
    } else
      this.subsections = [{ firstObjectNumber: 0, length: t.asNumber() }];
    const n = this.dict.lookup(x.of("W"), V);
    this.byteWidths = [-1, -1, -1];
    for (let a = 0, s = n.size(); a < s; a++)
      this.byteWidths[a] = n.lookup(a, q).asNumber();
  }
  parseIntoContext() {
    if (this.alreadyParsed)
      throw new Ss("PDFXRefStreamParser", "parseIntoContext");
    return this.alreadyParsed = !0, this.context.trailerInfo = {
      Root: this.dict.get(x.of("Root")),
      Encrypt: this.dict.get(x.of("Encrypt")),
      Info: this.dict.get(x.of("Info")),
      ID: this.dict.get(x.of("ID"))
    }, this.parseEntries();
  }
  parseEntries() {
    const e = [], [t, i, n] = this.byteWidths;
    for (let a = 0, s = this.subsections.length; a < s; a++) {
      const { firstObjectNumber: o, length: l } = this.subsections[a];
      for (let c = 0; c < l; c++) {
        let u = 0;
        for (let p = 0, m = t; p < m; p++)
          u = u << 8 | this.bytes.next();
        let f = 0;
        for (let p = 0, m = i; p < m; p++)
          f = f << 8 | this.bytes.next();
        let h = 0;
        for (let p = 0, m = n; p < m; p++)
          h = h << 8 | this.bytes.next();
        t === 0 && (u = 1);
        const d = o + c, b = {
          ref: te.of(d, h),
          offset: f,
          deleted: u === 0,
          inObjectStream: u === 2
        };
        e.push(b);
      }
    }
    return e;
  }
}
Object.defineProperty(xs, "forStream", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => new xs(r)
});
class ra extends si {
  constructor(e, t = 1 / 0, i = !1, n = !1, a) {
    super(kr.of(e), ji.create(), n, a), Object.defineProperty(this, "objectsPerTick", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "throwOnInvalidObject", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "alreadyParsed", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: !1
    }), Object.defineProperty(this, "parsedObjects", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 0
    }), Object.defineProperty(this, "shouldWaitForTick", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: () => (this.parsedObjects += 1, this.parsedObjects % this.objectsPerTick === 0)
    }), this.objectsPerTick = t, this.throwOnInvalidObject = i, this.context.isDecrypted = !!(a != null && a.encryptionKey);
  }
  async parseDocument() {
    if (this.alreadyParsed)
      throw new Ss("PDFParser", "parseDocument");
    this.alreadyParsed = !0, this.context.header = this.parseHeader();
    let e;
    for (; !this.bytes.done(); ) {
      await this.parseDocumentSection();
      const t = this.bytes.offset();
      if (t === e)
        throw new fu(this.bytes.position());
      e = t;
    }
    return this.maybeRecoverRoot(), this.context.lookup(te.of(0)) && (console.warn("Removing parsed object: 0 0 R"), this.context.delete(te.of(0))), this.context;
  }
  maybeRecoverRoot() {
    const e = (i) => i instanceof $ && i.lookup(x.of("Type")) === x.of("Catalog"), t = this.context.lookup(this.context.trailerInfo.Root);
    if (!e(t)) {
      const i = this.context.enumerateIndirectObjects();
      for (let n = 0, a = i.length; n < a; n++) {
        const [s, o] = i[n];
        e(o) && (this.context.trailerInfo.Root = s);
      }
    }
  }
  parseHeader() {
    for (; !this.bytes.done(); ) {
      if (this.matchKeyword(le.header)) {
        const e = this.parseRawInt();
        this.bytes.assertNext(w.Period);
        const t = this.parseRawInt(), i = Vr.forVersion(e, t);
        return this.skipBinaryHeaderComment(), i;
      }
      this.bytes.next();
    }
    throw new bu(this.bytes.position());
  }
  parseIndirectObjectHeader() {
    this.skipWhitespaceAndComments();
    const e = this.parseRawInt();
    this.skipWhitespaceAndComments();
    const t = this.parseRawInt();
    if (this.skipWhitespaceAndComments(), !this.matchKeyword(le.obj))
      throw new xu(this.bytes.position(), le.obj);
    return te.of(e, t);
  }
  matchIndirectObjectHeader() {
    const e = this.bytes.offset();
    try {
      return this.parseIndirectObjectHeader(), !0;
    } catch {
      return this.bytes.moveTo(e), !1;
    }
  }
  async parseIndirectObject() {
    const e = this.parseIndirectObjectHeader();
    this.skipWhitespaceAndComments();
    const t = this.parseObject(e);
    return this.skipWhitespaceAndComments(), this.matchKeyword(le.endobj), t instanceof Et && t.dict.lookup(x.of("Type")) === x.of("ObjStm") ? await bs.forStream(t, this.shouldWaitForTick).parseIntoContext() : t instanceof Et && t.dict.lookup(x.of("Type")) === x.of("XRef") ? xs.forStream(t).parseIntoContext() : this.context.assign(e, t), e;
  }
  // TODO: Improve and clean this up
  tryToParseInvalidIndirectObject() {
    const e = this.bytes.position(), t = `Trying to parse invalid object: ${JSON.stringify(e)})`;
    if (this.throwOnInvalidObject)
      throw new Error(t);
    console.warn(t);
    const i = this.parseIndirectObjectHeader();
    console.warn(`Invalid object ref: ${i}`), this.skipWhitespaceAndComments();
    const n = this.bytes.offset();
    let a = !0;
    for (; !this.bytes.done() && (this.matchKeyword(le.endobj) && (a = !1), !!a); )
      this.bytes.next();
    if (a)
      throw new gu(e);
    const s = this.bytes.offset() - le.endobj.length, o = Yr.of(this.bytes.slice(n, s));
    return this.context.assign(i, o), i;
  }
  async parseIndirectObjects() {
    for (this.skipWhitespaceAndComments(); !this.bytes.done() && je[this.bytes.peek()]; ) {
      const e = this.bytes.offset();
      try {
        await this.parseIndirectObject();
      } catch {
        this.bytes.moveTo(e), this.tryToParseInvalidIndirectObject();
      }
      this.skipWhitespaceAndComments(), this.skipJibberish(), this.shouldWaitForTick() && await Hr();
    }
  }
  maybeParseCrossRefSection() {
    if (this.skipWhitespaceAndComments(), !this.matchKeyword(le.xref))
      return;
    this.skipWhitespaceAndComments();
    let e = -1;
    const t = Gr.createEmpty();
    for (; !this.bytes.done() && je[this.bytes.peek()]; ) {
      const i = this.parseRawInt();
      this.skipWhitespaceAndComments();
      const n = this.parseRawInt();
      this.skipWhitespaceAndComments();
      const a = this.bytes.peek();
      if (a === w.n || a === w.f) {
        const s = te.of(e, n);
        this.bytes.next() === w.n ? t.addEntry(s, i) : t.addDeletedEntry(s, i), e += 1;
      } else
        e = i;
      this.skipWhitespaceAndComments();
    }
    return t;
  }
  maybeParseTrailerDict() {
    if (this.skipWhitespaceAndComments(), !this.matchKeyword(le.trailer))
      return;
    this.skipWhitespaceAndComments();
    const e = this.parseDict(), { context: t } = this;
    t.trailerInfo = {
      Root: e.get(x.of("Root")) || t.trailerInfo.Root,
      Encrypt: e.get(x.of("Encrypt")) || t.trailerInfo.Encrypt,
      Info: e.get(x.of("Info")) || t.trailerInfo.Info,
      ID: e.get(x.of("ID")) || t.trailerInfo.ID
    };
  }
  maybeParseTrailer() {
    if (this.skipWhitespaceAndComments(), !this.matchKeyword(le.startxref))
      return;
    this.skipWhitespaceAndComments();
    const e = this.parseRawInt();
    return this.skipWhitespace(), this.matchKeyword(le.eof), this.skipWhitespaceAndComments(), this.matchKeyword(le.eof), this.skipWhitespaceAndComments(), Ii.forLastCrossRefSectionOffset(e);
  }
  async parseDocumentSection() {
    await this.parseIndirectObjects(), this.maybeParseCrossRefSection(), this.maybeParseTrailerDict(), this.maybeParseTrailer(), this.skipJibberish();
  }
  /**
   * This operation is not necessary for valid PDF files. But some invalid PDFs
   * contain jibberish in between indirect objects. This method is designed to
   * skip past that jibberish, should it exist, until it reaches the next
   * indirect object header, an xref table section, or the file trailer.
   */
  skipJibberish() {
    for (this.skipWhitespaceAndComments(); !this.bytes.done(); ) {
      const e = this.bytes.offset(), t = this.bytes.peek();
      if (t >= w.Space && t <= w.Tilde && (this.matchKeyword(le.xref) || this.matchKeyword(le.trailer) || this.matchKeyword(le.startxref) || this.matchIndirectObjectHeader())) {
        this.bytes.moveTo(e);
        break;
      }
      this.bytes.next();
    }
  }
  /**
   * Skips the binary comment following a PDF header. The specification
   * defines this binary comment (section 7.5.2 File Header) as a sequence of 4
   * or more bytes that are 128 or greater, and which are preceded by a "%".
   *
   * This would imply that to strip out this binary comment, we could check for
   * a sequence of bytes starting with "%", and remove all subsequent bytes that
   * are 128 or greater. This works for many documents that properly comply with
   * the spec. But in the wild, there are PDFs that omit the leading "%", and
   * include bytes that are less than 128 (e.g. 0 or 1). So in order to parse
   * these headers correctly, we just throw out all bytes leading up to the
   * first indirect object header.
   */
  skipBinaryHeaderComment() {
    this.skipWhitespaceAndComments();
    try {
      const e = this.bytes.offset();
      this.parseIndirectObjectHeader(), this.bytes.moveTo(e);
    } catch {
      this.bytes.next(), this.skipWhitespaceAndComments();
    }
  }
}
Object.defineProperty(ra, "forBytesWithOptions", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e, t, i, n) => new ra(r, e, t, i, n)
});
const wt = (r) => 1 << r;
var Ri;
(function(r) {
  r[r.Invisible = wt(0)] = "Invisible", r[r.Hidden = wt(1)] = "Hidden", r[r.Print = wt(2)] = "Print", r[r.NoZoom = wt(3)] = "NoZoom", r[r.NoRotate = wt(4)] = "NoRotate", r[r.NoView = wt(5)] = "NoView", r[r.ReadOnly = wt(6)] = "ReadOnly", r[r.Locked = wt(7)] = "Locked", r[r.ToggleNoView = wt(8)] = "ToggleNoView", r[r.LockedContents = wt(9)] = "LockedContents";
})(Ri || (Ri = {}));
let M = 0, U = 0, Q = 0, ee = 0, xn = 0, gn = 0;
const L0 = /* @__PURE__ */ new Map([
  ["A", 7],
  ["a", 7],
  ["C", 6],
  ["c", 6],
  ["H", 1],
  ["h", 1],
  ["L", 2],
  ["l", 2],
  ["M", 2],
  ["m", 2],
  ["Q", 4],
  ["q", 4],
  ["S", 4],
  ["s", 4],
  ["T", 2],
  ["t", 2],
  ["V", 1],
  ["v", 1],
  ["Z", 0],
  ["z", 0]
]), mm = (r) => {
  let e;
  const t = [];
  let i = [], n = "", a = !1, s = 0;
  for (const o of r)
    if (L0.has(o))
      s = L0.get(o), e && (n.length > 0 && (i[i.length] = +n), t[t.length] = { cmd: e, args: i }, i = [], n = "", a = !1), e = o;
    else if ([" ", ","].includes(o) || o === "-" && n.length > 0 && n[n.length - 1] !== "e" || o === "." && a) {
      if (n.length === 0)
        continue;
      i.length === s ? (t[t.length] = { cmd: e, args: i }, i = [+n], e === "M" && (e = "L"), e === "m" && (e = "l")) : i[i.length] = +n, a = o === ".", n = ["-", "."].includes(o) ? o : "";
    } else
      n += o, o === "." && (a = !0);
  return n.length > 0 && (i.length === s ? (t[t.length] = { cmd: e, args: i }, i = [+n], e === "M" && (e = "L"), e === "m" && (e = "l")) : i[i.length] = +n), t[t.length] = { cmd: e, args: i }, t;
}, wm = (r) => {
  M = U = Q = ee = xn = gn = 0;
  let e = [];
  for (let t = 0; t < r.length; t++) {
    const i = r[t];
    if (i.cmd && typeof M0[i.cmd] == "function") {
      const n = M0[i.cmd](i.args);
      Array.isArray(n) ? e = e.concat(n) : e.push(n);
    }
  }
  return e;
}, M0 = {
  M(r) {
    return M = r[0], U = r[1], Q = ee = null, xn = M, gn = U, Qe(M, U);
  },
  m(r) {
    return M += r[0], U += r[1], Q = ee = null, xn = M, gn = U, Qe(M, U);
  },
  C(r) {
    return M = r[4], U = r[5], Q = r[2], ee = r[3], Oe(r[0], r[1], r[2], r[3], r[4], r[5]);
  },
  c(r) {
    const e = Oe(r[0] + M, r[1] + U, r[2] + M, r[3] + U, r[4] + M, r[5] + U);
    return Q = M + r[2], ee = U + r[3], M += r[4], U += r[5], e;
  },
  S(r) {
    (Q === null || ee === null) && (Q = M, ee = U);
    const e = Oe(M - (Q - M), U - (ee - U), r[0], r[1], r[2], r[3]);
    return Q = r[0], ee = r[1], M = r[2], U = r[3], e;
  },
  s(r) {
    (Q === null || ee === null) && (Q = M, ee = U);
    const e = Oe(M - (Q - M), U - (ee - U), M + r[0], U + r[1], M + r[2], U + r[3]);
    return Q = M + r[0], ee = U + r[1], M += r[2], U += r[3], e;
  },
  Q(r) {
    return Q = r[0], ee = r[1], M = r[2], U = r[3], ln(r[0], r[1], M, U);
  },
  q(r) {
    const e = ln(r[0] + M, r[1] + U, r[2] + M, r[3] + U);
    return Q = M + r[0], ee = U + r[1], M += r[2], U += r[3], e;
  },
  T(r) {
    Q === null || ee === null ? (Q = M, ee = U) : (Q = M - (Q - M), ee = U - (ee - U));
    const e = ln(Q, ee, r[0], r[1]);
    return M = r[0], U = r[1], e;
  },
  t(r) {
    Q === null || ee === null ? (Q = M, ee = U) : (Q = M - (Q - M), ee = U - (ee - U));
    const e = ln(Q, ee, M + r[0], U + r[1]);
    return M += r[0], U += r[1], e;
  },
  A(r) {
    const e = U0(M, U, r);
    return M = r[5], U = r[6], e;
  },
  a(r) {
    r[5] += M, r[6] += U;
    const e = U0(M, U, r);
    return M = r[5], U = r[6], e;
  },
  L(r) {
    return M = r[0], U = r[1], Q = ee = null, he(M, U);
  },
  l(r) {
    return M += r[0], U += r[1], Q = ee = null, he(M, U);
  },
  H(r) {
    return M = r[0], Q = ee = null, he(M, U);
  },
  h(r) {
    return M += r[0], Q = ee = null, he(M, U);
  },
  V(r) {
    return U = r[0], Q = ee = null, he(M, U);
  },
  v(r) {
    return U += r[0], Q = ee = null, he(M, U);
  },
  Z() {
    const r = dt();
    return M = xn, U = gn, r;
  },
  z() {
    const r = dt();
    return M = xn, U = gn, r;
  }
}, U0 = (r, e, t) => {
  const [i, n, a, s, o, l, c] = t, u = ym(l, c, i, n, s, o, a, r, e), f = [];
  for (const h of u) {
    const d = vm(...h);
    f.push(Oe(...d));
  }
  return f;
}, ym = (r, e, t, i, n, a, s, o, l) => {
  const c = s * (Math.PI / 180), u = Math.sin(c), f = Math.cos(c);
  t = Math.abs(t), i = Math.abs(i), Q = f * (o - r) * 0.5 + u * (l - e) * 0.5, ee = f * (l - e) * 0.5 - u * (o - r) * 0.5;
  let h = Q * Q / (t * t) + ee * ee / (i * i);
  h > 1 && (h = Math.sqrt(h), t *= h, i *= h);
  const d = f / t, b = u / t, p = -u / i, m = f / i, g = d * o + b * l, S = p * o + m * l, y = d * r + b * e, v = p * r + m * e;
  let k = 1 / ((y - g) * (y - g) + (v - S) * (v - S)) - 0.25;
  k < 0 && (k = 0);
  let _ = Math.sqrt(k);
  a === n && (_ = -_);
  const C = 0.5 * (g + y) - _ * (v - S), P = 0.5 * (S + v) + _ * (y - g), D = Math.atan2(S - P, g - C);
  let j = Math.atan2(v - P, y - C) - D;
  j < 0 && a === 1 ? j += 2 * Math.PI : j > 0 && a === 0 && (j -= 2 * Math.PI);
  const B = Math.ceil(Math.abs(j / (Math.PI * 0.5 + 1e-3))), W = [];
  for (let I = 0; I < B; I++) {
    const N = D + I * j / B, L = D + (I + 1) * j / B;
    W[I] = [C, P, N, L, t, i, u, f];
  }
  return W;
}, vm = (r, e, t, i, n, a, s, o) => {
  const l = o * n, c = -s * a, u = s * n, f = o * a, h = 0.5 * (i - t), d = 8 / 3 * Math.sin(h * 0.5) * Math.sin(h * 0.5) / Math.sin(h), b = r + Math.cos(t) - d * Math.sin(t), p = e + Math.sin(t) + d * Math.cos(t), m = r + Math.cos(i), g = e + Math.sin(i), S = m + d * Math.sin(i), y = g - d * Math.cos(i);
  return [
    l * b + c * p,
    u * b + f * p,
    l * S + c * y,
    u * S + f * y,
    l * m + c * g,
    u * m + f * g
  ];
}, _m = (r) => wm(mm(r)), km = ({ topLeft: r, topRight: e, bottomRight: t, bottomLeft: i }) => [
  Qe(r.x, r.y),
  he(e.x, e.y),
  he(t.x, t.y),
  he(i.x, i.y),
  dt(),
  Rs(),
  Bs()
], en = (r) => r.flatMap(km), Sm = (r, e) => [
  ye(),
  e.graphicsState && Xt(e.graphicsState),
  Ps(),
  Yt(e.color),
  fa(e.font, e.size),
  Ds(we(e.rotate), we(e.xSkew), we(e.ySkew), e.x, e.y),
  Es(r),
  Ts(),
  ve()
].filter(Boolean), lh = (r, e) => {
  const t = [
    ye(),
    e.graphicsState && Xt(e.graphicsState),
    ...e.clipSpaces ? en(e.clipSpaces) : [],
    e.matrix && ci(...e.matrix),
    Ps(),
    Yt(e.color),
    fa(e.font, e.size),
    pu(e.lineHeight),
    Ds(we(e.rotate), we(e.xSkew), we(e.ySkew), e.x, e.y)
  ].filter(Boolean);
  for (let i = 0, n = r.length; i < n; i++)
    t.push(Es(r[i]), mu());
  return t.push(Ts(), ve()), t;
}, $c = (r, e) => [
  ye(),
  e.graphicsState && Xt(e.graphicsState),
  ...e.clipSpaces ? en(e.clipSpaces) : [],
  e.matrix && ci(...e.matrix),
  Xe(e.x, e.y),
  $i(we(e.rotate)),
  ua(e.width, e.height),
  As(we(e.xSkew), we(e.ySkew)),
  Cs(r),
  ve()
].filter(Boolean), uh = (r, e) => [
  ye(),
  e.graphicsState && Xt(e.graphicsState),
  Xe(e.x, e.y),
  $i(we(e.rotate)),
  ua(e.xScale, e.yScale),
  As(we(e.xSkew), we(e.ySkew)),
  Cs(r),
  ve()
].filter(Boolean), dh = (r) => [
  ye(),
  r.graphicsState && Xt(r.graphicsState),
  ...r.clipSpaces ? en(r.clipSpaces) : [],
  r.matrix && ci(...r.matrix),
  r.color && Wi(r.color),
  Hi(r.thickness),
  ha(r.dashArray ?? [], r.dashPhase ?? 0),
  Qe(r.start.x, r.start.y),
  r.lineCap && da(r.lineCap),
  Qe(r.start.x, r.start.y),
  he(r.end.x, r.end.y),
  qi(),
  ve()
].filter(Boolean), oi = (r) => {
  let e = [];
  if (!r.radius || J(r.radius) <= 0)
    e = [
      Qe(0, 0),
      he(0, r.height),
      he(r.width, r.height),
      he(r.width, 0),
      dt()
    ];
  else {
    let t = J(r.radius);
    const i = J(r.width), n = J(r.height);
    (t > i / 2 || t > n / 2) && (t = Math.min(i / 2, n / 2));
    const a = ia * t;
    e = [
      Qe(0, t),
      Oe(0, t - a, t - a, 0, t, 0),
      he(i - t, 0),
      Oe(i - t + a, 0, i, t - a, i, t),
      he(i, n - t),
      Oe(i, n - t + a, i - t + a, n, i - t, n),
      he(t, n),
      Oe(t - a, n, 0, n - t + a, 0, n - t),
      dt()
    ];
  }
  return [
    ye(),
    r.graphicsState && Xt(r.graphicsState),
    r.color && Yt(r.color),
    r.borderColor && Wi(r.borderColor),
    Hi(r.borderWidth),
    r.borderLineCap && da(r.borderLineCap),
    ha(r.borderDashArray ?? [], r.borderDashPhase ?? 0),
    ...r.clipSpaces ? en(r.clipSpaces) : [],
    r.matrix && ci(...r.matrix),
    Xe(r.x, r.y),
    $i(we(r.rotate)),
    As(we(r.xSkew), we(r.ySkew)),
    ...e,
    // prettier-ignore
    r.color && r.borderWidth ? Fs() : r.color ? Os() : r.borderColor ? qi() : dt(),
    ve()
  ].filter(Boolean);
}, ia = 4 * ((Math.sqrt(2) - 1) / 3), hh = (r) => {
  let e = J(r.x), t = J(r.y);
  const i = J(r.xScale), n = J(r.yScale);
  e -= i, t -= n;
  const a = i * ia, s = n * ia, o = e + i * 2, l = t + n * 2, c = e + i, u = t + n;
  return [
    ye(),
    Qe(e, u),
    Oe(e, u - s, c - a, t, c, t),
    Oe(c + a, t, o, u - s, o, u),
    Oe(o, u + s, c + a, l, c, l),
    Oe(c - a, l, e, u + s, e, u),
    ve()
  ];
}, Am = (r) => {
  const e = J(r.x), t = J(r.y), i = J(r.xScale), n = J(r.yScale), a = -i, s = -n, o = i * ia, l = n * ia, c = a + i * 2, u = s + n * 2, f = a + i, h = s + n;
  return [
    Xe(e, t),
    $i(we(r.rotate)),
    Qe(a, h),
    Oe(a, h - l, f - o, s, f, s),
    Oe(f + o, s, c, h - l, c, h),
    Oe(c, h + l, f + o, u, f, u),
    Oe(f - o, u, a, h + l, a, h)
  ];
}, gs = (r) => [
  ye(),
  r.graphicsState && Xt(r.graphicsState),
  r.color && Yt(r.color),
  r.borderColor && Wi(r.borderColor),
  ...r.clipSpaces ? en(r.clipSpaces) : [],
  r.matrix && ci(...r.matrix),
  Hi(r.borderWidth),
  r.borderLineCap && da(r.borderLineCap),
  ha(r.borderDashArray ?? [], r.borderDashPhase ?? 0),
  // The `drawEllipsePath` branch is only here for backwards compatibility.
  // See https://github.com/Hopding/pdf-lib/pull/511#issuecomment-667685655.
  ...r.rotate === void 0 ? hh({
    x: r.x,
    y: r.y,
    xScale: r.xScale,
    yScale: r.yScale
  }) : Am({
    x: r.x,
    y: r.y,
    xScale: r.xScale,
    yScale: r.yScale,
    rotate: r.rotate ?? H(0)
  }),
  // prettier-ignore
  r.color && r.borderWidth ? Fs() : r.color ? Os() : r.borderColor ? qi() : dt(),
  ve()
].filter(Boolean), fh = (r, e) => [
  ye(),
  e.graphicsState && Xt(e.graphicsState),
  ...e.clipSpaces ? en(e.clipSpaces) : [],
  e.matrix && ci(...e.matrix),
  Xe(e.x, e.y),
  $i(we(e.rotate ?? H(0))),
  e.scale && ua(e.scale, e.scale),
  e.color && Yt(e.color),
  e.borderColor && Wi(e.borderColor),
  e.borderWidth && Hi(e.borderWidth),
  e.borderLineCap && da(e.borderLineCap),
  ha(e.borderDashArray ?? [], e.borderDashPhase ?? 0),
  ..._m(r),
  // prettier-ignore
  e.color && e.borderWidth ? Fs() : e.color ? e.fillRule === zn.EvenOdd ? wu() : Os() : e.borderColor ? qi() : dt(),
  ve()
].filter(Boolean), bh = (r) => {
  const e = J(r.size), t = -1 + 0.75, i = -1 + 0.51, n = 1 - 0.525, a = 1 - 0.31, s = -1 + 0.325, o = 0.3995 / (n - i) + i;
  return [
    ye(),
    r.color && Wi(r.color),
    Hi(r.thickness),
    Xe(r.x, r.y),
    Qe(s * e, o * e),
    he(t * e, i * e),
    he(a * e, n * e),
    qi(),
    ve()
  ].filter(Boolean);
}, Qt = (r) => r.rotation === 0 ? [
  Xe(0, 0),
  un(0)
] : r.rotation === 90 ? [
  Xe(r.width, 0),
  un(90)
] : r.rotation === 180 ? [
  Xe(r.width, r.height),
  un(180)
] : r.rotation === 270 ? [
  Xe(0, r.height),
  un(270)
] : [], pn = (r) => {
  const e = oi({
    x: r.x,
    y: r.y,
    width: r.width,
    height: r.height,
    borderWidth: r.borderWidth,
    color: r.color,
    borderColor: r.borderColor,
    rotate: H(0),
    xSkew: H(0),
    ySkew: H(0)
  });
  if (!r.filled)
    return e;
  const t = J(r.width), i = J(r.height), n = Math.min(t, i) / 2, a = bh({
    x: t / 2,
    y: i / 2,
    size: n,
    thickness: r.thickness,
    color: r.markColor
  });
  return [ye(), ...e, ...a, ve()];
}, mn = (r) => {
  const e = J(r.width), t = J(r.height), i = Math.min(e, t) / 2, n = gs({
    x: r.x,
    y: r.y,
    xScale: i,
    yScale: i,
    color: r.color,
    borderColor: r.borderColor,
    borderWidth: r.borderWidth
  });
  if (!r.filled)
    return n;
  const a = gs({
    x: r.x,
    y: r.y,
    xScale: i * 0.45,
    yScale: i * 0.45,
    color: r.dotColor,
    borderColor: void 0,
    borderWidth: 0
  });
  return [ye(), ...n, ...a, ve()];
}, rc = (r) => {
  const e = J(r.x), t = J(r.y), i = J(r.width), n = J(r.height), a = oi({
    x: e,
    y: t,
    width: i,
    height: n,
    borderWidth: r.borderWidth,
    color: r.color,
    borderColor: r.borderColor,
    rotate: H(0),
    xSkew: H(0),
    ySkew: H(0)
  }), s = Vs(r.textLines, {
    color: r.textColor,
    font: r.font,
    size: r.fontSize,
    rotate: H(0),
    xSkew: H(0),
    ySkew: H(0)
  });
  return [ye(), ...a, ...s, ve()];
}, Vs = (r, e) => {
  const t = [
    Ps(),
    Yt(e.color),
    fa(e.font, e.size)
  ];
  for (let i = 0, n = r.length; i < n; i++) {
    const { encoded: a, x: s, y: o } = r[i];
    t.push(Ds(we(e.rotate), we(e.xSkew), we(e.ySkew), s, o), Es(a));
  }
  return t.push(Ts()), t;
}, Wc = (r) => {
  const e = J(r.x), t = J(r.y), i = J(r.width), n = J(r.height), a = J(r.borderWidth), s = J(r.padding), o = e + a / 2 + s, l = t + a / 2 + s, c = i - (a / 2 + s) * 2, u = n - (a / 2 + s) * 2, f = [
    Qe(o, l),
    he(o, l + u),
    he(o + c, l + u),
    he(o + c, l),
    dt(),
    Rs(),
    Bs()
  ], h = oi({
    x: e,
    y: t,
    width: i,
    height: n,
    borderWidth: r.borderWidth,
    color: r.color,
    borderColor: r.borderColor,
    rotate: H(0),
    xSkew: H(0),
    ySkew: H(0)
  }), d = Vs(r.textLines, {
    color: r.textColor,
    font: r.font,
    size: r.fontSize,
    rotate: H(0),
    xSkew: H(0),
    ySkew: H(0)
  }), b = [
    uc("Tx"),
    ye(),
    ...d,
    ve(),
    dc()
  ];
  return [
    ye(),
    ...h,
    ...f,
    ...b,
    ve()
  ];
}, xh = (r) => {
  const e = J(r.x), t = J(r.y), i = J(r.width), n = J(r.height), a = J(r.lineHeight), s = J(r.borderWidth), o = J(r.padding), l = e + s / 2 + o, c = t + s / 2 + o, u = i - (s / 2 + o) * 2, f = n - (s / 2 + o) * 2, h = [
    Qe(l, c),
    he(l, c + f),
    he(l + u, c + f),
    he(l + u, c),
    dt(),
    Rs(),
    Bs()
  ], d = oi({
    x: e,
    y: t,
    width: i,
    height: n,
    borderWidth: r.borderWidth,
    color: r.color,
    borderColor: r.borderColor,
    rotate: H(0),
    xSkew: H(0),
    ySkew: H(0)
  }), b = [];
  for (let g = 0, S = r.selectedLines.length; g < S; g++) {
    const y = r.textLines[r.selectedLines[g]];
    b.push(...oi({
      x: y.x - o,
      y: y.y - (a - y.height) / 2,
      width: i - s,
      height: y.height + (a - y.height) / 2,
      borderWidth: 0,
      color: r.selectedColor,
      borderColor: void 0,
      rotate: H(0),
      xSkew: H(0),
      ySkew: H(0)
    }));
  }
  const p = Vs(r.textLines, {
    color: r.textColor,
    font: r.font,
    size: r.fontSize,
    rotate: H(0),
    xSkew: H(0),
    ySkew: H(0)
  }), m = [
    uc("Tx"),
    ye(),
    ...p,
    ve(),
    dc()
  ];
  return [
    ye(),
    ...d,
    ...b,
    ...h,
    ...m,
    ve()
  ];
};
class gh extends Error {
  constructor() {
    super("Input document to `PDFDocument.load` is encrypted. You can use `PDFDocument.load(..., { ignoreEncryption: true })` if you wish to load the document anyways.");
  }
}
class ph extends Error {
  constructor() {
    super("Input to `PDFDocument.embedFont` was a custom font, but no `fontkit` instance was found. You must register a `fontkit` instance with `PDFDocument.registerFontkit(...)` before embedding custom fonts.");
  }
}
class mh extends Error {
  constructor() {
    super("A `page` passed to `PDFDocument.addPage` or `PDFDocument.insertPage` was from a different (foreign) PDF document. If you want to copy pages from one PDFDocument to another, you must use `PDFDocument.copyPages(...)` to copy the pages before adding or inserting them.");
  }
}
class wh extends Error {
  constructor() {
    super("PDFDocument has no pages so `PDFDocument.removePage` cannot be called");
  }
}
class yh extends Error {
  constructor(e) {
    const t = `PDFDocument has no form field with the name "${e}"`;
    super(t);
  }
}
class ar extends Error {
  constructor(e, t, i) {
    var o;
    const n = t == null ? void 0 : t.name, a = ((o = i == null ? void 0 : i.constructor) == null ? void 0 : o.name) ?? i, s = `Expected field "${e}" to be of type ${n}, but it is actually of type ${a}`;
    super(s);
  }
}
class Cm extends Error {
  constructor(e) {
    const t = `Failed to select check box due to missing onValue: "${e}"`;
    super(t);
  }
}
class Hc extends Error {
  constructor(e) {
    const t = `A field already exists with the specified name: "${e}"`;
    super(t);
  }
}
class vh extends Error {
  constructor(e) {
    const t = `Field name contains invalid component: "${e}"`;
    super(t);
  }
}
class Fm extends Error {
  constructor(e) {
    const t = `A non-terminal field already exists with the specified name: "${e}"`;
    super(t);
  }
}
class _h extends Error {
  constructor(e) {
    const t = `Reading rich text fields is not supported: Attempted to read rich text field: ${e}`;
    super(t);
  }
}
class kh extends Error {
  constructor(e, t) {
    const i = `Failed to layout combed text as lineLength=${e} is greater than cellCount=${t}`;
    super(i);
  }
}
class Sh extends Error {
  constructor(e, t, i) {
    const n = `Attempted to set text with length=${e} for TextField with maxLength=${t} and name=${i}`;
    super(n);
  }
}
class Ah extends Error {
  constructor(e, t, i) {
    const n = `Attempted to set maxLength=${t}, which is less than ${e}, the length of this field's current value (name=${i})`;
    super(n);
  }
}
var ke;
(function(r) {
  r[r.Left = 0] = "Left", r[r.Center = 1] = "Center", r[r.Right = 2] = "Right";
})(ke || (ke = {}));
const Ch = 4, Fh = 500, Oh = (r, e, t, i = !1) => {
  let n = Ch;
  for (; n < Fh; ) {
    let a = 0;
    for (let c = 0, u = r.length; c < u; c++) {
      a += 1;
      const h = r[c].split(" ");
      let d = t.width;
      for (let b = 0, p = h.length; b < p; b++) {
        const g = b === p - 1 ? h[b] : h[b] + " ", S = e.widthOfTextAtSize(g, n);
        d -= S, d <= 0 && (a += 1, d = t.width - S);
      }
    }
    if (!i && a > r.length)
      return n - 1;
    const s = e.heightAtSize(n);
    if ((s + s * 0.2) * a > Math.abs(t.height))
      return n - 1;
    n += 1;
  }
  return n;
}, Om = (r, e, t, i) => {
  const n = t.width / i, a = t.height;
  let s = Ch;
  const o = vu(r);
  for (; s < Fh; ) {
    for (let c = 0, u = o.length; c < u; c++) {
      const f = o[c];
      if (e.widthOfTextAtSize(f, s) > n * 0.75)
        return s - 1;
    }
    if (e.heightAtSize(s, { descender: !1 }) > a)
      return s - 1;
    s += 1;
  }
  return s;
}, Pm = (r) => {
  for (let e = r.length; e > 0; e--)
    if (/\s/.test(r[e]))
      return e;
}, Dm = (r, e, t, i) => {
  let n = r.length;
  for (; n > 0; ) {
    const a = r.substring(0, n), s = t.encodeText(a), o = t.widthOfTextAtSize(a, i);
    if (o < e) {
      const l = r.substring(n) || void 0;
      return { line: a, encoded: s, width: o, remainder: l };
    }
    n = Pm(a) ?? 0;
  }
  return {
    line: r,
    encoded: t.encodeText(r),
    width: t.widthOfTextAtSize(r, i),
    remainder: void 0
  };
}, qc = (r, { alignment: e, fontSize: t, font: i, bounds: n }) => {
  const a = fc(ba(r));
  (t === void 0 || t === 0) && (t = Oh(a, i, n, !0));
  const s = i.heightAtSize(t), o = s + s * 0.2, l = [];
  let c = n.x, u = n.y, f = n.x + n.width, h = n.y + n.height, d = n.y + n.height;
  for (let b = 0, p = a.length; b < p; b++) {
    let m = a[b];
    for (; m !== void 0; ) {
      const { line: g, encoded: S, width: y, remainder: v } = Dm(m, n.width, i, t), A = e === ke.Left ? n.x : e === ke.Center ? n.x + n.width / 2 - y / 2 : e === ke.Right ? n.x + n.width - y : n.x;
      d -= o, A < c && (c = A), d < u && (u = d), A + y > f && (f = A + y), d + s > h && (h = d + s), l.push({ text: g, encoded: S, width: y, height: s, x: A, y: d }), m = v == null ? void 0 : v.trim();
    }
  }
  return {
    fontSize: t,
    lineHeight: o,
    lines: l,
    bounds: {
      x: c,
      y: u,
      width: f - c,
      height: h - u
    }
  };
}, Ph = (r, { fontSize: e, font: t, bounds: i, cellCount: n }) => {
  const a = hc(ba(r));
  if (a.length > n)
    throw new kh(a.length, n);
  (e === void 0 || e === 0) && (e = Om(a, t, i, n));
  const s = i.width / n, o = t.heightAtSize(e, { descender: !1 }), l = i.y + (i.height / 2 - o / 2), c = [];
  let u = i.x, f = i.y, h = i.x + i.width, d = i.y + i.height, b = 0, p = 0;
  for (; b < n; ) {
    const [m, g] = yu(a, p), S = t.encodeText(m), y = t.widthOfTextAtSize(m, e), A = i.x + (s * b + s / 2) - y / 2;
    A < u && (u = A), l < f && (f = l), A + y > h && (h = A + y), l + o > d && (d = l + o), c.push({ text: a, encoded: S, width: y, height: o, x: A, y: l }), b += 1, p += g;
  }
  return {
    fontSize: e,
    cells: c,
    bounds: {
      x: u,
      y: f,
      width: h - u,
      height: d - f
    }
  };
}, na = (r, { alignment: e, fontSize: t, font: i, bounds: n }) => {
  const a = hc(ba(r));
  (t === void 0 || t === 0) && (t = Oh([a], i, n));
  const s = i.encodeText(a), o = i.widthOfTextAtSize(a, t), l = i.heightAtSize(t, { descender: !1 }), c = e === ke.Left ? n.x : e === ke.Center ? n.x + n.width / 2 - o / 2 : e === ke.Right ? n.x + n.width - o : n.x, u = n.y + (n.height / 2 - l / 2);
  return {
    fontSize: t,
    line: { text: a, encoded: s, width: o, height: l, x: c, y: u },
    bounds: { x: c, y: u, width: o, height: l }
  };
}, hi = (r) => "normal" in r ? r : { normal: r }, Em = /\/([^\s]+)\s+(\d+(?:\.\d+)?)\s+Tf/, Sr = (r) => {
  const e = r.getDefaultAppearance() ?? "", t = _s(e, Em).match ?? [], i = Number(t[2]);
  return isFinite(i) ? i : void 0;
}, Tm = /(\d+(?:\.\d+)?)\s*(\d+(?:\.\d+)?)?\s*(\d+(?:\.\d+)?)?\s*(\d+(?:\.\d+)?)?\s+(g|rg|k)/, ct = (r) => {
  const e = r.getDefaultAppearance() ?? "", t = _s(e, Tm).match, [, i, n, a, s, o] = t ?? [];
  if (o === "g" && i)
    return _u(Number(i));
  if (o === "rg" && i && n && a)
    return se(Number(i), Number(n), Number(a));
  if (o === "k" && i && n && a && s)
    return ku(Number(i), Number(n), Number(a), Number(s));
}, lt = (r, e, t, i = 0) => {
  const n = [
    Yt(e).toString(),
    fa((t == null ? void 0 : t.name) ?? "dummy__noop", i).toString()
  ].join(`
`);
  r.setDefaultAppearance(n);
}, Dh = (r, e) => {
  const t = ct(e), i = ct(r.acroField), n = e.getRectangle(), a = e.getAppearanceCharacteristics(), s = e.getBorderStyle(), o = (s == null ? void 0 : s.getWidth()) ?? 0, l = Ar(a == null ? void 0 : a.getRotation()), { width: c, height: u } = Cr(n, l), f = Qt({ ...n, rotation: l }), h = se(0, 0, 0), d = Ne(a == null ? void 0 : a.getBorderColor()) ?? h, b = Ne(a == null ? void 0 : a.getBackgroundColor()), p = Ne(a == null ? void 0 : a.getBackgroundColor(), 0.8), m = t ?? i ?? h;
  lt(t ? e : r.acroField, m);
  const g = {
    x: 0 + o / 2,
    y: 0 + o / 2,
    width: c - o,
    height: u - o,
    thickness: 1.5,
    borderWidth: o,
    borderColor: d,
    markColor: m
  };
  return {
    normal: {
      on: [
        ...f,
        ...pn({
          ...g,
          color: b,
          filled: !0
        })
      ],
      off: [
        ...f,
        ...pn({
          ...g,
          color: b,
          filled: !1
        })
      ]
    },
    down: {
      on: [
        ...f,
        ...pn({
          ...g,
          color: p,
          filled: !0
        })
      ],
      off: [
        ...f,
        ...pn({
          ...g,
          color: p,
          filled: !1
        })
      ]
    }
  };
}, Eh = (r, e) => {
  const t = ct(e), i = ct(r.acroField), n = e.getRectangle(), a = e.getAppearanceCharacteristics(), s = e.getBorderStyle(), o = (s == null ? void 0 : s.getWidth()) ?? 0, l = Ar(a == null ? void 0 : a.getRotation()), { width: c, height: u } = Cr(n, l), f = Qt({ ...n, rotation: l }), h = se(0, 0, 0), d = Ne(a == null ? void 0 : a.getBorderColor()) ?? h, b = Ne(a == null ? void 0 : a.getBackgroundColor()), p = Ne(a == null ? void 0 : a.getBackgroundColor(), 0.8), m = t ?? i ?? h;
  lt(t ? e : r.acroField, m);
  const g = {
    x: c / 2,
    y: u / 2,
    width: c - o,
    height: u - o,
    borderWidth: o,
    borderColor: d,
    dotColor: m
  };
  return {
    normal: {
      on: [
        ...f,
        ...mn({
          ...g,
          color: b,
          filled: !0
        })
      ],
      off: [
        ...f,
        ...mn({
          ...g,
          color: b,
          filled: !1
        })
      ]
    },
    down: {
      on: [
        ...f,
        ...mn({
          ...g,
          color: p,
          filled: !0
        })
      ],
      off: [
        ...f,
        ...mn({
          ...g,
          color: p,
          filled: !1
        })
      ]
    }
  };
}, Th = (r, e, t) => {
  const i = ct(e), n = ct(r.acroField), a = Sr(e), s = Sr(r.acroField), o = e.getRectangle(), l = e.getAppearanceCharacteristics(), c = e.getBorderStyle(), u = l == null ? void 0 : l.getCaptions(), f = (u == null ? void 0 : u.normal) ?? "", h = (u == null ? void 0 : u.down) ?? f ?? "", d = (c == null ? void 0 : c.getWidth()) ?? 0, b = Ar(l == null ? void 0 : l.getRotation()), { width: p, height: m } = Cr(o, b), g = Qt({ ...o, rotation: b }), S = se(0, 0, 0), y = Ne(l == null ? void 0 : l.getBorderColor()), v = Ne(l == null ? void 0 : l.getBackgroundColor()), A = Ne(l == null ? void 0 : l.getBackgroundColor(), 0.8), k = {
    x: d,
    y: d,
    width: p - d * 2,
    height: m - d * 2
  }, _ = na(f, {
    alignment: ke.Center,
    fontSize: a ?? s,
    font: t,
    bounds: k
  }), C = na(h, {
    alignment: ke.Center,
    fontSize: a ?? s,
    font: t,
    bounds: k
  }), P = Math.min(_.fontSize, C.fontSize), D = i ?? n ?? S;
  lt(i || a !== void 0 ? e : r.acroField, D, t, P);
  const O = {
    x: 0 + d / 2,
    y: 0 + d / 2,
    width: p - d,
    height: m - d,
    borderWidth: d,
    borderColor: y,
    textColor: D,
    font: t.name,
    fontSize: P
  };
  return {
    normal: [
      ...g,
      ...rc({
        ...O,
        color: v,
        textLines: [_.line]
      })
    ],
    down: [
      ...g,
      ...rc({
        ...O,
        color: A,
        textLines: [C.line]
      })
    ]
  };
}, Rh = (r, e, t) => {
  const i = ct(e), n = ct(r.acroField), a = Sr(e), s = Sr(r.acroField), o = e.getRectangle(), l = e.getAppearanceCharacteristics(), c = e.getBorderStyle(), u = r.getText() ?? "", f = (c == null ? void 0 : c.getWidth()) ?? 0, h = Ar(l == null ? void 0 : l.getRotation()), { width: d, height: b } = Cr(o, h), p = Qt({ ...o, rotation: h }), m = se(0, 0, 0), g = Ne(l == null ? void 0 : l.getBorderColor()), S = Ne(l == null ? void 0 : l.getBackgroundColor());
  let y, v;
  const A = r.isCombed() ? 0 : 1, k = {
    x: f + A,
    y: f + A,
    width: d - (f + A) * 2,
    height: b - (f + A) * 2
  };
  if (r.isMultiline()) {
    const P = qc(u, {
      alignment: r.getAlignment(),
      fontSize: a ?? s,
      font: t,
      bounds: k
    });
    y = P.lines, v = P.fontSize;
  } else if (r.isCombed()) {
    const P = Ph(u, {
      fontSize: a ?? s,
      font: t,
      bounds: k,
      cellCount: r.getMaxLength() ?? 0
    });
    y = P.cells, v = P.fontSize;
  } else {
    const P = na(u, {
      alignment: r.getAlignment(),
      fontSize: a ?? s,
      font: t,
      bounds: k
    });
    y = [P.line], v = P.fontSize;
  }
  const _ = i ?? n ?? m;
  lt(i || a !== void 0 ? e : r.acroField, _, t, v);
  const C = {
    x: 0 + f / 2,
    y: 0 + f / 2,
    width: d - f,
    height: b - f,
    borderWidth: f ?? 0,
    borderColor: g,
    textColor: _,
    font: t.name,
    fontSize: v,
    color: S,
    textLines: y,
    padding: A
  };
  return [...p, ...Wc(C)];
}, Bh = (r, e, t) => {
  const i = ct(e), n = ct(r.acroField), a = Sr(e), s = Sr(r.acroField), o = e.getRectangle(), l = e.getAppearanceCharacteristics(), c = e.getBorderStyle(), u = r.getSelected()[0] ?? "", f = (c == null ? void 0 : c.getWidth()) ?? 0, h = Ar(l == null ? void 0 : l.getRotation()), { width: d, height: b } = Cr(o, h), p = Qt({ ...o, rotation: h }), m = se(0, 0, 0), g = Ne(l == null ? void 0 : l.getBorderColor()), S = Ne(l == null ? void 0 : l.getBackgroundColor()), y = 1, v = {
    x: f + y,
    y: f + y,
    width: d - (f + y) * 2,
    height: b - (f + y) * 2
  }, { line: A, fontSize: k } = na(u, {
    alignment: ke.Left,
    fontSize: a ?? s,
    font: t,
    bounds: v
  }), _ = i ?? n ?? m;
  lt(i || a !== void 0 ? e : r.acroField, _, t, k);
  const C = {
    x: 0 + f / 2,
    y: 0 + f / 2,
    width: d - f,
    height: b - f,
    borderWidth: f ?? 0,
    borderColor: g,
    textColor: _,
    font: t.name,
    fontSize: k,
    color: S,
    textLines: [A],
    padding: y
  };
  return [...p, ...Wc(C)];
}, Nh = (r, e, t) => {
  const i = ct(e), n = ct(r.acroField), a = Sr(e), s = Sr(r.acroField), o = e.getRectangle(), l = e.getAppearanceCharacteristics(), c = e.getBorderStyle(), u = (c == null ? void 0 : c.getWidth()) ?? 0, f = Ar(l == null ? void 0 : l.getRotation()), { width: h, height: d } = Cr(o, f), b = Qt({ ...o, rotation: f }), p = se(0, 0, 0), m = Ne(l == null ? void 0 : l.getBorderColor()), g = Ne(l == null ? void 0 : l.getBackgroundColor()), S = r.getOptions(), y = r.getSelected();
  r.isSorted() && S.sort();
  let v = "";
  for (let B = 0, W = S.length; B < W; B++)
    v += S[B], B < W - 1 && (v += `
`);
  const A = 1, k = {
    x: u + A,
    y: u + A,
    width: h - (u + A) * 2,
    height: d - (u + A) * 2
  }, { lines: _, fontSize: C, lineHeight: P } = qc(v, {
    alignment: ke.Left,
    fontSize: a ?? s,
    font: t,
    bounds: k
  }), D = [];
  for (let B = 0, W = _.length; B < W; B++) {
    const I = _[B];
    y.includes(I.text) && D.push(B);
  }
  const O = se(153 / 255, 193 / 255, 218 / 255), j = i ?? n ?? p;
  return lt(i || a !== void 0 ? e : r.acroField, j, t, C), [
    ...b,
    ...xh({
      x: 0 + u / 2,
      y: 0 + u / 2,
      width: h - u,
      height: d - u,
      borderWidth: u ?? 0,
      borderColor: m,
      textColor: j,
      font: t.name,
      fontSize: C,
      color: g,
      textLines: _,
      lineHeight: P,
      selectedColor: O,
      selectedLines: D,
      padding: A
    })
  ];
};
class Pt {
  constructor(e, t, i) {
    Object.defineProperty(this, "ref", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "doc", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "width", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "height", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "alreadyEmbedded", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: !1
    }), Object.defineProperty(this, "embedder", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), F(e, "ref", [[te, "PDFRef"]]), F(t, "doc", [[Se, "PDFDocument"]]), F(i, "embedder", [[Fa, "PDFPageEmbedder"]]), this.ref = e, this.doc = t, this.width = i.width, this.height = i.height, this.embedder = i;
  }
  /**
   * Compute the width and height of this page after being scaled by the
   * given `factor`. For example:
   * ```js
   * embeddedPage.width  // => 500
   * embeddedPage.height // => 250
   *
   * const scaled = embeddedPage.scale(0.5)
   * scaled.width  // => 250
   * scaled.height // => 125
   * ```
   * This operation is often useful before drawing a page with
   * [[PDFPage.drawPage]] to compute the `width` and `height` options.
   * @param factor The factor by which this page should be scaled.
   * @returns The width and height of the page after being scaled.
   */
  scale(e) {
    return F(e, "factor", ["number"]), { width: this.width * e, height: this.height * e };
  }
  /**
   * Get the width and height of this page. For example:
   * ```js
   * const { width, height } = embeddedPage.size()
   * ```
   * @returns The width and height of the page.
   */
  size() {
    return this.scale(1);
  }
  /**
   * > **NOTE:** You probably don't need to call this method directly. The
   * > [[PDFDocument.save]] and [[PDFDocument.saveAsBase64]] methods will
   * > automatically ensure all embeddable pages get embedded.
   *
   * Embed this embeddable page in its document.
   *
   * @returns Resolves when the embedding is complete.
   */
  async embed() {
    this.alreadyEmbedded || (await this.embedder.embedIntoContext(this.doc.context, this.ref), this.alreadyEmbedded = !0);
  }
}
Object.defineProperty(Pt, "of", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e, t) => new Pt(r, e, t)
});
class Ie {
  constructor(e, t, i) {
    Object.defineProperty(this, "ref", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "doc", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "modified", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: !0
    }), Object.defineProperty(this, "embedder", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), F(e, "ref", [[te, "PDFRef"]]), F(t, "doc", [[Se, "PDFDocument"]]), F(i, "embedder", [
      [Gi, "CustomFontEmbedder"],
      [Jr, "StandardFontEmbedder"]
    ]), this.ref = e, this.doc = t, this.name = i.fontName, this.embedder = i;
  }
  /**
   * > **NOTE:** You probably don't need to call this method directly. The
   * > [[PDFPage.drawText]] method will automatically encode the text it is
   * > given.
   *
   * Encodes a string of text in this font.
   *
   * @param text The text to be encoded.
   * @returns The encoded text as a hex string.
   */
  encodeText(e) {
    return F(e, "text", ["string"]), this.modified = !0, this.embedder.encodeText(e);
  }
  /**
   * Measure the width of a string of text drawn in this font at a given size.
   * For example:
   * ```js
   * const width = font.widthOfTextAtSize('Foo Bar Qux Baz', 36)
   * ```
   * @param text The string of text to be measured.
   * @param size The font size to be used for this measurement.
   * @returns The width of the string of text when drawn in this font at the
   *          given size.
   */
  widthOfTextAtSize(e, t) {
    return F(e, "text", ["string"]), F(t, "size", ["number"]), this.embedder.widthOfTextAtSize(e, t);
  }
  /**
   * Measure the height of this font at a given size. For example:
   * ```js
   * const height = font.heightAtSize(24)
   * ```
   *
   * The `options.descender` value controls whether or not the font's
   * descender is included in the height calculation.
   *
   * @param size The font size to be used for this measurement.
   * @param options The options to be used when computing this measurement.
   * @returns The height of this font at the given size.
   */
  heightAtSize(e, t) {
    return F(e, "size", ["number"]), R(t == null ? void 0 : t.descender, "options.descender", ["boolean"]), this.embedder.heightOfFontAtSize(e, {
      descender: (t == null ? void 0 : t.descender) ?? !0
    });
  }
  /**
   * Compute the font size at which this font is a given height. For example:
   * ```js
   * const fontSize = font.sizeAtHeight(12)
   * ```
   * @param height The height to be used for this calculation.
   * @returns The font size at which this font is the given height.
   */
  sizeAtHeight(e) {
    return F(e, "height", ["number"]), this.embedder.sizeOfFontAtHeight(e);
  }
  /**
   * Get the set of unicode code points that can be represented by this font.
   * @returns The set of unicode code points supported by this font.
   */
  getCharacterSet() {
    return this.embedder instanceof Jr ? this.embedder.encoding.supportedCodePoints : this.embedder.font.characterSet;
  }
  /**
   * > **NOTE:** You probably don't need to call this method directly. The
   * > [[PDFDocument.save]] and [[PDFDocument.saveAsBase64]] methods will
   * > automatically ensure all fonts get embedded.
   *
   * Embed this font in its document.
   *
   * @returns Resolves when the embedding is complete.
   */
  async embed() {
    this.modified && (await this.embedder.embedIntoContext(this.doc.context, this.ref), this.modified = !1);
  }
}
Object.defineProperty(Ie, "of", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e, t) => new Ie(r, e, t)
});
class Li {
  constructor(e, t, i) {
    Object.defineProperty(this, "ref", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "doc", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "width", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "height", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "embedder", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "embedTask", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), F(e, "ref", [[te, "PDFRef"]]), F(t, "doc", [[Se, "PDFDocument"]]), F(i, "embedder", [
      [va, "JpegEmbedder"],
      [Ca, "PngEmbedder"]
    ]), this.ref = e, this.doc = t, this.width = i.width, this.height = i.height, this.embedder = i;
  }
  /**
   * Compute the width and height of this image after being scaled by the
   * given `factor`. For example:
   * ```js
   * image.width  // => 500
   * image.height // => 250
   *
   * const scaled = image.scale(0.5)
   * scaled.width  // => 250
   * scaled.height // => 125
   * ```
   * This operation is often useful before drawing an image with
   * [[PDFPage.drawImage]] to compute the `width` and `height` options.
   * @param factor The factor by which this image should be scaled.
   * @returns The width and height of the image after being scaled.
   */
  scale(e) {
    return F(e, "factor", ["number"]), { width: this.width * e, height: this.height * e };
  }
  /**
   * Get the width and height of this image after scaling it as large as
   * possible while maintaining its aspect ratio and not exceeding the
   * specified `width` and `height`. For example:
   * ```
   * image.width  // => 500
   * image.height // => 250
   *
   * const scaled = image.scaleToFit(750, 1000)
   * scaled.width  // => 750
   * scaled.height // => 375
   * ```
   * The `width` and `height` parameters can also be thought of as the width
   * and height of a box that the scaled image must fit within.
   * @param width The bounding box's width.
   * @param height The bounding box's height.
   * @returns The width and height of the image after being scaled.
   */
  scaleToFit(e, t) {
    F(e, "width", ["number"]), F(t, "height", ["number"]);
    const i = e / this.width, n = t / this.height, a = Math.min(i, n);
    return this.scale(a);
  }
  /**
   * Get the width and height of this image. For example:
   * ```js
   * const { width, height } = image.size()
   * ```
   * @returns The width and height of the image.
   */
  size() {
    return this.scale(1);
  }
  /**
   * > **NOTE:** You probably don't need to call this method directly. The
   * > [[PDFDocument.save]] and [[PDFDocument.saveAsBase64]] methods will
   * > automatically ensure all images get embedded.
   *
   * Embed this image in its document.
   *
   * @returns Resolves when the embedding is complete.
   */
  async embed() {
    if (this.embedder) {
      if (!this.embedTask) {
        const { doc: e, ref: t } = this;
        this.embedTask = this.embedder.embedIntoContext(e.context, t);
      }
      await this.embedTask, this.embedder = void 0;
    }
  }
}
Object.defineProperty(Li, "of", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e, t) => new Li(r, e, t)
});
var Mt;
(function(r) {
  r[r.Left = 0] = "Left", r[r.Center = 1] = "Center", r[r.Right = 2] = "Right";
})(Mt || (Mt = {}));
const tn = (r) => {
  R(r == null ? void 0 : r.x, "options.x", ["number"]), R(r == null ? void 0 : r.y, "options.y", ["number"]), R(r == null ? void 0 : r.width, "options.width", ["number"]), R(r == null ? void 0 : r.height, "options.height", ["number"]), R(r == null ? void 0 : r.textColor, "options.textColor", [[Object, "Color"]]), R(r == null ? void 0 : r.backgroundColor, "options.backgroundColor", [[Object, "Color"]]), R(r == null ? void 0 : r.borderColor, "options.borderColor", [[Object, "Color"]]), R(r == null ? void 0 : r.borderWidth, "options.borderWidth", ["number"]), R(r == null ? void 0 : r.rotate, "options.rotate", [[Object, "Rotation"]]);
};
class Fr {
  constructor(e, t, i) {
    Object.defineProperty(this, "acroField", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "ref", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "doc", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), F(e, "acroField", [[Ut, "PDFAcroTerminal"]]), F(t, "ref", [[te, "PDFRef"]]), F(i, "doc", [[Se, "PDFDocument"]]), this.acroField = e, this.ref = t, this.doc = i;
  }
  /**
   * Get the fully qualified name of this field. For example:
   * ```js
   * const fields = form.getFields()
   * fields.forEach(field => {
   *   const name = field.getName()
   *   console.log('Field name:', name)
   * })
   * ```
   * Note that PDF fields are structured as a tree. Each field is the
   * descendent of a series of ancestor nodes all the way up to the form node,
   * which is always the root of the tree. Each node in the tree (except for
   * the form node) has a partial name. Partial names can be composed of any
   * unicode characters except a period (`.`). The fully qualified name of a
   * field is composed of the partial names of all its ancestors joined
   * with periods. This means that splitting the fully qualified name on
   * periods and taking the last element of the resulting array will give you
   * the partial name of a specific field.
   * @returns The fully qualified name of this field.
   */
  getName() {
    return this.acroField.getFullyQualifiedName() ?? "";
  }
  /**
   * Returns `true` if this field is read only. This means that PDF readers
   * will not allow users to interact with the field or change its value. See
   * [[PDFField.enableReadOnly]] and [[PDFField.disableReadOnly]].
   * For example:
   * ```js
   * const field = form.getField('some.field')
   * if (field.isReadOnly()) console.log('Read only is enabled')
   * ```
   * @returns Whether or not this is a read only field.
   */
  isReadOnly() {
    return this.acroField.hasFlag(tt.ReadOnly);
  }
  /**
   * Prevent PDF readers from allowing users to interact with this field or
   * change its value. The field will not respond to mouse or keyboard input.
   * For example:
   * ```js
   * const field = form.getField('some.field')
   * field.enableReadOnly()
   * ```
   * Useful for fields whose values are computed, imported from a database, or
   * prefilled by software before being displayed to the user.
   */
  enableReadOnly() {
    this.acroField.setFlagTo(tt.ReadOnly, !0);
  }
  /**
   * Allow users to interact with this field and change its value in PDF
   * readers via mouse and keyboard input. For example:
   * ```js
   * const field = form.getField('some.field')
   * field.disableReadOnly()
   * ```
   */
  disableReadOnly() {
    this.acroField.setFlagTo(tt.ReadOnly, !1);
  }
  /**
   * Returns `true` if this field must have a value when the form is submitted.
   * See [[PDFField.enableRequired]] and [[PDFField.disableRequired]].
   * For example:
   * ```js
   * const field = form.getField('some.field')
   * if (field.isRequired()) console.log('Field is required')
   * ```
   * @returns Whether or not this field is required.
   */
  isRequired() {
    return this.acroField.hasFlag(tt.Required);
  }
  /**
   * Require this field to have a value when the form is submitted.
   * For example:
   * ```js
   * const field = form.getField('some.field')
   * field.enableRequired()
   * ```
   */
  enableRequired() {
    this.acroField.setFlagTo(tt.Required, !0);
  }
  /**
   * Do not require this field to have a value when the form is submitted.
   * For example:
   * ```js
   * const field = form.getField('some.field')
   * field.disableRequired()
   * ```
   */
  disableRequired() {
    this.acroField.setFlagTo(tt.Required, !1);
  }
  /**
   * Returns `true` if this field's value should be exported when the form is
   * submitted. See [[PDFField.enableExporting]] and
   * [[PDFField.disableExporting]].
   * For example:
   * ```js
   * const field = form.getField('some.field')
   * if (field.isExported()) console.log('Exporting is enabled')
   * ```
   * @returns Whether or not this field's value should be exported.
   */
  isExported() {
    return !this.acroField.hasFlag(tt.NoExport);
  }
  /**
   * Indicate that this field's value should be exported when the form is
   * submitted in a PDF reader. For example:
   * ```js
   * const field = form.getField('some.field')
   * field.enableExporting()
   * ```
   */
  enableExporting() {
    this.acroField.setFlagTo(tt.NoExport, !1);
  }
  /**
   * Indicate that this field's value should **not** be exported when the form
   * is submitted in a PDF reader. For example:
   * ```js
   * const field = form.getField('some.field')
   * field.disableExporting()
   * ```
   */
  disableExporting() {
    this.acroField.setFlagTo(tt.NoExport, !0);
  }
  /** @ignore */
  needsAppearancesUpdate() {
    throw new Lt(this.constructor.name, "needsAppearancesUpdate");
  }
  /** @ignore */
  defaultUpdateAppearances(e) {
    throw new Lt(this.constructor.name, "defaultUpdateAppearances");
  }
  markAsDirty() {
    this.doc.getForm().markFieldAsDirty(this.ref);
  }
  markAsClean() {
    this.doc.getForm().markFieldAsClean(this.ref);
  }
  isDirty() {
    return this.doc.getForm().fieldIsDirty(this.ref);
  }
  createWidget(e) {
    const t = e.textColor, i = e.backgroundColor, n = e.borderColor, a = e.borderWidth, s = bc(e.rotate), o = e.caption, l = e.x, c = e.y, u = e.width + a, f = e.height + a, h = !!e.hidden, d = e.page;
    xc(s, "degreesAngle", 90);
    const b = _r.create(this.doc.context, this.ref), p = Su({ x: l, y: c, width: u, height: f }, a, s);
    b.setRectangle(p), d && b.setP(d);
    const m = b.getOrCreateAppearanceCharacteristics();
    i && m.setBackgroundColor(Ro(i)), m.setRotation(s), o && m.setCaptions({ normal: o }), n && m.setBorderColor(Ro(n));
    const g = b.getOrCreateBorderStyle();
    if (a !== void 0 && g.setWidth(a), b.setFlagTo(Ri.Print, !0), b.setFlagTo(Ri.Hidden, h), b.setFlagTo(Ri.Invisible, !1), t) {
      const y = (this.acroField.getDefaultAppearance() ?? "") + `
` + Yt(t).toString();
      this.acroField.setDefaultAppearance(y);
    }
    return b;
  }
  updateWidgetAppearanceWithFont(e, t, { normal: i, rollover: n, down: a }) {
    this.updateWidgetAppearances(e, {
      normal: this.createAppearanceStream(e, i, t),
      rollover: n && this.createAppearanceStream(e, n, t),
      down: a && this.createAppearanceStream(e, a, t)
    });
  }
  updateOnOffWidgetAppearance(e, t, { normal: i, rollover: n, down: a }) {
    this.updateWidgetAppearances(e, {
      normal: this.createAppearanceDict(e, i, t),
      rollover: n && this.createAppearanceDict(e, n, t),
      down: a && this.createAppearanceDict(e, a, t)
    });
  }
  updateWidgetAppearances(e, { normal: t, rollover: i, down: n }) {
    e.setNormalAppearance(t), i ? e.setRolloverAppearance(i) : e.removeRolloverAppearance(), n ? e.setDownAppearance(n) : e.removeDownAppearance();
  }
  // // TODO: Do we need to do this...?
  // private foo(font: PDFFont, dict: PDFDict) {
  //   if (!dict.lookup(PDFName.of('DR'))) {
  //     dict.set(PDFName.of('DR'), dict.context.obj({}));
  //   }
  //   const DR = dict.lookup(PDFName.of('DR'), PDFDict);
  //   if (!DR.lookup(PDFName.of('Font'))) {
  //     DR.set(PDFName.of('Font'), dict.context.obj({}));
  //   }
  //   const Font = DR.lookup(PDFName.of('Font'), PDFDict);
  //   Font.set(PDFName.of(font.name), font.ref);
  // }
  createAppearanceStream(e, t, i) {
    const { context: n } = this.acroField.dict, { width: a, height: s } = e.getRectangle(), o = i && { Font: { [i.name]: i.ref } }, l = n.formXObject(t, {
      Resources: o,
      BBox: n.obj([0, 0, a, s]),
      Matrix: n.obj([1, 0, 0, 1, 0, 0])
    });
    return n.register(l);
  }
  /**
   * Create a FormXObject of the supplied image and add it to context.
   * The FormXObject size is calculated based on the widget (including
   * the alignment).
   * @param widget The widget that should display the image.
   * @param alignment The alignment of the image.
   * @param image The image that should be displayed.
   * @returns The ref for the FormXObject that was added to the context.
   */
  createImageAppearanceStream(e, t, i) {
    const { context: n } = this.acroField.dict, a = e.getRectangle(), s = e.getAppearanceCharacteristics(), o = e.getBorderStyle(), l = (o == null ? void 0 : o.getWidth()) ?? 0, c = Ar(s == null ? void 0 : s.getRotation()), u = Qt({ ...a, rotation: c }), f = Cr(a, c), h = t.scaleToFit(f.width - l * 2, f.height - l * 2), d = {
      x: l,
      y: l,
      width: h.width,
      height: h.height,
      //
      rotate: H(0),
      xSkew: H(0),
      ySkew: H(0)
    };
    i === Mt.Center ? (d.x += (f.width - l * 2) / 2 - h.width / 2, d.y += (f.height - l * 2) / 2 - h.height / 2) : i === Mt.Right && (d.x = f.width - l - h.width, d.y = f.height - l - h.height);
    const b = this.doc.context.addRandomSuffix("Image", 10), p = [...u, ...$c(b, d)], m = { XObject: { [b]: t.ref } }, g = n.formXObject(p, {
      Resources: m,
      BBox: n.obj([0, 0, a.width, a.height]),
      Matrix: n.obj([1, 0, 0, 1, 0, 0])
    });
    return n.register(g);
  }
  createAppearanceDict(e, t, i) {
    const { context: n } = this.acroField.dict, a = this.createAppearanceStream(e, t.on), s = this.createAppearanceStream(e, t.off), o = n.obj({});
    return o.set(i, a), o.set(x.of("Off"), s), o;
  }
}
class fr extends Fr {
  constructor(e, t, i) {
    super(e, t, i), Object.defineProperty(this, "acroField", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), F(e, "acroCheckBox", [[$t, "PDFAcroCheckBox"]]), this.acroField = e;
  }
  /**
   * Mark this check box. This operation is analogous to a human user clicking
   * a check box to fill it in a PDF reader. This method will update the
   * underlying state of the check box field to indicate it has been selected.
   * PDF libraries and readers will be able to extract this value from the
   * saved document and determine that it was selected.
   *
   * For example:
   * ```js
   * const checkBox = form.getCheckBox('some.checkBox.field')
   * checkBox.check()
   * ```
   *
   * This method will mark this check box as dirty, causing its appearance
   * streams to be updated when either [[PDFDocument.save]] or
   * [[PDFForm.updateFieldAppearances]] is called. The updated appearance
   * streams will display a check mark inside the widgets of this check box
   * field.
   */
  check() {
    const e = this.acroField.getOnValue() ?? x.of("Yes");
    this.markAsDirty(), this.acroField.setValue(e);
  }
  /**
   * Clears this check box. This operation is analogous to a human user clicking
   * a check box to unmark it in a PDF reader. This method will update the
   * underlying state of the check box field to indicate it has been deselected.
   * PDF libraries and readers will be able to extract this value from the
   * saved document and determine that it was not selected.
   *
   * For example:
   * ```js
   * const checkBox = form.getCheckBox('some.checkBox.field')
   * checkBox.uncheck()
   * ```
   *
   * This method will mark this check box as dirty. See [[PDFCheckBox.check]]
   * for more details about what this means.
   */
  uncheck() {
    this.markAsDirty(), this.acroField.setValue(x.of("Off"));
  }
  /**
   * Returns `true` if this check box is selected (either by a human user via
   * a PDF reader, or else programmatically via software). For example:
   * ```js
   * const checkBox = form.getCheckBox('some.checkBox.field')
   * if (checkBox.isChecked()) console.log('check box is selected')
   * ```
   * @returns Whether or not this check box is selected.
   */
  isChecked() {
    const e = this.acroField.getOnValue();
    return !!e && e === this.acroField.getValue();
  }
  /**
   * Show this check box on the specified page. For example:
   * ```js
   * const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
   * const page = pdfDoc.addPage()
   *
   * const form = pdfDoc.getForm()
   * const checkBox = form.createCheckBox('some.checkBox.field')
   *
   * checkBox.addToPage(page, {
   *   x: 50,
   *   y: 75,
   *   width: 25,
   *   height: 25,
   *   textColor: rgb(1, 0, 0),
   *   backgroundColor: rgb(0, 1, 0),
   *   borderColor: rgb(0, 0, 1),
   *   borderWidth: 2,
   *   rotate: degrees(90),
   * })
   * ```
   * This will create a new widget for this check box field.
   * @param page The page to which this check box widget should be added.
   * @param options The options to be used when adding this check box widget.
   */
  addToPage(e, t) {
    F(e, "page", [[Fe, "PDFPage"]]), tn(t), t || (t = {}), "textColor" in t || (t.textColor = se(0, 0, 0)), "backgroundColor" in t || (t.backgroundColor = se(1, 1, 1)), "borderColor" in t || (t.borderColor = se(0, 0, 0)), "borderWidth" in t || (t.borderWidth = 1);
    const i = this.createWidget({
      x: t.x ?? 0,
      y: t.y ?? 0,
      width: t.width ?? 50,
      height: t.height ?? 50,
      textColor: t.textColor,
      backgroundColor: t.backgroundColor,
      borderColor: t.borderColor,
      borderWidth: t.borderWidth ?? 0,
      rotate: t.rotate ?? H(0),
      hidden: t.hidden,
      page: e.ref
    }), n = this.doc.context.register(i.dict);
    this.acroField.addWidget(n), i.setAppearanceState(x.of("Off")), this.updateWidgetAppearance(i, x.of("Yes")), e.node.addAnnot(n);
  }
  /**
   * Returns `true` if any of this check box's widgets do not have an
   * appearance stream for its current state. For example:
   * ```js
   * const checkBox = form.getCheckBox('some.checkBox.field')
   * if (checkBox.needsAppearancesUpdate()) console.log('Needs update')
   * ```
   * @returns Whether or not this check box needs an appearance update.
   */
  needsAppearancesUpdate() {
    var t;
    const e = this.acroField.getWidgets();
    for (let i = 0, n = e.length; i < n; i++) {
      const a = e[i], s = a.getAppearanceState(), o = (t = a.getAppearances()) == null ? void 0 : t.normal;
      if (!(o instanceof $) || s && !o.has(s))
        return !0;
    }
    return !1;
  }
  /**
   * Update the appearance streams for each of this check box's widgets using
   * the default appearance provider for check boxes. For example:
   * ```js
   * const checkBox = form.getCheckBox('some.checkBox.field')
   * checkBox.defaultUpdateAppearances()
   * ```
   */
  defaultUpdateAppearances() {
    this.updateAppearances();
  }
  /**
   * Update the appearance streams for each of this check box's widgets using
   * the given appearance provider. If no `provider` is passed, the default
   * appearance provider for check boxs will be used. For example:
   * ```js
   * const checkBox = form.getCheckBox('some.checkBox.field')
   * checkBox.updateAppearances((field, widget) => {
   *   ...
   *   return {
   *     normal: { on: drawCheckBox(...), off: drawCheckBox(...) },
   *     down: { on: drawCheckBox(...), off: drawCheckBox(...) },
   *   }
   * })
   * ```
   * @param provider Optionally, the appearance provider to be used for
   *                 generating the contents of the appearance streams.
   */
  updateAppearances(e) {
    R(e, "provider", [Function]);
    const t = this.acroField.getWidgets();
    for (let i = 0, n = t.length; i < n; i++) {
      const a = t[i], s = a.getOnValue() ?? x.of("Yes");
      s && this.updateWidgetAppearance(a, s, e);
    }
    this.markAsClean();
  }
  updateWidgetAppearance(e, t, i) {
    const a = hi((i ?? Dh)(this, e));
    this.updateOnOffWidgetAppearance(e, t, a);
  }
}
Object.defineProperty(fr, "of", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e, t) => new fr(r, e, t)
});
class Lr extends Fr {
  constructor(e, t, i) {
    super(e, t, i), Object.defineProperty(this, "acroField", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), F(e, "acroComboBox", [[Wt, "PDFAcroComboBox"]]), this.acroField = e;
  }
  /**
   * Get the list of available options for this dropdown. These options will be
   * displayed to users who click on this dropdown in a PDF reader.
   * For example:
   * ```js
   * const dropdown = form.getDropdown('some.dropdown.field')
   * const options = dropdown.getOptions()
   * console.log('Dropdown options:', options)
   * ```
   * @returns The options for this dropdown.
   */
  getOptions() {
    const e = this.acroField.getOptions(), t = new Array(e.length);
    for (let i = 0, n = t.length; i < n; i++) {
      const { display: a, value: s } = e[i];
      t[i] = (a ?? s).decodeText();
    }
    return t;
  }
  /**
   * Get the selected options for this dropdown. These are the values that were
   * selected by a human user via a PDF reader, or programatically via
   * software.
   * For example:
   * ```js
   * const dropdown = form.getDropdown('some.dropdown.field')
   * const selections = dropdown.getSelected()
   * console.log('Dropdown selections:', selections)
   * ```
   * > **NOTE:** Note that PDF readers only display one selected option when
   * > rendering dropdowns. However, the PDF specification does allow for
   * > multiple values to be selected in a dropdown. As such, the `pdf-lib`
   * > API supports this. However, in most cases the array returned by this
   * > method will contain only a single element (or no elements).
   * @returns The selected options in this dropdown.
   */
  getSelected() {
    const e = this.acroField.getValues(), t = new Array(e.length);
    for (let i = 0, n = e.length; i < n; i++)
      t[i] = e[i].decodeText();
    return t;
  }
  /**
   * Set the list of options that are available for this dropdown. These are
   * the values that will be available for users to select when they view this
   * dropdown in a PDF reader. Note that preexisting options for this dropdown
   * will be removed. Only the values passed as `options` will be available to
   * select.
   * For example:
   * ```js
   * const dropdown = form.getDropdown('planets.dropdown')
   * dropdown.setOptions(['Earth', 'Mars', 'Pluto', 'Venus'])
   * ```
   * @param options The options that should be available in this dropdown.
   */
  setOptions(e) {
    F(e, "options", [Array]);
    const t = new Array(e.length);
    for (let i = 0, n = e.length; i < n; i++)
      t[i] = { value: z.fromText(e[i]) };
    this.acroField.setOptions(t);
  }
  /**
   * Add to the list of options that are available for this dropdown. Users
   * will be able to select these values in a PDF reader. In addition to the
   * values passed as `options`, any preexisting options for this dropdown will
   * still be available for users to select.
   * For example:
   * ```js
   * const dropdown = form.getDropdown('rockets.dropdown')
   * dropdown.addOptions(['Saturn IV', 'Falcon Heavy'])
   * ```
   * @param options New options that should be available in this dropdown.
   */
  addOptions(e) {
    F(e, "options", ["string", Array]);
    const t = Array.isArray(e) ? e : [e], i = this.acroField.getOptions(), n = new Array(t.length);
    for (let a = 0, s = t.length; a < s; a++)
      n[a] = { value: z.fromText(t[a]) };
    this.acroField.setOptions(i.concat(n));
  }
  /**
   * Select one or more values for this dropdown. This operation is analogous
   * to a human user opening the dropdown in a PDF reader and clicking on a
   * value to select it. This method will update the underlying state of the
   * dropdown to indicate which values have been selected. PDF libraries and
   * readers will be able to extract these values from the saved document and
   * determine which values were selected.
   *
   * For example:
   * ```js
   * const dropdown = form.getDropdown('best.superhero.dropdown')
   * dropdown.select('One Punch Man')
   * ```
   *
   * This method will mark this dropdown as dirty, causing its appearance
   * streams to be updated when either [[PDFDocument.save]] or
   * [[PDFForm.updateFieldAppearances]] is called. The updated streams will
   * display the selected option inside the widgets of this dropdown.
   *
   * **IMPORTANT:** The default font used to update appearance streams is
   * [[StandardFonts.Helvetica]]. Note that this is a WinAnsi font. This means
   * that encoding errors will be thrown if the selected option for this field
   * contains characters outside the WinAnsi character set (the latin alphabet).
   *
   * Embedding a custom font and passing it to
   * [[PDFForm.updateFieldAppearances]] or [[PDFDropdown.updateAppearances]]
   * allows you to generate appearance streams with characters outside the
   * latin alphabet (assuming the custom font supports them).
   *
   * Selecting an option that does not exist in this dropdown's option list
   * (see [[PDFDropdown.getOptions]]) will enable editing on this dropdown
   * (see [[PDFDropdown.enableEditing]]).
   *
   * > **NOTE:** PDF readers only display one selected option when rendering
   * > dropdowns. However, the PDF specification does allow for multiple values
   * > to be selected in a dropdown. As such, the `pdf-lib` API supports this.
   * > However, it is not recommended to select more than one value with this
   * > method, as only one will be visible. [[PDFOptionList]] fields are better
   * > suited for displaying multiple selected values.
   *
   * @param options The options to be selected.
   * @param merge Whether or not existing selections should be preserved.
   */
  select(e, t = !1) {
    F(e, "options", ["string", Array]), F(t, "merge", ["boolean"]);
    const i = Array.isArray(e) ? e : [e], n = this.getOptions();
    i.find((o) => !n.includes(o)) && this.enableEditing(), this.markAsDirty(), (i.length > 1 || i.length === 1 && t) && this.enableMultiselect();
    const s = new Array(i.length);
    for (let o = 0, l = i.length; o < l; o++)
      s[o] = z.fromText(i[o]);
    if (t) {
      const o = this.acroField.getValues();
      this.acroField.setValues(o.concat(s));
    } else
      this.acroField.setValues(s);
  }
  /**
   * Clear all selected values for this dropdown. This operation is equivalent
   * to selecting an empty list. This method will update the underlying state
   * of the dropdown to indicate that no values have been selected.
   * For example:
   * ```js
   * const dropdown = form.getDropdown('some.dropdown.field')
   * dropdown.clear()
   * ```
   * This method will mark this text field as dirty. See [[PDFDropdown.select]]
   * for more details about what this means.
   */
  clear() {
    this.markAsDirty(), this.acroField.setValues([]);
  }
  /**
   * Set the font size for this field. Larger font sizes will result in larger
   * text being displayed when PDF readers render this dropdown. Font sizes may
   * be integer or floating point numbers. Supplying a negative font size will
   * cause this method to throw an error.
   *
   * For example:
   * ```js
   * const dropdown = form.getDropdown('some.dropdown.field')
   * dropdown.setFontSize(4)
   * dropdown.setFontSize(15.7)
   * ```
   *
   * > This method depends upon the existence of a default appearance
   * > (`/DA`) string. If this field does not have a default appearance string,
   * > or that string does not contain a font size (via the `Tf` operator),
   * > then this method will throw an error.
   *
   * @param fontSize The font size to be used when rendering text in this field.
   */
  setFontSize(e) {
    xa(e, "fontSize"), this.acroField.setFontSize(e), this.markAsDirty();
  }
  /**
   * Returns `true` if users are allowed to edit the selected value of this
   * dropdown directly and are not constrained by the list of available
   * options. See [[PDFDropdown.enableEditing]] and
   * [[PDFDropdown.disableEditing]]. For example:
   * ```js
   * const dropdown = form.getDropdown('some.dropdown.field')
   * if (dropdown.isEditable()) console.log('Editing is enabled')
   * ```
   * @returns Whether or not this dropdown is editable.
   */
  isEditable() {
    return this.acroField.hasFlag(ne.Edit);
  }
  /**
   * Allow users to edit the selected value of this dropdown in PDF readers
   * with their keyboard. This means that the selected value of this dropdown
   * will not be constrained by the list of available options. However, if this
   * dropdown has any available options, users will still be allowed to select
   * from that list.
   * For example:
   * ```js
   * const dropdown = form.getDropdown('some.dropdown.field')
   * dropdown.enableEditing()
   * ```
   */
  enableEditing() {
    this.acroField.setFlagTo(ne.Edit, !0);
  }
  /**
   * Do not allow users to edit the selected value of this dropdown in PDF
   * readers with their keyboard. This will constrain the selected value of
   * this dropdown to the list of available options. Users will only be able
   * to select an option from that list.
   * For example:
   * ```js
   * const dropdown = form.getDropdown('some.dropdown.field')
   * dropdown.disableEditing()
   * ```
   */
  disableEditing() {
    this.acroField.setFlagTo(ne.Edit, !1);
  }
  /**
   * Returns `true` if the option list of this dropdown is always displayed
   * in alphabetical order, irrespective of the order in which the options
   * were added to the dropdown. See [[PDFDropdown.enableSorting]] and
   * [[PDFDropdown.disableSorting]]. For example:
   * ```js
   * const dropdown = form.getDropdown('some.dropdown.field')
   * if (dropdown.isSorted()) console.log('Sorting is enabled')
   * ```
   * @returns Whether or not this dropdown's options are sorted.
   */
  isSorted() {
    return this.acroField.hasFlag(ne.Sort);
  }
  /**
   * Always display the option list of this dropdown in alphabetical order,
   * irrespective of the order in which the options were added to this dropdown.
   * For example:
   * ```js
   * const dropdown = form.getDropdown('some.dropdown.field')
   * dropdown.enableSorting()
   * ```
   */
  enableSorting() {
    this.acroField.setFlagTo(ne.Sort, !0);
  }
  /**
   * Do not always display the option list of this dropdown in alphabetical
   * order. Instead, display the options in whichever order they were added
   * to the list. For example:
   * ```js
   * const dropdown = form.getDropdown('some.dropdown.field')
   * dropdown.disableSorting()
   * ```
   */
  disableSorting() {
    this.acroField.setFlagTo(ne.Sort, !1);
  }
  /**
   * Returns `true` if multiple options can be selected from this dropdown's
   * option list. See [[PDFDropdown.enableMultiselect]] and
   * [[PDFDropdown.disableMultiselect]]. For example:
   * ```js
   * const dropdown = form.getDropdown('some.dropdown.field')
   * if (dropdown.isMultiselect()) console.log('Multiselect is enabled')
   * ```
   * @returns Whether or not multiple options can be selected.
   */
  isMultiselect() {
    return this.acroField.hasFlag(ne.MultiSelect);
  }
  /**
   * Allow users to select more than one option from this dropdown's option
   * list. For example:
   * ```js
   * const dropdown = form.getDropdown('some.dropdown.field')
   * dropdown.enableMultiselect()
   * ```
   */
  enableMultiselect() {
    this.acroField.setFlagTo(ne.MultiSelect, !0);
  }
  /**
   * Do not allow users to select more than one option from this dropdown's
   * option list. For example:
   * ```js
   * const dropdown = form.getDropdown('some.dropdown.field')
   * dropdown.disableMultiselect()
   * ```
   */
  disableMultiselect() {
    this.acroField.setFlagTo(ne.MultiSelect, !1);
  }
  /**
   * Returns `true` if the selected option should be spell checked by PDF
   * readers. Spell checking will only be performed if this dropdown allows
   * editing (see [[PDFDropdown.isEditable]]). See
   * [[PDFDropdown.enableSpellChecking]] and
   * [[PDFDropdown.disableSpellChecking]]. For example:
   * ```js
   * const dropdown = form.getDropdown('some.dropdown.field')
   * if (dropdown.isSpellChecked()) console.log('Spell checking is enabled')
   * ```
   * @returns Whether or not this dropdown can be spell checked.
   */
  isSpellChecked() {
    return !this.acroField.hasFlag(ne.DoNotSpellCheck);
  }
  /**
   * Allow PDF readers to spell check the selected option of this dropdown.
   * For example:
   * ```js
   * const dropdown = form.getDropdown('some.dropdown.field')
   * dropdown.enableSpellChecking()
   * ```
   */
  enableSpellChecking() {
    this.acroField.setFlagTo(ne.DoNotSpellCheck, !1);
  }
  /**
   * Do not allow PDF readers to spell check the selected option of this
   * dropdown. For example:
   * ```js
   * const dropdown = form.getDropdown('some.dropdown.field')
   * dropdown.disableSpellChecking()
   * ```
   */
  disableSpellChecking() {
    this.acroField.setFlagTo(ne.DoNotSpellCheck, !0);
  }
  /**
   * Returns `true` if the option selected by a user is stored, or "committed",
   * when the user clicks the option. The alternative is that the user's
   * selection is stored when the user leaves this dropdown field (by clicking
   * outside of it - on another field, for example). See
   * [[PDFDropdown.enableSelectOnClick]] and
   * [[PDFDropdown.disableSelectOnClick]]. For example:
   * ```js
   * const dropdown = form.getDropdown('some.dropdown.field')
   * if (dropdown.isSelectOnClick()) console.log('Select on click is enabled')
   * ```
   * @returns Whether or not options are selected immediately after they are
   *          clicked.
   */
  isSelectOnClick() {
    return this.acroField.hasFlag(ne.CommitOnSelChange);
  }
  /**
   * Store the option selected by a user immediately after the user clicks the
   * option. Do not wait for the user to leave this dropdown field (by clicking
   * outside of it - on another field, for example). For example:
   * ```js
   * const dropdown = form.getDropdown('some.dropdown.field')
   * dropdown.enableSelectOnClick()
   * ```
   */
  enableSelectOnClick() {
    this.acroField.setFlagTo(ne.CommitOnSelChange, !0);
  }
  /**
   * Wait to store the option selected by a user until they leave this dropdown
   * field (by clicking outside of it - on another field, for example).
   * For example:
   * ```js
   * const dropdown = form.getDropdown('some.dropdown.field')
   * dropdown.disableSelectOnClick()
   * ```
   */
  disableSelectOnClick() {
    this.acroField.setFlagTo(ne.CommitOnSelChange, !1);
  }
  /**
   * Show this dropdown on the specified page. For example:
   * ```js
   * const ubuntuFont = await pdfDoc.embedFont(ubuntuFontBytes)
   * const page = pdfDoc.addPage()
   *
   * const form = pdfDoc.getForm()
   * const dropdown = form.createDropdown('best.gundam')
   * dropdown.setOptions(['Exia', 'Dynames'])
   * dropdown.select('Exia')
   *
   * dropdown.addToPage(page, {
   *   x: 50,
   *   y: 75,
   *   width: 200,
   *   height: 100,
   *   textColor: rgb(1, 0, 0),
   *   backgroundColor: rgb(0, 1, 0),
   *   borderColor: rgb(0, 0, 1),
   *   borderWidth: 2,
   *   rotate: degrees(90),
   *   font: ubuntuFont,
   * })
   * ```
   * This will create a new widget for this dropdown field.
   * @param page The page to which this dropdown widget should be added.
   * @param options The options to be used when adding this dropdown widget.
   */
  addToPage(e, t) {
    F(e, "page", [[Fe, "PDFPage"]]), tn(t), t || (t = {}), "textColor" in t || (t.textColor = se(0, 0, 0)), "backgroundColor" in t || (t.backgroundColor = se(1, 1, 1)), "borderColor" in t || (t.borderColor = se(0, 0, 0)), "borderWidth" in t || (t.borderWidth = 1);
    const i = this.createWidget({
      x: t.x ?? 0,
      y: t.y ?? 0,
      width: t.width ?? 200,
      height: t.height ?? 50,
      textColor: t.textColor,
      backgroundColor: t.backgroundColor,
      borderColor: t.borderColor,
      borderWidth: t.borderWidth ?? 0,
      rotate: t.rotate ?? H(0),
      hidden: t.hidden,
      page: e.ref
    }), n = this.doc.context.register(i.dict);
    this.acroField.addWidget(n);
    const a = t.font ?? this.doc.getForm().getDefaultFont();
    this.updateWidgetAppearance(i, a), e.node.addAnnot(n);
  }
  /**
   * Returns `true` if this dropdown has been marked as dirty, or if any of
   * this dropdown's widgets do not have an appearance stream. For example:
   * ```js
   * const dropdown = form.getDropdown('some.dropdown.field')
   * if (dropdown.needsAppearancesUpdate()) console.log('Needs update')
   * ```
   * @returns Whether or not this dropdown needs an appearance update.
   */
  needsAppearancesUpdate() {
    var t;
    if (this.isDirty())
      return !0;
    const e = this.acroField.getWidgets();
    for (let i = 0, n = e.length; i < n; i++)
      if (!(((t = e[i].getAppearances()) == null ? void 0 : t.normal) instanceof Ze))
        return !0;
    return !1;
  }
  /**
   * Update the appearance streams for each of this dropdown's widgets using
   * the default appearance provider for dropdowns. For example:
   * ```js
   * const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
   * const dropdown = form.getDropdown('some.dropdown.field')
   * dropdown.defaultUpdateAppearances(helvetica)
   * ```
   * @param font The font to be used for creating the appearance streams.
   */
  defaultUpdateAppearances(e) {
    F(e, "font", [[Ie, "PDFFont"]]), this.updateAppearances(e);
  }
  /**
   * Update the appearance streams for each of this dropdown's widgets using
   * the given appearance provider. If no `provider` is passed, the default
   * appearance provider for dropdowns will be used. For example:
   * ```js
   * const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
   * const dropdown = form.getDropdown('some.dropdown.field')
   * dropdown.updateAppearances(helvetica, (field, widget, font) => {
   *   ...
   *   return drawTextField(...)
   * })
   * ```
   * @param font The font to be used for creating the appearance streams.
   * @param provider Optionally, the appearance provider to be used for
   *                 generating the contents of the appearance streams.
   */
  updateAppearances(e, t) {
    F(e, "font", [[Ie, "PDFFont"]]), R(t, "provider", [Function]);
    const i = this.acroField.getWidgets();
    for (let n = 0, a = i.length; n < a; n++) {
      const s = i[n];
      this.updateWidgetAppearance(s, e, t);
    }
    this.markAsClean();
  }
  // getOption(index: number): string {}
  // getSelectedIndices(): number[] {}
  // removeOptions(option: string | string[]) {}
  // removeIndices(option: number[]) {}
  // deselect(options: string | string[]) {}
  // deselectIndices(optionIndices: number[]) {}
  updateWidgetAppearance(e, t, i) {
    const a = hi((i ?? Bh)(this, e, t));
    this.updateWidgetAppearanceWithFont(e, t, a);
  }
}
Object.defineProperty(Lr, "of", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e, t) => new Lr(r, e, t)
});
class Mr extends Fr {
  constructor(e, t, i) {
    super(e, t, i), Object.defineProperty(this, "acroField", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), F(e, "acroListBox", [[Vt, "PDFAcroListBox"]]), this.acroField = e;
  }
  /**
   * Get the list of available options for this option list. These options will
   * be displayed to users who view this option list in a PDF reader.
   * For example:
   * ```js
   * const optionList = form.getOptionList('some.optionList.field')
   * const options = optionList.getOptions()
   * console.log('Option List options:', options)
   * ```
   * @returns The options for this option list.
   */
  getOptions() {
    const e = this.acroField.getOptions(), t = new Array(e.length);
    for (let i = 0, n = t.length; i < n; i++) {
      const { display: a, value: s } = e[i];
      t[i] = (a ?? s).decodeText();
    }
    return t;
  }
  /**
   * Get the selected options for this option list. These are the values that
   * were selected by a human user via a PDF reader, or programatically via
   * software.
   * For example:
   * ```js
   * const optionList = form.getOptionList('some.optionList.field')
   * const selections = optionList.getSelected()
   * console.log('Option List selections:', selections)
   * ```
   * @returns The selected options for this option list.
   */
  getSelected() {
    const e = this.acroField.getValues(), t = new Array(e.length);
    for (let i = 0, n = e.length; i < n; i++)
      t[i] = e[i].decodeText();
    return t;
  }
  /**
   * Set the list of options that are available for this option list. These are
   * the values that will be available for users to select when they view this
   * option list in a PDF reader. Note that preexisting options for this
   * option list will be removed. Only the values passed as `options` will be
   * available to select.
   *
   * For example:
   * ```js
   * const optionList = form.getOptionList('planets.optionList')
   * optionList.setOptions(['Earth', 'Mars', 'Pluto', 'Venus'])
   * ```
   *
   * This method will mark this option list as dirty, causing its appearance
   * streams to be updated when either [[PDFDocument.save]] or
   * [[PDFForm.updateFieldAppearances]] is called. The updated streams will
   * display the options this field contains inside the widgets of this text
   * field (with selected options highlighted).
   *
   * **IMPORTANT:** The default font used to update appearance streams is
   * [[StandardFonts.Helvetica]]. Note that this is a WinAnsi font. This means
   * that encoding errors will be thrown if this field contains any options
   * with characters outside the WinAnsi character set (the latin alphabet).
   *
   * Embedding a custom font and passing it to
   * [[PDFForm.updateFieldAppearances]] or [[PDFOptionList.updateAppearances]]
   * allows you to generate appearance streams with characters outside the
   * latin alphabet (assuming the custom font supports them).
   *
   * @param options The options that should be available in this option list.
   */
  setOptions(e) {
    F(e, "options", [Array]), this.markAsDirty();
    const t = new Array(e.length);
    for (let i = 0, n = e.length; i < n; i++)
      t[i] = { value: z.fromText(e[i]) };
    this.acroField.setOptions(t);
  }
  /**
   * Add to the list of options that are available for this option list. Users
   * will be able to select these values in a PDF reader. In addition to the
   * values passed as `options`, any preexisting options for this option list
   * will still be available for users to select.
   * For example:
   * ```js
   * const optionList = form.getOptionList('rockets.optionList')
   * optionList.addOptions(['Saturn IV', 'Falcon Heavy'])
   * ```
   * This method will mark this option list as dirty. See
   * [[PDFOptionList.setOptions]] for more details about what this means.
   * @param options New options that should be available in this option list.
   */
  addOptions(e) {
    F(e, "options", ["string", Array]), this.markAsDirty();
    const t = Array.isArray(e) ? e : [e], i = this.acroField.getOptions(), n = new Array(t.length);
    for (let a = 0, s = t.length; a < s; a++)
      n[a] = { value: z.fromText(t[a]) };
    this.acroField.setOptions(i.concat(n));
  }
  /**
   * Select one or more values for this option list. This operation is analogous
   * to a human user opening the option list in a PDF reader and clicking on one
   * or more values to select them. This method will update the underlying state
   * of the option list to indicate which values have been selected. PDF
   * libraries and readers will be able to extract these values from the saved
   * document and determine which values were selected.
   * For example:
   * ```js
   * const optionList = form.getOptionList('best.superheroes.optionList')
   * optionList.select(['One Punch Man', 'Iron Man'])
   * ```
   * This method will mark this option list as dirty. See
   * [[PDFOptionList.setOptions]] for more details about what this means.
   * @param options The options to be selected.
   * @param merge Whether or not existing selections should be preserved.
   */
  select(e, t = !1) {
    F(e, "options", ["string", Array]), F(t, "merge", ["boolean"]);
    const i = Array.isArray(e) ? e : [e], n = this.getOptions();
    Au(i, "option", n), this.markAsDirty(), (i.length > 1 || i.length === 1 && t) && this.enableMultiselect();
    const a = new Array(i.length);
    for (let s = 0, o = i.length; s < o; s++)
      a[s] = z.fromText(i[s]);
    if (t) {
      const s = this.acroField.getValues();
      this.acroField.setValues(s.concat(a));
    } else
      this.acroField.setValues(a);
  }
  /**
   * Clear all selected values for this option list. This operation is
   * equivalent to selecting an empty list. This method will update the
   * underlying state of the option list to indicate that no values have been
   * selected.
   * For example:
   * ```js
   * const optionList = form.getOptionList('some.optionList.field')
   * optionList.clear()
   * ```
   * This method will mark this option list as dirty. See
   * [[PDFOptionList.setOptions]] for more details about what this means.
   */
  clear() {
    this.markAsDirty(), this.acroField.setValues([]);
  }
  /**
   * Set the font size for the text in this field. There needs to be a
   * default appearance string (DA) set with a font value specified
   * for this to work. For example:
   * ```js
   * const optionList = form.getOptionList('some.optionList.field')
   * optionList.setFontSize(4);
   * ```
   * @param fontSize The font size to set the font to.
   */
  /**
   * Set the font size for this field. Larger font sizes will result in larger
   * text being displayed when PDF readers render this option list. Font sizes
   * may be integer or floating point numbers. Supplying a negative font size
   * will cause this method to throw an error.
   *
   * For example:
   * ```js
   * const optionList = form.getOptionList('some.optionList.field')
   * optionList.setFontSize(4)
   * optionList.setFontSize(15.7)
   * ```
   *
   * > This method depends upon the existence of a default appearance
   * > (`/DA`) string. If this field does not have a default appearance string,
   * > or that string does not contain a font size (via the `Tf` operator),
   * > then this method will throw an error.
   *
   * @param fontSize The font size to be used when rendering text in this field.
   */
  setFontSize(e) {
    xa(e, "fontSize"), this.acroField.setFontSize(e), this.markAsDirty();
  }
  /**
   * Returns `true` if the options of this option list are always displayed
   * in alphabetical order, irrespective of the order in which the options
   * were added to the option list. See [[PDFOptionList.enableSorting]] and
   * [[PDFOptionList.disableSorting]]. For example:
   * ```js
   * const optionList = form.getOptionList('some.optionList.field')
   * if (optionList.isSorted()) console.log('Sorting is enabled')
   * ```
   * @returns Whether or not this option list is sorted.
   */
  isSorted() {
    return this.acroField.hasFlag(ne.Sort);
  }
  /**
   * Always display the options of this option list in alphabetical order,
   * irrespective of the order in which the options were added to this option
   * list.
   * For example:
   * ```js
   * const optionList = form.getOptionList('some.optionList.field')
   * optionList.enableSorting()
   * ```
   */
  enableSorting() {
    this.acroField.setFlagTo(ne.Sort, !0);
  }
  /**
   * Do not always display the options of this option list in alphabetical
   * order. Instead, display the options in whichever order they were added
   * to this option list. For example:
   * ```js
   * const optionList = form.getOptionList('some.optionList.field')
   * optionList.disableSorting()
   * ```
   */
  disableSorting() {
    this.acroField.setFlagTo(ne.Sort, !1);
  }
  /**
   * Returns `true` if multiple options can be selected from this option list.
   * See [[PDFOptionList.enableMultiselect]] and
   * [[PDFOptionList.disableMultiselect]]. For example:
   * ```js
   * const optionList = form.getOptionList('some.optionList.field')
   * if (optionList.isMultiselect()) console.log('Multiselect is enabled')
   * ```
   * @returns Whether or not multiple options can be selected.
   */
  isMultiselect() {
    return this.acroField.hasFlag(ne.MultiSelect);
  }
  /**
   * Allow users to select more than one option from this option list.
   * For example:
   * ```js
   * const optionList = form.getOptionList('some.optionList.field')
   * optionList.enableMultiselect()
   * ```
   */
  enableMultiselect() {
    this.acroField.setFlagTo(ne.MultiSelect, !0);
  }
  /**
   * Do not allow users to select more than one option from this option list.
   * For example:
   * ```js
   * const optionList = form.getOptionList('some.optionList.field')
   * optionList.disableMultiselect()
   * ```
   */
  disableMultiselect() {
    this.acroField.setFlagTo(ne.MultiSelect, !1);
  }
  /**
   * Returns `true` if the option selected by a user is stored, or "committed",
   * when the user clicks the option. The alternative is that the user's
   * selection is stored when the user leaves this option list field (by
   * clicking outside of it - on another field, for example). See
   * [[PDFOptionList.enableSelectOnClick]] and
   * [[PDFOptionList.disableSelectOnClick]]. For example:
   * ```js
   * const optionList = form.getOptionList('some.optionList.field')
   * if (optionList.isSelectOnClick()) console.log('Select on click is enabled')
   * ```
   * @returns Whether or not options are selected immediately after they are
   *          clicked.
   */
  isSelectOnClick() {
    return this.acroField.hasFlag(ne.CommitOnSelChange);
  }
  /**
   * Store the option selected by a user immediately after the user clicks the
   * option. Do not wait for the user to leave this option list field (by
   * clicking outside of it - on another field, for example). For example:
   * ```js
   * const optionList = form.getOptionList('some.optionList.field')
   * optionList.enableSelectOnClick()
   * ```
   */
  enableSelectOnClick() {
    this.acroField.setFlagTo(ne.CommitOnSelChange, !0);
  }
  /**
   * Wait to store the option selected by a user until they leave this option
   * list field (by clicking outside of it - on another field, for example).
   * For example:
   * ```js
   * const optionList = form.getOptionList('some.optionList.field')
   * optionList.disableSelectOnClick()
   * ```
   */
  disableSelectOnClick() {
    this.acroField.setFlagTo(ne.CommitOnSelChange, !1);
  }
  /**
   * Show this option list on the specified page. For example:
   * ```js
   * const ubuntuFont = await pdfDoc.embedFont(ubuntuFontBytes)
   * const page = pdfDoc.addPage()
   *
   * const form = pdfDoc.getForm()
   * const optionList = form.createOptionList('best.gundams')
   * optionList.setOptions(['Exia', 'Dynames', 'Kyrios', 'Virtue'])
   * optionList.select(['Exia', 'Virtue'])
   *
   * optionList.addToPage(page, {
   *   x: 50,
   *   y: 75,
   *   width: 200,
   *   height: 100,
   *   textColor: rgb(1, 0, 0),
   *   backgroundColor: rgb(0, 1, 0),
   *   borderColor: rgb(0, 0, 1),
   *   borderWidth: 2,
   *   rotate: degrees(90),
   *   font: ubuntuFont,
   * })
   * ```
   * This will create a new widget for this option list field.
   * @param page The page to which this option list widget should be added.
   * @param options The options to be used when adding this option list widget.
   */
  addToPage(e, t) {
    F(e, "page", [[Fe, "PDFPage"]]), tn(t), t || (t = {}), "textColor" in t || (t.textColor = se(0, 0, 0)), "backgroundColor" in t || (t.backgroundColor = se(1, 1, 1)), "borderColor" in t || (t.borderColor = se(0, 0, 0)), "borderWidth" in t || (t.borderWidth = 1);
    const i = this.createWidget({
      x: t.x ?? 0,
      y: t.y ?? 0,
      width: t.width ?? 200,
      height: t.height ?? 100,
      textColor: t.textColor,
      backgroundColor: t.backgroundColor,
      borderColor: t.borderColor,
      borderWidth: t.borderWidth ?? 0,
      rotate: t.rotate ?? H(0),
      hidden: t.hidden,
      page: e.ref
    }), n = this.doc.context.register(i.dict);
    this.acroField.addWidget(n);
    const a = t.font ?? this.doc.getForm().getDefaultFont();
    this.updateWidgetAppearance(i, a), e.node.addAnnot(n);
  }
  /**
   * Returns `true` if this option list has been marked as dirty, or if any of
   * this option list's widgets do not have an appearance stream. For example:
   * ```js
   * const optionList = form.getOptionList('some.optionList.field')
   * if (optionList.needsAppearancesUpdate()) console.log('Needs update')
   * ```
   * @returns Whether or not this option list needs an appearance update.
   */
  needsAppearancesUpdate() {
    var t;
    if (this.isDirty())
      return !0;
    const e = this.acroField.getWidgets();
    for (let i = 0, n = e.length; i < n; i++)
      if (!(((t = e[i].getAppearances()) == null ? void 0 : t.normal) instanceof Ze))
        return !0;
    return !1;
  }
  /**
   * Update the appearance streams for each of this option list's widgets using
   * the default appearance provider for option lists. For example:
   * ```js
   * const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
   * const optionList = form.getOptionList('some.optionList.field')
   * optionList.defaultUpdateAppearances(helvetica)
   * ```
   * @param font The font to be used for creating the appearance streams.
   */
  defaultUpdateAppearances(e) {
    F(e, "font", [[Ie, "PDFFont"]]), this.updateAppearances(e);
  }
  /**
   * Update the appearance streams for each of this option list's widgets using
   * the given appearance provider. If no `provider` is passed, the default
   * appearance provider for option lists will be used. For example:
   * ```js
   * const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
   * const optionList = form.getOptionList('some.optionList.field')
   * optionList.updateAppearances(helvetica, (field, widget, font) => {
   *   ...
   *   return drawOptionList(...)
   * })
   * ```
   * @param font The font to be used for creating the appearance streams.
   * @param provider Optionally, the appearance provider to be used for
   *                 generating the contents of the appearance streams.
   */
  updateAppearances(e, t) {
    F(e, "font", [[Ie, "PDFFont"]]), R(t, "provider", [Function]);
    const i = this.acroField.getWidgets();
    for (let n = 0, a = i.length; n < a; n++) {
      const s = i[n];
      this.updateWidgetAppearance(s, e, t);
    }
    this.markAsClean();
  }
  // getOption(index: number): string {}
  // getSelectedIndices(): number[] {}
  // removeOptions(option: string | string[]) {}
  // removeIndices(option: number[]) {}
  // deselect(options: string | string[]) {}
  // deselectIndices(optionIndices: number[]) {}
  updateWidgetAppearance(e, t, i) {
    const a = hi((i ?? Nh)(this, e, t));
    this.updateWidgetAppearanceWithFont(e, t, a);
  }
}
Object.defineProperty(Mr, "of", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e, t) => new Mr(r, e, t)
});
class br extends Fr {
  constructor(e, t, i) {
    super(e, t, i), Object.defineProperty(this, "acroField", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), F(e, "acroRadioButton", [[Kt, "PDFAcroRadioButton"]]), this.acroField = e;
  }
  /**
   * Get the list of available options for this radio group. Each option is
   * represented by a radio button. These radio buttons are displayed at
   * various locations in the document, potentially on different pages (though
   * typically they are stacked horizontally or vertically on the same page).
   * For example:
   * ```js
   * const radioGroup = form.getRadioGroup('some.radioGroup.field')
   * const options = radioGroup.getOptions()
   * console.log('Radio Group options:', options)
   * ```
   * @returns The options for this radio group.
   */
  getOptions() {
    const e = this.acroField.getExportValues();
    if (e) {
      const n = new Array(e.length);
      for (let a = 0, s = e.length; a < s; a++)
        n[a] = e[a].decodeText();
      return n;
    }
    const t = this.acroField.getOnValues(), i = new Array(t.length);
    for (let n = 0, a = i.length; n < a; n++)
      i[n] = t[n].decodeText();
    return i;
  }
  /**
   * Get the selected option for this radio group. The selected option is
   * represented by the radio button in this group that is turned on. At most
   * one radio button in a group can be selected. If no buttons in this group
   * are selected, `undefined` is returned.
   * For example:
   * ```js
   * const radioGroup = form.getRadioGroup('some.radioGroup.field')
   * const selected = radioGroup.getSelected()
   * console.log('Selected radio button:', selected)
   * ```
   * @returns The selected option for this radio group.
   */
  getSelected() {
    const e = this.acroField.getValue();
    if (e === x.of("Off"))
      return;
    const t = this.acroField.getExportValues();
    if (t) {
      const i = this.acroField.getOnValues();
      for (let n = 0, a = i.length; n < a; n++)
        if (i[n] === e)
          return t[n].decodeText();
    }
    return e.decodeText();
  }
  // // TODO: Figure out why this seems to crash Acrobat. Maybe it's because we
  // //       aren't removing the widget reference from the page's Annots?
  // removeOption(option: string) {
  //   assertIs(option, 'option', ['string']);
  //   // TODO: Assert is valid `option`!
  //   const onValues = this.acroField.getOnValues();
  //   const exportValues = this.acroField.getExportValues();
  //   if (exportValues) {
  //     for (let idx = 0, len = exportValues.length; idx < len; idx++) {
  //       if (exportValues[idx].decodeText() === option) {
  //         this.acroField.removeWidget(idx);
  //         this.acroField.removeExportValue(idx);
  //       }
  //     }
  //   } else {
  //     for (let idx = 0, len = onValues.length; idx < len; idx++) {
  //       const value = onValues[idx];
  //       if (value.decodeText() === option) {
  //         this.acroField.removeWidget(idx);
  //         this.acroField.removeExportValue(idx);
  //       }
  //     }
  //   }
  // }
  /**
   * Select an option for this radio group. This operation is analogous to a
   * human user clicking one of the radio buttons in this group via a PDF
   * reader to toggle it on. This method will update the underlying state of
   * the radio group to indicate which option has been selected. PDF libraries
   * and readers will be able to extract this value from the saved document and
   * determine which option was selected.
   *
   * For example:
   * ```js
   * const radioGroup = form.getRadioGroup('best.superhero.radioGroup')
   * radioGroup.select('One Punch Man')
   * ```
   *
   * This method will mark this radio group as dirty, causing its appearance
   * streams to be updated when either [[PDFDocument.save]] or
   * [[PDFForm.updateFieldAppearances]] is called. The updated appearance
   * streams will display a dot inside the widget of this check box field
   * that represents the selected option.
   *
   * @param option The option to be selected.
   */
  select(e) {
    F(e, "option", ["string"]);
    const t = this.getOptions();
    Tr(e, "option", t), this.markAsDirty();
    const i = this.acroField.getOnValues(), n = this.acroField.getExportValues();
    if (n)
      for (let a = 0, s = n.length; a < s; a++)
        n[a].decodeText() === e && this.acroField.setValue(i[a]);
    else
      for (let a = 0, s = i.length; a < s; a++) {
        const o = i[a];
        o.decodeText() === e && this.acroField.setValue(o);
      }
  }
  /**
   * Clear any selected option for this dropdown. This will result in all
   * radio buttons in this group being toggled off. This method will update
   * the underlying state of the dropdown to indicate that no radio buttons
   * have been selected.
   * For example:
   * ```js
   * const radioGroup = form.getRadioGroup('some.radioGroup.field')
   * radioGroup.clear()
   * ```
   * This method will mark this radio group as dirty. See
   * [[PDFRadioGroup.select]] for more details about what this means.
   */
  clear() {
    this.markAsDirty(), this.acroField.setValue(x.of("Off"));
  }
  /**
   * Returns `true` if users can click on radio buttons in this group to toggle
   * them off. The alternative is that once a user clicks on a radio button
   * to select it, the only way to deselect it is by selecting on another radio
   * button in the group. See [[PDFRadioGroup.enableOffToggling]] and
   * [[PDFRadioGroup.disableOffToggling]]. For example:
   * ```js
   * const radioGroup = form.getRadioGroup('some.radioGroup.field')
   * if (radioGroup.isOffToggleable()) console.log('Off toggling is enabled')
   * ```
   */
  isOffToggleable() {
    return !this.acroField.hasFlag(Ge.NoToggleToOff);
  }
  /**
   * Allow users to click on selected radio buttons in this group to toggle
   * them off. For example:
   * ```js
   * const radioGroup = form.getRadioGroup('some.radioGroup.field')
   * radioGroup.enableOffToggling()
   * ```
   * > **NOTE:** This feature is documented in the PDF specification
   * > (Table 226). However, most PDF readers do not respect this option and
   * > prevent users from toggling radio buttons off even when it is enabled.
   * > At the time of this writing (9/6/2020) Mac's Preview software did
   * > respect the option. Adobe Acrobat, Foxit Reader, and Google Chrome did
   * > not.
   */
  enableOffToggling() {
    this.acroField.setFlagTo(Ge.NoToggleToOff, !1);
  }
  /**
   * Prevent users from clicking on selected radio buttons in this group to
   * toggle them off. Clicking on a selected radio button will have no effect.
   * The only way to deselect a selected radio button is to click on a
   * different radio button in the group. For example:
   * ```js
   * const radioGroup = form.getRadioGroup('some.radioGroup.field')
   * radioGroup.disableOffToggling()
   * ```
   */
  disableOffToggling() {
    this.acroField.setFlagTo(Ge.NoToggleToOff, !0);
  }
  /**
   * Returns `true` if the radio buttons in this group are mutually exclusive.
   * This means that when the user selects a radio button, only that specific
   * button will be turned on. Even if other radio buttons in the group
   * represent the same value, they will not be enabled. The alternative to
   * this is that clicking a radio button will select that button along with
   * any other radio buttons in the group that share the same value. See
   * [[PDFRadioGroup.enableMutualExclusion]] and
   * [[PDFRadioGroup.disableMutualExclusion]].
   * For example:
   * ```js
   * const radioGroup = form.getRadioGroup('some.radioGroup.field')
   * if (radioGroup.isMutuallyExclusive()) console.log('Mutual exclusion is enabled')
   * ```
   */
  isMutuallyExclusive() {
    return !this.acroField.hasFlag(Ge.RadiosInUnison);
  }
  /**
   * When the user clicks a radio button in this group it will be selected. In
   * addition, any other radio buttons in this group that share the same
   * underlying value will also be selected. For example:
   * ```js
   * const radioGroup = form.getRadioGroup('some.radioGroup.field')
   * radioGroup.enableMutualExclusion()
   * ```
   * Note that this option must be enabled prior to adding options to the
   * radio group. It does not currently apply retroactively to existing
   * radio buttons in the group.
   */
  enableMutualExclusion() {
    this.acroField.setFlagTo(Ge.RadiosInUnison, !1);
  }
  /**
   * When the user clicks a radio button in this group only it will be selected.
   * No other radio buttons in the group will be selected, even if they share
   * the same underlying value. For example:
   * ```js
   * const radioGroup = form.getRadioGroup('some.radioGroup.field')
   * radioGroup.disableMutualExclusion()
   * ```
   * Note that this option must be disabled prior to adding options to the
   * radio group. It does not currently apply retroactively to existing
   * radio buttons in the group.
   */
  disableMutualExclusion() {
    this.acroField.setFlagTo(Ge.RadiosInUnison, !0);
  }
  /**
   * Add a new radio button to this group on the specified page. For example:
   * ```js
   * const page = pdfDoc.addPage()
   *
   * const form = pdfDoc.getForm()
   * const radioGroup = form.createRadioGroup('best.gundam')
   *
   * const options = {
   *   x: 50,
   *   width: 25,
   *   height: 25,
   *   textColor: rgb(1, 0, 0),
   *   backgroundColor: rgb(0, 1, 0),
   *   borderColor: rgb(0, 0, 1),
   *   borderWidth: 2,
   *   rotate: degrees(90),
   * }
   *
   * radioGroup.addOptionToPage('Exia', page, { ...options, y: 50 })
   * radioGroup.addOptionToPage('Dynames', page, { ...options, y: 110 })
   * ```
   * This will create a new radio button widget for this radio group field.
   * @param option The option that the radio button widget represents.
   * @param page The page to which the radio button widget should be added.
   * @param options The options to be used when adding the radio button widget.
   */
  addOptionToPage(e, t, i) {
    F(e, "option", ["string"]), F(t, "page", [[Fe, "PDFPage"]]), tn(i);
    const n = this.createWidget({
      x: (i == null ? void 0 : i.x) ?? 0,
      y: (i == null ? void 0 : i.y) ?? 0,
      width: (i == null ? void 0 : i.width) ?? 50,
      height: (i == null ? void 0 : i.height) ?? 50,
      textColor: (i == null ? void 0 : i.textColor) ?? se(0, 0, 0),
      backgroundColor: (i == null ? void 0 : i.backgroundColor) ?? se(1, 1, 1),
      borderColor: (i == null ? void 0 : i.borderColor) ?? se(0, 0, 0),
      borderWidth: (i == null ? void 0 : i.borderWidth) ?? 1,
      rotate: (i == null ? void 0 : i.rotate) ?? H(0),
      hidden: i == null ? void 0 : i.hidden,
      page: t.ref
    }), a = this.doc.context.register(n.dict), s = this.acroField.addWidgetWithOpt(a, z.fromText(e), !this.isMutuallyExclusive());
    n.setAppearanceState(x.of("Off")), this.updateWidgetAppearance(n, s), t.node.addAnnot(a);
  }
  /**
   * Returns `true` if any of this group's radio button widgets do not have an
   * appearance stream for their current state. For example:
   * ```js
   * const radioGroup = form.getRadioGroup('some.radioGroup.field')
   * if (radioGroup.needsAppearancesUpdate()) console.log('Needs update')
   * ```
   * @returns Whether or not this radio group needs an appearance update.
   */
  needsAppearancesUpdate() {
    var t;
    const e = this.acroField.getWidgets();
    for (let i = 0, n = e.length; i < n; i++) {
      const a = e[i], s = a.getAppearanceState(), o = (t = a.getAppearances()) == null ? void 0 : t.normal;
      if (!(o instanceof $) || s && !o.has(s))
        return !0;
    }
    return !1;
  }
  /**
   * Update the appearance streams for each of this group's radio button widgets
   * using the default appearance provider for radio groups. For example:
   * ```js
   * const radioGroup = form.getRadioGroup('some.radioGroup.field')
   * radioGroup.defaultUpdateAppearances()
   * ```
   */
  defaultUpdateAppearances() {
    this.updateAppearances();
  }
  // rg.updateAppearances((field: any, widget: any) => {
  //   assert(field === rg);
  //   assert(widget instanceof PDFWidgetAnnotation);
  //   return { on: [...rectangle, ...circle], off: [...rectangle, ...circle] };
  // });
  /**
   * Update the appearance streams for each of this group's radio button widgets
   * using the given appearance provider. If no `provider` is passed, the
   * default appearance provider for radio groups will be used. For example:
   * ```js
   * const radioGroup = form.getRadioGroup('some.radioGroup.field')
   * radioGroup.updateAppearances((field, widget) => {
   *   ...
   *   return {
   *     normal: { on: drawRadioButton(...), off: drawRadioButton(...) },
   *     down: { on: drawRadioButton(...), off: drawRadioButton(...) },
   *   }
   * })
   * ```
   * @param provider Optionally, the appearance provider to be used for
   *                 generating the contents of the appearance streams.
   */
  updateAppearances(e) {
    R(e, "provider", [Function]);
    const t = this.acroField.getWidgets();
    for (let i = 0, n = t.length; i < n; i++) {
      const a = t[i], s = a.getOnValue();
      s && this.updateWidgetAppearance(a, s, e);
    }
  }
  updateWidgetAppearance(e, t, i) {
    const a = hi((i ?? Eh)(this, e));
    this.updateOnOffWidgetAppearance(e, t, a);
  }
}
Object.defineProperty(br, "of", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e, t) => new br(r, e, t)
});
class Mi extends Fr {
  constructor(e, t, i) {
    super(e, t, i), Object.defineProperty(this, "acroField", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), F(e, "acroSignature", [[zi, "PDFAcroSignature"]]), this.acroField = e;
  }
  needsAppearancesUpdate() {
    return !1;
  }
}
Object.defineProperty(Mi, "of", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e, t) => new Mi(r, e, t)
});
class Ur extends Fr {
  constructor(e, t, i) {
    super(e, t, i), Object.defineProperty(this, "acroField", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), F(e, "acroText", [[qt, "PDFAcroText"]]), this.acroField = e;
  }
  /**
   * Get the text that this field contains. This text is visible to users who
   * view this field in a PDF reader.
   *
   * For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * const text = textField.getText()
   * console.log('Text field contents:', text)
   * ```
   *
   * Note that if this text field contains no underlying value, `undefined`
   * will be returned. Text fields may also contain an underlying value that
   * is simply an empty string (`''`). This detail is largely irrelevant for
   * most applications. In general, you'll want to treat both cases the same
   * way and simply consider the text field to be empty. In either case, the
   * text field will appear empty to users when viewed in a PDF reader.
   *
   * An error will be thrown if this is a rich text field. `pdf-lib` does not
   * support reading rich text fields. Nor do most PDF readers and writers.
   * Rich text fields are based on XFA (XML Forms Architecture). Relatively few
   * PDFs use rich text fields or XFA. Unlike PDF itself, XFA is not an ISO
   * standard. XFA has been deprecated in PDF 2.0:
   * * https://en.wikipedia.org/wiki/XFA
   * * http://blog.pdfshareforms.com/pdf-2-0-release-bid-farewell-xfa-forms/
   *
   * @returns The text contained in this text field.
   */
  getText() {
    const e = this.acroField.getValue();
    if (!e && this.isRichFormatted())
      throw new _h(this.getName());
    return e == null ? void 0 : e.decodeText();
  }
  /**
   * Set the text for this field. This operation is analogous to a human user
   * clicking on the text field in a PDF reader and typing in text via their
   * keyboard. This method will update the underlying state of the text field
   * to indicate what text has been set. PDF libraries and readers will be able
   * to extract these values from the saved document and determine what text
   * was set.
   *
   * For example:
   * ```js
   * const textField = form.getTextField('best.superhero.text.field')
   * textField.setText('One Punch Man')
   * ```
   *
   * This method will mark this text field as dirty, causing its appearance
   * streams to be updated when either [[PDFDocument.save]] or
   * [[PDFForm.updateFieldAppearances]] is called. The updated streams will
   * display the text this field contains inside the widgets of this text
   * field.
   *
   * **IMPORTANT:** The default font used to update appearance streams is
   * [[StandardFonts.Helvetica]]. Note that this is a WinAnsi font. This means
   * that encoding errors will be thrown if this field contains text outside
   * the WinAnsi character set (the latin alphabet).
   *
   * Embedding a custom font and passing it to
   * [[PDFForm.updateFieldAppearances]] or [[PDFTextField.updateAppearances]]
   * allows you to generate appearance streams with characters outside the
   * latin alphabet (assuming the custom font supports them).
   *
   * If this is a rich text field, it will be converted to a standard text
   * field in order to set the text. `pdf-lib` does not support writing rich
   * text strings. Nor do most PDF readers and writers. See
   * [[PDFTextField.getText]] for more information about rich text fields and
   * their deprecation in PDF 2.0.
   *
   * @param text The text this field should contain.
   */
  setText(e) {
    R(e, "text", ["string"]);
    const t = this.getMaxLength();
    if (t !== void 0 && e && e.length > t)
      throw new Sh(e.length, t, this.getName());
    this.markAsDirty(), this.disableRichFormatting(), e ? this.acroField.setValue(z.fromText(e)) : this.acroField.removeValue();
  }
  /**
   * Get the alignment for this text field. This value represents the
   * justification of the text when it is displayed to the user in PDF readers.
   * There are three possible alignments: left, center, and right. For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * const alignment = textField.getAlignment()
   * if (alignment === TextAlignment.Left) console.log('Text is left justified')
   * if (alignment === TextAlignment.Center) console.log('Text is centered')
   * if (alignment === TextAlignment.Right) console.log('Text is right justified')
   * ```
   * @returns The alignment of this text field.
   */
  getAlignment() {
    const e = this.acroField.getQuadding();
    return e === 0 ? ke.Left : e === 1 ? ke.Center : e === 2 ? ke.Right : ke.Left;
  }
  /**
   * Set the alignment for this text field. This will determine the
   * justification of the text when it is displayed to the user in PDF readers.
   * There are three possible alignments: left, center, and right. For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   *
   * // Text will be left justified when displayed
   * textField.setAlignment(TextAlignment.Left)
   *
   * // Text will be centered when displayed
   * textField.setAlignment(TextAlignment.Center)
   *
   * // Text will be right justified when displayed
   * textField.setAlignment(TextAlignment.Right)
   * ```
   * This method will mark this text field as dirty. See
   * [[PDFTextField.setText]] for more details about what this means.
   * @param alignment The alignment for this text field.
   */
  setAlignment(e) {
    Tr(e, "alignment", ke), this.markAsDirty(), this.acroField.setQuadding(e);
  }
  /**
   * Get the maximum length of this field. This value represents the maximum
   * number of characters that can be typed into this field by the user. If
   * this field does not have a maximum length, `undefined` is returned.
   * For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * const maxLength = textField.getMaxLength()
   * if (maxLength === undefined) console.log('No max length')
   * else console.log(`Max length is ${maxLength}`)
   * ```
   * @returns The maximum number of characters allowed in this field, or
   *          `undefined` if no limit exists.
   */
  getMaxLength() {
    return this.acroField.getMaxLength();
  }
  /**
   * Set the maximum length of this field. This limits the number of characters
   * that can be typed into this field by the user. This also limits the length
   * of the string that can be passed to [[PDFTextField.setText]]. This limit
   * can be removed by passing `undefined` as `maxLength`. For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   *
   * // Allow between 0 and 5 characters to be entered
   * textField.setMaxLength(5)
   *
   * // Allow any number of characters to be entered
   * textField.setMaxLength(undefined)
   * ```
   * This method will mark this text field as dirty. See
   * [[PDFTextField.setText]] for more details about what this means.
   * @param maxLength The maximum number of characters allowed in this field, or
   *                  `undefined` to remove the limit.
   */
  setMaxLength(e) {
    if (et(e, "maxLength", 0, Number.MAX_SAFE_INTEGER), this.markAsDirty(), e === void 0)
      this.acroField.removeMaxLength();
    else {
      const t = this.getText();
      if (t && t.length > e)
        throw new Ah(t.length, e, this.getName());
      this.acroField.setMaxLength(e);
    }
  }
  /**
   * Remove the maximum length for this text field. This allows any number of
   * characters to be typed into this field by the user. For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * textField.removeMaxLength()
   * ```
   * Calling this method is equivalent to passing `undefined` to
   * [[PDFTextField.setMaxLength]].
   */
  removeMaxLength() {
    this.markAsDirty(), this.acroField.removeMaxLength();
  }
  /**
   * Display an image inside the bounds of this text field's widgets. For example:
   * ```js
   * const pngImage = await pdfDoc.embedPng(...)
   * const textField = form.getTextField('some.text.field')
   * textField.setImage(pngImage)
   * ```
   * This will update the appearances streams for each of this text field's widgets.
   * @param image The image that should be displayed.
   */
  setImage(e) {
    const t = this.getAlignment(), i = t === ke.Center ? Mt.Center : t === ke.Right ? Mt.Right : Mt.Left, n = this.acroField.getWidgets();
    for (let a = 0, s = n.length; a < s; a++) {
      const o = n[a], l = this.createImageAppearanceStream(o, e, i);
      this.updateWidgetAppearances(o, { normal: l });
    }
    this.markAsClean();
  }
  /**
   * Set the font size for this field. Larger font sizes will result in larger
   * text being displayed when PDF readers render this text field. Font sizes
   * may be integer or floating point numbers. Supplying a negative font size
   * will cause this method to throw an error.
   *
   * For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * textField.setFontSize(4)
   * textField.setFontSize(15.7)
   * ```
   *
   * > This method depends upon the existence of a default appearance
   * > (`/DA`) string. If this field does not have a default appearance string,
   * > or that string does not contain a font size (via the `Tf` operator),
   * > then this method will throw an error.
   *
   * @param fontSize The font size to be used when rendering text in this field.
   */
  setFontSize(e) {
    xa(e, "fontSize"), this.acroField.setFontSize(e), this.markAsDirty();
  }
  /**
   * Returns `true` if each line of text is shown on a new line when this
   * field is displayed in a PDF reader. The alternative is that all lines of
   * text are merged onto a single line when displayed. See
   * [[PDFTextField.enableMultiline]] and [[PDFTextField.disableMultiline]].
   * For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * if (textField.isMultiline()) console.log('Multiline is enabled')
   * ```
   * @returns Whether or not this is a multiline text field.
   */
  isMultiline() {
    return this.acroField.hasFlag(xe.Multiline);
  }
  /**
   * Display each line of text on a new line when this field is displayed in a
   * PDF reader. For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * textField.enableMultiline()
   * ```
   * This method will mark this text field as dirty. See
   * [[PDFTextField.setText]] for more details about what this means.
   */
  enableMultiline() {
    this.markAsDirty(), this.acroField.setFlagTo(xe.Multiline, !0);
  }
  /**
   * Display each line of text on the same line when this field is displayed
   * in a PDF reader. For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * textField.disableMultiline()
   * ```
   * This method will mark this text field as dirty. See
   * [[PDFTextField.setText]] for more details about what this means.
   */
  disableMultiline() {
    this.markAsDirty(), this.acroField.setFlagTo(xe.Multiline, !1);
  }
  /**
   * Returns `true` if this is a password text field. This means that the field
   * is intended for storing a secure password. See
   * [[PDFTextField.enablePassword]] and [[PDFTextField.disablePassword]].
   * For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * if (textField.isPassword()) console.log('Password is enabled')
   * ```
   * @returns Whether or not this is a password text field.
   */
  isPassword() {
    return this.acroField.hasFlag(xe.Password);
  }
  /**
   * Indicate that this text field is intended for storing a secure password.
   * For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * textField.enablePassword()
   * ```
   * Values entered into password text fields should not be displayed on the
   * screen by PDF readers. Most PDF readers will display the value as
   * asterisks or bullets. PDF readers should never store values entered by the
   * user into password text fields. Similarly, applications should not
   * write data to a password text field.
   *
   * **Please note that this method does not cause entered values to be
   * encrypted or secured in any way! It simply sets a flag that PDF software
   * and readers can access to determine the _purpose_ of this field.**
   */
  enablePassword() {
    this.acroField.setFlagTo(xe.Password, !0);
  }
  /**
   * Indicate that this text field is **not** intended for storing a secure
   * password. For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * textField.disablePassword()
   * ```
   */
  disablePassword() {
    this.acroField.setFlagTo(xe.Password, !1);
  }
  /**
   * Returns `true` if the contents of this text field represent a file path.
   * See [[PDFTextField.enableFileSelection]] and
   * [[PDFTextField.disableFileSelection]]. For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * if (textField.isFileSelector()) console.log('Is a file selector')
   * ```
   * @returns Whether or not this field should contain file paths.
   */
  isFileSelector() {
    return this.acroField.hasFlag(xe.FileSelect);
  }
  /**
   * Indicate that this text field is intended to store a file path. The
   * contents of the file stored at that path should be submitted as the value
   * of the field. For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * textField.enableFileSelection()
   * ```
   */
  enableFileSelection() {
    this.acroField.setFlagTo(xe.FileSelect, !0);
  }
  /**
   * Indicate that this text field is **not** intended to store a file path.
   * For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * textField.disableFileSelection()
   * ```
   */
  disableFileSelection() {
    this.acroField.setFlagTo(xe.FileSelect, !1);
  }
  /**
   * Returns `true` if the text entered in this field should be spell checked
   * by PDF readers. See [[PDFTextField.enableSpellChecking]] and
   * [[PDFTextField.disableSpellChecking]]. For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * if (textField.isSpellChecked()) console.log('Spell checking is enabled')
   * ```
   * @returns Whether or not this field should be spell checked.
   */
  isSpellChecked() {
    return !this.acroField.hasFlag(xe.DoNotSpellCheck);
  }
  /**
   * Allow PDF readers to spell check the text entered in this field.
   * For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * textField.enableSpellChecking()
   * ```
   */
  enableSpellChecking() {
    this.acroField.setFlagTo(xe.DoNotSpellCheck, !1);
  }
  /**
   * Do not allow PDF readers to spell check the text entered in this field.
   * For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * textField.disableSpellChecking()
   * ```
   */
  disableSpellChecking() {
    this.acroField.setFlagTo(xe.DoNotSpellCheck, !0);
  }
  /**
   * Returns `true` if PDF readers should allow the user to scroll the text
   * field when its contents do not fit within the field's view bounds. See
   * [[PDFTextField.enableScrolling]] and [[PDFTextField.disableScrolling]].
   * For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * if (textField.isScrollable()) console.log('Scrolling is enabled')
   * ```
   * @returns Whether or not the field is scrollable in PDF readers.
   */
  isScrollable() {
    return !this.acroField.hasFlag(xe.DoNotScroll);
  }
  /**
   * Allow PDF readers to present a scroll bar to the user when the contents
   * of this text field do not fit within its view bounds. For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * textField.enableScrolling()
   * ```
   * A horizontal scroll bar should be shown for singleline fields. A vertical
   * scroll bar should be shown for multiline fields.
   */
  enableScrolling() {
    this.acroField.setFlagTo(xe.DoNotScroll, !1);
  }
  /**
   * Do not allow PDF readers to present a scroll bar to the user when the
   * contents of this text field do not fit within its view bounds. For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * textField.disableScrolling()
   * ```
   */
  disableScrolling() {
    this.acroField.setFlagTo(xe.DoNotScroll, !0);
  }
  /**
   * Returns `true` if this is a combed text field. This means that the field
   * is split into `n` equal size cells with one character in each (where `n`
   * is equal to the max length of the text field). The result is that all
   * characters in this field are displayed an equal distance apart from one
   * another. See [[PDFTextField.enableCombing]] and
   * [[PDFTextField.disableCombing]]. For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * if (textField.isCombed()) console.log('Combing is enabled')
   * ```
   * Note that in order for a text field to be combed, the following must be
   * true (in addition to enabling combing):
   * * It must not be a multiline field (see [[PDFTextField.isMultiline]])
   * * It must not be a password field (see [[PDFTextField.isPassword]])
   * * It must not be a file selector field (see [[PDFTextField.isFileSelector]])
   * * It must have a max length defined (see [[PDFTextField.setMaxLength]])
   * @returns Whether or not this field is combed.
   */
  isCombed() {
    return this.acroField.hasFlag(xe.Comb) && !this.isMultiline() && !this.isPassword() && !this.isFileSelector() && this.getMaxLength() !== void 0;
  }
  /**
   * Split this field into `n` equal size cells with one character in each
   * (where `n` is equal to the max length of the text field). This will cause
   * all characters in the field to be displayed an equal distance apart from
   * one another. For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * textField.enableCombing()
   * ```
   *
   * In addition to calling this method, text fields must have a max length
   * defined in order to be combed (see [[PDFTextField.setMaxLength]]).
   *
   * This method will also call the following three methods internally:
   * * [[PDFTextField.disableMultiline]]
   * * [[PDFTextField.disablePassword]]
   * * [[PDFTextField.disableFileSelection]]
   *
   * This method will mark this text field as dirty. See
   * [[PDFTextField.setText]] for more details about what this means.
   */
  enableCombing() {
    this.getMaxLength() === void 0 && console.warn("PDFTextFields must have a max length in order to be combed"), this.markAsDirty(), this.disableMultiline(), this.disablePassword(), this.disableFileSelection(), this.acroField.setFlagTo(xe.Comb, !0);
  }
  /**
   * Turn off combing for this text field. For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * textField.disableCombing()
   * ```
   * See [[PDFTextField.isCombed]] and [[PDFTextField.enableCombing]] for more
   * information about what combing is.
   *
   * This method will mark this text field as dirty. See
   * [[PDFTextField.setText]] for more details about what this means.
   */
  disableCombing() {
    this.markAsDirty(), this.acroField.setFlagTo(xe.Comb, !1);
  }
  /**
   * Returns `true` if this text field contains rich text. See
   * [[PDFTextField.enableRichFormatting]] and
   * [[PDFTextField.disableRichFormatting]]. For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * if (textField.isRichFormatted()) console.log('Rich formatting enabled')
   * ```
   * @returns Whether or not this field contains rich text.
   */
  isRichFormatted() {
    return this.acroField.hasFlag(xe.RichText);
  }
  /**
   * Indicate that this field contains XFA data - or rich text. For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * textField.enableRichFormatting()
   * ```
   * Note that `pdf-lib` does not support reading or writing rich text fields.
   * Nor do most PDF readers and writers. Rich text fields are based on XFA
   * (XML Forms Architecture). Relatively few PDFs use rich text fields or XFA.
   * Unlike PDF itself, XFA is not an ISO standard. XFA has been deprecated in
   * PDF 2.0:
   * * https://en.wikipedia.org/wiki/XFA
   * * http://blog.pdfshareforms.com/pdf-2-0-release-bid-farewell-xfa-forms/
   */
  enableRichFormatting() {
    this.acroField.setFlagTo(xe.RichText, !0);
  }
  /**
   * Indicate that this is a standard text field that does not XFA data (rich
   * text). For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * textField.disableRichFormatting()
   * ```
   */
  disableRichFormatting() {
    this.acroField.setFlagTo(xe.RichText, !1);
  }
  /**
   * Show this text field on the specified page. For example:
   * ```js
   * const ubuntuFont = await pdfDoc.embedFont(ubuntuFontBytes)
   * const page = pdfDoc.addPage()
   *
   * const form = pdfDoc.getForm()
   * const textField = form.createTextField('best.gundam')
   * textField.setText('Exia')
   *
   * textField.addToPage(page, {
   *   x: 50,
   *   y: 75,
   *   width: 200,
   *   height: 100,
   *   textColor: rgb(1, 0, 0),
   *   backgroundColor: rgb(0, 1, 0),
   *   borderColor: rgb(0, 0, 1),
   *   borderWidth: 2,
   *   rotate: degrees(90),
   *   font: ubuntuFont,
   * })
   * ```
   * This will create a new widget for this text field.
   * @param page The page to which this text field widget should be added.
   * @param options The options to be used when adding this text field widget.
   */
  addToPage(e, t) {
    F(e, "page", [[Fe, "PDFPage"]]), tn(t), t || (t = {}), "textColor" in t || (t.textColor = se(0, 0, 0)), "backgroundColor" in t || (t.backgroundColor = se(1, 1, 1)), "borderColor" in t || (t.borderColor = se(0, 0, 0)), "borderWidth" in t || (t.borderWidth = 1);
    const i = this.createWidget({
      x: t.x ?? 0,
      y: t.y ?? 0,
      width: t.width ?? 200,
      height: t.height ?? 50,
      textColor: t.textColor,
      backgroundColor: t.backgroundColor,
      borderColor: t.borderColor,
      borderWidth: t.borderWidth ?? 0,
      rotate: t.rotate ?? H(0),
      hidden: t.hidden,
      page: e.ref
    }), n = this.doc.context.register(i.dict);
    this.acroField.addWidget(n);
    const a = t.font ?? this.doc.getForm().getDefaultFont();
    this.updateWidgetAppearance(i, a), e.node.addAnnot(n);
  }
  /**
   * Returns `true` if this text field has been marked as dirty, or if any of
   * this text field's widgets do not have an appearance stream. For example:
   * ```js
   * const textField = form.getTextField('some.text.field')
   * if (textField.needsAppearancesUpdate()) console.log('Needs update')
   * ```
   * @returns Whether or not this text field needs an appearance update.
   */
  needsAppearancesUpdate() {
    var t;
    if (this.isDirty())
      return !0;
    const e = this.acroField.getWidgets();
    for (let i = 0, n = e.length; i < n; i++)
      if (!(((t = e[i].getAppearances()) == null ? void 0 : t.normal) instanceof Ze))
        return !0;
    return !1;
  }
  /**
   * Update the appearance streams for each of this text field's widgets using
   * the default appearance provider for text fields. For example:
   * ```js
   * const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
   * const textField = form.getTextField('some.text.field')
   * textField.defaultUpdateAppearances(helvetica)
   * ```
   * @param font The font to be used for creating the appearance streams.
   */
  defaultUpdateAppearances(e) {
    F(e, "font", [[Ie, "PDFFont"]]), this.updateAppearances(e);
  }
  /**
   * Update the appearance streams for each of this text field's widgets using
   * the given appearance provider. If no `provider` is passed, the default
   * appearance provider for text fields will be used. For example:
   * ```js
   * const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
   * const textField = form.getTextField('some.text.field')
   * textField.updateAppearances(helvetica, (field, widget, font) => {
   *   ...
   *   return drawTextField(...)
   * })
   * ```
   * @param font The font to be used for creating the appearance streams.
   * @param provider Optionally, the appearance provider to be used for
   *                 generating the contents of the appearance streams.
   */
  updateAppearances(e, t) {
    F(e, "font", [[Ie, "PDFFont"]]), R(t, "provider", [Function]);
    const i = this.acroField.getWidgets();
    for (let n = 0, a = i.length; n < a; n++) {
      const s = i[n];
      this.updateWidgetAppearance(s, e, t);
    }
    this.markAsClean();
  }
  updateWidgetAppearance(e, t, i) {
    const a = hi((i ?? Rh)(this, e, t));
    this.updateWidgetAppearanceWithFont(e, t, a);
  }
}
Object.defineProperty(Ur, "of", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e, t) => new Ur(r, e, t)
});
var aa;
(function(r) {
  r.Courier = "Courier", r.CourierBold = "Courier-Bold", r.CourierOblique = "Courier-Oblique", r.CourierBoldOblique = "Courier-BoldOblique", r.Helvetica = "Helvetica", r.HelveticaBold = "Helvetica-Bold", r.HelveticaOblique = "Helvetica-Oblique", r.HelveticaBoldOblique = "Helvetica-BoldOblique", r.TimesRoman = "Times-Roman", r.TimesRomanBold = "Times-Bold", r.TimesRomanItalic = "Times-Italic", r.TimesRomanBoldItalic = "Times-BoldItalic", r.Symbol = "Symbol", r.ZapfDingbats = "ZapfDingbats";
})(aa || (aa = {}));
class ps {
  constructor(e, t) {
    Object.defineProperty(this, "acroForm", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "doc", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "dirtyFields", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "defaultFontCache", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "embedDefaultFont", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: () => this.doc.embedStandardFont(aa.Helvetica)
    }), F(e, "acroForm", [[Gt, "PDFAcroForm"]]), F(t, "doc", [[Se, "PDFDocument"]]), this.acroForm = e, this.doc = t, this.dirtyFields = /* @__PURE__ */ new Set(), this.defaultFontCache = it.populatedBy(this.embedDefaultFont);
  }
  /**
   * Returns `true` if this [[PDFForm]] has XFA data. Most PDFs with form
   * fields do not use XFA as it is not widely supported by PDF readers.
   *
   * > `pdf-lib` does not support creation, modification, or reading of XFA
   * > fields.
   *
   * For example:
   * ```js
   * const form = pdfDoc.getForm()
   * if (form.hasXFA()) console.log('PDF has XFA data')
   * ```
   * @returns Whether or not this form has XFA data.
   */
  hasXFA() {
    return this.acroForm.dict.has(x.of("XFA"));
  }
  /**
   * Disconnect the XFA data from this [[PDFForm]] (if any exists). This will
   * force readers to fallback to standard fields if the [[PDFDocument]]
   * contains any. For example:
   *
   * For example:
   * ```js
   * const form = pdfDoc.getForm()
   * form.deleteXFA()
   * ```
   */
  deleteXFA() {
    this.acroForm.dict.delete(x.of("XFA"));
  }
  /**
   * Get all fields contained in this [[PDFForm]]. For example:
   * ```js
   * const form = pdfDoc.getForm()
   * const fields = form.getFields()
   * fields.forEach(field => {
   *   const type = field.constructor.name
   *   const name = field.getName()
   *   console.log(`${type}: ${name}`)
   * })
   * ```
   * @returns An array of all fields in this form.
   */
  getFields() {
    const e = this.acroForm.getAllFields(), t = [];
    for (let i = 0, n = e.length; i < n; i++) {
      const [a, s] = e[i], o = Rm(a, s, this.doc);
      o && t.push(o);
    }
    return t;
  }
  /**
   * Get the field in this [[PDFForm]] with the given name. For example:
   * ```js
   * const form = pdfDoc.getForm()
   * const field = form.getFieldMaybe('Page1.Foo.Bar[0]')
   * if (field) console.log('Field exists!')
   * ```
   * @param name A fully qualified field name.
   * @returns The field with the specified name, if one exists.
   */
  getFieldMaybe(e) {
    F(e, "name", ["string"]);
    const t = this.getFields();
    for (let i = 0, n = t.length; i < n; i++) {
      const a = t[i];
      if (a.getName() === e)
        return a;
    }
  }
  /**
   * Get the field in this [[PDFForm]] with the given name. For example:
   * ```js
   * const form = pdfDoc.getForm()
   * const field = form.getField('Page1.Foo.Bar[0]')
   * ```
   * If no field exists with the provided name, an error will be thrown.
   * @param name A fully qualified field name.
   * @returns The field with the specified name.
   */
  getField(e) {
    F(e, "name", ["string"]);
    const t = this.getFieldMaybe(e);
    if (t)
      return t;
    throw new yh(e);
  }
  /**
   * Get the button field in this [[PDFForm]] with the given name. For example:
   * ```js
   * const form = pdfDoc.getForm()
   * const button = form.getButton('Page1.Foo.Button[0]')
   * ```
   * An error will be thrown if no field exists with the provided name, or if
   * the field exists but is not a button.
   * @param name A fully qualified button name.
   * @returns The button with the specified name.
   */
  getButton(e) {
    F(e, "name", ["string"]);
    const t = this.getField(e);
    if (t instanceof Wr)
      return t;
    throw new ar(e, Wr, t);
  }
  /**
   * Get the check box field in this [[PDFForm]] with the given name.
   * For example:
   * ```js
   * const form = pdfDoc.getForm()
   * const checkBox = form.getCheckBox('Page1.Foo.CheckBox[0]')
   * checkBox.check()
   * ```
   * An error will be thrown if no field exists with the provided name, or if
   * the field exists but is not a check box.
   * @param name A fully qualified check box name.
   * @returns The check box with the specified name.
   */
  getCheckBox(e) {
    F(e, "name", ["string"]);
    const t = this.getField(e);
    if (t instanceof fr)
      return t;
    throw new ar(e, fr, t);
  }
  /**
   * Get the dropdown field in this [[PDFForm]] with the given name.
   * For example:
   * ```js
   * const form = pdfDoc.getForm()
   * const dropdown = form.getDropdown('Page1.Foo.Dropdown[0]')
   * const options = dropdown.getOptions()
   * dropdown.select(options[0])
   * ```
   * An error will be thrown if no field exists with the provided name, or if
   * the field exists but is not a dropdown.
   * @param name A fully qualified dropdown name.
   * @returns The dropdown with the specified name.
   */
  getDropdown(e) {
    F(e, "name", ["string"]);
    const t = this.getField(e);
    if (t instanceof Lr)
      return t;
    throw new ar(e, Lr, t);
  }
  /**
   * Get the option list field in this [[PDFForm]] with the given name.
   * For example:
   * ```js
   * const form = pdfDoc.getForm()
   * const optionList = form.getOptionList('Page1.Foo.OptionList[0]')
   * const options = optionList.getOptions()
   * optionList.select(options[0])
   * ```
   * An error will be thrown if no field exists with the provided name, or if
   * the field exists but is not an option list.
   * @param name A fully qualified option list name.
   * @returns The option list with the specified name.
   */
  getOptionList(e) {
    F(e, "name", ["string"]);
    const t = this.getField(e);
    if (t instanceof Mr)
      return t;
    throw new ar(e, Mr, t);
  }
  /**
   * Get the radio group field in this [[PDFForm]] with the given name.
   * For example:
   * ```js
   * const form = pdfDoc.getForm()
   * const radioGroup = form.getRadioGroup('Page1.Foo.RadioGroup[0]')
   * const options = radioGroup.getOptions()
   * radioGroup.select(options[0])
   * ```
   * An error will be thrown if no field exists with the provided name, or if
   * the field exists but is not a radio group.
   * @param name A fully qualified radio group name.
   * @returns The radio group with the specified name.
   */
  getRadioGroup(e) {
    F(e, "name", ["string"]);
    const t = this.getField(e);
    if (t instanceof br)
      return t;
    throw new ar(e, br, t);
  }
  /**
   * Get the signature field in this [[PDFForm]] with the given name.
   * For example:
   * ```js
   * const form = pdfDoc.getForm()
   * const signature = form.getSignature('Page1.Foo.Signature[0]')
   * ```
   * An error will be thrown if no field exists with the provided name, or if
   * the field exists but is not a signature.
   * @param name A fully qualified signature name.
   * @returns The signature with the specified name.
   */
  getSignature(e) {
    F(e, "name", ["string"]);
    const t = this.getField(e);
    if (t instanceof Mi)
      return t;
    throw new ar(e, Mi, t);
  }
  /**
   * Get the text field in this [[PDFForm]] with the given name.
   * For example:
   * ```js
   * const form = pdfDoc.getForm()
   * const textField = form.getTextField('Page1.Foo.TextField[0]')
   * textField.setText('Are you designed to act or to be acted upon?')
   * ```
   * An error will be thrown if no field exists with the provided name, or if
   * the field exists but is not a text field.
   * @param name A fully qualified text field name.
   * @returns The text field with the specified name.
   */
  getTextField(e) {
    F(e, "name", ["string"]);
    const t = this.getField(e);
    if (t instanceof Ur)
      return t;
    throw new ar(e, Ur, t);
  }
  /**
   * Create a new button field in this [[PDFForm]] with the given name.
   * For example:
   * ```js
   * const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
   * const page = pdfDoc.addPage()
   *
   * const form = pdfDoc.getForm()
   * const button = form.createButton('cool.new.button')
   *
   * button.addToPage('Do Stuff', font, page)
   * ```
   * An error will be thrown if a field already exists with the provided name.
   * @param name The fully qualified name for the new button.
   * @returns The new button field.
   */
  createButton(e) {
    F(e, "name", ["string"]);
    const t = pi(e), i = this.findOrCreateNonTerminals(t.nonTerminal), n = Zt.create(this.doc.context);
    return n.setPartialName(t.terminal), mi(i, [n, n.ref], t.terminal), Wr.of(n, n.ref, this.doc);
  }
  /**
   * Create a new check box field in this [[PDFForm]] with the given name.
   * For example:
   * ```js
   * const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
   * const page = pdfDoc.addPage()
   *
   * const form = pdfDoc.getForm()
   * const checkBox = form.createCheckBox('cool.new.checkBox')
   *
   * checkBox.addToPage(page)
   * ```
   * An error will be thrown if a field already exists with the provided name.
   * @param name The fully qualified name for the new check box.
   * @returns The new check box field.
   */
  createCheckBox(e) {
    F(e, "name", ["string"]);
    const t = pi(e), i = this.findOrCreateNonTerminals(t.nonTerminal), n = $t.create(this.doc.context);
    return n.setPartialName(t.terminal), mi(i, [n, n.ref], t.terminal), fr.of(n, n.ref, this.doc);
  }
  /**
   * Create a new dropdown field in this [[PDFForm]] with the given name.
   * For example:
   * ```js
   * const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
   * const page = pdfDoc.addPage()
   *
   * const form = pdfDoc.getForm()
   * const dropdown = form.createDropdown('cool.new.dropdown')
   *
   * dropdown.addToPage(font, page)
   * ```
   * An error will be thrown if a field already exists with the provided name.
   * @param name The fully qualified name for the new dropdown.
   * @returns The new dropdown field.
   */
  createDropdown(e) {
    F(e, "name", ["string"]);
    const t = pi(e), i = this.findOrCreateNonTerminals(t.nonTerminal), n = Wt.create(this.doc.context);
    return n.setPartialName(t.terminal), mi(i, [n, n.ref], t.terminal), Lr.of(n, n.ref, this.doc);
  }
  /**
   * Create a new option list field in this [[PDFForm]] with the given name.
   * For example:
   * ```js
   * const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
   * const page = pdfDoc.addPage()
   *
   * const form = pdfDoc.getForm()
   * const optionList = form.createOptionList('cool.new.optionList')
   *
   * optionList.addToPage(font, page)
   * ```
   * An error will be thrown if a field already exists with the provided name.
   * @param name The fully qualified name for the new option list.
   * @returns The new option list field.
   */
  createOptionList(e) {
    F(e, "name", ["string"]);
    const t = pi(e), i = this.findOrCreateNonTerminals(t.nonTerminal), n = Vt.create(this.doc.context);
    return n.setPartialName(t.terminal), mi(i, [n, n.ref], t.terminal), Mr.of(n, n.ref, this.doc);
  }
  /**
   * Create a new radio group field in this [[PDFForm]] with the given name.
   * For example:
   * ```js
   * const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
   * const page = pdfDoc.addPage()
   *
   * const form = pdfDoc.getForm()
   * const radioGroup = form.createRadioGroup('cool.new.radioGroup')
   *
   * radioGroup.addOptionToPage('is-dog', page, { y: 0 })
   * radioGroup.addOptionToPage('is-cat', page, { y: 75 })
   * ```
   * An error will be thrown if a field already exists with the provided name.
   * @param name The fully qualified name for the new radio group.
   * @returns The new radio group field.
   */
  createRadioGroup(e) {
    F(e, "name", ["string"]);
    const t = pi(e), i = this.findOrCreateNonTerminals(t.nonTerminal), n = Kt.create(this.doc.context);
    return n.setPartialName(t.terminal), mi(i, [n, n.ref], t.terminal), br.of(n, n.ref, this.doc);
  }
  /**
   * Create a new text field in this [[PDFForm]] with the given name.
   * For example:
   * ```js
   * const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
   * const page = pdfDoc.addPage()
   *
   * const form = pdfDoc.getForm()
   * const textField = form.createTextField('cool.new.textField')
   *
   * textField.addToPage(font, page)
   * ```
   * An error will be thrown if a field already exists with the provided name.
   * @param name The fully qualified name for the new radio group.
   * @returns The new radio group field.
   */
  createTextField(e) {
    F(e, "name", ["string"]);
    const t = pi(e), i = this.findOrCreateNonTerminals(t.nonTerminal), n = qt.create(this.doc.context);
    return n.setPartialName(t.terminal), mi(i, [n, n.ref], t.terminal), Ur.of(n, n.ref, this.doc);
  }
  /**
   * Flatten all fields in this [[PDFForm]].
   *
   * Flattening a form field will take the current appearance for each of that
   * field's widgets and make them part of their page's content stream. All form
   * fields and annotations associated are then removed. Note that once a form
   * has been flattened its fields can no longer be accessed or edited.
   *
   * This operation is often used after filling form fields to ensure a
   * consistent appearance across different PDF readers and/or printers.
   * Another common use case is to copy a template document with form fields
   * into another document. In this scenario you would load the template
   * document, fill its fields, flatten it, and then copy its pages into the
   * recipient document - the filled fields will be copied over.
   *
   * For example:
   * ```js
   * const form = pdfDoc.getForm();
   * form.flatten();
   * ```
   */
  flatten(e = { updateFieldAppearances: !0 }) {
    e.updateFieldAppearances && this.updateFieldAppearances();
    const t = this.getFields();
    for (let i = 0, n = t.length; i < n; i++) {
      const a = t[i], s = a.acroField.getWidgets();
      for (let o = 0, l = s.length; o < l; o++)
        try {
          const c = s[o], u = this.findWidgetPage(c), f = this.findWidgetAppearanceRef(a, c), h = u.node.newXObject("FlatWidget", f), d = c.getRectangle(), b = [
            ye(),
            Xe(d.x, d.y),
            ...Qt({ ...d, rotation: 0 }),
            Cs(h),
            ve()
          ].filter(Boolean);
          u.pushOperators(...b);
        } catch (c) {
          console.error(c);
        }
      this.removeField(a);
    }
  }
  /**
   * Remove a field from this [[PDFForm]].
   *
   * For example:
   * ```js
   * const form = pdfDoc.getForm();
   * const ageField = form.getFields().find(x => x.getName() === 'Age');
   * form.removeField(ageField);
   * ```
   */
  removeField(e) {
    const t = e.acroField.getWidgets(), i = /* @__PURE__ */ new Set();
    for (let s = 0, o = t.length; s < o; s++)
      try {
        const l = t[s], c = this.findWidgetAppearanceRef(e, l), u = this.findWidgetPage(l);
        i.add(u), u.node.removeAnnot(c);
      } catch (l) {
        console.error(l);
      }
    i.forEach((s) => s.node.removeAnnot(e.ref)), this.acroForm.removeField(e.acroField);
    const n = e.acroField.normalizedEntries().Kids, a = n.size();
    for (let s = 0; s < a; s++) {
      const o = n.get(s);
      o instanceof te && this.doc.context.delete(o);
    }
    this.doc.context.delete(e.ref);
  }
  /**
   * Update the appearance streams for all widgets of all fields in this
   * [[PDFForm]]. Appearance streams will only be created for a widget if it
   * does not have any existing appearance streams, or the field's value has
   * changed (e.g. by calling [[PDFTextField.setText]] or
   * [[PDFDropdown.select]]).
   *
   * For example:
   * ```js
   * const courier = await pdfDoc.embedFont(StandardFonts.Courier)
   * const form = pdfDoc.getForm()
   * form.updateFieldAppearances(courier)
   * ```
   *
   * **IMPORTANT:** The default value for the `font` parameter is
   * [[StandardFonts.Helvetica]]. Note that this is a WinAnsi font. This means
   * that encoding errors will be thrown if any fields contain text with
   * characters outside the WinAnsi character set (the latin alphabet).
   *
   * Embedding a custom font and passing that as the `font`
   * parameter allows you to generate appearance streams with non WinAnsi
   * characters (assuming your custom font supports them).
   *
   * > **NOTE:** The [[PDFDocument.save]] method will call this method to
   * > update appearances automatically if a form was accessed via the
   * > [[PDFDocument.getForm]] method prior to saving.
   *
   * @param font Optionally, the font to use when creating new appearances.
   */
  updateFieldAppearances(e) {
    R(e, "font", [[Ie, "PDFFont"]]), e = e ?? this.getDefaultFont();
    const t = this.getFields();
    for (let i = 0, n = t.length; i < n; i++) {
      const a = t[i];
      a.needsAppearancesUpdate() && a.defaultUpdateAppearances(e);
    }
  }
  /**
   * Mark a field as dirty. This will cause its appearance streams to be
   * updated by [[PDFForm.updateFieldAppearances]].
   * ```js
   * const form = pdfDoc.getForm()
   * const field = form.getField('foo.bar')
   * form.markFieldAsDirty(field.ref)
   * ```
   * @param fieldRef The reference to the field that should be marked.
   */
  markFieldAsDirty(e) {
    R(e, "fieldRef", [[te, "PDFRef"]]), this.dirtyFields.add(e);
  }
  /**
   * Mark a field as dirty. This will cause its appearance streams to not be
   * updated by [[PDFForm.updateFieldAppearances]].
   * ```js
   * const form = pdfDoc.getForm()
   * const field = form.getField('foo.bar')
   * form.markFieldAsClean(field.ref)
   * ```
   * @param fieldRef The reference to the field that should be marked.
   */
  markFieldAsClean(e) {
    R(e, "fieldRef", [[te, "PDFRef"]]), this.dirtyFields.delete(e);
  }
  /**
   * Returns `true` is the specified field has been marked as dirty.
   * ```js
   * const form = pdfDoc.getForm()
   * const field = form.getField('foo.bar')
   * if (form.fieldIsDirty(field.ref)) console.log('Field is dirty')
   * ```
   * @param fieldRef The reference to the field that should be checked.
   * @returns Whether or not the specified field is dirty.
   */
  fieldIsDirty(e) {
    return R(e, "fieldRef", [[te, "PDFRef"]]), this.dirtyFields.has(e);
  }
  getDefaultFont() {
    return this.defaultFontCache.access();
  }
  findWidgetPage(e) {
    const t = e.P();
    let i = this.doc.getPages().find((n) => n.ref === t);
    if (i === void 0) {
      const n = this.doc.context.getObjectRef(e.dict);
      if (n === void 0)
        throw new Error("Could not find PDFRef for PDFObject");
      if (i = this.doc.findPageForAnnotationRef(n), i === void 0)
        throw new Error(`Could not find page for PDFRef ${n}`);
    }
    return i;
  }
  findWidgetAppearanceRef(e, t) {
    let i = t.getNormalAppearance();
    if (i instanceof $ && (e instanceof fr || e instanceof br)) {
      const n = e.acroField.getValue(), a = i.get(n) ?? i.get(x.of("Off"));
      a instanceof te && (i = a);
    }
    if (!(i instanceof te)) {
      const n = e.getName();
      throw new Error(`Failed to extract appearance ref for: ${n}`);
    }
    return i;
  }
  findOrCreateNonTerminals(e) {
    let t = [this.acroForm];
    for (let i = 0, n = e.length; i < n; i++) {
      const a = e[i];
      if (!a)
        throw new vh(a);
      const [s, o] = t, l = this.findNonTerminal(a, s);
      if (l)
        t = l;
      else {
        const c = Ht.create(this.doc.context);
        c.setPartialName(a), c.setParent(o);
        const u = this.doc.context.register(c.dict);
        s.addField(u), t = [c, u];
      }
    }
    return t;
  }
  findNonTerminal(e, t) {
    const i = t instanceof Gt ? this.acroForm.getFields() : Zs(t.Kids());
    for (let n = 0, a = i.length; n < a; n++) {
      const [s, o] = i[n];
      if (s.getPartialName() === e) {
        if (s instanceof Ht)
          return [s, o];
        throw new Hc(e);
      }
    }
  }
}
Object.defineProperty(ps, "of", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e) => new ps(r, e)
});
const Rm = (r, e, t) => {
  if (r instanceof Zt)
    return Wr.of(r, e, t);
  if (r instanceof $t)
    return fr.of(r, e, t);
  if (r instanceof Wt)
    return Lr.of(r, e, t);
  if (r instanceof Vt)
    return Mr.of(r, e, t);
  if (r instanceof qt)
    return Ur.of(r, e, t);
  if (r instanceof Kt)
    return br.of(r, e, t);
  if (r instanceof zi)
    return Mi.of(r, e, t);
}, pi = (r) => {
  if (r.length === 0)
    throw new Error("PDF field names must not be empty strings");
  const e = r.split(".");
  for (let t = 0, i = e.length; t < i; t++)
    if (e[t] === "")
      throw new Error(`Periods in PDF field names must be separated by at least one character: "${r}"`);
  return e.length === 1 ? { nonTerminal: [], terminal: e[0] } : {
    nonTerminal: e.slice(0, e.length - 1),
    terminal: e[e.length - 1]
  };
}, mi = ([r, e], [t, i], n) => {
  const a = r.normalizedEntries(), s = Zs("Kids" in a ? a.Kids : a.Fields);
  for (let o = 0, l = s.length; o < l; o++)
    if (s[o][0].getPartialName() === n)
      throw new Hc(n);
  r.addField(i), t.setParent(e);
}, jh = {
  "4A0": [4767.87, 6740.79],
  "2A0": [3370.39, 4767.87],
  A0: [2383.94, 3370.39],
  A1: [1683.78, 2383.94],
  A2: [1190.55, 1683.78],
  A3: [841.89, 1190.55],
  A4: [595.28, 841.89],
  A5: [419.53, 595.28],
  A6: [297.64, 419.53],
  A7: [209.76, 297.64],
  A8: [147.4, 209.76],
  A9: [104.88, 147.4],
  A10: [73.7, 104.88],
  B0: [2834.65, 4008.19],
  B1: [2004.09, 2834.65],
  B2: [1417.32, 2004.09],
  B3: [1000.63, 1417.32],
  B4: [708.66, 1000.63],
  B5: [498.9, 708.66],
  B6: [354.33, 498.9],
  B7: [249.45, 354.33],
  B8: [175.75, 249.45],
  B9: [124.72, 175.75],
  B10: [87.87, 124.72],
  C0: [2599.37, 3676.54],
  C1: [1836.85, 2599.37],
  C2: [1298.27, 1836.85],
  C3: [918.43, 1298.27],
  C4: [649.13, 918.43],
  C5: [459.21, 649.13],
  C6: [323.15, 459.21],
  C7: [229.61, 323.15],
  C8: [161.57, 229.61],
  C9: [113.39, 161.57],
  C10: [79.37, 113.39],
  RA0: [2437.8, 3458.27],
  RA1: [1729.13, 2437.8],
  RA2: [1218.9, 1729.13],
  RA3: [864.57, 1218.9],
  RA4: [609.45, 864.57],
  SRA0: [2551.18, 3628.35],
  SRA1: [1814.17, 2551.18],
  SRA2: [1275.59, 1814.17],
  SRA3: [907.09, 1275.59],
  SRA4: [637.8, 907.09],
  Executive: [521.86, 756],
  Folio: [612, 936],
  Legal: [612, 1008],
  Letter: [612, 792],
  Tabloid: [792, 1224]
};
var ms;
(function(r) {
  r[r.Fastest = 1 / 0] = "Fastest", r[r.Fast = 1500] = "Fast", r[r.Medium = 500] = "Medium", r[r.Slow = 100] = "Slow";
})(ms || (ms = {}));
class ic {
  constructor(e, t, i) {
    Object.defineProperty(this, "ref", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "doc", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "alreadyEmbedded", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: !1
    }), Object.defineProperty(this, "embedder", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.ref = e, this.doc = t, this.embedder = i;
  }
  /**
   * > **NOTE:** You probably don't need to call this method directly. The
   * > [[PDFDocument.save]] and [[PDFDocument.saveAsBase64]] methods will
   * > automatically ensure all embeddable files get embedded.
   *
   * Embed this embeddable file in its document.
   *
   * @returns Resolves when the embedding is complete.
   */
  async embed() {
    if (!this.alreadyEmbedded) {
      const e = await this.embedder.embedIntoContext(this.doc.context, this.ref);
      this.doc.catalog.has(x.of("Names")) || this.doc.catalog.set(x.of("Names"), this.doc.context.obj({}));
      const t = this.doc.catalog.lookup(x.of("Names"), $);
      t.has(x.of("EmbeddedFiles")) || t.set(x.of("EmbeddedFiles"), this.doc.context.obj({}));
      const i = t.lookup(x.of("EmbeddedFiles"), $);
      i.has(x.of("Names")) || i.set(x.of("Names"), this.doc.context.obj([]));
      const n = i.lookup(x.of("Names"), V);
      n.push(z.fromText(this.embedder.fileName)), n.push(e), this.doc.catalog.has(x.of("AF")) || this.doc.catalog.set(x.of("AF"), this.doc.context.obj([])), this.doc.catalog.lookup(x.of("AF"), V).push(e), this.alreadyEmbedded = !0;
    }
  }
}
Object.defineProperty(ic, "of", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e, t) => new ic(r, e, t)
});
class ws {
  constructor(e, t, i) {
    Object.defineProperty(this, "ref", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "doc", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "alreadyEmbedded", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: !1
    }), Object.defineProperty(this, "embedder", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.ref = e, this.doc = t, this.embedder = i;
  }
  /**
   * > **NOTE:** You probably don't need to call this method directly. The
   * > [[PDFDocument.save]] and [[PDFDocument.saveAsBase64]] methods will
   * > automatically ensure all JavaScripts get embedded.
   *
   * Embed this JavaScript in its document.
   *
   * @returns Resolves when the embedding is complete.
   */
  async embed() {
    if (!this.alreadyEmbedded) {
      const { catalog: e, context: t } = this.doc, i = await this.embedder.embedIntoContext(this.doc.context, this.ref);
      e.has(x.of("Names")) || e.set(x.of("Names"), t.obj({}));
      const n = e.lookup(x.of("Names"), $);
      n.has(x.of("JavaScript")) || n.set(x.of("JavaScript"), t.obj({}));
      const a = n.lookup(x.of("JavaScript"), $);
      a.has(x.of("Names")) || a.set(x.of("Names"), t.obj([]));
      const s = a.lookup(x.of("Names"), V);
      s.push(z.fromText(this.embedder.scriptName)), s.push(i), this.alreadyEmbedded = !0;
    }
  }
}
Object.defineProperty(ws, "of", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e, t) => new ws(r, e, t)
});
class Zc {
  static for(e, t) {
    return new Zc(e, t);
  }
  constructor(e, t) {
    Object.defineProperty(this, "script", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "scriptName", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.script = e, this.scriptName = t;
  }
  async embedIntoContext(e, t) {
    const i = e.obj({
      Type: "Action",
      S: "JavaScript",
      JS: z.fromText(this.script)
    });
    return t ? (e.assign(t, i), t) : e.register(i);
  }
}
const $0 = 512;
class Bm extends Qi {
  constructor(e, t, i) {
    super(i), Object.defineProperty(this, "stream", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "initialized", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "nextChunk", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "decrypt", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.stream = e, this.decrypt = t, this.nextChunk = null, this.initialized = !1;
  }
  readBlock() {
    let e;
    if (this.initialized ? e = this.nextChunk : (e = this.stream.getBytes($0), this.initialized = !0), !e || e.length === 0) {
      this.eof = !0;
      return;
    }
    this.nextChunk = this.stream.getBytes($0);
    const t = this.nextChunk && this.nextChunk.length > 0, i = this.decrypt;
    e = i(e, !t);
    const n = this.bufferLength, a = n + e.length;
    this.ensureBuffer(a).set(e, n), this.bufferLength = a;
  }
}
class Or {
  constructor(e) {
    Object.defineProperty(this, "s", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "a", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "b", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.a = 0, this.b = 0;
    const t = new Uint8Array(256), i = e.length;
    for (let n = 0; n < 256; ++n)
      t[n] = n;
    for (let n = 0, a = 0; n < 256; ++n) {
      const s = t[n];
      a = a + s + e[n % i] & 255, t[n] = t[a], t[a] = s;
    }
    this.s = t;
  }
  encryptBlock(e) {
    let t = this.a, i = this.b;
    const n = this.s, a = e.length, s = new Uint8Array(a);
    for (let o = 0; o < a; ++o) {
      t = t + 1 & 255;
      const l = n[t];
      i = i + l & 255;
      const c = n[i];
      n[t] = c, n[i] = l, s[o] = e[o] ^ n[l + c & 255];
    }
    return this.a = t, this.b = i, s;
  }
  decryptBlock(e) {
    return this.encryptBlock(e);
  }
  encrypt(e) {
    return this.encryptBlock(e);
  }
}
const wi = function() {
  const e = new Uint8Array([
    7,
    12,
    17,
    22,
    7,
    12,
    17,
    22,
    7,
    12,
    17,
    22,
    7,
    12,
    17,
    22,
    5,
    9,
    14,
    20,
    5,
    9,
    14,
    20,
    5,
    9,
    14,
    20,
    5,
    9,
    14,
    20,
    4,
    11,
    16,
    23,
    4,
    11,
    16,
    23,
    4,
    11,
    16,
    23,
    4,
    11,
    16,
    23,
    6,
    10,
    15,
    21,
    6,
    10,
    15,
    21,
    6,
    10,
    15,
    21,
    6,
    10,
    15,
    21
  ]), t = new Int32Array([
    -680876936,
    -389564586,
    606105819,
    -1044525330,
    -176418897,
    1200080426,
    -1473231341,
    -45705983,
    1770035416,
    -1958414417,
    -42063,
    -1990404162,
    1804603682,
    -40341101,
    -1502002290,
    1236535329,
    -165796510,
    -1069501632,
    643717713,
    -373897302,
    -701558691,
    38016083,
    -660478335,
    -405537848,
    568446438,
    -1019803690,
    -187363961,
    1163531501,
    -1444681467,
    -51403784,
    1735328473,
    -1926607734,
    -378558,
    -2022574463,
    1839030562,
    -35309556,
    -1530992060,
    1272893353,
    -155497632,
    -1094730640,
    681279174,
    -358537222,
    -722521979,
    76029189,
    -640364487,
    -421815835,
    530742520,
    -995338651,
    -198630844,
    1126891415,
    -1416354905,
    -57434055,
    1700485571,
    -1894986606,
    -1051523,
    -2054922799,
    1873313359,
    -30611744,
    -1560198380,
    1309151649,
    -145523070,
    -1120210379,
    718787259,
    -343485551
  ]);
  function i(n, a, s) {
    let o = 1732584193, l = -271733879, c = -1732584194, u = 271733878;
    const f = s + 72 & -64, h = new Uint8Array(f);
    let d, b;
    for (d = 0; d < s; ++d)
      h[d] = n[a++];
    h[d++] = 128;
    const p = f - 8;
    for (; d < p; )
      h[d++] = 0;
    h[d++] = s << 3 & 255, h[d++] = s >> 5 & 255, h[d++] = s >> 13 & 255, h[d++] = s >> 21 & 255, h[d++] = s >>> 29 & 255, h[d++] = 0, h[d++] = 0, h[d++] = 0;
    const m = new Int32Array(16);
    for (d = 0; d < f; ) {
      for (b = 0; b < 16; ++b, d += 4)
        m[b] = h[d] | h[d + 1] << 8 | h[d + 2] << 16 | h[d + 3] << 24;
      let g = o, S = l, y = c, v = u, A, k;
      for (b = 0; b < 64; ++b) {
        b < 16 ? (A = S & y | ~S & v, k = b) : b < 32 ? (A = v & S | ~v & y, k = 5 * b + 1 & 15) : b < 48 ? (A = S ^ y ^ v, k = 3 * b + 5 & 15) : (A = y ^ (S | ~v), k = 7 * b & 15);
        const _ = v, C = g + A + t[b] + m[k] | 0, P = e[b];
        v = y, y = S, S = S + (C << P | C >>> 32 - P) | 0, g = _;
      }
      o = o + g | 0, l = l + S | 0, c = c + y | 0, u = u + v | 0;
    }
    return new Uint8Array([
      o & 255,
      o >> 8 & 255,
      o >> 16 & 255,
      o >>> 24 & 255,
      l & 255,
      l >> 8 & 255,
      l >> 16 & 255,
      l >>> 24 & 255,
      c & 255,
      c >> 8 & 255,
      c >> 16 & 255,
      c >>> 24 & 255,
      u & 255,
      u >> 8 & 255,
      u >> 16 & 255,
      u >>> 24 & 255
    ]);
  }
  return i;
}();
class E {
  constructor(e, t) {
    Object.defineProperty(this, "low", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "high", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.high = e | 0, this.low = t | 0;
  }
  and(e) {
    this.high &= e.high, this.low &= e.low;
  }
  xor(e) {
    this.high ^= e.high, this.low ^= e.low;
  }
  or(e) {
    this.high |= e.high, this.low |= e.low;
  }
  shiftRight(e) {
    e >= 32 ? (this.low = this.high >>> e - 32 | 0, this.high = 0) : (this.low = this.low >>> e | this.high << 32 - e, this.high = this.high >>> e | 0);
  }
  shiftLeft(e) {
    e >= 32 ? (this.high = this.low << e - 32, this.low = 0) : (this.high = this.high << e | this.low >>> 32 - e, this.low <<= e);
  }
  rotateRight(e) {
    let t, i;
    e & 32 ? (i = this.low, t = this.high) : (t = this.low, i = this.high), e &= 31, this.low = t >>> e | i << 32 - e, this.high = i >>> e | t << 32 - e;
  }
  not() {
    this.high = ~this.high, this.low = ~this.low;
  }
  add(e) {
    const t = (this.low >>> 0) + (e.low >>> 0);
    let i = (this.high >>> 0) + (e.high >>> 0);
    t > 4294967295 && (i += 1), this.low = t | 0, this.high = i | 0;
  }
  copyTo(e, t) {
    e[t] = this.high >>> 24 & 255, e[t + 1] = this.high >> 16 & 255, e[t + 2] = this.high >> 8 & 255, e[t + 3] = this.high & 255, e[t + 4] = this.low >>> 24 & 255, e[t + 5] = this.low >> 16 & 255, e[t + 6] = this.low >> 8 & 255, e[t + 7] = this.low & 255;
  }
  assign(e) {
    this.high = e.high, this.low = e.low;
  }
}
const ki = /* @__PURE__ */ function() {
  function e(u, f) {
    return u >>> f | u << 32 - f;
  }
  function t(u, f, h) {
    return u & f ^ ~u & h;
  }
  function i(u, f, h) {
    return u & f ^ u & h ^ f & h;
  }
  function n(u) {
    return e(u, 2) ^ e(u, 13) ^ e(u, 22);
  }
  function a(u) {
    return e(u, 6) ^ e(u, 11) ^ e(u, 25);
  }
  function s(u) {
    return e(u, 7) ^ e(u, 18) ^ u >>> 3;
  }
  function o(u) {
    return e(u, 17) ^ e(u, 19) ^ u >>> 10;
  }
  const l = [
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ];
  function c(u, f, h) {
    let d = 1779033703, b = 3144134277, p = 1013904242, m = 2773480762, g = 1359893119, S = 2600822924, y = 528734635, v = 1541459225;
    const A = Math.ceil((h + 9) / 64) * 64, k = new Uint8Array(A);
    let _, C;
    for (_ = 0; _ < h; ++_)
      k[_] = u[f++];
    k[_++] = 128;
    const P = A - 8;
    for (; _ < P; )
      k[_++] = 0;
    k[_++] = 0, k[_++] = 0, k[_++] = 0, k[_++] = h >>> 29 & 255, k[_++] = h >> 21 & 255, k[_++] = h >> 13 & 255, k[_++] = h >> 5 & 255, k[_++] = h << 3 & 255;
    const D = new Uint32Array(64);
    for (_ = 0; _ < A; ) {
      for (C = 0; C < 16; ++C)
        D[C] = k[_] << 24 | k[_ + 1] << 16 | k[_ + 2] << 8 | k[_ + 3], _ += 4;
      for (C = 16; C < 64; ++C)
        D[C] = o(D[C - 2]) + D[C - 7] + s(D[C - 15]) + D[C - 16] | 0;
      let O = d, j = b, B = p, W = m, I = g, N = S, L = y, re = v, ce, de;
      for (C = 0; C < 64; ++C)
        ce = re + a(I) + t(I, N, L) + l[C] + D[C], de = n(O) + i(O, j, B), re = L, L = N, N = I, I = W + ce | 0, W = B, B = j, j = O, O = ce + de | 0;
      d = d + O | 0, b = b + j | 0, p = p + B | 0, m = m + W | 0, g = g + I | 0, S = S + N | 0, y = y + L | 0, v = v + re | 0;
    }
    return new Uint8Array([
      d >> 24 & 255,
      d >> 16 & 255,
      d >> 8 & 255,
      d & 255,
      b >> 24 & 255,
      b >> 16 & 255,
      b >> 8 & 255,
      b & 255,
      p >> 24 & 255,
      p >> 16 & 255,
      p >> 8 & 255,
      p & 255,
      m >> 24 & 255,
      m >> 16 & 255,
      m >> 8 & 255,
      m & 255,
      g >> 24 & 255,
      g >> 16 & 255,
      g >> 8 & 255,
      g & 255,
      S >> 24 & 255,
      S >> 16 & 255,
      S >> 8 & 255,
      S & 255,
      y >> 24 & 255,
      y >> 16 & 255,
      y >> 8 & 255,
      y & 255,
      v >> 24 & 255,
      v >> 16 & 255,
      v >> 8 & 255,
      v & 255
    ]);
  }
  return c;
}(), Ih = function() {
  function e(c, u, f, h, d) {
    c.assign(u), c.and(f), d.assign(u), d.not(), d.and(h), c.xor(d);
  }
  function t(c, u, f, h, d) {
    c.assign(u), c.and(f), d.assign(u), d.and(h), c.xor(d), d.assign(f), d.and(h), c.xor(d);
  }
  function i(c, u, f) {
    c.assign(u), c.rotateRight(28), f.assign(u), f.rotateRight(34), c.xor(f), f.assign(u), f.rotateRight(39), c.xor(f);
  }
  function n(c, u, f) {
    c.assign(u), c.rotateRight(14), f.assign(u), f.rotateRight(18), c.xor(f), f.assign(u), f.rotateRight(41), c.xor(f);
  }
  function a(c, u, f) {
    c.assign(u), c.rotateRight(1), f.assign(u), f.rotateRight(8), c.xor(f), f.assign(u), f.shiftRight(7), c.xor(f);
  }
  function s(c, u, f) {
    c.assign(u), c.rotateRight(19), f.assign(u), f.rotateRight(61), c.xor(f), f.assign(u), f.shiftRight(6), c.xor(f);
  }
  const o = [
    new E(1116352408, 3609767458),
    new E(1899447441, 602891725),
    new E(3049323471, 3964484399),
    new E(3921009573, 2173295548),
    new E(961987163, 4081628472),
    new E(1508970993, 3053834265),
    new E(2453635748, 2937671579),
    new E(2870763221, 3664609560),
    new E(3624381080, 2734883394),
    new E(310598401, 1164996542),
    new E(607225278, 1323610764),
    new E(1426881987, 3590304994),
    new E(1925078388, 4068182383),
    new E(2162078206, 991336113),
    new E(2614888103, 633803317),
    new E(3248222580, 3479774868),
    new E(3835390401, 2666613458),
    new E(4022224774, 944711139),
    new E(264347078, 2341262773),
    new E(604807628, 2007800933),
    new E(770255983, 1495990901),
    new E(1249150122, 1856431235),
    new E(1555081692, 3175218132),
    new E(1996064986, 2198950837),
    new E(2554220882, 3999719339),
    new E(2821834349, 766784016),
    new E(2952996808, 2566594879),
    new E(3210313671, 3203337956),
    new E(3336571891, 1034457026),
    new E(3584528711, 2466948901),
    new E(113926993, 3758326383),
    new E(338241895, 168717936),
    new E(666307205, 1188179964),
    new E(773529912, 1546045734),
    new E(1294757372, 1522805485),
    new E(1396182291, 2643833823),
    new E(1695183700, 2343527390),
    new E(1986661051, 1014477480),
    new E(2177026350, 1206759142),
    new E(2456956037, 344077627),
    new E(2730485921, 1290863460),
    new E(2820302411, 3158454273),
    new E(3259730800, 3505952657),
    new E(3345764771, 106217008),
    new E(3516065817, 3606008344),
    new E(3600352804, 1432725776),
    new E(4094571909, 1467031594),
    new E(275423344, 851169720),
    new E(430227734, 3100823752),
    new E(506948616, 1363258195),
    new E(659060556, 3750685593),
    new E(883997877, 3785050280),
    new E(958139571, 3318307427),
    new E(1322822218, 3812723403),
    new E(1537002063, 2003034995),
    new E(1747873779, 3602036899),
    new E(1955562222, 1575990012),
    new E(2024104815, 1125592928),
    new E(2227730452, 2716904306),
    new E(2361852424, 442776044),
    new E(2428436474, 593698344),
    new E(2756734187, 3733110249),
    new E(3204031479, 2999351573),
    new E(3329325298, 3815920427),
    new E(3391569614, 3928383900),
    new E(3515267271, 566280711),
    new E(3940187606, 3454069534),
    new E(4118630271, 4000239992),
    new E(116418474, 1914138554),
    new E(174292421, 2731055270),
    new E(289380356, 3203993006),
    new E(460393269, 320620315),
    new E(685471733, 587496836),
    new E(852142971, 1086792851),
    new E(1017036298, 365543100),
    new E(1126000580, 2618297676),
    new E(1288033470, 3409855158),
    new E(1501505948, 4234509866),
    new E(1607167915, 987167468),
    new E(1816402316, 1246189591)
  ];
  function l(c, u, f, h = !1) {
    let d, b, p, m, g, S, y, v;
    h ? (d = new E(3418070365, 3238371032), b = new E(1654270250, 914150663), p = new E(2438529370, 812702999), m = new E(355462360, 4144912697), g = new E(1731405415, 4290775857), S = new E(2394180231, 1750603025), y = new E(3675008525, 1694076839), v = new E(1203062813, 3204075428)) : (d = new E(1779033703, 4089235720), b = new E(3144134277, 2227873595), p = new E(1013904242, 4271175723), m = new E(2773480762, 1595750129), g = new E(1359893119, 2917565137), S = new E(2600822924, 725511199), y = new E(528734635, 4215389547), v = new E(1541459225, 327033209));
    const A = Math.ceil((f + 17) / 128) * 128, k = new Uint8Array(A);
    let _, C;
    for (_ = 0; _ < f; ++_)
      k[_] = c[u++];
    k[_++] = 128;
    const P = A - 16;
    for (; _ < P; )
      k[_++] = 0;
    k[_++] = 0, k[_++] = 0, k[_++] = 0, k[_++] = 0, k[_++] = 0, k[_++] = 0, k[_++] = 0, k[_++] = 0, k[_++] = 0, k[_++] = 0, k[_++] = 0, k[_++] = f >>> 29 & 255, k[_++] = f >> 21 & 255, k[_++] = f >> 13 & 255, k[_++] = f >> 5 & 255, k[_++] = f << 3 & 255;
    const D = new Array(80);
    for (_ = 0; _ < 80; _++)
      D[_] = new E(0, 0);
    let O = new E(0, 0), j = new E(0, 0), B = new E(0, 0), W = new E(0, 0), I = new E(0, 0), N = new E(0, 0), L = new E(0, 0), re = new E(0, 0);
    const ce = new E(0, 0), de = new E(0, 0), ue = new E(0, 0), pe = new E(0, 0);
    let ze;
    for (_ = 0; _ < A; ) {
      for (C = 0; C < 16; ++C)
        D[C].high = k[_] << 24 | k[_ + 1] << 16 | k[_ + 2] << 8 | k[_ + 3], D[C].low = k[_ + 4] << 24 | k[_ + 5] << 16 | k[_ + 6] << 8 | k[_ + 7], _ += 8;
      for (C = 16; C < 80; ++C)
        ze = D[C], s(ze, D[C - 2], pe), ze.add(D[C - 7]), a(ue, D[C - 15], pe), ze.add(ue), ze.add(D[C - 16]);
      for (O.assign(d), j.assign(b), B.assign(p), W.assign(m), I.assign(g), N.assign(S), L.assign(y), re.assign(v), C = 0; C < 80; ++C)
        ce.assign(re), n(ue, I, pe), ce.add(ue), e(ue, I, N, L, pe), ce.add(ue), ce.add(o[C]), ce.add(D[C]), i(de, O, pe), t(ue, O, j, B, pe), de.add(ue), ze = re, re = L, L = N, N = I, W.add(ce), I = W, W = B, B = j, j = O, ze.assign(ce), ze.add(de), O = ze;
      d.add(O), b.add(j), p.add(B), m.add(W), g.add(I), S.add(N), y.add(L), v.add(re);
    }
    let oe;
    return h ? (oe = new Uint8Array(48), d.copyTo(oe, 0), b.copyTo(oe, 8), p.copyTo(oe, 16), m.copyTo(oe, 24), g.copyTo(oe, 32), S.copyTo(oe, 40)) : (oe = new Uint8Array(64), d.copyTo(oe, 0), b.copyTo(oe, 8), p.copyTo(oe, 16), m.copyTo(oe, 24), g.copyTo(oe, 32), S.copyTo(oe, 40), y.copyTo(oe, 48), v.copyTo(oe, 56)), oe;
  }
  return l;
}();
function Nm(r, e, t) {
  return Ih(
    r,
    e,
    t,
    /* mode384 = */
    !0
  );
}
class jm {
  decryptBlock(e) {
    return e;
  }
  encrypt(e) {
    return e;
  }
}
class Pa {
  constructor() {
    if (Object.defineProperty(this, "_s", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "_keySize", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "_key", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "_cyclesOfRepetition", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "_inv_s", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "_mix", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "_mixCol", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "buffer", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "bufferPosition", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "bufferLength", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "iv", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.constructor === Pa)
      throw new Error("Cannot initialize AESBaseCipher.");
    this._s = new Uint8Array([
      99,
      124,
      119,
      123,
      242,
      107,
      111,
      197,
      48,
      1,
      103,
      43,
      254,
      215,
      171,
      118,
      202,
      130,
      201,
      125,
      250,
      89,
      71,
      240,
      173,
      212,
      162,
      175,
      156,
      164,
      114,
      192,
      183,
      253,
      147,
      38,
      54,
      63,
      247,
      204,
      52,
      165,
      229,
      241,
      113,
      216,
      49,
      21,
      4,
      199,
      35,
      195,
      24,
      150,
      5,
      154,
      7,
      18,
      128,
      226,
      235,
      39,
      178,
      117,
      9,
      131,
      44,
      26,
      27,
      110,
      90,
      160,
      82,
      59,
      214,
      179,
      41,
      227,
      47,
      132,
      83,
      209,
      0,
      237,
      32,
      252,
      177,
      91,
      106,
      203,
      190,
      57,
      74,
      76,
      88,
      207,
      208,
      239,
      170,
      251,
      67,
      77,
      51,
      133,
      69,
      249,
      2,
      127,
      80,
      60,
      159,
      168,
      81,
      163,
      64,
      143,
      146,
      157,
      56,
      245,
      188,
      182,
      218,
      33,
      16,
      255,
      243,
      210,
      205,
      12,
      19,
      236,
      95,
      151,
      68,
      23,
      196,
      167,
      126,
      61,
      100,
      93,
      25,
      115,
      96,
      129,
      79,
      220,
      34,
      42,
      144,
      136,
      70,
      238,
      184,
      20,
      222,
      94,
      11,
      219,
      224,
      50,
      58,
      10,
      73,
      6,
      36,
      92,
      194,
      211,
      172,
      98,
      145,
      149,
      228,
      121,
      231,
      200,
      55,
      109,
      141,
      213,
      78,
      169,
      108,
      86,
      244,
      234,
      101,
      122,
      174,
      8,
      186,
      120,
      37,
      46,
      28,
      166,
      180,
      198,
      232,
      221,
      116,
      31,
      75,
      189,
      139,
      138,
      112,
      62,
      181,
      102,
      72,
      3,
      246,
      14,
      97,
      53,
      87,
      185,
      134,
      193,
      29,
      158,
      225,
      248,
      152,
      17,
      105,
      217,
      142,
      148,
      155,
      30,
      135,
      233,
      206,
      85,
      40,
      223,
      140,
      161,
      137,
      13,
      191,
      230,
      66,
      104,
      65,
      153,
      45,
      15,
      176,
      84,
      187,
      22
    ]), this._inv_s = new Uint8Array([
      82,
      9,
      106,
      213,
      48,
      54,
      165,
      56,
      191,
      64,
      163,
      158,
      129,
      243,
      215,
      251,
      124,
      227,
      57,
      130,
      155,
      47,
      255,
      135,
      52,
      142,
      67,
      68,
      196,
      222,
      233,
      203,
      84,
      123,
      148,
      50,
      166,
      194,
      35,
      61,
      238,
      76,
      149,
      11,
      66,
      250,
      195,
      78,
      8,
      46,
      161,
      102,
      40,
      217,
      36,
      178,
      118,
      91,
      162,
      73,
      109,
      139,
      209,
      37,
      114,
      248,
      246,
      100,
      134,
      104,
      152,
      22,
      212,
      164,
      92,
      204,
      93,
      101,
      182,
      146,
      108,
      112,
      72,
      80,
      253,
      237,
      185,
      218,
      94,
      21,
      70,
      87,
      167,
      141,
      157,
      132,
      144,
      216,
      171,
      0,
      140,
      188,
      211,
      10,
      247,
      228,
      88,
      5,
      184,
      179,
      69,
      6,
      208,
      44,
      30,
      143,
      202,
      63,
      15,
      2,
      193,
      175,
      189,
      3,
      1,
      19,
      138,
      107,
      58,
      145,
      17,
      65,
      79,
      103,
      220,
      234,
      151,
      242,
      207,
      206,
      240,
      180,
      230,
      115,
      150,
      172,
      116,
      34,
      231,
      173,
      53,
      133,
      226,
      249,
      55,
      232,
      28,
      117,
      223,
      110,
      71,
      241,
      26,
      113,
      29,
      41,
      197,
      137,
      111,
      183,
      98,
      14,
      170,
      24,
      190,
      27,
      252,
      86,
      62,
      75,
      198,
      210,
      121,
      32,
      154,
      219,
      192,
      254,
      120,
      205,
      90,
      244,
      31,
      221,
      168,
      51,
      136,
      7,
      199,
      49,
      177,
      18,
      16,
      89,
      39,
      128,
      236,
      95,
      96,
      81,
      127,
      169,
      25,
      181,
      74,
      13,
      45,
      229,
      122,
      159,
      147,
      201,
      156,
      239,
      160,
      224,
      59,
      77,
      174,
      42,
      245,
      176,
      200,
      235,
      187,
      60,
      131,
      83,
      153,
      97,
      23,
      43,
      4,
      126,
      186,
      119,
      214,
      38,
      225,
      105,
      20,
      99,
      85,
      33,
      12,
      125
    ]), this._mix = new Uint32Array([
      0,
      235474187,
      470948374,
      303765277,
      941896748,
      908933415,
      607530554,
      708780849,
      1883793496,
      2118214995,
      1817866830,
      1649639237,
      1215061108,
      1181045119,
      1417561698,
      1517767529,
      3767586992,
      4003061179,
      4236429990,
      4069246893,
      3635733660,
      3602770327,
      3299278474,
      3400528769,
      2430122216,
      2664543715,
      2362090238,
      2193862645,
      2835123396,
      2801107407,
      3035535058,
      3135740889,
      3678124923,
      3576870512,
      3341394285,
      3374361702,
      3810496343,
      3977675356,
      4279080257,
      4043610186,
      2876494627,
      2776292904,
      3076639029,
      3110650942,
      2472011535,
      2640243204,
      2403728665,
      2169303058,
      1001089995,
      899835584,
      666464733,
      699432150,
      59727847,
      226906860,
      530400753,
      294930682,
      1273168787,
      1172967064,
      1475418501,
      1509430414,
      1942435775,
      2110667444,
      1876241833,
      1641816226,
      2910219766,
      2743034109,
      2976151520,
      3211623147,
      2505202138,
      2606453969,
      2302690252,
      2269728455,
      3711829422,
      3543599269,
      3240894392,
      3475313331,
      3843699074,
      3943906441,
      4178062228,
      4144047775,
      1306967366,
      1139781709,
      1374988112,
      1610459739,
      1975683434,
      2076935265,
      1775276924,
      1742315127,
      1034867998,
      866637845,
      566021896,
      800440835,
      92987698,
      193195065,
      429456164,
      395441711,
      1984812685,
      2017778566,
      1784663195,
      1683407248,
      1315562145,
      1080094634,
      1383856311,
      1551037884,
      101039829,
      135050206,
      437757123,
      337553864,
      1042385657,
      807962610,
      573804783,
      742039012,
      2531067453,
      2564033334,
      2328828971,
      2227573024,
      2935566865,
      2700099354,
      3001755655,
      3168937228,
      3868552805,
      3902563182,
      4203181171,
      4102977912,
      3736164937,
      3501741890,
      3265478751,
      3433712980,
      1106041591,
      1340463100,
      1576976609,
      1408749034,
      2043211483,
      2009195472,
      1708848333,
      1809054150,
      832877231,
      1068351396,
      766945465,
      599762354,
      159417987,
      126454664,
      361929877,
      463180190,
      2709260871,
      2943682380,
      3178106961,
      3009879386,
      2572697195,
      2538681184,
      2236228733,
      2336434550,
      3509871135,
      3745345300,
      3441850377,
      3274667266,
      3910161971,
      3877198648,
      4110568485,
      4211818798,
      2597806476,
      2497604743,
      2261089178,
      2295101073,
      2733856160,
      2902087851,
      3202437046,
      2968011453,
      3936291284,
      3835036895,
      4136440770,
      4169408201,
      3535486456,
      3702665459,
      3467192302,
      3231722213,
      2051518780,
      1951317047,
      1716890410,
      1750902305,
      1113818384,
      1282050075,
      1584504582,
      1350078989,
      168810852,
      67556463,
      371049330,
      404016761,
      841739592,
      1008918595,
      775550814,
      540080725,
      3969562369,
      3801332234,
      4035489047,
      4269907996,
      3569255213,
      3669462566,
      3366754619,
      3332740144,
      2631065433,
      2463879762,
      2160117071,
      2395588676,
      2767645557,
      2868897406,
      3102011747,
      3069049960,
      202008497,
      33778362,
      270040487,
      504459436,
      875451293,
      975658646,
      675039627,
      641025152,
      2084704233,
      1917518562,
      1615861247,
      1851332852,
      1147550661,
      1248802510,
      1484005843,
      1451044056,
      933301370,
      967311729,
      733156972,
      632953703,
      260388950,
      25965917,
      328671808,
      496906059,
      1206477858,
      1239443753,
      1543208500,
      1441952575,
      2144161806,
      1908694277,
      1675577880,
      1842759443,
      3610369226,
      3644379585,
      3408119516,
      3307916247,
      4011190502,
      3776767469,
      4077384432,
      4245618683,
      2809771154,
      2842737049,
      3144396420,
      3043140495,
      2673705150,
      2438237621,
      2203032232,
      2370213795
    ]), this._mixCol = new Uint8Array(256);
    for (let e = 0; e < 256; e++)
      e < 128 ? this._mixCol[e] = e << 1 : this._mixCol[e] = e << 1 ^ 27;
    this.buffer = new Uint8Array(16), this.bufferPosition = 0;
  }
  _expandKey(e) {
    throw new Error("Cannot call `_expandKey` on the base class");
  }
  _decrypt(e, t) {
    let i, n, a;
    const s = new Uint8Array(16);
    s.set(e);
    for (let o = 0, l = this._keySize; o < 16; ++o, ++l)
      s[o] ^= t[l];
    for (let o = this._cyclesOfRepetition - 1; o >= 1; --o) {
      i = s[13], s[13] = s[9], s[9] = s[5], s[5] = s[1], s[1] = i, i = s[14], n = s[10], s[14] = s[6], s[10] = s[2], s[6] = i, s[2] = n, i = s[15], n = s[11], a = s[7], s[15] = s[3], s[11] = i, s[7] = n, s[3] = a;
      for (let l = 0; l < 16; ++l)
        s[l] = this._inv_s[s[l]];
      for (let l = 0, c = o * 16; l < 16; ++l, ++c)
        s[l] ^= t[c];
      for (let l = 0; l < 16; l += 4) {
        const c = this._mix[s[l]], u = this._mix[s[l + 1]], f = this._mix[s[l + 2]], h = this._mix[s[l + 3]];
        i = c ^ u >>> 8 ^ u << 24 ^ f >>> 16 ^ f << 16 ^ h >>> 24 ^ h << 8, s[l] = i >>> 24 & 255, s[l + 1] = i >> 16 & 255, s[l + 2] = i >> 8 & 255, s[l + 3] = i & 255;
      }
    }
    i = s[13], s[13] = s[9], s[9] = s[5], s[5] = s[1], s[1] = i, i = s[14], n = s[10], s[14] = s[6], s[10] = s[2], s[6] = i, s[2] = n, i = s[15], n = s[11], a = s[7], s[15] = s[3], s[11] = i, s[7] = n, s[3] = a;
    for (let o = 0; o < 16; ++o)
      s[o] = this._inv_s[s[o]], s[o] ^= t[o];
    return s;
  }
  _encrypt(e, t) {
    const i = this._s;
    let n, a, s;
    const o = new Uint8Array(16);
    o.set(e);
    for (let l = 0; l < 16; ++l)
      o[l] ^= t[l];
    for (let l = 1; l < this._cyclesOfRepetition; l++) {
      for (let c = 0; c < 16; ++c)
        o[c] = i[o[c]];
      s = o[1], o[1] = o[5], o[5] = o[9], o[9] = o[13], o[13] = s, s = o[2], a = o[6], o[2] = o[10], o[6] = o[14], o[10] = s, o[14] = a, s = o[3], a = o[7], n = o[11], o[3] = o[15], o[7] = s, o[11] = a, o[15] = n;
      for (let c = 0; c < 16; c += 4) {
        const u = o[c + 0], f = o[c + 1], h = o[c + 2], d = o[c + 3];
        n = u ^ f ^ h ^ d, o[c + 0] ^= n ^ this._mixCol[u ^ f], o[c + 1] ^= n ^ this._mixCol[f ^ h], o[c + 2] ^= n ^ this._mixCol[h ^ d], o[c + 3] ^= n ^ this._mixCol[d ^ u];
      }
      for (let c = 0, u = l * 16; c < 16; ++c, ++u)
        o[c] ^= t[u];
    }
    for (let l = 0; l < 16; ++l)
      o[l] = i[o[l]];
    s = o[1], o[1] = o[5], o[5] = o[9], o[9] = o[13], o[13] = s, s = o[2], a = o[6], o[2] = o[10], o[6] = o[14], o[10] = s, o[14] = a, s = o[3], a = o[7], n = o[11], o[3] = o[15], o[7] = s, o[11] = a, o[15] = n;
    for (let l = 0, c = this._keySize; l < 16; ++l, ++c)
      o[l] ^= t[c];
    return o;
  }
  _decryptBlock2(e, t) {
    const i = e.length;
    let n = this.buffer, a = this.bufferPosition;
    const s = [];
    let o = this.iv;
    for (let u = 0; u < i; ++u) {
      if (n[a] = e[u], ++a, a < 16)
        continue;
      const f = this._decrypt(n, this._key);
      for (let h = 0; h < 16; ++h)
        f[h] ^= o[h];
      o = n, s.push(f), n = new Uint8Array(16), a = 0;
    }
    if (this.buffer = n, this.bufferLength = a, this.iv = o, s.length === 0)
      return new Uint8Array(0);
    let l = 16 * s.length;
    if (t) {
      const u = s[s.length - 1];
      let f = u[15];
      if (f <= 16) {
        for (let h = 15, d = 16 - f; h >= d; --h)
          if (u[h] !== f) {
            f = 0;
            break;
          }
        l -= f, s[s.length - 1] = u.subarray(0, 16 - f);
      }
    }
    const c = new Uint8Array(l);
    for (let u = 0, f = 0, h = s.length; u < h; ++u, f += 16)
      c.set(s[u], f);
    return c;
  }
  decryptBlock(e, t, i) {
    const n = e.length, a = this.buffer;
    let s = this.bufferPosition;
    if (i)
      this.iv = i;
    else {
      for (let o = 0; s < 16 && o < n; ++o, ++s)
        a[s] = e[o];
      if (s < 16)
        return this.bufferLength = s, new Uint8Array(0);
      this.iv = a, e = e.subarray(16);
    }
    return this.buffer = new Uint8Array(16), this.bufferLength = 0, this.decryptBlock = this._decryptBlock2, this.decryptBlock(e, t);
  }
  encrypt(e, t) {
    const i = e.length;
    let n = this.buffer, a = this.bufferPosition;
    const s = [];
    t || (t = new Uint8Array(16));
    for (let c = 0; c < i; ++c) {
      if (n[a] = e[c], ++a, a < 16)
        continue;
      for (let f = 0; f < 16; ++f)
        n[f] ^= t[f];
      const u = this._encrypt(n, this._key);
      t = u, s.push(u), n = new Uint8Array(16), a = 0;
    }
    if (this.buffer = n, this.bufferLength = a, this.iv = t, s.length === 0)
      return new Uint8Array(0);
    const o = 16 * s.length, l = new Uint8Array(o);
    for (let c = 0, u = 0, f = s.length; c < f; ++c, u += 16)
      l.set(s[c], u);
    return l;
  }
}
class zh extends Pa {
  constructor(e) {
    super(), Object.defineProperty(this, "_rcon", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this._cyclesOfRepetition = 10, this._keySize = 160, this._rcon = new Uint8Array([
      141,
      1,
      2,
      4,
      8,
      16,
      32,
      64,
      128,
      27,
      54,
      108,
      216,
      171,
      77,
      154,
      47,
      94,
      188,
      99,
      198,
      151,
      53,
      106,
      212,
      179,
      125,
      250,
      239,
      197,
      145,
      57,
      114,
      228,
      211,
      189,
      97,
      194,
      159,
      37,
      74,
      148,
      51,
      102,
      204,
      131,
      29,
      58,
      116,
      232,
      203,
      141,
      1,
      2,
      4,
      8,
      16,
      32,
      64,
      128,
      27,
      54,
      108,
      216,
      171,
      77,
      154,
      47,
      94,
      188,
      99,
      198,
      151,
      53,
      106,
      212,
      179,
      125,
      250,
      239,
      197,
      145,
      57,
      114,
      228,
      211,
      189,
      97,
      194,
      159,
      37,
      74,
      148,
      51,
      102,
      204,
      131,
      29,
      58,
      116,
      232,
      203,
      141,
      1,
      2,
      4,
      8,
      16,
      32,
      64,
      128,
      27,
      54,
      108,
      216,
      171,
      77,
      154,
      47,
      94,
      188,
      99,
      198,
      151,
      53,
      106,
      212,
      179,
      125,
      250,
      239,
      197,
      145,
      57,
      114,
      228,
      211,
      189,
      97,
      194,
      159,
      37,
      74,
      148,
      51,
      102,
      204,
      131,
      29,
      58,
      116,
      232,
      203,
      141,
      1,
      2,
      4,
      8,
      16,
      32,
      64,
      128,
      27,
      54,
      108,
      216,
      171,
      77,
      154,
      47,
      94,
      188,
      99,
      198,
      151,
      53,
      106,
      212,
      179,
      125,
      250,
      239,
      197,
      145,
      57,
      114,
      228,
      211,
      189,
      97,
      194,
      159,
      37,
      74,
      148,
      51,
      102,
      204,
      131,
      29,
      58,
      116,
      232,
      203,
      141,
      1,
      2,
      4,
      8,
      16,
      32,
      64,
      128,
      27,
      54,
      108,
      216,
      171,
      77,
      154,
      47,
      94,
      188,
      99,
      198,
      151,
      53,
      106,
      212,
      179,
      125,
      250,
      239,
      197,
      145,
      57,
      114,
      228,
      211,
      189,
      97,
      194,
      159,
      37,
      74,
      148,
      51,
      102,
      204,
      131,
      29,
      58,
      116,
      232,
      203,
      141
    ]), this._key = this._expandKey(e);
  }
  _expandKey(e) {
    const i = this._s, n = this._rcon, a = new Uint8Array(176);
    a.set(e);
    for (let s = 16, o = 1; s < 176; ++o) {
      let l = a[s - 3], c = a[s - 2], u = a[s - 1], f = a[s - 4];
      l = i[l], c = i[c], u = i[u], f = i[f], l ^= n[o];
      for (let h = 0; h < 4; ++h)
        a[s] = l ^= a[s - 16], s++, a[s] = c ^= a[s - 16], s++, a[s] = u ^= a[s - 16], s++, a[s] = f ^= a[s - 16], s++;
    }
    return a;
  }
}
class sa extends Pa {
  constructor(e) {
    super(), this._cyclesOfRepetition = 14, this._keySize = 224, this._key = this._expandKey(e);
  }
  _expandKey(e) {
    const i = this._s, n = new Uint8Array(240);
    n.set(e);
    let a = 1, s = 0, o = 0, l = 0, c = 0;
    for (let u = 32, f = 1; u < 240; ++f) {
      u % 32 === 16 ? (s = i[s], o = i[o], l = i[l], c = i[c]) : u % 32 === 0 && (s = n[u - 3], o = n[u - 2], l = n[u - 1], c = n[u - 4], s = i[s], o = i[o], l = i[l], c = i[c], s ^= a, (a <<= 1) >= 256 && (a = (a ^ 27) & 255));
      for (let h = 0; h < 4; ++h)
        n[u] = s ^= n[u - 32], u++, n[u] = o ^= n[u - 32], u++, n[u] = l ^= n[u - 32], u++, n[u] = c ^= n[u - 32], u++;
    }
    return n;
  }
}
class Im {
  checkOwnerPassword(e, t, i, n) {
    const a = new Uint8Array(e.length + 56);
    a.set(e, 0), a.set(t, e.length), a.set(i, e.length + t.length);
    const s = ki(a, 0, a.length);
    return Ln(s, n);
  }
  checkUserPassword(e, t, i) {
    const n = new Uint8Array(e.length + 8);
    n.set(e, 0), n.set(t, e.length);
    const a = ki(n, 0, n.length);
    return Ln(a, i);
  }
  getOwnerKey(e, t, i, n) {
    const a = new Uint8Array(e.length + 56);
    a.set(e, 0), a.set(t, e.length), a.set(i, e.length + t.length);
    const s = ki(a, 0, a.length);
    return new sa(s).decryptBlock(n, !1, new Uint8Array(16));
  }
  getUserKey(e, t, i) {
    const n = new Uint8Array(e.length + 8);
    n.set(e, 0), n.set(t, e.length);
    const a = ki(n, 0, n.length);
    return new sa(a).decryptBlock(i, !1, new Uint8Array(16));
  }
}
class zm {
  calculatePDF20Hash(e, t, i) {
    let n = ki(t, 0, t.length).subarray(0, 32), a = new Uint8Array([0]), s = 0;
    for (; s < 64 || a[a.length - 1] > s - 32; ) {
      const o = e.length + n.length + i.length, l = new Uint8Array(o);
      let c = 0;
      l.set(e, c), c += e.length, l.set(n, c), c += n.length, l.set(i, c);
      const u = new Uint8Array(o * 64);
      for (let d = 0, b = 0; d < 64; d++, b += o)
        u.set(l, b);
      a = new zh(n.subarray(0, 16)).encrypt(u, n.subarray(16, 32));
      const h = a.slice(0, 16).reduce((d, b) => d + b, 0) % 3;
      h === 0 ? n = ki(a, 0, a.length) : h === 1 ? n = Nm(a, 0, a.length) : h === 2 && (n = Ih(a, 0, a.length)), s++;
    }
    return n.subarray(0, 32);
  }
  hash(e, t, i) {
    return this.calculatePDF20Hash(e, t, i);
  }
  checkOwnerPassword(e, t, i, n) {
    const a = new Uint8Array(e.length + 56);
    a.set(e, 0), a.set(t, e.length), a.set(i, e.length + t.length);
    const s = this.calculatePDF20Hash(e, a, i);
    return Ln(s, n);
  }
  checkUserPassword(e, t, i) {
    const n = new Uint8Array(e.length + 8);
    n.set(e, 0), n.set(t, e.length);
    const a = this.calculatePDF20Hash(e, n, new Uint8Array());
    return Ln(a, i);
  }
  getOwnerKey(e, t, i, n) {
    const a = new Uint8Array(e.length + 56);
    a.set(e, 0), a.set(t, e.length), a.set(i, e.length + t.length);
    const s = this.calculatePDF20Hash(e, a, i);
    return new sa(s).decryptBlock(n, !1, new Uint8Array(16));
  }
  getUserKey(e, t, i) {
    const n = new Uint8Array(e.length + 8);
    n.set(e, 0), n.set(t, e.length);
    const a = this.calculatePDF20Hash(e, n, new Uint8Array());
    return new sa(a).decryptBlock(i, !1, new Uint8Array(16));
  }
}
class W0 {
  constructor(e, t) {
    Object.defineProperty(this, "StringCipherConstructor", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "StreamCipherConstructor", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.StringCipherConstructor = e, this.StreamCipherConstructor = t;
  }
  createStream(e, t) {
    const i = this.StreamCipherConstructor();
    return new Bm(e, function(a, s) {
      return i.decryptBlock(a, s);
    }, t);
  }
  decryptString(e) {
    const t = this.StringCipherConstructor();
    let i = kn(e);
    return i = t.decryptBlock(i, !0), vn(i);
  }
  decryptBytes(e) {
    return this.StringCipherConstructor().decryptBlock(e, !0);
  }
  encryptString(e) {
    const t = this.StringCipherConstructor();
    if (t instanceof Pa) {
      const a = 16 - e.length % 16;
      e += String.fromCharCode(a).repeat(a);
      const s = new Uint8Array(16);
      if (typeof crypto < "u")
        crypto.getRandomValues(s);
      else
        for (let c = 0; c < 16; c++)
          s[c] = Math.floor(256 * Math.random());
      let o = kn(e);
      o = t.encrypt(o, s);
      const l = new Uint8Array(16 + o.length);
      return l.set(s), l.set(o, 16), vn(l);
    }
    let i = kn(e);
    return i = t.encrypt(i), vn(i);
  }
}
class Lm {
  constructor(e, t, i) {
    var m;
    Object.defineProperty(this, "encryptMetadata", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "encryptionKey", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "algorithm", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "filterName", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "dict", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "cf", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "stmf", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "strf", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "eff", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "defaultPasswordBytes", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: new Uint8Array([
        40,
        191,
        78,
        94,
        78,
        117,
        138,
        65,
        100,
        0,
        78,
        86,
        255,
        250,
        1,
        8,
        46,
        46,
        0,
        182,
        208,
        104,
        62,
        128,
        47,
        12,
        169,
        254,
        100,
        83,
        105,
        122
      ])
    }), Object.defineProperty(this, "identityName", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: x.of("Identity")
    });
    const n = e.get(x.of("Filter"));
    if (n.asString() !== "/Standard")
      throw new Error("unknown encryption method");
    this.filterName = n.asString(), this.dict = e;
    const a = e.get(x.of("V")).asNumber();
    if (!Number.isInteger(a) || a !== 1 && a !== 2 && a !== 4 && a !== 5)
      throw new Error("unsupported encryption algorithm");
    this.algorithm = a;
    let s = e.get(x.of("Length")).asNumber();
    if (!s)
      if (a <= 3)
        s = 40;
      else {
        const g = e.get(x.of("CF")), S = e.get(x.of("StmF"));
        if (g instanceof $ && S instanceof x) {
          g.suppressEncryption = !0;
          const y = g.get(x.of(S.asString()));
          let v = null;
          y && (v = y.get(x.of("Length"))), s = v && v.asNumber() || 128, s < 40 && (s <<= 3);
        }
      }
    if (!Number.isInteger(s) || s < 40 || s % 8 !== 0)
      throw new Error("invalid key length");
    const o = e.get(x.of("O")).asBytes(), l = e.get(x.of("U")).asBytes(), c = o.subarray(0, 32), u = l.subarray(0, 32), f = e.get(x.of("P")).asNumber(), h = e.get(x.of("R")).asNumber(), d = (a === 4 || a === 5) && ((m = e.get(x.of("EncryptMetadata"))) == null ? void 0 : m.asBoolean()) !== !1;
    this.encryptMetadata = d;
    let b;
    if (i) {
      if (h === 6)
        try {
          i = unescape(encodeURIComponent(i));
        } catch {
          console.warn("CipherTransformFactory: Unable to convert UTF8 encoded password.");
        }
      b = kn(i);
    }
    let p;
    if (a !== 5)
      p = this.prepareKeyData(t, b, c, u, f, h, s, d);
    else {
      const g = o.subarray(32, 40), S = o.subarray(40, 48), y = l.subarray(0, 48), v = l.subarray(32, 40), A = l.subarray(40, 48), k = e.get(x.of("OE")).asBytes(), _ = e.get(x.of("UE")).asBytes(), C = e.get(x.of("Perms")).asBytes();
      p = this.createEncryptionKey20(h, b, c, g, S, y, u, v, A, k, _, C);
    }
    if (!p && !i)
      throw new Error("NEEDS PASSWORD");
    if (!p && i) {
      const g = this.decodeUserPassword(b, c, h, s);
      p = this.prepareKeyData(t, g, c, u, f, h, s, d);
    }
    if (!p)
      throw new Error("Password incorrect");
    if (this.encryptionKey = p, a >= 4) {
      const g = e.get(x.of("CF"));
      g instanceof $ && (g.suppressEncryption = !0), this.cf = g, this.stmf = e.get(x.of("StmF")) || this.identityName, this.strf = e.get(x.of("StrF")) || this.identityName, this.eff = e.get(x.of("EFF")) || this.stmf;
    }
  }
  createCipherTransform(e, t) {
    if (this.algorithm === 4 || this.algorithm === 5)
      return new W0(this.buildCipherConstructor(this.cf, this.strf, e, t, this.encryptionKey), this.buildCipherConstructor(this.cf, this.stmf, e, t, this.encryptionKey));
    const i = this.buildObjectKey(
      e,
      t,
      this.encryptionKey,
      /* isAes = */
      !1
    ), n = function() {
      return new Or(i);
    };
    return new W0(n, n);
  }
  createEncryptionKey20(e, t, i, n, a, s, o, l, c, u, f, h) {
    if (t) {
      const b = Math.min(127, t.length);
      t = t.subarray(0, b);
    } else
      t = new Uint8Array();
    let d;
    return e === 6 ? d = new zm() : d = new Im(), d.checkUserPassword(t, l, o) ? d.getUserKey(t, c, f) : t.length && d.checkOwnerPassword(t, n, s, i) ? d.getOwnerKey(t, a, s, u) : null;
  }
  prepareKeyData(e, t, i, n, a, s, o, l) {
    const c = 40 + i.length + e.length, u = new Uint8Array(c);
    let f = 0, h, d;
    if (t)
      for (d = Math.min(32, t.length); f < d; ++f)
        u[f] = t[f];
    for (h = 0; f < 32; )
      u[f++] = this.defaultPasswordBytes[h++];
    for (h = 0, d = i.length; h < d; ++h)
      u[f++] = i[h];
    for (u[f++] = a & 255, u[f++] = a >> 8 & 255, u[f++] = a >> 16 & 255, u[f++] = a >>> 24 & 255, h = 0, d = e.length; h < d; ++h)
      u[f++] = e[h];
    s >= 4 && !l && (u[f++] = 255, u[f++] = 255, u[f++] = 255, u[f++] = 255);
    let b = wi(u, 0, f);
    const p = o >> 3;
    if (s >= 3)
      for (h = 0; h < 50; ++h)
        b = wi(b, 0, p);
    const m = b.subarray(0, p);
    let g, S;
    if (s >= 3) {
      for (f = 0; f < 32; ++f)
        u[f] = this.defaultPasswordBytes[f];
      for (h = 0, d = e.length; h < d; ++h)
        u[f++] = e[h];
      g = new Or(m), S = g.encryptBlock(wi(u, 0, f)), d = m.length;
      const y = new Uint8Array(d);
      for (h = 1; h <= 19; ++h) {
        for (let v = 0; v < d; ++v)
          y[v] = m[v] ^ h;
        g = new Or(y), S = g.encryptBlock(S);
      }
      for (h = 0, d = S.length; h < d; ++h)
        if (n[h] !== S[h])
          return null;
    } else
      for (g = new Or(m), S = g.encryptBlock(this.defaultPasswordBytes), h = 0, d = S.length; h < d; ++h)
        if (n[h] !== S[h])
          return null;
    return m;
  }
  decodeUserPassword(e, t, i, n) {
    const a = new Uint8Array(32);
    let s = 0;
    const o = Math.min(32, e.length);
    for (; s < o; ++s)
      a[s] = e[s];
    let l = 0;
    for (; s < 32; )
      a[s++] = this.defaultPasswordBytes[l++];
    let c = wi(a, 0, s);
    const u = n >> 3;
    if (i >= 3)
      for (l = 0; l < 50; ++l)
        c = wi(c, 0, c.length);
    let f, h;
    if (i >= 3) {
      h = t;
      const d = new Uint8Array(u);
      for (l = 19; l >= 0; l--) {
        for (let b = 0; b < u; ++b)
          d[b] = c[b] ^ l;
        f = new Or(d), h = f.encryptBlock(h);
      }
    } else
      f = new Or(c.subarray(0, u)), h = f.encryptBlock(t);
    return h;
  }
  buildObjectKey(e, t, i, n = !1) {
    const a = new Uint8Array(i.length + 9), s = i.length;
    let o;
    for (o = 0; o < s; ++o)
      a[o] = i[o];
    return a[o++] = e & 255, a[o++] = e >> 8 & 255, a[o++] = e >> 16 & 255, a[o++] = t & 255, a[o++] = t >> 8 & 255, n && (a[o++] = 115, a[o++] = 65, a[o++] = 108, a[o++] = 84), wi(a, 0, o).subarray(0, Math.min(i.length + 5, 16));
  }
  buildCipherConstructor(e, t, i, n, a) {
    if (!(t instanceof x))
      throw new Error("Invalid crypt filter name.");
    const s = e.get(x.of(t.asString().replace("/", "")));
    let o;
    if (s != null && (o = s.get(x.of("CFM"))), !o || o.asString() === "/None")
      return function() {
        return new jm();
      };
    if (o.asString() === "/V2")
      return () => new Or(this.buildObjectKey(
        i,
        n,
        a,
        /* isAes = */
        !1
      ));
    if (o.asString() === "/AESV2")
      return () => new zh(this.buildObjectKey(
        i,
        n,
        a,
        /* isAes = */
        !0
      ));
    if (o.asString() === "/AESV3")
      return () => new sa(a);
    throw new Error("Unknown crypto method");
  }
}
class Se {
  /**
   * Load an existing [[PDFDocument]]. The input data can be provided in
   * multiple formats:
   *
   * | Type          | Contents                                               |
   * | ------------- | ------------------------------------------------------ |
   * | `string`      | A base64 encoded string (or data URI) containing a PDF |
   * | `Uint8Array`  | The raw bytes of a PDF                                 |
   * | `ArrayBuffer` | The raw bytes of a PDF                                 |
   *
   * For example:
   * ```js
   * import { PDFDocument } from 'pdf-lib'
   *
   * // pdf=string
   * const base64 =
   *  'JVBERi0xLjcKJYGBgYEKCjUgMCBvYmoKPDwKL0ZpbHRlciAvRmxhdGVEZWNvZGUKL0xlbm' +
   *  'd0aCAxMDQKPj4Kc3RyZWFtCniccwrhMlAAwaJ0Ln2P1Jyy1JLM5ERdc0MjCwUjE4WQNC4Q' +
   *  '6cNlCFZkqGCqYGSqEJLLZWNuYGZiZmbkYuZsZmlmZGRgZmluDCQNzc3NTM2NzdzMXMxMjQ' +
   *  'ztFEKyuEK0uFxDuAAOERdVCmVuZHN0cmVhbQplbmRvYmoKCjYgMCBvYmoKPDwKL0ZpbHRl' +
   *  'ciAvRmxhdGVEZWNvZGUKL1R5cGUgL09ialN0bQovTiA0Ci9GaXJzdCAyMAovTGVuZ3RoID' +
   *  'IxNQo+PgpzdHJlYW0KeJxVj9GqwjAMhu/zFHkBzTo3nCCCiiKIHPEICuJF3cKoSCu2E8/b' +
   *  '20wPIr1p8v9/8kVhgilmGfawX2CGaVrgcAi0/bsy0lrX7IGWpvJ4iJYEN3gEmrrGBlQwGs' +
   *  'HHO9VBX1wNrxAqMX87RBD5xpJuddqwd82tjAHxzV1U5LPgy52DKXWnr1Lheg+j/c/pzGVr' +
   *  'iqV0VlwZPXGPCJjElw/ybkwUmeoWgxesDXGhHJC/D/iikp1Av80ptKU0FdBEe25pPihAM1' +
   *  'u6ytgaaWfs2Hrz35CJT1+EWmAKZW5kc3RyZWFtCmVuZG9iagoKNyAwIG9iago8PAovU2l6' +
   *  'ZSA4Ci9Sb290IDIgMCBSCi9GaWx0ZXIgL0ZsYXRlRGVjb2RlCi9UeXBlIC9YUmVmCi9MZW' +
   *  '5ndGggMzgKL1cgWyAxIDIgMiBdCi9JbmRleCBbIDAgOCBdCj4+CnN0cmVhbQp4nBXEwREA' +
   *  'EBAEsCwz3vrvRmOOyyOoGhZdutHN2MT55fIAVocD+AplbmRzdHJlYW0KZW5kb2JqCgpzdG' +
   *  'FydHhyZWYKNTEwCiUlRU9G'
   *
   * const dataUri = 'data:application/pdf;base64,' + base64
   *
   * const pdfDoc1 = await PDFDocument.load(base64)
   * const pdfDoc2 = await PDFDocument.load(dataUri)
   *
   * // pdf=Uint8Array
   * import fs from 'fs'
   * const uint8Array = fs.readFileSync('with_update_sections.pdf')
   * const pdfDoc3 = await PDFDocument.load(uint8Array)
   *
   * // pdf=ArrayBuffer
   * const url = 'https://pdf-lib.js.org/assets/with_update_sections.pdf'
   * const arrayBuffer = await fetch(url).then(res => res.arrayBuffer())
   * const pdfDoc4 = await PDFDocument.load(arrayBuffer)
   *
   * ```
   *
   * @param pdf The input data containing a PDF document.
   * @param options The options to be used when loading the document.
   * @returns Resolves with a document loaded from the input.
   */
  static async load(e, t = {}) {
    const { ignoreEncryption: i = !1, parseSpeed: n = ms.Slow, throwOnInvalidObject: a = !1, updateMetadata: s = !0, capNumbers: o = !1, password: l } = t;
    F(e, "pdf", ["string", Uint8Array, ArrayBuffer]), F(i, "ignoreEncryption", ["boolean"]), F(n, "parseSpeed", ["number"]), F(a, "throwOnInvalidObject", ["boolean"]), F(l, "password", ["string", "undefined"]);
    const c = yi(e), u = await ra.forBytesWithOptions(c, n, a, o).parseDocument();
    if (u.lookup(u.trailerInfo.Encrypt) && l !== void 0) {
      const f = u.lookup(u.trailerInfo.ID, V), h = u.lookup(u.trailerInfo.Encrypt, $), d = await ra.forBytesWithOptions(c, n, a, o, new Lm(h, f.get(0).asBytes(), l)).parseDocument();
      return new Se(d, !0, s);
    } else
      return new Se(u, i, s);
  }
  /**
   * Create a new [[PDFDocument]].
   * @returns Resolves with the newly created document.
   */
  static async create(e = {}) {
    const { updateMetadata: t = !0 } = e, i = ji.create(), n = ft.withContext(i), a = i.register(n), s = ai.withContextAndPages(i, a);
    return i.trailerInfo.Root = i.register(s), new Se(i, !1, t);
  }
  constructor(e, t, i) {
    if (Object.defineProperty(this, "context", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "catalog", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "isEncrypted", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "defaultWordBreaks", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: [" "]
    }), Object.defineProperty(this, "fontkit", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "pageCount", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "pageCache", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "pageMap", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "formCache", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "fonts", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "images", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "embeddedPages", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "embeddedFiles", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "javaScripts", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "computePages", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: () => {
        const n = [];
        return this.catalog.Pages().traverse((a, s) => {
          if (a instanceof Be) {
            let o = this.pageMap.get(a);
            o || (o = Fe.of(a, s, this), this.pageMap.set(a, o)), n.push(o);
          }
        }), n;
      }
    }), Object.defineProperty(this, "getOrCreateForm", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: () => {
        const n = this.catalog.getOrCreateAcroForm();
        return ps.of(n, this);
      }
    }), F(e, "context", [[ji, "PDFContext"]]), F(t, "ignoreEncryption", ["boolean"]), this.context = e, this.catalog = e.lookup(e.trailerInfo.Root), e.lookup(e.trailerInfo.Encrypt) && e.isDecrypted && delete e.trailerInfo.Encrypt, this.isEncrypted = !!e.lookup(e.trailerInfo.Encrypt), this.pageCache = it.populatedBy(this.computePages), this.pageMap = /* @__PURE__ */ new Map(), this.formCache = it.populatedBy(this.getOrCreateForm), this.fonts = [], this.images = [], this.embeddedPages = [], this.embeddedFiles = [], this.javaScripts = [], !t && this.isEncrypted)
      throw new gh();
    i && this.updateInfoDict();
  }
  /**
   * Register a fontkit instance. This must be done before custom fonts can
   * be embedded. See [here](https://github.com/Hopding/pdf-lib/tree/master#fontkit-installation)
   * for instructions on how to install and register a fontkit instance.
   *
   * > You do **not** need to call this method to embed standard fonts.
   *
   * For example:
   * ```js
   * import { PDFDocument } from 'pdf-lib'
   * import fontkit from '@pdf-lib/fontkit'
   *
   * const pdfDoc = await PDFDocument.create()
   * pdfDoc.registerFontkit(fontkit)
   * ```
   *
   * @param fontkit The fontkit instance to be registered.
   */
  registerFontkit(e) {
    this.fontkit = e;
  }
  /**
   * Get the [[PDFForm]] containing all interactive fields for this document.
   * For example:
   * ```js
   * const form = pdfDoc.getForm()
   * const fields = form.getFields()
   * fields.forEach(field => {
   *   const type = field.constructor.name
   *   const name = field.getName()
   *   console.log(`${type}: ${name}`)
   * })
   * ```
   * @returns The form for this document.
   */
  getForm() {
    const e = this.formCache.access();
    return e.hasXFA() && (console.warn("Removing XFA form data as pdf-lib does not support reading or writing XFA"), e.deleteXFA()), e;
  }
  /**
   * Get this document's title metadata. The title appears in the
   * "Document Properties" section of most PDF readers. For example:
   * ```js
   * const title = pdfDoc.getTitle()
   * ```
   * @returns A string containing the title of this document, if it has one.
   */
  getTitle() {
    const e = this.getInfoDict().lookup(x.Title);
    if (e)
      return rr(e), e.decodeText();
  }
  /**
   * Get this document's author metadata. The author appears in the
   * "Document Properties" section of most PDF readers. For example:
   * ```js
   * const author = pdfDoc.getAuthor()
   * ```
   * @returns A string containing the author of this document, if it has one.
   */
  getAuthor() {
    const e = this.getInfoDict().lookup(x.Author);
    if (e)
      return rr(e), e.decodeText();
  }
  /**
   * Get this document's subject metadata. The subject appears in the
   * "Document Properties" section of most PDF readers. For example:
   * ```js
   * const subject = pdfDoc.getSubject()
   * ```
   * @returns A string containing the subject of this document, if it has one.
   */
  getSubject() {
    const e = this.getInfoDict().lookup(x.Subject);
    if (e)
      return rr(e), e.decodeText();
  }
  /**
   * Get this document's keywords metadata. The keywords appear in the
   * "Document Properties" section of most PDF readers. For example:
   * ```js
   * const keywords = pdfDoc.getKeywords()
   * ```
   * @returns A string containing the keywords of this document, if it has any.
   */
  getKeywords() {
    const e = this.getInfoDict().lookup(x.Keywords);
    if (e)
      return rr(e), e.decodeText();
  }
  /**
   * Get this document's creator metadata. The creator appears in the
   * "Document Properties" section of most PDF readers. For example:
   * ```js
   * const creator = pdfDoc.getCreator()
   * ```
   * @returns A string containing the creator of this document, if it has one.
   */
  getCreator() {
    const e = this.getInfoDict().lookup(x.Creator);
    if (e)
      return rr(e), e.decodeText();
  }
  /**
   * Get this document's producer metadata. The producer appears in the
   * "Document Properties" section of most PDF readers. For example:
   * ```js
   * const producer = pdfDoc.getProducer()
   * ```
   * @returns A string containing the producer of this document, if it has one.
   */
  getProducer() {
    const e = this.getInfoDict().lookup(x.Producer);
    if (e)
      return rr(e), e.decodeText();
  }
  /**
   * Get this document's creation date metadata. The creation date appears in
   * the "Document Properties" section of most PDF readers. For example:
   * ```js
   * const creationDate = pdfDoc.getCreationDate()
   * ```
   * @returns A Date containing the creation date of this document,
   *          if it has one.
   */
  getCreationDate() {
    const e = this.getInfoDict().lookup(x.CreationDate);
    if (e)
      return rr(e), e.decodeDate();
  }
  /**
   * Get this document's modification date metadata. The modification date
   * appears in the "Document Properties" section of most PDF readers.
   * For example:
   * ```js
   * const modification = pdfDoc.getModificationDate()
   * ```
   * @returns A Date containing the modification date of this document,
   *          if it has one.
   */
  getModificationDate() {
    const e = this.getInfoDict().lookup(x.ModDate);
    if (e)
      return rr(e), e.decodeDate();
  }
  /**
   * Set this document's title metadata. The title will appear in the
   * "Document Properties" section of most PDF readers. For example:
   * ```js
   * pdfDoc.setTitle('🥚 The Life of an Egg 🍳')
   * ```
   *
   * To display the title in the window's title bar, set the
   * `showInWindowTitleBar` option to `true` (works for _most_ PDF readers).
   * For example:
   * ```js
   * pdfDoc.setTitle('🥚 The Life of an Egg 🍳', { showInWindowTitleBar: true })
   * ```
   *
   * @param title The title of this document.
   * @param options The options to be used when setting the title.
   */
  setTitle(e, t) {
    F(e, "title", ["string"]);
    const i = x.of("Title");
    this.getInfoDict().set(i, z.fromText(e)), t != null && t.showInWindowTitleBar && this.catalog.getOrCreateViewerPreferences().setDisplayDocTitle(!0);
  }
  /**
   * Set this document's author metadata. The author will appear in the
   * "Document Properties" section of most PDF readers. For example:
   * ```js
   * pdfDoc.setAuthor('Humpty Dumpty')
   * ```
   * @param author The author of this document.
   */
  setAuthor(e) {
    F(e, "author", ["string"]);
    const t = x.of("Author");
    this.getInfoDict().set(t, z.fromText(e));
  }
  /**
   * Set this document's subject metadata. The subject will appear in the
   * "Document Properties" section of most PDF readers. For example:
   * ```js
   * pdfDoc.setSubject('📘 An Epic Tale of Woe 📖')
   * ```
   * @param subject The subject of this document.
   */
  setSubject(e) {
    F(e, "author", ["string"]);
    const t = x.of("Subject");
    this.getInfoDict().set(t, z.fromText(e));
  }
  /**
   * Set this document's keyword metadata. These keywords will appear in the
   * "Document Properties" section of most PDF readers. For example:
   * ```js
   * pdfDoc.setKeywords(['eggs', 'wall', 'fall', 'king', 'horses', 'men'])
   * ```
   * @param keywords An array of keywords associated with this document.
   */
  setKeywords(e) {
    F(e, "keywords", [Array]);
    const t = x.of("Keywords");
    this.getInfoDict().set(t, z.fromText(e.join(" ")));
  }
  /**
   * Set this document's creator metadata. The creator will appear in the
   * "Document Properties" section of most PDF readers. For example:
   * ```js
   * pdfDoc.setCreator('PDF App 9000 🤖')
   * ```
   * @param creator The creator of this document.
   */
  setCreator(e) {
    F(e, "creator", ["string"]);
    const t = x.of("Creator");
    this.getInfoDict().set(t, z.fromText(e));
  }
  /**
   * Set this document's producer metadata. The producer will appear in the
   * "Document Properties" section of most PDF readers. For example:
   * ```js
   * pdfDoc.setProducer('PDF App 9000 🤖')
   * ```
   * @param producer The producer of this document.
   */
  setProducer(e) {
    F(e, "creator", ["string"]);
    const t = x.of("Producer");
    this.getInfoDict().set(t, z.fromText(e));
  }
  /**
   * Set this document's language metadata. The language will appear in the
   * "Document Properties" section of some PDF readers. For example:
   * ```js
   * pdfDoc.setLanguage('en-us')
   * ```
   *
   * @param language An RFC 3066 _Language-Tag_ denoting the language of this
   *                 document, or an empty string if the language is unknown.
   */
  setLanguage(e) {
    F(e, "language", ["string"]);
    const t = x.of("Lang");
    this.catalog.set(t, G.of(e));
  }
  /**
   * Set this document's creation date metadata. The creation date will appear
   * in the "Document Properties" section of most PDF readers. For example:
   * ```js
   * pdfDoc.setCreationDate(new Date())
   * ```
   * @param creationDate The date this document was created.
   */
  setCreationDate(e) {
    F(e, "creationDate", [[Date, "Date"]]);
    const t = x.of("CreationDate");
    this.getInfoDict().set(t, G.fromDate(e));
  }
  /**
   * Set this document's modification date metadata. The modification date will
   * appear in the "Document Properties" section of most PDF readers. For
   * example:
   * ```js
   * pdfDoc.setModificationDate(new Date())
   * ```
   * @param modificationDate The date this document was last modified.
   */
  setModificationDate(e) {
    F(e, "modificationDate", [[Date, "Date"]]);
    const t = x.of("ModDate");
    this.getInfoDict().set(t, G.fromDate(e));
  }
  /**
   * Get the number of pages contained in this document. For example:
   * ```js
   * const totalPages = pdfDoc.getPageCount()
   * ```
   * @returns The number of pages in this document.
   */
  getPageCount() {
    return this.pageCount === void 0 && (this.pageCount = this.getPages().length), this.pageCount;
  }
  /**
   * Get an array of all the pages contained in this document. The pages are
   * stored in the array in the same order that they are rendered in the
   * document. For example:
   * ```js
   * const pages = pdfDoc.getPages()
   * pages[0]   // The first page of the document
   * pages[2]   // The third page of the document
   * pages[197] // The 198th page of the document
   * ```
   * @returns An array of all the pages contained in this document.
   */
  getPages() {
    return this.pageCache.access();
  }
  /**
   * Get the page rendered at a particular `index` of the document. For example:
   * ```js
   * pdfDoc.getPage(0)   // The first page of the document
   * pdfDoc.getPage(2)   // The third page of the document
   * pdfDoc.getPage(197) // The 198th page of the document
   * ```
   * @returns The [[PDFPage]] rendered at the given `index` of the document.
   */
  getPage(e) {
    const t = this.getPages();
    return _n(e, "index", 0, t.length - 1), t[e];
  }
  /**
   * Get an array of indices for all the pages contained in this document. The
   * array will contain a range of integers from
   * `0..pdfDoc.getPageCount() - 1`. For example:
   * ```js
   * const pdfDoc = await PDFDocument.create()
   * pdfDoc.addPage()
   * pdfDoc.addPage()
   * pdfDoc.addPage()
   *
   * const indices = pdfDoc.getPageIndices()
   * indices // => [0, 1, 2]
   * ```
   * @returns An array of indices for all pages contained in this document.
   */
  getPageIndices() {
    return Cu(0, this.getPageCount());
  }
  /**
   * Remove the page at a given index from this document. For example:
   * ```js
   * pdfDoc.removePage(0)   // Remove the first page of the document
   * pdfDoc.removePage(2)   // Remove the third page of the document
   * pdfDoc.removePage(197) // Remove the 198th page of the document
   * ```
   * Once a page has been removed, it will no longer be rendered at that index
   * in the document.
   * @param index The index of the page to be removed.
   */
  removePage(e) {
    const t = this.getPageCount();
    if (this.pageCount === 0)
      throw new wh();
    _n(e, "index", 0, t - 1), this.catalog.removeLeafNode(e), this.pageCount = t - 1;
  }
  /**
   * Add a page to the end of this document. This method accepts three
   * different value types for the `page` parameter:
   *
   * | Type               | Behavior                                                                            |
   * | ------------------ | ----------------------------------------------------------------------------------- |
   * | `undefined`        | Create a new page and add it to the end of this document                            |
   * | `[number, number]` | Create a new page with the given dimensions and add it to the end of this document  |
   * | `PDFPage`          | Add the existing page to the end of this document                                   |
   *
   * For example:
   * ```js
   * // page=undefined
   * const newPage = pdfDoc.addPage()
   *
   * // page=[number, number]
   * import { PageSizes } from 'pdf-lib'
   * const newPage1 = pdfDoc.addPage(PageSizes.A7)
   * const newPage2 = pdfDoc.addPage(PageSizes.Letter)
   * const newPage3 = pdfDoc.addPage([500, 750])
   *
   * // page=PDFPage
   * const pdfDoc1 = await PDFDocument.create()
   * const pdfDoc2 = await PDFDocument.load(...)
   * const [existingPage] = await pdfDoc1.copyPages(pdfDoc2, [0])
   * pdfDoc1.addPage(existingPage)
   * ```
   *
   * @param page Optionally, the desired dimensions or existing page.
   * @returns The newly created (or existing) page.
   */
  addPage(e) {
    return F(e, "page", ["undefined", [Fe, "PDFPage"], Array]), this.insertPage(this.getPageCount(), e);
  }
  /**
   * Insert a page at a given index within this document. This method accepts
   * three different value types for the `page` parameter:
   *
   * | Type               | Behavior                                                                       |
   * | ------------------ | ------------------------------------------------------------------------------ |
   * | `undefined`        | Create a new page and insert it into this document                             |
   * | `[number, number]` | Create a new page with the given dimensions and insert it into this document   |
   * | `PDFPage`          | Insert the existing page into this document                                    |
   *
   * For example:
   * ```js
   * // page=undefined
   * const newPage = pdfDoc.insertPage(2)
   *
   * // page=[number, number]
   * import { PageSizes } from 'pdf-lib'
   * const newPage1 = pdfDoc.insertPage(2, PageSizes.A7)
   * const newPage2 = pdfDoc.insertPage(0, PageSizes.Letter)
   * const newPage3 = pdfDoc.insertPage(198, [500, 750])
   *
   * // page=PDFPage
   * const pdfDoc1 = await PDFDocument.create()
   * const pdfDoc2 = await PDFDocument.load(...)
   * const [existingPage] = await pdfDoc1.copyPages(pdfDoc2, [0])
   * pdfDoc1.insertPage(0, existingPage)
   * ```
   *
   * @param index The index at which the page should be inserted (zero-based).
   * @param page Optionally, the desired dimensions or existing page.
   * @returns The newly created (or existing) page.
   */
  insertPage(e, t) {
    const i = this.getPageCount();
    if (_n(e, "index", 0, i), F(t, "page", ["undefined", [Fe, "PDFPage"], Array]), !t || Array.isArray(t)) {
      const a = Array.isArray(t) ? t : jh.A4;
      t = Fe.create(this), t.setSize(...a);
    } else if (t.doc !== this)
      throw new mh();
    const n = this.catalog.insertLeafNode(t.ref, e);
    return t.node.setParent(n), this.pageMap.set(t.node, t), this.pageCache.invalidate(), this.pageCount = i + 1, t;
  }
  /**
   * Copy pages from a source document into this document. Allows pages to be
   * copied between different [[PDFDocument]] instances. For example:
   * ```js
   * const pdfDoc = await PDFDocument.create()
   * const srcDoc = await PDFDocument.load(...)
   *
   * const copiedPages = await pdfDoc.copyPages(srcDoc, [0, 3, 89])
   * const [firstPage, fourthPage, ninetiethPage] = copiedPages;
   *
   * pdfDoc.addPage(fourthPage)
   * pdfDoc.insertPage(0, ninetiethPage)
   * pdfDoc.addPage(firstPage)
   * ```
   * @param srcDoc The document from which pages should be copied.
   * @param indices The indices of the pages that should be copied.
   * @returns Resolves with an array of pages copied into this document.
   */
  async copyPages(e, t) {
    F(e, "srcDoc", [[Se, "PDFDocument"]]), F(t, "indices", [Array]), await e.flush();
    const i = Vn.for(e.context, this.context), n = e.getPages(), a = new Array(t.length);
    for (let s = 0, o = t.length; s < o; s++) {
      const l = n[t[s]], c = i.copy(l.node), u = this.context.register(c);
      a[s] = Fe.of(c, u, this);
    }
    return a;
  }
  /**
   * Get a copy of this document.
   *
   * For example:
   * ```js
   * const srcDoc = await PDFDocument.load(...)
   * const pdfDoc = await srcDoc.copy()
   * ```
   *
   * > **NOTE:**  This method won't copy all information over to the new
   * > document (acroforms, outlines, etc...).
   *
   * @returns Resolves with a copy this document.
   */
  async copy() {
    const e = await Se.create(), t = await e.copyPages(this, this.getPageIndices());
    for (let i = 0, n = t.length; i < n; i++)
      e.addPage(t[i]);
    return this.getAuthor() !== void 0 && e.setAuthor(this.getAuthor()), this.getCreationDate() !== void 0 && e.setCreationDate(this.getCreationDate()), this.getCreator() !== void 0 && e.setCreator(this.getCreator()), this.getModificationDate() !== void 0 && e.setModificationDate(this.getModificationDate()), this.getProducer() !== void 0 && e.setProducer(this.getProducer()), this.getSubject() !== void 0 && e.setSubject(this.getSubject()), this.getTitle() !== void 0 && e.setTitle(this.getTitle()), e.defaultWordBreaks = this.defaultWordBreaks, e;
  }
  /**
   * Add JavaScript to this document. The supplied `script` is executed when the
   * document is opened. The `script` can be used to perform some operation
   * when the document is opened (e.g. logging to the console), or it can be
   * used to define a function that can be referenced later in a JavaScript
   * action. For example:
   * ```js
   * // Show "Hello World!" in the console when the PDF is opened
   * pdfDoc.addJavaScript(
   *   'main',
   *   'console.show(); console.println("Hello World!");'
   * );
   *
   * // Define a function named "foo" that can be called in JavaScript Actions
   * pdfDoc.addJavaScript(
   *   'foo',
   *   'function foo() { return "foo"; }'
   * );
   * ```
   * See the [JavaScript for Acrobat API Reference](https://www.adobe.com/content/dam/acom/en/devnet/acrobat/pdfs/js_api_reference.pdf)
   * for details.
   * @param name The name of the script. Must be unique per document.
   * @param script The JavaScript to execute.
   */
  addJavaScript(e, t) {
    F(e, "name", ["string"]), F(t, "script", ["string"]);
    const i = Zc.for(t, e), n = this.context.nextRef(), a = ws.of(n, this, i);
    this.javaScripts.push(a);
  }
  /**
   * Add an attachment to this document. Attachments are visible in the
   * "Attachments" panel of Adobe Acrobat and some other PDF readers. Any
   * type of file can be added as an attachment. This includes, but is not
   * limited to, `.png`, `.jpg`, `.pdf`, `.csv`, `.docx`, and `.xlsx` files.
   *
   * The input data can be provided in multiple formats:
   *
   * | Type          | Contents                                                       |
   * | ------------- | -------------------------------------------------------------- |
   * | `string`      | A base64 encoded string (or data URI) containing an attachment |
   * | `Uint8Array`  | The raw bytes of an attachment                                 |
   * | `ArrayBuffer` | The raw bytes of an attachment                                 |
   *
   * For example:
   * ```js
   * // attachment=string
   * await pdfDoc.attach('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBD...', 'cat_riding_unicorn.jpg', {
   *   mimeType: 'image/jpeg',
   *   description: 'Cool cat riding a unicorn! 🦄🐈🕶️',
   *   creationDate: new Date('2019/12/01'),
   *   modificationDate: new Date('2020/04/19'),
   * })
   * await pdfDoc.attach('data:image/jpeg;base64,/9j/4AAQ...', 'cat_riding_unicorn.jpg', {
   *   mimeType: 'image/jpeg',
   *   description: 'Cool cat riding a unicorn! 🦄🐈🕶️',
   *   creationDate: new Date('2019/12/01'),
   *   modificationDate: new Date('2020/04/19'),
   * })
   *
   * // attachment=Uint8Array
   * import fs from 'fs'
   * const uint8Array = fs.readFileSync('cat_riding_unicorn.jpg')
   * await pdfDoc.attach(uint8Array, 'cat_riding_unicorn.jpg', {
   *   mimeType: 'image/jpeg',
   *   description: 'Cool cat riding a unicorn! 🦄🐈🕶️',
   *   creationDate: new Date('2019/12/01'),
   *   modificationDate: new Date('2020/04/19'),
   * })
   *
   * // attachment=ArrayBuffer
   * const url = 'https://pdf-lib.js.org/assets/cat_riding_unicorn.jpg'
   * const arrayBuffer = await fetch(url).then(res => res.arrayBuffer())
   * await pdfDoc.attach(arrayBuffer, 'cat_riding_unicorn.jpg', {
   *   mimeType: 'image/jpeg',
   *   description: 'Cool cat riding a unicorn! 🦄🐈🕶️',
   *   creationDate: new Date('2019/12/01'),
   *   modificationDate: new Date('2020/04/19'),
   * })
   * ```
   *
   * @param attachment The input data containing the file to be attached.
   * @param name The name of the file to be attached.
   * @returns Resolves when the attachment is complete.
   */
  async attach(e, t, i = {}) {
    F(e, "attachment", ["string", Uint8Array, ArrayBuffer]), F(t, "name", ["string"]), R(i.mimeType, "mimeType", ["string"]), R(i.description, "description", ["string"]), R(i.creationDate, "options.creationDate", [Date]), R(i.modificationDate, "options.modificationDate", [Date]), $e(i.afRelationship, "options.afRelationship", us);
    const n = yi(e), a = Ms.for(n, t, i), s = this.context.nextRef(), o = ic.of(s, this, a);
    this.embeddedFiles.push(o);
  }
  /**
   * Embed a font into this document. The input data can be provided in multiple
   * formats:
   *
   * | Type            | Contents                                                |
   * | --------------- | ------------------------------------------------------- |
   * | `StandardFonts` | One of the standard 14 fonts                            |
   * | `string`        | A base64 encoded string (or data URI) containing a font |
   * | `Uint8Array`    | The raw bytes of a font                                 |
   * | `ArrayBuffer`   | The raw bytes of a font                                 |
   *
   * For example:
   * ```js
   * // font=StandardFonts
   * import { StandardFonts } from 'pdf-lib'
   * const font1 = await pdfDoc.embedFont(StandardFonts.Helvetica)
   *
   * // font=string
   * const font2 = await pdfDoc.embedFont('AAEAAAAVAQAABABQRFNJRx/upe...')
   * const font3 = await pdfDoc.embedFont('data:font/opentype;base64,AAEAAA...')
   *
   * // font=Uint8Array
   * import fs from 'fs'
   * const font4 = await pdfDoc.embedFont(fs.readFileSync('Ubuntu-R.ttf'))
   *
   * // font=ArrayBuffer
   * const url = 'https://pdf-lib.js.org/assets/ubuntu/Ubuntu-R.ttf'
   * const ubuntuBytes = await fetch(url).then(res => res.arrayBuffer())
   * const font5 = await pdfDoc.embedFont(ubuntuBytes)
   * ```
   * See also: [[registerFontkit]]
   * @param font The input data for a font.
   * @param options The options to be used when embedding the font.
   * @returns Resolves with the embedded font.
   */
  async embedFont(e, t = {}) {
    const { subset: i = !1, customName: n, features: a } = t;
    F(e, "font", ["string", Uint8Array, ArrayBuffer]), F(i, "subset", ["boolean"]);
    let s;
    if (Bo(e))
      s = Jr.for(e, n);
    else if (Fu(e)) {
      const c = yi(e), u = this.assertFontkit();
      s = i ? await Ls.for(u, c, n, a) : await Gi.for(u, c, n, a);
    } else
      throw new TypeError("`font` must be one of `StandardFonts | string | Uint8Array | ArrayBuffer`");
    const o = this.context.nextRef(), l = Ie.of(o, this, s);
    return this.fonts.push(l), l;
  }
  /**
   * Embed a standard font into this document.
   * For example:
   * ```js
   * import { StandardFonts } from 'pdf-lib'
   * const helveticaFont = pdfDoc.embedFont(StandardFonts.Helvetica)
   * ```
   * @param font The standard font to be embedded.
   * @param customName The name to be used when embedding the font.
   * @returns The embedded font.
   */
  embedStandardFont(e, t) {
    if (F(e, "font", ["string"]), !Bo(e))
      throw new TypeError("`font` must be one of type `StandardFonts`");
    const i = Jr.for(e, t), n = this.context.nextRef(), a = Ie.of(n, this, i);
    return this.fonts.push(a), a;
  }
  /**
   * Embed a JPEG image into this document. The input data can be provided in
   * multiple formats:
   *
   * | Type          | Contents                                                      |
   * | ------------- | ------------------------------------------------------------- |
   * | `string`      | A base64 encoded string (or data URI) containing a JPEG image |
   * | `Uint8Array`  | The raw bytes of a JPEG image                                 |
   * | `ArrayBuffer` | The raw bytes of a JPEG image                                 |
   *
   * For example:
   * ```js
   * // jpg=string
   * const image1 = await pdfDoc.embedJpg('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBD...')
   * const image2 = await pdfDoc.embedJpg('data:image/jpeg;base64,/9j/4AAQ...')
   *
   * // jpg=Uint8Array
   * import fs from 'fs'
   * const uint8Array = fs.readFileSync('cat_riding_unicorn.jpg')
   * const image3 = await pdfDoc.embedJpg(uint8Array)
   *
   * // jpg=ArrayBuffer
   * const url = 'https://pdf-lib.js.org/assets/cat_riding_unicorn.jpg'
   * const arrayBuffer = await fetch(url).then(res => res.arrayBuffer())
   * const image4 = await pdfDoc.embedJpg(arrayBuffer)
   * ```
   *
   * @param jpg The input data for a JPEG image.
   * @returns Resolves with the embedded image.
   */
  async embedJpg(e) {
    F(e, "jpg", ["string", Uint8Array, ArrayBuffer]);
    const t = yi(e), i = await va.for(t), n = this.context.nextRef(), a = Li.of(n, this, i);
    return this.images.push(a), a;
  }
  /**
   * Embed a PNG image into this document. The input data can be provided in
   * multiple formats:
   *
   * | Type          | Contents                                                     |
   * | ------------- | ------------------------------------------------------------ |
   * | `string`      | A base64 encoded string (or data URI) containing a PNG image |
   * | `Uint8Array`  | The raw bytes of a PNG image                                 |
   * | `ArrayBuffer` | The raw bytes of a PNG image                                 |
   *
   * For example:
   * ```js
   * // png=string
   * const image1 = await pdfDoc.embedPng('iVBORw0KGgoAAAANSUhEUgAAAlgAAAF3...')
   * const image2 = await pdfDoc.embedPng('data:image/png;base64,iVBORw0KGg...')
   *
   * // png=Uint8Array
   * import fs from 'fs'
   * const uint8Array = fs.readFileSync('small_mario.png')
   * const image3 = await pdfDoc.embedPng(uint8Array)
   *
   * // png=ArrayBuffer
   * const url = 'https://pdf-lib.js.org/assets/small_mario.png'
   * const arrayBuffer = await fetch(url).then(res => res.arrayBuffer())
   * const image4 = await pdfDoc.embedPng(arrayBuffer)
   * ```
   *
   * @param png The input data for a PNG image.
   * @returns Resolves with the embedded image.
   */
  async embedPng(e) {
    F(e, "png", ["string", Uint8Array, ArrayBuffer]);
    const t = yi(e), i = await Ca.for(t), n = this.context.nextRef(), a = Li.of(n, this, i);
    return this.images.push(a), a;
  }
  /**
   * Embed one or more PDF pages into this document.
   *
   * For example:
   * ```js
   * const pdfDoc = await PDFDocument.create()
   *
   * const sourcePdfUrl = 'https://pdf-lib.js.org/assets/with_large_page_count.pdf'
   * const sourcePdf = await fetch(sourcePdfUrl).then((res) => res.arrayBuffer())
   *
   * // Embed page 74 of `sourcePdf` into `pdfDoc`
   * const [embeddedPage] = await pdfDoc.embedPdf(sourcePdf, [73])
   * ```
   *
   * See [[PDFDocument.load]] for examples of the allowed input data formats.
   *
   * @param pdf The input data containing a PDF document.
   * @param indices The indices of the pages that should be embedded.
   * @returns Resolves with an array of the embedded pages.
   */
  async embedPdf(e, t = [0]) {
    F(e, "pdf", ["string", Uint8Array, ArrayBuffer, [Se, "PDFDocument"]]), F(t, "indices", [Array]);
    const i = e instanceof Se ? e : await Se.load(e), n = Ou(i.getPages(), t);
    return this.embedPages(n);
  }
  /**
   * Embed a single PDF page into this document.
   *
   * For example:
   * ```js
   * const pdfDoc = await PDFDocument.create()
   *
   * const sourcePdfUrl = 'https://pdf-lib.js.org/assets/with_large_page_count.pdf'
   * const sourceBuffer = await fetch(sourcePdfUrl).then((res) => res.arrayBuffer())
   * const sourcePdfDoc = await PDFDocument.load(sourceBuffer)
   * const sourcePdfPage = sourcePdfDoc.getPages()[73]
   *
   * const embeddedPage = await pdfDoc.embedPage(
   *   sourcePdfPage,
   *
   *   // Clip a section of the source page so that we only embed part of it
   *   { left: 100, right: 450, bottom: 330, top: 570 },
   *
   *   // Translate all drawings of the embedded page by (10, 200) units
   *   [1, 0, 0, 1, 10, 200],
   * )
   * ```
   *
   * @param page The page to be embedded.
   * @param boundingBox
   * Optionally, an area of the source page that should be embedded
   * (defaults to entire page).
   * @param transformationMatrix
   * Optionally, a transformation matrix that is always applied to the embedded
   * page anywhere it is drawn.
   * @returns Resolves with the embedded pdf page.
   */
  async embedPage(e, t, i) {
    F(e, "page", [[Fe, "PDFPage"]]);
    const [n] = await this.embedPages([e], [t], [i]);
    return n;
  }
  /**
   * Embed one or more PDF pages into this document.
   *
   * For example:
   * ```js
   * const pdfDoc = await PDFDocument.create()
   *
   * const sourcePdfUrl = 'https://pdf-lib.js.org/assets/with_large_page_count.pdf'
   * const sourceBuffer = await fetch(sourcePdfUrl).then((res) => res.arrayBuffer())
   * const sourcePdfDoc = await PDFDocument.load(sourceBuffer)
   *
   * const page1 = sourcePdfDoc.getPages()[0]
   * const page2 = sourcePdfDoc.getPages()[52]
   * const page3 = sourcePdfDoc.getPages()[73]
   *
   * const embeddedPages = await pdfDoc.embedPages([page1, page2, page3])
   * ```
   *
   * @param page
   * The pages to be embedded (they must all share the same context).
   * @param boundingBoxes
   * Optionally, an array of clipping boundaries - one for each page
   * (defaults to entirety of each page).
   * @param transformationMatrices
   * Optionally, an array of transformation matrices - one for each page
   * (each page's transformation will apply anywhere it is drawn).
   * @returns Resolves with an array of the embedded pdf pages.
   */
  async embedPages(e, t = [], i = []) {
    if (e.length === 0)
      return [];
    for (let o = 0, l = e.length - 1; o < l; o++) {
      const c = e[o], u = e[o + 1];
      if (c.node.context !== u.node.context)
        throw new Pu();
    }
    const n = e[0].node.context, a = n === this.context ? (o) => o : Vn.for(n, this.context).copy, s = new Array(e.length);
    for (let o = 0, l = e.length; o < l; o++) {
      const c = a(e[o].node), u = t[o], f = i[o], h = await Fa.for(c, u, f), d = this.context.nextRef();
      s[o] = Pt.of(d, this, h);
    }
    return this.embeddedPages.push(...s), s;
  }
  /**
   * > **NOTE:** You shouldn't need to call this method directly. The [[save]]
   * > and [[saveAsBase64]] methods will automatically ensure that all embedded
   * > assets are flushed before serializing the document.
   *
   * Flush all embedded fonts, PDF pages, and images to this document's
   * [[context]].
   *
   * @returns Resolves when the flush is complete.
   */
  async flush() {
    await this.embedAll(this.fonts), await this.embedAll(this.images), await this.embedAll(this.embeddedPages), await this.embedAll(this.embeddedFiles), await this.embedAll(this.javaScripts);
  }
  /**
   * Serialize this document to an array of bytes making up a PDF file.
   * For example:
   * ```js
   * const pdfBytes = await pdfDoc.save()
   * ```
   *
   * There are a number of things you can do with the serialized document,
   * depending on the JavaScript environment you're running in:
   * * Write it to a file in Node or React Native
   * * Download it as a Blob in the browser
   * * Render it in an `iframe`
   *
   * @param options The options to be used when saving the document.
   * @returns Resolves with the bytes of the serialized document.
   */
  async save(e = {}) {
    const { useObjectStreams: t = !0, addDefaultPage: i = !0, objectsPerTick: n = 50, updateFieldAppearances: a = !0 } = e;
    if (F(t, "useObjectStreams", ["boolean"]), F(i, "addDefaultPage", ["boolean"]), F(n, "objectsPerTick", ["number"]), F(a, "updateFieldAppearances", ["boolean"]), i && this.getPageCount() === 0 && this.addPage(), a) {
      const o = this.formCache.getValue();
      o && o.updateFieldAppearances();
    }
    return await this.flush(), (t ? ls : Gn).forContext(this.context, n).serializeToBuffer();
  }
  /**
   * Serialize this document to a base64 encoded string or data URI making up a
   * PDF file. For example:
   * ```js
   * const base64String = await pdfDoc.saveAsBase64()
   * base64String // => 'JVBERi0xLjcKJYGBgYEKC...'
   *
   * const base64DataUri = await pdfDoc.saveAsBase64({ dataUri: true })
   * base64DataUri // => 'data:application/pdf;base64,JVBERi0xLjcKJYGBgYEKC...'
   * ```
   *
   * @param options The options to be used when saving the document.
   * @returns Resolves with a base64 encoded string or data URI of the
   *          serialized document.
   */
  async saveAsBase64(e = {}) {
    const { dataUri: t = !1, ...i } = e;
    F(t, "dataUri", ["boolean"]);
    const n = await this.save(i), a = Du(n);
    return t ? `data:application/pdf;base64,${a}` : a;
  }
  findPageForAnnotationRef(e) {
    const t = this.getPages();
    for (let i = 0, n = t.length; i < n; i++) {
      const a = t[i], s = a.node.Annots();
      if ((s == null ? void 0 : s.indexOf(e)) !== void 0)
        return a;
    }
  }
  async embedAll(e) {
    for (let t = 0, i = e.length; t < i; t++)
      await e[t].embed();
  }
  updateInfoDict() {
    const e = "pdf-lib (https://github.com/Hopding/pdf-lib)", t = /* @__PURE__ */ new Date(), i = this.getInfoDict();
    this.setProducer(e), this.setModificationDate(t), i.get(x.of("Creator")) || this.setCreator(e), i.get(x.of("CreationDate")) || this.setCreationDate(t);
  }
  getInfoDict() {
    const e = this.context.lookup(this.context.trailerInfo.Info);
    if (e instanceof $)
      return e;
    const t = this.context.obj({});
    return this.context.trailerInfo.Info = this.context.register(t), t;
  }
  assertFontkit() {
    if (!this.fontkit)
      throw new ph();
    return this.fontkit;
  }
}
function rr(r) {
  if (!(r instanceof z) && !(r instanceof G))
    throw new Nn([z, G], r);
}
var yt;
(function(r) {
  r.Normal = "Normal", r.Multiply = "Multiply", r.Screen = "Screen", r.Overlay = "Overlay", r.Darken = "Darken", r.Lighten = "Lighten", r.ColorDodge = "ColorDodge", r.ColorBurn = "ColorBurn", r.HardLight = "HardLight", r.SoftLight = "SoftLight", r.Difference = "Difference", r.Exclusion = "Exclusion";
})(yt || (yt = {}));
var Te = {}, Da = {}, Lh = {};
(function(r) {
  var e = ns && ns.__assign || function() {
    return e = Object.assign || function(a) {
      for (var s, o = 1, l = arguments.length; o < l; o++) {
        s = arguments[o];
        for (var c in s) Object.prototype.hasOwnProperty.call(s, c) && (a[c] = s[c]);
      }
      return a;
    }, e.apply(this, arguments);
  };
  Object.defineProperty(r, "__esModule", { value: !0 }), r.namedReferences = r.bodyRegExps = void 0;
  var t = "~", i = "~~";
  function n(a, s) {
    for (var o = {}, l = {}, c = a.split(i), u = !1, f = 0; c.length > f; f++) {
      for (var h = c[f].split(t), d = 0; d < h.length; d += 2) {
        var b = h[d], p = h[d + 1], m = "&" + b + ";";
        o[m] = p, u && (o["&" + b] = p), l[p] = m;
      }
      u = !0;
    }
    return s ? { entities: e(e({}, o), s.entities), characters: e(e({}, l), s.characters) } : { entities: o, characters: l };
  }
  r.bodyRegExps = {
    xml: /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g,
    html4: /&notin;|&(?:nbsp|iexcl|cent|pound|curren|yen|brvbar|sect|uml|copy|ordf|laquo|not|shy|reg|macr|deg|plusmn|sup2|sup3|acute|micro|para|middot|cedil|sup1|ordm|raquo|frac14|frac12|frac34|iquest|Agrave|Aacute|Acirc|Atilde|Auml|Aring|AElig|Ccedil|Egrave|Eacute|Ecirc|Euml|Igrave|Iacute|Icirc|Iuml|ETH|Ntilde|Ograve|Oacute|Ocirc|Otilde|Ouml|times|Oslash|Ugrave|Uacute|Ucirc|Uuml|Yacute|THORN|szlig|agrave|aacute|acirc|atilde|auml|aring|aelig|ccedil|egrave|eacute|ecirc|euml|igrave|iacute|icirc|iuml|eth|ntilde|ograve|oacute|ocirc|otilde|ouml|divide|oslash|ugrave|uacute|ucirc|uuml|yacute|thorn|yuml|quot|amp|lt|gt|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g,
    html5: /&centerdot;|&copysr;|&divideontimes;|&gtcc;|&gtcir;|&gtdot;|&gtlPar;|&gtquest;|&gtrapprox;|&gtrarr;|&gtrdot;|&gtreqless;|&gtreqqless;|&gtrless;|&gtrsim;|&ltcc;|&ltcir;|&ltdot;|&lthree;|&ltimes;|&ltlarr;|&ltquest;|&ltrPar;|&ltri;|&ltrie;|&ltrif;|&notin;|&notinE;|&notindot;|&notinva;|&notinvb;|&notinvc;|&notni;|&notniva;|&notnivb;|&notnivc;|&parallel;|&timesb;|&timesbar;|&timesd;|&(?:AElig|AMP|Aacute|Acirc|Agrave|Aring|Atilde|Auml|COPY|Ccedil|ETH|Eacute|Ecirc|Egrave|Euml|GT|Iacute|Icirc|Igrave|Iuml|LT|Ntilde|Oacute|Ocirc|Ograve|Oslash|Otilde|Ouml|QUOT|REG|THORN|Uacute|Ucirc|Ugrave|Uuml|Yacute|aacute|acirc|acute|aelig|agrave|amp|aring|atilde|auml|brvbar|ccedil|cedil|cent|copy|curren|deg|divide|eacute|ecirc|egrave|eth|euml|frac12|frac14|frac34|gt|iacute|icirc|iexcl|igrave|iquest|iuml|laquo|lt|macr|micro|middot|nbsp|not|ntilde|oacute|ocirc|ograve|ordf|ordm|oslash|otilde|ouml|para|plusmn|pound|quot|raquo|reg|sect|shy|sup1|sup2|sup3|szlig|thorn|times|uacute|ucirc|ugrave|uml|uuml|yacute|yen|yuml|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g
  }, r.namedReferences = {}, r.namedReferences.xml = n(`lt~<~gt~>~quot~"~apos~'~amp~&`), r.namedReferences.html4 = n(`apos~'~OElig~Œ~oelig~œ~Scaron~Š~scaron~š~Yuml~Ÿ~circ~ˆ~tilde~˜~ensp~ ~emsp~ ~thinsp~ ~zwnj~‌~zwj~‍~lrm~‎~rlm~‏~ndash~–~mdash~—~lsquo~‘~rsquo~’~sbquo~‚~ldquo~“~rdquo~”~bdquo~„~dagger~†~Dagger~‡~permil~‰~lsaquo~‹~rsaquo~›~euro~€~fnof~ƒ~Alpha~Α~Beta~Β~Gamma~Γ~Delta~Δ~Epsilon~Ε~Zeta~Ζ~Eta~Η~Theta~Θ~Iota~Ι~Kappa~Κ~Lambda~Λ~Mu~Μ~Nu~Ν~Xi~Ξ~Omicron~Ο~Pi~Π~Rho~Ρ~Sigma~Σ~Tau~Τ~Upsilon~Υ~Phi~Φ~Chi~Χ~Psi~Ψ~Omega~Ω~alpha~α~beta~β~gamma~γ~delta~δ~epsilon~ε~zeta~ζ~eta~η~theta~θ~iota~ι~kappa~κ~lambda~λ~mu~μ~nu~ν~xi~ξ~omicron~ο~pi~π~rho~ρ~sigmaf~ς~sigma~σ~tau~τ~upsilon~υ~phi~φ~chi~χ~psi~ψ~omega~ω~thetasym~ϑ~upsih~ϒ~piv~ϖ~bull~•~hellip~…~prime~′~Prime~″~oline~‾~frasl~⁄~weierp~℘~image~ℑ~real~ℜ~trade~™~alefsym~ℵ~larr~←~uarr~↑~rarr~→~darr~↓~harr~↔~crarr~↵~lArr~⇐~uArr~⇑~rArr~⇒~dArr~⇓~hArr~⇔~forall~∀~part~∂~exist~∃~empty~∅~nabla~∇~isin~∈~notin~∉~ni~∋~prod~∏~sum~∑~minus~−~lowast~∗~radic~√~prop~∝~infin~∞~ang~∠~and~∧~or~∨~cap~∩~cup~∪~int~∫~there4~∴~sim~∼~cong~≅~asymp~≈~ne~≠~equiv~≡~le~≤~ge~≥~sub~⊂~sup~⊃~nsub~⊄~sube~⊆~supe~⊇~oplus~⊕~otimes~⊗~perp~⊥~sdot~⋅~lceil~⌈~rceil~⌉~lfloor~⌊~rfloor~⌋~lang~〈~rang~〉~loz~◊~spades~♠~clubs~♣~hearts~♥~diams~♦~~nbsp~ ~iexcl~¡~cent~¢~pound~£~curren~¤~yen~¥~brvbar~¦~sect~§~uml~¨~copy~©~ordf~ª~laquo~«~not~¬~shy~­~reg~®~macr~¯~deg~°~plusmn~±~sup2~²~sup3~³~acute~´~micro~µ~para~¶~middot~·~cedil~¸~sup1~¹~ordm~º~raquo~»~frac14~¼~frac12~½~frac34~¾~iquest~¿~Agrave~À~Aacute~Á~Acirc~Â~Atilde~Ã~Auml~Ä~Aring~Å~AElig~Æ~Ccedil~Ç~Egrave~È~Eacute~É~Ecirc~Ê~Euml~Ë~Igrave~Ì~Iacute~Í~Icirc~Î~Iuml~Ï~ETH~Ð~Ntilde~Ñ~Ograve~Ò~Oacute~Ó~Ocirc~Ô~Otilde~Õ~Ouml~Ö~times~×~Oslash~Ø~Ugrave~Ù~Uacute~Ú~Ucirc~Û~Uuml~Ü~Yacute~Ý~THORN~Þ~szlig~ß~agrave~à~aacute~á~acirc~â~atilde~ã~auml~ä~aring~å~aelig~æ~ccedil~ç~egrave~è~eacute~é~ecirc~ê~euml~ë~igrave~ì~iacute~í~icirc~î~iuml~ï~eth~ð~ntilde~ñ~ograve~ò~oacute~ó~ocirc~ô~otilde~õ~ouml~ö~divide~÷~oslash~ø~ugrave~ù~uacute~ú~ucirc~û~uuml~ü~yacute~ý~thorn~þ~yuml~ÿ~quot~"~amp~&~lt~<~gt~>`), r.namedReferences.html5 = n('Abreve~Ă~Acy~А~Afr~𝔄~Amacr~Ā~And~⩓~Aogon~Ą~Aopf~𝔸~ApplyFunction~⁡~Ascr~𝒜~Assign~≔~Backslash~∖~Barv~⫧~Barwed~⌆~Bcy~Б~Because~∵~Bernoullis~ℬ~Bfr~𝔅~Bopf~𝔹~Breve~˘~Bscr~ℬ~Bumpeq~≎~CHcy~Ч~Cacute~Ć~Cap~⋒~CapitalDifferentialD~ⅅ~Cayleys~ℭ~Ccaron~Č~Ccirc~Ĉ~Cconint~∰~Cdot~Ċ~Cedilla~¸~CenterDot~·~Cfr~ℭ~CircleDot~⊙~CircleMinus~⊖~CirclePlus~⊕~CircleTimes~⊗~ClockwiseContourIntegral~∲~CloseCurlyDoubleQuote~”~CloseCurlyQuote~’~Colon~∷~Colone~⩴~Congruent~≡~Conint~∯~ContourIntegral~∮~Copf~ℂ~Coproduct~∐~CounterClockwiseContourIntegral~∳~Cross~⨯~Cscr~𝒞~Cup~⋓~CupCap~≍~DD~ⅅ~DDotrahd~⤑~DJcy~Ђ~DScy~Ѕ~DZcy~Џ~Darr~↡~Dashv~⫤~Dcaron~Ď~Dcy~Д~Del~∇~Dfr~𝔇~DiacriticalAcute~´~DiacriticalDot~˙~DiacriticalDoubleAcute~˝~DiacriticalGrave~`~DiacriticalTilde~˜~Diamond~⋄~DifferentialD~ⅆ~Dopf~𝔻~Dot~¨~DotDot~⃜~DotEqual~≐~DoubleContourIntegral~∯~DoubleDot~¨~DoubleDownArrow~⇓~DoubleLeftArrow~⇐~DoubleLeftRightArrow~⇔~DoubleLeftTee~⫤~DoubleLongLeftArrow~⟸~DoubleLongLeftRightArrow~⟺~DoubleLongRightArrow~⟹~DoubleRightArrow~⇒~DoubleRightTee~⊨~DoubleUpArrow~⇑~DoubleUpDownArrow~⇕~DoubleVerticalBar~∥~DownArrow~↓~DownArrowBar~⤓~DownArrowUpArrow~⇵~DownBreve~̑~DownLeftRightVector~⥐~DownLeftTeeVector~⥞~DownLeftVector~↽~DownLeftVectorBar~⥖~DownRightTeeVector~⥟~DownRightVector~⇁~DownRightVectorBar~⥗~DownTee~⊤~DownTeeArrow~↧~Downarrow~⇓~Dscr~𝒟~Dstrok~Đ~ENG~Ŋ~Ecaron~Ě~Ecy~Э~Edot~Ė~Efr~𝔈~Element~∈~Emacr~Ē~EmptySmallSquare~◻~EmptyVerySmallSquare~▫~Eogon~Ę~Eopf~𝔼~Equal~⩵~EqualTilde~≂~Equilibrium~⇌~Escr~ℰ~Esim~⩳~Exists~∃~ExponentialE~ⅇ~Fcy~Ф~Ffr~𝔉~FilledSmallSquare~◼~FilledVerySmallSquare~▪~Fopf~𝔽~ForAll~∀~Fouriertrf~ℱ~Fscr~ℱ~GJcy~Ѓ~Gammad~Ϝ~Gbreve~Ğ~Gcedil~Ģ~Gcirc~Ĝ~Gcy~Г~Gdot~Ġ~Gfr~𝔊~Gg~⋙~Gopf~𝔾~GreaterEqual~≥~GreaterEqualLess~⋛~GreaterFullEqual~≧~GreaterGreater~⪢~GreaterLess~≷~GreaterSlantEqual~⩾~GreaterTilde~≳~Gscr~𝒢~Gt~≫~HARDcy~Ъ~Hacek~ˇ~Hat~^~Hcirc~Ĥ~Hfr~ℌ~HilbertSpace~ℋ~Hopf~ℍ~HorizontalLine~─~Hscr~ℋ~Hstrok~Ħ~HumpDownHump~≎~HumpEqual~≏~IEcy~Е~IJlig~Ĳ~IOcy~Ё~Icy~И~Idot~İ~Ifr~ℑ~Im~ℑ~Imacr~Ī~ImaginaryI~ⅈ~Implies~⇒~Int~∬~Integral~∫~Intersection~⋂~InvisibleComma~⁣~InvisibleTimes~⁢~Iogon~Į~Iopf~𝕀~Iscr~ℐ~Itilde~Ĩ~Iukcy~І~Jcirc~Ĵ~Jcy~Й~Jfr~𝔍~Jopf~𝕁~Jscr~𝒥~Jsercy~Ј~Jukcy~Є~KHcy~Х~KJcy~Ќ~Kcedil~Ķ~Kcy~К~Kfr~𝔎~Kopf~𝕂~Kscr~𝒦~LJcy~Љ~Lacute~Ĺ~Lang~⟪~Laplacetrf~ℒ~Larr~↞~Lcaron~Ľ~Lcedil~Ļ~Lcy~Л~LeftAngleBracket~⟨~LeftArrow~←~LeftArrowBar~⇤~LeftArrowRightArrow~⇆~LeftCeiling~⌈~LeftDoubleBracket~⟦~LeftDownTeeVector~⥡~LeftDownVector~⇃~LeftDownVectorBar~⥙~LeftFloor~⌊~LeftRightArrow~↔~LeftRightVector~⥎~LeftTee~⊣~LeftTeeArrow~↤~LeftTeeVector~⥚~LeftTriangle~⊲~LeftTriangleBar~⧏~LeftTriangleEqual~⊴~LeftUpDownVector~⥑~LeftUpTeeVector~⥠~LeftUpVector~↿~LeftUpVectorBar~⥘~LeftVector~↼~LeftVectorBar~⥒~Leftarrow~⇐~Leftrightarrow~⇔~LessEqualGreater~⋚~LessFullEqual~≦~LessGreater~≶~LessLess~⪡~LessSlantEqual~⩽~LessTilde~≲~Lfr~𝔏~Ll~⋘~Lleftarrow~⇚~Lmidot~Ŀ~LongLeftArrow~⟵~LongLeftRightArrow~⟷~LongRightArrow~⟶~Longleftarrow~⟸~Longleftrightarrow~⟺~Longrightarrow~⟹~Lopf~𝕃~LowerLeftArrow~↙~LowerRightArrow~↘~Lscr~ℒ~Lsh~↰~Lstrok~Ł~Lt~≪~Map~⤅~Mcy~М~MediumSpace~ ~Mellintrf~ℳ~Mfr~𝔐~MinusPlus~∓~Mopf~𝕄~Mscr~ℳ~NJcy~Њ~Nacute~Ń~Ncaron~Ň~Ncedil~Ņ~Ncy~Н~NegativeMediumSpace~​~NegativeThickSpace~​~NegativeThinSpace~​~NegativeVeryThinSpace~​~NestedGreaterGreater~≫~NestedLessLess~≪~NewLine~\n~Nfr~𝔑~NoBreak~⁠~NonBreakingSpace~ ~Nopf~ℕ~Not~⫬~NotCongruent~≢~NotCupCap~≭~NotDoubleVerticalBar~∦~NotElement~∉~NotEqual~≠~NotEqualTilde~≂̸~NotExists~∄~NotGreater~≯~NotGreaterEqual~≱~NotGreaterFullEqual~≧̸~NotGreaterGreater~≫̸~NotGreaterLess~≹~NotGreaterSlantEqual~⩾̸~NotGreaterTilde~≵~NotHumpDownHump~≎̸~NotHumpEqual~≏̸~NotLeftTriangle~⋪~NotLeftTriangleBar~⧏̸~NotLeftTriangleEqual~⋬~NotLess~≮~NotLessEqual~≰~NotLessGreater~≸~NotLessLess~≪̸~NotLessSlantEqual~⩽̸~NotLessTilde~≴~NotNestedGreaterGreater~⪢̸~NotNestedLessLess~⪡̸~NotPrecedes~⊀~NotPrecedesEqual~⪯̸~NotPrecedesSlantEqual~⋠~NotReverseElement~∌~NotRightTriangle~⋫~NotRightTriangleBar~⧐̸~NotRightTriangleEqual~⋭~NotSquareSubset~⊏̸~NotSquareSubsetEqual~⋢~NotSquareSuperset~⊐̸~NotSquareSupersetEqual~⋣~NotSubset~⊂⃒~NotSubsetEqual~⊈~NotSucceeds~⊁~NotSucceedsEqual~⪰̸~NotSucceedsSlantEqual~⋡~NotSucceedsTilde~≿̸~NotSuperset~⊃⃒~NotSupersetEqual~⊉~NotTilde~≁~NotTildeEqual~≄~NotTildeFullEqual~≇~NotTildeTilde~≉~NotVerticalBar~∤~Nscr~𝒩~Ocy~О~Odblac~Ő~Ofr~𝔒~Omacr~Ō~Oopf~𝕆~OpenCurlyDoubleQuote~“~OpenCurlyQuote~‘~Or~⩔~Oscr~𝒪~Otimes~⨷~OverBar~‾~OverBrace~⏞~OverBracket~⎴~OverParenthesis~⏜~PartialD~∂~Pcy~П~Pfr~𝔓~PlusMinus~±~Poincareplane~ℌ~Popf~ℙ~Pr~⪻~Precedes~≺~PrecedesEqual~⪯~PrecedesSlantEqual~≼~PrecedesTilde~≾~Product~∏~Proportion~∷~Proportional~∝~Pscr~𝒫~Qfr~𝔔~Qopf~ℚ~Qscr~𝒬~RBarr~⤐~Racute~Ŕ~Rang~⟫~Rarr~↠~Rarrtl~⤖~Rcaron~Ř~Rcedil~Ŗ~Rcy~Р~Re~ℜ~ReverseElement~∋~ReverseEquilibrium~⇋~ReverseUpEquilibrium~⥯~Rfr~ℜ~RightAngleBracket~⟩~RightArrow~→~RightArrowBar~⇥~RightArrowLeftArrow~⇄~RightCeiling~⌉~RightDoubleBracket~⟧~RightDownTeeVector~⥝~RightDownVector~⇂~RightDownVectorBar~⥕~RightFloor~⌋~RightTee~⊢~RightTeeArrow~↦~RightTeeVector~⥛~RightTriangle~⊳~RightTriangleBar~⧐~RightTriangleEqual~⊵~RightUpDownVector~⥏~RightUpTeeVector~⥜~RightUpVector~↾~RightUpVectorBar~⥔~RightVector~⇀~RightVectorBar~⥓~Rightarrow~⇒~Ropf~ℝ~RoundImplies~⥰~Rrightarrow~⇛~Rscr~ℛ~Rsh~↱~RuleDelayed~⧴~SHCHcy~Щ~SHcy~Ш~SOFTcy~Ь~Sacute~Ś~Sc~⪼~Scedil~Ş~Scirc~Ŝ~Scy~С~Sfr~𝔖~ShortDownArrow~↓~ShortLeftArrow~←~ShortRightArrow~→~ShortUpArrow~↑~SmallCircle~∘~Sopf~𝕊~Sqrt~√~Square~□~SquareIntersection~⊓~SquareSubset~⊏~SquareSubsetEqual~⊑~SquareSuperset~⊐~SquareSupersetEqual~⊒~SquareUnion~⊔~Sscr~𝒮~Star~⋆~Sub~⋐~Subset~⋐~SubsetEqual~⊆~Succeeds~≻~SucceedsEqual~⪰~SucceedsSlantEqual~≽~SucceedsTilde~≿~SuchThat~∋~Sum~∑~Sup~⋑~Superset~⊃~SupersetEqual~⊇~Supset~⋑~TRADE~™~TSHcy~Ћ~TScy~Ц~Tab~	~Tcaron~Ť~Tcedil~Ţ~Tcy~Т~Tfr~𝔗~Therefore~∴~ThickSpace~  ~ThinSpace~ ~Tilde~∼~TildeEqual~≃~TildeFullEqual~≅~TildeTilde~≈~Topf~𝕋~TripleDot~⃛~Tscr~𝒯~Tstrok~Ŧ~Uarr~↟~Uarrocir~⥉~Ubrcy~Ў~Ubreve~Ŭ~Ucy~У~Udblac~Ű~Ufr~𝔘~Umacr~Ū~UnderBar~_~UnderBrace~⏟~UnderBracket~⎵~UnderParenthesis~⏝~Union~⋃~UnionPlus~⊎~Uogon~Ų~Uopf~𝕌~UpArrow~↑~UpArrowBar~⤒~UpArrowDownArrow~⇅~UpDownArrow~↕~UpEquilibrium~⥮~UpTee~⊥~UpTeeArrow~↥~Uparrow~⇑~Updownarrow~⇕~UpperLeftArrow~↖~UpperRightArrow~↗~Upsi~ϒ~Uring~Ů~Uscr~𝒰~Utilde~Ũ~VDash~⊫~Vbar~⫫~Vcy~В~Vdash~⊩~Vdashl~⫦~Vee~⋁~Verbar~‖~Vert~‖~VerticalBar~∣~VerticalLine~|~VerticalSeparator~❘~VerticalTilde~≀~VeryThinSpace~ ~Vfr~𝔙~Vopf~𝕍~Vscr~𝒱~Vvdash~⊪~Wcirc~Ŵ~Wedge~⋀~Wfr~𝔚~Wopf~𝕎~Wscr~𝒲~Xfr~𝔛~Xopf~𝕏~Xscr~𝒳~YAcy~Я~YIcy~Ї~YUcy~Ю~Ycirc~Ŷ~Ycy~Ы~Yfr~𝔜~Yopf~𝕐~Yscr~𝒴~ZHcy~Ж~Zacute~Ź~Zcaron~Ž~Zcy~З~Zdot~Ż~ZeroWidthSpace~​~Zfr~ℨ~Zopf~ℤ~Zscr~𝒵~abreve~ă~ac~∾~acE~∾̳~acd~∿~acy~а~af~⁡~afr~𝔞~aleph~ℵ~amacr~ā~amalg~⨿~andand~⩕~andd~⩜~andslope~⩘~andv~⩚~ange~⦤~angle~∠~angmsd~∡~angmsdaa~⦨~angmsdab~⦩~angmsdac~⦪~angmsdad~⦫~angmsdae~⦬~angmsdaf~⦭~angmsdag~⦮~angmsdah~⦯~angrt~∟~angrtvb~⊾~angrtvbd~⦝~angsph~∢~angst~Å~angzarr~⍼~aogon~ą~aopf~𝕒~ap~≈~apE~⩰~apacir~⩯~ape~≊~apid~≋~approx~≈~approxeq~≊~ascr~𝒶~ast~*~asympeq~≍~awconint~∳~awint~⨑~bNot~⫭~backcong~≌~backepsilon~϶~backprime~‵~backsim~∽~backsimeq~⋍~barvee~⊽~barwed~⌅~barwedge~⌅~bbrk~⎵~bbrktbrk~⎶~bcong~≌~bcy~б~becaus~∵~because~∵~bemptyv~⦰~bepsi~϶~bernou~ℬ~beth~ℶ~between~≬~bfr~𝔟~bigcap~⋂~bigcirc~◯~bigcup~⋃~bigodot~⨀~bigoplus~⨁~bigotimes~⨂~bigsqcup~⨆~bigstar~★~bigtriangledown~▽~bigtriangleup~△~biguplus~⨄~bigvee~⋁~bigwedge~⋀~bkarow~⤍~blacklozenge~⧫~blacksquare~▪~blacktriangle~▴~blacktriangledown~▾~blacktriangleleft~◂~blacktriangleright~▸~blank~␣~blk12~▒~blk14~░~blk34~▓~block~█~bne~=⃥~bnequiv~≡⃥~bnot~⌐~bopf~𝕓~bot~⊥~bottom~⊥~bowtie~⋈~boxDL~╗~boxDR~╔~boxDl~╖~boxDr~╓~boxH~═~boxHD~╦~boxHU~╩~boxHd~╤~boxHu~╧~boxUL~╝~boxUR~╚~boxUl~╜~boxUr~╙~boxV~║~boxVH~╬~boxVL~╣~boxVR~╠~boxVh~╫~boxVl~╢~boxVr~╟~boxbox~⧉~boxdL~╕~boxdR~╒~boxdl~┐~boxdr~┌~boxh~─~boxhD~╥~boxhU~╨~boxhd~┬~boxhu~┴~boxminus~⊟~boxplus~⊞~boxtimes~⊠~boxuL~╛~boxuR~╘~boxul~┘~boxur~└~boxv~│~boxvH~╪~boxvL~╡~boxvR~╞~boxvh~┼~boxvl~┤~boxvr~├~bprime~‵~breve~˘~bscr~𝒷~bsemi~⁏~bsim~∽~bsime~⋍~bsol~\\~bsolb~⧅~bsolhsub~⟈~bullet~•~bump~≎~bumpE~⪮~bumpe~≏~bumpeq~≏~cacute~ć~capand~⩄~capbrcup~⩉~capcap~⩋~capcup~⩇~capdot~⩀~caps~∩︀~caret~⁁~caron~ˇ~ccaps~⩍~ccaron~č~ccirc~ĉ~ccups~⩌~ccupssm~⩐~cdot~ċ~cemptyv~⦲~centerdot~·~cfr~𝔠~chcy~ч~check~✓~checkmark~✓~cir~○~cirE~⧃~circeq~≗~circlearrowleft~↺~circlearrowright~↻~circledR~®~circledS~Ⓢ~circledast~⊛~circledcirc~⊚~circleddash~⊝~cire~≗~cirfnint~⨐~cirmid~⫯~cirscir~⧂~clubsuit~♣~colon~:~colone~≔~coloneq~≔~comma~,~commat~@~comp~∁~compfn~∘~complement~∁~complexes~ℂ~congdot~⩭~conint~∮~copf~𝕔~coprod~∐~copysr~℗~cross~✗~cscr~𝒸~csub~⫏~csube~⫑~csup~⫐~csupe~⫒~ctdot~⋯~cudarrl~⤸~cudarrr~⤵~cuepr~⋞~cuesc~⋟~cularr~↶~cularrp~⤽~cupbrcap~⩈~cupcap~⩆~cupcup~⩊~cupdot~⊍~cupor~⩅~cups~∪︀~curarr~↷~curarrm~⤼~curlyeqprec~⋞~curlyeqsucc~⋟~curlyvee~⋎~curlywedge~⋏~curvearrowleft~↶~curvearrowright~↷~cuvee~⋎~cuwed~⋏~cwconint~∲~cwint~∱~cylcty~⌭~dHar~⥥~daleth~ℸ~dash~‐~dashv~⊣~dbkarow~⤏~dblac~˝~dcaron~ď~dcy~д~dd~ⅆ~ddagger~‡~ddarr~⇊~ddotseq~⩷~demptyv~⦱~dfisht~⥿~dfr~𝔡~dharl~⇃~dharr~⇂~diam~⋄~diamond~⋄~diamondsuit~♦~die~¨~digamma~ϝ~disin~⋲~div~÷~divideontimes~⋇~divonx~⋇~djcy~ђ~dlcorn~⌞~dlcrop~⌍~dollar~$~dopf~𝕕~dot~˙~doteq~≐~doteqdot~≑~dotminus~∸~dotplus~∔~dotsquare~⊡~doublebarwedge~⌆~downarrow~↓~downdownarrows~⇊~downharpoonleft~⇃~downharpoonright~⇂~drbkarow~⤐~drcorn~⌟~drcrop~⌌~dscr~𝒹~dscy~ѕ~dsol~⧶~dstrok~đ~dtdot~⋱~dtri~▿~dtrif~▾~duarr~⇵~duhar~⥯~dwangle~⦦~dzcy~џ~dzigrarr~⟿~eDDot~⩷~eDot~≑~easter~⩮~ecaron~ě~ecir~≖~ecolon~≕~ecy~э~edot~ė~ee~ⅇ~efDot~≒~efr~𝔢~eg~⪚~egs~⪖~egsdot~⪘~el~⪙~elinters~⏧~ell~ℓ~els~⪕~elsdot~⪗~emacr~ē~emptyset~∅~emptyv~∅~emsp13~ ~emsp14~ ~eng~ŋ~eogon~ę~eopf~𝕖~epar~⋕~eparsl~⧣~eplus~⩱~epsi~ε~epsiv~ϵ~eqcirc~≖~eqcolon~≕~eqsim~≂~eqslantgtr~⪖~eqslantless~⪕~equals~=~equest~≟~equivDD~⩸~eqvparsl~⧥~erDot~≓~erarr~⥱~escr~ℯ~esdot~≐~esim~≂~excl~!~expectation~ℰ~exponentiale~ⅇ~fallingdotseq~≒~fcy~ф~female~♀~ffilig~ﬃ~fflig~ﬀ~ffllig~ﬄ~ffr~𝔣~filig~ﬁ~fjlig~fj~flat~♭~fllig~ﬂ~fltns~▱~fopf~𝕗~fork~⋔~forkv~⫙~fpartint~⨍~frac13~⅓~frac15~⅕~frac16~⅙~frac18~⅛~frac23~⅔~frac25~⅖~frac35~⅗~frac38~⅜~frac45~⅘~frac56~⅚~frac58~⅝~frac78~⅞~frown~⌢~fscr~𝒻~gE~≧~gEl~⪌~gacute~ǵ~gammad~ϝ~gap~⪆~gbreve~ğ~gcirc~ĝ~gcy~г~gdot~ġ~gel~⋛~geq~≥~geqq~≧~geqslant~⩾~ges~⩾~gescc~⪩~gesdot~⪀~gesdoto~⪂~gesdotol~⪄~gesl~⋛︀~gesles~⪔~gfr~𝔤~gg~≫~ggg~⋙~gimel~ℷ~gjcy~ѓ~gl~≷~glE~⪒~gla~⪥~glj~⪤~gnE~≩~gnap~⪊~gnapprox~⪊~gne~⪈~gneq~⪈~gneqq~≩~gnsim~⋧~gopf~𝕘~grave~`~gscr~ℊ~gsim~≳~gsime~⪎~gsiml~⪐~gtcc~⪧~gtcir~⩺~gtdot~⋗~gtlPar~⦕~gtquest~⩼~gtrapprox~⪆~gtrarr~⥸~gtrdot~⋗~gtreqless~⋛~gtreqqless~⪌~gtrless~≷~gtrsim~≳~gvertneqq~≩︀~gvnE~≩︀~hairsp~ ~half~½~hamilt~ℋ~hardcy~ъ~harrcir~⥈~harrw~↭~hbar~ℏ~hcirc~ĥ~heartsuit~♥~hercon~⊹~hfr~𝔥~hksearow~⤥~hkswarow~⤦~hoarr~⇿~homtht~∻~hookleftarrow~↩~hookrightarrow~↪~hopf~𝕙~horbar~―~hscr~𝒽~hslash~ℏ~hstrok~ħ~hybull~⁃~hyphen~‐~ic~⁣~icy~и~iecy~е~iff~⇔~ifr~𝔦~ii~ⅈ~iiiint~⨌~iiint~∭~iinfin~⧜~iiota~℩~ijlig~ĳ~imacr~ī~imagline~ℐ~imagpart~ℑ~imath~ı~imof~⊷~imped~Ƶ~in~∈~incare~℅~infintie~⧝~inodot~ı~intcal~⊺~integers~ℤ~intercal~⊺~intlarhk~⨗~intprod~⨼~iocy~ё~iogon~į~iopf~𝕚~iprod~⨼~iscr~𝒾~isinE~⋹~isindot~⋵~isins~⋴~isinsv~⋳~isinv~∈~it~⁢~itilde~ĩ~iukcy~і~jcirc~ĵ~jcy~й~jfr~𝔧~jmath~ȷ~jopf~𝕛~jscr~𝒿~jsercy~ј~jukcy~є~kappav~ϰ~kcedil~ķ~kcy~к~kfr~𝔨~kgreen~ĸ~khcy~х~kjcy~ќ~kopf~𝕜~kscr~𝓀~lAarr~⇚~lAtail~⤛~lBarr~⤎~lE~≦~lEg~⪋~lHar~⥢~lacute~ĺ~laemptyv~⦴~lagran~ℒ~langd~⦑~langle~⟨~lap~⪅~larrb~⇤~larrbfs~⤟~larrfs~⤝~larrhk~↩~larrlp~↫~larrpl~⤹~larrsim~⥳~larrtl~↢~lat~⪫~latail~⤙~late~⪭~lates~⪭︀~lbarr~⤌~lbbrk~❲~lbrace~{~lbrack~[~lbrke~⦋~lbrksld~⦏~lbrkslu~⦍~lcaron~ľ~lcedil~ļ~lcub~{~lcy~л~ldca~⤶~ldquor~„~ldrdhar~⥧~ldrushar~⥋~ldsh~↲~leftarrow~←~leftarrowtail~↢~leftharpoondown~↽~leftharpoonup~↼~leftleftarrows~⇇~leftrightarrow~↔~leftrightarrows~⇆~leftrightharpoons~⇋~leftrightsquigarrow~↭~leftthreetimes~⋋~leg~⋚~leq~≤~leqq~≦~leqslant~⩽~les~⩽~lescc~⪨~lesdot~⩿~lesdoto~⪁~lesdotor~⪃~lesg~⋚︀~lesges~⪓~lessapprox~⪅~lessdot~⋖~lesseqgtr~⋚~lesseqqgtr~⪋~lessgtr~≶~lesssim~≲~lfisht~⥼~lfr~𝔩~lg~≶~lgE~⪑~lhard~↽~lharu~↼~lharul~⥪~lhblk~▄~ljcy~љ~ll~≪~llarr~⇇~llcorner~⌞~llhard~⥫~lltri~◺~lmidot~ŀ~lmoust~⎰~lmoustache~⎰~lnE~≨~lnap~⪉~lnapprox~⪉~lne~⪇~lneq~⪇~lneqq~≨~lnsim~⋦~loang~⟬~loarr~⇽~lobrk~⟦~longleftarrow~⟵~longleftrightarrow~⟷~longmapsto~⟼~longrightarrow~⟶~looparrowleft~↫~looparrowright~↬~lopar~⦅~lopf~𝕝~loplus~⨭~lotimes~⨴~lowbar~_~lozenge~◊~lozf~⧫~lpar~(~lparlt~⦓~lrarr~⇆~lrcorner~⌟~lrhar~⇋~lrhard~⥭~lrtri~⊿~lscr~𝓁~lsh~↰~lsim~≲~lsime~⪍~lsimg~⪏~lsqb~[~lsquor~‚~lstrok~ł~ltcc~⪦~ltcir~⩹~ltdot~⋖~lthree~⋋~ltimes~⋉~ltlarr~⥶~ltquest~⩻~ltrPar~⦖~ltri~◃~ltrie~⊴~ltrif~◂~lurdshar~⥊~luruhar~⥦~lvertneqq~≨︀~lvnE~≨︀~mDDot~∺~male~♂~malt~✠~maltese~✠~map~↦~mapsto~↦~mapstodown~↧~mapstoleft~↤~mapstoup~↥~marker~▮~mcomma~⨩~mcy~м~measuredangle~∡~mfr~𝔪~mho~℧~mid~∣~midast~*~midcir~⫰~minusb~⊟~minusd~∸~minusdu~⨪~mlcp~⫛~mldr~…~mnplus~∓~models~⊧~mopf~𝕞~mp~∓~mscr~𝓂~mstpos~∾~multimap~⊸~mumap~⊸~nGg~⋙̸~nGt~≫⃒~nGtv~≫̸~nLeftarrow~⇍~nLeftrightarrow~⇎~nLl~⋘̸~nLt~≪⃒~nLtv~≪̸~nRightarrow~⇏~nVDash~⊯~nVdash~⊮~nacute~ń~nang~∠⃒~nap~≉~napE~⩰̸~napid~≋̸~napos~ŉ~napprox~≉~natur~♮~natural~♮~naturals~ℕ~nbump~≎̸~nbumpe~≏̸~ncap~⩃~ncaron~ň~ncedil~ņ~ncong~≇~ncongdot~⩭̸~ncup~⩂~ncy~н~neArr~⇗~nearhk~⤤~nearr~↗~nearrow~↗~nedot~≐̸~nequiv~≢~nesear~⤨~nesim~≂̸~nexist~∄~nexists~∄~nfr~𝔫~ngE~≧̸~nge~≱~ngeq~≱~ngeqq~≧̸~ngeqslant~⩾̸~nges~⩾̸~ngsim~≵~ngt~≯~ngtr~≯~nhArr~⇎~nharr~↮~nhpar~⫲~nis~⋼~nisd~⋺~niv~∋~njcy~њ~nlArr~⇍~nlE~≦̸~nlarr~↚~nldr~‥~nle~≰~nleftarrow~↚~nleftrightarrow~↮~nleq~≰~nleqq~≦̸~nleqslant~⩽̸~nles~⩽̸~nless~≮~nlsim~≴~nlt~≮~nltri~⋪~nltrie~⋬~nmid~∤~nopf~𝕟~notinE~⋹̸~notindot~⋵̸~notinva~∉~notinvb~⋷~notinvc~⋶~notni~∌~notniva~∌~notnivb~⋾~notnivc~⋽~npar~∦~nparallel~∦~nparsl~⫽⃥~npart~∂̸~npolint~⨔~npr~⊀~nprcue~⋠~npre~⪯̸~nprec~⊀~npreceq~⪯̸~nrArr~⇏~nrarr~↛~nrarrc~⤳̸~nrarrw~↝̸~nrightarrow~↛~nrtri~⋫~nrtrie~⋭~nsc~⊁~nsccue~⋡~nsce~⪰̸~nscr~𝓃~nshortmid~∤~nshortparallel~∦~nsim~≁~nsime~≄~nsimeq~≄~nsmid~∤~nspar~∦~nsqsube~⋢~nsqsupe~⋣~nsubE~⫅̸~nsube~⊈~nsubset~⊂⃒~nsubseteq~⊈~nsubseteqq~⫅̸~nsucc~⊁~nsucceq~⪰̸~nsup~⊅~nsupE~⫆̸~nsupe~⊉~nsupset~⊃⃒~nsupseteq~⊉~nsupseteqq~⫆̸~ntgl~≹~ntlg~≸~ntriangleleft~⋪~ntrianglelefteq~⋬~ntriangleright~⋫~ntrianglerighteq~⋭~num~#~numero~№~numsp~ ~nvDash~⊭~nvHarr~⤄~nvap~≍⃒~nvdash~⊬~nvge~≥⃒~nvgt~>⃒~nvinfin~⧞~nvlArr~⤂~nvle~≤⃒~nvlt~<⃒~nvltrie~⊴⃒~nvrArr~⤃~nvrtrie~⊵⃒~nvsim~∼⃒~nwArr~⇖~nwarhk~⤣~nwarr~↖~nwarrow~↖~nwnear~⤧~oS~Ⓢ~oast~⊛~ocir~⊚~ocy~о~odash~⊝~odblac~ő~odiv~⨸~odot~⊙~odsold~⦼~ofcir~⦿~ofr~𝔬~ogon~˛~ogt~⧁~ohbar~⦵~ohm~Ω~oint~∮~olarr~↺~olcir~⦾~olcross~⦻~olt~⧀~omacr~ō~omid~⦶~ominus~⊖~oopf~𝕠~opar~⦷~operp~⦹~orarr~↻~ord~⩝~order~ℴ~orderof~ℴ~origof~⊶~oror~⩖~orslope~⩗~orv~⩛~oscr~ℴ~osol~⊘~otimesas~⨶~ovbar~⌽~par~∥~parallel~∥~parsim~⫳~parsl~⫽~pcy~п~percnt~%~period~.~pertenk~‱~pfr~𝔭~phiv~ϕ~phmmat~ℳ~phone~☎~pitchfork~⋔~planck~ℏ~planckh~ℎ~plankv~ℏ~plus~+~plusacir~⨣~plusb~⊞~pluscir~⨢~plusdo~∔~plusdu~⨥~pluse~⩲~plussim~⨦~plustwo~⨧~pm~±~pointint~⨕~popf~𝕡~pr~≺~prE~⪳~prap~⪷~prcue~≼~pre~⪯~prec~≺~precapprox~⪷~preccurlyeq~≼~preceq~⪯~precnapprox~⪹~precneqq~⪵~precnsim~⋨~precsim~≾~primes~ℙ~prnE~⪵~prnap~⪹~prnsim~⋨~profalar~⌮~profline~⌒~profsurf~⌓~propto~∝~prsim~≾~prurel~⊰~pscr~𝓅~puncsp~ ~qfr~𝔮~qint~⨌~qopf~𝕢~qprime~⁗~qscr~𝓆~quaternions~ℍ~quatint~⨖~quest~?~questeq~≟~rAarr~⇛~rAtail~⤜~rBarr~⤏~rHar~⥤~race~∽̱~racute~ŕ~raemptyv~⦳~rangd~⦒~range~⦥~rangle~⟩~rarrap~⥵~rarrb~⇥~rarrbfs~⤠~rarrc~⤳~rarrfs~⤞~rarrhk~↪~rarrlp~↬~rarrpl~⥅~rarrsim~⥴~rarrtl~↣~rarrw~↝~ratail~⤚~ratio~∶~rationals~ℚ~rbarr~⤍~rbbrk~❳~rbrace~}~rbrack~]~rbrke~⦌~rbrksld~⦎~rbrkslu~⦐~rcaron~ř~rcedil~ŗ~rcub~}~rcy~р~rdca~⤷~rdldhar~⥩~rdquor~”~rdsh~↳~realine~ℛ~realpart~ℜ~reals~ℝ~rect~▭~rfisht~⥽~rfr~𝔯~rhard~⇁~rharu~⇀~rharul~⥬~rhov~ϱ~rightarrow~→~rightarrowtail~↣~rightharpoondown~⇁~rightharpoonup~⇀~rightleftarrows~⇄~rightleftharpoons~⇌~rightrightarrows~⇉~rightsquigarrow~↝~rightthreetimes~⋌~ring~˚~risingdotseq~≓~rlarr~⇄~rlhar~⇌~rmoust~⎱~rmoustache~⎱~rnmid~⫮~roang~⟭~roarr~⇾~robrk~⟧~ropar~⦆~ropf~𝕣~roplus~⨮~rotimes~⨵~rpar~)~rpargt~⦔~rppolint~⨒~rrarr~⇉~rscr~𝓇~rsh~↱~rsqb~]~rsquor~’~rthree~⋌~rtimes~⋊~rtri~▹~rtrie~⊵~rtrif~▸~rtriltri~⧎~ruluhar~⥨~rx~℞~sacute~ś~sc~≻~scE~⪴~scap~⪸~sccue~≽~sce~⪰~scedil~ş~scirc~ŝ~scnE~⪶~scnap~⪺~scnsim~⋩~scpolint~⨓~scsim~≿~scy~с~sdotb~⊡~sdote~⩦~seArr~⇘~searhk~⤥~searr~↘~searrow~↘~semi~;~seswar~⤩~setminus~∖~setmn~∖~sext~✶~sfr~𝔰~sfrown~⌢~sharp~♯~shchcy~щ~shcy~ш~shortmid~∣~shortparallel~∥~sigmav~ς~simdot~⩪~sime~≃~simeq~≃~simg~⪞~simgE~⪠~siml~⪝~simlE~⪟~simne~≆~simplus~⨤~simrarr~⥲~slarr~←~smallsetminus~∖~smashp~⨳~smeparsl~⧤~smid~∣~smile~⌣~smt~⪪~smte~⪬~smtes~⪬︀~softcy~ь~sol~/~solb~⧄~solbar~⌿~sopf~𝕤~spadesuit~♠~spar~∥~sqcap~⊓~sqcaps~⊓︀~sqcup~⊔~sqcups~⊔︀~sqsub~⊏~sqsube~⊑~sqsubset~⊏~sqsubseteq~⊑~sqsup~⊐~sqsupe~⊒~sqsupset~⊐~sqsupseteq~⊒~squ~□~square~□~squarf~▪~squf~▪~srarr~→~sscr~𝓈~ssetmn~∖~ssmile~⌣~sstarf~⋆~star~☆~starf~★~straightepsilon~ϵ~straightphi~ϕ~strns~¯~subE~⫅~subdot~⪽~subedot~⫃~submult~⫁~subnE~⫋~subne~⊊~subplus~⪿~subrarr~⥹~subset~⊂~subseteq~⊆~subseteqq~⫅~subsetneq~⊊~subsetneqq~⫋~subsim~⫇~subsub~⫕~subsup~⫓~succ~≻~succapprox~⪸~succcurlyeq~≽~succeq~⪰~succnapprox~⪺~succneqq~⪶~succnsim~⋩~succsim~≿~sung~♪~supE~⫆~supdot~⪾~supdsub~⫘~supedot~⫄~suphsol~⟉~suphsub~⫗~suplarr~⥻~supmult~⫂~supnE~⫌~supne~⊋~supplus~⫀~supset~⊃~supseteq~⊇~supseteqq~⫆~supsetneq~⊋~supsetneqq~⫌~supsim~⫈~supsub~⫔~supsup~⫖~swArr~⇙~swarhk~⤦~swarr~↙~swarrow~↙~swnwar~⤪~target~⌖~tbrk~⎴~tcaron~ť~tcedil~ţ~tcy~т~tdot~⃛~telrec~⌕~tfr~𝔱~therefore~∴~thetav~ϑ~thickapprox~≈~thicksim~∼~thkap~≈~thksim~∼~timesb~⊠~timesbar~⨱~timesd~⨰~tint~∭~toea~⤨~top~⊤~topbot~⌶~topcir~⫱~topf~𝕥~topfork~⫚~tosa~⤩~tprime~‴~triangle~▵~triangledown~▿~triangleleft~◃~trianglelefteq~⊴~triangleq~≜~triangleright~▹~trianglerighteq~⊵~tridot~◬~trie~≜~triminus~⨺~triplus~⨹~trisb~⧍~tritime~⨻~trpezium~⏢~tscr~𝓉~tscy~ц~tshcy~ћ~tstrok~ŧ~twixt~≬~twoheadleftarrow~↞~twoheadrightarrow~↠~uHar~⥣~ubrcy~ў~ubreve~ŭ~ucy~у~udarr~⇅~udblac~ű~udhar~⥮~ufisht~⥾~ufr~𝔲~uharl~↿~uharr~↾~uhblk~▀~ulcorn~⌜~ulcorner~⌜~ulcrop~⌏~ultri~◸~umacr~ū~uogon~ų~uopf~𝕦~uparrow~↑~updownarrow~↕~upharpoonleft~↿~upharpoonright~↾~uplus~⊎~upsi~υ~upuparrows~⇈~urcorn~⌝~urcorner~⌝~urcrop~⌎~uring~ů~urtri~◹~uscr~𝓊~utdot~⋰~utilde~ũ~utri~▵~utrif~▴~uuarr~⇈~uwangle~⦧~vArr~⇕~vBar~⫨~vBarv~⫩~vDash~⊨~vangrt~⦜~varepsilon~ϵ~varkappa~ϰ~varnothing~∅~varphi~ϕ~varpi~ϖ~varpropto~∝~varr~↕~varrho~ϱ~varsigma~ς~varsubsetneq~⊊︀~varsubsetneqq~⫋︀~varsupsetneq~⊋︀~varsupsetneqq~⫌︀~vartheta~ϑ~vartriangleleft~⊲~vartriangleright~⊳~vcy~в~vdash~⊢~vee~∨~veebar~⊻~veeeq~≚~vellip~⋮~verbar~|~vert~|~vfr~𝔳~vltri~⊲~vnsub~⊂⃒~vnsup~⊃⃒~vopf~𝕧~vprop~∝~vrtri~⊳~vscr~𝓋~vsubnE~⫋︀~vsubne~⊊︀~vsupnE~⫌︀~vsupne~⊋︀~vzigzag~⦚~wcirc~ŵ~wedbar~⩟~wedge~∧~wedgeq~≙~wfr~𝔴~wopf~𝕨~wp~℘~wr~≀~wreath~≀~wscr~𝓌~xcap~⋂~xcirc~◯~xcup~⋃~xdtri~▽~xfr~𝔵~xhArr~⟺~xharr~⟷~xlArr~⟸~xlarr~⟵~xmap~⟼~xnis~⋻~xodot~⨀~xopf~𝕩~xoplus~⨁~xotime~⨂~xrArr~⟹~xrarr~⟶~xscr~𝓍~xsqcup~⨆~xuplus~⨄~xutri~△~xvee~⋁~xwedge~⋀~yacy~я~ycirc~ŷ~ycy~ы~yfr~𝔶~yicy~ї~yopf~𝕪~yscr~𝓎~yucy~ю~zacute~ź~zcaron~ž~zcy~з~zdot~ż~zeetrf~ℨ~zfr~𝔷~zhcy~ж~zigrarr~⇝~zopf~𝕫~zscr~𝓏~~AMP~&~COPY~©~GT~>~LT~<~QUOT~"~REG~®', r.namedReferences.html4);
})(Lh);
var Gs = {};
Object.defineProperty(Gs, "__esModule", { value: !0 });
Gs.numericUnicodeMap = void 0;
Gs.numericUnicodeMap = {
  0: 65533,
  128: 8364,
  130: 8218,
  131: 402,
  132: 8222,
  133: 8230,
  134: 8224,
  135: 8225,
  136: 710,
  137: 8240,
  138: 352,
  139: 8249,
  140: 338,
  142: 381,
  145: 8216,
  146: 8217,
  147: 8220,
  148: 8221,
  149: 8226,
  150: 8211,
  151: 8212,
  152: 732,
  153: 8482,
  154: 353,
  155: 8250,
  156: 339,
  158: 382,
  159: 376
};
var At = {};
Object.defineProperty(At, "__esModule", { value: !0 });
At.highSurrogateTo = At.highSurrogateFrom = At.getCodePoint = At.fromCodePoint = void 0;
At.fromCodePoint = String.fromCodePoint || function(r) {
  return String.fromCharCode(Math.floor((r - 65536) / 1024) + 55296, (r - 65536) % 1024 + 56320);
};
At.getCodePoint = String.prototype.codePointAt ? function(r, e) {
  return r.codePointAt(e);
} : function(r, e) {
  return (r.charCodeAt(e) - 55296) * 1024 + r.charCodeAt(e + 1) - 56320 + 65536;
};
At.highSurrogateFrom = 55296;
At.highSurrogateTo = 56319;
var Ui = ns && ns.__assign || function() {
  return Ui = Object.assign || function(r) {
    for (var e, t = 1, i = arguments.length; t < i; t++) {
      e = arguments[t];
      for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (r[n] = e[n]);
    }
    return r;
  }, Ui.apply(this, arguments);
};
Object.defineProperty(Da, "__esModule", { value: !0 });
Da.encode = Wm;
Da.decodeEntity = Vm;
Da.decode = Gm;
var Rn = Lh, Mm = Gs, Mh = At, Kc = Ui(Ui({}, Rn.namedReferences), { all: Rn.namedReferences.html5 }), Um = {
  specialChars: /[<>'"&]/g,
  nonAscii: /[<>'"&\u0080-\uD7FF\uE000-\uFFFF\uDC00-\uDFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]?/g,
  nonAsciiPrintable: /[<>'"&\x01-\x08\x11-\x15\x17-\x1F\x7f-\uD7FF\uE000-\uFFFF\uDC00-\uDFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]?/g,
  nonAsciiPrintableOnly: /[\x01-\x08\x11-\x15\x17-\x1F\x7f-\uD7FF\uE000-\uFFFF\uDC00-\uDFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]?/g,
  extensive: /[\x01-\x0c\x0e-\x1f\x21-\x2c\x2e-\x2f\x3a-\x40\x5b-\x60\x7b-\x7d\x7f-\uD7FF\uE000-\uFFFF\uDC00-\uDFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]?/g
}, $m = {
  mode: "specialChars",
  level: "all",
  numeric: "decimal"
};
function Wm(r, e) {
  var t = e === void 0 ? $m : e, i = t.mode, n = i === void 0 ? "specialChars" : i, a = t.numeric, s = a === void 0 ? "decimal" : a, o = t.level, l = o === void 0 ? "all" : o;
  if (!r)
    return "";
  var c = Um[n], u = Kc[l].characters, f = s === "hexadecimal";
  return String.prototype.replace.call(r, c, function(h) {
    var d = u[h];
    if (!d) {
      var b = h.length > 1 ? (0, Mh.getCodePoint)(h, 0) : h.charCodeAt(0);
      d = (f ? "&#x" + b.toString(16) : "&#" + b) + ";";
    }
    return d;
  });
}
var Hm = {
  scope: "body",
  level: "all"
}, Ao = /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);/g, Co = /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+)[;=]?/g, H0 = {
  xml: {
    strict: Ao,
    attribute: Co,
    body: Rn.bodyRegExps.xml
  },
  html4: {
    strict: Ao,
    attribute: Co,
    body: Rn.bodyRegExps.html4
  },
  html5: {
    strict: Ao,
    attribute: Co,
    body: Rn.bodyRegExps.html5
  }
}, qm = Ui(Ui({}, H0), { all: H0.html5 }), Uh = String.fromCharCode, Zm = Uh(65533), Km = {
  level: "all"
};
function $h(r, e, t, i) {
  var n = r, a = r[r.length - 1];
  if (t && a === "=")
    n = r;
  else if (i && a !== ";")
    n = r;
  else {
    var s = e[r];
    if (s)
      n = s;
    else if (r[0] === "&" && r[1] === "#") {
      var o = r[2], l = o == "x" || o == "X" ? parseInt(r.substr(3), 16) : parseInt(r.substr(2));
      n = l >= 1114111 ? Zm : l > 65535 ? (0, Mh.fromCodePoint)(l) : Uh(Mm.numericUnicodeMap[l] || l);
    }
  }
  return n;
}
function Vm(r, e) {
  var t = e === void 0 ? Km : e, i = t.level, n = i === void 0 ? "all" : i;
  return r ? $h(r, Kc[n].entities, !1, !1) : "";
}
function Gm(r, e) {
  var t = e === void 0 ? Hm : e, i = t.level, n = i === void 0 ? "all" : i, a = t.scope, s = a === void 0 ? n === "xml" ? "strict" : "body" : a;
  if (!r)
    return "";
  var o = qm[n][s], l = Kc[n].entities, c = s === "attribute", u = s === "strict";
  return r.replace(o, function(f) {
    return $h(f, l, c, u);
  });
}
var ys;
Object.defineProperty(Te, "__esModule", { value: !0 });
Te.isBlock = Vc = Te.parse = Te.Matcher = Te.HTMLElement = Te.CommentNode = Te.TextNode = Te.AbstractNode = ys = Te.NodeType = void 0;
const vi = Da;
var Ve;
(function(r) {
  r[r.ELEMENT_NODE = 1] = "ELEMENT_NODE", r[r.TEXT_NODE = 3] = "TEXT_NODE", r[r.COMMENT_NODE = 8] = "COMMENT_NODE";
})(Ve || (ys = Te.NodeType = Ve = {}));
class oa {
  constructor() {
    this.childNodes = [], this.parentNode = null;
  }
  /**
   * Get unescaped text value of current node and its children.
   * @return {string} text content
   */
  get text() {
    return (0, vi.decode)(this.rawText);
  }
  /**
   * Remove this node from its parent if any
   * @return {Node}      node removed
   */
  remove() {
    return this.parentNode && this.parentNode.removeChild(this), this;
  }
}
Te.AbstractNode = oa;
class Bn extends oa {
  constructor(e) {
    super(), this.nodeType = Ve.TEXT_NODE, this.value = e;
  }
  get rawText() {
    return this.value;
  }
  /**
   * Detect if the node contains only white space.
   * @return {bool}
   */
  get isWhitespace() {
    return /^(\s|&nbsp;)*$/.test(this.rawText);
  }
  toString() {
    return this.rawText;
  }
  toJSON() {
    return { type: "text", value: this.value };
  }
}
Te.TextNode = Bn;
class Wh extends oa {
  constructor(e) {
    super(), this.nodeType = Ve.COMMENT_NODE, this.value = e;
  }
  get rawText() {
    return this.value;
  }
  toString() {
    return `<!--${this.rawText}-->`;
  }
  toJSON() {
    return { type: "comment", value: this.value };
  }
}
Te.CommentNode = Wh;
const Xm = {
  div: !0,
  p: !0,
  // ul: true,
  // ol: true,
  li: !0,
  // table: true,
  // tr: true,
  td: !0,
  section: !0,
  br: !0
};
function wn(r) {
  return r[r.length - 1];
}
class St extends oa {
  /**
   * Creates an instance of HTMLElement.
   * @param [rawAttrs]	attributes in string
   *
   * @memberof HTMLElement
   */
  constructor(e, t = "", i = null) {
    super(), this.tagName = e, this.rawAttrs = t, this.id = "", this.classNames = [], this.nodeType = Ve.ELEMENT_NODE, this.rawAttrs = t, this.parentNode = i, this.childNodes = [];
    let n = {};
    for (let a; a = Ym.exec(t); ) {
      const s = a[2];
      s && (n[s] = a[4] || a[5] || a[6] || "");
    }
    n.id && (this.id = n.id), n.class && (this.classNames = n.class.split(/\s+/));
  }
  /**
   * Remove Child element from childNodes array
   * @param {HTMLElement} node     node to remove
   */
  removeChild(e) {
    this.childNodes = this.childNodes.filter((t) => t !== e), e instanceof St && (e.parentNode = null);
  }
  /**
   * Exchanges given child with new child
   * @param {HTMLElement} oldNode     node to exchange
   * @param {HTMLElement} newNode     new node
   */
  exchangeChild(e, t) {
    const i = this.childNodes.findIndex((n) => n === e);
    i >= 0 && (this.childNodes[i] = t, e instanceof St && (e.parentNode = null));
  }
  /**
   * Get escpaed (as-it) text value of current node and its children.
   * @return {string} text content
   */
  get rawText() {
    let e = "";
    for (let t = 0; t < this.childNodes.length; t++)
      e += this.childNodes[t].rawText;
    return e;
  }
  /**
   * Get structured Text (with '\n' etc.)
   * @return {string} structured text
   */
  get structuredText() {
    let e = [];
    const t = [e];
    function i(n) {
      if (n.nodeType === Ve.ELEMENT_NODE)
        Xm[n.tagName] ? (e.length > 0 && t.push(e = []), n.childNodes.forEach(i), e.length > 0 && t.push(e = [])) : n.childNodes.forEach(i);
      else if (n.nodeType === Ve.TEXT_NODE)
        if (n.isWhitespace)
          e.prependWhitespace = !0;
        else {
          let a = n.text;
          e.prependWhitespace && (a = " " + a, e.prependWhitespace = !1), e.push(a);
        }
    }
    return i(this), t.map(function(n) {
      return n.join("").trim().replace(/\s{2,}/g, " ");
    }).join(`
`).replace(/\s+$/, "");
  }
  /**
   * Returns the children of HTMLElement type (ignore text and comment nodes)
   * @returns {HTMLElement[]}
   */
  get children() {
    return this.childNodes.filter((e) => e instanceof St);
  }
  toString() {
    const e = this.tagName;
    if (e) {
      const t = /^(img|br|hr|area|base|input|doctype|link|meta)$/i.test(e), i = this.rawAttrs ? " " + this.rawAttrs : "";
      return t ? `<${e}${i} />` : `<${e}${i}>${this.innerHTML}</${e}>`;
    } else
      return this.innerHTML;
  }
  /** Retrieves the content of this node as an HTML string */
  get innerHTML() {
    return this.childNodes.map((e) => e.toString()).join("");
  }
  set innerHTML(e) {
    const t = nc(e);
    this.childNodes.forEach((i) => i.remove()), t.childNodes.forEach((i) => this.appendChild(i));
  }
  /** Edit the HTML content of this node */
  set_content(e) {
    if (e instanceof oa)
      e = [e];
    else if (typeof e == "string") {
      const t = nc(e);
      e = t.childNodes.length ? t.childNodes : [new Bn(e)];
    }
    this.childNodes = e;
  }
  /** Convert this node into its HTML representation. This is an alias to toString() method. */
  get outerHTML() {
    return this.toString();
  }
  /**
   * Trim element from right (in block) after seeing pattern in a TextNode.
   * @param  {RegExp} pattern pattern to find
   * @return {HTMLElement}    reference to current node
   */
  trimRight(e) {
    for (let t = 0; t < this.childNodes.length; t++) {
      const i = this.childNodes[t];
      if (i.nodeType === Ve.ELEMENT_NODE)
        i.trimRight(e);
      else {
        const n = i.rawText.search(e);
        n > -1 && (i.value = i.rawText.substr(0, n), this.childNodes.length = t + 1);
      }
    }
    return this;
  }
  /**
   * Get DOM structure
   * @return {string} strucutre
   */
  get structure() {
    const e = [];
    let t = 0;
    function i(a) {
      e.push("  ".repeat(t) + a);
    }
    function n(a) {
      const s = a.id ? "#" + a.id : "", o = a.classNames.length ? "." + a.classNames.join(".") : "";
      i(a.tagName + s + o), t++;
      for (let l = 0; l < a.childNodes.length; l++) {
        const c = a.childNodes[l];
        c.nodeType === Ve.ELEMENT_NODE ? n(c) : c.nodeType === Ve.TEXT_NODE && (c.isWhitespace || i("#text"));
      }
      t--;
    }
    return n(this), e.join(`
`);
  }
  /**
   * Remove whitespaces in this sub tree.
   * @return {HTMLElement} pointer to this
   */
  removeWhitespace() {
    let e = 0;
    for (let t = 0; t < this.childNodes.length; t++) {
      const i = this.childNodes[t];
      if (i.nodeType === Ve.TEXT_NODE) {
        if (i.isWhitespace)
          continue;
        i.value = i.rawText.trim();
      } else i.nodeType === Ve.ELEMENT_NODE && i.removeWhitespace();
      this.childNodes[e++] = i;
    }
    return this.childNodes.length = e, this;
  }
  /**
   * Query CSS selector to find matching nodes.
   * @param  {string}         selector Simplified CSS selector
   * @param  {Matcher}        selector A Matcher instance
   * @return {HTMLElement[]}  matching elements
   */
  querySelectorAll(e) {
    let t;
    if (e instanceof zr)
      return t = e, t.reset(), this.querySelectorImpl(e, !0);
    {
      const i = e.split(",").filter((a) => a.trim()).map((a) => a.trim()), n = new Set(i.map((a) => this.querySelectorImpl(new zr(a), !0)).flat());
      return Array.from(n);
    }
  }
  querySelectorImpl(e, t) {
    function i(n, a, s) {
      const o = n.tagName ? a.advance(n) : !1;
      if (!s && o && a.matched)
        return n;
      if (o && s) {
        const l = a.clone();
        l.rewind();
        const c = n.children.map((u) => i(u, l.clone(), !0)).flat();
        return a.matched ? [n, ...c] : c.concat(...n.children.map((u) => i(u, a.clone(), !0)).flat());
      } else {
        if (s)
          return n.children.map((l) => i(l, a.clone(), !0)).flat();
        for (const l of n.children) {
          const c = i(l, a.clone(), !1);
          if (c)
            return c;
        }
        return null;
      }
    }
    return t ? i(this, e, !0) : i(this, e, !1);
  }
  /**
   * Query CSS Selector to find matching node.
   * @param  {string}         selector Simplified CSS selector
   * @param  {Matcher}        selector A Matcher instance
   * @return {HTMLElement | null}    matching node or null if not found
   */
  querySelector(e) {
    let t;
    if (e instanceof zr)
      return t = e, t.reset(), this.querySelectorImpl(e, !1);
    {
      const i = e.split(",").map((n) => n.trim()).filter((n) => n.length);
      for (const n of i) {
        const a = this.querySelectorImpl(new zr(n), !1);
        if (a)
          return a;
      }
      return null;
    }
  }
  /**
   * Append a child node to childNodes
   * @param  {Node} node node to append
   * @return {Node}      node appended
   */
  appendChild(e) {
    return this.childNodes.push(e), e instanceof St && (e.parentNode = this), e;
  }
  /**
   * Append a child node to childNodes
   * @param  {Node} node node to prepend
   * @return {Node}      node prepended
   */
  prependChild(e) {
    return this.childNodes.unshift(e), e instanceof St && (e.parentNode = this), e;
  }
  /**
   * Get first child node
   * @return {Node} first child node
   */
  get firstChild() {
    return this.childNodes[0];
  }
  /**
   * Get last child node
   * @return {Node} last child node
   */
  get lastChild() {
    return wn(this.childNodes);
  }
  /**
   * Get attributes
   * @return {Object} parsed and unescaped attributes
   */
  get attributes() {
    if (this._attrs)
      return this._attrs;
    this._attrs = {};
    const e = this.rawAttributes;
    for (const t in e)
      this._attrs[t] = (0, vi.decode)(e[t]);
    return this._attrs[Symbol.iterator] || Object.defineProperty(this._attrs, Symbol.iterator, {
      value: function* () {
        for (const t of Object.keys(this))
          yield { name: t, value: this[t] };
      },
      enumerable: !1,
      configurable: !0
    }), this._attrs;
  }
  /**
   * Get an attribute value
   * @param {string} key The attribute name
   * @return {string | undefined} The attribute value
   */
  getAttribute(e) {
    return this.attributes[e];
  }
  /**
   * Get escaped (as-it) attributes
   * @return {Object} parsed attributes
   */
  get rawAttributes() {
    if (this._rawAttrs)
      return this._rawAttrs;
    const e = {};
    if (this.rawAttrs) {
      let t;
      for (; t = Jm.exec(this.rawAttrs); ) {
        const i = t[1], n = t[4] || t[5] || t[6] || "";
        i && (e[i] = n);
      }
    }
    return this._rawAttrs = e, e;
  }
  /**
   * Set an attribute value to the HTMLElement
   * @param {string} key The attribute name
   * @param {string | undefined} value The value to set, or undefined to remove an attribute
   */
  setAttribute(e, t) {
    e === "id" ? this.id = t || "" : e === "class" && (this.classNames = (t == null ? void 0 : t.split(/\s+/)) || []);
    const i = this.attributes;
    t === void 0 ? delete i[e] : i[e] = t + "", this._rawAttrs && (t === void 0 ? delete this._rawAttrs[e] : this._rawAttrs[e] = (0, vi.encode)(t + "")), this.rawAttrs = Object.keys(i).map((n) => n + (i[n] === "" ? "" : '="' + (0, vi.encode)(i[n]) + '"')).join(" ");
  }
  removeAttribute(e) {
    this.setAttribute(e, void 0);
  }
  /**
   * Replace all the attributes of the HTMLElement by the provided attributes
   * @param {Attributes} attributes the new attribute set
   */
  setAttributes(e) {
    e.id ? this.id = e.id : e.class && (this.classNames = e.class.split(/\s+/)), this.attributes && (Object.keys(this.attributes).forEach((t) => delete this.attributes[t]), Object.keys(e).forEach((t) => this.attributes[t] = e[t] + "")), this.rawAttributes && (Object.keys(this.rawAttributes).forEach((t) => delete this.rawAttributes[t]), Object.keys(e).forEach((t) => this.rawAttributes[t] = (0, vi.encode)(e[t] + ""))), this.rawAttrs = Object.keys(e).map((t) => t + (e[t] === "" ? "" : '="' + (0, vi.encode)(e[t] + "") + '"')).join(" ");
  }
  toJSON() {
    return {
      type: "element",
      tagName: this.tagName,
      attributes: this.attributes,
      children: this.childNodes.map((e) => e.toJSON ? e.toJSON() : e.toString())
    };
  }
}
Te.HTMLElement = St;
class zr {
  /**
   * Creates an instance of Matcher.
   * @param {string} selector
   */
  constructor(e) {
    this.checkers = [], this.nextMatch = 0, this.checkers = e ? this.parseCompleteSelector(e) : [];
  }
  /**
   * Parse complete CSS selector using regex to extract all parts
   */
  parseCompleteSelector(e) {
    const t = /(?:^|\s+)([a-zA-Z_*][\w:-]*)?(?:#([\w-]+))?(?:\.([\w-]+(?:\.[\w-]+)*))?(\[(?:[^\]]+)\](?:\[(?:[^\]]+)\])*)?/g, i = [];
    let n;
    for (; (n = t.exec(e)) !== null; )
      n[0].trim() && i.push({
        tag: n[1] || "",
        id: n[2] || "",
        classes: n[3] ? n[3].split(".") : [],
        attrs: this.parseAttributes(n[4] || "")
      });
    return i.map((a) => this.createCheckerFromParsed(a));
  }
  /**
   * Parse attributes string like "[attr1][attr2=value]" into structured data
   */
  parseAttributes(e) {
    if (!e)
      return [];
    const t = [], i = /\[([^\s~|^$*!=]+)(?:\s*(=|!=|\^=|\$=|\*=|\|=|~=)\s*(?:["']?([^"'\]]*)["']?)?)?\]/g;
    let n;
    for (; (n = i.exec(e)) !== null; )
      n[1] && t.push({
        key: n[1],
        op: n[2] || "",
        value: n[3] || ""
      });
    return t;
  }
  /**
   * Create a checker function from parsed selector data
   */
  createCheckerFromParsed(e) {
    const t = [];
    if (e.tag && e.tag !== "*" && t.push((i) => i.tagName === e.tag), e.id && t.push((i) => i.id === e.id), e.classes.length > 0)
      for (const i of e.classes)
        t.push((n) => n.classNames.includes(i));
    if (e.attrs.length > 0) {
      const i = e.attrs.map((n) => this.createAttributeChecker(n.key, n.op, n.value));
      t.push((n) => i.every((a) => a(n)));
    }
    return (i) => t.every((n) => n(i));
  }
  /**
   * Create attribute checker function
   */
  createAttributeChecker(e, t, i) {
    switch (t) {
      case "=":
        return (n) => n.attributes[e] === i;
      case "!=":
        return (n) => n.attributes[e] !== i;
      case "^=":
        return (n) => {
          const a = n.attributes[e];
          return a !== void 0 && a.startsWith(i);
        };
      case "$=":
        return (n) => {
          const a = n.attributes[e];
          return a !== void 0 && a.endsWith(i);
        };
      case "*=":
        return (n) => {
          const a = n.attributes[e];
          return a !== void 0 && a.includes(i);
        };
      case "|=":
        return (n) => {
          const a = n.attributes[e];
          return a !== void 0 && (a === i || a.startsWith(i + "-"));
        };
      case "~=":
        return (n) => {
          const a = n.attributes[e];
          return a !== void 0 && a.split(/\s+/).includes(i);
        };
      default:
        return (n) => n.attributes[e] !== void 0;
    }
  }
  /**
   * Trying to advance match pointer
   * @param  {HTMLElement} el element to make the match
   * @return {bool}           true when pointer advanced.
   */
  advance(e) {
    return this.nextMatch < this.checkers.length && this.checkers[this.nextMatch](e) ? (this.nextMatch++, !0) : !1;
  }
  /**
   * Rewind the match pointer
   */
  rewind() {
    this.nextMatch--;
  }
  /**
   * Trying to determine if match made.
   * @return {bool} true when the match is made
   */
  get matched() {
    return this.nextMatch === this.checkers.length;
  }
  /**
   * Reset match pointer.
   */
  reset() {
    this.nextMatch = 0;
  }
  /**
   * Get current match level (for debugging)
   */
  get level() {
    return this.nextMatch;
  }
  /**
   * Clone this matcher with current state
   */
  clone() {
    const e = new zr("");
    return e.checkers = this.checkers, e.nextMatch = this.nextMatch, e;
  }
}
Te.Matcher = zr;
const Nt = /<!--[^]*?(?=-->)-->|<(\/?)([a-z][-.:0-9_a-z]*)((\s*(?:[a-z][-.:0-9_a-z]*(\s*=\s*("[^"]*?"|'[^']*?'|(?:\/(?!>)|[^\s"'<>/])+))?|[^<\/>\s]+))*)\s*(\/?)>/ig, Ym = /(^|\s)(id|class)\s*=\s*("([^"]+)"|'([^']+)'|(\S+))/ig, Jm = /([a-z][-.:0-9_a-z]*)(\s*=\s*("([^"]*)"|'([^']*)'|(\S+)))?/ig, q0 = {
  area: !0,
  base: !0,
  br: !0,
  col: !0,
  hr: !0,
  img: !0,
  input: !0,
  link: !0,
  meta: !0,
  source: !0
}, Z0 = {
  li: { li: !0 },
  p: { p: !0, h1: !0, h2: !0, h3: !0, h4: !0, h5: !0, h6: !0 },
  b: { div: !0 },
  td: { td: !0, th: !0 },
  th: { td: !0, th: !0 },
  h1: { p: !0, h1: !0, h2: !0, h3: !0, h4: !0, h5: !0, h6: !0 },
  h2: { p: !0, h1: !0, h2: !0, h3: !0, h4: !0, h5: !0, h6: !0 },
  h3: { p: !0, h1: !0, h2: !0, h3: !0, h4: !0, h5: !0, h6: !0 },
  h4: { p: !0, h1: !0, h2: !0, h3: !0, h4: !0, h5: !0, h6: !0 },
  h5: { p: !0, h1: !0, h2: !0, h3: !0, h4: !0, h5: !0, h6: !0 },
  h6: { p: !0, h1: !0, h2: !0, h3: !0, h4: !0, h5: !0, h6: !0 },
  // Table elements
  colgroup: { tr: !0, thead: !0, tbody: !0, tfoot: !0 },
  tr: { tr: !0, thead: !0, tbody: !0, tfoot: !0 },
  thead: { tr: !0, thead: !0, tbody: !0, tfoot: !0 },
  tbody: { tr: !0, thead: !0, tbody: !0, tfoot: !0 },
  tfoot: { tr: !0, thead: !0, tbody: !0, tfoot: !0 },
  // List elements
  ul: { ul: !0, ol: !0 },
  ol: { ol: !0, ul: !0 },
  // Section elements
  aside: { aside: !0 },
  nav: { nav: !0 },
  // Form elements
  form: { form: !0 },
  // Header elements
  header: { header: !0 },
  footer: { footer: !0 },
  main: { main: !0 }
}, Qm = {
  script: !0,
  noscript: !0,
  style: !0,
  pre: !0
};
function nc(r, e) {
  var t, i;
  const n = new St("");
  let a = n;
  const s = [n];
  let o = 0;
  e = e || {};
  let l;
  for (; l = Nt.exec(r); ) {
    if (o + l[0].length < Nt.lastIndex) {
      const u = r.substring(o, Nt.lastIndex - l[0].length);
      a.appendChild(new Bn(u));
    }
    if (o = Nt.lastIndex, l[0][1] == "!") {
      if (e.comment) {
        const u = r.substring(o - 3, o - l[0].length + 4);
        a.appendChild(new Wh(u));
      }
      continue;
    }
    if (e.lowerCaseTagName && (l[2] = ((t = l[2]) === null || t === void 0 ? void 0 : t.toLowerCase()) || ""), !l[1] && (!l[7] && Z0[a.tagName] && Z0[a.tagName][l[2]] && (s.pop(), a = wn(s) || n), a = a.appendChild(new St(l[2] || "", ((i = l[3]) === null || i === void 0 ? void 0 : i.trim()) || "")), s.push(a), Qm[l[2]])) {
      let u = "</" + l[2] + ">", f = r.indexOf(u, Nt.lastIndex);
      if (e[l[2]]) {
        let h;
        f == -1 ? h = r.slice(Nt.lastIndex) : h = r.substring(Nt.lastIndex, f), h.length > 0 && a.appendChild(new Bn(h));
      }
      f == -1 ? o = Nt.lastIndex = r.length + 1 : (o = Nt.lastIndex = f + u.length, l[1] = "true");
    }
    const c = l[2];
    if (l[1] || l[7] || q0[c]) {
      const u = !!l[1], f = !!q0[c];
      if (u && f)
        continue;
      for (; ; )
        if (a.tagName == c) {
          s.pop(), a = wn(s) || n;
          break;
        } else if (s.length > 1) {
          s.pop(), a = wn(s) || n;
          continue;
        } else
          break;
    }
  }
  for (o < r.length && n.appendChild(new Bn(r.substring(o))), n.valid = s.length === 1; s.length > 1; ) {
    const c = s.pop(), u = wn(s) || n;
    c.parentNode && c.parentNode instanceof St && c.parentNode.parentNode && (c.parentNode === u && c.tagName === u.tagName ? (u.removeChild(c), c.childNodes.forEach((f) => {
      u.parentNode.appendChild(f);
    }), s.pop()) : (u.removeChild(c), c.childNodes.forEach((f) => {
      u.appendChild(f);
    })));
  }
  return n;
}
var Vc = Te.parse = nc;
const ew = [
  "html",
  "body",
  "address",
  "article",
  "aside",
  "blockquote",
  "canvas",
  "dd",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "header",
  "hr",
  "li",
  "main",
  "nav",
  "noscript",
  "ol",
  "p",
  "pre",
  "section",
  "tfoot",
  "table",
  "tbody",
  "ul",
  "video",
  "th",
  "td",
  "tr",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6"
];
function tw(r) {
  return r.nodeType === Ve.ELEMENT_NODE && r.tagName && ew.includes(r.tagName.toLowerCase());
}
Te.isBlock = tw;
const rw = [1, 0, 0, 1, 0, 0], yn = ([r, e, t, i, n, a], [s, o, l, c, u, f]) => [
  r * s + t * o,
  e * s + i * o,
  r * l + t * c,
  e * l + i * c,
  r * u + t * f + n,
  e * u + i * f + a
], Za = ([r, e, t, i, n, a], { x: s, y: o }) => ({
  x: r * s + t * o + n,
  y: e * s + i * o + a
}), rs = (r, e) => {
  switch (r) {
    case "scale":
    case "scaleX":
    case "scaleY": {
      const [t, i = t] = e;
      return [r === "scaleY" ? 1 : t, 0, 0, r === "scaleX" ? 1 : i, 0, 0];
    }
    case "translate":
    case "translateX":
    case "translateY": {
      const [t, i = t] = e;
      return [1, 0, 0, 1, r === "translateY" ? 0 : t, r === "translateX" ? 0 : -i];
    }
    case "rotate": {
      const [t, i = 0, n = 0] = e, a = rs("translate", [i, n]), s = rs("translate", [-i, -n]), o = No(-t), l = [
        Math.cos(o),
        Math.sin(o),
        -Math.sin(o),
        Math.cos(o),
        0,
        0
      ];
      return yn(yn(a, l), s);
    }
    case "skewY":
    case "skewX": {
      const t = No(-e[0]), i = Math.tan(t);
      return [1, r === "skewY" ? i : 0, r === "skewX" ? i : 0, 1, 0, 0];
    }
    case "matrix": {
      const [t, i, n, a, s, o] = e, l = rs("scale", [1, -1]);
      return yn(yn(l, [t, i, n, a, s, o]), l);
    }
    default:
      return rw;
  }
}, $r = (r, e, t) => yn(r, rs(e, t)), iw = {
  butt: lr.Butt,
  round: lr.Round,
  square: lr.Projecting
}, nw = {
  evenodd: zn.EvenOdd,
  nonzero: zn.NonZero
}, aw = {
  bevel: Va.Bevel,
  miter: Va.Miter,
  round: Va.Round
}, Hh = (r, e) => ({
  async text(t) {
    const i = t.svgAttributes.textAnchor, n = t.svgAttributes.dominantBaseline, a = t.text.trim().replace(/\s/g, " "), s = t.svgAttributes.fontSize || 12;
    function o(d, b) {
      const p = d.fontFamily;
      if (!p)
        return;
      const m = d.fontWeight === "bold" || Number(d.fontWeight) >= 700, g = d.fontStyle === "italic", S = (y, v, A) => b[A + (y ? "_bold" : "") + (v ? "_italic" : "")];
      return S(m, g, p) || S(m, !1, p) || S(!1, g, p) || S(!1, !1, p) || Object.keys(b).find((y) => y.startsWith(p));
    }
    const l = e.fonts && o(t.svgAttributes, e.fonts), c = (l || r.getFont()[0]).widthOfTextAtSize(a, s), u = (l || r.getFont()[0]).heightAtSize(s), f = i === "middle" ? c / 2 : i === "end" ? c : 0, h = n === "text-before-edge" ? u : n === "text-after-edge" ? -u : n === "middle" ? u / 2 : 0;
    r.drawText(a, {
      x: -f,
      y: -h,
      font: l,
      // TODO: the font size should be correctly scaled too
      size: s,
      color: t.svgAttributes.fill,
      opacity: t.svgAttributes.fillOpacity,
      matrix: t.svgAttributes.matrix,
      clipSpaces: t.svgAttributes.clipSpaces
    });
  },
  async line(t) {
    r.drawLine({
      start: {
        x: t.svgAttributes.x1 || 0,
        y: -t.svgAttributes.y1 || 0
      },
      end: {
        x: t.svgAttributes.x2 || 0,
        y: -t.svgAttributes.y2 || 0
      },
      thickness: t.svgAttributes.strokeWidth,
      color: t.svgAttributes.stroke,
      opacity: t.svgAttributes.strokeOpacity,
      lineCap: t.svgAttributes.strokeLineCap,
      matrix: t.svgAttributes.matrix,
      clipSpaces: t.svgAttributes.clipSpaces
    });
  },
  async path(t) {
    t.svgAttributes.d && r.drawSvgPath(t.svgAttributes.d, {
      x: 0,
      y: 0,
      borderColor: t.svgAttributes.stroke,
      borderWidth: t.svgAttributes.strokeWidth,
      borderOpacity: t.svgAttributes.strokeOpacity,
      borderLineCap: t.svgAttributes.strokeLineCap,
      color: t.svgAttributes.fill,
      opacity: t.svgAttributes.fillOpacity,
      fillRule: t.svgAttributes.fillRule,
      matrix: t.svgAttributes.matrix,
      clipSpaces: t.svgAttributes.clipSpaces
    });
  },
  async image(t) {
    const { src: i } = t.svgAttributes;
    if (!i)
      return;
    const a = i.match(/\.png(\?|$)|^data:image\/png;base64/gim) ? await r.doc.embedPng(i) : await r.doc.embedJpg(i), { x: s, y: o, width: l, height: c } = sw(a.width, a.height, t.svgAttributes.width || a.width, t.svgAttributes.height || a.height, t.svgAttributes.preserveAspectRatio);
    r.drawImage(a, {
      x: s,
      y: -o - c,
      width: l,
      height: c,
      opacity: t.svgAttributes.fillOpacity,
      matrix: t.svgAttributes.matrix,
      clipSpaces: t.svgAttributes.clipSpaces
    });
  },
  async rect(t) {
    !t.svgAttributes.fill && !t.svgAttributes.stroke || r.drawRectangle({
      x: 0,
      y: 0,
      width: t.svgAttributes.width,
      height: t.svgAttributes.height * -1,
      borderColor: t.svgAttributes.stroke,
      borderWidth: t.svgAttributes.strokeWidth,
      borderOpacity: t.svgAttributes.strokeOpacity,
      borderLineCap: t.svgAttributes.strokeLineCap,
      color: t.svgAttributes.fill,
      opacity: t.svgAttributes.fillOpacity,
      matrix: t.svgAttributes.matrix,
      clipSpaces: t.svgAttributes.clipSpaces
    });
  },
  async ellipse(t) {
    r.drawEllipse({
      x: t.svgAttributes.cx || 0,
      y: -(t.svgAttributes.cy || 0),
      xScale: t.svgAttributes.rx,
      yScale: t.svgAttributes.ry,
      borderColor: t.svgAttributes.stroke,
      borderWidth: t.svgAttributes.strokeWidth,
      borderOpacity: t.svgAttributes.strokeOpacity,
      borderLineCap: t.svgAttributes.strokeLineCap,
      color: t.svgAttributes.fill,
      opacity: t.svgAttributes.fillOpacity,
      matrix: t.svgAttributes.matrix,
      clipSpaces: t.svgAttributes.clipSpaces
    });
  },
  async circle(t) {
    return Hh(r, e).ellipse(t);
  }
}), De = (r, e, t, i) => {
  const n = e[t] || r[t];
  return !n && typeof i < "u" ? i : n;
}, qh = (r) => {
  const e = /([^:\s]+)\s*:\s*([^;]+)/g, t = {};
  let i = e.exec(r);
  for (; i != null; )
    t[i[1]] = i[2], i = e.exec(r);
  return t;
}, ac = (r, e) => {
  if (!r || r.length === 0 || ["none", "transparent"].includes(r))
    return;
  if (r === "currentColor")
    return e || ac("#000000");
  const t = Eu(r);
  return {
    rgb: t.rgb,
    alpha: t.alpha ? t.alpha + "" : void 0
  };
}, Gc = (r, e, t) => {
  const i = r.attributes, n = qh(i.style), a = De(i, n, "width", ""), s = De(i, n, "height", ""), o = ac(De(i, n, "fill")), l = De(i, n, "fill-opacity"), c = De(i, n, "opacity"), u = ac(De(i, n, "stroke")), f = De(i, n, "stroke-opacity"), h = De(i, n, "stroke-linecap"), d = De(i, n, "stroke-linejoin"), b = De(i, n, "fill-rule"), p = De(i, n, "stroke-width"), m = De(i, n, "font-family"), g = De(i, n, "font-style"), S = De(i, n, "font-weight"), y = De(i, n, "font-size"), v = Pe(a, e.width), A = Pe(s, e.height), k = Pe(i.x, e.width), _ = Pe(i.y, e.height), C = Pe(i.x1, e.width), P = Pe(i.x2, e.width), D = Pe(i.y1, e.height), O = Pe(i.y2, e.height), j = Pe(i.cx, e.width), B = Pe(i.cy, e.height), W = Pe(i.rx || i.r, e.width), I = Pe(i.ry || i.r, e.height), N = {
    fontFamily: m || e.fontFamily,
    fontStyle: g || e.fontStyle,
    fontWeight: S || e.fontWeight,
    fontSize: Pe(y) ?? e.fontSize,
    fill: (o == null ? void 0 : o.rgb) || e.fill,
    fillOpacity: Pe(l || c || (o == null ? void 0 : o.alpha)) ?? e.fillOpacity,
    fillRule: nw[b] || e.fillRule,
    stroke: (u == null ? void 0 : u.rgb) || e.stroke,
    strokeWidth: Pe(p) ?? e.strokeWidth,
    strokeOpacity: Pe(f || c || (u == null ? void 0 : u.alpha)) ?? e.strokeOpacity,
    strokeLineCap: iw[h] || e.strokeLineCap,
    strokeLineJoin: aw[d] || e.strokeLineJoin,
    width: v || e.width,
    height: A || e.height,
    rotation: e.rotation,
    viewBox: r.tagName === "svg" && r.attributes.viewBox ? vs(r.attributes.viewBox) : e.viewBox
  }, L = {
    src: i.src || i["xlink:href"],
    textAnchor: i["text-anchor"],
    dominantBaseline: i["dominant-baseline"],
    preserveAspectRatio: i.preserveAspectRatio
  };
  let re = i.transform || "";
  [
    "translate",
    "translateX",
    "translateY",
    "skewX",
    "skewY",
    "rotate",
    "scale",
    "scaleX",
    "scaleY",
    "matrix"
  ].forEach((de) => {
    i[de] && (re = i[de] + " " + re);
  }), (k || _) && (re = re + `translate(${k || 0} ${_ || 0}) `);
  let ce = t;
  if (re) {
    const de = /(\w+)\((.+?)\)/g;
    let ue = de.exec(re);
    for (; ue !== null; ) {
      const [, pe, ze] = ue, oe = (ze || "").split(/\s*,\s*|\s+/).filter((er) => er.length > 0).map((er) => parseFloat(er));
      ce = $r(ce, pe, oe), ue = de.exec(re);
    }
  }
  if (L.x = k, L.y = _, (i.cx || i.cy) && (L.cx = j, L.cy = B), (i.rx || i.ry || i.r) && (L.rx = W, L.ry = I), (i.x1 || i.y1) && (L.x1 = C, L.y1 = D), (i.x2 || i.y2) && (L.x2 = P, L.y2 = O), (i.width || i.height) && (L.width = v ?? e.width, L.height = A ?? e.height), i.d && (ce = $r(ce, "scale", [1, -1]), L.d = i.d), y && N.fontSize && (N.fontSize = N.fontSize), N.fontFamily) {
    const de = N.fontFamily.match(/^"(.*?)"|^'(.*?)'/);
    de && (N.fontFamily = de[1] || de[2]);
  }
  return N.strokeWidth && (L.strokeWidth = N.strokeWidth), {
    inherited: N,
    svgAttributes: L,
    tagName: r.tagName,
    matrix: ce
  };
}, sw = (r, e, t, i, n) => {
  if (n === "none")
    return { x: 0, y: 0, width: t, height: i };
  const a = r / e, s = t / i, o = s > a ? a * i : t, l = s >= a ? i : t / a, c = t - o, u = i - l, [f, h] = (() => {
    switch (n) {
      case "xMinYMin":
        return [0, 0];
      case "xMidYMin":
        return [c / 2, 0];
      case "xMaxYMin":
        return [c, u / 2];
      case "xMinYMid":
        return [0, u];
      case "xMaxYMid":
        return [c, u / 2];
      case "xMinYMax":
        return [0, u];
      case "xMidYMax":
        return [c / 2, u];
      case "xMaxYMax":
        return [c, u];
      case "xMidYMid":
      default:
        return [c / 2, u / 2];
    }
  })();
  return { x: f, y: h, width: o, height: l };
}, ow = (r, e, t, i, n, a) => {
  const s = i / e, o = n / t, l = $r(r, "scale", [s, o]);
  if (a === "none")
    return {
      clipBox: l,
      content: l
    };
  const c = i > n ? o : s, u = i - e * c, f = n - t * c, [h, d] = (() => {
    switch (a) {
      case "xMinYMin":
        return [0, 0];
      case "xMidYMin":
        return [u / 2, 0];
      case "xMaxYMin":
        return [u, f / 2];
      case "xMinYMid":
        return [0, f];
      case "xMaxYMid":
        return [u, f / 2];
      case "xMinYMax":
        return [0, f];
      case "xMidYMax":
        return [u / 2, f];
      case "xMaxYMax":
        return [u, f];
      case "xMidYMid":
      default:
        return [u / 2, f / 2];
    }
  })(), b = $r($r(r, "translate", [h, d]), "scale", [c]);
  return {
    clipBox: l,
    content: b
  };
}, Xc = (r, e, t, i) => {
  if (r.nodeType === ys.COMMENT_NODE)
    return [];
  if (r.nodeType === ys.TEXT_NODE)
    return [];
  if (r.tagName === "g")
    return lw(r, e, t, i);
  if (r.tagName === "svg")
    return cw(r, e, t, i);
  {
    r.tagName === "polygon" && (r.tagName = "path", r.attributes.d = `M${r.attributes.points}Z`, delete r.attributes.points);
    const n = Gc(r, e, t), a = {
      ...n.inherited,
      ...n.svgAttributes,
      matrix: n.matrix,
      clipSpaces: i
    };
    return Object.assign(r, { svgAttributes: a }), [r];
  }
}, cw = (r, e, t, i) => {
  r.attributes.width ?? r.setAttribute("width", e.viewBox.width + ""), r.attributes.height ?? r.setAttribute("height", e.viewBox.height + "");
  const n = Gc(r, e, t), a = [], s = r.attributes.viewBox ? vs(r.attributes.viewBox) : r.attributes.width && r.attributes.height ? vs(`0 0 ${r.attributes.width} ${r.attributes.height}`) : e.viewBox, o = parseFloat(r.attributes.x) || 0, l = parseFloat(r.attributes.y) || 0;
  let c = $r(t, "translate", [o, l]);
  const { clipBox: u, content: f } = ow(c, s.width, s.height, parseFloat(r.attributes.width), parseFloat(r.attributes.height), r.attributes.preserveAspectRatio || "xMidYMid"), h = Za(u, {
    x: 0,
    y: 0
  }), d = Za(u, {
    x: s.width,
    y: 0
  }), b = Za(u, {
    x: s.width,
    y: -s.height
  }), p = Za(u, {
    x: 0,
    y: -s.height
  }), m = {
    topLeft: h,
    topRight: d,
    bottomRight: b,
    bottomLeft: p
  };
  return c = $r(f, "translate", [-s.x, -s.y]), r.childNodes.forEach((g) => {
    const S = Xc(g, { ...n.inherited, viewBox: s }, c, [
      ...i,
      m
    ]);
    a.push(...S);
  }), a;
}, lw = (r, e, t, i) => {
  const n = Gc(r, e, t), a = [];
  return r.childNodes.forEach((s) => {
    a.push(...Xc(s, n.inherited, n.matrix, i));
  }), a;
}, Pe = (r, e = 1) => {
  if (!r)
    return;
  const t = parseFloat(r);
  if (!isNaN(t))
    return r.endsWith("%") ? t * e / 100 : t;
}, vs = (r) => {
  if (!r)
    return;
  const [e = 0, t = 0, i = 1, n = 1] = (r || "").split(" ").map((a) => Pe(a));
  return {
    x: e,
    y: t,
    width: i,
    height: n
  };
}, uw = (r, { width: e, height: t, fontSize: i }, n, a) => {
  const s = Vc(r).firstChild;
  return e && s.setAttribute("width", e + ""), t && s.setAttribute("height", t + ""), i && s.setAttribute("font-size", i + ""), Xc(s, {
    ...n,
    viewBox: vs(s.attributes.viewBox || "0 0 1 1")
  }, a, []);
}, dw = async (r, e, t) => {
  if (!e)
    return;
  const i = r.getSize(), n = Vc(e).firstChild, a = n.attributes, s = qh(a.style), o = De(a, s, "width", ""), l = De(a, s, "height", ""), c = t.width !== void 0 ? t.width : parseFloat(o), u = t.height !== void 0 ? t.height : parseFloat(l);
  a.viewBox || n.setAttribute("viewBox", `0 0 ${o || c} ${l || u}`), (t.width || t.height) && (c !== void 0 && (s.width = c + (isNaN(c) ? "" : "px")), u !== void 0 && (s.height = u + (isNaN(u) ? "" : "px")), n.setAttribute("style", Object.entries(s).map(([b, p]) => `${b}:${p};`).join("")));
  const f = [1, 0, 0, 1, t.x || 0, t.y || 0], h = Hh(r, t);
  await uw(n.outerHTML, t, i, f).reduce(async (b, p) => {
    var m;
    return await b, (m = h[p.tagName]) == null ? void 0 : m.call(h, p);
  }, Promise.resolve());
};
class Fe {
  constructor(e, t, i) {
    Object.defineProperty(this, "node", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "ref", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "doc", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "fontKey", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "font", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "fontSize", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 24
    }), Object.defineProperty(this, "fontColor", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: se(0, 0, 0)
    }), Object.defineProperty(this, "lineHeight", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 24
    }), Object.defineProperty(this, "x", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 0
    }), Object.defineProperty(this, "y", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 0
    }), Object.defineProperty(this, "contentStream", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "contentStreamRef", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), F(e, "leafNode", [[Be, "PDFPageLeaf"]]), F(t, "ref", [[te, "PDFRef"]]), F(i, "doc", [[Se, "PDFDocument"]]), this.node = e, this.ref = t, this.doc = i;
  }
  /**
   * Rotate this page by a multiple of 90 degrees. For example:
   * ```js
   * import { degrees } from 'pdf-lib'
   *
   * page.setRotation(degrees(-90))
   * page.setRotation(degrees(0))
   * page.setRotation(degrees(90))
   * page.setRotation(degrees(180))
   * page.setRotation(degrees(270))
   * ```
   * @param angle The angle to rotate this page.
   */
  setRotation(e) {
    const t = bc(e);
    xc(t, "degreesAngle", 90), this.node.set(x.of("Rotate"), this.doc.context.obj(t));
  }
  /**
   * Get this page's rotation angle in degrees. For example:
   * ```js
   * const rotationAngle = page.getRotation().angle;
   * ```
   * @returns The rotation angle of the page in degrees (always a multiple of
   *          90 degrees).
   */
  getRotation() {
    const e = this.node.Rotate();
    return H(e ? e.asNumber() : 0);
  }
  /**
   * Resize this page by increasing or decreasing its width and height. For
   * example:
   * ```js
   * page.setSize(250, 500)
   * page.setSize(page.getWidth() + 50, page.getHeight() + 100)
   * page.setSize(page.getWidth() - 50, page.getHeight() - 100)
   * ```
   *
   * Note that the PDF specification does not allow for pages to have explicit
   * widths and heights. Instead it defines the "size" of a page in terms of
   * five rectangles: the MediaBox, CropBox, BleedBox, TrimBox, and ArtBox. As a
   * result, this method cannot directly change the width and height of a page.
   * Instead, it works by adjusting these five boxes.
   *
   * This method performs the following steps:
   *   1. Set width & height of MediaBox.
   *   2. Set width & height of CropBox, if it has same dimensions as MediaBox.
   *   3. Set width & height of BleedBox, if it has same dimensions as MediaBox.
   *   4. Set width & height of TrimBox, if it has same dimensions as MediaBox.
   *   5. Set width & height of ArtBox, if it has same dimensions as MediaBox.
   *
   * This approach works well for most PDF documents as all PDF pages must
   * have a MediaBox, but relatively few have a CropBox, BleedBox, TrimBox, or
   * ArtBox. And when they do have these additional boxes, they often have the
   * same dimensions as the MediaBox. However, if you find this method does not
   * work for your document, consider setting the boxes directly:
   *   * [[PDFPage.setMediaBox]]
   *   * [[PDFPage.setCropBox]]
   *   * [[PDFPage.setBleedBox]]
   *   * [[PDFPage.setTrimBox]]
   *   * [[PDFPage.setArtBox]]
   *
   * @param width The new width of the page.
   * @param height The new height of the page.
   */
  setSize(e, t) {
    F(e, "width", ["number"]), F(t, "height", ["number"]);
    const i = this.getMediaBox();
    this.setMediaBox(i.x, i.y, e, t);
    const n = this.getCropBox(), a = this.getBleedBox(), s = this.getTrimBox(), o = this.getArtBox(), l = this.node.CropBox(), c = this.node.BleedBox(), u = this.node.TrimBox(), f = this.node.ArtBox();
    l && dn(n, i) && this.setCropBox(i.x, i.y, e, t), c && dn(a, i) && this.setBleedBox(i.x, i.y, e, t), u && dn(s, i) && this.setTrimBox(i.x, i.y, e, t), f && dn(o, i) && this.setArtBox(i.x, i.y, e, t);
  }
  /**
   * Resize this page by increasing or decreasing its width. For example:
   * ```js
   * page.setWidth(250)
   * page.setWidth(page.getWidth() + 50)
   * page.setWidth(page.getWidth() - 50)
   * ```
   *
   * This method uses [[PDFPage.setSize]] to set the page's width.
   *
   * @param width The new width of the page.
   */
  setWidth(e) {
    F(e, "width", ["number"]), this.setSize(e, this.getSize().height);
  }
  /**
   * Resize this page by increasing or decreasing its height. For example:
   * ```js
   * page.setHeight(500)
   * page.setHeight(page.getWidth() + 100)
   * page.setHeight(page.getWidth() - 100)
   * ```
   *
   * This method uses [[PDFPage.setSize]] to set the page's height.
   *
   * @param height The new height of the page.
   */
  setHeight(e) {
    F(e, "height", ["number"]), this.setSize(this.getSize().width, e);
  }
  /**
   * Set the MediaBox of this page. For example:
   * ```js
   * const mediaBox = page.getMediaBox()
   *
   * page.setMediaBox(0, 0, 250, 500)
   * page.setMediaBox(mediaBox.x, mediaBox.y, 50, 100)
   * page.setMediaBox(15, 5, mediaBox.width - 50, mediaBox.height - 100)
   * ```
   *
   * See [[PDFPage.getMediaBox]] for details about what the MediaBox represents.
   *
   * @param x The x coordinate of the lower left corner of the new MediaBox.
   * @param y The y coordinate of the lower left corner of the new MediaBox.
   * @param width The width of the new MediaBox.
   * @param height The height of the new MediaBox.
   */
  setMediaBox(e, t, i, n) {
    F(e, "x", ["number"]), F(t, "y", ["number"]), F(i, "width", ["number"]), F(n, "height", ["number"]);
    const a = this.doc.context.obj([e, t, e + i, t + n]);
    this.node.set(x.MediaBox, a);
  }
  /**
   * Set the CropBox of this page. For example:
   * ```js
   * const cropBox = page.getCropBox()
   *
   * page.setCropBox(0, 0, 250, 500)
   * page.setCropBox(cropBox.x, cropBox.y, 50, 100)
   * page.setCropBox(15, 5, cropBox.width - 50, cropBox.height - 100)
   * ```
   *
   * See [[PDFPage.getCropBox]] for details about what the CropBox represents.
   *
   * @param x The x coordinate of the lower left corner of the new CropBox.
   * @param y The y coordinate of the lower left corner of the new CropBox.
   * @param width The width of the new CropBox.
   * @param height The height of the new CropBox.
   */
  setCropBox(e, t, i, n) {
    F(e, "x", ["number"]), F(t, "y", ["number"]), F(i, "width", ["number"]), F(n, "height", ["number"]);
    const a = this.doc.context.obj([e, t, e + i, t + n]);
    this.node.set(x.CropBox, a);
  }
  /**
   * Set the BleedBox of this page. For example:
   * ```js
   * const bleedBox = page.getBleedBox()
   *
   * page.setBleedBox(0, 0, 250, 500)
   * page.setBleedBox(bleedBox.x, bleedBox.y, 50, 100)
   * page.setBleedBox(15, 5, bleedBox.width - 50, bleedBox.height - 100)
   * ```
   *
   * See [[PDFPage.getBleedBox]] for details about what the BleedBox represents.
   *
   * @param x The x coordinate of the lower left corner of the new BleedBox.
   * @param y The y coordinate of the lower left corner of the new BleedBox.
   * @param width The width of the new BleedBox.
   * @param height The height of the new BleedBox.
   */
  setBleedBox(e, t, i, n) {
    F(e, "x", ["number"]), F(t, "y", ["number"]), F(i, "width", ["number"]), F(n, "height", ["number"]);
    const a = this.doc.context.obj([e, t, e + i, t + n]);
    this.node.set(x.BleedBox, a);
  }
  /**
   * Set the TrimBox of this page. For example:
   * ```js
   * const trimBox = page.getTrimBox()
   *
   * page.setTrimBox(0, 0, 250, 500)
   * page.setTrimBox(trimBox.x, trimBox.y, 50, 100)
   * page.setTrimBox(15, 5, trimBox.width - 50, trimBox.height - 100)
   * ```
   *
   * See [[PDFPage.getTrimBox]] for details about what the TrimBox represents.
   *
   * @param x The x coordinate of the lower left corner of the new TrimBox.
   * @param y The y coordinate of the lower left corner of the new TrimBox.
   * @param width The width of the new TrimBox.
   * @param height The height of the new TrimBox.
   */
  setTrimBox(e, t, i, n) {
    F(e, "x", ["number"]), F(t, "y", ["number"]), F(i, "width", ["number"]), F(n, "height", ["number"]);
    const a = this.doc.context.obj([e, t, e + i, t + n]);
    this.node.set(x.TrimBox, a);
  }
  /**
   * Set the ArtBox of this page. For example:
   * ```js
   * const artBox = page.getArtBox()
   *
   * page.setArtBox(0, 0, 250, 500)
   * page.setArtBox(artBox.x, artBox.y, 50, 100)
   * page.setArtBox(15, 5, artBox.width - 50, artBox.height - 100)
   * ```
   *
   * See [[PDFPage.getArtBox]] for details about what the ArtBox represents.
   *
   * @param x The x coordinate of the lower left corner of the new ArtBox.
   * @param y The y coordinate of the lower left corner of the new ArtBox.
   * @param width The width of the new ArtBox.
   * @param height The height of the new ArtBox.
   */
  setArtBox(e, t, i, n) {
    F(e, "x", ["number"]), F(t, "y", ["number"]), F(i, "width", ["number"]), F(n, "height", ["number"]);
    const a = this.doc.context.obj([e, t, e + i, t + n]);
    this.node.set(x.ArtBox, a);
  }
  /**
   * Get this page's width and height. For example:
   * ```js
   * const { width, height } = page.getSize()
   * ```
   *
   * This method uses [[PDFPage.getMediaBox]] to obtain the page's
   * width and height.
   *
   * @returns The width and height of the page.
   */
  getSize() {
    const { width: e, height: t } = this.getMediaBox();
    return { width: e, height: t };
  }
  /**
   * Get this page's width. For example:
   * ```js
   * const width = page.getWidth()
   * ```
   *
   * This method uses [[PDFPage.getSize]] to obtain the page's size.
   *
   * @returns The width of the page.
   */
  getWidth() {
    return this.getSize().width;
  }
  /**
   * Get this page's height. For example:
   * ```js
   * const height = page.getHeight()
   * ```
   *
   * This method uses [[PDFPage.getSize]] to obtain the page's size.
   *
   * @returns The height of the page.
   */
  getHeight() {
    return this.getSize().height;
  }
  /**
   * Get the rectangle defining this page's MediaBox. For example:
   * ```js
   * const { x, y, width, height } = page.getMediaBox()
   * ```
   *
   * The MediaBox of a page defines the boundaries of the physical medium on
   * which the page is to be displayed/printed. It may include extended area
   * surrounding the page content for bleed marks, printing marks, etc...
   * It may also include areas close to the edges of the medium that cannot be
   * marked because of physical limitations of the output device. Content
   * falling outside this boundary may safely be discarded without affecting
   * the meaning of the PDF file.
   *
   * @returns An object defining the lower left corner of the MediaBox and its
   *          width & height.
   */
  getMediaBox() {
    return this.node.MediaBox().asRectangle();
  }
  /**
   * Get the rectangle defining this page's CropBox. For example:
   * ```js
   * const { x, y, width, height } = page.getCropBox()
   * ```
   *
   * The CropBox of a page defines the region to which the contents of the page
   * shall be clipped when displayed or printed. Unlike the other boxes, the
   * CropBox does not necessarily represent the physical page geometry. It
   * merely imposes clipping on the page contents.
   *
   * The CropBox's default value is the page's MediaBox.
   *
   * @returns An object defining the lower left corner of the CropBox and its
   *          width & height.
   */
  getCropBox() {
    const e = this.node.CropBox();
    return (e == null ? void 0 : e.asRectangle()) ?? this.getMediaBox();
  }
  /**
   * Get the rectangle defining this page's BleedBox. For example:
   * ```js
   * const { x, y, width, height } = page.getBleedBox()
   * ```
   *
   * The BleedBox of a page defines the region to which the contents of the
   * page shall be clipped when output in a production environment. This may
   * include any extra bleed area needed to accommodate the physical
   * limitations of cutting, folding, and trimming equipment. The actual
   * printed page may include printing marks that fall outside the BleedBox.
   *
   * The BleedBox's default value is the page's CropBox.
   *
   * @returns An object defining the lower left corner of the BleedBox and its
   *          width & height.
   */
  getBleedBox() {
    const e = this.node.BleedBox();
    return (e == null ? void 0 : e.asRectangle()) ?? this.getCropBox();
  }
  /**
   * Get the rectangle defining this page's TrimBox. For example:
   * ```js
   * const { x, y, width, height } = page.getTrimBox()
   * ```
   *
   * The TrimBox of a page defines the intended dimensions of the finished
   * page after trimming. It may be smaller than the MediaBox to allow for
   * production-related content, such as printing instructions, cut marks, or
   * color bars.
   *
   * The TrimBox's default value is the page's CropBox.
   *
   * @returns An object defining the lower left corner of the TrimBox and its
   *          width & height.
   */
  getTrimBox() {
    const e = this.node.TrimBox();
    return (e == null ? void 0 : e.asRectangle()) ?? this.getCropBox();
  }
  /**
   * Get the rectangle defining this page's ArtBox. For example:
   * ```js
   * const { x, y, width, height } = page.getArtBox()
   * ```
   *
   * The ArtBox of a page defines the extent of the page's meaningful content
   * (including potential white space).
   *
   * The ArtBox's default value is the page's CropBox.
   *
   * @returns An object defining the lower left corner of the ArtBox and its
   *          width & height.
   */
  getArtBox() {
    const e = this.node.ArtBox();
    return (e == null ? void 0 : e.asRectangle()) ?? this.getCropBox();
  }
  /**
   * Translate this page's content to a new location on the page. This operation
   * is often useful after resizing the page with [[setSize]]. For example:
   * ```js
   * // Add 50 units of whitespace to the top and right of the page
   * page.setSize(page.getWidth() + 50, page.getHeight() + 50)
   *
   * // Move the page's content from the lower-left corner of the page
   * // to the top-right corner.
   * page.translateContent(50, 50)
   *
   * // Now there are 50 units of whitespace to the left and bottom of the page
   * ```
   * See also: [[resetPosition]]
   * @param x The new position on the x-axis for this page's content.
   * @param y The new position on the y-axis for this page's content.
   */
  translateContent(e, t) {
    F(e, "x", ["number"]), F(t, "y", ["number"]), this.node.normalize(), this.getContentStream();
    const i = this.createContentStream(ye(), Xe(e, t)), n = this.doc.context.register(i), a = this.createContentStream(ve()), s = this.doc.context.register(a);
    this.node.wrapContentStreams(n, s);
  }
  /**
   * Scale the size, content, and annotations of a page.
   *
   * For example:
   * ```js
   * page.scale(0.5, 0.5);
   * ```
   *
   * @param x The factor by which the width for the page should be scaled
   *          (e.g. `0.5` is 50%).
   * @param y The factor by which the height for the page should be scaled
   *          (e.g. `2.0` is 200%).
   */
  scale(e, t) {
    F(e, "x", ["number"]), F(t, "y", ["number"]), this.setSize(this.getWidth() * e, this.getHeight() * t), this.scaleContent(e, t), this.scaleAnnotations(e, t);
  }
  /**
   * Scale the content of a page. This is useful after resizing an existing
   * page. This scales only the content, not the annotations.
   *
   * For example:
   * ```js
   * // Bisect the size of the page
   * page.setSize(page.getWidth() / 2, page.getHeight() / 2);
   *
   * // Scale the content of the page down by 50% in x and y
   * page.scaleContent(0.5, 0.5);
   * ```
   * See also: [[scaleAnnotations]]
   * @param x The factor by which the x-axis for the content should be scaled
   *          (e.g. `0.5` is 50%).
   * @param y The factor by which the y-axis for the content should be scaled
   *          (e.g. `2.0` is 200%).
   */
  scaleContent(e, t) {
    F(e, "x", ["number"]), F(t, "y", ["number"]), this.node.normalize(), this.getContentStream();
    const i = this.createContentStream(ye(), ua(e, t)), n = this.doc.context.register(i), a = this.createContentStream(ve()), s = this.doc.context.register(a);
    this.node.wrapContentStreams(n, s);
  }
  /**
   * Scale the annotations of a page. This is useful if you want to scale a
   * page with comments or other annotations.
   * ```js
   * // Scale the content of the page down by 50% in x and y
   * page.scaleContent(0.5, 0.5);
   *
   * // Scale the content of the page down by 50% in x and y
   * page.scaleAnnotations(0.5, 0.5);
   * ```
   * See also: [[scaleContent]]
   * @param x The factor by which the x-axis for the annotations should be
   *          scaled (e.g. `0.5` is 50%).
   * @param y The factor by which the y-axis for the annotations should be
   *          scaled (e.g. `2.0` is 200%).
   */
  scaleAnnotations(e, t) {
    F(e, "x", ["number"]), F(t, "y", ["number"]);
    const i = this.node.Annots();
    if (i)
      for (let n = 0; n < i.size(); n++) {
        const a = i.lookup(n);
        a instanceof $ && this.scaleAnnot(a, e, t);
      }
  }
  /**
   * Reset the x and y coordinates of this page to `(0, 0)`. This operation is
   * often useful after calling [[translateContent]]. For example:
   * ```js
   * // Shift the page's contents up and to the right by 50 units
   * page.translateContent(50, 50)
   *
   * // This text will shifted - it will be drawn at (50, 50)
   * page.drawText('I am shifted')
   *
   * // Move back to (0, 0)
   * page.resetPosition()
   *
   * // This text will not be shifted - it will be drawn at (0, 0)
   * page.drawText('I am not shifted')
   * ```
   */
  resetPosition() {
    this.getContentStream(!1), this.x = 0, this.y = 0;
  }
  /**
   * Choose a default font for this page. The default font will be used whenever
   * text is drawn on this page and no font is specified. For example:
   * ```js
   * import { StandardFonts } from 'pdf-lib'
   *
   * const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
   * const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
   * const courierFont = await pdfDoc.embedFont(StandardFonts.Courier)
   *
   * const page = pdfDoc.addPage()
   *
   * page.setFont(helveticaFont)
   * page.drawText('I will be drawn in Helvetica')
   *
   * page.setFont(timesRomanFont)
   * page.drawText('I will be drawn in Courier', { font: courierFont })
   * ```
   * @param font The default font to be used when drawing text on this page.
   */
  setFont(e) {
    F(e, "font", [[Ie, "PDFFont"]]), this.font = e, this.fontKey = this.node.newFontDictionary(this.font.name, this.font.ref);
  }
  /**
   * Choose a default font size for this page. The default font size will be
   * used whenever text is drawn on this page and no font size is specified.
   * For example:
   * ```js
   * page.setFontSize(12)
   * page.drawText('I will be drawn in size 12')
   *
   * page.setFontSize(36)
   * page.drawText('I will be drawn in size 24', { fontSize: 24 })
   * ```
   * @param fontSize The default font size to be used when drawing text on this
   *                 page.
   */
  setFontSize(e) {
    F(e, "fontSize", ["number"]), this.fontSize = e;
  }
  /**
   * Choose a default font color for this page. The default font color will be
   * used whenever text is drawn on this page and no font color is specified.
   * For example:
   * ```js
   * import { rgb, cmyk, grayscale } from 'pdf-lib'
   *
   * page.setFontColor(rgb(0.97, 0.02, 0.97))
   * page.drawText('I will be drawn in pink')
   *
   * page.setFontColor(cmyk(0.4, 0.7, 0.39, 0.15))
   * page.drawText('I will be drawn in gray', { color: grayscale(0.5) })
   * ```
   * @param fontColor The default font color to be used when drawing text on
   *                  this page.
   */
  setFontColor(e) {
    F(e, "fontColor", [[Object, "Color"]]), this.fontColor = e;
  }
  /**
   * Choose a default line height for this page. The default line height will be
   * used whenever text is drawn on this page and no line height is specified.
   * For example:
   * ```js
   * page.setLineHeight(12);
   * page.drawText('These lines will be vertically \n separated by 12 units')
   *
   * page.setLineHeight(36);
   * page.drawText('These lines will be vertically \n separated by 24 units', {
   *   lineHeight: 24
   * })
   * ```
   * @param lineHeight The default line height to be used when drawing text on
   *                   this page.
   */
  setLineHeight(e) {
    F(e, "lineHeight", ["number"]), this.lineHeight = e;
  }
  /**
   * Get the default position of this page. For example:
   * ```js
   * const { x, y } = page.getPosition()
   * ```
   * @returns The default position of the page.
   */
  getPosition() {
    return { x: this.x, y: this.y };
  }
  /**
   * Get the default x coordinate of this page. For example:
   * ```js
   * const x = page.getX()
   * ```
   * @returns The default x coordinate of the page.
   */
  getX() {
    return this.x;
  }
  /**
   * Get the default y coordinate of this page. For example:
   * ```js
   * const y = page.getY()
   * ```
   * @returns The default y coordinate of the page.
   */
  getY() {
    return this.y;
  }
  /**
   * Change the default position of this page. For example:
   * ```js
   * page.moveTo(0, 0)
   * page.drawText('I will be drawn at the origin')
   *
   * page.moveTo(0, 25)
   * page.drawText('I will be drawn 25 units up')
   *
   * page.moveTo(25, 25)
   * page.drawText('I will be drawn 25 units up and 25 units to the right')
   * ```
   * @param x The new default position on the x-axis for this page.
   * @param y The new default position on the y-axis for this page.
   */
  moveTo(e, t) {
    F(e, "x", ["number"]), F(t, "y", ["number"]), this.x = e, this.y = t;
  }
  /**
   * Change the default position of this page to be further down the y-axis.
   * For example:
   * ```js
   * page.moveTo(50, 50)
   * page.drawText('I will be drawn at (50, 50)')
   *
   * page.moveDown(10)
   * page.drawText('I will be drawn at (50, 40)')
   * ```
   * @param yDecrease The amount by which the page's default position along the
   *                  y-axis should be decreased.
   */
  moveDown(e) {
    F(e, "yDecrease", ["number"]), this.y -= e;
  }
  /**
   * Change the default position of this page to be further up the y-axis.
   * For example:
   * ```js
   * page.moveTo(50, 50)
   * page.drawText('I will be drawn at (50, 50)')
   *
   * page.moveUp(10)
   * page.drawText('I will be drawn at (50, 60)')
   * ```
   * @param yIncrease The amount by which the page's default position along the
   *                  y-axis should be increased.
   */
  moveUp(e) {
    F(e, "yIncrease", ["number"]), this.y += e;
  }
  /**
   * Change the default position of this page to be further left on the x-axis.
   * For example:
   * ```js
   * page.moveTo(50, 50)
   * page.drawText('I will be drawn at (50, 50)')
   *
   * page.moveLeft(10)
   * page.drawText('I will be drawn at (40, 50)')
   * ```
   * @param xDecrease The amount by which the page's default position along the
   *                  x-axis should be decreased.
   */
  moveLeft(e) {
    F(e, "xDecrease", ["number"]), this.x -= e;
  }
  /**
   * Change the default position of this page to be further right on the y-axis.
   * For example:
   * ```js
   * page.moveTo(50, 50)
   * page.drawText('I will be drawn at (50, 50)')
   *
   * page.moveRight(10)
   * page.drawText('I will be drawn at (60, 50)')
   * ```
   * @param xIncrease The amount by which the page's default position along the
   *                  x-axis should be increased.
   */
  moveRight(e) {
    F(e, "xIncrease", ["number"]), this.x += e;
  }
  /**
   * Push one or more operators to the end of this page's current content
   * stream. For example:
   * ```js
   * import {
   *   pushGraphicsState,
   *   moveTo,
   *   lineTo,
   *   closePath,
   *   setFillingColor,
   *   rgb,
   *   fill,
   *   popGraphicsState,
   * } from 'pdf-lib'
   *
   * // Draw a green triangle in the lower-left corner of the page
   * page.pushOperators(
   *   pushGraphicsState(),
   *   moveTo(0, 0),
   *   lineTo(100, 0),
   *   lineTo(50, 100),
   *   closePath(),
   *   setFillingColor(rgb(0.0, 1.0, 0.0)),
   *   fill(),
   *   popGraphicsState(),
   * )
   * ```
   * @param operator The operators to be pushed.
   */
  pushOperators(...e) {
    lc(e, "operator", [[is, "PDFOperator"]]), this.getContentStream().push(...e);
  }
  /**
   * Draw one or more lines of text on this page. For example:
   * ```js
   * import { StandardFonts, rgb } from 'pdf-lib'
   *
   * const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
   * const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
   *
   * const page = pdfDoc.addPage()
   *
   * page.setFont(helveticaFont)
   *
   * page.moveTo(5, 200)
   * page.drawText('The Life of an Egg', { size: 36 })
   *
   * page.moveDown(36)
   * page.drawText('An Epic Tale of Woe', { size: 30 })
   *
   * page.drawText(
   *   `Humpty Dumpty sat on a wall \n` +
   *   `Humpty Dumpty had a great fall; \n` +
   *   `All the king's horses and all the king's men \n` +
   *   `Couldn't put Humpty together again. \n`,
   *   {
   *     x: 25,
   *     y: 100,
   *     font: timesRomanFont,
   *     size: 24,
   *     color: rgb(1, 0, 0),
   *     lineHeight: 24,
   *     opacity: 0.75,
   *   },
   * )
   * ```
   * @param text The text to be drawn.
   * @param options The options to be used when drawing the text.
   */
  drawText(e, t = {}) {
    F(e, "text", ["string"]), R(t.color, "options.color", [[Object, "Color"]]), et(t.opacity, "opacity.opacity", 0, 1), R(t.font, "options.font", [[Ie, "PDFFont"]]), R(t.size, "options.size", ["number"]), R(t.rotate, "options.rotate", [[Object, "Rotation"]]), R(t.xSkew, "options.xSkew", [[Object, "Rotation"]]), R(t.ySkew, "options.ySkew", [[Object, "Rotation"]]), R(t.x, "options.x", ["number"]), R(t.y, "options.y", ["number"]), R(t.lineHeight, "options.lineHeight", ["number"]), R(t.maxWidth, "options.maxWidth", ["number"]), R(t.wordBreaks, "options.wordBreaks", [Array]), $e(t.blendMode, "options.blendMode", yt);
    const { oldFont: i, newFont: n, newFontKey: a } = this.setOrEmbedFont(t.font), s = t.size || this.fontSize, o = t.wordBreaks || this.doc.defaultWordBreaks, l = (d) => n.widthOfTextAtSize(d, s), c = t.maxWidth === void 0 ? fc(ba(e)) : Tu(e, o, t.maxWidth, l), u = new Array(c.length);
    for (let d = 0, b = c.length; d < b; d++)
      u[d] = n.encodeText(c[d]);
    const f = this.maybeEmbedGraphicsState({
      opacity: t.opacity,
      blendMode: t.blendMode
    });
    this.getContentStream().push(...lh(u, {
      color: t.color ?? this.fontColor,
      font: a,
      size: s,
      rotate: t.rotate ?? H(0),
      xSkew: t.xSkew ?? H(0),
      ySkew: t.ySkew ?? H(0),
      x: t.x ?? this.x,
      y: t.y ?? this.y,
      lineHeight: t.lineHeight ?? this.lineHeight,
      graphicsState: f,
      matrix: t.matrix,
      clipSpaces: t.clipSpaces
    })), t.font && (i ? this.setFont(i) : this.resetFont());
  }
  /**
   * Draw an image on this page. For example:
   * ```js
   * import { degrees } from 'pdf-lib'
   *
   * const jpgUrl = 'https://pdf-lib.js.org/assets/cat_riding_unicorn.jpg'
   * const jpgImageBytes = await fetch(jpgUrl).then((res) => res.arrayBuffer())
   *
   * const jpgImage = await pdfDoc.embedJpg(jpgImageBytes)
   * const jpgDims = jpgImage.scale(0.5)
   *
   * const page = pdfDoc.addPage()
   *
   * page.drawImage(jpgImage, {
   *   x: 25,
   *   y: 25,
   *   width: jpgDims.width,
   *   height: jpgDims.height,
   *   rotate: degrees(30),
   *   opacity: 0.75,
   * })
   * ```
   * @param image The image to be drawn.
   * @param options The options to be used when drawing the image.
   */
  drawImage(e, t = {}) {
    F(e, "image", [[Li, "PDFImage"]]), R(t.x, "options.x", ["number"]), R(t.y, "options.y", ["number"]), R(t.width, "options.width", ["number"]), R(t.height, "options.height", ["number"]), R(t.rotate, "options.rotate", [[Object, "Rotation"]]), R(t.xSkew, "options.xSkew", [[Object, "Rotation"]]), R(t.ySkew, "options.ySkew", [[Object, "Rotation"]]), et(t.opacity, "opacity.opacity", 0, 1), $e(t.blendMode, "options.blendMode", yt);
    const i = this.node.newXObject("Image", e.ref), n = this.maybeEmbedGraphicsState({
      opacity: t.opacity,
      blendMode: t.blendMode
    });
    this.getContentStream().push(...$c(i, {
      x: t.x ?? this.x,
      y: t.y ?? this.y,
      width: t.width ?? e.size().width,
      height: t.height ?? e.size().height,
      rotate: t.rotate ?? H(0),
      xSkew: t.xSkew ?? H(0),
      ySkew: t.ySkew ?? H(0),
      graphicsState: n,
      matrix: t.matrix,
      clipSpaces: t.clipSpaces
    }));
  }
  /**
   * Draw an embedded PDF page on this page. For example:
   * ```js
   * import { degrees } from 'pdf-lib'
   *
   * const pdfDoc = await PDFDocument.create()
   * const page = pdfDoc.addPage()
   *
   * const sourcePdfUrl = 'https://pdf-lib.js.org/assets/with_large_page_count.pdf'
   * const sourcePdf = await fetch(sourcePdfUrl).then((res) => res.arrayBuffer())
   *
   * // Embed page 74 from the PDF
   * const [embeddedPage] = await pdfDoc.embedPdf(sourcePdf, 73)
   *
   * page.drawPage(embeddedPage, {
   *   x: 250,
   *   y: 200,
   *   xScale: 0.5,
   *   yScale: 0.5,
   *   rotate: degrees(30),
   *   opacity: 0.75,
   * })
   * ```
   *
   * The `options` argument accepts both `width`/`height` and `xScale`/`yScale`
   * as options. Since each of these options defines the size of the drawn page,
   * if both options are given, `width` and `height` take precedence and the
   * corresponding scale variants are ignored.
   *
   * @param embeddedPage The embedded page to be drawn.
   * @param options The options to be used when drawing the embedded page.
   */
  drawPage(e, t = {}) {
    F(e, "embeddedPage", [[Pt, "PDFEmbeddedPage"]]), R(t.x, "options.x", ["number"]), R(t.y, "options.y", ["number"]), R(t.xScale, "options.xScale", ["number"]), R(t.yScale, "options.yScale", ["number"]), R(t.width, "options.width", ["number"]), R(t.height, "options.height", ["number"]), R(t.rotate, "options.rotate", [[Object, "Rotation"]]), R(t.xSkew, "options.xSkew", [[Object, "Rotation"]]), R(t.ySkew, "options.ySkew", [[Object, "Rotation"]]), et(t.opacity, "opacity.opacity", 0, 1), $e(t.blendMode, "options.blendMode", yt);
    const i = this.node.newXObject("EmbeddedPdfPage", e.ref), n = this.maybeEmbedGraphicsState({
      opacity: t.opacity,
      blendMode: t.blendMode
    }), a = t.width !== void 0 ? t.width / e.width : t.xScale !== void 0 ? t.xScale : 1, s = t.height !== void 0 ? t.height / e.height : t.yScale !== void 0 ? t.yScale : 1;
    this.getContentStream().push(...uh(i, {
      x: t.x ?? this.x,
      y: t.y ?? this.y,
      xScale: a,
      yScale: s,
      rotate: t.rotate ?? H(0),
      xSkew: t.xSkew ?? H(0),
      ySkew: t.ySkew ?? H(0),
      graphicsState: n
    }));
  }
  /**
   * Draw an SVG path on this page. For example:
   * ```js
   * import { rgb } from 'pdf-lib'
   *
   * const svgPath = 'M 0,20 L 100,160 Q 130,200 150,120 C 190,-40 200,200 300,150 L 400,90'
   *
   * // Draw path as black line
   * page.drawSvgPath(svgPath, { x: 25, y: 75 })
   *
   * // Change border style and opacity
   * page.drawSvgPath(svgPath, {
   *   x: 25,
   *   y: 275,
   *   borderColor: rgb(0.5, 0.5, 0.5),
   *   borderWidth: 2,
   *   borderOpacity: 0.75,
   * })
   *
   * // Set fill color and opacity
   * page.drawSvgPath(svgPath, {
   *   x: 25,
   *   y: 475,
   *   color: rgb(1.0, 0, 0),
   *   opacity: 0.75,
   * })
   *
   * // Draw 50% of original size
   * page.drawSvgPath(svgPath, {
   *   x: 25,
   *   y: 675,
   *   scale: 0.5,
   * })
   * ```
   * @param path The SVG path to be drawn.
   * @param options The options to be used when drawing the SVG path.
   */
  drawSvgPath(e, t = {}) {
    F(e, "path", ["string"]), R(t.x, "options.x", ["number"]), R(t.y, "options.y", ["number"]), R(t.scale, "options.scale", ["number"]), R(t.rotate, "options.rotate", [[Object, "Rotation"]]), R(t.borderWidth, "options.borderWidth", ["number"]), R(t.color, "options.color", [[Object, "Color"]]), et(t.opacity, "opacity.opacity", 0, 1), R(t.borderColor, "options.borderColor", [[Object, "Color"]]), R(t.borderDashArray, "options.borderDashArray", [Array]), R(t.borderDashPhase, "options.borderDashPhase", ["number"]), $e(t.borderLineCap, "options.borderLineCap", lr), et(t.borderOpacity, "options.borderOpacity", 0, 1), $e(t.blendMode, "options.blendMode", yt), $e(t.fillRule, "options.fillRule", zn);
    const i = this.maybeEmbedGraphicsState({
      opacity: t.opacity,
      borderOpacity: t.borderOpacity,
      blendMode: t.blendMode
    });
    !("color" in t) && !("borderColor" in t) && (t.borderColor = se(0, 0, 0)), this.getContentStream().push(...fh(e, {
      x: t.x ?? this.x,
      y: t.y ?? this.y,
      scale: t.scale,
      rotate: t.rotate ?? H(0),
      color: t.color ?? void 0,
      borderColor: t.borderColor ?? void 0,
      borderWidth: t.borderWidth ?? 0,
      borderDashArray: t.borderDashArray ?? void 0,
      borderDashPhase: t.borderDashPhase ?? void 0,
      borderLineCap: t.borderLineCap ?? void 0,
      graphicsState: i,
      fillRule: t.fillRule,
      matrix: t.matrix,
      clipSpaces: t.clipSpaces
    }));
  }
  /**
   * Draw a line on this page. For example:
   * ```js
   * import { rgb } from 'pdf-lib'
   *
   * page.drawLine({
   *   start: { x: 25, y: 75 },
   *   end: { x: 125, y: 175 },
   *   thickness: 2,
   *   color: rgb(0.75, 0.2, 0.2),
   *   opacity: 0.75,
   * })
   * ```
   * @param options The options to be used when drawing the line.
   */
  drawLine(e) {
    F(e.start, "options.start", [[Object, "{ x: number, y: number }"]]), F(e.end, "options.end", [[Object, "{ x: number, y: number }"]]), F(e.start.x, "options.start.x", ["number"]), F(e.start.y, "options.start.y", ["number"]), F(e.end.x, "options.end.x", ["number"]), F(e.end.y, "options.end.y", ["number"]), R(e.thickness, "options.thickness", ["number"]), R(e.color, "options.color", [[Object, "Color"]]), R(e.dashArray, "options.dashArray", [Array]), R(e.dashPhase, "options.dashPhase", ["number"]), $e(e.lineCap, "options.lineCap", lr), et(e.opacity, "opacity.opacity", 0, 1), $e(e.blendMode, "options.blendMode", yt);
    const t = this.maybeEmbedGraphicsState({
      borderOpacity: e.opacity,
      blendMode: e.blendMode
    });
    "color" in e || (e.color = se(0, 0, 0)), this.getContentStream().push(...dh({
      start: e.start,
      end: e.end,
      thickness: e.thickness ?? 1,
      color: e.color ?? void 0,
      dashArray: e.dashArray ?? void 0,
      dashPhase: e.dashPhase ?? void 0,
      lineCap: e.lineCap ?? void 0,
      graphicsState: t,
      matrix: e.matrix,
      clipSpaces: e.clipSpaces
    }));
  }
  /**
   * Draw a rectangle on this page. For example:
   * ```js
   * import { degrees, grayscale, rgb } from 'pdf-lib'
   *
   * page.drawRectangle({
   *   x: 25,
   *   y: 75,
   *   width: 250,
   *   height: 75,
   *   rotate: degrees(-15),
   *   borderWidth: 5,
   *   borderColor: grayscale(0.5),
   *   color: rgb(0.75, 0.2, 0.2),
   *   opacity: 0.5,
   *   borderOpacity: 0.75,
   *   radius: 0.1,
   * })
   * ```
   * @param options The options to be used when drawing the rectangle.
   */
  drawRectangle(e = {}) {
    R(e.x, "options.x", ["number"]), R(e.y, "options.y", ["number"]), R(e.width, "options.width", ["number"]), R(e.height, "options.height", ["number"]), R(e.rotate, "options.rotate", [[Object, "Rotation"]]), R(e.xSkew, "options.xSkew", [[Object, "Rotation"]]), R(e.ySkew, "options.ySkew", [[Object, "Rotation"]]), R(e.borderWidth, "options.borderWidth", ["number"]), R(e.color, "options.color", [[Object, "Color"]]), et(e.opacity, "opacity.opacity", 0, 1), R(e.borderColor, "options.borderColor", [[Object, "Color"]]), R(e.borderDashArray, "options.borderDashArray", [Array]), R(e.borderDashPhase, "options.borderDashPhase", ["number"]), $e(e.borderLineCap, "options.borderLineCap", lr), et(e.borderOpacity, "options.borderOpacity", 0, 1), $e(e.blendMode, "options.blendMode", yt), R(e.radius, "options.radius", ["number"]);
    const t = this.maybeEmbedGraphicsState({
      opacity: e.opacity,
      borderOpacity: e.borderOpacity,
      blendMode: e.blendMode
    });
    !("color" in e) && !("borderColor" in e) && (e.color = se(0, 0, 0)), this.getContentStream().push(...oi({
      x: e.x ?? this.x,
      y: e.y ?? this.y,
      width: e.width ?? 150,
      height: e.height ?? 100,
      rotate: e.rotate ?? H(0),
      xSkew: e.xSkew ?? H(0),
      ySkew: e.ySkew ?? H(0),
      borderWidth: e.borderWidth ?? 0,
      color: e.color ?? void 0,
      borderColor: e.borderColor ?? void 0,
      borderDashArray: e.borderDashArray ?? void 0,
      borderDashPhase: e.borderDashPhase ?? void 0,
      graphicsState: t,
      borderLineCap: e.borderLineCap ?? void 0,
      matrix: e.matrix,
      clipSpaces: e.clipSpaces,
      radius: e.radius ?? 0
    }));
  }
  /**
   * Draw a square on this page. For example:
   * ```js
   * import { degrees, grayscale, rgb } from 'pdf-lib'
   *
   * page.drawSquare({
   *   x: 25,
   *   y: 75,
   *   size: 100,
   *   rotate: degrees(-15),
   *   borderWidth: 5,
   *   borderColor: grayscale(0.5),
   *   color: rgb(0.75, 0.2, 0.2),
   *   opacity: 0.5,
   *   borderOpacity: 0.75,
   * })
   * ```
   * @param options The options to be used when drawing the square.
   */
  drawSquare(e = {}) {
    const { size: t } = e;
    R(t, "size", ["number"]), this.drawRectangle({ ...e, width: t, height: t });
  }
  /**
   * Draw an ellipse on this page. For example:
   * ```js
   * import { grayscale, rgb } from 'pdf-lib'
   *
   * page.drawEllipse({
   *   x: 200,
   *   y: 75,
   *   xScale: 100,
   *   yScale: 50,
   *   borderWidth: 5,
   *   borderColor: grayscale(0.5),
   *   color: rgb(0.75, 0.2, 0.2),
   *   opacity: 0.5,
   *   borderOpacity: 0.75,
   * })
   * ```
   * @param options The options to be used when drawing the ellipse.
   */
  drawEllipse(e = {}) {
    R(e.x, "options.x", ["number"]), R(e.y, "options.y", ["number"]), R(e.xScale, "options.xScale", ["number"]), R(e.yScale, "options.yScale", ["number"]), R(e.rotate, "options.rotate", [[Object, "Rotation"]]), R(e.color, "options.color", [[Object, "Color"]]), et(e.opacity, "opacity.opacity", 0, 1), R(e.borderColor, "options.borderColor", [[Object, "Color"]]), et(e.borderOpacity, "options.borderOpacity", 0, 1), R(e.borderWidth, "options.borderWidth", ["number"]), R(e.borderDashArray, "options.borderDashArray", [Array]), R(e.borderDashPhase, "options.borderDashPhase", ["number"]), $e(e.borderLineCap, "options.borderLineCap", lr), $e(e.blendMode, "options.blendMode", yt);
    const t = this.maybeEmbedGraphicsState({
      opacity: e.opacity,
      borderOpacity: e.borderOpacity,
      blendMode: e.blendMode
    });
    !("color" in e) && !("borderColor" in e) && (e.color = se(0, 0, 0)), this.getContentStream().push(...gs({
      x: e.x ?? this.x,
      y: e.y ?? this.y,
      xScale: e.xScale ?? 100,
      yScale: e.yScale ?? 100,
      rotate: e.rotate ?? void 0,
      color: e.color ?? void 0,
      borderColor: e.borderColor ?? void 0,
      borderWidth: e.borderWidth ?? 0,
      borderDashArray: e.borderDashArray ?? void 0,
      borderDashPhase: e.borderDashPhase ?? void 0,
      borderLineCap: e.borderLineCap ?? void 0,
      graphicsState: t,
      matrix: e.matrix,
      clipSpaces: e.clipSpaces
    }));
  }
  /**
   * Draw a circle on this page. For example:
   * ```js
   * import { grayscale, rgb } from 'pdf-lib'
   *
   * page.drawCircle({
   *   x: 200,
   *   y: 150,
   *   size: 100,
   *   borderWidth: 5,
   *   borderColor: grayscale(0.5),
   *   color: rgb(0.75, 0.2, 0.2),
   *   opacity: 0.5,
   *   borderOpacity: 0.75,
   * })
   * ```
   * @param options The options to be used when drawing the ellipse.
   */
  drawCircle(e = {}) {
    const { size: t = 100 } = e;
    R(t, "size", ["number"]), this.drawEllipse({ ...e, xScale: t, yScale: t });
  }
  setOrEmbedFont(e) {
    const t = this.font, i = this.fontKey;
    e ? this.setFont(e) : this.getFont();
    const n = this.font, a = this.fontKey;
    return { oldFont: t, oldFontKey: i, newFont: n, newFontKey: a };
  }
  /**
   * Draw an SVG on this page. For example:
   * ```js
   * const svg = '<svg><path d="M 0,20 L 100,160 Q 130,200 150,120 C 190,-40 200,200 300,150 L 400,90"></path></svg>'
   *
   * // Draw svg
   * page.drawSvg(svg, { x: 25, y: 75 })
   * ```
   * @param svg The SVG to be drawn.
   * @param options The options to be used when drawing the SVG.
   */
  async drawSvg(e, t = {}) {
    F(e, "svg", ["string"]), R(t.x, "options.x", ["number"]), R(t.y, "options.y", ["number"]), R(t.width, "options.width", ["number"]), R(t.height, "options.height", ["number"]), await dw(this, e, {
      x: t.x ?? this.x,
      y: t.y ?? this.y,
      fonts: t.fonts,
      width: t.width,
      height: t.height
    });
  }
  getFont() {
    if (!this.font || !this.fontKey) {
      const e = this.doc.embedStandardFont(aa.Helvetica);
      this.setFont(e);
    }
    return [this.font, this.fontKey];
  }
  resetFont() {
    this.font = void 0, this.fontKey = void 0;
  }
  getContentStream(e = !0) {
    return e && this.contentStream ? this.contentStream : (this.contentStream = this.createContentStream(), this.contentStreamRef = this.doc.context.register(this.contentStream), this.node.addContentStream(this.contentStreamRef), this.contentStream);
  }
  createContentStream(...e) {
    const t = this.doc.context.obj({});
    return Ot.of(t, e);
  }
  maybeEmbedGraphicsState(e) {
    const { opacity: t, borderOpacity: i, blendMode: n } = e;
    if (t === void 0 && i === void 0 && n === void 0)
      return;
    const a = this.doc.context.obj({
      Type: "ExtGState",
      ca: t,
      CA: i,
      BM: n
    });
    return this.node.newExtGState("GS", a);
  }
  scaleAnnot(e, t, i) {
    const n = ["RD", "CL", "Vertices", "QuadPoints", "L", "Rect"];
    for (let s = 0, o = n.length; s < o; s++) {
      const l = e.lookup(x.of(n[s]));
      l instanceof V && l.scalePDFNumbers(t, i);
    }
    const a = e.lookup(x.of("InkList"));
    if (a instanceof V)
      for (let s = 0, o = a.size(); s < o; s++) {
        const l = a.lookup(s);
        l instanceof V && l.scalePDFNumbers(t, i);
      }
  }
}
Object.defineProperty(Fe, "of", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e, t) => new Fe(r, e, t)
});
Object.defineProperty(Fe, "create", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r) => {
    F(r, "doc", [[Se, "PDFDocument"]]);
    const e = te.of(-1), t = Be.withContextAndParent(r.context, e), i = r.context.register(t);
    return new Fe(t, i, r);
  }
});
class Wr extends Fr {
  constructor(e, t, i) {
    super(e, t, i), Object.defineProperty(this, "acroField", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), F(e, "acroButton", [[Zt, "PDFAcroPushButton"]]), this.acroField = e;
  }
  /**
   * Display an image inside the bounds of this button's widgets. For example:
   * ```js
   * const pngImage = await pdfDoc.embedPng(...)
   * const button = form.getButton('some.button.field')
   * button.setImage(pngImage, ImageAlignment.Center)
   * ```
   * This will update the appearances streams for each of this button's widgets.
   * @param image The image that should be displayed.
   * @param alignment The alignment of the image.
   */
  setImage(e, t = Mt.Center) {
    const i = this.acroField.getWidgets();
    for (let n = 0, a = i.length; n < a; n++) {
      const s = i[n], o = this.createImageAppearanceStream(s, e, t);
      this.updateWidgetAppearances(s, { normal: o });
    }
    this.markAsClean();
  }
  /**
   * Set the font size for this field. Larger font sizes will result in larger
   * text being displayed when PDF readers render this button. Font sizes may
   * be integer or floating point numbers. Supplying a negative font size will
   * cause this method to throw an error.
   *
   * For example:
   * ```js
   * const button = form.getButton('some.button.field')
   * button.setFontSize(4)
   * button.setFontSize(15.7)
   * ```
   *
   * > This method depends upon the existence of a default appearance
   * > (`/DA`) string. If this field does not have a default appearance string,
   * > or that string does not contain a font size (via the `Tf` operator),
   * > then this method will throw an error.
   *
   * @param fontSize The font size to be used when rendering text in this field.
   */
  setFontSize(e) {
    xa(e, "fontSize"), this.acroField.setFontSize(e), this.markAsDirty();
  }
  /**
   * Show this button on the specified page with the given text. For example:
   * ```js
   * const ubuntuFont = await pdfDoc.embedFont(ubuntuFontBytes)
   * const page = pdfDoc.addPage()
   *
   * const form = pdfDoc.getForm()
   * const button = form.createButton('some.button.field')
   *
   * button.addToPage('Do Stuff', page, {
   *   x: 50,
   *   y: 75,
   *   width: 200,
   *   height: 100,
   *   textColor: rgb(1, 0, 0),
   *   backgroundColor: rgb(0, 1, 0),
   *   borderColor: rgb(0, 0, 1),
   *   borderWidth: 2,
   *   rotate: degrees(90),
   *   font: ubuntuFont,
   * })
   * ```
   * This will create a new widget for this button field.
   * @param text The text to be displayed for this button widget.
   * @param page The page to which this button widget should be added.
   * @param options The options to be used when adding this button widget.
   */
  addToPage(e, t, i) {
    R(e, "text", ["string"]), R(t, "page", [[Fe, "PDFPage"]]), tn(i);
    const n = this.createWidget({
      x: ((i == null ? void 0 : i.x) ?? 0) - ((i == null ? void 0 : i.borderWidth) ?? 0) / 2,
      y: ((i == null ? void 0 : i.y) ?? 0) - ((i == null ? void 0 : i.borderWidth) ?? 0) / 2,
      width: (i == null ? void 0 : i.width) ?? 100,
      height: (i == null ? void 0 : i.height) ?? 50,
      textColor: (i == null ? void 0 : i.textColor) ?? se(0, 0, 0),
      backgroundColor: (i == null ? void 0 : i.backgroundColor) ?? se(0.75, 0.75, 0.75),
      borderColor: i == null ? void 0 : i.borderColor,
      borderWidth: (i == null ? void 0 : i.borderWidth) ?? 0,
      rotate: (i == null ? void 0 : i.rotate) ?? H(0),
      caption: e,
      hidden: i == null ? void 0 : i.hidden,
      page: t.ref
    }), a = this.doc.context.register(n.dict);
    this.acroField.addWidget(a);
    const s = (i == null ? void 0 : i.font) ?? this.doc.getForm().getDefaultFont();
    this.updateWidgetAppearance(n, s), t.node.addAnnot(a);
  }
  /**
   * Returns `true` if this button has been marked as dirty, or if any of this
   * button's widgets do not have an appearance stream. For example:
   * ```js
   * const button = form.getButton('some.button.field')
   * if (button.needsAppearancesUpdate()) console.log('Needs update')
   * ```
   * @returns Whether or not this button needs an appearance update.
   */
  needsAppearancesUpdate() {
    var t;
    if (this.isDirty())
      return !0;
    const e = this.acroField.getWidgets();
    for (let i = 0, n = e.length; i < n; i++)
      if (!(((t = e[i].getAppearances()) == null ? void 0 : t.normal) instanceof Ze))
        return !0;
    return !1;
  }
  /**
   * Update the appearance streams for each of this button's widgets using
   * the default appearance provider for buttons. For example:
   * ```js
   * const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
   * const button = form.getButton('some.button.field')
   * button.defaultUpdateAppearances(helvetica)
   * ```
   * @param font The font to be used for creating the appearance streams.
   */
  defaultUpdateAppearances(e) {
    F(e, "font", [[Ie, "PDFFont"]]), this.updateAppearances(e);
  }
  /**
   * Update the appearance streams for each of this button's widgets using
   * the given appearance provider. If no `provider` is passed, the default
   * appearance provider for buttons will be used. For example:
   * ```js
   * const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
   * const button = form.getButton('some.button.field')
   * button.updateAppearances(helvetica, (field, widget, font) => {
   *   ...
   *   return {
   *     normal: drawButton(...),
   *     down: drawButton(...),
   *   }
   * })
   * ```
   * @param font The font to be used for creating the appearance streams.
   * @param provider Optionally, the appearance provider to be used for
   *                 generating the contents of the appearance streams.
   */
  updateAppearances(e, t) {
    F(e, "font", [[Ie, "PDFFont"]]), R(t, "provider", [Function]);
    const i = this.acroField.getWidgets();
    for (let n = 0, a = i.length; n < a; n++) {
      const s = i[n];
      this.updateWidgetAppearance(s, e, t);
    }
  }
  updateWidgetAppearance(e, t, i) {
    const a = hi((i ?? Th)(this, e, t));
    this.updateWidgetAppearanceWithFont(e, t, a);
  }
}
Object.defineProperty(Wr, "of", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (r, e, t) => new Wr(r, e, t)
});
const K0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get AFRelationship() {
    return us;
  },
  get AcroButtonFlags() {
    return Ge;
  },
  get AcroChoiceFlags() {
    return ne;
  },
  get AcroFieldFlags() {
    return tt;
  },
  get AcroTextFlags() {
    return xe;
  },
  get AnnotationFlags() {
    return Ri;
  },
  AppearanceCharacteristics: Ti,
  get BlendMode() {
    return yt;
  },
  Cache: it,
  CharCodes: w,
  get ColorTypes() {
    return Gh;
  },
  CombedTextLayoutError: kh,
  CorruptPageTreeError: Eo,
  CustomFontEmbedder: Gi,
  CustomFontSubsetEmbedder: Ls,
  get Duplex() {
    return ta;
  },
  EncryptedPDFError: gh,
  ExceededMaxLengthError: Sh,
  FieldAlreadyExistsError: Hc,
  FieldExistsAsNonTerminalError: Fm,
  FileEmbedder: Ms,
  get FillRule() {
    return zn;
  },
  FontkitNotRegisteredError: ph,
  ForeignPageError: mh,
  get ImageAlignment() {
    return Mt;
  },
  IndexOutOfBoundsError: In,
  InvalidAcroFieldValueError: ks,
  InvalidFieldNamePartError: vh,
  InvalidMaxLengthError: Ah,
  InvalidPDFDateStringError: cc,
  InvalidTargetIndexError: Do,
  JpegEmbedder: va,
  get LineCapStyle() {
    return lr;
  },
  get LineJoinStyle() {
    return Va;
  },
  MethodNotImplementedError: Lt,
  MissingCatalogError: Xh,
  MissingDAEntryError: au,
  MissingKeywordError: xu,
  MissingOnValueCheckError: Cm,
  MissingPDFHeaderError: bu,
  MissingPageContentsEmbeddingError: tu,
  MissingTfOperatorError: su,
  MultiSelectValueError: ou,
  NextByteAssertionError: lu,
  NoSuchFieldError: yh,
  get NonFullScreenPageMode() {
    return Pi;
  },
  NumberParsingError: To,
  PDFAcroButton: qs,
  PDFAcroCheckBox: $t,
  PDFAcroChoice: zc,
  PDFAcroComboBox: Wt,
  PDFAcroField: Oa,
  PDFAcroForm: Gt,
  PDFAcroListBox: Vt,
  PDFAcroNonTerminal: Ht,
  PDFAcroPushButton: Zt,
  PDFAcroRadioButton: Kt,
  PDFAcroSignature: zi,
  PDFAcroTerminal: Ut,
  PDFAcroText: qt,
  PDFAnnotation: fs,
  PDFArray: V,
  PDFArrayIsNotRectangleError: V0,
  PDFBool: Dt,
  PDFButton: Wr,
  PDFCatalog: ai,
  PDFCheckBox: fr,
  PDFContentStream: Ot,
  PDFContext: ji,
  PDFCrossRefSection: Gr,
  PDFCrossRefStream: vr,
  PDFDict: $,
  PDFDocument: Se,
  PDFDropdown: Lr,
  PDFEmbeddedPage: Pt,
  PDFField: Fr,
  PDFFlateStream: zs,
  PDFFont: Ie,
  PDFForm: ps,
  PDFHeader: Vr,
  PDFHexString: z,
  PDFImage: Li,
  PDFInvalidObject: Yr,
  PDFInvalidObjectParsingError: gu,
  PDFJavaScript: ws,
  PDFName: x,
  PDFNull: Le,
  PDFNumber: q,
  PDFObject: bt,
  PDFObjectCopier: Vn,
  PDFObjectParser: si,
  PDFObjectParsingError: uu,
  PDFObjectStream: Xr,
  PDFObjectStreamParser: bs,
  PDFOperator: is,
  PDFOperatorNames: Po,
  PDFOptionList: Mr,
  PDFPage: Fe,
  PDFPageEmbedder: Fa,
  PDFPageLeaf: Be,
  PDFPageTree: ft,
  PDFParser: ra,
  PDFParsingError: Yh,
  PDFRadioGroup: br,
  PDFRawStream: Et,
  PDFRef: te,
  PDFSignature: Mi,
  PDFStream: Ze,
  PDFStreamParsingError: hu,
  PDFStreamWriter: ls,
  PDFString: G,
  PDFTextField: Ur,
  PDFTrailer: Ii,
  PDFTrailerDict: cs,
  PDFWidgetAnnotation: _r,
  PDFWriter: Gn,
  PDFXRefStreamParser: xs,
  PageEmbeddingMismatchedContextError: Pu,
  PageSizes: jh,
  get ParseSpeeds() {
    return ms;
  },
  PngEmbedder: Ca,
  get PrintScaling() {
    return Ei;
  },
  PrivateConstructorError: sc,
  get ReadingDirection() {
    return Di;
  },
  RemovePageFromEmptyDocumentError: wh,
  ReparseError: Ss,
  RichTextFieldReadError: _h,
  get RotationTypes() {
    return Jh;
  },
  StalledParserError: fu,
  StandardFontEmbedder: Jr,
  StandardFontValues: Qh,
  get StandardFonts() {
    return aa;
  },
  get TextAlignment() {
    return ke;
  },
  get TextRenderingMode() {
    return ef;
  },
  UnbalancedParenthesisError: du,
  UnexpectedFieldTypeError: ar,
  UnexpectedObjectTypeError: Nn,
  UnrecognizedStreamTypeError: ru,
  UnsupportedEncodingError: eu,
  ViewerPreferences: ni,
  addRandomSuffix: tf,
  adjustDimsForRotation: Cr,
  appendBezierCurve: Oe,
  appendQuadraticCurve: ln,
  arrayAsString: vn,
  asNumber: J,
  asPDFName: rf,
  asPDFNumber: nf,
  assertEachIs: lc,
  assertInteger: nu,
  assertIs: F,
  assertIsOneOf: Tr,
  assertIsOneOfOrUndefined: $e,
  assertIsSubset: Au,
  assertMultiple: xc,
  assertOrUndefined: R,
  assertPositive: xa,
  assertRange: _n,
  assertRangeOrUndefined: et,
  backtick: af,
  beginMarkedContent: uc,
  beginText: Ps,
  breakTextIntoLines: Tu,
  byAscendingId: J0,
  bytesFor: Dr,
  canBeConvertedToUint8Array: Fu,
  charAtIndex: yu,
  charFromCode: xr,
  charFromHexCode: sf,
  charSplit: vu,
  cleanText: ba,
  clip: Rs,
  clipEvenOdd: of,
  closePath: dt,
  cmyk: ku,
  colorString: Eu,
  colorToComponents: Ro,
  componentsToColor: Ne,
  concatTransformationMatrix: ci,
  copyStringIntoBuffer: We,
  createPDFAcroField: Lc,
  createPDFAcroFields: Zs,
  createTypeErrorMsg: cf,
  createValueErrorMsg: lf,
  decodeFromBase64: uf,
  decodeFromBase64DataUri: df,
  decodePDFRawStream: Ic,
  defaultButtonAppearanceProvider: Th,
  defaultCheckBoxAppearanceProvider: Dh,
  defaultDropdownAppearanceProvider: Bh,
  defaultOptionListAppearanceProvider: Nh,
  defaultRadioGroupAppearanceProvider: Eh,
  defaultTextFieldAppearanceProvider: Rh,
  degrees: H,
  degreesToRadians: No,
  drawButton: rc,
  drawCheckBox: pn,
  drawCheckMark: bh,
  drawEllipse: gs,
  drawEllipsePath: hh,
  drawImage: $c,
  drawLine: dh,
  drawLinesOfText: lh,
  drawObject: Cs,
  drawOptionList: xh,
  drawPage: uh,
  drawRadioButton: mn,
  drawRectangle: oi,
  drawSvgPath: fh,
  drawText: Sm,
  drawTextField: Wc,
  drawTextLines: Vs,
  encodeToBase64: Du,
  endMarkedContent: dc,
  endPath: Bs,
  endText: Ts,
  error: hf,
  escapeRegExp: ff,
  escapedNewlineChars: bf,
  fill: Os,
  fillAndStroke: Fs,
  fillEvenOdd: wu,
  findLastMatch: _s,
  getType: xf,
  grayscale: _u,
  hasSurrogates: Nu,
  hasUtf16BOM: yc,
  highSurrogate: pc,
  isArrayEqual: Ln,
  isNewlineChar: gf,
  isStandardFont: Bo,
  isType: pf,
  isWithinBMP: Bu,
  last: jn,
  layoutCombedText: Ph,
  layoutMultilineText: qc,
  layoutSinglelineText: na,
  lineSplit: fc,
  lineTo: he,
  lowSurrogate: mc,
  mergeIntoTypedArray: iu,
  mergeLines: hc,
  mergeUint8Arrays: Q0,
  moveText: mf,
  moveTo: Qe,
  newlineChars: wf,
  nextLine: mu,
  normalizeAppearance: hi,
  numberToString: yf,
  padStart: ut,
  parseDate: oc,
  pdfDocEncodingDecode: vc,
  pluckIndices: Ou,
  popGraphicsState: ve,
  pushGraphicsState: ye,
  radians: vf,
  radiansToDegrees: _f,
  range: Cu,
  rectangle: kf,
  rectanglesAreEqual: dn,
  reduceRotation: Ar,
  restoreDashPattern: Sf,
  reverseArray: Pr,
  rgb: se,
  rotateAndSkewTextDegreesAndTranslate: Af,
  rotateAndSkewTextRadiansAndTranslate: Ds,
  rotateDegrees: un,
  rotateInPlace: Qt,
  rotateRadians: $i,
  rotateRectangle: Su,
  scale: ua,
  setCharacterSpacing: Cf,
  setCharacterSqueeze: Ff,
  setDashPattern: ha,
  setFillingCmykColor: Of,
  setFillingColor: Yt,
  setFillingGrayscaleColor: Pf,
  setFillingRgbColor: Df,
  setFontAndSize: fa,
  setGraphicsState: Xt,
  setLineCap: da,
  setLineHeight: pu,
  setLineJoin: Ef,
  setLineWidth: Hi,
  setStrokingCmykColor: Tf,
  setStrokingColor: Wi,
  setStrokingGrayscaleColor: Rf,
  setStrokingRgbColor: Bf,
  setTextMatrix: Nf,
  setTextRenderingMode: jf,
  setTextRise: If,
  setWordSpacing: zf,
  showText: Es,
  singleQuote: Lf,
  sizeInBytes: Ka,
  skewDegrees: Mf,
  skewRadians: As,
  sortedUniq: Y0,
  square: Uf,
  stringAsByteArray: kn,
  stroke: qi,
  sum: G0,
  toCharCode: Z,
  toCodePoint: X0,
  toDegrees: bc,
  toHexString: ca,
  toHexStringOfMinLength: la,
  toRadians: we,
  toUint8Array: yi,
  translate: Xe,
  typedArrayFor: Oo,
  utf16Decode: wc,
  utf16Encode: Ru,
  utf8Encode: Jf,
  values: $f,
  waitForTick: Hr
}, Symbol.toStringTag, { value: "Module" })), Fo = "pdfme (https://pdfme.com/)", hw = async (r) => {
  const { template: { schemas: e, basePdf: t }, pdfDoc: i } = r;
  let n = [], a = [];
  if (gc(t)) {
    const { width: s, height: o } = t, l = Jc(s), c = Jc(o);
    n = e.map(() => {
      const u = Fe.create(i);
      return u.setSize(l, c), u;
    }), a = e.map(() => ({
      mediaBox: { x: 0, y: 0, width: l, height: c },
      bleedBox: { x: 0, y: 0, width: l, height: c },
      trimBox: { x: 0, y: 0, width: l, height: c }
    }));
  } else {
    const s = await Kf(t), l = (await Se.load(s)).getPages();
    a = l.map((f) => ({
      mediaBox: f.getMediaBox(),
      bleedBox: f.getBleedBox(),
      trimBox: f.getTrimBox()
    }));
    const c = l.map((f) => {
      const { x: h, y: d, width: b, height: p } = f.getMediaBox();
      return { left: h, bottom: d, right: b, top: p + d };
    }), u = l.map(() => [1, 0, 0, 1, 0, 0]);
    n = await i.embedPages(l, c, u);
  }
  return { basePages: n, embedPdfBoxes: a };
}, fw = (r, e) => {
  r.schemas.forEach((t) => t.forEach((i) => {
    if (i.required && !i.readOnly && !e.some((n) => n[i.name]))
      throw new Error(`[@pdfme/generator] input for '${i.name}' is required to generate this PDF`);
  }));
}, bw = async (r) => {
  const { template: e, userPlugins: t } = r, { schemas: i, basePdf: n } = e, a = gc(n) ? n.staticSchema ?? [] : [], s = await Se.create();
  s.registerFontkit(Wf);
  const o = Xf(Object.values(t).length > 0 ? t : Hf), c = Array.from(new Set(i.flatMap((u) => u.map((f) => f.type)).concat(a.map((u) => u.type)))).reduce((u, f) => {
    const h = o.findByType(f);
    if (!h || !h.pdf)
      throw new Error(`[@pdfme/generator] Plugin or renderer for type ${f} not found.
Check this document: https://pdfme.com/docs/custom-schemas`);
    return {
      ...u,
      [f]: h.pdf
    };
  }, {});
  return { pdfDoc: s, renderObj: c };
}, xw = (r) => {
  const { pdfDoc: e, options: t } = r, { author: i = Fo, creationDate: n = /* @__PURE__ */ new Date(), creator: a = Fo, keywords: s = [], lang: o = "en", modificationDate: l = /* @__PURE__ */ new Date(), producer: c = Fo, subject: u = "", title: f = "" } = t;
  e.setAuthor(i), e.setCreationDate(n), e.setCreator(a), e.setKeywords(s), e.setLanguage(o), e.setModificationDate(l), e.setProducer(c), e.setSubject(u), e.setTitle(f);
}, gw = (r) => {
  const { basePage: e, embedPdfBox: t, pdfDoc: i } = r, n = e instanceof Pt ? e.size() : e.getSize(), a = e instanceof Pt ? i.addPage([n.width, n.height]) : i.addPage(e);
  if (e instanceof Pt) {
    a.drawPage(e);
    const { mediaBox: s, bleedBox: o, trimBox: l } = t;
    a.setMediaBox(s.x, s.y, s.width, s.height), a.setBleedBox(o.x, o.y, o.width, o.height), a.setTrimBox(l.x, l.y, l.width, l.height);
  }
  return a;
}, vw = async (r) => {
  Vf(r);
  const { inputs: e, template: t, options: i = {}, plugins: n = {} } = r, a = Gf(t), s = a.basePdf;
  if (e.length === 0)
    throw new Error("[@pdfme/generator] inputs should not be empty, pass at least an empty object in the array");
  fw(a, e);
  const { pdfDoc: o, renderObj: l } = await bw({ template: a, userPlugins: n }), c = /* @__PURE__ */ new Map();
  for (let u = 0; u < e.length; u += 1) {
    const f = e[u], h = await Yf({
      template: a,
      input: f,
      options: i,
      _cache: c,
      getDynamicHeights: (S, y) => {
        switch (y.schema.type) {
          case "table":
            return qf(S, y);
          default:
            return Promise.resolve([y.schema.height]);
        }
      }
    }), { basePages: d, embedPdfBoxes: b } = await hw({
      template: h,
      pdfDoc: o
    }), p = h.schemas, m = /* @__PURE__ */ new Set();
    p.forEach((S) => {
      S.forEach((y) => {
        y.name && m.add(y.name);
      });
    });
    const g = Array.from(m);
    for (let S = 0; S < d.length; S += 1) {
      const y = d[S], v = b[S], A = y instanceof Pt ? Qc(v.mediaBox.x) : 0, k = y instanceof Pt ? Qc(v.mediaBox.y) : 0, _ = gw({ basePage: y, embedPdfBox: v, pdfDoc: o });
      if (gc(s) && s.staticSchema)
        for (let C = 0; C < s.staticSchema.length; C += 1) {
          const P = s.staticSchema[C], D = l[P.type];
          if (!D)
            continue;
          const O = P.readOnly ? el({
            content: P.content || "",
            variables: { ...f, totalPages: d.length, currentPage: S + 1 },
            schemas: p
            // Use the properly typed schemas variable
          }) : P.content || "";
          P.position = {
            x: P.position.x + A,
            y: P.position.y - k
          }, await D({
            value: O,
            schema: P,
            basePdf: s,
            pdfLib: K0,
            pdfDoc: o,
            page: _,
            options: i,
            _cache: c
          });
        }
      for (let C = 0; C < g.length; C += 1) {
        const P = g[C], O = (p[S] || []).find((I) => I.name == P);
        if (!O)
          continue;
        const j = l[O.type];
        if (!j)
          continue;
        const B = O.readOnly ? el({
          content: O.content || "",
          variables: { ...f, totalPages: d.length, currentPage: S + 1 },
          schemas: p
          // Use the properly typed schemas variable
        }) : f[P] || "";
        O.position = {
          x: O.position.x + A,
          y: O.position.y - k
        }, await j({
          value: B,
          schema: O,
          basePdf: s,
          pdfLib: K0,
          pdfDoc: o,
          page: _,
          options: i,
          _cache: c
        });
      }
    }
  }
  return xw({ pdfDoc: o, options: i }), o.save();
};
export {
  vw as generate
};
