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
  "tote-sunflower":      { name: "Sunflower Tote",          amount: 4500 },
  "tote-mushroom":       { name: "Mushroom Tote",           amount: 2500 },
  "tote-mustard-floral": { name: "Cottage Rose Tote",       amount: 2000 },
  "tote-blue-rose":      { name: "Blue Rose Mini Tote",     amount: 2000 },
  "tote-butterfly":      { name: "Butterfly Tote",          amount: 3800 },
  "tote-strawberry-v2":  { name: "Strawberry Tote",         amount: 3500 },
  "scrunchie-butterfly":       { name: "Butterfly Scrunchie",       amount: 400 },
  "scrunchie-cherry-blossom":  { name: "Cherry Blossom Scrunchie",  amount: 400 },
  "scrunchie-cherry":          { name: "Cherry Scrunchie",          amount: 400 },
  "scrunchie-orange-kitty":    { name: "Orange Kitty Scrunchie",    amount: 400 },
  "scrunchie-pink-bumble-bee": { name: "Pink Bumble Bee Scrunchie", amount: 400 },
  "scrunchie-pretty-in-pink":  { name: "Pretty in Pink Scrunchie",  amount: 400 },
  "scrunchie-wildflower":      { name: "Wildflower Scrunchie",      amount: 400 },
  "scrunchie-strawberry":      { name: "Strawberry Scrunchie",      amount: 400 },
  "scrunchie-bundle":          { name: "Scrunchie Bundle (3)",      amount: 900 },
  "scrunchie-byo-bundle":      { name: "Build Your Own Bundle",     amount: 900 },
  "bow-sage":         { name: "Sage Bow",         amount: 1000 },
  "bow-gingham":      { name: "Gingham Bow",      amount: 1000 },
  "bow-sage-gingham": { name: "Sage Gingham Bow", amount: 1000 },
  "bow-blue-rose":    { name: "Blue Rose Bow",    amount: 1000 },
};

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
    for (const it of items) {
      const p = PRICES[it && it.id];
      if (!p) continue;
      // One of a kind — never sell more than one of an item per order.
      let qty = 1;
      params.append(`line_items[${n}][quantity]`, String(qty));
      params.append(`line_items[${n}][price_data][currency]`, "usd");
      params.append(`line_items[${n}][price_data][unit_amount]`, String(p.amount));
      params.append(`line_items[${n}][price_data][tax_behavior]`, "exclusive");
      params.append(`line_items[${n}][price_data][product_data][name]`, p.name);
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
    // One shipping fee per order + the local-pickup option (matches your links).
    params.append("shipping_options[0][shipping_rate_data][display_name]", "Standard shipping");
    params.append("shipping_options[0][shipping_rate_data][type]", "fixed_amount");
    params.append("shipping_options[0][shipping_rate_data][fixed_amount][amount]", "650");
    params.append("shipping_options[0][shipping_rate_data][fixed_amount][currency]", "usd");
    params.append("shipping_options[1][shipping_rate_data][display_name]", "Local pickup (San Antonio)");
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
