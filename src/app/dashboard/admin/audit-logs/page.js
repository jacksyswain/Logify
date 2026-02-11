"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

export default function AuditLogsPage() {
  const { data: session, status } = useSession();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===============================
     Filters
  =============================== */
  const [actionFilter, setActionFilter] = useState("ALL");
  const [adminFilter, setAdminFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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
      try {
        const res = await fetch("/api/admin/audit-logs");
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("Failed to load audit logs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  /* ===============================
     Derived Data
  =============================== */
  const uniqueActions = useMemo(() => {
    const set = new Set(logs.map((l) => l.action));
    return ["ALL", ...Array.from(set)];
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (
        actionFilter !== "ALL" &&
        log.action !== actionFilter
      ) {
        return false;
      }

      if (adminFilter.trim()) {
        const admin =
          `${log.actor?.name || ""} ${log.actor?.email || ""}`.toLowerCase();
        if (!admin.includes(adminFilter.toLowerCase())) {
          return false;
        }
      }

      if (fromDate) {
        if (new Date(log.createdAt) < new Date(fromDate)) {
          return false;
        }
      }

      if (toDate) {
        if (new Date(log.createdAt) > new Date(toDate)) {
          return false;
        }
      }

      return true;
    });
  }, [logs, actionFilter, adminFilter, fromDate, toDate]);

  /* ===============================
     Loading
  =============================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Loading audit logs…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
        {/* ================= Header ================= */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Audit Logs
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor all administrative activity
          </p>
        </div>

        {/* ================= Filters ================= */}
        <div className="bg-white border rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Action */}
          <div>
            <label className="text-xs font-medium text-gray-600">
              Action
            </label>
            <select
              value={actionFilter}
              onChange={(e) =>
                setActionFilter(e.target.value)
              }
              className="mt-1 w-full border rounded-lg p-2 text-sm"
            >
              {uniqueActions.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
          </div>

          {/* Admin */}
          <div>
            <label className="text-xs font-medium text-gray-600">
              Admin
            </label>
            <input
              type="text"
              placeholder="Name or email"
              value={adminFilter}
              onChange={(e) =>
                setAdminFilter(e.target.value)
              }
              className="mt-1 w-full border rounded-lg p-2 text-sm"
            />
          </div>

          {/* From */}
          <div>
            <label className="text-xs font-medium text-gray-600">
              From
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) =>
                setFromDate(e.target.value)
              }
              className="mt-1 w-full border rounded-lg p-2 text-sm"
            />
          </div>

          {/* To */}
          <div>
            <label className="text-xs font-medium text-gray-600">
              To
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) =>
                setToDate(e.target.value)
              }
              className="mt-1 w-full border rounded-lg p-2 text-sm"
            />
          </div>
        </div>

        {/* ================= Card ================= */}
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50 text-sm text-gray-600">
            {filteredLogs.length} result
            {filteredLogs.length !== 1 && "s"}
          </div>

          {filteredLogs.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              No logs match your filters
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left font-medium">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left font-medium">
                      Target
                    </th>
                    <th className="px-6 py-3 text-left font-medium">
                      Time
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredLogs.map((log) => (
                    <tr
                      key={log._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium">
                          {log.actor?.name || "System"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {log.actor?.email}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                          {log.action}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        {log.targetType}
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {new Date(
                          log.createdAt
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
