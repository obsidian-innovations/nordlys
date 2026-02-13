<script lang="ts">
	import type { AuroraScore } from '$lib/types/domain.js';
	import { VERDICT_LABELS, VERDICT_COLORS } from '$lib/services/aurora.js';

	interface Props {
		score: AuroraScore | null;
	}

	let { score }: Props = $props();
</script>

{#if score}
	<div class="rounded-2xl border border-night-700 bg-night-800 p-6">
		<div class="mb-1 text-sm text-snow-300">Aurora Visibility</div>

		<div class="flex items-end gap-4">
			<!-- Score number -->
			<div class="text-6xl font-bold tabular-nums {VERDICT_COLORS[score.verdict]}">
				{score.total}
			</div>

			<div class="mb-1 flex flex-col">
				<span class="text-lg font-semibold {VERDICT_COLORS[score.verdict]}">
					{VERDICT_LABELS[score.verdict]}
				</span>
				{#if !score.darknessGate}
					<span class="text-xs text-snow-300">Too bright — sun is above -6°</span>
				{/if}
			</div>
		</div>

		<!-- Score breakdown -->
		<div class="mt-4 grid grid-cols-3 gap-3 text-xs">
			<div class="rounded-lg bg-night-700 p-2">
				<div class="text-snow-300">KP Index</div>
				<div class="text-lg font-semibold text-snow-50">{score.kp.toFixed(1)}</div>
				<div class="text-aurora-green">+{score.kpContribution} pts</div>
			</div>
			<div class="rounded-lg bg-night-700 p-2">
				<div class="text-snow-300">Clouds</div>
				<div class="text-lg font-semibold text-snow-50">{score.cloudCover}%</div>
				<div class="text-aurora-pink">{score.cloudPenalty} pts</div>
			</div>
			<div class="rounded-lg bg-night-700 p-2">
				<div class="text-snow-300">Solar Wind Bz</div>
				<div class="text-lg font-semibold text-snow-50">IMF</div>
				<div class="text-aurora-purple">+{score.solarWindBonus} pts</div>
			</div>
			<div class="rounded-lg bg-night-700 p-2">
				<div class="text-snow-300">Wind Speed</div>
				<div class="text-lg font-semibold text-snow-50">km/s</div>
				<div class="text-aurora-purple">+{score.speedBonus} pts</div>
			</div>
			<div class="rounded-lg bg-night-700 p-2">
				<div class="text-snow-300">Hem. Power</div>
				<div class="text-lg font-semibold text-snow-50">GW</div>
				<div class="text-aurora-green">+{score.hemisphericPowerBonus} pts</div>
			</div>
		</div>
	</div>
{:else}
	<div class="animate-pulse rounded-2xl border border-night-700 bg-night-800 p-6">
		<div class="h-4 w-32 rounded bg-night-700"></div>
		<div class="mt-3 h-16 w-24 rounded bg-night-700"></div>
	</div>
{/if}
