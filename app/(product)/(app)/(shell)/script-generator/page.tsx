import { Sparkles } from "lucide-react";
import { HelpSidebar } from "../caption-generator/_components/HelpSidebar";
import { ScriptForm } from "./_components/ScriptForm";
import { SavedScriptsPanel } from "./_components/SavedScriptsPanel";

export default function ScriptGeneratorPage() {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-dash-ink">
            Generate Script
            <Sparkles className="h-5 w-5 text-dash-brand" aria-hidden="true" />
          </h1>
          <p className="mt-1 text-sm text-dash-muted">
            Generate structured, engaging scripts tailored to your content,
            platform, and audience.
          </p>
        </div>
        <SavedScriptsPanel />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <ScriptForm />
        <HelpSidebar />
      </div>
    </>
  );
}
