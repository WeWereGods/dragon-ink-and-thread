/* Free patterns — the single source of truth.
 *
 * Read by tools/build-patterns.js, which writes one page per pattern plus the
 * patterns.html index. Nothing on the site reads this file at runtime; the
 * generated pages are fully static.
 *
 * ⚠️ ADDING A PATTERN — the order matters, and two steps fail silently:
 *   1. Write the pattern in designs/<slug>.dc.html (see the dog neckerchief for
 *      the flattening rules — canvas templating does NOT survive the PDF tool).
 *   2. node tools/pattern-to-pdf.js designs/<slug>.dc.html assets/<pdf>
 *      ⚠️ It warns on missing images. Read the output; a blank photo is silent
 *         in the PDF itself.
 *   3. Add the entry below.
 *   4. node tools/build-patterns.js     — writes the pages + the index
 *   5. node tools/build-products.js     — the SITEMAP is written there, and it
 *      reads this file. Skip it and the new pattern is invisible to search.
 *   6. node tools/bump-assets.js        — restamps ?v= tokens
 *
 * ⚠️ `file` IS A PUBLISHED URL. `pattern.html` is deliberately NOT
 * `pattern-chunky-scrunchie.html`: it has been live since 2026-08-25, it is
 * pinned on Pinterest and it carried the Facebook post that produced 86% of the
 * page's first-day traffic. Renaming it would 404 all of that. New patterns get
 * `pattern-<slug>.html`; this one keeps the URL it earned.
 *
 * ⚠️ EACH PATTERN NEEDS ITS OWN `tag`. Both forms post to the same Buttondown
 * list, and the tag is the ONLY way tools/buttondown-report.js can tell you
 * which pattern actually pulls. Reusing `pattern` across two would merge them
 * permanently — the first one's zero-conversion measurement (2026-08-27) is
 * exactly the kind of finding that becomes unreadable if the tags are shared.
 */
