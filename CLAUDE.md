# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nordlys is an aurora borealis tracker PWA for Tromsø, Norway. It's a SvelteKit SPA (no SSR) that fetches real-time space weather from NOAA SWPC and local weather from MET Norway, combines them into a 0-100 aurora visibility score, and displays the result in a mobile-first dark UI.

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build (static adapter, outputs to `build/`)
- `npm run check` — Svelte type checking
- `npm run lint` — prettier + eslint
- `npm run format` — auto-format with prettier
- `npm run test` — run vitest (unit tests in `tests/unit/`)
- `npx vitest run tests/unit/aurora.test.ts` — run a single test file

## Architecture

**SPA with static adapter** — SSR is disabled (`src/routes/+layout.ts` sets `ssr = false`). Built with `@sveltejs/adapter-static`, fallback to `200.html`. Deployed to GitHub Pages at `/nordlys` base path (dev uses `/`).

**Data flow:**
1. **Services** (`src/lib/services/`) fetch from external APIs — `noaa.ts` (KP index, solar wind, ovation), `met-norway.ts` (weather forecast), `geolocation.ts` (browser position)
2. **Forecast store** (`src/lib/stores/forecast.svelte.ts`) orchestrates fetches via `Promise.allSettled`, updates Svelte 5 `$state` runes, and calls `calculateAuroraScore()` to produce the composite score
3. **Components** read from the store and render cards/gauges

**Aurora scoring** (`src/lib/services/aurora.ts`): Composite score from KP contribution (0-40), cloud cover penalty (0 to -40), solar wind Bz bonus (0-20), gated by solar elevation < -6°. The `getSolarElevation()` utility in `src/lib/utils/sun.ts` handles the astronomy.

**State management:** Svelte 5 runes (`$state`) for ephemeral data. `svelte-persisted-state` for user settings and user-added spots (stored in localStorage). IndexedDB cache (`src/lib/utils/cache.ts`) for API responses.

**PWA:** `@vite-pwa/sveltekit` with workbox runtime caching — NOAA gets StaleWhileRevalidate (30min), MET Norway gets NetworkFirst (1hr timeout 5s), MapTiler tiles get CacheFirst (7 days).

## Key Conventions

- **Svelte 5** — uses `$state`, `$props`, `$derived` runes (not legacy stores/reactivity)
- **Tailwind CSS v4** — custom theme tokens defined in `src/app.css` under `@theme` (aurora-*, night-*, snow-*, score-*)
- **TypeScript strict mode** — API response types in `src/lib/types/api.ts`, domain types in `src/lib/types/domain.ts`
- **Prettier** — tabs, single quotes, no trailing commas, 100 char width, svelte parser
- **Stores expose getter functions** — pattern is `getForecastStore()` / `getSettingsStore()` / `getSpotsStore()` returning objects with reactive getters

## Environment

`VITE_MAPTILER_KEY` — required for MapLibre GL map tiles. Set in `.env` locally, in GitHub Actions secrets for deploy.
