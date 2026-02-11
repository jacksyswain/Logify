"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";

export default function TicketDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const textareaRef = useRef(null);

  /* ================================
     Fetch Ticket
  ================================ */
  useEffect(() => {
    if (!id) return;

    const fetchTicket = async () => {
      try {
        const res = await fetch(`/api/tickets/${id}`);
        const data = await res.json();

        setTicket(data);
        setDraft(data.descriptionMarkdown || "");
      } catch (err) {
        console.error("Failed to load ticket", err);
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

  /* ================================
     Save Markdown
  ================================ */
  const saveMarkdown = async () => {
    await fetch(`/api/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        descriptionMarkdown: draft,
      }),
    });

    setTicket((prev) => ({
      ...prev,
      descriptionMarkdown: draft,
    }));

    setIsEditing(false);
  };

  /* ================================
     Change Status
  ================================ */
  const changeStatus = async (status) => {
    const res = await fetch(`/api/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    setTicket(data.ticket);
  };

  /* ================================
     Markdown Toolbar
  ================================ */
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

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = end + before.length;
    }, 0);
  };

  /* ================================
     States
  ================================ */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading ticket…
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

  /* ================================
     UI
  ================================ */
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          {ticket.title}
        </h1>
        <p className="text-sm text-gray-500">
          Created {new Date(ticket.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Status Actions */}
      {canEdit && (
        <div className="flex gap-3">
          <StatusButton
            label="Open"
            onClick={() => changeStatus("OPEN")}
          />
          <StatusButton
            label="Marked Down"
            onClick={() => changeStatus("MARKED_DOWN")}
          />
          <StatusButton
            label="Resolved"
            onClick={() => changeStatus("RESOLVED")}
          />
        </div>
      )}

      {/* Description */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
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

        {isEditing ? (
          <>
            {/* Toolbar */}
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

            {/* Editor + Preview */}
            <div className="grid md:grid-cols-2 gap-4">
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={12}
                className="w-full border rounded p-3 font-mono text-sm"
              />

              <div className="border rounded p-4 overflow-auto">
                <div className="prose max-w-none">
                  <ReactMarkdown>
                    {draft}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={saveMarkdown}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setDraft(ticket.descriptionMarkdown);
                  setIsEditing(false);
                }}
                className="px-4 py-2 border rounded"
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

      {/* Activity Timeline */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-semibold mb-4">
          Activity
        </h2>

        <ActivityTimeline history={ticket.statusHistory} />
      </div>
    </div>
  );
}

/* ================================
   Components
================================ */

function StatusButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
    >
      {label}
    </button>
  );
}

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
  if (!history || history.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No activity yet
      </p>
    );
  }

  return (
    <div className="relative pl-6 space-y-6">
      <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200" />

      {history.map((item, i) => (
        <div key={i} className="relative flex gap-4">
          <div className="w-4 h-4 bg-black rounded-full mt-1" />
          <div className="bg-gray-50 border rounded-lg p-4 w-full">
            <p className="font-medium text-sm">
              Status → {item.status}
            </p>
            <p className="text-xs text-gray-500">
              {item.changedBy?.name || "System"} •{" "}
              {new Date(item.changedAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
