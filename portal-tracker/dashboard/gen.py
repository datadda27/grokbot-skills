"""Build the dashboard Page source from a dashboard data file.
Usage: python3 gen.py DATA.json [TEMPLATE.tsx] [OUT.tsx]
DATA.json is required (or set $DASH_DATA). TEMPLATE and OUT default to dashboard.template.tsx and dashboard.canvas.tsx next to this file.
Only the data file changes between teams. The template holds no team text."""
import json,re,os,sys,collections
HERE=os.path.dirname(os.path.abspath(__file__))
USAGE="usage: python3 gen.py DATA.json [TEMPLATE.tsx] [OUT.tsx]   (or set DASH_DATA instead of DATA.json; -h for help)"
HELP=USAGE+"""

Builds the dashboard Page source from a data file that matches schema.json.
  DATA.json      the team's data file (required unless DASH_DATA is set)
  TEMPLATE.tsx   default: dashboard.template.tsx next to this file
  OUT.tsx        default: dashboard.canvas.tsx next to this file
Prints "ok OUT size" on success. Nothing is published."""
args=sys.argv[1:]
if any(a in ("-h","--help") for a in args):
    print(HELP); sys.exit(0)
if any(a.startswith("-") for a in args):
    print("gen.py: unknown option "+[a for a in args if a.startswith("-")][0],file=sys.stderr); print(USAGE,file=sys.stderr); sys.exit(2)
if len(args)>3:
    print("gen.py: too many arguments",file=sys.stderr); print(USAGE,file=sys.stderr); sys.exit(2)
P=args[0] if args else os.environ.get("DASH_DATA")
if not P:
    print("gen.py: missing DATA.json",file=sys.stderr); print(USAGE,file=sys.stderr); sys.exit(2)
if not os.path.isfile(P):
    print("gen.py: data file not found: "+P,file=sys.stderr); print(USAGE,file=sys.stderr); sys.exit(2)
sys.argv=[sys.argv[0]]+args
TPL=sys.argv[2] if len(sys.argv)>2 else os.path.join(HERE,"dashboard.template.tsx")
OUT=sys.argv[3] if len(sys.argv)>3 else os.path.join(HERE,"dashboard.canvas.tsx")
d=json.load(open(P))
d.pop("$schema",None); d.pop("_example",None)
# --- normalize: accept legacy key names, fill optional fields so the page type-checks
if "nextClassCommits" not in d: d["nextClassCommits"]=d.pop("commits2028",[])
else: d.pop("commits2028",None)
if "nextClassRank247" not in d: d["nextClassRank247"]=d.pop("class2028Rank247",None)
else: d.pop("class2028Rank247",None)
pt=d["portal"]
if "current" not in pt: pt["current"]=pt.pop("current2027",{"entries":0,"commits":0,"note":"UNKNOWN"})
else: pt.pop("current2027",None)
d.setdefault("teamShort",d.get("team"))
d.setdefault("coach",None)
ts=d.get("teamStatus")
if ts and "big12" in ts and "conference" not in ts: ts["conference"]=dict(ts.pop("big12"),label="Big 12")  # legacy key from the digest
d.setdefault("page",{"title":f"{d['team']} Recruiting & Portal Dashboard","summary":f"{d.get('classYear','')} class, transfer portal and rankings."})
for c in d["commits"]: c.setdefault("hsGames",[])
FORUM_CAP=15
# one board per site; several sites allowed. "forum" (single) is still accepted.
fs=[x for x in (d.get("forums") or ([d["forum"]] if d.get("forum") else [])) if x]
for f in fs:
    f.setdefault("totalThreads",len(f["threads"]))
    f["threads"]=sorted(f["threads"],key=lambda x:x.get("rank",999))[:FORUM_CAP]
d["forums"]=fs; d.pop("forum",None)  # the page sets forum = forums[0]
# --- Top on X (5 posts) and Top reads (5 items). Premium reads keep the headline only.
X_CAP=5; READS_CAP=5
tx=d.get("topOnX")
if tx: tx["posts"]=sorted(tx.get("posts") or [],key=lambda x:x.get("rank",999))[:X_CAP]
tr=d.get("topReads")
if tr:
    tr["items"]=sorted(tr.get("items") or [],key=lambda x:x.get("rank",999))[:READS_CAP]
    for x in tr["items"]:
        x.setdefault("premium",False); x.setdefault("premiumSite",None)
        if x["premium"]: x["why"]=None
