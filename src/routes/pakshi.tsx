import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { formatTime } from "@/lib/format";
import { getPanchang } from "@/lib/panchang/engine";
import { chartFromProfile, useProfile } from "@/lib/panchang/store";
import { useEventPlace } from "@/lib/panchang/here";
import { ACT_TA, tamilPakshiDay, type Act, type Apaharam, type PakshiDay, type YamaSlot } from "@/lib/panchang/pakshi";
import { useT } from "@/lib/prefs";

export const Route = createFileRoute("/pakshi")({
  component: PakshiPage,
});

type Use = "decide" | "take" | "move" | "rest";

const ACT_HI: Record<Act, string> = {
  Ruling: "राज",
  Eating: "भोजन",
  Walking: "चलना",
  Sleeping: "सोना",
  Dying: "मृत्यु",
};

const BIRD_HI: Record<string, string> = {
  Vulture: "गिद्ध",
  Owl: "उल्लू",
  Crow: "कौआ",
  Cock: "मुर्गा",
  Peacock: "मोर",
};

/** What a person who has never heard of pakshi should do in each state. */
const MEANING: Record<
  Act,
  { use: Use | "avoid"; good: boolean; one: string; oneEn: string; do: string; dont: string }
> = {
  Ruling: {
    use: "decide",
    good: true,
    one: "पक्षी राज कर रहा है। यही सबसे मजबूत समय है।",
    oneEn: "The bird is ruling. This is the strongest time.",
    do: "इंटरव्यू, मीटिंग, साइन, केस, डील, जॉइनिंग, कोई बड़ा हाँ।",
    dont: "इसे सोने या टालने में न गँवाएँ।",
  },
  Eating: {
    use: "take",
    good: true,
    one: "पक्षी खा रहा है। लेना और स्वीकार करना अच्छा है।",
    oneEn: "The bird is eating. Taking and accepting works.",
    do: "पैसे लेना, खरीद, खाना, ऑफर मानना, भुगतान स्वीकार।",
    dont: "यहाँ नया मुकदमा या बड़ी शुरुआत कमजोर है।",
  },
  Walking: {
    use: "move",
    good: false,
    one: "पक्षी चल रहा है। हिलना अच्छा, बैठकर फैसला कमजोर।",
    oneEn: "The bird is walking. Move, do not sit and decide.",
    do: "यात्रा, कॉल, मैसेज, बाहर निकलना, सामान शिफ्ट।",
    dont: "शादी, घर, लोन या इंटरव्यू यहीं न रखें।",
  },
  Sleeping: {
    use: "rest",
    good: false,
    one: "पक्षी सो रहा है। नया काम शुरू न करें।",
    oneEn: "The bird is sleeping. Do not start anything new.",
    do: "आराम, नींद, जो चल रहा है उसे छोड़ दें।",
    dont: "कोई शुरुआत, साइन या माँग नहीं।",
  },
  Dying: {
    use: "avoid",
    good: false,
    one: "पक्षी मृत्यु में है। यह समय छोड़ दें।",
    oneEn: "The bird is in dying. Leave this time.",
    do: "रुकें। जरूरी हो तो केवल पुराना काम समेटें।",
    dont: "कोई नई बात, यात्रा या पैसा नहीं।",
  },
};

const USES: { id: Use; hi: string; en: string; acts: Act[] }[] = [
  { id: "decide", hi: "फैसला · इंटरव्यू · मीटिंग", en: "Decide · interview · meeting", acts: ["Ruling"] },
  { id: "take", hi: "पैसा · खरीद · स्वीकार", en: "Money · buy · accept", acts: ["Eating"] },
  { id: "move", hi: "यात्रा · कॉल · चलना", en: "Travel · call · move", acts: ["Walking"] },
  { id: "rest", hi: "रुकें · सोएँ", en: "Stop · rest", acts: ["Sleeping", "Dying"] },
];

function tone(act: Act) {
  if (act === "Ruling" || act === "Eating") return "text-emerald-800";
  if (act === "Walking") return "text-amber-800";
  return "text-rose-800";
}

function inRange(from: string, until: string, t: number) {
  return t >= new Date(from).getTime() && t < new Date(until).getTime();
}

function findNow(day: PakshiDay, t: number): { yama: YamaSlot; sub: Apaharam } | null {
  for (const yama of day.slots) {
    if (!inRange(yama.from, yama.until, t)) continue;
    const sub = yama.apaharams.find((a) => inRange(a.from, a.until, t));
    if (sub) return { yama, sub };
  }
  return null;
}

function nextOf(day: PakshiDay, acts: Act[], t: number): Apaharam | null {
  const all = day.slots.flatMap((s) => s.apaharams);
  return all.find((a) => acts.includes(a.act) && new Date(a.until).getTime() > t) ?? null;
}

