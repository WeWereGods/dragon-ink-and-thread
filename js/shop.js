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
    var link = LINKS[id];
    if (!link) return '<button class="btn btn-primary catalog-buy is-soldout" disabled>Coming soon</button>';
    if (!shopOpen) return '<button class="btn btn-primary catalog-buy" data-id="' + id + '" disabled>Opens August 15</button>';
    return '<button class="btn btn-primary catalog-buy" data-id="' + id + '" data-href="' + esc(link) + '">Buy now →</button>';
  }

  function itemCard(id) {
    var p = PRODUCTS[id], v = VARIANTS[id] || {};
    if (!p) return "";
    var img = (v.images && v.images[0]) || "";
    var alt = esc(v.alt || p.name);
    return (
      '<article class="catalog-item">' +
        '<div class="catalog-media">' +
          '<img class="catalog-photo" src="' + esc(img) + '" alt="' + alt + '" loading="lazy" decoding="async" ' +
            "onerror=\"this.style.display='none'; this.nextElementSibling.style.display='flex';\" />" +
          '<div class="placeholder placeholder-product" style="display:none;"><span>' + (p.art || "🧵") + "</span></div>" +
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

  /* ----- Buy buttons open the item's Stripe checkout ----- */
  function wireBuys() {
    document.querySelectorAll(".catalog-buy").forEach(function (btn) {
      if (btn._wired) return;
      btn._wired = true;
      btn.addEventListener("click", function () {
        var href = btn.getAttribute("data-href");
        if (btn.disabled || !href) return;
        window.open(href, "_blank", "noopener");
      });
    });
  }
  wireBuys();

  /* ----- flip Buy buttons live the instant the shop opens ----- */
  if (!shopOpen) {
    var ms = SHOP_OPENS - Date.now();
    if (ms > 0 && ms < 2147483647) {
      setTimeout(function () {
        shopOpen = true;
        document.querySelectorAll(".catalog-buy").forEach(function (btn) {
          var id = btn.getAttribute("data-id");
          if (!id || !LINKS[id]) return;
          btn.textContent = "Buy now →";
          btn.disabled = false;
          btn.setAttribute("data-href", LINKS[id]);
        });
        wireBuys();
      }, ms);
    }
  }
})();
