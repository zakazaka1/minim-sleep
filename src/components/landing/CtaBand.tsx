"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Moon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

export function CtaBand() {
  return (
    <section className="relative mx-auto max-w-5xl px-6 pb-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <GlassCard tone="accent" className="overflow-hidden p-10 text-center sm:p-14">
          <Moon className="mx-auto mb-6 size-7 text-[#7c8cff]" />
          <h2 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            One quiet check-in. <span className="text-gradient">Your real score.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-fg-soft">
            Ninety seconds. No accounts required. Save your progress with Google when you&rsquo;re ready.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/quiz" prefetch>
              <Button variant="primary" size="lg" iconRight={<ArrowRight className="size-4" />}>
                Start the analysis
              </Button>
            </Link>
            <Link href="/quiz?guest=1">
              <Button variant="ghost" size="lg">
                Continue as guest
              </Button>
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </section>
  );
}
