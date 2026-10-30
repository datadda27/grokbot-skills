#!/usr/bin/env python3
"""Run the paper binder against a fresh store and a store seeded with private bait.
File name: test_binder.py
Description: Checks build_binder.py prints a blank binder for an empty store and
drops private lines. Fails if household-specific leftovers are in the script.
"""
import json
import os
import pathlib
import re
import subprocess
import sys
import tempfile

HERE = pathlib.Path(__file__).resolve().parent
SCRIPT = HERE / "build_binder.py"
SOURCE = SCRIPT.read_text(encoding="utf-8")

# The script must not hardcode a household calorie total. National public
# lines (911, Poison Control) may stay. Personal names are not listed here.
BANNED_SOURCE = [
    "4 * 2000", "4*2000", "+ 1600", "+1600", "9,600", "9600", "DAILY_KCAL =",
]
problems = []
for token in BANNED_SOURCE:
    if token in SOURCE:
        problems.append("source still has %r" % token)
# 911 and 1-800-222-1222 are national public lines, not a household number.
phones = re.findall(r"\b\d{3}-\d{3}-\d{4}\b", SOURCE.replace("1-800-222-1222", ""))
if phones:
    problems.append("source has a personal-looking phone number: %s" % phones)

def run(store):
    out = subprocess.run(
        [sys.executable, str(SCRIPT), store, "--html-only"],
        check=True, capture_output=True, text=True,
    )
    html_path = pathlib.Path(out.stdout.strip().splitlines()[-1])
    return html_path.read_text(encoding="utf-8")

with tempfile.TemporaryDirectory() as tmp:
    empty = os.path.join(tmp, "empty")
    os.makedirs(empty)
    # Fresh household: files exist and are empty objects. No names, no counts.
    pathlib.Path(empty, "dashboard-data.json").write_text("{}", encoding="utf-8")
    pathlib.Path(empty, "inventory.json").write_text('{"lines": []}', encoding="utf-8")
    pathlib.Path(empty, "private.json").write_text(
        json.dumps({"medicines": ["amoxicillin"], "note": "HOUSEHOLD-SECRET-NAME"}),
        encoding="utf-8",
    )
    blank = run(empty)
    for token in BANNED_SOURCE + ["amoxicillin", "HOUSEHOLD-SECRET-NAME", "9600", "9,600"]:
        if token in blank:
            problems.append("empty binder printed %r" % token)
    if "No calorie total yet" not in blank:
        problems.append("empty binder assumed a calorie total")
    if "Fill bathtubs only if an official warning" not in blank:
        problems.append("empty binder missing the bathtub rule")
    if "half a tank" not in blank.lower() and "Half a tank" not in blank:
        problems.append("empty binder missing the half-tank habit")
    if "refill plan" not in blank.lower():
        problems.append("empty binder missing the prescription plan line")
    if "marineMindset" in blank or "PACE" in blank:
        problems.append("empty binder printed the Marine page while the option is off")

    bait = os.path.join(tmp, "bait")
    os.makedirs(bait)
    household = {
        "name": "Example Household",
        "place": "Anytown",
        "zip": "00000",
        "county": "Example County",
        "adults": 2,
        "kids": [{"ageBand": "4-8"}],
        "pets": [],
        "climateHot": False,
        "prepLevel": "basics",
        "marineMindset": False,
        "paperBinder": True,
    }
    pathlib.Path(bait, "dashboard-data.json").write_text(json.dumps({
        "household": household,
        "printPlan": {"meetingPlaces": {"nearHome": "the mailbox", "outOfNeighborhood": None, "outOfTown": None},
                      "outOfAreaContact": {"name": "Aunt Pat", "phone": "555-0100"},
                      "contacts": [], "utilities": [], "evacuation": {"five": [], "fifteen": [], "sixty": []}},
        "family": [],
    }), encoding="utf-8")
    pathlib.Path(bait, "inventory.json").write_text(json.dumps({"lines": [
        {"item": "Rice", "category": "food", "qty": 2, "unit": "lb", "perDayValue": 500, "status": "bought", "private": False},
        {"item": "Amoxicillin", "category": "meds", "qty": 30, "unit": "pills", "status": "bought", "private": True},
        {"item": "Rifle, sample-brand", "category": "other", "qty": 1, "unit": "each", "status": "bought"},
        {"item": "Ammo, 9mm", "category": "other", "qty": 50, "unit": "rounds", "status": "bought"},
        {"item": "Cash envelope", "category": "other", "qty": 1, "unit": "each", "status": "bought", "note": "private"},
        {"item": "Truck VIN 1HGCM82633A004352", "category": "other", "qty": 1, "unit": "each", "status": "bought"},
        {"item": "Water jugs", "category": "water", "qty": 6, "unit": "gal", "status": "bought"},
    ]}), encoding="utf-8")
    pathlib.Path(bait, "private.json").write_text(json.dumps({
        "neighborPlan": {"who": "neighbor-secret-name"},
        "medicines": ["lipitor"],
    }), encoding="utf-8")
    filled = run(bait)
    for token in ["Amoxicillin", "sample-brand", "Rifle", "9mm", "Ammo", "Cash envelope", "lipitor",
                  "neighbor-secret-name", "1HGCM82633A004352", "004352"]:
        if token.lower() in filled.lower():
            problems.append("bait leaked %r" % token)
    # 2 adults x 2000 + child 4-8 at 1400 = 5400, derived from the profile.
    if "5,400" not in filled and "5400" not in filled:
        problems.append("calorie total was not derived from the profile (expected 5400)")
    if "Rice" not in filled:
        problems.append("public food line was dropped")
    if "a few days (Basics)" not in filled:
        problems.append("Basics horizon missing")
    if "PACE" in filled:
        problems.append("Marine page printed while mindset is off")

    household["marineMindset"] = True
    household["prepLevel"] = "steady"
    pathlib.Path(bait, "dashboard-data.json").write_text(json.dumps({
        "household": household,
        "printPlan": {},
        "family": [],
    }), encoding="utf-8")
    marine = run(bait)
    if "PACE" not in marine:
        problems.append("Marine page missing when mindset is on")
    if "about 2 weeks (Steady)" not in marine:
        problems.append("Steady horizon missing")

if problems:
    print("FAIL")
    print("\n".join(problems))
    sys.exit(1)
print("binder checks passed")
