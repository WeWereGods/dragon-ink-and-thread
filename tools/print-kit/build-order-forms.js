// Custom order paperwork for the market table: the full ORDER FORM and a page of
// quick LEAD SLIPS for someone who is interested but not ready to specify anything.
//
// Deliberately NOT on the parchment. Every other sheet in this kit is a thing to
// look at; these are things to write on. A full-bleed parchment ground costs a
// cartridge to print a stack of, and biro on a mid-tone background is hard to read
// back later. White paper, brand ink. Same fonts and the same live-text wordmark.
//
// WRITE-ON LINES are 26px tall, which is a comfortable adult hand at 96dpi. Do not
// shrink them to win space - an unfillable form is worse than a second page.
//
// The PRICE BANDS on the form are the EIGHTH place they live. CLAUDE.md lists seven.
// If a band ever changes, change it here too. The bands are also the reason this
// sheet has to name the QUILT TURNAROUND EXCEPTION: everywhere that pairs a band
// with "10-14 days" must say that quilts are 8-12 weeks, or the paper promises
// something that cannot be delivered.
const fs = require("fs");
const path = require("path");
const b = require("./paper-base");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });

const WANTS = [
  "Tote", "Book sleeve", "Home piece", "Pet bandana", "Bow", "Scrunchie",
  "Christmas stocking", "Gift card holder", "Quilt", "Repair or mending",
];

const BANDS = [
  ["Totes", "$50&#8211;100"], ["Book sleeves", "$35&#8211;50"], ["Home pieces", "$40&#8211;60"],
  ["Pet bandanas", "$22&#8211;35"], ["Bows", "$13&#8211;20"], ["Scrunchies", "$8&#8211;12"],
  ["Stockings", "$40&#8211;65"], ["Gift card holders", "$12&#8211;18"],
  ["Quilts", "from $350"], ["Repairs", "from $40"],
];

const NEXT = [
  "I&rsquo;ll email you a written quote, usually within two days.",
  "Nothing is cut until the quote is agreed and paid in full.",
  "Most pieces take <b>10&#8211;14 days</b> from agreeing the details. <b>Quilts take 8&#8211;12 weeks</b>.",
  "Custom pieces are made to your specification, so they are <b>final sale</b>.",
  "If you supply the fabric, cutting it cannot be undone. I&rsquo;ll confirm in writing before I start.",
];

const css = [
  "html,body{background:#fff;}",
  ".sheet{position:relative;width:816px;height:1056px;overflow:hidden;background:#fff;padding:46px 54px 34px;",
  "  break-after:page;page-break-after:always;}",
  ".sheet:last-child{break-after:auto;page-break-after:auto;}",
  // header
  ".hd{display:flex;align-items:flex-end;justify-content:space-between;}",
  ".ttl{font-family:var(--display);font-size:38px;font-weight:700;color:var(--wine);line-height:1;}",
  ".ttl i{display:block;font-family:var(--body);font-style:normal;font-size:10px;font-weight:800;",
  "  letter-spacing:.16em;text-transform:uppercase;color:var(--sage);margin-top:5px;text-align:right;}",
  ".bar{height:2px;background:var(--sage);opacity:.65;margin:12px 0 4px;}",
  // section headings
  ".h{font-family:var(--display);font-size:17px;font-weight:700;color:var(--green);margin:13px 0 5px;",
  "  letter-spacing:.02em;}",
  ".h span{font-family:var(--body);font-size:10px;font-weight:700;color:var(--sage);letter-spacing:.04em;",
  "  text-transform:none;margin-left:8px;}",
  // write-on fields
  ".row{display:flex;gap:18px;}",
  ".f{flex:1;}",
  ".f label{display:block;font-size:9.5px;font-weight:800;letter-spacing:.11em;text-transform:uppercase;",
  "  color:var(--sage);margin-bottom:1px;}",
  ".f i{display:block;height:26px;border-bottom:1.3px solid var(--sage);}",
  ".lines i{display:block;height:26px;border-bottom:1.3px solid var(--sage);}",
  // checkbox grid
  ".ticks{display:grid;grid-template-columns:repeat(4,1fr);gap:7px 14px;margin-top:3px;}",
  ".tk{display:flex;align-items:center;gap:7px;font-size:11.5px;color:var(--ink);}",
  ".bx{width:13px;height:13px;border:1.4px solid var(--sage);flex:none;}",
  ".tk.wide{grid-column:span 2;}",
  ".tk.wide i{flex:1;border-bottom:1.3px solid var(--sage);height:14px;}",
  // bands strip
  ".bands{display:grid;grid-template-columns:repeat(5,1fr);gap:3px 12px;border:1.3px solid var(--sage);",
  "  padding:8px 11px;margin-top:5px;}",
  ".bd{font-size:10.5px;color:var(--ink);display:flex;justify-content:space-between;gap:6px;}",
  ".bd b{color:var(--wine);font-weight:800;white-space:nowrap;}",
  // next steps
  ".next{border-left:3px solid var(--wine);background:rgba(123,50,44,.06);padding:8px 12px;margin-top:6px;}",
  ".next ol{margin:0;padding-left:17px;font-size:10.8px;line-height:1.42;}",
  ".next ol li b{color:var(--wine);}",
  // sign-off + office box
  ".sign{display:flex;gap:18px;align-items:flex-end;margin-top:10px;}",
  ".mine{border:1.3px dashed var(--sage);padding:7px 11px;margin-top:10px;}",
  ".mine .lb{font-size:9.5px;font-weight:800;letter-spacing:.11em;text-transform:uppercase;color:var(--sage);}",
  ".mine .rw{display:flex;gap:16px;align-items:center;margin-top:5px;font-size:11px;}",
  ".mine .rw i{flex:1;border-bottom:1.3px solid var(--sage);height:20px;}",
  ".ft{position:absolute;left:54px;right:54px;bottom:20px;display:flex;justify-content:space-between;",
  "  font-size:9.5px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--sage);}",
  // --- lead slips
  ".quads{display:grid;grid-template-columns:repeat(2,354px);grid-template-rows:repeat(2,487px);",
  "  border-left:1px dashed rgba(147,136,88,.8);border-top:1px dashed rgba(147,136,88,.8);}",
  ".q{border-right:1px dashed rgba(147,136,88,.8);border-bottom:1px dashed rgba(147,136,88,.8);",
  "  padding:26px 26px 18px;display:flex;flex-direction:column;}",
  ".q .wm{text-align:center;}",
  ".q .sc{font-family:var(--script);color:var(--wine);font-size:27px;text-align:center;margin-top:7px;line-height:1;}",
  ".q .hr{height:1.3px;background:var(--sage);opacity:.6;margin:11px 0 3px;}",
  ".q .f label{font-size:9px;}",
  ".q .f i{height:25px;}",
  ".q .sm{font-size:9.6px;line-height:1.38;color:var(--ink);margin-top:auto;}",
  ".q .sm b{color:var(--wine);}",
  ".q .dom{text-align:center;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;",
  "  color:var(--green);margin-top:7px;}",
].join("\n");

