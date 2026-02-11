"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

/* ===============================
   CONFIG
=============================== */
const PAGE_SIZE = 10;

export default function AuditLogsPage() {
  const { data: session, status } = useSession();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===============================
     Filters & Search
  =============================== */
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* ===============================
     Pagination
  =============================== */
  const [page, setPage] = useState(1);

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
        console.error("Failed to fetch audit logs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  /* ===============================
     REAL-TIME (WebSocket Ready)
     (Safe: no socket = no crash)
  =============================== */
  useEffect(() => {
    if (!window?.WebSocket) return;

    // Example placeholder
    // const socket = new WebSocket("wss://your-domain/ws/audit");
    // socket.onmessage = (event) => {
    //   const log = JSON.parse(event.data);
    //   setLogs((prev) => [log, ...prev]);
    // };
    // return () => socket.close();
  }, []);

  /* ===============================
     Filter + Search Logic
  =============================== */
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const searchable =
        `${log.action} ${log.targetType} ${log.actor?.name} ${log.actor?.email}`
          .toLowerCase();

      if (search && !searchable.includes(search.toLowerCase())) {
        return false;
      }

      if (actionFilter !== "ALL" && log.action !== actionFilter) {
        return false;
      }

      if (fromDate && new Date(log.createdAt) < new Date(fromDate)) {
        return false;
      }

      if (toDate && new Date(log.createdAt) > new Date(toDate)) {
        return false;
      }

      return true;
    });
  }, [logs, search, actionFilter, fromDate, toDate]);

  /* ===============================
     Pagination Logic
  =============================== */
  const totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE);

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
     Loading
  =============================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        Loading audit logs…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
        {/* ================= Header ================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">
              Audit Logs
            </h1>
            <p className="text-sm text-gray-500">
              Security & administrative activity
            </p>
          </div>

          <button
            onClick={exportCSV}
            className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50"
          >
            Export CSV
          </button>
        </div>

        {/* ================= Filters ================= */}
        <div className="bg-white border rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            placeholder="Search logs…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border rounded-lg p-2 text-sm"
          />

          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            className="border rounded-lg p-2 text-sm"
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
            className="border rounded-lg p-2 text-sm"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded-lg p-2 text-sm"
          />
        </div>

        {/* ================= Table ================= */}
        <div className="bg-white border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Admin</th>
                <th className="px-6 py-3 text-left">Action</th>
                <th className="px-6 py-3 text-left">Target</th>
                <th className="px-6 py-3 text-left">Time</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {paginatedLogs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium">
                      {log.actor?.name || "System"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {log.actor?.email}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-md text-xs bg-blue-50 text-blue-700">
                      {log.action}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {log.targetType}
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ================= Pagination ================= */}
          <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
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
