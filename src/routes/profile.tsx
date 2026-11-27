import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ACTIVITIES, CATEGORIES, isHeld } from "@/lib/panchang/activities";
import { formatOffset } from "@/lib/panchang/cities";
import { dashaFor, getBirthChart } from "@/lib/panchang/engine";
import { navamsaSign } from "@/lib/panchang/gates";
import { RASHIS } from "@/lib/panchang/constants";
import { localName } from "@/lib/panchang/names";
import { chartFromProfile, ledgerCsv, rememberAccount, saveScriptUrl, scriptUrl, useProfile, type Profile } from "@/lib/panchang/store";
import {
  TIER_CHARTS,
  TIER_MONTH,
  chartAllowance,
  daysLeft,
  makeActivationKey,
  planAccess,
  tierYear,
  useBilling,
  type Tier,
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
  const [payPlan, setPayPlan] = useState<{ tier: Tier; span: "month" | "year" } | null>(null);
  const [keyText, setKeyText] = useState("");
  const [keyMsg, setKeyMsg] = useState("");
  const [madeKey, setMadeKey] = useState("");
  const [keyTier, setKeyTier] = useState<Tier>("premium");
  const [keyDays, setKeyDays] = useState(365);
  const [script, setScript] = useState(() => scriptUrl());
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
              <Row k={lang === "hi" ? "ईमेल" : "Email"} v={profile.email || "—"} />
              <Row k={lang === "hi" ? "व्हाट्सएप" : "WhatsApp"} v={profile.whatsapp || "—"} />
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
              {t("addChart")} · {profiles.length}/{chartAllowance(billing)}
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
        <h2 className="font-display text-xl">{lang === "hi" ? "D1 जन्म कुंडली" : "D1 birth chart"}</h2>
        <p className="mt-1 text-sm text-muted">
          {lang === "hi" ? "लग्न" : "Lagna"} {localName(chart.lagna, lang)} · {lang === "hi" ? "चंद्र" : "Moon"}{" "}
          {localName(chart.janmaRashi.name, lang)} · {localName(chart.janmaNakshatra.name, lang)}
        </p>
        <ul className="mt-3 space-y-1 text-sm">
          {chart.grahas.map((g) => (
            <li key={g.name} className="flex justify-between gap-3">
              <span>{localName(g.name, lang)}</span>
              <span className="text-right text-muted">
                {localName(g.rashi, lang)} · {g.houseFromLagna} · {localName(g.nakshatra, lang)} p{g.pada}
                {g.digbal ? (lang === "hi" ? " · दिग्बल" : " · digbal") : ""}
              </span>
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="font-display text-xl">{lang === "hi" ? "D9 नवमांश" : "D9 navamsa"}</h2>
        <p className="mt-1 text-sm text-muted">
          D9 {lang === "hi" ? "लग्न" : "lagna"} {localName(RASHIS[navamsaSign(chart.lagnaIndex * 30 + 15)], lang)}
        </p>
        <ul className="mt-3 space-y-1 text-sm">
          {chart.grahas.map((g) => (
            <li key={g.name} className="flex justify-between gap-3">
              <span>{localName(g.name, lang)}</span>
              <span className="text-muted">
                {localName(g.rashi, lang)} p{g.pada} → D9 {localName(RASHIS[navamsaSign(g.lon)], lang)}
              </span>
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="font-display text-xl">{lang === "hi" ? "इस समय का लग्न" : "Lagna of this moment"}</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          {lang === "hi"
            ? "यह दूसरी जन्म कुंडली नहीं है। मुहूर्त में लग्न शुद्धि उसी घंटे और उसी शहर के लग्न से होती है। शास्त्र में जन्म-पत्र जैसी अलग 'मुहूर्त कुंडली' सिद्ध नहीं है। नीचे इसी क्षण का लग्न है।"
            : "This is not a second birth chart. Muhurta reads the lagna of that hour at that place. A separate muhurta kundli, stored like a birth chart, is not an established chart. Below is the lagna of this moment."}
        </p>
        <MomentLagna profile={profile} lang={lang} />
      </Card>
      <Card>
        <p className="text-xs uppercase tracking-widest text-muted">{t("plans")}</p>
        <p className="mt-2 font-display text-3xl">
          {access.kind === "paid"
            ? lang === "hi"
              ? `${billing.tier === "platinum" ? "प्लेटिनम" : billing.tier === "basic" ? "बेसिक" : "प्रीमियम"} चालू`
              : `${billing.tier === "platinum" ? "Platinum" : billing.tier === "basic" ? "Basic" : "Premium"} active`
            : access.kind === "demo"
              ? t("demo")
              : lang === "hi"
                ? "डेमो खत्म"
                : "Demo ended"}
        </p>
        <p className="mt-2 text-base">
          {access.until
            ? lang === "hi"
              ? `वैधता ${new Date(access.until).toLocaleDateString("hi-IN", { day: "numeric", month: "short", year: "numeric" })} तक · ${daysLeft(access.until)} दिन बाकी · कुंडली ${chartAllowance(billing)}`
              : `Valid until ${new Date(access.until).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · ${daysLeft(access.until)} days left · ${chartAllowance(billing)} charts`
            : lang === "hi"
              ? "तीन दिन का डेमो, एक कुंडली। उसके बाद चाबी या UPI।"
              : "Three-day demo, one chart. Then a key or UPI."}
        </p>
        <p className="mt-1 text-sm text-muted">
          {lang === "hi"
            ? "बेसिक 1 कुंडली · प्रीमियम 3 · प्लेटिनम 10। साल पर 20% कम।"
            : "Basic 1 chart · Premium 3 · Platinum 10. A year is 20% less."}
        </p>
        <div className="mt-4 grid gap-2">
          {(["basic", "premium", "platinum"] as const).map((tier) => (
            <div key={tier} className="grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => setPayPlan({ tier, span: "month" })}>
                {tier} · ₹{TIER_MONTH[tier]}
                <span className="ml-1 text-xs text-muted">{TIER_CHARTS[tier]}</span>
              </Button>
              <Button variant="secondary" onClick={() => setPayPlan({ tier, span: "year" })}>
                {lang === "hi" ? "साल" : "year"} · ₹{tierYear(tier)}
              </Button>
            </div>
          ))}
        </div>
        {payPlan ? (
          <UpiPay
            amount={payPlan.span === "month" ? TIER_MONTH[payPlan.tier] : tierYear(payPlan.tier)}
            note={`TaraNidhi ${payPlan.tier} ${payPlan.span}`}
            onPaid={() => {
              billing.activate(payPlan.span, payPlan.tier);
              rememberAccount({
                name: profile.name,
                email: profile.email || "",
                whatsapp: profile.whatsapp || "",
                city: profile.city,
                plan: `${payPlan.tier}-${payPlan.span}`,
              });
              setPayPlan(null);
            }}
          />
        ) : null}
        <label className="mt-6 block text-sm">
          {lang === "hi" ? "ऐक्टिवेशन चाबी" : "Activation key"}
          <input
            value={keyText}
            onChange={(e) => setKeyText(e.target.value)}
            placeholder="TN-PRE-365-...."
            className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-3 text-base uppercase"
          />
        </label>
        <Button
          className="mt-2 w-full"
          onClick={() => {
            const ok = billing.activateKey(keyText);
            setKeyMsg(
              ok
                ? lang === "hi"
                  ? "चाबी लग गई। वैधता ऊपर लिखी है।"
                  : "Key accepted. The validity is written above."
                : lang === "hi"
                  ? "यह चाबी नहीं खुली। अक्षर जाँचें।"
                  : "This key did not open. Check the letters.",
            );
          }}
        >
          {lang === "hi" ? "चाबी लगाएँ" : "Activate key"}
        </Button>
        {keyMsg ? <p className="mt-2 text-sm">{keyMsg}</p> : null}
        <div className="mt-6 border-t border-line pt-4">
          <p className="text-sm font-medium">
            {lang === "hi" ? "क्लाइंट के लिए चाबी बनाएँ" : "Make a key for a client"}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["basic", "premium", "platinum"] as const).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setKeyTier(tier)}
                className={
                  keyTier === tier
                    ? "min-h-10 rounded-full bg-ink px-3 text-sm text-bg"
                    : "min-h-10 rounded-full border border-line px-3 text-sm"
                }
              >
                {tier} · {TIER_CHARTS[tier]}
              </button>
            ))}
            {[30, 365].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setKeyDays(days)}
                className={
                  keyDays === days
                    ? "min-h-10 rounded-full bg-ink px-3 text-sm text-bg"
                    : "min-h-10 rounded-full border border-line px-3 text-sm"
                }
              >
                {days} {lang === "hi" ? "दिन" : "days"}
              </button>
            ))}
          </div>
          <Button
            variant="secondary"
            className="mt-3 w-full"
            onClick={() => {
              const key = makeActivationKey(keyTier, keyDays);
              setMadeKey(key);
              rememberAccount({
                name: profile.name,
                email: profile.email || "",
                whatsapp: profile.whatsapp || "",
                city: profile.city,
                plan: `key-${keyTier}-${keyDays}`,
              });
            }}
          >
            {lang === "hi" ? "चाबी निकालें" : "Generate key"}
          </Button>
          {madeKey ? <p className="mt-2 break-all font-mono text-base">{madeKey}</p> : null}
          <Button
            variant="ghost"
            className="mt-3 w-full"
            onClick={() => {
              const blob = new Blob([ledgerCsv()], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "taranidhi-accounts.csv";
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            {lang === "hi" ? "रजिस्टर की CSV डाउनलोड करें" : "Download the register CSV"}
          </Button>
          <label className="mt-4 block text-sm">
            {lang === "hi" ? "Apps Script URL" : "Apps Script URL"}
            <input
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-3 text-sm"
            />
          </label>
          <Button
            variant="secondary"
            className="mt-2 w-full"
            onClick={() => {
              saveScriptUrl(script);
              setKeyMsg(lang === "hi" ? "स्क्रिप्ट पता सेव हो गया। अगला रजिस्टर शीट में जाएगा।" : "Script address saved. The next register goes to the sheet.");
            }}
          >
            {lang === "hi" ? "स्क्रिप्ट पता सेव करें" : "Save script address"}
          </Button>
          <p className="mt-2 text-sm text-muted">
            {lang === "hi"
              ? "बैंक भुगतान खुद नहीं बताता। UPI के बाद एक बटन इस फोन को चालू करता है। चाबी क्लाइंट को आप देते हैं। नाम, ईमेल और व्हाट्सएप इस फोन पर और CSV में रहते हैं।"
              : "The bank does not tell this app that money arrived. After UPI, one button turns this phone on. You send the key to a client. Name, email and WhatsApp stay on this phone and in the CSV."}
          </p>
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-xl">{lang === "hi" ? "ऐप कैसे चलता है" : "How to use the app"}</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
          <li>{lang === "hi" ? "निधि में जन्म तिथि, समय और शहर सेव करें। बेसिक में एक कुंडली, प्रीमियम में तीन, प्लेटिनम में दस।" : "In Nidhi, save birth date, time and city. Basic keeps one chart, Premium three, Platinum ten."}</li>
          <li>{lang === "hi" ? "मुहूर्त में काम चुनें। तारीख और Submit उसी के नीचे हैं। सूची के बाद स्क्रॉल नहीं करना।" : "On Muhurat, pick the work. The dates and Submit sit under it. You do not scroll past the list."}</li>
          <li>{lang === "hi" ? "तीन शुभ मुहूर्त आते हैं। कार्ड पर 1 अंग, 2 सावधानी, 3 पढ़ने का तरीका। गोल्डन तभी जब नवतार, चंद्रबल, मुख्य आधा, पक्षी और बंद सूत्र एक साथ मिलें।" : "Three open muhurats come back. The card has 1 limbs, 2 cautions, 3 how to read. Golden needs the navtara, the Moon, the first half, the bird and a clear sutra together."}</li>
          <li>{lang === "hi" ? "अंग का बटन दबाने पर उसका प्रभाव खुलता है: तिथि, वार, होरा, उपहोरा, नवतार, पक्ष, चंद्रबल, ताराबल।" : "Press a limb and its effect opens: tithi, weekday, hora, uphora, navtara, paksha, chandrabala, tarabala."}</li>
          <li>{lang === "hi" ? "पक्षी टैब उसी घंटे का पक्षी दिखाता है। मुहूर्त कार्ड से भी खुलता है।" : "The Pakshi tab shows that hour's bird. The muhurat card opens it too."}</li>
          <li>{lang === "hi" ? "डेमो तीन दिन। उसके बाद निधि में चाबी लगाएँ, या UPI से प्लान चालू करें। वैधता ऊपर लिखी रहती है।" : "The demo is three days. Then enter a key in Nidhi, or turn a plan on with UPI. The validity stays written above."}</li>
        </ol>
      </Card>
      <Card>
        <h2 className="font-display text-xl">{t("method")}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {lang === "hi"
            ? "नंबर आठ हिस्सों का है। एडवांस में चंद्रबल 22% है, सबसे भारी हिस्सा। बल जन्म राशि से 1, 3, 6, 7, 10, 11 पर है। छठी को नहीं टाला जाता। बल न हो तो खिड़की रहती है, नंबर नीचे आता है। पंचांग 16%, नवतारा 16%, होरा 10%, पक्षी 8%, गोचर 12%, दशा 10%, योग 6%।"
            : "Eight parts make the number. In Advance, Chandra Bala is 22%, the heaviest part. Bala is 1, 3, 6, 7, 10 and 11 from the birth sign. The 6th is not avoided. Without bala the window stays and the number falls. Panchang 16%, Navtara 16%, hora 10%, bird 8%, gochar 12%, dasha 10%, yoga 6%."}
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
              {c} · {ACTIVITIES.filter((a) => a.category === c && !isHeld(a)).length}
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

function wallNow(tz: number) {
  const shifted = new Date(Date.now() + tz * 3600000);
  return new Date(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth(),
    shifted.getUTCDate(),
    shifted.getUTCHours(),
    shifted.getUTCMinutes(),
    shifted.getUTCSeconds(),
  );
}

function MomentLagna({ profile, lang }: { profile: Profile; lang: "hi" | "en" }) {
  const now = getBirthChart(wallNow(profile.tz), profile.lat, profile.lon, profile.tz);
  return (
    <div className="mt-3">
      <p className="text-sm">
        {lang === "hi" ? "लग्न" : "Lagna"} {localName(now.lagna, lang)} · D9{" "}
        {localName(RASHIS[navamsaSign(now.lagnaIndex * 30 + 15)], lang)} · {profile.city}
      </p>
      <ul className="mt-2 space-y-1 text-sm">
        {now.grahas.map((g) => (
          <li key={g.name} className="flex justify-between gap-3">
            <span>{localName(g.name, lang)}</span>
            <span className="text-right text-muted">
              {localName(g.rashi, lang)} · {g.houseFromLagna} · D9 {localName(RASHIS[navamsaSign(g.lon)], lang)}
            </span>
          </li>
        ))}
      </ul>
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
