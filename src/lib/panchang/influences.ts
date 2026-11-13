import { planetSidereal, sidereal, sunLongitude, toJulianDay, localToUtc } from "./astronomy";

export const BIRDS = ["Vulture", "Owl", "Crow", "Cock", "Peacock"] as const;
export type Bird = (typeof BIRDS)[number];
export const BIRD_ACTS = ["Ruling", "Eating", "Walking", "Sleeping", "Dying"] as const;
export type BirdAct = (typeof BIRD_ACTS)[number];

const FRIENDS: Record<Bird, Bird[]> = {
  Vulture: ["Peacock", "Owl"],
  Owl: ["Vulture", "Crow"],
  Crow: ["Cock", "Owl"],
  Cock: ["Owl", "Peacock"],
  Peacock: ["Vulture", "Cock"],
};

/** Nakshatra index 0–26. Shukla and Krishna swap the ends; the middle crow group stays. */
export function birthBird(nakshatraIndex: number, shukla: boolean): Bird {
  const i = ((nakshatraIndex % 27) + 27) % 27;
  const shuklaBands: [number, Bird][] = [
    [5, "Vulture"],
    [11, "Owl"],
    [16, "Crow"],
    [21, "Cock"],
    [27, "Peacock"],
  ];
  const krishnaBands: [number, Bird][] = [
    [5, "Peacock"],
    [11, "Cock"],
    [16, "Crow"],
    [21, "Owl"],
    [27, "Vulture"],
  ];
  const bands = shukla ? shuklaBands : krishnaBands;
  return bands.find(([end]) => i < end)?.[1] ?? "Crow";
}

const WEEK_START: Record<number, number> = {
  0: 0,
  1: 1,
  2: 0,
  3: 1,
  4: 2,
  5: 3,
  6: 4,
};

export type PakshiReading = {
  bird: Bird;
  activity: BirdAct;
  yama: number;
  dayHalf: "Day" | "Night";
  friends: Bird[];
  score: number;
};

/**
 * Day and night are each five equal parts.
 * Shukla: Sunday/Tuesday open on the Vulture ruling, then the birds step forward.
 * Krishna: the same weekday opens on the far bird and steps backward.
 * The native's bird does one act in each part: Ruling, Eating, Walking, Sleeping, Dying.
 */
export function panchpakshiAt(
  local: Date,
  sunrise: Date,
  sunset: Date,
  janmaNakshatra: number,
  birthShukla: boolean,
  nowShukla: boolean,
): PakshiReading {
  const bird = birthBird(janmaNakshatra, birthShukla);
  const birdIndex = BIRDS.indexOf(bird);
  let start = WEEK_START[local.getDay()] ?? 0;
  let dir = 1;
  if (!nowShukla) {
    start = (start + 4) % 5;
    dir = -1;
  }
  const day = local >= sunrise && local < sunset;
  if (!day) start = (start + 2 * dir + 50) % 5;
  const early = local < sunrise;
  const from = day ? sunrise : early ? new Date(sunset.getTime() - 24 * 3600000) : sunset;
  const to = day ? sunset : early ? sunrise : new Date(sunrise.getTime() + 24 * 3600000);
  const span = Math.max(1, to.getTime() - from.getTime());
  let yama = Math.floor(((local.getTime() - from.getTime()) / span) * 5);
  if (yama < 0) yama = 0;
  if (yama > 4) yama = 4;
  const rel = (birdIndex - start + 50) % 5;
  const actIndex = (dir === 1 ? rel + yama : rel - yama + 50) % 5;
  const activity = BIRD_ACTS[actIndex];
  const score =
    activity === "Ruling" ? 100 : activity === "Eating" ? 82 : activity === "Walking" ? 58 : activity === "Sleeping" ? 32 : 12;
  return { bird, activity, yama: yama + 1, dayHalf: day ? "Day" : "Night", friends: FRIENDS[bird], score };
}

const GOCHAR_HOUSES: Record<string, number[]> = {
  Sun: [3, 6, 10, 11],
  Mars: [3, 6, 11],
  Mercury: [2, 4, 6, 8, 10, 11],
  Jupiter: [2, 5, 7, 9, 11],
  Venus: [1, 2, 3, 4, 5, 7, 8, 9, 11, 12],
  Saturn: [3, 6, 11],
};
const GOCHAR_WEIGHT: Record<string, number> = {
  Jupiter: 3,
  Saturn: 3,
  Venus: 2,
  Mars: 2,
  Sun: 1,
  Mercury: 1,
};

export type GocharHit = { planet: string; house: number; good: boolean };
export type GocharReading = { hits: GocharHit[]; sadeSati: boolean; score: number };

export function gocharAt(local: Date, tz: number, natalMoonRashi: number): GocharReading {
  const jd = toJulianDay(localToUtc(local, tz));
  const sunSign = Math.floor(sidereal(sunLongitude(jd), jd) / 30) % 12;
  const hits: GocharHit[] = [];
  const add = (planet: string, sign: number) => {
    const house = ((sign - natalMoonRashi + 12) % 12) + 1;
    hits.push({ planet, house, good: GOCHAR_HOUSES[planet].includes(house) });
  };
  add("Sun", sunSign);
  for (const name of ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"]) {
    add(name, Math.floor(planetSidereal(name, jd) / 30) % 12);
  }
  let goodW = 0;
  let total = 0;
  for (const hit of hits) {
    const w = GOCHAR_WEIGHT[hit.planet];
    total += w;
    if (hit.good) goodW += w;
  }
  let score = Math.round(30 + 70 * (goodW / total));
  const saturn = hits.find((h) => h.planet === "Saturn");
  const sadeSati = !!saturn && [12, 1, 2].includes(saturn.house);
  if (sadeSati) score = Math.max(0, score - 15);
  return { hits, sadeSati, score };
}
