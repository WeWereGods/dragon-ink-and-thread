# Nest welcome sequence

Three emails sent to new "Join the Nest" subscribers. Voice is the site's: cozy,
unhurried, book-lover warmth. First person — these come from Ayla, not from a brand.

**Status:** copy is current as of 2026-07-31. **These are sent by hand, not by an automation**
— see "Sending" at the bottom for why and how.

| Email | Sent | Notes |
|---|---|---|
| 1 — Welcome | ✅ **2026-08-02** | Whole list. Carries NEST15. |
| 2 — The story | ✅ **2026-08-05** | ~3 days after Email 1 |
| 3 — What I make | ☐ due ~**2026-08-09** | ~7 days after Email 1 |

---

## The rule these emails are written to

**Nothing in here may have an expiry date.** This is an evergreen automation: it fires
whenever someone subscribes, forever, and each email is frozen the second it sends. The
site can rewrite itself — `js/dates.js` swaps every dated phrase automatically — but an
email in someone's inbox cannot. So:

- **No dates.** Not "opens August 15", not "until the 17th". If timing matters, link to the
  page and let the page tell the truth.
- **The code is `NEST15`** — 15% off orders over $25, no expiry, verified live in Stripe.
  **Never `NEST10`**: it dies 2026-08-17 and a lapsed Stripe promotion code is permanently
  dead, so anyone subscribing afterwards would get a code that fails at checkout.
- **No naming individual pieces.** Almost everything is one of a kind. A welcome email that
  says "there's a Sunflower tote" will be wrong within weeks — the Sunflower is already
  gone. Describe the categories; link to the shop.

The previous version broke all three rules: it promised "10% off" and said "the shop opens
August 15" — which had already happened on July 1.

---

## Email 1 — Welcome (sends immediately on signup)

**Subject:** Welcome to the Nest 🪺
**Preheader:** Your discount code is inside.

Hi — I'm Ayla.

I'm so glad you're here. Dragon Ink and Thread is a small, handmade thing: totes, bows and
scrunchies, sewn in small batches in San Antonio, Texas. No warehouse, no machines running
overnight. Just me, good fabric, and more time than is strictly sensible.

Two things to know:

**Your code is NEST15** — 15% off any order over $25. It doesn't expire, so use it whenever
something catches your eye. Just enter it at checkout.

**I won't crowd your inbox.** I'll only write when something lovely is ready. That's the
whole promise.

The shop is open right now, and one thing worth knowing before you browse: most pieces are
**one of a kind**. Not "limited edition" — there is one, I sewed it, and when someone takes
it home the listing goes dark for good.

