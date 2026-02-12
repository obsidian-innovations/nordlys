<script lang="ts">
	import { MapLibre, Marker, NavigationControl, GeolocateControl } from 'svelte-maplibre-gl';
	import type { ViewingSpot } from '$lib/types/domain.js';
	import ViewingSpotMarker from './ViewingSpotMarker.svelte';

	interface Props {
		spots?: ViewingSpot[];
		mapTilerKey?: string;
		class?: string;
	}

	let { spots = [], mapTilerKey = '', class: className = '' }: Props = $props();

	const styleUrl = $derived(
		mapTilerKey
			? `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${mapTilerKey}`
			: undefined
	);

	// Tromsø center
	const center: [number, number] = [18.9553, 69.6492];
</script>

<div class="relative {className}">
	{#if styleUrl}
		<MapLibre
			style={styleUrl}
			{center}
			zoom={9}
			class="h-full w-full"
		>
			<NavigationControl position="top-right" />
			<GeolocateControl position="top-right" />

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
