"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ================= Utils ================= */
function getInitials(nameOrEmail = "") {
  const base = nameOrEmail.split("@")[0];
  const parts = base.split(/[.\s_-]/);
  return (
    parts.slice(0, 2).map(p => p[0]?.toUpperCase()).join("") || "?"
  );
}

export default function DashboardLayout({ children }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const userName =
    session?.user?.name ||
    session?.user?.email ||
    "User";

  const initials = getInitials(userName);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  /* ================= Page Title ================= */
  const titleMap = {
    "/dashboard": "Tickets",
    "/dashboard/tickets/new": "New Ticket",
    "/dashboard/account": "Account Settings",
    "/dashboard/admin/users": "User Management",
    "/dashboard/admin/audit-logs": "Audit Logs",
    "/dashboard/admin/analytics": "Analytics",
  };

  const pageTitle = titleMap[pathname] || "Dashboard";

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      {/* ================= Sidebar ================= */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b shrink-0">
          <h1 className="text-xl font-bold tracking-tight">Logify</h1>
          <p className="text-xs text-gray-500">Maintenance Platform</p>
        </div>

        {/* Navigation (scrollable) */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
          {/* Main */}
          <div>
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase mb-2">
              Main
            </p>

            <SidebarLink href="/dashboard" active={pathname === "/dashboard"}>
              Tickets
            </SidebarLink>

            {(session?.user.role === "ADMIN" ||
              session?.user.role === "TECHNICIAN") && (
              <SidebarLink
                href="/dashboard/tickets/new"
                active={pathname.startsWith("/dashboard/tickets/new")}
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
                active={pathname.startsWith("/dashboard/admin/users")}
              >
                Users
              </SidebarLink>

              <SidebarLink
                href="/dashboard/admin/audit-logs"
                active={pathname.startsWith("/dashboard/admin/audit-logs")}
              >
                Audit Logs
              </SidebarLink>

              <SidebarLink
                href="/dashboard/admin/analytics"
                active={pathname.startsWith("/dashboard/admin/analytics")}
              >
                Analytics
              </SidebarLink>
            </div>
          )}
        </nav>

        {/* ================= Account Section ================= */}
        <div className="border-t p-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {userName}
              </p>
              <p className="text-xs text-gray-500">
                {session?.user.role}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <SidebarLink
              href="/dashboard/account"
              active={pathname.startsWith("/dashboard/account")}
            >
              Account Settings
            </SidebarLink>

            <button
              onClick={() => setShowLogoutConfirm(true)}
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
              "
            >
              ⏻ Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ================= Main ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center shrink-0">
          <p className="text-sm font-semibold tracking-tight">
            {pageTitle}
          </p>

          {session && (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(v => !v)}
                className="
                  flex items-center gap-3
                  px-3 py-1.5
                  rounded-xl
                  border border-transparent
                  hover:border-gray-200
                  hover:bg-gray-50
                  transition
                "
              >
                <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold">
                  {initials}
                </div>
                <span className="text-sm text-gray-700">
                  {session.user.role}
                </span>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium truncate">
                      {userName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {session.user.role}
                    </p>
                  </div>

                  <Link
                    href="/dashboard/account"
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Account Settings
                  </Link>

                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* ================= Logout Modal ================= */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold">
              Sign out?
            </h2>

            <p className="text-sm text-gray-600">
              You will be logged out of your account.
            </p>

            <div className="flex justify-end gap-3">
              <button
                autoFocus
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  signOut({ callbackUrl: "/login" })
                }
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= Sidebar Link ================= */
function SidebarLink({ href, children, active }) {
  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded-lg text-sm transition-all ${
        active
          ? "bg-black text-white"
          : "text-gray-700 hover:bg-gray-100 hover:translate-x-0.5"
      }`}
    >
      {children}
    </Link>
  );
}
