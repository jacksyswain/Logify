export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4 px-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Logify 🚧
        </h1>

        <p className="text-gray-600 max-w-md mx-auto">
          Logify is a maintenance logging system to track issues,
          upload evidence, and manage problem resolution efficiently.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <a
            href="/dashboard"
            className="px-5 py-2 bg-black text-white rounded"
          >
            View Tickets
          </a>

          <a
            href="/login"
            className="px-5 py-2 border rounded"
          >
            Login
          </a>
        </div>
      </div>
    </main>
  );
}
