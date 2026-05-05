"use client";

import Link from "next/link";
import { Moon } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export function SiteHeader() {
  const { status } = useSession();
  const authed = status === "authenticated";
  return (
    <header className="sticky top-0 z-50">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#050608]/80 to-transparent backdrop-blur-md" />
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="group inline-flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-xl bg-white/[0.06] ring-1 ring-white/10 transition group-hover:bg-white/[0.1]">
            <Moon className="size-4 text-[#7c8cff]" />
          </span>
          <span className="font-display text-lg tracking-tight">MinimSleep</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-fg-soft sm:flex">
          <a href="#how" className="hover:text-fg">Как это работает</a>
          <a href="#why" className="hover:text-fg">Наука</a>
        </nav>
        <div className="flex items-center gap-2">
          {authed ? (
            <Link href="/dashboard">
              <Button variant="secondary" size="sm">Открыть панель</Button>
            </Link>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              Войти
            </Button>
          )}
          <Link href="/quiz">
            <Button variant="primary" size="sm">Начать</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
