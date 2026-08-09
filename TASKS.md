# Tasks — Dragon Ink and Thread

Working list. Tick things off, delete them when they're stale, add as you go.
**Last reviewed: 2026-08-08.**

Two rules that keep this useful:
- **Dates are absolute** ("Aug 9"), never "next Sunday" — this file outlives the week it was written in.
- **If it's owed to a customer, it goes at the top.** Everything else can slip.

---

## 🔴 Owed — money already taken

- [ ] **Maurya Buchanan — Wheelchair Quilted Tote + Custom Tote**, both in *Nesta's Cats*.
      $97.43 paid 2026-08-05 (invoice `VBQJFYMO-0001`, $100 less $10 for the pair, plus tax).
      Terms are 10–14 days from acceptance → **due ~Aug 15–19**. She's local (San Antonio).
      ⚠️ Away Aug 14–16, so the real window is **Aug 17–19**.
      - **2026-08-08: the first tote is FINISHED**, photo sent, waiting on her approval before
        the wheelchair tote is started. That's the process working as written — nothing moves
        until she's seen it.
      - ⚠️ **Don't let the wait be silent.** If there's no reply by **Mon Aug 11**, nudge once.
        Two pieces in one order and only one of them started is the half that can still slip,
        and she is local, so a pickup date is easy to agree once she's happy.
      - 📸 **Photograph it properly before it leaves.** The Aug 29 broadcast is written to lead
        with a real finished custom piece (§8 of `marketing/campaign-2026-08.md`), and right now
        this is the only one that exists.
- [ ] ⚠️ **Aubrea Pritt — 3 custom bow clips. BLOCKED ON FABRIC.** $36 paid 2026-08-05
      (invoice `85VBHJQE-0001`). Oakdale, **California** — these post, they aren't collected.
      She's also the five-star review already on the homepage, so this order is worth getting right.
      - **2026-08-08: the fabric still hasn't arrived.** Bow clips are quick once it's here, so
        the make time isn't the problem — the delivery is, and it is the one part of this you
        don't control.
      - **The squeeze:** due ~Aug 15–19, and Aug 14–16 is a trip. If the fabric lands by
        **Wed Aug 12** there's time to sew before leaving. If it lands after, the work happens
        Aug 17–19 — still inside the window, but with no slack at all, and against Maurya's
        two totes in the same days.
      - **Do this today: check the tracking.** If it hasn't shipped, tell Aubrea now.
        `emails/custom-orders-enquiry.md` promises "if I can't hit a date you need, I'll tell you
        before you commit, not after" — the same honesty applies after. A message on the 8th
        saying a supplier is slow reads as care; the same message on the 19th reads as an excuse.
      - There is no template for this in `emails/order-updates.md`; those cover shipped, pickup
        and the follow-up. Write it plainly, one short paragraph.

---

## 🟠 Dated — this week

- [ ] ⚠️ **CUSTOM ORDERS OPENED 2026-08-08** — the form is live and enquiries can arrive today.
      **Aug 17–20 was already full**: Maurya's two quilted totes and Aubrea's three bow clips are
      due that week, straight off the Aug 14–16 trip. Quote new enquiries a timeline that admits
      that, rather than promising 10–14 days on top of work already owed.
      The launch **push is still Sat Aug 29** — opening quietly now just means anyone who comes
      looking can ask.

- [ ] **Welcome Email 3 — due ~Sun Aug 9.** The last of the three, sent by hand as a Buttondown
      broadcast (automations are paywalled; see `emails/welcome-sequence.md`).
      ⚠️ **Read it against the live shop before sending** — it describes what's in stock, and the
      shop changed a lot on Aug 5 (five bows added, bows now $12, Pet Bandanas opened, four sold
      pieces retired to Stories).
- [ ] **Delete the stale scheduled posts 6 and 7** from the scheduler. Their replacements
      counted down to Aug 17 and custom orders opened on the 8th, so the countdown framing is
      dead too — don't paste those either. Use the evergreen fabric-library post or the
      Reading Nook Sleeve post from §13 of `marketing/campaign-2026-08.md` instead.

---

## 🟡 Ready to go — just needs sending

- [ ] **Two new pet bandanas post** — Facebook copy in §13 of `marketing/campaign-2026-08.md`,
      written 2026-08-08. Both are live in the shop at $18. Needs the scale shot (both flat
      together, hand in frame) — "Medium" means nothing until it's next to something.
- [ ] **Reading Nook Sleeve post** — Facebook + Instagram in §13. It went live Aug 7 and has
      **never been announced**. Leads on Rebekah's five-star review for the Road Trip Kindle
      Case, which until now pointed at something nobody could buy.
      ⚠️ Needs one new photo: a book half out of the sleeve. Empty, it photographs as a flat
      brown rectangle.
- [x] **Fabric teaser — POSTED 2026-08-08** (eighteen new prints, seventy-one in the library).

- [ ] **Pet bandana post — Instagram + Facebook.** Images and captions both done 2026-08-06.
      Carousel order: shepherd → second shot → flat lay. Ghost is named in the caption.
- [ ] **Five bows post** — the Aug 5 bows (Cauldron Forged, Toffee Plaid, Roasted Roses, Daily
      Grind in Ivory, Blushing Linen). Assets and captions done. Run it a couple of days after
      the bandana, not the same day. **Not to be confused with the Tea with the Suriel five**,
      which is the Mon Aug 11 post in `marketing/fabric-collections-2026-08.md`.
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

- [x] **The library is at 71 prints across 7 groups** (53 → 65 → 71, imported 2026-08-06/07 with
      `node tools/import-fabrics.js`, live 2026-08-07). Each collection is its own group so the
      filter buttons match how the fabric is bought: **Once Upon a Woodland** 3, **Tea with the
      Suriel** 6, **Postcards and Pumpkins** 4. Six later arrivals were filed into the existing
      groups. ⚠️ "71" is hand-typed in `emails/custom-orders-enquiry.md` (twice) and `CLAUDE.md`
      — everything on fabrics.html generates itself.
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

**Re-measure on 2026-09-08** — a reminder is scheduled (trigger `trig_01LsZGATD8bKPacFutiekxnj`,
fires 9am Central, push + email) and carries the baseline with it. ⚠️ It was created from a
CLI session, so it holds **no Stripe connector** — the session it opens may have to ask for the
numbers by hand. Re-creating it from the claude.ai routines UI would attach Stripe properly.
Method: list Checkout sessions, drop the build-day test clusters, and ask two questions:
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
