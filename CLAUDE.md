# Dragon Ink and Thread — website

Marketing / pre-launch site for **Dragon Ink and Thread**, a veteran-owned, small-batch
handmade sewn-goods shop in **San Antonio, Texas** (totes, scrunchies, bows). Opening
**Saturday, August 15, 2026**. Brand voice: cozy cottagecore whimsy for book lovers and dreamers; the
audience is invited to "join the Nest."

## Tech stack
- **Plain static site**: HTML + CSS + vanilla JS. **No build step, no framework, no deps.**
- Hosted on **GitHub Pages** from the `main` branch of `WeWereGods/dragon-ink-and-thread`.
- **Deploy = commit + push to `main`.** Pages rebuilds automatically; the live site is
  whatever is on `main`.
- Live at **https://www.dragoninkandthread.com** (custom domain, HTTPS enforced).

## Structure
```
index.html            One-page site: Hero (+ signup), Our Story, Shop, sign-off, Contact
privacy.html          Privacy Policy (noindex)
shipping.html         Shipping & Returns (noindex)
terms.html            Terms of Service (noindex)
css/styles.css        Whole theme via CSS custom properties (:root). Teal + pale-pink + honey.
                      Page background = solid warm cream (`--paper`) on `body`, all pages
                      (2026-07-29). Pink gingham (assets/gingham-pink.png — a generated
                      seamless tile, under a soft cream veil + rosy top glow) is on the HERO
                      sections only: `.hero` (homepage) + `.shop-hero` (shop top), via a
                      shared rule placed after `.section` so it wins. Sections use translucent
                      cream (`.section`) / rose (`.section-tint`) panels over the cream.
                      (Old dragon+florals wallpaper `assets/web-background.jpg` retired — no
                      longer referenced; file left in assets/.)
                      NOTE: CSS url() is relative to css/, so asset paths need `../assets/`.
js/main.js            Mobile nav, scroll-reveal, footer year, countdown, Join-the-Nest + Contact
                      form submit handlers, and the shop (per-item Stripe checkout: PRODUCTS,
                      VARIANTS, LINKS + the variant-card picker).
assets/               logo.png (transparent), tote.jpg. See assets/README.txt.
emails/               Marketing email copy (not sent by the site; no platform wired up yet).
```

## Key facts / gotchas
- **Domain/DNS**: registered at **Wix** (nameservers ns8/ns9.wixdns.net). `www` is a CNAME
  → `weweregods.github.io`; apex has the 4 GitHub A records. HTTPS cert is issued and
  **Enforce HTTPS is ON**. If HTTPS ever breaks, the fix that worked was: Settings → Pages →
  clear the custom domain, Save, wait, re-enter `www.dragoninkandthread.com`, Save.
  Do NOT let Wix "connect the domain to a Wix site" — that hijacks DNS to a parking page.
- **Contact form → Web3Forms** (static-friendly, no backend). Access key is in the HTML
  (submit-only, safe to expose). Messages land in **dragoninkandthread@gmail.com**, subject
  "New message from dragoninkandthread.com". Free tier = 250/month.
- **Newsletter → Buttondown** (since 2026-07-10). Both signup forms (`#nestForm` hero,
  `#nestFormCheckout`) POST to `buttondown.com/api/emails/embed-subscribe/dragoninkandthread`.
  Posted via `fetch` so the visitor stays on the page — the endpoint returns
  `Access-Control-Allow-Origin: *`. Its responses are **HTML, not JSON**, so `wireNestForm()`
  in js/main.js branches on status (ok = subscribed, 400 = bad/duplicate address, 404 = wrong
  username). A hidden `tag` field marks the source (`hero` vs `checkout`) so the launch email
  can treat basket-abandoners differently. Free to 100 subscribers, then ~$9/mo.
  Buttondown owns the list; Web3Forms never did (it's a relay, and its Pro autoresponder can
  only reply to a submission, never broadcast).
