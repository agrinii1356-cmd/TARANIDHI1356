import { ASHUBH_YOGAS, YOGA_FRUIT } from "./constants";
import type { Lang } from "../prefs";

const hi = (en: string, hiText: string, lang: Lang) => (lang === "hi" ? hiText : en);

const TITHI: Record<string, [string, string]> = {
  Pratipada: ["A quiet start only. Not a strong tithi.", "हल्की शुरुआत। ज़ोरदार मुहूर्त नहीं।"],
  Dwitiya: ["Good for beginning a work.", "काम शुरू करने के लिए अच्छी।"],
  Tritiya: ["Strength is growing. A clean start.", "बल बढ़ता है। साफ शुरुआत।"],
  Chaturthi: ["Rikta. Do not start a new work.", "रिक्ता। नया काम शुरू न करें।"],
  Panchami: ["Good for learning, medicine and a careful start.", "पढ़ाई, दवा और सावधान शुरुआत के लिए अच्छी।"],
  Shashthi: ["Fit for a contest. Weak for a gentle agreement.", "मुकाबले के लिए। नरम समझौते के लिए कमज़ोर।"],
  Saptami: ["Good for a start that should move.", "जो काम चलना चाहिए, उसके लिए अच्छी।"],
  Ashtami: ["Avoid a fresh start. Krishna Ashtami is harsher.", "नई शुरुआत छोड़ें। कृष्ण अष्टमी और कड़ी है।"],
  Navami: ["Rikta. Avoid.", "रिक्ता। छोड़ें।"],
  Dashami: ["Good when the work should be completed.", "जो काम पूरा करना हो, उसके लिए अच्छी।"],
  Ekadashi: ["Good for a vow. Mixed for buying and selling.", "व्रत के लिए अच्छी। लेन-देन में मिली-जुली।"],
  Dwadashi: ["Good for a start.", "शुरुआत के लिए अच्छी।"],
  Trayodashi: ["Good for a start that needs courage.", "हिम्मत वाले काम के लिए अच्छी।"],
  Chaturdashi: ["Rikta. Avoid a new start.", "रिक्ता। नई शुरुआत न करें।"],
  Purnima: ["Good for worship and finishing. Do not cut or break.", "पूजा और समापन के लिए अच्छी। काटना या तोड़ना नहीं।"],
  Amavasya: ["Avoid most starts. Pitru work is the exception.", "अधिकतर शुरुआत छोड़ें। पितृ कार्य अलग है।"],
};

const VARA: Record<string, [string, string]> = {
  Sunday: ["Sun. Authority, office, government. Weak for borrowing.", "सूर्य। अधिकार, दफ़्तर, सरकार। उधार के लिए कमज़ोर।"],
  Monday: ["Moon. Mind, public, travel, water.", "चंद्र। मन, जनता, यात्रा, जल।"],
  Tuesday: ["Mars. Courage, but quarrels. Avoid a soft start.", "मंगल। हिम्मत, पर झगड़ा। नरम शुरुआत छोड़ें।"],
  Wednesday: ["Mercury. Trade, writing, accounts, calls.", "बुध। व्यापार, लिखाई, हिसाब, कॉल।"],
  Thursday: ["Jupiter. The kindest weekday for a blessed start.", "गुरु। शुभ शुरुआत के लिए सबसे नरम वार।"],
  Friday: ["Venus. Agreement, art, comfort, money.", "शुक्र। समझौता, कला, सुख, धन।"],
  Saturday: ["Saturn. Duty and delay. Do not begin what must finish soon.", "शनि। कर्तव्य और देरी। जल्दी खत्म होने वाला काम न शुरू करें।"],
};

const HORA: Record<string, [string, string]> = {
  Sun: ["Authority and office. The first half is the strong mukhya. The second half, uphora, is the same planet but weaker.", "अधिकार और दफ़्तर। पहला आधा मुख्य होरा, मज़बूत। दूसरा आधा उपहोरा, वही ग्रह पर कमज़ोर।"],
  Moon: ["Mind, public and short travel. Mukhya is stronger than uphora.", "मन, जनता और छोटी यात्रा। मुख्य होरा उपहोरा से मज़बूत।"],
  Mars: ["Courage and tools. It also brings a sharp word. Prefer the first half only if you must.", "हथियार और हिम्मत। बात भी तीखी हो सकती है। ज़रूरत हो तो सिर्फ़ पहला आधा।"],
  Mercury: ["Trade, letters, accounts and calls. Mukhya is the better half.", "व्यापार, पत्र, हिसाब और कॉल। मुख्य आधा बेहतर।"],
  Jupiter: ["The best hora for a start you want blessed. Use the first half.", "जो शुरुआत आशीर्वाद माँगे, उसके लिए सबसे अच्छी होरा। पहला आधा लें।"],
  Venus: ["Agreement, comfort, art and money. The first half is cleaner.", "समझौता, सुख, कला और धन। पहला आधा साफ़।"],
  Saturn: ["Delay, duty, old work. Do not open a fresh hope here. Uphora is weaker still.", "देरी, कर्तव्य, पुराना काम। नई आशा यहाँ न खोलें। उपहोरा और कमज़ोर।"],
};

