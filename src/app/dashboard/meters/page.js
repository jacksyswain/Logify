"use client";

import { useRouter } from "next/navigation";

export default function MetersHomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto p-6 space-y-10">

        <div>
          <h1 className="text-4xl font-bold">Meter Readings</h1>
          <p className="text-gray-400 mt-2">
            Monitor Gas, Water & Electricity consumption
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          <MeterCard
            title="Gas Reading"
            color="from-orange-500/20 to-orange-600/10"
            onClick={() => router.push("/dashboard/meters/gas")}
          />

          <MeterCard
            title="Water Reading"
            color="from-blue-500/20 to-blue-600/10"
            onClick={() => router.push("/dashboard/meters/water")}
          />

          <MeterCard
            title="Electricity"
            color="from-yellow-500/20 to-yellow-600/10"
            onClick={() => router.push("/dashboard/meters/electricity")}
          />

        </div>
      </div>
    </div>
  );
}

function MeterCard({ title, onClick, color }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-8 rounded-2xl bg-gradient-to-br ${color} border border-white/10 hover:scale-105 transition`}
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-sm text-gray-400 mt-2">
        View last 30 days readings
      </p>
    </div>
  );
}
