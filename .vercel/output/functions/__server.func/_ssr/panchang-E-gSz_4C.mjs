import { i as __toESM } from "../_runtime.mjs";
import { J as require_jsx_runtime, Y as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as dayLimbs, a as NAKSHATRA_LORDS, d as calculateChandraBala, f as calculateTaraBala, g as dayHoras, h as dashaFor, k as useProfile, p as chartFromProfile, r as NAKSHATRAS, x as placeDay, y as getPanchang } from "./store-BvmsIaJ0.mjs";
import { t as Card } from "./card-DyXBw17q.mjs";
import { t as dayMarks } from "./sutra-CaMTmmzz.mjs";
import { s as useT } from "./router-dY8SY1_h.mjs";
import { t as Badge } from "./badge-GqGEIsUx.mjs";
import { a as todayISODate, n as formatTime } from "./format-lQcYgVke.mjs";
import { n as localName, t as localMonth } from "./names-DJ9Tb8ex.mjs";
import { t as limbEffect } from "./effects-DSfr43SX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/panchang-E-gSz_4C.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PanchangPage() {
	const profile = useProfile((s) => s.profile);
	const { lang } = useT();
	const [date, setDate] = (0, import_react.useState)(todayISODate());
	const [tab, setTab] = (0, import_react.useState)("Tithi");
	const [open, setOpen] = (0, import_react.useState)(null);
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	const data = (0, import_react.useMemo)(() => {
		if (!profile) return null;
		const local = /* @__PURE__ */ new Date(date + "T12:00:00");
		const p = getPanchang(local, profile.lat, profile.lon, profile.tz);
		const span = dayLimbs(local, profile.lat, profile.lon, profile.tz);
		const horas = dayHoras(span.sunrise, span.nextSunrise, p.vara.name);
		const marks = dayMarks(span.sunrise, p.sunset, new Date(span.sunrise).getDay());
		const place = placeDay(local, profile.lat, profile.lon, profile.tz);
		const chart = chartFromProfile(profile);
		return {
			p,
			tara: calculateTaraBala(chart.janmaNakshatra.index, p.nakshatra.index),
			chandra: calculateChandraBala(chart.janmaRashi.index, p.moonRashi.index),
			chart,
			dasha: dashaFor(chart, local),
			span,
			horas,
			marks,
			place
		};
	}, [date, profile]);
	if (!profile || !data) return null;
	const { p, tara, chandra, dasha, span, horas, marks, place } = data;
	const tx = (en, hiText) => lang === "hi" ? hiText : en;
	const nm = (name) => localName(name, lang);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl",
					children: tx("Daily panchang", "आज का पंचांग")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						profile.city,
						" · ",
						place.tithiDay,
						" ",
						localMonth(place.month, lang),
						" · ",
						nm(place.paksha),
						" ",
						nm(place.tithiName)
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "date",
					value: date,
					onChange: (e) => setDate(e.target.value),
					className: "h-11 rounded-md border border-line bg-surface px-3"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl",
				children: tx("This place", "यह जगह")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-4 divide-y divide-line",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: tx("City", "शहर"),
						v: profile.city
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: tx("Lunar day", "चांद्र दिन"),
						v: `${place.tithiDay}, ${localMonth(place.month, lang)}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: tx("At sunrise", "सूर्योदय पर"),
						v: `${nm(place.paksha)} ${nm(place.tithiName)}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: tx("Samvat", "संवत्"),
						v: `${place.samvat} ${tx("Vikrama", "विक्रम")} · ${place.system}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: tx("Moonrise", "चंद्रोदय"),
						v: place.moonrise ? formatTime(place.moonrise) : tx("None", "नहीं")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: tx("Moonset", "चंद्रास्त"),
						v: place.moonset ? formatTime(place.moonset) : tx("No moonset", "चंद्रास्त नहीं")
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "rounded-xl p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: tx("Tara Bala", "तारा बल")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-2xl",
							children: nm(tara.name)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: "mt-2",
							tone: tara.isShubh ? "good" : "bad",
							children: tara.isShubh ? tx("Favourable", "शुभ") : tx("Caution", "सावधान")
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "rounded-xl p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: tx("Chandra Bala", "चंद्र बल")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-display text-2xl",
							children: [chandra.distance, tx("th", "वाँ")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: "mt-2",
							tone: chandra.isShubh ? "good" : "bad",
							children: chandra.isShubh ? tx("Moon strong", "चंद्र अनुकूल") : tx("Dusthana Moon", "चंद्र अष्टम")
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: tx("Golden windows", "सुनहरी खिड़की")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						tone: p.golden.amritSiddhi ? "good" : "neutral",
						children: [
							tx("Amrit Siddhi", "अमृत सिद्धि"),
							" ",
							p.golden.amritSiddhi ? tx("yes", "हाँ") : tx("no", "नहीं")
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						tone: p.golden.sarvarthaSiddhi ? "good" : "neutral",
						children: [
							tx("Sarvartha Siddhi", "सर्वार्थ सिद्धि"),
							" ",
							p.golden.sarvarthaSiddhi ? tx("yes", "हाँ") : tx("no", "नहीं")
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-4 divide-y divide-line",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: tx("Mahadasha", "महादशा"),
							v: `${nm(dasha.maha)} / ${nm(dasha.antar)}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: tx("1. Time", "1. समय"),
							v: `${nm(p.horaLord)} ${formatTime(p.horaWindow.start)}–${formatTime(p.horaWindow.end)}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: tx("2. Score", "2. स्कोर"),
							v: p.uphora.half === 1 ? `${tx("Mukhya adds", "मुख्य में जोड़")} ${formatTime(p.horaWindow.halfStart)}–${formatTime(p.horaWindow.halfEnd)}` : `${tx("Uphora is 10 less", "उपहोरा में 10 कम")} ${formatTime(p.horaWindow.halfStart)}–${formatTime(p.horaWindow.halfEnd)}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: tx("3. Effect", "3. प्रभाव"),
							v: p.uphora.half === 1 ? tx("Same planet, heavier in mukhya", "वही ग्रह, मुख्य में भारी") : tx("Same planet, lighter in uphora", "वही ग्रह, उपहोरा में हल्का")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: tx("Tatva", "तत्त्व"),
							v: nm(p.moonRashi.tatva)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: tx("Guna", "गुण"),
							v: nm(p.nakshatra.guna)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: tx("Tithi purushartha", "तिथि पुरुषार्थ"),
							v: nm(p.tithi.purushartha)
						})
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: lang === "hi" ? "पंचांग के अंग" : "Limbs"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: lang === "hi" ? "हर पट्टी पर शुरू और अंत का समय है। दबाएँ, प्रभाव खुल जाएगा।" : "Each row has a start and an end. Press it and the effect opens."
				}),
				tab === "Hora" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid gap-2 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-lg bg-surface-2 px-3 py-2 text-xs leading-relaxed",
							children: lang === "hi" ? "1. समय: होरा 60 मिनट। मुख्य पहले 30। उपहोरा अगले 30।" : "1. Time: hora is 60 min. Mukhya is the first 30. Uphora is the next 30."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-lg bg-surface-2 px-3 py-2 text-xs leading-relaxed",
							children: lang === "hi" ? "2. स्कोर: मुख्य पर जोड़। उपहोरा पर −10।" : "2. Score: mukhya adds. Uphora takes 10 off."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-lg bg-surface-2 px-3 py-2 text-xs leading-relaxed",
							children: lang === "hi" ? "3. प्रभाव: ग्रह वही। मुख्य भारी, उपहोरा हल्का।" : "3. Effect: same planet. Mukhya weighs more, uphora less."
						})
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "min-w-0 truncate text-sm font-medium",
						children: lang === "hi" ? TAB_HI[tab] : tab
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setMenuOpen((v) => !v),
						className: "min-h-9 shrink-0 rounded-full border border-line px-3 text-xs",
						children: menuOpen ? lang === "hi" ? "मेनू बंद" : "Close menu" : lang === "hi" ? "अंग खोलें" : "Open limbs"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: menuOpen ? "mt-3 grid min-w-0 gap-3 sm:grid-cols-[10.5rem_minmax(0,1fr)]" : "mt-3 min-w-0",
					children: [menuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "max-h-[28rem] space-y-0.5 overflow-y-auto rounded-lg border border-line p-1",
						children: TABS.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setTab(id);
								setOpen(null);
								if (typeof window !== "undefined" && window.innerWidth < 640) setMenuOpen(false);
							},
							className: tab === id ? "flex w-full rounded-md bg-ink px-3 py-2 text-left text-xs text-bg" : "flex w-full rounded-md px-3 py-2 text-left text-xs text-muted hover:bg-surface-2",
							children: lang === "hi" ? TAB_HI[id] : id
						}, id))
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-h-[28rem] min-w-0 divide-y divide-line overflow-y-auto",
						children: [rowsFor(tab, span, horas, p.vara.name, marks, p.abhijit).map((row) => {
							const id = `${tab}-${row.from}`;
							const on = open === id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setOpen(on ? null : id),
								className: "block w-full min-w-0 py-3 text-left",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex min-w-0 items-baseline justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "min-w-0 font-medium break-words",
											children: nm(row.name)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "shrink-0 text-xs tabular-nums text-muted",
											children: [
												formatTime(row.from),
												" – ",
												formatTime(row.until)
											]
										})]
									}),
									tab === "Hora" && row.half ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-1 grid gap-0.5 text-xs leading-relaxed text-muted",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												lang === "hi" ? "1 समय" : "1 Time",
												" ",
												formatTime(row.from),
												"–",
												formatTime(row.until)
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												lang === "hi" ? "2 स्कोर +" : "2 Score +",
												" ",
												lang === "hi" ? "मुख्य" : "Mukhya",
												" ",
												formatTime(row.from),
												"–",
												formatTime(row.half)
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												lang === "hi" ? "3 प्रभाव −" : "3 Effect −",
												" ",
												lang === "hi" ? "उपहोरा" : "Uphora",
												" ",
												formatTime(row.half),
												"–",
												formatTime(row.until)
											] })
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-xs leading-relaxed text-muted",
										children: limbEffect(KIND[tab], row.effectName, lang)
									}),
									tab === "Hora" && row.subs && row.subs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 space-y-0.5 text-[11px] leading-tight text-muted",
										children: row.subs.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: nm(s.lord) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "tabular-nums",
												children: [
													formatTime(s.from),
													"–",
													formatTime(s.until)
												]
											})]
										}, i))
									}) : null,
									tab === "Nakshatra" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-1 block text-sm leading-relaxed text-muted",
										children: [lang === "hi" ? `${formatTime(row.from)} से ${formatTime(row.until)} तक। ` : `${formatTime(row.from)} to ${formatTime(row.until)}. `, limbEffect("nakshatra", row.effectName, lang)]
									}) : null,
									on && tab !== "Nakshatra" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-2 block text-sm leading-relaxed text-muted",
										children: [
											lang === "hi" ? `${formatTime(row.from)} से ${formatTime(row.until)} तक का प्रभाव। ` : `Effect from ${formatTime(row.from)} to ${formatTime(row.until)}. `,
											tab === "Hora" && row.half ? lang === "hi" ? `मुख्य ${formatTime(row.from)}–${formatTime(row.half)}। उपहोरा ${formatTime(row.half)}–${formatTime(row.until)}। ` : `Mukhya ${formatTime(row.from)}–${formatTime(row.half)}. Uphora ${formatTime(row.half)}–${formatTime(row.until)}. ` : "",
											limbEffect(KIND[tab], row.effectName, lang)
										]
									}) : null
								]
							}, id);
						}), tab === "Nakshatra" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-line pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "py-2 text-xs text-muted",
								children: tx("All 27 nakshatras", "सभी 27 नक्षत्र")
							}), NAKSHATRAS.map((name, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-b border-line py-2 text-sm last:border-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: nm(name)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-0.5 block text-xs text-muted",
										children: [
											tx("Lord", "स्वामी"),
											" ",
											nm(NAKSHATRA_LORDS[index] ?? "")
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block leading-relaxed text-muted",
										children: limbEffect("nakshatra", name, lang)
									})
								]
							}, name))]
						}) : null]
					})]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl",
				children: tx("Day markers", "दिन के चिह्न")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-4 divide-y divide-line",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: tx("Sunrise", "सूर्योदय"),
						v: formatTime(p.sunrise)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: tx("Sunset", "सूर्यास्त"),
						v: formatTime(p.sunset)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: tx("Abhijit", "अभिजित"),
						v: `${formatTime(p.abhijit.start)} – ${formatTime(p.abhijit.end)}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: tx("Rahu Kaal", "राहु काल"),
						v: `${formatTime(p.rahuKaal.start)} – ${formatTime(p.rahuKaal.end)}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: tx("Moon rashi", "चंद्र राशि"),
						v: nm(p.moonRashi.name)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: tx("Sun rashi", "सूर्य राशि"),
						v: nm(p.sunRashi.name)
					})
				]
			})] })
		]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 justify-between gap-3 py-3 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "shrink-0 text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "min-w-0 text-right break-words",
			children: v
		})]
	});
}
var TABS = [
	"Tithi",
	"Vaar",
	"Nakshatra",
	"Yoga",
	"Karana",
	"Hora",
	"Rahu",
	"Yamaganda",
	"Mandi",
	"Abhijit"
];
var TAB_HI = {
	Tithi: "तिथि",
	Vaar: "वार",
	Nakshatra: "नक्षत्र",
	Yoga: "योग",
	Karana: "करण",
	Hora: "होरा",
	Rahu: "राहु",
	Yamaganda: "यमगंड",
	Mandi: "माण्डी",
	Abhijit: "अभिजित"
};
var KIND = {
	Tithi: "tithi",
	Vaar: "vara",
	Nakshatra: "nakshatra",
	Yoga: "yoga",
	Karana: "karana",
	Hora: "hora",
	Rahu: "rahu",
	Yamaganda: "yamaganda",
	Mandi: "gulika",
	Abhijit: "abhijit"
};
function rowsFor(tab, span, horas, vara, marks, abhijit) {
	if (tab === "Vaar") return [{
		name: vara,
		effectName: vara,
		from: span.sunrise,
		until: span.nextSunrise,
		half: "",
		subs: []
	}];
	if (tab === "Hora") return horas.map((h) => ({
		name: h.lord,
		effectName: h.lord,
		from: h.from,
		until: h.until,
		half: h.half,
		subs: h.subs ?? []
	}));
	if (tab === "Rahu") return [{
		name: "Rahu Kaal",
		effectName: "Rahu",
		from: marks.rahu.from,
		until: marks.rahu.until,
		half: "",
		subs: []
	}];
	if (tab === "Yamaganda") return [{
		name: "Yamaganda",
		effectName: "Yamaganda",
		from: marks.yamaganda.from,
		until: marks.yamaganda.until,
		half: "",
		subs: []
	}];
	if (tab === "Mandi") return [{
		name: "Mandi",
		effectName: "Mandi",
		from: marks.gulika.from,
		until: marks.gulika.until,
		half: "",
		subs: []
	}];
	if (tab === "Abhijit") return [{
		name: "Abhijit",
		effectName: "Abhijit",
		from: abhijit.start,
		until: abhijit.end,
		half: "",
		subs: []
	}];
	return (span.limbs.find((row) => row.limb === tab)?.parts ?? []).map((part) => ({
		name: part.name,
		effectName: part.name,
		from: part.from,
		until: part.until,
		half: "",
		subs: []
	}));
}
//#endregion
export { PanchangPage as component };
