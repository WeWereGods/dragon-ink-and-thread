# Dragon Ink and Thread — Social & Marketing Campaign
### Revised 2026-08-03 · Covers Aug 3 → Aug 30, 2026
*(Supersedes the 2026-07-30 version. §2, §4, §6, §11 and §14 are unchanged — the strategy
held. Everything tactical was rewritten, because the shop moved underneath it.)*

---

## 1. Where things actually stand (2026-08-03)

The shop has now sold real things to real people, which changes what this campaign is for.
It is no longer about proving the shop exists — it's about being seen by enough people.

| Then (Jul 30) | Now (Aug 3) |
|---|---|
| Sunflower Tote sold — first scarcity proof | **4 pieces sold**: Sunflower + Mushroom Totes, Sage + Blue Rose Bows |
| — | **3 orders, 3 customers.** Checkout, receipts and Pushover alerts all proven in production |
| 6 totes | **5 totes live** — incl. **The Storykeeper**, $32, the bookshelf/apothecary print |
| Bows: 4 | **Bows: 2** — the thinnest category by far |
| "Made to order, allow 5–10 days" | **"Sewn and ready to ship"** — everything is pre-made; 1–3 days to post |
| Welcome sequence to be loaded as an automation | **Automations are paywalled (+$29/mo).** Sent BY HAND; Email 1 went Aug 2 |
| Photo galleries (double-click a card) | That gallery was deleted. **Zoom lives on product pages**; sold-out cards carry a **waitlist** |

**The two facts that should shape every decision this month:**

1. **Traffic is the constraint, not the site.** Analytics show ~20 visits/day converting at a
   normal rate. Polishing the site will not move sales. Being seen will.
2. **Only 2 real reviews exist** (not 3, as the last version said). Social proof is the
   thinnest asset in the whole operation.

---

## 2. The strategic pivot

**Old hook:** *"Something lovely is coming. Wait for it."*
**New hook:** *"It's here, and there is exactly one of it."*

Everything about the shop now supports a scarcity-and-story angle instead of an
anticipation angle. That's a stronger position for a solo maker, because:

- **One-of-a-kind is literally true.** Qty caps at 1 in both the cart and the Worker.
  "When it's gone, it's gone" is not a marketing line here — it's the database.
- **Sold-out items are proof, not loss.** The Sunflower Tote going dim with a "Sold"
  badge is the single most persuasive thing on the catalog page. Post about it.
- **The Stories lookbook makes scarcity feel warm, not aggressive.** Retired pieces
  "found a home" — that's cottagecore-safe FOMO. Nobody feels manipulated.
- **Aug 15 becomes an upgrade, not a delay.** Framing: *"You've seen what I make.
  Starting Aug 15, you can ask me to make yours."*

**Positioning statement (use this to sanity-check every post):**
> Dragon Ink and Thread makes one-of-a-kind, small-batch sewn goods for readers and
> dreamers — sewn by hand in San Antonio by a veteran and a mom who found herself again
> at a sewing machine. Every print retires when it sells. Nothing here is made twice.

---

## 3. Goals & metrics (Jul 30 → Aug 30)

These are deliberately modest — this is a solo shop with no ad budget and no audience
baseline yet. Track them weekly in a note; don't build a dashboard.

| Goal | Target by Aug 30 | Where to check |
|---|---|---|
| Nest subscribers | **150** (crosses the Buttondown free tier — budget ~$9/mo) | Buttondown |
| Orders | **12** total (3 in already), of which ≥3 are multi-item | Stripe + Pushover pings |
| Average order value | **$38+** (see the attach-rate problem in §5) | Stripe |
| Custom order inquiries | **5** after Aug 15 | Web3Forms → Gmail |
| **Reviews** | **5 total** — i.e. **3 more** on top of the 2 that exist | Manual → `TESTIMONIALS` |
| Daily visits | **50/day** (from ~20) — the real bottleneck | Cloudflare Web Analytics |
| Instagram followers | **300** | IG |
| TikTok: one video over 10k views | **1** | TikTok |

