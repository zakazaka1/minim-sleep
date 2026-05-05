import Link from "next/link";
import { Moon } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-xl bg-white/[0.06] ring-1 ring-white/10">
            <Moon className="size-4 text-[#7c8cff]" />
          </span>
          <span className="font-display text-lg tracking-tight">MinimSleep</span>
        </Link>
        <p className="text-xs text-fg-soft">
          © {new Date().getFullYear()} MinimSleep. Quiet by design.
        </p>
      </div>
    </footer>
  );
}
