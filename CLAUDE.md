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
css/styles.css        Whole theme via CSS custom properties (:root). Teal + pale-pink + honey.
js/main.js            Mobile nav, scroll-reveal, footer year, Join-the-Nest + Contact form
                      submit handlers, and the shop/cart/checkout mockup.
assets/               logo.png (transparent), tote.jpg. See assets/README.txt.
```

## Key facts / gotchas
- **Domain/DNS**: registered at **Wix** (nameservers ns8/ns9.wixdns.net). `www` is a CNAME
  → `weweregods.github.io`; apex has the 4 GitHub A records. HTTPS cert is issued and
  **Enforce HTTPS is ON**. If HTTPS ever breaks, the fix that worked was: Settings → Pages →
  clear the custom domain, Save, wait, re-enter `www.dragoninkandthread.com`, Save.
  Do NOT let Wix "connect the domain to a Wix site" — that hijacks DNS to a parking page.
- **Email (contact + newsletter)**: both forms POST to **Web3Forms** (static-friendly, no
  backend). Access key is in the HTML (submit-only, safe to expose). Submissions land in
  **dragoninkandthread@gmail.com**. Contact subject: "New message from dragoninkandthread.com";
  signup subject: "New Nest subscriber". Free tier = 250/month. Upgrade path: Mailchimp/Buttondown.
- **Checkout is a VISUAL MOCKUP only** — no real payments. A static Pages site can't process
  payments; for real orders use Stripe Payment Links, or move to Shopify / a host with
  serverless functions. The code comments in js/main.js explain this.
- **Products** (name / price / cart id): the Shop has 4 cards. Two are **variant cards** with
  a `<select>` print/style picker + thumbnail gallery (`.card-variant` in index.html, wired by
  `initVariantCards()` in js/main.js):
    - **Totes** — Fairy Tote $38 (`tote-fairy`), Floral Tote $38 (`tote-floral`),
      Sunflower Tote $45 (`tote-sunflower`, the puffy woven one).
    - **Cozys** — Blue Bee Cozy $8 (`cozy-bee`, slim can), Daisy Cozy $8 (`cozy-daisy`, cup/tumbler).
    - **Scrunchie** $4 (`scrunchie`), **Bow** $10 (`bow`) — plain cards.
  Each print/style is its own cart id. Prices/copy live in THREE places that must stay in sync:
  the `<option>` labels in index.html, the `PRODUCTS` object in js/main.js (price of record),
  and the `VARIANTS` map in js/main.js (per-variant photos, blurb, details). To add a print:
  drop the photo in assets/, add a `VARIANTS` + `PRODUCTS` entry, and an `<option>` to that select.
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

## Open TODOs / nice-to-haves
- **Founder photo** → `assets/about.jpg`, swap into the "Your photo here" placeholder in the
  About/Our Story section (highest-trust element on the page).
- **Product photos** → `assets/scrunchie.jpg`, `assets/bow.jpg` (cards already wired for them).
- **Scrunchie & Bow → variant pickers** (owner requested): once photos of the different
  scrunchie/bow prints arrive, convert those two plain cards into `.card-variant` cards with a
  print dropdown + thumbnail gallery, exactly like the Totes/Cozys cards (add `PRODUCTS` +
  `VARIANTS` entries per print and `<option>`s to each select). Pricing decided:
    - Scrunchie prints all **$4**; add a **3-scrunchie bundle for $9** (`scrunchie-bundle`,
      owner has a group photo to upload). Bow prints all **$10**.
- **Real fabric print names** in the product copy (e.g. "Wildflower Meadow" instead of generic).
- **Terms of Service** page (the footer currently links Privacy + Shipping only).
- **Email welcome sequence** (2–3 emails) + **Post-Purchase note** packaging insert — drafted
  copy the owner referenced but not yet in the repo.
- Policies are plain-language, **not attorney-reviewed** — worth a Termly/TermsFeed pass before
  taking real payments.
