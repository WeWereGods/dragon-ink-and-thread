/* Turn a Claude Design canvas export (.dc.html) into a printable PDF.
 *
 *   node tools/pattern-to-pdf.js designs/scrunchie-pattern.dc.html assets/chunky-scrunchie-pattern.pdf
 *
 * WHY THIS EXISTS. A .dc.html exported from the canvas does NOT open on its own.
 * It loads ./support.js and ./doc-page.js, which the export does not include, and
 * its stylesheet carries:
 *
 *     doc-page:not(:defined){visibility:hidden}
 *
 * so without those scripts the custom element never defines and every page is
 * BLANK. Not an error, not a warning — a blank sheet. This script strips the two
 * missing script tags and that one hiding rule, unwraps the canvas-only elements
 * (<x-dc>, <helmet>, <doc-page>), and adds real Letter page sizing so each
 * <section class="page"> lands on its own sheet.
 *
 * Rendering is done by the Chrome already installed on this machine — no
 * puppeteer, no node_modules, consistent with the rest of this repo having no
 * dependencies.
 *
 * ⚠️ THE .dc.html IN designs/ IS THE SOURCE. Edit that (or re-export over it),
 * then re-run this. Keeping the canvas and the repo both editable is the same
 * two-copies drift that CLAUDE.md warns about for Drive — the repo wins.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");

const [, , inArg, outArg] = process.argv;
if (!inArg || !outArg) {
  console.error("usage: node tools/pattern-to-pdf.js <in.dc.html> <out.pdf>");
  process.exitCode = 1;
  return;
}

const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].find((p) => fs.existsSync(p));

if (!CHROME) {
  console.error("No Chrome or Edge found. Both are checked in Program Files;");
  console.error("install either, or render the PDF from the canvas by hand.");
  process.exitCode = 1;
  return;
}

let s = fs.readFileSync(inArg, "utf8");

// The three things that keep the export from rendering.
s = s
  .replace(/<script src="\.\/support\.js"><\/script>/g, "")
  .replace(/<script src="\.\/doc-page\.js"><\/script>/g, "")
  .replace(/doc-page:not\(:defined\)\{visibility:hidden\}/g, "");

// Canvas-only wrappers.
s = s
  .replace(/<\/?x-dc>/g, "")
  .replace(/<\/?helmet>/g, "")
  .replace(/<doc-page[^>]*>/g, "")
  .replace(/<\/doc-page>/g, "");

// One <section class="page"> per printed sheet, no browser margins, keep colours.
s = s.replace(
  "</head>",
  `<style>
  @page { size: 8.5in 11in; margin: 0; }
  html, body { margin: 0; padding: 0; }
  section.page {
    width: 8.5in; height: 11in;
    page-break-after: always; break-after: page;
    overflow: hidden;
  }
  section.page:last-of-type { page-break-after: auto; break-after: auto; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
</style>
</head>`
);

const pages = (s.match(/<section class="page"/g) || []).length;
if (!pages) {
  console.error("No <section class=\"page\"> found — is this really a canvas export?");
  process.exitCode = 1;
  return;
}

const tmp = path.join(os.tmpdir(), "dit-pattern-" + Date.now() + ".html");
fs.writeFileSync(tmp, s, "utf8");

try {
  execFileSync(CHROME, [
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    // Google Fonts are fetched at render time; give them room to arrive.
    "--virtual-time-budget=10000",
    "--print-to-pdf=" + path.resolve(outArg),
    "file:///" + tmp.replace(/\\/g, "/"),
  ], { stdio: "pipe" });
} finally {
  try { fs.unlinkSync(tmp); } catch (e) {}
}

const size = fs.statSync(outArg).size;
console.log(`${outArg} — ${pages} pages, ${Math.round(size / 1024)}KB`);
console.log("⚠️ Open it. A blank PDF means the wrappers changed shape and the");
console.log("   strip above missed something — it will not error, it will be empty.");
