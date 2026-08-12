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
- **Custom orders are an upgrade, not a delay.** Framing: *"You've seen what I make.
  Now you can ask me to make yours."* The form opens Mon Aug 17; the list hears on Sat Aug 29.

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
| Custom order inquiries | **5** after Aug 17 | Web3Forms → Gmail |
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
lookbook. That's a gift for the Aug 29 push: a real customer, in her own words, delighted
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
| Sat Aug 8 | IG + FB | ⚠️ **SUPERSEDED 2026-08-08 — custom orders opened today, so a countdown post is wrong.** Use the evergreen fabric-library post in §13, or say plainly that the doors are open. Was: a countdown — folded together with the local San Antonio angle the slot was already for: what custom means, the fabric library, free local pickup, veteran-owned. Caption in §13. ⚠️ The fabric-library teaser is also booked today (`marketing/fabric-collections-2026-08.md`). **Pick one.** The teaser is the stronger post; if it runs, move this to Sun Aug 9. |
| Sun Aug 9 | **Email** | **Welcome Email 3 — "A proper look inside the Nest,"** carrying the coffee drop and teasing Aug 17. **This replaces the old "Broadcast #1"** (see §8). |

**⚠️ Aug 9 used to have two emails on it** — Welcome Email 3 *and* a "the shop's been open"
broadcast. Broadcast #1 has been deleted: Welcome Email 1 already said that on Aug 2, and
sending twice to a list this small is how people unsubscribe.

### Week 2 — Custom orders countdown (Mon Aug 10 – Thu Aug 20)

> ## ⚠️ REVISED 2026-08-06 — THE OWNER IS TRAVELLING
> **Away Aug 14–16 and again Aug 21–24.** That killed the original Sat Aug 15 launch and
> also the obvious fallback of Sat Aug 22 — both fall inside a trip, and the 15th would
> have opened custom orders into three days of silence.
>
> **The launch is now two separate things, because only one of them needs her present:**
> - **Mon Aug 17 — the FORM OPENS.** Quiet. No campaign, no broadcast. `CUSTOM_OPENS` in
>   js/dates.js does this by itself. The point is that anyone who saw the old August 15
>   date and comes looking can still ask, rather than meeting a shut form.
> - **Sat Aug 29 — the LAUNCH PUSH.** The full runbook in §10: email, posts, live Q&A.
>   The first Saturday she is home with no travel either side.
>
> Nothing was ever promised publicly except the site's own copy, and the site rewords
> itself from one constant — the **welcome emails deliberately carry no dates**, so the
> list has never been told any launch date at all. Moving it costs almost nothing.
>
> Aug 17–20 is **not** free time: Maurya's two quilted totes and Aubrea's three bow clips
> come due that week, straight off a trip. Don't stack content on top of it.

Frame it as *"now you can ask for yours."*

| Day | Channel | Post |
|---|---|---|
| Mon Aug 10 | IG + TikTok | **Announce it.** ⚠️ Not "in one week" — custom orders opened Aug 8. "You can now ask me to make something that doesn't exist yet." Explain what custom means: your print, your size, your person. Point at the **71-print fabric library** — it's the most persuasive custom-orders asset on the site and nothing currently drives traffic to it. ⚠️ This row used to say "in 5 days" and "53-print"; the launch moved to Aug 17 and the library grew. |
| Mon Aug 10 | **Email (personal)** | **Follow up with all 3 customers** — how did it settle in, and would you send a line or a photo? This is the review engine (§9). Reminder is already scheduled. |
| Tue Aug 11 | IG Story | **Q&A sticker:** "What would you have me make?" Harvest the answers — they're both content and product research. |
| Wed Aug 12 | TikTok | Same process clip — a tote start to finish, compressed, the most shareable format you have. ⚠️ **The countdown ending is dead** (opened Aug 8): end on "you can ask me for one of these today" instead. Process footage plus "you can ask me for one of these on Monday" is a better post than either half. Caption in §13. |
| Thu Aug 13 | IG carousel | **Cottage Rose + Blue Rose Mini** together — both still in stock. Note the rename openly ("same tote, better name"). |
| Fri Aug 14 – Sun Aug 16 | — | **AWAY.** Nothing scheduled. Shop orders keep arriving and Pushover keeps buzzing; they ship on the 17th, still inside the 1–3 business day promise. **No local pickups can be handed over.** |
| **Mon Aug 17** | *(nothing)* | **The form quietly opens.** Deliberately no post — the announcement is saved for the 29th. Enquiries land in Gmail and wait. |
| Tue Aug 18 – Thu Aug 20 | IG Story, light | **Make week.** Maurya's two quilted totes and Aubrea's bow clips are due. Film them being made — that footage *is* the Aug 29 launch content, and it's the only proof you'll have that custom work already delights people. |
| Fri Aug 21 – Mon Aug 24 | — | **POSSIBLE second trip — NOT CONFIRMED as of 2026-08-06.** Deliberately **not** on the site: an away banner is a promise about when a parcel moves, so it should only describe travel that's actually happening. If it firms up, add the window to `AWAY` in **both** js/dates.js and worker/checkout-worker.js, extend the custom.html notice prose, then `wrangler deploy`. **If it's cancelled, Sat Aug 22 reopens as a launch date** — see §10. |
| Tue Aug 25 – Fri Aug 28 | IG + TikTok | **Rebuild the runway.** Countdown to Saturday: "custom orders are open, and on Saturday I'll show you what that means." |
| **Sat Aug 29** | **Everything** | **CUSTOM ORDERS LAUNCH PUSH.** The runbook in §10. |

