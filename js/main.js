/* Dragon Ink and Thread — small progressive-enhancement scripts.
   The site works fully without JS; this just adds niceties, plus the
   shop (each item links straight to its own Stripe checkout). */
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
  // Escape closes the mobile nav.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

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
     Launch countdown — ticks down to opening day (Aug 15, 2026,
     9am Central). To change the date, edit LAUNCH below. When it
     reaches zero it fires a "shop:open" event so the Buy buttons
     switch themselves on without a page reload.
     --------------------------------------------------------- */
  var countdownClock = document.getElementById("countdownClock");
  if (countdownClock) {
    var LAUNCH = new Date("2026-08-15T09:00:00-05:00").getTime();
    var countdownInterval = null;
    var tickCountdown = function () {
      var diff = LAUNCH - Date.now();
      if (diff <= 0) {
        countdownClock.textContent = "We're open! 🎉";
        countdownClock.removeAttribute("aria-hidden");
        if (countdownInterval) window.clearInterval(countdownInterval);
        document.dispatchEvent(new CustomEvent("shop:open"));
        return;
      }
      var s = Math.floor(diff / 1000);
      var d = Math.floor(s / 86400); s -= d * 86400;
      var h = Math.floor(s / 3600); s -= h * 3600;
      var m = Math.floor(s / 60); s -= m * 60;
      countdownClock.textContent = d + "d " + h + "h " + m + "m " + s + "s";
    };
    tickCountdown();
    countdownInterval = window.setInterval(tickCountdown, 1000);
  }

  /* ---------------------------------------------------------
     Image lightbox — double-click a product photo (or a gallery
     thumbnail) to view it larger. Close with ×, the backdrop, or Esc.
     --------------------------------------------------------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  if (lightbox && lightboxImg) {
    var lbLastFocused = null;
    var openLightbox = function (src, alt) {
      if (!src) return;
      lbLastFocused = document.activeElement;
      lightboxImg.setAttribute("src", src);
      lightboxImg.setAttribute("alt", alt || "");
      lightbox.hidden = false;
      var closeBtn = document.getElementById("lightboxClose");
      if (closeBtn) closeBtn.focus();
    };
    var closeLightbox = function () {
      lightbox.hidden = true;
      lightboxImg.setAttribute("src", "");
      if (lbLastFocused && lbLastFocused.focus) lbLastFocused.focus();
    };
    document.addEventListener("dblclick", function (e) {
      var el = e.target.closest(".product-photo, .thumb");
      if (!el) return;
      var src, alt;
      if (el.classList.contains("thumb")) {
        src = el.getAttribute("data-src");
        var inner = el.querySelector("img");
        alt = inner ? inner.getAttribute("alt") : "";
      } else {
        src = el.getAttribute("src");
        alt = el.getAttribute("alt");
        if (el.style.display === "none") return; // emoji-placeholder fallback
      }
      if (!src) return;
      e.preventDefault();
      openLightbox(src, alt);
    });
    lightbox.addEventListener("click", function (e) {
      if (e.target !== lightboxImg) closeLightbox();
    });
    var lbClose = document.getElementById("lightboxClose");
    if (lbClose) lbClose.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }

  /* ---------------------------------------------------------
     Join the Nest — email signup via Buttondown, which owns the
     mailing list and sends the welcome sequence + the launch code.
     Posted with fetch so the visitor never leaves the page (the
     endpoint sends Access-Control-Allow-Origin: *). Its responses
     are HTML, not JSON, so we go by status: ok = subscribed,
     400 = bad or duplicate address, 404 = wrong username.
     The `tag` hidden field marks where the signup came from.
     --------------------------------------------------------- */
  var NEST_HELP = "Something went wrong — please email dragoninkandthread@gmail.com to join.";

  function wireNestForm(form, note) {
    if (!form || !note) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // Honeypot: only a bot fills this in.
      if (form.querySelector('[name="botcheck"]:checked')) return;

      var email = form.querySelector('[name="email"]');
      var tag = form.querySelector('[name="tag"]');
      // Send only the fields Buttondown expects — not the honeypot.
      var data = new FormData();
      data.append("email", email ? email.value : "");
      if (tag && tag.value) data.append("tag", tag.value);

      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      note.textContent = "Adding you to the nest…";
      fetch(form.action, { method: "POST", body: data })
        .then(function (r) {
          if (r.ok) {
            form.reset();
            note.textContent =
              "You're in the nest! 🪺 Check your inbox — there's a welcome note on its way.";
          } else if (r.status === 400) {
            note.textContent =
              "That address didn't take — if you're already in the nest, you're all set.";
          } else {
            note.textContent = NEST_HELP;
          }
        })
        .catch(function () {
          note.textContent = NEST_HELP;
        })
        .finally(function () {
          if (btn) btn.disabled = false;
        });
    });
  }
  // Hero signup (the checkout "join the Nest" signup was retired with the basket).
  wireNestForm(document.getElementById("nestForm"), document.getElementById("nestNote"));
  wireNestForm(document.getElementById("nestFormCheckout"), document.getElementById("nestNoteCheckout"));

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
     Shop — each variant links straight to its own Stripe
     checkout. Stripe Payment Links are one item per link, so
     there's no basket: the Buy button opens that item's hosted
     checkout in a new tab. Buying is gated until launch
     (Aug 15) — before then the button reads "Opens August 15".
     Items with no link are sold out and read "Coming soon".
     ========================================================= */
  var PRODUCTS = {
    "tote-sunflower":     { name: "Sunflower Tote",     price: 45.0, art: "🌻" },
    "tote-mushroom":      { name: "Mushroom Tote",      price: 25.0, art: "🍄" },
    "tote-mustard-floral":{ name: "Mustard Rose Tote",  price: 20.0, art: "🌹" },
    "tote-blue-rose":     { name: "Blue Rose Mini Tote", price: 20.0, art: "🌷" },
    "tote-butterfly":     { name: "Butterfly Tote",     price: 38.0, art: "🦋" },
    "tote-strawberry":    { name: "Strawberry Tote",    price: 38.0, art: "🍓" },
    "cozy-bee":       { name: "Blue Bee Cozy",  price: 8.0,  art: "🐝" },
    "cozy-daisy":     { name: "Daisy Cozy",     price: 8.0,  art: "🌼" },
    "scrunchie-butterfly":      { name: "Butterfly Scrunchie",       price: 4.0, art: "🦋" },
    "scrunchie-cherry-blossom": { name: "Cherry Blossom Scrunchie",  price: 4.0, art: "🌸" },
    "scrunchie-cherry":         { name: "Cherry Scrunchie",          price: 4.0, art: "🍒" },
    "scrunchie-orange-kitty":   { name: "Orange Kitty Scrunchie",    price: 4.0, art: "🐱" },
    "scrunchie-pink-bumble-bee":{ name: "Pink Bumble Bee Scrunchie", price: 4.0, art: "🐝" },
    "scrunchie-pretty-in-pink": { name: "Pretty in Pink Scrunchie",  price: 4.0, art: "🎀" },
    "scrunchie-wildflower":     { name: "Wildflower Scrunchie",      price: 4.0, art: "🌼" },
    "scrunchie-strawberry":     { name: "Strawberry Scrunchie",      price: 4.0, art: "🍓" },
    "scrunchie-bundle":         { name: "Scrunchie Bundle (3)",      price: 9.0, art: "🎀" },
    "scrunchie-byo-bundle":     { name: "Build Your Own Bundle",     price: 9.0, art: "🎀" },
    "bow-sage":         { name: "Sage Bow",         price: 10.0, art: "🎗️" },
    "bow-gingham":      { name: "Gingham Bow",      price: 10.0, art: "🎀" },
    "bow-sage-gingham": { name: "Sage Gingham Bow", price: 10.0, art: "🎀" },
    "bow-blue-rose":    { name: "Blue Rose Bow",    price: 10.0, art: "🎀" },
    "bloom-cream":      { name: "Cream Bloom",      price: 10.0, art: "🌸" },
    "bloom-pink":       { name: "Pink Bloom",       price: 10.0, art: "🌸" }
  };

  /* Per-variant photos + copy for the print/style picker cards.
     Keyed by the same product ids as PRODUCTS. images[0] is the main
     photo; any extras become the thumbnail gallery. Prices live in
     PRODUCTS (keep index.html's <option> labels in sync with them). */
  var VARIANTS = {
    "tote-sunflower": {
      alt: "Handmade puffy woven tote in a sunflower, honeycomb, and bee print",
      blurb: "Our puffy woven tote — hand-cut squares of sunflowers, honeycomb, and tiny bees, quilted into pillowy softness. A true statement piece that hugs whatever you carry.",
      details: "12″ × 12″ · 20″ strap drop · puffy hand-woven panels · roomy slouch shape · spot clean, reshape by hand. Made to order — please allow 7–12 business days.",
      images: ["assets/tote-sunflower.jpg", "assets/tote-sunflower-detail.jpg"]
    },
    "tote-mushroom": {
      alt: "Handmade tote in an olive-green woodland mushroom print",
      blurb: "Little red-capped mushrooms scattered across olive-green cotton — a walk through the forest floor, tucked under your arm. Made for foragers, readers, and cottage dreamers.",
      details: "15″ × 14″ · 12″ strap drop · front pocket 7″ × 6″ · spot clean. Made to order — please allow 5–10 business days.",
      images: ["assets/tote-mushroom.jpg"]
    },
    "tote-mustard-floral": {
      alt: "Handmade tote in a golden mustard vintage rose floral print",
      blurb: "Dusty roses climbing over warm mustard-gold — a little vintage, a little sun-faded, endlessly cozy. The everyday tote with a storybook heart.",
      details: "10″ × 12″ · 9″ strap drop · spot clean. Made to order — please allow 5–10 business days.",
      images: ["assets/tote-mustard-floral.jpg"]
    },
    "tote-blue-rose": {
      alt: "Handmade mini tote in a pale blue print scattered with tiny pink roses",
      blurb: "Tiny pink roses drifting over the softest powder blue — a sweet little mini tote, just right for your small everyday essentials.",
      details: "Mini tote · 8″ × 4″ · 6″ strap drop · fully lined · spot clean. Made to order — please allow 5–10 business days.",
      images: ["assets/tote-blue-rose.jpg", "assets/tote-blue-rose-2.jpg", "assets/tote-blue-rose-3.jpg"]
    },
    "tote-butterfly": {
      alt: "Handmade cream tote with a lily-of-the-valley and pink butterfly print, lined in white",
      blurb: "Lily-of-the-valley and soft pink butterflies scattered across warm cream — a spring meadow you can carry. Fully lined, with a handy front pocket.",
      details: "7″ × 6″ × 12″ · 11″ strap drop · front pocket 5″ × 9″ · fully lined · spot clean. Made to order — please allow 5–10 business days.",
      images: ["assets/tote-butterfly.jpg", "assets/tote-butterfly-2.jpg", "assets/tote-butterfly-inside.jpg"]
    },
    "tote-strawberry": {
      alt: "Handmade cream tote covered in a red strawberry and green vine print, lined in white",
      blurb: "Sweet wild strawberries tumbling over cream — a little berry patch of a bag. Fully lined and roomy, made for market days and library hauls.",
      details: "Roomy lined tote · spot clean. Made to order — please allow 5–10 business days.",
      images: ["assets/tote-strawberry.jpg", "assets/tote-strawberry-inside.jpg"]
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
      images: ["assets/scrunchie-orange-kitty.jpg?v=2"]
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
    "scrunchie-strawberry": {
      alt: "Handmade scrunchie in a red strawberry and green leaf print",
      blurb: "Ripe little strawberries on leafy green — the sweetest bit of summer for your wrist or your hair.",
      details: "One size · soft & springy, gentle on hair · hand wash, lay flat to dry.",
      images: ["assets/scrunchie-strawberry.jpg"]
    },
    "scrunchie-bundle": {
      alt: "Set of three handmade scrunchies in red, cream, and navy",
      blurb: "Three everyday scrunchies in classic red, cream, and navy — the perfect starter trio, and a little kinder on the price.",
      details: "Set of 3 (red · cream · navy) · one size each · hand wash, lay flat to dry.",
      images: ["assets/scrunchie-bundle.jpg"]
    },
    "scrunchie-byo-bundle": {
      alt: "Three handmade scrunchies in a build-your-own bundle",
      blurb: "Can't pick just one print? Choose any three of our scrunchie prints and we'll bundle them together — same sweet trio price, your choice of prints, one shipping.",
      details: "Pick your 3 prints at checkout · one size each · hand wash, lay flat to dry.",
      images: ["assets/scrunchie-bundle.jpg"]
    },
    "bow-sage": {
      alt: "Handmade sage-green floral sailor bow",
      blurb: "A little extra magic, tucked right where you'll notice it. Hand-tied from cotton with finished edges and your choice of clip, elastic, or O-ring — proof that a small detail can still make a day feel special.",
      details: "6″ long × 7″ wide · spot clean only · store away from direct sun to keep color true.",
      images: ["assets/bow-sage.jpg"]
    },
    "bow-gingham": {
      alt: "Handmade taupe gingham sailor bow",
      blurb: "Soft taupe gingham, hand-tied into a sweet sailor bow — a cozy little check that pairs with everything from sundresses to storybooks.",
      details: "6″ long × 7″ wide · spot clean only · store away from direct sun to keep color true.",
      images: ["assets/bow-gingham.jpg?v=2"]
    },
    "bow-sage-gingham": {
      alt: "Handmade sage-green gingham sailor bow scattered with tiny roses",
      blurb: "Sage-green gingham strewn with the tiniest pink roses — a garden picnic of a bow, hand-tied with finished edges.",
      details: "6″ long × 7″ wide · spot clean only · store away from direct sun to keep color true.",
      images: ["assets/bow-sage-gingham.jpg?v=2"]
    },
    "bow-blue-rose": {
      alt: "Handmade powder-blue sailor bow with pink cottage roses",
      blurb: "Powder-blue cotton dotted with soft pink roses — a dreamy, storybook bow hand-tied with finished edges.",
      details: "6″ long × 7″ wide · spot clean only · store away from direct sun to keep color true.",
      images: ["assets/bow-blue-rose.jpg"]
    },
    "bloom-cream": {
      alt: "Handmade fabric flower hair clip in a cream ditsy rosebud print",
      blurb: "A hand-folded fabric bloom in soft cream scattered with tiny rosebuds — a little posy for your hair that never wilts. Each petal shaped by hand.",
      details: "Fabric flower on a secure clip · spot clean · shape petals by hand.",
      images: ["assets/bloom-cream.jpg"]
    },
    "bloom-pink": {
      alt: "Handmade fabric flower hair clip in a soft pink rosebud print",
      blurb: "A hand-folded fabric bloom in the sweetest blush pink — a petal-soft posy for your hair, made to be worn again and again. Each petal shaped by hand.",
      details: "Fabric flower on a secure clip · spot clean · shape petals by hand.",
      images: ["assets/bloom-pink.jpg"]
    }
  };

  /* Live Stripe Payment Links — verified against the Stripe account
     on 2026-07-15. Each opens that single item's hosted checkout
     ($6.50 shipping, US address, NEST10 accepted). An id that's
     missing here is sold out / hidden and its card shows "Coming
     soon": tote-strawberry, cozy-bee and cozy-daisy are out until
     restocked. To re-open one, add its link back here. */
  var LINKS = {
    "tote-sunflower":      "https://buy.stripe.com/28E28rbhEfDb9xoetHfjG05",
    "tote-mushroom":       "https://buy.stripe.com/5kQcN53PcgHf5h8clzfjG06",
    "tote-mustard-floral": "https://buy.stripe.com/00w3cvetQ1MlbFw99nfjG07",
    "tote-blue-rose":      "https://buy.stripe.com/aFa5kD99w9eN9xo4T7fjG08",
    "tote-butterfly":      "https://buy.stripe.com/dRmeVd5XkgHfcJA2KZfjG09",
    "scrunchie-butterfly":      "https://buy.stripe.com/3cIaEX71o9eNdNE4T7fjG0f",
    "scrunchie-cherry-blossom": "https://buy.stripe.com/4gM5kDfxU8aJ3902KZfjG0g",
    "scrunchie-cherry":         "https://buy.stripe.com/cNi6oHfxUfDb5h8etHfjG0h",
    "scrunchie-orange-kitty":   "https://buy.stripe.com/3cI4gz71o4Yx9xogBPfjG0i",
    "scrunchie-pink-bumble-bee":"https://buy.stripe.com/dRm6oHclI3Ut4d4dpDfjG0j",
    "scrunchie-pretty-in-pink": "https://buy.stripe.com/00wdR9gBY3Ut6lc1GVfjG0k",
    "scrunchie-wildflower":     "https://buy.stripe.com/eVq7sLetQez710S1GVfjG0l",
    "scrunchie-strawberry":     "https://buy.stripe.com/dRmdR9clIez724WbhvfjG0m",
    "scrunchie-bundle":         "https://buy.stripe.com/00waEX1H48aJfVM1GVfjG04",
    "scrunchie-byo-bundle":     "https://buy.stripe.com/aFaeVd0D00Ih9xo71ffjG0r",
    "bow-sage":         "https://buy.stripe.com/dRmdR985scqZ7pgclzfjG0b",
    "bow-gingham":      "https://buy.stripe.com/dRmaEX4Tgez7dNEetHfjG0c",
    "bow-sage-gingham": "https://buy.stripe.com/cNi7sL3Pc1MldNEbhvfjG0d",
    "bow-blue-rose":    "https://buy.stripe.com/eVqaEX0D0fDbdNE4T7fjG0e",
    "bloom-cream":      "https://buy.stripe.com/aFa00jbhEez710S5XbfjG0p",
    "bloom-pink":       "https://buy.stripe.com/8x2bJ1gBY9eN10S99nfjG0q"
  };

  var money = function (n) { return "$" + n.toFixed(2); };

  // Shop opens Aug 15, 2026, 9am Central — the same instant as the
  // countdown. Until then the Buy buttons stay closed.
  var SHOP_OPENS = new Date("2026-08-15T09:00:00-05:00").getTime();
  var shopOpen = Date.now() >= SHOP_OPENS;
  var cardRefreshers = [];

  /* ----- product variant cards (print/style picker + gallery) ----- */
  function initVariantCards() {
    document.querySelectorAll(".card-variant").forEach(function (card) {
      var sel = card.querySelector(".js-variant-select");
      var img = card.querySelector(".js-variant-img");
      if (!sel || !img) return;
      // Build each option's "— $price" suffix from PRODUCTS (single source of truth)
      Array.prototype.forEach.call(sel.options, function (opt) {
        var pp = PRODUCTS[opt.value];
        if (pp) opt.textContent = opt.textContent + " — " + money(pp.price);
      });
      var placeholder = img.nextElementSibling;
      var thumbs = card.querySelector(".js-variant-thumbs");
      var titleEl = card.querySelector(".js-variant-title");
      var priceEl = card.querySelector(".js-variant-price");
      var blurbEl = card.querySelector(".js-variant-blurb");
      var detailsEl = card.querySelector(".js-variant-details");
      var buyBtn = card.querySelector(".card-add");

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

      // Set the Buy button's label + behaviour for the chosen variant.
      function updateBuy(id) {
        if (!buyBtn) return;
        var link = LINKS[id];
        buyBtn.classList.remove("is-soldout");
        if (!link) {
          // Sold out / hidden until restocked.
          buyBtn.textContent = "Coming soon";
          buyBtn.disabled = true;
          buyBtn.removeAttribute("data-href");
          buyBtn.classList.add("is-soldout");
        } else if (!shopOpen) {
          // Available, but the shop hasn't opened yet.
          buyBtn.textContent = "Opens August 15 🪺";
          buyBtn.disabled = true;
          buyBtn.removeAttribute("data-href");
        } else {
          buyBtn.textContent = "Buy now →";
          buyBtn.disabled = false;
          buyBtn.setAttribute("data-href", link);
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
        updateBuy(id);
      }

      sel.addEventListener("change", function () { applyVariant(sel.value); });
      if (thumbs) {
        thumbs.addEventListener("click", function (e) {
          var b = e.target.closest(".thumb");
          if (b) showImage(b.getAttribute("data-src"));
        });
      }
      applyVariant(sel.value);
      // Let the launch moment re-run this card so its button opens live.
      cardRefreshers.push(function () { applyVariant(sel.value); });
    });
  }
  initVariantCards();

  // Buy buttons open the item's Stripe checkout in a new tab.
  document.querySelectorAll(".card-add").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var href = btn.getAttribute("data-href");
      if (btn.disabled || !href) return;
      window.open(href, "_blank", "noopener");
    });
  });

  // When the countdown hits zero, switch every Buy button on without a reload.
  document.addEventListener("shop:open", function () {
    if (shopOpen) return;
    shopOpen = true;
    cardRefreshers.forEach(function (fn) { fn(); });
  });
})();