- **Checkout = real multi-item cart → Stripe Checkout via a Cloudflare Worker (wired 2026-07-29).**
  shop.html catalog buttons are **"Add to cart"** (`data-cart-add`), handled by **js/cart.js**
  (localStorage cart `dit-cart-v1`, header cart button + count badge, slide-out drawer + live
  subtotal; **one of each item max** — one-of-a-kind, so no qty steppers). Checkout POSTs `[{id, qty}]` to the Worker at
  **`https://dit-checkout.dragoninkandthread.workers.dev`** (**worker/checkout-worker.js**), which
  builds a Stripe Checkout Session and returns its URL to redirect to. After payment →
  **success.html** (clears the cart).
  - **SECURITY / source of truth for prices:** the Worker holds its OWN `PRICES` map (in cents).
    Client-sent prices are ignored. When you change a price or add/retire an item in
    **js/shop-data.js**, also update `PRICES` in worker/checkout-worker.js and re-run
    `wrangler deploy` (see **worker/README.md**). The Stripe **secret key** lives only as a Worker
    secret (`wrangler secret put STRIPE_SECRET_KEY`), never in the repo.
  - The session adds **one shipping fee per order** + a **$0 Local pickup** option,
    `automatic_tax` (needs Stripe Tax on), and `allow_promotion_codes` (NEST10). Cart is on
    shop.html only (homepage teaser links there).
  - **Tiered shipping (2026-07-30):** the fee now depends on the cart, set by the
    `SHIP_STANDARD` / `SHIP_SMALL` / `FREE_SHIP_OVER` constants at the top of
    worker/checkout-worker.js — **$6.50** if any `tote-*` id is in the cart, **$4.50** for
    scrunchies/bows only (fits a small mailer), **free** at a subtotal ≥ **$50**
    (`FREE_SHIP_OVER = 0` turns the threshold off). Local pickup stays $0 on every order.
    **js/cart.js mirrors these three numbers** (in DOLLARS, not cents) purely to write the
    drawer's shipping line — including the "Add $X more for free shipping" nudge. The Worker
    is authoritative; **change both files together or the drawer will lie about the fee.**
  - **Per-item quantity caps (2026-07-30, was a hard cap of 1):** a product's **`maxQty`** in
    js/shop-data.js sets how many of it one order may hold; **omitting it means 1**, so totes and
    bows stay one-of-a-kind. **Scrunchies + both 3-packs carry `maxQty: 3`.** Items above 1 get a
    **− n +** stepper in the drawer and the catalog button reads "Add another (n)" → "Max 3 in
    basket ✓"; items at 1 keep "In basket ✓". **The Worker clamps qty to its own `maxQty`** (a
    tampered `qty: 99` becomes 3, `qty: 5` on a tote becomes 1), so shop-data.js alone changes
    nothing a customer can actually buy — **update both files and `wrangler deploy`.**
    **DECIDED 2026-07-30: bows stay at 1** (no `maxQty`) — they're one-of-a-kind like the totes.
    Don't "helpfully" raise them; it was asked and answered.
  - **Build Your Own Bundle picks (fixed 2026-07-30):** the 3 print dropdowns used to live in the
    Stripe Payment Link, which the cart stopped opening — so for a while the bundle was orderable
    with **no record of which prints to sew**. Now: **`picks: 3`** on the PRODUCTS entry makes
    js/shop.js render 3 `<select>`s on that card (options come from the new **`BYO_PRINTS`** list),
    mirrored onto the button's `data-cart-picks`; js/cart.js stores them on the cart line, shows
    them under the item, and POSTs them as `picks: [...]`. The Worker validates against its own
    **`PICKABLE`** map — wrong count, an unknown id, or a smuggled tote all **400** — then folds
    the names into the Stripe line item ("Build Your Own Bundle — Cherry, Wildflower, Butterfly"),
    so they reach the receipt **and the Pushover alert**. Adding a print = add it to `BYO_PRINTS`
    **and** `PICKABLE`. `maxQty` stays 1 on the bundle: one cart line = one set of picks.
  - **One-of-a-kind:** set **`soldOut: true`** on a
    PRODUCTS entry in js/shop-data.js → dimmed card + "Sold" badge + disabled "Sold out"; cart
    refuses it. **Sunflower Tote is currently soldOut.**
  - **Photo gallery (2026-07-30):** double-click a catalog photo → js/shop.js lightbox that
    arrows/scrolls through that item's `VARIANTS.images` (prev/next, counter, keyboard, Esc);
    a "N photos" hint shows on multi-image cards. `.gallery-lightbox[hidden]{display:none}` is
    required (same display-override gotcha as the cart drawer).
  - **Sale notifications (2026-07-30):** Stripe webhook (`checkout.session.completed`) → the
    Worker's **`/webhook`** route → **Pushover** push (item + amount + pickup/ship). Extra Worker
    secrets: `STRIPE_WEBHOOK_SECRET`, `PUSHOVER_TOKEN`, `PUSHOVER_USER` (see worker/README.md).
    Signature verified via Web Crypto; push sent with `ctx.waitUntil` so Stripe gets a fast 200.
    Endpoint is live + verified (unsigned POST → 400); Pushover keys unconfirmed until a real sale.
  - **Products (2026-07-30):** Strawberry Tote **v2** is BACK in the shop (`tote-strawberry-v2`,
    $35, 4 photos, leads the Totes) — a NEW make, distinct from the retired v1 that's in Stories.
    Mustard Rose Tote renamed **Cottage Rose Tote** (same id `tote-mustard-floral`).
  - The old per-item **Payment Links** (`LINKS` in js/shop-data.js) are **no longer opened**;
    `LINKS` now only flags **availability** — an id absent from `LINKS` is sold out ("Coming soon").
  - The shop is **OPEN** (SHOP_OPENS is a past date in js/shop-data.js); **Aug 15 = when _custom_
    orders open** (countdown/badges). js/main.js's inline PRODUCTS/VARIANTS/LINKS + its vestigial
    per-item buy handler are unused by the current homepage.
  - The Strawberry Tote, both cozys, and both blooms were RETIRED from the shop → Stories lookbook
    (2026-07-27; see below).
