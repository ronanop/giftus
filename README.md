# Giftus

Premium personalized gift registries for India — baby showers, weddings, and celebrations.

## Stack
- **Next.js** (App Router) → deploy on **Vercel**
- **Neon Postgres** via `pg` + Drizzle + `attachDatabasePool` (Vercel Fluid)
- **Neon Object Storage** (S3-compatible) buckets: `public-assets`, `assets`

## Run locally
```bash
npm install
neon login   # if needed
neon deploy  # provisions + pulls .env.local
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Sample registry: [/r/aanya-baby-shower](http://localhost:3000/r/aanya-baby-shower)

## Env
Managed by Neon CLI into `.env.local` (`DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `AWS_*`). Also set `AUTH_SECRET`.

## Product flows
- **Owner:** signup → create registry → photos (Neon upload), unlimited gift links, UPI funds
- **Guest:** open link → gift confirm / iOS-first UPI (QR + GPay/PhonePe/Paytm + copy)
