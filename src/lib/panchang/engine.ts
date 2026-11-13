import {
  ascendantSidereal,
  moonLongitude,
  moonRiseSet,
  planetSidereal,
  sidereal,
  sunLongitude,
  sunRiseSet,
  toJulianDay,
  localToUtc,
} from "./astronomy";
import {
  AMRIT_SIDDHI,
  ASHUBH_YOGAS,
  FIXED_KARANAS,
  HORA_SEQUENCE,
  MOVABLE_KARANAS,
  NAKSHATRA_GROUPS,
  NAKSHATRA_GUNA,
  NAKSHATRA_LORDS,
  NAKSHATRAS,
  PURUSHARTHA_CYCLE,
  RASHI_TATVA,
  RASHIS,
  RIKTA_TITHIS,
  SARVARTHA_SIDDHI,
  SHUBH_TARAS,
  SHUBH_TITHIS,
  SHUBH_YOGAS,
  TARA_NAMES,
  TITHIS,
  WEEKDAY_LORDS,
  WEEKDAYS,
  YOGAS,
} from "./constants";
import { vimshottariAt, type DashaSlice } from "./dasha";

export type TaraResult = {
  number: number;
  name: string;
  isShubh: boolean;
  score: number;
  count: number;
};

export type ChandraResult = {
  distance: number;
  isShubh: boolean;
  score: number;
};

export type Panchang = {
  datetime: string;
  tithi: {
    number: number;
    name: string;
    paksha: "Shukla" | "Krishna";
    elapsedPct: number;
    isShubh: boolean;
    isRikta: boolean;
    purushartha: (typeof PURUSHARTHA_CYCLE)[number];
  };
  nakshatra: {
    index: number;
    name: string;
    pada: number;
    lord: string;
    group: string;
    guna: "sattva" | "rajas" | "tamas";
  };
  yoga: { number: number; name: string; isShubh: boolean; isAshubh: boolean };
  karana: { name: string; isVishti: boolean };
  vara: { name: string; lord: string };
  moonRashi: { index: number; name: string; tatva: "agni" | "prithvi" | "vayu" | "jala" };
  sunRashi: { index: number; name: string };
  moonSid: number;
  sunrise: string;
  sunset: string;
  rahuKaal: { start: string; end: string; isActive: boolean };
  abhijit: { start: string; end: string };
  horaLord: string;
  uphora: { half: 1 | 2; label: "Mukhya" | "Uphora" };
  horaWindow: { start: string; end: string; halfStart: string; halfEnd: string };
  kpSub: { lord: string; index: number; from: string; until: string };
  golden: { amritSiddhi: boolean; sarvarthaSiddhi: boolean };
};

function norm360(d: number) {
  const x = d % 360;
  return x < 0 ? x + 360 : x;
}

function karanaFromTithiDeg(tithiDeg: number) {
  const kNum = Math.min(59, Math.floor(tithiDeg / 6));
  let name: string;
  if (kNum === 0) name = "Kimstughna";
  else if (kNum >= 57) name = FIXED_KARANAS[kNum - 57] ?? "Naga";
  else name = MOVABLE_KARANAS[(kNum - 1) % 7];
  return { name, isVishti: name === "Vishti" };
}

function nakshatraFromLon(lon: number) {
  const span = 360 / 27;
  const index = Math.floor(norm360(lon) / span) % 27;
  const pada = Math.min(4, Math.floor((norm360(lon) % span) / (span / 4)) + 1);
  const name = NAKSHATRAS[index];
  let group = "mixed";
  for (const [g, names] of Object.entries(NAKSHATRA_GROUPS)) {
    if (names.includes(name)) group = g;
  }
  return {
    index,
    name,
    pada,
    lord: NAKSHATRA_LORDS[index % 9],
    group,
    guna: NAKSHATRA_GUNA[name] ?? "rajas",
  };
}

function rashiFromLon(lon: number) {
  const index = Math.floor(norm360(lon) / 30) % 12;
  return { index, name: RASHIS[index], tatva: RASHI_TATVA[index] };
}

