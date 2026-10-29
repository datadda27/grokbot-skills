# Country pack: United States

Version: Prepper v1.2.5 (2026-10-29)

Every number the bot quotes to a US household comes from this file, with its link. If a number is not here, the bot looks it up on an official page and cites it, or says UNKNOWN. Another country gets its own file (for example `uk.md`) with the same headings, so the method never changes when a country is added.

Checked against the live pages on 2026-10-26.

## Official sources (the only ones the bot leans on)
| Topic | Source | Link |
|---|---|---|
| Kit basics | Ready.gov Build a Kit | https://www.ready.gov/kit |
| Water storage | Ready.gov Water | https://www.ready.gov/water |
| Two-week home supply | American Red Cross | https://www.redcross.org/get-help/how-to-prepare-for-emergencies/survival-kit-supplies.html |
| First aid kit contents | American Red Cross | https://www.redcross.org/get-help/how-to-prepare-for-emergencies/anatomy-of-a-first-aid-kit.html |
| Disinfecting water | EPA | https://www.epa.gov/ground-water-and-drinking-water/emergency-disinfection-drinking-water |
| Fridge and freezer in an outage | FoodSafety.gov (USDA) | https://www.foodsafety.gov/food-safety-charts/food-safety-during-power-outage |
| Power outages, generators, CO | Ready.gov Power Outages | https://www.ready.gov/power-outages |
| Smoke alarms, fire escape | Ready.gov Home Fires | https://www.ready.gov/home-fires |
| Smoke alarm testing | U.S. Fire Administration | https://www.usfa.fema.gov/prevention/home-fires/prepare-for-fire/smoke-alarms/ |
| Alerts (WEA, EAS) | Ready.gov Alerts | https://www.ready.gov/alerts |
| NOAA Weather Radio | National Weather Service | https://www.weather.gov/nwr/ |
| Live weather alerts (free API) | NWS API | https://www.weather.gov/documentation/services-web-api |
| Local hazards by county | FEMA National Risk Index | https://hazards.fema.gov/nri/ |
| Family plan and wallet card | Ready.gov Make a Plan | https://www.ready.gov/plan |
| Evacuation | Ready.gov Evacuation | https://www.ready.gov/evacuation |
| Food | Ready.gov Food | https://www.ready.gov/food |
| Pets | Ready.gov Pets | https://www.ready.gov/pets |
| Car kit | Ready.gov Car Safety | https://www.ready.gov/car |
| Winter | Ready.gov Winter Weather | https://www.ready.gov/winter-weather |
| Heat | Ready.gov Extreme Heat | https://www.ready.gov/heat |
| Documents and money | Ready.gov Financial Preparedness (EFFAK) | https://www.ready.gov/financial-preparedness |
| Calorie planning figure | FDA | https://www.fda.gov/food/nutrition-facts-label/calories-nutrition-facts-label |
| Calorie needs by age | MyPlate (USDA) | https://www.myplate.gov/myplate-plan |
| Home canning | National Center for Home Food Preservation | https://nchfp.uga.edu/ |
| Flood maps | FEMA Flood Map Service Center | https://msc.fema.gov/portal/home |
| Help after a disaster | DisasterAssistance.gov | https://www.disasterassistance.gov/ |
| Evacuation zones (where a county uses it) | Genasys Protect | https://protect.genasys.com/ |

## Numbers (quote them with their source)
**Water**
- 1 gallon per person per day, for drinking and sanitation. (Ready.gov Water, Ready.gov Kit)
- Children, nursing mothers, and sick people may need more. In very hot weather, needs can double. (Ready.gov Water)
- Red Cross targets: a 3-day supply for evacuation and a 2-week supply for home. (Red Cross)
- So the 2-week target is 14 gallons per person, and 28 in a hot climate.
- Counting bottled water: a case of 24 half-liter (16.9 oz) bottles holds about 3.2 gallons (24 x 16.9 oz = 405.6 oz; a gallon is 128 oz). Count a case as 3 gallons, and a case of 35 bottles as about 4.6. Say the conversion in one short line. If the bottle size is unknown, ask once; if still unknown, use 3 gallons a case and say so.
- Replace water you bottled yourself every 6 months. Store-bought sealed water stays in its original container in a cool, dark place. (Ready.gov Water)
- Sanitize a food-grade container with 1 teaspoon of unscented bleach per quart of water before filling. (Ready.gov Water)
- Never ration drinking water unless officials say to. Drink what you need today. (Ready.gov Water)

