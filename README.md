# Blackbox Assignment

A minimal Next.js app scaffolded for subscription management using Firebase Auth and Stripe checkout. This repository contains the frontend (Next.js app) and serverless API routes for creating Stripe checkout sessions and handling webhooks.

## Quick overview

- Framework: Next.js (App Router)
- Auth: Firebase Authentication
- Payments: Stripe (Checkout Sessions + Webhooks)
- Language: TypeScript
- Package manager: pnpm (lockfile present)

## Requirements

- Node.js (version compatible with the project's dependencies)
- pnpm (recommended) or npm/yarn
- A Stripe account and API keys
- A Firebase project and its client keys

## Environment variables

Create a `.env.local` in the project root with the following keys (used across the codebase):

- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- STRIPE_SECRET_KEY
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_PRICE_ANNUALLY
- STRIPE_PRICE_MONTHLY

(If any additional env vars are required by your deployment or added features, add them as needed.)

## Setup (local)

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Build for production:

```bash
pnpm build
```

Run production locally:

```bash
pnpm start
```

## Useful scripts

See `package.json` for the definitive list, but common scripts are:

- `dev` — start Next.js in development
- `build` — build the app
- `start` — start the built app
- `lint` / `format` — code checks and formatting

## Key files and locations

- `src/lib/firebase.ts` — Firebase initialization utilities
- `src/lib/constants.ts` — Pricing and other constants
- `src/app/api/stripe/create-checkout-session/route.ts` — API route to create Stripe checkout sessions
- `src/app/api/stripe/webhook/route.ts` — Stripe webhook handler
- `src/components/CheckoutPlan.tsx` — UI for selecting a plan and triggering checkout
- `src/app/dashboard/page.tsx` — User dashboard page
- `src/context/auth-context.ts` and `src/provider/auth-provider.tsx` — auth context/provider wiring

## Notes and assumptions

- The app uses the Next.js App Router and TypeScript. Please check `tsconfig.json` and `next.config.ts` for framework/runtime settings.
- The repo uses pnpm (see `pnpm-lock.yaml` and `pnpm-workspace.yaml`) but should work with npm/yarn with equivalent commands.
