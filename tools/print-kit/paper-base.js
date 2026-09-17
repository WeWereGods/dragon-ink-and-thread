// Shared base for the parchment print kit.
//
// Paper tone is #f0ddbc, MEASURED from the front frame's centre patch - not the
// #F6E9DA taken earlier off the card BACK. They are different files with different
// paper, and mixing them leaves a visible seam where a corner crop meets flat colour.
//
// The corner sprays are cropped WITH their own parchment, so they need no alpha:
// same paper under, same paper over. That is why nothing here is keyed.
//
// The wordmark is LIVE TEXT, never the card's picture of it, because the card art
// says "DRAGON INK & THREAD" and the standing rule is the word "and".
const path = require("path");

const KIT = path.join(__dirname, "build", "kit").replace(/\\/g, "/");
const url = (f) => "file:///" + KIT + "/" + f;

const PALETTE = {
  paper: "#f0ddbc",
  green: "#4e5839",
  sage: "#938858",
  wine: "#7b322c",
  rose: "#9e5e58",
  gold: "#b9862a",
  ink: "#3b3327",
};

const FONTS =
  '<link rel="preconnect" href="https://fonts.googleapis.com">' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Nunito:wght@600;700;800&display=swap" rel="stylesheet">';

// 816 x 1056 CSS px = US Letter portrait at 96dpi, matching the existing sign kit.
const baseCss = [
  ":root{--paper:" + PALETTE.paper + ";--green:" + PALETTE.green + ";--sage:" + PALETTE.sage +
    ";--wine:" + PALETTE.wine + ";--rose:" + PALETTE.rose + ";--gold:" + PALETTE.gold + ";--ink:" + PALETTE.ink + ";",
  "  --display:'Cormorant Garamond',Georgia,serif;--script:'Great Vibes','Segoe Script',cursive;--body:'Nunito','Segoe UI',sans-serif;}",
  "@page{size:letter;margin:0;}",
  "*{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}",
  "html,body{width:816px;background:#fff;}",
  "body{font-family:var(--body);color:var(--ink);}",
  // TILE the paper at native size, never stretch it. Stretching a 320x300 patch to
  // fill 816x1056 smears the grain 2.55x wide and 3.52x tall, while the corner crops
  // render at native 250px with crisp grain - and the eye reads that mismatch as a
  // visible rectangle round each corner. Tone is NOT the culprit: centre patch
  // #f0ddbc vs corners #eedab7-#efdbb8 is a ~1% difference, invisible in print.
  ".page{position:relative;width:816px;height:1056px;overflow:hidden;background-color:var(--paper);",
  "  background-image:url('" + url("paper.png") + "');background-size:320px 300px;background-repeat:repeat;",
  "  break-after:page;page-break-after:always;}",
  ".page:last-child{break-after:auto;page-break-after:auto;}",
  // Corner sprays, each carrying its own parchment so the seam disappears.
  ".c{position:absolute;width:250px;height:250px;background-size:250px 250px;}",
  ".c.tl{left:0;top:0;background-image:url('" + url("corner-tl.png") + "');}",
  ".c.tr{right:0;top:0;background-image:url('" + url("corner-tr.png") + "');}",
  ".c.bl{left:0;bottom:0;background-image:url('" + url("corner-bl.png") + "');}",
  ".c.br{right:0;bottom:0;background-image:url('" + url("corner-br.png") + "');}",
  ".inner{position:absolute;inset:56px;}",
  ".center{position:absolute;left:56px;right:56px;text-align:center;}",
  // Shared type
  ".word{font-family:var(--display);font-weight:700;color:var(--green);letter-spacing:.02em;line-height:1;}",
  ".word .amp{font-weight:400;}",
  ".script{font-family:var(--script);color:var(--wine);line-height:1.1;}",
  ".tag{font-family:var(--display);font-style:italic;color:var(--rose);}",
  ".rule{display:flex;align-items:center;justify-content:center;gap:12px;}",
  ".rule i{height:1.5px;background:linear-gradient(90deg,transparent,var(--sage),transparent);flex:1;max-width:190px;}",
  ".rule b{color:var(--wine);font-size:15px;line-height:1;}",
  ".foot{font-family:var(--body);font-weight:800;letter-spacing:.06em;color:var(--green);text-transform:uppercase;}",
].join("\n");

// Always live text. Never the card's raster wordmark, which spells it with "&".
function wordmark(sizePx, subPx) {
  return (
    '<div class="word" style="font-size:' + sizePx + 'px">DRAGON</div>' +
    '<div class="word" style="font-size:' + subPx + 'px;margin-top:2px">INK AND THREAD</div>'
  );
}

function page(contents) {
  return '<div class="page"><span class="c tl"></span><span class="c tr"></span>' +
    '<span class="c bl"></span><span class="c br"></span>' + contents + "</div>";
}

function doc(title, css, body) {
  return [
    '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>' + title + "</title>",
    FONTS,
    "<style>" + baseCss + "\n" + (css || "") + "</style></head><body>",
    body,
    "</body></html>",
  ].join("\n");
}

module.exports = { PALETTE, KIT, url, baseCss, wordmark, page, doc };
