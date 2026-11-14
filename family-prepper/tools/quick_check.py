"""Prepper quick check (v1.3.0). Script-first threat pass: no model work when quiet.
Usage: python3 quick_check.py WATCH_POINTS.json
WATCH_POINTS.json: [{"label": "Home", "lat": 35.0, "lon": -97.0, "home": true, "today": true}, ...]
  home: the household's home point (watches count here). today: a place an adult is today (warnings count).
Prints one JSON line: {"status": "quiet"|"active"|"incomplete", "failed": [...], "products": [...]}.
Exit 0 quiet, 10 active, 20 incomplete. Only quiet may end the run silently."""
import json, sys, urllib.request

UA = {"User-Agent": "FamilyPrepperBot/1.0 (Grok Bot template)", "Accept": "application/geo+json"}
SPC = "https://www.spc.noaa.gov/products/outlook/day1otlk_cat.lyr.geojson"
ENH_PLUS = {"ENH", "MDT", "HIGH"}


def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=20) as r:
        if r.status != 200:
            raise IOError("HTTP %s" % r.status)
        return json.load(r)


def inside(lon, lat, ring):
    hit, j = False, len(ring) - 1
    for i in range(len(ring)):
        (xi, yi), (xj, yj) = ring[i][:2], ring[j][:2]
        if (yi > lat) != (yj > lat) and lon < (xj - xi) * (lat - yi) / (yj - yi) + xi:
            hit = not hit
        j = i
    return hit


def in_geom(lon, lat, g):
    polys = [g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"] if g["type"] == "MultiPolygon" else []
    return any(inside(lon, lat, p[0]) and not any(inside(lon, lat, h) for h in p[1:]) for p in polys)


def main(path):
    failed, products = [], []
    try:
        pts = json.load(open(path))
        if not isinstance(pts, list) or not all(isinstance(p, dict) for p in pts):
            raise ValueError("expected a list of points")
        for p in pts:
            p["lat"], p["lon"], p["label"] = float(p["lat"]), float(p["lon"]), str(p.get("label", "point"))
        if not any(p.get("home") or p.get("today") for p in pts):
            raise ValueError("no home or today point, so nothing was checked")
    except Exception as e:
        print(json.dumps({"status": "incomplete", "failed": ["watch points file (%s)" % e], "products": []}))
        sys.exit(20)
    for p in pts:
        if not (p.get("home") or p.get("today")):
            continue
        try:
            feats = get("https://api.weather.gov/alerts/active?point=%.4f,%.4f" % (p["lat"], p["lon"]))["features"]
        except Exception as e:
            failed.append("NWS alerts for %s (%s)" % (p["label"], e))
            continue
        for f in feats:
            pr = f["properties"]
            ev = pr.get("event", "")
            if pr.get("status") != "Actual" or pr.get("messageType") == "Cancel":
                continue
            if ev.endswith("Warning") or (p.get("home") and ev.endswith("Watch")):
                products.append({"place": p["label"], "event": ev, "id": pr.get("id"), "ends": pr.get("ends") or pr.get("expires")})
    try:
        spc = get(SPC)["features"]
        for f in spc:
            if f["properties"].get("LABEL") in ENH_PLUS:
                for p in pts:
                    if (p.get("home") or p.get("today")) and f.get("geometry") and in_geom(p["lon"], p["lat"], f["geometry"]):
                        products.append({"place": p["label"], "event": "SPC Day 1 " + f["properties"].get("LABEL2", ""),
                                         "id": "spc-" + f["properties"].get("VALID", ""), "ends": f["properties"].get("EXPIRE")})
    except Exception as e:
        failed.append("SPC Day 1 outlook (%s)" % e)
    status = "incomplete" if failed else "active" if products else "quiet"
    print(json.dumps({"status": status, "failed": failed, "products": products}))
    sys.exit({"quiet": 0, "active": 10, "incomplete": 20}[status])


if __name__ == "__main__":
    main(sys.argv[1])
