import { neon } from "@neondatabase/serverless";

export type SensorReading = {
  id: number;
  created_at: Date;
  temperature: number;
  humidity: number;
  soil_moisture: number;
  ph: number;
  co2: number;
  light_intensity: number;
  minerals: number;
};

export type IOStatus = {
  irrigation_pump: boolean;
  spray_system: boolean;
  heater_cooler: boolean;
};

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}

export async function initDb() {
  const sql = getSql();
  if (!sql) return false;

  await sql`
    CREATE TABLE IF NOT EXISTS sensor_readings (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      temperature DECIMAL(5,2),
      humidity DECIMAL(5,2),
      soil_moisture DECIMAL(5,2),
      ph DECIMAL(4,2),
      co2 DECIMAL(6,2),
      light_intensity DECIMAL(6,2),
      minerals DECIMAL(5,2)
    )
  `;
  return true;
}

export async function getLatestReading(): Promise<SensorReading | null> {
  const sql = getSql();
  if (!sql) return null;

  const rows = await sql`
    SELECT * FROM sensor_readings
    ORDER BY created_at DESC LIMIT 1
  `;
  return (rows[0] as SensorReading) ?? null;
}

export async function getReadingsByDate(date: string): Promise<SensorReading[]> {
  const sql = getSql();
  if (!sql) return [];

  const rows = await sql`
    SELECT * FROM sensor_readings
    WHERE created_at::date = ${date}::date
    ORDER BY created_at ASC
  `;
  return rows as SensorReading[];
}

export async function getDailyAverages(days: number = 7) {
  const sql = getSql();
  if (!sql) return [];

  const rows = await sql`
    SELECT 
      DATE(created_at) as date,
      AVG(temperature)::numeric(5,2) as avg_temp,
      AVG(humidity)::numeric(5,2) as avg_humidity,
      AVG(soil_moisture)::numeric(5,2) as avg_soil,
      AVG(ph)::numeric(4,2) as avg_ph,
      AVG(co2)::numeric(6,2) as avg_co2,
      AVG(light_intensity)::numeric(6,2) as avg_light,
      AVG(minerals)::numeric(5,2) as avg_minerals
    FROM sensor_readings
    WHERE created_at >= NOW() - make_interval(days => ${days})
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `;
  return rows;
}

export async function insertReading(data: Omit<SensorReading, "id" | "created_at">) {
  const sql = getSql();
  if (!sql) return null;

  const [row] = await sql`
    INSERT INTO sensor_readings (temperature, humidity, soil_moisture, ph, co2, light_intensity, minerals)
    VALUES (${data.temperature}, ${data.humidity}, ${data.soil_moisture}, ${data.ph}, ${data.co2}, ${data.light_intensity}, ${data.minerals})
    RETURNING *
  `;
  return row;
}
