"""Build the Prepper Page source from dashboard-data.json.
Usage: python3 gen.py DATA.json [TEMPLATE.tsx] [OUT.tsx]
       python3 gen.py --summary DATA.json   (prints score, setup %, tier, top 3 gaps, task gain as JSON; writes no Page)
Defaults: dashboard.template.tsx and dashboard.canvas.tsx next to this file; $DASH_DATA may stand in for DATA.json.
Only the data file changes between households. The template holds no household text.
gen.py computes the readiness score (earned over every applicable point, so answering only raises it),
setup progress, points waiting, tier, top gaps (gains in stated-weight points), the two-week calculator, and days until each
best-by date, drops any item marked private, and refuses private keys (medicine details, firearms, cash amounts)."""
import json, os, sys, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
USAGE = "usage: python3 gen.py [--summary] DATA.json [TEMPLATE.tsx] [OUT.tsx]   (or set DASH_DATA instead of DATA.json; -h for help)"
MARK = "export const DATA: Dashboard = __DATA__;"
FORBIDDEN = {"medication", "medications", "medicine", "medicines", "dose", "dosage", "doses", "prescription", "prescriptions",
             "rx", "firearm", "firearms", "gun", "guns", "ammo", "ammunition", "cash", "cashamount", "safe", "safecode",
             "pin", "password", "ssn", "lat", "lon", "latitude", "longitude", "coordinates", "address", "email"}
KCAL = {"14+": 2000, "9-13": 1700, "4-8": 1400, "1-3": 1000, "0-1": None}  # reference/us.md calculator; infants: use what the family uses now
TIERS = [("start", "Getting started"), ("72h", "72 hours"), ("2w", "2 weeks")]
UNKNOWN_DAYS = "not counted"
STRETCH_DAYS = 30  # optional 30-day stretch: shown only when the owner asked for it ("30d" in targets.optionalTiers); never scored, never a tier
CORE = ["water", "food", "meds", "sanitation"]


def fail(msg, code=2):
    print("gen.py: " + msg, file=sys.stderr)
    if code == 2:
        print(USAGE, file=sys.stderr)
    sys.exit(code)


def check_private(o, path="$"):
    if isinstance(o, dict):
        for k, v in o.items():
            if k.lower() in FORBIDDEN:
                fail("refusing private key '%s' at %s. Keep it in private.json, never in dashboard data." % (k, path), 3)
            check_private(v, path + "." + k)
    elif isinstance(o, list):
        for i, v in enumerate(o):
            check_private(v, "%s[%d]" % (path, i))


def r1(x):
    return round(x + 0.0, 1)


def apply_counting(d):
    """An inventory batch in progress never lowers the score. `days` holds the owner's estimate (or the finished
    count); `countedDays` holds the running count. The scored value is the higher of the two until the owner says
    counting is complete, then the bot moves the count into `days` and drops `countedDays`."""
    for c in d["categories"]:
        cd = c.get("countedDays")
        if c["kind"] != "days" or cd is None:
            continue
        est = c["days"]
        if est is None:
            c["days"] = cd
            c["countNote"] = "counted so far %g days" % r1(cd)
        elif cd >= est:
            c["days"] = cd
            c["countNote"] = "counted %g days (estimate was ~%g)" % (r1(cd), est)
        else:
            c["countNote"] = "counted so far %g of ~%g days" % (r1(cd), est)


