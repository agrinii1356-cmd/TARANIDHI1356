# TaraNidhi — Architecture and Muhurat Framework

Personal Vedic almanac. A query is not answered by a universal calendar. It is answered by **your birth Moon** × **the work** × **a clock of candidate hours**.

This file describes what the running app actually computes. It does not describe a future kundli product.

## 1. One sentence

```
query → activity intent → birth chart → candidate hours
      → 14 paddhatis → weighted score 0–100 → ranked windows
```

Credits: daily intent costs **1 nidhi**, major intent costs **5 nidhi**. The search runs only when the user presses **Find golden windows**.

## 2. Query window (how a question becomes a time)

| Step | What happens | Code |
| --- | --- | --- |
| 1 | User types Hindi or English: “resume”, “vivah”, “election” | `src/routes/muhurat.tsx` filter on `name`, `nameHi`, `category` |
| 2 | User picks **Daily life** or **Big decisions** | `tier` on each activity |
| 3 | User picks one intent and a date range (default 14 days) | activity key + from/until |
| 4 | Wallet spends `creditCost` | `src/lib/panchang/wallet.ts` |
| 5 | Engine samples every **30 minutes from 08:00 to 19:30**, local time, skipping the past | `searchMuhurats` in `scoring.ts` |
| 6 | Each slot is scored. Daily bar is **50**. Major bar is **58** | `minScore` |
| 7 | Sort: Amrit Siddhi first, then Sarvartha Siddhi, then score | top **8** windows |
| 8 | Answer card: score, quality, tithi, nakshatra, vara, hora/uphora, dasha, reasons | `ScoreResult` |

A free-text question does not call a language model. It maps onto a **catalog intent**. The catalog is the purpose grammar. If two intents match, the user chooses one. That choice fixes karaka, preferred stars, tithi vetoes, purushartha, tatva, guna, and price.

## 3. Birth inputs (the only personal chart today)

Stored on the device (`taranidhi-profile`):

- name, date, time, city, latitude, longitude, timezone

Derived once from that instant (`getBirthChart`):

- janma nakshatra, pada, lord, guna, group
- janma Chandra rashi and tatva
- Surya rashi
- sidereal Moon longitude (needed for Vimshottari balance)

Not computed: lagna, houses, full graha longitudes, KP cusps, pratyantar dasha.

## 4. Sky clock

`src/lib/panchang/astronomy.ts`

- Julian Day from local time and timezone
- Tropical Sun (Meeus) and Moon (truncated ELP)
- Lahiri ayanamsa → sidereal longitudes
- Sunrise / sunset from latitude and longitude

Tithi and karana use **tropical elongation** (Moon − Sun). Ayanamsa cancels, which is correct.

Nakshatra, rashi, and yoga use **sidereal** longitudes. Yoga is `(sidereal Sun + sidereal Moon) / 13°20'`.

This is accurate enough for daily limbs. It is not Swiss-Ephemeris arc-second precision, and it is not a lagna muhurta chart.

## 5. Fourteen paddhatis that actually change the answer

These are the methods wired into the score. “Amazing” here means: this factor can move a slot from Avoid to Good, or can veto a slot that a printed panchang would call shubh.

