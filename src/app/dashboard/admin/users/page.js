"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UsersListPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Admin guard
  if (!session || session.user.role !== "ADMIN") {
    return (
      <p className="p-6 text-red-600">
        Access denied.
      </p>
    );
  }

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading users...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Users
        </h1>

        <button
          onClick={() =>
            router.push("/dashboard/admin/users/new")
          }
          className="px-4 py-2 bg-black text-white rounded"
        >
          + Create User
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Created</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-3">
                  {user.name}
                </td>
                <td className="p-3">
                  {user.email}
                </td>
                <td className="p-3">
                  <RoleBadge role={user.role} />
                </td>
                <td className="p-3">
                  {new Date(
                    user.createdAt
                  ).toLocaleDateString()}
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
   Role Badge
================================ */
function RoleBadge({ role }) {
  const styles = {
    ADMIN: "bg-purple-100 text-purple-700",
    TECHNICIAN: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs ${
        styles[role] || "bg-gray-100"
      }`}
    >
      {role}
    </span>
  );
}
