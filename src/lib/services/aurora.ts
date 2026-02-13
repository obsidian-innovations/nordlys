import type { AuroraScore, AuroraVerdict } from '$lib/types/domain.js';
import { getSolarElevation } from '$lib/utils/sun.js';

/** Tromsø latitude — KP ≥ 2 starts to matter at 69.6°N */
const TROMSO_LAT = 69.6492;
const TROMSO_LON = 18.9553;

/**
 * Calculate aurora visibility score (0-100).
 *
 * Components:
 * 1. KP contribution (0-30 pts): KP mapped to score at Tromsø latitude
 * 2. Cloud cover penalty (0 to -40 pts): heavy clouds = no visibility
 * 3. Darkness gate (binary): sun must be below -6° elevation
 * 4. Solar wind Bz bonus (0-15 pts): southward IMF is favorable
 * 5. Solar wind speed bonus (0-10 pts): fast wind enhances aurora
 * 6. Hemispheric power bonus (0-15 pts): direct energy input measurement
 */
export function calculateAuroraScore(
	kp: number,
	cloudCover: number,
	bz: number,
	time: Date = new Date(),
	lat: number = TROMSO_LAT,
	lon: number = TROMSO_LON,
	windSpeed: number = 0,
	hemisphericPower: number = 0
): AuroraScore {
	// 1. KP contribution (0-30)
	// At 69.6°N, KP 2 is the threshold, KP 5+ is excellent
	const kpContribution = Math.min(30, Math.max(0, (kp - 1) * 7.5));

	// 2. Cloud cover penalty (0 to -40)
	// Linear penalty: 0% cloud = 0 penalty, 100% cloud = -40
	const cloudPenalty = -(cloudCover / 100) * 40;

	// 3. Darkness gate — sun must be below -6° (civil twilight)
	const solarElev = getSolarElevation(time, lat, lon);
	const darknessGate = solarElev < -6;

	// 4. Solar wind Bz bonus (0-15)
	// Southward Bz (negative) is favorable; scale from -1 to -15 nT
	const solarWindBonus = bz < 0 ? Math.min(15, Math.abs(bz)) : 0;

	// 5. Solar wind speed bonus (0-10)
	// Speed above 400 km/s starts contributing, 700+ km/s is maximum
	const speedBonus = windSpeed > 400 ? Math.min(10, ((windSpeed - 400) / 300) * 10) : 0;

	// 6. Hemispheric power bonus (0-15)
	// Power above 20 GW starts contributing, 100+ GW is maximum
	const hemisphericPowerBonus =
		hemisphericPower > 20 ? Math.min(15, ((hemisphericPower - 20) / 80) * 15) : 0;

	// Total
	let total = darknessGate
		? kpContribution + cloudPenalty + solarWindBonus + speedBonus + hemisphericPowerBonus
		: 0;
	total = Math.round(Math.min(100, Math.max(0, total)));

	return {
		total,
		verdict: scoreToVerdict(total),
		kpContribution: Math.round(kpContribution) || 0,
		cloudPenalty: Math.round(cloudPenalty) || 0,
		darknessGate,
		solarWindBonus: Math.round(solarWindBonus),
		speedBonus: Math.round(speedBonus),
		hemisphericPowerBonus: Math.round(hemisphericPowerBonus),
		kp,
		cloudCover,
		timestamp: time
	};
}

function scoreToVerdict(score: number): AuroraVerdict {
	if (score <= 10) return 'none';
	if (score <= 25) return 'unlikely';
	if (score <= 45) return 'possible';
	if (score <= 65) return 'likely';
	if (score <= 85) return 'high';
	return 'storm';
}

export const VERDICT_LABELS: Record<AuroraVerdict, string> = {
	none: 'No Aurora',
	unlikely: 'Unlikely',
	possible: 'Possible',
	likely: 'Likely',
	high: 'High Chance',
	storm: 'Geomagnetic Storm'
};

export const VERDICT_COLORS: Record<AuroraVerdict, string> = {
	none: 'text-score-none',
	unlikely: 'text-score-unlikely',
	possible: 'text-score-possible',
	likely: 'text-score-likely',
	high: 'text-score-high',
	storm: 'text-score-storm'
};
