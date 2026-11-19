import { l as YOGA_FRUIT, o as RASHIS, t as ASHUBH_YOGAS, u as ascendantSidereal } from "./store-BvmsIaJ0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sutra-CaMTmmzz.js
/** 4 ghatis of tyajya, counted from the start of each nakshatra. */
var VARJYA_GHATI = [
	50,
	4,
	22,
	40,
	16,
	20,
	28,
	20,
	32,
	30,
	20,
	32,
	22,
	20,
	14,
	14,
	10,
	14,
	20,
	24,
	20,
	10,
	10,
	18,
	16,
	24,
	30
];
var YAMAGANDA = [
	5,
	4,
	3,
	2,
	1,
	7,
	6
];
var GULIKA = [
	7,
	6,
	5,
	4,
	3,
	2,
	1
];
var RAHU_PART = [
	8,
	2,
	7,
	5,
	6,
	4,
	3
];
var DAGDHA = [
	12,
	11,
	5,
	3,
	6,
	8,
	9
];
var VISHA = [
	4,
	6,
	7,
	2,
	8,
	9,
	7
];
var MRITYU = [
	12,
	11,
	5,
	3,
	6,
	8,
	9
];
var LUNAR_MONTHS = [
	"Chaitra",
	"Vaishakha",
	"Jyeshtha",
	"Ashadha",
	"Shravana",
	"Bhadrapada",
	"Ashwina",
	"Kartika",
	"Margashirsha",
	"Pausha",
	"Magha",
	"Phalguna"
];
var SHUNYA_TITHI = [
	1,
	10,
	4,
	6,
	8,
	12,
	2,
	11,
	5,
	7,
	9,
	3
];
var SHUNYA_NAKSHATRA = [
	"Bharani",
	"Rohini",
	"Ardra",
	"Pushya",
	"Magha",
	"Hasta",
	"Swati",
	"Anuradha",
	"Mula",
	"Shravana",
	"Dhanishta",
	"Purva Bhadrapada"
];
var SHUNYA_RASHI = [
	"Mesha",
	"Vrishabha",
	"Mithuna",
	"Karka",
	"Simha",
	"Kanya",
	"Tula",
	"Vrishchika",
	"Dhanu",
	"Makara",
	"Kumbha",
	"Meena"
];
function nandaadi(tithi15) {
	return [
		"Nanda",
		"Bhadra",
		"Jaya",
		"Rikta",
		"Purna"
	][(tithi15 - 1) % 5 + 1 - 1];
}
function lunarMonthIndex(nakIndex) {
	return Math.floor((nakIndex + 14) % 27 * 12 / 27) % 12;
}
var CHOGHADIYA = [
	"Amrit",
	"Kaal",
	"Shubh",
	"Rog",
	"Labh",
	"Udveg",
	"Char"
];
var CHOGHADIYA_START = [
	5,
	0,
	3,
	4,
	2,
	6,
	1
];
var BAD_CHOGHADIYA = /* @__PURE__ */ new Set([
	"Rog",
	"Kaal",
	"Udveg"
]);
function eighth(sunrise, sunset, part, at) {
	const seg = (sunset.getTime() - sunrise.getTime()) / 8;
	const start = sunrise.getTime() + (part - 1) * seg;
	const end = start + seg;
	return at.getTime() >= start && at.getTime() < end;
}
function dayMarks(sunriseIso, sunsetIso, weekday) {
	const sunrise = new Date(sunriseIso);
	const seg = (new Date(sunsetIso).getTime() - sunrise.getTime()) / 8;
	const slice = (part) => ({
		from: new Date(sunrise.getTime() + (part - 1) * seg).toISOString(),
		until: new Date(sunrise.getTime() + part * seg).toISOString()
	});
	return {
		rahu: slice(RAHU_PART[weekday] ?? 8),
		yamaganda: slice(YAMAGANDA[weekday] ?? 5),
		gulika: slice(GULIKA[weekday] ?? 7)
	};
}
function houseFrom(fromSign, toSign) {
	return (toSign - fromSign + 12) % 12 + 1;
}
function inGandanta(lon) {
	const x = (lon % 360 + 360) % 360;
	return [
		0,
		120,
		240
	].some((e) => {
		return Math.min(Math.abs(x - e), 360 - Math.abs(x - e)) <= 3.333;
	});
}
function readSutras(p, local, lat, lon, tz, chart) {
	const blocks = [];
	const cautions = [];
	const supports = [];
	const sunrise = new Date(p.sunrise);
	const sunset = new Date(p.sunset);
	const day = local.getDay();
	const tithi15 = (p.tithi.number - 1) % 15 + 1;
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
	if (ASHUBH_YOGAS.has(p.yoga.name)) blocks.push(`${p.yoga.name} yoga — ${YOGA_FRUIT[p.yoga.name]}`);
	if (tithi15 === DAGDHA[day]) blocks.push(`Dagdha tithi (${p.tithi.name} on ${p.vara.name})`);
	if (tithi15 === VISHA[day]) blocks.push(`Visha tithi (${p.tithi.name} on ${p.vara.name})`);
	if (tithi15 === MRITYU[day]) blocks.push(`Mrityu yoga (${p.tithi.name} on ${p.vara.name})`);
	const group = nandaadi(tithi15);
	const shukla = p.tithi.paksha === "Shukla";
	if (shukla && (group === "Nanda" || group === "Bhadra")) cautions.push(`Nandaadi: ${group} is weak in Shukla`);
	else if (!shukla && (group === "Rikta" || group === "Purna")) cautions.push(`Nandaadi: ${group} is weak in Krishna`);
	else if (shukla && (group === "Rikta" || group === "Purna") || !shukla && (group === "Nanda" || group === "Bhadra")) supports.push(`Nandaadi: ${group} is strong in ${p.tithi.paksha}`);
	const mi = lunarMonthIndex(p.nakshatra.index);
	const month = LUNAR_MONTHS[mi];
	if (tithi15 === SHUNYA_TITHI[mi]) cautions.push(`Shunya tithi ${p.tithi.name} in ${month}`);
	if (p.nakshatra.name === SHUNYA_NAKSHATRA[mi]) cautions.push(`Shunya nakshatra ${p.nakshatra.name} in ${month}`);
	if (p.moonRashi.name === SHUNYA_RASHI[mi]) cautions.push(`Shunya rashi ${p.moonRashi.name} in ${month}`);
	const span = 360 / 27;
	const ghati = (p.moonSid % span + span) % span / span * 60;
	const start = VARJYA_GHATI[p.nakshatra.index] ?? 0;
	const end = start + 4;
	if (end <= 60 ? ghati >= start && ghati < end : ghati >= start || ghati < end - 60) blocks.push(`Varjyam in ${p.nakshatra.name}`);
	if (inGandanta(p.moonSid)) blocks.push("Gandanta Moon");
	if (p.moonSid >= 300 || p.nakshatra.name === "Revati") cautions.push("Panchak");
	const lagnaLon = ascendantSidereal(local, lat, lon, tz);
	const lagnaSign = Math.floor(lagnaLon / 30) % 12;
	const fromLagna = houseFrom(Math.floor(ascendantSidereal(chart.birth, lat, lon, tz) / 30) % 12, lagnaSign);
	const fromMoon = houseFrom(chart.janmaRashi.index, lagnaSign);
	if (fromLagna === 8 || fromMoon === 8) blocks.push("Lagna in the 8th");
	if (inGandanta(lagnaLon)) blocks.push("Gandanta lagna");
	const lagna = RASHIS[lagnaSign];
	if ([
		1,
		4,
		5,
		7,
		9,
		10
	].includes(fromLagna) && fromLagna !== 8) supports.push(`Lagna ${lagna} is ${fromLagna} from birth lagna`);
	const abStart = new Date(p.abhijit.start);
	const abEnd = new Date(p.abhijit.end);
	if (local >= abStart && local < abEnd && !p.rahuKaal.isActive) supports.push("Abhijit");
	if (p.tithi.isShubh && tithi15 !== DAGDHA[day] && tithi15 !== VISHA[day]) supports.push(`Shubh tithi ${p.tithi.name}`);
	if (p.yoga.isShubh) supports.push(`${p.yoga.name} yoga — ${YOGA_FRUIT[p.yoga.name]}`);
	if (!p.karana.isVishti && ![
		"Shakuni",
		"Chatushpada",
		"Naga"
	].includes(p.karana.name)) supports.push(`${p.karana.name} karana`);
	if (p.golden.amritSiddhi) supports.push("Amrit Siddhi");
	if (p.golden.sarvarthaSiddhi) supports.push("Sarvartha Siddhi");
	return {
		blocks,
		cautions,
		supports,
		lagna
	};
}
//#endregion
export { readSutras as n, dayMarks as t };
