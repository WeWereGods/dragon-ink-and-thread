# Nest welcome sequence

Three emails sent to new "Join the Nest" subscribers. Voice is the site's: cozy,
unhurried, book-lover warmth. First person — these come from Ayla, not from a brand.

**Status:** copy is current as of 2026-07-31 and ready to load. Not yet set up as an
automation in Buttondown (that's a dashboard job, not a repo job).

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
**Preheader:** Totes, scrunchies, bows — and the thing I'll make just for you.

Hi,

Here's what I've been sewing.

**Totes** — roomy enough for a hardback and everything else you're carrying. Cottage florals,
woodland mushrooms, wild strawberries, lily-of-the-valley and butterflies. Some are big
slouchy everyday bags, some are little mini totes for just the essentials. Every one is
fully finished inside, because I can't help myself.

**Scrunchies** — soft prints, gentle on your hair, sturdier than they look. $6 each, or
build your own bundle of any three for $15. (I can never pick three either.)

**Bows** — hand-tied sailor bows, $10. Small things that make an ordinary day feel considered.

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

**Still to do:** set these three up as an automation in the Buttondown dashboard. Until that
exists, new subscribers get silence.

**Worth doing separately:** the `checkout` tag identifies people who reached the basket and
didn't finish. That segment deserves its own one-off send rather than this sequence — see
the marketing plan for suggested copy.
