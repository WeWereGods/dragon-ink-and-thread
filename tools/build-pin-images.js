/* Dragon Ink and Thread — Pinterest Pin images for the fabric library.
   ============================================================================
   RUN IT:  node tools/build-pin-images.js
   Writes 1000x1500 JPEGs into  assets/pins/  — upload them by hand in
   Pinterest's pin builder and point each at fabrics.html.

   WHY THIS EXISTS, AND WHY NOT 71 PINS OF 71 SWATCHES:
   The catalog feed already turns every PRODUCT into a Product Pin. The fabric
   library is the one asset it cannot cover, because the 71 prints are not
   products — and it is the most distinctive thing the shop has.

   But a single fabric swatch is a flat 640px square, and Pinterest is a
   vertical 2:3 medium. Pinned alone, a swatch is a small dull rectangle that
   tells nobody what it is for. A GRID reads as a shelf, which is the actual
   pitch: "there are this many, and you get to choose". One good pin beats
   seventy weak ones.

   NEEDS sharp (not a repo dependency): npm install sharp
*/
"use strict";

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "assets", "pins");
const SWATCHES = path.join(ROOT, "assets", "fabrics");

global.window = {};
require(path.join(ROOT, "js", "fabrics-data.js"));
const GROUPS = global.window.DIT_FABRICS.GROUPS;
const ALL = GROUPS.flatMap((g) => (g.fabrics || g.items || []).map((f) => ({ ...f, group: g.name || g.label })));

const W = 1000, H = 1500;
const CREAM = "#fdf8f0", TEAL = "#4a9198", INK = "#453a30";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* Text is drawn as SVG and composited — sharp has no text primitive of its
   own. Fraunces/Great Vibes are not installed here, so this uses generic
   serif: the Pin has to be legible, not pixel-identical to the site. */
