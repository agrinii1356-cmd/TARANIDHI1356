import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Landmark, Plane, Scale, Sparkles, Video, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatTime, qualityTone } from "@/lib/format";
import { dashaFor, getPanchang } from "@/lib/panchang/engine";
import { chartFromProfile, useProfile } from "@/lib/panchang/store";
import { useEventPlace } from "@/lib/panchang/here";
import { dayScore, scoreMuhurat } from "@/lib/panchang/scoring";
import { useWallet } from "@/lib/panchang/wallet";
import { getActivity } from "@/lib/panchang/activities";
import { localName } from "@/lib/panchang/names";
import { useT } from "@/lib/prefs";

export const Route = createFileRoute("/")({ component: Home });

const DAILY = [
  { key: "job_interview", label: "Interview", icon: Briefcase },
  { key: "send_resume", label: "Resume", icon: Briefcase },
  { key: "client_call", label: "Client call", icon: Wallet },
  { key: "zoom_important", label: "Video call", icon: Video },
  { key: "travel_booking", label: "Travel", icon: Plane },
  { key: "financial_transaction", label: "Money", icon: Wallet },
];

const MAJOR = [
  { key: "job_joining", label: "Joining" },
  { key: "company_incorporation", label: "Company" },
  { key: "movie_launch", label: "Launch" },
  { key: "election_nomination", label: "Nomination" },
  { key: "vivah_muhurat", label: "Marriage" },
  { key: "file_case", label: "Case" },
];

