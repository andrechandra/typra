# Typra

A minimalist, typewriter-inspired journaling app built for reflection and personal writing. Write privately, share publicly, and connect with a community of writers — all with the feel of a real typewriter.

## Features

- **Typewriter experience** — monospace editor with optional soft keystroke sounds and paper texture
- **Private by default** — your entries stay yours unless you choose to share
- **Community forum** — browse and connect through public entries from other writers
- **Anonymous posting** — share publicly without revealing your identity
- **Dark / light mode** — warm paper light theme and deep charcoal dark theme
- **Autosave** — never lose a draft

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router) + [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/) (strict mode)
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/) — auth + PostgreSQL database
- [Framer Motion](https://www.framer.com/motion/) — animations
- [Sonner](https://sonner.emilkowal.ski/) — toast notifications

## Open Source

Typra is free and open source. You're welcome to explore the code, learn from it, contribute, or self-host your own instance. Contributions are welcome — please open an issue before submitting a large PR so we can discuss the approach first.

# Contributing

Thanks for your interest in contributing! 🚀

## How to contribute
- Fork the repo
- Create a new branch
- Make your changes
- Submit a pull request

## Rules
- Follow the existing code style
- Write clear commit messages
- Keep code clean and modular

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server at localhost:3000 |
| `pnpm build` | Build for production |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix ESLint errors + format with Prettier |
| `pnpm format` | Format with Prettier |
| `pnpm test` | Run Jest tests |

## License

Typra is provided freelly as open source project, under the **GNU General Public License v3.0 (GPL-3.0)**. See [LICENSE](LICENSE) for the full text.
