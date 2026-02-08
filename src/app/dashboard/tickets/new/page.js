"use client";

import { useState } from "react";
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

  // 🔐 Role guard
  if (status === "loading") return null;

  if (
    !session ||
    (session.user.role !== "ADMIN" &&
      session.user.role !== "TECHNICIAN")
  ) {
    return (
      <p className="p-6 text-red-600">
        You are not authorized to create tickets.
      </p>
    );
  }

  // 📸 Upload image to Cloudinary
  const handleImageUpload = async (file) => {
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

  // 🚀 Submit ticket
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
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Create New Ticket
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <input
          type="text"
          placeholder="Ticket title"
          className="w-full p-3 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Markdown Editor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea
            className="w-full h-64 p-3 border rounded font-mono"
            placeholder="Write description in markdown..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="h-64 p-3 border rounded overflow-auto bg-gray-50">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {description || "Markdown preview..."}
            </ReactMarkdown>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageUpload(e.target.files[0])
            }
          />
          {uploading && (
            <p className="text-sm text-gray-500 mt-1">
              Uploading image...
            </p>
          )}
        </div>

        {/* Image Preview */}
        {images.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="uploaded"
                className="w-24 h-24 object-cover rounded border"
              />
            ))}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-black text-white rounded disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create Ticket"}
        </button>
      </form>
    </div>
  );
}
