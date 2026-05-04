interface DashboardHeaderProps {
  onMenuClick: () => void;
  mobileNavOpen: boolean;
  onAddSubscription: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function DashboardHeader({
  onMenuClick,
  mobileNavOpen,
  onAddSubscription,
  theme,
  onToggleTheme,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-300/90 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 md:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600"
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
            <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900 dark:text-white sm:text-xl">
              SubTracker
            </h1>
            <p className="truncate text-[11px] text-slate-500 dark:text-slate-400 sm:text-xs">
              Stored on this browser only • localStorage
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <button
            type="button"
            onClick={onAddSubscription}
            className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950"
          >
            <span className="hidden min-[380px]:inline">Add subscription</span>
            <span className="min-[380px]:hidden">Add</span>
          </button>
        </div>
      </div>
    </header>
  );
}
