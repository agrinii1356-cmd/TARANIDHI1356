import { C as planetSidereal, E as toJulianDay, T as sunLongitude, b as localToUtc, o as RASHIS, u as ascendantSidereal, y as getPanchang } from "./store-BvmsIaJ0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gates-DjmUZLwL.js
var FAMILIES = [
	{
		category: "Career",
		subs: [
			"Interview",
			"Offer",
			"Joining",
			"Review",
			"Promotion",
			"Exit",
			"Networking",
			"Remote"
		],
		actions: [
			{
				en: "send resume",
				hi: "रिज्यूमे भेजना"
			},
			{
				en: "first call",
				hi: "पहली कॉल"
			},
			{
				en: "panel round",
				hi: "पैनल राउंड"
			},
			{
				en: "salary talk",
				hi: "वेतन बात"
			},
			{
				en: "accept offer",
				hi: "ऑफर स्वीकार"
			},
			{
				en: "join day",
				hi: "जॉइनिंग दिन"
			},
			{
				en: "ask raise",
				hi: "वृद्धि माँगना"
			},
			{
				en: "handover",
				hi: "हैंडओवर"
			}
		],
		vara: [
			"Wednesday",
			"Thursday",
			"Friday"
		],
		stars: [
			"Hasta",
			"Pushya",
			"Revati"
		],
		karaka: ["Mercury", "Jupiter"],
		avoid: [
			4,
			9,
			14
		],
		minTara: 2
	},
	{
		category: "Business",
		subs: [
			"Launch",
			"Contract",
			"Partnership",
			"Vendor",
			"Branch",
			"Pricing",
			"Client",
			"Close"
		],
		actions: [
			{
				en: "sign MoU",
				hi: "एमओयू साइन"
			},
			{
				en: "pitch",
				hi: "पिच"
			},
			{
				en: "negotiate",
				hi: "मोलभाव"
			},
			{
				en: "open branch",
				hi: "शाखा खोलना"
			},
			{
				en: "set price",
				hi: "कीमत तय"
			},
			{
				en: "close deal",
				hi: "सौदा पक्का"
			},
			{
				en: "renew",
				hi: "नवीनीकरण"
			},
			{
				en: "end tie",
				hi: "अनुबंध समाप्ति"
			}
		],
		vara: [
			"Wednesday",
			"Thursday",
			"Friday"
		],
		stars: [
			"Pushya",
			"Hasta",
			"Anuradha"
		],
		karaka: ["Mercury", "Jupiter"],
		avoid: [
			4,
			9,
			14
		],
		minTara: 4
	},
	{
		category: "Marketing",
		subs: [
			"Campaign",
			"Social",
			"Ad spend",
			"Launch",
			"PR",
			"Email",
			"Influencer",
			"Brand"
		],
		actions: [
			{
				en: "go live",
				hi: "लाइव करना"
			},
			{
				en: "post story",
				hi: "स्टोरी"
			},
			{
				en: "start ads",
				hi: "विज्ञापन शुरू"
			},
			{
				en: "press note",
				hi: "प्रेस नोट"
			},
			{
				en: "send mailer",
				hi: "मेलर"
			},
			{
				en: "rebrand",
				hi: "रीब्रांड"
			},
			{
				en: "collab",
				hi: "सहयोग"
			},
			{
				en: "pause spend",
				hi: "खर्च रोकना"
			}
		],
		vara: ["Wednesday", "Friday"],
		stars: [
			"Hasta",
			"Swati",
			"Revati"
		],
		karaka: ["Mercury", "Venus"],
		avoid: [4, 9],
		minTara: 2
	},
	{
		category: "Finance",
		subs: [
			"Invest",
			"Gold",
			"Loan",
			"Tax",
			"Account",
			"Transfer",
			"Insurance",
			"Budget"
		],
		actions: [
			{
				en: "buy",
				hi: "खरीद"
			},
			{
				en: "sell",
				hi: "बिक्री"
			},
			{
				en: "apply loan",
				hi: "लोन आवेदन"
			},
			{
				en: "repay",
				hi: "चुकौती"
			},
			{
				en: "file return",
				hi: "रिटर्न फाइल"
			},
			{
				en: "open account",
				hi: "खाता खोलना"
			},
			{
				en: "transfer",
				hi: "ट्रांसफर"
			},
			{
				en: "start SIP",
				hi: "एसआईपी शुरू"
			}
		],
		vara: [
			"Thursday",
			"Friday",
			"Wednesday"
		],
		stars: [
			"Pushya",
			"Rohini",
			"Hasta"
		],
		karaka: ["Jupiter", "Mercury"],
		avoid: [
			4,
			9,
			14,
			30
		],
		minTara: 4
	},
	{
		category: "Health",
		subs: [
			"Consult",
			"Test",
			"Medicine",
			"Surgery",
			"Dental",
			"Eye",
			"Therapy",
			"Checkup"
		],
		actions: [
			{
				en: "book visit",
				hi: "विजिट बुक"
			},
			{
				en: "start medicine",
				hi: "दवा शुरू"
			},
			{
				en: "lab test",
				hi: "जाँच"
			},
			{
				en: "procedure",
				hi: "प्रक्रिया"
			},
			{
				en: "follow up",
				hi: "फॉलो अप"
			},
			{
				en: "second opinion",
				hi: "दूसरी राय"
			},
			{
				en: "physio start",
				hi: "फिजियो शुरू"
			},
			{
				en: "discharge",
				hi: "डिस्चार्ज"
			}
		],
		vara: [
			"Monday",
			"Wednesday",
			"Thursday"
		],
		stars: [
			"Ashwini",
			"Hasta",
			"Pushya",
			"Revati"
		],
		karaka: ["Moon", "Mercury"],
		avoid: [
			4,
			9,
			14,
			30
		],
		minTara: 4
	},
	{
		category: "Travel",
		subs: [
			"Flight",
			"Train",
			"Road",
			"Visa",
			"Hotel",
			"Abroad",
			"Pilgrim",
			"Shift"
		],
		actions: [
			{
				en: "book ticket",
				hi: "टिकट बुक"
			},
			{
				en: "depart",
				hi: "प्रस्थान"
			},
			{
				en: "apply visa",
				hi: "वीज़ा"
			},
			{
				en: "check in",
				hi: "चेक इन"
			},
			{
				en: "return",
				hi: "वापसी"
			},
			{
				en: "relocate",
				hi: "स्थानांतरण"
			},
			{
				en: "yatra start",
				hi: "यात्रा आरंभ"
			},
			{
				en: "cancel",
				hi: "रद्द"
			}
		],
		vara: [
			"Monday",
			"Wednesday",
			"Thursday"
		],
		stars: [
			"Hasta",
			"Ashwini",
			"Pushya",
			"Mrigashira"
		],
		karaka: ["Moon", "Mercury"],
		avoid: [
			4,
			9,
			14
		],
		minTara: 2
	},
	{
		category: "Purchase",
		subs: [
			"Vehicle",
			"Electronics",
			"Jewellery",
			"Appliance",
			"Furniture",
			"Cloth",
			"Gadget",
			"Tool"
		],
		actions: [
			{
				en: "token",
				hi: "टोकन"
			},
			{
				en: "buy new",
				hi: "नया खरीदना"
			},
			{
				en: "buy used",
				hi: "पुराना खरीदना"
			},
			{
				en: "delivery",
				hi: "डिलीवरी"
			},
			{
				en: "exchange",
				hi: "एक्सचेंज"
			},
			{
				en: "warranty",
				hi: "वारंटी"
			},
			{
				en: "order online",
				hi: "ऑनलाइन ऑर्डर"
			},
			{
				en: "pay balance",
				hi: "बाकी भुगतान"
			}
		],
		vara: [
			"Wednesday",
			"Thursday",
			"Friday"
		],
		stars: [
			"Rohini",
			"Pushya",
			"Hasta"
		],
		karaka: ["Venus", "Mercury"],
		avoid: [
			4,
			9,
			14
		],
		minTara: 2
	},
	{
		category: "Real Estate",
		subs: [
			"Booking",
			"Registry",
			"Griha",
			"Rent",
			"Vastu",
			"Plot",
			"Flat",
			"Office"
		],
		actions: [
			{
				en: "site visit",
				hi: "साइट विजिट"
			},
			{
				en: "token",
				hi: "टोकन"
			},
			{
				en: "agreement",
				hi: "एग्रीमेंट"
			},
			{
				en: "registry",
				hi: "रजिस्ट्री"
			},
			{
				en: "griha pravesh",
				hi: "गृह प्रवेश"
			},
			{
				en: "bhoomi pujan",
				hi: "भूमि पूजन"
			},
			{
				en: "rent start",
				hi: "किराया शुरू"
			},
			{
				en: "handover keys",
				hi: "चाबी"
			}
		],
		vara: [
			"Thursday",
			"Friday",
			"Monday"
		],
		stars: [
			"Rohini",
			"Uttara Phalguni",
			"Uttara Ashadha"
		],
		karaka: [
			"Venus",
			"Mars",
			"Jupiter"
		],
		avoid: [
			4,
			9,
			14,
			30
		],
		minTara: 6,
		major: true
	},
	{
		category: "Relationship",
		subs: [
			"Dating",
			"Roka",
			"Engagement",
			"Wedding",
			"Family",
			"Meet",
			"Talk",
			"Alliance"
		],
		actions: [
			{
				en: "first meet",
				hi: "पहली मुलाकात"
			},
			{
				en: "propose",
				hi: "प्रस्ताव"
			},
			{
				en: "fix date",
				hi: "तिथि तय"
			},
			{
				en: "ceremony",
				hi: "समारोह"
			},
			{
				en: "family meet",
				hi: "परिवार मिलन"
			},
			{
				en: "counsel",
				hi: "सलाह"
			},
			{
				en: "reconcile",
				hi: "सुलह"
			},
			{
				en: "vidai",
				hi: "विदाई"
			}
		],
		vara: [
			"Monday",
			"Thursday",
			"Friday"
		],
		stars: [
			"Rohini",
			"Revati",
			"Anuradha"
		],
		karaka: ["Venus", "Jupiter"],
		avoid: [
			4,
			9,
			14,
			30
		],
		minTara: 4
	},
	{
		category: "Education",
		subs: [
			"Admission",
			"Exam",
			"Course",
			"Thesis",
			"Coaching",
			"Skill",
			"Result",
			"Abroad study"
		],
		actions: [
			{
				en: "apply",
				hi: "आवेदन"
			},
			{
				en: "exam day",
				hi: "परीक्षा"
			},
			{
				en: "start course",
				hi: "कोर्स शुरू"
			},
			{
				en: "submit thesis",
				hi: "थीसिस"
			},
			{
				en: "join class",
				hi: "कक्षा"
			},
			{
				en: "viva",
				hi: "वीवा"
			},
			{
				en: "enroll",
				hi: "नामांकन"
			},
			{
				en: "certificate",
				hi: "प्रमाणपत्र"
			}
		],
		vara: ["Wednesday", "Thursday"],
		stars: [
			"Hasta",
			"Pushya",
			"Punarvasu",
			"Revati"
		],
		karaka: ["Mercury", "Jupiter"],
		avoid: [
			4,
			9,
			14
		],
		minTara: 2
	},
	{
		category: "Legal",
		subs: [
			"Filing",
			"Hearing",
			"Notice",
			"Agreement",
			"Will",
			"Arbitration",
			"Tax",
			"Compliance"
		],
		actions: [
			{
				en: "file",
				hi: "फाइल"
			},
			{
				en: "appear",
				hi: "पेशी"
			},
			{
				en: "reply notice",
				hi: "नोटिस जवाब"
			},
			{
				en: "sign deed",
				hi: "डीड साइन"
			},
			{
				en: "notary",
				hi: "नोटरी"
			},
			{
				en: "settle",
				hi: "समझौता"
			},
			{
				en: "affidavit",
				hi: "शपथपत्र"
			},
			{
				en: "close case",
				hi: "मामला बंद"
			}
		],
		vara: [
			"Thursday",
			"Wednesday",
			"Saturday"
		],
		stars: [
			"Hasta",
			"Anuradha",
			"Pushya"
		],
		karaka: [
			"Mercury",
			"Jupiter",
			"Saturn"
		],
		avoid: [
			4,
			9,
			14
		],
		minTara: 2
	},
	{
		category: "Technology",
		subs: [
			"App",
			"Website",
			"Deploy",
			"Domain",
			"Server",
			"Release",
			"Bugfix",
			"Demo"
		],
		actions: [
			{
				en: "go live",
				hi: "गो लाइव"
			},
			{
				en: "deploy",
				hi: "डिप्लॉय"
			},
			{
				en: "buy domain",
				hi: "डोमेन"
			},
			{
				en: "demo client",
				hi: "डेमो"
			},
			{
				en: "release",
				hi: "रिलीज"
			},
			{
				en: "migrate",
				hi: "माइग्रेट"
			},
			{
				en: "hotfix",
				hi: "हॉटफिक्स"
			},
			{
				en: "handover code",
				hi: "कोड हैंडओवर"
			}
		],
		vara: ["Wednesday", "Thursday"],
		stars: [
			"Hasta",
			"Pushya",
			"Rohini"
		],
		karaka: ["Mercury"],
		avoid: [
			4,
			9,
			14
		],
		minTara: 2
	},
	{
		category: "Media",
		subs: [
			"Shoot",
			"Publish",
			"Interview",
			"Podcast",
			"YouTube",
			"Press",
			"Edit",
			"Premiere"
		],
		actions: [
			{
				en: "start shoot",
				hi: "शूट शुरू"
			},
			{
				en: "publish",
				hi: "प्रकाशित"
			},
			{
				en: "record",
				hi: "रिकॉर्ड"
			},
			{
				en: "premiere",
				hi: "प्रीमियर"
			},
			{
				en: "upload",
				hi: "अपलोड"
			},
			{
				en: "interview guest",
				hi: "अतिथि"
			},
			{
				en: "edit lock",
				hi: "एडिट लॉक"
			},
			{
				en: "announce",
				hi: "घोषणा"
			}
		],
		vara: ["Wednesday", "Friday"],
		stars: [
			"Hasta",
			"Swati",
			"Revati"
		],
		karaka: ["Mercury", "Venus"],
		avoid: [4, 9],
		minTara: 2
	},
	{
		category: "Civic",
		subs: [
			"Election",
			"Application",
			"Passport",
			"License",
			"Tender",
			"Office",
			"Vote",
			"ID"
		],
		actions: [
			{
				en: "file form",
				hi: "फॉर्म"
			},
			{
				en: "submit",
				hi: "जमा"
			},
			{
				en: "oath",
				hi: "शपथ"
			},
			{
				en: "collect",
				hi: "प्राप्ति"
			},
			{
				en: "appointment",
				hi: "अपॉइंटमेंट"
			},
			{
				en: "renew ID",
				hi: "आईडी नवीनीकरण"
			},
			{
				en: "bid",
				hi: "बिड"
			},
			{
				en: "join duty",
				hi: "ड्यूटी"
			}
		],
		vara: [
			"Thursday",
			"Wednesday",
			"Sunday"
		],
		stars: [
			"Pushya",
			"Hasta",
			"Uttara Ashadha"
		],
		karaka: ["Sun", "Jupiter"],
		avoid: [
			4,
			9,
			14
		],
		minTara: 4
	},
	{
		category: "Spiritual",
		subs: [
			"Diksha",
			"Puja",
			"Gem",
			"Fast",
			"Havan",
			"Temple",
			"Mantra",
			"Dana"
		],
		actions: [
			{
				en: "start sadhana",
				hi: "साधना शुरू"
			},
			{
				en: "wear gem",
				hi: "रत्न धारण"
			},
			{
				en: "havan",
				hi: "हवन"
			},
			{
				en: "diksha",
				hi: "दीक्षा"
			},
			{
				en: "sankalp",
				hi: "संकल्प"
			},
			{
				en: "dana",
				hi: "दान"
			},
			{
				en: "vrata",
				hi: "व्रत"
			},
			{
				en: "pran pratishtha",
				hi: "प्रतिष्ठा"
			}
		],
		vara: [
			"Thursday",
			"Monday",
			"Sunday"
		],
		stars: [
			"Pushya",
			"Rohini",
			"Revati"
		],
		karaka: ["Jupiter"],
		avoid: [
			4,
			9,
			14
		],
		minTara: 4
	},
	{
		category: "Daily",
		subs: [
			"Call",
			"Meeting",
			"Email",
			"Errand",
			"Study",
			"Exercise",
			"Cook",
			"Plan"
		],
		actions: [
			{
				en: "important call",
				hi: "जरूरी कॉल"
			},
			{
				en: "team meet",
				hi: "टीम मीट"
			},
			{
				en: "send mail",
				hi: "मेल"
			},
			{
				en: "start task",
				hi: "काम शुरू"
			},
			{
				en: "deep work",
				hi: "गहन काम"
			},
			{
				en: "review day",
				hi: "दिन समीक्षा"
			},
			{
				en: "pay bill",
				hi: "बिल"
			},
			{
				en: "schedule",
				hi: "शेड्यूल"
			}
		],
		vara: [
			"Wednesday",
			"Thursday",
			"Friday"
		],
		stars: ["Hasta", "Pushya"],
		karaka: ["Mercury"],
		avoid: [4, 9],
		minTara: 0
	}
];
function slug$1(s) {
	return s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}
