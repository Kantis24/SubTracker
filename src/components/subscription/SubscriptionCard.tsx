import type { Subscription } from "../../types";
import { billingCycleLabel, subscriptionMonthlyEquivalent } from "../../utils/costCalculations";
import { formatShortDate } from "../../utils/dates";
import { formatCurrency } from "../../utils/formatCurrency";
import { isOverdue } from "../../utils/upcoming";

interface SubscriptionCardProps {
  subscription: Subscription;
  listName: string;
  onEdit: (s: Subscription) => void;
  onDelete: (id: string) => void;
}

export function SubscriptionCard({
  subscription,
  listName,
  onEdit,
  onDelete,
}: SubscriptionCardProps) {
  const overdue = subscription.active && isOverdue(subscription);
  const monthlyEq = subscriptionMonthlyEquivalent(subscription);
  const cycleNote =
    subscription.billingCycle === "custom" && subscription.customCycleDays
      ? `every ${subscription.customCycleDays} days`
      : billingCycleLabel(subscription.billingCycle);

  return (
    <article
      className={`rounded-2xl border p-4 transition ${
        subscription.active
          ? "border-slate-300 bg-white dark:border-slate-800/90 dark:bg-slate-900/55"
          : "border-slate-300/80 bg-slate-100/70 opacity-80 dark:border-slate-800/50 dark:bg-slate-900/25"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white">{subscription.name}</h3>
            {!subscription.active ? (
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                Inactive
              </span>
            ) : overdue ? (
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-200 ring-1 ring-inset ring-amber-500/30">
                Overdue
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{listName}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold tabular-nums text-slate-900 dark:text-white">
            {formatCurrency(subscription.amount)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{cycleNote}</p>
        </div>
      </div>

      <dl className="mt-3 grid gap-2 text-sm text-slate-500 dark:text-slate-400 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-500">Next due</dt>
          <dd className="font-medium text-slate-700 dark:text-slate-200">{formatShortDate(subscription.nextDueDate)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-500">Est. monthly</dt>
          <dd className="font-medium tabular-nums text-slate-700 dark:text-slate-200">{formatCurrency(monthlyEq)}</dd>
        </div>
      </dl>

      {subscription.notes ? (
        <p className="mt-3 line-clamp-3 text-sm text-slate-500 dark:text-slate-400">{subscription.notes}</p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onEdit(subscription)}
          className="rounded-lg bg-slate-200 px-3 py-1.5 text-sm font-medium text-slate-800 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => {
            if (confirm(`Remove “${subscription.name}” from your tracker?`)) {
              onDelete(subscription.id);
            }
          }}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-rose-300 transition hover:bg-rose-500/10"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
