// THE FABRIC SWATCH BOOK — ring-bound flip books of every fabric in the library,
// for the market table. Built 2026-09-27, split into TWO BOOKS 2026-09-28.
//
// ⚠️ WHY THIS EXISTS. Three markets produced $144 of sales and two custom leads, and the
// leads are worth several times the sales. The single best custom-selling tool the shop
// owns is the 76-print fabric library — and it was a WEB PAGE, which nobody standing at a
// market table is going to pull up on their phone. Someone picks up a bandana, likes it,
// and asks "have you got anything in blue?". The answer should be an object they can hold
// while you serve the next person.
//
// 📌 GENERATED FROM js/fabrics-data.js — the same single source as fabrics.html. Add a
// fabric there, re-run this, and the book is current. Never hand-edit a card.
//
// ⚠️ TWO BOOKS, NOT ONE (owner, 2026-09-28). Seventy-six cards on a single ring is heavy
// and awkward to hand to someone browsing. Split by collection you can pass over just the
// half that matters — "here's all my florals" — and each book flips properly.
// VOLUMES below keeps every collection whole and lands 37 / 39.
//
// ⚠️ THE COVER IS A CARD, NOT A PAGE. The first version made it a full letter sheet, which
// cannot go on a ring with 3.75in cards. Every card on these sheets is the same size and
// carries the same punch, cover included.
//
// ⚠️ NO PRICES ON IT, DELIBERATELY. The custom price bands already live in EIGHT places
// (CLAUDE.md) and every one has to change together. A printed book a customer keeps would
// be a NINTH, and the hardest to correct later. The covers carry a QR to custom.html
// instead: a link cannot go stale.
//
// 📌 The printed photo IS the swatch. Real fabric snippets glued over the top would be
// better — tactile, true colour — but 76 of them is an afternoon, and a book that gets made
// beats a book that would have been nicer. Every card is numbered within its book so
// snippets can be matched to cards later.
//
//   node build-swatch-book.js               both books, 14 sheets
//   node build-swatch-book.js --covers      JUST the two cover cards, one sheet
//   node build-swatch-book.js --reprint 1,16   just those cards, to replace damaged ones
//
// ⚠️ --reprint NUMBERS BY THE ORIGINAL FLAT ORDER (1-76 straight through fabrics-data.js),
// NOT by the per-book numbering. That is deliberate: it matches the deck cut before the
// 2026-09-28 split into two books, which is the deck that actually exists on the rings. A
// reprint that carried a different number would be worse than no reprint at all.
//
// The --covers run exists for the day the books are already cut and only the covers need
// reprinting. It saves throwing away thirteen sheets of cardstock.
//
// RENDER: .\render.ps1 p-swatch-book   (or p-swatch-covers)
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
const COVERS_ONLY = process.argv.includes("--covers");
const REPRINT = (() => {
  const i = process.argv.indexOf("--reprint");
  if (i === -1) return null;
  const ns = (process.argv[i + 1] || "").split(",").map((x) => Number(x.trim())).filter((x) => x > 0);
  if (!ns.length) throw new Error("--reprint needs card numbers, e.g. --reprint 1,16");
  return ns;
})();

// Collections kept whole. Book One is the soft end — florals, blue-and-white, plains.
// Book Two is everything with a character or a season in it.
const VOLUMES = [
  { title: "Book One", sub: "Flowers and Soft Things",
    groups: ["Florals & Botanicals", "Tea with the Suriel", "Blenders & Textures"] },
  { title: "Book Two", sub: "Stories and Seasons",
    groups: ["Creatures & Curiosities", "The Cup and Cozy", "Once Upon a Woodland",
             "Postcards and Pumpkins", "Ribbons and Evergreen"] },
];

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
const byLabel = new Map(groups.map((g) => [g.label, g]));

