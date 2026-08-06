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

  /* MOVED 2026-08-06, from Sat Aug 15 to Mon Aug 17. The owner is away
     Aug 14–16 and again Aug 21–24, so the 15th would have opened custom
     orders into three days of silence, and the next two Saturdays are both
     inside a trip. The FORM opens here on the 17th; the promotional push
     (email, posts, live Q&A — §10 of marketing/campaign-2026-08.md) is a
     separate thing and now runs Sat Aug 29, the first Saturday she is home
     with no travel either side. Opening quietly means anyone who saw the old
     date and comes looking can still ask, instead of meeting a shut form. */
  var CUSTOM_OPENS = "2026-08-17T09:00:00-05:00";
  var ts = new Date(CUSTOM_OPENS).getTime();

  /* THE NEST DISCOUNT DEADLINE.
     NEST10 is a launch coupon: Stripe has it expiring 2026-08-17 23:59 Central,
     and a Stripe promotion code that passes its expiry is permanently dead —
     it cannot be extended or reactivated. So the site must stop promising 10%
     the moment it lapses, or every page is advertising a code that fails at
     checkout.

     Same mechanism as the launch date: mark the two wordings and this file
     picks. .js-offer-on shows while the code is live, .js-offer-off after.
     [data-offer-date] is filled with "August 17".

     THE REPLACEMENT: NEST15 — 15% off orders over $25, no expiry. CREATED AND
     VERIFIED LIVE IN STRIPE 2026-07-31 (coupon khWa1McM, expires_at null,
     redeem_by null, minimum_amount 2500). Its wording is already in the
     .js-offer-off spans, so it takes over by itself at 2026-08-18 00:00 with
     no deploy and no gap. Both codes are redeemable until then. */
  var OFFER_ENDS = "2026-08-17T23:59:59-05:00";
  var offerTs = new Date(OFFER_ENDS).getTime();

  function isOpen() { return Date.now() >= ts; }
  function offerLive() { return Date.now() <= offerTs; }

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

  function offerLabel(form) {
    var opts = form === "short"
      ? { month: "long", day: "numeric" }
      : { weekday: "long", month: "long", day: "numeric" };
    return new Date(offerTs).toLocaleDateString("en-US", opts);
  }

  function apply() {
    var open = isOpen();
    document.querySelectorAll(".js-pre-open").forEach(function (el) { el.hidden = open; });
    document.querySelectorAll(".js-post-open").forEach(function (el) { el.hidden = !open; });

    var live = offerLive();
    document.querySelectorAll(".js-offer-on").forEach(function (el) { el.hidden = !live; });
    document.querySelectorAll(".js-offer-off").forEach(function (el) { el.hidden = live; });
    document.querySelectorAll("[data-offer-date]").forEach(function (el) {
      el.textContent = offerLabel(el.getAttribute("data-offer-date"));
    });
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
    OFFER_ENDS: OFFER_ENDS,
    offerTs: offerTs,
    offerLive: offerLive,
    offerLabel: offerLabel,
    apply: apply
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
  else apply();
})();
