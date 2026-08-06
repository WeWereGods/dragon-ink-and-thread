# Dragon Ink and Thread — website

Shop site for **Dragon Ink and Thread**, a veteran-owned, small-batch handmade sewn-goods
shop in **San Antonio, Texas** (totes, scrunchies, bows, pet bandanas). **The ready-made shop
has been OPEN since 2026-07-01** — this is no longer a pre-launch site. **Custom orders open
Monday, August 17 2026** (moved from Aug 15; see below). Brand voice: cozy cottagecore whimsy
for book lovers and dreamers; the audience is invited to "join the Nest."

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

## ⚠️ Cache-busting is AUTOMATIC now — but you must run the script
`?v=` tokens are the **content hash** of each file (`tools/asset-hash.js`), not a hand-typed
date. After editing any CSS or JS:

```
node tools/bump-assets.js      # restamps every ?v= in every .html
```

This exists because a hand-maintained version was forgotten **three times in one session**.
The worst shipped the fabric lightbox with its CSS uncacheable — the enlarged photo appeared
full-size over the page with no backdrop, because returning visitors kept the old stylesheet.
A hash changes exactly when the file changes and never when it doesn't. The two page
generators call `hashOf()` themselves, so generated pages come out already correct.

## ⚠️ Fabric library is GENERATED — `node tools/build-fabrics.js`
`fabrics.html` (53 fabrics for custom orders) is written from **js/fabrics-data.js**.
Add/remove a fabric there, then re-run. **js/fabrics.js** only adds the group filters and the
tap-to-enlarge view; the swatches and names are static in the HTML.
- Photos: `assets/fabrics/` at 640px long edge, q78 (~81 KB each). The raw phone originals in
  `assets/Catalog/` are **188 MB and gitignored — never commit them**.
- Phone JPEGs carry **EXIF orientation**; 5 of these were landscape and would display sideways.
  Jimp v1 auto-rotates on read and re-encoding drops the tag, which bakes rotation into pixels.
- `.fabric-lightbox[hidden]{display:none}` is required (same display-override gotcha as the
  cart drawer and the old gallery).

## ⚠️ Product pages are GENERATED — re-run the script after any shop-data change
Every product has its own page at the repo root (`tote-butterfly.html`, `bow-sage.html`, …),
**written by `tools/build-products.js` from js/shop-data.js**. They are not hand-edited.

```
node tools/build-products.js      # then commit the regenerated *.html + sitemap.xml
```

- **Change a price, blurb, photo, or `soldOut` flag in js/shop-data.js → re-run this**, or the
  product pages keep showing the old values. This is the one manual step in an otherwise
  build-free site; it exists so 20 pages can't drift from the source of truth the way the old
  main.js PRODUCTS copy did.
- It also **regenerates sitemap.xml** wholesale (home + shop + custom + every non-soldOut
  product), so a retired piece stops being advertised to search engines.
- Pages are generated **at the repo root, not a subfolder**, because shop-data.js stores image
  paths relative (`assets/x.jpg`); from `/product/` those would 404.
- Each page is static (name, price, description, photos, breadcrumbs in the HTML) plus
  `Product` + `BreadcrumbList` JSON-LD. **js/product.js** only adds thumbnail switching and the
  Build-Your-Own pickers; **js/cart.js** handles Add to cart via `[data-cart-add]`.
- shop.html photos + names now **link to these pages** (`js/shop.js`). The old double-click
  lightbox was deleted — a link is discoverable, a double-click gesture wasn't.
- Category jump buttons + anchors live on shop.html: `#totes`, `#scrunchies`, `#bows`.
  **`catSlug()` is duplicated in js/shop.js and tools/build-products.js — keep them identical**,
  or product-page breadcrumbs will link to anchors that don't exist.

## ⚠️ EVERYTHING IN THE SHOP IS ALREADY SEWN — never write "made to order" about it
Confirmed by the owner 2026-08-03. Every tote, bow and scrunchie listed is a **finished piece
sitting in stock**, not something cut after an order. The site used to say "made to order —
please allow 5–10 business days" everywhere; that was untrue and actively cost sales, since a
week-and-a-half wait on a bag that's already on the shelf is a reason to hesitate. It now says
**"Sewn and ready to ship"**, with **1–3 business days** to post (FAQ + shipping.html).
- **"Made to order" now means CUSTOM orders only** — those genuinely are cut from scratch,
  **10–14 days** from agreeing the details, plus shipping. Keep the two clearly separate.
