// Live feeds from Open-Meteo. No sign-up or key needed.
//
// Each function fetches on the server, and Next.js keeps the result for
// `revalidate` seconds. The first visitor after that window triggers a
// fresh pull; everyone else gets the saved copy.
//
// Every function returns null on failure, so one dead feed never breaks
// the page. The panel shows "unavailable" instead.

import type { City } from "./types";

const HOUR = 3600;

export interface WeatherReading {
  temperature: number; // °C
  feelsLike: number; // °C
  feelsLikeMaxToday: number; // °C
  rainTodayMm: number; // forecast total for today
  rainChanceMax: number | null; // % chance, highest over today
  time: string; // ISO, local to the city
}

export interface AirReading {
  europeanAqi: number;
  pm25: number; // µg/m³
  time: string; // ISO, local to the city
}

export interface FloodReading {
  discharge: number; // m³/s, today
  dischargeMean: number; // long-term mean for this day of year
  date: string; // YYYY-MM-DD
  label: string; // where the river was read
}

export async function fetchWeather(city: City): Promise<WeatherReading | null> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${city.latitude}&longitude=${city.longitude}` +
    `&current=temperature_2m,apparent_temperature` +
    `&daily=apparent_temperature_max,precipitation_sum,precipitation_probability_max&forecast_days=1` +
    `&timezone=${encodeURIComponent(city.timezone)}`;
  try {
    const res = await fetch(url, { next: { revalidate: HOUR } });
    if (!res.ok) return null;
    const json = await res.json();
    return {
      temperature: json.current.temperature_2m,
      feelsLike: json.current.apparent_temperature,
      feelsLikeMaxToday: json.daily.apparent_temperature_max[0],
      rainTodayMm: json.daily.precipitation_sum?.[0] ?? 0,
      rainChanceMax: json.daily.precipitation_probability_max?.[0] ?? null,
      time: json.current.time,
    };
  } catch {
    return null;
  }
}

/** European Air Quality Index from Open-Meteo's air quality model (CAMS). */
export async function fetchAir(city: City): Promise<AirReading | null> {
  const url =
    `https://air-quality-api.open-meteo.com/v1/air-quality` +
    `?latitude=${city.latitude}&longitude=${city.longitude}` +
    `&current=european_aqi,pm2_5&timezone=${encodeURIComponent(city.timezone)}`;
  try {
    const res = await fetch(url, { next: { revalidate: HOUR } });
    if (!res.ok) return null;
    const json = await res.json();
    if (typeof json.current?.european_aqi !== "number") return null;
    return {
      europeanAqi: Math.round(json.current.european_aqi),
      pm25: json.current.pm2_5,
      time: json.current.time,
    };
  } catch {
    return null;
  }
}

/**
 * River signal from Open-Meteo's flood API (GloFAS model). Compares
 * today's modelled river flow with the long-term mean for this day of
 * year. Uses the city's river point if it has one, else the city itself.
 */
export async function fetchFlood(city: City): Promise<FloodReading | null> {
  const point = city.river ?? { label: city.name, latitude: city.latitude, longitude: city.longitude };
  const url =
    `https://flood-api.open-meteo.com/v1/flood` +
    `?latitude=${point.latitude}&longitude=${point.longitude}` +
    `&daily=river_discharge,river_discharge_mean&forecast_days=1` +
    `&timezone=${encodeURIComponent(city.timezone)}`;
  try {
    const res = await fetch(url, { next: { revalidate: 6 * HOUR } });
    if (!res.ok) return null;
    const json = await res.json();
    const d = json.daily?.river_discharge?.[0];
    const m = json.daily?.river_discharge_mean?.[0];
    if (typeof d !== "number" || typeof m !== "number") return null;
    return { discharge: d, dischargeMean: m, date: json.daily.time[0], label: point.label };
  } catch {
    return null;
  }
}
