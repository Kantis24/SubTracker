import type { Subscription } from "../types";
import { billingCycleLabel } from "./costCalculations";

function escapeCsv(value: string): string {
  const normalized = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  return `"${normalized.replace(/"/g, '""')}"`;
}

export function exportSubscriptionsCsv(
  subscriptions: Subscription[],
  listNameById: Map<string, string>,
  filename = "subtracker-subscriptions.csv"
) {
  const header = [
    "Name",
    "Amount",
    "Billing Cycle",
    "Next Due Date",
    "List/Category",
    "Status",
    "Notes",
  ];

  const rows = subscriptions.map((s) => [
    s.name,
    s.amount.toFixed(2),
    billingCycleLabel(s.billingCycle),
    s.nextDueDate,
    listNameById.get(s.listId) ?? "Unknown",
    s.active ? "Active" : "Inactive",
    s.notes,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => escapeCsv(String(cell))).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
