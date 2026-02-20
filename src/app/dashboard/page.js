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

  /* ================= Fetch Tickets ================= */
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

  /* ================= Filter + Search ================= */
  useEffect(() => {
    let result = [...tickets];

    if (statusFilter !== "ALL") {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (search.trim()) {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredTickets(result);
  }, [statusFilter, search, tickets]);

  /* ================= Stats ================= */
  const stats = {
    OPEN: tickets.filter((t) => t.status === "OPEN").length,
    MARKED_DOWN: tickets.filter((t) => t.status === "MARKED_DOWN").length,
    RESOLVED: tickets.filter((t) => t.status === "RESOLVED").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto p-6 space-y-10 text-white">

        {/* ================= Header ================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-gray-400">
              Track and manage maintenance tickets
            </p>
          </div>

          <div className="flex gap-3">
            {session?.user.role === "ADMIN" && (
              <button
                onClick={() => router.push("/dashboard/admin/users")}
                className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition"
              >
                Manage Users
              </button>
            )}

            {(session?.user.role === "ADMIN" ||
              session?.user.role === "TECHNICIAN") && (
              <button
                onClick={() => router.push("/dashboard/tickets/new")}
                className="px-5 py-2 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition"
              >
                + New Ticket
              </button>
            )}
          </div>
        </div>

        {/* ================= Stats Cards ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
        <div className="bg-white/5 backdrop-blur-xl p-4 rounded-xl border border-white/10 flex flex-col md:flex-row gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded-lg bg-black border border-white/20 text-white w-full md:w-48"
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
            className="p-2 rounded-lg bg-black border border-white/20 text-white w-full"
          />
        </div>

        {/* ================= Empty ================= */}
        {filteredTickets.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl py-20 text-center text-gray-400">
            No tickets found
          </div>
        )}

        {/* ================= Ticket Cards ================= */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket._id}
              onClick={() =>
                router.push(`/dashboard/tickets/${ticket._id}`)
              }
              className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:border-white/20 transition"
            >
              {/* Image */}
              {ticket.images?.[0] ? (
                <div className="relative w-full h-44 overflow-hidden">
                  <img
                    src={ticket.images[0]}
                    alt="ticket"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="h-44 bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center text-gray-400 text-sm">
                  No Image
                </div>
              )}

              {/* Content */}
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start gap-3">
                  <h2 className="font-semibold text-lg line-clamp-2">
                    {ticket.title}
                  </h2>
                  <StatusBadge status={ticket.status} />
                </div>

                <p className="text-sm text-gray-400">
                  {new Date(ticket.createdAt).toLocaleString()}
                </p>

                {/* Marked / Resolved By */}
                {ticket.status !== "OPEN" && ticket.markedDownBy && (
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-300">
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-medium">
                      {ticket.markedDownBy.name?.charAt(0)}
                    </div>

                    <span>
                      {ticket.status === "MARKED_DOWN"
                        ? "Marked down"
                        : "Resolved"}{" "}
                      by{" "}
                      <span className="font-semibold text-white">
                        {ticket.markedDownBy.name}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

/* ================= Components ================= */

function StatCard({ label, value, color, onClick }) {
  const colors = {
    blue: "from-blue-500/20 to-blue-600/10 text-blue-300",
    yellow: "from-yellow-500/20 to-yellow-600/10 text-yellow-300",
    green: "from-green-500/20 to-green-600/10 text-green-300",
  };

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-2xl p-6 border border-white/10 bg-gradient-to-br ${colors[color]} hover:shadow-xl transition`}
    >
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="text-4xl font-bold mt-1">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    OPEN: "bg-blue-500/20 text-blue-300",
    MARKED_DOWN: "bg-yellow-500/20 text-yellow-300",
    RESOLVED: "bg-green-500/20 text-green-300",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  );
}