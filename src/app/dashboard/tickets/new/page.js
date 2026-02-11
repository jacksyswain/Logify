"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function CreateTicketPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const textareaRef = useRef(null);

  /* ===============================
     Role Guard
  =============================== */
  if (status === "loading") return null;

  if (
    !session ||
    (session.user.role !== "ADMIN" &&
      session.user.role !== "TECHNICIAN")
  ) {
    return (
      <div className="max-w-xl mx-auto p-10 text-center text-red-600">
        You are not authorized to create tickets.
      </div>
    );
  }

  /* ===============================
     Markdown Toolbar
  =============================== */
  const applyMarkdown = (before, after = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = description.slice(start, end);

    const next =
      description.slice(0, start) +
      before +
      selected +
      after +
      description.slice(end);

    setDescription(next);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = end + before.length;
    }, 0);
  };

  /* ===============================
     Image Upload (Cloudinary)
  =============================== */
  const handleImageUpload = async (file) => {
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploading(false);

    if (res.ok) {
      setImages((prev) => [...prev, data.url]);
    } else {
      alert("Image upload failed");
    }
  };

  const removeImage = (url) => {
    setImages((prev) => prev.filter((img) => img !== url));
  };

  /* ===============================
     Submit Ticket
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        descriptionMarkdown: description,
        images,
      }),
    });

    setSubmitting(false);

    if (res.ok) {
      router.push("/dashboard");
    } else {
      alert("Failed to create ticket");
    }
  };

  /* ===============================
     UI
  =============================== */
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Create Ticket
        </h1>
        <p className="text-sm text-gray-500">
          Log a new maintenance issue
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl p-6 space-y-6"
      >
        {/* Title */}
        <div>
          <label className="text-sm font-medium">
            Title
          </label>
          <input
            type="text"
            placeholder="Short summary of the issue"
            className="mt-1 w-full p-3 border rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Markdown Editor */}
        <div className="space-y-3">
          <label className="text-sm font-medium">
            Description
          </label>

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
            <ToolbarButton
              onClick={() =>
                applyMarkdown("\n```js\n", "\n```\n")
              }
            >
              Code Block
            </ToolbarButton>
            <ToolbarButton onClick={() => applyMarkdown("- ")}>
              List
            </ToolbarButton>
          </div>

          {/* Editor + Preview */}
          <div className="grid md:grid-cols-2 gap-4">
            <textarea
              ref={textareaRef}
              className="h-64 p-3 border rounded-lg font-mono text-sm"
              placeholder="Write description in markdown..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              required
            />

            <div className="h-64 p-4 border rounded-lg overflow-auto bg-gray-50">
              <div className="prose max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {description || "_Live preview…_"}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Attach Images
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageUpload(e.target.files[0])
            }
          />

          {uploading && (
            <p className="text-sm text-gray-500">
              Uploading image…
            </p>
          )}

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-3">
              {images.map((img) => (
                <div
                  key={img}
                  className="relative group"
                >
                  <img
                    src={img}
                    alt="uploaded"
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(img)}
                    className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-black text-white rounded-lg disabled:opacity-50"
          >
            {submitting
              ? "Creating…"
              : "Create Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ===============================
   Components
=============================== */

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
