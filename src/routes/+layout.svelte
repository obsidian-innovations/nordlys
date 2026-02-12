<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/ui/Header.svelte';
	import BottomNav from '$lib/components/ui/BottomNav.svelte';
	import OfflineBanner from '$lib/components/ui/OfflineBanner.svelte';
	import { getForecastStore } from '$lib/stores/forecast.svelte.js';

	let { children } = $props();

	const forecast = getForecastStore();
</script>

<svelte:head>
	<title>Nordlys — Aurora Tracker</title>
	<meta name="description" content="Aurora borealis tracker for Tromsø, Norway" />
</svelte:head>

<div class="flex min-h-svh flex-col">
	<Header lastUpdated={forecast.lastUpdated} loading={forecast.loading} />
	<OfflineBanner />

	<main class="flex-1 pb-20">
		{@render children()}
	</main>

	<BottomNav />
</div>
