// Price tags AND gift tags on the parchment base, 9 per sheet at 2.5 x 3.33in -
// the same cell size as the existing kit so one cutting habit covers everything.
//
// The corner sprays are 250px and the tag cells are 240x320, so a full-page spray
// would sit UNDER the grid. These sheets therefore use the plain paper background
// only, with a sprig-free border, and keep the ornament for the big signs.
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const jsQR = require("jsqr");
const { PNG } = require("pngjs");
const b = require("./paper-base");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
const GIFT_URL = "https://www.dragoninkandthread.com/?s=tag";
const ONE = "one of a kind";

const PRICE_TAGS = [
  { name: "The Storykeeper", price: 32, pill: "Tote", note: ONE },
  { name: "Strawberry Tote", price: 35, pill: "Tote", note: ONE },
  { name: "Butterfly Tote", price: 38, pill: "Tote", note: ONE },
  { name: "Cottage Rose Tote", price: 20, pill: "Tote", note: ONE },
  { name: "Blue Rose Mini Tote", price: 20, pill: "Tote", note: ONE },
  { name: "Reading Nook Sleeve", price: 28, pill: "Book sleeve", note: ONE },
  { name: "The Suriel Tea Cover", price: 35, pill: "Home", note: ONE },
  { name: "Tea with the Suriel", price: 55, pill: "Set of five bows", note: ONE },
  { name: "Game Day Darling Headband", price: 14, pill: "Headband", note: "handmade in San Antonio" },
];

// Added 2026-09-18, the night before the first market. Printed on their own sheet so the
// original sheet (already cut and tied) never needs reprinting. One of each - there is one
// of each tote, so they are one of a kind like the rest.
const EXTRA_TAGS = [
  { name: "Fairy Tote", price: 25, pill: "Unlined", note: ONE },
  { name: "Fairy Tote", price: 40, pill: "Lined · with pocket", note: ONE },
];

const css = [
  // Native tiling, same reason as paper-base: a stretched patch smears the grain and
  // shows a seam wherever it meets anything at native scale.
  ".sheet{position:relative;width:816px;height:1056px;overflow:hidden;background-color:var(--paper);",
  "  background-image:url('" + b.url("paper.png") + "');background-size:320px 300px;background-repeat:repeat;",
  "  padding:48px;break-after:page;page-break-after:always;}",
  ".sheet:last-child{break-after:auto;page-break-after:auto;}",
  ".grid{display:grid;grid-template-columns:repeat(3,240px);grid-template-rows:repeat(3,320px);",
  "  border-left:1px dashed rgba(147,136,88,.75);border-top:1px dashed rgba(147,136,88,.75);}",
  ".cell{position:relative;border-right:1px dashed rgba(147,136,88,.75);border-bottom:1px dashed rgba(147,136,88,.75);padding:13px;}",
  ".card{position:relative;height:100%;border:1.5px solid var(--sage);display:flex;flex-direction:column;",
  "  align-items:center;text-align:center;padding:30px 12px 11px;overflow:hidden;}",
  ".hole{position:absolute;top:13px;left:50%;width:15px;height:15px;margin-left:-7.5px;border-radius:50%;border:1.5px solid var(--sage);}",
  ".w1{font-family:var(--display);font-weight:700;font-size:17px;line-height:1;color:var(--green);letter-spacing:.03em;margin-top:14px;}",
  ".w2{font-family:var(--display);font-weight:600;font-size:11px;line-height:1;color:var(--green);letter-spacing:.09em;margin-top:2px;}",
  ".nm{margin-top:11px;font-family:var(--display);font-weight:600;font-size:21px;line-height:1.1;color:var(--ink);",
  "  min-height:48px;display:flex;align-items:center;}",
  ".nm.long{font-size:18px;}",
  ".pr{font-family:var(--display);font-weight:700;font-size:48px;line-height:1;color:var(--wine);}",
  ".pr sup{font-size:24px;vertical-align:top;position:relative;top:5px;}",
  ".pill{display:inline-block;margin-top:7px;font-size:10px;font-weight:800;letter-spacing:.04em;color:var(--wine);",
  "  border:1.2px solid var(--rose);border-radius:999px;padding:1px 9px;}",
  ".nt{margin-top:auto;font-size:9px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--sage);}",
  ".bl{width:150px;border-bottom:1.5px solid var(--sage);height:26px;}",
  ".blp{font-family:var(--display);font-weight:700;font-size:38px;color:var(--wine);}",
  ".blp span{display:inline-block;width:88px;border-bottom:1.5px solid var(--sage);height:32px;vertical-align:-4px;}",
  ".qr{width:88px;height:88px;display:block;margin-top:5px;}",
  ".dom{margin-top:5px;font-size:8.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--sage);}",
  ".fld{width:100%;display:flex;align-items:flex-end;gap:7px;margin-top:15px;}",
  ".fld .lb{font-family:var(--display);font-weight:600;font-size:16px;color:var(--green);line-height:1;}",
  ".fld i{flex:1;border-bottom:1.5px solid var(--sage);height:19px;}",
  ".note2{flex-direction:column;align-items:stretch;gap:15px;margin-top:20px;}",
  ".note2 i{flex:none;width:100%;}",
  ".back{justify-content:flex-start;padding:44px 19px 11px;}",
  ".help{position:absolute;left:48px;right:48px;bottom:17px;text-align:center;font-size:11px;color:var(--sage);}",
].join("\n");

