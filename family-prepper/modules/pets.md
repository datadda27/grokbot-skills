# Module: Pets

Version: Prepper v1.2.7 (2026-10-30). Opt-in module, off by default. Loaded only when the owner turns it on.

Source: Ready.gov Pets (https://www.ready.gov/pets), Ready.gov Evacuation (https://www.ready.gov/evacuation), and CDC Pet Safety in Emergencies (https://www.cdc.gov/healthy-pets/emergency-preparedness/index.html).

## Setup (2 questions)
1. Which pets, how many, and any daily medicine or special food? (Medicine names go to `private.json`.)
2. How much food and water does each eat and drink a day? If they're not sure, the bot says "ask your vet" and marks pet water UNKNOWN. It never guesses a pet's water.

## Two kits (Ready.gov)
**Stay-home kit:** food for the household target (14 days) in an airtight, waterproof container; water for the same days; extra medicine; a vet-advised first aid kit; litter, pan, bags; a favorite toy or bedding.
**Go kit:** several days of food and water, bowls, leash or harness, carrier or crate, medicine, copies of vaccination and medical records in a waterproof bag, a current photo of you with your pet, your vet's number.

## Pet carry kit (one per pet, with the household's 72-hour carry kits)
Kept in the same known spot near an exit as the people's carry kits (see `kits.md`). Add these to the go kit above:
- A crate or sturdy carrier, ideally one per pet, labeled with the pet's name, your name, and your phone numbers. (Ready.gov Pets; CDC)
- A spare collar or harness, leash, and ID tag. (Ready.gov Pets: "a backup leash, collar and ID tag")
- The microchip number, kept on the owner's private card in `private.json`, never on the Page or the shared plan. (Ready.gov Pets: have your pet microchipped)
- Pet first aid kit (ask the vet what to include). (Ready.gov Pets)
- 2 weeks of the pet's regular medicine in a waterproof container, matching the household's 2-week goal; names and doses stay in `private.json`. (Ready.gov Pets: keep an extra supply of the medicine your pet takes)
- Waste bags (and litter and a small pan for cats). (Ready.gov Pets)
Like every kit, it's a checklist; it's named in roles and the printable plan only after the owner confirms it exists.

## The pet-friendly shelter flag
Most public shelters allow only service animals (Ready.gov Evacuation). During setup the bot asks the owner to name a pet-friendly place in each direction (a friend, family, or a hotel that takes pets) and shows "Pet-friendly place: set / not set" on the Page and the printable plan. The bot can search for pet-friendly lodging near an evacuation destination, but never books.

## Microchip and ID
Ask: is each pet microchipped, and is the chip registration current? Is there an ID tag with a phone number? Each is a yes / no / not sure checklist line. If the owner shares a microchip number, it goes in `private.json` only. (CDC: register the chip and keep your contact information current)

## Rotation
Pet food and medicine dates join the use-next queue, and both pet kits are part of the April and October kit check (see `kits.md`). Pet food counts in its own row, never in the household food days.

## Pets in hazard modes
- Heat: never leave a pet in a closed car (Ready.gov Heat).
- Evacuation: take pets with you (Ready.gov Evacuation).
