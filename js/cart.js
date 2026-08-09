/* Dragon Ink and Thread — shopping cart (vanilla JS, no deps).
   -------------------------------------------------------------
   A localStorage cart + slide-out drawer. "Add to cart" buttons on the
   catalog (rendered by shop.js with data-cart-add="<id>") feed it. Checkout
   POSTs the cart to the Cloudflare Worker, which returns a Stripe Checkout
   URL to redirect to. Prices/names come from window.DIT_SHOP (shop-data.js),
   which must load before this file. Real charges are set server-side in the
   Worker — this file is display only. */
(function () {
  "use strict";

  /* Deployed Cloudflare Worker that creates the Stripe Checkout Session
     (see worker/README.md). */
  var CHECKOUT_URL = "https://dit-checkout.dragoninkandthread.workers.dev";

  /* Display-only mirror of the Worker's shipping rules — the real fee is set
     server-side. The numbers now live in SHIPPING in js/shop-data.js so the
     drawer and the product pages can't disagree; the fallbacks below only apply
     if this file somehow loads without shop-data.js. Still KEEP IN SYNC with
     SHIP_STANDARD / SHIP_SMALL / FREE_SHIP_OVER in worker/checkout-worker.js
     (those are in cents, these are in dollars). */
  var SHIP = (window.DIT_SHOP && window.DIT_SHOP.SHIPPING) || {};
  var SHIP_STANDARD  = SHIP.standard != null ? SHIP.standard : 6.5;  // order contains a tote
  var SHIP_SMALL     = SHIP.small    != null ? SHIP.small    : 4.5;  // scrunchies/bows only
  var FREE_SHIP_OVER = SHIP.freeOver != null ? SHIP.freeOver : 50;   // subtotal ≥ this ships free (0 = off)

  var SHOP = window.DIT_SHOP || {};
  var PRODUCTS = SHOP.PRODUCTS || {};
  var VARIANTS = SHOP.VARIANTS || {};
  var KEY = "dit-cart-v1";

  var money = function (n) { return "$" + n.toFixed(2); };
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} }
  var cart = load();

  function find(id) { for (var i = 0; i < cart.length; i++) { if (cart[i].id === id) return cart[i]; } return null; }
  function count() { return cart.reduce(function (s, x) { return s + x.qty; }, 0); }
  function subtotal() { return cart.reduce(function (s, x) { var p = PRODUCTS[x.id]; return s + (p ? p.price : 0) * x.qty; }, 0); }
  /* Which ids pay the standard fee. Mirrors SHIP_STANDARD_PREFIXES in the
     Worker — this only writes the drawer's wording; the Worker sets the price. */
  var STD_PREFIXES = SHIP.standardPrefixes || ["tote-"];
  function needsBigMailer() {
    for (var i = 0; i < cart.length; i++) {
      for (var p = 0; p < STD_PREFIXES.length; p++) {
        if (cart[i].id.indexOf(STD_PREFIXES[p]) === 0) return true;
      }
    }
    return false;
  }

  /* The shipping line under the subtotal — the plain facts, quietly.
     The free-shipping nudge is NOT in here any more; it has its own element
     (see nudgeMarkup) because it was a clause in the middle of a grey
     paragraph, which is a place people do not read. */
  function shipNote() {
    var sub = subtotal();
    if (FREE_SHIP_OVER > 0 && sub >= FREE_SHIP_OVER) {
      return "Tax calculated at checkout.";
    }
    var fee = needsBigMailer() ? SHIP_STANDARD : SHIP_SMALL;
    return "Shipping " + money(fee) + " (one fee per order) &amp; tax calculated at checkout. " +
           "Local to San Antonio? Choose <strong>Local pickup</strong> to skip shipping.";
  }

  /* THE FREE-SHIPPING NUDGE (2026-08-08).
     Stripe's own history says three abandoned carts sat just under the $50
     line — the shopper reached the payment page, was shown $6.50 of postage
     they could have avoided for a few dollars more, and left. The information
     was already in the drawer; it was just set in the same small grey type as
     the tax note, in the middle of a sentence.
     So it gets its own block, a progress bar, and something to click. Shown
     only while the threshold is live and reachable. */
  function nudgeMarkup() {
    if (!(FREE_SHIP_OVER > 0)) return "";
    var sub = subtotal();
    if (sub >= FREE_SHIP_OVER) {
      return '<p class="cart-nudge is-won">Free shipping &mdash; this one\'s on me. &#10003;</p>';
    }
    var left = FREE_SHIP_OVER - sub;
    var pct = Math.max(0, Math.min(100, Math.round((sub / FREE_SHIP_OVER) * 100)));
    return (
      '<div class="cart-nudge">' +
        '<p class="cart-nudge-text">You\'re <strong>' + money(left) + '</strong> from free shipping.</p>' +
        '<div class="cart-nudge-track" role="presentation"><span style="width:' + pct + '%"></span></div>' +
        '<button class="cart-nudge-link" type="button" data-cart-keep-looking>Keep looking &rarr;</button>' +
      '</div>'
    );
  }

  /* How many of this item one order may hold. Defaults to 1, so anything
     one-of-a-kind (totes, bows) stays un-double-sellable. */
  function maxQty(id) { var p = PRODUCTS[id]; return (p && p.maxQty) || 1; }
  /* Turn ["scrunchie-cherry", …] into "Cherry Scrunchie, …" for display. */
  function pickNames(picks) {
    return (picks || []).map(function (c) { return (PRODUCTS[c] && PRODUCTS[c].name) || c; }).join(", ");
  }

  function add(id, picks) {
    var p = PRODUCTS[id];
    if (!p || p.soldOut) return;
    var line = find(id);
    if (!line) {
      var entry = { id: id, qty: 1 };
      if (p.picks) entry.picks = (picks || []).slice(0, p.picks);
      cart.push(entry);
    } else if (p.picks) {
      // One line = one set of picks, so re-adding just updates the chosen prints.
      if (picks && picks.length) line.picks = picks.slice(0, p.picks);
    } else if (line.qty < maxQty(id)) {
      line.qty += 1;
    }
    persist(); render(); openDrawer();
  }
  function removeItem(id) { cart = cart.filter(function (x) { return x.id !== id; }); persist(); render(); }
  function bumpQty(id, delta) {
    var line = find(id); if (!line) return;
    var q = line.qty + delta;
    if (q < 1) { removeItem(id); return; }
    line.qty = Math.min(q, maxQty(id));
    persist(); render();
  }

  /* ----- build the DOM (cart button in header, drawer + scrim) ----- */
  var btn, badge, scrim, drawer, itemsEl, subtotalEl, shipNoteEl, nudgeEl, checkoutBtn, emptyEl, footerEl;

  function build() {
    // Cart button in the site header
    var header = document.querySelector(".header-inner");
    btn = document.createElement("button");
    btn.className = "cart-button";
    btn.type = "button";
    btn.setAttribute("aria-label", "Open cart");
    btn.innerHTML = '<span class="cart-button-icon" aria-hidden="true">🧺</span><span class="cart-badge" hidden>0</span>';
    badge = btn.querySelector(".cart-badge");
    if (header) header.appendChild(btn);

    // Scrim + drawer
    scrim = document.createElement("div");
    scrim.className = "cart-scrim";
    scrim.hidden = true;

    drawer = document.createElement("aside");
    drawer.className = "cart-drawer";
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-label", "Your cart");
    drawer.setAttribute("aria-modal", "true");
    drawer.hidden = true;
    drawer.innerHTML =
      '<div class="cart-head">' +
        '<h2 class="cart-title">Your basket</h2>' +
        '<button class="cart-close" type="button" aria-label="Close cart">&times;</button>' +
      '</div>' +
      '<div class="cart-items"></div>' +
      '<p class="cart-empty">Your basket is empty — <a href="shop.html">find something lovely</a>.</p>' +
      '<div class="cart-footer">' +
        '<div class="cart-subtotal-row"><span>Subtotal</span><span class="cart-subtotal">$0.00</span></div>' +
        '<div class="cart-nudge-slot"></div>' +
        '<p class="cart-ship-note"></p>' +
        '<button class="btn btn-primary cart-checkout" type="button">Checkout →</button>' +
        '<p class="cart-checkout-note" role="status" aria-live="polite"></p>' +
      '</div>';

    document.body.appendChild(scrim);
    document.body.appendChild(drawer);

    itemsEl = drawer.querySelector(".cart-items");
    emptyEl = drawer.querySelector(".cart-empty");
    footerEl = drawer.querySelector(".cart-footer");
    subtotalEl = drawer.querySelector(".cart-subtotal");
    shipNoteEl = drawer.querySelector(".cart-ship-note");
    nudgeEl = drawer.querySelector(".cart-nudge-slot");
    checkoutBtn = drawer.querySelector(".cart-checkout");

    btn.addEventListener("click", openDrawer);
    scrim.addEventListener("click", closeDrawer);
    drawer.querySelector(".cart-close").addEventListener("click", closeDrawer);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !drawer.hidden) closeDrawer(); });
    checkoutBtn.addEventListener("click", checkout);

    /* "Keep looking" is the whole point of the nudge — telling someone they
       are $4 short is useless if the next move is theirs to work out. On the
       catalog it just closes the drawer; anywhere else it goes there. */
    drawer.addEventListener("click", function (e) {
      if (!e.target.closest("[data-cart-keep-looking]")) return;
      closeDrawer();
      if (!/shop\.html$/.test(location.pathname)) location.href = "shop.html";
    });

    // Delegated qty/remove controls inside the drawer
    itemsEl.addEventListener("click", function (e) {
      var t = e.target.closest("[data-cart-act]"); if (!t) return;
      var act = t.getAttribute("data-cart-act"), id = t.getAttribute("data-id");
      if (act === "remove") removeItem(id);
      else if (act === "inc") bumpQty(id, 1);
      else if (act === "dec") bumpQty(id, -1);
    });
  }

  function openDrawer() { scrim.hidden = false; drawer.hidden = false; document.body.classList.add("cart-open"); }
  function closeDrawer() { scrim.hidden = true; drawer.hidden = true; document.body.classList.remove("cart-open"); }

  function render() {
    var c = count();
    if (badge) { badge.textContent = String(c); badge.hidden = c === 0; }
    // Reflect basket state on the catalog "Add to cart" buttons.
    document.querySelectorAll("[data-cart-add]").forEach(function (b) {
      var id = b.getAttribute("data-cart-add");
      var line = find(id), mx = maxQty(id);
      if (!line) b.textContent = "Add to cart";
      else if (mx > 1 && line.qty < mx) b.textContent = "Add another (" + line.qty + ")";
      else if (mx > 1) b.textContent = "Max " + mx + " in basket ✓";
      else b.textContent = "In basket ✓";
      b.classList.toggle("in-cart", !!line);
    });
    if (!itemsEl) return;
    var empty = cart.length === 0;
    emptyEl.style.display = empty ? "" : "none";
    footerEl.style.display = empty ? "none" : "";
    itemsEl.innerHTML = cart.map(function (x) {
      var p = PRODUCTS[x.id] || { name: x.id, price: 0, art: "🧵" };
      var v = VARIANTS[x.id] || {};
      var img = (v.images && v.images[0]) || "";
      var mx = maxQty(x.id);
      return (
        '<div class="cart-line">' +
          '<div class="cart-line-media">' +
            (img ? '<img src="' + img + '" alt="" loading="lazy" decoding="async" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';" />' : '') +
            '<div class="cart-line-ph" ' + (img ? 'style="display:none;"' : '') + ' aria-hidden="true"><span>' + (p.art || "🧵") + '</span></div>' +
          '</div>' +
          '<div class="cart-line-body">' +
            '<p class="cart-line-name">' + p.name + '</p>' +
            (x.picks && x.picks.length ? '<p class="cart-line-picks">' + pickNames(x.picks) + '</p>' : '') +
            '<p class="cart-line-price">' + money(p.price * x.qty) +
              (x.qty > 1 ? ' <span class="cart-line-each">(' + x.qty + ' × ' + money(p.price) + ')</span>' : '') +
            '</p>' +
            '<div class="cart-line-actions">' +
              (mx > 1
                ? '<span class="cart-qty">' +
                    '<button class="cart-qty-btn" type="button" data-cart-act="dec" data-id="' + x.id + '" aria-label="One fewer ' + p.name + '">&minus;</button>' +
                    '<span class="cart-qty-n" aria-live="polite">' + x.qty + '</span>' +
                    '<button class="cart-qty-btn" type="button" data-cart-act="inc" data-id="' + x.id + '"' +
                      (x.qty >= mx ? ' disabled title="Limit ' + mx + ' per order"' : '') +
                      ' aria-label="One more ' + p.name + '">+</button>' +
                  '</span>'
                : '<span class="cart-line-oneofakind">' + (p.picks ? "One bundle per order" : "One of a kind") + '</span>') +
              '<button class="cart-remove" type="button" data-cart-act="remove" data-id="' + x.id + '">Remove</button>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join("");
    subtotalEl.textContent = money(subtotal());
    if (nudgeEl) nudgeEl.innerHTML = nudgeMarkup();
    if (shipNoteEl) shipNoteEl.innerHTML = shipNote();
  }

  function checkout() {
    var note = drawer.querySelector(".cart-checkout-note");
    if (cart.length === 0) return;
    if (!CHECKOUT_URL) { note.textContent = "Checkout isn't switched on yet — please check back shortly."; return; }
    checkoutBtn.disabled = true;
    note.textContent = "Taking you to secure checkout…";
    fetch(CHECKOUT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart.map(function (x) {
          var line = { id: x.id, qty: x.qty };
          if (x.picks && x.picks.length) line.picks = x.picks;
          return line;
        })
      })
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (res.ok && res.d && res.d.url) {
          /* Hand the order size to success.html so it can report the sale to
             Pinterest. That page runs AFTER Stripe, by which point the cart is
             gone, so this is the only moment the value is known client-side.
             Subtotal only — no tax or shipping, which Stripe decides later;
             it is what Pinterest should attribute to the ad either way.
             Written only once checkout genuinely starts, so an abandoned or
             failed attempt leaves nothing behind to be counted as a sale. */
          try {
            localStorage.setItem("dit-pending-order", JSON.stringify({
              value: Number(subtotal().toFixed(2)),
              qty: count(),
              at: Date.now()
            }));
          } catch (e) {}
          window.location.href = res.d.url;
        }
        else { note.textContent = (res.d && res.d.error) || "Checkout couldn't start — please try again or email us."; checkoutBtn.disabled = false; }
      })
      .catch(function () { note.textContent = "Network hiccup — please try again in a moment."; checkoutBtn.disabled = false; });
  }

  /* ----- add-to-cart buttons anywhere on the page ----- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-cart-add]"); if (!a) return;
    e.preventDefault();
    // "Build your own" buttons carry the chosen prints in data-cart-picks,
    // kept up to date by the pickers that shop.js renders on that card.
    var raw = a.getAttribute("data-cart-picks");
    add(a.getAttribute("data-cart-add"), raw ? raw.split(",") : null);
  });

  /* Update a bundle's chosen prints in place (no drawer pop) — used by the
     pickers on the catalog card when the item is already in the basket. */
  function setPicks(id, picks) {
    var line = find(id), p = PRODUCTS[id];
    if (!line || !p || !p.picks) return;
    line.picks = (picks || []).slice(0, p.picks);
    persist(); render();
  }

  // Expose a tiny API for other scripts.
  window.DIT_CART = { add: add, open: openDrawer, setPicks: setPicks };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
  function init() { build(); render(); }
})();
