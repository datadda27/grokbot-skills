#!/usr/bin/env python3
"""Prepper v1.3.1 check: the Page builds and type-checks with every optional field filled in, and with every
nullable field set to null. The fixture is built from schema.json at run time (tests/full_fixture.py), so a field
added to the schema without a matching template type fails here. Also checks the Check these order and count.
Needs Node.js (npx downloads TypeScript 5 on first run). Run: python3 dashboard/test_full_fixture.py"""
import datetime, json, os, shutil, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "tests"))
sys.path.insert(0, HERE)
import full_fixture  # noqa: E402
import gen  # noqa: E402


def fail(msg):
    print("FAIL: " + msg)
    sys.exit(1)


def typecheck(data, tmp, name):
    dp, out = os.path.join(tmp, name + ".json"), os.path.join(tmp, name + ".tsx")
    json.dump(data, open(dp, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    r = subprocess.run([sys.executable, os.path.join(HERE, "gen.py"), dp, os.path.join(HERE, "dashboard.template.tsx"), out],
                       capture_output=True, text=True)
    if r.returncode:
        fail("gen.py failed on the %s fixture: %s" % (name, r.stderr.strip()))
    shutil.copy(os.path.join(HERE, "tests", "grok-canvas.d.ts"), os.path.join(tmp, "grok-canvas.d.ts"))
    r = subprocess.run(["npx", "-y", "-p", "typescript@5", "tsc", "--noEmit", "--strict", "--jsx", "preserve",
                        "--target", "es2020", "grok-canvas.d.ts", name + ".tsx"], cwd=tmp, capture_output=True, text=True)
    if r.returncode:
        fail("type check failed on the %s fixture:\n%s" % (name, (r.stdout + r.stderr).strip()[:3000]))


def check_attention():
    d = json.load(open(os.path.join(HERE, "sample-data.json"), encoding="utf-8"))
    asof = datetime.date(2026, 6, 1)
    d["targets"]["staleAfterDays"] = 182
    d["checks"] = {
        "untested": [{"label": "Never tested %d" % i, "category": "power", "testedOn": None} for i in range(6)]
                    + [{"label": "Test due", "category": "comms", "testedOn": "2025-01-01"}],
        "stale": [{"label": "Stale line", "verifiedOn": "2025-01-01"}],
        "countNeeded": [{"label": "Count this"}],
        "arriving": [{"label": "Late order", "orderedOn": "2026-05-01"}],
    }
    d["taskList"] = [{"id": "t1", "title": "Skipped task", "skips": 2}, {"id": "t2", "title": "Asked already", "skips": 3, "askedAfterSkips": True}]
    rows, more = gen.attention(d, asof)
    kinds = [r["kind"] for r in rows]
    want = ["expired", "stale", "count", "arriving", "skipped", "untested", "untested", "untested"]
    if kinds != want:
        fail("Check these order is %s, expected %s" % (kinds, want))
    if more != 3:
        fail("Check these +N more is %d, expected 3 (11 due, 8 shown)" % more)


def main():
    if not shutil.which("npx"):
        fail("npx not found; install Node.js to run the type check")
    check_attention()
    with tempfile.TemporaryDirectory() as tmp:
        typecheck(full_fixture.build(), tmp, "full")
        typecheck(full_fixture.build_nulls(), tmp, "nulls")
    print("PASS: Page type-checks with every optional field filled and with every nullable field null; "
          "Check these keeps priority order and counts +N more.")


if __name__ == "__main__":
    main()
