import { analysisHistory } from "@/lib/web/analysis-history-data";
import { AnalysisHistory } from "./_components/AnalysisHistory";

export default function RecentVideosPage() {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-dash-ink">Analysis history</h1>
        <p className="mt-1 text-sm text-dash-muted">
          Review every video you&apos;ve analyzed, search past reports, and pick
          up where you left off.
        </p>
      </div>

      <div className="mt-6">
        <AnalysisHistory items={analysisHistory} />
      </div>
    </>
  );
}
