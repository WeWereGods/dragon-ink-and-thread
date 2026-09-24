// Flat art for the DRAGON WAX SEAL, cut from the rendered mockup in
// assets/seal-dragon-source.png and written to assets/seal-dragon-35mm.png.
//
// ⚠️ THIS IS A RELIEF MAP, NOT LINE ART, AND IT CANNOT BECOME LINE ART.
// The design is modelled - it reads through depth, not outline. Thresholding it to
// black and white produces mud, which is why no 1-bit version is written here. If an
// engraver insists on line art, the design has to be REDRAWN, not converted.
//
// The mockup is a LIT render, so its greyscale encodes the light as well as the height.
// It is close enough for a die-cutter to work from, and the spec file that ships beside
// it says so plainly rather than pretending otherwise.
//
// The face circle is taken as a fraction of the image. 0.60 was found by eye: 0.635
// caught the raised rim along the bottom edge. If the source is ever re-rendered,
// preview before trusting it.
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const ROOT = path.join(__dirname, "..", "..");
const ASSETS = path.join(ROOT, "assets");
const FRAC = 0.60;
const MM = 35;

const src = PNG.sync.read(fs.readFileSync(path.join(ASSETS, "seal-dragon-source.png")));
const W = src.width, H = src.height;
const lum = (i) => 0.2126 * src.data[i] + 0.7152 * src.data[i + 1] + 0.0722 * src.data[i + 2];

const cx = W / 2, cy = H / 2;
const D = Math.round(Math.min(W, H) * FRAC);
const x0 = Math.round(cx - D / 2), y0 = Math.round(cy - D / 2);
const r = D / 2;

// Stretch to the full range using only what is inside the circle, so the wax rim
// outside it cannot drag the levels.
let lo = 255, hi = 0;
for (let y = 0; y < D; y++) for (let x = 0; x < D; x++) {
  const dx = x - r + 0.5, dy = y - r + 0.5;
  if (dx * dx + dy * dy > r * r) continue;
  const v = lum(((y0 + y) * W + (x0 + x)) << 2);
  if (v < lo) lo = v; if (v > hi) hi = v;
}

const out = new PNG({ width: D, height: D });
for (let y = 0; y < D; y++) for (let x = 0; x < D; x++) {
  const d = (y * D + x) << 2;
  const dx = x - r + 0.5, dy = y - r + 0.5;
  let v = 255;                                   // outside the circle: paper, not design
  if (dx * dx + dy * dy <= r * r) {
    v = Math.round(((lum(((y0 + y) * W + (x0 + x)) << 2) - lo) / (hi - lo)) * 255);
    v = Math.max(0, Math.min(255, v));
  }
  out.data[d] = out.data[d + 1] = out.data[d + 2] = v;
  out.data[d + 3] = 255;
}
fs.writeFileSync(path.join(ASSETS, "seal-dragon-35mm.png"), PNG.sync.write(out));

const dpi = Math.round(D / (MM / 25.4));
console.log("wrote assets/seal-dragon-35mm.png  " + D + "x" + D + "px circle");
console.log("  = " + MM + "mm at " + dpi + " DPI (levels " + lo.toFixed(0) + "-" + hi.toFixed(0) + " stretched to 0-255)");
