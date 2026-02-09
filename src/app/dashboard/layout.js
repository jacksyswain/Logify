"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="p-6 font-bold text-xl">
          Logify
        </div>

        <nav className="px-4 space-y-2">
          <SidebarLink href="/dashboard">
            Tickets
          </SidebarLink>

          {(session?.user.role === "ADMIN" ||
            session?.user.role === "TECHNICIAN") && (
            <SidebarLink href="/dashboard/tickets/new">
              New Ticket
            </SidebarLink>
          )}

          {session?.user.role === "ADMIN" && (
            <SidebarLink href="/dashboard/admin/users">
              Users
            </SidebarLink>
          )}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div className="font-semibold">
            Dashboard
          </div>

          {session && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {session.user.email}
              </span>

              <button
                onClick={() =>
                  signOut({ callbackUrl: "/login" })
                }
                className="text-sm text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ href, children }) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 rounded hover:bg-gray-100 text-sm"
    >
      {children}
    </Link>
  );
}
