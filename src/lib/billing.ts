import { create } from "zustand";
import { persist } from "zustand/middleware";

export const DEMO_DAYS = 3;
export const MERCHANT_VPA = "occultviision1@axl";
export const MERCHANT_NAME = "TaraNidhi";

export type Tier = "basic" | "premium" | "platinum";
export type PlanId = "month" | "year";

export const TIER_CHARTS: Record<Tier, number> = { basic: 1, premium: 3, platinum: 10 };
export const TIER_MONTH: Record<Tier, number> = { basic: 199, premium: 369, platinum: 999 };

export function tierYear(tier: Tier) {
  return Math.round(TIER_MONTH[tier] * 12 * 0.8);
}

const KEY_SALT = "tara-nidhi-key-v1";

function keySig(body: string) {
  let h = 2166136261;
  const s = KEY_SALT + body;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0).toString(36).toUpperCase().padStart(4, "0").slice(-4);
}

const TIER_CODE: Record<Tier, string> = { basic: "BAS", premium: "PRE", platinum: "PLA" };
const CODE_TIER: Record<string, Tier> = { BAS: "basic", PRE: "premium", PLA: "platinum" };

/** Owner key. Example: TN-PRE-365-A1B2. The client pastes it after the demo. */
export function makeActivationKey(tier: Tier, days: number) {
  const body = `${tier}-${days}`;
  return `TN-${TIER_CODE[tier]}-${days}-${keySig(body)}`;
}

export function readActivationKey(raw: string): { tier: Tier; days: number } | null {
  const m = raw.trim().toUpperCase().match(/^TN-(BAS|PRE|PLA)-(\d+)-([A-Z0-9]{4})$/);
  if (!m) return null;
  const tier = CODE_TIER[m[1]];
  const days = Number(m[2]);
  if (!tier || !Number.isFinite(days) || days < 1 || days > 3660) return null;
  if (keySig(`${tier}-${days}`) !== m[3]) return null;
  return { tier, days };
}

type BillingState = {
  demoStartedAt: string | null;
  paidUntil: string | null;
  plan: PlanId | null;
  tier: Tier | null;
  ensureDemo: () => void;
  activate: (plan: PlanId, tier?: Tier) => void;
  activateKey: (raw: string) => boolean;
};

export const useBilling = create<BillingState>()(
  persist(
    (set, get) => ({
      demoStartedAt: null,
      paidUntil: null,
      plan: null,
      tier: null,
      ensureDemo: () => {
        if (!get().demoStartedAt) set({ demoStartedAt: new Date().toISOString() });
      },
      activate: (plan, tier = "premium") => {
        const now = Date.now();
        const current = get().paidUntil ? new Date(get().paidUntil as string).getTime() : 0;
        const base = Math.max(now, current);
        const days = plan === "month" ? 30 : 365;
        set({
          plan,
          tier,
          paidUntil: new Date(base + days * 86400000).toISOString(),
        });
      },
      activateKey: (raw) => {
        const parsed = readActivationKey(raw);
        if (!parsed) return false;
        const now = Date.now();
        const current = get().paidUntil ? new Date(get().paidUntil as string).getTime() : 0;
        const base = Math.max(now, current);
        set({
          tier: parsed.tier,
          plan: parsed.days >= 360 ? "year" : "month",
          paidUntil: new Date(base + parsed.days * 86400000).toISOString(),
        });
        return true;
      },
    }),
    { name: "taranidhi-billing" },
  ),
);

export function planAccess(
  s: { demoStartedAt: string | null; paidUntil: string | null },
  now = Date.now(),
) {
  if (s.paidUntil && new Date(s.paidUntil).getTime() > now) {
    return { ok: true as const, kind: "paid" as const, until: s.paidUntil };
  }
  if (s.demoStartedAt) {
    const until = new Date(s.demoStartedAt).getTime() + DEMO_DAYS * 86400000;
    if (until > now) {
      return { ok: true as const, kind: "demo" as const, until: new Date(until).toISOString() };
    }
  }
  return { ok: false as const, kind: "expired" as const, until: null };
}

export function chartAllowance(s: {
  demoStartedAt: string | null;
  paidUntil: string | null;
  tier: Tier | null;
}) {
  const access = planAccess(s);
  if (access.kind === "paid") return TIER_CHARTS[s.tier ?? "premium"];
  return 1;
}

export function daysLeft(until: string | null, now = Date.now()) {
  if (!until) return 0;
  return Math.max(0, Math.ceil((new Date(until).getTime() - now) / 86400000));
}

export function upiLink(amount: number, note: string) {
  const q = new URLSearchParams({
    pa: MERCHANT_VPA,
    pn: MERCHANT_NAME,
    am: String(amount),
    cu: "INR",
    tn: note,
  });
  return `upi://pay?${q.toString()}`;
}
