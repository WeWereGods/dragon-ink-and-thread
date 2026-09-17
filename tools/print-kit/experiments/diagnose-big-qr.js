// Why did the BIG qr fail when the two small ones passed on the same paper?
//
// "Low contrast" is almost certainly the WRONG diagnosis: the small codes use the
// identical dark/light pair and decoded fine. Contrast does not fail at 250px and
// succeed at 170px. The real candidates are (a) my crop box misses part of the code,
// (b) the 1.5px sage border sits flush against the modules, eating the quiet zone
// jsQR needs, or (c) something else entirely. Measure, then look.
const fs = require("fs");
const path = require("path");
const jsQR = require("jsqr");
const { PNG } = require("pngjs");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
const sheet = PNG.sync.read(fs.readFileSync(path.join(SIGN, "p-shop-sign.png")));
const WANT = "https://www.dragoninkandthread.com/shop.html";

function crop(x0, y0, w, h) {
  x0 = Math.max(0, x0); y0 = Math.max(0, y0);
  w = Math.min(w, sheet.width - x0); h = Math.min(h, sheet.height - y0);
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const s = ((y0 + y) * sheet.width + (x0 + x)) << 2;
      const d = (y * w + x) << 2;
      out.data[d] = sheet.data[s]; out.data[d + 1] = sheet.data[s + 1];
      out.data[d + 2] = sheet.data[s + 2]; out.data[d + 3] = 255;
    }
  }
  return out;
}

// Contrast inside the code area, to test the "low contrast" claim with numbers.
function contrast(img) {
  let mn = 255, mx = 0, sum = 0, n = 0;
  for (let i = 0; i < img.data.length; i += 4) {
    const l = 0.299 * img.data[i] + 0.587 * img.data[i + 1] + 0.114 * img.data[i + 2];
    if (l < mn) mn = l;
    if (l > mx) mx = l;
    sum += l; n++;
  }
  return { min: Math.round(mn), max: Math.round(mx), mean: Math.round(sum / n), spread: Math.round(mx - mn) };
}

// Sweep several boxes round the expected position rather than trusting one guess.
const boxes = [
  { name: "as-verified   ", x: 270, y: 640, w: 590, h: 590 },
  { name: "tighter       ", x: 300, y: 655, w: 520, h: 520 },
  { name: "wider margin  ", x: 230, y: 600, w: 680, h: 680 },
  { name: "shifted down  ", x: 270, y: 700, w: 590, h: 590 },
  { name: "whole upper   ", x: 120, y: 560, w: 900, h: 780 },
];

for (const b of boxes) {
  const c = crop(b.x, b.y, b.w, b.h);
  const hit = jsQR(new Uint8ClampedArray(c.data), c.width, c.height);
  const ct = contrast(c);
  const verdict = hit ? (hit.data === WANT ? "SCANS" : "wrong: " + hit.data) : "no code";
  console.log(b.name + " " + b.w + "x" + b.h + "  " + verdict +
    "   luma min " + ct.min + " max " + ct.max + " spread " + ct.spread);
}

// Save the as-verified crop so it can be looked at directly.
fs.writeFileSync(path.join(SIGN, "big-qr-crop.png"), PNG.sync.write(crop(270, 640, 590, 590)));
console.log("wrote big-qr-crop.png");

// Compare against a small one that DID pass, same measurement.
const small = crop(150, 1300, 480, 480);
const cs = contrast(small);
console.log("small (passes)  luma min " + cs.min + " max " + cs.max + " spread " + cs.spread);
