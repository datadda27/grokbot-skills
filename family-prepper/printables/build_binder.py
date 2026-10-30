#!/usr/bin/env python3
"""
File name: build_binder.py
Description: Opt-in paper go-bag binder for Prepper. Builds HTML from the
household store, then prints a PDF when Chrome or Chromium is available.
Features: cover, first-steps page, contacts, comms, stay-home and leave
plans, inventory, water and food worksheets, maintenance, blank private
pages, and an optional Marine-style page.
Constraints: reads dashboard-data.json and inventory.json only. Never opens
private.json. Never prints medicines, firearms, ammo, cash, VINs, street
addresses, or lines marked private. Calorie and water totals come from the
household profile. A missing or empty store still prints a blank binder.
Considerations: official numbers (1 gallon, bleach drops, fridge times) are
planning figures from public guidance, not a household. No names, places,
or counts are hardcoded.
"""
import datetime
import html
import json
import os
import re
import shutil
import subprocess
import sys

# Private and personal fields never go on a printed page.
PRIVATE_LINE = re.compile(
    r"medicin|prescription|\brx\b|firearm|ammunition|\bammo\b|\bguns?\b|"
    r"\brifles?\b|\bpistols?\b|shotgun|\bcash\b|\bvins?\b|"
    r"vehicle identification|\bserial\b",
    re.I,
)
STREET = re.compile(
    r"\b\d{1,6}\s+\S+\s+(st|street|ave|avenue|rd|road|dr|drive|ln|lane|"
    r"blvd|boulevard|way|ct|court)\b",
    re.I,
)
VIN_LIKE = re.compile(r"\b[A-HJ-NPR-Z0-9]{17}\b")
BAND_KCAL = {"14+": 2000, "14-17": 2000, "9-13": 1700, "4-8": 1400, "1-3": 1000, "0-1": None}
LEVEL_DAYS = {"basics": 3, "steady": 14, "serious": 30, "allin": 30}
LEVEL_LABEL = {
    "basics": "a few days (Basics)",
    "steady": "about 2 weeks (Steady)",
    "serious": "a month or more (Serious)",
    "allin": "long-term, one step at a time (All in)",
}
E = html.escape


def find_store(argv):
    """Store directory: an argument, PREPPER_STORE, or a folder that already has store files."""
    args = [a for a in argv[1:] if not a.startswith("--")]
    if args:
        return os.path.abspath(args[0])
    env = os.environ.get("PREPPER_STORE")
    if env:
        return os.path.abspath(env)
    cwd = os.getcwd()
    if _looks_like_store(cwd):
        return cwd
    parent = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if _looks_like_store(parent):
        return parent
    return cwd


def _looks_like_store(path):
    return os.path.exists(os.path.join(path, "dashboard-data.json")) or os.path.exists(
        os.path.join(path, "inventory.json")
    )


def load_json(path, default):
    if not os.path.exists(path):
        return default
    # private.json is never a source for this binder.
    if os.path.basename(path) == "private.json":
        return default
    with open(path, encoding="utf-8") as handle:
        data = json.load(handle)
    return data if data is not None else default


def public_text(value):
    """Plain text safe to print. Drops street addresses and private topics."""
    if value is None:
        return ""
    text = str(value).strip()
    if not text:
        return ""
    if PRIVATE_LINE.search(text) or STREET.search(text) or VIN_LIKE.search(text):
        return ""
    if "private" in text.lower():
        return ""
    return text


def is_private_line(line):
    if not isinstance(line, dict):
        return True
    if line.get("private"):
        return True
    blob = " ".join(str(line.get(key) or "") for key in ("item", "category", "note", "location", "unit"))
    if "private" in blob.lower():
        return True
    return bool(PRIVATE_LINE.search(blob) or VIN_LIKE.search(blob))


def daily_kcal(household):
    """Planning calories per day from adults and child age bands. None when the profile is empty."""
    if not isinstance(household, dict):
        return None, []
    adults = household.get("adults")
    kids = household.get("kids") or []
    if adults is None and not kids:
        return None, []
    total = 2000 * int(adults or 0)
    parts = []
    if int(adults or 0):
        count = int(adults)
        parts.append("%d adult%s x 2,000" % (count, "" if count == 1 else "s"))
    for kid in kids:
        band = kid.get("ageBand") if isinstance(kid, dict) else None
        kcal = BAND_KCAL.get(band)
        if kcal is None:
            parts.append("a child (%s): no calorie guess; use what the family uses now" % (band or "age not set"))
        else:
            total += kcal
            parts.append("child %s: %s planning calories" % (band, f"{kcal:,}"))
    if total <= 0:
        return None, parts
    return total, parts


