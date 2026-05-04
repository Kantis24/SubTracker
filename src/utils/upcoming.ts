import type { Subscription } from "../types";

function parseDay(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfToday(): Date {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export interface UpcomingOptions {
  /** Include subscriptions due on or before this many days from today. */
  withinDays: number;
  /** When set, only subscriptions in this list; omit or `'all'` for every list. */
  listId?: string | "all";
  /** When true, inactive subscriptions are included. Default false. */
  includeInactive?: boolean;
}

/**
 * Returns subscriptions that are overdue or due within `withinDays`, sorted by due date (earliest first).
 */
export function getUpcomingSubscriptions(
  subscriptions: Subscription[],
  options: UpcomingOptions
): Subscription[] {
  const { withinDays, listId = "all", includeInactive = false } = options;
  const today = startOfToday();
  const horizon = addDays(today, withinDays);

  return subscriptions
    .filter((s) => (includeInactive || s.active) && (listId === "all" || s.listId === listId))
    .filter((s) => {
      const due = parseDay(s.nextDueDate);
      return due <= horizon;
    })
    .sort((a, b) => parseDay(a.nextDueDate).getTime() - parseDay(b.nextDueDate).getTime());
}

export function isOverdue(subscription: Subscription, ref: Date = startOfToday()): boolean {
  return parseDay(subscription.nextDueDate) < ref;
}
