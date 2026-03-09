"use client";

type Props = {
  label: string;
  value: number;
  unit: string;
  min?: number;
  max?: number;
  id?: string;
  onClick?: () => void;
};

export default function SensorCard({ label, value, unit, min = 0, max = 100, id, onClick }: Props) {
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 50;
  const clamped = Math.min(100, Math.max(0, pct));

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
      style={{
        ...cardStyle,
        cursor: onClick ? "pointer" : "default",
      }}
      className={onClick ? "clickable-card" : ""}
      aria-label={`${label} - ${value}${unit}. Tıklayarak ayarları aç`}
    >
      <div style={labelStyle}>{label}</div>
      <div
        style={{
          ...valueStyle,
          animation: "pulse 2s ease-in-out infinite",
        }}
      >
        {typeof value === "number" ? value.toFixed(1) : value}
        {unit}
      </div>
      <div style={barBg}>
        <div
          style={{
            ...barFill,
            width: `${clamped}%`,
            transition: "width 0.5s ease",
          }}
        />
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 8,
  padding: "1rem",
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  transition: "box-shadow 0.2s, transform 0.2s",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  color: "#666",
  marginBottom: "0.25rem",
};

const valueStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  fontWeight: 600,
  color: "#1a5f2a",
};

const barBg: React.CSSProperties = {
  height: 4,
  background: "#e0e0e0",
  borderRadius: 2,
  marginTop: "0.5rem",
  overflow: "hidden",
};

const barFill: React.CSSProperties = {
  height: "100%",
  background: "#1a5f2a",
  borderRadius: 2,
};