def water_daily(household):
    """Gallons per day from people (1 each, or 2 in a hot climate) plus known pet gallons."""
    if not isinstance(household, dict):
        return None, None
    kids = household.get("kids") or []
    if household.get("adults") is None and not kids:
        return None, None
    people = int(household.get("adults") or 0) + len(kids)
    if people <= 0:
        people_gal = None
    else:
        people_gal = people * (2 if household.get("climateHot") else 1)
    pet_gal = 0.0
    pet_known = False
    for pet in household.get("pets") or []:
        if isinstance(pet, dict) and isinstance(pet.get("waterGalPerDay"), (int, float)):
            pet_gal += pet["waterGalPerDay"]
            pet_known = True
    return people_gal, (round(pet_gal, 2) if pet_known else None)


def person_label(member):
    if not isinstance(member, dict):
        return ""
    if member.get("ageBand") and not member.get("showName"):
        return public_text(member.get("pageLabel") or "Child")
    return public_text(member.get("name") or member.get("pageLabel") or "")


def box(text):
    return "<li><span class='cb'></span>%s</li>" % text


def checklist(items):
    return "<ul class='check'>" + "".join(box(item) for item in items) + "</ul>"


def blank_rows(cols, count, widths=None):
    head = "".join(
        "<th%s>%s</th>" % ((" style='width:%s'" % widths[i]) if widths else "", E(col))
        for i, col in enumerate(cols)
    )
    body = "".join("<tr>" + "".join("<td>&nbsp;</td>" for _ in cols) + "</tr>" for _ in range(count))
    return "<table class='grid'><thead><tr>%s</tr></thead><tbody>%s</tbody></table>" % (head, body)


def ruled(count):
    return "<div class='ruled'>" + "".join("<div class='line'></div>" for _ in range(count)) + "</div>"


def page(title, body, num=None, cls=""):
    badge = "<span class='secnum'>%s</span> " % E(str(num)) if num else ""
    return "<section class='page %s'><h1>%s%s</h1>%s</section>" % (cls, badge, E(title), body)


def kv_row(label, value):
    shown = public_text(value) if value else ""
    cell = E(shown) if shown else "<span class='fill'></span>"
    return "<tr><th>%s</th><td>%s</td></tr>" % (E(label), cell)


def clean_item(name):
    text = public_text(name)
    if not text:
        return ""
    return re.split(r" \(", text)[0].strip().rstrip(".")


