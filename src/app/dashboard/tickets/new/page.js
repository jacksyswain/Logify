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
  const [dragActive, setDragActive] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

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
      <div className="mt-24 text-center text-red-400">
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

    setDescription(
      description.slice(0, start) +
        before +
        selected +
        after +
        description.slice(end)
    );

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = end + before.length;
    }, 0);
  };

  /* ===============================
     Upload
  =============================== */
  const uploadFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;

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

  const handleFiles = (files) => {
    [...files].forEach(uploadFile);
  };

  const removeImage = (url) => {
    setImages((prev) => prev.filter((img) => img !== url));
  };

  /* ===============================
     Drag & Drop
  =============================== */
  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => setDragActive(false);

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  /* ===============================
     Submit
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
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          New Ticket
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Create and document a maintenance issue
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
      >
        <div className="p-8 space-y-10">
          {/* Title */}
          <section>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              className="w-full p-3 rounded-xl bg-black border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Brief summary of the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </section>

          {/* Description */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-300">
                Description
              </h2>
              <span className="text-xs text-gray-500">
                Markdown supported
              </span>
            </div>

            {/* Toolbar */}
            <div className="flex gap-2 flex-wrap border border-white/10 bg-black/40 rounded-xl p-2">
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
            </div>

            {/* Editor */}
            <div className="grid lg:grid-cols-2 gap-6">
              <textarea
                ref={textareaRef}
                className="h-72 p-4 rounded-xl bg-black border border-white/10 text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <div className="h-72 p-4 rounded-xl bg-black/40 border border-white/10 overflow-auto">
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {description || "_Live preview…_"}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </section>

          {/* Images */}
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-gray-300">
              Attach Images
            </h2>

            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${
                dragActive
                  ? "border-white bg-white/10"
                  : "border-white/20 bg-black/40"
              }`}
            >
              <p className="text-sm text-gray-400">
                Drag & drop images or{" "}
                <span className="underline font-medium">
                  browse
                </span>
              </p>
              {uploading && (
                <p className="mt-2 text-xs text-gray-500">
                  Uploading…
                </p>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => handleFiles(e.target.files)}
            />

            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                {images.map((img) => (
                  <div key={img} className="relative group">
                    <img
                      src={img}
                      className="w-full h-24 object-cover rounded-xl border border-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(img)}
                      className="absolute top-1 right-1 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-8 py-5 border-t border-white/10 bg-black/40 rounded-b-2xl">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 text-sm rounded-lg border border-white/20 text-gray-300 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 text-sm rounded-lg bg-white text-black font-medium hover:bg-gray-200 disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ===============================
   Toolbar Button
=============================== */
function ToolbarButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-white/20 text-gray-300 hover:bg-white/10"
    >
      {children}
    </button>
  );
}
