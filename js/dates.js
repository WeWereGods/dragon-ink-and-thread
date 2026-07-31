/* Dragon Ink and Thread — THE one place the custom-orders launch date lives.
   ---------------------------------------------------------------------------
   Before this file existed the date was hard-coded in three scripts and the
   wording ("Custom orders open Saturday, August 15") was typed into twelve
   places across three pages. On August 16 every one of those would have gone
   on advertising a launch that had already happened.

   HOW THE COPY FLIPS ITSELF
   Wrap the two wordings in the page and let this file choose:

     <span class="js-pre-open">Custom orders open Saturday, August 15</span>
     <span class="js-post-open" hidden>Custom orders are open</span>

   Before the date: .js-pre-open shows, .js-post-open is hidden.
   After it: the reverse — no edit, no deploy, nothing to remember.
   The PRE wording is the one written in the HTML unhidden, so if JS never
   runs the page still reads correctly today.

   TO MOVE THE DATE: change CUSTOM_OPENS here and nowhere else. js/main.js
   (countdown) and js/custom.js (request-form gate) both read it from here.
   Load this file BEFORE those scripts.

   NOTE: <meta> descriptions deliberately carry NO date. Search engines and
   social scrapers read the static HTML and never run this, so a date in a
   meta tag can only ever go stale. Timing belongs in the body copy. */
(function () {
  "use strict";

  var CUSTOM_OPENS = "2026-08-15T09:00:00-05:00";
  var ts = new Date(CUSTOM_OPENS).getTime();

  function isOpen() { return Date.now() >= ts; }

  /* Derived, never typed, so the words can't disagree with the date above.
       label()        -> "Saturday, August 15"  (banners, where it's the headline)
       label("short") -> "August 15"            (mid-sentence, where the weekday
                                                 would just be noise) */
  function label(form) {
    var opts = form === "short"
      ? { month: "long", day: "numeric" }
      : { weekday: "long", month: "long", day: "numeric" };
    return new Date(ts).toLocaleDateString("en-US", opts);
  }

  function apply() {
    var open = isOpen();
    document.querySelectorAll(".js-pre-open").forEach(function (el) { el.hidden = open; });
    document.querySelectorAll(".js-post-open").forEach(function (el) { el.hidden = !open; });
    // Any element marked data-open-date gets the date spelled out for it.
    // data-open-date="short" drops the weekday for mid-sentence use.
    document.querySelectorAll("[data-open-date]").forEach(function (el) {
      el.textContent = label(el.getAttribute("data-open-date"));
    });
  }

  window.DIT_DATES = {
    CUSTOM_OPENS: CUSTOM_OPENS,
    ts: ts,
    isOpen: isOpen,
    label: label,
    apply: apply
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
  else apply();
})();
