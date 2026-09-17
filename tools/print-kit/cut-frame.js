// Cut the parchment frame into reusable pieces for letter-size sheets.
//
// The frame is a BUSINESS CARD shape (1084x636, 3.62x2.12in). Stretching that to
// 8.5x11 would badly distort the botanical corners, so instead:
//   - a clean centre patch becomes the paper texture, which CAN stretch freely
//     because it is just noise, and
//   - the four corner sprays are cropped WITH their own parchment and dropped onto
//     the same paper, so no alpha channel is needed at all and the seams vanish.
// This is why no keying is required: same paper under, same paper over.
const fs = require("fs");
const path = require("path");
const ASSETS = path.join(__dirname, "..", "..", "assets").replace(/\\/g, "/");
const { PNG } = require("pngjs");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
const KIT = path.join(SIGN, "kit");
if (!fs.existsSync(KIT)) fs.mkdirSync(KIT, { recursive: true });

const FRAME = path.join(ASSETS, "print-kit", "card-frame.png");
const src = PNG.sync.read(fs.readFileSync(FRAME));
console.log("frame: " + src.width + " x " + src.height);

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
  fs.writeFileSync(path.join(KIT, name), PNG.sync.write(out));
  console.log("  " + name + "  " + w + "x" + h);
  return out;
}

// Clean paper from the middle, well inside the botanical border.
const paper = cut(400, 170, 320, 300, "paper.png");

// Report the paper tone so the CSS background-color can match it exactly and any
// seam between texture and flat colour stays invisible.
let r = 0, g = 0, b = 0, n = 0;
for (let i = 0; i < paper.data.length; i += 4) { r += paper.data[i]; g += paper.data[i + 1]; b += paper.data[i + 2]; n++; }
const hex = [r, g, b].map((v) => Math.round(v / n).toString(16).padStart(2, "0")).join("");
console.log("paper mean tone: #" + hex);

// The four corner sprays, each taken with its surrounding parchment.
const CW = 250, CH = 250;
cut(0, 0, CW, CH, "corner-tl.png");
cut(src.width - CW, 0, CW, CH, "corner-tr.png");
cut(0, src.height - CH, CW, CH, "corner-bl.png");
cut(src.width - CW, src.height - CH, CW, CH, "corner-br.png");

// A horizontal run of the top border, for wide headers that need filling between corners.
cut(300, 0, 480, 120, "edge-top.png");
console.log("kit written to " + KIT);