| # | Paddhati | What it answers | Strength in TaraNidhi |
| --- | --- | --- | --- |
| 1 | **Panchaanga — Tithi** | Is the lunar day fit to start? | Shubh tithi +10. Listed avoid tithi −18. Rikta 4, 9, 14 are the usual veto. |
| 2 | **Vaar** | Does the weekday suit this work? | Preferred weekday +15. Bare Tuesday/Saturday −8. |
| 3 | **Nakshatra + pada** | Is today’s star the star of this work? | Preferred star +12. Pada is shown, not scored. |
| 4 | **Nitya Yoga** | Is the Sun+Moon yoga clean? | Shubh yoga +8. Vyatipata, Vaidhriti, Parigha, Vishkambha, Atiganda, Shula, Ganda, Vyaghata −12. |
| 5 | **Karana** | Is Bhadra running? | **Vishti −25.** Strongest universal veto. |
| 6 | **Paksha** | Shukla growth vs Krishna release | Stored on the tithi. Krishna Chaturdashi / Amavasya enter through tithi number, not a separate bonus. |
| 7 | **Navatara (Tara Bala)** | Is this star good *for this person*? | The personal spine. Sampat & Parama Mitra +25. Kshema, Sadhana, Mitra +18. Janma +5. Vipat, Pratyak, Naidhana −18. |
| 8 | **Chandra Bala** | Is transit Moon in a dusthana from natal Moon? | Houses 4, 8, 12 from janma rashi −15. Other distances +15. |
| 9 | **Hora** | Is the hour lord the karaka of the work? | Karaka match 75. Guru/Shukra/Budh 58. Shani/Mangal 42. |
| 10 | **Uphora** | First or second half of that hora? | Karaka + mukhya (first 30 min) +8. Second half −3. |
| 11 | **Rahu Kaal** | Is the slot inside the day’s Rahu segment? | Active −20. Segment is 1/8 of sunrise-to-sunset, weekday-mapped. |
| 12 | **Tatva** | Agni, Prithvi, Vayu, Jala of transit Moon vs the work | Match +6. |
| 13 | **Guna + Purushartha** | Sattva/Rajas/Tamas of the star; Dharma/Artha/Kama/Moksha of the tithi | Guna match +4. Tithi purushartha cycles every 4 tithis and matches +4. |
| 14 | **Vimshottari Maha + Antar** | Is the life-period the karaka’s period? | Maha match +22. Antar-only +14. Major work under Rahu/Ketu maha (unless that graha is the karaka) −10. |
| 15 | **Amrit Siddhi Yoga** | Weekday locked to one nakshatra | Golden bucket = 100. Sorted above everything else. |
| 16 | **Sarvartha Siddhi Yoga** | Weekday locked to a small star set — usable for most starts | Golden bucket = 86. Sorted just under Amrit. |

Counted as **14 scoring families**. Amrit and Sarvartha are one golden family with two yogas, so the table shows 16 rows and **14 families**:

1. Tithi  
2. Vaar  
3. Nakshatra  
4. Yoga  
5. Karana  
6. Paksha (via tithi)  
7. Navatara  
8. Chandra Bala  
9. Hora  
10. Uphora  
11. Rahu Kaal  
12. Tatva  
13. Guna + Purushartha  
14. Vimshottari + Amrit/Sarvartha golden lock  

The families that most often turn a personal or professional search from “average day” into a **recommended window** are, in order:

1. **Navatara** — same Pushya is Sampat for one chart and Vipat for another.  
2. **Vishti and Rahu Kaal** — they kill otherwise pretty hours.  
3. **Amrit Siddhi, then Sarvartha Siddhi** — the professional “any serious start” lock.  
4. **Karaka hora in its mukhya half** — the hour inside the good day.  
5. **Chandra Bala** — blocks 4th/8th/12th Moon even on a shubh tithi.  
6. **Mahadasha karaka** — matters most on major intents (joining, launch, vivah, election).  

Panchanga alone is the universal almanac. Tara + Chandra + Dasha are what make the answer exclusive to the birth chart.

### Amrit Siddhi (weekday → one star)

| Vara | Nakshatra |
| --- | --- |
| Sunday | Hasta |
| Monday | Mrigashira |
| Tuesday | Ashwini |
| Wednesday | Anuradha |
| Thursday | Pushya |
| Friday | Revati |
| Saturday | Rohini |

### Sarvartha Siddhi (weekday → star set)

| Vara | Nakshatras |
| --- | --- |
| Sunday | Ashwini, Pushya, Hasta, Uttara Ashadha, Uttara Bhadrapada, Revati |
| Monday | Rohini, Mrigashira, Pushya, Anuradha, Shravana |
| Tuesday | Ashwini, Krittika, Ashlesha, Uttara Bhadrapada |
| Wednesday | Krittika, Rohini, Mrigashira, Hasta, Anuradha |
| Thursday | Ashwini, Punarvasu, Pushya, Anuradha, Revati |
| Friday | Ashwini, Anuradha, Revati, Hasta |
| Saturday | Rohini, Swati, Shravana, Shatabhisha |

### Navatara

```
count = ((todayStar − janmaStar + 27) % 27) + 1
tara  = count % 9     (0 becomes 9)
```

