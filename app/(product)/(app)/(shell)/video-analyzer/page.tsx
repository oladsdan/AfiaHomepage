import { Suspense } from "react";
import { VideoAnalyzer } from "./_components/VideoAnalyzer";

export default function VideoAnalyzerPage() {
  // Suspense boundary required because VideoAnalyzer reads useSearchParams()
  // (the ?revisionOf=<analysisId> revision entry point).
  return (
    <Suspense fallback={null}>
      <VideoAnalyzer />
    </Suspense>
  );
}
