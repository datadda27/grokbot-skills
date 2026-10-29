# Module: Hazard modes

Version: Prepper v1.2.5 (2026-10-29). Turned on per hazard from the county's FEMA National Risk Index (NRI) ratings, never from guesses. The bot suggests modes for hazards rated Relatively High or Very High; the owner confirms.

Each mode adds a short checklist to the Page, a seasonal reminder, and the "Do now" lines the threat watch uses when that hazard's NWS watch or warning arrives. All steps are from the linked Ready.gov page.

## NRI hazards to modes, and reminder months
Reminder months are planning dates for the seasonal reminder and the do-it-now seasonal line, not forecasts; say "this is the usual time to get ready", never that the hazard is coming.
| NRI hazard names | Mode | Reminder month |
|---|---|---|
| Tornado | Tornado | March 1 (NOAA NSSL: tornadoes come mostly in spring and summer, earlier in the south) |
| Winter Weather, Cold Wave, Ice Storm | Winter storm | November 1 |
| Heat Wave | Extreme heat | June 1 |
| Hurricane | Hurricane | June 1 (Atlantic and Central Pacific); May 15 (Eastern Pacific), from the season dates below |
| Inland Flooding, Coastal Flooding | Flood | none fixed; use NWS watches and the check-in |
| Wildfire | Wildfire | none fixed; use NWS Red Flag Warnings and the check-in |
| Earthquake | Earthquake | none (no season) |
| Hail, Strong Wind, Lightning, Drought, others | no mode | none; their NWS warnings still reach the threat watch |
A hazard rated Relatively High or Very High gets its row's reminder. "In season" means from its reminder month through the next two months (hurricane: through November 30). If two land on the same 1st, send them as one seasonal message.

## Tornado (https://www.ready.gov/tornadoes)
Before:
- Sign up for the community warning system and learn what the local siren sounds like.
- Pick the shelter spot: a FEMA-criteria safe room or ICC 500 storm shelter if available; otherwise a small, interior, windowless room or basement on the lowest level.
- Practice going there (counts as a drill).
Do now (warning): go to the shelter spot, stay away from windows, cover your head and neck with your arms, and put materials like furniture and blankets around you.

## Flood (https://www.ready.gov/floods)
Before:
- Look up the home's flood risk on the FEMA Flood Map Service Center (https://msc.fema.gov/).
- Homeowner's policies do not cover floods; a new NFIP policy usually takes 30 days to start (https://www.floodsmart.gov/).
- Documents in a waterproof container, password-protected digital copies; move valuables higher; clear drains and gutters; consider a backflow (check) valve.
Do now (warning): Turn Around, Don't Drown. Just 6 inches of moving water can knock you down and 1 foot of moving water can sweep your vehicle away. Stay off bridges over fast-moving water. Evacuate if told to.

## Hurricane (https://www.ready.gov/hurricanes)
Season: Atlantic June 1 to November 30; Eastern Pacific May 15 to November 30; Central Pacific June 1 to November 30.
Before:
- Know the evacuation zone from the county or state (see `evacuation.md`). Storm surge is historically the leading cause of hurricane deaths.
- The FEMA App can send NWS alerts for up to five locations. WEA and EAS need no sign-up.
- Clear gutters, bring in outdoor furniture, charge phones and backup batteries.
Do now (warning): if you are in a mandatory evacuation zone and officials say evacuate, go immediately. If staying, take refuge in a designated storm shelter or an interior room for high winds; if trapped by flooding, go to the highest level, but do not climb into a closed attic. Never walk or drive through floodwater.

## Wildfire (https://www.ready.gov/wildfires)
Before:
- Create a fire-resistant zone at least 30 feet around the home, free of leaves, debris, and flammable materials.
- Have a garden hose long enough to reach any area of the home.
- Set up one room you can close off from outside air, with a portable air cleaner, for smoke days. The dashboard shows Open-Meteo air quality; official AQI is at https://www.airnow.gov/.
- Know the school and work evacuation plans.
Do now (warning or evacuation order): leave when told to; take the go-bags (if packed) and pets; on smoke days stay in the clean-air room and follow official air quality guidance.

## Winter storm (https://www.ready.gov/winter-weather)
Winter storms raise the risk of car accidents, hypothermia, frostbite, carbon monoxide poisoning, and heart attacks from overexertion. Warnings are usually issued 12 to 24 hours ahead; watches 12 to 48 hours ahead.
Before:
- Insulation, caulking, and weather stripping; learn how to keep pipes from freezing.
- Smoke and CO alarms with battery backups.
- Supplies for several days at home without power, including each person's medicine and pet needs; extra batteries for radios and flashlights.
- Car winter kit (see `kits.md`).
Do now (warning): find shelter right away; stay off roads; generators, grills, and camp stoves outside only, away from windows.

## Extreme heat (https://www.ready.gov/heat)
Extreme heat causes the most deaths of any weather-related hazard each year. Older adults, children, and people with certain illnesses are at greater risk.
Before:
- Learn the signs of heat illness. Do not rely on a fan as the main cooling; it does not lower body temperature.
- Find local cooling places (libraries, malls) or ask the local health department.
- Drapes or shades, weather-stripping, window reflectors. LIHEAP can help with cooling costs.
Do now (heat warning): never leave people or pets in a closed car; go to a cooling center if there's no air conditioning; cool showers; loose, light-colored clothing; use the oven less; check on older neighbors.

## Earthquake (https://www.ready.gov/earthquakes), offered where NRI rates it
Before: secure heavy items (bookcases, TVs) to walls; standard homeowner's insurance does not cover earthquake damage.
Do now (shaking): Drop, Cover, and Hold On. Stay inside; do not run outside or stand in a doorway. In bed, stay there and cover your head with a pillow. In a car, pull over and set the parking brake.
The threat watch shows USGS quakes as FYI only; there is no earthquake warning in this method.