### Weeks 3–4 — Sustain (Sun Aug 30 onward)

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
| 2 — How the Nest really began | ✅ **2026-08-05** | The story email. Evergreen, no changes needed. |
| 3 — A proper look inside the Nest | ☐ **~Aug 9** | Check the shop first — it describes what's in it. |

Live status table lives at the top of `emails/welcome-sequence.md`. Update it after each send.

### ~~Broadcast #1 — "The shop's been open"~~ — **DELETED**

Its job was done by Welcome Email 1 on Aug 2. Sending a second "actually, the shop is open"
note to the same ~100 people eight days later is repetition, not reinforcement. Aug 9 belongs
to Welcome Email 3.

### Broadcast — Custom orders are open (send **Sat Aug 29**, the push date)

**DECIDED 2026-08-08.** It was written for Fri Aug 14 evening, subject "Tomorrow, you can ask me
for anything" — which would have sent from inside the Aug 14–16 trip, about a date that had
already moved. The form now opens quietly on **Mon Aug 17** with no email at all, and the list
hears about it on the **29th**, with the rest of the push.

**That delay is an advantage, not a compromise.** By the 29th custom orders have been open for
twelve days, and Maurya's two quilted totes and Aubrea's three bow clips are finished (due
Aug 17–19). So this email shows a real custom piece somebody actually asked for instead of
describing a hypothetical one — which is the single biggest thing it can do.

**Subject:** You can ask me for anything
**Preheader:** Custom orders are open — here's what that looks like.

Lead with the finished work: a photo of one of the custom pieces made this month, and one line
about what she asked for. Then explain what custom covers (your print, your dimensions, a
favourite piece recreated), what it costs (totes **$50–100**, book sleeves **$35–50**, home
pieces **$30–60**, pet bandanas **$22–35**, bows **$13–20**, scrunchies **$8–12**, quilts
**from $350** — heirloom quilts pieced from someone's clothes **from $650** — repairs
**from $40**, **$25 minimum**), and how long it takes (**10–14 days from
agreeing the details, plus shipping** — ⚠️ **quilts are 8–12 weeks**, so if a quilt is named in
this email the timing line has to name it too). One CTA, to `custom.html`.

Worth including: the **71-print fabric library**. "Pick your print" is the single most concrete
thing about custom orders, and that page already exists.

⚠️ **Don't say "opens today"** — it opened on the 17th, and anyone who already sent an enquiry
will notice. "Are open" is the tense.

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

## 10. Launch-day runbook — Saturday, Aug 29

**⚠️ Moved from Aug 15 on 2026-08-06** (owner away Aug 14–16 and Aug 21–24 — see Week 2).
By the 29th the **form has already been open since Aug 17**, so this is not "we're open
now", it's **"here is what custom actually means, and here's what I've already made."**
That's a stronger post: you'll have Maurya's quilted totes and Aubrea's bow clips finished
and photographed, plus whatever early enquiries came in. Lead with the real work, not the
announcement.

