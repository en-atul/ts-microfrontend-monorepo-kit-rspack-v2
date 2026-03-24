# `@repo/rspack-config`

## Why we have this

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
