"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function AuditLogsPage() {
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
            Track all administrative actions across the system
          </p>
        </div>

        {/* ================= Card ================= */}
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b bg-gray-50">
            <p className="text-sm font-medium text-gray-700">
              {logs.length} log{logs.length !== 1 && "s"} recorded
            </p>
          </div>

          {/* Table */}
          {logs.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              No audit logs found
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
                  {logs.map((log) => (
                    <tr
                      key={log._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
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
                        {new Date(log.createdAt).toLocaleString()}
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
