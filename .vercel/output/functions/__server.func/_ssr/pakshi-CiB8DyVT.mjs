import { i as __toESM } from "../_runtime.mjs";
import { J as require_jsx_runtime, Y as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { k as useProfile, p as chartFromProfile, y as getPanchang } from "./store-BvmsIaJ0.mjs";
import { t as Card } from "./card-DyXBw17q.mjs";
import { s as useT } from "./router-dY8SY1_h.mjs";
import { n as formatTime } from "./format-lQcYgVke.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pakshi-CiB8DyVT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ACTS = [
	"Eating",
	"Walking",
	"Ruling",
	"Sleeping",
	"Dying"
];
var BIRD_TA = {
	Vulture: "வல்லூறு",
	Owl: "ஆந்தை",
	Crow: "காகம்",
	Cock: "கோழி",
	Peacock: "மயில்"
};
var ACT_TA = {
	Eating: "ஊண்",
	Walking: "நடை",
	Ruling: "அரசு",
	Sleeping: "துயில்",
	Dying: "சாவு"
};
/** Shukla: 1-5 Vulture, 6-11 Owl, 12-16 Crow, 17-21 Cock, 22-27 Peacock. Krishna reverses the ends. */
function tamilBirthBird(nakshatraIndex, birthShukla) {
	const i = (nakshatraIndex % 27 + 27) % 27;
	if (birthShukla) {
		if (i < 5) return "Vulture";
		if (i < 11) return "Owl";
		if (i < 16) return "Crow";
		if (i < 21) return "Cock";
		return "Peacock";
	}
	if (i < 5) return "Peacock";
	if (i < 11) return "Cock";
	if (i < 16) return "Crow";
	if (i < 21) return "Owl";
	return "Vulture";
}
/** Sunday/Tuesday day order from Tamil Wikipedia. Night is a separate cycle. */
var SUN_TUE_DAY = {
	Vulture: [
		"Eating",
		"Walking",
		"Ruling",
		"Sleeping",
		"Dying"
	],
	Owl: [
		"Walking",
		"Ruling",
		"Sleeping",
		"Dying",
		"Eating"
	],
	Crow: [
		"Ruling",
		"Sleeping",
		"Dying",
		"Eating",
		"Walking"
	],
	Cock: [
		"Sleeping",
		"Dying",
		"Eating",
		"Walking",
		"Ruling"
	],
	Peacock: [
		"Dying",
		"Eating",
		"Walking",
		"Ruling",
		"Sleeping"
	]
};
var SUN_TUE_NIGHT = {
	Vulture: [
		"Dying",
		"Walking",
		"Sleeping",
		"Eating",
		"Ruling"
	],
	Owl: [
		"Ruling",
		"Dying",
		"Walking",
		"Sleeping",
		"Eating"
	],
	Crow: [
		"Eating",
		"Ruling",
		"Dying",
		"Walking",
		"Sleeping"
	],
	Cock: [
		"Sleeping",
		"Eating",
		"Ruling",
		"Dying",
		"Walking"
	],
	Peacock: [
		"Walking",
		"Sleeping",
		"Eating",
		"Ruling",
		"Dying"
	]
};
function rotate(order, by) {
	const n = (by % 5 + 5) % 5;
	return order.slice(n).concat(order.slice(0, n));
}
/** Weekday groups used in Tamil tables. 0 Sunday. */
function weekdayShift(day) {
	if (day === 0 || day === 2) return 0;
	if (day === 1 || day === 3) return 1;
	if (day === 4) return 2;
	if (day === 5) return 3;
	return 4;
}
function yamaOrder(bird, weekday, night) {
	return rotate(night ? SUN_TUE_NIGHT[bird] : SUN_TUE_DAY[bird], weekdayShift(weekday));
}
function iso(d) {
	return d.toISOString();
}
function slice(from, until, parts) {
	const step = (until.getTime() - from.getTime()) / parts;
	return Array.from({ length: parts }, (_, i) => ({
		from: new Date(from.getTime() + i * step),
		until: new Date(from.getTime() + (i + 1) * step)
	}));
}
function windowsOf15(from, until) {
	const out = [];
	let t = from.getTime();
	const end = until.getTime();
	while (t + 9e5 <= end + 1e3) {
		const next = Math.min(t + 9e5, end);
		if (next - t >= 6e5) out.push({
			from: iso(new Date(t)),
			until: iso(new Date(next))
		});
		t = next;
		if (t >= end) break;
	}
	return out;
}
function tamilPakshiDay(sunrise, sunset, nextSunrise, janmaNakshatra, birthShukla, weekday) {
	const bird = tamilBirthBird(janmaNakshatra, birthShukla);
	const dayOrder = yamaOrder(bird, weekday, false);
	const nightOrder = yamaOrder(bird, weekday, true);
	const dayParts = slice(sunrise, sunset, 5);
	const nightParts = slice(sunset, nextSunrise, 5);
	const slots = [];
	const push = (half, i, act, from, until) => {
		const subs = slice(from, until, 5).map((s, k) => {
			const subAct = ACTS[(ACTS.indexOf(act) + k) % 5];
			const minutes = Math.round((s.until.getTime() - s.from.getTime()) / 6e4);
			return {
				index: k + 1,
				act: subAct,
				from: iso(s.from),
				until: iso(s.until),
				minutes,
				auspicious: subAct === "Ruling" || subAct === "Eating"
			};
		});
		const good = act === "Ruling" || act === "Eating";
		slots.push({
			yama: i + 1,
			half,
			act,
			from: iso(from),
			until: iso(until),
			apaharams: subs,
			windows15: good ? windowsOf15(from, until) : []
		});
	};
	dayParts.forEach((p, i) => push("Day", i, dayOrder[i], p.from, p.until));
	nightParts.forEach((p, i) => push("Night", i, nightOrder[i], p.from, p.until));
	const goodWindows = slots.flatMap((s) => {
		const out = [];
		if (s.act === "Ruling" || s.act === "Eating") {
			out.push({
				from: s.from,
				until: s.until,
				act: s.act,
				kind: "yama"
			});
			s.windows15.forEach((w) => out.push({
				...w,
				act: s.act,
				kind: "15min"
			}));
		}
		return out;
	});
	return {
		bird,
		birdTa: BIRD_TA[bird],
		slots,
		goodWindows
	};
}
var ACT_HI = {
	Ruling: "राज",
	Eating: "भोजन",
	Walking: "गमन",
	Sleeping: "निद्रा",
	Dying: "मृत्यु"
};
function tone(act) {
	if (act === "Ruling" || act === "Eating") return "text-emerald-700";
	if (act === "Walking") return "text-amber-700";
	return "text-rose-700";
}
function PakshiPage() {
	const profile = useProfile((s) => s.profile);
	const { lang } = useT();
	const [open, setOpen] = (0, import_react.useState)(0);
	const chart = profile?.date ? chartFromProfile(profile) : null;
	const p = (0, import_react.useMemo)(() => profile ? getPanchang(/* @__PURE__ */ new Date(), profile.lat, profile.lon, profile.tz) : null, [profile]);
	const day = (0, import_react.useMemo)(() => {
		if (!chart || !profile || !p) return null;
		const birthShukla = getPanchang(chart.birth, profile.lat, profile.lon, profile.tz).tithi.paksha === "Shukla";
		const sunrise = new Date(p.sunrise);
		return tamilPakshiDay(sunrise, new Date(p.sunset), new Date(sunrise.getTime() + 864e5), chart.janmaNakshatra.index, birthShukla, sunrise.getDay());
	}, [
		chart,
		p,
		profile
	]);
	if (!chart || !day) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "जन्म विवरण सहेजें। पक्षी जन्म नक्षत्र और पक्ष से तय होता है।"
	});
	const good15 = day.goodWindows.filter((w) => w.kind === "15min");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.16em] text-muted",
					children: "Tamil Panchapakshi"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl",
					children: "पंच पक्षी"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						"आपका पक्षी ",
						day.bird,
						" (",
						day.birdTa,
						")। राज और भोजन में 15 मिनट की शुभ खिड़कियाँ।"
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					children: "जन्म नक्षत्र से पक्षी। दिन और रात सूर्योदय-सूर्यास्त से पाँच जाम। हर जाम में पाँच अपहार। रवि/मंगल क्रम तमिल विकिपीडिया से। अन्य वार उसी क्रम का घुमाव — यह एक स्कूल है, एकमात्र पाठ नहीं।"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-medium",
					children: "15 मिनट की शुभ खिड़कियाँ"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2 sm:grid-cols-2",
					children: good15.slice(0, 12).map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: tone(w.act),
							children: lang === "hi" ? ACT_HI[w.act] : w.act
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-2 text-muted",
							children: [
								formatTime(w.from),
								" – ",
								formatTime(w.until)
							]
						})]
					}, i))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-medium",
					children: "दस जाम"
				}), day.slots.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "flex w-full items-center justify-between text-left",
						onClick: () => setOpen(open === i ? null : i),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							s.half === "Day" ? "दिन" : "रात",
							" जाम ",
							s.yama,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `ml-2 ${tone(s.act)}`,
								children: [
									lang === "hi" ? ACT_HI[s.act] : s.act,
									" (",
									ACT_TA[s.act],
									")"
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted",
							children: [
								formatTime(s.from),
								" – ",
								formatTime(s.until)
							]
						})]
					}), open === i && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 space-y-1 text-sm",
						children: s.apaharams.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: a.auspicious ? "text-emerald-700" : "text-muted",
								children: [
									"अपहार ",
									a.index,
									": ",
									lang === "hi" ? ACT_HI[a.act] : a.act
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted",
								children: [
									formatTime(a.from),
									" – ",
									formatTime(a.until),
									" (",
									a.minutes,
									" मि)"
								]
							})]
						}, a.index))
					})]
				}, i))]
			})
		]
	});
}
//#endregion
export { PakshiPage as component };