const mark = '<div class="w1">DRAGON</div><div class="w2">INK AND THREAD</div>';

function priceCard(t) {
  let inner = '<span class="hole"></span>' + mark;
  if (t.blank) {
    inner += '<div class="nm"><div class="bl"></div></div><div class="blp">$<span></span></div>' +
      '<div class="nt">handmade in San Antonio</div>';
  } else {
    inner += '<div class="nm' + (t.name.length > 20 ? " long" : "") + '">' + t.name + "</div>" +
      '<div class="pr"><sup>$</sup>' + t.price + "</div>" +
      '<span class="pill">' + t.pill + "</span><div class=\"nt\">" + t.note + "</div>";
  }
  return '<div class="cell"><div class="card">' + inner + "</div></div>";
}

(async () => {
  const png = await QRCode.toBuffer(GIFT_URL, {
    errorCorrectionLevel: "H", margin: 1, width: 900,
    color: { dark: "#3b3327", light: "#f0ddbc" },
  });
  fs.writeFileSync(path.join(SIGN, "qr-p-gift.png"), png);
  const img = PNG.sync.read(png);
  const hit = jsQR(new Uint8ClampedArray(img.data), img.width, img.height);
  if (!hit || hit.data !== GIFT_URL) throw new Error("gift QR failed");
  console.log("gift QR decodes to " + GIFT_URL);
  const qrSrc = "file:///" + path.join(SIGN, "qr-p-gift.png").replace(/\\/g, "/");

  // --- price tags: 9 named + a page of blanks
  const blanks = new Array(9).fill({ blank: true });
  const priceBody =
    '<div class="sheet"><div class="grid">' + PRICE_TAGS.map(priceCard).join("") + "</div>" +
    '<div class="help">Cut on the dashed lines &#183; punch the circle &#183; tie on with twine</div></div>' +
    '<div class="sheet"><div class="grid">' + blanks.map(priceCard).join("") + "</div>" +
    '<div class="help">Blank tags: write in the name and price for new pieces</div></div>';
  fs.writeFileSync(path.join(SIGN, "p-price-tags.html"), b.doc("Price tags", css, priceBody));
  console.log("wrote p-price-tags.html");

  // Grid sized to the tags, so a short sheet doesn't print cut lines round empty cells.
  const extraBody = '<div class="sheet"><div class="grid" style="width:max-content;' +
    "grid-template-columns:repeat(" + Math.min(EXTRA_TAGS.length, 3) + ",240px);" +
    "grid-template-rows:repeat(" + Math.ceil(EXTRA_TAGS.length / 3) + ',320px)">' + EXTRA_TAGS.map(priceCard).join("") + "</div>" +
    '<div class="help">Cut on the dashed lines &#183; punch the circle &#183; tie on with twine</div></div>';
  fs.writeFileSync(path.join(SIGN, "p-price-tags-fairy.html"), b.doc("Fairy tote tags", css, extraBody));
  console.log("wrote p-price-tags-fairy.html");

  // --- gift tags: front (mark + QR) and back (To / From)
  const giftFront = '<div class="cell"><div class="card"><span class="hole"></span>' + mark +
    '<div style="height:6px"></div><img class="qr" src="' + qrSrc + '" alt="">' +
    '<div class="dom">dragoninkandthread.com</div>' +
    '<div class="nt">handmade in San Antonio</div></div></div>';
  const giftBack = '<div class="cell"><div class="card back"><span class="hole"></span>' +
    '<div class="fld"><span class="lb">To</span><i></i></div>' +
    '<div class="fld"><span class="lb">From</span><i></i></div>' +
    '<div class="fld note2"><i></i><i></i></div>' +
    '<div class="nt">handmade in San Antonio</div></div></div>';
  const giftBody =
    '<div class="sheet"><div class="grid">' + new Array(9).fill(giftFront).join("") + "</div>" +
    '<div class="help">Front &#183; cut on the dashed lines &#183; punch the circle &#183; tie on with twine</div></div>' +
    '<div class="sheet"><div class="grid">' + new Array(9).fill(giftBack).join("") + "</div>" +
    '<div class="help">Back &#183; print on the reverse, flipping on the LONG edge</div></div>';
  fs.writeFileSync(path.join(SIGN, "p-gift-tags.html"), b.doc("Gift tags", css, giftBody));
  console.log("wrote p-gift-tags.html");
})().catch((e) => { console.error(e); process.exitCode = 1; });
