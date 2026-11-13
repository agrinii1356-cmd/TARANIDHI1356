import { i as __toESM } from "../_runtime.mjs";
import { J as require_jsx_runtime, Y as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as chartFromProfile, s as useProfile } from "./store-DwrWbSZO.mjs";
import { t as Card } from "./card-A4VxBNjG.mjs";
import { n as CATEGORIES, t as ACTIVITIES } from "./activities-D7sozMnA.mjs";
import { r as searchMuhurats } from "./scoring-D7RWM7rf.mjs";
import { a as Label, c as useWallet, i as Button, n as Route$2, o as Select } from "./router-C1I1At8-.mjs";
import { t as Badge } from "./badge-DPi3ZU98.mjs";
import { a as todayISODate, i as qualityTone, r as formatWhen, t as addDaysISO } from "./format-lQcYgVke.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/muhurat-B2b5kMO8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MuhuratPage() {
	const { activity: qActivity } = Route$2.useSearch();
	const profile = useProfile((s) => s.profile);
	const credits = useWallet((s) => s.credits);
	const spend = useWallet((s) => s.spend);
	const [tier, setTier] = (0, import_react.useState)("all");
	const [activity, setActivity] = (0, import_react.useState)(qActivity ?? "job_interview");
	const [start, setStart] = (0, import_react.useState)(todayISODate());
	const [end, setEnd] = (0, import_react.useState)(addDaysISO(todayISODate(), 14));
	const [filter, setFilter] = (0, import_react.useState)("All");
	const [query, setQuery] = (0, import_react.useState)("");
	const [results, setResults] = (0, import_react.useState)(null);
	const [blocked, setBlocked] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const list = (0, import_react.useMemo)(() => {
		return ACTIVITIES.filter((a) => {
			const tierOk = tier === "all" || a.tier === tier;
			const catOk = filter === "All" || a.category === filter;
			const q = query.trim().toLowerCase();
			const textOk = !q || a.name.toLowerCase().includes(q) || a.nameHi.includes(q) || a.category.toLowerCase().includes(q);
			return tierOk && catOk && textOk;
		});
	}, [
		filter,
		query,
		tier
	]);
	const current = ACTIVITIES.find((a) => a.key === activity) ?? list[0];
	const cost = current?.creditCost ?? 1;
	function ask() {
		if (!profile || !current) return;
		setBlocked(false);
		if (!spend(cost, `${current.name} · ${start}`)) {
			setBlocked(true);
			return;
		}
		setBusy(true);
		const chart = chartFromProfile(profile);
		const found = searchMuhurats({
			activityKey: current.key,
			start: /* @__PURE__ */ new Date(start + "T00:00:00"),
			end: /* @__PURE__ */ new Date(end + "T23:59:00"),
			chart,
			lat: profile.lat,
			lon: profile.lon,
			tz: profile.tz,
			maxResults: 8,
			minScore: current.tier === "major" ? 58 : 50
		});
		setResults(found);
		setBusy(false);
	}
	if (!profile) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl",
					children: "Muhurat"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						"Scored for ",
						profile.name,
						". Each ask spends nidhi."
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/profile",
					className: "rounded-full border border-line bg-surface px-3 py-2 text-sm tabular-nums",
					children: [credits, " nidhi"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTier("daily"),
					className: tier === "daily" ? "min-h-11 rounded-full bg-ink px-4 text-sm text-bg" : "min-h-11 rounded-full border border-line bg-surface px-4 text-sm text-muted",
					children: "Daily life · 1"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTier("major"),
					className: tier === "major" ? "min-h-11 rounded-full bg-ink px-4 text-sm text-bg" : "min-h-11 rounded-full border border-line bg-surface px-4 text-sm text-muted",
					children: "Big decisions · 5"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "q",
						children: "Find an activity"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "q",
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Interview, wedding, election, movie…",
						className: "h-11 w-full rounded-md border border-line bg-surface px-3 outline-none focus:border-accent"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "-mx-1 flex gap-2 overflow-x-auto px-1 pb-1",
						children: ["All", ...CATEGORIES].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setFilter(c),
							className: filter === c ? "min-h-9 whitespace-nowrap rounded-full bg-ink px-3 py-2 text-xs text-bg" : "min-h-9 whitespace-nowrap rounded-full bg-surface-2 px-3 py-2 text-xs text-muted",
							children: c
						}, c))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "act",
							children: "Activity"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							id: "act",
							value: current?.key ?? activity,
							onChange: (e) => {
								setActivity(e.target.value);
								setResults(null);
							},
							children: list.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: a.key,
								children: [
									a.tier === "major" ? "Big" : "Daily",
									" · ",
									a.name
								]
							}, a.key))
						}),
						current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: [
								current.blurb,
								" · ",
								current.purushartha,
								" · ",
								current.tatva,
								" · ",
								current.guna,
								" ·",
								" ",
								current.creditCost,
								" nidhi"
							]
						}) : null
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "start",
							children: "From"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "start",
							type: "date",
							value: start,
							onChange: (e) => setStart(e.target.value),
							className: "h-11 w-full rounded-md border border-line px-3"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "end",
							children: "Until"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "end",
							type: "date",
							value: end,
							onChange: (e) => setEnd(e.target.value),
							className: "h-11 w-full rounded-md border border-line px-3"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						className: "w-full",
						size: "lg",
						disabled: busy,
						onClick: ask,
						children: busy ? "Reading the sky…" : `Find golden windows · ${cost} nidhi`
					}),
					blocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-bad",
						children: [
							"Not enough nidhi.",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/profile",
								className: "underline",
								children: "Add credits"
							}),
							"."
						]
					}) : null
				]
			}),
			results ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: results.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: "No window cleared the bar in this range. Widen the dates or choose a milder activity."
				}) }) : results.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "rounded-xl p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-display text-2xl tabular-nums",
								children: [r.finalScore, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 align-middle",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: qualityTone(r.quality),
										children: r.quality
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm",
								children: formatWhen(r.datetime)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted",
								children: [
									r.panchang.tithi.name,
									" · ",
									r.panchang.nakshatra.name,
									" · ",
									r.panchang.vara.name,
									" ·",
									" ",
									r.panchang.horaLord,
									" ",
									r.panchang.uphora.label.toLowerCase()
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-wrap gap-2",
								children: [
									r.panchang.golden.amritSiddhi ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: "good",
										children: "Amrit Siddhi"
									}) : null,
									r.panchang.golden.sarvarthaSiddhi ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: "good",
										children: "Sarvartha Siddhi"
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										tone: "neutral",
										children: [
											r.dasha.maha,
											" / ",
											r.dasha.antar
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 space-y-0.5 text-sm text-muted",
								children: r.reasons.slice(0, 4).map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: x }, x))
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: r.recommendation
						})]
					})
				}, r.datetime))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-subtle",
				children: "Daily asks cost 1 nidhi. Marriage, launch, election, joining and other big decisions cost 5. Windows are ranked with Amrit Siddhi and Sarvartha Siddhi first."
			})
		]
	});
}
//#endregion
export { MuhuratPage as component };
