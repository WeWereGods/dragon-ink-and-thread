// Cut-and-fold A-frame display stand for pet bandanas. Two per letter sheet.
//
// WHY AN A-FRAME AND NOT A CONE OR A POST. The bandanas have an elastic channel that
// stretches over a collar. Anything post-shaped has to be near neck-circumference to
// grip, and a Medium is 13-18in - a post that size needs a 13in+ flat template, which
// does not fit on letter paper without splicing. A draped ridge needs no grip at all,
// shows the triangle and the print, and flips in a second for the reversible ones.
//
// Print on CARDSTOCK, or trace onto a cereal box. Solid lines cut, dashed lines fold.
const fs = require("fs");
const path = require("path");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
const KIT = path.join(SIGN, "kit").replace(/\\/g, "/");
const u = (f) => "file:///" + KIT + "/" + f;

// 96dpi. Two pieces butted together share one cut line down the middle of the sheet.
const W = 376;          // 3.9in wide
const TAB = 53;         // 0.55in foot, folds under
const PANEL = 413;      // 4.3in tall face
const H = TAB + PANEL + PANEL + TAB;   // 932px = 9.7in
const LEFT = 28, MID = 404, TOP = 62;

const css = [
  ":root{--paper:#f0ddbc;--green:#4e5839;--sage:#938858;--wine:#7b322c;--ink:#3b3327;",
  "  --display:'Cormorant Garamond',Georgia,serif;--body:'Nunito','Segoe UI',sans-serif;}",
  "@page{size:letter;margin:0;}",
  "*{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}",
  "html,body{width:816px;background:#fff;}",
  "body{font-family:var(--body);color:var(--ink);}",
  ".page{position:relative;width:816px;height:1056px;overflow:hidden;background:#fff;}",
  ".pc{position:absolute;width:" + W + "px;height:" + H + "px;border:1.6px solid var(--ink);",
  "  background-color:var(--paper);background-image:url('" + u("paper.png") + "');",
  "  background-size:320px 300px;background-repeat:repeat;}",
  // Fold lines. Dashed so they are obviously not cut lines.
  ".fold{position:absolute;left:0;right:0;border-top:1.4px dashed var(--wine);}",
  ".fl{position:absolute;right:7px;font-size:8.5px;font-weight:800;letter-spacing:.08em;",
  "  text-transform:uppercase;color:var(--wine);}",
  ".ridge{position:absolute;left:0;right:0;border-top:2px dashed var(--wine);}",
  ".rl{position:absolute;left:7px;font-size:9px;font-weight:800;letter-spacing:.1em;",
  "  text-transform:uppercase;color:var(--wine);}",
  // The lower panel is the face that shows under the hanging point.
  ".mark{position:absolute;left:0;right:0;text-align:center;}",
  ".w1{font-family:var(--display);font-weight:700;font-size:17px;line-height:1;color:var(--green);letter-spacing:.03em;}",
  ".w2{font-family:var(--display);font-weight:600;font-size:8.5px;line-height:1;color:var(--green);letter-spacing:.11em;margin-top:2px;}",
  // Instructions live on the fold-under tabs, where nothing shows once it is built.
  ".tabtext{position:absolute;left:8px;right:8px;text-align:center;font-size:8px;line-height:1.35;color:var(--sage);font-weight:700;}",
  ".title{position:absolute;left:28px;right:28px;top:20px;text-align:center;}",
  ".ti{font-family:var(--display);font-weight:700;font-size:16px;color:var(--green);}",
  ".ts{font-size:9.5px;font-weight:700;color:var(--sage);margin-top:2px;letter-spacing:.03em;}",
  ".foot{position:absolute;left:28px;right:28px;top:1012px;text-align:center;font-size:9px;",
  "  font-weight:700;color:var(--sage);line-height:1.5;}",
].join("\n");

function piece(x) {
  return '<div class="pc" style="left:' + x + 'px;top:' + TOP + 'px">' +
    // top foot tab
    '<div class="tabtext" style="top:14px">cut solid &#183; fold dashed &#183; tape the two feet to the table</div>' +
    '<div class="fold" style="top:' + TAB + 'px"></div>' +
    '<div class="fl" style="top:' + (TAB + 4) + 'px">fold under</div>' +
    // ridge
    '<div class="ridge" style="top:' + (TAB + PANEL) + 'px"></div>' +
    '<div class="rl" style="top:' + (TAB + PANEL + 5) + 'px">ridge &#8212; bandana hangs over here</div>' +
    // lower panel carries the mark, low enough to sit below the bandana's point
    '<div class="mark" style="top:' + (TAB + PANEL + PANEL - 66) + 'px">' +
    '<div class="w1">DRAGON</div><div class="w2">INK AND THREAD</div></div>' +
    // bottom foot tab
    '<div class="fold" style="top:' + (TAB + PANEL + PANEL) + 'px"></div>' +
    '<div class="fl" style="top:' + (TAB + PANEL + PANEL + 4) + 'px">fold under</div>' +
    "</div>";
}

const html = ['<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Bandana stand</title>',
  '<link rel="preconnect" href="https://fonts.googleapis.com">',
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
  '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Nunito:wght@700;800&display=swap" rel="stylesheet">',
  "<style>" + css + "</style></head><body>",
  '<div class="page">',
  '<div class="title"><div class="ti">Pet bandana display stand &#183; two per sheet</div>',
  '<div class="ts">PRINT ON CARDSTOCK, OR TRACE ONTO A CEREAL BOX &#183; ACTUAL SIZE, NOT FIT TO PAGE</div></div>',
  piece(LEFT), piece(MID),
  '<div class="foot">Cut out &#183; fold both dashed lines the same way so the feet turn under &#183; bend at the ridge into a tent<br>' +
  'Drape the bandana over the ridge with the point down the front. Flip it to show the other side.</div>',
  "</div></body></html>"].join("\n");

fs.writeFileSync(path.join(SIGN, "bandana-stand.html"), html);
console.log("wrote bandana-stand.html - 2 stands per letter sheet, " +
  (W / 96).toFixed(1) + "in wide x " + (PANEL / 96).toFixed(1) + "in tall each");
