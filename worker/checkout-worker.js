/* Dragon Ink and Thread — Stripe Checkout Worker (Cloudflare)
   ----------------------------------------------------------------
   Turns a cart of {id, qty} items into a Stripe Checkout Session and
   returns its URL for the browser to redirect to. This is the ONLY place
   the Stripe SECRET key lives (as a Worker secret, never in the site).

   SECURITY: prices come from the PRICES map BELOW, never from the browser.
   A tampered request can only ever be charged the real price of a real id.

   DEPLOY: see worker/README.md. In short —
     1) npm i -g wrangler
     2) cd worker && wrangler login
     3) wrangler secret put STRIPE_SECRET_KEY   (paste your sk_live_... key)
     4) wrangler deploy
   Then give the printed https://…workers.dev URL to js/cart.js (CHECKOUT_URL).

   KEEP IN SYNC: the ids + prices below mirror PRODUCTS in js/shop-data.js.
   Amounts are in CENTS. When you add/retire a product or change a price,
   update it here too (this is the source of truth for what customers pay).
*/

const PRICES = {
  "tote-mustard-floral": { name: "Cottage Rose Tote",       amount: 2000 },
  "tote-blue-rose":      { name: "Blue Rose Mini Tote",     amount: 2000 },
  "tote-butterfly":      { name: "Butterfly Tote",          amount: 3800 },
  "tote-strawberry-v2":  { name: "Strawberry Tote",         amount: 3500 },
  "tote-storykeeper":    { name: "The Storykeeper",         amount: 3200 },
  "scrunchie-butterfly":       { name: "Butterfly Scrunchie",       amount: 600, maxQty: 3 },
  "scrunchie-cherry-blossom":  { name: "Cherry Blossom Scrunchie",  amount: 600, maxQty: 3 },
  "scrunchie-cherry":          { name: "Cherry Scrunchie",          amount: 600, maxQty: 3 },
  "scrunchie-orange-kitty":    { name: "Orange Kitty Scrunchie",    amount: 600, maxQty: 3 },
  "scrunchie-pink-bumble-bee": { name: "Pink Bumble Bee Scrunchie", amount: 600, maxQty: 3 },
  "scrunchie-pretty-in-pink":  { name: "Pretty in Pink Scrunchie",  amount: 600, maxQty: 3 },
  "scrunchie-wildflower":      { name: "Wildflower Scrunchie",      amount: 600, maxQty: 3 },
  "scrunchie-bundle":          { name: "Scrunchie Bundle (3)",      amount: 1500, maxQty: 3 },
  "scrunchie-byo-bundle":      { name: "Build Your Own Bundle",     amount: 1500, picks: 3 },
  "bow-gingham":      { name: "Gingham Bow",      amount: 1200 },
  "bow-sage-gingham": { name: "Sage Gingham Bow", amount: 1200 },
  "bow-cauldron-forged":   { name: "Cauldron Forged Bow",      amount: 1200 },
  "bow-toffee-plaid":      { name: "Toffee Plaid Bow",         amount: 1200 },
  "bow-roasted-roses":     { name: "Roasted Roses Bow",        amount: 1200 },
  "bow-daily-grind-ivory": { name: "Daily Grind Bow in Ivory", amount: 1200 },
  "bow-blushing-linen":    { name: "Blushing Linen Bow",       amount: 1200 },
  "bow-something-blue":    { name: "Something Blue Bow",       amount: 1200 },
  "bow-sidra-vines":       { name: "Sidra Vines Bow",          amount: 1200 },
  "bow-porcelain-roses":   { name: "Porcelain Roses Bow",      amount: 1200 },
  "bow-lace-of-velaris":   { name: "Lace of Velaris Bow",      amount: 1200 },
  "bow-suriels-bouquet":   { name: "Suriel's Bouquet Bow",     amount: 1200 },
  // Game Day — cut from one yard, so these carry maxQty like the scrunchies.
  "bow-gameday-darling":      { name: "Game Day Darling Bow",      amount: 1200, maxQty: 3 },
  "bow-gameday-darling-headband":   { name: "Game Day Darling Headband",      amount: 1400, maxQty: 2 },
  // ⛔ PULLED FOR THE Aug 21–24 TRIP (2026-08-19) — see js/shop-data.js LINKS.
  // Removed here too so a set already sitting in someone's localStorage cart cannot check out.
  // ↩️ RESTORE ON Tue 25, then wrangler deploy.
  // "bow-suriel-set":        { name: "Tea with the Suriel — the Set of Five", amount: 5500 },
  "bandana-storykeeper":   { name: "The Storykeeper Bandana",  amount: 1800 },
  "bandana-brew-and-bloom":    { name: "Brew and Bloom Bandana",    amount: 1800 },
  "bandana-quilted-court":     { name: "The Quilted Court Bandana", amount: 2200 },
  "sleeve-reading-nook":   { name: "Reading Nook Sleeve",      amount: 2800 },
  "home-suriel-tea-cover": { name: "The Suriel Tea Cover",     amount: 3500 },
};

