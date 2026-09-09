# The confirmation email — Buttondown's double opt-in

**Written 2026-09-09.** This replaces Buttondown's default template, which is the one that
**~36 of ~40 signups did not click** after the Sep 8 Facebook reply. Measured that day:
**48 records, 12 active** — roughly a 10% activation rate.

## ⚠️ Read this before editing the copy

**This email is only ever seen by people who have NOT confirmed.** Its single job is the click.
Everything in it that isn't earning the click is costing the click.

**Two audiences receive it and the copy has to work for both:**
- **Free-pattern signups** (the big group — `pattern`, `pattern-neckerchief`). ⚠️ **They already
  have the PDF.** It downloads on the page the instant they submit. If this email implies the
  pattern is coming, they will wait for it, not get it, and think the shop is broken.
- **Hero-form signups** (`hero`), who never saw a pattern at all. So it cannot *assume* a pattern
  either. Hence the "If you came for one of the free patterns" phrasing — true for both.

⚠️ **NEVER say the pattern arrives by email.** Buttondown automations are a **paid** feature and
this account is free-tier; the on-page reveal IS the delivery. Same rule as the pattern gate in
`tools/build-patterns.js`.

⚠️ **Why the default template failed, so we don't rebuild it.** It opens *"Thanks for subscribing
to {{ newsletter.name }}. To complete your subscription, please click the link below"* — which
is about the newsletter's process, not about the reader. Someone who came for a dog bandana
pattern, already has the PDF, and has never heard of you has **no reason** to complete anything.
This version gives them one, and makes ignoring it explicitly fine — which is more honest and,
counter-intuitively, converts better than pressure.

## Template variables available
`{{ confirmation_url }}` · `{{ newsletter.name }}` · `{{ newsletter.description }}`

The version below uses only `{{ confirmation_url }}`. The others are the shop's own name and
description, and writing them out reads warmer than a merge field.

---

## Subject line

> **One tap and you're in the Nest 🌿**

Alternatives, if that feels twee: *"Just one more tap"* · *"Shall I write to you?"*

⚠️ **Don't use "Confirm your subscription".** It is the phrasing every ignored confirmation email
in the world uses, and it describes a chore.

---

## Body

> Hello —
>
> **If you came for one of the free patterns, you've already got it** — it downloads straight on
> the page, so nothing is on its way and nothing has gone missing.
>
> This is just the bit where you say yes to me writing to you now and then. One tap:
>
> **{{ confirmation_url }}**
>
> And if you'd rather not — genuinely, that's fine. Ignore this and nothing happens. **You keep
> the pattern either way**; it was a gift, not a trade.
>
> Still here? Lovely. I'm Ayla. I sew handmade things at my kitchen table in San Antonio —
> totes, hair bows, scrunchies, dog bandanas, padded book sleeves — mostly in cottagecore and
> bookish prints, and mostly one of a kind.
>
> What you'd be signing up for: a note when there's a **new free pattern**, a look at whatever
> is on the machine, and occasionally a mistake I made so you don't have to make it too. Not
> often, and never just to fill a Tuesday.
>
> Ayla 🧵
> **Dragon Ink and Thread** — handmade in San Antonio
> ★ Proudly Veteran-Owned

---

## Notes for whoever edits this next

- **"You keep the pattern either way; it was a gift, not a trade"** is the line doing the most
  work. The reader's fear is that the free thing has strings on it. Removing the string is what
  makes clicking feel voluntary rather than extracted.
- **Keep the confirmation link high.** Anyone who scrolls past it has already decided.
- 📌 **If double opt-in is ever switched OFF, this email stops being sent** — and the
  "If a confirmation email lands" line on the pattern pages
  (`tools/build-patterns.js`) should be deleted at the same time, or the site is describing an
  email nobody receives.
- 📊 **Measure it.** Re-run `node tools/buttondown-report.js` a week after this goes live and
  compare active-vs-records against the **12 of 48** baseline of 2026-09-09. That ratio is the
  only thing this rewrite is trying to move.
