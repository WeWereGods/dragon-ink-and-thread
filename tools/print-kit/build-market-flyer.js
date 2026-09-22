// Market flyer — 1080 x 1350 (Instagram / Facebook portrait) in the parchment kit look.
// Made 2026-09-22 for Sep 26 and kept, because four more markets follow it.
//
// ⚠️ EVENT NAME, ADDRESS AND ORGANISER STAY OUT OF THIS PUBLIC REPO — pass them in:
//   node build-market-flyer.js --day "Saturday, September 26" --time "4 - 9 PM" \
//     --venue "..." --addr "..." --note "..." --photos a.jpg,b.jpg,c.jpg
// Then render it at 1080x1350 (render.ps1 is letter/4x6 only, so use a one-off Edge call).
// Photos are repo-relative or absolute paths; the defaults are stand-ins.
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
const fileUrl = (p) => "file:///" + path.resolve(p).replace(/\\/g, "/");

const args = {};
process.argv.slice(2).forEach((a, i, all) => { if (a.startsWith("--")) args[a.slice(2)] = all[i + 1]; });

const day = args.day || "[DAY]";
const time = args.time || "[TIME]";
const venue = args.venue || "[VENUE]";
const addr = args.addr || "[ADDRESS]";
const note = args.note || "";
const nw = args["new"] || "New: hair whimsys &amp; gift card holders";
const photos = (args.photos || "assets/tote-butterfly.jpg,assets/bow-cauldron-forged.jpg,assets/bandana-quilted-court.jpg")
  .split(",").map((p) => fileUrl(path.isAbsolute(p.trim()) ? p.trim() : path.join(ROOT, p.trim())));

