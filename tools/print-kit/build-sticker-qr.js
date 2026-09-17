// QR for the $1 sticker quick-checkout link. Generated, then DECODED back before it
// goes anywhere - a payment QR that does not scan is worse than no QR at a market table.
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const jsQR = require("jsqr");
const { PNG } = require("pngjs");

const URL = "https://buy.stripe.com/6oUeVdfxUdv310SdpDfjG0x";
const OUT = path.join(__dirname, "build", "sticker-qr.png");

(async () => {
  // Parchment light-modules so it matches the print kit rather than sitting in a white box.
  const png = await QRCode.toBuffer(URL, {
    errorCorrectionLevel: "H", margin: 2, width: 1200,
    color: { dark: "#3b3327", light: "#f0ddbc" },
  });
  fs.writeFileSync(OUT, png);

  const img = PNG.sync.read(png);
  const hit = jsQR(new Uint8ClampedArray(img.data), img.width, img.height);
  if (!hit || hit.data !== URL) throw new Error("decode failed: " + (hit ? hit.data : "nothing"));
  console.log("QR decodes correctly to " + hit.data);
  console.log("written: " + OUT + "  (" + img.width + "x" + img.height + ")");
})().catch((e) => { console.error(e); process.exitCode = 1; });
