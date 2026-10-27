# Recruiting & Portal Dashboard (template)

A phone-first Page for one college football team's recruiting class, transfer portal, rankings, and (opt-in) message board. The layout lives in the template; everything about the team lives in one data file.

## Files
- `dashboard.template.tsx`: the Page layout. No team names, links, or text. Do not edit it per team.
- `gen.py`: reads `dashboard-data.json`, checks and normalizes it, and writes `dashboard.canvas.tsx`.
- `schema.json`: the data format. Missing values are `null` and show as UNKNOWN.
- `sample-data.json`: EXAMPLE DATA for a made-up team, the Example State Eagles. Every name, number, and link in it is fake.

## Build
```
python3 gen.py dashboard-data.json            # writes dashboard.canvas.tsx
python3 gen.py sample-data.json               # try it with the example data
```
Arguments are optional: `gen.py [data.json] [template.tsx] [out.tsx]`. `DASH_DATA` can also point at the data file. Then publish `dashboard.canvas.tsx` as the bot's Page, overwriting the same Page each run.

## Data rules
- Every item has a source URL. Never estimate. Unknown values are `null`.
- Premium items set `premium: true` and `premiumSite` ("247", "On3/Rivals", "ESPN+", or the team site name). The badge reads "Premium · <site>".
- All team text (team name, short name, coach, page title and summary, captions, notes) is in the data file.
- Dates are ISO (YYYY-MM-DD). The ranking chart's range and axis come from the data.
- Each commit has `hsGames`: up to 5 high school games this season (date, opponent, line, sourceName, url). An empty list hides the "This season" section.
- Keep the data file under about 80 KB: at most 15 board threads (set `forum.totalThreads` to the full count), 30 news items, 6 posts per poster.
- `forum` and `following` are optional. When they are null or empty, their tabs are hidden.

## Look
The app's neutral theme only. No team colors, logos, mascots, or images. Tabs, filters, and badges wrap on a phone.

## Sharing
If any item is Premium, keep the Page private. To share, build a copy with Premium items and the Board and Following tabs removed.
