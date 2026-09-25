// WHAT THE SEAL ARTWORK LOOKS LIKE AS A RUBBER STAMP. Asked 2026-09-25.
//
//   node experiments/stamp-test-dragon.js            the sleeping dragon
//   node experiments/stamp-test-dragon.js wordmark   the wordmark badge
//
// A rubber stamp is ONE SOLID COLOUR. There is no grey: the raised rubber takes ink and
// everything else does not. So the only honest preview is to threshold the relief map -
// raised (light) becomes ink, everything else becomes paper - and look at the result.
//
// The dragon FAILS at every level (see stamp-sheet). He is built out of tone, and tone is
// what a one-colour stamp cannot print. The wordmark is line work, so it behaves better -
// but watch for HOLLOW LETTERING: the render is lit, so a bevelled letter can threshold
// into an outline rather than a solid shape.
//
// Kept in experiments/ for the same reason as the three unmultiply attempts: so nobody
// has to wonder again.
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const ROOT = path.join(__dirname, "..", "..", "..");
const which = process.argv[2] === "wordmark" ? "wordmark" : "dragon";
const src = PNG.sync.read(fs.readFileSync(path.join(ROOT, "assets", "seal-" + which + "-35mm.png")));

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
const pre = which === "wordmark" ? "stampw-" : "stamp-";
for (const t of LEVELS) fs.writeFileSync(path.join(__dirname, pre + t + ".png"), PNG.sync.write(threshold(t)));
console.log("wrote " + LEVELS.map((t) => pre + t + ".png").join(", "));
