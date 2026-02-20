"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";

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

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const [pendingStatus, setPendingStatus] = useState(null);

  const textareaRef = useRef(null);

  /* ================= Fetch ================= */
  useEffect(() => {
    if (!id) return;

    const fetchTicket = async () => {
      try {
        const res = await fetch(`/api/tickets/${id}`);
        const data = await res.json();
        setTicket(data);
        setDraft(data.descriptionMarkdown || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const canEdit =
    session &&
    (session.user.role === "ADMIN" ||
      session.user.role === "TECHNICIAN");

  /* ================= Save Markdown ================= */
  const saveMarkdown = async () => {
    await fetch(`/api/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ descriptionMarkdown: draft }),
    });

    setTicket((prev) => ({
      ...prev,
      descriptionMarkdown: draft,
    }));

    setIsEditing(false);
  };

  /* ================= Confirm Status Change ================= */
  const confirmStatusChange = async () => {
    if (!pendingStatus) return;

    const res = await fetch(`/api/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: pendingStatus }),
    });

    const data = await res.json();
    setTicket(data.ticket);
    setPendingStatus(null);
  };

  /* ================= Markdown Toolbar ================= */
  const applyMarkdown = (before, after = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = draft.slice(start, end);

    setDraft(
      draft.slice(0, start) +
        before +
        selected +
        after +
        draft.slice(end)
    );
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
      {ticket.status !== "OPEN" && ticket.markedDownBy && (
  <div className="flex items-center gap-3 mt-3">
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
      {ticket.markedDownBy.name?.charAt(0)}
    </div>

    <p className="text-sm text-gray-600">
      {ticket.status === "MARKED_DOWN"
        ? "Marked down"
        : "Resolved"}{" "}
      by{" "}
      <span className="font-medium">
        {ticket.markedDownBy.name}
      </span>
    </p>
  </div>
)}
      {/* ================= Status Actions ================= */}
      {canEdit && (
        <div className="flex gap-3">
          {["OPEN", "MARKED_DOWN", "RESOLVED"].map((status) => (
            <button
              key={status}
              onClick={() => setPendingStatus(status)}
              className={`px-4 py-2 rounded-lg border transition 
                ${
                  ticket.status === status
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      )}

      {/* ================= Status Confirmation Card ================= */}
      {pendingStatus && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full space-y-6">
            <h3 className="text-lg font-semibold">
              Change status to {pendingStatus}?
            </h3>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPendingStatus(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                className="px-4 py-2 bg-black text-white rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= Description ================= */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between">
          <h2 className="font-semibold">Description</h2>

          {canEdit && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm underline"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <>
            <div className="flex gap-2">
              <ToolbarButton onClick={() => applyMarkdown("**", "**")}>
                Bold
              </ToolbarButton>
              <ToolbarButton onClick={() => applyMarkdown("## ")}>
                Heading
              </ToolbarButton>
              <ToolbarButton onClick={() => applyMarkdown("`", "`")}>
                Code
              </ToolbarButton>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={12}
                className="w-full border rounded-lg p-3 font-mono text-sm"
              />

              <div className="border rounded-lg p-4 overflow-auto prose max-w-none">
                <ReactMarkdown>{draft}</ReactMarkdown>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveMarkdown}
                className="px-4 py-2 bg-black text-white rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setDraft(ticket.descriptionMarkdown);
                  setIsEditing(false);
                }}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="prose max-w-none">
            <ReactMarkdown>
              {ticket.descriptionMarkdown}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* ================= Activity Timeline ================= */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold mb-6">Activity</h2>

        <ActivityTimeline history={ticket.statusHistory} />
      </div>
    </div>
  );
}

/* ================= Components ================= */

function ToolbarButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
    >
      {children}
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