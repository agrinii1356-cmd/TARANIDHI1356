# TaraNidhi — Weakness Register and Implementation Architecture

Date: 2026-11-13
Compared against: asksoma.ai (AI Vedic chat + full kundli platform)
Position: TaraNidhi is a birth-based muhurat timing engine, not a chat astrologer.

---

## 1. Weakness register

### A. Astronomy and chart accuracy (highest risk)

| ID | Weakness | Impact | AskSoma reference |
|----|----------|--------|-------------------|
| A1 | Custom astronomy, not Swiss Ephemeris | Lagna and graha longitudes can drift vs Drik / Lahiri standard | Swiss Ephemeris, audited |
| A2 | Ayanamsa not named or switchable | User cannot match family pandit (Lahiri vs KP vs Raman) | Lahiri default, KP/Raman optional |
| A3 | No historical timezone for birth city | Pre-1955 / DST births get wrong lagna | IANA + historical local mean time |
| A4 | No true-node vs mean-node choice | Rahu/Ketu differ from standard software | True node |
| A5 | No Shadbala, Ashtakavarga | Strength of dasha lord is only house + digbal | Full shadbala suite |
| A6 | Vargas stop at D1 | Marriage (D9) and career (D10) windows are incomplete | D1–D60, 16 vargas |
| A7 | Dasha only maha + antar | Pratyantar ignored; timing is coarse | Vimshottari + 5 sub levels |
| A8 | No birth-time rectification | Unknown or approximate time still produces a lagna | Rectification flow, honest warning |

### B. Muhurat engine (our core, still incomplete)

| ID | Weakness | Impact |
|----|----------|--------|
| B1 | Shunya lists are approximate Amanta maps | Month-empty tithi/nakshatra/rashi can be wrong |
| B2 | Bhadra mukha/puccha uses tithi elapsed %, not karana span | Head/tail of Vishti is approximate |
| B3 | No activity-specific nakshatra fruit table | Same preferred stars for many modern activities |
| B4 | KP/Nadi houses only check dasha lord house | Sub-lord of muhurta lagna and Moon not scored |
| B5 | No D9/D10 gate for marriage and career | Major events lack varga confirmation |
| B6 | Panch pakshi and gochar weights are fixed | No user override or confidence flag |
| B7 | No “why this window lost” audit log | User sees Avoid list but not the rejected slots |
| B8 | Golden yogas (Amrit, Sarvartha) are binary | No graded yoga strength |

### C. Product surface

| ID | Weakness | Impact |
|----|----------|--------|
| C1 | No AI “why” layer | User cannot ask a follow-up in plain language |
| C2 | No free city panchang / Rahu Kaal tool | No SEO entry, AskSoma owns this traffic |
| C3 | No kundli matching (Ashtakoot + Mangal) | Missing a high-intent marriage flow |
| C4 | No PDF muhurat report | Cannot share a window with family or client |
| C5 | No prediction journal | Cannot prove accuracy over time |
| C6 | No methodology page | Trust gap vs AskSoma’s public calc page |
| C7 | Languages are hi/en only | AskSoma claims 21+ |
| C8 | No native iOS/Android | Web only |
| C9 | Wallet is app-internal, not Razorpay-complete | Real payment and receipts missing |
| C10 | No social proof wall | 4.8/569 style trust is absent |

### D. Code and operations

| ID | Weakness | Impact |
|----|----------|--------|
| D1 | Scoring weights are hardcoded in scoreMuhurat | Cannot A/B or version a formula |
| D2 | Activity taxonomy lives in one seed array | Adding 1000 activities is manual |
| D3 | No unit tests on sutra gates or scoring | Regressions silent |
| D4 | Profile charts stored client-side only | Lost on device change |
| D5 | No structured event log of searches | Cannot improve ranking from real use |
| D6 | OG/x-banner exist; methodology and tool pages do not | Share card has nothing deep to land on |

---

## 2. Target architecture

Keep the current stack: TanStack Start + Vite, Zustand profile, existing panchang lib.
Add layers; do not rewrite the muhurat search.

```
src/
  lib/panchang/
    ephemeris/          # NEW — Swiss or equivalent adapter
    chart/              # NEW — D1, vargas, strength
    timing/             # NEW — dasha tree, gochar, pakshi
    sutra/              # SPLIT from sutra.ts — one file per family
    scoring/            # SPLIT — weights, gates, reasons
    activities/         # taxonomy + KP house map
    engine.ts           # panchang limbs (keep)
    astronomy.ts        # thin wrapper over ephemeris
  routes/
    index.tsx
    muhurat.tsx
    panchang.tsx
    methodology.tsx     # NEW
    tools/              # NEW free city tools
    match.tsx           # NEW
    journal.tsx         # NEW
    chat.tsx            # NEW thin explain layer
```

### Layer 1 — Ephemeris

