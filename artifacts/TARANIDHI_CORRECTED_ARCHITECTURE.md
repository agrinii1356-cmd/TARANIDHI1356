# TaraNidhi — Corrected Muhurta Architecture

Date: 2026-11-13
Status: audit of the OCCULTVIISION blueprint against the live engine and classical practice.
Verdict: adopt the gates and category vectors. Reject the 168-uphora naming and the 30/25/20/15/10 formula as written.

This document is the implementation contract. Code follows this, not the earlier blueprint.

---

## 0. What the app already does

Live code: `src/lib/panchang/`.

Already in the score (formula 2026.11):
- Panchang 26%, Navtara 14%, Chandra 8%, Hora 12%, Pakshi 12%, Gochar 12%, Dasha 10%, Golden 6%.

Already as hard blocks in `sutra.ts`:
- Rahu Kaal, Yamaganda, Mandi/Gulika
- Bhadra mukha/puccha (Vishti)
- Ashubh yogas (Vyatipata, Vaidhriti class)
- Dagdha, Visha, Mrityu tithi-vara
- Varjyam, Gandanta Moon, Gandanta lagna
- Lagna in the 8th from birth lagna or Moon

Already as cautions:
- Bad choghadiya, Nandaadi weak in paksha, Shunya tithi/nakshatra/rashi, Panchak

Already as supports:
- Abhijit, shubh tithi/yoga/karana, Amrit Siddhi, Sarvartha Siddhi, lagna from birth

Already in scoring reasons:
- Hora lord, mukhya vs uphora, KP sub 1–7
- Dasha lord house vs KP/Nadi good/bad houses
- Gochar from natal Moon, pakshi state

Hora model in code (keep):
- 24 horas from sunrise (12 day + 12 night).
- Each hora = 60 minutes.
- Mukhya = first 30 min. Uphora = second 30 min. Same planet, weaker.
- KP sub = 7 parts of ~8.57 min inside the same hora. Separate layer.

Activities: 129 keys across Career, Business, Marketing, Finance, Health, Travel, Purchase, Real Estate, Relationship, Family, Education, Legal, Civic, Media, Technology, Daily, Spiritual.

---

## 1. Audit of the shared blueprint

| Topic in the blueprint | Verdict | Action |
|------------------------|---------|--------|
| 5 universal gates first | Correct | Keep as the search order |
| Rikta 4/9/14 and Amavasya penalty | Correct | Already partial; make major-tier a block |
| Vishti full bar, heavier when Bhadra on earth | Correct intent | Keep mukha/puccha; add Bhumi-loka note when karana span is known |
| Vyatipata, Vaidhriti, Parigh first half, Ganda/Atiganda | Correct | Already ashubh yoga block; add Parigh first-half if not covered |
| Avritti-aware tarabala (shloka 13) | Correct and missing | Add. This is the main tarabala upgrade |
| Chandra 6/8/12 = zero | Correct | Already scored; promote to hard cap |
| SAV ≥ 28 on muhurta lagna and transit Moon | Known rule, not built | Phase 2. Do not hard-veto until SAV exists |
| 24 hora | Correct | Already |
| 168 uphora = 7 parts | Wrong name | Do not call KP subs uphora. 2 uphora + 7 KP subs |
| Pakshi 5 states 100/85/70/25/0 | Correct product rule | Map Die to veto, Sleep to heavy penalty |
| Disha Shool | Missing, classical | Add for travel and meeting |
| Category house vectors | Correct KP/Nadi style | Add as a table, not a rewrite of 129 keys |
| D10 for company launch | Correct | Phase 2, career/business major only |
| Sankhya / Chaldean in the main score | Not a muhurta limb | Optional bonus only, max ±4 |
| MECA multi-director AND gate | Valid later | Phase 4. Needs multiple saved charts |
| 10 vivah doshas | Correct for marriage | Phase 2, marriage keys only |
| Rahu mukha for bhoomi pujan | Classical for that rite | Phase 2, griha/bhoomi keys only |
| Yogini vas for travel | Classical | Phase 2, travel keys |
| Intraday options as a category | Do not ship as a trading signal | Rename to capital timing, with a hard disclaimer |
| Surgery timing | Sensitive | Keep as wellness window, medical disclaimer |
| Final formula 30/25/20/15/10 | Reject as written | See section 4 |
| `js/ephemeris.js` | Wrong stack | `src/lib/panchang/ephemeris/` |

