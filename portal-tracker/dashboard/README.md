# Recruiting & Portal Dashboard (template)

A phone-first Page for one college football team's recruiting class, transfer portal, rankings, top reads, top posts on X, and (opt-in) message boards. The layout lives in the template; everything about the team lives in one data file.

## Files
- `dashboard.template.tsx`: the Page layout. No team names, links, or text. Do not edit it per team.
- `gen.py`: reads the data file, checks and normalizes it, and writes `dashboard.canvas.tsx`.
- `schema.json`: the data format. Missing values are `null` and show as UNKNOWN.
- `sample-data.json`: EXAMPLE DATA for a made-up team, the Example State Eagles. Every name, number, and link in it is fake.

## Build
```
python3 gen.py dashboard-data.json            # writes dashboard.canvas.tsx
python3 gen.py sample-data.json               # try it with the example data
```
Usage: `gen.py DATA.json [TEMPLATE.tsx] [OUT.tsx]`. The data file is required, or set `DASH_DATA` instead. `python3 gen.py --help` (or `-h`) prints usage and exits 0. A missing or bad argument prints the usage line and exits 2. Nothing is published by gen.py. Then publish `dashboard.canvas.tsx` as the bot's Page, overwriting the same Page each run.

## Data rules
- Every item has a source URL. Never estimate. Unknown values are `null`.
- Premium items set `premium: true` and `premiumSite` ("247", "On3/Rivals", "ESPN+", or the team site name). The badge reads "Premium · <site>".
- All team text (team name, short name, coach, page title and summary, captions, notes) is in the data file.
- Dates are ISO (YYYY-MM-DD). The ranking chart's range and axis come from the data.
- Each commit has `hsGames`: up to 5 high school games this season (date, opponent, line, sourceName, url). An empty list hides the "This season" section.
- Keep the data file under about 80 KB: at most 15 threads per board (set each board's `totalThreads` to the full count), 5 top reads, 5 X posts, 30 news items, 6 posts per poster.
- `forums` is a list with one entry per picked board, per site (several sites allowed), filled by the setup board builder. A single legacy `forum` object still works. With more than one board, the Board tab shows a picker. Boards are read only.
- `topReads` (Top reads tab, plus a teaser on Overview): up to 5 items, each with `headline`, `why` (one line on why it matters), `url`, and `site`. The tab shows a big link to the site so readers go there. Rank good news about commits and targets higher (`goodNews: true`). Premium items show the headline and "There's Premium news at <site>" only; gen.py drops `why` for them so no pick, odds, or details can leak.
- `topOnX` (Top on X tab): up to 5 posts from the last 24 hours, ranked by quotes plus replies, then reposts, with good news weighted up. `tag` is "confirmed source" (players, official accounts, trusted insiders) or "buzz, unconfirmed". Every post links to X. Grok Bot's free public X reads only.
- `digest` (optional): the digest mode (`auto`, `daily`, or `weekly`), the active modes, the schedule in plain words, and the next digest time. Shown as one line on Overview.
- `forums`, `following`, `topReads`, `topOnX`, and `digest` are optional. When they are null or empty, their tabs or lines are hidden.

## Look
The app's neutral theme only. No team colors, logos, mascots, or images. Tabs, filters, and badges wrap on a phone.

## Sharing
Premium summaries are for the owner's own use only. No screenshots, reposts, or sharing.

If any item is Premium, keep the Page private. To share, build a copy with Premium items and the Board and Following tabs removed.