**Night before:** confirm the site says custom orders **are open** (it flips itself, but
look). Have 3 posts drafted. **`NEST10` is long dead by the 29th** — the standing offer is
**NEST15**, 15% off orders over $25, and that $25 floor happens to match the custom-order
minimum exactly, so it's the better offer for this launch anyway. Don't write "10% off".

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
| 9:00a | **Email Broadcast #3** to the Nest: custom orders are open. Copy and subject line are in §8. Email sits and waits, so morning is still right. Lead with a finished custom piece — by now there is one. |
| **11:30a** | **IG post + TikTok** — the announcement, at the start of the lunch peak. Explain custom in plain words. |
| **11:45a** | **IG Story series** — 5 frames: what custom means, examples, price range, turnaround, how to ask. Link sticker → contact form. |
| 12:00–1:00p | Story: answer the questions coming in, publicly, while people are actually there. Q&A *is* the content. |
| **5:30p** | **TikTok #2** — a process video framed as "this is what your custom piece looks like being made." Start of the evening peak. |
| **8:00p** | Story recap + a nudge: "asks are open all weekend." **The busiest hour of the day.** |
| Sun 16 | Follow up on every inquiry personally within 24h. |

**The three questions that will definitely come** — all three are now answered on
`custom.html`, so the honest answer to each is "it's on the page," and the page is the
link you put in every bio and story:

- *What does custom cost?* → totes **$50–$100**, bows **$13–$20**, scrunchies **$8–$12**,
  quilts **from $350**. (⚠️ These read $10–15 and $6–12 until 2026-08-12 — stale since the
  2026-08-11 revision. Answers drift the moment a band moves; the canonical list is the
  price-bands note in CLAUDE.md.)
- *Can you copy a piece you've retired?* → yes, never identically ("What people ask for").
- *How long does it take?* → **10–14 days** to make, from quote acceptance, **plus**
  shipping — **except quilts, which are 8–12 weeks**. Say "plus shipping" out loud in replies —
  it's the bit people mishear.

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

**Custom orders announcement (Sat Aug 29 — the push)**
> This is the part I've been waiting to show you.
>
> Custom orders are open. That means: your print, your dimensions, a favourite piece recreated
> with your own twist. A tote sized for the exact book you carry. A bow in the colour of
> someone's wedding.
>
> This one [above / in the first photo] was made for someone who asked for [X]. That's how it
> works — you tell me what you're picturing, I come back with a price, and nothing is charged
> until you've said yes.
>
> Seventy-one prints on the shelf to choose from, and I take a small number at a time, because
> I don't rush the process — handmade should mean something. ✨
>
> *(Swap in a real piece and a real sentence about it. If nothing is finished, don't post this —
> post the process footage instead and hold this until something is.)*

⚠️ **Posts 6 and 7 were rewritten AGAIN on 2026-08-09 — the countdown is dead.** The versions
below the previous ones counted down to Monday Aug 17. **Custom orders opened early on Aug 8**
(`CUSTOM_OPENS` in js/dates.js), so a countdown post now tells people to wait for something they
can already have — worse than posting nothing, because the countdown *was* the hook. The site
flipped itself; these captions had to be flipped by hand. **The big push is still Sat Aug 29** —
these two are the quiet "it's open, ask me" posts that fill the gap.

**Post 6 replacement — Sun Aug 9, open now** *(rewritten twice: the original said "this time next Saturday, the Nest is open" when the shop opened July 1; the second counted down to Aug 17, which the early opening killed)*
> You can now ask me for something that doesn't exist yet.
>
> Custom orders are **open**. Your print, your size, made for you or for someone you love — a
> tote sized to the exact book you carry, a bow in a friend's wedding colours, a bandana cut to
> your dog's actual neck, a piece you saw here months ago remade in a fabric you picked yourself.
>
> There are seventy-one prints on my shelf right now, all named, all already in my house. Picking
> one is genuinely the fun part, and you don't have to know the rest — tell me what you're
> picturing and I'll come back with a price. Nothing is charged until you've said yes.
>
> I take a small number at a time, because I don't rush the process. So if there's something in
> your head, now is a good moment to say it. 🧵
>
> (San Antonio — local pickup is always free. Veteran-owned, sewn at my kitchen table.)

