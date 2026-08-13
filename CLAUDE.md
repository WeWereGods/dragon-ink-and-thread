# Dragon Ink and Thread — website

Shop site for **Dragon Ink and Thread**, a veteran-owned, small-batch handmade sewn-goods
shop in **San Antonio, Texas** (totes, scrunchies, bows, pet bandanas, book sleeves). **The
ready-made shop has been OPEN since 2026-07-01** and **CUSTOM ORDERS HAVE BEEN OPEN SINCE
2026-08-08** — this is no longer a pre-launch site in any sense. (Custom was Aug 15, then
Aug 17, then opened early; see below.) The launch PUSH is still Sat Aug 29. Brand voice: cozy cottagecore whimsy
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

## ⚠️ The REPO is the source of truth for copy — Google Drive is not
Decided by the owner 2026-08-09, when a **Dragon Ink and Thread** Drive folder was created
(subfolders: Orders, Bookkeeping, Photos, Policies, Marketing).

- **`emails/` and `marketing/` are written and edited HERE.** Drive holds finished assets —
  exported images, signed paperwork, receipts, the tax workbook — never the working copy of a
  caption, email or campaign plan.
- **Do not "sync" a copy of a repo file into Drive.** Two editable copies is exactly the drift
  that had the homepage advertising three of five categories and a retired bow on 2026-08-09.
  If something genuinely needs to live in Drive instead, move it and delete it here.
- The folder is in the `dragoninkandthread@gmail.com` Drive, at the root.

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
`fabrics.html` (71 fabrics for custom orders) is written from **js/fabrics-data.js**.
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
  **10–14 days** from agreeing the details, plus shipping (**quilts excepted: 8–12 weeks**, see
  the price-bands note). Keep the two clearly separate.
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
  - ⚠️ **ALWAYS `wrangler deploy` FROM `main`, AFTER PULLING.** Learned the hard way 2026-08-08:
    a deploy was run from a side branch that had the new photos but not the new `PRICES` entries,
    so it succeeded, printed success, and shipped a Worker that had never heard of the two new
    bandanas. The symptom is **"Your cart is empty"** at checkout on a brand-new item — the
    Worker skips ids it doesn't know (`if (!p) continue`), and an all-unknown cart looks empty.
    Nothing about the deploy looks wrong. `git checkout main && git pull` first, every time.
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
    worker/checkout-worker.js — **$6.50** if the cart holds anything whose id starts with a
    prefix in **`SHIP_STANDARD_PREFIXES`** (`tote-`, `sleeve-` as of 2026-08-07), **$4.50** for
    scrunchies/bows/bandanas only (fits a small mailer), **free** at a subtotal ≥ **$50**
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
  - ⚠️ **CUSTOM ORDERS OPENED EARLY, 2026-08-08.** `CUSTOM_OPENS` is now a past date, so the
    form is live and every countdown phrase has flipped to "Custom orders are open" on its own.
    **The static no-JS fallbacks were INVERTED to match** — `.js-post-open` is the unhidden
    default and `.js-pre-open` carries `hidden`, in index.html (×4), shop.html and custom.html.
    If the date is ever moved forward again, invert them back. terms.html was hand-edited too
    (it hard-codes, no span). The **push is still Sat Aug 29**. History follows:
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
      **Two more added 2026-08-08, both $18:** `bandana-toffee-windowpane` (**Medium, 13″–18″
      neck**) and `bandana-brew-and-bloom` (**Large, 18″–23″**, Brew and Bloom with Blushing
      Linen). The two sizes meet at 18″, so the range is continuous — the Medium is the first
      one in stock that isn't a Large, which is what makes small-dog households a real audience
      rather than a "made to order" footnote.
      ⚠️ **Both new ones are REVERSIBLE; the Storykeeper is NOT** — Brew and Bloom flips to
      Blushing Linen, Toffee Windowpane is the same plaid on both sides. The Storykeeper's
      listing now says single-sided in as many words, because a returning customer comparing the
      three would otherwise assume they are built the same way.
      **A fourth, 2026-08-09: `bandana-quilted-court`, "The Quilted Court Bandana", $22** —
      **Medium, 13″–18″**, hand-pieced patchwork of blush/sage florals, plaids and dots, backed
      in Blushing Linen (so reversible). **The first bandana that isn't $18**, priced up because
      the piecing is genuinely the longest job in the category; the patchwork is visible in the
      photo, which is what makes the gap defensible. Still `bandana-` prefixed → $4.50 small tier.
      ⚠️ **ALL FOUR use an ELASTICATED channel that stretches over the collar** (owner, 2026-08-09).
      The first three said "gathered channel slips over the collar", which described a different
      construction and undersold it — corrected in all four `details` on 2026-08-09.
    - **Book Sleeves** — a FIFTH category, added 2026-08-07. The Reading Nook Sleeve
      (`sleeve-reading-nook`, **$28**, 2 photos), **12″ × 8.5″**, quilted and padded, **open top
      with no closure** so it comes out one-handed. The Daily Grind outside under a Cinnamon
      Marble band, lined in Toffee Windowpane. **Ships on the $6.50 standard tier** — padded and
      rigid, so it posts like a tote; that's what `SHIP_STANDARD_PREFIXES` exists for. It also
      fills the empty $20–30 band, so a sleeve + a bow clears $40 and the free-shipping nudge
      finally has something to push toward.
