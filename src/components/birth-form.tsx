import { useState } from "react";
import { PlacePicker } from "@/components/place-picker";
import { CITIES, type Place } from "@/lib/panchang/cities";
import type { Profile } from "@/lib/panchang/store";
import { rememberAccount } from "@/lib/panchang/store";
import { usePrefs } from "@/lib/prefs";
import { Button } from "./ui/button";
import { Input, Label } from "./ui/input";

function placeFromProfile(p?: Partial<Profile> | null): Place | null {
  if (!p?.city || p.lat == null || p.lon == null) return null;
  const known = CITIES.find(
    (c) => c.name === p.city || p.city?.startsWith(c.name + ",") || p.city === `${c.name}, ${c.region}`,
  );
  return {
    name: known?.name ?? p.city.split(",")[0].trim(),
    region: known?.region ?? (p.city.includes(",") ? p.city.split(",").slice(1).join(",").trim() : ""),
    lat: p.lat,
    lon: p.lon,
    tz: p.tz ?? 5.5,
  };
}

type Props = {
  initial?: Partial<Profile> | null;
  submitLabel: string;
  onSave: (profile: Profile) => void;
  onCancel?: () => void;
};

export function BirthForm({ initial, submitLabel, onSave, onCancel }: Props) {
  const lang = usePrefs((s) => s.lang);
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [whatsapp, setWhatsapp] = useState(initial?.whatsapp ?? "");
  const [date, setDate] = useState(initial?.date ?? "1992-08-14");
  const [time, setTime] = useState(initial?.time ?? "10:30");
  const [place, setPlace] = useState<Place | null>(placeFromProfile(initial) ?? CITIES[0]);
  const [error, setError] = useState("");

  function save() {
    const phone = whatsapp.replace(/\D/g, "");
    if (name.trim().length < 2) {
      setError(lang === "hi" ? "नाम लिखें।" : "Write your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(lang === "hi" ? "सही ईमेल लिखें।" : "Write a real email.");
      return;
    }
    if (phone.length < 10) {
      setError(lang === "hi" ? "व्हाट्सएप नंबर 10 अंक का होना चाहिए।" : "WhatsApp needs 10 digits.");
      return;
    }
    if (!place) {
      setError(lang === "hi" ? "जन्म स्थान चुनें।" : "Choose a birth place so the chart can be calculated.");
      return;
    }
    setError("");
    const city = place.region ? `${place.name}, ${place.region}` : place.name;
    const profile: Profile = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      whatsapp: phone.slice(-10),
      date,
      time,
      city,
      lat: place.lat,
      lon: place.lon,
      tz: place.tz,
    };
    rememberAccount({ name: profile.name, email: profile.email, whatsapp: profile.whatsapp, city, plan: "register" });
    onSave(profile);
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <div>
        <Label htmlFor="name">{lang === "hi" ? "नाम" : "Name"}</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={lang === "hi" ? "पूरा नाम" : "Your name"} autoComplete="name" required />
      </div>
      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
        <div>
          <Label htmlFor="email">{lang === "hi" ? "ईमेल" : "Email"}</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" autoComplete="email" required />
        </div>
        <div>
          <Label htmlFor="wa">{lang === "hi" ? "व्हाट्सएप" : "WhatsApp"}</Label>
          <Input id="wa" inputMode="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="98XXXXXXXX" autoComplete="tel" required />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
        <div>
          <Label htmlFor="dob">Date of birth</Label>
          <Input id="dob" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="tob">Time of birth</Label>
          <Input id="tob" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </div>
      </div>
      <PlacePicker value={place} onChange={setPlace} />
      {error ? <p className="text-sm text-bad">{error}</p> : null}
      <Button type="submit" className="w-full" size="lg">
        {submitLabel}
      </Button>
      {onCancel ? (
        <Button type="button" variant="ghost" className="w-full" onClick={onCancel}>
          Cancel
        </Button>
      ) : null}
    </form>
  );
}
