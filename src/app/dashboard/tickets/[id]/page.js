"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

const STATUS_STYLES = {
  OPEN: "bg-blue-100 text-blue-700 border-blue-300",
  MARKED_DOWN: "bg-yellow-100 text-yellow-700 border-yellow-300",
  RESOLVED: "bg-green-100 text-green-700 border-green-300",
};

export default function TicketDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const canEdit =
    session &&
    (session.user.role === "ADMIN" ||
      session.user.role === "TECHNICIAN");

  /* ================= Fetch Ticket ================= */
  useEffect(() => {
    if (!id) return;

    const fetchTicket = async () => {
      try {
        const res = await fetch(`/api/tickets/${id}`);
        const data = await res.json();
        setTicket(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  /* ================= Change Status ================= */
  const changeStatus = async (status) => {
    if (!canEdit) return;

    const res = await fetch(`/api/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    setTicket(data.ticket);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading ticket…
      </div>
    );

  if (!ticket)
    return <div className="p-6 text-red-500">Ticket not found</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">

      {/* ================= Header ================= */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{ticket.title}</h1>

        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1 text-xs rounded-full border ${STATUS_STYLES[ticket.status]}`}
          >
            {ticket.status}
          </span>

          <p className="text-sm text-gray-500">
            Created {new Date(ticket.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* ================= Status Buttons ================= */}
      {canEdit && (
        <div className="flex gap-3 flex-wrap">
          <StatusButton
            label="Open"
            active={ticket.status === "OPEN"}
            onClick={() => changeStatus("OPEN")}
          />
          <StatusButton
            label="Marked Down"
            active={ticket.status === "MARKED_DOWN"}
            onClick={() => changeStatus("MARKED_DOWN")}
          />
          <StatusButton
            label="Resolved"
            active={ticket.status === "RESOLVED"}
            onClick={() => changeStatus("RESOLVED")}
          />
        </div>
      )}

      {/* ================= Description ================= */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="font-semibold">Description</h2>

        <p className="text-gray-700 whitespace-pre-line">
          {ticket.description || "No description provided."}
        </p>
      </div>

      {/* ================= Activity ================= */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold mb-6">Activity</h2>

        <ActivityTimeline history={ticket.statusHistory} />
      </div>
    </div>
  );
}

/* ================= Components ================= */

function StatusButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg border transition 
        ${
          active
            ? "bg-black text-white"
            : "hover:bg-gray-100"
        }`}
    >
      {label}
    </button>
  );
}

function ActivityTimeline({ history }) {
  if (!history || history.length === 0)
    return <p className="text-sm text-gray-500">No activity yet</p>;

  return (
    <div className="space-y-6">
      {history.map((item, i) => (
        <div
          key={i}
          className="border rounded-xl p-4 bg-gray-50 hover:shadow-sm transition"
        >
          <p className="font-medium text-sm">
            Status → {item.status}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {item.changedBy?.name || "System"} •{" "}
            {new Date(item.changedAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}