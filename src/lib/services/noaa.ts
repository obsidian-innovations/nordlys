import type {
	NoaaKpRow,
	NoaaKpForecastRow,
	NoaaSolarWindRow,
	NoaaOvationResponse
} from '$lib/types/api.js';
import type { KpReading, SolarWind } from '$lib/types/domain.js';

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