Shubh tara numbers: 2 Sampat, 4 Kshema, 6 Sadhana, 8 Mitra, 9 Parama Mitra.

### Chandra Bala

```
distance = ((todayRashi − janmaRashi + 12) % 12) + 1
dusthana = 4, 8, 12
```

### Vimshottari

120-year order from the **janma nakshatra lord**, balance = unfinished fraction of that star × the lord’s years:

Ketu 7, Venus 20, Sun 6, Moon 10, Mars 7, Rahu 18, Jupiter 16, Saturn 19, Mercury 17.

Antardasha splits the mahadasha in the same order, each piece `mahaYears × antarYears / 120`. The first mahadasha is already partly elapsed at birth.

### Score

Each bucket is clamped 0–100, then:

```
final = 0.38 × panchanga
      + 0.26 × personal     (50 + tara + chandra)
      + 0.14 × hora/uphora
      + 0.12 × dasha
      + 0.10 × golden
```

| Score | Quality | Line shown |
| --- | --- | --- |
| ≥ 80 | Excellent | Recommended |
| ≥ 65 | Good | Recommended |
| ≥ 50 | Average | Usable if needed |
| < 50 | Avoid | Prefer another window |

Abhijit (solar noon ± 24 min) is calculated and shown on the panchang page. It is **not** a separate score term.

## 6. Purpose grammar — why 127 intents, not one lakh rows

Every life event collapses into six fields. New questions are new rows, not new astronomy.

| Field | Role |
| --- | --- |
| `category` | 17 life areas |
| `tier` | `daily` (1 nidhi) or `major` (5 nidhi). Major if listed or `minTara ≥ 6` |
| `purushartha` | dharma / artha / kama / moksha, from the category |
| `tatva` | agni / prithvi / vayu / jala, from the category |
| `guna` | sattva / rajas / tamas, from the category |
| `karaka` | grahas whose hora and dasha should match |
| `preferredVara` | weekdays that fit |
| `preferredNakshatra` | stars that fit the *jaati* of the work (fixed, swift, movable, soft, sharp) |
| `avoidTithi` | hard tithi vetoes |
| `minTara` | how strict the personal filter should be (0 daily sync … 6 capital, vivah, election) |

### Catalog in the app

**127 intents. 99 daily. 28 major. 17 categories.**

| Category | Daily | Major | Purushartha | Typical karaka |
| --- | --- | --- | --- | --- |
| Career | 11 | 2 | artha | Mercury, Sun, Jupiter |
| Business | 8 | 6 | artha | Jupiter, Mercury, Venus |
| Marketing | 6 | 0 | artha | Mercury, Venus |
| Finance | 10 | 2 | artha | Jupiter, Venus, Mercury |
| Health | 7 | 1 | dharma | Moon, Mars, Jupiter |
| Travel | 7 | 1 | kama | Moon, Mercury |
| Purchase | 8 | 0 | artha | Venus, Mercury |
| Real Estate | 3 | 3 | artha | Mars, Venus, Saturn |
| Relationship | 7 | 4 | kama | Venus, Moon, Jupiter |
| Family | 6 | 2 | dharma | Moon, Jupiter |
| Education | 6 | 0 | dharma | Mercury, Jupiter |
| Legal | 2 | 3 | dharma | Jupiter, Saturn |
| Civic | 1 | 3 | dharma | Sun, Jupiter |
| Media | 1 | 1 | kama | Venus, Mercury |
| Technology | 4 | 0 | artha | Mercury |
| Daily | 8 | 0 | artha | Mercury, Saturn, Moon |
| Spiritual | 4 | 0 | moksha | Jupiter, Moon, Ketu |

### Two purpose windows

**Daily life (1 nidhi, bar 50).** Resume, interview, client-payment call, Zoom, ticket booking, money transfer, first date, standup, email. Hora + Tara are enough. A Vishti or Rahu slot still loses.

**Big decisions (5 nidhi, bar 58).** Job joining, company incorporation, product or film launch, IPO, election nomination, minister’s office entry, oath, case filing, property, griha pravesh, engagement, vivah, surgery, birth planning. These want fixed or classical stars, shubh tara, clean karana, and a karaka dasha. Vivah and griha pravesh still need a pandit’s **lagna shuddhi**; TaraNidhi ranks the day and hour, it does not cast the ceremony lagna.

