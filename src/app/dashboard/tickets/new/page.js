"use client";

import { useState, useRef, useEffect } from "react";
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

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const activeFieldRef = useRef(null);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript;

      if (activeFieldRef.current === "title") {
        setTitle((prev) => prev + " " + transcript);
      }

      if (activeFieldRef.current === "description") {
        setDescription((prev) => prev + " " + transcript);
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  if (status === "loading") return null;

  if (
    !session ||
    (session.user.role !== "ADMIN" &&
      session.user.role !== "TECHNICIAN")
  ) {
    return (
      <div className="max-w-xl mx-auto mt-24 text-center text-red-400">
        You are not authorized to create tickets.
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10 text-white">

        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            New Ticket
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Create and document a maintenance issue
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"
        >
          <div className="p-10 space-y-12">

            {/* Title */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-300">
                  Title
                </label>

                <button
                  type="button"
                  onClick={() => {
                    activeFieldRef.current = "title";
                    toggleRecording();
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-xl transition ${
                    isRecording && activeFieldRef.current === "title"
                      ? "bg-red-600 text-white"
                      : "bg-white/10 hover:bg-white/20 text-gray-300"
                  }`}
                >
                  {isRecording && activeFieldRef.current === "title"
                    ? "Stop 🎙"
                    : "Voice 🎙"}
                </button>
              </div>

              <input
                className="w-full p-3.5 border border-white/20 rounded-2xl bg-black text-white focus:outline-none focus:ring-2 focus:ring-white/30 transition"
                placeholder="Brief summary of the issue"
                value={title}
                onFocus={() => (activeFieldRef.current = "title")}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </section>

            {/* Description */}
            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-300">
                  Description
                </h2>
                <span className="text-xs text-gray-500">
                  Markdown supported
                </span>
              </div>

              <div className="flex gap-2 flex-wrap bg-white/5 border border-white/10 rounded-2xl p-3">
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

              <div className="grid lg:grid-cols-2 gap-6">
                <textarea
                  ref={textareaRef}
                  className="h-72 p-4 border border-white/20 rounded-2xl bg-black text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-white/30 transition"
                  value={description}
                  onFocus={() => (activeFieldRef.current = "description")}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />

                <div className="h-72 p-4 border border-white/10 rounded-2xl bg-white/5 overflow-auto">
                  <div className="prose max-w-none prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {description || "_Live preview…_"}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </section>

            {/* Images */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-300">
                Attach Images
              </h2>

              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current.click()}
                className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition ${
                  dragActive
                    ? "border-white bg-white/10"
                    : "border-white/20 bg-white/5 hover:bg-white/10"
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
                onChange={(e) =>
                  handleFiles(e.target.files)
                }
              />

              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                  {images.map((img) => (
                    <div key={img} className="relative group">
                      <img
                        src={img}
                        className="w-full h-24 object-cover rounded-2xl border border-white/10"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(img)}
                        className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="flex justify-end gap-3 px-10 py-6 border-t border-white/10 bg-white/5 rounded-b-3xl">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="px-5 py-2 text-sm border border-white/20 rounded-xl hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 text-sm bg-white text-black font-medium rounded-xl hover:bg-gray-200 transition"
            >
              {submitting ? "Creating…" : "Create Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ToolbarButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 text-xs font-medium border border-white/20 rounded-lg hover:bg-white/10 transition text-gray-300"
    >
      {children}
    </button>
  );
}
