"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

const PAGE_SIZE = 10;

export default function AuditLogsPage() {
  const { data: session, status } = useSession();

  /* ===============================
     STATE
  =============================== */
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  /* ===============================
     FETCH LOGS (SAFE)
  =============================== */
  useEffect(() => {
    if (status !== "authenticated") return;
    if (!session || session.user.role !== "ADMIN") return;

    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/admin/audit-logs");
        const data = await res.json();

        if (Array.isArray(data)) {
          setLogs(data);
        } else {
          setLogs([]);
        }
      } catch (err) {
        console.error("Failed to fetch audit logs", err);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [session, status]);

  /* ===============================
     FILTERING
  =============================== */
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const searchable =
        `${log.action} ${log.targetType} ${log.actor?.name} ${log.actor?.email}`
          .toLowerCase();

      if (search && !searchable.includes(search.toLowerCase())) return false;
      if (actionFilter !== "ALL" && log.action !== actionFilter) return false;
      if (fromDate && new Date(log.createdAt) < new Date(fromDate)) return false;
      if (toDate && new Date(log.createdAt) > new Date(toDate)) return false;

      return true;
    });
  }, [logs, search, actionFilter, fromDate, toDate]);

  /* ===============================
     PAGINATION
  =============================== */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredLogs.length / PAGE_SIZE)
  );

  const paginatedLogs = filteredLogs.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ===============================
     CSV EXPORT
  =============================== */
  const exportCSV = () => {
    const rows = [
      ["Admin", "Email", "Action", "Target", "Time"],
      ...filteredLogs.map((l) => [
        l.actor?.name || "System",
        l.actor?.email || "",
        l.action,
        l.targetType,
        new Date(l.createdAt).toLocaleString(),
      ]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "audit-logs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ===============================
     ACCESS GUARD (AFTER HOOKS)
  =============================== */

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Checking access...
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Access denied
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading audit logs...
      </div>
    );
  }

  /* ===============================
     STATS
  =============================== */
  const actionStats = {
    CREATE: logs.filter((l) => l.action === "CREATE").length,
    UPDATE: logs.filter((l) => l.action === "UPDATE").length,
    DELETE: logs.filter((l) => l.action === "DELETE").length,
    LOGIN: logs.filter((l) => l.action === "LOGIN").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

        {/* ================= Header ================= */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Audit Logs</h1>
            <p className="text-gray-400 text-sm">
              Security & administrative activity tracking
            </p>
          </div>

          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition"
          >
            Export CSV
          </button>
        </div>

        {/* ================= Stats ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard label="Create" value={actionStats.CREATE} />
          <StatCard label="Update" value={actionStats.UPDATE} />
          <StatCard label="Delete" value={actionStats.DELETE} />
          <StatCard label="Login" value={actionStats.LOGIN} />
        </div>

        {/* ================= Filters ================= */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl grid md:grid-cols-4 gap-4">
          <input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="bg-black/60 border border-white/20 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            className="bg-black/60 border border-white/20 rounded-lg p-2 text-sm"
          >
            <option value="ALL">All Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="LOGIN">LOGIN</option>
          </select>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="bg-black/60 border border-white/20 rounded-lg p-2 text-sm"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="bg-black/60 border border-white/20 rounded-lg p-2 text-sm"
          />
        </div>

        {/* ================= Table ================= */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-gray-300">
              <tr>
                <th className="px-6 py-4 text-left">Admin</th>
                <th className="px-6 py-4 text-left">Action</th>
                <th className="px-6 py-4 text-left">Target</th>
                <th className="px-6 py-4 text-left">Time</th>
              </tr>
            </thead>

            <tbody>
              {paginatedLogs.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-16 text-gray-400">
                    No audit logs found
                  </td>
                </tr>
              )}

              {paginatedLogs.map((log) => (
                <tr
                  key={log._id}
                  className="border-t border-white/5 hover:bg-white/5 transition"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium">
                      {log.actor?.name || "System"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {log.actor?.email}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <ActionBadge action={log.action} />
                  </td>

                  <td className="px-6 py-4 text-gray-300">
                    {log.targetType}
                  </td>

                  <td className="px-6 py-4 text-gray-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ================= Pagination ================= */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-white/10 bg-white/5">
            <span className="text-sm text-gray-400">
              Page {page} of {totalPages}
            </span>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 rounded border border-white/20 disabled:opacity-40 hover:bg-white/10"
              >
                Prev
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded border border-white/20 disabled:opacity-40 hover:bg-white/10"
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ================= Components ================= */

function StatCard({ label, value }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:shadow-xl transition">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function ActionBadge({ action }) {
  const styles = {
    CREATE: "bg-green-500/20 text-green-300",
    UPDATE: "bg-blue-500/20 text-blue-300",
    DELETE: "bg-red-500/20 text-red-300",
    LOGIN: "bg-purple-500/20 text-purple-300",
  };

  return (
    <span className={`px-3 py-1 text-xs rounded-full ${styles[action]}`}>
      {action}
    </span>
  );
}