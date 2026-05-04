import { describe, expect, it } from "vitest";
import { importSubscriptionsJson } from "./jsonBackup";

describe("jsonBackup", () => {
  it("imports valid SubTracker JSON", () => {
    const data = importSubscriptionsJson(
      JSON.stringify({
        schemaVersion: 1,
        lists: [{ id: "personal", name: "Personal" }],
        subscriptions: [],
      })
    );
    expect(data).not.toBeNull();
    expect(data?.lists.length).toBeGreaterThan(0);
  });

  it("returns null for invalid JSON payload", () => {
    const data = importSubscriptionsJson(JSON.stringify({ foo: "bar" }));
    expect(data).toBeNull();
  });
});
