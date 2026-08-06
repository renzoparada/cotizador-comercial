"use client";

import { motion } from "framer-motion";
import type { HeaderBlock } from "@/lib/types";

export function ProposalHero({ header }: { header: HeaderBlock }) {
  return (
    <section className="relative overflow-hidden bg-[#0b0b0d] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/4 h-[32rem] w-[32rem] rounded-full bg-primary/30 blur-[140px]" />
        <div className="absolute bottom-[-14rem] right-1/4 h-[28rem] w-[28rem] rounded-full bg-gold/20 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-20 text-center sm:py-28">
        {header.logoUrl && (
          <motion.img
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            src={header.logoUrl}
            alt="Logo"
            className="mx-auto mb-8 h-20 object-contain sm:h-24"
          />
        )}

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl font-semibold tracking-tight sm:text-6xl"
        >
          {header.title || "Propuesta comercial"}
        </motion.h1>

        {header.subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="mx-auto mt-5 max-w-2xl text-lg text-white/70 sm:text-xl"
          >
            {header.subtitle}
          </motion.p>
        )}

        {header.trainerName && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.34 }}
            className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur"
          >
            {header.trainerPhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={header.trainerPhotoUrl} alt={header.trainerName} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gold/30" />
            )}
            <span className="text-sm font-medium text-white/90">Presentado por {header.trainerName}</span>
          </motion.div>
        )}
      </div>

      <div className="h-16 w-full bg-gradient-to-b from-transparent to-background" />
    </section>
  );
}
