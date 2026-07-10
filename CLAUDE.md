# Dragon Ink and Thread — website

Marketing / pre-launch site for **Dragon Ink and Thread**, a veteran-owned, small-batch
handmade sewn-goods shop in **San Antonio, Texas** (totes, scrunchies, bows). Opening
**late August**. Brand voice: cozy cottagecore whimsy for book lovers and dreamers; the
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
                      Page background = assets/web-background.jpg (dragon + florals
                      wallpaper) pinned as `background: ... fixed` on `body` (cover, no
                      repeat — the art isn't seamless, so fixed-cover avoids tiling seams).
                      Sections use translucent cream (`.section`) / rose (`.section-tint`)
                      panels so the wallpaper reads through softly while text stays legible;
                      the hero veil is lighter so the pattern shows more there.
                      NOTE: CSS url() is relative to css/, so asset paths need `../assets/`.
js/main.js            Mobile nav, scroll-reveal, footer year, Join-the-Nest + Contact form
                      submit handlers, and the shop/cart/checkout mockup.
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
- **Checkout = pre-launch Join-the-Nest (no real payments)**: browsing + the basket drawer work,
  but the "Join the Nest to shop first →" button opens a converted checkout view (`#view-checkout`)
  that shows an order-summary preview + an email signup (`#nestFormCheckout`, same Web3Forms
  handler as the hero) instead of a fake payment form. There is no fake card/confirmation anymore.
  For real orders after launch, use Stripe Payment Links or move to Shopify / serverless functions.
- **Products** (name / price / cart id): the Shop has 5 cards, all **variant cards** with
  a `<select>` print/style picker + thumbnail gallery (`.card-variant` in index.html, wired by
  `initVariantCards()` in js/main.js):
    - **Totes** — Fairy Tote $38 (`tote-fairy`), Floral Tote $38 (`tote-floral`),
      Sunflower Tote $45 (`tote-sunflower`, the puffy woven one), Mushroom Tote $25 (`tote-mushroom`),
      Mustard Rose Tote $20 (`tote-mustard-floral`), Blue Rose Tote $20 (`tote-blue-rose`, 3-photo gallery).
    - **Cozys** — Blue Bee Cozy $8 (`cozy-bee`, slim can), Daisy Cozy $8 (`cozy-daisy`, cup/tumbler).
    - **Scrunchies** — 7 prints @ $4 each (`scrunchie-butterfly`, `-cherry-blossom`, `-cherry`,
      `-orange-kitty`, `-pink-bumble-bee`, `-pretty-in-pink`, `-wildflower`) + a **Bundle of 3**
      @ $9 (`scrunchie-bundle`, red/cream/navy solids) as the last `<option>`.
    - **Bows** $10 each — Sage Bow (`bow-sage`), Gingham Bow (`bow-gingham`, taupe),
      Sage Gingham Bow (`bow-sage-gingham`), Blue Rose Bow (`bow-blue-rose`).
    - **Blooms** $10 each — hand-folded fabric flower **hair clips**: Cream Bloom (`bloom-cream`),
      Pink Bloom (`bloom-pink`).
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
- **New-tote specs are placeholder copy** → Mushroom / Mustard Rose / Blue Rose totes use generic
  `details` ("Roomy everyday tote · spot clean…") in `VARIANTS` because real dimensions/lining
  weren't given. Fill in true size + whether lined when known. (Prices set by owner: $25/$20/$20.)
- **Orange Kitty scrunchie photo** is still the old 320×240 (soft on retina). All other
  scrunchie prints + the bundle were upgraded to ~1280px hi-res; swap Orange Kitty when a
  larger shot is available (drop it in and optimize over `assets/scrunchie-orange-kitty.jpg`).
- **At launch: Product structured data** — add JSON-LD `Product` blocks (per shop card) with
  `AggregateOffer` price ranges. Deferred until the shop is transactional: use `PreOrder` now →
  flip to `InStock` at launch, and add `aggregateRating` once real reviews exist (never fake them).
  Brand-level `Store` JSON-LD already lives in index.html `<head>`.
- **Load the welcome sequence into Buttondown** — the 3 emails in `emails/welcome-sequence.md`
  are written but not yet set up as an automation in Buttondown, so new subscribers still get
  silence. Needs doing in the Buttondown dashboard (not in this repo).
- **Back-fill old subscribers into Buttondown** — anyone who joined before 2026-07-10 exists
  *only* as a Web3Forms notification in the Gmail inbox (free tier drops submissions after 30
  days). Export them from Gmail and import to Buttondown, or they never get the launch code.
- **Post-Purchase note** packaging insert — drafted copy the owner referenced, not yet in repo.
- Policies are plain-language, **not attorney-reviewed** — worth a Termly/TermsFeed pass before
  taking real payments.
