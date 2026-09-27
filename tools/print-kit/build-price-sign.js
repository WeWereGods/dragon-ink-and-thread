// Booth price list on the parchment base. Content matches the existing sign so the
// prices stay in step with the old kit; only the skin changes.
const fs = require("fs");
const path = require("path");
const base = require("./paper-base");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
// Updated 2026-09-21 for the Sep 26 market. Bookmarks taken off 2026-09-21 until sewn.
//
// ⚠️ REBUILT 2026-09-27 FOR LEGIBILITY AT DISTANCE. The Sep 27 table photo showed the
// problem plainly: not one price on the table could be read from six feet. Prices went
// 40px -> 70px, names 33px -> 40px.
//
// ⚠️ THE DESCRIPTIONS WERE CUT TO PAY FOR IT, and that was the whole trade. "Soft prints
// and lace" is lovely and nobody reads it from the aisle; a price they cannot read stops
// them walking over at all. One line per item now: name, deal, price. If charm is ever
// wanted back, it belongs on the TENT CARDS, which are read at arm's length.
//
// MUG RUGS ADDED — seven of them exist as of 2026-09-26 and the sign predated all but one.
const ITEMS = [
  { name: "Hair Whimsys", price: 5, deal: "New!" },
  { name: "Scrunchies", price: 6, deal: "3 for $15" },
  { name: "Sachets", price: 6, deal: "2 for $10" },
  { name: "Gift Card Holders", price: 10, deal: "New!" },
  { name: "Bows", price: 12, deal: "2 for $20" },
  { name: "Mug Rugs", price: 12, deal: "2 for $20" },
  { name: "Pet Bandanas", price: 18, deal: "Patchwork $22" },
];

const css = [
  ".head{top:92px;left:200px;right:200px;}",
  ".sub{top:204px;}",
  ".ruleA{top:246px;}",
  // Inset pulled in from 118 to 96: the 70px price needs the width back.
  ".items{position:absolute;left:96px;right:96px;top:258px;}",
  ".item{padding:8px 0;border-bottom:1.5px dashed rgba(147,136,88,.6);}",
  ".item:last-child{border-bottom:0;}",
  ".line{display:flex;align-items:baseline;gap:13px;}",
  ".nm{font-family:var(--display);font-weight:600;font-size:40px;line-height:1;white-space:nowrap;color:var(--green);}",
  ".dots{flex:1;border-bottom:3px dotted rgba(59,51,39,.32);transform:translateY(-14px);}",
  // 70px is about 0.73in of numeral on letter - readable across an aisle, roughly ten
  // feet. 40px was readable from about four, i.e. only once they had already stopped,
  // which is too late to be the thing that makes them stop.
  ".pr{font-family:var(--display);font-weight:700;font-size:70px;line-height:1;color:var(--wine);white-space:nowrap;}",
  ".pr sup{font-size:38px;vertical-align:top;position:relative;top:12px;margin-right:3px;}",
  ".deal{display:inline-block;font-weight:800;font-size:17px;color:var(--wine);border:2px solid var(--rose);",
  "  border-radius:999px;padding:3px 13px;position:relative;top:-8px;white-space:nowrap;}",
  ".ruleB{top:884px;}",
  ".pay{top:908px;}",
  ".pay span{display:inline-block;font-weight:800;font-size:19px;letter-spacing:.06em;color:var(--green);border:1.5px solid var(--sage);border-radius:999px;padding:5px 20px;}",
  ".ask{top:952px;left:190px;right:190px;font-family:var(--display);font-style:italic;font-size:21px;color:var(--ink);}",
  ".foot{top:988px;left:210px;right:210px;font-size:14px;line-height:1.5;}",
].join("\n");

const items = ITEMS.map((i) =>
  '<div class="item"><div class="line"><span class="nm">' + i.name + "</span>" +
  (i.deal ? '<span class="deal">' + i.deal + "</span>" : "") +
  '<span class="dots"></span>' +
  '<span class="pr"><sup>$</sup>' + i.price + "</span></div></div>"
).join("");

const body = base.page(
  '<div class="center head">' + base.wordmark(52, 28) + "</div>" +
  '<div class="center sub"><span class="script" style="font-size:34px">every piece handmade in San Antonio</span></div>' +
  '<div class="center ruleA"><span class="rule"><i></i><b>&#10084;</b><i></i></span></div>' +
  '<div class="items">' + items + "</div>" +
  '<div class="center ruleB"><span class="rule"><i></i><b>&#10022;</b><i></i></span></div>' +
  '<div class="center pay"><span>Cash &amp; card welcome &#183; tax included</span></div>' +
  '<div class="center ask">Want it in another fabric? Ask about custom orders.</div>' +
  '<div class="center foot">@dragonink_and_thread &#183; dragoninkandthread.com</div>'
);

fs.writeFileSync(path.join(SIGN, "p-price-sign.html"), base.doc("Price List", css, body));
console.log("wrote p-price-sign.html");
