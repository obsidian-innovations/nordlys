import type { AuroraScore, AuroraVerdict } from '$lib/types/domain.js';
import { getSolarElevation } from '$lib/utils/sun.js';

/** Tromsø latitude — KP ≥ 2 starts to matter at 69.6°N */
const TROMSO_LAT = 69.6492;
const TROMSO_LON = 18.9553;

/**
 * Calculate aurora visibility score (0-100).
 *
 * Components:
 * 1. KP contribution (0-40 pts): KP mapped to score at Tromsø latitude
 * 2. Cloud cover penalty (0 to -40 pts): heavy clouds = no visibility
 * 3. Darkness gate (binary): sun must be below -6° elevation
 * 4. Solar wind bonus (0-20 pts): southward Bz + high speed
 */
export function calculateAuroraScore(
	kp: number,
	cloudCover: number,
	bz: number,
	time: Date = new Date(),
	lat: number = TROMSO_LAT,
	lon: number = TROMSO_LON
): AuroraScore {
	// 1. KP contribution (0-40)
	// At 69.6°N, KP 2 is the threshold, KP 5+ is excellent
	const kpContribution = Math.min(40, Math.max(0, (kp - 1) * 10));

	// 2. Cloud cover penalty (0 to -40)
	// Linear penalty: 0% cloud = 0 penalty, 100% cloud = -40
	const cloudPenalty = -(cloudCover / 100) * 40;

	// 3. Darkness gate — sun must be below -6° (civil twilight)
	const solarElev = getSolarElevation(time, lat, lon);
	const darknessGate = solarElev < -6;

	// 4. Solar wind bonus (0-20)
	// Southward Bz (negative) is favorable; scale from -1 to -20 nT
	const bzScore = bz < 0 ? Math.min(20, Math.abs(bz)) : 0;
	const solarWindBonus = bzScore;

	// Total
	let total = darknessGate ? kpContribution + cloudPenalty + solarWindBonus : 0;
	total = Math.round(Math.min(100, Math.max(0, total)));

	return {
		total,
		verdict: scoreToVerdict(total),
		kpContribution: Math.round(kpContribution) || 0,
		cloudPenalty: Math.round(cloudPenalty) || 0,
		darknessGate,
		solarWindBonus: Math.round(solarWindBonus),
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
