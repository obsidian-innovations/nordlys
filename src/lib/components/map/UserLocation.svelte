<script lang="ts">
	import { Marker } from 'svelte-maplibre-gl';
	import type { GeoPosition } from '$lib/services/geolocation.js';

	interface Props {
		position: GeoPosition | null;
	}

	let { position }: Props = $props();
</script>

{#if position}
	<Marker lnglat={[position.lon, position.lat]}>
		{#snippet content()}
			<div class="relative">
				<div class="h-4 w-4 rounded-full border-2 border-white bg-aurora-blue shadow-lg"></div>
				<div
					class="absolute inset-0 h-4 w-4 animate-ping rounded-full bg-aurora-blue opacity-30"
				></div>
			</div>
		{/snippet}
	</Marker>
{/if}