def compute(d):
    target = d["targets"]["days"]
    rows = []  # (label, group, points, earned or None, applicable, have, need)
    cats = {c["id"]: c for c in d["categories"]}
    for c in d["categories"]:
        w = c["weight"]
        if c["kind"] == "days":
            if c["days"] is None:
                rows.append((c["label"], "supplies", w, None, True, "not counted yet", "%d days" % target, c["id"]))
            else:
                rows.append((c["label"], "supplies", w, w * min(c["days"] / target, 1), True,
                             c.get("countNote") or "%g days" % c["days"], "%d days" % target, c["id"]))
        else:
            if c["itemsDone"] is None or not c["itemsTotal"]:
                rows.append((c["label"], "supplies", w, None, True, "not counted yet", "checklist", c["id"]))
            else:
                rows.append((c["label"], "supplies", w, w * min(c["itemsDone"] / c["itemsTotal"], 1), True,
                             "%d of %d" % (c["itemsDone"], c["itemsTotal"]), "%d of %d" % (c["itemsTotal"], c["itemsTotal"]), c["id"]))
    for group, items in (("life safety", d["lifeSafety"]), ("plan", d["planItems"])):
        for x in items:
            s = x["status"]
            if s == "na":
                rows.append((x["label"], group, x["points"], None, False, "does not apply", "", x["id"]))
            elif s == "unknown":
                rows.append((x["label"], group, x["points"], None, True, "not counted yet", "done", x["id"]))
            elif s == "open" and x.get("doneShare"):
                share = min(max(x["doneShare"], 0), 1)
                rows.append((x["label"], group, x["points"], x["points"] * share, True,
                             "partly done", "done", x["id"]))
            else:
                rows.append((x["label"], group, x["points"], x["points"] if s == "done" else 0, True,
                             "done" if s == "done" else "open", "done", x["id"]))
    # Score only goes up as the owner answers: the denominator is every applicable point (fixed),
    # unknown items earn 0 and show as "points waiting", and n/a items leave the denominator.
    applicable = sum(r[2] for r in rows if r[4])
    counted = sum(r[2] for r in rows if r[4] and r[3] is not None)
    earned = sum(r[3] for r in rows if r[3] is not None)
    score = round(100 * earned / applicable) if applicable else 0
    coverage = counted / applicable if applicable else 0
    provisional = coverage < 0.8

    def pts(raw):
        # Score points for a raw-weight gain. Equals the stated weight when nothing is n/a.
        return round(100 * raw / applicable) if applicable else 0

    gaps, waiting = [], []
    for r in rows:
        if not r[4]:
            continue
        if r[3] is None:
            waiting.append({"label": r[0], "group": r[1], "have": r[5], "need": r[6], "gain": pts(r[2]), "id": r[7], "waiting": True})
            continue
        gain = r[2] - r[3]
        if gain > 0.05:
            gaps.append({"label": r[0], "group": r[1], "have": r[5], "need": r[6], "gain": pts(gain), "id": r[7], "waiting": False})
    order = {"life safety": 0, "supplies": 1, "plan": 2}
    gaps.sort(key=lambda g: (-g["gain"], order.get(g["group"], 3)))
    waiting.sort(key=lambda g: (-g["gain"], order.get(g["group"], 3)))
    top = (gaps + waiting)[:3]
    uncounted = [{"label": r[0], "points": pts(r[2])} for r in rows if r[4] and r[3] is None]

    ls = {x["id"]: x["status"] for x in d["lifeSafety"]}
    basics_done = all(ls.get(k) in ("done", "na") for k in ("smoke", "co", "alerts"))
    device_ok = ls.get("device") in ("done", "na", None)

    def core_at(n):
        return all(cats.get(k) and cats[k]["days"] is not None and cats[k]["days"] >= n for k in CORE)

    core_uncounted = any(not cats.get(k) or cats[k]["days"] is None for k in CORE)
    others = [c for c in d["categories"] if c["id"] not in CORE]
    others_ok = all(c["itemsDone"] is not None and c["itemsTotal"] and c["itemsDone"] / c["itemsTotal"] >= 0.5
                    if c["kind"] == "checklist" else (c["days"] is not None and c["days"] >= target / 2) for c in others)
    tier = 0
    if core_at(3) and basics_done and device_ok:
        tier = 1
        if core_at(14) and others_ok:
            tier = 2
    needs = []
    if tier == 0:
        needs += ["%s to 3 days" % cats[k]["label"] for k in CORE if cats.get(k) and (cats[k]["days"] is None or cats[k]["days"] < 3)]
        needs += [x["label"] for x in d["lifeSafety"] if x["id"] in ("smoke", "co", "alerts") and x["status"] not in ("done", "na")]
        if not device_ok:
            needs.append("Power-dependent device backup plan")
    elif tier == 1:
        needs += ["%s to 14 days" % cats[k]["label"] for k in CORE if cats[k]["days"] < 14]
        for c in others:
            if c["kind"] == "checklist":
                if c["itemsDone"] is None or not c["itemsTotal"]:
                    needs.append("Count %s" % c["label"])
                elif c["itemsDone"] / c["itemsTotal"] < 0.5:
                    needs.append("%s to half (%d of %d now)" % (c["label"], c["itemsDone"], c["itemsTotal"]))
            elif c["days"] is None or c["days"] < target / 2:
                needs.append("%s to %g days" % (c["label"], target / 2))
    stretch = None
    if "30d" in d["targets"].get("optionalTiers", []):
        stretch = ["%s %s of %d days" % (cats[k]["label"], UNKNOWN_DAYS if cats[k]["days"] is None else "%g" % cats[k]["days"], STRETCH_DAYS)
                   for k in CORE if cats.get(k)]

    hh = d["household"]
    kcal = 2000 * hh["adults"]
    infants = 0
    for k in hh["kids"]:
        v = KCAL.get(k["ageBand"])
        if v is None:
            infants += 1
        else:
            kcal += v
    people = hh["adults"] + len(hh["kids"])
    water_day = people * (2 if hh["climateHot"] else 1)
    pet_known = [p for p in hh["pets"] if p["waterGalPerDay"] is not None]
    pet_unknown = [p["name"] for p in hh["pets"] if p["waterGalPerDay"] is None]
    pet_water = sum(p["waterGalPerDay"] for p in pet_known)

    task_gain = 0
    t = d["task"]
    byid = {r[7]: r for r in rows}
    ids = t.get("itemIds") or []
    if ids:
        task_gain = pts(sum(byid[i][2] - (byid[i][3] or 0) for i in ids if i in byid and byid[i][4]))
    elif t["category"] in cats and t["addsDays"] and cats[t["category"]]["kind"] == "days":
        c = cats[t["category"]]
        have = c["days"] or 0
        task_gain = pts(c["weight"] * (min((have + t["addsDays"]) / target, 1) - min(have / target, 1)))

    asof = datetime.date.fromisoformat(d["asOf"])
    exp = []
    for e in d["expiring"]:
        if e.get("private"):
            continue
        dl = (datetime.date.fromisoformat(e["date"]) - asof).days
        exp.append({"item": e["item"], "category": e["category"], "date": e["date"],
                    "label": datetime.date.fromisoformat(e["date"]).strftime("%b %d, %Y").replace(" 0", " "),
                    "daysLeft": dl, "qty": e["qty"], "location": e["location"], "idea": e["idea"] or "",
                    "estimated": bool(e.get("estimated"))})
    exp.sort(key=lambda e: e["daysLeft"])

    sh = d["shopping"]
    budget_pct = (min(sh["spent"] / sh["monthlyBudget"], 1) if sh["monthlyBudget"] and sh["spent"] is not None else None)

    return {
        "score": score, "earned": r1(earned), "counted": r1(counted), "applicable": r1(applicable),
        "coverage": round(coverage, 2), "setupPct": round(100 * coverage), "provisional": provisional,
        "pointsWaiting": sum(u["points"] for u in uncounted),
        "tierIndex": tier, "tierId": TIERS[tier][0],
        "tierLabel": TIERS[tier][1] + (" (provisional)" if core_uncounted else ""),
        "nextTierLabel": TIERS[tier + 1][1] if tier + 1 < len(TIERS) else "",
        "nextTierNeeds": needs,
        "stretch": stretch,
        "gaps": top, "uncounted": uncounted,
        "taskGain": task_gain,
        "calc": {"people": people, "infants": infants, "kcalPerDay": kcal, "kcalTarget": kcal * target,
                 "waterPerDay": water_day, "waterTarget": water_day * target,
                 "petWaterPerDay": r1(pet_water), "petsUnknown": pet_unknown, "hot": hh["climateHot"]},
        "expiring": exp,
        "budgetPct": None if budget_pct is None else round(budget_pct, 2),
        "activeLevel": ("ACT NOW" if any(a["level"] == "ACT NOW" for a in d["alert"]["active"]) else
                        "PREPARE" if any(a["level"] == "PREPARE" for a in d["alert"]["active"]) else "none"),
    }


