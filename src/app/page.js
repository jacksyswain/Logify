export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* ================= Hero ================= */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* ================= Left ================= */}
          <div className="space-y-8">
            {/* Badge */}
            <span className="inline-flex items-center px-4 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow">
              🚧 Maintenance Tracking Platform
            </span>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              <span className="text-gray-900">
                Track maintenance issues
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                with clarity & control
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg text-gray-600 max-w-xl">
              Logify helps teams document issues, attach evidence,
              collaborate on fixes, and track resolutions — all in one
              clean, reliable system built for accountability.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <a
                href="/dashboard"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-medium shadow hover:shadow-lg hover:scale-[1.02] transition"
              >
                Open Dashboard
              </a>

              <a
                href="/login"
                className="px-6 py-3 rounded-xl border border-gray-300 font-medium hover:bg-gray-50 transition"
              >
                Sign in
              </a>
            </div>

            {/* Trust text */}
            <p className="text-sm text-gray-400">
              Built for internal teams, technicians & administrators
            </p>
          </div>

          {/* ================= Right ================= */}
          <div className="relative">
            <div className="bg-white border rounded-3xl shadow-xl p-8 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Why teams choose Logify
              </h3>

              <div className="space-y-4">
                <Feature
                  title="Structured issue tracking"
                  text="Markdown-powered logs with clear status workflows."
                />
                <Feature
                  title="Visual evidence"
                  text="Upload, reorder, and review image proof with ease."
                />
                <Feature
                  title="Role-based control"
                  text="Admins, technicians, and viewers — clearly separated."
                />
                <Feature
                  title="Audit & accountability"
                  text="Every action tracked with a full activity history."
                />
              </div>
            </div>

            {/* Decorative glow */}
            <div className="absolute -z-10 -bottom-12 -right-12 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl" />
          </div>
        </div>

        {/* ================= Footer ================= */}
        <footer className="mt-32 border-t pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} <span className="font-medium text-gray-600">Logify</span>.  
            Built by <span className="font-medium text-gray-600">JPS</span>. All rights reserved.
          </p>

          <p className="mt-2 md:mt-0">
            Designed for modern maintenance teams
          </p>
        </footer>
      </div>
    </main>
  );
}

/* ================================
   Feature Item
================================ */
function Feature({ title, text }) {
  return (
    <div className="flex gap-4">
      <div className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600" />
      <div>
        <p className="font-medium text-gray-900">
          {title}
        </p>
        <p className="text-sm text-gray-600">
          {text}
        </p>
      </div>
    </div>
  );
}
