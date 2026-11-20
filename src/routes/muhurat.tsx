import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/input";
import { addDaysISO, formatTime, formatWhen, todayISODate } from "@/lib/format";
import { ACTIVITIES, CATEGORIES, getActivity, type Paddhati, type Tier } from "@/lib/panchang/activities";
import { PARASHAR_CATEGORIES } from "@/lib/panchang/parashar";
import { chartFromProfile, useProfile } from "@/lib/panchang/store";
import { refreshGps, useEventPlace, useHere } from "@/lib/panchang/here";
import { PlacePicker } from "@/components/place-picker";
import { searchMuhurats, type ScoreResult } from "@/lib/panchang/scoring";
import { amantaMonth } from "@/lib/panchang/engine";
import { limbEffect } from "@/lib/panchang/effects";
import { choghadiyaAt } from "@/lib/panchang/sutra";
import { planAccess, useBilling } from "@/lib/billing";
import { useT } from "@/lib/prefs";
import { localName } from "@/lib/panchang/names";

type Search = { activity?: string; on?: string };

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
  Baby: "शिशु",
  Construction: "निर्माण",
  Dealing: "लेन-देन",
  Farming: "कृषि",
  "Grih Pravesh": "गृह प्रवेश",
  Manufacturing: "निर्माण कार्य",
  Marriage: "विवाह",
  Medical: "औषधि",
  Misc: "विविध",
  Official: "अधिकार",
  Pregnancy: "गर्भ",
  Purchasing: "खरीद",
  Selling: "बेचना",
  Starting: "आरंभ",
  Using: "उपयोग",
  Wearing: "पहनना",
  Journeys: "यात्रा",
};

export const Route = createFileRoute("/muhurat")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    activity: typeof s.activity === "string" ? s.activity : undefined,
    on: typeof s.on === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s.on) ? s.on : undefined,
  }),
  component: MuhuratPage,
});

