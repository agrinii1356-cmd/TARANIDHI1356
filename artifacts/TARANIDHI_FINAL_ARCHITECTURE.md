# TaraNidhi — Final Production Architecture

Date: 2026-11-13
Supersedes: OCCULTVIISION blueprint v1.0 and the earlier corrected draft.
Rule: this file is the contract. Where the blueprint disagrees, this file wins.

---

## 1. Audit of the v1.0 blueprint

### Accept

- Birth-scored muhurat for a named activity is the product. Universal panchang is the door.
- Gates run before the score.
- 16 families as a map over the existing 129 keys, not a second activity list.
- Avritti-aware tarabala.
- Disha Shool, Rahu / Yamaganda / Gulika, Bhadra.
- D1, D9, D10, and later D4. Gochar from natal Moon.
- Dasha tree to pratyantar.
- Pakshi five states, with Die as a veto.
- SEBI / medical disclaimer on finance and wellness.
- Hindi and English. PWA later.
- PDF and a share card.
- Methodology page so the method is named.

### Reject or correct

| Blueprint claim | Correction |
|-----------------|------------|
| 168 uphora = 7 parts of each hora | Wrong. Hora = 60 min. Mukhya = first 30. Uphora = second 30. KP sub = 7 parts of ~8.57 min. Three layers, two names. |
| Chandrabala bad houses 2, 4, 5, 8, 9, 12 | Wrong. 2, 5, 9 are generally good. Bad for muhurta: 6, 8, 12 from natal Moon. 4 is weak, not a hard twin of 8. |
| D9 = floor(deg / (30/9)) mod 12 | Incomplete. Classical navamsa: odd signs count forward from the sign, even signs from the 9th. |
| D10 = floor(deg / 3) | Incomplete. Dashamsha also follows odd/even start rules. |
| Swiss Ephemeris free use forces AGPL open-sourcing | Overstated. Free Swiss Ephemeris is GPL-style for the library; Astrodienst sells a professional license. AGPL is not the accurate label. |
| Zero open-source, yet astronomy-engine | astronomy-engine is MIT (cosinekitty). MIT is fine for a closed app. It is not Swiss Ephemeris. State the precision honestly. |
| `js/ephemeris.js` + `index.html` rewrite | Wrong stack. Live app is TypeScript under `src/lib/panchang/`, TanStack routes. Extend it. |
| Obfuscated client formulas as IP protection | Weak. Secrets on the client can be read. Real shield is server-side scoring for paid tiers. |
| Hide every house number | Optional executive mode only. A methodology view must still name the method. Trust needs one honest page. |
| Sankhya as Layer 7 of the muhurta score | Optional ±4. Not a limb of panchang. |
| Intraday derivatives as a category | Do not ship as a trading signal. Call it capital timing. Disclaimer on every finance card. |
| Surgery as a timed medical act | Wellness window only. Not a clinical recommendation. |
| Start at `js/ephemeris.js` | No. Start inside the current engine. |

---

## 2. Locked technical base

Stack, unchanged:
- TanStack Start + Vite, TypeScript.
- Existing routes: home, panchang, muhurat, profile, calendar.
- State: Zustand profile. Persist chart server-side in Phase 1.

Ephemeris:
- Adapter interface `getPositions(utc, lat, lon, ayanamsa)`.
- First implementation: current engine, flagged `precision: "internal"`.
- Second: `astronomy-engine` (MIT) + Lahiri, flagged `precision: "astronomy-engine"`.
- Swiss Ephemeris only if a professional license is bought. Do not ship the GPL build inside a closed app.
- Ayanamsa default: Lahiri (Chitrapaksha). Store it on the profile.
- Time: birth city IANA zone, not the browser zone.

Hora model, locked:
- 24 horas, sunrise to next sunrise. 12 day, 12 night.
- Each hora 60 minutes. Lord from the weekday Chaldean sequence.
- Mukhya: minute 0–30. Uphora: minute 30–60. Same lord, uphora weaker.
- KP sub: 7 equal parts inside the hora. Shown on its own line. Never labelled uphora.

---

## 3. Seven engines, corrected

| Layer | Module | What it actually does |
|-------|--------|------------------------|
| 1 | `ephemeris/` + `chart/varga.ts` | Sidereal longitudes, lagna, D1. D9 and D10 with odd/even rules. Gochar. |
| 2 | `chart/kp.ts`, `chart/sav.ts` | Nakshatra lord, pada, KP sub-lord of the muhurta lagna and Moon. SAV later, as a caution until trusted. |
| 3 | `engine.ts` (existing) | 24 hora, mukhya/uphora, 7 KP subs, 5-state pakshi. |
| 4 | `sutra/` | Avritti tarabala, Chandra 6/8/12, Disha Shool, Rahu, Yamaganda, Gulika, Bhadra, Varjya, Gandanta, rikta, dagdha, visha, mrityu. |
| 5 | `scoring/vectors.ts` | Family house vector + lagna from birth. Priority toggle adjusts weights, it does not replace gates. |
| 6 | `meca.ts` | Later. N charts. One failed tarabala or chandra cap rejects the shared window. |
| 7 | `sankhya.ts` | Optional. Not in the muhurta weights. |

---

## 4. Gates, in order

A slot is scored only after these.

1. Tyajya: Rahu Kaal, Yamaganda, Gulika, Varjyam, Gandanta Moon or lagna, Bhadra (mukha heavier).
2. Panchang: rikta 4/9/14 and Amavasya on major tier. Ashubh yoga. Dagdha, Visha, Mrityu. Parigh first half.
3. Tarabala, avritti-aware.
   - Count 1–27 from janma nakshatra. Tara = ((count−1) % 9)+1. Avritti = 1, 2, or 3.
   - Vipat 3, Pratyari 5, Vadha 7:
     - Avritti 1: cap 55, major tier closed.
     - Avritti 2: first pada only closed. Rest caution.
     - Avritti 3: caution, except marriage and wellness keys.
