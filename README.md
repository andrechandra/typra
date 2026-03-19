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

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/)
- A [Supabase](https://supabase.com/) project

### 1. Clone the repo

```bash
git clone https://github.com/your-username/typra.git
cd typra
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file at the project root with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up the database

Run the following SQL in your Supabase SQL editor to create the required tables:

```sql
-- User profiles
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  default_anonymous boolean default false,
  created_at timestamp with time zone default now()
);

-- Journal entries
create table entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  content text not null,
  is_public boolean default false,
  is_anonymous boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- User settings
create table settings (
  id uuid references auth.users on delete cascade primary key,
  username_last_changed timestamp with time zone,
  created_at timestamp with time zone default now()
);
```

Enable Row Level Security (RLS) on all tables and add appropriate policies so users can only read and write their own data.

### 5. Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/                    # Next.js App Router pages and layouts
├── (protected)/        # Auth-gated routes (write, my-entries, settings)
├── forum/              # Public community entries
├── login/ signup/      # Auth pages
components/
├── ui/                 # shadcn/ui components (Radix UI + Tailwind)
├── entries/            # Entry display (EntryCard, ProfileEntries, EntriesList)
├── writing/            # Editor and save dialog
actions/                # Next.js Server Actions ('use server')
hooks/                  # use-autosave, use-typewriter-sound
lib/                    # cn() utility, fonts, Supabase clients
```

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server at localhost:3000 |
| `pnpm build` | Build for production |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix ESLint errors + format with Prettier |
| `pnpm format` | Format with Prettier |
| `pnpm test` | Run Jest tests |

## Contributing

Contributions are welcome. Please open an issue before submitting a large PR so we can discuss the approach first.

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, etc.)
4. Open a pull request

## License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. See [LICENSE](LICENSE) for the full text.

In plain terms: you are free to use, study, and modify this code. If you deploy a modified version publicly, you must release your source code under the same license. You may not use this code in a closed-source product or service.
