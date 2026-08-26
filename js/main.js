/* Dragon Ink and Thread — small progressive-enhancement scripts.
   The site works fully without JS; this just adds niceties, plus the
   shop (each item links straight to its own Stripe checkout). */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     Sticky-header height → --header-h
     Anchor jumps (#join, from every "Join the Nest" link) must land BELOW
     .site-header, which is position:sticky, top:0. Its height is not a
     constant: it is ~105px on desktop but ~139px at 375px wide, because the
     countdown bar wraps — and the bar's text changes on its own when the
     offer flips (NEST10 → NEST15) or custom orders open. A hard-coded
     scroll-margin-top is therefore wrong at some widths the day it is
     written, and silently wrong again whenever that copy changes.
     Measured here instead; the CSS falls back to 105px without JS.
     --------------------------------------------------------- */
  var headerEl = document.querySelector(".site-header");
  function syncHeaderHeight() {
    if (!headerEl) return;
    document.documentElement.style.setProperty(
      "--header-h", headerEl.getBoundingClientRect().height + "px"
    );
  }
  if (headerEl) {
    syncHeaderHeight();
    /* ⚠️ The FIRST measurement is usually too big and must not be the last one.
       At this point js/dates.js has not necessarily run, so BOTH halves of every
       pre-open/post-open and offer-on/offer-off pair are still in the bar —
       measured 186px on a 1280px viewport against a settled height of 105px.
       Re-measure at each point the header can still change: after dates.js has
       toggled (next frame), once webfonts swap in, and on full load. */
    requestAnimationFrame(syncHeaderHeight);
    window.addEventListener("load", syncHeaderHeight);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncHeaderHeight);
    // ResizeObserver also catches the bar re-wrapping from a TEXT change, which
    // a resize listener alone would miss.
    if (window.ResizeObserver) new ResizeObserver(syncHeaderHeight).observe(headerEl);
    else window.addEventListener("resize", syncHeaderHeight);
  }

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
    // Single source of truth: js/dates.js (loaded before this file).
    var LAUNCH = (window.DIT_DATES && window.DIT_DATES.ts) ||
      new Date("2026-08-15T09:00:00-05:00").getTime();
    var countdownInterval = null;
    var tickCountdown = function () {
      var diff = LAUNCH - Date.now();
      if (diff <= 0) {
        countdownClock.textContent = "Custom orders are open! 🎉";
        countdownClock.removeAttribute("aria-hidden");
        if (countdownInterval) window.clearInterval(countdownInterval);
        // Flip every "opens August 15" phrase on the page to its open wording
        // without a reload — for anyone sitting on the page as it ticks over.
        if (window.DIT_DATES) window.DIT_DATES.apply();
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
              "You're in the Nest! 🌿 We'll write the moment there's something lovely to share.";
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

  /* NOTE (2026-07-30): the homepage's old variant-card shop lived here — its
     PRODUCTS / VARIANTS / LINKS maps, initVariantCards(), and the per-item Buy
     handler. The 2026-07-28 redesign replaced it with a "Shop the collection"
     CTA linking to shop.html, so none of it had run since; it was still carrying
     the pre-repricing $4/$9 scrunchie prices, one wrong file away from being
     edited by mistake. Product data now lives ONLY in js/shop-data.js.
     The countdown still dispatches "shop:open"; nothing listens, which is fine. */

  /* =========================================================
     Stories — a lookbook of past pieces that have found homes.
     TO ADD A PIECE: drop a photo in assets/ and add an entry to
     PAST_MAKES below. `art` is an emoji shown if the photo is
     missing (so a not-yet-added photo never looks broken).
     ========================================================= */
  var PAST_MAKES = [
    /* Maurya Buchanan's pair, added 2026-08-25 WITH HER PERMISSION, asked and given.
       Two separate pieces, not one — the wheelchair tote ties on with four ties, the
       traditional one hangs from a long strap. They were briefly read as a single
       dual-mode bag from photographs; they are not. */
    { img: "assets/tote-wheelchair-nestas-cats.jpg", art: "🐈‍⬛", title: "The Nesta's Cats Wheelchair Tote",
      story: "A quilted tie-on tote made to hang from a wheelchair, in a print of black cats winding through dark florals. Four ties fasten it to the handles, and the pocket bags sit where a hand actually reaches. Made for a customer in San Antonio who wanted something that looked like hers rather than like equipment. 🐈‍⬛" },
    { img: "assets/tote-nestas-cats.jpg", art: "🖤", title: "The Nesta's Cats Tote",
      story: "The companion piece, in the same cats-and-florals print — quilted, lined in soft charcoal, and hung from a long strap that sits at the hip. Ordered together with the wheelchair tote so the two would match. 🖤" },
    { img: "assets/scrunchie-strawberry.jpg", art: "🍓", title: "Strawberry Scrunchie",
      story: "Ripe little strawberries on leafy green — the sweetest bit of summer for your wrist or your hair. The shop's first customer bought one alongside her strawberry tote, entirely her own idea, and that pairing is the reason every product page now suggests something to go with it. 🍓" },
    { img: "assets/kindle-case.jpg", art: "📖", title: "Road Trip Kindle Case",
      story: "A padded, quilted e-reader sleeve in a vintage road-sign and Route 66 print, with a tie closure to keep your Kindle cozy and safe on every adventure. 📖" },
    { img: "assets/tote-lavender-bee.jpg", art: "🐝", title: "Lavender and Honeybee Wheelchair Tote",
      story: "A roomy tie-on tote made to hang from a wheelchair (or the back of a chair), in a lavender, hollyhock, and honeybee-skep print lined in soft buttercup yellow — keeping your essentials close at hand. 🐝" },
    { img: "assets/pouch-patchwork.jpg", art: "🌸", title: "Cottage Patchwork Pouch",
      story: "Sage, blush, and powder-blue florals pieced by hand into a zippered pouch — a little keeper for makeup, notions, or small treasures. 🌸" },
    { img: "assets/bandana-toffee-windowpane.jpg", art: "🐾", title: "Toffee Windowpane Bandana",
      story: "Toffee brown plaid crossed with fine cream lines — quiet, a little tweedy, and the one for a dog who'd rather look like he's off to the pub than to a party. Reversible, the same plaid on both sides, on an elasticated channel that stretched straight onto the collar he already wore. Found his home. 🐾" },
    { img: "assets/tote-music-teacher.jpg", art: "🎶", title: "The Music Teacher's Tote",
      story: "Three music prints, found one at a time: powder-blue sheet music for the outside, a scatter of cream notes on black for the lining, and handwritten manuscript tucked inside the pocket. Made for a music teacher — sized for her books and her laptop, with the pockets set where her keys actually live, and a matching scrunchie tied to the strap. 🎶" },
    { img: "assets/tea-cosy-midnight-garden.jpg", art: "🌹", title: "Midnight Garden Tea Cosy",
      story: "Cabbage roses and golden peonies strewn across black cotton, quilted and padded with a little loop to lift it by — made to keep a pot hot for as long as the conversation lasts. A custom order, boxed and on its way to her table. 🌹" },
    { img: "assets/tote-strawberry.jpg", art: "🍓", title: "Strawberry Tote",
      story: "One of the very first totes I ever made — cream canvas tumbling with wild strawberries and trailing green vines, fully lined. A true one-of-a-kind that found its home early on. This print has retired now, but it holds a sweet little place in the Nest's beginnings. 🍓" },
    { img: "assets/bloom-cream.jpg", art: "🌸", title: "Cream Bloom",
      story: "A hand-folded fabric bloom in soft cream scattered with tiny rosebuds — a little posy for your hair that never wilts, each petal shaped by hand. Retired now, but always one of my most delicate makes. 🌸" },
    { img: "assets/bloom-pink.jpg", art: "🌸", title: "Pink Bloom",
      story: "A hand-folded bloom in the sweetest blush pink — a petal-soft posy made to be worn again and again. This one has found its place in the Nest's history. 🌸" },
    { img: "assets/cozy-bee.jpg", art: "🐝", title: "Blue Bee Cozy",
      story: "A snug, fleece-lined sleeve for slim cans — dusty-blue cotton dotted with bees and dandelions, made to keep drinks cold and hands comfy. A cozy little make, now part of our story. 🐝" },
    { img: "assets/cozy-daisy.jpg", art: "🌼", title: "Daisy Cozy",
      story: "A padded wrap for tumblers and cups in cheerful buttercream daisies — grippy, insulating, and impossibly sweet. Retired to the Nest's history. 🌼" },
    { img: "assets/tote-sunflower.jpg", art: "🌻", title: "Sunflower Tote",
      story: "The puffy woven one — squares of sunflowers, honeycomb and tiny bees cut by hand and quilted into something pillowy enough to hug whatever you put in it. The most involved make in the shop, and it found its home. 🌻" },
    { img: "assets/tote-mushroom.jpg", art: "🍄", title: "Mushroom Tote",
      story: "Little red-capped mushrooms scattered across olive-green cotton — a walk along the forest floor, tucked under one arm. Made for foragers, readers and cottage dreamers, and claimed by one of them. 🍄" },
    { img: "assets/bow-sage.jpg", art: "🎗️", title: "Sage Bow",
      story: "Sage-green florals hand-tied into a sailor bow — the small detail that makes an ordinary day feel deliberate. This print has retired now. 🎗️" },
    { img: "assets/bow-blue-rose.jpg", art: "🎀", title: "Blue Rose Bow",
      story: "Powder-blue cotton dotted with soft pink roses, hand-tied with finished edges — a storybook of a bow, and gone to someone who'll wear it like one. 🎀" }
  ];

  var storiesGrid = document.getElementById("stories-grid");
  if (storiesGrid && PAST_MAKES.length) {
    storiesGrid.innerHTML = PAST_MAKES.map(function (m) {
      var title = m.title || "A past Dragon Ink and Thread piece";
      return (
        '<article class="make-card">' +
          '<div class="make-media">' +
            '<img class="make-photo" src="' + m.img + '" alt="' + title + '" loading="lazy" decoding="async" ' +
              "onerror=\"this.style.display='none'; this.nextElementSibling.style.display='flex';\" />" +
            '<div class="placeholder" style="display:none;" aria-hidden="true"><span>' + (m.art || "🧵") + "</span></div>" +
            '<span class="make-tag">Found a home <img class="ico-basket-img" src="assets/basket.png?v=2" alt="" loading="lazy" decoding="async" /></span>' +
          "</div>" +
          '<div class="make-body">' +
            '<h3 class="make-title">' + title + "</h3>" +
          "</div>" +
        "</article>"
      );
    }).join("");
  }

  /* =========================================================
     Kind Words — REAL customer testimonials only.
     The "#kind-words" section starts hidden and only appears once
     this array has at least one entry, so it's never empty or faked.
     TO ADD ONE (after a customer says something lovely, or leaves a
     review): add an object below. `where` and `stars` are optional.
       { quote: "I get compliments every time I carry it!",
         name: "Jane D.", where: "San Antonio, TX", stars: 5 }
     ========================================================= */
  var TESTIMONIALS = [
    { quote: "Thank you for my custom kindle/book case, I adore it! So happy I can travel with it now in my bag!!",
      name: "Rebekah K.", where: "on the Road Trip Kindle Case", stars: 5 },
    { quote: "I recently got a strawberry tote and a matching scrunchie from you and let me just say I LOVE THEM!! They are so cute, the scrunchie is nice on my curly hair and the tote holds all of my items with no problem. Definitely going to be ordering more!!",
      name: "Brea P.", where: "on the Strawberry Tote", stars: 5 },
    { quote: "Dragon Ink and Thread made the most beautiful tote! She found the most beautiful and unique music fabric for me as a music teacher! The tote is the perfect size for my books and laptop! It has perfectly placed pockets for my keys! Wonderfully made!",
      name: "Cassidy E.", where: "on The Music Teacher's Tote", stars: 5 },
    // Linda Madrid, 2026-08-19. Her own words, sent through the site's contact form
    // (Web3Forms, in Gmail) — typos fixed (spelling and one missing word), nothing reworded.
    // ⚠️ The FORM submission does not contain "five stars" — it ends at "wonderfully made".
    // She gave the rating separately, BY TEXT, confirmed by the owner 2026-08-25. The stars
    // are hers, just from a different channel. Recorded because checking the form alone
    // makes them look invented, which is exactly the wrong conclusion.
    { quote: "I loved Ayla's work. She took an heirloom handmade quilt that has been in my family for 30 years. It was passed down to me from my mother. I wanted to pass it down but we found a hole that needed fixing first. Ayla was able to mend it fast and beautifully — now you can't even tell. Now I can pass it on to my daughter! Ayla also created a custom tea cover with a matching tea mat that are both unique and wonderfully made.",
      name: "Linda M.", where: "on a quilt repair and a custom tea cover", stars: 5 }
  ];

  var testimonialsGrid = document.getElementById("testimonials-grid");
  var kindWords = document.getElementById("kind-words");
  if (testimonialsGrid && kindWords && TESTIMONIALS.length) {
    testimonialsGrid.innerHTML = TESTIMONIALS.map(function (t) {
      var stars = (typeof t.stars === "number" && t.stars > 0)
        ? '<div class="testimonial-stars" aria-label="' + t.stars + ' out of 5 stars">' +
            new Array(Math.min(5, t.stars) + 1).join("★") + "</div>"
        : "";
      var where = t.where ? '<span class="testimonial-where">· ' + t.where + "</span>" : "";
      return (
        '<figure class="testimonial-card">' +
          stars +
          '<blockquote class="testimonial-quote">' + t.quote + "</blockquote>" +
          '<figcaption class="testimonial-attr">' +
            '<span class="testimonial-name">' + t.name + "</span>" + where +
          "</figcaption>" +
        "</figure>"
      );
    }).join("");
    kindWords.hidden = false; // reveal only when there's something real to show
  }
})();
