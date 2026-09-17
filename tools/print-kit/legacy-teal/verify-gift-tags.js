// Prove the QR scans at PRINTED size, by decoding it out of the rendered sheet
// rather than the 900px source buffer. Crops the first tag cell and reads it.
const fs = require("fs");
const path = require("path");
const jsQR = require("jsqr");
const { PNG } = require("pngjs");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
const SHEET = path.join(SIGN, "gift-tags.png"); // 2x screenshot of page 1 => 1632 x 2112
const URL = "https://www.dragoninkandthread.com/?s=tag";

const sheet = PNG.sync.read(fs.readFileSync(SHEET));
console.log("sheet: " + sheet.width + " x " + sheet.height);

// Page padding 48, cell 240x320, all at 2x. First cell = (96,96) 480x640.
function crop(x0, y0, w, h) {
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const s = ((y0 + y) * sheet.width + (x0 + x)) << 2;
      const d = (y * w + x) << 2;
      out.data[d] = sheet.data[s];
      out.data[d + 1] = sheet.data[s + 1];
      out.data[d + 2] = sheet.data[s + 2];
      out.data[d + 3] = 255;
    }
  }
  return out;
}

// Check every one of the nine tags, not just the first - a layout slip could
// clip one row only, and a tag that does not scan is worse than no tag.
let pass = 0;
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    const x0 = (48 + col * 240) * 2;
    const y0 = (48 + row * 320) * 2;
    const cell = crop(x0, y0, 480, 640);
    const hit = jsQR(new Uint8ClampedArray(cell.data), cell.width, cell.height);
    const ok = hit && hit.data === URL;
    console.log("tag r" + (row + 1) + "c" + (col + 1) + ": " + (ok ? "scans" : "FAILED (" + (hit ? hit.data : "no code found") + ")"));
    if (ok) pass++;
  }
}
console.log(pass + " of 9 tags decode correctly at printed size");
if (pass !== 9) { process.exitCode = 1; }
