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

Vercel calls `/api/cron` daily at 06:00 UTC. The endpoint inspects up to three article links per publisher, sends the qualifying batch to Gemini, validates the result, stores `avtldr/stories.json`, and revalidates the homepage. Each run also stores its filtering and selection counts in `avtldr/refresh-diagnostics.json`.

Authenticated maintenance modes:

```bash
# Generate and return a complete candidate edition without replacing live content.
curl -H "Authorization: Bearer $CRON_SECRET" "$SITE_URL/api/cron?dryRun=1"

# Read the most recently persisted refresh diagnostics.
curl -H "Authorization: Bearer $CRON_SECRET" "$SITE_URL/api/cron?diagnostics=1"
```

## Checks

```bash
npm test
npm run lint
npm run build
```