def build(store):
    dash = load_json(os.path.join(store, "dashboard-data.json"), {})
    inv_raw = load_json(os.path.join(store, "inventory.json"), {})
    if not isinstance(dash, dict):
        dash = {}
    lines = inv_raw.get("lines") if isinstance(inv_raw, dict) else inv_raw
    if not isinstance(lines, list):
        lines = []
    household = dash.get("household") if isinstance(dash.get("household"), dict) else {}
    plan = dash.get("printPlan") if isinstance(dash.get("printPlan"), dict) else {}
    family = dash.get("family") if isinstance(dash.get("family"), list) else []
    level = household.get("prepLevel") or ""
    horizon = LEVEL_DAYS.get(level)
    if horizon is None:
        targets = dash.get("targets") if isinstance(dash.get("targets"), dict) else {}
        horizon = targets.get("days") if isinstance(targets.get("days"), int) else None
    level_words = LEVEL_LABEL.get(level, "the horizon you chose")
    marine = bool(household.get("marineMindset"))
    kcal, kcal_parts = daily_kcal(household)
    people_gal, pet_gal = water_daily(household)
    today = datetime.date.today().strftime("%b %d, %Y").replace(" 0", " ")
    as_of = public_text(dash.get("asOfLabel")) or "not counted yet"
    title_name = public_text(household.get("name")) or "Household"

    safe_lines = [line for line in lines if isinstance(line, dict) and not is_private_line(line)]
    onhand = [line for line in safe_lines if line.get("status") in ("bought", "owned")]
    arriving = [line for line in safe_lines if line.get("status") == "in cart"]

    def food_kcal(rows):
        total = 0
        for line in rows:
            if line.get("category") != "food":
                continue
            qty = line.get("qty") or 0
            each = line.get("perDayValue") or 0
            if isinstance(qty, (int, float)) and isinstance(each, (int, float)):
                total += qty * each
        return total

    kcal_on = food_kcal(onhand)
    kcal_arr = food_kcal(arriving)

    pages = []
    cover_rows = "".join([
        kv_row("Home area", ", ".join(bit for bit in (public_text(household.get("place")), public_text(household.get("county"))) if bit) or None),
        kv_row("ZIP (no street address)", household.get("zip")),
        kv_row("Horizon", level_words),
        kv_row("People", _people_blurb(household, family)),
        kv_row("Pets", _pets_blurb(household)),
        kv_row("Printed", "%s. Supplies as of %s. Reprint when the plan changes." % (today, as_of)),
    ])
    marine_line = ""
    if marine:
        marine_line = (
            "<p>Planning style: self-reliant for this horizon. PACE, a rally point, "
            "drills, a watch rotation, and a few notes after. No rank, no fear.</p>"
        )
    pages.append(
        "<section class='page cover'>"
        "<div class='covertitle'>%s<br>Emergency binder</div>"
        "<div class='coversub'>Run the plan on paper. No power, phone, or internet needed.</div>"
        "<table class='kv big'>%s</table>%s"
        "<div class='note'>Keep one copy in the go bag and one with important papers. "
        "Write updates in pen. Private pages (medicines, firearms, cash) are blank on purpose: "
        "fill them in by hand only. A neighbor check-in, if you opted in, stays off this binder.</div>"
        "<h2>What is inside</h2>"
        "<ol class='toc'><li>If you only read one page</li><li>Contacts and meeting points</li>"
        "<li>Comms</li><li>Stay-home plan</li><li>Leave plan</li><li>Inventory snapshot</li>"
        "<li>Paper worksheets</li><li>First aid quick card</li><li>Maintenance</li><li>Sources</li></ol>"
        "<p><b>P.</b> Private pages, fill in by hand (after Section 9)</p>"
        "</section>" % (E(title_name), cover_rows, marine_line)
    )

    water_line = "Use stored water first. Plan on about 1 gallon per person per day (Ready.gov), more in heat."
    if people_gal:
        extra = ""
        if pet_gal:
            extra = " Pets add about %s gal from the profile." % pet_gal
        water_line = "Use stored water first. About %s gal a day for people%s, plus pets if you wrote a vet amount." % (
            people_gal, extra if not pet_gal else "",
        )
        if pet_gal:
            water_line = "Use stored water first. About %s gal a day for people, plus about %s gal for pets (from the profile)." % (
                people_gal, pet_gal
            )
    pages.append(page("If you only read one page", checklist([
        "<b>Get safe.</b> Follow the hazard's official step: shelter for a tornado warning, get out for fire or a gas smell, and do not drive into flood water.",
        "<b>Check official sources before you act.</b> NWS, local emergency management, and FEMA or Ready.gov. Phone alerts and a NOAA Weather Radio are faster than this page.",
        "<b>Count heads,</b> including pets. Then decide to stay or go using Section 5. If officials order you to leave, go.",
        "<b>Text the out-of-area check-in</b> where you are and that you are OK. Texts often get through when calls do not.",
        "<b>Water.</b> %s Fill bathtubs only if an official warning is active (NWS or local emergency management). That is not a routine step." % water_line,
        "<b>Power.</b> Keep the fridge and freezer closed. Charge phones while you can. Generators stay outside, 20 feet or more from doors and windows.",
        "<b>Prescriptions.</b> Grab essential prescriptions and glasses. Keep a refill plan. No medicine names are printed here. Ask a pharmacist or doctor. Details stay on the private page.",
        "<b>Vehicles.</b> Keep a gas tank at half or more. Before a forecast event, charge an EV to a sensible level, not a rule to sit at 100% every day.",
        "<b>Utilities.</b> Shut off gas only if you smell or hear gas. Know where the water and electric shutoffs are (Section 4).",
        "<b>One step.</b> On a quiet weekend, do one small step from Section 9, sized to your level and budget. Not this whole binder in a day.",
    ]) + "<h3>Notes and times (write here)</h3>" + ruled(5), "1"))

    pages.append(page("Contacts and meeting points", _contacts_html(plan, family), "2"))
    pages.append(page("Official and service numbers", _numbers_html(), "2"))
    pages.append(page("Comms", _comms_html(marine), "3"))
    pages.append(page("Stay-home plan", _stay_html(plan), "4"))
    pages.append(page("Leave plan: stay or go", _leave_html(plan), "5"))
    pages.append(page("Inventory snapshot", _inventory_html(onhand, arriving), "6", "inventory"))
    pages.append(page("Worksheet: water", _water_sheet(people_gal, pet_gal, horizon, onhand), "7", "ws"))
    pages.append(page("Worksheet: food", _food_sheet(kcal, kcal_parts, kcal_on, kcal_arr, horizon, onhand, arriving), "7", "ws"))
    pages.append(page("Worksheet: fuel, power, and making water safe", _other_sheets(), "7", "ws"))
    pages.append(page("First aid quick card", _first_aid(), "8"))
    pages.append(page("Maintenance", _maintenance(marine), "9"))
    if marine:
        pages.append(page("Planning card (optional style)", _marine_page(), "9"))
    pages.append(page("Medicines (fill in by hand)", "<p>Write by hand only. Do not type medicine names into the bot's files for this page. Keep a refill plan for essential prescriptions. No doses are printed here.</p>" + blank_rows(["Person", "Medicine (by hand)", "Needs cold? (Y/N)", "Amount on hand", "Refill date"], 12, ["16%", "28%", "16%", "20%", "20%"]), "P", "private"))
    pages.append(page("Firearms (fill in by hand)", "<p>Write by hand only. This page stays out of any shared plan. Store firearms locked, and follow the law where you live. This page is not legal advice.</p>" + ruled(18), "P", "private"))
    pages.append(page("Cash on hand (fill in by hand)", "<p>Write by hand only. Small bills help when card readers are down. No amount is printed here.</p>" + blank_rows(["Date", "Where kept", "Amount (by hand)", "Left"], 10), "P", "private"))
    pages.append(page("Sources", _sources(), "10"))

    css = """
@page { size: Letter; margin: 0.55in 0.6in 0.6in 0.6in;
  @bottom-center { content: "Household emergency binder  |  page " counter(page); font-size: 10pt; color:#444; } }
* { box-sizing: border-box; }
body { font-family: "DejaVu Sans", "Liberation Sans", Arial, sans-serif; font-size: 12.5pt; line-height: 1.32; color: #000; margin:0; }
section.page { page-break-after: always; break-after: page; }
section.page:last-child { page-break-after: auto; }
h1 { font-size: 20pt; margin: 0 0 8px 0; padding-bottom: 4px; border-bottom: 3px solid #000; }
h2 { font-size: 15pt; margin: 12px 0 5px 0; }
h3 { font-size: 13pt; margin: 10px 0 4px 0; }
p { margin: 4px 0 6px 0; }
.secnum { display:inline-block; background:#000; color:#fff; padding: 0 9px; border-radius: 4px; margin-right: 4px; }
.small { font-size: 10.5pt; color: #222; }
ul.check { list-style: none; padding-left: 0; margin: 4px 0; }
ul.check li { position: relative; padding-left: 30px; margin: 6px 0; }
.cb { display:inline-block; width: 17px; height: 17px; border: 2px solid #000; border-radius: 2px; }
ul.check li .cb { position: absolute; left: 0; top: 2px; }
table { border-collapse: collapse; width: 100%; margin: 4px 0 8px 0; }
table.grid th, table.grid td { border: 1.3px solid #000; padding: 4px 6px; vertical-align: top; text-align: left; }
table.grid th { background: #e6e6e6; }
table.grid td { height: 26px; }
table.kv th { text-align: left; width: 36%; padding: 5px 8px; border: 1.3px solid #000; background:#f0f0f0; vertical-align: top; }
table.kv td { padding: 5px 8px; border: 1.3px solid #000; }
table.kv.big th, table.kv.big td { font-size: 13pt; padding: 6px 8px; }
.fill { display:inline-block; min-width: 40%; border-bottom: 1px solid #000; }
.formula { border: 3px solid #000; padding: 8px 12px; font-size: 14pt; font-weight: bold; margin: 4px 0 8px 0; background: #f3f3f3; }
.ruled .line { border-bottom: 1.2px solid #555; height: 28px; }
.covertitle { font-size: 32pt; font-weight: bold; line-height: 1.1; margin: 20px 0 8px 0; border-bottom: 5px solid #000; padding-bottom: 10px; }
.coversub { font-size: 15pt; margin-bottom: 14px; }
.note { border: 2px dashed #000; padding: 8px 12px; margin: 10px 0; }
ol.toc { font-size: 13pt; }
ol.src li { margin: 2px 0; font-size: 10pt; word-break: break-all; }
section.private h1 { border-bottom-style: double; border-bottom-width: 6px; }
"""
    doc = (
        "<!DOCTYPE html><html><head><meta charset='utf-8'><title>%s emergency binder</title><style>%s</style></head><body>%s</body></html>"
        % (E(title_name), css, "".join(pages))
    )
    if "\u2014" in doc or "\u2013" in doc:
        raise SystemExit("em or en dash found in binder")
    out_dir = os.path.join(store, "printables")
    os.makedirs(out_dir, exist_ok=True)
    html_path = os.path.join(out_dir, "prepper-paper-binder.html")
    with open(html_path, "w", encoding="utf-8") as handle:
        handle.write(doc)
    pdf_path = os.path.join(out_dir, "prepper-paper-binder.pdf")
    if "--html-only" in sys.argv:
        print(html_path)
        return html_path
    browser = shutil.which("google-chrome") or shutil.which("google-chrome-stable") or shutil.which("chromium") or shutil.which("chromium-browser")
    if not browser:
        print(html_path)
        print("PDF skipped: no Chrome or Chromium on PATH", file=sys.stderr)
        return html_path
    subprocess.run(
        [browser, "--headless=new", "--no-sandbox", "--disable-gpu", "--no-pdf-header-footer",
         "--print-to-pdf=%s" % pdf_path, "file://" + html_path],
        check=True, capture_output=True,
    )
    print(html_path, pdf_path)
    return html_path


