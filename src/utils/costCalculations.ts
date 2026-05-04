import type { BillingCycle, Subscription } from "../types";

const DAYS_PER_YEAR = 365;
const WEEKS_PER_YEAR = 52;
const MONTHS_PER_YEAR = 12;

/**
 * Normalizes a single subscription to an estimated yearly cost.
 */
export function subscriptionYearlyCost(subscription: Subscription): number {
  const { amount, billingCycle, customCycleDays } = subscription;
  switch (billingCycle) {
    case "weekly":
      return amount * WEEKS_PER_YEAR;
    case "monthly":
      return amount * MONTHS_PER_YEAR;
    case "yearly":
      return amount;
    case "custom": {
      const days = customCycleDays && customCycleDays > 0 ? customCycleDays : 30;
      return (amount * DAYS_PER_YEAR) / days;
    }
    default: {
      const _exhaustive: never = billingCycle;
      return _exhaustive;
    }
  }
}

/** Estimated monthly equivalent for one subscription. */
export function subscriptionMonthlyEquivalent(subscription: Subscription): number {
  return subscriptionYearlyCost(subscription) / MONTHS_PER_YEAR;
}

function isActive(s: Subscription): boolean {
  return s.active;
}

/**
 * Sum of estimated monthly spend across subscriptions (active only by default).
 */
export function calculateMonthlyCost(
  subscriptions: Subscription[],
  options: { includeInactive?: boolean } = {}
): number {
  const { includeInactive = false } = options;
  return subscriptions
    .filter((s) => includeInactive || isActive(s))
    .reduce((sum, s) => sum + subscriptionMonthlyEquivalent(s), 0);
}

/**
 * Sum of estimated yearly spend across subscriptions (active only by default).
 */
export function calculateYearlyCost(
  subscriptions: Subscription[],
  options: { includeInactive?: boolean } = {}
): number {
  const { includeInactive = false } = options;
  return subscriptions
    .filter((s) => includeInactive || isActive(s))
    .reduce((sum, s) => sum + subscriptionYearlyCost(s), 0);
}

export function billingCycleLabel(cycle: BillingCycle): string {
  switch (cycle) {
    case "weekly":
      return "Weekly";
    case "monthly":
      return "Monthly";
    case "yearly":
      return "Yearly";
    case "custom":
      return "Custom";
    default: {
      const _exhaustive: never = cycle;
      return _exhaustive;
    }
  }
}
