"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Bot, BriefcaseBusiness, FileSearch } from "lucide-react";
import gsap from "gsap";
import { useEffect, useRef } from "react";

import { GlassCard } from "@/components/cards/glass-card";
import { Container } from "@/components/shared/container";
import { GradientButton } from "@/components/shared/gradient-button";
import { PrimaryButton } from "@/components/shared/primary-button";
import { SectionBadge } from "@/components/shared/section-badge";
import { cn } from "@/lib/utils";

const heroStats = [
  { label: "Career paths tracked", value: "12K+" },
  { label: "ATS resume checks", value: "48K+" },
  { label: "Interview prompts generated", value: "96K+" },
];

const heroFeatures = [
  {
    title: "Resume Intelligence",
    description: "Instant ATS scoring, missing-skill detection, and keyword tuning.",
    icon: FileSearch,
  },
  {
    title: "AI Job Matching",
    description: "Discover roles aligned with your strengths, goals, and momentum.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Interview Copilot",
    description: "Practice tailored technical and behavioral question sets on demand.",
    icon: Bot,
  },
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current || !visualRef.current || !glowRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-reveal]",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
        },
      );

      gsap.to(visualRef.current, {
        yPercent: -4,
        rotateX: 6,
        rotateY: -10,
        duration: 4.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(glowRef.current, {
        scale: 1.08,
        opacity: 0.88,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, sectionRef);

    const handlePointerMove = (event: PointerEvent) => {
      if (!visualRef.current || !glowRef.current || !sectionRef.current) {
        return;
      }

      const rect = sectionRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      gsap.to(visualRef.current, {
        x: x * 24,
        y: y * 18,
        rotateY: x * 18,
        rotateX: y * -16,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.to(glowRef.current, {
        x: x * 18,
        y: y * 18,
        duration: 0.7,
        ease: "power3.out",
      });
    };

    const handlePointerLeave = () => {
      if (!visualRef.current || !glowRef.current) {
        return;
      }

      gsap.to(visualRef.current, {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.to(glowRef.current, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    };

    const section = sectionRef.current;
    section.addEventListener("pointermove", handlePointerMove);
    section.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      section.removeEventListener("pointermove", handlePointerMove);
      section.removeEventListener("pointerleave", handlePointerLeave);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[68vh] items-center overflow-hidden pb-14 pt-32 sm:pt-36"
    >
      <div className="absolute inset-0 -z-20 bg-hero-glow" />
      <div className="absolute inset-0 -z-10 opacity-70">
        <div className="bg-grid absolute inset-x-0 top-0 h-full [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" />
      </div>
      <div
        ref={glowRef}
        className="absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl sm:h-96 sm:w-96"
      />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="space-y-5"
            >
              <div data-hero-reveal>
                <SectionBadge>STEP 5 Hero Section</SectionBadge>
              </div>
              <div className="space-y-4">
                <p
                  data-hero-reveal
                  className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.05]"
                >
                  Turn job searching into an
                  <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    {" "}
                    AI-guided career system
                  </span>
                  .
                </p>
                <p
                  data-hero-reveal
                  className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg"
                >
                  Analyze resumes, generate sharper applications, and prepare for
                  interviews with a product that feels like a real startup, not a
                  static portfolio demo.
                </p>
              </div>
            </motion.div>

            <div
              data-hero-reveal
              className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <GradientButton asChild size="lg">
                <Link href="/register">
                  Start Free
                  <ArrowRight className="size-4" />
                </Link>
              </GradientButton>
              <PrimaryButton asChild size="lg" variant="outline">
                <Link href="/jobs">Explore Jobs</Link>
              </PrimaryButton>
            </div>

            <div
              data-hero-reveal
              className="grid gap-4 sm:grid-cols-3"
            >
              {heroStats.map((item) => (
                <GlassCard
                  key={item.label}
                  className="rounded-[1.75rem] border-white/20 bg-white/60 p-5 dark:bg-slate-950/50"
                >
                  <p className="text-2xl font-semibold tracking-tight text-foreground">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.label}
                  </p>
                </GlassCard>
              ))}
            </div>

            <motion.a
              href="#hero-insight"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7, ease: "easeOut" }}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              <span>Follow the flow below</span>
              <motion.span
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowDown className="size-4" />
              </motion.span>
            </motion.a>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
            className="relative mx-auto w-full max-w-[34rem] perspective-[1800px]"
          >
            <div
              ref={visualRef}
              className="relative preserve-3d"
            >
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 blur-3xl" />

              <GlassCard className="relative overflow-hidden rounded-[2rem] border-white/20 bg-white/65 p-0 dark:bg-slate-950/55">
                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-primary/20 via-secondary/15 to-accent/20" />
                <div className="relative space-y-6 p-6 sm:p-7">
                  <div className="flex items-center justify-between rounded-[1.5rem] border border-white/20 bg-background/75 px-4 py-3 dark:bg-slate-900/80">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-primary">
                        Career Command Center
                      </p>
                      <p className="mt-1 text-lg font-semibold text-foreground">
                        AI Career Helper
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="size-3 rounded-full bg-primary" />
                      <span className="size-3 rounded-full bg-secondary" />
                      <span className="size-3 rounded-full bg-accent" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-4">
                      <div className="rounded-[1.5rem] border border-white/20 bg-background/75 p-4 dark:bg-slate-900/80">
                        <p className="text-sm font-medium text-muted-foreground">
                          Resume match
                        </p>
                        <div className="mt-4 flex items-end justify-between gap-4">
                          <p className="text-4xl font-semibold tracking-tight text-foreground">
                            91%
                          </p>
                          <div className="h-2 flex-1 rounded-full bg-muted">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "91%" }}
                              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                              className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {["AI Resume Analyzer",
  "Cover Letter Generator",  "Remote Jobs",
  "Career Growth",].map(
                          (skill, index) => (
                            <motion.div
                              key={skill}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.45,
                                delay: 0.75 + index * 0.08,
                                ease: "easeOut",
                              }}
                              className="rounded-[1.25rem] border border-white/20 bg-background/70 px-3 py-3 text-sm font-medium text-foreground dark:bg-slate-900/75"
                            >
                              {skill}
                            </motion.div>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {heroFeatures.map(({ title, description, icon: Icon }, index) => (
                        <motion.div
                          key={title}
                          initial={{ opacity: 0, x: 18 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.55,
                            delay: 0.45 + index * 0.1,
                            ease: "easeOut",
                          }}
                          className={cn(
                            "rounded-[1.5rem] border border-white/20 bg-background/75 p-4 dark:bg-slate-900/80",
                            index === 1 && "translate-y-3",
                          )}
                        >
                          <div className="mb-3 flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Icon className="size-5" />
                          </div>
                          <p className="text-sm font-semibold text-foreground">{title}</p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {description}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
