import { create } from "zustand";
import { persist } from "zustand/middleware";

export const MONTHLY_INR = 369;
export const YEARLY_INR = Math.round(MONTHLY_INR * 12 * 0.8);
export const YEARLY_LIST_INR = MONTHLY_INR * 12;
export const DEMO_DAYS = 3;
export const MAX_PROFILES = 3;

/** Replace with the business VPA before taking live payments. */
export const MERCHANT_VPA = "occultviision1@axl";
export const MERCHANT_NAME = "TaraNidhi";

export type PlanId = "month" | "year";

type BillingState = {
  demoStartedAt: string | null;
  paidUntil: string | null;
  plan: PlanId | null;
  ensureDemo: () => void;
  activate: (plan: PlanId) => void;
};

export const useBilling = create<BillingState>()(
  persist(
    (set, get) => ({
      demoStartedAt: null,
      paidUntil: null,
      plan: null,
      ensureDemo: () => {
        if (!get().demoStartedAt) set({ demoStartedAt: new Date().toISOString() });
      },
      activate: (plan) => {
        const now = Date.now();
        const current = get().paidUntil ? new Date(get().paidUntil as string).getTime() : 0;
        const base = Math.max(now, current);
        const days = plan === "month" ? 30 : 365;
        set({
          plan,
          paidUntil: new Date(base + days * 86400000).toISOString(),
        });
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
