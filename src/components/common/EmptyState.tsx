interface EmptyStateProps {
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

/** Simple bordered empty panel for lists, grids, side panels. */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-700/70 bg-gradient-to-br from-slate-900/35 to-slate-950/50 px-6 py-12 text-center sm:px-8">
      <div
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 text-xl"
        aria-hidden
      >
        ◇
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-200">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">{description}</p>
      {action ? (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-6 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          {action.label}
        </button>
      ) : null}
    </div>
  );
}
