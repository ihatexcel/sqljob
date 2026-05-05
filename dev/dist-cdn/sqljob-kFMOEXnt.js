import { g as Ca } from "./sqljob-Bp2WgaXr.js";
function xa(e, r) {
  for (var t = 0; t < r.length; t++) {
    const n = r[t];
    if (typeof n != "string" && !Array.isArray(n)) {
      for (const u in n)
        if (u !== "default" && !(u in e)) {
          const a = Object.getOwnPropertyDescriptor(n, u);
          a && Object.defineProperty(e, u, a.get ? a : {
            enumerable: !0,
            get: () => n[u]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }));
}
var Au = { exports: {} }, me = {}, Oe = {};
function Sa(e, r, t) {
  if (t === void 0 && (t = Array.prototype), e && typeof t.find == "function")
    return t.find.call(e, r);
  for (var n = 0; n < e.length; n++)
    if (gr(e, n)) {
      var u = e[n];
      if (r.call(void 0, u, n, e))
        return u;
    }
}
function Rr(e, r) {
  return r === void 0 && (r = Object), r && typeof r.getOwnPropertyDescriptors == "function" && (e = r.create(null, r.getOwnPropertyDescriptors(e))), r && typeof r.freeze == "function" ? r.freeze(e) : e;
}
function gr(e, r) {
  return Object.prototype.hasOwnProperty.call(e, r);
}
function Na(e, r) {
  if (e === null || typeof e != "object")
    throw new TypeError("target is not an object");
  for (var t in r)
    gr(r, t) && (e[t] = r[t]);
  return e;
}
var wu = Rr({
  allowfullscreen: !0,
  async: !0,
  autofocus: !0,
  autoplay: !0,
  checked: !0,
  controls: !0,
  default: !0,
  defer: !0,
  disabled: !0,
  formnovalidate: !0,
  hidden: !0,
  ismap: !0,
  itemscope: !0,
  loop: !0,
  multiple: !0,
  muted: !0,
  nomodule: !0,
  novalidate: !0,
  open: !0,
  playsinline: !0,
  readonly: !0,
  required: !0,
  reversed: !0,
  selected: !0
});
function Oa(e) {
  return gr(wu, e.toLowerCase());
}
var Cu = Rr({
  area: !0,
  base: !0,
  br: !0,
  col: !0,
  embed: !0,
  hr: !0,
  img: !0,
  input: !0,
  link: !0,
  meta: !0,
  param: !0,
  source: !0,
  track: !0,
  wbr: !0
});
function Pa(e) {
  return gr(Cu, e.toLowerCase());
}
var zr = Rr({
  script: !1,
  style: !1,
  textarea: !0,
  title: !0
});
function Ia(e) {
  var r = e.toLowerCase();
  return gr(zr, r) && !zr[r];
}
function Ma(e) {
  var r = e.toLowerCase();
  return gr(zr, r) && zr[r];
}
function xu(e) {
  return e === Yr.HTML;
}
function Ra(e) {
  return xu(e) || e === Yr.XML_XHTML_APPLICATION;
}
var Yr = Rr({
  /**
   * `text/html`, the only mime type that triggers treating an XML document as HTML.
   *
   * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
   * @see https://en.wikipedia.org/wiki/HTML Wikipedia
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
   * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring
   *      WHATWG HTML Spec
   */
  HTML: "text/html",
  /**
   * `application/xml`, the standard mime type for XML documents.
   *
   * @see https://www.iana.org/assignments/media-types/application/xml IANA MimeType
   *      registration
   * @see https://tools.ietf.org/html/rfc7303#section-9.1 RFC 7303
   * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
   */
  XML_APPLICATION: "application/xml",
  /**
   * `text/xml`, an alias for `application/xml`.
   *
   * @see https://tools.ietf.org/html/rfc7303#section-9.2 RFC 7303
   * @see https://www.iana.org/assignments/media-types/text/xml IANA MimeType registration
   * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
   */
  XML_TEXT: "text/xml",
  /**
   * `application/xhtml+xml`, indicates an XML document that has the default HTML namespace,
   * but is parsed as an XML document.
   *
   * @see https://www.iana.org/assignments/media-types/application/xhtml+xml IANA MimeType
   *      registration
   * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument WHATWG DOM Spec
   * @see https://en.wikipedia.org/wiki/XHTML Wikipedia
   */
  XML_XHTML_APPLICATION: "application/xhtml+xml",
  /**
   * `image/svg+xml`,
   *
   * @see https://www.iana.org/assignments/media-types/image/svg+xml IANA MimeType registration
   * @see https://www.w3.org/TR/SVG11/ W3C SVG 1.1
   * @see https://en.wikipedia.org/wiki/Scalable_Vector_Graphics Wikipedia
   */
  XML_SVG_IMAGE: "image/svg+xml"
}), La = Object.keys(Yr).map(function(e) {
  return Yr[e];
});
function _a(e) {
  return La.indexOf(e) > -1;
}
var Ba = Rr({
  /**
   * The XHTML namespace.
   *
   * @see http://www.w3.org/1999/xhtml
   */
  HTML: "http://www.w3.org/1999/xhtml",
  /**
   * The SVG namespace.
   *
   * @see http://www.w3.org/2000/svg
   */
  SVG: "http://www.w3.org/2000/svg",
  /**
   * The `xml:` namespace.
   *
   * @see http://www.w3.org/XML/1998/namespace
   */
  XML: "http://www.w3.org/XML/1998/namespace",
  /**
   * The `xmlns:` namespace.
   *
   * @see https://www.w3.org/2000/xmlns/
   */
  XMLNS: "http://www.w3.org/2000/xmlns/"
});
Oe.assign = Na;
Oe.find = Sa;
Oe.freeze = Rr;
Oe.HTML_BOOLEAN_ATTRIBUTES = wu;
Oe.HTML_RAW_TEXT_ELEMENTS = zr;
Oe.HTML_VOID_ELEMENTS = Cu;
Oe.hasDefaultHTMLNamespace = Ra;
Oe.hasOwn = gr;
Oe.isHTMLBooleanAttribute = Oa;
Oe.isHTMLRawTextElement = Ia;
Oe.isHTMLEscapableRawTextElement = Ma;
Oe.isHTMLMimeType = xu;
Oe.isHTMLVoidElement = Pa;
Oe.isValidMimeType = _a;
Oe.MIME_TYPE = Yr;
Oe.NAMESPACE = Ba;
var sr = {}, Fa = Oe;
function Su(e, r) {
  e.prototype = Object.create(Error.prototype, {
    constructor: { value: e },
    name: { value: e.name, enumerable: !0, writable: r }
  });
}
var Wr = Fa.freeze({
  /**
   * the default value as defined by the spec
   */
  Error: "Error",
  /**
   * @deprecated
   * Use RangeError instead.
   */
  IndexSizeError: "IndexSizeError",
  /**
   * @deprecated
   * Just to match the related static code, not part of the spec.
   */
  DomstringSizeError: "DomstringSizeError",
  HierarchyRequestError: "HierarchyRequestError",
  WrongDocumentError: "WrongDocumentError",
  InvalidCharacterError: "InvalidCharacterError",
  /**
   * @deprecated
   * Just to match the related static code, not part of the spec.
   */
  NoDataAllowedError: "NoDataAllowedError",
  NoModificationAllowedError: "NoModificationAllowedError",
  NotFoundError: "NotFoundError",
  NotSupportedError: "NotSupportedError",
  InUseAttributeError: "InUseAttributeError",
  InvalidStateError: "InvalidStateError",
  SyntaxError: "SyntaxError",
  InvalidModificationError: "InvalidModificationError",
  NamespaceError: "NamespaceError",
  /**
   * @deprecated
   * Use TypeError for invalid arguments,
   * "NotSupportedError" DOMException for unsupported operations,
   * and "NotAllowedError" DOMException for denied requests instead.
   */
  InvalidAccessError: "InvalidAccessError",
  /**
   * @deprecated
   * Just to match the related static code, not part of the spec.
   */
  ValidationError: "ValidationError",
  /**
   * @deprecated
   * Use TypeError instead.
   */
  TypeMismatchError: "TypeMismatchError",
  SecurityError: "SecurityError",
  NetworkError: "NetworkError",
  AbortError: "AbortError",
  /**
   * @deprecated
   * Just to match the related static code, not part of the spec.
   */
  URLMismatchError: "URLMismatchError",
  QuotaExceededError: "QuotaExceededError",
  TimeoutError: "TimeoutError",
  InvalidNodeTypeError: "InvalidNodeTypeError",
  DataCloneError: "DataCloneError",
  EncodingError: "EncodingError",
  NotReadableError: "NotReadableError",
  UnknownError: "UnknownError",
  ConstraintError: "ConstraintError",
  DataError: "DataError",
  TransactionInactiveError: "TransactionInactiveError",
  ReadOnlyError: "ReadOnlyError",
  VersionError: "VersionError",
  OperationError: "OperationError",
  NotAllowedError: "NotAllowedError",
  OptOutError: "OptOutError"
}), Nu = Object.keys(Wr);
function Ou(e) {
  return typeof e == "number" && e >= 1 && e <= 25;
}
function ka(e) {
  return typeof e == "string" && e.substring(e.length - Wr.Error.length) === Wr.Error;
}
function ut(e, r) {
  Ou(e) ? (this.name = Nu[e], this.message = r || "") : (this.message = e, this.name = ka(r) ? r : Wr.Error), Error.captureStackTrace && Error.captureStackTrace(this, ut);
}
Su(ut, !0);
Object.defineProperties(ut.prototype, {
  code: {
    enumerable: !0,
    get: function() {
      var e = Nu.indexOf(this.name);
      return Ou(e) ? e : 0;
    }
  }
});
var Pu = {
  INDEX_SIZE_ERR: 1,
  DOMSTRING_SIZE_ERR: 2,
  HIERARCHY_REQUEST_ERR: 3,
  WRONG_DOCUMENT_ERR: 4,
  INVALID_CHARACTER_ERR: 5,
  NO_DATA_ALLOWED_ERR: 6,
  NO_MODIFICATION_ALLOWED_ERR: 7,
  NOT_FOUND_ERR: 8,
  NOT_SUPPORTED_ERR: 9,
  INUSE_ATTRIBUTE_ERR: 10,
  INVALID_STATE_ERR: 11,
  SYNTAX_ERR: 12,
  INVALID_MODIFICATION_ERR: 13,
  NAMESPACE_ERR: 14,
  INVALID_ACCESS_ERR: 15,
  VALIDATION_ERR: 16,
  TYPE_MISMATCH_ERR: 17,
  SECURITY_ERR: 18,
  NETWORK_ERR: 19,
  ABORT_ERR: 20,
  URL_MISMATCH_ERR: 21,
  QUOTA_EXCEEDED_ERR: 22,
  TIMEOUT_ERR: 23,
  INVALID_NODE_TYPE_ERR: 24,
  DATA_CLONE_ERR: 25
}, It = Object.entries(Pu);
for (var ft = 0; ft < It.length; ft++) {
  var qa = It[ft][0];
  ut[qa] = It[ft][1];
}
function hn(e, r) {
  this.message = e, this.locator = r, Error.captureStackTrace && Error.captureStackTrace(this, hn);
}
Su(hn);
sr.DOMException = ut;
sr.DOMExceptionName = Wr;
sr.ExceptionCode = Pu;
sr.ParseError = hn;
var Pe = {}, fe = {};
function Iu(e) {
  try {
    typeof e != "function" && (e = RegExp);
    var r = new e("𝌆", "u").exec("𝌆");
    return !!r && r[0].length === 2;
  } catch {
  }
  return !1;
}
var at = Iu();
function hr(e) {
  if (e.source[0] !== "[")
    throw new Error(e + " can not be used with chars");
  return e.source.slice(1, e.source.lastIndexOf("]"));
}
function Or(e, r) {
  if (e.source[0] !== "[")
    throw new Error("/" + e.source + "/ can not be used with chars_without");
  if (!r || typeof r != "string")
    throw new Error(JSON.stringify(r) + " is not a valid search");
  if (e.source.indexOf(r) === -1)
    throw new Error('"' + r + '" is not is /' + e.source + "/");
  if (r === "-" && e.source.indexOf(r) !== 1)
    throw new Error('"' + r + '" is not at the first postion of /' + e.source + "/");
  return new RegExp(e.source.replace(r, ""), at ? "u" : "");
}
function he(e) {
  var r = this;
  return new RegExp(
    Array.prototype.slice.call(arguments).map(function(t) {
      var n = typeof t == "string";
      if (n && r === void 0 && t === "|")
        throw new Error("use regg instead of reg to wrap expressions with `|`!");
      return n ? t : t.source;
    }).join(""),
    at ? "mu" : "m"
  );
}
function ne(e) {
  if (arguments.length === 0)
    throw new Error("no parameters provided");
  return he.apply(ne, ["(?:"].concat(Array.prototype.slice.call(arguments), [")"]));
}
var Ua = "�", dr = /[-\x09\x0A\x0D\x20-\x2C\x2E-\uD7FF\uE000-\uFFFD]/;
at && (dr = he("[", hr(dr), "\\u{10000}-\\u{10FFFF}", "]"));
var dn = /[\x20\x09\x0D\x0A]/, ja = hr(dn), De = he(dn, "+"), Ce = he(dn, "*"), $r = /[:_a-zA-Z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
at && ($r = he("[", hr($r), "\\u{10000}-\\u{10FFFF}", "]"));
var Va = hr($r), vn = he("[", Va, hr(/[-.0-9\xB7]/), hr(/[\u0300-\u036F\u203F-\u2040]/), "]"), He = he($r, vn, "*"), Nn = he(vn, "+"), Xa = he("&", He, ";"), Ga = ne(/&#[0-9]+;|&#x[0-9a-fA-F]+;/), Qr = ne(Xa, "|", Ga), Kr = he("%", He, ";"), gn = ne(
  he('"', ne(/[^%&"]/, "|", Kr, "|", Qr), "*", '"'),
  "|",
  he("'", ne(/[^%&']/, "|", Kr, "|", Qr), "*", "'")
), Ha = ne('"', ne(/[^<&"]/, "|", Qr), "*", '"', "|", "'", ne(/[^<&']/, "|", Qr), "*", "'"), za = Or($r, ":"), Ya = Or(vn, ":"), On = he(za, Ya, "*"), ot = he(On, ne(":", On), "?"), Wa = he("^", ot, "$"), $a = he("(", ot, ")"), Zr = ne(/"[^"]*"|'[^']*'/), Qa = he(/^<\?/, "(", He, ")", ne(De, "(", dr, "*?)"), "?", /\?>/), Pn = /[\x20\x0D\x0Aa-zA-Z0-9-'()+,./:=?;!*#@$_%]/, mt = ne('"', Pn, '*"', "|", "'", Or(Pn, "'"), "*'"), Mu = "<!--", Ru = "-->", Ka = he(Mu, ne(Or(dr, "-"), "|", he("-", Or(dr, "-"))), "*", Ru), In = "#PCDATA", Za = ne(
  he(/\(/, Ce, In, ne(Ce, /\|/, Ce, ot), "*", Ce, /\)\*/),
  "|",
  he(/\(/, Ce, In, Ce, /\)/)
), Ja = /[?*+]?/, eo = he(
  /\([^>]+\)/,
  Ja
  /*regg(choice, '|', seq), _children_quantity*/
), ro = ne("EMPTY", "|", "ANY", "|", Za, "|", eo), to = "<!ELEMENT", no = he(to, De, ne(ot, "|", Kr), De, ne(ro, "|", Kr), Ce, ">"), uo = he("NOTATION", De, /\(/, Ce, He, ne(Ce, /\|/, Ce, He), "*", Ce, /\)/), ao = he(/\(/, Ce, Nn, ne(Ce, /\|/, Ce, Nn), "*", Ce, /\)/), oo = ne(uo, "|", ao), io = ne(/CDATA|ID|IDREF|IDREFS|ENTITY|ENTITIES|NMTOKEN|NMTOKENS/, "|", oo), so = ne(/#REQUIRED|#IMPLIED/, "|", ne(ne("#FIXED", De), "?", Ha)), lo = ne(De, He, De, io, De, so), co = "<!ATTLIST", fo = he(co, De, He, lo, "*", Ce, ">"), ln = "about:legacy-compat", po = ne('"' + ln + '"', "|", "'" + ln + "'"), mn = "SYSTEM", yt = "PUBLIC", Et = ne(ne(mn, De, Zr), "|", ne(yt, De, mt, De, Zr)), ho = he(
  "^",
  ne(
    ne(mn, De, "(?<SystemLiteralOnly>", Zr, ")"),
    "|",
    ne(yt, De, "(?<PubidLiteral>", mt, ")", De, "(?<SystemLiteral>", Zr, ")")
  )
), vo = ne(De, "NDATA", De, He), go = ne(gn, "|", ne(Et, vo, "?")), Lu = "<!ENTITY", mo = he(Lu, De, He, De, go, Ce, ">"), yo = ne(gn, "|", Et), Eo = he(Lu, De, "%", De, He, De, yo, Ce, ">"), To = ne(mo, "|", Eo), Do = he(yt, De, mt), bo = he("<!NOTATION", De, He, De, ne(Et, "|", Do), Ce, ">"), yn = he(Ce, "=", Ce), Mn = /1[.]\d+/, Ao = he(De, "version", yn, ne("'", Mn, "'", "|", '"', Mn, '"')), Rn = /[A-Za-z][-A-Za-z0-9._]*/, wo = ne(De, "encoding", yn, ne('"', Rn, '"', "|", "'", Rn, "'")), Co = ne(De, "standalone", yn, ne("'", ne("yes", "|", "no"), "'", "|", '"', ne("yes", "|", "no"), '"')), xo = he(/^<\?xml/, Ao, wo, "?", Co, "?", Ce, /\?>/), So = "<!DOCTYPE", No = "<![CDATA[", Oo = "]]>", Po = /<!\[CDATA\[/, Io = /\]\]>/, Mo = he(dr, "*?", Io), Ro = he(Po, Mo);
fe.chars = hr;
fe.chars_without = Or;
fe.detectUnicodeSupport = Iu;
fe.reg = he;
fe.regg = ne;
fe.ABOUT_LEGACY_COMPAT = ln;
fe.ABOUT_LEGACY_COMPAT_SystemLiteral = po;
fe.AttlistDecl = fo;
fe.CDATA_START = No;
fe.CDATA_END = Oo;
fe.CDSect = Ro;
fe.Char = dr;
fe.Comment = Ka;
fe.COMMENT_START = Mu;
fe.COMMENT_END = Ru;
fe.DOCTYPE_DECL_START = So;
fe.elementdecl = no;
fe.EntityDecl = To;
fe.EntityValue = gn;
fe.ExternalID = Et;
fe.ExternalID_match = ho;
fe.Name = He;
fe.NotationDecl = bo;
fe.Reference = Qr;
fe.PEReference = Kr;
fe.PI = Qa;
fe.PUBLIC = yt;
fe.PubidLiteral = mt;
fe.QName = ot;
fe.QName_exact = Wa;
fe.QName_group = $a;
fe.S = De;
fe.SChar_s = ja;
fe.S_OPT = Ce;
fe.SYSTEM = mn;
fe.SystemLiteral = Zr;
fe.UNICODE_REPLACEMENT_CHARACTER = Ua;
fe.UNICODE_SUPPORT = at;
fe.XMLDecl = xo;
var Ge = Oe, Je = Ge.find, Lo = Ge.hasDefaultHTMLNamespace, Pr = Ge.hasOwn, _o = Ge.isHTMLMimeType, Bo = Ge.isHTMLRawTextElement, Fo = Ge.isHTMLVoidElement, Gr = Ge.MIME_TYPE, er = Ge.NAMESPACE, qe = Symbol(), _u = sr, re = _u.DOMException, ko = _u.DOMExceptionName, Ze = fe;
function je(e) {
  if (e !== qe)
    throw new TypeError("Illegal constructor");
}
function qo(e) {
  return e !== "";
}
function Uo(e) {
  return e ? e.split(/[\t\n\f\r ]+/).filter(qo) : [];
}
function jo(e, r) {
  return Pr(e, r) || (e[r] = !0), e;
}
function Ln(e) {
  if (!e) return [];
  var r = Uo(e);
  return Object.keys(r.reduce(jo, {}));
}
function Vo(e) {
  return function(r) {
    return e && e.indexOf(r) !== -1;
  };
}
function Bu(e) {
  if (!Ze.QName_exact.test(e))
    throw new re(re.INVALID_CHARACTER_ERR, 'invalid character in qualified name "' + e + '"');
}
function cn(e, r) {
  Bu(r), e = e || null;
  var t = null, n = r;
  if (r.indexOf(":") >= 0) {
    var u = r.split(":");
    t = u[0], n = u[1];
  }
  if (t !== null && e === null)
    throw new re(re.NAMESPACE_ERR, "prefix is non-null and namespace is null");
  if (t === "xml" && e !== Ge.NAMESPACE.XML)
    throw new re(re.NAMESPACE_ERR, 'prefix is "xml" and namespace is not the XML namespace');
  if ((t === "xmlns" || r === "xmlns") && e !== Ge.NAMESPACE.XMLNS)
    throw new re(
      re.NAMESPACE_ERR,
      'either qualifiedName or prefix is "xmlns" and namespace is not the XMLNS namespace'
    );
  if (e === Ge.NAMESPACE.XMLNS && t !== "xmlns" && r !== "xmlns")
    throw new re(
      re.NAMESPACE_ERR,
      'namespace is the XMLNS namespace and neither qualifiedName nor prefix is "xmlns"'
    );
  return [e, t, n];
}
function Lr(e, r) {
  for (var t in e)
    Pr(e, t) && (r[t] = e[t]);
}
function Ve(e, r) {
  var t = e.prototype;
  if (!(t instanceof r)) {
    let n = function() {
    };
    n.prototype = r.prototype, n = new n(), Lr(t, n), e.prototype = t = n;
  }
  t.constructor != e && (typeof e != "function" && console.error("unknown Class:" + e), t.constructor = e);
}
var Xe = {}, Ye = Xe.ELEMENT_NODE = 1, Ir = Xe.ATTRIBUTE_NODE = 2, vt = Xe.TEXT_NODE = 3, Fu = Xe.CDATA_SECTION_NODE = 4, ku = Xe.ENTITY_REFERENCE_NODE = 5, Xo = Xe.ENTITY_NODE = 6, qu = Xe.PROCESSING_INSTRUCTION_NODE = 7, Uu = Xe.COMMENT_NODE = 8, Jr = Xe.DOCUMENT_NODE = 9, ju = Xe.DOCUMENT_TYPE_NODE = 10, ur = Xe.DOCUMENT_FRAGMENT_NODE = 11, Go = Xe.NOTATION_NODE = 12, Ne = Ge.freeze({
  DOCUMENT_POSITION_DISCONNECTED: 1,
  DOCUMENT_POSITION_PRECEDING: 2,
  DOCUMENT_POSITION_FOLLOWING: 4,
  DOCUMENT_POSITION_CONTAINS: 8,
  DOCUMENT_POSITION_CONTAINED_BY: 16,
  DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: 32
});
function Vu(e, r) {
  if (r.length < e.length) return Vu(r, e);
  var t = null;
  for (var n in e) {
    if (e[n] !== r[n]) return t;
    t = e[n];
  }
  return t;
}
function _n(e) {
  return e.guid || (e.guid = Math.random()), e.guid;
}
function Ie() {
}
Ie.prototype = {
  /**
   * The number of nodes in the list. The range of valid child node indices is 0 to length-1
   * inclusive.
   *
   * @type {number}
   */
  length: 0,
  /**
   * Returns the item at `index`. If index is greater than or equal to the number of nodes in
   * the list, this returns null.
   *
   * @param index
   * Unsigned long Index into the collection.
   * @returns {Node | null}
   * The node at position `index` in the NodeList,
   * or null if that is not a valid index.
   */
  item: function(e) {
    return e >= 0 && e < this.length ? this[e] : null;
  },
  /**
   * Returns a string representation of the NodeList.
   *
   * @param {unknown} nodeFilter
   * __A filter function? Not implemented according to the spec?__.
   * @returns {string}
   * A string representation of the NodeList.
   */
  toString: function(e) {
    for (var r = [], t = 0; t < this.length; t++)
      Nr(this[t], r, e);
    return r.join("");
  },
  /**
   * Filters the NodeList based on a predicate.
   *
   * @param {function(Node): boolean} predicate
   * - A predicate function to filter the NodeList.
   * @returns {Node[]}
   * An array of nodes that satisfy the predicate.
   * @private
   */
  filter: function(e) {
    return Array.prototype.filter.call(this, e);
  },
  /**
   * Returns the first index at which a given node can be found in the NodeList, or -1 if it is
   * not present.
   *
   * @param {Node} item
   * - The Node item to locate in the NodeList.
   * @returns {number}
   * The first index of the node in the NodeList; -1 if not found.
   * @private
   */
  indexOf: function(e) {
    return Array.prototype.indexOf.call(this, e);
  }
};
Ie.prototype[Symbol.iterator] = function() {
  var e = this, r = 0;
  return {
    next: function() {
      return r < e.length ? {
        value: e[r++],
        done: !1
      } : {
        done: !0
      };
    },
    return: function() {
      return {
        done: !0
      };
    }
  };
};
function pr(e, r) {
  this._node = e, this._refresh = r, Tt(this);
}
function Tt(e) {
  var r = e._node._inc || e._node.ownerDocument._inc;
  if (e._inc !== r) {
    var t = e._refresh(e._node);
    if (ea(e, "length", t.length), !e.$$length || t.length < e.$$length)
      for (var n = t.length; n in e; n++)
        Pr(e, n) && delete e[n];
    Lr(t, e), e._inc = r;
  }
}
pr.prototype.item = function(e) {
  return Tt(this), this[e] || null;
};
Ve(pr, Ie);
function Mr() {
}
function Xu(e, r) {
  for (var t = 0; t < e.length; ) {
    if (e[t] === r)
      return t;
    t++;
  }
}
function Ho(e, r, t, n) {
  if (n ? r[Xu(r, n)] = t : (r[r.length] = t, r.length++), e) {
    t.ownerElement = e;
    var u = e.ownerDocument;
    u && (n && zu(u, e, n), zo(u, e, t));
  }
}
function Bn(e, r, t) {
  var n = Xu(r, t);
  if (n >= 0) {
    for (var u = r.length - 1; n <= u; )
      r[n] = r[++n];
    if (r.length = u, e) {
      var a = e.ownerDocument;
      a && zu(a, e, t), t.ownerElement = null;
    }
  }
}
Mr.prototype = {
  length: 0,
  item: Ie.prototype.item,
  /**
   * Get an attribute by name. Note: Name is in lower case in case of HTML namespace and
   * document.
   *
   * @param {string} localName
   * The local name of the attribute.
   * @returns {Attr | null}
   * The attribute with the given local name, or null if no such attribute exists.
   * @see https://dom.spec.whatwg.org/#concept-element-attributes-get-by-name
   */
  getNamedItem: function(e) {
    this._ownerElement && this._ownerElement._isInHTMLDocumentAndNamespace() && (e = e.toLowerCase());
    for (var r = 0; r < this.length; ) {
      var t = this[r];
      if (t.nodeName === e)
        return t;
      r++;
    }
    return null;
  },
  /**
   * Set an attribute.
   *
   * @param {Attr} attr
   * The attribute to set.
   * @returns {Attr | null}
   * The old attribute with the same local name and namespace URI as the new one, or null if no
   * such attribute exists.
   * @throws {DOMException}
   * With code:
   * - {@link INUSE_ATTRIBUTE_ERR} - If the attribute is already an attribute of another
   * element.
   * @see https://dom.spec.whatwg.org/#concept-element-attributes-set
   */
  setNamedItem: function(e) {
    var r = e.ownerElement;
    if (r && r !== this._ownerElement)
      throw new re(re.INUSE_ATTRIBUTE_ERR);
    var t = this.getNamedItemNS(e.namespaceURI, e.localName);
    return t === e ? e : (Ho(this._ownerElement, this, e, t), t);
  },
  /**
   * Set an attribute, replacing an existing attribute with the same local name and namespace
   * URI if one exists.
   *
   * @param {Attr} attr
   * The attribute to set.
   * @returns {Attr | null}
   * The old attribute with the same local name and namespace URI as the new one, or null if no
   * such attribute exists.
   * @throws {DOMException}
   * Throws a DOMException with the name "InUseAttributeError" if the attribute is already an
   * attribute of another element.
   * @see https://dom.spec.whatwg.org/#concept-element-attributes-set
   */
  setNamedItemNS: function(e) {
    return this.setNamedItem(e);
  },
  /**
   * Removes an attribute specified by the local name.
   *
   * @param {string} localName
   * The local name of the attribute to be removed.
   * @returns {Attr}
   * The attribute node that was removed.
   * @throws {DOMException}
   * With code:
   * - {@link DOMException.NOT_FOUND_ERR} if no attribute with the given name is found.
   * @see https://dom.spec.whatwg.org/#dom-namednodemap-removenameditem
   * @see https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-name
   */
  removeNamedItem: function(e) {
    var r = this.getNamedItem(e);
    if (!r)
      throw new re(re.NOT_FOUND_ERR, e);
    return Bn(this._ownerElement, this, r), r;
  },
  /**
   * Removes an attribute specified by the namespace and local name.
   *
   * @param {string | null} namespaceURI
   * The namespace URI of the attribute to be removed.
   * @param {string} localName
   * The local name of the attribute to be removed.
   * @returns {Attr}
   * The attribute node that was removed.
   * @throws {DOMException}
   * With code:
   * - {@link DOMException.NOT_FOUND_ERR} if no attribute with the given namespace URI and local
   * name is found.
   * @see https://dom.spec.whatwg.org/#dom-namednodemap-removenameditemns
   * @see https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-namespace
   */
  removeNamedItemNS: function(e, r) {
    var t = this.getNamedItemNS(e, r);
    if (!t)
      throw new re(re.NOT_FOUND_ERR, e ? e + " : " + r : r);
    return Bn(this._ownerElement, this, t), t;
  },
  /**
   * Get an attribute by namespace and local name.
   *
   * @param {string | null} namespaceURI
   * The namespace URI of the attribute.
   * @param {string} localName
   * The local name of the attribute.
   * @returns {Attr | null}
   * The attribute with the given namespace URI and local name, or null if no such attribute
   * exists.
   * @see https://dom.spec.whatwg.org/#concept-element-attributes-get-by-namespace
   */
  getNamedItemNS: function(e, r) {
    e || (e = null);
    for (var t = 0; t < this.length; ) {
      var n = this[t];
      if (n.localName === r && n.namespaceURI === e)
        return n;
      t++;
    }
    return null;
  }
};
Mr.prototype[Symbol.iterator] = function() {
  var e = this, r = 0;
  return {
    next: function() {
      return r < e.length ? {
        value: e[r++],
        done: !1
      } : {
        done: !0
      };
    },
    return: function() {
      return {
        done: !0
      };
    }
  };
};
function Gu() {
}
Gu.prototype = {
  /**
   * Test if the DOM implementation implements a specific feature and version, as specified in
   * {@link https://www.w3.org/TR/DOM-Level-3-Core/core.html#DOMFeatures DOM Features}.
   *
   * The DOMImplementation.hasFeature() method returns a Boolean flag indicating if a given
   * feature is supported. The different implementations fairly diverged in what kind of
   * features were reported. The latest version of the spec settled to force this method to
   * always return true, where the functionality was accurate and in use.
   *
   * @deprecated
   * It is deprecated and modern browsers return true in all cases.
   * @function DOMImplementation#hasFeature
   * @param {string} feature
   * The name of the feature to test.
   * @param {string} [version]
   * This is the version number of the feature to test.
   * @returns {boolean}
   * Always returns true.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/hasFeature MDN
   * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-5CED94D7 DOM Level 1 Core
   * @see https://dom.spec.whatwg.org/#dom-domimplementation-hasfeature DOM Living Standard
   * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-5CED94D7 DOM Level 3 Core
   */
  hasFeature: function(e, r) {
    return !0;
  },
  /**
   * Creates a DOM Document object of the specified type with its document element. Note that
   * based on the {@link DocumentType}
   * given to create the document, the implementation may instantiate specialized
   * {@link Document} objects that support additional features than the "Core", such as "HTML"
   * {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#DOM2HTML DOM Level 2 HTML}.
   * On the other hand, setting the {@link DocumentType} after the document was created makes
   * this very unlikely to happen. Alternatively, specialized {@link Document} creation methods,
   * such as createHTMLDocument
   * {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#DOM2HTML DOM Level 2 HTML},
   * can be used to obtain specific types of {@link Document} objects.
   *
   * __It behaves slightly different from the description in the living standard__:
   * - There is no interface/class `XMLDocument`, it returns a `Document`
   * instance (with it's `type` set to `'xml'`).
   * - `encoding`, `mode`, `origin`, `url` fields are currently not declared.
   *
   * @function DOMImplementation.createDocument
   * @param {string | null} namespaceURI
   * The
   * {@link https://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-namespaceURI namespace URI}
   * of the document element to create or null.
   * @param {string | null} qualifiedName
   * The
   * {@link https://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-qualifiedname qualified name}
   * of the document element to be created or null.
   * @param {DocumentType | null} [doctype=null]
   * The type of document to be created or null. When doctype is not null, its
   * {@link Node#ownerDocument} attribute is set to the document being created. Default is
   * `null`
   * @returns {Document}
   * A new {@link Document} object with its document element. If the NamespaceURI,
   * qualifiedName, and doctype are null, the returned {@link Document} is empty with no
   * document element.
   * @throws {DOMException}
   * With code:
   *
   * - `INVALID_CHARACTER_ERR`: Raised if the specified qualified name is not an XML name
   * according to {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#XML XML 1.0}.
   * - `NAMESPACE_ERR`: Raised if the qualifiedName is malformed, if the qualifiedName has a
   * prefix and the namespaceURI is null, or if the qualifiedName is null and the namespaceURI
   * is different from null, or if the qualifiedName has a prefix that is "xml" and the
   * namespaceURI is different from "{@link http://www.w3.org/XML/1998/namespace}"
   * {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#Namespaces XML Namespaces},
   * or if the DOM implementation does not support the "XML" feature but a non-null namespace
   * URI was provided, since namespaces were defined by XML.
   * - `WRONG_DOCUMENT_ERR`: Raised if doctype has already been used with a different document
   * or was created from a different implementation.
   * - `NOT_SUPPORTED_ERR`: May be raised if the implementation does not support the feature
   * "XML" and the language exposed through the Document does not support XML Namespaces (such
   * as {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#HTML40 HTML 4.01}).
   * @since DOM Level 2.
   * @see {@link #createHTMLDocument}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocument MDN
   * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument DOM Living Standard
   * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Level-2-Core-DOM-createDocument DOM
   *      Level 3 Core
   * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocument DOM
   *      Level 2 Core (initial)
   */
  createDocument: function(e, r, t) {
    var n = Gr.XML_APPLICATION;
    e === er.HTML ? n = Gr.XML_XHTML_APPLICATION : e === er.SVG && (n = Gr.XML_SVG_IMAGE);
    var u = new ar(qe, { contentType: n });
    if (u.implementation = this, u.childNodes = new Ie(), u.doctype = t || null, t && u.appendChild(t), r) {
      var a = u.createElementNS(e, r);
      u.appendChild(a);
    }
    return u;
  },
  /**
   * Creates an empty DocumentType node. Entity declarations and notations are not made
   * available. Entity reference expansions and default attribute additions do not occur.
   *
   * **This behavior is slightly different from the one in the specs**:
   * - `encoding`, `mode`, `origin`, `url` fields are currently not declared.
   * - `publicId` and `systemId` contain the raw data including any possible quotes,
   *   so they can always be serialized back to the original value
   * - `internalSubset` contains the raw string between `[` and `]` if present,
   *   but is not parsed or validated in any form.
   *
   * @function DOMImplementation#createDocumentType
   * @param {string} qualifiedName
   * The {@link https://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-qualifiedname qualified
   * name} of the document type to be created.
   * @param {string} [publicId]
   * The external subset public identifier.
   * @param {string} [systemId]
   * The external subset system identifier.
   * @param {string} [internalSubset]
   * the internal subset or an empty string if it is not present
   * @returns {DocumentType}
   * A new {@link DocumentType} node with {@link Node#ownerDocument} set to null.
   * @throws {DOMException}
   * With code:
   *
   * - `INVALID_CHARACTER_ERR`: Raised if the specified qualified name is not an XML name
   * according to {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#XML XML 1.0}.
   * - `NAMESPACE_ERR`: Raised if the qualifiedName is malformed.
   * - `NOT_SUPPORTED_ERR`: May be raised if the implementation does not support the feature
   * "XML" and the language exposed through the Document does not support XML Namespaces (such
   * as {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#HTML40 HTML 4.01}).
   * @since DOM Level 2.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocumentType
   *      MDN
   * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocumenttype DOM Living
   *      Standard
   * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Level-3-Core-DOM-createDocType DOM
   *      Level 3 Core
   * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocType DOM
   *      Level 2 Core
   * @see https://github.com/xmldom/xmldom/blob/master/CHANGELOG.md#050
   * @see https://www.w3.org/TR/DOM-Level-2-Core/#core-ID-Core-DocType-internalSubset
   * @prettierignore
   */
  createDocumentType: function(e, r, t, n) {
    Bu(e);
    var u = new At(qe);
    return u.name = e, u.nodeName = e, u.publicId = r || "", u.systemId = t || "", u.internalSubset = n || "", u.childNodes = new Ie(), u;
  },
  /**
   * Returns an HTML document, that might already have a basic DOM structure.
   *
   * __It behaves slightly different from the description in the living standard__:
   * - If the first argument is `false` no initial nodes are added (steps 3-7 in the specs are
   * omitted)
   * - `encoding`, `mode`, `origin`, `url` fields are currently not declared.
   *
   * @param {string | false} [title]
   * A string containing the title to give the new HTML document.
   * @returns {Document}
   * The HTML document.
   * @since WHATWG Living Standard.
   * @see {@link #createDocument}
   * @see https://dom.spec.whatwg.org/#dom-domimplementation-createhtmldocument
   * @see https://dom.spec.whatwg.org/#html-document
   */
  createHTMLDocument: function(e) {
    var r = new ar(qe, { contentType: Gr.HTML });
    if (r.implementation = this, r.childNodes = new Ie(), e !== !1) {
      r.doctype = this.createDocumentType("html"), r.doctype.ownerDocument = r, r.appendChild(r.doctype);
      var t = r.createElement("html");
      r.appendChild(t);
      var n = r.createElement("head");
      if (t.appendChild(n), typeof e == "string") {
        var u = r.createElement("title");
        u.appendChild(r.createTextNode(e)), n.appendChild(u);
      }
      t.appendChild(r.createElement("body"));
    }
    return r;
  }
};
function ge(e) {
  je(e);
}
ge.prototype = {
  /**
   * The first child of this node.
   *
   * @type {Node | null}
   */
  firstChild: null,
  /**
   * The last child of this node.
   *
   * @type {Node | null}
   */
  lastChild: null,
  /**
   * The previous sibling of this node.
   *
   * @type {Node | null}
   */
  previousSibling: null,
  /**
   * The next sibling of this node.
   *
   * @type {Node | null}
   */
  nextSibling: null,
  /**
   * The parent node of this node.
   *
   * @type {Node | null}
   */
  parentNode: null,
  /**
   * The parent element of this node.
   *
   * @type {Element | null}
   */
  get parentElement() {
    return this.parentNode && this.parentNode.nodeType === this.ELEMENT_NODE ? this.parentNode : null;
  },
  /**
   * The child nodes of this node.
   *
   * @type {NodeList}
   */
  childNodes: null,
  /**
   * The document object associated with this node.
   *
   * @type {Document | null}
   */
  ownerDocument: null,
  /**
   * The value of this node.
   *
   * @type {string | null}
   */
  nodeValue: null,
  /**
   * The namespace URI of this node.
   *
   * @type {string | null}
   */
  namespaceURI: null,
  /**
   * The prefix of the namespace for this node.
   *
   * @type {string | null}
   */
  prefix: null,
  /**
   * The local part of the qualified name of this node.
   *
   * @type {string | null}
   */
  localName: null,
  /**
   * The baseURI is currently always `about:blank`,
   * since that's what happens when you create a document from scratch.
   *
   * @type {'about:blank'}
   */
  baseURI: "about:blank",
  /**
   * Is true if this node is part of a document.
   *
   * @type {boolean}
   */
  get isConnected() {
    var e = this.getRootNode();
    return e && e.nodeType === e.DOCUMENT_NODE;
  },
  /**
   * Checks whether `other` is an inclusive descendant of this node.
   *
   * @param {Node | null | undefined} other
   * The node to check.
   * @returns {boolean}
   * True if `other` is an inclusive descendant of this node; false otherwise.
   * @see https://dom.spec.whatwg.org/#dom-node-contains
   */
  contains: function(e) {
    if (!e) return !1;
    var r = e;
    do {
      if (this === r) return !0;
      r = e.parentNode;
    } while (r);
    return !1;
  },
  /**
   * @typedef GetRootNodeOptions
   * @property {boolean} [composed=false]
   */
  /**
   * Searches for the root node of this node.
   *
   * **This behavior is slightly different from the in the specs**:
   * - ignores `options.composed`, since `ShadowRoot`s are unsupported, always returns root.
   *
   * @param {GetRootNodeOptions} [options]
   * @returns {Node}
   * Root node.
   * @see https://dom.spec.whatwg.org/#dom-node-getrootnode
   * @see https://dom.spec.whatwg.org/#concept-shadow-including-root
   */
  getRootNode: function(e) {
    var r = this;
    do {
      if (!r.parentNode)
        return r;
      r = r.parentNode;
    } while (r);
  },
  /**
   * Checks whether the given node is equal to this node.
   *
   * @param {Node} [otherNode]
   * @see https://dom.spec.whatwg.org/#concept-node-equals
   */
  isEqualNode: function(e) {
    if (!e || this.nodeType !== e.nodeType) return !1;
    switch (this.nodeType) {
      case this.DOCUMENT_TYPE_NODE:
        if (this.name !== e.name || this.publicId !== e.publicId || this.systemId !== e.systemId) return !1;
        break;
      case this.ELEMENT_NODE:
        if (this.namespaceURI !== e.namespaceURI || this.prefix !== e.prefix || this.localName !== e.localName || this.attributes.length !== e.attributes.length) return !1;
        for (var r = 0; r < this.attributes.length; r++) {
          var t = this.attributes.item(r);
          if (!t.isEqualNode(e.getAttributeNodeNS(t.namespaceURI, t.localName)))
            return !1;
        }
        break;
      case this.ATTRIBUTE_NODE:
        if (this.namespaceURI !== e.namespaceURI || this.localName !== e.localName || this.value !== e.value) return !1;
        break;
      case this.PROCESSING_INSTRUCTION_NODE:
        if (this.target !== e.target || this.data !== e.data)
          return !1;
        break;
      case this.TEXT_NODE:
      case this.COMMENT_NODE:
        if (this.data !== e.data) return !1;
        break;
    }
    if (this.childNodes.length !== e.childNodes.length)
      return !1;
    for (var r = 0; r < this.childNodes.length; r++)
      if (!this.childNodes[r].isEqualNode(e.childNodes[r]))
        return !1;
    return !0;
  },
  /**
   * Checks whether or not the given node is this node.
   *
   * @param {Node} [otherNode]
   */
  isSameNode: function(e) {
    return this === e;
  },
  /**
   * Inserts a node before a reference node as a child of this node.
   *
   * @param {Node} newChild
   * The new child node to be inserted.
   * @param {Node | null} refChild
   * The reference node before which newChild will be inserted.
   * @returns {Node}
   * The new child node successfully inserted.
   * @throws {DOMException}
   * Throws a DOMException if inserting the node would result in a DOM tree that is not
   * well-formed, or if `child` is provided but is not a child of `parent`.
   * See {@link _insertBefore} for more details.
   * @since Modified in DOM L2
   */
  insertBefore: function(e, r) {
    return gt(this, e, r);
  },
  /**
   * Replaces an old child node with a new child node within this node.
   *
   * @param {Node} newChild
   * The new node that is to replace the old node.
   * If it already exists in the DOM, it is removed from its original position.
   * @param {Node} oldChild
   * The existing child node to be replaced.
   * @returns {Node}
   * Returns the replaced child node.
   * @throws {DOMException}
   * Throws a DOMException if replacing the node would result in a DOM tree that is not
   * well-formed, or if `oldChild` is not a child of `this`.
   * This can also occur if the pre-replacement validity assertion fails.
   * See {@link _insertBefore}, {@link Node.removeChild}, and
   * {@link assertPreReplacementValidityInDocument} for more details.
   * @see https://dom.spec.whatwg.org/#concept-node-replace
   */
  replaceChild: function(e, r) {
    gt(this, e, r, Qu), r && this.removeChild(r);
  },
  /**
   * Removes an existing child node from this node.
   *
   * @param {Node} oldChild
   * The child node to be removed.
   * @returns {Node}
   * Returns the removed child node.
   * @throws {DOMException}
   * Throws a DOMException if `oldChild` is not a child of `this`.
   * See {@link _removeChild} for more details.
   */
  removeChild: function(e) {
    return Wu(this, e);
  },
  /**
   * Appends a child node to this node.
   *
   * @param {Node} newChild
   * The child node to be appended to this node.
   * If it already exists in the DOM, it is removed from its original position.
   * @returns {Node}
   * Returns the appended child node.
   * @throws {DOMException}
   * Throws a DOMException if appending the node would result in a DOM tree that is not
   * well-formed, or if `newChild` is not a valid Node.
   * See {@link insertBefore} for more details.
   */
  appendChild: function(e) {
    return this.insertBefore(e, null);
  },
  /**
   * Determines whether this node has any child nodes.
   *
   * @returns {boolean}
   * Returns true if this node has any child nodes, and false otherwise.
   */
  hasChildNodes: function() {
    return this.firstChild != null;
  },
  /**
   * Creates a copy of the calling node.
   *
   * @param {boolean} deep
   * If true, the contents of the node are recursively copied.
   * If false, only the node itself (and its attributes, if it is an element) are copied.
   * @returns {Node}
   * Returns the newly created copy of the node.
   * @throws {DOMException}
   * May throw a DOMException if operations within {@link Element#setAttributeNode} or
   * {@link Node#appendChild} (which are potentially invoked in this method) do not meet their
   * specific constraints.
   * @see {@link cloneNode}
   */
  cloneNode: function(e) {
    return fn(this.ownerDocument || this, this, e);
  },
  /**
   * Puts the specified node and all of its subtree into a "normalized" form. In a normalized
   * subtree, no text nodes in the subtree are empty and there are no adjacent text nodes.
   *
   * Specifically, this method merges any adjacent text nodes (i.e., nodes for which `nodeType`
   * is `TEXT_NODE`) into a single node with the combined data. It also removes any empty text
   * nodes.
   *
   * This method operates recursively, so it also normalizes any and all descendent nodes within
   * the subtree.
   *
   * @throws {DOMException}
   * May throw a DOMException if operations within removeChild or appendData (which are
   * potentially invoked in this method) do not meet their specific constraints.
   * @since Modified in DOM Level 2
   * @see {@link Node.removeChild}
   * @see {@link CharacterData.appendData}
   */
  normalize: function() {
    for (var e = this.firstChild; e; ) {
      var r = e.nextSibling;
      r && r.nodeType == vt && e.nodeType == vt ? (this.removeChild(r), e.appendData(r.data)) : (e.normalize(), e = r);
    }
  },
  /**
   * Checks whether the DOM implementation implements a specific feature and its version.
   *
   * @deprecated
   * Since `DOMImplementation.hasFeature` is deprecated and always returns true.
   * @param {string} feature
   * The package name of the feature to test. This is the same name that can be passed to the
   * method `hasFeature` on `DOMImplementation`.
   * @param {string} version
   * This is the version number of the package name to test.
   * @returns {boolean}
   * Returns true in all cases in the current implementation.
   * @since Introduced in DOM Level 2
   * @see {@link DOMImplementation.hasFeature}
   */
  isSupported: function(e, r) {
    return this.ownerDocument.implementation.hasFeature(e, r);
  },
  /**
   * Look up the prefix associated to the given namespace URI, starting from this node.
   * **The default namespace declarations are ignored by this method.**
   * See Namespace Prefix Lookup for details on the algorithm used by this method.
   *
   * **This behavior is different from the in the specs**:
   * - no node type specific handling
   * - uses the internal attribute _nsMap for resolving namespaces that is updated when changing attributes
   *
   * @param {string | null} namespaceURI
   * The namespace URI for which to find the associated prefix.
   * @returns {string | null}
   * The associated prefix, if found; otherwise, null.
   * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespacePrefix
   * @see https://www.w3.org/TR/DOM-Level-3-Core/namespaces-algorithms.html#lookupNamespacePrefixAlgo
   * @see https://dom.spec.whatwg.org/#dom-node-lookupprefix
   * @see https://github.com/xmldom/xmldom/issues/322
   * @prettierignore
   */
  lookupPrefix: function(e) {
    for (var r = this; r; ) {
      var t = r._nsMap;
      if (t) {
        for (var n in t)
          if (Pr(t, n) && t[n] === e)
            return n;
      }
      r = r.nodeType == Ir ? r.ownerDocument : r.parentNode;
    }
    return null;
  },
  /**
   * This function is used to look up the namespace URI associated with the given prefix,
   * starting from this node.
   *
   * **This behavior is different from the in the specs**:
   * - no node type specific handling
   * - uses the internal attribute _nsMap for resolving namespaces that is updated when changing attributes
   *
   * @param {string | null} prefix
   * The prefix for which to find the associated namespace URI.
   * @returns {string | null}
   * The associated namespace URI, if found; otherwise, null.
   * @since DOM Level 3
   * @see https://dom.spec.whatwg.org/#dom-node-lookupnamespaceuri
   * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespaceURI
   * @prettierignore
   */
  lookupNamespaceURI: function(e) {
    for (var r = this; r; ) {
      var t = r._nsMap;
      if (t && Pr(t, e))
        return t[e];
      r = r.nodeType == Ir ? r.ownerDocument : r.parentNode;
    }
    return null;
  },
  /**
   * Determines whether the given namespace URI is the default namespace.
   *
   * The function works by looking up the prefix associated with the given namespace URI. If no
   * prefix is found (i.e., the namespace URI is not registered in the namespace map of this
   * node or any of its ancestors), it returns `true`, implying the namespace URI is considered
   * the default.
   *
   * **This behavior is different from the in the specs**:
   * - no node type specific handling
   * - uses the internal attribute _nsMap for resolving namespaces that is updated when changing attributes
   *
   * @param {string | null} namespaceURI
   * The namespace URI to be checked.
   * @returns {boolean}
   * Returns true if the given namespace URI is the default namespace, false otherwise.
   * @since DOM Level 3
   * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-isDefaultNamespace
   * @see https://dom.spec.whatwg.org/#dom-node-isdefaultnamespace
   * @prettierignore
   */
  isDefaultNamespace: function(e) {
    var r = this.lookupPrefix(e);
    return r == null;
  },
  /**
   * Compares the reference node with a node with regard to their position in the document and
   * according to the document order.
   *
   * @param {Node} other
   * The node to compare the reference node to.
   * @returns {number}
   * Returns how the node is positioned relatively to the reference node according to the
   * bitmask. 0 if reference node and given node are the same.
   * @since DOM Level 3
   * @see https://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core.html#Node3-compare
   * @see https://dom.spec.whatwg.org/#dom-node-comparedocumentposition
   */
  compareDocumentPosition: function(e) {
    if (this === e) return 0;
    var r = e, t = this, n = null, u = null;
    if (r instanceof vr && (n = r, r = n.ownerElement), t instanceof vr && (u = t, t = u.ownerElement, n && r && t === r))
      for (var a = 0, i; i = t.attributes[a]; a++) {
        if (i === n)
          return Ne.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + Ne.DOCUMENT_POSITION_PRECEDING;
        if (i === u)
          return Ne.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + Ne.DOCUMENT_POSITION_FOLLOWING;
      }
    if (!r || !t || t.ownerDocument !== r.ownerDocument)
      return Ne.DOCUMENT_POSITION_DISCONNECTED + Ne.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + (_n(t.ownerDocument) > _n(r.ownerDocument) ? Ne.DOCUMENT_POSITION_FOLLOWING : Ne.DOCUMENT_POSITION_PRECEDING);
    if (u && r === t)
      return Ne.DOCUMENT_POSITION_CONTAINS + Ne.DOCUMENT_POSITION_PRECEDING;
    if (n && r === t)
      return Ne.DOCUMENT_POSITION_CONTAINED_BY + Ne.DOCUMENT_POSITION_FOLLOWING;
    for (var f = [], l = r.parentNode; l; ) {
      if (!u && l === t)
        return Ne.DOCUMENT_POSITION_CONTAINED_BY + Ne.DOCUMENT_POSITION_FOLLOWING;
      f.push(l), l = l.parentNode;
    }
    f.reverse();
    for (var y = [], A = t.parentNode; A; ) {
      if (!n && A === r)
        return Ne.DOCUMENT_POSITION_CONTAINS + Ne.DOCUMENT_POSITION_PRECEDING;
      y.push(A), A = A.parentNode;
    }
    y.reverse();
    var _ = Vu(f, y);
    for (var q in _.childNodes) {
      var j = _.childNodes[q];
      if (j === t) return Ne.DOCUMENT_POSITION_FOLLOWING;
      if (j === r) return Ne.DOCUMENT_POSITION_PRECEDING;
      if (y.indexOf(j) >= 0) return Ne.DOCUMENT_POSITION_FOLLOWING;
      if (f.indexOf(j) >= 0) return Ne.DOCUMENT_POSITION_PRECEDING;
    }
    return 0;
  }
};
function Hu(e) {
  return e == "<" && "&lt;" || e == ">" && "&gt;" || e == "&" && "&amp;" || e == '"' && "&quot;" || "&#" + e.charCodeAt() + ";";
}
Lr(Xe, ge);
Lr(Xe, ge.prototype);
Lr(Ne, ge);
Lr(Ne, ge.prototype);
function Hr(e, r) {
  if (r(e))
    return !0;
  if (e = e.firstChild)
    do
      if (Hr(e, r))
        return !0;
    while (e = e.nextSibling);
}
function ar(e, r) {
  je(e);
  var t = r || {};
  this.ownerDocument = this, this.contentType = t.contentType || Gr.XML_APPLICATION, this.type = _o(this.contentType) ? "html" : "xml";
}
function zo(e, r, t) {
  e && e._inc++;
  var n = t.namespaceURI;
  n === er.XMLNS && (r._nsMap[t.prefix ? t.localName : ""] = t.value);
}
function zu(e, r, t, n) {
  e && e._inc++;
  var u = t.namespaceURI;
  u === er.XMLNS && delete r._nsMap[t.prefix ? t.localName : ""];
}
function Yu(e, r, t) {
  if (e && e._inc) {
    e._inc++;
    var n = r.childNodes;
    if (t && !t.nextSibling)
      n[n.length++] = t;
    else {
      for (var u = r.firstChild, a = 0; u; )
        n[a++] = u, u = u.nextSibling;
      n.length = a, delete n[n.length];
    }
  }
}
function Wu(e, r) {
  if (e !== r.parentNode)
    throw new re(re.NOT_FOUND_ERR, "child's parent is not parent");
  var t = r.previousSibling, n = r.nextSibling;
  return t ? t.nextSibling = n : e.firstChild = n, n ? n.previousSibling = t : e.lastChild = t, Yu(e.ownerDocument, e), r.parentNode = null, r.previousSibling = null, r.nextSibling = null, r;
}
function Yo(e) {
  return e && (e.nodeType === ge.DOCUMENT_NODE || e.nodeType === ge.DOCUMENT_FRAGMENT_NODE || e.nodeType === ge.ELEMENT_NODE);
}
function Wo(e) {
  return e && (e.nodeType === ge.CDATA_SECTION_NODE || e.nodeType === ge.COMMENT_NODE || e.nodeType === ge.DOCUMENT_FRAGMENT_NODE || e.nodeType === ge.DOCUMENT_TYPE_NODE || e.nodeType === ge.ELEMENT_NODE || e.nodeType === ge.PROCESSING_INSTRUCTION_NODE || e.nodeType === ge.TEXT_NODE);
}
function or(e) {
  return e && e.nodeType === ge.DOCUMENT_TYPE_NODE;
}
function rr(e) {
  return e && e.nodeType === ge.ELEMENT_NODE;
}
function $u(e) {
  return e && e.nodeType === ge.TEXT_NODE;
}
function Fn(e, r) {
  var t = e.childNodes || [];
  if (Je(t, rr) || or(r))
    return !1;
  var n = Je(t, or);
  return !(r && n && t.indexOf(n) > t.indexOf(r));
}
function kn(e, r) {
  var t = e.childNodes || [];
  function n(a) {
    return rr(a) && a !== r;
  }
  if (Je(t, n))
    return !1;
  var u = Je(t, or);
  return !(r && u && t.indexOf(u) > t.indexOf(r));
}
function $o(e, r, t) {
  if (!Yo(e))
    throw new re(re.HIERARCHY_REQUEST_ERR, "Unexpected parent node type " + e.nodeType);
  if (t && t.parentNode !== e)
    throw new re(re.NOT_FOUND_ERR, "child not in parent");
  if (
    // 4. If `node` is not a DocumentFragment, DocumentType, Element, or CharacterData node, then throw a "HierarchyRequestError" DOMException.
    !Wo(r) || // 5. If either `node` is a Text node and `parent` is a document,
    // the sax parser currently adds top level text nodes, this will be fixed in 0.9.0
    // || (node.nodeType === Node.TEXT_NODE && parent.nodeType === Node.DOCUMENT_NODE)
    // or `node` is a doctype and `parent` is not a document, then throw a "HierarchyRequestError" DOMException.
    or(r) && e.nodeType !== ge.DOCUMENT_NODE
  )
    throw new re(
      re.HIERARCHY_REQUEST_ERR,
      "Unexpected node type " + r.nodeType + " for parent node type " + e.nodeType
    );
}
function Qo(e, r, t) {
  var n = e.childNodes || [], u = r.childNodes || [];
  if (r.nodeType === ge.DOCUMENT_FRAGMENT_NODE) {
    var a = u.filter(rr);
    if (a.length > 1 || Je(u, $u))
      throw new re(re.HIERARCHY_REQUEST_ERR, "More than one element or text in fragment");
    if (a.length === 1 && !Fn(e, t))
      throw new re(re.HIERARCHY_REQUEST_ERR, "Element in fragment can not be inserted before doctype");
  }
  if (rr(r) && !Fn(e, t))
    throw new re(re.HIERARCHY_REQUEST_ERR, "Only one element can be added and only after doctype");
  if (or(r)) {
    if (Je(n, or))
      throw new re(re.HIERARCHY_REQUEST_ERR, "Only one doctype is allowed");
    var i = Je(n, rr);
    if (t && n.indexOf(i) < n.indexOf(t))
      throw new re(re.HIERARCHY_REQUEST_ERR, "Doctype can only be inserted before an element");
    if (!t && i)
      throw new re(re.HIERARCHY_REQUEST_ERR, "Doctype can not be appended since element is present");
  }
}
function Qu(e, r, t) {
  var n = e.childNodes || [], u = r.childNodes || [];
  if (r.nodeType === ge.DOCUMENT_FRAGMENT_NODE) {
    var a = u.filter(rr);
    if (a.length > 1 || Je(u, $u))
      throw new re(re.HIERARCHY_REQUEST_ERR, "More than one element or text in fragment");
    if (a.length === 1 && !kn(e, t))
      throw new re(re.HIERARCHY_REQUEST_ERR, "Element in fragment can not be inserted before doctype");
  }
  if (rr(r) && !kn(e, t))
    throw new re(re.HIERARCHY_REQUEST_ERR, "Only one element can be added and only after doctype");
  if (or(r)) {
    if (Je(n, function(l) {
      return or(l) && l !== t;
    }))
      throw new re(re.HIERARCHY_REQUEST_ERR, "Only one doctype is allowed");
    var i = Je(n, rr);
    if (t && n.indexOf(i) < n.indexOf(t))
      throw new re(re.HIERARCHY_REQUEST_ERR, "Doctype can only be inserted before an element");
  }
}
function gt(e, r, t, n) {
  $o(e, r, t), e.nodeType === ge.DOCUMENT_NODE && (n || Qo)(e, r, t);
  var u = r.parentNode;
  if (u && u.removeChild(r), r.nodeType === ur) {
    var a = r.firstChild;
    if (a == null)
      return r;
    var i = r.lastChild;
  } else
    a = i = r;
  var f = t ? t.previousSibling : e.lastChild;
  a.previousSibling = f, i.nextSibling = t, f ? f.nextSibling = a : e.firstChild = a, t == null ? e.lastChild = i : t.previousSibling = i;
  do
    a.parentNode = e;
  while (a !== i && (a = a.nextSibling));
  return Yu(e.ownerDocument || e, e, r), r.nodeType == ur && (r.firstChild = r.lastChild = null), r;
}
ar.prototype = {
  /**
   * The implementation that created this document.
   *
   * @type DOMImplementation
   * @readonly
   */
  implementation: null,
  nodeName: "#document",
  nodeType: Jr,
  /**
   * The DocumentType node of the document.
   *
   * @type DocumentType
   * @readonly
   */
  doctype: null,
  documentElement: null,
  _inc: 1,
  insertBefore: function(e, r) {
    if (e.nodeType === ur) {
      for (var t = e.firstChild; t; ) {
        var n = t.nextSibling;
        this.insertBefore(t, r), t = n;
      }
      return e;
    }
    return gt(this, e, r), e.ownerDocument = this, this.documentElement === null && e.nodeType === Ye && (this.documentElement = e), e;
  },
  removeChild: function(e) {
    var r = Wu(this, e);
    return r === this.documentElement && (this.documentElement = null), r;
  },
  replaceChild: function(e, r) {
    gt(this, e, r, Qu), e.ownerDocument = this, r && this.removeChild(r), rr(e) && (this.documentElement = e);
  },
  // Introduced in DOM Level 2:
  importNode: function(e, r) {
    return Ju(this, e, r);
  },
  // Introduced in DOM Level 2:
  getElementById: function(e) {
    var r = null;
    return Hr(this.documentElement, function(t) {
      if (t.nodeType == Ye && t.getAttribute("id") == e)
        return r = t, !0;
    }), r;
  },
  /**
   * Creates a new `Element` that is owned by this `Document`.
   * In HTML Documents `localName` is the lower cased `tagName`,
   * otherwise no transformation is being applied.
   * When `contentType` implies the HTML namespace, it will be set as `namespaceURI`.
   *
   * __This implementation differs from the specification:__ - The provided name is not checked
   * against the `Name` production,
   * so no related error will be thrown.
   * - There is no interface `HTMLElement`, it is always an `Element`.
   * - There is no support for a second argument to indicate using custom elements.
   *
   * @param {string} tagName
   * @returns {Element}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
   * @see https://dom.spec.whatwg.org/#dom-document-createelement
   * @see https://dom.spec.whatwg.org/#concept-create-element
   */
  createElement: function(e) {
    var r = new ir(qe);
    r.ownerDocument = this, this.type === "html" && (e = e.toLowerCase()), Lo(this.contentType) && (r.namespaceURI = er.HTML), r.nodeName = e, r.tagName = e, r.localName = e, r.childNodes = new Ie();
    var t = r.attributes = new Mr();
    return t._ownerElement = r, r;
  },
  /**
   * @returns {DocumentFragment}
   */
  createDocumentFragment: function() {
    var e = new st(qe);
    return e.ownerDocument = this, e.childNodes = new Ie(), e;
  },
  /**
   * @param {string} data
   * @returns {Text}
   */
  createTextNode: function(e) {
    var r = new it(qe);
    return r.ownerDocument = this, r.childNodes = new Ie(), r.appendData(e), r;
  },
  /**
   * @param {string} data
   * @returns {Comment}
   */
  createComment: function(e) {
    var r = new Dt(qe);
    return r.ownerDocument = this, r.childNodes = new Ie(), r.appendData(e), r;
  },
  /**
   * @param {string} data
   * @returns {CDATASection}
   */
  createCDATASection: function(e) {
    var r = new bt(qe);
    return r.ownerDocument = this, r.childNodes = new Ie(), r.appendData(e), r;
  },
  /**
   * @param {string} target
   * @param {string} data
   * @returns {ProcessingInstruction}
   */
  createProcessingInstruction: function(e, r) {
    var t = new Ct(qe);
    return t.ownerDocument = this, t.childNodes = new Ie(), t.nodeName = t.target = e, t.nodeValue = t.data = r, t;
  },
  /**
   * Creates an `Attr` node that is owned by this document.
   * In HTML Documents `localName` is the lower cased `name`,
   * otherwise no transformation is being applied.
   *
   * __This implementation differs from the specification:__ - The provided name is not checked
   * against the `Name` production,
   * so no related error will be thrown.
   *
   * @param {string} name
   * @returns {Attr}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/createAttribute
   * @see https://dom.spec.whatwg.org/#dom-document-createattribute
   */
  createAttribute: function(e) {
    if (!Ze.QName_exact.test(e))
      throw new re(re.INVALID_CHARACTER_ERR, 'invalid character in name "' + e + '"');
    return this.type === "html" && (e = e.toLowerCase()), this._createAttribute(e);
  },
  _createAttribute: function(e) {
    var r = new vr(qe);
    return r.ownerDocument = this, r.childNodes = new Ie(), r.name = e, r.nodeName = e, r.localName = e, r.specified = !0, r;
  },
  /**
   * Creates an EntityReference object.
   * The current implementation does not fill the `childNodes` with those of the corresponding
   * `Entity`
   *
   * @deprecated
   * In DOM Level 4.
   * @param {string} name
   * The name of the entity to reference. No namespace well-formedness checks are performed.
   * @returns {EntityReference}
   * @throws {DOMException}
   * With code `INVALID_CHARACTER_ERR` when `name` is not valid.
   * @throws {DOMException}
   * with code `NOT_SUPPORTED_ERR` when the document is of type `html`
   * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-392B75AE
   */
  createEntityReference: function(e) {
    if (!Ze.Name.test(e))
      throw new re(re.INVALID_CHARACTER_ERR, 'not a valid xml name "' + e + '"');
    if (this.type === "html")
      throw new re("document is an html document", ko.NotSupportedError);
    var r = new wt(qe);
    return r.ownerDocument = this, r.childNodes = new Ie(), r.nodeName = e, r;
  },
  // Introduced in DOM Level 2:
  /**
   * @param {string} namespaceURI
   * @param {string} qualifiedName
   * @returns {Element}
   */
  createElementNS: function(e, r) {
    var t = cn(e, r), n = new ir(qe), u = n.attributes = new Mr();
    return n.childNodes = new Ie(), n.ownerDocument = this, n.nodeName = r, n.tagName = r, n.namespaceURI = t[0], n.prefix = t[1], n.localName = t[2], u._ownerElement = n, n;
  },
  // Introduced in DOM Level 2:
  /**
   * @param {string} namespaceURI
   * @param {string} qualifiedName
   * @returns {Attr}
   */
  createAttributeNS: function(e, r) {
    var t = cn(e, r), n = new vr(qe);
    return n.ownerDocument = this, n.childNodes = new Ie(), n.nodeName = r, n.name = r, n.specified = !0, n.namespaceURI = t[0], n.prefix = t[1], n.localName = t[2], n;
  }
};
Ve(ar, ge);
function ir(e) {
  je(e), this._nsMap = /* @__PURE__ */ Object.create(null);
}
ir.prototype = {
  nodeType: Ye,
  /**
   * The attributes of this element.
   *
   * @type {NamedNodeMap | null}
   */
  attributes: null,
  getQualifiedName: function() {
    return this.prefix ? this.prefix + ":" + this.localName : this.localName;
  },
  _isInHTMLDocumentAndNamespace: function() {
    return this.ownerDocument.type === "html" && this.namespaceURI === er.HTML;
  },
  /**
   * Implementaton of Level2 Core function hasAttributes.
   *
   * @returns {boolean}
   * True if attribute list is not empty.
   * @see https://www.w3.org/TR/DOM-Level-2-Core/#core-ID-NodeHasAttrs
   */
  hasAttributes: function() {
    return !!(this.attributes && this.attributes.length);
  },
  hasAttribute: function(e) {
    return !!this.getAttributeNode(e);
  },
  /**
   * Returns element’s first attribute whose qualified name is `name`, and `null`
   * if there is no such attribute.
   *
   * @param {string} name
   * @returns {string | null}
   */
  getAttribute: function(e) {
    var r = this.getAttributeNode(e);
    return r ? r.value : null;
  },
  getAttributeNode: function(e) {
    return this._isInHTMLDocumentAndNamespace() && (e = e.toLowerCase()), this.attributes.getNamedItem(e);
  },
  /**
   * Sets the value of element’s first attribute whose qualified name is qualifiedName to value.
   *
   * @param {string} name
   * @param {string} value
   */
  setAttribute: function(e, r) {
    this._isInHTMLDocumentAndNamespace() && (e = e.toLowerCase());
    var t = this.getAttributeNode(e);
    t ? t.value = t.nodeValue = "" + r : (t = this.ownerDocument._createAttribute(e), t.value = t.nodeValue = "" + r, this.setAttributeNode(t));
  },
  removeAttribute: function(e) {
    var r = this.getAttributeNode(e);
    r && this.removeAttributeNode(r);
  },
  setAttributeNode: function(e) {
    return this.attributes.setNamedItem(e);
  },
  setAttributeNodeNS: function(e) {
    return this.attributes.setNamedItemNS(e);
  },
  removeAttributeNode: function(e) {
    return this.attributes.removeNamedItem(e.nodeName);
  },
  //get real attribute name,and remove it by removeAttributeNode
  removeAttributeNS: function(e, r) {
    var t = this.getAttributeNodeNS(e, r);
    t && this.removeAttributeNode(t);
  },
  hasAttributeNS: function(e, r) {
    return this.getAttributeNodeNS(e, r) != null;
  },
  /**
   * Returns element’s attribute whose namespace is `namespaceURI` and local name is
   * `localName`,
   * or `null` if there is no such attribute.
   *
   * @param {string} namespaceURI
   * @param {string} localName
   * @returns {string | null}
   */
  getAttributeNS: function(e, r) {
    var t = this.getAttributeNodeNS(e, r);
    return t ? t.value : null;
  },
  /**
   * Sets the value of element’s attribute whose namespace is `namespaceURI` and local name is
   * `localName` to value.
   *
   * @param {string} namespaceURI
   * @param {string} qualifiedName
   * @param {string} value
   * @see https://dom.spec.whatwg.org/#dom-element-setattributens
   */
  setAttributeNS: function(e, r, t) {
    var n = cn(e, r), u = n[2], a = this.getAttributeNodeNS(e, u);
    a ? a.value = a.nodeValue = "" + t : (a = this.ownerDocument.createAttributeNS(e, r), a.value = a.nodeValue = "" + t, this.setAttributeNode(a));
  },
  getAttributeNodeNS: function(e, r) {
    return this.attributes.getNamedItemNS(e, r);
  },
  /**
   * Returns a LiveNodeList of all child elements which have **all** of the given class name(s).
   *
   * Returns an empty list if `classNames` is an empty string or only contains HTML white space
   * characters.
   *
   * Warning: This returns a live LiveNodeList.
   * Changes in the DOM will reflect in the array as the changes occur.
   * If an element selected by this array no longer qualifies for the selector,
   * it will automatically be removed. Be aware of this for iteration purposes.
   *
   * @param {string} classNames
   * Is a string representing the class name(s) to match; multiple class names are separated by
   * (ASCII-)whitespace.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByClassName
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName
   * @see https://dom.spec.whatwg.org/#concept-getelementsbyclassname
   */
  getElementsByClassName: function(e) {
    var r = Ln(e);
    return new pr(this, function(t) {
      var n = [];
      return r.length > 0 && Hr(t, function(u) {
        if (u !== t && u.nodeType === Ye) {
          var a = u.getAttribute("class");
          if (a) {
            var i = e === a;
            if (!i) {
              var f = Ln(a);
              i = r.every(Vo(f));
            }
            i && n.push(u);
          }
        }
      }), n;
    });
  },
  /**
   * Returns a LiveNodeList of elements with the given qualifiedName.
   * Searching for all descendants can be done by passing `*` as `qualifiedName`.
   *
   * All descendants of the specified element are searched, but not the element itself.
   * The returned list is live, which means it updates itself with the DOM tree automatically.
   * Therefore, there is no need to call `Element.getElementsByTagName()`
   * with the same element and arguments repeatedly if the DOM changes in between calls.
   *
   * When called on an HTML element in an HTML document,
   * `getElementsByTagName` lower-cases the argument before searching for it.
   * This is undesirable when trying to match camel-cased SVG elements (such as
   * `<linearGradient>`) in an HTML document.
   * Instead, use `Element.getElementsByTagNameNS()`,
   * which preserves the capitalization of the tag name.
   *
   * `Element.getElementsByTagName` is similar to `Document.getElementsByTagName()`,
   * except that it only searches for elements that are descendants of the specified element.
   *
   * @param {string} qualifiedName
   * @returns {LiveNodeList}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName
   * @see https://dom.spec.whatwg.org/#concept-getelementsbytagname
   */
  getElementsByTagName: function(e) {
    var r = (this.nodeType === Jr ? this : this.ownerDocument).type === "html", t = e.toLowerCase();
    return new pr(this, function(n) {
      var u = [];
      return Hr(n, function(a) {
        if (!(a === n || a.nodeType !== Ye))
          if (e === "*")
            u.push(a);
          else {
            var i = a.getQualifiedName(), f = r && a.namespaceURI === er.HTML ? t : e;
            i === f && u.push(a);
          }
      }), u;
    });
  },
  getElementsByTagNameNS: function(e, r) {
    return new pr(this, function(t) {
      var n = [];
      return Hr(t, function(u) {
        u !== t && u.nodeType === Ye && (e === "*" || u.namespaceURI === e) && (r === "*" || u.localName == r) && n.push(u);
      }), n;
    });
  }
};
ar.prototype.getElementsByClassName = ir.prototype.getElementsByClassName;
ar.prototype.getElementsByTagName = ir.prototype.getElementsByTagName;
ar.prototype.getElementsByTagNameNS = ir.prototype.getElementsByTagNameNS;
Ve(ir, ge);
function vr(e) {
  je(e), this.namespaceURI = null, this.prefix = null, this.ownerElement = null;
}
vr.prototype.nodeType = Ir;
Ve(vr, ge);
function _r(e) {
  je(e);
}
_r.prototype = {
  data: "",
  substringData: function(e, r) {
    return this.data.substring(e, e + r);
  },
  appendData: function(e) {
    e = this.data + e, this.nodeValue = this.data = e, this.length = e.length;
  },
  insertData: function(e, r) {
    this.replaceData(e, 0, r);
  },
  deleteData: function(e, r) {
    this.replaceData(e, r, "");
  },
  replaceData: function(e, r, t) {
    var n = this.data.substring(0, e), u = this.data.substring(e + r);
    t = n + t + u, this.nodeValue = this.data = t, this.length = t.length;
  }
};
Ve(_r, ge);
function it(e) {
  je(e);
}
it.prototype = {
  nodeName: "#text",
  nodeType: vt,
  splitText: function(e) {
    var r = this.data, t = r.substring(e);
    r = r.substring(0, e), this.data = this.nodeValue = r, this.length = r.length;
    var n = this.ownerDocument.createTextNode(t);
    return this.parentNode && this.parentNode.insertBefore(n, this.nextSibling), n;
  }
};
Ve(it, _r);
function Dt(e) {
  je(e);
}
Dt.prototype = {
  nodeName: "#comment",
  nodeType: Uu
};
Ve(Dt, _r);
function bt(e) {
  je(e);
}
bt.prototype = {
  nodeName: "#cdata-section",
  nodeType: Fu
};
Ve(bt, it);
function At(e) {
  je(e);
}
At.prototype.nodeType = ju;
Ve(At, ge);
function En(e) {
  je(e);
}
En.prototype.nodeType = Go;
Ve(En, ge);
function Tn(e) {
  je(e);
}
Tn.prototype.nodeType = Xo;
Ve(Tn, ge);
function wt(e) {
  je(e);
}
wt.prototype.nodeType = ku;
Ve(wt, ge);
function st(e) {
  je(e);
}
st.prototype.nodeName = "#document-fragment";
st.prototype.nodeType = ur;
Ve(st, ge);
function Ct(e) {
  je(e);
}
Ct.prototype.nodeType = qu;
Ve(Ct, _r);
function Ku() {
}
Ku.prototype.serializeToString = function(e, r) {
  return Zu.call(e, r);
};
ge.prototype.toString = Zu;
function Zu(e) {
  var r = [], t = this.nodeType === Jr && this.documentElement || this, n = t.prefix, u = t.namespaceURI;
  if (u && n == null) {
    var n = t.lookupPrefix(u);
    if (n == null)
      var a = [
        { namespace: u, prefix: null }
        //{namespace:uri,prefix:''}
      ];
  }
  return Nr(this, r, e, a), r.join("");
}
function qn(e, r, t) {
  var n = e.prefix || "", u = e.namespaceURI;
  if (!u || n === "xml" && u === er.XML || u === er.XMLNS)
    return !1;
  for (var a = t.length; a--; ) {
    var i = t[a];
    if (i.prefix === n)
      return i.namespace !== u;
  }
  return !0;
}
function Mt(e, r, t) {
  e.push(" ", r, '="', t.replace(/[<>&"\t\n\r]/g, Hu), '"');
}
function Nr(e, r, t, n) {
  n || (n = []);
  var u = e.nodeType === Jr ? e : e.ownerDocument, a = u.type === "html";
  if (t)
    if (e = t(e), e) {
      if (typeof e == "string") {
        r.push(e);
        return;
      }
    } else
      return;
  switch (e.nodeType) {
    case Ye:
      var i = e.attributes, f = i.length, c = e.firstChild, l = e.tagName, y = l;
      if (!a && !e.prefix && e.namespaceURI) {
        for (var A, _ = 0; _ < i.length; _++)
          if (i.item(_).name === "xmlns") {
            A = i.item(_).value;
            break;
          }
        if (!A)
          for (var q = n.length - 1; q >= 0; q--) {
            var j = n[q];
            if (j.prefix === "" && j.namespace === e.namespaceURI) {
              A = j.namespace;
              break;
            }
          }
        if (A !== e.namespaceURI)
          for (var q = n.length - 1; q >= 0; q--) {
            var j = n[q];
            if (j.namespace === e.namespaceURI) {
              j.prefix && (y = j.prefix + ":" + l);
              break;
            }
          }
      }
      r.push("<", y);
      for (var M = 0; M < f; M++) {
        var P = i.item(M);
        P.prefix == "xmlns" ? n.push({
          prefix: P.localName,
          namespace: P.value
        }) : P.nodeName == "xmlns" && n.push({ prefix: "", namespace: P.value });
      }
      for (var M = 0; M < f; M++) {
        var P = i.item(M);
        if (qn(P, a, n)) {
          var m = P.prefix || "", d = P.namespaceURI;
          Mt(r, m ? "xmlns:" + m : "xmlns", d), n.push({ prefix: m, namespace: d });
        }
        Nr(P, r, t, n);
      }
      if (l === y && qn(e, a, n)) {
        var m = e.prefix || "", d = e.namespaceURI;
        Mt(r, m ? "xmlns:" + m : "xmlns", d), n.push({ prefix: m, namespace: d });
      }
      var x = !c;
      if (x && (a || e.namespaceURI === er.HTML) && (x = Fo(l)), x)
        r.push("/>");
      else {
        if (r.push(">"), a && Bo(l))
          for (; c; )
            c.data ? r.push(c.data) : Nr(c, r, t, n.slice()), c = c.nextSibling;
        else
          for (; c; )
            Nr(c, r, t, n.slice()), c = c.nextSibling;
        r.push("</", y, ">");
      }
      return;
    case Jr:
    case ur:
      for (var c = e.firstChild; c; )
        Nr(c, r, t, n.slice()), c = c.nextSibling;
      return;
    case Ir:
      return Mt(r, e.name, e.value);
    case vt:
      return r.push(e.data.replace(/[<&>]/g, Hu));
    case Fu:
      return r.push(Ze.CDATA_START, e.data, Ze.CDATA_END);
    case Uu:
      return r.push(Ze.COMMENT_START, e.data, Ze.COMMENT_END);
    case ju:
      var v = e.publicId, b = e.systemId;
      r.push(Ze.DOCTYPE_DECL_START, " ", e.name), v ? (r.push(" ", Ze.PUBLIC, " ", v), b && b !== "." && r.push(" ", b)) : b && b !== "." && r.push(" ", Ze.SYSTEM, " ", b), e.internalSubset && r.push(" [", e.internalSubset, "]"), r.push(">");
      return;
    case qu:
      return r.push("<?", e.target, " ", e.data, "?>");
    case ku:
      return r.push("&", e.nodeName, ";");
    default:
      r.push("??", e.nodeName);
  }
}
function Ju(e, r, t) {
  var n;
  switch (r.nodeType) {
    case Ye:
      n = r.cloneNode(!1), n.ownerDocument = e;
    case ur:
      break;
    case Ir:
      t = !0;
      break;
  }
  if (n || (n = r.cloneNode(!1)), n.ownerDocument = e, n.parentNode = null, t)
    for (var u = r.firstChild; u; )
      n.appendChild(Ju(e, u, t)), u = u.nextSibling;
  return n;
}
function fn(e, r, t) {
  var n = new r.constructor(qe);
  for (var u in r)
    if (Pr(r, u)) {
      var a = r[u];
      typeof a != "object" && a != n[u] && (n[u] = a);
    }
  switch (r.childNodes && (n.childNodes = new Ie()), n.ownerDocument = e, n.nodeType) {
    case Ye:
      var i = r.attributes, f = n.attributes = new Mr(), l = i.length;
      f._ownerElement = n;
      for (var y = 0; y < l; y++)
        n.setAttributeNode(fn(e, i.item(y), !0));
      break;
    case Ir:
      t = !0;
  }
  if (t)
    for (var A = r.firstChild; A; )
      n.appendChild(fn(e, A, t)), A = A.nextSibling;
  return n;
}
function ea(e, r, t) {
  e[r] = t;
}
try {
  if (Object.defineProperty) {
    let e = function(r) {
      switch (r.nodeType) {
        case Ye:
        case ur:
          var t = [];
          for (r = r.firstChild; r; )
            r.nodeType !== 7 && r.nodeType !== 8 && t.push(e(r)), r = r.nextSibling;
          return t.join("");
        default:
          return r.nodeValue;
      }
    };
    Object.defineProperty(pr.prototype, "length", {
      get: function() {
        return Tt(this), this.$$length;
      }
    }), Object.defineProperty(ge.prototype, "textContent", {
      get: function() {
        return e(this);
      },
      set: function(r) {
        switch (this.nodeType) {
          case Ye:
          case ur:
            for (; this.firstChild; )
              this.removeChild(this.firstChild);
            (r || String(r)) && this.appendChild(this.ownerDocument.createTextNode(r));
            break;
          default:
            this.data = r, this.value = r, this.nodeValue = r;
        }
      }
    }), ea = function(r, t, n) {
      r["$$" + t] = n;
    };
  }
} catch {
}
Pe._updateLiveList = Tt;
Pe.Attr = vr;
Pe.CDATASection = bt;
Pe.CharacterData = _r;
Pe.Comment = Dt;
Pe.Document = ar;
Pe.DocumentFragment = st;
Pe.DocumentType = At;
Pe.DOMImplementation = Gu;
Pe.Element = ir;
Pe.Entity = Tn;
Pe.EntityReference = wt;
Pe.LiveNodeList = pr;
Pe.NamedNodeMap = Mr;
Pe.Node = ge;
Pe.NodeList = Ie;
Pe.Notation = En;
Pe.Text = it;
Pe.ProcessingInstruction = Ct;
Pe.XMLSerializer = Ku;
var Br = {}, ra = {};
(function(e) {
  var r = Oe.freeze;
  e.XML_ENTITIES = r({
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    quot: '"'
  }), e.HTML_ENTITIES = r({
    Aacute: "Á",
    aacute: "á",
    Abreve: "Ă",
    abreve: "ă",
    ac: "∾",
    acd: "∿",
    acE: "∾̳",
    Acirc: "Â",
    acirc: "â",
    acute: "´",
    Acy: "А",
    acy: "а",
    AElig: "Æ",
    aelig: "æ",
    af: "⁡",
    Afr: "𝔄",
    afr: "𝔞",
    Agrave: "À",
    agrave: "à",
    alefsym: "ℵ",
    aleph: "ℵ",
    Alpha: "Α",
    alpha: "α",
    Amacr: "Ā",
    amacr: "ā",
    amalg: "⨿",
    AMP: "&",
    amp: "&",
    And: "⩓",
    and: "∧",
    andand: "⩕",
    andd: "⩜",
    andslope: "⩘",
    andv: "⩚",
    ang: "∠",
    ange: "⦤",
    angle: "∠",
    angmsd: "∡",
    angmsdaa: "⦨",
    angmsdab: "⦩",
    angmsdac: "⦪",
    angmsdad: "⦫",
    angmsdae: "⦬",
    angmsdaf: "⦭",
    angmsdag: "⦮",
    angmsdah: "⦯",
    angrt: "∟",
    angrtvb: "⊾",
    angrtvbd: "⦝",
    angsph: "∢",
    angst: "Å",
    angzarr: "⍼",
    Aogon: "Ą",
    aogon: "ą",
    Aopf: "𝔸",
    aopf: "𝕒",
    ap: "≈",
    apacir: "⩯",
    apE: "⩰",
    ape: "≊",
    apid: "≋",
    apos: "'",
    ApplyFunction: "⁡",
    approx: "≈",
    approxeq: "≊",
    Aring: "Å",
    aring: "å",
    Ascr: "𝒜",
    ascr: "𝒶",
    Assign: "≔",
    ast: "*",
    asymp: "≈",
    asympeq: "≍",
    Atilde: "Ã",
    atilde: "ã",
    Auml: "Ä",
    auml: "ä",
    awconint: "∳",
    awint: "⨑",
    backcong: "≌",
    backepsilon: "϶",
    backprime: "‵",
    backsim: "∽",
    backsimeq: "⋍",
    Backslash: "∖",
    Barv: "⫧",
    barvee: "⊽",
    Barwed: "⌆",
    barwed: "⌅",
    barwedge: "⌅",
    bbrk: "⎵",
    bbrktbrk: "⎶",
    bcong: "≌",
    Bcy: "Б",
    bcy: "б",
    bdquo: "„",
    becaus: "∵",
    Because: "∵",
    because: "∵",
    bemptyv: "⦰",
    bepsi: "϶",
    bernou: "ℬ",
    Bernoullis: "ℬ",
    Beta: "Β",
    beta: "β",
    beth: "ℶ",
    between: "≬",
    Bfr: "𝔅",
    bfr: "𝔟",
    bigcap: "⋂",
    bigcirc: "◯",
    bigcup: "⋃",
    bigodot: "⨀",
    bigoplus: "⨁",
    bigotimes: "⨂",
    bigsqcup: "⨆",
    bigstar: "★",
    bigtriangledown: "▽",
    bigtriangleup: "△",
    biguplus: "⨄",
    bigvee: "⋁",
    bigwedge: "⋀",
    bkarow: "⤍",
    blacklozenge: "⧫",
    blacksquare: "▪",
    blacktriangle: "▴",
    blacktriangledown: "▾",
    blacktriangleleft: "◂",
    blacktriangleright: "▸",
    blank: "␣",
    blk12: "▒",
    blk14: "░",
    blk34: "▓",
    block: "█",
    bne: "=⃥",
    bnequiv: "≡⃥",
    bNot: "⫭",
    bnot: "⌐",
    Bopf: "𝔹",
    bopf: "𝕓",
    bot: "⊥",
    bottom: "⊥",
    bowtie: "⋈",
    boxbox: "⧉",
    boxDL: "╗",
    boxDl: "╖",
    boxdL: "╕",
    boxdl: "┐",
    boxDR: "╔",
    boxDr: "╓",
    boxdR: "╒",
    boxdr: "┌",
    boxH: "═",
    boxh: "─",
    boxHD: "╦",
    boxHd: "╤",
    boxhD: "╥",
    boxhd: "┬",
    boxHU: "╩",
    boxHu: "╧",
    boxhU: "╨",
    boxhu: "┴",
    boxminus: "⊟",
    boxplus: "⊞",
    boxtimes: "⊠",
    boxUL: "╝",
    boxUl: "╜",
    boxuL: "╛",
    boxul: "┘",
    boxUR: "╚",
    boxUr: "╙",
    boxuR: "╘",
    boxur: "└",
    boxV: "║",
    boxv: "│",
    boxVH: "╬",
    boxVh: "╫",
    boxvH: "╪",
    boxvh: "┼",
    boxVL: "╣",
    boxVl: "╢",
    boxvL: "╡",
    boxvl: "┤",
    boxVR: "╠",
    boxVr: "╟",
    boxvR: "╞",
    boxvr: "├",
    bprime: "‵",
    Breve: "˘",
    breve: "˘",
    brvbar: "¦",
    Bscr: "ℬ",
    bscr: "𝒷",
    bsemi: "⁏",
    bsim: "∽",
    bsime: "⋍",
    bsol: "\\",
    bsolb: "⧅",
    bsolhsub: "⟈",
    bull: "•",
    bullet: "•",
    bump: "≎",
    bumpE: "⪮",
    bumpe: "≏",
    Bumpeq: "≎",
    bumpeq: "≏",
    Cacute: "Ć",
    cacute: "ć",
    Cap: "⋒",
    cap: "∩",
    capand: "⩄",
    capbrcup: "⩉",
    capcap: "⩋",
    capcup: "⩇",
    capdot: "⩀",
    CapitalDifferentialD: "ⅅ",
    caps: "∩︀",
    caret: "⁁",
    caron: "ˇ",
    Cayleys: "ℭ",
    ccaps: "⩍",
    Ccaron: "Č",
    ccaron: "č",
    Ccedil: "Ç",
    ccedil: "ç",
    Ccirc: "Ĉ",
    ccirc: "ĉ",
    Cconint: "∰",
    ccups: "⩌",
    ccupssm: "⩐",
    Cdot: "Ċ",
    cdot: "ċ",
    cedil: "¸",
    Cedilla: "¸",
    cemptyv: "⦲",
    cent: "¢",
    CenterDot: "·",
    centerdot: "·",
    Cfr: "ℭ",
    cfr: "𝔠",
    CHcy: "Ч",
    chcy: "ч",
    check: "✓",
    checkmark: "✓",
    Chi: "Χ",
    chi: "χ",
    cir: "○",
    circ: "ˆ",
    circeq: "≗",
    circlearrowleft: "↺",
    circlearrowright: "↻",
    circledast: "⊛",
    circledcirc: "⊚",
    circleddash: "⊝",
    CircleDot: "⊙",
    circledR: "®",
    circledS: "Ⓢ",
    CircleMinus: "⊖",
    CirclePlus: "⊕",
    CircleTimes: "⊗",
    cirE: "⧃",
    cire: "≗",
    cirfnint: "⨐",
    cirmid: "⫯",
    cirscir: "⧂",
    ClockwiseContourIntegral: "∲",
    CloseCurlyDoubleQuote: "”",
    CloseCurlyQuote: "’",
    clubs: "♣",
    clubsuit: "♣",
    Colon: "∷",
    colon: ":",
    Colone: "⩴",
    colone: "≔",
    coloneq: "≔",
    comma: ",",
    commat: "@",
    comp: "∁",
    compfn: "∘",
    complement: "∁",
    complexes: "ℂ",
    cong: "≅",
    congdot: "⩭",
    Congruent: "≡",
    Conint: "∯",
    conint: "∮",
    ContourIntegral: "∮",
    Copf: "ℂ",
    copf: "𝕔",
    coprod: "∐",
    Coproduct: "∐",
    COPY: "©",
    copy: "©",
    copysr: "℗",
    CounterClockwiseContourIntegral: "∳",
    crarr: "↵",
    Cross: "⨯",
    cross: "✗",
    Cscr: "𝒞",
    cscr: "𝒸",
    csub: "⫏",
    csube: "⫑",
    csup: "⫐",
    csupe: "⫒",
    ctdot: "⋯",
    cudarrl: "⤸",
    cudarrr: "⤵",
    cuepr: "⋞",
    cuesc: "⋟",
    cularr: "↶",
    cularrp: "⤽",
    Cup: "⋓",
    cup: "∪",
    cupbrcap: "⩈",
    CupCap: "≍",
    cupcap: "⩆",
    cupcup: "⩊",
    cupdot: "⊍",
    cupor: "⩅",
    cups: "∪︀",
    curarr: "↷",
    curarrm: "⤼",
    curlyeqprec: "⋞",
    curlyeqsucc: "⋟",
    curlyvee: "⋎",
    curlywedge: "⋏",
    curren: "¤",
    curvearrowleft: "↶",
    curvearrowright: "↷",
    cuvee: "⋎",
    cuwed: "⋏",
    cwconint: "∲",
    cwint: "∱",
    cylcty: "⌭",
    Dagger: "‡",
    dagger: "†",
    daleth: "ℸ",
    Darr: "↡",
    dArr: "⇓",
    darr: "↓",
    dash: "‐",
    Dashv: "⫤",
    dashv: "⊣",
    dbkarow: "⤏",
    dblac: "˝",
    Dcaron: "Ď",
    dcaron: "ď",
    Dcy: "Д",
    dcy: "д",
    DD: "ⅅ",
    dd: "ⅆ",
    ddagger: "‡",
    ddarr: "⇊",
    DDotrahd: "⤑",
    ddotseq: "⩷",
    deg: "°",
    Del: "∇",
    Delta: "Δ",
    delta: "δ",
    demptyv: "⦱",
    dfisht: "⥿",
    Dfr: "𝔇",
    dfr: "𝔡",
    dHar: "⥥",
    dharl: "⇃",
    dharr: "⇂",
    DiacriticalAcute: "´",
    DiacriticalDot: "˙",
    DiacriticalDoubleAcute: "˝",
    DiacriticalGrave: "`",
    DiacriticalTilde: "˜",
    diam: "⋄",
    Diamond: "⋄",
    diamond: "⋄",
    diamondsuit: "♦",
    diams: "♦",
    die: "¨",
    DifferentialD: "ⅆ",
    digamma: "ϝ",
    disin: "⋲",
    div: "÷",
    divide: "÷",
    divideontimes: "⋇",
    divonx: "⋇",
    DJcy: "Ђ",
    djcy: "ђ",
    dlcorn: "⌞",
    dlcrop: "⌍",
    dollar: "$",
    Dopf: "𝔻",
    dopf: "𝕕",
    Dot: "¨",
    dot: "˙",
    DotDot: "⃜",
    doteq: "≐",
    doteqdot: "≑",
    DotEqual: "≐",
    dotminus: "∸",
    dotplus: "∔",
    dotsquare: "⊡",
    doublebarwedge: "⌆",
    DoubleContourIntegral: "∯",
    DoubleDot: "¨",
    DoubleDownArrow: "⇓",
    DoubleLeftArrow: "⇐",
    DoubleLeftRightArrow: "⇔",
    DoubleLeftTee: "⫤",
    DoubleLongLeftArrow: "⟸",
    DoubleLongLeftRightArrow: "⟺",
    DoubleLongRightArrow: "⟹",
    DoubleRightArrow: "⇒",
    DoubleRightTee: "⊨",
    DoubleUpArrow: "⇑",
    DoubleUpDownArrow: "⇕",
    DoubleVerticalBar: "∥",
    DownArrow: "↓",
    Downarrow: "⇓",
    downarrow: "↓",
    DownArrowBar: "⤓",
    DownArrowUpArrow: "⇵",
    DownBreve: "̑",
    downdownarrows: "⇊",
    downharpoonleft: "⇃",
    downharpoonright: "⇂",
    DownLeftRightVector: "⥐",
    DownLeftTeeVector: "⥞",
    DownLeftVector: "↽",
    DownLeftVectorBar: "⥖",
    DownRightTeeVector: "⥟",
    DownRightVector: "⇁",
    DownRightVectorBar: "⥗",
    DownTee: "⊤",
    DownTeeArrow: "↧",
    drbkarow: "⤐",
    drcorn: "⌟",
    drcrop: "⌌",
    Dscr: "𝒟",
    dscr: "𝒹",
    DScy: "Ѕ",
    dscy: "ѕ",
    dsol: "⧶",
    Dstrok: "Đ",
    dstrok: "đ",
    dtdot: "⋱",
    dtri: "▿",
    dtrif: "▾",
    duarr: "⇵",
    duhar: "⥯",
    dwangle: "⦦",
    DZcy: "Џ",
    dzcy: "џ",
    dzigrarr: "⟿",
    Eacute: "É",
    eacute: "é",
    easter: "⩮",
    Ecaron: "Ě",
    ecaron: "ě",
    ecir: "≖",
    Ecirc: "Ê",
    ecirc: "ê",
    ecolon: "≕",
    Ecy: "Э",
    ecy: "э",
    eDDot: "⩷",
    Edot: "Ė",
    eDot: "≑",
    edot: "ė",
    ee: "ⅇ",
    efDot: "≒",
    Efr: "𝔈",
    efr: "𝔢",
    eg: "⪚",
    Egrave: "È",
    egrave: "è",
    egs: "⪖",
    egsdot: "⪘",
    el: "⪙",
    Element: "∈",
    elinters: "⏧",
    ell: "ℓ",
    els: "⪕",
    elsdot: "⪗",
    Emacr: "Ē",
    emacr: "ē",
    empty: "∅",
    emptyset: "∅",
    EmptySmallSquare: "◻",
    emptyv: "∅",
    EmptyVerySmallSquare: "▫",
    emsp: " ",
    emsp13: " ",
    emsp14: " ",
    ENG: "Ŋ",
    eng: "ŋ",
    ensp: " ",
    Eogon: "Ę",
    eogon: "ę",
    Eopf: "𝔼",
    eopf: "𝕖",
    epar: "⋕",
    eparsl: "⧣",
    eplus: "⩱",
    epsi: "ε",
    Epsilon: "Ε",
    epsilon: "ε",
    epsiv: "ϵ",
    eqcirc: "≖",
    eqcolon: "≕",
    eqsim: "≂",
    eqslantgtr: "⪖",
    eqslantless: "⪕",
    Equal: "⩵",
    equals: "=",
    EqualTilde: "≂",
    equest: "≟",
    Equilibrium: "⇌",
    equiv: "≡",
    equivDD: "⩸",
    eqvparsl: "⧥",
    erarr: "⥱",
    erDot: "≓",
    Escr: "ℰ",
    escr: "ℯ",
    esdot: "≐",
    Esim: "⩳",
    esim: "≂",
    Eta: "Η",
    eta: "η",
    ETH: "Ð",
    eth: "ð",
    Euml: "Ë",
    euml: "ë",
    euro: "€",
    excl: "!",
    exist: "∃",
    Exists: "∃",
    expectation: "ℰ",
    ExponentialE: "ⅇ",
    exponentiale: "ⅇ",
    fallingdotseq: "≒",
    Fcy: "Ф",
    fcy: "ф",
    female: "♀",
    ffilig: "ﬃ",
    fflig: "ﬀ",
    ffllig: "ﬄ",
    Ffr: "𝔉",
    ffr: "𝔣",
    filig: "ﬁ",
    FilledSmallSquare: "◼",
    FilledVerySmallSquare: "▪",
    fjlig: "fj",
    flat: "♭",
    fllig: "ﬂ",
    fltns: "▱",
    fnof: "ƒ",
    Fopf: "𝔽",
    fopf: "𝕗",
    ForAll: "∀",
    forall: "∀",
    fork: "⋔",
    forkv: "⫙",
    Fouriertrf: "ℱ",
    fpartint: "⨍",
    frac12: "½",
    frac13: "⅓",
    frac14: "¼",
    frac15: "⅕",
    frac16: "⅙",
    frac18: "⅛",
    frac23: "⅔",
    frac25: "⅖",
    frac34: "¾",
    frac35: "⅗",
    frac38: "⅜",
    frac45: "⅘",
    frac56: "⅚",
    frac58: "⅝",
    frac78: "⅞",
    frasl: "⁄",
    frown: "⌢",
    Fscr: "ℱ",
    fscr: "𝒻",
    gacute: "ǵ",
    Gamma: "Γ",
    gamma: "γ",
    Gammad: "Ϝ",
    gammad: "ϝ",
    gap: "⪆",
    Gbreve: "Ğ",
    gbreve: "ğ",
    Gcedil: "Ģ",
    Gcirc: "Ĝ",
    gcirc: "ĝ",
    Gcy: "Г",
    gcy: "г",
    Gdot: "Ġ",
    gdot: "ġ",
    gE: "≧",
    ge: "≥",
    gEl: "⪌",
    gel: "⋛",
    geq: "≥",
    geqq: "≧",
    geqslant: "⩾",
    ges: "⩾",
    gescc: "⪩",
    gesdot: "⪀",
    gesdoto: "⪂",
    gesdotol: "⪄",
    gesl: "⋛︀",
    gesles: "⪔",
    Gfr: "𝔊",
    gfr: "𝔤",
    Gg: "⋙",
    gg: "≫",
    ggg: "⋙",
    gimel: "ℷ",
    GJcy: "Ѓ",
    gjcy: "ѓ",
    gl: "≷",
    gla: "⪥",
    glE: "⪒",
    glj: "⪤",
    gnap: "⪊",
    gnapprox: "⪊",
    gnE: "≩",
    gne: "⪈",
    gneq: "⪈",
    gneqq: "≩",
    gnsim: "⋧",
    Gopf: "𝔾",
    gopf: "𝕘",
    grave: "`",
    GreaterEqual: "≥",
    GreaterEqualLess: "⋛",
    GreaterFullEqual: "≧",
    GreaterGreater: "⪢",
    GreaterLess: "≷",
    GreaterSlantEqual: "⩾",
    GreaterTilde: "≳",
    Gscr: "𝒢",
    gscr: "ℊ",
    gsim: "≳",
    gsime: "⪎",
    gsiml: "⪐",
    Gt: "≫",
    GT: ">",
    gt: ">",
    gtcc: "⪧",
    gtcir: "⩺",
    gtdot: "⋗",
    gtlPar: "⦕",
    gtquest: "⩼",
    gtrapprox: "⪆",
    gtrarr: "⥸",
    gtrdot: "⋗",
    gtreqless: "⋛",
    gtreqqless: "⪌",
    gtrless: "≷",
    gtrsim: "≳",
    gvertneqq: "≩︀",
    gvnE: "≩︀",
    Hacek: "ˇ",
    hairsp: " ",
    half: "½",
    hamilt: "ℋ",
    HARDcy: "Ъ",
    hardcy: "ъ",
    hArr: "⇔",
    harr: "↔",
    harrcir: "⥈",
    harrw: "↭",
    Hat: "^",
    hbar: "ℏ",
    Hcirc: "Ĥ",
    hcirc: "ĥ",
    hearts: "♥",
    heartsuit: "♥",
    hellip: "…",
    hercon: "⊹",
    Hfr: "ℌ",
    hfr: "𝔥",
    HilbertSpace: "ℋ",
    hksearow: "⤥",
    hkswarow: "⤦",
    hoarr: "⇿",
    homtht: "∻",
    hookleftarrow: "↩",
    hookrightarrow: "↪",
    Hopf: "ℍ",
    hopf: "𝕙",
    horbar: "―",
    HorizontalLine: "─",
    Hscr: "ℋ",
    hscr: "𝒽",
    hslash: "ℏ",
    Hstrok: "Ħ",
    hstrok: "ħ",
    HumpDownHump: "≎",
    HumpEqual: "≏",
    hybull: "⁃",
    hyphen: "‐",
    Iacute: "Í",
    iacute: "í",
    ic: "⁣",
    Icirc: "Î",
    icirc: "î",
    Icy: "И",
    icy: "и",
    Idot: "İ",
    IEcy: "Е",
    iecy: "е",
    iexcl: "¡",
    iff: "⇔",
    Ifr: "ℑ",
    ifr: "𝔦",
    Igrave: "Ì",
    igrave: "ì",
    ii: "ⅈ",
    iiiint: "⨌",
    iiint: "∭",
    iinfin: "⧜",
    iiota: "℩",
    IJlig: "Ĳ",
    ijlig: "ĳ",
    Im: "ℑ",
    Imacr: "Ī",
    imacr: "ī",
    image: "ℑ",
    ImaginaryI: "ⅈ",
    imagline: "ℐ",
    imagpart: "ℑ",
    imath: "ı",
    imof: "⊷",
    imped: "Ƶ",
    Implies: "⇒",
    in: "∈",
    incare: "℅",
    infin: "∞",
    infintie: "⧝",
    inodot: "ı",
    Int: "∬",
    int: "∫",
    intcal: "⊺",
    integers: "ℤ",
    Integral: "∫",
    intercal: "⊺",
    Intersection: "⋂",
    intlarhk: "⨗",
    intprod: "⨼",
    InvisibleComma: "⁣",
    InvisibleTimes: "⁢",
    IOcy: "Ё",
    iocy: "ё",
    Iogon: "Į",
    iogon: "į",
    Iopf: "𝕀",
    iopf: "𝕚",
    Iota: "Ι",
    iota: "ι",
    iprod: "⨼",
    iquest: "¿",
    Iscr: "ℐ",
    iscr: "𝒾",
    isin: "∈",
    isindot: "⋵",
    isinE: "⋹",
    isins: "⋴",
    isinsv: "⋳",
    isinv: "∈",
    it: "⁢",
    Itilde: "Ĩ",
    itilde: "ĩ",
    Iukcy: "І",
    iukcy: "і",
    Iuml: "Ï",
    iuml: "ï",
    Jcirc: "Ĵ",
    jcirc: "ĵ",
    Jcy: "Й",
    jcy: "й",
    Jfr: "𝔍",
    jfr: "𝔧",
    jmath: "ȷ",
    Jopf: "𝕁",
    jopf: "𝕛",
    Jscr: "𝒥",
    jscr: "𝒿",
    Jsercy: "Ј",
    jsercy: "ј",
    Jukcy: "Є",
    jukcy: "є",
    Kappa: "Κ",
    kappa: "κ",
    kappav: "ϰ",
    Kcedil: "Ķ",
    kcedil: "ķ",
    Kcy: "К",
    kcy: "к",
    Kfr: "𝔎",
    kfr: "𝔨",
    kgreen: "ĸ",
    KHcy: "Х",
    khcy: "х",
    KJcy: "Ќ",
    kjcy: "ќ",
    Kopf: "𝕂",
    kopf: "𝕜",
    Kscr: "𝒦",
    kscr: "𝓀",
    lAarr: "⇚",
    Lacute: "Ĺ",
    lacute: "ĺ",
    laemptyv: "⦴",
    lagran: "ℒ",
    Lambda: "Λ",
    lambda: "λ",
    Lang: "⟪",
    lang: "⟨",
    langd: "⦑",
    langle: "⟨",
    lap: "⪅",
    Laplacetrf: "ℒ",
    laquo: "«",
    Larr: "↞",
    lArr: "⇐",
    larr: "←",
    larrb: "⇤",
    larrbfs: "⤟",
    larrfs: "⤝",
    larrhk: "↩",
    larrlp: "↫",
    larrpl: "⤹",
    larrsim: "⥳",
    larrtl: "↢",
    lat: "⪫",
    lAtail: "⤛",
    latail: "⤙",
    late: "⪭",
    lates: "⪭︀",
    lBarr: "⤎",
    lbarr: "⤌",
    lbbrk: "❲",
    lbrace: "{",
    lbrack: "[",
    lbrke: "⦋",
    lbrksld: "⦏",
    lbrkslu: "⦍",
    Lcaron: "Ľ",
    lcaron: "ľ",
    Lcedil: "Ļ",
    lcedil: "ļ",
    lceil: "⌈",
    lcub: "{",
    Lcy: "Л",
    lcy: "л",
    ldca: "⤶",
    ldquo: "“",
    ldquor: "„",
    ldrdhar: "⥧",
    ldrushar: "⥋",
    ldsh: "↲",
    lE: "≦",
    le: "≤",
    LeftAngleBracket: "⟨",
    LeftArrow: "←",
    Leftarrow: "⇐",
    leftarrow: "←",
    LeftArrowBar: "⇤",
    LeftArrowRightArrow: "⇆",
    leftarrowtail: "↢",
    LeftCeiling: "⌈",
    LeftDoubleBracket: "⟦",
    LeftDownTeeVector: "⥡",
    LeftDownVector: "⇃",
    LeftDownVectorBar: "⥙",
    LeftFloor: "⌊",
    leftharpoondown: "↽",
    leftharpoonup: "↼",
    leftleftarrows: "⇇",
    LeftRightArrow: "↔",
    Leftrightarrow: "⇔",
    leftrightarrow: "↔",
    leftrightarrows: "⇆",
    leftrightharpoons: "⇋",
    leftrightsquigarrow: "↭",
    LeftRightVector: "⥎",
    LeftTee: "⊣",
    LeftTeeArrow: "↤",
    LeftTeeVector: "⥚",
    leftthreetimes: "⋋",
    LeftTriangle: "⊲",
    LeftTriangleBar: "⧏",
    LeftTriangleEqual: "⊴",
    LeftUpDownVector: "⥑",
    LeftUpTeeVector: "⥠",
    LeftUpVector: "↿",
    LeftUpVectorBar: "⥘",
    LeftVector: "↼",
    LeftVectorBar: "⥒",
    lEg: "⪋",
    leg: "⋚",
    leq: "≤",
    leqq: "≦",
    leqslant: "⩽",
    les: "⩽",
    lescc: "⪨",
    lesdot: "⩿",
    lesdoto: "⪁",
    lesdotor: "⪃",
    lesg: "⋚︀",
    lesges: "⪓",
    lessapprox: "⪅",
    lessdot: "⋖",
    lesseqgtr: "⋚",
    lesseqqgtr: "⪋",
    LessEqualGreater: "⋚",
    LessFullEqual: "≦",
    LessGreater: "≶",
    lessgtr: "≶",
    LessLess: "⪡",
    lesssim: "≲",
    LessSlantEqual: "⩽",
    LessTilde: "≲",
    lfisht: "⥼",
    lfloor: "⌊",
    Lfr: "𝔏",
    lfr: "𝔩",
    lg: "≶",
    lgE: "⪑",
    lHar: "⥢",
    lhard: "↽",
    lharu: "↼",
    lharul: "⥪",
    lhblk: "▄",
    LJcy: "Љ",
    ljcy: "љ",
    Ll: "⋘",
    ll: "≪",
    llarr: "⇇",
    llcorner: "⌞",
    Lleftarrow: "⇚",
    llhard: "⥫",
    lltri: "◺",
    Lmidot: "Ŀ",
    lmidot: "ŀ",
    lmoust: "⎰",
    lmoustache: "⎰",
    lnap: "⪉",
    lnapprox: "⪉",
    lnE: "≨",
    lne: "⪇",
    lneq: "⪇",
    lneqq: "≨",
    lnsim: "⋦",
    loang: "⟬",
    loarr: "⇽",
    lobrk: "⟦",
    LongLeftArrow: "⟵",
    Longleftarrow: "⟸",
    longleftarrow: "⟵",
    LongLeftRightArrow: "⟷",
    Longleftrightarrow: "⟺",
    longleftrightarrow: "⟷",
    longmapsto: "⟼",
    LongRightArrow: "⟶",
    Longrightarrow: "⟹",
    longrightarrow: "⟶",
    looparrowleft: "↫",
    looparrowright: "↬",
    lopar: "⦅",
    Lopf: "𝕃",
    lopf: "𝕝",
    loplus: "⨭",
    lotimes: "⨴",
    lowast: "∗",
    lowbar: "_",
    LowerLeftArrow: "↙",
    LowerRightArrow: "↘",
    loz: "◊",
    lozenge: "◊",
    lozf: "⧫",
    lpar: "(",
    lparlt: "⦓",
    lrarr: "⇆",
    lrcorner: "⌟",
    lrhar: "⇋",
    lrhard: "⥭",
    lrm: "‎",
    lrtri: "⊿",
    lsaquo: "‹",
    Lscr: "ℒ",
    lscr: "𝓁",
    Lsh: "↰",
    lsh: "↰",
    lsim: "≲",
    lsime: "⪍",
    lsimg: "⪏",
    lsqb: "[",
    lsquo: "‘",
    lsquor: "‚",
    Lstrok: "Ł",
    lstrok: "ł",
    Lt: "≪",
    LT: "<",
    lt: "<",
    ltcc: "⪦",
    ltcir: "⩹",
    ltdot: "⋖",
    lthree: "⋋",
    ltimes: "⋉",
    ltlarr: "⥶",
    ltquest: "⩻",
    ltri: "◃",
    ltrie: "⊴",
    ltrif: "◂",
    ltrPar: "⦖",
    lurdshar: "⥊",
    luruhar: "⥦",
    lvertneqq: "≨︀",
    lvnE: "≨︀",
    macr: "¯",
    male: "♂",
    malt: "✠",
    maltese: "✠",
    Map: "⤅",
    map: "↦",
    mapsto: "↦",
    mapstodown: "↧",
    mapstoleft: "↤",
    mapstoup: "↥",
    marker: "▮",
    mcomma: "⨩",
    Mcy: "М",
    mcy: "м",
    mdash: "—",
    mDDot: "∺",
    measuredangle: "∡",
    MediumSpace: " ",
    Mellintrf: "ℳ",
    Mfr: "𝔐",
    mfr: "𝔪",
    mho: "℧",
    micro: "µ",
    mid: "∣",
    midast: "*",
    midcir: "⫰",
    middot: "·",
    minus: "−",
    minusb: "⊟",
    minusd: "∸",
    minusdu: "⨪",
    MinusPlus: "∓",
    mlcp: "⫛",
    mldr: "…",
    mnplus: "∓",
    models: "⊧",
    Mopf: "𝕄",
    mopf: "𝕞",
    mp: "∓",
    Mscr: "ℳ",
    mscr: "𝓂",
    mstpos: "∾",
    Mu: "Μ",
    mu: "μ",
    multimap: "⊸",
    mumap: "⊸",
    nabla: "∇",
    Nacute: "Ń",
    nacute: "ń",
    nang: "∠⃒",
    nap: "≉",
    napE: "⩰̸",
    napid: "≋̸",
    napos: "ŉ",
    napprox: "≉",
    natur: "♮",
    natural: "♮",
    naturals: "ℕ",
    nbsp: " ",
    nbump: "≎̸",
    nbumpe: "≏̸",
    ncap: "⩃",
    Ncaron: "Ň",
    ncaron: "ň",
    Ncedil: "Ņ",
    ncedil: "ņ",
    ncong: "≇",
    ncongdot: "⩭̸",
    ncup: "⩂",
    Ncy: "Н",
    ncy: "н",
    ndash: "–",
    ne: "≠",
    nearhk: "⤤",
    neArr: "⇗",
    nearr: "↗",
    nearrow: "↗",
    nedot: "≐̸",
    NegativeMediumSpace: "​",
    NegativeThickSpace: "​",
    NegativeThinSpace: "​",
    NegativeVeryThinSpace: "​",
    nequiv: "≢",
    nesear: "⤨",
    nesim: "≂̸",
    NestedGreaterGreater: "≫",
    NestedLessLess: "≪",
    NewLine: `
`,
    nexist: "∄",
    nexists: "∄",
    Nfr: "𝔑",
    nfr: "𝔫",
    ngE: "≧̸",
    nge: "≱",
    ngeq: "≱",
    ngeqq: "≧̸",
    ngeqslant: "⩾̸",
    nges: "⩾̸",
    nGg: "⋙̸",
    ngsim: "≵",
    nGt: "≫⃒",
    ngt: "≯",
    ngtr: "≯",
    nGtv: "≫̸",
    nhArr: "⇎",
    nharr: "↮",
    nhpar: "⫲",
    ni: "∋",
    nis: "⋼",
    nisd: "⋺",
    niv: "∋",
    NJcy: "Њ",
    njcy: "њ",
    nlArr: "⇍",
    nlarr: "↚",
    nldr: "‥",
    nlE: "≦̸",
    nle: "≰",
    nLeftarrow: "⇍",
    nleftarrow: "↚",
    nLeftrightarrow: "⇎",
    nleftrightarrow: "↮",
    nleq: "≰",
    nleqq: "≦̸",
    nleqslant: "⩽̸",
    nles: "⩽̸",
    nless: "≮",
    nLl: "⋘̸",
    nlsim: "≴",
    nLt: "≪⃒",
    nlt: "≮",
    nltri: "⋪",
    nltrie: "⋬",
    nLtv: "≪̸",
    nmid: "∤",
    NoBreak: "⁠",
    NonBreakingSpace: " ",
    Nopf: "ℕ",
    nopf: "𝕟",
    Not: "⫬",
    not: "¬",
    NotCongruent: "≢",
    NotCupCap: "≭",
    NotDoubleVerticalBar: "∦",
    NotElement: "∉",
    NotEqual: "≠",
    NotEqualTilde: "≂̸",
    NotExists: "∄",
    NotGreater: "≯",
    NotGreaterEqual: "≱",
    NotGreaterFullEqual: "≧̸",
    NotGreaterGreater: "≫̸",
    NotGreaterLess: "≹",
    NotGreaterSlantEqual: "⩾̸",
    NotGreaterTilde: "≵",
    NotHumpDownHump: "≎̸",
    NotHumpEqual: "≏̸",
    notin: "∉",
    notindot: "⋵̸",
    notinE: "⋹̸",
    notinva: "∉",
    notinvb: "⋷",
    notinvc: "⋶",
    NotLeftTriangle: "⋪",
    NotLeftTriangleBar: "⧏̸",
    NotLeftTriangleEqual: "⋬",
    NotLess: "≮",
    NotLessEqual: "≰",
    NotLessGreater: "≸",
    NotLessLess: "≪̸",
    NotLessSlantEqual: "⩽̸",
    NotLessTilde: "≴",
    NotNestedGreaterGreater: "⪢̸",
    NotNestedLessLess: "⪡̸",
    notni: "∌",
    notniva: "∌",
    notnivb: "⋾",
    notnivc: "⋽",
    NotPrecedes: "⊀",
    NotPrecedesEqual: "⪯̸",
    NotPrecedesSlantEqual: "⋠",
    NotReverseElement: "∌",
    NotRightTriangle: "⋫",
    NotRightTriangleBar: "⧐̸",
    NotRightTriangleEqual: "⋭",
    NotSquareSubset: "⊏̸",
    NotSquareSubsetEqual: "⋢",
    NotSquareSuperset: "⊐̸",
    NotSquareSupersetEqual: "⋣",
    NotSubset: "⊂⃒",
    NotSubsetEqual: "⊈",
    NotSucceeds: "⊁",
    NotSucceedsEqual: "⪰̸",
    NotSucceedsSlantEqual: "⋡",
    NotSucceedsTilde: "≿̸",
    NotSuperset: "⊃⃒",
    NotSupersetEqual: "⊉",
    NotTilde: "≁",
    NotTildeEqual: "≄",
    NotTildeFullEqual: "≇",
    NotTildeTilde: "≉",
    NotVerticalBar: "∤",
    npar: "∦",
    nparallel: "∦",
    nparsl: "⫽⃥",
    npart: "∂̸",
    npolint: "⨔",
    npr: "⊀",
    nprcue: "⋠",
    npre: "⪯̸",
    nprec: "⊀",
    npreceq: "⪯̸",
    nrArr: "⇏",
    nrarr: "↛",
    nrarrc: "⤳̸",
    nrarrw: "↝̸",
    nRightarrow: "⇏",
    nrightarrow: "↛",
    nrtri: "⋫",
    nrtrie: "⋭",
    nsc: "⊁",
    nsccue: "⋡",
    nsce: "⪰̸",
    Nscr: "𝒩",
    nscr: "𝓃",
    nshortmid: "∤",
    nshortparallel: "∦",
    nsim: "≁",
    nsime: "≄",
    nsimeq: "≄",
    nsmid: "∤",
    nspar: "∦",
    nsqsube: "⋢",
    nsqsupe: "⋣",
    nsub: "⊄",
    nsubE: "⫅̸",
    nsube: "⊈",
    nsubset: "⊂⃒",
    nsubseteq: "⊈",
    nsubseteqq: "⫅̸",
    nsucc: "⊁",
    nsucceq: "⪰̸",
    nsup: "⊅",
    nsupE: "⫆̸",
    nsupe: "⊉",
    nsupset: "⊃⃒",
    nsupseteq: "⊉",
    nsupseteqq: "⫆̸",
    ntgl: "≹",
    Ntilde: "Ñ",
    ntilde: "ñ",
    ntlg: "≸",
    ntriangleleft: "⋪",
    ntrianglelefteq: "⋬",
    ntriangleright: "⋫",
    ntrianglerighteq: "⋭",
    Nu: "Ν",
    nu: "ν",
    num: "#",
    numero: "№",
    numsp: " ",
    nvap: "≍⃒",
    nVDash: "⊯",
    nVdash: "⊮",
    nvDash: "⊭",
    nvdash: "⊬",
    nvge: "≥⃒",
    nvgt: ">⃒",
    nvHarr: "⤄",
    nvinfin: "⧞",
    nvlArr: "⤂",
    nvle: "≤⃒",
    nvlt: "<⃒",
    nvltrie: "⊴⃒",
    nvrArr: "⤃",
    nvrtrie: "⊵⃒",
    nvsim: "∼⃒",
    nwarhk: "⤣",
    nwArr: "⇖",
    nwarr: "↖",
    nwarrow: "↖",
    nwnear: "⤧",
    Oacute: "Ó",
    oacute: "ó",
    oast: "⊛",
    ocir: "⊚",
    Ocirc: "Ô",
    ocirc: "ô",
    Ocy: "О",
    ocy: "о",
    odash: "⊝",
    Odblac: "Ő",
    odblac: "ő",
    odiv: "⨸",
    odot: "⊙",
    odsold: "⦼",
    OElig: "Œ",
    oelig: "œ",
    ofcir: "⦿",
    Ofr: "𝔒",
    ofr: "𝔬",
    ogon: "˛",
    Ograve: "Ò",
    ograve: "ò",
    ogt: "⧁",
    ohbar: "⦵",
    ohm: "Ω",
    oint: "∮",
    olarr: "↺",
    olcir: "⦾",
    olcross: "⦻",
    oline: "‾",
    olt: "⧀",
    Omacr: "Ō",
    omacr: "ō",
    Omega: "Ω",
    omega: "ω",
    Omicron: "Ο",
    omicron: "ο",
    omid: "⦶",
    ominus: "⊖",
    Oopf: "𝕆",
    oopf: "𝕠",
    opar: "⦷",
    OpenCurlyDoubleQuote: "“",
    OpenCurlyQuote: "‘",
    operp: "⦹",
    oplus: "⊕",
    Or: "⩔",
    or: "∨",
    orarr: "↻",
    ord: "⩝",
    order: "ℴ",
    orderof: "ℴ",
    ordf: "ª",
    ordm: "º",
    origof: "⊶",
    oror: "⩖",
    orslope: "⩗",
    orv: "⩛",
    oS: "Ⓢ",
    Oscr: "𝒪",
    oscr: "ℴ",
    Oslash: "Ø",
    oslash: "ø",
    osol: "⊘",
    Otilde: "Õ",
    otilde: "õ",
    Otimes: "⨷",
    otimes: "⊗",
    otimesas: "⨶",
    Ouml: "Ö",
    ouml: "ö",
    ovbar: "⌽",
    OverBar: "‾",
    OverBrace: "⏞",
    OverBracket: "⎴",
    OverParenthesis: "⏜",
    par: "∥",
    para: "¶",
    parallel: "∥",
    parsim: "⫳",
    parsl: "⫽",
    part: "∂",
    PartialD: "∂",
    Pcy: "П",
    pcy: "п",
    percnt: "%",
    period: ".",
    permil: "‰",
    perp: "⊥",
    pertenk: "‱",
    Pfr: "𝔓",
    pfr: "𝔭",
    Phi: "Φ",
    phi: "φ",
    phiv: "ϕ",
    phmmat: "ℳ",
    phone: "☎",
    Pi: "Π",
    pi: "π",
    pitchfork: "⋔",
    piv: "ϖ",
    planck: "ℏ",
    planckh: "ℎ",
    plankv: "ℏ",
    plus: "+",
    plusacir: "⨣",
    plusb: "⊞",
    pluscir: "⨢",
    plusdo: "∔",
    plusdu: "⨥",
    pluse: "⩲",
    PlusMinus: "±",
    plusmn: "±",
    plussim: "⨦",
    plustwo: "⨧",
    pm: "±",
    Poincareplane: "ℌ",
    pointint: "⨕",
    Popf: "ℙ",
    popf: "𝕡",
    pound: "£",
    Pr: "⪻",
    pr: "≺",
    prap: "⪷",
    prcue: "≼",
    prE: "⪳",
    pre: "⪯",
    prec: "≺",
    precapprox: "⪷",
    preccurlyeq: "≼",
    Precedes: "≺",
    PrecedesEqual: "⪯",
    PrecedesSlantEqual: "≼",
    PrecedesTilde: "≾",
    preceq: "⪯",
    precnapprox: "⪹",
    precneqq: "⪵",
    precnsim: "⋨",
    precsim: "≾",
    Prime: "″",
    prime: "′",
    primes: "ℙ",
    prnap: "⪹",
    prnE: "⪵",
    prnsim: "⋨",
    prod: "∏",
    Product: "∏",
    profalar: "⌮",
    profline: "⌒",
    profsurf: "⌓",
    prop: "∝",
    Proportion: "∷",
    Proportional: "∝",
    propto: "∝",
    prsim: "≾",
    prurel: "⊰",
    Pscr: "𝒫",
    pscr: "𝓅",
    Psi: "Ψ",
    psi: "ψ",
    puncsp: " ",
    Qfr: "𝔔",
    qfr: "𝔮",
    qint: "⨌",
    Qopf: "ℚ",
    qopf: "𝕢",
    qprime: "⁗",
    Qscr: "𝒬",
    qscr: "𝓆",
    quaternions: "ℍ",
    quatint: "⨖",
    quest: "?",
    questeq: "≟",
    QUOT: '"',
    quot: '"',
    rAarr: "⇛",
    race: "∽̱",
    Racute: "Ŕ",
    racute: "ŕ",
    radic: "√",
    raemptyv: "⦳",
    Rang: "⟫",
    rang: "⟩",
    rangd: "⦒",
    range: "⦥",
    rangle: "⟩",
    raquo: "»",
    Rarr: "↠",
    rArr: "⇒",
    rarr: "→",
    rarrap: "⥵",
    rarrb: "⇥",
    rarrbfs: "⤠",
    rarrc: "⤳",
    rarrfs: "⤞",
    rarrhk: "↪",
    rarrlp: "↬",
    rarrpl: "⥅",
    rarrsim: "⥴",
    Rarrtl: "⤖",
    rarrtl: "↣",
    rarrw: "↝",
    rAtail: "⤜",
    ratail: "⤚",
    ratio: "∶",
    rationals: "ℚ",
    RBarr: "⤐",
    rBarr: "⤏",
    rbarr: "⤍",
    rbbrk: "❳",
    rbrace: "}",
    rbrack: "]",
    rbrke: "⦌",
    rbrksld: "⦎",
    rbrkslu: "⦐",
    Rcaron: "Ř",
    rcaron: "ř",
    Rcedil: "Ŗ",
    rcedil: "ŗ",
    rceil: "⌉",
    rcub: "}",
    Rcy: "Р",
    rcy: "р",
    rdca: "⤷",
    rdldhar: "⥩",
    rdquo: "”",
    rdquor: "”",
    rdsh: "↳",
    Re: "ℜ",
    real: "ℜ",
    realine: "ℛ",
    realpart: "ℜ",
    reals: "ℝ",
    rect: "▭",
    REG: "®",
    reg: "®",
    ReverseElement: "∋",
    ReverseEquilibrium: "⇋",
    ReverseUpEquilibrium: "⥯",
    rfisht: "⥽",
    rfloor: "⌋",
    Rfr: "ℜ",
    rfr: "𝔯",
    rHar: "⥤",
    rhard: "⇁",
    rharu: "⇀",
    rharul: "⥬",
    Rho: "Ρ",
    rho: "ρ",
    rhov: "ϱ",
    RightAngleBracket: "⟩",
    RightArrow: "→",
    Rightarrow: "⇒",
    rightarrow: "→",
    RightArrowBar: "⇥",
    RightArrowLeftArrow: "⇄",
    rightarrowtail: "↣",
    RightCeiling: "⌉",
    RightDoubleBracket: "⟧",
    RightDownTeeVector: "⥝",
    RightDownVector: "⇂",
    RightDownVectorBar: "⥕",
    RightFloor: "⌋",
    rightharpoondown: "⇁",
    rightharpoonup: "⇀",
    rightleftarrows: "⇄",
    rightleftharpoons: "⇌",
    rightrightarrows: "⇉",
    rightsquigarrow: "↝",
    RightTee: "⊢",
    RightTeeArrow: "↦",
    RightTeeVector: "⥛",
    rightthreetimes: "⋌",
    RightTriangle: "⊳",
    RightTriangleBar: "⧐",
    RightTriangleEqual: "⊵",
    RightUpDownVector: "⥏",
    RightUpTeeVector: "⥜",
    RightUpVector: "↾",
    RightUpVectorBar: "⥔",
    RightVector: "⇀",
    RightVectorBar: "⥓",
    ring: "˚",
    risingdotseq: "≓",
    rlarr: "⇄",
    rlhar: "⇌",
    rlm: "‏",
    rmoust: "⎱",
    rmoustache: "⎱",
    rnmid: "⫮",
    roang: "⟭",
    roarr: "⇾",
    robrk: "⟧",
    ropar: "⦆",
    Ropf: "ℝ",
    ropf: "𝕣",
    roplus: "⨮",
    rotimes: "⨵",
    RoundImplies: "⥰",
    rpar: ")",
    rpargt: "⦔",
    rppolint: "⨒",
    rrarr: "⇉",
    Rrightarrow: "⇛",
    rsaquo: "›",
    Rscr: "ℛ",
    rscr: "𝓇",
    Rsh: "↱",
    rsh: "↱",
    rsqb: "]",
    rsquo: "’",
    rsquor: "’",
    rthree: "⋌",
    rtimes: "⋊",
    rtri: "▹",
    rtrie: "⊵",
    rtrif: "▸",
    rtriltri: "⧎",
    RuleDelayed: "⧴",
    ruluhar: "⥨",
    rx: "℞",
    Sacute: "Ś",
    sacute: "ś",
    sbquo: "‚",
    Sc: "⪼",
    sc: "≻",
    scap: "⪸",
    Scaron: "Š",
    scaron: "š",
    sccue: "≽",
    scE: "⪴",
    sce: "⪰",
    Scedil: "Ş",
    scedil: "ş",
    Scirc: "Ŝ",
    scirc: "ŝ",
    scnap: "⪺",
    scnE: "⪶",
    scnsim: "⋩",
    scpolint: "⨓",
    scsim: "≿",
    Scy: "С",
    scy: "с",
    sdot: "⋅",
    sdotb: "⊡",
    sdote: "⩦",
    searhk: "⤥",
    seArr: "⇘",
    searr: "↘",
    searrow: "↘",
    sect: "§",
    semi: ";",
    seswar: "⤩",
    setminus: "∖",
    setmn: "∖",
    sext: "✶",
    Sfr: "𝔖",
    sfr: "𝔰",
    sfrown: "⌢",
    sharp: "♯",
    SHCHcy: "Щ",
    shchcy: "щ",
    SHcy: "Ш",
    shcy: "ш",
    ShortDownArrow: "↓",
    ShortLeftArrow: "←",
    shortmid: "∣",
    shortparallel: "∥",
    ShortRightArrow: "→",
    ShortUpArrow: "↑",
    shy: "­",
    Sigma: "Σ",
    sigma: "σ",
    sigmaf: "ς",
    sigmav: "ς",
    sim: "∼",
    simdot: "⩪",
    sime: "≃",
    simeq: "≃",
    simg: "⪞",
    simgE: "⪠",
    siml: "⪝",
    simlE: "⪟",
    simne: "≆",
    simplus: "⨤",
    simrarr: "⥲",
    slarr: "←",
    SmallCircle: "∘",
    smallsetminus: "∖",
    smashp: "⨳",
    smeparsl: "⧤",
    smid: "∣",
    smile: "⌣",
    smt: "⪪",
    smte: "⪬",
    smtes: "⪬︀",
    SOFTcy: "Ь",
    softcy: "ь",
    sol: "/",
    solb: "⧄",
    solbar: "⌿",
    Sopf: "𝕊",
    sopf: "𝕤",
    spades: "♠",
    spadesuit: "♠",
    spar: "∥",
    sqcap: "⊓",
    sqcaps: "⊓︀",
    sqcup: "⊔",
    sqcups: "⊔︀",
    Sqrt: "√",
    sqsub: "⊏",
    sqsube: "⊑",
    sqsubset: "⊏",
    sqsubseteq: "⊑",
    sqsup: "⊐",
    sqsupe: "⊒",
    sqsupset: "⊐",
    sqsupseteq: "⊒",
    squ: "□",
    Square: "□",
    square: "□",
    SquareIntersection: "⊓",
    SquareSubset: "⊏",
    SquareSubsetEqual: "⊑",
    SquareSuperset: "⊐",
    SquareSupersetEqual: "⊒",
    SquareUnion: "⊔",
    squarf: "▪",
    squf: "▪",
    srarr: "→",
    Sscr: "𝒮",
    sscr: "𝓈",
    ssetmn: "∖",
    ssmile: "⌣",
    sstarf: "⋆",
    Star: "⋆",
    star: "☆",
    starf: "★",
    straightepsilon: "ϵ",
    straightphi: "ϕ",
    strns: "¯",
    Sub: "⋐",
    sub: "⊂",
    subdot: "⪽",
    subE: "⫅",
    sube: "⊆",
    subedot: "⫃",
    submult: "⫁",
    subnE: "⫋",
    subne: "⊊",
    subplus: "⪿",
    subrarr: "⥹",
    Subset: "⋐",
    subset: "⊂",
    subseteq: "⊆",
    subseteqq: "⫅",
    SubsetEqual: "⊆",
    subsetneq: "⊊",
    subsetneqq: "⫋",
    subsim: "⫇",
    subsub: "⫕",
    subsup: "⫓",
    succ: "≻",
    succapprox: "⪸",
    succcurlyeq: "≽",
    Succeeds: "≻",
    SucceedsEqual: "⪰",
    SucceedsSlantEqual: "≽",
    SucceedsTilde: "≿",
    succeq: "⪰",
    succnapprox: "⪺",
    succneqq: "⪶",
    succnsim: "⋩",
    succsim: "≿",
    SuchThat: "∋",
    Sum: "∑",
    sum: "∑",
    sung: "♪",
    Sup: "⋑",
    sup: "⊃",
    sup1: "¹",
    sup2: "²",
    sup3: "³",
    supdot: "⪾",
    supdsub: "⫘",
    supE: "⫆",
    supe: "⊇",
    supedot: "⫄",
    Superset: "⊃",
    SupersetEqual: "⊇",
    suphsol: "⟉",
    suphsub: "⫗",
    suplarr: "⥻",
    supmult: "⫂",
    supnE: "⫌",
    supne: "⊋",
    supplus: "⫀",
    Supset: "⋑",
    supset: "⊃",
    supseteq: "⊇",
    supseteqq: "⫆",
    supsetneq: "⊋",
    supsetneqq: "⫌",
    supsim: "⫈",
    supsub: "⫔",
    supsup: "⫖",
    swarhk: "⤦",
    swArr: "⇙",
    swarr: "↙",
    swarrow: "↙",
    swnwar: "⤪",
    szlig: "ß",
    Tab: "	",
    target: "⌖",
    Tau: "Τ",
    tau: "τ",
    tbrk: "⎴",
    Tcaron: "Ť",
    tcaron: "ť",
    Tcedil: "Ţ",
    tcedil: "ţ",
    Tcy: "Т",
    tcy: "т",
    tdot: "⃛",
    telrec: "⌕",
    Tfr: "𝔗",
    tfr: "𝔱",
    there4: "∴",
    Therefore: "∴",
    therefore: "∴",
    Theta: "Θ",
    theta: "θ",
    thetasym: "ϑ",
    thetav: "ϑ",
    thickapprox: "≈",
    thicksim: "∼",
    ThickSpace: "  ",
    thinsp: " ",
    ThinSpace: " ",
    thkap: "≈",
    thksim: "∼",
    THORN: "Þ",
    thorn: "þ",
    Tilde: "∼",
    tilde: "˜",
    TildeEqual: "≃",
    TildeFullEqual: "≅",
    TildeTilde: "≈",
    times: "×",
    timesb: "⊠",
    timesbar: "⨱",
    timesd: "⨰",
    tint: "∭",
    toea: "⤨",
    top: "⊤",
    topbot: "⌶",
    topcir: "⫱",
    Topf: "𝕋",
    topf: "𝕥",
    topfork: "⫚",
    tosa: "⤩",
    tprime: "‴",
    TRADE: "™",
    trade: "™",
    triangle: "▵",
    triangledown: "▿",
    triangleleft: "◃",
    trianglelefteq: "⊴",
    triangleq: "≜",
    triangleright: "▹",
    trianglerighteq: "⊵",
    tridot: "◬",
    trie: "≜",
    triminus: "⨺",
    TripleDot: "⃛",
    triplus: "⨹",
    trisb: "⧍",
    tritime: "⨻",
    trpezium: "⏢",
    Tscr: "𝒯",
    tscr: "𝓉",
    TScy: "Ц",
    tscy: "ц",
    TSHcy: "Ћ",
    tshcy: "ћ",
    Tstrok: "Ŧ",
    tstrok: "ŧ",
    twixt: "≬",
    twoheadleftarrow: "↞",
    twoheadrightarrow: "↠",
    Uacute: "Ú",
    uacute: "ú",
    Uarr: "↟",
    uArr: "⇑",
    uarr: "↑",
    Uarrocir: "⥉",
    Ubrcy: "Ў",
    ubrcy: "ў",
    Ubreve: "Ŭ",
    ubreve: "ŭ",
    Ucirc: "Û",
    ucirc: "û",
    Ucy: "У",
    ucy: "у",
    udarr: "⇅",
    Udblac: "Ű",
    udblac: "ű",
    udhar: "⥮",
    ufisht: "⥾",
    Ufr: "𝔘",
    ufr: "𝔲",
    Ugrave: "Ù",
    ugrave: "ù",
    uHar: "⥣",
    uharl: "↿",
    uharr: "↾",
    uhblk: "▀",
    ulcorn: "⌜",
    ulcorner: "⌜",
    ulcrop: "⌏",
    ultri: "◸",
    Umacr: "Ū",
    umacr: "ū",
    uml: "¨",
    UnderBar: "_",
    UnderBrace: "⏟",
    UnderBracket: "⎵",
    UnderParenthesis: "⏝",
    Union: "⋃",
    UnionPlus: "⊎",
    Uogon: "Ų",
    uogon: "ų",
    Uopf: "𝕌",
    uopf: "𝕦",
    UpArrow: "↑",
    Uparrow: "⇑",
    uparrow: "↑",
    UpArrowBar: "⤒",
    UpArrowDownArrow: "⇅",
    UpDownArrow: "↕",
    Updownarrow: "⇕",
    updownarrow: "↕",
    UpEquilibrium: "⥮",
    upharpoonleft: "↿",
    upharpoonright: "↾",
    uplus: "⊎",
    UpperLeftArrow: "↖",
    UpperRightArrow: "↗",
    Upsi: "ϒ",
    upsi: "υ",
    upsih: "ϒ",
    Upsilon: "Υ",
    upsilon: "υ",
    UpTee: "⊥",
    UpTeeArrow: "↥",
    upuparrows: "⇈",
    urcorn: "⌝",
    urcorner: "⌝",
    urcrop: "⌎",
    Uring: "Ů",
    uring: "ů",
    urtri: "◹",
    Uscr: "𝒰",
    uscr: "𝓊",
    utdot: "⋰",
    Utilde: "Ũ",
    utilde: "ũ",
    utri: "▵",
    utrif: "▴",
    uuarr: "⇈",
    Uuml: "Ü",
    uuml: "ü",
    uwangle: "⦧",
    vangrt: "⦜",
    varepsilon: "ϵ",
    varkappa: "ϰ",
    varnothing: "∅",
    varphi: "ϕ",
    varpi: "ϖ",
    varpropto: "∝",
    vArr: "⇕",
    varr: "↕",
    varrho: "ϱ",
    varsigma: "ς",
    varsubsetneq: "⊊︀",
    varsubsetneqq: "⫋︀",
    varsupsetneq: "⊋︀",
    varsupsetneqq: "⫌︀",
    vartheta: "ϑ",
    vartriangleleft: "⊲",
    vartriangleright: "⊳",
    Vbar: "⫫",
    vBar: "⫨",
    vBarv: "⫩",
    Vcy: "В",
    vcy: "в",
    VDash: "⊫",
    Vdash: "⊩",
    vDash: "⊨",
    vdash: "⊢",
    Vdashl: "⫦",
    Vee: "⋁",
    vee: "∨",
    veebar: "⊻",
    veeeq: "≚",
    vellip: "⋮",
    Verbar: "‖",
    verbar: "|",
    Vert: "‖",
    vert: "|",
    VerticalBar: "∣",
    VerticalLine: "|",
    VerticalSeparator: "❘",
    VerticalTilde: "≀",
    VeryThinSpace: " ",
    Vfr: "𝔙",
    vfr: "𝔳",
    vltri: "⊲",
    vnsub: "⊂⃒",
    vnsup: "⊃⃒",
    Vopf: "𝕍",
    vopf: "𝕧",
    vprop: "∝",
    vrtri: "⊳",
    Vscr: "𝒱",
    vscr: "𝓋",
    vsubnE: "⫋︀",
    vsubne: "⊊︀",
    vsupnE: "⫌︀",
    vsupne: "⊋︀",
    Vvdash: "⊪",
    vzigzag: "⦚",
    Wcirc: "Ŵ",
    wcirc: "ŵ",
    wedbar: "⩟",
    Wedge: "⋀",
    wedge: "∧",
    wedgeq: "≙",
    weierp: "℘",
    Wfr: "𝔚",
    wfr: "𝔴",
    Wopf: "𝕎",
    wopf: "𝕨",
    wp: "℘",
    wr: "≀",
    wreath: "≀",
    Wscr: "𝒲",
    wscr: "𝓌",
    xcap: "⋂",
    xcirc: "◯",
    xcup: "⋃",
    xdtri: "▽",
    Xfr: "𝔛",
    xfr: "𝔵",
    xhArr: "⟺",
    xharr: "⟷",
    Xi: "Ξ",
    xi: "ξ",
    xlArr: "⟸",
    xlarr: "⟵",
    xmap: "⟼",
    xnis: "⋻",
    xodot: "⨀",
    Xopf: "𝕏",
    xopf: "𝕩",
    xoplus: "⨁",
    xotime: "⨂",
    xrArr: "⟹",
    xrarr: "⟶",
    Xscr: "𝒳",
    xscr: "𝓍",
    xsqcup: "⨆",
    xuplus: "⨄",
    xutri: "△",
    xvee: "⋁",
    xwedge: "⋀",
    Yacute: "Ý",
    yacute: "ý",
    YAcy: "Я",
    yacy: "я",
    Ycirc: "Ŷ",
    ycirc: "ŷ",
    Ycy: "Ы",
    ycy: "ы",
    yen: "¥",
    Yfr: "𝔜",
    yfr: "𝔶",
    YIcy: "Ї",
    yicy: "ї",
    Yopf: "𝕐",
    yopf: "𝕪",
    Yscr: "𝒴",
    yscr: "𝓎",
    YUcy: "Ю",
    yucy: "ю",
    Yuml: "Ÿ",
    yuml: "ÿ",
    Zacute: "Ź",
    zacute: "ź",
    Zcaron: "Ž",
    zcaron: "ž",
    Zcy: "З",
    zcy: "з",
    Zdot: "Ż",
    zdot: "ż",
    zeetrf: "ℨ",
    ZeroWidthSpace: "​",
    Zeta: "Ζ",
    zeta: "ζ",
    Zfr: "ℨ",
    zfr: "𝔷",
    ZHcy: "Ж",
    zhcy: "ж",
    zigrarr: "⇝",
    Zopf: "ℤ",
    zopf: "𝕫",
    Zscr: "𝒵",
    zscr: "𝓏",
    zwj: "‍",
    zwnj: "‌"
  }), e.entityMap = e.HTML_ENTITIES;
})(ra);
var xt = {}, Fr = Oe, le = fe, ta = sr, Ko = Fr.isHTMLEscapableRawTextElement, Zo = Fr.isHTMLMimeType, Jo = Fr.isHTMLRawTextElement, et = Fr.hasOwn, Un = Fr.NAMESPACE, jn = ta.ParseError, ei = ta.DOMException, jr = 0, nr = 1, wr = 2, Vr = 3, Cr = 4, xr = 5, Xr = 6, pt = 7;
function na() {
}
na.prototype = {
  parse: function(e, r, t) {
    var n = this.domBuilder;
    n.startDocument(), ua(r, r = /* @__PURE__ */ Object.create(null)), ri(e, r, t, n, this.errorHandler), n.endDocument();
  }
};
var Dn = /&#?\w+;?/g;
function ri(e, r, t, n, u) {
  var a = Zo(n.mimeType);
  e.indexOf(le.UNICODE_REPLACEMENT_CHARACTER) >= 0 && u.warning("Unicode replacement character detected, source encoding issues?");
  function i(z) {
    if (z > 65535) {
      z -= 65536;
      var oe = 55296 + (z >> 10), Ae = 56320 + (z & 1023);
      return String.fromCharCode(oe, Ae);
    } else
      return String.fromCharCode(z);
  }
  function f(z) {
    var oe = z[z.length - 1] === ";" ? z : z + ";";
    if (!a && oe !== z)
      return u.error("EntityRef: expecting ;"), z;
    var Ae = le.Reference.exec(oe);
    if (!Ae || Ae[0].length !== oe.length)
      return u.error("entity not matching Reference production: " + z), z;
    var xe = oe.slice(1, -1);
    return et(t, xe) ? t[xe] : xe.charAt(0) === "#" ? i(parseInt(xe.substring(1).replace("x", "0x"))) : (u.error("entity not found:" + z), z);
  }
  function l(z) {
    if (z > m) {
      var oe = e.substring(m, z).replace(Dn, f);
      q && j(m), n.characters(oe, 0, z - m), m = z;
    }
  }
  var y = 0, A = 0, _ = /\r\n?|\n|$/g, q = n.locator;
  function j(z, oe) {
    for (; z >= A && (oe = _.exec(e)); )
      y = A, A = oe.index + oe[0].length, q.lineNumber++;
    q.columnNumber = z - y + 1;
  }
  for (var M = [{ currentNSMap: r }], P = [], m = 0; ; ) {
    try {
      var d = e.indexOf("<", m);
      if (d < 0) {
        if (!a && P.length > 0)
          return u.fatalError("unclosed xml tag(s): " + P.join(", "));
        if (!e.substring(m).match(/^\s*$/)) {
          var x = n.doc, c = x.createTextNode(e.substring(m));
          if (x.documentElement)
            return u.error("Extra content at the end of the document");
          x.appendChild(c), n.currentElement = c;
        }
        return;
      }
      if (d > m) {
        var v = e.substring(m, d);
        !a && P.length === 0 && (v = v.replace(new RegExp(le.S_OPT.source, "g"), ""), v && u.error("Unexpected content outside root element: '" + v + "'")), l(d);
      }
      switch (e.charAt(d + 1)) {
        case "/":
          var X = e.indexOf(">", d + 2), b = e.substring(d + 2, X > 0 ? X : void 0);
          if (!b)
            return u.fatalError("end tag name missing");
          var C = X > 0 && le.reg("^", le.QName_group, le.S_OPT, "$").exec(b);
          if (!C)
            return u.fatalError('end tag name contains invalid characters: "' + b + '"');
          if (!n.currentElement && !n.doc.documentElement)
            return;
          var g = P[P.length - 1] || n.currentElement.tagName || n.doc.documentElement.tagName || "";
          if (g !== C[1]) {
            var o = C[1].toLowerCase();
            if (!a || g.toLowerCase() !== o)
              return u.fatalError('Opening and ending tag mismatch: "' + g + '" != "' + b + '"');
          }
          var p = M.pop();
          P.pop();
          var N = p.localNSMap;
          if (n.endElement(p.uri, p.localName, g), N)
            for (var B in N)
              et(N, B) && n.endPrefixMapping(B);
          X++;
          break;
        case "?":
          q && j(d), X = ai(e, d, n, u);
          break;
        case "!":
          q && j(d), X = oa(e, d, n, u, a);
          break;
        default:
          q && j(d);
          var R = new ia(), K = M[M.length - 1].currentNSMap, X = ti(e, d, R, K, f, u, a), Q = R.length;
          if (R.closed || (a && Fr.isHTMLVoidElement(R.tagName) ? R.closed = !0 : P.push(R.tagName)), q && Q) {
            for (var V = Vn(q, {}), W = 0; W < Q; W++) {
              var ue = R[W];
              j(ue.offset), ue.locator = Vn(q, {});
            }
            n.locator = V, Xn(R, n, K) && M.push(R), n.locator = q;
          } else
            Xn(R, n, K) && M.push(R);
          a && !R.closed ? X = ni(e, X, R.tagName, f, n) : X++;
      }
    } catch (z) {
      if (z instanceof jn)
        throw z;
      if (z instanceof ei)
        throw new jn(z.name + ": " + z.message, n.locator, z);
      u.error("element parse error: " + z), X = -1;
    }
    X > m ? m = X : l(Math.max(d, m) + 1);
  }
}
function Vn(e, r) {
  return r.lineNumber = e.lineNumber, r.columnNumber = e.columnNumber, r;
}
function ti(e, r, t, n, u, a, i) {
  function f(j, M, P) {
    if (et(t.attributeNames, j))
      return a.fatalError("Attribute " + j + " redefined");
    if (!i && M.indexOf("<") >= 0)
      return a.fatalError("Unescaped '<' not allowed in attributes values");
    t.addValue(
      j,
      // @see https://www.w3.org/TR/xml/#AVNormalize
      // since the xmldom sax parser does not "interpret" DTD the following is not implemented:
      // - recursive replacement of (DTD) entity references
      // - trimming and collapsing multiple spaces into a single one for attributes that are not of type CDATA
      M.replace(/[\t\n\r]/g, " ").replace(Dn, u),
      P
    );
  }
  for (var l, y, A = ++r, _ = jr; ; ) {
    var q = e.charAt(A);
    switch (q) {
      case "=":
        if (_ === nr)
          l = e.slice(r, A), _ = Vr;
        else if (_ === wr)
          _ = Vr;
        else
          throw new Error("attribute equal must after attrName");
        break;
      case "'":
      case '"':
        if (_ === Vr || _ === nr)
          if (_ === nr && (a.warning('attribute value must after "="'), l = e.slice(r, A)), r = A + 1, A = e.indexOf(q, r), A > 0)
            y = e.slice(r, A), f(l, y, r - 1), _ = xr;
          else
            throw new Error("attribute value no end '" + q + "' match");
        else if (_ == Cr)
          y = e.slice(r, A), f(l, y, r), a.warning('attribute "' + l + '" missed start quot(' + q + ")!!"), r = A + 1, _ = xr;
        else
          throw new Error('attribute value must after "="');
        break;
      case "/":
        switch (_) {
          case jr:
            t.setTagName(e.slice(r, A));
          case xr:
          case Xr:
          case pt:
            _ = pt, t.closed = !0;
          case Cr:
          case nr:
            break;
          case wr:
            t.closed = !0;
            break;
          default:
            throw new Error("attribute invalid close char('/')");
        }
        break;
      case "":
        return a.error("unexpected end of input"), _ == jr && t.setTagName(e.slice(r, A)), A;
      case ">":
        switch (_) {
          case jr:
            t.setTagName(e.slice(r, A));
          case xr:
          case Xr:
          case pt:
            break;
          case Cr:
          case nr:
            y = e.slice(r, A), y.slice(-1) === "/" && (t.closed = !0, y = y.slice(0, -1));
          case wr:
            _ === wr && (y = l), _ == Cr ? (a.warning('attribute "' + y + '" missed quot(")!'), f(l, y, r)) : (i || a.warning('attribute "' + y + '" missed value!! "' + y + '" instead!!'), f(y, y, r));
            break;
          case Vr:
            if (!i)
              return a.fatalError(`AttValue: ' or " expected`);
        }
        return A;
      case "":
        q = " ";
      default:
        if (q <= " ")
          switch (_) {
            case jr:
              t.setTagName(e.slice(r, A)), _ = Xr;
              break;
            case nr:
              l = e.slice(r, A), _ = wr;
              break;
            case Cr:
              var y = e.slice(r, A);
              a.warning('attribute "' + y + '" missed quot(")!!'), f(l, y, r);
            case xr:
              _ = Xr;
              break;
          }
        else
          switch (_) {
            case wr:
              i || a.warning('attribute "' + l + '" missed value!! "' + l + '" instead2!!'), f(l, l, r), r = A, _ = nr;
              break;
            case xr:
              a.warning('attribute space is required"' + l + '"!!');
            case Xr:
              _ = nr, r = A;
              break;
            case Vr:
              _ = Cr, r = A;
              break;
            case pt:
              throw new Error("elements closed character '/' and '>' must be connected to");
          }
    }
    A++;
  }
}
function Xn(e, r, t) {
  for (var n = e.tagName, u = null, _ = e.length; _--; ) {
    var a = e[_], i = a.qName, f = a.value, q = i.indexOf(":");
    if (q > 0)
      var l = a.prefix = i.slice(0, q), y = i.slice(q + 1), A = l === "xmlns" && y;
    else
      y = i, l = null, A = i === "xmlns" && "";
    a.localName = y, A !== !1 && (u == null && (u = /* @__PURE__ */ Object.create(null), ua(t, t = /* @__PURE__ */ Object.create(null))), t[A] = u[A] = f, a.uri = Un.XMLNS, r.startPrefixMapping(A, f));
  }
  for (var _ = e.length; _--; )
    a = e[_], a.prefix && (a.prefix === "xml" && (a.uri = Un.XML), a.prefix !== "xmlns" && (a.uri = t[a.prefix]));
  var q = n.indexOf(":");
  q > 0 ? (l = e.prefix = n.slice(0, q), y = e.localName = n.slice(q + 1)) : (l = null, y = e.localName = n);
  var j = e.uri = t[l || ""];
  if (r.startElement(j, y, n, e), e.closed) {
    if (r.endElement(j, y, n), u)
      for (l in u)
        et(u, l) && r.endPrefixMapping(l);
  } else
    return e.currentNSMap = t, e.localNSMap = u, !0;
}
function ni(e, r, t, n, u) {
  var a = Ko(t);
  if (a || Jo(t)) {
    var i = e.indexOf("</" + t + ">", r), f = e.substring(r + 1, i);
    return a && (f = f.replace(Dn, n)), u.characters(f, 0, f.length), i;
  }
  return r + 1;
}
function ua(e, r) {
  for (var t in e)
    et(e, t) && (r[t] = e[t]);
}
function aa(e, r) {
  var t = r;
  function n(A) {
    return A = A || 0, e.charAt(t + A);
  }
  function u(A) {
    A = A || 1, t += A;
  }
  function a() {
    for (var A = 0; t < e.length; ) {
      var _ = n();
      if (_ !== " " && _ !== `
` && _ !== "	" && _ !== "\r")
        return A;
      A++, u();
    }
    return -1;
  }
  function i() {
    return e.substring(t);
  }
  function f(A) {
    return e.substring(t, t + A.length) === A;
  }
  function l(A) {
    return e.substring(t, t + A.length).toUpperCase() === A.toUpperCase();
  }
  function y(A) {
    var _ = le.reg("^", A), q = _.exec(i());
    return q ? (u(q[0].length), q[0]) : null;
  }
  return {
    char: n,
    getIndex: function() {
      return t;
    },
    getMatch: y,
    getSource: function() {
      return e;
    },
    skip: u,
    skipBlanks: a,
    substringFromIndex: i,
    substringStartsWith: f,
    substringStartsWithCaseInsensitive: l
  };
}
function ui(e, r) {
  function t(f, l) {
    var y = le.PI.exec(f.substringFromIndex());
    return y ? y[1].toLowerCase() === "xml" ? l.fatalError(
      "xml declaration is only allowed at the start of the document, but found at position " + f.getIndex()
    ) : (f.skip(y[0].length), y[0]) : l.fatalError("processing instruction is not well-formed at position " + f.getIndex());
  }
  var n = e.getSource();
  if (e.char() === "[") {
    e.skip(1);
    for (var u = e.getIndex(); e.getIndex() < n.length; ) {
      if (e.skipBlanks(), e.char() === "]") {
        var a = n.substring(u, e.getIndex());
        return e.skip(1), a;
      }
      var i = null;
      if (e.char() === "<" && e.char(1) === "!")
        switch (e.char(2)) {
          case "E":
            e.char(3) === "L" ? i = e.getMatch(le.elementdecl) : e.char(3) === "N" && (i = e.getMatch(le.EntityDecl));
            break;
          case "A":
            i = e.getMatch(le.AttlistDecl);
            break;
          case "N":
            i = e.getMatch(le.NotationDecl);
            break;
          case "-":
            i = e.getMatch(le.Comment);
            break;
        }
      else if (e.char() === "<" && e.char(1) === "?")
        i = t(e, r);
      else if (e.char() === "%")
        i = e.getMatch(le.PEReference);
      else
        return r.fatalError("Error detected in Markup declaration");
      if (!i)
        return r.fatalError("Error in internal subset at position " + e.getIndex());
    }
    return r.fatalError("doctype internal subset is not well-formed, missing ]");
  }
}
function oa(e, r, t, n, u) {
  var a = aa(e, r);
  switch (u ? a.char(2).toUpperCase() : a.char(2)) {
    case "-":
      var i = a.getMatch(le.Comment);
      return i ? (t.comment(i, le.COMMENT_START.length, i.length - le.COMMENT_START.length - le.COMMENT_END.length), a.getIndex()) : n.fatalError("comment is not well-formed at position " + a.getIndex());
    case "[":
      var f = a.getMatch(le.CDSect);
      return f ? !u && !t.currentElement ? n.fatalError("CDATA outside of element") : (t.startCDATA(), t.characters(f, le.CDATA_START.length, f.length - le.CDATA_START.length - le.CDATA_END.length), t.endCDATA(), a.getIndex()) : n.fatalError("Invalid CDATA starting at position " + r);
    case "D": {
      if (t.doc && t.doc.documentElement)
        return n.fatalError("Doctype not allowed inside or after documentElement at position " + a.getIndex());
      if (u ? !a.substringStartsWithCaseInsensitive(le.DOCTYPE_DECL_START) : !a.substringStartsWith(le.DOCTYPE_DECL_START))
        return n.fatalError("Expected " + le.DOCTYPE_DECL_START + " at position " + a.getIndex());
      if (a.skip(le.DOCTYPE_DECL_START.length), a.skipBlanks() < 1)
        return n.fatalError("Expected whitespace after " + le.DOCTYPE_DECL_START + " at position " + a.getIndex());
      var l = {
        name: void 0,
        publicId: void 0,
        systemId: void 0,
        internalSubset: void 0
      };
      if (l.name = a.getMatch(le.Name), !l.name)
        return n.fatalError("doctype name missing or contains unexpected characters at position " + a.getIndex());
      if (u && l.name.toLowerCase() !== "html" && n.warning("Unexpected DOCTYPE in HTML document at position " + a.getIndex()), a.skipBlanks(), a.substringStartsWith(le.PUBLIC) || a.substringStartsWith(le.SYSTEM)) {
        var y = le.ExternalID_match.exec(a.substringFromIndex());
        if (!y)
          return n.fatalError("doctype external id is not well-formed at position " + a.getIndex());
        y.groups.SystemLiteralOnly !== void 0 ? l.systemId = y.groups.SystemLiteralOnly : (l.systemId = y.groups.SystemLiteral, l.publicId = y.groups.PubidLiteral), a.skip(y[0].length);
      } else if (u && a.substringStartsWithCaseInsensitive(le.SYSTEM)) {
        if (a.skip(le.SYSTEM.length), a.skipBlanks() < 1)
          return n.fatalError("Expected whitespace after " + le.SYSTEM + " at position " + a.getIndex());
        if (l.systemId = a.getMatch(le.ABOUT_LEGACY_COMPAT_SystemLiteral), !l.systemId)
          return n.fatalError(
            "Expected " + le.ABOUT_LEGACY_COMPAT + " in single or double quotes after " + le.SYSTEM + " at position " + a.getIndex()
          );
      }
      return u && l.systemId && !le.ABOUT_LEGACY_COMPAT_SystemLiteral.test(l.systemId) && n.warning("Unexpected doctype.systemId in HTML document at position " + a.getIndex()), u || (a.skipBlanks(), l.internalSubset = ui(a, n)), a.skipBlanks(), a.char() !== ">" ? n.fatalError("doctype not terminated with > at position " + a.getIndex()) : (a.skip(1), t.startDTD(l.name, l.publicId, l.systemId, l.internalSubset), t.endDTD(), a.getIndex());
    }
    default:
      return n.fatalError('Not well-formed XML starting with "<!" at position ' + r);
  }
}
function ai(e, r, t, n) {
  var u = e.substring(r).match(le.PI);
  if (!u)
    return n.fatalError("Invalid processing instruction starting at position " + r);
  if (u[1].toLowerCase() === "xml") {
    if (r > 0)
      return n.fatalError(
        "processing instruction at position " + r + " is an xml declaration which is only at the start of the document"
      );
    if (!le.XMLDecl.test(e.substring(r)))
      return n.fatalError("xml declaration is not well-formed");
  }
  return t.processingInstruction(u[1], u[2]), r + u[0].length;
}
function ia() {
  this.attributeNames = /* @__PURE__ */ Object.create(null);
}
ia.prototype = {
  setTagName: function(e) {
    if (!le.QName_exact.test(e))
      throw new Error("invalid tagName:" + e);
    this.tagName = e;
  },
  addValue: function(e, r, t) {
    if (!le.QName_exact.test(e))
      throw new Error("invalid attribute:" + e);
    this.attributeNames[e] = this.length, this[this.length++] = { qName: e, value: r, offset: t };
  },
  length: 0,
  getLocalName: function(e) {
    return this[e].localName;
  },
  getLocator: function(e) {
    return this[e].locator;
  },
  getQName: function(e) {
    return this[e].qName;
  },
  getURI: function(e) {
    return this[e].uri;
  },
  getValue: function(e) {
    return this[e].value;
  }
  //	,getIndex:function(uri, localName)){
  //		if(localName){
  //
  //		}else{
  //			var qName = uri
  //		}
  //	},
  //	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
  //	getType:function(uri,localName){}
  //	getType:function(i){},
};
xt.XMLReader = na;
xt.parseUtils = aa;
xt.parseDoctypeCommentOrCData = oa;
var mr = Oe, oi = Pe, ii = sr, Gn = ra, si = xt, li = oi.DOMImplementation, ci = mr.hasDefaultHTMLNamespace, fi = mr.isHTMLMimeType, pi = mr.isValidMimeType, sa = mr.MIME_TYPE, Rt = mr.NAMESPACE, Hn = ii.ParseError, hi = si.XMLReader;
function la(e) {
  return e.replace(/\r[\n\u0085]/g, `
`).replace(/[\r\u0085\u2028\u2029]/g, `
`);
}
function ca(e) {
  if (e = e || {}, e.locator === void 0 && (e.locator = !0), this.assign = e.assign || mr.assign, this.domHandler = e.domHandler || St, this.onError = e.onError || e.errorHandler, e.errorHandler && typeof e.errorHandler != "function")
    throw new TypeError("errorHandler object is no longer supported, switch to onError!");
  e.errorHandler && e.errorHandler("warning", "The `errorHandler` option has been deprecated, use `onError` instead!", this), this.normalizeLineEndings = e.normalizeLineEndings || la, this.locator = !!e.locator, this.xmlns = this.assign(/* @__PURE__ */ Object.create(null), e.xmlns);
}
ca.prototype.parseFromString = function(e, r) {
  if (!pi(r))
    throw new TypeError('DOMParser.parseFromString: the provided mimeType "' + r + '" is not valid.');
  var t = this.assign(/* @__PURE__ */ Object.create(null), this.xmlns), n = Gn.XML_ENTITIES, u = t[""] || null;
  ci(r) ? (n = Gn.HTML_ENTITIES, u = Rt.HTML) : r === sa.XML_SVG_IMAGE && (u = Rt.SVG), t[""] = u, t.xml = t.xml || Rt.XML;
  var a = new this.domHandler({
    mimeType: r,
    defaultNamespace: u,
    onError: this.onError
  }), i = this.locator ? {} : void 0;
  this.locator && a.setDocumentLocator(i);
  var f = new hi();
  f.errorHandler = a, f.domBuilder = a;
  var l = !mr.isHTMLMimeType(r);
  return l && typeof e != "string" && f.errorHandler.fatalError("source is not a string"), f.parse(this.normalizeLineEndings(String(e)), t, n), a.doc.documentElement || f.errorHandler.fatalError("missing root element"), a.doc;
};
function St(e) {
  var r = e || {};
  this.mimeType = r.mimeType || sa.XML_APPLICATION, this.defaultNamespace = r.defaultNamespace || null, this.cdata = !1, this.currentElement = void 0, this.doc = void 0, this.locator = void 0, this.onError = r.onError;
}
function Sr(e, r) {
  r.lineNumber = e.lineNumber, r.columnNumber = e.columnNumber;
}
St.prototype = {
  /**
   * Either creates an XML or an HTML document and stores it under `this.doc`.
   * If it is an XML document, `this.defaultNamespace` is used to create it,
   * and it will not contain any `childNodes`.
   * If it is an HTML document, it will be created without any `childNodes`.
   *
   * @see http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
   */
  startDocument: function() {
    var e = new li();
    this.doc = fi(this.mimeType) ? e.createHTMLDocument(!1) : e.createDocument(this.defaultNamespace, "");
  },
  startElement: function(e, r, t, n) {
    var u = this.doc, a = u.createElementNS(e, t || r), i = n.length;
    ht(this, a), this.currentElement = a, this.locator && Sr(this.locator, a);
    for (var f = 0; f < i; f++) {
      var e = n.getURI(f), l = n.getValue(f), t = n.getQName(f), y = u.createAttributeNS(e, t);
      this.locator && Sr(n.getLocator(f), y), y.value = y.nodeValue = l, a.setAttributeNode(y);
    }
  },
  endElement: function(e, r, t) {
    this.currentElement = this.currentElement.parentNode;
  },
  startPrefixMapping: function(e, r) {
  },
  endPrefixMapping: function(e) {
  },
  processingInstruction: function(e, r) {
    var t = this.doc.createProcessingInstruction(e, r);
    this.locator && Sr(this.locator, t), ht(this, t);
  },
  ignorableWhitespace: function(e, r, t) {
  },
  characters: function(e, r, t) {
    if (e = zn.apply(this, arguments), e) {
      if (this.cdata)
        var n = this.doc.createCDATASection(e);
      else
        var n = this.doc.createTextNode(e);
      this.currentElement ? this.currentElement.appendChild(n) : /^\s*$/.test(e) && this.doc.appendChild(n), this.locator && Sr(this.locator, n);
    }
  },
  skippedEntity: function(e) {
  },
  endDocument: function() {
    this.doc.normalize();
  },
  /**
   * Stores the locator to be able to set the `columnNumber` and `lineNumber`
   * on the created DOM nodes.
   *
   * @param {Locator} locator
   */
  setDocumentLocator: function(e) {
    e && (e.lineNumber = 0), this.locator = e;
  },
  //LexicalHandler
  comment: function(e, r, t) {
    e = zn.apply(this, arguments);
    var n = this.doc.createComment(e);
    this.locator && Sr(this.locator, n), ht(this, n);
  },
  startCDATA: function() {
    this.cdata = !0;
  },
  endCDATA: function() {
    this.cdata = !1;
  },
  startDTD: function(e, r, t, n) {
    var u = this.doc.implementation;
    if (u && u.createDocumentType) {
      var a = u.createDocumentType(e, r, t, n);
      this.locator && Sr(this.locator, a), ht(this, a), this.doc.doctype = a;
    }
  },
  reportError: function(e, r) {
    if (typeof this.onError == "function")
      try {
        this.onError(e, r, this);
      } catch (t) {
        throw new Hn("Reporting " + e + ' "' + r + '" caused ' + t, this.locator);
      }
    else
      console.error("[xmldom " + e + "]	" + r, di(this.locator));
  },
  /**
   * @see http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
   */
  warning: function(e) {
    this.reportError("warning", e);
  },
  error: function(e) {
    this.reportError("error", e);
  },
  /**
   * This function reports a fatal error and throws a ParseError.
   *
   * @param {string} message
   * - The message to be used for reporting and throwing the error.
   * @returns {never}
   * This function always throws an error and never returns a value.
   * @throws {ParseError}
   * Always throws a ParseError with the provided message.
   */
  fatalError: function(e) {
    throw this.reportError("fatalError", e), new Hn(e, this.locator);
  }
};
function di(e) {
  if (e)
    return `
@#[line:` + e.lineNumber + ",col:" + e.columnNumber + "]";
}
function zn(e, r, t) {
  return typeof e == "string" ? e.substr(r, t) : e.length >= r + t || r ? new java.lang.String(e, r, t) + "" : e;
}
"endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(
  /\w+/g,
  function(e) {
    St.prototype[e] = function() {
      return null;
    };
  }
);
function ht(e, r) {
  e.currentElement ? e.currentElement.appendChild(r) : e.doc.appendChild(r);
}
function vi(e) {
  if (e === "error") throw "onErrorStopParsing";
}
function gi() {
  throw "onWarningStopParsing";
}
Br.__DOMHandler = St;
Br.DOMParser = ca;
Br.normalizeLineEndings = la;
Br.onErrorStopParsing = vi;
Br.onWarningStopParsing = gi;
var kr = Oe;
me.assign = kr.assign;
me.hasDefaultHTMLNamespace = kr.hasDefaultHTMLNamespace;
me.isHTMLMimeType = kr.isHTMLMimeType;
me.isValidMimeType = kr.isValidMimeType;
me.MIME_TYPE = kr.MIME_TYPE;
me.NAMESPACE = kr.NAMESPACE;
var Nt = sr;
me.DOMException = Nt.DOMException;
me.DOMExceptionName = Nt.DOMExceptionName;
me.ExceptionCode = Nt.ExceptionCode;
me.ParseError = Nt.ParseError;
var Me = Pe;
me.Attr = Me.Attr;
me.CDATASection = Me.CDATASection;
me.CharacterData = Me.CharacterData;
me.Comment = Me.Comment;
me.Document = Me.Document;
me.DocumentFragment = Me.DocumentFragment;
me.DocumentType = Me.DocumentType;
me.DOMImplementation = Me.DOMImplementation;
me.Element = Me.Element;
me.Entity = Me.Entity;
me.EntityReference = Me.EntityReference;
me.LiveNodeList = Me.LiveNodeList;
me.NamedNodeMap = Me.NamedNodeMap;
me.Node = Me.Node;
me.NodeList = Me.NodeList;
me.Notation = Me.Notation;
me.ProcessingInstruction = Me.ProcessingInstruction;
me.Text = Me.Text;
me.XMLSerializer = Me.XMLSerializer;
var Ot = Br;
me.DOMParser = Ot.DOMParser;
me.normalizeLineEndings = Ot.normalizeLineEndings;
me.onErrorStopParsing = Ot.onErrorStopParsing;
me.onWarningStopParsing = Ot.onWarningStopParsing;
function mi(e) {
  return e[e.length - 1];
}
function yi(e) {
  return e[0];
}
var bn = {
  last: mi,
  first: yi
};
function rt(e) {
  "@babel/helpers - typeof";
  return rt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
    return typeof r;
  } : function(r) {
    return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
  }, rt(e);
}
function Yn(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    r && (n = n.filter(function(u) {
      return Object.getOwnPropertyDescriptor(e, u).enumerable;
    })), t.push.apply(t, n);
  }
  return t;
}
function Ei(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = arguments[r] != null ? arguments[r] : {};
    r % 2 ? Yn(Object(t), !0).forEach(function(n) {
      Ti(e, n, t[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : Yn(Object(t)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(t, n));
    });
  }
  return e;
}
function Ti(e, r, t) {
  return (r = Di(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e;
}
function Di(e) {
  var r = bi(e, "string");
  return rt(r) == "symbol" ? r : r + "";
}
function bi(e, r) {
  if (rt(e) != "object" || !e) return e;
  var t = e[Symbol.toPrimitive];
  if (t !== void 0) {
    var n = t.call(e, r);
    if (rt(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (r === "string" ? String : Number)(e);
}
var fa = bn, dt = fa.last, fr = fa.first;
function yr(e) {
  this.name = "GenericError", this.message = e, this.stack = new Error(e).stack;
}
yr.prototype = Error.prototype;
function Fe(e) {
  this.name = "TemplateError", this.message = e, this.stack = new Error(e).stack;
}
Fe.prototype = new yr();
function tt(e) {
  this.name = "RenderingError", this.message = e, this.stack = new Error(e).stack;
}
tt.prototype = new yr();
function Pt(e) {
  this.name = "ScopeParserError", this.message = e, this.stack = new Error(e).stack;
}
Pt.prototype = new yr();
function lr(e) {
  this.name = "InternalError", this.properties = {
    explanation: "InternalError"
  }, this.message = e, this.stack = new Error(e).stack;
}
lr.prototype = new yr();
function An(e) {
  this.name = "APIVersionError", this.properties = {
    explanation: "APIVersionError"
  }, this.message = e, this.stack = new Error(e).stack;
}
An.prototype = new yr();
function Ai(e, r) {
  var t = new An(e);
  throw t.properties = Ei({
    id: "api_version_error"
  }, r), t;
}
function wi(e) {
  var r = new Fe("Multi error");
  throw r.properties = {
    errors: e,
    id: "multi_error",
    explanation: "The template has multiple errors"
  }, r;
}
function Ci(e) {
  var r = new Fe("Unopened tag");
  return r.properties = {
    xtag: dt(e.xtag.split(" ")),
    id: "unopened_tag",
    context: e.xtag,
    offset: e.offset,
    lIndex: e.lIndex,
    explanation: 'The tag beginning with "'.concat(e.xtag.substr(0, 10), '" is unopened')
  }, r;
}
function xi(e) {
  var r = new Fe("Duplicate open tag, expected one open tag");
  return r.properties = {
    xtag: fr(e.xtag.split(" ")),
    id: "duplicate_open_tag",
    context: e.xtag,
    offset: e.offset,
    lIndex: e.lIndex,
    explanation: 'The tag beginning with "'.concat(e.xtag.substr(0, 10), '" has duplicate open tags')
  }, r;
}
function Si(e) {
  var r = new Fe("Duplicate close tag, expected one close tag");
  return r.properties = {
    xtag: fr(e.xtag.split(" ")),
    id: "duplicate_close_tag",
    context: e.xtag,
    offset: e.offset,
    lIndex: e.lIndex,
    explanation: 'The tag ending with "'.concat(e.xtag.substr(0, 10), '" has duplicate close tags')
  }, r;
}
function Ni(e) {
  var r = new Fe("Unclosed tag");
  return r.properties = {
    xtag: fr(e.xtag.split(" ")).substr(1),
    id: "unclosed_tag",
    context: e.xtag,
    offset: e.offset,
    lIndex: e.lIndex,
    explanation: 'The tag beginning with "'.concat(e.xtag.substr(0, 10), '" is unclosed')
  }, r;
}
function Oi(e) {
  var r = new Fe('No tag "'.concat(e.element, '" was found at the ').concat(e.position)), t = e.parsed[e.index];
  throw r.properties = {
    id: "no_xml_tag_found_at_".concat(e.position),
    explanation: 'No tag "'.concat(e.element, '" was found at the ').concat(e.position),
    offset: t.offset,
    part: t,
    parsed: e.parsed,
    index: e.index,
    element: e.element
  }, r;
}
function Pi(e) {
  var r = e.tag, t = e.value, n = e.offset, u = new tt("There are some XML corrupt characters");
  return u.properties = {
    id: "invalid_xml_characters",
    xtag: r,
    value: t,
    offset: n,
    explanation: "There are some corrupt characters for the field ".concat(r)
  }, u;
}
function Ii(e) {
  var r = e.tag, t = e.value, n = e.offset, u = new tt("Non string values are not allowed for rawXML tags");
  return u.properties = {
    id: "invalid_raw_xml_value",
    xtag: r,
    value: t,
    offset: n,
    explanation: "The value of the raw tag : '".concat(r, "' is not a string")
  }, u;
}
function Mi(e) {
  var r = e.part, t = r.value, n = r.offset, u = e.id, a = u === void 0 ? "raw_tag_outerxml_invalid" : u, i = e.message, f = i === void 0 ? "Raw tag not in paragraph" : i, l = e.part, y = e.explanation, A = y === void 0 ? 'The tag "'.concat(t, '" is not inside a paragraph') : y;
  typeof A == "function" && (A = A(l));
  var _ = new Fe(f);
  throw _.properties = {
    id: a,
    explanation: A,
    rootError: e.rootError,
    xtag: t,
    offset: n,
    postparsed: e.postparsed,
    expandTo: e.expandTo,
    index: e.index
  }, _;
}
function Ri(e) {
  var r = new Fe("Raw tag should be the only text in paragraph"), t = e.part.value;
  throw r.properties = {
    id: "raw_xml_tag_should_be_only_text_in_paragraph",
    explanation: 'The raw tag "'.concat(t, '" should be the only text in this paragraph. This means that this tag should not be surrounded by any text or spaces.'),
    xtag: t,
    offset: e.part.offset,
    paragraphParts: e.paragraphParts
  }, r;
}
function Li(e) {
  var r = e.location, t = e.offset, n = e.square, u = r === "start" ? "unclosed" : "unopened", a = r === "start" ? "Unclosed" : "Unopened", i = new Fe("".concat(a, " loop")), f = e.value;
  return i.properties = {
    id: "".concat(u, "_loop"),
    explanation: 'The loop with tag "'.concat(f, '" is ').concat(u),
    xtag: f,
    offset: t
  }, n && (i.properties.square = n), i;
}
function _i(e, r) {
  var t = new Fe("Unbalanced loop tag"), n = r[0].part.value, u = r[1].part.value, a = e[0].part.value, i = e[1].part.value;
  return t.properties = {
    id: "unbalanced_loop_tags",
    explanation: "Unbalanced loop tags {#".concat(n, "}{/").concat(u, "}{#").concat(a, "}{/").concat(i, "}"),
    offset: [r[0].part.offset, e[1].part.offset],
    lastPair: {
      left: r[0].part.value,
      right: r[1].part.value
    },
    pair: {
      left: e[0].part.value,
      right: e[1].part.value
    }
  }, t;
}
function Bi(e) {
  var r = e.tags, t = new Fe("Closing tag does not match opening tag");
  return t.properties = {
    id: "closing_tag_does_not_match_opening_tag",
    explanation: 'The tag "'.concat(r[0].value, '" is closed by the tag "').concat(r[1].value, '"'),
    openingtag: fr(r).value,
    offset: [fr(r).offset, dt(r).offset],
    closingtag: dt(r).value
  }, fr(r).square && (t.properties.square = [fr(r).square, dt(r).square]), t;
}
function Fi(e) {
  var r = e.tag, t = e.rootError, n = e.offset, u = new Pt("Scope parser compilation failed");
  return u.properties = {
    id: "scopeparser_compilation_failed",
    offset: n,
    xtag: r,
    explanation: 'The scope parser for the tag "'.concat(r, '" failed to compile'),
    rootError: t
  }, u;
}
function ki(e) {
  var r = e.tag, t = e.scope, n = e.error, u = e.offset, a = new Pt("Scope parser execution failed");
  return a.properties = {
    id: "scopeparser_execution_failed",
    explanation: "The scope parser for the tag ".concat(r, " failed to execute"),
    scope: t,
    offset: u,
    xtag: r,
    rootError: n
  }, a;
}
function qi(e) {
  var r = e.tag, t = e.offset, n = new Fe('The position of the loop tags "'.concat(r, '" would produce invalid XML'));
  return n.properties = {
    xtag: r,
    id: "loop_position_invalid",
    explanation: 'The tags "'.concat(r, '" are misplaced in the document, for example one of them is in a table and the other one outside the table'),
    offset: t
  }, n;
}
function Ui(e, r) {
  var t = 'Unimplemented tag type "'.concat(e.type, '"');
  e.module && (t += ' "'.concat(e.module, '"'));
  var n = new Fe(t);
  throw n.properties = {
    part: e,
    index: r,
    id: "unimplemented_tag_type"
  }, n;
}
function ji() {
  var e = new lr("Malformed xml");
  throw e.properties = {
    explanation: "The template contains malformed xml",
    id: "malformed_xml"
  }, e;
}
function Vi() {
  var e = new lr("You must run `.compile()` before running `.resolveData()`");
  throw e.properties = {
    id: "resolve_before_compile",
    explanation: "You must run `.compile()` before running `.resolveData()`"
  }, e;
}
function Xi() {
  var e = new lr("You should not call .render on a document that had compilation errors");
  throw e.properties = {
    id: "render_on_invalid_template",
    explanation: "You should not call .render on a document that had compilation errors"
  }, e;
}
function Gi() {
  var e = new lr("You should not call .render twice on the same docxtemplater instance");
  throw e.properties = {
    id: "render_twice",
    explanation: "You should not call .render twice on the same docxtemplater instance"
  }, e;
}
function Hi(e) {
  var r = Object.keys(e.files).slice(0, 10), t = "";
  r.length === 0 ? t = "Empty zip file" : t = "Zip file contains : ".concat(r.join(","));
  var n = new lr("The filetype for this file could not be identified, is this file corrupted ? ".concat(t));
  throw n.properties = {
    id: "filetype_not_identified",
    explanation: "The filetype for this file could not be identified, is this file corrupted ? ".concat(t)
  }, n;
}
function zi(e, r) {
  var t = new Fe("An XML file has invalid xml");
  throw t.properties = {
    id: "file_has_invalid_xml",
    content: e,
    offset: r,
    explanation: "The docx contains invalid XML, it is most likely corrupt"
  }, t;
}
function Yi(e) {
  var r = new lr('The filetype "'.concat(e, '" is not handled by docxtemplater'));
  throw r.properties = {
    id: "filetype_not_handled",
    explanation: 'The file you are trying to generate is of type "'.concat(e, '", but only docx and pptx formats are handled'),
    fileType: e
  }, r;
}
var We = {
  XTError: yr,
  XTTemplateError: Fe,
  XTInternalError: lr,
  XTScopeParserError: Pt,
  XTAPIVersionError: An,
  // Remove this alias in v4
  RenderingError: tt,
  XTRenderingError: tt,
  getClosingTagNotMatchOpeningTag: Bi,
  getLoopPositionProducesInvalidXMLError: qi,
  getScopeCompilationError: Fi,
  getScopeParserExecutionError: ki,
  getUnclosedTagException: Ni,
  getUnopenedTagException: Ci,
  getUnmatchedLoopException: Li,
  getDuplicateCloseTagException: Si,
  getDuplicateOpenTagException: xi,
  getCorruptCharactersException: Pi,
  getInvalidRawXMLValueException: Ii,
  getUnbalancedLoopException: _i,
  throwApiVersionError: Ai,
  throwFileTypeNotHandled: Yi,
  throwFileTypeNotIdentified: Hi,
  throwMalformedXml: ji,
  throwMultiError: wi,
  throwExpandNotFound: Mi,
  throwRawTagShouldBeOnlyTextInParagraph: Ri,
  throwUnimplementedTagType: Ui,
  throwXmlTagNotFound: Oi,
  throwXmlInvalid: zi,
  throwResolveBeforeCompile: Vi,
  throwRenderInvalidTemplate: Xi,
  throwRenderTwice: Gi
};
function Wi(e, r) {
  return Zi(e) || Ki(e, r) || Qi(e, r) || $i();
}
function $i() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Qi(e, r) {
  if (e) {
    if (typeof e == "string") return Wn(e, r);
    var t = {}.toString.call(e).slice(8, -1);
    return t === "Object" && e.constructor && (t = e.constructor.name), t === "Map" || t === "Set" ? Array.from(e) : t === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? Wn(e, r) : void 0;
  }
}
function Wn(e, r) {
  (r == null || r > e.length) && (r = e.length);
  for (var t = 0, n = Array(r); t < r; t++) n[t] = e[t];
  return n;
}
function Ki(e, r) {
  var t = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (t != null) {
    var n, u, a, i, f = [], l = !0, y = !1;
    try {
      if (a = (t = t.call(e)).next, r !== 0) for (; !(l = (n = a.call(t)).done) && (f.push(n.value), f.length !== r); l = !0) ;
    } catch (A) {
      y = !0, u = A;
    } finally {
      try {
        if (!l && t.return != null && (i = t.return(), Object(i) !== i)) return;
      } finally {
        if (y) throw u;
      }
    }
    return f;
  }
}
function Zi(e) {
  if (Array.isArray(e)) return e;
}
var pa = me, Ji = pa.DOMParser, es = pa.XMLSerializer, rs = We, ha = rs.throwXmlTagNotFound, da = bn, ts = da.last, ns = da.first;
function us(e) {
  return /^[ \n\r\t]+$/.test(e);
}
function as(e) {
  return {
    get: function(t) {
      return e === "." ? t : t && t[e];
    }
  };
}
function os(e) {
  for (var r = 0; r < e.length; r++) {
    var t = e[r];
    t.message && console.warn("Warning : " + t.message);
  }
}
var Lt = {};
function is(e, r, t) {
  var n;
  if (Lt[r] ? n = Lt[r] : (n = new RegExp("(<.* ".concat(r, '=")([^"]*)(".*)$')), Lt[r] = n), n.test(e))
    return e.replace(n, "$1".concat(t, "$3"));
  var u = e.lastIndexOf("/>");
  return u === -1 && (u = e.lastIndexOf(">")), e.substr(0, u) + " ".concat(r, '="').concat(t, '"') + e.substr(u);
}
function ss(e, r) {
  var t = e.indexOf(" ".concat(r, '="'));
  if (t === -1)
    return null;
  var n = e.substr(t).search(/["']/) + t, u = e.substr(n + 1).search(/["']/) + n;
  return e.substr(n + 1, u - n);
}
function ls(e, r) {
  return e.indexOf(r, e.length - r.length) !== -1;
}
function cs(e, r) {
  return e.substring(0, r.length) === r;
}
function fs(e) {
  for (var r = [], t = {}, n = [], u = 0, a = e.length; u < a; ++u)
    t[e[u]] ? r.push(e[u]) : (t[e[u]] = !0, n.push(e[u]));
  return r;
}
function ps(e) {
  for (var r = {}, t = [], n = 0, u = e.length; n < u; ++n)
    r[e[n]] || (r[e[n]] = !0, t.push(e[n]));
  return t;
}
function hs(e, r) {
  for (var t = [[]], n = 0; n < e.length; n++) {
    var u = e[n], a = t[t.length - 1], i = r(u);
    i === "start" ? t.push([u]) : i === "end" ? (a.push(u), t.push([])) : a.push(u);
  }
  for (var f = [], l = 0; l < t.length; l++) {
    var y = t[l];
    y.length > 0 && f.push(y);
  }
  return f;
}
function ds() {
  return {
    errorLogging: "json",
    stripInvalidXMLChars: !1,
    paragraphLoop: !1,
    nullGetter: function(r) {
      return r.module ? "" : "undefined";
    },
    xmlFileNames: ["[Content_Types].xml"],
    parser: as,
    warnFn: os,
    linebreaks: !1,
    fileTypeConfig: null,
    delimiters: {
      start: "{",
      end: "}"
    },
    syntax: {
      changeDelimiterPrefix: "="
    }
  };
}
function vs(e) {
  return new es().serializeToString(e).replace(/xmlns(:[a-z0-9]+)?="" ?/g, "");
}
function gs(e) {
  return e.charCodeAt(0) === 65279 && (e = e.substr(1)), new Ji().parseFromString(e, "text/xml");
}
var va = [["&", "&amp;"], ["<", "&lt;"], [">", "&gt;"], ['"', "&quot;"], ["'", "&apos;"]], nt = va.map(function(e) {
  var r = Wi(e, 2), t = r[0], n = r[1];
  return {
    rstart: new RegExp(n, "g"),
    rend: new RegExp(t, "g"),
    start: n,
    end: t
  };
});
function ms(e) {
  for (var r = nt.length - 1; r >= 0; r--) {
    var t = nt[r];
    e = e.replace(t.rstart, t.end);
  }
  return e;
}
function ys(e) {
  var r;
  (r = e) !== null && r !== void 0 && r.toString ? e = e.toString() : e = "";
  for (var t, n = 0, u = nt.length; n < u; n++)
    t = nt[n], e = e.replace(t.rend, t.start);
  return e;
}
function Es(e) {
  for (var r = [], t = 0; t < e.length; t++)
    for (var n = e[t], u = 0; u < n.length; u++) {
      var a = n[u];
      r.push(a);
    }
  return r;
}
function Ts(e, r) {
  if (!r)
    return e;
  for (var t = 0, n = r.length; t < n; t++)
    e.push(r[t]);
  return e;
}
var Ds = new RegExp(" ", "g");
function bs(e) {
  return e.replace(Ds, " ");
}
function As(e, r) {
  for (var t = [], n; (n = e.exec(r)) != null; )
    t.push({
      array: n,
      offset: n.index
    });
  return t;
}
function wn(e, r) {
  return e === "</" + r + ">";
}
function Cn(e, r) {
  return e.indexOf("<" + r) === 0 && [">", " ", "/"].indexOf(e[r.length + 1]) !== -1;
}
function ws(e, r, t) {
  var n = ga(e, r, t);
  if (n !== null)
    return n;
  ha({
    position: "right",
    element: r,
    parsed: e,
    index: t
  });
}
function ga(e, r, t) {
  typeof r == "string" && (r = [r]);
  for (var n = 1, u = t, a = e.length; u < a; u++)
    for (var i = e[u], f = 0, l = r; f < l.length; f++) {
      var y = l[f];
      if (wn(i.value, y) && n--, Cn(i.value, y) && n++, n === 0)
        return u;
    }
  return null;
}
function Cs(e, r, t) {
  var n = ma(e, r, t);
  if (n !== null)
    return n;
  ha({
    position: "left",
    element: r,
    parsed: e,
    index: t
  });
}
function ma(e, r, t) {
  typeof r == "string" && (r = [r]);
  for (var n = 1, u = t; u >= 0; u--)
    for (var a = e[u], i = 0, f = r; i < f.length; i++) {
      var l = f[i];
      if (Cn(a.value, l) && n--, wn(a.value, l) && n++, n === 0)
        return u;
    }
  return null;
}
function xs(e, r) {
  var t = r.type, n = r.tag, u = r.position;
  return t === "tag" && n === e && (u === "start" || u === "selfclosing");
}
function Ss(e, r) {
  var t = r.type, n = r.tag, u = r.position;
  return t === "tag" && n === e && u === "end";
}
function Ns(e) {
  var r = e.type, t = e.tag, n = e.position;
  return ["w:p", "a:p", "text:p"].indexOf(t) !== -1 && r === "tag" && n === "start";
}
function Os(e) {
  var r = e.type, t = e.tag, n = e.position;
  return ["w:p", "a:p", "text:p"].indexOf(t) !== -1 && r === "tag" && n === "end";
}
function Ps(e) {
  var r = e.type, t = e.position, n = e.text;
  return n && r === "tag" && t === "start";
}
function Is(e) {
  var r = e.type, t = e.position, n = e.text;
  return n && r === "tag" && t === "end";
}
function Ms(e) {
  var r = e.type, t = e.position;
  return r === "placeholder" || r === "content" && t === "insidetag";
}
function Rs(e, r) {
  var t = e.module, n = e.type;
  return r instanceof Array || (r = [r]), n === "placeholder" && r.indexOf(t) !== -1;
}
var pn = /[\x00-\x08\x0B\x0C\x0E-\x1F]/g;
function Ls(e) {
  return pn.lastIndex = 0, pn.test(e);
}
function _s(e) {
  return typeof e != "string" && (e = String(e)), e.replace(pn, "");
}
function Bs(e) {
  var r = {};
  for (var t in e) {
    var n = e[t];
    r[n] || (r[n] = []), r[n].push(t);
  }
  return r;
}
function Fs(e, r) {
  return e.map(function(t, n) {
    return {
      item: t,
      index: n
    };
  }).sort(function(t, n) {
    return r(t.item, n.item) || t.index - n.index;
  }).map(function(t) {
    var n = t.item;
    return n;
  });
}
var Re = {
  endsWith: ls,
  startsWith: cs,
  isContent: Ms,
  isParagraphStart: Ns,
  isParagraphEnd: Os,
  isTagStart: xs,
  isTagEnd: Ss,
  isTextStart: Ps,
  isTextEnd: Is,
  isStarting: Cn,
  isEnding: wn,
  isModule: Rs,
  uniq: ps,
  getDuplicates: fs,
  chunkBy: hs,
  last: ts,
  first: ns,
  xml2str: vs,
  str2xml: gs,
  getRightOrNull: ga,
  getRight: ws,
  getLeftOrNull: ma,
  getLeft: Cs,
  pregMatchAll: As,
  convertSpaces: bs,
  charMapRegexes: nt,
  hasCorruptCharacters: Ls,
  removeCorruptCharacters: _s,
  getDefaults: ds,
  wordToUtf8: ms,
  utf8ToWord: ys,
  concatArrays: Es,
  pushArray: Ts,
  invertMap: Bs,
  charMap: va,
  getSingleAttribute: ss,
  setSingleAttribute: is,
  isWhiteSpace: us,
  stableSort: Fs
};
function ks(e, r) {
  return Vs(e) || js(e, r) || Us(e, r) || qs();
}
function qs() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Us(e, r) {
  if (e) {
    if (typeof e == "string") return $n(e, r);
    var t = {}.toString.call(e).slice(8, -1);
    return t === "Object" && e.constructor && (t = e.constructor.name), t === "Map" || t === "Set" ? Array.from(e) : t === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? $n(e, r) : void 0;
  }
}
function $n(e, r) {
  (r == null || r > e.length) && (r = e.length);
  for (var t = 0, n = Array(r); t < r; t++) n[t] = e[t];
  return n;
}
function js(e, r) {
  var t = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (t != null) {
    var n, u, a, i, f = [], l = !0, y = !1;
    try {
      if (a = (t = t.call(e)).next, r !== 0) for (; !(l = (n = a.call(t)).done) && (f.push(n.value), f.length !== r); l = !0) ;
    } catch (A) {
      y = !0, u = A;
    } finally {
      try {
        if (!l && t.return != null && (i = t.return(), Object(i) !== i)) return;
      } finally {
        if (y) throw u;
      }
    }
    return f;
  }
}
function Vs(e) {
  if (Array.isArray(e)) return e;
}
function Be(e) {
  "@babel/helpers - typeof";
  return Be = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
    return typeof r;
  } : function(r) {
    return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
  }, Be(e);
}
function Xs(e, r) {
  if (!(e instanceof r)) throw new TypeError("Cannot call a class as a function");
}
function Gs(e, r) {
  for (var t = 0; t < r.length; t++) {
    var n = r[t];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, zs(n.key), n);
  }
}
function Hs(e, r, t) {
  return t && Gs(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function zs(e) {
  var r = Ys(e, "string");
  return Be(r) == "symbol" ? r : r + "";
}
function Ys(e, r) {
  if (Be(e) != "object" || !e) return e;
  var t = e[Symbol.toPrimitive];
  if (t !== void 0) {
    var n = t.call(e, r);
    if (Be(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var Ws = /* @__PURE__ */ function() {
  function e() {
    Xs(this, e);
  }
  return Hs(e, null, [{
    key: "createSchema",
    value: function(t) {
      var n = {
        validate: t,
        optional: function() {
          return e.createSchema(function(a) {
            return a === void 0 ? {
              success: !0,
              value: a
            } : t(a);
          });
        },
        nullable: function() {
          return e.createSchema(function(a) {
            return a == null ? {
              success: !0,
              value: a
            } : t(a);
          });
        }
      };
      return n;
    }
  }, {
    key: "string",
    value: function() {
      return e.createSchema(function(t) {
        return typeof t != "string" ? {
          success: !1,
          error: "Expected string, received ".concat(Be(t))
        } : {
          success: !0,
          value: t
        };
      });
    }
  }, {
    key: "date",
    value: function() {
      return e.createSchema(function(t) {
        return t instanceof Date ? {
          success: !0,
          value: t
        } : {
          success: !1,
          error: "Expected date, received ".concat(Be(t))
        };
      });
    }
  }, {
    key: "boolean",
    value: function() {
      return e.createSchema(function(t) {
        return typeof t != "boolean" ? {
          success: !1,
          error: "Expected boolean, received ".concat(Be(t))
        } : {
          success: !0,
          value: t
        };
      });
    }
  }, {
    key: "number",
    value: function() {
      return e.createSchema(function(t) {
        return typeof t != "number" ? {
          success: !1,
          error: "Expected number, received ".concat(Be(t))
        } : {
          success: !0,
          value: t
        };
      });
    }
  }, {
    key: "function",
    value: function() {
      return e.createSchema(function(t) {
        return typeof t != "function" ? {
          success: !1,
          error: "Expected function, received ".concat(Be(t))
        } : {
          success: !0,
          value: t
        };
      });
    }
  }, {
    key: "array",
    value: function(t) {
      return e.createSchema(function(n) {
        if (!Array.isArray(n))
          return {
            success: !1,
            error: "Expected array, received ".concat(Be(n))
          };
        for (var u = 0; u < n.length; u++) {
          var a = t.validate(n[u]);
          if (!a.success)
            return {
              success: !1,
              error: "".concat(a.error, " at index ").concat(u)
            };
        }
        return {
          success: !0,
          value: n
        };
      });
    }
  }, {
    key: "any",
    value: function() {
      return e.createSchema(function(t) {
        return {
          success: !0,
          value: t
        };
      });
    }
  }, {
    key: "isRegex",
    value: function() {
      return e.createSchema(function(t) {
        return t instanceof RegExp ? {
          success: !0,
          value: t
        } : {
          success: !1,
          error: "Expected RegExp, received ".concat(Be(t))
        };
      });
    }
  }, {
    key: "union",
    value: function(t) {
      return e.createSchema(function(n) {
        for (var u = 0; u < t.length; u++) {
          var a = t[u], i = a.validate(n);
          if (i.success)
            return i;
        }
        return {
          success: !1,
          error: "Value ".concat(n, " does not match any schema in union")
        };
      });
    }
  }, {
    key: "object",
    value: function(t) {
      var n = e.createSchema(function(u) {
        if (u == null)
          return {
            success: !1,
            error: "Expected object, received ".concat(u)
          };
        if (Be(u) !== "object")
          return {
            success: !1,
            error: "Expected object, received ".concat(Be(u))
          };
        for (var a = 0, i = Object.entries(t); a < i.length; a++) {
          var f = ks(i[a], 2), l = f[0], y = f[1], A = y.validate(u[l]);
          if (!A.success)
            return {
              success: !1,
              error: "".concat(A.error, " at ").concat(l)
            };
        }
        return {
          success: !0,
          value: u
        };
      });
      return n.strict = function() {
        return e.createSchema(function(u) {
          var a = n.validate(u);
          if (!a.success)
            return a;
          var i = Object.keys(u).filter(function(f) {
            return !(f in t);
          });
          return i.length > 0 ? {
            success: !1,
            error: "Unexpected properties: ".concat(i.join(", "))
          } : a;
        });
      }, n;
    }
  }, {
    key: "record",
    value: function(t) {
      return e.createSchema(function(n) {
        if (n === null)
          return {
            success: !1,
            error: "Expected object, received null"
          };
        if (Be(n) !== "object")
          return {
            success: !1,
            error: "Expected object, received ".concat(Be(n))
          };
        for (var u = 0, a = Object.keys(n); u < a.length; u++) {
          var i = a[u];
          if (typeof i != "string")
            return {
              success: !1,
              error: "Expected string key, received ".concat(Be(i), " at ").concat(i)
            };
          var f = t.validate(n[i]);
          if (!f.success)
            return {
              success: !1,
              error: "".concat(f.error, " at key ").concat(i)
            };
        }
        return {
          success: !0,
          value: n
        };
      });
    }
  }]);
}(), $s = Ws, _t, Qn;
function Qs() {
  if (Qn) return _t;
  Qn = 1;
  var e = Re, r = e.str2xml, t = "_rels/.rels";
  function n(u) {
    for (var a = u.files[t], i = a ? r(a.asText()) : null, f = i ? i.getElementsByTagName("Relationship") : [], l = {}, y = 0; y < f.length; y++) {
      var A = f[y];
      l[A.getAttribute("Target")] = A.getAttribute("Type");
    }
    return l;
  }
  return _t = {
    getRelsTypes: n
  }, _t;
}
var Bt, Kn;
function Ks() {
  if (Kn) return Bt;
  Kn = 1;
  var e = Re, r = e.str2xml, t = "[Content_Types].xml";
  function n(a, i, f) {
    for (var l = {}, y = 0; y < a.length; y++) {
      var A = a[y], _ = A.getAttribute("ContentType"), q = A.getAttribute("PartName").substr(1);
      l[q] = _;
    }
    return f.file(/./).map(function(j) {
      for (var M = j.name, P = 0; P < i.length; P++) {
        var m = i[P], d = m.getAttribute("ContentType"), x = m.getAttribute("Extension");
        M.slice(M.length - x.length) === x && !l[M] && M !== t && (l[M] = d);
      }
      l[M] || (l[M] = "");
    }), l;
  }
  function u(a) {
    var i = a.files[t], f = i ? r(i.asText()) : null, l = f ? f.getElementsByTagName("Override") : null, y = f ? f.getElementsByTagName("Default") : null;
    return {
      overrides: l,
      defaults: y,
      contentTypes: i,
      contentTypeXml: f
    };
  }
  return Bt = {
    collectContentTypes: n,
    getContentTypes: u
  }, Bt;
}
var Ft, Zn;
function Er() {
  if (Zn) return Ft;
  Zn = 1;
  var e = We, r = e.XTInternalError;
  function t() {
  }
  function n(u) {
    return u;
  }
  return Ft = function(u) {
    var a = {
      on: t,
      set: t,
      getFileType: t,
      optionsTransformer: n,
      preparse: n,
      matchers: function() {
        return [];
      },
      parse: t,
      getTraits: t,
      postparse: n,
      errorsTransformer: n,
      preResolve: t,
      resolve: t,
      getRenderedMap: n,
      render: t,
      nullGetter: t,
      postrender: n
    };
    if (Object.keys(a).every(function(l) {
      return !u[l];
    })) {
      var i = new r("This module cannot be wrapped, because it doesn't define any of the necessary functions");
      throw i.properties = {
        id: "module_cannot_be_wrapped",
        explanation: "This module cannot be wrapped, because it doesn't define any of the necessary functions"
      }, i;
    }
    for (var f in a)
      u[f] || (u[f] = a[f]);
    return u;
  }, Ft;
}
var kt, Jn;
function xn() {
  if (Jn) return kt;
  Jn = 1;
  function e(s) {
    "@babel/helpers - typeof";
    return e = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(h) {
      return typeof h;
    } : function(h) {
      return h && typeof Symbol == "function" && h.constructor === Symbol && h !== Symbol.prototype ? "symbol" : typeof h;
    }, e(s);
  }
  function r(s) {
    return u(s) || n(s) || f(s) || t();
  }
  function t() {
    throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }
  function n(s) {
    if (typeof Symbol < "u" && s[Symbol.iterator] != null || s["@@iterator"] != null) return Array.from(s);
  }
  function u(s) {
    if (Array.isArray(s)) return l(s);
  }
  function a(s, h) {
    return A(s) || y(s, h) || f(s, h) || i();
  }
  function i() {
    throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }
  function f(s, h) {
    if (s) {
      if (typeof s == "string") return l(s, h);
      var S = {}.toString.call(s).slice(8, -1);
      return S === "Object" && s.constructor && (S = s.constructor.name), S === "Map" || S === "Set" ? Array.from(s) : S === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(S) ? l(s, h) : void 0;
    }
  }
  function l(s, h) {
    (h == null || h > s.length) && (h = s.length);
    for (var S = 0, O = Array(h); S < h; S++) O[S] = s[S];
    return O;
  }
  function y(s, h) {
    var S = s == null ? null : typeof Symbol < "u" && s[Symbol.iterator] || s["@@iterator"];
    if (S != null) {
      var O, G, Y, H, J = [], ee = !0, T = !1;
      try {
        if (Y = (S = S.call(s)).next, h !== 0) for (; !(ee = (O = Y.call(S)).done) && (J.push(O.value), J.length !== h); ee = !0) ;
      } catch (w) {
        T = !0, G = w;
      } finally {
        try {
          if (!ee && S.return != null && (H = S.return(), Object(H) !== H)) return;
        } finally {
          if (T) throw G;
        }
      }
      return J;
    }
  }
  function A(s) {
    if (Array.isArray(s)) return s;
  }
  function _(s, h) {
    var S = Object.keys(s);
    if (Object.getOwnPropertySymbols) {
      var O = Object.getOwnPropertySymbols(s);
      h && (O = O.filter(function(G) {
        return Object.getOwnPropertyDescriptor(s, G).enumerable;
      })), S.push.apply(S, O);
    }
    return S;
  }
  function q(s) {
    for (var h = 1; h < arguments.length; h++) {
      var S = arguments[h] != null ? arguments[h] : {};
      h % 2 ? _(Object(S), !0).forEach(function(O) {
        j(s, O, S[O]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(s, Object.getOwnPropertyDescriptors(S)) : _(Object(S)).forEach(function(O) {
        Object.defineProperty(s, O, Object.getOwnPropertyDescriptor(S, O));
      });
    }
    return s;
  }
  function j(s, h, S) {
    return (h = M(h)) in s ? Object.defineProperty(s, h, { value: S, enumerable: !0, configurable: !0, writable: !0 }) : s[h] = S, s;
  }
  function M(s) {
    var h = P(s, "string");
    return e(h) == "symbol" ? h : h + "";
  }
  function P(s, h) {
    if (e(s) != "object" || !s) return s;
    var S = s[Symbol.toPrimitive];
    if (S !== void 0) {
      var O = S.call(s, h);
      if (e(O) != "object") return O;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (h === "string" ? String : Number)(s);
  }
  var m = Re, d = m.getRightOrNull, x = m.getRight, c = m.getLeft, v = m.getLeftOrNull, b = m.chunkBy, C = m.isTagStart, g = m.isTagEnd, o = m.isContent, p = m.last, N = m.first, B = We, R = B.XTTemplateError, K = B.throwExpandNotFound, X = B.getLoopPositionProducesInvalidXMLError;
  function Q(s, h) {
    if (s.length === 0)
      return !1;
    var S = p(s).substr(1);
    return S.indexOf(h) === 0;
  }
  function V(s) {
    for (var h = [], S = 0; S < s.length; S++) {
      var O = s[S], G = O.position, Y = O.value, H = O.tag;
      H && (G === "end" ? Q(h, H) ? h.pop() : h.push(Y) : G === "start" && h.push(Y));
    }
    return h;
  }
  function W(s, h) {
    for (var S = 0; S < h.length; S++) {
      var O = h[S];
      if (O.indexOf("<".concat(s)) === 0)
        return !0;
    }
    return !1;
  }
  function ue(s, h, S) {
    for (var O = V(s.slice(h[0].offset, h[1].offset)), G = function() {
      var ee = S[H], T = ee.contains, w = ee.expand, E = ee.onlyTextInTag;
      if (W(T, O)) {
        if (E) {
          var k = v(s, T, h[0].offset), U = d(s, T, h[1].offset);
          if (k === null || U === null)
            return 0;
          var ie = s.slice(k, U), se = b(ie, function(cr) {
            return C(T, cr) ? "start" : g(T, cr) ? "end" : null;
          }), de = N(se), te = p(se), we = de.filter(o), ye = te.filter(o);
          if (we.length !== 1 || ye.length !== 1)
            return 0;
        }
        for (var pe = z(O), Ee = 0, Te = 0; Te < pe.length; Te++) {
          var be = pe[Te], Ue = be.tag, $e = be.position;
          Ue === w && ($e === "start" && Ee++, $e === "end" && Ee--);
        }
        return Ee !== 0 ? {
          v: {
            error: X({
              tag: N(h).part.value,
              offset: [N(h).part.offset, p(h).part.offset]
            })
          }
        } : {
          v: {
            value: w
          }
        };
      }
    }, Y, H = 0; H < S.length; H++)
      if (Y = G(), Y !== 0 && Y)
        return Y.v;
    return Ae(O) ? {} : {
      error: X({
        tag: N(h).part.value,
        offset: [N(h).part.offset, p(h).part.offset]
      })
    };
  }
  function z(s) {
    for (var h = [], S = 0; S < s.length; S++) {
      var O = s[S], G = oe(O), Y = /^\s*<\//.test(O) ? "end" : "start";
      h.push({
        tag: G,
        position: Y
      });
    }
    return h;
  }
  function oe(s) {
    return s.replace(/^\s*<\/?([a-zA-Z:]+).*/, "$1");
  }
  function Ae(s) {
    if (s.length % 2 === 1)
      return !1;
    for (var h = 0, S = s.length / 2; h < S; h++) {
      var O = s[h], G = s[s.length - h - 1], Y = oe(O), H = oe(G);
      if (Y !== H)
        return !1;
    }
    return !0;
  }
  function xe(s, h, S, O) {
    var G = s.expandTo || O.expandTo;
    if (G) {
      var Y, H;
      try {
        H = c(S, G, h), Y = x(S, G, h);
      } catch (T) {
        var J = q({
          part: s,
          rootError: T,
          postparsed: S,
          expandTo: G,
          index: h
        }, O.error);
        if (O.onError) {
          var ee = O.onError(J);
          if (ee === "ignore")
            return;
        }
        K(J);
      }
      return [H, Y];
    }
  }
  function Le(s, h, S, O) {
    var G = a(s, 2), Y = G[0], H = G[1], J = S.indexOf(h), ee = S.slice(Y, J), T = S.slice(J + 1, H + 1), w = O.getInner({
      postparse: O.postparse,
      index: J,
      part: h,
      leftParts: ee,
      rightParts: T,
      left: Y,
      right: H,
      postparsed: S
    });
    return w.length || (w.expanded = [ee, T], w = [w]), {
      left: Y,
      right: H,
      inner: w
    };
  }
  function ze(s, h) {
    var S = [];
    s.errors && (S = s.errors, s = s.postparsed);
    for (var O = [], G = 0, Y = s.length; G < Y; G++) {
      var H = s[G];
      if (H.type === "placeholder" && H.module === h.moduleName && /*
       * The part.subparsed check is used to fix this github issue :
       * https://github.com/open-xml-templating/docxtemplater/issues/671
       */
      !H.subparsed && !H.expanded)
        try {
          var J = xe(H, G, s, h);
          if (!J)
            continue;
          var ee = a(J, 2), T = ee[0], w = ee[1];
          O.push({
            left: T,
            right: w,
            part: H,
            i: G,
            leftPart: s[T],
            rightPart: s[w]
          });
        } catch (ye) {
          S.push(ye);
        }
    }
    O.sort(function(ye, pe) {
      return ye.left === pe.left ? pe.part.lIndex < ye.part.lIndex ? 1 : -1 : pe.left < ye.left ? 1 : -1;
    });
    for (var E = -1, k = 0, U = 0, ie = O.length; U < ie; U++) {
      var se, de = O[U];
      if (E = Math.max(E, U > 0 ? O[U - 1].right : 0), !(de.left < E)) {
        var te = void 0;
        try {
          te = Le([de.left + k, de.right + k], de.part, s, h);
        } catch (ye) {
          if (h.onError) {
            var we = h.onError(q({
              part: de.part,
              rootError: ye,
              postparsed: s,
              expandOne: Le
            }, h.errors));
            if (we === "ignore")
              continue;
          }
          if (ye instanceof R)
            S.push(ye);
          else
            throw ye;
        }
        te && (k += te.inner.length - (te.right + 1 - te.left), (se = s).splice.apply(se, [te.left, te.right + 1 - te.left].concat(r(te.inner))));
      }
    }
    return {
      postparsed: s,
      errors: S
    };
  }
  return kt = {
    expandToOne: ze,
    getExpandToDefault: ue
  }, kt;
}
var qt, eu;
function Sn() {
  if (eu) return qt;
  eu = 1;
  var e = "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml", r = "application/vnd.ms-word.document.macroEnabled.main+xml", t = "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml", n = "application/vnd.ms-word.template.macroEnabledTemplate.main+xml", u = "application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml", a = "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml", i = "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml", f = "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml", l = "application/vnd.openxmlformats-officedocument.presentationml.slide+xml", y = "application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml", A = "application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml", _ = "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml", q = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml", j = "application/vnd.ms-excel.sheet.macroEnabled.main+xml", M = "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml", P = [e, r, t, n], m = {
    main: P,
    docx: [u].concat(P, [f, a, i]),
    pptx: [l, y, A, _],
    xlsx: [q, j, M]
  };
  return qt = m, qt;
}
var Ut, ru;
function ya() {
  if (ru) return Ut;
  ru = 1;
  var e = "application/vnd.openxmlformats-package.core-properties+xml", r = "application/vnd.openxmlformats-officedocument.extended-properties+xml", t = "application/vnd.openxmlformats-officedocument.custom-properties+xml", n = "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml", u = "application/vnd.openxmlformats-officedocument.drawingml.diagramData+xml", a = "application/vnd.ms-office.drawingml.diagramDrawing+xml";
  return Ut = {
    settingsContentType: n,
    coreContentType: e,
    appContentType: r,
    customContentType: t,
    diagramDataContentType: u,
    diagramDrawingContentType: a
  }, Ut;
}
var jt, tu;
function Zs() {
  if (tu) return jt;
  tu = 1;
  function e(c) {
    "@babel/helpers - typeof";
    return e = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(v) {
      return typeof v;
    } : function(v) {
      return v && typeof Symbol == "function" && v.constructor === Symbol && v !== Symbol.prototype ? "symbol" : typeof v;
    }, e(c);
  }
  function r(c, v) {
    if (!(c instanceof v)) throw new TypeError("Cannot call a class as a function");
  }
  function t(c, v) {
    for (var b = 0; b < v.length; b++) {
      var C = v[b];
      C.enumerable = C.enumerable || !1, C.configurable = !0, "value" in C && (C.writable = !0), Object.defineProperty(c, u(C.key), C);
    }
  }
  function n(c, v, b) {
    return v && t(c.prototype, v), Object.defineProperty(c, "prototype", { writable: !1 }), c;
  }
  function u(c) {
    var v = a(c, "string");
    return e(v) == "symbol" ? v : v + "";
  }
  function a(c, v) {
    if (e(c) != "object" || !c) return c;
    var b = c[Symbol.toPrimitive];
    if (b !== void 0) {
      var C = b.call(c, v);
      if (e(C) != "object") return C;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return String(c);
  }
  var i = Re, f = i.pushArray, l = Er(), y = Sn(), A = ya(), _ = A.settingsContentType, q = A.coreContentType, j = A.appContentType, M = A.customContentType, P = A.diagramDataContentType, m = A.diagramDrawingContentType, d = [_, q, j, M, P, m], x = /* @__PURE__ */ function() {
    function c() {
      r(this, c), this.name = "Common";
    }
    return n(c, [{
      key: "getFileType",
      value: function(b) {
        var C = b.doc, g = C.invertedContentTypes;
        if (g) {
          for (var o = 0; o < d.length; o++) {
            var p = d[o];
            g[p] && f(C.targets, g[p]);
          }
          for (var N = ["docx", "pptx", "xlsx"], B, R = 0; R < N.length; R++)
            for (var K = N[R], X = y[K], Q = 0; Q < X.length; Q++) {
              var V = X[Q];
              if (g[V])
                for (var W = 0, ue = g[V]; W < ue.length; W++) {
                  var z = ue[W];
                  C.relsTypes[z] && ["http://purl.oclc.org/ooxml/officeDocument/relationships/officeDocument", "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"].indexOf(C.relsTypes[z]) === -1 || (B = K, (y.main.indexOf(V) !== -1 || V === y.pptx[0]) && (C.textTarget || (C.textTarget = z)), B !== "xlsx" && C.targets.push(z));
                }
            }
          return B;
        }
      }
    }]);
  }();
  return jt = function() {
    return l(new x());
  }, jt;
}
var Vt, nu;
function Js() {
  if (nu) return Vt;
  nu = 1;
  function e(m) {
    "@babel/helpers - typeof";
    return e = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(d) {
      return typeof d;
    } : function(d) {
      return d && typeof Symbol == "function" && d.constructor === Symbol && d !== Symbol.prototype ? "symbol" : typeof d;
    }, e(m);
  }
  function r(m, d) {
    if (!(m instanceof d)) throw new TypeError("Cannot call a class as a function");
  }
  function t(m, d) {
    for (var x = 0; x < d.length; x++) {
      var c = d[x];
      c.enumerable = c.enumerable || !1, c.configurable = !0, "value" in c && (c.writable = !0), Object.defineProperty(m, u(c.key), c);
    }
  }
  function n(m, d, x) {
    return d && t(m.prototype, d), Object.defineProperty(m, "prototype", { writable: !1 }), m;
  }
  function u(m) {
    var d = a(m, "string");
    return e(d) == "symbol" ? d : d + "";
  }
  function a(m, d) {
    if (e(m) != "object" || !m) return m;
    var x = m[Symbol.toPrimitive];
    if (x !== void 0) {
      var c = x.call(m, d);
      if (e(c) != "object") return c;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return String(m);
  }
  var i = We, f = i.getScopeParserExecutionError, l = bn, y = l.last, A = Re, _ = A.concatArrays;
  function q(m, d) {
    for (var x = m.length >>> 0, c, v = 0; v < x; v++)
      if (c = m[v], d.call(this, c, v, m))
        return c;
  }
  function j(m, d, x) {
    var c = this, v = this.scopeList[x];
    if (this.root.finishedResolving) {
      for (var b = this.resolved, C = function() {
        var R = c.scopeLindex[g];
        b = q(b, function(K) {
          return K.lIndex === R;
        }), b = b.value[c.scopePathItem[g]];
      }, g = this.resolveOffset, o = this.scopePath.length; g < o; g++)
        C();
      return q(b, function(B) {
        return d.part.lIndex === B.lIndex;
      }).value;
    }
    var p, N;
    !this.cachedParsers || !d.part ? N = this.parser(m, {
      tag: d.part,
      scopePath: this.scopePath
    }) : this.cachedParsers[d.part.lIndex] ? N = this.cachedParsers[d.part.lIndex] : N = this.cachedParsers[d.part.lIndex] = this.parser(m, {
      tag: d.part,
      scopePath: this.scopePath
    });
    try {
      p = N.get(v, this.getContext(d, x));
    } catch (B) {
      throw f({
        tag: m,
        scope: v,
        error: B,
        offset: d.part.offset
      });
    }
    return p == null && x > 0 ? j.call(this, m, d, x - 1) : p;
  }
  function M(m, d, x) {
    var c = this, v = this.scopeList[x], b;
    return !this.cachedParsers || !d.part ? b = this.parser(m, {
      tag: d.part,
      scopePath: this.scopePath
    }) : this.cachedParsers[d.part.lIndex] ? b = this.cachedParsers[d.part.lIndex] : b = this.cachedParsers[d.part.lIndex] = this.parser(m, {
      tag: d.part,
      scopePath: this.scopePath
    }), Promise.resolve().then(function() {
      return b.get(v, c.getContext(d, x));
    }).catch(function(C) {
      throw f({
        tag: m,
        scope: v,
        error: C,
        offset: d.part.offset
      });
    }).then(function(C) {
      return C == null && x > 0 ? M.call(c, m, d, x - 1) : C;
    });
  }
  var P = /* @__PURE__ */ function() {
    function m(d) {
      r(this, m), this.root = d.root || this, this.resolveOffset = d.resolveOffset || 0, this.scopePath = d.scopePath, this.scopePathItem = d.scopePathItem, this.scopePathLength = d.scopePathLength, this.scopeList = d.scopeList, this.scopeType = "", this.scopeTypes = d.scopeTypes, this.scopeLindex = d.scopeLindex, this.parser = d.parser, this.resolved = d.resolved, this.cachedParsers = d.cachedParsers;
    }
    return n(m, [{
      key: "loopOver",
      value: function(x, c, v, b) {
        return this.loopOverValue(this.getValue(x, b), c, v);
      }
    }, {
      key: "functorIfInverted",
      value: function(x, c, v, b, C) {
        return x && c(v, b, C), x;
      }
    }, {
      key: "isValueFalsy",
      value: function(x, c) {
        return x == null || !x || c === "[object Array]" && x.length === 0;
      }
    }, {
      key: "loopOverValue",
      value: function(x, c, v) {
        this.root.finishedResolving && (v = !1);
        var b = Object.prototype.toString.call(x);
        if (this.isValueFalsy(x, b))
          return this.scopeType = !1, this.functorIfInverted(v, c, y(this.scopeList), 0, 1);
        if (b === "[object Array]") {
          this.scopeType = "array";
          for (var C = 0; C < x.length; C++)
            this.functorIfInverted(!v, c, x[C], C, x.length);
          return !0;
        }
        return b === "[object Object]" ? (this.scopeType = "object", this.functorIfInverted(!v, c, x, 0, 1)) : this.functorIfInverted(!v, c, y(this.scopeList), 0, 1);
      }
    }, {
      key: "getValue",
      value: function(x, c) {
        var v = j.call(this, x, c, this.scopeList.length - 1);
        return typeof v == "function" ? v(this.scopeList[this.scopeList.length - 1], this) : v;
      }
    }, {
      key: "getValueAsync",
      value: function(x, c) {
        var v = this;
        return M.call(this, x, c, this.scopeList.length - 1).then(function(b) {
          return typeof b == "function" ? b(v.scopeList[v.scopeList.length - 1], v) : b;
        });
      }
    }, {
      key: "getContext",
      value: function(x, c) {
        return {
          num: c,
          meta: x,
          scopeList: this.scopeList,
          resolved: this.resolved,
          scopePath: this.scopePath,
          scopeTypes: this.scopeTypes,
          scopePathItem: this.scopePathItem,
          scopePathLength: this.scopePathLength
        };
      }
    }, {
      key: "createSubScopeManager",
      value: function(x, c, v, b, C) {
        return new m({
          root: this.root,
          resolveOffset: this.resolveOffset,
          resolved: this.resolved,
          parser: this.parser,
          cachedParsers: this.cachedParsers,
          scopeTypes: _([this.scopeTypes, [this.scopeType]]),
          scopeList: _([this.scopeList, [x]]),
          scopePath: _([this.scopePath, [c]]),
          scopePathItem: _([this.scopePathItem, [v]]),
          scopePathLength: _([this.scopePathLength, [C]]),
          scopeLindex: _([this.scopeLindex, [b.lIndex]])
        });
      }
    }]);
  }();
  return Vt = function(m) {
    return m.scopePath = [], m.scopePathItem = [], m.scopePathLength = [], m.scopeTypes = [], m.scopeLindex = [], m.scopeList = [m.tags], new P(m);
  }, Vt;
}
var Xt, uu;
function Ea() {
  if (uu) return Xt;
  uu = 1;
  function e(s) {
    "@babel/helpers - typeof";
    return e = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(h) {
      return typeof h;
    } : function(h) {
      return h && typeof Symbol == "function" && h.constructor === Symbol && h !== Symbol.prototype ? "symbol" : typeof h;
    }, e(s);
  }
  function r(s, h) {
    return i(s) || a(s, h) || n(s, h) || t();
  }
  function t() {
    throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }
  function n(s, h) {
    if (s) {
      if (typeof s == "string") return u(s, h);
      var S = {}.toString.call(s).slice(8, -1);
      return S === "Object" && s.constructor && (S = s.constructor.name), S === "Map" || S === "Set" ? Array.from(s) : S === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(S) ? u(s, h) : void 0;
    }
  }
  function u(s, h) {
    (h == null || h > s.length) && (h = s.length);
    for (var S = 0, O = Array(h); S < h; S++) O[S] = s[S];
    return O;
  }
  function a(s, h) {
    var S = s == null ? null : typeof Symbol < "u" && s[Symbol.iterator] || s["@@iterator"];
    if (S != null) {
      var O, G, Y, H, J = [], ee = !0, T = !1;
      try {
        if (Y = (S = S.call(s)).next, h !== 0) for (; !(ee = (O = Y.call(S)).done) && (J.push(O.value), J.length !== h); ee = !0) ;
      } catch (w) {
        T = !0, G = w;
      } finally {
        try {
          if (!ee && S.return != null && (H = S.return(), Object(H) !== H)) return;
        } finally {
          if (T) throw G;
        }
      }
      return J;
    }
  }
  function i(s) {
    if (Array.isArray(s)) return s;
  }
  function f(s, h) {
    var S = Object.keys(s);
    if (Object.getOwnPropertySymbols) {
      var O = Object.getOwnPropertySymbols(s);
      h && (O = O.filter(function(G) {
        return Object.getOwnPropertyDescriptor(s, G).enumerable;
      })), S.push.apply(S, O);
    }
    return S;
  }
  function l(s) {
    for (var h = 1; h < arguments.length; h++) {
      var S = arguments[h] != null ? arguments[h] : {};
      h % 2 ? f(Object(S), !0).forEach(function(O) {
        y(s, O, S[O]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(s, Object.getOwnPropertyDescriptors(S)) : f(Object(S)).forEach(function(O) {
        Object.defineProperty(s, O, Object.getOwnPropertyDescriptor(S, O));
      });
    }
    return s;
  }
  function y(s, h, S) {
    return (h = A(h)) in s ? Object.defineProperty(s, h, { value: S, enumerable: !0, configurable: !0, writable: !0 }) : s[h] = S, s;
  }
  function A(s) {
    var h = _(s, "string");
    return e(h) == "symbol" ? h : h + "";
  }
  function _(s, h) {
    if (e(s) != "object" || !s) return s;
    var S = s[Symbol.toPrimitive];
    if (S !== void 0) {
      var O = S.call(s, h);
      if (e(O) != "object") return O;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (h === "string" ? String : Number)(s);
  }
  var q = We, j = q.getUnclosedTagException, M = q.getUnopenedTagException, P = q.getDuplicateOpenTagException, m = q.getDuplicateCloseTagException, d = q.throwMalformedXml, x = q.throwXmlInvalid, c = q.XTTemplateError, v = Re, b = v.isTextStart, C = v.isTextEnd, g = v.wordToUtf8, o = v.pushArray, p = 0, N = 1, B = 2, R = 3;
  function K(s, h) {
    return s[0] <= h.offset && h.offset < s[1];
  }
  function X(s, h) {
    return b(s) ? (h && d(), !0) : C(s) ? (h || d(), !1) : h;
  }
  function Q(s) {
    var h = "", S = 1, O = s.indexOf(" ");
    return s[s.length - 2] === "/" ? (h = "selfclosing", O === -1 && (O = s.length - 2)) : s[1] === "/" ? (S = 2, h = "end", O === -1 && (O = s.length - 1)) : (h = "start", O === -1 && (O = s.length - 1)), {
      tag: s.slice(S, O),
      position: h
    };
  }
  function V(s, h, S) {
    for (var O = 0, G = s.length, Y = {}, H = 0; H < h.length; H++) {
      var J = h[H];
      Y[J] = !0;
    }
    for (var ee = 0; ee < S.length; ee++) {
      var T = S[ee];
      Y[T] = !1;
    }
    for (var w = []; O < G && (O = s.indexOf("<", O), O !== -1); ) {
      var E = O, k = s.indexOf("<", O + 1);
      O = s.indexOf(">", O), (O === -1 || k !== -1 && O > k) && x(s, E);
      var U = s.slice(E, O + 1), ie = Q(U), se = ie.tag, de = ie.position, te = Y[se];
      te != null && w.push({
        type: "tag",
        position: de,
        text: te,
        offset: E,
        value: U,
        tag: se
      });
    }
    return w;
  }
  function W(s, h, S) {
    var O = [], G = !1, Y = {
      offset: 0
    }, H, J = s.reduce(function(T, w) {
      var E = w.position, k = w.offset, U = Y.offset, ie = Y.length;
      if (H = h.substr(U, k - U), G && E === "start") {
        if (U + ie === k && (H = h.substr(U, k - U + ie + 4), !S.allowUnclosedTag))
          return O.push(P({
            xtag: H,
            offset: U
          })), Y = w, T.push(l(l({}, w), {}, {
            error: !0
          })), T;
        if (!S.allowUnclosedTag)
          return O.push(j({
            xtag: g(H),
            offset: U
          })), Y = w, T.push(l(l({}, w), {}, {
            error: !0
          })), T;
        T.pop();
      }
      return !G && E === "end" ? S.allowUnopenedTag ? T : U + ie === k ? (H = h.substr(U - 4, k - U + ie + 4), O.push(m({
        xtag: H,
        offset: U
      })), Y = w, T.push(l(l({}, w), {}, {
        error: !0
      })), T) : (O.push(M({
        xtag: H,
        offset: k
      })), Y = w, T.push(l(l({}, w), {}, {
        error: !0
      })), T) : (G = E === "start", Y = w, T.push(w), T);
    }, []);
    if (G) {
      var ee = Y.offset;
      H = h.substr(ee, h.length - ee), S.allowUnclosedTag ? J.pop() : O.push(j({
        xtag: g(H),
        offset: ee
      }));
    }
    return {
      delimiterWithErrors: J,
      errors: O
    };
  }
  function ue(s, h) {
    return s === -1 && h === -1 ? p : s === h ? N : s === -1 || h === -1 ? h < s ? B : R : s < h ? B : R;
  }
  function z(s) {
    var h = s.split(" ");
    if (h.length !== 2) {
      var S = new c("New Delimiters cannot be parsed");
      throw S.properties = {
        id: "change_delimiters_invalid",
        explanation: "Cannot parser delimiters"
      }, S;
    }
    var O = r(h, 2), G = O[0], Y = O[1];
    if (G.length === 0 || Y.length === 0) {
      var H = new c("New Delimiters cannot be parsed");
      throw H.properties = {
        id: "change_delimiters_invalid",
        explanation: "Cannot parser delimiters"
      }, H;
    }
    return [G, Y];
  }
  function oe(s, h, S) {
    var O = [], G = h.start, Y = h.end, H = -1, J = !1;
    if (G == null && Y == null)
      return [];
    for (; ; ) {
      var ee = s.indexOf(G, H + 1), T = s.indexOf(Y, H + 1), w = null, E = void 0, k = ue(ee, T);
      switch (k === N && (k = J ? R : B), k) {
        case p:
          return O;
        case R:
          J = !1, H = T, w = "end", E = Y.length;
          break;
        case B:
          J = !0, H = ee, w = "start", E = G.length;
          break;
      }
      if (S.changeDelimiterPrefix && k === B && s[H + G.length] === S.changeDelimiterPrefix) {
        O.push({
          offset: ee,
          position: "start",
          length: G.length,
          changedelimiter: !0
        });
        var U = s.indexOf(S.changeDelimiterPrefix, H + G.length + 1), ie = s.indexOf(Y, U + 1);
        O.push({
          offset: ie,
          position: "end",
          length: Y.length,
          changedelimiter: !0
        });
        var se = s.substr(H + G.length + 1, U - H - G.length - 1), de = z(se), te = r(de, 2);
        G = te[0], Y = te[1], H = ie;
        continue;
      }
      O.push({
        offset: H,
        position: w,
        length: E
      });
    }
  }
  function Ae(s, h, S) {
    var O = s.map(function(U) {
      return U.value;
    }).join(""), G = oe(O, h, S), Y = 0, H = s.map(function(U) {
      return Y += U.value.length, {
        offset: Y - U.value.length,
        lIndex: U.lIndex
      };
    }), J = W(G, O, S), ee = J.delimiterWithErrors, T = J.errors, w = 0, E = 0, k = H.map(function(U, ie) {
      for (var se = U.offset, de = [se, se + s[ie].value.length], te = s[ie].value, we = []; E < ee.length && K(de, ee[E]); )
        we.push(ee[E]), E++;
      var ye = [], pe = 0;
      w > 0 && (pe = w, w = 0);
      for (var Ee = 0; Ee < we.length; Ee++) {
        var Te = we[Ee], be = te.substr(pe, Te.offset - se - pe);
        if (Te.changedelimiter) {
          Te.position === "start" ? be.length > 0 && ye.push({
            type: "content",
            value: be
          }) : pe = Te.offset - se + Te.length;
          continue;
        }
        be.length > 0 && (ye.push({
          type: "content",
          value: be
        }), pe += be.length);
        var Ue = {
          type: "delimiter",
          position: Te.position,
          offset: pe + se
        };
        ye.push(Ue), pe = Te.offset - se + Te.length;
      }
      w = pe - te.length;
      var $e = te.substr(pe);
      return $e.length > 0 && ye.push({
        type: "content",
        value: $e
      }), ye;
    }, this);
    return {
      parsed: k,
      errors: T
    };
  }
  function xe(s) {
    return s.type === "content" && s.position === "insidetag";
  }
  function Le(s) {
    return s.filter(xe);
  }
  function ze(s, h) {
    for (var S = !1, O = 0; O < s.length; O++) {
      var G = s[O];
      S = X(G, S), G.type === "content" && (G.position = S ? "insidetag" : "outsidetag"), h !== "text" && xe(G) && (G.value = G.value.replace(/>/g, "&gt;"));
    }
  }
  return Xt = {
    parseDelimiters: Ae,
    parse: function(h, S, O, G) {
      ze(h, G);
      for (var Y = Ae(Le(h), S, O), H = Y.parsed, J = Y.errors, ee = [], T = 0, w = 0, E = 0; E < h.length; E++) {
        var k = h[E];
        if (xe(k)) {
          for (var U = 0, ie = H[T]; U < ie.length; U++) {
            var se = ie[U];
            se.type === "content" && (se.position = "insidetag"), se.lIndex = w++;
          }
          o(ee, H[T]), T++;
        } else
          k.lIndex = w++, ee.push(k);
      }
      return {
        errors: J,
        lexed: ee
      };
    },
    xmlparse: function(h, S) {
      for (var O = V(h, S.text, S.other), G = 0, Y = [], H = 0; H < O.length; H++) {
        var J = O[H];
        h.length > G && J.offset - G > 0 && Y.push({
          type: "content",
          value: h.substr(G, J.offset - G)
        }), G = J.offset + J.value.length, delete J.offset, Y.push(J);
      }
      return h.length > G && Y.push({
        type: "content",
        value: h.substr(G)
      }), Y;
    }
  }, Xt;
}
var Gt, au;
function el() {
  if (au) return Gt;
  au = 1;
  function e(l) {
    return u(l) || n(l) || t(l) || r();
  }
  function r() {
    throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }
  function t(l, y) {
    if (l) {
      if (typeof l == "string") return a(l, y);
      var A = {}.toString.call(l).slice(8, -1);
      return A === "Object" && l.constructor && (A = l.constructor.name), A === "Map" || A === "Set" ? Array.from(l) : A === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(A) ? a(l, y) : void 0;
    }
  }
  function n(l) {
    if (typeof Symbol < "u" && l[Symbol.iterator] != null || l["@@iterator"] != null) return Array.from(l);
  }
  function u(l) {
    if (Array.isArray(l)) return a(l);
  }
  function a(l, y) {
    (y == null || y > l.length) && (y = l.length);
    for (var A = 0, _ = Array(y); A < y; A++) _[A] = l[A];
    return _;
  }
  function i(l) {
    return l.type === "placeholder";
  }
  function f(l) {
    var y = {}, A = [{
      items: l.filter(i),
      parents: [],
      path: []
    }];
    function _(V, W, ue) {
      ue.length && A.push({
        items: ue,
        parents: [].concat(e(W.parents), [V]),
        path: V.dataBound !== !1 && !V.attrParsed && V.value && !V.attrParsed ? [].concat(e(W.path), [V.value]) : e(W.path)
      });
    }
    function q(V, W) {
      for (var ue = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : W.length, z = V, oe = 0; oe < ue; oe++)
        z = z[W[oe]];
      return z;
    }
    function j(V, W) {
      for (var ue = W.length, z = 0; z < W.length; z++) {
        var oe = W[z], Ae = typeof oe.lIndex == "number" ? oe.lIndex : parseInt(oe.lIndex.split("-")[0], 10);
        Ae > V.lIndex && ue--;
      }
      return ue;
    }
    for (; A.length > 0; )
      for (var M = A.pop(), P = q(y, M.path), m = 0, d = M.items; m < d.length; m++) {
        var x, c, v = d[m];
        if (v.attrParsed) {
          for (var b in v.attrParsed)
            _(v, M, v.attrParsed[b].filter(i));
          continue;
        }
        if (v.subparsed) {
          if (v.dataBound !== !1) {
            var C, g;
            (C = P)[g = v.value] || (C[g] = {});
          }
          _(v, M, v.subparsed.filter(i));
          continue;
        }
        if (v.cellParsed) {
          for (var o = 0, p = v.cellPostParsed; o < p.length; o++) {
            var N = p[o];
            if (N.type === "placeholder") {
              if (N.module === "pro-xml-templating/xls-module-loop")
                continue;
              if (N.subparsed) {
                var B, R;
                (B = P)[R = N.value] || (B[R] = {}), _(N, M, N.subparsed.filter(i));
              } else {
                var K, X, Q = j(v, M.parents);
                P = q(y, M.path, Q), (K = P)[X = N.value] || (K[X] = {});
              }
            }
          }
          continue;
        }
        v.dataBound !== !1 && ((x = P)[c = v.value] || (x[c] = {}));
      }
    return y;
  }
  return Gt = {
    getTags: f,
    isPlaceholder: i
  }, Gt;
}
var Ht, ou;
function rl() {
  if (ou) return Ht;
  ou = 1;
  var e = Re, r = e.pushArray;
  function t(u, a) {
    return a instanceof Error ? r(Object.getOwnPropertyNames(a), ["stack"]).reduce(function(i, f) {
      return i[f] = a[f], f === "stack" && (i[f] = a[f].toString()), i;
    }, {}) : a;
  }
  function n(u, a) {
    if (console.log(JSON.stringify({
      error: u
    }, t, a === "json" ? 2 : null)), u.properties && u.properties.errors instanceof Array) {
      var i = u.properties.errors.map(function(f) {
        return f.properties.explanation;
      }).join(`
`);
      console.log("errorMessages", i);
    }
  }
  return Ht = n, Ht;
}
var zt, iu;
function Ta() {
  if (iu) return zt;
  iu = 1;
  var e = Re, r = e.pregMatchAll;
  return zt = function(n, u) {
    var a = {
      content: n
    }, i = u.join("|"), f = new RegExp("(?:(<(?:".concat(i, ")[^>]*>)([^<>]*)</(?:").concat(i, ")>)|(<(?:").concat(i, ")[^>]*/>)"), "g");
    return a.matches = r(f, a.content), a;
  }, zt;
}
var Yt, su;
function tl() {
  if (su) return Yt;
  su = 1;
  function e(i) {
    "@babel/helpers - typeof";
    return e = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(f) {
      return typeof f;
    } : function(f) {
      return f && typeof Symbol == "function" && f.constructor === Symbol && f !== Symbol.prototype ? "symbol" : typeof f;
    }, e(i);
  }
  var r = new RegExp(" ", "g");
  function t(i) {
    return i.replace(r, " ");
  }
  function n(i, f) {
    var l = e(i);
    if (l === "string")
      return t(f.substr(0, i.length)) === i;
    if (i instanceof RegExp)
      return i.test(t(f));
    if (l === "function")
      return !!i(f);
  }
  function u(i, f) {
    var l = e(i);
    if (l === "string")
      return t(f).substr(i.length);
    if (i instanceof RegExp)
      return t(f).match(i)[1];
    if (l === "function")
      return i(f);
  }
  function a(i, f) {
    var l = e(i);
    if (l === "string")
      return [f, t(f).substr(i.length)];
    if (i instanceof RegExp)
      return t(f).match(i);
    if (l === "function")
      return [f, i(f)];
  }
  return Yt = {
    match: n,
    getValue: u,
    getValues: a
  }, Yt;
}
var Wt, lu;
function nl() {
  if (lu) return Wt;
  lu = 1;
  function e(g) {
    "@babel/helpers - typeof";
    return e = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(o) {
      return typeof o;
    } : function(o) {
      return o && typeof Symbol == "function" && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, e(g);
  }
  function r(g, o) {
    var p = Object.keys(g);
    if (Object.getOwnPropertySymbols) {
      var N = Object.getOwnPropertySymbols(g);
      o && (N = N.filter(function(B) {
        return Object.getOwnPropertyDescriptor(g, B).enumerable;
      })), p.push.apply(p, N);
    }
    return p;
  }
  function t(g) {
    for (var o = 1; o < arguments.length; o++) {
      var p = arguments[o] != null ? arguments[o] : {};
      o % 2 ? r(Object(p), !0).forEach(function(N) {
        n(g, N, p[N]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(g, Object.getOwnPropertyDescriptors(p)) : r(Object(p)).forEach(function(N) {
        Object.defineProperty(g, N, Object.getOwnPropertyDescriptor(p, N));
      });
    }
    return g;
  }
  function n(g, o, p) {
    return (o = u(o)) in g ? Object.defineProperty(g, o, { value: p, enumerable: !0, configurable: !0, writable: !0 }) : g[o] = p, g;
  }
  function u(g) {
    var o = a(g, "string");
    return e(o) == "symbol" ? o : o + "";
  }
  function a(g, o) {
    if (e(g) != "object" || !g) return g;
    var p = g[Symbol.toPrimitive];
    if (p !== void 0) {
      var N = p.call(g, o);
      if (e(N) != "object") return N;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (o === "string" ? String : Number)(g);
  }
  function i(g, o) {
    return _(g) || A(g, o) || l(g, o) || f();
  }
  function f() {
    throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }
  function l(g, o) {
    if (g) {
      if (typeof g == "string") return y(g, o);
      var p = {}.toString.call(g).slice(8, -1);
      return p === "Object" && g.constructor && (p = g.constructor.name), p === "Map" || p === "Set" ? Array.from(g) : p === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(p) ? y(g, o) : void 0;
    }
  }
  function y(g, o) {
    (o == null || o > g.length) && (o = g.length);
    for (var p = 0, N = Array(o); p < o; p++) N[p] = g[p];
    return N;
  }
  function A(g, o) {
    var p = g == null ? null : typeof Symbol < "u" && g[Symbol.iterator] || g["@@iterator"];
    if (p != null) {
      var N, B, R, K, X = [], Q = !0, V = !1;
      try {
        if (R = (p = p.call(g)).next, o !== 0) for (; !(Q = (N = R.call(p)).done) && (X.push(N.value), X.length !== o); Q = !0) ;
      } catch (W) {
        V = !0, B = W;
      } finally {
        try {
          if (!Q && p.return != null && (K = p.return(), Object(K) !== K)) return;
        } finally {
          if (V) throw B;
        }
      }
      return X;
    }
  }
  function _(g) {
    if (Array.isArray(g)) return g;
  }
  var q = Re, j = q.wordToUtf8, M = q.pushArray, P = tl(), m = P.match, d = P.getValue, x = P.getValues;
  function c(g, o) {
    for (var p = [], N = 0; N < g.length; N++) {
      var B = g[N];
      if (B.matchers) {
        var R = B.matchers(o);
        if (!(R instanceof Array))
          throw new Error("module matcher returns a non array");
        M(p, R);
      }
    }
    return p;
  }
  function v(g, o, p) {
    for (var N = [], B = 0; B < g.length; B++) {
      var R = g[B], K = i(R, 2), X = K[0], Q = K[1], V = R[2] || {};
      if (p.match(X, o)) {
        var W = p.getValues(X, o);
        if (typeof V == "function" && (V = V(W)), !V.value) {
          var ue = i(W, 2);
          V.value = ue[1];
        }
        N.push(t({
          type: "placeholder",
          prefix: X,
          module: Q,
          onMatch: V.onMatch,
          priority: V.priority
        }, V));
      }
    }
    return N;
  }
  function b(g, o) {
    var p = o.modules, N = o.startOffset, B = o.lIndex, R;
    o.offset = N, o.match = m, o.getValue = d, o.getValues = x;
    var K = c(p, o), X = v(K, g, o);
    if (X.length > 0) {
      for (var Q = null, V = 0; V < X.length; V++) {
        var W = X[V];
        W.priority || (W.priority = -W.value.length), (!Q || W.priority > Q.priority) && (Q = W);
      }
      return Q.offset = N, delete Q.priority, Q.endLindex = B, Q.lIndex = B, Q.raw = g, Q.onMatch && Q.onMatch(Q), delete Q.onMatch, delete Q.prefix, Q;
    }
    for (var ue = 0; ue < p.length; ue++) {
      var z = p[ue];
      if (R = z.parse(g, o), R)
        return R.offset = N, R.endLindex = B, R.lIndex = B, R.raw = g, R;
    }
    return {
      type: "placeholder",
      value: g,
      offset: N,
      endLindex: B,
      lIndex: B
    };
  }
  var C = {
    preparse: function(o, p, N) {
      function B(R, K) {
        for (var X = 0; X < p.length; X++) {
          var Q = p[X];
          R = Q.preparse(R, K) || R;
        }
        return R;
      }
      return B(o, N);
    },
    parse: function(o, p, N) {
      var B = !1, R = "", K, X = [], Q = N.fileTypeConfig.droppedTagsInsidePlaceholder || [];
      return o.reduce(function(V, W) {
        return W.type === "delimiter" ? (B = W.position === "start", W.position === "end" && (N.parse = function(ue) {
          return b(ue, t(t(t({}, N), W), {}, {
            startOffset: K,
            modules: p
          }));
        }, V.push(N.parse(j(R))), M(V, X), X = []), W.position === "start" && (X = [], K = W.offset), R = "", V) : B ? W.type !== "content" || W.position !== "insidetag" ? (Q.indexOf(W.tag) !== -1 || X.push(W), V) : (R += W.value, V) : (V.push(W), V);
      }, []);
    },
    postparse: function(o, p, N) {
      function B(X, Q, V) {
        for (var W = [], ue = 0; ue < p.length; ue++) {
          var z = p[ue];
          W.push(z.getTraits(X, Q, V));
        }
        return W;
      }
      var R = [];
      function K(X, Q) {
        for (var V = X, W = 0; W < p.length; W++) {
          var ue = p[W], z = ue.postparse(V, t(t({}, Q), {}, {
            postparse: function(Ae, xe) {
              return K(Ae, t(t({}, Q), xe));
            },
            getTraits: B
          }));
          if (z != null) {
            if (z.errors) {
              M(R, z.errors), V = z.postparsed;
              continue;
            }
            V = z;
          }
        }
        return V;
      }
      return {
        postparsed: K(o, N),
        errors: R
      };
    }
  };
  return Wt = C, Wt;
}
var $t, cu;
function Da() {
  if (cu) return $t;
  cu = 1;
  function e(r, t) {
    if (r.lIndex == null)
      return null;
    var n = t.scopeManager.scopePathItem;
    r.parentPart && (n = n.slice(0, n.length - 1));
    var u = t.filePath + "@" + r.lIndex.toString() + "-" + n.join("-");
    return u;
  }
  return $t = e, $t;
}
var Qt, fu;
function ul() {
  if (fu) return Qt;
  fu = 1;
  var e = We, r = e.throwUnimplementedTagType, t = e.XTScopeParserError, n = Re, u = n.pushArray, a = Da();
  function i(l, y) {
    for (var A = 0, _ = y.modules; A < _.length; A++) {
      var q = _[A], j = q.render(l, y);
      if (j)
        return j;
    }
    return !1;
  }
  function f(l) {
    var y = l.baseNullGetter, A = l.compiled, _ = l.scopeManager;
    l.nullGetter = function(b, C) {
      return y(b, C || _);
    };
    for (var q = [], j = [], M = 0, P = A.length; M < P; M++) {
      var m = A[M];
      l.index = M, l.resolvedId = a(m, l);
      var d = void 0;
      try {
        d = i(m, l);
      } catch (b) {
        if (b instanceof t) {
          q.push(b), j.push(m);
          continue;
        }
        throw b;
      }
      if (d) {
        d.errors && u(q, d.errors), j.push(d);
        continue;
      }
      if (m.type === "content" || m.type === "tag") {
        j.push(m);
        continue;
      }
      r(m, M);
    }
    for (var x = [], c = 0; c < j.length; c++) {
      var v = j[c].value;
      v instanceof Array ? u(x, v) : v && x.push(v);
    }
    return {
      errors: q,
      parts: x
    };
  }
  return Qt = f, Qt;
}
var Kt, pu;
function al() {
  if (pu) return Kt;
  pu = 1;
  function e(t) {
    var n, u, a, i, f = 0, l = t.length;
    for (a = 0; a < l; a++)
      n = t.charCodeAt(a), (n & 64512) === 55296 && a + 1 < l && (u = t.charCodeAt(a + 1), (u & 64512) === 56320 && (n = 65536 + (n - 55296 << 10) + (u - 56320), a++)), f += n < 128 ? 1 : n < 2048 ? 2 : n < 65536 ? 3 : 4;
    var y = new Uint8Array(f);
    for (i = 0, a = 0; i < f; a++)
      n = t.charCodeAt(a), (n & 64512) === 55296 && a + 1 < l && (u = t.charCodeAt(a + 1), (u & 64512) === 56320 && (n = 65536 + (n - 55296 << 10) + (u - 56320), a++)), n < 128 ? y[i++] = n : n < 2048 ? (y[i++] = 192 | n >>> 6, y[i++] = 128 | n & 63) : n < 65536 ? (y[i++] = 224 | n >>> 12, y[i++] = 128 | n >>> 6 & 63, y[i++] = 128 | n & 63) : (y[i++] = 240 | n >>> 18, y[i++] = 128 | n >>> 12 & 63, y[i++] = 128 | n >>> 6 & 63, y[i++] = 128 | n & 63);
    return y;
  }
  function r(t, n) {
    for (var u = 0, a = n.modules; u < a.length; u++) {
      var i = a[u];
      t = i.postrender(t, n);
    }
    for (var f = 0, l = n.joinUncorrupt(t, n), y = "", A = 0, _ = 65536, q = [], j = 0, M = l.length; j < M; j++) {
      var P = l[j];
      if (P.length + A > _) {
        var m = e(y);
        f += m.length, q.push(m), y = "";
      }
      y += P, A += P.length, delete l[j];
    }
    var d = e(y);
    f += d.length, q.push(d);
    for (var x = new Uint8Array(f), c = 0, v = 0; v < q.length; v++) {
      for (var b = q[v], C = 0; C < b.length; ++C)
        x[C + c] = b[C];
      c += b.length;
    }
    return x;
  }
  return Kt = r, Kt;
}
var Zt, hu;
function ol() {
  if (hu) return Zt;
  hu = 1;
  function e(M) {
    "@babel/helpers - typeof";
    return e = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(P) {
      return typeof P;
    } : function(P) {
      return P && typeof Symbol == "function" && P.constructor === Symbol && P !== Symbol.prototype ? "symbol" : typeof P;
    }, e(M);
  }
  function r(M, P) {
    var m = Object.keys(M);
    if (Object.getOwnPropertySymbols) {
      var d = Object.getOwnPropertySymbols(M);
      P && (d = d.filter(function(x) {
        return Object.getOwnPropertyDescriptor(M, x).enumerable;
      })), m.push.apply(m, d);
    }
    return m;
  }
  function t(M) {
    for (var P = 1; P < arguments.length; P++) {
      var m = arguments[P] != null ? arguments[P] : {};
      P % 2 ? r(Object(m), !0).forEach(function(d) {
        n(M, d, m[d]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(M, Object.getOwnPropertyDescriptors(m)) : r(Object(m)).forEach(function(d) {
        Object.defineProperty(M, d, Object.getOwnPropertyDescriptor(m, d));
      });
    }
    return M;
  }
  function n(M, P, m) {
    return (P = u(P)) in M ? Object.defineProperty(M, P, { value: m, enumerable: !0, configurable: !0, writable: !0 }) : M[P] = m, M;
  }
  function u(M) {
    var P = a(M, "string");
    return e(P) == "symbol" ? P : P + "";
  }
  function a(M, P) {
    if (e(M) != "object" || !M) return M;
    var m = M[Symbol.toPrimitive];
    if (m !== void 0) {
      var d = m.call(M, P);
      if (e(d) != "object") return d;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (P === "string" ? String : Number)(M);
  }
  var i = Re, f = i.pushArray, l = Da();
  function y(M, P) {
    for (var m = 0, d = P.modules; m < d.length; m++) {
      var x = d[m], c = x.resolve(M, P);
      if (c)
        return c;
    }
    return !1;
  }
  function A(M, P, m, d) {
    var x = y(M, t(t({}, d), {}, {
      resolvedId: l(M, d)
    }));
    if (x)
      return x.then(function(c) {
        P.push({
          tag: M.value,
          lIndex: M.lIndex,
          value: c
        });
      }).catch(function(c) {
        c instanceof Array ? f(m, c) : m.push(c);
      });
    if (M.type === "placeholder")
      return d.scopeManager.getValueAsync(M.value, {
        part: M
      }).then(function(c) {
        return c ?? d.nullGetter(M);
      }).then(function(c) {
        P.push({
          tag: M.value,
          lIndex: M.lIndex,
          value: c
        });
      }).catch(function(c) {
        c instanceof Array ? f(m, c) : m.push(c);
      });
  }
  function _(M) {
    var P = [], m = [], d = M.baseNullGetter, x = M.scopeManager;
    M.nullGetter = function(v, b) {
      return d(v, b || x);
    }, M.resolved = P;
    var c = q(M, m, P);
    return c ? c.then(function() {
      return j(M, m, P);
    }) : j(M, m, P);
  }
  function q(M, P, m) {
    for (var d = null, x = function() {
      var C = v[c];
      if (["content", "tag"].indexOf(C.type) !== -1)
        return 1;
      C.resolveFirst && (d ?? (d = Promise.resolve(null)), d = d.then(function() {
        return A(C, m, P, M);
      }));
    }, c = 0, v = M.compiled; c < v.length; c++)
      x();
    return d;
  }
  function j(M, P, m) {
    for (var d = [], x = 0, c = M.compiled; x < c.length; x++) {
      var v = c[x];
      ["content", "tag"].indexOf(v.type) === -1 && (v.resolveFirst || d.push(A(v, m, P, M)));
    }
    return Promise.all(d).then(function() {
      return {
        errors: P,
        resolved: m
      };
    });
  }
  return Zt = _, Zt;
}
var Jt, du;
function il() {
  if (du) return Jt;
  du = 1;
  var e = Re, r = e.startsWith, t = e.endsWith, n = e.isStarting, u = e.isEnding, a = e.isWhiteSpace, i = Sn();
  function f(y) {
    for (var A = "", _ = 0, q = y.length; _ < q; _++) {
      var j = y[_];
      a(j) || r(j, "<w:bookmarkEnd") || (t(A, "</w:tbl>") && !r(j, "<w:p") && !r(j, "<w:tbl") && !r(j, "<w:sectPr") && // Tested by #regression-paragraph-after-table-header-footer
      !r(j, "</w:ftr>") && !r(j, "</w:hdr>") && (j = "<w:p/>".concat(j)), A = j, y[_] = j);
    }
    return y;
  }
  function l(y, A) {
    var _ = A.fileTypeConfig.tagShouldContain || [], q = "", j = -1;
    i.docx.indexOf(A.contentType) !== -1 && (y = f(y));
    for (var M = -1, P = 0, m = _.length; P < m; P++)
      for (var d = _[P], x = d.tag, c = d.shouldContain, v = d.value, b = d.drop, C = d.dropParent, g = 0, o = y.length; g < o; g++) {
        var p = y[g];
        if (j === P) {
          if (u(p, x))
            if (j = -1, C) {
              for (var N = -1, B = M; B > 0; B--)
                if (n(y[B], C)) {
                  N = B;
                  break;
                }
              for (var R = N; R <= y.length; R++) {
                if (u(y[R], C)) {
                  y[R] = "";
                  break;
                }
                y[R] = "";
              }
            } else {
              for (var K = M; K <= g; K++)
                y[K] = "";
              b || (y[g] = q + v + p);
            }
          q += p;
          for (var X = 0, Q = c.length; X < Q; X++) {
            var V = c[X];
            if (n(p, V)) {
              j = -1;
              break;
            }
          }
        }
        j === -1 && n(p, x) && /*
         * To verify that the part doesn't have multiple tags,
         * such as <w:tc><w:p>
         */
        p.substr(1).indexOf("<") === -1 && (p[p.length - 2] === "/" ? y[g] = "" : (M = g, j = P, q = p));
      }
    return y;
  }
  return Jt = l, Jt;
}
var en, vu;
function sl() {
  if (vu) return en;
  vu = 1;
  function e(x) {
    "@babel/helpers - typeof";
    return e = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(c) {
      return typeof c;
    } : function(c) {
      return c && typeof Symbol == "function" && c.constructor === Symbol && c !== Symbol.prototype ? "symbol" : typeof c;
    }, e(x);
  }
  function r(x, c) {
    if (!(x instanceof c)) throw new TypeError("Cannot call a class as a function");
  }
  function t(x, c) {
    for (var v = 0; v < c.length; v++) {
      var b = c[v];
      b.enumerable = b.enumerable || !1, b.configurable = !0, "value" in b && (b.writable = !0), Object.defineProperty(x, u(b.key), b);
    }
  }
  function n(x, c, v) {
    return c && t(x.prototype, c), Object.defineProperty(x, "prototype", { writable: !1 }), x;
  }
  function u(x) {
    var c = a(x, "string");
    return e(c) == "symbol" ? c : c + "";
  }
  function a(x, c) {
    if (e(x) != "object" || !x) return x;
    var v = x[Symbol.toPrimitive];
    if (v !== void 0) {
      var b = v.call(x, c);
      if (e(b) != "object") return b;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return String(x);
  }
  var i = Re, f = i.pushArray, l = i.wordToUtf8, y = i.convertSpaces, A = Ta(), _ = Ea(), q = nl(), j = ul(), M = al(), P = ol(), m = il();
  function d(x, c) {
    var v = A(x, c), b = v.matches.map(function(C) {
      return C.array[2];
    });
    return l(y(b.join("")));
  }
  return en = /* @__PURE__ */ function() {
    function x(c, v) {
      r(this, x), this.cachedParsers = {}, this.content = c;
      for (var b in v)
        this[b] = v[b];
      this.setModules({
        inspect: {
          filePath: v.filePath
        }
      });
    }
    return n(x, [{
      key: "resolveTags",
      value: function(v) {
        var b = this;
        this.tags = v;
        var C = this.getOptions(), g = this.filePath;
        C.scopeManager = this.scopeManager, C.resolve = P;
        var o = [];
        return Promise.all(this.modules.map(function(p) {
          return Promise.resolve(p.preResolve(C)).catch(function(N) {
            o.push(N);
          });
        })).then(function() {
          if (o.length !== 0)
            throw o;
          return P(C).then(function(p) {
            var N = p.resolved, B = p.errors;
            if (B = B.map(function(R) {
              var K;
              return R instanceof Error || (R = new Error(R)), (K = R).properties || (K.properties = {}), R.properties.file = g, R;
            }), B.length !== 0)
              throw B;
            return Promise.all(N).then(function(R) {
              return C.scopeManager.root.finishedResolving = !0, C.scopeManager.resolved = R, b.setModules({
                inspect: {
                  resolved: R,
                  filePath: g
                }
              }), R;
            });
          }).catch(function(p) {
            throw b.errorChecker(p), p;
          });
        });
      }
    }, {
      key: "getFullText",
      value: function() {
        return d(this.content, this.fileTypeConfig.tagsXmlTextArray);
      }
    }, {
      key: "setModules",
      value: function(v) {
        for (var b = 0, C = this.modules; b < C.length; b++) {
          var g = C[b];
          g.set(v);
        }
      }
    }, {
      key: "preparse",
      value: function() {
        this.allErrors = [], this.xmllexed = _.xmlparse(this.content, {
          text: this.fileTypeConfig.tagsXmlTextArray,
          other: this.fileTypeConfig.tagsXmlLexedArray
        }), this.setModules({
          inspect: {
            filePath: this.filePath,
            xmllexed: this.xmllexed
          }
        });
        var v = _.parse(this.xmllexed, this.delimiters, this.syntax, this.fileType), b = v.lexed, C = v.errors;
        f(this.allErrors, C), this.lexed = b, this.setModules({
          inspect: {
            filePath: this.filePath,
            lexed: this.lexed
          }
        });
        var g = this.getOptions();
        this.lexed = q.preparse(this.lexed, this.modules, g);
      }
    }, {
      key: "parse",
      value: function() {
        var v = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, b = v.noPostParse;
        this.setModules({
          inspect: {
            filePath: this.filePath
          }
        });
        var C = this.getOptions();
        return this.parsed = q.parse(this.lexed, this.modules, C), this.setModules({
          inspect: {
            filePath: this.filePath,
            parsed: this.parsed
          }
        }), b ? this : this.postparse();
      }
    }, {
      key: "postparse",
      value: function() {
        var v = this.getOptions(), b = q.postparse(this.parsed, this.modules, v), C = b.postparsed, g = b.errors;
        return this.postparsed = C, this.setModules({
          inspect: {
            filePath: this.filePath,
            postparsed: this.postparsed
          }
        }), f(this.allErrors, g), this.errorChecker(this.allErrors), this;
      }
    }, {
      key: "errorChecker",
      value: function(v) {
        for (var b = 0, C = v; b < C.length; b++) {
          var g = C[b];
          g.properties || (g.properties = {}), g.properties.file = this.filePath;
        }
        for (var o = 0, p = this.modules; o < p.length; o++) {
          var N = p[o];
          v = N.errorsTransformer(v);
        }
      }
    }, {
      key: "baseNullGetter",
      value: function(v, b) {
        for (var C = null, g = 0, o = this.modules; g < o.length; g++) {
          var p = o[g];
          C == null && (C = p.nullGetter(v, b, this));
        }
        return C ?? this.nullGetter(v, b);
      }
    }, {
      key: "getOptions",
      value: function() {
        return {
          compiled: this.postparsed,
          cachedParsers: this.cachedParsers,
          tags: this.tags,
          modules: this.modules,
          parser: this.parser,
          contentType: this.contentType,
          relsType: this.relsType,
          baseNullGetter: this.baseNullGetter.bind(this),
          filePath: this.filePath,
          fileTypeConfig: this.fileTypeConfig,
          fileType: this.fileType,
          linebreaks: this.linebreaks,
          stripInvalidXMLChars: this.stripInvalidXMLChars
        };
      }
    }, {
      key: "render",
      value: function(v) {
        this.filePath = v;
        var b = this.getOptions();
        b.resolved = this.scopeManager.resolved, b.scopeManager = this.scopeManager, b.render = j, b.joinUncorrupt = m;
        var C = j(b), g = C.errors, o = C.parts;
        return g.length > 0 ? (this.allErrors = g, this.errorChecker(g), this) : (this.content = M(o, b), this.setModules({
          inspect: {
            filePath: this.filePath,
            content: this.content
          }
        }), this);
      }
    }]);
  }(), en;
}
var rn, gu;
function ll() {
  if (gu) return rn;
  gu = 1;
  function e(T) {
    "@babel/helpers - typeof";
    return e = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(w) {
      return typeof w;
    } : function(w) {
      return w && typeof Symbol == "function" && w.constructor === Symbol && w !== Symbol.prototype ? "symbol" : typeof w;
    }, e(T);
  }
  function r(T, w) {
    var E = Object.keys(T);
    if (Object.getOwnPropertySymbols) {
      var k = Object.getOwnPropertySymbols(T);
      w && (k = k.filter(function(U) {
        return Object.getOwnPropertyDescriptor(T, U).enumerable;
      })), E.push.apply(E, k);
    }
    return E;
  }
  function t(T) {
    for (var w = 1; w < arguments.length; w++) {
      var E = arguments[w] != null ? arguments[w] : {};
      w % 2 ? r(Object(E), !0).forEach(function(k) {
        n(T, k, E[k]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(T, Object.getOwnPropertyDescriptors(E)) : r(Object(E)).forEach(function(k) {
        Object.defineProperty(T, k, Object.getOwnPropertyDescriptor(E, k));
      });
    }
    return T;
  }
  function n(T, w, E) {
    return (w = j(w)) in T ? Object.defineProperty(T, w, { value: E, enumerable: !0, configurable: !0, writable: !0 }) : T[w] = E, T;
  }
  function u(T, w) {
    return y(T) || l(T, w) || i(T, w) || a();
  }
  function a() {
    throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }
  function i(T, w) {
    if (T) {
      if (typeof T == "string") return f(T, w);
      var E = {}.toString.call(T).slice(8, -1);
      return E === "Object" && T.constructor && (E = T.constructor.name), E === "Map" || E === "Set" ? Array.from(T) : E === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(E) ? f(T, w) : void 0;
    }
  }
  function f(T, w) {
    (w == null || w > T.length) && (w = T.length);
    for (var E = 0, k = Array(w); E < w; E++) k[E] = T[E];
    return k;
  }
  function l(T, w) {
    var E = T == null ? null : typeof Symbol < "u" && T[Symbol.iterator] || T["@@iterator"];
    if (E != null) {
      var k, U, ie, se, de = [], te = !0, we = !1;
      try {
        if (ie = (E = E.call(T)).next, w !== 0) for (; !(te = (k = ie.call(E)).done) && (de.push(k.value), de.length !== w); te = !0) ;
      } catch (ye) {
        we = !0, U = ye;
      } finally {
        try {
          if (!te && E.return != null && (se = E.return(), Object(se) !== se)) return;
        } finally {
          if (we) throw U;
        }
      }
      return de;
    }
  }
  function y(T) {
    if (Array.isArray(T)) return T;
  }
  function A(T, w) {
    if (!(T instanceof w)) throw new TypeError("Cannot call a class as a function");
  }
  function _(T, w) {
    for (var E = 0; E < w.length; E++) {
      var k = w[E];
      k.enumerable = k.enumerable || !1, k.configurable = !0, "value" in k && (k.writable = !0), Object.defineProperty(T, j(k.key), k);
    }
  }
  function q(T, w, E) {
    return w && _(T.prototype, w), Object.defineProperty(T, "prototype", { writable: !1 }), T;
  }
  function j(T) {
    var w = M(T, "string");
    return e(w) == "symbol" ? w : w + "";
  }
  function M(T, w) {
    if (e(T) != "object" || !T) return T;
    var E = T[Symbol.toPrimitive];
    if (E !== void 0) {
      var k = E.call(T, w);
      if (e(k) != "object") return k;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return String(T);
  }
  var P = Re, m = P.chunkBy, d = P.last, x = P.isParagraphStart, c = P.isModule, v = P.pushArray, b = P.isParagraphEnd, C = P.isContent, g = P.startsWith, o = P.isTagEnd, p = P.isTagStart, N = P.getSingleAttribute, B = P.setSingleAttribute, R = Sn(), K = Er(), X = "loop";
  function Q(T) {
    for (var w = 0; w < T.length; w++) {
      var E = T[w];
      if (C(E))
        return !0;
    }
    return !1;
  }
  function V(T) {
    for (var w = 0; w < T.length; w++) {
      var E = T[w];
      if (E.type !== "content")
        return E;
    }
    return null;
  }
  function W(T) {
    var w = V(T.subparsed);
    return w != null && w.tag !== "w:t";
  }
  function ue(T) {
    return T.hasPageBreak && W(T) ? '<w:p><w:r><w:br w:type="page"/></w:r></w:p>' : "";
  }
  function z(T) {
    return T.length && x(T[0]) && b(d(T));
  }
  function oe(T) {
    return Q(T) ? 0 : T.length;
  }
  function Ae(T) {
    var w = T.parts.length - 1;
    T.parts[w] === "</w:p>" ? T.parts.splice(w, 0, '<w:r><w:br w:type="page"/></w:r>') : T.parts.push('<w:p><w:r><w:br w:type="page"/></w:r></w:p>');
  }
  function xe(T) {
    T.parts.unshift('<w:p><w:r><w:br w:type="page"/></w:r></w:p>');
  }
  function Le(T) {
    for (var w = 0; w < T.length; w++) {
      var E = T[w];
      if (p("w:type", E) && E.value.indexOf("continuous") !== -1)
        return !0;
    }
    return !1;
  }
  function ze(T) {
    for (var w = 0; w < T.length; w++) {
      var E = T[w];
      if (p("w:type", E) && E.value.indexOf('w:val="nextPage"') !== -1)
        return !0;
    }
    return !1;
  }
  function s(T, w) {
    T.unshift("<w:p><w:pPr>".concat(w.map(function(E) {
      var k = E.value;
      return k;
    }).join(""), "</w:pPr></w:p>"));
  }
  function h(T) {
    for (var w = !1, E = !1, k = 0; k < T.length; k++) {
      var U = T[k];
      !w && g(U, "<w:sectPr") && (E = !0), E && (g(U, "<w:type") && (w = !0), !w && g(U, "</w:sectPr") && (T.splice(k, 0, '<w:type w:val="continuous"/>'), k++));
    }
    return T;
  }
  function S(T) {
    for (var w = 0, E = 0; E < T.length; E++)
      !g(T[E], "<w:headerReference") && !g(T[E], "<w:footerReference") && (T[w] = T[E], w++);
    return T.length = w, T;
  }
  function O(T) {
    for (var w = 0; w < T.length; w++) {
      var E = T[w];
      if (E.tag === "w:br" && E.value.indexOf('w:type="page"') !== -1)
        return !0;
    }
    return !1;
  }
  function G(T) {
    for (var w = 0; w < T.length; w++) {
      var E = T[w];
      if (E.tag === "w:drawing")
        return !0;
    }
    return !1;
  }
  function Y(T) {
    for (var w = [], E = null, k = 0; k < T.length; k++) {
      var U = T[k];
      p("w:sectPr", U) && (E = [], w.push(E)), E !== null && E.push(U), o("w:sectPr", U) && (E = null);
    }
    return w;
  }
  function H(T) {
    for (var w = !1, E = 0, k = 0; k < T.length; k++) {
      var U = T[k];
      p("w:sectPr", U) && (w = !0), w && (U.tag === "w:headerReference" || U.tag === "w:footerReference") && (E++, w = !1), o("w:sectPr", U) && (w = !1);
    }
    return E;
  }
  function J(T) {
    for (var w = [], E = !1, k = T.length - 1; k >= 0; k--) {
      var U = T[k];
      if (o("w:sectPr", U) && (E = !0), p("w:sectPr", U) && (w.unshift(U.value), E = !1), E && w.unshift(U.value), x(U)) {
        if (w.length > 0)
          return w.join("");
        break;
      }
    }
    return "";
  }
  var ee = /* @__PURE__ */ function() {
    function T() {
      A(this, T), this.name = "LoopModule", this.inXfrm = !1, this.totalSectPr = 0, this.prefix = {
        start: "#",
        end: "/",
        dash: /^-([^\s]+)\s(.+)/,
        inverted: "^"
      };
    }
    return q(T, [{
      key: "optionsTransformer",
      value: function(E, k) {
        return this.docxtemplater = k, E;
      }
    }, {
      key: "preparse",
      value: function(E, k) {
        var U = k.contentType;
        R.main.indexOf(U) !== -1 && (this.sects = Y(E));
      }
    }, {
      key: "matchers",
      value: function() {
        var E = X;
        return [[this.prefix.start, E, {
          expandTo: "auto",
          location: "start",
          inverted: !1
        }], [this.prefix.inverted, E, {
          expandTo: "auto",
          location: "start",
          inverted: !0
        }], [this.prefix.end, E, {
          location: "end"
        }], [this.prefix.dash, E, function(k) {
          var U = u(k, 3), ie = U[1], se = U[2];
          return {
            location: "start",
            inverted: !1,
            expandTo: ie,
            value: se
          };
        }]];
      }
    }, {
      key: "getTraits",
      value: function(E, k) {
        if (E === "expandPair") {
          for (var U = [], ie = 0, se = k.length; ie < se; ie++) {
            var de = k[ie];
            c(de, X) && de.subparsed == null && U.push({
              part: de,
              offset: ie
            });
          }
          return U;
        }
      }
      /* eslint-disable-next-line complexity */
    }, {
      key: "postparse",
      value: function(E, k) {
        var U = k.basePart;
        if (U && this.docxtemplater.fileType === "docx" && E.length > 0) {
          U.sectPrCount = H(E), this.totalSectPr += U.sectPrCount;
          for (var ie = this.sects, se = 0, de = ie.length; se < de; se++) {
            var te = ie[se];
            if (U.lIndex < te[0].lIndex) {
              se + 1 < ie.length && Le(ie[se + 1]) && (U.addContinuousType = !0);
              break;
            }
            if (E[0].lIndex < te[0].lIndex && te[0].lIndex < U.lIndex) {
              ze(ie[se]) && (U.addNextPage = {
                index: se
              });
              break;
            }
          }
          U.lastParagrapSectPr = J(E);
        }
        if (!U || U.expandTo !== "auto" || U.module !== X || !z(E))
          return E;
        U.paragraphLoop = !0;
        var we = 0, ye = m(E, function(Ue) {
          return x(Ue) && (we++, we === 1) ? "start" : b(Ue) && (we--, we === 0) ? "end" : null;
        }), pe = ye[0], Ee = d(ye), Te = oe(pe), be = oe(Ee);
        return U.hasPageBreakBeginning = O(pe), U.hasPageBreak = O(Ee), G(pe) && (Te = 0), G(Ee) && (be = 0), E.slice(Te, E.length - be);
      }
    }, {
      key: "resolve",
      value: function(E, k) {
        var U = this;
        if (!c(E, X))
          return null;
        var ie = k.scopeManager, se = ie.getValueAsync(E.value, {
          part: E
        }), de = [], te;
        U.resolveSerially && (te = Promise.resolve(null));
        function we(pe, Ee, Te) {
          var be = ie.createSubScopeManager(pe, E.value, Ee, E, Te);
          U.resolveSerially ? (te = te.then(function() {
            return k.resolve(t(t({}, k), {}, {
              compiled: E.subparsed,
              tags: {},
              scopeManager: be
            }));
          }), de.push(te)) : de.push(k.resolve(t(t({}, k), {}, {
            compiled: E.subparsed,
            tags: {},
            scopeManager: be
          })));
        }
        var ye = [];
        return se.then(function(pe) {
          return pe ?? (pe = k.nullGetter(E)), pe instanceof Promise ? pe.then(function(Ee) {
            return Ee instanceof Array ? Promise.all(Ee) : Ee;
          }) : pe instanceof Array ? Promise.all(pe) : pe;
        }).then(function(pe) {
          return ie.loopOverValue(pe, we, E.inverted), Promise.all(de).then(function(Ee) {
            return Ee.map(function(Te) {
              var be = Te.resolved, Ue = Te.errors;
              return v(ye, Ue), be;
            });
          }).then(function(Ee) {
            if (ye.length > 0)
              throw ye;
            return Ee;
          });
        });
      }
    }, {
      key: "render",
      value: function(E, k) {
        var U = this;
        if (E.tag === "p:xfrm" && (U.inXfrm = E.position === "start"), E.tag === "a:ext" && U.inXfrm)
          return U.lastExt = E, E;
        if (!c(E, X))
          return null;
        var ie = [], se = [], de = 0, te = E.subparsed[0], we = 0;
        (te == null ? void 0 : te.tag) === "a:tr" && (we = +N(te.value, "h")), de -= we;
        var ye = 0, pe = W(E);
        function Ee($e, cr, Qe) {
          de += we;
          for (var F = k.scopeManager.createSubScopeManager($e, E.value, cr, E, Qe), L = 0, D = E.subparsed; L < D.length; L++) {
            var I = D[L];
            if (p("a16:rowId", I)) {
              var $ = +N(I.value, "val") + ye;
              ye = 1, I.value = B(I.value, "val", $);
            }
          }
          var Z = k.render(t(t({}, k), {}, {
            compiled: E.subparsed,
            tags: {},
            scopeManager: F
          }));
          E.hasPageBreak && cr === Qe - 1 && pe && Ae(Z);
          var ce = F.scopePathItem.some(function(_e) {
            return _e !== 0;
          });
          ce ? (E.sectPrCount === 1 && (Z.parts = S(Z.parts)), E.addContinuousType && (Z.parts = h(Z.parts))) : E.addNextPage && s(Z.parts, U.sects[E.addNextPage.index]), E.addNextPage && Ae(Z), E.hasPageBreakBeginning && pe && xe(Z);
          for (var ae = 0, ve = Z.parts; ae < ve.length; ae++) {
            var Se = ve[ae];
            ie.push(Se);
          }
          v(se, Z.errors);
        }
        var Te = k.scopeManager.getValue(E.value, {
          part: E
        });
        Te ?? (Te = k.nullGetter(E));
        var be = k.scopeManager.loopOverValue(Te, Ee, E.inverted);
        if (be === !1)
          return E.lastParagrapSectPr ? E.paragraphLoop ? {
            value: "<w:p><w:pPr>".concat(E.lastParagrapSectPr, "</w:pPr></w:p>")
          } : {
            value: "</w:t></w:r></w:p><w:p><w:pPr>".concat(E.lastParagrapSectPr, "</w:pPr><w:r><w:t>")
          } : {
            value: ue(E) || "",
            errors: se
          };
        if (de !== 0) {
          var Ue = +N(U.lastExt.value, "cy");
          U.lastExt.value = B(U.lastExt.value, "cy", Ue + de);
        }
        return {
          value: k.joinUncorrupt(ie, t(t({}, k), {}, {
            basePart: E
          })),
          errors: se
        };
      }
    }]);
  }();
  return rn = function() {
    return K(new ee());
  }, rn;
}
var tn, mu;
function cl() {
  if (mu) return tn;
  mu = 1;
  function e(b) {
    "@babel/helpers - typeof";
    return e = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(C) {
      return typeof C;
    } : function(C) {
      return C && typeof Symbol == "function" && C.constructor === Symbol && C !== Symbol.prototype ? "symbol" : typeof C;
    }, e(b);
  }
  function r(b, C) {
    if (!(b instanceof C)) throw new TypeError("Cannot call a class as a function");
  }
  function t(b, C) {
    for (var g = 0; g < C.length; g++) {
      var o = C[g];
      o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(b, u(o.key), o);
    }
  }
  function n(b, C, g) {
    return C && t(b.prototype, C), Object.defineProperty(b, "prototype", { writable: !1 }), b;
  }
  function u(b) {
    var C = a(b, "string");
    return e(C) == "symbol" ? C : C + "";
  }
  function a(b, C) {
    if (e(b) != "object" || !b) return b;
    var g = b[Symbol.toPrimitive];
    if (g !== void 0) {
      var o = g.call(b, C);
      if (e(o) != "object") return o;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return String(b);
  }
  var i = Er(), f = Re, l = f.isTextStart, y = f.isTextEnd, A = f.endsWith, _ = f.startsWith, q = f.pushArray, j = '<w:t xml:space="preserve">', M = j.length, P = "</w:t>", m = P.length;
  function d(b) {
    return l(b) && b.tag === "w:t";
  }
  function x(b, C) {
    var g = b[C].value;
    return b[C + 1].value === "</w:t>" || g.indexOf('xml:space="preserve"') !== -1 ? g : g.substr(0, g.length - 1) + ' xml:space="preserve">';
  }
  function c(b, C) {
    return b && b.basePart && C.length > 1;
  }
  var v = /* @__PURE__ */ function() {
    function b() {
      r(this, b), this.name = "SpacePreserveModule";
    }
    return n(b, [{
      key: "postparse",
      value: function(g, o) {
        var p = [], N = !1, B = 0, R = 0;
        function K(Q, V) {
          return Q.type === "placeholder" && V.length > 1;
        }
        var X = g.reduce(function(Q, V) {
          return d(V) && (N = !0, R = p.length), N ? (p.push(V), c(o, p) && (B = o.basePart.endLindex, p[0].value = x(p, 0)), K(V, p) && (p[R].value = x(p, R), B = V.endLindex), y(V) && V.lIndex > B && (B !== 0 && (p[R].value = x(p, R)), q(Q, p), p = [], N = !1, B = 0, R = 0), Q) : (Q.push(V), Q);
        }, []);
        return q(X, p), X;
      }
    }, {
      key: "postrender",
      value: function(g) {
        for (var o = "", p = 0, N = 0, B = g.length; N < B; N++) {
          var R = g[N];
          R !== "" && (A(o, j) && _(R, P) && (g[p] = o.substr(0, o.length - M) + "<w:t/>", R = R.substr(m)), o = R, p = N, g[N] = R);
        }
        return g;
      }
    }]);
  }();
  return tn = function() {
    return i(new v());
  }, tn;
}
var nn, yu;
function fl() {
  if (yu) return nn;
  yu = 1;
  function e(m) {
    "@babel/helpers - typeof";
    return e = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(d) {
      return typeof d;
    } : function(d) {
      return d && typeof Symbol == "function" && d.constructor === Symbol && d !== Symbol.prototype ? "symbol" : typeof d;
    }, e(m);
  }
  function r(m, d) {
    if (!(m instanceof d)) throw new TypeError("Cannot call a class as a function");
  }
  function t(m, d) {
    for (var x = 0; x < d.length; x++) {
      var c = d[x];
      c.enumerable = c.enumerable || !1, c.configurable = !0, "value" in c && (c.writable = !0), Object.defineProperty(m, u(c.key), c);
    }
  }
  function n(m, d, x) {
    return d && t(m.prototype, d), Object.defineProperty(m, "prototype", { writable: !1 }), m;
  }
  function u(m) {
    var d = a(m, "string");
    return e(d) == "symbol" ? d : d + "";
  }
  function a(m, d) {
    if (e(m) != "object" || !m) return m;
    var x = m[Symbol.toPrimitive];
    if (x !== void 0) {
      var c = x.call(m, d);
      if (e(c) != "object") return c;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return String(m);
  }
  var i = xn(), f = Re, l = f.isContent, y = We, A = y.throwRawTagShouldBeOnlyTextInParagraph, _ = y.getInvalidRawXMLValueException, q = Er(), j = "rawxml";
  function M(m) {
    for (var d = m.part, x = m.left, c = m.right, v = m.postparsed, b = m.index, C = v.slice(x + 1, c), g = 0, o = C.length; g < o; g++)
      if (g !== b - x - 1) {
        var p = C[g];
        l(p) && A({
          paragraphParts: C,
          part: d
        });
      }
    return d;
  }
  var P = /* @__PURE__ */ function() {
    function m() {
      r(this, m), this.name = "RawXmlModule", this.prefix = "@";
    }
    return n(m, [{
      key: "optionsTransformer",
      value: function(x, c) {
        return this.fileTypeConfig = c.fileTypeConfig, x;
      }
    }, {
      key: "matchers",
      value: function() {
        return [[this.prefix, j]];
      }
    }, {
      key: "postparse",
      value: function(x) {
        return i.expandToOne(x, {
          moduleName: j,
          getInner: M,
          expandTo: this.fileTypeConfig.tagRawXml,
          error: {
            message: "Raw tag not in paragraph",
            id: "raw_tag_outerxml_invalid",
            explanation: function(v) {
              return 'The tag "'.concat(v.value, '" is not inside a paragraph, putting raw tags inside an inline loop is disallowed.');
            }
          }
        });
      }
    }, {
      key: "render",
      value: function(x, c) {
        if (x.module !== j)
          return null;
        var v, b = [];
        try {
          v = c.scopeManager.getValue(x.value, {
            part: x
          }), v ?? (v = c.nullGetter(x));
        } catch (C) {
          return b.push(C), {
            errors: b
          };
        }
        return v = v || "", typeof v == "string" ? {
          value: v
        } : {
          errors: [_({
            tag: x.value,
            value: v,
            offset: x.offset
          })]
        };
      }
    }]);
  }();
  return nn = function() {
    return q(new P());
  }, nn;
}
var un, Eu;
function pl() {
  if (Eu) return un;
  Eu = 1;
  function e(r, t) {
    for (var n = -1, u = 0, a = r.length; u < a; u++)
      t[u] >= r[u].length || (n === -1 || r[u][t[u]].offset < r[n][t[n]].offset) && (n = u);
    return n;
  }
  return un = function(r) {
    for (var t = 0, n = 0, u = r; n < u.length; n++) {
      var a = u[n];
      t += a.length;
    }
    r = r.filter(function(A) {
      return A.length > 0;
    });
    for (var i = new Array(t), f = r.map(function() {
      return 0;
    }), l = 0; l < t; l++) {
      var y = e(r, f);
      i[l] = r[y][f[y]], f[y]++;
    }
    return i;
  }, un;
}
var an, Tu;
function hl() {
  if (Tu) return an;
  Tu = 1;
  function e(o) {
    "@babel/helpers - typeof";
    return e = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(p) {
      return typeof p;
    } : function(p) {
      return p && typeof Symbol == "function" && p.constructor === Symbol && p !== Symbol.prototype ? "symbol" : typeof p;
    }, e(o);
  }
  function r(o, p) {
    if (!(o instanceof p)) throw new TypeError("Cannot call a class as a function");
  }
  function t(o, p) {
    for (var N = 0; N < p.length; N++) {
      var B = p[N];
      B.enumerable = B.enumerable || !1, B.configurable = !0, "value" in B && (B.writable = !0), Object.defineProperty(o, u(B.key), B);
    }
  }
  function n(o, p, N) {
    return p && t(o.prototype, p), Object.defineProperty(o, "prototype", { writable: !1 }), o;
  }
  function u(o) {
    var p = a(o, "string");
    return e(p) == "symbol" ? p : p + "";
  }
  function a(o, p) {
    if (e(o) != "object" || !o) return o;
    var N = o[Symbol.toPrimitive];
    if (N !== void 0) {
      var B = N.call(o, p);
      if (e(B) != "object") return B;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return String(o);
  }
  var i = "expandPair", f = pl(), l = Re, y = l.getLeft, A = l.getRight, _ = l.pushArray, q = Er(), j = xn(), M = j.getExpandToDefault, P = We, m = P.getUnmatchedLoopException, d = P.getClosingTagNotMatchOpeningTag, x = P.getUnbalancedLoopException;
  function c(o) {
    switch (o.location) {
      case "start":
        return 1;
      case "end":
        return -1;
    }
  }
  function v(o, p) {
    return o != null && p != null && (o.part.location === "start" && p.part.location === "end" && o.part.value === p.part.value || p.part.value === "");
  }
  function b(o) {
    for (var p = 0, N = []; p < o.length; ) {
      var B = o[p].part;
      if (B.location === "end") {
        if (p === 0)
          return o.splice(0, 1), N.push(m(B)), {
            traits: o,
            errors: N
          };
        var R = p, K = p - 1, X = 1;
        if (v(o[K], o[R]))
          return o.splice(R, 1), o.splice(K, 1), {
            errors: N,
            traits: o
          };
        for (; X < 50; ) {
          var Q = o[K - X], V = o[R + X];
          if (v(Q, o[R]))
            return o.splice(R, 1), o.splice(K - X, 1), {
              errors: N,
              traits: o
            };
          if (v(o[K], V))
            return o.splice(R + X, 1), o.splice(K, 1), {
              errors: N,
              traits: o
            };
          X++;
        }
        return N.push(d({
          tags: [o[K].part, o[R].part]
        })), o.splice(R, 1), o.splice(K, 1), {
          traits: o,
          errors: N
        };
      }
      p++;
    }
    for (var W = 0; W < o.length; W++) {
      var ue = o[W].part;
      N.push(m(ue));
    }
    return {
      traits: [],
      errors: N
    };
  }
  function C(o) {
    var p = {}, N = [], B = [], R = [];
    for (_(R, o); R.length > 0; ) {
      var K = b(R);
      _(N, K.errors), R = K.traits;
    }
    if (N.length > 0)
      return {
        pairs: B,
        errors: N
      };
    for (var X = 0, Q = 0; Q < o.length; Q++) {
      var V = o[Q], W = V.part, ue = c(W);
      if (X += ue, ue === 1)
        p[X] = V;
      else {
        var z = p[X + 1];
        X === 0 && B.push([z, V]);
      }
      X = X >= 0 ? X : 0;
    }
    return {
      pairs: B,
      errors: N
    };
  }
  var g = /* @__PURE__ */ function() {
    function o() {
      r(this, o), this.name = "ExpandPairTrait";
    }
    return n(o, [{
      key: "optionsTransformer",
      value: function(N, B) {
        return B.options.paragraphLoop && _(B.fileTypeConfig.expandTags, B.fileTypeConfig.onParagraphLoop), this.expandTags = B.fileTypeConfig.expandTags, N;
      }
    }, {
      key: "postparse",
      value: function(N, B) {
        var R = this, K = B.getTraits, X = B.postparse, Q = B.fileType, V = K(i, N, B);
        V = V.map(function(h) {
          return h || [];
        }), V = f(V);
        var W = C(V), ue = W.pairs, z = W.errors, oe = 0, Ae = null, xe = ue.map(function(h) {
          var S = h[0].part.expandTo;
          if (S === "auto" && Q !== "text") {
            var O = M(N, h, R.expandTags);
            O.error && z.push(O.error), S = O.value;
          }
          if (!S || Q === "text") {
            var G = h[0].offset, Y = h[1].offset;
            return G < oe && !R.docxtemplater.options.syntax.allowUnbalancedLoops && z.push(x(h, Ae)), Ae = h, oe = Y, [G, Y];
          }
          var H, J;
          try {
            H = y(N, S, h[0].offset);
          } catch (ee) {
            z.push(ee);
          }
          try {
            J = A(N, S, h[1].offset);
          } catch (ee) {
            z.push(ee);
          }
          return H < oe && !R.docxtemplater.options.syntax.allowUnbalancedLoops && z.push(x(h, Ae)), oe = J, Ae = h, [H, J];
        });
        if (z.length > 0)
          return {
            postparsed: N,
            errors: z
          };
        var Le = 0, ze, s = N.reduce(function(h, S, O) {
          var G = Le < ue.length && xe[Le][0] <= O && O <= xe[Le][1], Y = ue[Le], H = xe[Le];
          if (!G)
            return h.push(S), h;
          if (H[0] === O && (ze = []), Y[0].offset !== O && Y[1].offset !== O && ze.push(S), H[1] === O) {
            var J = N[Y[0].offset];
            J.subparsed = X(ze, {
              basePart: J
            }), J.endLindex = Y[1].part.lIndex, delete J.location, delete J.expandTo, h.push(J), Le++;
            for (var ee = xe[Le]; ee && ee[0] < O; )
              Le++, ee = xe[Le];
          }
          return h;
        }, []);
        return {
          postparsed: s,
          errors: z
        };
      }
    }]);
  }();
  return an = function() {
    return q(new g());
  }, an;
}
var on, Du;
function dl() {
  if (Du) return on;
  Du = 1;
  function e(C) {
    "@babel/helpers - typeof";
    return e = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(g) {
      return typeof g;
    } : function(g) {
      return g && typeof Symbol == "function" && g.constructor === Symbol && g !== Symbol.prototype ? "symbol" : typeof g;
    }, e(C);
  }
  function r(C, g) {
    if (!(C instanceof g)) throw new TypeError("Cannot call a class as a function");
  }
  function t(C, g) {
    for (var o = 0; o < g.length; o++) {
      var p = g[o];
      p.enumerable = p.enumerable || !1, p.configurable = !0, "value" in p && (p.writable = !0), Object.defineProperty(C, u(p.key), p);
    }
  }
  function n(C, g, o) {
    return g && t(C.prototype, g), Object.defineProperty(C, "prototype", { writable: !1 }), C;
  }
  function u(C) {
    var g = a(C, "string");
    return e(g) == "symbol" ? g : g + "";
  }
  function a(C, g) {
    if (e(C) != "object" || !C) return C;
    var o = C[Symbol.toPrimitive];
    if (o !== void 0) {
      var p = o.call(C, g);
      if (e(p) != "object") return p;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return String(C);
  }
  var i = Er(), f = We, l = f.getScopeCompilationError, y = f.getCorruptCharactersException, A = Re, _ = A.utf8ToWord, q = A.hasCorruptCharacters, j = A.removeCorruptCharacters, M = ya(), P = M.settingsContentType, m = M.coreContentType, d = M.appContentType, x = M.customContentType, c = [P, m, d, x], v = {
    docx: "w",
    pptx: "a"
  }, b = /* @__PURE__ */ function() {
    function C() {
      r(this, C), this.name = "Render", this.recordRun = !1, this.recordedRun = [];
    }
    return n(C, [{
      key: "set",
      value: function(o) {
        o.compiled && (this.compiled = o.compiled), o.data != null && (this.data = o.data);
      }
    }, {
      key: "optionsTransformer",
      value: function(o, p) {
        return this.docxtemplater = p, this.brTag = p.fileType === "docx" ? "<w:r><w:br/></w:r>" : "<a:br/>", this.prefix = v[p.fileType], this.runStartTag = "".concat(this.prefix, ":r"), this.runPropsStartTag = "".concat(this.prefix, ":rPr"), o;
      }
    }, {
      key: "postparse",
      value: function(o, p) {
        for (var N = [], B = 0; B < o.length; B++) {
          var R = o[B];
          if (R.type === "placeholder") {
            var K = R.value;
            try {
              p.cachedParsers[R.lIndex] = this.docxtemplater.parser(K, {
                tag: R
              });
            } catch (X) {
              N.push(l({
                tag: K,
                rootError: X,
                offset: R.offset
              }));
            }
          }
        }
        return {
          postparsed: o,
          errors: N
        };
      }
    }, {
      key: "getRenderedMap",
      value: function(o) {
        for (var p in this.compiled)
          o[p] = {
            from: p,
            data: this.data
          };
        return o;
      }
    }, {
      key: "render",
      value: function(o, p) {
        var N = p.contentType, B = p.scopeManager, R = p.linebreaks, K = p.nullGetter, X = p.fileType, Q = p.stripInvalidXMLChars;
        if (c.indexOf(N) !== -1 && (R = !1), R && this.recordRuns(o), !(o.type !== "placeholder" || o.module)) {
          var V;
          try {
            V = B.getValue(o.value, {
              part: o
            });
          } catch (W) {
            return {
              errors: [W]
            };
          }
          if (V ?? (V = K(o)), typeof V == "string") {
            if (Q)
              V = j(V);
            else if (["docx", "pptx", "xlsx"].indexOf(X) !== -1 && q(V))
              return {
                errors: [y({
                  tag: o.value,
                  value: V,
                  offset: o.offset
                })]
              };
          }
          return X === "text" ? {
            value: V
          } : {
            value: R && typeof V == "string" ? this.renderLineBreaks(V) : _(V)
          };
        }
      }
    }, {
      key: "recordRuns",
      value: function(o) {
        o.tag === this.runStartTag ? this.recordedRun = "" : o.tag === this.runPropsStartTag ? (o.position === "start" && (this.recordRun = !0, this.recordedRun += o.value), (o.position === "end" || o.position === "selfclosing") && (this.recordedRun += o.value, this.recordRun = !1)) : this.recordRun && (this.recordedRun += o.value);
      }
    }, {
      key: "renderLineBreaks",
      value: function(o) {
        for (var p = [], N = o.split(`
`), B = 0, R = N.length; B < R; B++)
          p.push(_(N[B])), B < N.length - 1 && p.push("</".concat(this.prefix, ":t></").concat(this.prefix, ":r>").concat(this.brTag, "<").concat(this.prefix, ":r>").concat(this.recordedRun, "<").concat(this.prefix, ":t").concat(this.docxtemplater.fileType === "docx" ? ' xml:space="preserve"' : "", ">"));
        return p;
      }
    }]);
  }();
  return on = function() {
    return i(new b());
  }, on;
}
var sn, bu;
function vl() {
  if (bu) return sn;
  bu = 1;
  var e = ll(), r = cl(), t = fl(), n = hl(), u = dl();
  function a() {
    return {
      getTemplatedFiles: function() {
        return [];
      },
      templatedNs: ["http://schemas.microsoft.com/office/2006/coverPageProps"],
      textPath: function(l) {
        return l.textTarget;
      },
      tagsXmlTextArray: ["Company", "HyperlinkBase", "Manager", "cp:category", "cp:keywords", "dc:creator", "dc:description", "dc:subject", "dc:title", "cp:contentStatus", "PublishDate", "Abstract", "CompanyAddress", "CompanyPhone", "CompanyFax", "CompanyEmail", "w:t", "a:t", "m:t", "vt:lpstr", "vt:lpwstr"],
      tagsXmlLexedArray: ["w:proofState", "w:tc", "w:tr", "w:tbl", "w:ftr", "w:hdr", "w:body", "w:document", "w:p", "w:r", "w:br", "w:rPr", "w:pPr", "w:spacing", "w:sdtContent", "w:sdt", "w:drawing", "w:sectPr", "w:type", "w:headerReference", "w:footerReference", "w:bookmarkStart", "w:bookmarkEnd", "w:commentRangeStart", "w:commentRangeEnd", "w:commentReference"],
      droppedTagsInsidePlaceholder: ["w:p", "w:br", "w:bookmarkStart", "w:bookmarkEnd"],
      expandTags: [{
        contains: "w:tc",
        expand: "w:tr"
      }],
      onParagraphLoop: [{
        contains: "w:p",
        expand: "w:p",
        onlyTextInTag: !0
      }],
      tagRawXml: "w:p",
      baseModules: [e, r, n, t, u],
      tagShouldContain: [{
        tag: "w:sdtContent",
        shouldContain: ["w:p", "w:r", "w:commentRangeStart", "w:sdt"],
        value: "<w:p></w:p>"
      }, {
        tag: "w:tc",
        shouldContain: ["w:p"],
        value: "<w:p></w:p>"
      }, {
        tag: "w:tr",
        shouldContain: ["w:tc"],
        drop: !0
      }, {
        tag: "w:tbl",
        shouldContain: ["w:tr"],
        drop: !0
      }]
    };
  }
  function i() {
    return {
      getTemplatedFiles: function() {
        return [];
      },
      textPath: function(l) {
        return l.textTarget;
      },
      tagsXmlTextArray: ["Company", "HyperlinkBase", "Manager", "cp:category", "cp:keywords", "dc:creator", "dc:description", "dc:subject", "dc:title", "a:t", "m:t", "vt:lpstr", "vt:lpwstr"],
      tagsXmlLexedArray: ["p:sp", "a:tc", "a:tr", "a:tbl", "a:graphicData", "a:p", "a:r", "a:rPr", "p:txBody", "a:txBody", "a:off", "a:ext", "p:graphicFrame", "p:xfrm", "a16:rowId", "a:endParaRPr"],
      droppedTagsInsidePlaceholder: ["a:p", "a:endParaRPr"],
      expandTags: [{
        contains: "a:tc",
        expand: "a:tr"
      }],
      onParagraphLoop: [{
        contains: "a:p",
        expand: "a:p",
        onlyTextInTag: !0
      }],
      tagRawXml: "p:sp",
      baseModules: [e, n, t, u],
      tagShouldContain: [{
        tag: "a:tbl",
        shouldContain: ["a:tr"],
        dropParent: "p:graphicFrame"
      }, {
        tag: "p:txBody",
        shouldContain: ["a:p"],
        value: "<a:p></a:p>"
      }, {
        tag: "a:txBody",
        shouldContain: ["a:p"],
        value: "<a:p></a:p>"
      }]
    };
  }
  return sn = {
    docx: a,
    pptx: i
  }, sn;
}
(function(e) {
  var r = ["modules"];
  function t(F, L) {
    var D = Object.keys(F);
    if (Object.getOwnPropertySymbols) {
      var I = Object.getOwnPropertySymbols(F);
      L && (I = I.filter(function($) {
        return Object.getOwnPropertyDescriptor(F, $).enumerable;
      })), D.push.apply(D, I);
    }
    return D;
  }
  function n(F) {
    for (var L = 1; L < arguments.length; L++) {
      var D = arguments[L] != null ? arguments[L] : {};
      L % 2 ? t(Object(D), !0).forEach(function(I) {
        u(F, I, D[I]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(F, Object.getOwnPropertyDescriptors(D)) : t(Object(D)).forEach(function(I) {
        Object.defineProperty(F, I, Object.getOwnPropertyDescriptor(D, I));
      });
    }
    return F;
  }
  function u(F, L, D) {
    return (L = d(L)) in F ? Object.defineProperty(F, L, { value: D, enumerable: !0, configurable: !0, writable: !0 }) : F[L] = D, F;
  }
  function a(F, L) {
    return A(F) || y(F, L) || f(F, L) || i();
  }
  function i() {
    throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }
  function f(F, L) {
    if (F) {
      if (typeof F == "string") return l(F, L);
      var D = {}.toString.call(F).slice(8, -1);
      return D === "Object" && F.constructor && (D = F.constructor.name), D === "Map" || D === "Set" ? Array.from(F) : D === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(D) ? l(F, L) : void 0;
    }
  }
  function l(F, L) {
    (L == null || L > F.length) && (L = F.length);
    for (var D = 0, I = Array(L); D < L; D++) I[D] = F[D];
    return I;
  }
  function y(F, L) {
    var D = F == null ? null : typeof Symbol < "u" && F[Symbol.iterator] || F["@@iterator"];
    if (D != null) {
      var I, $, Z, ce, ae = [], ve = !0, Se = !1;
      try {
        if (Z = (D = D.call(F)).next, L === 0) {
          if (Object(D) !== D) return;
          ve = !1;
        } else for (; !(ve = (I = Z.call(D)).done) && (ae.push(I.value), ae.length !== L); ve = !0) ;
      } catch (_e) {
        Se = !0, $ = _e;
      } finally {
        try {
          if (!ve && D.return != null && (ce = D.return(), Object(ce) !== ce)) return;
        } finally {
          if (Se) throw $;
        }
      }
      return ae;
    }
  }
  function A(F) {
    if (Array.isArray(F)) return F;
  }
  function _(F) {
    "@babel/helpers - typeof";
    return _ = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(L) {
      return typeof L;
    } : function(L) {
      return L && typeof Symbol == "function" && L.constructor === Symbol && L !== Symbol.prototype ? "symbol" : typeof L;
    }, _(F);
  }
  function q(F, L) {
    if (F == null) return {};
    var D, I, $ = j(F, L);
    if (Object.getOwnPropertySymbols) {
      var Z = Object.getOwnPropertySymbols(F);
      for (I = 0; I < Z.length; I++) D = Z[I], L.indexOf(D) === -1 && {}.propertyIsEnumerable.call(F, D) && ($[D] = F[D]);
    }
    return $;
  }
  function j(F, L) {
    if (F == null) return {};
    var D = {};
    for (var I in F) if ({}.hasOwnProperty.call(F, I)) {
      if (L.indexOf(I) !== -1) continue;
      D[I] = F[I];
    }
    return D;
  }
  function M(F, L) {
    if (!(F instanceof L)) throw new TypeError("Cannot call a class as a function");
  }
  function P(F, L) {
    for (var D = 0; D < L.length; D++) {
      var I = L[D];
      I.enumerable = I.enumerable || !1, I.configurable = !0, "value" in I && (I.writable = !0), Object.defineProperty(F, d(I.key), I);
    }
  }
  function m(F, L, D) {
    return L && P(F.prototype, L), Object.defineProperty(F, "prototype", { writable: !1 }), F;
  }
  function d(F) {
    var L = x(F, "string");
    return _(L) == "symbol" ? L : L + "";
  }
  function x(F, L) {
    if (_(F) != "object" || !F) return F;
    var D = F[Symbol.toPrimitive];
    if (D !== void 0) {
      var I = D.call(F, L);
      if (_(I) != "object") return I;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return String(F);
  }
  var c = Re, v = $s, b = v.object({
    allowUnopenedTag: v.boolean().optional(),
    allowUnclosedTag: v.boolean().optional(),
    allowUnbalancedLoops: v.boolean().optional(),
    changeDelimiterPrefix: v.string().optional().nullable()
  }), C = v.object({
    delimiters: v.object({
      start: v.string().nullable(),
      end: v.string().nullable()
    }).strict().optional(),
    fileTypeConfig: v.object({}).optional(),
    paragraphLoop: v.boolean().optional(),
    parser: v.function().optional(),
    errorLogging: v.union([v.boolean(), v.string()]).optional(),
    linebreaks: v.boolean().optional(),
    nullGetter: v.function().optional(),
    syntax: b.optional(),
    stripInvalidXMLChars: v.boolean().optional(),
    warnFn: v.function().optional()
  }).strict(), g = Qs(), o = g.getRelsTypes, p = Ks(), N = p.collectContentTypes, B = p.getContentTypes, R = Er(), K = xn(), X = Zs(), Q = Js(), V = Ea(), W = el(), ue = W.getTags, z = rl(), oe = We, Ae = oe.throwMultiError, xe = oe.throwResolveBeforeCompile, Le = oe.throwRenderInvalidTemplate, ze = oe.throwRenderTwice, s = oe.XTInternalError, h = oe.XTTemplateError, S = oe.throwFileTypeNotIdentified, O = oe.throwFileTypeNotHandled, G = oe.throwApiVersionError;
  c.getRelsTypes = o, c.traits = K, c.moduleWrapper = R, c.collectContentTypes = N, c.getContentTypes = B;
  var Y = c.getDefaults, H = c.str2xml, J = c.xml2str, ee = c.concatArrays, T = c.uniq, w = c.getDuplicates, E = c.stableSort, k = c.pushArray, U = c.utf8ToWord, ie = c.invertMap, se = "[Content_Types].xml", de = "_rels/.rels", te = [3, 47, 2];
  function we(F) {
    var L = w(F.map(function(D) {
      var I = D.name;
      return I;
    }));
    if (L.length > 0)
      throw new s('Detected duplicate module "'.concat(L[0], '"'));
  }
  function ye(F) {
    for (var L = 0, D = F.modules; L < D.length; L++)
      for (var I = D[L], $ = 0, Z = I.xmlContentTypes || []; $ < Z.length; $++)
        for (var ce = Z[$], ae = F.invertedContentTypes[ce] || [], ve = 0; ve < ae.length; ve++) {
          var Se = ae[ve];
          F.zip.files[Se] && F.options.xmlFileNames.push(Se);
        }
  }
  function pe(F) {
    return E(F, function(L, D) {
      return (D.priority || 0) - (L.priority || 0);
    });
  }
  function Ee(F) {
    var L = [];
    for (var D in F)
      L.push(D);
    for (var I = [se, de], $ = ["word/", "xl/", "ppt/"], Z = 0; Z < L.length; Z++)
      for (var ce = L[Z], ae = 0; ae < $.length; ae++) {
        var ve = $[ae];
        ce.indexOf("".concat(ve)) === 0 && I.push(ce);
      }
    for (var Se = 0; Se < L.length; Se++) {
      var _e = L[Se];
      I.indexOf(_e) === -1 && I.push(_e);
    }
    return I;
  }
  function Te(F, L) {
    F.hideDeprecations !== !0 && console.warn(L);
  }
  function be(F, L) {
    if (F.hideDeprecations !== !0)
      return Te(F, 'Deprecated method ".'.concat(L, '", view upgrade guide : https://docxtemplater.com/docs/api/#upgrade-guide, stack : ').concat(new Error().stack));
  }
  function Ue(F) {
    F.modules = F.modules.filter(function(L) {
      if (!L.supportedFileTypes)
        return !0;
      if (!Array.isArray(L.supportedFileTypes))
        throw new Error("The supportedFileTypes field of the module must be an array");
      var D = L.supportedFileTypes.includes(F.fileType);
      return D || L.on("detached"), D;
    });
  }
  function $e(F) {
    var L = F.compiled;
    F.errors = ee(Object.keys(L).map(function(D) {
      return L[D].allErrors;
    })), F.errors.length !== 0 && (F.options.errorLogging && z(F.errors, F.options.errorLogging), Ae(F.errors));
  }
  function cr(F) {
    return typeof Buffer < "u" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(F);
  }
  var Qe = /* @__PURE__ */ function() {
    function F(L) {
      var D = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, I = D.modules, $ = I === void 0 ? [] : I, Z = q(D, r);
      if (M(this, F), this.targets = [], this.rendered = !1, this.scopeManagers = {}, this.compiled = {}, this.modules = [X()], this.xmlDocuments = {}, arguments.length === 0)
        Te(this, "Deprecated docxtemplater constructor with no arguments, view upgrade guide : https://docxtemplater.com/docs/api/#upgrade-guide, stack : ".concat(new Error().stack)), this.hideDeprecations = !0, this.setOptions(Z);
      else {
        if (this.hideDeprecations = !0, this.setOptions(Z), cr(L))
          throw new Error("You passed a Buffer to the Docxtemplater constructor. The first argument of docxtemplater's constructor must be a valid zip file (jszip v2 or pizzip v3)");
        if (!L || !L.files || typeof L.file != "function")
          throw new Error("The first argument of docxtemplater's constructor must be a valid zip file (jszip v2 or pizzip v3)");
        if (!Array.isArray($))
          throw new Error("The modules argument of docxtemplater's constructor must be an array");
        for (var ce = 0; ce < $.length; ce++) {
          var ae = $[ce];
          this.attachModule(ae);
        }
        this.loadZip(L), this.compile(), this.v4Constructor = !0;
      }
      this.hideDeprecations = !1;
    }
    return m(F, [{
      key: "verifyApiVersion",
      value: function(D) {
        return D = D.split(".").map(function(I) {
          return parseInt(I, 10);
        }), D.length !== 3 && G("neededVersion is not a valid version", {
          neededVersion: D,
          explanation: "the neededVersion must be an array of length 3"
        }), D[0] !== te[0] && G("The major api version do not match, you probably have to update docxtemplater with npm install --save docxtemplater", {
          neededVersion: D,
          currentModuleApiVersion: te,
          explanation: "moduleAPIVersionMismatch : needed=".concat(D.join("."), ", current=").concat(te.join("."))
        }), D[1] > te[1] && G("The minor api version is not uptodate, you probably have to update docxtemplater with npm install --save docxtemplater", {
          neededVersion: D,
          currentModuleApiVersion: te,
          explanation: "moduleAPIVersionMismatch : needed=".concat(D.join("."), ", current=").concat(te.join("."))
        }), D[1] === te[1] && D[2] > te[2] && G("The patch api version is not uptodate, you probably have to update docxtemplater with npm install --save docxtemplater", {
          neededVersion: D,
          currentModuleApiVersion: te,
          explanation: "moduleAPIVersionMismatch : needed=".concat(D.join("."), ", current=").concat(te.join("."))
        }), !0;
      }
    }, {
      key: "setModules",
      value: function(D) {
        for (var I = 0, $ = this.modules; I < $.length; I++) {
          var Z = $[I];
          Z.set(D);
        }
      }
    }, {
      key: "sendEvent",
      value: function(D) {
        for (var I = 0, $ = this.modules; I < $.length; I++) {
          var Z = $[I];
          Z.on(D);
        }
      }
    }, {
      key: "attachModule",
      value: function(D) {
        if (this.v4Constructor)
          throw new s("attachModule() should not be called manually when using the v4 constructor");
        be(this, "attachModule");
        var I = _(D);
        if (I === "function")
          throw new s("Cannot attach a class/function as a module. Most probably you forgot to instantiate the module by using `new` on the module.");
        if (!D || I !== "object")
          throw new s("Cannot attachModule with a falsy value");
        if (D.requiredAPIVersion && this.verifyApiVersion(D.requiredAPIVersion), D.attached === !0)
          if (typeof D.clone == "function")
            D = D.clone();
          else
            throw new Error('Cannot attach a module that was already attached : "'.concat(D.name, '". The most likely cause is that you are instantiating the module at the root level, and using it for multiple instances of Docxtemplater'));
        D.attached = !0;
        var $ = R(D);
        return this.modules.push($), $.on("attached"), this.fileType && Ue(this), this;
      }
    }, {
      key: "findModule",
      value: function(D) {
        for (var I = 0, $ = this.modules; I < $.length; I++) {
          var Z = $[I];
          if (Z.name === D)
            return Z;
        }
      }
    }, {
      key: "setOptions",
      value: function(D) {
        var I, $;
        if (this.v4Constructor)
          throw new Error("setOptions() should not be called manually when using the v4 constructor");
        if (!D)
          throw new Error("setOptions should be called with an object as first parameter");
        var Z = C.validate(D);
        if (Z.success === !1)
          throw new Error(Z.error);
        be(this, "setOptions"), this.options = {};
        var ce = Y();
        for (var ae in ce) {
          var ve = ce[ae];
          this.options[ae] = D[ae] != null ? D[ae] : this[ae] || ve, this[ae] = this.options[ae];
        }
        return (I = this.delimiters).start && (I.start = U(this.delimiters.start)), ($ = this.delimiters).end && ($.end = U(this.delimiters.end)), this;
      }
    }, {
      key: "loadZip",
      value: function(D) {
        if (this.v4Constructor)
          throw new Error("loadZip() should not be called manually when using the v4 constructor");
        if (be(this, "loadZip"), D.loadAsync)
          throw new s("Docxtemplater doesn't handle JSZip version >=3, please use pizzip");
        D.xtRendered && this.options.warnFn([new Error("This zip file appears to be the outcome of a previous docxtemplater generation. This typically indicates that docxtemplater was integrated by reusing the same zip file. It is recommended to create a new Pizzip instance for each docxtemplater generation.")]), this.zip = D, this.updateFileTypeConfig(), this.modules = ee([this.fileTypeConfig.baseModules.map(function(ce) {
          return ce();
        }), this.modules]);
        for (var I = 0, $ = this.modules; I < $.length; I++) {
          var Z = $[I];
          Z.zip = this.zip, Z.docxtemplater = this, Z.fileTypeConfig = this.fileTypeConfig, Z.fileType = this.fileType, Z.xtOptions = this.options, Z.modules = this.modules;
        }
        return Ue(this), this;
      }
    }, {
      key: "precompileFile",
      value: function(D) {
        var I = this.createTemplateClass(D);
        I.preparse(), this.compiled[D] = I;
      }
    }, {
      key: "compileFile",
      value: function(D) {
        this.compiled[D].parse();
      }
    }, {
      key: "getScopeManager",
      value: function(D, I, $) {
        var Z;
        return (Z = this.scopeManagers)[D] || (Z[D] = Q({
          tags: $,
          parser: this.parser,
          cachedParsers: I.cachedParsers
        })), this.scopeManagers[D];
      }
    }, {
      key: "resolveData",
      value: function(D) {
        var I = this;
        be(this, "resolveData");
        var $ = [];
        return Object.keys(this.compiled).length || xe(), Promise.resolve(D).then(function(Z) {
          return I.data = Z, I.setModules({
            data: I.data,
            Lexer: V
          }), I.mapper = I.modules.reduce(function(ce, ae) {
            return ae.getRenderedMap(ce);
          }, {}), Promise.all(Object.keys(I.mapper).map(function(ce) {
            var ae = I.mapper[ce], ve = ae.from, Se = ae.data;
            return Promise.resolve(Se).then(function(_e) {
              var ke = I.compiled[ve];
              return ke.filePath = ce, ke.scopeManager = I.getScopeManager(ce, ke, _e), ke.resolveTags(_e).then(function(Ke) {
                return ke.scopeManager.finishedResolving = !0, Ke;
              }, function(Ke) {
                k($, Ke);
              });
            });
          })).then(function(ce) {
            return $.length !== 0 && (I.options.errorLogging && z($, I.options.errorLogging), Ae($)), ee(ce);
          });
        });
      }
    }, {
      key: "compile",
      value: function() {
        if (be(this, "compile"), this.updateFileTypeConfig(), we(this.modules), this.modules = pe(this.modules), Object.keys(this.compiled).length)
          return this;
        for (var D = this.options, I = 0, $ = this.modules; I < $.length; I++) {
          var Z = $[I];
          D = Z.optionsTransformer(D, this);
        }
        this.options = D, this.options.xmlFileNames = T(this.options.xmlFileNames);
        for (var ce = 0, ae = this.options.xmlFileNames; ce < ae.length; ce++) {
          var ve = ae[ce], Se = this.zip.files[ve].asText();
          this.xmlDocuments[ve] = H(Se);
        }
        this.setModules({
          zip: this.zip,
          xmlDocuments: this.xmlDocuments
        });
        for (var _e = 0, ke = this.modules; _e < ke.length; _e++) {
          var Ke = ke[_e];
          Ke.xmlDocuments = this.xmlDocuments;
        }
        this.getTemplatedFiles(), this.sendEvent("before-preparse");
        for (var tr = 0, Tr = this.templatedFiles; tr < Tr.length; tr++) {
          var qr = Tr[tr];
          this.zip.files[qr] != null && this.precompileFile(qr);
        }
        this.sendEvent("after-preparse");
        for (var Dr = 0, Ur = this.templatedFiles; Dr < Ur.length; Dr++) {
          var br = Ur[Dr];
          this.zip.files[br] != null && this.compiled[br].parse({
            noPostParse: !0
          });
        }
        this.sendEvent("after-parse");
        for (var Ar = 0, lt = this.templatedFiles; Ar < lt.length; Ar++) {
          var ct = lt[Ar];
          this.zip.files[ct] != null && this.compiled[ct].postparse();
        }
        return this.sendEvent("after-postparse"), this.setModules({
          compiled: this.compiled
        }), $e(this), this;
      }
    }, {
      key: "updateFileTypeConfig",
      value: function() {
        this.relsTypes = o(this.zip);
        var D = B(this.zip), I = D.overrides, $ = D.defaults, Z = D.contentTypes, ce = D.contentTypeXml;
        ce && (this.filesContentTypes = N(I, $, this.zip), this.invertedContentTypes = ie(this.filesContentTypes), this.setModules({
          contentTypes: this.contentTypes,
          invertedContentTypes: this.invertedContentTypes
        }));
        var ae;
        this.zip.files.mimetype && (ae = "odt");
        for (var ve = 0, Se = this.modules; ve < Se.length; ve++) {
          var _e = Se[ve];
          ae = _e.getFileType({
            zip: this.zip,
            contentTypes: Z,
            contentTypeXml: ce,
            overrides: I,
            defaults: $,
            doc: this
          }) || ae;
        }
        if (this.fileType = ae, ae === "odt" && O(ae), ae || S(this.zip), ye(this), Ue(this), this.fileTypeConfig = this.options.fileTypeConfig || this.fileTypeConfig, !this.fileTypeConfig)
          if (F.FileTypeConfig[this.fileType])
            this.fileTypeConfig = F.FileTypeConfig[this.fileType]();
          else {
            var ke = 'Filetype "'.concat(this.fileType, '" is not supported'), Ke = "filetype_not_supported";
            this.fileType === "xlsx" && (ke = 'Filetype "'.concat(this.fileType, '" is supported only with the paid XlsxModule'), Ke = "xlsx_filetype_needs_xlsx_module");
            var tr = new h(ke);
            throw tr.properties = {
              id: Ke,
              explanation: ke
            }, tr;
          }
        return this;
      }
    }, {
      key: "renderAsync",
      value: function(D) {
        var I = this;
        this.hideDeprecations = !0;
        var $ = this.resolveData(D);
        return this.hideDeprecations = !1, this.zip.xtRendered = !0, $.then(function() {
          return I.render();
        });
      }
    }, {
      key: "render",
      value: function(D) {
        this.zip.xtRendered = !0, this.rendered && ze(), this.rendered = !0, Object.keys(this.compiled).length === 0 && this.compile(), this.errors.length > 0 && Le(), arguments.length > 0 && (this.data = D), this.setModules({
          data: this.data,
          Lexer: V
        }), this.mapper || (this.mapper = this.modules.reduce(function(Aa, wa) {
          return wa.getRenderedMap(Aa);
        }, {}));
        var I = [];
        for (var $ in this.mapper) {
          var Z = this.mapper[$], ce = Z.from, ae = Z.data, ve = this.compiled[ce];
          ve.scopeManager = this.getScopeManager($, ve, ae), ve.render($), I.push([$, ve.content, ve]), delete ve.content;
        }
        for (var Se = 0; Se < I.length; Se++)
          for (var _e = I[Se], ke = a(_e, 3), Ke = ke[1], tr = ke[2], Tr = 0, qr = this.modules; Tr < qr.length; Tr++) {
            var Dr = qr[Tr];
            if (Dr.preZip) {
              var Ur = Dr.preZip(Ke, tr);
              typeof Ur == "string" && (_e[1] = Ur);
            }
          }
        for (var br = 0; br < I.length; br++) {
          var Ar = a(I[br], 2), lt = Ar[0], ct = Ar[1];
          this.zip.file(lt, ct, {
            createFolders: !0
          });
        }
        return $e(this), this.sendEvent("syncing-zip"), this.syncZip(), this.sendEvent("synced-zip"), this;
      }
    }, {
      key: "syncZip",
      value: function() {
        for (var D in this.xmlDocuments) {
          this.zip.remove(D);
          var I = J(this.xmlDocuments[D]);
          this.zip.file(D, I, {
            createFolders: !0
          });
        }
      }
    }, {
      key: "setData",
      value: function(D) {
        return be(this, "setData"), this.data = D, this;
      }
    }, {
      key: "getZip",
      value: function() {
        return this.zip;
      }
    }, {
      key: "createTemplateClass",
      value: function(D) {
        var I = this.zip.files[D].asText();
        return this.createTemplateClassFromContent(I, D);
      }
    }, {
      key: "createTemplateClassFromContent",
      value: function(D, I) {
        for (var $ = {
          filePath: I,
          contentType: this.filesContentTypes[I],
          relsType: this.relsTypes[I]
        }, Z = Y(), ce = k(Object.keys(Z), ["filesContentTypes", "fileTypeConfig", "fileType", "modules"]), ae = 0; ae < ce.length; ae++) {
          var ve = ce[ae];
          $[ve] = this[ve];
        }
        return new F.XmlTemplater(D, $);
      }
    }, {
      key: "getFullText",
      value: function(D) {
        return this.createTemplateClass(D || this.fileTypeConfig.textPath(this)).getFullText();
      }
    }, {
      key: "getTemplatedFiles",
      value: function() {
        this.templatedFiles = this.fileTypeConfig.getTemplatedFiles(this.zip), k(this.templatedFiles, this.targets);
        var D = this.fileTypeConfig.templatedNs || [];
        if (D.length > 0) {
          for (var I in this.filesContentTypes)
            if (/^customXml\/item\d+\.xml$/.test(I))
              for (var $ = 0; $ < D.length; $++) {
                var Z = D[$], ce = this.zip.file(I).asText();
                ce.indexOf('xmlns="'.concat(Z, '"')) !== -1 && this.templatedFiles.push(I);
              }
        }
        return this.templatedFiles = T(this.templatedFiles), this.templatedFiles;
      }
    }, {
      key: "getTags",
      value: function() {
        var D = {
          headers: [],
          footers: []
        };
        for (var I in this.compiled) {
          var $ = this.filesContentTypes[I];
          $ === "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml" && (D.document = {
            target: I,
            tags: ue(this.compiled[I].postparsed)
          }), $ === "application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml" && D.headers.push({
            target: I,
            tags: ue(this.compiled[I].postparsed)
          }), $ === "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml" && D.footers.push({
            target: I,
            tags: ue(this.compiled[I].postparsed)
          });
        }
        return D;
      }
      /* Export functions, present since 3.62.0 */
    }, {
      key: "toBuffer",
      value: function(D) {
        return this.zip.generate(n(n({
          compression: "DEFLATE",
          fileOrder: Ee
        }, D), {}, {
          type: "nodebuffer"
        }));
      }
      /* Export functions, present since 3.62.0 */
    }, {
      key: "toBlob",
      value: function(D) {
        return this.zip.generate(n(n({
          compression: "DEFLATE",
          fileOrder: Ee
        }, D), {}, {
          type: "blob"
        }));
      }
      /* Export functions, present since 3.62.0 */
    }, {
      key: "toBase64",
      value: function(D) {
        return this.zip.generate(n(n({
          compression: "DEFLATE",
          fileOrder: Ee
        }, D), {}, {
          type: "base64"
        }));
      }
      /* Export functions, present since 3.62.0 */
    }, {
      key: "toUint8Array",
      value: function(D) {
        return this.zip.generate(n(n({
          compression: "DEFLATE",
          fileOrder: Ee
        }, D), {}, {
          type: "uint8array"
        }));
      }
      /* Export functions, present since 3.62.0 */
    }, {
      key: "toArrayBuffer",
      value: function(D) {
        return this.zip.generate(n(n({
          compression: "DEFLATE",
          fileOrder: Ee
        }, D), {}, {
          type: "arraybuffer"
        }));
      }
    }]);
  }();
  Qe.DocUtils = c, Qe.Errors = We, Qe.XmlTemplater = sl(), Qe.FileTypeConfig = vl(), Qe.XmlMatcher = Ta(), e.exports = Qe, e.exports.default = Qe;
})(Au);
var ba = Au.exports;
const gl = /* @__PURE__ */ Ca(ba), yl = /* @__PURE__ */ xa({
  __proto__: null,
  default: gl
}, [ba]);
export {
  yl as d
};