export function calculateTaraBala(janmaIndex: number, currentIndex: number): TaraResult {
  const count = ((currentIndex - janmaIndex + 27) % 27) + 1;
  let remainder = count % 9;
  if (remainder === 0) remainder = 9;
  const isShubh = SHUBH_TARAS.has(remainder);
  let score = -18;
  if (remainder === 2 || remainder === 9) score = 25;
  else if (remainder === 4 || remainder === 6 || remainder === 8) score = 18;
  else if (remainder === 1) score = 5;
  return {
    number: remainder,
    name: TARA_NAMES[remainder],
    isShubh,
    score,
    count,
  };
}

export function calculateChandraBala(
  janmaRashi: number,
  currentRashi: number,
): ChandraResult {
  const distance = ((currentRashi - janmaRashi + 12) % 12) + 1;
  const isShubh = ![4, 8, 12].includes(distance);
  return { distance, isShubh, score: isShubh ? 15 : -15 };
}

function rahuKaal(dt: Date, sunrise: Date, sunset: Date) {
  const dayMs = sunset.getTime() - sunrise.getTime();
  const segment = dayMs / 8;
  const mapping: Record<number, number> = {
    0: 7,
    1: 1,
    2: 6,
    3: 4,
    4: 5,
    5: 3,
    6: 2,
  };
  const idx = mapping[dt.getDay()] ?? 4;
  const start = new Date(sunrise.getTime() + idx * segment);
  const end = new Date(start.getTime() + segment);
  return {
    start: start.toISOString(),
    end: end.toISOString(),
    isActive: dt >= start && dt <= end,
  };
}

function horaAt(dt: Date, sunrise: Date): { lord: string; hours: number } {
  const weekday = WEEKDAYS[dt.getDay()];
  const seq = HORA_SEQUENCE[weekday];
  let hours = (dt.getTime() - sunrise.getTime()) / 3600000;
  if (hours < 0) hours += 24;
  const i = Math.floor(hours) % 24;
  return { lord: seq[i % 7], hours };
}

