// FREE STICKER tent cards — four per letter sheet, cut out and folded in half so each
// stands on its own beside the sticker bowl.
//
// Written 2026-09-30 for the new SMALL 25c stickers, which are given away to anyone.
// At 25c a sticker, a free bowl costs almost nothing and does two jobs: it gives a
// stranger a reason to stop, and it is local advertising in a city she leaves on Nov 25.
// Stickers carried to Virginia are worth nothing; stickers on someone's water bottle in
// San Antonio are worth something.
//
// ⚠️ THE CARD SAYS "THE LITTLE ONES" ON PURPOSE. Three sticker designs exist and they do
// NOT all behave the same way:
//   - these small 25c ones            → FREE to anyone, this card
//   - two branded 57c designs         → free WITH A PURCHASE, no minimum (owner 2026-09-24)
//   - "Creating Whimsy", the cauldron → $3, FOR SALE, carries no shop name
// A card reading only "FREE STICKERS" beside a $3 sticker is how a $3 sticker walks off
// the table. The wording has to name which.
//
// ⛔ AI-ART MARKET RULE STILL APPLIES. The branded designs read as AI-generated and some
// juried markets ban AI merchandise — do not put stickers out at the Pearl or Mercado de
// Otono without checking first. That rule is about the merchandise, not this card.
//
// Geometry copied from build-tent-cards.js: 3.5in x 5in flat, folding to a 3.5in x 2.5in
// face, top half rotated 180deg so both faces read the right way up once folded. Two rows
// of 5in leave 0.5in top and bottom on letter; any taller and a home printer clips it.
//
// HTML entities rather than literal symbols: PowerShell 5.1 re-saves files as ANSI.
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "build");
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
const KIT = path.join(OUT, "kit").replace(/\\/g, "/");
const url = (f) => "file:///" + KIT + "/" + f;

const TW = 336, FH = 240;          // face: 3.5in x 2.5in at 96dpi
const TH = FH * 2;                 // flat tent: 3.5in x 5in
const S = 0.3;                     // one scale for every kit asset (see build-4x6.js)
const CORNER = Math.round(250 * S);
const TILE_W = Math.round(320 * S), TILE_H = Math.round(300 * S);

// The face. Kept to four lines: any more and it stops being readable at arm's length,
// which is the only distance this card is ever read from.
function face() {
  return [
    '<div class="f">',
    '  <span class="c tl"></span><span class="c tr"></span>',
    '  <div class="eyebrow">help yourself</div>',
    '  <div class="big">FREE STICKER</div>',
    '  <div class="rule"><i></i><b>&#10022;</b><i></i></div>',
    '  <div class="sub">the little ones &#183; one per person, please</div>',
    '  <div class="mark">DRAGON INK AND THREAD</div>',
    "</div>",
  ].join("\n");
}

const tents = new Array(4).fill(0).map(
  () => '<div class="tent"><div class="half flip">' + face() + '</div><div class="half">' + face() + "</div></div>"
).join("\n");

const css = `
@page{size:letter;margin:0;}
*{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
html,body{width:816px;height:1056px;background:#fff;
  font-family:'Nunito','Segoe UI',sans-serif;color:#3b3327;}
.sheet{width:816px;height:1056px;padding:48px 72px;display:flex;flex-wrap:wrap;
  align-content:flex-start;gap:0;}
.tent{width:${TW}px;height:${TH}px;position:relative;outline:1px dashed #c9b894;outline-offset:-1px;}
.half{width:${TW}px;height:${FH}px;position:relative;overflow:hidden;
  background-color:#f0ddbc;background-image:url('${url("paper.png")}');
  background-size:${TILE_W}px ${TILE_H}px;background-repeat:repeat;}
.half.flip{transform:rotate(180deg);}
/* The fold line, so it is obvious where to crease. */
.tent::after{content:"";position:absolute;left:0;right:0;top:${FH}px;height:0;
  border-top:1px dotted #b9a179;}
.f{position:absolute;inset:0;padding:18px 20px 14px;text-align:center;
  display:flex;flex-direction:column;align-items:center;justify-content:center;}
.c{position:absolute;width:${CORNER}px;height:${CORNER}px;background-size:${CORNER}px ${CORNER}px;}
.c.tl{left:0;top:0;background-image:url('${url("corner-tl.png")}');
  -webkit-mask-image:linear-gradient(to right,#000 62%,transparent),linear-gradient(to bottom,#000 62%,transparent);
  mask-image:linear-gradient(to right,#000 62%,transparent),linear-gradient(to bottom,#000 62%,transparent);
  -webkit-mask-composite:source-in;mask-composite:intersect;}
.c.tr{right:0;top:0;background-image:url('${url("corner-tr.png")}');
  -webkit-mask-image:linear-gradient(to left,#000 62%,transparent),linear-gradient(to bottom,#000 62%,transparent);
  mask-image:linear-gradient(to left,#000 62%,transparent),linear-gradient(to bottom,#000 62%,transparent);
  -webkit-mask-composite:source-in;mask-composite:intersect;}
.eyebrow{font-family:'Great Vibes','Segoe Script',cursive;font-size:25px;color:#9e5e58;
  line-height:1;margin-bottom:2px;}
/* 46px, because this is read from about two feet away and the price sign had to go
   from 40px to 70px before it read from the aisle. This one is closer, but not close. */
.big{font-family:'Cormorant Garamond',Georgia,serif;font-weight:700;font-size:46px;
  color:#4e5839;letter-spacing:.015em;line-height:1;}
.rule{display:flex;align-items:center;justify-content:center;gap:9px;width:78%;margin:7px 0 5px;}
.rule i{height:1.3px;background:linear-gradient(90deg,transparent,#938858,transparent);flex:1;}
.rule b{color:#7b322c;font-size:12px;line-height:1;}
.sub{font-size:12.5px;font-weight:700;color:#7b322c;line-height:1.3;}
.mark{margin-top:9px;font-size:8.5px;font-weight:800;letter-spacing:.14em;
  text-transform:uppercase;color:#938858;}
`;

const html = [
  '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">',
  "<title>Free sticker tent cards</title>",
  '<link rel="preconnect" href="https://fonts.googleapis.com">',
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
  '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Great+Vibes&family=Nunito:wght@700;800&display=swap" rel="stylesheet">',
  "<style>" + css + "</style></head><body>",
  '<div class="sheet">' + tents + "</div>",
  "</body></html>",
].join("\n");

const file = path.join(OUT, "p-sticker-sign.html");
fs.writeFileSync(file, html, "utf8");
console.log("wrote " + file);
console.log("4 tent cards, 3.5in x 5in flat, folding to 3.5in x 2.5in.");
console.log("Next: .\\render.ps1 p-sticker-sign");
