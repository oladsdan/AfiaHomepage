export default function Loading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <div className="h-8 w-56 animate-pulse rounded-lg bg-dash-border/60" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-dash bg-dash-border/50"
          />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-dash-lg bg-dash-border/50" />
    </div>
  );
}
