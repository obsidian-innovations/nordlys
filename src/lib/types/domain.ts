export interface KpReading {
	time: Date;
	kp: number;
	source: 'observed' | 'estimated' | 'predicted';
}

export interface SolarWind {
	time: Date;
	bz: number; // nT, negative = southward (good for aurora)
	bt: number; // nT, total field
	speed?: number; // km/s
	density?: number; // protons/cm³
}

export interface HemisphericPower {
	time: Date;
	power: number; // GW, typically 5-200+
	hemisphere: 'North' | 'South';
}

export interface WeatherPoint {
	time: Date;
	cloudCover: number; // 0-100%
	temperature: number; // °C
	windSpeed: number; // m/s
	symbolCode?: string;
}

export type AuroraVerdict = 'none' | 'unlikely' | 'possible' | 'likely' | 'high' | 'storm';

export interface AuroraScore {
	total: number; // 0-100
	verdict: AuroraVerdict;
	kpContribution: number;
	cloudPenalty: number;
	darknessGate: boolean; // true = dark enough
	solarWindBonus: number;
	speedBonus: number;
	hemisphericPowerBonus: number;
	kp: number;
	cloudCover: number;
	timestamp: Date;
}

export interface ViewingSpot {
	id: string;
	name: string;
	lat: number;
	lon: number;
	description: string;
	lightPollution: 'low' | 'medium' | 'high';
	access: string;
	userAdded?: boolean;
}

export interface UserLocation {
	lat: number;
	lon: number;
	name: string;
}

export interface UserSettings {
	mapTilerKey: string;
	notificationsEnabled: boolean;
	kpThreshold: number; // minimum KP to show alert
	favoriteSpotIds: string[];
	location?: UserLocation;
}

export const DEFAULT_SETTINGS: UserSettings = {
	mapTilerKey: import.meta.env.VITE_MAPTILER_KEY ?? '',
	notificationsEnabled: false,
	kpThreshold: 3,
	favoriteSpotIds: []
};
