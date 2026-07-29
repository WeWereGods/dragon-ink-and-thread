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

  function add(id, qty) {
    if (!PRODUCTS[id]) return;
    qty = qty || 1;
    var it = find(id);
    if (it) it.qty += qty; else cart.push({ id: id, qty: qty });
    persist(); render(); openDrawer();
  }
  function setQty(id, qty) {
    var it = find(id); if (!it) return;
    it.qty = qty;
    if (it.qty <= 0) cart = cart.filter(function (x) { return x.id !== id; });
    persist(); render();
  }
  function removeItem(id) { cart = cart.filter(function (x) { return x.id !== id; }); persist(); render(); }

  /* ----- build the DOM (cart button in header, drawer + scrim) ----- */
  var btn, badge, scrim, drawer, itemsEl, subtotalEl, checkoutBtn, emptyEl, footerEl;

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
        '<p class="cart-ship-note">Shipping (one flat fee) &amp; tax calculated at checkout. Local to San Antonio? Choose <strong>Local pickup</strong> to skip shipping.</p>' +
        '<button class="btn btn-primary cart-checkout" type="button">Checkout →</button>' +
        '<p class="cart-checkout-note" role="status" aria-live="polite"></p>' +
      '</div>';

    document.body.appendChild(scrim);
    document.body.appendChild(drawer);

    itemsEl = drawer.querySelector(".cart-items");
    emptyEl = drawer.querySelector(".cart-empty");
    footerEl = drawer.querySelector(".cart-footer");
    subtotalEl = drawer.querySelector(".cart-subtotal");
    checkoutBtn = drawer.querySelector(".cart-checkout");

    btn.addEventListener("click", openDrawer);
    scrim.addEventListener("click", closeDrawer);
    drawer.querySelector(".cart-close").addEventListener("click", closeDrawer);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !drawer.hidden) closeDrawer(); });
    checkoutBtn.addEventListener("click", checkout);

    // Delegated qty/remove controls inside the drawer
    itemsEl.addEventListener("click", function (e) {
      var t = e.target.closest("[data-cart-act]"); if (!t) return;
      var id = t.getAttribute("data-id"); var it = find(id); if (!it) return;
      var act = t.getAttribute("data-cart-act");
      if (act === "inc") setQty(id, it.qty + 1);
      else if (act === "dec") setQty(id, it.qty - 1);
      else if (act === "remove") removeItem(id);
    });
  }

  function openDrawer() { scrim.hidden = false; drawer.hidden = false; document.body.classList.add("cart-open"); }
  function closeDrawer() { scrim.hidden = true; drawer.hidden = true; document.body.classList.remove("cart-open"); }

  function render() {
    var c = count();
    if (badge) { badge.textContent = String(c); badge.hidden = c === 0; }
    if (!itemsEl) return;
    var empty = cart.length === 0;
    emptyEl.style.display = empty ? "" : "none";
    footerEl.style.display = empty ? "none" : "";
    itemsEl.innerHTML = cart.map(function (x) {
      var p = PRODUCTS[x.id] || { name: x.id, price: 0, art: "🧵" };
      var v = VARIANTS[x.id] || {};
      var img = (v.images && v.images[0]) || "";
      return (
        '<div class="cart-line">' +
          '<div class="cart-line-media">' +
            (img ? '<img src="' + img + '" alt="" loading="lazy" decoding="async" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';" />' : '') +
            '<div class="cart-line-ph" ' + (img ? 'style="display:none;"' : '') + ' aria-hidden="true"><span>' + (p.art || "🧵") + '</span></div>' +
          '</div>' +
          '<div class="cart-line-body">' +
            '<p class="cart-line-name">' + p.name + '</p>' +
            '<p class="cart-line-price">' + money(p.price) + '</p>' +
            '<div class="cart-qty">' +
              '<button class="cart-qty-btn" type="button" data-cart-act="dec" data-id="' + x.id + '" aria-label="Decrease quantity">–</button>' +
              '<span class="cart-qty-n" aria-label="Quantity">' + x.qty + '</span>' +
              '<button class="cart-qty-btn" type="button" data-cart-act="inc" data-id="' + x.id + '" aria-label="Increase quantity">+</button>' +
              '<button class="cart-remove" type="button" data-cart-act="remove" data-id="' + x.id + '">Remove</button>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join("");
    subtotalEl.textContent = money(subtotal());
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
      body: JSON.stringify({ items: cart.map(function (x) { return { id: x.id, qty: x.qty }; }) })
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (res.ok && res.d && res.d.url) { window.location.href = res.d.url; }
        else { note.textContent = (res.d && res.d.error) || "Checkout couldn't start — please try again or email us."; checkoutBtn.disabled = false; }
      })
      .catch(function () { note.textContent = "Network hiccup — please try again in a moment."; checkoutBtn.disabled = false; });
  }

  /* ----- add-to-cart buttons anywhere on the page ----- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-cart-add]"); if (!a) return;
    e.preventDefault();
    add(a.getAttribute("data-cart-add"));
  });

  // Expose a tiny API for other scripts.
  window.DIT_CART = { add: add, open: openDrawer };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
  function init() { build(); render(); }
})();
