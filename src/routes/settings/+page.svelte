<script lang="ts">
	import { getSettingsStore } from '$lib/stores/settings.svelte.js';
	import { getCurrentPosition } from '$lib/services/geolocation.js';

	const settings = getSettingsStore();

	let mapTilerKey = $state(settings.current.mapTilerKey);
	let kpThreshold = $state(settings.current.kpThreshold);

	let locName = $state(settings.current.location?.name ?? '');
	let locLat = $state(settings.current.location?.lat ?? '');
	let locLon = $state(settings.current.location?.lon ?? '');
	let locating = $state(false);
	let locError = $state('');

	let searchQuery = $state('');
	let searchResults = $state<{ name: string; lat: number; lon: number }[]>([]);
	let searching = $state(false);
	let searchTimeout: ReturnType<typeof setTimeout>;

	function onSearchInput() {
		clearTimeout(searchTimeout);
		searchResults = [];
		if (searchQuery.length < 2 || !settings.current.mapTilerKey) return;
		searchTimeout = setTimeout(() => searchPlaces(), 350);
	}

	async function searchPlaces() {
		searching = true;
		try {
			const key = settings.current.mapTilerKey;
			const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(searchQuery)}.json?key=${key}&limit=5`;
			const res = await fetch(url);
			if (!res.ok) throw new Error('Search failed');
			const data = await res.json();
			searchResults = (data.features ?? []).map(
				(f: { place_name: string; center: [number, number] }) => ({
					name: f.place_name,
					lat: f.center[1],
					lon: f.center[0]
				})
			);
		} catch {
			searchResults = [];
		} finally {
			searching = false;
		}
	}

	function selectSearchResult(result: { name: string; lat: number; lon: number }) {
		locName = result.name;
		locLat = +result.lat.toFixed(4);
		locLon = +result.lon.toFixed(4);
		searchQuery = '';
		searchResults = [];
	}

	function saveMapTilerKey() {
		settings.update({ mapTilerKey });
	}

	function saveKpThreshold() {
		settings.update({ kpThreshold });
	}

	async function useCurrentLocation() {
		locating = true;
		locError = '';
		const pos = await getCurrentPosition();
		locLat = +pos.lat.toFixed(4);
		locLon = +pos.lon.toFixed(4);
		if (!locName) locName = 'My Location';
		locating = false;
	}

	function saveLocation() {
		locError = '';
		const lat = Number(locLat);
		const lon = Number(locLon);
		if (isNaN(lat) || lat < -90 || lat > 90) {
			locError = 'Latitude must be between -90 and 90';
			return;
		}
		if (isNaN(lon) || lon < -180 || lon > 180) {
			locError = 'Longitude must be between -180 and 180';
			return;
		}
		settings.setLocation({ lat, lon, name: locName || 'Home' });
	}

	function clearLocation() {
		settings.clearLocation();
		locName = '';
		locLat = '';
		locLon = '';
		locError = '';
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
				<a
					href="https://cloud.maptiler.com"
					target="_blank"
					rel="noopener"
					class="text-aurora-green underline"
				>
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

		<!-- Home Location -->
		<div class="rounded-xl border border-night-700 bg-night-800 p-4">
			<h2 class="mb-1 text-sm font-medium text-snow-50">Home Location</h2>
			<p class="mb-3 text-xs text-snow-300">
				Set your location to center the map. Defaults to Tromsø when not set.
			</p>

			{#if settings.current.location}
				<p class="mb-3 text-xs text-aurora-green">
					{settings.current.location.name} ({settings.current.location.lat.toFixed(4)}, {settings.current.location.lon.toFixed(
						4
					)})
				</p>
			{/if}

			<div class="flex flex-col gap-2">
				<div class="relative">
					<input
						type="text"
						bind:value={searchQuery}
						oninput={onSearchInput}
						placeholder="Search for a place…"
						disabled={!settings.current.mapTilerKey}
						class="w-full rounded-lg border border-night-600 bg-night-700 px-3 py-2 text-sm text-snow-50 placeholder-snow-300 focus:border-aurora-green focus:outline-none disabled:opacity-50"
					/>
					{#if searching}
						<p class="mt-1 text-xs text-snow-300">Searching…</p>
					{/if}
					{#if searchResults.length > 0}
						<ul
							class="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-night-600 bg-night-700 shadow-lg"
						>
							{#each searchResults as result}
								<li>
									<button
										onclick={() => selectSearchResult(result)}
										class="w-full px-3 py-2 text-left text-sm text-snow-50 hover:bg-night-600"
									>
										{result.name}
									</button>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
				<input
					type="text"
					bind:value={locName}
					placeholder="Name (e.g. Home, My Cabin)"
					class="rounded-lg border border-night-600 bg-night-700 px-3 py-2 text-sm text-snow-50 placeholder-snow-300 focus:border-aurora-green focus:outline-none"
				/>
				<div class="flex gap-2">
					<input
						type="number"
						bind:value={locLat}
						placeholder="Latitude"
						step="any"
						class="flex-1 rounded-lg border border-night-600 bg-night-700 px-3 py-2 text-sm text-snow-50 placeholder-snow-300 focus:border-aurora-green focus:outline-none"
					/>
					<input
						type="number"
						bind:value={locLon}
						placeholder="Longitude"
						step="any"
						class="flex-1 rounded-lg border border-night-600 bg-night-700 px-3 py-2 text-sm text-snow-50 placeholder-snow-300 focus:border-aurora-green focus:outline-none"
					/>
				</div>

				{#if locError}
					<p class="text-xs text-score-storm">{locError}</p>
				{/if}

				<div class="flex gap-2">
					<button
						onclick={useCurrentLocation}
						disabled={locating}
						class="flex-1 rounded-lg border border-night-600 bg-night-700 px-3 py-2 text-sm text-snow-50 hover:border-aurora-green disabled:opacity-50"
					>
						{locating ? 'Locating…' : 'Use Current Location'}
					</button>
					<button
						onclick={saveLocation}
						class="rounded-lg bg-aurora-green px-4 py-2 text-sm font-semibold text-night-900 hover:bg-aurora-green/90"
					>
						Save
					</button>
				</div>

				{#if settings.current.location}
					<button
						onclick={clearLocation}
						class="text-left text-xs text-snow-300 hover:text-score-storm"
					>
						Reset to default (Tromsø)
					</button>
				{/if}
			</div>
		</div>

		<!-- About -->
		<div class="rounded-xl border border-night-700 bg-night-800 p-4">
			<h2 class="mb-2 text-sm font-medium text-snow-50">About Nordlys</h2>
			<p class="text-xs text-snow-300">
				Aurora visibility tracker for Tromsø, Norway. Combines NOAA space weather data with MET
				Norway cloud cover forecasts to tell you if tonight is worth going out.
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
					locName = '';
					locLat = '';
					locLon = '';
					locError = '';
					searchQuery = '';
					searchResults = [];
				}
			}}
			class="text-sm text-snow-300 hover:text-score-storm"
		>
			Reset all settings
		</button>
	</div>
</div>
