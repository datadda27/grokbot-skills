import {
  Page, Section, Grid, Metrics, Segmented, Select, Toggle, Button, Table, Rows, Properties,
  Status, Callout, Bars, StackedBars, Columns, Legend, Text, Avatar, useGrokTheme,
  useState, useMemo, useRef, useEffect,
} from "grok/canvas";
import type { CSSProperties, ReactNode, KeyboardEvent } from "grok/canvas";

// ---------------------------------------------------------------------------
// DATA (filled by gen.py from dashboard-data.json; no team text lives in this file)
// ---------------------------------------------------------------------------
type Rating = { stars: number | null; rating: number | null; natl: number | null; pos: number | null; state: number | null };
type Commit = {
  id: string; name: string; pos: string; group: string; height: string; weight: number;
  highSchool: string; hometown: string; state: string; commitDate: string;
  r247: Rating; industry: Rating;
  composite247: { rating: number | null; natl: number | null; pos: number | null; state: number | null } | null;
  espn: { rank: number | null; grade: number | null } | null;
  offers: string | null; visits: string | null; status: string; note: string | null; sources: string[];
  rpm: { lines: [string, number][]; source: string; premium: boolean; premiumSite?: string | null } | null;
  picks: { items: [string, number, string][]; team: string; source: string; premium: boolean; premiumSite?: string | null } | null;
  hsGames?: HsGame[];
};
type HsGame = { date: string | null; opponent: string | null; line: string | null; sourceName: string | null; url: string | null };
type Labelled = { label: string; source: string; premium: boolean; premiumSite?: string | null; detail: string };
type FlipItem = Labelled & { name: string; dir: "Defend" | "Target"; cls: string; pos: string; commitId: string | null };
type Target = Labelled & { name: string; cls: string; pos: string };
type NewsItem = { date: string | null; type: string; title: string; detail: string; reporter: string | null; source: string; premium: boolean; premiumSite?: string | null; label: string | null; extraSource?: string };
type CalItem = { start: string; end: string | null; type: string; title: string; detail: string; source: string | null; when?: string | null };
type Incoming = { name: string; pos: string; fromSchool: string | null; on3TR: number | null; rating247T: number | null; note: string | null; tag?: string | null; sources: string[] };
type Outgoing = { name: string; pos: string; toSchool: string | null; starsTP: number | null; source: string };
type ForumThread = { id: string; url: string; title: string; replies: number | null; views: number | null; latest: string; staffPosts: number; cat: string; label: string | null; summary: string; verdict: "Read" | "Skim" | "Skip"; why: string; rank: number; readIn?: boolean };
type Sticky = { id: string; url: string; title: string; author: string; replies: number | null; views: number | null; started: string; staffPosts: number; summary: string; verdict?: "Read" | "Skim" | "Skip" | null; readIn?: boolean };
type FPost = { thread: string; url: string; date: string; summary: string };
type Poster = { name: string; username: string | null; profile: string | null; why: string; staff: boolean; found: boolean; status: string; statusNote: string | null; posts: FPost[]; postsNote: string | null; noteUrl?: string | null; noteLabel?: string | null };
type Suggested = { username: string; name: string; profile: string | null; why: string; label: string; posts: FPost[] };
type Fact = { value: string | null; source: string | null; note?: string | null };
type Poll = { value: number | null; prev?: number | null; source: string | null; note?: string | null };
type TeamStatus = {
  asOf: string; record?: Fact | null; conference?: (Fact & { label?: string | null }) | null;
  ap?: Poll | null; coaches?: Poll | null; cfp?: Poll | null; lastGame?: Fact | null;
  schedule?: { source: string | null; results: string[]; upcoming: string[] } | null;
};
type Change = { date: string | null; title: string; source: string; premium: boolean; premiumSite?: string | null };
type XPost = { rank: number; url: string; author: string; handle: string; authorType?: "player" | "official" | "insider" | "media" | "fan" | "other"; tag: "confirmed source" | "buzz, unconfirmed"; topic?: "Recruiting" | "Portal" | "Team"; summary: string; quotes: number | null; replies: number | null; reposts: number | null; goodNews?: boolean; postedAt: string };
type TopRead = { rank: number; headline: string; why?: string | null; url: string; site: string; premium: boolean; premiumSite?: string | null; topic?: "Recruiting" | "Portal" | "Team"; goodNews?: boolean; date?: string | null };
type DigestInfo = { mode: "auto" | "daily" | "weekly"; activeModes?: string[]; schedule?: string; seasonStart?: string | null; seasonEnd?: string | null; lastSent?: string | null; nextDigest?: string | null; note?: string | null };
type Forum = { board: string; site: string; url: string; premium: boolean; premiumSite?: string | null; asOf: string; asOfLabel: string; windowHours: number; prefs: string; method: string; totalThreads?: number; threads: ForumThread[]; stickies: Sticky[] };
type Dashboard = {
  team: string; teamShort: string; coach: string | null; classYear: number; asOf: string; asOfLabel: string; tz: string; notes: string[];
  page: { title: string; summary: string };
  sourceLinks?: Record<string, string>;
  ratingsNote?: string | null; compositionNote?: string | null; rankingsNote?: string | null; calendarNote?: string | null; visitReportsNote?: string | null;
  changes?: { since: string; items: Change[] } | null;
  teamRankings: { service: string; rank: number | null; detail: string; asOf: string | null; source: string }[];
  rankHistory: { service: string; date: string; rank: number; source: string; premium?: boolean; premiumSite?: string | null }[];
  commits: Commit[];
  decommits: { name: string; pos: string; hs: string; date: string | null; outcome: string; rating247: number | null; source: string }[];
  nextClassCommits: { name: string; pos: string; ht: string; wt: number; hs: string; commitDate: string; rating247: number | null; natl247: number | null; pos247: number | null; state247: number | null; composite: number | null; status: string; source: string }[];
  nextClassRank247: number | null;
  news: NewsItem[];
  upcomingVisits: string;
  portal: {
    window: { opens: string; closes: string; status: string; source: string };
    current: { entries: number; commits: number; note: string };
    lastCycle: { rankOn3: number; rank247: number; inOn3: number; outOn3: number; inTP: number; outTP: number; avgOn3: number; topOn3: number; netValueTP: string; sourceOn3: string; source247: string; sourceTP: string };
    incoming: Incoming[]; outgoing: Outgoing[];
    impact: { pos: string; out: number; inn: number; net: string }[];
    rosterRisk?: { items: string[]; source: string | null; note: string } | null;
    noLosses?: string[];
  };
  rosterCountsTP: Record<string, number>;
  departures: { name: string; pos: string; date: string; note: string; source: string }[];
  calendar: CalItem[];
  nextVisitWeekend: { date: string; opponent: string; away: string | null; note?: string | null; items: { name: string; label: string; detail: string; source: string }[]; source: string; premium: boolean; premiumSite?: string | null } | null;
  flipWatch: FlipItem[];
  targets: Target[];
  premiumNote: string;
  forum?: Forum | null;
  forums?: Forum[];
  topOnX?: { asOf: string; asOfLabel?: string; windowHours?: number; method?: string; posts: XPost[] } | null;
  topReads?: { asOf: string; asOfLabel?: string; items: TopRead[] } | null;
  digest?: DigestInfo | null;
  following?: { note: string; scanned: string; posters: Poster[]; suggested: Suggested[] } | null;
  teamStatus?: TeamStatus | null;
};

export const DATA: Dashboard = __DATA__;

export const TODAY = DATA.asOf;
const FORUMS: Forum[] = (DATA.forums ?? (DATA.forum ? [DATA.forum] : [])).filter((f) => f.threads.length > 0);
const FORUM = FORUMS[0] ?? null;
const XTOP = DATA.topOnX && DATA.topOnX.posts.length ? DATA.topOnX : null;
const READS = DATA.topReads && DATA.topReads.items.length ? DATA.topReads : null;
const FOLLOWING = DATA.following && DATA.following.posters.length ? DATA.following : null;
const YEAR = String(DATA.classYear);
const TEAM = DATA.teamStatus ?? null;

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
const UNK = "UNKNOWN";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function parts(d: string) { const [y, m, dd] = d.split("-").map(Number); return { y, m, d: dd }; }
function fmtDate(d: string | null): string { if (!d) return UNK; const p = parts(d); return `${MONTHS[p.m - 1]} ${p.d}, ${p.y}`; }
function fmtShort(d: string): string { const p = parts(d); return `${MONTHS[p.m - 1]} ${p.d}`; }
function dayNum(d: string): number { const p = parts(d); return Date.UTC(p.y, p.m - 1, p.d) / 86400000; }
function no(n: number | null | undefined): string { return n == null ? "NA" : `No. ${n.toLocaleString("en-US")}`; }
function host(u: string): string { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return u; } }
function rankLine(r: { natl: number | null; pos: number | null; state: number | null }, pos: string): string {
  const bits: string[] = [];
  bits.push(r.natl == null ? "Natl NA" : `Natl ${r.natl}`);
  bits.push(r.pos == null ? `${pos} NA` : `${pos} ${r.pos}`);
  bits.push(r.state == null ? "State NA" : `State ${r.state}`);
  return bits.join(" · ");
}
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setW(el.getBoundingClientRect().width);
    update();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, w };
}
function typo(t: { fontSize: string; lineHeight: string; letterSpacing: string }): CSSProperties {
  return { fontSize: t.fontSize, lineHeight: t.lineHeight, letterSpacing: t.letterSpacing };
}
function statusTone(s: string): "success" | "warning" | "danger" | "accent" | "neutral" {
  if (s === "Flip rumor") return "warning";
  if (s === "Watch") return "warning";
  return "success";
}

