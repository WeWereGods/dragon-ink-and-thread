# Dragon Ink and Thread — Social & Marketing Campaign
### Updated 2026-07-30 · Covers Jul 30 → Aug 30, 2026

---

## 1. What changed (why this is an "updated" plan)

The old plan — and the whole `emails/welcome-sequence.md` — was built for a **pre-launch
"coming soon, opens Aug 15"** story. That story is out of date:

| Then | Now (2026-07-30) |
|---|---|
| Shop closed, "opens Aug 15" | **Shop is OPEN** and has been since Jul 1 |
| Aug 15 = the launch | **Aug 15 = custom orders open** — a *second* launch beat |
| Buy buttons = one Stripe link per item | **Real multi-item cart** → Worker → Stripe Checkout |
| Unlimited-feeling stock | **One-of-a-kind, qty capped at 1**; sold pieces go dim + "Sold" |
| — | **Sunflower Tote is SOLD OUT** (first real scarcity proof) |
| — | **Strawberry Tote v2** is new in the shop, $35, 4 photos |
| Mustard Rose Tote | Renamed **Cottage Rose Tote** |
| — | Photo galleries (double-click a card), Pushover sale alerts live |

**⚠️ Do not send the current welcome sequence as written.** All three emails promise a
shop that "opens August 15." Rewrites are in §8. Nothing has gone out yet — the sequence
was never loaded into Buttondown — so this is a clean fix, not a correction email.

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
| Orders | **12** total, of which ≥3 are multi-item | Stripe + Pushover pings |
| Average order value | **$38+** (see the attach-rate problem in §5) | Stripe |
| Custom order inquiries | **5** after Aug 15 | Web3Forms → Gmail |
| New testimonials collected | **3 more** (on top of the 3 already live) | Manual |
| Instagram followers | **300** | IG |
| TikTok: one video over 10k views | **1** | TikTok |

**The one metric that matters most: testimonials.** Not because there are none — the
`#kind-words` section is **live with 3 real reviews** — but because 3 is the floor where
social proof starts working and the shop is about to get its busiest month. More of them
beat more followers, every time. They also unlock `aggregateRating` in the structured
data, which is the one SEO win still on the table.

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

**Problem B — the social proof that exists isn't being used.**
There are **3 real reviews live** in Kind Words, and that's it: no UGC, no unboxings, and
none of the three has ever been turned into a post. They're the most persuasive words on
the site and they're sitting in a section most visitors scroll past. Put each one on
Instagram as its own graphic, and make every order this month trigger a follow-up asking
for a photo or a sentence (see §9). **Never invent testimonials** — real ones only.

One of them is for the **"Road Trip Kindle Case"** — a retired custom make that lives in
the Stories lookbook. That's a gift for the Aug 15 beat: a real customer, in her own
words, delighted by a **custom** piece. Use that quote in the custom-orders launch post.
It's the only proof you have that the thing you're about to sell already works.

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

Three beats: **Now Open** (through Aug 9) → **Custom Orders Countdown** (Aug 10–15) →
**Sustain** (Aug 16–30).

### Week 0 — Reset & re-introduce (Thu Jul 30 – Sun Aug 2)

| Day | Channel | Post |
|---|---|---|
| Thu Jul 30 | IG carousel + TikTok | **Strawberry Tote v2 debut.** 4 photos already in the repo. The new-make angle: "I made this one before, and it found a home. So I made it again — differently." |
| Fri Jul 31 | IG Story (3-frame) | Poll: "Which retires next?" Show three totes. Low effort, high engagement, seeds scarcity. |
| Sat Aug 1 | TikTok | **Process video: hand-tying a sailor bow.** 20–30s, sound on, no voiceover. Caption points at the $10 bows. |
| Sun Aug 2 | IG Reel + Story | **"Sunflower found a home."** The first sold-out post. Screenshot the dimmed card. Gentle, not gloating: "This one's gone. That's how this works." |

### Week 1 — The story week (Mon Aug 3 – Sun Aug 9)

