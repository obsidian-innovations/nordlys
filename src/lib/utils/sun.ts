/**
 * Calculate solar elevation angle in degrees.
 * Simplified astronomical algorithm — accuracy ±1° (sufficient for twilight gating).
 */
export function getSolarElevation(time: Date, lat: number, lon: number): number {
	const dayOfYear = getDayOfYear(time);
	const hours = time.getUTCHours() + time.getUTCMinutes() / 60;

	// Solar declination (simplified)
	const declination = -23.44 * Math.cos(toRad((360 / 365) * (dayOfYear + 10)));

	// Hour angle
	const solarNoon = 12 - lon / 15; // UTC hour of solar noon
	const hourAngle = (hours - solarNoon) * 15;

	// Solar elevation
	const latRad = toRad(lat);
	const decRad = toRad(declination);
	const haRad = toRad(hourAngle);

	const sinElev =
		Math.sin(latRad) * Math.sin(decRad) +
		Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad);

	return toDeg(Math.asin(Math.max(-1, Math.min(1, sinElev))));
}

/** Check if it's dark enough for aurora viewing (sun below -6°) */
export function isDarkEnough(time: Date, lat: number, lon: number): boolean {
	return getSolarElevation(time, lat, lon) < -6;
}

function getDayOfYear(date: Date): number {
	const start = new Date(date.getFullYear(), 0, 0);
	const diff = date.getTime() - start.getTime();
	return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function toRad(deg: number): number {
	return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
	return (rad * 180) / Math.PI;
}
