"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [activeImage, setActiveImage] = useState(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">

        {/* ================= HERO ================= */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Left */}
          <div className="space-y-6 sm:space-y-7">
            <span className="inline-flex items-center px-4 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-sm w-fit">
              Maintenance tracking platform
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              <span className="text-gray-900">
                Track maintenance issues
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                with clarity & control
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-xl">
              Logify helps teams log issues, attach visual proof,
              track status changes, and maintain accountability —
              without chaos.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <a
                href="/dashboard"
                className="w-full sm:w-auto text-center px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-medium shadow hover:shadow-lg hover:scale-[1.02] transition"
              >
                Open dashboard
              </a>

              <a
                href="/login"
                className="w-full sm:w-auto text-center px-6 py-3 rounded-xl border border-gray-300 font-medium hover:bg-gray-50 transition"
              >
                Sign in
              </a>
            </div>

            <p className="text-sm text-gray-400">
              Designed for technicians, admins, and internal teams
            </p>
          </div>

          {/* Right */}
          <div className="relative">
            <div className="bg-white border rounded-3xl shadow-xl p-6 sm:p-8 space-y-4 sm:space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Why teams use Logify
              </h3>

              <Feature title="Structured issue tracking" text="Every issue follows a clear lifecycle with full history." />
              <Feature title="Visual evidence" text="Upload, review, and verify fixes with image proof." />
              <Feature title="Role-based control" text="Admins, technicians, and viewers — clearly defined." />
              <Feature title="Audit & accountability" text="Every action is logged for transparency." />
            </div>

            <div className="absolute -z-10 -bottom-10 -right-10 w-72 sm:w-80 h-72 sm:h-80 bg-gradient-to-br from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl" />
          </div>
        </motion.section>

        {/* ================= EVIDENCE INBOX ================= */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mt-28 sm:mt-36"
        >
          <div className="max-w-3xl mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Evidence inbox
            </h2>
            <p className="mt-3 text-gray-600">
              All images uploaded across tickets live in one place —
              searchable, traceable, and tied to real issues.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {WORKING_IMAGES.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className="group relative rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-lg transition focus:outline-none"
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="h-36 sm:h-44 md:h-48 w-full object-cover group-hover:scale-105 transition-transform"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 opacity-0 group-hover:opacity-100 transition" />

                <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition text-left">
                  <p className="text-xs font-medium truncate">
                    {img.title}
                  </p>
                  <p className="text-[11px] text-white/80">
                    {img.meta}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </motion.section>

        {/* ================= FOOTER ================= */}
        <footer className="mt-32 sm:mt-40 border-t pt-6 sm:pt-8 flex flex-col md:flex-row gap-3 items-center justify-between text-sm text-gray-400">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()}{" "}
            <span className="font-medium text-gray-600">Logify</span>. Built by{" "}
            <span className="font-medium text-gray-600">JPS</span>. All rights reserved.
          </p>

          <p className="text-center md:text-right">
            Internal maintenance tracking system
          </p>
        </footer>
      </div>

      {/* ================= LIGHTBOX ================= */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full"
          >
            <img
              src={activeImage.src}
              alt={activeImage.title}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            <div className="mt-4 text-center text-white">
              <p className="text-sm font-medium">{activeImage.title}</p>
              <p className="text-xs text-white/70">{activeImage.meta}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ================= Feature ================= */
function Feature({ title, text }) {
  return (
    <div className="flex gap-4">
      <div className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 shrink-0" />
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{text}</p>
      </div>
    </div>
  );
}

/* ================= IMAGES ================= */
const WORKING_IMAGES = [
  {
    // ✅ CLEAR HVAC / AC OUTDOOR UNIT
    src: "https://images.unsplash.com/photo-1604335399105-2f7f4b1e8e43?auto=format&fit=crop&w=1200&q=80",
    title: "AC unit not cooling",
    meta: "Ticket #1042 • OPEN",
  },
  {
    // ✅ DATA CENTER / SERVER RACKS
    src: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80",
    title: "Server rack wiring",
    meta: "Ticket #1031 • MARKED DOWN",
  },
  {
    // ✅ INDUSTRIAL CONTROL PANEL
    src: "https://images.unsplash.com/photo-1581091215367-59ab6b07b1d4?auto=format&fit=crop&w=1200&q=80",
    title: "Control panel damage",
    meta: "Ticket #1028 • OPEN",
  },
  {
    // ✅ MECHANICAL / OIL / INDUSTRIAL LEAK
    src: "https://images.unsplash.com/photo-1597008641621-9a7d4f0c2a73?auto=format&fit=crop&w=1200&q=80",
    title: "Oil leakage detected",
    meta: "Ticket #1019 • RESOLVED",
  },
  {
    // ✅ BEFORE-REPAIR INSPECTION (TECHNICIAN CHECKING)
    src: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
    title: "Before repair inspection",
    meta: "Ticket #1011",
  },
  {
    // ✅ AFTER FIX / VERIFICATION WORK
    src: "https://images.unsplash.com/photo-1581093458416-0f2b8b0f5e92?auto=format&fit=crop&w=1200&q=80",
    title: "Post-fix verification",
    meta: "Ticket #1011 • RESOLVED",
  },
  {
    // ✅ SERIAL NUMBER / ASSET TAG CLOSE-UP
    src: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=1200&q=80",
    title: "Serial number snapshot",
    meta: "Ticket #0994",
  },
  {
    // ✅ ELECTRICAL BOARD / PANEL WITH WIRES
    src: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
    title: "Electrical board issue",
    meta: "Ticket #0988 • OPEN",
  },
];
