<script lang="ts">
	import type { ViewingSpot } from '$lib/types/domain.js';

	interface Props {
		onadd: (spot: ViewingSpot) => void;
		oncancel: () => void;
	}

	let { onadd, oncancel }: Props = $props();

	let name = $state('');
	let description = $state('');
	let lat = $state('');
	let lon = $state('');
	let lightPollution = $state<'low' | 'medium' | 'high'>('low');
	let access = $state('');

	function handleSubmit(e: Event) {
		e.preventDefault();

		const latNum = parseFloat(lat);
		const lonNum = parseFloat(lon);
		if (!name || isNaN(latNum) || isNaN(lonNum)) return;

		onadd({
			id: `user-${Date.now()}`,
			name,
			description,
			lat: latNum,
			lon: lonNum,
			lightPollution,
			access,
			userAdded: true
		});
	}
</script>

<form onsubmit={handleSubmit} class="flex flex-col gap-4 rounded-xl border border-night-700 bg-night-800 p-4">
	<h3 class="font-semibold text-snow-50">Add Viewing Spot</h3>

	<div>
		<label for="spot-name" class="mb-1 block text-xs text-snow-300">Name *</label>
		<input
			id="spot-name"
			bind:value={name}
			required
			class="w-full rounded-lg border border-night-600 bg-night-700 px-3 py-2 text-sm text-snow-50 placeholder-snow-300 focus:border-aurora-green focus:outline-none"
			placeholder="e.g. My Secret Spot"
		/>
	</div>

	<div>
		<label for="spot-desc" class="mb-1 block text-xs text-snow-300">Description</label>
		<input
			id="spot-desc"
			bind:value={description}
			class="w-full rounded-lg border border-night-600 bg-night-700 px-3 py-2 text-sm text-snow-50 placeholder-snow-300 focus:border-aurora-green focus:outline-none"
			placeholder="Brief description"
		/>
	</div>

	<div class="grid grid-cols-2 gap-3">
		<div>
			<label for="spot-lat" class="mb-1 block text-xs text-snow-300">Latitude *</label>
			<input
				id="spot-lat"
				bind:value={lat}
				type="number"
				step="any"
				required
				class="w-full rounded-lg border border-night-600 bg-night-700 px-3 py-2 text-sm text-snow-50 placeholder-snow-300 focus:border-aurora-green focus:outline-none"
				placeholder="69.65"
			/>
		</div>
		<div>
			<label for="spot-lon" class="mb-1 block text-xs text-snow-300">Longitude *</label>
			<input
				id="spot-lon"
				bind:value={lon}
				type="number"
				step="any"
				required
				class="w-full rounded-lg border border-night-600 bg-night-700 px-3 py-2 text-sm text-snow-50 placeholder-snow-300 focus:border-aurora-green focus:outline-none"
				placeholder="18.95"
			/>
		</div>
	</div>

	<div>
		<label for="spot-light" class="mb-1 block text-xs text-snow-300">Light Pollution</label>
		<select
			id="spot-light"
			bind:value={lightPollution}
			class="w-full rounded-lg border border-night-600 bg-night-700 px-3 py-2 text-sm text-snow-50 focus:border-aurora-green focus:outline-none"
		>
			<option value="low">Low</option>
			<option value="medium">Medium</option>
			<option value="high">High</option>
		</select>
	</div>

	<div>
		<label for="spot-access" class="mb-1 block text-xs text-snow-300">Access Info</label>
		<input
			id="spot-access"
			bind:value={access}
			class="w-full rounded-lg border border-night-600 bg-night-700 px-3 py-2 text-sm text-snow-50 placeholder-snow-300 focus:border-aurora-green focus:outline-none"
			placeholder="e.g. 20 min drive from Tromsø"
		/>
	</div>

	<div class="flex gap-2">
		<button
			type="submit"
			class="flex-1 rounded-lg bg-aurora-green px-4 py-2 text-sm font-semibold text-night-900 hover:bg-aurora-green/90"
		>
			Add Spot
		</button>
		<button
			type="button"
			onclick={oncancel}
			class="rounded-lg border border-night-600 px-4 py-2 text-sm text-snow-300 hover:text-snow-50"
		>
			Cancel
		</button>
	</div>
</form>