### How a purpose picks a window

| Purpose | Tatva | Star jaati | Karaka | Avoid |
| --- | --- | --- | --- | --- |
| Send, call, pitch | Vayu | swift (Ashwini, Hasta, Pushya) | Mercury | Vishti, Rahu |
| Contract, property, joining | Prithvi | fixed (Rohini, three Uttaras) | Jupiter, Venus, Mars | Rikta, Vipat tara |
| Travel, campaign | Vayu | movable (Punarvasu, Swati, Shravana) | Moon, Mercury | Amavasya start |
| Healing, family, money-in | Jala | soft (Revati, Anuradha, Rohini) | Moon, Jupiter | 8th Chandra |
| Cut, surgery, legal strike | Agni | sharp only if the work is a cut | Mars, Saturn | Fierce star for a *start* that should last |
| Release, resign, spiritual close | — | Krishna / Ekadashi energy | Saturn, Ketu | Starting a new bhoga |

## 7. What is deliberately not in the score

These were discussed and are **not** giving results today:

| Method | Status |
| --- | --- |
| Lagna of the muhurta minute, 8th-house shuddhi | Not computed |
| KP cusps and star-lords of houses | Not computed |
| Full gochar of Jupiter, Saturn, Rahu | Not computed |
| Pratyantar / sookshma dasha | Not computed |
| Yamaganda, Gulika, Durmuhurta, Panchaka | Not computed |
| Classical uphora as 2.5-ghati slices | Approximated as 30-minute hora halves |
| Janma-tithi lord as a separate bala | Not scored |
| Swiss Ephemeris | Not used |

Until lagna + pratyantar exist, TaraNidhi is a **janma-chandra muhurat engine**, not a full kundli muhurta desk.

## 8. Runtime map

```
Birth form
  → profile (local)
  → getBirthChart
       moonSid, janma nakshatra, janma rashi

Ask
  → spend nidhi
  → for each day, for each :00 and :30 from 08:00–19:30
       getPanchang(slot)
       tara, chandra, hora, uphora, golden, dasha
       scoreMuhurat
  → keep slots ≥ bar, sort golden then score, return 8

Screens
  /            personal day, dasha, golden banner, two purpose grids
  /muhurat     query box, category chips, priced ask, ranked windows
  /panchang    five limbs + tara, chandra, dasha, tatva, guna, golden
  /calendar    noon score coloured across the month
  /profile     chart, current dasha, nidhi packs and ledger
```

| File | Owns |
| --- | --- |
| `src/lib/panchang/astronomy.ts` | JD, Sun, Moon, Lahiri, sunrise |
| `src/lib/panchang/constants.ts` | 27 stars, tithi, yoga, karana, Amrit, Sarvartha, Vimshottari years |
| `src/lib/panchang/engine.ts` | panchang object, tara, chandra, birth chart |
| `src/lib/panchang/dasha.ts` | maha + antar at a clock time |
| `src/lib/panchang/activities.ts` | 127 intents and the purpose grammar |
| `src/lib/panchang/scoring.ts` | weights, search, reasons |
| `src/lib/panchang/wallet.ts` | nidhi balance and ledger |
| `src/lib/panchang/store.ts` | birth profile |

## 9. Adding one more life question

Add one object to `SEED` in `activities.ts`:

```
key, English name, Hindi name, category,
preferredVara, preferredNakshatra, avoidTithi,
minTara, karaka, one-line blurb
```

`finalize()` stamps tier, purushartha, tatva, guna, and price. No new formula is required. A capital event sets `minTara: 6` or is added to `MAJOR_KEYS`.

## 10. Honest limit

The same Tuesday is one clock for everyone and **two scores** for two birth charts. That difference is Navatara, Chandra Bala, and Vimshottari. Golden yogas (Amrit, Sarvartha) are the shared professional overlay on top. Ceremony-grade work still needs lagna. TaraNidhi will say when the personal day and hour are strong; it will not pretend to have cast the muhurta lagna.
