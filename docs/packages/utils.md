# `@repo/utils`

## Why we have this

This package is for shared non-UI helper functions that multiple apps/packages may need.

## What it provides

- Generic utility helpers (currently minimal, e.g. `pathUtils` placeholder)

## Usage

```ts
import { toCall } from '@repo/utils/src/pathUtils';
```

(As utilities are formalized, prefer stable exported entrypoints.)

## Notes

- Keep functions pure and generic.
- Avoid adding domain-specific business logic here; keep that in domain packages (like
  `@repo/ecommerce-core`).
