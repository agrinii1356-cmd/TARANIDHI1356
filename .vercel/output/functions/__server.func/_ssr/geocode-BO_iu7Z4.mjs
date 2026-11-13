import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as tzFromCoords } from "./cities-Cn23ecV7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/geocode-BO_iu7Z4.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var PLACE_TYPES = /* @__PURE__ */ new Set([
	"city",
	"town",
	"village",
	"hamlet",
	"suburb",
	"district",
	"county",
	"locality",
	"municipality",
	"state"
]);
function isSettledPlace(props) {
	if (!props) return false;
	if (props.osm_key === "highway" || props.osm_key === "railway") return false;
	const t = (props.type || props.osm_value || "").toLowerCase();
	if (PLACE_TYPES.has(t)) return true;
	return props.osm_key === "place" || props.osm_key === "boundary";
}
function uniquePlaces(rows) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const p of rows) {
		if (!Number.isFinite(p.lat) || !Number.isFinite(p.lon)) continue;
		const key = `${p.name.toLowerCase()}|${p.lat.toFixed(2)}|${p.lon.toFixed(2)}`;
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(p);
	}
	return out;
}
async function searchPhoton(q) {
	const query = q.trim();
	if (query.length < 2) return [];
	const url = new URL("https://photon.komoot.io/api/");
	url.searchParams.set("q", query);
	url.searchParams.set("limit", "8");
	const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
	if (!res.ok) return [];
	const json = await res.json();
	const mapped = [];
	for (const f of json.features ?? []) {
		const [lon, lat] = f.geometry?.coordinates ?? [];
		const props = f.properties ?? {};
		const name = props.name || props.city || props.town || props.village || props.county;
		if (!name || lat == null || lon == null) continue;
		const region = [props.state, props.country].filter(Boolean).join(", ");
		mapped.push({
			settled: isSettledPlace(props),
			place: {
				name,
				region,
				lat,
				lon,
				tz: tzFromCoords(lat, lon, props.countrycode)
			}
		});
	}
	const settled = mapped.filter((m) => m.settled).map((m) => m.place);
	return uniquePlaces(settled.length ? settled : mapped.map((m) => m.place));
}
function placeFromNominatim(hit) {
	const addr = hit.address ?? {};
	const name = hit.name || addr.city || addr.town || addr.village || addr.hamlet || addr.suburb || addr.county || "Place";
	const lat = Number(hit.lat);
	const lon = Number(hit.lon);
	return {
		name,
		region: [addr.state, addr.country].filter(Boolean).join(", ") || hit.display_name || "",
		lat,
		lon,
		tz: tzFromCoords(lat, lon, addr.country_code)
	};
}
var searchPlacesRemote_createServerFn_handler = createServerRpc({
	id: "8bb1b3189751736984c3a198c00a3ece5eef366e8b1cc36e37e0dd8ee18bddd6",
	name: "searchPlacesRemote",
	filename: "src/lib/panchang/geocode.ts"
}, (opts) => searchPlacesRemote.__executeServer(opts));
var searchPlacesRemote = createServerFn({ method: "POST" }).validator((data) => {
	return { q: String(data?.q ?? "").trim().slice(0, 80) };
}).handler(searchPlacesRemote_createServerFn_handler, async ({ data }) => {
	const photon = await searchPhoton(data.q).catch(() => []);
	if (photon.length) return photon;
	const url = new URL("https://nominatim.openstreetmap.org/search");
	url.searchParams.set("q", data.q);
	url.searchParams.set("format", "jsonv2");
	url.searchParams.set("addressdetails", "1");
	url.searchParams.set("limit", "8");
	const res = await fetch(url, { headers: {
		"User-Agent": "TaraNidhi/1.0 (personal vedic almanac)",
		Accept: "application/json",
		"Accept-Language": "en"
	} });
	if (!res.ok) return [];
	return uniquePlaces((await res.json()).map(placeFromNominatim));
});
//#endregion
export { searchPlacesRemote_createServerFn_handler };
