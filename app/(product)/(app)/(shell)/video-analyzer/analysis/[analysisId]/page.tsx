"use client";

import { useRouter } from "next/navigation";
import { AnalysisView } from "../../_components/AnalysisView";

/**
 * Past/pending analysis view — history rows link here. Polls while the
 * analysis is PENDING and renders the full results when it completes.
 */
export default function AnalysisPage({
  params,
}: {
  params: { analysisId: string };
}) {
  const router = useRouter();

  return (
    <AnalysisView
      analysisId={params.analysisId}
      onAnalyzeRevision={(id) =>
        router.push(`/video-analyzer?revisionOf=${encodeURIComponent(id)}`)
      }
    />
  );
}
