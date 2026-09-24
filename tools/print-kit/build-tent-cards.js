// "What is it?" TENT cards — four per letter sheet, cut out and folded in half so each
// stands on its own. Made 2026-09-21 because the table has only two 4x6 holders and
// those went to the Rose Latte Cloud story and the gifts card.
//
// Each tent is 3.5in x 5in flat, folding to a 3.5in x 2.5in face. The TOP half is
// rotated 180 degrees so that, once folded, both faces read the right way up. Letter
// is exactly 11in tall, so two rows of 5in leave a 0.5in margin top and bottom — any
// taller and a home printer clips the edge.
//
// HTML entities rather than literal symbols: PowerShell 5.1 re-saves files as ANSI.
const fs = require("fs");
const path = require("path");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
const KIT = path.join(SIGN, "kit").replace(/\\/g, "/");
const url = (f) => "file:///" + KIT + "/" + f;

const TW = 336, FH = 240;          // face: 3.5in x 2.5in at 96dpi
const TH = FH * 2;                 // flat tent: 3.5in x 5in
const S = 0.3;                     // one scale for every kit asset (see build-4x6.js)
const CORNER = Math.round(250 * S);
const TILE_W = Math.round(320 * S), TILE_H = Math.round(300 * S);

const TENTS = [
  { eyebrow: "what is a", title: "Hair Whimsy?", price: 5,
    text: "A fabric tie for braids, buns and ponytails. Long ones tie in a bow; short ones knot and dangle." },
  { eyebrow: "what is a", title: "Sachet?", price: 6, deal: "or 2 for $10",
    text: "A little scented pillow, lavender or cinnamon. Tuck one in a drawer, closet or car." },
  { eyebrow: "what is a", title: "Gift Card Holder?", price: 10,
    text: "A fabric sleeve that makes a gift card feel like a real present." },
  { eyebrow: "ready to give", title: "Cozy Gift Set", price: 10,
    text: "A scrunchie and a sachet, tied up with twine and a gift tag." },
];

const FONTS =
  '<link rel="preconnect" href="https://fonts.googleapis.com">' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Nunito:wght@600;700;800&display=swap" rel="stylesheet">';

const fade = (h, v) =>
  "linear-gradient(to " + h + ",#000 65%,transparent),linear-gradient(to " + v + ",#000 65%,transparent)";

const css = [
  ":root{--paper:#f0ddbc;--green:#4e5839;--sage:#938858;--wine:#7b322c;--rose:#9e5e58;--ink:#3b3327;",
  "  --display:'Cormorant Garamond',Georgia,serif;--script:'Great Vibes','Segoe Script',cursive;--body:'Nunito','Segoe UI',sans-serif;}",
  "@page{size:letter;margin:0;}",
  "*{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}",
  "html,body{width:816px;background:#fff;}",
  "body{font-family:var(--body);color:var(--ink);}",
  ".sheet{position:relative;width:816px;height:1056px;overflow:hidden;background:#fff;}",
  ".grid{position:absolute;left:72px;top:48px;display:grid;grid-template-columns:" + TW + "px " + TW + "px;grid-auto-rows:" + TH + "px;}",
  // Cut line = the dashed outline; fold line = the dotted rule across the middle.
  ".tent{position:relative;width:" + TW + "px;height:" + TH + "px;outline:1px dashed #b9ab8c;outline-offset:0;}",
  ".tent::after{content:'';position:absolute;left:0;right:0;top:" + FH + "px;border-top:1px dotted #9a8e70;}",
  ".face{position:absolute;left:0;width:" + TW + "px;height:" + FH + "px;overflow:hidden;background-color:var(--paper);",
  "  background-image:url('" + url("paper.png") + "');background-size:" + TILE_W + "px " + TILE_H + "px;}",
  ".face.top{top:0;transform:rotate(180deg);}",
  ".face.bot{top:" + FH + "px;}",
  ".c{position:absolute;top:0;width:" + CORNER + "px;height:" + CORNER + "px;background-size:" + CORNER + "px " + CORNER + "px;",
  "  -webkit-mask-composite:source-in;mask-composite:intersect;}",
  ".c.tl{left:0;background-image:url('" + url("corner-tl.png") + "');-webkit-mask-image:" + fade("right", "bottom") + ";mask-image:" + fade("right", "bottom") + ";}",
  ".c.tr{right:0;background-image:url('" + url("corner-tr.png") + "');-webkit-mask-image:" + fade("left", "bottom") + ";mask-image:" + fade("left", "bottom") + ";}",
  ".in{position:absolute;left:30px;right:30px;top:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;}",
  ".eb{font-family:var(--script);color:var(--wine);font-size:22px;line-height:1;}",
  ".tt{font-family:var(--display);font-weight:700;color:var(--green);font-size:27px;line-height:1.05;margin-top:2px;}",
  ".tx{font-family:var(--display);font-style:italic;font-size:14.5px;line-height:1.3;color:var(--ink);margin-top:8px;max-width:250px;}",
  ".pr{font-family:var(--display);font-weight:700;color:var(--wine);font-size:28px;line-height:1;margin-top:8px;}",
  ".pr sup{font-size:15px;vertical-align:top;position:relative;top:3px;margin-right:1px;}",
  ".dl{font-size:16px;font-weight:600;font-style:italic;margin-left:8px;vertical-align:middle;}",
  ".how{position:absolute;left:72px;right:72px;top:1016px;text-align:center;font-size:11px;font-weight:700;color:#8a806a;}",
].join("\n");

function face(t, pos) {
  return '<div class="face ' + pos + '"><span class="c tl"></span><span class="c tr"></span><div class="in">' +
    '<div class="eb">' + t.eyebrow + '</div><div class="tt">' + t.title + "</div>" +
    '<div class="tx">' + t.text + '</div><div class="pr"><sup>$</sup>' + t.price + (t.deal ? '<span class="dl">' + t.deal + "</span>" : "") + "</div></div></div>";
}

const tents = TENTS.map((t) => '<div class="tent">' + face(t, "top") + face(t, "bot") + "</div>").join("");
const body = '<div class="sheet"><div class="grid">' + tents + "</div>" +
  '<div class="how">Cut on the dashed lines &middot; fold on the dotted line &middot; stand it up</div></div>';

fs.writeFileSync(path.join(SIGN, "p-tent-cards.html"),
  ['<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Tent Cards</title>',
    FONTS, "<style>" + css + "</style></head><body>", body, "</body></html>"].join("\n"));
console.log("wrote p-tent-cards.html");
