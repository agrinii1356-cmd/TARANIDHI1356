import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { formatTime } from "@/lib/format";
import { getPanchang } from "@/lib/panchang/engine";
import { chartFromProfile, useProfile } from "@/lib/panchang/store";
import { ACT_TA, tamilPakshiDay, type Act } from "@/lib/panchang/pakshi";
import { useT } from "@/lib/prefs";

export const Route = createFileRoute("/pakshi")({
  component: PakshiPage,
});

const ACT_HI: Record<Act, string> = {
  Ruling: "राज",
  Eating: "भोजन",
  Walking: "गमन",
  Sleeping: "निद्रा",
  Dying: "मृत्यु",
};

function tone(act: Act) {
  if (act === "Ruling" || act === "Eating") return "text-emerald-700";
  if (act === "Walking") return "text-amber-700";
  return "text-rose-700";
}

function PakshiPage() {
  const profile = useProfile((s) => s.profile);
  const { lang } = useT();
  const [open, setOpen] = useState<number | null>(0);
  const chart = profile?.date ? chartFromProfile(profile) : null;
  const p = useMemo(
    () => (profile ? getPanchang(new Date(), profile.lat, profile.lon, profile.tz) : null),
    [profile],
  );
  const day = useMemo(() => {
    if (!chart || !profile || !p) return null;
    const birth = getPanchang(chart.birth, profile.lat, profile.lon, profile.tz);
    const birthShukla = birth.tithi.paksha === "Shukla";
    const sunrise = new Date(p.sunrise);
    const sunset = new Date(p.sunset);
    const next = new Date(sunrise.getTime() + 24 * 3600000);
    return tamilPakshiDay(sunrise, sunset, next, chart.janmaNakshatra.index, birthShukla, sunrise.getDay());
  }, [chart, p, profile]);

  if (!chart || !day) {
    return <p className="text-muted">जन्म विवरण सहेजें। पक्षी जन्म नक्षत्र और पक्ष से तय होता है।</p>;
  }

  const good15 = day.goodWindows.filter((w) => w.kind === "15min");

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs uppercase tracking-[0.16em] text-muted">Tamil Panchapakshi</p>
        <h1 className="font-display text-3xl">पंच पक्षी</h1>
        <p className="mt-1 text-sm text-muted">
          आपका पक्षी {day.bird} ({day.birdTa})। राज और भोजन में 15 मिनट की शुभ खिड़कियाँ।
        </p>
      </header>

      <Card className="p-4">
        <p className="text-sm">
          जन्म नक्षत्र से पक्षी। दिन और रात सूर्योदय-सूर्यास्त से पाँच जाम। हर जाम में पाँच अपहार।
          रवि/मंगल क्रम तमिल विकिपीडिया से। अन्य वार उसी क्रम का घुमाव — यह एक स्कूल है, एकमात्र पाठ नहीं।
        </p>
      </Card>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">15 मिनट की शुभ खिड़कियाँ</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {good15.slice(0, 12).map((w, i) => (
            <Card key={i} className="p-3 text-sm">
              <span className={tone(w.act)}>{lang === "hi" ? ACT_HI[w.act] : w.act}</span>
              <span className="ml-2 text-muted">
                {formatTime(w.from)} – {formatTime(w.until)}
              </span>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">दस जाम</h2>
        {day.slots.map((s, i) => (
          <Card key={i} className="p-3">
            <button className="flex w-full items-center justify-between text-left" onClick={() => setOpen(open === i ? null : i)}>
              <span>
                {s.half === "Day" ? "दिन" : "रात"} जाम {s.yama}
                <span className={`ml-2 ${tone(s.act)}`}>
                  {lang === "hi" ? ACT_HI[s.act] : s.act} ({ACT_TA[s.act]})
                </span>
              </span>
              <span className="text-xs text-muted">
                {formatTime(s.from)} – {formatTime(s.until)}
              </span>
            </button>
            {open === i && (
              <ul className="mt-2 space-y-1 text-sm">
                {s.apaharams.map((a) => (
                  <li key={a.index} className="flex justify-between">
                    <span className={a.auspicious ? "text-emerald-700" : "text-muted"}>
                      अपहार {a.index}: {lang === "hi" ? ACT_HI[a.act] : a.act}
                    </span>
                    <span className="text-xs text-muted">
                      {formatTime(a.from)} – {formatTime(a.until)} ({a.minutes} मि)
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </section>
    </div>
  );
}
