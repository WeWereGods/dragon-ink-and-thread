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
     Join the Nest — email signup.
     Static site, so this opens the visitor's mail app with a
     pre-filled signup note to us; the list lives in the inbox.
     (Swap for Mailchimp/Buttondown later if the list grows.)
     --------------------------------------------------------- */
  var nestForm = document.getElementById("nestForm");
  var nestNote = document.getElementById("nestNote");
  if (nestForm) {
    nestForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = document.getElementById("nestEmail").value.trim();
      if (!email) return;
      var subject = "Join the Nest 🪺";
      var body =
        "Hi Dragon Ink and Thread!\n\n" +
        "Please add me to the Nest so I hear about new handmade goods and the shop opening.\n\n" +
        "My email: " + email + "\n\nThank you!";
      window.location.href =
        "mailto:dragoninkandthread@gmail.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      if (nestNote) {
        nestNote.textContent =
          "Opening your email app — hit send and you're in the Nest! 🧵";
      }
    });
  }

  /* =========================================================
     Shop / checkout mockup (visual only — no payment)
     ========================================================= */
  var PRODUCTS = {
    tote:      { name: "Handmade Tote", price: 38.0, art: "👜" },
    scrunchie: { name: "Scrunchie",     price: 8.0,  art: "🎀" },
    bow:       { name: "Bow Clip",      price: 10.0, art: "🎗️" }
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
