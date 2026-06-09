"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient, useIsFetching } from "@tanstack/react-query";
import {
  Users,
  UserCheck,
  Activity,
  DollarSign,
  CreditCard,
  TrendingUp,
  Download,
  RefreshCw,
} from "lucide-react";
import type {
  StatsResponse,
  RecentUsersResponse,
  SubscriptionOverview,
  RevenueSummary,
  RevenueTimeseriesResponse,
  RecentPaymentsResponse,
  RevenueBreakdownResponse,
} from "@/lib/types/admin";
import { KpiCard } from "./components/KpiCard";
import { RevenueChart } from "./components/RevenueChart";
import { RevenueByPlanCard } from "./components/RevenueByPlanCard";
import { RecentUsersCard } from "./components/RecentUsersCard";
import { RecentPaymentsCard } from "./components/RecentPaymentsCard";
import { SubscriptionOverviewCard } from "./components/SubscriptionOverviewCard";
import { TopCountriesCard } from "./components/TopCountriesCard";
import { queryFetch, errorMessage } from "./lib/queryFetch";

function formatCurrency(n: number | null | undefined): string {
  if (n === undefined || n === null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
};

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function AdminOverview() {
  const dateBounds = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    return {
      from: isoDate(start),
      to: isoDate(end),
      range: `${start.toLocaleDateString("en-US", DATE_OPTS)} – ${end.toLocaleDateString("en-US", DATE_OPTS)}`,
    };
  }, []);
  const { from, to, range } = dateBounds;

  const queryClient = useQueryClient();
  const adminFetchingCount = useIsFetching({ queryKey: ["admin"] });
  const [refreshClicked, setRefreshClicked] = useState(false);
  const isRefreshing = refreshClicked && adminFetchingCount > 0;
  useEffect(() => {
    if (refreshClicked && adminFetchingCount === 0) {
      setRefreshClicked(false);
    }
  }, [refreshClicked, adminFetchingCount]);
  const handleRefresh = () => {
    setRefreshClicked(true);
    queryClient.invalidateQueries({ queryKey: ["admin"] });
  };

  const statsQ = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => queryFetch<StatsResponse>("/api/admin/stats"),
  });
  const recentUsersQ = useQuery({
    queryKey: ["admin", "users", "recent"],
    queryFn: () => queryFetch<RecentUsersResponse>("/api/admin/users/recent"),
  });
  const subsQ = useQuery({
    queryKey: ["admin", "subscriptions", "overview"],
    queryFn: () =>
      queryFetch<SubscriptionOverview>("/api/admin/subscriptions/overview"),
  });
  const revenueSummaryQ = useQuery({
    queryKey: ["admin", "revenue", "summary", { from, to }],
    queryFn: () =>
      queryFetch<RevenueSummary>(
        `/api/admin/revenue/summary?from=${from}&to=${to}`,
      ),
  });
  const revenueTsQ = useQuery({
    queryKey: ["admin", "revenue", "timeseries", { granularity: "day" }],
    queryFn: () =>
      queryFetch<RevenueTimeseriesResponse>(
        "/api/admin/revenue/timeseries?granularity=day",
      ),
  });
  const paymentsQ = useQuery({
    queryKey: ["admin", "payments", "recent", { limit: 6 }],
    queryFn: () =>
      queryFetch<RecentPaymentsResponse>("/api/admin/payments/recent?limit=6"),
  });
  const revenueByPlanQ = useQuery({
    queryKey: ["admin", "revenue", "breakdown", { dimension: "plan" }],
    queryFn: () =>
      queryFetch<RevenueBreakdownResponse>(
        "/api/admin/revenue/breakdown?dimension=plan",
      ),
  });
  const revenueByCountryQ = useQuery({
    queryKey: ["admin", "revenue", "breakdown", { dimension: "country" }],
    queryFn: () =>
      queryFetch<RevenueBreakdownResponse>(
        "/api/admin/revenue/breakdown?dimension=country",
      ),
  });

  const stats = statsQ.data ?? null;
  const statsErr = errorMessage(statsQ.error);
  const recentUsers = recentUsersQ.data ?? null;
  const recentUsersErr = errorMessage(recentUsersQ.error);
  const subs = subsQ.data ?? null;
  const subsErr = errorMessage(subsQ.error);
  const revenueSummary = revenueSummaryQ.data ?? null;
  const revenueSummaryErr = errorMessage(revenueSummaryQ.error);
  const revenueTs = revenueTsQ.data ?? null;
  const revenueTsErr = errorMessage(revenueTsQ.error);
  const payments = paymentsQ.data ?? null;
  const paymentsErr = errorMessage(paymentsQ.error);
  const revenueByPlan = revenueByPlanQ.data ?? null;
  const revenueByPlanErr = errorMessage(revenueByPlanQ.error);
  const revenueByCountry = revenueByCountryQ.data ?? null;
  const revenueByCountryErr = errorMessage(revenueByCountryQ.error);

  const activeUsersValue = (() => {
    const v = stats?.activeUsers ?? stats?.activeUsersLast30d;
    return v != null ? v.toLocaleString() : "—";
  })();

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-geist">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of platform performance and key metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 font-medium">
            {range}
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm text-gray-700 font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            title="Refresh data"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing…" : "Refresh"}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
            disabled
            title="Coming soon"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KpiCard
          label="Total Users"
          value={stats ? stats.totalUsers.toLocaleString() : "—"}
          error={statsErr}
          icon={<Users className="w-5 h-5 text-[#0FA37F]" />}
        />
        <KpiCard
          label="Pro Users"
          value={stats ? stats.proSubscribers.toLocaleString() : "—"}
          error={statsErr}
          icon={<UserCheck className="w-5 h-5 text-green-500" />}
          iconBg="bg-green-50"
        />
        <KpiCard
          label="Active Users (30d)"
          value={activeUsersValue}
          error={statsErr}
          icon={<Activity className="w-5 h-5 text-indigo-500" />}
          iconBg="bg-indigo-50"
        />
        <KpiCard
          label="Total Revenue"
          value={formatCurrency(revenueSummary?.amountSoldUsd)}
          error={revenueSummaryErr}
          icon={<DollarSign className="w-5 h-5 text-amber-500" />}
          iconBg="bg-amber-50"
        />
        <KpiCard
          label="Subscriptions"
          value={subs ? subs.total.toLocaleString() : "—"}
          error={subsErr}
          icon={<CreditCard className="w-5 h-5 text-blue-500" />}
          iconBg="bg-blue-50"
        />
        <KpiCard
          label="MRR"
          value={formatCurrency(subs?.revenuecatTotals?.mrr ?? undefined)}
          error={subsErr}
          icon={<TrendingUp className="w-5 h-5 text-pink-500" />}
          iconBg="bg-pink-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueTs} error={revenueTsErr} />
        </div>
        <div>
          <RevenueByPlanCard data={revenueByPlan} error={revenueByPlanErr} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <RecentUsersCard data={recentUsers} error={recentUsersErr} />
        </div>
        <div>
          <RecentPaymentsCard data={payments} error={paymentsErr} />
        </div>
        <div className="space-y-6">
          <SubscriptionOverviewCard data={subs} error={subsErr} />
          <TopCountriesCard
            data={revenueByCountry}
            error={revenueByCountryErr}
          />
        </div>
      </div>
    </div>
  );
}
