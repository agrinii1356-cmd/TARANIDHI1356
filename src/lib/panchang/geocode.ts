import { createServerFn } from "@tanstack/react-start";
import { tzFromCoords, type Place } from "./cities";

type NominatimHit = {
  display_name?: string;
  lat: string;
  lon: string;
  name?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    hamlet?: string;
    suburb?: string;
    county?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
};

type PhotonFeature = {
  geometry?: { coordinates?: [number, number] };
  properties?: {
    name?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
    countrycode?: string;
    type?: string;
    osm_key?: string;
    osm_value?: string;
  };
};

const PLACE_TYPES = new Set([
  "city",
  "town",
  "village",
  "hamlet",
  "suburb",
  "district",
  "county",
  "locality",
  "municipality",
  "state",
]);

function isSettledPlace(props: PhotonFeature["properties"]) {
  if (!props) return false;
  if (props.osm_key === "highway" || props.osm_key === "railway") return false;
  const t = (props.type || props.osm_value || "").toLowerCase();
  if (PLACE_TYPES.has(t)) return true;
  return props.osm_key === "place" || props.osm_key === "boundary";
}

function uniquePlaces(rows: Place[]): Place[] {
  const seen = new Set<string>();
  const out: Place[] = [];
  for (const p of rows) {
    if (!Number.isFinite(p.lat) || !Number.isFinite(p.lon)) continue;
    const key = `${p.name.toLowerCase()}|${p.lat.toFixed(2)}|${p.lon.toFixed(2)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

export async function searchPhoton(q: string): Promise<Place[]> {
  const query = q.trim();
  if (query.length < 2) return [];
  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "8");
  const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
  if (!res.ok) return [];
  const json = (await res.json()) as { features?: PhotonFeature[] };
  const mapped: { place: Place; settled: boolean }[] = [];
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
        tz: tzFromCoords(lat, lon, props.countrycode),
      },
    });
  }
  const settled = mapped.filter((m) => m.settled).map((m) => m.place);
  return uniquePlaces(settled.length ? settled : mapped.map((m) => m.place));
}

function placeFromNominatim(hit: NominatimHit): Place {
  const addr = hit.address ?? {};
  const name =
    hit.name ||
    addr.city ||
    addr.town ||
    addr.village ||
    addr.hamlet ||
    addr.suburb ||
    addr.county ||
    "Place";
  const lat = Number(hit.lat);
  const lon = Number(hit.lon);
  return {
    name,
    region: [addr.state, addr.country].filter(Boolean).join(", ") || hit.display_name || "",
    lat,
    lon,
    tz: tzFromCoords(lat, lon, addr.country_code),
  };
}

export const reversePlace = createServerFn({ method: "POST" })
  .validator((data: { lat: number; lon: number }) => {
    const lat = Number(data?.lat);
    const lon = Number(data?.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return { lat: 0, lon: 0 };
    return { lat, lon };
  })
  .handler(async ({ data }): Promise<Place | null> => {
    const url = new URL("https://photon.komoot.io/reverse");
    url.searchParams.set("lat", String(data.lat));
    url.searchParams.set("lon", String(data.lon));
    const res = await fetch(url.toString(), { headers: { Accept: "application/json" } }).catch(() => null);
    const json = res && res.ok ? ((await res.json()) as { features?: PhotonFeature[] }) : null;
    const f = json?.features?.[0];
    const props = f?.properties ?? {};
    const name = props.name || props.city || props.town || props.village || props.county;
    if (name) {
      return {
        name,
        region: [props.state, props.country].filter(Boolean).join(", "),
        lat: data.lat,
        lon: data.lon,
        tz: tzFromCoords(data.lat, data.lon, props.countrycode),
      };
    }
    return {
      name: "GPS",
      region: "",
      lat: data.lat,
      lon: data.lon,
      tz: tzFromCoords(data.lat, data.lon),
    };
  });

export const searchPlacesRemote = createServerFn({ method: "POST" })
  .validator((data: { q: string }) => {
    const q = String(data?.q ?? "").trim().slice(0, 80);
    return { q };
  })
  .handler(async ({ data }): Promise<Place[]> => {
    const photon = await searchPhoton(data.q).catch(() => [] as Place[]);
    if (photon.length) return photon;

    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", data.q);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("limit", "8");
    const res = await fetch(url, {
      headers: {
        "User-Agent": "TaraNidhi/1.0 (personal vedic almanac)",
        Accept: "application/json",
        "Accept-Language": "en",
      },
    });
    if (!res.ok) return [];
    const rows = (await res.json()) as NominatimHit[];
    return uniquePlaces(rows.map(placeFromNominatim));
  });
