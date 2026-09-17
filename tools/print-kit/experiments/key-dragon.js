// The sleeping dragon and the books cluster arrive on flat yellow, not alpha.
// Key the yellow out, split the two clusters, and sit each on the real parchment
// so the edges can be judged against what they will actually print on.
const fs = require("fs");
const path = require("path");
const ASSETS = path.join(__dirname, "..", "..", "..", "assets").replace(/\\/g, "/");
const { PNG } = require("pngjs");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
const DL = ASSETS + "/print-kit";
const ART = DL + "/Dragon_Ink_Thread_BOOKS_AND_DRAGON_3.62x2.12.png";
const FRAME = DL + "/Dragon_Ink_Thread_FRONT_BACKGROUND_3.62x2.12.png";

const src = PNG.sync.read(fs.readFileSync(ART));
console.log("art: " + src.width + " x " + src.height);

// Sample the corners to learn the exact key colour rather than assuming it.
const corner = (x, y) => { const i = (y * src.width + x) << 2; return [src.data[i], src.data[i + 1], src.data[i + 2]]; };
const pts = [corner(2, 2), corner(src.width - 3, 2), corner(2, src.height - 3), corner(src.width - 3, src.height - 3)];
const key = [0, 1, 2].map((k) => Math.round(pts.reduce((a, p) => a + p[k], 0) / pts.length));
console.log("key colour sampled: #" + key.map((v) => v.toString(16).padStart(2, "0")).join(""));

// Raw RGB distance is the wrong metric here: the art is pale watercolour on a warm
// gold ground, so the dragon's sage body and the cream blossoms sit CLOSE to the key
// in RGB and get eaten. Key on hue + saturation instead, which separates "gold
// background" from "pale object" properly, and keep the feather band narrow.
function hsl(r, g, b) {
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
const [kh, ks, kl] = hsl(key[0], key[1], key[2]);

// Background is the key hue at high saturation. Anything meaningfully off that hue,
// or notably less saturated, or much darker, is artwork and must stay solid.
const HARD = 1.0, SOFT = 1.55;
const keyed = new PNG({ width: src.width, height: src.height });
src.data.copy(keyed.data);
let clear = 0, feather = 0;
for (let i = 0; i < keyed.data.length; i += 4) {
  const [h, s, l] = hsl(keyed.data[i], keyed.data[i + 1], keyed.data[i + 2]);
  let dh = Math.abs(h - kh);
  if (dh > 180) dh = 360 - dh;
  // Weighted so hue drift dominates, with saturation and lightness as support.
  const d = dh / 14 + Math.abs(s - ks) * 2.6 + Math.abs(l - kl) * 2.2;
  if (d < HARD) { keyed.data[i + 3] = 0; clear++; }
  else if (d < SOFT) { keyed.data[i + 3] = Math.round(255 * ((d - HARD) / (SOFT - HARD))); feather++; }
}
console.log("cleared " + clear + " px, feathered " + feather + " px");
fs.writeFileSync(path.join(SIGN, "card-art-keyed.png"), PNG.sync.write(keyed));

// Composite over the real parchment frame to judge the edges honestly.
const frame = PNG.sync.read(fs.readFileSync(FRAME));
console.log("frame: " + frame.width + " x " + frame.height);
const out = new PNG({ width: frame.width, height: frame.height });
frame.data.copy(out.data);
const w = Math.min(frame.width, keyed.width), h = Math.min(frame.height, keyed.height);
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const s = (y * keyed.width + x) << 2;
    const a = keyed.data[s + 3] / 255;
    if (a === 0) continue;
    const d = (y * out.width + x) << 2;
    for (let k = 0; k < 3; k++) out.data[d + k] = Math.round(keyed.data[s + k] * a + out.data[d + k] * (1 - a));
  }
}
fs.writeFileSync(path.join(SIGN, "card-art-on-paper.png"), PNG.sync.write(out));
console.log("wrote card-art-keyed.png and card-art-on-paper.png");