function textLayer(lines) {
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    ${lines.map((l) => `<text x="${l.x}" y="${l.y}" font-family="${l.font || "Georgia, serif"}"
        font-size="${l.size}" fill="${l.fill || INK}" text-anchor="${l.anchor || "middle"}"
        ${l.weight ? `font-weight="${l.weight}"` : ""}
        ${l.spacing ? `letter-spacing="${l.spacing}"` : ""}>${esc(l.text)}</text>`).join("\n")}
  </svg>`;
  return Buffer.from(svg);
}

async function grid(files, cols, rows, cell, gap, x0, y0) {
  const layers = [];
  for (let i = 0; i < cols * rows && i < files.length; i++) {
    const buf = await sharp(path.join(SWATCHES, files[i]))
      .resize(cell, cell, { fit: "cover" })
      .toBuffer();
    layers.push({
      input: buf,
      left: x0 + (i % cols) * (cell + gap),
      top: y0 + Math.floor(i / cols) * (cell + gap),
    });
  }
  return layers;
}

/* Deterministic spread across the groups, so the grid looks like the whole
   shelf rather than twelve florals. */
function spread(n) {
  const out = [], per = Math.ceil(n / GROUPS.length);
  for (const g of GROUPS) {
    const fs_ = (g.fabrics || g.items || []);
    for (let i = 0; i < per && i < fs_.length; i++) out.push(fs_[i].file);
  }
  return out.slice(0, n);
}

async function pinShelf() {
  /* 3x3 of large swatches, not 3x4 of small ones. The first version ran the
     grid to y=1468 and the closing line sat at 1408, straight across the
     bottom row — unreadable, and the kind of thing that only shows up when
     you actually look at the file. Grid now ends at 1246, text starts at
     1330. Keep that gap if you change the cell size. */
  const cell = 300, gap = 18, cols = 3, rows = 3;
  const gw = cols * cell + (cols - 1) * gap;
  const layers = await grid(spread(9), cols, rows, cell, gap, Math.round((W - gw) / 2), 310);
  const text = textLayer([
    { text: "SEVENTY-ONE FABRICS", y: 150, x: W / 2, size: 40, fill: TEAL, spacing: 6 },
    { text: "on my shelf right now", y: 225, x: W / 2, size: 56, fill: INK },
    { text: "Pick one.", y: 1350, x: W / 2, size: 52, fill: INK },
    { text: "I'll make you the thing.", y: 1412, x: W / 2, size: 52, fill: INK },
    { text: "dragoninkandthread.com", y: 1468, x: W / 2, size: 30, fill: TEAL, spacing: 3 },
  ]);
  await sharp({ create: { width: W, height: H, channels: 3, background: CREAM } })
    .composite([...layers, { input: text, top: 0, left: 0 }])
    .jpeg({ quality: 86 })
    .toFile(path.join(OUT, "pin-fabric-shelf.jpg"));
}

async function pinCustom() {
  const cell = 300, gap = 18, cols = 3, rows = 2;
  const gw = cols * cell + (cols - 1) * gap;
  const layers = await grid(spread(6), cols, rows, cell, gap, Math.round((W - gw) / 2), 470);
  const text = textLayer([
    { text: "CUSTOM ORDERS ARE OPEN", y: 150, x: W / 2, size: 38, fill: TEAL, spacing: 5 },
    { text: "Ask me for something", y: 250, x: W / 2, size: 62, fill: INK },
    { text: "that doesn't exist yet", y: 330, x: W / 2, size: 62, fill: INK },
    { text: "Your print. Your size. Made for you.", y: 1180, x: W / 2, size: 42, fill: INK },
    { text: "Totes · Bows · Scrunchies", y: 1250, x: W / 2, size: 36, fill: INK },
    { text: "Pet Bandanas · Book Sleeves", y: 1305, x: W / 2, size: 36, fill: INK },
    { text: "Handmade in San Antonio, Texas", y: 1400, x: W / 2, size: 32, fill: TEAL },
    { text: "dragoninkandthread.com", y: 1455, x: W / 2, size: 30, fill: TEAL, spacing: 3 },
  ]);
  await sharp({ create: { width: W, height: H, channels: 3, background: CREAM } })
    .composite([...layers, { input: text, top: 0, left: 0 }])
    .jpeg({ quality: 86 })
    .toFile(path.join(OUT, "pin-custom-orders.jpg"));
}

/* One named collection, because "Tea with the Suriel" is the kind of phrase a
   romantasy reader stops scrolling for — the names are the hook, not the
   cotton. */
async function pinCollection() {
  const g = GROUPS.find((x) => (x.name || x.label) === "Tea with the Suriel") || GROUPS[0];
  const files = (g.fabrics || g.items || []).map((f) => f.file);
  const cell = 290, gap = 18, cols = 2, rows = 3;
  const gw = cols * cell + (cols - 1) * gap;
  const layers = await grid(files, cols, rows, cell, gap, Math.round((W - gw) / 2), 380);
  const text = textLayer([
    { text: "A NAMED COLLECTION", y: 140, x: W / 2, size: 36, fill: TEAL, spacing: 5 },
    { text: g.name || g.label, y: 230, x: W / 2, size: 68, fill: INK },
    { text: "Every print on my shelf has a name.", y: 1330, x: W / 2, size: 40, fill: INK },
    { text: "Scroll them like a menu →", y: 1390, x: W / 2, size: 40, fill: INK },
    { text: "dragoninkandthread.com", y: 1460, x: W / 2, size: 30, fill: TEAL, spacing: 3 },
  ]);
  await sharp({ create: { width: W, height: H, channels: 3, background: CREAM } })
    .composite([...layers, { input: text, top: 0, left: 0 }])
    .jpeg({ quality: 86 })
    .toFile(path.join(OUT, "pin-collection-suriel.jpg"));
}

/* Behind the Seams. The only board the catalog cannot fill, so its pins have
   to come from photos that already exist. The patchwork close-up is the right
   one: two dozen pieced squares with the seams visible is the argument for
   the $22, and it is the most process-revealing photo in the shop.

   Unlike the fabric pins this is a PHOTO pin — the image carries it, so the
   text sits in a band at the bottom rather than over the piecing. Covering
   the seams to write about the seams would be a poor trade. */
async function pinBehindTheSeams() {
  const photoH = 1150;
  const photo = await sharp(path.join(ROOT, "assets", "bandana-quilted-court.jpg"))
    .resize(W, photoH, { fit: "cover", position: "centre" })
    .toBuffer();
  const text = textLayer([
    { text: "BEHIND THE SEAMS", y: photoH + 90, x: W / 2, size: 38, fill: TEAL, spacing: 6 },
    { text: "Two dozen little squares,", y: photoH + 165, x: W / 2, size: 46, fill: INK },
    { text: "pieced one at a time.", y: photoH + 222, x: W / 2, size: 46, fill: INK },
    { text: "dragoninkandthread.com", y: photoH + 300, x: W / 2, size: 30, fill: TEAL, spacing: 3 },
  ]);
  await sharp({ create: { width: W, height: H, channels: 3, background: CREAM } })
    .composite([{ input: photo, top: 0, left: 0 }, { input: text, top: 0, left: 0 }])
    .jpeg({ quality: 86 })
    .toFile(path.join(OUT, "pin-behind-the-seams.jpg"));
}

/* ---------------------------------------------------------------------------
   FACEBOOK composites. Different shape from the Pins: Facebook favours square
   or 4:5, not 2:3, so these are 1080x1350 and live in assets/social/.
   Sharing this file rather than starting another one, because textLayer() and
   grid() would otherwise be copy-pasted and drift apart.
   ------------------------------------------------------------------------- */
const FB_W = 1080, FB_H = 1350;
const SOCIAL = path.join(ROOT, "assets", "social");

/* Every tote ever made: the five in the shop, and the four that sold. The sold
   row is desaturated and paler on purpose — it reads as "gone" without a word
   of explanation, and it is the honest way to include retired pieces in a post
   that is also trying to sell the current ones. Do NOT drop the labels; a
   shopper who falls for a sold tote and finds no way to buy it is a worse
   outcome than not showing it. */
const TOTES_FOR_SALE = [
  "tote-storykeeper.jpg", "tote-butterfly.jpg", "tote-strawberry-v2.jpg",
  "tote-mustard-floral.jpg", "tote-blue-rose.jpg",
];
const TOTES_RETIRED = [
  "tote-sunflower.jpg", "tote-mushroom.jpg", "tote-strawberry.jpg", "tote-lavender-bee.jpg",
];

async function cells(files, cell, gap, x0, y0, faded) {
  const out = [];
  for (let i = 0; i < files.length; i++) {
    let img = sharp(path.join(ROOT, "assets", files[i])).resize(cell, cell, { fit: "cover" });
    if (faded) img = img.modulate({ saturation: 0.45, brightness: 1.08 });
    out.push({ input: await img.toBuffer(), left: x0 + i * (cell + gap), top: y0 });
  }
  return out;
}

async function fbToteLineup() {
  const gap = 16;
  const big = 322;                       // 3 across, then 2 centred
  const small = 239;                     // 4 across, the sold row
  const row1 = await cells(TOTES_FOR_SALE.slice(0, 3), big, gap, 40, 250);
  const row2 = await cells(TOTES_FOR_SALE.slice(3), big, gap, Math.round((FB_W - (2 * big + gap)) / 2), 250 + big + gap);
  const row3 = await cells(TOTES_RETIRED, small, 14, 41, 985, true);

  const text = textLayer([
    { text: "EVERY TOTE I'VE MADE", y: 100, x: FB_W / 2, size: 44, fill: TEAL, spacing: 5 },
    { text: "and the five you can still have", y: 165, x: FB_W / 2, size: 46, fill: INK },
    { text: "AVAILABLE NOW", y: 225, x: 40, size: 28, fill: TEAL, anchor: "start", spacing: 4 },
    { text: "FOUND A HOME", y: 960, x: 41, size: 28, fill: INK, anchor: "start", spacing: 4 },
    { text: "dragoninkandthread.com", y: 1290, x: FB_W / 2, size: 32, fill: TEAL, spacing: 3 },
  ]);
  /* textLayer() draws on a Pin-sized canvas; give it the Facebook one. */
  const svg = Buffer.from(text.toString("utf8").replace(`width="${W}" height="${H}"`, `width="${FB_W}" height="${FB_H}"`));

  fs.mkdirSync(SOCIAL, { recursive: true });
  await sharp({ create: { width: FB_W, height: FB_H, channels: 3, background: CREAM } })
    .composite([...row1, ...row2, ...row3, { input: svg, top: 0, left: 0 }])
    .jpeg({ quality: 88 })
    .toFile(path.join(SOCIAL, "fb-tote-lineup.jpg"));
  console.log(`Wrote assets/social/fb-tote-lineup.jpg (${FB_W}x${FB_H}) — ${TOTES_FOR_SALE.length} for sale, ${TOTES_RETIRED.length} retired.`);
}

/* Custom orders, priced. The announcement has already run once, so a second
   post needs a different entry point rather than the same news louder: the
   unspoken objection is "custom must be expensive", and the bands answer it
   at a glance.

   ⚠️ The bands are owner-supplied and live in TWO places on custom.html as
   well (the price list and the one-line summary). If they change, change them
   here too. The bow floor is $13 ON PURPOSE — it must stay above the $12
   ready-made bow, or the promise that the shop ones are "the same lovely
   thing for less" stops being true. */
const PRICE_BANDS = [
  ["Totes", "$50–100"],
  ["Pet bandanas", "$20–25"],
  ["Bows", "$13–20"],
  ["Scrunchies", "$6–12"],
];

async function fbCustomOrders() {
  const cell = 239, gap = 14;
  /* The Storykeeper leads — it is the tote in Spellbound Shelves, the
     bookshelf-and-apothecary print, and the most on-brand thing the shop has
     made. ("The spellbound tote" is the fabric's name, not a product name;
     there is no tote called Spellbound.)
     ⚠️ Photo **-2**, not the hero. The hero is a room shot of the tote hanging
     on a wall, and at 239px square the bag goes small and dark next to three
     close-ups. -2 fills the frame, so the books and potion bottles still read
     at thumbnail size. Pick per-crop, not per-listing. */
  const row = await cells(
    ["tote-storykeeper-2.jpg", "bandana-quilted-court.jpg", "bow-sage-gingham.jpg", "scrunchie-strawberry.jpg"],
    cell, gap, 41, 250
  );

  const bandLines = PRICE_BANDS.flatMap(([label, price], i) => {
    const y = 640 + i * 78;
    return [
      { text: label, y, x: 250, size: 46, fill: INK, anchor: "start" },
      { text: price, y, x: 830, size: 46, fill: TEAL, anchor: "end" },
    ];
  });

  const text = textLayer([
    { text: "CUSTOM ORDERS ARE OPEN", y: 105, x: FB_W / 2, size: 40, fill: TEAL, spacing: 5 },
    { text: "and here's what it costs", y: 175, x: FB_W / 2, size: 50, fill: INK },
    ...bandLines,
    { text: "Nothing is charged until you've said yes.", y: 1035, x: FB_W / 2, size: 40, fill: INK },
    { text: "Seventy-one prints to choose from.", y: 1095, x: FB_W / 2, size: 40, fill: INK },
    { text: "Handmade in San Antonio, Texas", y: 1215, x: FB_W / 2, size: 32, fill: TEAL },
    { text: "dragoninkandthread.com", y: 1270, x: FB_W / 2, size: 32, fill: TEAL, spacing: 3 },
  ]);
  const svg = Buffer.from(text.toString("utf8").replace(`width="${W}" height="${H}"`, `width="${FB_W}" height="${FB_H}"`));

  fs.mkdirSync(SOCIAL, { recursive: true });
  await sharp({ create: { width: FB_W, height: FB_H, channels: 3, background: CREAM } })
    .composite([...row, { input: svg, top: 0, left: 0 }])
    .jpeg({ quality: 88 })
    .toFile(path.join(SOCIAL, "fb-custom-orders.jpg"));
  console.log(`Wrote assets/social/fb-custom-orders.jpg (${FB_W}x${FB_H}).`);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  await fbToteLineup();
  await fbCustomOrders();
  await pinShelf();
  await pinCustom();
  await pinCollection();
  await pinBehindTheSeams();
  console.log(`Wrote 4 Pin images (1000x1500) to assets/pins/ — from ${ALL.length} fabrics.`);
})();
