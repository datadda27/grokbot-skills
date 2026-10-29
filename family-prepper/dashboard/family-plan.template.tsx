// Prepper Family plan Page template v1.2.5: the basics-only plan on its own permanent link, for family to open anytime.
// gen.py --family replaces the DATA line from an allowlist of plan fields; this file holds no household text.
// It never shows supplies, the score, cash, medicines, firearms, or device details.
import { Callout, Grid, Page, Properties, Section, Steps, Text } from "grok/canvas";

type Contact = { name: string; phone: string };
type FamilyPlan = {
  _example?: string;
  version: string; asOfLabel: string;
  household: { name: string; hasPets: boolean };
  plan: {
    contacts: Contact[];
    outOfAreaContact: Contact | null;
    meetingPlaces: { nearHome: string | null; outOfNeighborhood: string | null; outOfTown: string | null };
    utilities: { what: string; where: string | null }[];
    evacuation: { five: string[]; fifteen: string[]; sixty: string[] };
    petFriendlyPlace: string | null; shelterSpot: string | null; alertSignup: string | null; evacZoneSource: string | null;
    awayFromHome?: { who: string; where: string; pickup?: string | null; route?: string | null; alerts?: string | null }[];
  };
  family: { name: string; role: string }[];
};

export const DATA: FamilyPlan = __DATA__;

const NOT_SET = "Not set yet";
const CHECKIN_WHY = "Local phone lines can jam, but a long-distance text often gets through, so everyone reports to this one person. Still text each other directly.";
const WE_ARE_OK = "After anything big, send one text to the out-of-area check-in and the family group: where you are and that you're OK. Phone location sharing, a check-in message, or satellite texting (on phones that have it) can back it up.";

function orUnknown(v: string | null | undefined, fallback: string = NOT_SET): string {
  return v && v.trim() ? v : fallback;
}
function contactText(c: Contact | null): string {
  if (!c) return NOT_SET;
  const parts = [c.name, c.phone].map((x) => (x || "").trim()).filter((x) => x);
  return parts.length ? parts.join(", ") : NOT_SET;
}

export default function FamilyPlanPage() {
  const d = DATA;
  const p = d.plan;
  const n = d.household.name.trim();
  const title = n && !d._example ? `${n}: family plan` : "Family plan";
  const away = p.awayFromHome || [];
  return (
    <Page title={title} summary={`The basics, kept up to date. Updated ${d.asOfLabel}.`}>
      {d._example ? <Callout tone="info" lead="Sample data">{d._example}</Callout> : null}
      <Text>This link always shows the latest plan. No need to ask for a new one.</Text>

      <Section heading="We're OK">
        <Text>{WE_ARE_OK}</Text>
      </Section>

      <Grid columns={2}>
        <Section heading="Contacts">
          <Properties items={[
            ...p.contacts.map((x) => ({ label: x.name, value: x.phone })),
            { label: "Out-of-area check-in", value: contactText(p.outOfAreaContact) },
            { label: "Emergency", value: "911" },
          ]} />
          {p.outOfAreaContact ? <Text>{CHECKIN_WHY}</Text> : null}
        </Section>
        <Section heading="Where we meet">
          <Properties items={[
            { label: "Near home", value: orUnknown(p.meetingPlaces.nearHome) },
            { label: "In town", value: orUnknown(p.meetingPlaces.outOfNeighborhood) },
            { label: "Out of town", value: orUnknown(p.meetingPlaces.outOfTown) },
            ...(d.household.hasPets ? [{ label: "With pets", value: orUnknown(p.petFriendlyPlace) }] : []),
            { label: "Shelter at home", value: orUnknown(p.shelterSpot) },
          ]} />
        </Section>
      </Grid>

      {away.length ? (
        <Section heading="Away from home" caption="If you're away when something happens: stay put and safe, text the check-in, and follow your campus or school alerts.">
          <Grid columns={2}>
            {away.map((a) => (
              <Section key={`${a.who}-${a.where}`} heading={a.who} caption={a.where}>
                <Properties items={[
                  { label: "Pickup", value: orUnknown(a.pickup) },
                  { label: "Route to meet", value: orUnknown(a.route) },
                  { label: "Campus alerts", value: orUnknown(a.alerts) },
                ]} />
              </Section>
            ))}
          </Grid>
        </Section>
      ) : null}

      <Section heading="If we have to leave">
        <Grid columns={3}>
          <Section heading="5 minutes"><Steps steps={p.evacuation.five.map((s) => ({ title: s }))} /></Section>
          <Section heading="15 minutes"><Steps steps={p.evacuation.fifteen.map((s) => ({ title: s }))} /></Section>
          <Section heading="60 minutes"><Steps steps={p.evacuation.sixty.map((s) => ({ title: s }))} /></Section>
        </Grid>
      </Section>

      <Grid columns={2}>
        <Section heading="Shutoffs">
          <Properties items={p.utilities.map((u) => ({ label: u.what, value: orUnknown(u.where, "Not checked yet") }))} />
        </Section>
        <Section heading="Alerts">
          <Properties items={[
            { label: "Phone alerts", value: "Emergency alerts on every phone" },
            { label: "County signup", value: orUnknown(p.alertSignup) },
            { label: "Evacuation zone", value: orUnknown(p.evacZoneSource) },
          ]} />
        </Section>
      </Grid>

      <Section heading="Who does what">
        <Properties items={d.family.map((f) => ({ label: f.name, value: f.role }))} />
      </Section>

      <Section heading="Wallet card" caption="Keep a copy in your wallet or phone.">
        <Properties items={[
          { label: "Out-of-area check-in", value: contactText(p.outOfAreaContact) },
          { label: "Near home", value: orUnknown(p.meetingPlaces.nearHome) },
          { label: "In town", value: orUnknown(p.meetingPlaces.outOfNeighborhood) },
          { label: "Out of town", value: orUnknown(p.meetingPlaces.outOfTown) },
          { label: "Emergency", value: "911" },
        ]} />
      </Section>
    </Page>
  );
}
