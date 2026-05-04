import { describe, expect, it } from "vitest";
import type { Subscription, SubscriptionFilterOptions } from "../types";
import { filterSubscriptions } from "./subscriptionFilters";

function isoFromOffset(daysFromToday: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().slice(0, 10);
}

const subscriptions: Subscription[] = [
  {
    id: "1",
    listId: "personal",
    name: "Netflix",
    amount: 15.99,
    billingCycle: "monthly",
    nextDueDate: isoFromOffset(-1),
    notes: "Family plan",
    active: true,
  },
  {
    id: "2",
    listId: "business",
    name: "Cloud Hosting",
    amount: 120,
    billingCycle: "yearly",
    nextDueDate: isoFromOffset(45),
    notes: "infra stack",
    active: false,
  },
  {
    id: "3",
    listId: "family",
    name: "News Weekly",
    amount: 5,
    billingCycle: "weekly",
    nextDueDate: isoFromOffset(5),
    notes: "",
    active: true,
  },
];

const listNames = new Map<string, string>([
  ["personal", "Personal"],
  ["business", "Business"],
  ["family", "Family"],
]);

const base: SubscriptionFilterOptions = {
  query: "",
  listId: "all",
  activity: "all",
  billingCycle: "all",
  dueRange: "all",
};

describe("filterSubscriptions", () => {
  it("searches by name, notes, list, and billing cycle", () => {
    expect(filterSubscriptions(subscriptions, { ...base, query: "net" }, listNames)).toHaveLength(1);
    expect(filterSubscriptions(subscriptions, { ...base, query: "infra" }, listNames)).toHaveLength(1);
    expect(filterSubscriptions(subscriptions, { ...base, query: "business" }, listNames)).toHaveLength(1);
    expect(filterSubscriptions(subscriptions, { ...base, query: "weekly" }, listNames)).toHaveLength(1);
  });

  it("filters by status", () => {
    expect(filterSubscriptions(subscriptions, { ...base, activity: "active" }, listNames)).toHaveLength(2);
    expect(filterSubscriptions(subscriptions, { ...base, activity: "inactive" }, listNames)).toHaveLength(1);
  });

  it("filters by billing cycle and list", () => {
    expect(
      filterSubscriptions(subscriptions, { ...base, billingCycle: "yearly" }, listNames)
    ).toHaveLength(1);
    expect(filterSubscriptions(subscriptions, { ...base, listId: "family" }, listNames)).toHaveLength(
      1
    );
  });

  it("filters by due range including overdue", () => {
    expect(filterSubscriptions(subscriptions, { ...base, dueRange: "overdue" }, listNames)).toHaveLength(
      1
    );
    expect(filterSubscriptions(subscriptions, { ...base, dueRange: "7" }, listNames)).toHaveLength(2);
  });
});