| Day | Channel | Post |
|---|---|---|
| Mon Aug 3 | **Email** | **Welcome sequence goes live in Buttondown** (rewritten, §8). Also back-fill pre-Jul-10 subscribers out of Gmail first — they're only recorded there. |
| Tue Aug 4 | IG carousel | **Founder story post.** The postpartum origin, in her own words, tighter than the site version. Photo of her at the machine if one exists — otherwise the About photo. |
| Wed Aug 5 | TikTok | **"What's in my book bag"** — Butterfly Tote, current read, a scrunchie on the wrist. Pure BookTok on-ramp. |
| Thu Aug 6 | IG Reel | **Mushroom Tote** feature. Woodland/foraging framing, front-pocket detail. |
| Fri Aug 7 | IG Story | **Behind the scenes: packing an order.** Tissue, note, the whole ritual. Sets up the post-purchase ask. |
| Sat Aug 8 | IG post | **Local San Antonio post.** Lead with **free local pickup**. Veteran-owned. Tag SA small-business accounts. |
| Sun Aug 9 | **Email** | **Broadcast #1: "The shop's been open."** Correct the record warmly, name the Nest discount, tease Aug 15. |

### Week 2 — Custom orders countdown (Mon Aug 10 – Sat Aug 15)

The Aug 15 beat. Frame it as *"now you can ask for yours."*

| Day | Channel | Post |
|---|---|---|
| Mon Aug 10 | IG + TikTok | **Announce it.** "In 5 days you can ask me to make something that doesn't exist yet." Explain what custom means: your print, your size, your person. |
| Tue Aug 11 | IG Story | **Q&A sticker:** "What would you have me make?" Harvest the answers — they're both content and product research. |
| Wed Aug 12 | TikTok | **Process: a tote start to finish**, compressed. The most shareable format you have. |
| Thu Aug 13 | IG carousel | **Cottage Rose + Blue Rose Mini** together. Note the rename openly ("same tote, better name"). |
| Fri Aug 14 | IG Story ×3 + Email | **Eve-of. Broadcast #2 to the Nest: "Tomorrow, custom orders open — you first."** |
| **Sat Aug 15** | **Everything** | **CUSTOM ORDERS OPEN.** See the launch-day runbook in §10. |

### Weeks 3–4 — Sustain (Sun Aug 16 – Sun Aug 30)

Drop to 3–4 posts/week. Post-launch is where solo shops burn out; protect the cadence.

- **Sun Aug 17** — Recap + first custom inquiries teaser ("here's what people asked for").
- **Tue Aug 19** — Process video (the reliable workhorse).
- **Thu Aug 21** — **Scrunchie bundle push.** Build Your Own, $15, three prints. Attach-rate play.
- **Sat Aug 23** — Stories/lookbook post: "pieces that found homes." Links the Stories section.
- **Tue Aug 26** — Whatever sold recently → "one left" or "gone" post.
- **Thu Aug 28** — **First UGC / testimonial repost**, if one exists by then. If not, ask again.
- **Sat Aug 30** — Month recap + a soft look at fall/gifting.

---

## 8. Email — rewrites required

The sequence in `emails/welcome-sequence.md` needs a factual pass before it's loaded into
Buttondown. Keep the voice; change the promise.

### Fixes to the existing 3 emails

- **Email 1 (Welcome):** "When the shop opens August 15" → **"The shop is open right now."**
  Give the discount code immediately rather than promising it later — the reason to defer
  (nothing to spend it on) no longer exists. **Verify `NEST10` is active in Stripe before
  sending.** Change the CTA from `#shop` on the homepage to **`/shop.html`**.
- **Email 2 (The story):** Almost entirely fine — it's evergreen. Only fix the link and
  add one line at the end pointing to the open shop.
- **Email 3 (What I make):** Remove "blooms" and "cozys" (retired to Stories). Add the
  **Strawberry Tote v2**. Rename Mustard Rose → **Cottage Rose**. Replace "The shop opens
  August 15" with **"The shop is open — and on August 15, custom orders open too."**
  Add the one-of-a-kind line explicitly: *quantities aren't limited, they're singular.*

### New: Broadcast #1 — "The shop's been open" (send Sun Aug 9)

**Subject:** I should have said something sooner
**Preheader:** The shop is open. Here's your code.

