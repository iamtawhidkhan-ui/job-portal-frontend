// Sits fixed behind all page content. Uses slow CSS keyframe animations
// (defined in index.css) rather than JS, so it's cheap to run everywhere.
// Solid-background sections (cards, header, dark hero/stats bands) naturally
// occlude it locally — it shows through in the lighter, transparent gaps,
// giving an ambient "always moving" feel without hurting text readability.
export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute -top-32 -left-24 w-[36rem] h-[36rem] rounded-full bg-brand-400/25 blur-3xl animate-drift-a" />
      <div className="absolute top-1/3 -right-32 w-[32rem] h-[32rem] rounded-full bg-accent-500/15 blur-3xl animate-drift-b" />
      <div className="absolute bottom-0 left-1/4 w-[28rem] h-[28rem] rounded-full bg-brand-600/15 blur-3xl animate-drift-c" />
    </div>
  );
}
