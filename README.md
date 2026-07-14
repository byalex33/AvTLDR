# AvTLDR.news

A once-daily global aviation briefing built with Next.js, shadcn/ui, Firecrawl, Gemini, and Vercel Blob.

## Local development

```bash
npm install
npm run dev
```

The app uses the bundled preview edition when external services are not configured.

## Production configuration

Copy `.env.example` to `.env.local` and provide:

- `FIRECRAWL_API_KEY`
- `GEMINI_API_KEY`
- `CRON_SECRET`
- `BLOB_READ_WRITE_TOKEN` from a Vercel Blob store
- `RESEND_API_KEY` with full access for contact-form delivery and newsletter signups

Vercel calls `/api/cron` daily at 06:00 UTC. The endpoint scrapes a capped set of publisher pages, sends one batch to Gemini, validates the result, stores `avtldr/stories.json`, and revalidates the homepage.

## Checks

```bash
npm test
npm run lint
npm run build
```