export function getPanchang(
  local: Date,
  lat: number,
  lon: number,
  tzOffset: number,
): Panchang {
  const utc = localToUtc(local, tzOffset);
  const jd = toJulianDay(utc);
  const moonTrop = moonLongitude(jd);
  const sunTrop = sunLongitude(jd);
  const moonSid = sidereal(moonTrop, jd);
  const sunSid = sidereal(sunTrop, jd);

  const tithiDeg = norm360(moonTrop - sunTrop);
  let tithiNum = Math.floor(tithiDeg / 12) + 1;
  if (tithiNum > 30) tithiNum = 30;
  const tithiName = TITHIS[tithiNum - 1];
  const paksha: "Shukla" | "Krishna" = tithiNum <= 15 ? "Shukla" : "Krishna";

  const nak = nakshatraFromLon(moonSid);
  const yogaDeg = norm360(sunSid + moonSid);
  const yogaNum = Math.floor(yogaDeg / (360 / 27)) % 27;
  const yogaName = YOGAS[yogaNum];
  const karana = karanaFromTithiDeg(tithiDeg);

  const varaName = WEEKDAYS[local.getDay()];
  const { sunrise, sunset } = sunRiseSet(local, lat, lon, tzOffset);
  const mid = new Date((sunrise.getTime() + sunset.getTime()) / 2);
  const abhijitHalf = 24 * 60 * 1000;
  const hora = horaAt(local, sunrise);
  const frac = hora.hours - Math.floor(hora.hours);
  const half: 1 | 2 = frac < 0.5 ? 1 : 2;
  const horaIndex = Math.floor(hora.hours);
  const horaStart = new Date(sunrise.getTime() + horaIndex * 3600000);
  const horaEnd = new Date(horaStart.getTime() + 3600000);
  const halfStart = new Date(horaStart.getTime() + (half === 1 ? 0 : 30 * 60 * 1000));
  const halfEnd = new Date(halfStart.getTime() + 30 * 60 * 1000);
  const moonRashi = rashiFromLon(moonSid);

  return {
    datetime: local.toISOString(),
    tithi: {
      number: tithiNum,
      name: tithiName,
      paksha,
      elapsedPct: Math.round(((tithiDeg % 12) / 12) * 1000) / 10,
      isShubh: SHUBH_TITHIS.has(tithiNum),
      isRikta: RIKTA_TITHIS.has(tithiNum),
      purushartha: PURUSHARTHA_CYCLE[(tithiNum - 1) % 4],
    },
    nakshatra: nak,
    yoga: {
      number: yogaNum + 1,
      name: yogaName,
      isShubh: SHUBH_YOGAS.has(yogaName),
      isAshubh: ASHUBH_YOGAS.has(yogaName),
    },
    karana,
    vara: { name: varaName, lord: WEEKDAY_LORDS[varaName] },
    moonRashi,
    sunRashi: rashiFromLon(sunSid),
    moonSid,
    sunrise: sunrise.toISOString(),
    sunset: sunset.toISOString(),
    rahuKaal: rahuKaal(local, sunrise, sunset),
    abhijit: {
      start: new Date(mid.getTime() - abhijitHalf).toISOString(),
      end: new Date(mid.getTime() + abhijitHalf).toISOString(),
    },
    horaLord: hora.lord,
    uphora: { half, label: half === 1 ? "Mukhya" : "Uphora" },
    horaWindow: {
      start: horaStart.toISOString(),
      end: horaEnd.toISOString(),
      halfStart: halfStart.toISOString(),
      halfEnd: halfEnd.toISOString(),
    },
    kpSub: (() => {
      const subMs = 3600000 / 7;
      const elapsed = local.getTime() - horaStart.getTime();
      const idx = Math.min(6, Math.max(0, Math.floor(elapsed / subMs)));
      const subs = kpSubs(hora.lord);
      return {
        lord: subs[idx] ?? hora.lord,
        index: idx + 1,
        from: new Date(horaStart.getTime() + idx * subMs).toISOString(),
        until: new Date(horaStart.getTime() + (idx + 1) * subMs).toISOString(),
      };
    })(),
    golden: {
      amritSiddhi: AMRIT_SIDDHI[varaName] === nak.name,
      sarvarthaSiddhi: (SARVARTHA_SIDDHI[varaName] ?? []).includes(nak.name),
    },
  };
}

export type LimbPart = { name: string; from: string; until: string };

/** Limbs from this sunrise to the next. A tithi that ended before sunrise belongs to yesterday. */
export function dayLimbs(
  local: Date,
  lat: number,
  lon: number,
  tzOffset: number,
): { sunrise: string; nextSunrise: string; limbs: { limb: string; parts: LimbPart[] }[] } {
  const y = local.getFullYear();
  const m = local.getMonth();
  const d = local.getDate();
  const noon = new Date(y, m, d, 12, 0, 0);
  const rise = new Date(getPanchang(noon, lat, lon, tzOffset).sunrise);
  const nextNoon = new Date(y, m, d + 1, 12, 0, 0);
  const nextRise = new Date(getPanchang(nextNoon, lat, lon, tzOffset).sunrise);
  const startMs = rise.getTime();
  const spanMin = Math.max(1, Math.round((nextRise.getTime() - startMs) / 60000));
  const at = (min: number) => getPanchang(new Date(startMs + min * 60000), lat, lon, tzOffset);
  const stamp = (min: number) => new Date(startMs + min * 60000).toISOString();
  const spans = (pick: (p: Panchang) => string): LimbPart[] => {
    const parts: LimbPart[] = [];
    let cursor = 0;
    let name = pick(at(0));
    while (cursor < spanMin) {
      if (pick(at(spanMin - 1)) === name) {
        parts.push({ name, from: stamp(cursor), until: stamp(spanMin) });
        break;
      }
      let lo = cursor;
      let hi = spanMin;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (pick(at(mid)) === name) lo = mid;
        else hi = mid;
      }
      parts.push({ name, from: stamp(cursor), until: stamp(hi) });
      cursor = hi;
      name = pick(at(Math.min(hi, spanMin - 1)));
    }
    return parts;
  };
  return {
    sunrise: rise.toISOString(),
    nextSunrise: nextRise.toISOString(),
    limbs: [
      { limb: "Tithi", parts: spans((p) => `${p.tithi.name} · ${p.tithi.paksha}`) },
      { limb: "Nakshatra", parts: spans((p) => p.nakshatra.name) },
      { limb: "Yoga", parts: spans((p) => p.yoga.name) },
      { limb: "Karana", parts: spans((p) => p.karana.name) },
    ],
  };
}

