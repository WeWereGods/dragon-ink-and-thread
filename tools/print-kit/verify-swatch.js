// Verify the swatch book's cover QRs BY DECODING THEM OUT OF THE RENDERED PAGE.
//
// ⚠️ THE KIT RULE: a QR is only proven when it is read back off the render, never off the
// source buffer. build-swatch-book.js already checks the 900px original — that proves the
// encoder worked, not that the thing on the cardstock scans.
//
// ⚠️ THIS ONE MATTERS MORE THAN THE OTHERS, because the swatch cover QR is PRINTED SMALL.
// The full-page version was ~2in across; on a 3.75in card it is about 1.08in. Small QRs are
// where "it encoded fine" and "a phone can read it" come apart, and a whole print run of
// cardstock rides on it.
//
// 📌 A WHOLE-IMAGE jsQR SCAN FINDS NOTHING when a page holds several QRs — it locks onto no
// single finder pattern. That is not a failure of the codes; it is a failure of the scan.
// So this slides a window across the page and decodes each hit separately.
//
//   node verify-swatch.js                 checks build/p-swatch-covers.png  (expects 2)
//   node verify-swatch.js p-swatch-book 2 checks another render, with an expected count
const fs = require("fs");
const path = require("path");
const jsQR = require("jsqr");
const { PNG } = require("pngjs");

const WANT = "https://www.dragoninkandthread.com/custom.html";
const name = process.argv[2] || "p-swatch-covers";
const expect = Number(process.argv[3] || 2);

const file = path.join(__dirname, "build", name + ".png");
if (!fs.existsSync(file)) throw new Error("no render at " + file + " — run render.ps1 " + name + " first");
const img = PNG.sync.read(fs.readFileSync(file));

function crop(x0, y0, w, h) {
  w = Math.min(w, img.width - x0);
  h = Math.min(h, img.height - y0);
  const o = { width: w, height: h, data: Buffer.alloc(w * h * 4) };
  for (let y = 0; y < h; y++) {
    const si = ((y0 + y) * img.width + x0) * 4;
    img.data.copy(o.data, y * w * 4, si, si + w * 4);
  }
  return o;
}

// The window is generous and the step is half of it, so every QR lands well inside at
// least one window WITH ITS QUIET ZONE. A tight crop that clips the quiet zone reads as
// "not found", which looks exactly like a broken code — that happened while writing this.
const WIN = 420, STEP = 210;
const found = new Map();                       // "x,y" of top-left corner -> decoded text
for (let y = 0; y + 1 < img.height; y += STEP) {
  for (let x = 0; x + 1 < img.width; x += STEP) {
    const c = crop(x, y, WIN, WIN);
    if (c.width < 80 || c.height < 80) continue;
    const hit = jsQR(new Uint8ClampedArray(c.data), c.width, c.height);
    if (!hit) continue;
    // Deduplicate: the same code is seen by several overlapping windows.
    const gx = Math.round((x + hit.location.topLeftCorner.x) / 40);
    const gy = Math.round((y + hit.location.topLeftCorner.y) / 40);
    found.set(gx + "," + gy, hit.data);
  }
}

const results = [...found.values()];
const wrong = results.filter((r) => r !== WANT);

console.log(name + ".png (" + img.width + "x" + img.height + ")");
console.log("  QRs decoded: " + results.length + "  (expected " + expect + ")");
results.forEach((r, i) => console.log("   " + (i + 1) + ". " + r));

if (wrong.length) throw new Error("a QR points somewhere else: " + wrong.join(", "));
if (results.length < expect) {
  throw new Error("only " + results.length + " of " + expect + " QRs decoded from the RENDER. " +
    "At this print size that is a real scanning risk — make the QR bigger before printing.");
}
console.log("  OK — every cover QR reads back off the render.");
