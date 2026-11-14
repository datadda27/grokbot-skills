"""Build a 'full' dashboard data file: the sample data with every optional field in schema.json filled in.
Usage: python3 tests/full_fixture.py OUT.json [--nulls]
--nulls: the same file with every nullable field set to null.
Walks schema.json, so a field added to the schema later is covered automatically. Values are generic test values."""
import copy, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
DASH = os.path.dirname(HERE)


def types_of(s):
    t = s.get("type")
    if t is None:
        if "enum" in s:
            return ["enum"]
        if "properties" in s:
            return ["object"]
        if "items" in s:
            return ["array"]
        return ["string"]
    return [t] if isinstance(t, str) else list(t)


def make(s, name=""):
    if "oneOf" in s or "anyOf" in s:
        return make((s.get("oneOf") or s.get("anyOf"))[0], name)
    if "const" in s:
        return s["const"]
    if "enum" in s:
        vals = [v for v in s["enum"] if v is not None]
        return vals[0] if vals else None
    t = [x for x in types_of(s) if x != "null"]
    t = t[0] if t else "null"
    if t == "object":
        return fill({}, s)
    if t == "array":
        return [make(s.get("items") or {"type": "string"}, name)] if s.get("maxItems", 1) else []
    if t in ("integer", "number"):
        lo = s.get("minimum", s.get("exclusiveMinimum", 0))
        hi = s.get("maximum", s.get("exclusiveMaximum", lo + 10))
        v = max(lo, 1) if t == "integer" else (lo + hi) / 2 if "exclusiveMaximum" in s or "exclusiveMinimum" in s else max(lo, 1)
        if "exclusiveMinimum" in s and v <= s["exclusiveMinimum"]:
            v = s["exclusiveMinimum"] + 1
        return min(v, hi) if "maximum" in s else v
    if t == "boolean":
        return True
    if t == "null":
        return None
    p = s.get("pattern", "")
    if r"\d{4}-\d{2}-\d{2}" in p:
        return "2026-01-15"
    if p.startswith("^https://"):
        return "https://example.org/"
    if r"\d{5}" in p:
        return "12345"
    if r"\d+\.\d+\.\d+" in p:
        return "1.3.1"
    if "0-9a-f" in p:
        return "0" * 64
    if p.startswith("^Child"):
        return "Child"
    return "Test " + (name or "value")


def fill(o, s):
    """Fill missing or null optional fields, recursing into every object and array."""
    if "oneOf" in s or "anyOf" in s:
        s = (s.get("oneOf") or s.get("anyOf"))[0]
    if isinstance(o, dict):
        for k, ps in (s.get("properties") or {}).items():
            if o.get(k) is None:
                v = make(ps, k)
                if v is not None:
                    o[k] = v
            else:
                o[k] = fill(o[k], ps)
        ap = s.get("additionalProperties")
        if isinstance(ap, dict) and not s.get("properties") and not o:
            o["test"] = make(ap, "test")
        elif isinstance(ap, dict):
            for k in list(o):
                if k not in (s.get("properties") or {}):
                    o[k] = fill(o[k], ap)
    elif isinstance(o, list):
        it = s.get("items") or {}
        if not o and s.get("maxItems", 1):
            o.append(make(it))
        else:
            o[:] = [fill(x, it) for x in o]
    return o


def nullify(o, s):
    """Set every field the schema lets be null to null (the other edge of the type check)."""
    if "oneOf" in s or "anyOf" in s:
        s = (s.get("oneOf") or s.get("anyOf"))[0]
    if isinstance(o, dict):
        for k, ps in (s.get("properties") or {}).items():
            if k not in o:
                continue
            if "null" in types_of(ps) or None in (ps.get("enum") or []):
                o[k] = None
            else:
                nullify(o[k], ps)
    elif isinstance(o, list):
        for x in o:
            nullify(x, s.get("items") or {})
    return o


def build_nulls():
    schema = json.load(open(os.path.join(DASH, "schema.json"), encoding="utf-8"))
    return nullify(build(), schema)


def build():
    schema = json.load(open(os.path.join(DASH, "schema.json"), encoding="utf-8"))
    data = json.load(open(os.path.join(DASH, "sample-data.json"), encoding="utf-8"))
    return fill(copy.deepcopy(data), schema)


if __name__ == "__main__":
    d = build_nulls() if "--nulls" in sys.argv else build()
    json.dump(d, open([a for a in sys.argv[1:] if not a.startswith("--")][0], "w", encoding="utf-8"), indent=2, ensure_ascii=False)
