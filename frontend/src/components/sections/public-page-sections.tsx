"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import type { Variants } from "framer-motion";

import { GlassCard } from "@/components/cards/glass-card";
import { Container } from "@/components/shared/container";
import { GradientButton } from "@/components/shared/gradient-button";
import { PrimaryButton } from "@/components/shared/primary-button";
import { SectionBadge } from "@/components/shared/section-badge";
import { SectionSubtitle } from "@/components/shared/section-subtitle";
import { SectionTitle } from "@/components/shared/section-title";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function PublicPageHero({
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
  highlights,
}: {
  badge: string;
  title: string;
  description: string;
  primaryAction: { href: string; label: string };
  secondaryAction?: { href: string; label: string };
  highlights: string[];
}) {
  return (
    <section className="overflow-x-hidden pb-10 pt-32 sm:pt-36">
      <Container>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="glass-panel relative overflow-hidden rounded-[2rem] border border-border/60 px-5 py-10 shadow-glass sm:px-8 lg:px-10"
        >
          <div className="absolute inset-0 bg-grid opacity-50" />
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-secondary/15 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-end">
            <div className="space-y-6">
              <SectionBadge>{badge}</SectionBadge>
              <div className="space-y-4">
                <SectionTitle className="max-w-4xl text-4xl sm:text-5xl">
                  {title}
                </SectionTitle>
                <SectionSubtitle className="max-w-3xl text-base sm:text-lg">
                  {description}
                </SectionSubtitle>
              </div>

              <div className="flex flex-wrap gap-3">
                <GradientButton asChild size="lg">
                  <Link href={primaryAction.href}>
                    {primaryAction.label}
                    <ArrowRight className="size-4" />
                  </Link>
                </GradientButton>
                {secondaryAction ? (
                  <PrimaryButton asChild variant="outline" size="lg">
                    <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
                  </PrimaryButton>
                ) : null}
              </div>
            </div>

            <motion.div
              variants={gridVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1"
            >
              {highlights.map((highlight) => (
                <motion.div
                  key={highlight}
                  variants={cardVariants}
                  className="rounded-[1.6rem] border border-white/15 bg-background/70 px-4 py-4 text-sm leading-6 text-muted-foreground"
                >
                  {highlight}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

export function PublicSection({
  badge,
  title,
  description,
  children,
  className,
}: {
  badge: string;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <Container className="space-y-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants} className="space-y-3">
          <SectionBadge>{badge}</SectionBadge>
          <SectionTitle>{title}</SectionTitle>
          <SectionSubtitle>{description}</SectionSubtitle>
        </motion.div>
        {children}
      </Container>
    </section>
  );
}

export function PublicInfoGrid({
  items,
  columnsClassName = "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
}: {
  items: Array<{
    title: string;
    description: string;
    icon: LucideIcon;
    value?: string;
  }>;
  columnsClassName?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={gridVariants}
      className={columnsClassName}
    >
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <motion.div key={item.title} variants={cardVariants}>
            <GlassCard className="h-full min-w-0 space-y-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              {item.value ? (
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  {item.value}
                </p>
              ) : null}
              <div className="space-y-2">
                <h3 className="break-words text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
              </div>
            </GlassCard>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export function PublicTimeline({
  items,
}: {
  items: Array<{
    title: string;
    description: string;
  }>;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={gridVariants}
      className="grid gap-4"
    >
      {items.map((item, index) => (
        <motion.div key={item.title} variants={cardVariants}>
          <GlassCard className="flex min-w-0 gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
              <span className="text-sm font-semibold">{index + 1}</span>
            </div>
            <div className="space-y-2">
              <h3 className="break-words text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function PublicCtaSection({
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
}: {
  badge: string;
  title: string;
  description: string;
  primaryAction: { href: string; label: string };
  secondaryAction?: { href: string; label: string };
}) {
  return (
    <section className="pb-16 pt-6">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="glass-panel overflow-hidden rounded-[2rem] border border-border/60 px-5 py-10 shadow-glass sm:px-8"
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="space-y-4">
              <SectionBadge>{badge}</SectionBadge>
              <SectionTitle>{title}</SectionTitle>
              <SectionSubtitle>{description}</SectionSubtitle>
            </div>

            <div className="flex flex-wrap gap-3">
              <GradientButton asChild size="lg">
                <Link href={primaryAction.href}>
                  {primaryAction.label}
                  <ArrowRight className="size-4" />
                </Link>
              </GradientButton>
              {secondaryAction ? (
                <PrimaryButton asChild variant="outline" size="lg">
                  <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
                </PrimaryButton>
              ) : null}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
