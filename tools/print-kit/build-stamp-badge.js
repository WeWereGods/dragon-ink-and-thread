// THE ROUND LINE-ART BADGE - the rubber stamp mark. Built 2026-09-25.
//
// This is mark #2 of the three (CLAUDE.md, THREE MARKS): wordmark + needle + sprig,
// NO DRAGON. It had been described in the repo for over a week and never actually drawn,
// so there was no file to send an engraver.
//
// ⚠️ IT IS DRAWN, NOT CONVERTED, AND THAT IS THE WHOLE POINT.
// experiments/stamp-test-dragon.js thresholds the two wax-seal renders to show what they
// do as stamps. The dragon turns to mush at every ink level. The wordmark stays legible -
// but its LETTERS COME OUT HOLLOW, because a lit render puts a bright bevel round a
// mid-grey letter face, and thresholding keeps the edge and drops the middle.
// A stamp needs FLAT SOLID BLACK: no bevel, no grain, no tone. So this is drawn from
// scratch as vector shapes and live text, and every fill is #000.
//
// Output is 35mm square. Rendered at 1200px that is ~870 DPI, far above what any
// engraver asks for.
//
// ⚠️ THE TEXT IS LIVE, IN CORMORANT GARAMOND. An engraver working from the PNG is fine.
// If one asks for vector, the text must be CONVERTED TO OUTLINES first or they will
// substitute a font and the badge will come back wrong.
const fs = require("fs");
const path = require("path");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });

const S = 1000;            // viewBox units
const C = S / 2;

// four-pointed star, the kind already on the seal art
const star = (x, y, r) =>
  '<path transform="translate(' + x + ',' + y + ') scale(' + (r / 18) + ')" d="' +
  "M0,-18 C1.2,-6 6,-1.2 18,0 C6,1.2 1.2,6 0,18 C-1.2,6 -6,1.2 -18,0 C-6,-1.2 -1.2,-6 0,-18 Z" + '"/>';

// a pointed leaf, rotated to sit on the stem
const leaf = (x, y, deg, len) =>
  '<path transform="translate(' + x + ',' + y + ') rotate(' + deg + ') scale(' + (len / 34) + ')" d="' +
  "M0,0 C9,-9 11,-22 0,-34 C-11,-22 -9,-9 0,0 Z" + '"/>';

// leaves + berries along the left-hand stem
const stemD = "M186,352 C146,452 156,576 214,668 C250,724 292,758 340,778";
let sprig = '<path d="' + stemD + '" fill="none" stroke="#000" stroke-width="7" stroke-linecap="round"/>';
const LEAVES = [
  [174, 392, -34, 52], [214, 390, 112, 44],
  [154, 470, -14, 54], [200, 466, 128, 46],
  [162, 552,   8, 54], [212, 544, 146, 46],
  [192, 628,  26, 52], [242, 616, 164, 44],
  [238, 700,  46, 48], [286, 684, 182, 40],
  [296, 752,  64, 44],
];
for (const [x, y, d, l] of LEAVES) sprig += leaf(x, y, d, l);
const BERRIES = [[196, 424], [176, 504], [188, 586], [224, 660], [268, 726]];
for (const [x, y] of BERRIES) sprig += '<circle cx="' + x + '" cy="' + y + '" r="7.5"/>';

// the threaded needle, lower right
const needle =
  // shaft: a long taper from the eye down to the point
  '<path d="M826,438 L850,456 L726,806 L714,800 Z"/>' +
  // the eye
  '<ellipse cx="834" cy="450" rx="16" ry="28" transform="rotate(-20 834 450)" fill="none" stroke="#000" stroke-width="8"/>' +
  // thread, looped through and trailing
  '<path d="M840,424 C892,410 912,462 884,504 C862,538 818,556 796,598" fill="none" stroke="#000" ' +
  'stroke-width="7" stroke-linecap="round"/>';

const stars =
  star(500, 182, 30) + star(400, 220, 17) + star(600, 224, 17) +
  star(330, 268, 12) + star(668, 272, 12) +
  star(486, 792, 24) + star(404, 772, 13) + star(566, 772, 13) + star(486, 846, 10);

const flourish = (y, w) =>
  '<path d="M' + (C - w) + "," + y + " C" + (C - w * 0.55) + "," + (y - 16) + " " + (C - w * 0.2) + "," + (y + 12) + " " + C + "," + y +
  " C" + (C + w * 0.2) + "," + (y + 12) + " " + (C + w * 0.55) + "," + (y - 16) + " " + (C + w) + "," + y +
  '" fill="none" stroke="#000" stroke-width="6" stroke-linecap="round"/>';

const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + S + " " + S + '" width="1000" height="1000">' +
    '<rect width="' + S + '" height="' + S + '" fill="#fff"/>' +
    '<g fill="#000">' +
      // rim and dotted ring
      '<circle cx="' + C + '" cy="' + C + '" r="472" fill="none" stroke="#000" stroke-width="11"/>' +
      '<circle cx="' + C + '" cy="' + C + '" r="432" fill="none" stroke="#000" stroke-width="7" ' +
        'stroke-linecap="round" stroke-dasharray="0.1 26"/>' +
      '<g transform="translate(-26,26)">' + sprig + '</g>' + needle + stars +
      flourish(330, 112) + flourish(700, 112) +
      // the wordmark
      '<text x="' + C + '" y="450" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" ' +
        'font-weight="700" font-size="88" letter-spacing="2">DRAGON INK</text>' +
      '<path d="M356,494 L644,494" stroke="#000" stroke-width="5" stroke-linecap="round"/>' +
      star(500, 494, 13) +
      '<text x="352" y="574" text-anchor="end" font-family="Cormorant Garamond, Georgia, serif" ' +
        'font-style="italic" font-weight="400" font-size="62">and</text>' +
      '<text x="374" y="580" text-anchor="start" font-family="Cormorant Garamond, Georgia, serif" ' +
        'font-weight="700" font-size="88" letter-spacing="2">THREAD</text>' +
    "</g>" +
  "</svg>";

const html =
  '<!DOCTYPE html><html><head><meta charset="utf-8">' +
  '<link rel="preconnect" href="https://fonts.googleapis.com">' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">' +
  "<style>*{margin:0;padding:0}html,body{width:1000px;height:1000px;background:#fff}svg{display:block}</style>" +
  "</head><body>" + svg + "</body></html>";

fs.writeFileSync(path.join(SIGN, "stamp-badge.html"), html);
fs.writeFileSync(path.join(SIGN, "stamp-badge.svg"), svg);
console.log("wrote build/stamp-badge.html and build/stamp-badge.svg");
console.log("RENDER: headless Edge at --window-size=1000,1000 -> 35mm at ~725 DPI");
