import { q as At, l as It } from "./sqljob-WCX52cp0.js";
const W = 0.01, Pt = (e) => e.height - e.padding[0] - e.padding[2], Nt = (e, t) => (e.readOnly ? e.content : t == null ? void 0 : t[e.name]) || "";
function Vt(e, t) {
  const i = [], s = /* @__PURE__ */ new Map();
  return e.forEach((r, n) => {
    const o = r.position.y - t;
    i.push({
      schema: It(r),
      baseY: o,
      height: r.height,
      dynamicHeights: [r.height]
      // Will be updated later
    }), s.set(r.name, n);
  }), i.sort((r, n) => Math.abs(r.baseY - n.baseY) > W ? r.baseY - n.baseY : (s.get(r.schema.name) ?? 0) - (s.get(n.schema.name) ?? 0)), { items: i, orderMap: s };
}
function Tt(e, t, i, s, r, n) {
  let o = 0, u = Math.floor(i / s), h = i % s;
  h < 0 && (h = 0);
  let c = 0;
  const f = t.length > 1;
  for (; o < t.length; ) {
    for (; n.length <= u; )
      n.push([]);
    const x = s - h;
    if (t[o] > x + W && !(Math.abs(x - s) <= W)) {
      u++, h = 0;
      continue;
    }
    let _ = 0;
    const w = o;
    for (; o < t.length; ) {
      const V = t[o];
      if (h + _ + V <= s + W)
        _ += V, o++;
      else
        break;
    }
    const D = h <= W;
    if (f && w === 0 && o === 1 && t.length > 1 && !D) {
      o = 0, u++, h = 0;
      continue;
    }
    o === w && (_ += t[o], o++);
    const k = {
      ...e,
      height: _,
      position: { ...e.position, y: h + r }
    };
    f && (k.__bodyRange = {
      start: w === 0 ? 0 : w - 1,
      end: o - 1
    }, k.__isSplit = w > 0), n[u].push(k), h += _, h >= s - W && (u++, h = 0), c = u * s + h;
  }
  return c;
}
function Lt(e, t) {
  e.forEach((i) => {
    i.sort((s, r) => (t.get(s.name) ?? 0) - (t.get(r.name) ?? 0));
  });
}
function je(e) {
  for (; e.length > 1 && e[e.length - 1].length === 0; )
    e.pop();
}
function Rt(e, t, i, s) {
  const r = [];
  let n = 0;
  for (const o of e) {
    const u = o.baseY + n, h = Tt(o.schema, o.dynamicHeights, u, i, s, r), c = o.baseY + o.height;
    n = h - c;
  }
  return Lt(r, t), je(r), r;
}
const ki = async (e) => {
  const { template: t, input: i, options: s, _cache: r, getDynamicHeights: n } = e, o = t.basePdf;
  if (!At(o))
    return t;
  const u = Pt(o), h = o.padding[0], c = [], f = 10;
  for (let x = 0; x < t.schemas.length; x++) {
    const b = t.schemas[x], { items: _, orderMap: w } = Vt(b, h);
    for (let k = 0; k < _.length; k += f) {
      const V = _.slice(k, k + f), Te = await Promise.all(V.map((Y) => {
        const Et = Nt(Y.schema, i);
        return n(Et, {
          schema: Y.schema,
          basePdf: o,
          options: s,
          _cache: r
        }).then((Le) => Le.length === 0 ? [0] : Le);
      }));
      for (let Y = 0; Y < Te.length; Y++)
        _[k + Y].dynamicHeights = Te[Y];
    }
    const D = Rt(_, w, u, h);
    c.push(...D);
  }
  if (je(c), c.length === t.schemas.length) {
    let x = !0;
    for (let b = 0; b < c.length && x; b++) {
      if (c[b].length !== t.schemas[b].length) {
        x = !1;
        break;
      }
      for (let _ = 0; _ < c[b].length && x; _++) {
        const w = t.schemas[b][_], D = c[b][_];
        (Math.abs(w.height - D.height) > W || Math.abs(w.position.y - D.position.y) > W) && (x = !1);
      }
    }
    if (x)
      return t;
  }
  return { basePdf: o, schemas: c };
};
var Ot = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 7, 9, 32, 4, 318, 1, 78, 5, 71, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 3, 0, 158, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 68, 8, 2, 0, 3, 0, 2, 3, 2, 4, 2, 0, 15, 1, 83, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 7, 19, 58, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 199, 7, 137, 9, 54, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 55, 9, 266, 3, 10, 1, 2, 0, 49, 6, 4, 4, 14, 10, 5350, 0, 7, 14, 11465, 27, 2343, 9, 87, 9, 39, 4, 60, 6, 26, 9, 535, 9, 470, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4178, 9, 519, 45, 3, 22, 543, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 101, 0, 161, 6, 10, 9, 357, 0, 62, 13, 499, 13, 245, 1, 2, 9, 233, 0, 3, 0, 8, 1, 6, 0, 475, 6, 110, 6, 6, 9, 4759, 9, 787719, 239], qe = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 4, 51, 13, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 7, 25, 39, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 39, 27, 10, 22, 251, 41, 7, 1, 17, 5, 57, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 20, 1, 64, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 31, 9, 2, 0, 3, 0, 2, 37, 2, 0, 26, 0, 2, 0, 45, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 200, 32, 32, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 24, 43, 261, 18, 16, 0, 2, 12, 2, 33, 125, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1071, 18, 5, 26, 3994, 6, 582, 6842, 29, 1763, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 433, 44, 212, 63, 33, 24, 3, 24, 45, 74, 6, 0, 67, 12, 65, 1, 2, 0, 15, 4, 10, 7381, 42, 31, 98, 114, 8702, 3, 2, 6, 2, 1, 2, 290, 16, 0, 30, 2, 3, 0, 15, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 7, 5, 262, 61, 147, 44, 11, 6, 17, 0, 322, 29, 19, 43, 485, 27, 229, 29, 3, 0, 208, 30, 2, 2, 2, 1, 2, 6, 3, 4, 10, 1, 225, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4381, 3, 5773, 3, 7472, 16, 621, 2467, 541, 1507, 4938, 6, 8489], Bt = "‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߽߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࢗ-࢟࣊-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯৾ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ૺ-૿ଁ-ଃ଼ା-ୄେୈୋ-୍୕-ୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఄ఼ా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ೳഀ-ഃ഻഼ാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ඁ-ඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ຼ່-໎໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜕ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠏-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᪿ-᫝᫠-᫫ᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭᳴᳷-᳹᷀-᷿‌‍‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯・꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧ꠬ꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱ꣿ-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿･", Ge = "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙՠ-ֈא-תׯ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࡰ-ࢇࢉ-࢏ࢠ-ࣉऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚ౜ౝౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽ೜-ೞೠೡೱೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜑᜟ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭌᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲊᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-Ƛ꟱-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ", me = {
  3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
  5: "class enum extends super const export import",
  6: "enum",
  strict: "implements interface let package private protected public static yield",
  strictBind: "eval arguments"
}, ge = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this", Dt = {
  5: ge,
  "5module": ge + " export import",
  6: ge + " const class extends export import super"
}, We = /^in(stanceof)?$/, Ft = new RegExp("[" + Ge + "]"), Mt = new RegExp("[" + Ge + Bt + "]");
function _e(e, t) {
  for (var i = 65536, s = 0; s < t.length; s += 2) {
    if (i += t[s], i > e)
      return !1;
    if (i += t[s + 1], i >= e)
      return !0;
  }
  return !1;
}
function M(e, t) {
  return e < 65 ? e === 36 : e < 91 ? !0 : e < 97 ? e === 95 : e < 123 ? !0 : e <= 65535 ? e >= 170 && Ft.test(String.fromCharCode(e)) : t === !1 ? !1 : _e(e, qe);
}
function z(e, t) {
  return e < 48 ? e === 36 : e < 58 ? !0 : e < 65 ? !1 : e < 91 ? !0 : e < 97 ? e === 95 : e < 123 ? !0 : e <= 65535 ? e >= 170 && Mt.test(String.fromCharCode(e)) : t === !1 ? !1 : _e(e, qe) || _e(e, Ot);
}
var v = function(t, i) {
  i === void 0 && (i = {}), this.label = t, this.keyword = i.keyword, this.beforeExpr = !!i.beforeExpr, this.startsExpr = !!i.startsExpr, this.isLoop = !!i.isLoop, this.isAssign = !!i.isAssign, this.prefix = !!i.prefix, this.postfix = !!i.postfix, this.binop = i.binop || null, this.updateContext = null;
};
function T(e, t) {
  return new v(e, { beforeExpr: !0, binop: t });
}
var L = { beforeExpr: !0 }, P = { startsExpr: !0 }, ke = {};
function g(e, t) {
  return t === void 0 && (t = {}), t.keyword = e, ke[e] = new v(e, t);
}
var a = {
  num: new v("num", P),
  regexp: new v("regexp", P),
  string: new v("string", P),
  name: new v("name", P),
  privateId: new v("privateId", P),
  eof: new v("eof"),
  // Punctuation token types.
  bracketL: new v("[", { beforeExpr: !0, startsExpr: !0 }),
  bracketR: new v("]"),
  braceL: new v("{", { beforeExpr: !0, startsExpr: !0 }),
  braceR: new v("}"),
  parenL: new v("(", { beforeExpr: !0, startsExpr: !0 }),
  parenR: new v(")"),
  comma: new v(",", L),
  semi: new v(";", L),
  colon: new v(":", L),
  dot: new v("."),
  question: new v("?", L),
  questionDot: new v("?."),
  arrow: new v("=>", L),
  template: new v("template"),
  invalidTemplate: new v("invalidTemplate"),
  ellipsis: new v("...", L),
  backQuote: new v("`", P),
  dollarBraceL: new v("${", { beforeExpr: !0, startsExpr: !0 }),
  // Operators. These carry several kinds of properties to help the
  // parser use them properly (the presence of these properties is
  // what categorizes them as operators).
  //
  // `binop`, when present, specifies that this operator is a binary
  // operator, and will refer to its precedence.
  //
  // `prefix` and `postfix` mark the operator as a prefix or postfix
  // unary operator.
  //
  // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
  // binary operators with a very low precedence, that should result
  // in AssignmentExpression nodes.
  eq: new v("=", { beforeExpr: !0, isAssign: !0 }),
  assign: new v("_=", { beforeExpr: !0, isAssign: !0 }),
  incDec: new v("++/--", { prefix: !0, postfix: !0, startsExpr: !0 }),
  prefix: new v("!/~", { beforeExpr: !0, prefix: !0, startsExpr: !0 }),
  logicalOR: T("||", 1),
  logicalAND: T("&&", 2),
  bitwiseOR: T("|", 3),
  bitwiseXOR: T("^", 4),
  bitwiseAND: T("&", 5),
  equality: T("==/!=/===/!==", 6),
  relational: T("</>/<=/>=", 7),
  bitShift: T("<</>>/>>>", 8),
  plusMin: new v("+/-", { beforeExpr: !0, binop: 9, prefix: !0, startsExpr: !0 }),
  modulo: T("%", 10),
  star: T("*", 10),
  slash: T("/", 10),
  starstar: new v("**", { beforeExpr: !0 }),
  coalesce: T("??", 1),
  // Keyword token types.
  _break: g("break"),
  _case: g("case", L),
  _catch: g("catch"),
  _continue: g("continue"),
  _debugger: g("debugger"),
  _default: g("default", L),
  _do: g("do", { isLoop: !0, beforeExpr: !0 }),
  _else: g("else", L),
  _finally: g("finally"),
  _for: g("for", { isLoop: !0 }),
  _function: g("function", P),
  _if: g("if"),
  _return: g("return", L),
  _switch: g("switch"),
  _throw: g("throw", L),
  _try: g("try"),
  _var: g("var"),
  _const: g("const"),
  _while: g("while", { isLoop: !0 }),
  _with: g("with"),
  _new: g("new", { beforeExpr: !0, startsExpr: !0 }),
  _this: g("this", P),
  _super: g("super", P),
  _class: g("class", P),
  _extends: g("extends", L),
  _export: g("export"),
  _import: g("import", P),
  _null: g("null", P),
  _true: g("true", P),
  _false: g("false", P),
  _in: g("in", { beforeExpr: !0, binop: 7 }),
  _instanceof: g("instanceof", { beforeExpr: !0, binop: 7 }),
  _typeof: g("typeof", { beforeExpr: !0, prefix: !0, startsExpr: !0 }),
  _void: g("void", { beforeExpr: !0, prefix: !0, startsExpr: !0 }),
  _delete: g("delete", { beforeExpr: !0, prefix: !0, startsExpr: !0 })
}, N = /\r\n?|\n|\u2028|\u2029/, Ut = new RegExp(N.source, "g");
function J(e) {
  return e === 10 || e === 13 || e === 8232 || e === 8233;
}
function He(e, t, i) {
  i === void 0 && (i = e.length);
  for (var s = t; s < i; s++) {
    var r = e.charCodeAt(s);
    if (J(r))
      return s < i - 1 && r === 13 && e.charCodeAt(s + 1) === 10 ? s + 2 : s + 1;
  }
  return -1;
}
var ze = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/, A = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g, Ke = Object.prototype, jt = Ke.hasOwnProperty, qt = Ke.toString, $ = Object.hasOwn || function(e, t) {
  return jt.call(e, t);
}, Re = Array.isArray || function(e) {
  return qt.call(e) === "[object Array]";
}, Oe = /* @__PURE__ */ Object.create(null);
function H(e) {
  return Oe[e] || (Oe[e] = new RegExp("^(?:" + e.replace(/ /g, "|") + ")$"));
}
function j(e) {
  return e <= 65535 ? String.fromCharCode(e) : (e -= 65536, String.fromCharCode((e >> 10) + 55296, (e & 1023) + 56320));
}
var Gt = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/, ie = function(t, i) {
  this.line = t, this.column = i;
};
ie.prototype.offset = function(t) {
  return new ie(this.line, this.column + t);
};
var ce = function(t, i, s) {
  this.start = i, this.end = s, t.sourceFile !== null && (this.source = t.sourceFile);
};
function Ye(e, t) {
  for (var i = 1, s = 0; ; ) {
    var r = He(e, s, t);
    if (r < 0)
      return new ie(i, t - s);
    ++i, s = r;
  }
}
var Ce = {
  // `ecmaVersion` indicates the ECMAScript version to parse. Must be
  // either 3, 5, 6 (or 2015), 7 (2016), 8 (2017), 9 (2018), 10
  // (2019), 11 (2020), 12 (2021), 13 (2022), 14 (2023), or `"latest"`
  // (the latest version the library supports). This influences
  // support for strict mode, the set of reserved words, and support
  // for new syntax features.
  ecmaVersion: null,
  // `sourceType` indicates the mode the code should be parsed in.
  // Can be either `"script"`, `"module"` or `"commonjs"`. This influences global
  // strict mode and parsing of `import` and `export` declarations.
  sourceType: "script",
  // `onInsertedSemicolon` can be a callback that will be called when
  // a semicolon is automatically inserted. It will be passed the
  // position of the inserted semicolon as an offset, and if
  // `locations` is enabled, it is given the location as a `{line,
  // column}` object as second argument.
  onInsertedSemicolon: null,
  // `onTrailingComma` is similar to `onInsertedSemicolon`, but for
  // trailing commas.
  onTrailingComma: null,
  // By default, reserved words are only enforced if ecmaVersion >= 5.
  // Set `allowReserved` to a boolean value to explicitly turn this on
  // an off. When this option has the value "never", reserved words
  // and keywords can also not be used as property names.
  allowReserved: null,
  // When enabled, a return at the top level is not considered an
  // error.
  allowReturnOutsideFunction: !1,
  // When enabled, import/export statements are not constrained to
  // appearing at the top of the program, and an import.meta expression
  // in a script isn't considered an error.
  allowImportExportEverywhere: !1,
  // By default, await identifiers are allowed to appear at the top-level scope only if ecmaVersion >= 2022.
  // When enabled, await identifiers are allowed to appear at the top-level scope,
  // but they are still not allowed in non-async functions.
  allowAwaitOutsideFunction: null,
  // When enabled, super identifiers are not constrained to
  // appearing in methods and do not raise an error when they appear elsewhere.
  allowSuperOutsideMethod: null,
  // When enabled, hashbang directive in the beginning of file is
  // allowed and treated as a line comment. Enabled by default when
  // `ecmaVersion` >= 2023.
  allowHashBang: !1,
  // By default, the parser will verify that private properties are
  // only used in places where they are valid and have been declared.
  // Set this to false to turn such checks off.
  checkPrivateFields: !0,
  // When `locations` is on, `loc` properties holding objects with
  // `start` and `end` properties in `{line, column}` form (with
  // line being 1-based and column 0-based) will be attached to the
  // nodes.
  locations: !1,
  // A function can be passed as `onToken` option, which will
  // cause Acorn to call that function with object in the same
  // format as tokens returned from `tokenizer().getToken()`. Note
  // that you are not allowed to call the parser from the
  // callback—that will corrupt its internal state.
  onToken: null,
  // A function can be passed as `onComment` option, which will
  // cause Acorn to call that function with `(block, text, start,
  // end)` parameters whenever a comment is skipped. `block` is a
  // boolean indicating whether this is a block (`/* */`) comment,
  // `text` is the content of the comment, and `start` and `end` are
  // character offsets that denote the start and end of the comment.
  // When the `locations` option is on, two more parameters are
  // passed, the full `{line, column}` locations of the start and
  // end of the comments. Note that you are not allowed to call the
  // parser from the callback—that will corrupt its internal state.
  // When this option has an array as value, objects representing the
  // comments are pushed to it.
  onComment: null,
  // Nodes have their start and end characters offsets recorded in
  // `start` and `end` properties (directly on the node, rather than
  // the `loc` object, which holds line/column data. To also add a
  // [semi-standardized][range] `range` property holding a `[start,
  // end]` array with the same numbers, set the `ranges` option to
  // `true`.
  //
  // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
  ranges: !1,
  // It is possible to parse multiple files into a single AST by
  // passing the tree produced by parsing the first file as
  // `program` option in subsequent parses. This will add the
  // toplevel forms of the parsed file to the `Program` (top) node
  // of an existing parse tree.
  program: null,
  // When `locations` is on, you can pass this to record the source
  // file in every node's `loc` object.
  sourceFile: null,
  // This value, if given, is stored in every node, whether
  // `locations` is on or off.
  directSourceFile: null,
  // When enabled, parenthesized expressions are represented by
  // (non-standard) ParenthesizedExpression nodes
  preserveParens: !1
}, Be = !1;
function Wt(e) {
  var t = {};
  for (var i in Ce)
    t[i] = e && $(e, i) ? e[i] : Ce[i];
  if (t.ecmaVersion === "latest" ? t.ecmaVersion = 1e8 : t.ecmaVersion == null ? (!Be && typeof console == "object" && console.warn && (Be = !0, console.warn(`Since Acorn 8.0.0, options.ecmaVersion is required.
Defaulting to 2020, but this will stop working in the future.`)), t.ecmaVersion = 11) : t.ecmaVersion >= 2015 && (t.ecmaVersion -= 2009), t.allowReserved == null && (t.allowReserved = t.ecmaVersion < 5), (!e || e.allowHashBang == null) && (t.allowHashBang = t.ecmaVersion >= 14), Re(t.onToken)) {
    var s = t.onToken;
    t.onToken = function(r) {
      return s.push(r);
    };
  }
  if (Re(t.onComment) && (t.onComment = Ht(t, t.onComment)), t.sourceType === "commonjs" && t.allowAwaitOutsideFunction)
    throw new Error("Cannot use allowAwaitOutsideFunction with sourceType: commonjs");
  return t;
}
function Ht(e, t) {
  return function(i, s, r, n, o, u) {
    var h = {
      type: i ? "Block" : "Line",
      value: s,
      start: r,
      end: n
    };
    e.locations && (h.loc = new ce(this, o, u)), e.ranges && (h.range = [r, n]), t.push(h);
  };
}
var Q = 1, X = 2, Ee = 4, Qe = 8, Ae = 16, Xe = 32, le = 64, Ze = 128, Z = 256, se = 512, Je = 1024, pe = Q | X | Z;
function Ie(e, t) {
  return X | (e ? Ee : 0) | (t ? Qe : 0);
}
var ae = 0, Pe = 1, G = 2, $e = 3, et = 4, tt = 5, C = function(t, i, s) {
  this.options = t = Wt(t), this.sourceFile = t.sourceFile, this.keywords = H(Dt[t.ecmaVersion >= 6 ? 6 : t.sourceType === "module" ? "5module" : 5]);
  var r = "";
  t.allowReserved !== !0 && (r = me[t.ecmaVersion >= 6 ? 6 : t.ecmaVersion === 5 ? 5 : 3], t.sourceType === "module" && (r += " await")), this.reservedWords = H(r);
  var n = (r ? r + " " : "") + me.strict;
  this.reservedWordsStrict = H(n), this.reservedWordsStrictBind = H(n + " " + me.strictBind), this.input = String(i), this.containsEsc = !1, s ? (this.pos = s, this.lineStart = this.input.lastIndexOf(`
`, s - 1) + 1, this.curLine = this.input.slice(0, this.lineStart).split(N).length) : (this.pos = this.lineStart = 0, this.curLine = 1), this.type = a.eof, this.value = null, this.start = this.end = this.pos, this.startLoc = this.endLoc = this.curPosition(), this.lastTokEndLoc = this.lastTokStartLoc = null, this.lastTokStart = this.lastTokEnd = this.pos, this.context = this.initialContext(), this.exprAllowed = !0, this.inModule = t.sourceType === "module", this.strict = this.inModule || this.strictDirective(this.pos), this.potentialArrowAt = -1, this.potentialArrowInForAwait = !1, this.yieldPos = this.awaitPos = this.awaitIdentPos = 0, this.labels = [], this.undefinedExports = /* @__PURE__ */ Object.create(null), this.pos === 0 && t.allowHashBang && this.input.slice(0, 2) === "#!" && this.skipLineComment(2), this.scopeStack = [], this.enterScope(
    this.options.sourceType === "commonjs" ? X : Q
  ), this.regexpState = null, this.privateNameStack = [];
}, O = { inFunction: { configurable: !0 }, inGenerator: { configurable: !0 }, inAsync: { configurable: !0 }, canAwait: { configurable: !0 }, allowReturn: { configurable: !0 }, allowSuper: { configurable: !0 }, allowDirectSuper: { configurable: !0 }, treatFunctionsAsVar: { configurable: !0 }, allowNewDotTarget: { configurable: !0 }, allowUsing: { configurable: !0 }, inClassStaticBlock: { configurable: !0 } };
C.prototype.parse = function() {
  var t = this.options.program || this.startNode();
  return this.nextToken(), this.parseTopLevel(t);
};
O.inFunction.get = function() {
  return (this.currentVarScope().flags & X) > 0;
};
O.inGenerator.get = function() {
  return (this.currentVarScope().flags & Qe) > 0;
};
O.inAsync.get = function() {
  return (this.currentVarScope().flags & Ee) > 0;
};
O.canAwait.get = function() {
  for (var e = this.scopeStack.length - 1; e >= 0; e--) {
    var t = this.scopeStack[e], i = t.flags;
    if (i & (Z | se))
      return !1;
    if (i & X)
      return (i & Ee) > 0;
  }
  return this.inModule && this.options.ecmaVersion >= 13 || this.options.allowAwaitOutsideFunction;
};
O.allowReturn.get = function() {
  return !!(this.inFunction || this.options.allowReturnOutsideFunction && this.currentVarScope().flags & Q);
};
O.allowSuper.get = function() {
  var e = this.currentThisScope(), t = e.flags;
  return (t & le) > 0 || this.options.allowSuperOutsideMethod;
};
O.allowDirectSuper.get = function() {
  return (this.currentThisScope().flags & Ze) > 0;
};
O.treatFunctionsAsVar.get = function() {
  return this.treatFunctionsAsVarInScope(this.currentScope());
};
O.allowNewDotTarget.get = function() {
  for (var e = this.scopeStack.length - 1; e >= 0; e--) {
    var t = this.scopeStack[e], i = t.flags;
    if (i & (Z | se) || i & X && !(i & Ae))
      return !0;
  }
  return !1;
};
O.allowUsing.get = function() {
  var e = this.currentScope(), t = e.flags;
  return !(t & Je || !this.inModule && t & Q);
};
O.inClassStaticBlock.get = function() {
  return (this.currentVarScope().flags & Z) > 0;
};
C.extend = function() {
  for (var t = [], i = arguments.length; i--; ) t[i] = arguments[i];
  for (var s = this, r = 0; r < t.length; r++)
    s = t[r](s);
  return s;
};
C.parse = function(t, i) {
  return new this(i, t).parse();
};
C.parseExpressionAt = function(t, i, s) {
  var r = new this(s, t, i);
  return r.nextToken(), r.parseExpression();
};
C.tokenizer = function(t, i) {
  return new this(i, t);
};
Object.defineProperties(C.prototype, O);
var I = C.prototype, zt = /^(?:'((?:\\[^]|[^'\\])*?)'|"((?:\\[^]|[^"\\])*?)")/;
I.strictDirective = function(e) {
  if (this.options.ecmaVersion < 5)
    return !1;
  for (; ; ) {
    A.lastIndex = e, e += A.exec(this.input)[0].length;
    var t = zt.exec(this.input.slice(e));
    if (!t)
      return !1;
    if ((t[1] || t[2]) === "use strict") {
      A.lastIndex = e + t[0].length;
      var i = A.exec(this.input), s = i.index + i[0].length, r = this.input.charAt(s);
      return r === ";" || r === "}" || N.test(i[0]) && !(/[(`.[+\-/*%<>=,?^&]/.test(r) || r === "!" && this.input.charAt(s + 1) === "=");
    }
    e += t[0].length, A.lastIndex = e, e += A.exec(this.input)[0].length, this.input[e] === ";" && e++;
  }
};
I.eat = function(e) {
  return this.type === e ? (this.next(), !0) : !1;
};
I.isContextual = function(e) {
  return this.type === a.name && this.value === e && !this.containsEsc;
};
I.eatContextual = function(e) {
  return this.isContextual(e) ? (this.next(), !0) : !1;
};
I.expectContextual = function(e) {
  this.eatContextual(e) || this.unexpected();
};
I.canInsertSemicolon = function() {
  return this.type === a.eof || this.type === a.braceR || N.test(this.input.slice(this.lastTokEnd, this.start));
};
I.insertSemicolon = function() {
  if (this.canInsertSemicolon())
    return this.options.onInsertedSemicolon && this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc), !0;
};
I.semicolon = function() {
  !this.eat(a.semi) && !this.insertSemicolon() && this.unexpected();
};
I.afterTrailingComma = function(e, t) {
  if (this.type === e)
    return this.options.onTrailingComma && this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc), t || this.next(), !0;
};
I.expect = function(e) {
  this.eat(e) || this.unexpected();
};
I.unexpected = function(e) {
  this.raise(e ?? this.start, "Unexpected token");
};
var fe = function() {
  this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
};
I.checkPatternErrors = function(e, t) {
  if (e) {
    e.trailingComma > -1 && this.raiseRecoverable(e.trailingComma, "Comma is not permitted after the rest element");
    var i = t ? e.parenthesizedAssign : e.parenthesizedBind;
    i > -1 && this.raiseRecoverable(i, t ? "Assigning to rvalue" : "Parenthesized pattern");
  }
};
I.checkExpressionErrors = function(e, t) {
  if (!e)
    return !1;
  var i = e.shorthandAssign, s = e.doubleProto;
  if (!t)
    return i >= 0 || s >= 0;
  i >= 0 && this.raise(i, "Shorthand property assignments are valid only in destructuring patterns"), s >= 0 && this.raiseRecoverable(s, "Redefinition of __proto__ property");
};
I.checkYieldAwaitInDefaultParams = function() {
  this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos) && this.raise(this.yieldPos, "Yield expression cannot be a default value"), this.awaitPos && this.raise(this.awaitPos, "Await expression cannot be a default value");
};
I.isSimpleAssignTarget = function(e) {
  return e.type === "ParenthesizedExpression" ? this.isSimpleAssignTarget(e.expression) : e.type === "Identifier" || e.type === "MemberExpression";
};
var p = C.prototype;
p.parseTopLevel = function(e) {
  var t = /* @__PURE__ */ Object.create(null);
  for (e.body || (e.body = []); this.type !== a.eof; ) {
    var i = this.parseStatement(null, !0, t);
    e.body.push(i);
  }
  if (this.inModule)
    for (var s = 0, r = Object.keys(this.undefinedExports); s < r.length; s += 1) {
      var n = r[s];
      this.raiseRecoverable(this.undefinedExports[n].start, "Export '" + n + "' is not defined");
    }
  return this.adaptDirectivePrologue(e.body), this.next(), e.sourceType = this.options.sourceType === "commonjs" ? "script" : this.options.sourceType, this.finishNode(e, "Program");
};
var Ne = { kind: "loop" }, Kt = { kind: "switch" };
p.isLet = function(e) {
  if (this.options.ecmaVersion < 6 || !this.isContextual("let"))
    return !1;
  A.lastIndex = this.pos;
  var t = A.exec(this.input), i = this.pos + t[0].length, s = this.fullCharCodeAt(i);
  if (s === 91 || s === 92)
    return !0;
  if (e)
    return !1;
  if (s === 123)
    return !0;
  if (M(s)) {
    var r = i;
    do
      i += s <= 65535 ? 1 : 2;
    while (z(s = this.fullCharCodeAt(i)));
    if (s === 92)
      return !0;
    var n = this.input.slice(r, i);
    if (!We.test(n))
      return !0;
  }
  return !1;
};
p.isAsyncFunction = function() {
  if (this.options.ecmaVersion < 8 || !this.isContextual("async"))
    return !1;
  A.lastIndex = this.pos;
  var e = A.exec(this.input), t = this.pos + e[0].length, i;
  return !N.test(this.input.slice(this.pos, t)) && this.input.slice(t, t + 8) === "function" && (t + 8 === this.input.length || !(z(i = this.fullCharCodeAt(t + 8)) || i === 92));
};
p.isUsingKeyword = function(e, t) {
  if (this.options.ecmaVersion < 17 || !this.isContextual(e ? "await" : "using"))
    return !1;
  A.lastIndex = this.pos;
  var i = A.exec(this.input), s = this.pos + i[0].length;
  if (N.test(this.input.slice(this.pos, s)))
    return !1;
  if (e) {
    var r = s + 5, n;
    if (this.input.slice(s, r) !== "using" || r === this.input.length || z(n = this.fullCharCodeAt(r)) || n === 92)
      return !1;
    A.lastIndex = r;
    var o = A.exec(this.input);
    if (s = r + o[0].length, o && N.test(this.input.slice(r, s)))
      return !1;
  }
  var u = this.fullCharCodeAt(s);
  if (!M(u) && u !== 92)
    return !1;
  var h = s;
  do
    s += u <= 65535 ? 1 : 2;
  while (z(u = this.fullCharCodeAt(s)));
  if (u === 92)
    return !0;
  var c = this.input.slice(h, s);
  return !(We.test(c) || t && c === "of");
};
p.isAwaitUsing = function(e) {
  return this.isUsingKeyword(!0, e);
};
p.isUsing = function(e) {
  return this.isUsingKeyword(!1, e);
};
p.parseStatement = function(e, t, i) {
  var s = this.type, r = this.startNode(), n;
  switch (this.isLet(e) && (s = a._var, n = "let"), s) {
    case a._break:
    case a._continue:
      return this.parseBreakContinueStatement(r, s.keyword);
    case a._debugger:
      return this.parseDebuggerStatement(r);
    case a._do:
      return this.parseDoStatement(r);
    case a._for:
      return this.parseForStatement(r);
    case a._function:
      return e && (this.strict || e !== "if" && e !== "label") && this.options.ecmaVersion >= 6 && this.unexpected(), this.parseFunctionStatement(r, !1, !e);
    case a._class:
      return e && this.unexpected(), this.parseClass(r, !0);
    case a._if:
      return this.parseIfStatement(r);
    case a._return:
      return this.parseReturnStatement(r);
    case a._switch:
      return this.parseSwitchStatement(r);
    case a._throw:
      return this.parseThrowStatement(r);
    case a._try:
      return this.parseTryStatement(r);
    case a._const:
    case a._var:
      return n = n || this.value, e && n !== "var" && this.unexpected(), this.parseVarStatement(r, n);
    case a._while:
      return this.parseWhileStatement(r);
    case a._with:
      return this.parseWithStatement(r);
    case a.braceL:
      return this.parseBlock(!0, r);
    case a.semi:
      return this.parseEmptyStatement(r);
    case a._export:
    case a._import:
      if (this.options.ecmaVersion > 10 && s === a._import) {
        A.lastIndex = this.pos;
        var o = A.exec(this.input), u = this.pos + o[0].length, h = this.input.charCodeAt(u);
        if (h === 40 || h === 46)
          return this.parseExpressionStatement(r, this.parseExpression());
      }
      return this.options.allowImportExportEverywhere || (t || this.raise(this.start, "'import' and 'export' may only appear at the top level"), this.inModule || this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'")), s === a._import ? this.parseImport(r) : this.parseExport(r, i);
    default:
      if (this.isAsyncFunction())
        return e && this.unexpected(), this.next(), this.parseFunctionStatement(r, !0, !e);
      var c = this.isAwaitUsing(!1) ? "await using" : this.isUsing(!1) ? "using" : null;
      if (c)
        return this.allowUsing || this.raise(this.start, "Using declaration cannot appear in the top level when source type is `script` or in the bare case statement"), c === "await using" && (this.canAwait || this.raise(this.start, "Await using cannot appear outside of async function"), this.next()), this.next(), this.parseVar(r, !1, c), this.semicolon(), this.finishNode(r, "VariableDeclaration");
      var f = this.value, x = this.parseExpression();
      return s === a.name && x.type === "Identifier" && this.eat(a.colon) ? this.parseLabeledStatement(r, f, x, e) : this.parseExpressionStatement(r, x);
  }
};
p.parseBreakContinueStatement = function(e, t) {
  var i = t === "break";
  this.next(), this.eat(a.semi) || this.insertSemicolon() ? e.label = null : this.type !== a.name ? this.unexpected() : (e.label = this.parseIdent(), this.semicolon());
  for (var s = 0; s < this.labels.length; ++s) {
    var r = this.labels[s];
    if ((e.label == null || r.name === e.label.name) && (r.kind != null && (i || r.kind === "loop") || e.label && i))
      break;
  }
  return s === this.labels.length && this.raise(e.start, "Unsyntactic " + t), this.finishNode(e, i ? "BreakStatement" : "ContinueStatement");
};
p.parseDebuggerStatement = function(e) {
  return this.next(), this.semicolon(), this.finishNode(e, "DebuggerStatement");
};
p.parseDoStatement = function(e) {
  return this.next(), this.labels.push(Ne), e.body = this.parseStatement("do"), this.labels.pop(), this.expect(a._while), e.test = this.parseParenExpression(), this.options.ecmaVersion >= 6 ? this.eat(a.semi) : this.semicolon(), this.finishNode(e, "DoWhileStatement");
};
p.parseForStatement = function(e) {
  this.next();
  var t = this.options.ecmaVersion >= 9 && this.canAwait && this.eatContextual("await") ? this.lastTokStart : -1;
  if (this.labels.push(Ne), this.enterScope(0), this.expect(a.parenL), this.type === a.semi)
    return t > -1 && this.unexpected(t), this.parseFor(e, null);
  var i = this.isLet();
  if (this.type === a._var || this.type === a._const || i) {
    var s = this.startNode(), r = i ? "let" : this.value;
    return this.next(), this.parseVar(s, !0, r), this.finishNode(s, "VariableDeclaration"), this.parseForAfterInit(e, s, t);
  }
  var n = this.isContextual("let"), o = !1, u = this.isUsing(!0) ? "using" : this.isAwaitUsing(!0) ? "await using" : null;
  if (u) {
    var h = this.startNode();
    return this.next(), u === "await using" && (this.canAwait || this.raise(this.start, "Await using cannot appear outside of async function"), this.next()), this.parseVar(h, !0, u), this.finishNode(h, "VariableDeclaration"), this.parseForAfterInit(e, h, t);
  }
  var c = this.containsEsc, f = new fe(), x = this.start, b = t > -1 ? this.parseExprSubscripts(f, "await") : this.parseExpression(!0, f);
  return this.type === a._in || (o = this.options.ecmaVersion >= 6 && this.isContextual("of")) ? (t > -1 ? (this.type === a._in && this.unexpected(t), e.await = !0) : o && this.options.ecmaVersion >= 8 && (b.start === x && !c && b.type === "Identifier" && b.name === "async" ? this.unexpected() : this.options.ecmaVersion >= 9 && (e.await = !1)), n && o && this.raise(b.start, "The left-hand side of a for-of loop may not start with 'let'."), this.toAssignable(b, !1, f), this.checkLValPattern(b), this.parseForIn(e, b)) : (this.checkExpressionErrors(f, !0), t > -1 && this.unexpected(t), this.parseFor(e, b));
};
p.parseForAfterInit = function(e, t, i) {
  return (this.type === a._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && t.declarations.length === 1 ? (this.options.ecmaVersion >= 9 && (this.type === a._in ? i > -1 && this.unexpected(i) : e.await = i > -1), this.parseForIn(e, t)) : (i > -1 && this.unexpected(i), this.parseFor(e, t));
};
p.parseFunctionStatement = function(e, t, i) {
  return this.next(), this.parseFunction(e, te | (i ? 0 : Se), !1, t);
};
p.parseIfStatement = function(e) {
  return this.next(), e.test = this.parseParenExpression(), e.consequent = this.parseStatement("if"), e.alternate = this.eat(a._else) ? this.parseStatement("if") : null, this.finishNode(e, "IfStatement");
};
p.parseReturnStatement = function(e) {
  return this.allowReturn || this.raise(this.start, "'return' outside of function"), this.next(), this.eat(a.semi) || this.insertSemicolon() ? e.argument = null : (e.argument = this.parseExpression(), this.semicolon()), this.finishNode(e, "ReturnStatement");
};
p.parseSwitchStatement = function(e) {
  this.next(), e.discriminant = this.parseParenExpression(), e.cases = [], this.expect(a.braceL), this.labels.push(Kt), this.enterScope(Je);
  for (var t, i = !1; this.type !== a.braceR; )
    if (this.type === a._case || this.type === a._default) {
      var s = this.type === a._case;
      t && this.finishNode(t, "SwitchCase"), e.cases.push(t = this.startNode()), t.consequent = [], this.next(), s ? t.test = this.parseExpression() : (i && this.raiseRecoverable(this.lastTokStart, "Multiple default clauses"), i = !0, t.test = null), this.expect(a.colon);
    } else
      t || this.unexpected(), t.consequent.push(this.parseStatement(null));
  return this.exitScope(), t && this.finishNode(t, "SwitchCase"), this.next(), this.labels.pop(), this.finishNode(e, "SwitchStatement");
};
p.parseThrowStatement = function(e) {
  return this.next(), N.test(this.input.slice(this.lastTokEnd, this.start)) && this.raise(this.lastTokEnd, "Illegal newline after throw"), e.argument = this.parseExpression(), this.semicolon(), this.finishNode(e, "ThrowStatement");
};
var Yt = [];
p.parseCatchClauseParam = function() {
  var e = this.parseBindingAtom(), t = e.type === "Identifier";
  return this.enterScope(t ? Xe : 0), this.checkLValPattern(e, t ? et : G), this.expect(a.parenR), e;
};
p.parseTryStatement = function(e) {
  if (this.next(), e.block = this.parseBlock(), e.handler = null, this.type === a._catch) {
    var t = this.startNode();
    this.next(), this.eat(a.parenL) ? t.param = this.parseCatchClauseParam() : (this.options.ecmaVersion < 10 && this.unexpected(), t.param = null, this.enterScope(0)), t.body = this.parseBlock(!1), this.exitScope(), e.handler = this.finishNode(t, "CatchClause");
  }
  return e.finalizer = this.eat(a._finally) ? this.parseBlock() : null, !e.handler && !e.finalizer && this.raise(e.start, "Missing catch or finally clause"), this.finishNode(e, "TryStatement");
};
p.parseVarStatement = function(e, t, i) {
  return this.next(), this.parseVar(e, !1, t, i), this.semicolon(), this.finishNode(e, "VariableDeclaration");
};
p.parseWhileStatement = function(e) {
  return this.next(), e.test = this.parseParenExpression(), this.labels.push(Ne), e.body = this.parseStatement("while"), this.labels.pop(), this.finishNode(e, "WhileStatement");
};
p.parseWithStatement = function(e) {
  return this.strict && this.raise(this.start, "'with' in strict mode"), this.next(), e.object = this.parseParenExpression(), e.body = this.parseStatement("with"), this.finishNode(e, "WithStatement");
};
p.parseEmptyStatement = function(e) {
  return this.next(), this.finishNode(e, "EmptyStatement");
};
p.parseLabeledStatement = function(e, t, i, s) {
  for (var r = 0, n = this.labels; r < n.length; r += 1) {
    var o = n[r];
    o.name === t && this.raise(i.start, "Label '" + t + "' is already declared");
  }
  for (var u = this.type.isLoop ? "loop" : this.type === a._switch ? "switch" : null, h = this.labels.length - 1; h >= 0; h--) {
    var c = this.labels[h];
    if (c.statementStart === e.start)
      c.statementStart = this.start, c.kind = u;
    else
      break;
  }
  return this.labels.push({ name: t, kind: u, statementStart: this.start }), e.body = this.parseStatement(s ? s.indexOf("label") === -1 ? s + "label" : s : "label"), this.labels.pop(), e.label = i, this.finishNode(e, "LabeledStatement");
};
p.parseExpressionStatement = function(e, t) {
  return e.expression = t, this.semicolon(), this.finishNode(e, "ExpressionStatement");
};
p.parseBlock = function(e, t, i) {
  for (e === void 0 && (e = !0), t === void 0 && (t = this.startNode()), t.body = [], this.expect(a.braceL), e && this.enterScope(0); this.type !== a.braceR; ) {
    var s = this.parseStatement(null);
    t.body.push(s);
  }
  return i && (this.strict = !1), this.next(), e && this.exitScope(), this.finishNode(t, "BlockStatement");
};
p.parseFor = function(e, t) {
  return e.init = t, this.expect(a.semi), e.test = this.type === a.semi ? null : this.parseExpression(), this.expect(a.semi), e.update = this.type === a.parenR ? null : this.parseExpression(), this.expect(a.parenR), e.body = this.parseStatement("for"), this.exitScope(), this.labels.pop(), this.finishNode(e, "ForStatement");
};
p.parseForIn = function(e, t) {
  var i = this.type === a._in;
  return this.next(), t.type === "VariableDeclaration" && t.declarations[0].init != null && (!i || this.options.ecmaVersion < 8 || this.strict || t.kind !== "var" || t.declarations[0].id.type !== "Identifier") && this.raise(
    t.start,
    (i ? "for-in" : "for-of") + " loop variable declaration may not have an initializer"
  ), e.left = t, e.right = i ? this.parseExpression() : this.parseMaybeAssign(), this.expect(a.parenR), e.body = this.parseStatement("for"), this.exitScope(), this.labels.pop(), this.finishNode(e, i ? "ForInStatement" : "ForOfStatement");
};
p.parseVar = function(e, t, i, s) {
  for (e.declarations = [], e.kind = i; ; ) {
    var r = this.startNode();
    if (this.parseVarId(r, i), this.eat(a.eq) ? r.init = this.parseMaybeAssign(t) : !s && i === "const" && !(this.type === a._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) ? this.unexpected() : !s && (i === "using" || i === "await using") && this.options.ecmaVersion >= 17 && this.type !== a._in && !this.isContextual("of") ? this.raise(this.lastTokEnd, "Missing initializer in " + i + " declaration") : !s && r.id.type !== "Identifier" && !(t && (this.type === a._in || this.isContextual("of"))) ? this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value") : r.init = null, e.declarations.push(this.finishNode(r, "VariableDeclarator")), !this.eat(a.comma))
      break;
  }
  return e;
};
p.parseVarId = function(e, t) {
  e.id = t === "using" || t === "await using" ? this.parseIdent() : this.parseBindingAtom(), this.checkLValPattern(e.id, t === "var" ? Pe : G, !1);
};
var te = 1, Se = 2, it = 4;
p.parseFunction = function(e, t, i, s, r) {
  this.initFunction(e), (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !s) && (this.type === a.star && t & Se && this.unexpected(), e.generator = this.eat(a.star)), this.options.ecmaVersion >= 8 && (e.async = !!s), t & te && (e.id = t & it && this.type !== a.name ? null : this.parseIdent(), e.id && !(t & Se) && this.checkLValSimple(e.id, this.strict || e.generator || e.async ? this.treatFunctionsAsVar ? Pe : G : $e));
  var n = this.yieldPos, o = this.awaitPos, u = this.awaitIdentPos;
  return this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(Ie(e.async, e.generator)), t & te || (e.id = this.type === a.name ? this.parseIdent() : null), this.parseFunctionParams(e), this.parseFunctionBody(e, i, !1, r), this.yieldPos = n, this.awaitPos = o, this.awaitIdentPos = u, this.finishNode(e, t & te ? "FunctionDeclaration" : "FunctionExpression");
};
p.parseFunctionParams = function(e) {
  this.expect(a.parenL), e.params = this.parseBindingList(a.parenR, !1, this.options.ecmaVersion >= 8), this.checkYieldAwaitInDefaultParams();
};
p.parseClass = function(e, t) {
  this.next();
  var i = this.strict;
  this.strict = !0, this.parseClassId(e, t), this.parseClassSuper(e);
  var s = this.enterClassBody(), r = this.startNode(), n = !1;
  for (r.body = [], this.expect(a.braceL); this.type !== a.braceR; ) {
    var o = this.parseClassElement(e.superClass !== null);
    o && (r.body.push(o), o.type === "MethodDefinition" && o.kind === "constructor" ? (n && this.raiseRecoverable(o.start, "Duplicate constructor in the same class"), n = !0) : o.key && o.key.type === "PrivateIdentifier" && Qt(s, o) && this.raiseRecoverable(o.key.start, "Identifier '#" + o.key.name + "' has already been declared"));
  }
  return this.strict = i, this.next(), e.body = this.finishNode(r, "ClassBody"), this.exitClassBody(), this.finishNode(e, t ? "ClassDeclaration" : "ClassExpression");
};
p.parseClassElement = function(e) {
  if (this.eat(a.semi))
    return null;
  var t = this.options.ecmaVersion, i = this.startNode(), s = "", r = !1, n = !1, o = "method", u = !1;
  if (this.eatContextual("static")) {
    if (t >= 13 && this.eat(a.braceL))
      return this.parseClassStaticBlock(i), i;
    this.isClassElementNameStart() || this.type === a.star ? u = !0 : s = "static";
  }
  if (i.static = u, !s && t >= 8 && this.eatContextual("async") && ((this.isClassElementNameStart() || this.type === a.star) && !this.canInsertSemicolon() ? n = !0 : s = "async"), !s && (t >= 9 || !n) && this.eat(a.star) && (r = !0), !s && !n && !r) {
    var h = this.value;
    (this.eatContextual("get") || this.eatContextual("set")) && (this.isClassElementNameStart() ? o = h : s = h);
  }
  if (s ? (i.computed = !1, i.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc), i.key.name = s, this.finishNode(i.key, "Identifier")) : this.parseClassElementName(i), t < 13 || this.type === a.parenL || o !== "method" || r || n) {
    var c = !i.static && ne(i, "constructor"), f = c && e;
    c && o !== "method" && this.raise(i.key.start, "Constructor can't have get/set modifier"), i.kind = c ? "constructor" : o, this.parseClassMethod(i, r, n, f);
  } else
    this.parseClassField(i);
  return i;
};
p.isClassElementNameStart = function() {
  return this.type === a.name || this.type === a.privateId || this.type === a.num || this.type === a.string || this.type === a.bracketL || this.type.keyword;
};
p.parseClassElementName = function(e) {
  this.type === a.privateId ? (this.value === "constructor" && this.raise(this.start, "Classes can't have an element named '#constructor'"), e.computed = !1, e.key = this.parsePrivateIdent()) : this.parsePropertyName(e);
};
p.parseClassMethod = function(e, t, i, s) {
  var r = e.key;
  e.kind === "constructor" ? (t && this.raise(r.start, "Constructor can't be a generator"), i && this.raise(r.start, "Constructor can't be an async method")) : e.static && ne(e, "prototype") && this.raise(r.start, "Classes may not have a static property named prototype");
  var n = e.value = this.parseMethod(t, i, s);
  return e.kind === "get" && n.params.length !== 0 && this.raiseRecoverable(n.start, "getter should have no params"), e.kind === "set" && n.params.length !== 1 && this.raiseRecoverable(n.start, "setter should have exactly one param"), e.kind === "set" && n.params[0].type === "RestElement" && this.raiseRecoverable(n.params[0].start, "Setter cannot use rest params"), this.finishNode(e, "MethodDefinition");
};
p.parseClassField = function(e) {
  return ne(e, "constructor") ? this.raise(e.key.start, "Classes can't have a field named 'constructor'") : e.static && ne(e, "prototype") && this.raise(e.key.start, "Classes can't have a static field named 'prototype'"), this.eat(a.eq) ? (this.enterScope(se | le), e.value = this.parseMaybeAssign(), this.exitScope()) : e.value = null, this.semicolon(), this.finishNode(e, "PropertyDefinition");
};
p.parseClassStaticBlock = function(e) {
  e.body = [];
  var t = this.labels;
  for (this.labels = [], this.enterScope(Z | le); this.type !== a.braceR; ) {
    var i = this.parseStatement(null);
    e.body.push(i);
  }
  return this.next(), this.exitScope(), this.labels = t, this.finishNode(e, "StaticBlock");
};
p.parseClassId = function(e, t) {
  this.type === a.name ? (e.id = this.parseIdent(), t && this.checkLValSimple(e.id, G, !1)) : (t === !0 && this.unexpected(), e.id = null);
};
p.parseClassSuper = function(e) {
  e.superClass = this.eat(a._extends) ? this.parseExprSubscripts(null, !1) : null;
};
p.enterClassBody = function() {
  var e = { declared: /* @__PURE__ */ Object.create(null), used: [] };
  return this.privateNameStack.push(e), e.declared;
};
p.exitClassBody = function() {
  var e = this.privateNameStack.pop(), t = e.declared, i = e.used;
  if (this.options.checkPrivateFields)
    for (var s = this.privateNameStack.length, r = s === 0 ? null : this.privateNameStack[s - 1], n = 0; n < i.length; ++n) {
      var o = i[n];
      $(t, o.name) || (r ? r.used.push(o) : this.raiseRecoverable(o.start, "Private field '#" + o.name + "' must be declared in an enclosing class"));
    }
};
function Qt(e, t) {
  var i = t.key.name, s = e[i], r = "true";
  return t.type === "MethodDefinition" && (t.kind === "get" || t.kind === "set") && (r = (t.static ? "s" : "i") + t.kind), s === "iget" && r === "iset" || s === "iset" && r === "iget" || s === "sget" && r === "sset" || s === "sset" && r === "sget" ? (e[i] = "true", !1) : s ? !0 : (e[i] = r, !1);
}
function ne(e, t) {
  var i = e.computed, s = e.key;
  return !i && (s.type === "Identifier" && s.name === t || s.type === "Literal" && s.value === t);
}
p.parseExportAllDeclaration = function(e, t) {
  return this.options.ecmaVersion >= 11 && (this.eatContextual("as") ? (e.exported = this.parseModuleExportName(), this.checkExport(t, e.exported, this.lastTokStart)) : e.exported = null), this.expectContextual("from"), this.type !== a.string && this.unexpected(), e.source = this.parseExprAtom(), this.options.ecmaVersion >= 16 && (e.attributes = this.parseWithClause()), this.semicolon(), this.finishNode(e, "ExportAllDeclaration");
};
p.parseExport = function(e, t) {
  if (this.next(), this.eat(a.star))
    return this.parseExportAllDeclaration(e, t);
  if (this.eat(a._default))
    return this.checkExport(t, "default", this.lastTokStart), e.declaration = this.parseExportDefaultDeclaration(), this.finishNode(e, "ExportDefaultDeclaration");
  if (this.shouldParseExportStatement())
    e.declaration = this.parseExportDeclaration(e), e.declaration.type === "VariableDeclaration" ? this.checkVariableExport(t, e.declaration.declarations) : this.checkExport(t, e.declaration.id, e.declaration.id.start), e.specifiers = [], e.source = null, this.options.ecmaVersion >= 16 && (e.attributes = []);
  else {
    if (e.declaration = null, e.specifiers = this.parseExportSpecifiers(t), this.eatContextual("from"))
      this.type !== a.string && this.unexpected(), e.source = this.parseExprAtom(), this.options.ecmaVersion >= 16 && (e.attributes = this.parseWithClause());
    else {
      for (var i = 0, s = e.specifiers; i < s.length; i += 1) {
        var r = s[i];
        this.checkUnreserved(r.local), this.checkLocalExport(r.local), r.local.type === "Literal" && this.raise(r.local.start, "A string literal cannot be used as an exported binding without `from`.");
      }
      e.source = null, this.options.ecmaVersion >= 16 && (e.attributes = []);
    }
    this.semicolon();
  }
  return this.finishNode(e, "ExportNamedDeclaration");
};
p.parseExportDeclaration = function(e) {
  return this.parseStatement(null);
};
p.parseExportDefaultDeclaration = function() {
  var e;
  if (this.type === a._function || (e = this.isAsyncFunction())) {
    var t = this.startNode();
    return this.next(), e && this.next(), this.parseFunction(t, te | it, !1, e);
  } else if (this.type === a._class) {
    var i = this.startNode();
    return this.parseClass(i, "nullableID");
  } else {
    var s = this.parseMaybeAssign();
    return this.semicolon(), s;
  }
};
p.checkExport = function(e, t, i) {
  e && (typeof t != "string" && (t = t.type === "Identifier" ? t.name : t.value), $(e, t) && this.raiseRecoverable(i, "Duplicate export '" + t + "'"), e[t] = !0);
};
p.checkPatternExport = function(e, t) {
  var i = t.type;
  if (i === "Identifier")
    this.checkExport(e, t, t.start);
  else if (i === "ObjectPattern")
    for (var s = 0, r = t.properties; s < r.length; s += 1) {
      var n = r[s];
      this.checkPatternExport(e, n);
    }
  else if (i === "ArrayPattern")
    for (var o = 0, u = t.elements; o < u.length; o += 1) {
      var h = u[o];
      h && this.checkPatternExport(e, h);
    }
  else i === "Property" ? this.checkPatternExport(e, t.value) : i === "AssignmentPattern" ? this.checkPatternExport(e, t.left) : i === "RestElement" && this.checkPatternExport(e, t.argument);
};
p.checkVariableExport = function(e, t) {
  if (e)
    for (var i = 0, s = t; i < s.length; i += 1) {
      var r = s[i];
      this.checkPatternExport(e, r.id);
    }
};
p.shouldParseExportStatement = function() {
  return this.type.keyword === "var" || this.type.keyword === "const" || this.type.keyword === "class" || this.type.keyword === "function" || this.isLet() || this.isAsyncFunction();
};
p.parseExportSpecifier = function(e) {
  var t = this.startNode();
  return t.local = this.parseModuleExportName(), t.exported = this.eatContextual("as") ? this.parseModuleExportName() : t.local, this.checkExport(
    e,
    t.exported,
    t.exported.start
  ), this.finishNode(t, "ExportSpecifier");
};
p.parseExportSpecifiers = function(e) {
  var t = [], i = !0;
  for (this.expect(a.braceL); !this.eat(a.braceR); ) {
    if (i)
      i = !1;
    else if (this.expect(a.comma), this.afterTrailingComma(a.braceR))
      break;
    t.push(this.parseExportSpecifier(e));
  }
  return t;
};
p.parseImport = function(e) {
  return this.next(), this.type === a.string ? (e.specifiers = Yt, e.source = this.parseExprAtom()) : (e.specifiers = this.parseImportSpecifiers(), this.expectContextual("from"), e.source = this.type === a.string ? this.parseExprAtom() : this.unexpected()), this.options.ecmaVersion >= 16 && (e.attributes = this.parseWithClause()), this.semicolon(), this.finishNode(e, "ImportDeclaration");
};
p.parseImportSpecifier = function() {
  var e = this.startNode();
  return e.imported = this.parseModuleExportName(), this.eatContextual("as") ? e.local = this.parseIdent() : (this.checkUnreserved(e.imported), e.local = e.imported), this.checkLValSimple(e.local, G), this.finishNode(e, "ImportSpecifier");
};
p.parseImportDefaultSpecifier = function() {
  var e = this.startNode();
  return e.local = this.parseIdent(), this.checkLValSimple(e.local, G), this.finishNode(e, "ImportDefaultSpecifier");
};
p.parseImportNamespaceSpecifier = function() {
  var e = this.startNode();
  return this.next(), this.expectContextual("as"), e.local = this.parseIdent(), this.checkLValSimple(e.local, G), this.finishNode(e, "ImportNamespaceSpecifier");
};
p.parseImportSpecifiers = function() {
  var e = [], t = !0;
  if (this.type === a.name && (e.push(this.parseImportDefaultSpecifier()), !this.eat(a.comma)))
    return e;
  if (this.type === a.star)
    return e.push(this.parseImportNamespaceSpecifier()), e;
  for (this.expect(a.braceL); !this.eat(a.braceR); ) {
    if (t)
      t = !1;
    else if (this.expect(a.comma), this.afterTrailingComma(a.braceR))
      break;
    e.push(this.parseImportSpecifier());
  }
  return e;
};
p.parseWithClause = function() {
  var e = [];
  if (!this.eat(a._with))
    return e;
  this.expect(a.braceL);
  for (var t = {}, i = !0; !this.eat(a.braceR); ) {
    if (i)
      i = !1;
    else if (this.expect(a.comma), this.afterTrailingComma(a.braceR))
      break;
    var s = this.parseImportAttribute(), r = s.key.type === "Identifier" ? s.key.name : s.key.value;
    $(t, r) && this.raiseRecoverable(s.key.start, "Duplicate attribute key '" + r + "'"), t[r] = !0, e.push(s);
  }
  return e;
};
p.parseImportAttribute = function() {
  var e = this.startNode();
  return e.key = this.type === a.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never"), this.expect(a.colon), this.type !== a.string && this.unexpected(), e.value = this.parseExprAtom(), this.finishNode(e, "ImportAttribute");
};
p.parseModuleExportName = function() {
  if (this.options.ecmaVersion >= 13 && this.type === a.string) {
    var e = this.parseLiteral(this.value);
    return Gt.test(e.value) && this.raise(e.start, "An export name cannot include a lone surrogate."), e;
  }
  return this.parseIdent(!0);
};
p.adaptDirectivePrologue = function(e) {
  for (var t = 0; t < e.length && this.isDirectiveCandidate(e[t]); ++t)
    e[t].directive = e[t].expression.raw.slice(1, -1);
};
p.isDirectiveCandidate = function(e) {
  return this.options.ecmaVersion >= 5 && e.type === "ExpressionStatement" && e.expression.type === "Literal" && typeof e.expression.value == "string" && // Reject parenthesized strings.
  (this.input[e.start] === '"' || this.input[e.start] === "'");
};
var B = C.prototype;
B.toAssignable = function(e, t, i) {
  if (this.options.ecmaVersion >= 6 && e)
    switch (e.type) {
      case "Identifier":
        this.inAsync && e.name === "await" && this.raise(e.start, "Cannot use 'await' as identifier inside an async function");
        break;
      case "ObjectPattern":
      case "ArrayPattern":
      case "AssignmentPattern":
      case "RestElement":
        break;
      case "ObjectExpression":
        e.type = "ObjectPattern", i && this.checkPatternErrors(i, !0);
        for (var s = 0, r = e.properties; s < r.length; s += 1) {
          var n = r[s];
          this.toAssignable(n, t), n.type === "RestElement" && (n.argument.type === "ArrayPattern" || n.argument.type === "ObjectPattern") && this.raise(n.argument.start, "Unexpected token");
        }
        break;
      case "Property":
        e.kind !== "init" && this.raise(e.key.start, "Object pattern can't contain getter or setter"), this.toAssignable(e.value, t);
        break;
      case "ArrayExpression":
        e.type = "ArrayPattern", i && this.checkPatternErrors(i, !0), this.toAssignableList(e.elements, t);
        break;
      case "SpreadElement":
        e.type = "RestElement", this.toAssignable(e.argument, t), e.argument.type === "AssignmentPattern" && this.raise(e.argument.start, "Rest elements cannot have a default value");
        break;
      case "AssignmentExpression":
        e.operator !== "=" && this.raise(e.left.end, "Only '=' operator can be used for specifying default value."), e.type = "AssignmentPattern", delete e.operator, this.toAssignable(e.left, t);
        break;
      case "ParenthesizedExpression":
        this.toAssignable(e.expression, t, i);
        break;
      case "ChainExpression":
        this.raiseRecoverable(e.start, "Optional chaining cannot appear in left-hand side");
        break;
      case "MemberExpression":
        if (!t)
          break;
      default:
        this.raise(e.start, "Assigning to rvalue");
    }
  else i && this.checkPatternErrors(i, !0);
  return e;
};
B.toAssignableList = function(e, t) {
  for (var i = e.length, s = 0; s < i; s++) {
    var r = e[s];
    r && this.toAssignable(r, t);
  }
  if (i) {
    var n = e[i - 1];
    this.options.ecmaVersion === 6 && t && n && n.type === "RestElement" && n.argument.type !== "Identifier" && this.unexpected(n.argument.start);
  }
  return e;
};
B.parseSpread = function(e) {
  var t = this.startNode();
  return this.next(), t.argument = this.parseMaybeAssign(!1, e), this.finishNode(t, "SpreadElement");
};
B.parseRestBinding = function() {
  var e = this.startNode();
  return this.next(), this.options.ecmaVersion === 6 && this.type !== a.name && this.unexpected(), e.argument = this.parseBindingAtom(), this.finishNode(e, "RestElement");
};
B.parseBindingAtom = function() {
  if (this.options.ecmaVersion >= 6)
    switch (this.type) {
      case a.bracketL:
        var e = this.startNode();
        return this.next(), e.elements = this.parseBindingList(a.bracketR, !0, !0), this.finishNode(e, "ArrayPattern");
      case a.braceL:
        return this.parseObj(!0);
    }
  return this.parseIdent();
};
B.parseBindingList = function(e, t, i, s) {
  for (var r = [], n = !0; !this.eat(e); )
    if (n ? n = !1 : this.expect(a.comma), t && this.type === a.comma)
      r.push(null);
    else {
      if (i && this.afterTrailingComma(e))
        break;
      if (this.type === a.ellipsis) {
        var o = this.parseRestBinding();
        this.parseBindingListItem(o), r.push(o), this.type === a.comma && this.raiseRecoverable(this.start, "Comma is not permitted after the rest element"), this.expect(e);
        break;
      } else
        r.push(this.parseAssignableListItem(s));
    }
  return r;
};
B.parseAssignableListItem = function(e) {
  var t = this.parseMaybeDefault(this.start, this.startLoc);
  return this.parseBindingListItem(t), t;
};
B.parseBindingListItem = function(e) {
  return e;
};
B.parseMaybeDefault = function(e, t, i) {
  if (i = i || this.parseBindingAtom(), this.options.ecmaVersion < 6 || !this.eat(a.eq))
    return i;
  var s = this.startNodeAt(e, t);
  return s.left = i, s.right = this.parseMaybeAssign(), this.finishNode(s, "AssignmentPattern");
};
B.checkLValSimple = function(e, t, i) {
  t === void 0 && (t = ae);
  var s = t !== ae;
  switch (e.type) {
    case "Identifier":
      this.strict && this.reservedWordsStrictBind.test(e.name) && this.raiseRecoverable(e.start, (s ? "Binding " : "Assigning to ") + e.name + " in strict mode"), s && (t === G && e.name === "let" && this.raiseRecoverable(e.start, "let is disallowed as a lexically bound name"), i && ($(i, e.name) && this.raiseRecoverable(e.start, "Argument name clash"), i[e.name] = !0), t !== tt && this.declareName(e.name, t, e.start));
      break;
    case "ChainExpression":
      this.raiseRecoverable(e.start, "Optional chaining cannot appear in left-hand side");
      break;
    case "MemberExpression":
      s && this.raiseRecoverable(e.start, "Binding member expression");
      break;
    case "ParenthesizedExpression":
      return s && this.raiseRecoverable(e.start, "Binding parenthesized expression"), this.checkLValSimple(e.expression, t, i);
    default:
      this.raise(e.start, (s ? "Binding" : "Assigning to") + " rvalue");
  }
};
B.checkLValPattern = function(e, t, i) {
  switch (t === void 0 && (t = ae), e.type) {
    case "ObjectPattern":
      for (var s = 0, r = e.properties; s < r.length; s += 1) {
        var n = r[s];
        this.checkLValInnerPattern(n, t, i);
      }
      break;
    case "ArrayPattern":
      for (var o = 0, u = e.elements; o < u.length; o += 1) {
        var h = u[o];
        h && this.checkLValInnerPattern(h, t, i);
      }
      break;
    default:
      this.checkLValSimple(e, t, i);
  }
};
B.checkLValInnerPattern = function(e, t, i) {
  switch (t === void 0 && (t = ae), e.type) {
    case "Property":
      this.checkLValInnerPattern(e.value, t, i);
      break;
    case "AssignmentPattern":
      this.checkLValPattern(e.left, t, i);
      break;
    case "RestElement":
      this.checkLValPattern(e.argument, t, i);
      break;
    default:
      this.checkLValPattern(e, t, i);
  }
};
var F = function(t, i, s, r, n) {
  this.token = t, this.isExpr = !!i, this.preserveSpace = !!s, this.override = r, this.generator = !!n;
}, y = {
  b_stat: new F("{", !1),
  b_expr: new F("{", !0),
  b_tmpl: new F("${", !1),
  p_stat: new F("(", !1),
  p_expr: new F("(", !0),
  q_tmpl: new F("`", !0, !0, function(e) {
    return e.tryReadTemplateToken();
  }),
  f_stat: new F("function", !1),
  f_expr: new F("function", !0),
  f_expr_gen: new F("function", !0, !1, null, !0),
  f_gen: new F("function", !1, !1, null, !0)
}, ee = C.prototype;
ee.initialContext = function() {
  return [y.b_stat];
};
ee.curContext = function() {
  return this.context[this.context.length - 1];
};
ee.braceIsBlock = function(e) {
  var t = this.curContext();
  return t === y.f_expr || t === y.f_stat ? !0 : e === a.colon && (t === y.b_stat || t === y.b_expr) ? !t.isExpr : e === a._return || e === a.name && this.exprAllowed ? N.test(this.input.slice(this.lastTokEnd, this.start)) : e === a._else || e === a.semi || e === a.eof || e === a.parenR || e === a.arrow ? !0 : e === a.braceL ? t === y.b_stat : e === a._var || e === a._const || e === a.name ? !1 : !this.exprAllowed;
};
ee.inGeneratorContext = function() {
  for (var e = this.context.length - 1; e >= 1; e--) {
    var t = this.context[e];
    if (t.token === "function")
      return t.generator;
  }
  return !1;
};
ee.updateContext = function(e) {
  var t, i = this.type;
  i.keyword && e === a.dot ? this.exprAllowed = !1 : (t = i.updateContext) ? t.call(this, e) : this.exprAllowed = i.beforeExpr;
};
ee.overrideContext = function(e) {
  this.curContext() !== e && (this.context[this.context.length - 1] = e);
};
a.parenR.updateContext = a.braceR.updateContext = function() {
  if (this.context.length === 1) {
    this.exprAllowed = !0;
    return;
  }
  var e = this.context.pop();
  e === y.b_stat && this.curContext().token === "function" && (e = this.context.pop()), this.exprAllowed = !e.isExpr;
};
a.braceL.updateContext = function(e) {
  this.context.push(this.braceIsBlock(e) ? y.b_stat : y.b_expr), this.exprAllowed = !0;
};
a.dollarBraceL.updateContext = function() {
  this.context.push(y.b_tmpl), this.exprAllowed = !0;
};
a.parenL.updateContext = function(e) {
  var t = e === a._if || e === a._for || e === a._with || e === a._while;
  this.context.push(t ? y.p_stat : y.p_expr), this.exprAllowed = !0;
};
a.incDec.updateContext = function() {
};
a._function.updateContext = a._class.updateContext = function(e) {
  e.beforeExpr && e !== a._else && !(e === a.semi && this.curContext() !== y.p_stat) && !(e === a._return && N.test(this.input.slice(this.lastTokEnd, this.start))) && !((e === a.colon || e === a.braceL) && this.curContext() === y.b_stat) ? this.context.push(y.f_expr) : this.context.push(y.f_stat), this.exprAllowed = !1;
};
a.colon.updateContext = function() {
  this.curContext().token === "function" && this.context.pop(), this.exprAllowed = !0;
};
a.backQuote.updateContext = function() {
  this.curContext() === y.q_tmpl ? this.context.pop() : this.context.push(y.q_tmpl), this.exprAllowed = !1;
};
a.star.updateContext = function(e) {
  if (e === a._function) {
    var t = this.context.length - 1;
    this.context[t] === y.f_expr ? this.context[t] = y.f_expr_gen : this.context[t] = y.f_gen;
  }
  this.exprAllowed = !0;
};
a.name.updateContext = function(e) {
  var t = !1;
  this.options.ecmaVersion >= 6 && e !== a.dot && (this.value === "of" && !this.exprAllowed || this.value === "yield" && this.inGeneratorContext()) && (t = !0), this.exprAllowed = t;
};
var d = C.prototype;
d.checkPropClash = function(e, t, i) {
  if (!(this.options.ecmaVersion >= 9 && e.type === "SpreadElement") && !(this.options.ecmaVersion >= 6 && (e.computed || e.method || e.shorthand))) {
    var s = e.key, r;
    switch (s.type) {
      case "Identifier":
        r = s.name;
        break;
      case "Literal":
        r = String(s.value);
        break;
      default:
        return;
    }
    var n = e.kind;
    if (this.options.ecmaVersion >= 6) {
      r === "__proto__" && n === "init" && (t.proto && (i ? i.doubleProto < 0 && (i.doubleProto = s.start) : this.raiseRecoverable(s.start, "Redefinition of __proto__ property")), t.proto = !0);
      return;
    }
    r = "$" + r;
    var o = t[r];
    if (o) {
      var u;
      n === "init" ? u = this.strict && o.init || o.get || o.set : u = o.init || o[n], u && this.raiseRecoverable(s.start, "Redefinition of property");
    } else
      o = t[r] = {
        init: !1,
        get: !1,
        set: !1
      };
    o[n] = !0;
  }
};
d.parseExpression = function(e, t) {
  var i = this.start, s = this.startLoc, r = this.parseMaybeAssign(e, t);
  if (this.type === a.comma) {
    var n = this.startNodeAt(i, s);
    for (n.expressions = [r]; this.eat(a.comma); )
      n.expressions.push(this.parseMaybeAssign(e, t));
    return this.finishNode(n, "SequenceExpression");
  }
  return r;
};
d.parseMaybeAssign = function(e, t, i) {
  if (this.isContextual("yield")) {
    if (this.inGenerator)
      return this.parseYield(e);
    this.exprAllowed = !1;
  }
  var s = !1, r = -1, n = -1, o = -1;
  t ? (r = t.parenthesizedAssign, n = t.trailingComma, o = t.doubleProto, t.parenthesizedAssign = t.trailingComma = -1) : (t = new fe(), s = !0);
  var u = this.start, h = this.startLoc;
  (this.type === a.parenL || this.type === a.name) && (this.potentialArrowAt = this.start, this.potentialArrowInForAwait = e === "await");
  var c = this.parseMaybeConditional(e, t);
  if (i && (c = i.call(this, c, u, h)), this.type.isAssign) {
    var f = this.startNodeAt(u, h);
    return f.operator = this.value, this.type === a.eq && (c = this.toAssignable(c, !1, t)), s || (t.parenthesizedAssign = t.trailingComma = t.doubleProto = -1), t.shorthandAssign >= c.start && (t.shorthandAssign = -1), this.type === a.eq ? this.checkLValPattern(c) : this.checkLValSimple(c), f.left = c, this.next(), f.right = this.parseMaybeAssign(e), o > -1 && (t.doubleProto = o), this.finishNode(f, "AssignmentExpression");
  } else
    s && this.checkExpressionErrors(t, !0);
  return r > -1 && (t.parenthesizedAssign = r), n > -1 && (t.trailingComma = n), c;
};
d.parseMaybeConditional = function(e, t) {
  var i = this.start, s = this.startLoc, r = this.parseExprOps(e, t);
  if (this.checkExpressionErrors(t))
    return r;
  if (this.eat(a.question)) {
    var n = this.startNodeAt(i, s);
    return n.test = r, n.consequent = this.parseMaybeAssign(), this.expect(a.colon), n.alternate = this.parseMaybeAssign(e), this.finishNode(n, "ConditionalExpression");
  }
  return r;
};
d.parseExprOps = function(e, t) {
  var i = this.start, s = this.startLoc, r = this.parseMaybeUnary(t, !1, !1, e);
  return this.checkExpressionErrors(t) || r.start === i && r.type === "ArrowFunctionExpression" ? r : this.parseExprOp(r, i, s, -1, e);
};
d.parseExprOp = function(e, t, i, s, r) {
  var n = this.type.binop;
  if (n != null && (!r || this.type !== a._in) && n > s) {
    var o = this.type === a.logicalOR || this.type === a.logicalAND, u = this.type === a.coalesce;
    u && (n = a.logicalAND.binop);
    var h = this.value;
    this.next();
    var c = this.start, f = this.startLoc, x = this.parseExprOp(this.parseMaybeUnary(null, !1, !1, r), c, f, n, r), b = this.buildBinary(t, i, e, x, h, o || u);
    return (o && this.type === a.coalesce || u && (this.type === a.logicalOR || this.type === a.logicalAND)) && this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses"), this.parseExprOp(b, t, i, s, r);
  }
  return e;
};
d.buildBinary = function(e, t, i, s, r, n) {
  s.type === "PrivateIdentifier" && this.raise(s.start, "Private identifier can only be left side of binary expression");
  var o = this.startNodeAt(e, t);
  return o.left = i, o.operator = r, o.right = s, this.finishNode(o, n ? "LogicalExpression" : "BinaryExpression");
};
d.parseMaybeUnary = function(e, t, i, s) {
  var r = this.start, n = this.startLoc, o;
  if (this.isContextual("await") && this.canAwait)
    o = this.parseAwait(s), t = !0;
  else if (this.type.prefix) {
    var u = this.startNode(), h = this.type === a.incDec;
    u.operator = this.value, u.prefix = !0, this.next(), u.argument = this.parseMaybeUnary(null, !0, h, s), this.checkExpressionErrors(e, !0), h ? this.checkLValSimple(u.argument) : this.strict && u.operator === "delete" && st(u.argument) ? this.raiseRecoverable(u.start, "Deleting local variable in strict mode") : u.operator === "delete" && we(u.argument) ? this.raiseRecoverable(u.start, "Private fields can not be deleted") : t = !0, o = this.finishNode(u, h ? "UpdateExpression" : "UnaryExpression");
  } else if (!t && this.type === a.privateId)
    (s || this.privateNameStack.length === 0) && this.options.checkPrivateFields && this.unexpected(), o = this.parsePrivateIdent(), this.type !== a._in && this.unexpected();
  else {
    if (o = this.parseExprSubscripts(e, s), this.checkExpressionErrors(e))
      return o;
    for (; this.type.postfix && !this.canInsertSemicolon(); ) {
      var c = this.startNodeAt(r, n);
      c.operator = this.value, c.prefix = !1, c.argument = o, this.checkLValSimple(o), this.next(), o = this.finishNode(c, "UpdateExpression");
    }
  }
  if (!i && this.eat(a.starstar))
    if (t)
      this.unexpected(this.lastTokStart);
    else
      return this.buildBinary(r, n, o, this.parseMaybeUnary(null, !1, !1, s), "**", !1);
  else
    return o;
};
function st(e) {
  return e.type === "Identifier" || e.type === "ParenthesizedExpression" && st(e.expression);
}
function we(e) {
  return e.type === "MemberExpression" && e.property.type === "PrivateIdentifier" || e.type === "ChainExpression" && we(e.expression) || e.type === "ParenthesizedExpression" && we(e.expression);
}
d.parseExprSubscripts = function(e, t) {
  var i = this.start, s = this.startLoc, r = this.parseExprAtom(e, t);
  if (r.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")")
    return r;
  var n = this.parseSubscripts(r, i, s, !1, t);
  return e && n.type === "MemberExpression" && (e.parenthesizedAssign >= n.start && (e.parenthesizedAssign = -1), e.parenthesizedBind >= n.start && (e.parenthesizedBind = -1), e.trailingComma >= n.start && (e.trailingComma = -1)), n;
};
d.parseSubscripts = function(e, t, i, s, r) {
  for (var n = this.options.ecmaVersion >= 8 && e.type === "Identifier" && e.name === "async" && this.lastTokEnd === e.end && !this.canInsertSemicolon() && e.end - e.start === 5 && this.potentialArrowAt === e.start, o = !1; ; ) {
    var u = this.parseSubscript(e, t, i, s, n, o, r);
    if (u.optional && (o = !0), u === e || u.type === "ArrowFunctionExpression") {
      if (o) {
        var h = this.startNodeAt(t, i);
        h.expression = u, u = this.finishNode(h, "ChainExpression");
      }
      return u;
    }
    e = u;
  }
};
d.shouldParseAsyncArrow = function() {
  return !this.canInsertSemicolon() && this.eat(a.arrow);
};
d.parseSubscriptAsyncArrow = function(e, t, i, s) {
  return this.parseArrowExpression(this.startNodeAt(e, t), i, !0, s);
};
d.parseSubscript = function(e, t, i, s, r, n, o) {
  var u = this.options.ecmaVersion >= 11, h = u && this.eat(a.questionDot);
  s && h && this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
  var c = this.eat(a.bracketL);
  if (c || h && this.type !== a.parenL && this.type !== a.backQuote || this.eat(a.dot)) {
    var f = this.startNodeAt(t, i);
    f.object = e, c ? (f.property = this.parseExpression(), this.expect(a.bracketR)) : this.type === a.privateId && e.type !== "Super" ? f.property = this.parsePrivateIdent() : f.property = this.parseIdent(this.options.allowReserved !== "never"), f.computed = !!c, u && (f.optional = h), e = this.finishNode(f, "MemberExpression");
  } else if (!s && this.eat(a.parenL)) {
    var x = new fe(), b = this.yieldPos, _ = this.awaitPos, w = this.awaitIdentPos;
    this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0;
    var D = this.parseExprList(a.parenR, this.options.ecmaVersion >= 8, !1, x);
    if (r && !h && this.shouldParseAsyncArrow())
      return this.checkPatternErrors(x, !1), this.checkYieldAwaitInDefaultParams(), this.awaitIdentPos > 0 && this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function"), this.yieldPos = b, this.awaitPos = _, this.awaitIdentPos = w, this.parseSubscriptAsyncArrow(t, i, D, o);
    this.checkExpressionErrors(x, !0), this.yieldPos = b || this.yieldPos, this.awaitPos = _ || this.awaitPos, this.awaitIdentPos = w || this.awaitIdentPos;
    var k = this.startNodeAt(t, i);
    k.callee = e, k.arguments = D, u && (k.optional = h), e = this.finishNode(k, "CallExpression");
  } else if (this.type === a.backQuote) {
    (h || n) && this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
    var V = this.startNodeAt(t, i);
    V.tag = e, V.quasi = this.parseTemplate({ isTagged: !0 }), e = this.finishNode(V, "TaggedTemplateExpression");
  }
  return e;
};
d.parseExprAtom = function(e, t, i) {
  this.type === a.slash && this.readRegexp();
  var s, r = this.potentialArrowAt === this.start;
  switch (this.type) {
    case a._super:
      return this.allowSuper || this.raise(this.start, "'super' keyword outside a method"), s = this.startNode(), this.next(), this.type === a.parenL && !this.allowDirectSuper && this.raise(s.start, "super() call outside constructor of a subclass"), this.type !== a.dot && this.type !== a.bracketL && this.type !== a.parenL && this.unexpected(), this.finishNode(s, "Super");
    case a._this:
      return s = this.startNode(), this.next(), this.finishNode(s, "ThisExpression");
    case a.name:
      var n = this.start, o = this.startLoc, u = this.containsEsc, h = this.parseIdent(!1);
      if (this.options.ecmaVersion >= 8 && !u && h.name === "async" && !this.canInsertSemicolon() && this.eat(a._function))
        return this.overrideContext(y.f_expr), this.parseFunction(this.startNodeAt(n, o), 0, !1, !0, t);
      if (r && !this.canInsertSemicolon()) {
        if (this.eat(a.arrow))
          return this.parseArrowExpression(this.startNodeAt(n, o), [h], !1, t);
        if (this.options.ecmaVersion >= 8 && h.name === "async" && this.type === a.name && !u && (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc))
          return h = this.parseIdent(!1), (this.canInsertSemicolon() || !this.eat(a.arrow)) && this.unexpected(), this.parseArrowExpression(this.startNodeAt(n, o), [h], !0, t);
      }
      return h;
    case a.regexp:
      var c = this.value;
      return s = this.parseLiteral(c.value), s.regex = { pattern: c.pattern, flags: c.flags }, s;
    case a.num:
    case a.string:
      return this.parseLiteral(this.value);
    case a._null:
    case a._true:
    case a._false:
      return s = this.startNode(), s.value = this.type === a._null ? null : this.type === a._true, s.raw = this.type.keyword, this.next(), this.finishNode(s, "Literal");
    case a.parenL:
      var f = this.start, x = this.parseParenAndDistinguishExpression(r, t);
      return e && (e.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(x) && (e.parenthesizedAssign = f), e.parenthesizedBind < 0 && (e.parenthesizedBind = f)), x;
    case a.bracketL:
      return s = this.startNode(), this.next(), s.elements = this.parseExprList(a.bracketR, !0, !0, e), this.finishNode(s, "ArrayExpression");
    case a.braceL:
      return this.overrideContext(y.b_expr), this.parseObj(!1, e);
    case a._function:
      return s = this.startNode(), this.next(), this.parseFunction(s, 0);
    case a._class:
      return this.parseClass(this.startNode(), !1);
    case a._new:
      return this.parseNew();
    case a.backQuote:
      return this.parseTemplate();
    case a._import:
      return this.options.ecmaVersion >= 11 ? this.parseExprImport(i) : this.unexpected();
    default:
      return this.parseExprAtomDefault();
  }
};
d.parseExprAtomDefault = function() {
  this.unexpected();
};
d.parseExprImport = function(e) {
  var t = this.startNode();
  if (this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword import"), this.next(), this.type === a.parenL && !e)
    return this.parseDynamicImport(t);
  if (this.type === a.dot) {
    var i = this.startNodeAt(t.start, t.loc && t.loc.start);
    return i.name = "import", t.meta = this.finishNode(i, "Identifier"), this.parseImportMeta(t);
  } else
    this.unexpected();
};
d.parseDynamicImport = function(e) {
  if (this.next(), e.source = this.parseMaybeAssign(), this.options.ecmaVersion >= 16)
    this.eat(a.parenR) ? e.options = null : (this.expect(a.comma), this.afterTrailingComma(a.parenR) ? e.options = null : (e.options = this.parseMaybeAssign(), this.eat(a.parenR) || (this.expect(a.comma), this.afterTrailingComma(a.parenR) || this.unexpected())));
  else if (!this.eat(a.parenR)) {
    var t = this.start;
    this.eat(a.comma) && this.eat(a.parenR) ? this.raiseRecoverable(t, "Trailing comma is not allowed in import()") : this.unexpected(t);
  }
  return this.finishNode(e, "ImportExpression");
};
d.parseImportMeta = function(e) {
  this.next();
  var t = this.containsEsc;
  return e.property = this.parseIdent(!0), e.property.name !== "meta" && this.raiseRecoverable(e.property.start, "The only valid meta property for import is 'import.meta'"), t && this.raiseRecoverable(e.start, "'import.meta' must not contain escaped characters"), this.options.sourceType !== "module" && !this.options.allowImportExportEverywhere && this.raiseRecoverable(e.start, "Cannot use 'import.meta' outside a module"), this.finishNode(e, "MetaProperty");
};
d.parseLiteral = function(e) {
  var t = this.startNode();
  return t.value = e, t.raw = this.input.slice(this.start, this.end), t.raw.charCodeAt(t.raw.length - 1) === 110 && (t.bigint = t.value != null ? t.value.toString() : t.raw.slice(0, -1).replace(/_/g, "")), this.next(), this.finishNode(t, "Literal");
};
d.parseParenExpression = function() {
  this.expect(a.parenL);
  var e = this.parseExpression();
  return this.expect(a.parenR), e;
};
d.shouldParseArrow = function(e) {
  return !this.canInsertSemicolon();
};
d.parseParenAndDistinguishExpression = function(e, t) {
  var i = this.start, s = this.startLoc, r, n = this.options.ecmaVersion >= 8;
  if (this.options.ecmaVersion >= 6) {
    this.next();
    var o = this.start, u = this.startLoc, h = [], c = !0, f = !1, x = new fe(), b = this.yieldPos, _ = this.awaitPos, w;
    for (this.yieldPos = 0, this.awaitPos = 0; this.type !== a.parenR; )
      if (c ? c = !1 : this.expect(a.comma), n && this.afterTrailingComma(a.parenR, !0)) {
        f = !0;
        break;
      } else if (this.type === a.ellipsis) {
        w = this.start, h.push(this.parseParenItem(this.parseRestBinding())), this.type === a.comma && this.raiseRecoverable(
          this.start,
          "Comma is not permitted after the rest element"
        );
        break;
      } else
        h.push(this.parseMaybeAssign(!1, x, this.parseParenItem));
    var D = this.lastTokEnd, k = this.lastTokEndLoc;
    if (this.expect(a.parenR), e && this.shouldParseArrow(h) && this.eat(a.arrow))
      return this.checkPatternErrors(x, !1), this.checkYieldAwaitInDefaultParams(), this.yieldPos = b, this.awaitPos = _, this.parseParenArrowList(i, s, h, t);
    (!h.length || f) && this.unexpected(this.lastTokStart), w && this.unexpected(w), this.checkExpressionErrors(x, !0), this.yieldPos = b || this.yieldPos, this.awaitPos = _ || this.awaitPos, h.length > 1 ? (r = this.startNodeAt(o, u), r.expressions = h, this.finishNodeAt(r, "SequenceExpression", D, k)) : r = h[0];
  } else
    r = this.parseParenExpression();
  if (this.options.preserveParens) {
    var V = this.startNodeAt(i, s);
    return V.expression = r, this.finishNode(V, "ParenthesizedExpression");
  } else
    return r;
};
d.parseParenItem = function(e) {
  return e;
};
d.parseParenArrowList = function(e, t, i, s) {
  return this.parseArrowExpression(this.startNodeAt(e, t), i, !1, s);
};
var Xt = [];
d.parseNew = function() {
  this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword new");
  var e = this.startNode();
  if (this.next(), this.options.ecmaVersion >= 6 && this.type === a.dot) {
    var t = this.startNodeAt(e.start, e.loc && e.loc.start);
    t.name = "new", e.meta = this.finishNode(t, "Identifier"), this.next();
    var i = this.containsEsc;
    return e.property = this.parseIdent(!0), e.property.name !== "target" && this.raiseRecoverable(e.property.start, "The only valid meta property for new is 'new.target'"), i && this.raiseRecoverable(e.start, "'new.target' must not contain escaped characters"), this.allowNewDotTarget || this.raiseRecoverable(e.start, "'new.target' can only be used in functions and class static block"), this.finishNode(e, "MetaProperty");
  }
  var s = this.start, r = this.startLoc;
  return e.callee = this.parseSubscripts(this.parseExprAtom(null, !1, !0), s, r, !0, !1), this.eat(a.parenL) ? e.arguments = this.parseExprList(a.parenR, this.options.ecmaVersion >= 8, !1) : e.arguments = Xt, this.finishNode(e, "NewExpression");
};
d.parseTemplateElement = function(e) {
  var t = e.isTagged, i = this.startNode();
  return this.type === a.invalidTemplate ? (t || this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal"), i.value = {
    raw: this.value.replace(/\r\n?/g, `
`),
    cooked: null
  }) : i.value = {
    raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, `
`),
    cooked: this.value
  }, this.next(), i.tail = this.type === a.backQuote, this.finishNode(i, "TemplateElement");
};
d.parseTemplate = function(e) {
  e === void 0 && (e = {});
  var t = e.isTagged;
  t === void 0 && (t = !1);
  var i = this.startNode();
  this.next(), i.expressions = [];
  var s = this.parseTemplateElement({ isTagged: t });
  for (i.quasis = [s]; !s.tail; )
    this.type === a.eof && this.raise(this.pos, "Unterminated template literal"), this.expect(a.dollarBraceL), i.expressions.push(this.parseExpression()), this.expect(a.braceR), i.quasis.push(s = this.parseTemplateElement({ isTagged: t }));
  return this.next(), this.finishNode(i, "TemplateLiteral");
};
d.isAsyncProp = function(e) {
  return !e.computed && e.key.type === "Identifier" && e.key.name === "async" && (this.type === a.name || this.type === a.num || this.type === a.string || this.type === a.bracketL || this.type.keyword || this.options.ecmaVersion >= 9 && this.type === a.star) && !N.test(this.input.slice(this.lastTokEnd, this.start));
};
d.parseObj = function(e, t) {
  var i = this.startNode(), s = !0, r = {};
  for (i.properties = [], this.next(); !this.eat(a.braceR); ) {
    if (s)
      s = !1;
    else if (this.expect(a.comma), this.options.ecmaVersion >= 5 && this.afterTrailingComma(a.braceR))
      break;
    var n = this.parseProperty(e, t);
    e || this.checkPropClash(n, r, t), i.properties.push(n);
  }
  return this.finishNode(i, e ? "ObjectPattern" : "ObjectExpression");
};
d.parseProperty = function(e, t) {
  var i = this.startNode(), s, r, n, o;
  if (this.options.ecmaVersion >= 9 && this.eat(a.ellipsis))
    return e ? (i.argument = this.parseIdent(!1), this.type === a.comma && this.raiseRecoverable(this.start, "Comma is not permitted after the rest element"), this.finishNode(i, "RestElement")) : (i.argument = this.parseMaybeAssign(!1, t), this.type === a.comma && t && t.trailingComma < 0 && (t.trailingComma = this.start), this.finishNode(i, "SpreadElement"));
  this.options.ecmaVersion >= 6 && (i.method = !1, i.shorthand = !1, (e || t) && (n = this.start, o = this.startLoc), e || (s = this.eat(a.star)));
  var u = this.containsEsc;
  return this.parsePropertyName(i), !e && !u && this.options.ecmaVersion >= 8 && !s && this.isAsyncProp(i) ? (r = !0, s = this.options.ecmaVersion >= 9 && this.eat(a.star), this.parsePropertyName(i)) : r = !1, this.parsePropertyValue(i, e, s, r, n, o, t, u), this.finishNode(i, "Property");
};
d.parseGetterSetter = function(e) {
  var t = e.key.name;
  this.parsePropertyName(e), e.value = this.parseMethod(!1), e.kind = t;
  var i = e.kind === "get" ? 0 : 1;
  if (e.value.params.length !== i) {
    var s = e.value.start;
    e.kind === "get" ? this.raiseRecoverable(s, "getter should have no params") : this.raiseRecoverable(s, "setter should have exactly one param");
  } else
    e.kind === "set" && e.value.params[0].type === "RestElement" && this.raiseRecoverable(e.value.params[0].start, "Setter cannot use rest params");
};
d.parsePropertyValue = function(e, t, i, s, r, n, o, u) {
  (i || s) && this.type === a.colon && this.unexpected(), this.eat(a.colon) ? (e.value = t ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(!1, o), e.kind = "init") : this.options.ecmaVersion >= 6 && this.type === a.parenL ? (t && this.unexpected(), e.method = !0, e.value = this.parseMethod(i, s), e.kind = "init") : !t && !u && this.options.ecmaVersion >= 5 && !e.computed && e.key.type === "Identifier" && (e.key.name === "get" || e.key.name === "set") && this.type !== a.comma && this.type !== a.braceR && this.type !== a.eq ? ((i || s) && this.unexpected(), this.parseGetterSetter(e)) : this.options.ecmaVersion >= 6 && !e.computed && e.key.type === "Identifier" ? ((i || s) && this.unexpected(), this.checkUnreserved(e.key), e.key.name === "await" && !this.awaitIdentPos && (this.awaitIdentPos = r), t ? e.value = this.parseMaybeDefault(r, n, this.copyNode(e.key)) : this.type === a.eq && o ? (o.shorthandAssign < 0 && (o.shorthandAssign = this.start), e.value = this.parseMaybeDefault(r, n, this.copyNode(e.key))) : e.value = this.copyNode(e.key), e.kind = "init", e.shorthand = !0) : this.unexpected();
};
d.parsePropertyName = function(e) {
  if (this.options.ecmaVersion >= 6) {
    if (this.eat(a.bracketL))
      return e.computed = !0, e.key = this.parseMaybeAssign(), this.expect(a.bracketR), e.key;
    e.computed = !1;
  }
  return e.key = this.type === a.num || this.type === a.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
};
d.initFunction = function(e) {
  e.id = null, this.options.ecmaVersion >= 6 && (e.generator = e.expression = !1), this.options.ecmaVersion >= 8 && (e.async = !1);
};
d.parseMethod = function(e, t, i) {
  var s = this.startNode(), r = this.yieldPos, n = this.awaitPos, o = this.awaitIdentPos;
  return this.initFunction(s), this.options.ecmaVersion >= 6 && (s.generator = e), this.options.ecmaVersion >= 8 && (s.async = !!t), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(Ie(t, s.generator) | le | (i ? Ze : 0)), this.expect(a.parenL), s.params = this.parseBindingList(a.parenR, !1, this.options.ecmaVersion >= 8), this.checkYieldAwaitInDefaultParams(), this.parseFunctionBody(s, !1, !0, !1), this.yieldPos = r, this.awaitPos = n, this.awaitIdentPos = o, this.finishNode(s, "FunctionExpression");
};
d.parseArrowExpression = function(e, t, i, s) {
  var r = this.yieldPos, n = this.awaitPos, o = this.awaitIdentPos;
  return this.enterScope(Ie(i, !1) | Ae), this.initFunction(e), this.options.ecmaVersion >= 8 && (e.async = !!i), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, e.params = this.toAssignableList(t, !0), this.parseFunctionBody(e, !0, !1, s), this.yieldPos = r, this.awaitPos = n, this.awaitIdentPos = o, this.finishNode(e, "ArrowFunctionExpression");
};
d.parseFunctionBody = function(e, t, i, s) {
  var r = t && this.type !== a.braceL, n = this.strict, o = !1;
  if (r)
    e.body = this.parseMaybeAssign(s), e.expression = !0, this.checkParams(e, !1);
  else {
    var u = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(e.params);
    (!n || u) && (o = this.strictDirective(this.end), o && u && this.raiseRecoverable(e.start, "Illegal 'use strict' directive in function with non-simple parameter list"));
    var h = this.labels;
    this.labels = [], o && (this.strict = !0), this.checkParams(e, !n && !o && !t && !i && this.isSimpleParamList(e.params)), this.strict && e.id && this.checkLValSimple(e.id, tt), e.body = this.parseBlock(!1, void 0, o && !n), e.expression = !1, this.adaptDirectivePrologue(e.body.body), this.labels = h;
  }
  this.exitScope();
};
d.isSimpleParamList = function(e) {
  for (var t = 0, i = e; t < i.length; t += 1) {
    var s = i[t];
    if (s.type !== "Identifier")
      return !1;
  }
  return !0;
};
d.checkParams = function(e, t) {
  for (var i = /* @__PURE__ */ Object.create(null), s = 0, r = e.params; s < r.length; s += 1) {
    var n = r[s];
    this.checkLValInnerPattern(n, Pe, t ? null : i);
  }
};
d.parseExprList = function(e, t, i, s) {
  for (var r = [], n = !0; !this.eat(e); ) {
    if (n)
      n = !1;
    else if (this.expect(a.comma), t && this.afterTrailingComma(e))
      break;
    var o = void 0;
    i && this.type === a.comma ? o = null : this.type === a.ellipsis ? (o = this.parseSpread(s), s && this.type === a.comma && s.trailingComma < 0 && (s.trailingComma = this.start)) : o = this.parseMaybeAssign(!1, s), r.push(o);
  }
  return r;
};
d.checkUnreserved = function(e) {
  var t = e.start, i = e.end, s = e.name;
  if (this.inGenerator && s === "yield" && this.raiseRecoverable(t, "Cannot use 'yield' as identifier inside a generator"), this.inAsync && s === "await" && this.raiseRecoverable(t, "Cannot use 'await' as identifier inside an async function"), !(this.currentThisScope().flags & pe) && s === "arguments" && this.raiseRecoverable(t, "Cannot use 'arguments' in class field initializer"), this.inClassStaticBlock && (s === "arguments" || s === "await") && this.raise(t, "Cannot use " + s + " in class static initialization block"), this.keywords.test(s) && this.raise(t, "Unexpected keyword '" + s + "'"), !(this.options.ecmaVersion < 6 && this.input.slice(t, i).indexOf("\\") !== -1)) {
    var r = this.strict ? this.reservedWordsStrict : this.reservedWords;
    r.test(s) && (!this.inAsync && s === "await" && this.raiseRecoverable(t, "Cannot use keyword 'await' outside an async function"), this.raiseRecoverable(t, "The keyword '" + s + "' is reserved"));
  }
};
d.parseIdent = function(e) {
  var t = this.parseIdentNode();
  return this.next(!!e), this.finishNode(t, "Identifier"), e || (this.checkUnreserved(t), t.name === "await" && !this.awaitIdentPos && (this.awaitIdentPos = t.start)), t;
};
d.parseIdentNode = function() {
  var e = this.startNode();
  return this.type === a.name ? e.name = this.value : this.type.keyword ? (e.name = this.type.keyword, (e.name === "class" || e.name === "function") && (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46) && this.context.pop(), this.type = a.name) : this.unexpected(), e;
};
d.parsePrivateIdent = function() {
  var e = this.startNode();
  return this.type === a.privateId ? e.name = this.value : this.unexpected(), this.next(), this.finishNode(e, "PrivateIdentifier"), this.options.checkPrivateFields && (this.privateNameStack.length === 0 ? this.raise(e.start, "Private field '#" + e.name + "' must be declared in an enclosing class") : this.privateNameStack[this.privateNameStack.length - 1].used.push(e)), e;
};
d.parseYield = function(e) {
  this.yieldPos || (this.yieldPos = this.start);
  var t = this.startNode();
  return this.next(), this.type === a.semi || this.canInsertSemicolon() || this.type !== a.star && !this.type.startsExpr ? (t.delegate = !1, t.argument = null) : (t.delegate = this.eat(a.star), t.argument = this.parseMaybeAssign(e)), this.finishNode(t, "YieldExpression");
};
d.parseAwait = function(e) {
  this.awaitPos || (this.awaitPos = this.start);
  var t = this.startNode();
  return this.next(), t.argument = this.parseMaybeUnary(null, !0, !1, e), this.finishNode(t, "AwaitExpression");
};
var oe = C.prototype;
oe.raise = function(e, t) {
  var i = Ye(this.input, e);
  t += " (" + i.line + ":" + i.column + ")", this.sourceFile && (t += " in " + this.sourceFile);
  var s = new SyntaxError(t);
  throw s.pos = e, s.loc = i, s.raisedAt = this.pos, s;
};
oe.raiseRecoverable = oe.raise;
oe.curPosition = function() {
  if (this.options.locations)
    return new ie(this.curLine, this.pos - this.lineStart);
};
var K = C.prototype, Zt = function(t) {
  this.flags = t, this.var = [], this.lexical = [], this.functions = [];
};
K.enterScope = function(e) {
  this.scopeStack.push(new Zt(e));
};
K.exitScope = function() {
  this.scopeStack.pop();
};
K.treatFunctionsAsVarInScope = function(e) {
  return e.flags & X || !this.inModule && e.flags & Q;
};
K.declareName = function(e, t, i) {
  var s = !1;
  if (t === G) {
    var r = this.currentScope();
    s = r.lexical.indexOf(e) > -1 || r.functions.indexOf(e) > -1 || r.var.indexOf(e) > -1, r.lexical.push(e), this.inModule && r.flags & Q && delete this.undefinedExports[e];
  } else if (t === et) {
    var n = this.currentScope();
    n.lexical.push(e);
  } else if (t === $e) {
    var o = this.currentScope();
    this.treatFunctionsAsVar ? s = o.lexical.indexOf(e) > -1 : s = o.lexical.indexOf(e) > -1 || o.var.indexOf(e) > -1, o.functions.push(e);
  } else
    for (var u = this.scopeStack.length - 1; u >= 0; --u) {
      var h = this.scopeStack[u];
      if (h.lexical.indexOf(e) > -1 && !(h.flags & Xe && h.lexical[0] === e) || !this.treatFunctionsAsVarInScope(h) && h.functions.indexOf(e) > -1) {
        s = !0;
        break;
      }
      if (h.var.push(e), this.inModule && h.flags & Q && delete this.undefinedExports[e], h.flags & pe)
        break;
    }
  s && this.raiseRecoverable(i, "Identifier '" + e + "' has already been declared");
};
K.checkLocalExport = function(e) {
  this.scopeStack[0].lexical.indexOf(e.name) === -1 && this.scopeStack[0].var.indexOf(e.name) === -1 && (this.undefinedExports[e.name] = e);
};
K.currentScope = function() {
  return this.scopeStack[this.scopeStack.length - 1];
};
K.currentVarScope = function() {
  for (var e = this.scopeStack.length - 1; ; e--) {
    var t = this.scopeStack[e];
    if (t.flags & (pe | se | Z))
      return t;
  }
};
K.currentThisScope = function() {
  for (var e = this.scopeStack.length - 1; ; e--) {
    var t = this.scopeStack[e];
    if (t.flags & (pe | se | Z) && !(t.flags & Ae))
      return t;
  }
};
var de = function(t, i, s) {
  this.type = "", this.start = i, this.end = 0, t.options.locations && (this.loc = new ce(t, s)), t.options.directSourceFile && (this.sourceFile = t.options.directSourceFile), t.options.ranges && (this.range = [i, 0]);
}, re = C.prototype;
re.startNode = function() {
  return new de(this, this.start, this.startLoc);
};
re.startNodeAt = function(e, t) {
  return new de(this, e, t);
};
function rt(e, t, i, s) {
  return e.type = t, e.end = i, this.options.locations && (e.loc.end = s), this.options.ranges && (e.range[1] = i), e;
}
re.finishNode = function(e, t) {
  return rt.call(this, e, t, this.lastTokEnd, this.lastTokEndLoc);
};
re.finishNodeAt = function(e, t, i, s) {
  return rt.call(this, e, t, i, s);
};
re.copyNode = function(e) {
  var t = new de(this, e.start, this.startLoc);
  for (var i in e)
    t[i] = e[i];
  return t;
};
var Jt = "Berf Beria_Erfe Gara Garay Gukh Gurung_Khema Hrkt Katakana_Or_Hiragana Kawi Kirat_Rai Krai Nag_Mundari Nagm Ol_Onal Onao Sidetic Sidt Sunu Sunuwar Tai_Yo Tayo Todhri Todr Tolong_Siki Tols Tulu_Tigalari Tutg Unknown Zzzz", at = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS", nt = at + " Extended_Pictographic", ot = nt, ut = ot + " EBase EComp EMod EPres ExtPict", ht = ut, $t = ht, ei = {
  9: at,
  10: nt,
  11: ot,
  12: ut,
  13: ht,
  14: $t
}, ti = "Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji", ii = {
  9: "",
  10: "",
  11: "",
  12: "",
  13: "",
  14: ti
}, De = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu", ct = "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb", lt = ct + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd", pt = lt + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho", ft = pt + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi", dt = ft + " Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith", si = dt + " " + Jt, ri = {
  9: ct,
  10: lt,
  11: pt,
  12: ft,
  13: dt,
  14: si
}, xt = {};
function ai(e) {
  var t = xt[e] = {
    binary: H(ei[e] + " " + De),
    binaryOfStrings: H(ii[e]),
    nonBinary: {
      General_Category: H(De),
      Script: H(ri[e])
    }
  };
  t.nonBinary.Script_Extensions = t.nonBinary.Script, t.nonBinary.gc = t.nonBinary.General_Category, t.nonBinary.sc = t.nonBinary.Script, t.nonBinary.scx = t.nonBinary.Script_Extensions;
}
for (var ve = 0, Fe = [9, 10, 11, 12, 13, 14]; ve < Fe.length; ve += 1) {
  var ni = Fe[ve];
  ai(ni);
}
var l = C.prototype, ue = function(t, i) {
  this.parent = t, this.base = i || this;
};
ue.prototype.separatedFrom = function(t) {
  for (var i = this; i; i = i.parent)
    for (var s = t; s; s = s.parent)
      if (i.base === s.base && i !== s)
        return !0;
  return !1;
};
ue.prototype.sibling = function() {
  return new ue(this.parent, this.base);
};
var U = function(t) {
  this.parser = t, this.validFlags = "gim" + (t.options.ecmaVersion >= 6 ? "uy" : "") + (t.options.ecmaVersion >= 9 ? "s" : "") + (t.options.ecmaVersion >= 13 ? "d" : "") + (t.options.ecmaVersion >= 15 ? "v" : ""), this.unicodeProperties = xt[t.options.ecmaVersion >= 14 ? 14 : t.options.ecmaVersion], this.source = "", this.flags = "", this.start = 0, this.switchU = !1, this.switchV = !1, this.switchN = !1, this.pos = 0, this.lastIntValue = 0, this.lastStringValue = "", this.lastAssertionIsQuantifiable = !1, this.numCapturingParens = 0, this.maxBackReference = 0, this.groupNames = /* @__PURE__ */ Object.create(null), this.backReferenceNames = [], this.branchID = null;
};
U.prototype.reset = function(t, i, s) {
  var r = s.indexOf("v") !== -1, n = s.indexOf("u") !== -1;
  this.start = t | 0, this.source = i + "", this.flags = s, r && this.parser.options.ecmaVersion >= 15 ? (this.switchU = !0, this.switchV = !0, this.switchN = !0) : (this.switchU = n && this.parser.options.ecmaVersion >= 6, this.switchV = !1, this.switchN = n && this.parser.options.ecmaVersion >= 9);
};
U.prototype.raise = function(t) {
  this.parser.raiseRecoverable(this.start, "Invalid regular expression: /" + this.source + "/: " + t);
};
U.prototype.at = function(t, i) {
  i === void 0 && (i = !1);
  var s = this.source, r = s.length;
  if (t >= r)
    return -1;
  var n = s.charCodeAt(t);
  if (!(i || this.switchU) || n <= 55295 || n >= 57344 || t + 1 >= r)
    return n;
  var o = s.charCodeAt(t + 1);
  return o >= 56320 && o <= 57343 ? (n << 10) + o - 56613888 : n;
};
U.prototype.nextIndex = function(t, i) {
  i === void 0 && (i = !1);
  var s = this.source, r = s.length;
  if (t >= r)
    return r;
  var n = s.charCodeAt(t), o;
  return !(i || this.switchU) || n <= 55295 || n >= 57344 || t + 1 >= r || (o = s.charCodeAt(t + 1)) < 56320 || o > 57343 ? t + 1 : t + 2;
};
U.prototype.current = function(t) {
  return t === void 0 && (t = !1), this.at(this.pos, t);
};
U.prototype.lookahead = function(t) {
  return t === void 0 && (t = !1), this.at(this.nextIndex(this.pos, t), t);
};
U.prototype.advance = function(t) {
  t === void 0 && (t = !1), this.pos = this.nextIndex(this.pos, t);
};
U.prototype.eat = function(t, i) {
  return i === void 0 && (i = !1), this.current(i) === t ? (this.advance(i), !0) : !1;
};
U.prototype.eatChars = function(t, i) {
  i === void 0 && (i = !1);
  for (var s = this.pos, r = 0, n = t; r < n.length; r += 1) {
    var o = n[r], u = this.at(s, i);
    if (u === -1 || u !== o)
      return !1;
    s = this.nextIndex(s, i);
  }
  return this.pos = s, !0;
};
l.validateRegExpFlags = function(e) {
  for (var t = e.validFlags, i = e.flags, s = !1, r = !1, n = 0; n < i.length; n++) {
    var o = i.charAt(n);
    t.indexOf(o) === -1 && this.raise(e.start, "Invalid regular expression flag"), i.indexOf(o, n + 1) > -1 && this.raise(e.start, "Duplicate regular expression flag"), o === "u" && (s = !0), o === "v" && (r = !0);
  }
  this.options.ecmaVersion >= 15 && s && r && this.raise(e.start, "Invalid regular expression flag");
};
function oi(e) {
  for (var t in e)
    return !0;
  return !1;
}
l.validateRegExpPattern = function(e) {
  this.regexp_pattern(e), !e.switchN && this.options.ecmaVersion >= 9 && oi(e.groupNames) && (e.switchN = !0, this.regexp_pattern(e));
};
l.regexp_pattern = function(e) {
  e.pos = 0, e.lastIntValue = 0, e.lastStringValue = "", e.lastAssertionIsQuantifiable = !1, e.numCapturingParens = 0, e.maxBackReference = 0, e.groupNames = /* @__PURE__ */ Object.create(null), e.backReferenceNames.length = 0, e.branchID = null, this.regexp_disjunction(e), e.pos !== e.source.length && (e.eat(
    41
    /* ) */
  ) && e.raise("Unmatched ')'"), (e.eat(
    93
    /* ] */
  ) || e.eat(
    125
    /* } */
  )) && e.raise("Lone quantifier brackets")), e.maxBackReference > e.numCapturingParens && e.raise("Invalid escape");
  for (var t = 0, i = e.backReferenceNames; t < i.length; t += 1) {
    var s = i[t];
    e.groupNames[s] || e.raise("Invalid named capture referenced");
  }
};
l.regexp_disjunction = function(e) {
  var t = this.options.ecmaVersion >= 16;
  for (t && (e.branchID = new ue(e.branchID, null)), this.regexp_alternative(e); e.eat(
    124
    /* | */
  ); )
    t && (e.branchID = e.branchID.sibling()), this.regexp_alternative(e);
  t && (e.branchID = e.branchID.parent), this.regexp_eatQuantifier(e, !0) && e.raise("Nothing to repeat"), e.eat(
    123
    /* { */
  ) && e.raise("Lone quantifier brackets");
};
l.regexp_alternative = function(e) {
  for (; e.pos < e.source.length && this.regexp_eatTerm(e); )
    ;
};
l.regexp_eatTerm = function(e) {
  return this.regexp_eatAssertion(e) ? (e.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(e) && e.switchU && e.raise("Invalid quantifier"), !0) : (e.switchU ? this.regexp_eatAtom(e) : this.regexp_eatExtendedAtom(e)) ? (this.regexp_eatQuantifier(e), !0) : !1;
};
l.regexp_eatAssertion = function(e) {
  var t = e.pos;
  if (e.lastAssertionIsQuantifiable = !1, e.eat(
    94
    /* ^ */
  ) || e.eat(
    36
    /* $ */
  ))
    return !0;
  if (e.eat(
    92
    /* \ */
  )) {
    if (e.eat(
      66
      /* B */
    ) || e.eat(
      98
      /* b */
    ))
      return !0;
    e.pos = t;
  }
  if (e.eat(
    40
    /* ( */
  ) && e.eat(
    63
    /* ? */
  )) {
    var i = !1;
    if (this.options.ecmaVersion >= 9 && (i = e.eat(
      60
      /* < */
    )), e.eat(
      61
      /* = */
    ) || e.eat(
      33
      /* ! */
    ))
      return this.regexp_disjunction(e), e.eat(
        41
        /* ) */
      ) || e.raise("Unterminated group"), e.lastAssertionIsQuantifiable = !i, !0;
  }
  return e.pos = t, !1;
};
l.regexp_eatQuantifier = function(e, t) {
  return t === void 0 && (t = !1), this.regexp_eatQuantifierPrefix(e, t) ? (e.eat(
    63
    /* ? */
  ), !0) : !1;
};
l.regexp_eatQuantifierPrefix = function(e, t) {
  return e.eat(
    42
    /* * */
  ) || e.eat(
    43
    /* + */
  ) || e.eat(
    63
    /* ? */
  ) || this.regexp_eatBracedQuantifier(e, t);
};
l.regexp_eatBracedQuantifier = function(e, t) {
  var i = e.pos;
  if (e.eat(
    123
    /* { */
  )) {
    var s = 0, r = -1;
    if (this.regexp_eatDecimalDigits(e) && (s = e.lastIntValue, e.eat(
      44
      /* , */
    ) && this.regexp_eatDecimalDigits(e) && (r = e.lastIntValue), e.eat(
      125
      /* } */
    )))
      return r !== -1 && r < s && !t && e.raise("numbers out of order in {} quantifier"), !0;
    e.switchU && !t && e.raise("Incomplete quantifier"), e.pos = i;
  }
  return !1;
};
l.regexp_eatAtom = function(e) {
  return this.regexp_eatPatternCharacters(e) || e.eat(
    46
    /* . */
  ) || this.regexp_eatReverseSolidusAtomEscape(e) || this.regexp_eatCharacterClass(e) || this.regexp_eatUncapturingGroup(e) || this.regexp_eatCapturingGroup(e);
};
l.regexp_eatReverseSolidusAtomEscape = function(e) {
  var t = e.pos;
  if (e.eat(
    92
    /* \ */
  )) {
    if (this.regexp_eatAtomEscape(e))
      return !0;
    e.pos = t;
  }
  return !1;
};
l.regexp_eatUncapturingGroup = function(e) {
  var t = e.pos;
  if (e.eat(
    40
    /* ( */
  )) {
    if (e.eat(
      63
      /* ? */
    )) {
      if (this.options.ecmaVersion >= 16) {
        var i = this.regexp_eatModifiers(e), s = e.eat(
          45
          /* - */
        );
        if (i || s) {
          for (var r = 0; r < i.length; r++) {
            var n = i.charAt(r);
            i.indexOf(n, r + 1) > -1 && e.raise("Duplicate regular expression modifiers");
          }
          if (s) {
            var o = this.regexp_eatModifiers(e);
            !i && !o && e.current() === 58 && e.raise("Invalid regular expression modifiers");
            for (var u = 0; u < o.length; u++) {
              var h = o.charAt(u);
              (o.indexOf(h, u + 1) > -1 || i.indexOf(h) > -1) && e.raise("Duplicate regular expression modifiers");
            }
          }
        }
      }
      if (e.eat(
        58
        /* : */
      )) {
        if (this.regexp_disjunction(e), e.eat(
          41
          /* ) */
        ))
          return !0;
        e.raise("Unterminated group");
      }
    }
    e.pos = t;
  }
  return !1;
};
l.regexp_eatCapturingGroup = function(e) {
  if (e.eat(
    40
    /* ( */
  )) {
    if (this.options.ecmaVersion >= 9 ? this.regexp_groupSpecifier(e) : e.current() === 63 && e.raise("Invalid group"), this.regexp_disjunction(e), e.eat(
      41
      /* ) */
    ))
      return e.numCapturingParens += 1, !0;
    e.raise("Unterminated group");
  }
  return !1;
};
l.regexp_eatModifiers = function(e) {
  for (var t = "", i = 0; (i = e.current()) !== -1 && ui(i); )
    t += j(i), e.advance();
  return t;
};
function ui(e) {
  return e === 105 || e === 109 || e === 115;
}
l.regexp_eatExtendedAtom = function(e) {
  return e.eat(
    46
    /* . */
  ) || this.regexp_eatReverseSolidusAtomEscape(e) || this.regexp_eatCharacterClass(e) || this.regexp_eatUncapturingGroup(e) || this.regexp_eatCapturingGroup(e) || this.regexp_eatInvalidBracedQuantifier(e) || this.regexp_eatExtendedPatternCharacter(e);
};
l.regexp_eatInvalidBracedQuantifier = function(e) {
  return this.regexp_eatBracedQuantifier(e, !0) && e.raise("Nothing to repeat"), !1;
};
l.regexp_eatSyntaxCharacter = function(e) {
  var t = e.current();
  return mt(t) ? (e.lastIntValue = t, e.advance(), !0) : !1;
};
function mt(e) {
  return e === 36 || e >= 40 && e <= 43 || e === 46 || e === 63 || e >= 91 && e <= 94 || e >= 123 && e <= 125;
}
l.regexp_eatPatternCharacters = function(e) {
  for (var t = e.pos, i = 0; (i = e.current()) !== -1 && !mt(i); )
    e.advance();
  return e.pos !== t;
};
l.regexp_eatExtendedPatternCharacter = function(e) {
  var t = e.current();
  return t !== -1 && t !== 36 && !(t >= 40 && t <= 43) && t !== 46 && t !== 63 && t !== 91 && t !== 94 && t !== 124 ? (e.advance(), !0) : !1;
};
l.regexp_groupSpecifier = function(e) {
  if (e.eat(
    63
    /* ? */
  )) {
    this.regexp_eatGroupName(e) || e.raise("Invalid group");
    var t = this.options.ecmaVersion >= 16, i = e.groupNames[e.lastStringValue];
    if (i)
      if (t)
        for (var s = 0, r = i; s < r.length; s += 1) {
          var n = r[s];
          n.separatedFrom(e.branchID) || e.raise("Duplicate capture group name");
        }
      else
        e.raise("Duplicate capture group name");
    t ? (i || (e.groupNames[e.lastStringValue] = [])).push(e.branchID) : e.groupNames[e.lastStringValue] = !0;
  }
};
l.regexp_eatGroupName = function(e) {
  if (e.lastStringValue = "", e.eat(
    60
    /* < */
  )) {
    if (this.regexp_eatRegExpIdentifierName(e) && e.eat(
      62
      /* > */
    ))
      return !0;
    e.raise("Invalid capture group name");
  }
  return !1;
};
l.regexp_eatRegExpIdentifierName = function(e) {
  if (e.lastStringValue = "", this.regexp_eatRegExpIdentifierStart(e)) {
    for (e.lastStringValue += j(e.lastIntValue); this.regexp_eatRegExpIdentifierPart(e); )
      e.lastStringValue += j(e.lastIntValue);
    return !0;
  }
  return !1;
};
l.regexp_eatRegExpIdentifierStart = function(e) {
  var t = e.pos, i = this.options.ecmaVersion >= 11, s = e.current(i);
  return e.advance(i), s === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(e, i) && (s = e.lastIntValue), hi(s) ? (e.lastIntValue = s, !0) : (e.pos = t, !1);
};
function hi(e) {
  return M(e, !0) || e === 36 || e === 95;
}
l.regexp_eatRegExpIdentifierPart = function(e) {
  var t = e.pos, i = this.options.ecmaVersion >= 11, s = e.current(i);
  return e.advance(i), s === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(e, i) && (s = e.lastIntValue), ci(s) ? (e.lastIntValue = s, !0) : (e.pos = t, !1);
};
function ci(e) {
  return z(e, !0) || e === 36 || e === 95 || e === 8204 || e === 8205;
}
l.regexp_eatAtomEscape = function(e) {
  return this.regexp_eatBackReference(e) || this.regexp_eatCharacterClassEscape(e) || this.regexp_eatCharacterEscape(e) || e.switchN && this.regexp_eatKGroupName(e) ? !0 : (e.switchU && (e.current() === 99 && e.raise("Invalid unicode escape"), e.raise("Invalid escape")), !1);
};
l.regexp_eatBackReference = function(e) {
  var t = e.pos;
  if (this.regexp_eatDecimalEscape(e)) {
    var i = e.lastIntValue;
    if (e.switchU)
      return i > e.maxBackReference && (e.maxBackReference = i), !0;
    if (i <= e.numCapturingParens)
      return !0;
    e.pos = t;
  }
  return !1;
};
l.regexp_eatKGroupName = function(e) {
  if (e.eat(
    107
    /* k */
  )) {
    if (this.regexp_eatGroupName(e))
      return e.backReferenceNames.push(e.lastStringValue), !0;
    e.raise("Invalid named reference");
  }
  return !1;
};
l.regexp_eatCharacterEscape = function(e) {
  return this.regexp_eatControlEscape(e) || this.regexp_eatCControlLetter(e) || this.regexp_eatZero(e) || this.regexp_eatHexEscapeSequence(e) || this.regexp_eatRegExpUnicodeEscapeSequence(e, !1) || !e.switchU && this.regexp_eatLegacyOctalEscapeSequence(e) || this.regexp_eatIdentityEscape(e);
};
l.regexp_eatCControlLetter = function(e) {
  var t = e.pos;
  if (e.eat(
    99
    /* c */
  )) {
    if (this.regexp_eatControlLetter(e))
      return !0;
    e.pos = t;
  }
  return !1;
};
l.regexp_eatZero = function(e) {
  return e.current() === 48 && !xe(e.lookahead()) ? (e.lastIntValue = 0, e.advance(), !0) : !1;
};
l.regexp_eatControlEscape = function(e) {
  var t = e.current();
  return t === 116 ? (e.lastIntValue = 9, e.advance(), !0) : t === 110 ? (e.lastIntValue = 10, e.advance(), !0) : t === 118 ? (e.lastIntValue = 11, e.advance(), !0) : t === 102 ? (e.lastIntValue = 12, e.advance(), !0) : t === 114 ? (e.lastIntValue = 13, e.advance(), !0) : !1;
};
l.regexp_eatControlLetter = function(e) {
  var t = e.current();
  return gt(t) ? (e.lastIntValue = t % 32, e.advance(), !0) : !1;
};
function gt(e) {
  return e >= 65 && e <= 90 || e >= 97 && e <= 122;
}
l.regexp_eatRegExpUnicodeEscapeSequence = function(e, t) {
  t === void 0 && (t = !1);
  var i = e.pos, s = t || e.switchU;
  if (e.eat(
    117
    /* u */
  )) {
    if (this.regexp_eatFixedHexDigits(e, 4)) {
      var r = e.lastIntValue;
      if (s && r >= 55296 && r <= 56319) {
        var n = e.pos;
        if (e.eat(
          92
          /* \ */
        ) && e.eat(
          117
          /* u */
        ) && this.regexp_eatFixedHexDigits(e, 4)) {
          var o = e.lastIntValue;
          if (o >= 56320 && o <= 57343)
            return e.lastIntValue = (r - 55296) * 1024 + (o - 56320) + 65536, !0;
        }
        e.pos = n, e.lastIntValue = r;
      }
      return !0;
    }
    if (s && e.eat(
      123
      /* { */
    ) && this.regexp_eatHexDigits(e) && e.eat(
      125
      /* } */
    ) && li(e.lastIntValue))
      return !0;
    s && e.raise("Invalid unicode escape"), e.pos = i;
  }
  return !1;
};
function li(e) {
  return e >= 0 && e <= 1114111;
}
l.regexp_eatIdentityEscape = function(e) {
  if (e.switchU)
    return this.regexp_eatSyntaxCharacter(e) ? !0 : e.eat(
      47
      /* / */
    ) ? (e.lastIntValue = 47, !0) : !1;
  var t = e.current();
  return t !== 99 && (!e.switchN || t !== 107) ? (e.lastIntValue = t, e.advance(), !0) : !1;
};
l.regexp_eatDecimalEscape = function(e) {
  e.lastIntValue = 0;
  var t = e.current();
  if (t >= 49 && t <= 57) {
    do
      e.lastIntValue = 10 * e.lastIntValue + (t - 48), e.advance();
    while ((t = e.current()) >= 48 && t <= 57);
    return !0;
  }
  return !1;
};
var vt = 0, q = 1, R = 2;
l.regexp_eatCharacterClassEscape = function(e) {
  var t = e.current();
  if (pi(t))
    return e.lastIntValue = -1, e.advance(), q;
  var i = !1;
  if (e.switchU && this.options.ecmaVersion >= 9 && ((i = t === 80) || t === 112)) {
    e.lastIntValue = -1, e.advance();
    var s;
    if (e.eat(
      123
      /* { */
    ) && (s = this.regexp_eatUnicodePropertyValueExpression(e)) && e.eat(
      125
      /* } */
    ))
      return i && s === R && e.raise("Invalid property name"), s;
    e.raise("Invalid property name");
  }
  return vt;
};
function pi(e) {
  return e === 100 || e === 68 || e === 115 || e === 83 || e === 119 || e === 87;
}
l.regexp_eatUnicodePropertyValueExpression = function(e) {
  var t = e.pos;
  if (this.regexp_eatUnicodePropertyName(e) && e.eat(
    61
    /* = */
  )) {
    var i = e.lastStringValue;
    if (this.regexp_eatUnicodePropertyValue(e)) {
      var s = e.lastStringValue;
      return this.regexp_validateUnicodePropertyNameAndValue(e, i, s), q;
    }
  }
  if (e.pos = t, this.regexp_eatLoneUnicodePropertyNameOrValue(e)) {
    var r = e.lastStringValue;
    return this.regexp_validateUnicodePropertyNameOrValue(e, r);
  }
  return vt;
};
l.regexp_validateUnicodePropertyNameAndValue = function(e, t, i) {
  $(e.unicodeProperties.nonBinary, t) || e.raise("Invalid property name"), e.unicodeProperties.nonBinary[t].test(i) || e.raise("Invalid property value");
};
l.regexp_validateUnicodePropertyNameOrValue = function(e, t) {
  if (e.unicodeProperties.binary.test(t))
    return q;
  if (e.switchV && e.unicodeProperties.binaryOfStrings.test(t))
    return R;
  e.raise("Invalid property name");
};
l.regexp_eatUnicodePropertyName = function(e) {
  var t = 0;
  for (e.lastStringValue = ""; bt(t = e.current()); )
    e.lastStringValue += j(t), e.advance();
  return e.lastStringValue !== "";
};
function bt(e) {
  return gt(e) || e === 95;
}
l.regexp_eatUnicodePropertyValue = function(e) {
  var t = 0;
  for (e.lastStringValue = ""; fi(t = e.current()); )
    e.lastStringValue += j(t), e.advance();
  return e.lastStringValue !== "";
};
function fi(e) {
  return bt(e) || xe(e);
}
l.regexp_eatLoneUnicodePropertyNameOrValue = function(e) {
  return this.regexp_eatUnicodePropertyValue(e);
};
l.regexp_eatCharacterClass = function(e) {
  if (e.eat(
    91
    /* [ */
  )) {
    var t = e.eat(
      94
      /* ^ */
    ), i = this.regexp_classContents(e);
    return e.eat(
      93
      /* ] */
    ) || e.raise("Unterminated character class"), t && i === R && e.raise("Negated character class may contain strings"), !0;
  }
  return !1;
};
l.regexp_classContents = function(e) {
  return e.current() === 93 ? q : e.switchV ? this.regexp_classSetExpression(e) : (this.regexp_nonEmptyClassRanges(e), q);
};
l.regexp_nonEmptyClassRanges = function(e) {
  for (; this.regexp_eatClassAtom(e); ) {
    var t = e.lastIntValue;
    if (e.eat(
      45
      /* - */
    ) && this.regexp_eatClassAtom(e)) {
      var i = e.lastIntValue;
      e.switchU && (t === -1 || i === -1) && e.raise("Invalid character class"), t !== -1 && i !== -1 && t > i && e.raise("Range out of order in character class");
    }
  }
};
l.regexp_eatClassAtom = function(e) {
  var t = e.pos;
  if (e.eat(
    92
    /* \ */
  )) {
    if (this.regexp_eatClassEscape(e))
      return !0;
    if (e.switchU) {
      var i = e.current();
      (i === 99 || Ct(i)) && e.raise("Invalid class escape"), e.raise("Invalid escape");
    }
    e.pos = t;
  }
  var s = e.current();
  return s !== 93 ? (e.lastIntValue = s, e.advance(), !0) : !1;
};
l.regexp_eatClassEscape = function(e) {
  var t = e.pos;
  if (e.eat(
    98
    /* b */
  ))
    return e.lastIntValue = 8, !0;
  if (e.switchU && e.eat(
    45
    /* - */
  ))
    return e.lastIntValue = 45, !0;
  if (!e.switchU && e.eat(
    99
    /* c */
  )) {
    if (this.regexp_eatClassControlLetter(e))
      return !0;
    e.pos = t;
  }
  return this.regexp_eatCharacterClassEscape(e) || this.regexp_eatCharacterEscape(e);
};
l.regexp_classSetExpression = function(e) {
  var t = q, i;
  if (!this.regexp_eatClassSetRange(e)) if (i = this.regexp_eatClassSetOperand(e)) {
    i === R && (t = R);
    for (var s = e.pos; e.eatChars(
      [38, 38]
      /* && */
    ); ) {
      if (e.current() !== 38 && (i = this.regexp_eatClassSetOperand(e))) {
        i !== R && (t = q);
        continue;
      }
      e.raise("Invalid character in character class");
    }
    if (s !== e.pos)
      return t;
    for (; e.eatChars(
      [45, 45]
      /* -- */
    ); )
      this.regexp_eatClassSetOperand(e) || e.raise("Invalid character in character class");
    if (s !== e.pos)
      return t;
  } else
    e.raise("Invalid character in character class");
  for (; ; )
    if (!this.regexp_eatClassSetRange(e)) {
      if (i = this.regexp_eatClassSetOperand(e), !i)
        return t;
      i === R && (t = R);
    }
};
l.regexp_eatClassSetRange = function(e) {
  var t = e.pos;
  if (this.regexp_eatClassSetCharacter(e)) {
    var i = e.lastIntValue;
    if (e.eat(
      45
      /* - */
    ) && this.regexp_eatClassSetCharacter(e)) {
      var s = e.lastIntValue;
      return i !== -1 && s !== -1 && i > s && e.raise("Range out of order in character class"), !0;
    }
    e.pos = t;
  }
  return !1;
};
l.regexp_eatClassSetOperand = function(e) {
  return this.regexp_eatClassSetCharacter(e) ? q : this.regexp_eatClassStringDisjunction(e) || this.regexp_eatNestedClass(e);
};
l.regexp_eatNestedClass = function(e) {
  var t = e.pos;
  if (e.eat(
    91
    /* [ */
  )) {
    var i = e.eat(
      94
      /* ^ */
    ), s = this.regexp_classContents(e);
    if (e.eat(
      93
      /* ] */
    ))
      return i && s === R && e.raise("Negated character class may contain strings"), s;
    e.pos = t;
  }
  if (e.eat(
    92
    /* \ */
  )) {
    var r = this.regexp_eatCharacterClassEscape(e);
    if (r)
      return r;
    e.pos = t;
  }
  return null;
};
l.regexp_eatClassStringDisjunction = function(e) {
  var t = e.pos;
  if (e.eatChars(
    [92, 113]
    /* \q */
  )) {
    if (e.eat(
      123
      /* { */
    )) {
      var i = this.regexp_classStringDisjunctionContents(e);
      if (e.eat(
        125
        /* } */
      ))
        return i;
    } else
      e.raise("Invalid escape");
    e.pos = t;
  }
  return null;
};
l.regexp_classStringDisjunctionContents = function(e) {
  for (var t = this.regexp_classString(e); e.eat(
    124
    /* | */
  ); )
    this.regexp_classString(e) === R && (t = R);
  return t;
};
l.regexp_classString = function(e) {
  for (var t = 0; this.regexp_eatClassSetCharacter(e); )
    t++;
  return t === 1 ? q : R;
};
l.regexp_eatClassSetCharacter = function(e) {
  var t = e.pos;
  if (e.eat(
    92
    /* \ */
  ))
    return this.regexp_eatCharacterEscape(e) || this.regexp_eatClassSetReservedPunctuator(e) ? !0 : e.eat(
      98
      /* b */
    ) ? (e.lastIntValue = 8, !0) : (e.pos = t, !1);
  var i = e.current();
  return i < 0 || i === e.lookahead() && di(i) || xi(i) ? !1 : (e.advance(), e.lastIntValue = i, !0);
};
function di(e) {
  return e === 33 || e >= 35 && e <= 38 || e >= 42 && e <= 44 || e === 46 || e >= 58 && e <= 64 || e === 94 || e === 96 || e === 126;
}
function xi(e) {
  return e === 40 || e === 41 || e === 45 || e === 47 || e >= 91 && e <= 93 || e >= 123 && e <= 125;
}
l.regexp_eatClassSetReservedPunctuator = function(e) {
  var t = e.current();
  return mi(t) ? (e.lastIntValue = t, e.advance(), !0) : !1;
};
function mi(e) {
  return e === 33 || e === 35 || e === 37 || e === 38 || e === 44 || e === 45 || e >= 58 && e <= 62 || e === 64 || e === 96 || e === 126;
}
l.regexp_eatClassControlLetter = function(e) {
  var t = e.current();
  return xe(t) || t === 95 ? (e.lastIntValue = t % 32, e.advance(), !0) : !1;
};
l.regexp_eatHexEscapeSequence = function(e) {
  var t = e.pos;
  if (e.eat(
    120
    /* x */
  )) {
    if (this.regexp_eatFixedHexDigits(e, 2))
      return !0;
    e.switchU && e.raise("Invalid escape"), e.pos = t;
  }
  return !1;
};
l.regexp_eatDecimalDigits = function(e) {
  var t = e.pos, i = 0;
  for (e.lastIntValue = 0; xe(i = e.current()); )
    e.lastIntValue = 10 * e.lastIntValue + (i - 48), e.advance();
  return e.pos !== t;
};
function xe(e) {
  return e >= 48 && e <= 57;
}
l.regexp_eatHexDigits = function(e) {
  var t = e.pos, i = 0;
  for (e.lastIntValue = 0; yt(i = e.current()); )
    e.lastIntValue = 16 * e.lastIntValue + _t(i), e.advance();
  return e.pos !== t;
};
function yt(e) {
  return e >= 48 && e <= 57 || e >= 65 && e <= 70 || e >= 97 && e <= 102;
}
function _t(e) {
  return e >= 65 && e <= 70 ? 10 + (e - 65) : e >= 97 && e <= 102 ? 10 + (e - 97) : e - 48;
}
l.regexp_eatLegacyOctalEscapeSequence = function(e) {
  if (this.regexp_eatOctalDigit(e)) {
    var t = e.lastIntValue;
    if (this.regexp_eatOctalDigit(e)) {
      var i = e.lastIntValue;
      t <= 3 && this.regexp_eatOctalDigit(e) ? e.lastIntValue = t * 64 + i * 8 + e.lastIntValue : e.lastIntValue = t * 8 + i;
    } else
      e.lastIntValue = t;
    return !0;
  }
  return !1;
};
l.regexp_eatOctalDigit = function(e) {
  var t = e.current();
  return Ct(t) ? (e.lastIntValue = t - 48, e.advance(), !0) : (e.lastIntValue = 0, !1);
};
function Ct(e) {
  return e >= 48 && e <= 55;
}
l.regexp_eatFixedHexDigits = function(e, t) {
  var i = e.pos;
  e.lastIntValue = 0;
  for (var s = 0; s < t; ++s) {
    var r = e.current();
    if (!yt(r))
      return e.pos = i, !1;
    e.lastIntValue = 16 * e.lastIntValue + _t(r), e.advance();
  }
  return !0;
};
var Ve = function(t) {
  this.type = t.type, this.value = t.value, this.start = t.start, this.end = t.end, t.options.locations && (this.loc = new ce(t, t.startLoc, t.endLoc)), t.options.ranges && (this.range = [t.start, t.end]);
}, m = C.prototype;
m.next = function(e) {
  !e && this.type.keyword && this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword), this.options.onToken && this.options.onToken(new Ve(this)), this.lastTokEnd = this.end, this.lastTokStart = this.start, this.lastTokEndLoc = this.endLoc, this.lastTokStartLoc = this.startLoc, this.nextToken();
};
m.getToken = function() {
  return this.next(), new Ve(this);
};
typeof Symbol < "u" && (m[Symbol.iterator] = function() {
  var e = this;
  return {
    next: function() {
      var t = e.getToken();
      return {
        done: t.type === a.eof,
        value: t
      };
    }
  };
});
m.nextToken = function() {
  var e = this.curContext();
  if ((!e || !e.preserveSpace) && this.skipSpace(), this.start = this.pos, this.options.locations && (this.startLoc = this.curPosition()), this.pos >= this.input.length)
    return this.finishToken(a.eof);
  if (e.override)
    return e.override(this);
  this.readToken(this.fullCharCodeAtPos());
};
m.readToken = function(e) {
  return M(e, this.options.ecmaVersion >= 6) || e === 92 ? this.readWord() : this.getTokenFromCode(e);
};
m.fullCharCodeAt = function(e) {
  var t = this.input.charCodeAt(e);
  if (t <= 55295 || t >= 56320)
    return t;
  var i = this.input.charCodeAt(e + 1);
  return i <= 56319 || i >= 57344 ? t : (t << 10) + i - 56613888;
};
m.fullCharCodeAtPos = function() {
  return this.fullCharCodeAt(this.pos);
};
m.skipBlockComment = function() {
  var e = this.options.onComment && this.curPosition(), t = this.pos, i = this.input.indexOf("*/", this.pos += 2);
  if (i === -1 && this.raise(this.pos - 2, "Unterminated comment"), this.pos = i + 2, this.options.locations)
    for (var s = void 0, r = t; (s = He(this.input, r, this.pos)) > -1; )
      ++this.curLine, r = this.lineStart = s;
  this.options.onComment && this.options.onComment(
    !0,
    this.input.slice(t + 2, i),
    t,
    this.pos,
    e,
    this.curPosition()
  );
};
m.skipLineComment = function(e) {
  for (var t = this.pos, i = this.options.onComment && this.curPosition(), s = this.input.charCodeAt(this.pos += e); this.pos < this.input.length && !J(s); )
    s = this.input.charCodeAt(++this.pos);
  this.options.onComment && this.options.onComment(
    !1,
    this.input.slice(t + e, this.pos),
    t,
    this.pos,
    i,
    this.curPosition()
  );
};
m.skipSpace = function() {
  e: for (; this.pos < this.input.length; ) {
    var e = this.input.charCodeAt(this.pos);
    switch (e) {
      case 32:
      case 160:
        ++this.pos;
        break;
      case 13:
        this.input.charCodeAt(this.pos + 1) === 10 && ++this.pos;
      case 10:
      case 8232:
      case 8233:
        ++this.pos, this.options.locations && (++this.curLine, this.lineStart = this.pos);
        break;
      case 47:
        switch (this.input.charCodeAt(this.pos + 1)) {
          case 42:
            this.skipBlockComment();
            break;
          case 47:
            this.skipLineComment(2);
            break;
          default:
            break e;
        }
        break;
      default:
        if (e > 8 && e < 14 || e >= 5760 && ze.test(String.fromCharCode(e)))
          ++this.pos;
        else
          break e;
    }
  }
};
m.finishToken = function(e, t) {
  this.end = this.pos, this.options.locations && (this.endLoc = this.curPosition());
  var i = this.type;
  this.type = e, this.value = t, this.updateContext(i);
};
m.readToken_dot = function() {
  var e = this.input.charCodeAt(this.pos + 1);
  if (e >= 48 && e <= 57)
    return this.readNumber(!0);
  var t = this.input.charCodeAt(this.pos + 2);
  return this.options.ecmaVersion >= 6 && e === 46 && t === 46 ? (this.pos += 3, this.finishToken(a.ellipsis)) : (++this.pos, this.finishToken(a.dot));
};
m.readToken_slash = function() {
  var e = this.input.charCodeAt(this.pos + 1);
  return this.exprAllowed ? (++this.pos, this.readRegexp()) : e === 61 ? this.finishOp(a.assign, 2) : this.finishOp(a.slash, 1);
};
m.readToken_mult_modulo_exp = function(e) {
  var t = this.input.charCodeAt(this.pos + 1), i = 1, s = e === 42 ? a.star : a.modulo;
  return this.options.ecmaVersion >= 7 && e === 42 && t === 42 && (++i, s = a.starstar, t = this.input.charCodeAt(this.pos + 2)), t === 61 ? this.finishOp(a.assign, i + 1) : this.finishOp(s, i);
};
m.readToken_pipe_amp = function(e) {
  var t = this.input.charCodeAt(this.pos + 1);
  if (t === e) {
    if (this.options.ecmaVersion >= 12) {
      var i = this.input.charCodeAt(this.pos + 2);
      if (i === 61)
        return this.finishOp(a.assign, 3);
    }
    return this.finishOp(e === 124 ? a.logicalOR : a.logicalAND, 2);
  }
  return t === 61 ? this.finishOp(a.assign, 2) : this.finishOp(e === 124 ? a.bitwiseOR : a.bitwiseAND, 1);
};
m.readToken_caret = function() {
  var e = this.input.charCodeAt(this.pos + 1);
  return e === 61 ? this.finishOp(a.assign, 2) : this.finishOp(a.bitwiseXOR, 1);
};
m.readToken_plus_min = function(e) {
  var t = this.input.charCodeAt(this.pos + 1);
  return t === e ? t === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 && (this.lastTokEnd === 0 || N.test(this.input.slice(this.lastTokEnd, this.pos))) ? (this.skipLineComment(3), this.skipSpace(), this.nextToken()) : this.finishOp(a.incDec, 2) : t === 61 ? this.finishOp(a.assign, 2) : this.finishOp(a.plusMin, 1);
};
m.readToken_lt_gt = function(e) {
  var t = this.input.charCodeAt(this.pos + 1), i = 1;
  return t === e ? (i = e === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2, this.input.charCodeAt(this.pos + i) === 61 ? this.finishOp(a.assign, i + 1) : this.finishOp(a.bitShift, i)) : t === 33 && e === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 && this.input.charCodeAt(this.pos + 3) === 45 ? (this.skipLineComment(4), this.skipSpace(), this.nextToken()) : (t === 61 && (i = 2), this.finishOp(a.relational, i));
};
m.readToken_eq_excl = function(e) {
  var t = this.input.charCodeAt(this.pos + 1);
  return t === 61 ? this.finishOp(a.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2) : e === 61 && t === 62 && this.options.ecmaVersion >= 6 ? (this.pos += 2, this.finishToken(a.arrow)) : this.finishOp(e === 61 ? a.eq : a.prefix, 1);
};
m.readToken_question = function() {
  var e = this.options.ecmaVersion;
  if (e >= 11) {
    var t = this.input.charCodeAt(this.pos + 1);
    if (t === 46) {
      var i = this.input.charCodeAt(this.pos + 2);
      if (i < 48 || i > 57)
        return this.finishOp(a.questionDot, 2);
    }
    if (t === 63) {
      if (e >= 12) {
        var s = this.input.charCodeAt(this.pos + 2);
        if (s === 61)
          return this.finishOp(a.assign, 3);
      }
      return this.finishOp(a.coalesce, 2);
    }
  }
  return this.finishOp(a.question, 1);
};
m.readToken_numberSign = function() {
  var e = this.options.ecmaVersion, t = 35;
  if (e >= 13 && (++this.pos, t = this.fullCharCodeAtPos(), M(t, !0) || t === 92))
    return this.finishToken(a.privateId, this.readWord1());
  this.raise(this.pos, "Unexpected character '" + j(t) + "'");
};
m.getTokenFromCode = function(e) {
  switch (e) {
    case 46:
      return this.readToken_dot();
    case 40:
      return ++this.pos, this.finishToken(a.parenL);
    case 41:
      return ++this.pos, this.finishToken(a.parenR);
    case 59:
      return ++this.pos, this.finishToken(a.semi);
    case 44:
      return ++this.pos, this.finishToken(a.comma);
    case 91:
      return ++this.pos, this.finishToken(a.bracketL);
    case 93:
      return ++this.pos, this.finishToken(a.bracketR);
    case 123:
      return ++this.pos, this.finishToken(a.braceL);
    case 125:
      return ++this.pos, this.finishToken(a.braceR);
    case 58:
      return ++this.pos, this.finishToken(a.colon);
    case 96:
      if (this.options.ecmaVersion < 6)
        break;
      return ++this.pos, this.finishToken(a.backQuote);
    case 48:
      var t = this.input.charCodeAt(this.pos + 1);
      if (t === 120 || t === 88)
        return this.readRadixNumber(16);
      if (this.options.ecmaVersion >= 6) {
        if (t === 111 || t === 79)
          return this.readRadixNumber(8);
        if (t === 98 || t === 66)
          return this.readRadixNumber(2);
      }
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
      return this.readNumber(!1);
    case 34:
    case 39:
      return this.readString(e);
    case 47:
      return this.readToken_slash();
    case 37:
    case 42:
      return this.readToken_mult_modulo_exp(e);
    case 124:
    case 38:
      return this.readToken_pipe_amp(e);
    case 94:
      return this.readToken_caret();
    case 43:
    case 45:
      return this.readToken_plus_min(e);
    case 60:
    case 62:
      return this.readToken_lt_gt(e);
    case 61:
    case 33:
      return this.readToken_eq_excl(e);
    case 63:
      return this.readToken_question();
    case 126:
      return this.finishOp(a.prefix, 1);
    case 35:
      return this.readToken_numberSign();
  }
  this.raise(this.pos, "Unexpected character '" + j(e) + "'");
};
m.finishOp = function(e, t) {
  var i = this.input.slice(this.pos, this.pos + t);
  return this.pos += t, this.finishToken(e, i);
};
m.readRegexp = function() {
  for (var e, t, i = this.pos; ; ) {
    this.pos >= this.input.length && this.raise(i, "Unterminated regular expression");
    var s = this.input.charAt(this.pos);
    if (N.test(s) && this.raise(i, "Unterminated regular expression"), e)
      e = !1;
    else {
      if (s === "[")
        t = !0;
      else if (s === "]" && t)
        t = !1;
      else if (s === "/" && !t)
        break;
      e = s === "\\";
    }
    ++this.pos;
  }
  var r = this.input.slice(i, this.pos);
  ++this.pos;
  var n = this.pos, o = this.readWord1();
  this.containsEsc && this.unexpected(n);
  var u = this.regexpState || (this.regexpState = new U(this));
  u.reset(i, r, o), this.validateRegExpFlags(u), this.validateRegExpPattern(u);
  var h = null;
  try {
    h = new RegExp(r, o);
  } catch {
  }
  return this.finishToken(a.regexp, { pattern: r, flags: o, value: h });
};
m.readInt = function(e, t, i) {
  for (var s = this.options.ecmaVersion >= 12 && t === void 0, r = i && this.input.charCodeAt(this.pos) === 48, n = this.pos, o = 0, u = 0, h = 0, c = t ?? 1 / 0; h < c; ++h, ++this.pos) {
    var f = this.input.charCodeAt(this.pos), x = void 0;
    if (s && f === 95) {
      r && this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals"), u === 95 && this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore"), h === 0 && this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits"), u = f;
      continue;
    }
    if (f >= 97 ? x = f - 97 + 10 : f >= 65 ? x = f - 65 + 10 : f >= 48 && f <= 57 ? x = f - 48 : x = 1 / 0, x >= e)
      break;
    u = f, o = o * e + x;
  }
  return s && u === 95 && this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits"), this.pos === n || t != null && this.pos - n !== t ? null : o;
};
function gi(e, t) {
  return t ? parseInt(e, 8) : parseFloat(e.replace(/_/g, ""));
}
function St(e) {
  return typeof BigInt != "function" ? null : BigInt(e.replace(/_/g, ""));
}
m.readRadixNumber = function(e) {
  var t = this.pos;
  this.pos += 2;
  var i = this.readInt(e);
  return i == null && this.raise(this.start + 2, "Expected number in radix " + e), this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110 ? (i = St(this.input.slice(t, this.pos)), ++this.pos) : M(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"), this.finishToken(a.num, i);
};
m.readNumber = function(e) {
  var t = this.pos;
  !e && this.readInt(10, void 0, !0) === null && this.raise(t, "Invalid number");
  var i = this.pos - t >= 2 && this.input.charCodeAt(t) === 48;
  i && this.strict && this.raise(t, "Invalid number");
  var s = this.input.charCodeAt(this.pos);
  if (!i && !e && this.options.ecmaVersion >= 11 && s === 110) {
    var r = St(this.input.slice(t, this.pos));
    return ++this.pos, M(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"), this.finishToken(a.num, r);
  }
  i && /[89]/.test(this.input.slice(t, this.pos)) && (i = !1), s === 46 && !i && (++this.pos, this.readInt(10), s = this.input.charCodeAt(this.pos)), (s === 69 || s === 101) && !i && (s = this.input.charCodeAt(++this.pos), (s === 43 || s === 45) && ++this.pos, this.readInt(10) === null && this.raise(t, "Invalid number")), M(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number");
  var n = gi(this.input.slice(t, this.pos), i);
  return this.finishToken(a.num, n);
};
m.readCodePoint = function() {
  var e = this.input.charCodeAt(this.pos), t;
  if (e === 123) {
    this.options.ecmaVersion < 6 && this.unexpected();
    var i = ++this.pos;
    t = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos), ++this.pos, t > 1114111 && this.invalidStringToken(i, "Code point out of bounds");
  } else
    t = this.readHexChar(4);
  return t;
};
m.readString = function(e) {
  for (var t = "", i = ++this.pos; ; ) {
    this.pos >= this.input.length && this.raise(this.start, "Unterminated string constant");
    var s = this.input.charCodeAt(this.pos);
    if (s === e)
      break;
    s === 92 ? (t += this.input.slice(i, this.pos), t += this.readEscapedChar(!1), i = this.pos) : s === 8232 || s === 8233 ? (this.options.ecmaVersion < 10 && this.raise(this.start, "Unterminated string constant"), ++this.pos, this.options.locations && (this.curLine++, this.lineStart = this.pos)) : (J(s) && this.raise(this.start, "Unterminated string constant"), ++this.pos);
  }
  return t += this.input.slice(i, this.pos++), this.finishToken(a.string, t);
};
var wt = {};
m.tryReadTemplateToken = function() {
  this.inTemplateElement = !0;
  try {
    this.readTmplToken();
  } catch (e) {
    if (e === wt)
      this.readInvalidTemplateToken();
    else
      throw e;
  }
  this.inTemplateElement = !1;
};
m.invalidStringToken = function(e, t) {
  if (this.inTemplateElement && this.options.ecmaVersion >= 9)
    throw wt;
  this.raise(e, t);
};
m.readTmplToken = function() {
  for (var e = "", t = this.pos; ; ) {
    this.pos >= this.input.length && this.raise(this.start, "Unterminated template");
    var i = this.input.charCodeAt(this.pos);
    if (i === 96 || i === 36 && this.input.charCodeAt(this.pos + 1) === 123)
      return this.pos === this.start && (this.type === a.template || this.type === a.invalidTemplate) ? i === 36 ? (this.pos += 2, this.finishToken(a.dollarBraceL)) : (++this.pos, this.finishToken(a.backQuote)) : (e += this.input.slice(t, this.pos), this.finishToken(a.template, e));
    if (i === 92)
      e += this.input.slice(t, this.pos), e += this.readEscapedChar(!0), t = this.pos;
    else if (J(i)) {
      switch (e += this.input.slice(t, this.pos), ++this.pos, i) {
        case 13:
          this.input.charCodeAt(this.pos) === 10 && ++this.pos;
        case 10:
          e += `
`;
          break;
        default:
          e += String.fromCharCode(i);
          break;
      }
      this.options.locations && (++this.curLine, this.lineStart = this.pos), t = this.pos;
    } else
      ++this.pos;
  }
};
m.readInvalidTemplateToken = function() {
  for (; this.pos < this.input.length; this.pos++)
    switch (this.input[this.pos]) {
      case "\\":
        ++this.pos;
        break;
      case "$":
        if (this.input[this.pos + 1] !== "{")
          break;
      case "`":
        return this.finishToken(a.invalidTemplate, this.input.slice(this.start, this.pos));
      case "\r":
        this.input[this.pos + 1] === `
` && ++this.pos;
      case `
`:
      case "\u2028":
      case "\u2029":
        ++this.curLine, this.lineStart = this.pos + 1;
        break;
    }
  this.raise(this.start, "Unterminated template");
};
m.readEscapedChar = function(e) {
  var t = this.input.charCodeAt(++this.pos);
  switch (++this.pos, t) {
    case 110:
      return `
`;
    case 114:
      return "\r";
    case 120:
      return String.fromCharCode(this.readHexChar(2));
    case 117:
      return j(this.readCodePoint());
    case 116:
      return "	";
    case 98:
      return "\b";
    case 118:
      return "\v";
    case 102:
      return "\f";
    case 13:
      this.input.charCodeAt(this.pos) === 10 && ++this.pos;
    case 10:
      return this.options.locations && (this.lineStart = this.pos, ++this.curLine), "";
    case 56:
    case 57:
      if (this.strict && this.invalidStringToken(
        this.pos - 1,
        "Invalid escape sequence"
      ), e) {
        var i = this.pos - 1;
        this.invalidStringToken(
          i,
          "Invalid escape sequence in template string"
        );
      }
    default:
      if (t >= 48 && t <= 55) {
        var s = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0], r = parseInt(s, 8);
        return r > 255 && (s = s.slice(0, -1), r = parseInt(s, 8)), this.pos += s.length - 1, t = this.input.charCodeAt(this.pos), (s !== "0" || t === 56 || t === 57) && (this.strict || e) && this.invalidStringToken(
          this.pos - 1 - s.length,
          e ? "Octal literal in template string" : "Octal literal in strict mode"
        ), String.fromCharCode(r);
      }
      return J(t) ? (this.options.locations && (this.lineStart = this.pos, ++this.curLine), "") : String.fromCharCode(t);
  }
};
m.readHexChar = function(e) {
  var t = this.pos, i = this.readInt(16, e);
  return i === null && this.invalidStringToken(t, "Bad character escape sequence"), i;
};
m.readWord1 = function() {
  this.containsEsc = !1;
  for (var e = "", t = !0, i = this.pos, s = this.options.ecmaVersion >= 6; this.pos < this.input.length; ) {
    var r = this.fullCharCodeAtPos();
    if (z(r, s))
      this.pos += r <= 65535 ? 1 : 2;
    else if (r === 92) {
      this.containsEsc = !0, e += this.input.slice(i, this.pos);
      var n = this.pos;
      this.input.charCodeAt(++this.pos) !== 117 && this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX"), ++this.pos;
      var o = this.readCodePoint();
      (t ? M : z)(o, s) || this.invalidStringToken(n, "Invalid Unicode escape"), e += j(o), i = this.pos;
    } else
      break;
    t = !1;
  }
  return e + this.input.slice(i, this.pos);
};
m.readWord = function() {
  var e = this.readWord1(), t = a.name;
  return this.keywords.test(e) && (t = ke[e]), this.finishToken(t, e);
};
var vi = "8.16.0";
C.acorn = {
  Parser: C,
  version: vi,
  defaultOptions: Ce,
  Position: ie,
  SourceLocation: ce,
  getLineInfo: Ye,
  Node: de,
  TokenType: v,
  tokTypes: a,
  keywordTypes: ke,
  TokContext: F,
  tokContexts: y,
  isIdentifierChar: z,
  isIdentifierStart: M,
  Token: Ve,
  isNewLine: J,
  lineBreak: N,
  lineBreakG: Ut,
  nonASCIIwhitespace: ze
};
function bi(e, t, i) {
  return C.parseExpressionAt(e, t, i);
}
const be = /* @__PURE__ */ new Map(), ye = /* @__PURE__ */ new Map(), yi = (e) => {
  const t = JSON.stringify(e);
  if (ye.has(t))
    return ye.get(t);
  const i = Object.fromEntries(Object.entries(e).map(([s, r]) => {
    if (typeof r == "string")
      try {
        const n = JSON.parse(r);
        return [s, n];
      } catch {
        return [s, r];
      }
    return [s, r];
  }));
  return ye.set(t, i), i;
}, he = (e) => String(e).padStart(2, "0"), kt = (e) => `${e.getFullYear()}/${he(e.getMonth() + 1)}/${he(e.getDate())}`, _i = (e) => `${kt(e)} ${he(e.getHours())}:${he(e.getMinutes())}`, Ci = (e, ...t) => {
  if (e == null)
    throw new TypeError("Cannot convert undefined or null to object");
  const i = { ...e };
  for (const s of t)
    if (s != null)
      for (const r in s)
        r === "__proto__" || r === "constructor" || r === "prototype" || Object.prototype.hasOwnProperty.call(s, r) && (i[r] = s[r]);
  return i;
}, Si = {
  keys: Object.keys,
  values: Object.values,
  entries: Object.entries,
  fromEntries: Object.fromEntries,
  is: Object.is,
  hasOwnProperty: Object.hasOwnProperty,
  assign: Ci
  // Safe version of Object.assign
  // The following methods are excluded due to security concerns:
  // - Side effects: create, freeze, seal (can still be used for attacks)
  // - Prototype access: getOwnPropertyDescriptor, getPrototypeOf, setPrototypeOf,
  //   defineProperty, defineProperties, getOwnPropertyNames, getOwnPropertySymbols
}, Me = {
  Math,
  String,
  Number,
  Boolean,
  Array,
  Object: Si,
  Date,
  JSON,
  isNaN,
  parseFloat,
  parseInt,
  decodeURI,
  decodeURIComponent,
  encodeURI,
  encodeURIComponent
}, E = (e) => {
  switch (e.type) {
    case "Literal":
    case "Identifier":
      break;
    case "BinaryExpression":
    case "LogicalExpression": {
      const t = e;
      E(t.left), E(t.right);
      break;
    }
    case "UnaryExpression": {
      E(e.argument);
      break;
    }
    case "ConditionalExpression": {
      const t = e;
      E(t.test), E(t.consequent), E(t.alternate);
      break;
    }
    case "MemberExpression": {
      const t = e;
      if (E(t.object), t.computed)
        E(t.property);
      else {
        const i = t.property.name;
        if (["constructor", "__proto__", "prototype"].includes(i))
          throw new Error("Access to prohibited property");
        if (["__defineGetter__", "__defineSetter__", "__lookupGetter__", "__lookupSetter__"].includes(i))
          throw new Error(`Access to prohibited method: ${i}`);
        if (typeof i == "string" && ["toLocaleString", "valueOf"].includes(i))
          throw new Error(`Access to prohibited method: ${i}`);
      }
      break;
    }
    case "CallExpression": {
      const t = e;
      E(t.callee), t.arguments.forEach(E);
      break;
    }
    case "ArrayExpression": {
      e.elements.forEach((i) => {
        i && E(i);
      });
      break;
    }
    case "ObjectExpression": {
      e.properties.forEach((i) => {
        const s = i;
        E(s.key), E(s.value);
      });
      break;
    }
    case "ArrowFunctionExpression": {
      const t = e;
      t.params.forEach((i) => {
        if (i.type !== "Identifier")
          throw new Error("Only identifier parameters are supported in arrow functions");
        E(i);
      }), E(t.body);
      break;
    }
    default:
      throw new Error(`Unsupported syntax in placeholder: ${e.type}`);
  }
}, S = (e, t) => {
  switch (e.type) {
    case "Literal":
      return e.value;
    case "Identifier": {
      const i = e;
      if (Object.prototype.hasOwnProperty.call(t, i.name))
        return t[i.name];
      if (Object.prototype.hasOwnProperty.call(Me, i.name))
        return Me[i.name];
      throw new Error(`Undefined variable: ${i.name}`);
    }
    case "BinaryExpression": {
      const i = e, s = S(i.left, t), r = S(i.right, t);
      switch (i.operator) {
        case "+":
          return s + r;
        case "-":
          return s - r;
        case "*":
          return s * r;
        case "/":
          return s / r;
        case "%":
          return s % r;
        case "**":
          return s ** r;
        case "==":
          return s == r;
        case "!=":
          return s != r;
        case "===":
          return s === r;
        case "!==":
          return s !== r;
        case "<":
          return s < r;
        case ">":
          return s > r;
        case "<=":
          return s <= r;
        case ">=":
          return s >= r;
        default:
          throw new Error(`Unsupported operator: ${i.operator}`);
      }
    }
    case "LogicalExpression": {
      const i = e, s = S(i.left, t), r = S(i.right, t);
      switch (i.operator) {
        case "&&":
          return s && r;
        case "||":
          return s || r;
        default:
          throw new Error(`Unsupported operator: ${i.operator}`);
      }
    }
    case "UnaryExpression": {
      const i = e, s = S(i.argument, t);
      switch (i.operator) {
        case "+":
          return +s;
        case "-":
          return -s;
        case "!":
          return !s;
        default:
          throw new Error(`Unsupported operator: ${i.operator}`);
      }
    }
    case "ConditionalExpression": {
      const i = e, s = S(i.test, t);
      return S(s ? i.consequent : i.alternate, t);
    }
    case "MemberExpression": {
      const i = e, s = S(i.object, t);
      let r;
      if (i.computed ? r = S(i.property, t) : r = i.property.name, typeof r == "string" || typeof r == "number") {
        if (typeof r == "string" && ["constructor", "__proto__", "prototype"].includes(r))
          throw new Error("Access to prohibited property");
        if (typeof r == "string" && ["__defineGetter__", "__defineSetter__", "__lookupGetter__", "__lookupSetter__"].includes(r))
          throw new Error(`Access to prohibited method: ${r}`);
        return s[r];
      } else
        throw new Error("Invalid property access");
    }
    case "CallExpression": {
      const i = e, s = S(i.callee, t), r = i.arguments.map((n) => S(n, t));
      if (typeof s == "function")
        if (i.callee.type === "MemberExpression") {
          const n = i.callee, o = S(n.object, t);
          if (o !== null && (typeof o == "object" || typeof o == "number" || typeof o == "string" || typeof o == "boolean"))
            return s.call(o, ...r);
          throw new Error("Invalid object in member function call");
        } else
          return s(...r);
      else
        throw new Error("Attempted to call a non-function");
    }
    case "ArrowFunctionExpression": {
      const i = e, s = i.params.map((n) => n.name), r = i.body;
      return (...n) => {
        const o = { ...t };
        return s.forEach((u, h) => {
          o[u] = n[h];
        }), S(r, o);
      };
    }
    case "ArrayExpression":
      return e.elements.map((s) => s ? S(s, t) : null);
    case "ObjectExpression": {
      const i = e, s = {};
      return i.properties.forEach((r) => {
        const n = r;
        let o;
        if (n.key.type === "Identifier")
          o = n.key.name;
        else {
          const h = S(n.key, t);
          if (typeof h != "string" && typeof h != "number")
            throw new Error("Object property keys must be strings or numbers");
          o = String(h);
        }
        const u = S(n.value, t);
        s[o] = u;
      }), s;
    }
    default:
      throw new Error(`Unsupported syntax in placeholder: ${e.type}`);
  }
}, Ue = (e) => {
  const { content: t, context: i } = e;
  let s = "", r = 0;
  for (; r < t.length; ) {
    const n = t.indexOf("{", r);
    if (n === -1) {
      s += t.slice(r);
      break;
    }
    s += t.slice(r, n);
    let o = 1, u = n + 1;
    for (; u < t.length && o > 0; )
      t[u] === "{" ? o++ : t[u] === "}" && o--, u++;
    if (o === 0) {
      const h = t.slice(n + 1, u - 1).trim();
      if (be.has(h)) {
        const c = be.get(h);
        try {
          const f = c(i);
          s += String(f);
        } catch {
          s += t.slice(n, u);
        }
      } else
        try {
          const c = bi(h, 0, { ecmaVersion: "latest" });
          E(c);
          const f = (b) => S(c, b);
          be.set(h, f);
          const x = f(i);
          s += String(x);
        } catch {
          s += t.slice(n, u);
        }
      r = u;
    } else
      throw new Error("Invalid placeholder");
  }
  return s;
}, Ei = (e) => {
  const { content: t, variables: i, schemas: s } = e;
  if (!t || typeof t != "string" || !t.includes("{") || !t.includes("}"))
    return t;
  const r = /* @__PURE__ */ new Date(), n = kt(r), o = _i(r), u = {
    ...Object.fromEntries(s.flat().map((f) => [f.name, f.readOnly && f.content || ""])),
    ...i
  }, h = yi(u), c = {
    date: n,
    dateTime: o,
    ...h
  };
  return Object.entries(c).forEach(([f, x]) => {
    typeof x == "string" && x.includes("{") && x.includes("}") && (c[f] = Ue({ content: x, context: c }));
  }), Ue({ content: t, context: c });
}, Ai = (e) => ({
  plugins: e,
  entries: () => Object.entries(e),
  values: () => Object.values(e),
  exists: () => Object.values(e).length > 0,
  findWithLabelByType(t) {
    for (const [i, s] of Object.entries(this.plugins)) {
      if (!s || typeof s != "object" || !s.propPanel || typeof s.propPanel != "object")
        continue;
      const r = s.propPanel.defaultSchema;
      if (r && "type" in r && r.type === t)
        return [i, s];
    }
    return ["", void 0];
  },
  findByType(t) {
    const [, i] = this.findWithLabelByType(t);
    return i;
  }
});
export {
  ki as g,
  Ai as p,
  Ei as r
};