window.DIT_PATTERNS = {
  PATTERNS: [
    {
      id: "chunky-scrunchie",
      file: "pattern.html",
      tag: "pattern",
      pdf: "assets/chunky-scrunchie-pattern.pdf",
      source: "designs/scrunchie-pattern.dc.html",

      // ⚠️ TITLES AND DESCRIPTIONS CARRY SEARCH TERMS ON PURPOSE (2026-08-26).
      // This page used to be titled "A free sewing pattern", which names neither
      // the item nor a single word anyone types into Pinterest or Google. The
      // terms that matter are "free sewing pattern", "chunky scrunchie" and
      // "beginner" — keep them in the title, the description and the pin image.
      title: "Free Chunky Scrunchie Sewing Pattern — Beginner | Dragon Ink and Thread",
      metaDesc:
        "A free chunky scrunchie sewing pattern — one rectangle, one elastic, about twenty minutes. Beginner-friendly, with the cutting layout, seam allowances and every step written out. From Dragon Ink and Thread in San Antonio, Texas.",
      ogTitle: "Free Chunky Scrunchie Sewing Pattern — Beginner-Friendly",
      ogDesc:
        "One rectangle, one elastic, about twenty minutes. Free to download, with the cutting layout, seam allowances and every step written out.",
      twitterDesc: "One rectangle, one elastic, about twenty minutes. Free to download.",

      // ⚠️ DELIBERATELY TALL (1000x1500, 2:3), unlike every other page on the
      // site, which shares the 1200x630 og-image-v2.jpg brand card. Pinterest is
      // a vertical medium and a free pattern is a Pinterest asset above all —
      // this page previously offered the landscape LOGO card, so anyone saving
      // it pinned a logo in the wrong shape. Built by tools/build-pin-images.js
      // (pinPattern); re-run it if the photo changes.
      pin: {
        url: "assets/pins/pin-free-pattern.jpg",
        w: 1000,
        h: 1500,
        alt: "A handmade butterfly-print chunky scrunchie, with the words Free Sewing Pattern above it",
      },

      eyebrow: "A Gift from the Nest",
      h1: "The Chunky Scrunchie — a free sewing pattern",
      sub: "One rectangle of fabric, one piece of elastic, about twenty minutes. No tracing, no pattern pieces to print and tape — just measure, cut and sew. If you have used a sewing machine once, you can make this.",

      photo: {
        src: "assets/scrunchie-butterfly.jpg",
        alt: "A finished chunky scrunchie in a cream butterfly print, generously gathered on its elastic",
      },

      points: [
        "<strong>Every measurement up front</strong> — a 5in × 26in strip, 10in of ⅝in elastic, ½in seam allowance",
        "<strong>Ten steps</strong>, using the burrito method — the whole thing turns right side out with no raw edges anywhere",
        "<strong>What to buy</strong> — ¼ yard is plenty, and why a fat quarter will not do",
        "<strong>Finished size</strong> — a 2in band on a 3in loop, properly chunky",
      ],

      pitch:
        "I sell these for $6 and I am giving you the pattern anyway, because a scrunchie is the piece that teaches you a seam without costing you anything if it goes wrong. Make it in a scrap. If you like it, make ten.",

      // The index card.
      cardTitle: "The Chunky Scrunchie",
      cardBlurb: "One rectangle, one elastic. The piece that teaches you a seam.",
      level: "First project",
      time: "About 20 minutes",
    },

    {
      id: "dog-neckerchief",
      file: "pattern-dog-neckerchief.html",
      tag: "pattern-neckerchief",
      pdf: "assets/dog-neckerchief-pattern.pdf",
      source: "designs/dog-neckerchief-pattern.dc.html",

      // "Dog bandana" is searched far more than "neckerchief", so both words are
      // in the title and the description. "Elastic" and the size range are the
      // two things that distinguish this from the hundred tie-on versions.
      title:
        "Free Dog Bandana Sewing Pattern — Elastic Neckerchief, XS–XL | Dragon Ink and Thread",
      metaDesc:
        "A free dog bandana sewing pattern — an elastic neckerchief that pulls on over the head, with no ties to knot. Sizes XS to XL, two pattern pieces, every edge straight. Cutting layout, seam allowances and every step written out. From Dragon Ink and Thread in San Antonio, Texas.",
      ogTitle: "Free Dog Bandana Sewing Pattern — Elastic, Sizes XS to XL",
      ogDesc:
        "It pulls on over the head, so there is nothing to knot and nothing that can tighten at the throat. Two pieces, every edge straight, about forty-five minutes.",
      twitterDesc:
        "An elastic dog neckerchief that pulls on over the head. Free to download, sizes XS to XL.",

      // Tall 2:3, same reasoning as the scrunchie above — Pinterest is a
      // vertical medium and a free pattern is a Pinterest asset above all.
      // Built by pinNeckerchief() in tools/build-pin-images.js; re-run it if
      // the photo changes.
      pin: {
        url: "assets/pins/pin-free-pattern-neckerchief.jpg",
        w: 1000,
        h: 1500,
        alt: "A dog wearing a handmade patchwork neckerchief, with the words Free Sewing Pattern above it",
      },

      eyebrow: "A Gift from the Nest",
      h1: "The Elastic Dog Neckerchief — a free sewing pattern",
      sub: "A lined kerchief on a folded neckband, so it pulls on over the head — no ties to knot, and nothing that can tighten at the throat. Two pieces, every edge straight, and the body is drawn with a ruler rather than traced. Sizes XS to XL.",

      photo: {
        src: "assets/pattern-neckerchief-worn.jpg",
        alt: "A dark dog sitting, wearing the finished patchwork neckerchief",
      },

      points: [
        "<strong>Five sizes, XS to XL</strong> — a full chart in inches, fitting necks from 8in to 26in, with the band and elastic length for each",
        "<strong>Two pattern pieces</strong>, both straight-edged — a ruled body and a single long strip for the band",
        "<strong>Four drawn diagrams</strong> — the body, the folded band, the cutting layout and the assembly",
        "<strong>A tie version too</strong>, if you would rather have ribbons than elastic",
        "<strong>Fit, safety and washing</strong> — including the things to take it off for",
      ],

      pitch:
        "I sell these ready-made, and I am giving you the pattern anyway. A neckerchief is a satisfying afternoon: it is finished quickly, it fits a dog you love, and it is entirely straight lines — no curves, no zips, nothing to ease. Make it in a fat quarter you have been saving.",

      cardTitle: "The Elastic Dog Neckerchief",
      cardBlurb: "Pulls on over the head, no ties to knot. Sizes XS to XL.",
      level: "First project",
      time: "About 45 minutes",
    },
  ],
};
