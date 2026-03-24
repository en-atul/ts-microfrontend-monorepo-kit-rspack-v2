# `@repo/ui`

## Why we have this

`@repo/ui` hosts reusable React UI components shared across host/remotes, reducing UI duplication.

## What it provides

- Shared components (for example `Button`)
- Local component styling modules
- Common component contracts

## Usage

```ts
import Button from '@repo/ui/Button';
```

Then use in any app/remote component.

## Notes

- Keep generic reusable components here.
- Keep feature-specific screens/widgets in app-level code.
