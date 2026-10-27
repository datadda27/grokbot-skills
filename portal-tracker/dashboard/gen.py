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
if "current" not in pt: pt["current"]=pt.pop("current2027",{"entries":None,"commits":None,"note":"UNKNOWN"})
else: pt.pop("current2027",None)
d.setdefault("teamShort",d.get("team"))
d.setdefault("coach",None)
# conference standing lives in teamStatus.conference (generic; label is the conference name from the data, never assumed here)
# legacy: older data files kept the standing under teamStatus.big12; map it so old data keeps its standing
ts=d.get("teamStatus")
if isinstance(ts,dict) and "big12" in ts:
    old=ts.pop("big12")
    if not ts.get("conference") and isinstance(old,dict):
        ts["conference"]=dict(old)  # no label is invented; with none the page says "Conference standing"
d.setdefault("page",{"title":f"{d['team']} Recruiting & Portal Dashboard","summary":f"{d.get('classYear','')} class, transfer portal and rankings."})
for c in d["commits"]: c.setdefault("hsGames",[])
# --- ratings, stored as each service publishes them: [{service, value, scale, stars, natl, pos, state, source}]
# New shape: commit.ratings. Old shape (r247 / industry / composite247 / espn) is still accepted; each fills the other.
NULLR={"stars":None,"rating":None,"natl":None,"pos":None,"state":None}
def kind(s):
    s=(s or "").lower()
    if "composite" in s: return "composite"
    if "espn" in s: return "espn"
    if "industry" in s or "rivals" in s: return "industry"
    if "247" in s: return "r247"
    return None
# --- player ranks: a number, "NR" (the source lists the player as unranked), or null (no source or value, shows UNKNOWN)
NR_WORDS={"nr","n/r","unranked","not ranked","no rank"}
def nr(v):
    if isinstance(v,str):
        s=v.strip()
        if s.lower() in NR_WORDS: return "NR"
        s=s.lstrip("#").replace(",","")
        if s.isdigit(): return int(s)
        return None
    if isinstance(v,bool): return None
    return v if isinstance(v,(int,float)) else None
RANK_KEYS=("natl","pos","state")
def fix_ranks(o,keys=RANK_KEYS):
    if isinstance(o,dict):
        for k in keys:
            if k in o: o[k]=nr(o[k])
for c in d["commits"]:
    for k in ("r247","industry","composite247"): fix_ranks(c.get(k))
    fix_ranks(c.get("espn"),("rank",))
    for r in c.get("ratings") or []: fix_ranks(r)
for c in d.get("nextClassCommits") or []: fix_ranks(c,("natl247","pos247","state247"))
if isinstance(ts,dict):
    # team polls: "Unranked", "NR" and similar all store as "NR" (the page shows "Unranked");
    # "NR" needs the poll's source link, otherwise nothing was read and the value is null (UNKNOWN)
    for k in ("ap","coaches","cfp"):
        po=ts.get(k); fix_ranks(po,("value","prev"))
        if isinstance(po,dict):
            if po.get("value")=="NR" and not po.get("source"): po["value"]=None
            po.setdefault("date",None)
def robj(service,value,scale,stars=None,natl=None,pos=None,state=None,source=None):
    return {"service":service,"value":value,"scale":scale,"stars":stars,"natl":natl,"pos":pos,"state":state,"source":source}
for c in d["commits"]:
    rs=c.get("ratings")
    if rs:
        rs=[robj(r.get("service") or "UNKNOWN",r.get("value"),r.get("scale"),r.get("stars"),r.get("natl"),r.get("pos"),r.get("state"),r.get("source")) for r in rs]
        for r in rs:
            k=kind(r["service"])
            if k in ("r247","industry") and not c.get(k): c[k]={"stars":r["stars"],"rating":r["value"],"natl":r["natl"],"pos":r["pos"],"state":r["state"]}
            if k=="composite" and c.get("composite247") is None: c["composite247"]={"rating":r["value"],"natl":r["natl"],"pos":r["pos"],"state":r["state"]}
            if k=="espn" and c.get("espn") is None: c["espn"]={"rank":r["natl"],"grade":r["value"]}
    else:
        # old shape carries no scale; a value of 1 or less can only be on a 0-1 scale
        sc=lambda v:None if v is None else ("0-1" if v<=1 else "0-100")
        rs=[]
        a=c.get("r247") or {}
        if any(v is not None for v in a.values()): rs.append(robj("247Sports",a.get("rating"),sc(a.get("rating")),a.get("stars"),a.get("natl"),a.get("pos"),a.get("state")))
        cp=c.get("composite247")
        if cp and any(v is not None for v in cp.values()):
            v=cp.get("rating"); st=None if v is None else (5 if v>=0.9834 else 4 if v>=0.89 else 3)
            rs.append(robj("247Sports Composite",v,"0-1",st,cp.get("natl"),cp.get("pos"),cp.get("state")))
        a=c.get("industry") or {}
        if any(v is not None for v in a.values()): rs.append(robj("Rivals Industry",a.get("rating"),sc(a.get("rating")),a.get("stars"),a.get("natl"),a.get("pos"),a.get("state")))
        e=c.get("espn")
        if e and any(v is not None for v in e.values()): rs.append(robj("ESPN",e.get("grade"),sc(e.get("grade")),None,e.get("rank")))
    c["ratings"]=rs
    for k in ("r247","industry"): c[k]=dict(NULLR,**(c.get(k) or {}))
    c.setdefault("composite247",None); c.setdefault("espn",None)
    c.setdefault("height",None); c.setdefault("weight",None); c.setdefault("commitDate",None)