- Input: UTC instant, lat, lon.
- Output: sidereal longitudes (Lahiri default), lagna, Moon, nodes.
- Contract: `getPositions(utc, lat, lon, ayanamsa) -> Graha[]`.
- Timezone: birth city IANA zone, not browser zone.
- Flag: `precision: "swiss" | "approx"` on every chart so the UI can warn.

### Layer 2 — Chart

- D1 always.
- D9 for relationship/marriage keys.
- D10 for career/business keys.
- Optional later: D7, D4, D12.
- Strength v1: digbal + house + exaltation/debilitation.
- Strength v2: simplified shadbala (sthana + kala only).

### Layer 3 — Timing

- Dasha tree: maha, antar, pratyantar.
- Gochar from natal Moon (already present; keep).
- Pakshi from janma nakshatra (already present; keep).
- Muhurta lagna at the candidate instant (already in sutra; expose house from birth lagna and Moon).

### Layer 4 — Sutra families (gates)

Each family returns `{ blocks, cautions, supports }`.

1. Panchang limbs — tithi, vara, nakshatra, yoga, karana.
2. Tyajya — Rahu, Yamaganda, Mandi, Varjya, Gandanta, Vishti mukha/puccha.
3. Tithi-vara — Dagdha, Visha, Mrityu, Nandaadi by paksha.
4. Shunya — tithi, nakshatra, rashi by lunar month (replace approximate map with a reviewed table).
5. Lagna shuddhi — 8th from lagna/Moon, gandanta lagna.
6. Navtara — janma star; malefic stars are alerts.
7. Chandra bala — 6/8/12 from natal Moon.
8. Hora / Uphora / KP sub.
9. Dasha signification — KP/Nadi good/bad houses (already started).
10. Varga confirm — D9 for marriage, D10 for career (new).

Hard rule: any `block` closes the window for major tier. Daily tier shows caution and still opens.

### Layer 5 — Score

Keep the published weights until a versioned change:

- Panchang 26%
- Navtara 14%
- Chandra 8%
- Hora 12%
- Pakshi 12%
- Gochar 12%
- Dasha (includes KP/Nadi houses) 10%
- Golden yoga 6%

Add `formulaVersion: "2026.11"` on every result so old journals stay comparable.

### Layer 6 — Reasons and explain

Every result already has reasons. Add:

- `rejected[]` for the search: top 3 closed slots and why.
- `basis` line (already on the card).
- Optional chat: a server function that only restates these reasons in Hindi/English. No free-form prediction.

### Layer 7 — Product surfaces

1. Methodology page — ayanamsa, house system, weight table, gate list.
2. Free city panchang — tithi, nakshatra, Rahu Kaal, choghadiya, hora. No login.
3. Match — Ashtakoot + Mangal, then offer a marriage muhurat search.
4. Journal — user marks a used window as hit / miss.
5. PDF — one window, score, gates, birth basis. For sharing.
6. Payment — Razorpay month / year / per-query, mapped to existing wallet.

---

## 3. Implementation phases

### Phase 0 — Trust (1 sprint)

- Methodology route with the real formula and gate list.
- `precision` flag on charts.
- Unit tests for every current gate in `sutra.ts`.
- Persist profile chart server-side.

### Phase 1 — Accuracy (1–2 sprints)

- Ephemeris adapter (Swiss or equivalent) behind `getPositions`.
- Lahiri default; store ayanamsa on the profile.
- Birth timezone from city, not browser.
- Dasha pratyantar.
- Replace shunya month map with a reviewed table.

### Phase 2 — Muhurat depth (1–2 sprints)

- D9 gate on relationship/marriage keys.
- D10 gate on career/business keys.
- Activity nakshatra fruit table (one row per category, not per 1000 keys).
- Rejected-slot audit on the result card.
- Formula version on every score.

### Phase 3 — Acquisition (1 sprint)

- Public city panchang and Rahu Kaal pages.
- Kundli match (Ashtakoot + Mangal).
- Landing copy that states the USP in one line: birth-scored muhurat for a named activity.

### Phase 4 — Conversation and proof (1 sprint)

- Explain chat that only quotes the score reasons.
- Journal of used windows.
- PDF export of one window.

### Phase 5 — Platform

- Razorpay.
- PWA install.
- Capacitor only after the web score is stable.

---

## 4. What we will not copy

- Generic sun-sign daily horoscope as the home promise.
- Open-ended medical, legal, or stock answers.
- 26 personas. One voice: the muhurat engine.
- Replacing a family pandit for the wedding ceremony. The app scores the window; the ritual stays human.

---

## 5. Success checks

- Same birth + city + activity returns the same top window after an ephemeris swap, or the diff is explained.
- Every major-tier block is named on the card.
- A public panchang page loads without login.
- A journal entry can be marked hit/miss.
- Methodology page lists the eight weights and the ten gate families.
