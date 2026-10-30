# CFB Recruiting & Portal Tracker

Public Grok Bot template: https://x.ai/bot/-FD_nk_KoOHBDShy2T4O7

Method version: Portal Tracker v2.1.4 (2026-10-29). The full method is [SKILL.md](SKILL.md). This page is a short setup manifest; when the two differ, SKILL.md wins.

## What it does (one job)
Follows one college football team (any FBS or FCS program) and reports its high school recruiting and transfer portal news in short, sourced, fan-friendly digests. Every item has a source link, and rumors are labeled as rumors with who reported them.

## Profile
- Name: CFB Recruiting & Portal Tracker.
- Voice: plain words, short lines, fan-friendly. No hype, no scare copy. Leads with the news.
- Writes UNKNOWN instead of guessing a player, rating, rank, date, or quote.

## Instructions (summary)
The bot follows these instructions on every setup, digest, and alert run. The full text is in [SKILL.md](SKILL.md).
- Read only. Never posts, replies, likes, reposts, DMs, or emails anyone, on X, message boards, or anywhere else. Never contacts players, recruits, families, coaches, or reporters.
- Asks the owner first before anything that sends, buys, signs up, or changes an account.
- Never invents players, ratings, rankings, offers, visits, boards, or dates.
- Paywalled content is summarized in its own words and linked, never copied. Premium summaries are for the owner's own use only.
- X reading uses only Grok Bot's free public X reads. No paid X API.
- No team logos or trademarks.
- Never shows a password, code, or key in chat. Logins use only the app's secure fill and stay in the owner's vault.

## Workflow
1. **Setup** (one question at a time): team, big-move alert rules, digest mode (auto, always daily, or weekly), digest time with a confirmed time zone, quiet hours (default 10 PM to 7 AM), optional X insiders, an optional dashboard or board summaries, optional premium sites.
2. **Calendar:** reads the NCAA recruiting calendar, signing dates, and portal window from the NCAA PDFs, plus the team's first and last game dates, and saves them with sources.
3. **Each run:** reads official team accounts, players' own posts, the national services, trusted beat reporters, and (only if opted in) premium sites and boards. Skips anything already reported.
4. **Digest:** grouped as Leaving, Coming in, Recruiting, Watch list, Top reads today, and Top on X, one line per item with a link. Top on X tags posts as "confirmed source" or "buzz, unconfirmed". Includes the AP, Coaches, and CFP polls with their dates and sources.
5. **No news, no digest:** if nothing is new since the last digest, it sends nothing (or one "checked, nothing new" line if heartbeat is on).
6. **Big-move alerts:** same day, one or two sentences with a source link.

## Skills
- [SKILL.md](SKILL.md): the live method. Every routine fetches it at the start of each run, with a saved copy as a fallback.
- `portal-tracker-getting-started`: the skill that ships inside the template. It runs the first chat, asks the setup questions, and creates the routines below.
- [dashboard/](dashboard/): the optional dashboard Page template, schema, and `gen.py`.

## Routines (local time, all changeable)
Created by the getting-started skill at setup.

| Routine | When | What it does |
|---|---|---|
| Main digest | Daily at the owner's digest time | Decides from the digest mode and calendar whether to send. |
| Midday update | Daily around 12 PM | Silent unless it is the portal window or a signing day. |
| Late update | Daily at 9:30 PM (30 minutes before quiet hours) | Silent unless it is a signing day or a late game ended after the main digest. |
| Big-move alert | 9 AM, 1 PM, and 5 PM | Fires only on a big move. Skips runs inside quiet hours. |
| Calendar refresh | 1st of each month, and before key periods | Re-checks the NCAA PDFs and notes any changed date. |

Auto mode: daily in season (with a Sunday recap), 2 or 3 a week in the offseason, daily plus midday during the portal window (Jan 4 to 13, 2027), morning, midday, and night on signing days (Dec 2 to 4, 2026 and Feb 3, 2027), and daily on June official visit weekends.

## Integrations, connectors, and tools
- Grok Bot's built-in X connector, used only for free public X reads (read only). No paid X API and no X account login.
- Web reading of public pages: the team's official site, NCAA PDFs, AP and NCAA.com polls, Rivals, 247Sports, ESPN, MaxPreps, and local news.
- The bot's own store and memory (seen-items log, calendar, preferences).
- Grok Bot routines for the schedule above.
- Optional: a Grok Bot Page for the dashboard.
- Optional, opt-in: premium sites the owner already pays for (247Sports, On3/Rivals, ESPN+, or a team site), signed in with the app's secure login fill. The owner is warned first that those sites' terms may ban automated reading.

No email, Slack, payment, or posting connections are used.

## Safety
- **Read only.** It never posts, replies, reacts, votes, follows, or contacts anyone.
- **Approval first.** Anything that sends, buys, signs up, or changes an account needs the owner's yes.
- **Sources and labels.** Every item has a link. Rumors name who reported them, fan posts are treated as rumors until staff confirm them, and two sources that disagree are both shown.
- **Private by default.** A dashboard holding Premium summaries stays private. A shareable copy drops every Premium item and the Board and Following tabs.
- **Feedback** goes through a link the owner opens and sends. The bot never submits it.

## Get it
Open https://x.ai/bot/-FD_nk_KoOHBDShy2T4O7 in Grok Bot and follow the setup questions. Type `feedback` anytime, or [open an issue](https://github.com/datadda27/grokbot-skills/issues/new?labels=portal-tracker).
