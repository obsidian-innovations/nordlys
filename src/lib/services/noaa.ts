import type {
	NoaaKpRow,
	NoaaKpForecastRow,
	NoaaSolarWindRow,
	NoaaSolarWindPlasmaRow,
	NoaaHemisphericPowerEntry,
	NoaaOvationResponse
} from '$lib/types/api.js';
import type { KpReading, SolarWind, HemisphericPower } from '$lib/types/domain.js';

const BASE = 'https://services.swpc.noaa.gov';

async function fetchJson<T>(path: string): Promise<T> {
	const res = await fetch(`${BASE}${path}`);
	if (!res.ok) throw new Error(`NOAA API error: ${res.status} ${res.statusText}`);
	return res.json();
}

export async function fetchKpIndex(): Promise<KpReading[]> {
	const rows = await fetchJson<NoaaKpRow[]>('/products/noaa-planetary-k-index.json');
	// First row is header
	return rows.slice(1).map((row) => ({
		time: new Date(row[0]),
		kp: parseFloat(row[1]),
		source: 'observed' as const
	}));
}

export async function fetchKpForecast(): Promise<KpReading[]> {
	const rows = await fetchJson<NoaaKpForecastRow[]>(
		'/products/noaa-planetary-k-index-forecast.json'
	);
	return rows.slice(1).map((row) => ({
		time: new Date(row[0]),
		kp: parseFloat(row[1]),
		source: row[2] as KpReading['source']
	}));
}

export async function fetchSolarWind(): Promise<SolarWind[]> {
	const rows = await fetchJson<NoaaSolarWindRow[]>('/products/solar-wind/mag-1-day.json');
	return rows.slice(1).map((row) => ({
		time: new Date(row[0]),
		bz: parseFloat(row[3]),
		bt: parseFloat(row[6])
	}));
}

export async function fetchOvation(): Promise<NoaaOvationResponse> {
	return fetchJson<NoaaOvationResponse>('/json/ovation_aurora_latest.json');
}

export async function fetchSolarWindPlasma(): Promise<SolarWind[]> {
	const rows = await fetchJson<NoaaSolarWindPlasmaRow[]>('/products/solar-wind/plasma-1-day.json');
	return rows.slice(1).map((row) => ({
		time: new Date(row[0]),
		bz: 0,
		bt: 0,
		speed: parseFloat(row[2]),
		density: parseFloat(row[1])
	}));
}

export async function fetchHemisphericPower(): Promise<HemisphericPower[]> {
	const entries = await fetchJson<NoaaHemisphericPowerEntry[]>('/json/hemispheric_power.json');
	return entries.map((entry) => ({
		time: new Date(entry['Observation Time']),
		power: entry['Estimated Power'],
		hemisphere: entry.Hemisphere
	}));
}

/** Get the most recent observed KP value */
export function latestKp(readings: KpReading[]): number {
	const observed = readings.filter((r) => r.source === 'observed');
	return observed.length > 0 ? observed[observed.length - 1].kp : 0;
}

/** Get the most recent solar wind Bz value */
export function latestBz(readings: SolarWind[]): number {
	const valid = readings.filter((r) => !isNaN(r.bz));
	return valid.length > 0 ? valid[valid.length - 1].bz : 0;
}

/** Get the most recent solar wind speed (km/s) */
export function latestSpeed(readings: SolarWind[]): number {
	const valid = readings.filter((r) => r.speed != null && !isNaN(r.speed));
	return valid.length > 0 ? valid[valid.length - 1].speed! : 0;
}

/** Get the most recent northern hemisphere power (GW) */
export function latestHemisphericPower(readings: HemisphericPower[]): number {
	const north = readings.filter((r) => r.hemisphere === 'North');
	return north.length > 0 ? north[north.length - 1].power : 0;
}
