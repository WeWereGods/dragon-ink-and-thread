// Decode every QR out of the RENDERED parchment sheets.
//
// The pay sheet carries LIVE STRIPE PAYMENT LINKS. A code that does not scan at a
// market table is the worst failure in this kit, so these are checked from the
// rendered pixels, never from the source buffers the build script made.
//
// The gift tag code is the one to watch: it dropped 92px -> 88px AND its light
// modules are now parchment instead of white, so it has less contrast than the
// version verified earlier today.
const fs = require("fs");
const path = require("path");
const jsQR = require("jsqr");
const { PNG } = require("pngjs");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });

function load(name) { return PNG.sync.read(fs.readFileSync(path.join(SIGN, name))); }

function crop(sheet, x0, y0, w, h) {
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

function check(sheet, label, want, x, y, w, h) {
  const c = crop(sheet, x, y, w, h);
  const hit = jsQR(new Uint8ClampedArray(c.data), c.width, c.height);
  const ok = hit && hit.data === want;
  console.log("  " + label + ": " + (ok ? "scans" : "FAILED (" + (hit ? hit.data : "no code found") + ")"));
  return ok ? 1 : 0;
}

let pass = 0, total = 0;

// --- Scan to Pay. Rows at CSS top 330/520/710, img 150px at left:124. Doubled.
console.log("p-pay-sign:");
const pay = load("p-pay-sign.png");
const PAY = [
  ["scrunchie", "https://buy.stripe.com/8x2eVddpM76F6lcgBPfjG0v", 330],
  ["bow", "https://buy.stripe.com/4gMbJ1bhEaiR24WgBPfjG0w", 520],
  ["bandana", "https://buy.stripe.com/fZu3cvadAgHf6lcgBPfjG0u", 710],
];
for (const [name, url, top] of PAY) {
  // Row is 176px tall and the image is vertically centred within it.
  const cy = (top + 88) * 2;
  total++; pass += check(pay, name, url, 200, cy - 200, 400, 400);
}

// --- Gift tags. 3x3 grid, page padding 48, cell 240x320, card padding 13.
console.log("p-gift-tags:");
const gift = load("p-gift-tags.png");
const GIFT_URL = "https://www.dragoninkandthread.com/?s=tag";
for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 3; c++) {
    total++;
    pass += check(gift, "tag r" + (r + 1) + "c" + (c + 1), GIFT_URL,
      (48 + c * 240) * 2, (48 + r * 320) * 2, 480, 640);
  }
}

console.log(pass + " of " + total + " QRs decode at printed size");
if (pass !== total) process.exitCode = 1;
