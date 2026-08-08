# Tasks — Dragon Ink and Thread

Working list. Tick things off, delete them when they're stale, add as you go.
**Last reviewed: 2026-08-06.**

Two rules that keep this useful:
- **Dates are absolute** ("Aug 9"), never "next Sunday" — this file outlives the week it was written in.
- **If it's owed to a customer, it goes at the top.** Everything else can slip.

---

## 🔴 Owed — money already taken

- [ ] **Maurya Buchanan — Wheelchair Quilted Tote + Custom Tote**, both in *Nesta's Cats*.
      $97.43 paid 2026-08-05 (invoice `VBQJFYMO-0001`, $100 less $10 for the pair, plus tax).
      Terms are 10–14 days from acceptance → **due ~Aug 15–19**. She's local (San Antonio).
      ⚠️ Away Aug 14–16, so the real window is **Aug 17–19**.
- [ ] **Aubrea Pritt — 3 custom bow clips.** $36 paid 2026-08-05 (invoice `85VBHJQE-0001`).
      Oakdale, **California** — these post, they aren't collected. Same week.
      She's also the five-star review already on the homepage, so this order is worth getting right.

---

## 🟠 Dated — this week

- [ ] **Welcome Email 3 — due ~Sun Aug 9.** The last of the three, sent by hand as a Buttondown
      broadcast (automations are paywalled; see `emails/welcome-sequence.md`).
      ⚠️ **Read it against the live shop before sending** — it describes what's in stock, and the
      shop changed a lot on Aug 5 (five bows added, bows now $12, Pet Bandanas opened, four sold
      pieces retired to Stories).
