import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MAX_PROFILES, useBilling } from "@/lib/billing";
import { CITIES } from "./cities";
import { getBirthChart, type BirthChart } from "./engine";

export type Profile = {
  id?: string;
  name: string;
  date: string;
  time: string;
  city: string;
  lat: number;
  lon: number;
  tz: number;
};

type State = {
  profile: Profile | null;
  profiles: Profile[];
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  setProfile: (p: Profile) => boolean;
  switchProfile: (id: string) => void;
  removeProfile: (id: string) => void;
  clearProfile: () => void;
};

const STORAGE_KEY = "taranidhi-profile";

function readStoredProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { profile?: Profile | null } };
    return parsed.state?.profile ?? null;
  } catch {
    return null;
  }
}

function withId(p: Profile): Profile {
  return { ...p, id: p.id || "primary" };
}

function writeStored(state: { profile: Profile | null; profiles: Profile[] }) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as { state?: object; version?: number }) : {};
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...parsed,
        state: { ...(parsed.state ?? {}), ...state },
        version: parsed.version ?? 0,
      }),
    );
  } catch {
    /* private mode: keep the chart in memory for this visit */
  }
}

export const useProfile = create<State>()(
  persist(
    (set, get) => ({
      profile: null,
      profiles: [],
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      setProfile: (p) => {
        const id =
          p.id ||
          (typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `p-${Date.now()}`);
        const next = { ...p, id };
        const profiles = get().profiles;
        const exists = profiles.some((x) => x.id === id);
        if (!exists && profiles.length >= MAX_PROFILES) return false;
        const list = exists ? profiles.map((x) => (x.id === id ? next : x)) : [...profiles, next];
        writeStored({ profile: next, profiles: list });
        set({ profile: next, profiles: list });
        useBilling.getState().ensureDemo();
        return true;
      },
      switchProfile: (id) => {
        const next = get().profiles.find((x) => x.id === id);
        if (!next) return;
        writeStored({ profile: next, profiles: get().profiles });
        set({ profile: next });
      },
      removeProfile: (id) => {
        const list = get().profiles.filter((x) => x.id !== id);
        const active = get().profile?.id === id ? (list[0] ?? null) : get().profile;
        writeStored({ profile: active, profiles: list });
        set({ profiles: list, profile: active });
      },
      clearProfile: () => {
        writeStored({ profile: null, profiles: [] });
        set({ profile: null, profiles: [] });
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (s) => ({ profile: s.profile, profiles: s.profiles }),
      merge: (persisted, current) => {
        const raw = (persisted ?? {}) as { profile?: Profile | null; profiles?: Profile[] };
        let profiles = Array.isArray(raw.profiles) ? raw.profiles.map(withId) : [];
        const legacy = raw.profile ?? (profiles.length ? null : readStoredProfile());
        if (!profiles.length && legacy) profiles = [withId(legacy)];
        if (current.profile) {
          const live = withId(current.profile);
          if (!profiles.some((x) => x.id === live.id) && profiles.length < MAX_PROFILES) {
            profiles = [...profiles, live];
          }
        }
        const active =
          (current.profile && profiles.find((x) => x.id === current.profile?.id)) ||
          profiles[0] ||
          null;
        return { ...current, profiles, profile: active, hydrated: true };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

export function dobFromProfile(p: Profile): Date {
  const [y, m, d] = p.date.split("-").map(Number);
  const [hh, mm] = p.time.split(":").map(Number);
  return new Date(y, m - 1, d, hh || 12, mm || 0, 0);
}

export function chartFromProfile(p: Profile): BirthChart {
  return getBirthChart(dobFromProfile(p), p.lat, p.lon, p.tz);
}

export function defaultCity() {
  return CITIES[0];
}