- **CUSTOM price bands (owner-supplied 2026-08-05, live on custom.html in TWO places — the
  `custom-price-list` and the one-line summary above the form; change both together):**
  **REVISED 2026-08-11 — and they live in SEVEN places, not two.** Totes **$50–100** ·
  Book sleeves **$35–50** · Home pieces **$30–60** · Pet bandanas **$22–35** · Bows **$13–20** ·
  Scrunchies **$8–12** · **Quilts from $350, heirloom quilts from clothing from $650** ·
  **Repairs & mending from $40, no ceiling.**
  ⚠️ **QUILTS BREAK THE TURNAROUND (added 2026-08-12).** Every other band is a 10–14 day piece;
  a quilt is **8–12 weeks**. So the quilt band could not just be dropped into the seven lists —
  **every place that pairs a band with "10–14 days" also had to name the exception**, or the page
  publishes a price beside a promise it can't keep. That's custom.html (list + summary + the
  Timing paragraph), `emails/custom-orders-enquiry.md` (the costs line, the "How long it takes"
  paragraph, AND the DM quick reply), and both marketing files. **If a band with an unusual
  turnaround is ever added again, the timing copy is part of the change, not a follow-up.**
  The seven: `custom.html` (×2), `PRICE_BANDS` in tools/build-pin-images.js, §13 and §8 of
  `marketing/campaign-2026-08.md`, `marketing/fabric-collections-2026-08.md`, and — the one most
  easily missed and the one customers actually read — `emails/custom-orders-enquiry.md` (×2).
  ⚠️ **Book sleeves, home pieces and repairs were added because orders had already been taken in
  all three with no published band** (Linda's tea cover at $30 and quilt repair at $75, both
  quoted ad hoc). Publishing a band is what stops the next one being invented under pressure.
  ⚠️ **Repairs have NO ceiling on purpose** — one contained hole was $75; three tears and a
  rotten binding is a different job, and a range would be a promise made before seeing it.
  ⚠️ **custom.html's "Happily" / "Not my craft" lists are part of the bands — check them too.**
  Found 2026-08-13 listing **quilts** and **repairs and alterations** as NOT my craft, on the same
  page that sold both, two days after their bands went up and on the day a mending post started
  driving traffic to it. A price list and a refusal list that disagree is worse than either alone.
  Both moved to "Happily", and the repairs claim now carries a before/after of the quilt mend.
  ⚠️ **QUILTS were banded 2026-08-12** — from **$350**, heirloom-from-clothing from **$650**.
  Prompted by an enquiry for a memory quilt from a husband's wool jacket, trousers and
  poly-cotton shirts; **she withdrew on 2026-08-13 once she learned a wool quilt can't be machine
  washed.** Nothing was cut and no quote was sent, which is the disclosure working — the
  alternative was 40 hours in with a jacket already in pieces. **The band stays regardless**; it
  exists so a number can't be invented under pressure. custom.html now separates **cotton
  garments (washable) from wool (dry-clean only)**, because that distinction is what the lost
  enquiry turned on and most memory quilts are T-shirt quilts, which are unaffected. Full brief
  in TASKS.md. Do not reach for the tote band: that job is 35–55 hours and prices at **$650–950** for
  a throw. Memory quilts from tailored garments are the premium end of this — irreversible cutting,
  every piece interfaced, and not machine-washable afterwards. This is the third category to
  be *asked for* before it was priced — book sleeves, home pieces and repairs all got their bands
  retroactively, after a number had already been invented under pressure. **If a quilt is
  accepted, publish the band in all seven places before the next one is asked for.**
  ⚠️ **EVERY CUSTOM FLOOR MUST SIT ABOVE ITS READY-MADE EQUIVALENT** — bows $13 vs $12, sleeves
  $35 vs $28, bandanas $22 vs $18 — or the minimum paragraph's promise ("the ready-made ones in
  the shop are the same lovely thing for less") stops being literally true. **Scrunchies were
  $6–12, which TIED the $6 shop price and made that sentence false for that one category; the
  floor moved to $8 on 2026-08-11 to fix it.** If a shop price is ever changed, move its custom
  floor with it.
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

