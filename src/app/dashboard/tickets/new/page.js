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

  /* 🔥 Voice States */
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const activeFieldRef = useRef(null);

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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>

                <button
                  type="button"
                  onClick={() => {
                    activeFieldRef.current = "title";
                    toggleRecording();
                  }}
                  className={`px-3 py-1 text-xs rounded-lg ${isRecording && activeFieldRef.current === "title"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-black"
                    }`}
                >
                  {isRecording && activeFieldRef.current === "title"
                    ? "Stop 🎙"
                    : "Voice 🎙"}
                </button>
              </div>

              <input
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10"
                placeholder="Brief summary of the issue"
                value={title}
                onFocus={() => (activeFieldRef.current = "title")}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </section>


            {/* Description */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-gray-700">
                    Description
                  </h2>

                  <button
                    type="button"
                    onClick={() => {
                      activeFieldRef.current = "description";
                      toggleRecording();
                    }}
                    className={`px-3 py-1 text-xs rounded-lg ${isRecording && activeFieldRef.current === "description"
                        ? "bg-red-600 text-white"
                        : "bg-gray-200 text-black"
                      }`}
                  >
                    {isRecording && activeFieldRef.current === "description"
                      ? "Stop 🎙"
                      : "Voice 🎙"}
                  </button>
                </div>

                <span className="text-xs text-gray-400">
                  Markdown supported
                </span>
              </div>

              {/* Toolbar */}
              <div className="flex gap-2 flex-wrap bg-gray-50 border rounded-xl p-2">
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
                  className="h-72 p-4 border rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  value={description}
                  onFocus={() => (activeFieldRef.current = "description")}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />

                <div className="h-72 p-4 border rounded-xl bg-gray-50 overflow-auto">
                  <div className="prose max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {description || "_Live preview…_"}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </section>

            {/* Images */}
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-gray-700">
                Attach Images
              </h2>

              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${dragActive
                  ? "border-black bg-gray-100"
                  : "border-gray-300 bg-white"
                  }`}
              >
                <p className="text-sm text-gray-600">
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
                        className="w-full h-24 object-cover rounded-xl border"
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
            </section>
          </div>



          {/* Footer */}
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

/* ===============================
   Toolbar Button
=============================== */
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
