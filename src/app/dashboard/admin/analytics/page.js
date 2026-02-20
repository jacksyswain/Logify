"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

/* ===============================
   Helpers
=============================== */
const getLastNDays = (n) => {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
};

export default function AdminAnalyticsPage() {
  const { data: session, status } = useSession();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(7);

  /* ================= Access Guard ================= */
  if (status === "loading") return null;

  if (!session || session.user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600 font-medium">
          Access denied
        </p>
      </div>
    );
  }

  /* ================= Fetch Logs ================= */
  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch("/api/admin/audit-logs");
      const data = await res.json();
      setLogs(data);
      setLoading(false);
    };

    fetchLogs();
  }, []);

  /* ================= Analytics ================= */
  const analytics = useMemo(() => {
    const byAction = {};
    const byAdmin = {};
    const byDay = {};

    logs.forEach((log) => {
      byAction[log.action] = (byAction[log.action] || 0) + 1;

      const admin = log.actor?.email || "System";
      byAdmin[admin] = (byAdmin[admin] || 0) + 1;

      const day = new Date(log.createdAt)
        .toISOString()
        .slice(0, 10);
      byDay[day] = (byDay[day] || 0) + 1;
    });

    const sortedAdmins = Object.entries(byAdmin)
      .sort((a, b) => b[1] - a[1]);

    const mostActiveAdmin = sortedAdmins[0];

    return {
      total: logs.length,
      byAction,
      byAdmin,
      byDay,
      mostActiveAdmin,
      sortedAdmins,
    };
  }, [logs]);

  const days = getLastNDays(range);
  const maxDayCount = Math.max(
    ...days.map((d) => analytics.byDay[d] || 0),
    1
  );

  /* ================= Loading ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading analytics…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* ================= Header ================= */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Admin Analytics
            </h1>
            <p className="text-sm text-gray-400">
              Administrative activity overview
            </p>
          </div>

          <select
            value={range}
            onChange={(e) => setRange(Number(e.target.value))}
            className="bg-black border border-white/20 px-3 py-2 rounded-lg text-sm"
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
          </select>
        </div>

        {/* ================= KPI Cards ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard label="Total Actions" value={analytics.total} />
          <StatCard
            label="Most Active Admin"
            value={analytics.mostActiveAdmin?.[0] || "—"}
            sub={`${analytics.mostActiveAdmin?.[1] || 0} actions`}
          />
          <StatCard
            label="Unique Admins"
            value={Object.keys(analytics.byAdmin).length}
          />
        </div>

        {/* ================= Action Breakdown ================= */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-semibold mb-6 text-gray-300">
            Actions Distribution
          </h2>

          <div className="grid sm:grid-cols-4 gap-4">
            {Object.entries(analytics.byAction).map(
              ([action, count]) => {
                const percent =
                  (count / analytics.total) * 100;

                return (
                  <div
                    key={action}
                    className="bg-black/40 border border-white/10 rounded-xl p-4"
                  >
                    <p className="text-sm text-gray-400">
                      {action}
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {count}
                    </p>
                    <div className="h-2 bg-white/10 mt-3 rounded">
                      <div
                        className="h-2 bg-blue-600 rounded"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* ================= Activity Over Time ================= */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-semibold mb-6 text-gray-300">
            Activity Over Time
          </h2>

          <div className="space-y-4">
            {days.map((day) => {
              const count = analytics.byDay[day] || 0;
              const width = (count / maxDayCount) * 100;

              return (
                <div key={day}>
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>{day}</span>
                    <span>{count}</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded">
                    <div
                      className="h-3 bg-blue-500 rounded transition-all"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= Top Admin Leaderboard ================= */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-semibold mb-6 text-gray-300">
            Top Admins
          </h2>

          <div className="space-y-4">
            {analytics.sortedAdmins.slice(0, 5).map(
              ([email, count], index) => (
                <div
                  key={email}
                  className="flex justify-between bg-black/40 border border-white/10 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 text-xs">
                      {index + 1}
                    </span>
                    <span>{email}</span>
                  </div>
                  <span className="font-semibold">
                    {count} actions
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* ================= Recent Activity ================= */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-semibold mb-6 text-gray-300">
            Recent Activity
          </h2>

          <div className="space-y-3 max-h-96 overflow-auto">
            {logs.slice(0, 10).map((log) => (
              <div
                key={log._id}
                className="flex justify-between bg-black/40 border border-white/10 rounded-lg p-3 text-sm"
              >
                <span>
                  {log.actor?.email || "System"} →{" "}
                  {log.action}
                </span>
                <span className="text-gray-400">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ===============================
   Components
=============================== */
function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      {sub && (
        <p className="text-xs text-gray-500 mt-1">{sub}</p>
      )}
    </div>
  );
}