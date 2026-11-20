import type { Activity } from "./activities";
import { ACTIVITIES, getActivity } from "./activities";
import {
  calculateChandraBala,
  calculateTaraBala,
  dashaFor,
  getBirthChart,
  getPanchang,
  type BirthChart,
  type NatalGraha,
} from "./engine";
import { navamsaSign } from "./gates";
import { RASHIS } from "./constants";
import { ascendantSidereal } from "./astronomy";
import type { DashaSlice } from "./dasha";
import { gocharAt, panchpakshiAt, type GocharReading, type PakshiReading } from "./influences";
import { readSutras, type SutraReading } from "./sutra";
import { extraGates } from "./gates";

export type Quality = "Excellent" | "Good" | "Average" | "Avoid";

export type ScoreResult = {
  datetime: string;
  activityKey: string;
  activityName: string;
  finalScore: number;
  quality: Quality;
  breakdown: {
    panchanga: number;
    navtara: number;
    chandra: number;
    hora: number;
    pakshi: number;
    gochar: number;
    dasha: number;
    golden: number;
  };
  tara: ReturnType<typeof calculateTaraBala>;
  chandra: ReturnType<typeof calculateChandraBala>;
  pakshi: PakshiReading;
  gochar: GocharReading;
  sutra: SutraReading;
  panchang: ReturnType<typeof getPanchang>;
  dasha: DashaSlice;
  reasons: string[];
  recommendation: string;
  navtaraFlag: "priority" | "alert" | "plain";
  muhurta: {
    lagna: string;
    lagnaD9: string;
    place: string;
    grahas: { name: string; rashi: string; house: number; d9: string; digbal: boolean }[];
  };
  birth: {
    lagna: string;
    nakshatra: string;
    rashi: string;
    grahas: { name: string; rashi: string; house: number; d9: string; digbal: boolean }[];
  };
  weights: { panch: number; navtara: number; chandra: number; hora: number; pakshi: number; gochar: number; dasha: number; golden: number };
};

function clamp(n: number, a = 0, b = 100) {
  return Math.max(a, Math.min(b, n));
}

function qualityOf(score: number): Quality {
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 50) return "Average";
  return "Avoid";
}

function panchangaScore(p: ReturnType<typeof getPanchang>, act: Activity): number {
  let score = 50;
  if (act.preferredVara.includes(p.vara.name)) score += 15;
  else if (p.vara.name === "Tuesday" || p.vara.name === "Saturday") score -= 8;

  if (act.avoidTithi.includes(p.tithi.number)) score -= 18;
  else if (p.tithi.isShubh) score += 10;

  if (p.karana.isVishti) score -= 25;
  if (p.yoga.isAshubh) score -= 12;
  else if (p.yoga.isShubh) score += 8;

  if (act.preferredNakshatra.includes(p.nakshatra.name)) score += 12;
  if (p.rahuKaal.isActive) score -= 20;

  if (act.tatva === p.moonRashi.tatva) score += 6;
  if (act.guna === p.nakshatra.guna) score += 4;
  if (act.purushartha === p.tithi.purushartha) score += 4;

  return clamp(score);
}

function horaBonus(p: ReturnType<typeof getPanchang>, act: Activity): number {
  let score = 50;
  if (act.karaka.includes(p.horaLord)) score = 78;
  else if (p.horaLord === "Jupiter" || p.horaLord === "Venus" || p.horaLord === "Mercury")
    score = 58;
  else if (p.horaLord === "Saturn" || p.horaLord === "Mars") score = 40;
  // 1. Time structure: mukhya (first 30) stronger, uphora (second 30) weaker
  if (p.uphora.half === 1) score += act.karaka.includes(p.horaLord) ? 12 : 4;
  else score -= 10;
  // 2. KP sub-part: if current sub matches a karaka, small boost
  if (act.karaka.includes(p.kpSub.lord)) score += 10;
  else if (p.kpSub.lord === "Saturn" || p.kpSub.lord === "Mars") score -= 6;
  return clamp(score);
}

