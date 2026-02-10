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
     Stats
  ================================ */
  const stats = {
    OPEN: tickets.filter((t) => t.status === "OPEN").length,
    MARKED_DOWN: tickets.filter((t) => t.status === "MARKED_DOWN").length,
    RESOLVED: tickets.filter((t) => t.status === "RESOLVED").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* ================= Header ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Track and manage maintenance tickets
          </p>
        </div>

        <div className="flex gap-3">
          {session?.user.role === "ADMIN" && (
            <button
              onClick={() =>
                router.push("/dashboard/admin/users")
              }
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Manage Users
            </button>
          )}

          {(session?.user.role === "ADMIN" ||
            session?.user.role === "TECHNICIAN") && (
            <button
              onClick={() =>
                router.push("/dashboard/tickets/new")
              }
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              + New Ticket
            </button>
          )}
        </div>
      </div>

      {/* ================= Stats Cards ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Open"
          value={stats.OPEN}
          color="blue"
          onClick={() => setStatusFilter("OPEN")}
        />
        <StatCard
          label="Marked Down"
          value={stats.MARKED_DOWN}
          color="yellow"
          onClick={() => setStatusFilter("MARKED_DOWN")}
        />
        <StatCard
          label="Resolved"
          value={stats.RESOLVED}
          color="green"
          onClick={() => setStatusFilter("RESOLVED")}
        />
      </div>

      {/* ================= Filters ================= */}
      <div className="bg-white p-4 rounded-xl border flex flex-col md:flex-row gap-4">
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="p-2 border rounded-lg w-full md:w-48"
        >
          <option value="ALL">All Status</option>
          <option value="OPEN">Open</option>
          <option value="MARKED_DOWN">Marked Down</option>
          <option value="RESOLVED">Resolved</option>
        </select>

        <input
          type="text"
          placeholder="Search tickets…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded-lg w-full"
        />
      </div>

      {/* ================= Empty State ================= */}
      {filteredTickets.length === 0 && (
        <div className="bg-white rounded-xl border py-20 text-center text-gray-500">
          <p className="text-lg font-medium">
            No tickets found
          </p>
          <p className="text-sm">
            Try adjusting filters or create a new ticket
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
            className="bg-white border rounded-xl p-5 cursor-pointer hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">
                  {ticket.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date(ticket.createdAt).toLocaleString()}
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
   Components
================================ */

function StatCard({ label, value, color, onClick }) {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    yellow: "bg-yellow-50 text-yellow-700",
    green: "bg-green-50 text-green-700",
  };

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl p-5 border hover:shadow transition ${colors[color]}`}
    >
      <p className="text-sm font-medium">
        {label}
      </p>
      <p className="text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}

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