def _people_blurb(household, family):
    bits = []
    if household.get("adults") is not None:
        bits.append("%s adults" % household.get("adults"))
    kids = household.get("kids") or []
    if kids:
        bits.append("%s children by age band" % len(kids))
    labels = [person_label(member) for member in family]
    labels = [label for label in labels if label]
    if labels:
        bits.append(", ".join(labels))
    return "; ".join(bits) if bits else None


def _pets_blurb(household):
    pets = []
    for pet in household.get("pets") or []:
        if not isinstance(pet, dict):
            continue
        kind = public_text(pet.get("kind"))
        name = public_text(pet.get("name"))
        if kind or name:
            pets.append(" ".join(bit for bit in (kind, name) if bit))
    return ", ".join(pets) if pets else None


def _contacts_html(plan, family):
    rows = []
    for member in family:
        label = person_label(member)
        role = public_text(member.get("role") if isinstance(member, dict) else "")
        if not label and not role:
            continue
        rows.append("<tr><td>%s</td><td>%s</td><td></td></tr>" % (E(label), E(role)))
    contact_rows = "".join(rows) if rows else "<tr><td>&nbsp;</td><td></td><td></td></tr>" * 4
    ooa = plan.get("outOfAreaContact") if isinstance(plan.get("outOfAreaContact"), dict) else {}
    places = plan.get("meetingPlaces") if isinstance(plan.get("meetingPlaces"), dict) else {}
    return (
        "<table class='grid'><thead><tr><th style='width:28%%'>Person</th><th>Job in an emergency</th>"
        "<th style='width:30%%'>Phone (write in)</th></tr></thead><tbody>%s</tbody></table>"
        "<h2>Out-of-area check-in</h2>"
        "<p>Everyone texts this one person after anything big. Local lines can jam, but a long-distance text often gets through. (Ready.gov Make a Plan)</p>"
        "<table class='kv'>%s%s%s</table>"
        "<h2>Meeting places</h2><table class='kv'>%s%s%s%s</table>"
        "<h2>Other people (fill in)</h2>%s"
    ) % (
        contact_rows,
        kv_row("Who", ooa.get("name")),
        "<tr><th>Phone</th><td class='fill'></td></tr>",
        "<tr><th>Backup person and phone</th><td></td></tr>",
        kv_row("Near home", places.get("nearHome")),
        kv_row("Out of the neighborhood", places.get("outOfNeighborhood")),
        kv_row("Out of town", places.get("outOfTown")),
        kv_row("Shelter spot", plan.get("shelterSpot")),
        blank_rows(["Name", "Phone", "Relation / town"], 4, ["35%", "30%", "35%"]),
    )