4. Chandrabala: transit Moon in 6, 8, or 12 from natal Moon → cap 55. House 4 → caution, not a cap.
5. Pakshi Die → cap 40. Sleep → −20 on the pakshi part.
6. Family vector and dasha-lord house.
7. Major only: D9 for marriage, D10 for career and launch, D4 for home. Ten vivah doshas for the ceremony key.

Daily tier shows cautions and can still open. Major tier promotes cautions to blocks.

---

## 5. Score

Running now, keep until tests pass: `2026.11`

```
panchang 0.26 + navtara 0.14 + chandra 0.08 + hora 0.12
+ pakshi 0.12 + gochar 0.12 + dasha 0.10 + golden 0.06
```

Next, `2026.12`:

```
panchang 0.20 + tarabala 0.14 + chandra 0.08 + hora 0.10
+ pakshi 0.12 + gochar 0.10 + dashaKp 0.12 + lagna 0.08 + golden 0.06
```

After the sum:
- Tarabala avritti-1 malefic, or Chandra 6/8/12: cap 55.
- Pakshi Die: cap 40.
- Any tyajya block: quality Avoid, even if the number is higher.
- Sankhya: optional ±4, off by default.

Tiers:
- 90–100 Apex
- 80–89 Diamond
- 72–79 Gold
- 55–71 Average
- below 55 or any block: Avoid

Every result stores `formulaVersion`.

---

## 6. Sixteen families over the current keys

Do not delete `activities.ts`. Add `family` and `tags`.

| Family | Good houses | Karaka | Extra |
|--------|-------------|--------|-------|
| Capital timing | 2, 5, 11 | Mercury, Jupiter | Disclaimer. No options language. |
| Long wealth | 2, 4, 11 | Jupiter, Venus | Fixed stars |
| Venture launch | 1, 10, 11 | Sun, Mercury, Jupiter | D10 on major |
| Contracts | 7, 3, 11 | Mercury, Venus | — |
| Commercial property | 4, 10, 11 | Mars, Saturn, Venus | Rahu mukha on pujan |
| Legal and bids | 6, 10, 11 | Sun, Mars | — |
| Hiring | 1, 6, 10 | Jupiter, Mercury | — |
| Launch and PR | 1, 3, 10 | Venus, Mercury | Movable stars |
| Loans | 2, 11 in; 6, 12 to close | Jupiter, Saturn | Avoid Tuesday to borrow |
| Vehicle | 4 | Venus | Sat/Tue penalty |
| Home and griha | 4 | Venus, Jupiter, Moon | D4, fixed stars |
| Travel | 3, 9, 12 | Moon, Mercury | Disha Shool, Yogini |
| Marriage | 7 | Venus, Jupiter | D9, ten doshas, match |
| Wellness | 1, 6 | Moon | Chandra hard cap. Disclaimer. |
| Education | 4, 5, 9 | Mercury, Jupiter | — |
| Ritual | 1, 5, 9 | Jupiter | Amrit, Ravi-Pushya |

UI shows the family name and the tier. A “method” toggle may show houses. Default can stay executive.

---

## 7. App surfaces

Keep current routes. Add, do not replace.

1. Decision hub — query, 16 families, today’s top windows. Already close to `/muhurat`.
2. Scanner — 30-day top windows. Extend `searchMuhurats`.
3. Hora matrix — 24 hora, each with mukhya/uphora and 7 KP subs, plus pakshi. Fix the label.
4. Panchang pro — limbs with start and end, tarabala, chandra. Mostly on `/panchang`.
5. Charts and CRM — D1, D9, D10, dasha tree. Server-saved profiles.
6. Sankhya — separate tab. Never required for a muhurat.

Also:
- `/methodology` with ayanamsa, weights, gate list.
- Free city panchang, no login.
- PDF of one window.
- Footer disclaimer on finance and wellness.

Priority toggle (wealth / stability / speed) changes weights inside the family vector. It does not turn off a gate.

MECA waits until two charts can be saved.

---

## 8. File layout

```
src/lib/panchang/
  ephemeris/index.ts
  chart/varga.ts
  chart/kp.ts
  chart/sav.ts          # later
  timing/dashaTree.ts
  sutra/tyajya.ts
  sutra/panchangGates.ts
  sutra/tarabala.ts
  sutra/chandra.ts
  sutra/disha.ts
  sutra/vivahDosha.ts
  sutra/index.ts
  scoring/weights.ts
  scoring/vectors.ts
  scoring/score.ts
  activities.ts         # add family
  engine.ts             # keep hora model
```

No `OCCULTVIISION-PRO/js/`. No second app.

---

## 9. Build order

Step 1 — inside the current engine, not a new JS file:
- `sutra/tarabala.ts` with avritti.
- Chandra cap at 6/8/12.
- `formulaVersion` on the result.
- Hora matrix labels: mukhya, uphora, KP sub.

Step 2 — ephemeris adapter + Lahiri + birth timezone. D9/D10 with odd/even rules.

Step 3 — family field on activities. Vector scoring. Priority toggle.

Step 4 — pratyantar, D4, ten vivah doshas, Disha Shool, Yogini, Rahu mukha.

Step 5 — methodology page, free city panchang, PDF, disclaimer.

Step 6 — CRM, MECA, Sankhya tab, PWA.

---

## 10. Acceptance

A window card must be able to show:
- formula version
- gates that fired
- hora, mukhya/uphora, and KP sub on three lines
- tarabala with avritti
- chandra house from natal Moon
- family name

If the card still says “168 uphora”, the build is wrong.
