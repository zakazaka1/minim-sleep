import Link from "next/link";
import { Moon } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-10 sm:flex-row sm:items-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-xl bg-white/[0.06] ring-1 ring-white/10">
            <Moon className="size-4 text-[#7c8cff]" />
          </span>
          <span className="font-display text-lg tracking-tight">MinimSleep</span>
        </Link>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 font-display text-sm font-semibold tracking-[0.08em]">
              <span aria-hidden className="flex">
                <span className="text-[#7c8cff]">М</span>
                <span className="text-[#5fe6c1]">М</span>
                <span className="text-[#b08cff]">М</span>
              </span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-fg-muted">
              Команда
            </span>
            <span className="text-xs text-fg-soft">
              Захарчук <span className="text-[#7c8cff]">М</span>
              {" · "}
              Громов <span className="text-[#5fe6c1]">М</span>
              {" · "}
              Стручков <span className="text-[#b08cff]">М</span>
            </span>
          </div>
          <p className="text-xs text-fg-soft">
            © {new Date().getFullYear()} MinimSleep. Тишина по дизайну.
          </p>
        </div>
      </div>
    </footer>
  );
}
