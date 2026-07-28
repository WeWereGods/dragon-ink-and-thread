/* Dragon Ink and Thread — shared shop data (single source of truth).
   Loaded by BOTH the homepage (js/main.js) and the full catalog page
   (shop.html → js/shop.js) so product info + Stripe links never drift.

   To add / edit a product: change it HERE.
     - PRODUCTS: name + price + emoji fallback
     - VARIANTS: alt text, blurb, details, photo(s)
     - LINKS:    the item's live Stripe Payment Link (omit = "Coming soon")
     - CATALOG:  the order + grouping shown on the catalog page
*/
window.DIT_SHOP = {
  // Shop opens Aug 15, 2026, 9am Central. Until then Buy buttons are gated.
  SHOP_OPENS: "2026-08-15T09:00:00-05:00",

  PRODUCTS: {
    "tote-sunflower":     { name: "Sunflower Tote",     price: 45.0, art: "🌻" },
    "tote-mushroom":      { name: "Mushroom Tote",      price: 25.0, art: "🍄" },
    "tote-mustard-floral":{ name: "Mustard Rose Tote",  price: 20.0, art: "🌹" },
    "tote-blue-rose":     { name: "Blue Rose Mini Tote", price: 20.0, art: "🌷" },
    "tote-butterfly":     { name: "Butterfly Tote",     price: 38.0, art: "🦋" },
    "scrunchie-butterfly":      { name: "Butterfly Scrunchie",       price: 4.0, art: "🦋" },
    "scrunchie-cherry-blossom": { name: "Cherry Blossom Scrunchie",  price: 4.0, art: "🌸" },
    "scrunchie-cherry":         { name: "Cherry Scrunchie",          price: 4.0, art: "🍒" },
    "scrunchie-orange-kitty":   { name: "Orange Kitty Scrunchie",    price: 4.0, art: "🐱" },
    "scrunchie-pink-bumble-bee":{ name: "Pink Bumble Bee Scrunchie", price: 4.0, art: "🐝" },
    "scrunchie-pretty-in-pink": { name: "Pretty in Pink Scrunchie",  price: 4.0, art: "🎀" },
    "scrunchie-wildflower":     { name: "Wildflower Scrunchie",      price: 4.0, art: "🌼" },
    "scrunchie-strawberry":     { name: "Strawberry Scrunchie",      price: 4.0, art: "🍓" },
    "scrunchie-bundle":         { name: "Scrunchie Bundle (3)",      price: 9.0, art: "🎀" },
    "scrunchie-byo-bundle":     { name: "Build Your Own Bundle",     price: 9.0, art: "🎀" },
    "bow-sage":         { name: "Sage Bow",         price: 10.0, art: "🎗️" },
    "bow-gingham":      { name: "Gingham Bow",      price: 10.0, art: "🎀" },
    "bow-sage-gingham": { name: "Sage Gingham Bow", price: 10.0, art: "🎀" },
    "bow-blue-rose":    { name: "Blue Rose Bow",    price: 10.0, art: "🎀" }
  },

  VARIANTS: {
    "tote-sunflower": {
      alt: "Handmade puffy woven tote in a sunflower, honeycomb, and bee print",
      blurb: "Our puffy woven tote — hand-cut squares of sunflowers, honeycomb, and tiny bees, quilted into pillowy softness. A true statement piece that hugs whatever you carry.",
      details: "12″ × 12″ · 20″ strap drop · puffy hand-woven panels · roomy slouch shape · spot clean, reshape by hand. Made to order — please allow 7–12 business days.",
      images: ["assets/tote-sunflower.jpg", "assets/tote-sunflower-detail.jpg"]
    },
    "tote-mushroom": {
      alt: "Handmade tote in an olive-green woodland mushroom print",
      blurb: "Little red-capped mushrooms scattered across olive-green cotton — a walk through the forest floor, tucked under your arm. Made for foragers, readers, and cottage dreamers.",
      details: "15″ × 14″ · 12″ strap drop · front pocket 7″ × 6″ · spot clean. Made to order — please allow 5–10 business days.",
      images: ["assets/tote-mushroom.jpg"]
    },
    "tote-mustard-floral": {
      alt: "Handmade tote in a golden mustard vintage rose floral print",
      blurb: "Dusty roses climbing over warm mustard-gold — a little vintage, a little sun-faded, endlessly cozy. The everyday tote with a storybook heart.",
      details: "10″ × 12″ · 9″ strap drop · spot clean. Made to order — please allow 5–10 business days.",
      images: ["assets/tote-mustard-floral.jpg"]
    },
    "tote-blue-rose": {
      alt: "Handmade mini tote in a pale blue print scattered with tiny pink roses",
      blurb: "Tiny pink roses drifting over the softest powder blue — a sweet little mini tote, just right for your small everyday essentials.",
      details: "Mini tote · 8″ × 4″ · 6″ strap drop · fully lined · spot clean. Made to order — please allow 5–10 business days.",
      images: ["assets/tote-blue-rose.jpg", "assets/tote-blue-rose-2.jpg", "assets/tote-blue-rose-3.jpg"]
    },
    "tote-butterfly": {
      alt: "Handmade cream tote with a lily-of-the-valley and pink butterfly print, lined in white",
      blurb: "Lily-of-the-valley and soft pink butterflies scattered across warm cream — a spring meadow you can carry. Fully lined, with a handy front pocket.",
      details: "7″ × 6″ × 12″ · 11″ strap drop · front pocket 5″ × 9″ · fully lined · spot clean. Made to order — please allow 5–10 business days.",
      images: ["assets/tote-butterfly.jpg", "assets/tote-butterfly-2.jpg", "assets/tote-butterfly-inside.jpg"]
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
      details: "Pick your 3 prints at checkout · one size each · hand wash, lay flat to dry.",
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
    "bow-blue-rose":    "https://buy.stripe.com/eVqaEX0D0fDbdNE4T7fjG0e"
  },

  /* Order + grouping shown on the full catalog page (shop.html). */
  CATALOG: [
    { label: "Totes",      note: "Roomy, made-to-order, and built to carry a hardback and everything else.",
      ids: ["tote-sunflower", "tote-mushroom", "tote-mustard-floral", "tote-blue-rose", "tote-butterfly"] },
    { label: "Scrunchies", note: "Soft, springy, gentle on hair — pick a print, or build your own trio.",
      ids: ["scrunchie-butterfly", "scrunchie-cherry-blossom", "scrunchie-cherry", "scrunchie-orange-kitty",
            "scrunchie-pink-bumble-bee", "scrunchie-pretty-in-pink", "scrunchie-wildflower", "scrunchie-strawberry",
            "scrunchie-bundle", "scrunchie-byo-bundle"] },
    { label: "Bows",       note: "Hand-tied sailor bows with finished edges, in storybook prints.",
      ids: ["bow-sage", "bow-gingham", "bow-sage-gingham", "bow-blue-rose"] }
  ]
};