/* Prints a "Build Your Own Bundle" may be built from: id → the short label
   used in the line-item name. MIRRORS BYO_PRINTS in js/shop-data.js. Anything
   not on this list is rejected, so a tampered request can't smuggle in a tote
   as a "print" or invent one. */
const PICKABLE = {
  "scrunchie-butterfly":       "Butterfly",
  "scrunchie-cherry-blossom":  "Cherry Blossom",
  "scrunchie-cherry":          "Cherry",
  "scrunchie-orange-kitty":    "Orange Kitty",
  "scrunchie-pink-bumble-bee": "Pink Bumble Bee",
  "scrunchie-pretty-in-pink":  "Pretty in Pink",
  "scrunchie-wildflower":      "Wildflower",
};

/* Shipping, in CENTS. One fee per order (never per item).
     SHIP_STANDARD  — the order holds something that needs a real mailer.
     SHIP_SMALL     — scrunchies/bows/bandanas only; fits a small poly mailer,
                      so a $6.50 fee on a $6 scrunchie stops looking absurd.
     FREE_SHIP_OVER — spend this much (before tax) and shipping is free.
                      Set to 0 to switch the free-shipping threshold off.
   Local pickup (San Antonio) is always $0 and is offered on every order. */
const SHIP_STANDARD  = 650;
const SHIP_SMALL     = 450;
const FREE_SHIP_OVER = 5000;

/* Which ids need the bigger mailer, by id prefix. This was a bare check for
   `tote-` until the Reading Nook Sleeve (2026-08-07): it is padded and rigid,
   so it posts like a tote despite being smaller and cheaper than one. A new
   category lands on SHIP_SMALL unless its prefix is listed here — so when you
   add one, decide which tier it belongs in rather than letting the default
   pick for you.
   ⚠️ js/cart.js mirrors this list (SHIPPING.standardPrefixes in
   js/shop-data.js) to write the drawer's shipping line. Change both together
   or the drawer will quote a fee the customer is not charged. */
const SHIP_STANDARD_PREFIXES = ["tote-", "sleeve-", "home-"];
const needsBigMailer = (id) =>
  SHIP_STANDARD_PREFIXES.some((p) => String(id).indexOf(p) === 0);

/* AWAY WINDOWS — dates the owner is travelling (added 2026-08-06).
   Local pickup is the one thing that genuinely breaks while she's away: a
   customer picks the free $0 option expecting to collect that afternoon, and
   nobody is home. Shipping is fine either way, because 1–3 business days
   still holds if the parcel goes out the day she returns.

   So during a window the pickup option keeps working but says WHEN it can be
   collected, right there in Stripe Checkout where the choice is made.

   ⚠️ MIRRORS `AWAY` in js/shop-data.js's sibling js/dates.js (which drives the
   site banner). Change both together, then `wrangler deploy` — this file is
   the one the customer actually reads at the moment of choosing. */
const AWAY = [
  { from: "2026-08-14T00:00:00-05:00", to: "2026-08-16T23:59:59-05:00", back: "Aug 17" },
  /* CONFIRMED 2026-08-16: Fri Aug 21 → Mon Aug 24, collectable again Tue Aug 25. */
  { from: "2026-08-21T00:00:00-05:00", to: "2026-08-24T23:59:59-05:00", back: "Aug 25" },
  /* The earlier unconfirmed version of this trip was never added — it was a maybe, and
     this label is a promise about when a customer can collect. To add a real trip:
     one more { from, to, back } here AND in js/dates.js, then `wrangler deploy`. */
];
function awayNow(now) {
  const n = now === undefined ? Date.now() : now;
  return AWAY.find((w) => n >= Date.parse(w.from) && n <= Date.parse(w.to)) || null;
}

