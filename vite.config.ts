import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		SvelteKitPWA({
			kit: {
				spa: true
			},
			strategies: 'generateSW',
			manifest: {
				name: 'Nordlys — Aurora Tracker',
				short_name: 'Nordlys',
				description: 'Aurora borealis tracker for Tromsø, Norway',
				theme_color: '#0a0e1a',
				background_color: '#0a0e1a',
				display: 'standalone',
				orientation: 'portrait',
				categories: ['weather', 'travel'],
				icons: [
					{
						src: '/icon-192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/icon-512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					}
				]
			},
			workbox: {
				globPatterns: ['client/**/*.{js,css,html,png,svg,woff2}'],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/services\.swpc\.noaa\.gov\/.*/i,
						handler: 'StaleWhileRevalidate',
						options: {
							cacheName: 'noaa-api',
							expiration: {
								maxEntries: 20,
								maxAgeSeconds: 30 * 60 // 30 minutes
							}
						}
					},
					{
						urlPattern: /^https:\/\/api\.met\.no\/.*/i,
						handler: 'NetworkFirst',
						options: {
							cacheName: 'met-norway-api',
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 // 1 hour
							},
							networkTimeoutSeconds: 5
						}
					},
					{
						urlPattern: /^https:\/\/api\.maptiler\.com\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'map-tiles',
							expiration: {
								maxEntries: 500,
								maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
							}
						}
					}
				]
			}
		})
	]
});
