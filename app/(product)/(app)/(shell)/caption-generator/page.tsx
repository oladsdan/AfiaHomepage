import { Sparkles } from "lucide-react";
import { CaptionForm } from "./_components/CaptionForm";
import { HelpSidebar } from "./_components/HelpSidebar";
import { SavedCaptionsPanel } from "./_components/SavedCaptionsPanel";

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
        <SavedCaptionsPanel />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <CaptionForm />
        <HelpSidebar />
      </div>
    </>
  );
}
