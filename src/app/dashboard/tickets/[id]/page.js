"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";

export default function TicketDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  /* ================================
     Fetch ticket
  ================================ */
  useEffect(() => {
    if (!id) return;

    const fetchTicket = async () => {
      try {
        const res = await fetch(`/api/tickets/${id}`);
        const data = await res.json();
        setTicket(data);
      } catch (err) {
        console.error("Failed to load ticket", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  /* ================================
     Update ticket status
  ================================ */
  const updateStatus = async (status) => {
    try {
      setUpdating(true);

      await fetch(`/api/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      setTicket((prev) => ({
        ...prev,
        status,
      }));
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdating(false);
    }
  };

  /* ================================
     Loading state
  ================================ */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading ticket...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-6 text-red-500">
        Ticket not found
      </div>
    );
  }

  const canEdit =
    session &&
    (session.user.role === "ADMIN" ||
      session.user.role === "TECHNICIAN");

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* ================= Header ================= */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">
            {ticket.title}
          </h1>
          <p className="text-sm text-gray-500">
            Created{" "}
            {new Date(
              ticket.createdAt
            ).toLocaleString()}
          </p>
        </div>

        <StatusBadge status={ticket.status} />
      </div>

      {/* ================= Actions ================= */}
      {canEdit && (
        <div className="flex gap-3">
          {ticket.status !== "MARKED_DOWN" && (
            <button
              disabled={updating}
              onClick={() =>
                updateStatus("MARKED_DOWN")
              }
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Mark Down
            </button>
          )}

          {ticket.status !== "RESOLVED" && (
            <button
              disabled={updating}
              onClick={() =>
                updateStatus("RESOLVED")
              }
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Resolve
            </button>
          )}
        </div>
      )}

      {/* ================= Description ================= */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="font-semibold mb-3">
          Description
        </h2>

        <article className="prose max-w-none">
          <ReactMarkdown>
            {ticket.descriptionMarkdown}
          </ReactMarkdown>
        </article>
      </div>

      {/* ================= Images ================= */}
      {ticket.images?.length > 0 && (
        <div className="bg-white border rounded-lg p-6">
          <h2 className="font-semibold mb-4">
            Images
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ticket.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="Ticket"
                className="rounded border object-cover"
              />
            ))}
          </div>
        </div>
      )}

      {/* ================= Meta ================= */}
      <div className="text-sm text-gray-500">
        Created by:{" "}
        {ticket.createdBy?.name ||
          ticket.createdBy?.email ||
          "Unknown"}
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
      className={`px-3 py-1 text-sm font-medium rounded-full ${
        styles[status] || "bg-gray-100"
      }`}
    >
      {status}
    </span>
  );
}
