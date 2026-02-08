"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function TicketDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const isEditor =
    session &&
    (session.user.role === "ADMIN" ||
      session.user.role === "TECHNICIAN");

  useEffect(() => {
    const fetchTicket = async () => {
      const res = await fetch(`/api/tickets/${id}`);
      const data = await res.json();
      setTicket(data);
      setDescription(data.descriptionMarkdown || "");
      setLoading(false);
    };

    fetchTicket();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading ticket...</div>;
  }

  if (!ticket || ticket.message) {
    return <div className="p-6 text-red-600">Ticket not found.</div>;
  }

  /* ========================
     Actions
  ========================= */

  const updateTicket = async (payload) => {
    setSaving(true);

    const res = await fetch(`/api/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      setTicket(data.ticket);
      setEditing(false);
    } else {
      alert("Action failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{ticket.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Created on {new Date(ticket.createdAt).toLocaleString()}
          </p>
        </div>

        <StatusBadge status={ticket.status} />
      </div>

      {/* Metadata */}
      {session && ticket.createdBy && (
        <div className="text-sm text-gray-600">
          <p>
            Created by{" "}
            <span className="font-medium">
              {ticket.createdBy.name}
            </span>
          </p>

          {ticket.markedDownBy && (
            <p>
              Marked down by{" "}
              <span className="font-medium">
                {ticket.markedDownBy.name}
              </span>{" "}
              on{" "}
              {new Date(ticket.markedDownAt).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* Description */}
      {!editing ? (
        <div className="prose max-w-none border p-4 rounded bg-gray-50">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {ticket.descriptionMarkdown}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          className="w-full h-64 p-3 border rounded font-mono"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      )}

      {/* Images */}
      {ticket.images?.length > 0 && (
        <div>
          <h2 className="font-semibold mb-2">Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ticket.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="ticket"
                className="w-full h-32 object-cover rounded border"
              />
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons (Editors only) */}
      {isEditor && (
        <div className="flex gap-3 flex-wrap pt-4 border-t">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 border rounded"
            >
              ✏️ Edit
            </button>
          ) : (
            <>
              <button
                onClick={() =>
                  updateTicket({
                    descriptionMarkdown: description,
                  })
                }
                disabled={saving}
                className="px-4 py-2 bg-black text-white rounded"
              >
                💾 Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </>
          )}

          {ticket.status !== "MARKED_DOWN" && (
            <button
              onClick={() => updateTicket({ status: "MARKED_DOWN" })}
              className="px-4 py-2 bg-yellow-500 text-white rounded"
            >
              ⚠️ Mark Down
            </button>
          )}

          {ticket.status !== "RESOLVED" && (
            <button
              onClick={() => updateTicket({ status: "RESOLVED" })}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              ✅ Resolve
            </button>
          )}
        </div>
      )}
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
