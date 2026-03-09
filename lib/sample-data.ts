// DB yoksa veya prototip modunda kullanılacak örnek veriler
import type { SensorReading } from "./db";

export const SAMPLE_READING: SensorReading = {
  id: 1,
  created_at: new Date(),
  temperature: 24.5,
  humidity: 65,
  soil_moisture: 42,
  ph: 6.8,
  co2: 420,
  light_intensity: 850,
  minerals: 72,
};

export function generateSampleReadings(days: number = 14): SensorReading[] {
  const readings: SensorReading[] = [];
  const now = new Date();

  for (let d = days - 1; d >= 0; d--) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    for (let h = 0; h < 24; h += 3) {
      const t = new Date(date);
      t.setHours(h, 0, 0, 0);
      const isDay = h >= 6 && h <= 18;
      readings.push({
        id: readings.length + 1,
        created_at: t,
        temperature: 20 + Math.random() * 8 + (isDay ? 2 : 0),
        humidity: 50 + Math.random() * 35,
        soil_moisture: 30 + Math.random() * 45,
        ph: 6.0 + Math.random() * 1.5,
        co2: 350 + Math.random() * 150,
        light_intensity: isDay ? 300 + Math.random() * 700 : 20 + Math.random() * 80,
        minerals: 55 + Math.random() * 35,
      });
    }
  }
  return readings;
}

export function getSampleDailyAverages(days: number = 7) {
  const readings = generateSampleReadings(days);
  const byDate = new Map<string, SensorReading[]>();
  for (const r of readings) {
    const d = r.created_at.toISOString().slice(0, 10);
    if (!byDate.has(d)) byDate.set(d, []);
    byDate.get(d)!.push(r);
  }
  return Array.from(byDate.entries()).map(([date, arr]) => ({
    date,
    avg_temp: +(arr.reduce((s, x) => s + x.temperature, 0) / arr.length).toFixed(2),
    avg_humidity: +(arr.reduce((s, x) => s + x.humidity, 0) / arr.length).toFixed(2),
    avg_soil: +(arr.reduce((s, x) => s + x.soil_moisture, 0) / arr.length).toFixed(2),
    avg_ph: +(arr.reduce((s, x) => s + x.ph, 0) / arr.length).toFixed(2),
    avg_co2: +(arr.reduce((s, x) => s + x.co2, 0) / arr.length).toFixed(2),
    avg_light: +(arr.reduce((s, x) => s + x.light_intensity, 0) / arr.length).toFixed(2),
    avg_minerals: +(arr.reduce((s, x) => s + x.minerals, 0) / arr.length).toFixed(2),
  }));
}
