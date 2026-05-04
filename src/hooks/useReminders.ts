import { useEffect, useMemo, useState } from "react";
import type { ReminderSettings, Subscription } from "../types";

const SETTINGS_KEY = "subtracker-reminders";
const SENT_LOG_KEY = "subtracker-reminder-log";

function startOfDay(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function readSettings(): ReminderSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { enabled: false, daysAhead: 3 };
    const parsed = JSON.parse(raw) as Partial<ReminderSettings>;
    return {
      enabled: Boolean(parsed.enabled),
      daysAhead: Number.isFinite(parsed.daysAhead) ? Number(parsed.daysAhead) : 3,
    };
  } catch {
    return { enabled: false, daysAhead: 3 };
  }
}

function readSentLog(): Record<string, string> {
  try {
    const raw = localStorage.getItem(SENT_LOG_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

function writeSentLog(value: Record<string, string>) {
  localStorage.setItem(SENT_LOG_KEY, JSON.stringify(value));
}

export function useReminders(subscriptions: Subscription[]) {
  const [settings, setSettings] = useState<ReminderSettings>(readSettings);
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "denied"
  );
  const supported = typeof Notification !== "undefined";

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  async function updateEnabled(enabled: boolean) {
    if (!enabled) {
      setSettings((s) => ({ ...s, enabled: false }));
      return;
    }

    if (!supported) return;

    let current = Notification.permission;
    if (current === "default") {
      current = await Notification.requestPermission();
    }
    setPermission(current);
    if (current === "granted") {
      setSettings((s) => ({ ...s, enabled: true }));
    }
  }

  useEffect(() => {
    if (!supported || !settings.enabled || permission !== "granted") return;

    const checkAndNotify = () => {
      const today = startOfDay();
      const horizon = new Date(today);
      horizon.setDate(horizon.getDate() + settings.daysAhead);

      const dueSoon = subscriptions.filter((s) => {
        if (!s.active) return false;
        const due = parseDate(s.nextDueDate);
        return due <= horizon;
      });

      const log = readSentLog();
      const todayKey = today.toISOString().slice(0, 10);

      dueSoon.forEach((sub) => {
        if (log[sub.id] === todayKey) return;

        const due = parseDate(sub.nextDueDate);
        const daysDiff = Math.ceil((due.getTime() - today.getTime()) / 86400000);
        const when =
          daysDiff < 0
            ? `${Math.abs(daysDiff)} day(s) overdue`
            : `due in ${daysDiff} day(s)`;

        new Notification(`Subscription reminder: ${sub.name}`, {
          body: `${when} • ${sub.nextDueDate}`,
          tag: `subtracker-${sub.id}`,
        });

        log[sub.id] = todayKey;
      });

      writeSentLog(log);
    };

    checkAndNotify();
    const timer = window.setInterval(checkAndNotify, 60 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, [permission, settings.daysAhead, settings.enabled, subscriptions, supported]);

  const dueSoonCount = useMemo(() => {
    const today = startOfDay();
    const horizon = new Date(today);
    horizon.setDate(horizon.getDate() + settings.daysAhead);
    return subscriptions.filter((s) => s.active && parseDate(s.nextDueDate) <= horizon).length;
  }, [settings.daysAhead, subscriptions]);

  return {
    supported,
    permission,
    settings,
    dueSoonCount,
    updateEnabled,
    setDaysAhead: (daysAhead: number) => setSettings((s) => ({ ...s, daysAhead })),
  };
}
