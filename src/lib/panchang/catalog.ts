type Family = {
  category: string;
  subs: string[];
  actions: { en: string; hi: string }[];
  vara: string[];
  stars: string[];
  karaka: string[];
  avoid: number[];
  minTara: number;
  major?: boolean;
};

const FAMILIES: Family[] = [
  { category: "Career", subs: ["Interview", "Offer", "Joining", "Review", "Promotion", "Exit", "Networking", "Remote"], actions: [
    { en: "send resume", hi: "रिज्यूमे भेजना" }, { en: "first call", hi: "पहली कॉल" }, { en: "panel round", hi: "पैनल राउंड" },
    { en: "salary talk", hi: "वेतन बात" }, { en: "accept offer", hi: "ऑफर स्वीकार" }, { en: "join day", hi: "जॉइनिंग दिन" },
    { en: "ask raise", hi: "वृद्धि माँगना" }, { en: "handover", hi: "हैंडओवर" },
  ], vara: ["Wednesday", "Thursday", "Friday"], stars: ["Hasta", "Pushya", "Revati"], karaka: ["Mercury", "Jupiter"], avoid: [4, 9, 14], minTara: 2 },
  { category: "Business", subs: ["Launch", "Contract", "Partnership", "Vendor", "Branch", "Pricing", "Client", "Close"], actions: [
    { en: "sign MoU", hi: "एमओयू साइन" }, { en: "pitch", hi: "पिच" }, { en: "negotiate", hi: "मोलभाव" },
    { en: "open branch", hi: "शाखा खोलना" }, { en: "set price", hi: "कीमत तय" }, { en: "close deal", hi: "सौदा पक्का" },
    { en: "renew", hi: "नवीनीकरण" }, { en: "end tie", hi: "अनुबंध समाप्ति" },
  ], vara: ["Wednesday", "Thursday", "Friday"], stars: ["Pushya", "Hasta", "Anuradha"], karaka: ["Mercury", "Jupiter"], avoid: [4, 9, 14], minTara: 4 },
  { category: "Marketing", subs: ["Campaign", "Social", "Ad spend", "Launch", "PR", "Email", "Influencer", "Brand"], actions: [
    { en: "go live", hi: "लाइव करना" }, { en: "post story", hi: "स्टोरी" }, { en: "start ads", hi: "विज्ञापन शुरू" },
    { en: "press note", hi: "प्रेस नोट" }, { en: "send mailer", hi: "मेलर" }, { en: "rebrand", hi: "रीब्रांड" },
    { en: "collab", hi: "सहयोग" }, { en: "pause spend", hi: "खर्च रोकना" },
  ], vara: ["Wednesday", "Friday"], stars: ["Hasta", "Swati", "Revati"], karaka: ["Mercury", "Venus"], avoid: [4, 9], minTara: 2 },
  { category: "Finance", subs: ["Invest", "Gold", "Loan", "Tax", "Account", "Transfer", "Insurance", "Budget"], actions: [
    { en: "buy", hi: "खरीद" }, { en: "sell", hi: "बिक्री" }, { en: "apply loan", hi: "लोन आवेदन" },
    { en: "repay", hi: "चुकौती" }, { en: "file return", hi: "रिटर्न फाइल" }, { en: "open account", hi: "खाता खोलना" },
    { en: "transfer", hi: "ट्रांसफर" }, { en: "start SIP", hi: "एसआईपी शुरू" },
  ], vara: ["Thursday", "Friday", "Wednesday"], stars: ["Pushya", "Rohini", "Hasta"], karaka: ["Jupiter", "Mercury"], avoid: [4, 9, 14, 30], minTara: 4 },
  { category: "Health", subs: ["Consult", "Test", "Medicine", "Surgery", "Dental", "Eye", "Therapy", "Checkup"], actions: [
    { en: "book visit", hi: "विजिट बुक" }, { en: "start medicine", hi: "दवा शुरू" }, { en: "lab test", hi: "जाँच" },
    { en: "procedure", hi: "प्रक्रिया" }, { en: "follow up", hi: "फॉलो अप" }, { en: "second opinion", hi: "दूसरी राय" },
    { en: "physio start", hi: "फिजियो शुरू" }, { en: "discharge", hi: "डिस्चार्ज" },
  ], vara: ["Monday", "Wednesday", "Thursday"], stars: ["Ashwini", "Hasta", "Pushya", "Revati"], karaka: ["Moon", "Mercury"], avoid: [4, 9, 14, 30], minTara: 4 },
  { category: "Travel", subs: ["Flight", "Train", "Road", "Visa", "Hotel", "Abroad", "Pilgrim", "Shift"], actions: [
    { en: "book ticket", hi: "टिकट बुक" }, { en: "depart", hi: "प्रस्थान" }, { en: "apply visa", hi: "वीज़ा" },
    { en: "check in", hi: "चेक इन" }, { en: "return", hi: "वापसी" }, { en: "relocate", hi: "स्थानांतरण" },
    { en: "yatra start", hi: "यात्रा आरंभ" }, { en: "cancel", hi: "रद्द" },
  ], vara: ["Monday", "Wednesday", "Thursday"], stars: ["Hasta", "Ashwini", "Pushya", "Mrigashira"], karaka: ["Moon", "Mercury"], avoid: [4, 9, 14], minTara: 2 },
  { category: "Purchase", subs: ["Vehicle", "Electronics", "Jewellery", "Appliance", "Furniture", "Cloth", "Gadget", "Tool"], actions: [
    { en: "token", hi: "टोकन" }, { en: "buy new", hi: "नया खरीदना" }, { en: "buy used", hi: "पुराना खरीदना" },
    { en: "delivery", hi: "डिलीवरी" }, { en: "exchange", hi: "एक्सचेंज" }, { en: "warranty", hi: "वारंटी" },
    { en: "order online", hi: "ऑनलाइन ऑर्डर" }, { en: "pay balance", hi: "बाकी भुगतान" },
  ], vara: ["Wednesday", "Thursday", "Friday"], stars: ["Rohini", "Pushya", "Hasta"], karaka: ["Venus", "Mercury"], avoid: [4, 9, 14], minTara: 2 },
  { category: "Real Estate", subs: ["Booking", "Registry", "Griha", "Rent", "Vastu", "Plot", "Flat", "Office"], actions: [
    { en: "site visit", hi: "साइट विजिट" }, { en: "token", hi: "टोकन" }, { en: "agreement", hi: "एग्रीमेंट" },
    { en: "registry", hi: "रजिस्ट्री" }, { en: "griha pravesh", hi: "गृह प्रवेश" }, { en: "bhoomi pujan", hi: "भूमि पूजन" },
    { en: "rent start", hi: "किराया शुरू" }, { en: "handover keys", hi: "चाबी" },
  ], vara: ["Thursday", "Friday", "Monday"], stars: ["Rohini", "Uttara Phalguni", "Uttara Ashadha"], karaka: ["Venus", "Mars", "Jupiter"], avoid: [4, 9, 14, 30], minTara: 6, major: true },
  { category: "Relationship", subs: ["Dating", "Roka", "Engagement", "Wedding", "Family", "Meet", "Talk", "Alliance"], actions: [
    { en: "first meet", hi: "पहली मुलाकात" }, { en: "propose", hi: "प्रस्ताव" }, { en: "fix date", hi: "तिथि तय" },
    { en: "ceremony", hi: "समारोह" }, { en: "family meet", hi: "परिवार मिलन" }, { en: "counsel", hi: "सलाह" },
    { en: "reconcile", hi: "सुलह" }, { en: "vidai", hi: "विदाई" },
  ], vara: ["Monday", "Thursday", "Friday"], stars: ["Rohini", "Revati", "Anuradha"], karaka: ["Venus", "Jupiter"], avoid: [4, 9, 14, 30], minTara: 4 },
  { category: "Education", subs: ["Admission", "Exam", "Course", "Thesis", "Coaching", "Skill", "Result", "Abroad study"], actions: [
    { en: "apply", hi: "आवेदन" }, { en: "exam day", hi: "परीक्षा" }, { en: "start course", hi: "कोर्स शुरू" },
    { en: "submit thesis", hi: "थीसिस" }, { en: "join class", hi: "कक्षा" }, { en: "viva", hi: "वीवा" },
    { en: "enroll", hi: "नामांकन" }, { en: "certificate", hi: "प्रमाणपत्र" },
  ], vara: ["Wednesday", "Thursday"], stars: ["Hasta", "Pushya", "Punarvasu", "Revati"], karaka: ["Mercury", "Jupiter"], avoid: [4, 9, 14], minTara: 2 },
  { category: "Legal", subs: ["Filing", "Hearing", "Notice", "Agreement", "Will", "Arbitration", "Tax", "Compliance"], actions: [
    { en: "file", hi: "फाइल" }, { en: "appear", hi: "पेशी" }, { en: "reply notice", hi: "नोटिस जवाब" },
    { en: "sign deed", hi: "डीड साइन" }, { en: "notary", hi: "नोटरी" }, { en: "settle", hi: "समझौता" },
    { en: "affidavit", hi: "शपथपत्र" }, { en: "close case", hi: "मामला बंद" },
  ], vara: ["Thursday", "Wednesday", "Saturday"], stars: ["Hasta", "Anuradha", "Pushya"], karaka: ["Mercury", "Jupiter", "Saturn"], avoid: [4, 9, 14], minTara: 2 },
  { category: "Technology", subs: ["App", "Website", "Deploy", "Domain", "Server", "Release", "Bugfix", "Demo"], actions: [
    { en: "go live", hi: "गो लाइव" }, { en: "deploy", hi: "डिप्लॉय" }, { en: "buy domain", hi: "डोमेन" },
    { en: "demo client", hi: "डेमो" }, { en: "release", hi: "रिलीज" }, { en: "migrate", hi: "माइग्रेट" },
    { en: "hotfix", hi: "हॉटफिक्स" }, { en: "handover code", hi: "कोड हैंडओवर" },
  ], vara: ["Wednesday", "Thursday"], stars: ["Hasta", "Pushya", "Rohini"], karaka: ["Mercury"], avoid: [4, 9, 14], minTara: 2 },
  { category: "Media", subs: ["Shoot", "Publish", "Interview", "Podcast", "YouTube", "Press", "Edit", "Premiere"], actions: [
    { en: "start shoot", hi: "शूट शुरू" }, { en: "publish", hi: "प्रकाशित" }, { en: "record", hi: "रिकॉर्ड" },
    { en: "premiere", hi: "प्रीमियर" }, { en: "upload", hi: "अपलोड" }, { en: "interview guest", hi: "अतिथि" },
    { en: "edit lock", hi: "एडिट लॉक" }, { en: "announce", hi: "घोषणा" },
  ], vara: ["Wednesday", "Friday"], stars: ["Hasta", "Swati", "Revati"], karaka: ["Mercury", "Venus"], avoid: [4, 9], minTara: 2 },
  { category: "Civic", subs: ["Election", "Application", "Passport", "License", "Tender", "Office", "Vote", "ID"], actions: [
    { en: "file form", hi: "फॉर्म" }, { en: "submit", hi: "जमा" }, { en: "oath", hi: "शपथ" },
    { en: "collect", hi: "प्राप्ति" }, { en: "appointment", hi: "अपॉइंटमेंट" }, { en: "renew ID", hi: "आईडी नवीनीकरण" },
    { en: "bid", hi: "बिड" }, { en: "join duty", hi: "ड्यूटी" },
  ], vara: ["Thursday", "Wednesday", "Sunday"], stars: ["Pushya", "Hasta", "Uttara Ashadha"], karaka: ["Sun", "Jupiter"], avoid: [4, 9, 14], minTara: 4 },
  { category: "Spiritual", subs: ["Diksha", "Puja", "Gem", "Fast", "Havan", "Temple", "Mantra", "Dana"], actions: [
    { en: "start sadhana", hi: "साधना शुरू" }, { en: "wear gem", hi: "रत्न धारण" }, { en: "havan", hi: "हवन" },
    { en: "diksha", hi: "दीक्षा" }, { en: "sankalp", hi: "संकल्प" }, { en: "dana", hi: "दान" },
    { en: "vrata", hi: "व्रत" }, { en: "pran pratishtha", hi: "प्रतिष्ठा" },
  ], vara: ["Thursday", "Monday", "Sunday"], stars: ["Pushya", "Rohini", "Revati"], karaka: ["Jupiter"], avoid: [4, 9, 14], minTara: 4 },
  { category: "Daily", subs: ["Call", "Meeting", "Email", "Errand", "Study", "Exercise", "Cook", "Plan"], actions: [
    { en: "important call", hi: "जरूरी कॉल" }, { en: "team meet", hi: "टीम मीट" }, { en: "send mail", hi: "मेल" },
    { en: "start task", hi: "काम शुरू" }, { en: "deep work", hi: "गहन काम" }, { en: "review day", hi: "दिन समीक्षा" },
    { en: "pay bill", hi: "बिल" }, { en: "schedule", hi: "शेड्यूल" },
  ], vara: ["Wednesday", "Thursday", "Friday"], stars: ["Hasta", "Pushya"], karaka: ["Mercury"], avoid: [4, 9], minTara: 0 },
  { category: "Family", subs: ["Parents", "Child", "Home", "Ritual", "Visit", "Care", "School", "Gathering"], actions: [
    { en: "call parents", hi: "माता-पिता को कॉल" }, { en: "school drop", hi: "स्कूल छोड़ना" }, { en: "doctor with child", hi: "बच्चे के साथ डॉक्टर" },
    { en: "family lunch", hi: "परिवार का भोजन" }, { en: "home puja", hi: "घर की पूजा" }, { en: "visit elders", hi: "बड़ों से मिलना" },
    { en: "tuition start", hi: "ट्यूशन शुरू" }, { en: "birthday plan", hi: "जन्मदिन योजना" },
  ], vara: ["Monday", "Thursday", "Friday"], stars: ["Rohini", "Pushya", "Revati"], karaka: ["Moon", "Jupiter"], avoid: [4, 9, 14], minTara: 2 },
];

