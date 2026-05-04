import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Subscription } from "../types";
import { exportSubscriptionsCsv } from "./csv";

class FakeBlob {
  public parts: unknown[];
  public options?: BlobPropertyBag;

  constructor(parts: unknown[], options?: BlobPropertyBag) {
    this.parts = parts;
    this.options = options;
  }
}

describe("exportSubscriptionsCsv", () => {
  const originalBlob = globalThis.Blob;

  beforeEach(() => {
    // Capture CSV string payload for assertions.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).Blob = FakeBlob as unknown as typeof Blob;
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:test");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    vi.spyOn(document.body, "appendChild");
    vi.spyOn(document.body, "removeChild");
  });

  afterEach(() => {
    globalThis.Blob = originalBlob;
    vi.restoreAllMocks();
  });

  it("creates a CSV download and escapes special characters", () => {
    const originalCreateElement = document.createElement.bind(document);
    const anchor = document.createElement("a");
    const click = vi.spyOn(anchor, "click").mockImplementation(() => {});
    vi.spyOn(document, "createElement").mockImplementation((tagName: string) => {
      if (tagName.toLowerCase() === "a") return anchor;
      return originalCreateElement(tagName);
    });

    const subscriptions: Subscription[] = [
      {
        id: "1",
        listId: "personal",
        name: 'Netflix, "Premium"',
        amount: 15.5,
        billingCycle: "monthly",
        nextDueDate: "2026-05-10",
        notes: "line1\nline2",
        active: true,
      },
    ];

    exportSubscriptionsCsv(subscriptions, new Map([["personal", "Personal"]]), "test.csv");

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(click).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:test");

    const createdBlob = (URL.createObjectURL as unknown as { mock: { calls: unknown[][] } }).mock
      .calls[0][0] as unknown as FakeBlob;
    const csvText = String(createdBlob.parts[0]);

    expect(csvText).toContain('"Name","Amount","Billing Cycle","Next Due Date","List/Category","Status","Notes"');
    expect(csvText).toContain('"Netflix, ""Premium"""');
    expect(csvText).toContain('"line1\nline2"');
  });
});
