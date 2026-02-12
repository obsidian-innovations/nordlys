export interface GeoPosition {
	lat: number;
	lon: number;
	accuracy: number;
}

/** Default: Tromsø city center */
export const TROMSO: GeoPosition = {
	lat: 69.6492,
	lon: 18.9553,
	accuracy: 0
};

/**
 * Get current position using the Web Geolocation API.
 * Falls back to Tromsø coordinates on error.
 */
export function getCurrentPosition(timeout = 10000): Promise<GeoPosition> {
	return new Promise((resolve) => {
		if (!navigator.geolocation) {
			resolve(TROMSO);
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(pos) => {
				resolve({
					lat: pos.coords.latitude,
					lon: pos.coords.longitude,
					accuracy: pos.coords.accuracy
				});
			},
			() => resolve(TROMSO),
			{
				enableHighAccuracy: true,
				timeout,
				maximumAge: 5 * 60 * 1000 // 5 min cache
			}
		);
	});
}

/** Watch position changes */
export function watchPosition(
	callback: (pos: GeoPosition) => void,
	onError?: () => void
): number | undefined {
	if (!navigator.geolocation) return undefined;

	return navigator.geolocation.watchPosition(
		(pos) => {
			callback({
				lat: pos.coords.latitude,
				lon: pos.coords.longitude,
				accuracy: pos.coords.accuracy
			});
		},
		onError,
		{ enableHighAccuracy: true }
	);
}
