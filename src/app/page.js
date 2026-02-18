"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative bg-white overflow-x-hidden">

      <AnimatedBackground />

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
          <a href="#pricing" className="hover:text-slate-900 transition">
            Pricing
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

        <div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl font-bold text-slate-900 leading-tight"
          >
            Modern maintenance
            <br />
            <span className="text-indigo-600">
              tracking platform
            </span>
          </motion.h1>

          <p className="mt-6 text-lg text-slate-600 max-w-xl">
            Track issues, upload evidence, assign technicians,
            and monitor lifecycle changes — all in one system.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/login"
              className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-medium shadow hover:scale-105 transition"
            >
              Open Dashboard
            </Link>
          </div>

          <StatsCounter />
        </div>

        <FloatingMockup />
      </section>

      <Features />
      <CarouselSection />
      <Testimonials />
      <Pricing />
      <FooterSEO />

    </main>
  );
}

/* ================= BACKGROUND ================= */

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50" />
      <div className="absolute inset-0 opacity-40
        [background-image:linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)]
        [background-size:40px_40px]" />
    </div>
  );
}

/* ================= 3D MOCKUP ================= */

function FloatingMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="relative"
    >
      <div className="transform rotate-2 hover:rotate-0 hover:scale-105 transition duration-500 bg-white border rounded-3xl shadow-2xl p-6">
        <img
          src="https://picsum.photos/id/1018/1200/800"
          alt="Dashboard Preview"
          className="rounded-2xl"
        />
      </div>
    </motion.div>
  );
}

/* ================= STATS ================= */

function StatsCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 5;
      if (i >= 500) {
        clearInterval(interval);
        i = 500;
      }
      setCount(i);
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-10 grid grid-cols-3 gap-6 text-center">
      <div>
        <p className="text-3xl font-bold text-indigo-600">{count}+</p>
        <p className="text-sm text-slate-500">Tickets Logged</p>
      </div>
      <div>
        <p className="text-3xl font-bold text-indigo-600">98%</p>
        <p className="text-sm text-slate-500">Resolution Rate</p>
      </div>
      <div>
        <p className="text-3xl font-bold text-indigo-600">24/7</p>
        <p className="text-sm text-slate-500">Monitoring</p>
      </div>
    </div>
  );
}

/* ================= FEATURES ================= */

function Features() {
  return (
    <section id="features" className="py-28 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-slate-900">
          Everything you need
        </h2>
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
  );
}

const FEATURES = [
  { icon: "01", title: "Structured Tracking", text: "Defined lifecycle from OPEN to RESOLVED." },
  { icon: "02", title: "Visual Evidence", text: "Upload before & after repair images." },
  { icon: "03", title: "Audit Logs", text: "Complete transparency on updates." },
];

/* ================= CAROUSEL ================= */

function CarouselSection() {
  return (
    <section className="py-28 overflow-hidden">
      <div className="flex gap-8 animate-scroll whitespace-nowrap">
        {Array(8).fill(0).map((_, i) => (
          <img
            key={i}
            src={`https://picsum.photos/seed/${i}/600/400`}
            className="w-96 rounded-3xl shadow-xl inline-block"
          />
        ))}
      </div>
    </section>
  );
}

/* ================= TESTIMONIALS ================= */

function Testimonials() {
  return (
    <section className="py-28 bg-slate-100 text-center">
      <h2 className="text-4xl font-bold text-slate-900">
        What teams say
      </h2>

      <div className="mt-16 max-w-5xl mx-auto grid md:grid-cols-2 gap-10 px-6">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="bg-white border rounded-3xl p-8 shadow-lg">
            <p className="text-slate-600">"{t.text}"</p>
            <p className="mt-4 font-semibold text-slate-900">
              — {t.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  { name: "Operations Manager", text: "Logify transformed how we manage maintenance." },
  { name: "Facility Lead", text: "The audit logs alone make it worth it." },
];

/* ================= PRICING ================= */

function Pricing() {
  return (
    <section id="pricing" className="py-28 bg-slate-900 text-white text-center">
      <h2 className="text-4xl font-bold">Simple pricing</h2>

      <div className="mt-16 max-w-4xl mx-auto grid md:grid-cols-2 gap-10 px-6">
        <div className="bg-slate-800 rounded-3xl p-10">
          <h3 className="text-2xl font-bold">Starter</h3>
          <p className="mt-4 text-4xl font-bold">$0</p>
        </div>

        <div className="bg-indigo-600 rounded-3xl p-10">
          <h3 className="text-2xl font-bold">Enterprise</h3>
          <p className="mt-4 text-4xl font-bold">$29/mo</p>
        </div>
      </div>
    </section>
  );
}

/* ================= FOOTER + SEO ================= */

function FooterSEO() {
  return (
    <>
      <footer className="py-8 text-center text-sm text-slate-500">
        © 2026 <span className="font-medium text-slate-700">Logify</span>.
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Logify",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
          }),
        }}
      />
    </>
  );
}
