# Order emails — sent by hand, one customer at a time

These are **not** newsletter sends. They go from Gmail (dragoninkandthread@gmail.com) to
one person about the order they actually placed. Voice is the site's: first person, warm,
unhurried — these come from Ayla, not from a brand.

Everything you need to fill them in is on the payment's page in the Stripe Dashboard:
what they bought, their email, their shipping address, and whether they chose shipping or
local pickup.

---

## ⚠️ The one rule

**Writing to a customer about their order is always fine. Adding them to the Nest list is
not** — not unless they subscribed themselves. Buttondown, like every email platform,
requires consent for addresses you import, and the site's own privacy policy says marketing
goes out in line with the reader's stated preferences. Someone who bought a tote hasn't
stated one.

So: **invite, don't enrol.** Every template below ends with a link they can choose to
follow. Check Buttondown before you write — the thank-you page already offers them the
signup (tagged `purchased`), so they may have joined on their own, in which case drop the
last line.

---

## Email 1 — Your order is on its way (shipping)

**Subject:** Your [ITEM] is on its way 🧵
**Send:** the day it goes in the post.

Hi [NAME],

Your [ITEM] is finished and in the post — it should be with you in a few days.

I hope it's everything you were picturing. It was cut, stitched and finished by hand here in
San Antonio, and I gave it a last once-over before it went in the envelope.

A couple of practical things: it's cotton, so spot clean rather than machine wash, and the
strap will soften with use in the best way.

If anything isn't right when it arrives, please just reply to this email and tell me. I'd
much rather hear about it and put it right.

[IF YOU'D LIKE — one line, only when it's true:]
And if you'd ever like to hear when new prints land, you can join the Nest here:
https://www.dragoninkandthread.com/#home

Thank you for supporting something small. It genuinely matters.

— Ayla
Dragon Ink and Thread · Handmade in San Antonio, Texas

---

## Email 2 — Ready for local pickup

**Subject:** Your [ITEM] is ready whenever you are
**Send:** as soon as it's finished, if they chose Local pickup at checkout.

Hi [NAME],

Your [ITEM] is finished and ready for you.

You chose local pickup, so just let me know a day and time that suits you and we'll sort out
where to meet. I'm fairly flexible — mornings and evenings are usually easiest.

It'll be wrapped and waiting.

[IF YOU'D LIKE — one line, only when it's true:]
And if you'd ever like to hear when new prints land, you can join the Nest here:
https://www.dragoninkandthread.com/#home

— Ayla
Dragon Ink and Thread · Handmade in San Antonio, Texas

---

## Email 3 — Checking in afterwards (the one that earns reviews)

**Subject:** How's your [ITEM] settling in?
**Send:** about a week after it arrives. This is optional, and it is the single most
effective thing here — the shop has very few reviews, and reviews are what convince a
stranger to buy handmade from someone they've never met.

Hi [NAME],

Just a quick note to see how your [ITEM] is getting on. Is it holding up the way you hoped?

If you've a moment and you're happy with it, I'd love a line about what you thought — and
a photo of it out in the world is even better. With your blessing I'd put it on the site;
a shop this size lives or dies on what real people say about it.

And if something isn't right, tell me that instead. I'd genuinely rather know.

Either way, thank you for taking a chance on a small handmade shop.

— Ayla
Dragon Ink and Thread · Handmade in San Antonio, Texas

**When a kind reply comes back:** add it BY HAND to the `TESTIMONIALS` array in js/main.js
(`{ quote, name, where?, stars? }`). Real reviews only — **never invent one**. If it's a
review of a tote, scrunchie or bow, also update the matching `aggregateRating` /
`reviewCount` in the JSON-LD in index.html, which must mirror what the Kind Words section
actually shows on the page.

---

## Receipts

Stripe does **not** email a receipt unless **Settings → Business → Customer emails →
Successful payments** is switched ON, and the checkout Worker sets no `receipt_email`. If a
customer says they never got one, send it by hand: Dashboard → **Payments** → click the
payment → **Send receipt**.
