// Prepper dashboard template v1.2.0. gen.py replaces the DATA line; this file holds no household text.
import {
  Avatar, Bars, Callout, Checklist, Grid, LineChart, LinkCards, Page, Properties, Rows, Section, Segmented,
  Status, Steps, Table, TableOfContents, Text, useGrokTheme, useState,
} from "grok/canvas";
import type { GrokTheme, ReactNode, Row, StatusTone, TableCell } from "grok/canvas";

type Level = "ACT NOW" | "PREPARE" | "FYI";
type ItemStatus = "done" | "open" | "unknown" | "na";
type Link = { title: string; url: string };
type Scored = { id: string; label: string; status: ItemStatus; points: number; detail: string; doneShare?: number };
type Category = {
  id: string; label: string; kind: "days" | "checklist"; days: number | null;
  itemsDone: number | null; itemsTotal: number | null; weight: number; note: string; source: string;
  countedDays?: number | null; countNote?: string;
};
type Gap = { label: string; group: string; have: string; need: string; gain: number; id: string; waiting: boolean };
type Expiring = {
  item: string; category: string; date: string; label: string; daysLeft: number;
  qty: string; location: string; idea: string; estimated: boolean;
};
type Computed = {
  score: number; earned: number; counted: number; applicable: number; coverage: number; setupPct: number;
  pointsWaiting: number; provisional: boolean;
  tierIndex: number; tierId: string; tierLabel: string; nextTierLabel: string; nextTierNeeds: string[];
  gaps: Gap[]; uncounted: { label: string; points: number }[]; taskGain: number;
  calc: {
    people: number; infants: number; kcalPerDay: number; kcalTarget: number; waterPerDay: number;
    waterTarget: number; petWaterPerDay: number; petsUnknown: string[]; hot: boolean;
  };
  expiring: Expiring[]; budgetPct: number | null; activeLevel: Level | "none";
};
type Dashboard = {
  _example?: string;
  version: string; asOf: string; asOfLabel: string;
  page: { title: string; summary: string };
  household: {
    name: string; place: string; zip: string; county: string; countyFips: string | null; timezone: string;
    adults: number; kids: { ageBand: string }[]; phones?: number | null;
    pets: { kind: string; name: string; waterGalPerDay: number | null; foodDays: number | null }[];
    climateHot: boolean;
  };
  targets: { days: number; goalTier: string; optionalTiers: string[] };
  alert: {
    lastCheck: string; nextCheck: string; cadence: string;
    emergencyMode: { on: boolean; since: string | null; cadenceMin: number };
    active: {
      id: string; event: string; level: Level; headline: string; until: string | null;
      area: string; doNow: string; source: string; url: string;
    }[];
    fyi: string[]; watchedPlaces: string[];
  };
  lifeSafety: (Scored & { source: string })[];
  categories: Category[];
  planItems: Scored[];
  expiring: {
    id?: string; item: string; category: string; date: string; qty: string;
    location: string; idea: string | null; private: boolean; estimated?: boolean;
  }[];
  mealIdeas: { title: string; uses: string[]; minutes: number | null }[];
  task: {
    title: string; minutes: number; week: string; category: string | null; addsDays: number | null;
    itemIds?: string[]; steps: string[]; why: string; source: string;
  };
  shopping: {
    monthlyBudget: number | null; spent: number | null; weekOf: string; pace: string;
    items: { item: string; qty: string; estCost: number | null; done: boolean; why: string }[];
  };
  hazards: { county: string; source: string; url: string; asOf: string; top: { hazard: string; rating: string; mode: string }[] };
  family: {
    name: string; role: string; relation: string; town: string | null; needs: string | null;
    lastUpdate: string | null; checklist: { text: string; done: boolean }[];
    ageBand?: "0-1" | "1-3" | "4-8" | "9-13" | "14-17"; showName?: boolean; pageLabel?: string;
  }[];
  headlineChecks: {
    date: string; headline: string; verdict: string; action: string; sources: (Link & { date?: string })[];
    confidence: string; full?: string;
  }[];
  seasonal: { month: string; items: string[] }[];
  outagePlan: { steps: string[]; fridgeHours: number | null; freezerHours: number | null; source: string };
  outageUseFirst?: { item: string; where: "fridge" | "freezer"; qty: string; date: string | null; note: string | null }[];
  waterPlan: { storedGallons: number | null; refillBy: string | null; treatment: string; source: string };
  printPlan: {
    contacts: { name: string; phone: string }[];
    outOfAreaContact: { name: string; phone: string } | null;
    meetingPlaces: { nearHome: string | null; outOfNeighborhood: string | null; outOfTown: string | null };
    utilities: { what: string; where: string | null }[];
    evacuation: { five: string[]; fifteen: string[]; sixty: string[] };
    petFriendlyPlace: string | null; shelterSpot: string | null; alertSignup: string | null; evacZoneSource: string | null;
  };
  recalls: {
    lastCheck: string | null; checked: number;
    matches: { item: string; product: string; reason: string; date: string; url: string }[];
    sources: string;
  };
  modules: { id: string; label: string; on: boolean }[];
  connections: { id: string; label: string; on: boolean; kind: "default" | "optin"; note: string; addPhrase: string | null }[];
  channels?: { id: string; label: string; status: "on" | "available" | "later"; levels: Level[]; note: string }[];
  history: { date: string; score: number; coverage: number }[];
  sources: Link[];
  computed: Computed;
};

