<script lang="ts">
	import { onMount } from 'svelte';
	import AuroraScoreCard from '$lib/components/forecast/AuroraScore.svelte';
	import KpIndexGauge from '$lib/components/forecast/KpIndexGauge.svelte';
	import CloudCoverBar from '$lib/components/forecast/CloudCoverBar.svelte';
	import SolarWindCard from '$lib/components/forecast/SolarWindCard.svelte';
	import PullToRefresh from '$lib/components/ui/PullToRefresh.svelte';
	import { getForecastStore } from '$lib/stores/forecast.svelte.js';

	const forecast = getForecastStore();

	onMount(() => {
		forecast.refresh();

		// Auto-refresh every 10 minutes
		const interval = setInterval(() => forecast.refresh(), 10 * 60 * 1000);
		return () => clearInterval(interval);
	});
</script>

<PullToRefresh onrefresh={forecast.refresh}>
	<div class="mx-auto flex max-w-lg flex-col gap-4 px-4 py-4">
		{#if forecast.error}
			<div class="rounded-lg bg-night-700 px-4 py-2 text-xs text-score-possible">
				{forecast.error}
			</div>
		{/if}

		<AuroraScoreCard score={forecast.score} />

		<div class="grid grid-cols-2 gap-4">
			<KpIndexGauge readings={forecast.kpReadings} forecast={forecast.kpForecast} />
			<CloudCoverBar weather={forecast.weather} />
		</div>

		<SolarWindCard readings={forecast.solarWind} />

		{#if !forecast.score && !forecast.loading}
			<div class="py-8 text-center text-sm text-snow-300">Pull down to load aurora data</div>
		{/if}
	</div>
</PullToRefresh>
