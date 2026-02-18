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

  useEffect(() => {
    if (!type) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/meters/${type}`);

        if (!res.ok) {
          setReadings([]);
          return;
        }

        const data = await res.json();
        setReadings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch error:", err);
        setReadings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  const addReading = async () => {
    if (!value || !type) return;

    const res = await fetch(`/api/meters/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: Number(value) }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    setValue("");
    setReadings((prev) => [...prev, data.reading]);
  };

  const chartData = readings.map((r) => ({
    ...r,
    date: new Date(r.readingDate).toLocaleDateString(),
  }));

  if (!type) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        Invalid meter type
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
          className="p-3 rounded bg-gray-900 border border-white/20"
        />
        <button
          onClick={addReading}
          className="px-5 py-3 bg-blue-600 text-white rounded"
        >
          Add
        </button>
      </div>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        {loading ? (
          <p className="text-gray-400">Loading readings...</p>
        ) : readings.length === 0 ? (
          <p className="text-gray-400">
            No readings added yet.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
