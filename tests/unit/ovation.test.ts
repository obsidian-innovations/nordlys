import { describe, it, expect } from 'vitest';
import { ovationToGeoJSON } from '$lib/utils/ovation.js';
import type { NoaaOvationResponse } from '$lib/types/api.js';

function makeOvation(coords: [number, number, number][]): NoaaOvationResponse {
	return {
		Forecast_Time: '2025-01-15T00:00:00Z',
		Data_Format: '[Longitude, Latitude, Aurora]',
		coordinates: coords
	};
}

describe('ovationToGeoJSON', () => {
	it('filters out zero-probability points', () => {
		const result = ovationToGeoJSON(
			makeOvation([
				[10, 70, 0],
				[20, 65, 15],
				[30, 60, 0]
			])
		);
		expect(result.features).toHaveLength(1);
		expect(result.features[0].properties.probability).toBe(15);
	});

	it('normalizes longitude from 0–360 to -180–180', () => {
		const result = ovationToGeoJSON(
			makeOvation([
				[350, 70, 10],
				[190, 65, 20],
				[180, 60, 30],
				[10, 55, 40]
			])
		);
		const lons = result.features.map((f) => f.geometry.coordinates[0]);
		expect(lons).toEqual([-10, -170, 180, 10]);
	});

	it('produces valid GeoJSON structure', () => {
		const result = ovationToGeoJSON(makeOvation([[18, 69, 50]]));
		expect(result.type).toBe('FeatureCollection');
		expect(result.features).toHaveLength(1);

		const feature = result.features[0];
		expect(feature.type).toBe('Feature');
		expect(feature.geometry.type).toBe('Point');
		expect(feature.geometry.coordinates).toEqual([18, 69]);
		expect(feature.properties.probability).toBe(50);
	});

	it('handles empty coordinates', () => {
		const result = ovationToGeoJSON(makeOvation([]));
		expect(result.type).toBe('FeatureCollection');
		expect(result.features).toHaveLength(0);
	});

	it('handles all-zero probabilities', () => {
		const result = ovationToGeoJSON(
			makeOvation([
				[10, 70, 0],
				[20, 65, 0]
			])
		);
		expect(result.features).toHaveLength(0);
	});
});
