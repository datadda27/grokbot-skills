# Prepper changelog

## v1.2.1 (2026-10-28)
- Shopping rule: still never buys and no affiliate, referral or sponsored links, but when the owner asks where to buy something the bot gives the spec, then 2 to 4 neutral store options with plain links and that day's prices.

## v1.2.0 (2026-10-27)
First public release under the final name.
- Renamed to Prepper (was Family Prepper) in every user-facing line: method, getting-started skill (now `prepper-getting-started`), routine names ("Prepper: threat watch", "Prepper: weekly", "Prepper: seasonal reminder", "Prepper: nudge"), Page titles, version answers, and feedback text. The GitHub folder stays `family-prepper/`, so every link keeps working; the saved method file name and the issue label are unchanged.
- New template description that opens with: "Your family's disaster plan, built in minutes. Snap pics of your food, water and gear for a readiness score and simple weekly steps to get ready."
- Ships all v1.1.x fixes.

## v1.1.3 (2026-10-27)
Fixes from the third round of the second setup test.
- Score never drops from an inventory batch: the owner's estimate stays in `days` and the running count goes in `categories[].countedDays`. gen.py scores the higher of the two and the Page shows "counted so far X of ~Y days". The count replaces the estimate only after the owner says counting is complete, or confirms once when asked. New score walk case: estimate 14, counted so far 3.7, score holds.
- Snacks, chips, cookies, and side packets count toward food days at conservative low calories; an unclear package count uses the fewest the photo shows. Defaults in `reference/us.md`, "Counting food from photos".
- Headline Check in chat is about 1,200 characters at most, in a fixed order (Do now, verdict and claim, 2 to 3 bullets, what it means for this household, one calm step, up to 3 dated sources, one-line confidence, county source of truth). The full version goes to the Page's history (`headlineChecks[].full`, source dates). Format 2 rewritten.
- "Use first in an outage" list (`outageUseFirst`) on the Page: fridge about 4 hours, a full, closed freezer about 48 hours. Dates optional; never counted toward food days.
- Two kinds of missing dates: "date not read from photo" stays UNKNOWN; "undated package" uses the low end of the shelf-life range and is marked estimated (`expiring[].estimated`). Inventory lines get `dateStatus`.
- Phone count: the life safety check asks how many phones are in the house and how many have alerts on (`household.phones`); phone alerts doneShare uses it. The quick start stays at 4 questions.
- Stable child labels: each minor gets a `pageLabel` (Child A, Child B, in the order added), shown with the age band. gen.py no longer numbers kids by list position.
- One writer at a time: only one task writes `dashboard-data.json`; a second task waits or writes a pending file that is merged at the next milestone rebuild.

## v1.1.2 (2026-10-27)
Fixes from the end of the second setup test.
- No filler acks: one message per owner answer, with the confirmation and the next question together.
- Setup closes in at most two messages after the nudge answer: the nudge result with Headline Check, shortcuts, feedback, and privacy lines; then the deep setup offer. The weekly choice is never confirmed on its own.
- Watched places: the town plus a role label the owner gives (default "family"). No names, ages, or relationships in the Page data or any store file.
- Family share text is addressed to "a spouse or adult child" unless the owner named recipients in this setup; never names from memory.
- Version check every run: if the method is newer than `version` in `dashboard-data.json`, re-read it and update the stored version. Reference, module, and dashboard files are read live, never copied into the store; only the method is saved, as a fallback.