0. ⚠️ **GETTING A PHOTO INTO THE REPO AT ALL — this fails SILENTLY (learned 2026-08-13).**
   `assets/incoming/`, `assets/Incoming/`, `assets/Incoming-Products/` and `assets/Catalog/` are
   **gitignored**, and so is anything named `assets/IMG_*.jpg|jpeg|png`. A photo dropped in any of
   those is skipped by `git add` without a word, the commit succeeds, the push succeeds, and the
   branch arrives **empty** — which is exactly what happened when a photos branch was pushed with
   nothing on it. **Put uploads straight in `assets/` under an ordinary name**, then run
   `git status` and confirm the files are actually listed *before* committing. `git add -f` forces
   past the ignore; `git check-ignore -v <path>` says whether a given file is being swallowed.
   (The ignores are deliberate — they keep 188 MB of phone originals out of the repo. The trap is
   only that they are invisible.)
1. **Photo → `assets/`** — **`node tools/import-products.js <id>`** does this whole step. Drop
   the photos in **`assets/Incoming-Products/`** (gitignored; the script creates it) and run it:
   it bakes in EXIF rotation, resizes the long edge to 1400 at q82, writes `<id>.jpg`,
   `<id>-2.jpg`… in filename order (**first = hero shot**), and prints a ready-to-paste block for
   steps 2–7 below. `--crop` adds a 4:3 centre crop, off by default for the Cauldron Forged
   reason noted below. It deliberately does NOT edit shop-data.js or the Worker — those need
   decisions, and three of them fail silently. The manual equivalent, if you ever need it:
   quality 82. **Either orientation works** — `.catalog-photo` is
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
   `SHIP_STANDARD` only for ids whose prefix is in **`SHIP_STANDARD_PREFIXES`**, so any new
   category lands on `SHIP_SMALL` unless you add its prefix there (and in
   `SHIPPING.standardPrefixes` in js/shop-data.js, which the cart drawer reads).
   **Decide the tier deliberately** — it was a bare `tote-` test until the Reading Nook Sleeve
   needed tote postage on 2026-08-07, and the default would have quietly undercharged it.
6. **`PRICES` in `worker/checkout-worker.js`** (in **CENTS**) — ⚠️ **the Worker rejects any id it
   doesn't know, so checkout fails without this**, however good the rest looks.
7. **`wrangler deploy`** from `worker/` — step 6 does nothing until this runs.
8. **`node tools/build-products.js`** — writes the new product page + refreshes sitemap.xml.
9. **`node tools/build-catalog.js`** — rewrites `pinterest-catalog.csv`, the Pinterest
   product feed. Skip it and Pinterest simply never learns the piece exists.
10. **`node tools/bump-assets.js`** — restamps the `?v=` cache-busting tokens.
11. **Commit + push.** Pages redeploys; the piece is live.

