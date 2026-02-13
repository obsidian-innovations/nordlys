<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		onrefresh: () => Promise<void>;
		children: Snippet;
	}

	let { onrefresh, children }: Props = $props();

	let pulling = $state(false);
	let pullDistance = $state(0);
	let refreshing = $state(false);
	let startY = 0;

	const THRESHOLD = 80;

	function onTouchStart(e: TouchEvent) {
		if (window.scrollY === 0) {
			startY = e.touches[0].clientY;
			pulling = true;
		}
	}

	function onTouchMove(e: TouchEvent) {
		if (!pulling) return;
		pullDistance = Math.max(0, Math.min(120, e.touches[0].clientY - startY));
	}

	async function onTouchEnd() {
		if (!pulling) return;
		pulling = false;

		if (pullDistance >= THRESHOLD) {
			refreshing = true;
			await onrefresh();
			refreshing = false;
		}

		pullDistance = 0;
	}
</script>

<div
	role="presentation"
	ontouchstart={onTouchStart}
	ontouchmove={onTouchMove}
	ontouchend={onTouchEnd}
>
	{#if pullDistance > 0 || refreshing}
		<div
			class="flex items-center justify-center py-2 text-xs text-snow-300 transition-all"
			style="height: {refreshing ? 40 : pullDistance}px; opacity: {refreshing
				? 1
				: pullDistance / THRESHOLD}"
		>
			{#if refreshing}
				<span class="animate-spin">↻</span>
				<span class="ml-2">Refreshing…</span>
			{:else if pullDistance >= THRESHOLD}
				<span>Release to refresh</span>
			{:else}
				<span>Pull to refresh</span>
			{/if}
		</div>
	{/if}

	{@render children()}
</div>
