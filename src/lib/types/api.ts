/** NOAA Hemispheric Power — JSON array of observation objects */
export interface NoaaHemisphericPowerEntry {
	'Observation Time': string;
	'Data Format': string;
	Hemisphere: 'North' | 'South';
	'Estimated Power': number;
}

/** NOAA 1-minute estimated Kp — JSON array of observation objects */
export interface NoaaKp1MinEntry {
	time_tag: string;
	estimated_kp: number;
	kp: number;
}

/** NOAA Space Weather Scales — current conditions */
export interface NoaaScalesResponse {
	[index: string]: NoaaScalesEntry;
}

export interface NoaaScalesEntry {
	DateStamp: string;
	TimeStamp: string;
	R: { Scale: string; Text: string };
	S: { Scale: string; Text: string };
	G: { Scale: string; Text: string };
}

/** NOAA Aurora Ovation response */
export interface NoaaOvationResponse {
	Forecast_Time: string;
	Data_Format: string;
	coordinates: [number, number, number][]; // [lon, lat, aurora_probability]
}

/** MET Norway Locationforecast compact response */
export interface MetForecastResponse {
	type: 'Feature';
	geometry: {
		type: 'Point';
		coordinates: [number, number, number]; // [lon, lat, altitude]
	};
	properties: {
		meta: {
			updated_at: string;
			units: Record<string, string>;
		};
		timeseries: MetTimeseries[];
	};
}

export interface MetTimeseries {
	time: string;
	data: {
		instant: {
			details: {
				air_temperature: number;
				cloud_area_fraction: number;
				wind_from_direction: number;
				wind_speed: number;
				relative_humidity?: number;
			};
		};
		next_1_hours?: {
			summary: { symbol_code: string };
			details: { precipitation_amount: number };
		};
		next_6_hours?: {
			summary: { symbol_code: string };
			details: { precipitation_amount: number };
		};
	};
}
