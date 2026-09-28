export default function Crosshair() {
  return (
    <div
      aria-label="Aiming crosshair"
      className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-6 w-6 -translate-x-1/2 -translate-y-1/2"
    >
      <span className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-amber-100 shadow-[0_0_5px_rgba(255,220,160,0.9)]" />
      <span className="absolute bottom-0 left-1/2 h-2 w-px -translate-x-1/2 bg-amber-100 shadow-[0_0_5px_rgba(255,220,160,0.9)]" />
      <span className="absolute left-0 top-1/2 h-px w-2 -translate-y-1/2 bg-amber-100 shadow-[0_0_5px_rgba(255,220,160,0.9)]" />
      <span className="absolute right-0 top-1/2 h-px w-2 -translate-y-1/2 bg-amber-100 shadow-[0_0_5px_rgba(255,220,160,0.9)]" />
      <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100" />
    </div>
  );
}
