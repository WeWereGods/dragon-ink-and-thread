// Prove the alpha channel is right. A parchment composite can hide a bad key,
// because cream-on-cream looks fine even where alpha is wrong. Compositing over
// magenta makes any surviving yellow fringe or eaten hole impossible to miss.
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
const keyed = PNG.sync.read(fs.readFileSync(path.join(SIGN, "card-art-keyed.png")));

// Alpha histogram first - numbers before pictures.
let opaque = 0, clear = 0, partial = 0;
for (let i = 3; i < keyed.data.length; i += 4) {
  const a = keyed.data[i];
  if (a === 0) clear++;
  else if (a === 255) opaque++;
  else partial++;
}
const total = keyed.width * keyed.height;
console.log("alpha: " + clear + " clear, " + partial + " partial, " + opaque + " opaque (of " + total + ")");
console.log("opaque share: " + (100 * opaque / total).toFixed(1) + "%");

// The gold buttons and cream flower centres sit nearest the key colour, so they
// are where an over-aggressive key shows up. Report how much of the art survives
// in the two clusters separately - a hole in one would drag its share down.
function share(x0, x1) {
  let op = 0, n = 0;
  for (let y = 0; y < keyed.height; y++) {
    for (let x = x0; x < x1; x++) {
      n++;
      if (keyed.data[((y * keyed.width + x) << 2) + 3] > 128) op++;
    }
  }
  return (100 * op / n).toFixed(1) + "%";
}
console.log("left cluster (books/spool) solid: " + share(0, 520));
console.log("right cluster (dragon/nest) solid: " + share(640, keyed.width));

const MAG = { r: 255, g: 0, b: 255 };
const out = new PNG({ width: keyed.width, height: keyed.height });
for (let y = 0; y < keyed.height; y++) {
  for (let x = 0; x < keyed.width; x++) {
    const s = (y * keyed.width + x) << 2;
    const a = keyed.data[s + 3] / 255;
    out.data[s] = Math.round(keyed.data[s] * a + MAG.r * (1 - a));
    out.data[s + 1] = Math.round(keyed.data[s + 1] * a + MAG.g * (1 - a));
    out.data[s + 2] = Math.round(keyed.data[s + 2] * a + MAG.b * (1 - a));
    out.data[s + 3] = 255;
  }
}
fs.writeFileSync(path.join(SIGN, "key-on-magenta.png"), PNG.sync.write(out));
console.log("wrote key-on-magenta.png");