function MuhuratPage() {
  const { activity: qActivity, on: qOn } = Route.useSearch();
  const profile = useProfile((s) => s.profile);
  const access = planAccess(useBilling());
  const { lang, t } = useT();
  const [paddhati, setPaddhati] = useState<Paddhati>("advance");
  const [tier, setTier] = useState<Tier | "all">("all");
  const [activity, setActivity] = useState(qActivity ?? "job_interview");
  const [start, setStart] = useState(qOn ?? todayISODate());
  const [end, setEnd] = useState(qOn ? addDaysISO(qOn, 14) : "2026-12-04");
  const event = useEventPlace(profile);
  const setHere = useHere((s) => s.setPlace);
  const [filter, setFilter] = useState("All");
  const [sub, setSub] = useState("All");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ priority: ScoreResult[]; alerts: ScoreResult[] } | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!qOn) return;
    setStart(qOn);
    setEnd(addDaysISO(qOn, 14));
    setResults(null);
  }, [qOn]);

  useEffect(() => {
    if (!qActivity) return;
    const found = ACTIVITIES.find((a) => a.key === qActivity);
    if (!found) return;
    setActivity(found.key);
    setFilter(found.category);
    setTier(found.tier);
    setResults(null);
  }, [qActivity]);

  const cats = paddhati === "traditional" ? PARASHAR_CATEGORIES : [...CATEGORIES];
  const subOf = (a: { name: string; nameHi: string; paddhati: string }) =>
    a.paddhati === "advance" && a.name.includes(": ") ? a.name.split(": ")[0] : a.name;
  const subs = useMemo(() => {
    if (filter === "All") return [] as string[];
    const seen = new Set<string>();
    for (const a of ACTIVITIES) {
      if (a.paddhati !== paddhati) continue;
      if (a.category !== filter) continue;
      if (tier !== "all" && a.tier !== tier) continue;
      seen.add(subOf(a));
    }
    return [...seen];
  }, [filter, paddhati, tier]);
  const list = useMemo(() => {
    return ACTIVITIES.filter((a) => {
      const padOk = a.paddhati === paddhati;
      const tierOk = tier === "all" || a.tier === tier;
      const catOk = filter === "All" || a.category === filter;
      const subOk = sub === "All" || subOf(a) === sub;
      const q = query.trim().toLowerCase();
      const textOk =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.nameHi.includes(q) ||
        a.category.toLowerCase().includes(q) ||
        (a.western ?? "").toLowerCase().includes(q);
      return padOk && tierOk && catOk && subOk && textOk;
    });
  }, [filter, query, tier, paddhati, sub]);

  const current = ACTIVITIES.find((a) => a.key === activity) ?? list[0];
  const counts = useMemo(() => {
    const out: Record<string, number> = {};
    for (const c of cats) {
      out[c] = ACTIVITIES.filter((a) => a.paddhati === paddhati && a.category === c && (tier === "all" || a.tier === tier)).length;
    }
    return out;
  }, [tier, paddhati, cats]);

  function ask() {
    if (!profile || !current) return;
    if (!access.ok) {
      setBlocked(true);
      return;
    }
    setBlocked(false);
    setBusy(true);
    const chart = chartFromProfile(profile);
    const lat = event?.lat ?? profile.lat;
    const lon = event?.lon ?? profile.lon;
    const tz = event?.tz ?? profile.tz;
    const placeLabel = [event?.name || profile.city, event?.region].filter(Boolean).join(", ");
    const found = searchMuhurats({
      activityKey: current.key,
      start: new Date(start + "T00:00:00"),
      end: new Date(end + "T23:59:00"),
      chart,
      lat,
      lon,
      tz,
      maxResults: 3,
      minScore: current.tier === "major" ? 58 : 50,
    });
    for (const row of [...found.priority, ...found.alerts]) {
      if (row.muhurta) row.muhurta.place = placeLabel || `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
    }
    setResults(found);
    try {
      const key = "taranidhi-queries";
      const prev = JSON.parse(localStorage.getItem(key) || "[]") as unknown[];
      prev.push({
        at: new Date().toISOString(),
        who: profile.name,
        activity: current.key,
        from: start,
        to: end,
        place: placeLabel || profile.city,
      });
      localStorage.setItem(key, JSON.stringify(prev.slice(-200)));
    } catch {
      /* the phone can refuse storage; the muhurat still shows */
    }
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

        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ["advance", lang === "hi" ? "एडवांस" : "Advance"],
              ["traditional", lang === "hi" ? "पारंपरिक" : "Traditional"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setPaddhati(id);
                setFilter("All");
                setSub("All");
                setResults(null);
              }}
              className={
                paddhati === id
                  ? "min-h-11 rounded-full bg-ink px-2 text-sm text-bg"
                  : "min-h-11 rounded-full border border-line bg-surface px-2 text-sm text-muted"
              }
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-sm leading-relaxed text-muted">
          {paddhati === "traditional"
            ? lang === "hi"
              ? "पारंपरिक पद्धति। 229 शास्त्रीय मुहूर्त। पंचांग के नियम। जन्म कुंडली द्वितीय।"
              : "Traditional paddhati. 229 classical muhurtas. Panchang rules first. Birth chart second."
            : lang === "hi"
              ? "एडवांस पद्धति। जन्म कुंडली आधार। ताराबल, चंद्रबल, दशा, गोचर, पक्षी।"
              : "Advance paddhati. Birth chart is the base. Tarabal, Chandrabala, dasha, gochar, pakshi."}
        </p>

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
                ? " काम। तारीख और Submit यहीं हैं। सूची नीचे है, स्क्रॉल के बाद नहीं।"
                : " activities. Dates and Submit sit here. The list is below, not after a scroll."}
            </p>
          </div>
          {current ? (
            <p className="rounded-lg bg-surface-2 px-3 py-2 text-sm">
              {lang === "hi" ? "चुना काम" : "Chosen work"} · {lang === "hi" ? current.nameHi : current.name}
            </p>
          ) : null}
          <div>
            <PlacePicker
              id="place"
              label={lang === "hi" ? "मुहूर्त का स्थान" : "Muhurta place"}
              value={event}
              onChange={(p) => {
                setHere(p, "picked");
                setResults(null);
              }}
            />
            <button
              type="button"
              className="mt-2 text-sm text-accent underline-offset-2 hover:underline"
              onClick={() => refreshGps(setHere)}
            >
              {lang === "hi" ? "मेरी जगह (GPS)" : "My location (GPS)"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="start">{lang === "hi" ? "से" : "From"}</Label>
              <input
                id="start"
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="h-12 w-full rounded-md border border-line px-3 text-base"
              />
            </div>
            <div>
              <Label htmlFor="end">{lang === "hi" ? "तक" : "Until"}</Label>
              <input
                id="end"
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="h-12 w-full rounded-md border border-line px-3 text-base"
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
            <p className="text-base text-bad">
              {lang === "hi" ? "डेमो खत्म। " : "Demo ended. "}
              <Link to="/profile" className="underline">
                {t("pay")}
              </Link>
            </p>
          ) : null}
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
                {["All", ...cats].filter((c) => c === "All" || (counts[c] ?? 0) > 0).map((c) => (
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
            {filter !== "All" && subs.length > 0 ? (
              <div className="mb-3">
                <Label>{lang === "hi" ? "उपश्रेणी" : "Subcategory"}</Label>
                <div className="mt-2 flex flex-wrap gap-1">
                  {["All", ...subs].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSub(s);
                        setResults(null);
                      }}
                      className={
                        sub === s
                          ? "rounded-full bg-ink px-3 py-1 text-xs text-bg"
                          : "rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted"
                      }
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <Label>
              {lang === "hi" ? "इस श्रेणी के काम" : "Activities"} · {catLabel(filter)}
              {sub !== "All" ? ` · ${sub}` : ""}
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
                        ? "flex w-full min-w-0 items-center justify-between gap-3 rounded-lg bg-ink px-3 py-3 text-left text-base text-bg"
                        : "flex w-full min-w-0 items-center justify-between gap-3 rounded-lg bg-surface-2 px-3 py-3 text-left text-base"
                    }
                  >
                    <span className="min-w-0">
                      {lang === "hi" ? a.nameHi : a.name}
                      <span className="mt-0.5 block text-sm opacity-70">
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
                {lang === "hi"
                  ? `${results.priority.length} शुभ मुहूर्त · ${start} से ${end} तक`
                  : `${results.priority.length} open muhurats · ${start} to ${end}`}
              </h2>
              <ol className="grid gap-2">
                {results.priority.map((row, i) => (
                  <li key={row.datetime} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3 py-2">
                    <span>
                      <span className="text-xs uppercase tracking-widest text-muted">
                        {lang === "hi" ? `मुहूर्त ${i + 1}` : `Muhurat ${i + 1}`}
                      </span>
                      <span className="mt-0.5 block text-sm">{formatWhen(row.datetime)}</span>
                    </span>
                    <span className="font-display text-2xl tabular-nums">{row.finalScore}</span>
                  </li>
                ))}
              </ol>
              {results.priority.map((row, i) => (
                <ScoreCard
                  key={`${row.datetime}-card`}
                  title={formatWhen(row.datetime)}
                  result={row}
                  rank={i + 1}
                />
              ))}
              <p className="text-sm leading-relaxed text-muted">
                {lang === "hi"
                  ? "तीन खिड़कियाँ इसलिए कि एक घंटा काफी नहीं। पहला सबसे भारी। दूसरा और तीसरा उसी काम के लिए अगले खुले घंटे हैं। अशुभ नवतार, माण्डी, आठवाँ लग्न और बंद योग काट दिए गए हैं।"
                  : "Three windows, because one hour is not enough. The first is the heaviest. The next two are the following open hours for the same work. A malefic navtara, Mandi, the 8th lagna and a closed yoga are left out."}
              </p>
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

function LimbPress({
  hi,
  on,
  setOn,
  rows,
}: {
  hi: boolean;
  lang: "hi" | "en";
  on: string;
  setOn: (id: string) => void;
  rows: { id: string; label: string; title: string; body: string }[];
}) {
  const picked = rows.find((row) => row.id === on) ?? rows[0];
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-[#d4b15a]">
        {hi ? "अंग दबाएँ, प्रभाव खुलेगा" : "Press a limb. Its effect opens."}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {rows.map((row) => (
          <button
            key={row.id}
            type="button"
            onClick={() => setOn(row.id)}
            className={
              picked?.id === row.id
                ? "min-h-10 rounded-full bg-[#d4b15a] px-3 text-sm text-[#1c1408]"
                : "min-h-10 rounded-full border border-[#d4b15a]/40 px-3 text-sm text-[#f6e7c1]"
            }
          >
            {row.label}
          </button>
        ))}
      </div>
      {picked ? (
        <div className="mt-3 rounded-xl border border-[#d4b15a]/30 bg-[#10182c] px-4 py-3">
          <p className="text-xs uppercase tracking-widest text-[#d4b15a]">{picked.label}</p>
          <p className="mt-1 font-display text-2xl text-[#ffe08a]">{picked.title}</p>
          <p className="mt-2 text-base leading-relaxed text-[#f6e7c1]">{picked.body}</p>
        </div>
      ) : null}
    </div>
  );
}

function ScoreCard({ title, result, alert, rank }: { title: string; result: ScoreResult; alert?: boolean; rank?: number }) {
  const { lang } = useT();
  const hi = lang === "hi";
  const [limbOn, setLimbOn] = useState("Tithi");
  const nm = (name: string) => localName(name, lang);
  const act = getActivity(result.activityKey);
  const p = result.panchang;
  const name = (hi ? act?.nameHi : result.activityName) ?? result.activityName;
  const closed = result.sutra.blocks.length > 0 || alert;
  const go = !closed && result.finalScore >= 65;
  const start = formatTime(p.horaWindow.start);
  const end = formatTime(p.horaWindow.end);
  const halfA = formatTime(p.horaWindow.halfStart);
  const halfB = formatTime(p.horaWindow.halfEnd);
  const firstHalf = p.uphora.half === 1;
  const dashaWeak = result.breakdown.dasha < 50;
  const star = result.navtaraFlag;
  const verdict = closed
    ? hi ? "इस समय मत जाइए" : "Do not go at this time"
    : go
      ? hi ? "इस समय जाइए" : "Go at this time"
      : hi ? "जा सकते हैं, बेहतर घंटा भी देखें" : "You can go. A better hour may exist";
  const points = [
    star === "priority"
      ? hi ? "आपका जन्म नक्षत्र और यह नक्षत्र मित्र हैं। यही वजह है कि यह घंटा चुना गया।" : "Your birth star and this star are friends. That is why this hour was chosen."
      : star === "alert"
        ? hi ? "यह नक्षत्र आपके जन्म नक्षत्र के विरुद्ध है। इस नक्षत्र में काम शुरू न करें।" : "This star works against your birth star. Do not start the work while it lasts."
        : hi ? "यह नक्षत्र न मित्र है, न शत्रु। समय चल सकता है।" : "This star is neither a friend nor an enemy. The hour can still work.",
    firstHalf
      ? hi ? `मजबूत आधा घंटा ${halfA} से ${halfB} है। बात इसी में शुरू करें।` : `The stronger half is ${halfA} to ${halfB}. Start the talk then.`
      : hi ? `यह घंटे का कमजोर आधा है (${halfA}–${halfB})। हो सके तो पहले आधे घंटे का इंतज़ार करें।` : `This is the weaker half of the hour (${halfA}–${halfB}). Wait for the first half if you can.`,
    dashaWeak
      ? hi ? `अभी की दशा ${nm(result.dasha.maha)} कमजोर है। मुलाकात छोटी रखें।` : `Your current period, ${nm(result.dasha.maha)}, is the weak part. Keep the meeting short.`
      : hi ? `अभी की दशा ${nm(result.dasha.maha)} इस काम के साथ है।` : `Your current period, ${nm(result.dasha.maha)}, supports this work.`,
  ];
  const w = result.weights;
  const pct = (n: number) => `${Math.round(n * 100)}%`;
  const q15 = formatTime(new Date(new Date(p.horaWindow.start).getTime() + 15 * 60000).toISOString());
  const bird = result.pakshi;
  const birdHelps = bird.activity === "Ruling" || bird.activity === "Eating";
  const dirty = result.sutra.cautions.some((c) => /choghadiya|panchak|rahu|yam|mandi|bhadra/i.test(c));
  const clean = result.sutra.blocks.length === 0 && !dirty;
  const golden = clean && result.tara.isShubh && result.chandra.isShubh && firstHalf && birdHelps && result.finalScore >= 78;
  const birdHi: Record<string, string> = { Vulture: "गिद्ध", Owl: "उल्लू", Crow: "कौआ", Cock: "मुर्गा", Peacock: "मोर" };
  const actHi: Record<string, string> = {
    Ruling: "शासन — बात, हस्ताक्षर और शुरुआत के लिए",
    Eating: "भोजन — पैसे, हाँ और लेने के काम के लिए",
    Walking: "चलना — छोटा कदम चल सकता है, बड़ा निर्णय नहीं",
    Sleeping: "नींद — नया काम अभी शुरू न करें",
    Dying: "मृत — हस्ताक्षर, भुगतान और शुरुआत टालें",
  };
  const actEn: Record<string, string> = {
    Ruling: "Ruling — speak, sign and start",
    Eating: "Eating — take money, a yes, or an intake",
    Walking: "Walking — a short step can go, not a big lock",
    Sleeping: "Sleeping — do not start a new thing",
    Dying: "Dying — do not sign, pay or begin",
  };
  const gandmool = ["Ashwini", "Ashlesha", "Magha", "Jyeshtha", "Mula", "Revati"].includes(p.nakshatra.name);
  const kharmas = p.sunRashi.name === "Dhanu";
  const travel = act?.category === "Travel";
  const when = new Date(result.datetime);
  const holashtak = when >= new Date("2026-02-24") && when <= new Date("2026-03-03");
  const chog = choghadiyaAt(p.sunrise, p.sunset, when);
  const chogHi: Record<string, string> = {
    Amrit: "अमृत", Kaal: "काल", Shubh: "शुभ", Rog: "रोग", Labh: "लाभ", Udveg: "उद्वेग", Char: "चर",
  };
  const bag = [...result.sutra.blocks, ...result.sutra.cautions].join(" | ").toLowerCase();
  const has = (s: string) => bag.includes(s.toLowerCase());
  const strong = result.muhurta.grahas.filter((g) => g.digbal).map((g) => nm(g.name));
  const disha: Record<string, string> = {
    Sunday: "West",
    Monday: "East",
    Tuesday: "North",
    Wednesday: "North",
    Thursday: "South",
    Friday: "West",
    Saturday: "East",
  };
  const parts = [
    [hi ? "पंचांग" : "Panchang", result.breakdown.panchanga, pct(w.panch)],
    [hi ? "तारा" : "Star", result.breakdown.navtara, pct(w.navtara)],
    [hi ? "चंद्र" : "Moon", result.breakdown.chandra, pct(w.chandra)],
    [hi ? "घड़ी" : "Hour", result.breakdown.hora, pct(w.hora)],
    [hi ? "पक्षी" : "Bird", result.breakdown.pakshi, pct(w.pakshi)],
    [hi ? "गोचर" : "Transit", result.breakdown.gochar, pct(w.gochar)],
    [hi ? "दशा" : "Period", result.breakdown.dasha, pct(w.dasha)],
    [hi ? "योग" : "Yoga", result.breakdown.golden, pct(w.golden)],
  ] as const;

  return (
    <article className="overflow-hidden rounded-2xl border border-[#d4b15a]/50 bg-[#070b18] text-[#f6e7c1] shadow-[0_0_40px_rgba(212,177,90,0.12)]">
      <div className="space-y-4 px-4 py-5 sm:px-6">
        <img
          src="/logo.png"
          alt="TaraNidhi"
          className="mx-auto h-16 w-16 rounded-full border border-[#d4b15a] object-cover object-[center_22%]"
        />
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#d4b15a]">
            {rank ? (hi ? `मुहूर्त ${rank}` : `Muhurat ${rank}`) + " · " : ""}
            {name}
          </p>
          <p className="mt-1 font-display text-2xl text-[#fff6dc]">{title}</p>
          <p className="mt-3 font-display text-4xl tabular-nums text-[#ffe08a]">
            {start}
            <span className="mx-2 text-lg text-[#d4b15a]">–</span>
            {end}
          </p>
          <p className="mt-1 text-sm text-[#cbb892]">
            {hi ? "शुरुआत की 15 मिनट" : "First 15 minutes"} {start}–{q15}
            {golden ? (hi ? " · गोल्डन विंडो" : " · Golden window") : ""}
          </p>
          <p className="mt-1 text-sm text-[#cbb892]">
            {hi ? "पूरा घंटा। शुरू करें" : "Full hour. Start"} {halfA}–{halfB}
          </p>
          {result.muhurta?.place ? (
            <p className="mt-1 text-sm text-[#cbb892]">
              {hi ? "जगह" : "Place"} · {result.muhurta.place}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-[#d4b15a]/30 bg-[#10182c] px-4 py-3">
          <div>
            <p className="font-display text-3xl tabular-nums text-[#ffe08a]">{result.finalScore}</p>
            <p className="text-xs uppercase tracking-widest text-[#d4b15a]">
              {closed ? (hi ? "बंद" : "Closed") : nm(result.quality)}
            </p>
          </div>
          <p className="max-w-[14rem] text-right text-sm leading-snug text-[#fff6dc]">{verdict}</p>
        </div>

        <ol className="space-y-2 text-sm leading-relaxed text-[#f3e6c4]">
          {points.map((line, i) => (
            <li key={line} className="flex gap-3">
              <span className="mt-0.5 text-[#d4b15a]">{i + 1}</span>
              <span>{line}</span>
            </li>
          ))}
        </ol>

        <div className="space-y-3 rounded-xl border border-[#d4b15a]/25 bg-[#0c1224] px-4 py-3 text-sm leading-relaxed">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#d4b15a]">{hi ? "1 · इस घंटे के अंग" : "1 · The limbs of this hour"}</p>
            <p className="mt-2">
              {hi
                ? `लग्न ${nm(result.sutra.lagna)}। होरा ${nm(p.horaLord)}, ${firstHalf ? "मुख्य" : "उपहोरा"} (${halfA}–${halfB})। चौघड़िया ${chog ? `${chogHi[chog.name] ?? chog.name}, ${chog.good ? "साथ देता है" : "सावधानी"}` : "रात है, दिन का चौघड़िया नहीं"}। नक्षत्र ${nm(p.nakshatra.name)}। ताराबल ${nm(result.tara.name)}। ग्रह बल ${strong.length ? strong.join(", ") + " दिग्बल" : "इस लग्न में कोई ग्रह दिग्बल नहीं"}।`
                : `Lagna ${nm(result.sutra.lagna)}. Hora ${nm(p.horaLord)}, ${firstHalf ? "mukhya" : "uphora"} (${halfA}–${halfB}). Choghadiya ${chog ? `${chog.name}, ${chog.good ? "supports" : "caution"}` : "night, so the day choghadiya is off"}. Star ${nm(p.nakshatra.name)}. Tarabala ${nm(result.tara.name)}. Planetary strength ${strong.length ? strong.join(", ") + " in digbala" : "no planet is in digbala on this lagna"}.`}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[#d4b15a]">{hi ? "2 · क्या साथ है, क्या टालें" : "2 · What supports, what to hold"}</p>
            <p className="mt-2">
              {hi
                ? `चंद्रबल ${result.chandra.distance}${result.chandra.isShubh ? ", साथ है" : ", साथ नहीं"}। पक्ष ${nm(p.tithi.paksha)}, तिथि ${nm(p.tithi.name)}। जन्म नक्षत्र से यह ${nm(result.tara.name)} है।`
                : `Chandrabala ${result.chandra.distance}${result.chandra.isShubh ? ", supports" : ", does not support"}. Paksha ${nm(p.tithi.paksha)}, tithi ${nm(p.tithi.name)}. From your birth star this is ${nm(result.tara.name)}.`}
            </p>
            <p className="mt-2">
              {hi
                ? `राहु काल ${has("rahu") ? "चल रहा है" : "नहीं"}। यमगंड ${has("yamaganda") ? "चल रहा है" : "नहीं"}। गुलिक और माण्डी ${has("mandi") || has("gulika") ? "चल रहे हैं" : "नहीं"}। पंचक ${has("panchak") ? "है" : "नहीं"}। भद्रा ${has("bhadra") ? "है" : "नहीं"}।`
                : `Rahu Kaal ${has("rahu") ? "is on" : "is off"}. Yamaganda ${has("yamaganda") ? "is on" : "is off"}. Gulika and Mandi ${has("mandi") || has("gulika") ? "are on" : "are off"}. Panchak ${has("panchak") ? "is on" : "is off"}. Bhadra ${has("bhadra") ? "is on" : "is off"}.`}
            </p>
            <p className="mt-2">
              {gandmool
                ? hi ? "गंडमूल नक्षत्र। जन्म या बड़ी शुरुआत में सावधानी।" : "Gandmool star. Be careful with a birth or a rare start."
                : hi ? "गंडमूल नहीं।" : "Not a gandmool star."}
              {" "}
              {kharmas
                ? hi ? "खरमास: सूर्य धनु में। विवाह और गृह प्रवेश टालें।" : "Kharmas: the Sun is in Dhanu. Hold a wedding and a house entry."
                : hi ? "खरमास नहीं।" : "Not Kharmas."}
              {" "}
              {holashtak
                ? hi ? "होलाष्टक। विवाह और नई शुरुआत टालें।" : "Holashtak. Hold a wedding and a fresh start."
                : hi ? "होलाष्टक नहीं।" : "Not Holashtak."}
            </p>
            {travel ? (
              <p className="mt-2">
                {hi
                  ? `दिशाशूल: ${nm(p.vara.name)} को ${disha[p.vara.name] ?? ""} दिशा की यात्रा टालें।`
                  : `Disha shool: on ${p.vara.name} avoid travel toward the ${disha[p.vara.name] ?? "marked"} direction.`}
              </p>
            ) : (
              <p className="mt-2">{hi ? "दिशाशूल यात्रा के काम पर देखा जाता है। यह काम यात्रा नहीं है।" : "Disha shool is read for a journey. This work is not a journey."}</p>
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[#d4b15a]">{hi ? "3 · इस खिड़की को कैसे पढ़ें" : "3 · How to read this window"}</p>
            <p className="mt-2">
              {hi
                ? `शुरुआत की 15 मिनट ${start}–${q15} है। ${golden ? "यह गोल्डन विंडो है। नवतार, चंद्रबल, मुख्य आधा, पक्षी और बंद सूत्र सब मिल गए। यहीं शुरू करें।" : "गोल्डन नहीं। गोल्डन तभी जब नवतार मित्र हो, चंद्रबल साथ दे, मुख्य आधा हो, पक्षी शासन या भोजन में हो, और राहु, यम, माण्डी, पंचक, भद्रा, खराब चौघड़िया न हों।"}`
                : `The first 15 minutes are ${start}–${q15}. ${golden ? "This is the golden window. Navtara, the Moon, the first half, the bird and the closed sutras all agree. Start here." : "Not golden. Golden needs a friend navtara, a supporting Moon, the first half, the bird Ruling or Eating, and no Rahu, Yam, Mandi, Panchak, Bhadra or a bad choghadiya."}`}
            </p>
            <p className="mt-2">
              {hi
                ? `आपका पक्षी ${birdHi[bird.bird] ?? bird.bird} है। इस घंटे में यह ${actHi[bird.activity] ?? bird.activity}। याम ${bird.yama}, ${bird.dayHalf === "Day" ? "दिन" : "रात"}। ${birdHelps ? "यह काम के साथ है।" : "यह काम के साथ नहीं है।"}`
                : `Your bird is the ${bird.bird}. This hour it is ${actEn[bird.activity] ?? bird.activity}. Yama ${bird.yama}, ${bird.dayHalf.toLowerCase()}. ${birdHelps ? "It supports the work." : "It does not support the work."}`}
            </p>
            <p className="mt-2 text-[#cbb892]">
              <Link to="/pakshi" className="underline">{hi ? "पक्षी का पूरा चक्र" : "Full bird clock"}</Link>
              {" · "}
              <Link to="/profile" className="underline">{hi ? "ऐप कैसे चलता है" : "How to use the app"}</Link>
            </p>
          </div>
        </div>

        <LimbPress
          hi={hi}
          lang={lang}
          on={limbOn}
          setOn={setLimbOn}
          rows={[
            { id: "Tithi", label: hi ? "तिथि" : "Tithi", title: nm(p.tithi.name), body: limbEffect("tithi", p.tithi.name, lang) },
            { id: "Vaar", label: hi ? "वार" : "Vaar", title: nm(p.vara.name), body: limbEffect("vara", p.vara.name, lang) },
            { id: "Karana", label: hi ? "करण" : "Karana", title: nm(p.karana.name), body: limbEffect("karana", p.karana.name, lang) },
            { id: "Hora", label: hi ? "होरा" : "Hora", title: nm(p.horaLord), body: limbEffect("hora", p.horaLord, lang) },
            {
              id: "Uphora",
              label: hi ? "उपहोरा" : "Uphora",
              title: firstHalf ? (hi ? "मुख्य" : "Mukhya") : (hi ? "उपहोरा" : "Uphora"),
              body: firstHalf
                ? hi
                  ? `${nm(p.horaLord)} का पहला आधा। यही भारी समय है, ${halfA} से ${halfB}।`
                  : `First half of ${nm(p.horaLord)}. This half weighs more, ${halfA} to ${halfB}.`
                : hi
                  ? `${nm(p.horaLord)} का दूसरा आधा। वही ग्रह, असर हल्का, ${halfA} से ${halfB}।`
                  : `Second half of ${nm(p.horaLord)}. Same planet, lighter effect, ${halfA} to ${halfB}.`,
            },
            {
              id: "Navtara",
              label: hi ? "नवतार" : "Navtara",
              title: nm(result.tara.name),
              body: result.tara.isShubh
                ? hi
                  ? "नवतार में यह नक्षत्र मित्र है। इस नक्षत्र को बाकी से ऊपर रखें।"
                  : "In Navtara this star is a friend. Keep this star above the others."
                : hi
                  ? "नवतार में यह नक्षत्र अमित्र है। इस नक्षत्र में सावधान रहें।"
                  : "In Navtara this star is not a friend. Treat this star as an alert.",
            },
            {
              id: "Maas",
              label: hi ? "मास" : "Maas",
              title: nm(amantaMonth(p.nakshatra.index)),
              body: hi
                ? "यह चांद्र मास है। मुहूर्त इसी मास के दिन में गिना गया है।"
                : "This is the lunar month. The muhurat is counted inside this month.",
            },
            {
              id: "Paksha",
              label: hi ? "पक्ष" : "Paksha",
              title: nm(p.tithi.paksha),
              body:
                p.tithi.paksha === "Shukla"
                  ? hi
                    ? "शुक्ल पक्ष। चंद्र बढ़ रहा है। नई शुरुआत को साथ मिलता है।"
                    : "Bright fortnight. The Moon is growing. A new start is supported."
                  : hi
                    ? "कृष्ण पक्ष। चंद्र घट रहा है। पुराना काम पूरा करें। नई शुरुआत हल्की रखें।"
                    : "Dark fortnight. The Moon is waning. Finish old work. Keep a new start light.",
            },
            {
              id: "Chandra",
              label: hi ? "चंद्रबल" : "Chandra",
              title: String(result.chandra.distance),
              body: result.chandra.isShubh
                ? hi
                  ? `चंद्रबल ${result.chandra.distance}। बल 1, 3, 6, 7, 10, 11 में है। छठी भी बल है, उसे नहीं टाला जाता।`
                  : `Chandrabala ${result.chandra.distance}. Bala is 1, 3, 6, 7, 10, 11. The 6th is kept.`
                : hi
                  ? `चंद्रबल ${result.chandra.distance}। 2, 4, 5, 8, 9, 12 में बल नहीं। खिड़की काटी नहीं गई।`
                  : `Chandrabala ${result.chandra.distance}. No bala in 2, 4, 5, 8, 9, 12. The window is not dropped.`,
            },
            {
              id: "Tarabal",
              label: hi ? "ताराबल" : "Tarabal",
              title: `${nm(result.tara.name)} · ${result.tara.count}`,
              body: hi
                ? `ताराबल गणना ${result.tara.count}, आवृत्ति ${result.tara.avritti}। ${result.tara.isShubh ? "बल साथ में है।" : "बल विपरीत है।"}`
                : `Tarabala count ${result.tara.count}, cycle ${result.tara.avritti}. ${result.tara.isShubh ? "The strength is with you." : "The strength is against this hour."}`,
            },
          ]}
        />

        <details className="rounded-xl border border-[#d4b15a]/25 bg-[#0c1224] px-3 py-2 text-xs text-[#cbb892]">
          <summary className="cursor-pointer py-1 text-sm text-[#ffe08a]">
            {hi ? "पूरा हिसाब और कुंडली" : "Full count and charts"}
          </summary>
          <p className="mt-2">
            {nm(p.tithi.name)} · {nm(p.nakshatra.name)} · {nm(p.vara.name)} · {nm(result.sutra.lagna)} {hi ? "लग्न" : "lagna"}
          </p>
          <div className="mt-3 space-y-1.5">
            {parts.map(([label, score, weight]) => (
              <div key={label} className="grid grid-cols-[5.5rem_1fr_2rem] items-center gap-2">
                <span>{label} {weight}</span>
                <span className="h-1 overflow-hidden rounded-full bg-[#1c2744]">
                  <span className="block h-full bg-[#d4b15a]" style={{ width: `${score}%` }} />
                </span>
                <span className="text-right tabular-nums">{score}</span>
              </div>
            ))}
          </div>
          {result.birth ? (
            <p className="mt-3">
              {hi ? "जन्म" : "Birth"} · {nm(result.birth.lagna)} · {nm(result.birth.nakshatra)} · {nm(result.birth.rashi)}
            </p>
          ) : null}
          {result.muhurta ? (
            <p className="mt-1">
              {hi ? "मुहूर्त लग्न" : "Muhurta lagna"} {nm(result.muhurta.lagna)} · D9 {nm(result.muhurta.lagnaD9)} · {result.muhurta.place}
            </p>
          ) : null}
          <ul className="mt-2 space-y-1">
            {result.birth?.grahas.map((g) => (
              <li key={"b" + g.name}>{hi ? "जन्म" : "Birth"} {nm(g.name)} · {nm(g.rashi)} · {g.house}</li>
            ))}
            {result.muhurta?.grahas.map((g) => (
              <li key={"m" + g.name}>{hi ? "मुहूर्त" : "Muhurta"} {nm(g.name)} · {nm(g.rashi)} · {g.house} · D9 {nm(g.d9)}</li>
            ))}
          </ul>
        </details>
      </div>
    </article>
  );
}
