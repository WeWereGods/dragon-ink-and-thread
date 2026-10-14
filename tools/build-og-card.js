// The social share card — the picture that appears when someone pastes the site
// link into Facebook, a message, Pinterest or a DM. 1200x630.
//
//   node tools/build-og-card.js          # writes build/og-card.html
//   then render it at 1200x630 and save as assets/og-image-v3.jpg
//
// ⚠️ A NEW FILENAME EVERY TIME, NEVER A REPLACEMENT. Facebook caches these hard
// and keys the cache on the URL, so overwriting og-image-v2.jpg would leave every
// existing share showing the old card indefinitely. v3 is a new file for that
// reason alone.
//
// ⛔ NOTHING ON THIS CARD MAY GO STALE. It is an image: once it is shared, no
// amount of editing HTML changes what people see. The v1 card said "Opening Late
// August" and was still the Facebook preview months after the shop opened — and
// as of 2026-10-14 fabrics.html was STILL pointing at it.
//   - no dates
//   - no "opening soon", no season, no year
//   - ⚠️ AND NO CITY. San Antonio stops being true around 2026-11-25. The fabric
//     banner was made with no city for exactly this reason, so it survives the
//     move; the share card gets the same treatment.
//
// 📌 Art is cropped WITH ITS OWN PAPER (the print kit's trick), so the background
// must be the SAME FLAT #f0ddbc or the crops show as boxes. The corner sprays get
// the same inner-edge feather paper-base.js uses.
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "tools", "print-kit", "build");
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const KIT = path.join(OUT, "kit").replace(/\\/g, "/");
const kit = (f) => "file:///" + KIT + "/" + f;
const asset = (f) => "file:///" + path.join(ROOT, "assets", f).replace(/\\/g, "/");

for (const f of ["corner-tl.png", "corner-tr.png", "corner-bl.png", "corner-br.png"]) {
  if (!fs.existsSync(path.join(KIT, f))) {
    console.error("⚠️  missing " + f + " — run `node cut-frame.js` in tools/print-kit first.");
    process.exitCode = 1;
    return;
  }
}

const C = 300; // corner spray, scaled up from the kit's native 250 for a wider canvas

const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<title>Share card</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500&family=Nunito:wght@700;800&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  html,body{width:1200px;height:630px;overflow:hidden;}
  .card{position:relative;width:1200px;height:630px;background:#f0ddbc;
    font-family:'Nunito',sans-serif;display:flex;flex-direction:column;
    align-items:center;justify-content:center;}
  /* Same feather as paper-base.js: without it each crop reads as a paler box. */
  .c{position:absolute;width:${C}px;height:${C}px;background-size:${C}px ${C}px;
     -webkit-mask-composite:source-in;mask-composite:intersect;}
  .tl{left:0;top:0;background-image:url('${kit("corner-tl.png")}');
    -webkit-mask-image:linear-gradient(to right,#000 66%,transparent),linear-gradient(to bottom,#000 66%,transparent);
    mask-image:linear-gradient(to right,#000 66%,transparent),linear-gradient(to bottom,#000 66%,transparent);}
  .tr{right:0;top:0;background-image:url('${kit("corner-tr.png")}');
    -webkit-mask-image:linear-gradient(to left,#000 66%,transparent),linear-gradient(to bottom,#000 66%,transparent);
    mask-image:linear-gradient(to left,#000 66%,transparent),linear-gradient(to bottom,#000 66%,transparent);}
  .bl{left:0;bottom:0;background-image:url('${kit("corner-bl.png")}');
    -webkit-mask-image:linear-gradient(to right,#000 66%,transparent),linear-gradient(to top,#000 66%,transparent);
    mask-image:linear-gradient(to right,#000 66%,transparent),linear-gradient(to top,#000 66%,transparent);}
  .br{right:0;bottom:0;background-image:url('${kit("corner-br.png")}');
    -webkit-mask-image:linear-gradient(to left,#000 66%,transparent),linear-gradient(to top,#000 66%,transparent);
    mask-image:linear-gradient(to left,#000 66%,transparent),linear-gradient(to top,#000 66%,transparent);}
  .dragon{width:360px;height:auto;display:block;margin-bottom:6px;}
  .word{font-family:'Cormorant Garamond',serif;font-weight:700;color:#4e5839;line-height:0.98;}
  .big{font-size:86px;letter-spacing:0.01em;}
  /* ⚠️ "AND", never "&". The card art itself spells it with an ampersand, which is
     exactly why this is live text instead of a picture of the name. */
  .sub{font-size:33px;letter-spacing:0.3em;margin-top:6px;}
  .rule{display:flex;align-items:center;justify-content:center;gap:16px;margin:20px 0 14px;width:460px;}
  .rule i{flex:1;height:1.6px;background:linear-gradient(90deg,transparent,#938858,transparent);}
  .rule b{width:11px;height:11px;background:#7b322c;transform:rotate(45deg);}
  .tag{font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:500;
       font-size:36px;color:#7b322c;}
  .badges{margin-top:22px;font-size:16px;font-weight:800;letter-spacing:0.17em;
          text-transform:uppercase;color:#938858;}
</style></head><body>
<div class="card">
  <span class="c tl"></span><span class="c tr"></span>
  <span class="c bl"></span><span class="c br"></span>
  <img class="dragon" src="${asset("hero-dragon.png")}" alt="">
  <div class="word big">DRAGON</div>
  <div class="word sub">INK AND THREAD</div>
  <div class="rule"><i></i><b></b><i></i></div>
  <div class="tag">Handmade heirlooms for everyday wonder</div>
  <div class="badges">Veteran&#8209;owned &#183; Small batch &#183; One of a kind</div>
</div>
</body></html>`;

const file = path.join(OUT, "og-card.html");
fs.writeFileSync(file, html, "utf8");
console.log("wrote " + file);
console.log("Next: render it at 1200x630 and save as assets/og-image-v3.jpg");
