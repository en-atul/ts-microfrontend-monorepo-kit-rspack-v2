# Contributing

Thanks for your interest in contributing.

## Development Setup

1. Use Node.js `>=22` and pnpm `>=9`.
2. Install dependencies:

```bash
pnpm install
```

3. Start all apps:

```bash
pnpm dev
```

## Project Structure

- `apps/host`: router-driven host shell
- `apps/remotes/*`: independently deployable microfrontends
- `packages/ecommerce-core`: shared products, events, Zustand store, and types
- `packages/styles`: shared UI styling tokens/classes
- `packages/rspack-config`: shared build configuration

## Contribution Flow

1. Fork and create a branch from `main`.
2. Keep PRs small and focused (one feature/fix at a time).
3. Add or update docs when behavior changes.
4. Verify before opening PR:

```bash
pnpm lint
pnpm build
```

## Coding Guidelines

- Prefer TypeScript and keep types explicit for shared contracts.
- For cross-MFE communication, use typed events from `@repo/ecommerce-core`.
- Keep shared state logic in `@repo/ecommerce-core` (avoid duplicating global state per app).
- Reuse shared styles from `@repo/styles` for consistent UI.
- Use environment-driven URLs for deployed federation remotes.

## Deployment Notes

- Deploy each app as a separate Vercel project.
- Deploy remotes first, then host.
- If remote chunks fail after deploy, hard refresh to clear stale cache.

## Pull Request Checklist

- [ ] Code is formatted and linted
- [ ] Build succeeds locally
- [ ] README/Contributing docs updated if needed
- [ ] No unrelated changes included
