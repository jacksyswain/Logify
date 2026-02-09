"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function AuditLogsPage() {
  const { data: session } = useSession();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!session || session.user.role !== "ADMIN") {
    return <p className="p-6 text-red-600">Access denied</p>;
  }

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch("/api/admin/audit-logs");
      const data = await res.json();
      setLogs(data);
      setLoading(false);
    };

    fetchLogs();
  }, []);

  if (loading) {
    return <p className="p-6">Loading audit logs...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Audit Logs</h1>

      <div className="border rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Admin</th>
              <th className="p-3 text-left">Action</th>
              <th className="p-3 text-left">Target</th>
              <th className="p-3 text-left">Time</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-t">
                <td className="p-3">
                  {log.actor?.name}
                </td>
                <td className="p-3">{log.action}</td>
                <td className="p-3">
                  {log.targetType}
                </td>
                <td className="p-3">
                  {new Date(
                    log.createdAt
                  ).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
