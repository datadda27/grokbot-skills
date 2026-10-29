// Prepper dashboard template v1.2.3 (dashboard v2: Home, Family plan, Details). gen.py replaces the DATA line; this file holds no household text.
import {
  Callout, Checklist, Grid, LineChart, LinkCards, Page, Properties, Rows, Section, Segmented,
  Status, Steps, Table, TableOfContents, Text, useGrokTheme, useState,
} from "grok/canvas";
import type { GrokTheme, ReactNode, Row, StatusTone, TableCell, TableOfContentsItem } from "grok/canvas";

type Level = "ACT NOW" | "PREPARE" | "FYI";
type ItemStatus = "done" | "open" | "unknown" | "na";
type Link = { title: string; url: string };
type Scored = {
  id: string; label: string; status: ItemStatus; points: number; detail: string; doneShare?: number;
  minutes?: number | null; free?: boolean;
};
type CardPart = { label: string; done: number | null; total: number | null; ratio: number };
type Card = {
  id: string; title: string; value: string; unit: string; ratio: number; tick: number | null; status: string;
  note: string; gain: number; scored: boolean; gainText: string; parts: CardPart[];
};
type WeekStep = { title: string; minutes: number | null; gain: number; detail: string };
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
  stretch: string[] | null;
  gaps: Gap[]; uncounted: { label: string; points: number }[]; taskGain: number;
  calc: {
    people: number; infants: number; kcalPerDay: number; kcalTarget: number; waterPerDay: number;
    waterTarget: number; petWaterPerDay: number; petsUnknown: string[]; hot: boolean;
  };
  expiring: Expiring[]; budgetPct: number | null; activeLevel: Level | "none";
  nextTierRows: { title: string; detail: string; gain: number }[]; tierProvisional: boolean;
  cards: Card[]; weekSteps: WeekStep[]; historyFirst: { date: string; score: number } | null;
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
  goBags?: { packed: number; needed: number; spot?: string | null; note: string };
  recalls: {
    on?: boolean; lastCheck: string | null; nextCheck?: string | null; checked: number;
    matches: {
      item: string; product: string; reason: string; date: string; url: string;
      source?: "FDA" | "USDA FSIS" | "CPSC" | "NHTSA"; kind?: "food" | "first aid" | "gear" | "car seat";
    }[];
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
const NOT_SET = "Not set yet";
const TIERS: { id: string; label: string }[] = [
  { id: "72h", label: "72 hours" },
  { id: "2w", label: "2 weeks" },
];

function orUnknown(v: string | null | undefined, fallback: string = NOT_SET): string {
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
function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}
function daysWord(n: number): string {
  return n === 14 ? "2 weeks" : `${n} days`;
}
// Score points still open on one item, on the same 100/applicable scale as the score.
function itemGain(c: Computed, x: Scored): number {
  if (!c.applicable || x.status === "na" || x.status === "done") return 0;
  const earned = x.status === "open" && x.doneShare ? x.points * Math.min(Math.max(x.doneShare, 0), 1) : 0;
  return Math.round((100 * (x.points - earned)) / c.applicable);
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
function verdictStatus(v: string): Row["status"] {
  const label = v.charAt(0) + v.slice(1).toLowerCase();
  if (v === "VERIFIED") return { label, tone: "success" };
  if (v === "NOT SUPPORTED" || v === "UNVERIFIED") return { label, tone: "warning" };
  return { label };
}
function cardTone(status: string): StatusTone {
  if (status === "Biggest gap") return "accent";
  if (status === "On target") return "success";
  return "neutral";
}

// Readiness ring: the accent arc is the score out of 100; points waiting on a yes or no sit as a gray arc right after it.
function scoreRing(t: GrokTheme, c: Computed): ReactNode {
  const r = 78;
  const circ = 2 * Math.PI * r;
  const scoreLen = (Math.max(0, Math.min(100, c.score)) / 100) * circ;
  const waitLen = (Math.max(0, Math.min(100 - c.score, c.pointsWaiting)) / 100) * circ;
  return (
    <svg width="100%" viewBox="0 0 200 200" style={{ maxWidth: 240, display: "block", margin: "0 auto" }} role="img"
      aria-label={`Readiness score ${c.score} of 100`}>
      <circle cx="100" cy="100" r={r} fill="none" stroke={t.fill.secondary} strokeWidth="16" />
      <circle cx="100" cy="100" r={r} fill="none" stroke={t.border.strong} strokeWidth="16"
        strokeDasharray={`${waitLen} ${circ}`} strokeDashoffset={-scoreLen} transform="rotate(-90 100 100)" />
      <circle cx="100" cy="100" r={r} fill="none" stroke={t.dataviz.categorical[0]} strokeWidth="16" strokeLinecap="round"
        strokeDasharray={`${scoreLen} ${circ}`} transform="rotate(-90 100 100)" />
      <text x="100" y="104" textAnchor="middle" fill={t.text.primary} fontFamily={t.font.family} fontSize="56"
        fontWeight={t.weight.semibold}>{c.score}</text>
      <text x="100" y="130" textAnchor="middle" fill={t.text.secondary} fontFamily={t.font.family} fontSize="14">of 100</text>
    </svg>
  );
}

function legendLine(t: GrokTheme, c: Computed): ReactNode {
  const item = (color: string, label: string) => (
    <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 10, height: 10, borderRadius: t.radius.full, background: color, display: "inline-block" }} />
      {label}
    </span>
  );
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", fontSize: t.font.caption.fontSize,
      color: t.text.secondary, marginTop: 8 }}>
      {item(t.dataviz.categorical[0], `${c.score} earned`)}
      {c.pointsWaiting > 0 ? item(t.border.strong, `${c.pointsWaiting} waiting on a yes or no`) : null}
    </div>
  );
}