*Link the fabric library, not just the custom page — the shelf is what makes people realise they
get to choose. **Don't quote a turnaround in the caption.** Aug 17–20 is already spoken for by
Maurya's wheelchair tote and Aubrea's bow clips, and the trip is Aug 14–16; agree dates in the
reply, per enquiry, where you can be honest about the queue.*

**Post 7 replacement — Wed Aug 12, process video** *(the original was a "3 days" countdown to the ready-made shop opening; the second counted down to Aug 17)*
> A tote, start to finish, in under a minute.
>
> Cutting, pinning, the lining, the strap, the last press. This is the part nobody sees, and
> it's the part that takes the longest.
>
> **This is the bit you get to commission now** — custom orders are open, so you pick the print
> and the size and I make you one of these from scratch. Seventy-one prints on the shelf to
> choose from.
>
> *(TikTok caption, shorter:)* a tote from bolt to finished, sped up. custom orders are open —
> pick the print, I'll make you one 🪡 #handmade #processvideo #booktok
>
> *(Away Aug 14–16. Anything landing over that weekend gets its reply on the 17th — say so in the
> reply, not in the caption; a post that leads with when you're unavailable sells nothing.)*

**The Reading Nook Sleeve — Facebook + Instagram (live since 2026-08-07, never announced)**
*The angle is Rebekah's review. She left five stars for the Road Trip Kindle Case — a one-off
that went to her and was never a listing, so for months the shop has carried a glowing review
for something nobody could buy. This is the first time that review points at a thing on the
shelf. Quote it verbatim; it is real and it is already on the homepage.*

**Facebook:**
> Months ago I made a padded case for someone's Kindle so she could travel with it. She wrote
> to me afterwards and said:
>
> *"Thank you for my custom kindle/book case, I adore it! So happy I can travel with it now in
> my bag!!"*
>
> It was a one-off. There was never one to buy — until now.
>
> The **Reading Nook Sleeve** is 12 by 8.5 inches, quilted and padded the whole way round, so
> whatever else is in your bag stops pressing against the cover. It takes a hardback, a
> paperback or an e-reader.
>
> The top is open on purpose. No button, no snap, nothing to undo when you've got one hand free
> and five minutes to read — it just slides out.
>
> The Daily Grind on the outside under a band of Cinnamon Marble, and a Toffee Windowpane lining
> that nobody but you will ever see. $28, already sewn, one of one.
>
> https://www.dragoninkandthread.com/shop.html
>
> (San Antonio — local pickup is free.)

**Instagram** — carousel: the sleeve closed → the lining shot → a book half out of it →
optionally a screenshot of Rebekah's review.
> Somewhere soft for whatever you're in the middle of.
>
> Quilted and padded all the way round, 12 by 8.5 inches, and open at the top on purpose — no
> button, no snap, nothing to undo when you've got one hand free and five minutes to read.
>
> The Daily Grind on the outside under a band of Cinnamon Marble. Toffee Windowpane inside,
> where only you will see it.
>
> I made a padded case like this for someone months ago and she still tells me she travels with
> it. That one was a one-off. This one you can actually have. 📖
>
> $28. There's one.
>
> Link in bio.

⚠️ **Shows the piece off best with a book in it.** A book sleeve photographed empty is a flat
brown rectangle; photographed with a paperback half out of it, it's obvious what it does.

**Two new pet bandanas — Facebook (2026-08-08)**
*A Medium exists now. That's the headline, not the fabric: the shop's only bandana until today
was a Large, and "small and medium available on request" is a sentence people don't act on.
Showing a finished Medium is what tells a small-dog household this is for them.*

> Two more bandanas came off the machine this week — and one of them is a **Medium**.
>
> That matters more than it sounds. Until now the only one in the shop was a Large, which is
> lovely if your dog is a shepherd and no use at all if yours fits in the crook of your arm. So
> here's proof the smaller sizes are real.
>
> **Medium — Toffee Windowpane.** Fits a 13 to 18 inch neck. A warm brown plaid, quiet and a
> bit tweedy — the one for a dog who'd rather look like he's going to the pub than to a party.
> Reversible, and the same plaid both sides, so there's no wrong way round.
>
> **Large — Brew and Bloom, reversible.** Fits an 18 to 23 inch neck. Lattes and pale flowers
> on cream on one side; turn it round and it's Blushing Linen, a soft dusty pink, for the days
> that call for something quieter. Two bandanas on one collar. Made for the dog who lies under
> the table while you have your first cup of the morning.
>
> Both of these are **reversible**, which the Storykeeper one isn't — so if you've bought from
> me before, these are finished differently, on purpose.
>
> Between the two of them that's 13 to 23 inches, which covers most of the dogs I know. $18 each.
>
> They go over the collar they already wear — nothing to tie, nothing to work loose, nothing to
> lose on a walk. Machine wash cold, hang to dry, because they will need it.
>
> And if neither size is yours, that's the whole point of custom: tell me your dog's neck
> measurement and pick a print from the library. The more of them there are, the better the
> price gets, so a whole household can match.
>
> https://www.dragoninkandthread.com/shop.html
>
> (San Antonio — local pickup is free, so you can collect and skip the postage entirely.)

**Photos, in order:** the Large's coffee side → the Large flipped to the blush side (this is the
one that earns the post — reversible is a surprise) → the Medium → the two flat together for
scale with a hand in frame. **The scale shot is what sells the Medium**; "Medium" means nothing
until it's next to something.

