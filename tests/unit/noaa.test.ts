import { describe, it, expect } from 'vitest';
import { latestKp, latestBz } from '$lib/services/noaa.js';
import type { KpReading, SolarWind } from '$lib/types/domain.js';

describe('latestKp', () => {
	it('returns 0 for empty array', () => {
		expect(latestKp([])).toBe(0);
	});

	it('returns 0 when no observed readings', () => {
		const readings: KpReading[] = [
			{ time: new Date(), kp: 5, source: 'predicted' },
			{ time: new Date(), kp: 3, source: 'estimated' }
		];
		expect(latestKp(readings)).toBe(0);
	});

	it('returns the last observed KP value', () => {
		const readings: KpReading[] = [
			{ time: new Date('2025-01-01T00:00Z'), kp: 2, source: 'observed' },
			{ time: new Date('2025-01-01T03:00Z'), kp: 4, source: 'observed' },
			{ time: new Date('2025-01-01T06:00Z'), kp: 7, source: 'observed' }
		];
		expect(latestKp(readings)).toBe(7);
	});

	it('ignores predicted/estimated readings mixed in', () => {
		const readings: KpReading[] = [
			{ time: new Date('2025-01-01T00:00Z'), kp: 2, source: 'observed' },
			{ time: new Date('2025-01-01T03:00Z'), kp: 8, source: 'predicted' },
			{ time: new Date('2025-01-01T06:00Z'), kp: 5, source: 'observed' },
			{ time: new Date('2025-01-01T09:00Z'), kp: 9, source: 'estimated' }
		];
		expect(latestKp(readings)).toBe(5);
	});
});

describe('latestBz', () => {
	it('returns 0 for empty array', () => {
		expect(latestBz([])).toBe(0);
	});

	it('returns 0 when all Bz values are NaN', () => {
		const readings: SolarWind[] = [
			{ time: new Date(), bz: NaN, bt: 5 },
			{ time: new Date(), bz: NaN, bt: 3 }
		];
		expect(latestBz(readings)).toBe(0);
	});

	it('returns the last valid Bz value', () => {
		const readings: SolarWind[] = [
			{ time: new Date('2025-01-01T00:00Z'), bz: -3.5, bt: 5 },
			{ time: new Date('2025-01-01T01:00Z'), bz: -1.2, bt: 4 },
			{ time: new Date('2025-01-01T02:00Z'), bz: 2.8, bt: 6 }
		];
		expect(latestBz(readings)).toBe(2.8);
	});

	it('filters out NaN entries and returns last non-NaN', () => {
		const readings: SolarWind[] = [
			{ time: new Date('2025-01-01T00:00Z'), bz: -3.5, bt: 5 },
			{ time: new Date('2025-01-01T01:00Z'), bz: NaN, bt: 4 },
			{ time: new Date('2025-01-01T02:00Z'), bz: -7.1, bt: 6 },
			{ time: new Date('2025-01-01T03:00Z'), bz: NaN, bt: 3 }
		];
		expect(latestBz(readings)).toBe(-7.1);
	});
});
