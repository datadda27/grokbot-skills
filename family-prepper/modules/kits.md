# Module: Kit templates (two tiers, location kits, first aid, add-ons)

Version: Prepper v1.2.2 (2026-10-28). Opt-in module, off by default. Loaded only when the owner turns it on.

Each kit is a checklist on the Page with done / missing / not checked. Amounts scale to the household. Roles and the printable plan name only kits the household has confirmed it has; a kit that doesn't exist yet is a weekly build task ("Build the 72-hour carry kit for one person"), never a role.

## How the kits fit together
The structure follows military family readiness guidance, which builds on Ready.gov:
- DoD Emergency Preparedness Guidance: plan for at least 72 hours, and "consider assembling two kits: one kit for staying where you are; and another smaller kit that you can easily transport if you need to evacuate." (https://download.militaryonesource.mil/12038/MOS/ResourceGuides/DoD-Emergency-Preparedness-Guidance.pdf)
- Ready Marine Corps: keep supplies in a single location everyone in the house can find, add portable, vehicle, and workplace kits, and consider supplies for sheltering up to two weeks. (https://www.ready.marines.mil/Build-a-Kit/Emergency-Kits/)
- Ready Army: separate kits for home, office, and vehicle in one designated spot everyone knows; a work kit covers about 24 hours. (https://www.army.mil/ready)
- Ready.gov Build a Kit: the basic supply list and kit storage at home, work, and car. (https://www.ready.gov/kit)

So Prepper uses two tiers:
1. **2-week stay-home kit.** The supplies the readiness score already counts (water, food, medicines, sanitation, power and light, first aid, documents). Nothing new to score; this section just names it as a kit. Keep it together in one known spot at home.
2. **72-hour carry kit.** One per person and one per pet, small enough to carry, kept together in one known spot near an exit that everyone in the house can name.

Location kits (vehicle, work) are optional. Offer them once both tiers are started, not before.

## Tier 1: 2-week stay-home kit
The score's categories and amounts (see `SKILL.md` Readiness score and `reference/us.md`). One flashlight per person, which is stricter than the 1 per 2 people in the Marine Corps and Army lists, because each person may need their own light at night. Keep the stay-home supplies in one place, so the monthly check-in can check one spot.

## Tier 2: 72-hour carry kit (per person)
Source: Ready.gov Build a Kit (https://www.ready.gov/kit), American Red Cross 3-day evacuation supply (https://www.redcross.org/get-help/how-to-prepare-for-emergencies/survival-kit-supplies.html), and Ready Marine Corps Emergency Kits (https://www.ready.marines.mil/Build-a-Kit/Emergency-Kits/).
- Water: 3 gallons per person if carried by car; a 1-day carry (1 gallon) plus a way to refill if on foot.
- Food: 3 days of ready-to-eat food (about 6,000 kcal per adult, a planning estimate).
- Flashlight (one per person) and spare batteries; a whistle; a dust mask or N95.
- Phone charger and power bank.
- Medications for 7 days (Red Cross) and copies of prescriptions. Details private.
- Copies of key documents in a waterproof bag (see `money-documents.md`).
- Cash in small bills. Tracked only as yes or no in `private.json`. No amount anywhere: not on the Page, the printout, or a chat summary.
- Change of clothes, sturdy shoes, rain gear, an emergency blanket.
- Hygiene items, moist towelettes, hand sanitizer, garbage bags.
- The wallet card and a printed local map.
- Glasses or contact supplies; infant or child items; a comfort item for kids.
- Anything a power-dependent medical device needs to travel (see `extra-needs.md`).

**Pet carry kit (one per pet):** see `pets.md`, "Pet carry kit".

**Where it lives:** ask "Where do the carry kits live?" and save the spot (for example "hall closet by the back door"). Ready Marine Corps: make sure every member of the family knows where the kit is. The spot goes on the printable plan; the contents stay a checklist on the Page.

## Optional location kits
- **Vehicle kit.** Source: Ready.gov Car Safety (https://www.ready.gov/car), Ready.gov Winter Weather (https://www.ready.gov/winter-weather), and Ready Marine Corps (vehicle kit).
  - Jumper cables; flares or a reflective triangle.
  - Ice scraper; cat litter or sand for traction (winter).
  - Car phone charger.
  - Blanket and warm clothes; water and snacks; a flashlight.
  - A printed map.
  - First aid kit (below).
  - Keep at least a half tank of gas (Ready.gov Evacuation).
- **Work kit.** Source: Ready Army (be ready to shelter at work for at least 24 hours). Food, water, daily medicines (details private), comfortable walking shoes, a flashlight, a phone charger, and the family's communication plan. See also the get-home bag in `evacuation.md`.

## First aid kit (family of four)
Source: American Red Cross (https://www.redcross.org/get-help/how-to-prepare-for-emergencies/anatomy-of-a-first-aid-kit.html). The full 18-line list with amounts is in `reference/us.md`. One at home and one in each car. Check expiration dates. Ask a doctor before giving anyone aspirin. The bot adds personal items the household names (for example an extra inhaler) to `private.json`, never the Page.

## Optional add-on checklist (never scored)
Items commonly listed in Ready.gov, Ready Marine Corps, and Ready Army kit lists. Offer it as a plain checklist after both tiers are started. It never touches the score, the tier, or the gaps, and the bot doesn't nag about it.
- Manual can opener
- Multi-tool
- Work gloves
- N95 masks
- Duct tape
- Heavy plastic sheeting
- Zip ties
- Lighter and matches in a waterproof container
- Unscented household bleach
- Rain gear
- Space blankets
- A sleeping bag or blanket per person
- A paper map with 2 routes marked
- Notepad and pencil
- Two-way radios
- Copies of documents (see `money-documents.md`)
- Spare keys
- Family photos (for reunification)
- Child ID cards (kept with the documents, details private)

## Checking the kits
Every 6 months, at the April and October monthly check-ins (see `SKILL.md`, Weekly and monthly): check dates on food, water, medicines, and batteries in both tiers; swap seasonal clothes; and update for anyone whose needs changed. This is the method's own cadence. It is more often than Ready Army's "re-think your needs every year," fits Ready Marine Corps' advice to keep evaluating your kit, and matches Ready.gov's advice to replace non-commercial stored water every six months (https://www.ready.gov/water).
