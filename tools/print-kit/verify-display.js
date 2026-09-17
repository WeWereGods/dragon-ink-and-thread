// Decode the display sign's three QRs out of the rendered page. They were made
// deliberately small (132px = 1.4in) because the brief was "name big, codes small",
// so the size has to be proven rather than assumed.
const fs = require("fs");
const path = require("path");
const jsQR = require("jsqr");
const { PNG } = require("pngjs");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
const sheet = PNG.sync.read(fs.readFileSync(path.join(SIGN, "d-display.png")));
console.log("sheet: " + sheet.width + " x " + sheet.height);

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

// .qrs spans x 158..658 (500 wide), three 132px items with space-between => gaps of 52.
// So the codes sit at x 158, 342, 526, all at y 626. Doubled for the 2x screenshot.
const Q = [
  ["shop", "https://www.dragoninkandthread.com/shop.html", 158],
  ["join", "https://www.dragoninkandthread.com/#join", 342],
  ["custom", "https://www.dragoninkandthread.com/custom.html", 526],
];

let pass = 0;
for (const [name, want, x] of Q) {
  const c = crop(x * 2 - 30, 626 * 2 - 30, 324, 324);
  const hit = jsQR(new Uint8ClampedArray(c.data), c.width, c.height);
  const ok = hit && hit.data === want;
  console.log("  " + name + ": " + (ok ? "scans" : "FAILED (" + (hit ? hit.data : "no code found") + ")"));
  if (ok) pass++;
}
console.log(pass + " of 3 decode at 132px on the display sign");
if (pass !== 3) process.exitCode = 1;
