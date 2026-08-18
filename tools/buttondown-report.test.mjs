#!/usr/bin/env node
/* Tests for tools/buttondown-report.js —  node tools/buttondown-report.test.mjs
 *
 * WHY THIS EXISTS
 * The report is the only thing that reads the Buttondown list back, and its
 * SUCCESS path has never run against the real API — the one real call we've made
 * returned 401 on a placeholder key, which proved the host/URL/auth header and
 * nothing else. So the shape of a good response is exercised here, against a
 * stubbed `fetch`, and these stubs are the only guard on it.
 *
 * It also pins the three things that have actually gone wrong on the shop
 * machine, all of which are Windows-specific and none of which show up as a
 * failed assertion anywhere else:
 *   - process.exit() from the async flow → libuv assertion crash (see die()).
 *   - a `VAR=value cmd` example → "not recognized as an internal or external
 *     command", which reads like a broken script when it never ran at all.
 *   - a <bracketed> placeholder in a cmd example → cmd treats < > as
 *     redirection, sets nothing, and the OLD key stays in place to fail
 *     confusingly on the next run.
 *
 * Each case runs in its OWN child process: the report is a top-level script, so
 * importing it twice in one process would just hit the module cache. The file is
 * both runner and case — BD_TEST_CASE picks which.
 *
 * No dependencies, no network, no key. The site has none and this keeps it that way.
 */

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const SELF = fileURLToPath(import.meta.url);
const REPORT = new URL("./buttondown-report.js", import.meta.url).href;

/* ------------------------------------------------------------------ fixtures */

const day = 864e5;
const now = Date.now();
const mk = (email, tags, type = "regular", ago = 40) => ({
  email,
  tags,
  subscriber_type: type,
  creation_date: new Date(now - ago * day).toISOString(),
});

/* Deliberately mixed: two pages (pagination), an object-shaped tag, a tag this
   repo never sets, an untagged import, and an unsubscribed record that must not
   be counted as active. */
const PAGE1 = [
  mk("a@x.com", ["hero"], "regular", 2),
  mk("b@x.com", ["hero"], "regular", 5),
  mk("c@x.com", ["checkout"], "regular", 20),
  mk("d@x.com", ["purchased"], "regular", 60),
  mk("e@x.com", ["waitlist"], "regular", 3),
];
const PAGE2 = [
  mk("f@x.com", ["waitlist"], "regular", 1),
  mk("g@x.com", [], "regular", 200),
  mk("h@x.com", [{ name: "newsletter-legacy" }], "regular", 300),
  mk("i@x.com", ["hero"], "unsubscribed", 10),
];

/* Two pages of results, handed out in order, `next` absolute like the real API. */
function stubPages(pages) {
  let call = 0;
  globalThis.fetch = async () => {
    const results = pages[call];
    const next = call < pages.length - 1
      ? "https://api.buttondown.com/v1/subscribers?page=" + (call + 2)
      : null;
    call++;
    return { ok: true, status: 200, json: async () => ({ count: 9, next, results }) };
  };
}

/* ---------------------------------------------------------------- the cases */

const CASES = {
  /* The happy path, with somebody on the waitlist. */
  full() {
    stubPages([PAGE1, PAGE2]);
    process.env.BUTTONDOWN_API_KEY = "test-key";
  },

  /* Same, minus both waitlist subscribers — the branch that runs today, since
     nothing has been sold out for js/waitlist.js to appear on. */
  "empty-waitlist"() {
    stubPages([
      PAGE1.filter((s) => !s.tags.includes("waitlist")),
      PAGE2.filter((s) => !s.tags.includes("waitlist")),
    ]);
    process.env.BUTTONDOWN_API_KEY = "test-key";
  },

  json() {
    stubPages([PAGE1, PAGE2]);
    process.env.BUTTONDOWN_API_KEY = "test-key";
    process.argv.push("--json");
  },

  /* Buttondown reachable, key refused. Must NOT be reported as unreachable. */
  unauthorized() {
    globalThis.fetch = async () => ({ ok: false, status: 401, json: async () => ({}) });
    process.env.BUTTONDOWN_API_KEY = "your_actual_key";
  },

  /* First host dies at the socket, second answers — the migration fallback. */
  "host-fallback"() {
    let first = true;
    globalThis.fetch = async () => {
      if (first) { first = false; throw new Error("getaddrinfo ENOTFOUND"); }
      return { ok: true, status: 200, json: async () => ({ next: null, results: PAGE1 }) };
    };
    process.env.BUTTONDOWN_API_KEY = "test-key";
  },

  /* Nothing answers at all. */
  unreachable() {
    globalThis.fetch = async () => { throw new Error("getaddrinfo ENOTFOUND"); };
    process.env.BUTTONDOWN_API_KEY = "test-key";
  },

  /* No key in the environment — the first thing that happens on the shop
     machine, and where the cmd.exe instructions have to be right. */
  nokey() {
    delete process.env.BUTTONDOWN_API_KEY;
    globalThis.fetch = async () => { throw new Error("should never be called"); };
  },
};

/* --------------------------------------------------------------- child mode */

