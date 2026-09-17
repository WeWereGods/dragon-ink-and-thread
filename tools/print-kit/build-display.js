// Full-size PORTRAIT display sign: the company name large, the sleeping dragon, and
// three SMALL QR codes. Letter portrait, 816 x 1056 CSS px.
//
// ⚠️ Every visual element comes from Business_Card_FRONT.png and nothing else, because
// its parchment (~#F5E7D6) is lighter than the #f0ddbc frame the other signs use.
// Borrowing the dragon from one file and the borders from another puts a visibly paler
// rectangle round him. One file in, no seams.
//
// The wordmark is LIVE TEXT reading "INK AND THREAD". The card art itself says "&";
// the standing repo rule is the word "and", so their picture of it is never used.
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const jsQR = require("jsqr");
const { PNG } = require("pngjs");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
const F = path.join(SIGN, "front").replace(/\\/g, "/");
const u = (n) => "file:///" + F + "/" + n;

const CODES = [
  { key: "d-shop", url: "https://www.dragoninkandthread.com/shop.html", label: "Shop", sub: "every piece" },
  { key: "d-join", url: "https://www.dragoninkandthread.com/#join", label: "Join the Nest", sub: "free patterns" },
  { key: "d-custom", url: "https://www.dragoninkandthread.com/custom.html", label: "Custom", sub: "your fabric" },
];

// Small, as asked - but not so small they stop scanning. Verified from the render.
const QR = 132;

const css = [
  ":root{--paper:#f5e7d6;--green:#2f4029;--sage:#938858;--wine:#7b322c;--rose:#9e5e58;--ink:#3b3327;",
  "  --display:'Cormorant Garamond',Georgia,serif;--script:'Great Vibes','Segoe Script',cursive;--body:'Nunito','Segoe UI',sans-serif;}",
  "@page{size:letter;margin:0;}",
  "*{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}",
  "html,body{width:816px;background:#fff;}",
  "body{font-family:var(--body);color:var(--ink);}",
  // FLAT paper, no tile. A 44x54 patch cut from the card caught a small gold ornament
  // and tiling it wallpapered the page in gold marks. Mean tone could not detect that -
  // one tiny high-contrast mark barely moves an average - so the lesson is: never accept
  // a texture patch on its average alone, LOOK at it. Flat sidesteps the problem entirely,
  // and the vines and dragon bring all the texture this needs.
  ".page{position:relative;width:816px;height:1056px;overflow:hidden;background-color:var(--paper);}",
  // Four border strips, each carrying its own matching paper. The bottom pair is the
  // same art flipped, which reads as intentional symmetry rather than repetition.
  // Each crop is a rectangle of borrowed paper, so its edges are masked to fade into the
  // flat field rather than ending on a hard line.
  ".v{position:absolute;width:150px;height:369px;background-size:150px 369px;background-repeat:no-repeat;",
  "  -webkit-mask-composite:source-in;mask-composite:intersect;}",
  ".vlt,.vlb{-webkit-mask-image:linear-gradient(90deg,#000 52%,transparent 100%),linear-gradient(180deg,transparent 0,#000 11%,#000 89%,transparent 100%);",
  "  mask-image:linear-gradient(90deg,#000 52%,transparent 100%),linear-gradient(180deg,transparent 0,#000 11%,#000 89%,transparent 100%);}",
  ".vrt,.vrb{-webkit-mask-image:linear-gradient(270deg,#000 52%,transparent 100%),linear-gradient(180deg,transparent 0,#000 11%,#000 89%,transparent 100%);",
  "  mask-image:linear-gradient(270deg,#000 52%,transparent 100%),linear-gradient(180deg,transparent 0,#000 11%,#000 89%,transparent 100%);}",
  ".vlt{left:0;top:40px;background-image:url('" + u("vine-left.png") + "');}",
  ".vrt{right:0;top:40px;background-image:url('" + u("vine-right.png") + "');}",
  ".vlb{left:0;top:647px;background-image:url('" + u("vine-left.png") + "');transform:scaleY(-1);}",
  ".vrb{right:0;top:647px;background-image:url('" + u("vine-right.png") + "');transform:scaleY(-1);}",
  // Everything readable lives in the clear column between the borders: x 150 to 666.
  ".ctr{position:absolute;left:170px;right:170px;text-align:center;}",
  ".w1{font-family:var(--display);font-weight:700;font-size:92px;line-height:1;color:var(--green);letter-spacing:.02em;}",
  ".w2{font-family:var(--display);font-weight:600;font-size:39px;line-height:1;color:var(--green);letter-spacing:.09em;margin-top:6px;}",
  ".tag{font-family:var(--display);font-style:italic;font-size:29px;line-height:1.3;color:var(--wine);}",
  ".rule{display:flex;align-items:center;justify-content:center;gap:12px;}",
  ".rule i{height:1.4px;background:linear-gradient(90deg,transparent,var(--sage),transparent);flex:1;max-width:120px;}",
  ".rule b{color:var(--wine);font-size:14px;line-height:1;}",
  ".dragon{position:absolute;left:50%;width:500px;margin-left:-250px;}",
  ".dragon img{display:block;width:500px;",
  "  -webkit-mask-image:linear-gradient(90deg,transparent 0,#000 9%,#000 91%,transparent 100%),linear-gradient(180deg,transparent 0,#000 14%,#000 100%);",
  "  mask-image:linear-gradient(90deg,transparent 0,#000 9%,#000 91%,transparent 100%),linear-gradient(180deg,transparent 0,#000 14%,#000 100%);",
  "  -webkit-mask-composite:source-in;mask-composite:intersect;}",
  ".qrs{position:absolute;left:158px;right:158px;display:flex;justify-content:space-between;}",
  ".q{width:" + QR + "px;text-align:center;}",
  ".q img{display:block;width:" + QR + "px;height:" + QR + "px;border:1.2px solid var(--sage);}",
  ".q .lb{font-family:var(--display);font-weight:600;font-size:21px;line-height:1.1;color:var(--green);margin-top:7px;}",
  ".q .sb{font-family:var(--script);font-size:19px;line-height:1;color:var(--rose);margin-top:1px;}",
  ".foot{font-family:var(--body);font-weight:800;letter-spacing:.05em;color:var(--green);text-transform:uppercase;font-size:13px;line-height:1.6;}",
].join("\n");

