import { Link, useRouterState } from "@tanstack/react-router";
import { Bird, CalendarDays, Compass, Home, Search, UserRound } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { chartAllowance, daysLeft, planAccess, useBilling } from "@/lib/billing";
import { useT } from "@/lib/prefs";

const NAV = [
  { to: "/", key: "today", icon: Home },
  { to: "/muhurat", key: "muhurat", icon: Search },
  { to: "/calendar", key: "calendar", icon: CalendarDays },
  { to: "/panchang", key: "panchang", icon: Compass },
  { to: "/profile", key: "nidhi", icon: UserRound },
] as const;

const SIDE = [
  NAV[0],
  NAV[1],
  { to: "/pakshi", key: "pakshi", icon: Bird },
  NAV[2],
  NAV[3],
  NAV[4],
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const billing = useBilling();
  const access = planAccess(billing);
  const { t, lang } = useT();
  const [help, setHelp] = useState(false);
  const left = daysLeft(access.until);
  const untilText = access.until
    ? new Date(access.until).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
        day: "numeric",
        month: "short",
      })
    : "";
  const chip = access.kind === "paid"
    ? `${billing.tier ?? "premium"} · ${left}d`
    : access.kind === "demo"
      ? `${t("demo")} · ${left}d`
      : t("plans");
  const validity = access.until
    ? lang === "hi"
      ? `${untilText} तक · ${left} दिन · ${chartAllowance(billing)} कुंडली`
      : `until ${untilText} · ${left} days · ${chartAllowance(billing)} charts`
    : lang === "hi"
      ? "डेमो खत्म"
      : "Demo ended";

  const links = (mode: "side" | "top" | "bottom") =>
    (mode === "side" ? SIDE : NAV).map((n) => {
      const active = pathname === n.to;
      const label = t(n.key);
      if (mode === "bottom") {
        return (
          <Link
            key={n.to}
            to={n.to}
            className={cn(
              "flex min-h-14 min-w-0 flex-col items-center justify-center gap-0.5 px-0.5 text-[10px] leading-tight sm:text-[11px]",
              active ? "text-accent" : "text-muted",
            )}
          >
            <n.icon className="size-5 shrink-0" strokeWidth={1.75} />
            <span className="max-w-full truncate">{label}</span>
          </Link>
        );
      }
      return (
        <Link
          key={n.to}
          to={n.to}
          className={cn(
            "flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm",
            active ? "bg-ink text-bg" : "text-muted hover:bg-surface-2",
          )}
        >
          <n.icon className="size-4" strokeWidth={1.75} />
          {label}
        </Link>
      );
    });

  return (
    <div className="min-h-dvh bg-bg text-ink lg:grid lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="hidden border-r border-line px-4 py-6 lg:flex lg:flex-col lg:gap-6">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt=""
            className="h-20 w-20 rounded-full border-2 border-[#d4b15a] object-cover object-[center_16%]"
          />
          <span>
            <span className="block font-display text-3xl tracking-tight">TaraNidhi</span>
            <span className="block text-xs text-muted">{validity}</span>
          </span>
        </Link>
        <nav className="flex flex-col gap-1">{links("side")}</nav>
        <Link
          to="/profile"
          className="mt-auto rounded-full border border-line bg-surface px-3 py-2 text-center text-sm"
        >
          {chip}
        </Link>
      </aside>

      <div className="min-w-0">
        <header className="flex items-center gap-3 border-b border-line px-4 py-3 lg:hidden">
          <img
            src="/logo.png"
            alt=""
            className="h-14 w-14 shrink-0 rounded-full border-2 border-[#d4b15a] object-cover object-[center_16%]"
          />
          <span className="min-w-0">
            <span className="block font-display text-2xl leading-none">TaraNidhi</span>
            <span className="mt-1 block truncate text-xs text-muted">{validity}</span>
          </span>
        </header>
        <header className="hidden items-center justify-end border-b border-line px-8 py-4 xl:flex">
          <span className="text-xs uppercase tracking-[0.16em] text-muted">TaraNidhi 2</span>
        </header>
        <main className="mx-auto w-full min-w-0 max-w-3xl px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-5 sm:px-6 lg:max-w-5xl lg:px-8 lg:pb-12 lg:pt-8">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <div className="mx-auto grid w-full max-w-lg grid-cols-5">{links("bottom")}</div>
      </nav>
      <button
        type="button"
        onClick={() => setHelp((v) => !v)}
        className="fixed bottom-20 right-3 z-40 rounded-full bg-[#1c1408] px-4 py-2 text-sm text-[#ffe08a] lg:bottom-6"
      >
        {lang === "hi" ? "सहायता" : "Help"}
      </button>
      {help ? (
        <div className="fixed bottom-32 right-3 z-40 w-[min(22rem,calc(100vw-1.5rem))] rounded-2xl border border-[#d4b15a] bg-[#070b18] p-4 text-sm leading-relaxed text-[#f6e7c1] lg:bottom-16">
          <p className="font-display text-lg text-[#ffe08a]">TaraNidhi</p>
          <ol className="mt-2 list-decimal space-y-2 pl-4">
            <li>{lang === "hi" ? "निधि में जन्म तिथि, समय और शहर भरें।" : "In Nidhi, save birth date, time and city."}</li>
            <li>{lang === "hi" ? "मुहूर्त में काम चुनें। तारीख उसी के नीचे है, सूची के बाद नहीं।" : "On Muhurat, pick the work. The dates sit under the category, not after the long list."}</li>
            <li>{lang === "hi" ? "पक्षी मुहूर्त कार्ड पर है। पूरा चक्र पक्षी पेज पर है।" : "The bird sits on the muhurat card. The full clock is on the Pakshi page."}</li>
            <li>{lang === "hi" ? "भुगतान का UTR बैंक एसएमएस में है। ऐप बैंक से खुद पुष्टि नहीं पढ़ता।" : "The UTR is in the bank SMS. The app cannot read the bank."}</li>
          </ol>
        </div>
      ) : null}
    </div>
  );
}