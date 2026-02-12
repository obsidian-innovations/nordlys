<script lang="ts">
	import { onMount } from 'svelte';
	import SpotList from '$lib/components/spots/SpotList.svelte';
	import AddSpotForm from '$lib/components/spots/AddSpotForm.svelte';
	import { getSpotsStore } from '$lib/stores/spots.svelte.js';
	import { getSettingsStore } from '$lib/stores/settings.svelte.js';
	import type { ViewingSpot } from '$lib/types/domain.js';

	const spots = getSpotsStore();
	const settings = getSettingsStore();

	let showAddForm = $state(false);

	onMount(() => {
		spots.loadCurated();
	});

	function handleAdd(spot: ViewingSpot) {
		spots.addSpot(spot);
		showAddForm = false;
	}
</script>

<div class="mx-auto max-w-lg px-4 py-4">
	<div class="mb-4 flex items-center justify-between">
		<h1 class="text-lg font-bold text-snow-50">Viewing Spots</h1>
		<button
			onclick={() => (showAddForm = !showAddForm)}
			class="rounded-lg border border-night-600 px-3 py-1.5 text-sm text-snow-300 hover:text-snow-50"
		>
			{showAddForm ? 'Cancel' : '+ Add Spot'}
		</button>
	</div>

	{#if showAddForm}
		<div class="mb-4">
			<AddSpotForm onadd={handleAdd} oncancel={() => (showAddForm = false)} />
		</div>
	{/if}

	<SpotList
		spots={spots.all}
		favoriteIds={settings.current.favoriteSpotIds}
		ontogglefavorite={(id) => settings.toggleFavorite(id)}
	/>
</div>