function meter(t: GrokTheme, ratio: number, tick?: number | null, dashed?: boolean): ReactNode {
  const pct = Math.max(0, Math.min(1, Number.isFinite(ratio) ? ratio : 0)) * 100;
  return (
    <div style={{ position: "relative", height: 10, borderRadius: t.radius.full, background: dashed ? "transparent" : t.fill.secondary,
      border: dashed ? `1px dashed ${t.border.strong}` : undefined, overflow: "hidden", width: "100%", boxSizing: "border-box" }}>
      {dashed ? null : <div style={{ width: `${pct}%`, height: "100%", borderRadius: t.radius.full, background: t.dataviz.categorical[0] }} />}
      {tick !== undefined && tick !== null ? (
        <div style={{ position: "absolute", left: `${tick * 100}%`, top: 0, bottom: 0, width: 2, background: t.bg.base }} />
      ) : null}
    </div>
  );
}

function bigValue(t: GrokTheme, value: string, sub: string): ReactNode {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap", margin: "2px 0 10px" }}>
      <span style={{ fontSize: 36, lineHeight: "40px", fontWeight: t.weight.semibold, color: t.text.primary, fontFamily: t.font.family }}>{value}</span>
      {sub ? <span style={{ fontSize: t.font.subtext.fontSize, color: t.text.secondary }}>{sub}</span> : null}
    </div>
  );
}

function smallLine(t: GrokTheme, text: string, strong?: boolean): ReactNode {
  return (
    <div style={{ fontSize: t.font.subtext.fontSize, lineHeight: t.font.subtext.lineHeight,
      color: strong ? t.text.primary : t.text.secondary, marginTop: 8 }}>{text}</div>
  );
}

function partRows(t: GrokTheme, parts: CardPart[]): ReactNode {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
      {parts.map((p) => {
        const counted = p.done !== null && !!p.total;
        return (
          <div key={p.label}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap",
              fontSize: t.font.subtext.fontSize, color: t.text.secondary, marginBottom: 4 }}>
              <span>{p.label}</span><span>{counted ? `${p.done} of ${p.total}` : "Not counted"}</span>
            </div>
            {meter(t, p.ratio, null, !counted)}
          </div>
        );
      })}
    </div>
  );
}

