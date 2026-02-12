import type { MetForecastResponse } from '$lib/types/api.js';
import type { WeatherPoint } from '$lib/types/domain.js';

const BASE = import.meta.env.DEV
	? '/api/met/weatherapi/locationforecast/2.0'
	: 'https://api.met.no/weatherapi/locationforecast/2.0';

export async function fetchWeather(lat: number, lon: number): Promise<WeatherPoint[]> {
	const url = `${BASE}/compact?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error(`MET Norway API error: ${res.status} ${res.statusText}`);

	const data: MetForecastResponse = await res.json();

	return data.properties.timeseries.map((ts) => ({
		time: new Date(ts.time),
		cloudCover: ts.data.instant.details.cloud_area_fraction,
		temperature: ts.data.instant.details.air_temperature,
		windSpeed: ts.data.instant.details.wind_speed,
		symbolCode: ts.data.next_1_hours?.summary.symbol_code
	}));
}

/** Get the weather point closest to the given time */
export function weatherAt(points: WeatherPoint[], time: Date): WeatherPoint | undefined {
	if (points.length === 0) return undefined;
	let closest = points[0];
	let minDiff = Math.abs(points[0].time.getTime() - time.getTime());

	for (const p of points) {
		const diff = Math.abs(p.time.getTime() - time.getTime());
		if (diff < minDiff) {
			minDiff = diff;
			closest = p;
		}
	}
	return closest;
}
