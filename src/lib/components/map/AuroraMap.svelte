<script lang="ts">
	import {
		MapLibre,
		Marker,
		NavigationControl,
		GeolocateControl,
		CustomControl
	} from 'svelte-maplibre-gl';
	import type { Map } from 'maplibre-gl';
	import type { ViewingSpot, UserLocation } from '$lib/types/domain.js';
	import type { NoaaOvationResponse } from '$lib/types/api.js';
	import ViewingSpotMarker from './ViewingSpotMarker.svelte';
	import UserLocationMarker from './UserLocation.svelte';
	import AuroraOverlay from './AuroraOverlay.svelte';

	interface Props {
		spots?: ViewingSpot[];
		ovation?: NoaaOvationResponse | null;
		mapTilerKey?: string;
		homeLocation?: UserLocation;
		class?: string;
	}

	let {
		spots = [],
		ovation = null,
		mapTilerKey = '',
		homeLocation,
		class: className = ''
	}: Props = $props();

	let map = $state<Map>();

	const styleUrl = $derived(
		mapTilerKey
			? `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${mapTilerKey}`
			: undefined
	);

	const TROMSO: [number, number] = [18.9553, 69.6492];
	const center = $derived<[number, number]>(
		homeLocation ? [homeLocation.lon, homeLocation.lat] : TROMSO
	);

	function flyHome() {
		map?.flyTo({ center: center, zoom: 9 });
	}
</script>

<div class="relative {className}">
	{#if styleUrl}
		<MapLibre bind:map style={styleUrl} {center} zoom={9} class="h-full w-full">
			<NavigationControl position="top-right" />
			<GeolocateControl position="top-right" />

			{#if homeLocation}
				<CustomControl position="top-right">
					<button
						onclick={flyHome}
						title="Fly to {homeLocation.name}"
						class="flex h-[29px] w-[29px] items-center justify-center rounded bg-white text-night-900 shadow hover:bg-snow-100"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="h-4 w-4"
						>
							<path
								d="M10.707 2.293a1 1 0 0 0-1.414 0l-7 7a1 1 0 0 0 1.414 1.414L4 10.414V17a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-6.586l.293.293a1 1 0 0 0 1.414-1.414l-7-7Z"
							/>
						</svg>
					</button>
				</CustomControl>

				<UserLocationMarker
					position={{ lat: homeLocation.lat, lon: homeLocation.lon, accuracy: 0 }}
				/>
			{/if}

			<AuroraOverlay {ovation} />

			{#each spots as spot (spot.id)}
				<ViewingSpotMarker {spot} />
			{/each}
		</MapLibre>
	{:else}
		<div class="flex h-full w-full items-center justify-center bg-night-800 text-snow-300">
			<div class="text-center">
				<p class="text-sm">Map requires a MapTiler API key</p>
				<p class="mt-1 text-xs">Add one in Settings</p>
			</div>
		</div>
	{/if}
</div>
