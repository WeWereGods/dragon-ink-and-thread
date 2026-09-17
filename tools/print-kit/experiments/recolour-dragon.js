// Recolour the plush dragon from teal into the card palette's olive-green,
// then show him beside the teal original ON the parchment, which is the real test.
const fs = require("fs");
const path = require("path");
const ASSETS = path.join(__dirname, "..", "..", "..", "assets").replace(/\\/g, "/");
const { PNG } = require("pngjs");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
const SRC = "" + ASSETS + "/dragon-logo-transparent.png";
const PAPER = { r: 0xf6, g: 0xe9, b: 0xda };

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  const l = (mx + mn) / 2;
  if (d === 0) return [0, 0, l];
  const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  let h;
  if (mx === r) h = ((g - b) / d) % 6;
  else if (mx === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h *= 60;
  if (h < 0) h += 360;
  return [h, s, l];
}

function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

// Measured off the card art: the greens run H79 when dark and drift to H49 (olive)
// as they lighten, at a muted S of roughly 0.21-0.25.
function paletteGreen(l) {
  const t = Math.max(0, Math.min(1, (l - 0.25) / 0.35));
  return { h: 79 - 30 * t, s: 0.21 + 0.05 * t };
}

const src = PNG.sync.read(fs.readFileSync(SRC));
console.log("dragon: " + src.width + " x " + src.height);

const green = new PNG({ width: src.width, height: src.height });
src.data.copy(green.data);

let touched = 0;
for (let i = 0; i < green.data.length; i += 4) {
  if (green.data[i + 3] < 8) continue;
  const [h, s, l] = rgbToHsl(green.data[i], green.data[i + 1], green.data[i + 2]);
  // Teal/cyan family only. Cream horns, belly patches and the near-white eyes
  // are low-saturation or out of this hue band, so they survive untouched.
  if (h >= 140 && h <= 235 && s > 0.06) {
    const tgt = paletteGreen(l);
    const [r2, g2, b2] = hslToRgb(tgt.h, Math.max(s * 0.9, tgt.s), l);
    green.data[i] = r2; green.data[i + 1] = g2; green.data[i + 2] = b2;
    touched++;
  }
}
console.log("recoloured " + touched + " pixels");
fs.writeFileSync(path.join(SIGN, "dragon-green.png"), PNG.sync.write(green));

// Side by side, on the parchment, at the size a printable would actually use.
const SCALE = 0.62;
const dw = Math.round(src.width * SCALE), dh = Math.round(src.height * SCALE);
const GAP = 44;
const W = GAP * 3 + dw * 2, H = GAP * 2 + dh;
const out = new PNG({ width: W, height: H });
for (let i = 0; i < out.data.length; i += 4) {
  out.data[i] = PAPER.r; out.data[i + 1] = PAPER.g; out.data[i + 2] = PAPER.b; out.data[i + 3] = 255;
}
function place(img, ox) {
  for (let y = 0; y < dh; y++) {
    for (let x = 0; x < dw; x++) {
      const sx = Math.min(src.width - 1, Math.round(x / SCALE));
      const sy = Math.min(src.height - 1, Math.round(y / SCALE));
      const s = (sy * img.width + sx) << 2;
      const a = img.data[s + 3] / 255;
      if (a === 0) continue;
      const d = ((GAP + y) * W + (ox + x)) << 2;
      for (let k = 0; k < 3; k++) {
        out.data[d + k] = Math.round(img.data[s + k] * a + out.data[d + k] * (1 - a));
      }
    }
  }
}
place(src, GAP);
place(green, GAP * 2 + dw);
fs.writeFileSync(path.join(SIGN, "dragon-compare.png"), PNG.sync.write(out));
console.log("wrote dragon-green.png and dragon-compare.png (" + W + " x " + H + ")");
