<script lang="ts">
	import { onMount } from 'svelte';
	import AuroraMap from '$lib/components/map/AuroraMap.svelte';
	import { getSpotsStore } from '$lib/stores/spots.svelte.js';
	import { getSettingsStore } from '$lib/stores/settings.svelte.js';

	const spots = getSpotsStore();
	const settings = getSettingsStore();

	onMount(() => {
		spots.loadCurated();
	});
</script>

<AuroraMap
	spots={spots.all}
	mapTilerKey={settings.current.mapTilerKey}
	class="h-[calc(100svh-7rem)]"
/>
