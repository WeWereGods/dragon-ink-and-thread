// Two standalone dragon images, pulled from the marks that already exist.
//
//   assets/dragon-plush-bw.png    the plush dragon, NO wordmark, GREYSCALE
//   assets/dragon-sleeping.png    the sleeping green dragon in his nest
//
// ⚠️ GREYSCALE, NOT ONE-BIT BLACK. The plush dragon reads entirely through tonal
// shading - flatten him to solid black and he becomes a blob, which is exactly why
// the rubber stamp uses the wordmark badge instead of him (see CLAUDE.md, THREE MARKS).
// This file is fine for print, screen and anything that can hold grey. It is NOT a
// stamp artwork and must not be sent to one.
//
// The wordmark is cropped off because logo.png bakes "Dragon Ink and Thread" into the
// picture, and a dragon that always arrives with type attached cannot be placed freely.
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const ROOT = path.join(__dirname, "..", "..");
const ASSETS = path.join(ROOT, "assets");

const isInk = (r, g, b, a) => a > 24 && !(r > 242 && g > 242 && b > 242);

function bbox(p, y0, y1) {
  let minX = p.width, maxX = -1, minY = p.height, maxY = -1;
  for (let y = y0; y <= y1; y++) {
    for (let x = 0; x < p.width; x++) {
      const i = (y * p.width + x) << 2;
      if (!isInk(p.data[i], p.data[i + 1], p.data[i + 2], p.data[i + 3])) continue;
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
  }
  return { minX, maxX, minY, maxY };
}

function crop(p, x0, y0, w, h) {
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const s = ((y0 + y) * p.width + (x0 + x)) << 2;
      const d = (y * w + x) << 2;
      out.data[d] = p.data[s]; out.data[d + 1] = p.data[s + 1];
      out.data[d + 2] = p.data[s + 2]; out.data[d + 3] = p.data[s + 3];
    }
  }
  return out;
}

// Rec. 709 luminance. Keeps the stitching and the shading readable, which a
// straight average does not - the teal would go muddy and flat.
function greyscale(p) {
  for (let i = 0; i < p.data.length; i += 4) {
    const v = Math.round(0.2126 * p.data[i] + 0.7152 * p.data[i + 1] + 0.0722 * p.data[i + 2]);
    p.data[i] = p.data[i + 1] = p.data[i + 2] = v;
  }
  return p;
}

// ---------- 1. the plush dragon, no wordmark, greyscale ----------
const logo = PNG.sync.read(fs.readFileSync(path.join(ASSETS, "logo.png")));

// The wordmark sits under a clear band of blank rows. Find the FIRST such gap below
// the dragon rather than hard-coding a row, so a re-exported logo still cuts correctly.
const rowInk = [];
for (let y = 0; y < logo.height; y++) {
  let n = 0;
  for (let x = 0; x < logo.width; x++) {
    const i = (y * logo.width + x) << 2;
    if (isInk(logo.data[i], logo.data[i + 1], logo.data[i + 2], logo.data[i + 3])) n++;
  }
  rowInk.push(n);
}
const firstInk = rowInk.findIndex((n) => n > 0);
let gap = -1;
for (let y = firstInk, run = 0; y < logo.height; y++) {
  if (rowInk[y] === 0) { run++; if (run >= 8) { gap = y - run + 1; break; } } else run = 0;
}
if (gap < 0) throw new Error("no blank band found below the dragon - check logo.png");

const b = bbox(logo, firstInk, gap - 1);
const PAD = 8;
const x0 = Math.max(0, b.minX - PAD), y0 = Math.max(0, b.minY - PAD);
const w = Math.min(logo.width - x0, b.maxX - b.minX + 1 + PAD * 2);
const h = Math.min(logo.height - y0, b.maxY - b.minY + 1 + PAD * 2);

const plush = greyscale(crop(logo, x0, y0, w, h));
fs.writeFileSync(path.join(ASSETS, "dragon-plush-bw.png"), PNG.sync.write(plush));
console.log("wrote assets/dragon-plush-bw.png  " + w + "x" + h + "  (wordmark cut at row " + gap + ")");

// ---------- 2. the sleeping dragon ----------
// Already cropped WITH his own parchment by cut-card-front.js - run that first.
const sleeping = path.join(__dirname, "build", "front", "dragon.png");
if (!fs.existsSync(sleeping)) throw new Error("run cut-card-front.js first - " + sleeping + " is missing");
fs.copyFileSync(sleeping, path.join(ASSETS, "dragon-sleeping.png"));
const s = PNG.sync.read(fs.readFileSync(sleeping));
console.log("wrote assets/dragon-sleeping.png  " + s.width + "x" + s.height + "  (on its own parchment, no alpha)");
