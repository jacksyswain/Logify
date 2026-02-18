"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function ElectricityDetailPage() {
  const { id } = useParams();
  const [readings, setReadings] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (id) fetchReadings();
  }, [id]);

  const fetchReadings = async () => {
    const res = await fetch(`/api/meters/electricity/${id}`);
    const data = await res.json();
    setReadings(data);
  };

  const addReading = async () => {
    if (!value) return;

    await fetch(`/api/meters/electricity/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: Number(value) }),
    });

    setValue("");
    fetchReadings();
  };

  // 🔥 Enriched Data (Value + Consumption)
  const enriched = readings.map((r, index) => ({
    ...r,
    date: new Date(r.readingDate).toLocaleDateString(),
    value: r.value,
    consumption:
      index === 0
        ? 0
        : r.value - readings[index - 1].value,
  }));

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Electricity Meter
      </h1>

      {/* Add Reading */}
      <div className="flex gap-4 mb-8">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Today's kWh reading"
          className="p-3 rounded-lg bg-gray-900 border border-white/20 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={addReading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
        >
          Add Reading
        </button>
      </div>

      {/* Chart */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={enriched}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />

            {/* 🔵 Consumption Bar */}
            <Bar
              dataKey="consumption"
              fill="#3B82F6"
              name="Daily Consumption (kWh)"
              radius={[6, 6, 0, 0]}
            />

            {/* 🟢 Reading Line */}
            <Line
              type="monotone"
              dataKey="value"
              stroke="#22C55E"
              strokeWidth={2}
              name="Meter Reading (kWh)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Reading List Below */}
      <div className="mt-8 space-y-2">
        <h2 className="text-lg font-semibold mb-2">
          Daily Records
        </h2>

        {enriched.map((r, i) => (
          <div
            key={i}
            className="flex justify-between bg-white/5 p-3 rounded-lg border border-white/10"
          >
            <span>{r.date}</span>
            <span className="text-green-400">
              Reading: {r.value} kWh
            </span>
            <span className="text-blue-400">
              Consumption: {r.consumption} kWh
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
