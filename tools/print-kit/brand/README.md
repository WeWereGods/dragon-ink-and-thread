# Brand

**brand-package.html** — four letter pages that hold the whole brand in one place: the essentials
and the range, the marks, colour and type, voice and naming.

    cd tools/print-kit
    .\render.ps1 ..\brand\brand-package     # expect: pages: 4

## Why it exists

The brand was real but **scattered** — spread across CLAUDE.md, TASKS.md, the print kit and four
image files, with no single artifact holding it. That is survivable while one person does
everything and stops being survivable the moment anyone else touches it: a printer, a stamp maker,
a market organiser, a wholesale enquiry, or the same person on a new machine after the move.

## ⚠️ It restates. It does not decide.

**Every rule in it already lives in CLAUDE.md or TASKS.md.** If the document and those ever
disagree, **they win and this file is the one to correct.** A brand guide that quietly becomes a
second source of truth is exactly the drift it exists to prevent — the same failure as two
taglines, two parchments, or a copy of a caption living in Drive.

The page says this on itself, in as many words, so a reader who finds it loose on a desk knows.

## What it carries that is easy to get wrong

- **Colour values are MEASURED, not chosen.** The screen palette is read from `:root` in
  `css/styles.css`; the print palette was measured off the card art. Don't retype them by eye.
- **The two parchments.** `#f0ddbc` (card front — the one the kit is built on) versus `#F6E9DA`
  (card back). Mixing them leaves a visible seam where a cropped ornament meets flat colour.
- **Four marks, not one logo in four sizes**, each with a list of where it may *not* go.
- **The stamp is planned, not bought** — and the page carries the 2½″ minimum and the
  proof-before-the-die warning, because that is the decision it would be expensive to get wrong.
- **The move.** Every "San Antonio" expires around 2026-11-25, flagged on page one rather than
  buried, since it is the only fact in the document with a date on it.

## Images

It pulls four marks live from `assets/` (`logo.png`, `logo-badge.png`, `dragon-sleeping.png`,
`seal-dragon-35mm.png`) at `../../../assets/…`. **Check the page count and look at the PDF after
any change** — a missing image renders as a blank box, not an error.
