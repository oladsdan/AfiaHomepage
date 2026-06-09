import { ChevronRight, FileText, ShieldCheck } from "lucide-react";
import { analyzerBenefits } from "@/lib/web/video-analyzer-data";
import { Card } from "../dashboard/_components/ui/Card";
import { IconBadge } from "../dashboard/_components/ui/IconBadge";
import { UploadCard } from "./_components/UploadCard";

export default function VideoAnalyzerPage() {
  return (
    <>
      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-dash-border bg-dash-surface px-3 py-2 text-sm font-medium text-dash-ink transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2"
        >
          <FileText className="h-4 w-4" aria-hidden="true" />
          Drafts
        </button>
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-2xl font-bold text-dash-ink sm:text-3xl">
          Analyze your video. Grow your content.
        </h1>
        <p className="mt-2 text-sm text-dash-muted">
          Upload a video and get AI-powered insights to improve engagement,
          retention, and performance.
        </p>
      </div>

      <UploadCard />

      <section aria-label="What you'll get" className="space-y-3">
        <h2 className="text-sm font-semibold text-dash-ink">What you&apos;ll get</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {analyzerBenefits.map((benefit) => (
            <Card key={benefit.id} className="p-5">
              <IconBadge icon={benefit.icon} color={benefit.color} />
              <h3 className="mt-4 text-sm font-semibold text-dash-ink">
                {benefit.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-dash-muted">
                {benefit.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dash-brand/10 text-dash-brand">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-dash-ink">
              Your data is secure
            </p>
            <p className="text-xs text-dash-muted">
              We never share your videos. All analysis is private and
              confidential.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1 self-start rounded text-sm font-semibold text-dash-brand transition-colors hover:text-dash-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand sm:self-auto"
        >
          Learn more about privacy
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </Card>
    </>
  );
}
