// RETIRED 2026-09-24. The $1 sticker payment link (plink_1UGn0HGhlm0fD4l8KZGB5Ilz) was
// DEACTIVATED in Stripe on the owner's instruction: $1 is about the unit cost of a 4in
// sticker, the fixed card fee eats the rest, and a dollar bin beside a $75 tote drags the
// whole table down a tier. Stickers are now $3 at the table, rung on Tap to Pay.
//
// This script is kept, not deleted, because the QR generate-then-decode-back pattern in it
// is the one the rest of the kit uses. It REFUSES TO RUN, because the only thing it could
// produce now is a QR that leads to a deactivated link - worse than no QR at all.
// To bring stickers back to a scan-to-pay card: make a NEW link, put its URL in URL below,
// delete the guard, run it, and verify the code decodes out of the RENDERED page.
if (require.main === module) {
  console.error("build-sticker-qr.js is RETIRED - the $1 sticker link is deactivated in Stripe.");
  console.error("Stickers are $3 at the table, on Tap to Pay. See the header comment to revive this.");
  process.exitCode = 1;
  return;
}

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
