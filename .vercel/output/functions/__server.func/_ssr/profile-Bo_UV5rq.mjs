import { i as __toESM } from "../_runtime.mjs";
import { J as require_jsx_runtime, Y as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as dashaFor, r as chartFromProfile, s as useProfile } from "./store-DwrWbSZO.mjs";
import { t as Card } from "./card-A4VxBNjG.mjs";
import { n as CATEGORIES, t as ACTIVITIES } from "./activities-D7sozMnA.mjs";
import { r as formatOffset } from "./cities-Cn23ecV7.mjs";
import { c as useWallet, i as Button, r as BirthForm, s as PACKS } from "./router-C1I1At8-.mjs";
import { t as Badge } from "./badge-DPi3ZU98.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-Bo_UV5rq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const profile = useProfile((s) => s.profile);
	const setProfile = useProfile((s) => s.setProfile);
	const clear = useProfile((s) => s.clearProfile);
	const credits = useWallet((s) => s.credits);
	const ledger = useWallet((s) => s.ledger);
	const topup = useWallet((s) => s.topup);
	const [editing, setEditing] = (0, import_react.useState)(false);
	if (!profile) return null;
	const chart = chartFromProfile(profile);
	const dasha = dashaFor(chart, /* @__PURE__ */ new Date());
	function save(next) {
		setProfile(next);
		setEditing(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Your chart"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-widest text-muted",
				children: "Edit birth details"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BirthForm, {
					initial: profile,
					submitLabel: "Save birth details",
					onSave: save,
					onCancel: () => setEditing(false)
				})
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-widest text-muted",
					children: profile.name
				}),
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
					children: "Change birth place"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "mt-2 w-full",
					onClick: () => clear(),
					children: "Reset all details"
				})
			] }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-widest text-muted",
					children: "Nidhi wallet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-4xl tabular-nums",
					children: credits
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Daily asks cost 1. Big decisions — marriage, joining, launch, election, case — cost 5. Credits stay on this device. Top-up is a demo balance, not a bank payment."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-2 sm:grid-cols-3",
					children: PACKS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						className: "w-full",
						onClick: () => topup(p.credits, p.label),
						children: [
							"+",
							p.credits,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1 text-xs text-muted",
								children: p.note
							})
						]
					}, p.id))
				}),
				ledger.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-1 text-sm text-muted",
					children: ledger.slice(0, 5).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.reason }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: e.delta > 0 ? `+${e.delta}` : e.delta
						})]
					}, e.id))
				}) : null
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl",
				children: "How scoring works"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: "Universal panchangs only grade the day. TaraNidhi adds Tara Bala, Chandra Bala, Vimshottari mahadasha, uphora, tatva, guna and purushartha, then matches them to the activity. Big decisions cost more nidhi than daily asks."
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