**Sizes confirmed 2026-08-08:** Medium 13″–18″, Large 18″–23″. They meet at 18 inches, so the
two together are a continuous range with no gap — worth saying out loud, because a shopper whose
dog measures 17 shouldn't have to work out which one to trust.

⚠️ **Both must be listed and `wrangler deploy`'d before this posts**, or the link lands on a shop
page that doesn't show them.

### Back-catalogue posts — FACEBOOK, written 2026-08-10

*Why Facebook specifically: measured that day, Facebook was **44% of all site visits** (64 of
146) and both traffic spikes of the week were Facebook posts, while **Instagram and TikTok sent
zero attributable visits** — neither allows a clickable link in a post. Anything meant to sell
goes here, with the URL in it. See the measurement table in TASKS.md.*

*These cover the pieces that have never had their turn: the totes, the scrunchie bundles and
the two older gingham bows. Prices and dimensions are pulled from js/shop-data.js and were
correct on 2026-08-10 — **re-check before posting if anything has sold**, since four of the five
totes are one of a kind.*

**1 — The tote line-up ✅ POSTED 2026-08-10 (Facebook)** *(highest-value neglected category. Owner chose 2026-08-10 to include
the RETIRED totes as well, so this version covers all nine. Image:
`assets/social/fb-tote-lineup.jpg`, built by `node tools/build-pin-images.js` — the sold four
are desaturated under a "found a home" label, which is what keeps the post honest.)*
> Every tote I've ever made, in one place.
>
> Five of them are still here:
>
> **The Storykeeper** — shelves of antique books and apothecary bottles, printed deep on black. 15″ × 12″, an 18″ strap that sits at the hip, outside pocket. $32.
> **The Butterfly Tote** — lily-of-the-valley and pale pink butterflies on warm cream, with a front pocket for the things you need first. $38.
> **The Strawberry Tote** — Japanese knot-style, wild strawberries and trailing vines, slouchy and roomy. $35.
> **The Cottage Rose Tote** — dusty roses over mustard-gold, a little sun-faded, endlessly cozy. 10″ × 12″. $20.
> **The Blue Rose Mini** — tiny pink roses on powder blue, 8″ × 4″, for days you only need the essentials. $20.
>
> The four along the bottom already found homes — the Sunflower, the Mushroom, the first Strawberry, and the Lavender and Honeybee wheelchair tote.
>
> That's how this works, and I wouldn't change it: I make one, and then it belongs to someone. Every tote is fully lined and finished inside, because I can't help myself, and they're already sewn — so they go in the post within a few days.
>
> https://www.dragoninkandthread.com/shop.html
>
> (San Antonio — local pickup is free. Orders over $50 ship free anywhere.)

*⚠️ If any of the five sells before this posts, move it into the retired row and rebuild —
otherwise the image advertises a tote that is gone, which is the one thing the "found a home"
label exists to prevent.*

