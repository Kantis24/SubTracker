import type { Subscription, SubscriptionFilterOptions } from "../types";

function startOfDay(date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseDue(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function dueRangeMatch(dueDate: string, range: SubscriptionFilterOptions["dueRange"]): boolean {
  if (range === "all") return true;
  const today = startOfDay();
  const due = parseDue(dueDate);
  if (range === "overdue") return due < today;
  const days = Number(range);
  const horizon = new Date(today);
  horizon.setDate(horizon.getDate() + days);
  return due <= horizon;
}

export function filterSubscriptions(
  subscriptions: Subscription[],
  options: SubscriptionFilterOptions,
  listNameById: Map<string, string>
): Subscription[] {
  const query = options.query.trim().toLowerCase();

  return subscriptions.filter((sub) => {
    if (options.listId !== "all" && sub.listId !== options.listId) return false;
    if (options.activity === "active" && !sub.active) return false;
    if (options.activity === "inactive" && sub.active) return false;
    if (options.billingCycle !== "all" && sub.billingCycle !== options.billingCycle) return false;
    if (!dueRangeMatch(sub.nextDueDate, options.dueRange)) return false;

    if (!query) return true;
    const listName = (listNameById.get(sub.listId) ?? "").toLowerCase();
    return (
      sub.name.toLowerCase().includes(query) ||
      sub.notes.toLowerCase().includes(query) ||
      listName.includes(query) ||
      sub.billingCycle.toLowerCase().includes(query)
    );
  });
}
