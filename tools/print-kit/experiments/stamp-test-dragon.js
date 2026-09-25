// WHAT THE SLEEPING DRAGON LOOKS LIKE AS A RUBBER STAMP. Asked 2026-09-25.
//
// A rubber stamp is ONE SOLID COLOUR. There is no grey: the raised rubber takes ink and
// everything else does not. So the only honest preview is to threshold the relief map -
// raised (light) becomes ink, everything else becomes paper - and look at the result.
//
// Kept in experiments/ for the same reason as the three unmultiply attempts: so nobody
// has to wonder again. Run it, look at the sheet, and see why the stamp is the wordmark
// badge and not a dragon.
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const ROOT = path.join(__dirname, "..", "..", "..");
const OUT = __dirname;
const src = PNG.sync.read(fs.readFileSync(path.join(ROOT, "assets", "seal-dragon-35mm.png")));

// Raised = light in the relief map, and raised rubber is what carries ink.
function threshold(t) {
  const o = new PNG({ width: src.width, height: src.height });
  for (let i = 0; i < src.data.length; i += 4) {
    const v = src.data[i];
    const ink = v >= t && v < 250;          // 250+ is the white outside the circle
    o.data[i] = o.data[i + 1] = o.data[i + 2] = ink ? 30 : 255;
    o.data[i + 3] = 255;
  }
  return o;
}

const LEVELS = [110, 130, 150, 170];
for (const t of LEVELS) {
  fs.writeFileSync(path.join(OUT, "stamp-" + t + ".png"), PNG.sync.write(threshold(t)));
}
console.log("wrote " + LEVELS.map((t) => "stamp-" + t + ".png").join(", "));
