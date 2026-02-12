"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

/* ================= Utils ================= */
function getInitials(nameOrEmail = "") {
  const base = nameOrEmail.split("@")[0];
  const parts = base.split(/[.\s_-]/);
  return parts.slice(0, 2).map(p => p[0]?.toUpperCase()).join("") || "?";
}

export default function AccountSettingsPage() {
  const { data: session, status } = useSession();

  const [name, setName] = useState(session?.user?.name || "");
  const [saving, setSaving] = useState(false);

  if (status === "loading") return null;

  if (!session) {
    return (
      <div className="text-red-600">
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

    // 🔜 Hook backend later
    await new Promise(res => setTimeout(res, 800));

    setSaving(false);
    alert("Profile updated (mock)");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* ================= Header ================= */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your profile and security preferences
        </p>
      </div>

      {/* ================= Profile Card ================= */}
      <section className="bg-white border rounded-2xl p-6 space-y-6">
        <h2 className="text-lg font-semibold">
          Profile
        </h2>

        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-xl font-semibold">
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 grid sm:grid-cols-2 gap-4">
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

        <div className="flex justify-end">
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="px-6 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-900 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </section>

      {/* ================= Security Card ================= */}
      <section className="bg-white border rounded-2xl p-6 space-y-6">
        <h2 className="text-lg font-semibold">
          Security
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
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

        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">
            Password change is currently mocked.
          </p>

          <button
            className="px-5 py-2 rounded-lg border text-sm hover:bg-gray-50"
          >
            Update password
          </button>
        </div>
      </section>

      {/* ================= Danger Zone ================= */}
      <section className="bg-red-50 border border-red-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-red-700">
          Danger zone
        </h2>

        <p className="text-sm text-red-600">
          Account deletion is disabled in this version.
        </p>

        <button
          disabled
          className="px-5 py-2 rounded-lg bg-red-200 text-red-700 text-sm cursor-not-allowed"
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
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={`
          w-full px-3 py-2 rounded-lg border text-sm
          ${disabled
            ? "bg-gray-100 text-gray-500"
            : "bg-white focus:outline-none focus:ring-2 focus:ring-black/10"}
        `}
      />
    </div>
  );
}
