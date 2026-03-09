"use client";

import { useState, useCallback } from "react";
import SensorCard from "./SensorCard";
import IOStatus from "./IOStatus";
import ControlPanel, { type PanelTarget } from "./ControlPanel";
import type { SensorReading } from "@/lib/db";

type Props = {
  reading: SensorReading;
};

const SENSOR_CONFIG = [
  { id: "temperature", label: "Sıcaklık", key: "temperature" as const, unit: "°C", min: 18, max: 32 },
  { id: "humidity", label: "Bağıl Nem", key: "humidity" as const, unit: "%", min: 40, max: 80 },
  { id: "soil_moisture", label: "Toprak Nemi", key: "soil_moisture" as const, unit: "%", min: 30, max: 70 },
  { id: "ph", label: "pH", key: "ph" as const, unit: "", min: 6, max: 7.5 },
  { id: "co2", label: "CO₂", key: "co2" as const, unit: "ppm", min: 350, max: 600 },
  { id: "light", label: "Işık Şiddeti", key: "light_intensity" as const, unit: "lux", min: 0, max: 1000 },
  { id: "minerals", label: "Toprak Minerali", key: "minerals" as const, unit: "%", min: 50, max: 90 },
];

export default function DashboardClient({ reading }: Props) {
  const [panelTarget, setPanelTarget] = useState<PanelTarget | null>(null);
  const [ioState, setIoState] = useState({
    irrigation: reading.soil_moisture < 35,
    spray: false,
    heater: reading.temperature < 20,
    cooler: reading.temperature > 28,
  });
  const [settings, setSettings] = useState({
    irrigationThreshold: 35,
    targetTemp: 24,
    sprayTime: "07:00",
  });

  const handleIoChange = useCallback((key: keyof typeof ioState, value: boolean) => {
    setIoState((s) => ({ ...s, [key]: value }));
  }, []);

  const handleSettingsChange = useCallback((key: string, value: number | string) => {
    setSettings((s) => ({ ...s, [key]: value }));
  }, []);

  const openSensorPanel = (id: string, label: string, key: keyof SensorReading, unit: string, min: number, max: number) => {
    const value = reading[key];
    if (typeof value !== "number") return;
    setPanelTarget({ type: "sensor", id, label, value, unit, min, max });
  };

  const openIOPanel = (item: { id: string; label: string; on: boolean; desc: string }) => {
    setPanelTarget({
      type: "io",
      id: item.id,
      label: item.label,
      isOn: item.on,
      desc: item.desc,
    });
  };

  return (
    <div>
      <h1 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>Sera Dashboard</h1>
      <p style={{ color: "#666", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        Kartlara tıklayarak ayar panelini açın. Prototip modu.
      </p>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1rem", marginBottom: "0.75rem", color: "#444" }}>Sensörler</h2>
        <div style={gridStyle}>
          {SENSOR_CONFIG.map((c) => (
            <SensorCard
              key={c.id}
              label={c.label}
              value={reading[c.key] as number}
              unit={c.unit}
              min={c.min}
              max={c.max}
              onClick={() => openSensorPanel(c.id, c.label, c.key, c.unit, c.min, c.max)}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: "1rem", marginBottom: "0.75rem", color: "#444" }}>I/O Cihazlar</h2>
        <IOStatus
          soilMoisture={reading.soil_moisture}
          temperature={reading.temperature}
          irrigationOn={ioState.irrigation}
          sprayOn={ioState.spray}
          heaterOn={ioState.heater}
          coolerOn={ioState.cooler}
          onItemClick={openIOPanel}
        />
      </section>

      <p style={{ marginTop: "1.5rem", fontSize: "0.8rem", color: "#888" }}>
        Son güncelleme: {new Date(reading.created_at).toLocaleString("tr-TR")}
      </p>

      <ControlPanel
        target={panelTarget}
        onClose={() => setPanelTarget(null)}
        ioState={ioState}
        onIoChange={handleIoChange}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
  gap: "1rem",
};
