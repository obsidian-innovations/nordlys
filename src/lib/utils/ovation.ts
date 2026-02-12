import type { NoaaOvationResponse } from '$lib/types/api.js';

export interface OvationGeoJSON {
	type: 'FeatureCollection';
	features: {
		type: 'Feature';
		geometry: { type: 'Point'; coordinates: [number, number] };
		properties: { probability: number };
	}[];
}

/** Convert NOAA ovation coordinates to a GeoJSON FeatureCollection of Points.
 *  Filters zero-probability points and normalizes longitude from 0–360 to -180–180. */
export function ovationToGeoJSON(ovation: NoaaOvationResponse): OvationGeoJSON {
	const features = [];

	for (const [lon, lat, probability] of ovation.coordinates) {
		if (probability <= 0) continue;

		features.push({
			type: 'Feature' as const,
			geometry: {
				type: 'Point' as const,
				coordinates: [lon > 180 ? lon - 360 : lon, lat] as [number, number]
			},
			properties: { probability }
		});
	}

	return { type: 'FeatureCollection', features };
}
