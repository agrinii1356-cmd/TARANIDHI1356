import { i as __toESM } from "../_runtime.mjs";
import { J as require_jsx_runtime, Y as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { O as useBilling, S as planAccess, i as NAKSHATRA_GROUPS, k as useProfile, p as chartFromProfile } from "./store-BvmsIaJ0.mjs";
import { t as Card } from "./card-DyXBw17q.mjs";
import { a as getActivity, n as CATEGORIES, r as PARASHAR_CATEGORIES, t as ACTIVITIES } from "./gates-DjmUZLwL.mjs";
import { r as searchMuhurats } from "./scoring-DMPg2j4c.mjs";
import { t as CITIES } from "./cities-Cn23ecV7.mjs";
import { a as Label, i as Button, n as Route$3, s as useT } from "./router-dY8SY1_h.mjs";
import { t as Badge } from "./badge-GqGEIsUx.mjs";
import { a as todayISODate, i as qualityTone, n as formatTime, r as formatWhen, t as addDaysISO } from "./format-lQcYgVke.mjs";
import { n as localName } from "./names-DJ9Tb8ex.mjs";
import { t as limbEffect } from "./effects-DSfr43SX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/muhurat-DCXjWWj1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AIM = {
	Career: ["the post and the first impression", "पद और पहली छाप"],
	Business: ["the deal and the partnership", "सौदा और साझेदारी"],
	Marketing: ["the call and the public reach", "कॉल और सार्वजनिक पहुँच"],
	Finance: ["the money moving", "पैसे का चलना"],
	Health: ["the treatment", "इलाज"],
	Travel: ["the departure", "प्रस्थान"],
	Purchase: ["the purchase", "खरीद"],
	"Real Estate": ["the house or the land", "घर या ज़मीन"],
	Relationship: ["the bond", "रिश्ता"],
	Family: ["the household", "घर-परिवार"],
	Education: ["the study", "पढ़ाई"],
	Legal: ["the filing", "दाखिल करना"],
	Civic: ["the public office", "सार्वजनिक पद"],
	Media: ["the release", "रिलीज़"],
	Technology: ["the launch", "लॉन्च"],
	Daily: ["this hour of work", "काम का यह घंटा"],
	Spiritual: ["the vow", "व्रत"]
};
/** Planet, nakshatra, rashi and clock, and what they do to this one event. Shown for a good hour and a bad hour alike. */
function eventPrabhav(act, p, lang) {
	const star = p.nakshatra.name;
	const lord = p.nakshatra.lord;
	const rashi = p.moonRashi.name;
	const chosen = act.preferredNakshatra.includes(star);
	const against = !chosen && (NAKSHATRA_GROUPS.fierce.includes(star) || NAKSHATRA_GROUPS.sharp.includes(star));
	const horaHelps = act.karaka.includes(p.horaLord);
	const sameTatva = p.moonRashi.tatva === act.tatva;
	const fruit = limbEffect("nakshatra", star, lang);
	const nm = (name) => localName(name, lang);
	const work = lang === "hi" ? act.nameHi : act.name;
	const aim = AIM[act.category] ?? ["this work", "यह काम"];
	const from = formatTime(p.horaWindow.start);
	const until = formatTime(p.horaWindow.end);
	const tone = chosen && horaHelps ? "good" : against ? "bad" : "warn";
	if (lang === "hi") return {
		tone,
		lines: [
			`${from} से ${until} तक। चंद्र ${nm(star)} नक्षत्र में, राशि ${nm(rashi)}। नक्षत्र का स्वामी ${nm(lord)}। होरा ${nm(p.horaLord)} की, ${nm(p.uphora.label)}।`,
			chosen ? `${work}: ${nm(lord)} का यह नक्षत्र ${aim[1]} के लिए रखा गया है। प्रभाव अनुकूल है।` : against ? `${work}: ${nm(lord)} का यह नक्षत्र ${aim[1]} को रोकता है। प्रभाव प्रतिकूल है।` : `${work}: यह नक्षत्र ${aim[1]} की पहली पसंद नहीं। प्रभाव मध्यम है।`,
			horaHelps ? `${nm(p.horaLord)} इस काम का कारक ग्रह है, इसलिए इस घंटे का नतीजा भारी है।` : `${nm(p.horaLord)} इस काम का कारक नहीं, इसलिए होरा का नतीजा हल्का है।`,
			sameTatva ? `${nm(rashi)} का तत्त्व ${nm(p.moonRashi.tatva)} इस काम के तत्त्व से मिलता है।` : `${nm(rashi)} का तत्त्व ${nm(p.moonRashi.tatva)} इस काम के तत्त्व ${nm(act.tatva)} से अलग है।`,
			fruit
		]
	};
	return {
		tone,
		lines: [
			`${from} to ${until}. The Moon is in ${star}, rashi ${rashi}. The star's lord is ${lord}. Hora is ${p.horaLord}, ${p.uphora.label}.`,
			chosen ? `${work}: ${lord}'s star is kept for ${aim[0]}. The effect supports it.` : against ? `${work}: ${lord}'s star works against ${aim[0]}. The effect is adverse.` : `${work}: this star is not the first choice for ${aim[0]}. The effect is ordinary.`,
			horaHelps ? `${p.horaLord} is a karaka of this work, so this hour weighs more.` : `${p.horaLord} is not a karaka of this work, so the hora result stays light.`,
			sameTatva ? `${rashi}'s element ${p.moonRashi.tatva} matches this work.` : `${rashi}'s element ${p.moonRashi.tatva} is not this work's element ${act.tatva}.`,
			fruit
		]
	};
}
var CAT_HI = {
	All: "सब",
	Career: "करियर",
	Business: "व्यापार",
	Marketing: "मार्केटिंग",
	Finance: "पैसा",
	Health: "सेहत",
	Travel: "यात्रा",
	Purchase: "खरीद",
	"Real Estate": "संपत्ति",
	Relationship: "रिश्ता",
	Family: "परिवार",
	Education: "पढ़ाई",
	Legal: "कानून",
	Civic: "सार्वजनिक",
	Media: "मीडिया",
	Technology: "तकनीक",
	Daily: "रोज़",
	Spiritual: "साधना",
	Baby: "शिशु",
	Construction: "निर्माण",
	Dealing: "लेन-देन",
	Farming: "कृषि",
	"Grih Pravesh": "गृह प्रवेश",
	Manufacturing: "निर्माण कार्य",
	Marriage: "विवाह",
	Medical: "औषधि",
	Misc: "विविध",
	Official: "अधिकार",
	Pregnancy: "गर्भ",
	Purchasing: "खरीद",
	Selling: "बेचना",
	Starting: "आरंभ",
	Using: "उपयोग",
	Wearing: "पहनना",
	Journeys: "यात्रा"
};
function MuhuratPage() {
	const { activity: qActivity } = Route$3.useSearch();
	const profile = useProfile((s) => s.profile);
	const access = planAccess(useBilling());
	const { lang, t } = useT();
	const [paddhati, setPaddhati] = (0, import_react.useState)("advance");
	const [tier, setTier] = (0, import_react.useState)("all");
	const [activity, setActivity] = (0, import_react.useState)(qActivity ?? "job_interview");
	const [start, setStart] = (0, import_react.useState)(todayISODate());
	const [end, setEnd] = (0, import_react.useState)(addDaysISO(todayISODate(), 14));
	const [eventCity, setEventCity] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("All");
	const [sub, setSub] = (0, import_react.useState)("All");
	const [query, setQuery] = (0, import_react.useState)("");
	const [results, setResults] = (0, import_react.useState)(null);
	const [blocked, setBlocked] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!qActivity) return;
		const found = ACTIVITIES.find((a) => a.key === qActivity);
		if (!found) return;
		setActivity(found.key);
		setFilter(found.category);
		setTier(found.tier);
		setResults(null);
	}, [qActivity]);
	const cats = paddhati === "traditional" ? PARASHAR_CATEGORIES : [...CATEGORIES];
	const subOf = (a) => a.paddhati === "advance" && a.name.includes(": ") ? a.name.split(": ")[0] : a.name;
	const subs = (0, import_react.useMemo)(() => {
		if (filter === "All") return [];
		const seen = /* @__PURE__ */ new Set();
		for (const a of ACTIVITIES) {
			if (a.paddhati !== paddhati) continue;
			if (a.category !== filter) continue;
			if (tier !== "all" && a.tier !== tier) continue;
			seen.add(subOf(a));
		}
		return [...seen];
	}, [
		filter,
		paddhati,
		tier
	]);
	const list = (0, import_react.useMemo)(() => {
		return ACTIVITIES.filter((a) => {
			const padOk = a.paddhati === paddhati;
			const tierOk = tier === "all" || a.tier === tier;
			const catOk = filter === "All" || a.category === filter;
			const subOk = sub === "All" || subOf(a) === sub;
			const q = query.trim().toLowerCase();
			const textOk = !q || a.name.toLowerCase().includes(q) || a.nameHi.includes(q) || a.category.toLowerCase().includes(q) || (a.western ?? "").toLowerCase().includes(q);
			return padOk && tierOk && catOk && subOk && textOk;
		});
	}, [
		filter,
		query,
		tier,
		paddhati,
		sub
	]);
	const current = ACTIVITIES.find((a) => a.key === activity) ?? list[0];
	const counts = (0, import_react.useMemo)(() => {
		const out = {};
		for (const c of cats) out[c] = ACTIVITIES.filter((a) => a.paddhati === paddhati && a.category === c && (tier === "all" || a.tier === tier)).length;
		return out;
	}, [
		tier,
		paddhati,
		cats
	]);
	function ask() {
		if (!profile || !current) return;
		if (!access.ok) {
			setBlocked(true);
			return;
		}
		setBlocked(false);
		setBusy(true);
		const chart = chartFromProfile(profile);
		const city = CITIES.find((c) => c.name === eventCity);
		const lat = city?.lat ?? profile.lat;
		const lon = city?.lon ?? profile.lon;
		const tz = city?.tz ?? profile.tz;
		const found = searchMuhurats({
			activityKey: current.key,
			start: /* @__PURE__ */ new Date(start + "T00:00:00"),
			end: /* @__PURE__ */ new Date(end + "T23:59:00"),
			chart,
			lat,
			lon,
			tz,
			maxResults: 1,
			minScore: current.tier === "major" ? 58 : 50
		});
		setResults(found);
		setBusy(false);
	}
	if (!profile) return null;
	const catLabel = (c) => lang === "hi" ? CAT_HI[c] ?? c : c;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-w-0 gap-6 lg:grid-cols-2 lg:items-start",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl",
					children: t("muhurat")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						profile.name,
						access.kind === "demo" ? ` · ${t("demo")}` : "",
						access.kind === "expired" ? lang === "hi" ? " · डेमो खत्म" : " · demo ended" : ""
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [["advance", lang === "hi" ? "एडवांस" : "Advance"], ["traditional", lang === "hi" ? "पारंपरिक" : "Traditional"]].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setPaddhati(id);
							setFilter("All");
							setSub("All");
							setResults(null);
						},
						className: paddhati === id ? "min-h-11 rounded-full bg-ink px-2 text-sm text-bg" : "min-h-11 rounded-full border border-line bg-surface px-2 text-sm text-muted",
						children: label
					}, id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted",
					children: paddhati === "traditional" ? lang === "hi" ? "पारंपरिक पद्धति। 229 शास्त्रीय मुहूर्त। पंचांग के नियम। जन्म कुंडली द्वितीय।" : "Traditional paddhati. 229 classical muhurtas. Panchang rules first. Birth chart second." : lang === "hi" ? "एडवांस पद्धति। जन्म कुंडली आधार। ताराबल, चंद्रबल, दशा, गोचर, पक्षी।" : "Advance paddhati. Birth chart is the base. Tarabal, Chandrabala, dasha, gochar, pakshi."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-2",
					children: [
						["all", lang === "hi" ? "दोनों" : "Both"],
						["daily", lang === "hi" ? "रोज़ के" : "Everyday"],
						["major", lang === "hi" ? "बड़े फैसले" : "Big decisions"]
					].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTier(id),
						className: tier === id ? "min-h-11 rounded-full bg-ink px-1 text-xs leading-tight text-bg" : "min-h-11 rounded-full border border-line bg-surface px-1 text-xs leading-tight text-muted",
						children: label
					}, id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted",
					children: tier === "daily" ? lang === "hi" ? "रोज़ के काम: कॉल, मीटिंग, खरीदारी, रेज़्यूमे। ये अक्सर होते हैं।" : "Everyday work: a call, a meeting, a purchase, a resume. These happen often." : tier === "major" ? lang === "hi" ? "बड़े फैसले: शादी, कंपनी, चुनाव, जॉइनिंग। साल में कुछ बार।" : "Rare decisions: marriage, a company, an election, joining. A few times a year." : lang === "hi" ? "दोनों साथ। रोज़ के काम और बड़े फैसले एक सूची में।" : "Both together. Everyday tasks and rare decisions in one list."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "min-w-0 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "q",
								children: lang === "hi" ? "काम खोजें" : "Find an activity"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "q",
								value: query,
								onChange: (e) => setQuery(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter") ask();
								},
								placeholder: lang === "hi" ? "इंटरव्यू, शादी, चुनाव…" : "Interview, wedding, election…",
								className: "h-11 w-full rounded-md border border-line bg-surface px-3 outline-none focus:border-accent"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-muted",
								children: [list.length, lang === "hi" ? " काम। लिखने से सूची छँटती है। Enter या Submit मुहूर्त निकालता है।" : " activities. Typing filters. Enter or Submit runs the muhurat."]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "min-w-0 truncate text-sm font-medium",
								children: [
									lang === "hi" ? "श्रेणी" : "Category",
									" · ",
									catLabel(filter),
									filter !== "All" ? ` · ${counts[filter] ?? 0}` : ""
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setMenuOpen((v) => !v),
								className: "min-h-9 shrink-0 rounded-full border border-line px-3 text-xs",
								children: menuOpen ? lang === "hi" ? "मेनू बंद" : "Close menu" : lang === "hi" ? "श्रेणियाँ" : "Categories"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: menuOpen ? "grid min-w-0 gap-3 sm:grid-cols-[11rem_minmax(0,1fr)]" : "min-w-0",
							children: [menuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
								className: "max-h-72 space-y-0.5 overflow-y-auto rounded-lg border border-line p-1",
								children: ["All", ...cats].filter((c) => c === "All" || (counts[c] ?? 0) > 0).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setFilter(c);
										if (typeof window !== "undefined" && window.innerWidth < 640) setMenuOpen(false);
									},
									className: filter === c ? "flex w-full items-center justify-between rounded-md bg-ink px-3 py-2 text-left text-xs text-bg" : "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs text-muted hover:bg-surface-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-0 truncate",
										children: catLabel(c)
									}), c !== "All" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 opacity-70",
										children: counts[c] ?? 0
									}) : null]
								}, c))
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									filter !== "All" && subs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: lang === "hi" ? "उपश्रेणी" : "Subcategory" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 flex flex-wrap gap-1",
											children: ["All", ...subs].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													setSub(s);
													setResults(null);
												},
												className: sub === s ? "rounded-full bg-ink px-3 py-1 text-xs text-bg" : "rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted",
												children: s
											}, s))
										})]
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [
										lang === "hi" ? "इस श्रेणी के काम" : "Activities",
										" · ",
										catLabel(filter),
										sub !== "All" ? ` · ${sub}` : ""
									] }),
									list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-muted",
										children: lang === "hi" ? "इस स्तर पर यहाँ काम नहीं। सब या दूसरा स्तर खोलें।" : "Nothing in this tier. Open All or the other tier."
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 max-h-64 space-y-1 overflow-y-auto",
										children: list.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												setActivity(a.key);
												setResults(null);
											},
											className: current?.key === a.key ? "flex w-full min-w-0 items-center justify-between gap-3 rounded-lg bg-ink px-3 py-2 text-left text-sm text-bg" : "flex w-full min-w-0 items-center justify-between gap-3 rounded-lg bg-surface-2 px-3 py-2 text-left text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "min-w-0",
												children: [lang === "hi" ? a.nameHi : a.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mt-0.5 block text-xs opacity-70",
													children: lang === "hi" ? a.name : a.nameHi
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs opacity-70",
												children: catLabel(a.category)
											})]
										}, a.key))
									}),
									current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-sm leading-relaxed text-muted",
										children: [
											catLabel(current.category),
											" · ",
											current.blurb,
											" ",
											lang === "hi" ? "होरा का कारक" : "Hora looks for",
											" ",
											current.karaka.join(", "),
											"."
										]
									}) : null
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "place",
							children: lang === "hi" ? "मुहूर्त का स्थान" : "Muhurta place"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "place",
							value: eventCity,
							onChange: (e) => setEventCity(e.target.value),
							className: "h-11 w-full rounded-md border border-line bg-surface px-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: "",
								children: [
									lang === "hi" ? "प्रोफाइल का स्थान" : "Profile place",
									" (",
									profile.city,
									")"
								]
							}), CITIES.slice(0, 80).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.name,
								children: c.name
							}, c.name))]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "start",
								children: lang === "hi" ? "से" : "From"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "start",
								type: "date",
								value: start,
								onChange: (e) => setStart(e.target.value),
								className: "h-11 w-full rounded-md border border-line px-3"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "end",
								children: lang === "hi" ? "तक" : "Until"
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
							disabled: busy || !current,
							onClick: ask,
							children: busy ? lang === "hi" ? "आकाश पढ़ रहा है…" : "Reading the sky…" : `Submit · ${lang === "hi" ? current?.nameHi : current?.name}`
						}),
						blocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-bad",
							children: [lang === "hi" ? "डेमो खत्म। " : "Demo ended. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/profile",
								className: "underline",
								children: t("pay")
							})]
						}) : null
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 space-y-4",
			children: [!access.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: lang === "hi" ? "तीन दिन का डेमो पूरा हुआ।" : "The 3-day demo is over."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: lang === "hi" ? "मुहूर्त फिर से खोलने के लिए निधि में ₹369 महीना, या साल का प्लान 20% कम।" : "Open Nidhi and pay ₹369 for a month, or take the year at 20% off."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/profile",
					className: "mt-4 inline-flex min-h-11 items-center text-sm text-accent",
					children: t("pay")
				})
			] }) : null, results ? results.priority.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: lang === "hi" ? "इन तारीखों में इस काम की एक भी खुली खिड़की नहीं। माण्डी, आठवाँ लग्न और अशुभ नवतारा हटा दिए गए हैं।" : "No open window for this work in these dates. Mandi, 8th lagna and a malefic navtara are left out."
			}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-sm font-medium",
					children: [
						lang === "hi" ? "एक मुहूर्त" : "One muhurat",
						" ·",
						" ",
						lang === "hi" ? current?.nameHi : current?.name
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreCard, {
					title: formatWhen(results.priority[0].datetime),
					result: results.priority[0]
				})]
			}) : access.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-subtle",
				children: lang === "hi" ? "ऊपर का नंबर इसी घड़ी का है। Submit आगे की तारीखें खोजता है। सर्वार्थ सिद्धि तभी दिखेगी जब उस घंटे में हो।" : "The number is this clock. Submit searches the dates. Sarvartha Siddhi shows only when that hour has it."
			}) : null]
		})]
	});
}
function ScoreCard({ title, result, alert }) {
	const { lang } = useT();
	const nm = (name) => localName(name, lang);
	const act = getActivity(result.activityKey);
	const p = result.panchang;
	const prabhav = act ? eventPrabhav(act, p, lang) : null;
	const w = result.weights;
	const pct = (n) => `${Math.round(n * 100)}%`;
	const parts = [
		[
			lang === "hi" ? "पंचांग" : "Panchang",
			result.breakdown.panchanga,
			pct(w.panch)
		],
		[
			lang === "hi" ? "ताराबल" : "Tarabal",
			result.breakdown.navtara,
			pct(w.navtara)
		],
		[
			lang === "hi" ? "चंद्र" : "Moon",
			result.breakdown.chandra,
			pct(w.chandra)
		],
		[
			lang === "hi" ? "होरा" : "Hora",
			result.breakdown.hora,
			pct(w.hora)
		],
		[
			lang === "hi" ? "पक्षी" : "Pakshi",
			result.breakdown.pakshi,
			pct(w.pakshi)
		],
		[
			lang === "hi" ? "गोचर" : "Gochar",
			result.breakdown.gochar,
			pct(w.gochar)
		],
		[
			lang === "hi" ? "दशा" : "Dasha",
			result.breakdown.dasha,
			pct(w.dasha)
		],
		[
			lang === "hi" ? "योग" : "Yoga",
			result.breakdown.golden,
			pct(w.golden)
		]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: alert ? "rounded-xl border-bad p-4" : "rounded-xl p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 grid gap-1.5 text-xs leading-relaxed",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "rounded-md bg-surface-2 px-2 py-1.5",
						children: [
							lang === "hi" ? "1. समय" : "1. Time",
							" · ",
							nm(p.horaLord),
							" ",
							formatTime(p.horaWindow.start),
							"–",
							formatTime(p.horaWindow.end),
							" ",
							lang === "hi" ? "(होरा 60 मिनट)" : "(hora 60 min)"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "rounded-md bg-surface-2 px-2 py-1.5",
						children: [
							lang === "hi" ? "2. स्कोर" : "2. Score",
							" ·",
							" ",
							p.uphora.half === 1 ? lang === "hi" ? `मुख्य ${formatTime(p.horaWindow.halfStart)}–${formatTime(p.horaWindow.halfEnd)} — जोड़` : `Mukhya ${formatTime(p.horaWindow.halfStart)}–${formatTime(p.horaWindow.halfEnd)} — adds` : lang === "hi" ? `उपहोरा ${formatTime(p.horaWindow.halfStart)}–${formatTime(p.horaWindow.halfEnd)} — 10 कम` : `Uphora ${formatTime(p.horaWindow.halfStart)}–${formatTime(p.horaWindow.halfEnd)} — 10 less`
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "rounded-md bg-surface-2 px-2 py-1.5",
						children: [
							lang === "hi" ? "3. प्रभाव" : "3. Effect",
							" · ",
							nm(p.horaLord),
							" ",
							p.uphora.half === 1 ? lang === "hi" ? "मुख्य में भारी" : "weighs more in mukhya" : lang === "hi" ? "उपहोरा में हल्का" : "lighter in uphora",
							" · ",
							"KP ",
							p.kpSub.index,
							"/7 ",
							nm(p.kpSub.lord)
						]
					})
				]
			}),
			alert ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-bad",
				children: [
					nm(result.tara.name),
					" · ",
					nm(p.nakshatra.name)
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-display text-3xl tabular-nums",
					children: [result.finalScore, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2 align-middle",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: alert || result.sutra.blocks.length ? "bad" : qualityTone(result.quality),
							children: result.sutra.blocks.length ? nm("Avoid") : alert ? nm("Alert") : nm(result.quality)
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: nm(result.recommendation)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-xs text-muted",
				children: [
					(lang === "hi" ? getActivity(result.activityKey)?.nameHi : result.activityName) ?? result.activityName,
					" · ",
					nm(p.tithi.name),
					" · ",
					nm(p.nakshatra.name),
					" · ",
					nm(p.vara.name),
					" · ",
					nm(result.sutra.lagna),
					" ",
					lang === "hi" ? "लग्न" : "lagna"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed",
				children: prabhav?.lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: prabhav.tone === "bad" ? "mt-1 block text-bad" : prabhav.tone === "good" ? "mt-1 block text-good" : "mt-1 block text-muted",
					children: line
				}, line))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted",
				children: lang === "hi" ? "आधार: जन्म कुंडली + मुहूर्त लग्न कुंडली + मुहूर्त नवमांश। स्थान अनिवार्य।" : "Basis: birth chart + muhurta lagna chart + muhurta navamsa. Place is required."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-2 sm:grid-cols-2",
				children: [result.birth ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-line p-2 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: lang === "hi" ? "जन्म कुंडली" : "Birth chart"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-muted",
							children: [
								lang === "hi" ? "लग्न" : "Lagna",
								" ",
								nm(result.birth.lagna),
								" · ",
								nm(result.birth.nakshatra),
								" · ",
								nm(result.birth.rashi)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-1 space-y-0.5",
							children: result.birth.grahas.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								nm(g.name),
								" · ",
								nm(g.rashi),
								" · ",
								lang === "hi" ? "भाव" : "house",
								" ",
								g.house,
								g.digbal ? " · digbal" : "",
								" · D9 ",
								nm(g.d9)
							] }, "b-" + g.name))
						})
					]
				}) : null, result.muhurta ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-line p-2 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: lang === "hi" ? "मुहूर्त लग्न कुंडली" : "Muhurta lagna chart"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-muted",
							children: [
								lang === "hi" ? "लग्न" : "Lagna",
								" ",
								nm(result.muhurta.lagna),
								" · ",
								result.muhurta.place
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-1 space-y-0.5",
							children: result.muhurta.grahas.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								nm(g.name),
								" · ",
								nm(g.rashi),
								" · ",
								lang === "hi" ? "भाव" : "house",
								" ",
								g.house,
								g.digbal ? " · digbal" : ""
							] }, g.name))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-line p-2 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: lang === "hi" ? "मुहूर्त नवमांश" : "Muhurta navamsa"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-muted",
							children: [
								lang === "hi" ? "D9 लग्न" : "D9 lagna",
								" ",
								nm(result.muhurta.lagnaD9)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-1 space-y-0.5",
							children: result.muhurta.grahas.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								nm(g.name),
								" · D9 ",
								nm(g.d9)
							] }, g.name + "-d9"))
						})
					]
				})] }) : null]
			}),
			result.sutra.blocks.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-bad",
				children: [
					lang === "hi" ? "बंद" : "Closed",
					": ",
					result.sutra.blocks.join(" · ")
				]
			}) : null,
			result.sutra.cautions.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-warn",
				children: ["Caution: ", result.sutra.cautions.join(" · ")]
			}) : null,
			result.sutra.supports.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-good",
				children: ["With you: ", result.sutra.supports.slice(0, 4).join(" · ")]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 space-y-1.5",
				children: parts.map(([name, score, weight]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[minmax(0,6.2rem)_minmax(0,1fr)_2.2rem] items-center gap-2 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [
								name,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "opacity-70",
									children: weight
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-1.5 overflow-hidden rounded-full bg-surface-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block h-full bg-accent",
								style: { width: `${score}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-right tabular-nums",
							children: score
						})
					]
				}, name))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [
					p.golden.amritSiddhi ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: "good",
						children: "Amrit Siddhi"
					}) : null,
					p.golden.sarvarthaSiddhi ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: "good",
						children: "Sarvartha Siddhi"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						tone: "neutral",
						children: [
							result.dasha.maha,
							" / ",
							result.dasha.antar
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs leading-relaxed text-muted",
				children: [
					lang === "hi" ? "आधार" : "Basis",
					": ",
					lang === "hi" ? "दशा" : "Dasha",
					" ",
					result.dasha.maha,
					"/",
					result.dasha.antar,
					" · ",
					lang === "hi" ? "गोचर" : "Gochar",
					" ",
					result.gochar.hits.slice(0, 3).map((h) => `${h.planet} ${h.house}`).join(", "),
					result.gochar.sadeSati ? lang === "hi" ? " · साढ़े साती" : " · Sade Sati" : "",
					" · ",
					lang === "hi" ? "नक्षत्र पद" : "Star pada",
					" ",
					p.nakshatra.pada
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-0.5 text-sm text-muted",
				children: result.reasons.slice(0, 12).map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: x }, x))
			})
		]
	});
}
//#endregion
export { MuhuratPage as component };
