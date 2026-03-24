# `@repo/typescript-config`

## Why we have this

This package is the single source of truth for TypeScript compiler settings across apps and
packages.

## What it provides

Reusable tsconfig presets:

- `base.json`
- `reactjs.json`
- `react-library.json`

## Usage

In a package/app `tsconfig.json`:

```json
{
	"extends": "@repo/typescript-config/reactjs.json"
}
```

or

```json
{
	"extends": "@repo/typescript-config/react-library.json"
}
```

## Notes

- Update shared compiler policy here first.
- Prefer per-package overrides only for justified edge cases.
