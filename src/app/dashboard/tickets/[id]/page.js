"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";

export default function TicketDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ✏️ Editor state
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");

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
        setDraft(data.descriptionMarkdown);
      } catch (err) {
        console.error("Failed to load ticket", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  /* ================================
     Save markdown
  ================================ */
  const saveMarkdown = async () => {
    try {
      setUpdating(true);

      await fetch(`/api/tickets/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          descriptionMarkdown: draft,
        }),
      });

      setTicket((prev) => ({
        ...prev,
        descriptionMarkdown: draft,
      }));

      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update markdown", err);
    } finally {
      setUpdating(false);
    }
  };

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
            {new Date(ticket.createdAt).toLocaleString()}
          </p>
        </div>

        <StatusBadge status={ticket.status} />
      </div>

      {/* ================= Description ================= */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">
            Description
          </h2>

          {canEdit && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm underline"
            >
              Edit
            </button>
          )}
        </div>

        {/* ✏️ EDIT MODE */}
        {isEditing ? (
          <div className="grid md:grid-cols-2 gap-4">
            {/* Editor */}
            <textarea
              value={draft}
              onChange={(e) =>
                setDraft(e.target.value)
              }
              rows={10}
              className="w-full border rounded p-3 font-mono text-sm"
            />

            {/* Live Preview */}
            <div className="border rounded p-3 overflow-auto">
              <ReactMarkdown className="prose max-w-none">
                {draft}
              </ReactMarkdown>
            </div>

            {/* Actions */}
            <div className="flex gap-3 md:col-span-2">
              <button
                disabled={updating}
                onClick={saveMarkdown}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Save
              </button>

              <button
                disabled={updating}
                onClick={() => {
                  setDraft(ticket.descriptionMarkdown);
                  setIsEditing(false);
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* 👀 VIEW MODE */
          <article className="prose max-w-none">
            <ReactMarkdown>
              {ticket.descriptionMarkdown}
            </ReactMarkdown>
          </article>
        )}
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
