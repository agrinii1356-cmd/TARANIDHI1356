import { i as __toESM } from "../_runtime.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { J as require_jsx_runtime, Y as require_react, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, x as useRouter, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { O as useBilling, S as planAccess, k as useProfile, m as cn } from "./store-BvmsIaJ0.mjs";
import { _ as Bird, d as House, f as Compass, h as CalendarDays, i as TriangleAlert, l as MapPin, o as Search, r as UserRound } from "../_libs/lucide-react.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as tzFromCoords, i as searchCities, n as TIMEZONES, r as formatOffset, t as CITIES } from "./cities-Cn23ecV7.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-dY8SY1_h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var usePrefs = create()(persist((set) => ({
	lang: "hi",
	theme: "light",
	setLang: (lang) => set({ lang }),
	setTheme: (theme) => set({ theme })
}), { name: "taranidhi-prefs" }));
var en = {
	today: "Today",
	muhurat: "Muhurat",
	panchang: "Panchang",
	pakshi: "Pakshi",
	calendar: "Calendar",
	nidhi: "Nidhi",
	chart: "Your chart",
	editChart: "Edit birth chart",
	addChart: "Add a chart",
	profiles: "Saved charts",
	profileLimit: "Basic keeps 3 charts. Remove one to add another.",
	saved: "Birth chart saved on this device.",
	language: "Language",
	theme: "Theme",
	light: "Light",
	dark: "Dark",
	divine: "Divine",
	professional: "Professional",
	plans: "Plan",
	demo: "3-day demo",
	pay: "Pay with UPI",
	openUpi: "Open UPI app",
	paid: "I have paid",
	month: "1 month",
	year: "1 year",
	scan: "Scan this QR in PhonePe, GPay or Paytm.",
	method: "What the score uses"
};
var hi = {
	today: "आज",
	muhurat: "मुहूर्त",
	panchang: "पंचांग",
	pakshi: "पक्षी",
	calendar: "कैलेंडर",
	nidhi: "निधि",
	chart: "आपकी कुंडली",
	editChart: "कुंडली बदलें",
	addChart: "एक और कुंडली",
	profiles: "सेव कुंडलियाँ",
	profileLimit: "बेसिक में 3 कुंडली। नई जोड़ने के लिए एक हटाएँ।",
	saved: "कुंडली इस डिवाइस पर सेव हो गई।",
	language: "भाषा",
	theme: "थीम",
	light: "हल्की",
	dark: "गहरी",
	divine: "दिव्य",
	professional: "प्रोफेशनल",
	plans: "प्लान",
	demo: "3 दिन का डेमो",
	pay: "UPI से भरें",
	openUpi: "UPI ऐप खोलें",
	paid: "भुगतान हो गया",
	month: "1 महीना",
	year: "1 साल",
	scan: "PhonePe, GPay या Paytm से यह QR स्कैन करें।",
	method: "स्कोर किन नियमों से बनता है"
};
function useT() {
	const lang = usePrefs((s) => s.lang);
	const table = lang === "hi" ? hi : en;
	return {
		lang,
		t: (key) => table[key]
	};
}
var NAV = [
	{
		to: "/",
		key: "today",
		icon: House
	},
	{
		to: "/muhurat",
		key: "muhurat",
		icon: Search
	},
	{
		to: "/panchang",
		key: "panchang",
		icon: Compass
	},
	{
		to: "/pakshi",
		key: "pakshi",
		icon: Bird
	},
	{
		to: "/calendar",
		key: "calendar",
		icon: CalendarDays
	},
	{
		to: "/profile",
		key: "nidhi",
		icon: UserRound
	}
];
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const billing = useBilling();
	const access = planAccess(billing);
	const { t } = useT();
	const chip = access.kind === "paid" ? t("pay") : access.kind === "demo" ? t("demo") : t("plans");
	const links = (mode) => NAV.map((n) => {
		const active = pathname === n.to;
		const label = t(n.key);
		if (mode === "bottom") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: n.to,
			className: cn("flex min-h-14 min-w-0 flex-col items-center justify-center gap-0.5 px-0.5 text-[10px] leading-tight sm:text-[11px]", active ? "text-accent" : "text-muted"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n.icon, {
				className: "size-5 shrink-0",
				strokeWidth: 1.75
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "max-w-full truncate",
				children: label
			})]
		}, n.to);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: n.to,
			className: cn("flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm", active ? "bg-ink text-bg" : "text-muted hover:bg-surface-2"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n.icon, {
				className: "size-4",
				strokeWidth: 1.75
			}), label]
		}, n.to);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-ink lg:grid lg:grid-cols-[220px_minmax(0,1fr)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "hidden border-r border-line px-4 py-6 lg:flex lg:flex-col lg:gap-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "font-display text-2xl tracking-tight",
						children: "TaraNidhi"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex flex-col gap-1",
						children: links("side")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/profile",
						className: "mt-auto rounded-full border border-line bg-surface px-3 py-2 text-center text-sm",
						children: chip
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
					className: "hidden items-center justify-end border-b border-line px-8 py-4 xl:flex",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs uppercase tracking-[0.16em] text-muted",
						children: "TaraNidhi 2"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "mx-auto w-full min-w-0 max-w-3xl px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-5 sm:px-6 lg:max-w-5xl lg:px-8 lg:pb-12 lg:pt-8",
					children
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid w-full max-w-lg grid-cols-6",
					children: links("bottom")
				})
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var searchPlacesRemote = createServerFn({ method: "POST" }).validator((data) => {
	return { q: String(data?.q ?? "").trim().slice(0, 80) };
}).handler(createSsrRpc("8bb1b3189751736984c3a198c00a3ece5eef366e8b1cc36e37e0dd8ee18bddd6"));
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-[12px] border border-line bg-surface px-3 text-[15px] text-ink outline-none focus:border-accent", className),
		...props
	});
}
function Select({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: cn("h-11 w-full rounded-[12px] border border-line bg-surface px-3 text-[15px] text-ink outline-none focus:border-accent", className),
		...props,
		children
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("mb-1.5 block text-sm font-medium text-muted", className),
		...props
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium transition-opacity duration-150 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] min-h-11", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg hover:opacity-90",
			secondary: "bg-surface-2 text-ink border border-line hover:bg-surface",
			ghost: "text-ink hover:bg-surface-2",
			outline: "border border-line bg-surface text-ink hover:bg-surface-2"
		},
		size: {
			sm: "h-9 px-3 text-sm rounded-[8px]",
			md: "h-11 px-4 text-[15px] rounded-[12px]",
			lg: "h-12 px-5 text-base rounded-[14px]"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function PlacePicker({ value, onChange, id = "place" }) {
	const [query, setQuery] = (0, import_react.useState)(value ? value.name : "");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [remote, setRemote] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [coordsOpen, setCoordsOpen] = (0, import_react.useState)(false);
	const [customName, setCustomName] = (0, import_react.useState)(value?.name ?? "");
	const [customLat, setCustomLat] = (0, import_react.useState)(value ? String(value.lat) : "");
	const [customLon, setCustomLon] = (0, import_react.useState)(value ? String(value.lon) : "");
	const [customTz, setCustomTz] = (0, import_react.useState)(value?.tz ?? 5.5);
	const boxRef = (0, import_react.useRef)(null);
	const seq = (0, import_react.useRef)(0);
	const local = (0, import_react.useMemo)(() => searchCities(query, 10), [query]);
	const combined = (0, import_react.useMemo)(() => {
		const seen = new Set(local.map((c) => `${c.name}|${c.region}`));
		const extra = remote.filter((r) => !seen.has(`${r.name}|${r.region}`));
		return [...local, ...extra].slice(0, 14);
	}, [local, remote]);
	(0, import_react.useEffect)(() => {
		function onDoc(e) {
			if (!boxRef.current?.contains(e.target)) setOpen(false);
		}
		document.addEventListener("mousedown", onDoc);
		return () => document.removeEventListener("mousedown", onDoc);
	}, []);
	(0, import_react.useEffect)(() => {
		const q = query.trim();
		if (q.length < 2) {
			setRemote([]);
			setLoading(false);
			return;
		}
		const idNow = ++seq.current;
		setLoading(true);
		const t = window.setTimeout(() => {
			searchPlacesRemote({ data: { q } }).then((hits) => {
				if (seq.current === idNow) setRemote(hits);
			}).catch(() => {
				if (seq.current === idNow) setRemote([]);
			}).finally(() => {
				if (seq.current === idNow) setLoading(false);
			});
		}, 320);
		return () => window.clearTimeout(t);
	}, [query]);
	function pick(p) {
		onChange(p);
		setQuery(p.name);
		setOpen(false);
		setCustomName(p.name);
		setCustomLat(p.lat.toFixed(4));
		setCustomLon(p.lon.toFixed(4));
		setCustomTz(p.tz);
	}
	function applyCoords() {
		const lat = Number(customLat);
		const lon = Number(customLon);
		if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) return;
		pick({
			name: customName.trim() || "Custom place",
			region: "Custom coordinates",
			lat,
			lon,
			tz: customTz || tzFromCoords(lat, lon)
		});
		setCoordsOpen(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: boxRef,
		className: "relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: id,
				children: "Birth place"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id,
					role: "combobox",
					"aria-expanded": open,
					"aria-controls": `${id}-list`,
					autoComplete: "off",
					placeholder: "Type any city, town or village",
					value: query,
					onChange: (e) => {
						setQuery(e.target.value);
						setOpen(true);
					},
					onFocus: () => setOpen(true),
					className: "pl-9"
				})]
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: `${id}-list`,
				role: "listbox",
				className: "absolute z-50 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-line bg-surface shadow-[0_12px_40px_rgba(28,25,22,0.12)]",
				children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-3 py-2 text-xs text-subtle",
					children: "Searching worldwide…"
				}) : null, combined.length === 0 && !loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-3 py-4 text-sm text-muted",
					children: "No match yet — try a nearby town, or enter coordinates below."
				}) : combined.map((p) => {
					const active = value && p.name === value.name && Math.abs(p.lat - value.lat) < .02;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						role: "option",
						"aria-selected": Boolean(active),
						className: cn("flex w-full items-start gap-2 px-3 py-2.5 text-left min-h-11 hover:bg-surface-2", active && "bg-surface-2"),
						onMouseDown: (e) => e.preventDefault(),
						onClick: () => pick(p),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
							className: "mt-0.5 size-4 shrink-0 text-accent",
							strokeWidth: 1.75
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm text-ink",
							children: p.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block text-xs text-muted",
							children: [
								p.region,
								" · ",
								formatOffset(p.tz)
							]
						})] })]
					}, `${p.name}-${p.lat}-${p.lon}`);
				})]
			}) : null,
			value ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted",
				children: [
					value.name,
					value.region ? ` · ${value.region}` : "",
					" · ",
					value.lat.toFixed(2),
					"°, ",
					value.lon.toFixed(2),
					"° ·",
					" ",
					formatOffset(value.tz)
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-subtle",
				children: "अपना शहर लिखें — type to search India and the world."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-2 text-xs text-accent underline-offset-2 hover:underline",
				onClick: () => setCoordsOpen((v) => !v),
				children: coordsOpen ? "Hide coordinates" : "Place not listed? Enter coordinates"
			}),
			coordsOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 space-y-3 rounded-lg border border-line bg-surface-2 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: `${id}-cname`,
						children: "Place name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: `${id}-cname`,
						value: customName,
						onChange: (e) => setCustomName(e.target.value),
						placeholder: "Village or town name"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: `${id}-lat`,
							children: "Latitude"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: `${id}-lat`,
							inputMode: "decimal",
							value: customLat,
							onChange: (e) => setCustomLat(e.target.value),
							placeholder: "28.61"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: `${id}-lon`,
							children: "Longitude"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: `${id}-lon`,
							inputMode: "decimal",
							value: customLon,
							onChange: (e) => setCustomLon(e.target.value),
							placeholder: "77.21"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: `${id}-tz`,
						children: "Timezone"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						id: `${id}-tz`,
						value: String(customTz),
						onChange: (e) => setCustomTz(Number(e.target.value)),
						children: TIMEZONES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: t.tz,
							children: [
								t.label,
								" · ",
								formatOffset(t.tz)
							]
						}, `${t.label}-${t.tz}`))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "secondary",
						className: "w-full",
						onClick: applyCoords,
						children: "Use these coordinates"
					})
				]
			}) : null
		]
	});
}
function placeFromProfile(p) {
	if (!p?.city || p.lat == null || p.lon == null) return null;
	const known = CITIES.find((c) => c.name === p.city || p.city?.startsWith(c.name + ",") || p.city === `${c.name}, ${c.region}`);
	return {
		name: known?.name ?? p.city.split(",")[0].trim(),
		region: known?.region ?? (p.city.includes(",") ? p.city.split(",").slice(1).join(",").trim() : ""),
		lat: p.lat,
		lon: p.lon,
		tz: p.tz ?? 5.5
	};
}
function BirthForm({ initial, submitLabel, onSave, onCancel }) {
	const [name, setName] = (0, import_react.useState)(initial?.name ?? "");
	const [date, setDate] = (0, import_react.useState)(initial?.date ?? "1992-08-14");
	const [time, setTime] = (0, import_react.useState)(initial?.time ?? "10:30");
	const [place, setPlace] = (0, import_react.useState)(placeFromProfile(initial) ?? CITIES[0]);
	const [error, setError] = (0, import_react.useState)("");
	function save() {
		if (!place) {
			setError("Choose a birth place so the chart can be calculated.");
			return;
		}
		setError("");
		onSave({
			name: name.trim() || "You",
			date,
			time,
			city: place.region ? `${place.name}, ${place.region}` : place.name,
			lat: place.lat,
			lon: place.lon,
			tz: place.tz
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-4",
		onSubmit: (e) => {
			e.preventDefault();
			save();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "name",
				children: "Name"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "name",
				value: name,
				onChange: (e) => setName(e.target.value),
				placeholder: "Your name",
				autoComplete: "name"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-3 min-[420px]:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "dob",
					children: "Date of birth"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "dob",
					type: "date",
					value: date,
					onChange: (e) => setDate(e.target.value),
					required: true
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "tob",
					children: "Time of birth"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "tob",
					type: "time",
					value: time,
					onChange: (e) => setTime(e.target.value),
					required: true
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlacePicker, {
				value: place,
				onChange: setPlace
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-bad",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				className: "w-full",
				size: "lg",
				children: submitLabel
			}),
			onCancel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "ghost",
				className: "w-full",
				onClick: onCancel,
				children: "Cancel"
			}) : null
		]
	});
}
function Onboarding() {
	const setProfile = useProfile((s) => s.setProfile);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.2em] text-muted",
				children: "Personal panchang"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl leading-tight",
				children: "TaraNidhi"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted leading-relaxed",
				children: "Universal almanacs ignore who you are. TaraNidhi scores every window against your birth star, dasha, and the work itself — a call, a joining, a wedding, a launch."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BirthForm, {
					submitLabel: "Calculate my chart",
					onSave: setProfile
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-center text-xs text-subtle",
				children: "Stored only on this device. Time and place accuracy improve Tara and Chandra Bala."
			})
		]
	});
}
function Gate({ children }) {
	const profile = useProfile((s) => s.profile);
	const hydrated = useProfile((s) => s.hydrated);
	const setHydrated = useProfile((s) => s.setHydrated);
	const theme = usePrefs((s) => s.theme);
	const lang = usePrefs((s) => s.lang);
	const ensureDemo = useBilling((s) => s.ensureDemo);
	(0, import_react.useEffect)(() => {
		const unsub = useProfile.persist.onFinishHydration(() => setHydrated(true));
		if (useProfile.persist.hasHydrated()) setHydrated(true);
		const t = window.setTimeout(() => setHydrated(true), 1200);
		return () => {
			unsub();
			window.clearTimeout(t);
		};
	}, [setHydrated]);
	(0, import_react.useEffect)(() => {
		document.documentElement.dataset.theme = theme;
		document.documentElement.lang = lang === "hi" ? "hi" : "en";
	}, [theme, lang]);
	(0, import_react.useEffect)(() => {
		if (profile) ensureDemo();
	}, [profile, ensureDemo]);
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-bg text-muted",
		children: "Opening the almanac"
	});
	if (!profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Onboarding, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children });
}
var styles_default = "/assets/styles-DRI-PSnM.css";
var APP_NAME = "TaraNidhi";
var Route$6 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Personal Vedic muhurat scored from your birth star — daily life and big decisions."
			},
			{
				name: "theme-color",
				content: "#f2eee6"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Source+Sans+3:wght@400;500;600&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$5 = () => import("./routes-UNz9xjVo.mjs");
var Route$5 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./calendar-CToSuHT-.mjs");
var Route$4 = createFileRoute("/calendar")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./muhurat-DCXjWWj1.mjs");
var Route$3 = createFileRoute("/muhurat")({
	validateSearch: (s) => ({ activity: typeof s.activity === "string" ? s.activity : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./pakshi-CiB8DyVT.mjs");
var Route$2 = createFileRoute("/pakshi")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./panchang-E-gSz_4C.mjs");
var Route$1 = createFileRoute("/panchang")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./profile-CExtWyqE.mjs");
var Route = createFileRoute("/profile")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$5.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$6
	}),
	CalendarRoute: Route$4.update({
		id: "/calendar",
		path: "/calendar",
		getParentRoute: () => Route$6
	}),
	MuhuratRoute: Route$3.update({
		id: "/muhurat",
		path: "/muhurat",
		getParentRoute: () => Route$6
	}),
	PakshiRoute: Route$2.update({
		id: "/pakshi",
		path: "/pakshi",
		getParentRoute: () => Route$6
	}),
	PanchangRoute: Route$1.update({
		id: "/panchang",
		path: "/panchang",
		getParentRoute: () => Route$6
	}),
	ProfileRoute: Route.update({
		id: "/profile",
		path: "/profile",
		getParentRoute: () => Route$6
	})
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { Label as a, Button as i, Route$3 as n, usePrefs as o, BirthForm as r, useT as s, router_exports as t };
