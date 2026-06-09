import { PageHeader } from "../components/PageHeader";
import { InspirationVideosTable } from "../components/InspirationVideosTable";

export default function AdminInspirationVideosPage() {
  return (
    <div>
      <PageHeader
        title="Inspiration Videos"
        subtitle="Manage the curated video library shown to creators in the app"
      />
      <InspirationVideosTable />
    </div>
  );
}
