import { BirthForm } from "@/components/birth-form";
import { useProfile } from "@/lib/panchang/store";

export function Onboarding() {
  const setProfile = useProfile((s) => s.setProfile);

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">Personal panchang</p>
      <h1 className="mt-2 font-display text-4xl leading-tight">TaraNidhi</h1>
      <p className="mt-3 text-muted leading-relaxed">
        Universal almanacs ignore who you are. TaraNidhi scores every window against your birth
        star, dasha, and the work itself — a call, a joining, a wedding, a launch.
      </p>
      <div className="mt-8">
        <BirthForm submitLabel="Calculate my chart" onSave={setProfile} />
      </div>
      <p className="mt-4 text-center text-xs text-subtle">
        Stored only on this device. Time and place accuracy improve Tara and Chandra Bala.
      </p>
    </div>
  );
}
