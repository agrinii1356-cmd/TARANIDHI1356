import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/input";
import { addDaysISO, formatTime, formatWhen, qualityTone, todayISODate } from "@/lib/format";
import { ACTIVITIES, CATEGORIES, getActivity, type Tier } from "@/lib/panchang/activities";
import { chartFromProfile, useProfile } from "@/lib/panchang/store";
import { searchMuhurats, type ScoreResult } from "@/lib/panchang/scoring";
import { planAccess, useBilling } from "@/lib/billing";
import { useT } from "@/lib/prefs";
import { localName } from "@/lib/panchang/names";
import { eventPrabhav } from "@/lib/panchang/prabhav";

type Search = { activity?: string };

const CAT_HI: Record<string, string> = {
  All: "सब",
  Career: "करियर",
  Business: "व्यापार",
  Marketing: "मार्केटिंग",
  Finance: "पैसा",
  Health: "सेहत",
  Travel: "यात्रा",
  Purchase: "खरीद",
  "Real Estate": "संपत्ति",
  Relationship: "रिश्ता",
  Family: "परिवार",
  Education: "पढ़ाई",
  Legal: "कानून",
  Civic: "सार्वजनिक",
  Media: "मीडिया",
  Technology: "तकनीक",
  Daily: "रोज़",
  Spiritual: "साधना",
};

export const Route = createFileRoute("/muhurat")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    activity: typeof s.activity === "string" ? s.activity : undefined,
  }),
  component: MuhuratPage,
});

