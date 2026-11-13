//#region node_modules/.nitro/vite/services/ssr/assets/format-lQcYgVke.js
function formatWhen(iso) {
	return new Date(iso).toLocaleString("en-IN", {
		weekday: "short",
		day: "numeric",
		month: "short",
		hour: "numeric",
		minute: "2-digit"
	});
}
function formatTime(iso) {
	return new Date(iso).toLocaleTimeString("en-IN", {
		hour: "numeric",
		minute: "2-digit"
	});
}
function qualityTone(q) {
	if (q === "Excellent" || q === "Good") return "good";
	if (q === "Average") return "warn";
	return "bad";
}
function todayISODate() {
	const d = /* @__PURE__ */ new Date();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${d.getFullYear()}-${m}-${day}`;
}
function addDaysISO(iso, days) {
	const d = /* @__PURE__ */ new Date(iso + "T12:00:00");
	d.setDate(d.getDate() + days);
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${d.getFullYear()}-${m}-${day}`;
}
//#endregion
export { todayISODate as a, qualityTone as i, formatTime as n, formatWhen as r, addDaysISO as t };
