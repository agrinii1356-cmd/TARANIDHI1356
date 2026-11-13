export const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
] as const;

export const NAKSHATRA_LORDS = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
] as const;

export const NAKSHATRA_GROUPS: Record<string, string[]> = {
  fixed: ["Rohini", "Uttara Phalguni", "Uttara Ashadha", "Uttara Bhadrapada"],
  soft: ["Mrigashira", "Chitra", "Anuradha", "Revati"],
  swift: ["Ashwini", "Pushya", "Hasta"],
  movable: ["Punarvasu", "Swati", "Shravana", "Dhanishta", "Shatabhisha"],
  sharp: ["Ardra", "Ashlesha", "Jyeshtha", "Mula"],
  fierce: ["Bharani", "Magha", "Purva Phalguni", "Purva Ashadha", "Purva Bhadrapada"],
  mixed: ["Krittika", "Vishakha"],
};

export const NAKSHATRA_GUNA: Record<string, "sattva" | "rajas" | "tamas"> = {
  Ashwini: "rajas",
  Bharani: "tamas",
  Krittika: "rajas",
  Rohini: "sattva",
  Mrigashira: "rajas",
  Ardra: "tamas",
  Punarvasu: "sattva",
  Pushya: "sattva",
  Ashlesha: "tamas",
  Magha: "tamas",
  "Purva Phalguni": "rajas",
  "Uttara Phalguni": "sattva",
  Hasta: "rajas",
  Chitra: "rajas",
  Swati: "rajas",
  Vishakha: "rajas",
  Anuradha: "sattva",
  Jyeshtha: "tamas",
  Mula: "tamas",
  "Purva Ashadha": "rajas",
  "Uttara Ashadha": "sattva",
  Shravana: "sattva",
  Dhanishta: "rajas",
  Shatabhisha: "tamas",
  "Purva Bhadrapada": "tamas",
  "Uttara Bhadrapada": "sattva",
  Revati: "sattva",
};

export const TITHIS = [
  "Pratipada",
  "Dwitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashthi",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dwadashi",
  "Trayodashi",
  "Chaturdashi",
  "Purnima",
  "Pratipada",
  "Dwitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashthi",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dwadashi",
  "Trayodashi",
  "Chaturdashi",
  "Amavasya",
] as const;

export const SHUBH_TITHIS = new Set([2, 3, 5, 7, 10, 11, 12, 13, 15]);
export const RIKTA_TITHIS = new Set([4, 9, 14]);

export const YOGAS = [
  "Vishkambha",
  "Priti",
  "Ayushman",
  "Saubhagya",
  "Shobhana",
  "Atiganda",
  "Sukarma",
  "Dhriti",
  "Shula",
  "Ganda",
  "Vriddhi",
  "Dhruva",
  "Vyaghata",
  "Harshana",
  "Vajra",
  "Siddhi",
  "Vyatipata",
  "Variyan",
  "Parigha",
  "Shiva",
  "Siddha",
  "Sadhya",
  "Shubha",
  "Shukla",
  "Brahma",
  "Indra",
  "Vaidhriti",
] as const;

export const SHUBH_YOGAS = new Set([
  "Priti",
  "Ayushman",
  "Saubhagya",
  "Shobhana",
  "Sukarma",
  "Dhriti",
  "Vriddhi",
  "Dhruva",
  "Harshana",
  "Siddhi",
  "Shiva",
  "Siddha",
  "Sadhya",
  "Shubha",
  "Shukla",
  "Brahma",
  "Indra",
]);

export const ASHUBH_YOGAS = new Set([
  "Vishkambha",
  "Atiganda",
  "Shula",
  "Ganda",
  "Vyaghata",
  "Vajra",
  "Vyatipata",
  "Variyan",
  "Parigha",
  "Vaidhriti",
]);

/** All 27 nitya yogas. Tyajya closes a start. Shubh is kept ahead of a merely open hour. */
export const YOGA_FRUIT: Record<string, string> = {
  Vishkambha: "obstacle at the first step",
  Priti: "affection and agreement",
  Ayushman: "the work lives long",
  Saubhagya: "fortune",
  Shobhana: "splendour",
  Atiganda: "excess and accident",
  Sukarma: "a clean act",
  Dhriti: "it holds",
  Shula: "a sharp cut",
  Ganda: "a knot in the work",
  Vriddhi: "increase",
  Dhruva: "what should stay fixed",
  Vyaghata: "a beating, a loss",
  Harshana: "joy",
  Vajra: "hard and brittle",
  Siddhi: "the work completes",
  Vyatipata: "calamity",
  Variyan: "leave this hour out",
  Parigha: "a bar across the door",
  Shiva: "a calm, auspicious hour",
  Siddha: "already accomplished",
  Sadhya: "it can be achieved",
  Shubha: "plain good",
  Shukla: "bright",
  Brahma: "fit for a vow or study",
  Indra: "authority",
  Vaidhriti: "separation",
};

