import { n as create, t as persist } from "../_libs/zustand.mjs";
import { J as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as dashaFor, k as useProfile, p as chartFromProfile, y as getPanchang } from "./store-BvmsIaJ0.mjs";
import { t as Card } from "./card-DyXBw17q.mjs";
import { a as getActivity } from "./gates-DjmUZLwL.mjs";
import { n as scoreMuhurat, t as dayScore } from "./scoring-DMPg2j4c.mjs";
import { a as Sparkles, c as Plane, g as Briefcase, n as Video, s as Scale, t as Wallet, u as Landmark } from "../_libs/lucide-react.mjs";
import { s as useT } from "./router-dY8SY1_h.mjs";
import { t as Badge } from "./badge-GqGEIsUx.mjs";
import { i as qualityTone, n as formatTime } from "./format-lQcYgVke.mjs";
import { n as localName } from "./names-DJ9Tb8ex.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-UNz9xjVo.js
var import_jsx_runtime = require_jsx_runtime();
function entry(delta, reason) {
	return {
		id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
		at: (/* @__PURE__ */ new Date()).toISOString(),
		delta,
		reason
	};
}
var useWallet = create()(persist((set, get) => ({
	credits: 25,
	ledger: [],
	hydrated: false,
	setHydrated: (v) => set({ hydrated: v }),
	spend: (n, reason) => {
		if (n <= 0) return true;
		if (get().credits < n) return false;
		set({
			credits: get().credits - n,
			ledger: [entry(-n, reason), ...get().ledger].slice(0, 40)
		});
		return true;
	},
	topup: (n, reason) => {
		set({
			credits: get().credits + n,
			ledger: [entry(n, reason), ...get().ledger].slice(0, 40)
		});
	}
}), {
	name: "taranidhi-wallet",
	partialize: (s) => ({
		credits: s.credits,
		ledger: s.ledger
	}),
	onRehydrateStorage: () => (state) => {
		state?.setHydrated(true);
	}
}));
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
	const { lang, t } = useT();
	const nm = (name) => localName(name, lang);
	const tx = (en, hi) => lang === "hi" ? hi : en;
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
			label: tx("Career", "करियर"),
			key: "corporate_meeting"
		},
		{
			label: tx("Money", "पैसा"),
			key: "financial_transaction"
		},
		{
			label: tx("Talk", "बात"),
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
					children: [
						credits,
						" ",
						tx("nidhi", "निधि")
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-widest text-muted",
						children: tx("Personal day", "आपका दिन")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-baseline gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-5xl tabular-nums leading-none",
							children: Math.round(day.finalScore)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: qualityTone(day.quality),
							children: nm(day.quality)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-muted",
						children: [
							tx("Tara", "तारा"),
							" ",
							nm(day.tara.name),
							" · ",
							tx("Moon", "चंद्र"),
							" ",
							day.chandra.distance,
							" ",
							tx("from natal", "जन्म से"),
							" · ",
							nm(dasha.maha),
							"/",
							nm(dasha.antar)
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							nm(p.tithi.name),
							" · ",
							nm(p.tithi.paksha)
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							nm(p.nakshatra.name),
							" ",
							p.nakshatra.pada
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							nm(p.moonRashi.tatva),
							" · ",
							nm(p.nakshatra.guna)
						] })
					]
				})]
			}),
			p.golden.amritSiddhi || p.golden.sarvarthaSiddhi ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex items-center gap-3 rounded-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
					className: "size-5 text-accent",
					strokeWidth: 1.6
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: p.golden.amritSiddhi ? tx("Amrit Siddhi Yoga today", "आज अमृत सिद्धि योग") : tx("Sarvartha Siddhi Yoga today", "आज सर्वार्थ सिद्धि योग")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						nm(p.vara.name),
						" + ",
						nm(p.nakshatra.name),
						". ",
						tx("A golden window for most starts.", "अधिकतर शुरुआत के लिए सुनहरी खिड़की।")
					]
				})] })]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-sm font-medium text-muted",
				children: tx("Windows now", "अभी की खिड़की")
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 space-y-0.5 text-xs leading-relaxed text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block",
									children: [
										tx("1. Time", "1. समय"),
										" · ",
										nm(w.scored.panchang.horaLord),
										" ",
										formatTime(w.scored.panchang.horaWindow.start),
										"–",
										formatTime(w.scored.panchang.horaWindow.end)
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block",
									children: [
										tx("2. Score", "2. स्कोर"),
										" ·",
										" ",
										w.scored.panchang.uphora.half === 1 ? tx("Mukhya adds", "मुख्य में जोड़") : tx("Uphora is 10 less", "उपहोरा में 10 कम")
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block",
									children: [
										tx("3. Effect", "3. प्रभाव"),
										" ·",
										" ",
										w.scored.panchang.uphora.half === 1 ? tx("Same planet, heavier", "वही ग्रह, भारी") : tx("Same planet, lighter", "वही ग्रह, हल्का")
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: "mt-2",
							tone: qualityTone(w.scored.quality),
							children: nm(w.scored.quality)
						})
					]
				}, w.key))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-sm font-medium text-muted",
				children: tx("Daily life", "रोज़ के काम")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
				children: DAILY.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/muhurat",
					search: { activity: q.key },
					className: "flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border border-line bg-surface p-3 text-center text-xs hover:bg-surface-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(q.icon, {
						className: "size-5 text-accent",
						strokeWidth: 1.6
					}), lang === "hi" ? getActivity(q.key)?.nameHi ?? q.label : q.label]
				}, q.key))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-sm font-medium text-muted",
				children: tx("Big decisions", "बड़े फैसले")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
				children: MAJOR.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/muhurat",
					search: { activity: q.key },
					className: "flex min-h-16 items-center justify-center rounded-xl border border-line bg-surface px-2 text-center text-xs hover:bg-surface-2",
					children: [
						q.key === "file_case" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "mr-1 size-4 text-accent" }) : null,
						q.key === "company_incorporation" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "mr-1 size-4 text-accent" }) : null,
						lang === "hi" ? getActivity(q.key)?.nameHi ?? q.label : q.label
					]
				}, q.key))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: tx("Today’s limbs", "आज के अंग")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/panchang",
						className: "text-sm text-accent",
						children: t("panchang")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
							label: tx("Yoga", "योग"),
							value: nm(p.yoga.name)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
							label: tx("Karana", "करण"),
							value: nm(p.karana.name)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
							wide: true,
							label: tx("1. Time", "1. समय"),
							value: `${nm(p.horaLord)} ${formatTime(p.horaWindow.start)}–${formatTime(p.horaWindow.end)}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
							wide: true,
							label: tx("2. Score", "2. स्कोर"),
							value: p.uphora.half === 1 ? `${tx("Mukhya", "मुख्य")} ${formatTime(p.horaWindow.halfStart)}–${formatTime(p.horaWindow.halfEnd)} · ${tx("adds", "जोड़")}` : `${tx("Uphora", "उपहोरा")} ${formatTime(p.horaWindow.halfStart)}–${formatTime(p.horaWindow.halfEnd)} · ${tx("10 less", "10 कम")}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
							wide: true,
							label: tx("3. Effect", "3. प्रभाव"),
							value: p.uphora.half === 1 ? tx("Same planet, heavier in mukhya", "वही ग्रह, मुख्य में भारी") : tx("Same planet, lighter in uphora", "वही ग्रह, उपहोरा में हल्का")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
							label: tx("Sunrise", "सूर्योदय"),
							value: formatTime(p.sunrise)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
							label: tx("Sunset", "सूर्यास्त"),
							value: formatTime(p.sunset)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
							label: tx("Rahu Kaal", "राहु काल"),
							value: `${formatTime(p.rahuKaal.start)} – ${formatTime(p.rahuKaal.end)}`
						})
					]
				})]
			})
		]
	});
}
function Item({ label, value, wide }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: wide ? "col-span-2 min-w-0 sm:col-span-3" : "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-0.5 break-words",
			children: value
		})]
	});
}
//#endregion
export { Home as component };
