# Weekly numbers

**Ten minutes every Monday.** Four numbers, tracked over time. Four weeks of the same four
numbers beats fifty numbers once — at ~22 visits a day there isn't enough data for a dashboard
to find anything, so this exists to show a **trend**, not to produce insights.

## The table

| Week (Mon) | Visits | FB share | Pin clicks | Sessions | Paid | Shop $ | Notes |
|---|---|---|---|---|---|---|---|
| 2026-07-13 | — | — | — | **8** | **1** | **$10.10** | Cart + Worker went live Jul 29… this week is pre-cart testing |
| 2026-07-27 | — | — | — | **17** | **2** | **$75.34** | Build-day cluster; most of these 17 are the owner's own testing |
| 2026-08-03 | **152** | **44%** | — | **9** | **2** | **$43.99** | First real measurement. IG + TikTok sent **zero** |
| 2026-08-10 | | | | **0** | **0** | **$0** | Two FB posts Mon 10; catalog live Aug 9; **no baskets** |

**Bold = pulled automatically. Blank = needs typing in.**

## What's automatic and what isn't

| Number | Source | Automatic? |
|---|---|---|
| Sessions / Paid / Shop $ | Stripe | ✅ **Yes** — Stripe connector, ask me any time |
| Custom order revenue | Stripe invoices | ✅ **Yes** — separate from the cart, so it never shows in shop numbers |
| Visits + FB share | Cloudflare Web Analytics | ⚙️ **Automatable** — needs a read-only API token (see below) |
| Pinterest outbound clicks | Pinterest Analytics | ❌ **No** — needs a registered app and OAuth; not worth it at this scale |
| Facebook reach | Meta Business Suite | ❌ **No** — same reason |

**So the ask is two numbers a week**, both read off a screen:

- **Cloudflare → Referer tab**: total visits, and the two facebook.com rows added together
- **Pinterest → Analytics**: **outbound clicks** (not impressions, not saves — clicks are the
  only one that means someone arrived)

Tell me those two and I'll fill the row, pull the Stripe side myself, and commit it.

## Making Cloudflare automatic, if you want it

Cloudflare has a GraphQL analytics API. It needs a token you create — **Dashboard → My Profile →
API Tokens → Create Token**, with **Account Analytics: Read** and nothing else. Store it as an
environment variable (`CF_ANALYTICS_TOKEN`), never in the repo, and I'll write the script that
reads it. Same pattern as the Worker's Stripe key: the secret lives outside the code and I never
see its value.

Worth doing only if typing one number a week starts to feel like a chore.

## ⚠️ The number that isn't in this table

**Custom-order revenue doesn't appear in any shop metric.** Those go out as Stripe *invoices*,
not cart checkouts. Recent custom: Maurya $97.43, Aubrea $36, Linda $113.67 — **~$247**, against
**$129.43** through the cart in its entire life.

**Custom is roughly twice the shop, and it is invisible in every dashboard above.** Watch that
this table doesn't quietly train attention onto the smaller half of the business.

## What "better" looks like

Don't chase visits for their own sake. In rough order of what matters:

1. **Paid** — did anyone buy
2. **Sessions** — did anyone try
3. **Pin clicks** — is Pinterest starting to work (won't be readable before September)
4. **Visits** — the top of the funnel, and the least meaningful on its own

A week with 200 visits and no sessions is worse than a week with 80 and two.