**2 — Blue Rose Mini, on its own**
> Not every day needs a big bag.
>
> The Blue Rose Mini Tote is 8 inches by 4 — phone, keys, card, lip balm, and a slim paperback if you're careful. Tiny pink roses drifting over the softest powder blue, fully lined, with a 6 inch strap drop so it sits high and out of the way.
>
> It's the one for when carrying a whole handbag feels like too much.
>
> $20, and there's one.
> https://www.dragoninkandthread.com/tote-blue-rose.html
>
> (San Antonio — local pickup is free.)

**3 — Scrunchie bundles** *(never promote a single scrunchie — §5)*
> Three scrunchies, $15.
>
> Two ways to do it: the classic trio in red, cream and navy — the ones that go with everything — or build your own from any three prints on the shelf. Butterflies, cherry blossom, wildflowers, strawberries, a very smug orange cat.
>
> Soft, springy, and sturdier than they look. Gentle enough for curly hair, strong enough to hold a thick ponytail through a whole day.
>
> Unlike most things here, these aren't one-of-a-kind — I keep a few of each print — so if your favourite is still listed, it's still there.
>
> https://www.dragoninkandthread.com/shop.html#scrunchies
>
> (San Antonio — local pickup is free.)

*⚠️ The "not one of a kind" line is deliberate and must stay accurate: scrunchies carry
`maxQty: 3` because multiples of each print are stocked. Don't copy the scarcity line from the
tote posts onto them.*

**6 — Custom orders, PRICED — FACEBOOK, written 2026-08-10**

*A second custom-orders post the same day as the announcement, at the owner's request. It works
only because the entry point is different: post 6 said "you can ask me for something", this one
answers the question nobody asks out loud — **what does custom cost?** People assume custom means
expensive and quietly don't enquire. Repeating the announcement louder would have reached the
same small audience with less news.*

*Image: `assets/social/fb-custom-orders.jpg`, built by `node tools/build-pin-images.js`.*

> Nobody asks what custom costs, so I'll just tell you.
>
> **Totes $50–100 · Book sleeves $35–50 · Home pieces $30–60 · Pet bandanas $22–35 · Bows $13–20 · Scrunchies $8–12 · Quilts from $350**
>
> **And repairs and mending, from $40** — bring me the quilt with the worn patch and I'll tell you honestly what it needs.
>
> **Quilts take 8 to 12 weeks**, not the two weeks everything else takes — and if you want one pieced from someone's clothes, a jacket or a favourite shirt, that starts at $650 and it's the slowest, most careful thing I do.
>
> That's the whole range. A tote sized to the exact book you carry, in a print you chose yourself, sits about where a decent shop bag does — except one person made it, and there's only ever going to be one.
>
> How it works: tell me what you're picturing, I come back with a price, and **nothing is charged until you've said yes**. If I can't make what you want, or can't do it for what you'd want to pay, I'll tell you at the start rather than after.
>
> Seventy-one prints on my shelf to choose from, and picking one is genuinely the fun part.
>
> I take a small number at a time, so if there's something in your head, say it and we'll see what it'd take.
>
> https://www.dragoninkandthread.com/custom.html
>
> (San Antonio — local pickup is free. Veteran-owned, sewn at my kitchen table.)

*⚠️ **No turnaround is quoted, deliberately.** Aug 17–20 is already full with Maurya's wheelchair
tote and Aubrea's bow clips, and Aug 14–16 is a trip. "I take a small number at a time" is the
honest hedge; agree real dates per enquiry in the reply.*

*⚠️ **Bands revised 2026-08-11** and now live in FOUR places: `custom.html` (twice),
`PRICE_BANDS` in tools/build-pin-images.js, and here. Change all four together.*

*⚠️ **Every floor sits ABOVE the ready-made equivalent on purpose** — bows $13 vs $12, sleeves
$35 vs $28, bandanas $22 vs $18 — so the minimum paragraph's promise that "the ready-made ones
in the shop are the same lovely thing for less" stays literally true. Scrunchies went $6→$8
because $6 **tied** the shop price and made that sentence false for that one category.*

