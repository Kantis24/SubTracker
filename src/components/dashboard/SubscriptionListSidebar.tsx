import { useState, type ReactNode } from "react";
import type { Subscription, SubscriptionList } from "../../types";
import { DEFAULT_LIST_IDS } from "../../data/defaultLists";

interface SubscriptionListSidebarProps {
  lists: SubscriptionList[];
  subscriptions: Subscription[];
  selectedListId: string | "all";
  onSelectList: (id: string | "all") => void;
  onAddList: (name: string) => void;
  onDeleteList: (id: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function SubscriptionListSidebar({
  lists,
  subscriptions,
  selectedListId,
  onSelectList,
  onAddList,
  onDeleteList,
  mobileOpen,
  onCloseMobile,
}: SubscriptionListSidebarProps) {
  const [newListName, setNewListName] = useState("");

  function countForList(listId: string): number {
    return subscriptions.filter((s) => s.listId === listId && s.active).length;
  }

  function totalActive(): number {
    return subscriptions.filter((s) => s.active).length;
  }

  function handleAddList(e: React.FormEvent) {
    e.preventDefault();
    onAddList(newListName);
    setNewListName("");
  }

  const inner = (
    <>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Lists</p>
        <button
          type="button"
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white md:hidden"
          onClick={onCloseMobile}
          aria-label="Close list panel"
        >
          ✕
        </button>
      </div>

      <nav className="mt-3 flex flex-col gap-1" aria-label="Subscription lists">
        <ListRowButton
          label="All subscriptions"
          trailing={`${totalActive()} active`}
          selected={selectedListId === "all"}
          onSelect={() => {
            onSelectList("all");
            onCloseMobile();
          }}
        />

        {lists.map((list) => {
          const canRemove = !DEFAULT_LIST_IDS.has(list.id);
          return (
            <div key={list.id} className="group flex min-h-[2.75rem] items-stretch gap-1">
              <ListRowButton
                label={list.name}
                trailing={<span className="tabular-nums">{countForList(list.id)}</span>}
                selected={selectedListId === list.id}
                onSelect={() => {
                  onSelectList(list.id);
                  onCloseMobile();
                }}
              />
              {canRemove ? (
                <button
                  type="button"
                  title='Delete list (subscriptions move to "Other")'
                  onClick={() => {
                    if (
                      confirm(
                        'Remove this custom list? Subscriptions will move to "Other". This cannot be undone.'
                      )
                    ) {
                      onDeleteList(list.id);
                    }
                  }}
                  className="shrink-0 rounded-xl px-2 text-xs text-slate-600 opacity-0 transition hover:bg-rose-500/15 hover:text-rose-200 group-hover:opacity-100 focus:opacity-100 md:opacity-100"
                  aria-label={`Delete list ${list.name}`}
                >
                  ×
                </button>
              ) : (
                <span className="w-7 shrink-0" aria-hidden />
              )}
            </div>
          );
        })}
      </nav>

      <form onSubmit={handleAddList} className="mt-6 border-t border-slate-800/80 pt-4">
        <label htmlFor="new-list-name" className="mb-2 block text-xs font-medium text-slate-400">
          Custom list
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            id="new-list-name"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="e.g. Side projects"
            maxLength={64}
            autoComplete="off"
            className="min-h-11 w-full min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="min-h-11 shrink-0 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            Add list
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Personal, Business, Family, and Other are always available.
        </p>
      </form>
    </>
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onCloseMobile}
        aria-hidden={!mobileOpen}
      />

      <aside
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,calc(100vw-3rem))] flex-col py-4 pl-4 pr-3 transition-transform duration-200 md:static md:z-0 md:w-64 md:translate-x-0 md:p-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900/50 shadow-xl md:sticky md:top-24 md:max-h-[calc(100vh-7rem)] md:shadow-none">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">{inner}</div>
        </div>
      </aside>
    </>
  );
}

interface ListRowButtonProps {
  label: string;
  trailing: ReactNode;
  selected: boolean;
  onSelect: () => void;
}

function ListRowButton({ label, trailing, selected, onSelect }: ListRowButtonProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex min-w-0 flex-1 items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition ${
        selected
          ? "bg-indigo-500/15 font-medium text-indigo-50 ring-1 ring-inset ring-indigo-500/35"
          : "text-slate-300 hover:bg-slate-800/80"
      }`}
    >
      <span className="truncate">{label}</span>
      <span className="shrink-0 text-xs text-slate-500">{trailing}</span>
    </button>
  );
}
