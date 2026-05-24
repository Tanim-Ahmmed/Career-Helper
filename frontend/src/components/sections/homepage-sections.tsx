"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  FileText,
  MessageSquareQuote,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Stars,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

import { GlassCard } from "@/components/cards/glass-card";
import { JobCard } from "@/components/cards/job-card";
import { SkeletonCard } from "@/components/cards/skeleton-card";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { GradientButton } from "@/components/shared/gradient-button";
import { PrimaryButton } from "@/components/shared/primary-button";
import { SectionBadge } from "@/components/shared/section-badge";
import { SectionSubtitle } from "@/components/shared/section-subtitle";
import { SectionTitle } from "@/components/shared/section-title";
import { cn } from "@/lib/utils";
import { fetchFeaturedJobs } from "@/services/jobs";

const companyLogos = [
  "LumaForge",
  "Northstar",
  "Synthex",
  "PulseGrid",
  "Cloudmint",
  "Altitude",
];

const aiFeatures = [
  {
    icon: ScanSearch,
    title: "Resume Analyzer",
    description:
      "Get ATS score breakdowns, missing skill prompts, and keyword optimization guidance in seconds.",
  },
  {
    icon: FileText,
    title: "Cover Letter Generator",
    description:
      "Generate polished, role-specific cover letters that adapt to your profile and target company.",
  },
  {
    icon: BrainCircuit,
    title: "Interview Assistant",
    description:
      "Prepare with technical, HR, and behavioral practice questions tailored to your next opportunity.",
  },
];

const stats = [
  {
    value: "83%",
    label: "of users improve resume match scores within one session",
  },
  {
    value: "4.9/5",
    label: "average satisfaction from candidates using AI interview prep",
  },
  {
    value: "2.4x",
    label: "higher application completion rate after profile optimization",
  },
  {
    value: "24h",
    label: "average time to shortlist-ready application materials",
  },
];

const testimonials = [
  {
    quote:
      "It feels like having a recruiter, resume coach, and interview mentor in one calm workflow.",
    name: "Nadia Rahman",
    role: "Product Designer at LumaForge",
  },
  {
    quote:
      "The job matching is sharper than anything I used before, and the resume feedback is actually actionable.",
    name: "Marcus Lee",
    role: "Frontend Engineer at Cloudmint",
  },
  {
    quote:
      "I landed more interviews in three weeks than I did in the previous two months of applying manually.",
    name: "Sofia Martinez",
    role: "Growth PM at Altitude",
  },
];

const blogs = [
  {
    title: "How to build a resume that survives ATS screening in 2026",
    category: "Resume Strategy",
    description:
      "A practical framework for balancing keywords, clarity, and measurable outcomes without sounding robotic.",
  },
  {
    title: "What hiring teams actually want from AI-assisted cover letters",
    category: "Career Growth",
    description:
      "Use AI to accelerate customization while keeping your voice and credibility intact.",
  },
  {
    title: "A better way to prepare for technical and behavioral interviews",
    category: "Interview Prep",
    description:
      "Turn scattered practice into a focused system with scenario-based rehearsal and feedback loops.",
  },
];

const faqs = [
  {
    question: "What makes AI Career Helper different from a basic job board?",
    answer:
      "It combines job discovery with AI-powered resume analysis, cover letter generation, and interview preparation so each application gets stronger as you go.",
  },
  {
    question: "Can I use the platform before I have a finished resume?",
    answer:
      "Yes. The system is designed to help you improve a draft resume, identify missing signals, and prioritize what to fix first.",
  },
  {
    question: "Will the AI outputs feel generic?",
    answer:
      "The experience is structured around your skills, target role, and job context so the output is directional and customizable instead of canned.",
  },
];

export function HomepageSections() {
  return (
    <div className="pb-20">
      <TrustedCompaniesSection />
      <FeaturedJobsSection />
      <AiFeaturesSection />
      <StatisticsSection />
      <ResumePreviewSection />
      <TestimonialsSection />
      <BlogsSection />
      <FaqSection />
      <NewsletterSection />
    </div>
  );
}

