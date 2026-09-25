// The market SALES SHEET - tick a box as each piece sells.
//
// Written 2026-09-25 because the Sep 19 market could not be reconstructed afterwards.
// Stripe had the three card sales ($32, $10, $11) and the cash was $43, and that was the
// whole record. Two of the three card amounts matched no list price, so the takings could
// not be worked back to items by arithmetic. Nobody could say what actually sold.
//
// ⚠️ THE ROUNDED-PRICE ROWS ARE THE POINT, not an afterthought. She rounds at the table -
// $10 and $11 both happened on one day - so a sheet that only allows list prices produces
// a tally that does not reconcile, which is worse than no sheet at all.
//
// White paper, brand ink, same reasoning as the order forms: this is written on, not
// looked at, and a stack of full-bleed parchment costs a cartridge.
//
// ⚠️ PRICES HERE MUST MATCH THE PRICE LIST (build-price-sign.js). Change both together.
const fs = require("fs");
const path = require("path");
const b = require("./paper-base");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });

const ITEMS = [
  ["Sticker &#183; Creating Whimsy", "$3"],
  ["Hair Whimsy", "$5"],
  ["Scrunchie", "$6"],
  ["Sachet", "$6"],
  ["Gift Card Holder", "$10"],
  ["Cozy Gift Set", "$10"],
  ["Bow", "$12"],
  ["Mug Rug", "$12"],
  ["Pet Bandana", "$18"],
  ["Patchwork Bandana", "$22"],
  ["Book Sleeve", "$28"],
  ["Tote &#8212; write which one", "&#8212;"],
];

const DEALS = [
  ["Bows, 2 for", "$20"],
  ["Scrunchies, 3 for", "$15"],
  ["Sachets, 2 for", "$10"],
];

const HEARD = ["Facebook", "Instagram", "TikTok", "Walked past", "A friend told me", "Bought before"];

const TICKS = 16;

const css = [
  "html,body{background:#fff;}",
  ".sheet{position:relative;width:816px;height:1056px;overflow:hidden;background:#fff;padding:40px 46px 30px;}",
  ".hd{display:flex;align-items:flex-end;justify-content:space-between;}",
  ".ttl{font-family:var(--display);font-size:34px;font-weight:700;color:var(--wine);line-height:1;text-align:right;}",
  ".ttl i{display:block;font-family:var(--body);font-style:normal;font-size:9.5px;font-weight:800;",
  "  letter-spacing:.15em;text-transform:uppercase;color:var(--sage);margin-top:5px;}",
  ".bar{height:2px;background:var(--sage);opacity:.65;margin:10px 0 6px;}",
  ".row{display:flex;gap:16px;margin-bottom:4px;}",
  ".f{flex:1;}",
  ".f label{display:block;font-size:9px;font-weight:800;letter-spacing:.11em;text-transform:uppercase;",
  "  color:var(--sage);margin-bottom:1px;}",
  ".f i{display:block;height:22px;border-bottom:1.3px solid var(--sage);}",
  ".h{font-family:var(--display);font-size:16.5px;font-weight:700;color:var(--green);margin:10px 0 3px;}",
  ".h span{font-family:var(--body);font-size:9.5px;font-weight:700;color:var(--sage);text-transform:none;margin-left:8px;}",
  "table{width:100%;border-collapse:collapse;}",
  "th{text-align:left;font-size:8.5px;letter-spacing:.09em;text-transform:uppercase;color:var(--sage);",
  "   border-bottom:1.3px solid var(--sage);padding:0 4px 3px 0;}",
  "td{padding:2px 4px 2px 0;border-bottom:1px dotted rgba(147,136,88,.5);font-size:11px;}",
  "td.nm{width:168px;}",
  "td.pr{width:40px;font-weight:800;color:var(--wine);}",
  "td.tk{white-space:nowrap;}",
  "td.tk span{display:inline-block;width:13px;height:13px;border:1.1px solid var(--sage);margin-right:3.5px;",
  "  vertical-align:middle;}",
  "td.ct{width:44px;border-left:1px dotted rgba(147,136,88,.5);}",
  "td.mn{width:58px;}",
  ".deal td.nm{font-style:italic;}",
  ".blank td.nm i,.blank td.pr i{display:block;height:15px;border-bottom:1px solid rgba(147,136,88,.7);}",
  // money box
  ".money{border:1.5px solid var(--wine);padding:8px 12px;margin-top:9px;}",
  ".money .mh{font-family:var(--display);font-size:15px;font-weight:700;color:var(--wine);margin-bottom:4px;}",
  ".ml{display:flex;align-items:center;gap:10px;font-size:11px;margin-bottom:3px;}",
  ".ml b{width:230px;flex:none;color:var(--ink);font-weight:700;}",
  ".ml i{flex:1;border-bottom:1.2px solid var(--sage);height:17px;}",
  ".ml em{font-style:italic;color:var(--sage);font-size:9.5px;width:150px;flex:none;}",
  ".heard{display:grid;grid-template-columns:repeat(3,1fr);gap:3px 14px;margin-top:3px;}",
  ".hr1{font-size:10.5px;}",
  ".hr1 u{text-decoration:none;display:inline-block;border-bottom:1px dotted rgba(147,136,88,.7);width:52px;}",
  ".ft{position:absolute;left:46px;right:46px;bottom:18px;display:flex;justify-content:space-between;",
  "  font-size:9px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--sage);}",
].join("\n");