*⚠️ **Repairs carry no ceiling deliberately.** One contained hole was $75; three tears and a
rotten binding is a different afternoon, and a published range would be a promise made before
seeing the damage. "Buy more, save more" is applied BY HAND at quoting time — no coded discount,
so never put a specific multi-buy figure in a post.*

**5 — The Quilted Court Bandana — FACEBOOK, written 2026-08-10**

*The pricing problem this post has to solve: it is **$22 where every other bandana is $18**, and
the shop has never had a price step inside a category before. The answer is not to explain that
patchwork is harder — it is to lead with the photo of two dozen seams and let people conclude it
themselves. Hence the photo order below; the flat shot is not the prettiest, it is the
persuasive one.*

> This one took the longest of anything I make in its size, and you can see why.
>
> Two dozen small squares — blush roses, pale plaids, dotted cream, a wash of sage — cut and pieced one at a time, every seam meeting the three around it. It's the only patchwork piece in the shop, and the reason it's $22 rather than $18 is sitting right there in the first photo.
>
> **The Quilted Court Bandana.** Size Medium, fits a 13 to 18 inch neck. Reversible — turn it round and it's Blushing Linen, a soft dusty pink, for the days the patchwork would be too much. The top is an elasticated channel, so it stretches straight over the collar they already wear: nothing to tie, nothing to work loose halfway round the block.
>
> Machine wash cold, hang to dry, because it will need it.
>
> There's one.
> https://www.dragoninkandthread.com/bandana-quilted-court.html
>
> (San Antonio — local pickup is free.)

**Photos, in order:** `bandana-quilted-court.jpg` (flat patchwork — the price justification, so
it leads) → `-2.jpg` (worn by the dog — fit and warmth; **name him if it's Ghost**, the audience
has met him) → `-3.jpg` (the Blushing Linen reverse — the surprise, better third than announced)
→ `-5.jpg` (the elasticated channel — the practical detail that separates it from a printed one).

**4 — The two gingham bows**
> Two gingham bows, quietly waiting.
>
> **Taupe Gingham** — a soft warm check that goes with everything from sundresses to storybooks.
> **Sage Gingham** — sage green strewn with the tiniest pink roses, like a garden picnic.
>
> Both hand-tied sailor bows, 6 inches across, on a slide-in clip so they go straight in and stay put. $12 each.
>
> They're the ones I'd wear on an ordinary Tuesday, which is the highest compliment I can give a bow.
>
> https://www.dragoninkandthread.com/shop.html#bows
>
> (San Antonio — local pickup is free.)

**The scroll — screen-recording the library into custom orders (EVERGREEN)**
*The video version of the post below. Shoot it once; it works on TikTok, Reels and Facebook,
and it keeps working for as long as the library exists.*

**Why a screen recording beats a fabric flat-lay here:** the thing being sold is not the fabric,
it's the *choosing*. Nobody knows they're allowed to pick until they watch someone do it. The
scroll is the demonstration.

**Shot list — 20 to 25 seconds, filmed on the phone, portrait:**
1. **0–2s.** Open on the library already loaded, thumb resting. On-screen text: `this is my
   entire fabric shelf`
2. **2–4s.** Scroll slowly past the intro line — it reads *"These are the 71 fabrics on my shelf
   right now"* — long enough to be read, not long enough to be boring.
3. **4–8s.** Tap two of the group filters. `Tea with the Suriel 6`. `Postcards and Pumpkins 4`.
   This is the beat that tells people the shelf is *sorted*, not a pile.
4. **8–15s.** Scroll properly. Let the names go by — Flowers of Adarlan, Nesta's Cats, Court of
   the Owl King, Toadstool Village. Slow to a stop on one. Tap it so it fills the screen.
   On-screen text: `every one of them has a name`
5. **15–20s.** Tap through to the custom page. Land on the heading: *"Ask me for something that
   doesn't exist yet."* Let it sit for a full second — that line does the work.
6. **20–25s.** End frame: `pick a print. I'll make you the thing.`

**Sound:** this is the one post where silence doesn't work — a screen recording has no sound of
its own. Something quiet and unhurried under it, no trending audio, no voiceover needed.

