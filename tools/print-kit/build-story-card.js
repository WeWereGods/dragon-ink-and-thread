// Story card for the Rose Latte Cloud puff tote - true 4 x 6, to stand beside it.
// At $95 it is the dearest thing on the table, and the work that justifies the price
// (64 squares, 32 hand-stuffed pillows, ~6 hours) is invisible unless something says so.
// Built from build-what-cards.js; the steps list is reused as a list of facts.
const fs = require("fs");
const path = require("path");

const SIGN = path.join(__dirname, "build");
if (!fs.existsSync(SIGN)) fs.mkdirSync(SIGN, { recursive: true });
const KIT = path.join(SIGN, "kit").replace(/\\/g, "/");
const url = (f) => "file:///" + KIT + "/" + f;

const W = 384, H = 576;
const S = 0.48;
const CORNER = Math.round(250 * S);
const TILE_W = Math.round(320 * S);
const TILE_H = Math.round(300 * S);

const CARDS = [
  {
    key: "rose-latte", eyebrow: "the story of the", title: "Rose Latte Cloud", price: 95,
    lead: "Sixty-four squares of fabric, sewn into thirty-two little pillows, each one stuffed and closed on its own, then pieced into one puffy tote.",
    // HTML entities, not literal symbols: PowerShell 5.1 re-saves this file as ANSI and mangles them.
    steps: ["Brown plaid lining, blush pocket", "Cream straps, 11&Prime; drop", "11&Prime; wide &middot; 11&frac12;&Prime; tall &middot; 6&Prime; deep"],
    note: "Every pillow is filled by hand, so no two sit exactly alike. One of a kind.",
    close: "caffeinated on cloud nine",
  },
];

const FONTS =
  '<link rel="preconnect" href="https://fonts.googleapis.com">' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Nunito:wght@600;700;800&display=swap" rel="stylesheet">';

const fade = (h, v) =>
  "linear-gradient(to " + h + ",#000 70%,transparent),linear-gradient(to " + v + ",#000 70%,transparent)";

const css = [
  ":root{--paper:#f0ddbc;--green:#4e5839;--sage:#938858;--wine:#7b322c;--rose:#9e5e58;--ink:#3b3327;",
  "  --display:'Cormorant Garamond',Georgia,serif;--script:'Great Vibes','Segoe Script',cursive;--body:'Nunito','Segoe UI',sans-serif;}",
  "@page{size:4in 6in;margin:0;}",
  "*{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}",
  "html,body{width:" + W + "px;background:#fff;}",
  "body{font-family:var(--body);color:var(--ink);}",
  ".card{position:relative;width:" + W + "px;height:" + H + "px;overflow:hidden;background-color:var(--paper);",
  "  background-image:url('" + url("paper.png") + "');background-size:" + TILE_W + "px " + TILE_H + "px;background-repeat:repeat;",
  "  break-after:page;page-break-after:always;}",
  ".card:last-child{break-after:auto;page-break-after:auto;}",
  ".c{position:absolute;width:" + CORNER + "px;height:" + CORNER + "px;background-size:" + CORNER + "px " + CORNER + "px;",
  "  -webkit-mask-composite:source-in;mask-composite:intersect;}",
  ".c.tl{left:0;top:0;background-image:url('" + url("corner-tl.png") + "');-webkit-mask-image:" + fade("right", "bottom") + ";mask-image:" + fade("right", "bottom") + ";}",
  ".c.tr{right:0;top:0;background-image:url('" + url("corner-tr.png") + "');-webkit-mask-image:" + fade("left", "bottom") + ";mask-image:" + fade("left", "bottom") + ";}",
  ".c.bl,.c.br{width:84px;height:84px;background-size:84px 84px;}",
  ".c.bl{left:0;bottom:0;background-image:url('" + url("corner-bl.png") + "');-webkit-mask-image:" + fade("right", "top") + ";mask-image:" + fade("right", "top") + ";}",
  ".c.br{right:0;bottom:0;background-image:url('" + url("corner-br.png") + "');-webkit-mask-image:" + fade("left", "top") + ";mask-image:" + fade("left", "top") + ";}",
  ".ctr{position:absolute;left:26px;right:26px;text-align:center;}",
  ".eyebrow{top:52px;font-family:var(--script);color:var(--wine);font-size:30px;line-height:1;}",
  ".title{top:86px;left:48px;right:48px;font-family:var(--display);font-weight:700;color:var(--green);font-size:31px;line-height:1.02;}",
  ".ruleA{top:150px;}",
  ".rule{display:flex;align-items:center;justify-content:center;gap:9px;}",
  ".rule i{height:1.2px;background:linear-gradient(90deg,transparent,var(--sage),transparent);flex:1;max-width:80px;}",
  ".rule b{color:var(--wine);font-size:10px;line-height:1;}",
  ".lead{top:166px;left:44px;right:44px;font-family:var(--display);font-style:italic;font-size:17px;line-height:1.3;color:var(--ink);}",
  ".steps{position:absolute;left:62px;right:44px;top:266px;list-style:none;counter-reset:s;}",
  ".steps li{counter-increment:s;display:flex;align-items:center;gap:12px;padding:4px 0;font-size:13px;font-weight:700;color:var(--green);}",
  ".steps li::before{content:'\\2766';flex:none;width:18px;color:var(--rose);font-size:15px;text-align:center;}",
  ".note{top:362px;left:56px;right:56px;font-size:11px;font-weight:700;color:var(--sage);line-height:1.4;}",
  ".price{top:418px;font-family:var(--display);font-weight:700;color:var(--wine);font-size:40px;line-height:1;}",
  ".price sup{font-size:21px;vertical-align:top;position:relative;top:5px;margin-right:1px;}",
  ".close{top:474px;left:84px;right:84px;font-family:var(--script);font-size:20px;color:var(--wine);line-height:1.1;}",
  ".ft{top:530px;left:92px;right:92px;font-family:var(--body);font-weight:800;letter-spacing:.05em;color:var(--green);text-transform:uppercase;font-size:8px;line-height:1.5;}",
].join("\n");

function card(c) {
  return '<div class="card">' +
    '<span class="c tl"></span><span class="c tr"></span><span class="c bl"></span><span class="c br"></span>' +
    '<div class="ctr eyebrow">' + c.eyebrow + "</div>" +
    '<div class="ctr title">' + c.title + "</div>" +
    '<div class="ctr ruleA"><span class="rule"><i></i><b>&#10084;</b><i></i></span></div>' +
    '<div class="ctr lead">' + c.lead + "</div>" +
    '<ol class="steps">' + c.steps.map((s) => "<li>" + s + "</li>").join("") + "</ol>" +
    '<div class="ctr note">' + c.note + "</div>" +
    '<div class="ctr price"><sup>$</sup>' + c.price + "</div>" +
    '<div class="ctr close">' + c.close + "</div>" +
    '<div class="ctr ft">@dragonink_and_thread<br>dragoninkandthread.com</div>' +
    "</div>";
}

const doc = (title, body) =>
  ['<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>' + title + "</title>",
    FONTS, "<style>" + css + "</style></head><body>", body, "</body></html>"].join("\n");

fs.writeFileSync(path.join(SIGN, "s-story-rose-latte.html"), doc("Rose Latte Cloud", card(CARDS[0])));
console.log("wrote s-story-rose-latte.html");