def _numbers_html():
    rows = [
        ("Emergency (police, fire, ambulance)", "911"),
        ("Poison Control (24/7, national, free)", "1-800-222-1222"),
        ("Local emergency management", ""),
        ("Electric provider (outages)", ""),
        ("Gas provider (get out first if you smell gas)", ""),
        ("Water utility (boil notices)", ""),
        ("Doctor or clinic", ""),
        ("Pharmacy", ""),
        ("Veterinarian", ""),
        ("Insurance (home, auto)", ""),
    ]
    body = "".join("<tr><td>%s</td><td>%s</td></tr>" % (E(name), E(number) if number else "") for name, number in rows)
    return (
        "<table class='grid'><thead><tr><th>Who</th><th style='width:42%%'>Number</th></tr></thead><tbody>%s</tbody></table>"
        "<p class='small'>911 and Poison Control are national public lines. Write local numbers from the provider's own site. "
        "No street address is printed.</p>" % body
    )


def _comms_html(marine):
    pace = ""
    if marine:
        pace = (
            "<h2>PACE (primary, alternate, contingency, emergency)</h2>"
            "<table class='kv'><tr><th>Primary</th><td>Cell phone and text</td></tr>"
            "<tr><th>Alternate</th><td>Out-of-area text</td></tr>"
            "<tr><th>Contingency</th><td>NOAA Weather Radio</td></tr>"
            "<tr><th>Emergency</th><td class='fill'>Family radio, if you have one</td></tr></table>"
        )
    return (
        "<h2>NOAA Weather Radio</h2>"
        "<p>Look up your county's station and SAME code at weather.gov/nwr and write them here. "
        "No station is assumed.</p>"
        "<table class='kv'><tr><th>Frequency</th><td class='fill'></td></tr>"
        "<tr><th>SAME county code</th><td class='fill'></td></tr>"
        "<tr><th>Battery type and last changed</th><td class='fill'></td></tr></table>"
        "%s"
        "<h2>Family radio (write in)</h2>"
        "<table class='kv'><tr><th>Main channel</th><td class='fill'></td></tr>"
        "<tr><th>Backup channel</th><td class='fill'></td></tr>"
        "<tr><th>Code word for come home</th><td class='fill'></td></tr>"
        "<tr><th>Code word for all OK</th><td class='fill'></td></tr></table>"
        % pace
        + checklist([
            "Weather radio on, in alert mode, during an event.",
            "If someone misses two check-ins, go to the near-home meeting place, then the out-of-neighborhood place.",
            "A short radio test once a month is enough.",
        ])
    )