- **Products** (name / price / cart id): the Shop has **3 cards** (Totes, Scrunchies, Bows), all **variant cards** with
  a `<select>` print/style picker + thumbnail gallery (`.card-variant` in index.html, wired by
  `initVariantCards()` in js/main.js):
    - **Totes** — Sunflower Tote $45 (`tote-sunflower`, the puffy woven one, default),
      Mushroom Tote $25 (`tote-mushroom`), Mustard Rose Tote $20 (`tote-mustard-floral`),
      Blue Rose Mini Tote $20 (`tote-blue-rose`, small 8×4 bag, 3-photo gallery), Butterfly Tote $38
      (`tote-butterfly`, lily-of-the-valley + butterflies, 3-photo gallery). (Strawberry Tote retired
      to the Stories lookbook 2026-07-27.)
    - **Scrunchies** — 8 prints @ **$6** each (`scrunchie-butterfly`, `-cherry-blossom`, `-cherry`,
      `-orange-kitty`, `-pink-bumble-bee`, `-pretty-in-pink`, `-wildflower`, `-strawberry`) + a
      **Bundle of 3** @ **$15** (`scrunchie-bundle`, red/cream/navy solids), plus **Build Your Own
      Bundle** @ **$15** (`scrunchie-byo-bundle`, pick any 3 prints) as the last two `<option>`s.
      **Repriced 2026-07-30** from $4/$9 — $4 was under the handmade market rate ($6–12) and made
      the flat shipping fee look absurd on a single scrunchie (62% of the order). Changed in
      js/shop-data.js, `PRICES` in worker/checkout-worker.js, and the scrunchie `AggregateOffer`
      JSON-LD in index.html.
    - **Bows** $10 each — Sage Bow (`bow-sage`), Gingham Bow (`bow-gingham`, taupe),
      Sage Gingham Bow (`bow-sage-gingham`), Blue Rose Bow (`bow-blue-rose`).
    (Cozys `cozy-bee`/`cozy-daisy` and Blooms `bloom-cream`/`bloom-pink` were retired from the shop
    2026-07-27 → now in the Stories lookbook PAST_MAKES.)
  Each print/style is its own cart id. **Price of record lives only in the `PRODUCTS` object**
  (js/main.js) — the dropdown `<option>` labels are the print name only, and `initVariantCards()`
  appends the "— $price" suffix from `PRODUCTS` at runtime (so a price is never duplicated).
  Per-variant photos/blurb/details live in the `VARIANTS` map (js/main.js). To add a print: drop
  the photo in assets/, add a `PRODUCTS` + `VARIANTS` entry, and an `<option>` (name only, no
  price) to that select.
