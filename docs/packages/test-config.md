# `@repo/test-config`

## Why this package exists

This package centralizes shared test runner configuration (Jest and rstest) to keep test setup
consistent and avoid duplicating config in each app.

## What it provides

Exports:

- `@repo/test-config/jest` -> base Jest config
- `@repo/test-config/jest-setup` -> shared Jest setup
- `@repo/test-config/rstest` -> shared rstest config

Scripts:

- `pnpm --filter @repo/test-config run test`
- `pnpm --filter @repo/test-config run test:rstest`

## Usage

Example host app test command pattern:

```bash
pnpm --filter @repo/test-config exec jest -c "$PWD/jest.config.cjs"
```

## Notes

- This package intentionally uses CommonJS (`.cjs`) for Jest compatibility and stability.
- Keep test framework dependencies here, not in the root package.
