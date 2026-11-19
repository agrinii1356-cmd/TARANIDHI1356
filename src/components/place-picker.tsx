import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { searchPlacesRemote } from "@/lib/panchang/geocode";
import {
  formatOffset,
  searchCities,
  TIMEZONES,
  tzFromCoords,
  type Place,
} from "@/lib/panchang/cities";
import { cn } from "@/lib/utils";
import { Input, Label, Select } from "./ui/input";
import { Button } from "./ui/button";

type Props = {
  value: Place | null;
  onChange: (place: Place) => void;
  id?: string;
  label?: string;
};

export function PlacePicker({ value, onChange, id = "place", label = "Birth place" }: Props) {
  const [query, setQuery] = useState(value ? value.name : "");
  const [open, setOpen] = useState(false);
  const [remote, setRemote] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [coordsOpen, setCoordsOpen] = useState(false);
  const [customName, setCustomName] = useState(value?.name ?? "");
  const [customLat, setCustomLat] = useState(value ? String(value.lat) : "");
  const [customLon, setCustomLon] = useState(value ? String(value.lon) : "");
  const [customTz, setCustomTz] = useState(value?.tz ?? 5.5);
  const boxRef = useRef<HTMLDivElement>(null);
  const seq = useRef(0);

  const local = useMemo(() => searchCities(query, 10), [query]);

  const combined = useMemo(() => {
    const seen = new Set(local.map((c) => `${c.name}|${c.region}`));
    const extra = remote.filter((r) => !seen.has(`${r.name}|${r.region}`));
    return [...local, ...extra].slice(0, 14);
  }, [local, remote]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setRemote([]);
      setLoading(false);
      return;
    }
    const idNow = ++seq.current;
    setLoading(true);
    const t = window.setTimeout(() => {
      searchPlacesRemote({ data: { q } })
        .then((hits) => {
          if (seq.current === idNow) setRemote(hits);
        })
        .catch(() => {
          if (seq.current === idNow) setRemote([]);
        })
        .finally(() => {
          if (seq.current === idNow) setLoading(false);
        });
    }, 320);
    return () => window.clearTimeout(t);
  }, [query]);

  function pick(p: Place) {
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
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return;
    }
    const name = customName.trim() || "Custom place";
    pick({
      name,
      region: "Custom coordinates",
      lat,
      lon,
      tz: customTz || tzFromCoords(lat, lon),
    });
    setCoordsOpen(false);
  }

  return (
    <div ref={boxRef} className="relative">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
        <Input
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          autoComplete="off"
          placeholder="Type any city, town or village"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="pl-9"
        />
      </div>
      {open ? (
        <div
          id={`${id}-list`}
          role="listbox"
          className="absolute z-50 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-line bg-surface shadow-[0_12px_40px_rgba(28,25,22,0.12)]"
        >
          {loading ? <p className="px-3 py-2 text-xs text-subtle">Searching worldwide…</p> : null}
          {combined.length === 0 && !loading ? (
            <p className="px-3 py-4 text-sm text-muted">
              No match yet — try a nearby town, or enter coordinates below.
            </p>
          ) : (
            combined.map((p) => {
              const active = value && p.name === value.name && Math.abs(p.lat - value.lat) < 0.02;
              return (
                <button
                  key={`${p.name}-${p.lat}-${p.lon}`}
                  type="button"
                  role="option"
                  aria-selected={Boolean(active)}
                  className={cn(
                    "flex w-full items-start gap-2 px-3 py-2.5 text-left min-h-11 hover:bg-surface-2",
                    active && "bg-surface-2",
                  )}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(p)}
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.75} />
                  <span>
                    <span className="block text-sm text-ink">{p.name}</span>
                    <span className="block text-xs text-muted">
                      {p.region} · {formatOffset(p.tz)}
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      ) : null}

      {value ? (
        <p className="mt-2 text-xs text-muted">
          {value.name}
          {value.region ? ` · ${value.region}` : ""} · {value.lat.toFixed(2)}°, {value.lon.toFixed(2)}° ·{" "}
          {formatOffset(value.tz)}
        </p>
      ) : (
        <p className="mt-2 text-xs text-subtle">अपना शहर लिखें — type to search India and the world.</p>
      )}

      <button
        type="button"
        className="mt-2 text-xs text-accent underline-offset-2 hover:underline"
        onClick={() => setCoordsOpen((v) => !v)}
      >
        {coordsOpen ? "Hide coordinates" : "Place not listed? Enter coordinates"}
      </button>

      {coordsOpen ? (
        <div className="mt-3 space-y-3 rounded-lg border border-line bg-surface-2 p-3">
          <div>
            <Label htmlFor={`${id}-cname`}>Place name</Label>
            <Input
              id={`${id}-cname`}
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Village or town name"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor={`${id}-lat`}>Latitude</Label>
              <Input
                id={`${id}-lat`}
                inputMode="decimal"
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
                placeholder="28.61"
              />
            </div>
            <div>
              <Label htmlFor={`${id}-lon`}>Longitude</Label>
              <Input
                id={`${id}-lon`}
                inputMode="decimal"
                value={customLon}
                onChange={(e) => setCustomLon(e.target.value)}
                placeholder="77.21"
              />
            </div>
          </div>
          <div>
            <Label htmlFor={`${id}-tz`}>Timezone</Label>
            <Select
              id={`${id}-tz`}
              value={String(customTz)}
              onChange={(e) => setCustomTz(Number(e.target.value))}
            >
              {TIMEZONES.map((t) => (
                <option key={`${t.label}-${t.tz}`} value={t.tz}>
                  {t.label} · {formatOffset(t.tz)}
                </option>
              ))}
            </Select>
          </div>
          <Button type="button" variant="secondary" className="w-full" onClick={applyCoords}>
            Use these coordinates
          </Button>
        </div>
      ) : null}
    </div>
  );
}
