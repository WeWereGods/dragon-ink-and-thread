/* Dragon Ink and Thread — Pinterest product catalog feed.
   ============================================================================
   Reads js/shop-data.js (the single source of truth) and writes
   pinterest-catalog.csv at the repo root. Pinterest fetches that URL on its
   own schedule (roughly daily) and turns each row into a shoppable Product Pin.

   RUN IT:  node tools/build-catalog.js
   Then commit pinterest-catalog.csv with your shop-data.js change.

   Feed URL: https://www.dragoninkandthread.com/pinterest-catalog.csv

   ⚠️ THE ONE-OF-A-KIND PROBLEM, AND HOW TO NOT GET BITTEN BY IT
   Pinterest keeps showing a Pin until it re-reads this file. In a shop where
   almost everything is one of one, that gap is the whole risk: a shopper taps
   a lovely Pin and lands on a dead page.

   There are two ways a piece leaves this shop, and they behave very differently:

     soldOut: true  →  the product page STILL EXISTS (tools/build-products.js
                       generates pages for sold-out items; only sitemap.xml
                       skips them). This feed lists it as "out of stock", so
                       Pinterest greys the Pin and nobody hits a 404.

     retired        →  removed from shop-data.js entirely, which DELETES the
                       product page, so its URL starts 404ing immediately.
                       It vanishes from this feed too, but only on the next
                       push, and Pinterest only notices on its next fetch.

   So: **when something sells, set `soldOut: true` first and retire it to
   Stories later** — a few days is plenty. Retiring the same day is what
   creates a dead Pin. This is the only place that ordering matters; the rest
   of the site does not care.

   (If a stale Pin does land on a deleted page, 404.html is a real page with a
   route back into the shop, not a bare error. That is the safety net, not the
   plan.)

   FIELDS are Pinterest's required set plus the useful optional ones. `id` must
   stay stable forever — it is how Pinterest recognises a product it has seen
   before, so never recycle an id for a different piece.
*/
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE = "https://www.dragoninkandthread.com";
const OUT = path.join(ROOT, "pinterest-catalog.csv");

// Load shop-data.js the same way a browser would.
global.window = {};
require(path.join(ROOT, "js", "shop-data.js"));
const SHOP = global.window.DIT_SHOP;
const { PRODUCTS, VARIANTS, LINKS, CATALOG } = SHOP;

/* Blurbs may carry **bold** — the one scrap of markdown allowed in shop-data.
   A feed is plain text, so strip it. Same rule as the meta description in
   tools/build-products.js. */
const stripMd = (s) => String(s).replace(/\*\*([\s\S]+?)\*\*/g, "$1");
const stripQuery = (p) => String(p).split("?")[0];
const abs = (p) => SITE + "/" + stripQuery(p).replace(/^\/+/, "");

/* RFC 4180: wrap in quotes, double any internal quote. Newlines would also be
   legal inside quotes, but they make a feed miserable to eyeball, so flatten
   all whitespace first. */
function cell(v) {
  const s = String(v == null ? "" : v).replace(/\s+/g, " ").trim();
  return '"' + s.replace(/"/g, '""') + '"';
}

function categoryOf(id) {
  const c = CATALOG.find((c) => c.ids.indexOf(id) >= 0);
  return c ? c.label : "Shop";
}

/* Google Product Category, per shop category. Pinterest uses this to decide
   which searches and shopping surfaces a piece can appear in; without it the
   whole feed ingests but every row carries "Warning 157 — google_product_category
   missing, which may limit visibility" (seen on the first ingestion, 2026-08-09,
   33 of 33 rows).

   These strings are NOT guesses — they were checked against Google's published
   taxonomy (taxonomy-with-ids.en-US.txt), ids 3032 / 171 / 5004 / 6176. If you
   add a category, look the value up there rather than inventing one; a value
   that isn't in the taxonomy is treated as missing.

   Bows and Scrunchies share Hair Accessories, which is correct — Google has no
   finer split, and the bows are hair bows on a slide-in clip. */
const GOOGLE_CATEGORY = {
  "Totes":        "Apparel & Accessories > Handbags, Wallets & Cases > Handbags",
  "Scrunchies":   "Apparel & Accessories > Clothing Accessories > Hair Accessories",
  "Bows":         "Apparel & Accessories > Clothing Accessories > Hair Accessories",
  "Pet Bandanas": "Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Apparel",
  "Book Sleeves": "Office Supplies > Book Accessories > Book Covers",
  // "Home" covers the tea cover today and mug rugs / appliance covers next. Kitchen Linens is
  // deliberately the broad node: it is a real entry in Google's taxonomy (an invented deeper one
  // gets the row rejected), and it fits every piece this category is heading toward.
  "Home":         "Home & Garden > Linens & Bedding > Kitchen Linens",
};

const COLUMNS = [
  "id", "title", "description", "link", "image_link", "additional_image_link",
  "price", "availability", "brand", "condition", "product_type",
  "google_product_category",
];

const rows = [];
for (const cat of CATALOG) {
  for (const id of cat.ids) {
    const p = PRODUCTS[id];
    const v = VARIANTS[id] || {};
    if (!p) { console.log("!! in CATALOG but not PRODUCTS, skipped:", id); continue; }

    const imgs = (v.images || []).map(abs);
    if (!imgs.length) { console.log("!! no photo, skipped:", id); continue; }

    /* "in stock" needs BOTH: not flagged sold, and present in LINKS. An id
       missing from LINKS renders "Coming soon" and cannot be bought, so
       advertising it as available would send people to a dead end. */
    const buyable = !p.soldOut && !!LINKS[id];

    /* Fail loudly on a new category rather than quietly shipping 33 warnings
       again — that is exactly how this went unnoticed the first time. */
    const cat = categoryOf(id);
    const gpc = GOOGLE_CATEGORY[cat];
    if (!gpc) console.log(`!! no google_product_category for "${cat}" — add one to GOOGLE_CATEGORY (${id})`);

    rows.push([
      id,
      p.name,
      stripMd(v.blurb || p.name),
      `${SITE}/${id}.html`,
      imgs[0],
      imgs.slice(1).join(","),
      Number(p.price).toFixed(2) + " USD",
      buyable ? "in stock" : "out of stock",
      "Dragon Ink and Thread",
      "new",
      cat,
      gpc || "",
    ].map(cell).join(","));
  }
}

fs.writeFileSync(OUT, COLUMNS.join(",") + "\n" + rows.join("\n") + "\n");

const outOfStock = rows.filter((r) => r.includes('"out of stock"')).length;
console.log(`pinterest-catalog.csv: ${rows.length} products (${rows.length - outOfStock} in stock, ${outOfStock} out of stock).`);
console.log(`Feed URL: ${SITE}/pinterest-catalog.csv`);
