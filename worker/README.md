# Checkout Worker — setup & deploy

This small Cloudflare Worker turns the site's cart into a Stripe Checkout
Session. It's the only place the Stripe **secret** key lives. The website
(GitHub Pages) never sees it.

## One-time setup (you do this — I can't, it needs your secret key)

You'll need your **Cloudflare account** (the same one as your Web Analytics)
and your Stripe **secret** key.

1. **Install Wrangler** (Cloudflare's CLI). With Node installed, run:
   ```bash
   npm install -g wrangler
   ```

2. **Log in to Cloudflare:**
   ```bash
   wrangler login
   ```
   (opens a browser to authorize)

3. **Get your Stripe secret key:** Stripe Dashboard → Developers → API keys →
   **Secret key** (starts with `sk_live_…`). Click "Reveal" and copy it.
   Treat it like a password — it can move money. Don't paste it anywhere public.

4. **Store the key as a Worker secret** (from inside this `worker/` folder):
   ```bash
   wrangler secret put STRIPE_SECRET_KEY
   ```
   Paste the `sk_live_…` key when prompted. It's encrypted; it never lives in
   this repo.

5. **Deploy:**
   ```bash
   wrangler deploy
   ```
   Wrangler prints a URL like `https://dit-checkout.<your-subdomain>.workers.dev`.

6. **Send me that URL.** I'll drop it into `js/cart.js` (the `CHECKOUT_URL`
   constant) so the cart's checkout button points at it.

## Stripe requirements

- **Stripe Tax** must be enabled (Dashboard → Tax) for `automatic_tax` to work,
  with a default product tax category set. If checkout errors about tax, that's
  the fix — or tell me and I'll turn auto-tax off in the Worker.
- Promo codes (e.g. `NEST10`) work automatically via the "Add promotion code"
  field on the Stripe checkout page.
- Shipping: the Worker adds **Standard shipping ($6.50)** and **Local pickup
  (San Antonio) — $0** as the two options, so a whole cart pays one shipping
  fee (not per item).

## Keeping prices correct

`checkout-worker.js` has its own `PRICES` map (in cents). This is the
**source of truth for what customers are charged** — the browser can't
override it. When you add/retire an item or change a price in
`js/shop-data.js`, update `PRICES` here too, then `wrangler deploy` again.

## Updating later

Any change to `checkout-worker.js` → re-run `wrangler deploy`. The URL stays
the same, so nothing on the site needs to change.
