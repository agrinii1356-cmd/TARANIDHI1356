import { i as __toESM } from "../_runtime.mjs";
import { J as require_jsx_runtime, Y as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as cn, r as chartFromProfile, s as useProfile } from "./store-DwrWbSZO.mjs";
import { t as Card } from "./card-A4VxBNjG.mjs";
import { t as dayScore } from "./scoring-D7RWM7rf.mjs";
import { m as ChevronLeft, p as ChevronRight } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/calendar-DX84DAJR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CalendarPage() {
	const profile = useProfile((s) => s.profile);
	const now = /* @__PURE__ */ new Date();
	const [cursor, setCursor] = (0, import_react.useState)(new Date(now.getFullYear(), now.getMonth(), 1));
	const cells = (0, import_react.useMemo)(() => {
		if (!profile) return [];
		const chart = chartFromProfile(profile);
		const year = cursor.getFullYear();
		const month = cursor.getMonth();
		const startPad = new Date(year, month, 1).getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const out = [];
		for (let i = 0; i < startPad; i++) out.push({ date: null });
		for (let d = 1; d <= daysInMonth; d++) {
			const dt = new Date(year, month, d, 12, 0, 0);
			const s = dayScore(dt, chart, profile.lat, profile.lon, profile.tz);
			out.push({
				date: dt,
				score: s.finalScore,
				quality: s.quality
			});
		}
		return out;
	}, [cursor, profile]);
	if (!profile) return null;
	const label = cursor.toLocaleDateString("en-IN", {
		month: "long",
		year: "numeric"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl",
					children: "Calendar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Previous month",
						className: "flex h-11 min-w-11 items-center justify-center rounded-full border border-line",
						onClick: () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Next month",
						className: "flex h-11 min-w-11 items-center justify-center rounded-full border border-line",
						onClick: () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-muted",
				children: [label, " · personal day scores"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-7 gap-1 text-center text-[11px] text-muted",
				children: [[
					"S",
					"M",
					"T",
					"W",
					"T",
					"F",
					"S"
				].map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-2",
					children: d
				}, i)), cells.map((c, i) => {
					if (!c.date) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}, i);
					const q = c.quality;
					const cls = q === "Excellent" ? "bg-good-soft text-good" : q === "Good" ? "bg-good-soft text-good" : q === "Average" ? "bg-warn-soft text-warn" : "bg-bad-soft text-bad";
					const isToday = c.date.getDate() === now.getDate() && c.date.getMonth() === now.getMonth() && c.date.getFullYear() === now.getFullYear();
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("aspect-square rounded-[12px] p-1 text-xs", cls, isToday && "ring-1 ring-ink"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "tabular-nums",
							children: c.date.getDate()
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "tabular-nums opacity-80",
							children: Math.round(c.score ?? 0)
						})]
					}, i);
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Scores use Tara Bala, Chandra Bala and the day’s panchanga — not a universal almanac. Open",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/muhurat",
						className: "text-accent",
						children: "Muhurat"
					}),
					" ",
					"for a specific task."
				]
			})
		]
	});
}
//#endregion
export { CalendarPage as component };