**The one metric that matters most: reviews.** There are **2**, not 3 — the previous version
of this plan miscounted, and it mattered, because 3 is roughly the floor where social proof
starts doing work. One of the two is for a *retired custom make* (the Road Trip Kindle Case),
so only **one** review speaks for anything currently buyable. Every order this month should
end in an ask (§9). More reviews beat more followers, every time.

**The second metric that matters: visits.** Conversion is already normal — of the people who
land, a healthy share buy. So the ceiling on sales is simply how few people arrive. Treat
"did this bring anyone to the site" as the test for any piece of content.

---

## 4. Audiences

1. **BookTok / Bookstagram readers (primary, national).** Romantasy and cozy-fantasy
   readers — the *Throne of Glass* / *Fourth Wing* crowd. They buy book totes, they buy
   from small makers, and they're the audience the founder story is genuinely native to.
   This is the highest-leverage audience and the one most under-served right now.
2. **Cottagecore / slow-living (national).** Mushrooms, wildflowers, gingham, strawberries.
   Pinterest-heavy. Buys bows and scrunchies on impulse; buys totes on saving.
3. **San Antonio local (regional).** The **$0 local pickup** option is a real advantage —
   it removes the $6.50 shipping objection entirely. Underused. Also the natural audience
   for the veteran-owned angle and for eventual markets/craft fairs.
4. **Gift buyers (seasonal, ramps in Sept).** Not a focus this month, but start the
   groundwork — the "one of a kind" pitch is a gifting pitch.

---

## 5. The two commercial problems this campaign must solve

**Problem A — the $4 scrunchie couldn't carry $6.50 shipping. ✅ FIXED 2026-07-30.**
At $4 + $6.50, shipping was 62% of the order and nobody completes that checkout. The
root cause was that $4 is *under market* for a handmade scrunchie (typical range $6–12),
not that shipping was expensive — $6.50 is roughly what a padded mailer actually costs.

What changed in the code:

- **Scrunchies $4 → $6; both 3-packs $9 → $15.** At $6 each a trio is $18, so $15 stays
  a visible save. Updated in `js/shop-data.js`, the `PRICES` map in
  `worker/checkout-worker.js`, and the JSON-LD price range in `index.html`.
- **Shipping is now cart-aware** (`SHIP_*` constants at the top of the Worker):
  $6.50 with a tote, **$4.50** for small goods only, **free over $50**.
  Net effect — a single scrunchie still costs the buyer $10.50, but the split is
  $6/$4.50 instead of $4/$6.50, and the order stops looking silly.

What stays true in the messaging:

- Never promote a single scrunchie as a standalone product. Always promote **Build Your
  Own Bundle ($15, pick any 3)** or the **Bundle of 3 ($15)**.
- Push scrunchies and bows as the **attach** — "finish the set" — in tote posts and in
  email. The $50 free-shipping threshold now does this work at checkout too: a $38
  Butterfly Tote plus one scrunchie clears it.
- Lead local posts with **free pickup**. That's a scrunchie that actually converts.

**Problem B — there are only 2 reviews, and neither has ever been used.**
Kind Words holds **2 real reviews** (the previous version of this plan said 3 — it was
wrong). No UGC, no unboxings, and neither review has ever become a post. They're the most
persuasive words on the site and they sit in a section most visitors scroll past. Put each
one on Instagram as its own graphic, and make every order this month end in an ask (§9).
**Never invent testimonials** — real ones only, quoted verbatim.

One is for the **"Road Trip Kindle Case"** — a retired *custom* make in the Stories
lookbook. That's a gift for the Aug 15 beat: a real customer, in her own words, delighted
by a **custom** piece. Use that quote in the custom-orders launch post. It is the only
proof you have that the thing you're about to sell already works.

The other, from Brea P., is the one to lean on for the shop: she bought **a tote and a
matching scrunchie** in one order, entirely unprompted. That's the attach-rate behaviour
Problem A is trying to engineer, already happening naturally. Quote it when pushing sets.

---

## 6. Content pillars