- [ ] **Posts 6 and 7 are STALE — Sat Aug 8 and Wed Aug 12 on the calendar.** Both were written
      in July as launch countdowns for the *ready-made shop* ("This time next Saturday, the Nest
      is open", "3 days"). The shop opened **July 1**. As written they'll confuse people who have
      already bought. **Rewrite them to count down to custom orders, or delete them.**

---

## 🟡 Ready to go — just needs sending

- [ ] **Pet bandana post — Instagram + Facebook.** Images and captions both done 2026-08-06.
      Carousel order: shepherd → second shot → flat lay. Ghost is named in the caption.
- [ ] **Five bows post** — assets and captions done. Run it a couple of days after the bandana,
      not the same day.
- [ ] **TikTok DM from "The Stationary Corner"** (2026-08-05) — unclear whether it was answered.

---

## 🔵 Waiting on something else

- [ ] ⚠️ **The Suriel bow set and the five singles are the SAME five bows.** Listed both ways
      since 2026-08-07, and nothing in the shop tracks stock — so the moment one side sells,
      the other side is still live and sellable to somebody else.
      **The set sells → pull all five singles. Any single sells → pull the set.**
      Pushover pings the phone on every sale, so you will know within seconds; the fix is to
      set `soldOut: true` in js/shop-data.js and push, or retire the listing outright.
      This resolves itself the day the set sells or the day you split it — until then it is a
      live race, and it is the only overselling risk in the shop.

- [ ] **GitHub Pages outage (2026-08-06).** Five commits queued — the Aug 17 launch date, the
      away banner, the second-trip removal. Nothing is broken live; the last good build is
      serving. **Must be published before Fri Aug 14** for the away banner to appear.
      If Pages recovers and it still hasn't gone out, push again.
- [x] **The four new fabric collections are in — 53 → 65 prints** (imported 2026-08-06 with
      `node tools/import-fabrics.js`). Each collection is its own group on fabrics.html, so the
      filter buttons match how the fabric is bought: **Once Upon a Woodland** 3, **Tea with the
      Suriel** 5, **Postcards and Pumpkins** 3. **Blush and Whiskers** is a single print, filed
      under Creatures & Curiosities.
- [ ] **Merge the fabric branch to `main`** — it's all on `claude/email-3-draft-7qis82` and
      the site deploys from `main`, so none of the 12 new prints are public yet.
- [ ] **Confirm Stripe auto-payouts took (from ~Aug 10).** Switched from manual on 2026-08-06.
      Proof: a payout appears around Aug 10 when the ~$144.57 clears, *without anyone requesting
      it*. If it just sits there, the setting didn't save.

---

## 🧪 Running experiment — free-shipping nudge (shipped 2026-08-08)

The nudge used to be a clause inside the drawer's grey shipping paragraph. It is now its own
honey panel with a progress bar and a "Keep looking →" button. Cost: one CSS block and one
function. No consent, no webhook, no privacy-policy change — which is why it went first,
ahead of abandoned-cart recovery.

**Baseline, measured from the Stripe API on 2026-08-08** (whole account history, 31 sessions):
- 4 real sales vs ~7 genuine abandonments → **~36% of people reaching the payment page paid**
- **3 of those abandonments sat just under $50**: $45.05, and $41.50 twice
- 0 of 26 unpaid sessions captured an email

**Re-measure around 2026-09-08**, the same way — list Checkout sessions, drop the build-day
test clusters, and ask two questions:
1. Are carts still expiring in the $40–50 band? That band is what this targets.
2. Has the average paid order moved? The nudge should push baskets up, not just convert them.

⚠️ **A month of a small shop is a handful of sessions, so this cannot reach statistical
significance.** Judge it on whether the $40–50 abandonments stop, and don't read anything into
a single sale either way. If the band is still abandoning, the nudge is not the problem and
recovery is worth reconsidering.

---

## ⚪ Decisions open

- [x] **Bows are on a slide-in clip** — answered 2026-08-07. There is no choice of elastic or
      O-ring, whatever the retired Sage Bow said. Now stated in `details` on all thirteen.
- [ ] **If the Aug 21–24 trip is cancelled, Sat Aug 22 reopens as a launch date** — it was the
      first choice before the travel ruled it out, and it's a week earlier than Aug 29.
- [x] **What to make next — DECIDED, and the first one is live.** The **Reading Nook Sleeve**
      ($28, `sleeve-reading-nook`) opened a fifth category, Book Sleeves, on 2026-08-07.
      Next in that direction: zip pouches, then more totes. The reasoning that picked it:
      hold a five-star review for the Road Trip Kindle Case that nobody can buy, it's the right
      audience, and it fills the empty $20–30 band that makes two-item baskets clear the $50
      free-shipping threshold. Then zip pouches, then more totes.
- [ ] **Change security-question answers to random strings** stored in the password manager,
      so a pet name being public stops mattering. Higher value: 2FA on Gmail, Stripe, Bluevine,
      GitHub.

---

## ⚫ Parked on purpose — don't start these unasked

- **Abandoned-cart recovery.** Researched and deferred 2026-08-06. Full notes in `CLAUDE.md`,
  including the two things that are easy to get wrong. Don't re-research it.
  **Measured 2026-08-08:** 31 Checkout sessions ever — 5 paid, 25 expired, 1 open, and **none of
  the 26 unpaid ones captured an email**. Most of the expired ones are build-day testing; about
  seven look real, which is ~36% of people reaching the payment page actually paying. So
  recovery would currently reach nobody, and would only start working for carts abandoned after
  the consent box is turned on. The cheaper experiment first: three of the abandons sat just
  under the $50 free-shipping line.
- **Selling patterns.** Digital goods owe EU VAT from the first sale, so it needs a merchant
  of record. Parked deliberately.

---

## Older, still true

- [ ] **Back-fill pre-2026-07-10 subscribers into Buttondown.** They exist only as Web3Forms
      notifications in Gmail, and the free tier drops submissions after 30 days — so this gets
      harder every week and eventually becomes impossible.
- [ ] **Founder photo** is still a casual phone selfie. Highest-trust element on the page.
- [ ] **Post-purchase packaging insert** — drafted, never made it into the repo.
- [ ] **Policies aren't attorney-reviewed.** Worth a pass now that real money is moving.