def main(argv):
    args = argv[1:]
    if any(a in ("-h", "--help") for a in args):
        print(__doc__.strip() + "\n\n" + USAGE)
        sys.exit(0)
    summary = "--summary" in args
    args = [a for a in args if a != "--summary"]
    if any(a.startswith("-") for a in args):
        fail("unknown option " + [a for a in args if a.startswith("-")][0])
    if len(args) > 3:
        fail("too many arguments")
    data_p = args[0] if args else os.environ.get("DASH_DATA")
    if not data_p:
        fail("missing DATA.json")
    if not os.path.isfile(data_p):
        fail("data file not found: " + data_p)
    tpl_p = args[1] if len(args) > 1 else os.path.join(HERE, "dashboard.template.tsx")
    out_p = args[2] if len(args) > 2 else os.path.join(HERE, "dashboard.canvas.tsx")
    if not summary and not os.path.isfile(tpl_p):
        fail("template not found: " + tpl_p)
    try:
        d = json.load(open(data_p, encoding="utf-8"))
    except ValueError as e:
        fail("data is not valid JSON: %s" % e, 3)
    check_private(d)
    try:
        import jsonschema
        sp = os.path.join(HERE, "schema.json")
        if os.path.isfile(sp):
            errs = list(jsonschema.Draft7Validator(json.load(open(sp))).iter_errors(d))
            if errs:
                for e in errs[:10]:
                    print("schema: %s %s" % (e.json_path, e.message), file=sys.stderr)
                fail("%d schema error(s)" % len(errs), 3)
    except ImportError:
        print("gen.py: jsonschema not installed; checking required sections only", file=sys.stderr)
        sp = os.path.join(HERE, "schema.json")
        if os.path.isfile(sp):
            missing = [k for k in json.load(open(sp)).get("required", []) if k not in d]
            if missing:
                fail("missing section(s): " + ", ".join(missing), 3)
    d.pop("_example", None) if os.environ.get("DASH_STRIP_EXAMPLE") else None
    d["expiring"] = [e for e in d["expiring"] if not e.get("private")]
    # Minors are a stable label plus age band on the Page unless the owner opted in to the name; the name never
    # reaches the Page source. The label is stored per person (pageLabel), never numbered by list position.
    for f in d["family"]:
        if f.get("ageBand") and not f.get("showName"):
            f["name"] = "%s, %s" % (f.get("pageLabel") or "Child", f["ageBand"].replace("-", " to "))
    apply_counting(d)
    d["computed"] = compute(d)
    if summary:
        c = d["computed"]
        print(json.dumps({k: c[k] for k in ("score", "setupPct", "pointsWaiting", "tierLabel", "nextTierLabel",
                                             "nextTierNeeds", "stretch", "gaps", "taskGain")}, indent=1))
        return
    t = open(tpl_p, encoding="utf-8").read()
    if MARK not in t:
        fail("template is missing the line: " + MARK, 3)
    block = "export const DATA: Dashboard = " + json.dumps(d, indent=2, ensure_ascii=False) + ";"
    open(out_p, "w", encoding="utf-8").write(t.replace(MARK, block))
    print("ok", out_p, os.path.getsize(out_p))


if __name__ == "__main__":
    main(sys.argv)
