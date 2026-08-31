/* Write one page per free pattern, plus the patterns.html index.
 *
 *   node tools/build-patterns.js
 *
 * WHY THIS EXISTS. pattern.html was hand-maintained: 309 lines, of which about
 * 60 were actually about the scrunchie. The rest was head, nav, the Buttondown
 * gate handler, the Pinterest tag, the footer. Adding a second pattern by
 * copy-paste would have produced a SECOND COPY OF THE GATE HANDLER that has to
 * stay byte-identical to the first — the same duplication CLAUDE.md flags for
 * catSlug() and mdBold(). Now a pattern is a data entry.
 *
 * ⚠️ THE PAGES ARE GENERATED. Do not hand-edit pattern.html or
 * pattern-*.html — the next run overwrites them. Edit js/patterns-data.js, or
 * this file for anything structural.
 *
 * ⚠️ pattern.html KEEPS ITS URL. It is not renamed to match the others: it has
 * been live since 2026-08-25, it is pinned, and it carried the Facebook post
 * that drove 86% of its first-day traffic. See the note in js/patterns-data.js.
 *
 * ⚠️ THE SITEMAP IS NOT WRITTEN HERE. tools/build-products.js regenerates
 * sitemap.xml wholesale and now reads js/patterns-data.js for these URLs — run
 * it after adding a pattern, or the page is invisible to search.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE = "https://www.dragoninkandthread.com";
const { hashOf } = require("./asset-hash");
const V = (rel) => hashOf(rel) || "0";

global.window = {};
require(path.join(ROOT, "js", "patterns-data.js"));
const PATTERNS = global.window.DIT_PATTERNS.PATTERNS;

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/* ── shared chrome ─────────────────────────────────────────────────────────── */

/* ⚠️ THE NAV POINTS AT A PATTERN, NOT AT THE INDEX — REVERTED 2026-08-31, MEASURED.
   It was changed to "Free Patterns" → patterns.html on 2026-08-27. In the week
   that followed, Cloudflare recorded **18 visits to /patterns.html and ZERO
   click-throughs** to a pattern from it. With a library of two, an index is a
   door in front of a door: people arrive at a menu when they wanted the thing.
   The index still exists and stays in the sitemap — it is a fine destination if
   something links to it — but it is NOT the nav target.
   ⚠️ Don't "restore" the plural without new evidence. If the library grows past
   about four, re-measure before assuming an index earns its click.

   This nav also lives in index.html, shop.html, custom.html,
   tools/build-products.js and tools/build-fabrics.js — five copies, two of them
   generators. Change them together; editing a generated page is wiped on build. */
const NAV_PATTERN = "pattern.html"; // the established URL, and the one with inbound pins

const nav = (here) => {
  const item = (href, label) =>
    `<li><a href="${href}"${href === here ? ' aria-current="page"' : ""}>${label}</a></li>`;
  return `      <div class="header-right">
        <nav id="site-nav" class="site-nav" aria-label="Primary">
          <ul>
            ${item("shop.html", "Shop")}
            ${item("custom.html", "Custom")}
            ${item("fabrics.html", "Fabrics")}
            ${item(NAV_PATTERN, "Free Pattern")}
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
      </div>`;
};

const header = (here) => `  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="index.html">
        <span class="brand-logo" aria-hidden="true"></span>
        <span class="brand-text">
          <span class="brand-name">Dragon Ink and Thread</span>
          <span class="brand-tag">handmade in san antonio</span>
        </span>
      </a>

${nav(here)}
    </div>
  </header>`;

const footer = `  <footer class="site-footer">
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
  </footer>`;

const head = (p, canonical) => {
  const pin = p.pin;
  const abs = (rel) => (/^https?:/.test(rel) ? rel : `${SITE}/${rel}`);
  return `  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(p.title)}</title>
  <meta name="description" content="${esc(p.metaDesc)}" />

  <link rel="canonical" href="${SITE}/${canonical}" />
  <meta name="theme-color" content="#4a9198" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Dragon Ink and Thread" />
  <meta property="og:title" content="${esc(p.ogTitle)}" />
  <meta property="og:description" content="${esc(p.ogDesc)}" />
  <meta property="og:url" content="${SITE}/${canonical}" />
  <meta property="og:image" content="${abs(pin.url)}" />
  <meta property="og:image:width" content="${pin.w}" />
  <meta property="og:image:height" content="${pin.h}" />
  <meta property="og:image:alt" content="${esc(pin.alt)}" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(p.ogTitle)}" />
  <meta name="twitter:description" content="${esc(p.twitterDesc)}" />
  <meta name="twitter:image" content="${SITE}/assets/og-image-v2.jpg" />

  <link rel="icon" href="/favicon.ico" sizes="32x32" />
  <link rel="icon" type="image/png" sizes="96x96" href="/assets/favicon-96.png" />
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Caveat:wght@500;600;700&family=Great+Vibes&family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="css/styles.css?v=${V("css/styles.css")}" />`;
};

