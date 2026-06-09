export function DurationBadge({ duration }: { duration: string }) {
  return (
    <span className="absolute bottom-2 right-2 rounded-md bg-black/75 px-1.5 py-0.5 text-[11px] font-medium text-white">
      {duration}
    </span>
  );
}
