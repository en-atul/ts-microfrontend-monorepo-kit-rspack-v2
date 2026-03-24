# `@repo/eslint-config`

## Why we have this

This package keeps linting rules centralized so all apps/packages follow the same baseline
conventions.

## What it provides

Exports:

- `@repo/eslint-config/base`
- `@repo/eslint-config/react`
- `@repo/eslint-config/react-internal`

`base` includes core JS/TS linting + prettier compatibility.

## Usage

In package/app eslint config:

```js
import { reactJsConfig } from '@repo/eslint-config/react';

export default reactJsConfig(import.meta.dirname);
```

Or use shared base via ESLint CLI:

```bash
pnpm eslint --config packages/eslint-config/base.js "src/**/*.{ts,tsx}"
```

## Notes

- Keep shared rule policy changes in this package.
- App-specific exceptions should stay local to the app/package config.
