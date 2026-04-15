# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm run dev` (Vite, serves at localhost:5173)
- **Build:** `npm run build` (runs `tsc -b && vite build`)
- **Lint:** `npm run lint` (ESLint)
- **Preview prod build:** `npm run preview`

No test framework is configured.

## Architecture

This is a **Telegram Mini App** for a food delivery/pickup service (Zen Coffee, Nukus, Uzbekistan). It runs inside Telegram WebApp via `window.Telegram.WebApp` APIs. Built with React 19 + TypeScript + Vite.

### Routing & Screens

There is no router library. Navigation is state-driven via a `Screen` type (`"home" | "cart" | "notifications" | "profile" | "cashback" | "contact" | "about"`) managed in `src/index.tsx`. The `Index` component is the central orchestrator — it holds all top-level state (cart, menu, delivery mode, modals, etc.) and renders screens/modals conditionally.

### Key Files

- **`src/index.tsx`** — Main app shell. Manages screen state, cart logic, Telegram auth, menu fetching, order creation. This is a large file (~700 lines) that acts as the single "page" of the app.
- **`src/api/index.ts`** — Axios client hitting `https://zen-coffee.uz/api`. Auth token is set on the axios instance after Telegram authentication.
- **`src/telegram.ts`** — Telegram WebApp bridge: init data, photo URL, payment links.
- **`src/types/index.ts`** — All TypeScript interfaces (Product, Cart, Order, etc.).
- **`src/context/UserContext.tsx`** — React context for user profile and language preference.
- **`src/styles/index.ts`** — CSS-in-JS style objects (not CSS modules or Tailwind).
- **`src/data/constants.ts`** — Static data: supported languages, branch locations.

### Styling

Plain CSS (`src/App.css`, `src/index.css`) combined with inline style objects from `src/styles/index.ts`. Supports light/dark themes via localStorage. Mobile-first design.

### i18n

Uses `react-i18next` with four locales: Uzbek (`uz`, default), Russian (`ru`), English (`en`), Karakalpak (`kk`). Translation files are in `src/i18n/locales/`. Language syncs with the user's backend profile.

### Cart System

Cart uses a `Record<string, CartEntry>` keyed by product ID or `productId_modifierId-modifierId` for products with modifiers. Cart state lives in `src/index.tsx`.

### API / Backend

All API calls go through the axios instance in `src/api/index.ts`. Authentication happens via Telegram init data posted to `/auth/telegram/`. The JWT access token is stored on the axios instance's default headers.

### Maps

Uses `react-leaflet` for delivery address picking (`src/components/LocationPicker.tsx`). Reverse geocoding via Nominatim in `src/utils/geocode.ts`.
