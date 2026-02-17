"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ElectricityPage() {
  const router = useRouter();
  const [meters, setMeters] = useState([]);
  const [meterNumber, setMeterNumber] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    fetchMeters();
  }, []);

  const fetchMeters = async () => {
    const res = await fetch("/api/meters/electricity");
    const data = await res.json();
    setMeters(data);
  };

  const createMeter = async () => {
    await fetch("/api/meters/electricity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meterNumber, location }),
    });

    setMeterNumber("");
    setLocation("");
    fetchMeters();
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Electricity Meters
      </h1>

      <div className="flex gap-4 mb-8">
        <input
          value={meterNumber}
          onChange={(e) => setMeterNumber(e.target.value)}
          placeholder="Meter Number"
          className="p-2 bg-gray-900 border border-white/20 rounded"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="p-2 bg-gray-900 border border-white/20 rounded"
        />
        <button
          onClick={createMeter}
          className="px-4 py-2 bg-white text-black rounded"
        >
          Add
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {meters.map((m) => (
          <div
            key={m._id}
            onClick={() =>
              router.push(`/dashboard/meters/electricity/${m._id}`)
            }
            className="p-6 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:scale-105 transition"
          >
            <h2 className="font-semibold">{m.meterNumber}</h2>
            <p className="text-sm text-gray-400">{m.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
