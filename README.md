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
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` from Clerk
- `STRIPE_SECRET_KEY`, `STRIPE_PRO_PRICE_ID`, `STRIPE_PRO_YEARLY_PRICE_ID`, and `STRIPE_WEBHOOK_SECRET` for the monthly and yearly recurring GBP Pro prices

Set `role` to `admin` in a user's Clerk public metadata to allow that user to open `/admin` and manage posts, subscriptions, and accounts.

Send `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, and `invoice.payment_failed` to `/api/stripe/webhook`, and enable the Stripe Customer Portal. The webhook uses the private Vercel Blob store for durable event deduplication, so production billing requires that store.

Activate Stripe Tax, add the jurisdictions where the business is registered to collect tax, and assign the Pro product the appropriate digital-news/service tax code. Checkout calculates tax from the customer's location, collects tax IDs, and adds tax on top of the exclusive monthly and yearly prices.

Pro access follows `active`, `trialing`, and `past_due` subscriptions. `past_due` is the payment-recovery grace period and lasts until Stripe's retry policy moves the subscription to another status. `unpaid` customers lose Pro content access but keep Customer Portal access to recover billing. Complimentary access can also be granted in `/admin`, and Clerk Billing features with the slug `pro` are accepted. Preferences, bookmarks, and saved searches use the existing private Vercel Blob store.

Vercel calls `/api/cron` daily at 06:00 UTC. The endpoint inspects up to three article links per publisher, sends the qualifying batch to Gemini, validates the result, stores `avtldr/stories.json`, and revalidates the homepage. An edition is published only when 12–16 stories qualify; otherwise, the previous complete edition remains live. Each run also stores its filtering and selection counts in `avtldr/refresh-diagnostics.json`.

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