Rotate these. Roughly the mix shown, ~5 posts/week — realistic for a solo maker, not a
content-farm calendar you'll abandon by week two.

| Pillar | Share | What it looks like | Why |
|---|---|---|---|
| **Process** | 30% | Cutting fabric, the machine running, pressing seams, hand-tying a bow. Sound on, no talking, no music trends needed. | Highest-performing content for handmade, by a wide margin. Cheap to shoot — film while you're already working. |
| **The piece** | 25% | Carousel of one item: hero shot, detail, lining, in-hand for scale, styled with a book. | Direct conversion. Use the gallery photos already in `VARIANTS`. |
| **Story / maker** | 20% | The postpartum origin, the veteran thread, why prints retire, the "missing piece of your wardrobe" line. | This is the moat. No one can copy it. |
| **Bookish** | 15% | Tote + current read, "what's in my book bag," shelf shots, TBR. | The BookTok on-ramp. Get discovered by readers, not by makers. |
| **Scarcity / drops** | 10% | "Sunflower found a home." "One left." Sold-out card screenshots. | Converts the audience you already have. Use sparingly or it curdles. |

**Voice rules.** First person, from Ayla — never "we." Unhurried. No exclamation stacking,
no "GIRL RUN," no fake urgency. Warmth and specificity do the work. Always
**"Dragon Ink and Thread"** — the word *and*, never `&`.

**Hashtags.** Two sets, rotate; keep it to 8–12, mixing broad and narrow.

- *Bookish:* `#booktok #bookstagram #booktote #bookishgifts #romantasy #tbr #readersofinstagram #bookishmerch`
- *Handmade/cottagecore:* `#cottagecore #handmadewithlove #smallbatch #sewingsmallbusiness #cottagecoreaesthetic #handmadetote #veteranowned #shopsmall #sanantoniosmallbusiness #madeintexas`

---

## 7. The calendar

Three beats: **The Storykeeper & the coffee drop** (Aug 3–9) → **Custom Orders Countdown**
(Aug 10–15) → **Sustain & set up September** (Aug 16–30).

*Week 0 (Jul 30 – Aug 2) is done and has been removed.*

### Week 1 — New pieces (Mon Aug 3 – Sun Aug 9)

The theme is **"it's here and it ships now."** Two new things to talk about: The Storykeeper,
and the coffee collection being sewn this week.

| Day | Channel | Post |
|---|---|---|
| Mon Aug 3 | IG carousel + TikTok | **The Storykeeper debut.** Shelves of antique books and potion bottles on black, lined, long strap, $32. The most on-brand piece in the shop for a BookTok audience — lead with it. Caption in §13. |
| Tue Aug 4 | IG carousel | **Founder story post.** The postpartum origin, in her own words, tighter than the site version. Photo of her at the machine if one exists — otherwise the About photo. |
| Wed Aug 5 | **Email** | **Welcome Email 2 — "How the Nest really began."** Sent BY HAND as a broadcast (§8). |
| Wed Aug 5 | TikTok | **"What's in my book bag"** — the Storykeeper, current read, a scrunchie on the wrist. Pure BookTok on-ramp. |
| Thu Aug 6 | IG Reel | **Process: hand-tying the coffee bows.** Sound on, no voiceover. Teases the drop without promising a date. |
| Fri Aug 7 | Site + IG Story | **List the restock** (coffee bows + totes — see the Aug 7 reminder). Then Story: **packing an order** — tissue, note, the whole ritual. Sets up the post-purchase ask. |
| Sat Aug 8 | IG post | **Local San Antonio post.** Lead with **free local pickup**. Veteran-owned. Tag SA small-business accounts. |
| Sun Aug 9 | **Email** | **Welcome Email 3 — "A proper look inside the Nest,"** carrying the coffee drop and teasing Aug 15. **This replaces the old "Broadcast #1"** (see §8). |

**⚠️ Aug 9 used to have two emails on it** — Welcome Email 3 *and* a "the shop's been open"
broadcast. Broadcast #1 has been deleted: Welcome Email 1 already said that on Aug 2, and
sending twice to a list this small is how people unsubscribe.

