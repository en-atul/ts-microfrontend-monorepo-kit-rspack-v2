# Module Format Decisions

This document explains why different shared packages use different module formats.

## Summary

- `@repo/test-config` stays **CommonJS** (`.cjs` files, `"type": "commonjs"`).
- Build/runtime config packages (for example `@repo/rspack-config`) can use **ESM** where it
  provides value.

## Why `@repo/test-config` is CommonJS

Jest configuration is still most reliable with CommonJS in many setups:

- straightforward `module.exports` usage
- predictable `require.resolve(...)` behavior in setup/config files
- fewer ESM edge cases with `ts-jest` and Jest config loading

Because `@repo/test-config` is config-only, stability is preferred over strict format consistency.

## Why ESM may be used elsewhere

Packages consumed by modern build tooling can benefit from ESM:

- aligns with ESM-first app configs
- cleaner runtime interop with ESM toolchains
- easier future migration for build tooling

## Team rule of thumb

Use the format that matches the tool’s stable path:

- **Jest/test config**: prefer CommonJS unless there is a proven ESM need
- **Build/runtime config**: ESM is acceptable when consumers and tooling support it cleanly

## Revisit criteria

Revisit this decision only if:

1. Jest ecosystem support for ESM config in this repo becomes friction-free, and
2. migration can be validated with no regressions in local/CI test runs.
