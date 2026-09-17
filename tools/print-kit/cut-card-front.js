// Cut the display sign's pieces out of ONE file: Business_Card_FRONT.png (1170x552).
//
// ⚠️ Why this file and nothing else. There are now THREE parchments in play:
//   card BACK            #F6E9DA
//   card FRONT (this)    ~#F5E7D6   <- the dragon sits on this one
//   FRONT_BACKGROUND     #f0ddbc    <- the other signs' corner sprays
// Mixing them puts a visibly paler rectangle round whatever is borrowed. Taking the
// dragon AND the decoration AND the paper from a single file makes the seam impossible.
const fs = require("fs");
const path = require("path");
const ASSETS = path.join(__dirname, "..", "..", "assets").replace(/\\/g, "/");
const { PNG } = require("pngjs");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
const OUT = path.join(SIGN, "front");
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const src = PNG.sync.read(fs.readFileSync(path.join(ASSETS, "print-kit", "card-front.png")));
console.log("source: " + src.width + " x " + src.height);

function cut(x0, y0, w, h, name) {
  x0 = Math.max(0, Math.min(src.width - 1, x0));
  y0 = Math.max(0, Math.min(src.height - 1, y0));
  w = Math.min(w, src.width - x0);
  h = Math.min(h, src.height - y0);
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const s = ((y0 + y) * src.width + (x0 + x)) << 2;
      const d = (y * w + x) << 2;
      out.data[d] = src.data[s];
      out.data[d + 1] = src.data[s + 1];
      out.data[d + 2] = src.data[s + 2];
      out.data[d + 3] = 255;
    }
  }
  fs.writeFileSync(path.join(OUT, name), PNG.sync.write(out));
  // Mean tone, so a patch that accidentally caught artwork is obvious in the log.
  let r = 0, g = 0, b = 0, n = 0;
  for (let i = 0; i < out.data.length; i += 4) { r += out.data[i]; g += out.data[i + 1]; b += out.data[i + 2]; n++; }
  const hex = [r, g, b].map((v) => Math.round(v / n).toString(16).padStart(2, "0")).join("");
  console.log("  " + name.padEnd(18) + w + "x" + h + "  mean #" + hex);
  return out;
}

// The dragon in his nest. First attempt at (285,345,470,207) caught the tagline along
// the top and clipped his tail at the right, so: start lower and run wider.
cut(262, 374, 548, 178, "dragon.png");

// Decorative botanicals from the left and right borders - these become the portrait
// sign's side borders, and they bring their own matching paper with them.
cut(0, 40, 175, 430, "vine-left.png");
cut(995, 40, 175, 430, "vine-right.png");

// Clean paper, taken from inside the left border where the vine thins out. The three
// earlier candidates all came back ~#c8b99b-#d4c4b0, far below the card's dominant
// #F5E7D6 - every one of them had caught artwork. A mean close to #F5E7D6 is the tell
// that this patch is genuinely blank.
cut(126, 96, 44, 54, "paper.png");
console.log("written to " + OUT);
