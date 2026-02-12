"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

/* ================= Utils ================= */
function getInitials(nameOrEmail = "") {
  const base = nameOrEmail.split("@")[0];
  const parts = base.split(/[.\s_-]/);
  return (
    parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?"
  );
}

export default function AccountSettingsPage() {
  const { data: session, status } = useSession();

  const [name, setName] = useState(session?.user?.name || "");
  const [saving, setSaving] = useState(false);

  if (status === "loading") return null;

  if (!session) {
    return (
      <div className="p-6 text-center text-red-600">
        Unauthorized
      </div>
    );
  }

  const initials = getInitials(
    session.user.name || session.user.email
  );

  /* ================= Save Profile (mock) ================= */
  const handleSaveProfile = async () => {
    setSaving(true);
    await new Promise((res) => setTimeout(res, 800));
    setSaving(false);
    alert("Profile updated (mock)");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* ================= Header ================= */}
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-gray-500">
          Manage your profile and security preferences
        </p>
      </header>

      {/* ================= Profile ================= */}
      <section className="bg-white border rounded-2xl p-6 sm:p-8 space-y-8">
        <h2 className="text-lg font-semibold">
          Profile
        </h2>

        {/* Avatar + Fields */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
          {/* Avatar */}
          <div className="flex justify-center sm:justify-start">
            <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-xl font-semibold">
              {initials}
            </div>
          </div>

          {/* Fields */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Full name"
              value={name}
              onChange={setName}
            />

            <Field
              label="Email"
              value={session.user.email}
              disabled
            />

            <Field
              label="Role"
              value={session.user.role}
              disabled
            />
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-900 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </section>

      {/* ================= Security ================= */}
      <section className="bg-white border rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-semibold">
          Security
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="New password"
            placeholder="••••••••"
            type="password"
          />
          <Field
            label="Confirm password"
            placeholder="••••••••"
            type="password"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs text-gray-500">
            Password change is currently mocked.
          </p>

          <button className="w-full sm:w-auto px-5 py-2.5 rounded-lg border text-sm hover:bg-gray-50">
            Update password
          </button>
        </div>
      </section>

      {/* ================= Danger Zone ================= */}
      <section className="bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-semibold text-red-700">
          Danger zone
        </h2>

        <p className="text-sm text-red-600 max-w-xl">
          Account deletion is disabled in this version. Contact an
          administrator if you need assistance.
        </p>

        <button
          disabled
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-red-200 text-red-700 text-sm cursor-not-allowed"
        >
          Delete account
        </button>
      </section>
    </div>
  );
}

/* ================= Field ================= */
function Field({
  label,
  value,
  onChange,
  disabled,
  placeholder,
  type = "text",
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-500">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={`
          w-full px-3 py-2.5 rounded-lg border text-sm
          transition
          ${
            disabled
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
          }
        `}
      />
    </div>
  );
}
