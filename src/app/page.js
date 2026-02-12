export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* ================= HERO ================= */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="space-y-7">
            <span className="inline-flex items-center px-4 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-sm">
              Maintenance tracking platform
            </span>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              <span className="text-gray-900">
                Track maintenance issues
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                with clarity & control
              </span>
            </h1>

            <p className="text-lg text-gray-600 max-w-xl">
              Logify helps teams log issues, attach visual proof,
              track status changes, and maintain accountability —
              without chaos.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="/dashboard"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-medium shadow hover:shadow-lg hover:scale-[1.02] transition"
              >
                Open dashboard
              </a>

              <a
                href="/login"
                className="px-6 py-3 rounded-xl border border-gray-300 font-medium hover:bg-gray-50 transition"
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
            <div className="bg-white border rounded-3xl shadow-xl p-8 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Why teams use Logify
              </h3>

              <div className="space-y-4">
                <Feature
                  title="Structured issue tracking"
                  text="Every issue follows a clear lifecycle with full history."
                />
                <Feature
                  title="Visual evidence"
                  text="Upload, review, and verify fixes with image proof."
                />
                <Feature
                  title="Role-based control"
                  text="Admins, technicians, and viewers — clearly defined."
                />
                <Feature
                  title="Audit & accountability"
                  text="Every action is logged for transparency."
                />
              </div>
            </div>

            <div className="absolute -z-10 -bottom-12 -right-12 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl" />
          </div>
        </section>

        {/* ================= EVIDENCE INBOX ================= */}
        <section className="mt-36">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Evidence inbox
            </h2>
            <p className="mt-3 text-gray-600">
              All images uploaded across tickets live in one place —
              searchable, traceable, and tied to real issues.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {MOCK_IMAGES.map((img, i) => (
              <div
                key={i}
                className="group relative rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-lg transition"
              >
                <img
                  src={img.src}
                  alt="Ticket evidence"
                  className="h-44 w-full object-cover group-hover:scale-105 transition-transform"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 opacity-0 group-hover:opacity-100 transition" />

                {/* Meta */}
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition">
                  <p className="text-xs font-medium truncate">
                    {img.title}
                  </p>
                  <p className="text-[11px] text-white/80">
                    {img.meta}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="mt-40 border-t pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-medium text-gray-600">Logify</span>. Built by{" "}
            <span className="font-medium text-gray-600">JPS</span>. All rights reserved.
          </p>

          <p className="mt-2 md:mt-0">
            Internal maintenance tracking system
          </p>
        </footer>
      </div>
    </main>
  );
}

/* ================= Feature ================= */
function Feature({ title, text }) {
  return (
    <div className="flex gap-4">
      <div className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600" />
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{text}</p>
      </div>
    </div>
  );
}

/* ================= Mock Images ================= */
const MOCK_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1581092160607-ee67b3b41b4a",
    title: "AC unit not cooling",
    meta: "Ticket #1042 • OPEN",
  },
  {
    src: "https://images.unsplash.com/photo-1581090700227-1e37b190418e",
    title: "Server rack wiring",
    meta: "Ticket #1031 • MARKED DOWN",
  },
  {
    src: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc",
    title: "Damaged control panel",
    meta: "Ticket #1028 • OPEN",
  },
  {
    src: "https://images.unsplash.com/photo-1581091870627-3d6e6f1c33d1",
    title: "Machine oil leakage",
    meta: "Ticket #1019 • RESOLVED",
  },
  {
    src: "https://images.unsplash.com/photo-1581091870685-7c86c40e5f21",
    title: "Before repair",
    meta: "Ticket #1011",
  },
  {
    src: "https://images.unsplash.com/photo-1581092919535-7146c9a9c89f",
    title: "After fix verification",
    meta: "Ticket #1011 • RESOLVED",
  },
  {
    src: "https://images.unsplash.com/photo-1581093458791-9a6a2a1b47b5",
    title: "Serial number snapshot",
    meta: "Ticket #0994",
  },
  {
    src: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b",
    title: "Electrical board issue",
    meta: "Ticket #0988 • OPEN",
  },
];
