import { i as __toESM } from "../_runtime.mjs";
import { J as require_jsx_runtime, Y as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as dashaFor, n as calculateTaraBala, o as getPanchang, r as chartFromProfile, s as useProfile, t as calculateChandraBala } from "./store-DwrWbSZO.mjs";
import { t as Card } from "./card-A4VxBNjG.mjs";
import { t as Badge } from "./badge-DPi3ZU98.mjs";
import { a as todayISODate, n as formatTime } from "./format-lQcYgVke.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/panchang-DYN9ULFd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PanchangPage() {
	const profile = useProfile((s) => s.profile);
	const [date, setDate] = (0, import_react.useState)(todayISODate());
	const data = (0, import_react.useMemo)(() => {
		if (!profile) return null;
		const local = /* @__PURE__ */ new Date(date + "T12:00:00");
		const p = getPanchang(local, profile.lat, profile.lon, profile.tz);
		const chart = chartFromProfile(profile);
		return {
			p,
			tara: calculateTaraBala(chart.janmaNakshatra.index, p.nakshatra.index),
			chandra: calculateChandraBala(chart.janmaRashi.index, p.moonRashi.index),
			chart,
			dasha: dashaFor(chart, local)
		};
	}, [date, profile]);
	if (!profile || !data) return null;
	const { p, tara, chandra, chart, dasha } = data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl",
					children: "Daily panchang"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: ["Layered with your natal ", chart.janmaNakshatra.name]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "date",
					value: date,
					onChange: (e) => setDate(e.target.value),
					className: "h-11 rounded-md border border-line bg-surface px-3"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "rounded-xl p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Tara Bala"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-2xl",
							children: tara.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: "mt-2",
							tone: tara.isShubh ? "good" : "bad",
							children: tara.isShubh ? "Favourable" : "Caution"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "rounded-xl p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Chandra Bala"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-display text-2xl",
							children: [chandra.distance, "th"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: "mt-2",
							tone: chandra.isShubh ? "good" : "bad",
							children: chandra.isShubh ? "Moon strong" : "Dusthana Moon"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Golden windows"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						tone: p.golden.amritSiddhi ? "good" : "neutral",
						children: ["Amrit Siddhi ", p.golden.amritSiddhi ? "yes" : "no"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						tone: p.golden.sarvarthaSiddhi ? "good" : "neutral",
						children: ["Sarvartha Siddhi ", p.golden.sarvarthaSiddhi ? "yes" : "no"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-4 divide-y divide-line",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Mahadasha",
							v: `${dasha.maha} / ${dasha.antar}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Hora",
							v: `${p.horaLord} · ${p.uphora.label}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Tatva",
							v: p.moonRashi.tatva
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Guna",
							v: p.nakshatra.guna
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Tithi purushartha",
							v: p.tithi.purushartha
						})
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl",
				children: "Five limbs"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-4 divide-y divide-line",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Tithi",
						v: `${p.tithi.name} (${p.tithi.paksha}) · ${p.tithi.elapsedPct}% elapsed`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Vara",
						v: `${p.vara.name} · ${p.vara.lord}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Nakshatra",
						v: `${p.nakshatra.name} pada ${p.nakshatra.pada} · ${p.nakshatra.lord} · ${p.nakshatra.group}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Yoga",
						v: p.yoga.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Karana",
						v: p.karana.isVishti ? `${p.karana.name} (Vishti — avoid)` : p.karana.name
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl",
				children: "Day markers"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-4 divide-y divide-line",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Sunrise",
						v: formatTime(p.sunrise)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Sunset",
						v: formatTime(p.sunset)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Abhijit",
						v: `${formatTime(p.abhijit.start)} – ${formatTime(p.abhijit.end)}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Rahu Kaal",
						v: `${formatTime(p.rahuKaal.start)} – ${formatTime(p.rahuKaal.end)}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Moon rashi",
						v: p.moonRashi.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Sun rashi",
						v: p.sunRashi.name
					})
				]
			})] })
		]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between gap-4 py-3 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "text-right",
			children: v
		})]
	});
}
//#endregion
export { PanchangPage as component };
