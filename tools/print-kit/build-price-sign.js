// Booth price list on the parchment base. Content matches the existing sign so the
// prices stay in step with the old kit; only the skin changes.
const fs = require("fs");
const path = require("path");
const base = require("./paper-base");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
// Updated 2026-09-21 for the Sep 26 market: seven lines, so type is smaller than the
// original four-line sign. Bookmarks taken off 2026-09-21 until they are sewn.
const ITEMS = [
  { name: "Bows", price: 12, desc: "Sailor bows on a clip" },
  { name: "Scrunchies", price: 6, desc: "Soft prints and lace", deal: "2 for $10 · 3 for $15" },
  { name: "Sachets", price: 6, desc: "Lavender or cinnamon", deal: "2 for $10" },
  { name: "Gift Card Holders", price: 10, desc: "A gift card that feels like a gift", deal: "New!" },
  { name: "Hair Whimsys", price: 5, desc: "Tie one on a braid or ponytail", deal: "New! · 2 for $10" },
  { name: "Pet Bandanas", price: 18, desc: "Over the collar, stretchy channel", deal: "Patchwork $22" },
];

const css = [
  ".head{top:92px;left:200px;right:200px;}",
  ".sub{top:204px;}",
  ".ruleA{top:252px;}",
  ".items{position:absolute;left:118px;right:118px;top:268px;}",
  ".item{padding:11px 0 11px;border-bottom:1.5px dashed rgba(147,136,88,.6);}",
  ".item:last-child{border-bottom:0;}",
  ".line{display:flex;align-items:baseline;gap:14px;}",
  ".nm{font-family:var(--display);font-weight:600;font-size:33px;line-height:1;white-space:nowrap;color:var(--green);}",
  ".dots{flex:1;border-bottom:3px dotted rgba(59,51,39,.32);transform:translateY(-10px);}",
  ".pr{font-family:var(--display);font-weight:700;font-size:40px;line-height:1;color:var(--wine);white-space:nowrap;}",
  ".pr sup{font-size:24px;vertical-align:top;position:relative;top:8px;margin-right:2px;}",
  ".ds{margin-top:2px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:16px;font-weight:700;color:var(--sage);}",
  ".deal{display:inline-block;font-weight:800;font-size:14px;color:var(--wine);border:1.5px solid var(--rose);border-radius:999px;padding:1px 11px;}",
  // Any two $5/$6 pieces for $10, mix and match (owner, 2026-09-22).
  ".mix{top:810px;}",
  ".mix span{display:inline-block;font-family:var(--display);font-weight:700;font-size:25px;color:var(--wine);border:2px solid var(--rose);border-radius:999px;padding:4px 26px;background:rgba(255,255,255,.35);}",
  ".ruleB{top:862px;}",
  ".pay{top:890px;}",
  ".pay span{display:inline-block;font-weight:800;font-size:19px;letter-spacing:.06em;color:var(--green);border:1.5px solid var(--sage);border-radius:999px;padding:5px 20px;}",
  ".ask{top:940px;left:200px;right:200px;font-family:var(--display);font-style:italic;font-size:21px;color:var(--ink);}",
  ".foot{top:978px;left:210px;right:210px;font-size:14px;line-height:1.5;}",
].join("\n");

const items = ITEMS.map((i) =>
  '<div class="item"><div class="line"><span class="nm">' + i.name + '</span><span class="dots"></span>' +
  '<span class="pr"><sup>$</sup>' + i.price + "</span></div>" +
  '<div class="ds">' + i.desc + (i.deal ? '<span class="deal">' + i.deal + "</span>" : "") + "</div></div>"
).join("");

const body = base.page(
  '<div class="center head">' + base.wordmark(52, 28) + "</div>" +
  '<div class="center sub"><span class="script" style="font-size:34px">every piece handmade in San Antonio</span></div>' +
  '<div class="center ruleA"><span class="rule"><i></i><b>&#10084;</b><i></i></span></div>' +
  '<div class="items">' + items + "</div>" +
  '<div class="center mix"><span>Mix &amp; match: any 2 of the $5 or $6 pieces for $10</span></div>' +
  '<div class="center ruleB"><span class="rule"><i></i><b>&#10022;</b><i></i></span></div>' +
  '<div class="center pay"><span>Cash &amp; card welcome &#183; tax included</span></div>' +
  '<div class="center ask">Want it in another fabric? Ask about custom orders.</div>' +
  '<div class="center foot">@dragonink_and_thread &#183; dragoninkandthread.com</div>'
);

fs.writeFileSync(path.join(SIGN, "p-price-sign.html"), base.doc("Price List", css, body));
console.log("wrote p-price-sign.html");