function PakshiPage() {
  const profile = useProfile((s) => s.profile);
  const here = useEventPlace(profile);
  const { lang } = useT();
  const hi = lang !== "en";
  const [open, setOpen] = useState<number | null>(null);
  const [use, setUse] = useState<Use>("decide");
  const chart = profile?.date ? chartFromProfile(profile) : null;
  const p = useMemo(
    () => (profile && here ? getPanchang(new Date(), here.lat, here.lon, here.tz) : null),
    [profile, here],
  );
  const day = useMemo(() => {
    if (!chart || !profile || !p) return null;
    const birthShukla = chart.birthShukla;
    const sunrise = new Date(p.sunrise);
    const sunset = new Date(p.sunset);
    const next = new Date(sunrise.getTime() + 24 * 3600000);
    return {
      pack: tamilPakshiDay(sunrise, sunset, next, chart.janmaNakshatra.index, birthShukla, sunrise.getDay()),
      star: chart.janmaNakshatra.name,
      paksha: birthShukla ? (hi ? "शुक्ल" : "Shukla") : hi ? "कृष्ण" : "Krishna",
    };
  }, [chart, p, hi]);

  if (!chart || !day) {
    return <p className="text-base text-muted">जन्म विवरण सहेजें। पक्षी जन्म नक्षत्र से तय होता है।</p>;
  }

  const now = Date.now();
  const live = findNow(day.pack, now);
  const want = USES.find((u) => u.id === use)!;
  const upcoming = day.pack.slots
    .flatMap((s) => s.apaharams.map((a) => ({ yama: s, a })))
    .filter((x) => want.acts.includes(x.a.act) && new Date(x.a.until).getTime() > now)
    .slice(0, 8);
  const nextRuling = nextOf(day.pack, ["Ruling"], now);

  const actName = (a: Act) => (hi ? ACT_HI[a] : a);
  const birdHi = BIRD_HI[day.pack.bird] ?? day.pack.bird;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-3xl">{hi ? "पंच पक्षी" : "Panch Pakshi"}</h1>
        <p className="mt-2 text-base leading-relaxed">
          {hi
            ? `आपका पक्षी ${birdHi} है। यह जन्म नक्षत्र ${day.star} और ${day.paksha} पक्ष से तय हुआ है। पक्षी अच्छा या बुरा नहीं होता। वह केवल बताता है कि आज राज, भोजन, चलना, सोना और मृत्यु किस क्रम में आएँगे।`
            : `Your bird is ${day.pack.bird}. It comes from birth star ${day.star} and the ${day.paksha} fortnight. The bird is not lucky or unlucky. It only sets the order of ruling, eating, walking, sleeping and dying today.`}
        </p>
      </header>

      {live && (
        <Card className="space-y-3 p-4">
          <p className="text-xs uppercase tracking-wide text-muted">{hi ? "अभी" : "Right now"}</p>
          <p className={`text-2xl font-medium ${tone(live.sub.act)}`}>
            {actName(live.sub.act)}
            <span className="ml-2 text-base font-normal text-muted">
              {formatTime(live.sub.from)} – {formatTime(live.sub.until)}
            </span>
          </p>
          <p className="text-base leading-relaxed">{hi ? MEANING[live.sub.act].one : MEANING[live.sub.act].oneEn}</p>
          <p className="text-base">
            <span className="font-medium">{hi ? "करें। " : "Do. "}</span>
            {MEANING[live.sub.act].do}
          </p>
          <p className="text-base text-muted">
            <span className="font-medium text-ink">{hi ? "न करें। " : "Do not. "}</span>
            {MEANING[live.sub.act].dont}
          </p>
          {live.yama.act !== live.sub.act && (
            <p className="text-base leading-relaxed">
              {hi
                ? `बड़ा जाम ${formatTime(live.yama.from)} से ${formatTime(live.yama.until)} तक ${actName(live.yama.act)} है। उसके अंदर यह छोटा टुकड़ा अलग है। छोटा टुकड़ा छोटे काम के लिए मानें। बड़ा जाम पूरे ढाई घंटे का मिजाज है।`
                : `The long block from ${formatTime(live.yama.from)} to ${formatTime(live.yama.until)} is ${live.yama.act}. This short slice inside it is different. Use the slice for a short task. The long block is the mood of the whole stretch.`}
            </p>
          )}
          {nextRuling && live.sub.act !== "Ruling" && (
            <p className="text-base">
              {hi ? "अगला राज" : "Next ruling"}: {formatTime(nextRuling.from)} – {formatTime(nextRuling.until)}
            </p>
          )}
        </Card>
      )}

      <section className="space-y-2">
        <h2 className="text-lg font-medium">{hi ? "पाँच अवस्थाएँ" : "The five states"}</h2>
        <p className="text-base text-muted">
          {hi
            ? "दिन सूर्योदय से सूर्यास्त तक पाँच बड़े जाम। रात सूर्यास्त से अगले सूर्योदय तक पाँच। हर जाम फिर पाँच छोटे टुकड़ों (अपहार) में बँटता है, करीब आधा घंटा प्रत्येक।"
            : "Day is five long blocks from sunrise to sunset. Night is five more till the next sunrise. Each block splits into five short slices, about half an hour each."}
        </p>
        <div className="grid gap-2">
          {(Object.keys(MEANING) as Act[]).map((act) => (
            <Card key={act} className="p-3">
              <p className={`text-base font-medium ${tone(act)}`}>
                {actName(act)} <span className="font-normal text-muted">({ACT_TA[act]})</span>
                <span className="ml-2 text-sm font-normal">{MEANING[act].good ? (hi ? "शुभ" : "use") : hi ? "सावधानी" : "careful"}</span>
              </p>
              <p className="mt-1 text-base">{hi ? MEANING[act].one : MEANING[act].oneEn}</p>
              <p className="text-base text-muted">{MEANING[act].do}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">{hi ? "आपको क्या करना है" : "What you need to do"}</h2>
        <div className="flex flex-wrap gap-2">
          {USES.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => setUse(u.id)}
              className={`rounded-full px-3 py-2 text-base ${use === u.id ? "bg-ink text-bg" : "bg-surface-2"}`}
            >
              {hi ? u.hi : u.en}
            </button>
          ))}
        </div>
        <p className="text-base">
          {use === "decide" && (hi ? "ये खिड़कियाँ राज की हैं। इंटरव्यू, मीटिंग, साइन, केस, डील यहीं रखें।" : "These are ruling windows. Put an interview, meeting, signature, case or deal here.")}
          {use === "take" && (hi ? "ये खिड़कियाँ भोजन की हैं। पैसा लें, खरीदें, ऑफर मानें।" : "These are eating windows. Take money, buy, accept an offer.")}
          {use === "move" && (hi ? "ये खिड़कियाँ चलने की हैं। यात्रा और कॉल चलें। बड़ा फैसला न रखें।" : "These are walking windows. Travel and call. Do not place a big decision.")}
          {use === "rest" && (hi ? "ये खिड़कियाँ सोना और मृत्यु की हैं। नया काम न शुरू करें।" : "These are sleeping and dying windows. Do not start anything new.")}
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {upcoming.map(({ a }, i) => (
            <Card key={i} className="p-3 text-base">
              <span className={tone(a.act)}>{actName(a.act)}</span>
              <span className="ml-2">
                {formatTime(a.from)} – {formatTime(a.until)}
              </span>
              <p className="text-sm text-muted">{MEANING[a.act].do}</p>
            </Card>
          ))}
          {upcoming.length === 0 && <p className="text-base text-muted">{hi ? "आज आगे ऐसी खिड़की नहीं बची।" : "No such window left today."}</p>}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">{hi ? "पूरा दिन, जाम दर जाम" : "The whole day, block by block"}</h2>
        <p className="text-base text-muted">
          {hi
            ? "किसी जाम को खोलें। बड़ा नाम पूरे जाम का मिजाज है। नीचे के पाँच टुकड़े छोटे काम के लिए हैं। जैसे रात का जाम सोना हो, तो भी अंदर भोजन या राज का आधा घंटा छोटे काम के लिए बच सकता है।"
            : "Open a block. The big name is the mood of the whole block. The five slices under it are for short tasks. A night block can be Sleeping and still hold a short Eating or Ruling slice."}
        </p>
        {day.pack.slots.map((s, i) => (
          <Card key={i} className="p-3">
            <button className="flex w-full items-start justify-between gap-3 text-left" onClick={() => setOpen(open === i ? null : i)}>
              <span className="text-base">
                {s.half === "Day" ? (hi ? "दिन" : "Day") : hi ? "रात" : "Night"} {hi ? "जाम" : "block"} {s.yama}
                <span className={`ml-2 font-medium ${tone(s.act)}`}>
                  {actName(s.act)} ({ACT_TA[s.act]})
                </span>
                <span className="mt-1 block text-sm text-muted">{MEANING[s.act].do}</span>
              </span>
              <span className="shrink-0 text-sm text-muted">
                {formatTime(s.from)} – {formatTime(s.until)}
              </span>
            </button>
            {open === i && (
              <ul className="mt-3 space-y-2">
                {s.apaharams.map((a) => (
                  <li key={a.index} className="text-base">
                    <div className="flex justify-between gap-2">
                      <span className={tone(a.act)}>
                        {hi ? "टुकड़ा" : "Slice"} {a.index}: {actName(a.act)}
                      </span>
                      <span className="text-sm text-muted">
                        {formatTime(a.from)} – {formatTime(a.until)} ({a.minutes} {hi ? "मि" : "min"})
                      </span>
                    </div>
                    <p className="text-sm text-muted">{MEANING[a.act].do}</p>
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
