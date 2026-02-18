"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MeterTypePage() {
  const params = useParams();
  const type = params?.type?.toLowerCase();

  const [readings, setReadings] = useState([]);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= Fetch Readings ================= */
  useEffect(() => {
    if (!type) return;

    if (!["gas", "water"].includes(type)) {
      console.error("Invalid route type:", type);
      return;
    }

    fetchReadings();
  }, [type]);

  const fetchReadings = async () => {
    try {
      const res = await fetch(`/api/meters/${type}`);
      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();
      setReadings(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= Add Reading ================= */
  const addReading = async () => {
    if (!value || !type) return;

    if (!["gas", "water"].includes(type)) return;

    try {
      const res = await fetch(`/api/meters/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: Number(value) }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error adding reading");
        return;
      }

      setValue("");
      fetchReadings();
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  const chartData = readings.map((r) => ({
    date: new Date(r.readingDate).toLocaleDateString(),
    value: r.value,
  }));

  if (!type) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        Loading meter...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold capitalize mb-6">
        {type} Readings
      </h1>

      <div className="flex gap-4 mb-8">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Today's reading"
          className="p-2 rounded bg-gray-900 border border-white/20"
        />
        <button
          onClick={addReading}
          className="px-4 py-2 bg-white text-black rounded"
        >
          Add
        </button>
      </div>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#ffffff" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
