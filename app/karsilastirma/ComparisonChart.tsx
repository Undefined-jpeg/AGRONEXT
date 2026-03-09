"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type DailyRow = {
  date: string;
  avg_temp: number;
  avg_humidity: number;
  avg_soil: number;
  avg_ph: number;
  avg_co2: number;
  avg_light: number;
  avg_minerals: number;
};

type Props = { data: DailyRow[] };

export default function ComparisonChart({ data }: Props) {
  const chartData = data.map((d) => ({
    ...d,
    tarih: new Date(d.date).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
    }),
  }));

  return (
    <div style={wrapperStyle}>
      <div style={chartStyle}>
        <h3 style={subTitle}>Sıcaklık (°C)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="tarih" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip labelFormatter={(t) => t} />
            <Line
              type="monotone"
              dataKey="avg_temp"
              stroke="#1a5f2a"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Ort. Sıcaklık"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={chartStyle}>
        <h3 style={subTitle}>Nem & Toprak Nemi (%)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="tarih" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip labelFormatter={(t) => t} />
            <Line
              type="monotone"
              dataKey="avg_humidity"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Bağıl Nem"
            />
            <Line
              type="monotone"
              dataKey="avg_soil"
              stroke="#7c3aed"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Toprak Nemi"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={chartStyle}>
        <h3 style={subTitle}>CO₂ (ppm) & Işık (lux)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="tarih" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
            <Tooltip labelFormatter={(t) => t} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="avg_co2"
              stroke="#0d9488"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="CO₂"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avg_light"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Işık"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={chartStyle}>
        <h3 style={subTitle}>pH & Mineral (%)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="tarih" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip labelFormatter={(t) => t} />
            <Line
              type="monotone"
              dataKey="avg_ph"
              stroke="#dc2626"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="pH"
            />
            <Line
              type="monotone"
              dataKey="avg_minerals"
              stroke="#4b5563"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Mineral"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const wrapperStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
};

const chartStyle: React.CSSProperties = {
  background: "#fff",
  padding: "1rem",
  borderRadius: 8,
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
};

const subTitle: React.CSSProperties = {
  fontSize: "0.9rem",
  marginBottom: "0.5rem",
  color: "#444",
};