const ticks = '<td class="tk">' + '<span></span>'.repeat(TICKS) + "</td>";
const row = (nm, pr, cls) =>
  '<tr class="' + (cls || "") + '"><td class="nm">' + nm + '</td><td class="pr">' + pr + "</td>" +
  ticks + '<td class="ct"></td><td class="mn"></td></tr>';

const blank = '<tr class="blank"><td class="nm"><i></i></td><td class="pr"><i></i></td>' +
  ticks + '<td class="ct"></td><td class="mn"></td></tr>';

const line = (label, hint) =>
  '<div class="ml"><b>' + label + '</b><em>' + (hint || "") + "</em><i></i></div>";

const body =
  '<div class="sheet">' +
    '<div class="hd"><div>' + b.wordmark(24, 10) + "</div>" +
      '<div class="ttl">Sales Sheet<i>Tick one box per piece as it sells</i></div></div>' +
    '<div class="bar"></div>' +
    '<div class="row">' +
      '<div class="f"><label>Market</label><i></i></div>' +
      '<div class="f"><label>Date</label><i></i></div>' +
      '<div class="f"><label>Weather &#183; how busy</label><i></i></div>' +
    "</div>" +

    '<h2 class="h">What sold<span>one box each &#183; count them up at the end</span></h2>' +
    "<table>" +
      "<tr><th>Item</th><th>Price</th><th>Tick as they go</th><th>No.</th><th>$</th></tr>" +
      ITEMS.map(([n, p]) => row(n, p)).join("") +
      DEALS.map(([n, p]) => row(n, p, "deal")).join("") +
      blank + blank + blank +
    "</table>" +
    '<div style="font-size:10px;color:#7B322C;margin-top:4px"><b>Rounded the price for someone? '
      + 'Write the amount on a blank line.</b> Two of the three card sales on Sep 19 matched no '
      + 'list price, and the day could never be worked out afterwards.</div>' +

    '<div class="money"><div class="mh">At the end of the night</div>' +
      line("Float you started with", "count it before you leave") +
      line("Cash in the box at close", "") +
      line("CASH SALES", "close minus float") +
      line("Card sales", "Stripe app &#183; today only") +
      line("TOTAL TAKINGS", "cash + card") +
      line("Tax inside that", "total &#247; 1.0825, then subtract") +
    "</div>" +

    '<h2 class="h">How did you hear about me?<span>ask everyone who buys</span></h2>' +
    '<div class="heard">' + HEARD.map((h) => '<div class="hr1">' + h + " <u></u></div>").join("") + "</div>" +

    '<div class="ft"><span>Dragon Ink and Thread</span><span>One sheet per market</span></div>' +
  "</div>";

fs.writeFileSync(path.join(SIGN, "p-sales-sheet.html"), b.doc("Sales sheet", css, body));
console.log("wrote p-sales-sheet.html");
