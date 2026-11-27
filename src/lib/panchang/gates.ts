/**
 * Pending classical gates.
 * Kshaya / vriddhi from sunrise tithi.
 * Guru and Shukra asta by angular orb.
 * Suryabala from natal Sun and weekday.
 * D9 lagna gate for major rites.
 * Abhujh: Akshaya Tritiya and Vijayadashami only.
 */
import { planetSidereal, sunLongitude, sidereal, toJulianDay, localToUtc, ascendantSidereal } from "./astronomy";
import { getPanchang, type BirthChart, type Panchang } from "./engine";
import { RASHIS } from "./constants";

export type ExtraGates = {
  blocks: string[];
  cautions: string[];
  supports: string[];
  surya: number;
  notes: string[];
};

const spanCache = new Map<string, { kshaya: number[]; vriddhi: boolean; udaya: number }>();

function tithiAt(local: Date, lat: number, lon: number, tz: number): number {
  return getPanchang(local, lat, lon, tz).tithi.number;
}

/** Kshaya: a tithi that rules no sunrise. Vriddhi: one tithi rules two sunrises. */
export function tithiSpan(
  sunrise: Date,
  lat: number,
  lon: number,
  tz: number,
): { kshaya: number[]; vriddhi: boolean; udaya: number } {
  const key = `${sunrise.toISOString()}|${lat}|${lon}`;
  const hit = spanCache.get(key);
  if (hit) return hit;
  const next = new Date(sunrise.getTime() + 24 * 3600000);
  const prev = new Date(sunrise.getTime() - 24 * 3600000);
  const udaya = tithiAt(sunrise, lat, lon, tz);
  const nextUdaya = tithiAt(next, lat, lon, tz);
  const prevUdaya = tithiAt(prev, lat, lon, tz);
  const vriddhi = udaya === nextUdaya;
  const seen = new Set<number>();
  for (let h = 1; h < 24; h++) {
    seen.add(tithiAt(new Date(sunrise.getTime() + h * 3600000), lat, lon, tz));
  }
  const kshaya = [...seen].filter((t) => t !== udaya && t !== nextUdaya && t !== prevUdaya);
  const out = { kshaya, vriddhi, udaya };
  spanCache.set(key, out);
  return out;
}

function angle(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return Math.min(d, 360 - d);
}

export function combustion(local: Date, tz: number): { venus: boolean; jupiter: boolean; venusDeg: number; jupiterDeg: number } {
  const jd = toJulianDay(localToUtc(local, tz));
  const sun = sidereal(sunLongitude(jd), jd);
  const venus = planetSidereal("Venus", jd);
  const jupiter = planetSidereal("Jupiter", jd);
  const venusDeg = angle(venus, sun);
  const jupiterDeg = angle(jupiter, sun);
  return {
    venus: venusDeg <= 10,
    jupiter: jupiterDeg <= 11,
    venusDeg: Math.round(venusDeg * 10) / 10,
    jupiterDeg: Math.round(jupiterDeg * 10) / 10,
  };
}

/** Asta uses the Surya Siddhanta orb. The five degrees outside it are the near-asta band: closing is vriddhatva, opening is shishutva. */
export function guruShukraBand(local: Date, tz: number): string[] {
  const now = combustion(local, tz);
  const next = combustion(new Date(local.getTime() + 24 * 3600000), tz);
  const out: string[] = [];
  const one = (name: string, deg: number, later: number, orb: number, asta: boolean) => {
    if (asta) out.push(`${name} asta`);
    else if (deg <= orb + 5 && later < deg) out.push(`${name} vriddhatva`);
    else if (deg <= orb + 5) out.push(`${name} shishutva`);
  };
  one("Shukra", now.venusDeg, next.venusDeg, 10, now.venus);
  one("Guru", now.jupiterDeg, next.jupiterDeg, 11, now.jupiter);
  return out;
}

const adhikCache = new Map<string, boolean>();

/** Adhik masa: the Sun stays in one rashi from one Amavasya to the next. */
export function adhikMasa(local: Date, lat: number, lon: number, tz: number): boolean {
  const key = `${local.getFullYear()}-${local.getMonth()}-${local.getDate()}|${lat.toFixed(2)}|${lon.toFixed(2)}`;
  const hit = adhikCache.get(key);
  if (hit !== undefined) return hit;
  const marks: { at: number; sun: number }[] = [];
  let prevNum = -1;
  for (let d = -32; d <= 32; d++) {
    const day = new Date(local.getFullYear(), local.getMonth(), local.getDate() + d, 12, 0, 0);
    const p = getPanchang(day, lat, lon, tz);
    if (p.tithi.number === 30 && prevNum !== 30) marks.push({ at: day.getTime(), sun: p.sunRashi.index });
    prevNum = p.tithi.number;
  }
  const noon = new Date(local.getFullYear(), local.getMonth(), local.getDate(), 12, 0, 0).getTime();
  let before: { sun: number } | null = null;
  let after: { sun: number } | null = null;
  for (const m of marks) {
    if (m.at <= noon) before = m;
    else if (!after) after = m;
  }
  const flag = !!before && !!after && before.sun === after.sun;
  adhikCache.set(key, flag);
  return flag;
}

