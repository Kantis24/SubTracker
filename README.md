# SubTracker v2

SubTracker is a local-first subscription tracker built with React + TypeScript + Vite.  
It runs fully in the browser, stores data in `localStorage`, and does **not** require auth, a backend, payment APIs, bank integrations, or cancellation integrations.

## Features

- Subscription CRUD with name, amount, billing cycle, next due date, notes, status, and list/category.
- Search + filter by query, status, billing cycle, list/category, and upcoming due range.
- Light/dark theme toggle with persisted preference.
- Dashboard summary + simple responsive charts:
  - monthly spending by list/category
  - subscription count by billing cycle
  - upcoming payments over 30 days
- CSV export for all visible subscriptions.
- Optional browser reminder notifications (no server required).
- PWA support with offline install and cached assets.

## Project structure

```txt
src/
  components/
    common/
    dashboard/
    subscription/
    upcoming/
  hooks/
    useSubscriptionStore.ts
    useTheme.ts
    useReminders.ts
  utils/
    storage.ts
    subscriptionFilters.ts
    csv.ts
    costCalculations.ts
    upcoming.ts
  data/
    defaultLists.ts
  pages/
    Dashboard.tsx
```

## Tech stack

- React 19
- TypeScript
- Vite 6
- Tailwind CSS 3
- Recharts
- vite-plugin-pwa

## Setup

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

## PWA install notes

- Open the app in a Chromium browser and use **Install app** in the address bar menu.
- The app works offline for UI/assets; your subscription data stays in browser storage.

## Data, privacy, and notifications

- App data key: `subtracker-v1`
- Theme key: `subtracker-theme`
- Reminder keys: `subtracker-reminders`, `subtracker-reminder-log`
- Notification permission is requested only when reminders are enabled.

## Screenshots

_Add desktop and mobile screenshots here for your portfolio README._

## Future improvements

- JSON import/export
- More chart presets and date windows
- Optional recurring “mark as paid” helper
- Better reminder scheduling when browser is not open

## License

MIT
