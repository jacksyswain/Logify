"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* ================= Card ================= */}
        <div className="bg-white border rounded-3xl shadow-xl p-8 space-y-6">
          {/* Brand */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 flex items-center justify-center text-white font-bold text-xl">
              L
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back to Logify
            </h1>
            <p className="text-sm text-gray-500">
              Sign in to manage maintenance tickets
            </p>
          </div>

          {/* ================= Form ================= */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-medium shadow hover:shadow-lg hover:scale-[1.01] transition disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <div className="flex-1 h-px bg-gray-200" />
            Secure login
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Footer */}
          <p className="text-xs text-center text-gray-400">
            © {new Date().getFullYear()} Logify — Built by JPS
          </p>
        </div>
      </div>
    </main>
  );
}
