export function Aurora({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className="absolute -top-40 left-1/2 size-[640px] -translate-x-1/2 rounded-full bg-[#7c8cff]/30 blur-[120px] animate-aurora" />
      <div className="absolute -bottom-40 right-1/4 size-[520px] rounded-full bg-[#5fe6c1]/20 blur-[120px] animate-aurora" style={{ animationDelay: "-6s" }} />
      <div className="absolute top-1/3 -left-20 size-[460px] rounded-full bg-[#b08cff]/25 blur-[120px] animate-aurora" style={{ animationDelay: "-12s" }} />
    </div>
  );
}
