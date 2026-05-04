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
- PWA support with offline install and cached assets.

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

## Testing

```bash
npm run test
npm run test:watch
npm run test:coverage
```

Current unit tests cover:

- `subscriptionFilters` (search and all filter paths)
- `costCalculations` (monthly/yearly/custom math and inactive handling)
- `csv` export utility (download flow and safe CSV escaping)

## PWA install notes

- Open the app in a Chrome or Edge browser and use **Install app** in the address bar menu.
- The app works offline for UI/assets; your subscription data stays in browser storage.


## Future improvements


## License

MIT
