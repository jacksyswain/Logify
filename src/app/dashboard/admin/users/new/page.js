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
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔐 Admin guard
  if (!session || session.user.role !== "ADMIN") {
    return (
      <div className="p-6 text-red-600 font-medium">
        Access denied. Admins only.
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
    <div className="max-w-xl mx-auto">
      {/* ================= Header ================= */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Create User
        </h1>
        <p className="text-sm text-gray-500">
          Add a new team member and assign a role.
        </p>
      </div>

      {/* ================= Card ================= */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Full name
            </label>
            <input
              name="name"
              placeholder="John Doe"
              className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email address
            </label>
            <input
              name="email"
              type="email"
              placeholder="john@company.com"
              className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Temporary password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              onChange={handleChange}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              User can change this after first login.
            </p>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Role
            </label>
            <select
              name="role"
              className="w-full p-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black"
              onChange={handleChange}
              value={form.role}
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
            <div className="text-sm text-red-600">
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
              className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="px-5 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
