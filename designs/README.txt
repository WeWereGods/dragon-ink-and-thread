Design drawings for custom commissions.

These are working drawings shown to a customer BEFORE anything is cut — the
thing you agree and quote against, so a finished piece is never compared to a
reference image nobody ever actually made.

The .svg is the source and the thing to edit. The .png is a flattened copy for
sending to a customer; regenerate it with sharp (not a repo dependency — install
it in a scratch dir):

  sharp('x.svg', {density: 130}).png().toFile('x.png')

Nothing here is referenced by the website. These are not web assets and do not
belong in assets/ — they are records of a job.

  linda-memory-wall-hanging.svg   2026-08-13. Linda's heirloom wall hanging from
                                  her husband's Boss jacket, trousers, Geoffrey
                                  Beene shirt and pocket square. The SIMPLIFIED
                                  design — see TASKS.md for why the reference
                                  image she sent cannot be made from these four
                                  garments (there is nowhere near enough cream).