if (process.env.BD_TEST_CASE) {
  const setup = CASES[process.env.BD_TEST_CASE];
  if (!setup) { console.error("unknown case"); process.exit(2); }
  setup();
  await import(REPORT);
} else {
  /* ------------------------------------------------------------ runner mode */

  const run = (name) => {
    const env = { ...process.env, BD_TEST_CASE: name };
    delete env.BUTTONDOWN_API_KEY;          // never let a real key leak into a test
    const r = spawnSync(process.execPath, [SELF], { env, encoding: "utf8" });
    return { out: r.stdout || "", err: r.stderr || "", code: r.status };
  };

  let failures = 0;
  const check = (label, ok, detail) => {
    if (ok) { console.log("  ok    " + label); return; }
    failures++;
    console.log("  FAIL  " + label + (detail ? "\n        " + detail : ""));
  };
  const has = (hay, needle) => hay.includes(needle);

  console.log("\nbuttondown-report.js\n");

  /* ---- full ---- */
  {
    const { out, err, code } = run("full");
    console.log("full report");
    check("exits 0", code === 0, "exit " + code);
    check("no stderr", err === "", err.trim());
    check("counts the 8 active, not the 9 records", has(out, "Active subscribers   8"));
    check("says why the 9th is missing", has(out, "records total       9"));
    check("free tier is 8/100", has(out, "8/100"));
    check("new in 7 days = 4", /New in 7 days\s+4\b/.test(out));   // a2 b5 e3 f1
    check("new in 30 days = 5", /New in 30 days\s+5\b/.test(out));
    check("hero = 2 (unsubscribed one excluded)", /\bhero\s+2\b/.test(out));
    check("checkout = 1", /\bcheckout\s+1\b/.test(out));
    check("purchased = 1", /\bpurchased\s+1\b/.test(out));
    check("waitlist = 2", /\bwaitlist\s+2\b/.test(out));
    check("object-shaped tag is read", has(out, "newsletter-legacy"));
    check("unplanned tag is flagged", has(out, "newsletter-legacy *"));
    check("untagged = 1", /\(untagged\)\s+1\b/.test(out));
    check("both waitlist emails listed", has(out, "e@x.com") && has(out, "f@x.com"));
    check("waitlist emails carry a join date", /e@x\.com\s+\(joined \d{4}-\d\d-\d\d\)/.test(out));
    check("unsubscribed address never printed", !has(out, "i@x.com"));
    console.log("");
  }

  /* ---- empty waitlist ---- */
  {
    const { out, code } = run("empty-waitlist");
    console.log("empty waitlist");
    check("exits 0", code === 0, "exit " + code);
    check("says nobody yet", has(out, "Waitlist             nobody yet."));
    check("explains it measures exposure, not breakage", has(out, "measure of exposure"));
    check("no stray bullet list", !has(out, "•"));
    console.log("");
  }

  /* ---- --json ---- */
  {
    const { out, code } = run("json");
    console.log("--json");
    check("exits 0", code === 0, "exit " + code);
    let j = null;
    try { j = JSON.parse(out); } catch (e) { /* reported below */ }
    check("stdout is valid JSON on its own", j !== null, out.slice(0, 120));
    if (j) {
      check("total 9 / active 8", j.total === 9 && j.active === 8);
      check("freeTier 100", j.freeTier === 100);
      check("new7 4 / new30 5", j.new7 === 4 && j.new30 === 5);
      check("tags counted", j.tags.hero === 2 && j.tags.waitlist === 2 && j.tags["newsletter-legacy"] === 1);
      check("untagged 1", j.untagged === 1);
      check("waitlist carries emails", j.waitlist.length === 2 && j.waitlist[0].email === "e@x.com");
    }
    console.log("");
  }

  /* ---- 401 ---- */
  {
    const { out, err, code } = run("unauthorized");
    console.log("bad key (401)");
    check("exits 1", code === 1, "exit " + code);
    check("says the key was rejected", has(err, "Buttondown rejected the key"));
    check("says the network was FINE", has(err, "network and the URL are fine"));
    check("is not mistaken for unreachable", !has(err, "Couldn't reach"));
    check("prints no report", !has(out, "Active subscribers"));
    check("no libuv assertion / stack trace", !has(err, "Assertion failed") && !has(err, "at async"));
    // The cmd.exe rules, both learned from a real failed run on the shop machine.
    check("cmd form, not the bash-ism", has(err, "set BUTTONDOWN_API_KEY="));
    check("no <angle brackets> in the cmd example", !/set BUTTONDOWN_API_KEY=.*[<>]/.test(err));
    console.log("");
  }

  /* ---- host fallback ---- */
  {
    const { out, code } = run("host-fallback");
    console.log("host fallback (.com dead, .email answers)");
    check("exits 0", code === 0, "exit " + code);
    check("still reports", has(out, "Active subscribers   5"));
    console.log("");
  }

  /* ---- unreachable ---- */
  {
    const { err, code } = run("unreachable");
    console.log("no host answers");
    check("exits 1", code === 1, "exit " + code);
    check("says unreachable", has(err, "Couldn't reach Buttondown"));
    check("names both hosts tried", has(err, "api.buttondown.com") && has(err, "api.buttondown.email"));
    check("no libuv assertion / stack trace", !has(err, "Assertion failed") && !has(err, "at async"));
    console.log("");
  }

  /* ---- no key ---- */
  {
    const { err, code } = run("nokey");
    console.log("no BUTTONDOWN_API_KEY");
    check("exits 1", code === 1, "exit " + code);
    check("says so plainly", has(err, "No BUTTONDOWN_API_KEY set"));
    check("leads with the cmd form", err.indexOf("set BUTTONDOWN_API_KEY=") < err.indexOf("$env:"));
    check("no <angle brackets> in the cmd example", !/set BUTTONDOWN_API_KEY=.*[<>]/.test(err));
    check("covers PowerShell too", has(err, "$env:BUTTONDOWN_API_KEY="));
    check("says where the key lives", has(err, "Settings → Programming → API key"));
    check("no libuv assertion / stack trace", !has(err, "Assertion failed") && !has(err, "at async"));
    console.log("");
  }

  console.log(failures === 0 ? "All checks passed.\n" : `${failures} check(s) FAILED.\n`);
  process.exitCode = failures === 0 ? 0 : 1;
}