/** KP BasicRules + Nakshatra Nadi house sets from the rule book. */
function kpNadiHouses(act: Activity): { good: number[]; bad: number[] } {
  const c = act.category;
  if (c === "Career") return { good: [2, 6, 10, 11], bad: [5, 8, 12] };
  if (c === "Business") return { good: [2, 7, 10, 11], bad: [6, 8, 12] };
  if (c === "Finance") return { good: [2, 6, 11], bad: [5, 8, 12] };
  if (c === "Marketing" || c === "Media" || c === "Technology")
    return { good: [3, 10, 11], bad: [6, 8, 12] };
  if (c === "Relationship") return { good: [2, 7, 9, 11], bad: [1, 5, 6, 10] };
  if (c === "Family") return { good: [2, 5, 9, 11], bad: [1, 4, 10] };
  if (c === "Education") return { good: [2, 4, 5, 9, 11], bad: [6, 8, 12] };
  if (c === "Health") return { good: [5, 9, 11], bad: [6, 8, 12] };
  if (c === "Real Estate" || c === "Purchase") return { good: [4, 11], bad: [3, 5, 10] };
  if (c === "Travel") return { good: [3, 9, 11, 12], bad: [6, 8] };
  if (c === "Legal" || c === "Civic") return { good: [6, 10, 11], bad: [8, 12] };
  if (c === "Spiritual") return { good: [5, 9, 12], bad: [6, 8] };
  return { good: [1, 11], bad: [6, 8, 12] };
}

function dashaBonus(d: DashaSlice, act: Activity, chart: BirthChart): number {
  let score = 50;
  if (act.karaka.includes(d.maha)) score += 22;
  else if (act.karaka.includes(d.antar)) score += 14;
  const mahaG = chart.grahas.find((g) => g.name === d.maha);
  const antarG = chart.grahas.find((g) => g.name === d.antar);
  if (mahaG?.digbal) score += 8;
  if (antarG?.digbal) score += 4;
  const kp = kpNadiHouses(act);
  if (mahaG) {
    if (kp.good.includes(mahaG.houseFromLagna)) score += 12;
    if (kp.bad.includes(mahaG.houseFromLagna)) score -= 14;
  }
  if (antarG && kp.good.includes(antarG.houseFromLagna)) score += 6;
  if (act.tier === "major" && ["Rahu", "Ketu"].includes(d.maha) && !act.karaka.includes(d.maha)) {
    score -= 10;
  }
  return clamp(score);
}

function goldenScore(p: ReturnType<typeof getPanchang>): number {
  if (p.golden.amritSiddhi) return 100;
  if (p.golden.sarvarthaSiddhi) return 86;
  return 48;
}

