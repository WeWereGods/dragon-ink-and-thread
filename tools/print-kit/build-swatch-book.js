// THE FABRIC SWATCH BOOK — a ring-bound flip book of every fabric in the library,
// for the market table. Built 2026-09-27.
//
// ⚠️ WHY THIS EXISTS. Three markets produced $144 of sales and two custom leads, and the
// leads are worth several times the sales. The single best custom-selling tool the shop
// owns is the 71-plus fabric library — and it is a WEB PAGE, which nobody standing at a
// market table is going to pull up on their phone. Someone picks up a bandana, likes it,
// and asks "have you got anything in blue?". Right now the answer is a URL. It should be
// an object they can hold while you serve the next person.
//
// 📌 GENERATED FROM js/fabrics-data.js — the same single source as fabrics.html. Add a
// fabric there, re-run this, and the book is current. Never hand-edit a card.
//
// ⚠️ NO PRICES ON IT, DELIBERATELY. The custom price bands already live in EIGHT places
// (CLAUDE.md) and every one of them has to be changed together. A printed book that a
// customer keeps in their hands would be a NINTH, and the one hardest to correct later.
// The cover carries a QR to custom.html instead: a link cannot go stale.
//
// 📌 The printed photo IS the swatch. Real fabric snippets glued over the top would be
// better still — tactile, true colour — but 76 of them is an afternoon of cutting, and a
// book that gets made beats a book that would have been nicer. Each card is numbered so
// snippets can be matched to cards later if she ever wants to.
//
// RENDER: .\render.ps1 p-swatch-book   (letter, multi-page — expect 14 pages)
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const jsQR = require("jsqr");
const { PNG } = require("pngjs");
const b = require("./paper-base");

const ROOT = path.join(__dirname, "..", "..");
const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });

const CUSTOM_URL = "https://www.dragoninkandthread.com/custom.html";
const PER_SHEET = 6;                       // 2 across, 3 down

// --- load the library the same way a browser would, with a stubbed window
function loadFabrics() {
  const src = fs.readFileSync(path.join(ROOT, "js", "fabrics-data.js"), "utf8");
  const win = {};
  new Function("window", src)(win);
  if (!win.DIT_FABRICS || !Array.isArray(win.DIT_FABRICS.GROUPS)) {
    throw new Error("fabrics-data.js did not set window.DIT_FABRICS.GROUPS");
  }
  return win.DIT_FABRICS.GROUPS;
}

const groups = loadFabrics();
const cards = [];
groups.forEach((g) => g.items.forEach((it) => cards.push({ group: g.label, ...it })));

// A missing photo would print a blank card and nobody would notice until the market.
const missing = cards.filter((c) => !fs.existsSync(path.join(ROOT, "assets", "fabrics", c.file)));
if (missing.length) throw new Error("no photo for: " + missing.map((m) => m.file).join(", "));

const photo = (f) =>
  "file:///" + path.join(ROOT, "assets", "fabrics", f).replace(/\\/g, "/");

