import type { HTMLAttributes, ReactNode } from "react";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: "default" | "strong" | "accent";
  children: ReactNode;
};

export function GlassCard({
  tone = "default",
  className = "",
  children,
  ...rest
}: GlassCardProps) {
  const base =
    tone === "strong"
      ? "glass-strong"
      : tone === "accent"
        ? "glass-strong"
        : "glass";
  const accent =
    tone === "accent"
      ? "bg-[radial-gradient(120%_80%_at_0%_0%,rgba(124,140,255,0.22),transparent_55%),radial-gradient(120%_80%_at_100%_100%,rgba(95,230,193,0.16),transparent_55%)]"
      : "";
  return (
    <div
      className={`ring-shine relative overflow-hidden rounded-3xl ${base} ${accent} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
