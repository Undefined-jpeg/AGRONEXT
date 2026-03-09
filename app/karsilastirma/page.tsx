import { getDailyAverages } from "@/lib/db";
import { getSampleDailyAverages } from "@/lib/sample-data";
import ComparisonChart from "@/app/karsilastirma/ComparisonChart";

export const dynamic = "force-dynamic";

export default async function KarsilastirmaPage() {
  const dbAverages = await getDailyAverages(14);
  const sampleAverages = getSampleDailyAverages(14);
  const averages =
    dbAverages.length > 0 ? dbAverages : sampleAverages;

  const chartData = averages.map((r) => ({
    date: typeof r.date === "string" ? r.date : String(r.date),
    avg_temp: Number(r.avg_temp),
    avg_humidity: Number(r.avg_humidity),
    avg_soil: Number(r.avg_soil),
    avg_ph: Number(r.avg_ph),
    avg_co2: Number(r.avg_co2),
    avg_light: Number(r.avg_light),
    avg_minerals: Number(r.avg_minerals),
  }));

  return (
    <div>
      <h1 style={{ marginBottom: "0.5rem", fontSize: "1.5rem" }}>
        Veriler
      </h1>
      <p style={{ color: "#666", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        Son 14 günün ortalama sensör değerleri. Günler arası farkları inceleyin.
      </p>

      <ComparisonChart data={chartData} />
    </div>
  );
}