var CATALOG = FAMILIES.flatMap((f) => f.subs.flatMap((sub) => f.actions.map((act) => {
	const key = `cat_${slug$1(f.category)}_${slug$1(sub)}_${slug$1(act.en)}`;
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
		purushartha: f.category === "Spiritual" ? "moksha" : f.category === "Relationship" ? "kama" : "artha",
		tatva: "vayu",
		guna: "rajas",
		creditCost: major ? 5 : 1
	};
})));
var rows = [
	[
		"Baby",
		"शिशु",
		"Admission to School",
		"विद्यारम्भ",
		"Sending child to school for the 1st time"
	],
	[
		"Baby",
		"शिशु",
		"Bath after delivery",
		"प्रसूता स्नान",
		"Washing of the baby for the 1st time"
	],
	[
		"Baby",
		"शिशु",
		"Birth ceremony",
		"जन्म उत्सव",
		"Birth ceremony of the child"
	],
	[
		"Baby",
		"शिशु",
		"Breast feeding",
		"स्तन्यपान",
		"Breast feeding for the 1st time"
	],
	[
		"Baby",
		"शिशु",
		"Cradling",
		"दोलारोहण",
		"Putting the baby in the cradle"
	],
	[
		"Baby",
		"शिशु",
		"Ear boring",
		"कर्णवेध",
		"Piercing ears"
	],
	[
		"Baby",
		"शिशु",
		"Cow milk",
		"दुग्धपान",
		"Feeding cow milk after 31 days"
	],
	[
		"Baby",
		"शिशु",
		"First rice",
		"अन्नप्राशन",
		"Feeding solids for the 1st time"
	],
	[
		"Baby",
		"शिशु",
		"Betel leaf",
		"ताम्बूल",
		"Giving betel after 2.5 months"
	],
	[
		"Baby",
		"शिशु",
		"First outing",
		"निष्क्रमण",
		"Taking the baby out of the house"
	],
	[
		"Baby",
		"शिशु",
		"Sacred thread",
		"उपनयन",
		"Upanayana / start of education"
	],
	[
		"Baby",
		"शिशु",
		"Learning to write",
		"नूतनाक्षर",
		"Teaching the child to write"
	],
	[
		"Baby",
		"शिशु",
		"Naming",
		"नामकरण",
		"Announcing the name"
	],
	[
		"Baby",
		"शिशु",
		"Sitting on land",
		"भूम्युपवेशन",
		"Letting the baby sit on the ground"
	],
	[
		"Baby",
		"शिशु",
		"Tonsure",
		"केशांत",
		"The first haircut"
	],
	[
		"Baby",
		"शिशु",
		"River worship",
		"जलपूजन",
		"Thanksgiving after delivery"
	],
	[
		"Business",
		"व्यापार",
		"Cows and cattle",
		"पशुधन",
		"Buying or selling large animals"
	],
	[
		"Business",
		"व्यापार",
		"Horses",
		"अश्व",
		"Buying or selling horses"
	],
	[
		"Business",
		"व्यापार",
		"Large business",
		"वृहत् कुटीर",
		"Starting a large business"
	],
	[
		"Business",
		"व्यापार",
		"Small business",
		"लघु कुटीर",
		"Starting a small business"
	],
	[
		"Business",
		"व्यापार",
		"Gold ornaments",
		"आभूषण",
		"Business in precious metals"
	],
	[
		"Business",
		"व्यापार",
		"Gem cutting",
		"रत्न कटाई",
		"Cutting and polishing gems"
	],
	[
		"Business",
		"व्यापार",
		"Elephants",
		"गज",
		"Buying or selling elephants / heavy vehicles"
	],
	[
		"Business",
		"व्यापार",
		"Goats and pets",
		"पालतू",
		"Buying or selling pets"
	],
	[
		"Business",
		"व्यापार",
		"Retail for profit",
		"विक्रय",
		"Starting retail"
	],
	[
		"Business",
		"व्यापार",
		"Vehicles trade",
		"वाहन व्यापार",
		"Buying or selling a vehicle"
	],
	[
		"Business",
		"व्यापार",
		"Selling shares",
		"शेयर बेचना",
		"Selling stock"
	],
	[
		"Business",
		"व्यापार",
		"Buying shares",
		"शेयर खरीदना",
		"Investing in the market"
	],
	[
		"Construction",
		"निर्माण",
		"Boring and well",
		"बोरिंग",
		"Digging wells and pools"
	],
	[
		"Construction",
		"निर्माण",
		"Building ships",
		"जहाज",
		"Building a boat"
	],
	[
		"Construction",
		"निर्माण",
		"Collecting material",
		"सामग्री",
		"Buying bricks and material"
	],
	[
		"Construction",
		"निर्माण",
		"Cutting wood",
		"लकड़ी कटाई",
		"Cutting construction material"
	],
	[
		"Construction",
		"निर्माण",
		"Colony and village",
		"गाँव-नगर",
		"Starting a community"
	],
	[
		"Construction",
		"निर्माण",
		"Fixing door",
		"द्वार स्थापना",
		"Putting a door in place"
	],
	[
		"Construction",
		"निर्माण",
		"Well foundation",
		"कुआँ नींव",
		"Drilling a well"
	],
	[
		"Construction",
		"निर्माण",
		"Interior decoration",
		"सजावट",
		"Interior decoration"
	],
	[
		"Construction",
		"निर्माण",
		"Laying foundation",
		"शिलान्यास",
		"Laying a foundation"
	],
	[
		"Construction",
		"निर्माण",
		"Laying pillars",
		"स्तंभारोपण",
		"Raising the frame"
	],
	[
		"Construction",
		"निर्माण",
		"New house",
		"गृह निर्माण",
		"Constructing a house"
	],
	[
		"Construction",
		"निर्माण",
		"Jain temple",
		"जैन मंदिर",
		"Constructing a religious building"
	],
	[
		"Construction",
		"निर्माण",
		"Bridge",
		"सेतु",
		"Making a bridge"
	],
	[
		"Construction",
		"निर्माण",
		"New temple",
		"मंदिर",
		"Making a temple"
	],
	[
		"Construction",
		"निर्माण",
		"Fort and govt house",
		"दुर्ग",
		"Administrative building"
	],
	[
		"Construction",
		"निर्माण",
		"House repair",
		"जीर्णोद्धार",
		"Maintenance of a building"
	],
	[
		"Construction",
		"निर्माण",
		"Small water tank",
		"जलाशय",
		"Pool or tank"
	],
	[
		"Construction",
		"निर्माण",
		"Aquatic tank",
		"जल जीव",
		"Garden pool or aquarium"
	],
	[
		"Construction",
		"निर्माण",
		"Flower garland",
		"वंदनमाल",
		"Inaugurating a house"
	],
	[
		"Construction",
		"निर्माण",
		"Village assembly",
		"सभा भवन",
		"Meeting hall"
	],
	[
		"Construction",
		"निर्माण",
		"Home water tank",
		"घर जलाशय",
		"Water tank at home"
	],
	[
		"Construction",
		"निर्माण",
		"Dismantling",
		"भवन ध्वंस",
		"Tearing down a structure"
	],
	[
		"Dealing",
		"लेन-देन",
		"Borrowing money",
		"ऋण लेना",
		"Borrowing money"
	],
	[
		"Dealing",
		"लेन-देन",
		"Depositing money",
		"धन जमा",
		"Depositing with a person"
	],
	[
		"Dealing",
		"लेन-देन",
		"Bank deposit",
		"बैंक जमा",
		"Depositing in a bank"
	],
	[
		"Dealing",
		"लेन-देन",
		"Cattle dealing",
		"चौपाये",
		"Trading animals"
	],
	[
		"Dealing",
		"लेन-देन",
		"Horse dealing",
		"अश्व लेन-देन",
		"Trading horses"
	],
	[
		"Dealing",
		"लेन-देन",
		"Lending money",
		"उधार देना",
		"Lending in a deal"
	],
	[
		"Dealing",
		"लेन-देन",
		"Giving a loan",
		"ऋण देना",
		"Lending as a loan"
	],
	[
		"Dealing",
		"लेन-देन",
		"Receiving a loan",
		"ऋण पाना",
		"Getting a formal loan"
	],
	[
		"Dealing",
		"लेन-देन",
		"Loan repayment",
		"चुकौती",
		"Making an installment"
	],
	[
		"Dealing",
		"लेन-देन",
		"Recovering dues",
		"वसूली",
		"Recovering due payments"
	],
	[
		"Education",
		"शिक्षा",
		"Astrology",
		"ज्योतिष",
		"Learning astrology"
	],
	[
		"Education",
		"शिक्षा",
		"Commencing education",
		"शिक्षा आरंभ",
		"Learning in general"
	],
	[
		"Education",
		"शिक्षा",
		"Convocation",
		"दीक्षांत",
		"Completing studies"
	],
	[
		"Education",
		"शिक्षा",
		"Dance and music",
		"नृत्य-संगीत",
		"Learning dance and music"
	],
	[
		"Education",
		"शिक्षा",
		"Logic and philosophy",
		"तर्कशास्त्र",
		"Language, math, philosophy"
	],
	[
		"Education",
		"शिक्षा",
		"Medicine study",
		"औषधि विद्या",
		"Learning medicine"
	],
	[
		"Education",
		"शिक्षा",
		"Science",
		"विज्ञान",
		"Learning science"
	],
	[
		"Education",
		"शिक्षा",
		"Alphabet",
		"अक्षराभ्यास",
		"Learning to read and write"
	],
	[
		"Education",
		"शिक्षा",
		"Trade study",
		"व्यापार विद्या",
		"Learning trading"
	],
	[
		"Education",
		"शिक्षा",
		"Vedas",
		"वेद-शास्त्र",
		"Spiritual knowledge"
	],
	[
		"Farming",
		"कृषि",
		"Fertilizer",
		"खाद",
		"Fertilizing land"
	],
	[
		"Farming",
		"कृषि",
		"Buying farmland",
		"खेत खरीद",
		"Buying land for farming"
	],
	[
		"Farming",
		"कृषि",
		"Storing cereals",
		"धान्य संग्रह",
		"Harvesting and storing grains"
	],
	[
		"Farming",
		"कृषि",
		"Grinding cereals",
		"पिसाई",
		"Crushing or grinding grains"
	],
	[
		"Farming",
		"कृषि",
		"Cutting cereals",
		"कटाई",
		"Cutting grains"
	],
	[
		"Farming",
		"कृषि",
		"Felling trees",
		"पेड़ काटना",
		"Cutting trees"
	],
	[
		"Farming",
		"कृषि",
		"General farming",
		"खेती",
		"Farming"
	],
	[
		"Farming",
		"कृषि",
		"Grafting",
		"कलम",
		"Grafting and pruning"
	],
	[
		"Farming",
		"कृषि",
		"Harvest",
		"फसल",
		"Harvesting"
	],
	[
		"Farming",
		"कृषि",
		"Lending cereals",
		"अन्न उधार",
		"Lending grains"
	],
	[
		"Farming",
		"कृषि",
		"Planting",
		"रोपण",
		"Planting"
	],
	[
		"Farming",
		"कृषि",
		"Ploughing",
		"हल",
		"Ploughing"
	],
	[
		"Farming",
		"कृषि",
		"Plough on oxen",
		"हल जोतना",
		"Preparing the plough"
	],
	[
		"Farming",
		"कृषि",
		"Selling cereals",
		"अन्न विक्रय",
		"Selling grains"
	],
	[
		"Farming",
		"कृषि",
		"Sowing",
		"बीज वपन",
		"Sowing"
	],
	[
		"Farming",
		"कृषि",
		"Watering",
		"सिंचन",
		"Watering"
	],
	[
		"Grih Pravesh",
		"गृह प्रवेश",
		"New house entry",
		"नया घर",
		"Moving into a newly built house"
	],
	[
		"Grih Pravesh",
		"गृह प्रवेश",
		"Repaired house",
		"जीर्ण प्रवेश",
		"Moving into a used house"
	],
	[
		"Grih Pravesh",
		"गृह प्रवेश",
		"Vastu worship",
		"वास्तु पूजन",
		"Blessing the home"
	],
	[
		"Manufacturing",
		"निर्माण कार्य",
		"Bed and quilt",
		"पलंग",
		"Making beds"
	],
	[
		"Manufacturing",
		"निर्माण कार्य",
		"Clothes making",
		"वस्त्र",
		"Making clothes"
	],
	[
		"Manufacturing",
		"निर्माण कार्य",
		"Ornaments",
		"आभूषण निर्माण",
		"Making ornaments without jewels"
	],
	[
		"Marriage",
		"विवाह",
		"Swayambar",
		"स्वयंवर",
		"Bride choosing the groom"
	],
	[
		"Marriage",
		"विवाह",
		"Vedica",
		"वेदी",
		"Altar and platform"
	],
	[
		"Marriage",
		"विवाह",
		"First cooking",
		"प्रथम पाक",
		"First meal by the bride"
	],
	[
		"Marriage",
		"विवाह",
		"First entry",
		"कन्यागमन",
		"Bride enters husband's house"
	],
	[
		"Marriage",
		"विवाह",
		"Second entry",
		"द्विरागमन",
		"Second visit to in-laws"
	],
	[
		"Marriage",
		"विवाह",
		"Love marriage",
		"गांधर्व",
		"Love marriage"
	],
	[
		"Marriage",
		"विवाह",
		"Arranged marriage",
		"आयोजित",
		"Arranged marriage"
	],
	[
		"Marriage",
		"विवाह",
		"Mutual acceptance",
		"वाग्दान",
		"Decision on marriage"
	],
	[
		"Marriage",
		"विवाह",
		"Oil anointing",
		"तैलादि",
		"Oil anointing before marriage"
	],
	[
		"Marriage",
		"विवाह",
		"Engagement",
		"सगाई",
		"Engagement"
	],
	[
		"Marriage",
		"विवाह",
		"Selecting bride",
		"कन्या वरण",
		"Parents selecting bride"
	],
	[
		"Marriage",
		"विवाह",
		"Selecting groom",
		"वर वरण",
		"Parents selecting groom"
	],
	[
		"Marriage",
		"विवाह",
		"Pavilion",
		"मण्डप",
		"Sitting on the marriage pavilion"
	],
	[
		"Marriage",
		"विवाह",
		"Remarriage",
		"पुनर्विवाह",
		"Re-marriage"
	],
	[
		"Medical",
		"औषधि",
		"Begin treatment",
		"चिकित्सा आरंभ",
		"Medical treatment"
	],
	[
		"Medical",
		"औषधि",
		"Dental",
		"दाँत",
		"Dental work"
	],
	[
		"Medical",
		"औषधि",
		"Nose",
		"नाक",
		"Nose treatment"
	],
	[
		"Medical",
		"औषधि",
		"Surgery",
		"शल्यकर्म",
		"Surgery"
	],
	[
		"Medical",
		"औषधि",
		"Enema",
		"एनीमा",
		"Intestinal cleaning"
	],
	[
		"Medical",
		"औषधि",
		"Injection",
		"इंजेक्शन",
		"Getting injections"
	],
	[
		"Medical",
		"औषधि",
		"Prepare medicine",
		"औषधि निर्माण",
		"Preparing medicines"
	],
	[
		"Medical",
		"औषधि",
		"Consumption diet",
		"पथ्य",
		"Dieting"
	],
	[
		"Medical",
		"औषधि",
		"Epilepsy",
		"अपस्मार",
		"Epilepsy treatment"
	],
	[
		"Medical",
		"औषधि",
		"Leprosy",
		"कुष्ठ",
		"Skin treatment"
	],
	[
		"Medical",
		"औषधि",
		"Venereal",
		"मैथुन रोग",
		"Venereal treatment"
	],
	[
		"Misc",
		"विविध",
		"Adopting a child",
		"गोद लेना",
		"Adopting a child"
	],
	[
		"Misc",
		"विविध",
		"Appeasing planets",
		"ग्रह शांति",
		"Appeasing the planets"
	],
	[
		"Misc",
		"विविध",
		"Colouring clothes",
		"कपड़े रंगना",
		"Dyeing cloth"
	],
	[
		"Misc",
		"विविध",
		"Cutting nails",
		"नाखून",
		"Cutting nails"
	],
	[
		"Misc",
		"विविध",
		"Destroying strongholds",
		"दुर्ग नष्ट",
		"Destroying a stronghold"
	],
	[
		"Misc",
		"विविध",
		"New grains dinner",
		"नया अन्न",
		"Eating new harvest"
	],
	[
		"Misc",
		"विविध",
		"Divide property",
		"संपत्ति बाँटना",
		"Dividing property"
	],
	[
		"Misc",
		"विविध",
		"Havan",
		"हवन",
		"Oblation"
	],
	[
		"Misc",
		"विविध",
		"Nine cereals",
		"नौ अन्न",
		"Eating nine grains first time"
	],
	[
		"Misc",
		"विविध",
		"New servants",
		"नौकर रखना",
		"Employing a new person"
	],
	[
		"Misc",
		"विविध",
		"Sacred thread end",
		"जनेऊ त्याग",
		"Final liberation of the thread"
	],
	[
		"Misc",
		"विविध",
		"Library",
		"पुस्तकालय",
		"Starting a library"
	],
	[
		"Misc",
		"विविध",
		"God havan",
		"देव हवन",
		"Oblation for a god"
	],
	[
		"Misc",
		"विविध",
		"Horse race",
		"अश्व दौड़",
		"Horse race"
	],
	[
		"Misc",
		"विविध",
		"School inauguration",
		"स्कूल उद्घाटन",
		"Inaugurating a school"
	],
	[
		"Misc",
		"विविध",
		"Mantra initiation",
		"मंत्र दीक्षा",
		"Learning to meditate"
	],
	[
		"Misc",
		"विविध",
		"Installing deity",
		"मूर्ति स्थापना",
		"Installing a deity"
	],
	[
		"Misc",
		"विविध",
		"Thread for relief",
		"जनेऊ राहत",
		"Thread for relief"
	],
	[
		"Misc",
		"विविध",
		"Keeping birds",
		"पक्षी पालन",
		"Getting a bird"
	],
	[
		"Misc",
		"विविध",
		"Lottery",
		"लॉटरी",
		"Entering a competition"
	],
	[
		"Misc",
		"विविध",
		"Make up",
		"शृंगार",
		"Putting make up"
	],
	[
		"Misc",
		"विविध",
		"Making a will",
		"वसीयत",
		"Making a will"
	],
	[
		"Misc",
		"विविध",
		"Making weapons",
		"शस्त्र निर्माण",
		"Making a weapon"
	],
	[
		"Misc",
		"विविध",
		"Pet animals",
		"पालतू जानवर",
		"Getting a pet"
	],
	[
		"Misc",
		"विविध",
		"Plantation",
		"वृक्षारोपण",
		"Planting trees"
	],
	[
		"Misc",
		"विविध",
		"First instrument",
		"यंत्र",
		"Playing an instrument first time"
	],
	[
		"Misc",
		"विविध",
		"Pledging",
		"प्रतिज्ञा",
		"Pledging"
	],
	[
		"Misc",
		"विविध",
		"Moving house",
		"घर बदलना",
		"Changing residence"
	],
	[
		"Misc",
		"विविध",
		"First ride",
		"पहली सवारी",
		"Using a new vehicle"
	],
	[
		"Misc",
		"विविध",
		"Seeking prisoners",
		"बंदी खोजना",
		"Seeking escaped prisoners"
	],
	[
		"Misc",
		"विविध",
		"Shaving",
		"हजामत",
		"Shaving"
	],
	[
		"Misc",
		"विविध",
		"Shifting place",
		"स्थान बदल",
		"Moving temporarily"
	],
	[
		"Misc",
		"विविध",
		"Bath after illness",
		"रोग स्नान",
		"Bath after sickness"
	],
	[
		"Misc",
		"विविध",
		"New water",
		"नया जल",
		"Testing a new well"
	],
	[
		"Misc",
		"विविध",
		"Expanding realm",
		"साम्राज्य वृद्धि",
		"Expanding a sovereign"
	],
	[
		"Misc",
		"विविध",
		"Laundry",
		"कपड़े धोना",
		"Doing laundry"
	],
	[
		"Misc",
		"विविध",
		"Funeral with body",
		"अंत्येष्टि",
		"Funeral if body is available"
	],
	[
		"Misc",
		"विविध",
		"Funeral without body",
		"बिना शरीर",
		"Funeral if body is not available"
	],
	[
		"Misc",
		"विविध",
		"Begin writing",
		"लेखन आरंभ",
		"Writer beginning to write"
	],
	[
		"Official",
		"अधिकार",
		"New appointment",
		"नियुक्ति",
		"Starting a new post"
	],
	[
		"Official",
		"अधिकार",
		"Coronation",
		"राज्याभिषेक",
		"Coronation"
	],
	[
		"Official",
		"अधिकार",
		"Democratic rule",
		"प्रजातंत्र",
		"Voting"
	],
	[
		"Official",
		"अधिकार",
		"Electing head",
		"मंत्री चुनाव",
		"Electing a head"
	],
	[
		"Official",
		"अधिकार",
		"Filing application",
		"प्रार्थनापत्र",
		"Filing an application"
	],
	[
		"Official",
		"अधिकार",
		"Filing lawsuit",
		"मुकदमा",
		"Filing a law suit"
	],
	[
		"Official",
		"अधिकार",
		"Meeting officials",
		"उच्च अधिकारी",
		"Meeting high officials"
	],
	[
		"Official",
		"अधिकार",
		"Job application",
		"नौकरी आवेदन",
		"Applying for a job"
	],
	[
		"Official",
		"अधिकार",
		"Higher authorities",
		"बड़े अधिकारी",
		"Meeting authorities"
	],
	[
		"Pregnancy",
		"गर्भ",
		"Ghati dharan",
		"घटी धारण",
		"Ceremony in the 3rd month"
	],
	[
		"Pregnancy",
		"गर्भ",
		"Bath after menses",
		"रजस्वला स्नान",
		"Bath after the period"
	],
	[
		"Pregnancy",
		"गर्भ",
		"Third month rite",
		"तृतीय मास",
		"Third month ceremony"
	],
	[
		"Pregnancy",
		"गर्भ",
		"Sex change rite",
		"भ्रूण लिंग",
		"Rite to change the sex"
	],
	[
		"Pregnancy",
		"गर्भ",
		"First menses",
		"प्रथम रज",
		"First menstruation"
	],
	[
		"Pregnancy",
		"गर्भ",
		"First conception",
		"प्रथम गर्भ",
		"First pregnancy after marriage"
	],
	[
		"Pregnancy",
		"गर्भ",
		"Lying-in room",
		"सूतिकागार",
		"Setting up the delivery room"
	],
	[
		"Pregnancy",
		"गर्भ",
		"Pregnancy diet",
		"गर्भ आहार",
		"Diet for the term"
	],
	[
		"Pregnancy",
		"गर्भ",
		"Conception",
		"गर्भधान",
		"Conception"
	],
	[
		"Pregnancy",
		"गर्भ",
		"Seemantha",
		"सीमंतोन्नयन",
		"Seemantha"
	],
	[
		"Pregnancy",
		"गर्भ",
		"Pregnant treatment",
		"गर्भवती चिकित्सा",
		"Treatment of a pregnant woman"
	],
	[
		"Pregnancy",
		"गर्भ",
		"Eighth month worship",
		"अष्टम मास",
		"Worship for safe delivery"
	],
	[
		"Purchasing",
		"खरीद",
		"Arms",
		"शस्त्र",
		"Buying arms"
	],
	[
		"Purchasing",
		"खरीद",
		"Cattle",
		"पशु",
		"Buying cattle"
	],
	[
		"Purchasing",
		"खरीद",
		"House",
		"घर खरीद",
		"Buying a house"
	],
	[
		"Purchasing",
		"खरीद",
		"Sheep",
		"भेड़-बकरी",
		"Buying sheep"
	],
	[
		"Purchasing",
		"खरीद",
		"Jewellery",
		"आभूषण खरीद",
		"Buying jewellery"
	],
	[
		"Purchasing",
		"खरीद",
		"Jewels",
		"रत्न",
		"Buying gems"
	],
	[
		"Purchasing",
		"खरीद",
		"Land",
		"जमीन",
		"Buying land"
	],
	[
		"Purchasing",
		"खरीद",
		"Land for building",
		"भवन भूमि",
		"Land for a building"
	],
	[
		"Purchasing",
		"खरीद",
		"New items",
		"नया सामान",
		"Buying new things"
	],
	[
		"Purchasing",
		"खरीद",
		"Business items",
		"व्यापार सामान",
		"Buying business items"
	],
	[
		"Purchasing",
		"खरीद",
		"Utensils",
		"बर्तन",
		"Buying utensils"
	],
	[
		"Purchasing",
		"खरीद",
		"Vehicles",
		"गाड़ी",
		"Buying a vehicle"
	],
	[
		"Selling",
		"बेचना",
		"General selling",
		"सामान्य बेचना",
		"Selling things"
	],
	[
		"Starting",
		"आरंभ",
		"Black magic",
		"काला जादू",
		"Black magic"
	],
	[
		"Starting",
		"आरंभ",
		"Dairy farm",
		"दुग्धशाला",
		"Dairy farm"
	],
	[
		"Starting",
		"आरंभ",
		"Embroidery",
		"कशीदाकारी",
		"Embroidery"
	],
	[
		"Starting",
		"आरंभ",
		"Fish farming",
		"मछली पालन",
		"Fish farming"
	],
	[
		"Starting",
		"आरंभ",
		"Jewellery work",
		"आभूषण काम",
		"Making jewellery"
	],
	[
		"Starting",
		"आरंभ",
		"Government service",
		"सरकारी नौकरी",
		"Joining government service"
	],
	[
		"Starting",
		"आरंभ",
		"Leather work",
		"चर्म",
		"Leather work and new shoes"
	],
	[
		"Starting",
		"आरंभ",
		"Machinery",
		"मशीन",
		"Using machines"
	],
	[
		"Starting",
		"आरंभ",
		"Opening a shop",
		"दुकान",
		"Opening a store"
	],
	[
		"Starting",
		"आरंभ",
		"Physical exercise",
		"व्यायाम",
		"First physical exercise"
	],
	[
		"Starting",
		"आरंभ",
		"Poultry",
		"मुर्गी पालन",
		"Poultry farming"
	],
	[
		"Starting",
		"आरंभ",
		"Launching a boat",
		"नौका",
		"Putting a new boat in water"
	],
	[
		"Starting",
		"आरंभ",
		"War",
		"युद्ध",
		"Waging war"
	],
	[
		"Using",
		"उपयोग",
		"New bed",
		"नया बिस्तर",
		"Using a new bed"
	],
	[
		"Using",
		"उपयोग",
		"Camphor and sandal",
		"कपूर",
		"Using aromatics"
	],
	[
		"Using",
		"उपयोग",
		"New account book",
		"नया खाता",
		"Accounting"
	],
	[
		"Using",
		"उपयोग",
		"New utensils",
		"नए बर्तन",
		"Using new utensils"
	],
	[
		"Using",
		"उपयोग",
		"Massage oil",
		"मालिश तेल",
		"Applying massage oil"
	],
	[
		"Using",
		"उपयोग",
		"New software",
		"नया सॉफ्टवेयर",
		"Installing software"
	],
	[
		"Wearing",
		"पहनना",
		"Armour",
		"कवच",
		"Wearing armour"
	],
	[
		"Wearing",
		"पहनना",
		"Bangles",
		"चूड़ी",
		"Wearing bangles"
	],
	[
		"Wearing",
		"पहनना",
		"Gold thread cloth",
		"सोने का कपड़ा",
		"Cloth with gold or silver thread"
	],
	[
		"Wearing",
		"पहनना",
		"Man's new clothes",
		"पुरुष वस्त्र",
		"New clothes for a man"
	],
	[
		"Wearing",
		"पहनना",
		"Woman's new clothes",
		"स्त्री वस्त्र",
		"New clothes for a woman"
	],
	[
		"Wearing",
		"पहनना",
		"Hat and turban",
		"टोपी",
		"New head cover"
	],
	[
		"Wearing",
		"पहनना",
		"New ornaments",
		"आभूषण धारण",
		"Wearing new ornaments"
	],
	[
		"Wearing",
		"पहनना",
		"Red clothes",
		"लाल वस्त्र",
		"Wearing red first time"
	],
	[
		"Wearing",
		"पहनना",
		"Weapons",
		"शस्त्र धारण",
		"Carrying weapons"
	],
	[
		"Wearing",
		"पहनना",
		"White clothes",
		"श्वेत वस्त्र",
		"Wearing white first time"
	],
	[
		"Wearing",
		"पहनना",
		"Woolen",
		"ऊनी",
		"Wearing woolen"
	],
	[
		"Wearing",
		"पहनना",
		"Yellow clothes",
		"पीत वस्त्र",
		"Wearing yellow first time"
	],
	[
		"Journeys",
		"यात्रा",
		"East",
		"पूर्व",
		"Journey to the East"
	],
	[
		"Journeys",
		"यात्रा",
		"South East",
		"आग्नेय",
		"Journey to the South East"
	],
	[
		"Journeys",
		"यात्रा",
		"South",
		"दक्षिण",
		"Journey to the South"
	],
	[
		"Journeys",
		"यात्रा",
		"South West",
		"नैर्ऋत्य",
		"Journey to the South West"
	],
	[
		"Journeys",
		"यात्रा",
		"West",
		"पश्चिम",
		"Journey to the West"
	],
	[
		"Journeys",
		"यात्रा",
		"North West",
		"वायव्य",
		"Journey to the North West"
	],
	[
		"Journeys",
		"यात्रा",
		"North",
		"उत्तर",
		"Journey to the North"
	],
	[
		"Journeys",
		"यात्रा",
		"North East",
		"ईशान्य",
		"Journey to the North East"
	]
];
function slug(s) {
	return s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}
