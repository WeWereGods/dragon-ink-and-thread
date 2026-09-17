// "Scan to pay" table card: three Stripe quick-checkout links (market prices, tax included).
const fs = require("fs");
const path = require("path");
const ASSETS = path.join(__dirname, "..", "..", "..", "assets").replace(/\\/g, "/");
const QRCode = require("qrcode");
const jsQR = require("jsqr");
const { PNG } = require("pngjs");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
const CODES = [
  { key: "pay-scrunchie", url: "https://buy.stripe.com/8x2eVddpM76F6lcgBPfjG0v", name: "Scrunchie", price: "$6", border: "var(--rose)" },
  { key: "pay-bow", url: "https://buy.stripe.com/4gMbJ1bhEaiR24WgBPfjG0w", name: "Bow", price: "$12", border: "var(--honey)" },
  { key: "pay-bandana", url: "https://buy.stripe.com/fZu3cvadAgHf6lcgBPfjG0u", name: "Pet Bandana", price: "$18", border: "var(--teal)" },
];

(async () => {
  for (const c of CODES) {
    c.png = await QRCode.toBuffer(c.url, { errorCorrectionLevel: "H", margin: 1, width: 900, color: { dark: "#2b2520", light: "#ffffff" } });
    const file = path.join(SIGN, "qr-" + c.key + ".png");
    fs.writeFileSync(file, c.png);
    const img = PNG.sync.read(c.png);
    const hit = jsQR(new Uint8ClampedArray(img.data), img.width, img.height);
    const ok = hit && hit.data === c.url;
    console.log("QR " + c.key + ": " + (ok ? "decodes to " + c.url : "FAILED (" + (hit ? hit.data : "nothing") + ")"));
    if (!ok) throw new Error("QR check failed");
    c.src = "file:///" + file.replace(/\\/g, "/");
  }

  const rows = CODES.map((c, i) => `<div class="row" style="top:${300 + i * 200}px;border-color:${c.border}">
  <img src="${c.src}" alt="">
  <div class="text"><div class="name">${c.name}</div><div class="price">${c.price}</div><div class="sub">scan, choose how many, pay</div></div>
</div>`).join("\n");

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Scan to pay</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Great+Vibes&family=Nunito:wght@600;700;800&display=swap" rel="stylesheet">
<style>
:root { --teal-deep:#2f6b72; --teal:#4a9198; --clay-deep:#a34a6b; --honey:#d7a640; --honey-deep:#b9862a; --rose:#e7bcae; --ink:#453a30; --white:#fffdf7;
  --display:"Fraunces",Georgia,serif; --script:"Great Vibes","Segoe Script",cursive; --body:"Nunito","Segoe UI",sans-serif; }
@page { size: letter; margin: 0; }
* { box-sizing:border-box; margin:0; padding:0; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
html, body { width:816px; height:1056px; background:#fff; overflow:hidden; }
body { position:relative; font-family:var(--body); color:var(--ink); }
.frame { position:absolute; inset:30px; border-radius:26px; overflow:hidden; background-color:#fbf5ef;
  background-image: linear-gradient(180deg, rgba(255,253,247,.25), rgba(255,253,247,.12)), url("file:///" + ASSETS + "/gingham-pink.png");
  background-size:auto, 52px 52px; }
.panel { position:absolute; inset:54px; background:var(--white); border:2px solid var(--honey); border-radius:22px; box-shadow:0 10px 28px rgba(69,58,48,.12); }
.panel::after { content:""; position:absolute; inset:10px; border:2px dashed rgba(215,166,64,.6); border-radius:15px; }
.center { position:absolute; left:54px; right:54px; text-align:center; }
.eyebrow { top:88px; } .eyebrow span { display:inline-block; font-family:var(--script); font-size:34px; line-height:1.2; color:var(--honey-deep); padding:3px 30px 8px; border:1.5px solid var(--honey); border-radius:999px; background:var(--white); }
.title { top:138px; font-family:var(--display); font-weight:700; font-size:80px; line-height:1; letter-spacing:-1.5px; }
.tag { top:226px; font-family:var(--script); font-size:38px; line-height:1; color:var(--clay-deep); }
.rule { position:absolute; left:50%; top:272px; width:300px; margin-left:-150px; display:flex; align-items:center; gap:12px; }
.rule i { flex:1; height:2px; background:linear-gradient(90deg, transparent, var(--honey), transparent); }
.rule b { color:var(--honey); font-size:17px; line-height:1; }
.row { position:absolute; left:112px; right:112px; height:182px; background:#fff; border:2.5px solid var(--honey); border-radius:18px;
  box-shadow:0 8px 22px rgba(69,58,48,.10); display:flex; align-items:center; gap:30px; padding:0 22px; }
.row img { width:152px; height:152px; display:block; flex:none; }
.text { flex:1; }
.name { font-family:var(--display); font-weight:600; font-size:44px; line-height:1; }
.price { font-family:var(--display); font-weight:700; font-size:54px; line-height:1.05; color:var(--teal-deep); margin-top:4px; }
.sub { font-family:var(--script); font-size:28px; line-height:1; color:var(--clay-deep); margin-top:6px; }
.foot { font-weight:800; color:var(--teal-deep); }
.f1 { top:908px; font-size:17px; } .f2 { top:936px; font-size:15px; font-weight:700; color:var(--ink); }
.foot em { font-style:normal; color:var(--honey); padding:0 8px; }
</style></head><body>
<div class="frame"></div><div class="panel"></div>
<div class="center eyebrow"><span>Dragon Ink and Thread</span></div>
<div class="center title">Scan to Pay</div>
<div class="center tag">card, Apple Pay or Google Pay</div>
<div class="rule"><i></i><b>&#10022;</b><i></i></div>
${rows}
<div class="center foot f1">Prices include sales tax<em>&#10022;</em>one kind of item per scan</div>
<div class="center foot f2">Anything else, or a mix? Pay at the table.</div>
</body></html>`;
  fs.writeFileSync(path.join(SIGN, "pay-sign.html"), html);
  console.log("wrote pay-sign.html");
})().catch((e) => { console.error(e); process.exitCode = 1; });
