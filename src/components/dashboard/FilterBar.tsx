import { useRef } from "react";
import type {
  BillingCycle,
  DueRangeFilter,
  SubscriptionFilterOptions,
  SubscriptionList,
} from "../../types";

interface FilterBarProps {
  lists: SubscriptionList[];
  filters: SubscriptionFilterOptions;
  onChange: (next: SubscriptionFilterOptions) => void;
  onExportCsv: () => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
}

const CYCLE_OPTIONS: Array<BillingCycle | "all"> = [
  "all",
  "weekly",
  "monthly",
  "yearly",
  "custom",
];
const DUE_OPTIONS: DueRangeFilter[] = ["all", "overdue", "7", "30", "90"];

export function FilterBar({
  lists,
  filters,
  onChange,
  onExportCsv,
  onExportJson,
  onImportJson,
}: FilterBarProps) {
  const importRef = useRef<HTMLInputElement>(null);

  return (
    <section
      className="rounded-2xl border border-slate-300 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/55"
      aria-label="Search and filters"
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <input
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          placeholder="Search name, notes, list, or cycle"
          className="xl:col-span-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
        />

        <select
          value={filters.activity}
          onChange={(e) =>
            onChange({
              ...filters,
              activity: e.target.value as SubscriptionFilterOptions["activity"],
            })
          }
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        >
          <option value="all">All statuses</option>
          <option value="active">Active only</option>
          <option value="inactive">Inactive only</option>
        </select>

        <select
          value={filters.billingCycle}
          onChange={(e) =>
            onChange({
              ...filters,
              billingCycle: e.target.value as SubscriptionFilterOptions["billingCycle"],
            })
          }
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        >
          {CYCLE_OPTIONS.map((cycle) => (
            <option key={cycle} value={cycle}>
              {cycle === "all" ? "All cycles" : cycle[0].toUpperCase() + cycle.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={filters.listId}
          onChange={(e) => onChange({ ...filters, listId: e.target.value })}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        >
          <option value="all">All lists</option>
          {lists.map((list) => (
            <option key={list.id} value={list.id}>
              {list.name}
            </option>
          ))}
        </select>

        <select
          value={filters.dueRange}
          onChange={(e) => onChange({ ...filters, dueRange: e.target.value as DueRangeFilter })}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        >
          {DUE_OPTIONS.map((range) => (
            <option key={range} value={range}>
              {range === "all"
                ? "Any due date"
                : range === "overdue"
                  ? "Overdue only"
                  : `Due within ${range} days`}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <p>Filters apply to cards, summary, upcoming panel, and charts.</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onExportCsv}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={onExportJson}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => importRef.current?.click()}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Import JSON
          </button>
          <input
            ref={importRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImportJson(file);
              e.currentTarget.value = "";
            }}
          />
        </div>
      </div>
    </section>
  );
}
