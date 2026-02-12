import { describe, it, expect } from 'vitest';
import { getSolarElevation, isDarkEnough } from '$lib/utils/sun.js';

const TROMSO_LAT = 69.6492;
const TROMSO_LON = 18.9553;

describe('getSolarElevation', () => {
	it('returns negative elevation for winter midnight in Tromsø', () => {
		const midnight = new Date('2025-01-15T23:00:00Z');
		const elev = getSolarElevation(midnight, TROMSO_LAT, TROMSO_LON);
		expect(elev).toBeLessThan(-6);
	});

	it('returns positive elevation for summer noon in Tromsø', () => {
		const noon = new Date('2025-06-21T12:00:00Z');
		const elev = getSolarElevation(noon, TROMSO_LAT, TROMSO_LON);
		expect(elev).toBeGreaterThan(0);
	});

	it('returns deeply negative for polar night (December noon)', () => {
		const polarNight = new Date('2025-12-21T12:00:00Z');
		const elev = getSolarElevation(polarNight, TROMSO_LAT, TROMSO_LON);
		expect(elev).toBeLessThan(0);
	});
});

describe('isDarkEnough', () => {
	it('returns true for winter night in Tromsø', () => {
		const midnight = new Date('2025-01-15T23:00:00Z');
		expect(isDarkEnough(midnight, TROMSO_LAT, TROMSO_LON)).toBe(true);
	});

	it('returns false for summer day in Tromsø (midnight sun)', () => {
		const midday = new Date('2025-06-21T12:00:00Z');
		expect(isDarkEnough(midday, TROMSO_LAT, TROMSO_LON)).toBe(false);
	});
});
