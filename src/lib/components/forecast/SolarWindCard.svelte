<script lang="ts">
	import type { SolarWind } from '$lib/types/domain.js';

	interface Props {
		readings: SolarWind[];
	}

	let { readings }: Props = $props();

	const latest = $derived(readings.length > 0 ? readings[readings.length - 1] : null);

	const bzDirection = $derived(latest ? (latest.bz < 0 ? 'South ↓' : 'North ↑') : '—');

	const bzFavorable = $derived(latest ? latest.bz < -2 : false);
</script>

<div class="rounded-2xl border border-night-700 bg-night-800 p-4">
	<div class="mb-2 text-sm text-snow-300">Solar Wind</div>

	{#if latest}
		<div class="grid grid-cols-2 gap-3">
			<div>
				<div class="text-xs text-snow-300">Bz</div>
				<div
					class="text-xl font-bold tabular-nums {bzFavorable
						? 'text-aurora-green'
						: 'text-snow-50'}"
				>
					{latest.bz.toFixed(1)} nT
				</div>
				<div class="text-xs {bzFavorable ? 'text-aurora-green' : 'text-snow-300'}">
					{bzDirection}
					{#if bzFavorable}
						— Favorable
					{/if}
				</div>
			</div>
			<div>
				<div class="text-xs text-snow-300">Bt</div>
				<div class="text-xl font-bold tabular-nums text-snow-50">
					{latest.bt.toFixed(1)} nT
				</div>
				<div class="text-xs text-snow-300">Total field</div>
			</div>
		</div>
	{:else}
		<div class="text-sm text-snow-300">No data available</div>
	{/if}
</div>