const KARANA: Record<string, [string, string]> = {
  Bava: ["A movable karana. Usable for an ordinary start.", "चर करण। साधारण शुरुआत चल सकती है।"],
  Balava: ["Movable and gentle. Usable.", "चर और नरम। चल सकता है।"],
  Kaulava: ["Movable. Fit for work with other people.", "चर। दूसरों के साथ के काम के लिए।"],
  Taitila: ["Movable. Fit for a practical job.", "चर। व्यावहारिक काम के लिए।"],
  Garaja: ["Movable. Usable, a little rough.", "चर। चल सकता है, थोड़ा रूखा।"],
  Vanija: ["Movable. Made for trade.", "चर। व्यापार के लिए।"],
  Vishti: ["Bhadra. Do not start. This karana is closed.", "भद्रा। शुरू न करें। यह करण बंद है।"],
  Shakuni: ["A fixed karana. Avoid a fresh start.", "स्थिर करण। नई शुरुआत छोड़ें।"],
  Chatushpada: ["Fixed. Avoid.", "स्थिर। छोड़ें।"],
  Naga: ["Fixed. Avoid.", "स्थिर। छोड़ें।"],
  Kimstughna: ["The first fixed karana. Avoid a start.", "पहला स्थिर करण। शुरुआत छोड़ें।"],
};

const NAKSHATRA: Record<string, [string, string]> = {
  Ashwini: ["Swift. Healing and a quick start. Good for travel and medicine.", "लघु। इलाज और तेज़ शुरुआत। यात्रा और दवा के लिए।"],
  Bharani: ["Fierce. Restraint and Yama. Do not begin an auspicious work.", "उग्र। संयम और यम। शुभ काम शुरू न करें।"],
  Krittika: ["Mixed, the fire of the Sun. Cutting and purifying, not a soft start.", "मिश्रित, सूर्य की आग। काटना और शुद्ध करना। नरम शुरुआत नहीं।"],
  Rohini: ["Fixed and fertile. One of the best for a thing that should last: a vehicle, a house, a post.", "ध्रुव और उपजाऊ। जो टिके उसके लिए सबसे अच्छे में: गाड़ी, घर, पद।"],
  Mrigashira: ["Soft. A search, a gentle ask, a small beginning.", "मृदु। खोज, नरम माँग, छोटी शुरुआत।"],
  Ardra: ["Sharp. Storm and tearing down. Avoid a start.", "तीक्ष्ण। आँधी और गिराना। शुरुआत छोड़ें।"],
  Punarvasu: ["Movable. Return, renewal, and coming home.", "चर। लौटना, नवीनीकरण, घर आना।"],
  Pushya: ["The most nourishing star. Good for almost every clean start.", "सबसे पोषक नक्षत्र। लगभग हर साफ शुरुआत के लिए।"],
  Ashlesha: ["Sharp and coiling. Avoid marriage and a straight agreement.", "तीक्ष्ण और लिपटने वाला। विवाह और सीधा समझौता छोड़ें।"],
  Magha: ["Fierce. Ancestors and a throne. Authority, not a tender start.", "उग्र। पितृ और सिंहासन। अधिकार, कोमल शुरुआत नहीं।"],
  "Purva Phalguni": ["Fierce-soft. Pleasure and rest. Weak for a hard bargain.", "उग्र-मृदु। सुख और आराम। कड़ी सौदेबाज़ी के लिए कमज़ोर।"],
  "Uttara Phalguni": ["Fixed. Patronage and a marriage that should hold.", "ध्रुव। आश्रय और टिकने वाला विवाह।"],
  Hasta: ["Swift, the hand. Craft, skill, and a short precise job.", "लघु, हाथ। शिल्प, कौशल, छोटा सटीक काम।"],
  Chitra: ["Soft and bright. Design, clothes, a thing that should look right.", "मृदु और उजला। रूप, वस्त्र, जो अच्छा दिखे।"],
  Swati: ["Movable. Trade, independence, a move of place.", "चर। व्यापार, स्वतंत्रता, जगह बदलना।"],
  Vishakha: ["Mixed, two-forked. Determination. Do not lean on it alone.", "मिश्रित, दो तरफ़। दृढ़ता। अकेले इस पर भरोसा न करें।"],
  Anuradha: ["Soft. Friendship, devotion, and a bond.", "मृदु। मित्रता, भक्ति, और बंधन।"],
  Jyeshtha: ["Sharp. Seniority and pride. Easy to overreach. Avoid a humble start.", "तीक्ष्ण। वरिष्ठता और अहंकार। साधारण शुरुआत छोड़ें।"],
  Mula: ["Sharp, the root. Uprooting. Do not plant a new work.", "तीक्ष्ण, जड़। उखाड़ना। नया काम न रोपें।"],
  "Purva Ashadha": ["Fierce. A declaration. Invincible, but rough for a gentle ask.", "उग्र। घोषणा। अजेय, पर नरम माँग के लिए रूखा।"],
  "Uttara Ashadha": ["Fixed. A lasting victory and a final word.", "ध्रुव। टिकने वाली जीत और आखिरी बात।"],
  Shravana: ["Movable. Listening, learning, and news.", "चर। सुनना, सीखना, और समाचार।"],
  Dhanishta: ["Movable. Wealth and rhythm. The second half opens Panchak.", "चर। धन और लय। दूसरा आधा पंचक खोलता है।"],
  Shatabhisha: ["Movable. Healing and secrecy. A hundred remedies, not a public vow.", "चर। इलाज और गोपनीयता। सौ दवा, सार्वजनिक व्रत नहीं।"],
  "Purva Bhadrapada": ["Fierce. Fire and austerity. Avoid a comfortable start.", "उग्र। अग्नि और तप। आराम की शुरुआत छोड़ें।"],
  "Uttara Bhadrapada": ["Fixed and deep. An ending done properly, a foundation.", "ध्रुव और गहरा। ठीक से समाप्त करना, नींव।"],
  Revati: ["Soft. The journey's end, nourishment, and a safe marriage star.", "मृदु। यात्रा का अंत, पोषण, और सुरक्षित विवाह नक्षत्र।"],
};

