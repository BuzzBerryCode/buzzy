# BuzzBerry Modular Flow

Welcome to the BuzzBerry Modular Flow codebase! This project is organized for modular, scalable SaaS development with Next.js and Supabase.

## Documentation

All detailed documentation has been moved to the [`docs/`](./docs/) folder. Please refer to that directory for guides, integration notes, and migration instructions.

- [Onboarding Integration](./docs/ONBOARDING_INTEGRATION.md)
- [OAuth Setup Guide](./docs/OAUTH_SETUP_GUIDE.md)
- [Frontend Integration Summary](./docs/frontend-integration-summary.md)
- [Migration README](./docs/MIGRATION_README.md)

For project structure and best practices, see the [Project Structure & Modularity Guide](#project-structure--modularity-guide) below.

---

## Getting started

> **Prerequisites:**
> The following steps require [NodeJS](https://nodejs.org/en/) to be installed on your system, so please
> install it beforehand if you haven't already.

To get started with your project, you'll first need to install the dependencies with:

```
npm install
```

Then, you'll be able to run a development version of the project with:

```
npm run dev
```

After a few seconds, your project should be accessible at the address
[http://localhost:5173/](http://localhost:5173/)


If you are satisfied with the result, you can finally build the project for release with:

```
npm run build
```

# Project Structure & Modularity Guide

## Overview
This project uses a modular, feature-based folder structure to ensure scalability, maintainability, and smooth deployment on Vercel. This guide documents the structure, naming conventions, and best practices for current and future development.

---

## Folder Structure

```
app/
  auth/                # Authentication pages and logic
  onboarding/          # Onboarding flow
  dashboard/           # Main dashboard and subpages
    components/        # Dashboard-specific components
    analytics/         # (future) Analytics pages
    billing/           # (future) Billing pages
    ai-assistant/      # (future) AI assistant pages
  billing/             # (future) Billing UI and logic
  api/                 # API routes (Stripe, Gemini, etc.)
    billing/           # (future) Stripe webhooks, billing APIs
    ai-assistant/      # (future) Gemini/AI APIs
  components/          # Shared UI components
    ui/                # Reusable UI primitives (Button, Card, etc.)
  lib/                 # Shared utilities, Supabase client
  types/               # Shared TypeScript types (create if missing)
public/                # Static assets (images, videos, etc.)
```

---

## Best Practices

- **Feature Folders:** Group code by feature, not by type. Each major feature (auth, onboarding, dashboard, billing, etc.) gets its own folder.
- **Shared Code:** Place shared UI in `app/components/` and shared logic in `app/lib/`.
- **API Routes:** Keep feature-specific API routes in `app/api/feature/`.
- **Types:** Use `app/types/` for shared TypeScript types and interfaces.
- **Assets:** Store all static assets in the root `public/` directory for Vercel compatibility. Remove any duplicate or misplaced assets from `app/public/`.
- **Environment Variables:** Use `.env.local` for secrets and config. Never commit secrets.
- **Naming:** Use lowercase, hyphen-separated folder names for features. Use PascalCase for React components.
- **Testing:** Place tests in a `__tests__/` folder or alongside components as `Component.test.tsx`.
- **Documentation:** Update this guide as the project evolves.

---

## Adding New Features

1. **Create a new folder under `app/` or `app/dashboard/` for the feature.**
2. **Add UI components to a `components/` subfolder if needed.**
3. **Add API routes under `app/api/feature/` if backend logic is required.**
4. **Add shared types to `app/types/` if needed.**
5. **Document any new patterns or conventions in this README.**

---

## Example: Adding Billing (Stripe)

- UI: `app/billing/`, `app/dashboard/billing/`
- API: `app/api/billing/stripe-webhooks/route.ts`
- Shared logic: `app/lib/stripe.ts` (if needed)
- Types: `app/types/billing.ts`

---

## Example: Adding AI Assistant (Gemini)

- UI: `app/dashboard/ai-assistant/`
- API: `app/api/ai-assistant/route.ts`
- Shared logic: `app/lib/ai.ts` (if needed)
- Types: `app/types/ai.ts`

---

## Vercel Hosting
- This structure is fully compatible with Vercel.
- No custom server is needed.
- Use environment variables for secrets.

---

## Migration Checklist
- [ ] Move all static assets to the root `public/` directory.
- [ ] Create missing folders (`app/types/`, `app/billing/`, etc.) as needed.
- [ ] Refactor feature code into their respective folders.
- [ ] Remove unused or duplicate files.
- [ ] Update this documentation as the project evolves.

---

For any new feature or refactor, reference this guide to keep the codebase clean and modular.
