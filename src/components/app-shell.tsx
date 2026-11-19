import { Link, useRouterState } from "@tanstack/react-router";
import { Bird, CalendarDays, Compass, Home, Search, UserRound } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { planAccess, useBilling } from "@/lib/billing";
import { useT } from "@/lib/prefs";

const NAV = [
  { to: "/", key: "today", icon: Home },
  { to: "/muhurat", key: "muhurat", icon: Search },
  { to: "/panchang", key: "panchang", icon: Compass },
  { to: "/pakshi", key: "pakshi", icon: Bird },
  { to: "/calendar", key: "calendar", icon: CalendarDays },
  { to: "/profile", key: "nidhi", icon: UserRound },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const billing = useBilling();
  const access = planAccess(billing);
  const { t, lang } = useT();
  const [help, setHelp] = useState(false);
  const chip = access.kind === "paid" ? t("pay") : access.kind === "demo" ? t("demo") : t("plans");

  const links = (mode: "side" | "top" | "bottom") =>
    NAV.map((n) => {
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
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt=""
            className="h-16 w-16 rounded-full border border-[#d4b15a] object-cover object-[center_28%]"
          />
          <span className="font-display text-xl tracking-tight">TaraNidhi</span>
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
        <header className="flex items-center gap-2 border-b border-line px-4 py-3 lg:hidden">
          <img src="/logo.png" alt="" className="h-9 w-9 rounded-full object-cover object-[center_28%]" />
          <span className="font-display text-lg">TaraNidhi</span>
        </header>
        <header className="hidden items-center justify-end border-b border-line px-8 py-4 xl:flex">
          <span className="text-xs uppercase tracking-[0.16em] text-muted">TaraNidhi 2</span>
        </header>
        <main className="mx-auto w-full min-w-0 max-w-3xl px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-5 sm:px-6 lg:max-w-5xl lg:px-8 lg:pb-12 lg:pt-8">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <div className="mx-auto grid w-full max-w-lg grid-cols-6">{links("bottom")}</div>
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
            <li>{lang === "hi" ? "कैलेंडर की तारीख दबाने से वही दिन मुहूर्त में खुलता है।" : "Press a calendar date. That day opens in Muhurat."}</li>
            <li>{lang === "hi" ? "भुगतान का UTR बैंक एसएमएस में है। ऐप बैंक से खुद पुष्टि नहीं पढ़ता।" : "The UTR is in the bank SMS. The app cannot read the bank."}</li>
          </ol>
        </div>
      ) : null}
    </div>
  );
}