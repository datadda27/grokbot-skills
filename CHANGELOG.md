# Changelog

## Prepper v1.2.5 (2026-10-29)

- A basics-only Family plan Page with one permanent public link for family (no supplies, score, cash, medicines, firearms, or device details); kids away from home and a "We're OK" check-in line; opt-in radio and vehicle add-ons; a firearms go-bag line in the opt-in safety module. Never scored.

## Prepper v1.2.4 (2026-10-29)

- Flexible weekly day, time, and pace (skip this week, remind me tomorrow, next step); optional offline backup task with an opt-in weekly offline refresh; "Everyone texts" renamed to "Out-of-area check-in" with its reason and the trailing comma fixed; supplies count only once bought, plus a `list` command for a pasteable shopping list.

## Portal Tracker v2.1.4 (2026-10-29)

- Nothing new, no digest: a scheduled digest run with nothing new since the last digest sends nothing and only updates the dashboard's checked time. New heartbeat on / heartbeat off commands (heartbeat sends a one-line "checked, nothing new" note; off is the default). Answers the owner is waiting on are never skipped. Idea from The Page bot, written in our own words.

## Portal Tracker v2.1.3 (2026-10-29)

- Board threads are picked and read automatically (top 3 to 5 per board, 8 max per run). No more "which threads would you read" cards. New pick threads / auto threads commands; asking only after pick threads.

## Portal Tracker v2.1.2 (2026-10-26)

- Data-driven source captions (serviceNames), rank chart hidden under 2 points, CFP shows UNKNOWN unless a sourced 'not released', removed 'Big 12' fallback label, per-transfer source column, getting-started reads device time zone and sets default alert/late times, new Polls check showing 'Unranked' when the team isn't in the AP/Coaches poll (UNKNOWN only when no poll could be read).

## 2026-10-23

- Repo created.

## 2026-10-23
- ticket-watch: full method added.
- portal-tracker: full method added.

## 2026-10-26
- portal-tracker v2. Updated 2026-27 NCAA dates (single Jan 4 to 13 portal window, Dec 2 to 4 early signing), Rivals/On3/247/ESPN services, multi-site premium logins (opt-in with terms warning), feedback command, version command, Team tab, high school game stats, and a shared dashboard template in portal-tracker/dashboard/.

## 2026-10-26
- portal-tracker v2.1. Calendar-based digest timing (auto, daily, weekly; team-specific season through bowl/CFP; portal window and signing day surges), Top on X and Top reads today sections, premium sharing rule, board builder in setup, new dashboard tabs and gen.py --help.

## 2026-10-26
- portal-tracker v2.1.1. Dashboard accepts unknown (null) numbers and shows UNKNOWN, NR for unranked, Defend / Target wording, a generic conference standing (legacy big12 mapped), ratings stored per service with their scale, at least 3 confirmed sources in Top on X, and a note that 247 and ESPN values stay UNKNOWN without a login.
