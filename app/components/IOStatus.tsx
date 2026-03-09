"use client";

type IOItem = {
  id: string;
  label: string;
  on: boolean;
  desc: string;
};

type Props = {
  soilMoisture: number;
  temperature: number;
  irrigationOn?: boolean;
  sprayOn?: boolean;
  heaterOn?: boolean;
  coolerOn?: boolean;
  onItemClick?: (item: IOItem) => void;
};

export default function IOStatus({
  soilMoisture,
  temperature,
  irrigationOn: irrigationProp,
  sprayOn: sprayProp,
  heaterOn: heaterProp,
  coolerOn: coolerProp,
  onItemClick,
}: Props) {
  const irrigationOn = irrigationProp ?? soilMoisture < 35;
  const heaterOn = heaterProp ?? temperature < 20;
  const coolerOn = coolerProp ?? temperature > 28;
  const sprayOn = sprayProp ?? false;

  const items: IOItem[] = [
    { id: "irrigation", label: "Sulama Pompası", on: irrigationOn, desc: irrigationOn ? "Açık" : "Kapalı" },
    { id: "spray", label: "Biyopestisit Püskürtme", on: sprayOn, desc: sprayOn ? "Açık" : "Kapalı" },
    {
      id: "heater-cooler",
      label: "Isıtıcı / Soğutucu",
      on: heaterOn || coolerOn,
      desc: heaterOn ? "Isıtıcı aktif" : coolerOn ? "Soğutucu aktif" : "Kapalı",
    },
  ];

  return (
    <div style={containerStyle}>
      {items.map((item) => (
        <div
          key={item.id}
          role="button"
          tabIndex={0}
          onClick={() => onItemClick?.(item)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onItemClick?.(item)}
          style={{
            ...itemStyle,
            cursor: onItemClick ? "pointer" : "default",
          }}
          className={onItemClick ? "clickable-card" : ""}
          aria-label={`${item.label} - ${item.desc}. Tıklayarak ayarları aç`}
        >
          <div
            style={{
              ...dotStyle,
              background: item.on ? "#22c55e" : "#e5e7eb",
              boxShadow: item.on ? "0 0 8px rgba(34,197,94,0.5)" : "none",
              animation: item.on ? "blink 1.5s ease-in-out infinite" : "none",
            }}
          />
          <div>
            <div style={itemLabel}>{item.label}</div>
            <div style={itemDesc}>{item.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
};

const itemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  background: "#fff",
  padding: "1rem 1.25rem",
  borderRadius: 8,
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  minWidth: 220,
};

const dotStyle: React.CSSProperties = {
  width: 12,
  height: 12,
  borderRadius: "50%",
};

const itemLabel: React.CSSProperties = {
  fontWeight: 600,
  fontSize: "0.95rem",
};

const itemDesc: React.CSSProperties = {
  fontSize: "0.8rem",
  color: "#666",
  marginTop: "0.15rem",
};
