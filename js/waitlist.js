/* Dragon Ink and Thread — sold-out waitlist.
   ----------------------------------------------------------------
   A sold-out listing is a DEAD END, and in a one-of-a-kind shop every
   listing eventually becomes one. The visitor looking at a sold piece is
   the most motivated traffic the shop gets, so instead of stopping at a
   disabled button we offer to write when something similar is made.

   USED BY: shop.html (catalog cards, via buyMarkup() in js/shop.js) and
   every generated product page (via tools/build-products.js). Anything
   carrying `data-waitlist="<id>" data-waitlist-name="<name>"` opens it.

   The modal markup is INJECTED here rather than pasted into each page —
   it started life hand-written in shop.html, and copying it into 20
   generated product pages would have been the same duplication that the
   product generator exists to prevent.

   Subscribes to the same Buttondown list as the hero form, tagged
   `waitlist`. Buttondown's responses are HTML, not JSON, so we branch on
   status: ok = subscribed, 400 = bad or duplicate address.

   NOTE: a per-item tag (waitlist-tote-sunflower) was deliberately NOT used.
   Acting on any tag needs Buttondown's +$9/mo segmentation add-on anyway,
   and an unfamiliar tag value is the one thing here that can't be tested
   against the live account — a rejected tag could cost a real signup. */
(function () {
  "use strict";

  var ENDPOINT = "https://buttondown.com/api/emails/embed-subscribe/dragoninkandthread";
  var HELP = "Something went wrong — please email dragoninkandthread@gmail.com to join.";
  var DEFAULT_NOTE = "One email when there's something lovely — never more than that.";

  var modal = null, form, note, itemEl, emailEl, lastFocus = null;

  function build() {
    if (modal) return modal;
    modal = document.createElement("div");
    modal.className = "waitlist-modal";
    modal.id = "waitlistModal";
    modal.hidden = true;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "waitlistTitle");
    modal.innerHTML =
      '<div class="waitlist-card">' +
        '<button type="button" class="waitlist-close" aria-label="Close">&times;</button>' +
        '<p class="eyebrow">Found a home</p>' +
        '<h2 id="waitlistTitle">Tell me when something like this appears</h2>' +
        '<p class="waitlist-item" id="waitlistItem"></p>' +
        '<p class="waitlist-blurb">Every piece is one of a kind, so this one is gone for good — but ' +
          "I'm always cutting new prints. Leave your email and I'll write when something in the " +
          'same spirit is on the table.</p>' +
        '<form class="nest-form" id="waitlistForm" action="' + ENDPOINT + '" method="POST" ' +
            'aria-label="Tell me when something similar appears">' +
          '<input type="hidden" name="tag" value="waitlist" />' +
          '<input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true" />' +
          '<label class="sr-only" for="waitlistEmail">Your email address</label>' +
          '<input type="email" id="waitlistEmail" name="email" placeholder="you@example.com" required autocomplete="email" />' +
          '<button type="submit" class="btn btn-primary">Keep me posted</button>' +
        "</form>" +
        '<p class="nest-note" id="waitlistNote">' + DEFAULT_NOTE + "</p>" +
      "</div>";
    document.body.appendChild(modal);

    form = modal.querySelector("#waitlistForm");
    note = modal.querySelector("#waitlistNote");
    itemEl = modal.querySelector("#waitlistItem");
    emailEl = modal.querySelector("#waitlistEmail");
    form.addEventListener("submit", submit);
    return modal;
  }

  function open(name) {
    build();
    lastFocus = document.activeElement;
    itemEl.textContent = name ? "You were looking at the " + name + "." : "";
    note.textContent = DEFAULT_NOTE;
    modal.hidden = false;
    document.body.classList.add("waitlist-open");
    emailEl.focus();
  }

  function close() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("waitlist-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function submit(e) {
    e.preventDefault();
    if (form.querySelector('[name="botcheck"]:checked')) return; // honeypot
    var em = form.querySelector('[name="email"]');
    var tg = form.querySelector('[name="tag"]');
    var data = new FormData();
    data.append("email", em ? em.value : "");
    if (tg && tg.value) data.append("tag", tg.value);

    var btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;
    note.textContent = "Adding you to the nest…";
    fetch(form.action, { method: "POST", body: data })
      .then(function (r) {
        if (r.ok) {
          form.reset();
          note.textContent = "Lovely — I'll write the moment something similar is on the table. 🌿";
        } else if (r.status === 400) {
          note.textContent = "That address didn't take — if you're already in the nest, you're all set.";
        } else {
          note.textContent = HELP;
        }
      })
      .catch(function () { note.textContent = HELP; })
      .finally(function () { if (btn) btn.disabled = false; });
  }

  document.addEventListener("click", function (e) {
    if (!e.target.closest) return;
    var trigger = e.target.closest("[data-waitlist]");
    if (trigger) {
      e.preventDefault();
      open(trigger.getAttribute("data-waitlist-name"));
      return;
    }
    if (!modal || modal.hidden) return;
    // The scrim itself (not the card) or the × dismisses.
    if (e.target === modal || e.target.closest(".waitlist-close")) close();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });
})();
