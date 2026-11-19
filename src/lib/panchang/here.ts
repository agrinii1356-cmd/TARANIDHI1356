import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { reversePlace } from "./geocode";
import { tzFromCoords, type Place } from "./cities";
import type { Profile } from "./store";

type Source = "gps" | "picked" | "profile";

type HereState = {
  place: Place | null;
  source: Source;
  setPlace: (place: Place, source?: Source) => void;
};

export const useHere = create<HereState>()(
  persist(
    (set) => ({
      place: null,
      source: "profile",
      setPlace: (place, source = "picked") => set({ place, source }),
    }),
    { name: "taranidhi-here" },
  ),
);

export function refreshGps(setPlace: (place: Place, source?: Source) => void) {
  if (typeof navigator === "undefined" || !navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const rough: Place = { name: "GPS", region: "", lat, lon, tz: tzFromCoords(lat, lon) };
      setPlace(rough, "gps");
      reversePlace({ data: { lat, lon } })
        .then((named) => {
          if (named) setPlace(named, "gps");
        })
        .catch(() => undefined);
    },
    () => undefined,
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
  );
}

function profilePlace(profile: Profile): Place {
  return {
    name: profile.city || "Birth place",
    region: "",
    lat: profile.lat,
    lon: profile.lon,
    tz: profile.tz,
  };
}

/** Where the person is standing. GPS on first visit, then the city they pick. Birth place is only the fallback. */
export function useEventPlace(profile: Profile | null): Place | null {
  const place = useHere((s) => s.place);
  const setPlace = useHere((s) => s.setPlace);
  const [asked, setAsked] = useState(false);

  useEffect(() => {
    if (!profile || place || asked) return;
    setAsked(true);
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const rough: Place = { name: "GPS", region: "", lat, lon, tz: tzFromCoords(lat, lon) };
        setPlace(rough, "gps");
        reversePlace({ data: { lat, lon } })
          .then((named) => {
            if (named) setPlace(named, "gps");
          })
          .catch(() => undefined);
      },
      () => setPlace(profilePlace(profile), "profile"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 10 * 60 * 1000 },
    );
  }, [profile, place, asked, setPlace]);

  if (place) return place;
  if (profile) return profilePlace(profile);
  return null;
}