// Where the site lives — used for success/cancel redirects and CORS.
const SHOP_ORIGIN = "https://www.dragoninkandthread.com";
// Origins allowed to call this Worker (production + local preview).
const ALLOWED_ORIGINS = [SHOP_ORIGIN, "https://dragoninkandthread.com", "http://localhost:8000"];

function corsHeaders(origin) {
  var allow = ALLOWED_ORIGINS.indexOf(origin) >= 0 ? origin : SHOP_ORIGIN;
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

function json(obj, status, origin) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: Object.assign({ "Content-Type": "application/json" }, corsHeaders(origin)),
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";

    // Stripe webhook (checkout.session.completed) → Pushover push.
    if (request.method === "POST" && url.pathname === "/webhook") {
      return handleWebhook(request, env, ctx);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, origin);
    }
    if (!env.STRIPE_SECRET_KEY) {
      return json({ error: "Server not configured" }, 500, origin);
    }

    let body;
    try { body = await request.json(); } catch (e) { return json({ error: "Bad request" }, 400, origin); }
    const items = Array.isArray(body && body.items) ? body.items : [];

    // Build server-priced line items (ignore any client-sent prices).
    const params = new URLSearchParams();
    let n = 0;
    let subtotal = 0;    // cents, pre-tax — decides the free-shipping threshold
    let bigMailer = false; // something in the cart needs the bigger (dearer) mailer
    for (const it of items) {
      const p = PRICES[it && it.id];
      if (!p) continue;

      // How many of this item may one order hold? maxQty defaults to 1, which
      // keeps every one-of-a-kind piece (totes, bows) unable to be double-sold.
      const asked = parseInt(it && it.qty, 10);
      let qty = Math.min(asked > 0 ? asked : 1, p.maxQty || 1);

      // "Build your own" items carry the shopper's chosen prints. Fold them into
      // the line-item NAME so they land on the Stripe receipt and in the Pushover
      // sale alert — otherwise the order arrives with nothing to sew from.
      let name = p.name;
      if (p.picks) {
        const chosen = Array.isArray(it.picks) ? it.picks : [];
        const labels = chosen.filter((c) => PICKABLE[c]).map((c) => PICKABLE[c]);
        if (labels.length !== p.picks) {
          return json({ error: `Please choose your ${p.picks} scrunchie prints.` }, 400, origin);
        }
        name += " — " + labels.join(", ");
        qty = 1; // one line = one set of picks
      }

      subtotal += p.amount * qty;
      if (needsBigMailer(it.id)) bigMailer = true;
      params.append(`line_items[${n}][quantity]`, String(qty));
      params.append(`line_items[${n}][price_data][currency]`, "usd");
      params.append(`line_items[${n}][price_data][unit_amount]`, String(p.amount));
      params.append(`line_items[${n}][price_data][tax_behavior]`, "exclusive");
      params.append(`line_items[${n}][price_data][product_data][name]`, name);
      n++;
    }
    if (n === 0) return json({ error: "Your cart is empty." }, 400, origin);

    params.append("mode", "payment");
    params.append("success_url", SHOP_ORIGIN + "/success.html?session_id={CHECKOUT_SESSION_ID}");
    params.append("cancel_url", SHOP_ORIGIN + "/shop.html");
    params.append("allow_promotion_codes", "true");           // NEST10 etc.
    params.append("automatic_tax[enabled]", "true");          // needs Stripe Tax enabled
    params.append("billing_address_collection", "auto");
    params.append("shipping_address_collection[allowed_countries][0]", "US");
    // One shipping fee per order + the local-pickup option. The fee depends on
    // what's in the cart (see the SHIP_* constants at the top of this file).
    let shipAmount = bigMailer ? SHIP_STANDARD : SHIP_SMALL;
    let shipLabel = "Standard shipping";
    if (FREE_SHIP_OVER > 0 && subtotal >= FREE_SHIP_OVER) {
      shipAmount = 0;
      shipLabel = "Free shipping";
    }
    params.append("shipping_options[0][shipping_rate_data][display_name]", shipLabel);
    params.append("shipping_options[0][shipping_rate_data][type]", "fixed_amount");
    params.append("shipping_options[0][shipping_rate_data][fixed_amount][amount]", String(shipAmount));
    params.append("shipping_options[0][shipping_rate_data][fixed_amount][currency]", "usd");
    // Local pickup says when it can actually be collected if she's travelling.
    const away = awayNow();
    const pickupLabel = away
      ? "Local pickup (San Antonio) — collect from " + away.back
      : "Local pickup (San Antonio)";
    params.append("shipping_options[1][shipping_rate_data][display_name]", pickupLabel);
    params.append("shipping_options[1][shipping_rate_data][type]", "fixed_amount");
    params.append("shipping_options[1][shipping_rate_data][fixed_amount][amount]", "0");
    params.append("shipping_options[1][shipping_rate_data][fixed_amount][currency]", "usd");

    const resp = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + env.STRIPE_SECRET_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const data = await resp.json();
    if (!resp.ok) {
      return json({ error: (data && data.error && data.error.message) || "Checkout could not start." }, 502, origin);
    }
    return json({ url: data.url }, 200, origin);
  },
};

