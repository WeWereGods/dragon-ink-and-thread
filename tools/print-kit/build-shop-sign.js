// Proof sheet: "Scan to Shop" on the parchment, to test paper tone + corners at
// full letter size before the other four are built on the same base.
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const jsQR = require("jsqr");
const { PNG } = require("pngjs");
const base = require("./paper-base");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
const CODES = [
  { key: "p-shop", url: "https://www.dragoninkandthread.com/shop.html", label: "Shop the collection", sub: "every piece, anytime" },
  { key: "p-join", url: "https://www.dragoninkandthread.com/#join", label: "Join the Nest", sub: "new makes & free patterns" },
  { key: "p-custom", url: "https://www.dragoninkandthread.com/custom.html", label: "Custom orders", sub: "your fabric, your size" },
];

(async () => {
  for (const c of CODES) {
    c.png = await QRCode.toBuffer(c.url, {
      errorCorrectionLevel: "H", margin: 1, width: 900,
      color: { dark: "#3b3327", light: "#f0ddbc" },
    });
    fs.writeFileSync(path.join(SIGN, "qr-" + c.key + ".png"), c.png);
    const img = PNG.sync.read(c.png);
    const hit = jsQR(new Uint8ClampedArray(img.data), img.width, img.height);
    if (!hit || hit.data !== c.url) throw new Error("QR " + c.key + " failed: " + (hit ? hit.data : "nothing"));
    console.log("QR " + c.key + " decodes to " + c.url);
  }
  const src = (k) => "file:///" + path.join(SIGN, "qr-" + k + ".png").replace(/\\/g, "/");

  const css = [
    // Corner sprays are 250px square, so anything full-width must clear them or it
    // collides. Headline and footer sit inside a narrower column for that reason.
    ".head{top:112px;left:200px;right:200px;}",
    ".sub{top:250px;}",
    ".ruleA{top:306px;}",
    ".card{position:absolute;text-align:center;}",
    ".card img{display:block;margin:0 auto;border:1.5px solid var(--sage);}",
    ".card .lab{font-family:var(--display);font-weight:600;color:var(--green);line-height:1.1;}",
    ".card .s{font-family:var(--script);color:var(--wine);line-height:1;}",
    ".big{left:50%;top:330px;width:300px;margin-left:-150px;}",
    ".big img{width:250px;height:250px;}",
    ".big .lab{font-size:29px;margin-top:10px;} .big .s{font-size:27px;margin-top:2px;}",
    ".sm{top:664px;width:250px;} .sm img{width:170px;height:170px;}",
    // Script at 22px was too small to read on paper; the script face has a small
    // x-height, so it needs more size than a sans at the same nominal value.
    ".sm .lab{font-size:23px;margin-top:8px;} .sm .s{font-size:27px;margin-top:3px;}",
    ".s1{left:96px;} .s2{right:96px;}",
    ".ruleB{top:904px;}",
    ".foot{top:938px;left:210px;right:210px;font-size:14px;line-height:1.5;}",
  ].join("\n");

  const body = base.page(
    '<div class="center head">' + base.wordmark(64, 34) + "</div>" +
    '<div class="center sub"><span class="script" style="font-size:40px">Find your next little bit of magic</span></div>' +
    '<div class="center ruleA"><span class="rule"><i></i><b>&#10084;</b><i></i></span></div>' +
    '<div class="card big"><img src="' + src("p-shop") + '" alt=""><div class="lab">' + CODES[0].label + '</div><div class="s">' + CODES[0].sub + "</div></div>" +
    '<div class="card sm s1"><img src="' + src("p-join") + '" alt=""><div class="lab">' + CODES[1].label + '</div><div class="s">' + CODES[1].sub + "</div></div>" +
    '<div class="card sm s2"><img src="' + src("p-custom") + '" alt=""><div class="lab">' + CODES[2].label + '</div><div class="s">' + CODES[2].sub + "</div></div>" +
    '<div class="center ruleB"><span class="rule"><i></i><b>&#10022;</b><i></i></span></div>' +
    '<div class="center foot">@dragonink_and_thread &#183; dragoninkandthread.com</div>'
  );

  fs.writeFileSync(path.join(SIGN, "p-shop-sign.html"), base.doc("Scan to Shop", css, body));
  console.log("wrote p-shop-sign.html");
})().catch((e) => { console.error(e); process.exitCode = 1; });
