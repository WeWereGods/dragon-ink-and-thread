// Decode every QR out of the RENDERED parchment sheet, not the source buffers.
//
// This sheet deliberately trades contrast for looks: the QR light modules are the
// paper tone #f0ddbc rather than white, so the codes sit on the parchment without a
// white box round them. Contrast is exactly what scanners need, so that trade has to
// be proven at printed size or reverted to a white panel with a sage border.
const fs = require("fs");
const path = require("path");
const jsQR = require("jsqr");
const { PNG } = require("pngjs");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
const SHEET = path.join(SIGN, "p-shop-sign.png"); // 2x screenshot => 1632 x 2112
const EXPECT = {
  big: "https://www.dragoninkandthread.com/shop.html",
  left: "https://www.dragoninkandthread.com/#join",
  right: "https://www.dragoninkandthread.com/custom.html",
};

const sheet = PNG.sync.read(fs.readFileSync(SHEET));
console.log("sheet: " + sheet.width + " x " + sheet.height);

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

// Boxes DERIVED from the layout, not eyeballed. The earlier big-QR box was computed
// from the wrong origin and clipped the code's right-hand columns; every variant
// failed identically, which looked like a contrast problem and was not.
//
// Page is 816 wide. The big card is left:50% with margin-left:-150px and a 250px
// image, so the code spans CSS x = 408-125 .. 408+125 = 283..533, y = 330..580.
// Doubled for the 2x screenshot, with margin either side.
const REGIONS = [
  { name: "big", key: "big", x: 520, y: 600, w: 700, h: 700 },
  { name: "left (join)", key: "left", x: 150, y: 1300, w: 480, h: 480 },
  { name: "right (custom)", key: "right", x: 1000, y: 1300, w: 480, h: 480 },
];

let pass = 0;
for (const r of REGIONS) {
  const c = crop(r.x, r.y, r.w, r.h);
  const hit = jsQR(new Uint8ClampedArray(c.data), c.width, c.height);
  const want = EXPECT[r.key];
  const ok = hit && hit.data === want;
  console.log(r.name + ": " + (ok ? "scans" : "FAILED (" + (hit ? hit.data : "no code found") + ")"));
  if (ok) pass++;
}
console.log(pass + " of " + REGIONS.length + " QRs decode on parchment at printed size");
if (pass !== REGIONS.length) {
  console.log("-> low contrast is the likely cause; use white light-modules with a sage border");
  process.exitCode = 1;
}
