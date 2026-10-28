# Module: Pets

Version: Prepper v1.2.1 (2026-10-28). Opt-in module, off by default. Loaded only when the owner turns it on.

Source: Ready.gov Pets (https://www.ready.gov/pets) and Ready.gov Evacuation (https://www.ready.gov/evacuation).

## Setup (2 questions)
1. Which pets, how many, and any daily medicine or special food? (Medicine names go to `private.json`.)
2. How much food and water does each eat and drink a day? If they're not sure, the bot says "ask your vet" and marks pet water UNKNOWN. It never guesses a pet's water.

## Two kits (Ready.gov)
**Stay-home kit:** food for the household target (14 days) in an airtight, waterproof container; water for the same days; extra medicine; a vet-advised first aid kit; litter, pan, bags; a favorite toy or bedding.
**Go kit:** several days of food and water, bowls, leash or harness, carrier or crate, medicine, copies of vaccination and medical records in a waterproof bag, a current photo of you with your pet, your vet's number.

## The pet-friendly shelter flag
Most public shelters allow only service animals (Ready.gov Evacuation). During setup the bot asks the owner to name a pet-friendly place in each direction (a friend, family, or a hotel that takes pets) and shows "Pet-friendly place: set / not set" on the Page and the printable plan. The bot can search for pet-friendly lodging near an evacuation destination, but never books.

## Microchip and ID
Ask: is each pet microchipped, and is the chip registration current? Is there an ID tag with a phone number? Each is a yes / no / not sure checklist line.

## Rotation
Pet food and medicine dates join the use-next queue. Pet food counts in its own row, never in the household food days.

## Pets in hazard modes
- Heat: never leave a pet in a closed car (Ready.gov Heat).
- Evacuation: take pets with you (Ready.gov Evacuation).