> Hi — it's Ayla.
>
> I've been quietly sewing, and somewhere in there the shop opened and I never properly
> told you. So: **the shop is open.** Every ready-made piece on the site can be ordered
> today.
>
> Your Nest discount is **NEST10** — 10% off, at checkout.
>
> One thing I should explain, because it changes how you shop here. Almost everything I
> make is **one of a kind**. Not "limited edition" — there is one, I sewed it, and when
> someone takes it home the listing goes dark. The Sunflower Tote went last week. It
> isn't coming back.
>
> → [See what's still here](https://www.dragoninkandthread.com/shop.html)
>
> And on **August 15**, something new: custom orders open. You'll be able to ask me for
> a piece that doesn't exist yet. More on that soon.
>
> — Ayla

### New: Broadcast #2 — Custom orders open (send Fri Aug 14 evening)

**Subject:** Tomorrow, you can ask me for anything
**Preheader:** Custom orders open in the morning.

Short. Explain what custom covers (your print, your dimensions, a favorite piece
recreated), what it costs (a range), and how long it takes. One CTA to the contact form.

### New: Basket-abandoner segment

`wireNestForm()` already tags signups **`hero`** vs **`checkout`**. The `checkout` tag =
someone who got to the cart and didn't finish. That segment deserves its own send:

**Subject:** Still thinking about it?
> No pressure — but the piece you were looking at is one of one, and I can't promise
> it'll be there next week. `NEST10` still works.

Send ~72h after signup, to the `checkout` tag only.

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

| Time | Action |
|---|---|
| 8:00a | **Email Broadcast #3** to the Nest: custom orders are open. |
| 9:00a | **IG post + TikTok** — the announcement. Explain custom in plain words. |
| 9:15a | **IG Story series** — 5 frames: what custom means, examples, price range, turnaround, how to ask. Link sticker → contact form. |
| Midday | Story: answer the questions coming in, publicly. Q&A *is* the content. |
| 3:00p | **TikTok #2** — a process video framed as "this is what your custom piece looks like being made." |
| 7:00p | Story recap + a nudge: "asks are open all weekend." |
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

| Priority | Item |
|---|---|
| **High** | **Custom orders intake — BUILT 2026-07-30, not yet deployed.** `custom.html` + `js/custom.js`: explainer, what-I-will/won't-take, full terms (totes $50–100, bows $10–15, scrunchies $6–12, $25 minimum, 10–14 day make time plus shipping), and a request form on its own Web3Forms subject line, gated until Aug 15 (it opens itself — no deploy needed on the day). **Complete — the only thing left is pushing it.** |
| **High** | Load the **rewritten welcome sequence** into Buttondown — new subscribers currently get silence. |
| **High** | **Back-fill pre-2026-07-10 subscribers** out of Gmail. Web3Forms drops free-tier submissions after 30 days; those people exist nowhere else. |
| Low | Bows stay capped at **1 per order** (decided 2026-07-30 — they're one-of-a-kind like the totes). Noted so it isn't reopened. |
| Medium | `js/main.js` still holds a vestigial `PRODUCTS` copy with the **old $4/$9 scrunchie prices** (10 stale lines). It's unused — the homepage has no `.card-variant` — but it's a live trap for the next person who edits the wrong file. Prune it. |
| Medium | `shop.html` is **missing from `sitemap.xml`** (only `/` and `custom.html` are listed). The full catalog is the page most worth indexing. |
| Medium | `shipping.html` says nothing about **custom-order turnaround**, though `custom.html` links to it for returns. |
| Medium | Add `aggregateRating` to the JSON-LD now that 3 real reviews exist — it's the rich-result win, and the reviews are already there. |
| Medium | The **founder photo** is a phone selfie. The story pillar leans hard on her; a real shot of her at the machine is the single best photo investment available. |
| Medium | Write the **post-purchase insert** copy down in the repo. |
| Low | Prune the vestigial `PRODUCTS`/`VARIANTS` in `js/main.js` so product edits can't drift from `js/shop-data.js`. |

---

## 13. Ready-to-post captions

Copy-paste. Swap the hashtag block per §6.

**Strawberry Tote v2 (Jul 30)**
> I made a strawberry tote once. It found a home, and I missed it.
>
> So I made another — not a copy. A knot-style tote this time, wild strawberries and
> trailing vines on cream, fully lined, roomy enough for a hardback and everything else
> you're carrying.
>
> There's one. $35. When it goes, it goes. 🍓

**Sunflower sold out (Aug 2)**
> The Sunflower Tote found a home this week.
>
> I hand-wove those panels square by square — sunflowers, honeycomb, tiny bees. It took
> longer than it should have and I loved every hour of it.
>
> It isn't coming back. That's not a sales tactic, it's just how this works: I make one,
> and then it belongs to someone. Its story moves over to the Stories page, and I start
> the next chapter.
>
> Six pieces still on the shelf. Link in bio. 🌻

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
> book bag check 🦋 lily-of-the-valley tote, current read, and a scrunchie I refuse to
> take off. tell me what you're reading and I'll tell you which tote it belongs in.

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
