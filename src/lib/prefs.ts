import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "en" | "hi";
export type Theme = "light" | "dark" | "divine" | "professional";

type Prefs = {
  lang: Lang;
  theme: Theme;
  setLang: (lang: Lang) => void;
  setTheme: (theme: Theme) => void;
};

export const usePrefs = create<Prefs>()(
  persist(
    (set) => ({
      lang: "hi",
      theme: "light",
      setLang: (lang) => set({ lang }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: "taranidhi-prefs" },
  ),
);

const en = {
  today: "Today",
  muhurat: "Muhurat",
  panchang: "Panchang",
  pakshi: "Pakshi",
  calendar: "Calendar",
  nidhi: "Nidhi",
  chart: "Your chart",
  editChart: "Edit birth chart",
  addChart: "Add a chart",
  profiles: "Saved charts",
  profileLimit: "Basic keeps 3 charts. Remove one to add another.",
  saved: "Birth chart saved on this device.",
  language: "Language",
  theme: "Theme",
  light: "Light",
  dark: "Dark",
  divine: "Divine",
  professional: "Professional",
  plans: "Plan",
  demo: "3-day demo",
  pay: "Pay with UPI",
  openUpi: "Open UPI app",
  paid: "I have paid",
  month: "1 month",
  year: "1 year",
  scan: "Scan this QR in PhonePe, GPay or Paytm.",
  method: "What the score uses",
} as const;

const hi: Record<keyof typeof en, string> = {
  today: "आज",
  muhurat: "मुहूर्त",
  panchang: "पंचांग",
  pakshi: "पक्षी",
  calendar: "कैलेंडर",
  nidhi: "निधि",
  chart: "आपकी कुंडली",
  editChart: "कुंडली बदलें",
  addChart: "एक और कुंडली",
  profiles: "सेव कुंडलियाँ",
  profileLimit: "बेसिक में 3 कुंडली। नई जोड़ने के लिए एक हटाएँ।",
  saved: "कुंडली इस डिवाइस पर सेव हो गई।",
  language: "भाषा",
  theme: "थीम",
  light: "हल्की",
  dark: "गहरी",
  divine: "दिव्य",
  professional: "प्रोफेशनल",
  plans: "प्लान",
  demo: "3 दिन का डेमो",
  pay: "UPI से भरें",
  openUpi: "UPI ऐप खोलें",
  paid: "भुगतान हो गया",
  month: "1 महीना",
  year: "1 साल",
  scan: "PhonePe, GPay या Paytm से यह QR स्कैन करें।",
  method: "स्कोर किन नियमों से बनता है",
};

export function useT() {
  const lang = usePrefs((s) => s.lang);
  const table = lang === "hi" ? hi : en;
  return { lang, t: (key: keyof typeof en) => table[key] };
}