export function limbEffect(
  kind: "tithi" | "vara" | "nakshatra" | "yoga" | "karana" | "hora" | "rahu" | "yamaganda" | "gulika" | "abhijit",
  name: string,
  lang: Lang,
): string {
  if (kind === "rahu") {
    return hi(
      "Closed. Do not start a work, a deal or a journey in this eighth of the day.",
      "बंद। दिन के इस आठवें भाग में काम, सौदा या यात्रा शुरू न करें।",
      lang,
    );
  }
  if (kind === "yamaganda") {
    return hi(
      "Yama's part. Avoid a start and a risky outing.",
      "यम का भाग। शुरुआत और जोखिम वाली बाहर-जाना छोड़ें।",
      lang,
    );
  }
  if (kind === "gulika") {
    return hi(
      "Saturn's part, Mandi. Do not open a new work.",
      "शनि का भाग, माण्डी। नया काम न खोलें।",
      lang,
    );
  }
  if (kind === "abhijit") {
    return hi(
      "The midday muhurta. It supports a start, unless Rahu Kaal covers it.",
      "दोपहर का मुहूर्त। शुरुआत में साथ देता है, जब तक राहु काल उस पर न चढ़े।",
      lang,
    );
  }
  if (kind === "tithi") {
    const base = name.split(" · ")[0];
    const row = TITHI[base];
    return row ? hi(row[0], row[1], lang) : name;
  }
  if (kind === "vara") {
    const row = VARA[name];
    return row ? hi(row[0], row[1], lang) : name;
  }
  if (kind === "hora") {
    const row = HORA[name];
    return row ? hi(row[0], row[1], lang) : name;
  }
  if (kind === "karana") {
    const row = KARANA[name];
    return row ? hi(row[0], row[1], lang) : name;
  }
  if (kind === "yoga") {
    const fruit = YOGA_FRUIT[name] ?? name;
    const closed = ASHUBH_YOGAS.has(name);
    return lang === "hi"
      ? `${fruit}। ${closed ? "यह योग त्याज्य है। शुरुआत बंद।" : "यह योग साथ देता है। शुरुआत चल सकती है।"}`
      : `${fruit}. ${closed ? "This yoga is tyajya. Do not start." : "This yoga supports a start."}`;
  }
  const star = NAKSHATRA[name];
  return star ? hi(star[0], star[1], lang) : name;
}
