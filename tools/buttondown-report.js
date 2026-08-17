#!/usr/bin/env node
/* Buttondown report — subscriber counts, tag breakdown, and growth.
 *
 *   BUTTONDOWN_API_KEY=xxxx node tools/buttondown-report.js
 *   BUTTONDOWN_API_KEY=xxxx node tools/buttondown-report.js --json
 *
 * WHY THIS EXISTS
 * The list is the one asset the shop owns outright — Web3Forms was only ever a
 * relay and Stripe only knows people who already bought. Everything the site
 * does with Buttondown is WRITE-ONLY (both signup forms and the sold-out
 * waitlist just POST), so nothing here could read back what any of it produced.
 * The tags were being collected and never once looked at.
 *
 * WHAT IT ANSWERS
 *   - How many subscribers, against the 100 free-tier ceiling (then ~$9/mo).
 *   - The tag split: `hero` / `checkout` / `purchased` / `waitlist`, which is
 *     the only way to tell a browser apart from a buyer.
 *   - ⚠️ WHO IS ON THE WAITLIST, by email. js/waitlist.js only runs on a
 *     sold-out card, so a name here is someone who asked to be told when a
 *     specific piece comes back. That is a person to message, and it is the
 *     single most actionable thing the list contains.
 *
 * ⚠️ NO KEY IS STORED HERE. It comes from the environment, same principle as
 * the Worker's Stripe secret. Never paste it into this file or into TASKS.md.
 * Get one at buttondown.com → Settings → Programming → API key.
 *
 * ✅ THE HTTP PATH IS PROVEN (2026-08-18): a first real run reached Buttondown
 * and came back 401 on a placeholder key — which means the host, the URL and the
 * auth header are all right. What is still unproven is the SHAPE of a successful
 * response; that is exercised against stubs only. It is deliberately lenient —
 * Buttondown has moved host (buttondown.email → buttondown.com) and renamed
 * subscriber fields across versions, so both spellings are accepted.
 *
 * ⚠️ WINDOWS: never call process.exit() from the async flow here. See die().
 *
 * No dependencies — the site has none and this keeps it that way.
 */

const KEY = process.env.BUTTONDOWN_API_KEY;
const AS_JSON = process.argv.includes("--json");

/* Both hosts are tried in order. The .email one is the long-standing endpoint;
   .com is the newer one. Whichever answers first wins, so this keeps working
   whichever side of the migration the account is on. */
const HOSTS = ["https://api.buttondown.com/v1", "https://api.buttondown.email/v1"];

const FREE_TIER = 100;              // subscribers included before it starts costing
const KNOWN_TAGS = ["hero", "checkout", "purchased", "waitlist"];

/* A subscriber only counts toward billing (and toward "how big is the list
   really") if they are actually subscribed. Buttondown also carries
   unactivated, unsubscribed and spam-flagged records. */
const ACTIVE = new Set(["regular", "premium", "gifted"]);

/* Exiting: set process.exitCode and unwind, NEVER process.exit().
   Calling process.exit() from inside the async flow kills the process while
   libuv still has handles closing, and on Windows that trips
   "Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), src\\win\\async.c" —
   an ugly crash stapled to an otherwise clean error message. Setting the code
   and letting Node drain exits with the same status and no noise. */
class Bail extends Error {}
function die(msg, code = 1) {
  console.error("\n  " + msg + "\n");
  process.exitCode = code;
  throw new Bail();
}

/* Tags have been both bare strings and {name} objects across API versions. */
function tagsOf(sub) {
  const raw = sub.tags || sub.subscriber_tags || [];
  return (Array.isArray(raw) ? raw : []).map((t) =>
    typeof t === "string" ? t : (t && (t.name || t.tag)) || ""
  ).filter(Boolean);
}

function typeOf(sub) {
  return String(sub.subscriber_type || sub.type || "regular").toLowerCase();
}

function dateOf(sub) {
  const d = sub.creation_date || sub.created || sub.created_at;
  const t = d ? Date.parse(d) : NaN;
  return Number.isNaN(t) ? null : new Date(t);
}

