import { ascendantSidereal } from "./astronomy";
import { RASHIS, YOGA_FRUIT, ASHUBH_YOGAS } from "./constants";
import type { BirthChart, Panchang } from "./engine";

/** 4 ghatis of tyajya, counted from the start of each nakshatra. */
const VARJYA_GHATI = [
  50, 4, 22, 40, 16, 20, 28, 20, 32, 30, 20, 32, 22, 20, 14, 14, 10, 14, 20, 24, 20, 10, 10,
  18, 16, 24, 30,
];

const YAMAGANDA = [5, 4, 3, 2, 1, 7, 6];
const GULIKA = [7, 6, 5, 4, 3, 2, 1];
const RAHU_PART = [8, 2, 7, 5, 6, 4, 3];
const DAGDHA = [12, 11, 5, 3, 6, 8, 9];
const VISHA = [4, 6, 7, 2, 8, 9, 7];
// Tithi-vara mrityu yoga (Muhurta Chintamani): same pairs as dagdha, named separately.
const MRITYU = [12, 11, 5, 3, 6, 8, 9];

const LUNAR_MONTHS = [
  "Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada",
  "Ashwina", "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna",
];
// Shunya (empty) by Amanta month index 0=Chaitra. From Muhurta Chintamani practice.
const SHUNYA_TITHI = [1, 10, 4, 6, 8, 12, 2, 11, 5, 7, 9, 3];
const SHUNYA_NAKSHATRA = [
  "Bharani", "Rohini", "Ardra", "Pushya", "Magha", "Hasta",
  "Swati", "Anuradha", "Mula", "Shravana", "Dhanishta", "Purva Bhadrapada",
];
const SHUNYA_RASHI = [
  "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya",
  "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena",
];

function nandaadi(tithi15: number): "Nanda" | "Bhadra" | "Jaya" | "Rikta" | "Purna" {
  const m = ((tithi15 - 1) % 5) + 1;
  return (["Nanda", "Bhadra", "Jaya", "Rikta", "Purna"] as const)[m - 1];
}

function lunarMonthIndex(nakIndex: number): number {
  // Rough Amanta month from Moon nakshatra (Purnima star maps to month).
  return Math.floor((((nakIndex + 14) % 27) * 12) / 27) % 12;
}
const CHOGHADIYA = ["Amrit", "Kaal", "Shubh", "Rog", "Labh", "Udveg", "Char"] as const;
const CHOGHADIYA_START = [5, 0, 3, 4, 2, 6, 1];
const BAD_CHOGHADIYA = new Set(["Rog", "Kaal", "Udveg"]);

/** Daytime choghadiya. Night returns null; the day cycle is the one used as a gate. */
export function choghadiyaAt(sunriseIso: string, sunsetIso: string, local: Date): { name: string; good: boolean } | null {
  const sunrise = new Date(sunriseIso);
  const sunset = new Date(sunsetIso);
  if (!(local >= sunrise && local < sunset)) return null;
  const seg = (sunset.getTime() - sunrise.getTime()) / 8;
  const part = Math.min(7, Math.floor((local.getTime() - sunrise.getTime()) / seg));
  const name = CHOGHADIYA[(CHOGHADIYA_START[local.getDay()] + part) % 7];
  return { name, good: !BAD_CHOGHADIYA.has(name) };
}

export type SutraReading = {
  blocks: string[];
  cautions: string[];
  supports: string[];
  lagna: string;
};

function eighth(sunrise: Date, sunset: Date, part: number, at: Date) {
  const seg = (sunset.getTime() - sunrise.getTime()) / 8;
  const start = sunrise.getTime() + (part - 1) * seg;
  const end = start + seg;
  return at.getTime() >= start && at.getTime() < end;
}

export function dayMarks(sunriseIso: string, sunsetIso: string, weekday: number) {
  const sunrise = new Date(sunriseIso);
  const sunset = new Date(sunsetIso);
  const seg = (sunset.getTime() - sunrise.getTime()) / 8;
  const slice = (part: number) => ({
    from: new Date(sunrise.getTime() + (part - 1) * seg).toISOString(),
    until: new Date(sunrise.getTime() + part * seg).toISOString(),
  });
  return {
    rahu: slice(RAHU_PART[weekday] ?? 8),
    yamaganda: slice(YAMAGANDA[weekday] ?? 5),
    gulika: slice(GULIKA[weekday] ?? 7),
  };
}

function houseFrom(fromSign: number, toSign: number) {
  return ((toSign - fromSign + 12) % 12) + 1;
}

function inGandanta(lon: number) {
  const x = ((lon % 360) + 360) % 360;
  const edges = [0, 120, 240];
  return edges.some((e) => {
    const d = Math.min(Math.abs(x - e), 360 - Math.abs(x - e));
    return d <= 3.333;
  });
}

