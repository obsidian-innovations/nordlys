<script lang="ts">
	import { getSettingsStore } from '$lib/stores/settings.svelte.js';

	const settings = getSettingsStore();

	let mapTilerKey = $state(settings.current.mapTilerKey);
	let kpThreshold = $state(settings.current.kpThreshold);

	function saveMapTilerKey() {
		settings.update({ mapTilerKey });
	}

	function saveKpThreshold() {
		settings.update({ kpThreshold });
	}
</script>

<div class="mx-auto max-w-lg px-4 py-4">
	<h1 class="mb-6 text-lg font-bold text-snow-50">Settings</h1>

	<div class="flex flex-col gap-6">
		<!-- MapTiler API Key -->
		<div class="rounded-xl border border-night-700 bg-night-800 p-4">
			<label for="maptiler-key" class="mb-1 block text-sm font-medium text-snow-50">
				MapTiler API Key
			</label>
			<p class="mb-3 text-xs text-snow-300">
				Required for the map. Get a free key at
				<a href="https://cloud.maptiler.com" target="_blank" rel="noopener" class="text-aurora-green underline">
					cloud.maptiler.com
				</a>
			</p>
			<div class="flex gap-2">
				<input
					id="maptiler-key"
					type="text"
					bind:value={mapTilerKey}
					placeholder="Your MapTiler key"
					class="flex-1 rounded-lg border border-night-600 bg-night-700 px-3 py-2 text-sm text-snow-50 placeholder-snow-300 focus:border-aurora-green focus:outline-none"
				/>
				<button
					onclick={saveMapTilerKey}
					class="rounded-lg bg-aurora-green px-4 py-2 text-sm font-semibold text-night-900 hover:bg-aurora-green/90"
				>
					Save
				</button>
			</div>
		</div>

		<!-- KP Threshold -->
		<div class="rounded-xl border border-night-700 bg-night-800 p-4">
			<label for="kp-threshold" class="mb-1 block text-sm font-medium text-snow-50">
				KP Alert Threshold
			</label>
			<p class="mb-3 text-xs text-snow-300">
				Minimum KP index to highlight aurora activity. At Tromsø, KP 2+ is visible.
			</p>
			<div class="flex items-center gap-4">
				<input
					id="kp-threshold"
					type="range"
					min="1"
					max="9"
					step="1"
					bind:value={kpThreshold}
					oninput={saveKpThreshold}
					class="flex-1 accent-aurora-green"
				/>
				<span class="w-8 text-center text-lg font-bold tabular-nums text-snow-50">
					{kpThreshold}
				</span>
			</div>
		</div>

		<!-- About -->
		<div class="rounded-xl border border-night-700 bg-night-800 p-4">
			<h2 class="mb-2 text-sm font-medium text-snow-50">About Nordlys</h2>
			<p class="text-xs text-snow-300">
				Aurora visibility tracker for Tromsø, Norway. Combines NOAA space weather data with
				MET Norway cloud cover forecasts to tell you if tonight is worth going out.
			</p>
			<div class="mt-3 text-xs text-snow-300">
				<p>Data: NOAA SWPC, MET Norway</p>
				<p>Maps: MapTiler + MapLibre GL</p>
			</div>
		</div>

		<!-- Reset -->
		<button
			onclick={() => {
				if (confirm('Reset all settings to defaults?')) {
					settings.reset();
					mapTilerKey = '';
					kpThreshold = 3;
				}
			}}
			class="text-sm text-snow-300 hover:text-score-storm"
		>
			Reset all settings
		</button>
	</div>
</div>
