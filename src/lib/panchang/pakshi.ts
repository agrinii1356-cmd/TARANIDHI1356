/**
 * Tamil Panchapakshi (பஞ்சபட்சி சாஸ்திரம்).
 * Birth bird from janma nakshatra and birth paksha.
 * Day and night each split into 5 yamas from local sunrise and sunset.
 * Each yama splits into 5 apaharams. Ruling and Eating also list 15-minute windows.
 * Sunday/Tuesday activity order follows the Tamil Wikipedia matrix.
 * Other weekdays rotate that order. Sources differ on the rotation.
 */

export const BIRDS = ["Vulture", "Owl", "Crow", "Cock", "Peacock"] as const;
export type Bird = (typeof BIRDS)[number];

export const ACTS = ["Eating", "Walking", "Ruling", "Sleeping", "Dying"] as const;
export type Act = (typeof ACTS)[number];

export const BIRD_TA: Record<Bird, string> = {
  Vulture: "வல்லூறு",
  Owl: "ஆந்தை",
  Crow: "காகம்",
  Cock: "கோழி",
  Peacock: "மயில்",
};

export const ACT_TA: Record<Act, string> = {
  Eating: "ஊண்",
  Walking: "நடை",
  Ruling: "அரசு",
  Sleeping: "துயில்",
  Dying: "சாவு",
};

/** Shukla: 1-5 Vulture, 6-11 Owl, 12-16 Crow, 17-21 Cock, 22-27 Peacock. Krishna reverses the ends. */
export function tamilBirthBird(nakshatraIndex: number, birthShukla: boolean): Bird {
  const i = ((nakshatraIndex % 27) + 27) % 27;
  if (birthShukla) {
    if (i < 5) return "Vulture";
    if (i < 11) return "Owl";
    if (i < 16) return "Crow";
    if (i < 21) return "Cock";
    return "Peacock";
  }
  if (i < 5) return "Peacock";
  if (i < 11) return "Cock";
  if (i < 16) return "Crow";
  if (i < 21) return "Owl";
  return "Vulture";
}

/** Sunday/Tuesday day order from Tamil Wikipedia. Night is a separate cycle. */
const SUN_TUE_DAY: Record<Bird, Act[]> = {
  Vulture: ["Eating", "Walking", "Ruling", "Sleeping", "Dying"],
  Owl: ["Walking", "Ruling", "Sleeping", "Dying", "Eating"],
  Crow: ["Ruling", "Sleeping", "Dying", "Eating", "Walking"],
  Cock: ["Sleeping", "Dying", "Eating", "Walking", "Ruling"],
  Peacock: ["Dying", "Eating", "Walking", "Ruling", "Sleeping"],
};

const SUN_TUE_NIGHT: Record<Bird, Act[]> = {
  Vulture: ["Dying", "Walking", "Sleeping", "Eating", "Ruling"],
  Owl: ["Ruling", "Dying", "Walking", "Sleeping", "Eating"],
  Crow: ["Eating", "Ruling", "Dying", "Walking", "Sleeping"],
  Cock: ["Sleeping", "Eating", "Ruling", "Dying", "Walking"],
  Peacock: ["Walking", "Sleeping", "Eating", "Ruling", "Dying"],
};

function rotate(order: Act[], by: number): Act[] {
  const n = ((by % 5) + 5) % 5;
  return order.slice(n).concat(order.slice(0, n));
}

/** Weekday groups used in Tamil tables. 0 Sunday. */
function weekdayShift(day: number): number {
  if (day === 0 || day === 2) return 0;
  if (day === 1 || day === 3) return 1;
  if (day === 4) return 2;
  if (day === 5) return 3;
  return 4;
}

export function yamaOrder(bird: Bird, weekday: number, night: boolean): Act[] {
  const base = night ? SUN_TUE_NIGHT[bird] : SUN_TUE_DAY[bird];
  return rotate(base, weekdayShift(weekday));
}

export type Apaharam = {
  index: number;
  act: Act;
  from: string;
  until: string;
  minutes: number;
  auspicious: boolean;
};

export type YamaSlot = {
  yama: number;
  half: "Day" | "Night";
  act: Act;
  from: string;
  until: string;
  apaharams: Apaharam[];
  windows15: { from: string; until: string }[];
};

export type PakshiDay = {
  bird: Bird;
  birdTa: string;
  slots: YamaSlot[];
  goodWindows: { from: string; until: string; act: Act; kind: "yama" | "15min" }[];
};

function iso(d: Date) {
  return d.toISOString();
}

function slice(from: Date, until: Date, parts: number): { from: Date; until: Date }[] {
  const span = until.getTime() - from.getTime();
  const step = span / parts;
  return Array.from({ length: parts }, (_, i) => ({
    from: new Date(from.getTime() + i * step),
    until: new Date(from.getTime() + (i + 1) * step),
  }));
}

function windowsOf15(from: Date, until: Date): { from: string; until: string }[] {
  const out: { from: string; until: string }[] = [];
  let t = from.getTime();
  const end = until.getTime();
  while (t + 15 * 60000 <= end + 1000) {
    const next = Math.min(t + 15 * 60000, end);
    if (next - t >= 10 * 60000) out.push({ from: iso(new Date(t)), until: iso(new Date(next)) });
    t = next;
    if (t >= end) break;
  }
  return out;
}

export function tamilPakshiDay(
  sunrise: Date,
  sunset: Date,
  nextSunrise: Date,
  janmaNakshatra: number,
  birthShukla: boolean,
  weekday: number,
): PakshiDay {
  const bird = tamilBirthBird(janmaNakshatra, birthShukla);
  const dayOrder = yamaOrder(bird, weekday, false);
  const nightOrder = yamaOrder(bird, weekday, true);
  const dayParts = slice(sunrise, sunset, 5);
  const nightParts = slice(sunset, nextSunrise, 5);
  const slots: YamaSlot[] = [];

  const push = (half: "Day" | "Night", i: number, act: Act, from: Date, until: Date) => {
    const subs = slice(from, until, 5).map((s, k) => {
      const subAct = ACTS[(ACTS.indexOf(act) + k) % 5];
      const minutes = Math.round((s.until.getTime() - s.from.getTime()) / 60000);
      return {
        index: k + 1,
        act: subAct,
        from: iso(s.from),
        until: iso(s.until),
        minutes,
        auspicious: subAct === "Ruling" || subAct === "Eating",
      };
    });
    const good = act === "Ruling" || act === "Eating";
    slots.push({
      yama: i + 1,
      half,
      act,
      from: iso(from),
      until: iso(until),
      apaharams: subs,
      windows15: good ? windowsOf15(from, until) : [],
    });
  };

  dayParts.forEach((p, i) => push("Day", i, dayOrder[i], p.from, p.until));
  nightParts.forEach((p, i) => push("Night", i, nightOrder[i], p.from, p.until));

  const goodWindows = slots.flatMap((s) => {
    const out: PakshiDay["goodWindows"] = [];
    if (s.act === "Ruling" || s.act === "Eating") {
      out.push({ from: s.from, until: s.until, act: s.act, kind: "yama" });
      s.windows15.forEach((w) => out.push({ ...w, act: s.act, kind: "15min" }));
    }
    return out;
  });

  return { bird, birdTa: BIRD_TA[bird], slots, goodWindows };
}
