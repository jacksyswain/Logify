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
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold tracking-tight">
            Logify
          </h1>
          <p className="text-xs text-gray-500">
            Maintenance Dashboard
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-6">
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

        {/* Footer */}
        <div className="border-t p-4 text-xs text-gray-500">
          © {new Date().getFullYear()} Logify
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
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">
                  {session.user.email}
                </p>
                <p className="text-xs text-gray-500">
                  {session.user.role}
                </p>
              </div>

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
      className={`block px-3 py-2 rounded-lg text-sm transition ${
        active
          ? "bg-black text-white"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {children}
    </Link>
  );
}