// Tier track: 72 hours, then 2 weeks (the goal). Reached tiers are filled. The optional 30-day stretch is not a tier.
function tierTrack(t: GrokTheme, c: Computed): ReactNode {
  const accent = t.dataviz.categorical[0];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
      {TIERS.map((tier, i) => {
        const reached = c.tierIndex >= i + 1;
        const next = c.tierIndex === i;
        return (
          <div key={tier.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 14, height: 14, borderRadius: t.radius.full, background: reached ? accent : "transparent",
              border: `2px solid ${reached || next ? accent : t.border.strong}`, display: "inline-block" }} />
            <span style={{ color: t.text.primary, fontWeight: t.weight.medium }}>{tier.label}</span>
            <span style={{ color: t.text.secondary, fontSize: t.font.subtext.fontSize }}>
              {reached ? "Reached" : next ? (i === TIERS.length - 1 ? "Goal" : "Next") : "Later"}
            </span>
            {i < TIERS.length - 1 ? <span style={{ width: 28, height: 2, background: t.border.strong, display: "inline-block" }} /> : null}
          </div>
        );
      })}
    </div>
  );
}

function categoryCard(t: GrokTheme, c: Card): ReactNode {
  const counted = c.unit !== "";
  return (
    <Section key={c.id} heading={c.title} actions={<Status tone={cardTone(c.status)}>{c.status}</Status>}>
      {bigValue(t, c.value, c.unit)}
      {c.parts.length ? partRows(t, c.parts) : meter(t, c.ratio, c.tick, !counted)}
      {c.note ? smallLine(t, c.note) : null}
      {smallLine(t, c.gainText, true)}
    </Section>
  );
}

