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
		expect(score.kpContribution).toBe(30); // (5-1)*7.5 = 30, capped at 30
		expect(score.cloudPenalty).toBe(0);
		expect(score.solarWindBonus).toBe(10); // |Bz| = 10, capped at 15
		expect(score.speedBonus).toBe(0); // no speed data provided
		expect(score.hemisphericPowerBonus).toBe(0); // no HP data provided
		expect(score.total).toBe(40);
		expect(score.verdict).toBe('possible');
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

		// Max KP, clear, strong southward Bz, fast wind, high HP
		const high = calculateAuroraScore(9, 0, -25, WINTER_MIDNIGHT, TROMSO_LAT, TROMSO_LON, 800, 150);
		expect(high.total).toBeLessThanOrEqual(100);
	});

	it('maps KP 1 to 0 contribution (below threshold)', () => {
		const score = calculateAuroraScore(1, 0, 0, WINTER_MIDNIGHT, TROMSO_LAT, TROMSO_LON);
		expect(score.kpContribution).toBe(0);
	});

	it('returns correct verdicts for score ranges', () => {
		// KP 2, clear, no Bz => kp=7.5, cloud=0, bz=0 => total=8 => none
		const none = calculateAuroraScore(2, 0, 0, WINTER_MIDNIGHT, TROMSO_LAT, TROMSO_LON);
		expect(none.verdict).toBe('none');

		// KP 4, clear, no Bz => kp=22.5, cloud=0 => total=23 => unlikely
		const unlikely = calculateAuroraScore(4, 0, 0, WINTER_MIDNIGHT, TROMSO_LAT, TROMSO_LON);
		expect(unlikely.verdict).toBe('unlikely');

		// KP 4, some clouds, slight Bz => variable
		const possible = calculateAuroraScore(4, 20, -5, WINTER_MIDNIGHT, TROMSO_LAT, TROMSO_LON);
		expect(['possible', 'unlikely']).toContain(possible.verdict);
	});

	it('applies solar wind speed bonus correctly', () => {
		// No bonus below 400 km/s
		const slow = calculateAuroraScore(3, 0, 0, WINTER_MIDNIGHT, TROMSO_LAT, TROMSO_LON, 350);
		expect(slow.speedBonus).toBe(0);

		// Partial bonus at 550 km/s: (550-400)/300*10 = 5
		const medium = calculateAuroraScore(3, 0, 0, WINTER_MIDNIGHT, TROMSO_LAT, TROMSO_LON, 550);
		expect(medium.speedBonus).toBe(5);

		// Max bonus at 700+ km/s
		const fast = calculateAuroraScore(3, 0, 0, WINTER_MIDNIGHT, TROMSO_LAT, TROMSO_LON, 800);
		expect(fast.speedBonus).toBe(10);
	});

	it('applies hemispheric power bonus correctly', () => {
		// No bonus below 20 GW
		const low = calculateAuroraScore(3, 0, 0, WINTER_MIDNIGHT, TROMSO_LAT, TROMSO_LON, 0, 15);
		expect(low.hemisphericPowerBonus).toBe(0);

		// Partial bonus at 60 GW: (60-20)/80*15 = 7.5 → 8
		const medium = calculateAuroraScore(3, 0, 0, WINTER_MIDNIGHT, TROMSO_LAT, TROMSO_LON, 0, 60);
		expect(medium.hemisphericPowerBonus).toBe(8);

		// Max bonus at 100+ GW
		const high = calculateAuroraScore(3, 0, 0, WINTER_MIDNIGHT, TROMSO_LAT, TROMSO_LON, 0, 120);
		expect(high.hemisphericPowerBonus).toBe(15);
	});

	it('combines all new factors for maximum score', () => {
		// KP 9, clear, strong Bz -20, speed 800, HP 150
		const score = calculateAuroraScore(
			9,
			0,
			-20,
			WINTER_MIDNIGHT,
			TROMSO_LAT,
			TROMSO_LON,
			800,
			150
		);
		expect(score.kpContribution).toBe(30); // capped
		expect(score.solarWindBonus).toBe(15); // capped
		expect(score.speedBonus).toBe(10); // capped
		expect(score.hemisphericPowerBonus).toBe(15); // capped
		expect(score.cloudPenalty).toBe(0);
		expect(score.total).toBe(70);
		expect(score.verdict).toBe('high');
	});

	it('defaults speed and hemispheric power to 0 when not provided', () => {
		const score = calculateAuroraScore(3, 20, -5, WINTER_MIDNIGHT, TROMSO_LAT, TROMSO_LON);
		expect(score.speedBonus).toBe(0);
		expect(score.hemisphericPowerBonus).toBe(0);
	});
});
