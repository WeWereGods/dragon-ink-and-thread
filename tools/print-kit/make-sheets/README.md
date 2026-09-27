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

- **book-sleeve-sizes.html** — THREE sizes of sleeve (S Kindle / M paperback / L hardcover) as cut
  lists only; the construction stays on **padded-book-sleeve.html** so two sheets cannot disagree about
  the same seams. ⚠️ **The S column is copied from that sheet** — if its numbers ever change, change this
  column with them. The sheet prints the four rules it was derived from, so a fourth size needs no one's help.
  📌 **Thickness belongs to the WIDTH**, not the height: a flat sleeve wraps around the spine, so a 2in
  romantasy hardcover 6¼in across needs 8¼in of inside width. That is the mistake the sheet exists to stop.

- **rose-latte-cloud.html** — the puff tote: 11 x 11.5 x 6in, 32 hand-stuffed pillows (64 squares), brown plaid
  lining, blush pocket, cream straps at an 11in drop. Written 2026-09-21 while the first one was
  being finished, so the numbers are the ones that were actually sewn.
