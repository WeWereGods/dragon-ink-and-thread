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
  var SHOP_OPENS = new Date(SHOP.SHOP_OPENS || "2026-08-15T09:00:00-05:00").getTime();
  var shopOpen = Date.now() >= SHOP_OPENS;

  var money = function (n) { return "$" + n.toFixed(2); };
  var esc = function (s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
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
  function buyMarkup(id) {
    var p = PRODUCTS[id];
    if (p && p.soldOut) return '<button class="btn btn-primary catalog-buy is-soldout" disabled>Sold out</button>';
    var link = LINKS[id];
    if (!link) return '<button class="btn btn-primary catalog-buy is-soldout" disabled>Coming soon</button>';
    if (!shopOpen) return '<button class="btn btn-primary catalog-buy" disabled>Opens August 15</button>';
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
    return (
      '<article class="catalog-item' + (sold ? " is-soldout" : "") + '" data-id="' + esc(id) + '">' +
        '<div class="catalog-media' + (multi ? " has-gallery" : "") + '">' +
          '<img class="catalog-photo" src="' + esc(img) + '" alt="' + alt + '" loading="lazy" decoding="async" ' +
            "onerror=\"this.style.display='none'; this.nextElementSibling.style.display='flex';\" />" +
          '<div class="placeholder placeholder-product" style="display:none;"><span>' + (p.art || "🧵") + "</span></div>" +
          (sold ? '<span class="sold-badge">Sold</span>' : "") +
          (multi ? '<span class="gallery-hint">⤢ ' + imgs.length + " photos</span>" : "") +
        "</div>" +
        '<div class="catalog-body">' +
          '<h3 class="catalog-name">' + esc(p.name) + "</h3>" +
          '<p class="catalog-price">' + money(p.price) + "</p>" +
          (v.blurb ? '<p class="catalog-blurb">' + esc(v.blurb) + "</p>" : "") +
          buyMarkup(id) +
        "</div>" +
      "</article>"
    );
  }

  var root = document.getElementById("catalog");
  if (root && CATALOG.length) {
    root.innerHTML = CATALOG.map(function (cat) {
      var cards = cat.ids.map(itemCard).join("");
      return (
        '<section class="catalog-cat">' +
          '<div class="catalog-cat-head">' +
            '<h2>' + esc(cat.label) + "</h2>" +
            (cat.note ? '<p class="section-sub">' + esc(cat.note) + "</p>" : "") +
          "</div>" +
          '<div class="catalog-grid">' + cards + "</div>" +
        "</section>"
      );
    }).join("");
  }

  /* Add-to-cart clicks are handled by js/cart.js (delegated on
     [data-cart-add]) — the item goes into the cart drawer, and checkout
     creates a multi-item Stripe Checkout Session via the Cloudflare Worker. */

  /* ----- photo gallery: double-click a catalog photo to view larger and
     arrow/scroll through that item's other photos ----- */
  var gb, gImg, gCounter, gPrev, gNext, gImages = [], gIndex = 0, gAlt = "";
  function buildGallery() {
    gb = document.createElement("div");
    gb.className = "gallery-lightbox";
    gb.hidden = true;
    gb.innerHTML =
      '<button class="gallery-close" type="button" aria-label="Close photos">&times;</button>' +
      '<button class="gallery-nav gallery-prev" type="button" aria-label="Previous photo">&#8249;</button>' +
      '<figure class="gallery-stage"><img class="gallery-img" src="" alt="" /></figure>' +
      '<button class="gallery-nav gallery-next" type="button" aria-label="Next photo">&#8250;</button>' +
      '<span class="gallery-counter" aria-live="polite"></span>';
    document.body.appendChild(gb);
    gImg = gb.querySelector(".gallery-img");
    gCounter = gb.querySelector(".gallery-counter");
    gPrev = gb.querySelector(".gallery-prev");
    gNext = gb.querySelector(".gallery-next");
    gb.querySelector(".gallery-close").addEventListener("click", closeGallery);
    gPrev.addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
    gNext.addEventListener("click", function (e) { e.stopPropagation(); step(1); });
    gb.addEventListener("click", function (e) {
      if (e.target === gb || (e.target.classList && e.target.classList.contains("gallery-stage"))) closeGallery();
    });
    document.addEventListener("keydown", function (e) {
      if (gb.hidden) return;
      if (e.key === "Escape") closeGallery();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    });
  }
  function showGalleryImage() {
    gImg.src = gImages[gIndex];
    gImg.alt = gAlt + " — photo " + (gIndex + 1) + " of " + gImages.length;
    var multi = gImages.length > 1;
    gCounter.textContent = (gIndex + 1) + " / " + gImages.length;
    gPrev.style.display = multi ? "" : "none";
    gNext.style.display = multi ? "" : "none";
    gCounter.style.display = multi ? "" : "none";
  }
  function step(d) { gIndex = (gIndex + d + gImages.length) % gImages.length; showGalleryImage(); }
  function closeGallery() { if (gb) { gb.hidden = true; document.body.classList.remove("gallery-open"); } }

  document.addEventListener("dblclick", function (e) {
    var photo = e.target.closest && e.target.closest(".catalog-photo");
    if (!photo) return;
    var art = photo.closest(".catalog-item");
    var id = art && art.getAttribute("data-id");
    var v = (id && VARIANTS[id]) || {};
    var imgs = (v.images && v.images.length) ? v.images : (photo.getAttribute("src") ? [photo.getAttribute("src")] : []);
    if (!imgs.length) return;
    e.preventDefault();
    if (!gb) buildGallery();
    gImages = imgs; gIndex = 0; gAlt = (id && PRODUCTS[id] && PRODUCTS[id].name) || "";
    showGalleryImage();
    gb.hidden = false;
    document.body.classList.add("gallery-open");
  });
})();
