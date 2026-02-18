"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-white overflow-x-hidden">

      {/* ================= FLOATING NAVBAR ================= */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 
        backdrop-blur-xl bg-white/70 border border-slate-200
        shadow-lg rounded-full px-8 py-3 flex items-center gap-8">

        <span className="font-semibold text-slate-900">
          Logify
        </span>

        <div className="hidden md:flex gap-6 text-sm text-slate-600">
          <a href="#features" className="hover:text-slate-900 transition">
            Features
          </a>
          <a href="#workflow" className="hover:text-slate-900 transition">
            Workflow
          </a>
          <a href="#pricing" className="hover:text-slate-900 transition">
            Access
          </a>
        </div>

        <Link
          href="/login"
          className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700 transition"
        >
          Sign in
        </Link>
      </nav>

      {/* ================= HERO ================= */}
      <section className="pt-40 pb-32 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">

        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-slate-900">
            Modern maintenance
            <br />
            <span className="text-indigo-600">
              tracking platform
            </span>
          </h1>

          <p className="text-lg text-slate-600 max-w-xl">
            Track issues, upload evidence, assign technicians,
            and monitor every lifecycle change — all in one system.
          </p>

          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-medium shadow hover:scale-105 transition"
            >
              Open Dashboard
            </Link>

            <Link
              href="/login"
              className="px-8 py-4 border border-slate-300 rounded-xl font-medium hover:bg-slate-50 transition"
            >
              Sign in
            </Link>
          </div>
        </motion.div>

        {/* Right Screenshot */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <div className="bg-white rounded-3xl shadow-2xl border p-6">
            <img
              src="https://picsum.photos/id/1018/1200/800"
              alt="Dashboard Preview"
              className="rounded-2xl"
            />
          </div>

          <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-indigo-100 rounded-full blur-3xl -z-10" />
        </motion.div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-28 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-slate-900">
            Everything you need to stay in control
          </h2>

          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Structured issue tracking, visual verification,
            audit history, and team accountability.
          </p>
        </div>

        <div className="mt-16 max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">

          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="backdrop-blur-xl bg-white/70 border border-slate-200
                         rounded-3xl p-8 shadow-sm hover:shadow-xl
                         hover:-translate-y-2 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-6 text-indigo-600 font-bold">
                {feature.icon}
              </div>

              <h3 className="text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm text-slate-600">
                {feature.text}
              </p>
            </motion.div>
          ))}

        </div>
      </section>

      {/* ================= WORKFLOW SECTION ================= */}
      <section id="workflow" className="py-28">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-slate-900">
              Built for real teams
            </h2>

            <p className="mt-4 text-slate-600">
              Admins control users. Technicians update tickets.
              Every action is logged in the audit trail.
            </p>

            <ul className="mt-6 space-y-3 text-slate-600 text-sm">
              <li>✔ Role-based permissions</li>
              <li>✔ Full status history</li>
              <li>✔ Evidence inbox</li>
              <li>✔ Analytics dashboard</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white border rounded-3xl shadow-xl p-6"
          >
            <img
              src="https://picsum.photos/id/1039/1200/800"
              alt="Workflow Preview"
              className="rounded-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-32 bg-slate-900 text-white text-center">
        <h2 className="text-4xl font-bold">
          Ready to modernize your workflow?
        </h2>

        <p className="mt-4 text-slate-300">
          Replace spreadsheets and chaos with clarity.
        </p>

        <Link
          href="/dashboard"
          className="mt-8 inline-block px-10 py-4 bg-indigo-600 rounded-xl font-medium hover:bg-indigo-700 transition"
        >
          Get Started
        </Link>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()}{" "}
        <span className="font-medium text-slate-700">Logify</span>. Built by JPS.
      </footer>

    </main>
  );
}

const FEATURES = [
  {
    icon: "01",
    title: "Structured Tracking",
    text: "Every issue follows a defined lifecycle from OPEN to RESOLVED.",
  },
  {
    icon: "02",
    title: "Visual Evidence",
    text: "Upload and verify images before and after repair.",
  },
  {
    icon: "03",
    title: "Audit Logs",
    text: "Complete transparency on status updates and changes.",
  },
];
