export interface KpReading {
	time: Date;
	kp: number;
	source: 'observed' | 'estimated' | 'predicted';
}

export interface SolarWind {
	time: Date;
	bz: number; // nT, negative = southward (good for aurora)
	bt: number; // nT, total field
	speed?: number;
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

export interface UserSettings {
	mapTilerKey: string;
	notificationsEnabled: boolean;
	kpThreshold: number; // minimum KP to show alert
	favoriteSpotIds: string[];
}

export const DEFAULT_SETTINGS: UserSettings = {
	mapTilerKey: '',
	notificationsEnabled: false,
	kpThreshold: 3,
	favoriteSpotIds: []
};