const MORE_SUBS: Record<string, string[]> = {
  Career: ["Resume", "Referral"],
  Business: ["Invoice", "Follow-up"],
  Marketing: ["Reel", "Landing"],
  Finance: ["EMI", "FD"],
  Health: ["Diet", "Report"],
  Travel: ["Cab", "Return ticket"],
  Purchase: ["Invoice", "Service"],
  "Real Estate": ["Loan", "Interior"],
  Relationship: ["Dating", "Talk"],
  Education: ["Fee", "Interview"],
  Legal: ["Stamp", "Bail"],
  Technology: ["Backup", "Invoice"],
  Media: ["Thumbnail", "Live"],
  Civic: ["Affidavit", "Slot"],
  Spiritual: ["Jap", "Visit"],
  Daily: ["Morning", "Night"],
  Family: ["Homework", "Medicine"],
};

const MORE_ACTS: { en: string; hi: string }[] = [
  { en: "confirm time", hi: "समय पक्का" },
  { en: "send details", hi: "विवरण भेजना" },
  { en: "first reminder", hi: "पहली याद" },
  { en: "final check", hi: "अंतिम जाँच" },
  { en: "collect proof", hi: "प्रमाण लेना" },
  { en: "share update", hi: "अपडेट भेजना" },
];

const HELD_SUB = /wedding|engagement|roka|vidai|vivah/i;

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

export const CATALOG = FAMILIES.flatMap((f) => {
  const subs = [...new Set([...f.subs, ...(MORE_SUBS[f.category] ?? [])])].filter((s) => !HELD_SUB.test(s));
  const actions = [...f.actions, ...MORE_ACTS];
  return subs.flatMap((sub) =>
    actions.map((act) => {
      const key = `cat_${slug(f.category)}_${slug(sub)}_${slug(act.en)}`;
      const major = Boolean(f.major) || f.minTara >= 6;
      return {
        key,
        name: `${sub}: ${act.en}`,
        nameHi: `${sub}: ${act.hi}`,
        category: f.category,
        preferredVara: f.vara,
        preferredNakshatra: f.stars,
        avoidTithi: f.avoid,
        minTara: f.minTara,
        karaka: f.karaka,
        blurb: `${sub} — ${act.en}. Birth star and navtara still gate the window.`,
        tier: major ? "major" : "daily",
        purushartha: f.category === "Spiritual" ? "moksha" : f.category === "Relationship" || f.category === "Family" ? "kama" : "artha",
        tatva: "vayu",
        guna: "rajas",
        creditCost: major ? 5 : 1,
      };
    }),
  );
});
