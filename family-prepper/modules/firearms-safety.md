# Module: Firearms safety storage (neutral)

Version: Prepper v1.2.3 (2026-10-29). Opt-in, off by default. The bot never asks whether the household owns firearms. The module turns on only if the owner asks for it.

Source: American Academy of Pediatrics, HealthyChildren.org, Guns in the Home: How to Keep Kids Safe (https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Handguns-in-the-Home.aspx).

## What it does
- Adds one private checklist line: "Stored unloaded and locked: yes / no". Kept in `private.json`, never on the Page, never in the family Page, never in a printed plan.
- Adds to the family plan, for every household: teach kids that if they find a gun, they don't touch it and tell an adult right away; and ask about unlocked guns at homes kids visit (AAP).

## What it never does
- Never counts, lists, or describes firearms or ammunition.
- No legal advice: storage and transport laws vary by state; the bot links the state's official page if asked and says UNKNOWN otherwise.
- No tactical, defensive, or purchasing guidance. Not tactical training.
