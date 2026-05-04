import type { Subscription } from "../../types";
import { calculateMonthlyCost, calculateYearlyCost } from "../../utils/costCalculations";
import { formatCurrency } from "../../utils/formatCurrency";
import { getUpcomingSubscriptions } from "../../utils/upcoming";

interface DashboardSummaryProps {
  subscriptions: Subscription[];
  upcomingWindowDays?: number;
}

export function DashboardSummary({
  subscriptions,
  upcomingWindowDays = 30,
}: DashboardSummaryProps) {
  const monthly = calculateMonthlyCost(subscriptions, { includeInactive: false });
  const yearly = calculateYearlyCost(subscriptions, { includeInactive: false });
  const activeCount = subscriptions.filter((s) => s.active).length;
  const upcomingCount = getUpcomingSubscriptions(subscriptions, {
    withinDays: upcomingWindowDays,
    listId: "all",
    includeInactive: false,
  }).length;

  const spendHint =
    activeCount === 0
      ? "Add an active subscription to estimate spend"
      : "Active items in the current list filter";

  const upcomingHint =
    activeCount === 0
      ? "Turn a subscription on or add one to see due dates"
      : `Overdue or within ${upcomingWindowDays} days`;

  const cards = [
    { label: "Est. monthly", value: formatCurrency(monthly), hint: spendHint },
    { label: "Est. yearly", value: formatCurrency(yearly), hint: spendHint },
    {
      label: "Active subscriptions",
      value: String(activeCount),
      hint: filteredScopeHint(subscriptions.length, activeCount),
    },
    { label: "Due soon", value: String(upcomingCount), hint: upcomingHint },
  ];

  return (
    <section
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Summary for the visible list filter"
    >
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm transition hover:border-slate-400 dark:border-slate-800/90 dark:bg-slate-900/50 dark:hover:border-slate-700/90"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{c.label}</p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-white">
            {c.value}
          </p>
          <p className="mt-3 text-xs leading-snug text-slate-500 dark:text-slate-400">{c.hint}</p>
        </div>
      ))}
    </section>
  );
}

function filteredScopeHint(totalShown: number, active: number): string {
  if (totalShown === 0) return "Nothing matches this filter yet";
  return `${totalShown} in view • ${active} active`;
}