// Pinterest tag then the Cloudflare beacon, in that order, matching every other
// page. The GPC gate and the missing Enhanced Match are deliberate — see
// CLAUDE.md and privacy.html sections 3, 8 and 10. Do not add {em: ...}.
const tracking = `  <!-- Pinterest Tag — ad measurement and retargeting. The tag id is public by
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

  <!-- Cloudflare Web Analytics — cookieless. -->
  <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "b7c9bbf64c0448be8b6e616f1ca86152"}'></script>`;

// Year, mobile nav and scroll-reveal. These pages don't load main.js, same as
// success.html.
const commonScript = `    document.getElementById("year").textContent = new Date().getFullYear();

    /* Mobile nav — this page doesn't load main.js, same as success.html. */
    (function () {
      var toggle = document.querySelector(".nav-toggle");
      var nav = document.getElementById("site-nav");
      if (!toggle || !nav) return;
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      });
    })();

    /* Reveal on scroll, so the page matches the rest of the site. */
    (function () {
      var els = document.querySelectorAll(".reveal");
      if (!("IntersectionObserver" in window) || !els.length) {
        els.forEach(function (el) { el.classList.add("is-visible"); });
        return;
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      els.forEach(function (el) { io.observe(el); });
    })();`;

/* The OTHER patterns, linked from the bottom of each pattern page.
 *
 * ⚠️ THIS IS WHAT REPLACES THE INDEX IN THE NAV, and it is the discovery route
 * for every pattern that isn't NAV_PATTERN. Without it, reverting the nav on
 * 2026-08-31 would have left the dog neckerchief with no link to it anywhere on
 * the site — which is how it got ZERO visits in its first four days.
 *
 * A row of siblings on the page someone is already reading beats an index they
 * have to visit first: they are here, they like free patterns, and the next one
 * is one click away rather than two. Renders nothing when there is only one. */
const others = (p) => {
  const rest = PATTERNS.filter((q) => q.id !== p.id);
  if (!rest.length) return "";
  const cards = rest.map(
    (q) => `          <article class="pattern-card">
            <a class="pattern-card-photo" href="${q.file}">
              <img src="${q.photo.src}" decoding="async" loading="lazy" alt="${esc(q.photo.alt)}"
                   onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
              <div class="placeholder placeholder-product" style="display:none;" aria-hidden="true"><span>🧵</span></div>
            </a>
            <div class="pattern-card-body">
              <h3><a href="${q.file}">${esc(q.cardTitle)}</a></h3>
              <p class="pattern-card-blurb">${esc(q.cardBlurb)}</p>
              <p class="pattern-card-meta">${esc(q.level)} · ${esc(q.time)}</p>
              <p><a class="btn btn-primary" href="${q.file}">Get this one too →</a></p>
            </div>
          </article>`
  ).join("\n");

  return `    <section class="section reveal">
      <div class="container">
        <div class="section-head">
          <h2>${rest.length > 1 ? "More free patterns" : "One more free pattern"}</h2>
          <p class="section-sub">Also free, also straight lines, also yours for an email address.</p>
        </div>
        <div class="pattern-index">
${cards}
        </div>
      </div>
    </section>
`;
};

/* ── one pattern page ──────────────────────────────────────────────────────── */

