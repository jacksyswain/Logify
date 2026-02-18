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
  const type = params?.type;

  const [readings, setReadings] = useState([]);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= Fetch Readings ================= */
  useEffect(() => {
    if (!type) return; // ✅ prevent undefined call

    fetchReadings();
  }, [type]); // ✅ depend on type

  const fetchReadings = async () => {
    try {
      const res = await fetch(`/api/meters/${type}`);
      if (!res.ok) throw new Error("Failed to fetch");

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

    try {
      const res = await fetch(`/api/meters/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: Number(value) }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Failed to add reading");
        return;
      }

      setValue("");
      fetchReadings();
    } catch (err) {
      console.error("Add reading error:", err);
    }
  };

  /* ================= Chart Data ================= */
  const data = readings.map((r) => ({
    ...r,
    date: new Date(r.readingDate).toLocaleDateString(),
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
          className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition"
        >
          Add
        </button>
      </div>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        {loading ? (
          <p className="text-gray-400">Loading readings...</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
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
