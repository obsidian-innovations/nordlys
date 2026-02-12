<script lang="ts">
	let online = $state(typeof navigator !== 'undefined' ? navigator.onLine : true);

	$effect(() => {
		const setOnline = () => (online = true);
		const setOffline = () => (online = false);

		window.addEventListener('online', setOnline);
		window.addEventListener('offline', setOffline);

		return () => {
			window.removeEventListener('online', setOnline);
			window.removeEventListener('offline', setOffline);
		};
	});
</script>

{#if !online}
	<div class="bg-night-700 px-4 py-2 text-center text-xs text-snow-300">
		You're offline — showing cached data
	</div>
{/if}
