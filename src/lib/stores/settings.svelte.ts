import { persistedState } from 'svelte-persisted-state';
import { DEFAULT_SETTINGS, type UserSettings } from '$lib/types/domain.js';

const settings = persistedState<UserSettings>('nordlys-settings', DEFAULT_SETTINGS);

export function getSettingsStore() {
	return {
		get current() { return settings.current; },

		update(partial: Partial<UserSettings>) {
			settings.current = { ...settings.current, ...partial };
		},

		toggleFavorite(spotId: string) {
			const favs = settings.current.favoriteSpotIds;
			if (favs.includes(spotId)) {
				settings.current = {
					...settings.current,
					favoriteSpotIds: favs.filter((id) => id !== spotId)
				};
			} else {
				settings.current = {
					...settings.current,
					favoriteSpotIds: [...favs, spotId]
				};
			}
		},

		isFavorite(spotId: string): boolean {
			return settings.current.favoriteSpotIds.includes(spotId);
		},

		reset() {
			settings.current = DEFAULT_SETTINGS;
		}
	};
}