def rk(x): return x.get("rank") if isinstance(x.get("rank"),(int,float)) else 10**6  # null ranks sort last
def renumber(xs):
    for i,x in enumerate(xs,1):
        if not isinstance(x.get("rank"),(int,float)): x["rank"]=i
    return xs
FORUM_CAP=15
# one board per site; several sites allowed. "forum" (single) is still accepted.
fs=[x for x in (d.get("forums") or ([d["forum"]] if d.get("forum") else [])) if x]
for f in fs:
    f.setdefault("totalThreads",len(f["threads"]))
    f["threads"]=renumber(sorted(f["threads"],key=rk)[:FORUM_CAP])
d["forums"]=fs; d.pop("forum",None)  # the page sets forum = forums[0]
# --- Top on X (5 posts) and Top reads (5 items). Premium reads keep the headline only.
# Top on X: when confirmed-source posts exist, at least 3 of the 5 (or all of them, if fewer) are confirmed source; buzz fills the rest.
X_CAP=5; READS_CAP=5; X_MIN_CONFIRMED=3
def is_confirmed(x): return str(x.get("tag","")).startswith("confirmed")
def pick_x(posts):
    posts=sorted(posts,key=rk)
    conf=[x for x in posts if is_confirmed(x)]
    keep=conf[:min(X_MIN_CONFIRMED,len(conf))]
    rest=[x for x in posts if not any(x is k for k in keep)]
    chosen=sorted(keep+rest[:X_CAP-len(keep)],key=rk)
    for i,x in enumerate(chosen,1): x["rank"]=i
    return chosen
tx=d.get("topOnX")
if tx: tx["posts"]=pick_x(tx.get("posts") or [])
tr=d.get("topReads")
if tr:
    tr["items"]=renumber(sorted(tr.get("items") or [],key=rk)[:READS_CAP])
    for x in tr["items"]:
        x.setdefault("premium",False); x.setdefault("premiumSite",None)
        if x["premium"]: x["why"]=None
d.setdefault("topOnX",None); d.setdefault("topReads",None); d.setdefault("digest",None)
# --- serviceNames: the service each caption names. Captions never hard-code a service.
# Legacy fill: only where an older field name itself names the service and that field holds a value.
# commitDates has no such field, so it stays null (the caption says "Source: UNKNOWN") unless the data names it.
sn=dict(d.get("serviceNames") or {})
has=lambda xs:any(v is not None for v in xs)
lc=pt.get("lastCycle") or {}
legacy={
 "ratings":"247Sports" if has([x for c in d["commits"] for x in (c["r247"] or {}).values()]) else None,
 "industry":"Rivals Industry" if has([x for c in d["commits"] for x in (c["industry"] or {}).values()]) else None,
 "classRank":"247Sports" if d.get("nextClassRank247") is not None else None,
 "portalRating":"On3" if has([lc.get(k) for k in ("rankOn3","inOn3","outOn3","avgOn3","topOn3")]) else None,
 "portalValue":"TransferPortl" if has([lc.get(k) for k in ("inTP","outTP")]) or lc.get("netValueTP") not in (None,"","UNKNOWN") else None,
 "commitDates":None}
for k,v in legacy.items():
    if not sn.get(k): sn[k]=v
d["serviceNames"]=sn
# --- flatten ratings to tuples (smaller page source)
rt=lambda r:[r.get(k) for k in ("stars","rating","natl","pos","state")]
for c in d["commits"]:
    c["r247"]=rt(c["r247"]); c["industry"]=rt(c["industry"])
# --- transfers: each row's own source link, or null (the page shows "No source")
for p in pt["incoming"]:
    srcs=p.pop("sources",None) or []
    if not p.get("source"): p["source"]=next((u for u in srcs if isinstance(u,str) and u),None)
for p in pt["outgoing"]: p["source"]=p.get("source") or None
for p in d.get("departures") or []: p["source"]=p.get("source") or None
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
type RT = [number | null, number | null, Rank, Rank, Rank];
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
