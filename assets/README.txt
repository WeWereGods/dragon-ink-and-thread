Dragon Ink and Thread — assets folder
=====================================

Drop your real images here and reference them from index.html.

Files the site already references:
  logo.png              — the dragon logo. USED NOW: shown big in the hero,
                          cropped into the round header emblem, and as the
                          browser tab favicon. Save your logo here as logo.png.
                          (If the header crop needs nudging, tweak
                          `.brand-logo` background-size / position in
                          css/styles.css.)

Product photos the site already references (drop files with these
exact names and they appear automatically — until then the cards
show an emoji placeholder):

  Totes card (print picker + thumbnail gallery):
    tote-fairy.jpg          — Fairy print, main photo   (DONE)
    tote-fairy-2.jpg        — Fairy, second angle       (DONE)
    tote-fairy-inside.jpg   — Fairy, lining             (DONE)
    tote-fairy-detail.jpg   — Fairy, close-up           (DONE)
    tote-floral.jpg         — Floral print, main        (DONE)
    tote-floral-inside.jpg  — Floral, lining            (DONE)
    tote-sunflower.jpg      — Sunflower (puffy), main    (DONE)
    tote-sunflower-detail.jpg — Sunflower, close-up      (DONE)

  Cozys card (style picker):
    cozy-bee.jpg            — Blue Bee slim-can cozy      (DONE)
    cozy-daisy.jpg          — Daisy cup/tumbler cozy      (DONE)

  Scrunchies card (print picker + $9 bundle):
    scrunchie-butterfly.jpg        — Butterfly print        (DONE)
    scrunchie-cherry-blossom.jpg   — Cherry Blossom print   (DONE)
    scrunchie-cherry.jpg           — Cherry print           (DONE)
    scrunchie-orange-kitty.jpg     — Orange Kitty print     (DONE)
    scrunchie-pink-bumble-bee.jpg  — Pink Bumble Bee print  (DONE)
    scrunchie-pretty-in-pink.jpg   — Pretty in Pink print   (DONE)
    scrunchie-wildflower.jpg       — Wildflower print       (DONE)
    scrunchie-bundle.jpg           — Bundle of 3 (red/cream/navy), $9  (DONE)

  Bow card:
    bow-sage.jpg           — Sage floral bow                (DONE)

Note: the web images above are optimized JPGs (~1280px, <250 KB). The
full-size originals (e.g. "Fairy tote outside.PNG") are kept locally
but gitignored. To add a new tote/cozy print, drop a photo here, then
add it to the VARIANTS map in js/main.js and an <option> in index.html.

Suggested files to add:
  about.jpg             — a photo of you / your workspace (About section)

How to use a photo instead of a placeholder block:
  In index.html, replace a <div class="placeholder ...">...</div>
  with, for example:
    <img src="assets/tote.jpg" alt="Handmade canvas tote bag" />

Tips:
  - Keep images reasonably sized (under ~500 KB each) for fast loading.
  - Always include descriptive alt text for accessibility and SEO.
