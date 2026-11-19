import { C as planetSidereal, E as toJulianDay, T as sunLongitude, b as localToUtc, d as calculateChandraBala, f as calculateTaraBala, h as dashaFor, o as RASHIS, u as ascendantSidereal, v as getBirthChart, w as sidereal, y as getPanchang } from "./store-BvmsIaJ0.mjs";
import { a as getActivity, i as extraGates, o as navamsaSign, t as ACTIVITIES } from "./gates-DjmUZLwL.mjs";
import { n as readSutras } from "./sutra-CaMTmmzz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scoring-DMPg2j4c.js
var BIRDS = [
	"Vulture",
	"Owl",
	"Crow",
	"Cock",
	"Peacock"
];
var BIRD_ACTS = [
	"Ruling",
	"Eating",
	"Walking",
	"Sleeping",
	"Dying"
];
var FRIENDS = {
	Vulture: ["Peacock", "Owl"],
	Owl: ["Vulture", "Crow"],
	Crow: ["Cock", "Owl"],
	Cock: ["Owl", "Peacock"],
	Peacock: ["Vulture", "Cock"]
};
/** Nakshatra index 0–26. Shukla and Krishna swap the ends; the middle crow group stays. */
function birthBird(nakshatraIndex, shukla) {
	const i = (nakshatraIndex % 27 + 27) % 27;
	return (shukla ? [
		[5, "Vulture"],
		[11, "Owl"],
		[16, "Crow"],
		[21, "Cock"],
		[27, "Peacock"]
	] : [
		[5, "Peacock"],
		[11, "Cock"],
		[16, "Crow"],
		[21, "Owl"],
		[27, "Vulture"]
	]).find(([end]) => i < end)?.[1] ?? "Crow";
}
var WEEK_START = {
	0: 0,
	1: 1,
	2: 0,
	3: 1,
	4: 2,
	5: 3,
	6: 4
};
/**
* Day and night are each five equal parts.
* Shukla: Sunday/Tuesday open on the Vulture ruling, then the birds step forward.
* Krishna: the same weekday opens on the far bird and steps backward.
* The native's bird does one act in each part: Ruling, Eating, Walking, Sleeping, Dying.
*/
function panchpakshiAt(local, sunrise, sunset, janmaNakshatra, birthShukla, nowShukla) {
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
	const from = day ? sunrise : early ? /* @__PURE__ */ new Date(sunset.getTime() - 864e5) : sunset;
	const to = day ? sunset : early ? sunrise : new Date(sunrise.getTime() + 864e5);
	const span = Math.max(1, to.getTime() - from.getTime());
	let yama = Math.floor((local.getTime() - from.getTime()) / span * 5);
	if (yama < 0) yama = 0;
	if (yama > 4) yama = 4;
	const rel = (birdIndex - start + 50) % 5;
	const activity = BIRD_ACTS[(dir === 1 ? rel + yama : rel - yama + 50) % 5];
	const score = activity === "Ruling" ? 100 : activity === "Eating" ? 82 : activity === "Walking" ? 58 : activity === "Sleeping" ? 32 : 12;
	return {
		bird,
		activity,
		yama: yama + 1,
		dayHalf: day ? "Day" : "Night",
		friends: FRIENDS[bird],
		score
	};
}
var GOCHAR_HOUSES = {
	Sun: [
		3,
		6,
		10,
		11
	],
	Mars: [
		3,
		6,
		11
	],
	Mercury: [
		2,
		4,
		6,
		8,
		10,
		11
	],
	Jupiter: [
		2,
		5,
		7,
		9,
		11
	],
	Venus: [
		1,
		2,
		3,
		4,
		5,
		7,
		8,
		9,
		11,
		12
	],
	Saturn: [
		3,
		6,
		11
	]
};
var GOCHAR_WEIGHT = {
	Jupiter: 3,
	Saturn: 3,
	Venus: 2,
	Mars: 2,
	Sun: 1,
	Mercury: 1
};
function gocharAt(local, tz, natalMoonRashi) {
	const jd = toJulianDay(localToUtc(local, tz));
	const sunSign = Math.floor(sidereal(sunLongitude(jd), jd) / 30) % 12;
	const hits = [];
	const add = (planet, sign) => {
		const house = (sign - natalMoonRashi + 12) % 12 + 1;
		hits.push({
			planet,
			house,
			good: GOCHAR_HOUSES[planet].includes(house)
		});
	};
	add("Sun", sunSign);
	for (const name of [
		"Mars",
		"Mercury",
		"Jupiter",
		"Venus",
		"Saturn"
	]) add(name, Math.floor(planetSidereal(name, jd) / 30) % 12);
	let goodW = 0;
	let total = 0;
	for (const hit of hits) {
		const w = GOCHAR_WEIGHT[hit.planet];
		total += w;
		if (hit.good) goodW += w;
	}
	let score = Math.round(30 + 70 * (goodW / total));
	const saturn = hits.find((h) => h.planet === "Saturn");
	const sadeSati = !!saturn && [
		12,
		1,
		2
	].includes(saturn.house);
	if (sadeSati) score = Math.max(0, score - 15);
	return {
		hits,
		sadeSati,
		score
	};
}
function clamp(n, a = 0, b = 100) {
	return Math.max(a, Math.min(b, n));
}
function qualityOf(score) {
	if (score >= 80) return "Excellent";
	if (score >= 65) return "Good";
	if (score >= 50) return "Average";
	return "Avoid";
}
function panchangaScore(p, act) {
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
function horaBonus(p, act) {
	let score = 50;
	if (act.karaka.includes(p.horaLord)) score = 78;
	else if (p.horaLord === "Jupiter" || p.horaLord === "Venus" || p.horaLord === "Mercury") score = 58;
	else if (p.horaLord === "Saturn" || p.horaLord === "Mars") score = 40;
	if (p.uphora.half === 1) score += act.karaka.includes(p.horaLord) ? 12 : 4;
	else score -= 10;
	if (act.karaka.includes(p.kpSub.lord)) score += 10;
	else if (p.kpSub.lord === "Saturn" || p.kpSub.lord === "Mars") score -= 6;
	return clamp(score);
}
/** KP BasicRules + Nakshatra Nadi house sets from the rule book. */
function kpNadiHouses(act) {
	const c = act.category;
	if (c === "Career") return {
		good: [
			2,
			6,
			10,
			11
		],
		bad: [
			5,
			8,
			12
		]
	};
	if (c === "Business") return {
		good: [
			2,
			7,
			10,
			11
		],
		bad: [
			6,
			8,
			12
		]
	};
	if (c === "Finance") return {
		good: [
			2,
			6,
			11
		],
		bad: [
			5,
			8,
			12
		]
	};
	if (c === "Marketing" || c === "Media" || c === "Technology") return {
		good: [
			3,
			10,
			11
		],
		bad: [
			6,
			8,
			12
		]
	};
	if (c === "Relationship") return {
		good: [
			2,
			7,
			9,
			11
		],
		bad: [
			1,
			5,
			6,
			10
		]
	};
	if (c === "Family") return {
		good: [
			2,
			5,
			9,
			11
		],
		bad: [
			1,
			4,
			10
		]
	};
	if (c === "Education") return {
		good: [
			2,
			4,
			5,
			9,
			11
		],
		bad: [
			6,
			8,
			12
		]
	};
	if (c === "Health") return {
		good: [
			5,
			9,
			11
		],
		bad: [
			6,
			8,
			12
		]
	};
	if (c === "Real Estate" || c === "Purchase") return {
		good: [4, 11],
		bad: [
			3,
			5,
			10
		]
	};
	if (c === "Travel") return {
		good: [
			3,
			9,
			11,
			12
		],
		bad: [6, 8]
	};
	if (c === "Legal" || c === "Civic") return {
		good: [
			6,
			10,
			11
		],
		bad: [8, 12]
	};
	if (c === "Spiritual") return {
		good: [
			5,
			9,
			12
		],
		bad: [6, 8]
	};
	return {
		good: [1, 11],
		bad: [
			6,
			8,
			12
		]
	};
}
function dashaBonus(d, act, chart) {
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
	if (act.tier === "major" && ["Rahu", "Ketu"].includes(d.maha) && !act.karaka.includes(d.maha)) score -= 10;
	return clamp(score);
}
function goldenScore(p) {
	if (p.golden.amritSiddhi) return 100;
	if (p.golden.sarvarthaSiddhi) return 86;
	return 48;
}
function scoreMuhurat(local, activityKey, chart, lat, lon, tz) {
	const act = getActivity(activityKey) ?? ACTIVITIES[0];
	const p = getPanchang(local, lat, lon, tz);
	const panch = panchangaScore(p, act);
	const tara = calculateTaraBala(chart.janmaNakshatra.index, p.nakshatra.index);
	const chandra = calculateChandraBala(chart.janmaRashi.index, p.moonRashi.index);
	const navtara = clamp(50 + tara.score * 1.6);
	const chandraS = clamp(50 + chandra.score * 2);
	const hora = horaBonus(p, act);
	const birth = getPanchang(chart.birth, lat, lon, tz);
	const pakshi = panchpakshiAt(local, new Date(p.sunrise), new Date(p.sunset), chart.janmaNakshatra.index, birth.tithi.paksha === "Shukla", p.tithi.paksha === "Shukla");
	const gochar = gocharAt(local, tz, chart.janmaRashi.index);
	const rawSutra = readSutras(p, local, lat, lon, tz, chart);
	const extra = extraGates(local, lat, lon, tz, chart, p, act.key, act.tier, tara.number, tara.avritti);
	rawSutra.blocks.push(...extra.blocks);
	rawSutra.cautions.push(...extra.cautions);
	rawSutra.supports.push(...extra.supports);
	const sutra = act.tier === "major" ? {
		...rawSutra,
		blocks: [...rawSutra.blocks, ...rawSutra.cautions],
		cautions: []
	} : rawSutra;
	const dasha = dashaFor(chart, local);
	const dashaS = dashaBonus(dasha, act, chart);
	const mChart = getBirthChart(local, lat, lon, tz);
	const mLagnaLon = ascendantSidereal(local, lat, lon, tz);
	const mD9 = navamsaSign(mLagnaLon);
	const muhurta = {
		lagna: mChart.lagna,
		lagnaD9: RASHIS[mD9],
		place: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
		grahas: mChart.grahas.map((g) => ({
			name: g.name,
			rashi: g.rashi,
			house: g.houseFromLagna,
			d9: RASHIS[navamsaSign(g.lon)],
			digbal: g.digbal
		}))
	};
	const golden = goldenScore(p);
	const trad = act.paddhati === "traditional";
	const w = trad ? {
		panch: .4,
		navtara: .1,
		chandra: .06,
		hora: .14,
		pakshi: .06,
		gochar: .06,
		dasha: .06,
		golden: .12
	} : {
		panch: .2,
		navtara: .16,
		chandra: .1,
		hora: .1,
		pakshi: .1,
		gochar: .14,
		dasha: .14,
		golden: .06
	};
	const d9From = (mD9 - navamsaSign(chart.lagnaIndex * 30 + 15) + 12) % 12 + 1;
	const d9Adj = [
		1,
		5,
		9,
		11
	].includes(d9From) ? 4 : [
		6,
		8,
		12
	].includes(d9From) ? -4 : 0;
	const final = clamp(panch * w.panch + navtara * w.navtara + chandraS * w.chandra + hora * w.hora + pakshi.score * w.pakshi + gochar.score * w.gochar + dashaS * w.dasha + golden * w.golden + d9Adj);
	const quality = qualityOf(final);
	const reasons = [];
	if ([
		1,
		5,
		9,
		11
	].includes(d9From)) reasons.push(`Muhurta D9 lagna is ${d9From} from natal D9 — supports.`);
	if ([
		6,
		8,
		12
	].includes(d9From)) reasons.push(`Muhurta D9 lagna is ${d9From} from natal D9 — weak.`);
	reasons.push(`Muhurta lagna ${mChart.lagna} at ${lat.toFixed(2)},${lon.toFixed(2)}. Navamsa lagna ${RASHIS[mD9]}.`);
	reasons.push(trad ? "Paddhati: Traditional. Panchang 40%, golden 12%, hora 14%. Birth chart is secondary." : "Paddhati: Advance. Gochar 14%, dasha 14%, navtara 16%. Birth chart leads.");
	const halfLabel = p.uphora.half === 1 ? "mukhya (first 30 min, stronger)" : "uphora (second 30 min, weaker)";
	reasons.push(`Hora ${p.horaLord}: ${halfLabel}. KP sub ${p.kpSub.index}/7 is ${p.kpSub.lord}.`);
	reasons.push(`Panchpakshi: your ${pakshi.bird} is ${pakshi.activity} (yama ${pakshi.yama}, ${pakshi.dayHalf.toLowerCase()})`);
	const strong = gochar.hits.filter((h) => h.good).map((h) => `${h.planet} ${h.house}`);
	reasons.push(gochar.sadeSati ? `Gochar from your Moon: Sade Sati. Support also from ${strong.slice(0, 3).join(", ") || "none"}` : `Gochar from your Moon supports ${strong.slice(0, 4).join(", ") || "no major planet"}`);
	reasons.push(tara.isShubh ? `Navtara is ${tara.name}, avritti ${tara.avritti} (favourable)` : `Navtara is ${tara.name}, avritti ${tara.avritti} (unfavourable)`);
	reasons.push(chandra.isShubh ? `Moon is ${chandra.distance} from natal Moon (supportive)` : `Moon is ${chandra.distance} from natal Moon (dusthana)`);
	reasons.push(`Vimshottari ${dasha.maha}–${dasha.antar}`);
	reasons.push(extra.notes[0] ?? "Suryabala");
	if (extra.supports.some((x) => x.startsWith("Abhujh"))) reasons.push(extra.supports.find((x) => x.startsWith("Abhujh")));
	const kp = kpNadiHouses(act);
	const mahaG = chart.grahas.find((g) => g.name === dasha.maha);
	if (mahaG) {
		const tag = kp.good.includes(mahaG.houseFromLagna) ? "supports" : kp.bad.includes(mahaG.houseFromLagna) ? "opposes" : "is neutral for";
		reasons.push(`KP/Nadi: ${dasha.maha} in house ${mahaG.houseFromLagna} ${tag} this work (good ${kp.good.join(",")}, bad ${kp.bad.join(",")}).`);
	}
	if (mahaG) reasons.push(`D1 ${mahaG.name}: ${mahaG.nakshatra} pada ${mahaG.pada}, ${mahaG.rashi}, house ${mahaG.houseFromLagna} from lagna${mahaG.digbal ? ", digbal" : ""}.`);
	const moonG = chart.grahas.find((g) => g.name === "Moon");
	if (moonG) reasons.push(`Natal Moon: ${moonG.nakshatra} pada ${moonG.pada}, ${moonG.rashi}. Transit star pada ${p.nakshatra.pada}.`);
	const gocharLine = gochar.hits.slice(0, 4).map((h) => `${h.planet} ${h.house}${h.good ? "+" : ""}`).join(", ");
	reasons.push(`Gochar from Moon: ${gocharLine}${gochar.sadeSati ? " · Sade Sati" : ""}.`);
	if (p.golden.amritSiddhi) reasons.push("Amrit Siddhi Yoga — professional golden window");
	else if (p.golden.sarvarthaSiddhi) reasons.push("Sarvartha Siddhi Yoga — works for most starts");
	if (p.karana.isVishti) reasons.push("Vishti (Bhadra) Karana — avoid for starts");
	if (act.preferredVara.includes(p.vara.name)) reasons.push(`${p.vara.name} suits this activity`);
	if (p.yoga.isAshubh) reasons.push(`Yoga ${p.yoga.name} is traditionally avoided`);
	if (p.rahuKaal.isActive) reasons.push("Currently inside Rahu Kaal");
	if (act.preferredNakshatra.includes(p.nakshatra.name)) reasons.push(`${p.nakshatra.name} is preferred for this work`);
	if (act.karaka.includes(dasha.maha)) reasons.push(`${dasha.maha} mahadasha supports this karaka`);
	const navtaraFlag = tara.number === 3 || tara.number === 5 || tara.number === 7 ? "alert" : tara.isShubh ? "priority" : "plain";
	if (sutra.blocks.length) reasons.unshift(`Avoid: ${sutra.blocks.join(", ")}.`);
	if (navtaraFlag === "alert") reasons.unshift(`Alert: ${p.nakshatra.name} is ${tara.name} navtara. Do not start this work while this star lasts.`);
	else if (navtaraFlag === "priority") reasons.unshift(`Priority: ${p.nakshatra.name} is ${tara.name} navtara. This star is kept above the others.`);
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
			golden: Math.round(golden)
		},
		tara,
		chandra,
		pakshi,
		gochar,
		sutra,
		panchang: p,
		dasha,
		reasons,
		recommendation: sutra.blocks.length ? "Avoid" : navtaraFlag === "alert" ? "Alert" : final >= 65 ? "Recommended" : final >= 50 ? "Usable if needed" : "Prefer another window",
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
				digbal: g.digbal
			}))
		},
		weights: w
	};
}
function searchMuhurats(opts) {
	const slots = [];
	const cur = new Date(opts.start);
	cur.setHours(0, 0, 0, 0);
	const end = new Date(opts.end);
	const now = /* @__PURE__ */ new Date();
	while (cur <= end) {
		for (let h = 8; h <= 19; h++) for (const m of [0, 30]) {
			const dt = new Date(cur);
			dt.setHours(h, m, 0, 0);
			if (dt < now) continue;
			slots.push(scoreMuhurat(dt, opts.activityKey, opts.chart, opts.lat, opts.lon, opts.tz));
		}
		cur.setDate(cur.getDate() + 1);
	}
	const bestPerStar = (list) => {
		const map = /* @__PURE__ */ new Map();
		for (const s of list) {
			const key = `${s.datetime.slice(0, 10)}-${s.panchang.nakshatra.name}-${s.tara.number}`;
			const prev = map.get(key);
			if (!prev || s.finalScore > prev.finalScore) map.set(key, s);
		}
		return [...map.values()];
	};
	const min = opts.minScore ?? 52;
	const open = (s) => s.sutra.blocks.length === 0;
	const fit = (s) => {
		const act = getActivity(s.activityKey);
		let n = s.finalScore;
		if (act?.preferredNakshatra.includes(s.panchang.nakshatra.name)) n += 18;
		if (act?.karaka.includes(s.panchang.horaLord)) n += 8;
		if (act?.preferredVara.includes(s.panchang.vara.name)) n += 6;
		if (s.panchang.uphora.half === 1) n += 3;
		return n;
	};
	return {
		priority: bestPerStar(slots.filter((s) => s.navtaraFlag === "priority" && open(s) && s.finalScore >= min - 8)).sort((a, b) => fit(b) - fit(a) || b.finalScore - a.finalScore).slice(0, opts.maxResults ?? 1),
		alerts: bestPerStar(slots.filter((s) => s.navtaraFlag === "alert" || s.sutra.blocks.length > 0)).sort((a, b) => a.datetime.localeCompare(b.datetime)).slice(0, 5)
	};
}
function dayScore(localNoon, chart, lat, lon, tz) {
	return scoreMuhurat(localNoon, "daily_start", chart, lat, lon, tz);
}
//#endregion
export { scoreMuhurat as n, searchMuhurats as r, dayScore as t };
