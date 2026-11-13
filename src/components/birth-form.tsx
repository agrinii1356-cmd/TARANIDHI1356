import { useState } from "react";
import { PlacePicker } from "@/components/place-picker";
import { CITIES, type Place } from "@/lib/panchang/cities";
import type { Profile } from "@/lib/panchang/store";
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
  const [name, setName] = useState(initial?.name ?? "");
  const [date, setDate] = useState(initial?.date ?? "1992-08-14");
  const [time, setTime] = useState(initial?.time ?? "10:30");
  const [place, setPlace] = useState<Place | null>(placeFromProfile(initial) ?? CITIES[0]);
  const [error, setError] = useState("");

  function save() {
    if (!place) {
      setError("Choose a birth place so the chart can be calculated.");
      return;
    }
    setError("");
    onSave({
      name: name.trim() || "You",
      date,
      time,
      city: place.region ? `${place.name}, ${place.region}` : place.name,
      lat: place.lat,
      lon: place.lon,
      tz: place.tz,
    });
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
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoComplete="name"
        />
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
