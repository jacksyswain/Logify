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

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-gray-400">
              Track and manage maintenance tickets
            </p>
          </div>
        </div>

        {/* Ticket Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket._id}
              onClick={() =>
                router.push(`/dashboard/tickets/${ticket._id}`)
              }
              className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:border-white/20 transition"
            >
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

                {/* 🔥 NEW FEATURE: Marked/Resolved by */}
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