function labelTone(l: string): "success" | "warning" | "danger" | "accent" | "neutral" {
  if (l === "Speculation" || l === "Rumor" || l === "Unverified") return "warning";
  if (l === "Opinion") return "accent";
  if (l === "False") return "danger";
  return "neutral";
}
// ---------------------------------------------------------------------------
// small visuals
// ---------------------------------------------------------------------------
function Stars({ n }: { n: number | null }) {
  const t = useGrokTheme();
  if (n == null) return <span style={{ color: t.text.tertiary, ...typo(t.font.label) }}>Unrated</span>;
  return (
    <span aria-label={`${n} stars`} style={{ letterSpacing: "1px", ...typo(t.font.label) }}>
      <span style={{ color: t.text.primary }}>{"★".repeat(n)}</span>
      <span style={{ color: t.text.tertiary }}>{"★".repeat(5 - n)}</span>
    </span>
  );
}
function Chip({ children }: { children: ReactNode }) {
  const t = useGrokTheme();
  return (
    <span style={{ background: t.fill.secondary, color: t.text.secondary, borderRadius: t.radius.full, padding: "1px 8px", whiteSpace: "nowrap", ...typo(t.font.label) }}>
      {children}
    </span>
  );
}
function Premium({ site }: { site?: string | null }) {
  return <Status tone="accent">{site ? `Premium · ${site}` : "Premium"}</Status>;
}
function premTxt(premium: boolean | undefined, site?: string | null): string { return premium ? (site ? ` · Premium · ${site}` : " · Premium") : ""; }
function SourceLinks({ urls }: { urls: string[] }) {
  const t = useGrokTheme();
  const uniq = Array.from(new Set(urls));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {uniq.map((u, i) => (
        <a key={u} href={u} target="_blank" rel="noreferrer" style={{ color: t.text.secondary, textDecoration: "underline", wordBreak: "break-all", ...typo(t.font.body2) }}>
          {i + 1}. {host(u)}
        </a>
      ))}
    </div>
  );
}
function SrcLink({ url, label }: { url: string | null; label?: string }) {
  const t = useGrokTheme();
  if (!url) return <span style={{ color: t.text.tertiary, ...typo(t.font.label) }}>No source</span>;
  return (
    <a href={url} target="_blank" rel="noreferrer" style={{ color: t.text.secondary, textDecoration: "underline", ...typo(t.font.label) }}>
      {label ?? host(url)}
    </a>
  );
}

// ---------------------------------------------------------------------------
// commits
// ---------------------------------------------------------------------------
function CommitCard({ c, selected, onClick }: { c: Commit; selected: boolean; onClick: () => void }) {
  const t = useGrokTheme();
  const watch = c.status !== "Committed";
  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={selected}
      onClick={onClick}
      onKeyDown={(e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
      style={{
        display: "flex", gap: 12, alignItems: "center", padding: "10px 12px", cursor: "pointer",
        borderRadius: t.radius.lg, border: `1px solid ${selected ? t.border.focus : t.border.default}`,
        background: selected ? t.fill.hover : t.bg.base, transition: `background ${t.motion.hover} ${t.motion.easing}`,
      }}
    >
      <div style={{ width: 44, flexShrink: 0, textAlign: "center", borderRadius: t.radius.md, background: t.fill.secondary, padding: "6px 0" }}>
        <div style={{ color: t.text.primary, fontWeight: t.weight.semibold, ...typo(t.font.heading3) }}>{c.r247.rating ?? "NA"}</div>
        <div style={{ color: t.text.tertiary, ...typo(t.font.caption) }}>247</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: t.text.primary, fontWeight: t.weight.semibold, ...typo(t.font.body1) }}>{c.name}</span>
          <Chip>{c.pos}</Chip>
          {watch ? <Status tone={statusTone(c.status)}>{c.status}</Status> : null}
        </div>
        <div style={{ color: t.text.secondary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", ...typo(t.font.body2) }}>
          {c.highSchool} · {c.hometown.split(" (")[0]}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 2 }}>
          <Stars n={c.r247.stars} />
          <span style={{ color: t.text.tertiary, ...typo(t.font.label) }}>
            {c.r247.natl != null ? `Natl ${c.r247.natl} · ` : ""}{c.pos} {c.r247.pos ?? "NA"} · {fmtShort(c.commitDate)}{c.commitDate.slice(0, 4) !== TODAY.slice(0, 4) ? ` '${c.commitDate.slice(2, 4)}` : ""}
          </span>
        </div>
      </div>
      <span aria-hidden style={{ color: t.text.tertiary, ...typo(t.font.body1) }}>{selected ? "−" : "›"}</span>
    </div>
  );
}

function CommitDetail({ c, onClose }: { c: Commit; onClose?: () => void }) {
  const t = useGrokTheme();
  const comp = c.composite247;
  const ratingRows: ReactNode[][] = [
    ["247Sports", <Stars key="s" n={c.r247.stars} />, c.r247.rating == null ? UNK : String(c.r247.rating), rankLine(c.r247, c.pos)],
    ["247 Composite", comp?.rating != null ? <Stars key="s2" n={comp.rating >= 0.9834 ? 5 : comp.rating >= 0.89 ? 4 : 3} /> : UNK,
      comp?.rating != null ? comp.rating.toFixed(4) : UNK, comp && (comp.natl != null || comp.pos != null) ? rankLine(comp, c.pos) : UNK],
    ["Rivals Industry", <Stars key="s3" n={c.industry.stars} />, c.industry.rating == null ? UNK : c.industry.rating.toFixed(2),
      c.industry.natl == null && c.industry.pos == null ? UNK : rankLine(c.industry, c.pos)],
    ["ESPN", UNK, c.espn?.grade != null ? String(c.espn.grade) : UNK, c.espn?.rank != null ? `SC Next 300 No. ${c.espn.rank}` : UNK],
  ];
  return (
    <div style={{ border: `1px solid ${t.border.default}`, borderRadius: t.radius.xl, padding: 16, background: t.bg.base, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: t.text.primary, fontWeight: 700, ...typo(t.font.heading3) }}>{c.name}</div>
          <div style={{ color: t.text.secondary, ...typo(t.font.body2) }}>{c.pos} · {c.height} / {c.weight} · Class of {YEAR}</div>
          <div style={{ marginTop: 6 }}><Status tone={statusTone(c.status)}>{c.status}</Status></div>
        </div>
        {onClose ? <Button label="Close" onClick={onClose} /> : null}
      </div>
      <Properties items={[
        { label: "High school", value: c.highSchool },
        { label: "Hometown", value: c.hometown },
        { label: "Committed", value: fmtDate(c.commitDate) },
        { label: "Offers / finalists", value: c.offers ?? UNK },
        { label: "Official visits", value: c.visits ?? UNK },
      ]} />
      {c.note ? <Text>{c.note}</Text> : null}
      <div>
        <div style={{ color: t.text.secondary, marginBottom: 6, ...typo(t.font.subtext) }}>Ratings by service</div>
        <Table columns={["Service", "Stars", "Rating", "Ranks"]} rows={ratingRows} align={["start", "start", "end", "start"]} />
        {DATA.ratingsNote ? <div style={{ color: t.text.tertiary, marginTop: 6, ...typo(t.font.caption) }}>{DATA.ratingsNote}</div> : null}
      </div>
      {c.rpm ? (
        <div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
            <span style={{ color: t.text.secondary, ...typo(t.font.subtext) }}>Rivals RPM prediction</span>{c.rpm.premium ? <Premium site={c.rpm.premiumSite} /> : null}
          </div>
          <Bars bars={c.rpm.lines.map(([team, pct]) => ({ label: team, value: pct, display: `${pct.toFixed(1)}%` }))} emphasis={0} />
          <div style={{ marginTop: 4 }}><SrcLink url={c.rpm.source} label="On3 / Rivals player page" /></div>
        </div>
      ) : null}
      {c.picks ? (
        <div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
            <span style={{ color: t.text.secondary, ...typo(t.font.subtext) }}>Expert picks: {c.picks.team}</span>{c.picks.premium ? <Premium site={c.picks.premiumSite} /> : null}
          </div>
          <Table columns={["Expert", "Confidence", "Date"]} rows={c.picks.items.map(([who, pct, dt]) => [who, `${pct}%`, fmtShort(dt) + ", " + dt.slice(0, 4)])} />
          <div style={{ marginTop: 4 }}><SrcLink url={c.picks.source} label={c.picks.premiumSite ? `${c.picks.premiumSite} expert predictions` : undefined} /></div>
        </div>
      ) : null}
      {c.hsGames && c.hsGames.length ? (
        <div>
          <div style={{ color: t.text.secondary, marginBottom: 6, ...typo(t.font.subtext) }}>This season</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[...c.hsGames].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "")).slice(0, 5).map((g, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderTop: i ? `1px solid ${t.border.subtle}` : "none" }}>
                <div style={{ width: 52, flexShrink: 0, color: t.text.tertiary, ...typo(t.font.label) }}>{g.date ? fmtShort(g.date) : UNK}</div>
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                  <div style={{ color: t.text.primary, fontWeight: t.weight.medium, ...typo(t.font.body2) }}>{g.opponent ?? `Opponent ${UNK}`}</div>
                  <div style={{ color: t.text.secondary, ...typo(t.font.body2) }}>{g.line ?? UNK}</div>
                  <SrcLink url={g.url} label={g.sourceName ?? undefined} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <div>
        <div style={{ color: t.text.secondary, marginBottom: 6, ...typo(t.font.subtext) }}>Sources</div>
        <SourceLinks urls={c.sources} />
      </div>
    </div>
  );
}

const GROUPS = ["All", "QB", "RB", "WR", "TE", "OL", "DL", "EDGE", "LB", "DB", "ATH", "ST"] as const;
type SortKey = "rank" | "newest" | "oldest" | "industry" | "name";