### Week 2 — Custom orders countdown (Mon Aug 10 – Sat Aug 15)

The Aug 15 beat. Frame it as *"now you can ask for yours."*

| Day | Channel | Post |
|---|---|---|
| Mon Aug 10 | IG + TikTok | **Announce it.** "In 5 days you can ask me to make something that doesn't exist yet." Explain what custom means: your print, your size, your person. Point at the **53-print fabric library** — it's the most persuasive custom-orders asset on the site and nothing currently drives traffic to it. |
| Mon Aug 10 | **Email (personal)** | **Follow up with all 3 customers** — how did it settle in, and would you send a line or a photo? This is the review engine (§9). Reminder is already scheduled. |
| Tue Aug 11 | IG Story | **Q&A sticker:** "What would you have me make?" Harvest the answers — they're both content and product research. |
| Wed Aug 12 | TikTok | **Process: a tote start to finish**, compressed. The most shareable format you have. |
| Thu Aug 13 | IG carousel | **Cottage Rose + Blue Rose Mini** together — both still in stock. Note the rename openly ("same tote, better name"). |
| Fri Aug 14 | IG Story ×3 + Email | **Eve-of. Broadcast to the Nest: "Tomorrow, custom orders open — you first."** (§8) |
| **Sat Aug 15** | **Everything** | **CUSTOM ORDERS OPEN.** See the launch-day runbook in §10 — times were revised to match real traffic. |

### Weeks 3–4 — Sustain (Sun Aug 16 – Sun Aug 30)

Drop to 3–4 posts/week. Post-launch is where solo shops burn out; protect the cadence.

- **Sun Aug 17** — Recap + first custom inquiries teaser ("here's what people asked for").
  ⚠️ **NEST10 expires this day.** After it, the standing offer is **NEST15** — 15% off orders
  over $25, no expiry. The site swaps its own wording automatically on Aug 18; your captions
  and bio do not. Check them.
- **Tue Aug 19** — Process video (the reliable workhorse).
- **Thu Aug 21** — **Scrunchie bundle push.** Build Your Own, $15, three prints. Attach-rate
  play — and quote Brea P., who did exactly this unprompted.
- **Sat Aug 23** — Stories/lookbook post: "pieces that found homes." Links the Stories section.
- **Tue Aug 26** — Whatever sold recently → "one left" or "gone" post.
- **Thu Aug 28** — **First UGC / review repost**, if one exists by then. If not, ask again.
- **Sat Aug 30** — Month recap + **tease the September drop**: mug rugs and the cozy-season
  coffee collection. Sets up the next month rather than ending flat.

---

## 8. Email — how it actually works now

**The rewrites this section used to ask for were done on 2026-07-31.** `emails/welcome-sequence.md`
is current, evergreen and ready. Two things changed since, and both matter more than the copy:

**⚠️ Buttondown automations are paywalled at +$29/mo, and she is on the free tier.** There is
no drip. All three welcome emails go out **by hand as ordinary broadcasts**, spaced 1 / +3d /
+7d. Tagging and segmentation is a further +$9/mo. Do not plan around an automation existing.

