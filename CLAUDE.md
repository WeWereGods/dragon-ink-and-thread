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
- **Products** (name / price / cart id): Classic Tote $38 (`tote`), Scrunchie $4 (`scrunchie`),
  Bow $10 (`bow`). Prices live in TWO places that must stay in sync: the card markup in
  index.html and the `PRODUCTS` object in js/main.js.
- **Images**: `logo.png` is background-transparent (flood-filled from the original). Originals
  `logo-original.png` and `Tote.png` are kept locally but **gitignored**. Product cards use
  `<img>` with an `onerror` fallback to an emoji placeholder, so missing photos never look broken.
- **Brand name**: always spelled **"Dragon Ink and Thread"** (the word "and", never "&").
  Socials: `@dragonink_and_thread` (Instagram + TikTok).

## Local preview
Open `index.html` directly, or from the repo root run `python -m http.server 8000` and visit
http://localhost:8000. (Use a server so the `.html` links and fetch calls behave like production.)

## Open TODOs / nice-to-haves
- **Founder photo** → `assets/about.jpg`, swap into the "Your photo here" placeholder in the
  About/Our Story section (highest-trust element on the page).
- **Product photos** → `assets/scrunchie.jpg`, `assets/bow.jpg` (cards already wired for them).
- **Real fabric print names** in the product copy (e.g. "Wildflower Meadow" instead of generic).
- **Terms of Service** page (the footer currently links Privacy + Shipping only).
- **Email welcome sequence** (2–3 emails) + **Post-Purchase note** packaging insert — drafted
  copy the owner referenced but not yet in the repo.
- Policies are plain-language, **not attorney-reviewed** — worth a Termly/TermsFeed pass before
  taking real payments.
