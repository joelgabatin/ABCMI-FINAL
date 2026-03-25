# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ABCMI (Arise and Build For Christ Ministries Inc.) — a church website and admin management platform built with Next.js (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, and Supabase as the backend/auth provider.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test framework is configured in this project.

## Architecture

### Routing & Pages

Next.js App Router with file-based routing. Key route groups:

- `/app/(public pages)` — home, about, events, services, ministries, bible-reading, bible-study, counseling, donate, feedback, live, login, register, prayer-request, missions-training, pastoral-team, testimonies
- `/app/admin/*` — protected admin dashboard with ~20 sub-sections (members, events, prayers, donations, counseling, devotions, bible-study-groups, branches, permissions, feedback, live, settings, etc.)
- `/app/member/*` — member-facing portal
- `/app/api/chat` — AI chatbot API endpoint (uses Vercel AI SDK with OpenAI GPT-4o-mini)

### Authentication

Auth is **demo/mock only** — hardcoded users in `lib/auth-context.tsx` with localStorage for session persistence. Supabase is configured via env vars but the current auth layer does not use it. The `AuthContext` provider wraps the app via `app/layout.tsx`.

### Component Structure

- `/components/ui/` — shadcn/ui primitives (Radix UI based); configured via `components.json` (style: new-york, baseColor: neutral, icons: lucide-react)
- `/components/layout/` — Header, Footer, SiteLayout
- `/components/home/` — Landing page sections
- `/components/dashboard/` — Admin dashboard components
- `/components/chatbot/` — AI chatbot ("Grace") component
- `/lib/church-content.ts` — Static church data (mission, vision, history, service times, ministries)
- `/lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)

### Styling

Tailwind CSS v4 with custom church brand CSS variables defined in `app/globals.css`:

- `--church-primary`: `#2EA8DF` (cyan blue)
- `--church-primary-deep`: `#1D87BE`
- `--church-gold`: `#E7B93E`
- `--church-light-blue`: `#EAF7FC`
- `--church-soft-gray`: `#F5F7F9`

### Key Dependencies

- **Vercel AI SDK** (`ai`, `@ai-sdk/react`) — powers the church chatbot
- **react-hook-form + zod** — form handling and validation throughout the app
- **recharts** — charts/graphs in the admin dashboard
- **date-fns** — date manipulation
- **sonner** — toast notifications
- **next-themes** — dark mode support
- **embla-carousel-react** — carousels

### Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://hxeyrlacblbbfflfyqyb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_YTxEhBcYnpIt1WwmeEKtPw_qY-PakM1
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4ZXlybGFjYmxiYmZmbGZ5cXliIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA4MTYwOSwiZXhwIjoyMDg5NjU3NjA5fQ.SlRUHp8XfvCjaHjuuQdKB4SwWEnxaq03AgTWae3arns
DATABASE_URL=https://hxeyrlacblbbfflfyqyb.supabase.co
```


### Build Configuration

`next.config.mjs` has `typescript.ignoreBuildErrors: true` and `eslint.ignoreDuringBuilds: true` — TypeScript and ESLint errors do not block builds. The project uses Turbopack for the dev server.

### Path Aliases

`@/*` maps to the project root — use `@/components/...`, `@/lib/...`, `@/hooks/...` for imports.