→ [See what's in the shop](https://www.dragoninkandthread.com/shop.html)

Over the next week I'll tell you how this started (it's not the story you'd guess) and show
you around what I make.

Welcome to the Nest. There's always room for one more adventurer.

— Ayla
Dragon Ink and Thread · Handmade in San Antonio, Texas

---

## Email 2 — The story (sends ~3 days after Email 1)

**Subject:** How the Nest really began
**Preheader:** Mine started somewhere I didn't expect.

Hi again,

I promised you the story — so here's the honest version.

Dragon Ink and Thread didn't begin with a business plan. It began after I became a mom, in
the middle of postpartum depression — a season much harder than I expected. I went looking
for something that still felt like *me*: a quiet corner of the day that was mine, where I
could work with my hands and make one beautiful thing from start to finish.

So I started sewing. It was slow, and imperfect, and the most grounding thing I'd done in a
long while. The hobby became a passion. The passion became this.

Books were the other thing that carried me, the way they always have. From the first time I
opened *Twilight* to getting lost in *Throne of Glass*, stories reminded me that ordinary
days can still hold adventure, comfort, and a little magic. That's the feeling I try to sew
into everything — the warmth of a chapter you're not quite ready to close.

It's why nothing here is mass-produced. Everything is made by hand in small batches, and when
a fabric sells out, that print retires and becomes part of the shop's history — making room
for the next chapter. There's a whole page of pieces that have already found homes.

→ [Read the rest of the story](https://www.dragoninkandthread.com/#about)
→ [See the pieces that found homes](https://www.dragoninkandthread.com/#stories)

You don't have to leave wonder behind just because you grew up.

More soon — next I'll show you around what I actually make.

— Ayla

---

## Email 3 — What I make (sends ~7 days after Email 1)

**Subject:** A proper look inside the Nest
**Preheader:** Totes, scrunchies, bows, pet bandanas — and the thing I'll make just for you.

Hi,

Here's what I've been sewing.

**Totes** — roomy enough for a hardback and everything else you're carrying. Cottage florals,
woodland mushrooms, wild strawberries, lily-of-the-valley and butterflies. Some are big
slouchy everyday bags, some are little mini totes for just the essentials. Every one is
fully finished inside, because I can't help myself.

**Scrunchies** — soft prints, gentle on your hair, sturdier than they look. $6 each, or
build your own bundle of any three for $15. (I can never pick three either.)

**Bows** — hand-tied sailor bows, $12. Small things that make an ordinary day feel considered.

**Pet bandanas** — because the one who waits by the door deserves a storybook print too. The
Storykeeper Bandana is $18, in the same antique-books-and-potion-bottles fabric as the tote of
the same name, so you can match. It slips over the collar they already wear — nothing to tie,
nothing to lose. This one's a Large (fits an 18″–23″ neck); small and medium I'll make for you,
just ask.

Everything is handmade in small batches, and most pieces are **one of a kind** — when one
sells, that's genuinely it. If you see something you love, don't sit on it too long.

→ [Browse everything](https://www.dragoninkandthread.com/shop.html)

**And if what you want doesn't exist yet — ask me.** Custom orders are your print, your size,
made for you: a tote sized to the exact book you carry, bows in a friend's wedding colours, a
retired piece remade in a new fabric. I'll quote you before anything begins, and you're free
to walk away.

→ [How custom orders work](https://www.dragoninkandthread.com/custom.html)

A few practical things: shipping is one flat fee per order (free over $50), and if you're
local to San Antonio you can choose **Local pickup** at checkout and skip it entirely.

Thanks for being here. It means more than you'd think.

— Ayla

Instagram & TikTok: @dragonink_and_thread

---

## Sending

**Platform: Buttondown** (chosen 2026-07-10). Both signup forms — `#nestForm` in the hero and
`#nestFormCheckout` — POST to
`buttondown.com/api/emails/embed-subscribe/dragoninkandthread`, so subscribers land there
automatically. A hidden `tag` field marks the source (`hero` vs `checkout`).

**Back-fill: DONE (2026-07-31).** Subscribers who joined before the Buttondown switch on
2026-07-10 existed only as Web3Forms notifications in Gmail (the free tier drops submissions
after 30 days). They have been imported.

**⚠️ Automations are NOT available on this account (confirmed 2026-08-02).** On Buttondown's
free tier these are three separate paywalls, none of them included:

| Feature | Cost | What it would have given us |
|---|---|---|
| Automations | **+$29/mo** | The drip: fires on signup, sends 1 / +3d / +7d |
| Custom welcome email | paid add-on | A single email on confirmed subscribe |
| Tagging & segmentation | **+$9/mo** | Sending to only *some* subscribers (see below) |

Free accounts get Buttondown's stock confirmation email and nothing else. **Do not plan work
around an automation existing** — and don't re-derive this from the pricing page each time.

**So: send them by hand as ordinary broadcasts.** This costs nothing and, right now, is
indistinguishable from the automation, because no subscriber had ever received any of these
three. Email 1 goes to the whole list, then Email 2 about 3 days later, then Email 3 about a
week after Email 1 — the same spacing the automation would have used. That clears the entire
backlog and delivers NEST15 to everyone on the list.

**Email 1 was sent to the whole list on 2026-08-02**, so NEST15 is now in every existing
subscriber's inbox. Emails 2 and 3 are still to send — see the table at the top for dates.

The gap this leaves is people who subscribe *after* a given broadcast: they pick up the
sequence wherever it happens to be. Pre-launch that's a handful of people, and the Aug 15
launch email reaches them regardless. **Revisit after launch**, when signups arrive
continuously instead of in a lump — that's when $29/mo (or a platform with automations on its
free tier) actually buys something. Migrating before launch would mean re-pointing both signup
forms, re-importing the list and re-verifying sending, for no benefit on launch day.

**Blocked, not forgotten:** the `checkout` tag identifies people who reached the basket and
didn't finish, and that segment deserves its own one-off send (copy is in the marketing plan).
Sending to a subset **requires the +$9 segmentation add-on**, so it can't happen on the free
tier. The tags are still being recorded on every signup, so nothing is being lost in the
meantime — the send just has to wait until segmentation is worth paying for.
