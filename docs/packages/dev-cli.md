# `@repo/dev-cli`

> [!IMPORTANT] Build `@repo/dev-cli` before running any `pnpm dev-cli ...` command.
>
> ```bash
> pnpm --filter @repo/dev-cli build
> ```

## Why this package exists

`@repo/dev-cli` centralizes local code-quality checks so contributors use one consistent command
across the monorepo.

## What it provides

- `dev-cli lint`: runs ESLint + Prettier checks
- `--all`: checks all files instead of staged-only
- `--fix`: auto-fixes lint/format issues where possible

## Usage

Build before using the CLI (required because command modules are loaded from `dist/`):

```bash
pnpm --filter @repo/dev-cli build
```

Then run:

```bash
pnpm dev-cli lint
pnpm dev-cli lint --all
pnpm dev-cli lint --fix
```

## Notes

- Root `postinstall` currently builds this package automatically.
- If CLI sources change (`packages/dev-cli/src/**`), rebuild before using it.
