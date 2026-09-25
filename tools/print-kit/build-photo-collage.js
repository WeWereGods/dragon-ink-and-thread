// A 2x2 photo collage at 1080 x 1350 for Facebook and Instagram.
//
//   node build-photo-collage.js --photos a.jpg,b.jpg,c.jpg,d.jpg --out kindle-sleeve
//                              [--eyebrow "made to order"] [--title "A Kindle Sleeve"]
//
// Then render at 1080x1350 with headless Edge (render.ps1 only knows letter and 4x6):
//   see the RENDER line printed at the end.
//
// 📌 Photos are referenced by ABSOLUTE file:/// path, so they can live anywhere -
// Downloads, assets, wherever the phone dropped them. Nothing is copied into the repo.
//
// ⚠️ Cells are `object-fit: cover`, so each photo is CENTRE-CROPPED to 4:5. Check the
// render before posting: a subject sitting near an edge will lose its head. Portrait
// phone photos (3:4) crop gracefully; landscape ones lose a lot.
const fs = require("fs");
const path = require("path");
const b = require("./paper-base");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });

const arg = (name, dflt) => {
  const i = process.argv.indexOf("--" + name);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : dflt;
};

const photos = arg("photos", "").split(",").map((s) => s.trim()).filter(Boolean);
if (photos.length !== 4) throw new Error("need exactly 4 photos: --photos a.jpg,b.jpg,c.jpg,d.jpg");
for (const p of photos) if (!fs.existsSync(p)) throw new Error("no such photo: " + p);

const out = arg("out", "collage");
const eyebrow = arg("eyebrow", "");
const title = arg("title", "");
const url = (p) => "file:///" + path.resolve(p).replace(/\\/g, "/");

const css = [
  "html,body{width:1080px;height:1350px;background:#fff;}",
  ".page{position:relative;width:1080px;height:1350px;background-color:var(--paper);",
  "  background-image:url('" + b.url("paper.png") + "');background-size:320px 300px;overflow:hidden;",
  "  display:flex;flex-direction:column;padding:34px 34px 26px;}",
  ".top{text-align:center;flex:none;}",
  ".top .eb{font-family:var(--script);font-size:40px;color:var(--wine);line-height:1;margin-bottom:4px;}",
  ".top .w1{font-family:var(--display);font-weight:700;font-size:40px;color:var(--green);letter-spacing:.03em;line-height:1;}",
  ".top .w2{font-family:var(--display);font-weight:600;font-size:17px;letter-spacing:.3em;color:var(--green);margin-top:3px;}",
  ".grid{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:14px;margin:18px 0 14px;}",
  ".grid img{display:block;min-height:0;}",
  ".grid img{width:100%;height:100%;object-fit:cover;border:4px solid rgba(147,136,88,.55);border-radius:5px;}",
  ".ttl{text-align:center;font-family:var(--display);font-weight:700;font-size:34px;color:var(--wine);line-height:1.05;}",
  ".ft{text-align:center;font-family:var(--body);font-weight:800;font-size:16px;letter-spacing:.13em;",
  "  text-transform:uppercase;color:var(--sage);margin-top:7px;line-height:1.6;}",
].join("\n");

const body =
  '<div class="page">' +
    '<div class="top">' +
      (eyebrow ? '<div class="eb">' + eyebrow + "</div>" : "") +
      '<div class="w1">DRAGON</div><div class="w2">INK AND THREAD</div>' +
    "</div>" +
    '<div class="grid">' + photos.map((p) => '<img src="' + url(p) + '">').join("") + "</div>" +
    (title ? '<div class="ttl">' + title + "</div>" : "") +
    '<div class="ft">handmade in San Antonio<br>@dragonink_and_thread &#183; dragoninkandthread.com</div>' +
  "</div>";

const file = path.join(SIGN, out + ".html");
fs.writeFileSync(file, b.doc("Collage", css, body));
console.log("wrote " + out + ".html");
console.log("RENDER: headless Edge at --window-size=1080,1350 against build/" + out + ".html");
