// QR sign — separate from the price list. Three verified codes, on-brand HTML (for PDF/PNG) + editable Word.
const fs = require("fs");
const path = require("path");
const ASSETS = path.join(__dirname, "..", "..", "..", "assets").replace(/\\/g, "/");
const QRCode = require("qrcode");
const jsQR = require("jsqr");
const { PNG } = require("pngjs");
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, VerticalAlign, TableLayoutType,
} = require("docx");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
const LOGO = "" + ASSETS + "/logo.png";
const CODES = [
  { key: "shop",   url: "https://www.dragoninkandthread.com/shop.html",   label: "Shop the collection", sub: "every piece, anytime" },
  { key: "join",   url: "https://www.dragoninkandthread.com/#join",       label: "Join the Nest",       sub: "new makes & free patterns" },
  { key: "custom", url: "https://www.dragoninkandthread.com/custom.html", label: "Custom orders",       sub: "your fabric, your size" },
];

const esc = (s) => s.replace(/&/g, "&amp;");

(async () => {
  // 1. QR codes at high error correction, then prove each decodes to its URL
  for (const c of CODES) {
    c.png = await QRCode.toBuffer(c.url, { errorCorrectionLevel: "H", margin: 1, width: 900, color: { dark: "#2b2520", light: "#ffffff" } });
    fs.writeFileSync(path.join(SIGN, "qr-" + c.key + ".png"), c.png);
    const img = PNG.sync.read(c.png);
    const hit = jsQR(new Uint8ClampedArray(img.data), img.width, img.height);
    const ok = hit && hit.data === c.url;
    console.log("QR " + c.key + ": " + (ok ? "decodes correctly to " + c.url : "FAILED (" + (hit ? hit.data : "nothing") + ")"));
    if (!ok) throw new Error("QR check failed");
  }
  const src = (k) => "file:///" + path.join(SIGN, "qr-" + k + ".png").replace(/\\/g, "/");

  // 2. On-brand HTML, US Letter portrait (816 x 1056 CSS px)
  const html = [
    '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>QR sign</title>',
    '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,500&family=Great+Vibes&family=Nunito:wght@600;700;800&display=swap" rel="stylesheet">',
    '<style>',
    ':root { --teal-deep:#2f6b72; --teal:#4a9198; --clay-deep:#a34a6b; --honey:#d7a640; --honey-deep:#b9862a; --rose:#e7bcae; --ink:#453a30; --white:#fffdf7;',
    '  --display:"Fraunces",Georgia,serif; --script:"Great Vibes","Segoe Script",cursive; --body:"Nunito","Segoe UI",sans-serif; }',
    '@page { size: letter; margin: 0; }',
    '* { box-sizing:border-box; margin:0; padding:0; -webkit-print-color-adjust:exact; print-color-adjust:exact; }',
    'html, body { width:816px; height:1056px; background:#fff; overflow:hidden; }',
    'body { position:relative; font-family:var(--body); color:var(--ink); }',
    '.frame { position:absolute; inset:30px; border-radius:26px; overflow:hidden; background-color:#fbf5ef;',
    '  background-image: linear-gradient(180deg, rgba(255,253,247,.25), rgba(255,253,247,.12)), url("file:///" + ASSETS + "/gingham-pink.png");',
    '  background-size:auto, 52px 52px; }',
    '.panel { position:absolute; inset:54px; background:var(--white); border:2px solid var(--honey); border-radius:22px; box-shadow:0 10px 28px rgba(69,58,48,.12); }',
    '.panel::after { content:""; position:absolute; inset:10px; border:2px dashed rgba(215,166,64,.6); border-radius:15px; }',
    '.center { position:absolute; left:54px; right:54px; text-align:center; }',
    '.eyebrow { top:88px; } .eyebrow span { display:inline-block; font-family:var(--script); font-size:34px; line-height:1.2; color:var(--honey-deep); padding:3px 30px 8px; border:1.5px solid var(--honey); border-radius:999px; background:var(--white); }',
    '.title { top:138px; font-family:var(--display); font-weight:700; font-size:80px; line-height:1; letter-spacing:-1.5px; }',
    '.tag { top:226px; font-family:var(--script); font-size:38px; line-height:1; color:var(--clay-deep); }',
    '.rule { position:absolute; left:50%; top:276px; width:300px; margin-left:-150px; display:flex; align-items:center; gap:12px; }',
    '.rule i { flex:1; height:2px; background:linear-gradient(90deg, transparent, var(--honey), transparent); }',
    '.rule b { color:var(--honey); font-size:17px; line-height:1; }',
    '.card { position:absolute; background:#fff; border:2px solid var(--honey); border-radius:18px; text-align:center; box-shadow:0 8px 22px rgba(69,58,48,.10); }',
    '.card img { display:block; margin:0 auto; }',
    '.card .label { font-family:var(--display); font-weight:600; color:var(--ink); line-height:1.1; }',
    '.card .sub { font-family:var(--script); color:var(--clay-deep); line-height:1; }',
    '.big { left:50%; top:300px; width:340px; margin-left:-170px; padding:16px 16px 14px; }',
    '.big img { width:240px; height:240px; }',
    '.big .label { font-size:32px; margin-top:6px; } .big .sub { font-size:30px; margin-top:2px; }',
    '.small { top:672px; width:262px; padding:14px 12px 12px; }',
    '.small img { width:152px; height:152px; }',
    '.small .label { font-size:26px; margin-top:6px; } .small .sub { font-size:26px; margin-top:2px; }',
    '.s1 { left:128px; border-color:var(--rose); } .s2 { left:426px; border-color:var(--teal); }',
    '.foot { top:938px; font-weight:800; font-size:17px; color:var(--teal-deep); }',
    '.foot em { font-style:normal; color:var(--honey); padding:0 8px; }',
    '</style></head><body>',
    '<div class="frame"></div><div class="panel"></div>',
    '<div class="center eyebrow"><span>Dragon Ink and Thread</span></div>',
    '<div class="center title">Scan to Shop</div>',
    '<div class="center tag">take the whole shelf home in your pocket</div>',
    '<div class="rule"><i></i><b>&#10022;</b><i></i></div>',
    '<div class="card big"><img src="' + src("shop") + '" alt=""><div class="label">' + esc(CODES[0].label) + '</div><div class="sub">' + esc(CODES[0].sub) + '</div></div>',
    '<div class="card small s1"><img src="' + src("join") + '" alt=""><div class="label">' + esc(CODES[1].label) + '</div><div class="sub">' + esc(CODES[1].sub) + '</div></div>',
    '<div class="card small s2"><img src="' + src("custom") + '" alt=""><div class="label">' + esc(CODES[2].label) + '</div><div class="sub">' + esc(CODES[2].sub) + '</div></div>',
    '<div class="center foot">@dragonink_and_thread<em>&#10022;</em>dragoninkandthread.com</div>',
    '</body></html>',
  ].join("\n");
  fs.writeFileSync(path.join(SIGN, "qr-sign.html"), html);
  console.log("wrote qr-sign.html");

  // 3. Editable Word version
  const INK = "453A30", TEAL = "2F6B72", ROSE = "A34A6B", HONEY = "D7A640", PINK = "EAB3C6", TEAL_L = "4A9198", ROSE_L = "E7BCAE";
  const SERIF = "Georgia", SCRIPT = "Segoe Script", BODY = "Calibri", SYM = "Segoe UI Symbol";
  const STAR = String.fromCharCode(0x2726);
  const t = (text, o = {}) => new TextRun({ text, font: o.font || SERIF, size: o.size || 24, color: o.color || INK, bold: o.bold, italics: o.italics });
  const star = (size) => new TextRun({ text: STAR, font: SYM, size, color: HONEY });
  const p = (children, o = {}) => new Paragraph({ alignment: AlignmentType.CENTER, children, spacing: { before: o.before || 0, after: o.after || 0 } });
  const NONE = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const box = (color) => { const b = { style: BorderStyle.SINGLE, size: 16, color }; return { top: b, bottom: b, left: b, right: b }; };
  const qrCell = (c, px, w, color, labelSize, subSize) => new TableCell({
    width: { size: w, type: WidthType.DXA }, borders: box(color), verticalAlign: VerticalAlign.CENTER,
    margins: { top: 140, bottom: 120, left: 120, right: 120 },
    children: [
      p([new ImageRun({ type: "png", data: c.png, transformation: { width: px, height: px } })], { after: 60 }),
      p([t(c.label, { size: labelSize, bold: true })], { after: 20 }),
      p([t(c.sub, { font: SCRIPT, size: subSize, color: ROSE })]),
    ] });
  const BIG = 4600;
  const bigTable = new Table({ alignment: AlignmentType.CENTER, layout: TableLayoutType.FIXED, width: { size: BIG, type: WidthType.DXA }, columnWidths: [BIG],
    rows: [new TableRow({ children: [qrCell(CODES[0], 250, BIG, HONEY, 34, 26)] })] });
  const SM = 3500, GAP = 500;
  const gapCell = new TableCell({ width: { size: GAP, type: WidthType.DXA }, borders: { top: NONE, bottom: NONE, left: NONE, right: NONE }, children: [p([t("")])] });
  const smallTable = new Table({ alignment: AlignmentType.CENTER, layout: TableLayoutType.FIXED, width: { size: SM * 2 + GAP, type: WidthType.DXA }, columnWidths: [SM, GAP, SM],
    borders: { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE },
    rows: [new TableRow({ children: [qrCell(CODES[1], 150, SM, ROSE_L, 28, 22), gapCell, qrCell(CODES[2], 150, SM, TEAL_L, 28, 22)] })] });
  const side = { style: BorderStyle.SINGLE, size: 36, color: PINK, space: 20 };
  const doc = new Document({ creator: "Dragon Ink and Thread", title: "Scan to Shop",
    sections: [{ properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 700, bottom: 600, left: 1300, right: 1300 },
      borders: { pageBorderTop: side, pageBorderBottom: side, pageBorderLeft: side, pageBorderRight: side } } },
      children: [
        p([new ImageRun({ type: "png", data: fs.readFileSync(LOGO), transformation: { width: 130, height: 130 } })]),
        p([t("Scan to Shop", { size: 100, bold: true })]),
        p([t("take the whole shelf home in your pocket", { font: SCRIPT, size: 34, color: ROSE })], { after: 80 }),
        p([t("\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014   ", { size: 22, color: HONEY }), star(24), t("   \u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014", { size: 22, color: HONEY })], { after: 160 }),
        bigTable,
        p([t("")], { after: 120 }),
        smallTable,
        p([t("@dragonink_and_thread   ", { font: BODY, size: 24, bold: true, color: TEAL }), star(22), t("   dragoninkandthread.com", { font: BODY, size: 24, bold: true, color: TEAL })], { before: 220 }),
      ] }] });
  fs.writeFileSync(path.join(__dirname, "qr-sign.docx"), await Packer.toBuffer(doc));
  console.log("wrote qr-sign.docx");
})().catch((e) => { console.error(e); process.exitCode = 1; });
