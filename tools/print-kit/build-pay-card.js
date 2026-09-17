// Scan to Pay on the parchment base. Same three Stripe quick-checkout links and the
// same market prices as the existing card - tax included, one kind of item per scan.
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const jsQR = require("jsqr");
const { PNG } = require("pngjs");
const base = require("./paper-base");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
const CODES = [
  { key: "p-pay-scrunchie", url: "https://buy.stripe.com/8x2eVddpM76F6lcgBPfjG0v", name: "Scrunchie", price: "$6" },
  { key: "p-pay-bow", url: "https://buy.stripe.com/4gMbJ1bhEaiR24WgBPfjG0w", name: "Bow", price: "$12" },
  { key: "p-pay-bandana", url: "https://buy.stripe.com/fZu3cvadAgHf6lcgBPfjG0u", name: "Pet Bandana", price: "$18" },
];

(async () => {
  for (const c of CODES) {
    c.png = await QRCode.toBuffer(c.url, {
      errorCorrectionLevel: "H", margin: 1, width: 900,
      color: { dark: "#3b3327", light: "#f0ddbc" },
    });
    const file = path.join(SIGN, "qr-" + c.key + ".png");
    fs.writeFileSync(file, c.png);
    const img = PNG.sync.read(c.png);
    const hit = jsQR(new Uint8ClampedArray(img.data), img.width, img.height);
    if (!hit || hit.data !== c.url) throw new Error("QR " + c.key + " failed");
    console.log("QR " + c.key + " decodes to " + c.url);
    c.src = "file:///" + file.replace(/\\/g, "/");
  }

  const css = [
    ".head{top:100px;left:200px;right:200px;}",
    ".sub{top:234px;}",
    ".ruleA{top:288px;}",
    ".row{position:absolute;left:124px;right:124px;height:176px;display:flex;align-items:center;gap:28px;}",
    ".row img{width:150px;height:150px;display:block;flex:none;border:1.5px solid var(--sage);}",
    ".t{flex:1;}",
    ".nm{font-family:var(--display);font-weight:600;font-size:44px;line-height:1;color:var(--green);}",
    ".pr{font-family:var(--display);font-weight:700;font-size:52px;line-height:1.05;color:var(--wine);margin-top:2px;}",
    ".sb{font-family:var(--script);font-size:27px;line-height:1;color:var(--rose);margin-top:6px;}",
    ".sep{position:absolute;left:150px;right:150px;height:1.5px;background:linear-gradient(90deg,transparent,rgba(147,136,88,.7),transparent);}",
    ".f1{top:892px;font-size:17px;}",
    ".f2{top:924px;left:200px;right:200px;font-family:var(--display);font-style:italic;font-size:20px;color:var(--ink);text-transform:none;letter-spacing:0;}",
    ".foot3{top:968px;left:210px;right:210px;font-size:14px;line-height:1.5;}",
  ].join("\n");

  const rows = CODES.map((c, i) =>
    '<div class="row" style="top:' + (330 + i * 190) + 'px"><img src="' + c.src + '" alt="">' +
    '<div class="t"><div class="nm">' + c.name + '</div><div class="pr">' + c.price + "</div>" +
    '<div class="sb">scan, choose how many, pay</div></div></div>' +
    (i < 2 ? '<div class="sep" style="top:' + (330 + i * 190 + 180) + 'px"></div>' : "")
  ).join("");

  const body = base.page(
    '<div class="center head">' + base.wordmark(58, 31) + "</div>" +
    '<div class="center sub"><span class="script" style="font-size:38px">card, Apple Pay or Google Pay</span></div>' +
    '<div class="center ruleA"><span class="rule"><i></i><b>&#10084;</b><i></i></span></div>' +
    rows +
    '<div class="center foot f1">Prices include sales tax &#183; one kind of item per scan</div>' +
    '<div class="center f2">Anything else, or a mix? Pay at the table.</div>' +
    '<div class="center foot foot3">@dragonink_and_thread &#183; dragoninkandthread.com</div>'
  );

  fs.writeFileSync(path.join(SIGN, "p-pay-sign.html"), base.doc("Scan to Pay", css, body));
  console.log("wrote p-pay-sign.html");
})().catch((e) => { console.error(e); process.exitCode = 1; });