**Making water safe** (EPA)
- Boil: a rolling boil for at least 1 minute. Above 5,000 feet, boil for 3 minutes.
- Unscented bleach, per gallon of clear water: 8 drops of 6% bleach, or 6 drops of 8.25% bleach.
- Double the amount if the water is cloudy, colored, or very cold.
- Stir and wait 30 minutes. It should smell slightly of chlorine. If not, repeat the dose and wait 15 more minutes.
- Use bleach stored at room temperature for less than a year.

**Food**
- Store at least a several-day supply of non-perishable food your family will eat, with special diets covered. (Ready.gov Food)
- Red Cross: a 2-week food supply at home.
- Planning figure: 2,000 calories per adult per day. The FDA uses 2,000 calories a day "as a general guide for nutrition advice"; real needs vary. (FDA)
- Children: the bot scales by age as a planning estimate (see Calculator). Real needs come from MyPlate's age chart. (MyPlate)
- Keep a manual can opener with the food. (Ready.gov Kit)

**Fridge and freezer in an outage** (FoodSafety.gov)
- A closed fridge keeps food safe up to 4 hours.
- A full freezer holds about 48 hours, a half-full one about 24 hours, if the door stays closed.
- Throw out perishables that sat at 40°F or above for more than 2 hours.
- Frozen food with ice crystals, or at 40°F or below, can be refrozen.
- Never taste food to test it. When in doubt, throw it out.

**Medications**
- Red Cross kit: a 7-day supply of medications plus medical items.
- Ask your doctor or pharmacist about an emergency supply and how long each medicine is safe at higher temperatures. (Ready.gov Power Outages)
- If the power is out more than a day, discard refrigerated medicine unless its label says otherwise, and call your doctor or pharmacist. (Ready.gov Power Outages)
- The bot never gives dosing advice.

**Smoke and CO alarms**
- Smoke alarms on every level, including the basement. Replace each unit every 10 years. Practice the fire escape plan twice a year, with two ways out of each room. (Ready.gov Home Fires)
- Test smoke alarms monthly. Replace 9-volt batteries at least once a year. (USFA)
- CO detectors with battery backup, in central locations on every level. (Ready.gov Power Outages)

**Generators, stoves, grills** (Ready.gov Power Outages)
- Outdoors only, at least 20 feet from windows, doors, and attached garages.
- Never heat the home with a gas stove or oven.
- Let a generator cool before refueling. Keep it dry.

**Light and power**
- A flashlight for every household member. Power banks for phones. (Ready.gov Power Outages)
- Plan for anyone who uses a power-dependent medical device or refrigerated medicine, with their medical provider. (Ready.gov Power Outages)

**Cars and evacuation**
- Keep at least a half tank of gas at all times, and a full tank when evacuation seems likely. (Ready.gov Evacuation)
- Most public shelters allow only service animals. Find a pet-friendly place ahead of time. (Ready.gov Evacuation)
- Six inches of moving water can make a car lose control; a foot can float many cars. (Ready.gov Car Safety)

**First aid kit, family of four** (Red Cross)
2 absorbent compress dressings (5 x 9 in), 25 adhesive bandages, 1 adhesive cloth tape (10 yd x 1 in), 5 antibiotic ointment packets, 5 antiseptic wipe packets, 2 packets of aspirin (81 mg), 1 emergency blanket, 1 breathing barrier with one-way valve, 1 instant cold compress, 2 pairs of nonlatex gloves, 2 hydrocortisone ointment packets, 1 gauze roll bandage (3 in), 1 roller bandage (4 in), 5 sterile gauze pads (3 x 3 in), 5 sterile gauze pads (4 x 4 in), a non-glass thermometer, 2 triangular bandages, tweezers, first aid instructions. Ask a doctor before giving anyone aspirin.