export function scoreMuhurat(
  local: Date,
  activityKey: string,
  chart: BirthChart,
  lat: number,
  lon: number,
  tz: number,
): ScoreResult {
  const act = getActivity(activityKey) ?? ACTIVITIES[0];
  const p = getPanchang(local, lat, lon, tz);
  const panch = panchangaScore(p, act);
  const tara = calculateTaraBala(chart.janmaNakshatra.index, p.nakshatra.index);
  const chandra = calculateChandraBala(chart.janmaRashi.index, p.moonRashi.index);
  const navtara = clamp(50 + tara.score * 1.6);
  const chandraS = clamp(50 + chandra.score * 2);
  const hora = horaBonus(p, act);
  const pakshi = panchpakshiAt(
    local,
    new Date(p.sunrise),
    new Date(p.sunset),
    chart.janmaNakshatra.index,
    chart.birthShukla,
    p.tithi.paksha === "Shukla",
  );
  const gochar = gocharAt(local, tz, chart.janmaRashi.index);
  const rawSutra = readSutras(p, local, lat, lon, tz, chart);
  const extra = extraGates(local, lat, lon, tz, chart, p, act.key, act.tier, tara.number, tara.avritti);
  rawSutra.blocks.push(...extra.blocks);
  rawSutra.cautions.push(...extra.cautions);
  rawSutra.supports.push(...extra.supports);
  const sutra: SutraReading =
    act.tier === "major"
      ? { ...rawSutra, blocks: [...rawSutra.blocks, ...rawSutra.cautions], cautions: [] }
      : rawSutra;
  const dasha = dashaFor(chart, local);
  const dashaS = dashaBonus(dasha, act, chart);
  const mChart = getBirthChart(local, lat, lon, tz);
  const mLagnaLon = ascendantSidereal(local, lat, lon, tz);
  const mD9 = navamsaSign(mLagnaLon);
  const muhurta = {
    lagna: mChart.lagna,
    lagnaD9: RASHIS[mD9],
    place: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
    grahas: mChart.grahas.map((g: NatalGraha) => ({
      name: g.name,
      rashi: g.rashi,
      house: g.houseFromLagna,
      d9: RASHIS[navamsaSign(g.lon)],
      digbal: g.digbal,
    })),
  };
  const golden = goldenScore(p);
  const trad = act.paddhati === "traditional";
  // Traditional: panchang first. Advance: birth chart first.
  const w = trad
    ? { panch: 0.32, navtara: 0.1, chandra: 0.18, hora: 0.12, pakshi: 0.06, gochar: 0.06, dasha: 0.06, golden: 0.1 }
    : { panch: 0.16, navtara: 0.16, chandra: 0.22, hora: 0.1, pakshi: 0.08, gochar: 0.12, dasha: 0.1, golden: 0.06 };
  const d9Nudge = 0;
  const natalD9 = navamsaSign(chart.lagnaIndex * 30 + 15);
  const d9From = ((mD9 - natalD9 + 12) % 12) + 1;
  const d9Adj = [1, 5, 9, 11].includes(d9From) ? 4 : [6, 8, 12].includes(d9From) ? -4 : 0;
  const final = clamp(
    panch * w.panch +
      navtara * w.navtara +
      chandraS * w.chandra +
      hora * w.hora +
      pakshi.score * w.pakshi +
      gochar.score * w.gochar +
      dashaS * w.dasha +
      golden * w.golden +
      d9Adj,
  );
  const quality = qualityOf(final);

  const reasons: string[] = [];
  if ([1, 5, 9, 11].includes(d9From)) reasons.push(`Muhurta D9 lagna is ${d9From} from natal D9 — supports.`);
  if ([6, 8, 12].includes(d9From)) reasons.push(`Muhurta D9 lagna is ${d9From} from natal D9 — weak.`);
  reasons.push(
    `Muhurta lagna ${mChart.lagna} at ${lat.toFixed(2)},${lon.toFixed(2)}. Navamsa lagna ${RASHIS[mD9]}.`,
  );
  reasons.push(
    trad
      ? "Paddhati: Traditional. Panchang 40%, golden 12%, hora 14%. Birth chart is secondary."
      : "Paddhati: Advance. Gochar 14%, dasha 14%, navtara 16%. Birth chart leads.",
  );
  // 3 comparison points: time structure, score difference, effect difference
  const halfLabel = p.uphora.half === 1 ? "mukhya (first 30 min, stronger)" : "uphora (second 30 min, weaker)";
  reasons.push(
    `Hora ${p.horaLord}: ${halfLabel}. KP sub ${p.kpSub.index}/7 is ${p.kpSub.lord}.`,
  );
  reasons.push(
    `Panchpakshi: your ${pakshi.bird} is ${pakshi.activity} (yama ${pakshi.yama}, ${pakshi.dayHalf.toLowerCase()})`,
  );
  const strong = gochar.hits.filter((h) => h.good).map((h) => `${h.planet} ${h.house}`);
  reasons.push(
    gochar.sadeSati
      ? `Gochar from your Moon: Sade Sati. Support also from ${strong.slice(0, 3).join(", ") || "none"}`
      : `Gochar from your Moon supports ${strong.slice(0, 4).join(", ") || "no major planet"}`,
  );
  reasons.push(
    tara.isShubh
      ? `Navtara is ${tara.name}, avritti ${tara.avritti} (favourable)`
      : `Navtara is ${tara.name}, avritti ${tara.avritti} (unfavourable)`,
  );
  reasons.push(
    chandra.isShubh
      ? `Moon is ${chandra.distance} from natal Moon (supportive)`
      : `Moon is ${chandra.distance} from natal Moon (no Chandra Bala: 2, 4, 5, 8, 9, 12). The window is kept.`,
  );
  reasons.push(`Vimshottari ${dasha.maha}–${dasha.antar}`);
  reasons.push(extra.notes[0] ?? "Suryabala");
  if (extra.supports.some((x) => x.startsWith("Abhujh"))) reasons.push(extra.supports.find((x) => x.startsWith("Abhujh"))!);
  const kp = kpNadiHouses(act);
  const mahaG = chart.grahas.find((g) => g.name === dasha.maha);
  if (mahaG) {
    const tag = kp.good.includes(mahaG.houseFromLagna)
      ? "supports"
      : kp.bad.includes(mahaG.houseFromLagna)
        ? "opposes"
        : "is neutral for";
    reasons.push(
      `KP/Nadi: ${dasha.maha} in house ${mahaG.houseFromLagna} ${tag} this work (good ${kp.good.join(",")}, bad ${kp.bad.join(",")}).`,
    );
  }
  if (mahaG) {
    reasons.push(
      `D1 ${mahaG.name}: ${mahaG.nakshatra} pada ${mahaG.pada}, ${mahaG.rashi}, house ${mahaG.houseFromLagna} from lagna${mahaG.digbal ? ", digbal" : ""}.`,
    );
  }
  const moonG = chart.grahas.find((g) => g.name === "Moon");
  if (moonG) {
    reasons.push(
      `Natal Moon: ${moonG.nakshatra} pada ${moonG.pada}, ${moonG.rashi}. Transit star pada ${p.nakshatra.pada}.`,
    );
  }
  const gocharLine = gochar.hits
    .slice(0, 4)
    .map((h) => `${h.planet} ${h.house}${h.good ? "+" : ""}`)
    .join(", ");
  reasons.push(`Gochar from Moon: ${gocharLine}${gochar.sadeSati ? " · Sade Sati" : ""}.`);
  if (p.golden.amritSiddhi) reasons.push("Amrit Siddhi Yoga — professional golden window");
  else if (p.golden.sarvarthaSiddhi) reasons.push("Sarvartha Siddhi Yoga — works for most starts");
  if (p.karana.isVishti) reasons.push("Vishti (Bhadra) Karana — avoid for starts");
  if (act.preferredVara.includes(p.vara.name))
    reasons.push(`${p.vara.name} suits this activity`);
  if (p.yoga.isAshubh) reasons.push(`Yoga ${p.yoga.name} is traditionally avoided`);
  if (p.rahuKaal.isActive) reasons.push("Currently inside Rahu Kaal");
  if (act.preferredNakshatra.includes(p.nakshatra.name))
    reasons.push(`${p.nakshatra.name} is preferred for this work`);
  if (act.karaka.includes(dasha.maha))
    reasons.push(`${dasha.maha} mahadasha supports this karaka`);

  const malefic = tara.number === 3 || tara.number === 5 || tara.number === 7;
  const navtaraFlag = malefic ? "alert" : tara.isShubh ? "priority" : "plain";
  if (sutra.blocks.length) {
    reasons.unshift(`Avoid: ${sutra.blocks.join(", ")}.`);
  }
  if (navtaraFlag === "alert") {
    reasons.unshift(
      `Alert: ${p.nakshatra.name} is ${tara.name} navtara. Do not start this work while this star lasts.`,
    );
  } else if (navtaraFlag === "priority") {
    reasons.unshift(
      `Priority: ${p.nakshatra.name} is ${tara.name} navtara. This star is kept above the others.`,
    );
  }

  return {
    datetime: local.toISOString(),
    activityKey: act.key,
    activityName: act.name,
    finalScore: Math.round(final * 10) / 10,
    quality,
    breakdown: {
      panchanga: Math.round(panch),
      navtara: Math.round(navtara),
      chandra: Math.round(chandraS),
      hora: Math.round(hora),
      pakshi: pakshi.score,
      gochar: gochar.score,
      dasha: Math.round(dashaS),
      golden: Math.round(golden),
    },
    tara,
    chandra,
    pakshi,
    gochar,
    sutra,
    panchang: p,
    dasha,
    reasons,
    recommendation:
      sutra.blocks.length
        ? "Avoid"
        : navtaraFlag === "alert"
          ? "Alert"
          : final >= 65
            ? "Recommended"
            : final >= 50
              ? "Usable if needed"
              : "Prefer another window",
    navtaraFlag,
    muhurta,
    birth: {
      lagna: chart.lagna,
      nakshatra: chart.janmaNakshatra.name,
      rashi: chart.janmaRashi.name,
      grahas: chart.grahas.map((g) => ({
        name: g.name,
        rashi: g.rashi,
        house: g.houseFromLagna,
        d9: RASHIS[navamsaSign(g.lon)],
        digbal: g.digbal,
      })),
    },
    weights: w,
  };
}

