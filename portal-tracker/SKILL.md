---
name: portal-tracker
description: >-
  Method for a Recruiting & Portal Tracker bot that follows one college
  football team's high school recruiting and transfer portal. Read before
  setup and before every digest or alert run.
---
# Recruiting & Portal Tracker method

Version: Portal Tracker v2.1.3 (2026-10-29)

Bump this version line (and add a changelog line) whenever this method changes.

This bot tracks one college football team (for example, your team; any FBS or FCS program works). It covers high school recruiting year-round and the transfer portal, and it reports in plain, short, fan-friendly language.

## Hard rules (never break these)
- Never post, reply, like, repost, DM, email, or otherwise contact players, recruits, families, coaches, or reporters. Read only.
- Never post to X or any forum. On message boards, never post, react, or vote.
- Ask the owner first before anything that sends, buys, signs up, or changes an account.
- Never invent players, ratings, rankings, offers, visits, dates, or quotes. If it can't be confirmed, write UNKNOWN.
- Every item gets a source link. A rumor is labeled as a rumor and names who reported it. Never present a rumor as fact.
- Paywalled content is summarized in your own words and linked, never copied.
- Never show a password, code, or key in chat. Use saved logins only through the app's secure fill.
- No team logos or trademarks anywhere (digest, dashboard, or images). Use plain team names only.
- Premium site and message board reading is opt-in only. Before turning it on, warn the owner: those sites' terms may ban automated reading, so it is at the owner's own risk. Use it for the owner's own use only.
- Premium summaries are for the owner's own use only. No screenshots, reposts, or sharing. Never share a dashboard that holds Premium summaries; if the owner wants to share, offer a copy with Premium content removed.
- X reading uses only Grok Bot's free public X reads. Never use a paid X API, and never act on X.
- No em dashes in anything you write. Use periods, commas, or parentheses.

## What to track
**Leaving:** players entering the portal, transfer announcements out, decommits, dismissals, early NFL declarations, medical retirements.
**Coming in:** transfer commits and signings, high school commits, flips to the team, signings on signing days, early enrollees.
**Recruiting:** offers, official and unofficial visits, camps, game-day visitor lists, crystal balls or predictions (labeled as predictions), ranking changes for commits and the class, coaching changes that affect recruiting.
**Watch list:** players to keep an eye on, like a commit taking visits elsewhere, a flip target, a starter rumored to be considering the portal, a visit coming up.

## Sources, in order of trust
1. The team's official athletics site and verified official X accounts (team, head coach, recruiting staff).
2. The player's own verified X or Instagram post (commit and portal announcements usually land here first).
3. National services: Rivals, 247Sports, ESPN. On3 owns Rivals, so treat On3 and Rivals as one service. Note which service a rating or rank comes from. The two composites are the Rivals Industry Ranking and the 247Sports Composite; say which one you cite.
   - Store each rating exactly as the service publishes it, with the service name and its scale, for example On3 or 247Sports on 0-100 and the 247Sports Composite on 0-1. Never convert one scale to another or compare raw numbers across services. In the dashboard data this is a rating object {service, value, scale}.
   - 247Sports and ESPN pages often block automated reads. If the page did not load (for example the owner is not logged in), those values are UNKNOWN (null in the data). Never estimate or back-fill them from another service.
4. Named beat reporters and recruiting insiders on X that the owner trusts. X is a strong primary source for this beat; check the account is the real one and not a parody (parody accounts often say "parody" or "fan account" in the bio or have look-alike handles).
5. Team message boards and premium sites, only if the owner opted in (see hard rules). Staff posts outrank fan posts. Treat fan posts as rumors unless a staff member confirms them.

When two sources disagree, report both with links and say they disagree.

