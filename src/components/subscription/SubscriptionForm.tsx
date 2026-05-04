import { useEffect, useState } from "react";
import type { BillingCycle, Subscription, SubscriptionDraft } from "../../types";
import { billingCycleLabel } from "../../utils/costCalculations";

interface SubscriptionFormProps {
  open: boolean;
  lists: { id: string; name: string }[];
  editing: Subscription | null;
  /** Resolved list id to pre-select when creating. */
  defaultListId: string;
  onSubmit: (draft: SubscriptionDraft, id?: string) => void;
  onClose: () => void;
}

const CYCLES: BillingCycle[] = ["weekly", "monthly", "yearly", "custom"];

export function SubscriptionForm({
  open,
  lists,
  editing,
  defaultListId,
  onSubmit,
  onClose,
}: SubscriptionFormProps) {
  const firstListId = lists[0]?.id ?? "";

  const [listId, setListId] = useState(firstListId);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [customCycleDays, setCustomCycleDays] = useState("30");
  const [nextDueDate, setNextDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [active, setActive] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    const resolvedList = editing ? editing.listId : defaultListId || firstListId;

    setListId(resolvedList);
    setName(editing?.name ?? "");
    setAmount(editing ? String(editing.amount) : "");
    const cycle = editing?.billingCycle ?? "monthly";
    setBillingCycle(cycle);
    setCustomCycleDays(
      editing?.billingCycle === "custom" ? String(editing.customCycleDays ?? 30) : "30"
    );
    setNextDueDate(editing?.nextDueDate ?? "");
    setNotes(editing?.notes ?? "");
    setActive(editing?.active ?? true);
    setErrors([]);
  }, [open, editing, defaultListId, firstListId]);

  if (!open) return null;

  function validate(): SubscriptionDraft | null {
    const nextErrors: string[] = [];
    const trimmedName = name.trim();
    if (!trimmedName) nextErrors.push("Name is required.");

    const num = Number(amount);
    if (!(Number.isFinite(num) && num > 0)) nextErrors.push("Amount must be a positive number.");

    if (!nextDueDate) nextErrors.push("Next due date is required.");

    let customDaysParsed: number | undefined;
    if (billingCycle === "custom") {
      const d = Number(customCycleDays);
      if (!(Number.isFinite(d) && d >= 1 && d <= 366)) {
        nextErrors.push("Custom cycle must be between 1 and 366 days.");
      } else customDaysParsed = Math.floor(d);
    }

    if (!listId || !lists.some((l) => l.id === listId)) {
      nextErrors.push("Pick a valid list.");
    }

    setErrors(nextErrors);
    if (nextErrors.length) return null;

    return {
      listId,
      name: trimmedName,
      amount: num,
      billingCycle,
      customCycleDays: billingCycle === "custom" ? customDaysParsed : undefined,
      nextDueDate,
      notes: notes.trim(),
      active,
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const draft = validate();
    if (!draft) return;
    if (editing) onSubmit(draft, editing.id);
    else onSubmit(draft);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="subscription-form-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Dismiss form"
      />

      <form
        onSubmit={handleSubmit}
        className="relative flex max-h-[min(92vh,44rem)] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-slate-300 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-300 px-5 py-4 dark:border-slate-800">
          <h2 id="subscription-form-title" className="text-lg font-semibold text-slate-900 dark:text-white">
            {editing ? "Edit subscription" : "Add subscription"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {errors.length ? (
            <div
              className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-700 dark:text-rose-100"
              role="alert"
            >
              <ul className="list-inside list-disc space-y-0.5">
                {errors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="space-y-4">
            <div>
              <label htmlFor="sub-list" className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                List
              </label>
              <select
                id="sub-list"
                value={listId}
                onChange={(e) => setListId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                {lists.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sub-name" className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                Name <span className="text-rose-400">*</span>
              </label>
              <input
                id="sub-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-600"
                placeholder="Netflix, domain renewal…"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="sub-amount" className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                  Amount <span className="text-rose-400">*</span>
                </label>
                <input
                  id="sub-amount"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm tabular-nums text-slate-900 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-600"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label htmlFor="sub-due" className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                  Next due <span className="text-rose-400">*</span>
                </label>
                <input
                  id="sub-due"
                  type="date"
                  value={nextDueDate}
                  onChange={(e) => setNextDueDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">Billing cycle</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {CYCLES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setBillingCycle(c)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      billingCycle === c
                        ? "bg-indigo-500 text-white shadow-sm"
                        : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    {billingCycleLabel(c)}
                  </button>
                ))}
              </div>
            </div>

            {billingCycle === "custom" ? (
              <div>
                <label htmlFor="sub-custom-days" className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                  Bill every N days
                </label>
                <input
                  id="sub-custom-days"
                  inputMode="numeric"
                  value={customCycleDays}
                  onChange={(e) => setCustomCycleDays(e.target.value)}
                  min={1}
                  max={366}
                  className="mt-1 w-full max-w-[12rem] rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm tabular-nums text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
            ) : null}

            <div>
              <label htmlFor="sub-notes" className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                Notes
              </label>
              <textarea
                id="sub-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1 w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-600"
                placeholder="Optional reminders or plan details."
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 dark:border-slate-800 dark:bg-slate-900/40">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-200">Subscription is active</span>
            </label>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-300 px-5 py-4 dark:border-slate-800 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950"
          >
            {editing ? "Save changes" : "Add subscription"}
          </button>
        </div>
      </form>
    </div>
  );
}
