import { useCallback, useEffect, useState } from "react";
import type { Subscription, SubscriptionDraft, AppData } from "../types";
import { DEFAULT_LIST_IDS } from "../data/defaultLists";
import {
  hydrateFromStorage,
  normalizeAppData,
  parseStoredString,
  STORAGE_KEY,
  tryWriteToLocalStorage,
} from "../utils/storage";

function nextId(): string {
  return crypto.randomUUID();
}

export function useSubscriptionStore() {
  const [data, setDataInternal] = useState<AppData>(() => normalizeAppData(hydrateFromStorage()));

  useEffect(() => {
    tryWriteToLocalStorage(data);
  }, [data]);

  /** Other tabs/windows writing the same key. */
  useEffect(() => {
    function onExternalStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY || e.storageArea !== localStorage || e.newValue === null) return;
      const parsed = parseStoredString(e.newValue);
      if (parsed) setDataInternal(normalizeAppData(parsed));
    }
    window.addEventListener("storage", onExternalStorage);
    return () => window.removeEventListener("storage", onExternalStorage);
  }, []);

  const patch = useCallback((updater: AppData | ((prev: AppData) => AppData)) => {
    setDataInternal((prev) =>
      normalizeAppData(typeof updater === "function" ? updater(prev) : updater)
    );
  }, []);

  const addList = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      patch((d) => {
        const exists = d.lists.some((l) => l.name.toLowerCase() === trimmed.toLowerCase());
        if (exists) return d;
        return { ...d, lists: [...d.lists, { id: nextId(), name: trimmed }] };
      });
    },
    [patch]
  );

  const deleteList = useCallback(
    (listId: string) => {
      if (DEFAULT_LIST_IDS.has(listId)) return;
      patch((d) => {
        const fallback = d.lists.find((l) => l.id === "other")?.id ?? "other";
        return {
          lists: d.lists.filter((l) => l.id !== listId),
          subscriptions: d.subscriptions.map((s) =>
            s.listId === listId ? { ...s, listId: fallback } : s
          ),
        };
      });
    },
    [patch]
  );

  const addSubscription = useCallback(
    (draft: SubscriptionDraft) => {
      const sub: Subscription = {
        id: nextId(),
        listId: draft.listId,
        name: draft.name.trim(),
        amount: draft.amount,
        billingCycle: draft.billingCycle,
        customCycleDays:
          draft.billingCycle === "custom" ? draft.customCycleDays : undefined,
        nextDueDate: draft.nextDueDate,
        notes: draft.notes.trim(),
        active: draft.active,
      };
      patch((d) => ({ ...d, subscriptions: [...d.subscriptions, sub] }));
    },
    [patch]
  );

  const updateSubscription = useCallback(
    (id: string, draft: SubscriptionDraft) => {
      patch((d) => ({
        ...d,
        subscriptions: d.subscriptions.map((s) =>
          s.id === id
            ? {
                ...s,
                listId: draft.listId,
                name: draft.name.trim(),
                amount: draft.amount,
                billingCycle: draft.billingCycle,
                customCycleDays:
                  draft.billingCycle === "custom" ? draft.customCycleDays : undefined,
                nextDueDate: draft.nextDueDate,
                notes: draft.notes.trim(),
                active: draft.active,
              }
            : s
        ),
      }));
    },
    [patch]
  );

  const deleteSubscription = useCallback(
    (id: string) => {
      patch((d) => ({
        ...d,
        subscriptions: d.subscriptions.filter((s) => s.id !== id),
      }));
    },
    [patch]
  );

  const replaceData = useCallback(
    (nextData: AppData) => {
      patch(nextData);
    },
    [patch]
  );

  return {
    data,
    addList,
    deleteList,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    replaceData,
  };
}
