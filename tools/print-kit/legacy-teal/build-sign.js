// Market table sign — one US Letter page, printable, with a REAL QR code.
// Rebuilt from the owner's mockup with three errors fixed: the web address and
// email were misspelled, and "&" is never used in the brand name.
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, VerticalAlign, TableLayoutType,
} = require("docx");

const URL_SHOP = "https://www.dragoninkandthread.com/shop.html";
const OUT = path.join(__dirname, "market-sign.docx");

// palette — the shop's own warm ink, a wine red, sage and old gold
const WINE = "8C3B45", INK = "3F332A", SAGE = "5E7052", GOLD = "B98A2E", OAK = "8B5E34";
const SERIF = "Georgia", SCRIPT = "Segoe Script", SYM = "Segoe UI Symbol";

const t = (text, o = {}) => new TextRun({ text, font: o.font || SERIF, size: o.size || 24, color: o.color || INK,
  bold: o.bold, italics: o.italics, characterSpacing: o.spacing, break: o.break });
const sym = (text, size, color) => new TextRun({ text, font: SYM, size, color });
const p = (children, o = {}) => new Paragraph({ alignment: AlignmentType.CENTER, children,
  spacing: { before: o.before || 0, after: o.after || 0, line: o.line } });

const NONE = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE };

(async () => {
  // ── QR: high error correction so a crease or glare at the market still scans
  const qrPng = await QRCode.toBuffer(URL_SHOP, { errorCorrectionLevel: "H", margin: 2, width: 900,
    color: { dark: "#1F1712", light: "#FFFFFF" } });
  fs.writeFileSync(path.join(__dirname, "qr.png"), qrPng);

  // ── QR box: a single centred cell with a double border
  const QRW = 5040; // 3.5in
  const qrBox = new Table({
    alignment: AlignmentType.CENTER, layout: TableLayoutType.FIXED,
    width: { size: QRW, type: WidthType.DXA }, columnWidths: [QRW],
    rows: [new TableRow({ children: [new TableCell({
      width: { size: QRW, type: WidthType.DXA },
      margins: { top: 160, bottom: 140, left: 200, right: 200 },
      borders: {
        top: { style: BorderStyle.DOUBLE, size: 12, color: SAGE },
        bottom: { style: BorderStyle.DOUBLE, size: 12, color: SAGE },
        left: { style: BorderStyle.DOUBLE, size: 12, color: SAGE },
        right: { style: BorderStyle.DOUBLE, size: 12, color: SAGE },
      },
      children: [
        p([t("SCAN TO SHOP", { size: 22, color: INK, spacing: 60 })], { after: 100 }),
        p([new ImageRun({ type: "png", data: qrPng, transformation: { width: 230, height: 230 } })], { after: 80 }),
        p([t("dragoninkandthread.com/shop", { size: 18, color: SAGE })]),
      ],
    })] })],
  });

  // ── contact grid: 2 × 2, no rules
  const COL = 5040, GRID = COL * 2;
  const contact = (label, value) => new TableCell({
    width: { size: COL, type: WidthType.DXA }, borders: noBorders,
    margins: { top: 80, bottom: 80, left: 120, right: 120 }, verticalAlign: VerticalAlign.TOP,
    children: [
      p([t(label, { size: 18, color: WINE, bold: true, spacing: 40 })]),
      p([t(value, { size: 22, color: INK })]),
    ],
  });
  const contacts = new Table({
    alignment: AlignmentType.CENTER, layout: TableLayoutType.FIXED, borders: noBorders,
    width: { size: GRID, type: WidthType.DXA }, columnWidths: [COL, COL],
    rows: [
      new TableRow({ children: [contact("SHOP ONLINE", "www.dragoninkandthread.com"), contact("INSTAGRAM", "@dragonink_and_thread")] }),
      new TableRow({ children: [contact("TIKTOK", "@dragonink_and_thread"), contact("EMAIL", "dragoninkandthread@gmail.com")] }),
    ],
  });

  const side = { style: BorderStyle.DOUBLE, size: 18, color: OAK, space: 24 };
  const doc = new Document({
    creator: "Dragon Ink and Thread", title: "Market Sign",
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 }, // US Letter
          margin: { top: 1000, bottom: 800, left: 1000, right: 1000 },
          borders: {
            pageBorderTop: side, pageBorderBottom: side, pageBorderLeft: side, pageBorderRight: side,
          },
        },
      },
      children: [
        p([sym("✦", 20, GOLD), t("     "), sym("❦", 30, SAGE), t("     "), sym("✦", 20, GOLD)], { after: 60 }),
        p([t("Find your next", { font: SCRIPT, size: 76, color: WINE }),
           t("little bit of magic.", { font: SCRIPT, size: 76, color: WINE, break: 1 })], { after: 120 }),
        p([t("———————   ", { size: 22, color: WINE }), sym("♥", 22, WINE), t("   ———————", { size: 22, color: WINE })], { after: 160 }),
        p([t("Dragon Ink and Thread", { size: 64, color: INK })], { after: 80 }),
        p([t("Quilted Goods  •  Bows  •  Pet Accessories  •  More", { size: 28, color: INK })], { after: 60 }),
        p([t("Handmade goods for cozy little adventures", { size: 26, color: SAGE, italics: true })], { after: 280 }),
        qrBox,
        p([t("")], { after: 200 }),
        contacts,
        p([t("Thank you for supporting handmade ", { font: SCRIPT, size: 30, color: WINE }), sym("♡", 26, WINE)], { before: 260, after: 80 }),
        p([sym("✦", 20, GOLD), t("     "), sym("❦", 30, SAGE), t("     "), sym("✦", 20, GOLD)]),
      ],
    }],
  });

  fs.writeFileSync(OUT, await Packer.toBuffer(doc));
  console.log("wrote " + OUT + " (" + fs.statSync(OUT).size + " bytes)");

  // ── prove the QR decodes to the shop address before anyone prints it
  try {
    const jsQR = require("jsqr");
    const { PNG } = require("pngjs");
    const img = PNG.sync.read(qrPng);
    const hit = jsQR(new Uint8ClampedArray(img.data), img.width, img.height);
    console.log("QR decodes to: " + (hit ? hit.data : "NOTHING"));
    console.log("QR correct: " + (hit && hit.data === URL_SHOP));
  } catch (e) { console.log("QR decode check skipped: " + e.message); }
})().catch((e) => { console.error(e); process.exitCode = 1; });
