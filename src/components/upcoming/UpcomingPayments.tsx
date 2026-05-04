import type { Subscription } from "../../types";
import { billingCycleLabel } from "../../utils/costCalculations";
import { formatShortDate } from "../../utils/dates";
import { formatCurrency } from "../../utils/formatCurrency";
import { getUpcomingSubscriptions, isOverdue } from "../../utils/upcoming";
import { EmptyState } from "../common/EmptyState";

interface UpcomingPaymentsProps {
  subscriptions: Subscription[];
  listId: string | "all";
  withinDays?: number;
}

export function UpcomingPayments({ subscriptions, listId, withinDays = 30 }: UpcomingPaymentsProps) {
  const upcoming = getUpcomingSubscriptions(subscriptions, {
    withinDays,
    listId,
    includeInactive: false,
  });

  const listLabel = listId === "all" ? "all lists" : "this list";

  return (
    <section className="lg:sticky lg:top-24" aria-labelledby="upcoming-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-300 pb-3 dark:border-slate-800/80">
        <h2 id="upcoming-heading" className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
          Upcoming payments
        </h2>
        <span className="text-xs text-slate-500 dark:text-slate-400">Next {withinDays} days (+ overdue)</span>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-300 bg-white/80 p-3 dark:border-slate-800/90 dark:bg-slate-900/40 sm:p-4">
        {upcoming.length === 0 ? (
          <EmptyState
            title="You’re caught up here"
            description={`No active subscriptions in ${listLabel} are overdue or due within ${withinDays} days. Change the list filter or tune due dates.`}
          />
        ) : (
          <ul className="space-y-2">
            {upcoming.map((s) => {
              const late = isOverdue(s);
              return (
                <li
                  key={s.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-slate-300 bg-white px-3 py-2.5 dark:border-slate-800/90 dark:bg-slate-950/55"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900 dark:text-slate-100">{s.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatShortDate(s.nextDueDate)}
                      <span className="mx-1 text-slate-400 dark:text-slate-600">•</span>
                      {billingCycleLabel(s.billingCycle)}
                    </p>
                    {late ? (
                      <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-amber-400/90">
                        Overdue
                      </p>
                    ) : null}
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-slate-900 dark:text-white">
                    {formatCurrency(s.amount)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