export type HoraSub = { lord: string; from: string; until: string };
export type HoraSpan = { lord: string; from: string; half: string; until: string; subs: HoraSub[] };

const CHALDEAN = ["Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars"];

function kpSubs(horaLord: string): string[] {
  const i = CHALDEAN.indexOf(horaLord);
  if (i < 0) return [horaLord];
  return Array.from({ length: 7 }, (_, k) => CHALDEAN[(i + k) % 7]);
}

/** Twenty-four horas from this sunrise. Each hora is split into mukhya/uphora and 7 KP sub-parts. */
export function dayHoras(sunriseIso: string, nextSunriseIso: string, vara: string): HoraSpan[] {
  const seq = HORA_SEQUENCE[vara] ?? HORA_SEQUENCE.Sunday;
  const start = new Date(sunriseIso).getTime();
  const end = new Date(nextSunriseIso).getTime();
  const out: HoraSpan[] = [];
  for (let i = 0; i < 24; i++) {
    const from = start + i * 3600000;
    if (from >= end) break;
    const until = Math.min(from + 3600000, end);
    const lord = seq[i % 7];
    const duration = until - from;
    const subMs = duration / 7;
    const subs: HoraSub[] = kpSubs(lord).map((subLord, k) => ({
      lord: subLord,
      from: new Date(from + k * subMs).toISOString(),
      until: new Date(from + (k + 1) * subMs).toISOString(),
    }));
    out.push({
      lord,
      from: new Date(from).toISOString(),
      half: new Date(from + duration / 2).toISOString(),
      until: new Date(until).toISOString(),
      subs,
    });
  }
  return out;
}

/** Amanta month from the nakshatra of the nearest Purnima. */
const MONTH_BY_NAKSHATRA = [
  "Ashwina",
  "Ashwina",
  "Kartika",
  "Kartika",
  "Margashirsha",
  "Margashirsha",
  "Pausha",
  "Pausha",
  "Magha",
  "Magha",
  "Phalguna",
  "Phalguna",
  "Chaitra",
  "Chaitra",
  "Vaishakha",
  "Vaishakha",
  "Jyeshtha",
  "Jyeshtha",
  "Ashadha",
  "Ashadha",
  "Shravana",
  "Shravana",
  "Bhadrapada",
  "Bhadrapada",
  "Bhadrapada",
  "Ashwina",
  "Ashwina",
];

export type PlaceDay = {
  tithiDay: number;
  tithiName: string;
  paksha: "Shukla" | "Krishna";
  month: string;
  samvat: number;
  system: "Amanta";
  moonrise: string | null;
  moonset: string | null;
};

function vikramSamvat(local: Date): number {
  const month = local.getMonth();
  const day = local.getDate();
  const beforeChaitra = month < 3 || (month === 3 && day < 14);
  return local.getFullYear() + (beforeChaitra ? 56 : 57);
}