## Calculator (household targets)
Inputs: adults (14 and older), children by age band, pets, hot climate (yes/no).

| Who | Water per day | Food per day (planning estimate) |
|---|---|---|
| Adult or teen 14+ | 1 gal | 2,000 kcal |
| Child 9 to 13 | 1 gal | 1,700 kcal |
| Child 4 to 8 | 1 gal | 1,400 kcal |
| Child 1 to 3 | 1 gal | 1,000 kcal |
| Infant under 1 | 1 gal (household use) | formula or breast milk plan; never estimate |
| Pet | the vet's daily amount, or UNKNOWN | the pet's normal daily food |

- Water is not scaled down for children, because Ready.gov says children may need more. Hot climate doubles water.
- Child calorie numbers are planning estimates inside MyPlate's age ranges. Label them as estimates every time.
- Targets: 3 days (72 hours) and 14 days (2 weeks, the goal). An optional 30-day stretch is shown only when the owner asks, as a separate line that never changes the score. No 90-day tier.
- Example: 2 adults, kids 7 and 11, one dog, not hot. Water: 4 gal a day, so 12 gal for 3 days and 56 gal for 2 weeks, plus the dog's water. Food: 2,000 + 2,000 + 1,400 + 1,700 = 7,100 kcal a day, so 99,400 kcal for 2 weeks.
- Food on hand can be counted as calories (from labels) or as person-days of meals, whichever is easier for the household. Never make them weigh or log every can.

## Counting food from photos (low defaults)
Use the calories on the label when the photo shows them (calories per serving x servings per package). When it doesn't, use these planning defaults. They are deliberately low, below typical Nutrition Facts values for these items, so the count errs short, never long. Label them "estimated, counted low" every time.

| Item | Default per package |
|---|---|
| Chips, pretzels, or popcorn, regular bag (size unknown) | 500 kcal |
| Single-serve snack bag, granola bar, or snack cake | 100 kcal |
| Cookies or crackers, box or sleeve (size unknown) | 600 kcal |
| Side packet (rice, pasta, or potato mix) | 300 kcal |
| Fruit cup or applesauce cup | 50 kcal |
| Canned soup, chili, or stew (size unknown) | 200 kcal |
| Canned beans | 300 kcal |
| Canned vegetables or tomatoes | 80 kcal |
| Anything else shelf-stable with no label visible | 100 kcal |

- **Unknown package count:** count the fewest the photo clearly shows (a partly hidden row counts as the packages you can see), and a multipack of unknown size as 1 package. Say "counted low" on the confirm.
- Snacks and side packets always count toward food days at these values. Never leave them out.
- Not counted toward food days: fridge and freezer food (it goes on the "Use first in an outage" list), condiments, spices, baking basics such as flour, sugar, and cocoa, and soda or other sweet drinks. Say what was left out in one short line.
- Fridge and freezer food in an outage: a closed fridge about 4 hours, a full, closed freezer about 48 hours (FoodSafety.gov, above).

## Alerts and the honest limits
- Phone emergency alerts (Wireless Emergency Alerts) and a NOAA Weather Radio with tone alert come first. They are instant; the bot checks on a schedule and can be late. Say this in every alert.
- County alert signup: most counties run their own system (names vary). The bot finds the official county emergency management page and links it. It never guesses a system name.
- Evacuation zones: the county or state emergency management site is the source of truth. Some counties use Genasys Protect (https://protect.genasys.com/). Link whichever the county names.
- The NWS API (api.weather.gov) is free and needs no key; send a User-Agent naming the bot. Alerts for a point: `https://api.weather.gov/alerts/active?point=LAT,LON`.

## After a disaster
- Apply for federal help at https://www.disasterassistance.gov/ (or the FEMA App). Take photos of damage before cleanup when it is safe. (Ready.gov Financial Preparedness: document and insure your property)
- Never claim a program covers someone. Link it and let them check.