// Every supply line, full width. Dashed meters are not counted yet: tell the bot and they add to the score.
function supplyList(t: GrokTheme, cats: Category[], target: number): ReactNode {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {cats.map((x, i) => {
        const counted = x.kind === "days" ? x.days !== null : x.itemsDone !== null && !!x.itemsTotal;
        const ratio = !counted ? 0 : x.kind === "days" ? Math.min((x.days ?? 0) / target, 1)
          : Math.min((x.itemsDone ?? 0) / (x.itemsTotal || 1), 1);
        const value = !counted ? "Not counted" : x.kind === "days" ? `${x.days} of ${target} days` : `${x.itemsDone} of ${x.itemsTotal}`;
        const note = x.countNote ? `${x.countNote[0].toUpperCase()}${x.countNote.slice(1)}. ${x.note}` : x.note;
        return (
          <div key={x.id} style={{ padding: "10px 0", borderTop: i === 0 ? undefined : `1px solid ${t.border.subtle}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
              <span style={{ color: t.text.primary, fontWeight: t.weight.medium }}>{x.label}</span>
              <span style={{ color: counted ? t.text.primary : t.text.tertiary }}>{value}</span>
            </div>
            {meter(t, ratio, x.kind === "days" ? Math.min(3 / target, 1) : null, !counted)}
            <div style={{ fontSize: t.font.caption.fontSize, color: t.text.secondary, marginTop: 4 }}>{note}</div>
          </div>
        );
      })}
    </div>
  );
}

// Wallet card, front and back, each cut along its dashed line. Cash, codes, and health details never go on it.
function walletCard(t: GrokTheme, d: Dashboard): ReactNode {
  const p = d.printPlan;
  const line = (k: string, v: string) => (
    <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", padding: "3px 0" }}>
      <span style={{ color: t.text.secondary }}>{k}</span><span style={{ color: t.text.primary }}>{v}</span>
    </div>
  );
  const box = (key: string, title: string, body: ReactNode) => (
    <div key={key} style={{ flex: "1 1 260px", maxWidth: 340, border: `1px dashed ${t.border.strong}`, borderRadius: t.radius.md,
      padding: 14, fontSize: t.font.subtext.fontSize, boxSizing: "border-box" }}>
      <div style={{ fontWeight: t.weight.semibold, color: t.text.primary, marginBottom: 6 }}>{title}</div>
      {body}
    </div>
  );
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
      {box("front", householdTitle(d, "emergency card"), (
        <>
          {p.contacts.slice(0, 3).map((x) => line(x.name, x.phone))}
          {line("Out of area", p.outOfAreaContact ? `${p.outOfAreaContact.name}, ${p.outOfAreaContact.phone}` : NOT_SET)}
          {line("Emergency", "911")}
        </>
      ))}
      {box("back", "Where we meet", (
        <>
          {line("Near home", orUnknown(p.meetingPlaces.nearHome))}
          {line("In town", orUnknown(p.meetingPlaces.outOfNeighborhood))}
          {line("Out of town", orUnknown(p.meetingPlaces.outOfTown))}
          {line("Alerts", orUnknown(p.alertSignup))}
        </>
      ))}
    </div>
  );
}

function sampleNote(d: Dashboard): ReactNode {
  return d._example ? <Callout tone="info" lead="Sample data">{d._example}</Callout> : null;
}

type View = "home" | "plan" | "details";

export default function Prepper() {
  const t = useGrokTheme();
  const [view, setView] = useState<View>("home");
  const d = DATA;
  const c = d.computed;
  const target = d.targets.days;
  const p = d.printPlan;
  const actNow = d.alert.active.filter((a) => a.level === "ACT NOW");
  const prepare = d.alert.active.filter((a) => a.level === "PREPARE");
  const recallsOn = d.recalls.on !== false;
  const matches = recallsOn ? d.recalls.matches : [];

  // Home
  const tierPill = c.tierIndex >= 1
    ? <Status tone="success">{`${TIERS[Math.min(c.tierIndex, TIERS.length) - 1].label} reached${c.tierProvisional ? " (provisional)" : ""}`}</Status>
    : <Status tone="neutral">Getting started</Status>;
  const upFrom = c.historyFirst ? `Up from ${c.historyFirst.score} on ${c.historyFirst.date}. ` : "";
  const alertLine = d.alert.active.length
    ? `${plural(d.alert.active.length, "active alert")} for your places.` : "No alerts for your places.";
  const weekMinutes = c.weekSteps.every((s) => s.minutes !== null && s.minutes !== undefined)
    ? c.weekSteps.reduce((a, s) => a + (s.minutes ?? 0), 0) : null;
  const weekSteps = c.weekSteps.map((s) => {
    const bits = [s.minutes ? `${s.minutes} min` : "", s.gain > 0 ? `+${plural(s.gain, "point")}` : ""].filter((b) => b);
    return { title: bits.length ? `${s.title} (${bits.join(", ")})` : s.title, detail: s.detail };
  });
  const lsRows: Row[] = d.lifeSafety.map((x) => {
    if (x.id === "device") {
      // Yes or no only. No health details on the Page.
      const detail = x.status === "na" ? "No power-dependent medical device at home."
        : x.status === "done" ? "Backup plan in place." : x.status === "open" ? "Backup plan not done yet." : "Not answered yet.";
      return x.status === "done" ? { title: x.label, detail, status: { label: "Done", tone: "success" } }
        : x.status === "na" ? { title: x.label, detail, meta: "Not needed" }
        : { title: x.label, detail, meta: `+${itemGain(c, x)}` };
    }
    if (x.status === "done") return { title: x.label, detail: x.detail, status: { label: "Done", tone: "success" } };
    if (x.status === "na") return { title: x.label, detail: x.detail, meta: "Does not apply" };
    return { title: x.label, detail: x.detail, meta: `+${itemGain(c, x)}` };
  });
  const useFirst = [...(d.outageUseFirst ?? []).filter((u) => u.where === "fridge"), ...(d.outageUseFirst ?? []).filter((u) => u.where === "freezer")];
  const fridgeH = d.outagePlan.fridgeHours ?? 4;
  const freezerH = d.outagePlan.freezerHours ?? 48;
  const glanceCaption = [
    c.cards.some((x) => x.tick !== null) ? "The thin mark on water and food is the 3 day line." : "",
    c.cards.some((x) => !x.scored) ? "Go-bags are not part of the score." : "",
  ].filter((s) => s).join(" ");

  // Details
  const planRows: Row[] = d.planItems.map((x) => x.status === "done"
    ? { title: x.label, detail: x.detail, status: { label: "Done", tone: "success" } }
    : x.status === "na" ? { title: x.label, detail: x.detail, meta: "Does not apply" }
    : { title: x.label, detail: x.detail, meta: `+${itemGain(c, x)}` });
  const exp = c.expiring;
  const expRows: TableCell[][] = exp.map((e) => [
    e.item, `${e.daysLeft < 0 ? `Past ${e.label}` : e.label}${e.estimated ? " (estimated)" : ""}`, e.location, e.idea,
  ]);
  const hazardRows: Row[] = d.hazards.top.map((h) => ({ title: h.hazard, detail: h.rating, meta: h.mode === "on" ? "Watched" : "Not watched" }));
  const connectionRows: Row[] = d.connections.map((x) => ({
    title: x.label,
    detail: x.on ? x.note : `${x.note}${x.addPhrase ? ` Say "${x.addPhrase}" to add it.` : ""}`,
    meta: x.kind === "default" ? "Built in" : "Opt-in",
    status: x.on ? { label: "On", tone: "success" } : { label: "Off" },
  }));
  const channels = d.channels ?? [];
  const channelRows: Row[] = channels.map((ch) => ({
    title: ch.label, detail: `${ch.levels.length ? ch.levels.join(", ") : "Not for alerts"}. ${ch.note}`,
    status: ch.status === "on" ? { label: "On", tone: "success" } : { label: ch.status === "available" ? "Available" : "Coming later" },
  }));
  const headlineRows: Row[] = d.headlineChecks.map((h) => ({
    title: h.headline,
    detail: `${h.action} ${h.sources.length ? `Source: ${h.sources.map((s) => (s.date ? `${s.title} (${s.date})` : s.title)).join("; ")}.` : "No official source found."} Confidence: ${h.confidence}`,
    meta: h.date, status: verdictStatus(h.verdict),
  }));
  const headlineFull: Row[] = d.headlineChecks.filter((h) => h.full).map((h) => ({ title: `${h.date}: ${h.headline}`, detail: h.full }));
  const shopCaption = `A little each week.${d.shopping.monthlyBudget !== null && d.shopping.spent !== null
    ? ` ${money(d.shopping.spent)} of the ${money(d.shopping.monthlyBudget)} monthly budget used.` : ""} Status as of ${d.asOfLabel}.`;
  const toc: TableOfContentsItem[] = [
    { label: "All supplies", id: "all-supplies" },
    { label: "Plan steps", id: "plan-steps" },
    { label: "Use it first", id: "use-first" },
    { label: "Your area", id: "area" },
    { label: "Outage and water", id: "outage-water" },
    { label: "Shopping", id: "shopping" },
    ...(d.history.length >= 2 ? [{ label: "Progress", id: "progress" }] : []),
    { label: "Headline checks", id: "headlines" },
    { label: "Connections", id: "connections" },
    { label: "Sources", id: "sources" },
  ];

  return (
    <Page
      title={view === "plan" ? householdTitle(d, "family emergency plan") : d.page.title}
      summary={view === "plan" ? `Printable plan as of ${d.asOfLabel}. Say "print the plan" for the PDF.` : `${d.page.summary} As of ${d.asOfLabel}.`}
      width="wide"
    >
      <Segmented<View> value={view} onChange={setView}
        options={[{ value: "home", label: "Home" }, { value: "plan", label: "Family plan" }, { value: "details", label: "Details" }]} />

      {view === "home" ? (
        <>
          {sampleNote(d)}
          {actNow.length ? (
            <Callout tone="danger" lead={`${actNow[0].event}: act now`}>{`${actNow[0].doNow} Your phone's emergency alerts and a NOAA Weather Radio are faster than this page.`}</Callout>
          ) : prepare.length ? (
            <Callout tone="warning" lead={`${prepare[0].event}: prepare`}>{`${prepare[0].doNow} Phone alerts and a NOAA Weather Radio are the real-time layer.`}</Callout>
          ) : null}
          {d.alert.emergencyMode.on ? (
            <Callout tone="info" lead="Emergency mode on">{`Since ${orUnknown(d.alert.emergencyMode.since, "today")}. Checking every ${d.alert.emergencyMode.cadenceMin} minutes.`}</Callout>
          ) : null}
          {matches.length ? (
            <Callout tone="warning" lead="Recall match">{`${plural(matches.length, "logged item")} ${matches.length === 1 ? "matches" : "match"} an official recall. Details has the item and the official link.`}</Callout>
          ) : null}

          <Section heading="Readiness" id="readiness" caption={`${d.household.place}, ${d.household.county}.`}>
            <Grid columns={2}>
              <Section heading="Score" actions={tierPill}>
                {scoreRing(t, c)}
                {legendLine(t, c)}
                {smallLine(t, `${upFrom}Based on water, food, and gear for ${daysWord(target)}, plus life safety and the plan.`)}
                {c.uncounted.length ? smallLine(t, `Waiting on: ${c.uncounted.map((u) => u.label).join(", ")}.`) : null}
              </Section>
              <Section heading={c.nextTierLabel ? `Next goal: ${c.nextTierLabel}` : `${TIERS[TIERS.length - 1].label} reached`}>
                {tierTrack(t, c)}
                {c.nextTierRows.length ? (
                  <Rows rows={c.nextTierRows.map((r) => ({ title: r.title, detail: r.detail, meta: r.gain > 0 ? `+${r.gain}` : undefined }))} />
                ) : <Text>Keep rotating and checking in monthly.</Text>}
                {smallLine(t, `${alertLine} Checked ${d.alert.lastCheck}. Next check ${d.alert.nextCheck}. Setup ${c.setupPct}% done.`)}
              </Section>
            </Grid>
          </Section>

          <Section heading="This week" id="this-week" caption={`${d.task.week}.${weekMinutes ? ` About ${weekMinutes} minutes in all.` : ""}`}>
            <Steps steps={weekSteps} />
          </Section>

          {c.cards.length ? (
            <Section heading="At a glance" id="glance" caption={glanceCaption || undefined}>
              <Grid columns={3}>
                {c.cards.map((x) => categoryCard(t, x))}
              </Grid>
            </Section>
          ) : null}

          <Section heading="Life safety" id="life-safety" caption={`These come before any supplies. Status as of ${d.asOfLabel}.`}>
            <Rows rows={lsRows} />
          </Section>

          <Section heading="If the power goes out or we get separated" id="outage">
            <Grid columns={2}>
              {useFirst.length ? (
                <Section heading="Eat these first">
                  <Rows rows={useFirst.map((u, i) => ({
                    lead: String(i + 1), title: u.item,
                    detail: `${u.where === "fridge" ? "Fridge" : "Freezer"}. ${u.qty}.${u.note ? ` ${u.note}` : ""}`,
                    meta: u.date ? `Use by ${u.date}` : undefined,
                  }))} />
                  {smallLine(t, `A closed fridge stays cold about ${fridgeH} hours. A full freezer holds about ${freezerH} hours.`)}
                </Section>
              ) : (
                <Section heading="If the power goes out">
                  <Steps steps={d.outagePlan.steps.map((s) => ({ title: s }))} />
                  {smallLine(t, `A closed fridge stays cold about ${fridgeH} hours. A full freezer holds about ${freezerH} hours.`)}
                </Section>
              )}
              <Section heading="Where we meet">
                <Properties items={[
                  { label: "Near home", value: orUnknown(p.meetingPlaces.nearHome) },
                  { label: "In town", value: orUnknown(p.meetingPlaces.outOfNeighborhood) },
                  { label: "Out of town", value: orUnknown(p.meetingPlaces.outOfTown) },
                  { label: "Shelter at home", value: orUnknown(p.shelterSpot) },
                  { label: "Everyone texts", value: p.outOfAreaContact ? `${p.outOfAreaContact.name}, ${p.outOfAreaContact.phone}` : NOT_SET },
                ]} />
              </Section>
            </Grid>
          </Section>
        </>
      ) : null}

      {view === "plan" ? (
        <>
          {sampleNote(d)}
          <Text>Made to print. Put one copy on the fridge and one in each go-bag.</Text>

          <Section heading="Contacts and meeting places" id="contacts">
            <Grid columns={2}>
              <Section heading="Contacts">
                <Properties items={[
                  ...p.contacts.map((x) => ({ label: x.name, value: x.phone })),
                  { label: "Out-of-area contact", value: p.outOfAreaContact ? `${p.outOfAreaContact.name}, ${p.outOfAreaContact.phone}` : NOT_SET },
                  { label: "Emergency", value: "911" },
                ]} />
              </Section>
              <Section heading="Meeting places">
                <Properties items={[
                  { label: "Near home", value: orUnknown(p.meetingPlaces.nearHome) },
                  { label: "In town", value: orUnknown(p.meetingPlaces.outOfNeighborhood) },
                  { label: "Out of town", value: orUnknown(p.meetingPlaces.outOfTown) },
                  ...(d.household.pets.length ? [{ label: "With pets", value: orUnknown(p.petFriendlyPlace) }] : []),
                  { label: "Shelter at home", value: orUnknown(p.shelterSpot) },
                ]} />
              </Section>
            </Grid>
          </Section>

          <Section heading="If we have to leave" id="leave">
            <Grid columns={3}>
              <Section heading="5 minutes"><Steps steps={p.evacuation.five.map((s) => ({ title: s }))} /></Section>
              <Section heading="15 minutes"><Steps steps={p.evacuation.fifteen.map((s) => ({ title: s }))} /></Section>
              <Section heading="60 minutes"><Steps steps={p.evacuation.sixty.map((s) => ({ title: s }))} /></Section>
            </Grid>
          </Section>

          <Section heading="Shutoffs and alerts" id="shutoffs">
            <Grid columns={2}>
              <Section heading="Shutoffs">
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

          <Section heading="Who does what" id="roles" caption={`Status as of each person's last update. The bot never messages family; share this page or the printed plan.`}>
            <Grid columns={3}>
              {d.family.map((f) => (
                <Section key={`${memberName(f)}-${f.relation}`} heading={memberName(f)} caption={f.role}>
                  {f.checklist.length ? <Checklist items={f.checklist.map((x) => ({ text: x.text, done: x.done }))} /> : smallLine(t, f.relation)}
                  {f.needs ? smallLine(t, f.needs) : null}
                </Section>
              ))}
            </Grid>
          </Section>

          <Section heading="Wallet card" id="wallet" caption={`Cut along the dashed lines. 3.5 by 2 inches. Say "print wallet cards" for the PDF.`}>
            {walletCard(t, d)}
          </Section>
        </>
      ) : null}

      {view === "details" ? (
        <>
          <TableOfContents items={toc} />

          <Section heading="All supplies" id="all-supplies"
            caption={`Days count toward the ${daysWord(target)} goal for ${plural(c.calc.people, "person")}. Dashed lines are not counted yet.`}>
            {supplyList(t, d.categories, target)}
            {c.stretch && c.stretch.length ? smallLine(t, `30 day stretch (optional, never changes the score): ${c.stretch.join(", ")}.`) : null}
            <Section heading={`${target} day calculator`}>
              <Properties items={[
                { label: "Water", value: `${c.calc.waterPerDay} gal a day, ${c.calc.waterTarget} gal total${c.calc.hot ? " (doubled for heat)" : ""}` },
                { label: "Stored water", value: num(d.waterPlan.storedGallons, "gal") },
                { label: "Food", value: `${thousands(c.calc.kcalPerDay)} kcal a day, ${thousands(c.calc.kcalTarget)} total` },
                ...(d.household.pets.length ? [{ label: "Pets", value: c.calc.petsUnknown.length ? `Water ${UNKNOWN} for ${c.calc.petsUnknown.join(", ")}. Ask your vet.` : `${c.calc.petWaterPerDay} gal a day` }] : []),
                ...(c.calc.infants ? [{ label: "Infants", value: "Use what you use now; never estimated." }] : []),
              ]} />
              {smallLine(t, "1 gallon per person per day (Ready.gov). 2,000 kcal per adult (FDA); kids scaled by age as planning estimates.")}
            </Section>
          </Section>

          <Section heading="Plan steps" id="plan-steps" caption={`Status as of ${d.asOfLabel}.`}>
            <Rows rows={planRows} />
          </Section>

          <Section heading="Use it first" id="use-first" caption="Rotate these into meals before they pass their date, then replace them.">
            {expRows.length ? <Table columns={["Item", "Best by", "Where", "Idea"]} rows={expRows} /> : <Text>Nothing near its date.</Text>}
            {d.mealIdeas.length ? smallLine(t, `Meal ideas: ${d.mealIdeas.map((m) => (m.minutes === null ? m.title : `${m.title} (${m.minutes} min)`)).join(", ")}.`) : null}
            <Section heading="Recall check" caption="Optional, once a month. Never part of the score.">
              {recallsOn ? (
                <>
                  <Properties items={[
                    { label: "Result", value: matches.length ? <Status tone="warning">{plural(matches.length, "match")}</Status> : <Status tone="success">No matches</Status> },
                    { label: "Checked", value: `${plural(d.recalls.checked, "logged item")}, ${orUnknown(d.recalls.lastCheck, "not run yet")}` },
                    ...(d.recalls.nextCheck ? [{ label: "Next check", value: d.recalls.nextCheck }] : []),
                    { label: "Sources", value: d.recalls.sources },
                  ]} />
                  {matches.length ? (
                    <>
                      <Rows rows={matches.map((m) => ({ title: m.item, detail: `${m.product}. ${m.reason}`, meta: `${m.source ? `${m.source}, ` : ""}${m.date}` }))} />
                      <LinkCards links={matches.map((m) => ({ title: `${m.item}: ${m.product}`, site: m.source, date: m.date, href: m.url }))} />
                    </>
                  ) : null}
                </>
              ) : <Text>{`Off. Say "recall check on" to check stored food, first aid items, gear, and car seats against FDA, USDA, CPSC, and NHTSA recalls once a month.`}</Text>}
            </Section>
          </Section>

          <Section heading="Your area" id="area" caption={`${d.hazards.source} for ${d.hazards.county}, ${d.hazards.asOf}.`}>
            <Rows rows={hazardRows} />
            {d.alert.fyi.length ? smallLine(t, d.alert.fyi.join(" ")) : null}
            {d.seasonal.length ? (
              <Section heading="Seasonal">
                <Rows rows={d.seasonal.map((s) => ({ lead: s.month, title: s.items.join("; ") }))} />
              </Section>
            ) : null}
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
          </Section>

          <Section heading="Shopping" id="shopping" caption={shopCaption}>
            {d.shopping.items.length ? (
              <Checklist items={d.shopping.items.map((s) => ({ text: `${s.item}, ${s.qty}`, done: s.done, meta: `${money(s.estCost)}, ${s.why}` }))} />
            ) : null}
            {smallLine(t, d.shopping.pace)}
          </Section>

          {d.history.length >= 2 ? (
            <Section heading="Progress" id="progress">
              <LineChart points={d.history.map((h) => ({ label: h.date, value: h.score }))} ceiling={100} floor={0} labels={["Readiness score"]} legend={false} />
            </Section>
          ) : null}

          <Section heading="Headline checks" id="headlines" collapsible defaultOpen={false}
            caption="Posts and headlines checked against official sources.">
            {headlineRows.length ? <Rows rows={headlineRows} />
              : <Text>See a worrying post or headline? Paste it in chat and the bot checks it against official sources.</Text>}
            {headlineFull.length ? <Section heading="Full checks"><Rows rows={headlineFull} /></Section> : null}
          </Section>

          <Section heading="Connections" id="connections" collapsible defaultOpen={false}
            caption={`Last alert check ${d.alert.lastCheck}. Next ${d.alert.nextCheck}. ${d.alert.cadence}`}>
            <Rows rows={connectionRows} />
            <Section heading="Watched places">
              <Rows rows={d.alert.watchedPlaces.map((w) => ({ title: w }))} />
            </Section>
            {channelRows.length ? <Section heading="Delivery channels"><Rows rows={channelRows} /></Section> : null}
            <Section heading="Modules">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {d.modules.map((m) => <Status key={m.id} tone="neutral">{`${m.label}${m.on ? "" : " (off)"}`}</Status>)}
              </div>
            </Section>
          </Section>

          <Section heading="Sources" id="sources" caption={`Prepper v${d.version}. Official sources only; anything unconfirmed says so.`}>
            <LinkCards links={d.sources.map((s) => ({ title: s.title, href: s.url }))} />
            <Text>Not medical, legal, or financial advice. Not a replacement for phone emergency alerts.</Text>
          </Section>
        </>
      ) : null}
    </Page>
  );
}