const css = [
  ".sheet{position:relative;width:816px;height:1056px;overflow:hidden;background-color:var(--paper);",
  "  background-image:url('" + b.url("paper.png") + "');background-size:320px 300px;background-repeat:repeat;",
  "  padding:48px;break-after:page;page-break-after:always;}",
  ".sheet:last-child{break-after:auto;page-break-after:auto;}",
  ".grid{display:grid;grid-template-columns:repeat(2,360px);grid-template-rows:repeat(3,320px);",
  "  border-left:1px dashed rgba(147,136,88,.75);border-top:1px dashed rgba(147,136,88,.75);}",
  ".cell{position:relative;border-right:1px dashed rgba(147,136,88,.75);",
  "  border-bottom:1px dashed rgba(147,136,88,.75);padding:14px;}",
  ".card{position:relative;height:100%;display:flex;flex-direction:column;}",
  // The punch mark sits top-left on every card so the book hangs square on one ring.
  // ⚠️ IT MUST CLEAR THE CUT LINE BY MORE THAN THE HOLE IS WIDE, or the ring tears straight
  // out the first time the book is flipped. First pass had it 16px (0.17in) in; a quarter-inch
  // punch would have left barely a sixteenth of card holding it. Now 34px (0.35in) from the cut.
  ".hole{position:absolute;top:20px;left:20px;width:22px;height:22px;border-radius:50%;",
  "  border:1.5px solid var(--sage);}",
  // Header is tall enough to hold the punch mark clear of the photo.
  ".hd{height:46px;display:flex;align-items:center;justify-content:flex-end;gap:8px;}",
  ".grp{font-size:8.5px;font-weight:800;letter-spacing:.11em;text-transform:uppercase;color:var(--sage);}",
  ".no{font-family:var(--display);font-weight:700;font-size:12px;color:var(--rose);}",
  ".sw{flex:1;min-height:0;border:2px solid var(--sage);border-radius:4px;overflow:hidden;}",
  ".sw img{width:100%;height:100%;object-fit:cover;display:block;}",
  ".nm{margin-top:8px;font-family:var(--display);font-weight:700;font-size:19px;line-height:1.1;",
  "  color:var(--ink);text-align:center;min-height:42px;display:flex;align-items:center;justify-content:center;}",
  ".help{position:absolute;left:48px;right:48px;bottom:18px;text-align:center;font-size:10.5px;color:var(--sage);}",
  // --- cover
  ".cover{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;}",
  ".cover .eb{font-family:var(--script);font-size:40px;color:var(--wine);line-height:1;margin-bottom:6px;}",
  ".cover h1{font-family:var(--display);font-weight:700;font-size:56px;color:var(--green);line-height:1.05;margin-top:18px;}",
  ".cover .sub{font-family:var(--display);font-style:italic;font-size:23px;color:var(--wine);margin-top:8px;}",
  ".cover .qr{width:196px;height:196px;margin-top:26px;border:2px solid var(--sage);border-radius:6px;}",
  ".cover .cap{font-size:12px;font-weight:800;letter-spacing:.11em;text-transform:uppercase;color:var(--sage);margin-top:10px;}",
  ".cover .ft{font-size:13px;color:var(--ink);margin-top:22px;font-family:var(--display);font-style:italic;}",
].join("\n");

const card = (c, n) =>
  '<div class="cell"><div class="card"><span class="hole"></span>' +
    '<div class="hd"><span class="grp">' + c.group + '</span><span class="no">' + n + "</span></div>" +
    '<div class="sw"><img src="' + photo(c.file) + '" alt=""></div>' +
    '<div class="nm">' + c.name + "</div>" +
  "</div></div>";

(async () => {
  const png = await QRCode.toBuffer(CUSTOM_URL, {
    errorCorrectionLevel: "H", margin: 1, width: 900,
    color: { dark: "#3b3327", light: "#f0ddbc" },
  });
  const qrPath = path.join(SIGN, "qr-swatch-custom.png");
  fs.writeFileSync(qrPath, png);
  const img = PNG.sync.read(png);
  const hit = jsQR(new Uint8ClampedArray(img.data), img.width, img.height);
  if (!hit || hit.data !== CUSTOM_URL) throw new Error("swatch cover QR failed to decode");
  console.log("cover QR decodes to " + CUSTOM_URL);

  const cover =
    '<div class="sheet"><div class="cover">' +
      '<div class="eb">every print I have</div>' +
      b.wordmark(34, 15) +
      "<h1>The Fabric<br>Library</h1>" +
      '<div class="sub">' + cards.length + " prints &#183; " + groups.length + " collections</div>" +
      '<img class="qr" src="file:///' + qrPath.replace(/\\/g, "/") + '" alt="">' +
      '<div class="cap">Scan to start a custom order</div>' +
      '<div class="ft">Seen something you like? Point at it and tell me<br>what you want made. That is the whole process.</div>' +
    "</div></div>";

  let body = cover, n = 0;
  for (let i = 0; i < cards.length; i += PER_SHEET) {
    const slice = cards.slice(i, i + PER_SHEET);
    const rows = Math.ceil(slice.length / 2);
    body += '<div class="sheet"><div class="grid" style="width:max-content;' +
      "grid-template-columns:repeat(" + Math.min(slice.length, 2) + ",360px);" +
      "grid-template-rows:repeat(" + rows + ',320px)">' +
      slice.map((c) => card(c, ++n)).join("") + "</div>" +
      '<div class="help">Cut on the dashed lines &#183; punch the top-left circle &#183; one ring, in order</div></div>';
  }

  fs.writeFileSync(path.join(SIGN, "p-swatch-book.html"), b.doc("Fabric swatch book", css, body));
  console.log("wrote p-swatch-book.html — " + cards.length + " cards over " +
    (1 + Math.ceil(cards.length / PER_SHEET)) + " pages");
})().catch((e) => { console.error(e); process.exitCode = 1; });
