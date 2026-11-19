/**
 * Pending classical gates.
 * Kshaya / vriddhi from sunrise tithi.
 * Guru and Shukra asta by angular orb.
 * Suryabala from natal Sun and weekday.
 * D9 lagna gate for major rites.
 * Abhujh: Akshaya Tritiya and Vijayadashami only.
 */
import { planetSidereal, sunLongitude, toJulianDay, localToUtc, ascendantSidereal } from "./astronomy";
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
  const sun = sunLongitude(jd);
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
  const asta = combustion(local, tz);
  if (asta.venus) {
    const msg = `Shukra asta (${asta.venusDeg}°)`;
    if (tier === "major") blocks.push(msg);
    else cautions.push(msg);
  }
  if (asta.jupiter) {
    const msg = `Guru asta (${asta.jupiterDeg}°)`;
    if (tier === "major") blocks.push(msg);
    else cautions.push(msg);
  }
  const lagnaIndex = Math.floor(ascendantSidereal(local, lat, lon, tz) / 30) % 12;
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
