/* Dragon Ink and Thread — product page generator.
   ============================================================================
   Reads js/shop-data.js (the single source of truth) and writes one static
   HTML page per product, plus a refreshed sitemap.xml.

   RUN IT:  node tools/build-products.js
   Then commit the generated *.html files along with your shop-data.js change.

   WHY GENERATED, NOT HAND-WRITTEN: prices, blurbs and photos live in exactly
   one place. Editing 20 pages by hand is how the $4/$9 scrunchie drift
   happened. If you change anything in shop-data.js, re-run this.

   WHY AT THE REPO ROOT, NOT IN A SUBFOLDER: shop-data.js stores image paths
   relative ("assets/tote-butterfly.jpg"). A page in /product/ would resolve
   those to /product/assets/... and every photo would 404. Generating beside
   index.html keeps every relative path identical to the rest of the site.

   The generated pages are STATIC on purpose — name, price, description and
   photos are in the HTML, so search engines and social previews see them
   without running any JavaScript. js/product.js only adds the gallery
   switching and the bundle pickers on top.
*/
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE = "https://www.dragoninkandthread.com";
const ASSET_V = "20260731c"; // cache-bust for css/js on generated pages

// Load shop-data.js the same way a browser would.
global.window = {};
require(path.join(ROOT, "js", "shop-data.js"));
const SHOP = global.window.DIT_SHOP;
const { PRODUCTS, VARIANTS, LINKS, CATALOG, BYO_PRINTS } = SHOP;

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const money = (n) => "$" + Number(n).toFixed(2);
const stripQuery = (p) => String(p).split("?")[0];