def _stay_html(plan):
    utils = plan.get("utilities") if isinstance(plan.get("utilities"), list) else []
    body = ""
    if utils:
        body = "".join(
            "<tr><td>%s</td><td>%s</td></tr>" % (E(public_text(row.get("what"))), E(public_text(row.get("where"))))
            for row in utils if isinstance(row, dict)
        )
    else:
        body = "<tr><td>Gas</td><td></td></tr><tr><td>Water</td><td></td></tr><tr><td>Electric</td><td></td></tr>"
    return (
        "<h2>Utility shutoffs (write the spot)</h2>"
        "<table class='grid'><thead><tr><th style='width:24%%'>Utility</th><th>Where</th></tr></thead><tbody>%s</tbody></table>"
        "<p>Shut off gas only if you smell or hear it. Once off, only the gas company turns it back on. "
        "Never touch the electric panel while standing in water.</p>"
        % body
        + "<h2>Heat and sanitation</h2>"
        + checklist([
            "Pick one warm room. Layers, hats, and sleeping bags. Never use a camp stove, grill, or generator indoors.",
            "Bucket toilet: line a 5 gallon bucket with two bags, add a scoop of cat litter after each use, and store sealed bags outside until pickup returns.",
            "Fridge about 4 hours and a full freezer about 48 hours if the door stays closed (FoodSafety.gov). Shelf-stable food last.",
        ])
    )


def _leave_html(plan):
    evac = plan.get("evacuation") if isinstance(plan.get("evacuation"), dict) else {}
    def items(key, fallback):
        raw = evac.get(key) if isinstance(evac.get(key), list) else []
        cleaned = [public_text(item) for item in raw]
        cleaned = [item for item in cleaned if item]
        return cleaned or fallback
    five = items("five", ["People and pets", "Phones, wallet, keys, shoes"])
    fifteen = items("fifteen", ["Prescriptions and glasses (no names on this page)", "Documents", "Pet supplies"])
    sixty = items("sixty", ["Leave a note: when and where", "Follow official routes"])
    def col(lines):
        return "<br>".join(E(line) for line in lines)
    places = plan.get("meetingPlaces") if isinstance(plan.get("meetingPlaces"), dict) else {}
    return (
        checklist([
            "Go if officials order an evacuation, or home is unsafe.",
            "Stay if home is safe and officials have not ordered you out, and you still have water, food, and any needed backup power.",
            "Do not drive into flood water.",
        ])
        + "<h2>5, 15, and 60 minutes</h2>"
        + "<table class='grid'><thead><tr><th>5 minutes</th><th>15 minutes</th><th>60 minutes</th></tr></thead><tbody><tr><td>%s</td><td>%s</td><td>%s</td></tr></tbody></table>"
        % (col(five), col(fifteen), col(sixty))
        + "<h2>Routes (write in)</h2><table class='kv'>%s%s</table>"
        % (kv_row("Out of town meeting place", places.get("outOfTown")),
           "<tr><th>Primary roads</th><td></td></tr><tr><th>Alternate roads</th><td></td></tr>")
        + "<p class='small'>Write routes from a paper map. No route is assumed. Half a tank or more before you go. "
        "For an EV, a sensible charge before a forecast event, and stops you write in yourself.</p>"
        + blank_rows(["Leg (from, to)", "Miles", "Start charge or fuel", "OK?"], 4)
    )


def _inventory_html(onhand, arriving):
    cats = [
        ("water", "Water"), ("food", "Food"), ("cooking", "Cooking"), ("sanitation", "Sanitation"),
        ("firstaid", "First aid (no medicines)"), ("light", "Light and batteries"), ("comms", "Comms"),
        ("heat", "Warmth"), ("safety", "Safety"), ("pets", "Pets"), ("storage", "Storage"), ("other", "Other"),
    ]

    def table(rows):
        body = []
        for line in rows:
            item = clean_item(line.get("item"))
            if not item:
                continue
            qty = line.get("qty")
            qty_txt = "" if qty is None else "%s %s" % (qty, public_text(line.get("unit")))
            body.append("<tr><td>%s</td><td>%s</td><td>%s</td><td></td></tr>" % (
                E(item), E(qty_txt.strip()), E(public_text(line.get("location")))))
        if not body:
            return "<p>Nothing logged in this group.</p>"
        return (
            "<table class='grid'><thead><tr><th>Item</th><th style='width:18%%'>Qty</th>"
            "<th style='width:22%%'>Where</th><th style='width:16%%'>Count today</th></tr></thead><tbody>%s</tbody></table>"
            % "".join(body)
        )

    blocks = []
    for key, label in cats:
        rows = [line for line in onhand if line.get("category") == key]
        if rows:
            blocks.append("<h2>%s</h2>%s" % (E(label), table(rows)))
    intro = "<p>On hand means bought or already owned. Private lines are left off. Write today's count in the last column.</p>"
    if not blocks:
        intro += "<p>Nothing logged yet. Write what you have below.</p>" + blank_rows(["Item", "Qty", "Where"], 8, ["50%", "20%", "30%"])
    arr_body = []
    for line in arriving:
        item = clean_item(line.get("item"))
        if not item:
            continue
        arr_body.append("<tr><td><span class='cb'></span></td><td>%s</td><td>%s</td></tr>" % (
            E(item), E(("%s %s" % (line.get("qty") or "", public_text(line.get("unit")))).strip())))
    arriving_html = ""
    if arr_body:
        arriving_html = (
            "<h2>In cart (not counted until home)</h2><table class='grid'><thead><tr><th style='width:8%%'>Got</th>"
            "<th>Item</th><th style='width:20%%'>Qty</th></tr></thead><tbody>%s</tbody></table>" % "".join(arr_body)
        )
    return intro + "".join(blocks) + arriving_html


