import { i as __toESM } from "../_runtime.mjs";
import { J as require_jsx_runtime, Y as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as upiLink, O as useBilling, S as planAccess, c as YEARLY_LIST_INR, h as dashaFor, k as useProfile, n as MERCHANT_VPA, o as RASHIS, p as chartFromProfile, s as YEARLY_INR } from "./store-BvmsIaJ0.mjs";
import { t as Card } from "./card-DyXBw17q.mjs";
import { n as CATEGORIES, o as navamsaSign, t as ACTIVITIES } from "./gates-DjmUZLwL.mjs";
import { r as formatOffset } from "./cities-Cn23ecV7.mjs";
import { i as Button, o as usePrefs, r as BirthForm, s as useT } from "./router-dY8SY1_h.mjs";
import { t as Badge } from "./badge-GqGEIsUx.mjs";
import { t as require_lib } from "../_libs/qrcode.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-CExtWyqE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
function UpiPay({ amount, note, onPaid }) {
	const { t } = useT();
	const link = upiLink(amount, note);
	const [src, setSrc] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let live = true;
		import_lib.toDataURL(link, {
			margin: 1,
			width: 320,
			color: {
				dark: "#1c1916",
				light: "#fffdf8"
			}
		}).then((url) => {
			if (live) setSrc(url);
		});
		return () => {
			live = false;
		};
	}, [link]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 grid items-center gap-4 sm:grid-cols-[auto_1fr]",
		children: [src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt: `UPI QR for ₹${amount}`,
			className: "mx-auto size-52 rounded-xl border border-line bg-surface p-2"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto size-52 rounded-xl bg-surface-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: t("scan")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "tabular-nums",
					children: [
						"₹",
						amount,
						" · ",
						MERCHANT_VPA
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: link,
					className: "flex min-h-11 items-center justify-center rounded-full bg-ink px-4 text-bg",
					children: t("openUpi")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onPaid,
					className: "flex min-h-11 w-full items-center justify-center rounded-full border border-line px-4",
					children: t("paid")
				})
			]
		})]
	});
}
function ProfilePage() {
	const profile = useProfile((s) => s.profile);
	const setProfile = useProfile((s) => s.setProfile);
	const clear = useProfile((s) => s.clearProfile);
	const profiles = useProfile((s) => s.profiles);
	const switchProfile = useProfile((s) => s.switchProfile);
	const removeProfile = useProfile((s) => s.removeProfile);
	const billing = useBilling();
	const access = planAccess(billing);
	const lang = usePrefs((s) => s.lang);
	const theme = usePrefs((s) => s.theme);
	const setLang = usePrefs((s) => s.setLang);
	const setTheme = usePrefs((s) => s.setTheme);
	const { t } = useT();
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [adding, setAdding] = (0, import_react.useState)(false);
	const [saved, setSaved] = (0, import_react.useState)(false);
	const [limit, setLimit] = (0, import_react.useState)(false);
	const [payPlan, setPayPlan] = (0, import_react.useState)(null);
	if (!profile) return null;
	const chart = chartFromProfile(profile);
	const dasha = dashaFor(chart, /* @__PURE__ */ new Date());
	function save(next) {
		if (!profile) return;
		if (!setProfile(adding ? next : {
			...next,
			id: profile.id
		})) {
			setLimit(true);
			return;
		}
		setEditing(false);
		setAdding(false);
		setSaved(true);
		setLimit(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: t("chart")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [["hi", "en"].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setLang(id),
					className: lang === id ? "min-h-11 rounded-full bg-ink px-4 text-sm text-bg" : "min-h-11 rounded-full border border-line px-4 text-sm",
					children: id === "hi" ? "हिंदी" : "English"
				}, id)), [
					"light",
					"dark",
					"divine",
					"professional"
				].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTheme(id),
					className: theme === id ? "min-h-11 rounded-full bg-ink px-4 text-sm text-bg" : "min-h-11 rounded-full border border-line px-4 text-sm",
					children: t(id)
				}, id))]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: editing || adding ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-widest text-muted",
				children: "Edit birth details"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BirthForm, {
					initial: adding ? null : profile,
					submitLabel: "Save birth details",
					onSave: save,
					onCancel: () => {
						setEditing(false);
						setAdding(false);
					}
				})
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-widest text-muted",
					children: profile.name
				}),
				saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-good",
					children: "Birth chart saved on this device."
				}) : null,
				limit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-bad",
					children: t("profileLimit")
				}) : null,
				profiles.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: profiles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => p.id && switchProfile(p.id),
						className: p.id === profile.id ? "min-h-11 rounded-full bg-ink px-3 text-sm text-bg" : "min-h-11 rounded-full border border-line px-3 text-sm",
						children: p.name
					}, p.id))
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-4 space-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Birth",
							v: `${profile.date} · ${profile.time}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Place",
							v: profile.city
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Coordinates",
							v: `${profile.lat.toFixed(2)}, ${profile.lon.toFixed(2)} · ${formatOffset(profile.tz)}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Janma nakshatra",
							v: `${chart.janmaNakshatra.name} pada ${chart.janmaNakshatra.pada}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Moon rashi",
							v: `${chart.janmaRashi.name} · ${chart.janmaRashi.tatva}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Sun rashi",
							v: chart.sunRashi.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Nakshatra lord",
							v: chart.janmaNakshatra.lord
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Dasha now",
							v: `${dasha.maha} / ${dasha.antar}`
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					className: "mt-6 w-full",
					onClick: () => setEditing(true),
					children: t("editChart")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					className: "mt-2 w-full",
					onClick: () => {
						setAdding(true);
						setLimit(false);
					},
					children: [
						t("addChart"),
						" · ",
						profiles.length,
						"/",
						3
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "mt-2 w-full",
					onClick: () => clear(),
					children: "Reset all details"
				}),
				profiles.length > 1 && profile.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "mt-1 w-full",
					onClick: () => removeProfile(profile.id),
					children: "Remove this chart"
				}) : null
			] }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-widest text-muted",
					children: t("plans")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-3xl",
					children: access.kind === "paid" ? lang === "hi" ? "प्लान चालू" : "Plan active" : access.kind === "demo" ? t("demo") : lang === "hi" ? "डेमो खत्म" : "Demo ended"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: access.until ? new Date(access.until).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
						day: "numeric",
						month: "short",
						year: "numeric"
					}) : lang === "hi" ? "तीन दिन मुफ्त। उसके बाद ₹369 महीना, या साल का प्लान 20% कम।" : "Three days free. Then ₹369 a month, or a year at 20% off."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-2 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: () => setPayPlan("month"),
						children: [
							t("month"),
							" · ₹",
							369
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: () => setPayPlan("year"),
						children: [
							t("year"),
							" · ₹",
							YEARLY_INR,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-1 text-xs text-muted",
								children: ["₹", YEARLY_LIST_INR]
							})
						]
					})]
				}),
				payPlan ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UpiPay, {
					amount: payPlan === "month" ? 369 : YEARLY_INR,
					note: payPlan === "month" ? "TaraNidhi monthly" : "TaraNidhi yearly",
					onPaid: () => {
						billing.activate(payPlan);
						setPayPlan(null);
					}
				}) : null
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: lang === "hi" ? "D9 ग्रह स्थिति" : "D9 planet positions"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						"D9 ",
						lang === "hi" ? "लग्न" : "lagna",
						" ",
						RASHIS[navamsaSign(chart.lagnaIndex * 30 + 15)]
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-1 text-sm",
					children: chart.grahas.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: g.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [
								g.rashi,
								" p",
								g.pada,
								" → D9 ",
								RASHIS[navamsaSign(g.lon)]
							]
						})]
					}, g.name))
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl",
				children: t("method")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: lang === "hi" ? "नंबर आठ हिस्सों का है। पंचांग 26%, नवतारा 14%, चंद्र बल 8%, होरा और उपहोरा 12%, पंचपक्षी 12%, गोचर 12%, दशा 10%, अमृत या सर्वार्थ सिद्धि 6%। सत्ताईस योग में से सत्रह साथ देते हैं और दस त्याज्य योग खिड़की बंद कर देते हैं। शुभ नवतारा भी तब सुझाव नहीं बनता जब त्याज्य योग, राहु काल, यमगंड, माण्डी, भद्रा, वर्ज्य, दग्ध या विष तिथि, गंडांत या आठवाँ लग्न चल रहा हो।" : "Eight parts make the number. Panchang 26%, Navtara 14%, Chandra Bala 8%, hora and uphora 12%, Panchpakshi 12%, gochar 12%, dasha 10%, Amrit or Sarvartha Siddhi 6%. Seventeen of the twenty-seven yogas support a start. The other ten close the window. A beneficial Navtara is still refused while a tyajya yoga, Rahu Kaal, Yamaganda, Mandi, Bhadra, Varjyam, Dagdha or Visha tithi, Gandanta or the 8th lagna is open."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: "Catalog"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted",
						children: [ACTIVITIES.length, " intents"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						tone: "neutral",
						children: [
							c,
							" · ",
							ACTIVITIES.filter((a) => a.category === c).length
						]
					}, c))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/muhurat",
					className: "mt-4 inline-block text-sm text-accent",
					children: "Search muhurats"
				})
			] })
		]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between gap-4",
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
export { ProfilePage as component };
