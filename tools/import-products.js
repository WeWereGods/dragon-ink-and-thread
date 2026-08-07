/* Dragon Ink and Thread — bring new product photos into the shop.
   ============================================================================
   RUN IT:  node tools/import-products.js <id>
   e.g.     node tools/import-products.js sleeve-reading-nook

   Drop the photos in  assets/Incoming-Products/  and run it. That's the whole
   ritual — no renaming, no resizing, no worrying about which way up a phone
   photo will come out.

   WHAT IT DOES, for every image in that folder, in filename order:
     1. Bakes in EXIF rotation, resizes the long edge to 1400px, re-encodes at
        quality 82 — the treatment every card photo in assets/ has had.
     2. Writes them as <id>.jpg, <id>-2.jpg, <id>-3.jpg ...  The FIRST one is
        the hero shot, so name the files so the one you want first sorts first.
     3. Prints a ready-to-paste block for js/shop-data.js and the Worker.

   FLAGS
     --crop    Also crop to 4:3 (1400x1050 landscape, 1050x1400 portrait).
               Off by default, and that is deliberate: .catalog-photo is
               `aspect-ratio: 4/3; object-fit: cover`, so the card crops
               whatever it is given, and a blind centre crop is how Cauldron
               Forged nearly lost the tails off both edges. Look at the photo
               before you ask for this.
     --force   Overwrite existing files of the same name.

   WHAT IT DOES NOT DO: touch js/shop-data.js or the Worker. Those need
   decisions — price, category, maxQty, whether it is one of a kind — and
   three of those steps fail SILENTLY when skipped (see ADDING A NEW PIECE in
   CLAUDE.md). It prints what to paste instead of guessing.

   NEEDS sharp, which is NOT a dependency of this site:  npm install sharp
   The originals stay in assets/Incoming-Products/, which is gitignored. Never
   commit a raw phone photo — they are 3-7 MB each.
*/
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "assets", "Incoming-Products");
const OUT = path.join(ROOT, "assets");

const LONG_EDGE = 1400;
const QUALITY = 82;
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff"]);

function die(msg) {
  console.error("\n" + msg + "\n");
  process.exit(1);
}

let sharp;
try {
  sharp = require("sharp");
} catch {
  die(
    "This script needs sharp, which isn't installed.\n\n" +
      "  npm install sharp\n\n" +
      "Run that from the repo root, then try again."
  );
}

const args = process.argv.slice(2);
const CROP = args.includes("--crop");
const FORCE = args.includes("--force");
const id = args.find((a) => !a.startsWith("--"));

if (!id) {
  die(
    "Tell me the item's id — the same one it will have in js/shop-data.js:\n\n" +
      "  node tools/import-products.js sleeve-reading-nook\n\n" +
      "Lowercase, words joined by hyphens. It becomes the photo filenames and\n" +
      "the product page's address, so it is worth getting right first time.\n\n" +
      "⚠️  An id starting `tote-` is charged the $6.50 shipping tier. Anything\n" +
      "    else is charged $4.50. That is the only thing the id itself decides."
  );
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
  die("Ids are lowercase words joined by hyphens, e.g. sleeve-reading-nook.\nGot: " + id);
}

if (!fs.existsSync(SRC)) {
  fs.mkdirSync(SRC, { recursive: true });
  die(
    "I've made the folder for you:\n\n  assets/Incoming-Products/\n\n" +
      "Drop the photos in there and run this again. It's gitignored, so the\n" +
      "originals stay on your machine and never reach the repo."
  );
}

const sources = fs
  .readdirSync(SRC)
  .filter((f) => EXTS.has(path.extname(f).toLowerCase()))
  .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

if (!sources.length) {
  die(
    "No images in assets/Incoming-Products/.\n\n" +
      "Drop the photos in there and run this again. The one you want as the\n" +
      "hero shot should sort first by filename."
  );
}

const targets = sources.map((_, i) => (i === 0 ? id + ".jpg" : id + "-" + (i + 1) + ".jpg"));
const clash = targets.filter((t) => fs.existsSync(path.join(OUT, t)));
if (clash.length && !FORCE) {
  die(
    "These already exist in assets/:\n\n  " + clash.join("\n  ") + "\n\n" +
      "Re-run with --force to replace them. If you're replacing a photo but\n" +
      "KEEPING its filename, bump the ?v= on that image's path in VARIANTS or\n" +
      "browsers will keep serving the old one."
  );
}