const TEMPLATE = "<!DOCTYPE html>\n<html lang=\"en\"><head><meta charset=\"utf-8\"><title>Sep 26 flyer</title>\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link href=\"https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700&family=Great+Vibes&family=Nunito:wght@600;700;800&display=swap\" rel=\"stylesheet\">\n<style>\n  :root{--paper:#f0ddbc;--green:#4e5839;--sage:#938858;--wine:#7b322c;--rose:#9e5e58;--ink:#3b3327;\n        --display:'Cormorant Garamond',Georgia,serif;--script:'Great Vibes',cursive;--body:'Nunito',sans-serif;}\n  *{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact;}\n  html,body{width:1080px;height:1350px;overflow:hidden;font-family:var(--body);color:var(--ink);}\n  .page{position:relative;width:1080px;height:1350px;background-color:var(--paper);\n        background-image:url('__KIT__/kit/paper.png');\n        background-size:320px 300px;overflow:hidden;}\n  .c{position:absolute;width:300px;height:300px;background-size:300px 300px;\n     -webkit-mask-composite:source-in;mask-composite:intersect;}\n  .tl{left:0;top:0;background-image:url('__KIT__/kit/corner-tl.png');-webkit-mask-image:linear-gradient(to right,#000 68%,transparent),linear-gradient(to bottom,#000 68%,transparent);}\n  .tr{right:0;top:0;background-image:url('__KIT__/kit/corner-tr.png');-webkit-mask-image:linear-gradient(to left,#000 68%,transparent),linear-gradient(to bottom,#000 68%,transparent);}\n  .bl{left:0;bottom:0;width:210px;height:210px;background-size:210px 210px;background-image:url('__KIT__/kit/corner-bl.png');-webkit-mask-image:linear-gradient(to right,#000 68%,transparent),linear-gradient(to top,#000 68%,transparent);}\n  .br{right:0;bottom:0;width:210px;height:210px;background-size:210px 210px;background-image:url('__KIT__/kit/corner-br.png');-webkit-mask-image:linear-gradient(to left,#000 68%,transparent),linear-gradient(to top,#000 68%,transparent);}\n  .ctr{position:absolute;left:70px;right:70px;text-align:center;}\n  .eyebrow{top:74px;font-family:var(--script);font-size:46px;color:var(--wine);line-height:1;}\n  .dragon{position:absolute;left:50%;top:122px;width:330px;margin-left:-165px;\n          -webkit-mask-image:radial-gradient(ellipse 60% 64% at 50% 50%,#000 66%,transparent);}\n  .w1{top:236px;font-family:var(--display);font-weight:700;font-size:74px;line-height:1;color:var(--green);letter-spacing:.02em;}\n  .w2{top:314px;font-family:var(--display);font-weight:600;font-size:30px;letter-spacing:.3em;color:var(--green);}\n  .ruleA{top:368px;}\n  .rule{display:flex;align-items:center;justify-content:center;gap:16px;}\n  .rule i{height:2px;background:linear-gradient(90deg,transparent,var(--sage),transparent);flex:1;max-width:220px;}\n  .rule b{color:var(--wine);font-size:17px;line-height:1;}\n  .when{top:398px;}\n  .when .day{font-family:var(--display);font-weight:700;font-size:56px;color:var(--wine);line-height:1.05;}\n  .when .time{font-family:var(--body);font-weight:800;font-size:27px;letter-spacing:.14em;color:var(--green);margin-top:8px;}\n  .where{top:524px;font-family:var(--display);font-size:29px;line-height:1.35;color:var(--ink);}\n  .where .ev{display:block;font-family:var(--body);font-weight:800;font-size:17px;letter-spacing:.11em;text-transform:uppercase;color:var(--rose);margin-top:8px;}\n  .where b{font-weight:700;color:var(--green);}\n  .photos{position:absolute;left:70px;right:70px;top:668px;display:flex;gap:18px;}\n  .photos img{flex:1;width:100%;height:232px;object-fit:cover;border:3px solid rgba(147,136,88,.55);border-radius:6px;}\n  .bring{top:926px;font-family:var(--display);font-size:30px;line-height:1.45;color:var(--ink);}\n  .bring b{font-weight:700;color:var(--green);}\n  .new{top:1062px;}\n  .new span{display:inline-block;font-family:var(--display);font-weight:700;font-size:28px;color:var(--wine);\n            border:2.5px solid var(--rose);border-radius:999px;padding:8px 34px;background:rgba(255,255,255,.35);}\n  .deal{top:1124px;font-family:var(--script);font-size:38px;color:var(--wine);line-height:1;}\n  .pay{top:1182px;font-weight:800;font-size:21px;letter-spacing:.14em;text-transform:uppercase;color:var(--green);}\n  .ft{top:1236px;font-family:var(--body);font-weight:800;font-size:17px;letter-spacing:.14em;text-transform:uppercase;color:var(--sage);line-height:1.7;}\n</style></head><body>\n<div class=\"page\">\n  <span class=\"c tl\"></span><span class=\"c tr\"></span><span class=\"c bl\"></span><span class=\"c br\"></span>\n\n  <div class=\"ctr eyebrow\">come find me at</div>\n  <img class=\"dragon\" src=\"__KIT__/front/dragon.png\">\n  <div class=\"ctr w1\">DRAGON</div>\n  <div class=\"ctr w2\">INK AND THREAD</div>\n  <div class=\"ctr ruleA\"><span class=\"rule\"><i></i><b>&#10084;</b><i></i></span></div>\n\n  <div class=\"ctr when\">\n    <div class=\"day\">__DAY__</div>\n    <div class=\"time\">__TIME__</div>\n  </div>\n  <div class=\"ctr where\"><b>__VENUE__</b><br>__ADDR__<span class=\"ev\">__NOTE__</span></div>\n\n  <div class=\"photos\">\n    <img src=\"__PHOTO1__\">\n    <img src=\"__PHOTO2__\">\n    <img src=\"__PHOTO3__\">\n  </div>\n\n  <div class=\"ctr bring\">Totes &middot; bows &middot; scrunchies &middot; book sleeves<br>dog bandanas &middot; sachets &middot; gift card holders</div>\n  <div class=\"ctr new\"><span>__NEW__</span></div>\n  <div class=\"ctr deal\">any 2 of the little things for $10</div>\n  <div class=\"ctr pay\">Cash &amp; card &middot; tax included</div>\n  <div class=\"ctr ft\">@dragonink_and_thread<br>dragoninkandthread.com</div>\n</div>\n</body></html>\n";

const html = TEMPLATE
  .split("__KIT__").join(fileUrl(path.join(__dirname, "build")))
  .split("__ASSETS__").join(fileUrl(path.join(ROOT, "assets")))
  .split("__PHOTO1__").join(photos[0])
  .split("__PHOTO2__").join(photos[1] || photos[0])
  .split("__PHOTO3__").join(photos[2] || photos[0])
  .split("__DAY__").join(day)
  .split("__TIME__").join(time)
  .split("__VENUE__").join(venue)
  .split("__ADDR__").join(addr)
  .split("__NOTE__").join(note)
  .split("__NEW__").join(nw);

fs.writeFileSync(path.join(SIGN, "market-flyer.html"), html);
console.log("wrote market-flyer.html — render it at 1080x1350");
