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

  /* ================================
     Fetch tickets
  ================================ */
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/tickets");
        const data = await res.json();

        setTickets(data);
        setFilteredTickets(data);
      } catch (err) {
        console.error("Failed to load tickets", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  /* ================================
     Filter + Search
  ================================ */
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

  /* ================================
     Loading state
  ================================ */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading tickets...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* ================= Header ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Maintenance Tickets
          </h1>
          <p className="text-sm text-gray-500">
            {filteredTickets.length} ticket(s)
          </p>
        </div>

        <div className="flex gap-3">
          {session?.user.role === "ADMIN" && (
            <button
              onClick={() =>
                router.push("/dashboard/admin/users/new")
              }
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              + Create User
            </button>
          )}

          {(session?.user.role === "ADMIN" ||
            session?.user.role === "TECHNICIAN") && (
            <button
              onClick={() =>
                router.push("/dashboard/tickets/new")
              }
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              + New Ticket
            </button>
          )}
        </div>
      </div>

      {/* ================= Filters ================= */}
      <div className="bg-white p-4 rounded-lg border flex flex-col md:flex-row gap-4">
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

        <input
          type="text"
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* ================= Empty State ================= */}
      {filteredTickets.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg font-medium">
            No tickets found
          </p>
          <p className="text-sm">
            Try changing filters or create a new ticket.
          </p>
        </div>
      )}

      {/* ================= Ticket List ================= */}
      <div className="grid gap-4">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket._id}
            onClick={() =>
              router.push(
                `/dashboard/tickets/${ticket._id}`
              )
            }
            className="bg-white border rounded-lg p-4 cursor-pointer hover:shadow transition"
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
      className={`px-3 py-1 text-xs font-medium rounded-full ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
