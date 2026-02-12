<script lang="ts">
	import { Marker, Popup } from 'svelte-maplibre-gl';
	import type { ViewingSpot } from '$lib/types/domain.js';

	interface Props {
		spot: ViewingSpot;
	}

	let { spot }: Props = $props();

	const lightColor: Record<string, string> = {
		low: 'bg-aurora-green',
		medium: 'bg-score-possible',
		high: 'bg-score-none'
	};
</script>

<Marker lnglat={[spot.lon, spot.lat]}>
	{#snippet content()}
		<div class="group cursor-pointer">
			<div
				class="h-3 w-3 rounded-full border-2 border-night-900 {lightColor[spot.lightPollution]} shadow-lg transition-transform group-hover:scale-150"
			></div>
		</div>
	{/snippet}

	<Popup offset={12}>
		<div class="min-w-[180px] rounded-lg bg-night-800 p-3 text-snow-100 shadow-xl">
			<h3 class="font-semibold">{spot.name}</h3>
			<p class="mt-1 text-xs text-snow-300">{spot.description}</p>
			<div class="mt-2 flex items-center gap-2 text-xs">
				<span class="rounded-full px-2 py-0.5 {lightColor[spot.lightPollution]} text-night-900">
					{spot.lightPollution} light
				</span>
			</div>
			<p class="mt-1 text-xs text-snow-300">{spot.access}</p>
		</div>
	</Popup>
</Marker>
