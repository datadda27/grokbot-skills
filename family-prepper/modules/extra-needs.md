# Module: Extra needs (babies, kids, older adults, disabilities, medical devices)

Version: Prepper v1.2.6 (2026-10-29). Opt-in module, off by default. Loaded only when the owner turns it on.

Sources: Ready.gov Build a Kit (https://www.ready.gov/kit), Ready.gov Power Outages (https://www.ready.gov/power-outages), Ready.gov Older Adults (https://www.ready.gov/older-adults), Ready.gov Disability (https://www.ready.gov/disability), Ready.gov Kids (https://www.ready.gov/kids), Ready.gov Heat (https://www.ready.gov/heat), CDC Power Sources (https://www.cdc.gov/prepare-your-health/take-action/power-sources.html).

All medical details live in `private.json`. The Page shows only plan status ("Device backup plan: set").

## Power-dependent medical devices (life safety)
- List each device by type only (for example "oxygen concentrator", "CPAP"), how long its backup lasts, and the plan if power is out longer.
- Talk to the medical provider about a power outage plan for the device and for refrigerated medicine. (Ready.gov Power Outages)
- Ask the utility whether it has a medical priority or medical needs list. (Many do; the bot finds the household's utility page and says UNKNOWN if none is listed.)
- If the power is out more than a day, discard refrigerated medicine unless the label says otherwise, and call the doctor or pharmacist. (Ready.gov Power Outages)
- This item gates the 72-hour tier when it applies.

### Device backup checklist
Setup learns only whether there is a device (yes or no). When it's yes, the bot offers this checklist; each line is done / open / not sure on the Page, with no device details.
- **A spare charged battery.** Buy an extra battery for a power wheelchair or other battery-powered device, and keep it charged. If buying one isn't possible, ask local agencies or charities that can help. (Ready.gov Disability, https://www.ready.gov/disability)
- **A car adapter.** Car chargers, power banks, and adapters for home-use medical equipment. (CDC Power Sources, https://www.cdc.gov/prepare-your-health/take-action/power-sources.html)
- **The utility's medical priority or medical certification list.** Ask the local electric utility for priority access when power restoration is life-sustaining for someone in the home. (Ready.gov Disability) The bot finds the household's utility page and links the sign-up form; it says UNKNOWN if none is listed and never signs up for the owner.
- **The device card** (below), printed and kept with the device.

### The device card (private, its own printout)
A small printout the owner keeps with the device and in the carry kit. Ready.gov Disability: keep model information and note where the equipment came from. Ready Army: have a list with the types and models of equipment, and make sure those around you know how to operate it (https://www.army.mil/ready).
- Device type, model, and serial number.
- How to run it on battery or the car adapter, in 3 to 5 plain steps the owner writes or confirms.
- How long the battery lasts.
- The supplier or equipment company's phone number, and who provides it (Medicare, Medicaid, private insurance).
- The prescribing doctor's office phone.
These details live only in `private.json`. The card is built as its own PDF on the box and handed to the owner. It never goes on the Page, the shared family plan, the printable fridge plan, a family text, or a shared draft. The Page shows only "Device backup plan: set" or "open".

## Babies and young kids
- Formula, bottles, diapers, wipes, and rash cream for the 14-day target. (Ready.gov Kit) Never estimate formula amounts; use what the family uses now.
- Activities for kids in the kit. (Ready.gov Kit)
- A family password and the meeting place, taught to kids. (Ready.gov Heat)
- School and daycare: ask the school's emergency plan and pickup rules; add them to the printable plan.

## Older adults, disabilities, mobility
- Create a support network of people who can help in a disaster, tell them where the supplies are, and consider giving one a house key. Keep the contact list in the kit or on your phone. (Ready.gov Disability)
- Extra glasses, hearing aid batteries, mobility aids, and a list of devices with model numbers (private; for a power-dependent device this is the device card above).
- Plan evacuation transport ahead if driving is not possible.
- In heat, check on older adults; know the nearest cooling center. (Ready.gov Heat)
