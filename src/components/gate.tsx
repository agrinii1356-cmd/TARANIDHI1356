import { useEffect } from "react";
import type { ReactNode } from "react";
import { AppShell } from "./app-shell";
import { Onboarding } from "./onboarding";
import { useProfile } from "@/lib/panchang/store";
import { useBilling } from "@/lib/billing";
import { usePrefs } from "@/lib/prefs";

export function Gate({ children }: { children: ReactNode }) {
  const profile = useProfile((s) => s.profile);
  const hydrated = useProfile((s) => s.hydrated);
  const setHydrated = useProfile((s) => s.setHydrated);
  const theme = usePrefs((s) => s.theme);
  const lang = usePrefs((s) => s.lang);
  const ensureDemo = useBilling((s) => s.ensureDemo);

  useEffect(() => {
    const unsub = useProfile.persist.onFinishHydration(() => setHydrated(true));
    if (useProfile.persist.hasHydrated()) setHydrated(true);
    const t = window.setTimeout(() => setHydrated(true), 1200);
    return () => {
      unsub();
      window.clearTimeout(t);
    };
  }, [setHydrated]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = lang === "hi" ? "hi" : "en";
  }, [theme, lang]);

  useEffect(() => {
    if (profile) ensureDemo();
  }, [profile, ensureDemo]);

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg text-muted">
        Opening the almanac
      </div>
    );
  }

  if (!profile) return <Onboarding />;
  return <AppShell>{children}</AppShell>;
}