The silent ones are **4, 6 and 7**: skip 4 and the piece looks fine but says "Coming soon"; skip
6 or 7 and it adds to the basket and then fails at checkout.
- **`**bold**` in a blurb now renders** (2026-08-09). `VARIANTS.blurb` in js/shop-data.js may
  carry `**bold**` — the only markdown allowed there. It becomes `<strong>` on the catalog card
  (`mdBold()` in js/shop.js) and the product page (`mdBold()` in tools/build-products.js), and is
  **stripped** for the meta description and JSON-LD (`stripMd()`), where a tag would be worse than
  the asterisks. Nothing rendered it before, so `**Reversible:**` sat on the live Brew and Bloom
  card and page for a day with its asterisks showing. **The two `mdBold()` copies must stay
  identical**, or a card and its product page will disagree — same rule as `catSlug()`.
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
- **Analytics is live**: Cloudflare Web Analytics (cookieless) via a beacon in each page's
  footer; the token is public by design. View stats at Cloudflare dashboard → Web Analytics.
  Works without moving DNS to Cloudflare.
- ⚠️ **PINTEREST TAG since 2026-08-09 — this is ADVERTISING, not analytics, and the rules
  differ.** Tag `2614418318675`, sitting immediately above the Cloudflare beacon on all 41
  pages (404.html has neither, matching the existing convention). Cloudflare is cookieless and
  needs no consent; Pinterest **is "sharing" for cross-context behavioral advertising under
  California's CPRA**, which is a defined legal term. Three things hold it together — change
  them together or the policy starts lying:
  - **No Enhanced Match.** Pinterest's copy-paste snippet ends `{em: '<user_email_address>'}`,
    a placeholder for the VISITOR's email. This site has no login, so there is nobody's address
    to send; pasted literally it posts the string `<user_email_address>` on every page load.
    **Never add `em` back** without a real, consented address.
  - **GPC gate.** The tag is wrapped in `if (navigator.globalPrivacyControl !== true)`, so it
    never loads for visitors signalling opt-out. Verified 2026-08-09 by running the inline
    script in an iframe with GPC forced both ways: on → `pintrk` undefined and no `s.pinimg.com`
    script; off → both present. The `<noscript>` pixel was **deliberately dropped** — it would
    fire regardless of GPC.
  - **privacy.html says all of this** (sections 3, 8 and 10, "Last updated" bumped). It used to
    promise "We will not sell or share personal information in the future", which the tag made
    false on arrival. Section 8 also had to stop saying we ignore "any other mechanism that
    automatically communicates your choice not to be tracked" — that flatly contradicted the
    GPC gate.
  - It lives in **both page generators**, so product and fabric pages keep it on rebuild.
  - **Conversion tracking is live (2026-08-09).** js/cart.js writes `dit-pending-order`
    (subtotal + qty + timestamp) into localStorage **only once the Worker has returned a
    checkout URL**, so an abandoned or failed attempt leaves nothing to be miscounted as a
    sale. success.html reads it, **removes it before firing**, and reports
    `pintrk('track', 'checkout', …)`. Two guards, both tested: the key is deleted first so a
    reload or a bookmarked thank-you page cannot invent a second order, and anything older
    than 6h is ignored as a stale tab. Value is the **subtotal only** — Stripe adds tax and
    shipping afterwards, and the ad should not get credit for postage.
- **⚠️ PINTEREST PRODUCT CATALOG — `node tools/build-catalog.js`** writes
  **`pinterest-catalog.csv`** (33 products) at the repo root, generated from js/shop-data.js
  like sitemap.xml. Pinterest fetches
  `https://www.dragoninkandthread.com/pinterest-catalog.csv` on its own schedule and makes
  each row a shoppable Product Pin. **Re-run it on any shop-data change** (it is step 9 of
  ADDING A NEW PIECE).
  - ⚠️ **THE ONE-OF-A-KIND TRAP: when a piece sells, set `soldOut: true` FIRST and retire it
    to Stories a few days later.** The two exits behave differently — `soldOut` keeps the
    product page alive, so the feed says "out of stock" and the Pin greys out; *retiring*
    deletes the page, so until Pinterest re-reads the feed a Pin can land on a 404. This is
    the only place that ordering matters, and it cuts against the 2026-08-05 preference for
    retiring immediately. 404.html is a real page with a route back to the shop, so a stale
    Pin is survivable — but it is the safety net, not the plan.
  - "In stock" requires **both** `!soldOut` **and** presence in `LINKS` — an id missing from
    `LINKS` can't actually be bought, so advertising it would send people to a dead end.
  - **`id` must never be recycled** for a different piece; it is how Pinterest recognises a
    product it has already seen.
