<script lang="ts">
	import type { KpReading } from '$lib/types/domain.js';
	import { formatTime } from '$lib/utils/time.js';

	interface Props {
		readings: KpReading[];
		forecast: KpReading[];
	}

	let { readings, forecast }: Props = $props();

	const currentKp = $derived(readings.length > 0 ? readings[readings.length - 1].kp : null);

	// Show last 8 readings + next 8 forecast entries
	const recentReadings = $derived(readings.slice(-8));
	const upcomingForecast = $derived(forecast.filter((f) => f.time > new Date()).slice(0, 8));

	function kpColor(kp: number): string {
		if (kp < 2) return 'bg-score-none';
		if (kp < 3) return 'bg-score-unlikely';
		if (kp < 5) return 'bg-score-possible';
		if (kp < 7) return 'bg-score-likely';
		if (kp < 8) return 'bg-score-high';
		return 'bg-score-storm';
	}

	function barHeight(kp: number): number {
		return Math.max(4, (kp / 9) * 100);
	}
</script>

<div class="rounded-2xl border border-night-700 bg-night-800 p-4">
	<div class="mb-3 flex items-center justify-between">
		<span class="text-sm text-snow-300">KP Index</span>
		{#if currentKp !== null}
			<span class="text-2xl font-bold tabular-nums text-snow-50">{currentKp.toFixed(1)}</span>
		{/if}
	</div>

	<!-- Bar chart -->
	<div class="flex items-end gap-0.5" style="height: 64px">
		{#each recentReadings as r}
			<div
				class="flex-1 rounded-t {kpColor(r.kp)} opacity-80 transition-all"
				style="height: {barHeight(r.kp)}%"
				title="KP {r.kp} at {formatTime(r.time)}"
			></div>
		{/each}

		{#if upcomingForecast.length > 0}
			<div class="mx-0.5 h-full w-px bg-night-600"></div>
		{/if}

		{#each upcomingForecast as f}
			<div
				class="flex-1 rounded-t {kpColor(f.kp)} opacity-40 transition-all"
				style="height: {barHeight(f.kp)}%"
				title="Forecast KP {f.kp} at {formatTime(f.time)}"
			></div>
		{/each}
	</div>

	<div class="mt-1 flex justify-between text-[10px] text-snow-300">
		<span>Past</span>
		<span>Now</span>
		<span>Forecast</span>
	</div>
</div>
