/* Dragon Ink and Thread — zoom a product photo.
   ----------------------------------------------------------------
   Double-click the main photo on a product page to see it full screen,
   with prev/next through that item's other photos.

   WHY DOUBLE-CLICK, AND WHY ONLY HERE: shop.html's catalog photos are
   LINKS to the product page, so the first click of a double-click
   navigates away — a double-click gallery there is what the shop used
   to have, and it was removed for exactly this reason (a link is
   discoverable, a hidden gesture wasn't). The product-page hero photo
   isn't a link, so the gesture works cleanly.

   ON TOUCH: double-tap is the browser's OWN page-zoom gesture and can't
   be borrowed reliably, so touch devices open on a single tap instead.
   Either way the photo carries a visible "⤢ zoom" hint, because the
   lesson from the deleted gallery was that an unhinted gesture is a
   feature nobody finds.

   Markup contract (written by tools/build-products.js): any element with
   `data-zoom` opens it. Photos come from the page's .pdp-thumb buttons
   (data-pdp-img) when there are several, otherwise the image's own src.

   Reuses the .gallery-* styles in css/styles.css, which were left behind
   when the old catalog gallery was deleted.
   `.gallery-lightbox[hidden]{display:none}` is REQUIRED — [hidden] alone
   loses to display:flex (same gotcha as the cart drawer and the fabric
   lightbox). */
(function () {
  "use strict";

  var TOUCH = window.matchMedia && window.matchMedia("(hover: none)").matches;
  var box = null, imgEl, counterEl, prevBtn, nextBtn;
  var list = [], idx = 0, lastFocus = null;

  function build() {
    if (box) return;
    box = document.createElement("div");
    box.className = "gallery-lightbox";
    box.hidden = true;
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Photo viewer");
    box.innerHTML =
      '<button class="gallery-close" type="button" aria-label="Close">&times;</button>' +
      '<button class="gallery-nav gallery-prev" type="button" aria-label="Previous photo">&#8249;</button>' +
      '<figure class="gallery-stage"><img class="gallery-img" src="" alt="" /></figure>' +
      '<button class="gallery-nav gallery-next" type="button" aria-label="Next photo">&#8250;</button>' +
      '<p class="gallery-counter" aria-live="polite"></p>';
    document.body.appendChild(box);

    imgEl = box.querySelector(".gallery-img");
    counterEl = box.querySelector(".gallery-counter");
    prevBtn = box.querySelector(".gallery-prev");
    nextBtn = box.querySelector(".gallery-next");

    prevBtn.addEventListener("click", function () { show(idx - 1); });
    nextBtn.addEventListener("click", function () { show(idx + 1); });
    box.querySelector(".gallery-close").addEventListener("click", close);
    box.addEventListener("click", function (e) {
      // The backdrop and the empty space around the photo dismiss; the photo doesn't.
      if (e.target === box || e.target.classList.contains("gallery-stage")) close();
    });

    /* Fitting the photo to the window is only ~1.4x on a short screen, which
       isn't much of a zoom when the file is ~1400px wide. Clicking the photo
       goes to ACTUAL SIZE and lets the overlay scroll, so the stitching is
       genuinely inspectable; clicking again returns to fit. */
    imgEl.addEventListener("click", function () { setActual(!box.classList.contains("is-zoomed")); });
  }

  function setActual(on) {
    box.classList.toggle("is-zoomed", on);
    imgEl.classList.toggle("is-actual", on);
    if (on) {
      // Start the pan centred rather than in the top-left corner.
      box.scrollLeft = (box.scrollWidth - box.clientWidth) / 2;
      box.scrollTop = (box.scrollHeight - box.clientHeight) / 2;
    } else {
      box.scrollLeft = 0; box.scrollTop = 0;
    }
  }

  function show(i) {
    if (!list.length) return;
    setActual(false); // a new photo always starts fitted
    idx = (i + list.length) % list.length;
    imgEl.src = list[idx].src;
    imgEl.alt = list[idx].alt || "";
    var many = list.length > 1;
    counterEl.textContent = many ? idx + 1 + " / " + list.length : "";
    counterEl.hidden = !many;
    prevBtn.hidden = !many;
    nextBtn.hidden = !many;
  }

  function open(trigger) {
    build();
    lastFocus = document.activeElement;

    // Every photo of this item, in the order the thumbnails show them.
    var thumbs = document.querySelectorAll(".pdp-thumb[data-pdp-img]");
    var main = trigger.matches("img") ? trigger : trigger.querySelector("img");
    list = [];
    if (thumbs.length) {
      Array.prototype.forEach.call(thumbs, function (t) {
        list.push({ src: t.getAttribute("data-pdp-img"), alt: (main && main.alt) || "" });
      });
    } else if (main && main.getAttribute("src")) {
      list.push({ src: main.getAttribute("src"), alt: main.alt || "" });
    }
    if (!list.length) return;

    // Open on whichever photo is currently showing, not always the first.
    var start = 0;
    if (main) {
      var cur = main.getAttribute("src");
      for (var i = 0; i < list.length; i++) { if (list[i].src === cur) { start = i; break; } }
    }

    box.hidden = false;
    document.body.classList.add("gallery-open");
    show(start);
    box.querySelector(".gallery-close").focus();
  }

  function close() {
    if (!box || box.hidden) return;
    setActual(false);
    box.hidden = true;
    document.body.classList.remove("gallery-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* Desktop: double-click. Touch: a single tap, since double-tap belongs
     to the browser. */
  document.addEventListener(TOUCH ? "click" : "dblclick", function (e) {
    if (!e.target.closest) return;
    var trigger = e.target.closest("[data-zoom]");
    if (!trigger) return;
    e.preventDefault();
    open(trigger);
  });

  /* Keyboard: the photo is focusable, so Enter/Space must work too — a
     gesture-only feature is unusable without a mouse. */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var trigger = document.activeElement && document.activeElement.closest &&
                  document.activeElement.closest("[data-zoom]");
    if (!trigger || (box && !box.hidden)) return;
    e.preventDefault();
    open(trigger);
  });

  document.addEventListener("keydown", function (e) {
    if (!box || box.hidden) return;
    if (e.key === "Escape") { close(); return; }
    if (e.key === "ArrowLeft") { show(idx - 1); e.preventDefault(); }
    if (e.key === "ArrowRight") { show(idx + 1); e.preventDefault(); }
  });

  /* The hint text depends on the input device, so it's written here rather
     than baked into the generated HTML. */
  document.addEventListener("DOMContentLoaded", function () {
    var hint = document.querySelector("[data-zoom-hint]");
    if (hint) hint.textContent = TOUCH ? "⤢ Tap to zoom" : "⤢ Double-click to zoom";
  });
})();
