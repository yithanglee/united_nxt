# United v3

Frontend application for PMC Library, built with **React**, **Vite**, and **TanStack Router**, communicating with the **Phoenix (Elixir)** API server.

## Features

- **Blazing Fast**: Replaced Next.js with Vite for near-instant HMR and sub-second production builds.
- **Low Resource Usage**: Pure client-side SPA with zero server memory footprint, perfect for Cloudflare Pages.
- **Type-Safe Routing**: Powered by `@tanstack/react-router`.
- **Cloudflare Pages Ready**: Includes `functions/api/verify-turnstile.ts` and `public/_redirects` for SPA fallback.

## Getting Started

### Development Server

Run the Vite development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
```

The output bundle will be generated in `dist/`.

### Preview Production Build Locally

```bash
npm run preview
```

## Cloudflare Pages Deployment

1. Connect the repository to Cloudflare Pages.
2. Configure build settings:
   - **Framework preset**: None / Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. Environment variables (set in Cloudflare Pages dashboard):
   - `NEXT_PUBLIC_HTTP_PROTOCOL`: e.g. `https://`
   - `NEXT_PUBLIC_ENDPOINT`: Phoenix server host/domain
   - `NEXT_PUBLIC_WS_PROTOCOL`: `wss://`
   - `NEXT_PUBLIC_COOKIE`: `united3`
   - `NEXT_PUBLIC_FIREBASE_*` config values
