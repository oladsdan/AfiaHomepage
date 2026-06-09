import { StatsRow } from "./_components/sections/StatsRow";
import { AnalyzerHero } from "./_components/sections/AnalyzerHero";
import { FeatureGrid } from "./_components/sections/FeatureGrid";
import { RecentVideos } from "./_components/sections/RecentVideos";

export default function DashboardPage() {
  return (
    <>
      <StatsRow />
      <AnalyzerHero href="/video-analyzer" />
      <FeatureGrid />
      <RecentVideos />
    </>
  );
}
