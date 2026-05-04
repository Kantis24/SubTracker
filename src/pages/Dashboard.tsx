import { useMemo, useState } from "react";
import type { Subscription, SubscriptionDraft, SubscriptionFilterOptions } from "../types";
import { EmptyState } from "../components/common/EmptyState";
//import { ChartsSection } from "../components/dashboard/ChartsSection";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { DashboardSummary } from "../components/dashboard/DashboardSummary";
import { FilterBar } from "../components/dashboard/FilterBar";
import { SubscriptionListSidebar } from "../components/dashboard/SubscriptionListSidebar";
import { SubscriptionCard } from "../components/subscription/SubscriptionCard";
import { SubscriptionForm } from "../components/subscription/SubscriptionForm";
import { UpcomingPayments } from "../components/upcoming/UpcomingPayments";
import { useReminders } from "../hooks/useReminders";
import { useSubscriptionStore } from "../hooks/useSubscriptionStore";
import { useTheme } from "../hooks/useTheme";
import { exportSubscriptionsCsv } from "../utils/csv";
import { filterSubscriptions } from "../utils/subscriptionFilters";

export default function Dashboard() {
  const { data, addSubscription, updateSubscription, deleteSubscription, addList, deleteList } =
    useSubscriptionStore();

  const { theme, toggleTheme } = useTheme();
  const [selectedListId, setSelectedListId] = useState<string | "all">("all");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Subscription | null>(null);
  const [filters, setFilters] = useState<SubscriptionFilterOptions>({
    query: "",
    listId: "all",
    activity: "all",
    billingCycle: "all",
    dueRange: "all",
  });

  const reminders = useReminders(data.subscriptions);

  const listNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const l of data.lists) map.set(l.id, l.name);
    return map;
  }, [data.lists]);

  const filteredSubs = useMemo(() => {
    const nextFilters = { ...filters, listId: selectedListId };
    return filterSubscriptions(data.subscriptions, nextFilters, listNameById);
  }, [data.subscriptions, filters, listNameById, selectedListId]);

  const sortedSubs = useMemo(
    () =>
      [...filteredSubs].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      ),
    [filteredSubs]
  );

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function handleFormSubmit(draft: SubscriptionDraft, id?: string) {
    if (id) updateSubscription(id, draft);
    else addSubscription(draft);
  }

  const defaultFormListId = selectedListId === "all" ? data.lists[0]?.id ?? "personal" : selectedListId;
  const upcomingWindowDays =
    filters.dueRange === "7" || filters.dueRange === "30" || filters.dueRange === "90"
      ? Number(filters.dueRange)
      : 30;

  const isGlobalEmpty = data.subscriptions.length === 0;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <DashboardHeader
        mobileNavOpen={mobileNavOpen}
        onMenuClick={() => setMobileNavOpen((o) => !o)}
        onAddSubscription={openCreate}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 pb-16 pt-6 sm:px-6 lg:flex-row lg:items-start lg:gap-8">
        <SubscriptionListSidebar
          lists={data.lists}
          subscriptions={data.subscriptions}
          selectedListId={selectedListId}
          onSelectList={(id) => {
            setSelectedListId(id);
            setFilters((prev) => ({ ...prev, listId: id }));
          }}
          onAddList={addList}
          onDeleteList={deleteList}
          mobileOpen={mobileNavOpen}
          onCloseMobile={() => setMobileNavOpen(false)}
        />

        <div className="min-w-0 flex-1 space-y-6">
          <FilterBar
            lists={data.lists}
            filters={{ ...filters, listId: selectedListId }}
            onChange={(next) => {
              setFilters(next);
              setSelectedListId(next.listId);
            }}
            onExportCsv={() => exportSubscriptionsCsv(data.subscriptions, listNameById)}
          />

        

          <DashboardSummary subscriptions={filteredSubs} />

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            <section className="min-w-0 flex-1" aria-labelledby="subs-heading">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <h2
                  id="subs-heading"
                  className="text-sm font-semibold uppercase tracking-wide text-slate-400"
                >
                  Subscriptions
                </h2>
              </div>

              {isGlobalEmpty ? (
                <EmptyState
                  title="Welcome to SubTracker"
                  description="Add subscriptions you pay for manually—streaming, software, domains, gyms—anything with a renewal. Rough monthly/yearly totals and due reminders stay in this browser; nothing syncs or phones home."
                  action={{ label: "Add your first subscription", onClick: openCreate }}
                />
              ) : sortedSubs.length === 0 ? (
                <EmptyState
                  title="No subscriptions match these filters"
                  description="Try clearing or adjusting search/filter settings, or add a new subscription."
                  action={{ label: "Add subscription", onClick: openCreate }}
                />
              ) : (
                <ul className="grid list-none gap-3 p-0">
                  {sortedSubs.map((s) => (
                    <li key={s.id}>
                      <SubscriptionCard
                        subscription={s}
                        listName={listNameById.get(s.listId) ?? "Unknown list"}
                        onEdit={(sub) => {
                          setEditing(sub);
                          setFormOpen(true);
                        }}
                        onDelete={deleteSubscription}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {!isGlobalEmpty ? (
              <div className="w-full shrink-0 lg:w-[min(24rem,calc(100vw-6rem))]">
                <UpcomingPayments
                  subscriptions={filteredSubs}
                  listId="all"
                  withinDays={upcomingWindowDays}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <SubscriptionForm
        open={formOpen}
        lists={data.lists}
        editing={editing}
        defaultListId={defaultFormListId}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={(draft, id) => {
          handleFormSubmit(draft, id);
        }}
      />
    </div>
  );
}
