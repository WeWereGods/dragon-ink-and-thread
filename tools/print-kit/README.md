# Print kit — the parchment market signs

Generates the printable signs, cards and tags for market stalls, in the parchment /
botanical look taken from the business card art.

**Everything here writes into `build/`, which is gitignored.** The source art lives in
`assets/print-kit/`. Nothing in this folder edits the website.

## Running it

This kit needs three npm packages. **The site itself has no dependencies and that stays
true** — these are installed inside this folder only, and `node_modules/` is gitignored.

```
cd tools/print-kit
npm install
```

Then, in order (the cut steps produce what the builders consume):

```
node cut-frame.js        # crops paper + corner sprays from card-frame.png
node cut-card-front.js   # crops the dragon, vines and paper from card-front.png
```

Then any of the builders:

| Script | Produces | Size |
|---|---|---|
| `build-display.js` | Display sign — big name, dragon, 3 small QRs | Letter portrait |
| `build-shop-sign.js` | Scan to Shop — 3 QRs | Letter portrait |
| `build-price-sign.js` | Price list | Letter portrait |
| `build-pay-card.js` | Scan to Pay — 3 Stripe links | Letter portrait |
| `build-tags.js` | Price tags + gift tags, 9 per sheet | Letter, 2 pages each |
| `build-4x6.js` | Price list **and** Scan to Pay | True 4in x 6in |
| `build-swatch-book.js` | Fabric swatch book — TWO ring-bound books, 6 cards per sheet (`--covers` for just the two cover cards) | Letter, 14 pages |
| `build-sticker-sign.js` | **FREE STICKER** tent cards, 4 per sheet — fold in half, stand one by the bowl | Letter, 1 page |
| `build-sticker-qr.js` | ~~QR for the $1 sticker checkout~~ **RETIRED 2026-09-24** — link deactivated in Stripe; the script refuses to run | — |

Each writes HTML. Render it with `render.ps1` (Edge headless → PDF + PNG), then run the
matching `verify-*.js`.

### The free sticker card (added 2026-09-30)

⚠️ **THREE STICKER DESIGNS EXIST AND THEY DO NOT ALL BEHAVE THE SAME WAY.** The card says
**"the little ones"** for exactly this reason:

| | |
|---|---|
| the small **25¢** ones | **free to anyone** — this card |
| two branded **57¢** designs | free **with a purchase**, no minimum (owner, 2026-09-24) |
| **"Creating Whimsy"**, the cauldron one | **$3, for sale** — it carries no shop name |

**A card reading only "FREE STICKERS" beside a $3 sticker is how a $3 sticker walks off the
table.** The wording has to name which, and it does.

⛔ **The AI-merchandise rule still applies to the stickers themselves.** The branded designs read
as AI-generated and some juried markets ban AI merchandise — **don't put stickers out at the Pearl
or Mercado de Otoño without checking first.** That is about the merchandise, not this card.

📌 **Why a tent card and not another sign.** Five beige signs of a size read as one beige block
from the aisle, which is why the table went down to two. A free sticker is an *arm's-length* offer,
not an aisle-crossing one — so it belongs beside the bowl, not on the wall.

### The fabric swatch book (added 2026-09-27)

**Generated from `js/fabrics-data.js`** — the same single source as fabrics.html. Add a fabric
there, re-run `node build-swatch-book.js`, and the book is current. Never hand-edit a card.

It exists because three markets produced **$144 of sales and two custom leads**, and the leads are
worth several times the sales. The best custom-selling tool the shop owns is the 76-print library,
and it was a **web page** — which nobody standing at a market table pulls up on their phone.

- ⛔ **NO PRICES ON IT, AND DO NOT ADD ANY.** The custom bands already live in EIGHT places and all
  eight change together. A printed book a customer keeps would be a NINTH, and the hardest to
  correct. The cover carries a **QR to custom.html** instead — a link cannot go stale.
- ⚠️ **The punch hole must clear the cut line by more than its own width**, or the ring tears out
  the first time the book is flipped. The first pass had it 16px (0.17in) in; a quarter-inch punch
  would have left a sixteenth of an inch holding it. It is now 34px (0.35in) from the cut.
- ⚠️ **THE COVER IS A CARD, NOT A PAGE.** The first version made it a full letter sheet, which
  cannot go on a ring with 3.75in cards. Everything on these sheets is one size, cover included.