export const DATA: Dashboard = __DATA__;

const UNKNOWN = "not counted yet";
const TIERS: { id: string; label: string; optional: boolean }[] = [
  { id: "72h", label: "72 hours", optional: false },
  { id: "2w", label: "2 weeks", optional: false },
  { id: "1m", label: "1 month", optional: true },
  { id: "3m", label: "3 months", optional: true },
];

function orUnknown(v: string | null | undefined, fallback: string = "UNKNOWN"): string {
  return v === null || v === undefined || v === "" ? fallback : v;
}
function num(v: number | null | undefined, unit: string): string {
  return v === null || v === undefined || !Number.isFinite(v) ? UNKNOWN : `${Math.round(v * 10) / 10} ${unit}`;
}
function money(v: number | null | undefined): string {
  return v === null || v === undefined || !Number.isFinite(v) ? "price not checked" : `$${Math.round(v)}`;
}
function thousands(n: number): string {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function statusWord(s: ItemStatus): Row["status"] {
  if (s === "done") return { label: "Done", tone: "success" };
  if (s === "open") return { label: "To do", tone: "warning" };
  if (s === "na") return { label: "Does not apply" };
  return { label: "Not counted yet" };
}
// Minors show as their stored label plus age band ("Child A, 9 to 13") unless the owner asked for the name.
function memberName(f: Dashboard["family"][number]): string {
  if (!f.ageBand || f.showName) return f.name;
  return `${f.pageLabel || "Child"}, ${f.ageBand.replace("-", " to ")}`;
}
// Plan and card titles: the household's own name, or a neutral label for the sample or a blank name.
function householdTitle(d: Dashboard, what: string): string {
  const n = d.household.name.trim();
  return n && !d._example ? `${n}: ${what}` : what.charAt(0).toUpperCase() + what.slice(1);
}
function verdictTone(v: string): StatusTone {
  if (v === "VERIFIED") return "success";
  if (v === "PARTLY VERIFIED") return "accent";
  if (v === "NOT SUPPORTED") return "warning";
  return "neutral";
}

// Readiness ring: the accent arc is the score out of 100. Points waiting (not answered yet) sit as a soft gray arc at the end.
function ring(t: GrokTheme, c: Computed): ReactNode {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const scoreLen = (Math.max(0, Math.min(100, c.score)) / 100) * circ;
  const uncountedLen = (Math.max(0, Math.min(100, c.pointsWaiting)) / 100) * circ;
  return (
    <svg viewBox="0 0 140 140" width="100%" style={{ maxWidth: 220, display: "block", margin: "0 auto" }} role="img"
      aria-label={`Readiness ${c.score} of 100`}>
      <circle cx={70} cy={70} r={r} fill="none" stroke={t.fill.secondary} strokeWidth={12} />
      <circle cx={70} cy={70} r={r} fill="none" stroke={t.border.default} strokeWidth={12}
        strokeDasharray={`${uncountedLen} ${circ}`} strokeDashoffset={-(circ - uncountedLen)} transform="rotate(-90 70 70)" />
      <circle cx={70} cy={70} r={r} fill="none" stroke={t.dataviz.categorical[0]} strokeWidth={12} strokeLinecap="round"
        strokeDasharray={`${scoreLen} ${circ}`} transform="rotate(-90 70 70)" />
      <text x={70} y={68} textAnchor="middle" fill={t.text.primary}
        style={{ fontFamily: t.font.family, fontSize: 34, fontWeight: t.weight.semibold }}>{c.score}</text>
      <text x={70} y={90} textAnchor="middle" fill={t.text.secondary} style={{ fontFamily: t.font.family, fontSize: 11 }}>
        of 100
      </text>
    </svg>
  );
}

// Tier track: four steps on one line. Reached steps and the line up to them take the accent; optional steps hang off a dashed line.
function tierLadder(t: GrokTheme, c: Computed): ReactNode {
  const accent = t.dataviz.categorical[0];
  const x = (i: number) => 50 + i * 100;
  return (
    <svg viewBox="0 0 400 76" width="100%" role="img" aria-label={`Tier ${c.tierLabel}`}>
      {TIERS.slice(1).map((tier, j) => {
        const i = j + 1;
        return (
          <line key={`seg-${tier.id}`} x1={x(i - 1)} x2={x(i)} y1={20} y2={20} strokeWidth={3}
            stroke={c.tierIndex >= i + 1 ? accent : t.border.default} strokeDasharray={tier.optional ? "5 5" : undefined} />
        );
      })}
      {TIERS.map((tier, i) => {
        const reached = c.tierIndex >= i + 1;
        const next = c.tierIndex === i;
        return (
          <g key={tier.id}>
            <circle cx={x(i)} cy={20} r={next ? 9 : 8} fill={reached ? accent : t.bg.base}
              stroke={reached || next ? accent : t.border.strong} strokeWidth={next ? 3 : 2} />
            <text x={x(i)} y={48} textAnchor="middle" fill={t.text.primary}
              style={{ fontFamily: t.font.family, fontSize: 12, fontWeight: reached || next ? t.weight.semibold : t.weight.regular }}>
              {tier.label}
            </text>
            <text x={x(i)} y={66} textAnchor="middle" fill={t.text.tertiary} style={{ fontFamily: t.font.family, fontSize: 11 }}>
              {reached ? "Reached" : next ? "Next" : tier.optional ? "Optional" : "Later"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Days-of-supply ladder: each row fills toward the target, with 3 day and target ticks. Uncounted rows are gray and dashed.
function supplyBars(t: GrokTheme, cats: Category[], target: number): ReactNode {
  const accent = t.dataviz.categorical[0];
  const tick3 = (3 / target) * 100;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {cats.map((c) => {
        const counted = c.kind === "days" ? c.days !== null : c.itemsDone !== null && !!c.itemsTotal;
        const ratio = !counted ? 0 : c.kind === "days" ? Math.min((c.days ?? 0) / target, 1)
          : Math.min((c.itemsDone ?? 0) / (c.itemsTotal || 1), 1);
        const value = !counted ? UNKNOWN : c.kind === "days" ? `${c.days} days` : `${c.itemsDone} of ${c.itemsTotal}`;
        const note = c.countNote ? `${c.countNote[0].toUpperCase()}${c.countNote.slice(1)}. ${c.note}` : c.note;
        return (
          <div key={c.id} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", columnGap: 12, rowGap: 4 }}>
            <div style={{ ...t.font.subtext, color: t.text.primary, flex: "0 0 130px" }}>{c.label}</div>
            <div style={{ position: "relative", flex: "1 1 200px", height: 10, borderRadius: t.radius.full,
              background: counted ? t.fill.secondary : "transparent",
              border: counted ? "none" : `1px dashed ${t.border.default}` }}>
              {counted ? <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${ratio * 100}%`,
                borderRadius: t.radius.full, background: c.kind === "days" ? accent : t.dataviz.singleSeriesRest }} /> : null}
              {c.kind === "days" ? <div style={{ position: "absolute", left: `${tick3}%`, top: -3, bottom: -3, width: 1,
                background: t.border.strong }} /> : null}
            </div>
            <div style={{ ...t.font.subtext, color: counted ? t.text.primary : t.text.tertiary, flex: "0 0 120px", textAlign: "right" }}>
              {value}
            </div>
            <div style={{ ...t.font.caption, color: t.text.secondary, flex: "1 1 100%", paddingLeft: 0 }}>{note}</div>
          </div>
        );
      })}
      <div style={{ ...t.font.caption, color: t.text.secondary }}>
        Tick marks 3 days. Full bar is {target} days. Checklist rows show items done. Gray dashed rows are points waiting: tell the bot and they add to the score.
      </div>
    </div>
  );
}

// Use-first timeline: dots placed by days until best-by over the next 120 days, numbered to match the list.
function expiryStrip(t: GrokTheme, items: Expiring[]): ReactNode {
  const span = 120;
  const shown = items.filter((e) => e.daysLeft <= span);
  const x = (d: number) => 20 + (Math.max(0, Math.min(span, d)) / span) * 560;
  return (
    <svg viewBox="0 0 600 64" width="100%" role="img" aria-label="Best-by dates over the next 120 days">
      <line x1={20} x2={580} y1={30} y2={30} stroke={t.border.default} strokeWidth={2} />
      {[0, 30, 60, 90, 120].map((d) => (
        <g key={d}>
          <line x1={x(d)} x2={x(d)} y1={24} y2={36} stroke={t.border.default} />
          <text x={x(d)} y={56} textAnchor="middle" fill={t.text.secondary} style={{ fontFamily: t.font.family, fontSize: 11 }}>
            {d === 0 ? "today" : `${d} d`}
          </text>
        </g>
      ))}
      {shown.map((e, i) => (
        <g key={`${e.item}-${i}`}>
          <circle cx={x(e.daysLeft)} cy={30} r={8} fill={t.dataviz.categorical[0]} />
          <text x={x(e.daysLeft)} y={34} textAnchor="middle" fill={t.text.onColor}
            style={{ fontFamily: t.font.family, fontSize: 10, fontWeight: t.weight.semibold }}>{i + 1}</text>
        </g>
      ))}
    </svg>
  );
}

function budgetBar(t: GrokTheme, pct: number | null): ReactNode {
  return (
    <div style={{ height: 10, borderRadius: t.radius.full, background: pct === null ? "transparent" : t.fill.secondary,
      border: pct === null ? `1px dashed ${t.border.default}` : "none", overflow: "hidden" }}>
      {pct === null ? null : <div style={{ width: `${pct * 100}%`, height: "100%", background: t.dataviz.categorical[0] }} />}
    </div>
  );
}

function setupBar(t: GrokTheme, pct: number): ReactNode {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: "1 1 auto", height: 8, borderRadius: t.radius.full, background: t.fill.secondary, overflow: "hidden" }}>
        <div style={{ width: `${Math.max(0, Math.min(100, pct))}%`, height: "100%", background: t.dataviz.singleSeriesRest }} />
      </div>
      <span style={{ ...t.font.caption, color: t.text.secondary }}>{`${pct}%`}</span>
    </div>
  );
}

function walletCard(t: GrokTheme, d: Dashboard): ReactNode {
  const p = d.printPlan;
  const line = (k: string, v: string) => (
    <div style={{ display: "flex", gap: 6 }}>
      <span style={{ color: t.text.secondary, minWidth: 74 }}>{k}</span><span style={{ color: t.text.primary }}>{v}</span>
    </div>
  );
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
      {[0, 1].map((side) => (
        <div key={side} style={{ width: "100%", maxWidth: 350, aspectRatio: "3.5 / 2", border: `1px solid ${t.border.strong}`,
          borderRadius: t.radius.md, padding: 12, boxSizing: "border-box", ...t.font.caption, overflow: "hidden" }}>
          <div style={{ ...t.font.label, fontWeight: t.weight.semibold, color: t.text.primary, marginBottom: 4 }}>
            {side === 0 ? householdTitle(d, "emergency card") : "Where we meet"}
          </div>
          {side === 0 ? (
            <>
              {p.contacts.slice(0, 3).map((c) => <div key={c.name}>{line(c.name, c.phone)}</div>)}
              {line("Out of area", p.outOfAreaContact ? `${p.outOfAreaContact.name} ${p.outOfAreaContact.phone}` : "UNKNOWN")}
              {line("Emergency", "911")}
            </>
          ) : (
            <>
              {line("Near home", orUnknown(p.meetingPlaces.nearHome))}
              {line("Nearby", orUnknown(p.meetingPlaces.outOfNeighborhood))}
              {line("Out of town", orUnknown(p.meetingPlaces.outOfTown))}
              {line("Alerts", orUnknown(p.alertSignup))}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function sampleNote(d: Dashboard): ReactNode {
  return d._example ? <Callout tone="info" lead="Sample data">{d._example}</Callout> : null;
}

type View = "dashboard" | "plan" | "card";

export default function FamilyPrepper() {
  const t = useGrokTheme();
  const [view, setView] = useState<View>("dashboard");
  const d = DATA;
  const c = d.computed;
  const target = d.targets.days;
  const actNow = d.alert.active.filter((a) => a.level === "ACT NOW");
  const prepare = d.alert.active.filter((a) => a.level === "PREPARE");
  const switcher = (
    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 4 }}>
      <Segmented<View> value={view} onChange={setView}
        options={[{ value: "dashboard", label: "Dashboard" }, { value: "plan", label: "Family plan" }, { value: "card", label: "Wallet card" }]} />
    </div>
  );

  if (view === "plan") {
    const p = d.printPlan;
    return (
      <Page title={householdTitle(d, "family emergency plan")} summary={`Printable plan as of ${d.asOfLabel}. Say "print the plan" for the PDF.`} width="wide">
        {switcher}
        <Section heading="Plan">
          {sampleNote(d)}
          <Grid columns={2}>
            <Section heading="Contacts">
              <Properties items={[
                ...p.contacts.map((x) => ({ label: x.name, value: x.phone })),
                { label: "Out-of-area contact", value: p.outOfAreaContact ? `${p.outOfAreaContact.name}, ${p.outOfAreaContact.phone}` : "UNKNOWN" },
                { label: "Emergency", value: "911" },
              ]} />
            </Section>
            <Section heading="Meeting places">
              <Properties items={[
                { label: "Near home", value: orUnknown(p.meetingPlaces.nearHome) },
                { label: "Out of neighborhood", value: orUnknown(p.meetingPlaces.outOfNeighborhood) },
                { label: "Out of town", value: orUnknown(p.meetingPlaces.outOfTown) },
                { label: "Shelter spot", value: orUnknown(p.shelterSpot) },
                { label: "Pet-friendly place", value: p.petFriendlyPlace ? p.petFriendlyPlace : <Status tone="warning">Not set</Status> },
              ]} />
            </Section>
            <Section heading="Utilities">
              <Properties items={p.utilities.map((u) => ({ label: u.what, value: orUnknown(u.where, "Not checked yet") }))} />
            </Section>
            <Section heading="Alerts and evacuation zones">
              <Properties items={[
                { label: "Phone alerts", value: "Wireless Emergency Alerts on every phone" },
                { label: "Radio", value: "NOAA Weather Radio" },
                { label: "County signup", value: orUnknown(p.alertSignup) },
                { label: "Evacuation zone", value: orUnknown(p.evacZoneSource) },
              ]} />
            </Section>
          </Grid>
        </Section>
        <Section heading="If we have to leave">
          <Grid columns={3}>
            <Section heading="5 minutes"><Steps steps={p.evacuation.five.map((s) => ({ title: s }))} /></Section>
            <Section heading="15 minutes"><Steps steps={p.evacuation.fifteen.map((s) => ({ title: s }))} /></Section>
            <Section heading="60 minutes"><Steps steps={p.evacuation.sixty.map((s) => ({ title: s }))} /></Section>
          </Grid>
        </Section>
      </Page>
    );
  }

  if (view === "card") {
    return (
      <Page title={householdTitle(d, "wallet card")} summary={`Front and back, 3.5 by 2 inches, as of ${d.asOfLabel}. Say "print wallet cards" for the PDF.`} width="wide">
        {switcher}
        <Section heading="Wallet card">{sampleNote(d)}{walletCard(t, d)}</Section>
      </Page>
    );
  }

  const exp = c.expiring;
  const daysBars = d.categories.filter((x) => x.kind === "days" && x.days !== null)
    .map((x) => ({ label: x.label, value: Math.min(x.days ?? 0, 60), display: `${x.days} days` }));
  const gapRows: Row[] = c.gaps.map((g) => ({
    title: g.label,
    detail: g.waiting ? "Not answered yet. Tell the bot and it counts."
      : g.group === "supplies" ? `Now ${g.have}. Goal ${g.need}.` : `${g.group === "life safety" ? "Life safety" : "Plan"} step, not done yet.`,
    meta: `+${g.gain} points`,
  }));
  const ls: Row[] = d.lifeSafety.map((x) => ({ title: x.label, detail: `${x.detail} Source: ${x.source}.`, status: statusWord(x.status) }));
  const planRows: Row[] = d.planItems.map((x) => ({ title: x.label, detail: x.detail, status: statusWord(x.status) }));
  const headlineRows: TableCell[][] = d.headlineChecks.map((h) => [
    h.date, h.headline, <Status tone={verdictTone(h.verdict)}>{h.verdict}</Status>, h.action,
    h.sources.length ? h.sources.map((s) => (s.date ? `${s.title} (${s.date})` : s.title)).join("; ") : "No official source found", h.confidence,
  ]);
  const headlineFull: Row[] = d.headlineChecks.filter((h) => h.full).map((h) => ({ title: `${h.date}: ${h.headline}`, detail: h.full }));
  const useFirst = d.outageUseFirst ?? [];
  const shopRows: TableCell[][] = d.shopping.items.map((s) => [
    s.item, s.qty, money(s.estCost), s.why, s.done ? { text: "Bought", tone: "success" } : "To buy",
  ]);
  const hazardRows: Row[] = d.hazards.top.map((h) => ({
    title: h.hazard, meta: h.rating, status: h.mode === "on" ? { label: "Mode on" } : undefined,
  }));
  const connectionRows: TableCell[][] = d.connections.map((x) => [
    x.label, x.on ? <Status tone="success">On</Status> : <Status>Off</Status>, x.kind === "default" ? "Built in" : "Opt-in",
    x.note, x.on ? "" : x.addPhrase ? `Say "${x.addPhrase}"` : "",
  ]);
  const channels = d.channels ?? [];
  const channelRows: TableCell[][] = channels.map((ch) => [
    ch.label,
    ch.status === "on" ? <Status tone="success">On</Status> : ch.status === "available" ? <Status tone="accent">Available</Status> : <Status>Coming later</Status>,
    ch.levels.length ? ch.levels.join(", ") : "Not for alerts", ch.note,
  ]);
  const alertRows: Row[] = d.alert.active.map((a) => ({
    lead: a.level, title: a.event, detail: `${a.doNow} Until ${orUnknown(a.until)}. Source: ${a.source}.`,
    status: { label: a.level === "ACT NOW" ? "Warning" : a.level === "PREPARE" ? "Watch" : "FYI", tone: a.level === "ACT NOW" ? "danger" : a.level === "PREPARE" ? "warning" : undefined },
  }));

  return (
    <Page title={d.page.title} summary={d.page.summary} width="wide">
      {switcher}
      <TableOfContents items={[{ label: "Readiness", id: "readiness" }, { label: "Life safety first", id: "life-safety" }, { label: "Alerts", id: "alerts" }, { label: "Days of supply", id: "supply" }, { label: "This week", id: "this-week" }, { label: "Use it first", id: "use-first" }, { label: "Your area", id: "area" }, { label: "Outage and water", id: "outage-water" }, { label: "Family", id: "family" }, { label: "Headline Checks", id: "headline-checks" }, { label: "Progress", id: "progress" }, { label: "Connections", id: "connections" }, { label: "Sources", id: "sources" }]} />
      <Section heading="Readiness" id="readiness"
        caption={`${d.household.place}, ${d.household.county}. As of ${d.asOfLabel}.`}>
        {sampleNote(d)}
        {actNow.length ? (
          <Callout tone="danger" lead={`${actNow[0].event}: act now`}>{`${actNow[0].doNow} Your phone's emergency alerts and a NOAA Weather Radio are faster than this page.`}</Callout>
        ) : prepare.length ? (
          <Callout tone="warning" lead={`${prepare[0].event}: prepare`}>{`${prepare[0].doNow} Phone alerts and a NOAA Weather Radio are the real-time layer.`}</Callout>
        ) : null}
        <Grid columns={3}>
          <Section heading="Score">
            {ring(t, c)}
            <Properties items={[
              { label: "Tier", value: <Status tone="accent">{c.tierLabel}</Status> },
              { label: "Setup", value: setupBar(t, c.setupPct) },
              { label: "Points waiting", value: c.uncounted.length ? `${c.pointsWaiting}: ${c.uncounted.map((u) => u.label).join(", ")}` : "None" },
            ]} />
          </Section>
          <Section heading={c.nextTierLabel ? `Next: ${c.nextTierLabel}` : "Top tier reached"}>
            {tierLadder(t, c)}
            {c.nextTierNeeds.length ? <Checklist items={c.nextTierNeeds.map((n) => ({ text: n, done: false }))} /> : <Text>Keep rotating and checking in monthly.</Text>}
          </Section>
          <Section heading="Biggest gaps">
            {gapRows.length ? <Rows rows={gapRows} /> : <Text>No gaps left. Keep rotating and checking in monthly.</Text>}
            <Text>{`Score is points earned out of 100 for what applies to your home. Items not answered yet are points waiting; answering only adds, so the score never drops from telling the bot more.`}</Text>
          </Section>
        </Grid>
      </Section>

      <Section heading="Life safety first" id="life-safety" caption="These come before any supplies. Status as of the last check-in.">
        <Rows rows={ls} />
      </Section>

      <Section heading="Alerts" id="alerts" caption={`Last check ${d.alert.lastCheck}. Next ${d.alert.nextCheck}. ${d.alert.cadence}`}>
        <Grid columns={2}>
          <Section heading={d.alert.active.length ? "Active for your places" : "Calm right now"}>
            {alertRows.length ? <Rows rows={alertRows} /> : <Text>{`No NWS watches or warnings for your watched places.`}</Text>}
            {d.alert.fyi.length ? <Checklist items={d.alert.fyi.map((f) => ({ text: f, done: false }))} /> : null}
            <Text>{d.alert.emergencyMode.on
              ? `Emergency mode on since ${orUnknown(d.alert.emergencyMode.since)}, checking every ${d.alert.emergencyMode.cadenceMin} minutes.`
              : "Emergency mode off. Phone alerts and a NOAA Weather Radio are the real-time layer; this page checks on a schedule."}</Text>
          </Section>
          <Section heading="Watched places">
            <Rows rows={d.alert.watchedPlaces.map((w) => ({ title: w }))} />
          </Section>
        </Grid>
      </Section>

      <Section heading="Days of supply" id="supply" caption={`Toward ${target} days at home for ${c.calc.people} people.`}>
        <Grid columns={2}>
          <Section heading="Ladder">{supplyBars(t, d.categories, target)}</Section>
          <Section heading={`${target}-day calculator`}>
            <Properties items={[
              { label: "Water", value: `${c.calc.waterPerDay} gal a day, ${c.calc.waterTarget} gal total${c.calc.hot ? " (doubled for heat)" : ""}` },
              { label: "Stored water", value: num(d.waterPlan.storedGallons, "gal") },
              { label: "Food", value: `${thousands(c.calc.kcalPerDay)} kcal a day, ${thousands(c.calc.kcalTarget)} total` },
              { label: "Pets", value: c.calc.petsUnknown.length ? `Water ${UNKNOWN} for ${c.calc.petsUnknown.join(", ")}. Ask your vet.` : `${c.calc.petWaterPerDay} gal a day` },
              ...(c.calc.infants ? [{ label: "Infants", value: "Use what you use now; never estimated." }] : []),
            ]} />
            <Text>1 gallon per person per day (Ready.gov). 2,000 kcal per adult (FDA); kids scaled by age as planning estimates.</Text>
          </Section>
        </Grid>
      </Section>

      <Section heading="This week" id="this-week">
        <Grid columns={2}>
          <Section heading={`${d.task.title} (${d.task.minutes} minutes)`}>
            <Steps steps={d.task.steps.map((s) => ({ title: s }))} />
            <Properties items={[
              { label: "Why", value: d.task.why },
              { label: "Score", value: c.taskGain > 0 ? `+${c.taskGain} points when done` : "Keeps your score where it is" },
              { label: "Source", value: d.task.source },
            ]} />
          </Section>
          <Section heading="Shopping, a little each week">
            {budgetBar(t, c.budgetPct)}
            <Properties items={[
              { label: "This month", value: `${money(d.shopping.spent)} of ${money(d.shopping.monthlyBudget)}` },
              { label: "Pace", value: d.shopping.pace },
            ]} />
            <Table columns={["Item", "Qty", "Est.", "For", ""]} rows={shopRows} />
          </Section>
        </Grid>
      </Section>

      <Section heading="Use it first" id="use-first" caption="Eat or use these before they pass best-by, then replace them.">
        <Grid columns={2}>
          <Section heading="Coming up">
            {exp.length ? expiryStrip(t, exp) : null}
            {exp.length ? <Rows rows={exp.map((e, i) => ({
              lead: String(i + 1), title: e.item, detail: `${e.qty}, ${e.location}. ${e.idea}`,
              meta: `${e.daysLeft < 0 ? `past ${e.label}` : `${e.label}, ${e.daysLeft} days`}${e.estimated ? " (estimated, no printed date)" : ""}`,
            }))} /> : <Text>Nothing near its date. Add best-by dates with a photo and the bot keeps this list.</Text>}
          </Section>
          <Section heading="Meals that use them">
            <Rows rows={d.mealIdeas.map((m) => ({ title: m.title, detail: m.uses.join(", "), meta: m.minutes === null ? "" : `${m.minutes} min` }))} />
            <Properties items={[
              { label: "Recall check", value: d.recalls.matches.length
                ? <Status tone="warning">{`${d.recalls.matches.length} match`}</Status>
                : <Status tone="success">No matches</Status> },
              { label: "Checked", value: `${d.recalls.checked} items, ${orUnknown(d.recalls.lastCheck)}` },
              { label: "Sources", value: d.recalls.sources },
            ]} />
            {d.recalls.matches.length ? <Rows rows={d.recalls.matches.map((m) => ({ title: m.item, detail: `${m.product}. ${m.reason}`, meta: m.date }))} /> : null}
          </Section>
        </Grid>
      </Section>

      <Section heading="Your area" id="area">
        <Grid columns={2}>
          <Section heading={`Hazards in ${d.hazards.county}`}>
            <Rows rows={hazardRows} />
            <Text>{`${d.hazards.source}, ${d.hazards.asOf}. Modes add the checklists and alert steps for each hazard.`}</Text>
          </Section>
          <Section heading="Seasonal">
            <Rows rows={d.seasonal.map((s) => ({ lead: s.month, title: s.items.join("; ") }))} />
          </Section>
        </Grid>
      </Section>

      <Section heading="Outage and water" id="outage-water">
        <Grid columns={2}>
          <Section heading="If the power goes out">
            <Steps steps={d.outagePlan.steps.map((s) => ({ title: s }))} />
            <Properties items={[
              { label: "Fridge", value: num(d.outagePlan.fridgeHours, "hours closed") },
              { label: "Full freezer", value: num(d.outagePlan.freezerHours, "hours closed") },
              { label: "Source", value: d.outagePlan.source },
            ]} />
          </Section>
          <Section heading="Water plan">
            <Properties items={[
              { label: "Stored", value: num(d.waterPlan.storedGallons, "gal") },
              { label: "Need", value: `${c.calc.waterTarget} gal for ${target} days` },
              { label: "Swap by", value: orUnknown(d.waterPlan.refillBy) },
              { label: "If unsure", value: d.waterPlan.treatment },
              { label: "Source", value: d.waterPlan.source },
            ]} />
          </Section>
        </Grid>
        <Section heading="Use first in an outage"
          caption={`Eat the fridge first (safe about ${d.outagePlan.fridgeHours ?? 4} hours closed), then the freezer (a full, closed freezer holds about ${d.outagePlan.freezerHours ?? 48} hours). Not counted toward food days.`}>
          {useFirst.length ? <Rows rows={[...useFirst.filter((u) => u.where === "fridge"), ...useFirst.filter((u) => u.where === "freezer")].map((u) => ({
            lead: u.where === "fridge" ? "Fridge" : "Freezer", title: u.item,
            detail: `${u.qty}${u.note ? `. ${u.note}` : ""}`, meta: u.date ?? "no date",
          }))} /> : <Text>Tell the bot what is in the fridge and freezer and it lists what to eat first when the power goes out.</Text>}
        </Section>
      </Section>

      <Section heading="Family" id="family" caption="Roles and checklists, as of each person's last update. The bot never messages family; the owner shares this page or the plan.">
        <Grid columns={3}>
          {d.family.map((f) => (
            <Section key={`${f.name}-${f.relation}`} heading={memberName(f)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Avatar name={memberName(f)} size={32} neutral />
                <span style={{ ...t.font.subtext, color: t.text.secondary }}>{f.relation}</span>
              </div>
              <Properties items={[
                { label: "Role", value: f.role },
                ...(f.town ? [{ label: "Town", value: f.town }] : []),
                ...(f.needs ? [{ label: "Needs", value: f.needs }] : []),
                { label: "Updated", value: orUnknown(f.lastUpdate) },
              ]} />
              <Checklist items={f.checklist.map((x) => ({ text: x.text, done: x.done }))} />
            </Section>
          ))}
        </Grid>
        <Rows rows={planRows} />
      </Section>

      <Section heading="Headline Checks" id="headline-checks" caption="Posts and headlines checked against official sources. Do now comes first.">
        {headlineRows.length ? <Table columns={["Date", "Headline", "Verdict", "Do now", "Source", "Confidence"]} rows={headlineRows} />
          : <Text>See a worrying post or headline? Paste it here in chat and the bot checks it against official sources and says what, if anything, it means for your home.</Text>}
        {headlineFull.length ? <Section heading="Full checks"><Rows rows={headlineFull} /></Section> : null}
      </Section>

      <Section heading="Progress" id="progress">
        {d.history.length >= 2 ? (
          <LineChart points={d.history.map((h) => ({ label: h.date, value: h.score }))} ceiling={100} floor={0} unit="points" />
        ) : <Text>The score history starts after the second check-in.</Text>}
        {daysBars.length ? <Bars bars={daysBars} emphasis="none" /> : null}
      </Section>

      <Section heading="Connections" id="connections" caption="Built-in sources need no setup. Opt-ins are asked once; say the phrase to add one.">
        <Table columns={["Connection", "Status", "Type", "What it does", "To add"]} rows={connectionRows} />
        {channelRows.length ? (
          <Section heading="Delivery channels">
            <Table columns={["Channel", "Status", "Alert levels", "Note"]} rows={channelRows} />
          </Section>
        ) : null}
        <Section heading="Modules">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {d.modules.map((m) => <Status key={m.id} tone={m.on ? "accent" : "neutral"}>{`${m.label}${m.on ? "" : " (off)"}`}</Status>)}
          </div>
        </Section>
      </Section>

      <Section heading="Sources" id="sources" caption={`Prepper v${d.version}. Official sources only; anything unconfirmed is marked UNKNOWN.`}>
        <LinkCards links={d.sources.map((s) => ({ title: s.title, href: s.url }))} />
        <Text>Not medical, legal, or financial advice. Not a replacement for phone emergency alerts.</Text>
      </Section>
    </Page>
  );
}
