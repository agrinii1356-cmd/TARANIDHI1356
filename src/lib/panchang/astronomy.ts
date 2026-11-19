/** Meeus-style solar/lunar approximations for Vedic panchanga (sidereal, Lahiri). */

export function toJulianDay(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d =
    date.getUTCDate() +
    (date.getUTCHours() +
      (date.getUTCMinutes() + date.getUTCSeconds() / 60) / 60) /
      24;
  let Y = y;
  let M = m;
  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + d + B - 1524.5;
}

function deg2rad(d: number) {
  return (d * Math.PI) / 180;
}
function norm360(d: number) {
  const x = d % 360;
  return x < 0 ? x + 360 : x;
}

/** Tropical solar longitude (degrees). */
export function sunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const Mr = deg2rad(M);
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mr) +
    0.000289 * Math.sin(3 * Mr);
  return norm360(L0 + C);
}

function moonElements(jd: number) {
  const T = (jd - 2451545.0) / 36525;
  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
  const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T;
  const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T;
  const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T;
  const F = 93.272095 + 483202.0175233 * T - 0.0036539 * T * T;
  return { Lp, D, M, Mp, F };
}

/** Tropical lunar longitude (degrees), truncated ELP. */
export function moonLongitude(jd: number): number {
  const { Lp, D, M, Mp, F } = moonElements(jd);
  const d = deg2rad;
  const lon =
    Lp +
    6.288774 * Math.sin(d(Mp)) +
    1.274027 * Math.sin(d(2 * D - Mp)) +
    0.658314 * Math.sin(d(2 * D)) +
    0.213618 * Math.sin(d(2 * Mp)) -
    0.185116 * Math.sin(d(M)) -
    0.114332 * Math.sin(d(2 * F)) +
    0.058793 * Math.sin(d(2 * D - 2 * Mp)) +
    0.057066 * Math.sin(d(2 * D - M - Mp)) +
    0.053322 * Math.sin(d(2 * D + Mp)) +
    0.045758 * Math.sin(d(2 * D - M)) -
    0.040923 * Math.sin(d(M - Mp)) -
    0.03472 * Math.sin(d(D)) -
    0.030465 * Math.sin(d(M + Mp));
  return norm360(lon);
}

function moonLatitude(jd: number): number {
  const { D, Mp, F } = moonElements(jd);
  const r = deg2rad;
  return (
    5.128189 * Math.sin(r(F)) +
    0.280606 * Math.sin(r(Mp + F)) +
    0.277693 * Math.sin(r(Mp - F)) +
    0.173238 * Math.sin(r(2 * D - F)) +
    0.055413 * Math.sin(r(2 * D + F - Mp)) +
    0.046272 * Math.sin(r(2 * D - F - Mp)) +
    0.032573 * Math.sin(r(2 * D + F)) +
    0.017198 * Math.sin(r(2 * Mp + F))
  );
}

function moonParallax(jd: number): number {
  const { D, Mp } = moonElements(jd);
  const r = deg2rad;
  return (
    0.950724 +
    0.051818 * Math.cos(r(Mp)) +
    0.009531 * Math.cos(r(2 * D - Mp)) +
    0.007843 * Math.cos(r(2 * D)) +
    0.002824 * Math.cos(r(2 * Mp))
  );
}

function equatorial(lonDeg: number, latDeg: number, jd: number) {
  const T = (jd - 2451545.0) / 36525;
  const eps = deg2rad(23.439291 - 0.0130042 * T);
  const lon = deg2rad(lonDeg);
  const lat = deg2rad(latDeg);
  const dec = Math.asin(Math.sin(lat) * Math.cos(eps) + Math.cos(lat) * Math.sin(eps) * Math.sin(lon));
  const ra = Math.atan2(Math.sin(lon) * Math.cos(eps) - Math.tan(lat) * Math.sin(eps), Math.cos(lon));
  return { ra: ra < 0 ? ra + 2 * Math.PI : ra, dec };
}

