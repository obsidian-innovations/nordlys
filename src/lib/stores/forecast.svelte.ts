import {
	fetchKpIndex,
	fetchKpForecast,
	fetchSolarWind,
	fetchSolarWindPlasma,
	fetchHemisphericPower,
	fetchOvation,
	latestKp,
	latestBz,
	latestSpeed,
	latestHemisphericPower
} from '$lib/services/noaa.js';
import { fetchWeather, weatherAt } from '$lib/services/met-norway.js';
import { calculateAuroraScore } from '$lib/services/aurora.js';
import type {
	KpReading,
	SolarWind,
	WeatherPoint,
	AuroraScore,
	HemisphericPower
} from '$lib/types/domain.js';
import type { NoaaOvationResponse } from '$lib/types/api.js';

const TROMSO_LAT = 69.6492;
const TROMSO_LON = 18.9553;

let kpReadings = $state<KpReading[]>([]);
let kpForecast = $state<KpReading[]>([]);
let solarWind = $state<SolarWind[]>([]);
let solarWindPlasma = $state<SolarWind[]>([]);
let hemisphericPower = $state<HemisphericPower[]>([]);
let weather = $state<WeatherPoint[]>([]);
let score = $state<AuroraScore | null>(null);
let ovation = $state<NoaaOvationResponse | null>(null);
let loading = $state(false);
let lastUpdated = $state<Date | null>(null);
let error = $state<string | null>(null);

function recalculateScore() {
	const kp = latestKp(kpReadings);
	const bz = latestBz(solarWind);
	const speed = latestSpeed(solarWindPlasma);
	const hp = latestHemisphericPower(hemisphericPower);
	const now = new Date();
	const wx = weatherAt(weather, now);
	const cloudCover = wx?.cloudCover ?? 50;

	score = calculateAuroraScore(kp, cloudCover, bz, now, TROMSO_LAT, TROMSO_LON, speed, hp);
}

async function refresh() {
	loading = true;
	error = null;

	try {
		const results = await Promise.allSettled([
			fetchKpIndex(),
			fetchKpForecast(),
			fetchSolarWind(),
			fetchWeather(TROMSO_LAT, TROMSO_LON),
			fetchOvation(),
			fetchSolarWindPlasma(),
			fetchHemisphericPower()
		]);

		if (results[0].status === 'fulfilled') kpReadings = results[0].value;
		if (results[1].status === 'fulfilled') kpForecast = results[1].value;
		if (results[2].status === 'fulfilled') solarWind = results[2].value;
		if (results[3].status === 'fulfilled') weather = results[3].value;
		if (results[4].status === 'fulfilled') ovation = results[4].value;
		if (results[5].status === 'fulfilled') solarWindPlasma = results[5].value;
		if (results[6].status === 'fulfilled') hemisphericPower = results[6].value;

		const sourceNames = [
			'Kp index',
			'Kp forecast',
			'solar wind',
			'weather',
			'ovation',
			'solar wind plasma',
			'hemispheric power'
		];
		const failedNames = results
			.map((r, i) => (r.status === 'rejected' ? sourceNames[i] : null))
			.filter(Boolean);
		if (failedNames.length === results.length) {
			error = 'All data sources unavailable. Check your connection.';
		} else if (failedNames.length > 0) {
			error = `Could not fetch ${failedNames.join(', ')}. Showing cached data.`;
		}

		recalculateScore();
		lastUpdated = new Date();
	} catch (e) {
		error = e instanceof Error ? e.message : 'Unknown error';
	} finally {
		loading = false;
	}
}

export function getForecastStore() {
	return {
		get kpReadings() {
			return kpReadings;
		},
		get kpForecast() {
			return kpForecast;
		},
		get solarWind() {
			return solarWind;
		},
		get solarWindPlasma() {
			return solarWindPlasma;
		},
		get hemisphericPower() {
			return hemisphericPower;
		},
		get weather() {
			return weather;
		},
		get score() {
			return score;
		},
		get loading() {
			return loading;
		},
		get lastUpdated() {
			return lastUpdated;
		},
		get error() {
			return error;
		},
		get ovation() {
			return ovation;
		},
		refresh
	};
}
