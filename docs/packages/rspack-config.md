# `@repo/rspack-config`

## Why this package exists

This package centralizes shared Rspack setup for host and all remotes, reducing duplication in each
app’s `rspack.config.js`.

## What it provides

Exports:

- `@repo/rspack-config/config` -> `getConfig(...)`
- `@repo/rspack-config/utils` -> helper utilities like `parseArgs(...)`

It merges:

- base/common config
- environment-specific config (development/production)
- app-level federation config passed from each app

## Usage

In app `rspack.config.js`:

```js
import { getConfig } from '@repo/rspack-config/config';
import { parseArgs } from '@repo/rspack-config/utils';
```

## Notes

- Keep only shared build behavior here.
- App-specific federation names/remotes/exposes stay in each app config.
- If this package changes and command resolution breaks, rebuild/install before running app builds.

## Module Federation dev fallback

For how **local-first remotes** and **deployed `remoteEntry.js` fallback** work at runtime, which
**environment variables** control them, and how the host **Environment Status** UI consumes
`__MF_REMOTE_RESOLUTION__`, see:

- [`module-federation-fallback-and-environment-status.md`](../module-federation-fallback-and-environment-status.md)