// ⚠️ A collection added to fabrics-data.js and not listed in VOLUMES would silently never
// print. Fail loudly instead — a missing swatch is only ever noticed at a market.
const listed = new Set(VOLUMES.flatMap((v) => v.groups));
const orphans = groups.map((g) => g.label).filter((l) => !listed.has(l));
if (orphans.length) throw new Error("collection not assigned to a book in VOLUMES: " + orphans.join(", "));
const unknown = [...listed].filter((l) => !byLabel.has(l));
if (unknown.length) throw new Error("VOLUMES names a collection that does not exist: " + unknown.join(", "));

// The ORIGINAL flat order, kept only so --reprint can match the numbers on the cut deck.
const flat = groups.flatMap((g) => g.items.map((it) => ({ group: g.label, ...it })));

const books = VOLUMES.map((v) => ({
  ...v,
  cards: v.groups.flatMap((l) => byLabel.get(l).items.map((it) => ({ group: l, ...it }))),
}));

const missing = books.flatMap((bk) => bk.cards)
  .filter((c) => !fs.existsSync(path.join(ROOT, "assets", "fabrics", c.file)));
if (missing.length) throw new Error("no photo for: " + missing.map((m) => m.file).join(", "));

const photo = (f) => "file:///" + path.join(ROOT, "assets", "fabrics", f).replace(/\\/g, "/");

const css = [
  ".sheet{position:relative;width:816px;height:1056px;overflow:hidden;background-color:var(--paper);",
  "  background-image:url('" + b.url("paper.png") + "');background-size:320px 300px;background-repeat:repeat;",
  "  padding:48px;break-after:page;page-break-after:always;}",
  ".sheet:last-child{break-after:auto;page-break-after:auto;}",
  ".grid{display:grid;border-left:1px dashed rgba(147,136,88,.75);border-top:1px dashed rgba(147,136,88,.75);}",
  ".cell{position:relative;border-right:1px dashed rgba(147,136,88,.75);",
  "  border-bottom:1px dashed rgba(147,136,88,.75);padding:14px;}",
  ".card{position:relative;height:100%;display:flex;flex-direction:column;}",
  // ⚠️ The punch must clear the cut line by more than its own width or the ring tears out
  // the first time the book is flipped. 34px here = 0.35in of card holding a 1/4in hole.
  ".hole{position:absolute;top:20px;left:20px;width:22px;height:22px;border-radius:50%;",
  "  border:1.5px solid var(--sage);}",
  ".hd{height:46px;display:flex;align-items:center;justify-content:flex-end;gap:8px;}",
  ".grp{font-size:8.5px;font-weight:800;letter-spacing:.11em;text-transform:uppercase;color:var(--sage);}",
  ".no{font-family:var(--display);font-weight:700;font-size:12px;color:var(--rose);}",
  ".sw{flex:1;min-height:0;border:2px solid var(--sage);border-radius:4px;overflow:hidden;}",
  ".sw img{width:100%;height:100%;object-fit:cover;display:block;}",
  ".nm{margin-top:8px;font-family:var(--display);font-weight:700;font-size:19px;line-height:1.1;",
  "  color:var(--ink);text-align:center;min-height:42px;display:flex;align-items:center;justify-content:center;}",
  ".help{position:absolute;left:48px;right:48px;bottom:18px;text-align:center;font-size:10.5px;color:var(--sage);}",
  // --- the cover CARD, same cell, same punch
  ".cv{align-items:center;text-align:center;justify-content:center;padding:4px 8px 6px;}",
  ".cv .w1{font-family:var(--display);font-weight:700;font-size:19px;color:var(--green);letter-spacing:.03em;line-height:1;}",
  ".cv .w2{font-family:var(--display);font-weight:600;font-size:10px;color:var(--green);letter-spacing:.11em;margin-top:2px;}",
  ".cv h2{font-family:var(--display);font-weight:700;font-size:27px;color:var(--wine);line-height:1.05;margin-top:9px;}",
  ".cv .sb{font-family:var(--script);font-size:24px;color:var(--green);line-height:1.15;margin-top:1px;}",
  ".cv .ct{font-size:9px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--sage);margin-top:6px;}",
  ".cv img.qr{width:104px;height:104px;margin-top:8px;border:1.5px solid var(--sage);border-radius:4px;}",
  ".cv .cap{font-size:8px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--wine);margin-top:5px;}",
].join("\n");

