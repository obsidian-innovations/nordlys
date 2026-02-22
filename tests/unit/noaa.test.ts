import { describe, it, expect } from 'vitest';
import {
	latestKp,
	latestBz,
	latestSpeed,
	latestHemisphericPower,
	latestKp1Min
} from '$lib/services/noaa.js';
import type { KpReading, SolarWind, HemisphericPower } from '$lib/types/domain.js';

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

	it('filters out NaN KP values', () => {
		const readings: KpReading[] = [
			{ time: new Date('2025-01-01T00:00Z'), kp: 3, source: 'observed' },
			{ time: new Date('2025-01-01T03:00Z'), kp: NaN, source: 'observed' }
		];
		expect(latestKp(readings)).toBe(3);
	});

	it('returns 0 when all observed KP values are NaN', () => {
		const readings: KpReading[] = [
			{ time: new Date(), kp: NaN, source: 'observed' },
			{ time: new Date(), kp: NaN, source: 'observed' }
		];
		expect(latestKp(readings)).toBe(0);
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

	it('filters out NOAA sentinel values (-999.9)', () => {
		const readings: SolarWind[] = [
			{ time: new Date('2025-01-01T00:00Z'), bz: -5.2, bt: 8 },
			{ time: new Date('2025-01-01T01:00Z'), bz: -999.9, bt: 0 }
		];
		expect(latestBz(readings)).toBe(-5.2);
	});
});

describe('latestSpeed', () => {
	it('returns 0 for empty array', () => {
		expect(latestSpeed([])).toBe(0);
	});

	it('returns 0 when no speed values exist', () => {
		const readings: SolarWind[] = [
			{ time: new Date(), bz: -3, bt: 5 },
			{ time: new Date(), bz: -1, bt: 4 }
		];
		expect(latestSpeed(readings)).toBe(0);
	});

	it('returns the last valid speed value', () => {
		const readings: SolarWind[] = [
			{ time: new Date('2025-01-01T00:00Z'), bz: 0, bt: 0, speed: 400 },
			{ time: new Date('2025-01-01T01:00Z'), bz: 0, bt: 0, speed: 550 },
			{ time: new Date('2025-01-01T02:00Z'), bz: 0, bt: 0, speed: 620 }
		];
		expect(latestSpeed(readings)).toBe(620);
	});

	it('filters out NaN speed entries', () => {
		const readings: SolarWind[] = [
			{ time: new Date('2025-01-01T00:00Z'), bz: 0, bt: 0, speed: 500 },
			{ time: new Date('2025-01-01T01:00Z'), bz: 0, bt: 0, speed: NaN },
			{ time: new Date('2025-01-01T02:00Z'), bz: 0, bt: 0, speed: 650 },
			{ time: new Date('2025-01-01T03:00Z'), bz: 0, bt: 0, speed: NaN }
		];
		expect(latestSpeed(readings)).toBe(650);
	});

	it('filters out NOAA sentinel speed values (-999.9)', () => {
		const readings: SolarWind[] = [
			{ time: new Date('2025-01-01T00:00Z'), bz: 0, bt: 0, speed: 520 },
			{ time: new Date('2025-01-01T01:00Z'), bz: 0, bt: 0, speed: -999.9 }
		];
		expect(latestSpeed(readings)).toBe(520);
	});
});

describe('latestHemisphericPower', () => {
	it('returns 0 for empty array', () => {
		expect(latestHemisphericPower([])).toBe(0);
	});

	it('returns 0 when no North hemisphere entries exist', () => {
		const readings: HemisphericPower[] = [
			{ time: new Date(), power: 50, hemisphere: 'South' },
			{ time: new Date(), power: 60, hemisphere: 'South' }
		];
		expect(latestHemisphericPower(readings)).toBe(0);
	});

	it('returns the last North hemisphere power value', () => {
		const readings: HemisphericPower[] = [
			{ time: new Date('2025-01-01T00:00Z'), power: 30, hemisphere: 'North' },
			{ time: new Date('2025-01-01T01:00Z'), power: 45, hemisphere: 'South' },
			{ time: new Date('2025-01-01T02:00Z'), power: 55, hemisphere: 'North' },
			{ time: new Date('2025-01-01T03:00Z'), power: 70, hemisphere: 'South' }
		];
		expect(latestHemisphericPower(readings)).toBe(55);
	});

	it('filters out NaN power values', () => {
		const readings: HemisphericPower[] = [
			{ time: new Date('2025-01-01T00:00Z'), power: 40, hemisphere: 'North' },
			{ time: new Date('2025-01-01T01:00Z'), power: NaN, hemisphere: 'North' }
		];
		expect(latestHemisphericPower(readings)).toBe(40);
	});
});

describe('latestKp1Min', () => {
	it('returns 0 for empty array', () => {
		expect(latestKp1Min([])).toBe(0);
	});

	it('returns the last valid Kp value', () => {
		const readings: KpReading[] = [
			{ time: new Date('2025-01-01T00:00Z'), kp: 2.3, source: 'estimated' },
			{ time: new Date('2025-01-01T00:01Z'), kp: 3.1, source: 'estimated' },
			{ time: new Date('2025-01-01T00:02Z'), kp: 4.7, source: 'estimated' }
		];
		expect(latestKp1Min(readings)).toBe(4.7);
	});

	it('returns last entry even if mixed sources', () => {
		const readings: KpReading[] = [
			{ time: new Date('2025-01-01T00:00Z'), kp: 5, source: 'observed' },
			{ time: new Date('2025-01-01T00:01Z'), kp: 6.2, source: 'estimated' }
		];
		expect(latestKp1Min(readings)).toBe(6.2);
	});

	it('filters out NaN Kp values', () => {
		const readings: KpReading[] = [
			{ time: new Date('2025-01-01T00:00Z'), kp: 3.5, source: 'estimated' },
			{ time: new Date('2025-01-01T00:01Z'), kp: NaN, source: 'estimated' }
		];
		expect(latestKp1Min(readings)).toBe(3.5);
	});

	it('returns 0 when all values are NaN', () => {
		const readings: KpReading[] = [
			{ time: new Date(), kp: NaN, source: 'estimated' },
			{ time: new Date(), kp: NaN, source: 'estimated' }
		];
		expect(latestKp1Min(readings)).toBe(0);
	});
});
