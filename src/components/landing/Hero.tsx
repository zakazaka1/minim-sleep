"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Moon } from "lucide-react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { PhoneMock } from "./PhoneMock";
import { RotatingHeadline } from "./RotatingHeadline";

export function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-24 pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-28">
        {/* Left: phone */}
        <div className="order-2 mx-auto w-full max-w-md lg:order-1 lg:max-w-none">
          <PhoneMock />
        </div>

        {/* Right: copy */}
        <div className="order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-fg-soft"
          >
            <Moon className="size-3.5 text-[#7c8cff]" />
            <span>Тихий анализ сна · v1.0</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 font-display text-6xl leading-[0.95] tracking-tight sm:text-7xl"
          >
            Minim<span className="text-gradient">Sleep</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-2xl leading-tight tracking-tight sm:text-3xl"
          >
            <RotatingHeadline />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-md text-base text-fg-soft"
          >
            Интеллектуальный анализ сна с персональными рекомендациями. Тихий,
            честный, научно обоснованный — под твой ритм жизни.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link href="/quiz" prefetch>
              <Button variant="primary" size="lg" iconRight={<ArrowRight className="size-4" />}>
                Начать анализ
              </Button>
            </Link>
            <Button
              variant="google"
              size="lg"
              icon={<GoogleIcon />}
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              Войти через Google
            </Button>
            <Link href="/quiz?guest=1" className="ml-auto sm:ml-0">
              <Button variant="ghost" size="lg">
                Продолжить как гость
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-10 flex items-center gap-6 text-xs text-fg-soft"
          >
            <Stat n="11" label="быстрых вопросов" />
            <span className="size-1 rounded-full bg-fg-soft/40" />
            <Stat n="< 90с" label="до результата" />
            <span className="size-1 rounded-full bg-fg-soft/40" />
            <Stat n="0₽" label="навсегда бесплатно" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-display text-lg leading-none text-fg">{n}</span>
      <span className="mt-0.5">{label}</span>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-4" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.2 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.2 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.6 18.9 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.2 29 4 24 4 16.3 4 9.7 8.4 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5 0 9.5-1.9 12.9-5l-6-5C29 35.5 26.6 36.5 24 36.5c-5.2 0-9.6-3.1-11.3-7.6l-6.5 5C9.6 39.5 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.3 5.5l6 5C40.7 34.5 44 29.7 44 24c0-1.2-.1-2.4-.4-3.5z" />
    </svg>
  );
}
