"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateUserPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "TECHNICIAN",
    image: "", // 👈 profile image URL
  });

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!session || session.user.role !== "ADMIN") {
    return (
      <div className="p-6 text-red-400 font-medium">
        Access denied. Admins only.
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Profile Image Upload
  const handleImageUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setForm((prev) => ({ ...prev, image: data.url }));
        setPreview(data.url);
      }
    } catch (err) {
      console.error("Upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // 👈 image included automatically
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create user");
      }

      router.push("/dashboard/admin/users");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto text-white">
      
      {/* ================= Header ================= */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Create User
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Add a new team member and assign a role.
        </p>
      </div>

      {/* ================= Card ================= */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Profile Image */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-full bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center">
              {preview ? (
                <img
                  src={preview}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm">
                  No Image
                </span>
              )}
            </div>

            <label className="text-sm cursor-pointer text-blue-400 hover:text-blue-300 transition">
              Upload Profile Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) =>
                  handleImageUpload(e.target.files[0])
                }
              />
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Full name
            </label>
            <input
              name="name"
              placeholder="John Doe"
              className="w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Email address
            </label>
            <input
              name="email"
              type="email"
              placeholder="john@company.com"
              className="w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Temporary password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className="w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={handleChange}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              User can change this after first login.
            </p>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              className="w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={handleChange}
            >
              <option value="TECHNICIAN">
                Technician – can manage tickets
              </option>
              <option value="ADMIN">
                Admin – full access
              </option>
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() =>
                router.push("/dashboard/admin/users")
              }
              className="px-5 py-2 border border-white/20 rounded-xl text-sm hover:bg-white/10 transition"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
