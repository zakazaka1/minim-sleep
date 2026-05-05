"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Home, LogOut, Moon, User2 } from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { href: "/dashboard", label: "Главная", icon: Home },
  { href: "/profile", label: "Профиль", icon: User2 },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="relative min-h-dvh">
      <header className="sticky top-0 z-40">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#050608]/80 to-transparent backdrop-blur-md" />
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="inline-flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-xl bg-white/[0.06] ring-1 ring-white/10">
              <Moon className="size-4 text-[#7c8cff]" />
            </span>
            <span className="font-display text-lg tracking-tight">MinimSleep</span>
          </Link>
          <div className="flex items-center gap-2">
            {session?.user?.image ? (
              <span
                className="size-8 rounded-full bg-cover bg-center ring-1 ring-white/15"
                style={{ backgroundImage: `url(${session.user.image})` }}
                aria-label={session.user.name ?? "Профиль"}
              />
            ) : (
              <span className="grid size-8 place-items-center rounded-full bg-white/[0.06] ring-1 ring-white/10">
                <User2 className="size-4" />
              </span>
            )}
            {session && (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="grid size-8 place-items-center rounded-full text-fg-soft transition hover:bg-white/[0.06] hover:text-fg"
                aria-label="Выйти"
              >
                <LogOut className="size-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-32 pt-2">{children}</main>

      <nav className="fixed inset-x-0 bottom-4 z-40 mx-auto w-fit">
        <div className="glass-strong flex gap-1 rounded-full p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.4)]">
          {NAV.map((item) => {
            const Active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm transition ${
                  Active
                    ? "bg-white text-black shadow-[0_6px_24px_rgba(255,255,255,0.18)]"
                    : "text-fg-soft hover:text-fg"
                }`}
              >
                <item.icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