## v1.1.1 (2026-10-27)
Fixes from the second setup test.
- Setup is done in the chat itself: no background helper for the first payoff or the Page, a hello plus the ZIP question as the first message, and every turn ends with a send.
- First payoff: hard 600-character limit; the do-it-now steps go out only after "Want the steps?" (format 1b).
- Pacing: the Page and routines are built silently right after the payoff; then at most two messages (Page link and hazards; sample alert, routines, and the weekly line), and later questions one per turn.
- Weekly tasks start on, with one "I'll take that as a yes unless you say no" line in the routines message; the Saturday preview is promised only while they're on.
- Threat watch: the setup sample is a labeled format 3 alert; `firstWatchSent` is recorded whenever the first-run line is shown, so it never repeats.
- Partly done items: `lifeSafety[].doneShare` (schema, gen.py, template type) gives partial credit, for example phone alerts on 1 of 5 phones.
- `modules/hazards.md`: maps NRI hazard names to modes and adds reminder months, so seasonal lines can fire (winter weather, tornado, heat).
- `reference/us.md`: counting cases of bottled water.
- The device follow-up asks only about the device and its backup power.
- Memory at setup: preparedness facts already in memory (ZIP or town, household size and age bands, pets, device yes or no) are listed in one line with "Use that?"; only confirmed facts are used and the confirmed questions are skipped. No other health details, no quoting other bots, nothing unconfirmed on the Page.
- Family: only the owner needs Grok Bot. The share text uses the Page's public link (the owner turns it on with the Page's share control; it shows only the shared plan). The plan and wallet card are also offered as paste-ready plain text and as a printable version. Family with Grok Bot can optionally import their own copy.

## v1.1.0 (2026-10-27)
- Faster start: 4 questions (the ZIP and time zone confirmation is folded into "who's home"), then one short first payoff under 600 characters: score, top 3 gaps, and a do-it-now task. Computed inline with `gen.py --summary`; no waiting messages. Page link, hazards, a sample threat watch, and routines follow one at a time. Budget and medicine details come after the payoff; the medical device question stays as a yes or no in the life safety check.
- Do it now: test the smoke alarms and turn on phone emergency alerts (iPhone and Android steps), then rebuild the Page and show the score jump. One seasonal line when a top hazard is in season.
- Score only goes up: fixed denominator, unanswered items earn 0 and show as points waiting, a separate setup progress bar, and gap points equal the stated weights. Tasks show their points (`task.itemIds`).
- Page: view switcher at the top of every view; titles use the household's name or a neutral label; kids shown by age band unless the owner opts in to names. Share the link with "Open it in the Grok Bot app."
- Page rebuilds batched to milestones (first build, the do-it-now win, end of an inventory or photo batch, a tier change, an ACT NOW or PREPARE starting or ending, the end of the weekly task or check-in, and `update my page`). Data still updates on every change.
- One weekly routine: on days 1 to 7 it sends the monthly check-in with the week's task folded in, so the two never collide.
- New commands: `preview this week`, `check-in now`, `update my page`.
- First threat watch sends one "all clear, I'll stay quiet" line, once. Optional one-time nudge the next evening.
- Headline Check introduced at the end of setup; tone follows the facts (calm when nothing official applies, firm about specific plan steps when a real official risk does).
- Family: "anyone in another town to keep an eye on?" and a ready-to-send share text the owner sends.
- Fixes: Power and Light are defined checklists (Ready.gov Power Outages); smoke alarm wording is the same everywhere ("on every level, tested this month"); seasonal reminders skip anything already in an open task; checklists go out as plain text; results always go through the send tool; the Page id and routine list are saved to memory; the watch point is the ZIP's own center (Zippopotam.us) with the time zone from NWS.

## v1.0.0 (2026-10-26)
- First release. One job: two weeks at home, and keep it there.
- Method (`SKILL.md`) fetched live by every routine, with a saved fallback.
- Readiness: days-of-supply ladder for 10 categories, life safety first, provisional score with a "not counted yet" bucket, tiers of 72 hours and 2 weeks (optional 1 month and 3 months).
- Headline Check with VERIFIED, PARTLY VERIFIED, UNVERIFIED, and NOT SUPPORTED verdicts; do now comes first.
- Threat watch twice a day, hourly during an NWS watch or warning, and manual emergency mode.
- Modular delivery channels: chat, phone alarm (offered only when emergency mode turns on), reminders, email, and Slack, with iMessage and phone calls listed as planned. New channels need only a SKILL.md edit.
- Keyless US sources: NWS, FEMA NRI, OpenFEMA, USGS, NHC, NIFC, IPAWS, US Drought Monitor, Open-Meteo, openFDA, CPSC, FCC Area API.
- Sensors: Zapier first, IFTTT second (needs IFTTT Pro). Todoist and Zapier are marketplace plugins.
- Dashboard template, schema, gen.py, and sample data for a fake household.
- Modules: pets, evacuation, kits, money and documents, extra needs, hazards, canning, gardening, firearms safety, after a disaster, advanced connections.