export const MOVABLE_KARANAS = [
  "Bava",
  "Balava",
  "Kaulava",
  "Taitila",
  "Garaja",
  "Vanija",
  "Vishti",
] as const;

export const FIXED_KARANAS = ["Shakuni", "Chatushpada", "Naga"] as const;

export const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const WEEKDAY_LORDS: Record<string, string> = {
  Sunday: "Sun",
  Monday: "Moon",
  Tuesday: "Mars",
  Wednesday: "Mercury",
  Thursday: "Jupiter",
  Friday: "Venus",
  Saturday: "Saturn",
};

export const TARA_NAMES: Record<number, string> = {
  1: "Janma",
  2: "Sampat",
  3: "Vipat",
  4: "Kshema",
  5: "Pratyak",
  6: "Sadhana",
  7: "Naidhana",
  8: "Mitra",
  9: "Parama Mitra",
};

export const SHUBH_TARAS = new Set([2, 4, 6, 8, 9]);

export const RASHIS = [
  "Mesha",
  "Vrishabha",
  "Mithuna",
  "Karka",
  "Simha",
  "Kanya",
  "Tula",
  "Vrishchika",
  "Dhanu",
  "Makara",
  "Kumbha",
  "Meena",
] as const;

export const RASHI_TATVA: Array<"agni" | "prithvi" | "vayu" | "jala"> = [
  "agni",
  "prithvi",
  "vayu",
  "jala",
  "agni",
  "prithvi",
  "vayu",
  "jala",
  "agni",
  "prithvi",
  "vayu",
  "jala",
];

export const HORA_SEQUENCE: Record<string, string[]> = {
  Sunday: ["Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars"],
  Monday: ["Moon", "Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury"],
  Tuesday: ["Mars", "Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter"],
  Wednesday: ["Mercury", "Moon", "Saturn", "Jupiter", "Mars", "Sun", "Venus"],
  Thursday: ["Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Saturn"],
  Friday: ["Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars", "Sun"],
  Saturday: ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"],
};

/** Weekday → nakshatra that forms Amrit Siddhi Yoga. */
export const AMRIT_SIDDHI: Record<string, string> = {
  Sunday: "Hasta",
  Monday: "Mrigashira",
  Tuesday: "Ashwini",
  Wednesday: "Anuradha",
  Thursday: "Pushya",
  Friday: "Revati",
  Saturday: "Rohini",
};

/** Weekday → nakshatras that form Sarvartha Siddhi Yoga. */
export const SARVARTHA_SIDDHI: Record<string, string[]> = {
  Sunday: ["Ashwini", "Pushya", "Hasta", "Uttara Ashadha", "Uttara Bhadrapada", "Revati"],
  Monday: ["Rohini", "Mrigashira", "Pushya", "Anuradha", "Shravana"],
  Tuesday: ["Ashwini", "Krittika", "Ashlesha", "Uttara Bhadrapada"],
  Wednesday: ["Krittika", "Rohini", "Mrigashira", "Hasta", "Anuradha"],
  Thursday: ["Ashwini", "Punarvasu", "Pushya", "Anuradha", "Revati"],
  Friday: ["Ashwini", "Anuradha", "Revati", "Hasta"],
  Saturday: ["Rohini", "Swati", "Shravana", "Shatabhisha"],
};

export const VIMSHOTTARI: { lord: string; years: number }[] = [
  { lord: "Ketu", years: 7 },
  { lord: "Venus", years: 20 },
  { lord: "Sun", years: 6 },
  { lord: "Moon", years: 10 },
  { lord: "Mars", years: 7 },
  { lord: "Rahu", years: 18 },
  { lord: "Jupiter", years: 16 },
  { lord: "Saturn", years: 19 },
  { lord: "Mercury", years: 17 },
];

export const PURUSHARTHA_CYCLE = ["dharma", "artha", "kama", "moksha"] as const;
