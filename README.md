# Typra

A minimalist, typewriter-inspired journaling app built for reflection and personal writing. Write privately, share publicly, and connect with a community of writers — all with the feel of a real typewriter.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [License](#license)

---

## Project Overview

Typra is a journaling web app that combines the intimate feel of a typewriter with the convenience of a modern web platform. Users can write entries that stay private by default, choose to share them publicly with or without their name, and browse a community forum of public writings from other users.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) + React 19 |
| Language | TypeScript (strict mode) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Database & Auth | [Supabase](https://supabase.com/) (PostgreSQL + Auth) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Notifications | [Sonner](https://sonner.emilkowal.ski/) |
| Deployment | [Vercel](https://vercel.com/) |

---

## Features

- **Create journal entries** — Write in a distraction-free typewriter editor with optional keystroke sounds
- **Public / private entries** — Entries are private by default; publish them to the community with one click
- **Anonymous posting** — Share entries publicly without revealing your username
- **Community forum** — Browse and read public entries from other writers at `/forum`
- **My Entries** — View and manage all your personal entries at `/my-entries`
- **User profiles & settings** — Update your username and preferences at `/settings`
- **Autosave** — Drafts are saved automatically so you never lose your work
- **Dark / light mode** — Switch between a warm paper theme and a deep charcoal theme

---

## Getting Started

### Prerequisites

- **Node.js v20+** — [Download](https://nodejs.org/)
- **pnpm** — Install with `npm install -g pnpm`
- **Supabase account** — [Sign up for free](https://supabase.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/andrechandra/typra.git
cd typra

# 2. Install dependencies
pnpm install
```

### Environment Variables

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Open `.env.local` and set the following values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Where to find these values:**

1. Go to your [Supabase dashboard](https://app.supabase.com/)
2. Open your project → **Settings** → **API**
3. Copy the **Project URL** and **anon / public** key

### Database Setup

Typra uses two SQL migrations to set up the schema. Run them in order using the Supabase SQL Editor:

1. Go to your Supabase project → **SQL Editor**
2. Open and run each file below in order:

**Migration 1** — `supabase/migrations/001_schema_update.sql`

Sets up anonymous posting support, a case-insensitive unique username index, the `settings` table, and row-level security policies.

**Migration 2** — `supabase/migrations/002_profiles_public_read.sql`

Enables the forum to display usernames by making the `profiles` table publicly readable.

> **Note:** Run migration 1 before migration 2. If you have existing entries with orphaned `user_id` values, the foreign key constraint in migration 1 will fail — clean those up first.

### Running the App

```bash
pnpm dev        # Start dev server at http://localhost:3000
pnpm build      # Build for production
pnpm start      # Serve the production build
pnpm lint       # Run ESLint
pnpm lint:fix   # Fix ESLint errors + format with Prettier
pnpm format     # Format with Prettier
pnpm test       # Run tests
```

---

## Project Structure

```
typra/
├── app/                    # Next.js App Router pages and layouts
│   ├── (auth)/             # Auth routes: /login, /signup, /verify-email
│   ├── (protected)/        # Protected routes: /write, /my-entries, /settings
│   ├── forum/              # Public community forum
│   └── layout.tsx          # Root layout (theme, toasts, analytics)
├── components/
│   ├── ui/                 # shadcn/ui base components (Button, Dialog, Input, etc.)
│   ├── entries/            # Entry display: EntryCard, EntriesList, MyEntries
│   ├── writing/            # Editor: TypewriterEditor, SaveDialog
│   ├── auth/               # Auth forms: LoginForm, SignupForm, CreateUsernameForm
│   ├── settings/           # SettingsForm
│   └── nav/                # SiteNav, NavLinks
├── actions/                # Next.js Server Actions ('use server')
├── hooks/                  # Custom hooks: use-autosave, use-typewriter-sound
├── lib/                    # Utilities: cn(), fonts, Supabase clients
├── constants/              # Site-wide config and metadata
├── styles/                 # globals.css — Tailwind imports + CSS theme tokens
└── supabase/
    └── migrations/         # SQL migration files
```

---

## Usage

1. **Sign up** at `/signup` and verify your email
2. **Set a username** on first login (required before writing)
3. **Write** a new entry at `/write`
4. **Save** the entry as private (default) or publish it publicly
5. **Toggle anonymous** to share without your name attached
6. **Browse** public entries from the community at `/forum`
7. **Manage** your entries at `/my-entries`
8. **Update** your username or preferences at `/settings`

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get started, branch naming, commit messages, and submitting pull requests.

---

## License

Typra is provided freelly as open source project, under the **GNU General Public License v3.0 (GPL-3.0)**. See [LICENSE](LICENSE) for the full text.
