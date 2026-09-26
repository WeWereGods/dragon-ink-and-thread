// Table plan, landscape letter (1056 x 816).
//
// Organised by DEPTH, not by area. A 6ft table seen from above is shallow - about
// 30in - and customers only reach the front ~12in of it. The Sep 17 setup photos had
// everything in a band at the BACK with the front third bare, which is the most
// expensive layout mistake available: it hides the cheap impulse pieces behind the
// display and makes a full table look sparse.
//
// *** THIS FILE IS THE LIST OF WHAT PHYSICALLY GOES ON THE TABLE. ***
// It is NOT generated from js/shop-data.js and must not be - market stock and website
// stock are different things. A piece can be sold online and still be on the table, or
// sit on the table and never be listed (the market bows, the mug rug), or be on the
// table and NOT BE FOR SALE at all (the Kindle case).
//
// So: WHENEVER A PRODUCT IS ADDED OR WITHDRAWN, edit BANDS and bump STOCK_AS_OF, then
// re-render. The date prints on the sheet, which is the whole point - a plan that is
// three weeks stale looks exactly like a current one once it is in your hand, and the
// cost of following it is a piece left in the box.
const fs = require("fs");
const path = require("path");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
const KIT = path.join(SIGN, "kit").replace(/\\/g, "/");
const u = (f) => "file:///" + KIT + "/" + f;

// Signs added 2026-09-21: three letter holders and two 4x6 holders. Tall signs go at
// the BACK, small ones at the FRONT, and no sign may cover a product.
// Bump this every time BANDS changes. It prints in the header.
const STOCK_AS_OF = "2026-09-26";

const BANDS = [
  {
    cls: "back", tag: "BACK ROW", rule: "Height and signs — seen from across the room",
    items: ["Price list sign, at the end people reach first", "Rose Latte Cloud upright + its story card",
            "Display sign, centre",
            "Custom orders sign, at your end — KINDLE CASE beside it as a SAMPLE, no price tag, NOT for sale",
            "Tiered stand, bows on show",
            "Scrunchie tree", "Mirror"],
  },
  {
    cls: "mid", tag: "MIDDLE", rule: "The browse row — picked up, then put back",
    // Tea cover OFF 2026-09-26: sold to Maurya on Sep 24 and collected Sep 25. It is still
    // on the printed Sep 25 plan, which is exactly what this date stamp exists to catch.
    items: ["Pet bandanas, propped not flat", "Book sleeve",
            "Mug rugs $12 or 2 for $20 &#8212; seven, three shapes, a mug standing on one",
            "Other totes"],
  },
  {
    cls: "front", tag: "FRONT EDGE", rule: "Where hands actually land. Keep it FULL.",
    items: ["Gift corner: sachets, gift card holders, Cozy Gift Sets + the Gifts $10 and under card",
            "Hair whimsys $5, in a shallow tray", "Scrunchies $6, in a bowl", "Bows $12, in a flat basket",
            "‘Creating Whimsy’ stickers $3, in a tray",
            "Two branded stickers: FREE with a purchase, their pick, never sold",
            "A tent card in front of each new item", "Business cards"],
  },
];

const STEPS = [
  ["2:30", "Arrive. Table up, cloth on, BANNER clamped to the front, boxes underneath and out of sight."],
  ["2:50", "Back row: stand, scrunchie tree, mirror, Rose Latte Cloud, three signs, Kindle sample."],
  ["3:10", "Middle: bandanas propped, book sleeve, mug rugs fanned out with a mug on one."],
  ["3:25", "Front edge: gift corner, whimsys, scrunchies, bows, stickers, tent cards. Fill it."],
  ["3:40", "Tap to Pay test on your phone. Count the float. Power bank on."],
  ["3:50", "Photograph the finished table for the Story."],
  ["4:00", "Open."],
];

// Sun Sep 27 runs 5-10 with set-up from 4:00, so every step above shifts by +1h30.
const ALSO = "Sun: all +1h30";