def _water_sheet(people_gal, pet_gal, horizon, onhand):
    gallons = 0.0
    have = False
    for line in onhand:
        if line.get("category") != "water":
            continue
        qty = line.get("qty")
        if isinstance(qty, (int, float)):
            gallons += qty
            have = True
    daily = None
    if people_gal is not None:
        daily = people_gal + (pet_gal or 0)
    formula = "<div class='formula'>Days of water = gallons on hand / gallons per day</div>"
    note = "<p>1 gallon per person per day for drinking and sanitation (Ready.gov). Children, nursing mothers, sick people, and hot weather may need more. Pets: the vet's amount, or leave it blank.</p>"
    if daily and have:
        days = gallons / daily if daily else 0
        example = (
            "<h2>From your profile and inventory</h2><table class='grid'><tr><td>Gallons on hand (bought water lines)</td><td>%s</td></tr>"
            "<tr><td>Gallons per day</td><td>%s</td></tr><tr><td>Days</td><td>about %s</td></tr></table>"
            % (round(gallons, 1), round(daily, 2), round(days, 1))
        )
    else:
        example = "<p>No water total yet. Write gallons on hand and people below. Nothing is assumed.</p>"
    horizon_line = "<p>Horizon for this household: %s.</p>" % (("%s days" % horizon) if horizon else "not set. A few days is enough until you choose.")
    return formula + note + horizon_line + example + blank_rows(["Date", "Gal at start", "Gal used", "Gal at end", "Days left"], 10)


def _food_sheet(kcal, kcal_parts, kcal_on, kcal_arr, horizon, onhand, arriving):
    formula = "<div class='formula'>Days of food = calories on hand / calories per day</div>"
    note = (
        "<p>Planning figure: 2,000 calories per adult per day (FDA, a general guide, not diet advice). "
        "Child bands use the method's planning estimates (1,700 for 9 to 13, 1,400 for 4 to 8, 1,000 for 1 to 3). "
        "Infants are not guessed. The daily total is computed from the household profile. Dog food is separate.</p>"
    )
    if kcal:
        parts = "; ".join(kcal_parts)
        days_on = (kcal_on / kcal) if kcal else 0
        days_all = ((kcal_on + kcal_arr) / kcal) if kcal else 0
        example = (
            "<h2>From your profile</h2><p>%s = <b>%s calories a day</b>.</p>"
            "<table class='grid'><tr><td>Calories on hand (bought food lines)</td><td>%s</td></tr>"
            "<tr><td>Days on hand</td><td>about %s</td></tr>"
            "<tr><td>Days if in-cart food is home too</td><td>about %s</td></tr></table>"
            % (E(parts), f"{kcal:,}", f"{round(kcal_on):,}", round(days_on, 1), round(days_all, 1))
        )
    else:
        example = "<p>No calorie total yet. Add adults and child age bands, then reprint. No daily total is assumed.</p>"
    horizon_line = "<p>Suggested horizon: %s. Buy a little of foods you already eat. One step per weekend.</p>" % (
        ("%s days" % horizon) if horizon else "a few days until you choose a level"
    )
    lookup_rows = []
    for line in onhand + arriving:
        if line.get("category") == "food" and line.get("perDayValue"):
            item = clean_item(line.get("item"))
            if item:
                lookup_rows.append("<tr><td>%s</td><td>%s</td><td>%s</td></tr>" % (
                    E(item), E(public_text(line.get("unit"))), f"{line['perDayValue']:,}"))
    lookup = ""
    if lookup_rows:
        lookup = (
            "<h2>Calorie lookup (from your inventory, estimates)</h2>"
            "<table class='grid'><thead><tr><th>Item</th><th>Per</th><th>Calories</th></tr></thead><tbody>%s</tbody></table>"
            % "".join(lookup_rows)
        )
    return formula + note + horizon_line + example + lookup + blank_rows(["Date", "What we ate", "Calories used", "Calories left"], 8)