function CommitsTab({ selectedId, setSelectedId }: { selectedId: string | null; setSelectedId: (id: string | null) => void }) {
  const t = useGrokTheme();
  const { ref, w } = useWidth<HTMLDivElement>();
  const twoPane = w >= 860;
  const [group, setGroup] = useState<string>("All");
  const [stars, setStars] = useState<string>("All");
  const [sort, setSort] = useState<SortKey>("rank");
  const [watchOnly, setWatchOnly] = useState(false);

  const list = useMemo(() => {
    let l = DATA.commits.filter((c) => (group === "All" || c.group === group) && (stars === "All" || String(c.r247.stars) === stars) && (!watchOnly || c.status !== "Committed"));
    const by: Record<SortKey, (a: Commit, b: Commit) => number> = {
      rank: (a, b) => (b.r247.rating ?? 0) - (a.r247.rating ?? 0) || (a.r247.pos ?? 999) - (b.r247.pos ?? 999),
      newest: (a, b) => b.commitDate.localeCompare(a.commitDate),
      oldest: (a, b) => a.commitDate.localeCompare(b.commitDate),
      industry: (a, b) => (b.industry.rating ?? 0) - (a.industry.rating ?? 0),
      name: (a, b) => a.name.localeCompare(b.name),
    };
    return [...l].sort(by[sort]);
  }, [group, stars, sort, watchOnly]);

  const effectiveSel = twoPane ? (selectedId && list.some((c) => c.id === selectedId) ? selectedId : list[0]?.id ?? null) : selectedId;
  const selected = DATA.commits.find((c) => c.id === effectiveSel) ?? null;
  const toggle = (id: string) => setSelectedId(twoPane ? id : selectedId === id ? null : id);

  const listEl = (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {list.length === 0 ? <Text>No commits match these filters.</Text> : null}
      {list.map((c) => (
        <div key={c.id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <CommitCard c={c} selected={c.id === effectiveSel} onClick={() => toggle(c.id)} />
          {!twoPane && c.id === effectiveSel ? <CommitDetail c={c} onClose={() => setSelectedId(null)} /> : null}
        </div>
      ))}
    </div>
  );

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Section heading={`${YEAR} commits`} caption={`Showing ${list.length} of ${DATA.commits.length}. Tap a commit for ratings, offers, visits and sources. Ratings per 247Sports unless noted.`}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-end", marginBottom: 12 }}>
          <Select label="Position" options={GROUPS.map((g) => ({ value: g, label: g === "All" ? "All positions" : g }))} value={group} onChange={setGroup} />
          <Select label="247 stars" options={[{ value: "All", label: "All stars" }, { value: "5", label: "5 star" }, { value: "4", label: "4 star" }, { value: "3", label: "3 star" }]} value={stars} onChange={setStars} />
          <Select<SortKey> label="Sort" options={[{ value: "rank", label: "247 rating" }, { value: "industry", label: "Rivals Industry rating" }, { value: "newest", label: "Newest commit" }, { value: "oldest", label: "Oldest commit" }, { value: "name", label: "Name" }]} value={sort} onChange={setSort} />
          <Toggle label="Watch list only" value={watchOnly} onChange={setWatchOnly} />
        </div>
        {twoPane ? (
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)", gap: 16, alignItems: "start" }}>
            {listEl}
            <div style={{ position: "sticky", top: 12 }}>{selected ? <CommitDetail c={selected} /> : null}</div>
          </div>
        ) : listEl}
      </Section>

      <Grid columns={2}>
        {DATA.decommits.length ? <Section heading="Decommits and changes" caption={`${YEAR} cycle`}>
          <Rows rows={DATA.decommits.map((d) => ({ lead: d.date ? fmtShort(d.date) + (d.date.slice(0, 4) !== TODAY.slice(0, 4) ? ` '${d.date.slice(2, 4)}` : "") : UNK, title: `${d.name} (${d.pos})`, detail: `${d.hs}. ${d.outcome}.`, meta: d.rating247 != null ? `247: ${d.rating247}` : "" }))} />
          <div style={{ marginTop: 8, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {Array.from(new Set(DATA.decommits.map((d) => d.source))).map((u) => <SrcLink key={u} url={u} />)}
          </div>
        </Section> : null}
        {DATA.nextClassCommits.length ? <Section heading={`${DATA.classYear + 1} commits`} caption={`247 class rank ${DATA.nextClassRank247 == null ? UNK : `No. ${DATA.nextClassRank247}`}`}>
          <Rows rows={DATA.nextClassCommits.map((c) => ({ lead: c.pos, title: c.name, detail: `${c.hs} · ${c.ht} / ${c.wt} · committed ${fmtDate(c.commitDate)}${c.composite ? ` · Composite ${c.composite.toFixed(4)}` : ""}`, meta: `247: ${c.rating247 ?? UNK}`, status: c.status === "Committed" ? undefined : { label: c.status, tone: "warning" as const } }))} />
          <div style={{ marginTop: 8, display: "flex", gap: 10, flexWrap: "wrap" }}>{Array.from(new Set(DATA.nextClassCommits.map((c) => c.source))).map((u) => <SrcLink key={u} url={u} />)}</div>
        </Section> : null}
      </Grid>
      <Composition />
    </div>
  );
}

// ---------------------------------------------------------------------------
// overview
// ---------------------------------------------------------------------------
function countBy<T>(arr: T[], key: (x: T) => string): Record<string, number> {
  const r: Record<string, number> = {};
  for (const x of arr) { const k = key(x); r[k] = (r[k] ?? 0) + 1; }
  return r;
}
// US postal codes to state names (generic lookup, not team data).
const STATE_NAMES: Record<string, string> = Object.fromEntries("AL Alabama|AK Alaska|AZ Arizona|AR Arkansas|CA California|CO Colorado|CT Connecticut|DE Delaware|DC District of Columbia|FL Florida|GA Georgia|HI Hawaii|ID Idaho|IL Illinois|IN Indiana|IA Iowa|KS Kansas|KY Kentucky|LA Louisiana|ME Maine|MD Maryland|MA Massachusetts|MI Michigan|MN Minnesota|MS Mississippi|MO Missouri|MT Montana|NE Nebraska|NV Nevada|NH New Hampshire|NJ New Jersey|NM New Mexico|NY New York|NC North Carolina|ND North Dakota|OH Ohio|OK Oklahoma|OR Oregon|PA Pennsylvania|RI Rhode Island|SC South Carolina|SD South Dakota|TN Tennessee|TX Texas|UT Utah|VT Vermont|VA Virginia|WA Washington|WV West Virginia|WI Wisconsin|WY Wyoming|INTL International".split("|").map((s) => [s.slice(0, s.indexOf(" ")), s.slice(s.indexOf(" ") + 1)]));

function Composition() {
  const t = useGrokTheme();
  const [ctx, setCtx] = useState(false);
  const n = DATA.commits.length;
  const s247 = countBy(DATA.commits, (c) => String(c.r247.stars ?? "U"));
  const sInd = countBy(DATA.commits, (c) => String(c.industry.stars ?? "U"));
  const states = Object.entries(countBy(DATA.commits, (c) => c.state)).sort((a, b) => b[1] - a[1]);
  const groupOrder = ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "DB", "ATH", "ST"];
  const grp = countBy(DATA.commits, (c) => (c.group === "EDGE" ? "DL" : c.group));
  const outBy: Record<string, number> = {}; DATA.portal.impact.forEach((i) => { outBy[i.pos] = i.out; });
  const months = countBy(DATA.commits, (c) => c.commitDate.slice(0, 7));
  const monthKeys = Object.keys(months).sort();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Grid columns={3}>
        <Section heading="Star mix" caption={`By service. Rivals Industry rates ${n - (sInd["U"] ?? 0)} of ${n}.`}>
          <StackedBars series={["5-star", "4-star", "3-star", "Unrated"]} bars={[
            { label: "247Sports", values: [s247["5"] ?? 0, s247["4"] ?? 0, s247["3"] ?? 0, s247["U"] ?? 0] },
            { label: "Rivals Industry", values: [sInd["5"] ?? 0, sInd["4"] ?? 0, sInd["3"] ?? 0, sInd["U"] ?? 0] },
          ]} />
        </Section>
        <Section heading="Where they're from" caption="High school state">
          <Bars bars={states.map(([k, v]) => ({ label: STATE_NAMES[k] ?? k, value: v, display: String(v), meta: `${Math.round((v / n) * 100)}%` }))} />
        </Section>
        <Section heading="Commits by month" caption="Commit date, 247Sports">
          <Columns points={monthKeys.map((k) => ({ label: `${MONTHS[Number(k.slice(5, 7)) - 1]} ${k.slice(2, 4)}`, value: months[k] }))} />
        </Section>
      </Grid>
      <Section heading="Position groups" caption={`${YEAR} commits by group (EDGE counted with DL). Needs are not published by the staff; roster and portal losses below are context from TransferPortl, not targets.`}>
        <Bars bars={groupOrder.map((g) => ({ label: g, value: grp[g] ?? 0, display: String(grp[g] ?? 0), meta: ctx && g !== "ATH" ? `roster ${DATA.rosterCountsTP[g] ?? "NA"} · lost ${outBy[g] ?? ((DATA.portal.noLosses ?? []).includes(g) ? 0 : "NA")}` : undefined }))} emphasis="none" />
        <div style={{ marginTop: 10 }}><Toggle label={`Show roster size and ${Number(DATA.portal.window.opens.slice(0, 4)) - 1} portal losses`} value={ctx} onChange={setCtx} /></div>
        {ctx && DATA.compositionNote ? <div style={{ color: t.text.tertiary, marginTop: 6, ...typo(t.font.caption) }}>{DATA.compositionNote}</div> : null}
      </Section>
    </div>
  );
}


function calRows(items: CalItem[]) {
  return items.map((c) => {
    const now = dayNum(TODAY) >= dayNum(c.start) && (c.end ? dayNum(TODAY) <= dayNum(c.end) : dayNum(TODAY) === dayNum(c.start));
    const lead = c.when ? c.when : c.end && c.end !== c.start ? `${fmtShort(c.start)} to ${fmtShort(c.end)}` : fmtShort(c.start);
    return { lead, title: c.title, detail: c.detail, meta: c.start.slice(0, 4), status: now ? { label: "Now", tone: "success" as const } : c.type === "Unknown" ? { label: "Unknown", tone: "warning" as const } : undefined };
  });
}

