<script lang="ts">
	import type { ViewingSpot } from '$lib/types/domain.js';

	interface Props {
		spot: ViewingSpot;
		isFavorite?: boolean;
		ontogglefavorite?: () => void;
	}

	let { spot, isFavorite = false, ontogglefavorite }: Props = $props();

	const lightBadge: Record<string, string> = {
		low: 'bg-aurora-green/20 text-aurora-green',
		medium: 'bg-score-possible/20 text-score-possible',
		high: 'bg-score-none/20 text-score-none'
	};
</script>

<div
	class="rounded-xl border border-night-700 bg-night-800 p-4 transition-colors hover:border-night-600"
>
	<div class="flex items-start justify-between">
		<div>
			<h3 class="font-semibold text-snow-50">{spot.name}</h3>
			<p class="mt-1 text-sm text-snow-300">{spot.description}</p>
		</div>

		{#if ontogglefavorite}
			<button
				onclick={ontogglefavorite}
				aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
				class="ml-2 p-1 text-snow-300 hover:text-aurora-green"
			>
				<svg
					class="h-5 w-5"
					viewBox="0 0 24 24"
					fill={isFavorite ? 'currentColor' : 'none'}
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
					/>
				</svg>
			</button>
		{/if}
	</div>

	<div class="mt-3 flex items-center gap-2">
		<span class="rounded-full px-2 py-0.5 text-xs {lightBadge[spot.lightPollution]}">
			{spot.lightPollution} light
		</span>
		{#if spot.userAdded}
			<span class="rounded-full bg-aurora-purple/20 px-2 py-0.5 text-xs text-aurora-purple">
				Custom
			</span>
		{/if}
	</div>

	<p class="mt-2 text-xs text-snow-300">{spot.access}</p>
</div>
