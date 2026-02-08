"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      const res = await fetch("/api/tickets");
      const data = await res.json();
      setTickets(data);
      setFilteredTickets(data);
      setLoading(false);
    };

    fetchTickets();
  }, []);

  // 🔍 Filter + Search logic
  useEffect(() => {
    let result = [...tickets];

    if (statusFilter !== "ALL") {
      result = result.filter(
        (t) => t.status === statusFilter
      );
    }

    if (search.trim()) {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredTickets(result);
  }, [statusFilter, search, tickets]);

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading tickets...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        {session?.user.role === "ADMIN" && (
  <a
    href="/dashboard/admin/users/new"
    className="text-sm underline"
  >
    + Create User
  </a>
)}

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

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="p-2 border rounded w-full md:w-48"
        >
          <option value="ALL">All Status</option>
          <option value="OPEN">Open</option>
          <option value="MARKED_DOWN">Marked Down</option>
          <option value="RESOLVED">Resolved</option>
        </select>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Empty state */}
      {filteredTickets.length === 0 && (
        <p className="text-gray-500">
          No tickets match your filters.
        </p>
      )}

      {/* Ticket List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
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
                <p className="text-sm text-gray-500">
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
   Status Badge
================================ */
function StatusBadge({ status }) {
  const styles = {
    OPEN: "bg-blue-100 text-blue-700",
    MARKED_DOWN: "bg-yellow-100 text-yellow-700",
    RESOLVED: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-3 py-1 text-sm rounded-full ${
        styles[status] || "bg-gray-100"
      }`}
    >
      {status}
    </span>
  );
}
