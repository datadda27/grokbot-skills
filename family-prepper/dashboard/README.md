# Prepper dashboard

The household's Page. The bot fills one data file; the template and gen.py never change per household.

## Files
- `dashboard.template.tsx`: the Page layout. It imports only from `grok/canvas` and holds no household text. Do not edit per household.
- `schema.json`: JSON Schema (draft-07) for `dashboard-data.json`.
- `gen.py`: validates the data, refuses private fields, computes the score, setup progress, tier, gaps, calculator, and expiry list, and writes the Page file.
- `sample-data.json`: a fake household (Anytown USA, ZIP 00000) for testing. It sets `_example`, so the Page shows neutral titles ("Family plan") instead of the sample name.

## Build
```
python3 gen.py dashboard-data.json                      # writes dashboard.canvas.tsx
python3 gen.py dashboard-data.json dashboard.template.tsx out.canvas.tsx
python3 gen.py --summary dashboard-data.json              # score, setup %, tier, top 3 gaps, task gain as JSON; no Page
```
python3 gen.py --family dashboard-data.json               # the basics-only Family plan Page: family.canvas.tsx (v1.2.5)
python3 test_family_page.py                                # checks the sample Family plan Page has no supplies, score, cash, medicines, firearms, or devices
```
Exit codes: 0 ok, 2 usage or missing file, 3 bad data (invalid JSON, a private field, a schema error, or a missing template marker). Install `jsonschema` for full validation; without it gen.py still checks the private fields and required sections.

## Family plan Page (Prepper v1.2.5)
A second Page, basics only, with one permanent public link for family: contacts, the out-of-area check-in, meeting places, the "We're OK" line, any away-from-home lines (`printPlan.awayFromHome`), the 5, 15, and 60 minute leave lines, shutoffs and alerts, who does what (names or child labels and roles only), and the wallet card. Built from `family-plan.template.tsx` with `gen.py --family`, which copies only an allowlist of plan fields. It never shows supplies, the score, cash, medicines, firearms, or device details. Rebuilt whenever a plan field changes; the owner turns on its public link once with the Page's share control.

## What the Page shows (dashboard v2, Prepper v1.2.3)
One Page with three views on a switch at the top. Titles use `household.name` ("The Smith household: family emergency plan"); a blank name or sample data shows a neutral title.

**Home**
- Readiness: the ring out of 100 with a gray arc for points waiting on a yes or no, a legend, "Up from N on date" (from `history`), and the tier pill (Getting started, or "72 hours reached", marked provisional while points are waiting).
- Next goal card: the tier track (72 hours, then 2 weeks), what each item still needs with +N points (`computed.nextTierRows`), and one line with the alert check times and setup progress.
- Alert boxes only when needed: red for an active ACT NOW, a warning for PREPARE, a note for emergency mode, and a warning when the recall check found a match.
- This week: the weekly task plus up to 2 quick free steps (`computed.weekSteps`, from `minutes` and `free` on life safety and plan items).
- At a glance: water, food, light and power, first aid, go-bags, and the plan (`computed.cards`), each with a big number, a meter (3-day tick on water and food), and a status pill: Biggest gap, On target, Almost there, Building, or Not counted yet. Go-bags (`goBags`) say Not scored and never change the score.
- Life safety: Done pills, +N on open items. The power-dependent medical device row is yes or no only.
- If the power goes out or we get separated: the eat-first list (`outageUseFirst`) with the fridge 4 hours and freezer 48 hours line, and Where we meet.

**Family plan** (made to print)
- Contacts and meeting places, If we have to leave (5, 15, 60 minutes), shutoffs and alerts, who does what (kids with an `ageBand` show as their `pageLabel` plus the band, "Child A, 9 to 13", unless `showName` is true), and the wallet card front and back with dashed cut lines.

**Details** (with a table of contents)
- All supplies: every category as a full-width meter; dashed means not counted yet. The optional 30-day stretch shows only here. The two-week calculator.
- Plan steps, Use it first (best-by table, meal ideas, and the monthly recall check: result, items checked, next check, sources, and each match with its official link), Your area (FEMA NRI hazards, FYI, seasonal), Outage and water, Shopping, Progress (when there are 2 or more scores), Headline checks and Connections (both collapsed), and Sources.

## Optional data (older data files still build)
- `lifeSafety[].minutes`, `planItems[].minutes`, and `free` (true when the step costs nothing): feed This week. A missing `free` counts as free except for the NOAA radio and alarms.
- `goBags`: `packed`, `needed`, `spot`, `note`. Never scored.
- `recalls.on` (missing means on, for older installs that had the daily check) and `recalls.nextCheck`. Each match can carry `source` (FDA, USDA FSIS, CPSC, NHTSA) and `kind` (food, first aid, gear, car seat). Medicine matches never go in this file.

## Score
- Points: supplies 60 (water 12, food 10, medicines 10, sanitation 5, power 5, heat and cooling 5, light 4, first aid 4, comms 3, documents 2), life safety 25, plan 15.
- Days categories earn weight times days over target (capped at 1). While an inventory batch is in progress, `countedDays` holds the running count and the higher of `days` (the estimate) and `countedDays` is scored; the ladder shows "counted so far X of ~Y days". Checklist categories earn items done over items total.
- `done` earns full points, `open` earns 0, `unknown` earns 0 and shows as points waiting, `na` is removed from the total.
- Score = round(100 x earned / applicable). Applicable is fixed for the household, so answering or adding anything can only raise the score.
- Setup progress = answered points over applicable points, shown as its own bar.
- Gap points equal the stated weights (scaled only when something is n/a) and do not shift as other answers come in.
- Tiers: 72 hours (water, food, medicines, sanitation at 3 days or more, plus smoke, CO, alerts, and device backup done or not applicable); 2 weeks (those four at the target, other categories at least half). Two weeks is the top tier. The optional 30-day stretch (`targets.optionalTiers: ["30d"]`, set only when the owner asks) prints as a separate line with no score or tier change. There is no 90-day tier.

## Privacy
gen.py exits 3 if any key names medicines, doses, prescriptions, firearms, ammunition, cash, safe codes, PINs, passwords, SSNs, coordinates, street addresses, or emails. Expiring items marked `private` are dropped. Medicines appear only as a days count with "details private".

## Delivery channels
The optional `channels` list (`id`, `label`, `status` on, available, or later, `levels`, `note`) is free text by design. Adding a channel means editing the method's Delivery channels table on GitHub; this template and the schema do not change.