- ⚠️ **TWO BOOKS** (owner, 2026-09-28): 76 cards on one ring is heavy and awkward to hand over.
  `VOLUMES` keeps each collection whole and lands **37 / 39** — Book One *Flowers and Soft Things*,
  Book Two *Stories and Seasons*. **A collection added to fabrics-data.js and not named in `VOLUMES`
  throws** rather than silently never printing; a missing swatch is only ever noticed at a market.
- 🖨️ **`--reprint 1,16` writes just those cards**, for replacing ones that get damaged or grubby —
  and they will, because the whole point is that people handle them. ⚠️ **It numbers by the ORIGINAL FLAT
  ORDER (1-76 straight through fabrics-data.js), not the per-book numbering**, because that is what is on
  the deck actually sitting on the rings. A reprint carrying a different number would be worse than none.
- 🖨️ **`--covers` writes just the two cover cards on one sheet.** It exists for the day the books
  are already cut and only the covers changed — it saves binning thirteen sheets of cardstock.
- ✅ **`node verify-swatch.js` decodes the cover QRs out of the RENDER**, which matters more here
  than elsewhere because they print at about 1.08in instead of 2in. ⚠️ **A whole-image jsQR scan
  finds NOTHING on a page holding several QRs** — it locks onto no single finder pattern. The
  verifier slides a generous window instead, and the window must not clip the quiet zone: a tight
  crop reads as "not found", which looks exactly like a broken code.
- 📌 **The printed photo IS the swatch.** Real fabric snippets glued over the top would be better —
  tactile, true colour — but 76 of them is an afternoon, and a book that gets made beats a book
  that would have been nicer. **Every card is numbered** so snippets can be matched to cards later.
- ✅ **The cover QR is verified out of the RENDERED page**, not the source buffer, per the rule below.

## ⚠️ Things that are not obvious and cost real time

**Verify every QR by decoding it out of the RENDERED page, never the source buffer.**
The builders check the 900px original, which proves nothing about the 104px version that
actually prints. That is what `verify-*.js` is for. Several of these are **live Stripe
payment links** — a code that does not scan at a market table is the worst failure here.

**A failed decode is usually a wrong crop box, not a bad QR.** This wasted a long stretch:
every crop variant failed identically, which looked like a contrast problem and was in fact
a box computed from the wrong origin, clipping the code's right-hand columns. **Derive crop
boxes from the layout numbers, don't eyeball them**, and keep them in step when spacing
changes.

**There are THREE different parchments. Do not mix them.**

| File | Tone |
|---|---|
| card back | `#F6E9DA` |
| `card-front.png` (the dragon and vines) | `~#F5E7D6` |
| `card-frame.png` (the corner sprays) | `#f0ddbc` |

Borrow the dragon from one and the borders from another and he sits in a visibly paler
rectangle. **Take every element for a given sign from a single file.**

**Crop decorations WITH their own paper, then drop them on a background of the same tone.**
That is why this kit needs no alpha channel anywhere. Three attempts to key the art off its
gold ground all failed — the pale watercolour sits too close to the ground in colour space,
and unmultiplying a warm ground pushes recovered colour cold (sage → mint, dusty pink →
lilac). Those attempts are kept in `experiments/` so nobody repeats them.

**Never judge a texture patch by its average colour — look at it.** A 44x54 "clean paper"
patch passed a mean-tone check, had a small gold ornament in it, and tiled the whole display
sign with gold marks. One tiny high-contrast mark barely moves an average.

**Borrowed crops are rectangles.** Their edges need masking (`mask-image` with a gradient)
or they read as boxes sitting on the page.

**The wordmark is always LIVE TEXT reading "INK AND THREAD".** The card art itself says
"INK & THREAD"; the repo rule is the word "and", so their picture of the wordmark is never
used. See CLAUDE.md.

**Printing: "Actual size", never "Fit to page".** Fit-to-page shrinks a few percent and takes
the QR codes below the size they were verified at.

## Layout

- `paper-base.js` — shared palette, page CSS and wordmark for the letter-size signs
- `cut-frame.js`, `cut-card-front.js` — crop the reusable pieces out of the source art
- `verify-*.js` — decode QRs out of the rendered pages
- `experiments/` — the three failed background-removal approaches, kept as a record
- `legacy-teal/` — the older teal-and-gingham kit, superseded but still runnable