**TikTok / Reels caption:**
> people don't realise they get to choose. this is the whole shelf — 71 prints, all named, all
> sitting in my house right now. pick one and I'll make you a tote, a bow, a bandana, whatever
> you're picturing. custom orders are open 🧵📖 #booktok #cottagecore #handmade #smallbusiness

**Instagram feed caption** (if posting as a Reel to the grid):
> This is the part people don't expect.
>
> When someone asks me for something custom, they don't get a colour swatch and a guess — they
> get the actual shelf. Seventy-one prints, sorted onto seven shelves, every one of them named,
> every one of them already in my house.
>
> Flowers of Adarlan. Nesta's Cats. Court of the Owl King. Toadstool Village.
>
> You scroll it like a menu. Find the one that stops you, tell me what you're picturing, and I
> come back with a price — nothing is charged until you've said yes.
>
> Custom orders are open. Go and choose. 🧵
>
> Link in bio → the fabric library.

**Facebook caption:**
> This is the part people don't expect about custom orders — you get to see the actual shelf.
>
> Seventy-one prints, sorted onto seven shelves, every one of them named and every one already
> in my house. You scroll through it like a menu, find the one that stops you, and tell me what
> you're picturing. I come back with a price, and nothing is charged until you've said yes.
>
> Custom orders are open.
>
> https://www.dragoninkandthread.com/fabrics.html
>
> (San Antonio — local pickup is always free.)

⚠️ **Re-shoot it whenever the count changes.** The intro line on the page reads the number out
loud, so a video showing "71" dates itself the day fabric 72 lands. It's a two-minute re-record.

**The fabric library — EVERGREEN, reusable any time**
*Not the same post as the Aug 8 teaser. That one is news ("eighteen new prints") and will date;
this one is about the page itself and works in any month. Don't run them within a fortnight.*

Instagram — carousel: a screen-recording or screenshot of the library page first, then four or
five swatches with their names captioned.
> Flowers of Adarlan. Feyre's Garden. Court of the Owl King. Nesta's Cats. Wings and Ruin.
>
> Those aren't chapters. They're fabric.
>
> I keep a library of prints — **seventy-one** of them right now — and I've named every single
> one, because "blue floral, number four" is nobody's idea of a good time. Some are named for
> books I disappeared into. Some for what they look like at seven in the morning with a cup of
> something. One is named after my cat's entire personality.
>
> They're sorted onto seven shelves: coffee prints, florals, creatures and curiosities, quiet
> blenders, a woodland, a tea party, and one that's already thinking about autumn.
>
> Here's the part people don't expect — **you can pick one.** Browse the library, find the print
> that stops you, note its name, and tell me. That's the whole process. I come back with a price,
> and nothing is charged until you've said yes.
>
> Custom orders are open. Go and choose. 🧵
>
> Link in bio → the fabric library.

*(Before Aug 17, swap the last line for: "Custom orders open Monday the 17th — but tell me now
what you're picturing and I'll have a price ready for you when they do.")*

Facebook — same, plus the link and the local line:
> Flowers of Adarlan. Feyre's Garden. Court of the Owl King. Nesta's Cats. Wings and Ruin.
>
> Those aren't chapters — they're fabric. I keep a library of seventy-one prints and I've named
> every one of them, because "blue floral number four" is nobody's idea of a good time.
>
> They're sorted onto seven shelves: coffee prints, florals, creatures and curiosities, quiet
> blenders, a woodland, a tea party, and one already thinking about autumn.
>
> And you can pick one. Find the print that stops you, note its name, tell me what you're
> picturing, and I'll come back with a price. Nothing is charged until you've said yes.
>
> https://www.dragoninkandthread.com/fabrics.html
>
> (San Antonio — local pickup is always free.)

TikTok — the scroll:
- **Frame 1 text:** `I named all 71 of my fabrics`
- Screen-record scrolling the library slowly, then cut to three real swatches in hand.
- **Sound:** none, or something quiet. Let the names land.
- **End frame:** `pick one. I'll make you something.`
- **Caption:** `named my whole fabric shelf after books I love. tell me which one you'd pick 🧵📖 #booktok #romantasy #handmade`

**Why this one works:** every handmade shop offers "custom." Almost none show you the actual
shelf and let you choose by name. The library is the most persuasive page on the site and the
least visited — this post exists to fix that.

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
