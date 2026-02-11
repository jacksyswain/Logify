export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Hero */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="space-y-8">
            {/* Badge */}
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-black text-white">
              🚧 Maintenance Tracking Platform
            </span>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
              Track maintenance issues
              <br />
              <span className="text-gray-500">
                with clarity & control
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg text-gray-600 max-w-xl">
              Logify helps teams document issues, attach evidence,
              collaborate on fixes, and track resolutions — all in one
              clean, reliable system.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <a
                href="/dashboard"
                className="px-6 py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-900 transition"
              >
                Open Dashboard
              </a>

              <a
                href="/login"
                className="px-6 py-3 rounded-lg border font-medium hover:bg-gray-50 transition"
              >
                Sign in
              </a>
            </div>

            {/* Trust text */}
            <p className="text-sm text-gray-400">
              Built for internal teams, technicians & administrators
            </p>
          </div>

          {/* Right – Feature Card */}
          <div className="relative">
            <div className="bg-white border rounded-3xl shadow-lg p-8 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Why teams choose Logify
              </h3>

              <div className="space-y-4">
                <Feature
                  title="Structured issue tracking"
                  text="Markdown-powered logs with clear status flows."
                />
                <Feature
                  title="Visual evidence"
                  text="Upload, reorder, and review image proof."
                />
                <Feature
                  title="Role-based control"
                  text="Admins, technicians, and viewers — clearly separated."
                />
                <Feature
                  title="Audit & accountability"
                  text="Track actions, status changes, and activity history."
                />
              </div>
            </div>

            {/* Decorative blur */}
            <div className="absolute -z-10 -bottom-10 -right-10 w-72 h-72 bg-black/5 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-32 border-t pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Logify</p>
          <p>Designed for modern maintenance teams</p>
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
      <div className="w-2 h-2 mt-2 rounded-full bg-black" />
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