const VEDHA: Record<string, string> = {
  Ashwini: "Jyeshtha",
  Bharani: "Anuradha",
  Krittika: "Vishakha",
  Rohini: "Swati",
  Mrigashira: "Chitra",
  Ardra: "Shravana",
  Punarvasu: "Uttara Ashadha",
  Pushya: "Purva Ashadha",
  Ashlesha: "Mula",
  Magha: "Revati",
  "Purva Phalguni": "Uttara Bhadrapada",
  "Uttara Phalguni": "Purva Bhadrapada",
  Hasta: "Shatabhisha",
};

function vedhaOf(name: string): string | undefined {
  if (VEDHA[name]) return VEDHA[name];
  return Object.keys(VEDHA).find((k) => VEDHA[k] === name);
}

function signOf(lon: number) {
  return Math.floor((((lon % 360) + 360) % 360) / 30) % 12;
}

function houseFromSign(sign: number, lagnaIndex: number) {
  return ((sign - lagnaIndex + 12) % 12) + 1;
}

/** Suryabala: transit Sun from natal Sun. 8 and 12 weak. Sunday and 10th digbala support. */
export function suryabala(local: Date, tz: number, chart: BirthChart, lagnaIndex: number): { score: number; house: number; note: string } {
  const jd = toJulianDay(localToUtc(local, tz));
  const sun = sunLongitude(jd);
  const sunSign = Math.floor(sun / 30) % 12;
  const natal = chart.grahas.find((g) => g.name === "Sun");
  const natalSign = natal?.rashiIndex ?? chart.sunRashi.index;
  const house = ((sunSign - natalSign + 12) % 12) + 1;
  let score = 50;
  if ([1, 3, 6, 10, 11].includes(house)) score += 20;
  if ([8, 12].includes(house)) score -= 25;
  if (local.getDay() === 0) score += 10;
  const digbal = ((sunSign - lagnaIndex + 12) % 12) + 1 === 10;
  if (digbal) score += 10;
  const note = `Suryabala: Sun is ${house} from natal Sun${digbal ? ", digbala" : ""}`;
  return { score: Math.max(0, Math.min(100, score)), house, note };
}

export function navamsaSign(lon: number): number {
  const sign = Math.floor(lon / 30) % 12;
  const part = Math.floor((lon % 30) / (30 / 9));
  const odd = sign % 2 === 0;
  const start = odd ? sign : (sign + 8) % 12;
  return (start + part) % 12;
}

const MAJOR_D9 = new Set([
  "marriage", "engagement", "roka", "griha_pravesh", "bhoomi_pujan", "registry",
]);

export function d9Gate(
  local: Date,
  lat: number,
  lon: number,
  tz: number,
  chart: BirthChart,
  activityKey: string,
  tier: string,
): { block: boolean; note: string } {
  if (tier !== "major" && !MAJOR_D9.has(activityKey) && !activityKey.includes("griha") && !activityKey.includes("marriage")) {
    return { block: false, note: "" };
  }
  const lagnaLon = ascendantSidereal(local, lat, lon, tz);
  const d9 = navamsaSign(lagnaLon);
  const natalLagna = chart.lagnaIndex;
  const natalD9 = navamsaSign(natalLagna * 30 + 15);
  const fromNatal = ((d9 - natalD9 + 12) % 12) + 1;
  const block = fromNatal === 8 || fromNatal === 12;
  return {
    block,
    note: `D9 lagna ${RASHIS[d9]} is ${fromNatal} from natal D9`,
  };
}

/** Only two widely attested abhujh days. They support; they do not erase Rahu or Bhadra. */
export function abhujh(p: Panchang): string | null {
  const t = p.tithi.number;
  const sun = p.sunRashi.name;
  if (t === 3 && p.tithi.paksha === "Shukla" && sun === "Aries") return "Akshaya Tritiya";
  if (t === 10 && p.tithi.paksha === "Shukla" && sun === "Virgo") return "Vijayadashami";
  return null;
}


const DISHA: Record<number, string> = {
  0: "West", 1: "East", 2: "North", 3: "North", 4: "South", 5: "West", 6: "East",
};

/** Muhurta Chintamani: 2nd avritti of Vipat, Pratyari, Vadha — first pada is barred. */
export function avrittiPadaBar(taraNumber: number, avritti: number, pada: number): boolean {
  return (taraNumber === 3 || taraNumber === 5 || taraNumber === 7) && avritti === 2 && pada === 1;
}