var PARASHAR = rows.map(([category, categoryHi, name, nameHi, western]) => ({
	key: `trad_${slug(category)}_${slug(name)}`,
	category,
	categoryHi,
	name,
	nameHi,
	western
}));
var PARASHAR_CATEGORIES = [...new Set(PARASHAR.map((p) => p.category))];
var careerVara = [
	"Wednesday",
	"Thursday",
	"Friday"
];
var financeVara = [
	"Thursday",
	"Friday",
	"Wednesday"
];
var relVara = [
	"Monday",
	"Wednesday",
	"Thursday",
	"Friday"
];
var avoidRikta = [
	4,
	8,
	9,
	14,
	30
];
var avoidLight = [
	4,
	9,
	14
];
var CATEGORIES = [
	"Career",
	"Business",
	"Marketing",
	"Finance",
	"Health",
	"Travel",
	"Purchase",
	"Real Estate",
	"Relationship",
	"Family",
	"Education",
	"Legal",
	"Civic",
	"Media",
	"Technology",
	"Daily",
	"Spiritual"
];
var SEED = [
	{
		key: "job_interview",
		name: "Job interview",
		nameHi: "नौकरी का इंटरव्यू",
		category: "Career",
		preferredVara: careerVara,
		preferredNakshatra: [
			"Hasta",
			"Pushya",
			"Rohini",
			"Revati"
		],
		avoidTithi: avoidRikta,
		minTara: 2,
		karaka: [
			"Mercury",
			"Jupiter",
			"Sun"
		],
		blurb: "Mercury hora and Tara Sampat or Mitra favour first impressions."
	},
	{
		key: "job_joining",
		name: "First day / joining",
		nameHi: "जॉइनिंग",
		category: "Career",
		preferredVara: careerVara,
		preferredNakshatra: [
			"Rohini",
			"Uttara Phalguni",
			"Pushya"
		],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: ["Sun", "Jupiter"],
		blurb: "Fixed nakshatras support a lasting start."
	},
	{
		key: "promotion_talk",
		name: "Promotion discussion",
		nameHi: "प्रमोशन चर्चा",
		category: "Career",
		preferredVara: ["Thursday", "Wednesday"],
		preferredNakshatra: [
			"Pushya",
			"Uttara Phalguni",
			"Hasta"
		],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: ["Sun", "Jupiter"],
		blurb: "Jupiter weekday plus strong Chandra Bala."
	},
	{
		key: "resignation",
		name: "Resignation",
		nameHi: "इस्तीफा",
		category: "Career",
		preferredVara: ["Thursday", "Friday"],
		preferredNakshatra: [
			"Hasta",
			"Swati",
			"Anuradha"
		],
		avoidTithi: avoidRikta,
		minTara: 2,
		karaka: ["Saturn", "Sun"],
		blurb: "Avoid Vishti; keep Tara above Vipat."
	},
	{
		key: "performance_review",
		name: "Performance review",
		nameHi: "परफॉर्मेंस रिव्यू",
		category: "Career",
		preferredVara: careerVara,
		preferredNakshatra: ["Hasta", "Pushya"],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Mercury", "Sun"],
		blurb: "Swift nakshatras keep the conversation clear."
	},
	{
		key: "salary_negotiation",
		name: "Salary negotiation",
		nameHi: "वेतन बातचीत",
		category: "Career",
		preferredVara: financeVara,
		preferredNakshatra: [
			"Pushya",
			"Rohini",
			"Hasta"
		],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: ["Jupiter", "Venus"],
		blurb: "Jupiter and Venus as karakas of gain."
	},
	{
		key: "team_standup",
		name: "Team standup",
		nameHi: "टीम स्टैंडअप",
		category: "Career",
		preferredVara: careerVara,
		preferredNakshatra: [
			"Hasta",
			"Pushya",
			"Ashwini"
		],
		avoidTithi: [4, 9],
		minTara: 0,
		karaka: ["Mercury"],
		blurb: "Mercury hora is enough for daily sync."
	},
	{
		key: "corporate_meeting",
		name: "Corporate meeting",
		nameHi: "कॉर्पोरेट मीटिंग",
		category: "Career",
		preferredVara: careerVara,
		preferredNakshatra: [
			"Hasta",
			"Pushya",
			"Revati"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Mercury", "Jupiter"],
		blurb: "Skip Rahu Kaal and Vishti Karana."
	},
	{
		key: "zoom_important",
		name: "Important video call",
		nameHi: "महत्वपूर्ण वीडियो कॉल",
		category: "Career",
		preferredVara: careerVara,
		preferredNakshatra: [
			"Hasta",
			"Pushya",
			"Revati"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Mercury"],
		blurb: "Mercury hora, avoid Tuesday for high-stakes calls."
	},
	{
		key: "presentation",
		name: "Client presentation",
		nameHi: "प्रस्तुति",
		category: "Career",
		preferredVara: careerVara,
		preferredNakshatra: [
			"Hasta",
			"Pushya",
			"Rohini"
		],
		avoidTithi: avoidRikta,
		minTara: 2,
		karaka: ["Mercury", "Sun"],
		blurb: "Hasta nakshatra favours speech and slides."
	},
	{
		key: "networking_event",
		name: "Networking event",
		nameHi: "नेटवर्किंग",
		category: "Career",
		preferredVara: [
			"Wednesday",
			"Friday",
			"Thursday"
		],
		preferredNakshatra: [
			"Swati",
			"Hasta",
			"Revati"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Venus", "Mercury"],
		blurb: "Soft and movable stars for meeting people."
	},
	{
		key: "linkedin_outreach",
		name: "Outreach campaign start",
		nameHi: "आउटरीच शुरू",
		category: "Career",
		preferredVara: ["Wednesday", "Friday"],
		preferredNakshatra: ["Hasta", "Ashwini"],
		avoidTithi: avoidLight,
		minTara: 0,
		karaka: ["Mercury"],
		blurb: "Swift nakshatras for sending volume."
	},
	{
		key: "business_deal",
		name: "Business deal / contract",
		nameHi: "व्यापारिक सौदा",
		category: "Business",
		preferredVara: financeVara,
		preferredNakshatra: [
			"Rohini",
			"Uttara Phalguni",
			"Uttara Ashadha",
			"Pushya"
		],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: [
			"Mercury",
			"Jupiter",
			"Venus"
		],
		blurb: "Fixed stars lock agreements."
	},
	{
		key: "partnership",
		name: "Partnership agreement",
		nameHi: "साझेदारी",
		category: "Business",
		preferredVara: ["Thursday", "Friday"],
		preferredNakshatra: [
			"Rohini",
			"Uttara Phalguni",
			"Revati"
		],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: ["Venus", "Jupiter"],
		blurb: "Venus + Jupiter; Chandra Bala should be strong."
	},
	{
		key: "new_venture",
		name: "New venture launch",
		nameHi: "नया उद्यम",
		category: "Business",
		preferredVara: ["Thursday", "Wednesday"],
		preferredNakshatra: [
			"Pushya",
			"Rohini",
			"Hasta"
		],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: ["Jupiter", "Sun"],
		blurb: "Pushya is classically used for beginnings."
	},
	{
		key: "vendor_meeting",
		name: "Vendor meeting",
		nameHi: "वेंडर मीटिंग",
		category: "Business",
		preferredVara: careerVara,
		preferredNakshatra: ["Hasta", "Anuradha"],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Mercury"],
		blurb: "Anuradha supports fair terms."
	},
	{
		key: "pitch_investor",
		name: "Investor pitch",
		nameHi: "निवेशक पिच",
		category: "Business",
		preferredVara: [
			"Thursday",
			"Wednesday",
			"Friday"
		],
		preferredNakshatra: [
			"Pushya",
			"Hasta",
			"Rohini"
		],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: ["Jupiter", "Mercury"],
		blurb: "Jupiter weekday for capital conversations."
	},
	{
		key: "board_meeting",
		name: "Board meeting",
		nameHi: "बोर्ड मीटिंग",
		category: "Business",
		preferredVara: ["Thursday", "Wednesday"],
		preferredNakshatra: ["Uttara Phalguni", "Pushya"],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: ["Jupiter", "Sun"],
		blurb: "Avoid Rikta tithis for governance."
	},
	{
		key: "office_inauguration",
		name: "Office inauguration",
		nameHi: "कार्यालय शुभारंभ",
		category: "Business",
		preferredVara: [
			"Thursday",
			"Friday",
			"Wednesday"
		],
		preferredNakshatra: [
			"Rohini",
			"Uttara Phalguni",
			"Uttara Ashadha"
		],
		avoidTithi: avoidRikta,
		minTara: 6,
		karaka: ["Mars", "Jupiter"],
		blurb: "Fixed nakshatras for a lasting seat."
	},
	{
		key: "franchise_talks",
		name: "Franchise talks",
		nameHi: "फ्रैंचाइज़ी",
		category: "Business",
		preferredVara: financeVara,
		preferredNakshatra: ["Rohini", "Pushya"],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: ["Jupiter", "Mercury"],
		blurb: "Expansion under Guru hora."
	},
	{
		key: "export_order",
		name: "Export / import order",
		nameHi: "निर्यात आदेश",
		category: "Business",
		preferredVara: ["Wednesday", "Thursday"],
		preferredNakshatra: [
			"Punarvasu",
			"Hasta",
			"Pushya"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Mercury", "Moon"],
		blurb: "Movable stars suit cross-border work."
	},
	{
		key: "audit_start",
		name: "Audit kickoff",
		nameHi: "ऑडिट शुरू",
		category: "Business",
		preferredVara: ["Wednesday", "Thursday"],
		preferredNakshatra: ["Hasta", "Anuradha"],
		avoidTithi: avoidRikta,
		minTara: 2,
		karaka: ["Mercury", "Saturn"],
		blurb: "Saturn + Mercury for scrutiny."
	},
	{
		key: "rebrand",
		name: "Rebrand announcement",
		nameHi: "रिब्रांड",
		category: "Business",
		preferredVara: ["Friday", "Wednesday"],
		preferredNakshatra: [
			"Rohini",
			"Hasta",
			"Revati"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Venus", "Mercury"],
		blurb: "Venus weekday for image."
	},
	{
		key: "customer_meeting",
		name: "Customer meeting",
		nameHi: "ग्राहक मीटिंग",
		category: "Business",
		preferredVara: careerVara,
		preferredNakshatra: [
			"Hasta",
			"Rohini",
			"Pushya"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Mercury", "Venus"],
		blurb: "Soft speech nakshatras."
	},
	{
		key: "marketing_call",
		name: "Sales / marketing call",
		nameHi: "मार्केटिंग कॉल",
		category: "Marketing",
		preferredVara: [
			"Wednesday",
			"Friday",
			"Thursday"
		],
		preferredNakshatra: [
			"Hasta",
			"Chitra",
			"Swati",
			"Pushya"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Mercury", "Venus"],
		blurb: "Hasta and Swati for persuasion."
	},
	{
		key: "campaign_launch",
		name: "Campaign launch",
		nameHi: "कैम्पेन लॉन्च",
		category: "Marketing",
		preferredVara: ["Wednesday", "Friday"],
		preferredNakshatra: [
			"Hasta",
			"Pushya",
			"Ashwini"
		],
		avoidTithi: avoidRikta,
		minTara: 2,
		karaka: ["Mercury", "Sun"],
		blurb: "Swift stars for going live."
	},
	{
		key: "ad_spend",
		name: "Ad spend start",
		nameHi: "विज्ञापन खर्च",
		category: "Marketing",
		preferredVara: ["Wednesday", "Friday"],
		preferredNakshatra: ["Hasta", "Swati"],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Mercury", "Venus"],
		blurb: "Avoid Rikta tithis for money out."
	},
	{
		key: "pr_release",
		name: "Press release",
		nameHi: "प्रेस रिलीज़",
		category: "Marketing",
		preferredVara: ["Wednesday", "Thursday"],
		preferredNakshatra: ["Hasta", "Pushya"],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Mercury", "Sun"],
		blurb: "Mercury lord of news."
	},
	{
		key: "influencer_collab",
		name: "Influencer collab",
		nameHi: "इन्फ्लुएंसर सहयोग",
		category: "Marketing",
		preferredVara: ["Friday", "Wednesday"],
		preferredNakshatra: [
			"Rohini",
			"Revati",
			"Swati"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Venus", "Mercury"],
		blurb: "Venus for image partnerships."
	},
	{
		key: "content_shoot",
		name: "Content shoot",
		nameHi: "कंटेंट शूट",
		category: "Marketing",
		preferredVara: ["Friday", "Wednesday"],
		preferredNakshatra: [
			"Chitra",
			"Hasta",
			"Rohini"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Venus", "Sun"],
		blurb: "Chitra favours visual work."
	},
	{
		key: "financial_transaction",
		name: "Financial transfer",
		nameHi: "वित्तीय लेन-देन",
		category: "Finance",
		preferredVara: financeVara,
		preferredNakshatra: [
			"Rohini",
			"Pushya",
			"Hasta",
			"Uttara Phalguni"
		],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: [
			"Jupiter",
			"Venus",
			"Mercury"
		],
		blurb: "Skip Vishti and Rikta for money movement."
	},
	{
		key: "loan_application",
		name: "Loan application",
		nameHi: "लोन आवेदन",
		category: "Finance",
		preferredVara: ["Thursday", "Friday"],
		preferredNakshatra: [
			"Pushya",
			"Rohini",
			"Uttara Ashadha"
		],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: ["Jupiter", "Venus"],
		blurb: "Guru vara for credit."
	},
	{
		key: "investment",
		name: "Investment / SIP start",
		nameHi: "निवेश शुरू",
		category: "Finance",
		preferredVara: financeVara,
		preferredNakshatra: [
			"Rohini",
			"Pushya",
			"Uttara Phalguni"
		],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: ["Jupiter", "Mercury"],
		blurb: "Fixed stars for long holds."
	},
	{
		key: "tax_filing",
		name: "Tax filing",
		nameHi: "टैक्स फाइलिंग",
		category: "Finance",
		preferredVara: ["Wednesday", "Thursday"],
		preferredNakshatra: ["Hasta", "Anuradha"],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Mercury", "Saturn"],
		blurb: "Mercury for paperwork, Saturn for compliance."
	},
	{
		key: "insurance",
		name: "Insurance purchase",
		nameHi: "बीमा",
		category: "Finance",
		preferredVara: ["Thursday", "Saturday"],
		preferredNakshatra: ["Pushya", "Anuradha"],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: ["Saturn", "Jupiter"],
		blurb: "Saturn karaka of protection."
	},
	{
		key: "open_account",
		name: "Open bank / demat account",
		nameHi: "खाता खोलना",
		category: "Finance",
		preferredVara: financeVara,
		preferredNakshatra: [
			"Pushya",
			"Rohini",
			"Hasta"
		],
		avoidTithi: avoidRikta,
		minTara: 2,
		karaka: ["Mercury", "Jupiter"],
		blurb: "Pushya is a classic banking muhurat."
	},
	{
		key: "pay_debt",
		name: "Clear a debt",
		nameHi: "कर्ज चुकाना",
		category: "Finance",
		preferredVara: ["Thursday", "Saturday"],
		preferredNakshatra: ["Anuradha", "Uttara Ashadha"],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Saturn", "Jupiter"],
		blurb: "Saturn weekday can close obligations."
	},
	{
		key: "fundraising_close",
		name: "Fundraising close",
		nameHi: "फंडिंग बंद",
		category: "Finance",
		preferredVara: ["Thursday", "Friday"],
		preferredNakshatra: [
			"Rohini",
			"Pushya",
			"Uttara Phalguni"
		],
		avoidTithi: avoidRikta,
		minTara: 6,
		karaka: ["Jupiter", "Venus"],
		blurb: "High Tara minimum for capital close."
	},
	{
		key: "budget_planning",
		name: "Annual budget planning",
		nameHi: "बजट योजना",
		category: "Finance",
		preferredVara: ["Thursday", "Wednesday"],
		preferredNakshatra: ["Hasta", "Pushya"],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Mercury", "Jupiter"],
		blurb: "Hasta for counting and plans."
	},
	{
		key: "crypto_trade",
		name: "High-risk trade",
		nameHi: "जोखिम भरा ट्रेड",
		category: "Finance",
		preferredVara: ["Wednesday", "Thursday"],
		preferredNakshatra: ["Hasta", "Swati"],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: ["Mercury"],
		blurb: "Never on Vishti; Tara should be shubh."
	},
	{
		key: "doctor_appointment",
		name: "Doctor appointment",
		nameHi: "डॉक्टर अपॉइंटमेंट",
		category: "Health",
		preferredVara: relVara,
		preferredNakshatra: [
			"Ashwini",
			"Hasta",
			"Pushya",
			"Revati"
		],
		avoidTithi: [
			4,
			9,
			14,
			30
		],
		minTara: 2,
		karaka: [
			"Moon",
			"Mercury",
			"Jupiter"
		],
		blurb: "Ashwini is the physician star."
	},
	{
		key: "surgery",
		name: "Surgery",
		nameHi: "सर्जरी",
		category: "Health",
		preferredVara: [
			"Monday",
			"Wednesday",
			"Thursday"
		],
		preferredNakshatra: [
			"Ashwini",
			"Hasta",
			"Pushya"
		],
		avoidTithi: avoidRikta,
		minTara: 6,
		karaka: ["Mars", "Mercury"],
		blurb: "Avoid fierce nakshatras unless the surgeon advises otherwise."
	},
	{
		key: "lab_test",
		name: "Lab test",
		nameHi: "लैब टेस्ट",
		category: "Health",
		preferredVara: ["Monday", "Wednesday"],
		preferredNakshatra: ["Hasta", "Ashwini"],
		avoidTithi: avoidLight,
		minTara: 0,
		karaka: ["Mercury", "Moon"],
		blurb: "Hasta for diagnostics."
	},
	{
		key: "start_medication",
		name: "Start new medication",
		nameHi: "नई दवा शुरू",
		category: "Health",
		preferredVara: ["Monday", "Thursday"],
		preferredNakshatra: [
			"Ashwini",
			"Pushya",
			"Revati"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Moon", "Jupiter"],
		blurb: "Pushya is auspicious for remedies."
	},
	{
		key: "therapy_session",
		name: "Therapy / counselling",
		nameHi: "थेरेपी",
		category: "Health",
		preferredVara: [
			"Monday",
			"Wednesday",
			"Friday"
		],
		preferredNakshatra: [
			"Revati",
			"Rohini",
			"Pushya"
		],
		avoidTithi: [4, 9],
		minTara: 2,
		karaka: ["Moon", "Venus"],
		blurb: "Soft nakshatras, strong Chandra Bala."
	},
	{
		key: "fitness_start",
		name: "Start fitness plan",
		nameHi: "फिटनेस शुरू",
		category: "Health",
		preferredVara: [
			"Tuesday",
			"Thursday",
			"Sunday"
		],
		preferredNakshatra: [
			"Ashwini",
			"Hasta",
			"Pushya"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Mars", "Sun"],
		blurb: "Mars hora for physical starts."
	},
	{
		key: "dental",
		name: "Dental procedure",
		nameHi: "दंत चिकित्सा",
		category: "Health",
		preferredVara: ["Monday", "Wednesday"],
		preferredNakshatra: ["Ashwini", "Hasta"],
		avoidTithi: avoidRikta,
		minTara: 2,
		karaka: ["Mercury", "Mars"],
		blurb: "Avoid Purnima/Amavasya if possible."
	},
	{
		key: "vaccination",
		name: "Vaccination",
		nameHi: "टीकाकरण",
		category: "Health",
		preferredVara: [
			"Monday",
			"Wednesday",
			"Thursday"
		],
		preferredNakshatra: ["Ashwini", "Pushya"],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Moon", "Jupiter"],
		blurb: "Ashwini + Pushya preferred."
	},
	{
		key: "travel_booking",
		name: "Book tickets",
		nameHi: "टिकट बुकिंग",
		category: "Travel",
		preferredVara: [
			"Wednesday",
			"Thursday",
			"Friday",
			"Monday"
		],
		preferredNakshatra: [
			"Hasta",
			"Pushya",
			"Ashwini",
			"Punarvasu"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Moon", "Mercury"],
		blurb: "Booking can sit on a milder window than the actual start."
	},
	{
		key: "start_journey",
		name: "Start journey",
		nameHi: "यात्रा शुरू",
		category: "Travel",
		preferredVara: relVara,
		preferredNakshatra: [
			"Ashwini",
			"Punarvasu",
			"Hasta",
			"Pushya",
			"Anuradha"
		],
		avoidTithi: [
			4,
			9,
			14,
			30
		],
		minTara: 2,
		karaka: ["Moon", "Mercury"],
		blurb: "Avoid Rahu Kaal at departure."
	},
	{
		key: "visa_application",
		name: "Visa application",
		nameHi: "वीज़ा आवेदन",
		category: "Travel",
		preferredVara: ["Wednesday", "Thursday"],
		preferredNakshatra: [
			"Hasta",
			"Punarvasu",
			"Pushya"
		],
		avoidTithi: avoidRikta,
		minTara: 2,
		karaka: ["Mercury", "Jupiter"],
		blurb: "Mercury for documents, Jupiter for grace."
	},
	{
		key: "hotel_checkin",
		name: "Hotel check-in",
		nameHi: "होटल चेक-इन",
		category: "Travel",
		preferredVara: relVara,
		preferredNakshatra: [
			"Rohini",
			"Pushya",
			"Revati"
		],
		avoidTithi: [4, 9],
		minTara: 0,
		karaka: ["Moon", "Venus"],
		blurb: "Soft stars for settling in."
	},
	{
		key: "relocation",
		name: "Relocation / moving city",
		nameHi: "शहर बदलना",
		category: "Travel",
		preferredVara: [
			"Wednesday",
			"Thursday",
			"Friday"
		],
		preferredNakshatra: [
			"Punarvasu",
			"Rohini",
			"Uttara Ashadha"
		],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: ["Moon", "Mars"],
		blurb: "Punarvasu is the return-and-settle star."
	},
	{
		key: "pilgrimage",
		name: "Pilgrimage",
		nameHi: "तीर्थ यात्रा",
		category: "Travel",
		preferredVara: ["Thursday", "Monday"],
		preferredNakshatra: [
			"Pushya",
			"Revati",
			"Uttara Bhadrapada"
		],
		avoidTithi: [],
		minTara: 2,
		karaka: ["Jupiter", "Moon"],
		blurb: "Thursday and Pushya are classic."
	},
	{
		key: "road_trip",
		name: "Road trip start",
		nameHi: "रोड ट्रिप",
		category: "Travel",
		preferredVara: [
			"Monday",
			"Wednesday",
			"Thursday"
		],
		preferredNakshatra: [
			"Ashwini",
			"Punarvasu",
			"Hasta"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Moon", "Mars"],
		blurb: "Ashwini for swift movement."
	},
	{
		key: "foreign_travel",
		name: "International travel",
		nameHi: "विदेश यात्रा",
		category: "Travel",
		preferredVara: ["Wednesday", "Thursday"],
		preferredNakshatra: [
			"Punarvasu",
			"Swati",
			"Shravana"
		],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: [
			"Moon",
			"Mercury",
			"Rahu"
		],
		blurb: "Movable nakshatras for crossing water."
	},
	{
		key: "vehicle_purchase",
		name: "Vehicle purchase",
		nameHi: "गाड़ी खरीदना",
		category: "Purchase",
		preferredVara: careerVara,
		preferredNakshatra: [
			"Rohini",
			"Uttara Phalguni",
			"Hasta",
			"Anuradha"
		],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: [
			"Venus",
			"Mars",
			"Mercury"
		],
		blurb: "Rohini is a standard vehicle muhurat."
	},
	{
		key: "electronics",
		name: "Electronics purchase",
		nameHi: "इलेक्ट्रॉनिक्स",
		category: "Purchase",
		preferredVara: ["Wednesday", "Friday"],
		preferredNakshatra: [
			"Hasta",
			"Chitra",
			"Pushya"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Mercury", "Venus"],
		blurb: "Mercury for devices."
	},
	{
		key: "jewellery",
		name: "Jewellery purchase",
		nameHi: "आभूषण",
		category: "Purchase",
		preferredVara: ["Friday", "Monday"],
		preferredNakshatra: [
			"Rohini",
			"Revati",
			"Pushya"
		],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: ["Venus", "Moon"],
		blurb: "Friday + Rohini."
	},
	{
		key: "furniture",
		name: "Furniture / appliances",
		nameHi: "फर्नीचर",
		category: "Purchase",
		preferredVara: ["Friday", "Wednesday"],
		preferredNakshatra: ["Rohini", "Uttara Phalguni"],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Venus", "Mars"],
		blurb: "Fixed stars for items that stay."
	},
	{
		key: "groceries_bulk",
		name: "Bulk household stock",
		nameHi: "थोक खरीदारी",
		category: "Purchase",
		preferredVara: ["Monday", "Friday"],
		preferredNakshatra: ["Rohini", "Pushya"],
		avoidTithi: [4, 9],
		minTara: 0,
		karaka: ["Moon", "Venus"],
		blurb: "Rohini rules growth and stores."
	},
	{
		key: "gift_buy",
		name: "Buy a significant gift",
		nameHi: "उपहार",
		category: "Purchase",
		preferredVara: ["Friday", "Wednesday"],
		preferredNakshatra: [
			"Rohini",
			"Revati",
			"Hasta"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Venus"],
		blurb: "Venus hora."
	},
	{
		key: "art_collect",
		name: "Art / collectible buy",
		nameHi: "कला खरीद",
		category: "Purchase",
		preferredVara: ["Friday", "Thursday"],
		preferredNakshatra: [
			"Chitra",
			"Rohini",
			"Revati"
		],
		avoidTithi: avoidLight,
		minTara: 4,
		karaka: ["Venus", "Mercury"],
		blurb: "Chitra for form and beauty."
	},
	{
		key: "subscription_annual",
		name: "Annual subscription",
		nameHi: "वार्षिक सदस्यता",
		category: "Purchase",
		preferredVara: ["Thursday", "Wednesday"],
		preferredNakshatra: ["Pushya", "Hasta"],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Jupiter", "Mercury"],
		blurb: "Thursday for recurring value."
	},
	{
		key: "property_purchase",
		name: "Property purchase",
		nameHi: "प्रॉपर्टी खरीद",
		category: "Real Estate",
		preferredVara: [
			"Thursday",
			"Friday",
			"Monday"
		],
		preferredNakshatra: [
			"Rohini",
			"Uttara Phalguni",
			"Uttara Ashadha",
			"Uttara Bhadrapada"
		],
		avoidTithi: avoidRikta,
		minTara: 6,
		karaka: [
			"Mars",
			"Venus",
			"Jupiter",
			"Saturn"
		],
		blurb: "Fixed Uttara stars for land."
	},
	{
		key: "property_registration",
		name: "Property registration",
		nameHi: "रजिस्ट्री",
		category: "Real Estate",
		preferredVara: [
			"Thursday",
			"Friday",
			"Wednesday"
		],
		preferredNakshatra: [
			"Rohini",
			"Uttara Phalguni",
			"Uttara Ashadha"
		],
		avoidTithi: avoidRikta,
		minTara: 6,
		karaka: ["Mars", "Mercury"],
		blurb: "High Tara bar; skip Vishti."
	},
	{
		key: "housewarming",
		name: "Griha pravesh",
		nameHi: "गृह प्रवेश",
		category: "Real Estate",
		preferredVara: [
			"Thursday",
			"Friday",
			"Monday",
			"Wednesday"
		],
		preferredNakshatra: [
			"Rohini",
			"Uttara Phalguni",
			"Uttara Ashadha",
			"Revati"
		],
		avoidTithi: avoidRikta,
		minTara: 6,
		karaka: [
			"Mars",
			"Venus",
			"Jupiter"
		],
		blurb: "Classical griha pravesh stars."
	},
	{
		key: "rent_house",
		name: "Sign a rental",
		nameHi: "किराया समझौता",
		category: "Real Estate",
		preferredVara: [
			"Wednesday",
			"Thursday",
			"Friday"
		],
		preferredNakshatra: [
			"Rohini",
			"Punarvasu",
			"Pushya"
		],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: ["Moon", "Venus"],
		blurb: "Punarvasu for temporary dwellings."
	},
	{
		key: "home_renovation",
		name: "Start renovation",
		nameHi: "नवीनीकरण",
		category: "Real Estate",
		preferredVara: [
			"Wednesday",
			"Thursday",
			"Friday"
		],
		preferredNakshatra: [
			"Rohini",
			"Uttara Phalguni",
			"Hasta"
		],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: ["Mars", "Venus"],
		blurb: "Avoid fierce nakshatras for breaking work if possible."
	},
	{
		key: "vastu_consult",
		name: "Vastu consultation",
		nameHi: "वास्तु परामर्श",
		category: "Real Estate",
		preferredVara: ["Thursday", "Wednesday"],
		preferredNakshatra: ["Pushya", "Hasta"],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Jupiter", "Mercury"],
		blurb: "Guru vara."
	},
	{
		key: "dating",
		name: "First date",
		nameHi: "पहली मुलाकात",
		category: "Relationship",
		preferredVara: [
			"Friday",
			"Monday",
			"Wednesday"
		],
		preferredNakshatra: [
			"Rohini",
			"Hasta",
			"Swati",
			"Revati"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Venus", "Moon"],
		blurb: "Friday + Rohini or Revati."
	},
	{
		key: "engagement",
		name: "Fix engagement",
		nameHi: "सगाई तय करना",
		category: "Relationship",
		preferredVara: relVara,
		preferredNakshatra: [
			"Rohini",
			"Uttara Phalguni",
			"Hasta",
			"Swati",
			"Anuradha"
		],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: [
			"Venus",
			"Moon",
			"Jupiter"
		],
		blurb: "Avoid Rikta and Vishti."
	},
	{
		key: "marriage",
		name: "Marriage",
		nameHi: "विवाह",
		category: "Relationship",
		preferredVara: relVara,
		preferredNakshatra: [
			"Rohini",
			"Uttara Phalguni",
			"Uttara Ashadha",
			"Uttara Bhadrapada",
			"Revati"
		],
		avoidTithi: avoidRikta,
		minTara: 6,
		karaka: [
			"Venus",
			"Jupiter",
			"Moon"
		],
		blurb: "Full lagna shuddhi still needed with a pandit for the ceremony."
	},
	{
		key: "proposal",
		name: "Propose",
		nameHi: "प्रपोज़",
		category: "Relationship",
		preferredVara: ["Friday", "Monday"],
		preferredNakshatra: [
			"Rohini",
			"Revati",
			"Uttara Phalguni"
		],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: ["Venus", "Moon"],
		blurb: "Venus hora, strong Chandra Bala."
	},
	{
		key: "reconcile",
		name: "Reconcile after a fight",
		nameHi: "सुलह",
		category: "Relationship",
		preferredVara: [
			"Friday",
			"Monday",
			"Thursday"
		],
		preferredNakshatra: [
			"Revati",
			"Rohini",
			"Anuradha"
		],
		avoidTithi: [
			4,
			9,
			14
		],
		minTara: 2,
		karaka: [
			"Venus",
			"Moon",
			"Jupiter"
		],
		blurb: "Soft stars, not Ugra."
	},
	{
		key: "meet_parents",
		name: "Meet the family",
		nameHi: "परिवार से मिलना",
		category: "Relationship",
		preferredVara: relVara,
		preferredNakshatra: [
			"Rohini",
			"Pushya",
			"Revati"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: [
			"Moon",
			"Venus",
			"Jupiter"
		],
		blurb: "Pushya for family blessing."
	},
	{
		key: "anniversary",
		name: "Anniversary plan",
		nameHi: "वर्षगांठ",
		category: "Relationship",
		preferredVara: ["Friday", "Monday"],
		preferredNakshatra: ["Rohini", "Revati"],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Venus", "Moon"],
		blurb: "Friday evening Venus hora."
	},
	{
		key: "breakup_talk",
		name: "Difficult relationship talk",
		nameHi: "कठिन बातचीत",
		category: "Relationship",
		preferredVara: ["Wednesday", "Thursday"],
		preferredNakshatra: ["Hasta", "Anuradha"],
		avoidTithi: [
			8,
			9,
			14
		],
		minTara: 2,
		karaka: ["Mercury", "Saturn"],
		blurb: "Clarity over romance; skip fierce tithis."
	},
	{
		key: "child_birth_planning",
		name: "Plan birth timing",
		nameHi: "जन्म समय",
		category: "Family",
		preferredVara: relVara,
		preferredNakshatra: [
			"Pushya",
			"Rohini",
			"Hasta",
			"Revati",
			"Ashwini"
		],
		avoidTithi: avoidRikta,
		minTara: 6,
		karaka: [
			"Jupiter",
			"Moon",
			"Venus"
		],
		blurb: "Medical necessity always overrides muhurat."
	},
	{
		key: "naming_ceremony",
		name: "Namakarana",
		nameHi: "नामकरण",
		category: "Family",
		preferredVara: relVara,
		preferredNakshatra: [
			"Pushya",
			"Hasta",
			"Rohini",
			"Revati"
		],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: [
			"Mercury",
			"Jupiter",
			"Moon"
		],
		blurb: "Mercury for the name itself."
	},
	{
		key: "annaprashana",
		name: "First feeding",
		nameHi: "अन्नप्राशन",
		category: "Family",
		preferredVara: [
			"Monday",
			"Thursday",
			"Friday"
		],
		preferredNakshatra: [
			"Pushya",
			"Rohini",
			"Revati"
		],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: ["Moon", "Jupiter"],
		blurb: "Pushya is traditional."
	},
	{
		key: "school_admission",
		name: "School admission",
		nameHi: "स्कूल दाखिला",
		category: "Family",
		preferredVara: careerVara,
		preferredNakshatra: [
			"Hasta",
			"Pushya",
			"Revati"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Mercury", "Jupiter"],
		blurb: "Mercury + Jupiter."
	},
	{
		key: "birthday_party",
		name: "Child birthday",
		nameHi: "जन्मदिन",
		category: "Family",
		preferredVara: [
			"Friday",
			"Monday",
			"Thursday"
		],
		preferredNakshatra: [
			"Rohini",
			"Pushya",
			"Revati"
		],
		avoidTithi: [
			4,
			9,
			14
		],
		minTara: 2,
		karaka: ["Moon", "Venus"],
		blurb: "Joy over strictness; still skip Vishti."
	},
	{
		key: "family_gathering",
		name: "Family gathering",
		nameHi: "पारिवारिक जमावड़ा",
		category: "Family",
		preferredVara: [
			"Thursday",
			"Friday",
			"Monday"
		],
		preferredNakshatra: [
			"Rohini",
			"Pushya",
			"Revati"
		],
		avoidTithi: [4, 9],
		minTara: 0,
		karaka: ["Moon", "Jupiter"],
		blurb: "Thursday for elders."
	},
	{
		key: "elder_care",
		name: "Elder-care decision",
		nameHi: "बुजुर्ग देखभाल",
		category: "Family",
		preferredVara: ["Thursday", "Monday"],
		preferredNakshatra: [
			"Pushya",
			"Anuradha",
			"Revati"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: [
			"Jupiter",
			"Saturn",
			"Moon"
		],
		blurb: "Saturn + Jupiter for duty."
	},
	{
		key: "pet_adoption",
		name: "Adopt a pet",
		nameHi: "पालतू लाना",
		category: "Family",
		preferredVara: ["Monday", "Friday"],
		preferredNakshatra: [
			"Rohini",
			"Revati",
			"Pushya"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Moon", "Venus"],
		blurb: "Moon for living beings."
	},
	{
		key: "education_start",
		name: "Start a course",
		nameHi: "कोर्स शुरू",
		category: "Education",
		preferredVara: careerVara,
		preferredNakshatra: [
			"Hasta",
			"Pushya",
			"Ashwini",
			"Revati"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Mercury", "Jupiter"],
		blurb: "Vidya starts on Mercury/Jupiter days."
	},
	{
		key: "exam",
		name: "Sit an exam",
		nameHi: "परीक्षा",
		category: "Education",
		preferredVara: careerVara,
		preferredNakshatra: [
			"Hasta",
			"Pushya",
			"Revati",
			"Ashwini"
		],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: ["Mercury", "Jupiter"],
		blurb: "Hasta is the hand of skill."
	},
	{
		key: "thesis_submit",
		name: "Submit thesis / paper",
		nameHi: "पेपर जमा",
		category: "Education",
		preferredVara: ["Wednesday", "Thursday"],
		preferredNakshatra: ["Hasta", "Pushya"],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Mercury", "Jupiter"],
		blurb: "Mercury hora."
	},
	{
		key: "skill_workshop",
		name: "Workshop / training",
		nameHi: "प्रशिक्षण",
		category: "Education",
		preferredVara: careerVara,
		preferredNakshatra: [
			"Hasta",
			"Pushya",
			"Ashwini"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Mercury"],
		blurb: "Swift stars for learning bursts."
	},
	{
		key: "language_start",
		name: "Start a language",
		nameHi: "भाषा शुरू",
		category: "Education",
		preferredVara: ["Wednesday", "Friday"],
		preferredNakshatra: [
			"Hasta",
			"Revati",
			"Punarvasu"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Mercury", "Venus"],
		blurb: "Mercury is speech."
	},
	{
		key: "coaching_enroll",
		name: "Enroll in coaching",
		nameHi: "कोचिंग दाखिला",
		category: "Education",
		preferredVara: careerVara,
		preferredNakshatra: ["Hasta", "Pushya"],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Mercury", "Jupiter"],
		blurb: "Same as vidyarambha."
	},
	{
		key: "court_case",
		name: "Court hearing",
		nameHi: "कोर्ट केस",
		category: "Legal",
		preferredVara: [
			"Thursday",
			"Friday",
			"Wednesday"
		],
		preferredNakshatra: [
			"Pushya",
			"Hasta",
			"Anuradha",
			"Uttara Ashadha"
		],
		avoidTithi: avoidRikta,
		minTara: 6,
		karaka: [
			"Jupiter",
			"Saturn",
			"Mercury"
		],
		blurb: "Jupiter for dharma, Saturn for process."
	},
	{
		key: "affidavit",
		name: "Sign affidavit",
		nameHi: "शपथ पत्र",
		category: "Legal",
		preferredVara: ["Wednesday", "Thursday"],
		preferredNakshatra: ["Hasta", "Anuradha"],
		avoidTithi: avoidRikta,
		minTara: 2,
		karaka: ["Mercury", "Saturn"],
		blurb: "Mercury for writing, skip Vishti."
	},
	{
		key: "will_write",
		name: "Write a will",
		nameHi: "वसीयत",
		category: "Legal",
		preferredVara: ["Thursday", "Saturday"],
		preferredNakshatra: [
			"Uttara Ashadha",
			"Anuradha",
			"Pushya"
		],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: ["Saturn", "Jupiter"],
		blurb: "Saturn karaka of endings done well."
	},
	{
		key: "legal_notice",
		name: "Send legal notice",
		nameHi: "लीगल नोटिस",
		category: "Legal",
		preferredVara: ["Wednesday", "Thursday"],
		preferredNakshatra: [
			"Hasta",
			"Jyeshtha",
			"Anuradha"
		],
		avoidTithi: avoidLight,
		minTara: 4,
		karaka: ["Mercury", "Mars"],
		blurb: "Not on Vishti."
	},
	{
		key: "website_launch",
		name: "Website / app launch",
		nameHi: "ऐप लॉन्च",
		category: "Technology",
		preferredVara: careerVara,
		preferredNakshatra: [
			"Hasta",
			"Pushya",
			"Rohini"
		],
		avoidTithi: [
			4,
			9,
			14,
			30
		],
		minTara: 2,
		karaka: ["Mercury", "Jupiter"],
		blurb: "Mercury hora, Pushya if you can wait."
	},
	{
		key: "deploy_prod",
		name: "Production deploy",
		nameHi: "प्रोडक्शन डिप्लॉय",
		category: "Technology",
		preferredVara: ["Wednesday", "Thursday"],
		preferredNakshatra: [
			"Hasta",
			"Pushya",
			"Ashwini"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Mercury"],
		blurb: "Avoid Rahu Kaal for go-live."
	},
	{
		key: "buy_domain",
		name: "Buy domain / brand name",
		nameHi: "डोमेन खरीद",
		category: "Technology",
		preferredVara: ["Wednesday", "Friday"],
		preferredNakshatra: ["Hasta", "Rohini"],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Mercury", "Venus"],
		blurb: "Name = Mercury + Venus."
	},
	{
		key: "data_migration",
		name: "Data migration",
		nameHi: "डेटा माइग्रेशन",
		category: "Technology",
		preferredVara: ["Wednesday", "Thursday"],
		preferredNakshatra: ["Hasta", "Punarvasu"],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Mercury", "Saturn"],
		blurb: "Punarvasu for moving and restoring."
	},
	{
		key: "daily_start",
		name: "Start an important day",
		nameHi: "दिन की शुरुआत",
		category: "Daily",
		preferredVara: relVara,
		preferredNakshatra: [
			"Hasta",
			"Pushya",
			"Ashwini"
		],
		avoidTithi: avoidLight,
		minTara: 0,
		karaka: ["Sun", "Mercury"],
		blurb: "Abhijit muhurat is a safe universal window."
	},
	{
		key: "deep_work",
		name: "Deep work block",
		nameHi: "गहन कार्य",
		category: "Daily",
		preferredVara: [
			"Wednesday",
			"Thursday",
			"Saturday"
		],
		preferredNakshatra: ["Hasta", "Anuradha"],
		avoidTithi: [4, 9],
		minTara: 0,
		karaka: ["Mercury", "Saturn"],
		blurb: "Saturn hora for focus."
	},
	{
		key: "inbox_zero",
		name: "Difficult emails",
		nameHi: "कठिन ईमेल",
		category: "Daily",
		preferredVara: ["Wednesday", "Thursday"],
		preferredNakshatra: ["Hasta", "Pushya"],
		avoidTithi: [
			4,
			9,
			14
		],
		minTara: 0,
		karaka: ["Mercury"],
		blurb: "Mercury hora; skip Vishti."
	},
	{
		key: "habit_start",
		name: "Start a habit",
		nameHi: "आदत शुरू",
		category: "Daily",
		preferredVara: [
			"Thursday",
			"Monday",
			"Wednesday"
		],
		preferredNakshatra: [
			"Rohini",
			"Pushya",
			"Uttara Ashadha"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Saturn", "Moon"],
		blurb: "Fixed stars help habits stick."
	},
	{
		key: "sleep_early",
		name: "Reset sleep schedule",
		nameHi: "नींद सुधार",
		category: "Daily",
		preferredVara: ["Monday", "Thursday"],
		preferredNakshatra: ["Revati", "Rohini"],
		avoidTithi: [],
		minTara: 0,
		karaka: ["Moon"],
		blurb: "Moon hora in the evening."
	},
	{
		key: "cook_feast",
		name: "Cook for guests",
		nameHi: "मेहमानों के लिए पकाना",
		category: "Daily",
		preferredVara: [
			"Friday",
			"Monday",
			"Thursday"
		],
		preferredNakshatra: ["Rohini", "Pushya"],
		avoidTithi: [4, 9],
		minTara: 0,
		karaka: ["Venus", "Moon"],
		blurb: "Rohini rules the kitchen."
	},
	{
		key: "declutter",
		name: "Declutter / donate",
		nameHi: "साफ़-सफाई",
		category: "Daily",
		preferredVara: ["Saturday", "Wednesday"],
		preferredNakshatra: ["Hasta", "Ardra"],
		avoidTithi: [],
		minTara: 0,
		karaka: ["Saturn"],
		blurb: "Saturday is useful for letting go."
	},
	{
		key: "journal",
		name: "Journal / planning night",
		nameHi: "जर्नल",
		category: "Daily",
		preferredVara: ["Monday", "Wednesday"],
		preferredNakshatra: ["Hasta", "Revati"],
		avoidTithi: [],
		minTara: 0,
		karaka: ["Mercury", "Moon"],
		blurb: "Mercury + Moon."
	},
	{
		key: "puja",
		name: "Puja / havan",
		nameHi: "पूजा",
		category: "Spiritual",
		preferredVara: [
			"Monday",
			"Thursday",
			"Friday"
		],
		preferredNakshatra: [
			"Pushya",
			"Rohini",
			"Uttara Bhadrapada",
			"Revati"
		],
		avoidTithi: [],
		minTara: 0,
		karaka: ["Jupiter", "Moon"],
		blurb: "Most tithis can host worship; prefer Pushya."
	},
	{
		key: "meditation_start",
		name: "Begin a sadhana",
		nameHi: "साधना शुरू",
		category: "Spiritual",
		preferredVara: ["Thursday", "Monday"],
		preferredNakshatra: [
			"Pushya",
			"Revati",
			"Uttara Bhadrapada"
		],
		avoidTithi: [],
		minTara: 2,
		karaka: ["Jupiter", "Ketu"],
		blurb: "Brahma muhurta still trumps weekday."
	},
	{
		key: "mantra_diksha",
		name: "Mantra initiation",
		nameHi: "मंत्र दीक्षा",
		category: "Spiritual",
		preferredVara: ["Thursday", "Monday"],
		preferredNakshatra: [
			"Pushya",
			"Rohini",
			"Revati"
		],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: ["Jupiter", "Moon"],
		blurb: "Guru vara."
	},
	{
		key: "temple_visit",
		name: "Temple visit",
		nameHi: "मंदिर जाना",
		category: "Spiritual",
		preferredVara: [
			"Thursday",
			"Monday",
			"Friday"
		],
		preferredNakshatra: ["Pushya", "Revati"],
		avoidTithi: [],
		minTara: 0,
		karaka: ["Jupiter"],
		blurb: "Any shubh hora works."
	},
	{
		key: "send_resume",
		name: "Send a resume",
		nameHi: "रेज़्यूमे भेजना",
		category: "Career",
		preferredVara: careerVara,
		preferredNakshatra: [
			"Hasta",
			"Pushya",
			"Ashwini"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Mercury", "Sun"],
		blurb: "Swift stars for a first impression."
	},
	{
		key: "client_call",
		name: "Call a client for payment",
		nameHi: "क्लाइंट को कॉल",
		category: "Finance",
		preferredVara: financeVara,
		preferredNakshatra: [
			"Hasta",
			"Pushya",
			"Rohini"
		],
		avoidTithi: avoidRikta,
		minTara: 2,
		karaka: [
			"Mercury",
			"Jupiter",
			"Venus"
		],
		blurb: "Guru or Shukra hora for asking money."
	},
	{
		key: "file_case",
		name: "File a court case",
		nameHi: "केस फाइल करना",
		category: "Legal",
		preferredVara: [
			"Thursday",
			"Wednesday",
			"Friday"
		],
		preferredNakshatra: [
			"Pushya",
			"Hasta",
			"Anuradha",
			"Uttara Ashadha"
		],
		avoidTithi: avoidRikta,
		minTara: 6,
		karaka: [
			"Jupiter",
			"Saturn",
			"Mercury"
		],
		blurb: "Dharma tithi plus Guru mahadasha is ideal."
	},
	{
		key: "election_nomination",
		name: "Election nomination filing",
		nameHi: "नामांकन पत्र",
		category: "Civic",
		preferredVara: [
			"Thursday",
			"Wednesday",
			"Sunday"
		],
		preferredNakshatra: [
			"Pushya",
			"Hasta",
			"Ashwini",
			"Uttara Phalguni"
		],
		avoidTithi: avoidRikta,
		minTara: 6,
		karaka: [
			"Sun",
			"Jupiter",
			"Mercury"
		],
		blurb: "Sun for office, Jupiter for public trust."
	},
	{
		key: "minister_entry",
		name: "Minister / office entry",
		nameHi: "कार्यालय प्रवेश",
		category: "Civic",
		preferredVara: [
			"Thursday",
			"Sunday",
			"Wednesday"
		],
		preferredNakshatra: [
			"Pushya",
			"Rohini",
			"Uttara Phalguni",
			"Uttara Ashadha"
		],
		avoidTithi: avoidRikta,
		minTara: 6,
		karaka: [
			"Sun",
			"Jupiter",
			"Mars"
		],
		blurb: "Fixed stars lock a public seat."
	},
	{
		key: "oath_ceremony",
		name: "Oath of office",
		nameHi: "शपथ ग्रहण",
		category: "Civic",
		preferredVara: ["Thursday", "Sunday"],
		preferredNakshatra: [
			"Pushya",
			"Uttara Phalguni",
			"Rohini"
		],
		avoidTithi: avoidRikta,
		minTara: 6,
		karaka: ["Sun", "Jupiter"],
		blurb: "Amrit or Sarvartha Siddhi preferred."
	},
	{
		key: "campaign_speech",
		name: "Public address",
		nameHi: "सार्वजनिक भाषण",
		category: "Civic",
		preferredVara: [
			"Wednesday",
			"Thursday",
			"Sunday"
		],
		preferredNakshatra: [
			"Hasta",
			"Pushya",
			"Ashwini"
		],
		avoidTithi: avoidLight,
		minTara: 4,
		karaka: ["Mercury", "Sun"],
		blurb: "Hasta for speech; skip Vishti."
	},
	{
		key: "company_incorporation",
		name: "Company incorporation",
		nameHi: "कंपनी पंजीकरण",
		category: "Business",
		preferredVara: [
			"Thursday",
			"Wednesday",
			"Friday"
		],
		preferredNakshatra: [
			"Rohini",
			"Pushya",
			"Uttara Phalguni",
			"Uttara Ashadha"
		],
		avoidTithi: avoidRikta,
		minTara: 6,
		karaka: [
			"Jupiter",
			"Mercury",
			"Sun"
		],
		blurb: "Fixed nakshatra plus Guru hora."
	},
	{
		key: "movie_launch",
		name: "Film / show launch",
		nameHi: "फिल्म लॉन्च",
		category: "Media",
		preferredVara: [
			"Friday",
			"Thursday",
			"Wednesday"
		],
		preferredNakshatra: [
			"Rohini",
			"Hasta",
			"Chitra",
			"Pushya",
			"Revati"
		],
		avoidTithi: avoidRikta,
		minTara: 6,
		karaka: [
			"Venus",
			"Mercury",
			"Sun"
		],
		blurb: "Shukra for image, Budh for the public."
	},
	{
		key: "music_release",
		name: "Music or book release",
		nameHi: "रिलीज़",
		category: "Media",
		preferredVara: [
			"Friday",
			"Wednesday",
			"Thursday"
		],
		preferredNakshatra: [
			"Rohini",
			"Revati",
			"Hasta",
			"Pushya"
		],
		avoidTithi: avoidRikta,
		minTara: 4,
		karaka: ["Venus", "Mercury"],
		blurb: "Venus weekday, avoid Rikta."
	},
	{
		key: "product_launch",
		name: "Product launch",
		nameHi: "प्रोडक्ट लॉन्च",
		category: "Business",
		preferredVara: [
			"Thursday",
			"Wednesday",
			"Friday"
		],
		preferredNakshatra: [
			"Pushya",
			"Rohini",
			"Hasta"
		],
		avoidTithi: avoidRikta,
		minTara: 6,
		karaka: [
			"Jupiter",
			"Mercury",
			"Venus"
		],
		blurb: "Pushya or Sarvartha Siddhi for go-live."
	},
	{
		key: "ipo_listing",
		name: "IPO / listing",
		nameHi: "आईपीओ",
		category: "Finance",
		preferredVara: [
			"Thursday",
			"Friday",
			"Wednesday"
		],
		preferredNakshatra: [
			"Rohini",
			"Pushya",
			"Uttara Phalguni"
		],
		avoidTithi: avoidRikta,
		minTara: 6,
		karaka: [
			"Jupiter",
			"Venus",
			"Mercury"
		],
		blurb: "Capital close — high Tara bar."
	},
	{
		key: "engagement_ceremony",
		name: "Engagement ceremony",
		nameHi: "सगाई समारोह",
		category: "Relationship",
		preferredVara: relVara,
		preferredNakshatra: [
			"Rohini",
			"Uttara Phalguni",
			"Hasta",
			"Revati"
		],
		avoidTithi: avoidRikta,
		minTara: 6,
		karaka: [
			"Venus",
			"Jupiter",
			"Moon"
		],
		blurb: "Ceremony needs a golden window, not just a talk."
	},
	{
		key: "vivah_muhurat",
		name: "Vivah muhurat",
		nameHi: "विवाह मुहूर्त",
		category: "Relationship",
		preferredVara: relVara,
		preferredNakshatra: [
			"Rohini",
			"Uttara Phalguni",
			"Uttara Ashadha",
			"Uttara Bhadrapada",
			"Revati",
			"Swati"
		],
		avoidTithi: avoidRikta,
		minTara: 6,
		karaka: [
			"Venus",
			"Jupiter",
			"Moon"
		],
		blurb: "Lagna shuddhi still belongs with a pandit; this scores the window."
	},
	{
		key: "dating_meet",
		name: "Dating / courtship meet",
		nameHi: "डेटिंग",
		category: "Relationship",
		preferredVara: [
			"Friday",
			"Monday",
			"Wednesday"
		],
		preferredNakshatra: [
			"Rohini",
			"Hasta",
			"Swati",
			"Revati"
		],
		avoidTithi: avoidLight,
		minTara: 2,
		karaka: ["Venus", "Moon"],
		blurb: "Friday plus Rohini or Revati."
	}
];
var MAJOR_KEYS = /* @__PURE__ */ new Set([
	"job_joining",
	"salary_negotiation",
	"business_deal",
	"partnership",
	"new_venture",
	"office_inauguration",
	"fundraising_close",
	"surgery",
	"property_purchase",
	"property_registration",
	"housewarming",
	"marriage",
	"engagement",
	"child_birth_planning",
	"naming_ceremony",
	"court_case",
	"will_write",
	"file_case",
	"election_nomination",
	"minister_entry",
	"oath_ceremony",
	"company_incorporation",
	"movie_launch",
	"product_launch",
	"ipo_listing",
	"engagement_ceremony",
	"vivah_muhurat",
	"relocation"
]);
var CAT_PURUSHARTHA = {
	Career: "artha",
	Business: "artha",
	Marketing: "artha",
	Finance: "artha",
	Health: "dharma",
	Travel: "kama",
	Purchase: "artha",
	"Real Estate": "artha",
	Relationship: "kama",
	Family: "dharma",
	Education: "dharma",
	Legal: "dharma",
	Civic: "dharma",
	Media: "kama",
	Technology: "artha",
	Daily: "artha",
	Spiritual: "moksha"
};
var CAT_TATVA = {
	Career: "vayu",
	Business: "prithvi",
	Marketing: "vayu",
	Finance: "prithvi",
	Health: "jala",
	Travel: "vayu",
	Purchase: "prithvi",
	"Real Estate": "prithvi",
	Relationship: "jala",
	Family: "jala",
	Education: "vayu",
	Legal: "agni",
	Civic: "agni",
	Media: "vayu",
	Technology: "vayu",
	Daily: "vayu",
	Spiritual: "jala"
};
var CAT_GUNA = {
	Career: "rajas",
	Business: "rajas",
	Marketing: "rajas",
	Finance: "sattva",
	Health: "sattva",
	Travel: "rajas",
	Purchase: "rajas",
	"Real Estate": "sattva",
	Relationship: "rajas",
	Family: "sattva",
	Education: "sattva",
	Legal: "sattva",
	Civic: "sattva",
	Media: "rajas",
	Technology: "rajas",
	Daily: "rajas",
	Spiritual: "sattva"
};
function finalize(seed) {
	const major = MAJOR_KEYS.has(seed.key) || seed.minTara >= 6;
	return {
		...seed,
		paddhati: "advance",
		tier: major ? "major" : "daily",
		purushartha: CAT_PURUSHARTHA[seed.category] ?? "artha",
		tatva: CAT_TATVA[seed.category] ?? "vayu",
		guna: CAT_GUNA[seed.category] ?? "rajas",
		creditCost: major ? 5 : 1
	};
}
var TRAD_RULE = {
	Baby: {
		vara: [
			"Thursday",
			"Monday",
			"Wednesday"
		],
		stars: [
			"Rohini",
			"Pushya",
			"Hasta"
		],
		karaka: ["Moon", "Jupiter"],
		avoid: [
			4,
			9,
			14
		],
		minTara: 4,
		major: true
	},
	Business: {
		vara: [
			"Wednesday",
			"Thursday",
			"Friday"
		],
		stars: [
			"Pushya",
			"Hasta",
			"Anuradha"
		],
		karaka: ["Mercury", "Jupiter"],
		avoid: [
			4,
			9,
			14
		],
		minTara: 4,
		major: true
	},
	Construction: {
		vara: ["Thursday", "Friday"],
		stars: [
			"Rohini",
			"Uttara Phalguni",
			"Uttara Ashadha"
		],
		karaka: ["Jupiter", "Venus"],
		avoid: [
			4,
			9,
			14,
			30
		],
		minTara: 6,
		major: true
	},
	Dealing: {
		vara: [
			"Thursday",
			"Friday",
			"Wednesday"
		],
		stars: [
			"Pushya",
			"Rohini",
			"Hasta"
		],
		karaka: ["Jupiter", "Mercury"],
		avoid: [
			4,
			9,
			14
		],
		minTara: 4,
		major: false
	},
	Education: {
		vara: ["Wednesday", "Thursday"],
		stars: [
			"Hasta",
			"Pushya",
			"Punarvasu"
		],
		karaka: ["Mercury", "Jupiter"],
		avoid: [4, 9],
		minTara: 2,
		major: false
	},
	Farming: {
		vara: ["Thursday", "Monday"],
		stars: [
			"Rohini",
			"Pushya",
			"Uttara Phalguni"
		],
		karaka: ["Moon", "Jupiter"],
		avoid: [4, 9],
		minTara: 2,
		major: false
	},
	"Grih Pravesh": {
		vara: [
			"Thursday",
			"Friday",
			"Monday"
		],
		stars: [
			"Rohini",
			"Uttara Phalguni",
			"Uttara Bhadrapada"
		],
		karaka: ["Venus", "Jupiter"],
		avoid: [
			4,
			9,
			14,
			30
		],
		minTara: 6,
		major: true
	},
	Manufacturing: {
		vara: ["Wednesday", "Friday"],
		stars: ["Hasta", "Pushya"],
		karaka: ["Mercury", "Venus"],
		avoid: [4, 9],
		minTara: 2,
		major: false
	},
	Marriage: {
		vara: [
			"Monday",
			"Wednesday",
			"Thursday",
			"Friday"
		],
		stars: [
			"Rohini",
			"Revati",
			"Anuradha",
			"Uttara Phalguni"
		],
		karaka: ["Venus", "Jupiter"],
		avoid: [
			4,
			8,
			9,
			14,
			30
		],
		minTara: 6,
		major: true
	},
	Medical: {
		vara: [
			"Monday",
			"Wednesday",
			"Thursday"
		],
		stars: [
			"Ashwini",
			"Hasta",
			"Pushya"
		],
		karaka: ["Moon", "Mercury"],
		avoid: [
			4,
			9,
			14,
			30
		],
		minTara: 4,
		major: true
	},
	Misc: {
		vara: [
			"Wednesday",
			"Thursday",
			"Friday"
		],
		stars: ["Hasta", "Pushya"],
		karaka: ["Mercury"],
		avoid: [4, 9],
		minTara: 0,
		major: false
	},
	Official: {
		vara: [
			"Thursday",
			"Sunday",
			"Wednesday"
		],
		stars: [
			"Pushya",
			"Hasta",
			"Uttara Phalguni"
		],
		karaka: ["Sun", "Jupiter"],
		avoid: [
			4,
			9,
			14
		],
		minTara: 4,
		major: true
	},
	Pregnancy: {
		vara: [
			"Monday",
			"Thursday",
			"Friday"
		],
		stars: [
			"Rohini",
			"Pushya",
			"Revati"
		],
		karaka: ["Moon", "Venus"],
		avoid: [
			4,
			9,
			14,
			30
		],
		minTara: 6,
		major: true
	},
	Purchasing: {
		vara: [
			"Thursday",
			"Friday",
			"Wednesday"
		],
		stars: [
			"Pushya",
			"Rohini",
			"Hasta"
		],
		karaka: ["Venus", "Mercury"],
		avoid: [4, 9],
		minTara: 2,
		major: false
	},
	Selling: {
		vara: ["Wednesday", "Friday"],
		stars: ["Hasta", "Swati"],
		karaka: ["Mercury"],
		avoid: [4, 9],
		minTara: 2,
		major: false
	},
	Starting: {
		vara: [
			"Thursday",
			"Wednesday",
			"Friday"
		],
		stars: [
			"Pushya",
			"Hasta",
			"Rohini"
		],
		karaka: ["Jupiter", "Mercury"],
		avoid: [
			4,
			9,
			14
		],
		minTara: 4,
		major: true
	},
	Using: {
		vara: ["Wednesday", "Friday"],
		stars: ["Hasta", "Pushya"],
		karaka: ["Mercury"],
		avoid: [4, 9],
		minTara: 0,
		major: false
	},
	Wearing: {
		vara: [
			"Thursday",
			"Friday",
			"Monday"
		],
		stars: [
			"Rohini",
			"Pushya",
			"Hasta"
		],
		karaka: ["Venus", "Moon"],
		avoid: [4, 9],
		minTara: 2,
		major: false
	},
	Journeys: {
		vara: [
			"Wednesday",
			"Thursday",
			"Friday"
		],
		stars: [
			"Ashwini",
			"Mrigashira",
			"Hasta"
		],
		karaka: ["Mercury", "Moon"],
		avoid: [
			4,
			9,
			14
		],
		minTara: 2,
		major: false
	}
};
var TRADITIONAL = PARASHAR.map((p) => {
	const r = TRAD_RULE[p.category] ?? TRAD_RULE.Misc;
	return {
		key: p.key,
		name: p.name,
		nameHi: p.nameHi,
		category: p.category,
		paddhati: "traditional",
		western: p.western,
		preferredVara: r.vara,
		preferredNakshatra: r.stars,
		avoidTithi: r.avoid,
		minTara: r.minTara,
		karaka: r.karaka,
		blurb: `${p.western}. Traditional panchang election.`,
		tier: r.major ? "major" : "daily",
		purushartha: p.category === "Marriage" || p.category === "Baby" ? "kama" : "artha",
		tatva: "prithvi",
		guna: "sattva",
		creditCost: r.major ? 5 : 1
	};
});
var ACTIVITIES = [
	...SEED.map(finalize),
	...CATALOG.map((a) => ({
		...a,
		paddhati: "advance"
	})),
	...TRADITIONAL
];
function getActivity(key) {
	return ACTIVITIES.find((a) => a.key === key);
}
/**
* Pending classical gates.
* Kshaya / vriddhi from sunrise tithi.
* Guru and Shukra asta by angular orb.
* Suryabala from natal Sun and weekday.
* D9 lagna gate for major rites.
* Abhujh: Akshaya Tritiya and Vijayadashami only.
*/
var spanCache = /* @__PURE__ */ new Map();
function tithiAt(local, lat, lon, tz) {
	return getPanchang(local, lat, lon, tz).tithi.number;
}
/** Kshaya: a tithi that rules no sunrise. Vriddhi: one tithi rules two sunrises. */
function tithiSpan(sunrise, lat, lon, tz) {
	const key = `${sunrise.toISOString()}|${lat}|${lon}`;
	const hit = spanCache.get(key);
	if (hit) return hit;
	const next = new Date(sunrise.getTime() + 864e5);
	const prev = /* @__PURE__ */ new Date(sunrise.getTime() - 864e5);
	const udaya = tithiAt(sunrise, lat, lon, tz);
	const nextUdaya = tithiAt(next, lat, lon, tz);
	const prevUdaya = tithiAt(prev, lat, lon, tz);
	const vriddhi = udaya === nextUdaya;
	const seen = /* @__PURE__ */ new Set();
	for (let h = 1; h < 24; h++) seen.add(tithiAt(new Date(sunrise.getTime() + h * 36e5), lat, lon, tz));
	const out = {
		kshaya: [...seen].filter((t) => t !== udaya && t !== nextUdaya && t !== prevUdaya),
		vriddhi,
		udaya
	};
	spanCache.set(key, out);
	return out;
}
function angle(a, b) {
	const d = Math.abs(a - b) % 360;
	return Math.min(d, 360 - d);
}
function combustion(local, tz) {
	const jd = toJulianDay(localToUtc(local, tz));
	const sun = sunLongitude(jd);
	const venus = planetSidereal("Venus", jd);
	const jupiter = planetSidereal("Jupiter", jd);
	const venusDeg = angle(venus, sun);
	const jupiterDeg = angle(jupiter, sun);
	return {
		venus: venusDeg <= 10,
		jupiter: jupiterDeg <= 11,
		venusDeg: Math.round(venusDeg * 10) / 10,
		jupiterDeg: Math.round(jupiterDeg * 10) / 10
	};
}
/** Suryabala: transit Sun from natal Sun. 8 and 12 weak. Sunday and 10th digbala support. */
function suryabala(local, tz, chart, lagnaIndex) {
	const jd = toJulianDay(localToUtc(local, tz));
	const sun = sunLongitude(jd);
	const sunSign = Math.floor(sun / 30) % 12;
	const house = (sunSign - (chart.grahas.find((g) => g.name === "Sun")?.rashiIndex ?? chart.sunRashi.index) + 12) % 12 + 1;
	let score = 50;
	if ([
		1,
		3,
		6,
		10,
		11
	].includes(house)) score += 20;
	if ([8, 12].includes(house)) score -= 25;
	if (local.getDay() === 0) score += 10;
	const digbal = (sunSign - lagnaIndex + 12) % 12 + 1 === 10;
	if (digbal) score += 10;
	const note = `Suryabala: Sun is ${house} from natal Sun${digbal ? ", digbala" : ""}`;
	return {
		score: Math.max(0, Math.min(100, score)),
		house,
		note
	};
}
function navamsaSign(lon) {
	const sign = Math.floor(lon / 30) % 12;
	const part = Math.floor(lon % 30 / (30 / 9));
	return ((sign % 2 === 0 ? sign : (sign + 8) % 12) + part) % 12;
}
var MAJOR_D9 = /* @__PURE__ */ new Set([
	"marriage",
	"engagement",
	"roka",
	"griha_pravesh",
	"bhoomi_pujan",
	"registry"
]);
function d9Gate(local, lat, lon, tz, chart, activityKey, tier) {
	if (tier !== "major" && !MAJOR_D9.has(activityKey) && !activityKey.includes("griha") && !activityKey.includes("marriage")) return {
		block: false,
		note: ""
	};
	const d9 = navamsaSign(ascendantSidereal(local, lat, lon, tz));
	const natalLagna = chart.lagnaIndex;
	const fromNatal = (d9 - navamsaSign(natalLagna * 30 + 15) + 12) % 12 + 1;
	return {
		block: fromNatal === 8 || fromNatal === 12,
		note: `D9 lagna ${RASHIS[d9]} is ${fromNatal} from natal D9`
	};
}
/** Only two widely attested abhujh days. They support; they do not erase Rahu or Bhadra. */
function abhujh(p) {
	const t = p.tithi.number;
	const sun = p.sunRashi.name;
	if (t === 3 && p.tithi.paksha === "Shukla" && sun === "Aries") return "Akshaya Tritiya";
	if (t === 10 && p.tithi.paksha === "Shukla" && sun === "Virgo") return "Vijayadashami";
	return null;
}
var DISHA = {
	0: "West",
	1: "East",
	2: "North",
	3: "North",
	4: "South",
	5: "West",
	6: "East"
};
/** Muhurta Chintamani: 2nd avritti of Vipat, Pratyari, Vadha — first pada is barred. */
function avrittiPadaBar(taraNumber, avritti, pada) {
	return (taraNumber === 3 || taraNumber === 5 || taraNumber === 7) && avritti === 2 && pada === 1;
}
function weightage(p, taraShubh) {
	const v = 8;
	const k = p.karana.isVishti ? 0 : 16;
	const y = p.yoga.isAshubh ? 0 : 32;
	const t = taraShubh ? 60 : 0;
	return v + k + y + t;
}
function extraGates(local, lat, lon, tz, chart, p, activityKey, tier, taraNumber, avritti) {
	const blocks = [];
	const cautions = [];
	const supports = [];
	const notes = [];
	const span = tithiSpan(new Date(p.sunrise), lat, lon, tz);
	if (span.kshaya.includes(p.tithi.number)) {
		const msg = `Kshaya tithi ${p.tithi.name}`;
		if (tier === "major") blocks.push(msg);
		else cautions.push(msg);
	}
	if (span.vriddhi) {
		const msg = `Vriddhi tithi ${p.tithi.name}`;
		if (tier === "major") cautions.push(msg);
		else supports.push(msg);
	}
	const asta = combustion(local, tz);
	if (asta.venus) {
		const msg = `Shukra asta (${asta.venusDeg}°)`;
		if (tier === "major") blocks.push(msg);
		else cautions.push(msg);
	}
	if (asta.jupiter) {
		const msg = `Guru asta (${asta.jupiterDeg}°)`;
		if (tier === "major") blocks.push(msg);
		else cautions.push(msg);
	}
	const surya = suryabala(local, tz, chart, Math.floor(ascendantSidereal(local, lat, lon, tz) / 30) % 12);
	notes.push(surya.note);
	if (surya.house === 8 || surya.house === 12) cautions.push(surya.note);
	else supports.push(surya.note);
	const d9 = d9Gate(local, lat, lon, tz, chart, activityKey, tier);
	if (d9.note) notes.push(d9.note);
	if (d9.block) blocks.push(d9.note);
	else if (d9.note && (tier === "major" || MAJOR_D9.has(activityKey))) supports.push(d9.note);
	const free = abhujh(p);
	if (free) supports.push(`Abhujh: ${free}`);
	if (avrittiPadaBar(taraNumber, avritti, p.nakshatra.pada)) blocks.push(`Avritti ${avritti} pada 1 of malefic tara`);
	if (tier === "major" && (taraNumber === 3 || taraNumber === 5 || taraNumber === 7)) blocks.push(`Tarabal ${taraNumber} blocked for major`);
	supports.push(`Udaya tithi is the sunrise tithi`);
	const w = weightage(p, !(taraNumber === 3 || taraNumber === 5 || taraNumber === 7));
	notes.push(`Weightage ${w} (vara 8, karana, yoga, tara 60)`);
	if (activityKey.includes("travel") || activityKey.includes("depart") || activityKey.includes("flight")) cautions.push(`Disha shool ${DISHA[local.getDay()]}`);
	return {
		blocks,
		cautions,
		supports,
		surya: surya.score,
		notes
	};
}
//#endregion
export { getActivity as a, extraGates as i, CATEGORIES as n, navamsaSign as o, PARASHAR_CATEGORIES as r, ACTIVITIES as t };