function altitudeExcess(jd: number, lat: number, lon: number): number {
  const { ra, dec } = equatorial(moonLongitude(jd), moonLatitude(jd), jd);
  const gmst = norm360(280.46061837 + 360.98564736629 * (jd - 2451545.0));
  const H = deg2rad(norm360(gmst + lon)) - ra;
  const latR = deg2rad(lat);
  const alt = Math.asin(Math.sin(latR) * Math.sin(dec) + Math.cos(latR) * Math.cos(dec) * Math.cos(H));
  const h0 = deg2rad(0.7275 * moonParallax(jd) - 0.5667);
  return (alt - h0) * (180 / Math.PI);
}

function jdAtLocalMinutes(y: number, m: number, d: number, minutes: number, tz: number): number {
  const utcMs = Date.UTC(y, m, d, 0, 0, 0) + minutes * 60 * 1000 - tz * 3600 * 1000;
  return toJulianDay(new Date(utcMs));
}

/** Moonrise and moonset on the civil date. Either can be absent. */
export function moonRiseSet(
  dateLocal: Date,
  lat: number,
  lon: number,
  tzOffsetHours: number,
): { moonrise: Date | null; moonset: Date | null } {
  const y = dateLocal.getFullYear();
  const m = dateLocal.getMonth();
  const d = dateLocal.getDate();
  const excess = (min: number) => altitudeExcess(jdAtLocalMinutes(y, m, d, min, tzOffsetHours), lat, lon);
  const cross = (rising: boolean) => {
    const step = 10;
    for (let t = 0; t < 1440; t += step) {
      const a = excess(t);
      const b = excess(Math.min(t + step, 1439));
      const hit = rising ? a <= 0 && b > 0 : a >= 0 && b < 0;
      if (!hit) continue;
      let lo = t;
      let hi = Math.min(t + step, 1439);
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        const e = excess(mid);
        if (rising ? e <= 0 : e >= 0) lo = mid;
        else hi = mid;
      }
      const when = new Date(y, m, d, 0, 0, 0);
      when.setMinutes(hi);
      return when;
    }
    return null;
  };
  return { moonrise: cross(true), moonset: cross(false) };
}

/** Lahiri ayanamsa (degrees). */
export function lahiriAyanamsa(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return 23.852931 + 0.013956 * (T * 100);
}

export function sidereal(tropical: number, jd: number): number {
  return norm360(tropical - lahiriAyanamsa(jd));
}

/** Mean-element tropical longitude, then Lahiri. Enough for gochar house, not for a degree claim. */
const PLANET_MEAN: Record<string, [number, number, number, number]> = {
  Mercury: [252.250906, 4.09233445, 77.456119, 0.205636],
  Venus: [181.979801, 1.60213034, 131.563703, 0.006773],
  Mars: [355.433, 0.52402068, 336.04084, 0.0934],
  Jupiter: [34.351519, 0.08308529, 14.331206, 0.048498],
  Saturn: [50.077444, 0.03344414, 93.057237, 0.055546],
};

export function planetSidereal(name: string, jd: number): number {
  const row = PLANET_MEAN[name];
  if (!row) return sidereal(sunLongitude(jd), jd);
  const [L0, rate, peri, e] = row;
  const L = norm360(L0 + rate * (jd - 2451545.0));
  const M = ((L - peri) * Math.PI) / 180;
  const trop = norm360(L + ((2 * e * 180) / Math.PI) * Math.sin(M));
  return sidereal(trop, jd);
}

/** Mean lunar ascending node, tropical degrees. Meeus ch. 47. Not used for charts. */
export function meanNodeLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T3 * T;
  return norm360(125.0445479 - 1934.1362891 * T + 0.0020754 * T2 + T3 / 467441 - T4 / 60616000);
}

/**
 * True (osculating) lunar ascending node, tropical degrees.
 * Mean node plus the principal periodic terms (Meeus). TaraNidhi always uses this, never the mean node.
 * Ketu is this longitude plus 180°.
 */
