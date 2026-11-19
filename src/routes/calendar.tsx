import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { chartFromProfile, useProfile } from "@/lib/panchang/store";
import { useEventPlace } from "@/lib/panchang/here";
import { dayScore } from "@/lib/panchang/scoring";

export const Route = createFileRoute("/calendar")({ component: CalendarPage });

function CalendarPage() {
  const profile = useProfile((s) => s.profile);
  const here = useEventPlace(profile);
  const now = new Date();
  const [cursor, setCursor] = useState(new Date(now.getFullYear(), now.getMonth(), 1));

  const cells = useMemo(() => {
    if (!profile) return [];
    const chart = chartFromProfile(profile);
    const lat = here?.lat ?? profile.lat;
    const lon = here?.lon ?? profile.lon;
    const tz = here?.tz ?? profile.tz;
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const out: Array<{ date: Date | null; score?: number; quality?: string }> = [];
    for (let i = 0; i < startPad; i++) out.push({ date: null });
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(year, month, d, 12, 0, 0);
      const s = dayScore(dt, chart, lat, lon, tz);
      out.push({ date: dt, score: s.finalScore, quality: s.quality });
    }
    return out;
  }, [cursor, profile, here]);

  if (!profile) return null;

  const label = cursor.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Calendar</h1>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous month"
            className="flex h-11 min-w-11 items-center justify-center rounded-full border border-line"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            className="flex h-11 min-w-11 items-center justify-center rounded-full border border-line"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <p className="text-muted">
        {label}
        {here ? ` · ${here.name}${here.region ? `, ${here.region}` : ""}` : ""} · personal day scores
      </p>

      <Card>
        <div className="grid grid-cols-7 gap-1.5 text-center text-sm text-muted">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="py-2">
              {d}
            </div>
          ))}
          {cells.map((c, i) => {
            if (!c.date) return <div key={i} />;
            const q = c.quality;
            const cls =
              q === "Excellent"
                ? "bg-[#146c36] text-white"
                : q === "Good"
                  ? "bg-[#2f8f4e] text-white"
                  : q === "Average"
                    ? "bg-[#c47a09] text-[#1c1404]"
                    : "bg-[#a32018] text-white";
            const iso = `${c.date.getFullYear()}-${String(c.date.getMonth() + 1).padStart(2, "0")}-${String(c.date.getDate()).padStart(2, "0")}`;
            const isToday =
              c.date.getDate() === now.getDate() &&
              c.date.getMonth() === now.getMonth() &&
              c.date.getFullYear() === now.getFullYear();
            return (
              <Link
                key={i}
                to="/muhurat"
                search={{ on: iso }}
                className={cn(
                  "flex aspect-square flex-col items-center justify-center rounded-[12px] text-sm font-medium",
                  cls,
                  isToday && "ring-2 ring-ink",
                )}
              >
                <div className="text-base tabular-nums">{c.date.getDate()}</div>
                <div className="text-xs tabular-nums">{Math.round(c.score ?? 0)}</div>
              </Link>
            );
          })}
        </div>
      </Card>
      <p className="text-sm text-muted">
        Press a date. Muhurat opens on that day, even two months ahead. Green is strong, gold is ordinary, red is weak.
      </p>
    </div>
  );
}
