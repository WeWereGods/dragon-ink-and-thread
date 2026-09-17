// Gift tags — 9 per page, front (dragon + brand + QR) and a mirrored back (To / From).
// Same 2.5in x 3.33in cell as price-tags.html so one cutting habit covers both sheets.
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const jsQR = require("jsqr");
const { PNG } = require("pngjs");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
const ASSETS = ASSETS;
const DRAGON = ASSETS + "/dragon-logo-transparent.png";
const GINGHAM = ASSETS + "/gingham-pink.png";
// ?s=tag so Cloudflare Web Analytics can tell tag scans apart from every other route in.
const URL = "https://www.dragoninkandthread.com/?s=tag";

(async () => {
  // 1. QR at high error correction, then prove it decodes back to the exact URL.
  const png = await QRCode.toBuffer(URL, {
    errorCorrectionLevel: "H", margin: 1, width: 900,
    color: { dark: "#2b2520", light: "#ffffff" },
  });
  fs.writeFileSync(path.join(SIGN, "qr-tag.png"), png);
  const img = PNG.sync.read(png);
  const hit = jsQR(new Uint8ClampedArray(img.data), img.width, img.height);
  if (!hit || hit.data !== URL) throw new Error("QR check failed: " + (hit ? hit.data : "nothing"));
  console.log("QR decodes correctly to " + URL);

  const qrSrc = "file:///" + path.join(SIGN, "qr-tag.png").replace(/\\/g, "/");

  // 2. Nine cells a page. The back page is mirrored left-to-right so a long-edge
  //    flip on a home printer lands each back on its own front.
  const front =
    '<div class="tag"><div class="inner">' +
      '<span class="hole"></span>' +
      '<img class="dragon" src="file:///' + DRAGON + '" alt="">' +
      '<div class="brand">Dragon Ink and Thread</div>' +
      '<div class="rule"><i></i><b>&#10022;</b><i></i></div>' +
      '<img class="qr" src="' + qrSrc + '" alt="">' +
      '<div class="scan">dragoninkandthread.com</div>' +
    '</div></div>';

  const back =
    '<div class="tag"><div class="inner back">' +
      '<span class="hole"></span>' +
      '<div class="field"><span class="lab">To</span><i></i></div>' +
      '<div class="field"><span class="lab">From</span><i></i></div>' +
      '<div class="field note"><i></i><i></i></div>' +
      '<div class="madeby">handmade in San Antonio</div>' +
    '</div></div>';

  const css = [
    ':root { --teal-deep:#2f6b72; --clay-deep:#a34a6b; --honey:#d7a640; --honey-deep:#b9862a;',
    '  --rose:#e7bcae; --ink:#453a30; --ink-soft:#6a5b4a; --white:#fffdf7;',
    '  --display:"Fraunces",Georgia,serif; --script:"Great Vibes","Segoe Script",cursive; --body:"Nunito","Segoe UI",sans-serif; }',
    '@page { size: letter; margin: 0; }',
    '* { box-sizing:border-box; margin:0; padding:0; -webkit-print-color-adjust:exact; print-color-adjust:exact; }',
    'html, body { width:816px; background:#fff; }',
    'body { font-family:var(--body); color:var(--ink); }',
    '.page { width:816px; height:1056px; padding:48px; position:relative; break-after:page; page-break-after:always; overflow:hidden; }',
    '.page:last-child { break-after:auto; page-break-after:auto; }',
    '.grid { display:grid; grid-template-columns:repeat(3, 240px); grid-template-rows:repeat(3, 320px);',
    '  border-left:1px dashed #cbbfae; border-top:1px dashed #cbbfae; }',
    '.tag { position:relative; border-right:1px dashed #cbbfae; border-bottom:1px dashed #cbbfae; padding:14px; }',
    '.inner { position:relative; height:100%; border:1.5px solid var(--honey); border-radius:14px; background:var(--white);',
    '  display:flex; flex-direction:column; align-items:center; text-align:center; padding:30px 12px 10px; overflow:hidden; }',
    '.inner::before { content:""; position:absolute; left:0; right:0; top:0; height:22px; opacity:.85;',
    '  background:url("file:///' + GINGHAM + '") 0 0/26px 26px; border-bottom:1.5px solid var(--honey); }',
    '.hole { position:absolute; top:34px; left:50%; width:16px; height:16px; margin-left:-8px;',
    '  border-radius:50%; border:1.5px solid #cbbfae; background:#fff; }',
    '.dragon { width:62px; height:auto; margin-top:30px; }',
    '.brand { margin-top:2px; font-family:var(--script); font-size:20px; line-height:1.15; color:var(--honey-deep); }',
    '.rule { margin:5px 0 6px; display:flex; align-items:center; gap:8px; width:120px; }',
    '.rule i { flex:1; height:1.5px; background:linear-gradient(90deg, transparent, var(--honey), transparent); }',
    '.rule b { color:var(--honey); font-size:11px; line-height:1; }',
    '.qr { width:92px; height:92px; display:block; }',
    '.scan { margin-top:5px; font-size:8.5px; font-weight:800; letter-spacing:.6px;',
    '  text-transform:uppercase; color:var(--ink-soft); line-height:1.3; }',
    /* back */
    '.back { justify-content:flex-start; padding:46px 20px 12px; }',
    '.field { width:100%; display:flex; align-items:flex-end; gap:7px; margin-top:16px; }',
    '.field .lab { font-family:var(--display); font-weight:600; font-size:17px; color:var(--teal-deep); line-height:1; }',
    '.field i { flex:1; border-bottom:1.5px solid #cbbfae; height:20px; }',
    '.field.note { flex-direction:column; align-items:stretch; gap:16px; margin-top:22px; }',
    '.field.note i { flex:none; width:100%; }',
    '.madeby { margin-top:auto; font-size:8.5px; font-weight:800; letter-spacing:1px;',
    '  text-transform:uppercase; color:var(--ink-soft); }',
    '.helper { position:absolute; left:48px; right:48px; bottom:18px; text-align:center; font-size:11px; color:#9a8c7a; }',
  ].join("\n");

  // All nine backs are identical, so a long-edge flip lands correctly with no mirroring.
  // If tags ever stop being identical (numbering, per-item text), each ROW must be reversed
  // left-to-right here or every back will land on the wrong front.
  const backs = new Array(9).fill(back);

  const html = [
    '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Gift tags</title>',
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700&family=Great+Vibes&family=Nunito:wght@700;800&display=swap" rel="stylesheet">',
    '<style>' + css + '</style></head><body>',
    '<div class="page"><div class="grid">' + new Array(9).fill(front).join("") + '</div>',
    '<div class="helper">Front &#183; cut on the dashed lines &#183; punch the circle &#183; tie on with twine</div></div>',
    '<div class="page"><div class="grid">' + backs.join("") + '</div>',
    '<div class="helper">Back &#183; print on the reverse, flipping on the LONG edge</div></div>',
    '</body></html>',
  ].join("\n");

  fs.writeFileSync(path.join(SIGN, "gift-tags.html"), html);
  console.log("wrote gift-tags.html");
})().catch((e) => { console.error(e); process.exitCode = 1; });
