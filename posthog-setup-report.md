<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the DevEvent Next.js App Router project. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new): Initializes PostHog on the client side using the `posthog-js` SDK. Uses `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and routes all events through the `/ingest` reverse proxy. Enables error tracking via `capture_exceptions: true` and debug mode in development.
- **`next.config.ts`** (updated): Added reverse proxy rewrites for `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*` to route PostHog traffic through the Next.js server, improving ad-blocker resilience. Also added `skipTrailingSlashRedirect: true`.
- **`components/ExploreBtn.tsx`** (updated): Added `posthog.capture('explore_button_clicked')` inside the existing click handler.
- **`components/EventCard.tsx`** (updated): Added `'use client'` directive and a `handleClick` handler that calls `posthog.capture('event_card_clicked', { event_title, event_slug, event_location, event_date })` on every card click.
- **`components/Navbar.tsx`** (updated): Added `'use client'` directive and `posthog.capture('nav_link_clicked', { label, href })` on each navigation link.
- **`.env.local`** (new): Created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `explore_button_clicked` | User clicks the "Explore Now" button on the homepage to scroll to featured events | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks an event card to view its details; captures title, slug, location, and date | `components/EventCard.tsx` |
| `nav_link_clicked` | User clicks a navigation link in the top navbar; captures label and destination href | `components/Navbar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1592129)
- [Explore Button Clicks](/insights/H8jVFTf0) — Daily trend of homepage explore button clicks
- [Event Card Clicks](/insights/dJ21hb53) — Daily trend of event card clicks
- [Nav Link Clicks by Label](/insights/xhzekIpp) — Nav clicks broken down by which link was clicked
- [Most Clicked Events](/insights/n794F6Sb) — Bar chart of event card clicks by event title
- [Overall User Engagement](/insights/pAphpsEI) — All three engagement signals side by side

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
