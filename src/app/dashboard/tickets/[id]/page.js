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
  const [updating, setUpdating] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const textareaRef = useRef(null);

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
        setDraft(data.descriptionMarkdown || "");
      } catch (err) {
        console.error("Failed to fetch ticket", err);
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
    } catch (err) {
      console.error("Failed to update ticket", err);
    } finally {
      setUpdating(false);
    }
  };

  /* ================================
     Markdown helpers
  ================================ */
  const applyMarkdown = (before, after = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = draft.slice(start, end);

    const newText =
      draft.slice(0, start) +
      before +
      selected +
      after +
      draft.slice(end);

    setDraft(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = end + before.length;
    }, 0);
  };

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

  const canEdit =
    session &&
    (session.user.role === "ADMIN" ||
      session.user.role === "TECHNICIAN");

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* ================= Header ================= */}
      <div className="bg-white border rounded-xl p-6">
        <h1 className="text-2xl font-bold">
          {ticket.title}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Created on{" "}
          {new Date(ticket.createdAt).toLocaleString()}
        </p>
      </div>

      {/* ================= Description ================= */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">
            Description
          </h2>

          {canEdit && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-blue-600 hover:underline"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <>
            {/* ================= Toolbar ================= */}
            <div className="flex flex-wrap gap-2 border-b pb-3">
              <ToolbarButton onClick={() => applyMarkdown("**", "**")}>
                Bold
              </ToolbarButton>
              <ToolbarButton onClick={() => applyMarkdown("## ")}>
                Heading
              </ToolbarButton>
              <ToolbarButton onClick={() => applyMarkdown("`", "`")}>
                Inline Code
              </ToolbarButton>
              <ToolbarButton onClick={() => applyMarkdown("\n```js\n", "\n```\n")}>
                Code Block
              </ToolbarButton>
              <ToolbarButton onClick={() => applyMarkdown("- ")}>
                List
              </ToolbarButton>
              <ToolbarButton onClick={() => applyMarkdown("> ")}>
                Quote
              </ToolbarButton>
            </div>

            {/* ================= Editor + Preview ================= */}
            <div className="grid md:grid-cols-2 gap-4">
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={14}
                className="w-full border rounded-lg p-3 font-mono text-sm focus:outline-none focus:ring"
              />

              <div className="border rounded-lg p-4 overflow-auto bg-gray-50">
                <div className="prose max-w-none">
                  <ReactMarkdown>
                    {draft || "_Nothing to preview_"}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* ================= Actions ================= */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={saveMarkdown}
                disabled={updating}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {updating ? "Saving…" : "Save"}
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
          <article className="prose max-w-none">
            <ReactMarkdown>
              {ticket.descriptionMarkdown || "_No description provided_"}
            </ReactMarkdown>
          </article>
        )}
      </div>
    </div>
  );
}

/* ================================
   Toolbar Button
================================ */
function ToolbarButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
    >
      {children}
    </button>
  );
}