---

## 2. Missing sutras to add

Grouped by when they enter the engine.

### Phase 1 — gates we can add on the current engine

1. Avritti tarabala
   - Count from janma nakshatra, 1–27.
   - Tara = ((count - 1) % 9) + 1.
   - Avritti = 1 if count 1–9, 2 if 10–18, 3 if 19–27.
   - Vipat (3), Pratyari (5), Vadha (7):
     - Avritti 1: hard cap 55, major tier closed.
     - Avritti 2: block only the first pada (first quarter of that nakshatra). Rest is a caution.
     - Avritti 3: caution only, except marriage and surgery keys.
2. Chandra hard cap
   - Transit Moon in 6, 8, or 12 from natal Moon: score capped at 55.
3. Rikta and Amavasya
   - Major tier: block. Daily tier: penalty.
4. Parigh first half
   - If yoga is Parigh and elapsed < 50%: block. Second half: caution.
5. Disha Shool by weekday
   - Sunday east, Monday west? Standard: Sun west, Mon east, Tue north, Wed north, Thu south, Fri west, Sat east.
   - Travel and in-person meeting: if the stated direction matches, caution (not a full day block).
6. Pakshi Die = veto. Sleep = −20 on the pakshi component.
7. Formula version string on every result: `2026.11` until the v2 weights ship.

### Phase 2 — needs chart depth

8. Swiss-grade ephemeris adapter. Lahiri default. Birth city timezone, not browser zone.
9. Dasha pratyantar.
10. D9 gate for relationship and marriage keys.
11. D10 gate for career, business, launch keys.
12. D4 gate for property and griha pravesh.
13. Ten vivah doshas as a marriage checklist: Lata, Pata, Yuti, Vedha, Jamitra, Bana, Ekargala, Upagraha, Kranti-samya, Dagdha. Any one = major block for the ceremony key.
14. Yogini vas for travel. Facing yogini = caution.
15. Rahu mukha direction for bhoomi pujan and griha pravesh.
16. Ashtakavarga SAV. Gate only after it is computed: lagna rashi and Moon rashi SAV ≥ 28, else caution, not a silent veto on day one.
17. Reviewed shunya table by lunar month. Replace the approximate Amanta map.
18. Exact Bhadra span from karana start/end, not tithi elapsed %.

### Phase 3 — product surfaces learned from competition

19. Public methodology page: ayanamsa, house system, weights, gate list.
20. Free city panchang: tithi, nakshatra, Rahu Kaal, choghadiya, hora. No login.
21. Ashtakoot + Mangal match, then a marriage muhurat search.
22. Journal: user marks a used window hit or miss.
23. PDF of one window.
24. Explain layer: restates the score reasons in Hindi or English. No free prediction.

### Explicitly not in the core score

- Chaldean numerology of a company name. Optional ±4 after the muhurta score.
- Jaimini chara dasha. Out of scope until Parashari tree is complete.
- Open medical, legal, or market advice. The app returns a window, not a verdict.

---

## 3. Category map

Do not delete the 129 keys. Hang them under 16 families. Each family has a house vector and a karaka set. The scorer reads the family, not a new activity list.

| Family | Existing category keys feed it | Good houses | Karakas | Extra gate |
|--------|--------------------------------|-------------|---------|------------|
| Capital timing | Finance | 2, 5, 11 | Mercury, Jupiter | No options language |
| Long wealth | Finance, Purchase | 2, 4, 11 | Jupiter, Venus | Fixed stars preferred |
| Venture launch | Business, Technology | 1, 10, 11 | Sun, Mercury, Jupiter | D10 on major |
| Contracts | Business, Legal | 7, 3, 11 | Mercury, Venus | — |
| Commercial property | Real Estate | 4, 10, 11 | Mars, Saturn, Venus | Rahu mukha on pujan |
| Legal and bids | Legal, Civic | 6, 10, 11 | Sun, Mars | — |
| Hiring | Career | 1, 6, 10 | Jupiter, Mercury | — |
| Launch and PR | Marketing, Media | 1, 3, 10 | Venus, Mercury | Movable stars |
| Loans | Finance | 2, 11 in; 6, 12 out | Jupiter, Saturn | Avoid Tuesday to take a loan |
| Vehicle | Purchase | 4 | Venus, Mars | Avoid Sat/Tue as penalty |
| Home and griha | Real Estate | 4 | Venus, Jupiter, Moon | D4, fixed stars |
| Travel | Travel | 3, 9, 12 | Moon, Mercury | Disha Shool, Yogini |
| Marriage | Relationship | 7 | Venus, Jupiter | D9, ten doshas, match |
| Wellness | Health | 1, 6 | Mars, Moon | Chandra 6/8/12 hard; disclaimer |
| Education | Education | 4, 5, 9 | Mercury, Jupiter | — |
| Ritual | Spiritual | 1, 5, 9 | Jupiter | Amrit / Ravi-Pushya support |

