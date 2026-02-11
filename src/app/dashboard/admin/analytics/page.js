"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

/* ===============================
   Helpers
=============================== */
const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
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

  /* ===============================
     Access Guard
  =============================== */
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

  /* ===============================
     Fetch Logs
  =============================== */
  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch("/api/admin/audit-logs");
      const data = await res.json();
      setLogs(data);
      setLoading(false);
    };

    fetchLogs();
  }, []);

  /* ===============================
     Analytics
  =============================== */
  const analytics = useMemo(() => {
    const total = logs.length;

    const byAction = {};
    const byAdmin = {};
    const byDay = {};

    logs.forEach((log) => {
      // Action count
      byAction[log.action] = (byAction[log.action] || 0) + 1;

      // Admin count
      const admin = log.actor?.email || "System";
      byAdmin[admin] = (byAdmin[admin] || 0) + 1;

      // Daily activity
      const day = new Date(log.createdAt)
        .toISOString()
        .slice(0, 10);
      byDay[day] = (byDay[day] || 0) + 1;
    });

    const mostActiveAdmin =
      Object.entries(byAdmin).sort((a, b) => b[1] - a[1])[0];

    return {
      total,
      byAction,
      byAdmin,
      byDay,
      mostActiveAdmin,
    };
  }, [logs]);

  const last7Days = getLast7Days();

  /* ===============================
     Loading
  =============================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        Loading analytics…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* ================= Header ================= */}
        <div>
          <h1 className="text-3xl font-semibold">
            Admin Analytics
          </h1>
          <p className="text-sm text-gray-500">
            Overview of administrative activity
          </p>
        </div>

        {/* ================= KPI Cards ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Actions"
            value={analytics.total}
          />
          <StatCard
            label="Most Active Admin"
            value={
              analytics.mostActiveAdmin
                ? analytics.mostActiveAdmin[0]
                : "—"
            }
            sub={`${analytics.mostActiveAdmin?.[1] || 0} actions`}
          />
          <StatCard
            label="Unique Admins"
            value={Object.keys(analytics.byAdmin).length}
          />
        </div>

        {/* ================= Action Breakdown ================= */}
        <div className="bg-white border rounded-2xl p-6">
          <h2 className="font-semibold mb-4">
            Actions Breakdown
          </h2>

          <div className="grid sm:grid-cols-4 gap-4">
            {Object.entries(analytics.byAction).map(
              ([action, count]) => (
                <div
                  key={action}
                  className="border rounded-xl p-4"
                >
                  <p className="text-sm text-gray-500">
                    {action}
                  </p>
                  <p className="text-2xl font-bold">
                    {count}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* ================= Activity Over Time ================= */}
        <div className="bg-white border rounded-2xl p-6">
          <h2 className="font-semibold mb-4">
            Activity (Last 7 Days)
          </h2>

          <div className="space-y-3">
            {last7Days.map((day) => {
              const count = analytics.byDay[day] || 0;
              return (
                <div key={day}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{day}</span>
                    <span>{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded">
                    <div
                      className="h-2 bg-black rounded"
                      style={{
                        width: `${Math.min(
                          (count / 10) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
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
    <div className="bg-white border rounded-2xl p-6">
      <p className="text-sm text-gray-500">
        {label}
      </p>
      <p className="text-3xl font-bold mt-1">
        {value}
      </p>
      {sub && (
        <p className="text-xs text-gray-400 mt-1">
          {sub}
        </p>
      )}
    </div>
  );
}
