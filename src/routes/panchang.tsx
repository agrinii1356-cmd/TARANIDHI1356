import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatTime, todayISODate } from "@/lib/format";
import {
  calculateChandraBala,
  calculateTaraBala,
  dashaFor,
  dayHoras,
  dayLimbs,
  getPanchang,
  placeDay,
} from "@/lib/panchang/engine";
import { NAKSHATRA_LORDS, NAKSHATRAS } from "@/lib/panchang/constants";
import { limbEffect } from "@/lib/panchang/effects";
import { localMonth, localName } from "@/lib/panchang/names";
import { dayMarks } from "@/lib/panchang/sutra";
import { chartFromProfile, useProfile } from "@/lib/panchang/store";
import { useEventPlace } from "@/lib/panchang/here";
import { useT } from "@/lib/prefs";

export const Route = createFileRoute("/panchang")({ component: PanchangPage });

function PanchangPage() {
  const profile = useProfile((s) => s.profile);
  const here = useEventPlace(profile);
  const { lang } = useT();
  const [date, setDate] = useState(todayISODate());
  const [tab, setTab] = useState<LimbTab>("Tithi");
  const [focus, setFocus] = useState("Tithi");
  const [open, setOpen] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const data = useMemo(() => {
    if (!profile) return null;
    const local = new Date(date + "T12:00:00");
    const lat = here?.lat ?? profile.lat;
    const lon = here?.lon ?? profile.lon;
    const tz = here?.tz ?? profile.tz;
    const p = getPanchang(local, lat, lon, tz);
    const span = dayLimbs(local, lat, lon, tz);
    const horas = dayHoras(span.sunrise, span.nextSunrise, p.vara.name);
    const marks = dayMarks(span.sunrise, p.sunset, new Date(span.sunrise).getDay());
    const place = placeDay(local, lat, lon, tz);
    const chart = chartFromProfile(profile);
    const tara = calculateTaraBala(chart.janmaNakshatra.index, p.nakshatra.index);
    const chandra = calculateChandraBala(chart.janmaRashi.index, p.moonRashi.index);
    const dasha = dashaFor(chart, local);
    return { p, tara, chandra, chart, dasha, span, horas, marks, place };
  }, [date, profile, here]);

  if (!profile || !data) return null;
  const { p, tara, chandra, dasha, span, horas, marks, place } = data;
  const tx = (en: string, hiText: string) => (lang === "hi" ? hiText : en);
  const nm = (name: string) => localName(name, lang);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">{tx("Daily panchang", "आज का पंचांग")}</h1>
          <p className="mt-1 text-sm text-muted">
            {(here?.name || profile.city)}{here?.region ? ` · ${here.region}` : ""} · {place.tithiDay} {localMonth(place.month, lang)} · {nm(place.paksha)} {nm(place.tithiName)}
          </p>
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-11 rounded-md border border-line bg-surface px-3"
        />
      </div>

      <Card>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Clock k={tx("Sunrise", "सूर्योदय")} v={formatTime(p.sunrise)} />
          <Clock k={tx("Sunset", "सूर्यास्त")} v={formatTime(p.sunset)} />
          <Clock k={tx("Moonrise", "चंद्रोदय")} v={place.moonrise ? formatTime(place.moonrise) : "—"} />
          <Clock k={tx("Moonset", "चंद्रास्त")} v={place.moonset ? formatTime(place.moonset) : "—"} />
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-2xl">{tx("Panchang", "पंचांग")}</h2>
        <p className="mt-1 text-sm text-muted">
          {tx("Each limb is shown up to the minute it ends.", "हर अंग उस मिनट तक है जब वह खत्म होता है।")}
        </p>
        <dl className="mt-3 divide-y divide-line text-base">
          {span.limbs.map((limb) => (
            <Row
              key={limb.limb}
              k={nm(limb.limb)}
              v={limb.parts
                .map((part) => `${part.name.split(" · ").map((bit) => nm(bit)).join(" ")} ${tx("upto", "तक")} ${formatTime(part.until)}`)
                .join(" · ")}
            />
          ))}
          <Row k={tx("Weekday", "वार")} v={nm(p.vara.name)} />
          <Row k={tx("Paksha", "पक्ष")} v={nm(p.tithi.paksha)} />
        </dl>
      </Card>

      <Card>
        <h2 className="font-display text-xl">{tx("Month and signs", "मास और राशि")}</h2>
        <dl className="mt-3 divide-y divide-line text-base">
          <Row k={tx("Lunar day", "चांद्र दिन")} v={`${place.tithiDay} ${localMonth(place.month, lang)}`} />
          <Row k={tx("At sunrise", "सूर्योदय पर")} v={`${nm(place.paksha)} ${nm(place.tithiName)}`} />
          <Row k={tx("Amanta month", "अमांत मास")} v={localMonth(place.month, lang)} />
          <Row k={tx("Vikram samvat", "विक्रम संवत्")} v={String(place.samvat)} />
          <Row k={tx("Shaka samvat", "शक संवत्")} v={String(place.samvat - 135)} />
          <Row k={tx("Moon sign", "चंद्र राशि")} v={`${nm(p.moonRashi.name)} · ${tx("pada", "पद")} ${p.nakshatra.pada}`} />
          <Row k={tx("Sun sign", "सूर्य राशि")} v={nm(p.sunRashi.name)} />
          <Row k={tx("Vedic ritu", "वैदिक ऋतु")} v={nm(vedicRitu(p.sunRashi.name))} />
          <Row k={tx("Ayana", "अयन")} v={nm(ayanaOf(p.sunRashi.name))} />
          <Row k={tx("Day length", "दिनमान")} v={spanText(p.sunrise, p.sunset, lang)} />
          <Row k={tx("Night length", "रात्रिमान")} v={spanText(p.sunset, span.nextSunrise, lang)} />
        </dl>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <h2 className="font-display text-xl">{tx("Auspicious", "शुभ काल")}</h2>
          <dl className="mt-3 divide-y divide-line text-base">
            <Row k={tx("Brahma muhurta", "ब्रह्म मुहूर्त")} v={`${formatTime(new Date(new Date(p.sunrise).getTime() - 96 * 60000).toISOString())} – ${formatTime(new Date(new Date(p.sunrise).getTime() - 48 * 60000).toISOString())}`} />
            <Row k={tx("Abhijit", "अभिजित")} v={`${formatTime(p.abhijit.start)} – ${formatTime(p.abhijit.end)}`} />
            <Row k={tx("Madhyahna", "मध्याह्न")} v={formatTime(new Date((new Date(p.sunrise).getTime() + new Date(p.sunset).getTime()) / 2).toISOString())} />
          </dl>
        </Card>
        <Card>
          <h2 className="font-display text-xl">{tx("Inauspicious", "अशुभ काल")}</h2>
          <dl className="mt-3 divide-y divide-line text-base">
            <Row k={tx("Rahu Kalam", "राहु काल")} v={`${formatTime(marks.rahu.from)} – ${formatTime(marks.rahu.until)}`} />
            <Row k={tx("Yamaganda", "यमगंड")} v={`${formatTime(marks.yamaganda.from)} – ${formatTime(marks.yamaganda.until)}`} />
            <Row k={tx("Gulika", "गुलिक")} v={`${formatTime(marks.gulika.from)} – ${formatTime(marks.gulika.until)}`} />
          </dl>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="rounded-xl p-4">
          <p className="text-xs text-muted">{tx("Tara Bala", "तारा बल")}</p>
          <p className="mt-1 font-display text-2xl">{nm(tara.name)}</p>
          <Badge className="mt-2" tone={tara.isShubh ? "good" : "bad"}>
            {tara.isShubh ? tx("Favourable", "शुभ") : tx("Caution", "सावधान")}
          </Badge>
        </Card>
        <Card className="rounded-xl p-4">
          <p className="text-xs text-muted">{tx("Chandra Bala", "चंद्र बल")}</p>
          <p className="mt-1 font-display text-2xl">{chandra.distance}{tx("th", "वाँ")}</p>
          <Badge className="mt-2" tone={chandra.isShubh ? "good" : "bad"}>
            {chandra.isShubh ? tx("Chandra Bala", "चंद्रबल है") : tx("No Chandra Bala", "चंद्रबल नहीं")}
          </Badge>
        </Card>
      </div>

      <Card>
        <h2 className="font-display text-xl">{tx("Golden windows", "सुनहरी खिड़की")}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone={p.golden.amritSiddhi ? "good" : "neutral"}>
            {tx("Amrit Siddhi", "अमृत सिद्धि")} {p.golden.amritSiddhi ? tx("yes", "हाँ") : tx("no", "नहीं")}
          </Badge>
          <Badge tone={p.golden.sarvarthaSiddhi ? "good" : "neutral"}>
            {tx("Sarvartha Siddhi", "सर्वार्थ सिद्धि")} {p.golden.sarvarthaSiddhi ? tx("yes", "हाँ") : tx("no", "नहीं")}
          </Badge>
        </div>
        <dl className="mt-4 divide-y divide-line">
          <Row k={tx("Mahadasha", "महादशा")} v={`${nm(dasha.maha)} / ${nm(dasha.antar)}`} />
          <Row
            k={tx("1. Time", "1. समय")}
            v={`${nm(p.horaLord)} ${formatTime(p.horaWindow.start)}–${formatTime(p.horaWindow.end)}`}
          />
          <Row
            k={tx("2. Score", "2. स्कोर")}
            v={
              p.uphora.half === 1
                ? `${tx("Mukhya adds", "मुख्य में जोड़")} ${formatTime(p.horaWindow.halfStart)}–${formatTime(p.horaWindow.halfEnd)}`
                : `${tx("Uphora is 10 less", "उपहोरा में 10 कम")} ${formatTime(p.horaWindow.halfStart)}–${formatTime(p.horaWindow.halfEnd)}`
            }
          />
          <Row
            k={tx("3. Effect", "3. प्रभाव")}
            v={
              p.uphora.half === 1
                ? tx("Same planet, heavier in mukhya", "वही ग्रह, मुख्य में भारी")
                : tx("Same planet, lighter in uphora", "वही ग्रह, उपहोरा में हल्का")
            }
          />
          <Row k={tx("Tatva", "तत्त्व")} v={nm(p.moonRashi.tatva)} />
          <Row k={tx("Guna", "गुण")} v={nm(p.nakshatra.guna)} />
          <Row k={tx("Tithi purushartha", "तिथि पुरुषार्थ")} v={nm(p.tithi.purushartha)} />
        </dl>
      </Card>

      <Card>
        <h2 className="font-display text-xl">{lang === "hi" ? "पंचांग के अंग" : "Limbs"}</h2>
        <p className="mt-1 text-sm text-muted">
          {lang === "hi"
            ? "हर पट्टी पर शुरू और अंत का समय है। दबाएँ, प्रभाव खुल जाएगा।"
            : "Each row has a start and an end. Press it and the effect opens."}
        </p>
        {tab === "Hora" ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <p className="rounded-lg bg-surface-2 px-3 py-2 text-xs leading-relaxed">
              {lang === "hi"
                ? "1. समय: होरा 60 मिनट। मुख्य पहले 30। उपहोरा अगले 30।"
                : "1. Time: hora is 60 min. Mukhya is the first 30. Uphora is the next 30."}
            </p>
            <p className="rounded-lg bg-surface-2 px-3 py-2 text-xs leading-relaxed">
              {lang === "hi"
                ? "2. स्कोर: मुख्य पर जोड़। उपहोरा पर −10।"
                : "2. Score: mukhya adds. Uphora takes 10 off."}
            </p>
            <p className="rounded-lg bg-surface-2 px-3 py-2 text-xs leading-relaxed">
              {lang === "hi"
                ? "3. प्रभाव: ग्रह वही। मुख्य भारी, उपहोरा हल्का।"
                : "3. Effect: same planet. Mukhya weighs more, uphora less."}
            </p>
          </div>
        ) : null}
        <div className="mt-4">
          <p className="text-sm font-medium">
            {lang === "hi" ? "अंग दबाएँ। प्रभाव नीचे खुलेगा।" : "Press a limb. The effect opens below."}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {TABS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setTab(id);
                  setFocus(id);
                  setOpen(null);
                }}
                className={
                  focus === id
                    ? "min-h-10 rounded-full bg-ink px-3 text-sm text-bg"
                    : "min-h-10 rounded-full border border-line px-3 text-sm"
                }
              >
                {lang === "hi" ? TAB_HI[id] : id}
              </button>
            ))}
            {(
              [
                ["Uphora", "उपहोरा"],
                ["Navtara", "नवतार"],
                ["Maas", "मास"],
                ["Paksha", "पक्ष"],
                ["Chandra", "चंद्रबल"],
                ["Tarabal", "ताराबल"],
              ] as const
            ).map(([id, hiLabel]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFocus(id)}
                className={
                  focus === id
                    ? "min-h-10 rounded-full bg-ink px-3 text-sm text-bg"
                    : "min-h-10 rounded-full border border-line px-3 text-sm"
                }
              >
                {lang === "hi" ? hiLabel : id}
              </button>
            ))}
          </div>
          <LimbNow
            focus={focus}
            lang={lang}
            p={p}
            tara={tara}
            chandra={chandra}
            month={place.month}
            rows={rowsFor(tab, span, horas, p.vara.name, marks, p.abhijit)}
          />
        </div>
        <div className="mt-4 flex items-center justify-between gap-2">
          <p className="min-w-0 truncate text-sm font-medium">
            {lang === "hi" ? TAB_HI[tab] : tab}
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
                ? "अंग खोलें"
                : "Open limbs"}
          </button>
        </div>
        <div className={menuOpen ? "mt-3 grid min-w-0 gap-3 sm:grid-cols-[10.5rem_minmax(0,1fr)]" : "mt-3 min-w-0"}>
          {menuOpen ? (
            <nav className="max-h-[28rem] space-y-0.5 overflow-y-auto rounded-lg border border-line p-1">
              {TABS.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setTab(id);
                    setOpen(null);
                    if (typeof window !== "undefined" && window.innerWidth < 640) setMenuOpen(false);
                  }}
                  className={
                    tab === id
                      ? "flex w-full rounded-md bg-ink px-3 py-2 text-left text-xs text-bg"
                      : "flex w-full rounded-md px-3 py-2 text-left text-xs text-muted hover:bg-surface-2"
                  }
                >
                  {lang === "hi" ? TAB_HI[id] : id}
                </button>
              ))}
            </nav>
          ) : null}
          <div className="max-h-[28rem] min-w-0 divide-y divide-line overflow-y-auto">
          {rowsFor(tab, span, horas, p.vara.name, marks, p.abhijit).map((row) => {
            const id = `${tab}-${row.from}`;
            const on = open === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setOpen(on ? null : id)}
                className="block w-full min-w-0 py-3 text-left"
              >
                <span className="flex min-w-0 items-baseline justify-between gap-3">
                  <span className="min-w-0 font-medium break-words">{nm(row.name)}</span>
                  <span className="shrink-0 text-xs tabular-nums text-muted">
                    {formatTime(row.from)} – {formatTime(row.until)}
                  </span>
                </span>
                {tab === "Hora" && row.half ? (
                  <span className="mt-1 grid gap-0.5 text-xs leading-relaxed text-muted">
                    <span>
                      {lang === "hi" ? "1 समय" : "1 Time"} {formatTime(row.from)}–{formatTime(row.until)}
                    </span>
                    <span>
                      {lang === "hi" ? "2 स्कोर +" : "2 Score +"} {lang === "hi" ? "मुख्य" : "Mukhya"}{" "}
                      {formatTime(row.from)}–{formatTime(row.half)}
                    </span>
                    <span>
                      {lang === "hi" ? "3 प्रभाव −" : "3 Effect −"} {lang === "hi" ? "उपहोरा" : "Uphora"}{" "}
                      {formatTime(row.half)}–{formatTime(row.until)}
                    </span>
                  </span>
                ) : (
                  <span className="mt-1 block text-xs leading-relaxed text-muted">
                    {limbEffect(KIND[tab], row.effectName, lang)}
                  </span>
                )}
                {tab === "Hora" && row.subs && row.subs.length > 0 ? (
                  <div className="mt-1 space-y-0.5 text-[11px] leading-tight text-muted">
                    {row.subs.map((s, i) => (
                      <div key={i} className="flex justify-between gap-2">
                        <span>{nm(s.lord)}</span>
                        <span className="tabular-nums">{formatTime(s.from)}–{formatTime(s.until)}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
                {tab === "Nakshatra" ? (
                  <span className="mt-1 block text-sm leading-relaxed text-muted">
                    {lang === "hi"
                      ? `${formatTime(row.from)} से ${formatTime(row.until)} तक। `
                      : `${formatTime(row.from)} to ${formatTime(row.until)}. `}
                    {limbEffect("nakshatra", row.effectName, lang)}
                  </span>
                ) : null}
                {on && tab !== "Nakshatra" ? (
                  <span className="mt-2 block text-sm leading-relaxed text-muted">
                    {lang === "hi"
                      ? `${formatTime(row.from)} से ${formatTime(row.until)} तक का प्रभाव। `
                      : `Effect from ${formatTime(row.from)} to ${formatTime(row.until)}. `}
                    {tab === "Hora" && row.half
                      ? lang === "hi"
                        ? `मुख्य ${formatTime(row.from)}–${formatTime(row.half)}। उपहोरा ${formatTime(row.half)}–${formatTime(row.until)}। `
                        : `Mukhya ${formatTime(row.from)}–${formatTime(row.half)}. Uphora ${formatTime(row.half)}–${formatTime(row.until)}. `
                      : ""}
                    {limbEffect(KIND[tab], row.effectName, lang)}
                  </span>
                ) : null}
              </button>
            );
          })}
          {tab === "Nakshatra" ? (
            <div className="border-t border-line pt-2">
              <p className="py-2 text-xs text-muted">{tx("All 27 nakshatras", "सभी 27 नक्षत्र")}</p>
              {NAKSHATRAS.map((name, index) => (
                <div key={name} className="border-b border-line py-2 text-sm last:border-0">
                  <span className="font-medium">{nm(name)}</span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {tx("Lord", "स्वामी")} {nm(NAKSHATRA_LORDS[index] ?? "")}
                  </span>
                  <span className="mt-1 block leading-relaxed text-muted">
                    {limbEffect("nakshatra", name, lang)}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-xl">{tx("Day markers", "दिन के चिह्न")}</h2>
        <dl className="mt-4 divide-y divide-line">
          <Row k={tx("Sunrise", "सूर्योदय")} v={formatTime(p.sunrise)} />
          <Row k={tx("Sunset", "सूर्यास्त")} v={formatTime(p.sunset)} />
          <Row k={tx("Abhijit", "अभिजित")} v={`${formatTime(p.abhijit.start)} – ${formatTime(p.abhijit.end)}`} />
          <Row k={tx("Rahu Kaal", "राहु काल")} v={`${formatTime(p.rahuKaal.start)} – ${formatTime(p.rahuKaal.end)}`} />
          <Row k={tx("Moon rashi", "चंद्र राशि")} v={nm(p.moonRashi.name)} />
          <Row k={tx("Sun rashi", "सूर्य राशि")} v={nm(p.sunRashi.name)} />
        </dl>
      </Card>
    </div>
  );
}

function LimbNow({
  focus,
  lang,
  p,
  tara,
  chandra,
  month,
  rows,
}: {
  focus: string;
  lang: "hi" | "en";
  p: ReturnType<typeof getPanchang>;
  tara: ReturnType<typeof calculateTaraBala>;
  chandra: ReturnType<typeof calculateChandraBala>;
  month: string;
  rows: { name: string; effectName: string; from: string; until: string; half: string }[];
}) {
  const hi = lang === "hi";
  const nm = (name: string) => localName(name, lang);
  const now = Date.now();
  const live = rows.find((row) => new Date(row.from).getTime() <= now && now < new Date(row.until).getTime()) ?? rows[0];
  let title = live ? nm(live.name) : focus;
  let body = live ? limbEffect(KIND[focus as LimbTab] ?? "tithi", live.effectName, lang) : "";
  if (focus === "Uphora") {
    title = p.uphora.label === "Mukhya" ? (hi ? "मुख्य" : "Mukhya") : hi ? "उपहोरा" : "Uphora";
    body =
      p.uphora.half === 1
        ? hi
          ? `${nm(p.horaLord)} का पहला आधा अभी चल रहा है। यही भारी समय है।`
          : `The first half of ${nm(p.horaLord)} is open now. This half weighs more.`
        : hi
          ? `${nm(p.horaLord)} का दूसरा आधा चल रहा है। वही ग्रह, असर हल्का।`
          : `The second half of ${nm(p.horaLord)} is open. Same planet, lighter effect.`;
  } else if (focus === "Navtara") {
    title = nm(tara.name);
    body = tara.isShubh
      ? hi
        ? "नवतार में यह नक्षत्र मित्र है। इस नक्षत्र को बाकी से ऊपर रखें।"
        : "In Navtara this star is a friend. Keep this star above the others."
      : hi
        ? "नवतार में यह नक्षत्र अमित्र है। इस नक्षत्र में सावधान रहें।"
        : "In Navtara this star is not a friend. Treat this star as an alert.";
  } else if (focus === "Maas") {
    title = nm(month);
    body = hi
      ? "यह चांद्र मास है। आज का पंचांग इसी मास में गिना गया है।"
      : "This is the lunar month. Today's panchang is counted inside it.";
  } else if (focus === "Paksha") {
    title = nm(p.tithi.paksha);
    body =
      p.tithi.paksha === "Shukla"
        ? hi
          ? "शुक्ल पक्ष। चंद्र बढ़ रहा है। नई शुरुआत को साथ मिलता है।"
          : "Bright fortnight. The Moon is growing. A new start is supported."
        : hi
          ? "कृष्ण पक्ष। चंद्र घट रहा है। पुराना काम पूरा करें। नई शुरुआत हल्की रखें।"
          : "Dark fortnight. The Moon is waning. Finish old work. Keep a new start light.";
  } else if (focus === "Chandra") {
    title = String(chandra.distance);
    body = chandra.isShubh
      ? hi
        ? `चंद्रबल ${chandra.distance}। 1, 3, 6, 7, 10, 11 बल है। छठी को नहीं टाला जाता।`
        : `Chandrabala ${chandra.distance}. Bala is 1, 3, 6, 7, 10, 11. The 6th is not avoided.`
      : hi
        ? `चंद्रबल ${chandra.distance}। 2, 4, 5, 8, 9, 12 में बल नहीं। समय काटा नहीं जाता।`
        : `Chandrabala ${chandra.distance}. No bala in 2, 4, 5, 8, 9, 12. The hour is not dropped.`;
  } else if (focus === "Tarabal") {
    title = `${nm(tara.name)} · ${tara.count}`;
    body = hi
      ? `ताराबल गणना ${tara.count}, आवृत्ति ${tara.avritti}। ${tara.isShubh ? "बल साथ में है।" : "बल विपरीत है।"}`
      : `Tarabala count ${tara.count}, cycle ${tara.avritti}. ${tara.isShubh ? "The strength is with you." : "The strength is against this hour."}`;
  }
  return (
    <div className="mt-3 rounded-xl border border-line bg-surface-2 px-4 py-3">
      <p className="font-display text-2xl">{title}</p>
      {live && !["Uphora", "Navtara", "Maas", "Paksha", "Chandra", "Tarabal"].includes(focus) ? (
        <p className="mt-1 text-sm tabular-nums text-muted">
          {formatTime(live.from)} – {formatTime(live.until)}
        </p>
      ) : null}
      <p className="mt-2 text-base leading-relaxed">{body}</p>
    </div>
  );
}

function vedicRitu(sun: string) {
  const map: Record<string, string> = {
    Mesha: "Vasanta", Vrishabha: "Vasanta",
    Mithuna: "Grishma", Karka: "Grishma",
    Simha: "Varsha", Kanya: "Varsha",
    Tula: "Sharad", Vrishchika: "Sharad",
    Dhanu: "Hemanta", Makara: "Hemanta",
    Kumbha: "Shishira", Meena: "Shishira",
  };
  return map[sun] ?? sun;
}

function ayanaOf(sun: string) {
  return ["Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanu"].includes(sun) ? "Dakshinayana" : "Uttarayana";
}

function spanText(fromIso: string, untilIso: string, lang: "hi" | "en") {
  const mins = Math.max(0, Math.round((new Date(untilIso).getTime() - new Date(fromIso).getTime()) / 60000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return lang === "hi" ? `${h} घं ${m} मि` : `${h}h ${m}m`;
}

function Clock({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{k}</p>
      <p className="mt-1 font-display text-2xl tabular-nums">{v}</p>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex min-w-0 justify-between gap-3 py-3 text-base">
      <dt className="shrink-0 text-muted">{k}</dt>
      <dd className="min-w-0 text-right break-words">{v}</dd>
    </div>
  );
}

const TABS = ["Tithi", "Vaar", "Nakshatra", "Yoga", "Karana", "Hora", "Rahu", "Yamaganda", "Mandi", "Abhijit"] as const;
type LimbTab = (typeof TABS)[number];
const TAB_HI: Record<LimbTab, string> = {
  Tithi: "तिथि",
  Vaar: "वार",
  Nakshatra: "नक्षत्र",
  Yoga: "योग",
  Karana: "करण",
  Hora: "होरा",
  Rahu: "राहु",
  Yamaganda: "यमगंड",
  Mandi: "माण्डी",
  Abhijit: "अभिजित",
};
const KIND = {
  Tithi: "tithi",
  Vaar: "vara",
  Nakshatra: "nakshatra",
  Yoga: "yoga",
  Karana: "karana",
  Hora: "hora",
  Rahu: "rahu",
  Yamaganda: "yamaganda",
  Mandi: "gulika",
  Abhijit: "abhijit",
} as const;

function rowsFor(
  tab: LimbTab,
  span: { sunrise: string; nextSunrise: string; limbs: { limb: string; parts: { name: string; from: string; until: string }[] }[] },
  horas: { lord: string; from: string; half: string; until: string; subs?: { lord: string; from: string; until: string }[] }[],
  vara: string,
  marks: { rahu: { from: string; until: string }; yamaganda: { from: string; until: string }; gulika: { from: string; until: string } },
  abhijit: { start: string; end: string },
) {
  if (tab === "Vaar") {
    return [{ name: vara, effectName: vara, from: span.sunrise, until: span.nextSunrise, half: "", subs: [] }];
  }
  if (tab === "Hora") {
    return horas.map((h) => ({
      name: h.lord,
      effectName: h.lord,
      from: h.from,
      until: h.until,
      half: h.half,
      subs: h.subs ?? [],
    }));
  }
  if (tab === "Rahu") return [{ name: "Rahu Kaal", effectName: "Rahu", from: marks.rahu.from, until: marks.rahu.until, half: "", subs: [] }];
  if (tab === "Yamaganda") {
    return [{ name: "Yamaganda", effectName: "Yamaganda", from: marks.yamaganda.from, until: marks.yamaganda.until, half: "", subs: [] }];
  }
  if (tab === "Mandi") return [{ name: "Mandi", effectName: "Mandi", from: marks.gulika.from, until: marks.gulika.until, half: "", subs: [] }];
  if (tab === "Abhijit") {
    return [{ name: "Abhijit", effectName: "Abhijit", from: abhijit.start, until: abhijit.end, half: "", subs: [] }];
  }
  const limb = span.limbs.find((row) => row.limb === tab);
  return (limb?.parts ?? []).map((part) => ({
    name: part.name,
    effectName: part.name,
    from: part.from,
    until: part.until,
    half: "",
    subs: [],
  }));
}
