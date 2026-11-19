import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-BvmsIaJ0.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var YEARLY_INR = Math.round(3542.4);
var YEARLY_LIST_INR = 4428;
/** Replace with the business VPA before taking live payments. */
var MERCHANT_VPA = "occultviision1@axl";
var MERCHANT_NAME = "TaraNidhi";
var useBilling = create()(persist((set, get) => ({
	demoStartedAt: null,
	paidUntil: null,
	plan: null,
	ensureDemo: () => {
		if (!get().demoStartedAt) set({ demoStartedAt: (/* @__PURE__ */ new Date()).toISOString() });
	},
	activate: (plan) => {
		const now = Date.now();
		const current = get().paidUntil ? new Date(get().paidUntil).getTime() : 0;
		set({
			plan,
			paidUntil: new Date(Math.max(now, current) + (plan === "month" ? 30 : 365) * 864e5).toISOString()
		});
	}
}), { name: "taranidhi-billing" }));
function planAccess(s, now = Date.now()) {
	if (s.paidUntil && new Date(s.paidUntil).getTime() > now) return {
		ok: true,
		kind: "paid",
		until: s.paidUntil
	};
	if (s.demoStartedAt) {
		const until = new Date(s.demoStartedAt).getTime() + 2592e5;
		if (until > now) return {
			ok: true,
			kind: "demo",
			until: new Date(until).toISOString()
		};
	}
	return {
		ok: false,
		kind: "expired",
		until: null
	};
}
function upiLink(amount, note) {
	return `upi://pay?${new URLSearchParams({
		pa: MERCHANT_VPA,
		pn: MERCHANT_NAME,
		am: String(amount),
		cu: "INR",
		tn: note
	}).toString()}`;
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
function moonElements(jd) {
	const T = (jd - 2451545) / 36525;
	return {
		Lp: 218.3164477 + 481267.88123421 * T - .0015786 * T * T,
		D: 297.8501921 + 445267.1114034 * T - .0018819 * T * T,
		M: 357.5291092 + 35999.0502909 * T - 1536e-7 * T * T,
		Mp: 134.9633964 + 477198.8675055 * T + .0087414 * T * T,
		F: 93.272095 + 483202.0175233 * T - .0036539 * T * T
	};
}
/** Tropical lunar longitude (degrees), truncated ELP. */
function moonLongitude(jd) {
	const { Lp, D, M, Mp, F } = moonElements(jd);
	const d = deg2rad;
	return norm360$1(Lp + 6.288774 * Math.sin(d(Mp)) + 1.274027 * Math.sin(d(2 * D - Mp)) + .658314 * Math.sin(d(2 * D)) + .213618 * Math.sin(d(2 * Mp)) - .185116 * Math.sin(d(M)) - .114332 * Math.sin(d(2 * F)) + .058793 * Math.sin(d(2 * D - 2 * Mp)) + .057066 * Math.sin(d(2 * D - M - Mp)) + .053322 * Math.sin(d(2 * D + Mp)) + .045758 * Math.sin(d(2 * D - M)) - .040923 * Math.sin(d(M - Mp)) - .03472 * Math.sin(d(D)) - .030465 * Math.sin(d(M + Mp)));
}
function moonLatitude(jd) {
	const { D, Mp, F } = moonElements(jd);
	const r = deg2rad;
	return 5.128189 * Math.sin(r(F)) + .280606 * Math.sin(r(Mp + F)) + .277693 * Math.sin(r(Mp - F)) + .173238 * Math.sin(r(2 * D - F)) + .055413 * Math.sin(r(2 * D + F - Mp)) + .046272 * Math.sin(r(2 * D - F - Mp)) + .032573 * Math.sin(r(2 * D + F)) + .017198 * Math.sin(r(2 * Mp + F));
}
function moonParallax(jd) {
	const { D, Mp } = moonElements(jd);
	const r = deg2rad;
	return .950724 + .051818 * Math.cos(r(Mp)) + .009531 * Math.cos(r(2 * D - Mp)) + .007843 * Math.cos(r(2 * D)) + .002824 * Math.cos(r(2 * Mp));
}
function equatorial(lonDeg, latDeg, jd) {
	const eps = deg2rad(23.439291 - .0130042 * ((jd - 2451545) / 36525));
	const lon = deg2rad(lonDeg);
	const lat = deg2rad(latDeg);
	const dec = Math.asin(Math.sin(lat) * Math.cos(eps) + Math.cos(lat) * Math.sin(eps) * Math.sin(lon));
	const ra = Math.atan2(Math.sin(lon) * Math.cos(eps) - Math.tan(lat) * Math.sin(eps), Math.cos(lon));
	return {
		ra: ra < 0 ? ra + 2 * Math.PI : ra,
		dec
	};
}
function altitudeExcess(jd, lat, lon) {
	const { ra, dec } = equatorial(moonLongitude(jd), moonLatitude(jd), jd);
	const H = deg2rad(norm360$1(norm360$1(280.46061837 + 360.98564736629 * (jd - 2451545)) + lon)) - ra;
	const latR = deg2rad(lat);
	return (Math.asin(Math.sin(latR) * Math.sin(dec) + Math.cos(latR) * Math.cos(dec) * Math.cos(H)) - deg2rad(.7275 * moonParallax(jd) - .5667)) * (180 / Math.PI);
}
function jdAtLocalMinutes(y, m, d, minutes, tz) {
	const utcMs = Date.UTC(y, m, d, 0, 0, 0) + minutes * 60 * 1e3 - tz * 3600 * 1e3;
	return toJulianDay(new Date(utcMs));
}
/** Moonrise and moonset on the civil date. Either can be absent. */
function moonRiseSet(dateLocal, lat, lon, tzOffsetHours) {
	const y = dateLocal.getFullYear();
	const m = dateLocal.getMonth();
	const d = dateLocal.getDate();
	const excess = (min) => altitudeExcess(jdAtLocalMinutes(y, m, d, min, tzOffsetHours), lat, lon);
	const cross = (rising) => {
		const step = 10;
		for (let t = 0; t < 1440; t += step) {
			const a = excess(t);
			const b = excess(Math.min(t + step, 1439));
			if (!(rising ? a <= 0 && b > 0 : a >= 0 && b < 0)) continue;
			let lo = t;
			let hi = Math.min(t + step, 1439);
			while (hi - lo > 1) {
				const mid = lo + hi >> 1;
				const e = excess(mid);
				if (rising ? e <= 0 : e >= 0) lo = mid;
				else hi = mid;
			}
			const when = new Date(y, m, d, 0, 0, 0);
			when.setMinutes(hi);
			return when;
		}
		return null;
	};
	return {
		moonrise: cross(true),
		moonset: cross(false)
	};
}
/** Lahiri ayanamsa (degrees). */
function lahiriAyanamsa(jd) {
	return 23.852931 + .013956 * ((jd - 2451545) / 36525 * 100);
}
function sidereal(tropical, jd) {
	return norm360$1(tropical - lahiriAyanamsa(jd));
}
/** Mean-element tropical longitude, then Lahiri. Enough for gochar house, not for a degree claim. */
var PLANET_MEAN = {
	Mercury: [
		252.250906,
		4.09233445,
		77.456119,
		.205636
	],
	Venus: [
		181.979801,
		1.60213034,
		131.563703,
		.006773
	],
	Mars: [
		355.433,
		.52402068,
		336.04084,
		.0934
	],
	Jupiter: [
		34.351519,
		.08308529,
		14.331206,
		.048498
	],
	Saturn: [
		50.077444,
		.03344414,
		93.057237,
		.055546
	]
};
function planetSidereal(name, jd) {
	const row = PLANET_MEAN[name];
	if (!row) return sidereal(sunLongitude(jd), jd);
	const [L0, rate, peri, e] = row;
	const L = norm360$1(L0 + rate * (jd - 2451545));
	const M = (L - peri) * Math.PI / 180;
	return sidereal(norm360$1(L + 2 * e * 180 / Math.PI * Math.sin(M)), jd);
}
/** Approximate local sunrise/sunset for a city (upper limb, refraction). */
function sunRiseSet(dateLocal, lat, lon, tzOffsetHours) {
	const utcNoonMs = Date.UTC(dateLocal.getFullYear(), dateLocal.getMonth(), dateLocal.getDate(), 12, 0, 0) - tzOffsetHours * 3600 * 1e3;
	const jd = toJulianDay(new Date(utcNoonMs));
	const T = (jd - 2451545) / 36525;
	const lonSun = sunLongitude(jd);
	const eps = 23.439291 - .0130042 * T;
	const lam = deg2rad(lonSun);
	const epsR = deg2rad(eps);
	const decl = Math.asin(Math.sin(epsR) * Math.sin(lam));
	let ra = Math.atan2(Math.cos(epsR) * Math.sin(lam), Math.cos(lam)) * 180 / Math.PI;
	if (ra < 0) ra += 360;
	let eot = norm360$1(280.46646 + 36000.76983 * T + 3032e-7 * T * T) - ra;
	if (eot > 180) eot -= 360;
	if (eot < -180) eot += 360;
	const solarNoonMin = 720 + 4 * (tzOffsetHours * 15 - lon) - 4 * eot;
	const latR = deg2rad(lat);
	const cosH = (Math.cos(deg2rad(90.833)) - Math.sin(latR) * Math.sin(decl)) / (Math.cos(latR) * Math.cos(decl));
	const half = Math.acos(Math.min(1, Math.max(-1, cosH))) * 180 / Math.PI * 4;
	const y = dateLocal.getFullYear();
	const m = dateLocal.getMonth();
	const d = dateLocal.getDate();
	const sunrise = new Date(y, m, d, 0, 0, 0);
	sunrise.setMinutes(Math.round(solarNoonMin - half));
	const sunset = new Date(y, m, d, 0, 0, 0);
	sunset.setMinutes(Math.round(solarNoonMin + half));
	return {
		sunrise,
		sunset
	};
}
function localToUtc(local, tzOffsetHours) {
	const wall = Date.UTC(local.getFullYear(), local.getMonth(), local.getDate(), local.getHours(), local.getMinutes(), local.getSeconds());
	return /* @__PURE__ */ new Date(wall - tzOffsetHours * 3600 * 1e3);
}
/** Sidereal ascendant (Lahiri). Used for muhurta lagna, not a full horoscope. */
function ascendantSidereal(local, lat, lon, tzOffsetHours) {
	const jd = toJulianDay(localToUtc(local, tzOffsetHours));
	const T = (jd - 2451545) / 36525;
	let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545) + 387933e-9 * T * T;
	gmst = (gmst % 360 + 360) % 360;
	const ramc = ((gmst + lon) % 360 + 360) % 360;
	const eps = 23.439291 - .0130042 * T;
	const r = deg2rad;
	const y = Math.cos(r(ramc));
	const x = -(Math.sin(r(ramc)) * Math.cos(r(eps)) + Math.tan(r(lat)) * Math.sin(r(eps)));
	let trop = Math.atan2(y, x) * 180 / Math.PI;
	if (trop < 0) trop += 360;
	return sidereal(trop, jd);
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
	"Priti",
	"Ayushman",
	"Saubhagya",
	"Shobhana",
	"Sukarma",
	"Dhriti",
	"Vriddhi",
	"Dhruva",
	"Harshana",
	"Siddhi",
	"Shiva",
	"Siddha",
	"Sadhya",
	"Shubha",
	"Shukla",
	"Brahma",
	"Indra"
]);
var ASHUBH_YOGAS = /* @__PURE__ */ new Set([
	"Vishkambha",
	"Atiganda",
	"Shula",
	"Ganda",
	"Vyaghata",
	"Vajra",
	"Vyatipata",
	"Variyan",
	"Parigha",
	"Vaidhriti"
]);
/** All 27 nitya yogas. Tyajya closes a start. Shubh is kept ahead of a merely open hour. */
var YOGA_FRUIT = {
	Vishkambha: "obstacle at the first step",
	Priti: "affection and agreement",
	Ayushman: "the work lives long",
	Saubhagya: "fortune",
	Shobhana: "splendour",
	Atiganda: "excess and accident",
	Sukarma: "a clean act",
	Dhriti: "it holds",
	Shula: "a sharp cut",
	Ganda: "a knot in the work",
	Vriddhi: "increase",
	Dhruva: "what should stay fixed",
	Vyaghata: "a beating, a loss",
	Harshana: "joy",
	Vajra: "hard and brittle",
	Siddhi: "the work completes",
	Vyatipata: "calamity",
	Variyan: "leave this hour out",
	Parigha: "a bar across the door",
	Shiva: "a calm, auspicious hour",
	Siddha: "already accomplished",
	Sadhya: "it can be achieved",
	Shubha: "plain good",
	Shukla: "bright",
	Brahma: "fit for a vow or study",
	Indra: "authority",
	Vaidhriti: "separation"
};
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
	const avritti = count <= 9 ? 1 : count <= 18 ? 2 : 3;
	if ((remainder === 3 || remainder === 5 || remainder === 7) && avritti === 1) score -= 8;
	if ((remainder === 3 || remainder === 5 || remainder === 7) && avritti === 3) score += 6;
	return {
		number: remainder,
		name: TARA_NAMES[remainder],
		isShubh,
		score,
		count,
		avritti
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
	const horaIndex = Math.floor(hora.hours);
	const horaStart = new Date(sunrise.getTime() + horaIndex * 36e5);
	const horaEnd = new Date(horaStart.getTime() + 36e5);
	const halfStart = new Date(horaStart.getTime() + (half === 1 ? 0 : 18e5));
	const halfEnd = new Date(halfStart.getTime() + 18e5);
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
		horaWindow: {
			start: horaStart.toISOString(),
			end: horaEnd.toISOString(),
			halfStart: halfStart.toISOString(),
			halfEnd: halfEnd.toISOString()
		},
		kpSub: (() => {
			const subMs = 36e5 / 7;
			const elapsed = local.getTime() - horaStart.getTime();
			const idx = Math.min(6, Math.max(0, Math.floor(elapsed / subMs)));
			return {
				lord: kpSubs(hora.lord)[idx] ?? hora.lord,
				index: idx + 1,
				from: new Date(horaStart.getTime() + idx * subMs).toISOString(),
				until: new Date(horaStart.getTime() + (idx + 1) * subMs).toISOString()
			};
		})(),
		golden: {
			amritSiddhi: AMRIT_SIDDHI[varaName] === nak.name,
			sarvarthaSiddhi: (SARVARTHA_SIDDHI[varaName] ?? []).includes(nak.name)
		}
	};
}
/** Limbs from this sunrise to the next. A tithi that ended before sunrise belongs to yesterday. */
function dayLimbs(local, lat, lon, tzOffset) {
	const y = local.getFullYear();
	const m = local.getMonth();
	const d = local.getDate();
	const noon = new Date(y, m, d, 12, 0, 0);
	const rise = new Date(getPanchang(noon, lat, lon, tzOffset).sunrise);
	const nextNoon = new Date(y, m, d + 1, 12, 0, 0);
	const nextRise = new Date(getPanchang(nextNoon, lat, lon, tzOffset).sunrise);
	const startMs = rise.getTime();
	const spanMin = Math.max(1, Math.round((nextRise.getTime() - startMs) / 6e4));
	const at = (min) => getPanchang(new Date(startMs + min * 6e4), lat, lon, tzOffset);
	const stamp = (min) => new Date(startMs + min * 6e4).toISOString();
	const spans = (pick) => {
		const parts = [];
		let cursor = 0;
		let name = pick(at(0));
		while (cursor < spanMin) {
			if (pick(at(spanMin - 1)) === name) {
				parts.push({
					name,
					from: stamp(cursor),
					until: stamp(spanMin)
				});
				break;
			}
			let lo = cursor;
			let hi = spanMin;
			while (hi - lo > 1) {
				const mid = lo + hi >> 1;
				if (pick(at(mid)) === name) lo = mid;
				else hi = mid;
			}
			parts.push({
				name,
				from: stamp(cursor),
				until: stamp(hi)
			});
			cursor = hi;
			name = pick(at(Math.min(hi, spanMin - 1)));
		}
		return parts;
	};
	return {
		sunrise: rise.toISOString(),
		nextSunrise: nextRise.toISOString(),
		limbs: [
			{
				limb: "Tithi",
				parts: spans((p) => `${p.tithi.name} · ${p.tithi.paksha}`)
			},
			{
				limb: "Nakshatra",
				parts: spans((p) => p.nakshatra.name)
			},
			{
				limb: "Yoga",
				parts: spans((p) => p.yoga.name)
			},
			{
				limb: "Karana",
				parts: spans((p) => p.karana.name)
			}
		]
	};
}
var CHALDEAN = [
	"Sun",
	"Venus",
	"Mercury",
	"Moon",
	"Saturn",
	"Jupiter",
	"Mars"
];
function kpSubs(horaLord) {
	const i = CHALDEAN.indexOf(horaLord);
	if (i < 0) return [horaLord];
	return Array.from({ length: 7 }, (_, k) => CHALDEAN[(i + k) % 7]);
}
/** Twenty-four horas from this sunrise. Each hora is split into mukhya/uphora and 7 KP sub-parts. */
function dayHoras(sunriseIso, nextSunriseIso, vara) {
	const seq = HORA_SEQUENCE[vara] ?? HORA_SEQUENCE.Sunday;
	const start = new Date(sunriseIso).getTime();
	const end = new Date(nextSunriseIso).getTime();
	const out = [];
	for (let i = 0; i < 24; i++) {
		const from = start + i * 36e5;
		if (from >= end) break;
		const until = Math.min(from + 36e5, end);
		const lord = seq[i % 7];
		const duration = until - from;
		const subMs = duration / 7;
		const subs = kpSubs(lord).map((subLord, k) => ({
			lord: subLord,
			from: new Date(from + k * subMs).toISOString(),
			until: new Date(from + (k + 1) * subMs).toISOString()
		}));
		out.push({
			lord,
			from: new Date(from).toISOString(),
			half: new Date(from + duration / 2).toISOString(),
			until: new Date(until).toISOString(),
			subs
		});
	}
	return out;
}
/** Amanta month from the nakshatra of the nearest Purnima. */
var MONTH_BY_NAKSHATRA = [
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
	"Ashwina"
];
function vikramSamvat(local) {
	const month = local.getMonth();
	const day = local.getDate();
	const beforeChaitra = month < 3 || month === 3 && day < 14;
	return local.getFullYear() + (beforeChaitra ? 56 : 57);
}
/** Sunrise identity, lunar month, and moonrise for this city. */
function placeDay(local, lat, lon, tzOffset) {
	const y = local.getFullYear();
	const m = local.getMonth();
	const d = local.getDate();
	const noon = new Date(y, m, d, 12, 0, 0);
	const day = getPanchang(noon, lat, lon, tzOffset);
	const rise = new Date(day.sunrise);
	const atSunrise = getPanchang(rise, lat, lon, tzOffset);
	const dir = atSunrise.tithi.number <= 15 ? 1 : -1;
	let nakIndex = atSunrise.nakshatra.index;
	if (atSunrise.tithi.number !== 15) for (let step = 1; step <= 384; step++) {
		const q = getPanchang(new Date(rise.getTime() + dir * step * 3600 * 1e3), lat, lon, tzOffset);
		if (q.tithi.number === 15) {
			nakIndex = q.nakshatra.index;
			break;
		}
	}
	const moon = moonRiseSet(noon, lat, lon, tzOffset);
	const setAtDawn = moon.moonset != null && moon.moonset.getTime() <= rise.getTime() + 6e5;
	return {
		tithiDay: atSunrise.tithi.number <= 15 ? atSunrise.tithi.number : atSunrise.tithi.number - 15,
		tithiName: atSunrise.tithi.name,
		paksha: atSunrise.tithi.paksha,
		month: MONTH_BY_NAKSHATRA[nakIndex] ?? "Ashwina",
		samvat: vikramSamvat(noon),
		system: "Amanta",
		moonrise: moon.moonrise ? moon.moonrise.toISOString() : null,
		moonset: moon.moonset && !setAtDawn ? moon.moonset.toISOString() : null
	};
}
var DIGBAL_HOUSE = {
	Jupiter: 1,
	Mercury: 1,
	Moon: 4,
	Venus: 4,
	Saturn: 7,
	Sun: 10,
	Mars: 10
};
function getBirthChart(dobLocal, lat, lon, tzOffset) {
	const p = getPanchang(dobLocal, lat, lon, tzOffset);
	const lagnaLon = ascendantSidereal(dobLocal, lat, lon, tzOffset);
	const lagnaIndex = Math.floor(norm360(lagnaLon) / 30) % 12;
	const moonIndex = p.moonRashi.index;
	const jd = toJulianDay(localToUtc(dobLocal, tzOffset));
	const grahas = [
		["Sun", sidereal(sunLongitude(jd), jd)],
		["Moon", p.moonSid],
		["Mars", planetSidereal("Mars", jd)],
		["Mercury", planetSidereal("Mercury", jd)],
		["Jupiter", planetSidereal("Jupiter", jd)],
		["Venus", planetSidereal("Venus", jd)],
		["Saturn", planetSidereal("Saturn", jd)]
	].map(([name, lon]) => {
		const nk = nakshatraFromLon(lon);
		const rashiIndex = Math.floor(norm360(lon) / 30) % 12;
		const houseFromLagna = (rashiIndex - lagnaIndex + 12) % 12 + 1;
		const houseFromMoon = (rashiIndex - moonIndex + 12) % 12 + 1;
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
			digbal: DIGBAL_HOUSE[name] === houseFromLagna
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
		birth: dobLocal
	};
}
function dashaFor(chart, at) {
	return vimshottariAt(chart.birth, chart.moonSid, at);
}
var STORAGE_KEY = "taranidhi-profile";
function readStoredProfile() {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		return JSON.parse(raw).state?.profile ?? null;
	} catch {
		return null;
	}
}
function withId(p) {
	return {
		...p,
		id: p.id || "primary"
	};
}
function writeStored(state) {
	if (typeof window === "undefined") return;
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		const parsed = raw ? JSON.parse(raw) : {};
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
			...parsed,
			state: {
				...parsed.state ?? {},
				...state
			},
			version: parsed.version ?? 0
		}));
	} catch {}
}
var useProfile = create()(persist((set, get) => ({
	profile: null,
	profiles: [],
	hydrated: false,
	setHydrated: (v) => set({ hydrated: v }),
	setProfile: (p) => {
		const id = p.id || (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `p-${Date.now()}`);
		const next = {
			...p,
			id
		};
		const profiles = get().profiles;
		const exists = profiles.some((x) => x.id === id);
		if (!exists && profiles.length >= 3) return false;
		const list = exists ? profiles.map((x) => x.id === id ? next : x) : [...profiles, next];
		writeStored({
			profile: next,
			profiles: list
		});
		set({
			profile: next,
			profiles: list
		});
		useBilling.getState().ensureDemo();
		return true;
	},
	switchProfile: (id) => {
		const next = get().profiles.find((x) => x.id === id);
		if (!next) return;
		writeStored({
			profile: next,
			profiles: get().profiles
		});
		set({ profile: next });
	},
	removeProfile: (id) => {
		const list = get().profiles.filter((x) => x.id !== id);
		const active = get().profile?.id === id ? list[0] ?? null : get().profile;
		writeStored({
			profile: active,
			profiles: list
		});
		set({
			profiles: list,
			profile: active
		});
	},
	clearProfile: () => {
		writeStored({
			profile: null,
			profiles: []
		});
		set({
			profile: null,
			profiles: []
		});
	}
}), {
	name: STORAGE_KEY,
	partialize: (s) => ({
		profile: s.profile,
		profiles: s.profiles
	}),
	merge: (persisted, current) => {
		const raw = persisted ?? {};
		let profiles = Array.isArray(raw.profiles) ? raw.profiles.map(withId) : [];
		const legacy = raw.profile ?? (profiles.length ? null : readStoredProfile());
		if (!profiles.length && legacy) profiles = [withId(legacy)];
		if (current.profile) {
			const live = withId(current.profile);
			if (!profiles.some((x) => x.id === live.id) && profiles.length < 3) profiles = [...profiles, live];
		}
		const active = current.profile && profiles.find((x) => x.id === current.profile?.id) || profiles[0] || null;
		return {
			...current,
			profiles,
			profile: active,
			hydrated: true
		};
	},
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
export { planetSidereal as C, upiLink as D, toJulianDay as E, useBilling as O, planAccess as S, sunLongitude as T, dayLimbs as _, NAKSHATRA_LORDS as a, localToUtc as b, YEARLY_LIST_INR as c, calculateChandraBala as d, calculateTaraBala as f, dayHoras as g, dashaFor as h, NAKSHATRA_GROUPS as i, useProfile as k, YOGA_FRUIT as l, cn as m, MERCHANT_VPA as n, RASHIS as o, chartFromProfile as p, NAKSHATRAS as r, YEARLY_INR as s, ASHUBH_YOGAS as t, ascendantSidereal as u, getBirthChart as v, sidereal as w, placeDay as x, getPanchang as y };
