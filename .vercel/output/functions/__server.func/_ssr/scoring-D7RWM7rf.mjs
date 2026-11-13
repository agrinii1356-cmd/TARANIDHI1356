import { a as dashaFor, n as calculateTaraBala, o as getPanchang, t as calculateChandraBala } from "./store-DwrWbSZO.mjs";
import { r as getActivity, t as ACTIVITIES } from "./activities-D7sozMnA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scoring-D7RWM7rf.js
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
	if (act.karaka.includes(p.horaLord)) score = 75;
	else if (p.horaLord === "Jupiter" || p.horaLord === "Venus" || p.horaLord === "Mercury") score = 58;
	else if (p.horaLord === "Saturn" || p.horaLord === "Mars") score = 42;
	if (act.karaka.includes(p.horaLord) && p.uphora.half === 1) score += 8;
	else if (p.uphora.half === 2) score -= 3;
	return clamp(score);
}
function dashaBonus(d, act) {
	let score = 50;
	if (act.karaka.includes(d.maha)) score += 22;
	else if (act.karaka.includes(d.antar)) score += 14;
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
	const personal = clamp(50 + tara.score + chandra.score);
	const hora = horaBonus(p, act);
	const dasha = dashaFor(chart, local);
	const dashaS = dashaBonus(dasha, act);
	const golden = goldenScore(p);
	const final = clamp(panch * .38 + personal * .26 + hora * .14 + dashaS * .12 + golden * .1);
	const quality = qualityOf(final);
	const reasons = [];
	reasons.push(tara.isShubh ? `Tara Bala is ${tara.name} (favourable)` : `Tara Bala is ${tara.name} (unfavourable)`);
	reasons.push(chandra.isShubh ? `Moon is ${chandra.distance} from natal Moon (supportive)` : `Moon is ${chandra.distance} from natal Moon (dusthana)`);
	reasons.push(`Vimshottari ${dasha.maha}–${dasha.antar}`);
	if (p.golden.amritSiddhi) reasons.push("Amrit Siddhi Yoga — professional golden window");
	else if (p.golden.sarvarthaSiddhi) reasons.push("Sarvartha Siddhi Yoga — works for most starts");
	if (p.karana.isVishti) reasons.push("Vishti (Bhadra) Karana — avoid for starts");
	if (act.preferredVara.includes(p.vara.name)) reasons.push(`${p.vara.name} suits this activity`);
	if (p.yoga.isAshubh) reasons.push(`Yoga ${p.yoga.name} is traditionally avoided`);
	if (p.rahuKaal.isActive) reasons.push("Currently inside Rahu Kaal");
	if (act.karaka.includes(p.horaLord)) reasons.push(`${p.horaLord} ${p.uphora.label.toLowerCase()} hora matches the activity karaka`);
	if (act.preferredNakshatra.includes(p.nakshatra.name)) reasons.push(`${p.nakshatra.name} is preferred for this work`);
	if (act.karaka.includes(dasha.maha)) reasons.push(`${dasha.maha} mahadasha supports this karaka`);
	return {
		datetime: local.toISOString(),
		activityKey: act.key,
		activityName: act.name,
		finalScore: Math.round(final * 10) / 10,
		quality,
		breakdown: {
			panchanga: Math.round(panch),
			personal: Math.round(personal),
			hora: Math.round(hora),
			dasha: Math.round(dashaS),
			golden: Math.round(golden)
		},
		tara,
		chandra,
		panchang: p,
		dasha,
		reasons,
		recommendation: final >= 65 ? "Recommended" : final >= 50 ? "Usable if needed" : "Prefer another window"
	};
}
function searchMuhurats(opts) {
	const out = [];
	const cur = new Date(opts.start);
	cur.setHours(0, 0, 0, 0);
	const end = new Date(opts.end);
	const now = /* @__PURE__ */ new Date();
	while (cur <= end && out.length < (opts.maxResults ?? 10) * 8) {
		for (let h = 8; h <= 19; h++) for (const m of [0, 30]) {
			const dt = new Date(cur);
			dt.setHours(h, m, 0, 0);
			if (dt < now) continue;
			const s = scoreMuhurat(dt, opts.activityKey, opts.chart, opts.lat, opts.lon, opts.tz);
			if (s.finalScore >= (opts.minScore ?? 52)) out.push(s);
		}
		cur.setDate(cur.getDate() + 1);
	}
	out.sort((a, b) => {
		const g = Number(b.panchang.golden.amritSiddhi) - Number(a.panchang.golden.amritSiddhi) || Number(b.panchang.golden.sarvarthaSiddhi) - Number(a.panchang.golden.sarvarthaSiddhi);
		if (g) return g;
		return b.finalScore - a.finalScore;
	});
	return out.slice(0, opts.maxResults ?? 10);
}
function dayScore(localNoon, chart, lat, lon, tz) {
	return scoreMuhurat(localNoon, "daily_start", chart, lat, lon, tz);
}
//#endregion
export { scoreMuhurat as n, searchMuhurats as r, dayScore as t };
