/* Dragon Ink and Thread — small progressive-enhancement scripts.
   The site works fully without JS; this just adds niceties, plus a
   visual-only shop/checkout mockup (no real payment is processed). */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     Mobile nav toggle
     --------------------------------------------------------- */
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
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeNav();
    });
  }

  /* ---------------------------------------------------------
     Scroll reveal
     --------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------------------------------------------------
     Footer year
     --------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------------------------------------------------
     Join the Nest — email signup via Web3Forms, so subscribers
     land in the shop inbox from any visitor (no mail app needed).
     --------------------------------------------------------- */
  var nestForm = document.getElementById("nestForm");
  var nestNote = document.getElementById("nestNote");
  if (nestForm && nestNote) {
    nestForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(nestForm);
      var key = data.get("access_key");
      if (!key || String(key).indexOf("WEB3FORMS_ACCESS_KEY") === 0) {
        nestNote.textContent =
          "Signup isn't set up yet — please email dragoninkandthread@gmail.com to join.";
        return;
      }
      var btn = nestForm.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      nestNote.textContent = "Adding you to the nest…";
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data
      })
        .then(function (r) { return r.json(); })
        .then(function (json) {
          if (json.success) {
            nestForm.reset();
            nestNote.textContent = "You're in the nest! 🪺 Thank you — we'll be in touch.";
          } else {
            nestNote.textContent =
              (json && json.message) ||
              "Something went wrong — please email dragoninkandthread@gmail.com to join.";
          }
        })
        .catch(function () {
          nestNote.textContent =
            "Something went wrong — please email dragoninkandthread@gmail.com to join.";
        })
        .finally(function () {
          if (btn) btn.disabled = false;
        });
    });
  }

  /* ---------------------------------------------------------
     Contact form — posts to Web3Forms so messages arrive in the
     shop inbox from any visitor (no mail app needed). Until the
     access key is filled in, it fails gracefully and points people
     at the direct email address.
     --------------------------------------------------------- */
  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    var statusEl = document.getElementById("contactStatus");
    var setStatus = function (msg, kind) {
      statusEl.textContent = msg;
      statusEl.className = "form-status" + (kind ? " " + kind : "");
    };
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(contactForm);
      var key = data.get("access_key");
      if (!key || String(key).indexOf("WEB3FORMS_ACCESS_KEY") === 0) {
        setStatus(
          "Our form isn't quite set up yet — please email dragoninkandthread@gmail.com directly for now.",
          "err"
        );
        return;
      }
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      setStatus("Sending…", null);
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data
      })
        .then(function (r) { return r.json(); })
        .then(function (json) {
          if (json.success) {
            contactForm.reset();
            setStatus("Thank you! Your message is on its way — I'll be in touch soon. 🧵", "ok");
          } else {
            setStatus(
              (json && json.message) ||
                "Something went wrong — please email dragoninkandthread@gmail.com directly.",
              "err"
            );
          }
        })
        .catch(function () {
          setStatus("Something went wrong — please email dragoninkandthread@gmail.com directly.", "err");
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  /* =========================================================
     Shop / checkout mockup (visual only — no payment)
     ========================================================= */
  var PRODUCTS = {
    "tote-fairy":     { name: "Fairy Tote",     price: 38.0, art: "👜" },
    "tote-floral":    { name: "Floral Tote",    price: 38.0, art: "👜" },
    "tote-sunflower": { name: "Sunflower Tote", price: 45.0, art: "🌻" },
    "cozy-bee":       { name: "Blue Bee Cozy",  price: 8.0,  art: "🐝" },
    "cozy-daisy":     { name: "Daisy Cozy",     price: 8.0,  art: "🌼" },
    "scrunchie-butterfly":      { name: "Butterfly Scrunchie",       price: 4.0, art: "🦋" },
    "scrunchie-cherry-blossom": { name: "Cherry Blossom Scrunchie",  price: 4.0, art: "🌸" },
    "scrunchie-cherry":         { name: "Cherry Scrunchie",          price: 4.0, art: "🍒" },
    "scrunchie-orange-kitty":   { name: "Orange Kitty Scrunchie",    price: 4.0, art: "🐱" },
    "scrunchie-pink-bumble-bee":{ name: "Pink Bumble Bee Scrunchie", price: 4.0, art: "🐝" },
    "scrunchie-pretty-in-pink": { name: "Pretty in Pink Scrunchie",  price: 4.0, art: "🎀" },
    "scrunchie-wildflower":     { name: "Wildflower Scrunchie",      price: 4.0, art: "🌼" },
    "scrunchie-bundle":         { name: "Scrunchie Bundle (3)",      price: 9.0, art: "🎀" },
    bow:              { name: "Sage Bow",       price: 10.0, art: "🎗️" }
  };

  /* Per-variant photos + copy for the print/style picker cards.
     Keyed by the same product ids as PRODUCTS. images[0] is the main
     photo; any extras become the thumbnail gallery. Prices live in
     PRODUCTS (keep index.html's <option> labels in sync with them). */
  var VARIANTS = {
    "tote-fairy": {
      alt: "Handmade tote in a cream watercolor fairy print with a dark floral lining",
      blurb: "Watercolor fairies drift across soft cream cotton, with a moody dark-floral lining tucked inside — a little secret garden you carry on your shoulder.",
      details: "10″ × 7″ × 7″ · fully lined with a hidden dark-floral interior · 14″ strap drop · spot clean. Made to order — please allow 5–10 business days.",
      images: ["assets/tote-fairy.jpg", "assets/tote-fairy-2.jpg", "assets/tote-fairy-inside.jpg", "assets/tote-fairy-detail.jpg"]
    },
    "tote-floral": {
      alt: "Handmade tote in a blue and yellow floral print with butter-yellow trim",
      blurb: "Sweet blue-and-yellow ditsy florals framed in soft butter-yellow trim. Roomy, fully lined, and endlessly easy to reach for.",
      details: "10″ × 7″ × 7″ · fully lined with boxed corners · 14″ strap drop · spot clean. Made to order — please allow 5–10 business days.",
      images: ["assets/tote-floral.jpg", "assets/tote-floral-inside.jpg"]
    },
    "tote-sunflower": {
      alt: "Handmade puffy woven tote in a sunflower, honeycomb, and bee print",
      blurb: "Our puffy woven tote — hand-cut squares of sunflowers, honeycomb, and tiny bees, quilted into pillowy softness. A true statement piece that hugs whatever you carry.",
      details: "Puffy hand-woven panels · roomy slouch shape · single shoulder strap · spot clean, reshape by hand. Made to order — please allow 7–12 business days.",
      images: ["assets/tote-sunflower.jpg", "assets/tote-sunflower-detail.jpg"]
    },
    "cozy-bee": {
      alt: "Handmade fabric can cozy in dusty blue with bees and dandelions",
      blurb: "A snug, fleece-lined sleeve for slim cans — dusty-blue cotton dotted with bees and dandelions. Keeps drinks cold and hands comfy.",
      details: "Fits standard slim cans (12 oz) · soft fleece lining · spot clean, lay flat to dry.",
      images: ["assets/cozy-bee.jpg"]
    },
    "cozy-daisy": {
      alt: "Handmade fabric cup cozy in buttercream daisies",
      blurb: "A cozy wrap for tumblers and cups, in cheerful buttercream daisies. Grippy, insulating, and impossibly sweet.",
      details: "Fits most 16–24 oz tumblers & cups · soft padded lining · spot clean, lay flat to dry.",
      images: ["assets/cozy-daisy.jpg"]
    },
    "scrunchie-butterfly": {
      alt: "Handmade scrunchie in a cream butterfly print",
      blurb: "Delicate butterflies scattered across soft cream — a little flutter of whimsy for your wrist or your hair.",
      details: "One size · soft & springy, gentle on hair · hand wash, lay flat to dry.",
      images: ["assets/scrunchie-butterfly.jpg"]
    },
    "scrunchie-cherry-blossom": {
      alt: "Handmade scrunchie in a pink cherry blossom print on cream",
      blurb: "Soft pink cherry blossoms on cream — springtime you can wear all year.",
      details: "One size · soft & springy, gentle on hair · hand wash, lay flat to dry.",
      images: ["assets/scrunchie-cherry-blossom.jpg"]
    },
    "scrunchie-cherry": {
      alt: "Handmade ribbed scrunchie with a red cherry print on cream",
      blurb: "Sweet red cherries on a cozy ribbed knit — playful and just a little retro.",
      details: "One size · soft & springy, gentle on hair · hand wash, lay flat to dry.",
      images: ["assets/scrunchie-cherry.jpg"]
    },
    "scrunchie-orange-kitty": {
      alt: "Handmade scrunchie in a peachy-pink kitten print",
      blurb: "Peachy-pink with the tiniest kittens tucked in — for the cat lovers and daydreamers.",
      details: "One size · soft & springy, gentle on hair · hand wash, lay flat to dry.",
      images: ["assets/scrunchie-orange-kitty.jpg"]
    },
    "scrunchie-pink-bumble-bee": {
      alt: "Handmade ribbed blush-pink scrunchie dotted with bees",
      blurb: "Ribbed blush pink dotted with busy little bees — soft, subtle, and sweet.",
      details: "One size · soft & springy, gentle on hair · hand wash, lay flat to dry.",
      images: ["assets/scrunchie-pink-bumble-bee.jpg"]
    },
    "scrunchie-pretty-in-pink": {
      alt: "Handmade textured scrunchie with soft pink brushstrokes on cream",
      blurb: "Airy pink brushstrokes on textured cream — pretty in pink, exactly as it should be.",
      details: "One size · soft & springy, gentle on hair · hand wash, lay flat to dry.",
      images: ["assets/scrunchie-pretty-in-pink.jpg"]
    },
    "scrunchie-wildflower": {
      alt: "Handmade scrunchie in a tiny wildflower print on cream",
      blurb: "A meadow's worth of tiny wildflowers on cream — our softest little garden.",
      details: "One size · soft & springy, gentle on hair · hand wash, lay flat to dry.",
      images: ["assets/scrunchie-wildflower.jpg"]
    },
    "scrunchie-bundle": {
      alt: "Set of three handmade scrunchies in red, cream, and navy",
      blurb: "Three everyday scrunchies in classic red, cream, and navy — the perfect starter trio, and a little kinder on the price.",
      details: "Set of 3 (red · cream · navy) · one size each · hand wash, lay flat to dry.",
      images: ["assets/scrunchie-bundle.jpg"]
    }
  };
  var SHIPPING = 6.5;
  var TAX_RATE = 0.0825; // ~Texas estimate, for the mockup summary

  var cart = {}; // id -> qty

  var el = function (id) { return document.getElementById(id); };
  var drawer = el("drawer");
  var scrim = el("scrim");
  var mainEl = el("main");
  var shopFlow = el("shop-flow");

  // If the shop markup isn't present, bail out gracefully.
  if (!drawer || !scrim) return;

  function money(n) { return "$" + n.toFixed(2); }

  function cartCountTotal() {
    var n = 0;
    for (var id in cart) { if (cart.hasOwnProperty(id)) n += cart[id]; }
    return n;
  }
  function cartSubtotal() {
    var s = 0;
    for (var id in cart) {
      if (cart.hasOwnProperty(id)) s += PRODUCTS[id].price * cart[id];
    }
    return s;
  }
  var isEmpty = function () { return cartCountTotal() === 0; };

  /* ----- rendering ----- */
  function drawerLineHTML(id) {
    var p = PRODUCTS[id];
    return (
      '<div class="cart-line">' +
        '<div class="cart-line-art" aria-hidden="true">' + p.art + "</div>" +
        '<div class="meta">' +
          '<div class="name">' + p.name + "</div>" +
          '<div class="sub">' + money(p.price) + " each</div>" +
          '<div class="qty-stepper">' +
            '<button type="button" data-act="dec" data-id="' + id + '" aria-label="Decrease quantity of ' + p.name + '">&minus;</button>' +
            "<span>" + cart[id] + "</span>" +
            '<button type="button" data-act="inc" data-id="' + id + '" aria-label="Increase quantity of ' + p.name + '">+</button>' +
            '<button type="button" class="line-remove" data-act="remove" data-id="' + id + '">remove</button>' +
          "</div>" +
        "</div>" +
      "</div>"
    );
  }

  function summaryLineHTML(id) {
    var p = PRODUCTS[id];
    return (
      '<div class="row-between"><span>' + p.name + " × " + cart[id] + "</span><span>" +
      money(p.price * cart[id]) + "</span></div>"
    );
  }

  function render() {
    var ids = Object.keys(cart);
    var count = cartCountTotal();
    var subtotal = cartSubtotal();

    // header count
    var countEl = el("cartCount");
    if (countEl) countEl.textContent = String(count);

    // drawer lines
    var drawerLines = el("drawerLines");
    if (drawerLines) {
      drawerLines.innerHTML = ids.length
        ? ids.map(drawerLineHTML).join("")
        : '<p class="cart-empty">Your bag is empty</p>';
    }
    var dSub = el("drawerSubtotal");
    if (dSub) dSub.textContent = money(subtotal);
    var checkoutBtn = el("checkoutBtn");
    if (checkoutBtn) checkoutBtn.disabled = isEmpty();

    // checkout summary
    var checkoutLines = el("checkoutLines");
    if (checkoutLines) checkoutLines.innerHTML = ids.map(summaryLineHTML).join("");
    var tax = subtotal * TAX_RATE;
    var total = subtotal + (ids.length ? SHIPPING : 0) + tax;
    if (el("sumSubtotal")) el("sumSubtotal").textContent = money(subtotal);
    if (el("sumShipping")) el("sumShipping").textContent = money(ids.length ? SHIPPING : 0);
    if (el("sumTax")) el("sumTax").textContent = money(tax);
    if (el("sumTotal")) el("sumTotal").textContent = money(total);
    if (el("payAmount")) el("payAmount").textContent = money(total);
  }

  /* ----- cart ops ----- */
  function addToCart(id) {
    if (!PRODUCTS[id]) return;
    cart[id] = (cart[id] || 0) + 1;
    render();
  }
  function changeQty(id, delta) {
    if (!cart[id]) return;
    cart[id] += delta;
    if (cart[id] <= 0) delete cart[id];
    render();
  }
  function removeItem(id) { delete cart[id]; render(); }

  /* ----- drawer ----- */
  function openDrawer() {
    render();
    scrim.hidden = false;
    drawer.hidden = false;
    // allow the browser to apply the un-hidden state before transitioning
    requestAnimationFrame(function () {
      scrim.classList.add("is-open");
      drawer.classList.add("is-open");
    });
  }
  function closeDrawer() {
    scrim.classList.remove("is-open");
    drawer.classList.remove("is-open");
    window.setTimeout(function () {
      if (!drawer.classList.contains("is-open")) { drawer.hidden = true; scrim.hidden = true; }
    }, 300);
  }

  /* ----- view switching ----- */
  function setStepper(activeKey) {
    var order = ["cart", "checkout", "confirm"];
    var idx = order.indexOf(activeKey);
    order.forEach(function (key, i) {
      var step = document.querySelector('.stepper .step[data-step="' + key + '"]');
      if (!step) return;
      step.classList.remove("active", "done");
      if (i < idx) step.classList.add("done");
      if (i === idx) step.classList.add("active");
    });
  }

  function showBrowse() {
    if (shopFlow) shopFlow.hidden = true;
    if (mainEl) mainEl.hidden = false;
    window.scrollTo(0, 0);
  }
  function showFlowView(viewId, stepKey) {
    if (mainEl) mainEl.hidden = true;
    if (shopFlow) shopFlow.hidden = false;
    document.querySelectorAll("#shop-flow .view").forEach(function (v) {
      v.classList.toggle("is-active", v.id === viewId);
    });
    setStepper(stepKey);
    window.scrollTo(0, 0);
  }

  /* ----- product variant cards (print/style picker + gallery) ----- */
  function initVariantCards() {
    document.querySelectorAll(".card-variant").forEach(function (card) {
      var sel = card.querySelector(".js-variant-select");
      var img = card.querySelector(".js-variant-img");
      if (!sel || !img) return;
      var placeholder = img.nextElementSibling;
      var thumbs = card.querySelector(".js-variant-thumbs");
      var titleEl = card.querySelector(".js-variant-title");
      var priceEl = card.querySelector(".js-variant-price");
      var blurbEl = card.querySelector(".js-variant-blurb");
      var detailsEl = card.querySelector(".js-variant-details");
      var addBtn = card.querySelector(".card-add");

      function showImage(src) {
        img.src = src;
        img.style.display = "";
        if (placeholder) placeholder.style.display = "none";
        if (thumbs) {
          thumbs.querySelectorAll(".thumb").forEach(function (t) {
            t.classList.toggle("is-active", t.getAttribute("data-src") === src);
          });
        }
      }

      function applyVariant(id) {
        var p = PRODUCTS[id], v = VARIANTS[id];
        if (!p || !v) return;
        if (titleEl) titleEl.textContent = p.name;
        if (priceEl) priceEl.textContent = money(p.price);
        if (blurbEl && v.blurb) blurbEl.textContent = v.blurb;
        if (detailsEl && v.details) detailsEl.textContent = v.details;
        img.alt = v.alt || p.name;
        if (addBtn) addBtn.setAttribute("data-id", id);
        if (thumbs) {
          if (v.images.length > 1) {
            thumbs.innerHTML = v.images.map(function (src) {
              return '<button type="button" class="thumb" data-src="' + src +
                '" aria-label="View photo"><img src="' + src + '" alt="" loading="lazy" /></button>';
            }).join("");
            thumbs.hidden = false;
          } else {
            thumbs.innerHTML = "";
            thumbs.hidden = true;
          }
        }
        showImage(v.images[0]);
      }

      sel.addEventListener("change", function () { applyVariant(sel.value); });
      if (thumbs) {
        thumbs.addEventListener("click", function (e) {
          var b = e.target.closest(".thumb");
          if (b) showImage(b.getAttribute("data-src"));
        });
      }
      applyVariant(sel.value);
    });
  }
  initVariantCards();

  /* ----- wire up events ----- */
  document.querySelectorAll(".card-add").forEach(function (btn) {
    btn.addEventListener("click", function () {
      addToCart(btn.getAttribute("data-id"));
      openDrawer();
    });
  });

  var cartOpenBtn = el("cartOpenBtn");
  if (cartOpenBtn) cartOpenBtn.addEventListener("click", openDrawer);
  var drawerCloseBtn = el("drawerCloseBtn");
  if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", closeDrawer);
  scrim.addEventListener("click", closeDrawer);

  // qty +/- / remove inside the drawer (event delegation)
  var drawerLinesEl = el("drawerLines");
  if (drawerLinesEl) {
    drawerLinesEl.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-act]");
      if (!b) return;
      var id = b.getAttribute("data-id");
      var act = b.getAttribute("data-act");
      if (act === "inc") changeQty(id, 1);
      else if (act === "dec") changeQty(id, -1);
      else if (act === "remove") removeItem(id);
    });
  }

  var checkoutBtn = el("checkoutBtn");
  if (checkoutBtn) checkoutBtn.addEventListener("click", function () {
    if (isEmpty()) return;
    closeDrawer();
    render();
    showFlowView("view-checkout", "checkout");
  });
  var backToShopBtn = el("backToShopBtn");
  if (backToShopBtn) backToShopBtn.addEventListener("click", showBrowse);

  var payBtn = el("payBtn");
  if (payBtn) payBtn.addEventListener("click", function () {
    var id = "DIT-" + Math.floor(100000 + Math.random() * 900000);
    if (el("orderId")) el("orderId").textContent = "PREVIEW #" + id;
    cart = {}; // clear the preview bag
    render();
    showFlowView("view-confirm", "confirm");
  });
  var continueBtn = el("continueShoppingBtn");
  if (continueBtn) continueBtn.addEventListener("click", showBrowse);

  // Escape closes the drawer (and mobile nav)
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    closeNav();
    if (drawer.classList.contains("is-open")) closeDrawer();
  });

  render();
})();
