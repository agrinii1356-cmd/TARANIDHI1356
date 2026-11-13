import { J as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as dashaFor, o as getPanchang, r as chartFromProfile, s as useProfile } from "./store-DwrWbSZO.mjs";
import { t as Card } from "./card-A4VxBNjG.mjs";
import { n as scoreMuhurat, t as dayScore } from "./scoring-D7RWM7rf.mjs";
import { a as Sparkles, c as Plane, g as Briefcase, n as Video, s as Scale, t as Wallet, u as Landmark } from "../_libs/lucide-react.mjs";
import { c as useWallet } from "./router-C1I1At8-.mjs";
import { t as Badge } from "./badge-DPi3ZU98.mjs";
import { i as qualityTone, n as formatTime } from "./format-lQcYgVke.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CPmN1yhQ.js
var import_jsx_runtime = require_jsx_runtime();
var DAILY = [
	{
		key: "job_interview",
		label: "Interview",
		icon: Briefcase
	},
	{
		key: "send_resume",
		label: "Resume",
		icon: Briefcase
	},
	{
		key: "client_call",
		label: "Client call",
		icon: Wallet
	},
	{
		key: "zoom_important",
		label: "Video call",
		icon: Video
	},
	{
		key: "travel_booking",
		label: "Travel",
		icon: Plane
	},
	{
		key: "financial_transaction",
		label: "Money",
		icon: Wallet
	}
];
var MAJOR = [
	{
		key: "job_joining",
		label: "Joining"
	},
	{
		key: "company_incorporation",
		label: "Company"
	},
	{
		key: "movie_launch",
		label: "Launch"
	},
	{
		key: "election_nomination",
		label: "Nomination"
	},
	{
		key: "vivah_muhurat",
		label: "Marriage"
	},
	{
		key: "file_case",
		label: "Case"
	}
];
function Home() {
	const profile = useProfile((s) => s.profile);
	const credits = useWallet((s) => s.credits);
	if (!profile) return null;
	const now = /* @__PURE__ */ new Date();
	const noon = /* @__PURE__ */ new Date();
	noon.setHours(12, 0, 0, 0);
	const chart = chartFromProfile(profile);
	const p = getPanchang(now, profile.lat, profile.lon, profile.tz);
	const day = dayScore(noon, chart, profile.lat, profile.lon, profile.tz);
	const dasha = dashaFor(chart, now);
	const windows = [
		{
			label: "Career",
			key: "corporate_meeting"
		},
		{
			label: "Money",
			key: "financial_transaction"
		},
		{
			label: "Talk",
			key: "zoom_important"
		}
	].map((w) => {
		const dt = new Date(now);
		dt.setMinutes(0, 0, 0);
		const scored = scoreMuhurat(dt, w.key, chart, profile.lat, profile.lon, profile.tz);
		return {
			...w,
			scored
		};
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: now.toLocaleDateString("en-IN", {
						weekday: "long",
						day: "numeric",
						month: "long"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-1 font-display text-3xl",
					children: ["Namaste, ", profile.name]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/profile",
					className: "rounded-full border border-line bg-surface px-3 py-2 text-sm tabular-nums",
					children: [credits, " nidhi"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-widest text-muted",
						children: "Personal day"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-baseline gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-5xl tabular-nums leading-none",
							children: Math.round(day.finalScore)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: qualityTone(day.quality),
							children: day.quality
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-muted",
						children: [
							"Tara ",
							day.tara.name,
							" · Moon ",
							day.chandra.distance,
							" from natal · ",
							dasha.maha,
							"/",
							dasha.antar
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							p.tithi.name,
							" · ",
							p.tithi.paksha
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							p.nakshatra.name,
							" ",
							p.nakshatra.pada
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							p.moonRashi.tatva,
							" · ",
							p.nakshatra.guna
						] })
					]
				})]
			}),
			p.golden.amritSiddhi || p.golden.sarvarthaSiddhi ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex items-center gap-3 rounded-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
					className: "size-5 text-accent",
					strokeWidth: 1.6
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-medium",
					children: [p.golden.amritSiddhi ? "Amrit Siddhi Yoga" : "Sarvartha Siddhi Yoga", " today"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						p.vara.name,
						" + ",
						p.nakshatra.name,
						". Professional golden window for most starts."
					]
				})] })]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-sm font-medium text-muted",
				children: "Windows now"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: windows.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "rounded-xl p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted",
							children: w.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 font-display text-2xl tabular-nums",
							children: Math.round(w.scored.finalScore)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: "mt-2",
							tone: qualityTone(w.scored.quality),
							children: w.scored.quality
						})
					]
				}, w.key))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-sm font-medium text-muted",
				children: "Daily life · 1 nidhi"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-2",
				children: DAILY.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/muhurat",
					search: { activity: q.key },
					className: "flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border border-line bg-surface p-3 text-center text-xs hover:bg-surface-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(q.icon, {
						className: "size-5 text-accent",
						strokeWidth: 1.6
					}), q.label]
				}, q.key))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-sm font-medium text-muted",
				children: "Big decisions · 5 nidhi"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-2",
				children: MAJOR.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/muhurat",
					search: { activity: q.key },
					className: "flex min-h-16 items-center justify-center rounded-xl border border-line bg-surface px-2 text-center text-xs hover:bg-surface-2",
					children: [
						q.key === "file_case" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "mr-1 size-4 text-accent" }) : null,
						q.key === "company_incorporation" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "mr-1 size-4 text-accent" }) : null,
						q.label
					]
				}, q.key))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: "Today’s limbs"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/panchang",
						className: "text-sm text-accent",
						children: "Full panchang"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
							label: "Yoga",
							value: p.yoga.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
							label: "Karana",
							value: p.karana.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
							label: "Hora",
							value: `${p.horaLord} · ${p.uphora.label}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
							label: "Sunrise",
							value: formatTime(p.sunrise)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
							label: "Sunset",
							value: formatTime(p.sunset)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
							label: "Rahu Kaal",
							value: `${formatTime(p.rahuKaal.start)} – ${formatTime(p.rahuKaal.end)}`
						})
					]
				})]
			})
		]
	});
}
function Item({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs text-muted",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "mt-0.5",
		children: value
	})] });
}
//#endregion
export { Home as component };
