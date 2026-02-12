<script lang="ts">
	import type { WeatherPoint } from '$lib/types/domain.js';
	import { formatTime } from '$lib/utils/time.js';

	interface Props {
		weather: WeatherPoint[];
	}

	let { weather }: Props = $props();

	// Show next 12 hours of weather
	const upcoming = $derived(
		weather.filter((w) => w.time > new Date()).slice(0, 12)
	);

	const currentCloud = $derived(
		weather.length > 0
			? weather.reduce((closest, w) => {
					const now = Date.now();
					return Math.abs(w.time.getTime() - now) < Math.abs(closest.time.getTime() - now)
						? w
						: closest;
				}).cloudCover
			: null
	);

	function cloudColor(pct: number): string {
		if (pct < 25) return 'bg-aurora-green';
		if (pct < 50) return 'bg-score-possible';
		if (pct < 75) return 'bg-score-unlikely';
		return 'bg-score-none';
	}
</script>

<div class="rounded-2xl border border-night-700 bg-night-800 p-4">
	<div class="mb-3 flex items-center justify-between">
		<span class="text-sm text-snow-300">Cloud Cover</span>
		{#if currentCloud !== null}
			<span class="text-2xl font-bold tabular-nums text-snow-50">{Math.round(currentCloud)}%</span>
		{/if}
	</div>

	<!-- Timeline bars -->
	<div class="flex items-end gap-0.5" style="height: 48px">
		{#each upcoming as w}
			<div
				class="flex-1 rounded-t {cloudColor(w.cloudCover)} opacity-70 transition-all"
				style="height: {Math.max(4, w.cloudCover)}%"
				title="{Math.round(w.cloudCover)}% clouds at {formatTime(w.time)}"
			></div>
		{/each}
	</div>

	<div class="mt-1 flex justify-between text-[10px] text-snow-300">
		{#if upcoming.length > 0}
			<span>{formatTime(upcoming[0].time)}</span>
			<span>{formatTime(upcoming[upcoming.length - 1].time)}</span>
		{/if}
	</div>
</div>
