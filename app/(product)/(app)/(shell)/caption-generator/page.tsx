import { Bookmark, Sparkles } from "lucide-react";
import { CaptionForm } from "./_components/CaptionForm";
import { HelpSidebar } from "./_components/HelpSidebar";

export default function CaptionGeneratorPage() {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-dash-ink">
            Generate Captions
            <Sparkles className="h-5 w-5 text-dash-brand" aria-hidden="true" />
          </h1>
          <p className="mt-1 text-sm text-dash-muted">
            Create scroll-stopping captions tailored to your video and audience.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-dash-border bg-dash-surface px-3 py-2 text-sm font-medium text-dash-ink transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2"
        >
          <Bookmark className="h-4 w-4" aria-hidden="true" />
          Saved templates
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <CaptionForm />
        <HelpSidebar />
      </div>
    </>
  );
}