- **Social share card** = **`assets/og-image-v2.jpg`** (1200×630), referenced by index, shop,
  custom and fabrics. ⚠️ **The v1 file had "Opening Late August" baked into the pixels** and was
  still being served as the Facebook preview after the shop opened. v2 is the same artwork
  scaled and cropped so the dated line falls outside the frame — logo and wordmark kept, **no
  text that can ever go stale**. Don't put a date in a share card; it is an image, so no amount
  of editing HTML fixes it.
  ⚠️ **Facebook caches OG images hard, keyed on URL.** That's why v2 is a NEW filename rather
  than a replacement — new shares fetch it immediately. Anything already posted keeps the old
  card until the URL is re-scraped in the **Sharing Debugger**
  (developers.facebook.com/tools/debug → paste the URL → Scrape Again).

## ⚠️ The live task list is `TASKS.md` — read it at the start of a session
Created 2026-08-06 because the outstanding work only existed in conversation, so the owner had
to ask what was on it. **Customer-owed work sits at the top**; dates are absolute, never
relative. Update it as things land rather than letting it rot — a stale task list is worse than
none. The section below is longer-lived engineering context; **TASKS.md is what's actually due.**

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
  renders. **REAL reviews only — never invent them.**
  ⚠️ **"Brea P." IS Aubrea Pritt**, the custom bow-clip customer in TASKS.md (confirmed by the
  owner 2026-08-13). Two names for one person across the repo — **don't count her as two
  customers**. She bought a tote and a scrunchie, reviewed them five stars, then commissioned
  custom work; Linda went the same way from a $30 tea cover to a $1,100 commission. **Both repeat
  customers converted from a small first purchase**, which is the Aug 29 push's best argument and
  is currently unused in the campaign copy. Add `{ quote, name, where?, stars? }` objects
  to populate. NOTE: **two of the three rate CUSTOM makes, not shop listings** — the **"Road Trip
  Kindle Case"** (a retired make, correctly in Stories PAST_MAKES) and **Cassidy E.'s music-print
  tote** (added 2026-08-12, a one-off commission that was never listed; **she left an actual
  five-star rating — the stars on that card are hers, not inferred from the tone**, confirmed by
  the owner the day it went in). Reviews of unbuyable
  pieces are fine, and are the best proof custom work already delights people; they just can't be
  clicked through to a listing — and both are deliberately **excluded from the `aggregateRating`
  markup** (see below), since neither rates a shop category. ⚠️ **Cassidy's is the only review the
  site holds that describes the custom PROCESS** ("she found the most beautiful and unique music
  fabric for me as a music teacher") rather than a finished object — which is exactly the thing the
  Aug 29 push has to argue. Same pass also: `text-wrap: balance` on
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
- **Product structured data is live** → **5** `Product` JSON-LD blocks (Totes / Scrunchies / Bows /
  Pet Bandanas / Book Sleeves)
  with `AggregateOffer` price ranges sit in index.html `<head>`, alongside the brand-level `Store`
  block. Prices are **static** there — keep them in sync with **js/shop-data.js** (NOT main.js,
  whose PRODUCTS copy is vestigial and still carries the pre-2026-07-30 prices).
  ⚠️ **NOTHING REGENERATES THESE — they drift silently.** The Pet Bandanas block sat at
  `highPrice: 18.00` from 2026-08-09, when the $22 Quilted Court was added, until 2026-08-12.
  No build step touches index.html, so a new piece or a `soldOut` flag updates the cards, the
  product pages, the sitemap and the Pinterest feed while the markup quietly keeps saying the
  old thing. **Audit is one command** — recompute in-stock count and min/max price per category
  from `CATALOG`/`PRODUCTS`/`LINKS` and diff against the blocks; do it after ANY shop-data change,
  not just a price change.
  `availability` is already `schema.org/InStock` on all three (the shop is open).
  **`aggregateRating` + `review` are live on the Totes block only (2026-08-02)** — 5★, one review,
  Brea P.'s Strawberry Tote note, copied verbatim from `TESTIMONIALS` in js/main.js. **The other two
  real reviews both rate custom makes and are excluded**: the Road Trip Kindle Case (retired, no
  `Product` block) and Cassidy E.'s music-print tote (a commission, not one of the totes the block
  offers). ⚠️ **Cassidy's is the tempting one — it is literally about a tote, so it looks like it
  belongs in the Totes block.** It doesn't: that block declares `InStock` over a fixed set of
  listings, and its rating may only reflect reviews OF those listings. `reviewCount` stays **1**.
  Scrunchies and Bows have no reviews and carry no rating. Rules: markup must
  mirror what Kind Words actually renders (Google requires marked-up reviews be visible on the
  page), one review is counted once, and self-serving reviews may **not** go on the `Store` block.
  **Never invent a review or pad `reviewCount`** — add markup only when a real `TESTIMONIALS` entry
  backs it, and update both by hand.
