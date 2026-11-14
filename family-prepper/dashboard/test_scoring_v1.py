#!/usr/bin/env python3
"""Prepper v1.3.0 check: scoring stays v1. The sample data must give the same score as v1.2.8, and the
v1.3.0 display fields (checks, changeLog, food split, emergency mode fields) must never move the score.
Run: python3 test_scoring_v1.py   (exit 0 pass, 1 fail)"""
import copy, json, os, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
SAMPLE = os.path.join(HERE, "sample-data.json")
EXPECTED = {"score": 60, "setupPct": 93, "pointsWaiting": 7, "tierLabel": "72 hours", "taskGain": 2}  # v1.2.8 on sample-data.json


def summary(d):
    p = os.path.join(tempfile.mkdtemp(), "d.json")
    json.dump(d, open(p, "w"))
    r = subprocess.run([sys.executable, os.path.join(HERE, "gen.py"), "--summary", p], capture_output=True, text=True)
    if r.returncode:
        print("gen.py failed:", r.stderr.strip()); sys.exit(1)
    return json.loads(r.stdout)


problems = []
base = json.load(open(SAMPLE, encoding="utf-8"))
s = summary(base)
for k, v in EXPECTED.items():
    if s[k] != v:
        problems.append("%s is %r, expected %r (v1 scoring changed)" % (k, s[k], v))

# Display-only fields must not change the score.
bare = copy.deepcopy(base)
bare.pop("checks", None); bare.pop("changeLog", None)
if summary(bare) != s:
    problems.append("checks or changeLog changed the summary")
split = copy.deepcopy(base)
food = next(c for c in split["categories"] if c["id"] == "food")
food.update({"noCookDays": 1, "cookDays": 2, "fuel": {"source": "cylinders", "cylinders": 1, "hoursPerCylinder": 1, "cookHoursPerDay": 1}})
if summary(split)["score"] != s["score"]:
    problems.append("the food split changed the score (it is display only until scoring v2)")

# A physical count always wins: a full count lower than the estimate lowers the score; a partial count does not.
part = copy.deepcopy(base)
food = next(c for c in part["categories"] if c["id"] == "food")
food["days"], food["countedDays"] = 9, 2
if summary(part)["score"] != summary(dict(part, categories=[dict(c, countedDays=None) if c["id"] == "food" else c for c in part["categories"]]))["score"]:
    problems.append("a partial count lowered the score")
full = copy.deepcopy(part)
next(c for c in full["categories"] if c["id"] == "food")["countScope"] = "full"
if not summary(full)["score"] < summary(part)["score"]:
    problems.append("a full count lower than the estimate did not win")

if problems:
    print("FAIL:\n- " + "\n- ".join(problems)); sys.exit(1)
print("PASS: v1 scoring unchanged on sample data (score %d, %s); display fields do not move it; a full count wins." % (s["score"], s["tierLabel"]))
