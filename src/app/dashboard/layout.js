"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const userName =
    session?.user?.name ||
    session?.user?.email ||
    "User";

  const initials = getInitials(userName);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
    <div className="h-screen flex bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">

      {/* ================= Sidebar ================= */}
      <aside className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 hidden md:flex flex-col">
        <SidebarContent
          session={session}
          pathname={pathname}
          initials={initials}
          userName={userName}
          onLogout={() => setShowLogoutConfirm(true)}
        />
      </aside>

      {/* ================= Main ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">

            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition"
            >
              ←
            </button>
             {/* Forward Button */}
            <button
              onClick={() => router.forward()}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition"
            >
              →
            </button>
           

            <p className="text-sm font-semibold tracking-wide text-gray-300">
              {pageTitle}
            </p>
          </div>


          {session && (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(v => !v)}
                className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-white/10 transition"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-xs font-semibold">
                  {initials}
                </div>
                <span className="text-sm text-gray-300 hidden sm:block">
                  {session.user.role}
                </span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-medium truncate">
                      {userName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {session.user.role}
                    </p>
                  </div>

                  <Link
                    href="/dashboard/account"
                    className="block px-4 py-2 text-sm hover:bg-white/10"
                  >
                    Account Settings
                  </Link>

                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* ================= Logout Modal ================= */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/10 rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold">Sign out?</h2>
            <p className="text-sm text-gray-400">
              You will be logged out of your account.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm border border-white/20 rounded-lg hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
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

/* ================= Sidebar Content ================= */
function SidebarContent({ session, pathname, initials, userName, onLogout }) {
  return (
    <div className="h-full flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-wide">
          Logify
        </h1>
        <p className="text-xs text-gray-400">
          Maintenance Platform
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8">

        {/* MAIN */}
        <div>
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase mb-2">
            Main
          </p>

          <SidebarLink href="/dashboard" active={pathname === "/dashboard"}>
            Tickets
          </SidebarLink>
          <SidebarLink
            href="/dashboard/meters"
            active={pathname.startsWith("/dashboard/meters")}
          >
            Meters
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
          {session?.user.role === "ADMIN" && (
            <div>
              <SidebarLink
                href="/dashboard/admin/users"
                active={pathname.startsWith("/dashboard/admin/users")}
              >
                Manage Users
              </SidebarLink>

              <SidebarLink
                href="/dashboard/admin/analytics"
                active={pathname.startsWith("/dashboard/admin/analytics")}
              >
                Analytics
              </SidebarLink>

              <SidebarLink
                href="/dashboard/admin/audit-logs"
                active={pathname.startsWith("/dashboard/admin/audit-logs")}
              >
                Audit Logs
              </SidebarLink>

            </div>
          )}
        </div>
      </nav>

      {/* Account */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-gray-400">{session?.user.role}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full mt-4 px-4 py-2 rounded-xl text-sm font-medium text-red-400 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition"
        >
          ⏻ Logout
        </button>
      </div>
    </div>
  );
}

/* ================= Sidebar Link ================= */
function SidebarLink({ href, children, active }) {
  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded-lg text-sm transition-all ${active
        ? "bg-blue-600 text-white shadow-lg"
        : "text-gray-300 hover:bg-white/10 hover:translate-x-1"
        }`}
    >
      {children}
    </Link>
  );
}