function weightage(p: Panchang, taraShubh: boolean): number {
  const v = 8;
  const k = p.karana.isVishti ? 0 : 16;
  const y = p.yoga.isAshubh ? 0 : 32;
  const t = taraShubh ? 60 : 0;
  return v + k + y + t;
}

export function extraGates(
  local: Date,
  lat: number,
  lon: number,
  tz: number,
  chart: BirthChart,
  p: Panchang,
  activityKey: string,
  tier: string,
  taraNumber: number,
  avritti: number,
): ExtraGates {
  const blocks: string[] = [];
  const cautions: string[] = [];
  const supports: string[] = [];
  const notes: string[] = [];
  const sunrise = new Date(p.sunrise);
  const span = tithiSpan(sunrise, lat, lon, tz);
  if (span.kshaya.includes(p.tithi.number)) {
    const msg = `Kshaya tithi ${p.tithi.name}`;
    if (tier === "major") blocks.push(msg);
    else cautions.push(msg);
  }
  if (span.vriddhi) {
    const msg = `Vriddhi tithi ${p.tithi.name}`;
    if (tier === "major") cautions.push(msg);
    else supports.push(msg);
  }
  const bands = guruShukraBand(local, tz);
  for (const msg of bands) {
    if (tier === "major") blocks.push(msg);
    else cautions.push(msg);
  }
  if (adhikMasa(local, lat, lon, tz)) {
    const msg = "Adhik masa";
    if (tier === "major") blocks.push(msg);
    else cautions.push(msg);
  }
  const ahead = getPanchang(new Date(local.getTime() + 5 * 60000), lat, lon, tz);
  if (ahead.nakshatra.name !== p.nakshatra.name || ahead.tithi.number !== p.tithi.number) {
    blocks.push("Under 5 minutes");
  }
  const lagnaIndex = Math.floor(ascendantSidereal(local, lat, lon, tz) / 30) % 12;
  if (/marriage|vivah|wedding/i.test(activityKey)) {
    const jd = toJulianDay(localToUtc(local, tz));
    const sunSign = signOf(sidereal(sunLongitude(jd), jd));
    const moonSign = signOf(p.moonSid);
    const marsSign = signOf(planetSidereal("Mars", jd));
    const saturnSign = signOf(planetSidereal("Saturn", jd));
    const sunH = houseFromSign(sunSign, lagnaIndex);
    const moonH = houseFromSign(moonSign, lagnaIndex);
    const marsH = houseFromSign(marsSign, lagnaIndex);
    if (sunH === 1) blocks.push("Surya in lagna");
    if (moonH === 7) blocks.push("Chandra in seventh");
    if (moonH === 6) blocks.push("Chandra in sixth");
    if (moonH === 6 || moonH === 8) blocks.push("Shadashtaka Chandra");
    if (marsH === 1) blocks.push("Mangal in lagna");
    if (moonSign === sunSign || moonSign === marsSign || moonSign === saturnSign) cautions.push("Yuti dosha");
    const vedha = vedhaOf(chart.janmaNakshatra.name);
    if (vedha && vedha === p.nakshatra.name) blocks.push("Vedha dosha");
  }
  const surya = suryabala(local, tz, chart, lagnaIndex);
  notes.push(surya.note);
  if (surya.house === 8 || surya.house === 12) cautions.push(surya.note);
  else supports.push(surya.note);
  const d9 = d9Gate(local, lat, lon, tz, chart, activityKey, tier);
  if (d9.note) notes.push(d9.note);
  if (d9.block) blocks.push(d9.note);
  else if (d9.note && (tier === "major" || MAJOR_D9.has(activityKey))) supports.push(d9.note);
  const free = abhujh(p);
  if (free) supports.push(`Abhujh: ${free}`);
  if (avrittiPadaBar(taraNumber, avritti, p.nakshatra.pada)) {
    blocks.push(`Avritti ${avritti} pada 1 of malefic tara`);
  }
  if (tier === "major" && (taraNumber === 3 || taraNumber === 5 || taraNumber === 7)) {
    blocks.push(`Tarabal ${taraNumber} blocked for major`);
  }
  supports.push(`Udaya tithi is the sunrise tithi`);
  const w = weightage(p, !(taraNumber === 3 || taraNumber === 5 || taraNumber === 7));
  notes.push(`Weightage ${w} (vara 8, karana, yoga, tara 60)`);
  if (activityKey.includes("travel") || activityKey.includes("depart") || activityKey.includes("flight")) {
    cautions.push(`Disha shool ${DISHA[local.getDay()]}`);
  }
  return { blocks, cautions, supports, surya: surya.score, notes };
}