export function trueNodeLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T3 * T;
  const rad = Math.PI / 180;
  const D = (297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868 - T4 / 113065000) * rad;
  const M = (357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000) * rad;
  const Mp = (134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699 - T4 / 14712000) * rad;
  const F = (93.272095 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000 + T4 / 863310000) * rad;
  const corr =
    -1.4979 * Math.sin(2 * (D - F)) -
    0.15 * Math.sin(M) -
    0.1226 * Math.sin(2 * D) +
    0.1176 * Math.sin(2 * F) -
    0.0801 * Math.sin(2 * (Mp - F)) +
    0.0943 * Math.sin(2 * (D + F)) +
    0.0582 * Math.sin(2 * D - Mp) -
    0.0539 * Math.sin(Mp - 2 * F) -
    0.0458 * Math.sin(2 * D - M) +
    0.0327 * Math.sin(2 * D + Mp) -
    0.0304 * Math.sin(Mp + 2 * F) -
    0.0173 * Math.sin(2 * (D - Mp)) -
    0.0168 * Math.sin(M + 2 * F) +
    0.0119 * Math.sin(Mp) +
    0.0107 * Math.sin(M - 2 * F) -
    0.0102 * Math.sin(2 * D + M) -
    0.0081 * Math.sin(2 * Mp);
  return norm360(meanNodeLongitude(jd) + corr);
}

export function trueNodeSidereal(jd: number): number {
  return sidereal(trueNodeLongitude(jd), jd);
}
export function sunRiseSet(
  dateLocal: Date,
  lat: number,
  lon: number,
  tzOffsetHours: number,
): { sunrise: Date; sunset: Date } {
  const utcNoonMs =
    Date.UTC(dateLocal.getFullYear(), dateLocal.getMonth(), dateLocal.getDate(), 12, 0, 0) -
    tzOffsetHours * 3600 * 1000;
  const jd = toJulianDay(new Date(utcNoonMs));
  const T = (jd - 2451545.0) / 36525;
  const lonSun = sunLongitude(jd);
  const eps = 23.439291 - 0.0130042 * T;
  const lam = deg2rad(lonSun);
  const epsR = deg2rad(eps);
  const decl = Math.asin(Math.sin(epsR) * Math.sin(lam));
  let ra = (Math.atan2(Math.cos(epsR) * Math.sin(lam), Math.cos(lam)) * 180) / Math.PI;
  if (ra < 0) ra += 360;
  const L0 = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  let eot = L0 - ra;
  if (eot > 180) eot -= 360;
  if (eot < -180) eot += 360;
  // Minutes from local midnight. Longitude is east-positive.
  const solarNoonMin = 720 + 4 * (tzOffsetHours * 15 - lon) - 4 * eot;
  const latR = deg2rad(lat);
  const cosH =
    (Math.cos(deg2rad(90.833)) - Math.sin(latR) * Math.sin(decl)) /
    (Math.cos(latR) * Math.cos(decl));
  const half = ((Math.acos(Math.min(1, Math.max(-1, cosH))) * 180) / Math.PI) * 4;
  const y = dateLocal.getFullYear();
  const m = dateLocal.getMonth();
  const d = dateLocal.getDate();
  const sunrise = new Date(y, m, d, 0, 0, 0);
  sunrise.setMinutes(Math.round(solarNoonMin - half));
  const sunset = new Date(y, m, d, 0, 0, 0);
  sunset.setMinutes(Math.round(solarNoonMin + half));
  return { sunrise, sunset };
}

export function localToUtc(local: Date, tzOffsetHours: number): Date {
  const wall = Date.UTC(
    local.getFullYear(),
    local.getMonth(),
    local.getDate(),
    local.getHours(),
    local.getMinutes(),
    local.getSeconds(),
  );
  return new Date(wall - tzOffsetHours * 3600 * 1000);
}

/** Sidereal ascendant (Lahiri). Used for muhurta lagna, not a full horoscope. */
export function ascendantSidereal(
  local: Date,
  lat: number,
  lon: number,
  tzOffsetHours: number,
): number {
  const jd = toJulianDay(localToUtc(local, tzOffsetHours));
  const T = (jd - 2451545.0) / 36525;
  let gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T;
  gmst = ((gmst % 360) + 360) % 360;
  const ramc = ((gmst + lon) % 360 + 360) % 360;
  const eps = 23.439291 - 0.0130042 * T;
  const r = deg2rad;
  const y = Math.cos(r(ramc));
  const x = -(Math.sin(r(ramc)) * Math.cos(r(eps)) + Math.tan(r(lat)) * Math.sin(r(eps)));
  let trop = (Math.atan2(y, x) * 180) / Math.PI;
  if (trop < 0) trop += 360;
  return sidereal(trop, jd);
}
