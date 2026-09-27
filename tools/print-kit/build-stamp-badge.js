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

// A pointed leaf, OUTLINED with a centre vein - not a solid shape.
// Solid filled leaves read as clip art at this scale; the botanical reference the owner
// chose is all fine outline. Stroke is scaled back up by 34/len so a small leaf keeps the
// same LINE WEIGHT as a large one instead of looking heavier as it shrinks.
const LEAFW = 4.6;
const leaf = (x, y, deg, len) => {
  const k = len / 34, w = (LEAFW / k).toFixed(2);
  return '<g transform="translate(' + x + ',' + y + ') rotate(' + deg + ') scale(' + k + ')" ' +
    'fill="none" stroke="#000" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M0,0 C13,-10 15,-24 0,-34 C-15,-24 -13,-10 0,0 Z"/>' +
    '<path d="M0,-3 L0,-29"/>' +
    '</g>';
};

// SPRIGS ARE GENERATED ALONG THEIR STEM, NOT PLACED BY HAND.
// The first two versions positioned every leaf individually and it read as a clump: the
// angles did not agree with the curve, the pairs were not symmetric, and the sizes jumped
// about. Here a stem is one cubic bezier, leaves are sampled along it, each pair is set
// from the TANGENT at that point, and the size tapers toward the tip.
//
// SPREAD is 82 degrees off the tangent - near perpendicular. 58 was tried first and the
// leaves lay along the stem and tangled with it. Do not go back below about 70.
const SPREAD = 70;

function sprigOn(P, pairs, len0, lenStep, t0, t1, berries) {
  const bez = (t, i) => {
    const u = 1 - t;
    return u * u * u * P[0][i] + 3 * u * u * t * P[1][i] + 3 * u * t * t * P[2][i] + t * t * t * P[3][i];
  };
  const tan = (t, i) => {
    const u = 1 - t;
    return 3 * u * u * (P[1][i] - P[0][i]) + 6 * u * t * (P[2][i] - P[1][i]) + 3 * t * t * (P[3][i] - P[2][i]);
  };
  let out = '<path d="M' + P[0] + " C" + P[1] + " " + P[2] + " " + P[3] +
    '" fill="none" stroke="#000" stroke-width="5" stroke-linecap="round"/>';
  for (let k = 0; k < pairs; k++) {
    const t = t0 + (k / (pairs - 1)) * (t1 - t0);
    const deg = Math.atan2(tan(t, 1), tan(t, 0)) * 180 / Math.PI;
    const len = len0 + k * lenStep;
    out += leaf(bez(t, 0), bez(t, 1), deg + 90 - SPREAD, len) +
           leaf(bez(t, 0), bez(t, 1), deg + 90 + SPREAD, len);
  }
  if (berries) {
    for (let k = 0; k < pairs - 1; k++) {
      const t = t0 + ((k + 0.5) / (pairs - 1)) * (t1 - t0);
      out += '<circle cx="' + bez(t, 0).toFixed(1) + '" cy="' + bez(t, 1).toFixed(1) + '" r="5"/>';
    }
  }
  return out;
}

// the long sprig down the left
const sprig = sprigOn([[188, 356], [140, 520], [200, 724], [352, 812]], 8, 30, 4, 0.08, 0.95, true);

// A CROWN AT THE TOP: two short sprigs meeting at the centre, mirrored. Each tapers from
// its outer base in toward the join, which is what makes a pair read as one wreath rather
// than two twigs. The three big central stars were removed to make room - a sprig and a
// star cluster in the same place is just clutter.
// KEPT BUT NOT DRAWN. A crown of two mirrored sprigs was tried at the top on 2026-09-25
// and taken out again; the material went into a longer left sprig instead. Add `crown` back
// into the draw list below to restore it, and take the three central stars out again.
// eslint-disable-next-line no-unused-vars
const crown =
  sprigOn([[318, 300], [352, 230], [420, 194], [494, 186]], 4, 24, 5, 0.06, 0.94, false) +
  sprigOn([[682, 300], [648, 230], [580, 194], [506, 186]], 4, 24, 5, 0.06, 0.94, false);

// the threaded needle, lower right
const needle =
  // shaft: a FINE taper - 13 units at the eye down to a point. v1 was a slab and read
  // as a dagger rather than a needle.
  '<path d="M806,470 L819,477 L707,772 L703,770 Z" fill="none" stroke="#000" stroke-width="4.6" ' +
  'stroke-linejoin="round"/>' +
  // the eye
  '<ellipse cx="812" cy="455" rx="13" ry="23" transform="rotate(-21 812 455)" fill="none" stroke="#000" stroke-width="4.6"/>' +
  // thread, looped through and trailing back along the arc
  '<path d="M818,432 C862,414 884,458 862,496 C838,538 796,566 770,626 C752,668 748,704 758,742" ' +
  'fill="none" stroke="#000" stroke-width="4.6" stroke-linecap="round"/>';

const stars =
  star(500, 176, 30) + star(398, 208, 16) + star(602, 208, 16) +
  star(316, 262, 12) + star(684, 262, 12) + star(248, 342, 10) + star(752, 342, 10) +
  star(500, 802, 22) + star(414, 782, 13) + star(586, 782, 13) + star(500, 856, 10);

const flourish = (y, w) =>
  '<path d="M' + (C - w) + "," + y + " C" + (C - w * 0.55) + "," + (y - 16) + " " + (C - w * 0.2) + "," + (y + 12) + " " + C + "," + y +
  " C" + (C + w * 0.2) + "," + (y + 12) + " " + (C + w * 0.55) + "," + (y - 16) + " " + (C + w) + "," + y +
  '" fill="none" stroke="#000" stroke-width="4.2" stroke-linecap="round"/>';

const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + S + " " + S + '" width="1000" height="1000">' +
    '<rect width="' + S + '" height="' + S + '" fill="#fff"/>' +
    '<g fill="#000">' +
      // rim and dotted ring
      '<circle cx="' + C + '" cy="' + C + '" r="472" fill="none" stroke="#000" stroke-width="8"/>' +
      '<circle cx="' + C + '" cy="' + C + '" r="432" fill="none" stroke="#000" stroke-width="5.5" ' +
        'stroke-linecap="round" stroke-dasharray="0.1 24"/>' +
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
