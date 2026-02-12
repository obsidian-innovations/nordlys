import { describe, it, expect } from 'vitest';
import { weatherAt } from '$lib/services/met-norway.js';
import type { WeatherPoint } from '$lib/types/domain.js';

function point(time: string, cloudCover = 50): WeatherPoint {
	return { time: new Date(time), cloudCover, temperature: -5, windSpeed: 3 };
}

describe('weatherAt', () => {
	it('returns undefined for empty array', () => {
		expect(weatherAt([], new Date())).toBeUndefined();
	});

	it('returns the single point when array has one element', () => {
		const p = point('2025-01-15T12:00Z');
		expect(weatherAt([p], new Date('2025-01-15T18:00Z'))).toBe(p);
	});

	it('returns the closest point by timestamp', () => {
		const points = [
			point('2025-01-15T06:00Z'),
			point('2025-01-15T12:00Z'),
			point('2025-01-15T18:00Z')
		];
		const target = new Date('2025-01-15T13:00Z');
		expect(weatherAt(points, target)).toBe(points[1]);
	});

	it('returns the first match when two points are equidistant', () => {
		const points = [point('2025-01-15T10:00Z'), point('2025-01-15T14:00Z')];
		const target = new Date('2025-01-15T12:00Z');
		expect(weatherAt(points, target)).toBe(points[0]);
	});
});
