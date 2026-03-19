# Contributing to Typra

Thank you for your interest in contributing! Typra is an open source project and all contributions — bug fixes, new features, documentation improvements, or feedback — are welcome.

Please take a few minutes to read through this guide before opening a pull request. It helps keep the codebase consistent and makes reviews faster for everyone.

---

## Table of Contents

- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Reporting Issues](#reporting-issues)

---

## Development Workflow

### Setup

Follow the [Getting Started](README.md#getting-started) section in the README to clone the repo, install dependencies, and configure your environment.

### Branch Naming

Create a new branch from `main` using one of these prefixes:

| Prefix | When to use |
|--------|------------|
| `feature/` | New features or enhancements |
| `fix/` | Bug fixes |
| `chore/` | Maintenance tasks (deps, config, tooling) |
| `docs/` | Documentation changes only |

**Examples:**

```bash
git checkout -b feature/anonymous-toggle
git checkout -b fix/autosave-debounce
git checkout -b docs/update-readme
```

### Typical Workflow

```bash
# 1. Create your branch
git checkout -b feature/your-feature-name

# 2. Make your changes and commit often
git add <files>
git commit -m "feat: describe your change"

# 3. Keep your branch up to date
git fetch origin
git rebase origin/main

# 4. Push and open a PR
git push origin feature/your-feature-name
```

---

## Coding Standards

### Project Structure

Follow the existing folder layout. Place new code in the appropriate directory:

- **Pages / routes** → `app/`
- **Reusable UI primitives** → `components/ui/`
- **Feature components** → `components/<feature>/`
- **Server Actions** → `actions/`
- **Custom hooks** → `hooks/`
- **Utilities** → `lib/`

### Styling

- Use the `cn()` utility from `@/lib/utils` for all `className` composition
- Use Tailwind utility classes — avoid inline styles
- Theme colors are defined as CSS variables in `styles/globals.css`; reference them via Tailwind (e.g. `bg-background`, `text-foreground`)

### TypeScript

- Strict mode is enabled — all code must type-check cleanly
- Prefer `interface` over `type` for object shapes
- Never use `any`; use `unknown` and narrow the type if needed

### Formatting

Prettier and ESLint are enforced automatically on pre-commit via Husky. To run them manually:

```bash
pnpm lint        # Check for ESLint issues
pnpm lint:fix    # Auto-fix ESLint + format with Prettier
pnpm format      # Format only
```

Rules at a glance: no semicolons, single quotes, 2-space indent, trailing commas (ES5).

**Zero ESLint warnings are allowed** — the pre-commit hook will block commits with warnings.

### Components

- Keep components small and focused on a single responsibility
- Extract reusable logic into custom hooks in `hooks/`
- Use the `asChild` / Radix Slot pattern for polymorphic rendering where applicable
- Use the custom `Button` component from `components/ui/button.tsx` — it supports `leftIcon`, `rightIcon`, `loading`, and animation variants

---

## Commit Guidelines

This project enforces [Conventional Commits](https://www.conventionalcommits.org/) via CommitLint. Every commit message must follow this format:

```
<type>: <short description>
```

### Allowed types

| Type | When to use |
|------|------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace (no logic change) |
| `refactor` | Code restructure without behavior change |
| `test` | Adding or updating tests |
| `chore` | Build process, dependencies, config |
| `perf` | Performance improvement |
| `ci` | CI/CD pipeline changes |
| `build` | Build system changes |
| `revert` | Reverting a previous commit |

### Examples

```bash
feat: add anonymous toggle to save dialog
fix: correct autosave debounce timing
docs: update database setup instructions
refactor: extract entry validation into hook
chore: update dependencies
```

---

## Pull Request Guidelines

- **Title:** Use the same conventional commit format as your commit messages
- **Description:** Explain what changed, why it was needed, and how it was implemented
- **Scope:** Keep PRs small and focused — one concern per PR. Large PRs are harder to review and more likely to introduce issues
- **Issues:** If your PR addresses an open issue, link it with `Closes #<issue-number>` in the description
- **Tests:** If you're adding new behavior, add or update tests where applicable

### PR description template

```markdown
## What
Brief description of the change.

## Why
The reason this change is needed.

## How
How the change was implemented (if non-obvious).

Closes #<issue-number>
```

> Open an issue and discuss the approach before starting work on a large feature or refactor. This avoids wasted effort if the direction doesn't align with the project goals.

---

## Reporting Issues

Use [GitHub Issues](https://github.com/andrechandra/typra/issues) to report bugs or request features.

### Bug reports

Include the following:

- **Steps to reproduce** — exact steps that trigger the bug
- **Expected behavior** — what should happen
- **Actual behavior** — what actually happens
- **Environment** — OS, browser, Node.js version

### Feature requests

Include the following:

- **Use case** — the problem you're trying to solve
- **Proposed solution** — how you'd like to see it addressed
- **Alternatives considered** — other approaches you thought about

---

Thank you for helping make Typra better!