const cardCell = (inner) => '<div class="cell"><div class="card"><span class="hole"></span>' + inner + "</div></div>";

const swatch = (c, n) => cardCell(
  '<div class="hd"><span class="grp">' + c.group + '</span><span class="no">' + n + "</span></div>" +
  '<div class="sw"><img src="' + photo(c.file) + '" alt=""></div>' +
  '<div class="nm">' + c.name + "</div>");

const coverCard = (bk, qrSrc) => cardCell(
  '<div class="card cv" style="height:100%">' +
    '<div class="w1">DRAGON</div><div class="w2">INK AND THREAD</div>' +
    "<h2>" + bk.title + "</h2>" +
    '<div class="sb">' + bk.sub + "</div>" +
    '<div class="ct">' + bk.cards.length + " prints</div>" +
    '<img class="qr" src="' + qrSrc + '" alt="">' +
    '<div class="cap">Scan for custom orders</div>' +
  "</div>");

const sheet = (cells, note) => {
  const cols = Math.min(cells.length, 2);
  const rows = Math.ceil(cells.length / 2);
  return '<div class="sheet"><div class="grid" style="width:max-content;' +
    "grid-template-columns:repeat(" + cols + ",360px);grid-template-rows:repeat(" + rows + ',320px)">' +
    cells.join("") + "</div>" +
    '<div class="help">' + note + "</div></div>";
};

const CUT = "Cut on the dashed lines &#183; punch the top-left circle &#183; ";

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
  const qrSrc = "file:///" + qrPath.replace(/\\/g, "/");

  if (REPRINT) {
    const bad = REPRINT.filter((n) => n > flat.length);
    if (bad.length) throw new Error("no card numbered " + bad.join(", ") + " — there are " + flat.length);
    const cells = REPRINT.map((n) => swatch(flat[n - 1], n));
    const body = sheet(cells, CUT + "reprints &#183; numbered as the original deck");
    fs.writeFileSync(path.join(SIGN, "p-swatch-reprint.html"), b.doc("Swatch reprints", css, body));
    REPRINT.forEach((n) => console.log("  " + n + ". " + flat[n - 1].name + "  [" + flat[n - 1].group + "]"));
    console.log("wrote p-swatch-reprint.html — " + REPRINT.length + " card(s) on 1 sheet");
    return;
  }

  if (COVERS_ONLY) {
    const body = sheet(books.map((bk) => coverCard(bk, qrSrc)),
      CUT + "one cover card per ring, in front of card 1");
    fs.writeFileSync(path.join(SIGN, "p-swatch-covers.html"), b.doc("Swatch book covers", css, body));
    console.log("wrote p-swatch-covers.html — 2 cover cards on 1 sheet");
    return;
  }

  let body = "", sheets = 0;
  books.forEach((bk) => {
    const cells = [coverCard(bk, qrSrc)].concat(bk.cards.map((c, i) => swatch(c, i + 1)));
    for (let i = 0; i < cells.length; i += PER_SHEET) {
      body += sheet(cells.slice(i, i + PER_SHEET), CUT + bk.title + " &#183; " + bk.sub);
      sheets++;
    }
    console.log(bk.title + ": " + bk.cards.length + " prints from " + bk.groups.length + " collections");
  });

  fs.writeFileSync(path.join(SIGN, "p-swatch-book.html"), b.doc("Fabric swatch book", css, body));
  console.log("wrote p-swatch-book.html — two books, " + sheets + " sheets");
})().catch((e) => { console.error(e); process.exitCode = 1; });
