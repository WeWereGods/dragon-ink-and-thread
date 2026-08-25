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

  linda-memory-wall-hanging.svg   2026-08-13, REDRAWN 2026-08-19. Linda's heirloom wall hanging from
                                  her husband's Boss jacket, trousers, Geoffrey
                                  Beene shirt and pocket square. The SIMPLIFIED
                                  design — see TASKS.md for why the reference
                                  image she sent cannot be made from these four
                                  garments (there is nowhere near enough cream).

  scrunchie-pattern.dc.html       2026-08-25. THE SOURCE for the free Chunky
                                  Scrunchie pattern. A Claude Design canvas
                                  export. Regenerate the PDF with:

                                    node tools/pattern-to-pdf.js \
                                      designs/scrunchie-pattern.dc.html \
                                      assets/chunky-scrunchie-pattern.pdf

                                  ⚠️ A .dc.html DOES NOT OPEN ON ITS OWN. It
                                  loads ./support.js and ./doc-page.js, which
                                  the export omits, and its CSS hides the page
                                  until they define it. Opened raw it is BLANK
                                  — no error. The tool strips exactly that.
                                  ⚠️ THIS FILE IS THE SOURCE, not the canvas.
                                  It was edited here on 2026-08-25, so the
                                  canvas is now the stale copy. Two editable
                                  copies is the Drive-drift problem again;
                                  re-export over this file or edit it here, but
                                  do not maintain both.