function Home() {
  const profile = useProfile((s) => s.profile);
  const here = useEventPlace(profile);
  const credits = useWallet((s) => s.credits);
  const { lang, t } = useT();
  const nm = (name: string) => localName(name, lang);
  const tx = (en: string, hi: string) => (lang === "hi" ? hi : en);
  if (!profile) return null;

  const now = new Date();
  const noon = new Date();
  noon.setHours(12, 0, 0, 0);
  const chart = chartFromProfile(profile);
  const lat = here?.lat ?? profile.lat;
  const lon = here?.lon ?? profile.lon;
  const tz = here?.tz ?? profile.tz;
  const p = getPanchang(now, lat, lon, tz);
  const day = dayScore(noon, chart, lat, lon, tz);
  const dasha = dashaFor(chart, now);

  const windows = [
    { label: tx("Career", "करियर"), key: "corporate_meeting" },
    { label: tx("Money", "पैसा"), key: "financial_transaction" },
    { label: tx("Talk", "बात"), key: "zoom_important" },
  ].map((w) => {
    const dt = new Date(now);
    dt.setMinutes(0, 0, 0);
    const scored = scoreMuhurat(dt, w.key, chart, lat, lon, tz);
    return { ...w, scored };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted">
            {now.toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
            {here ? ` · ${here.name}${here.region ? `, ${here.region}` : ""}` : ""}
          </p>
          <h1 className="mt-1 font-display text-3xl">Namaste, {profile.name}</h1>
        </div>
        <Link
          to="/profile"
          className="rounded-full border border-line bg-surface px-3 py-2 text-sm tabular-nums"
        >
          {credits} {tx("nidhi", "निधि")}
        </Link>
      </div>

      <Card className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">{tx("Personal day", "आपका दिन")}</p>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="font-display text-5xl tabular-nums leading-none">
              {Math.round(day.finalScore)}
            </span>
            <Badge tone={qualityTone(day.quality)}>{nm(day.quality)}</Badge>
          </div>
          <p className="mt-3 text-sm text-muted">
            {tx("Tara", "तारा")} {nm(day.tara.name)} · {tx("Moon", "चंद्र")} {day.chandra.distance}{" "}
            {tx("from natal", "जन्म से")} · {nm(dasha.maha)}/{nm(dasha.antar)}
          </p>
        </div>
        <div className="text-right text-sm text-muted">
          <div>
            {nm(p.tithi.name)} · {nm(p.tithi.paksha)}
          </div>
          <div>
            {nm(p.nakshatra.name)} {p.nakshatra.pada}
          </div>
          <div>
            {nm(p.moonRashi.tatva)} · {nm(p.nakshatra.guna)}
          </div>
        </div>
      </Card>

      {p.golden.amritSiddhi || p.golden.sarvarthaSiddhi ? (
        <Card className="flex items-center gap-3 rounded-xl">
          <Sparkles className="size-5 text-accent" strokeWidth={1.6} />
          <div>
            <p className="font-medium">
              {p.golden.amritSiddhi ? tx("Amrit Siddhi Yoga today", "आज अमृत सिद्धि योग") : tx("Sarvartha Siddhi Yoga today", "आज सर्वार्थ सिद्धि योग")}
            </p>
            <p className="text-sm text-muted">
              {nm(p.vara.name)} + {nm(p.nakshatra.name)}. {tx("A golden window for most starts.", "अधिकतर शुरुआत के लिए सुनहरी खिड़की।")}
            </p>
          </div>
        </Card>
      ) : null}

      <div>
        <h2 className="mb-3 text-sm font-medium text-muted">{tx("Windows now", "अभी की खिड़की")}</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {windows.map((w) => (
            <Card key={w.key} className="rounded-xl p-4">
              <div className="text-xs text-muted">{w.label}</div>
              <div className="mt-1 font-display text-2xl tabular-nums">
                {Math.round(w.scored.finalScore)}
              </div>
              <p className="mt-2 space-y-0.5 text-xs leading-relaxed text-muted">
                <span className="block">
                  {tx("1. Time", "1. समय")} · {nm(w.scored.panchang.horaLord)}{" "}
                  {formatTime(w.scored.panchang.horaWindow.start)}–
                  {formatTime(w.scored.panchang.horaWindow.end)}
                </span>
                <span className="block">
                  {tx("2. Score", "2. स्कोर")} ·{" "}
                  {w.scored.panchang.uphora.half === 1
                    ? tx("Mukhya adds", "मुख्य में जोड़")
                    : tx("Uphora is 10 less", "उपहोरा में 10 कम")}
                </span>
                <span className="block">
                  {tx("3. Effect", "3. प्रभाव")} ·{" "}
                  {w.scored.panchang.uphora.half === 1
                    ? tx("Same planet, heavier", "वही ग्रह, भारी")
                    : tx("Same planet, lighter", "वही ग्रह, हल्का")}
                </span>
              </p>
              <Badge className="mt-2" tone={qualityTone(w.scored.quality)}>
                {nm(w.scored.quality)}
              </Badge>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-muted">{tx("Daily life", "रोज़ के काम")}</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {DAILY.map((q) => (
            <Link
              key={q.key}
              to="/muhurat"
              search={{ activity: q.key }}
              className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border border-line bg-surface p-3 text-center text-xs hover:bg-surface-2"
            >
              <q.icon className="size-5 text-accent" strokeWidth={1.6} />
              {lang === "hi" ? (getActivity(q.key)?.nameHi ?? q.label) : q.label}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-muted">{tx("Big decisions", "बड़े फैसले")}</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {MAJOR.map((q) => (
            <Link
              key={q.key}
              to="/muhurat"
              search={{ activity: q.key }}
              className="flex min-h-16 items-center justify-center rounded-xl border border-line bg-surface px-2 text-center text-xs hover:bg-surface-2"
            >
              {q.key === "file_case" ? <Scale className="mr-1 size-4 text-accent" /> : null}
              {q.key === "company_incorporation" ? (
                <Landmark className="mr-1 size-4 text-accent" />
              ) : null}
              {lang === "hi" ? (getActivity(q.key)?.nameHi ?? q.label) : q.label}
            </Link>
          ))}
        </div>
      </div>

      <Card className="rounded-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">{tx("Today’s limbs", "आज के अंग")}</h2>
          <Link to="/panchang" className="text-sm text-accent">
            {t("panchang")}
          </Link>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          <Item label={tx("Yoga", "योग")} value={nm(p.yoga.name)} />
          <Item label={tx("Karana", "करण")} value={nm(p.karana.name)} />
          <Item
            wide
            label={tx("1. Time", "1. समय")}
            value={`${nm(p.horaLord)} ${formatTime(p.horaWindow.start)}–${formatTime(p.horaWindow.end)}`}
          />
          <Item
            wide
            label={tx("2. Score", "2. स्कोर")}
            value={
              p.uphora.half === 1
                ? `${tx("Mukhya", "मुख्य")} ${formatTime(p.horaWindow.halfStart)}–${formatTime(p.horaWindow.halfEnd)} · ${tx("adds", "जोड़")}`
                : `${tx("Uphora", "उपहोरा")} ${formatTime(p.horaWindow.halfStart)}–${formatTime(p.horaWindow.halfEnd)} · ${tx("10 less", "10 कम")}`
            }
          />
          <Item
            wide
            label={tx("3. Effect", "3. प्रभाव")}
            value={
              p.uphora.half === 1
                ? tx("Same planet, heavier in mukhya", "वही ग्रह, मुख्य में भारी")
                : tx("Same planet, lighter in uphora", "वही ग्रह, उपहोरा में हल्का")
            }
          />
          <Item label={tx("Sunrise", "सूर्योदय")} value={formatTime(p.sunrise)} />
          <Item label={tx("Sunset", "सूर्यास्त")} value={formatTime(p.sunset)} />
          <Item
            label={tx("Rahu Kaal", "राहु काल")}
            value={`${formatTime(p.rahuKaal.start)} – ${formatTime(p.rahuKaal.end)}`}
          />
        </dl>
      </Card>
    </div>
  );
}

function Item({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2 min-w-0 sm:col-span-3" : "min-w-0"}>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 break-words">{value}</dd>
    </div>
  );
}
