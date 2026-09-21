// "Ask about custom orders" sign on the parchment base, for the market table.
// One QR, to custom.html. No prices on purpose: baby items have no published band
// yet, and repairs are quoted on sight. The sign's job is to start a conversation.
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const jsQR = require("jsqr");
const { PNG } = require("pngjs");
const base = require("./paper-base");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
const URL = "https://www.dragoninkandthread.com/custom.html";

const ITEMS = [
  { name: "Baby items", desc: "Blankets, bibs and sweet little gifts" },
  { name: "Quilt mending", desc: "Tears, worn binding, loose seams, well-loved quilts" },
  { name: "Totes and book sleeves", desc: "Your fabric, your size, your pockets" },
  { name: "Christmas stockings", desc: "Order early for the holidays" },
];

(async () => {
  const png = await QRCode.toBuffer(URL, {
    errorCorrectionLevel: "H", margin: 1, width: 900,
    color: { dark: "#3b3327", light: "#f0ddbc" },
  });
  fs.writeFileSync(path.join(SIGN, "qr-p-custom-sign.png"), png);
  const img = PNG.sync.read(png);
  const hit = jsQR(new Uint8ClampedArray(img.data), img.width, img.height);
  if (!hit || hit.data !== URL) throw new Error("QR failed: " + (hit ? hit.data : "nothing"));
  console.log("QR decodes to " + URL);
  const src = "file:///" + path.join(SIGN, "qr-p-custom-sign.png").replace(/\\/g, "/");

  const css = [
    ".head{top:100px;left:200px;right:200px;}",
    ".title{top:228px;font-family:var(--display);font-weight:700;font-size:54px;color:var(--wine);line-height:1;}",
    ".sub{top:292px;}",
    ".ruleA{top:348px;}",
    ".items{position:absolute;left:130px;right:130px;top:376px;}",
    ".item{padding:13px 0 12px;border-bottom:1.5px dashed rgba(147,136,88,.6);text-align:center;}",
    ".item:last-child{border-bottom:0;}",
    ".nm{font-family:var(--display);font-weight:600;font-size:38px;line-height:1.05;color:var(--green);}",
    ".ds{margin-top:5px;font-size:18px;font-weight:700;color:var(--sage);}",
    ".qr{position:absolute;left:50%;top:772px;width:170px;margin-left:-85px;text-align:center;}",
    ".qr img{display:block;width:150px;height:150px;margin:0 auto;border:1.5px solid var(--sage);}",
    ".qr .s{font-family:var(--script);color:var(--wine);font-size:26px;line-height:1;margin-top:4px;}",
    ".ask{top:968px;left:210px;right:210px;font-family:var(--display);font-style:italic;font-size:20px;color:var(--ink);}",
  ].join("\n");

  const items = ITEMS.map((i) =>
    '<div class="item"><div class="nm">' + i.name + '</div><div class="ds">' + i.desc + "</div></div>"
  ).join("");

  const body = base.page(
    '<div class="center head">' + base.wordmark(56, 30) + "</div>" +
    '<div class="center title">Ask about custom orders</div>' +
    '<div class="center sub"><span class="script" style="font-size:36px">made just for you, by hand</span></div>' +
    '<div class="center ruleA"><span class="rule"><i></i><b>&#10084;</b><i></i></span></div>' +
    '<div class="items">' + items + "</div>" +
    '<div class="qr"><img src="' + src + '" alt=""><div class="s">scan to start yours</div></div>' +
    '<div class="center ask">Just ask me! Or @dragonink_and_thread</div>'
  );

  fs.writeFileSync(path.join(SIGN, "p-custom-sign.html"), base.doc("Custom Orders", css, body));
  console.log("wrote p-custom-sign.html");
})().catch((e) => { console.error(e); process.exitCode = 1; });
