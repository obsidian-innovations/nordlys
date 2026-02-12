<script lang="ts">
	import { GeoJSONSource, HeatmapLayer } from 'svelte-maplibre-gl';
	import { ovationToGeoJSON } from '$lib/utils/ovation.js';
	import type { NoaaOvationResponse } from '$lib/types/api.js';

	interface Props {
		ovation: NoaaOvationResponse | null;
	}

	let { ovation }: Props = $props();

	const geojson = $derived(ovation ? ovationToGeoJSON(ovation) : null);
</script>

{#if geojson}
	<GeoJSONSource data={geojson}>
		<HeatmapLayer
			paint={{
				'heatmap-weight': [
					'interpolate',
					['linear'],
					['get', 'probability'],
					0, 0,
					5, 0.3,
					15, 0.6,
					30, 0.8,
					100, 1
				],
				'heatmap-color': [
					'interpolate',
					['linear'],
					['heatmap-density'],
					0, 'transparent',
					0.15, '#00bfa5',
					0.35, '#00e676',
					0.6, '#b388ff',
					1, '#f06292'
				],
				'heatmap-intensity': [
					'interpolate',
					['linear'],
					['zoom'],
					0, 0.5,
					4, 1,
					8, 2,
					12, 3
				],
				'heatmap-radius': [
					'interpolate',
					['exponential', 2],
					['zoom'],
					0, 20,
					3, 60,
					6, 150,
					9, 400
				],
				'heatmap-opacity': [
					'interpolate',
					['linear'],
					['zoom'],
					0, 0.8,
					9, 0.6,
					14, 0.2
				]
			}}
		/>
	</GeoJSONSource>
{/if}
