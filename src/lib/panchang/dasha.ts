import { NAKSHATRA_LORDS, NAKSHATRAS, VIMSHOTTARI } from "./constants";

const YEAR_MS = 365.25 * 24 * 3600 * 1000;
const SPAN = 360 / 27;

export type DashaSlice = {
  maha: string;
  antar: string;
  mahaStart: Date;
  mahaEnd: Date;
  antarStart: Date;
  antarEnd: Date;
  balanceYearsAtBirth: number;
  janmaNakshatra: string;
};

function lordIndex(lord: string) {
  const i = VIMSHOTTARI.findIndex((v) => v.lord === lord);
  return i < 0 ? 0 : i;
}

function yearsOf(lord: string) {
  return VIMSHOTTARI[lordIndex(lord)]?.years ?? 10;
}

function antarSpans(mdLord: string, mdYears: number) {
  const start = lordIndex(mdLord);
  return Array.from({ length: 9 }, (_, k) => {
    const lord = VIMSHOTTARI[(start + k) % 9].lord;
    const years = (mdYears * yearsOf(lord)) / 120;
    return { lord, years };
  });
}

export function vimshottariAt(birth: Date, moonSid: number, at: Date): DashaSlice {
  const lon = ((moonSid % 360) + 360) % 360;
  const idx = Math.floor(lon / SPAN) % 27;
  const janmaLord = NAKSHATRA_LORDS[idx % 9];
  const janmaNakshatra = NAKSHATRAS[idx];
  const elapsedFrac = (lon % SPAN) / SPAN;
  const remainFrac = Math.max(0, Math.min(1, 1 - elapsedFrac));
  const fullFirst = yearsOf(janmaLord);
  const balanceYearsAtBirth = remainFrac * fullFirst;
  const elapsedInFirst = fullFirst - balanceYearsAtBirth;

  const birthMs = birth.getTime();
  const atMs = at.getTime();

  // Walk mahadashas from birth (first is partial).
  let cursor = birthMs;
  let mdI = lordIndex(janmaLord);
  let first = true;

  for (let n = 0; n < 27; n++) {
    const md = VIMSHOTTARI[mdI % 9];
    const mdYears = first ? balanceYearsAtBirth : md.years;
    const mdStart = cursor;
    const mdEnd = cursor + mdYears * YEAR_MS;
    if (atMs <= mdEnd || n === 26) {
      const antars = antarSpans(md.lord, md.years);
      let skip = first ? elapsedInFirst : 0;
      let aStart = mdStart;
      for (const a of antars) {
        const aYears = a.years;
        if (skip >= aYears - 1e-9) {
          skip -= aYears;
          continue;
        }
        const remainingAntar = aYears - skip;
        skip = 0;
        const aEnd = aStart + remainingAntar * YEAR_MS;
        if (atMs <= aEnd) {
          return {
            maha: md.lord,
            antar: a.lord,
            mahaStart: new Date(mdStart),
            mahaEnd: new Date(mdEnd),
            antarStart: new Date(aStart),
            antarEnd: new Date(aEnd),
            balanceYearsAtBirth,
            janmaNakshatra,
          };
        }
        aStart = aEnd;
      }
      return {
        maha: md.lord,
        antar: antars[antars.length - 1].lord,
        mahaStart: new Date(mdStart),
        mahaEnd: new Date(mdEnd),
        antarStart: new Date(aStart),
        antarEnd: new Date(mdEnd),
        balanceYearsAtBirth,
        janmaNakshatra,
      };
    }
    cursor = mdEnd;
    mdI += 1;
    first = false;
  }

  const last = VIMSHOTTARI[lordIndex(janmaLord)];
  return {
    maha: last.lord,
    antar: last.lord,
    mahaStart: birth,
    mahaEnd: new Date(birthMs + 120 * YEAR_MS),
    antarStart: birth,
    antarEnd: new Date(birthMs + 120 * YEAR_MS),
    balanceYearsAtBirth,
    janmaNakshatra,
  };
}

export function formatDasha(d: DashaSlice) {
  return `${d.maha} / ${d.antar}`;
}
