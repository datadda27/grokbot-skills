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
- Every number field (ranks, counts, ratings, poll spots, weight) and the commit `height` and `commitDate` accept `null`. The page shows UNKNOWN for null, never "null", "No. null" or NaN.
- 247Sports and ESPN pages often block automated reads. Their values stay `null` (UNKNOWN) unless the owner is logged in and the page was read. Never estimate them.
- Ratings are stored as each service publishes them: a commit's `ratings` list holds `{service, value, scale}` (plus optional stars, natl, pos, state, source), for example On3 `87.5` on `0-100` or 247Sports Composite `0.8801` on `0-1`. The older `r247` / `industry` / `composite247` / `espn` fields still work; gen.py fills each shape from the other.
- `flipWatch` items use `dir` "Defend" (our commit drawing flip interest) or "Target" (another school's commit we are pursuing).
- `teamStatus.conference` is generic: put the conference name from the source in `label`. Nothing about any conference is assumed. A legacy `teamStatus.big12` key is still accepted; gen.py moves it to `teamStatus.conference` and never invents a label (with no label the page says "Conference standing").
- `serviceNames` names the service behind each caption (`ratings`, `industry`, `commitDates`, `classRank`, `portalRating`, `portalValue`). Captions never hard-code a service; a missing name shows "Source: UNKNOWN" or the mention is left out. gen.py fills a missing name only where an older field name itself names the service and that field holds a value (for example `r247` values mean 247Sports). `commitDates` is never inferred.
- Polls (`ap`, `coaches`, `cfp`): each has `value`, `prev`, `date` (poll date, YYYY-MM-DD) and `source` (the poll page read, for example the AP poll page or NCAA.com rankings). A read poll that does not list the team stores `"NR"` (gen.py also accepts `"Unranked"`) and the page shows "Unranked"; `"NR"` needs a source, and gen.py turns a sourceless `"NR"` into null. A null `value` shows UNKNOWN and means no poll source could be read. The Overview and Team tabs show a Polls table with each poll's value, poll date and source link. `notReleased: true` (source required) means a source says the ranking is not out yet; only then does the page say "Not out yet".
- Transfers: `portal.incoming[].source` and `portal.outgoing[].source` are a URL or null. Null or missing shows "No source". gen.py uses the first of an older `sources` list when `source` is missing.
- Rank chart: a service's line is drawn only with 2 or more dated, ranked points in `rankHistory`; with no service at 2 or more the chart is hidden and the points stay listed as text.
- Ranks (`natl`, `pos`, `state`, ESPN `rank`, `natl247` / `pos247` / `state247`, poll `value` / `prev`) are a number, the string `"NR"` when the source lists the player or team as unranked (shows NR), or `null` when there is no source or value (shows UNKNOWN). gen.py also turns "unranked", "not ranked" and "N/R" into `"NR"`. The page never shows NA.
- Premium items set `premium: true` and `premiumSite` ("247", "On3/Rivals", "ESPN+", or the team site name). The badge reads "Premium · <site>".
- All team text (team name, short name, coach, page title and summary, captions, notes) is in the data file.
- Dates are ISO (YYYY-MM-DD). The ranking chart's range and axis come from the data.
- Each commit has `hsGames`: up to 5 high school games this season (date, opponent, line, sourceName, url). An empty list hides the "This season" section.
- Keep the data file under about 80 KB: at most 15 threads per board (set each board's `totalThreads` to the full count), 5 top reads, 5 X posts, 30 news items, 6 posts per poster.
- `forums` is a list with one entry per picked board, per site (several sites allowed), filled by the setup board builder. A single legacy `forum` object still works. With more than one board, the Board tab shows a picker. Boards are read only.
- `topReads` (Top reads tab, plus a teaser on Overview): up to 5 items, each with `headline`, `why` (one line on why it matters), `url`, and `site`. The tab shows a big link to the site so readers go there. Rank good news about commits and targets higher (`goodNews: true`). Premium items show the headline and "There's Premium news at <site>" only; gen.py drops `why` for them so no pick, odds, or details can leak.
- `topOnX` (Top on X tab): up to 5 posts from the last 24 hours, ranked by quotes plus replies, then reposts, with good news weighted up. `tag` is "confirmed source" (players, official accounts, trusted insiders) or "buzz, unconfirmed". When confirmed-source posts exist, at least 3 of the 5 are confirmed source (all of them if fewer than 3) and buzz fills the rest; gen.py enforces this and renumbers. Every post links to X. Grok Bot's free public X reads only.
- `digest` (optional): the digest mode (`auto`, `daily`, or `weekly`), the active modes, the schedule in plain words, and the next digest time. Shown as one line on Overview.
- `forums`, `following`, `topReads`, `topOnX`, and `digest` are optional. When they are null or empty, their tabs or lines are hidden.

## Look
The app's neutral theme only. No team colors, logos, mascots, or images. Tabs, filters, and badges wrap on a phone.

## Sharing
Premium summaries are for the owner's own use only. No screenshots, reposts, or sharing.

If any item is Premium, keep the Page private. To share, build a copy with Premium items and the Board and Following tabs removed.