const patternPage = (p) => `<!DOCTYPE html>
<html lang="en">
<head>
${head(p, p.file)}
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

${header(NAV_PATTERN)}

  <main id="main">
    <section class="section shop-hero reveal">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">${esc(p.eyebrow)}</p>
          <h1>${esc(p.h1)}</h1>
          <p class="section-sub">${esc(p.sub)}</p>
        </div>
      </div>
    </section>

    <section class="section reveal">
      <div class="container pattern-grid">
        <div class="pattern-art">
          <img class="pattern-photo" src="${p.photo.src}" decoding="async"
               alt="${esc(p.photo.alt)}"
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div class="placeholder placeholder-product" style="display:none;" aria-hidden="true">
            <span>🧵</span>
          </div>
        </div>

        <div class="pattern-copy">
          <h2>What's in it</h2>
          <ul class="pattern-points">
${p.points.map((t) => `            <li>${t}</li>`).join("\n")}
          </ul>

          <p>${esc(p.pitch)}</p>

          <!-- The gate. Same Buttondown contract as wireNestForm() in js/main.js:
               responses are HTML, not JSON, so branch on status. Tagged
               \`${p.tag}\` so this pattern can be told apart from the others in
               tools/buttondown-report.js. -->
          <form class="nest-form" id="patternForm"
                action="https://buttondown.com/api/emails/embed-subscribe/dragoninkandthread"
                method="POST" aria-label="Get the free pattern">
            <input type="hidden" name="tag" value="${esc(p.tag)}" />
            <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true" />
            <label class="sr-only" for="patternEmail">Your email address</label>
            <input type="email" id="patternEmail" name="email" placeholder="you@example.com" required autocomplete="email" />
            <button type="submit" class="btn btn-primary">Send me the pattern</button>
          </form>
          <p class="nest-note" id="patternNote">Pop your email in and the download appears right here. You'll join the Nest too — I only write when there's something lovely to share, and you can leave any time.</p>

          <!-- Revealed by JS once Buttondown accepts the address.
               ⚠️ .pattern-download[hidden] needs an explicit display:none in the
               CSS — same display-override gotcha as the cart drawer, the fabric
               lightbox and the waitlist modal. -->
          <div class="pattern-download" id="patternDownload" hidden>
            <p class="pattern-ready">Here it is — happy sewing. 🧵</p>
            <a class="btn btn-primary" id="patternLink" href="${p.pdf}" download>
              Download the pattern (PDF)
            </a>
            <p class="pattern-note-small">Do save it somewhere — this is your copy.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-tint reveal">
      <div class="container">
        <div class="section-head">
          <h2>Rather not sew it yourself?</h2>
          <p class="section-sub">Every piece in the shop is already made, by hand, in San Antonio — and if you'd like this in your own fabric, that's what custom orders are for.</p>
          <p class="shop-hero-actions">
            <a class="btn btn-primary" href="shop.html">Shop the collection →</a>
            <a class="btn btn-ghost" href="custom.html">Ask for a custom piece →</a>
          </p>
        </div>
      </div>
    </section>

${others(p)}  </main>

${footer}

  <script>
${commonScript}

    /* The gate.

       Same Buttondown contract as wireNestForm() in js/main.js and the inline
       handler in success.html — the endpoint returns HTML, not JSON, so branch
       on status: ok = subscribed, 400 = bad or duplicate address.

       ⚠️ A 400 STILL REVEALS THE DOWNLOAD. Buttondown answers 400 for an
       address that is already subscribed, and refusing an existing subscriber
       their own free pattern would be absurd — they are exactly the person
       this is for. Only a genuine failure withholds it.

       ⚠️ NOTHING IS EMAILED AUTOMATICALLY. Buttondown's automations are a PAID
       feature and this account is on the free tier, so the reveal below IS the
       delivery — there is no follow-up message unless one is sent by hand. Do
       not write copy anywhere that promises the pattern will arrive by email.

       ⚠️ THIS GATE IS SOCIAL, NOT TECHNICAL. The PDF sits at an ordinary URL on
       a static host; anyone who has the link can share it. That is fine and
       expected — the point is collecting addresses, not preventing copying, and
       someone passing the link on was never going to subscribe anyway. Do not
       add obfuscation here believing it secures anything. */
    (function () {
      var form = document.getElementById("patternForm");
      var note = document.getElementById("patternNote");
      var box  = document.getElementById("patternDownload");
      if (!form || !note || !box) return;

      var HELP = "Something went wrong — email dragoninkandthread@gmail.com and I'll send it over myself.";

      function reveal() {
        box.hidden = false;
        box.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (form.querySelector('[name="botcheck"]:checked')) return; // honeypot
        var em = form.querySelector('[name="email"]');
        var tg = form.querySelector('[name="tag"]');
        var data = new FormData();
        data.append("email", em ? em.value : "");
        if (tg && tg.value) data.append("tag", tg.value);

        var btn = form.querySelector('button[type="submit"]');
        if (btn) btn.disabled = true;
        note.textContent = "One moment…";

        fetch(form.action, { method: "POST", body: data })
          .then(function (r) {
            if (r.ok) {
              form.reset();
              note.textContent = "You're in the Nest! 🌿 The pattern is below.";
              reveal();
            } else if (r.status === 400) {
              // Already subscribed, most likely. Give them the pattern.
              note.textContent = "Looks like you're already in the Nest — here's the pattern anyway.";
              reveal();
            } else {
              note.textContent = HELP;
            }
          })
          .catch(function () { note.textContent = HELP; })
          .finally(function () { if (btn) btn.disabled = false; });
      });
    })();
  </script>

${tracking}
</body>
</html>
`;

