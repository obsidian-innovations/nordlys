import { base } from '$app/paths';
import { persistedState } from 'svelte-persisted-state';
import type { ViewingSpot } from '$lib/types/domain.js';

const userSpots = persistedState<ViewingSpot[]>('nordlys-user-spots', []);

let curatedSpots = $state<ViewingSpot[]>([]);

export function getSpotsStore() {
	return {
		get curated() {
			return curatedSpots;
		},
		get userAdded() {
			return userSpots.current;
		},
		get all() {
			return [...curatedSpots, ...userSpots.current];
		},

		async loadCurated() {
			try {
				const res = await fetch(`${base}/viewing-spots.json`);
				curatedSpots = await res.json();
			} catch {
				// Will use empty array if offline and not cached
			}
		},

		addSpot(spot: ViewingSpot) {
			userSpots.current = [...userSpots.current, { ...spot, userAdded: true }];
		},

		removeSpot(id: string) {
			userSpots.current = userSpots.current.filter((s) => s.id !== id);
		},

		getById(id: string): ViewingSpot | undefined {
			return [...curatedSpots, ...userSpots.current].find((s) => s.id === id);
		}
	};
}
