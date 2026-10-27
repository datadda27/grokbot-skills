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
Exit codes: 0 ok, 2 usage or missing file, 3 bad data (invalid JSON, a private field, a schema error, or a missing template marker). Install `jsonschema` for full validation; without it gen.py still checks the private fields and required sections.

## What the Page shows
- Views: Dashboard, Family plan (printable), Wallet card. The view switcher is the first thing on every view.
- Titles use `household.name` ("The Smith household: family plan"); a blank name or sample data shows a neutral title.
- Readiness ring out of 100 (gray share is points waiting), a separate setup progress bar, tier ladder, what the next tier needs, and the top 3 gaps with points.
- Life safety first: smoke and CO alarms, phone alerts, NOAA radio, county signup, device backup.
- Alerts: calm line when quiet; a warning box only for an active PREPARE, and red only for an active ACT NOW warning.
- Days of supply ladder with a 3-day tick and the household target, plus the two-week calculator.
- This week's 15-minute task with its points ("+N points when done", from `task.itemIds` or `task.category` and `addsDays`), and shopping a little each week against the budget.
- Use it first: best-by timeline (estimated dates for undated packages are marked), meal ideas, and the pantry recall check.
- County hazards (FEMA NRI) and the seasonal strip; outage and water plans, with the "Use first in an outage" list (`outageUseFirst`: fridge about 4 hours, a full, closed freezer about 48 hours; not counted toward food days).
- Family cards with roles and checklists; the plan checklist. Kids with an `ageBand` show as their stored `pageLabel` plus the band ("Child A, 9 to 13") unless `showName` is true; gen.py replaces their names before embedding the data and never numbers them by list position.
- Headline Check history with verdict chips, source dates, and the full check (`full`) for each.
- Score history, Connections (with the phrase to say to add each), Delivery channels (when the data has a `channels` list), Modules, and Sources.

## Score
- Points: supplies 60 (water 12, food 10, medicines 10, sanitation 5, power 5, heat and cooling 5, light 4, first aid 4, comms 3, documents 2), life safety 25, plan 15.
- Days categories earn weight times days over target (capped at 1). While an inventory batch is in progress, `countedDays` holds the running count and the higher of `days` (the estimate) and `countedDays` is scored; the ladder shows "counted so far X of ~Y days". Checklist categories earn items done over items total.
- `done` earns full points, `open` earns 0, `unknown` earns 0 and shows as points waiting, `na` is removed from the total.
- Score = round(100 x earned / applicable). Applicable is fixed for the household, so answering or adding anything can only raise the score.
- Setup progress = answered points over applicable points, shown as its own bar.
- Gap points equal the stated weights (scaled only when something is n/a) and do not shift as other answers come in.
- Tiers: 72 hours (water, food, medicines, sanitation at 3 days or more, plus smoke, CO, alerts, and device backup done or not applicable); 2 weeks (those four at the target, other categories at least half); optional 1 month (30 days) and 3 months (90 days).

## Privacy
gen.py exits 3 if any key names medicines, doses, prescriptions, firearms, ammunition, cash, safe codes, PINs, passwords, SSNs, coordinates, street addresses, or emails. Expiring items marked `private` are dropped. Medicines appear only as a days count with "details private".

## Delivery channels
The optional `channels` list (`id`, `label`, `status` on, available, or later, `levels`, `note`) is free text by design. Adding a channel means editing the method's Delivery channels table on GitHub; this template and the schema do not change.