(async () => {
  for (const c of CODES) {
    c.png = await QRCode.toBuffer(c.url, {
      errorCorrectionLevel: "H", margin: 1, width: 900,
      color: { dark: "#3b3327", light: "#f5e7d6" },
    });
    const file = path.join(SIGN, "qr-" + c.key + ".png");
    fs.writeFileSync(file, c.png);
    const img = PNG.sync.read(c.png);
    const hit = jsQR(new Uint8ClampedArray(img.data), img.width, img.height);
    if (!hit || hit.data !== c.url) throw new Error("QR " + c.key + " failed");
    console.log("QR " + c.key + " ok");
    c.src = "file:///" + file.replace(/\\/g, "/");
  }

  const qrs = CODES.map((c) =>
    '<div class="q"><img src="' + c.src + '" alt="">' +
    '<div class="lb">' + c.label + '</div><div class="sb">' + c.sub + "</div></div>"
  ).join("");

  const body =
    '<div class="page">' +
    '<span class="v vlt"></span><span class="v vrt"></span>' +
    '<span class="v vlb"></span><span class="v vrb"></span>' +
    '<div class="ctr" style="top:112px"><div class="w1">DRAGON</div><div class="w2">INK AND THREAD</div></div>' +
    '<div class="ctr tag" style="top:272px">Handmade goods<br>for cozy little adventures</div>' +
    '<div class="ctr" style="top:356px"><span class="rule"><i></i><b>&#10084;</b><i></i></span></div>' +
    '<div class="dragon" style="top:392px"><img src="' + u("dragon.png") + '" alt=""></div>' +
    '<div class="ctr" style="top:590px"><span class="rule"><i></i><b>&#10022;</b><i></i></span></div>' +
    '<div class="qrs" style="top:626px">' + qrs + "</div>" +
    '<div class="ctr foot" style="top:848px">Scan to shop, or find me on</div>' +
    '<div class="ctr foot" style="top:882px">@dragonink_and_thread<br>dragoninkandthread.com</div>' +
    "</div>";

  const html = ['<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Display sign</title>',
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Great+Vibes&family=Nunito:wght@600;700;800&display=swap" rel="stylesheet">',
    "<style>" + css + "</style></head><body>", body, "</body></html>"].join("\n");

  fs.writeFileSync(path.join(SIGN, "d-display.html"), html);
  console.log("wrote d-display.html");
})().catch((e) => { console.error(e); process.exitCode = 1; });