function MuhuratPage() {
  const { activity: qActivity } = Route.useSearch();
  const profile = useProfile((s) => s.profile);
  const access = planAccess(useBilling());
  const { lang, t } = useT();
  const [tier, setTier] = useState<Tier | "all">("all");
  const [activity, setActivity] = useState(qActivity ?? "job_interview");
  const [start, setStart] = useState(todayISODate());
  const [end, setEnd] = useState(addDaysISO(todayISODate(), 14));
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ priority: ScoreResult[]; alerts: ScoreResult[] } | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!qActivity) return;
    const found = ACTIVITIES.find((a) => a.key === qActivity);
    if (!found) return;
    setActivity(found.key);
    setFilter(found.category);
    setTier(found.tier);
    setResults(null);
  }, [qActivity]);

  const list = useMemo(() => {
    return ACTIVITIES.filter((a) => {
      const tierOk = tier === "all" || a.tier === tier;
      const catOk = filter === "All" || a.category === filter;
      const q = query.trim().toLowerCase();
      const textOk =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.nameHi.includes(q) ||
        a.category.toLowerCase().includes(q);
      return tierOk && catOk && textOk;
    });
  }, [filter, query, tier]);

  const current = ACTIVITIES.find((a) => a.key === activity) ?? list[0];
  const counts = useMemo(() => {
    const out: Record<string, number> = {};
    for (const c of CATEGORIES) {
      out[c] = ACTIVITIES.filter((a) => a.category === c && (tier === "all" || a.tier === tier)).length;
    }
    return out;
  }, [tier]);

  function ask() {
    if (!profile || !current) return;
    if (!access.ok) {
      setBlocked(true);
      return;
    }
    setBlocked(false);
    setBusy(true);
    const chart = chartFromProfile(profile);
    const found = searchMuhurats({
      activityKey: current.key,
      start: new Date(start + "T00:00:00"),
      end: new Date(end + "T23:59:00"),
      chart,
      lat: profile.lat,
      lon: profile.lon,
      tz: profile.tz,
      maxResults: 1,
      minScore: current.tier === "major" ? 58 : 50,
    });
    setResults(found);
    setBusy(false);
  }

  if (!profile) return null;

  const catLabel = (c: string) => (lang === "hi" ? (CAT_HI[c] ?? c) : c);

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-2 lg:items-start">
      <div className="min-w-0 space-y-6">
        <div>
          <h1 className="font-display text-3xl">{t("muhurat")}</h1>
          <p className="mt-1 text-sm text-muted">
            {profile.name}
            {access.kind === "demo" ? ` · ${t("demo")}` : ""}
            {access.kind === "expired" ? (lang === "hi" ? " · डेमो खत्म" : " · demo ended") : ""}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(
            [
              ["all", lang === "hi" ? "दोनों" : "Both"],
              ["daily", lang === "hi" ? "रोज़ के" : "Everyday"],
              ["major", lang === "hi" ? "बड़े फैसले" : "Big decisions"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTier(id)}
              className={
                tier === id
                  ? "min-h-11 rounded-full bg-ink px-1 text-xs leading-tight text-bg"
                  : "min-h-11 rounded-full border border-line bg-surface px-1 text-xs leading-tight text-muted"
              }
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-sm leading-relaxed text-muted">
          {tier === "daily"
            ? lang === "hi"
              ? "रोज़ के काम: कॉल, मीटिंग, खरीदारी, रेज़्यूमे। ये अक्सर होते हैं।"
              : "Everyday work: a call, a meeting, a purchase, a resume. These happen often."
            : tier === "major"
              ? lang === "hi"
                ? "बड़े फैसले: शादी, कंपनी, चुनाव, जॉइनिंग। साल में कुछ बार।"
                : "Rare decisions: marriage, a company, an election, joining. A few times a year."
              : lang === "hi"
                ? "दोनों साथ। रोज़ के काम और बड़े फैसले एक सूची में।"
                : "Both together. Everyday tasks and rare decisions in one list."}
        </p>

        <Card className="min-w-0 space-y-4">
          <div>
            <Label htmlFor="q">{lang === "hi" ? "काम खोजें" : "Find an activity"}</Label>
            <input
              id="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") ask();
              }}
              placeholder={lang === "hi" ? "इंटरव्यू, शादी, चुनाव…" : "Interview, wedding, election…"}
              className="h-11 w-full rounded-md border border-line bg-surface px-3 outline-none focus:border-accent"
            />
            <p className="mt-2 text-xs text-muted">
              {list.length}
              {lang === "hi"
                ? " काम। लिखने से सूची छँटती है। Enter या Submit मुहूर्त निकालता है।"
                : " activities. Typing filters. Enter or Submit runs the muhurat."}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className="min-w-0 truncate text-sm font-medium">
              {lang === "hi" ? "श्रेणी" : "Category"} · {catLabel(filter)}
              {filter !== "All" ? ` · ${counts[filter] ?? 0}` : ""}
            </p>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="min-h-9 shrink-0 rounded-full border border-line px-3 text-xs"
            >
              {menuOpen
                ? lang === "hi"
                  ? "मेनू बंद"
                  : "Close menu"
                : lang === "hi"
                  ? "श्रेणियाँ"
                  : "Categories"}
            </button>
          </div>
          <div className={menuOpen ? "grid min-w-0 gap-3 sm:grid-cols-[11rem_minmax(0,1fr)]" : "min-w-0"}>
            {menuOpen ? (
              <nav className="max-h-72 space-y-0.5 overflow-y-auto rounded-lg border border-line p-1">
                {["All", ...CATEGORIES].filter((c) => c === "All" || (counts[c] ?? 0) > 0).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setFilter(c);
                      if (typeof window !== "undefined" && window.innerWidth < 640) setMenuOpen(false);
                    }}
                    className={
                      filter === c
                        ? "flex w-full items-center justify-between rounded-md bg-ink px-3 py-2 text-left text-xs text-bg"
                        : "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs text-muted hover:bg-surface-2"
                    }
                  >
                    <span className="min-w-0 truncate">{catLabel(c)}</span>
                    {c !== "All" ? <span className="shrink-0 opacity-70">{counts[c] ?? 0}</span> : null}
                  </button>
                ))}
              </nav>
            ) : null}
            <div className="min-w-0">
            <Label>
              {lang === "hi" ? "इस श्रेणी के काम" : "Activities"} · {catLabel(filter)}
            </Label>
            {list.length === 0 ? (
              <p className="mt-2 text-sm text-muted">
                {lang === "hi"
                  ? "इस स्तर पर यहाँ काम नहीं। सब या दूसरा स्तर खोलें।"
                  : "Nothing in this tier. Open All or the other tier."}
              </p>
            ) : (
              <div className="mt-2 max-h-64 space-y-1 overflow-y-auto">
                {list.map((a) => (
                  <button
                    key={a.key}
                    type="button"
                    onClick={() => {
                      setActivity(a.key);
                      setResults(null);
                    }}
                    className={
                      current?.key === a.key
                        ? "flex w-full min-w-0 items-center justify-between gap-3 rounded-lg bg-ink px-3 py-2 text-left text-sm text-bg"
                        : "flex w-full min-w-0 items-center justify-between gap-3 rounded-lg bg-surface-2 px-3 py-2 text-left text-sm"
                    }
                  >
                    <span className="min-w-0">
                      {lang === "hi" ? a.nameHi : a.name}
                      <span className="mt-0.5 block text-xs opacity-70">
                        {lang === "hi" ? a.name : a.nameHi}
                      </span>
                    </span>
                    <span className="text-xs opacity-70">{catLabel(a.category)}</span>
                  </button>
                ))}
              </div>
            )}
            {current ? (
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {catLabel(current.category)} · {current.blurb}{" "}
                {lang === "hi" ? "होरा का कारक" : "Hora looks for"} {current.karaka.join(", ")}.
              </p>
            ) : null}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="start">{lang === "hi" ? "से" : "From"}</Label>
              <input
                id="start"
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="h-11 w-full rounded-md border border-line px-3"
              />
            </div>
            <div>
              <Label htmlFor="end">{lang === "hi" ? "तक" : "Until"}</Label>
              <input
                id="end"
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="h-11 w-full rounded-md border border-line px-3"
              />
            </div>
          </div>
          <Button type="button" className="w-full" size="lg" disabled={busy || !current} onClick={ask}>
            {busy
              ? lang === "hi"
                ? "आकाश पढ़ रहा है…"
                : "Reading the sky…"
              : `Submit · ${lang === "hi" ? current?.nameHi : current?.name}`}
          </Button>
          {blocked ? (
            <p className="text-sm text-bad">
              {lang === "hi" ? "डेमो खत्म। " : "Demo ended. "}
              <Link to="/profile" className="underline">
                {t("pay")}
              </Link>
            </p>
          ) : null}
        </Card>
      </div>

      <div className="min-w-0 space-y-4">
        {!access.ok ? (
          <Card>
            <p className="font-medium">{lang === "hi" ? "तीन दिन का डेमो पूरा हुआ।" : "The 3-day demo is over."}</p>
            <p className="mt-2 text-sm text-muted">
              {lang === "hi"
                ? "मुहूर्त फिर से खोलने के लिए निधि में ₹369 महीना, या साल का प्लान 20% कम।"
                : "Open Nidhi and pay ₹369 for a month, or take the year at 20% off."}
            </p>
            <Link to="/profile" className="mt-4 inline-flex min-h-11 items-center text-sm text-accent">
              {t("pay")}
            </Link>
          </Card>
        ) : null}
        {results ? (
          results.priority.length === 0 ? (
            <Card>
              <p className="text-muted">
                {lang === "hi"
                  ? "इन तारीखों में इस काम की एक भी खुली खिड़की नहीं। माण्डी, आठवाँ लग्न और अशुभ नवतारा हटा दिए गए हैं।"
                  : "No open window for this work in these dates. Mandi, 8th lagna and a malefic navtara are left out."}
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              <h2 className="text-sm font-medium">
                {lang === "hi" ? "एक मुहूर्त" : "One muhurat"} ·{" "}
                {lang === "hi" ? current?.nameHi : current?.name}
              </h2>
              <ScoreCard title={formatWhen(results.priority[0].datetime)} result={results.priority[0]} />
            </div>
          )
        ) : access.ok ? (
          <p className="text-sm text-subtle">
            {lang === "hi"
              ? "ऊपर का नंबर इसी घड़ी का है। Submit आगे की तारीखें खोजता है। सर्वार्थ सिद्धि तभी दिखेगी जब उस घंटे में हो।"
              : "The number is this clock. Submit searches the dates. Sarvartha Siddhi shows only when that hour has it."}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function ScoreCard({ title, result, alert }: { title: string; result: ScoreResult; alert?: boolean }) {
  const { lang } = useT();
  const nm = (name: string) => localName(name, lang);
  const act = getActivity(result.activityKey);
  const p = result.panchang;
  const prabhav = act ? eventPrabhav(act, p, lang) : null;
  const parts = [
    [lang === "hi" ? "पंचांग" : "Panchang", result.breakdown.panchanga, "26%"],
    [lang === "hi" ? "नवतारा" : "Navtara", result.breakdown.navtara, "14%"],
    [lang === "hi" ? "चंद्र" : "Moon", result.breakdown.chandra, "8%"],
    [lang === "hi" ? "होरा" : "Hora", result.breakdown.hora, "12%"],
    [lang === "hi" ? "पक्षी" : "Pakshi", result.breakdown.pakshi, "12%"],
    [lang === "hi" ? "गोचर" : "Gochar", result.breakdown.gochar, "12%"],
    [lang === "hi" ? "दशा" : "Dasha", result.breakdown.dasha, "10%"],
    [lang === "hi" ? "योग" : "Yoga", result.breakdown.golden, "6%"],
  ] as const;
  return (
    <Card className={alert ? "rounded-xl border-bad p-4" : "rounded-xl p-4"}>
      <p className="text-xs text-muted">{title}</p>
      <div className="mt-2 grid gap-1.5 text-xs leading-relaxed">
        <p className="rounded-md bg-surface-2 px-2 py-1.5">
          {lang === "hi" ? "1. समय" : "1. Time"} · {nm(p.horaLord)}{" "}
          {formatTime(p.horaWindow.start)}–{formatTime(p.horaWindow.end)}{" "}
          {lang === "hi" ? "(होरा 60 मिनट)" : "(hora 60 min)"}
        </p>
        <p className="rounded-md bg-surface-2 px-2 py-1.5">
          {lang === "hi" ? "2. स्कोर" : "2. Score"} ·{" "}
          {p.uphora.half === 1
            ? lang === "hi"
              ? `मुख्य ${formatTime(p.horaWindow.halfStart)}–${formatTime(p.horaWindow.halfEnd)} — जोड़`
              : `Mukhya ${formatTime(p.horaWindow.halfStart)}–${formatTime(p.horaWindow.halfEnd)} — adds`
            : lang === "hi"
              ? `उपहोरा ${formatTime(p.horaWindow.halfStart)}–${formatTime(p.horaWindow.halfEnd)} — 10 कम`
              : `Uphora ${formatTime(p.horaWindow.halfStart)}–${formatTime(p.horaWindow.halfEnd)} — 10 less`}
        </p>
        <p className="rounded-md bg-surface-2 px-2 py-1.5">
          {lang === "hi" ? "3. प्रभाव" : "3. Effect"} · {nm(p.horaLord)}{" "}
          {p.uphora.half === 1
            ? lang === "hi"
              ? "मुख्य में भारी"
              : "weighs more in mukhya"
            : lang === "hi"
              ? "उपहोरा में हल्का"
              : "lighter in uphora"}
          {" · "}KP {p.kpSub.index}/7 {nm(p.kpSub.lord)}
        </p>
      </div>
      {alert ? (
        <p className="mt-1 text-sm text-bad">
          {nm(result.tara.name)} · {nm(p.nakshatra.name)}
        </p>
      ) : null}
      <div className="mt-1 flex items-center justify-between gap-3">
        <div className="font-display text-3xl tabular-nums">
          {result.finalScore}
          <span className="ml-2 align-middle">
            <Badge tone={alert || result.sutra.blocks.length ? "bad" : qualityTone(result.quality)}>
              {result.sutra.blocks.length ? nm("Avoid") : alert ? nm("Alert") : nm(result.quality)}
            </Badge>
          </span>
        </div>
        <span className="text-xs text-muted">{nm(result.recommendation)}</span>
      </div>
      <p className="mt-1 text-xs text-muted">
        {(lang === "hi" ? getActivity(result.activityKey)?.nameHi : result.activityName) ?? result.activityName} · {nm(p.tithi.name)} · {nm(p.nakshatra.name)} · {nm(p.vara.name)} · {nm(result.sutra.lagna)} {lang === "hi" ? "लग्न" : "lagna"}
      </p>
      <p className="mt-2 text-sm leading-relaxed">
        {prabhav?.lines.map((line) => (
          <span
            key={line}
            className={
              prabhav.tone === "bad"
                ? "mt-1 block text-bad"
                : prabhav.tone === "good"
                  ? "mt-1 block text-good"
                  : "mt-1 block text-muted"
            }
          >
            {line}
          </span>
        ))}
      </p>
      <p className="mt-2 text-xs text-muted">
        {lang === "hi"
          ? "आधार: पंचांग, नवतारा, चंद्र, होरा, पक्षी, गोचर, दशा में KP/नाड़ी भाव, नन्दादि, मृत्यु/दग्ध, शून्य, भद्रा मुख-पुच्छ।"
          : "Basis: panchang, navtara, moon, hora, pakshi, gochar, dasha with KP/Nadi houses, nandaadi, mrityu/dagdha, shunya, bhadra mukha-puccha."}
      </p>
      {result.sutra.blocks.length ? (
        <p className="mt-2 text-sm text-bad">
          {lang === "hi" ? "बंद" : "Closed"}: {result.sutra.blocks.join(" · ")}
        </p>
      ) : null}
      {result.sutra.cautions.length ? (
        <p className="mt-1 text-sm text-warn">Caution: {result.sutra.cautions.join(" · ")}</p>
      ) : null}
      {result.sutra.supports.length ? (
        <p className="mt-1 text-sm text-good">With you: {result.sutra.supports.slice(0, 4).join(" · ")}</p>
      ) : null}
      <div className="mt-3 space-y-1.5">
        {parts.map(([name, score, weight]) => (
          <div key={name} className="grid grid-cols-[minmax(0,6.2rem)_minmax(0,1fr)_2.2rem] items-center gap-2 text-xs">
            <span className="text-muted">
              {name} <span className="opacity-70">{weight}</span>
            </span>
            <span className="h-1.5 overflow-hidden rounded-full bg-surface-2">
              <span className="block h-full bg-accent" style={{ width: `${score}%` }} />
            </span>
            <span className="text-right tabular-nums">{score}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {p.golden.amritSiddhi ? <Badge tone="good">Amrit Siddhi</Badge> : null}
        {p.golden.sarvarthaSiddhi ? <Badge tone="good">Sarvartha Siddhi</Badge> : null}
        <Badge tone="neutral">
          {result.dasha.maha} / {result.dasha.antar}
        </Badge>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        {lang === "hi" ? "आधार" : "Basis"}: {lang === "hi" ? "दशा" : "Dasha"} {result.dasha.maha}/{result.dasha.antar}
        {" · "}
        {lang === "hi" ? "गोचर" : "Gochar"}{" "}
        {result.gochar.hits.slice(0, 3).map((h) => `${h.planet} ${h.house}`).join(", ")}
        {result.gochar.sadeSati ? (lang === "hi" ? " · साढ़े साती" : " · Sade Sati") : ""}
        {" · "}
        {lang === "hi" ? "नक्षत्र पद" : "Star pada"} {p.nakshatra.pada}
      </p>
      <ul className="mt-2 space-y-0.5 text-sm text-muted">
        {result.reasons.slice(0, 12).map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </Card>
  );
}
