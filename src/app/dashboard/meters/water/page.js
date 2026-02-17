"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function WaterPage() {
  const [readings, setReadings] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    fetchReadings();
  }, []);

  const fetchReadings = async () => {
    const res = await fetch("/api/meters/water");
    const data = await res.json();
    setReadings(data);
  };

  const addReading = async () => {
    await fetch("/api/meters/water", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });

    setValue("");
    fetchReadings();
  };

  const chartData = readings.map((r) => ({
    ...r,
    date: new Date(r.readingDate).toLocaleDateString(),
  }));

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Water Readings (Last 30 Days)
      </h1>

      <div className="flex gap-4 mb-8">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Today's water reading"
          className="p-2 rounded bg-gray-900 border border-white/20"
        />
        <button
          onClick={addReading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Reading
        </button>
      </div>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
