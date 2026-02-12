<script lang="ts">
	import type { ViewingSpot } from '$lib/types/domain.js';
	import SpotCard from './SpotCard.svelte';

	interface Props {
		spots: ViewingSpot[];
		favoriteIds?: string[];
		ontogglefavorite?: (id: string) => void;
	}

	let { spots, favoriteIds = [], ontogglefavorite }: Props = $props();
</script>

<div class="flex flex-col gap-3">
	{#each spots as spot (spot.id)}
		<SpotCard
			{spot}
			isFavorite={favoriteIds.includes(spot.id)}
			ontogglefavorite={ontogglefavorite ? () => ontogglefavorite(spot.id) : undefined}
		/>
	{/each}

	{#if spots.length === 0}
		<div class="py-8 text-center text-sm text-snow-300">No viewing spots found</div>
	{/if}
</div>