def _other_sheets():
    return (
        "<h2>Propane (estimate, time your own stove)</h2>"
        "<p>A 1 lb cylinder is roughly 1 to 2 hours depending on the burner. Write your own time after the first cylinder. Outdoors only.</p>"
        + blank_rows(["Date", "Cylinder", "Hours", "Full left"], 5)
        + "<h2>Battery power</h2>"
        "<div class='formula'>Hours = watt-hours x 0.85 / device watts</div>"
        "<p>Read watts on the device label. The 0.85 is inverter loss. No device is assumed, and no watt number is filled in for you.</p>"
        + blank_rows(["Device (by hand)", "Watts", "Hours a day", "Watt-hours"], 5)
        + "<h2>Making water safe</h2>"
        "<p>Unscented household bleach, less than a year old (EPA). Clear water, per gallon: 8 drops of 6% bleach, or 6 drops of 8.25%. "
        "Double that if the water is cloudy, colored, or very cold. Stir and wait 30 minutes.</p>"
        "<p>Boil: a rolling boil for 1 minute. Above 5,000 feet, boil 3 minutes (EPA).</p>"
        "<p>Most portable filters do not remove viruses. After filtering, disinfect or boil (CDC).</p>"
    )


def _first_aid():
    return checklist([
        "Stay safe, then call 911.",
        "Press hard on severe bleeding with gauze or a clean cloth. Pack a deep wound if pressure is not enough.",
        "A tourniquet on an arm or leg goes 2 to 3 inches above the wound, not on a joint. Write the time. Do not loosen it.",
        "Poison: call Poison Control, 1-800-222-1222. Collapse, a seizure, or trouble breathing: call 911.",
        "No medicine doses are printed here. Follow the label or a doctor or pharmacist.",
    ]) + "<h3>Injury log</h3>" + blank_rows(["Date / time", "Who", "What happened", "What we did"], 4)


def _maintenance(marine):
    drill = "A short drill twice a year: meeting place, then shutoffs."
    if marine:
        drill = "A short drill: walk to the rally point, then three lines of notes after. Add a watch rotation only for a long event."
    return (
        "<p>Do one small step per weekend. This list is the menu, not one day's work. Match the step to your level and budget.</p>"
        "<h2>Weekly</h2>" + checklist([
            "Glance at the official forecast (NWS) for the week ahead.",
            "Vehicles at half a tank or more. Before a forecast event, charge an EV to a sensible level.",
            "Phones and a flashlight charged. Weather radio has batteries.",
        ])
        + "<h2>Monthly</h2>" + checklist([
            "Test smoke alarms and carbon monoxide alarms.",
            "Check food dates. Eat what is close.",
            "Refill plan for essential prescriptions: dates and amounts, on the private page only. No drug names here.",
        ])
        + "<h2>Every 6 months</h2>" + checklist([
            "Rotate stored tap water: empty, clean, refill, and write the date (Ready.gov).",
            drill,
            "Reprint this binder if the plan changed.",
        ])
        + "<h3>Done log</h3>" + blank_rows(["Date", "The one step", "By"], 6)
    )


def _marine_page():
    return (
        "<p>Self-reliant for as long as your level covers. Short and direct. Calm. No rank unless the household wants it.</p>"
        + checklist([
            "PACE card filled in on the comms page.",
            "Go-bag and gear check: one bag, one spot everyone can name.",
            "Rally point is the near-home meeting place, unless you wrote another.",
            "One drill, then three after-action lines: what worked, what did not, one fix.",
            "Watch rotation only if the event runs long. Write shifts here.",
        ])
        + "<h3>After-action notes</h3>" + ruled(8)
        + "<h3>Watch rotation (long events only)</h3>" + blank_rows(["Shift", "Who", "From", "To"], 6)
    )


def _sources():
    src = [
        ("Ready.gov: Water", "https://www.ready.gov/water"),
        ("Ready.gov: Make a Plan", "https://www.ready.gov/plan"),
        ("Ready.gov: Build a Kit", "https://www.ready.gov/kit"),
        ("Ready.gov: Evacuation", "https://www.ready.gov/evacuation"),
        ("Ready.gov: Power Outages", "https://www.ready.gov/power-outages"),
        ("EPA: Emergency Disinfection of Drinking Water", "https://www.epa.gov/ground-water-and-drinking-water/emergency-disinfection-drinking-water"),
        ("CDC: Make water safe", "https://www.cdc.gov/water-emergency/about/index.html"),
        ("FoodSafety.gov: Power outage", "https://www.foodsafety.gov/food-safety-charts/food-safety-during-power-outage"),
        ("NOAA Weather Radio", "https://www.weather.gov/nwr/"),
        ("NWS alerts", "https://www.weather.gov/alerts"),
        ("FEMA / Ready.gov", "https://www.ready.gov/"),
        ("Poison Control", "https://www.poison.org/"),
        ("FDA calorie guide", "https://www.fda.gov/food/nutrition-facts-label/calories-nutrition-facts-label"),
    ]
    items = "".join("<li><b>%s</b><br>%s</li>" % (E(title), E(url)) for title, url in src)
    return (
        "<ol class='src'>%s</ol>"
        "<p class='small'>Regenerate from the household store: python3 build_binder.py STORE. "
        "Child calorie bands are planning estimates from the method, not a diet.</p>" % items
    )


if __name__ == "__main__":
    build(find_store(sys.argv))