- **Images**: `logo.png` is background-transparent (flood-filled from the original). Originals
  `logo-original.png` and `Tote.png` are kept locally but **gitignored**. Product cards use
  `<img>` with an `onerror` fallback to an emoji placeholder, so missing photos never look broken.
- **Brand name**: always spelled **"Dragon Ink and Thread"** (the word "and", never "&").
  Socials: `@dragonink_and_thread` (Instagram + TikTok).

## Local preview
Open `index.html` directly, or from the repo root run `python -m http.server 8000` and visit
http://localhost:8000. (Use a server so the `.html` links and fetch calls behave like production.)
If Python isn't installed, a tiny Node static server lives at `.claude/preview-server.js`
(gitignored) — `node .claude/preview-server.js` serves the repo on :8000; the Claude preview
panel launches it via `.claude/launch.json` (config name `site`).

## Analytics & social
- **Analytics is live**: Cloudflare Web Analytics (cookieless, no consent banner needed) via a
  beacon in each page's footer (index/privacy/shipping); the token is public by design. View
  stats at Cloudflare dashboard → Web Analytics. Works without moving DNS to Cloudflare.
- **Social share card** = `assets/og-image.jpg` (1200×630); OG/Twitter meta live in index.html `<head>`.

## Open TODOs / nice-to-haves
- **Founder photo** → `assets/about.jpg` is now live in the About/Our Story section, but it's a
  casual phone selfie used as a stand-in. Swap for a stronger shot (ideally the maker with her
  work — at the machine, or holding a tote) when one exists. Highest-trust element on the page.
- **Product photos are optimized from phone originals** → the `tote-*`, `bow-*`, and `bloom-*`
  card photos were batch-processed from raw phone JPGs (`assets/IMG_*.jpeg`, gitignored) down to
  1400×1050 (4:3) at quality 82. IMPORTANT: phone JPGs carry **EXIF orientation** tags — the
  pipeline bakes rotation into pixels and strips EXIF (composite onto a fresh Jimp canvas; setting
  `_exif=null` alone does NOT work). Don't drop a raw phone JPG straight into a card and trust it.
- **Tote/​bow specs are real now** → owner supplied dimensions (2026-07-13); `VARIANTS` `details`
  carry size · strap drop · pocket for Sunflower, Mushroom, Mustard Rose, Blue Rose, Butterfly,
  plus bows (6″ × 7″). (Strawberry Tote is no longer in the shop — retired to Stories 2026-07-27.)
- **Stories / Past Makes lookbook is LIVE** (published 2026-07-27, merged from `stories-lookbook`).
  A "Stories" nav link + `#stories` section render the `PAST_MAKES` array in js/main.js as a
  "found a home" grid. Entries (**8**, as of 2026-07-30): **Road Trip Kindle Case**, **Lavender and
  Honeybee Wheelchair Tote**, **Cottage Patchwork Pouch**, **Strawberry Tote**, **Cream Bloom**,
  **Pink Bloom**, **Blue Bee Cozy**, **Daisy Cozy**. The first three are one-off/custom makes that
  were never shop listings; the rest were retired from the shop and moved here.
  To add a retired piece: drop a photo in assets/ and add a `{img, art, title, story}` entry to
  `PAST_MAKES`. (The old low-res / placeholder-dims Strawberry Tote TODOs are moot — it left the shop.)