function prevRank(service: string) {
  const key = service.split(" (")[0];
  const h = DATA.rankHistory.filter((x) => x.service === key).sort((a, b) => a.date.localeCompare(b.date));
  return h.length >= 2 ? { prev: h[h.length - 2], last: h[h.length - 1] } : null;
}
function portalCal(): CalItem {
  const pw = DATA.portal.window;
  return { start: pw.opens, end: pw.closes, type: "Portal", title: "Transfer portal window", detail: pw.status, source: pw.source };
}
function KeyDates() {
  const all = [...DATA.calendar, portalCal()].filter((c) => c.type !== "Unknown");
  const today = dayNum(TODAY);
  const now = all.filter((c) => dayNum(c.start) <= today && dayNum(c.end ?? c.start) >= today);
  const next = all.filter((c) => dayNum(c.start) > today).sort((a, b) => a.start.localeCompare(b.start))[0];
  const items = [
    ...now.map((c) => ({ label: "Now", value: `${c.title}, through ${fmtDate(c.end ?? c.start)}` })),
    ...(next ? [{ label: "Next", value: `${next.title}, ${fmtDate(next.start)}` }] : []),
  ];
  if (!items.length) return null;
  return <Properties items={[...items, { label: "As of", value: DATA.asOfLabel }]} />;
}
function OverviewTab({ go }: { go: (tab: Tab, commitId?: string, view?: RecView) => void }) {
  const t = useGrokTheme();
  const top = [...DATA.commits].sort((a, b) => (b.r247.rating ?? 0) - (a.r247.rating ?? 0)).slice(0, 5);
  const s247 = countBy(DATA.commits, (c) => String(c.r247.stars));
  const ranked = DATA.teamRankings.filter((r) => r.rank != null).slice(0, 3);
  const ch = DATA.changes && DATA.changes.items.length ? DATA.changes : null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <DigestLine />
      <Metrics metrics={[
        ...ranked.map((r) => {
          const p = prevRank(r.service);
          const up = p && r.rank != null && p.prev.rank > r.rank;
          const down = p && r.rank != null && p.prev.rank < r.rank;
          return {
            value: no(r.rank), label: `${r.service} class rank`,
            detail: p ? `${up ? "Up from" : down ? "Down from" : "Same as"} No. ${p.prev.rank} on ${fmtShort(p.prev.date)}${p.prev.premium ? ` (Premium${p.prev.premiumSite ? ` · ${p.prev.premiumSite}` : ""})` : ""}` : r.detail,
            tone: up ? "success" as const : undefined,
          };
        }),
        { value: String(DATA.commits.length), label: `${YEAR} commits`, detail: `${s247["5"] ?? 0} five, ${s247["4"] ?? 0} four, ${s247["3"] ?? 0} three-star (247)` },
      ]} />
      {ch ? (
        <Section heading="What changed since the last run" caption={`New since ${fmtDate(ch.since)}`}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {ch.items.map((x, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderTop: i ? `1px solid ${t.border.subtle}` : "none" }}>
                <div style={{ width: 52, flexShrink: 0, color: t.text.tertiary, ...typo(t.font.label) }}>{x.date ? fmtShort(x.date) : UNK}</div>
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
                  <div style={{ color: t.text.primary, ...typo(t.font.body2) }}>{x.title}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    {x.premium ? <Premium site={x.premiumSite} /> : null}
                    <SrcLink url={x.source} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      ) : null}
      <Grid columns={3}>
        <Section heading="Top commits" caption="By 247 rating">
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {top.map((c) => (
              <div key={c.id} role="button" tabIndex={0} onClick={() => go("commits", c.id)} onKeyDown={(e: KeyboardEvent) => { if (e.key === "Enter") go("commits", c.id); }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px", cursor: "pointer", borderBottom: `1px solid ${t.border.subtle}` }}>
                <span style={{ width: 28, color: t.text.primary, fontWeight: t.weight.semibold, ...typo(t.font.body2) }}>{c.r247.rating ?? "NA"}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ color: t.text.primary, ...typo(t.font.body2) }}>{c.name}</span>
                  <span style={{ color: t.text.tertiary, ...typo(t.font.label) }}> {c.pos} · Natl {c.r247.natl ?? "NA"}</span>
                </span>
                <Stars n={c.r247.stars} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10 }}><Button label={`All ${DATA.commits.length} commits`} onClick={() => go("commits")} /></div>
        </Section>
        {DATA.flipWatch.length ? (
          <Section heading="Flip watch" caption="Commits to defend and flip targets">
            <Rows rows={DATA.flipWatch.map((f) => ({ title: `${f.name} (${f.cls} ${f.pos})`, detail: `${f.label}${premTxt(f.premium, f.premiumSite)}`, status: { label: f.dir === "Defend" ? "Defend" : "Target", tone: f.dir === "Defend" ? "warning" as const : "success" as const } }))} />
            <div style={{ marginTop: 10 }}><Button label="Flip watch" onClick={() => go("news", undefined, "flips")} /></div>
          </Section>
        ) : null}
        <Section heading="Next key date" caption="Recruiting calendar and portal window">
          <KeyDates />
          <div style={{ marginTop: 10 }}><Button label="Full calendar" onClick={() => go("portal")} /></div>
        </Section>
      </Grid>
      {READS ? <ReadsToday go={(x) => go(x)} /> : null}
      {FORUM ? <BoardToday go={(x) => go(x)} /> : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// news
// ---------------------------------------------------------------------------
type NewsFilter = "All" | "Visit" | "Rumor" | "Ranking" | "Commit";
type RecView = "news" | "visits" | "targets" | "flips";
function NewsList({ items }: { items: NewsItem[] }) {
  const t = useGrokTheme();
  const tone = (ty: string) => ty === "Rumor" ? "warning" : ty === "False" ? "danger" : ty === "Visit" ? "accent" : ty === "Commit" || ty === "Offer" ? "success" : "neutral";
  const label = (ty: string) => ty === "False" ? "False report" : ty;
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {items.map((n, i) => (
        <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderTop: i ? `1px solid ${t.border.subtle}` : "none" }}>
          <div style={{ width: 52, flexShrink: 0, color: t.text.tertiary, ...typo(t.font.label) }}>{n.date ? fmtShort(n.date) : "Date UNKNOWN"}</div>
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <Status tone={tone(n.type)}>{label(n.type)}</Status>
              {n.label && n.label !== n.type ? <Status tone={labelTone(n.label)}>{n.label}</Status> : null}
              {n.premium ? <Premium site={n.premiumSite} /> : null}
            </div>
            <div style={{ color: t.text.primary, fontWeight: t.weight.medium, ...typo(t.font.body1) }}>{n.title}</div>
            <div style={{ color: t.text.secondary, ...typo(t.font.body2) }}>{n.detail}{n.reporter ? ` Reporter: ${n.reporter}.` : ""}</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <SrcLink url={n.source} />
              {n.extraSource ? <SrcLink url={n.extraSource} /> : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
function LabelledCard({ title, sub, item, onOpen }: { title: string; sub: string; item: Labelled; onOpen?: () => void }) {
  const t = useGrokTheme();
  return (
    <div style={{ border: `1px solid ${t.border.subtle}`, borderRadius: t.radius.lg, padding: 12, display: "flex", flexDirection: "column", gap: 6, background: t.bg.base }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
        <span style={{ color: t.text.primary, fontWeight: t.weight.semibold, ...typo(t.font.body1) }}>{title}</span>
        <span style={{ color: t.text.tertiary, ...typo(t.font.label) }}>{sub}</span>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <Status tone={labelTone(item.label)}>{item.label}</Status>
        {item.premium ? <Premium site={item.premiumSite} /> : null}
      </div>
      <div style={{ color: t.text.secondary, ...typo(t.font.body2) }}>{item.detail}</div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <SrcLink url={item.source} />
        {onOpen ? <Button label="Open commit" onClick={onOpen} /> : null}
      </div>
    </div>
  );
}
function FlipWatch({ go }: { go: (tab: Tab, commitId?: string, view?: RecView) => void }) {
  const defend = DATA.flipWatch.filter((f) => f.dir === "Defend");
  const target = DATA.flipWatch.filter((f) => f.dir === "Target");
  return (
    <Grid columns={2}>
      {defend.length ? <Section heading={`Defend: ${DATA.teamShort} commits drawing flip interest`} caption={`${defend.length} players`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {defend.map((f) => <LabelledCard key={f.name} title={f.name} sub={`${f.cls} ${f.pos}`} item={f} onOpen={f.commitId ? () => go("commits", f.commitId!) : undefined} />)}
        </div>
      </Section> : null}
      {target.length ? <Section heading={`Attack: other schools' commits ${DATA.teamShort} is pursuing`} caption={`${target.length} player${target.length === 1 ? "" : "s"}`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {target.map((f) => <LabelledCard key={f.name} title={f.name} sub={`${f.cls} ${f.pos}`} item={f} />)}
        </div>
      </Section> : null}
    </Grid>
  );
}
type TClass = string;
function TargetsView() {
  const [c, setC] = useState<TClass>("All");
  const c1 = String(DATA.classYear + 1), c2 = String(DATA.classYear + 2);
  const cls = (x: Target): TClass => x.cls === c1 || x.cls === c2 ? x.cls : "Other";
  const k = countBy(DATA.targets, (x) => cls(x));
  const items = DATA.targets.filter((x) => c === "All" || cls(x) === c);
  return (
    <Section heading="Targets" caption={`Uncommitted prospects visiting or holding ${DATA.teamShort} offers. Position or class shows UNKNOWN when the source did not list it.`}>
      <div style={{ marginBottom: 12, display: "flex", flexWrap: "wrap", gap: 10 }}>
        <Select<TClass> label="Class" options={[
          { value: "All", label: `All classes (${DATA.targets.length})` },
          { value: c1, label: `${c1} (${k[c1] ?? 0})` },
          { value: c2, label: `${c2} (${k[c2] ?? 0})` },
          { value: "Other", label: `Other classes (${k["Other"] ?? 0})` },
        ]} value={c} onChange={setC} />
      </div>
      <Grid columns={3}>
        {items.map((x) => <LabelledCard key={x.name} title={x.name} sub={`${x.cls === "UNKNOWN" ? "Class UNKNOWN" : x.cls} · ${x.pos === "UNKNOWN" ? "Pos UNKNOWN" : x.pos}`} item={x} />)}
      </Grid>
    </Section>
  );
}
function VisitsView() {
  const nv = DATA.nextVisitWeekend;
  const visits = DATA.news.filter((n) => n.type === "Visit");
  const awayDate = nv && nv.away ? nv.away.slice(0, 10) : null;
  const awayRest = nv && nv.away ? nv.away.slice(10).trim() : "";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {nv ? (
        <Section heading={`Next home visit weekend: ${fmtDate(nv.date)} vs ${nv.opponent}`} caption={`${awayDate && /^\d{4}-\d{2}-\d{2}$/.test(awayDate) && dayNum(awayDate) >= dayNum(TODAY) ? `${DATA.teamShort} plays ${fmtShort(awayDate)} ${awayRest} first. ` : ""}${nv.note ?? ""}`}>
          <Rows rows={nv.items.map((x) => ({ title: x.name, detail: x.detail, status: { label: x.label, tone: labelTone(x.label) === "neutral" ? "success" as const : "warning" as const } }))} />
          <div style={{ marginTop: 8, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            {nv.premium ? <Premium site={nv.premiumSite} /> : null}
            {nv.items.map((x) => <SrcLink key={x.source} url={x.source} />)}
          </div>
        </Section>
      ) : null}
      {visits.length ? (
        <Section heading="Visit reports" caption={DATA.visitReportsNote ?? "Most recent first"}>
          <NewsList items={visits} />
        </Section>
      ) : null}
    </div>
  );
}
function NewsTab({ go, view, setView }: { go: (tab: Tab, commitId?: string, view?: RecView) => void; view: RecView; setView: (v: RecView) => void }) {
  const t = useGrokTheme();
  const [f, setF] = useState<NewsFilter>("All");
  const [prem, setPrem] = useState(false);
  const norm = (ty: string) => ty === "False" ? "Rumor" : ty === "Offer" ? "Commit" : ty;
  const counts = countBy(DATA.news, (n) => norm(n.type));
  const items = DATA.news.filter((n) => (f === "All" || norm(n.type) === f) && (!prem || n.premium));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Chips<RecView> label="Recruiting views" options={[
        { value: "news", label: "News", count: DATA.news.length },
        { value: "visits", label: "Visits" },
        { value: "targets", label: "Targets", count: DATA.targets.length },
        { value: "flips", label: "Flip watch", count: DATA.flipWatch.length },
      ]} value={view} onChange={setView} />
      <div style={{ color: t.text.tertiary, ...typo(t.font.caption) }}>{DATA.premiumNote}</div>
      {view === "news" ? (
        <Section heading="Recruiting news" caption="Visits, rumors, rankings, commitments and offers. Rumors, speculation and opinion are labeled as the reporter framed them.">
          <div style={{ marginBottom: 12, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            <Select<NewsFilter> label="Type" options={[
              { value: "All", label: `All (${DATA.news.length})` },
              { value: "Visit", label: `Visits (${counts["Visit"] ?? 0})` },
              { value: "Rumor", label: `Rumors (${counts["Rumor"] ?? 0})` },
              { value: "Ranking", label: `Rankings (${counts["Ranking"] ?? 0})` },
              { value: "Commit", label: `Commits & offers (${counts["Commit"] ?? 0})` },
            ]} value={f} onChange={setF} />
            <Toggle label="Premium only" value={prem} onChange={setPrem} />
          </div>
          <NewsList items={items} />
        </Section>
      ) : null}
      {view === "visits" ? <VisitsView /> : null}
      {view === "targets" ? <TargetsView /> : null}
      {view === "flips" ? <FlipWatch go={go} /> : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// portal
// ---------------------------------------------------------------------------
type Dir = "in" | "out";
function PortalTab() {
  const t = useGrokTheme();
  const [dir, setDir] = useState<Dir>("in");
  const [src, setSrc] = useState<"on3" | "247">("on3");
  const lc = DATA.portal.lastCycle;
  const pw = DATA.portal.window;
  const py = pw.opens.slice(0, 4), ly = String(Number(py) - 1);
  const risk = DATA.portal.rosterRisk && DATA.portal.rosterRisk.items.length ? DATA.portal.rosterRisk : null;
  const inc = [...DATA.portal.incoming].sort((a, b) => src === "on3" ? (b.on3TR ?? 0) - (a.on3TR ?? 0) : (b.rating247T ?? 0) - (a.rating247T ?? 0));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Metrics metrics={[
        { value: fmtShort(pw.opens), label: `${py} window opens`, detail: `Closes ${fmtDate(pw.closes)}` },
        { value: `No. ${lc.rankOn3}`, label: `${ly} portal class, On3` },
        { value: `No. ${lc.rank247}`, label: `${ly} portal class, 247` },
        { value: `${lc.inOn3} / ${lc.outOn3}`, label: `${ly} in / out (On3)`, detail: `TransferPortl: ${lc.inTP} / ${lc.outTP}` },
      ]} />
      <Grid columns={2}>
        <Section heading={`Current cycle (${py})`} caption={`${pw.status}, as of ${DATA.asOfLabel}`}>
          <Text>{DATA.portal.current.note} Exceptions: players on teams in a postseason game get 5 days after their final game; a head coach change opens up to 15 days.</Text>
          <div style={{ marginTop: 8 }}><SrcLink url={pw.source} label="NCAA transfer windows (PDF)" /></div>
        </Section>
        {DATA.departures.length ? <Section heading="Departures since the portal" caption={`Off the ${ly} incoming list`}>
          <Rows rows={DATA.departures.map((d) => ({ lead: fmtShort(d.date), title: `${d.name} (${d.pos})`, detail: d.note }))} />
          <div style={{ marginTop: 8 }}><SrcLink url={DATA.departures[0]?.source ?? null} /></div>
        </Section> : null}
      </Grid>
      <Section heading={`${ly} portal class`} caption={`On3 average transfer rating ${lc.avgOn3}, top ${lc.topOn3}. TransferPortl net value ${lc.netValueTP}.`}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-end", marginBottom: 12 }}>
          <Segmented<Dir> options={[{ value: "in", label: "Incoming", count: DATA.portal.incoming.length }, { value: "out", label: "Outgoing", count: DATA.portal.outgoing.length }]} value={dir} onChange={setDir} />
          {dir === "in" ? <Select<"on3" | "247"> label="Rating" options={[{ value: "on3", label: "On3 transfer rating" }, { value: "247", label: "247 transfer rating" }]} value={src} onChange={setSrc} /> : null}
        </div>
        {dir === "in" ? (
          <Table columns={["Player", "Pos", "From", src === "on3" ? "On3 TR" : "247 (T)"]}
            rows={inc.map((p) => [p.tag ? `${p.name} (${p.tag})` : p.name, p.pos, p.fromSchool ?? UNK, src === "on3" ? (p.on3TR != null ? p.on3TR.toFixed(2) : UNK) : (p.rating247T != null ? p.rating247T.toFixed(2) : UNK)])} />
        ) : (
          <Table columns={["Player", "Pos", "To", "Stars"]}
            rows={DATA.portal.outgoing.map((p) => [p.name, p.pos, p.toSchool ?? UNK, p.starsTP != null ? `${p.starsTP}★` : "NA"])} />
        )}
        <div style={{ marginTop: 8, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <SrcLink url={lc.sourceOn3} label="On3 transfers" /><SrcLink url={lc.source247} label="247 transfers" /><SrcLink url={lc.sourceTP} label="TransferPortl" />
        </div>
        <div style={{ color: t.text.tertiary, marginTop: 6, ...typo(t.font.caption) }}>On3 counts {lc.inOn3} in and {lc.outOn3} out; TransferPortl counts {lc.inTP} in and {lc.outTP} out. Outgoing stars are TransferPortl's.</div>
      </Section>
      <Grid columns={2}>
        <Section heading="Impact by position" caption={`${ly} portal, TransferPortl`}>
          <Table columns={["Group", "Out", "In", "Net value"]} rows={DATA.portal.impact.map((i) => [i.pos, String(i.out), String(i.inn), i.net])} />
        </Section>
        {risk ? <Section heading="Roster risk" caption={risk.note}>
          <Rows rows={risk.items.map((r, i) => ({ lead: String(i + 1), title: r }))} />
          {risk.source ? <div style={{ marginTop: 8 }}><SrcLink url={risk.source} /></div> : null}
        </Section> : null}
      </Grid>
      <Section heading="Key dates" caption={DATA.calendarNote ?? "Recruiting calendar"} collapsible defaultOpen>
        <Rows rows={calRows([...DATA.calendar, portalCal()].sort((a, b) => a.start.localeCompare(b.start)))} />
        <div style={{ marginTop: 8, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {Array.from(new Set([...DATA.calendar, portalCal()].map((c) => c.source).filter((s): s is string => !!s))).map((u) => <SrcLink key={u} url={u} />)}
        </div>
      </Section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// rankings
// ---------------------------------------------------------------------------
function RankTrend() {
  const t = useGrokTheme();
  const { ref, w } = useWidth<HTMLDivElement>();
  const hist = DATA.rankHistory;
  const services = Array.from(new Set(hist.map((h) => h.service)));
  const W = Math.max(Math.round(w), 280), H = 220, pl = 46, pr = 16, pt = 14, pb = 28;
  const dates = hist.map((h) => h.date).sort();
  const first = parts(dates[0] ?? TODAY), last = parts(dates[dates.length - 1] ?? TODAY);
  const startISO = `${first.y}-${String(first.m).padStart(2, "0")}-01`;
  const endM = last.m === 12 ? { y: last.y + 1, m: 1 } : { y: last.y, m: last.m + 1 };
  const endISO = `${endM.y}-${String(endM.m).padStart(2, "0")}-01`;
  const x0 = dayNum(startISO), x1 = Math.max(dayNum(endISO), x0 + 1);
  const worst = Math.max(10, ...hist.map((h) => h.rank));
  const step = worst <= 20 ? 5 : worst <= 50 ? 10 : 25;
  const maxRank = Math.ceil(worst / step) * step;
  const X = (d: string) => pl + ((dayNum(d) - x0) / (x1 - x0)) * (W - pl - pr);
  const Y = (r: number) => pt + ((r - 1) / (maxRank - 1)) * (H - pt - pb);
  const ticks = [1, ...Array.from({ length: maxRank / step }, (_, i) => (i + 1) * step)];
  const monthTicks: string[] = [];
  for (let y = first.y, m = first.m; y < endM.y || (y === endM.y && m <= endM.m); m === 12 ? (y++, m = 1) : m++) monthTicks.push(`${y}-${String(m).padStart(2, "0")}-01`);
  const every = Math.max(1, Math.ceil(monthTicks.length / (W < 420 ? 4 : 8)));
  if (!hist.length) return null;
  return (
    <div ref={ref}>
      <Legend names={services} dots />
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Class rank over time, lower is better" style={{ display: "block", marginTop: 8 }}>
        {ticks.map((r) => (
          <g key={r}>
            <line x1={pl} x2={W - pr} y1={Y(r)} y2={Y(r)} stroke={t.border.subtle} />
            <text x={pl - 8} y={Y(r) + 4} textAnchor="end" fill={t.text.tertiary} style={{ ...typo(t.font.label), fontFamily: t.font.family }}>No. {r}</text>
          </g>
        ))}
        {monthTicks.filter((_, i) => i % every === 0).map((d) => (
          <text key={d} x={X(d)} y={H - 8} textAnchor="middle" fill={t.text.tertiary} style={{ ...typo(t.font.label), fontFamily: t.font.family }}>{MONTHS[parts(d).m - 1]}</text>
        ))}
        {services.map((s, si) => {
          const pts = hist.filter((h) => h.service === s).sort((a, b) => a.date.localeCompare(b.date));
          const color = t.dataviz.categorical[si] ?? t.dataviz.other;
          return (
            <g key={s}>
              <polyline fill="none" stroke={color} strokeWidth={2} points={pts.map((p) => `${X(p.date)},${Y(p.rank)}`).join(" ")} />
              {pts.map((p) => (
                <circle key={p.date} cx={X(p.date)} cy={Y(p.rank)} r={4} fill={color} stroke={t.bg.base} strokeWidth={1.5}><title>{`${s}: No. ${p.rank} on ${fmtDate(p.date)}${p.premium ? ` (Premium${p.premiumSite ? ` · ${p.premiumSite}` : ""})` : ""}`}</title></circle>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

type PSort = "247" | "ind" | "espn";
function RankingsTab({ go }: { go: (tab: Tab, commitId?: string, view?: RecView) => void }) {
  const t = useGrokTheme();
  const [ps, setPs] = useState<PSort>("247");
  const players = useMemo(() => {
    const key = (c: Commit) => ps === "247" ? (c.r247.natl ?? 1000 + (100 - (c.r247.rating ?? 0)) * 10) : ps === "ind" ? (c.industry.natl ?? 99999) : (c.espn?.rank ?? 99999);
    return [...DATA.commits].sort((a, b) => key(a) - key(b));
  }, [ps]);
  const cell247 = (c: Commit) => c.r247.natl != null ? `No. ${c.r247.natl}` : `${c.pos} ${c.r247.pos == null ? "NA" : `No. ${c.r247.pos}`}`;
  const cellInd = (c: Commit) => c.industry.natl != null ? `No. ${c.industry.natl.toLocaleString("en-US")}` : UNK;
  const cellEspn = (c: Commit) => c.espn?.rank != null ? `No. ${c.espn.rank}` : UNK;
  const hist = DATA.rankHistory;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Grid columns={2}>
        <Section heading="Team class rankings" caption={`${YEAR} class, as of ${fmtDate(DATA.teamRankings.map((r) => r.asOf ?? "").sort().pop() || null)}`}>
          <Table columns={["Service", "Rank", "Detail", "As of"]} rows={DATA.teamRankings.map((r) => [r.service, r.rank == null ? UNK : `No. ${r.rank}`, r.detail, r.asOf ? fmtShort(r.asOf) : UNK])} />
          <div style={{ marginTop: 8, display: "flex", gap: 10, flexWrap: "wrap" }}>{DATA.teamRankings.map((r) => <SrcLink key={r.source} url={r.source} label={r.service} />)}</div>
        </Section>
        <Section heading="Class rank over time" caption="Higher on the chart is better. Only dated, sourced points are drawn.">
          <RankTrend />
          <div style={{ color: t.text.tertiary, marginTop: 6, ...typo(t.font.caption) }}>
            {hist.map((h) => `${h.service} No. ${h.rank} (${fmtShort(h.date)}${h.premium ? `, Premium${h.premiumSite ? ` · ${h.premiumSite}` : ""}` : ""})`).join(" · ")}
          </div>
        </Section>
      </Grid>
      <Section heading="Player rankings" caption="National rank by service. Where 247 has no national rank, its position rank shows. Tap a name for the full profile.">
        <div style={{ marginBottom: 12 }}>
          <Segmented<PSort> options={[{ value: "247", label: "Sort by 247" }, { value: "ind", label: "Rivals Industry" }, { value: "espn", label: "ESPN" }]} value={ps} onChange={setPs} />
        </div>
        <Table columns={["Player", "247", "Rivals Ind.", "ESPN"]} rows={players.map((c) => [
          <span key={c.id} role="button" tabIndex={0} onClick={() => go("commits", c.id)} onKeyDown={(e: KeyboardEvent) => { if (e.key === "Enter") go("commits", c.id); }} style={{ cursor: "pointer", textDecoration: "underline", textDecorationColor: t.border.strong }}>{c.name} <span style={{ color: t.text.tertiary }}>{c.pos}</span></span>,
          cell247(c), cellInd(c), cellEspn(c),
        ])} />
        {DATA.rankingsNote ? <div style={{ color: t.text.tertiary, marginTop: 6, ...typo(t.font.caption) }}>{DATA.rankingsNote}</div> : null}
      </Section>
      <Section heading="Portal team rankings" caption={`${Number(DATA.portal.window.opens.slice(0, 4)) - 1} transfer class`}>
        <Rows rows={[
          { title: "On3 transfer rank", meta: `No. ${DATA.portal.lastCycle.rankOn3}` },
          { title: "247Sports transfer rank", meta: `No. ${DATA.portal.lastCycle.rank247}` },
          { title: "TransferPortl net value", meta: DATA.portal.lastCycle.netValueTP },
        ]} />
      </Section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// chips (top nav and view switches; rows wrap on a phone)
// ---------------------------------------------------------------------------
type ChipOpt<T extends string> = { value: T; label: string; count?: number };
function Chips<T extends string>({ options, value, onChange, label }: { options: ChipOpt<T>[]; value: T; onChange: (v: T) => void; label: string }) {
  const t = useGrokTheme();
  return (
    <div role="tablist" aria-label={label} style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button key={o.value} type="button" role="tab" aria-selected={on} onClick={() => onChange(o.value)}
            style={{
              minHeight: 34, padding: "6px 12px", borderRadius: t.radius.full, border: "none", cursor: "pointer",
              background: on ? t.fill.primary : t.fill.secondary, color: on ? t.text.onPrimary : t.text.secondary,
              fontWeight: on ? t.weight.semibold : t.weight.medium, fontFamily: "inherit", whiteSpace: "nowrap",
              transition: `background ${t.motion.hover} ${t.motion.easing}`, ...typo(t.font.body2),
            }}>
            {o.label}{o.count != null ? <span style={{ marginLeft: 6, opacity: 0.7 }}>{o.count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// forum
// ---------------------------------------------------------------------------
function clock(iso: string): string {
  const m = /T(\d{2}):(\d{2})/.exec(iso);
  if (!m) return UNK;
  const h = Number(m[1]); const ap = h >= 12 ? "PM" : "AM"; const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m[2]} ${ap}`;
}
function ago(iso: string, base?: string): string {
  const asOf = base ?? DATA.forum?.asOf ?? TODAY;
  const diff = (Date.parse(asOf) - Date.parse(iso)) / 60000;
  if (!isFinite(diff)) return UNK;
  if (diff < 1) return "just now";
  if (diff < 60) return `${Math.round(diff)}m ago`;
  const day = iso.slice(0, 10);
  if (day === asOf.slice(0, 10)) return `${Math.round(diff / 60)}h ago`;
  return `${fmtShort(day)}, ${clock(iso)}`;
}
function count(n: number | null): string { return n == null ? UNK : n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}K` : String(n); }
function MetaLine({ items }: { items: string[] }) {
  const t = useGrokTheme();
  return <div style={{ color: t.text.tertiary, display: "flex", flexWrap: "wrap", columnGap: 10, rowGap: 2, ...typo(t.font.label) }}>{items.map((x, i) => <span key={i}>{x}</span>)}</div>;
}
function TitleLink({ url, children }: { url: string; children: ReactNode }) {
  const t = useGrokTheme();
  return <a href={url} target="_blank" rel="noreferrer" style={{ color: t.text.primary, fontWeight: t.weight.semibold, textDecoration: "none", ...typo(t.font.body1) }}>{children}</a>;
}
function ThreadCard({ x, site }: { x: ForumThread; site?: string | null }) {
  const t = useGrokTheme();
  const read = x.verdict === "Read";
  return (
    <div style={{ display: "flex", gap: 12, padding: 12, border: `1px solid ${t.border.subtle}`, borderRadius: t.radius.lg, background: t.bg.base }}>
      <div aria-label={`Rank ${x.rank}`} style={{ width: 32, height: 32, flexShrink: 0, borderRadius: t.radius.full, display: "flex", alignItems: "center", justifyContent: "center",
        background: read ? t.fill.primary : t.fill.secondary, color: read ? t.text.onPrimary : t.text.secondary, fontWeight: t.weight.semibold, ...typo(t.font.body2) }}>{x.rank}</div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 5 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <Status tone={verdictTone(x.verdict)}>{x.verdict}</Status>
          {x.readIn ? <Premium site={site} /> : null}
          {x.staffPosts > 0 ? <Status tone="neutral">{`${x.staffPosts} staff`}</Status> : null}
          {x.label ? <Status tone={labelTone(x.label)}>{x.label}</Status> : null}
          <Chip>{x.cat}</Chip>
        </div>
        <TitleLink url={x.url}>{x.title}</TitleLink>
        <MetaLine items={[`${count(x.replies)} replies`, `${count(x.views)} views`, `${x.staffPosts} staff post${x.staffPosts === 1 ? "" : "s"}`, `last post ${ago(x.latest)}`]} />
        <div style={{ color: t.text.secondary, ...typo(t.font.body2) }}>{x.summary}</div>
        <div style={{ color: t.text.tertiary, ...typo(t.font.caption) }}>Why No. {x.rank}: {x.why}</div>
      </div>
    </div>
  );
}
function verdictTone(v: string): "success" | "warning" | "neutral" { return v === "Read" ? "success" : v === "Skim" ? "warning" : "neutral"; }
type ForumFilter = "All" | "Read" | "Skim" | "Skip" | "Staff";
function ForumTab({ F }: { F: NonNullable<Dashboard["forum"]> }) {
  const t = useGrokTheme();
  const [f, setF] = useState<ForumFilter>("All");
  const site = F.premiumSite ?? F.site;
  const shown = F.threads.filter((x) => f === "All" || (f === "Staff" ? x.staffPosts > 0 : x.verdict === f));
  const total = F.totalThreads ?? F.threads.length;
  const nRead = F.threads.filter((x) => x.verdict === "Read").length;
  const nStaff = F.threads.filter((x) => x.staffPosts > 0).length;
  const nSkim = F.threads.filter((x) => x.verdict === "Skim").length;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {F.premium ? <Premium site={site} /> : null}
          <a href={F.url} target="_blank" rel="noreferrer" style={{ color: t.text.primary, fontWeight: t.weight.semibold, ...typo(t.font.body1) }}>{F.board}</a>
          <span style={{ color: t.text.tertiary, ...typo(t.font.label) }}>{F.site} · as of {F.asOfLabel}</span>
        </div>
        <div style={{ color: t.text.secondary, ...typo(t.font.body2) }}>{F.prefs}</div>
      </div>
      <Metrics metrics={[
        { value: String(total), label: "Active threads", detail: `Posts in the last ${F.windowHours} hours. Top ${F.threads.length} shown.` },
        { value: String(nRead), label: "Worth reading", detail: "Read badge" },
        { value: String(nStaff), label: "With staff posts", detail: "Staff replied at least once" },
        { value: String(F.stickies.length), label: "Sticky staff threads", detail: "Stories and live threads" },
      ]} />
      <Section heading={`Top ${F.threads.length} threads, ranked for you`} caption={`${total} active threads today; the top ${F.threads.length} are kept. Fan claims are rumors until staff confirm them. Tap a title to open it on the board.`}>
        <div style={{ marginBottom: 12 }}>
          <Chips<ForumFilter> label="Filter threads" value={f} onChange={setF} options={[
            { value: "All", label: "All", count: F.threads.length },
            { value: "Read", label: "Read", count: nRead },
            { value: "Skim", label: "Skim", count: nSkim },
            { value: "Skip", label: "Skip", count: F.threads.length - nRead - nSkim },
            { value: "Staff", label: "Has staff", count: nStaff },
          ]} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {shown.map((x) => <ThreadCard key={x.id} x={x} site={site} />)}
          {shown.length === 0 ? <div style={{ color: t.text.tertiary, ...typo(t.font.body2) }}>No threads match this filter.</div> : null}
        </div>
      </Section>
      {F.stickies.length ? <Section heading="Sticky staff threads" caption="Staff stories, live threads and updates pinned to the top of the board" collapsible defaultOpen>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {F.stickies.map((x, i) => (
            <div key={x.id} style={{ display: "flex", flexDirection: "column", gap: 3, padding: "10px 0", borderTop: i ? `1px solid ${t.border.subtle}` : "none" }}>
              {x.verdict || x.readIn ? (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  {x.verdict ? <Status tone={verdictTone(x.verdict)}>{x.verdict}</Status> : null}
                  {x.readIn ? <Premium site={site} /> : null}
                </div>
              ) : null}
              <TitleLink url={x.url}>{x.title}</TitleLink>
              <MetaLine items={[x.author, `posted ${ago(x.started)}`, `${count(x.replies)} replies`, `${count(x.views)} views`, `${x.staffPosts} staff post${x.staffPosts === 1 ? "" : "s"}`]} />
              <div style={{ color: t.text.secondary, ...typo(t.font.body2) }}>{x.summary}</div>
            </div>
          ))}
        </div>
      </Section> : null}
      <div style={{ color: t.text.tertiary, ...typo(t.font.caption) }}>How ranking works: {F.method}</div>
    </div>
  );
}

function BoardTab() {
  const [i, setI] = useState<string>("0");
  const F = FORUMS[Number(i)] ?? FORUMS[0];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {FORUMS.length > 1 ? (
        <Chips<string> label="Pick a board" value={i} onChange={setI}
          options={FORUMS.map((f, k) => ({ value: String(k), label: `${f.site}: ${f.board}`, count: f.threads.filter((x) => x.verdict === "Read").length }))} />
      ) : null}
      <ForumTab key={i} F={F} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// top reads and top on X
// ---------------------------------------------------------------------------
function BigLink({ url, label }: { url: string; label: string }) {
  const t = useGrokTheme();
  return (
    <a href={url} target="_blank" rel="noreferrer"
      style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 44, padding: "10px 16px", borderRadius: t.radius.full,
        background: t.fill.primary, color: t.text.onPrimary, fontWeight: t.weight.semibold, textDecoration: "none", textAlign: "center", ...typo(t.font.body2) }}>
      {label}
    </a>
  );
}
function RankDot({ n, on }: { n: number; on: boolean }) {
  const t = useGrokTheme();
  return (
    <div aria-label={`Rank ${n}`} style={{ width: 32, height: 32, flexShrink: 0, borderRadius: t.radius.full, display: "flex", alignItems: "center", justifyContent: "center",
      background: on ? t.fill.primary : t.fill.secondary, color: on ? t.text.onPrimary : t.text.secondary, fontWeight: t.weight.semibold, ...typo(t.font.body2) }}>{n}</div>
  );
}
function ReadCard({ r }: { r: TopRead }) {
  const t = useGrokTheme();
  return (
    <div style={{ display: "flex", gap: 12, padding: 12, border: `1px solid ${t.border.subtle}`, borderRadius: t.radius.lg, background: t.bg.base }}>
      <RankDot n={r.rank} on={!!r.goodNews} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {r.goodNews ? <Status tone="success">Good news</Status> : null}
          {r.premium ? <Premium site={r.premiumSite ?? r.site} /> : null}
          {r.topic ? <Chip>{r.topic}</Chip> : null}
          <span style={{ color: t.text.tertiary, ...typo(t.font.label) }}>{r.site}{r.date ? ` · ${fmtShort(r.date)}` : ""}</span>
        </div>
        <div style={{ color: t.text.primary, fontWeight: t.weight.semibold, ...typo(t.font.body1) }}>{r.headline}</div>
        <div style={{ color: t.text.secondary, ...typo(t.font.body2) }}>
          {r.premium ? `There's Premium news at ${r.site}. Open it there for the details.` : (r.why ?? "")}
        </div>
        <BigLink url={r.url} label={`Read it at ${r.site}`} />
      </div>
    </div>
  );
}
type ReadFilter = "All" | "Good" | "Recruiting" | "Portal" | "Team";
function TopReadsTab({ R }: { R: NonNullable<Dashboard["topReads"]> }) {
  const t = useGrokTheme();
  const [f, setF] = useState<ReadFilter>("All");
  const shown = R.items.filter((x) => f === "All" || (f === "Good" ? x.goodNews : x.topic === f));
  const n = (fn: (x: TopRead) => boolean) => R.items.filter(fn).length;
  return (
    <Section heading="Top reads today" caption={`Worth opening, as of ${R.asOfLabel ?? R.asOf}. Tap through to read on the site. Premium items show the headline only.`}>
      <div style={{ marginBottom: 12 }}>
        <Chips<ReadFilter> label="Filter reads" value={f} onChange={setF} options={[
          { value: "All", label: "All", count: R.items.length },
          { value: "Good", label: "Good news", count: n((x) => !!x.goodNews) },
          { value: "Recruiting", label: "Recruiting", count: n((x) => x.topic === "Recruiting") },
          { value: "Portal", label: "Portal", count: n((x) => x.topic === "Portal") },
          { value: "Team", label: "Team", count: n((x) => x.topic === "Team") },
        ]} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {shown.map((r) => <ReadCard key={r.rank} r={r} />)}
        {shown.length === 0 ? <div style={{ color: t.text.tertiary, ...typo(t.font.body2) }}>No reads match this filter.</div> : null}
      </div>
      {R.items.some((x) => x.premium) ? <div style={{ marginTop: 12, color: t.text.tertiary, ...typo(t.font.caption) }}>Premium summaries are for your own use only. No screenshots, reposts, or sharing.</div> : null}
    </Section>
  );
}
function XCard({ p, base }: { p: XPost; base: string }) {
  const t = useGrokTheme();
  const ok = p.tag === "confirmed source";
  return (
    <div style={{ display: "flex", gap: 12, padding: 12, border: `1px solid ${t.border.subtle}`, borderRadius: t.radius.lg, background: t.bg.base }}>
      <RankDot n={p.rank} on={ok} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 5 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <Status tone={ok ? "success" : "warning"}>{ok ? "Confirmed source" : "Buzz, unconfirmed"}</Status>
          {p.goodNews ? <Status tone="success">Good news</Status> : null}
          {p.topic ? <Chip>{p.topic}</Chip> : null}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "baseline" }}>
          <span style={{ color: t.text.primary, fontWeight: t.weight.semibold, ...typo(t.font.body1) }}>{p.author}</span>
          <span style={{ color: t.text.tertiary, ...typo(t.font.label) }}>{p.handle}</span>
        </div>
        <div style={{ color: t.text.secondary, ...typo(t.font.body2) }}>{p.summary}</div>
        <MetaLine items={[`${count(p.quotes)} quotes`, `${count(p.replies)} replies`, `${count(p.reposts)} reposts`, ago(p.postedAt, base)]} />
        <BigLink url={p.url} label="Open the post on X" />
      </div>
    </div>
  );
}
function TopOnXTab({ X }: { X: NonNullable<Dashboard["topOnX"]> }) {
  const t = useGrokTheme();
  return (
    <Section heading="Top on X" caption={`Top ${X.posts.length} posts about the team in the last ${X.windowHours ?? 24} hours, as of ${X.asOfLabel ?? X.asOf}. Confirmed source means a player, official account, or trusted insider; anything else is buzz.`}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {X.posts.map((p) => <XCard key={p.url} p={p} base={X.asOf} />)}
      </div>
      {X.method ? <div style={{ marginTop: 12, color: t.text.tertiary, ...typo(t.font.caption) }}>How ranking works: {X.method}</div> : null}
    </Section>
  );
}
function ReadsToday({ go }: { go: (tab: Tab) => void }) {
  const t = useGrokTheme();
  if (!READS) return null;
  const top = READS.items.slice(0, 3);
  return (
    <Section heading="Top reads today" caption={`As of ${READS.asOfLabel ?? READS.asOf}`}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {top.map((r, i) => (
          <div key={r.rank} style={{ display: "flex", gap: 10, padding: "8px 0", borderTop: i ? `1px solid ${t.border.subtle}` : "none", alignItems: "baseline" }}>
            <span style={{ width: 20, color: t.text.tertiary, ...typo(t.font.label) }}>{r.rank}</span>
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
              <TitleLink url={r.url}>{r.headline}</TitleLink>
              <MetaLine items={[r.site, ...(r.premium ? [`Premium · ${r.premiumSite ?? r.site}`] : []), ...(r.goodNews ? ["Good news"] : [])]} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Button label="All top reads" onClick={() => go("reads")} />
        {XTOP ? <Button label="Top on X" onClick={() => go("x")} /> : null}
      </div>
    </Section>
  );
}
const MODE_LABEL: Record<string, string> = { auto: "Auto (follows the calendar)", daily: "Always daily", weekly: "Weekly" };
function DigestLine() {
  const t = useGrokTheme();
  const g = DATA.digest;
  if (!g) return null;
  const bits = [`Digest: ${MODE_LABEL[g.mode] ?? g.mode}`, ...(g.activeModes && g.activeModes.length ? [`Now: ${g.activeModes.join(" + ")}`] : []), ...(g.nextDigest ? [`Next: ${fmtShort(g.nextDigest.slice(0, 10))}, ${clock(g.nextDigest)}`] : [])];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <MetaLine items={bits} />
      {g.schedule ? <div style={{ color: t.text.tertiary, ...typo(t.font.caption) }}>{g.schedule}</div> : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// following
// ---------------------------------------------------------------------------
function PostList({ posts }: { posts: FPost[] }) {
  const t = useGrokTheme();
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {posts.map((p, i) => (
        <div key={p.url} style={{ display: "flex", gap: 12, padding: "10px 0", borderTop: i ? `1px solid ${t.border.subtle}` : "none" }}>
          <div style={{ width: 52, flexShrink: 0, color: t.text.tertiary, ...typo(t.font.label) }}>{fmtShort(p.date.slice(0, 10))}{p.date.includes("T") ? <><br />{clock(p.date)}</> : null}</div>
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
            <a href={p.url} target="_blank" rel="noreferrer" style={{ color: t.text.primary, fontWeight: t.weight.medium, textDecoration: "none", ...typo(t.font.body2) }}>{p.thread}</a>
            <div style={{ color: t.text.secondary, ...typo(t.font.body2) }}>{p.summary}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
function PosterCard({ p, open, onToggle }: { p: Poster; open: boolean; onToggle: () => void }) {
  const t = useGrokTheme();
  return (
    <div style={{ border: `1px solid ${t.border.subtle}`, borderRadius: t.radius.lg, background: t.bg.base, overflow: "hidden" }}>
      <button type="button" aria-expanded={open} onClick={onToggle}
        style={{ width: "100%", display: "flex", gap: 12, alignItems: "flex-start", padding: 12, background: "transparent", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit", color: "inherit" }}>
        <Avatar name={p.name} size={32} />
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap" }}>
            <span style={{ color: t.text.primary, fontWeight: t.weight.semibold, ...typo(t.font.body1) }}>{p.name}</span>
            <span style={{ color: t.text.tertiary, ...typo(t.font.label) }}>{p.username ? `@${p.username}` : "Username UNKNOWN"}</span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {p.staff ? <Status tone="neutral">Staff</Status> : null}
            <Status tone={!p.found ? "warning" : p.posts.length ? "success" : "neutral"}>{!p.found ? p.status : p.posts.length ? `${p.posts.length} recent post${p.posts.length === 1 ? "" : "s"}` : "Posts UNKNOWN"}</Status>
          </div>
          <div style={{ color: t.text.secondary, ...typo(t.font.body2) }}>Why followed: {p.why}</div>
        </div>
        <span aria-hidden style={{ color: t.text.tertiary, flexShrink: 0, transform: open ? "rotate(90deg)" : "none", transition: `transform ${t.motion.hover} ${t.motion.easing}`, ...typo(t.font.body1) }}>›</span>
      </button>
      {open ? (
        <div style={{ padding: "0 12px 12px 56px", display: "flex", flexDirection: "column", gap: 8 }}>
          {p.profile ? <SrcLink url={p.profile} label="Board profile" /> : <span style={{ color: t.text.tertiary, ...typo(t.font.label) }}>Profile link UNKNOWN</span>}
          {p.statusNote ? <div style={{ color: t.text.secondary, ...typo(t.font.body2) }}>{p.statusNote}</div> : null}
          {p.noteUrl ? <SrcLink url={p.noteUrl} label={p.noteLabel ?? "Source thread"} /> : null}
          {p.posts.length ? <PostList posts={p.posts} /> : <div style={{ color: t.text.tertiary, ...typo(t.font.body2) }}>{p.postsNote ?? "Recent posts UNKNOWN."}</div>}
        </div>
      ) : null}
    </div>
  );
}
function FollowingTab({ FL, board }: { FL: NonNullable<Dashboard["following"]>; board: string }) {
  const t = useGrokTheme();
  const first = FL.posters.find((p) => p.posts.length)?.name ?? null;
  const [open, setOpen] = useState<Record<string, boolean>>(first ? { [first]: true } : {});
  const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Section heading="Posters you follow" caption={`${FL.posters.length} on ${board}. Tap a poster to see their posts, newest first. ${FL.scanned}`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FL.posters.map((p) => <PosterCard key={p.name} p={p} open={!!open[p.name]} onToggle={() => toggle(p.name)} />)}
        </div>
      </Section>
      {FL.suggested.length ? (
        <Section heading="Suggested follows" caption="Suggestions only. You have not followed these posters.">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FL.suggested.map((s) => (
              <div key={s.username} style={{ border: `1px dashed ${t.border.default}`, borderRadius: t.radius.lg, padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <Avatar name={s.name} size={24} />
                  <span style={{ color: t.text.primary, fontWeight: t.weight.semibold, ...typo(t.font.body1) }}>{s.name}</span>
                  <Status tone="neutral">{s.label}</Status>
                  <Status tone="warning">Unverified</Status>
                </div>
                <div style={{ color: t.text.secondary, ...typo(t.font.body2) }}>{s.why}</div>
                {s.posts.length ? <PostList posts={s.posts} /> : null}
              </div>
            ))}
          </div>
        </Section>
      ) : null}
      <Callout tone="info">{FL.note}</Callout>
    </div>
  );
}
function BoardToday({ go }: { go: (tab: Tab) => void }) {
  const t = useGrokTheme();
  if (!FORUM) return null;
  const top = FORUM.threads.filter((x) => x.verdict === "Read").slice(0, 3);
  if (!top.length) return null;
  return (
    <Section heading="On the board today" caption={`Top reads from ${FORUM.board}, as of ${FORUM.asOfLabel}`}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {top.map((x, i) => (
          <div key={x.id} style={{ display: "flex", gap: 10, padding: "8px 0", borderTop: i ? `1px solid ${t.border.subtle}` : "none", alignItems: "baseline" }}>
            <span style={{ width: 20, color: t.text.tertiary, ...typo(t.font.label) }}>{x.rank}</span>
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
              <TitleLink url={x.url}>{x.title}</TitleLink>
              <MetaLine items={[`${count(x.replies)} replies`, `${x.staffPosts} staff`, x.cat]} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        {FORUM.premium ? <Premium site={FORUM.premiumSite ?? FORUM.site} /> : null}
        <Button label="Open Board" onClick={() => go("forum")} />
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// team (season status)
// ---------------------------------------------------------------------------
function pollTxt(p: Poll | null | undefined): string { return p && p.value != null ? `No. ${p.value}` : UNK; }
function TeamTab({ T }: { T: TeamStatus }) {
  const t = useGrokTheme();
  const sc = T.schedule ?? null;
  const facts: { label: string; f: Fact | Poll | null | undefined }[] = [
    { label: "Record", f: T.record }, { label: T.conference?.label ? `${T.conference.label} standing` : "Conference standing", f: T.conference },
    { label: "AP poll", f: T.ap }, { label: "Coaches poll", f: T.coaches }, { label: "CFP ranking", f: T.cfp }, { label: "Last game", f: T.lastGame },
  ];
  const srcs = Array.from(new Set([...facts.map((x) => x.f?.source ?? null), sc?.source ?? null].filter((s): s is string => !!s)));
  const move = (p: Poll | null | undefined) => p && p.value != null && p.prev != null ? (p.prev > p.value ? `Up from No. ${p.prev}` : p.prev < p.value ? `Down from No. ${p.prev}` : `Same as No. ${p.prev}`) : p?.note ?? undefined;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Metrics metrics={[
        { value: T.record?.value ?? UNK, label: "Record", detail: T.lastGame?.value ?? undefined },
        { value: pollTxt(T.ap), label: "AP poll", detail: move(T.ap) },
        { value: pollTxt(T.coaches), label: "Coaches poll", detail: move(T.coaches) },
        { value: T.cfp && T.cfp.value != null ? `No. ${T.cfp.value}` : "Not out", label: "CFP ranking", detail: T.cfp?.note ?? undefined },
      ]} />
      <Grid columns={2}>
        <Section heading="Season" caption={`As of ${fmtDate(T.asOf)}`}>
          <Properties items={facts.map((x) => ({ label: x.label, value: x.f ? (x.f.value == null ? (x.f.note ?? UNK) : typeof x.f.value === "number" ? `No. ${x.f.value}` : x.f.value) : UNK }))} />
        </Section>
        {sc && sc.upcoming.length ? <Section heading="Up next" caption="Remaining schedule">
          <Rows rows={sc.upcoming.map((g, i) => ({ lead: String(i + 1), title: g, status: i === 0 ? { label: "Next", tone: "success" as const } : undefined }))} />
        </Section> : null}
      </Grid>
      {sc && sc.results.length ? <Section heading="Results" caption={`${sc.results.length} games played`}>
        <Rows rows={sc.results.map((g, i) => ({ lead: `Gm ${i + 1}`, title: g, status: g.startsWith("W") ? { label: "W", tone: "success" as const } : g.startsWith("L") ? { label: "L", tone: "danger" as const } : undefined }))} />
      </Section> : null}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{srcs.map((u) => <SrcLink key={u} url={u} />)}</div>
      <div style={{ color: t.text.tertiary, ...typo(t.font.caption) }}>Team facts come only from the linked sources. UNKNOWN means none was found.</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// page
// ---------------------------------------------------------------------------
type Tab = "overview" | "team" | "reads" | "x" | "commits" | "news" | "portal" | "rankings" | "forum" | "following";
export default function Dashboard() {
  const t = useGrokTheme();
  const [tab, setTab] = useState<Tab>("overview");
  const [sel, setSel] = useState<string | null>(null);
  const [view, setView] = useState<RecView>("news");
  const go = (next: Tab, commitId?: string, v?: RecView) => { if (commitId) setSel(commitId); if (v) setView(v); setTab(next); };
  return (
    <Page
      title={DATA.page.title}
      summary={`${DATA.page.summary} As of ${DATA.asOfLabel}.`}
      width="wide"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Chips<Tab> label="Dashboard sections" options={[
          { value: "overview", label: "Overview" },
          ...(TEAM ? [{ value: "team" as const, label: "Team" }] : []),
          ...(READS ? [{ value: "reads" as const, label: "Top reads", count: READS.items.length }] : []),
          ...(XTOP ? [{ value: "x" as const, label: "Top on X", count: XTOP.posts.length }] : []),
          { value: "commits", label: "Commits", count: DATA.commits.length },
          { value: "news", label: "Recruiting", count: DATA.news.length },
          { value: "portal", label: "Portal" },
          { value: "rankings", label: "Rankings" },
          ...(FORUM ? [{ value: "forum" as const, label: "Board", count: FORUMS.reduce((n, f) => n + f.threads.filter((x) => x.verdict === "Read").length, 0) }] : []),
          ...(FOLLOWING ? [{ value: "following" as const, label: "Following", count: FOLLOWING.posters.length }] : []),
        ]} value={tab} onChange={setTab} />
        {tab === "overview" ? <OverviewTab go={go} /> : null}
        {tab === "team" && TEAM ? <TeamTab T={TEAM} /> : null}
        {tab === "commits" ? <CommitsTab selectedId={sel} setSelectedId={setSel} /> : null}
        {tab === "news" ? <NewsTab go={go} view={view} setView={setView} /> : null}
        {tab === "portal" ? <PortalTab /> : null}
        {tab === "rankings" ? <RankingsTab go={go} /> : null}
        {tab === "reads" && READS ? <TopReadsTab R={READS} /> : null}
        {tab === "x" && XTOP ? <TopOnXTab X={XTOP} /> : null}
        {tab === "forum" && FORUM ? <BoardTab /> : null}
        {tab === "following" && FOLLOWING ? <FollowingTab FL={FOLLOWING} board={FORUM?.board ?? DATA.forum?.board ?? "the board"} /> : null}
        <div style={{ color: t.text.tertiary, borderTop: `1px solid ${t.border.subtle}`, paddingTop: 12, ...typo(t.font.caption) }}>
          As of {DATA.forum?.asOfLabel ?? `${DATA.asOfLabel} (${DATA.tz})`}. UNKNOWN means no source was found; nothing is estimated. {DATA.notes.join(" ")}
        </div>
      </div>
    </Page>
  );
}
