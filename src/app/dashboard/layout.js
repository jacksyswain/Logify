"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ================= Sidebar ================= */}
      <aside className="w-64 bg-white border-r hidden md:flex md:flex-col">
        {/* Logo */}
        <div className="p-6 text-xl font-bold tracking-tight">
          Logify
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          <SidebarLink
            href="/dashboard"
            active={pathname === "/dashboard"}
          >
            Tickets
          </SidebarLink>

          {(session?.user.role === "ADMIN" ||
            session?.user.role === "TECHNICIAN") && (
            <SidebarLink
              href="/dashboard/tickets/new"
              active={pathname === "/dashboard/tickets/new"}
            >
              New Ticket
            </SidebarLink>
          )}

          {session?.user.role === "ADMIN" && (
            <SidebarLink
              href="/dashboard/admin/users"
              active={pathname.startsWith("/dashboard/admin")}
            >
              Users
            </SidebarLink>
          )}
        </nav>

        {/* User info */}
        {session && (
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-sm">
                {session.user.email?.[0]?.toUpperCase()}
              </div>

              <div className="text-sm">
                <p className="font-medium">
                  {session.user.email}
                </p>
                <RoleBadge role={session.user.role} />
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ================= Main ================= */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div className="font-semibold text-gray-800">
            Dashboard
          </div>

          {session && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                {session.user.email}
              </span>

              <button
                onClick={() =>
                  signOut({ callbackUrl: "/login" })
                }
                className="text-sm text-red-600 hover:underline"
              >
                Logout
              </button>
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="p-6 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

/* ================================
   Sidebar Link
================================ */
function SidebarLink({ href, children, active }) {
  return (
    <Link
      href={href}
      className={`block px-4 py-2 rounded-lg text-sm transition
        ${
          active
            ? "bg-gray-900 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }
      `}
    >
      {children}
    </Link>
  );
}

/* ================================
   Role Badge
================================ */
function RoleBadge({ role }) {
  const styles = {
    ADMIN: "bg-purple-100 text-purple-700",
    TECHNICIAN: "bg-blue-100 text-blue-700",
    USER: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
        styles[role] || "bg-gray-100"
      }`}
    >
      {role}
    </span>
  );
}