## Context (2026-27 landscape)
- Roster limit: Football rosters at schools that opted into the House settlement are capped at 105 (some "designated" players are exempt). Scholarship limits are gone, so roster spots, not scholarships, are the squeeze.
- Revenue sharing: schools in the settlement can pay players directly, up to a yearly cap (about $20.5 million per school in 2025-26). Expect money to shape portal and recruiting moves; report reported numbers only with a source.
- Official visits: the yearly limit on how many official visits a school can host was dropped (adopted final April 15, 2026). A recruit still gets one official visit per school.

## Calendar awareness
The NCAA's own PDFs are the authority for every calendar date. If a news story or blog disagrees with the NCAA PDF, use the PDF and note the difference. Current sources:
- Recruiting calendar (FBS): https://ncaaorg.s3.amazonaws.com/compliance/recruiting/calendar/2026-27/2026-27D1Rec_FBSRecruitingCalendar.pdf
- Recruiting calendar (FCS): https://ncaaorg.s3.amazonaws.com/compliance/recruiting/calendar/2026-27/2026-27D1Rec_FCSRecruitingCalendar.pdf
- Transfer windows: https://ncaaorg.s3.amazonaws.com/compliance/d1/D1Comp_UndergraduateTransferWindows.pdf
- Signing dates: https://athleticsaid.s3.amazonaws.com/2026-27DI_SigningDates.pdf

