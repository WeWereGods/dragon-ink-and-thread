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

// THE SPRIG IS GENERATED ALONG THE STEM, NOT HAND-PLACED.
// v1 and v2 positioned every leaf by hand and it read as a clump: the angles did not
// agree with the curve, the pairs were not symmetric, and the sizes jumped about.
// Here the stem is one cubic bezier, leaves are sampled along it, each pair is set from
// the TANGENT at that point, and the size tapers toward the tip the way a real sprig does.
const P = [[188, 356], [146, 502], [222, 700], [344, 792]];   // cubic control points
const bez = (t, i) => {
  const u = 1 - t;
  return u * u * u * P[0][i] + 3 * u * u * t * P[1][i] + 3 * u * t * t * P[2][i] + t * t * t * P[3][i];
};
const tan = (t, i) => {
  const u = 1 - t;
  return 3 * u * u * (P[1][i] - P[0][i]) + 6 * u * t * (P[2][i] - P[1][i]) + 3 * t * t * (P[3][i] - P[2][i]);
};

let sprig = '<path d="M' + P[0] + " C" + P[1] + " " + P[2] + " " + P[3] +
  '" fill="none" stroke="#000" stroke-width="7" stroke-linecap="round"/>';

const PAIRS = 6;
const SPREAD = 82;        // degrees off the tangent, each way - near perpendicular.
// 58 was tried first and the leaves lay along the stem instead of standing out from it.
for (let k = 0; k < PAIRS; k++) {
  const t = 0.1 + (k / (PAIRS - 1)) * 0.8;
  const x = bez(t, 0), y = bez(t, 1);
  const deg = Math.atan2(tan(t, 1), tan(t, 0)) * 180 / Math.PI;
  const len = 56 - k * 4;                       // taper toward the tip
  sprig += leaf(x, y, deg + 90 - SPREAD, len) + leaf(x, y, deg + 90 + SPREAD, len);
}
// berries sit ON the stem, between the pairs, so they read as part of it
for (let k = 0; k < PAIRS - 1; k++) {
  const t = 0.1 + ((k + 0.5) / (PAIRS - 1)) * 0.8;
  sprig += '<circle cx="' + bez(t, 0).toFixed(1) + '" cy="' + bez(t, 1).toFixed(1) + '" r="7"/>';
}

// the threaded needle, lower right
const needle =
  // shaft: a FINE taper - 13 units at the eye down to a point. v1 was a slab and read
  // as a dagger rather than a needle.
  '<path d="M806,470 L819,477 L707,772 L703,770 Z"/>' +
  // the eye
  '<ellipse cx="812" cy="455" rx="13" ry="23" transform="rotate(-21 812 455)" fill="none" stroke="#000" stroke-width="6"/>' +
  // thread, looped through and trailing back along the arc
  '<path d="M818,432 C862,414 884,458 862,496 C838,538 796,566 770,626 C752,668 748,704 758,742" ' +
  'fill="none" stroke="#000" stroke-width="6" stroke-linecap="round"/>';

const stars =
  star(500, 176, 30) + star(398, 208, 16) + star(602, 208, 16) +
  star(316, 262, 12) + star(684, 262, 12) + star(248, 342, 10) + star(752, 342, 10) +
  star(500, 802, 22) + star(414, 782, 13) + star(586, 782, 13) + star(500, 856, 10);

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
      '<g transform="translate(-34,58)">' + sprig + '</g>' + needle + stars +
      flourish(330, 112) + flourish(700, 112) +
      // the wordmark
      '<text x="' + C + '" y="450" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" ' +
        'font-weight="700" font-size="88" letter-spacing="2">DRAGON INK</text>' +
      '<path d="M356,494 L644,494" stroke="#000" stroke-width="5" stroke-linecap="round"/>' +
      star(500, 494, 13) +
      '<text x="' + C + '" y="578" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif">' +
        '<tspan font-style="italic" font-weight="400" font-size="62">and </tspan>' +
        '<tspan font-weight="700" font-size="88" letter-spacing="2">THREAD</tspan></text>' +
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
