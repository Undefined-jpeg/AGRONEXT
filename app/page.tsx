import { getLatestReading } from "@/lib/db";
import { SAMPLE_READING } from "@/lib/sample-data";
import DashboardClient from "./components/DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const dbReading = await getLatestReading();
  const reading = dbReading ?? SAMPLE_READING;

  return <DashboardClient reading={reading} />;
}
