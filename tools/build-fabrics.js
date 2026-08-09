/* Dragon Ink and Thread — fabric library page generator.
   ============================================================================
   Reads js/fabrics-data.js and writes fabrics.html.

   RUN IT:  node tools/build-fabrics.js

   Same reasoning as tools/build-products.js: the page is generated STATIC so
   every swatch name is in the HTML for search engines and for anyone with
   JavaScript off. js/fabrics.js only adds the filter buttons and the lightbox
   on top of markup that already works without it.

   Photos live in assets/fabrics/ — see the processing note in js/fabrics-data.js
   before adding new ones. Raw phone originals must never be committed.
*/
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE = "https://www.dragoninkandthread.com";
const { hashOf } = require("./asset-hash");
// Cache-bust tokens are the assets' own content hashes — see tools/asset-hash.js.
const V = (rel) => hashOf(rel) || "0";

global.window = {};
require(path.join(ROOT, "js", "fabrics-data.js"));
const GROUPS = global.window.DIT_FABRICS.GROUPS;

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const total = GROUPS.reduce((n, g) => n + g.items.length, 0);

const filters =
  '<nav class="fabric-filters" aria-label="Fabric groups">' +
  '<button class="fabric-filter is-active" type="button" data-fabric-filter="all">All <span class="n">' + total + "</span></button>" +
  GROUPS.map((g) =>
    '<button class="fabric-filter" type="button" data-fabric-filter="' + slug(g.label) + '">' +
    esc(g.label) + ' <span class="n">' + g.items.length + "</span></button>"
  ).join("") +
  "</nav>";

const sections = GROUPS.map((g) =>
  '<section class="fabric-group" id="' + slug(g.label) + '" data-fabric-group="' + slug(g.label) + '">' +
    '<div class="section-head fabric-group-head">' +
      "<h2>" + esc(g.label) + "</h2>" +
      (g.note ? '<p class="section-sub">' + esc(g.note) + "</p>" : "") +
    "</div>" +
    '<div class="fabric-grid">' +
      g.items.map((it) =>
        '<figure class="fabric-swatch">' +
          '<button class="fabric-swatch-btn" type="button" data-fabric-src="assets/fabrics/' + esc(it.file) + '" data-fabric-name="' + esc(it.name) + '" aria-label="View ' + esc(it.name) + ' larger">' +
            '<img src="assets/fabrics/' + esc(it.file) + '" alt="' + esc(it.name) + ' fabric" loading="lazy" decoding="async" />' +
          "</button>" +
          '<figcaption class="fabric-name">' + esc(it.name) + "</figcaption>" +
        "</figure>"
      ).join("") +
    "</div>" +
  "</section>"
).join("\n    ");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Fabric Library | Dragon Ink and Thread</title>
  <meta name="description" content="The fabrics currently on the shelf at Dragon Ink and Thread — ${total} prints you can choose from for a custom tote, bow or scrunchie. Handmade in San Antonio, Texas." />
  <link rel="canonical" href="${SITE}/fabrics.html" />
  <meta name="theme-color" content="#4a9198" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Dragon Ink and Thread" />
  <meta property="og:title" content="Fabric Library | Dragon Ink and Thread" />
  <meta property="og:description" content="${total} fabrics on the shelf right now — pick one for your custom piece." />
  <meta property="og:url" content="${SITE}/fabrics.html" />
  <meta property="og:image" content="${SITE}/assets/og-image.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Fabric Library | Dragon Ink and Thread" />
  <meta name="twitter:description" content="${total} fabrics on the shelf right now — pick one for your custom piece." />
  <meta name="twitter:image" content="${SITE}/assets/og-image.jpg" />

  <link rel="icon" href="/favicon.ico" sizes="32x32" />
  <link rel="icon" type="image/png" sizes="96x96" href="/assets/favicon-96.png" />
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Caveat:wght@500;600;700&family=Great+Vibes&family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="css/styles.css?v=${V("css/styles.css")}" />
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
            <li><a href="fabrics.html" aria-current="page">Fabrics</a></li>
            <li><a href="index.html#about">Our Story</a></li>
            <li><a href="index.html#stories">Stories</a></li>
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
          <li><a href="custom.html">Custom orders</a></li>
          <li aria-current="page">Fabric library</li>
        </ol>
      </div>
    </nav>

    <section class="section shop-hero">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">The Fabric Shelf</p>
          <h1>What I have to sew with</h1>
          <p class="section-sub">These are the ${total} fabrics on my shelf right now. Any of them can become a tote, a bow, a scrunchie, a pet bandana or a book sleeve made just for you — find one you love, note its name, and tell me on the custom order form.</p>
          <p class="fabric-hero-note">Tap any swatch to see it larger. Colours shift a little between screens, and prints are photographed flat, so scale reads slightly smaller than it looks in hand.</p>
        </div>
      </div>
    </section>

    <div class="section fabric-wrap">
      <div class="container">
        ${filters}
        ${sections}
        <p class="fabric-empty" hidden>No fabrics in that group.</p>
      </div>
    </div>

    <section class="section section-tint">
      <div class="container">
        <div class="section-head">
          <h2>Found one?</h2>
          <p class="section-sub">Tell me its name on the custom order form and I'll take it from there. If nothing here is quite right, I can often source a print you've found — send me a link.</p>
          <p class="shop-hero-actions"><a class="btn btn-primary" href="custom.html#request">Start a custom order →</a></p>
        </div>
      </div>
    </section>
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

  <script src="js/dates.js?v=${V("js/dates.js")}"></script>
  <script src="js/fabrics.js?v=${V("js/fabrics.js")}"></script>

  <!-- Pinterest Tag — ad measurement and retargeting. The tag id is public by
       design, same as the Cloudflare token.

       NO ENHANCED MATCH. Pinterest's copy-paste snippet ends with
       {em: '<user_email_address>'} — that placeholder wants the VISITOR's
       email, and this site has no login, so there is nobody's address to put
       there. Pasted literally it posts the string "<user_email_address>" to
       Pinterest on every page load. Do not add 'em' back unless there is a
       real, consented address to send.

       GPC. Unlike the Cloudflare beacon, this IS "sharing" for cross-context
       behavioral advertising under California's CPRA, so it does not load for
       anyone whose browser sends a Global Privacy Control signal. privacy.html
       promises exactly this — change the two together or the policy lies.
       The <noscript> pixel was deliberately dropped: it would fire regardless
       of GPC, and that hole is worth more than the handful of JS-off visits. -->
  <script>
    if (navigator.globalPrivacyControl !== true) {
      !function(e){if(!window.pintrk){window.pintrk = function () {
      window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
        n=window.pintrk;n.queue=[],n.version="3.0";var
        t=document.createElement("script");t.async=!0,t.src=e;var
        r=document.getElementsByTagName("script")[0];
        r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
      pintrk('load', '2614418318675');
      pintrk('page');
    }
  </script>
  <!-- end Pinterest Tag -->

  <!-- Cloudflare Web Analytics — cookieless, privacy-friendly. -->
  <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "b7c9bbf64c0448be8b6e616f1ca86152"}'></script>
</body>
</html>
`;

fs.writeFileSync(path.join(ROOT, "fabrics.html"), html, "utf8");
console.log(`Generated fabrics.html — ${total} fabrics across ${GROUPS.length} groups.`);
GROUPS.forEach((g) => console.log(`  ${g.label.padEnd(26)} ${g.items.length}`));
