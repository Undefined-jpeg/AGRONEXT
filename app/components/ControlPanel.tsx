"use client";

import { useState } from "react";

export type PanelTarget =
  | { type: "sensor"; id: string; label: string; value: number; unit: string; min: number; max: number }
  | { type: "io"; id: string; label: string; isOn: boolean; desc: string };

type Props = {
  target: PanelTarget | null;
  onClose: () => void;
  ioState: { irrigation: boolean; spray: boolean; heater: boolean; cooler: boolean };
  onIoChange: (key: "irrigation" | "spray" | "heater" | "cooler", value: boolean) => void;
  // Ayarlar
  settings: {
    irrigationThreshold: number;
    targetTemp: number;
    sprayTime: string;
  };
  onSettingsChange: (key: string, value: number | string) => void;
};

export default function ControlPanel({
  target,
  onClose,
  ioState,
  onIoChange,
  settings,
  onSettingsChange,
}: Props) {
  if (!target) return null;

  return (
    <>
      <div style={overlayStyle} onClick={onClose} aria-hidden="true" />
      <div style={panelStyle}>
        <div style={headerStyle}>
          <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{target.label}</h3>
          <button onClick={onClose} style={closeBtn} aria-label="Kapat">
            ×
          </button>
        </div>

        <div style={contentStyle}>
          {target.type === "sensor" && <SensorPanelContent target={target} />}
          {target.type === "io" && (
            <IOPanelContent
              target={target}
              ioState={ioState}
              onIoChange={onIoChange}
              settings={settings}
              onSettingsChange={onSettingsChange}
            />
          )}
        </div>
      </div>
    </>
  );
}

function SensorPanelContent({ target }: { target: Extract<PanelTarget, { type: "sensor" }> }) {
  const [alertMin, setAlertMin] = useState(target.min);
  const [alertMax, setAlertMax] = useState(target.max);

  return (
    <div>
      <div style={sectionStyle}>
        <div style={valueBlock}>
          <span style={{ fontSize: "0.85rem", color: "#666" }}>Anlık değer</span>
          <span style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1a5f2a" }}>
            {target.value.toFixed(1)}{target.unit}
          </span>
        </div>
      </div>
      <div style={sectionStyle}>
        <h4 style={sectionTitle}>Uyarı eşikleri</h4>
        <p style={{ fontSize: "0.8rem", color: "#666", marginBottom: "0.5rem" }}>
          Bu aralığın dışına çıkınca bildirim gönderilir.
        </p>
        <div style={rowStyle}>
          <label style={labelStyle}>
            Min
            <input
              type="number"
              value={alertMin}
              onChange={(e) => setAlertMin(parseFloat(e.target.value) || target.min)}
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            Max
            <input
              type="number"
              value={alertMax}
              onChange={(e) => setAlertMax(parseFloat(e.target.value) || target.max)}
              style={inputStyle}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

function IOPanelContent({
  target,
  ioState,
  onIoChange,
  settings,
  onSettingsChange,
}: {
  target: Extract<PanelTarget, { type: "io" }>;
  ioState: Props["ioState"];
  onIoChange: Props["onIoChange"];
  settings: Props["settings"];
  onSettingsChange: Props["onSettingsChange"];
}) {
  const id = target.id;

  if (id === "irrigation") {
    return (
      <div>
        <ToggleRow
          label="Sulama pompası"
          checked={ioState.irrigation}
          onChange={(v) => onIoChange("irrigation", v)}
        />
        <div style={sectionStyle}>
          <h4 style={sectionTitle}>Otomatik tetikleme</h4>
          <label style={labelStyle}>
            Toprak nemi bu değerin altına düşünce pompa açılsın (%)
            <input
              type="number"
              min={20}
              max={50}
              value={settings.irrigationThreshold}
              onChange={(e) => onSettingsChange("irrigationThreshold", parseFloat(e.target.value) || 35)}
              style={inputStyle}
            />
          </label>
        </div>
      </div>
    );
  }

  if (id === "spray") {
    return (
      <div>
        <ToggleRow
          label="Biyopestisit püskürtme"
          checked={ioState.spray}
          onChange={(v) => onIoChange("spray", v)}
        />
        <div style={sectionStyle}>
          <h4 style={sectionTitle}>Zamanlama</h4>
          <label style={labelStyle}>
            Günlük uygulama saati
            <input
              type="time"
              value={settings.sprayTime}
              onChange={(e) => onSettingsChange("sprayTime", e.target.value)}
              style={inputStyle}
            />
          </label>
        </div>
      </div>
    );
  }

  if (id === "heater-cooler") {
    return (
      <div>
        <ToggleRow
          label="Isıtıcı"
          checked={ioState.heater}
          onChange={(v) => onIoChange("heater", v)}
        />
        <ToggleRow
          label="Soğutucu"
          checked={ioState.cooler}
          onChange={(v) => onIoChange("cooler", v)}
        />
        <div style={sectionStyle}>
          <h4 style={sectionTitle}>Hedef sıcaklık</h4>
          <label style={labelStyle}>
            İstenen sera sıcaklığı (°C)
            <input
              type="number"
              min={18}
              max={30}
              step={0.5}
              value={settings.targetTemp}
              onChange={(e) => onSettingsChange("targetTemp", parseFloat(e.target.value) || 24)}
              style={inputStyle}
            />
          </label>
        </div>
      </div>
    );
  }

  return <p style={{ color: "#666" }}>Ayarlar yükleniyor...</p>;
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div style={toggleRowStyle}>
      <span>{label}</span>
      <button
        onClick={() => onChange(!checked)}
        style={{
          ...toggleBtn,
          background: checked ? "#22c55e" : "#e5e7eb",
          color: checked ? "#fff" : "#374151",
        }}
      >
        {checked ? "Açık" : "Kapalı"}
      </button>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.3)",
  zIndex: 40,
  animation: "fadeIn 0.2s ease",
};

const panelStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  right: 0,
  width: "min(380px, 100vw)",
  height: "100vh",
  background: "#fff",
  boxShadow: "-4px 0 20px rgba(0,0,0,0.1)",
  zIndex: 50,
  display: "flex",
  flexDirection: "column",
  animation: "slideIn 0.25s ease",
};

const headerStyle: React.CSSProperties = {
  padding: "1rem 1.25rem",
  borderBottom: "1px solid #e5e7eb",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const closeBtn: React.CSSProperties = {
  width: 32,
  height: 32,
  border: "none",
  background: "#f3f4f6",
  borderRadius: 6,
  fontSize: "1.25rem",
  cursor: "pointer",
  lineHeight: 1,
};

const contentStyle: React.CSSProperties = {
  padding: "1.25rem",
  overflowY: "auto",
  flex: 1,
};

const sectionStyle: React.CSSProperties = {
  marginTop: "1.25rem",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "0.9rem",
  marginBottom: "0.5rem",
  color: "#374151",
};

const valueBlock: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  gap: "1rem",
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.35rem",
  fontSize: "0.85rem",
  color: "#374151",
};

const inputStyle: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  fontSize: "0.95rem",
};

const toggleRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0.75rem 0",
  borderBottom: "1px solid #f3f4f6",
};

const toggleBtn: React.CSSProperties = {
  padding: "0.4rem 0.9rem",
  borderRadius: 6,
  border: "none",
  fontSize: "0.85rem",
  cursor: "pointer",
  fontWeight: 500,
};