/** Sunrise identity, lunar month, and moonrise for this city. */
export function placeDay(local: Date, lat: number, lon: number, tzOffset: number): PlaceDay {
  const y = local.getFullYear();
  const m = local.getMonth();
  const d = local.getDate();
  const noon = new Date(y, m, d, 12, 0, 0);
  const day = getPanchang(noon, lat, lon, tzOffset);
  const rise = new Date(day.sunrise);
  const atSunrise = getPanchang(rise, lat, lon, tzOffset);
  const dir = atSunrise.tithi.number <= 15 ? 1 : -1;
  let nakIndex = atSunrise.nakshatra.index;
  if (atSunrise.tithi.number !== 15) {
    for (let step = 1; step <= 24 * 16; step++) {
      const probe = new Date(rise.getTime() + dir * step * 3600 * 1000);
      const q = getPanchang(probe, lat, lon, tzOffset);
      if (q.tithi.number === 15) {
        nakIndex = q.nakshatra.index;
        break;
      }
    }
  }
  const moon = moonRiseSet(noon, lat, lon, tzOffset);
  const setAtDawn =
    moon.moonset != null && moon.moonset.getTime() <= rise.getTime() + 10 * 60 * 1000;
  const tithiDay =
    atSunrise.tithi.number <= 15 ? atSunrise.tithi.number : atSunrise.tithi.number - 15;
  return {
    tithiDay,
    tithiName: atSunrise.tithi.name,
    paksha: atSunrise.tithi.paksha,
    month: MONTH_BY_NAKSHATRA[nakIndex] ?? "Ashwina",
    samvat: vikramSamvat(noon),
    system: "Amanta",
    moonrise: moon.moonrise ? moon.moonrise.toISOString() : null,
    moonset: moon.moonset && !setAtDawn ? moon.moonset.toISOString() : null,
  };
}

export type NatalGraha = {
  name: string;
  lon: number;
  rashi: string;
  rashiIndex: number;
  nakshatra: string;
  pada: number;
  nakshatraLord: string;
  houseFromLagna: number;
  houseFromMoon: number;
  digbal: boolean;
};

export type BirthChart = {
  janmaNakshatra: Panchang["nakshatra"];
  janmaRashi: Panchang["moonRashi"];
  sunRashi: Panchang["sunRashi"];
  moonSid: number;
  lagna: string;
  lagnaIndex: number;
  grahas: NatalGraha[];
  birth: Date;
};

const DIGBAL_HOUSE: Record<string, number> = {
  Jupiter: 1,
  Mercury: 1,
  Moon: 4,
  Venus: 4,
  Saturn: 7,
  Sun: 10,
  Mars: 10,
};

export function getBirthChart(
  dobLocal: Date,
  lat: number,
  lon: number,
  tzOffset: number,
): BirthChart {
  const p = getPanchang(dobLocal, lat, lon, tzOffset);
  const lagnaLon = ascendantSidereal(dobLocal, lat, lon, tzOffset);
  const lagnaIndex = Math.floor(norm360(lagnaLon) / 30) % 12;
  const moonIndex = p.moonRashi.index;
  const jd = toJulianDay(localToUtc(dobLocal, tzOffset));
  const bodies: Array<[string, number]> = [
    ["Sun", sidereal(sunLongitude(jd), jd)],
    ["Moon", p.moonSid],
    ["Mars", planetSidereal("Mars", jd)],
    ["Mercury", planetSidereal("Mercury", jd)],
    ["Jupiter", planetSidereal("Jupiter", jd)],
    ["Venus", planetSidereal("Venus", jd)],
    ["Saturn", planetSidereal("Saturn", jd)],
  ];
  const grahas: NatalGraha[] = bodies.map(([name, lon]) => {
    const nk = nakshatraFromLon(lon);
    const rashiIndex = Math.floor(norm360(lon) / 30) % 12;
    const houseFromLagna = ((rashiIndex - lagnaIndex + 12) % 12) + 1;
    const houseFromMoon = ((rashiIndex - moonIndex + 12) % 12) + 1;
    return {
      name,
      lon,
      rashi: RASHIS[rashiIndex],
      rashiIndex,
      nakshatra: nk.name,
      pada: nk.pada,
      nakshatraLord: nk.lord,
      houseFromLagna,
      houseFromMoon,
      digbal: DIGBAL_HOUSE[name] === houseFromLagna,
    };
  });
  return {
    janmaNakshatra: p.nakshatra,
    janmaRashi: p.moonRashi,
    sunRashi: p.sunRashi,
    moonSid: p.moonSid,
    lagna: RASHIS[lagnaIndex],
    lagnaIndex,
    grahas,
    birth: dobLocal,
  };
}

export function dashaFor(chart: BirthChart, at: Date): DashaSlice {
  return vimshottariAt(chart.birth, chart.moonSid, at);
}
