/* Dragon Ink and Thread — product page behaviour (the generated *.html pages).
   ---------------------------------------------------------------------------
   The page content itself is STATIC, written by tools/build-products.js, so it
   works with JavaScript switched off — photo, name, price, description and the
   breadcrumb trail are all in the HTML. This file only adds the moving parts:

     · thumbnail -> swap the main photo (with arrow keys)
     · the Build Your Own Bundle print pickers
     · mobile nav + footer year (same behaviour as the other pages)

   Add-to-cart is handled by js/cart.js, which delegates on [data-cart-add]. */
(function () {
  "use strict";

  /* ----- mobile nav toggle (mirrors js/shop.js) ----- */
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
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.addEventListener("click", function (e) { if (e.target.tagName === "A") closeNav(); });
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });

  /* ----- footer year ----- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----- photo gallery: thumbnails swap the main image ----- */
  var photo = document.getElementById("pdpPhoto");
  var thumbs = Array.prototype.slice.call(document.querySelectorAll(".pdp-thumb"));

  function show(i) {
    if (!photo || !thumbs.length) return;
    i = (i + thumbs.length) % thumbs.length;
    var t = thumbs[i];
    photo.src = t.getAttribute("data-pdp-img");
    thumbs.forEach(function (x, n) {
      x.classList.toggle("is-active", n === i);
      x.setAttribute("aria-current", n === i ? "true" : "false");
    });
    photo.setAttribute("data-index", String(i));
  }

  thumbs.forEach(function (t, i) {
    t.addEventListener("click", function () { show(i); });
  });

  if (thumbs.length > 1) {
    document.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      // Don't hijack arrows while someone is using a form control.
      var tag = (document.activeElement && document.activeElement.tagName) || "";
      if (tag === "SELECT" || tag === "INPUT" || tag === "TEXTAREA") return;
      var cur = parseInt(photo.getAttribute("data-index") || "0", 10);
      show(cur + (e.key === "ArrowRight" ? 1 : -1));
      e.preventDefault();
    });
  }

  /* ----- Build Your Own Bundle pickers (same contract as js/shop.js):
     mirror the chosen ids onto the button's data-cart-picks, and keep the
     basket in step if the bundle is already in it. ----- */
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
})();
