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
  // shopOpen === true. Custom (made-to-order/personalized) orders open Aug 17,
  // 2026 — that date lives in CUSTOM_OPENS in js/dates.js and nowhere else.
  SHOP_OPENS: "2026-07-01T09:00:00-05:00",

  /* Display-only mirror of the Worker's shipping rules, in DOLLARS (the Worker
     holds them in cents and is the authority on what a customer is actually
     charged). KEEP IN SYNC with SHIP_STANDARD / SHIP_SMALL / FREE_SHIP_OVER at
     the top of worker/checkout-worker.js.
     Read by js/cart.js (the drawer's shipping line + the "add $X more" nudge)
     and tools/build-products.js (the free-shipping line on product pages), so
     the number lives in ONE place on the client instead of being retyped in
     each of them. */
  /* standardPrefixes = ids that need the bigger mailer and so pay `standard`.
     Anything else pays `small`. MIRRORS SHIP_STANDARD_PREFIXES in
     worker/checkout-worker.js, which is what a customer is actually charged. */
  SHIPPING: { standard: 6.5, small: 4.5, freeOver: 50, standardPrefixes: ["tote-", "sleeve-", "home-"] },

  PRODUCTS: {
    "tote-storykeeper":   { name: "The Storykeeper",   price: 32.0, art: "📚" },
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
    "scrunchie-autumn-court":   { name: "Autumn Court Scrunchie",   price: 6.0, art: "🏈", maxQty: 3 },
    "scrunchie-bundle":         { name: "Scrunchie Bundle (3)",      price: 15.0, art: "🎀", maxQty: 3 },
    "scrunchie-byo-bundle":     { name: "Build Your Own Bundle",     price: 15.0, art: "🎀", picks: 3 },
    "bow-gingham":      { name: "Gingham Bow",      price: 12.0, art: "🎀" },
    "bow-sage-gingham": { name: "Sage Gingham Bow", price: 12.0, art: "🎀" },
    "bow-cauldron-forged":   { name: "Cauldron Forged Bow",     price: 12.0, art: "🖤" },
    "bow-toffee-plaid":      { name: "Toffee Plaid Bow",        price: 12.0, art: "🎀" },
    "bow-roasted-roses":     { name: "Roasted Roses Bow",       price: 12.0, art: "🌹" },
    "bow-daily-grind-ivory": { name: "Daily Grind Bow in Ivory", price: 12.0, art: "☕" },
    "bow-blushing-linen":    { name: "Blushing Linen Bow",      price: 12.0, art: "🎀" },
    "bow-something-blue":    { name: "Something Blue Bow",      price: 12.0, art: "🎀" },
    "bow-sidra-vines":       { name: "Sidra Vines Bow",         price: 12.0, art: "🎀" },
    "bow-porcelain-roses":   { name: "Porcelain Roses Bow",     price: 12.0, art: "🌹" },
    "bow-lace-of-velaris":   { name: "Lace of Velaris Bow",     price: 12.0, art: "🎀" },
    "bow-suriels-bouquet":   { name: "Suriel's Bouquet Bow",    price: 12.0, art: "💐" },
    /* GAME DAY — three pieces from one yard of the football print, bought 2026-08-19.
       These carry maxQty because they are stock cut from shared yardage, NOT one-of-a-kind.
       That does not reopen the 2026-07-30 "bows stay at 1" decision, which was about
       genuinely unique bows. */
    "bow-autumn-court":      { name: "The Autumn Court Bow",      price: 12.0, art: "🏈", maxQty: 3 },
    "bow-gameday-darling":   { name: "Game Day Darling Bow",      price: 14.0, art: "🏈", maxQty: 2 },
    "bow-suriel-set":        { name: "Tea with the Suriel — the Set of Five", price: 55.0, art: "🫖" },
    "bandana-storykeeper":   { name: "The Storykeeper Bandana", price: 18.0, art: "🐾" },
    "bandana-brew-and-bloom":    { name: "Brew and Bloom Bandana",    price: 18.0, art: "🐾" },
    "bandana-quilted-court":     { name: "The Quilted Court Bandana", price: 22.0, art: "🐾" },
    "sleeve-reading-nook":   { name: "Reading Nook Sleeve",     price: 28.0, art: "📖" },
    "home-suriel-tea-cover": { name: "The Suriel Tea Cover",    price: 35.0, art: "🫖" }
  },

  VARIANTS: {
    "bow-autumn-court": {
      alt: "Handmade sailor bow in a cream print scattered with russet footballs and little tied bows",
      blurb: "Russet footballs and little tied bows strewn across cream — Saturday afternoons, and the first morning of the year that's cool enough for sleeves. Cut from a textured knit rather than cotton, so it holds its shape from kickoff to the drive home. **Three were made, and that was the whole yard.**",
      details: "6″ long × 6″ wide · finished edges · textured knit · on a slide-in clip · spot clean only · store away from direct sun to keep color true.",
      images: ["assets/bow-autumn-court.jpg"]
    },
    "bow-gameday-darling": {
      alt: "Baby headband in a cream print scattered with russet footballs and little tied bows, tied in a large bow at the front",
      blurb: "The same russet footballs and little tied bows, on a soft stretch headband for the smallest fan in the house. A textured knit that gives without digging in, tied in a generous bow at the front. **Two were made, and that was the whole yard.**",
      details: "Baby headband · [SIZE — CONFIRM] · soft stretch knit · spot clean only. ⚠️ Never leave on a sleeping or unattended baby.",
      images: ["assets/bow-gameday-darling.jpg"]
    },
    "scrunchie-autumn-court": {
      alt: "Handmade scrunchie in a cream print scattered with russet footballs and little tied bows",
      blurb: "The same russet footballs and little tied bows, gathered into a scrunchie — game day, in a size that fits in a pocket. A textured knit, so it springs back rather than going limp by the fourth quarter.",
      details: "One size · textured knit · gentle on hair · spot clean only. Sewn and ready to ship.",
      images: ["assets/scrunchie-autumn-court.jpg"]
    },
    "tote-storykeeper": {
      alt: "Handmade tote printed with shelves of antique books and potion bottles on black, hanging from a long black strap",
      blurb: "Shelves of old books and apothecary bottles stacked to the ceiling, printed deep on black — the library you'd happily get lost in. Lined in black, with a long strap that sits at the hip and an outside pocket for whatever you need first.",
      details: "15″ × 12″ · 18″ strap drop · outside pocket · fully lined · spot clean. Sewn and ready to ship.",
      images: ["assets/tote-storykeeper.jpg", "assets/tote-storykeeper-2.jpg", "assets/tote-storykeeper-3.jpg"]
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
    "bow-gingham": {
      alt: "Handmade taupe gingham sailor bow",
      blurb: "Soft taupe gingham, hand-tied into a sweet sailor bow — a cozy little check that pairs with everything from sundresses to storybooks.",
      details: "6″ long × 6″ wide · finished edges · on a slide-in clip · spot clean only · store away from direct sun to keep color true.",
      images: ["assets/bow-gingham.jpg?v=2"]
    },
    "bow-sage-gingham": {
      alt: "Handmade sage-green gingham sailor bow scattered with tiny roses",
      blurb: "Sage-green gingham strewn with the tiniest pink roses — a garden picnic of a bow, hand-tied with finished edges.",
      details: "6″ long × 6″ wide · finished edges · on a slide-in clip · spot clean only · store away from direct sun to keep color true.",
      images: ["assets/bow-sage-gingham.jpg?v=2"]
    },
    "bow-cauldron-forged": {
      alt: "Handmade midnight-navy sailor bow with a fine bronze crackle-web texture",
      blurb: "Midnight navy shot through with a fine bronze web — like something cooled in the dark and lifted out still glinting. The moodiest bow in the shop, and the one that finally goes with black.",
      details: "6″ long × 6″ wide · finished edges · on a slide-in clip · spot clean only · store away from direct sun to keep color true.",
      images: ["assets/bow-cauldron-forged.jpg"]
    },
    "bow-toffee-plaid": {
      alt: "Handmade brown toffee plaid sailor bow",
      blurb: "Deep toffee plaid, hand-tied into a sailor bow — the colour of a cup left to steep too long and an armchair by the window. Finished edges, and it suits every coat you own.",
      details: "6″ long × 6″ wide · finished edges · on a slide-in clip · spot clean only · store away from direct sun to keep color true.",
      images: ["assets/bow-toffee-plaid.jpg"]
    },
    "bow-roasted-roses": {
      alt: "Handmade olive sailor bow printed with cream roses and cups of coffee",
      blurb: "Cream roses and little cups of coffee scattered across deep olive — a slow morning, tied into a bow. Hand-tied with finished edges.",
      details: "6″ long × 6″ wide · finished edges · on a slide-in clip · spot clean only · store away from direct sun to keep color true.",
      images: ["assets/bow-roasted-roses.jpg"]
    },
    "bow-daily-grind-ivory": {
      alt: "Handmade ivory sailor bow printed with vintage coffee-shop lettering",
      blurb: "Old sign-painter lettering on soft ivory — moka pots, grinders, and a hundred small reasons to take a coffee break. For the ones who read best with a cup in hand.",
      details: "6″ long × 6″ wide · finished edges · on a slide-in clip · spot clean only · store away from direct sun to keep color true.",
      images: ["assets/bow-daily-grind-ivory.jpg"]
    },
    "bow-blushing-linen": {
      alt: "Handmade blush-pink sailor bow in a soft linen-textured cotton",
      blurb: "The softest blush, woven with the slubby texture of well-loved linen — a quiet bow that doesn't compete with anything you put it near. Hand-tied with finished edges.",
      details: "6″ long × 6″ wide · finished edges · on a slide-in clip · spot clean only · store away from direct sun to keep color true.",
      images: ["assets/bow-blushing-linen.jpg"]
    },
    "bow-something-blue": {
      alt: "Handmade sailor bow in pale blue cotton with a fine white-and-blue lace floral pattern",
      blurb: "The palest of the five — soft powder blue under a fine lace-like tracery of flowers, so light it reads almost silver from across a room. The one to reach for when you want the bow noticed but not announced.",
      details: "6″ long × 6″ wide · finished edges · on a slide-in clip · spot clean only · store away from direct sun to keep color true.",
      images: ["assets/bow-something-blue.jpg", "assets/bow-something-blue-2.jpg"]
    },
    "bow-sidra-vines": {
      alt: "Handmade sailor bow in cornflower-blue cotton with fine white trailing rose vines",
      blurb: "Fine white vines trailing endlessly over cornflower blue, small roses tucked in where they fall — a pattern you keep turning to follow, like something painted round the side of a teacup.",
      details: "6″ long × 6″ wide · finished edges · on a slide-in clip · spot clean only · store away from direct sun to keep color true.",
      images: ["assets/bow-sidra-vines.jpg", "assets/bow-sidra-vines-2.jpg"]
    },
    "bow-porcelain-roses": {
      alt: "Handmade sailor bow in cream cotton scattered with small blue roses and sprigs",
      blurb: "Small blue roses trailing over cream, the way they'd look pressed into an old book and forgotten there. The quietest bow of the five, and the one that goes with everything.",
      details: "6″ long × 6″ wide · finished edges · on a slide-in clip · spot clean only · store away from direct sun to keep color true.",
      images: ["assets/bow-porcelain-roses.jpg", "assets/bow-porcelain-roses-2.jpg"]
    },
    "bow-lace-of-velaris": {
      alt: "Handmade sailor bow in mid-blue cotton covered with white lace medallions and scalloped bands",
      blurb: "White lace medallions and scalloped bands blooming right across mid-blue — the densest pattern of the five, and the one that looks most like a plate you'd never quite dare eat off.",
      details: "6″ long × 6″ wide · finished edges · on a slide-in clip · spot clean only · store away from direct sun to keep color true.",
      images: ["assets/bow-lace-of-velaris.jpg", "assets/bow-lace-of-velaris-2.jpg"]
    },
    "bow-suriels-bouquet": {
      alt: "Handmade sailor bow in cream cotton with large cobalt-blue floral bouquets",
      blurb: "Full cobalt bouquets thrown across cream — the boldest of the five, and the one that reads from across a room. If the others are a whisper, this is the sentence said out loud.",
      details: "6″ long × 6″ wide · finished edges · on a slide-in clip · spot clean only · store away from direct sun to keep color true.",
      images: ["assets/bow-suriels-bouquet.jpg", "assets/bow-suriels-bouquet-2.jpg"]
    },
    "bow-suriel-set": {
      alt: "Five handmade sailor bows in blue and white floral cottons, laid out together on pale wood",
      blurb: "All five. One bow each in Something Blue, Sidra Vines, Porcelain Roses, Lace of Velaris and Suriel's Bouquet — five of the blues from the Tea with the Suriel collection, for $55 instead of $60. They were cut from the same five bolts on the same afternoon, and once one of them goes the set isn't a set any more.",
      details: "Five bows · 6″ long × 6″ wide each · finished edges · all on slide-in clips · spot clean only · store away from direct sun to keep color true. Ships free.",
      images: ["assets/bow-suriel-set.jpg"]
    },
    "bandana-storykeeper": {
      alt: "Handmade pet bandana printed with antique books and potion bottles, shown flat and worn by a black dog",
      blurb: "The Storykeeper print, cut down for the smallest reader in the house — shelves of antique books and potion bottles on deep black. It slips over the collar they already wear, so there's nothing to tie and nothing to lose. Matches the tote of the same name. This one is a Large; small and medium can be made to order, so just ask.",
      details: "Size Large · fits an 18″–23″ neck · single-sided, not reversible (unlike the Toffee Windowpane and Brew and Bloom bandanas) · small and medium available on request · elasticated channel stretches over the collar · machine wash cold, hang to dry.",
      images: [
        "assets/bandana-storykeeper.jpg",
        "assets/bandana-storykeeper-2.jpg",
        "assets/bandana-storykeeper-3.jpg"
      ]
    },
    "bandana-brew-and-bloom": {
      alt: "Reversible handmade pet bandana, coffee cups and flowers on cream one side, soft blush linen the other",
      blurb: "Lattes, iced coffees and pale flowers scattered over cream — the whole slow morning, for the dog who lies under the table while you have your first cup and waits for you to be a person again. **Reversible:** turn it round and it's Blushing Linen, a soft dusty pink, for the days that call for something quieter. Two bandanas, one collar.",
      details: "Size Large · fits an 18″–23″ neck · REVERSIBLE — Brew and Bloom one side, Blushing Linen the other · elasticated channel stretches over the collar · other sizes made to order · machine wash cold, hang to dry.",
      images: ["assets/bandana-brew-and-bloom.jpg", "assets/bandana-brew-and-bloom-2.jpg", "assets/bandana-brew-and-bloom-3.jpg"]
    },
    "bandana-quilted-court": {
      alt: "Handmade pet bandana pieced from small blush, cream and sage squares — roses, plaids and dotted cottons — with an elasticated channel along the top",
      blurb: "Two dozen little squares — blush roses, pale plaids, dotted cream, a wash of sage — pieced one at a time into something that looks like a quilt made small. It's the only patchwork piece in the shop, and for its size it takes the longest of anything I make: every seam has to meet the three around it. **Reversible:** turn it round and it's Blushing Linen, a soft dusty pink, quiet enough for the days the patchwork would be too much. The top is an elasticated channel, so it stretches over the collar they already wear — nothing to tie, nothing to work loose halfway round the block.",
      details: "Size Medium · fits a 13″–18″ neck · REVERSIBLE — hand-pieced patchwork one side, Blushing Linen the other · elasticated channel stretches over the collar · other sizes made to order · machine wash cold, hang to dry.",
      images: [
        "assets/bandana-quilted-court.jpg",
        "assets/bandana-quilted-court-2.jpg",
        "assets/bandana-quilted-court-3.jpg",
        "assets/bandana-quilted-court-4.jpg",
        "assets/bandana-quilted-court-5.jpg"
      ]
    },
    "sleeve-reading-nook": {
      alt: "Handmade quilted book sleeve in a dark coffee-house print with a cream marble band, shown open to a toffee windowpane lining",
      blurb: "Somewhere soft for whatever you're in the middle of. Quilted and padded all the way round, so the rest of your bag stops pressing against the cover, and the top is left open on purpose — no button, no snap, nothing to undo when you've got one hand free and five minutes to read. The Daily Grind on the outside under a band of Cinnamon Marble, and a Toffee Windowpane lining that nobody but you will see.",
      details: "12″ × 8.5″ · comfortably takes a hardback, a paperback or an e-reader · quilted and padded throughout · open top, no closure, so it slides out one-handed · The Daily Grind outside with a Cinnamon Marble band, lined in Toffee Windowpane · machine wash cold, hang to dry.",
      images: [
        "assets/sleeve-reading-nook.jpg",
        "assets/sleeve-reading-nook-2.jpg"
      ]
    },
    "home-suriel-tea-cover": {
      alt: "Handmade patchwork tea cover in blue and white florals, paisleys and lace prints, with a bound cream hem",
      blurb: "Blue-and-white prints from the **Tea with the Suriel** shelf, hand-pieced into one small cover — paisley, lace, and a scatter of roses across the front. The prettiest table in the house, if you want it to be. Piecing is the slowest thing I do at this size, and it's the only way to get this many prints into one piece.",
      details: "12″ × 9″ · hand-pieced patchwork · bound hem · spot clean. Sewn and ready to ship.",
      images: [
        "assets/home-suriel-tea-cover.jpg",
        "assets/home-suriel-tea-cover-2.jpg"
      ]
    }
  },

  /* Live Stripe Payment Links — verified against the Stripe account.
     Each opens that single item's hosted checkout ($6.50 shipping, US
     address, NEST10 + auto tax). An id missing here reads "Coming soon". */
  LINKS: {
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
    "scrunchie-bundle":         "https://buy.stripe.com/00waEX1H48aJfVM1GVfjG04",
    "scrunchie-byo-bundle":     "https://buy.stripe.com/aFaeVd0D00Ih9xo71ffjG0r",
    "bow-gingham":      "https://buy.stripe.com/dRmaEX4Tgez7dNEetHfjG0c",
    "bow-sage-gingham": "https://buy.stripe.com/cNi7sL3Pc1MldNEbhvfjG0d",
    "bow-cauldron-forged":   "cart",
    "bow-toffee-plaid":      "cart",
    "bow-roasted-roses":     "cart",
    "bow-daily-grind-ivory": "cart",
    "bow-blushing-linen":    "cart",
    "bow-something-blue":    "cart",
    "bow-sidra-vines":       "cart",
    "bow-porcelain-roses":   "cart",
    "bow-lace-of-velaris":   "cart",
    "bow-suriels-bouquet":   "cart",
    "bow-autumn-court":       "cart",
    "bow-gameday-darling":    "cart",
    "scrunchie-autumn-court": "cart",
    /* ⛔ PULLED FOR THE Aug 21–24 TRIP (2026-08-19). The set and the five singles are
       the SAME five bows, and nothing tracks stock — with nobody able to pull a listing for
       four days, one sale on either side would oversell the other. Removing it from LINKS (not
       soldOut, which would print a "Sold" badge that is false and fire the waitlist) leaves the
       card visible but unbuyable and the page alive.
       ↩️ RESTORE ON Tue 25: uncomment the line below, restore the Worker PRICES entry,
       rebuild, push, wrangler deploy, and put Bows offerCount back to 13 / highPrice to 55.00.
    "bow-suriel-set":        "cart", */
    "bandana-storykeeper":   "cart",
    "bandana-brew-and-bloom":    "cart",
    "bandana-quilted-court":     "cart",
    "sleeve-reading-nook":   "cart",
    "home-suriel-tea-cover": "cart"
  },

  /* Prints a "Build Your Own Bundle" can be built from — the options in the
     three pickers on that card. Ids must exist in PRODUCTS. The Worker keeps
     its own copy of this list (PICKABLE) and rejects anything not on it, so
     add a print in BOTH places or it can't be chosen at checkout. */
  BYO_PRINTS: [
    "scrunchie-butterfly", "scrunchie-cherry-blossom", "scrunchie-cherry",
    "scrunchie-orange-kitty", "scrunchie-pink-bumble-bee", "scrunchie-pretty-in-pink",
    "scrunchie-wildflower"
  ],

  /* Order + grouping shown on the full catalog page (shop.html). */
  CATALOG: [
    { label: "Totes",      note: "Roomy, ready to ship, and built to carry a hardback and everything else.",
      ids: ["tote-storykeeper", "tote-strawberry-v2",   "tote-mustard-floral", "tote-blue-rose", "tote-butterfly"] },
    { label: "Scrunchies", note: "Soft, springy, gentle on hair — pick a print, or build your own trio.",
      ids: ["scrunchie-butterfly", "scrunchie-cherry-blossom", "scrunchie-cherry", "scrunchie-orange-kitty",
            "scrunchie-pink-bumble-bee", "scrunchie-pretty-in-pink", "scrunchie-wildflower",
            "scrunchie-autumn-court",
            "scrunchie-bundle", "scrunchie-byo-bundle"] },
    { label: "Bows",       note: "Hand-tied sailor bows with finished edges, in storybook prints.",
      ids: ["bow-suriel-set", "bow-something-blue", "bow-sidra-vines", "bow-porcelain-roses", "bow-lace-of-velaris",
            "bow-autumn-court", "bow-gameday-darling",
            "bow-suriels-bouquet",
            "bow-cauldron-forged", "bow-toffee-plaid", "bow-roasted-roses", "bow-daily-grind-ivory", "bow-blushing-linen",
            "bow-gingham", "bow-sage-gingham"  ] },
    { label: "Pet Bandanas", note: "Over-the-collar bandanas in the same storybook prints — for the one who waits by the door.",
      ids: ["bandana-quilted-court", "bandana-storykeeper", "bandana-brew-and-bloom"] },
    { label: "Book Sleeves", note: "Padded, open-topped, and somewhere soft for whatever you're in the middle of.",
      ids: ["sleeve-reading-nook"] },
    { label: "Home",       note: "Tea covers and the small soft things that make a kitchen feel looked after.",
      ids: ["home-suriel-tea-cover"] }
  ]
};
