"use client";

import { type LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/shared/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  colorClassName: string;
  backgroundClassName: string;
  index?: number;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  colorClassName,
  backgroundClassName,
  index = 0,
}: FeatureCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        delay: shouldReduceMotion ? 0 : index * 0.2,
        duration: shouldReduceMotion ? 0 : 0.6,
        type: "spring",
        stiffness: 100,
        damping: 10,
      }}
      className="group cursor-default rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl dark:border-white/10 dark:bg-card-dark dark:shadow-card-dark dark:hover:shadow-card-dark-hover"
    >
      <div
        className={cn(
          "mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
          backgroundClassName,
        )}
      >
        <Icon
          className={cn("h-6 w-6", colorClassName)}
          aria-hidden="true"
        />
      </div>
      <h3 className="text-lg font-bold text-[#1F2937] dark:text-white">
        {title}
      </h3>
      <p className="mt-3 text-[15px] leading-[1.6] text-[#6B7280] dark:text-[#D1D5DB]">
        {description}
      </p>
    </motion.article>
  );
}
