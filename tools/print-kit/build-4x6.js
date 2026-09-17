// Price list and Scan to Pay as TRUE 4 x 6 cards, for an acrylic table holder.
//
// 4in x 6in at 96dpi = 384 x 576 CSS px.
//
// ⚠️ The corner sprays and the paper tile MUST be scaled by the SAME factor. On the
// letter sheets a native-size corner against a stretched background showed a visible
// rectangle; here everything is scaled 0.48, so the grain still matches edge to edge.
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const jsQR = require("jsqr");
const { PNG } = require("pngjs");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
const KIT = path.join(SIGN, "kit").replace(/\\/g, "/");
const url = (f) => "file:///" + KIT + "/" + f;

const W = 384, H = 576;
const S = 0.48;                       // one scale factor for every kit asset
const CORNER = Math.round(250 * S);   // 120
const TILE_W = Math.round(320 * S);   // 154
const TILE_H = Math.round(300 * S);   // 144

const FONTS =
  '<link rel="preconnect" href="https://fonts.googleapis.com">' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Nunito:wght@600;700;800&display=swap" rel="stylesheet">';

const base = [
  ":root{--paper:#f0ddbc;--green:#4e5839;--sage:#938858;--wine:#7b322c;--rose:#9e5e58;--ink:#3b3327;",
  "  --display:'Cormorant Garamond',Georgia,serif;--script:'Great Vibes','Segoe Script',cursive;--body:'Nunito','Segoe UI',sans-serif;}",
  "@page{size:4in 6in;margin:0;}",
  "*{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}",
  "html,body{width:" + W + "px;background:#fff;}",
  "body{font-family:var(--body);color:var(--ink);}",
  ".card{position:relative;width:" + W + "px;height:" + H + "px;overflow:hidden;background-color:var(--paper);",
  "  background-image:url('" + url("paper.png") + "');background-size:" + TILE_W + "px " + TILE_H + "px;background-repeat:repeat;}",
  ".c{position:absolute;width:" + CORNER + "px;height:" + CORNER + "px;background-size:" + CORNER + "px " + CORNER + "px;}",
  ".c.tl{left:0;top:0;background-image:url('" + url("corner-tl.png") + "');}",
  ".c.tr{right:0;top:0;background-image:url('" + url("corner-tr.png") + "');}",
  // Bottom sprays are deliberately SMALLER than the top pair. At 4x6 the footer has to
  // live in the bottom band, and a full-size spray there leaves only 144px of clear
  // width - too narrow for a handle and a domain. Smaller corners buy 224px.
  ".c.bl,.c.br{width:84px;height:84px;background-size:84px 84px;}",
  ".c.bl{left:0;bottom:0;background-image:url('" + url("corner-bl.png") + "');background-position:right top;}",
  ".c.br{right:0;bottom:0;background-image:url('" + url("corner-br.png") + "');background-position:left top;}",
  ".ctr{position:absolute;left:26px;right:26px;text-align:center;}",
  ".w1{font-family:var(--display);font-weight:700;color:var(--green);letter-spacing:.02em;line-height:1;font-size:31px;}",
  ".w2{font-family:var(--display);font-weight:600;color:var(--green);letter-spacing:.07em;line-height:1;font-size:15px;margin-top:2px;}",
  ".rule{display:flex;align-items:center;justify-content:center;gap:9px;}",
  ".rule i{height:1.2px;background:linear-gradient(90deg,transparent,var(--sage),transparent);flex:1;max-width:80px;}",
  ".rule b{color:var(--wine);font-size:10px;line-height:1;}",
  ".foot{font-family:var(--body);font-weight:800;letter-spacing:.05em;color:var(--green);text-transform:uppercase;font-size:8px;line-height:1.5;}",
].join("\n");

const mark = '<div class="w1">DRAGON</div><div class="w2">INK AND THREAD</div>';
const corners = '<span class="c tl"></span><span class="c tr"></span><span class="c bl"></span><span class="c br"></span>';

function doc(title, css, body) {
  return ['<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>' + title + "</title>",
    FONTS, "<style>" + base + "\n" + css + "</style></head><body>", body, "</body></html>"].join("\n");
}

// ---------- Price list ----------
const ITEMS = [
  { name: "Bows", price: 12, deal: null },
  { name: "Scrunchies", price: 6, deal: "3 for $15" },
  { name: "Pet Bandanas", price: 18, deal: "Patchwork $22" },
  { name: "Hair Whimsys", price: 5, deal: "New!" },
];

const priceCss = [
  ".head{top:54px;left:74px;right:74px;}",
  ".ruleA{top:118px;}",
  ".items{position:absolute;left:52px;right:52px;top:150px;}",
  ".it{padding:11px 0 10px;border-bottom:1.2px dashed rgba(147,136,88,.6);}",
  ".it:last-child{border-bottom:0;}",
  ".ln{display:flex;align-items:baseline;gap:8px;}",
  ".nm{font-family:var(--display);font-weight:600;font-size:26px;line-height:1;color:var(--green);white-space:nowrap;}",
  ".dot{flex:1;border-bottom:2px dotted rgba(59,51,39,.3);transform:translateY(-6px);}",
  ".pr{font-family:var(--display);font-weight:700;font-size:31px;line-height:1;color:var(--wine);white-space:nowrap;}",
  ".pr sup{font-size:17px;vertical-align:top;position:relative;top:4px;margin-right:1px;}",
  ".deal{display:inline-block;margin-top:4px;font-weight:800;font-size:9px;color:var(--wine);",
  "  border:1.1px solid var(--rose);border-radius:999px;padding:1px 8px;}",
  // Everything below must clear the 84px bottom sprays, so the pill sits ABOVE them and
  // the footer splits into two short lines narrow enough to pass between them.
  ".ruleB{top:436px;}",
  ".pay{top:458px;}",
  ".pay span{display:inline-block;font-weight:800;font-size:10px;letter-spacing:.04em;color:var(--green);",
  "  border:1.2px solid var(--sage);border-radius:999px;padding:3px 12px;}",
  ".ask{top:492px;left:50px;right:50px;font-family:var(--display);font-style:italic;font-size:11px;color:var(--ink);}",
  ".ft{top:524px;left:92px;right:92px;}",
].join("\n");

