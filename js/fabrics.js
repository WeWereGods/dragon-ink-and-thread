/* Dragon Ink and Thread — fabric library page (fabrics.html).
   ---------------------------------------------------------------------------
   The page content is STATIC, written by tools/build-fabrics.js — every swatch
   and its name is in the HTML, so it works with JavaScript off. This file only
   adds the group filter buttons and the tap-to-enlarge view.

   TO CHANGE WHAT'S ON THE SHELF: edit js/fabrics-data.js, then re-run
   node tools/build-fabrics.js. Don't hand-edit fabrics.html. */
(function () {
  "use strict";

  /* ----- mobile nav toggle (mirrors the other pages) ----- */
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

  /* ----- footer year ----- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----- group filters + name search -----
     The two work together rather than fighting: the buttons choose a group, the
     box narrows by name inside it. Searching does NOT reset the group, because
     someone who picked "Christmas" and then typed "plaid" means both. */
  var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-fabric-filter]"));
  var groups = Array.prototype.slice.call(document.querySelectorAll("[data-fabric-group]"));
  var emptyEl = document.querySelector(".fabric-empty");
  var searchWrap = document.querySelector(".fabric-search");
  var searchEl = document.getElementById("fabricSearch");
  var countEl = document.querySelector(".fabric-count");
  var swatches = Array.prototype.slice.call(document.querySelectorAll(".fabric-swatch"));
  var total = swatches.length;
  var current = "all";

  // Written hidden by the generator; a search box is only honest once JS is running.
  if (searchWrap) searchWrap.hidden = false;

  function apply() {
    var q = (searchEl && searchEl.value || "").trim().toLowerCase();
    var shown = 0;

    groups.forEach(function (g) {
      var inGroup = current === "all" || g.getAttribute("data-fabric-group") === current;
      var visibleHere = 0;

      /* The names are romantasy ("Espresso Roses"), so a search for "coffee" would
         find nothing on names alone. Each group carries plain words for exactly
         this, and a group-word hit shows the whole group. */
      var words = (g.getAttribute("data-fabric-keywords") || "").toLowerCase();
      var groupHit = !!q && words.indexOf(q) >= 0;

      Array.prototype.slice.call(g.querySelectorAll(".fabric-swatch")).forEach(function (sw) {
        var nameEl = sw.querySelector(".fabric-name");
        var name = (nameEl && nameEl.textContent || "").toLowerCase();
        var match = inGroup && (!q || groupHit || name.indexOf(q) >= 0);
        sw.hidden = !match;
        if (match) visibleHere++;
      });

      // A group with nothing left in it disappears, heading and all.
      g.hidden = visibleHere === 0;
      shown += visibleHere;
    });

    if (emptyEl) {
      emptyEl.hidden = shown > 0;
      emptyEl.textContent = q
        ? 'No fabrics matching "' + (searchEl.value || "").trim() + '".'
        : "No fabrics in that group.";
    }
    if (countEl) {
      countEl.textContent = q || current !== "all"
        ? "Showing " + shown + " of " + total + " fabrics"
        : "";
    }
  }

  function filter(which) {
    current = which;
    buttons.forEach(function (b) {
      var on = b.getAttribute("data-fabric-filter") === which;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    apply();
  }

  buttons.forEach(function (b) {
    b.setAttribute("aria-pressed", String(b.classList.contains("is-active")));
    b.addEventListener("click", function () { filter(b.getAttribute("data-fabric-filter")); });
  });

  if (searchEl) {
    searchEl.addEventListener("input", apply);
    // Esc clears, which is what a search box is expected to do.
    searchEl.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { searchEl.value = ""; apply(); }
    });
  }

  /* ----- tap a swatch to see it larger -----
     Built here rather than in the markup so the page degrades to a plain
     grid of images without JS. */
  var box, boxImg, boxName, lastFocus;

  function build() {
    box = document.createElement("div");
    box.className = "fabric-lightbox";
    box.hidden = true;
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Fabric photo");
    box.innerHTML =
      '<button class="fabric-lightbox-close" type="button" aria-label="Close">&times;</button>' +
      '<figure class="fabric-lightbox-stage">' +
        '<img class="fabric-lightbox-img" src="" alt="" />' +
        '<figcaption class="fabric-lightbox-name"></figcaption>' +
      "</figure>";
    document.body.appendChild(box);
    boxImg = box.querySelector(".fabric-lightbox-img");
    boxName = box.querySelector(".fabric-lightbox-name");
    box.querySelector(".fabric-lightbox-close").addEventListener("click", close);
    box.addEventListener("click", function (e) {
      if (e.target === box || e.target.classList.contains("fabric-lightbox-stage")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (!box.hidden && e.key === "Escape") close();
    });
  }

  function open(src, name) {
    if (!box) build();
    lastFocus = document.activeElement;
    boxImg.src = src;
    boxImg.alt = name + " fabric, larger view";
    boxName.textContent = name;
    box.hidden = false;
    document.body.classList.add("fabric-lightbox-open");
    box.querySelector(".fabric-lightbox-close").focus();
  }

  function close() {
    if (!box) return;
    box.hidden = true;
    document.body.classList.remove("fabric-lightbox-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-fabric-src]");
    if (!b) return;
    open(b.getAttribute("data-fabric-src"), b.getAttribute("data-fabric-name"));
  });
})();
