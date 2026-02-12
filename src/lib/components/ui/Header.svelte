<script lang="ts">
	import { timeAgo } from '$lib/utils/time.js';

	interface Props {
		lastUpdated?: Date | null;
		loading?: boolean;
	}

	let { lastUpdated = null, loading = false }: Props = $props();
</script>

<header class="sticky top-0 z-40 border-b border-night-700 bg-night-900/80 backdrop-blur-md">
	<div
		class="flex items-center justify-between px-4"
		style="padding-top: calc(0.75rem + var(--safe-area-top))"
	>
		<div class="flex items-center gap-2">
			<span class="text-xl font-bold text-aurora-green">nordlys</span>
		</div>
		<div class="flex items-center gap-2 text-xs text-snow-300">
			{#if loading}
				<span class="inline-block h-2 w-2 animate-pulse rounded-full bg-aurora-green"></span>
				<span>Updating…</span>
			{:else if lastUpdated}
				<span>Updated {timeAgo(lastUpdated)}</span>
			{/if}
		</div>
	</div>
</header>
