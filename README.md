# SubTracker

Manually track subscriptions by list—names, amounts, renewal cadence, and upcoming due dates—in a **local-first** React app. There is **no backend** and **no authentication**; everything stays in your browser via **localStorage**.

## Features

- **Built-in lists** plus optional custom lists (custom lists can be deleted; subscriptions roll into **Other**).
- **Subscriptions** with amount, billing cadence (weekly / monthly / yearly / custom days), next due date, notes, and active state.
- **Dashboard** with estimated monthly/yearly spend (active items in the current filter), active counts, and dues in the next 30 days (+ overdue).
- **Cross-tab sync**: data updates if you open the app in another window on the same browser profile.
- **Empty states** for day-one use and for “no items in this list”.

## Tech stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 3

## Getting started

```bash
npm install
npm run dev
```

Production build and preview:

```bash
npm run build
npm run preview
```

### Data & privacy

Payloads are stored under the key `subtracker-v1` as JSON with a `schemaVersion` field (see `src/utils/storage.ts`). Clearing site data or switching browsers removes your entries—export/backup is listed as a future improvement below.

## Screenshots

_Add screenshots of the dashboard (desktop + mobile), the list sidebar, and the add/edit form._

## Future improvements

- Export / import JSON or CSV for backups
- Optional reminders (requires more platform integration)
- Lightweight PWA / offline install
- Currency selection and formatting controls

## Security

This is a **static client-only** app—do not paste secrets into notes fields if you reuse the snippet elsewhere. Treat `localStorage` like any browser profile data.

## License

MIT — free to use and adapt in your own projects.
