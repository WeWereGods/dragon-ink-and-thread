// Recover the card art from its flat gold ground.
//
// Keying by colour distance failed twice: the art is pale watercolour on warm gold,
// so blossom edges and wing membranes sit close to the key and got eaten or haloed.
// Darken/lighten blends fail too - the gold is DARKER than parchment in blue (55 vs
// 218), so darken floods the page gold and lighten erases the linework.
//
// The right operation: the ground is a known uniform colour B, so each pixel is
// C = F*a + B*(1-a). Estimate a from the channel that deviates most from B (scaled
// by the headroom that channel actually has), then solve back for F. No thresholds.
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
const corner = (x, y) => { const i = (y * src.width + x) << 2; return [src.data[i], src.data[i + 1], src.data[i + 2]]; };
const pts = [corner(2, 2), corner(src.width - 3, 2), corner(2, src.height - 3), corner(src.width - 3, src.height - 3)];
const B = [0, 1, 2].map((k) => Math.round(pts.reduce((a, p) => a + p[k], 0) / pts.length));
console.log("ground: #" + B.map((v) => v.toString(16).padStart(2, "0")).join("") + "  art " + src.width + "x" + src.height);

// Headroom per channel: how far a pixel can travel from the ground in that channel.
const range = B.map((b) => Math.max(b, 255 - b));

// The ground is NOT perfectly flat - it carries paper texture and a vignette. Measured
// across empty areas, ordinary background pixels reach alpha 0.097 median / 0.131 max.
// A cutoff below that floor leaves the whole page faintly opaque, which is exactly what
// a 0.02 cutoff did. Sit the floor just above the measured max and rescale, so the
// ground lands at true zero while real art still climbs to one.
const FLOOR = 0.14;

const out = new PNG({ width: src.width, height: src.height });
let solid = 0, partial = 0, clear = 0;
for (let i = 0; i < src.data.length; i += 4) {
  let a = 0;
  for (let k = 0; k < 3; k++) {
    a = Math.max(a, Math.abs(src.data[i + k] - B[k]) / range[k]);
  }
  a = (a - FLOOR) / (1 - FLOOR);
  if (a <= 0) { out.data[i + 3] = 0; clear++; continue; }
  if (a > 1) a = 1;
  // Straight unmultiply overshoots at low alpha: subtracting a WARM gold ground pushes
  // the result toward gold's complement, so sage goes mint, forest green goes blue-grey
  // and dusty pink goes lilac. Most of this art is low-alpha, so nearly everything cooled.
  // Trust the reconstruction only as far as alpha justifies, and fall back to the observed
  // pixel as alpha drops - at low alpha the observed colour is nearer the truth anyway.
  const trust = Math.min(1, a / 0.55);
  for (let k = 0; k < 3; k++) {
    const f = (src.data[i + k] - B[k] * (1 - a)) / a;
    const mixed = f * trust + src.data[i + k] * (1 - trust);
    out.data[i + k] = Math.max(0, Math.min(255, Math.round(mixed)));
  }
  out.data[i + 3] = Math.round(a * 255);
  if (a > 0.98) solid++; else partial++;
}
console.log("alpha: " + clear + " clear, " + partial + " partial, " + solid + " solid");
fs.writeFileSync(path.join(SIGN, "card-art.png"), PNG.sync.write(out));

function over(bgPath, name, flat) {
  const w = out.width, h = out.height;
  const res = new PNG({ width: w, height: h });
  let bg = null;
  if (bgPath) bg = PNG.sync.read(fs.readFileSync(bgPath));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const d = (y * w + x) << 2;
      let base = flat;
      if (bg && x < bg.width && y < bg.height) {
        const b = (y * bg.width + x) << 2;
        base = [bg.data[b], bg.data[b + 1], bg.data[b + 2]];
      }
      const a = out.data[d + 3] / 255;
      for (let k = 0; k < 3; k++) {
        res.data[d + k] = Math.round(out.data[d + k] * a + base[k] * (1 - a));
      }
      res.data[d + 3] = 255;
    }
  }
  fs.writeFileSync(path.join(SIGN, name), PNG.sync.write(res));
}

over(FRAME, "card-art-on-paper.png", [246, 233, 218]);
over(null, "card-art-on-magenta.png", [255, 0, 255]);
console.log("wrote card-art.png, card-art-on-paper.png, card-art-on-magenta.png");
