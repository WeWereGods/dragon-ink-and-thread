# Tasks — Dragon Ink and Thread

Working list. Tick things off, delete them when they're stale, add as you go.
**Last reviewed: 2026-08-18.**

Two rules that keep this useful:
- **Dates are absolute** ("Aug 9"), never "next Sunday" — this file outlives the week it was written in.
- **If it's owed to a customer, it goes at the top.** Everything else can slip.

---

## 🔴 Owed — money already taken

> ### 📅 The week ahead (rolled forward 2026-08-18, Tuesday morning)
>
> | Day | Available | What it's for |
> |---|---|---|
> | ~~Wed 12~~ | ✅ done | Linda's tea cover **delivered** · her quilt patch **sewn** |
> | ~~Thu 13~~ | ✅ done | Maurya's tote **CUT** · Aubrea told · a lot of site work shipped |
> | ~~Fri 14 – Sun 16~~ | ✈️ away | Away banner ran itself; switches off at midnight tonight |
> | ~~Mon 17~~ | ⚠️ fragmented | Car repair · realtor · school run. ✅ **Aubrea's fabric ARRIVED.** Toffee Windowpane retired. |
> | ~~Tue 18~~ | ✅ **made + shot** | **Maurya's wheelchair tote COMPLETE**, photographed (6 frames). Worker deployed. ⚠️ **Photos still need to reach `assets/`.** |
> | **Wed 19 — TODAY** | ✅ **the clear day** | **Linda's quilt handover** (binding checked ✅) + the wall-hanging talk · **Aubrea's clips — DO THEM TODAY** · reshoot the tote in daylight |
> | **Thu 20** | ⚠️ **now has an errand in it** | **Maurya's drop-off — moved here at HER request** · packing for the flight · clips only if Wed failed |
> | **Fri 21 – Mon 24** | ✈️ **AWAY — and the trip IS the delivery** | Flying **to Aubrea**; her clips travel in the bag. Nothing else moves. Banner + pickup label handle themselves. Back at the machine **Tue 25**. |
> | **Tue 25 — first day back** | ⛔ **one thing is OWED** | **↩️ RESTORE THE SURIEL SET** (pulled for the trip, not retired) · then the run-up to the push |
> | **Wed 26 – Fri 28** | ✅ | Sew the game-day bows · the run-up to the push |
>
> **Tue 18 – Thu 20, the last working run before the trip. Sequenced 2026-08-18:**
> 1. ✅ **TODAY — Maurya's wheelchair tote is COMPLETE.** Drop-off this evening; that closes her
>    $97.43 order, a day inside the Aug 17–19 window.
>    🚨 📸 **LAST CHANCE FOR THE PHOTOS — it leaves the house tonight and does not come back.**
>    §8 and §10 of `marketing/campaign-2026-08.md` are written around a real finished custom
>    piece, this is the only one that exists, and after this evening it is gone. **Ask Maurya
>    before publishing anything of her order — and ask for a photo in use and a review too.**
> 2. **Wed 19 — Linda's quilt handover.** ✅ Binding checked either side of the patch. Tell her
>    the tea cosy is in Stories, and see her entry: the wall hanging is the natural conversation
>    to have while the mended quilt is in her hands.
> 3. ✈️ **Aubrea's clips — WED 19, not "Wed or Thu".** Hand-delivered now, not posted.
>    ⚠️ **Thursday stopped being a spare evening on 2026-08-18**: Maurya's drop-off moved onto it
>    at her request, and Friday is a flight, so Thu 20 now holds an errand out of the house *and*
>    packing. **Treat Wednesday as the plan and Thursday as the buffer** — the other way round and
>    a late clip delivery collides with everything at once.
> ✅ **THE THURSDAY POST OFFICE DEADLINE IS GONE.** It was the hard edge of this week: Aubrea is
> in California, the trip runs Fri 21 → Mon 24, and anything not posted by Thu 20 wouldn't have
> moved until Tue 25. Flying to her removes the errand entirely — **no business-hours post office
> trip on a fragmented week, no postage, no tracking, and she gets them by hand.**
> ⚠️ **The deadline moved, it didn't vanish.** The clips must be **finished and packed before the
> flight**, so the real cut-off is Thursday night rather than Thursday's counter hours — about a
> day of extra slack, and it's *evening* slack, which is the kind this week actually has. **Miss
> the flight and carrying them does NOT rescue the slip**: they don't post either, so it's Tue 25
> and California around Aug 27–29 — the exact same week's slip the Thursday deadline existed to
> prevent. The penalty is unchanged; only the errand went away.
> 📮 **Tell Aubrea.** She has been told a parcel is coming and roughly when; she'll be watching
> for a post date and tracking that will never arrive. One line.
>
> ### ⛔ TUE 25 — do this before anything else
> **↩️ Restore the Suriel set.** It was pulled on 2026-08-19 for the trip, **not retired**, and
> a temporary pull nobody reverses is just a listing quietly lost. It is the shop's only $55
> item and it is unbuyable until this is done.
> **Four reversals, all together, then deploy:**
> 1. Uncomment the `LINKS` entry in **js/shop-data.js**
> 2. Uncomment the `PRICES` entry in **worker/checkout-worker.js**
> 3. **index.html** Bows block → `offerCount` back to **13**, `highPrice` back to **"55.00"**
> 4. `node tools/build-products.js && node tools/build-catalog.js && node tools/bump-assets.js`,
>    commit, push — then **`wrangler deploy` from `main`, after pulling**
> 💡 **If the game-day bows are sewn by then, merge `gameday-bows` FIRST and do ONE deploy for
> both.** Reconcile `offerCount` in one go — 13 restored + Autumn Court = **14**.
> ✅ **Verify on the site, not against the Worker** — the card should read "Add to cart" instead
> of "Coming soon". That's free and it's enough. ⚠️ **Restoring inverts the cheap test**: it was
> the *rejection* that cost nothing, and after the restore a POST to the Worker **succeeds** and
> mints a real Stripe session. Only do that if the card looks wrong, and log the session next to
> the recovery figures if you do.
> Full context in the 🔁 entry further down.
>
> ✈️ **The trip is CONFIRMED: Fri 21 → Mon 24, back at the machine Tue 25.** It was floated as
> Thu–Sun, cancelled, then re-confirmed with different dates inside an evening — which is exactly
> why nothing about travel goes on the site until it's certain. Nothing had to be retracted.
> ✅ **Both halves are LIVE** — `AWAY` in js/dates.js pushed, and `wrangler deploy` run
> 2026-08-17 for the Worker's local-pickup label. The banner and the label switch themselves on
> Friday and off Monday night. **Nothing further to do.**
> 📌 **Checking it today shows nothing, and that's correct** — the pickup option reads normally
> until the window actually opens on Friday.
> ⚠️ **Mon 24 is NOT a working day.** So the week is **Mon 17 – Thu 20, then Tue 25 – Fri 28** —
> and the first of those is the only clear run before the push. Maurya's tote footage belongs in
> it, because §8 and §10 of the campaign are still written around proof that doesn't exist.
>
> 📣 **Two live pieces have never been announced** — The Suriel Tea Cover ($35) and the Quilted
> Court Bandana ($22). The Quilted Court's copy is the last unwritten item in "Ready to go".
> Posting doesn't need you at the machine; replying does, so post early in the day.
>
> **The durable lesson, now FIVE for five: a quote of 10–14 days assumes the materials are already
> in the house.** Maurya's fabric, Aubrea's fabric, Linda's ticking, Maurya's batting — and, as of
> 2026-08-18, **Aubrea's CLIPS**, which is the first time it's been hardware rather than cloth.
> **Batting, interfacing, binding, thread — and clips, rings and fasteners — block a job exactly
> as hard as the print does.** Either quote from the date materials are expected, or don't start
> the clock until they're in hand.
> 🔁 **The counter-move is proven twice now: build everything the missing part doesn't block.**
> Maurya's tote was cut before the batting landed and made its window; Aubrea's bows are being
> sewn before the clips land. In both cases the delivery meets a half-built job instead of a
> standing start.

