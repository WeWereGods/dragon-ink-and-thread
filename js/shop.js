/* Dragon Ink and Thread — full catalog page (shop.html).
   Renders every item as its own tile from the shared window.DIT_SHOP
   data, grouped by category, with the same launch-gated Buy behaviour
   as the homepage. Works without JS-heavy dependencies. */
(function () {
  "use strict";

  var SHOP = window.DIT_SHOP || {};
  var PRODUCTS = SHOP.PRODUCTS || {};
  var VARIANTS = SHOP.VARIANTS || {};
  var LINKS = SHOP.LINKS || {};
  var CATALOG = SHOP.CATALOG || [];
  var BYO_PRINTS = SHOP.BYO_PRINTS || [];
  var SHOP_OPENS = new Date(SHOP.SHOP_OPENS || "2026-08-15T09:00:00-05:00").getTime();
  var shopOpen = Date.now() >= SHOP_OPENS;

  var money = function (n) { return "$" + n.toFixed(2); };
  var esc = function (s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };

  /* Blurbs may carry **bold** — the one scrap of markdown allowed in
     js/shop-data.js. Escape first, then promote, so the ** never reaches the
     card as literal asterisks (which is how the Brew and Bloom shipped on
     2026-08-08). tools/build-products.js carries the same pair — keep them
     identical, or a card and its product page will disagree. */
  var mdBold = function (s) {
    return esc(s).replace(/\*\*([\s\S]+?)\*\*/g, "<strong>$1</strong>");
  };

  /* ----- mobile nav toggle (mirrors js/main.js) ----- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });
    nav.addEventListener("click", function (e) { if (e.target.tagName === "A") closeNav(); });
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });

  /* ----- footer year ----- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----- scroll reveal ----- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); obs.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    revealEls.forEach(function (el) { obs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ----- render the catalog grid ----- */
  var printName = function (pid) { return (PRODUCTS[pid] && PRODUCTS[pid].name) || pid; };

  /* "Build your own" cards get one <select> per pick. The chosen ids are
     mirrored onto the Add-to-cart button's data-cart-picks attribute, which is
     what js/cart.js reads — so the basket always knows which prints to sew. */
  function pickerMarkup(id, count) {
    var rows = "";
    for (var i = 0; i < count; i++) {
      var def = BYO_PRINTS[i] || BYO_PRINTS[0] || "";
      var opts = BYO_PRINTS.map(function (pid) {
        return '<option value="' + esc(pid) + '"' + (pid === def ? " selected" : "") + ">" + esc(printName(pid)) + "</option>";
      }).join("");
      rows +=
        '<label class="byo-row">' +
          '<span class="byo-label">Print ' + (i + 1) + "</span>" +
          '<select class="byo-select" data-byo-for="' + esc(id) + '">' + opts + "</select>" +
        "</label>";
    }
    return '<div class="byo-picks" data-byo-picks="' + esc(id) + '">' + rows + "</div>";
  }

  /* Sold out is a DEAD END, and for one-of-a-kind work every piece eventually
     lands here — the visitor who clicked the prettiest thing in the shop is the
     most motivated traffic there is, and a disabled button gives them nowhere to
     go. So offer to write when something similar is made: it turns the shop's
     structural weakness into list growth. Opens the shared modal in shop.html. */
  function waitlistMarkup(id) {
    var p = PRODUCTS[id] || {};
    return '<button class="btn btn-ghost catalog-waitlist" type="button" data-waitlist="' + esc(id) +
      '" data-waitlist-name="' + esc(p.name || "") + '">Tell me when something like this appears</button>';
  }

  function buyMarkup(id) {
    var p = PRODUCTS[id];
    if (p && p.soldOut) {
      return '<button class="btn btn-primary catalog-buy is-soldout" disabled>Sold out</button>' +
             waitlistMarkup(id);
    }
    var link = LINKS[id];
    if (!link) return '<button class="btn btn-primary catalog-buy is-soldout" disabled>Coming soon</button>';
    if (!shopOpen) return '<button class="btn btn-primary catalog-buy" disabled>Opening soon</button>';
    if (p && p.picks && BYO_PRINTS.length) {
      // Pre-select the first N prints so the button works without touching it.
      var defaults = BYO_PRINTS.slice(0, p.picks).join(",");
      return pickerMarkup(id, p.picks) +
        '<button class="btn btn-primary catalog-buy" type="button" data-cart-add="' + id +
        '" data-cart-picks="' + esc(defaults) + '">Add to cart</button>';
    }
    return '<button class="btn btn-primary catalog-buy" type="button" data-cart-add="' + id + '">Add to cart</button>';
  }

  function itemCard(id) {
    var p = PRODUCTS[id], v = VARIANTS[id] || {};
    if (!p) return "";
    var imgs = (v.images && v.images.length) ? v.images : [];
    var img = imgs[0] || "";
    var alt = esc(v.alt || p.name);
    var sold = !!p.soldOut;
    var multi = imgs.length > 1;
    // The photo and the name both link to the product's own page, where all
    // of its photos live. (This replaced a double-click lightbox that almost
    // nobody discovered — a plain link is the obvious thing to click.)
    var href = esc(id) + ".html";
    return (
      '<article class="catalog-item' + (sold ? " is-soldout" : "") + '" data-id="' + esc(id) + '">' +
        '<div class="catalog-media' + (multi ? " has-gallery" : "") + '">' +
          '<a class="catalog-photo-link" href="' + href + '" aria-label="' + esc(p.name) + ' — see all photos and details" tabindex="-1">' +
            '<img class="catalog-photo" src="' + esc(img) + '" alt="' + alt + '" loading="lazy" decoding="async" ' +
              "onerror=\"this.style.display='none'; this.nextElementSibling.style.display='flex';\" />" +
            '<div class="placeholder placeholder-product" style="display:none;"><span>' + (p.art || "🧵") + "</span></div>" +
          "</a>" +
          (sold ? '<span class="sold-badge">Sold</span>' : "") +
          (multi ? '<span class="gallery-hint">⤢ ' + imgs.length + " photos</span>" : "") +
        "</div>" +
        '<div class="catalog-body">' +
          '<h3 class="catalog-name"><a href="' + href + '">' + esc(p.name) + "</a></h3>" +
          '<p class="catalog-price">' + money(p.price) + "</p>" +
          (v.blurb ? '<p class="catalog-blurb">' + mdBold(v.blurb) + "</p>" : "") +
          buyMarkup(id) +
        "</div>" +
      "</article>"
    );
  }

  /* Anchor id for a category — must match catSlug() in tools/build-products.js,
     because the generated product pages link back to shop.html#<slug>. */
  function catSlug(label) { return String(label).toLowerCase().replace(/[^a-z0-9]+/g, "-"); }

  var root = document.getElementById("catalog");
  if (root && CATALOG.length) {
    /* Filter pills — how many of each, so "Scrunchies 10" sets expectations.
       ⚠️ THEY STAY <a href="#slug">, NOT <button>, AND THAT IS DELIBERATE:
       - without JS they fall back to jumping to the section, which is exactly what
         they did before, so the page never ends up with dead controls; and
       - PRODUCT-PAGE BREADCRUMBS LINK TO shop.html#<slug>. catSlug() is duplicated
         in this file and tools/build-products.js precisely so those agree, so the
         slugs have to keep working as real anchors. Arriving on one now filters to
         that category instead of scrolling to it, which is better, but the links
         were never allowed to break. */
    var total = CATALOG.reduce(function (n, c) {
      return n + c.ids.filter(function (id) { return PRODUCTS[id]; }).length;
    }, 0);
    var navHtml =
      '<nav class="catalog-nav" aria-label="Filter by category">' +
      '<a class="catalog-nav-btn" data-cat="all" href="#catalog">Everything ' +
        '<span class="n">' + total + "</span></a>" +
      CATALOG.map(function (cat) {
        var slug = catSlug(cat.label);
        var n = cat.ids.filter(function (id) { return PRODUCTS[id]; }).length;
        return '<a class="catalog-nav-btn" data-cat="' + slug + '" href="#' + slug + '">' +
               esc(cat.label) + ' <span class="n">' + n + "</span></a>";
      }).join("") +
      "</nav>";

    root.innerHTML = navHtml + CATALOG.map(function (cat) {
      var cards = cat.ids.map(itemCard).join("");
      return (
        '<section class="catalog-cat" id="' + catSlug(cat.label) + '">' +
          '<div class="catalog-cat-head">' +
            '<h2>' + esc(cat.label) + "</h2>" +
            (cat.note ? '<p class="section-sub">' + esc(cat.note) + "</p>" : "") +
          "</div>" +
          '<div class="catalog-grid">' + cards + "</div>" +
        "</section>"
      );
    }).join("");

    /* ----- the pills actually filter -----
       Sections render VISIBLE and are only hidden once this runs, so a reader
       without JS gets the whole shop rather than a blank page. */
    var pills = root.querySelectorAll(".catalog-nav-btn");
    var sections = root.querySelectorAll(".catalog-cat");

    function applyFilter(slug) {
      var known = false;
      for (var i = 0; i < sections.length; i++) if (sections[i].id === slug) known = true;
      var all = !known;                       // unknown or empty hash → show everything
      for (var j = 0; j < sections.length; j++) {
        sections[j].hidden = !all && sections[j].id !== slug;
      }
      for (var k = 0; k < pills.length; k++) {
        var on = pills[k].getAttribute("data-cat") === (all ? "all" : slug);
        pills[k].classList.toggle("is-active", on);
        /* aria-current, not aria-pressed: these are links, not toggle buttons. */
        if (on) pills[k].setAttribute("aria-current", "true");
        else pills[k].removeAttribute("aria-current");
      }
    }

    root.addEventListener("click", function (e) {
      var p = e.target.closest && e.target.closest(".catalog-nav-btn");
      if (!p) return;
      e.preventDefault();
      var slug = p.getAttribute("data-cat");
      applyFilter(slug);
      /* replaceState, not pushState: filtering a shop is not a page the Back
         button should have to walk through one category at a time. The URL still
         updates, so a filtered view can be copied and shared. */
      try {
        history.replaceState(null, "", slug === "all" ? location.pathname : "#" + slug);
      } catch (err) {}
    });

    applyFilter((location.hash || "").replace("#", ""));

    /* A hash arriving WITHOUT a page load — any in-page link to #bows, or the
       Back button — is a same-document navigation, so the line above never runs
       again. Without this the pills would simply ignore it. */
    window.addEventListener("hashchange", function () {
      applyFilter((location.hash || "").replace("#", ""));
    });
  }

  /* Add-to-cart clicks are handled by js/cart.js (delegated on
     [data-cart-add]) — the item goes into the cart drawer, and checkout
     creates a multi-item Stripe Checkout Session via the Cloudflare Worker. */

  /* Keep the Add-to-cart button (and the basket, if the bundle is already in
     it) in step with the print pickers. */
  document.addEventListener("change", function (e) {
    var sel = e.target.closest && e.target.closest(".byo-select");
    if (!sel) return;
    var id = sel.getAttribute("data-byo-for");
    var wrap = document.querySelector('[data-byo-picks="' + id + '"]');
    var btn = document.querySelector('[data-cart-add="' + id + '"]');
    if (!wrap || !btn) return;
    var picks = Array.prototype.map.call(wrap.querySelectorAll(".byo-select"), function (s) { return s.value; });
    btn.setAttribute("data-cart-picks", picks.join(","));
    if (window.DIT_CART && window.DIT_CART.setPicks) window.DIT_CART.setPicks(id, picks);
  });

  /* The old double-click lightbox lived here. Photos now link straight to the
     product page, which shows every photo with thumbnails — a real destination
     people can bookmark and share, instead of a gesture nobody found. */

  /* The sold-out waitlist modal that `waitlistMarkup()` above opens lives in
     js/waitlist.js — shared with the generated product pages, which hit the
     same dead end. It injects its own markup, so there's nothing to add here
     or to shop.html beyond loading the script. */

})();
