import type { Activity } from "./activities";
import { NAKSHATRA_GROUPS } from "./constants";
import { limbEffect } from "./effects";
import type { Panchang } from "./engine";
import { formatTime } from "../format";
import { localName } from "./names";
import type { Lang } from "../prefs";

export type EventPrabhav = { lines: string[]; tone: "good" | "bad" | "warn" };

const AIM: Record<string, [string, string]> = {
  Career: ["the post and the first impression", "पद और पहली छाप"],
  Business: ["the deal and the partnership", "सौदा और साझेदारी"],
  Marketing: ["the call and the public reach", "कॉल और सार्वजनिक पहुँच"],
  Finance: ["the money moving", "पैसे का चलना"],
  Health: ["the treatment", "इलाज"],
  Travel: ["the departure", "प्रस्थान"],
  Purchase: ["the purchase", "खरीद"],
  "Real Estate": ["the house or the land", "घर या ज़मीन"],
  Relationship: ["the bond", "रिश्ता"],
  Family: ["the household", "घर-परिवार"],
  Education: ["the study", "पढ़ाई"],
  Legal: ["the filing", "दाखिल करना"],
  Civic: ["the public office", "सार्वजनिक पद"],
  Media: ["the release", "रिलीज़"],
  Technology: ["the launch", "लॉन्च"],
  Daily: ["this hour of work", "काम का यह घंटा"],
  Spiritual: ["the vow", "व्रत"],
};

/** Planet, nakshatra, rashi and clock, and what they do to this one event. Shown for a good hour and a bad hour alike. */
export function eventPrabhav(act: Activity, p: Panchang, lang: Lang): EventPrabhav {
  const star = p.nakshatra.name;
  const lord = p.nakshatra.lord;
  const rashi = p.moonRashi.name;
  const chosen = act.preferredNakshatra.includes(star);
  const against =
    !chosen &&
    (NAKSHATRA_GROUPS.fierce.includes(star) || NAKSHATRA_GROUPS.sharp.includes(star));
  const horaHelps = act.karaka.includes(p.horaLord);
  const sameTatva = p.moonRashi.tatva === act.tatva;
  const fruit = limbEffect("nakshatra", star, lang);
  const nm = (name: string) => localName(name, lang);
  const work = lang === "hi" ? act.nameHi : act.name;
  const aim = AIM[act.category] ?? ["this work", "यह काम"];
  const from = formatTime(p.horaWindow.start);
  const until = formatTime(p.horaWindow.end);
  const tone = chosen && horaHelps ? "good" : against ? "bad" : "warn";

  if (lang === "hi") {
    return {
      tone,
      lines: [
        `${from} से ${until} तक। चंद्र ${nm(star)} नक्षत्र में, राशि ${nm(rashi)}। नक्षत्र का स्वामी ${nm(lord)}। होरा ${nm(p.horaLord)} की, ${nm(p.uphora.label)}।`,
        chosen
          ? `${work}: ${nm(lord)} का यह नक्षत्र ${aim[1]} के लिए रखा गया है। प्रभाव अनुकूल है।`
          : against
            ? `${work}: ${nm(lord)} का यह नक्षत्र ${aim[1]} को रोकता है। प्रभाव प्रतिकूल है।`
            : `${work}: यह नक्षत्र ${aim[1]} की पहली पसंद नहीं। प्रभाव मध्यम है।`,
        horaHelps
          ? `${nm(p.horaLord)} इस काम का कारक ग्रह है, इसलिए इस घंटे का नतीजा भारी है।`
          : `${nm(p.horaLord)} इस काम का कारक नहीं, इसलिए होरा का नतीजा हल्का है।`,
        sameTatva
          ? `${nm(rashi)} का तत्त्व ${nm(p.moonRashi.tatva)} इस काम के तत्त्व से मिलता है।`
          : `${nm(rashi)} का तत्त्व ${nm(p.moonRashi.tatva)} इस काम के तत्त्व ${nm(act.tatva)} से अलग है।`,
        fruit,
      ],
    };
  }
  return {
    tone,
    lines: [
      `${from} to ${until}. The Moon is in ${star}, rashi ${rashi}. The star's lord is ${lord}. Hora is ${p.horaLord}, ${p.uphora.label}.`,
      chosen
        ? `${work}: ${lord}'s star is kept for ${aim[0]}. The effect supports it.`
        : against
          ? `${work}: ${lord}'s star works against ${aim[0]}. The effect is adverse.`
          : `${work}: this star is not the first choice for ${aim[0]}. The effect is ordinary.`,
      horaHelps
        ? `${p.horaLord} is a karaka of this work, so this hour weighs more.`
        : `${p.horaLord} is not a karaka of this work, so the hora result stays light.`,
      sameTatva
        ? `${rashi}'s element ${p.moonRashi.tatva} matches this work.`
        : `${rashi}'s element ${p.moonRashi.tatva} is not this work's element ${act.tatva}.`,
      fruit,
    ],
  };
}
