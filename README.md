# Cliento

Cliento is a CRM frontend built with React, TypeScript, and Vite. It covers the core workflows for sales and customer operations teams: pipeline tracking, contact management, task coordination, billing, subscription checkout, and workspace administration.

## Features

- Authentication flows for sign up, sign in, password reset, and protected routes
- Dashboard with sales and activity summaries
- Deal management with list and detail views
- Contact management with contact details and notes
- Task management for follow-ups and team execution
- Pipeline management for configuring sales stages
- User management and role-based access control screens
- Billing, subscription, and Stripe checkout flows
- Mail integration and Google callback handling
- Responsive app shell with sidebar, topbar, and PWA install support

## Tech Stack

- React 19
- TypeScript
- Vite
- Material UI
- Redux Toolkit
- TanStack Query
- React Router
- Axios
- Stripe client SDK

## Getting Started

### Prerequisites

- Node.js 20+ recommended
- npm

### Install

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root and provide the values your backend and Stripe setup require:

```env
VITE_CLINTO_SERVER_BASE_URL=http://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/...
VITE_STRIPE_MOCK=false
```

Notes:

- `VITE_CLINTO_SERVER_BASE_URL` is used by the shared Axios client.
- `VITE_STRIPE_PUBLISHABLE_KEY` is required when Stripe mock mode is off.
- `VITE_STRIPE_PAYMENT_LINK` is optional if checkout is handled entirely by the backend.
- `VITE_STRIPE_MOCK=true` enables mock checkout behavior in the UI.

### Run Locally

```bash
npm run dev
```

The Vite dev server is configured with `--host`, so it is reachable on your local network as well.

## Available Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## App Areas

- Public marketing and pricing landing page
- Auth pages for onboarding and account recovery
- Dashboard
- Deals and deal details
- Contacts and contact details
- Tasks
- Billing and subscriptions
- Profile and settings
- User, mail, and pipeline administration

## Project Structure

```text
src/
  app/          Redux store setup
  common/       Shared UI primitives
  components/   Feature-specific UI
  hooks/        Data fetching and mutations
  layouts/      App shell
  pages/        Route-level pages
  routes/       Route guards and routing
  services/     API client
  types/        Shared TypeScript types
  utils/        Helpers
```

## Build

```bash
npm run build
```

This runs TypeScript project builds and then creates the production Vite bundle.
