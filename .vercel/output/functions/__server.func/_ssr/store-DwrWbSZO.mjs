import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-DwrWbSZO.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
/** Meeus-style solar/lunar approximations for Vedic panchanga (sidereal, Lahiri). */
function toJulianDay(date) {
	const y = date.getUTCFullYear();
	const m = date.getUTCMonth() + 1;
	const d = date.getUTCDate() + (date.getUTCHours() + (date.getUTCMinutes() + date.getUTCSeconds() / 60) / 60) / 24;
	let Y = y;
	let M = m;
	if (M <= 2) {
		Y -= 1;
		M += 12;
	}
	const A = Math.floor(Y / 100);
	const B = 2 - A + Math.floor(A / 4);
	return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + d + B - 1524.5;
}
function deg2rad(d) {
	return d * Math.PI / 180;
}
function norm360$1(d) {
	const x = d % 360;
	return x < 0 ? x + 360 : x;
}
/** Tropical solar longitude (degrees). */
function sunLongitude(jd) {
	const T = (jd - 2451545) / 36525;
	const L0 = 280.46646 + 36000.76983 * T + 3032e-7 * T * T;
	const Mr = deg2rad(357.52911 + 35999.05029 * T - 1537e-7 * T * T);
	return norm360$1(L0 + ((1.914602 - .004817 * T - 14e-6 * T * T) * Math.sin(Mr) + (.019993 - 101e-6 * T) * Math.sin(2 * Mr) + 289e-6 * Math.sin(3 * Mr)));
}
/** Tropical lunar longitude (degrees), truncated ELP. */
function moonLongitude(jd) {
	const T = (jd - 2451545) / 36525;
	const Lp = 218.3164477 + 481267.88123421 * T - .0015786 * T * T;
	const D = 297.8501921 + 445267.1114034 * T - .0018819 * T * T;
	const M = 357.5291092 + 35999.0502909 * T - 1536e-7 * T * T;
	const Mp = 134.9633964 + 477198.8675055 * T + .0087414 * T * T;
	const F = 93.272095 + 483202.0175233 * T - .0036539 * T * T;
	const d = deg2rad;
	return norm360$1(Lp + 6.288774 * Math.sin(d(Mp)) + 1.274027 * Math.sin(d(2 * D - Mp)) + .658314 * Math.sin(d(2 * D)) + .213618 * Math.sin(d(2 * Mp)) - .185116 * Math.sin(d(M)) - .114332 * Math.sin(d(2 * F)) + .058793 * Math.sin(d(2 * D - 2 * Mp)) + .057066 * Math.sin(d(2 * D - M - Mp)) + .053322 * Math.sin(d(2 * D + Mp)) + .045758 * Math.sin(d(2 * D - M)) - .040923 * Math.sin(d(M - Mp)) - .03472 * Math.sin(d(D)) - .030465 * Math.sin(d(M + Mp)));
}
/** Lahiri ayanamsa (degrees). */
function lahiriAyanamsa(jd) {
	return 23.852931 + .013956 * ((jd - 2451545) / 36525 * 100);
}
function sidereal(tropical, jd) {
	return norm360$1(tropical - lahiriAyanamsa(jd));
}
/** Approximate local sunrise/sunset (hours from local midnight). */
function sunRiseSet(dateLocal, lat, lon, tzOffsetHours) {
	const utc = /* @__PURE__ */ new Date(dateLocal.getTime() - tzOffsetHours * 3600 * 1e3);
	utc.setUTCHours(12, 0, 0, 0);
	const L = deg2rad(280.46646 + 36000.76983 * ((toJulianDay(utc) - 2451545) / 36525));
	const decl = Math.asin(Math.sin(deg2rad(23.439) * Math.cos(L)) * .39779);
	const latR = deg2rad(lat);
	const cosH = (Math.sin(deg2rad(-.83)) - Math.sin(latR) * Math.sin(decl)) / (Math.cos(latR) * Math.cos(decl));
	const H = Math.acos(Math.min(1, Math.max(-1, cosH))) * 180 / Math.PI;
	const solarNoonMin = 720 - 4 * (lon - 15 * tzOffsetHours);
	const half = H * 4;
	const riseMin = solarNoonMin - half;
	const setMin = solarNoonMin + half;
	const y = dateLocal.getFullYear();
	const m = dateLocal.getMonth();
	const d = dateLocal.getDate();
	const sunrise = new Date(y, m, d, 0, 0, 0);
	sunrise.setMinutes(Math.round(riseMin));
	const sunset = new Date(y, m, d, 0, 0, 0);
	sunset.setMinutes(Math.round(setMin));
	return {
		sunrise,
		sunset
	};
}
function localToUtc(local, tzOffsetHours) {
	return /* @__PURE__ */ new Date(local.getTime() - tzOffsetHours * 3600 * 1e3);
}
var NAKSHATRAS = [
	"Ashwini",
	"Bharani",
	"Krittika",
	"Rohini",
	"Mrigashira",
	"Ardra",
	"Punarvasu",
	"Pushya",
	"Ashlesha",
	"Magha",
	"Purva Phalguni",
	"Uttara Phalguni",
	"Hasta",
	"Chitra",
	"Swati",
	"Vishakha",
	"Anuradha",
	"Jyeshtha",
	"Mula",
	"Purva Ashadha",
	"Uttara Ashadha",
	"Shravana",
	"Dhanishta",
	"Shatabhisha",
	"Purva Bhadrapada",
	"Uttara Bhadrapada",
	"Revati"
];
var NAKSHATRA_LORDS = [
	"Ketu",
	"Venus",
	"Sun",
	"Moon",
	"Mars",
	"Rahu",
	"Jupiter",
	"Saturn",
	"Mercury"
];
var NAKSHATRA_GROUPS = {
	fixed: [
		"Rohini",
		"Uttara Phalguni",
		"Uttara Ashadha",
		"Uttara Bhadrapada"
	],
	soft: [
		"Mrigashira",
		"Chitra",
		"Anuradha",
		"Revati"
	],
	swift: [
		"Ashwini",
		"Pushya",
		"Hasta"
	],
	movable: [
		"Punarvasu",
		"Swati",
		"Shravana",
		"Dhanishta",
		"Shatabhisha"
	],
	sharp: [
		"Ardra",
		"Ashlesha",
		"Jyeshtha",
		"Mula"
	],
	fierce: [
		"Bharani",
		"Magha",
		"Purva Phalguni",
		"Purva Ashadha",
		"Purva Bhadrapada"
	],
	mixed: ["Krittika", "Vishakha"]
};
var NAKSHATRA_GUNA = {
	Ashwini: "rajas",
	Bharani: "tamas",
	Krittika: "rajas",
	Rohini: "sattva",
	Mrigashira: "rajas",
	Ardra: "tamas",
	Punarvasu: "sattva",
	Pushya: "sattva",
	Ashlesha: "tamas",
	Magha: "tamas",
	"Purva Phalguni": "rajas",
	"Uttara Phalguni": "sattva",
	Hasta: "rajas",
	Chitra: "rajas",
	Swati: "rajas",
	Vishakha: "rajas",
	Anuradha: "sattva",
	Jyeshtha: "tamas",
	Mula: "tamas",
	"Purva Ashadha": "rajas",
	"Uttara Ashadha": "sattva",
	Shravana: "sattva",
	Dhanishta: "rajas",
	Shatabhisha: "tamas",
	"Purva Bhadrapada": "tamas",
	"Uttara Bhadrapada": "sattva",
	Revati: "sattva"
};
var TITHIS = [
	"Pratipada",
	"Dwitiya",
	"Tritiya",
	"Chaturthi",
	"Panchami",
	"Shashthi",
	"Saptami",
	"Ashtami",
	"Navami",
	"Dashami",
	"Ekadashi",
	"Dwadashi",
	"Trayodashi",
	"Chaturdashi",
	"Purnima",
	"Pratipada",
	"Dwitiya",
	"Tritiya",
	"Chaturthi",
	"Panchami",
	"Shashthi",
	"Saptami",
	"Ashtami",
	"Navami",
	"Dashami",
	"Ekadashi",
	"Dwadashi",
	"Trayodashi",
	"Chaturdashi",
	"Amavasya"
];
var SHUBH_TITHIS = /* @__PURE__ */ new Set([
	2,
	3,
	5,
	7,
	10,
	11,
	12,
	13,
	15
]);
var RIKTA_TITHIS = /* @__PURE__ */ new Set([
	4,
	9,
	14
]);
var YOGAS = [
	"Vishkambha",
	"Priti",
	"Ayushman",
	"Saubhagya",
	"Shobhana",
	"Atiganda",
	"Sukarma",
	"Dhriti",
	"Shula",
	"Ganda",
	"Vriddhi",
	"Dhruva",
	"Vyaghata",
	"Harshana",
	"Vajra",
	"Siddhi",
	"Vyatipata",
	"Variyan",
	"Parigha",
	"Shiva",
	"Siddha",
	"Sadhya",
	"Shubha",
	"Shukla",
	"Brahma",
	"Indra",
	"Vaidhriti"
];
var SHUBH_YOGAS = /* @__PURE__ */ new Set([
	"Siddhi",
	"Shubha",
	"Shukla",
	"Brahma",
	"Indra",
	"Sadhya",
	"Siddha",
	"Saubhagya",
	"Shobhana",
	"Ayushman",
	"Priti",
	"Sukarma"
]);
var ASHUBH_YOGAS = /* @__PURE__ */ new Set([
	"Vyatipata",
	"Vaidhriti",
	"Parigha",
	"Vishkambha",
	"Atiganda",
	"Shula",
	"Ganda",
	"Vyaghata"
]);
var MOVABLE_KARANAS = [
	"Bava",
	"Balava",
	"Kaulava",
	"Taitila",
	"Garaja",
	"Vanija",
	"Vishti"
];
var FIXED_KARANAS = [
	"Shakuni",
	"Chatushpada",
	"Naga"
];
var WEEKDAYS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];
var WEEKDAY_LORDS = {
	Sunday: "Sun",
	Monday: "Moon",
	Tuesday: "Mars",
	Wednesday: "Mercury",
	Thursday: "Jupiter",
	Friday: "Venus",
	Saturday: "Saturn"
};
var TARA_NAMES = {
	1: "Janma",
	2: "Sampat",
	3: "Vipat",
	4: "Kshema",
	5: "Pratyak",
	6: "Sadhana",
	7: "Naidhana",
	8: "Mitra",
	9: "Parama Mitra"
};
var SHUBH_TARAS = /* @__PURE__ */ new Set([
	2,
	4,
	6,
	8,
	9
]);
var RASHIS = [
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
var RASHI_TATVA = [
	"agni",
	"prithvi",
	"vayu",
	"jala",
	"agni",
	"prithvi",
	"vayu",
	"jala",
	"agni",
	"prithvi",
	"vayu",
	"jala"
];
var HORA_SEQUENCE = {
	Sunday: [
		"Sun",
		"Venus",
		"Mercury",
		"Moon",
		"Saturn",
		"Jupiter",
		"Mars"
	],
	Monday: [
		"Moon",
		"Saturn",
		"Jupiter",
		"Mars",
		"Sun",
		"Venus",
		"Mercury"
	],
	Tuesday: [
		"Mars",
		"Sun",
		"Venus",
		"Mercury",
		"Moon",
		"Saturn",
		"Jupiter"
	],
	Wednesday: [
		"Mercury",
		"Moon",
		"Saturn",
		"Jupiter",
		"Mars",
		"Sun",
		"Venus"
	],
	Thursday: [
		"Jupiter",
		"Mars",
		"Sun",
		"Venus",
		"Mercury",
		"Moon",
		"Saturn"
	],
	Friday: [
		"Venus",
		"Mercury",
		"Moon",
		"Saturn",
		"Jupiter",
		"Mars",
		"Sun"
	],
	Saturday: [
		"Saturn",
		"Jupiter",
		"Mars",
		"Sun",
		"Venus",
		"Mercury",
		"Moon"
	]
};
/** Weekday → nakshatra that forms Amrit Siddhi Yoga. */
var AMRIT_SIDDHI = {
	Sunday: "Hasta",
	Monday: "Mrigashira",
	Tuesday: "Ashwini",
	Wednesday: "Anuradha",
	Thursday: "Pushya",
	Friday: "Revati",
	Saturday: "Rohini"
};
/** Weekday → nakshatras that form Sarvartha Siddhi Yoga. */
var SARVARTHA_SIDDHI = {
	Sunday: [
		"Ashwini",
		"Pushya",
		"Hasta",
		"Uttara Ashadha",
		"Uttara Bhadrapada",
		"Revati"
	],
	Monday: [
		"Rohini",
		"Mrigashira",
		"Pushya",
		"Anuradha",
		"Shravana"
	],
	Tuesday: [
		"Ashwini",
		"Krittika",
		"Ashlesha",
		"Uttara Bhadrapada"
	],
	Wednesday: [
		"Krittika",
		"Rohini",
		"Mrigashira",
		"Hasta",
		"Anuradha"
	],
	Thursday: [
		"Ashwini",
		"Punarvasu",
		"Pushya",
		"Anuradha",
		"Revati"
	],
	Friday: [
		"Ashwini",
		"Anuradha",
		"Revati",
		"Hasta"
	],
	Saturday: [
		"Rohini",
		"Swati",
		"Shravana",
		"Shatabhisha"
	]
};
var VIMSHOTTARI = [
	{
		lord: "Ketu",
		years: 7
	},
	{
		lord: "Venus",
		years: 20
	},
	{
		lord: "Sun",
		years: 6
	},
	{
		lord: "Moon",
		years: 10
	},
	{
		lord: "Mars",
		years: 7
	},
	{
		lord: "Rahu",
		years: 18
	},
	{
		lord: "Jupiter",
		years: 16
	},
	{
		lord: "Saturn",
		years: 19
	},
	{
		lord: "Mercury",
		years: 17
	}
];
var PURUSHARTHA_CYCLE = [
	"dharma",
	"artha",
	"kama",
	"moksha"
];
var YEAR_MS = 315576e5;
var SPAN = 360 / 27;
function lordIndex(lord) {
	const i = VIMSHOTTARI.findIndex((v) => v.lord === lord);
	return i < 0 ? 0 : i;
}
function yearsOf(lord) {
	return VIMSHOTTARI[lordIndex(lord)]?.years ?? 10;
}
function antarSpans(mdLord, mdYears) {
	const start = lordIndex(mdLord);
	return Array.from({ length: 9 }, (_, k) => {
		const lord = VIMSHOTTARI[(start + k) % 9].lord;
		return {
			lord,
			years: mdYears * yearsOf(lord) / 120
		};
	});
}
function vimshottariAt(birth, moonSid, at) {
	const lon = (moonSid % 360 + 360) % 360;
	const idx = Math.floor(lon / SPAN) % 27;
	const janmaLord = NAKSHATRA_LORDS[idx % 9];
	const janmaNakshatra = NAKSHATRAS[idx];
	const elapsedFrac = lon % SPAN / SPAN;
	const remainFrac = Math.max(0, Math.min(1, 1 - elapsedFrac));
	const fullFirst = yearsOf(janmaLord);
	const balanceYearsAtBirth = remainFrac * fullFirst;
	const elapsedInFirst = fullFirst - balanceYearsAtBirth;
	const birthMs = birth.getTime();
	const atMs = at.getTime();
	let cursor = birthMs;
	let mdI = lordIndex(janmaLord);
	let first = true;
	for (let n = 0; n < 27; n++) {
		const md = VIMSHOTTARI[mdI % 9];
		const mdYears = first ? balanceYearsAtBirth : md.years;
		const mdStart = cursor;
		const mdEnd = cursor + mdYears * YEAR_MS;
		if (atMs <= mdEnd || n === 26) {
			const antars = antarSpans(md.lord, md.years);
			let skip = first ? elapsedInFirst : 0;
			let aStart = mdStart;
			for (const a of antars) {
				const aYears = a.years;
				if (skip >= aYears - 1e-9) {
					skip -= aYears;
					continue;
				}
				const remainingAntar = aYears - skip;
				skip = 0;
				const aEnd = aStart + remainingAntar * YEAR_MS;
				if (atMs <= aEnd) return {
					maha: md.lord,
					antar: a.lord,
					mahaStart: new Date(mdStart),
					mahaEnd: new Date(mdEnd),
					antarStart: new Date(aStart),
					antarEnd: new Date(aEnd),
					balanceYearsAtBirth,
					janmaNakshatra
				};
				aStart = aEnd;
			}
			return {
				maha: md.lord,
				antar: antars[antars.length - 1].lord,
				mahaStart: new Date(mdStart),
				mahaEnd: new Date(mdEnd),
				antarStart: new Date(aStart),
				antarEnd: new Date(mdEnd),
				balanceYearsAtBirth,
				janmaNakshatra
			};
		}
		cursor = mdEnd;
		mdI += 1;
		first = false;
	}
	const last = VIMSHOTTARI[lordIndex(janmaLord)];
	return {
		maha: last.lord,
		antar: last.lord,
		mahaStart: birth,
		mahaEnd: new Date(birthMs + 120 * YEAR_MS),
		antarStart: birth,
		antarEnd: new Date(birthMs + 120 * YEAR_MS),
		balanceYearsAtBirth,
		janmaNakshatra
	};
}
function norm360(d) {
	const x = d % 360;
	return x < 0 ? x + 360 : x;
}
function karanaFromTithiDeg(tithiDeg) {
	const kNum = Math.min(59, Math.floor(tithiDeg / 6));
	let name;
	if (kNum === 0) name = "Kimstughna";
	else if (kNum >= 57) name = FIXED_KARANAS[kNum - 57] ?? "Naga";
	else name = MOVABLE_KARANAS[(kNum - 1) % 7];
	return {
		name,
		isVishti: name === "Vishti"
	};
}
function nakshatraFromLon(lon) {
	const span = 360 / 27;
	const index = Math.floor(norm360(lon) / span) % 27;
	const pada = Math.min(4, Math.floor(norm360(lon) % span / (span / 4)) + 1);
	const name = NAKSHATRAS[index];
	let group = "mixed";
	for (const [g, names] of Object.entries(NAKSHATRA_GROUPS)) if (names.includes(name)) group = g;
	return {
		index,
		name,
		pada,
		lord: NAKSHATRA_LORDS[index % 9],
		group,
		guna: NAKSHATRA_GUNA[name] ?? "rajas"
	};
}
function rashiFromLon(lon) {
	const index = Math.floor(norm360(lon) / 30) % 12;
	return {
		index,
		name: RASHIS[index],
		tatva: RASHI_TATVA[index]
	};
}
function calculateTaraBala(janmaIndex, currentIndex) {
	const count = (currentIndex - janmaIndex + 27) % 27 + 1;
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
		count
	};
}
function calculateChandraBala(janmaRashi, currentRashi) {
	const distance = (currentRashi - janmaRashi + 12) % 12 + 1;
	const isShubh = ![
		4,
		8,
		12
	].includes(distance);
	return {
		distance,
		isShubh,
		score: isShubh ? 15 : -15
	};
}
function rahuKaal(dt, sunrise, sunset) {
	const segment = (sunset.getTime() - sunrise.getTime()) / 8;
	const idx = {
		0: 7,
		1: 1,
		2: 6,
		3: 4,
		4: 5,
		5: 3,
		6: 2
	}[dt.getDay()] ?? 4;
	const start = new Date(sunrise.getTime() + idx * segment);
	const end = new Date(start.getTime() + segment);
	return {
		start: start.toISOString(),
		end: end.toISOString(),
		isActive: dt >= start && dt <= end
	};
}
function horaAt(dt, sunrise) {
	const seq = HORA_SEQUENCE[WEEKDAYS[dt.getDay()]];
	let hours = (dt.getTime() - sunrise.getTime()) / 36e5;
	if (hours < 0) hours += 24;
	return {
		lord: seq[Math.floor(hours) % 24 % 7],
		hours
	};
}
function getPanchang(local, lat, lon, tzOffset) {
	const jd = toJulianDay(localToUtc(local, tzOffset));
	const moonTrop = moonLongitude(jd);
	const sunTrop = sunLongitude(jd);
	const moonSid = sidereal(moonTrop, jd);
	const sunSid = sidereal(sunTrop, jd);
	const tithiDeg = norm360(moonTrop - sunTrop);
	let tithiNum = Math.floor(tithiDeg / 12) + 1;
	if (tithiNum > 30) tithiNum = 30;
	const tithiName = TITHIS[tithiNum - 1];
	const paksha = tithiNum <= 15 ? "Shukla" : "Krishna";
	const nak = nakshatraFromLon(moonSid);
	const yogaDeg = norm360(sunSid + moonSid);
	const yogaNum = Math.floor(yogaDeg / (360 / 27)) % 27;
	const yogaName = YOGAS[yogaNum];
	const karana = karanaFromTithiDeg(tithiDeg);
	const varaName = WEEKDAYS[local.getDay()];
	const { sunrise, sunset } = sunRiseSet(local, lat, lon, tzOffset);
	const mid = /* @__PURE__ */ new Date((sunrise.getTime() + sunset.getTime()) / 2);
	const abhijitHalf = 144e4;
	const hora = horaAt(local, sunrise);
	const half = hora.hours - Math.floor(hora.hours) < .5 ? 1 : 2;
	const moonRashi = rashiFromLon(moonSid);
	return {
		datetime: local.toISOString(),
		tithi: {
			number: tithiNum,
			name: tithiName,
			paksha,
			elapsedPct: Math.round(tithiDeg % 12 / 12 * 1e3) / 10,
			isShubh: SHUBH_TITHIS.has(tithiNum),
			isRikta: RIKTA_TITHIS.has(tithiNum),
			purushartha: PURUSHARTHA_CYCLE[(tithiNum - 1) % 4]
		},
		nakshatra: nak,
		yoga: {
			number: yogaNum + 1,
			name: yogaName,
			isShubh: SHUBH_YOGAS.has(yogaName),
			isAshubh: ASHUBH_YOGAS.has(yogaName)
		},
		karana,
		vara: {
			name: varaName,
			lord: WEEKDAY_LORDS[varaName]
		},
		moonRashi,
		sunRashi: rashiFromLon(sunSid),
		moonSid,
		sunrise: sunrise.toISOString(),
		sunset: sunset.toISOString(),
		rahuKaal: rahuKaal(local, sunrise, sunset),
		abhijit: {
			start: (/* @__PURE__ */ new Date(mid.getTime() - abhijitHalf)).toISOString(),
			end: new Date(mid.getTime() + abhijitHalf).toISOString()
		},
		horaLord: hora.lord,
		uphora: {
			half,
			label: half === 1 ? "Mukhya" : "Uphora"
		},
		golden: {
			amritSiddhi: AMRIT_SIDDHI[varaName] === nak.name,
			sarvarthaSiddhi: (SARVARTHA_SIDDHI[varaName] ?? []).includes(nak.name)
		}
	};
}
function getBirthChart(dobLocal, lat, lon, tzOffset) {
	const p = getPanchang(dobLocal, lat, lon, tzOffset);
	return {
		janmaNakshatra: p.nakshatra,
		janmaRashi: p.moonRashi,
		sunRashi: p.sunRashi,
		moonSid: p.moonSid,
		birth: dobLocal
	};
}
function dashaFor(chart, at) {
	return vimshottariAt(chart.birth, chart.moonSid, at);
}
var useProfile = create()(persist((set) => ({
	profile: null,
	hydrated: false,
	setHydrated: (v) => set({ hydrated: v }),
	setProfile: (p) => set({ profile: p }),
	clearProfile: () => set({ profile: null })
}), {
	name: "taranidhi-profile",
	partialize: (s) => ({ profile: s.profile }),
	onRehydrateStorage: () => (state) => {
		state?.setHydrated(true);
	}
}));
function dobFromProfile(p) {
	const [y, m, d] = p.date.split("-").map(Number);
	const [hh, mm] = p.time.split(":").map(Number);
	return new Date(y, m - 1, d, hh || 12, mm || 0, 0);
}
function chartFromProfile(p) {
	return getBirthChart(dobFromProfile(p), p.lat, p.lon, p.tz);
}
//#endregion
export { dashaFor as a, cn as i, calculateTaraBala as n, getPanchang as o, chartFromProfile as r, useProfile as s, calculateChandraBala as t };
