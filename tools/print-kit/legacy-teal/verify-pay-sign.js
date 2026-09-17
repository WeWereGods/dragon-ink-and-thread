// Decode every QR code from the RENDERED sign (not the source PNGs), so what prints is what scans.
const fs = require("fs");
const path = require("path");
const jsQR = require("jsqr");
const { PNG } = require("pngjs");

const EXPECT = [
  "https://buy.stripe.com/8x2eVddpM76F6lcgBPfjG0v",
  "https://buy.stripe.com/4gMbJ1bhEaiR24WgBPfjG0w",
  "https://buy.stripe.com/fZu3cvadAgHf6lcgBPfjG0u",
];
const img = PNG.sync.read(fs.readFileSync(path.join(__dirname, "..", "sign", "pay-sign.png")));
const scale = img.width / 816;
let bad = 0;
EXPECT.forEach((url, i) => {
  // Row i: left 112, top 300 + 200i, height 182; the QR sits in its left ~200px.
  const x0 = Math.round(112 * scale), y0 = Math.round((300 + i * 200) * scale);
  const w = Math.round(220 * scale), h = Math.round(182 * scale);
  const crop = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const s = ((y0 + y) * img.width + (x0 + x)) * 4, d = (y * w + x) * 4;
    crop[d] = img.data[s]; crop[d + 1] = img.data[s + 1]; crop[d + 2] = img.data[s + 2]; crop[d + 3] = 255;
  }
  const hit = jsQR(crop, w, h);
  const ok = hit && hit.data === url;
  if (!ok) bad++;
  console.log("row " + (i + 1) + ": " + (ok ? "scans to " + url : "FAILED (" + (hit ? hit.data : "nothing found") + ")"));
});
process.exitCode = bad ? 1 : 0;