const items = ITEMS.map((i) =>
  '<div class="it"><div class="ln"><span class="nm">' + i.name + '</span><span class="dot"></span>' +
  '<span class="pr"><sup>$</sup>' + i.price + "</span></div>" +
  (i.deal ? '<span class="deal">' + i.deal + "</span>" : "") + "</div>"
).join("");

const priceBody = '<div class="card">' + corners +
  '<div class="ctr head">' + mark + "</div>" +
  '<div class="ctr ruleA"><span class="rule"><i></i><b>&#10084;</b><i></i></span></div>' +
  '<div class="items">' + items + "</div>" +
  '<div class="ctr ruleB"><span class="rule"><i></i><b>&#10022;</b><i></i></span></div>' +
  '<div class="ctr pay"><span>Cash &amp; card &#183; tax included</span></div>' +
  '<div class="ctr ask">Want it in another fabric? Just ask.</div>' +
  '<div class="ctr foot ft">@dragonink_and_thread<br>dragoninkandthread.com</div>' +
  "</div>";

// ---------- Scan to Pay ----------
const CODES = [
  { key: "s-pay-scrunchie", url: "https://buy.stripe.com/8x2eVddpM76F6lcgBPfjG0v", name: "Scrunchie", price: "$6" },
  { key: "s-pay-bow", url: "https://buy.stripe.com/4gMbJ1bhEaiR24WgBPfjG0w", name: "Bow", price: "$12" },
  { key: "s-pay-bandana", url: "https://buy.stripe.com/fZu3cvadAgHf6lcgBPfjG0u", name: "Pet Bandana", price: "$18" },
];

const QR = 104; // px on the card = 1.08in. Verified by decode from the render, not assumed.

const payCss = [
  ".head{top:44px;left:74px;right:74px;}",
  ".ruleA{top:108px;}",
  ".row{position:absolute;left:44px;right:44px;display:flex;align-items:center;gap:13px;}",
  ".row img{width:" + QR + "px;height:" + QR + "px;display:block;flex:none;border:1.2px solid var(--sage);}",
  ".t{flex:1;text-align:left;}",
  ".nm{font-family:var(--display);font-weight:600;font-size:23px;line-height:1;color:var(--green);}",
  ".pr{font-family:var(--display);font-weight:700;font-size:27px;line-height:1.05;color:var(--wine);margin-top:1px;}",
  ".sb{font-family:var(--script);font-size:15px;line-height:1;color:var(--rose);margin-top:3px;}",
  // f1 sits ABOVE the 84px bottom sprays so it can run full width; f2 and f3 fall inside
  // that band, so both are narrowed to pass between them and f3 splits onto two lines.
  ".f1{top:476px;font-size:8px;}",
  ".f2{top:500px;left:88px;right:88px;font-family:var(--display);font-style:italic;font-size:11px;color:var(--ink);text-transform:none;letter-spacing:0;}",
  ".f3{top:526px;left:92px;right:92px;}",
].join("\n");

(async () => {
  for (const c of CODES) {
    c.png = await QRCode.toBuffer(c.url, {
      errorCorrectionLevel: "H", margin: 1, width: 900,
      color: { dark: "#3b3327", light: "#f0ddbc" },
    });
    const file = path.join(SIGN, "qr-" + c.key + ".png");
    fs.writeFileSync(file, c.png);
    const img = PNG.sync.read(c.png);
    const hit = jsQR(new Uint8ClampedArray(img.data), img.width, img.height);
    if (!hit || hit.data !== c.url) throw new Error("QR " + c.key + " failed");
    console.log("QR " + c.key + " ok");
    c.src = "file:///" + file.replace(/\\/g, "/");
  }

  const rows = CODES.map((c, i) =>
    '<div class="row" style="top:' + (126 + i * 118) + 'px"><img src="' + c.src + '" alt="">' +
    '<div class="t"><div class="nm">' + c.name + '</div><div class="pr">' + c.price + "</div>" +
    '<div class="sb">scan, choose, pay</div></div></div>'
  ).join("");

  const payBody = '<div class="card">' + corners +
    '<div class="ctr head">' + mark + "</div>" +
    '<div class="ctr ruleA"><span class="rule"><i></i><b>&#10084;</b><i></i></span></div>' +
    rows +
    '<div class="ctr foot f1">Prices include sales tax &#183; one kind of item per scan</div>' +
    '<div class="ctr f2">Anything else? Pay at the table.</div>' +
    '<div class="ctr foot f3">@dragonink_and_thread<br>dragoninkandthread.com</div>' +
    "</div>";

  fs.writeFileSync(path.join(SIGN, "s-price.html"), doc("Price list 4x6", priceCss, priceBody));
  fs.writeFileSync(path.join(SIGN, "s-pay.html"), doc("Scan to Pay 4x6", payCss, payBody));
  console.log("wrote s-price.html and s-pay.html (" + W + "x" + H + ")");
})().catch((e) => { console.error(e); process.exitCode = 1; });