d.setdefault("topOnX",None); d.setdefault("topReads",None); d.setdefault("digest",None)
# --- flatten ratings to tuples (smaller page source)
rt=lambda r:[r.get(k) for k in ("stars","rating","natl","pos","state")]
for c in d["commits"]:
    c["r247"]=rt(c["r247"]); c["industry"]=rt(c["industry"])
for p in pt["incoming"]: p.pop("sources",None)
# --- forum/following: emit only the fields the page renders
KT=("id","url","title","replies","views","latest","staffPosts","cat","label","summary","verdict","why","rank","readIn")
KS=("id","url","title","author","replies","views","started","staffPosts","summary","verdict","readIn")
KP=("thread","url","date","summary")
for f in fs:
    f["threads"]=[{k:x.get(k) for k in KT} for x in f["threads"]]; f["stickies"]=[{k:x.get(k) for k in KS} for x in f["stickies"]]
if d.get("following"):
    for p in d["following"]["posters"]+d["following"]["suggested"]: p["posts"]=[{k:x.get(k) for k in KP} for x in p["posts"]]
def ser(o,ind=0):
    pad="  "*(ind+1)
    if isinstance(o,dict):
        if not o: return "{}"
        inner=[(k if re.match(r"^[A-Za-z_]\w*$",k) else json.dumps(k))+": "+ser(v,ind+1) for k,v in o.items()]
        one="{ "+", ".join(inner)+" }"
        if len(one)<600 or ind>=1: return one
        return "{\n"+",\n".join(pad+i for i in inner)+",\n"+"  "*ind+"}"
    if isinstance(o,list):
        items=[ser(v,ind+1) for v in o]
        one="["+", ".join(items)+"]"
        if len(one)<600 or ind>=2: return one
        return "[\n"+",\n".join(pad+i for i in items)+",\n"+"  "*ind+"]"
    return json.dumps(o,ensure_ascii=False)
# --- alias repeated URLs (named ones from data.sourceLinks, plus any URL used 3+ times)
S=dict(d.get("sourceLinks") or {})
def urls(o):
    if isinstance(o,dict):
        for v in o.values(): yield from urls(v)
    elif isinstance(o,list):
        for v in o: yield from urls(v)
    elif isinstance(o,str) and o.startswith("http"): yield o
cnt=collections.Counter(urls(d)); known=set(S.values()); i=0
for u,n in cnt.most_common():
    if n<3: break
    if u not in known: S[f"u{i}"]=u; i+=1
raw=ser(d)
for k,u in sorted(S.items(),key=lambda kv:-len(kv[1])): raw=raw.replace(json.dumps(u),"S."+k)
TAIL='''// Ratings tuples: [stars, rating, natl, pos, state]
type RT = [number | null, number | null, number | null, number | null, number | null];
type RawCommit = Omit<Commit, "r247" | "industry"> & { r247: RT; industry: RT };
type RawData = Omit<Dashboard, "commits" | "portal" | "forum"> & { commits: RawCommit[]; portal: Omit<Dashboard["portal"], "incoming"> & { incoming: Omit<Incoming, "sources">[] } };
const tup = (r: RT): Rating => ({ stars: r[0], rating: r[1], natl: r[2], pos: r[3], state: r[4] });
const RAW: RawData = @RAW@;
export const DATA: Dashboard = {
  ...RAW,
  forum: RAW.forums?.[0] ?? null,
  commits: RAW.commits.map((c) => ({ ...c, r247: tup(c.r247), industry: tup(c.industry) })),
  portal: { ...RAW.portal, incoming: RAW.portal.incoming.map((p) => ({ ...p, sources: [RAW.portal.lastCycle.sourceOn3, RAW.portal.lastCycle.source247, RAW.portal.lastCycle.sourceTP] })) },
};
'''
block="const S = {\n"+"".join("  %s: %s,\n"%(k if re.match(r"^[A-Za-z_]\w*$",k) else json.dumps(k),json.dumps(u)) for k,u in S.items())+"};\n"+TAIL.replace("@RAW@",raw)
t=open(TPL).read()
assert "export const DATA: Dashboard = __DATA__;" in t
open(OUT,"w").write(t.replace("export const DATA: Dashboard = __DATA__;",block))
print("ok",OUT,os.path.getsize(OUT))
