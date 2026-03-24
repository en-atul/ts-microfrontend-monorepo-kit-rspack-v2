# `@repo/ecommerce-core`

## Why this package exists

`@repo/ecommerce-core` holds shared e-commerce domain logic used by host and remotes, so
state/events/types stay consistent across microfrontends.

## What it provides

- Typed event bus (`emitEvent`, `onEvent`)
- Shared Zustand store (`useEcomStore`) for cart + auth
- Product catalog helpers (`products`, lookup functions)
- Shared domain types (`Product`, `CartItem`, event map, etc.)

## Usage

```ts
import { useEcomStore, emitEvent, products } from '@repo/ecommerce-core';
```

Typical usage patterns:

- Read/update cart and auth state from `useEcomStore`
- Emit cross-MFE events via `emitEvent`
- Share product/type contracts across remotes

## Notes

- Auth/cart persistence is handled in-store (localStorage-backed via Zustand persist).
- Keep cross-app event names and payloads typed here.