**⚠️ Never name `NEST10` in an email.** It **dies 2026-08-17**, and a lapsed Stripe promotion
code is permanently dead — anyone reading later gets a code that fails at checkout. An email is
frozen the moment it sends. **The code in every email is `NEST15`** — 15% off orders over $25,
no expiry. (`NEST10` is fine in *social posts*, which are read the day they're posted.)

### The welcome sequence — status

| Email | Sent | Notes |
|---|---|---|
| 1 — Welcome 🪺 | ✅ **2026-08-02** | Whole list. Carries NEST15. |
| 2 — How the Nest really began | ☐ **~Aug 5** | The story email. Evergreen, no changes needed. |
| 3 — A proper look inside the Nest | ☐ **~Aug 9** | Check the shop first — it describes what's in it. |

Live status table lives at the top of `emails/welcome-sequence.md`. Update it after each send.

### ~~Broadcast #1 — "The shop's been open"~~ — **DELETED**

Its job was done by Welcome Email 1 on Aug 2. Sending a second "actually, the shop is open"
note to the same ~100 people eight days later is repetition, not reinforcement. Aug 9 belongs
to Welcome Email 3.

### Broadcast — Custom orders open (send Fri Aug 14 evening)

**Subject:** Tomorrow, you can ask me for anything
**Preheader:** Custom orders open in the morning.

Short. Explain what custom covers (your print, your dimensions, a favourite piece recreated),
what it costs (totes $50–100, bows $10–15, scrunchies $6–12, **$25 minimum**), and how long it
takes (**10–14 days from agreeing the details, plus shipping**). One CTA, to `custom.html`.

Worth including: the **53-print fabric library**. "Pick your print" is the single most concrete
thing about custom orders, and that page already exists.

### Basket-abandoner segment — **BLOCKED, not forgotten**

The `hero` / `checkout` tags are still recorded on every signup, but **sending to a subset needs
the +$9/mo segmentation add-on**. Until that's paid for, this send cannot happen. The data keeps
accruing, so nothing is lost by waiting.

Copy, for when it's possible:
> **Subject:** Still thinking about it?
> No pressure — but the piece you were looking at is one of one, and I can't promise it'll be
> there next week.

### New: post-purchase emails — **written, in the repo**

`emails/order-updates.md` holds three hand-sent templates: **shipped**, **ready for local
pickup**, and the **one-week follow-up that asks for a review**. That third one is the most
valuable email the shop sends (§9). Writing to a buyer about their order is always fine;
**adding them to the Nest list is not** unless they subscribed themselves — the templates
invite, never enrol.

---

## 9. Post-purchase → testimonials (the highest-value thing in this plan)

Pushover already pings on every sale. Use that ping as a trigger for a manual, two-step
sequence. This is how the Kind Words section fills up.

1. **On ship (or pickup):** handwritten note in the package. Draft copy for the insert
   was written but never made it into the repo — worth writing down.
2. **7 days after delivery:** a short personal email. Not a template blast.
   > "I hope it's settling in. If you ever feel like sending a photo or a sentence about
   > it, I'd treasure it — and I'd love to put it on the site, with just your first name."
3. **When one arrives:** add `{ quote, name, where }` to `TESTIMONIALS` in `js/main.js`.
   The section reveals itself at ≥1 entry. Repost the photo to Stories with credit.

**Rule: real reviews only.** Never write one. The site is built to stay hidden rather
than fake it, and that's the right call.

---

## 10. Launch-day runbook — Saturday, Aug 15

**Night before:** confirm the site copy says custom orders open *today* (`index.html`
countdown label, shop CTA note, FAQ). Confirm `NEST10` is active. Have 3 posts drafted.

**⚠️ Times revised 2026-08-03 to match real traffic.** Cloudflare Web Analytics shows visits
cluster around **11:00–13:00** and **17:00–21:00** CDT, with almost nothing before 9am. The
original 8:00–9:15a push would have announced the launch to an empty room and been buried by
the time anyone looked. Email keeps its morning slot because an email waits in the inbox;
everything social moved into the hours people are actually awake. (Caveat: this is a small
sample from a low-traffic day — a nudge, not a law. Revisit once there's more data.)

**Measuring it:** analytics showed **15 of 21 visits as "direct"**, which is misleading —
Instagram and TikTok in-app browsers and most email clients strip the referrer, so social and
email traffic hides in that bucket. Facebook showed 3 only because it doesn't. To tell the
channels apart on launch day, tag the links: `?ref=ig` in the bio, `?ref=tt` on TikTok,
`?ref=email` in the broadcast. They then show up under **Path** in Cloudflare Web Analytics.

| Time | Action |
|---|---|
| 9:00a | **Email Broadcast #3** to the Nest: custom orders are open. Email sits and waits, so morning is still right. |
| **11:30a** | **IG post + TikTok** — the announcement, at the start of the lunch peak. Explain custom in plain words. |
| **11:45a** | **IG Story series** — 5 frames: what custom means, examples, price range, turnaround, how to ask. Link sticker → contact form. |
| 12:00–1:00p | Story: answer the questions coming in, publicly, while people are actually there. Q&A *is* the content. |
| **5:30p** | **TikTok #2** — a process video framed as "this is what your custom piece looks like being made." Start of the evening peak. |
| **8:00p** | Story recap + a nudge: "asks are open all weekend." **The busiest hour of the day.** |
| Sun 16 | Follow up on every inquiry personally within 24h. |

**The three questions that will definitely come** — all three are now answered on
`custom.html`, so the honest answer to each is "it's on the page," and the page is the
link you put in every bio and story:

- *What does custom cost?* → totes **$50–$100**, bows **$10–$15**, scrunchies **$6–$12**.
- *Can you copy a piece you've retired?* → yes, never identically ("What people ask for").
- *How long does it take?* → **10–14 days** to make, from quote acceptance, **plus**
  shipping. Say "plus shipping" out loud in replies — it's the bit people mishear.

There's also a **$25 minimum** on custom orders, which is the polite way to say "a single
$6 scrunchie isn't worth a bespoke conversation" — it steers those requests to the shop
or into a set.

---

## 11. Channels not yet used — worth starting

- **Pinterest (highest ROI unused channel).** Cottagecore and book-tote searches are
  Pinterest-native, pins have a multi-month tail, and the product photography already
  exists. Cost: one afternoon setting up boards, then pin every product photo.
  *Recommended: start this in Week 1.*
- **Local markets / craft fairs (San Antonio).** The strongest channel for a shop whose
  advantage is that pieces feel better in hand. Also solves the shipping-cost problem
  outright. Research fall dates now; applications usually close months ahead.
- **Instagram Broadcast Channel.** Free, and a lower-friction list than email for
  drop announcements.
- **Paid ads.** *Not yet.* Don't spend a dollar until there are 3 testimonials and a
  repeatable organic post format. Ads amplify a working funnel; there isn't one to
  amplify yet.

---

## 12. Site changes this campaign assumes

These are the gaps the campaign will run into. Listed so they don't ambush you mid-month.

**Done since the last version** — custom.html deployed and self-gating · welcome sequence
rewritten evergreen · pre-Jul-10 subscribers back-filled · `shop.html` and `fabrics.html` in
the sitemap · `aggregateRating` added · `shipping.html` now covers custom turnaround ·
sold-out waitlist · product-page zoom · cross-category cross-sell · order-email templates.

| Priority | Item |
|---|---|
| **High** | **The founder photo is still a phone selfie.** The story pillar (20% of all content) leans entirely on her, and this is the highest-trust element on the site. A real shot of her *at the machine, with her work* is the single best investment available — and it's the only High item left. |
| **High** | **Get more reviews.** 2 exist; only 1 describes something buyable. Every order this month must end in an ask (§9). This is a marketing job, not a site job. |
| Medium | Write the **post-purchase insert** copy down in the repo. Referenced repeatedly, still not written. |
| Medium | `js/main.js` still holds a vestigial `PRODUCTS`/`VARIANTS` copy with the **old $4/$9 scrunchie prices**. Unused — the homepage has no `.card-variant` — but a live trap for whoever edits the wrong file next. Prune it. |
| Low | Shop **category counts include sold-out items** ("Bows 4" when 2 are buyable). Harmless now, misleading as more sell. |
| Low | `404.html` has no `noindex`; `assets/web-background.jpg` (346 KB) is tracked but referenced nowhere; WebP conversion would save ~2–3 MB. |
| Low | Bows stay capped at **1 per order** (decided 2026-07-30 — one-of-a-kind like the totes). Noted so it isn't reopened. Scrunchies keep `maxQty: 3` because **multiples of each print are stocked** — also not a bug. |

**None of the Medium or Low items will earn a sale.** Analytics say conversion is fine and
traffic is the constraint. Do them when bored, not instead of sewing or posting.

---

## 13. Ready-to-post captions

Copy-paste. Swap the hashtag block per §6.

**The Storykeeper (Aug 3)** — the newest piece, and the most on-brand thing in the shop
> Shelves of old books and apothecary bottles, stacked floor to ceiling on black.
>
> I called it The Storykeeper because that's what it is — the library you'd happily get
> lost in, except you can carry it. Lined in black, long strap that sits at the hip, and
> an outside pocket for whatever you need first.
>
> There's one. $32. It's already sewn, so it goes out this week. 📚
>
> *(Pair with the lining shot — the little dragon label is the detail people reply to.)*

**Sold out — use whenever a piece goes (template)**
> The [PIECE] found a home this week.
>
> [One honest line about making it.]
>
> It isn't coming back. That's not a sales tactic, it's just how this works: I make one,
> and then it belongs to someone. Its story moves to the Stories page, and I start the
> next chapter.
>
> Link in bio for what's still here. ✨
>
> *(Don't hard-code a count of remaining pieces — the old version of this caption said
> "six still on the shelf" and was wrong within days. Say "what's still here" instead.)*

**The coffee drop (when the restock lists, ~Aug 7)**
> Some days the book is the point. Some days it's the cup.
>
> I've been sitting on a whole shelf of coffee prints — roasted roses, cinnamon marble,
> the daily grind — and this week I finally cut into them.
>
> [Bows / totes], sewn and ready to ship. For anyone whose day doesn't start until the
> kettle does. ☕

**Founder story (Aug 4)**
> People ask how this started, and the honest answer isn't a business plan.
>
> It started after I became a mom, in the middle of postpartum depression — a season
> much harder than I expected. I went looking for something that still felt like *me*.
> A quiet corner of the day where I could work with my hands and make one beautiful
> thing, start to finish.
>
> So I started sewing. Slow, and imperfect, and the most grounding thing I'd done in a
> long while.
>
> Books were the other thing that carried me. From the first time I opened *Twilight* to
> getting lost in *Throne of Glass* — stories reminded me that ordinary days can still
> hold adventure. That's the feeling I try to sew into everything.
>
> You don't have to leave wonder behind just because you grew up. 🧵

**BookTok — what's in my book bag (Aug 5)**
> book bag check 📚 the storykeeper, current read, and a scrunchie I refuse to take off.
> tell me what you're reading and I'll tell you which tote it belongs in.

**Ready to ship — a line worth reusing everywhere**
> Everything in the shop is already sewn. Not made-to-order, not a six-week wait — it's
> finished, it's one of one, and it goes in the post within a few days.
>
> *(This is new as of Aug 3 and most handmade shops can't say it. Pair it with scarcity —
> "one of a kind AND it ships this week" is stronger than either half alone.)*

**Custom orders announcement (Aug 15)**
> Starting today, you can ask me for something that doesn't exist yet.
>
> Custom orders are open. That means: your print, your dimensions, a favorite piece
> recreated with your own twist. A tote sized for the exact book you carry. A bow in
> the color of someone's wedding.
>
> I take a small number at a time, because I don't rush the process — handmade should
> mean something.
>
> Tell me what you're imagining. Link in bio. ✨

**Build Your Own Bundle (Aug 21)**
> Three scrunchies, any three prints, $15. 🎀
>
> Butterfly, cherry blossom, cherry, orange kitty, pink bumble bee, pretty in pink,
> wildflower, strawberry — pick your trio right on the page.
>
> (San Antonio: pickup is free, so this is genuinely just $15. Everyone else: add a tote
> and shipping is on me over $50.)

---

## 14. Weekly rhythm — 45 minutes, once a week

Sustainable beats ambitious. Every Sunday:

1. Check Stripe, Buttondown, and IG against the §3 targets. Write down three numbers.
2. Batch-shoot: film while sewing anyway. One process clip covers a whole week.
3. Draft next week's posts from §7 into a scheduler.
4. Answer every DM and inquiry from the past week.
5. Ask one recent customer for a review.
