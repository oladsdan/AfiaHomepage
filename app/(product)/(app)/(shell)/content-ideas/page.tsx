import { Sparkles } from "lucide-react";
import { HelpSidebar } from "../caption-generator/_components/HelpSidebar";
import { ContentIdeasForm } from "./_components/ContentIdeasForm";
import { SavedIdeasPanel } from "./_components/SavedIdeasPanel";

export default function ContentIdeasPage() {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-dash-ink">
            Get Fresh Content Ideas
            <Sparkles className="h-5 w-5 text-dash-brand" aria-hidden="true" />
          </h1>
          <p className="mt-1 text-sm text-dash-muted">
            Generate creative, high-performing video ideas tailored to your
            audience and niche.
          </p>
        </div>
        <SavedIdeasPanel />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <ContentIdeasForm />
        <HelpSidebar />
      </div>
    </>
  );
}
