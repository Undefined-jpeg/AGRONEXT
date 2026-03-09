import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";
import { generateSampleReadings } from "../lib/sample-data";

const force = process.argv.includes("--force");

async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL tanımlı değil. .env.local dosyasını kontrol edin.");
    process.exit(1);
  }

  const sql = neon(url);

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

  const count = await sql`SELECT COUNT(*) as c FROM sensor_readings`;
  const hasData = Number((count[0] as { c: string }).c) > 0;

  if (hasData && !force) {
    console.log("Veritabanında zaten veri var. Yeniden doldurmak için: npm run db:seed -- --force");
    return;
  }

  if (force && hasData) {
    await sql`TRUNCATE sensor_readings RESTART IDENTITY`;
    console.log("Mevcut veriler silindi.");
  }

  const samples = generateSampleReadings(14);
  for (const r of samples) {
    await sql`
      INSERT INTO sensor_readings (created_at, temperature, humidity, soil_moisture, ph, co2, light_intensity, minerals)
      VALUES (${r.created_at}, ${r.temperature}, ${r.humidity}, ${r.soil_moisture}, ${r.ph}, ${r.co2}, ${r.light_intensity}, ${r.minerals})
    `;
  }
  console.log(`${samples.length} örnek kayıt eklendi.`);
}

seed().catch(console.error);