/* ---- Sale notifications: Stripe webhook → Pushover push ----------------
   Stripe POSTs a signed "checkout.session.completed" event to /webhook.
   We verify the signature (STRIPE_WEBHOOK_SECRET), then push the item(s) +
   amount to your phone via Pushover (PUSHOVER_TOKEN + PUSHOVER_USER).
   All three are Worker secrets — see worker/README.md. */
async function handleWebhook(request, env, ctx) {
  if (!env.STRIPE_WEBHOOK_SECRET) return new Response("Webhook not configured", { status: 500 });
  const payload = await request.text();
  const sig = request.headers.get("Stripe-Signature") || "";
  const valid = await verifyStripeSig(payload, sig, env.STRIPE_WEBHOOK_SECRET);
  if (!valid) return new Response("Invalid signature", { status: 400 });

  let event;
  try { event = JSON.parse(payload); } catch (e) { return new Response("Bad JSON", { status: 400 }); }

  if (event.type === "checkout.session.completed" && env.PUSHOVER_TOKEN && env.PUSHOVER_USER) {
    // Send the push in the background so Stripe always gets a fast 200.
    ctx.waitUntil(notifySale(event.data.object, env));
  }
  return new Response("ok", { status: 200 });
}

async function notifySale(session, env) {
  // Pull the item names so the push says WHAT sold.
  let items = "New order";
  try {
    const r = await fetch(
      "https://api.stripe.com/v1/checkout/sessions/" + session.id + "/line_items?limit=20",
      { headers: { "Authorization": "Bearer " + env.STRIPE_SECRET_KEY } }
    );
    const d = await r.json();
    if (d && Array.isArray(d.data) && d.data.length) {
      items = d.data.map(function (li) {
        return (li.quantity > 1 ? li.quantity + "× " : "") + (li.description || "item");
      }).join(", ");
    }
  } catch (e) { /* fall back to "New order" */ }

  const amount = ((session.amount_total || 0) / 100).toFixed(2);
  const ship = session.shipping_cost;
  const fulfil = ship ? (ship.amount_total === 0 ? "📍 Local pickup" : "📦 Shipping") : "";
  const email = (session.customer_details && session.customer_details.email) || "";

  let message = items + " — $" + amount;
  if (fulfil) message += "\n" + fulfil;
  if (email) message += "\n" + email;

  await fetch("https://api.pushover.net/1/messages.json", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      token: env.PUSHOVER_TOKEN,
      user: env.PUSHOVER_USER,
      title: "New order! 🎉 Dragon Ink and Thread",
      message: message,
    }).toString(),
  });
}

// Verify Stripe's webhook signature (HMAC-SHA256) with Web Crypto.
async function verifyStripeSig(payload, header, secret) {
  const parts = {};
  header.split(",").forEach(function (p) {
    const i = p.indexOf("=");
    if (i > 0) parts[p.slice(0, i).trim()] = p.slice(i + 1).trim();
  });
  const t = parts.t, v1 = parts.v1;
  if (!t || !v1) return false;
  // Reject stale timestamps (>5 min) to prevent replay.
  if (Math.abs(Math.floor(Date.now() / 1000) - parseInt(t, 10)) > 300) return false;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(t + "." + payload));
  const expected = Array.from(new Uint8Array(mac)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  return timingSafeEqualHex(expected, v1);
}

function timingSafeEqualHex(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
