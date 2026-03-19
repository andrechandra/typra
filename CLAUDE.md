# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (localhost:3000)
pnpm build        # Build for production
pnpm lint         # Run ESLint
pnpm lint:fix     # ESLint fix + Prettier format
pnpm format       # Format with Prettier
pnpm test         # Run Jest tests
```

## Architecture

**Stack:** Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui

### Directory Layout

- `app/` — Next.js App Router pages and layouts
- `components/ui/` — shadcn/ui components (Radix UI primitives + Tailwind)
- `components/` — App-level components (ThemeProvider, ThemeToggle, Footer)
- `lib/` — Utilities (`cn()` from clsx + tailwind-merge, fonts)
- `constants/` — Site-wide config/metadata
- `styles/globals.css` — Tailwind imports + CSS variable theme tokens

### Key Patterns

**Client vs Server Components:** App Router defaults to Server Components. Client components (`ThemeProvider`, `ThemeToggle`, `ComponentGrid`) are marked with `'use client'`.

**Styling:** Use the `cn()` utility from `@/lib/utils` for all className composition. Theme colors are CSS variables (`--background`, `--foreground`, etc.) defined in `globals.css` with separate light/dark blocks.

**shadcn/ui components:** Components live in `components/ui/`. Add new ones via `pnpm dlx shadcn@latest add <component>`. They use `class-variance-authority` (CVA) for variant definitions and the `asChild` pattern (Radix Slot) for polymorphic rendering.

**Button component** (`components/ui/button.tsx`) is notably extended beyond standard shadcn — it supports `leftIcon`/`rightIcon` props with animation variants (`slide`, `bounce`, `fade`, `scale`), a `loading` state, and external link handling.

**Imports:** Use `@/` for all internal imports (maps to project root).

## Conventions

- **Commits:** Conventional commits enforced by CommitLint (`feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`)
- **Formatting:** No semicolons, single quotes, 2-space indent, trailing commas (ES5) — Prettier enforced on pre-commit
- **TypeScript:** Strict mode; prefer `interface` over `type`; avoid `any`
- **ESLint:** `--max-warnings=0` on pre-commit (zero warnings allowed)
