interface DashboardHeaderProps {
  onMenuClick: () => void;
  mobileNavOpen: boolean;
  onAddSubscription: () => void;
}

export function DashboardHeader({ onMenuClick, mobileNavOpen, onAddSubscription }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-100 shadow-sm transition hover:border-slate-600 md:hidden"
            onClick={onMenuClick}
            aria-expanded={mobileNavOpen}
            aria-controls="app-sidebar"
          >
            <span className="flex flex-col gap-0.5" aria-hidden>
              <span className="block h-0.5 w-4 rounded-full bg-current" />
              <span className="block h-0.5 w-4 rounded-full bg-current" />
              <span className="block h-0.5 w-4 rounded-full bg-current" />
            </span>
            Lists
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight text-white sm:text-xl">SubTracker</h1>
            <p className="truncate text-[11px] text-slate-500 sm:text-xs">
              Stored on this browser only • localStorage
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onAddSubscription}
          className="shrink-0 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          <span className="hidden min-[380px]:inline">Add subscription</span>
          <span className="min-[380px]:hidden">Add</span>
        </button>
      </div>
    </header>
  );
}