const css = [
  ":root{--paper:#f0ddbc;--green:#4e5839;--sage:#938858;--wine:#7b322c;--rose:#9e5e58;--ink:#3b3327;",
  "  --display:'Cormorant Garamond',Georgia,serif;--script:'Great Vibes','Segoe Script',cursive;--body:'Nunito','Segoe UI',sans-serif;}",
  "@page{size:letter landscape;margin:0;}",
  "*{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}",
  "html,body{width:1056px;background:#fff;}",
  "body{font-family:var(--body);color:var(--ink);}",
  ".page{position:relative;width:1056px;height:816px;overflow:hidden;background-color:var(--paper);",
  "  background-image:url('" + u("paper.png") + "');background-size:320px 300px;background-repeat:repeat;}",
  ".c{position:absolute;width:190px;height:190px;background-size:190px 190px;}",
  ".tl{left:0;top:0;background-image:url('" + u("corner-tl.png") + "');}",
  ".tr{right:0;top:0;background-image:url('" + u("corner-tr.png") + "');}",
  ".bl{left:0;bottom:0;background-image:url('" + u("corner-bl.png") + "');}",
  ".br{right:0;bottom:0;background-image:url('" + u("corner-br.png") + "');}",
  // Feather the inner edges so the crops do not read as boxes (same fix as paper-base.js).
  ".c{-webkit-mask-composite:source-in;mask-composite:intersect;}",
  ".tl{-webkit-mask-image:linear-gradient(to right,#000 70%,transparent),linear-gradient(to bottom,#000 70%,transparent);}",
  ".tr{-webkit-mask-image:linear-gradient(to left,#000 70%,transparent),linear-gradient(to bottom,#000 70%,transparent);}",
  ".bl{-webkit-mask-image:linear-gradient(to right,#000 70%,transparent),linear-gradient(to top,#000 70%,transparent);}",
  ".br{-webkit-mask-image:linear-gradient(to left,#000 70%,transparent),linear-gradient(to top,#000 70%,transparent);}",
  ".hd{position:absolute;left:210px;right:210px;top:44px;text-align:center;}",
  ".w1{font-family:var(--display);font-weight:700;font-size:34px;line-height:1;color:var(--green);letter-spacing:.02em;}",
  ".w2{font-family:var(--display);font-style:italic;font-size:19px;line-height:1.2;color:var(--wine);margin-top:5px;}",
  // The table itself, seen from above.
  ".tbl{position:absolute;left:104px;top:150px;width:848px;height:318px;border:2px solid var(--sage);border-radius:9px;overflow:hidden;background:rgba(255,255,255,.34);}",
  ".band{position:absolute;left:0;right:0;padding:8px 18px;border-bottom:1.5px dashed rgba(147,136,88,.75);}",
  ".band:last-child{border-bottom:0;}",
  ".back{top:0;height:106px;}",
  ".mid{top:106px;height:106px;background:rgba(255,255,255,.3);}",
  ".front{top:212px;height:106px;background:rgba(123,50,44,.09);}",
  ".tag{font-family:var(--body);font-weight:800;font-size:12px;letter-spacing:.09em;color:var(--green);}",
  ".front .tag{color:var(--wine);}",
  ".rule{font-family:var(--display);font-style:italic;font-size:15px;color:var(--wine);margin-top:1px;}",
  ".its{margin-top:4px;font-size:13px;font-weight:700;color:var(--ink);line-height:1.45;}",
  ".its span{color:var(--sage);padding:0 6px;}",
  ".side{position:absolute;font-weight:800;font-size:12px;letter-spacing:.11em;color:var(--sage);text-transform:uppercase;}",
  ".behind{left:104px;top:126px;}",
  ".infront{left:104px;top:478px;color:var(--wine);}",
  ".arrow{position:absolute;right:104px;top:476px;font-size:12px;font-weight:800;letter-spacing:.06em;color:var(--wine);}",
  // Bottom sprays are smaller than the top pair so the two text columns can sit between
  // them. At 190px they overlapped the notes and swallowed the last line of each column.
  ".bl,.br{width:130px;height:130px;background-size:130px 130px;}",
  // Notes + timeline. Insets clear the bottom sprays: left column starts past 130,
  // right column ends before 926.
  ".col{position:absolute;top:506px;}",
  ".notes{left:145px;width:420px;}",
  ".time{left:590px;width:320px;}",
  ".ch{font-family:var(--display);font-weight:700;font-size:19px;color:var(--green);border-bottom:1.5px solid var(--sage);padding-bottom:3px;margin-bottom:7px;}",
  ".ch em{font-style:normal;font-family:var(--body);font-size:10.5px;font-weight:800;color:var(--wine);margin-left:10px;letter-spacing:.02em;}",
  ".n{font-size:12px;line-height:1.4;color:var(--ink);margin-bottom:3px;padding-left:13px;position:relative;}",
  ".n::before{content:'\\2726';position:absolute;left:0;color:var(--sage);font-size:9px;top:3px;}",
  ".n b{color:var(--wine);}",
  ".t{display:flex;gap:11px;font-size:12.5px;line-height:1.5;margin-bottom:3px;}",
  ".t i{font-style:normal;font-weight:800;color:var(--wine);width:40px;flex:none;}",
].join("\n");

