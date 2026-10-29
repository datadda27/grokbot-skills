# Module: Evacuation, carry kits (go-bags), and getting home

Version: Prepper v1.2.5 (2026-10-29). Opt-in module, off by default. Loaded only when the owner turns it on.

Sources: Ready.gov Evacuation (https://www.ready.gov/evacuation), Ready.gov Make a Plan (https://www.ready.gov/plan), Ready.gov Car Safety (https://www.ready.gov/car).

## Know before you go
- The source of truth for evacuation zones and orders is the county or state emergency management site. Some counties use Genasys Protect (https://protect.genasys.com/). The bot finds the official page and links it; it never guesses a zone.
- Pick destinations in different directions (a friend's home in another town, a motel). (Ready.gov)
- Learn alternate routes; your route may be on foot. (Ready.gov)
- Keep at least a half tank of gas at all times, a full tank when evacuation seems likely. (Ready.gov)
- Plan one car per family to reduce congestion. (Ready.gov)
- No car? Plan with family, friends, or the local emergency management office now. (Ready.gov)

## Three plans by time (the bot fills them in with the household)
Structure is the bot's; the steps come from Ready.gov Evacuation.

**5 minutes (leave now):** people and pets, the go-bags (if packed), phones and chargers, wallet and keys, sturdy shoes. Out the door. Do not stop for anything else.

**15 minutes:** the 5-minute list, plus: medications and glasses from the home spots, the documents bag, the pet go kit, water from the car kit shelf. Text the out-of-area contact where you're going. Lock doors and windows.

**60 minutes:** the 15-minute list, plus: unplug small electronics; leave the fridge and freezer plugged in unless flooding is a risk; shut off water, gas, and electricity only if there is damage and officials say to; leave a note saying when you left and where you're going; check on neighbors who may need a ride; follow the recommended routes, no shortcuts. (Ready.gov Evacuation)

Each plan prints on the printable plan with the household's own spots ("go-bags: hall closet"). A plan names only gear the household has confirmed; until the carry kits exist, the line reads "go-bags: not packed yet (this week's build task)" and the documents line points to the important papers.

## Go-bag: the 72-hour carry kit (see `kits.md`, tier 2, for the full template)
One per person and one per pet, small enough to carry, kept together in one known spot near an exit that everyone can name. (DoD Emergency Preparedness Guidance: a smaller kit you can easily transport if you need to evacuate, https://download.militaryonesource.mil/12038/MOS/ResourceGuides/DoD-Emergency-Preparedness-Guidance.pdf; Ready Marine Corps: make sure every member of the family knows where the kit is, https://www.ready.marines.mil/Build-a-Kit/Emergency-Kits/)
Before naming a person responsible for it, ask once: "Do you each have a 72-hour carry bag packed? Where is it kept?" If not, building it is a weekly task, not a role. (Ready.gov Evacuation)

## Get-home bag (optional)
For anyone who works or studies more than a walk from home: a small bag at work or in the car with water, snacks, comfortable shoes, a flashlight, a phone charger, a printed map and the wallet card, a rain layer, and any daily medicine (details private). The bot asks how far and how they'd get home if roads were closed, and saves the answer on the plan.

## Kids away from home (college, boarding school, camp)
Offered when a family member lives away, never scored. (Ready.gov Kids: https://www.ready.gov/kids)
- **Dorm away kit:** a small kit with water, snacks, a flashlight, a phone charger, a printed wallet card, and any daily medicine (details private). No flame or fuel: check housing rules first. For example, Texas Tech residence halls ban candles, propane, extension cords, and knives with blades 2 inches or longer (https://www.depts.ttu.edu/housing/contracts/hallpolicies.php).
- **Campus alerts:** sign up for the school's emergency alerts, and keep phone emergency alerts on.
- **One reunification line per person away:** who picks them up (or "stay put"), the route to the out-of-town meeting place, and the out-of-area check-in. Saved as `printPlan.awayFromHome` (town or campus only, never a street address; a minor uses their page label) and shown on the Family plan Page and printed plan.
- **FEMA app:** it can send weather alerts for up to five locations, so the family can add the campus town too (https://www.fema.gov/about/news-multimedia/mobile-products).

## Returning home (Ready.gov)
Check with officials where you are and back home before you travel. Avoid downed lines. Generators outside only, never connected to the home's wiring.
