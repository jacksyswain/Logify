"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      const res = await fetch("/api/tickets");
      const data = await res.json();
      setTickets(data);
      setLoading(false);
    };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading tickets...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Maintenance Tickets
        </h1>

        {session &&
          (session.user.role === "ADMIN" ||
            session.user.role === "TECHNICIAN") && (
            <button
              onClick={() =>
                router.push("/dashboard/tickets/new")
              }
              className="px-4 py-2 bg-black text-white rounded"
            >
              + New Ticket
            </button>
          )}
      </div>

      {/* Empty state */}
      {tickets.length === 0 && (
        <p className="text-gray-500">
          No tickets found.
        </p>
      )}

      {/* Ticket list */}
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div
            key={ticket._id}
            onClick={() =>
              router.push(`/dashboard/tickets/${ticket._id}`)
            }
            className="p-4 border rounded cursor-pointer hover:bg-gray-50 transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">
                  {ticket.title}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Created on{" "}
                  {new Date(
                    ticket.createdAt
                  ).toLocaleString()}
                </p>
              </div>

              <StatusBadge status={ticket.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================
   Status Badge Component
================================ */
function StatusBadge({ status }) {
  const colors = {
    OPEN: "bg-blue-100 text-blue-700",
    MARKED_DOWN: "bg-yellow-100 text-yellow-700",
    RESOLVED: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-3 py-1 text-sm rounded-full ${
        colors[status] || "bg-gray-100"
      }`}
    >
      {status}
    </span>
  );
}
