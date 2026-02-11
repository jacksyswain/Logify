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

  /* ================= Fetch ================= */
  useEffect(() => {
    if (!id) return;

    fetch(`/api/tickets/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTicket(data);
        setDraft(data.descriptionMarkdown);
        setLoading(false);
      });
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

  /* ================= Status Change ================= */
  const changeStatus = async (status) => {
    const res = await fetch(`/api/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    setTicket(data.ticket);
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

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading ticket…
      </div>
    );
  }

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
                className="border rounded p-3 font-mono text-sm"
                rows={10}
              />

              <div className="border rounded p-3 overflow-auto prose max-w-none">
                <ReactMarkdown>
                  {draft}
                </ReactMarkdown>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveMarkdown}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
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

/* ================= Components ================= */

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
      className="px-3 py-1 border rounded text-sm"
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
