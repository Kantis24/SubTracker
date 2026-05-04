export type BillingCycle = "weekly" | "monthly" | "yearly" | "custom";

export interface SubscriptionList {
  id: string;
  name: string;
}

export interface Subscription {
  id: string;
  listId: string;
  name: string;
  amount: number;
  billingCycle: BillingCycle;
  /** Required when `billingCycle` is `custom` (validated at runtime). */
  customCycleDays?: number;
  /** ISO date `YYYY-MM-DD`. */
  nextDueDate: string;
  notes: string;
  active: boolean;
}

/** Creating or updating a subscription (no `id`). */
export interface SubscriptionDraft {
  listId: string;
  name: string;
  amount: number;
  billingCycle: BillingCycle;
  customCycleDays?: number;
  nextDueDate: string;
  notes: string;
  active: boolean;
}

export interface AppData {
  lists: SubscriptionList[];
  subscriptions: Subscription[];
}

/** Stored object in localStorage (includes migration metadata). */
export interface PersistedAppDocument {
  schemaVersion: number;
  lists: SubscriptionList[];
  subscriptions: Subscription[];
}