/* ------------------------------------------------------------------------- */

(async () => {
  const done = [];

  for (let i = 0; i < sources.length; i++) {
    const src = path.join(SRC, sources[i]);
    const out = path.join(OUT, targets[i]);

    let img = sharp(src).rotate(); // applies EXIF, then re-encoding drops the tag

    /* metadata() reports the file as stored, BEFORE .rotate() has been applied,
       so a landscape photo carrying orientation 6 still reads as landscape here
       while the pixels that come out are portrait. Orientations 5-8 are the
       quarter-turns, and they swap the two. Getting this wrong cropped a
       portrait photo to a landscape frame. */
    const meta = await sharp(src).metadata();
    const turned = meta.orientation >= 5 && meta.orientation <= 8;
    const srcW = turned ? meta.height : meta.width;
    const srcH = turned ? meta.width : meta.height;
    const portrait = srcH > srcW;

    img = CROP
      ? img.resize(
          portrait ? Math.round(LONG_EDGE * 0.75) : LONG_EDGE,
          portrait ? LONG_EDGE : Math.round(LONG_EDGE * 0.75),
          { fit: "cover", position: "centre" }
        )
      : img.resize(LONG_EDGE, LONG_EDGE, { fit: "inside", withoutEnlargement: true });

    await img.jpeg({ quality: QUALITY }).toFile(out);

    const m = await sharp(out).metadata();
    const kb = Math.round(fs.statSync(out).size / 1024);
    done.push({ file: targets[i], w: m.width, h: m.height });
    console.log(
      "  " + sources[i].padEnd(30) + " →  " + targets[i].padEnd(30) +
        (m.width + "x" + m.height).padEnd(11) + kb + " KB"
    );
  }

  /* A photo wildly off 4:3 still works — the card crops it — but it's worth
     knowing which part will be lost before it's on the page. */
  const odd = done.filter((d) => {
    const r = Math.max(d.w, d.h) / Math.min(d.w, d.h);
    return r < 1.2 || r > 1.45;
  });
  if (odd.length) {
    console.log(
      "\n⚠️  Not near 4:3, so the card will crop more than usual: " +
        odd.map((d) => d.file).join(", ") +
        "\n    The card is 4:3 and crops from the centre. Check the subject survives it."
    );
  }

  const imgs = done.map((d) => '\n        "assets/' + d.file + '"').join(",");

  console.log(
    "\n" + done.length + " photo" + (done.length === 1 ? "" : "s") + " into assets/.\n" +
      "\nPASTE THESE — every one is needed, and 4, 6 and 7 fail silently.\n" +
      "\n1. PRODUCTS in js/shop-data.js\n" +
      '    "' + id + '": { name: "NAME HERE", price: 0.00, art: "🧵" },\n' +
      "\n2. VARIANTS in js/shop-data.js\n" +
      '    "' + id + '": {\n' +
      '      alt: "PLAIN DESCRIPTION FOR SCREEN READERS",\n' +
      '      blurb: "THE WARM ONE - what it is, what it holds, how it feels.",\n' +
      '      details: "SIZE - LINING - CLOSURE - CARE",\n' +
      "      images: [" + imgs + "\n      ]\n    },\n" +
      "\n3. LINKS in js/shop-data.js  ← without this it says \"Coming soon\" and cannot be bought\n" +
      '    "' + id + '": "cart",\n' +
      "\n4. CATALOG in js/shop-data.js — add the id to a category's `ids`, or start a new\n" +
      "   { label, note, ids } entry. The jump button and #anchor generate themselves.\n" +
      "\n5. PRICES in worker/checkout-worker.js, IN CENTS  ← without this checkout fails\n" +
      '    "' + id + '": 0000,\n' +
      "\n6. Then, in order:\n" +
      "     cd worker && wrangler deploy && cd ..\n" +
      "     node tools/build-products.js\n" +
      "     node tools/bump-assets.js\n" +
      "     git add -A && git commit && git push\n" +
      (id.startsWith("tote-")
        ? "\n   Shipping: id starts `tote-`, so this is the $6.50 tier.\n"
        : "\n   Shipping: id does not start `tote-`, so this is the $4.50 small tier.\n" +
          "   If it needs a padded mailer or a box, that may be the wrong tier.\n")
  );
})().catch((err) => die(err && err.message ? err.message : String(err)));
