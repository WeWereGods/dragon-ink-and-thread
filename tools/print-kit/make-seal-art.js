// Flat art for the WAX SEAL dies, cut from the rendered mockups in assets/.
//
//   seal-dragon-source.png    -> seal-dragon-35mm.png     sleeping dragon in his nest
//   seal-wordmark-source.png  -> seal-wordmark-35mm.png   wordmark, needle and sprig
//
// ⚠️ THESE ARE RELIEF MAPS, NOT LINE ART, AND THEY CANNOT BECOME LINE ART.
// Both designs are modelled - they read through depth, not outline. Thresholding them
// to black and white produces mud, which is why no 1-bit version is written here. If an
// engraver insists on line art, the design has to be REDRAWN, not converted.
//
// The mockups are LIT renders, so their greyscale encodes the light as well as the
// height. That is close enough for a die-cutter to work from, and the spec files that
// ship beside them say so plainly rather than pretending otherwise.
//
// ⚠️ FRAC IS FOUND BY EYE, PER DESIGN, AND THE TWO ARE NOT THE SAME.
// It is the fraction of the source square that the flat face occupies, inside the wavy
// wax rim. The dragon sits small in its frame (0.60); the wordmark runs much closer to
// the rim because of its dotted border (0.71). Too large catches the rim as a dark
// bevel, too small crops the design. **Preview before trusting a new number** - 0.635
// on the dragon caught the rim along the bottom edge, and 0.62 on the wordmark sliced
// the needle and the right of "INK" clean off.
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const ROOT = path.join(__dirname, "..", "..");
const ASSETS = path.join(ROOT, "assets");
const MM = 35;

const SEALS = [
  { src: "seal-dragon-source.png",   out: "seal-dragon-35mm.png",   frac: 0.60 },
  { src: "seal-wordmark-source.png", out: "seal-wordmark-35mm.png", frac: 0.71 },
];

for (const seal of SEALS) {
  const src = PNG.sync.read(fs.readFileSync(path.join(ASSETS, seal.src)));
  const W = src.width, H = src.height;
  const lum = (i) => 0.2126 * src.data[i] + 0.7152 * src.data[i + 1] + 0.0722 * src.data[i + 2];

  const D = Math.round(Math.min(W, H) * seal.frac);
  const x0 = Math.round(W / 2 - D / 2), y0 = Math.round(H / 2 - D / 2);
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
    let v = 255;                                 // outside the circle: paper, not design
    if (dx * dx + dy * dy <= r * r) {
      v = Math.round(((lum(((y0 + y) * W + (x0 + x)) << 2) - lo) / (hi - lo)) * 255);
      v = Math.max(0, Math.min(255, v));
    }
    out.data[d] = out.data[d + 1] = out.data[d + 2] = v;
    out.data[d + 3] = 255;
  }
  fs.writeFileSync(path.join(ASSETS, seal.out), PNG.sync.write(out));

  const dpi = Math.round(D / (MM / 25.4));
  console.log("wrote assets/" + seal.out + "  " + D + "x" + D + "px circle at frac " + seal.frac);
  console.log("  = " + MM + "mm at " + dpi + " DPI (levels " + lo.toFixed(0) + "-" + hi.toFixed(0) + " stretched to 0-255)");
}
