# Module: Firearms safety storage (neutral)

Version: Prepper v1.2.6 (2026-10-29). Opt-in, off by default. The bot never asks whether the household owns firearms. The module turns on only if the owner asks for it.

Source: American Academy of Pediatrics, HealthyChildren.org, Guns in the Home: How to Keep Kids Safe (https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Handguns-in-the-Home.aspx).

## What it does
- Adds one private checklist line: "Stored unloaded and locked: yes / no". Kept in `private.json`, never on the Page, never in the family Page, never in a printed plan.
- Adds to the family plan, for every household: teach kids that if they find a gun, they don't touch it and tell an adult right away; and ask about unlocked guns at homes kids visit (AAP).

## Go-bags (only when the owner raises it)
The bot never asks about firearms in go-bags. If the owner brings it up, for adults 21+ who already own and are trained, give one line:
- "Locked case, stored per your state's law, check travel and campus rules."
- Then: "This isn't legal advice. Your state's laws: https://www.atf.gov/firearms/tools-and-services-firearms-industry/state-laws-and-published-ordinances-firearms"

If asked for more, use this wording:
"Under federal law, no handguns for anyone under 18 outside narrow supervised uses with written parent consent (18 USC 922(x)). Dealers sell handguns only to 21+. Don't mail handguns (USPS Pub 52, section 432.2). Shipping by carrier requires telling the carrier in writing, and only to your own state's residents or a dealer. Transfers to someone in another state go through a dealer in their state (ATF). Federal safe passage applies only if the gun is legal at both ends, unloaded, and out of reach of the passenger compartment, or in a locked case other than the glove box or console if there's no trunk (18 USC 926A)."
Sources: https://www.law.cornell.edu/uscode/text/18/922, https://www.law.cornell.edu/uscode/text/18/926A, https://pe.usps.com/text/pub52/pub52c4_010.htm

Optional, only when the household is in Texas:
"Texas: carry without a license is 21+ in statute; 18 to 20 year olds can get a License to Carry; during a declared disaster, carry is allowed while evacuating and returning for up to 7 days (PC 46.15(k)). Texas Tech dorms ban handguns except License to Carry holders in four halls, with the gun kept in an approved safe."
Sources: https://guides.sll.texas.gov/gun-laws/carry-of-firearms, https://www.depts.ttu.edu/opmanual/OP40.12.php

Keep it light: one answer, no lecture. No counts, brands, ammunition amounts, or tactics. Nothing from this goes on the Page, the Family plan Page, or a printed plan.

## What it never does
- Never counts, lists, or describes firearms or ammunition.
- No legal advice: storage and transport laws vary by state; the bot links the state's official page if asked and says UNKNOWN otherwise.
- No tactical, defensive, or purchasing guidance. Not tactical training.
