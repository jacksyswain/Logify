"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="bg-white">

      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left */}
        <div className="space-y-6">
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-slate-900">
            Stand out with structured
            <br />
            <span className="text-indigo-600">
              maintenance tracking
            </span>
          </h1>

          <p className="text-lg text-slate-600 max-w-xl">
            Logify helps teams track issues, upload visual proof,
            monitor lifecycle updates, and maintain accountability —
            without chaos.
          </p>

          <div className="flex gap-4 pt-4">
            <a
              href="/login"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Open Dashboard
            </a>

            <a
              href="/login"
              className="px-6 py-3 border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition"
            >
              Sign In
            </a>
          </div>
        </div>

        {/* Right Mockup */}
        <div className="relative">
          <div className="bg-white shadow-2xl rounded-2xl border p-6">
            <img
              src="https://picsum.photos/id/1018/1000/700"
              alt="Dashboard preview"
              className="rounded-xl"
            />
          </div>

          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-100 rounded-full blur-3xl -z-10" />
        </div>
      </section>


      {/* ================= FEATURE SECTION 1 ================= */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          <div>
            <h2 className="text-4xl font-bold text-slate-900">
              Easily connect technicians and admins
            </h2>
            <p className="mt-4 text-slate-600">
              Every issue is tracked in real-time. Assign responsibility,
              upload evidence, update status, and maintain visibility across teams.
            </p>
          </div>

          <div className="bg-white shadow-xl border rounded-2xl p-6">
            <img
              src="https://picsum.photos/id/1067/1000/700"
              alt="Feature preview"
              className="rounded-xl"
            />
          </div>
        </div>
      </section>


      {/* ================= FEATURE SECTION 2 ================= */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          <div className="bg-white shadow-xl border rounded-2xl p-6 order-2 md:order-1">
            <img
              src="https://picsum.photos/id/1039/1000/700"
              alt="Evidence inbox"
              className="rounded-xl"
            />
          </div>

          <div className="order-1 md:order-2">
            <h2 className="text-4xl font-bold text-slate-900">
              Upload visual proof with every issue
            </h2>
            <p className="mt-4 text-slate-600">
              Capture images before and after repair.
              Maintain an audit-ready evidence trail tied directly to tickets.
            </p>
          </div>
        </div>
      </section>


      {/* ================= FEATURE SECTION 3 ================= */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          <div>
            <h2 className="text-4xl font-bold text-slate-900">
              Role-based access & control
            </h2>
            <p className="mt-4 text-slate-600">
              Admins manage users and analytics. Technicians update
              issue status. Full audit logs ensure accountability.
            </p>
          </div>

          <div className="bg-white shadow-xl border rounded-2xl p-6">
            <img
              src="https://picsum.photos/id/1040/1000/700"
              alt="Role control"
              className="rounded-xl"
            />
          </div>
        </div>
      </section>


      {/* ================= CTA ================= */}
      <section className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-slate-900">
            Take control of your maintenance workflow
          </h2>

          <p className="mt-4 text-slate-600">
            Clear visibility. Structured tracking. Complete accountability.
          </p>

          <div className="mt-8">
            <a
              href="/login"
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-medium hover:bg-indigo-700 transition"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>


      {/* ================= FOOTER (unchanged style) ================= */}
      <footer className="border-t py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()}{" "}
        <span className="font-medium text-slate-700">Logify</span>. Built by{" "}
        <span className="font-medium text-slate-700">JPS</span>.
      </footer>

    </main>
  );
}
