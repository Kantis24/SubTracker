import { DEFAULT_LISTS, DEFAULT_LIST_IDS } from "../data/defaultLists";
import type { AppData, BillingCycle, PersistedAppDocument, Subscription, SubscriptionList } from "../types";

export const STORAGE_KEY = "subtracker-v1";

const CURRENT_SCHEMA_VERSION = 1;

const BILLING: ReadonlySet<string> = new Set(["weekly", "monthly", "yearly", "custom"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Fresh install: built-in lists, no subscriptions. */
export function createInitialAppState(): AppData {
  return {
    lists: DEFAULT_LISTS.map((l) => ({ ...l })),
    subscriptions: [],
  };
}

/** Validate JSON shape produced by older builds (missing `schemaVersion` is OK). */
export function validateAppPayload(raw: unknown): AppData | null {
  if (!isRecord(raw)) return null;
  const lists = raw.lists;
  const subscriptions = raw.subscriptions;
  if (!Array.isArray(lists) || !Array.isArray(subscriptions)) return null;

  for (const l of lists) {
    if (!isRecord(l) || typeof l.id !== "string" || typeof l.name !== "string") return null;
  }

  for (const s of subscriptions) {
    if (!isRecord(s)) return null;
    if (
      typeof s.id !== "string" ||
      typeof s.listId !== "string" ||
      typeof s.name !== "string" ||
      typeof s.amount !== "number" ||
      typeof s.billingCycle !== "string" ||
      !BILLING.has(s.billingCycle) ||
      typeof s.nextDueDate !== "string" ||
      typeof s.notes !== "string" ||
      typeof s.active !== "boolean"
    ) {
      return null;
    }
    if (s.customCycleDays !== undefined && typeof s.customCycleDays !== "number") {
      return null;
    }
    if (!Number.isFinite(s.amount)) return null;
  }

  const data: AppData = {
    lists: lists as SubscriptionList[],
    subscriptions: subscriptions as Subscription[],
  };
  return data;
}

/** Ensure built-in lists exist, subscriptions reference real lists. */
export function normalizeAppData(data: AppData): AppData {
  const listsOrdered: SubscriptionList[] = DEFAULT_LISTS.map((d) => ({ ...d }));

  const customsAcc: SubscriptionList[] = [];
  const seenIds = new Set(DEFAULT_LIST_IDS);
  for (const l of data.lists) {
    if (!l.id?.trim()) continue;
    if (DEFAULT_LIST_IDS.has(l.id)) continue;
    if (seenIds.has(l.id)) continue;
    seenIds.add(l.id);
    const name = l.name.trim() || "Untitled";
    customsAcc.push({ id: l.id, name });
  }

  const lists = [...listsOrdered, ...customsAcc];
  const listIds = new Set(lists.map((l) => l.id));
  const fallback = lists.find((l) => l.id === "other")?.id ?? "other";

  const subscriptions: Subscription[] = data.subscriptions
    .filter((s) => s.id.trim() && Number.isFinite(s.amount))
    .map((s) => ({
      ...s,
      listId: listIds.has(s.listId) ? s.listId : fallback,
      billingCycle: BILLING.has(s.billingCycle) ? (s.billingCycle as BillingCycle) : "monthly",
    }));

  return { lists, subscriptions };
}

/** Parse string from localStorage; returns null if unreadable or invalid. */
export function parseStoredString(rawJson: string): AppData | null {
  try {
    const parsed: unknown = JSON.parse(rawJson);
    if (!isRecord(parsed)) return null;
    const data = validateAppPayload(parsed);
    if (!data) return null;
    return normalizeAppData(data);
  } catch {
    return null;
  }
}

export function tryReadFromLocalStorage(storageKey = STORAGE_KEY): AppData | null {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    return parseStoredString(raw);
  } catch {
    return null;
  }
}

export function serializeAppData(data: AppData): string {
  const normalized = normalizeAppData(data);
  const doc: PersistedAppDocument = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    lists: normalized.lists,
    subscriptions: normalized.subscriptions,
  };
  return JSON.stringify(doc);
}

/** Returns false if quota / private-mode blocks persistence. Caller may surface a toast later. */
export function tryWriteToLocalStorage(data: AppData, storageKey = STORAGE_KEY): boolean {
  try {
    localStorage.setItem(storageKey, serializeAppData(data));
    return true;
  } catch {
    return false;
  }
}

export function hydrateFromStorage(storageKey = STORAGE_KEY): AppData {
  return tryReadFromLocalStorage(storageKey) ?? createInitialAppState();
}
