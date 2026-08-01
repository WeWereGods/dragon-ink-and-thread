/* Dragon Ink and Thread — custom orders page (custom.html).
   Nav / reveal / year (same behaviour as js/shop.js), the Aug 15 gate on the
   request form, and the Web3Forms submit handler.

   THE GATE: custom orders open CUSTOM_OPENS. Before that the form is disabled
   and a notice points at the Nest signup; after it, the form just works — no
   redeploy needed on the day, it flips by itself.
     · To move the date, change CUSTOM_OPENS in **js/dates.js** — that's the
       only place it lives now, and the "opens August 15" wording across all
       three pages follows it automatically (see the .js-pre-open /
       .js-post-open pattern documented there).
     · To start taking requests EARLY, set OPEN_EARLY to true. The banner and
       notice follow automatically. */
(function () {
  "use strict";

  // Single source of truth: js/dates.js (loaded before this file).
  var CUSTOM_OPENS = (window.DIT_DATES && window.DIT_DATES.ts) ||
    new Date("2026-08-15T09:00:00-05:00").getTime();
  var OPEN_EARLY = false;
  var isOpen = OPEN_EARLY || Date.now() >= CUSTOM_OPENS;

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

  /* ----- the gate ----- */
  var opensLabel = new Date(CUSTOM_OPENS).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric"
  });
  var banner = document.getElementById("customBanner");
  var gate = document.getElementById("customGate");
  var fields = document.getElementById("customFields");

  if (banner) {
    // innerHTML rather than textContent so the gold sparkle renders as an
    // image instead of being printed as literal markup.
    var sparkle = '<img class="ico-sparkle" src="assets/sparkle.png" alt="" aria-hidden="true" decoding="async" /> ';
    banner.innerHTML = isOpen
      ? sparkle + "Custom orders are OPEN — tell me what you're imagining"
      : sparkle + "Custom orders open " + opensLabel;
  }
  if (gate && fields) {
    if (isOpen) {
      gate.hidden = true;
      fields.disabled = false;
    } else {
      gate.hidden = false;
      gate.innerHTML =
        "<p class=\"custom-gate-title\">Custom orders open " + opensLabel + ".</p>" +
        "<p>I'm finishing the last few ready-made pieces first, so the request form below opens that morning. " +
        "<a href=\"index.html#home\">Join the Nest</a> and you'll hear the moment it does" +
        // Only claim the discount while the code is actually redeemable.
        ((window.DIT_DATES && window.DIT_DATES.offerLive && window.DIT_DATES.offerLive())
          ? " — along with 10% off." : ".") + "</p>" +
        "<p class=\"custom-gate-fine\">In a hurry, or asking about a date before then? " +
        "<a href=\"index.html#contact\">Send me a note</a> and we'll work it out.</p>";
      fields.disabled = true;
    }
  }

  /* ----- request form → Web3Forms (same relay as the contact form) ----- */
  var form = document.getElementById("customForm");
  if (!form) return;
  var statusEl = document.getElementById("customStatus");
  function setStatus(msg, kind) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = "form-status" + (kind ? " " + kind : "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!isOpen) {
      setStatus("Custom orders open " + opensLabel + " — join the Nest and you'll hear first.", "err");
      return;
    }
    var data = new FormData(form);
    var key = data.get("access_key");
    if (!key || String(key).indexOf("WEB3FORMS_ACCESS_KEY") === 0) {
      setStatus("The form isn't quite set up yet — please email dragoninkandthread@gmail.com directly for now.", "err");
      return;
    }
    var btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;
    setStatus("Sending…", null);
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data
    })
      .then(function (r) { return r.json(); })
      .then(function (json) {
        if (json.success) {
          form.reset();
          setStatus("Thank you! Your request is with me — I'll write back with a price and a timeline within a couple of days. 🧵", "ok");
        } else {
          setStatus((json && json.message) ||
            "Something went wrong — please email dragoninkandthread@gmail.com directly.", "err");
        }
      })
      .catch(function () {
        setStatus("Something went wrong — please email dragoninkandthread@gmail.com directly.", "err");
      })
      .finally(function () { if (btn) btn.disabled = false; });
  });
})();