export function searchMuhurats(opts: {
  activityKey: string;
  start: Date;
  end: Date;
  chart: BirthChart;
  lat: number;
  lon: number;
  tz: number;
  maxResults?: number;
  minScore?: number;
}): { priority: ScoreResult[]; alerts: ScoreResult[] } {
  const slots: ScoreResult[] = [];
  const cur = new Date(opts.start);
  cur.setHours(0, 0, 0, 0);
  const end = new Date(opts.end);
  const now = new Date();
  while (cur <= end) {
    for (let h = 8; h <= 19; h++) {
      for (const m of [0, 30]) {
        const dt = new Date(cur);
        dt.setHours(h, m, 0, 0);
        if (dt < now) continue;
        slots.push(scoreMuhurat(dt, opts.activityKey, opts.chart, opts.lat, opts.lon, opts.tz));
      }
    }
    cur.setDate(cur.getDate() + 1);
  }
  const bestPerStar = (list: ScoreResult[]) => {
    const map = new Map<string, ScoreResult>();
    for (const s of list) {
      const key = `${s.datetime.slice(0, 10)}-${s.panchang.nakshatra.name}-${s.tara.number}`;
      const prev = map.get(key);
      if (!prev || s.finalScore > prev.finalScore) map.set(key, s);
    }
    return [...map.values()];
  };
  const min = opts.minScore ?? 52;
  const open = (s: ScoreResult) => s.sutra.blocks.length === 0;
  const fit = (s: ScoreResult) => {
    const act = getActivity(s.activityKey);
    let n = s.finalScore;
    if (s.navtaraFlag === "priority") n += 12;
    if (act?.preferredNakshatra.includes(s.panchang.nakshatra.name)) n += 18;
    if (act?.karaka.includes(s.panchang.horaLord)) n += 8;
    if (act?.preferredVara.includes(s.panchang.vara.name)) n += 6;
    if (s.panchang.uphora.half === 1) n += 3;
    if (s.chandra.isShubh) n += 14;
    else n -= 8;
    if (s.panchang.golden.sarvarthaSiddhi || s.panchang.golden.amritSiddhi) n += 6;
    return n;
  };
  const priority = bestPerStar(
    slots.filter((s) => s.navtaraFlag !== "alert" && open(s) && s.finalScore >= min - 8),
  )
    .sort((a, b) => fit(b) - fit(a) || b.finalScore - a.finalScore)
    .slice(0, opts.maxResults ?? 3);
  const alerts = bestPerStar(
    slots.filter((s) => s.navtaraFlag === "alert" || s.sutra.blocks.length > 0),
  )
    .sort((a, b) => a.datetime.localeCompare(b.datetime))
    .slice(0, 5);
  return { priority, alerts };
}

export function dayScore(
  localNoon: Date,
  chart: BirthChart,
  lat: number,
  lon: number,
  tz: number,
): ScoreResult {
  return scoreMuhurat(localNoon, "daily_start", chart, lat, lon, tz);
}