- [ ] **Linda — tea cover + quilt mending. $105 PAID, BOTH local pickup (San Antonio).**
      Agreed 2026-08-10, quoted **7–14 days → due Aug 17–24**. **The quilt is already in hand.**
      - [x] **Tea cover, $30 — DONE AND DELIVERED 2026-08-12.** Bound and handed over, five days
        inside the Aug 17–24 window and before the trip rather than after it.
        ✅ **IN STORIES 2026-08-13 — "Midnight Garden Tea Cosy"**, `PAST_MAKES` is now 13.
        Photographed in its branded box on the worktable, which is a better shot than a plain
        product one: the piece finished and about to go to its person.
        ⚠️ **Tell Linda it's up** — same rule as Maurya's order. It's her piece.
        📝 **Note it went separately.** The plan on 2026-08-11 was that Linda wanted both pieces
        together, which is why the quilt was called the critical path for the whole $105. It
        didn't go that way, and that's fine — but it means **the quilt is now the only thing
        outstanding on this order**, and she has already had something in her hands, which buys
        patience the earlier plan didn't.
      - **Quilt mending, $75 — ✅ PATCH SEWN 2026-08-12, not yet delivered.** Before/after photos
        taken. The damage was a blowout at a four-seam junction near the quilt's edge — cloth
        gone to lint, batting out. **The repair is invisible in the wide shot**: the gingham and
        the cream-and-red ticking match the twenty-year-old originals in scale, colour and
        fade, which was the whole difficulty (the ticking was the last outstanding blocker on
        Aug 11 and reads woven/yarn-dyed, not printed).
        ✅ **Matched-light reshoot done 2026-08-13 and LIVE on custom.html** as the before/after
        under the repairs line. The patch can't be picked out of it, the ticking stripe runs true,
        and the loft is even where the hole was.
        ✅ **BINDING CHECKED 2026-08-18** either side of the patch — the last thing that stood
        between this and handover. **Handover is Wed 19**, which closes Linda's $105 order
        (the tea cover went separately on Aug 12).
        *Why it mattered:* the damage is at the EDGE, which takes far more handling than the
        middle — dragging, tucking, pulling up — so this patch gets stress-tested harder than a
        central one would.
        ❓ **One detail still unrecorded: was the ticking harvested from the quilt itself, or
        bought new?** Obvious today, gone in a month — and it matters, because bought-new cotton
        needed a hard pre-wash before cutting (the quilt finished shrinking decades ago; skip that
        and Linda's first wash puckers the patch). Harvested cloth needs none of it, which is why
        it was the better option.
      - ⚠️ **CORRECTION 2026-08-13: the wall hanging is NOT this patchwork quilt.** It was logged
        here for a few hours as "Linda wants the mended quilt hung", which was a misreading.
        **Linda is the memory-piece customer** — the wall hanging is a NEW piece to be made from
        her husband's suit, and it lives in its own entry further down. The two got conflated
        because "the quilt" meant this one in every earlier sentence.
        Two things that misreading produced, both now void:
        - There is **no whole-quilt-vs-cut-it-down question** about this quilt. **Nothing is
          being done to it.** It is repaired and awaiting handover, unchanged.
        - **Today's Facebook post is TRUE and needs no edit.** It was flagged as having gone
          stale ("it's back on a bed instead") purely on the bad assumption. Leave it alone.
      - ⚠️ **It is SOMEONE ELSE'S QUILT and it is in the house.** That's different from every
        other job here — the others are her own fabric, and a mistake costs materials. This one
        is likely irreplaceable to Linda and probably has history. Keep it stored away from the
        cutting table and pets, and photograph its condition **before** starting, so there is a
        record of what it looked like when it arrived.
      - ✅ **Quilt repair IS a product category now.** It was quoted ad hoc here, then banded on
        2026-08-11 (**from $40, no ceiling**), advertised in the mending post on 2026-08-13, and
        this job's before/after is the proof image on custom.html. The "decide before advertising
        it" note is spent.
- [ ] **Maurya Buchanan — Wheelchair Quilted Tote + Custom Tote**, both in *Nesta's Cats*.
      ✅ **WHEELCHAIR TOTE COMPLETE 2026-08-18.** Both pieces are made; **drop-off is this
      evening** and then the order is closed.
      $97.43 paid 2026-08-05 (invoice `VBQJFYMO-0001`, $100 less $10 for the pair, plus tax).
      Terms are 10–14 days from acceptance → **due ~Aug 15–19**. She's local (San Antonio).
      **Delivered Aug 18, a day inside the window** — and that window survived a fabric delay,
      a batting delay and a three-day trip. The thing that saved it was cutting on Aug 13 while
      the batting was still in transit, so the delivery met a half-built tote instead of a
      standing start.
      - **2026-08-09: she replied and loved the first tote.** Approved, so the **wheelchair tote
        is now the live piece of work** — the only thing left on this order.
      - ⏳ **BATTING CONFIRMED FOR MID-AFTERNOON 2026-08-13** (1–3 hours out, told ~14:20 local).
        Fabric arrived Aug 11; the batting turned out not to be on that list.
        ✅ **CUT 2026-08-13, before the batting arrived** — so the delivery is followed by
        quilting and assembly rather than a standing start. **Straps, chair ties, pocket bags and
        the lining can all still be sewn while waiting**; only the quilted panels actually need
        the batting.
        ✅ **No message to Maurya needed.** The "propose Aug 19" trigger was for the batting
        missing today entirely. Prep this afternoon → quilt tonight if it goes well, Monday
        morning if it doesn't. **Both land inside her Aug 17–19 window.**
        📸 **FILM THE PREP — it solves post 7 at zero cost.** Cutting, the machine running,
        pressing seams *is* the footage; §6 of the campaign calls process content the
        highest-performing thing for handmade by a wide margin. Post 7 has wanted tote footage
        for two days and had none, and the batting-free half of the job is the photogenic half.
        ⚠️ **Aug 17–19 now holds all three remaining jobs** — this tote, Aubrea's clips and
        Linda's handover. It was tight before the batting; it is tighter now.
      - ~~📸 **Film the prep / shoot it Thursday.**~~ Overtaken — it's finished. The process
        footage §6 of the campaign wanted is whatever was captured along the way; **the finished
        piece is the shot that still has to be taken, and the window is now.**
      - [x] ✅ **TOTE FINISHED 2026-08-18.** ⚠️ **DROP-OFF MOVED TO THU 20 AT MAURYA'S REQUEST**
        (2026-08-18). **RECORD THAT IT WAS HER CALL, NOT A SLIP** — Thu 20 is one day outside
        the Aug 17–19 window, and in a month this entry is all anyone will have to tell a
        customer-requested reschedule from a missed deadline. **The piece was done on the 18th,
        inside the window, and offered.** Nothing was late.
      - [x] ❌ **RESHOOT NOT HAPPENING — packed 2026-08-19.** Briefly possible when the drop-off
        moved to Thu 20, then closed when the tote was packed. **Don't reopen it**: unpacking a
        finished quilted tote to chase a better frame risks creasing it, on a day that already
        holds a drop-off and packing for a flight. **The six frames below are final** — the
        backlit pair, the soft tie close-up and the missing interior are permanent for this piece.
        ➡️ **This is what makes Maurya's in-use photo load-bearing rather than nice-to-have** —
        it is now the ONLY remaining route to an image that says *wheelchair* rather than
        *dining chair*, which is the whole of §8's argument. **Ask her properly on Thu 20.**
      - [x] 📸 **PHOTOGRAPHED 2026-08-18 — six frames.** Flat lay on pine
        (quilting sharp), two front-on on a chair back showing the ties bowed over the top rail,
        a tie close-up, and two hanging from the long strap with the dark lining visible.
        **Hero = the strap shot** (best light, shape and depth both read). **Craft shot = the flat
        lay** (only frame where the diamond quilting is genuinely sharp).
        ⚠️ **Known weaknesses, recorded so they aren't rediscovered:** the two front-on frames are
        **backlit** — window behind the chair, so the bag sits a stop dark and the print muddies;
        the tie close-up is **out of focus on the near bow**; and **nothing shows the pocket bags
        or the interior**, which was on the shot list and is the detail that reads as *considered*
        rather than merely *sewn*.
        ⚠️ **THE SIX FRAMES COVER BOTH TOTES, NOT ONE** (see the correction below) — so the
        wheelchair tote actually has FEWER usable frames than the count suggests. Its
        distinguishing feature, the **four ties that fasten it to the handle**, is visible, which
        is the important part.
        🚨 **THE REAL GAP: none of these say WHEELCHAIR — they say dining chair.** That was what
        was available, and it is not a criticism of the photos, but §8 of
        `marketing/campaign-2026-08.md` leans on the wheelchair *specifically*, because that is
        what makes the made-for-you argument unanswerable. A tote tied to a kitchen chair is just
        a nice tote. **So Maurya's in-use photo is no longer a nice-to-have — it is the shot the
        push actually needs**, and nobody else can take it.
      - ❌ **VOID — "it works two ways" was WRONG (corrected by the owner 2026-08-19).** The
        six frames are **TWO DIFFERENT TOTES**, not one dual-mode one:
        - **The WHEELCHAIR tote** — the frames showing it tied to a chair back. **FOUR ties**
          that fasten it to the handle (not the two bows visible at the top of the frame).
        - **The TRADITIONAL tote** — the frames showing it hanging from a single long strap.
          This is the first piece of her order, approved back on Aug 9.
        ⚠️ **Do NOT write "comes off the chair and goes with you" anywhere.** It was inferred from
        photos of two objects and it is not true of either. It had been queued for the custom copy
        and the Aug 29 push.
        📌 **The durable lesson: never derive a product FEATURE from photographs.** Dimensions,
        construction and how a thing attaches come from the maker, full stop. A photo is evidence
        that something exists, not evidence of how it works.
        ✅ **FLAT LAY = TRADITIONAL, confirmed by the owner 2026-08-19.** So the split is 3 / 3:
        - **TRADITIONAL (3):** flat lay + both long-strap frames.
        - **WHEELCHAIR (3):** the two front-on chair-back frames + the tie close-up.
        🚨 **BOTH FRAMES PICKED AS KEEPERS ARE THE TRADITIONAL TOTE.** The "hero" strap shot and
        the "craft shot" flat lay are the wrong piece. **The wheelchair tote — the one §8 and §10
        of the campaign are built on — has exactly three frames, and they are the three with
        problems: two backlit and one out of focus.** There is no good photograph of the piece the
        push depends on, and the tote is packed.
        ➡️ **Maurya's in-use photo is now essential, not merely load-bearing.** It is the only way
        the push gets a usable image of a wheelchair tote. **Ask for it on Thu 20 as a specific
        request** — one photo of it on her chair — rather than a vague "send me a picture
        sometime". If she says no, §8 needs rewriting around the traditional tote and the
        custom-process story instead, and that is better known before the 29th than during it.
        ⚠️ **Ask Maurya before publishing anything of her order** — Thu 20, while she's in front
        of you and pleased. **Ask for two other things at the same time**: a photo of it in use
        (see above — this one matters), and a review. She is the shop's third custom customer and
        there is no review of a custom piece from a *local* customer anywhere on the site.
        📌 Then **Stories** — a finished wheelchair tote belongs in `PAST_MAKES` (currently 15),
        with her permission and tonight's photos.
- [ ] **Aubrea Pritt — 3 custom bow clips. Fabric IN HAND (Aug 17); HAND-DELIVERED, not posted.**
      $36 paid 2026-08-05 (invoice `85VBHJQE-0001`). Oakdale, **California**.
      ✈️ **CHANGED 2026-08-18: the owner is flying to Aubrea on the Aug 21–24 trip and taking the
      clips with her.** Everything below that talks about posting, post dates and tracking is
      superseded — kept because it's the record of how the date moved three times, not because
      any of it is still the plan.
      ⚠️ **AUBREA PRITT AND "BREA P." ARE THE SAME PERSON** (confirmed by the owner 2026-08-13).
      She is the Strawberry-Tote-and-scrunchie five-star review in `TESTIMONIALS` — the one
      carried in the Totes `aggregateRating` markup — **and** this custom customer. Two names for
      one person across TASKS.md, TESTIMONIALS and the campaign file. **Don't count her twice**
      when counting customers; her shop order and her custom order are two transactions, not two
      people.
      ⭐ **She is also the second proof of the same pattern: the small first sale is the
      audition.** She bought a tote and a scrunchie, left a five-star review, then commissioned
      custom work. Linda did the identical thing from the other direction — a $30 tea cover and a
      $75 repair, then a **$1,100** commission. **Both of the shop's repeat customers converted
      from a small first purchase into custom.** That is the strongest argument the Aug 29 push
      has, it is evidence rather than assertion, and nothing in the campaign copy uses it yet.
      - ⚠️ **2026-08-13: the fabric now arrives AFTER the trip.** That is the **third** revision
        (Aug 14–19 → Aug 13–15 → post-trip), and it settles the question — nothing can be sewn or
        posted before Mon 17.
      - **Realistic chain: sewn Mon 17, posted 17–18, arriving California ~21–23.** Clips are
        quick; the work was never the problem.
      - [x] 📮 **TOLD HER 2026-08-13 ✅** — sent before the trip, which is the whole point. She
        already knows about the earlier
        delay and was fine — and that is precisely because she was told early rather than left to
        wonder. A third slip discovered by silence reads completely differently from a third slip
        she was walked through.
      - ~~⚠️ **These POST to California — they aren't collected.**~~ **VOID 2026-08-18 — they're
        being carried.** The whole postal chain this entry was built around (post by Thu 20 or
        slip to Tue 25, arriving 27–29) no longer applies.
      - ⏳ **2026-08-19 midday: CLIPS STILL NOT HERE.** Sewing continues in the meantime, which is
        right — but the margin is now one day, and **Thu 20 already holds Maurya's drop-off and
        packing for a Friday flight.**
        🔧 **SETTLE THE SPARE-CLIP QUESTION TODAY.** Every shop bow is on a slide-in clip; if
        there are spares in the house this is a preference, not a blocker. Asked 2026-08-18 and
        still unanswered — **Thursday evening is the wrong time to find out the answer is no.**
        📦 **Check the tracking now, not tomorrow.** "Due Wednesday" with nothing by midday is
        worth knowing while there are still two days of options rather than one.
      - 🔨 **BOWS BEING SEWN 2026-08-18 (evening).** ⚠️ **THE CLIPS ARE ON ORDER — due Wed 19.**
        So the bows get made tonight and **Wednesday is assembly, not a standing start** — the
        same trick that saved Maurya's tote when her batting was late. Sequencing is right.
        ⚠️ **FIFTH TIME, and the SECOND on this one order.** Maurya's fabric, Aubrea's fabric,
        Linda's ticking, Maurya's batting — and now **hardware**. The lesson below says batting,
        interfacing, binding and thread block a job as hard as the print does; **clips, rings and
        fasteners belong on that list.** Aubrea's fabric slipped three separate times, so
        "arrives tomorrow" on this order carries a history.
        📦 **Check the tracking on Tue 18, not on Wed 19.** A delay found tonight leaves Wed AND
        Thu to work with; found Wednesday evening it leaves one day before a flight.
        🔧 **FALLBACK WORTH CHECKING BEFORE IT'S NEEDED: are there slide-in clips already in the
        house?** Every bow in the shop is on one (decided 2026-08-07). If there are spares, this
        is a preference and not a blocker — owner's call on whether they match what Aubrea
        expects.
      - ✈️ **New chain: bows Tue 18, clips Wed 19, assembled Wed–Thu, packed before the flight,
        in her hands Aug 21–24.** Previously stated as:
        That is at worst the same as the posted estimate she was given and at best three days
        earlier, with no carrier in the middle of it.
      - ⚠️ **The remaining risk is packing, not postage.** They must be **finished and in the bag
        before the flight** — that's the deadline now. If they miss it they don't post either;
        they'd wait for Tue 25 and land Aug 27–29, which is the week's slip the old Thursday
        deadline existed to prevent. **Sew them first, ahead of the wheelchair tote**, since the
        tote's customer is local and can absorb a day where Aubrea can't.
      - [x] 📮 **TOLD HER 2026-08-18 ✅ — texted.** She'd been told to expect a posted parcel
        arriving ~Aug 21–23, so she was waiting on a post date and tracking that were never
        coming. Sent as a text rather than an order email: she's the owner's sister, and the
        `emails/order-updates.md` register would have read strangely.
        ⭐ **Fourth time she's been kept ahead of a change rather than left to notice one** —
        which is exactly why three slips on this order have cost nothing.
      - 📌 **Postage saved, and no post office errand** on a week that had a car repair, a
        realtor and a school run in it.

---

## 🟠 Dated — this week

- [ ] 🔄 **LINDA — HEIRLOOM MEMORY WALL HANGING from her husband's suit. BACK ON 2026-08-13.**
      📅 **WED 19 IS THE CONVERSATION.** The mended quilt is handed back that day, so she is in
      the room, holding the proof, with the $650–750 piece open between you — and there is a
      short list here that can only be settled in person: **read the content labels** in the
      jacket and trousers, **count the shirts** (the brief said shirts plural; one was
      photographed), say the **moths** and **UV** warnings out loud, and — the awkward one —
      tell her **the reference image cannot be made from four garments** before anything is cut.
      None of that survives being emailed as well as it survives being said. **Take the garments
      out while she's there.**
      ⚠️ **The memory-piece customer is LINDA** — the same customer as the tea cover and the quilt
      repair, not a separate enquiry. Logged as anonymous for a day and corrected 2026-08-13.
      She withdrew in the morning on the wool (can't be machine washed) and returned the same day
      wanting it **hung rather than used**, which makes the entire objection irrelevant.
      💷 **This makes Linda comfortably the shop's biggest customer**: $30 tea cover + $75 quilt
      repair already paid, and a **$650–750** commission on the table. That is more than every
      other custom order this month put together.
      ⭐ **AND IT IS THE $75 REPAIR THAT EARNED IT.** She handed over a family quilt with a hole
      in it, got it back invisibly mended, and then trusted the same hands with her husband's
      suit. **The small job was the audition.** Worth remembering next time a $40 mend looks like
      it isn't worth the afternoon — and it is the single best argument for the mending post that
      went live today.
      **Garments photographed 2026-08-13:** a **Hugo Boss** suit jacket (label inside the pocket),
      matching trousers, a **Geoffrey Beene** dress shirt, and a cream pocket square. Charcoal,
      grey, cornflower blue and cream — a genuinely good palette, which is not a given here.
      ✅ **THE DISCLOSURE DIDN'T COST THE ORDER, IT RESHAPED IT.** Wool suiting was always a poor
      choice for a washable bed quilt and a good one for a wall piece. Telling her the truth in
      the morning is what found the right product by the afternoon. **custom.html now says so**
      — the wool line offers the wall-hanging route instead of dead-ending.
      ⚠️ **STILL READ THE CONTENT LABELS** in the jacket and trousers. Less critical now that
      washing is off the table, but it decides how the piece behaves — how much it will sag hung,
      how it presses, and whether the "wool" framing is even accurate.
      ### What changes now it hangs instead of covers
      - ✅ **The yardage risk largely goes away.** A wall hanging is far smaller than a 50×60
        throw, and the earlier worry was that one jacket, one pair of trousers and one shirt gave
        ~3–4 yd usable against the 3+ a throw needs, with no margin. At wall size there's room.
        **Still confirm how many shirts exist** — the original brief said shirts, plural; one
        was photographed.
      - ⚠️ **The precision bar goes UP, not down.** A throw is used and forgiven; a wall hanging
        is looked at from eighteen inches, on a wall, forever. Every seam intersection that
        doesn't meet is permanent and visible. **It must be blocked square** — wonk never shows
        on a bed and is glaring on a wall.
      - ⚠️ **Wool hung vertically sags over time under its own weight.** Interface everything
        (already the plan), keep it modest in size, and use a **full-width hanging sleeve, never
        corner tabs**. For a smaller piece, **mounting on a stretched frame is worth offering** —
        for heavy wool it beats a sleeve outright.
      - **BACKING: always.** It hides the seam allowances, interfacing and the back of the
        appliqué, it is what the hanging sleeve attaches to, and it carries the label. Plain
        cotton in a tone that sits with the greys.
      - **BATTING: low-loft cotton, or cotton FLANNEL instead of batting entirely.** Asked
        2026-08-13, and the answer is thinner than instinct suggests:
        - **Weight is the enemy** — wool suiting is 9–12oz before every piece gets interfaced,
          and this hangs off a sleeve for decades without being allowed to elongate.
        - **A wall piece wants to hang FLAT.** Loft puffs and waves; on a bed that reads cosy,
          on a wall it reads badly made.
        - **The medallion has its own structure** — a jacket front keeps shaping even with the
          canvas out, and batting under it makes it puffier and harder to keep flat.
        - **It licenses sparser quilting**, which matters because dense quilting through
          interfaced wool is brutal on a domestic machine.
        ⚠️ **NOT polyester** — springy, adds unwanted loft, and it can beard through wool.
        ⚠️ **NOT wool batting**, which is exactly what someone would reach for on a wool quilt:
        **it doubles the moth risk** on a piece designed to hang undisturbed for years. No reason
        to feed that from the inside as well.
        **Flannel is the quiet answer** — body without loft, almost no weight, blocks dead flat.
      - 🛒 **Materials list for the 40×50 (she supplies):** ~4–5 yd lightweight woven fusible
        interfacing · crib-size (45×60) low-loft cotton batting **or** 1.6 yd cotton flannel ·
        backing 1.6 yd of 108″ wide, **or** 3.2 yd of 44″ seamed down the middle (44″ alone is
        too narrow for a 40″ piece plus overhang) · 0.5 yd for the sleeve, can come off the
        backing · 0.5 yd binding · 42″ dowel or flat rod · 50wt neutral thread.
      - ⚠️ **MOTHS. Say this out loud to her.** Wool, on a wall, undisturbed for years is exactly
        what moths want, and nobody thinks of it. It needs occasional inspection — and it is the
        one risk here that can destroy the piece after it's finished and paid for.
      - ⚠️ **UV.** Dark navy and charcoal will fade on a sunny wall, unevenly and permanently.
        Same advice as Linda's: a wall out of direct sun.
      - 📌 **A label on the back matters more here than on anything else** — whose clothes, and
        when. It is the entire point of the object.
      ### ⚠️ A REFERENCE IMAGE ARRIVED 2026-08-13 — and it does not fit the cloth
      Centre medallion of an intact jacket front with the shirt collar at the neck, surrounded by
      sashed sampler blocks: eight-pointed and sawtooth stars, half-square triangles, plus blocks
      preserving a shirt pocket, a cuff with its button, a placket and a welt pocket. Navy
      sashing throughout, dense allover quilting, **bed-sized** (shown covering a queen).
      ⚠️ **THERE IS NOT ENOUGH CLOTH IN THE FOUR GARMENTS TO MAKE IT.** Say this before anything
      else, because it surfaces mid-build otherwise:
      - The **cream** in those stars and backgrounds is 2+ yards. She has **one pocket square**.
      - The navy sashing runs through the whole quilt **and** the medallion is an intact jacket
        front. **One jacket cannot be both** — keep the front whole and the jacket is spent.
      - The blocks show many distinct blues and greys; there is one shirt and one pair of trousers.
      **So it needs bought-in yardage, which turns "made from his clothes" into "made WITH his
      clothes."** That is a real difference and it is hers to choose knowingly.
      ⚠️ **It is also a BED QUILT, not the wall hanging agreed this afternoon.**
      ⚠️ **It reads as a generated reference, not a photo of a real quilt** — nobody can be asked
      how it was done and parts may not be physically consistent. **Treat it as direction, draw
      an achievable version, get THAT signed off before cutting.**
      **Quoted three ways:**
      - **As shown, bed-sized:** 90–130 h → **$1,800–2,600**, 5–7 months. Not advisable.
      - **Wall size (~40×50), same character:** 60–95 h → **$1,200–1,600**, 12–20 weeks.
      - **Simplified — medallion + garment features, fewer and simpler stars:** 40–60 h →
        **$900–1,100**, 10–14 weeks. ⭐ **Recommend this one.**
      ⭐ **Why the simplified version is the better piece, not just the cheaper one:** the elements
      that will move her are the jacket front, the collar at the neck, the cuff and its button,
      the pockets — and those are the *cheap* part. The expensive part is a dozen pieced stars,
      which in interfaced wool suiting come out with **blunt points however well they are sewn**,
      because the seam allowances stack. She would pay several hundred extra for the one element
      most likely to disappoint.
      ⚠️ **The medallion is harder than it looks:** a tailored jacket front carries canvas, lining
      and shaped lapels built specifically NOT to lie flat. Getting it flat and stable is 8–14 h
      on its own.
      ⚠️ **The dense allover quilting shown is a longarm job** — brutal on wool through a domestic
      machine. **Many longarmers refuse garment quilts. Check before promising it.**
      ### Is it realistic? — three separate questions, three different answers
      1. **Is the TECHNIQUE real?** Yes. Jacket fronts kept as medallions, pockets and cuffs and
         plackets preserved as blocks — that is established memory-quilt practice, not fantasy.
         Pieces like this genuinely exist.
      2. **Is THAT IMAGE a real quilt?** Almost certainly not. The lapels lie impossibly flat, the
         collar is rendered with depth cloth doesn't have, and the quilting texture is too even.
         **Nobody can be asked how they did it, because nobody did.**
      3. **Is it realistic for THESE garments and THIS maker, now?** ⚠️ **The full version, no.**
         Not enough cloth (above), and 90–130 hours is 4–6 months of actual available capacity
         for one person sewing around a small child — with the wheelchair tote, Aubrea's clips
         and Linda's handover all landing Aug 17–20 and the Aug 29 push after. **It would also be
         her first garment memory piece**, on materials that cannot be replaced.
         ✅ **The simplified version, yes** — genuinely achievable and genuinely lovely.
      ⚠️ **So do not promise the image. Promise a drawing.** Sketch an achievable design, agree
      it, quote it, then cut. Committing to a picture that was never made is how a job ends with
      a customer comparing a real object to something that never existed.
      ✅ **THE DRAWING EXISTS: `designs/linda-memory-wall-hanging.png`** (source `.svg` beside it).
      40″ × 50″: jacket front kept whole as the centre medallion with the shirt collar set into
      the neck, trousers as the background field, three garment-feature blocks along the bottom
      (shirt breast pocket · cuff with his button · trouser welt pocket), four half-square
      triangles as the only piecing, cream pocket square as the single cream accent, jacket cloth
      as the border. **Every piece is his — nothing bought in**, which is the whole difference
      from the reference image and the strongest thing to say when showing it to her.
      **Send it, get a yes, then quote and cut.** ✅ **SENT TO LINDA 2026-08-13.**
      ### 📅 TIMELINE EXTENDED 2026-08-17 — ready Jan–Feb 2027
      The house is going on the market, and **Linda knows about the move and is understanding**,
      so the build gets another 2–3 months. 10–14 weeks from 17 Aug would have been late Oct to
      late Nov; **+2–3 months puts it at January–February 2027.**
      ✅ **The drawing has been reissued** (`designs/linda-memory-wall-hanging.*`) reading
      **$1,100 all in · ready Jan–Feb 2027**, with a line saying the extension is by agreement.
      ⚠️ **She holds the old one, which says 10–14 weeks.** Send the new one — a drawing with a
      date printed on it is a promise, exactly like the price was.
      ❓ **ASK WHETHER IT IS FOR A DATE — this is now urgent, not optional.** It was raised on
      Aug 13 and never answered. Jan–Feb clears Christmas entirely. If this was ever meant as a
      Christmas gift, or is tied to an anniversary or the date he died, **the extension breaks it
      and she needs to say so now**, while nothing has been cut.
      ⚠️ **DO NOT TAKE THE GARMENTS UNTIL AFTER THE MOVE.** A six-month build means his jacket,
      trousers and shirt sit in the house through packing, a van and possibly storage. They are
      irreplaceable and there is no version of losing or damp-spotting them that can be fixed.
      **Either leave them with Linda until the machine is set up again, or agree one box that
      never goes in the removal load.** This is the single largest risk the extension introduces
      and it is entirely avoidable.
      💷 **Deposit still 50% up front**, but the gap to delivery is now months rather than weeks —
      worth saying plainly so it doesn't feel like silence later. **Send her a photo at each
      stage** (garments laid out, blocks pieced, top assembled); it costs nothing and it is what
      makes a long wait feel like progress rather than a void.
      ### 💵 If SHE (the maker) buys the materials — asked 2026-08-13
      ⚠️ **THE DRAWING ALREADY SENT CARRIES "$900–1,100" AND DOESN'T SAY WHETHER MATERIALS ARE IN
      IT.** Linda may well read it as all-in. **So quote $1,100 ALL-IN** — the top of a band she
      has already seen, absorbing the supplies, with no number changing on her side. Raising a
      figure after sending a drawing with a figure printed on it is the one move that costs
      goodwill here.
      Materials at 40×50: interfacing ~$40 · batting or flannel ~$20 · backing ~$32 · binding,
      dowel and thread ~$28 = **$120–150**, call it **$170 loaded** for sourcing time, tax and
      the risk of buying wrong.
      ⚠️ **That leaves ~$930 of labour over 40–60 h = $15.50–23/hr.** Fine at the low hour count,
      thin at the high one. **So $1,100 holds for the design AS DRAWN only** — if it grows
      (bigger, more blocks, a fourth feature) that is a new quote, and say so when sending it.
      ✅ **Her buying is the better arrangement regardless**, and worth the margin: the wrong
      interfacing won't reveal itself until it's being pressed onto a dead man's jacket, and it's
      her name on the finished piece, not the shop Linda bought the supplies from.
      ⚠️ **Buy nothing until the deposit clears.** 50% of $1,100 is $550 and covers materials
      several times over, so there is no point at which she should be out of pocket.

      ### If she wants a harder design (asked 2026-08-13)
      ⚠️ **THE QUOTE FOLLOWS THE DESIGN, NOT THE OTHER WAY ROUND.** Agree a sketched layout
      first, then price it. Quoting "a memory wall hanging" and letting the design grow
      afterwards is the classic way a custom job goes underwater, and on irreplaceable cloth
      there is no renegotiating once it's cut. **A sketch she signs off on protects both of you.**
      - **Base — large simple blocks** (squares and rectangles, calm fields): 25–43 h →
        **$650–750**, as quoted.
      - **Moderate — smaller pieces, a simple repeating block** (nine-patch, rail fence, some
        half-square triangles), or **garment features worked in** as design elements: +8–15 h →
        **$800–950**.
      - **Difficult — pieced stars and points throughout, curved piecing, or appliquéd lettering,
        a monogram, his name and dates**: +20–40 h over base → **$1,000–1,400**.
      - **Art piece — an original designed composition, pictorial or portrait**: **$1,400+**,
        quoted per design. ⚠️ Honestly probably beyond a sensible first garment commission.
      ⚠️ **TIMING SCALES TOO.** 8–12 weeks covers the base. Difficult is 60+ hours and means
      **12–16 weeks**. Naming a price without moving the date is how the quilt band nearly went
      wrong; don't repeat it here.
      ⚠️ **WOOL SUITING FIGHTS INTRICATE PIECING — this is steering, not just pricing.** Thick
      seam allowances stack at every intersection, and pieced points come out blunt no matter how
      carefully they're sewn. A 1″ finished square in interfaced suiting is miserable work that
      looks worse than a 4″ one. **If she wants stars, appliqué them, or piece the points from
      the blue shirt cotton and keep the wool for the fields.**
      ⭐ **THE ANSWER SHE PROBABLY WANTS IS "MORE MEANINGFUL", NOT "MORE COMPLICATED".** Ask which
      she's actually after. **Working in the real pocket, the lapel, the buttons, the Boss label,
      a shirt cuff** costs far less than complex piecing and is worth immeasurably more to the
      person who has to look at it — a stranger sees clever patchwork, she sees his pocket.
      Wool reads as texture and depth: large calm fields with a few sharp accents (the cream
      pocket square, the cornflower shirt) will look better than busy geometry AND cost less.
      **Offer that before quoting $1,400.**
      ### The number
      **Quote $650–750. Hold the $650 floor.** Roughly 25–43 hours: deconstruction, cutting
      around darts and canvas, and interfacing barely shrink with size, so a smaller piece is
      ~70–80% of a throw's hours for ~58% of the area — plus blocking, squaring and the sleeve,
      which a bed quilt never needs. **It is smaller but held to a higher standard, and the
      published band says heirloom-from-clothing starts at $650. Don't undercut your own floor
      because the object got smaller.** Materials still hers; 50% up front; 8–12 weeks.
      📌 **Wall hangings have no band and no mention anywhere on the site.** ⚠️ This was briefly
      written up as "two requests in one day, a category knocking" — that was the same conflation
      error: **it is ONE request, not two.** One is an enquiry, not a pattern. Don't band it yet;
      band it if a genuinely separate customer asks. That restraint is the point of the rule, not
      an exception to it.

- [x] ~~❌ HEIRLOOM MEMORY QUILT — declined 2026-08-13 on the wool.~~ **Superseded above.** She
      withdrew once she learned a quilt pieced from wool suiting can't be machine washed
      afterwards. **No quote was ever sent and nothing was cut** — the disclosure worked exactly
      as intended, and the record of it is kept because the lesson stands regardless of the
      order coming back.
      ✅ **This is the disclosure working, not a lost sale.** TASKS.md said to tell her before she
      agreed rather than on handover, precisely because "a customer who learns that at the end
      feels sold something." The alternative outcome was 40 hours in, with a husband's jacket
      already cut into pieces that cannot be un-cut, and a customer who didn't want the result.
      **Losing it in a conversation is the cheapest possible way to lose it.**
      📌 **The lesson, and it changed the site (2026-08-13):** washability was the deal-breaker,
      and custom.html didn't mention it — the quilt band went up on Aug 12 saying "heirloom
      quilts from clothing, from $650" and nothing else, so the next person would have spent the
      same conversation reaching the same dead end. The bullet now separates the two cases:
      **cotton garments (shirts, T-shirts, denim) wash normally; wool ones don't.** That is a
      real distinction, not a warning — most memory quilts are T-shirt quilts, and those are
      completely unaffected. Written to self-select before either side invests time.
      ⚠️ **The published band STAYS.** It was put up so a number couldn't be invented under
      pressure, and that holds whether or not this particular order happened. Don't unpublish it.
      ~~🆕 HEIRLOOM MEMORY QUILT — enquiry live 2026-08-12, nothing quoted yet.~~ Throw size,
      pieced from **her husband's wool sports jacket, his wool trousers, and cotton/poly-blend
      shirts**. This is the hardest and highest-stakes thing anyone has asked for, and there is
      **no published band for quilts** — the exact gap that had Linda's tea cover and quilt repair
      invented under pressure a week ago. Second quilt job in two weeks; that stops being a
      one-off.
      ### ⚠️ It is irreversible, and the cloth is finite
      - **Photograph every garment before a stitch is unpicked**, same rule as Linda's quilt but
        harder — that one has to survive, this one has to be *cut up*. Once the jacket is cut
        there is no more jacket.
      - **Ask what she wants kept whole.** A breast pocket, one sleeve, the collar, the maker's
        label inside the jacket. Ask BEFORE cutting, not after; it cannot be undone.
      - **Inventory the usable yardage before designing anything.** A tailored jacket yields far
        less than it looks: the fronts are backed with canvas, there's lining, shoulder pads,
        darts, buttonholes and pockets to work around — realistically ~1–1.5 yd equivalent in
        awkward shapes. Trousers give two good leg panels. **A 50×60 throw needs ~3+ yd of usable
        cloth.** ⚠️ **There may genuinely not be enough**, and finding that out mid-build is the
        worst possible time. Lay it all out first.
      - **Dry-clean the garments before cutting.** They've been worn, and it settles any shrinkage
        before the pieces are locked into seams.
      - **Keep the buttons, labels and a working pocket in the design.** That is the difference
        between an heirloom and a blanket, and it costs almost nothing.
      ### ⚠️ The technical problem: wool and poly-cotton do not behave alike
      Suiting wool is heavy, drapey and ravels; shirting is light, stable and thin. Put them in one
      top untreated and the seams pucker and the quilt hangs crooked.
      - **Fusible interfacing on the back of EVERY piece** is the standard fix and the single most
        important step — it equalises the weights, stops the stretch and stops the ravelling, and
        makes garment cloth behave like quilting cotton. Budget 6–8 yd of it.
      - ⚠️ **Test the fusible on a hidden scrap of the wool first** (inside a seam allowance or
        hem). Too much heat shines, scorches or shrinks wool, and poly-blend shirting can melt.
        Press cloth, low heat, test — on someone's husband's jacket there is no second attempt.
      - **Big simple blocks, not intricate piecing.** Thick wool at a busy seam intersection is
        miserable and bulky. **Press seams open**, not to one side.
      - ⚠️ **This quilt will NOT be washable** — mixed wool and poly can't go in a machine
        together. **Tell her that before she agrees, not on handover.** Linda's brief was "keep it
        usable"; this one's honest answer is spot-clean and air, and store it away from moths.
        A customer who learns that at the end feels sold something.
      - **Low-loft batting.** Wool suiting is already heavy; a lofty batt makes a throw nobody
        picks up.
      - **Quilting it will be the fight.** Bulky and uneven under a domestic machine. Straight-line
        quilting, big-stitch hand quilting or **tying** are all traditionally right for a wool
        memory quilt and dodge the bulk. ⚠️ **Many longarmers refuse garment quilts** — ask before
        assuming that's an option.
      ### The number
      Roughly **35–55 hours**: unpicking garments 3–6, interfacing 3–5, cutting around darts and
      pockets 3–4, piecing thick wool 12–20, quilting 8–15, binding 3–4. Materials are lighter than
      usual because she supplies the cloth, but interfacing, batting, backing and thread still run
      **$120–200**.
      ⚠️ **That puts an honest throw at $650–950**, and it should sit **above** a plain pieced
      throw, not below — the sentiment is exactly why it mustn't go wrong. **Do not discount it for
      being emotional.** The instinct will be to price it like a big tote; the tote band tops out
      at $100.
      ⚠️ **Turnaround: 8–12 weeks, not 10–14 days.** Aug 17–24 is already three customers deep with
      a possible second trip inside it, and this is 40+ hours of careful work.
      **Ask if it's for a date** — an anniversary, a birthday, a first Christmas without him. That
      single answer decides whether this is takeable at all.
      ⚠️ **Take a deposit**, 50% up front. Maurya, Aubrea and Linda all paid in full up front,
      which is fine at $36–105; at $650+ half-and-half is the normal shape. If she supplies the
      materials the outlay is near zero, so the deposit isn't covering cloth — it's covering 40+
      hours nobody else can use if she walks.
      ### If SHE buys the supplemental fabric (asked 2026-08-12)
      Labour only, materials stripped out: **$600–800. Quote $700 for a 50×60 throw, floor $600.**
      ⚠️ **Know what that rate is** — $700 over 40–50 hours is **$14–17/hr** on a job with
      irreplaceable materials and no second attempt. $850 is the fair number, $700 the sellable
      one against a $50–100 tote band. Fine to choose the sellable one; not fine to discover it at
      hour 45.
      ⚠️ **Better arrangement: SHE REIMBURSES AT COST, you buy.** Outlay is near zero either way,
      and the wrong interfacing (heavyweight, or fusible *web* instead of woven) will show in an
      heirloom carrying your name — discovered while pressing it onto a dead man's jacket.
      If she does buy, give quantities, not categories: **6–8 yd lightweight WOVEN fusible**
      (Pellon SF101) · **low-loft** batting 60×60+ (cotton or 80/20, never high-loft — the wool is
      heavy enough) · backing 3.5 yd of 44″ or 2 yd of 108″ wide (flannel is lovely here) · 0.5 yd
      binding, or cut it from leftover garment cloth · 1–2 spools 50wt neutral cotton thread.
      ~$120–170 retail.
      ⚠️ **Splitting the number can backfire.** "$700 plus you buy $150 of supplies" often reads
      worse than "$850, everything included" — the labour figure sits bare with nothing visibly
      attached. Reimbursement-at-cost lets her feel she's helping without exposing the split.
      ⚠️ **Be honest about it being a first.** A tailored-garment memory quilt is advanced work.
      That's not a reason to refuse — it's a reason to quote the hours truthfully, build in a test
      block, and not promise a date that assumes everything goes right first time.
      **If this is accepted, publish a quilt band on custom.html before the NEXT one is asked
      for** (seven places — see CLAUDE.md). One ad-hoc quote is a one-off; two is a category
      being sold with no price.

- [ ] ⚠️ **CUSTOM ORDERS OPENED 2026-08-08 — and Aug 17–24 is now THREE customers deep.**
      Maurya's wheelchair tote, Aubrea's three bow clips, and Linda's tea cover + quilt mending
      all land in the same window, straight off the Aug 14–16 trip — and the unconfirmed second
      trip is Aug 21–24, inside it.
      **The only genuine slack is Aug 11–13.** Anything that can be finished before the trip
      should be: Linda's binding is an hour and Aubrea's clips are quick if the fabric turns up.
      ⚠️ **Quote NEW enquiries against that reality, not 10–14 days from an empty calendar.**
      Today's two Facebook posts are both live and pointing at the custom form, so enquiries are
      more likely this week than any week so far.
      The launch **push is still Sat Aug 29** — opening quietly now just means anyone who comes
      looking can ask.
      ✅ **2026-08-12: the push now has a written proof point it didn't have.** Cassidy E. left a
      five-star review of a **custom** tote — music fabric found for her because she teaches music,
      sized for her books and laptop, pockets placed for her keys. It's live in Kind Words.
      Every other argument for custom orders on this site is the shop making a claim about itself;
      this is a customer describing the part that's hard to photograph — being asked what she
      needed and getting it. §8 of `marketing/campaign-2026-08.md` was written assuming the only
      proof would be Maurya's tote *footage*, which still isn't shot. **Words are available now
      and cost nothing to use.**
      ⚠️ **The tote itself was never listed and has no photo in the repo** — so the review can be
      quoted, but nothing can be linked or shown. If Cassidy has a photo and is happy to share it,
      that is the single highest-value asset the Aug 29 push could gain; worth one message.

- [x] **Welcome Email 3 — SENT 2026-08-09.** That completes the three-email welcome sequence;
      the whole list has now had all of it, and everyone holds NEST15.
      ⚠️ **The gap this leaves is people who subscribe from now on.** With no automation (it's a
      +$29/mo Buttondown add-on), nobody new receives any of the three. Until that's paid for or
      replaced, a new subscriber gets Buttondown's stock confirmation and nothing else — so the
      Aug 29 push is the next thing that reaches them. Worth revisiting once signups arrive
      steadily rather than in a lump; see "Sending" in `emails/welcome-sequence.md`.
- [ ] **Post 7 — Wed Aug 12, the tote process video.** Copy is in §13 of
      `marketing/campaign-2026-08.md`. The draft lives in the scheduler, not the repo, so it's a
      copy-paste job only you can do.
      ⚠️ **The Aug 12 calendar event still holds the ORIGINAL launch-week copy ("3 days")** —
      overwrite it, don't read from it. The rewrite says "this is the bit you get to commission
      now", because custom orders opened early and a countdown to something already available
      tells people to wait.
      **Don't quote a turnaround** — Aug 17–20 is already full.
      📸 It needs the footage: a tote start to finish. If that isn't shot, the Reading Nook
      Sleeve post is the better use of the slot — it went live Aug 7 and still hasn't been
      announced at all.
      - [x] **Post 6 — POSTED 2026-08-10** (a day later than slotted, which cost nothing: the
        rewrite carries no dates, so it read the same on the 10th as it would have on the 9th.
        That is the point of writing copy without dates in it.)

---

## 🟢 Sold — finish the two-step exit

- [x] ✅ **Toffee Windowpane Bandana RETIRED 2026-08-18.** Sold Aug 12, held sold-out for six
      days, now fully retired: out of `PRODUCTS`/`VARIANTS`/`LINKS`/`CATALOG`, out of the Worker's
      `PRICES`, product page deleted, out of the sitemap and the Pinterest feed, and **in Stories
      as `PAST_MAKES` #15**. Pet Bandanas is back to three.
      ✅ **`wrangler deploy` RUN 2026-08-18** — version `976d34b0`. The source had dropped the id
      on Aug 18, but the *deployed* Worker still knew it until now; the two are back in step.
      **Proved rather than assumed**: POSTing `bandana-toffee-windowpane` to the Worker returns
      "Your cart is empty", which is what an unknown id looks like.
      📌 Only the negative case was tested on purpose — a valid cart would mint a real Stripe
      Checkout session and add a phantom abandonment to the figures in the recovery section below.
      📊 **THE WAITLIST TEST RETURNED ZERO.** `js/waitlist.js` was live on this one card for six
      days and collected **no signups** — checked via `tools/buttondown-report.js`.
      ⚠️ **Do NOT read that as "the feature doesn't work".** It is one item, for six days, on a
      shop with modest traffic; that is a measure of exposure, not of the idea. **The honest
      conclusion is that it hasn't been tested yet.** The next genuinely popular piece to sell out
      is the real trial — and the code is intact and appears the moment anything carries
      `soldOut: true`.
      📌 The Pinterest feed re-reads on its own schedule, so a Pin for this piece may briefly land
      on 404.html until it does. That page is a real page with a route back to the shop, which is
      exactly why the sold-out-first ordering exists.

---

## 🆕 Live today

- [x] ✅ **The Suriel Tea Cover — $35, LIVE AND BUYABLE 2026-08-13.** Blue-and-white patchwork,
      12″ × 9″, pieced from the *Tea with the Suriel* prints — the same fabric family as
      `bow-suriel-set`, so the two read as a pair and are worth cross-selling.
      **Checkout tested end to end: $35 + $6.50 shipping.** That confirms the Worker's `PRICES`
      entry AND the new `home-` shipping prefix are both live, not just committed.
      📌 **It opened a SIXTH category, "Home"** — mug rugs and appliance covers now have
      somewhere to go, matching the "home pieces" vocabulary on custom.html.
      ⚠️ **The first deploy failed exactly the Aug 8 way** — `wrangler deploy` ran from a checkout
      that predated the commit, succeeded, printed success, and shipped a Worker with no such id.
      Symptom was "Your cart is empty" on a card that otherwise looked perfect. **Pull first. The
      one-line check is `grep <new-id> worker/checkout-worker.js` before deploying**, and the
      one-line proof is a curl at the Worker with the id in it.
      📣 **Nothing has announced it.** No post, no email, and it isn't in any campaign copy — the
      shop's newest and joint-second-dearest piece is currently sitting there unmentioned.

---

## 📸 One photo still outstanding

⚠️ **Photos have to arrive as FILES, and the reliable route is GitHub's web uploader** —
`https://github.com/WeWereGods/dragon-ink-and-thread/upload/main/assets` — because a web upload
is a server-side commit and **.gitignore does not apply to it**. Three local pushes on 2026-08-13
staged nothing at all: `assets/incoming/`, `assets/Incoming-Products/`, `assets/Catalog/`,
`assets/IMG_*` and `assets/ChatGPT Image *` are all ignored, so `git add` skipped everything
silently and every command reported success. **Rename off `IMG_*` first.**

- [x] ✅ **The Music Teacher's Tote → Stories, done 2026-08-13.** `PAST_MAKES` is now **14**, and
      **Cassidy E.'s review now reads "on The Music Teacher's Tote"** instead of the generic
      "on a custom music-print tote" — the review and the object finally point at each other.
      Two photos processed; the exterior is the Stories hero, the interior (`-2`) is kept for
      later use.
      ⚠️ **Still excluded from the Totes `aggregateRating`, deliberately** — it's a commission,
      not one of the listings that block declares InStock. `reviewCount` stays 1.
- [x] ✅ **Quilt repair before/after — LIVE ON custom.html 2026-08-13.** Uploaded via GitHub's
      web UI (which bypasses .gitignore), then baked the EXIF rotation in — both were orientation
      6 and would have displayed sideways — resized to 1050×1400 at q82, and set as a before/after
      pair under "Before you ask".
      ⭐ **Finding it a home turned up something much worse than a missing photo.** The
      **"Not my craft"** list on that page still read *"Clothing, **quilts**, or anything that
      needs to fit a body"* and *"**Repairs and alterations** to something you already own"* — on
      the same page that sells quilts from $350 and repairs from $40, **two days** after those
      bands went up, and on the day a mending post started sending people straight there. Anyone
      arriving from that post read "repairs — not my craft" inches from "mending starts at $40".
      Both moved to **Happily**, and the repairs line now has the before/after under it as proof.
      📌 **Still worth doing: attach these to mending enquiry replies.** The quick reply in
      `emails/custom-orders-enquiry.md` asks *them* for photos; sending these back is the most
      persuasive thing available to someone deciding whether to hand over something irreplaceable.
      📌 And reuse them in the Aug 29 push — proof that custom work is trusted with things that
      cannot be replaced, which is exactly a memory-piece customer's anxiety.

Both are `PAST_MAKES` entries in js/main.js; both need the photo at 1400px long edge, q82, EXIF
baked in. Together they take Stories from 12 makes to **14**.

---

## 🟡 Ready to go — just needs sending

⚠️ **This section was WRONG on 2026-08-10** — five items sat unticked that had all been posted,
and a morning brief was built on them, concluding "you've barely posted in five days" when the
opposite was true. **Nothing here is evidence of what hasn't happened; it only records what was
written.** Ask before inferring a post didn't run.

- [x] **Two new pet bandanas post — POSTED** (by 2026-08-10). Facebook copy in §13.
- [x] **Reading Nook Sleeve post — POSTED** (by 2026-08-10). It had been live and unannounced
      since Aug 7; that's closed.
- [x] **Pet bandana post (Instagram + Facebook) — POSTED** (by 2026-08-10).
- [x] **Five bows post — POSTED** (by 2026-08-10). Not to be confused with the Tea with the
      Suriel five, which is the Mon Aug 11 post in `marketing/fabric-collections-2026-08.md`.
- [x] **Fabric teaser — POSTED 2026-08-08** (eighteen new prints, seventy-one in the library).

- [x] **Mending post — POSTED 2026-08-13**, same day it was written. Copy in §13 of
      `marketing/campaign-2026-08.md`, built on the before/after of Linda's quilt, led by the
      healed close-up (the patch can't be picked out of it, the ticking stripe runs true, and the
      loft is even where the hole was).
      📌 **This is the first post that advertises MENDING as a thing you do**, rather than a line
      item on the custom page. Repairs have been a published band since Aug 11 and had never been
      spoken about. **Watch what it pulls** — it's the cheapest available read on whether repairs
      are a real category or a favour you occasionally do.
      ⏳ **Replies wait until Mon Aug 17** (away Aug 14–16). A **mending quick reply is now in
      `emails/custom-orders-enquiry.md`** — ask for photos, never quote from a description, and
      say when they'll get a price rather than going quiet.
      📮 **If Linda hasn't been told it's up, tell her before she finds it.** Cheap, and she still
      has a collection outstanding.
      📸 Optional polish: the healed close-up is warm-lit where the damage shot is cooler and
      brighter. A reshoot in matching light would make the pair unarguable for reuse later.
- [ ] **The Quilted Court Bandana post** — listed 2026-08-09 at **$22**, no copy written yet.
      The hooks: it's the only **patchwork** piece in the shop, it reverses to Blushing Linen,
      and Ghost is already wearing it in photo 2. Being the priciest bandana, it wants the
      piecing shown close up — that's what explains the $22 without saying "because it's harder".
      **Put it on Facebook with the shop link in it** — see the referrer measurement below.
- [ ] **TikTok DM from "The Stationary Corner"** (2026-08-05) — unclear whether it was answered.

---

## 🔵 Waiting on something else

- [ ] 🔁 **↩️ RESTORE THE SURIEL SET ON TUE 25 — it was pulled for the trip, not retired.**
      Pulled 2026-08-19 because Fri 21 – Mon 24 is four days with nobody able to touch a listing,
      and the set/singles race below is the shop's only overselling risk. **The SET came down and
      the five singles stayed up**: five live listings beat one, $12 converts better than $55, and
      anyone wanting all five can still buy them as singles for $60 — so nothing became unbuyable.
      **How it was done** (deliberately NOT `soldOut: true`, which prints a "Sold" badge that is
      false and fires the waitlist for a piece that hasn't sold):
      - `LINKS` entry commented out in **js/shop-data.js** → button reads "Coming soon", card stays
        visible, **product page stays alive so no Pinterest Pin lands on a 404**.
      - `PRICES` entry commented out in **worker/checkout-worker.js** + deployed, so a set already
        sitting in someone's localStorage cart can't check out either. Half-closing it would have
        left exactly the hole the pull exists to close.
      - **index.html Bows block: offerCount 13 → 12 AND highPrice 55.00 → 12.00.** The set was the
        only bow above $12, so pulling it changed the *range*, not just the count. Nothing
        regenerates that block.
      ⚠️ **All four have to be reversed together on Tue 25**, then `wrangler deploy` from `main`.
      ⚠️ **The `gameday-bows` branch has offerCount 14** from before this pull — reconcile when it
      merges (12 + Autumn Court = 13, unless the set is back by then, in which case 14).
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
- [x] **Pinterest catalog — LIVE 2026-08-09**, same day it was submitted; the 24–48h estimate
      was pessimistic. **33 of 33 products ingested, 0 failures.** Feed:
      `https://www.dragoninkandthread.com/pinterest-catalog.csv`, written by
      `node tools/build-catalog.js`.
      - All 33 rows initially carried **Warning 157** (`google_product_category` missing, which
        Pinterest says limits visibility in search and shopping). Added the same day, using
        values checked against Google's published taxonomy. **Should clear on the next
        24-hour fetch — worth confirming once, then forget it.**
      - **Warning 1306** (1 row) is GitHub Pages returning 429 to Pinterest's image fetcher.
        Not a feed problem, retries on its own, ignore it.
      - ⚠️ **THE HABIT THIS CREATES: when a piece sells, set `soldOut: true` FIRST and retire it
        to Stories a few days later.** The product group refreshes every 24h, so retiring the
        same day leaves a live Pin pointing at a deleted page. `soldOut` keeps the page alive
        and the feed marks it out of stock instead.
- [x] **Pinterest boards — DONE 2026-08-09.** Seven boards named, described and filled: the five
      product boards (fed from Catalogs → Product groups → "Save to board", so they use the
      Product Pins the catalog already generates rather than competing with them), **The Fabric
      Library**, and **Behind the Seams**. "Totes and Tutorials" made private, so the only public
      totes are the shop's own.
      Four Pin images live in `assets/pins/`, rebuildable with `node tools/build-pin-images.js`
      — three fabric composites plus the patchwork close-up. ⚠️ **Behind the Seams is the one
      board the catalog can't feed**; it needs photos from the machine, so it will go stale
      unless it's fed by hand. Next easy two: the elastic-channel shot
      (`assets/bandana-quilted-court-5.jpg`) and the tote process video from Wed Aug 12.
- [ ] **Confirm the Pinterest conversion fires on the NEXT REAL SALE.** Shipped 2026-08-09 and
      tested hard in the browser (fires once with the right value; silent on reload, on a stale
      order, on corrupt data, and when GPC has suppressed the tag) — but every one of those was
      a simulation. Like the Pushover alert, it isn't proven until a real customer completes a
      real checkout. Proof: **Checkouts** stops reading 0 in Pinterest → Catalogs → Overview.
      If it stays 0 after a genuine sale, the handoff in js/cart.js is where to look.
- [x] **Stripe auto-payouts CONFIRMED WORKING 2026-08-10.** `po_1U2hP2Ghlm0fD4l8JXlbPCQT`,
      **$143.17**, `automatic: true`, status paid, arriving Mon Aug 10 — nobody requested it.
      The two before it were `automatic: false`, so this is the first that fired on its own and
      the switch made on 2026-08-06 has held.
      The amount is $143.17 rather than the expected $144.57 because the balance was **−$1.40**
      the day before (a fee sitting ahead of the batch); 144.57 − 1.40 reconciles exactly.
      Nothing more to watch here.

---

## 📊 Measured 2026-08-10 — where traffic actually comes from

Cloudflare Web Analytics, seven days to Mon Aug 10: **152 visits, ~22/day**, which is the
normal baseline, not a dip. Referrers over the same window (146 attributed):

| Source | Visits | Share |
|---|---|---|
| **Facebook** (www 38 + m 26) | **64** | **44%** |
| None (direct) | 69 | 47% |
| Google | 8 | 5% |
| checkout.stripe.com (returns from checkout, not new) | 5 | 3% |

- **Instagram and TikTok sent ZERO attributable visits**, across a week in which posts ran on
  both. Neither allows a clickable link in a post, so the only route is the bio link. Caveat:
  their in-app browsers often strip the referrer, so some of "direct" may be them — but
  Facebook reports itself correctly, so attribution is working at least in part.
- **Both traffic spikes in the week were Facebook posts.** Roughly a quarter of the week's
  visits arrived in two hours, both Facebook.
- **⚠️ The real constraint is REACH, not posting frequency.** Five posts went out in five days
  and produced 64 Facebook visits. Posting more of the same reaches the same small audience.
  This is the argument for Pinterest, which is search-driven rather than follower-driven, and
  it is why the catalog went in on Aug 9.
- **Practical rule: anything meant to sell goes on Facebook, with the shop URL in the post.**
  Instagram and TikTok are recognition, not traffic — worth doing, but not measurable here.
  If they're to earn anything, the bio link should point at a page that answers the post, not the
  homepage.
- 🔗 **BIO LINK = `https://www.dragoninkandthread.com/custom.html` (set 2026-08-13).** Changed
  from the `shop.html` recommendation above because **August's whole story is custom**: mending
  went live Aug 13, custom orders opened Aug 8, and the **Aug 29 push is a custom push**. A post
  about repairing someone's quilt that sends people to a page with no mending on it wastes the
  only clickable link Instagram allows.
  ⚠️ **This is a manual change on Instagram and TikTok — nothing in this repo controls it.**
  Recorded here so the two don't silently disagree.
  📅 **Revisit after Sat Aug 29.** Once the push is done, the right target is whatever the next
  month is selling — likely back to `shop.html` for ready-made stock. **Not a landmine**: it's a
  live decision with a review date, not a temporary hack waiting to be remembered.

---

## 🧪 Two Facebook posts, one day apart — compare them (2026-08-10)

The first clean read on what this audience actually responds to. Same channel, same week,
different asks:

- **Mon Aug 10 morning — "custom orders are open"** (post 6). Drove a visible spike in views.
  **As of midday it had produced zero checkout sessions.** An invitation to imagine something.
- **Mon Aug 10 — the tote line-up**, nine totes, five buyable with prices. A request for a
  decision, in the highest-value category.

**Check tomorrow:** did either produce checkout sessions, and did the visit spikes differ in
size? Traffic is not the goal — baskets are. If browsing posts spike views and selling posts
produce carts, that settles what August's remaining slots should hold, and it should shape the
Aug 29 push, which is currently written as an announcement rather than an ask.

⚠️ **Don't read a single day as proof.** A handful of sessions either way is noise at this
volume; the point is to start collecting it rather than guessing.

---

## 🧪 Running experiment — free-shipping nudge (shipped 2026-08-08)

The nudge used to be a clause inside the drawer's grey shipping paragraph. It is now its own
honey panel with a progress bar and a "Keep looking →" button. Cost: one CSS block and one
function. No consent, no webhook, no privacy-policy change — which is why it went first,
ahead of abandoned-cart recovery.

**Baseline, measured from the Stripe API on 2026-08-08** (whole account history, 31 sessions):
⚠️ **EXCLUDE ONE SESSION FROM ALL OF THIS: a `bow-lace-of-velaris` ($12) Checkout session was
minted on 2026-08-19 as a TEST**, to prove the five singles still checked out after the Suriel
set was pulled. It will expire unpaid and look exactly like a genuine abandonment. It isn't one.
📌 The negative case (a pulled id → "Your cart is empty") costs nothing, because the Worker
rejects before creating a session. Proving the *positive* case cannot be done without a real
session — so do it only when something would actually be broken if it failed, and write the
session down here when you do.

- 4 real sales vs ~7 genuine abandonments → **~36% of people reaching the payment page paid**
- **3 of those abandonments sat just under $50**: $45.05, and $41.50 twice
- 0 of 26 unpaid sessions captured an email

⚠️ **KNOWN TEST SESSION — exclude it from the September count.**
`cs_live_b1OZsP7iFlZwEnaK3AkV4gbdePwjhMhWC9qkUMn52cthEpkVsy6eZzKoV1`, created 2026-08-09,
$26.50 (Quilted Court Bandana + $4.50 shipping). It is not a customer. It was created
deliberately to prove the Worker knew the new bandana id after `wrangler deploy` — the Aug 8
failure shipped a Worker that didn't, and a successful-looking deploy is exactly what hides it.
There is no way to check that without letting a session be built. It self-expired ~Aug 10.
**This is the cost of that check: one extra expired session in the data.** Worth it, but write
future ones down here the same way rather than trying to identify them by eye later.

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

- [x] **Back-fill pre-2026-07-10 subscribers into Buttondown — DONE 2026-07-31**, confirmed
      2026-08-09. Everyone on the list has had Email 1, so NEST15 reached them all. This had
      been sitting open in two files after it was already finished; it isn't outstanding.
- [ ] **Founder photo** is still a casual phone selfie. Highest-trust element on the page.
- [ ] **Post-purchase packaging insert** — drafted, never made it into the repo.
- [ ] **Policies aren't attorney-reviewed.** Worth a pass now that real money is moving.
