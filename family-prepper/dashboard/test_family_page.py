#!/usr/bin/env python3
"""Prepper v1.2.5 check: the Family plan Page built from sample data shows only plan basics.
Fails if supplies, the score, cash, medicines, firearms or device details reach it.
Run: python3 test_family_page.py [DATA.json]   (exit 0 pass, 1 fail)"""
import json, os, re, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
data_p = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "sample-data.json")
out_p = os.path.join(tempfile.mkdtemp(), "family.canvas.tsx")
r = subprocess.run([sys.executable, os.path.join(HERE, "gen.py"), "--family", data_p,
                    os.path.join(HERE, "family-plan.template.tsx"), out_p], capture_output=True, text=True)
problems = []
if r.returncode:
    print("gen.py --family failed:", r.stderr.strip()); sys.exit(1)
page = open(out_p, encoding="utf-8").read()
m = re.search(r"export const DATA: FamilyPlan = (\{.*?\n\});", page, re.S)
fd = json.loads(m.group(1))
src = json.load(open(data_p, encoding="utf-8"))

# 1. Only allowlisted keys.
allowed = {"_example", "version", "asOfLabel", "household", "plan", "family"}
plan_ok = {"contacts", "outOfAreaContact", "meetingPlaces", "utilities", "evacuation", "petFriendlyPlace",
           "shelterSpot", "alertSignup", "evacZoneSource", "awayFromHome"}
problems += ["extra top-level key: " + k for k in set(fd) - allowed]
problems += ["extra plan key: " + k for k in set(fd["plan"]) - plan_ok]
problems += ["extra household key: " + k for k in set(fd["household"]) - {"name", "hasPets"}]
for f in fd["family"]:
    problems += ["extra family key: " + k for k in set(f) - {"name", "role"}]

# 2. No forbidden key anywhere, at any depth.
BAD_KEYS = {"categories", "goBags", "shopping", "computed", "score", "expiring", "lifeSafety", "targets", "task",
            "recalls", "modules", "connections", "channels", "history", "needs", "checklist", "cash", "medicine",
            "medicines", "medication", "firearm", "firearms", "device", "devices", "outagePlan", "waterPlan"}
def walk(o, path=""):
    if isinstance(o, dict):
        for k, v in o.items():
            if k in BAD_KEYS:
                problems.append("forbidden key %s at %s" % (k, path or "DATA"))
            walk(v, path + "." + k)
    elif isinstance(o, list):
        for i, v in enumerate(o):
            walk(v, "%s[%d]" % (path, i))
walk(fd)

# 3. No forbidden words in what the Page renders (comments aside).
code = "\n".join(l for l in page.splitlines() if not l.lstrip().startswith("//"))
for w in re.findall(r"\b(suppl(?:y|ies)|score|readiness|cash|firearms?|guns?|ammo|ammunition|devices?|prescriptions?|doses?|dosage)\b", code, re.I):
    problems.append("forbidden word on the Page: " + w)

# 4. No text from the supply, kit, shopping, medicine or device sections leaks in.
plan_text = json.dumps(src.get("printPlan", {})) + json.dumps([f["role"] for f in src["family"]])
def strings(o):
    if isinstance(o, str): yield o
    elif isinstance(o, dict):
        for v in o.values(): yield from strings(v)
    elif isinstance(o, list):
        for v in o: yield from strings(v)
for sec in ["categories", "goBags", "shopping", "expiring", "lifeSafety", "recalls", "targets", "task"]:
    for s in strings(src.get(sec)):
        if len(s) > 8 and " " in s and s in code and s not in plan_text and s != src.get("asOfLabel"):
            problems.append("leaked from %s: %r" % (sec, s))

if problems:
    print("FAIL"); print("\n".join(sorted(set(problems)))); sys.exit(1)
print("PASS: Family plan Page has only plan basics (%d family members, %d plan fields)" % (len(fd["family"]), len(fd["plan"])))