async function fetchAll(base) {
  const out = [];
  let url = `${base}/subscribers`;
  let guard = 0;
  while (url && guard++ < 200) {
    const res = await fetch(url, {
      headers: { Authorization: `Token ${KEY}`, Accept: "application/json" },
    });
    if (res.status === 401 || res.status === 403) {
      die(`Buttondown rejected the key (HTTP ${res.status}).\n\n` +
          `  The call reached Buttondown, so the network and the URL are fine —\n` +
          `  it just didn't like the key.\n\n` +
          `  See what is actually set:   echo %BUTTONDOWN_API_KEY%\n\n` +
          `  Then paste the key with NOTHING around it — no angle brackets, no\n` +
          `  quotes, no spaces either side of the = :\n` +
          `    set BUTTONDOWN_API_KEY=paste_the_key_here\n\n` +
          `  (cmd reads < and > as redirection, so a bracketed placeholder fails\n` +
          `   with "The syntax of the command is incorrect" and sets nothing.)\n\n` +
          `  The key is at buttondown.com → Settings → Programming → API key.`);
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
    const body = await res.json();
    const page = body.results || body.data || (Array.isArray(body) ? body : []);
    out.push(...page);
    url = body.next || null;   // absolute URL, or null on the last page
  }
  return out;
}

function pct(n, of) { return of ? Math.round((n / of) * 100) : 0; }
function bar(n, of, width = 24) {
  const filled = of ? Math.round((n / of) * width) : 0;
  return "█".repeat(filled) + "·".repeat(Math.max(0, width - filled));
}

(async () => {
  if (!KEY) {
    /* The shop machine is Windows, so lead with cmd.exe — `VAR=value cmd` is a
       bash-ism and fails there with "not recognized as an internal or external
       command", which looks like the script is broken when it never ran. */
    die("No BUTTONDOWN_API_KEY set.\n\n" +
        "  Windows (cmd) — no quotes, no spaces around the = :\n" +
        "    set BUTTONDOWN_API_KEY=paste_the_key_here\n" +
        "    node tools/buttondown-report.js\n\n" +
        "  PowerShell:\n" +
        "    $env:BUTTONDOWN_API_KEY=\"your_key\"\n" +
        "    node tools/buttondown-report.js\n\n" +
        "  macOS / Linux:\n" +
        "    BUTTONDOWN_API_KEY=your_key node tools/buttondown-report.js\n\n" +
        "  The key is at buttondown.com → Settings → Programming → API key.\n" +
        "  Set this way it never gets written to disk or into the repo.");
  }

  let subs = null, lastErr = null;
  for (const base of HOSTS) {
    try { subs = await fetchAll(base); break; }
    catch (e) {
      /* A rejected key is a real answer from a reachable server — let it through
         rather than swallowing it and trying the other host, which would report
         "couldn't reach Buttondown" for what is actually a bad key. */
      if (e instanceof Bail) throw e;
      lastErr = e;
    }
  }
  if (!subs) {
    die(`Couldn't reach Buttondown.\n  Last error: ${lastErr && lastErr.message}\n` +
        `  Tried: ${HOSTS.join(", ")}`);
  }

  const active = subs.filter((s) => ACTIVE.has(typeOf(s)));
  const now = Date.now();
  const since = (days) =>
    active.filter((s) => { const d = dateOf(s); return d && now - d.getTime() <= days * 864e5; }).length;

  // Tag counts, including tags nobody planned for.
  const tagCounts = {};
  for (const s of active) for (const t of tagsOf(s)) tagCounts[t] = (tagCounts[t] || 0) + 1;
  const untagged = active.filter((s) => tagsOf(s).length === 0).length;
  const waitlist = active.filter((s) => tagsOf(s).includes("waitlist"));

  if (AS_JSON) {
    console.log(JSON.stringify({
      total: subs.length, active: active.length, freeTier: FREE_TIER,
      new7: since(7), new30: since(30),
      tags: tagCounts, untagged,
      waitlist: waitlist.map((s) => ({ email: s.email, date: dateOf(s) })),
    }, null, 2));
    return;
  }

  const L = (s = "") => console.log("  " + s);
  console.log("");
  L("Buttondown — Dragon Ink and Thread");
  L("─".repeat(52));
  L(`Active subscribers   ${active.length}`);
  if (subs.length !== active.length) {
    L(`(records total       ${subs.length} — the rest are unactivated, unsubscribed or spam)`);
  }
  L(`Free tier            ${bar(active.length, FREE_TIER)}  ${active.length}/${FREE_TIER}  (${pct(active.length, FREE_TIER)}%)`);
  if (active.length >= FREE_TIER) {
    L("⚠  OVER the free tier — Buttondown starts charging (~$9/mo).");
  } else {
    L(`   ${FREE_TIER - active.length} more before it costs anything.`);
  }
  L("");
  L(`New in 7 days        ${since(7)}`);
  L(`New in 30 days       ${since(30)}`);
  L("");
  L("Where they came from");
  /* Build every row first, then size the label column to the longest one. A
     fixed width breaks the moment somebody adds a tag longer than the guess. */
  const extra = Object.keys(tagCounts).filter((t) => !KNOWN_TAGS.includes(t)).sort();
  const rows = [
    ...KNOWN_TAGS.map((t) => [t, tagCounts[t] || 0, ""]),
    ...extra.map((t) => [t, tagCounts[t], " *"]),
    ["(untagged)", untagged, "", "— pre-dates tagging, or imported"],
  ];
  const w = Math.max(...rows.map(([label, , mark]) => (label + mark).length));
  for (const [label, n, mark, note] of rows) {
    L(`  ${(label + mark).padEnd(w)}  ${String(n).padStart(4)}${note ? "  " + note : ""}`);
  }
  if (extra.length) L("  * not a tag this repo sets — check it's meant to be there");
  L("");

  if (waitlist.length) {
    L("⚠  WAITLIST — these people asked to be told when a sold-out piece returns.");
    L("   Each one is a message worth sending; they are the warmest names on the list.");
    for (const s of waitlist) {
      const d = dateOf(s);
      L(`   • ${s.email}${d ? "   (joined " + d.toISOString().slice(0, 10) + ")" : ""}`);
    }
    L("");
    L("   NOTE: the tag is not per-item — acting on a specific piece needs Buttondown's");
    L("   segmentation add-on. Cross-check the date against what was sold out then.");
  } else {
    L("Waitlist             nobody yet.");
    L("  js/waitlist.js only appears on a sold-out card, and the shop has had almost");
    L("  nothing sold-out to show it on — so this is a measure of exposure, not of");
    L("  whether the feature works.");
  }
  console.log("");
})().catch((e) => {
  if (e instanceof Bail) return;          // already reported, exit code already set
  console.error("\n  Unexpected failure: " + ((e && e.stack) || e) + "\n");
  process.exitCode = 1;
});
