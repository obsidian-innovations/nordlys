import type {
	NoaaHemisphericPowerEntry,
	NoaaOvationResponse,
	NoaaKp1MinEntry,
	NoaaScalesResponse
} from '$lib/types/api.js';
import type {
	KpReading,
	SolarWind,
	HemisphericPower,
	GeomagneticStormLevel
} from '$lib/types/domain.js';

const BASE = 'https://services.swpc.noaa.gov';

/** NOAA uses -999.9 (and similar) as sentinel for missing data */
function isSentinel(v: number): boolean {
	return v <= -999;
}

/** Parse a float, returning NaN for sentinel values */
function parseVal(s: string): number {
	const v = parseFloat(s);
	if (isNaN(v) || isSentinel(v)) return NaN;
	return v;
}

/**
 * Build a column-index lookup from the header row of an array-of-arrays NOAA response.
 * Returns a function that retrieves a column value by name.
 */
function columnLookup(header: string[]): (row: string[], name: string) => string {
	const idx = new Map<string, number>();
	for (let i = 0; i < header.length; i++) {
		idx.set(header[i].toLowerCase().trim(), i);
	}
	return (row, name) => {
		const i = idx.get(name.toLowerCase());
		return i != null && i < row.length ? row[i] : '';
	};
}

async function fetchJson<T>(path: string): Promise<T> {
	const res = await fetch(`${BASE}${path}`);
	if (!res.ok) throw new Error(`NOAA API error: ${res.status} ${res.statusText}`);
	return res.json();
}

export async function fetchKpIndex(): Promise<KpReading[]> {
	const rows = await fetchJson<string[][]>('/products/noaa-planetary-k-index.json');
	if (rows.length < 2) return [];
	const col = columnLookup(rows[0]);
	return rows.slice(1).map((row) => ({
		time: new Date(col(row, 'time_tag')),
		kp: parseVal(col(row, 'kp')),
		source: 'observed' as const
	}));
}

export async function fetchKpForecast(): Promise<KpReading[]> {
	const rows = await fetchJson<string[][]>('/products/noaa-planetary-k-index-forecast.json');
	if (rows.length < 2) return [];
	const col = columnLookup(rows[0]);
	return rows.slice(1).map((row) => ({
		time: new Date(col(row, 'time_tag')),
		kp: parseVal(col(row, 'kp')),
		source: col(row, 'observed') as KpReading['source']
	}));
}

export async function fetchSolarWind(): Promise<SolarWind[]> {
	const rows = await fetchJson<string[][]>('/products/solar-wind/mag-1-day.json');
	if (rows.length < 2) return [];
	const col = columnLookup(rows[0]);
	return rows.slice(1).map((row) => ({
		time: new Date(col(row, 'time_tag')),
		bz: parseVal(col(row, 'bz_gsm')),
		bt: parseVal(col(row, 'bt'))
	}));
}

export async function fetchOvation(): Promise<NoaaOvationResponse> {
	return fetchJson<NoaaOvationResponse>('/json/ovation_aurora_latest.json');
}

export async function fetchSolarWindPlasma(): Promise<SolarWind[]> {
	const rows = await fetchJson<string[][]>('/products/solar-wind/plasma-1-day.json');
	if (rows.length < 2) return [];
	const col = columnLookup(rows[0]);
	return rows.slice(1).map((row) => ({
		time: new Date(col(row, 'time_tag')),
		bz: 0,
		bt: 0,
		speed: parseVal(col(row, 'speed')),
		density: parseVal(col(row, 'density'))
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

export async function fetchKp1Minute(): Promise<KpReading[]> {
	const entries = await fetchJson<NoaaKp1MinEntry[]>('/json/planetary_k_index_1m.json');
	return entries.map((entry) => ({
		time: new Date(entry.time_tag),
		kp: entry.estimated_kp,
		source: 'estimated' as const
	}));
}

export async function fetchPropagatedSolarWind(): Promise<SolarWind[]> {
	const rows = await fetchJson<string[][]>('/products/geospace/propagated-solar-wind-1-hour.json');
	if (rows.length < 2) return [];
	const col = columnLookup(rows[0]);
	return rows.slice(1).map((row) => ({
		time: new Date(col(row, 'time_tag')),
		bz: parseVal(col(row, 'bz')),
		bt: parseVal(col(row, 'bt')),
		speed: parseVal(col(row, 'speed')),
		density: parseVal(col(row, 'density'))
	}));
}

export async function fetchNoaaScales(): Promise<GeomagneticStormLevel> {
	const data = await fetchJson<NoaaScalesResponse>('/products/noaa-scales.json');
	// Entry "0" is the most recent
	const latest = data['0'];
	const scale = parseInt(latest.G.Scale, 10) || 0;
	return {
		scale,
		text: latest.G.Text,
		timestamp: new Date(`${latest.DateStamp} ${latest.TimeStamp}`)
	};
}

/** Get the most recent observed KP value, filtering NaN */
export function latestKp(readings: KpReading[]): number {
	const observed = readings.filter((r) => r.source === 'observed' && !isNaN(r.kp));
	return observed.length > 0 ? observed[observed.length - 1].kp : 0;
}

/** Get the most recent solar wind Bz value, filtering NaN and sentinel */
export function latestBz(readings: SolarWind[]): number {
	const valid = readings.filter((r) => !isNaN(r.bz) && !isSentinel(r.bz));
	return valid.length > 0 ? valid[valid.length - 1].bz : 0;
}

/** Get the most recent solar wind speed (km/s), filtering NaN and sentinel */
export function latestSpeed(readings: SolarWind[]): number {
	const valid = readings.filter((r) => r.speed != null && !isNaN(r.speed) && !isSentinel(r.speed));
	return valid.length > 0 ? valid[valid.length - 1].speed! : 0;
}

/** Get the most recent northern hemisphere power (GW) */
export function latestHemisphericPower(readings: HemisphericPower[]): number {
	const north = readings.filter(
		(r) => r.hemisphere === 'North' && !isNaN(r.power) && !isSentinel(r.power)
	);
	return north.length > 0 ? north[north.length - 1].power : 0;
}

/** Get the most recent 1-minute estimated Kp, filtering NaN */
export function latestKp1Min(readings: KpReading[]): number {
	const valid = readings.filter((r) => !isNaN(r.kp));
	return valid.length > 0 ? valid[valid.length - 1].kp : 0;
}
