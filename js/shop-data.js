/* Dragon Ink and Thread — shared shop data (single source of truth).
   Loaded by BOTH the homepage (js/main.js) and the full catalog page
   (shop.html → js/shop.js) so product info + Stripe links never drift.

   To add / edit a product: change it HERE.
     - PRODUCTS: name + price + emoji fallback (+ optional `soldOut: true`,
                 `maxQty: N`, `picks: N`)
     - VARIANTS: alt text, blurb, details, photo(s)
     - LINKS:    the item's live Stripe Payment Link (omit = "Coming soon")
     - CATALOG:  the order + grouping shown on the catalog page
     - BYO_PRINTS: which prints "Build Your Own Bundle" may be built from

   QUANTITIES: `maxQty` is how many of one item a single order may contain.
   **It defaults to 1** — totes and bows are one-of-a-kind, so leaving it off is
   the safe choice. Scrunchies are sewn from yardage and can be remade, so they
   carry `maxQty: 3`. The Worker enforces this again server-side; changing it
   here alone does nothing to what a customer can actually buy.

   BUILD YOUR OWN BUNDLE: `picks: 3` means "the shopper chooses 3 prints from
   BYO_PRINTS before this can go in the basket". The chosen prints ride along in
   the cart, get validated by the Worker, and end up in the Stripe line-item name
   (so they appear on the receipt AND in the Pushover sale alert — that's how you
   know what to sew). `maxQty` stays 1 on it: one line = one set of picks.

   SOLD OUT (one-of-a-kind pieces): add `soldOut: true` to a PRODUCTS entry —
   its catalog card shows a "Sold" badge, the button reads "Sold out" (can't be
   added to cart), and commit/push to update the live site. To fully retire a
   sold piece, move it to the Stories lookbook (PAST_MAKES in js/main.js) as
   usual. (Hard server-side block: also remove its line from PRICES in
   worker/checkout-worker.js and `wrangler deploy` — optional at this volume.)
*/
window.DIT_SHOP = {
  // Ready-made shop is OPEN for orders (Buy buttons live). A past date keeps
  // shopOpen === true. Custom (made-to-order/personalized) orders open Aug 15,
  // 2026 — that date lives in the countdown (LAUNCH) in js/main.js.
  SHOP_OPENS: "2026-07-01T09:00:00-05:00",

  /* Display-only mirror of the Worker's shipping rules, in DOLLARS (the Worker
     holds them in cents and is the authority on what a customer is actually
     charged). KEEP IN SYNC with SHIP_STANDARD / SHIP_SMALL / FREE_SHIP_OVER at
     the top of worker/checkout-worker.js.
     Read by js/cart.js (the drawer's shipping line + the "add $X more" nudge)
     and tools/build-products.js (the free-shipping line on product pages), so
     the number lives in ONE place on the client instead of being retyped in
     each of them. */
  SHIPPING: { standard: 6.5, small: 4.5, freeOver: 50 },

  PRODUCTS: {
    "tote-storykeeper":   { name: "The Storykeeper",   price: 32.0, art: "📚" },
    "tote-sunflower":     { name: "Sunflower Tote",     price: 45.0, art: "🌻", soldOut: true },
    "tote-mushroom":      { name: "Mushroom Tote",      price: 25.0, art: "🍄", soldOut: true },
    "tote-mustard-floral":{ name: "Cottage Rose Tote",  price: 20.0, art: "🌹" },
    "tote-blue-rose":     { name: "Blue Rose Mini Tote", price: 20.0, art: "🌷" },
    "tote-butterfly":     { name: "Butterfly Tote",     price: 38.0, art: "🦋" },
    "tote-strawberry-v2": { name: "Strawberry Tote",    price: 35.0, art: "🍓" },
    "scrunchie-butterfly":      { name: "Butterfly Scrunchie",       price: 6.0, art: "🦋", maxQty: 3 },
    "scrunchie-cherry-blossom": { name: "Cherry Blossom Scrunchie",  price: 6.0, art: "🌸", maxQty: 3 },
    "scrunchie-cherry":         { name: "Cherry Scrunchie",          price: 6.0, art: "🍒", maxQty: 3 },
    "scrunchie-orange-kitty":   { name: "Orange Kitty Scrunchie",    price: 6.0, art: "🐱", maxQty: 3 },
    "scrunchie-pink-bumble-bee":{ name: "Pink Bumble Bee Scrunchie", price: 6.0, art: "🐝", maxQty: 3 },
    "scrunchie-pretty-in-pink": { name: "Pretty in Pink Scrunchie",  price: 6.0, art: "🎀", maxQty: 3 },
    "scrunchie-wildflower":     { name: "Wildflower Scrunchie",      price: 6.0, art: "🌼", maxQty: 3 },
    "scrunchie-strawberry":     { name: "Strawberry Scrunchie",      price: 6.0, art: "🍓", maxQty: 3 },
    "scrunchie-bundle":         { name: "Scrunchie Bundle (3)",      price: 15.0, art: "🎀", maxQty: 3 },
    "scrunchie-byo-bundle":     { name: "Build Your Own Bundle",     price: 15.0, art: "🎀", picks: 3 },
    "bow-sage":         { name: "Sage Bow",         price: 10.0, art: "🎗️", soldOut: true },
    "bow-gingham":      { name: "Gingham Bow",      price: 10.0, art: "🎀" },
    "bow-sage-gingham": { name: "Sage Gingham Bow", price: 10.0, art: "🎀" },
    "bow-blue-rose":    { name: "Blue Rose Bow",    price: 10.0, art: "🎀", soldOut: true },
    "bow-cauldron-forged":   { name: "Cauldron Forged Bow",     price: 10.0, art: "🖤" },
    "bow-toffee-plaid":      { name: "Toffee Plaid Bow",        price: 10.0, art: "🎀" },
    "bow-roasted-roses":     { name: "Roasted Roses Bow",       price: 10.0, art: "🌹" },
    "bow-daily-grind-ivory": { name: "Daily Grind Bow in Ivory", price: 10.0, art: "☕" },
    "bow-blushing-linen":    { name: "Blushing Linen Bow",      price: 10.0, art: "🎀" },
    "bandana-storykeeper":   { name: "The Storykeeper Bandana", price: 18.0, art: "🐾" }
  },

  VARIANTS: {
    "tote-storykeeper": {
      alt: "Handmade tote printed with shelves of antique books and potion bottles on black, hanging from a long black strap",
      blurb: "Shelves of old books and apothecary bottles stacked to the ceiling, printed deep on black — the library you'd happily get lost in. Lined in black, with a long strap that sits at the hip and an outside pocket for whatever you need first.",
      details: "15″ × 12″ · 18″ strap drop · outside pocket · fully lined · spot clean. Sewn and ready to ship.",
      images: ["assets/tote-storykeeper.jpg", "assets/tote-storykeeper-2.jpg", "assets/tote-storykeeper-3.jpg"]
    },
    "tote-sunflower": {
      alt: "Handmade puffy woven tote in a sunflower, honeycomb, and bee print",
      blurb: "Our puffy woven tote — hand-cut squares of sunflowers, honeycomb, and tiny bees, quilted into pillowy softness. A true statement piece that hugs whatever you carry.",
      details: "12″ × 12″ · 20″ strap drop · puffy hand-woven panels · roomy slouch shape · spot clean, reshape by hand. Sewn and ready to ship.",
      images: ["assets/tote-sunflower.jpg", "assets/tote-sunflower-detail.jpg"]
    },
    "tote-mushroom": {
      alt: "Handmade tote in an olive-green woodland mushroom print",
      blurb: "Little red-capped mushrooms scattered across olive-green cotton — a walk through the forest floor, tucked under your arm. Made for foragers, readers, and cottage dreamers.",
      details: "15″ × 14″ · 12″ strap drop · front pocket 7″ × 6″ · spot clean. Sewn and ready to ship.",
      images: ["assets/tote-mushroom.jpg"]
    },
    "tote-mustard-floral": {
      alt: "Handmade tote in a golden mustard vintage rose floral print",
      blurb: "Dusty roses climbing over warm mustard-gold — a little vintage, a little sun-faded, endlessly cozy. The everyday tote with a storybook heart.",
      details: "10″ × 12″ · 9″ strap drop · spot clean. Sewn and ready to ship.",
      images: ["assets/tote-mustard-floral.jpg"]
    },
    "tote-blue-rose": {
      alt: "Handmade mini tote in a pale blue print scattered with tiny pink roses",
      blurb: "Tiny pink roses drifting over the softest powder blue — a sweet little mini tote, just right for your small everyday essentials.",
      details: "Mini tote · 8″ × 4″ · 6″ strap drop · fully lined · spot clean. Sewn and ready to ship.",
      images: ["assets/tote-blue-rose.jpg", "assets/tote-blue-rose-2.jpg", "assets/tote-blue-rose-3.jpg"]
    },
    "tote-butterfly": {
      alt: "Handmade cream tote with a lily-of-the-valley and pink butterfly print, lined in white",
      blurb: "Lily-of-the-valley and soft pink butterflies scattered across warm cream — a spring meadow you can carry. Fully lined, with a handy front pocket.",
      details: "7″ × 6″ × 12″ · 11″ strap drop · front pocket 5″ × 9″ · fully lined · spot clean. Sewn and ready to ship.",
      images: ["assets/tote-butterfly.jpg", "assets/tote-butterfly-2.jpg", "assets/tote-butterfly-inside.jpg"]
    },
    "tote-strawberry-v2": {
      alt: "Handmade knot-style tote in a wild strawberry and vine print on cream",
      blurb: "A knot-style tote tumbling with wild strawberries and trailing green vines on cream — roomy, slouchy, and just right for carrying your current read and everything else.",
      details: "Japanese knot-style tote · fully lined · spot clean. Sewn and ready to ship.",
      images: ["assets/tote-strawberry-v2.jpg", "assets/tote-strawberry-v2-2.jpg", "assets/tote-strawberry-v2-3.jpg", "assets/tote-strawberry-v2-4.jpg"]
    },
    "scrunchie-butterfly": {
      alt: "Handmade scrunchie in a cream butterfly print",
      blurb: "Delicate butterflies scattered across soft cream — a little flutter of whimsy for your wrist or your hair.",
      details: "One size · soft & springy, gentle on hair · hand wash, lay flat to dry.",
      images: ["assets/scrunchie-butterfly.jpg"]
    },
    "scrunchie-cherry-blossom": {
      alt: "Handmade scrunchie in a pink cherry blossom print on cream",
      blurb: "Soft pink cherry blossoms on cream — springtime you can wear all year.",
      details: "One size · soft & springy, gentle on hair · hand wash, lay flat to dry.",
      images: ["assets/scrunchie-cherry-blossom.jpg"]
    },
    "scrunchie-cherry": {
      alt: "Handmade ribbed scrunchie with a red cherry print on cream",
      blurb: "Sweet red cherries on a cozy ribbed knit — playful and just a little retro.",
      details: "One size · soft & springy, gentle on hair · hand wash, lay flat to dry.",
      images: ["assets/scrunchie-cherry.jpg"]
    },
    "scrunchie-orange-kitty": {
      alt: "Handmade scrunchie in a peachy-pink kitten print",
      blurb: "Peachy-pink with the tiniest kittens tucked in — for the cat lovers and daydreamers.",
      details: "One size · soft & springy, gentle on hair · hand wash, lay flat to dry.",
      images: ["assets/scrunchie-orange-kitty.jpg?v=2"]
    },
    "scrunchie-pink-bumble-bee": {
      alt: "Handmade ribbed blush-pink scrunchie dotted with bees",
      blurb: "Ribbed blush pink dotted with busy little bees — soft, subtle, and sweet.",
      details: "One size · soft & springy, gentle on hair · hand wash, lay flat to dry.",
      images: ["assets/scrunchie-pink-bumble-bee.jpg"]
    },
    "scrunchie-pretty-in-pink": {
      alt: "Handmade textured scrunchie with soft pink brushstrokes on cream",
      blurb: "Airy pink brushstrokes on textured cream — pretty in pink, exactly as it should be.",
      details: "One size · soft & springy, gentle on hair · hand wash, lay flat to dry.",
      images: ["assets/scrunchie-pretty-in-pink.jpg"]
    },
    "scrunchie-wildflower": {
      alt: "Handmade scrunchie in a tiny wildflower print on cream",
      blurb: "A meadow's worth of tiny wildflowers on cream — our softest little garden.",
      details: "One size · soft & springy, gentle on hair · hand wash, lay flat to dry.",
      images: ["assets/scrunchie-wildflower.jpg"]
    },
    "scrunchie-strawberry": {
      alt: "Handmade scrunchie in a red strawberry and green leaf print",
      blurb: "Ripe little strawberries on leafy green — the sweetest bit of summer for your wrist or your hair.",
      details: "One size · soft & springy, gentle on hair · hand wash, lay flat to dry.",
      images: ["assets/scrunchie-strawberry.jpg"]
    },
    "scrunchie-bundle": {
      alt: "Set of three handmade scrunchies in red, cream, and navy",
      blurb: "Three everyday scrunchies in classic red, cream, and navy — the perfect starter trio, and a little kinder on the price.",
      details: "Set of 3 (red · cream · navy) · one size each · hand wash, lay flat to dry.",
      images: ["assets/scrunchie-bundle.jpg"]
    },
    "scrunchie-byo-bundle": {
      alt: "Three handmade scrunchies in a build-your-own bundle",
      blurb: "Can't pick just one print? Choose any three of our scrunchie prints and we'll bundle them together — same sweet trio price, your choice of prints, one shipping.",
      details: "Choose your 3 prints below · one size each · hand wash, lay flat to dry.",
      images: ["assets/scrunchie-bundle.jpg"]
    },
    "bow-sage": {
      alt: "Handmade sage-green floral sailor bow",
      blurb: "A little extra magic, tucked right where you'll notice it. Hand-tied from cotton with finished edges and your choice of clip, elastic, or O-ring — proof that a small detail can still make a day feel special.",
      details: "6″ long × 7″ wide · spot clean only · store away from direct sun to keep color true.",
      images: ["assets/bow-sage.jpg"]
    },
    "bow-gingham": {
      alt: "Handmade taupe gingham sailor bow",
      blurb: "Soft taupe gingham, hand-tied into a sweet sailor bow — a cozy little check that pairs with everything from sundresses to storybooks.",
      details: "6″ long × 7″ wide · spot clean only · store away from direct sun to keep color true.",
      images: ["assets/bow-gingham.jpg?v=2"]
    },
    "bow-sage-gingham": {
      alt: "Handmade sage-green gingham sailor bow scattered with tiny roses",
      blurb: "Sage-green gingham strewn with the tiniest pink roses — a garden picnic of a bow, hand-tied with finished edges.",
      details: "6″ long × 7″ wide · spot clean only · store away from direct sun to keep color true.",
      images: ["assets/bow-sage-gingham.jpg?v=2"]
    },
    "bow-blue-rose": {
      alt: "Handmade powder-blue sailor bow with pink cottage roses",
      blurb: "Powder-blue cotton dotted with soft pink roses — a dreamy, storybook bow hand-tied with finished edges.",
      details: "6″ long × 7″ wide · spot clean only · store away from direct sun to keep color true.",
      images: ["assets/bow-blue-rose.jpg"]
    },
    "bow-cauldron-forged": {
      alt: "Handmade midnight-navy sailor bow with a fine bronze crackle-web texture",
      blurb: "Midnight navy shot through with a fine bronze web — like something cooled in the dark and lifted out still glinting. The moodiest bow in the shop, and the one that finally goes with black.",
      details: "6″ long × 7″ wide · spot clean only · store away from direct sun to keep color true.",
      images: ["assets/bow-cauldron-forged.jpg"]
    },
    "bow-toffee-plaid": {
      alt: "Handmade brown toffee plaid sailor bow",
      blurb: "Deep toffee plaid, hand-tied into a sailor bow — the colour of a cup left to steep too long and an armchair by the window. Finished edges, and it suits every coat you own.",
      details: "6″ long × 7″ wide · spot clean only · store away from direct sun to keep color true.",
      images: ["assets/bow-toffee-plaid.jpg"]
    },
    "bow-roasted-roses": {
      alt: "Handmade olive sailor bow printed with cream roses and cups of coffee",
      blurb: "Cream roses and little cups of coffee scattered across deep olive — a slow morning, tied into a bow. Hand-tied with finished edges.",
      details: "6″ long × 7″ wide · spot clean only · store away from direct sun to keep color true.",
      images: ["assets/bow-roasted-roses.jpg"]
    },
    "bow-daily-grind-ivory": {
      alt: "Handmade ivory sailor bow printed with vintage coffee-shop lettering",
      blurb: "Old sign-painter lettering on soft ivory — moka pots, grinders, and a hundred small reasons to take a coffee break. For the ones who read best with a cup in hand.",
      details: "6″ long × 7″ wide · spot clean only · store away from direct sun to keep color true.",
      images: ["assets/bow-daily-grind-ivory.jpg"]
    },
    "bow-blushing-linen": {
      alt: "Handmade blush-pink sailor bow in a soft linen-textured cotton",
      blurb: "The softest blush, woven with the slubby texture of well-loved linen — a quiet bow that doesn't compete with anything you put it near. Hand-tied with finished edges.",
      details: "6″ long × 7″ wide · spot clean only · store away from direct sun to keep color true.",
      images: ["assets/bow-blushing-linen.jpg"]
    },
    "bandana-storykeeper": {
      alt: "Handmade pet bandana printed with antique books and potion bottles, shown flat and worn by a black dog",
      blurb: "The Storykeeper print, cut down for the smallest reader in the house — shelves of antique books and potion bottles on deep black. It slips over the collar they already wear, so there's nothing to tie and nothing to lose. Matches the tote of the same name. This one is a Large; small and medium can be made to order, so just ask.",
      details: "Size Large · small and medium available on request · slips over the collar · machine wash cold, hang to dry.",
      images: [
        "assets/bandana-storykeeper.jpg",
        "assets/bandana-storykeeper-2.jpg",
        "assets/bandana-storykeeper-3.jpg"
      ]
    }
  },

  /* Live Stripe Payment Links — verified against the Stripe account.
     Each opens that single item's hosted checkout ($6.50 shipping, US
     address, NEST10 + auto tax). An id missing here reads "Coming soon". */
  LINKS: {
    "tote-sunflower":      "https://buy.stripe.com/28E28rbhEfDb9xoetHfjG05",
    "tote-mushroom":       "https://buy.stripe.com/5kQcN53PcgHf5h8clzfjG06",
    "tote-mustard-floral": "https://buy.stripe.com/00w3cvetQ1MlbFw99nfjG07",
    "tote-blue-rose":      "https://buy.stripe.com/aFa5kD99w9eN9xo4T7fjG08",
    "tote-butterfly":      "https://buy.stripe.com/dRmeVd5XkgHfcJA2KZfjG09",
    // Post-cart items: LINKS is now just an availability flag (checkout runs
    // through the cart + Worker, not these links), so new items use "cart".
    "tote-strawberry-v2":  "cart",
    "tote-storykeeper":    "cart",
    "scrunchie-butterfly":      "https://buy.stripe.com/3cIaEX71o9eNdNE4T7fjG0f",
    "scrunchie-cherry-blossom": "https://buy.stripe.com/4gM5kDfxU8aJ3902KZfjG0g",
    "scrunchie-cherry":         "https://buy.stripe.com/cNi6oHfxUfDb5h8etHfjG0h",
    "scrunchie-orange-kitty":   "https://buy.stripe.com/3cI4gz71o4Yx9xogBPfjG0i",
    "scrunchie-pink-bumble-bee":"https://buy.stripe.com/dRm6oHclI3Ut4d4dpDfjG0j",
    "scrunchie-pretty-in-pink": "https://buy.stripe.com/00wdR9gBY3Ut6lc1GVfjG0k",
    "scrunchie-wildflower":     "https://buy.stripe.com/eVq7sLetQez710S1GVfjG0l",
    "scrunchie-strawberry":     "https://buy.stripe.com/dRmdR9clIez724WbhvfjG0m",
    "scrunchie-bundle":         "https://buy.stripe.com/00waEX1H48aJfVM1GVfjG04",
    "scrunchie-byo-bundle":     "https://buy.stripe.com/aFaeVd0D00Ih9xo71ffjG0r",
    "bow-sage":         "https://buy.stripe.com/dRmdR985scqZ7pgclzfjG0b",
    "bow-gingham":      "https://buy.stripe.com/dRmaEX4Tgez7dNEetHfjG0c",
    "bow-sage-gingham": "https://buy.stripe.com/cNi7sL3Pc1MldNEbhvfjG0d",
    "bow-blue-rose":    "https://buy.stripe.com/eVqaEX0D0fDbdNE4T7fjG0e",
    "bow-cauldron-forged":   "cart",
    "bow-toffee-plaid":      "cart",
    "bow-roasted-roses":     "cart",
    "bow-daily-grind-ivory": "cart",
    "bow-blushing-linen":    "cart",
    "bandana-storykeeper":   "cart"
  },

  /* Prints a "Build Your Own Bundle" can be built from — the options in the
     three pickers on that card. Ids must exist in PRODUCTS. The Worker keeps
     its own copy of this list (PICKABLE) and rejects anything not on it, so
     add a print in BOTH places or it can't be chosen at checkout. */
  BYO_PRINTS: [
    "scrunchie-butterfly", "scrunchie-cherry-blossom", "scrunchie-cherry",
    "scrunchie-orange-kitty", "scrunchie-pink-bumble-bee", "scrunchie-pretty-in-pink",
    "scrunchie-wildflower", "scrunchie-strawberry"
  ],

  /* Order + grouping shown on the full catalog page (shop.html). */
  CATALOG: [
    { label: "Totes",      note: "Roomy, ready to ship, and built to carry a hardback and everything else.",
      ids: ["tote-storykeeper", "tote-strawberry-v2", "tote-sunflower", "tote-mushroom", "tote-mustard-floral", "tote-blue-rose", "tote-butterfly"] },
    { label: "Scrunchies", note: "Soft, springy, gentle on hair — pick a print, or build your own trio.",
      ids: ["scrunchie-butterfly", "scrunchie-cherry-blossom", "scrunchie-cherry", "scrunchie-orange-kitty",
            "scrunchie-pink-bumble-bee", "scrunchie-pretty-in-pink", "scrunchie-wildflower", "scrunchie-strawberry",
            "scrunchie-bundle", "scrunchie-byo-bundle"] },
    { label: "Bows",       note: "Hand-tied sailor bows with finished edges, in storybook prints.",
      ids: ["bow-cauldron-forged", "bow-toffee-plaid", "bow-roasted-roses", "bow-daily-grind-ivory", "bow-blushing-linen",
            "bow-gingham", "bow-sage-gingham", "bow-sage", "bow-blue-rose"] },
    { label: "Pet Bandanas", note: "Over-the-collar bandanas in the same storybook prints — for the one who waits by the door.",
      ids: ["bandana-storykeeper"] }
  ]
};
