export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-3xl w-full px-6">
        {/* Card */}
        <div className="bg-white border rounded-2xl shadow-sm p-10 text-center space-y-6">
          {/* Logo / Title */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Logify
          </h1>

          {/* Tagline */}
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            A modern maintenance logging system to track issues,
            attach evidence, and manage resolutions with clarity.
          </p>

          {/* Feature bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-sm text-gray-600">
            <Feature text="📝 Markdown-based logs" />
            <Feature text="📸 Image evidence upload" />
            <Feature text="🔐 Role-based access" />
          </div>

          {/* CTA buttons */}
          <div className="flex justify-center gap-4 pt-6">
            <a
              href="/dashboard"
              className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              View Dashboard
            </a>

            <a
              href="/login"
              className="px-6 py-2.5 border rounded-lg hover:bg-gray-50 transition"
            >
              Login
            </a>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Built for teams that care about reliable maintenance tracking
        </p>
      </div>
    </main>
  );
}

/* ================================
   Feature Item
================================ */
function Feature({ text }) {
  return (
    <div className="border rounded-lg p-3 bg-gray-50">
      {text}
    </div>
  );
}
