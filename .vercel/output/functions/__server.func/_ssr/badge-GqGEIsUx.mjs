import { J as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as cn } from "./store-BvmsIaJ0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-GqGEIsUx.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, tone = "neutral", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
			neutral: "bg-surface-2 text-muted",
			good: "bg-good-soft text-good",
			warn: "bg-warn-soft text-warn",
			bad: "bg-bad-soft text-bad"
		}[tone], className),
		...props
	});
}
//#endregion
export { Badge as t };
