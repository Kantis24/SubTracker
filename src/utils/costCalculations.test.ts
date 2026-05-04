import { describe, expect, it } from "vitest";
import type { Subscription } from "../types";
import {
  calculateMonthlyCost,
  calculateYearlyCost,
  subscriptionMonthlyEquivalent,
  subscriptionYearlyCost,
} from "./costCalculations";

function mk(overrides: Partial<Subscription> = {}): Subscription {
  return {
    id: "sub-1",
    listId: "personal",
    name: "Test",
    amount: 10,
    billingCycle: "monthly",
    nextDueDate: "2026-05-10",
    notes: "",
    active: true,
    ...overrides,
  };
}

describe("costCalculations", () => {
  it("calculates yearly cost for monthly subscriptions", () => {
    expect(subscriptionYearlyCost(mk({ amount: 12, billingCycle: "monthly" }))).toBe(144);
  });

  it("calculates monthly equivalent for yearly subscriptions", () => {
    expect(subscriptionMonthlyEquivalent(mk({ amount: 120, billingCycle: "yearly" }))).toBe(10);
  });

  it("handles custom cycle costs", () => {
    const yearly = subscriptionYearlyCost(
      mk({
        amount: 30,
        billingCycle: "custom",
        customCycleDays: 15,
      })
    );
    expect(yearly).toBeCloseTo(730, 5);
  });

  it("excludes inactive subscriptions by default", () => {
    const items = [mk({ id: "a", amount: 10 }), mk({ id: "b", amount: 20, active: false })];
    expect(calculateMonthlyCost(items)).toBe(10);
    expect(calculateYearlyCost(items)).toBe(120);
  });

  it("includes inactive subscriptions when requested", () => {
    const items = [mk({ id: "a", amount: 10 }), mk({ id: "b", amount: 20, active: false })];
    expect(calculateMonthlyCost(items, { includeInactive: true })).toBe(30);
    expect(calculateYearlyCost(items, { includeInactive: true })).toBe(360);
  });
});
