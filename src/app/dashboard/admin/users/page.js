"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UsersListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Admin guard
  if (status === "loading") {
    return <p className="p-6">Checking access...</p>;
  }

  if (!session || session.user.role !== "ADMIN") {
    return (
      <p className="p-6 text-red-600">
        Access denied. Admins only.
      </p>
    );
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading users...
      </div>
    );
  }

  return (
  <div className="max-w-7xl mx-auto p-6 space-y-6 text-white">
    
    {/* Header */}
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold tracking-tight">
        Users
      </h1>

      <button
        onClick={() =>
          router.push("/dashboard/admin/users/new")
        }
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
      >
        + Create User
      </button>
    </div>

    {/* Users Table */}
    <div className="overflow-x-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
      <table className="w-full text-sm">
        <thead className="bg-white/5 border-b border-white/10 text-gray-300">
          <tr>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Role</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Created</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-white/5">
          {users.map((user) => (
            <tr
              key={user._id}
              className="transition hover:bg-white/5"
            >
              <td className="p-4">{user.name}</td>
              <td className="p-4 text-gray-400">
                {user.email}
              </td>

              <td className="p-4">
                <RoleEditor
                  user={user}
                  refresh={fetchUsers}
                  currentAdminId={session.user.id}
                />
              </td>

              <td className="p-4">
                <StatusBadge active={user.isActive} />
              </td>

              <td className="p-4 text-gray-400">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>

              <td className="p-4">
                <ToggleUserStatus
                  user={user}
                  refresh={fetchUsers}
                  currentAdminId={session.user.id}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

}

/* ================================
   Role Editor
================================ */
function RoleEditor({ user, refresh, currentAdminId }) {
  const [role, setRole] = useState(user.role);
  const [saving, setSaving] = useState(false);

  const updateRole = async () => {
    if (user._id === currentAdminId) {
      alert("You cannot change your own role");
      return;
    }

    setSaving(true);

    const res = await fetch(`/api/admin/users/${user._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });

    setSaving(false);

    if (!res.ok) {
      alert("Failed to update role");
    } else {
      refresh();
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border rounded px-2 py-1 text-sm"
      >
        <option value="ADMIN">ADMIN</option>
        <option value="TECHNICIAN">TECHNICIAN</option>
      </select>

      <button
        onClick={updateRole}
        disabled={saving}
        className="text-xs px-2 py-1 border rounded"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

/* ================================
   Enable / Disable User
================================ */
function ToggleUserStatus({ user, refresh, currentAdminId }) {
  const [loading, setLoading] = useState(false);

  const toggleStatus = async () => {
    if (user._id === currentAdminId) {
      alert("You cannot disable your own account");
      return;
    }

    setLoading(true);

    const res = await fetch(
      `/api/admin/users/${user._id}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: !user.isActive,
        }),
      }
    );

    setLoading(false);

    if (!res.ok) {
      alert("Failed to update status");
    } else {
      refresh();
    }
  };

  return (
    <button
      onClick={toggleStatus}
      disabled={loading}
      className="text-xs px-3 py-1 border rounded"
    >
      {user.isActive ? "Disable" : "Enable"}
    </button>
  );
}

/* ================================
   Status Badge
================================ */
function StatusBadge({ active }) {
  return (
    <span
      className={`px-2 py-1 rounded text-xs ${
        active
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {active ? "ACTIVE" : "DISABLED"}
    </span>
  );
}
