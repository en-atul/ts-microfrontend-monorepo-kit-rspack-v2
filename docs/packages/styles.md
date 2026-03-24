# `@repo/styles`

## Why this package exists

`@repo/styles` provides a shared visual foundation (variables and utility classes) so host and
remotes look consistent.

## What it provides

- `@repo/styles/global.css` with:
  - theme tokens (colors, spacing)
  - shared layout/shell classes
  - reusable UI helper classes

## Usage

Import once in app entrypoint (host/remotes):

```ts
import '@repo/styles/global.css';
```

## Notes

- Keep cross-app styles here.
- Keep one-off component styles in local app/package styles.