const field = (label, cls) => '<div class="f ' + (cls || "") + '"><label>' + label + "</label><i></i></div>";
const tick = (t) => '<div class="tk"><span class="bx"></span>' + t + "</div>";

// ---------- the full order form ----------
const form =
  '<div class="sheet">' +
    '<div class="hd"><div>' + b.wordmark(26, 11) + "</div>" +
      '<div class="ttl">Custom Order<i>Tell me what you would like made</i></div></div>' +
    '<div class="bar"></div>' +

    '<div class="h">Your details</div>' +
    '<div class="row">' + field("Name") + field("Email &#183; the best way to reach you") + "</div>" +
    '<div class="row">' + field("Phone") + field("Today&rsquo;s date") + field("Where we met") + "</div>" +

    '<div class="h">What you&rsquo;d like<span>tick as many as you like</span></div>' +
    '<div class="ticks">' + WANTS.map(tick).join("") +
      '<div class="tk wide"><span class="bx"></span>Something else <i></i></div></div>' +

    '<div class="h">Tell me about it<span>size, colours, who it&rsquo;s for, anything it has to fit</span></div>' +
    '<div class="lines"><i></i><i></i><i></i><i></i></div>' +

    '<div class="h">Measurements &amp; fabric</div>' +
    '<div class="row">' + field("Item or device size") + field("Neck, strap or drop") + "</div>" +
    '<div class="ticks" style="grid-template-columns:repeat(3,1fr);margin-top:8px">' +
      tick("I&rsquo;ll pick from your fabric library") + tick("Send me some photos") +
      tick("I&rsquo;m supplying the fabric") + "</div>" +
    '<div class="row" style="margin-top:6px">' + field("Fabric name or number") + field("Needed by") + "</div>" +

    '<div class="h">A rough guide to cost<span>your written quote comes by email</span></div>' +
    '<div class="bands">' + BANDS.map(([k, v]) => '<div class="bd">' + k + " <b>" + v + "</b></div>").join("") + "</div>" +

    '<div class="h">What happens next</div>' +
    '<div class="next"><ol>' + NEXT.map((t) => "<li>" + t + "</li>").join("") + "</ol></div>" +

    '<div class="sign">' + field("Signed &#183; I&rsquo;ve read what happens next") + field("Date") + "</div>" +

    '<div class="mine"><div class="lb">For me</div><div class="rw">' +
      "Quoted $<i></i> Quote sent <span class=\"bx\"></span> Paid <span class=\"bx\"></span> " +
      "Started <span class=\"bx\"></span> Delivered <span class=\"bx\"></span></div></div>" +

    '<div class="ft"><span>Dragon Ink and Thread</span><span>dragoninkandthread.com</span></div>' +
  "</div>";

// ---------- quarter-page lead slips ----------
const slip =
  '<div class="q">' +
    '<div class="wm">' + b.wordmark(19, 8.5) + "</div>" +
    '<div class="sc">Let&rsquo;s make something</div>' +
    '<div class="hr"></div>' +
    field("Name") + field("Email") + field("Phone") +
    '<div class="f"><label>What you&rsquo;re after</label><i></i><i style="display:block;height:25px;border-bottom:1.3px solid var(--sage)"></i></div>' +
    '<div class="row" style="margin-top:2px">' + field("Date") + field("Where we met") + "</div>" +
    '<div class="sm">I&rsquo;ll email you a written quote. <b>Nothing is cut until it&rsquo;s agreed and paid</b>, ' +
      "and most pieces take 10&#8211;14 days (quilts longer).</div>" +
    '<div class="dom">dragoninkandthread.com</div>' +
  "</div>";

const slips =
  '<div class="sheet" style="padding:41px 54px">' +
    '<div class="quads">' + new Array(4).fill(slip).join("") + "</div>" +
  "</div>";

fs.writeFileSync(path.join(SIGN, "p-order-form.html"), b.doc("Custom order form", css, form));
console.log("wrote p-order-form.html");
fs.writeFileSync(path.join(SIGN, "p-lead-slips.html"), b.doc("Lead slips", css, slips));
console.log("wrote p-lead-slips.html");
