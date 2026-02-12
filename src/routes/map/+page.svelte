<script lang="ts">
	import { onMount } from 'svelte';
	import AuroraMap from '$lib/components/map/AuroraMap.svelte';
	import { getSpotsStore } from '$lib/stores/spots.svelte.js';
	import { getSettingsStore } from '$lib/stores/settings.svelte.js';
	import { getForecastStore } from '$lib/stores/forecast.svelte.js';

	const spots = getSpotsStore();
	const settings = getSettingsStore();
	const forecast = getForecastStore();

	onMount(() => {
		spots.loadCurated();
		forecast.refresh();
	});
</script>

<AuroraMap
	spots={spots.all}
	ovation={forecast.ovation}
	mapTilerKey={settings.current.mapTilerKey}
	homeLocation={settings.current.location}
	class="h-[calc(100svh-7rem)]"
/>