Sub-categories in the blueprint become tags on existing keys, not new engines.

---

## 4. Score formula

### Keep running: v2026.11

```
panchang 0.26 + navtara 0.14 + chandra 0.08 + hora 0.12
+ pakshi 0.12 + gochar 0.12 + dasha 0.10 + golden 0.06
```

### Next: v2026.12 (ship only after Phase 1 tests)

```
panchang 0.20
+ tarabala 0.14      # avritti-aware, replaces flat navtara
+ chandra 0.08
+ hora 0.10          # mukhya / uphora / KP sub inside this
+ pakshi 0.12
+ gochar 0.10
+ dashaKp 0.12       # dasha lord house + category vector
+ lagnaShuddhi 0.08
+ golden 0.06
```

Caps and penalties, applied after the weighted sum:
- Vipat/Pratyari/Vadha in avritti 1, or Chandra 6/8/12: cap 55.
- Pakshi Die: cap 40.
- Rahu, Yamaganda, Mandi, Bhadra, 8th lagna, Gandanta: block. Score may still be shown, quality = Avoid.
- Sankhya and SAV: not in the weights. Sankhya ±4 optional. SAV caution until trusted.

Every `ScoreResult` carries `formulaVersion`.

Tiers:
- 80–100 Excellent
- 65–79 Good
- 55–64 Average
- below 55 or any block: Avoid

---

## 5. Code layout

```
src/lib/panchang/
  ephemeris/index.ts       # getPositions(utc, lat, lon, ayanamsa)
  chart/varga.ts           # D1, D9, D10, D4
  chart/strength.ts        # digbal, exaltation; SAV later
  timing/dashaTree.ts      # maha, antar, pratyantar
  sutra/
    tyajya.ts              # rahu, yama, gulika, varjya, gandanta, bhadra
    panchangGates.ts       # rikta, dagdha, visha, mrityu, nandaadi, shunya, yoga
    tarabala.ts            # avritti
    chandra.ts
    disha.ts
    vivahDosha.ts
    index.ts               # readSutras aggregates
  scoring/
    weights.ts             # versioned
    vectors.ts             # family house vectors
    score.ts
  activities.ts            # add family + tags, do not delete keys
  engine.ts                # limbs, 24 hora, mukhya/uphora, kp sub
```

No `js/ephemeris.js`. No second hora model.

Search loop stays in `searchMuhurats`. It asks each family for gates, then scores. Major tier promotes cautions to blocks, as it does today.

---

## 6. What we take from AskSoma, and what we do not

Take:
- Named ayanamsa and a public methodology page.
- Birth timezone from the city.
- Dasha deeper than maha/antar.
- Free city panchang as an entry page.
- Honest limit when birth time is unknown.

Do not take:
- Chat as the product. Explain layer only.
- Sun-sign daily horoscope as the home promise.
- 26 personas.
- Replacing a pandit for the wedding rite.

USP line, unchanged:
Birth-scored muhurat for a named activity. Universal panchang is the free door. The score is the product.

---

## 7. Build order

1. Phase 1 in the current engine: avritti tarabala, chandra cap, rikta/amavasya, Parigh half, Disha Shool, pakshi Die veto, formulaVersion.
2. Ephemeris adapter + birth timezone + pratyantar.
3. Family vectors on the 129 keys. No new activity explosion.
4. D9 / D10 / D4 and the ten vivah doshas.
5. Methodology page and free city panchang.
6. Match, journal, PDF, explain layer.
7. Razorpay, then PWA. Native last.

---

## 8. Acceptance

A window is shippable only if the card can show:
- formula version
- which gates fired (block or caution)
- hora, mukhya/uphora, and KP sub as three separate lines
- tarabala with avritti
- chandra from natal Moon
- the family vector that was used

If any of those is missing, the formula is not v2026.12 yet.
