# Make sheets

One-page, print-at-home instructions for a piece that is worth making again — the cut list, the
order of work, and the mistakes that cost the most if you get them wrong. Same parchment palette
as the market kit, so a sheet beside the machine looks like it belongs with the tags and signs.

These are **hand-written HTML, not generated**: each piece has different numbers, and a generator
would take longer to write than the sheets it replaced.

**To render one** (headless Edge, same as the kit):

    cd tools/print-kit
    .\render.ps1 ..\make-sheets\rose-latte-cloud      # or open the HTML and print to PDF

Letter paper, one page. Check the page count if you add much text — two pages means it overflowed.

- **christmas-stocking.html** — 18in x 8in, fully lined, cuffed, hanging loop. Written 2026-09-28 because
  the $40–65 band had been published for weeks and not one had ever been made, so there was nothing to show
  and nothing to price against. **The first one is a SAMPLE, not a paid order.**
  ⛔ **No price on the sheet, deliberately** — the bands live in eight places and a ninth on workroom paper
  would drift silently. It points at custom.html and the order form instead.
  ⚠️ The two things that ruin a first stocking: **cutting two identical pieces instead of a mirrored pair**
  (fold the fabric and cut both at once), and **not clipping the heel and toe curves**, which puckers however
  well it was sewn. The gap for turning goes in the LINING, never the outer.

- **sailor-bow.html** — A Loop 12x6 on fold, B Tails 11x7 on fold with pointed ends, C Wrap 4x1.5,
  optional D Clip cover 3x1. 1/4in seam ALREADY IN the cuts. Finished 6x6 on a 2in alligator clip.
  ⚠️ **Numbers sourced from `designs/sailor-bow-pattern.dc.html`** (six pages, pieces printable at actual
  size). ⛔ **Change both together.**
  📌 **The clip is the supply that runs out** — one per bow against ~34 bows in stock. Fabric she always
  has; clips have to have been bought. Count them when counting bows.
  ⬜ **Calculated, not measured: ~8 bows per yard.** The pattern says a fat quarter per bow, which is the
  safe buying figure; yardage does better. Record the real number off the next batch.

- **scrunchie.html** — 5in x 26in strip, 10in of 5/8in elastic, 1/2in seam, burrito method, ~20 min.
  ⚠️ **THE NUMBERS ARE NOT SOURCED HERE.** `designs/scrunchie-pattern.dc.html` is a full three-page
  customer-facing pattern carrying the same figures; this is the one-page workroom version plus the batch
  maths a pattern has no reason to carry. ⛔ **Two documents, one set of numbers — change them together**,
  same rule as catSlug(), mdBold(), the SHIPPING constants and the eight price bands.
  📌 **8 scrunchies per yard**, and the 10in remnant is three hair whimsys — a yard quietly makes 11 things.
  ⬜ **Unconfirmed: whether 5x26 is the $6 shop spec or only the pattern chunky version.** Flagged on the
  sheet rather than assumed.

- **tea-cover-and-mat.html** — **MAT CONFIRMED 2026-09-29, cover still partly open.**
  Mat: **12in x 12in finished, nine 5in squares 3x3, 1/2in seam throughout, NO binding** — front, fusible
  interfacing, backing, turned and topstitched. Cover: **12in x 9in** (published in shop-data); its layers,
  patch grid and hem binding are still write-on boxes.
  📌 **This is the mug rug lesson applied in advance, and it paid off twice.** That sheet was written at
  6in x 9in and had to be rewritten to the real 10in x 7.5in, so this one shipped with WRITE-ON BOXES instead
  of numbers — and when the real measurements arrived, **two of the photo-read guesses were wrong**: the mat
  is not bound at all (the sheet had it bound in cream), and the seam is 1/2in, not the 1/4in a quilter
  assumes. Both were boxes, so nothing had to be unlearned.
  🔍 **The 1/2in seam was DERIVED and is the only value that works:** 3 x 5in = 15in, less two 1/2in seams
  = a 13in panel, less 1/2in all round when turned = 12in. A 1/4in seam finishes at 13.5in. It also matches
  `designs/scrunchie-pattern.dc.html`, which uses 1/2in.
  ✅ **The middle layer is HEAT-RESISTANT BATTING** (owner, 2026-09-29), not plain interfacing — **so it is a
  trivet, not a placemat, and it genuinely protects the table.** That is a listing line and half the argument
  for clearing the $40 home-pieces floor. ⚠️ **It is also a supply that has to have been bought**, like the
  2in bow clips. 📌 *Insul-Fleece* is iron-on, *Insul-Bright* is not and is basted or quilted in; the sheet
  covers both, so which one is in the cupboard does not block sewing.
  ⛔ **No price band on it**, same rule as the swatch book and the sample tags.

- **gift-card-holder-envelope.html** — two 3.5in x 4.5in body scraps + four 3in squares folded to triangles,
  no interfacing, finished **4in x 3in**. Cut list given by the owner 2026-09-29.
  🔍 **The 1/4in seam was DERIVED and is near-certain:** it holds a 3 3/8 x 2 1/8 gift card with 5/8in of
  clearance, where 1/2in leaves only 1/8in and the card fights every time.
  ⚠️ **SEAM ALLOWANCES ARE NOT CONSISTENT ACROSS THESE SHEETS AND MUST NOT BE ASSUMED.** The tea mat and the
  scrunchie are **1/2in**; the sailor bow and this are **1/4in**. Both live in her work.
  📌 **This is the SCRAP product** — nothing is bigger than 3.5 x 4.5, so it eats offcuts from bows, bandanas
  and scrunchies that are otherwise too small to be anything. With sewing stopping ~Nov 7 and the move on
  Nov 25, every scrap sewn into one is a scrap not boxed and driven to Virginia.
  ⬜ **A SECOND, DIFFERENT gift card holder exists** — a flat sleeve in an elephant border print (`IMG_8281`),
  fussy-cut so the elephants land as a band. **Its numbers have not been given**, so it has no sheet yet.
  **Do not fold the two patterns into one sheet.**

- **book-sleeve-sizes.html** — THREE sizes of sleeve (S Kindle / M paperback / L hardcover) as cut
  lists only; the construction stays on **padded-book-sleeve.html** so two sheets cannot disagree about
  the same seams. ⚠️ **The S column is copied from that sheet** — if its numbers ever change, change this
  column with them. The sheet prints the four rules it was derived from, so a fourth size needs no one's help.
  📌 **Thickness belongs to the WIDTH**, not the height: a flat sleeve wraps around the spine, so a 2in
  romantasy hardcover 6¼in across needs 8¼in of inside width. That is the mistake the sheet exists to stop.

- **rose-latte-cloud.html** — the puff tote: 11 x 11.5 x 6in, 32 hand-stuffed pillows (64 squares), brown plaid
  lining, blush pocket, cream straps at an 11in drop. Written 2026-09-21 while the first one was
  being finished, so the numbers are the ones that were actually sewn.