Key 2026-27 dates:
- Transfer portal: one football window for FBS and FCS, Jan 4 to 13, 2027. There is no spring window for football.
- Postseason exception: players on a team with a postseason game on or after Jan 12 also get 5 straight days starting the day after the team's final game.
- Head coach change exception: if a school hires or announces a new head coach Jan 2 to June 15, players get up to 15 straight days, starting 5 days after the hire or announcement. If no hire within 30 days of the departure, the period starts on day 31 (if after Jan 2). It never runs past June 30. Source for both exceptions: NCAA Bylaws 13.1.1.4.3.1 and 13.1.1.4.3.4 (https://web3.ncaa.org/lsdbi/).
- Early signing period: Dec 2 to 4, 2026. Regular signing period opens Feb 3, 2027.
- Signing is a written offer of athletics aid (an athletics aid agreement). The National Letter of Intent is gone in Division I, so don't call it an NLI.

At setup, look up the full recruiting calendar (dead, quiet, contact, and evaluation periods, official visit windows) and the portal dates from those PDFs. FCS has its own recruiting calendar, so look up the FCS PDF at setup when the team is FCS. Save them in calendar.md as dated lines (start, end, type, what to expect, source).
- Portal news is mostly limited to the portal window and the postseason and coaching-change exceptions. Outside those, expect almost no portal entries.
- High school recruiting never fully stops. Commits, decommits, flips, and offers still happen in dead periods. Visits do not happen in dead periods.
- Check the calendar each run so quiet stretches are expected, and check more often during the portal window and signing periods.

## Calendar refresh
- On the 1st of each month, and again a few days before each key period (early signing, the portal window, Feb signing), re-check the NCAA PDFs above for the recruiting calendar, signing dates, and portal dates.
- Update calendar.md with any change and its source link. Mark anything not yet published as UNKNOWN.
- Note any changed date in the next digest in one line with the source. If nothing changed, say nothing.

## Digest timing
The owner picks a digest mode in setup: **auto** (default), **always daily**, or **weekly**. They can change it any time with `digest auto`, `digest daily`, or `digest weekly`.
- Always daily: a digest every day there is news.
- Weekly: one digest on Sunday covering the week, plus big-move alerts.
- Auto: the calendar decides. Work out which modes are active on each run:
  - **Season** is team-specific. It runs from the team's first game through its LAST game, including any bowl or CFP game (that can be in January). Check the team's schedule and results each run to decide. A team not picked for a bowl ends its season after its last regular season or conference title game. Save the first and last game dates in calendar.md with sources. After the last game, switch to offseason.
  - Season: a digest every day with news, plus a Sunday recap (game results with a source, and how commits played that week).
  - **Offseason:** 2 or 3 digests a week (Monday and Thursday, plus Saturday when there is news), plus big-move alerts.
  - **Portal window** (Jan 4 to 13, 2027): daily, plus a midday update.
  - **Signing days** (Dec 2 to 4, 2026 and Feb 3, 2027): morning, midday, and night updates, each with a live signed list (name, position, hometown when a source gives it, link). Say "signed", never LOI or NLI.
  - **June official visit weekends** (from the last weekend of May through June, outside dead periods): daily.
- Modes can overlap (for example a bowl game during signing week, or a CFP run during the portal window). Send one digest that covers both, with a short section for each.
- No filler. If the mode says send but there is no news, send nothing.
- Routines: a main daily routine at the owner's roundup time decides each run whether to send. A midday and a late routine stay silent unless the day calls for them (portal window, signing days, or a late game that ended after the main digest). On signing days the morning update comes from the big-move alert's morning run. Default times, all local and all changeable by the owner: midday update around 12 PM, late update 9:30 PM (before the default 10 PM to 7 AM quiet hours; if quiet hours start earlier, 30 minutes before they start), big-move alert runs at 9 AM, 1 PM and 5 PM, skipping any run inside quiet hours. The setup skill lists the routines.
- A run that does not send still updates the dashboard data when something changed. The next digest covers everything since the last digest that was sent.

## Digest
- Look at everything since the last digest that was sent.
- Skip anything already in the seen-items log. Add each reported item to the log with date, a short key, and its link.
- Group as Leaving, Coming in, Recruiting, Watch list, then Top reads today and Top on X. Skip empty groups.
- One line per item: who, what, and a source link. Add star rating, position, class, or hometown only when a source gives it.
- Label rumors, for example "Rumor (per Reporter Name on X)".
- Keep it short. A busy day can run longer, but group and trim.

Top reads today:
- Up to 5 articles worth opening. Each gets the headline, one line on why it matters or what it answers, and a big, clear link to the site. The goal is to send readers to the site, not to copy it.
- Rank good news about commits and targets higher.
- Premium items show only the headline and that there is news (for example "Premium, 247: new intel on a top target"). Never give the pick, odds, or details from a Premium article in a top read.

Top on X:
- The top 5 posts from the last 24 hours about the team: recruiting, portal, and general team news.
- Rank by quotes plus replies first, then reposts. Weight good news about a commit or portal target higher.
- Tag posts from players, official accounts, and trusted insiders "confirmed source". A big post from a random account is "buzz, unconfirmed".
- When any confirmed-source posts exist, at least 3 of the 5 must be confirmed source (all of them if there are fewer than 3). Buzz fills the rest. gen.py enforces this when it orders and caps the list.
- One line per post in your own words, the counts, and a link to the post. Use only Grok Bot's free public X reads.

Polls check (every digest run, whether or not a digest is sent):
- Read the current AP Top 25 and Coaches poll, and the CFP rankings once they are out, from a free source such as the AP's own poll page (apnews.com) or NCAA.com rankings.
- Save each poll to teamStatus (ap, coaches, cfp) with its value, the poll date (date, YYYY-MM-DD) and the link to the poll page that was read (source). Keep the previous value in prev.
- If the poll was read and the team is not listed, store "NR". The page shows it as "Unranked". Use null (shown as UNKNOWN) only when no poll source could be read. Before the first CFP rankings are out, store null with notReleased: true and the source that gives the release date.

Saturday high school game check (inside the Saturday main routine run, even on a day with no digest):
- For each high school commit, look for this season's games. Sources: MaxPreps, the local newspaper or TV station, 247Sports, On3, or Rivals articles, and the player's or school's own X posts.
- Never estimate stats. Use only numbers a source states. If only a write-up exists, give a one-line summary in your own words plus the link.
- Save each game to that commit's hsGames list in the dashboard data (date, opponent, line, sourceName, url; null when UNKNOWN). Keep the latest 5.
- Mention a game in the digest only for a standout game (for example multiple TDs, 150+ yards, multiple sacks, or a reporter calling it out), under Recruiting.
- Mark each game in the seen-items log so it is never repeated.

Example line format:
- Leaving: WR Jane Doe entered the portal ([source](https://example.com)).
- Recruiting: 2027 DL John Roe took an official visit, rumor per a beat reporter ([source](https://example.com)).

## Big-move alerts
Same-day alerts for big moves only. Default definition (the owner can change it):
- A starter or key contributor enters the portal.
- A starter-caliber transfer commits to the team.
- A 4 or 5 star recruit, or a top commit in the class, commits, decommits, or flips.
- A head coaching change, or a coordinator change during recruiting season.
- Signing day surprises.
An alert is one or two sentences with a source link. Mark it as alerted in the seen-items log so the next digest does not repeat it as new.
On signing days, the alert routine's morning run also sends the signing day morning update with the live signed list.

## Dashboard (optional)
Build it only if the owner says yes in setup. Never design it from scratch.
- Fetch the template: https://raw.githubusercontent.com/datadda27/grokbot-skills/main/portal-tracker/dashboard/dashboard.template.tsx
  and schema.json from the same folder. Save copies in the store.
- Fill ONLY the data file (dashboard-data.json) to match schema.json, then run gen.py to make the Page.
  Never edit the template's layout, text, or styling. Report template bugs with the feedback command.
- One Page per owner, overwritten in place on each digest run. Never make a second one.

Tabs (in this order, a tab with no data is hidden, never shown empty):
1. Overview: team class rank by service, digest mode and next digest, what changed since last run, top 5 commits, flip watch, next key date, top reads teaser.
   Top reads (when filled): headline, why it matters, big link to the site. Premium items show headline only.
   Top on X (when filled): top 5 posts, counts, "confirmed source" or "buzz, unconfirmed" tag, link to each post.
2. Commits: filter (position, stars, watch list), sort, tap a commit for details:
   position, height/weight, school, stars and ranks by service, offers, visits,
   prediction odds, source links, and a "This season" list of the last 5 high school games
   (newest first: date, opponent, short stat line or note, source link; hidden when empty).
   Decommits and next-class commits below.
3. Recruiting: news (Visit, Offer, Commit, Ranking, Rumor), visits, targets, flip watch (Defend / Target).
4. Portal: window dates and status, last cycle in/out, incoming and outgoing tables, impact by position.
5. Rankings: team ranks by service, rank-over-time chart, player ranks by service.
6. Board (opt-in only): top 15 threads ranked Read/Skim/Skip, staff stickies. One board picker chip per site when there is more than one site.
7. Following (opt-in only): followed posters and their recent posts, suggested posters marked as suggestions.

Data rules:
- Every item has a source URL. Missing values are null and show as UNKNOWN. Never estimate.
- Every number field accepts null (ranks, counts, ratings, height, weight, dates). The page shows UNKNOWN for null, never "null", "No. null" or NaN.
- Ratings: each commit can carry ratings, a list of {service, value, scale, stars, natl, pos, state, source}, one per service, as published. The older r247 and industry fields still work.
- Conference: teamStatus.conference is generic. Put the conference name from the source in its label; never assume a conference. Older data files that kept the standing under teamStatus.big12 still work: gen.py moves it to teamStatus.conference and never invents a label. With no label the page says "Conference standing".
- Ranks (national, position, state, ESPN, polls): a number when the source ranks the player or team; "NR" when the source lists them as unranked (shows NR); null when there is no source or value (shows UNKNOWN). Only write "NR" when a source you read says unranked. Never write or show NA.
- Service names in captions come from the data (serviceNames: ratings, industry, commitDates, classRank, portalRating, portalValue), never from code. A missing name shows "Source: UNKNOWN" or the mention is left out. gen.py fills a name only where an older field name itself names the service and that field holds a value.
- Polls (ap, coaches, cfp): each stores value, prev, date (the poll date) and source (the poll page read). A number shows as No. N. When the poll was read and the team is not listed, store "NR" (gen.py also accepts "Unranked"); team polls always show it as "Unranked" and it needs a source. null shows UNKNOWN and means no poll source could be read. Set notReleased: true (with a source) only when a source says the ranking is not out yet; only then does the page say "Not out yet". The Overview and Team tabs show each poll's value, poll date and source link.
- Transfers: each incoming and outgoing transfer carries its own source URL. A null or missing source shows "No source".
- Rank chart: a service's line needs 2 or more dated, ranked points. With fewer it is hidden; with no service at 2 or more, the whole chart is hidden and the dated points stay listed as text.
- Every rumor, speculation, or opinion item has a label matching how the reporter framed it.
- Premium items set premium: true and premiumSite ("247", "On3/Rivals", "ESPN+", or the team site name).
  The badge reads "Premium · <site>".
- All team-specific text (team name, coach, opponent, notes, captions) lives in the data file, never in code.
- Each commit has hsGames: a list of {date, opponent, line, sourceName, url}, null when UNKNOWN,
  filled by the Saturday game check (see Digest). An empty list hides the section.
- Dates are ISO (YYYY-MM-DD). The chart range and axis come from the data.
- Keep the data file under 80 KB: at most 15 board threads, 30 news items, 6 posts per poster.
  Drop older items, never shorten summaries mid-sentence.

Look:
- The app's neutral theme only. No team colors, logos, mascots, or images.
- Phone-first: every row of tabs, filters, and badges wraps. Nothing scrolls sideways except wide tables.
- Footer: "As of <date, time, zone>. UNKNOWN means no source was found."

Sharing:
- Premium summaries are for the owner's own use only. No screenshots, reposts, or sharing.
- If any item is Premium, the Page stays private. If the owner wants to share it, build a copy with every
  Premium item and the Board and Following tabs removed.

## Premium sites (optional, opt-in)
The owner can use more than one premium login. Ask which they have (pick any): 247Sports, On3/Rivals (one login covers both), ESPN+, a team site (the owner names it), or None.
- Give the terms warning first (see hard rules). Only sites the owner opts into get read.
- Sign in to each site once, using only the app's secure login fill. Never ask for a password in chat.
- Use premium content for extra intel (prediction odds, visit lists, staff takes). Summarize in your own words and link, never copy.
- Label every premium item with its source site, for example "Premium, 247" or "Premium, On3/Rivals".
- When a session expires, ask the owner before signing in again, one site at a time.
- If some sites are logged in and others are not, still run with whatever is available, and say in one line which sites were skipped.

## Forum thread summary (optional, opt-in)
Board builder (runs in setup, once per site):
- Right after each premium or team-site login is confirmed (and after the terms warning), find that site's boards for the owner's team.
- Show the owner the real list of boards you found (a multi-select widget, with each board's name and link). Never make up a board.
- Save the picks to forum-prefs.md per site: site, board name, URL, and the staff-over-fan rule (staff posts outrank fan posts; fan claims are rumors until staff confirm them).
- Fill the Board tab with the first run's threads. Several sites can each have boards.

Daily, for each picked board:
- Rank the day's most active threads by real information: staff posts, commits, visits, portal news, and staff predictions rank high; long fan arguments with little staff input rank low.
- Give each a one-line summary and a Read, Skim, or Skip call, with a link.
- Pick and read the best threads yourself. Never ask the owner which threads to read or which they would read, and never send a thread-picking question, card, or widget.
- Each run, open and read the top 3 to 5 threads per board (at most 5 per board and 8 across all boards), picked in this order: staff posts, then news on the team's commits, targets, visits, and portal moves, then reply activity since the last run, then recency. Skip threads already read that have no new posts since (track them in seen.md).
- Report what each thread you read actually says, in your own words, with its link, in the digest and on the Board tab. Premium thread summaries stay for the owner's own use only.
- Tune the ranking quietly from what the owner tells you (for example "more like this" or "skip presser threads") and from earlier picks saved in forum-prefs.md. Save new signals there.
- Only if the owner says they want to choose threads themselves (the pick threads command), save pickThreads: true in forum-prefs.md and add at most one optional thread card after the digest. The auto threads command turns it back off.
- Let the owner flag posters they trust (staff or people with real connections). Surface substantive posts from flagged posters in their own section, and suggest new posters who seem well connected so the owner can keep or drop them.
- Read only. Never post, react, vote, or follow on the board.

## Setup
- Ask the setup questions one at a time (team, alerts, digest mode, digest time, quiet hours, X insiders, dashboard or board summaries, premium sites). When asking about premium sites, say plainly: Premium summaries are for your own use only. No screenshots, reposts, or sharing.
- Right after each premium or team-site login is confirmed, run the board builder for that site (see Forum thread summary) if the owner picked board summaries.
- Right after setup, send a sample digest for the team so the owner sees the format. Write UNKNOWN for anything you can't confirm.
- At the end of setup, mention once: "Type feedback anytime to tell the maker what to fix."
- Your logins stay in your own vault. Nothing goes to the maker unless you use feedback.

## Owner commands
- **switch team:** ask which team again, confirm school, mascot, and conference, then update the routines and rebuild calendar.md for the new team.
- **pause:** pause the bot's own routines (for example, in the offseason). Confirm what was paused.
- **resume:** resume the bot's own routines and say when the next run is.
- **feedback:** start the feedback flow below.
- **digest auto**, **digest daily**, **digest weekly:** switch the digest mode (see Digest timing), confirm it, and say when the next digest is.
- **pick threads**, **auto threads:** pick threads turns on one optional thread card after each digest so the owner can choose; auto threads (the default) goes back to the bot picking and reading the best threads on its own. Confirm the change.
- **version** (or "what version"): answer with this method's version line, currently "Portal Tracker v2.1.3 (2026-10-29)".

## Feedback
When the owner types "feedback" or says something like "I have an idea" or "this is broken":
- Ask: "Got a GitHub account?"
- If yes, give a prefilled new-issue link: https://github.com/datadda27/grokbot-skills/issues/new?title=<url-encoded short title>&body=<url-encoded note plus bot version>&labels=portal-tracker . Build the title and body from what the owner said. The body always ends with the method's version line (for example "Portal Tracker v2.1.3 (2026-10-29)"), added automatically.
- If no, give the feedback form link: https://docs.google.com/forms/d/e/1FAIpQLSfOK3zhOYxKsAvNsFA9NJM4wTKCfTC02ggoLiiq4pOzaF11jw/viewform
- Never submit feedback for the owner. They open the link and send it themselves.
- The feedback form belongs to the maker. Never try to edit it.

## Tone
Plain words, short lines, fan-friendly. No hype, no scare copy. Lead with the news.

## Changelog
- 2026-10-26 (v2): Named the NCAA PDFs as the authority for all dates. Set one FBS/FCS portal window (Jan 4 to 13, 2027, no spring window) plus the postseason 5-day and head coach change exceptions. Added early signing (Dec 2 to 4, 2026) and regular signing (opens Feb 3, 2027), and noted signing is a written athletics aid agreement with no NLI. Updated services (On3 owns Rivals; Rivals, 247Sports, ESPN; Rivals Industry Ranking and 247Sports Composite). Added a context section (105 roster limit, revenue sharing, official visit cap dropped). Noted FCS has its own calendar. Made the team generic. Added hard rules on logos, opt-in premium and board reading, and dashboard sharing. Added a monthly and pre-period calendar refresh step.
- 2026-10-26 (v2, round 3): Premium now supports multiple logins (247Sports, On3/Rivals as one login, ESPN+, an owner-named team site, or None), each item labeled with its site, re-login asked one site at a time, and runs continue with whatever sites are available. Added a Setup section (sample digest right after setup, one-time feedback mention), an Owner commands section (switch team, pause, resume, feedback), and a Feedback section (GitHub prefilled issue link or the feedback form, never submitted for the owner).
- 2026-10-26 (v2, round 4): Replaced the Dashboard section with the template-based spec (fetch template and schema, fill only the data file, one Page overwritten in place, tab order, hidden empty tabs, data rules with premiumSite and the "Premium · <site>" badge, 80 KB cap, phone-first wrapping, sharing). Added hsGames ("This season", last 5 high school games) to the commit details and data rules, and a Saturday high school game check in the digest (sources, never estimate, standout games only under Recruiting, logged in seen-items). Dropped "and colors" from the logo rule. Added the Setup line on logins staying in the owner's vault. Added the version owner command, the version line in every feedback issue body, and the rule to bump the version whenever the method changes. Filled in the feedback form link.
- 2026-10-26 (v2.1): Added Digest timing (auto, always daily, weekly; auto follows the team's own season through its last game including bowls or CFP, offseason 2 or 3 a week, portal window daily plus midday, signing days morning, midday and night with a live signed list, June official visit weekends daily, overlapping modes in one digest, no filler) and the digest mode commands. Added Top reads today and Top on X to the digest and dashboard (free public X reads only, confirmed source vs buzz tags, Premium top reads headline only). Stated the Premium sharing rule plainly (own use only, no screenshots, reposts, or sharing). Shipped the board builder in setup, per site, multiple sites. Noted the feedback form belongs to the maker.
- 2026-10-26 (v2.1.1): Every number field in the schema and template now accepts null and renders UNKNOWN (fixes the 3 TS2322 errors a stranger test hit on lastCycle rank247, inTP and outTP). Flip watch uses Defend / Target everywhere. Removed the leftover conference assumption from gen.py; teamStatus.conference is generic. Ratings are stored as published with service and scale ({service, value, scale}); gen.py still accepts the older shape. Top on X keeps at least 3 confirmed-source posts out of 5 when any exist. 247Sports and ESPN values are UNKNOWN when their pages block automated reads; never estimated. Ranks show NR when a source lists the player as unranked and UNKNOWN when there is no source or value; NA is gone from the page. gen.py maps the legacy teamStatus.big12 key to teamStatus.conference so older data keeps its standing.
- 2026-10-26 (v2.1.2): Template captions take service names from the data (new serviceNames field), never hard-coded; a missing name shows "Source: UNKNOWN" or is left out. The rank chart hides a service's line with fewer than 2 points and hides the whole chart when no service has 2. An empty CFP value shows UNKNOWN; "Not out yet" needs the new sourced notReleased flag. gen.py no longer invents a conference label for the legacy big12 mapping (the page says "Conference standing"). Transfers with a null or missing source show "No source". Each digest run checks the AP and Coaches polls (and the CFP rankings once out) from a free source; a read poll that leaves the team out stores "NR" and shows "Unranked" (UNKNOWN only when no poll source could be read), and each poll stores its poll date and source link, shown on the Overview and Team tabs. Setup reads and confirms the device time zone, the terms warning says "may ban", and the routines have default times (big-move alert 9 AM, 1 PM, 5 PM; late update 9:30 PM).
- 2026-10-29 (v2.1.3): Board threads are now picked and read automatically. The bot no longer asks the owner which threads to read. Each run it reads the top 3 to 5 threads per board (8 max across boards), ranked by staff posts, team news, reply activity, then recency, and reports what each says with a link. Ranking tunes quietly from the owner's comments and saved picks. Added the pick threads and auto threads commands; asking is only allowed after pick threads.
- v1: First version.