/* Which catalog group is this product in? */
function categoryOf(id) {
  return CATALOG.find((c) => c.ids.indexOf(id) >= 0) || { label: "Shop", ids: [] };
}
/* Anchor used by the category buttons on shop.html. */
const catSlug = (label) => label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function page(id) {
  const p = PRODUCTS[id];
  const v = VARIANTS[id] || {};
  const cat = categoryOf(id);
  const imgs = (v.images && v.images.length) ? v.images : [];
  const hero = imgs[0] || "";
  const soldOut = !!p.soldOut;
  const available = !soldOut && !!LINKS[id];
  const title = `${p.name} — ${cat.label} | Dragon Ink and Thread`;
  const desc = (v.blurb || p.name).replace(/\s+/g, " ").trim();
  const url = `${SITE}/${id}.html`;

  /* ---- structured data: the product itself + the breadcrumb trail ---- */
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: desc,
    category: cat.label,
    brand: { "@type": "Brand", name: "Dragon Ink and Thread" },
    image: imgs.map((i) => SITE + "/" + stripQuery(i)),
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: Number(p.price).toFixed(2),
      availability: available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url,
      seller: { "@type": "Organization", name: "Dragon Ink and Thread" },
    },
  };
  const crumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
      { "@type": "ListItem", position: 2, name: "Shop", item: SITE + "/shop.html" },
      { "@type": "ListItem", position: 3, name: cat.label, item: `${SITE}/shop.html#${catSlug(cat.label)}` },
      { "@type": "ListItem", position: 4, name: p.name, item: url },
    ],
  };

  /* ---- gallery ---- */
  const thumbs = imgs.length > 1
    ? `<div class="pdp-thumbs" role="list">` +
      imgs.map((src, i) =>
        `<button class="pdp-thumb${i === 0 ? " is-active" : ""}" type="button" role="listitem" data-pdp-img="${esc(src)}" aria-label="View photo ${i + 1} of ${imgs.length}">` +
        `<img src="${esc(src)}" alt="" loading="lazy" decoding="async" /></button>`
      ).join("") + `</div>`
    : "";

  /* ---- buy control ---- */
  let buy;
  if (soldOut) {
    buy = `<button class="btn btn-primary pdp-buy is-soldout" disabled>Sold out</button>
          <p class="pdp-soldout-note">This one has found a home. <a href="custom.html">Ask about a custom piece</a> and I can often make something in the same spirit.</p>`;
  } else if (!available) {
    buy = `<button class="btn btn-primary pdp-buy is-soldout" disabled>Coming soon</button>`;
  } else if (p.picks && BYO_PRINTS && BYO_PRINTS.length) {
    const rows = [];
    for (let i = 0; i < p.picks; i++) {
      const def = BYO_PRINTS[i] || BYO_PRINTS[0];
      const opts = BYO_PRINTS.map((pid) =>
        `<option value="${esc(pid)}"${pid === def ? " selected" : ""}>${esc((PRODUCTS[pid] || {}).name || pid)}</option>`
      ).join("");
      rows.push(`<label class="byo-row"><span class="byo-label">Print ${i + 1}</span><select class="byo-select" data-byo-for="${esc(id)}">${opts}</select></label>`);
    }
    buy = `<div class="byo-picks" data-byo-picks="${esc(id)}">${rows.join("")}</div>
          <button class="btn btn-primary pdp-buy" type="button" data-cart-add="${esc(id)}" data-cart-picks="${esc(BYO_PRINTS.slice(0, p.picks).join(","))}">Add to cart</button>`;
  } else {
    buy = `<button class="btn btn-primary pdp-buy" type="button" data-cart-add="${esc(id)}">Add to cart</button>`;
  }

  /* ---- "more in this category" ---- */
  const siblings = cat.ids.filter((x) => x !== id).slice(0, 4).map((sid) => {
    const sp = PRODUCTS[sid], sv = VARIANTS[sid] || {};
    const si = (sv.images && sv.images[0]) || "";
    return `<a class="pdp-more-card" href="${esc(sid)}.html">
              <img src="${esc(si)}" alt="${esc(sv.alt || sp.name)}" loading="lazy" decoding="async" />
              <span class="pdp-more-name">${esc(sp.name)}${sp.soldOut ? " <em>(sold)</em>" : ""}</span>
              <span class="pdp-more-price">${money(sp.price)}</span>
            </a>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <link rel="canonical" href="${url}" />
  <meta name="theme-color" content="#4a9198" />

  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="Dragon Ink and Thread" />
  <meta property="og:title" content="${esc(p.name)} — Dragon Ink and Thread" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${SITE}/${esc(stripQuery(hero))}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(p.name)} — Dragon Ink and Thread" />
  <meta name="twitter:description" content="${esc(desc)}" />
  <meta name="twitter:image" content="${SITE}/${esc(stripQuery(hero))}" />

  <link rel="icon" href="/favicon.ico" sizes="32x32" />
  <link rel="icon" type="image/png" sizes="96x96" href="/assets/favicon-96.png" />
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Caveat:wght@500;600;700&family=Great+Vibes&family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet" />

  <script type="application/ld+json">
${JSON.stringify(productLd, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(crumbLd, null, 2)}
  </script>

  <link rel="stylesheet" href="css/styles.css?v=${ASSET_V}" />
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="index.html">
        <span class="brand-logo" aria-hidden="true"></span>
        <span class="brand-text">
          <span class="brand-name">Dragon Ink and Thread</span>
          <span class="brand-tag">handmade in texas</span>
        </span>
      </a>

      <div class="header-right">
        <nav id="site-nav" class="site-nav" aria-label="Primary">
          <ul>
            <li><a href="shop.html">Shop</a></li>
            <li><a href="custom.html">Custom</a></li>
            <li><a href="index.html#about">Our Story</a></li>
            <li><a href="index.html#stories">Stories</a></li>
            <li><a href="index.html#faq">FAQ</a></li>
            <li><a href="index.html#contact" class="nav-cta">Contact</a></li>
          </ul>
        </nav>

        <button class="nav-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu">
          <span class="nav-toggle-bar"></span>
          <span class="nav-toggle-bar"></span>
          <span class="nav-toggle-bar"></span>
        </button>
      </div>
    </div>
  </header>

  <main id="main">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <div class="container">
        <ol>
          <li><a href="index.html">Home</a></li>
          <li><a href="shop.html">Shop</a></li>
          <li><a href="shop.html#${catSlug(cat.label)}">${esc(cat.label)}</a></li>
          <li aria-current="page">${esc(p.name)}</li>
        </ol>
      </div>
    </nav>

    <section class="section pdp">
      <div class="container pdp-grid">
        <div class="pdp-media">
          <div class="pdp-hero${soldOut ? " is-soldout" : ""}">
            <img class="pdp-photo" id="pdpPhoto" src="${esc(hero)}" alt="${esc(v.alt || p.name)}" decoding="async" />
            ${soldOut ? '<span class="sold-badge">Sold</span>' : ""}
          </div>
          ${thumbs}
        </div>

        <div class="pdp-info">
          <p class="eyebrow"><a href="shop.html#${catSlug(cat.label)}">${esc(cat.label)}</a></p>
          <h1 class="pdp-name">${esc(p.name)}</h1>
          <p class="pdp-price">${money(p.price)}</p>
          ${v.blurb ? `<p class="pdp-blurb">${esc(v.blurb)}</p>` : ""}
          ${v.details ? `<p class="pdp-details">${esc(v.details)}</p>` : ""}
          ${buy}
          <p class="pdp-ship">Ships from San Antonio, Texas · <a href="shipping.html">shipping &amp; returns</a> · San Antonio local? Choose <strong>Local pickup</strong> at checkout.</p>
        </div>
      </div>
    </section>

    ${siblings ? `<section class="section section-tint">
      <div class="container">
        <div class="section-head"><h2>More ${esc(cat.label.toLowerCase())}</h2></div>
        <div class="pdp-more">${siblings}</div>
        <p class="pdp-back"><a class="btn btn-ghost" href="shop.html#${catSlug(cat.label)}">← Back to all ${esc(cat.label.toLowerCase())}</a></p>
      </div>
    </section>` : ""}
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <p class="footer-brand">Dragon Ink and Thread</p>
      <p class="footer-copy">Made with love in San Antonio · ★ Proudly Veteran-Owned</p>
      <p class="footer-links">
        <a href="privacy.html">Privacy Policy</a> ·
        <a href="shipping.html">Shipping &amp; Returns</a> ·
        <a href="terms.html">Terms of Service</a> ·
        <a href="mailto:dragoninkandthread@gmail.com">Email</a>
      </p>
      <p class="footer-copy">&copy; <span id="year">2026</span> Dragon Ink and Thread 🧵</p>
    </div>
  </footer>

  <script src="js/dates.js?v=${ASSET_V}"></script>
  <script src="js/shop-data.js?v=${ASSET_V}"></script>
  <script src="js/product.js?v=${ASSET_V}"></script>
  <script src="js/cart.js?v=${ASSET_V}"></script>

  <!-- Cloudflare Web Analytics — cookieless, privacy-friendly. -->
  <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "b7c9bbf64c0448be8b6e616f1ca86152"}'></script>
</body>
</html>
`;
}

/* ---------------------------------------------------------------- run ---- */
const ids = CATALOG.reduce((a, c) => a.concat(c.ids), []);
let written = 0;
for (const id of ids) {
  if (!PRODUCTS[id]) { console.warn("  ! in CATALOG but not PRODUCTS:", id); continue; }
  fs.writeFileSync(path.join(ROOT, id + ".html"), page(id), "utf8");
  written++;
}

/* Sitemap: the fixed pages plus every product. Regenerated wholesale so a
   retired product stops being advertised to search engines. */
const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: SITE + "/", pri: "1.0", freq: "weekly" },
  { loc: SITE + "/shop.html", pri: "0.9", freq: "weekly" },
  { loc: SITE + "/custom.html", pri: "0.8", freq: "monthly" },
].concat(
  ids.filter((id) => PRODUCTS[id] && !PRODUCTS[id].soldOut)
     .map((id) => ({ loc: `${SITE}/${id}.html`, pri: "0.7", freq: "monthly" }))
);
fs.writeFileSync(
  path.join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.pri}</priority>\n  </url>`).join("\n") +
  `\n</urlset>\n`,
  "utf8"
);

const sold = ids.filter((id) => PRODUCTS[id] && PRODUCTS[id].soldOut);
console.log(`Generated ${written} product pages.`);
console.log(`Sitemap: ${urls.length} URLs (sold-out pages still exist but are left out of the sitemap: ${sold.join(", ") || "none"}).`);