function TrustedCompaniesSection() {
  return (
    <section className="py-10 sm:py-14">
      <Container className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center"
        >
          <SectionBadge className="mx-auto">Trusted Companies</SectionBadge>
          <p className="mt-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Used by candidates applying to teams at
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {companyLogos.map((company, index) => (
            <motion.div
              key={company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.05, ease: "easeOut" }}
              className="glass-panel flex min-h-20 items-center justify-center rounded-[1.75rem] border border-border/60 px-4 text-center text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground shadow-glass"
            >
              {company}
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FeaturedJobsSection() {
  const featuredJobsQuery = useQuery({
    queryKey: ["featured-jobs"],
    queryFn: () => fetchFeaturedJobs(4),
  });

  return (
    <section className="py-14 sm:py-18">
      <Container className="space-y-8">
        <SectionIntro
          badge="Featured Jobs"
          title="The best jobs for you."
          subtitle="Explore a tighter feed of high-signal opportunities with clear compensation, strong product teams, and skill-aligned recommendations."
          action={
            <PrimaryButton asChild variant="outline">
              <Link href="/jobs">
                Browse all jobs
                <ArrowRight className="size-4" />
              </Link>
            </PrimaryButton>
          }
        />

        {featuredJobsQuery.isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : featuredJobsQuery.data?.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
            {featuredJobsQuery.data.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, delay: index * 0.06, ease: "easeOut" }}
              >
                <JobCard job={job} />
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Featured jobs will appear here"
            description="Publish and feature a role from the admin dashboard to surface it instantly on the homepage."
            action={
              <PrimaryButton asChild variant="outline">
                <Link href="/jobs">Browse all jobs</Link>
              </PrimaryButton>
            }
          />
        )}
      </Container>
    </section>
  );
}

function AiFeaturesSection() {
  return (
    <section className="py-14 sm:py-18">
      <Container className="space-y-8">
        <SectionIntro
          badge="AI Features"
          title="Three focused tools that make every application stronger."
          subtitle="The product helps you move from scattered effort to a consistent career workflow, with AI that supports better decisions rather than noisy automation."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {aiFeatures.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }}
            >
              <GlassCard className="h-full rounded-[2rem] border-white/15 bg-white/60 p-7 dark:bg-slate-950/50">
                <div className="space-y-5">
                  <div className="flex size-14 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/20 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-foreground">
                      {title}
                    </h3>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function StatisticsSection() {
  return (
    <section className="py-14 sm:py-18">
      <Container className="space-y-8">
        <SectionIntro
          badge="Outcomes"
          title="Built to improve momentum, clarity, and application quality."
          subtitle="These metrics represent the kind of product story the platform is aiming to tell: speed, confidence, and better job-search execution."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.value}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
            >
              <GlassCard className="h-full rounded-[2rem] border-white/15 bg-white/60 p-7 dark:bg-slate-950/50">
                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <TrendingUp className="size-5" />
                </div>
                <p className="text-4xl font-semibold tracking-tight text-foreground">
                  {stat.value}
                </p>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {stat.label}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ResumePreviewSection() {
  return (
    <section className="py-14 sm:py-18">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="space-y-5"
          >
            <SectionBadge>Resume Analyzer Preview</SectionBadge>
            <SectionTitle>
              A resume review experience that feels actionable in under a minute.
            </SectionTitle>
            <SectionSubtitle>
              Surface weak phrasing, missing skills, and ATS gaps with clear
              next steps so users know exactly what to improve before they apply.
            </SectionSubtitle>
            <ul className="space-y-3">
              {[
                "ATS compatibility score with plain-language feedback",
                "Missing-skill suggestions mapped to target roles",
                "Formatting and clarity checks for recruiter readability",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <GlassCard className="overflow-hidden rounded-[2rem] border-white/15 bg-white/65 p-0 dark:bg-slate-950/55">
              <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
                <div className="border-b border-border/60 bg-background/70 p-6 dark:border-white/10 dark:bg-slate-900/70 lg:border-b-0 lg:border-r">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <FileText className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Product Resume.pdf
                        </p>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          Uploaded just now
                        </p>
                      </div>
                    </div>
                    <div className="rounded-[1.5rem] border border-border/70 bg-card/70 p-4">
                      <p className="text-sm font-medium text-muted-foreground">
                        ATS Score
                      </p>
                      <p className="mt-3 text-5xl font-semibold tracking-tight text-foreground">
                        91
                      </p>
                      <div className="mt-4 h-2 rounded-full bg-muted">
                        <div className="h-full w-[91%] rounded-full bg-gradient-to-r from-primary via-secondary to-accent" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  <PreviewInsight
                    title="High-impact improvements"
                    items={[
                      "Add measurable outcomes to recent product launches",
                      "Strengthen AI-tooling keywords for ATS matching",
                    ]}
                  />
                  <PreviewInsight
                    title="Formatting checks"
                    items={[
                      "Header structure is clean and recruiter-friendly",
                      "Reduce dense paragraph blocks in experience section",
                    ]}
                  />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-14 sm:py-18">
      <Container className="space-y-8">
        <SectionIntro
          badge="Testimonials"
          title="A product story shaped around confidence, not just features."
          subtitle="The platform should feel premium and supportive, especially for people who are overwhelmed by fragmented job-search tools."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
            >
              <GlassCard className="h-full rounded-[2rem] border-white/15 bg-white/60 p-7 dark:bg-slate-950/50">
                <MessageSquareQuote className="size-8 text-primary" />
                <p className="mt-5 text-base leading-7 text-foreground">
                  {item.quote}
                </p>
                <div className="mt-6 border-t border-border/60 pt-5">
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.role}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function BlogsSection() {
  return (
    <section className="py-14 sm:py-18">
      <Container className="space-y-8">
        <SectionIntro
          badge="Blogs"
          title="Content that helps users think more clearly about their next move."
          subtitle="A strong SaaS product homepage should show expertise, not only features. These article cards set that tone early."
          action={
            <PrimaryButton asChild variant="outline">
              <Link href="/blogs">
                Read all articles
                <ArrowRight className="size-4" />
              </Link>
            </PrimaryButton>
          }
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {blogs.map((blog, index) => (
            <motion.article
              key={blog.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.52, delay: index * 0.07, ease: "easeOut" }}
            >
              <GlassCard className="h-full rounded-[2rem] border-white/15 bg-white/60 p-7 dark:bg-slate-950/50">
                <span className="inline-flex rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-secondary">
                  {blog.category}
                </span>
                <h3 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
                  {blog.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {blog.description}
                </p>
                <Link
                  href="/blogs"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors duration-200 hover:text-secondary"
                >
                  Read article
                  <ArrowRight className="size-4" />
                </Link>
              </GlassCard>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="py-14 sm:py-18">
      <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="space-y-5"
        >
          <SectionBadge>FAQ</SectionBadge>
          <SectionTitle>
            Clear answers for users who want less friction and more direction.
          </SectionTitle>
          <SectionSubtitle>
            The FAQ closes uncertainty around value, workflow, and how the AI
            fits into the broader job-search process.
          </SectionSubtitle>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: index * 0.05, ease: "easeOut" }}
              >
                <GlassCard className="rounded-[1.75rem] border-white/15 bg-white/60 p-0 dark:bg-slate-950/50">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-base font-semibold text-foreground">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-5 shrink-0 text-muted-foreground transition-transform duration-200",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? "auto" : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    transition={{ duration: 0.24, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border/60 px-6 py-5 text-sm leading-7 text-muted-foreground">
                      {faq.answer}
                    </div>
                  </motion.div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="py-14 sm:py-18">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <GlassCard className="overflow-hidden rounded-[2.25rem] border-white/15 bg-gradient-to-br from-primary/12 via-white/72 to-secondary/12 p-0 dark:from-primary/18 dark:via-slate-950/70 dark:to-secondary/16">
            <div className="grid gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10">
              <div className="space-y-4">
                <SectionBadge>Newsletter CTA</SectionBadge>
                <SectionTitle className="max-w-2xl">
                  Weekly job-search signals, resume tactics, and AI workflow ideas.
                </SectionTitle>
                <SectionSubtitle className="max-w-2xl">
                  Subscribe for curated advice that helps candidates move faster
                  without burning out on scattered tools and inconsistent effort.
                </SectionSubtitle>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="size-4 text-accent" />
                    No spam
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Stars className="size-4 text-primary" />
                    High-signal content
                  </span>
                </div>
              </div>

              <div className="w-full max-w-xl space-y-4 lg:w-[26rem]">
                <div className="glass-panel flex flex-col gap-3 rounded-[1.75rem] border border-white/20 p-3 shadow-glass sm:flex-row">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="h-12 flex-1 rounded-[1.1rem] border border-border/70 bg-background/80 px-4 text-sm text-foreground outline-none transition-shadow duration-200 placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
                  />
                  <GradientButton className="h-12 px-5">
                    Join Newsletter
                    <Sparkles className="size-4" />
                  </GradientButton>
                </div>
                <p className="text-xs leading-6 text-muted-foreground">
                  By subscribing, users get practical hiring-market updates and
                  application strategy notes directly in their inbox.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </Container>
    </section>
  );
}

function SectionIntro({
  badge,
  title,
  subtitle,
  action,
}: {
  badge: string;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
    >
      <div className="space-y-4">
        <SectionBadge>{badge}</SectionBadge>
        <div className="space-y-3">
          <SectionTitle>{title}</SectionTitle>
          <SectionSubtitle>{subtitle}</SectionSubtitle>
        </div>
      </div>
      {action ? <div className="flex shrink-0">{action}</div> : null}
    </motion.div>
  );
}

function PreviewInsight({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-[1.5rem] border border-border/70 bg-card/70 p-4">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
            <Bot className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
