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

  /* OPENED EARLY 2026-08-08, by the owner, from Mon Aug 17.

     History: Sat Aug 15 originally, moved to Mon Aug 17 on 2026-08-06 around a
     trip on Aug 14–16, then opened on the 8th instead — there was no longer a
     reason to make anyone wait, and an enquiry arriving now can be quoted and
     agreed BEFORE the trip rather than after it.

     The launch PUSH is a separate thing and still runs Sat Aug 29 (§10 of
     marketing/campaign-2026-08.md). Opening quietly ahead of it is the same
     logic as before: the doors are open for whoever comes looking, and the
     announcement waits for the day she is home to answer it.

     ⚠️ This date is now in the PAST, so the static no-JS wording in the HTML
     was INVERTED to match: .js-post-open is the unhidden default and
     .js-pre-open carries `hidden`. If the date is ever moved forward again,
     invert them back, or anyone with JS off reads the wrong thing. */
  var CUSTOM_OPENS = "2026-08-08T06:00:00-05:00";
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

  /* AWAY WINDOWS — dates the owner is travelling and cannot post orders or
     hand over local pickups. Added 2026-08-06.

     THE POINT OF DOING IT HERE: the first version of this was a hand-written
     paragraph on custom.html with a comment saying "delete this on Aug 25".
     That is a landmine — it only stays true if someone remembers. These
     windows switch themselves on and off, so an away notice cannot outlive
     the trip that caused it.

     `back` is written out rather than derived, because the useful phrasing is
     the day she is next AT THE MACHINE, which is not always the day she lands.

     ⚠️ worker/checkout-worker.js keeps its OWN copy of these windows, to
     relabel the local-pickup option at checkout. Change both together, then
     `wrangler deploy` — the Worker is what a customer actually sees when
     choosing pickup. */
  var AWAY = [
    { from: "2026-08-14T00:00:00-05:00", to: "2026-08-16T23:59:59-05:00", back: "Monday, August 17" },
    /* CONFIRMED 2026-08-16: Fri Aug 21 → Mon Aug 24, back at the machine Tue Aug 25.
       This replaces the Thu 21–Sun 24 shape that was floated and dropped; the real
       trip runs Friday to Monday, so Monday the 24th is NOT a working day. */
    { from: "2026-08-21T00:00:00-05:00", to: "2026-08-24T23:59:59-05:00", back: "Tuesday, August 25" }
    /* The earlier UNCONFIRMED version of this trip was deliberately kept off the site until it firmed up,
       which is why nothing had to be retracted when the dates moved. An away banner
       is a promise about when a parcel moves — only ever announce travel that is
       actually happening.
       TO ADD A TRIP: one more { from, to, back } object above, the same window in
       worker/checkout-worker.js, then `wrangler deploy`. Both switch themselves on
       and off. ⚠️ custom.html's `.js-away-notice` names the dates IN PROSE and does
       NOT auto-update — edit it by hand whenever a window changes. */
  ];
  var awayWindows = AWAY.map(function (w) {
    return { from: new Date(w.from).getTime(), to: new Date(w.to).getTime(), back: w.back };
  });

  function isOpen() { return Date.now() >= ts; }
  function offerLive() { return Date.now() <= offerTs; }

  /* The window we are inside right now, or null. */
  function awayNow() {
    var n = Date.now();
    for (var i = 0; i < awayWindows.length; i++) {
      if (n >= awayWindows[i].from && n <= awayWindows[i].to) return awayWindows[i];
    }
    return null;
  }
  /* True while ANY window is still to come or running — this drives the
     advance notice on custom.html, so people asking for custom work know
     before they ask. Goes false by itself once the last trip ends. */
  function awayPending() {
    var n = Date.now();
    return awayWindows.some(function (w) { return n <= w.to; });
  }

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

    // Away windows. .js-away shows ONLY while travelling; .js-away-notice is
    // the advance warning and shows until the last trip is over. Both are
    // written hidden in the HTML, so a no-JS visitor simply never sees them —
    // they add information, they never remove any.
    var now = awayNow();
    document.querySelectorAll(".js-away").forEach(function (el) { el.hidden = !now; });
    document.querySelectorAll(".js-away-notice").forEach(function (el) { el.hidden = !awayPending(); });
    if (now) {
      document.querySelectorAll("[data-away-back]").forEach(function (el) {
        el.textContent = now.back;
      });
    }

    // Every toggle above can change how tall the sticky header is, so the
    // measurement goes LAST and lives here rather than in a page script.
    syncHeaderHeight();
  }

  /* ---------------------------------------------------------
     Sticky-header height → --header-h
     In-page anchors (#join on the homepage, the shop's category jump
     buttons, the fabric group links) must land BELOW .site-header, which is
     position:sticky, top:0. Its height is NOT a constant — ~105px on desktop,
     ~139px at 375px where the countdown bar wraps — and it changes again on
     its own every time apply() above swaps a pre-open/post-open or
     offer-on/offer-off pair. A hard-coded scroll-margin-top is therefore
     wrong at some widths the day it is written and silently wrong again
     whenever that copy flips. The CSS falls back to 105px without JS.

     ⚠️ THIS LIVES IN dates.js ON PURPOSE. It is the only script all four
     pages with a sticky header load (index, shop, fabrics, custom) — main.js
     is homepage-only — and it is the file that causes the height to change.
     Putting a copy in main.js, shop.js and fabrics.js would make three that
     have to stay identical, which is the catSlug()/mdBold() hazard again.
     --------------------------------------------------------- */
  var headerEl = null;
  function syncHeaderHeight() {
    if (!headerEl) headerEl = document.querySelector(".site-header");
    if (!headerEl) return;
    document.documentElement.style.setProperty(
      "--header-h", headerEl.getBoundingClientRect().height + "px"
    );
  }

  function watchHeader() {
    if (!headerEl) headerEl = document.querySelector(".site-header");
    if (!headerEl) return;
    // Webfonts swapping in and late images both resize the bar after apply().
    window.addEventListener("load", syncHeaderHeight);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncHeaderHeight);
    // ResizeObserver also catches the bar re-wrapping from a TEXT change,
    // which a resize listener alone would miss.
    if (window.ResizeObserver) new ResizeObserver(syncHeaderHeight).observe(headerEl);
    else window.addEventListener("resize", syncHeaderHeight);
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
    AWAY: AWAY,
    awayNow: awayNow,
    awayPending: awayPending,
    apply: apply
  };

  function start() { apply(); watchHeader(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
