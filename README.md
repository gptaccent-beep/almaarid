# ALMAARID

Moroccan cooperative digital showroom built with Next.js App Router, React, TypeScript, Tailwind, Framer Motion, GSAP, React Query, next-intl, and a local SQLite fallback with Supabase support.

## Run locally

```bash
npm install
npm run dev
```

Open the public site at `/ar/ALMAARID`.

## Admin

Admin route: append `0` to the site name in the URL, for example `/ar/ALMAARID0`.

The admin dashboard can edit the site name, logo, regions, cooperative slots, copy, images, and contact info without touching code. Configure private admin credentials with `ADMIN_IDENTITY`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` in your environment.

## Data

Default local mode uses SQLite in `data/almaarid.sqlite` and seeds:

- 12 Moroccan regions
- 20 cooperative slots per region

Seed manually:

```bash
npm run seed
```

## Supabase

Set these environment variables to use Supabase instead of local SQLite:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET` (optional, defaults to `almaarid`)

Run `supabase/schema.sql` first.

## Notes

- Arabic is the default locale.
- The selected language persists across navigation and reloads.
- Theme choice persists in local storage.
- Intro playback is shown once per session and can be replayed from the logo.
