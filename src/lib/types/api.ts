/** NOAA SWPC KP Index — each row: [time_tag, Kp, Kp_fraction, a_running, station_count] */
export type NoaaKpRow = [string, string, string, string, string];

/** NOAA KP Forecast — each row: [time_tag, Kp, observed/estimated/predicted, noaa_scale] */
export type NoaaKpForecastRow = [string, string, string, string];

/** NOAA Solar Wind Mag — each row: [time_tag, bx_gsm, by_gsm, bz_gsm, lon_gsm, lat_gsm, bt] */
export type NoaaSolarWindRow = [string, string, string, string, string, string, string];

/** NOAA Solar Wind Plasma — each row: [time_tag, density, speed, temperature] */
export type NoaaSolarWindPlasmaRow = [string, string, string, string];

/** NOAA Hemispheric Power — JSON array of observation objects */
export interface NoaaHemisphericPowerEntry {
	'Observation Time': string;
	'Data Format': string;
	Hemisphere: 'North' | 'South';
	'Estimated Power': number;
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