const bands = BANDS.map((b) =>
  '<div class="band ' + b.cls + '"><div class="tag">' + b.tag + "</div>" +
  '<div class="rule">' + b.rule + "</div>" +
  '<div class="its">' + b.items.join('<span>&#183;</span>') + "</div></div>"
).join("");

const notes = [
  "<b>Fill the front edge.</b> People touch what is nearest. A bare front reads as picked over even when the table is full.",
  "<b>Cheapest things forward.</b> Whimsys and scrunchies are the impulse buys — they cannot do that job from the back row.",
  "<b>Restock from behind, not from the front.</b> Close the gaps as they appear.",
  "<b>No sign covers a product.</b> Tall signs at the back, tent cards at the front. If one blocks something, move the sign.",
  "<b>Leave a clear patch</b> at one end for wrapping and the card reader. Do not fill every inch.",
  "<b>Cash box behind you</b>, never on the table, never out of your reach.",
  "<b>Ask every buyer how they heard of you</b> and tally it. A market cannot be measured any other way.",
].map((n) => '<div class="n">' + n + "</div>").join("");

const steps = STEPS.map(([t, s]) => '<div class="t"><i>' + t + "</i><span>" + s + "</span></div>").join("");

const html = ['<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Table plan</title>',
  '<link rel="preconnect" href="https://fonts.googleapis.com">',
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
  '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Nunito:wght@600;700;800&display=swap" rel="stylesheet">',
  "<style>" + css + "</style></head><body>",
  '<div class="page">',
  '<span class="c tl"></span><span class="c tr"></span><span class="c bl"></span><span class="c br"></span>',
  '<div class="hd"><div class="w1">DRAGON INK AND THREAD</div>',
  '<div class="w2">Table plan &#183; 6 ft &#183; shoppers reach the front only &#183; stock as of ' + STOCK_AS_OF + '</div></div>',
  '<div class="side behind">Behind &#8212; you, spare stock, bags, cash box</div>',
  '<div class="tbl">' + bands + "</div>",
  '<div class="side infront">Shoppers stand here</div>',
  '<div class="arrow">front 12 in is all they can reach &#8595;</div>',
  '<div class="col notes"><div class="ch">Why it is laid out this way</div>' + notes + "</div>",
  '<div class="col time"><div class="ch">Set-up &#183; doors at 4:00<em>' + ALSO + '</em></div>' + steps + '</div>',
  "</div></body></html>"].join("\n");

fs.writeFileSync(path.join(SIGN, "table-plan.html"), html);
console.log("wrote table-plan.html (1056x816 landscape)");
