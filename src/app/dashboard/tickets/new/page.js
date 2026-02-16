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

  const [recordingField, setRecordingField] = useState(null);

  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  /* ===============================
     Speech Recognition Setup
  =============================== */
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

      if (recordingField === "title") {
        setTitle((prev) => prev + " " + transcript);
      }

      if (recordingField === "description") {
        setDescription((prev) => prev + " " + transcript);
      }
    };

    recognition.onend = () => {
      setRecordingField(null);
    };

    recognitionRef.current = recognition;
  }, [recordingField]);

  const toggleRecording = (field) => {
    if (!recognitionRef.current) return;

    if (recordingField === field) {
      recognitionRef.current.stop();
      setRecordingField(null);
    } else {
      setRecordingField(field);
      recognitionRef.current.start();
    }
  };

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
      <div className="max-w-xl mx-auto mt-24 text-center text-red-600">
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            New Ticket
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and document a maintenance issue
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-2xl shadow-sm"
        >
          <div className="p-8 space-y-10">

            {/* Title */}
            <section>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>

              <div className="relative">
                <input
                  className="w-full p-3 border rounded-xl pr-12 focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="Brief summary of the issue"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => toggleRecording("title")}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded ${
                    recordingField === "title"
                      ? "bg-red-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  🎙
                </button>
              </div>
            </section>

            {/* Description */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-gray-700">
                  Description
                </h2>
                <span className="text-xs text-gray-400">
                  Markdown supported
                </span>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    className="h-72 p-4 border rounded-xl pr-12 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => toggleRecording("description")}
                    className={`absolute right-3 top-3 text-xs px-2 py-1 rounded ${
                      recordingField === "description"
                        ? "bg-red-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    🎙
                  </button>
                </div>

                <div className="h-72 p-4 border rounded-xl bg-gray-50 overflow-auto">
                  <div className="prose max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {description || "_Live preview…_"}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </section>

          </div>

          <div className="flex justify-end gap-3 px-8 py-5 border-t bg-gray-50 rounded-b-2xl">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 text-sm border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 text-sm bg-black text-white rounded-lg disabled:opacity-50"
            >
              {submitting ? "Creating…" : "Create Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =============================== */
function ToolbarButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 text-xs font-medium border rounded-lg hover:bg-white"
    >
      {children}
    </button>
  );
}
