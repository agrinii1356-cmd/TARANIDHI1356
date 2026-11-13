import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ACTIVITIES, CATEGORIES } from "@/lib/panchang/activities";
import { formatOffset } from "@/lib/panchang/cities";
import { dashaFor } from "@/lib/panchang/engine";
import { chartFromProfile, useProfile, type Profile } from "@/lib/panchang/store";
import {
  MAX_PROFILES,
  MONTHLY_INR,
  YEARLY_INR,
  YEARLY_LIST_INR,
  planAccess,
  useBilling,
} from "@/lib/billing";
import { usePrefs, useT } from "@/lib/prefs";
import { UpiPay } from "@/components/upi-pay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BirthForm } from "@/components/birth-form";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  const profile = useProfile((s) => s.profile);
  const setProfile = useProfile((s) => s.setProfile);
  const clear = useProfile((s) => s.clearProfile);
  const profiles = useProfile((s) => s.profiles);
  const switchProfile = useProfile((s) => s.switchProfile);
  const removeProfile = useProfile((s) => s.removeProfile);
  const billing = useBilling();
  const access = planAccess(billing);
  const lang = usePrefs((s) => s.lang);
  const theme = usePrefs((s) => s.theme);
  const setLang = usePrefs((s) => s.setLang);
  const setTheme = usePrefs((s) => s.setTheme);
  const { t } = useT();
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [saved, setSaved] = useState(false);
  const [limit, setLimit] = useState(false);
  const [payPlan, setPayPlan] = useState<"month" | "year" | null>(null);
  if (!profile) return null;
  const chart = chartFromProfile(profile);
  const dasha = dashaFor(chart, new Date());

  function save(next: Profile) {
    if (!profile) return;
    const ok = setProfile(adding ? next : { ...next, id: profile.id });
    if (!ok) {
      setLimit(true);
      return;
    }
    setEditing(false);
    setAdding(false);
    setSaved(true);
    setLimit(false);
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">{t("chart")}</h1>
      <Card>
        <div className="flex flex-wrap gap-2">
          {(["hi", "en"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setLang(id)}
              className={
                lang === id
                  ? "min-h-11 rounded-full bg-ink px-4 text-sm text-bg"
                  : "min-h-11 rounded-full border border-line px-4 text-sm"
              }
            >
              {id === "hi" ? "हिंदी" : "English"}
            </button>
          ))}
          {(["light", "dark", "divine", "professional"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setTheme(id)}
              className={
                theme === id
                  ? "min-h-11 rounded-full bg-ink px-4 text-sm text-bg"
                  : "min-h-11 rounded-full border border-line px-4 text-sm"
              }
            >
              {t(id)}
            </button>
          ))}
        </div>
      </Card>
      <Card>
        {editing || adding ? (
          <>
            <p className="text-xs uppercase tracking-widest text-muted">Edit birth details</p>
            <div className="mt-4">
              <BirthForm
                initial={adding ? null : profile}
                submitLabel="Save birth details"
                onSave={save}
                onCancel={() => {
                  setEditing(false);
                  setAdding(false);
                }}
              />
            </div>
          </>
        ) : (
          <>
            <p className="text-xs uppercase tracking-widest text-muted">{profile.name}</p>
            {saved ? (
              <p className="mt-2 text-sm text-good">Birth chart saved on this device.</p>
            ) : null}
            {limit ? <p className="mt-2 text-sm text-bad">{t("profileLimit")}</p> : null}
            {profiles.length > 1 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => p.id && switchProfile(p.id)}
                    className={
                      p.id === profile.id
                        ? "min-h-11 rounded-full bg-ink px-3 text-sm text-bg"
                        : "min-h-11 rounded-full border border-line px-3 text-sm"
                    }
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            ) : null}
            <dl className="mt-4 space-y-3 text-sm">
              <Row k="Birth" v={`${profile.date} · ${profile.time}`} />
              <Row k="Place" v={profile.city} />
              <Row
                k="Coordinates"
                v={`${profile.lat.toFixed(2)}, ${profile.lon.toFixed(2)} · ${formatOffset(profile.tz)}`}
              />
              <Row k="Janma nakshatra" v={`${chart.janmaNakshatra.name} pada ${chart.janmaNakshatra.pada}`} />
              <Row k="Moon rashi" v={`${chart.janmaRashi.name} · ${chart.janmaRashi.tatva}`} />
              <Row k="Sun rashi" v={chart.sunRashi.name} />
              <Row k="Nakshatra lord" v={chart.janmaNakshatra.lord} />
              <Row k="Dasha now" v={`${dasha.maha} / ${dasha.antar}`} />
            </dl>
            <Button variant="secondary" className="mt-6 w-full" onClick={() => setEditing(true)}>
              {t("editChart")}
            </Button>
            <Button
              variant="secondary"
              className="mt-2 w-full"
              onClick={() => {
                setAdding(true);
                setLimit(false);
              }}
            >
              {t("addChart")} · {profiles.length}/{MAX_PROFILES}
            </Button>
            <Button variant="ghost" className="mt-2 w-full" onClick={() => clear()}>
              Reset all details
            </Button>
            {profiles.length > 1 && profile.id ? (
              <Button variant="ghost" className="mt-1 w-full" onClick={() => removeProfile(profile.id as string)}>
                Remove this chart
              </Button>
            ) : null}
          </>
        )}
      </Card>

      <Card>
        <p className="text-xs uppercase tracking-widest text-muted">{t("plans")}</p>
        <p className="mt-2 font-display text-3xl">
          {access.kind === "paid"
            ? lang === "hi"
              ? "प्लान चालू"
              : "Plan active"
            : access.kind === "demo"
              ? t("demo")
              : lang === "hi"
                ? "डेमो खत्म"
                : "Demo ended"}
        </p>
        <p className="mt-2 text-sm text-muted">
          {access.until
            ? new Date(access.until).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : lang === "hi"
              ? "तीन दिन मुफ्त। उसके बाद ₹369 महीना, या साल का प्लान 20% कम।"
              : "Three days free. Then ₹369 a month, or a year at 20% off."}
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Button variant="secondary" onClick={() => setPayPlan("month")}>
            {t("month")} · ₹{MONTHLY_INR}
          </Button>
          <Button variant="secondary" onClick={() => setPayPlan("year")}>
            {t("year")} · ₹{YEARLY_INR}
            <span className="ml-1 text-xs text-muted">₹{YEARLY_LIST_INR}</span>
          </Button>
        </div>
        {payPlan ? (
          <UpiPay
            amount={payPlan === "month" ? MONTHLY_INR : YEARLY_INR}
            note={payPlan === "month" ? "TaraNidhi monthly" : "TaraNidhi yearly"}
            onPaid={() => {
              billing.activate(payPlan);
              setPayPlan(null);
            }}
          />
        ) : null}
      </Card>

      <Card>
        <h2 className="font-display text-xl">{t("method")}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {lang === "hi"
            ? "नंबर आठ हिस्सों का है। पंचांग 26%, नवतारा 14%, चंद्र बल 8%, होरा और उपहोरा 12%, पंचपक्षी 12%, गोचर 12%, दशा 10%, अमृत या सर्वार्थ सिद्धि 6%। सत्ताईस योग में से सत्रह साथ देते हैं और दस त्याज्य योग खिड़की बंद कर देते हैं। शुभ नवतारा भी तब सुझाव नहीं बनता जब त्याज्य योग, राहु काल, यमगंड, माण्डी, भद्रा, वर्ज्य, दग्ध या विष तिथि, गंडांत या आठवाँ लग्न चल रहा हो।"
            : "Eight parts make the number. Panchang 26%, Navtara 14%, Chandra Bala 8%, hora and uphora 12%, Panchpakshi 12%, gochar 12%, dasha 10%, Amrit or Sarvartha Siddhi 6%. Seventeen of the twenty-seven yogas support a start. The other ten close the window. A beneficial Navtara is still refused while a tyajya yoga, Rahu Kaal, Yamaganda, Mandi, Bhadra, Varjyam, Dagdha or Visha tithi, Gandanta or the 8th lagna is open."}
        </p>
      </Card>

      <Card>
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl">Catalog</h2>
          <span className="text-sm text-muted">{ACTIVITIES.length} intents</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Badge key={c} tone="neutral">
              {c} · {ACTIVITIES.filter((a) => a.category === c).length}
            </Badge>
          ))}
        </div>
        <Link to="/muhurat" className="mt-4 inline-block text-sm text-accent">
          Search muhurats
        </Link>
      </Card>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{k}</dt>
      <dd className="text-right">{v}</dd>
    </div>
  );
}
