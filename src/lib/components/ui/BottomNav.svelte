<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';

	const navItems = [
		{ href: '/', label: 'Forecast', icon: 'forecast' },
		{ href: '/map', label: 'Map', icon: 'map' },
		{ href: '/spots', label: 'Spots', icon: 'spots' },
		{ href: '/settings', label: 'Settings', icon: 'settings' }
	] as const;

	function isActive(href: string): boolean {
		const fullPath = base + href;
		if (href === '/') return page.url.pathname === base || page.url.pathname === base + '/';
		return page.url.pathname.startsWith(fullPath);
	}
</script>

<nav
	class="fixed bottom-0 left-0 right-0 z-40 border-t border-night-700 bg-night-900/90 backdrop-blur-md"
	style="padding-bottom: var(--safe-area-bottom)"
>
	<div class="flex items-center justify-around py-2">
		{#each navItems as item}
			{@const active = isActive(item.href)}
			<a
				href="{base}{item.href}"
				class="flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors {active
					? 'text-aurora-green'
					: 'text-snow-300 hover:text-snow-100'}"
			>
				<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					{#if item.icon === 'forecast'}
						<path
							d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"
						/>
					{:else if item.icon === 'map'}
						<path
							d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
						/>
					{:else if item.icon === 'spots'}
						<path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
						<path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
					{:else if item.icon === 'settings'}
						<path
							d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z"
						/>
						<path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
					{/if}
				</svg>
				<span>{item.label}</span>
			</a>
		{/each}
	</div>
</nav>