export function readSutras(
  p: Panchang,
  local: Date,
  lat: number,
  lon: number,
  tz: number,
  chart: BirthChart,
): SutraReading {
  const blocks: string[] = [];
  const cautions: string[] = [];
  const supports: string[] = [];
  const sunrise = new Date(p.sunrise);
  const sunset = new Date(p.sunset);
  const day = local.getDay();
  const tithi15 = ((p.tithi.number - 1) % 15) + 1;

  if (p.rahuKaal.isActive) blocks.push("Rahu Kaal");
  if (local >= sunrise && local < sunset) {
    if (eighth(sunrise, sunset, YAMAGANDA[day], local)) blocks.push("Yamaganda");
    if (eighth(sunrise, sunset, GULIKA[day], local)) blocks.push("Mandi (Gulika)");
    const seg = (sunset.getTime() - sunrise.getTime()) / 8;
    const part = Math.min(7, Math.floor((local.getTime() - sunrise.getTime()) / seg));
    const choghadiya = CHOGHADIYA[(CHOGHADIYA_START[day] + part) % 7];
    if (BAD_CHOGHADIYA.has(choghadiya)) cautions.push(`${choghadiya} choghadiya`);
  }
  if (p.karana.isVishti) {
    const half = p.tithi.elapsedPct < 50 ? "mukha" : "puccha";
    blocks.push(`Bhadra ${half} (Vishti)`);
  }
  if (ASHUBH_YOGAS.has(p.yoga.name)) {
    blocks.push(`${p.yoga.name} yoga — ${YOGA_FRUIT[p.yoga.name]}`);
  }
  if (tithi15 === DAGDHA[day]) blocks.push(`Dagdha tithi (${p.tithi.name} on ${p.vara.name})`);
  if (tithi15 === VISHA[day]) blocks.push(`Visha tithi (${p.tithi.name} on ${p.vara.name})`);
  if (tithi15 === MRITYU[day]) blocks.push(`Mrityu yoga (${p.tithi.name} on ${p.vara.name})`);

  const group = nandaadi(tithi15);
  const shukla = p.tithi.paksha === "Shukla";
  if (shukla && (group === "Nanda" || group === "Bhadra")) {
    cautions.push(`Nandaadi: ${group} is weak in Shukla`);
  } else if (!shukla && (group === "Rikta" || group === "Purna")) {
    cautions.push(`Nandaadi: ${group} is weak in Krishna`);
  } else if ((shukla && (group === "Rikta" || group === "Purna")) || (!shukla && (group === "Nanda" || group === "Bhadra"))) {
    supports.push(`Nandaadi: ${group} is strong in ${p.tithi.paksha}`);
  }

  const mi = lunarMonthIndex(p.nakshatra.index);
  const month = LUNAR_MONTHS[mi];
  if (tithi15 === SHUNYA_TITHI[mi]) cautions.push(`Shunya tithi ${p.tithi.name} in ${month}`);
  if (p.nakshatra.name === SHUNYA_NAKSHATRA[mi]) cautions.push(`Shunya nakshatra ${p.nakshatra.name} in ${month}`);
  if (p.moonRashi.name === SHUNYA_RASHI[mi]) cautions.push(`Shunya rashi ${p.moonRashi.name} in ${month}`);

  const span = 360 / 27;
  const into = (((p.moonSid % span) + span) % span) / span;
  const ghati = into * 60;
  const start = VARJYA_GHATI[p.nakshatra.index] ?? 0;
  const end = start + 4;
  const varjya = end <= 60 ? ghati >= start && ghati < end : ghati >= start || ghati < end - 60;
  if (varjya) blocks.push(`Varjyam in ${p.nakshatra.name}`);

  if (inGandanta(p.moonSid)) blocks.push("Gandanta Moon");

  const panchak = p.moonSid >= 300 || p.nakshatra.name === "Revati";
  if (panchak) cautions.push("Panchak");

  const lagnaLon = ascendantSidereal(local, lat, lon, tz);
  const lagnaSign = Math.floor(lagnaLon / 30) % 12;
  const birthLagna = Math.floor(ascendantSidereal(chart.birth, lat, lon, tz) / 30) % 12;
  const fromLagna = houseFrom(birthLagna, lagnaSign);
  const fromMoon = houseFrom(chart.janmaRashi.index, lagnaSign);
  if (fromLagna === 8 || fromMoon === 8) blocks.push("Lagna in the 8th");
  if (inGandanta(lagnaLon)) blocks.push("Gandanta lagna");
  const lagna = RASHIS[lagnaSign];
  if ([1, 4, 5, 7, 9, 10].includes(fromLagna) && fromLagna !== 8) {
    supports.push(`Lagna ${lagna} is ${fromLagna} from birth lagna`);
  }

  const abStart = new Date(p.abhijit.start);
  const abEnd = new Date(p.abhijit.end);
  if (local >= abStart && local < abEnd && !p.rahuKaal.isActive) supports.push("Abhijit");
  if (p.tithi.isShubh && tithi15 !== DAGDHA[day] && tithi15 !== VISHA[day]) {
    supports.push(`Shubh tithi ${p.tithi.name}`);
  }
  if (p.yoga.isShubh) supports.push(`${p.yoga.name} yoga — ${YOGA_FRUIT[p.yoga.name]}`);
  if (!p.karana.isVishti && !["Shakuni", "Chatushpada", "Naga"].includes(p.karana.name)) {
    supports.push(`${p.karana.name} karana`);
  }
  if (p.golden.amritSiddhi) supports.push("Amrit Siddhi");
  if (p.golden.sarvarthaSiddhi) supports.push("Sarvartha Siddhi");

  return { blocks, cautions, supports, lagna };
}