/* ── the index ─────────────────────────────────────────────────────────────── */

const indexPage = () => {
  const cards = PATTERNS.map(
    (p) => `          <article class="pattern-card reveal">
            <a class="pattern-card-photo" href="${p.file}">
              <img src="${p.photo.src}" decoding="async" loading="lazy" alt="${esc(p.photo.alt)}"
                   onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
              <div class="placeholder placeholder-product" style="display:none;" aria-hidden="true"><span>🧵</span></div>
            </a>
            <div class="pattern-card-body">
              <h2><a href="${p.file}">${esc(p.cardTitle)}</a></h2>
              <p class="pattern-card-blurb">${esc(p.cardBlurb)}</p>
              <p class="pattern-card-meta">${esc(p.level)} · ${esc(p.time)}</p>
              <p><a class="btn btn-primary" href="${p.file}">Get this pattern →</a></p>
            </div>
          </article>`
  ).join("\n");

  const meta = {
    title: "Free Sewing Patterns — Beginner-Friendly | Dragon Ink and Thread",
    metaDesc:
      "Free beginner sewing patterns from Dragon Ink and Thread — a chunky scrunchie and an elastic dog neckerchief, both straight lines only, with cutting layouts, seam allowances and every step written out. San Antonio, Texas.",
    ogTitle: "Free Sewing Patterns — Beginner-Friendly",
    ogDesc:
      "Straight lines only, every measurement written out, free to download. From a small handmade shop in San Antonio.",
    twitterDesc: "Free beginner sewing patterns — straight lines only, free to download.",
    pin: { url: "assets/og-image-v2.jpg", w: 1200, h: 630, alt: "Dragon Ink and Thread" },
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
${head(meta, "patterns.html")}
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

${header(NAV_PATTERN)}

  <main id="main">
    <section class="section shop-hero reveal">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">Gifts from the Nest</p>
          <h1>Free sewing patterns</h1>
          <p class="section-sub">Straight lines only, every measurement written out, and no pattern pieces to print and tape. Each one is free — pop your email in and the download appears on the page.</p>
        </div>
      </div>
    </section>

    <section class="section reveal">
      <div class="container">
        <div class="pattern-index">
${cards}
        </div>
      </div>
    </section>

    <section class="section section-tint reveal">
      <div class="container">
        <div class="section-head">
          <h2>Rather not sew it yourself?</h2>
          <p class="section-sub">Every piece in the shop is already made, by hand, in San Antonio — and if you'd like one in your own fabric, that's what custom orders are for.</p>
          <p class="shop-hero-actions">
            <a class="btn btn-primary" href="shop.html">Shop the collection →</a>
            <a class="btn btn-ghost" href="custom.html">Ask for a custom piece →</a>
          </p>
        </div>
      </div>
    </section>
  </main>

${footer}

  <script>
${commonScript}
  </script>

${tracking}
</body>
</html>
`;
};

/* ── write ─────────────────────────────────────────────────────────────────── */

const written = [];
for (const p of PATTERNS) {
  fs.writeFileSync(path.join(ROOT, p.file), patternPage(p), "utf8");
  written.push(p.file);

  const pdf = path.join(ROOT, p.pdf);
  if (!fs.existsSync(pdf)) {
    console.error(`⚠️  ${p.file}: the PDF it offers does not exist — ${p.pdf}`);
    console.error(`   node tools/pattern-to-pdf.js ${p.source} ${p.pdf}`);
  }
  const photo = path.join(ROOT, p.photo.src);
  if (!fs.existsSync(photo)) {
    console.error(`⚠️  ${p.file}: hero photo missing — ${p.photo.src}`);
  }
  if (p.pin.placeholder) {
    console.error(`⚠️  ${p.file}: og:image is the LANDSCAPE BRAND CARD, not a pin.`);
    console.error(`   Saving this page to Pinterest pins a logo in the wrong shape.`);
    console.error(`   Do not announce it until assets/pins/ has a real 2:3 image.`);
  }
}

fs.writeFileSync(path.join(ROOT, "patterns.html"), indexPage(), "utf8");
written.push("patterns.html");

const tags = PATTERNS.map((p) => p.tag);
const dupes = tags.filter((t, i) => tags.indexOf(t) !== i);
if (dupes.length) {
  console.error(`⚠️  DUPLICATE BUTTONDOWN TAG(S): ${[...new Set(dupes)].join(", ")}`);
  console.error(`   Two patterns sharing a tag can never be told apart in the report.`);
}

console.log(`${written.length} pages: ${written.join(", ")}`);
console.log("Next: node tools/build-products.js (sitemap), then node tools/bump-assets.js");