- **Consequence: every shop piece is returnable** (14 days, unused). Only custom orders are
  final sale — the old "made-to-order items are final sale" clause no longer covers anything.
- **Scrunchies keep `maxQty: 3` because she stocks MULTIPLES of each print** (confirmed
  2026-08-03) — that's not an overselling bug. Totes and bows stay at 1, genuinely one-of-a-kind.
- shipping.html also used to claim postage was "calculated at checkout based on weight and
  destination", which was never true — it's the flat tiered fee. Fixed 2026-08-03.

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
  subtotal; **one of each item max** — one-of-a-kind, so no qty steppers). Checkout POSTs **`{items: [{id, qty}]}`** (an object with an `items` array — NOT a bare
  array; the Worker answers "Your cart is empty" to anything else) to the Worker at
  **`https://dit-checkout.dragoninkandthread.workers.dev`** (**worker/checkout-worker.js**), which
  builds a Stripe Checkout Session and returns its URL to redirect to. After payment →
  **success.html** (clears the cart). **success.html also ASKS for two things (2026-08-02)** — it's
  the moment of peak goodwill and used to ask for neither: a review/photo (mailto + Instagram; real
  reviews get added BY HAND to `TESTIMONIALS`, never invented) and a Join-the-Nest signup tagged
  **`purchased`**, wired by a small inline script since this page doesn't load main.js.
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
    refuses it. **Nothing is currently soldOut** — as of 2026-08-05 the owner's preference is to
    **retire a sold piece to Stories rather than leave it on the shelf greyed out**, so
    Sunflower Tote, Mushroom Tote, Sage Bow and Blue Rose Bow were removed from shop-data,
    the Worker and their product pages, and added to `PAST_MAKES`.
    ⚠️ **This retires the sold-out waitlist with them** — `js/waitlist.js` only ever runs on a
    sold-out card or product page, so with nothing sold-out it never appears. The code is intact
    and returns the moment any item carries `soldOut: true`. Raised with the owner; it was their
    call. Retiring also **deletes that piece's product page**, so its URL starts 404ing.
  - **Sold-out waitlist (2026-08-02) — lives in `js/waitlist.js`.** A sold-out listing is a DEAD
    END, and in a one-of-a-kind shop every listing eventually becomes one. Anything carrying
    `data-waitlist="<id>" data-waitlist-name="<name>"` opens it: **shop.html catalog cards**
    (`buyMarkup()` in js/shop.js) **and every generated sold-out product page**
    (tools/build-products.js), which is where the most interested visitor actually lands after
    clicking through from the grid. It subscribes to the same Buttondown list as the hero form,
    tagged **`waitlist`**.
    - **The modal markup is INJECTED by waitlist.js, not written into any page.** It began as
      static HTML in shop.html; copying it into 20 generated pages would be exactly the
      duplication the product generator exists to prevent. Don't paste it back into a page.
    - Only **sold-out** product pages load the script (in-stock ones don't need it).
    - `.waitlist-modal[hidden]{display:none}` is **required** (same display-override gotcha as the
      cart drawer, the gallery and the fabric lightbox).
    - A *per-item* tag was deliberately not used: acting on any tag needs Buttondown's +$9/mo
      segmentation add-on anyway, and an unfamiliar tag value is the one thing here that can't be
      tested against the live account.
  - **Photo zoom on product pages (2026-08-02) — `js/zoom.js`.** **Double-click** the hero photo
    (anything with `data-zoom`) for a full-screen view, with prev/next through that item's photos,
    a counter, arrow keys, Esc/backdrop close, and focus restored to the photo. **Clicking the
    enlarged photo goes to ACTUAL SIZE and the overlay scrolls to pan** — fitting alone is only
    ~1.4× on a short window, which is barely a zoom for a ~1400px file; actual size is ~2.4×.
    - **On touch it opens on a SINGLE TAP**, because double-tap is the browser's own page-zoom
      gesture and can't be borrowed. The `[data-zoom-hint]` badge is written by JS for the same
      reason ("Double-click to zoom" vs "Tap to zoom").
    - **Deliberately NOT on shop.html cards:** those photos are `<a>` links to the product page,
      so the first click of a double-click navigates away. The shop *used* to have a double-click
      gallery and it was removed precisely because a hidden gesture beat a discoverable link —
      don't re-add it there.
    - It revives the orphaned `.gallery-*` CSS left behind by that deleted gallery rather than
      adding a third lightbox. `.gallery-lightbox[hidden]{display:none}` is **required**.
  - **Product-page cross-sell (2026-08-02):** generated pages carry TWO rows — **"Pairs well
    with"** (CROSS-category, in-stock only, 3 items) and the older **"More <category>"**
    (same-category siblings). The first exists because the shop's first customer bought a tote
    *and* a matching scrunchie entirely on her own initiative — the site never suggested it — and
    because an added $6 scrunchie walks the basket toward the free-shipping threshold, which
    until then was only mentioned once the cart drawer was already open. Picks are
    **deterministic** (offset by the item's index in its own category) so pages rebuild
    identically while different totes still suggest different scrunchies.
  - **⚠️ Shipping numbers now live in `SHIPPING` in js/shop-data.js** (`standard` / `small` /
    `freeOver`, in DOLLARS). js/cart.js reads them for the drawer and tools/build-products.js for
    the "orders over $50 ship free" line, so the client side has ONE copy instead of three.
    **worker/checkout-worker.js is still the authority** on what a customer is charged (in cents)
    — change both together, then `wrangler deploy`.
  - **Photo gallery (2026-07-30):** double-click a catalog photo → js/shop.js lightbox that
    arrows/scrolls through that item's `VARIANTS.images` (prev/next, counter, keyboard, Esc);
    a "N photos" hint shows on multi-image cards. `.gallery-lightbox[hidden]{display:none}` is
    required (same display-override gotcha as the cart drawer).
  - **Sale notifications (2026-07-30):** Stripe webhook (`checkout.session.completed`) → the
    Worker's **`/webhook`** route → **Pushover** push (item + amount + pickup/ship). Extra Worker
    secrets: `STRIPE_WEBHOOK_SECRET`, `PUSHOVER_TOKEN`, `PUSHOVER_USER` (see worker/README.md).
    Signature verified via Web Crypto; push sent with `ctx.waitUntil` so Stripe gets a fast 200.
    **CONFIRMED WORKING on the first real sale (2026-08-02)** — the phone buzzed, so the keys and
    the whole Stripe → Worker → Pushover chain are proven in production.
  - **⚠️ Stripe does NOT email receipts by default** — they only send if **Settings → Business →
    Customer emails → Successful payments** is ON; Checkout does not send one just because it
    collected an email, and the Worker sets no `receipt_email` / `invoice_creation`.
    **That toggle was found off and switched ON 2026-08-02**, so receipts now go out — but
    success.html's wording stays deliberately conditional ("if it hasn't landed… email me")
    because a receipt can still land in spam. **Don't "tidy" it back into a promise.**
    A missing receipt can always be sent by hand: Dashboard → Payments → the payment → Send receipt.
  - **Order emails** (shipped / ready for pickup / the follow-up that earns reviews) are drafted in
    **emails/order-updates.md**. They're sent by hand from Gmail, one customer at a time. Writing to
    a buyer about their order is fine; **adding them to the Buttondown list is not** unless they
    subscribed themselves — so those templates invite, never enrol.
  - **Products (2026-07-30):** Strawberry Tote **v2** is BACK in the shop (`tote-strawberry-v2`,
    $35, 4 photos, leads the Totes) — a NEW make, distinct from the retired v1 that's in Stories.
    Mustard Rose Tote renamed **Cottage Rose Tote** (same id `tote-mustard-floral`).
  - The old per-item **Payment Links** (`LINKS` in js/shop-data.js) are **no longer opened**;
    `LINKS` now only flags **availability** — an id absent from `LINKS` is sold out ("Coming soon").
  - ⚠️ **CUSTOM-ORDER LAUNCH MOVED 2026-08-06 — Aug 15 → Mon Aug 17, push on Sat Aug 29.**
    The owner is travelling **Aug 14–16 and again Aug 21–24**, which ruled out both the
    original Saturday and the obvious fallback of Aug 22. The launch was split in two,
    because only one half needs her present: **the FORM opens Mon Aug 17** (quiet, no
    campaign — `CUSTOM_OPENS` in js/dates.js does it alone, so anyone who saw the old date
    still finds an open form), and **the PUSH runs Sat Aug 29** (§10 runbook in
    marketing/campaign-2026-08.md — the first Saturday she is home either side).
    - **The date lives in ONE place: `CUSTOM_OPENS` in js/dates.js.** Every countdown, banner
      and "opens August 17" phrase derives from it, including the weekday — `label()` formats
      it, so the words can never disagree with the date. Verified 2026-08-06 by simulating
      Aug 17: all four pre-open phrases flip to "Custom orders are open" with no deploy.
    - Static fallbacks (for no-JS) and **terms.html** do NOT auto-update — terms.html hard-codes
      the date with no span. Both were hand-updated; check them if the date ever moves again.
- **AWAY WINDOWS — `AWAY` in js/dates.js (added 2026-08-06).** One confirmed trip:
  **Aug 14–16**. A second, **Aug 21–24, is UNCONFIRMED and deliberately NOT on the site** —
  an away banner is a promise about when a parcel moves, so it should only ever describe
  travel that is actually happening. Both files carry a commented-out block to paste back if
  it firms up. Two things key off `AWAY`, and **both switch themselves off**:
  - **`.js-away`** — a honey banner under the countdown bar on index/shop/custom, shown ONLY
    while a trip is running. `[data-away-back]` is filled with that window's return date, so
    the two trips say different things without duplicated markup.
  - **`.js-away-notice`** — the advance warning inside custom.html's "how it works" steps.
    Visible from now until the LAST window closes, then gone for good.
  - The first version of this was a hand-written paragraph with a comment saying "delete this
    on Aug 25". That is a landmine — it stays true only if someone remembers. **Don't
    reintroduce hand-dated copy; add a window to `AWAY` instead.**
  - `.away-bar[hidden]` and `.custom-away[hidden]` both need the explicit `display:none`
    (same display-override gotcha as the cart drawer, fabric lightbox and waitlist modal).
  - ⚠️ **worker/checkout-worker.js keeps its OWN copy of `AWAY`** and uses it to relabel the
    local-pickup option to "Local pickup (San Antonio) — collect from Aug 17". Shipping is
    fine while she's away (1–3 business days still holds if it posts on return); **pickup is
    the one thing that genuinely breaks**, since someone expects to collect that afternoon.
    **Change both files together, then `wrangler deploy`** — the Worker is what the customer
    actually reads at the moment they choose.
  - The shop is **OPEN** (SHOP_OPENS is a past date in js/shop-data.js); **custom orders = when _custom_
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
    - **Bows** — **$12 each since 2026-08-05** (was $10), and **6″ × 6″** (the details line said
      6″ × 7″ for weeks; corrected by the owner). **7 of them:** Cauldron Forged
      (`bow-cauldron-forged`, midnight navy + bronze crackle, leads the row), Toffee Plaid,
      Roasted Roses, Daily Grind in Ivory, Blushing Linen, Gingham (taupe), Sage Gingham.
      Bow names come from the **fabric library** (js/fabrics-data.js), so a bow and its swatch
      share a name.
    - **Pet Bandanas** — a FOURTH category, added 2026-08-05. The Storykeeper Bandana
      (`bandana-storykeeper`, $18, 3 photos) in the same books-and-potion-bottles print as
      The Storykeeper tote. Over-the-collar, **size Large, fits an 18″–23″ neck; small/medium
      made to order.** Ships on the $4.50 small tier (no `tote-` prefix). A sunflower gingham one
      was made 2026-08-04 and **sold before it was ever listed** — don't add it.
- **CUSTOM price bands (owner-supplied 2026-08-05, live on custom.html in TWO places — the
  `custom-price-list` and the one-line summary above the form; change both together):**
  Totes **$50–100** · Bows **$13–20** · Scrunchies **$6–12** · Pet bandanas **$20–25**.
  ⚠️ **The bow floor is $13 ON PURPOSE, not $12** — it must stay *above* the $12 ready-made bow
  so the minimum paragraph's promise ("the ready-made ones in the shop are the same lovely thing
  for less") stays literally true. **If shop bows are ever repriced, move this floor with them.**
  **"Buy more, save more" is applied BY HAND at quoting time — there is no coded discount**,
  no promo code, and nothing in the Worker implements it. The bandana copy leans on it
  deliberately ("so every one of your babies can match"), because a multi-pet household is the
  natural multi-buy. **Scrunchies are the one band that still ties rather than beats the shop**
  ($6 custom floor = $6 shop), and the minimum paragraph names scrunchies by name — worth an
  owner decision if it ever matters; raising the custom floor to $8 would close it.
    (Cozys `cozy-bee`/`cozy-daisy` and Blooms `bloom-cream`/`bloom-pink` were retired from the shop
    2026-07-27 → now in the Stories lookbook PAST_MAKES.)
  Each print/style is its own cart id. (The old homepage `<select>` flow described here is GONE —
  see "ADDING A NEW PIECE" below for what actually works now.)

## ⚠️ ADDING A NEW PIECE — the full checklist (3 steps fail SILENTLY)
The old instructions ("add an `<option>` to that select") described the homepage variant cards,
which **no longer exist**. Here is the real sequence. Everything lives in **js/shop-data.js**
except where noted.

1. **Photo → `assets/`** at quality 82. **Either orientation works** — `.catalog-photo` is
   `aspect-ratio: 4/3; object-fit: cover`, so the card crops whatever you give it. Landscape
   **1400×1050** is the common case (all bows, most totes); **portrait 1050×1400** is used where
   the piece is tall (Storykeeper tote, Strawberry v2, the bandana). Pick the one that loses less.
   - ⚠️ **Check the subject fits the 4:3 window before cropping.** Cauldron Forged filled 813px of
     a 1448px frame and the widest possible 4:3 crop is 814px — a centre crop cut the tails off at
     both edges. Fixed by mirroring a narrow strip of plain background to buy margin; take the
     filler from a **knot-free** band or the mirror is obvious.
   - Phone photos carry **EXIF orientation** — bake the rotation into pixels and strip EXIF or the
     image displays sideways. `sharp(...).rotate()` does both (it applies EXIF and re-encodes);
     with Jimp, composite onto a fresh canvas — setting `_exif = null` alone does NOT work.
     `sharp` is not a repo dependency (the site has none) — install it in a scratch dir.
2. **`PRODUCTS`** — `{ name, price, art }`. Add `maxQty: 3` only for scrunchies; **omitting it
   means 1**, which is what totes and bows want.
3. **`VARIANTS`** — `alt`, `blurb`, `details` (size · strap drop · pocket), `images: [...]`.
4. **`LINKS`** — ⚠️ **an id missing from `LINKS` silently renders "Coming soon" and cannot be
   bought.** The value is now only an availability flag (the old Payment Links are never opened),
   so **new items just use the string `"cart"`** — that's the established convention.
5. **`CATALOG`** — add the id to that category's `ids` array, or it appears nowhere.
   **A NEW CATEGORY is just one more `{ label, note, ids }` entry** — the jump button and the
   `#<slug>` anchor are both generated from `catSlug(label)`, so shop.html needs no hand-editing
   (done 2026-08-05 for **Pet Bandanas**). Two things do NOT follow automatically: a `Product`
   JSON-LD block in index.html `<head>`, and the shipping tier — the Worker charges
   `SHIP_STANDARD` only for ids starting `tote-`, so any new category lands on `SHIP_SMALL`.
   Check that's actually right for what you're posting.
6. **`PRICES` in `worker/checkout-worker.js`** (in **CENTS**) — ⚠️ **the Worker rejects any id it
   doesn't know, so checkout fails without this**, however good the rest looks.
7. **`wrangler deploy`** from `worker/` — step 6 does nothing until this runs.
8. **`node tools/build-products.js`** — writes the new product page + refreshes sitemap.xml.
9. **`node tools/bump-assets.js`** — restamps the `?v=` cache-busting tokens.
10. **Commit + push.** Pages redeploys; the piece is live.

The silent ones are **4, 6 and 7**: skip 4 and the piece looks fine but says "Coming soon"; skip
6 or 7 and it adds to the basket and then fails at checkout.
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
  `TESTIMONIALS` array in js/main.js has ≥1 entry — it now holds **2 real reviews**, so the section
  renders. **REAL reviews only — never invent them.** Add `{ quote, name, where?, stars? }` objects
  to populate. NOTE: one review is for the **"Road Trip Kindle Case"** — a retired make, correctly
  in Stories PAST_MAKES, not the shop. A review for a retired piece is fine (and is proof custom
  work already delights people); it just can't be clicked through to a listing — and it is
  deliberately **excluded from the `aggregateRating` markup** (see below), since it rates no
  shop category. Same pass also: `text-wrap: balance` on
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
  `availability` is already `schema.org/InStock` on all three (the shop is open).
  **`aggregateRating` + `review` are live on the Totes block only (2026-08-02)** — 5★, one review,
  Brea P.'s Strawberry Tote note, copied verbatim from `TESTIMONIALS` in js/main.js. The other real
  review is for the Road Trip Kindle Case, a retired custom make with no `Product` block, so it
  rates nothing here; Scrunchies and Bows have no reviews and carry no rating. Rules: markup must
  mirror what Kind Words actually renders (Google requires marked-up reviews be visible on the
  page), one review is counted once, and self-serving reviews may **not** go on the `Store` block.
  **Never invent a review or pad `reviewCount`** — add markup only when a real `TESTIMONIALS` entry
  backs it, and update both by hand.
- **Load the welcome sequence into Buttondown** — the 3 emails in `emails/welcome-sequence.md`
  are written but not yet set up as an automation in Buttondown, so new subscribers still get
  silence. Needs doing in the Buttondown dashboard (not in this repo).
- **Back-fill old subscribers into Buttondown** — anyone who joined before 2026-07-10 exists
  *only* as a Web3Forms notification in the Gmail inbox (free tier drops submissions after 30
  days). Export them from Gmail and import to Buttondown, or they never get the launch code.
- **ABANDONED-CART RECOVERY — researched 2026-08-06, DEFERRED by the owner ("not now but keep on
  agenda"). Don't build it unasked; don't re-research it either.** Two carts abandoned on
  2026-08-05 (Cauldron Forged Bow $12; Daily Grind in Ivory $16.56 with NEST10 already applied),
  which is what prompted this.
  - ⚠️ **Stripe does NOT send recovery emails for you.** It fires `checkout.session.expired` with
    `after_expiration.recovery.url` (a link that rebuilds the exact cart, valid 30 days) and you
    send the mail yourself. Easy thing to get wrong when scoping it.
  - ⚠️ **You only learn who they are if they entered an email AND ticked the consent box** before
    leaving. Needs `consent_collection[promotions]='auto'`. Both 2026-08-05 carts had
    `customer_details: null` — they left before typing anything, so recovery would NOT have
    reached either of them. Temper expectations about what this recovers.
  - Build: add `after_expiration[recovery][enabled]` (+ optional `allow_promotion_code`) and
    `consent_collection` to the session in worker/checkout-worker.js; handle
    `checkout.session.expired` on the **existing `/webhook` route** (it already verifies the Stripe
    signature for `checkout.session.completed` → Pushover); push the item, their email and the
    recovery URL to Pushover; **owner sends the email by hand from Gmail**, matching how
    emails/order-updates.md already works. No new service, no monthly cost, no Buttondown
    automation (paywalled). Then: add `checkout.session.expired` to the endpoint's events in the
    Stripe Dashboard, and `wrangler deploy`.
  - Also needed: **privacy.html must disclose** collecting emails from people who don't complete a
    purchase and that you may email them — Stripe's terms require it and the policy is silent today.
  - Optional: sessions expire after **24h** by default (min 30 min). Shortening to ~3h means the
    alert arrives while intent is still warm; the shopper's own cart lives in localStorage
    regardless, so they lose nothing but the Stripe tab.
- **Post-Purchase note** packaging insert — drafted copy the owner referenced, not yet in repo.
- Policies are plain-language, **not attorney-reviewed** — worth a Termly/TermsFeed pass before
  taking real payments.
