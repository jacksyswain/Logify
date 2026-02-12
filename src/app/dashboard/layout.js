"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ================= Utils ================= */
function getInitials(nameOrEmail = "") {
  if (!nameOrEmail) return "?";
  const name = nameOrEmail.split("@")[0];
  const parts = name.split(/[.\s_-]/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function DashboardLayout({ children }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const userName =
    session?.user?.name ||
    session?.user?.email ||
    "User";

  const initials = getInitials(userName);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ================= Sidebar ================= */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold tracking-tight">
            Logify
          </h1>
          <p className="text-xs text-gray-500">
            Maintenance Platform
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-8">
          {/* Main */}
          <div>
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase mb-2">
              Main
            </p>

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
                  active={pathname.startsWith(
                    "/dashboard/tickets/new"
                  )}
                >
                  New Ticket
                </SidebarLink>
              )}
          </div>

          {/* Admin */}
          {session?.user.role === "ADMIN" && (
            <div>
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase mb-2">
                Admin
              </p>

              <SidebarLink
                href="/dashboard/admin/users"
                active={pathname.startsWith(
                  "/dashboard/admin/users"
                )}
              >
                Users
              </SidebarLink>

              <SidebarLink
                href="/dashboard/admin/audit-logs"
                active={pathname.startsWith(
                  "/dashboard/admin/audit-logs"
                )}
              >
                Audit Logs
              </SidebarLink>

              <SidebarLink
                href="/dashboard/admin/analytics"
                active={pathname.startsWith(
                  "/dashboard/admin/analytics"
                )}
              >
                Analytics
              </SidebarLink>
            </div>
          )}
        </nav>

        {/* ================= Account Section (ChatGPT-style) ================= */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
              {initials}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {userName}
              </p>
              <p className="text-xs text-gray-500">
                {session?.user.role}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 space-y-1">
            <SidebarLink
              href="/dashboard/account"
              active={pathname.startsWith(
                "/dashboard/account"
              )}
            >
              Account Settings
            </SidebarLink>

            <button
              onClick={() =>
                signOut({ callbackUrl: "/login" })
              }
              className="
    w-full mt-2
    flex items-center justify-center gap-2
    px-4 py-2
    rounded-xl
    text-sm font-medium
    text-red-600
    border border-red-200
    bg-red-50
    hover:bg-red-100
    hover:border-red-300
    transition
    focus:outline-none
    focus:ring-2
    focus:ring-red-200
  "
            >
              ⏻ Logout
            </button>

          </div>
        </div>
      </aside>

      {/* ================= Main Content ================= */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div className="font-semibold text-sm">
            Dashboard
          </div>

          {session && (
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold">
                {initials}
              </div>

              <span className="text-sm text-gray-700">
                {session.user.role}
              </span>
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

/* ================= Sidebar Link ================= */
function SidebarLink({ href, children, active }) {
  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded-lg text-sm transition ${active
        ? "bg-black text-white"
        : "text-gray-700 hover:bg-gray-100"
        }`}
    >
      {children}
    </Link>
  );
}
