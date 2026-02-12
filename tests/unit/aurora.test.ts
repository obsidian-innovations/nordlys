import { describe, it, expect } from 'vitest';
import { calculateAuroraScore } from '$lib/services/aurora.js';

// Use a fixed winter midnight in Tromsø (definitely dark)
const WINTER_MIDNIGHT = new Date('2025-01-15T23:00:00Z');
// Use a fixed summer noon in Tromsø (definitely bright)
const SUMMER_NOON = new Date('2025-06-21T12:00:00Z');

const TROMSO_LAT = 69.6492;
const TROMSO_LON = 18.9553;

describe('calculateAuroraScore', () => {
	it('returns 0 when sun is up (darkness gate)', () => {
		const score = calculateAuroraScore(5, 0, -10, SUMMER_NOON, TROMSO_LAT, TROMSO_LON);
		expect(score.total).toBe(0);
		expect(score.darknessGate).toBe(false);
		expect(score.verdict).toBe('none');
	});

	it('produces a high score with KP 5, clear skies, southward Bz in winter', () => {
		const score = calculateAuroraScore(5, 0, -10, WINTER_MIDNIGHT, TROMSO_LAT, TROMSO_LON);
		expect(score.darknessGate).toBe(true);
		expect(score.kpContribution).toBe(40);
		expect(score.cloudPenalty).toBe(0);
		expect(score.solarWindBonus).toBe(10);
		expect(score.total).toBe(50);
		expect(score.verdict).toBe('likely');
	});

	it('applies cloud penalty correctly', () => {
		const clear = calculateAuroraScore(5, 0, 0, WINTER_MIDNIGHT, TROMSO_LAT, TROMSO_LON);
		const cloudy = calculateAuroraScore(5, 100, 0, WINTER_MIDNIGHT, TROMSO_LAT, TROMSO_LON);
		expect(clear.total).toBeGreaterThan(cloudy.total);
		expect(cloudy.cloudPenalty).toBe(-40);
	});

	it('gives zero solar wind bonus for northward Bz', () => {
		const score = calculateAuroraScore(3, 20, 5, WINTER_MIDNIGHT, TROMSO_LAT, TROMSO_LON);
		expect(score.solarWindBonus).toBe(0);
	});

	it('clamps score to 0-100 range', () => {
		// Very low KP, heavy clouds
		const low = calculateAuroraScore(0, 100, 0, WINTER_MIDNIGHT, TROMSO_LAT, TROMSO_LON);
		expect(low.total).toBeGreaterThanOrEqual(0);

		// Max KP, clear, strong southward Bz
		const high = calculateAuroraScore(9, 0, -25, WINTER_MIDNIGHT, TROMSO_LAT, TROMSO_LON);
		expect(high.total).toBeLessThanOrEqual(100);
	});

	it('maps KP 1 to 0 contribution (below threshold)', () => {
		const score = calculateAuroraScore(1, 0, 0, WINTER_MIDNIGHT, TROMSO_LAT, TROMSO_LON);
		expect(score.kpContribution).toBe(0);
	});

	it('returns correct verdicts for score ranges', () => {
		// KP 2, clear, no Bz => kp=10, cloud=0, bz=0 => total=10 => none
		const none = calculateAuroraScore(2, 0, 0, WINTER_MIDNIGHT, TROMSO_LAT, TROMSO_LON);
		expect(none.verdict).toBe('none');

		// KP 3, clear, no Bz => kp=20, cloud=0, bz=0 => total=20 => unlikely
		const unlikely = calculateAuroraScore(3, 0, 0, WINTER_MIDNIGHT, TROMSO_LAT, TROMSO_LON);
		expect(unlikely.verdict).toBe('unlikely');

		// KP 4, some clouds, slight Bz => variable
		const possible = calculateAuroraScore(4, 20, -5, WINTER_MIDNIGHT, TROMSO_LAT, TROMSO_LON);
		expect(['possible', 'unlikely']).toContain(possible.verdict);
	});
});