- **"Kind Words" testimonials section is LIVE and SHOWING** (added 2026-07-27, a professionalism pass
  inspired by a competitor site). `#kind-words` starts `hidden` and JS reveals it once the
  `TESTIMONIALS` array in js/main.js has ≥1 entry — it now holds **3 real reviews**, so the section
  renders. **REAL reviews only — never invent them.** Add `{ quote, name, where?, stars? }` objects
  to populate. NOTE: one review is for the **"Road Trip Kindle Case"** — a retired make, correctly
  in Stories PAST_MAKES, not the shop. A review for a retired piece is fine (and is proof custom
  work already delights people); it just can't be clicked through to a listing. Same pass also: `text-wrap: balance` on
  headings, more `.section` whitespace, and `.badge` dashed→solid hairline.
- **HOMEPAGE + CATALOG REDESIGN (2026-07-28, "luxury cottagecore"):**
  - **New full catalog page `shop.html`** — every item as its own tile in a grid (Totes/Scrunchies/Bows),
    no dropdowns. Rendered by **`js/shop.js`** from **`js/shop-data.js`** = the NEW single source of truth
    for `PRODUCTS`/`VARIANTS`/`LINKS`/`CATALOG`/`SHOP_OPENS`. shop.js has its own nav/reveal/gating.
  - **Homepage restructured:** the **hero now LEADS the page** (was below the shop). It's a centered,
    elevated hero (gold script "bubble" eyebrow, framed logo, Fraunces headline, gold hairline rule,
    tagline, maker quote, centered Join-the-Nest card, badges). The old dropdown shop cards are GONE —
    `#products` is now a **"Shop the collection →" CTA** (gold + cursive) linking to shop.html. Nav "Shop"
    → shop.html. Order: hero → products(CTA) → about → stories → kind-words → faq → closing → contact.
  - **⚠️ `js/main.js` shop machinery is now VESTIGIAL** — the homepage has no `.card-variant`, so
    `initVariantCards()` no-ops and main.js's inline `PRODUCTS`/`VARIANTS`/`LINKS` are unused (kept for
    now; safe to prune later). **Edit product data in `js/shop-data.js`, NOT main.js.**
  - **Script font is now `Great Vibes`** (swirly calligraphy) via `--font-script`, added to the Google
    Fonts link on both index.html + shop.html. Used by `.eyebrow`, `.hero-eyebrow`, `.shop-cta-btn`.
    (Caveat kept as fallback.) Cache-bust bumped to `?v=20260728c`.
- **Cache-busting on re-used image filenames**: when a photo is swapped but keeps its filename
  (e.g. `scrunchie-orange-kitty.jpg`, the gingham bows), browsers/CDN serve the stale copy.
  Bump the `?v=N` query on that image's path in the `VARIANTS` map (orange-kitty + both gingham
  bows currently use `?v=2`). New filenames don't need this.
- **Product structured data is live** → **3** `Product` JSON-LD blocks (Totes / Scrunchies / Bows)
  with `AggregateOffer` price ranges sit in index.html `<head>`, alongside the brand-level `Store`
  block. Prices are **static** there — keep them in sync with **js/shop-data.js** (NOT main.js,
  whose PRODUCTS copy is vestigial and still carries the pre-2026-07-30 prices).
  `availability` is already `schema.org/InStock` on all three (the shop is open). **Still to do:**
  add `aggregateRating` — 3 real reviews now exist in `TESTIMONIALS`, so it's finally legitimate.
  Never fake them.
- **Load the welcome sequence into Buttondown** — the 3 emails in `emails/welcome-sequence.md`
  are written but not yet set up as an automation in Buttondown, so new subscribers still get
  silence. Needs doing in the Buttondown dashboard (not in this repo).
- **Back-fill old subscribers into Buttondown** — anyone who joined before 2026-07-10 exists
  *only* as a Web3Forms notification in the Gmail inbox (free tier drops submissions after 30
  days). Export them from Gmail and import to Buttondown, or they never get the launch code.
- **Post-Purchase note** packaging insert — drafted copy the owner referenced, not yet in repo.
- Policies are plain-language, **not attorney-reviewed** — worth a Termly/TermsFeed pass before
  taking real payments.
