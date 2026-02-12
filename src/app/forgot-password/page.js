"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔒 Mock behavior (no backend yet)
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white border rounded-3xl shadow-xl p-8 space-y-6">
          {/* Brand */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 flex items-center justify-center text-white font-bold text-xl">
              L
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Forgot your password?
            </h1>

            <p className="text-sm text-gray-500">
              We’ll send you a reset link if your email exists.
            </p>
          </div>

          {!submitted ? (
            /* ================= Form ================= */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
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

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-medium shadow hover:shadow-lg transition"
              >
                Send reset link
              </button>
            </form>
          ) : (
            /* ================= Success ================= */
            <div className="text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl">
                ✓
              </div>

              <p className="text-sm text-gray-600">
                If an account exists for
                <br />
                <span className="font-medium text-gray-900">
                  {email}
                </span>
                <br />
                you’ll receive a password reset link.
              </p>

              <Link
                href="/login"
                className="inline-block text-sm font-medium text-indigo-600 hover:underline"
              >
                Back to login
              </Link>
            </div>
          )}

          {/* Footer */}
          <p className="text-xs text-center text-gray-400">
            © {new Date().getFullYear()} Logify — Built by JPS
          </p>
        </div>

        {/* Bottom link */}
        {!submitted && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Remembered your password?{" "}
            <Link
              href="/login"
              className="text-indigo-600 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}
