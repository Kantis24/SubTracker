import type { SubscriptionList } from "../types";

export const DEFAULT_LISTS: SubscriptionList[] = [
  { id: "personal", name: "Personal" },
  { id: "business", name: "Business" },
  { id: "family", name: "Family" },
  { id: "other", name: "Other" },
];

export const DEFAULT_LIST_IDS = new Set(DEFAULT_LISTS.map((l) => l.id));
