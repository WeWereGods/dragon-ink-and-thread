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

## Sale notifications (Pushover) — get a phone push when something sells

The Worker can push a notification to your phone on each completed order
(item names + amount) via **Pushover**. One-time setup:

1. **Pushover app + keys.** Install **Pushover** (iOS/Android — 30-day free
   trial, then a one-time ~$5). Sign up, and from the app or
   [pushover.net](https://pushover.net) copy your **User Key**.
2. **Create a Pushover application.** On pushover.net → *Create an
   Application/API Token* (name it e.g. "Dragon Ink Orders") → copy its
   **API Token**.
3. **Add the Stripe webhook.** Stripe Dashboard → **Developers → Webhooks →
   Add endpoint**:
   - Endpoint URL: `https://dit-checkout.dragoninkandthread.workers.dev/webhook`
   - Events to send: **`checkout.session.completed`**
   - After creating it, click the endpoint → **reveal the Signing secret**
     (starts with `whsec_…`) and copy it.
4. **Store the three secrets** (from inside this `worker/` folder):
   ```bash
   wrangler secret put PUSHOVER_TOKEN          # paste the API Token
   wrangler secret put PUSHOVER_USER           # paste the User Key
   wrangler secret put STRIPE_WEBHOOK_SECRET   # paste the whsec_… signing secret
   ```
5. **Deploy:** `wrangler deploy`.
6. **Test:** in the Stripe webhook page, click **Send test webhook →
   `checkout.session.completed`**, or make a real test purchase. You should get
   a Pushover push within a second or two.

Notes: the push says what sold, the total, and pickup-vs-shipping. The webhook
signature is verified, so only Stripe can trigger it. If the Pushover secrets
aren't set, checkout still works fine — you just won't get the push.