- **Load the welcome sequence into Buttondown** — the 3 emails in `emails/welcome-sequence.md`
  are written but not yet set up as an automation in Buttondown, so new subscribers still get
  silence. Needs doing in the Buttondown dashboard (not in this repo).
- ~~Back-fill old subscribers into Buttondown~~ — **DONE 2026-07-31** (confirmed 2026-08-09).
  Pre-2026-07-10 signups existed only as Web3Forms notifications in Gmail; they were exported and
  imported, and Email 1 has since reached the whole list, so everyone holds NEST15. **Don't
  re-raise it** — it stayed written as open here and in TASKS.md for over a week after it was
  finished, which is how a task list starts costing more than it saves.
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
  - **MEASURED 2026-08-08, whole account history — 31 Checkout sessions: 5 paid, 25 expired,
    1 open.** Read from the Stripe API, not estimated.
    - ⚠️ **ZERO of the 26 unpaid sessions captured an email.** Not one. Every session carries
      `consent_collection.promotions: "none"` and `after_expiration: null`, so no recovery URL
      was ever minted and there would have been nobody to send one to. The 2-cart finding above
      now holds at 26 for 26. **This is the number that decides whether recovery is worth
      building**: as things stand it would recover nothing, and it only starts working for carts
      abandoned AFTER the consent box is switched on.
    - Where they leave is now known: Stripe collects the email **on the payment page**, so these
      people reached that page and left before typing. They bounced at first sight of the real
      total, not mid-form.
    - **The raw 25 badly overstates it.** The expired sessions cluster on build days — eight on
      Jul 29 (cart + Worker went live), including `$45` three times and a `$141.50`, two in the
      same minute; three on Jul 30 (tiered shipping day), `$41.50` twice six minutes apart; six
      on Jul 14–15 before the cart existed. Those are almost certainly the owner's own testing.
      One "sale" is a self-test too (`dragoninkandthread@gmail.com`, Jul 15, $10.10).
    - **Genuine abandonments look like seven:** Jul 30 $19.50 · Aug 2 $21.11 · Aug 2 $45.05 ·
      Aug 4 $38.50 · Aug 5 $16.56 · Aug 5 $12.00 · Aug 7 $34.50 (still open). Against 4 real
      sales that is **~36% of people who reach the payment page paying** — unremarkable for a
      shop this young, and not the emergency the raw count suggests.
    - Worth a squint: `$45.05`, and `$41.50` twice, all sit **just under the $50 free-shipping
      line**, where the buyer is shown $6.50 postage they could have avoided. The drawer's
      "add $X more" nudge only appears once the drawer is open — never on the Stripe page where
      they actually left. **Surfacing that earlier is a cheaper experiment than recovery**, and
      it does not need consent, a webhook, or a privacy-policy change.
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
