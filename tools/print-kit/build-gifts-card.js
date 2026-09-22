// "Gifts $10 and under" as a true 4 x 6 card, for an acrylic table holder.
//
// Sep 19 showed the sachets selling because ANYONE can buy one as a gift; this card
// groups every piece at that price so a browser who isn't shopping for themselves
// has somewhere to land. Titled "and under", not "under", because two lines are $10.
//
// Same geometry as build-4x6.js: every kit asset scaled by ONE factor so the paper
// grain matches edge to edge. Corners are feathered like paper-base.js.
const fs = require("fs");
const path = require("path");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
const KIT = path.join(SIGN, "kit").replace(/\\/g, "/");
const url = (f) => "file:///" + KIT + "/" + f;

const W = 384, H = 576;
const S = 0.48;
const CORNER = Math.round(250 * S);
const TILE_W = Math.round(320 * S);
const TILE_H = Math.round(300 * S);

const ITEMS = [
  { name: "Hair Whimsy", price: 5 },
  { name: "Scrunchie", price: 6 },
  { name: "Sachet", price: 6, note: "lavender or cinnamon" },
  { name: "Gift Card Holder", price: 10 },
  { name: "Cozy Gift Set", price: 10, note: "a scrunchie + a sachet, tied up" },
];

const FONTS =
  '<link rel="preconnect" href="https://fonts.googleapis.com">' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Nunito:wght@600;700;800&display=swap" rel="stylesheet">';

const fade = (h, v) =>
  "linear-gradient(to " + h + ",#000 70%,transparent),linear-gradient(to " + v + ",#000 70%,transparent)";

const css = [
  ":root{--paper:#f0ddbc;--green:#4e5839;--sage:#938858;--wine:#7b322c;--rose:#9e5e58;--ink:#3b3327;",
  "  --display:'Cormorant Garamond',Georgia,serif;--script:'Great Vibes','Segoe Script',cursive;--body:'Nunito','Segoe UI',sans-serif;}",
  "@page{size:4in 6in;margin:0;}",
  "*{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}",
  "html,body{width:" + W + "px;background:#fff;}",
  "body{font-family:var(--body);color:var(--ink);}",
  ".card{position:relative;width:" + W + "px;height:" + H + "px;overflow:hidden;background-color:var(--paper);",
  "  background-image:url('" + url("paper.png") + "');background-size:" + TILE_W + "px " + TILE_H + "px;background-repeat:repeat;}",
  ".c{position:absolute;width:" + CORNER + "px;height:" + CORNER + "px;background-size:" + CORNER + "px " + CORNER + "px;",
  "  -webkit-mask-composite:source-in;mask-composite:intersect;}",
  ".c.tl{left:0;top:0;background-image:url('" + url("corner-tl.png") + "');-webkit-mask-image:" + fade("right", "bottom") + ";mask-image:" + fade("right", "bottom") + ";}",
  ".c.tr{right:0;top:0;background-image:url('" + url("corner-tr.png") + "');-webkit-mask-image:" + fade("left", "bottom") + ";mask-image:" + fade("left", "bottom") + ";}",
  ".c.bl,.c.br{width:84px;height:84px;background-size:84px 84px;}",
  ".c.bl{left:0;bottom:0;background-image:url('" + url("corner-bl.png") + "');-webkit-mask-image:" + fade("right", "top") + ";mask-image:" + fade("right", "top") + ";}",
  ".c.br{right:0;bottom:0;background-image:url('" + url("corner-br.png") + "');-webkit-mask-image:" + fade("left", "top") + ";mask-image:" + fade("left", "top") + ";}",
  ".ctr{position:absolute;left:26px;right:26px;text-align:center;}",
  ".eyebrow{top:44px;font-family:var(--script);color:var(--wine);font-size:30px;line-height:1;}",
  ".title{top:84px;left:70px;right:70px;font-family:var(--display);font-weight:700;color:var(--green);font-size:34px;line-height:1;}",
  ".title small{display:block;font-size:19px;font-weight:600;letter-spacing:.05em;margin-top:3px;}",
  ".ruleA{top:152px;}",
  ".rule{display:flex;align-items:center;justify-content:center;gap:9px;}",
  ".rule i{height:1.2px;background:linear-gradient(90deg,transparent,var(--sage),transparent);flex:1;max-width:80px;}",
  ".rule b{color:var(--wine);font-size:10px;line-height:1;}",
  ".items{position:absolute;left:44px;right:44px;top:172px;}",
  ".it{padding:8px 0 8px;border-bottom:1.2px dashed rgba(147,136,88,.6);}",
  ".it:last-child{border-bottom:0;}",
  ".ln{display:flex;align-items:baseline;gap:8px;}",
  ".nm{font-family:var(--display);font-weight:600;font-size:22px;line-height:1;color:var(--green);white-space:nowrap;}",
  ".dot{flex:1;border-bottom:2px dotted rgba(59,51,39,.3);transform:translateY(-5px);}",
  ".pr{font-family:var(--display);font-weight:700;font-size:25px;line-height:1;color:var(--wine);white-space:nowrap;}",
  ".pr sup{font-size:14px;vertical-align:top;position:relative;top:3px;margin-right:1px;}",
  ".note{font-size:10px;font-weight:700;color:var(--sage);margin-top:2px;}",
  ".mix{top:432px;left:40px;right:40px;}",
  ".mix span{display:inline-block;font-family:var(--display);font-weight:700;font-size:15px;color:var(--wine);border:1.5px solid var(--rose);border-radius:999px;padding:2px 12px;}",
  ".ruleB{top:466px;}",
  ".ask{top:478px;left:60px;right:60px;font-family:var(--script);font-size:21px;color:var(--wine);line-height:1.1;}",
  ".ft{top:530px;left:92px;right:92px;font-family:var(--body);font-weight:800;letter-spacing:.05em;color:var(--green);text-transform:uppercase;font-size:8px;line-height:1.5;}",
].join("\n");

const items = ITEMS.map((i) =>
  '<div class="it"><div class="ln"><span class="nm">' + i.name + '</span><span class="dot"></span>' +
  '<span class="pr"><sup>$</sup>' + i.price + "</span></div>" +
  (i.note ? '<div class="note">' + i.note + "</div>" : "") + "</div>"
).join("");

const body = '<div class="card">' +
  '<span class="c tl"></span><span class="c tr"></span><span class="c bl"></span><span class="c br"></span>' +
  '<div class="ctr eyebrow">little somethings</div>' +
  '<div class="ctr title">Gifts<small>$10 AND UNDER</small></div>' +
  '<div class="ctr ruleA"><span class="rule"><i></i><b>&#10084;</b><i></i></span></div>' +
  '<div class="items">' + items + "</div>" +
  '<div class="ctr mix"><span>any 2 of the $5 &amp; $6 pieces: $10</span></div>' +
  '<div class="ctr ruleB"><span class="rule"><i></i><b>&#10022;</b><i></i></span></div>' +
  '<div class="ctr ask">for teachers, friends and stockings</div>' +
  '<div class="ctr ft">@dragonink_and_thread<br>dragoninkandthread.com</div>' +
  "</div>";

fs.writeFileSync(path.join(SIGN, "s-gifts.html"),
  ['<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Gifts $10 and Under</title>',
    FONTS, "<style>" + css + "</style></head><body>", body, "</body></html>"].join("\n"));
console.log("wrote s-gifts.html");
