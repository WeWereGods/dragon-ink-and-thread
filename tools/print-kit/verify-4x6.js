// The 4x6 card shrinks each Stripe QR from 150px to 104px (1.08in). These are LIVE
// PAYMENT LINKS at a market table, so the smaller size has to be proven by decoding
// it out of the rendered card - never assumed from the source buffer.
const fs = require("fs");
const path = require("path");
const jsQR = require("jsqr");
const { PNG } = require("pngjs");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
const sheet = PNG.sync.read(fs.readFileSync(path.join(SIGN, "s-pay.png")));
console.log("card: " + sheet.width + " x " + sheet.height + "  (2x of 384x576)");

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

// Rows sit at CSS top 126 / 244 / 362, image 104px at left:44. Doubled for the 2x shot.
// ⚠️ These MUST track the row spacing in build-4x6.js - a stale crop box reads as a
// decode failure and sends you hunting a contrast problem that was never there.
const ROWS = [
  ["scrunchie", "https://buy.stripe.com/8x2eVddpM76F6lcgBPfjG0v", 126],
  ["bow", "https://buy.stripe.com/4gMbJ1bhEaiR24WgBPfjG0w", 244],
  ["bandana", "https://buy.stripe.com/fZu3cvadAgHf6lcgBPfjG0u", 362],
];

let pass = 0;
for (const [name, want, top] of ROWS) {
  const c = crop(60, top * 2 - 26, 270, 270);
  const hit = jsQR(new Uint8ClampedArray(c.data), c.width, c.height);
  const ok = hit && hit.data === want;
  console.log("  " + name + ": " + (ok ? "scans" : "FAILED (" + (hit ? hit.data : "no code found") + ")"));
  if (ok) pass++;
}
console.log(pass + " of 3 Stripe QRs decode at 4x6 size");
if (pass !== 3) {
  console.log("-> if this fails, the fix is error-correction M rather than H: fewer modules");
  console.log("   for the same URL means each module prints bigger, which is what small codes need.");
  process.exitCode = 1;
}
