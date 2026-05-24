"use client";

import { BrainCircuit, Compass, Workflow } from "lucide-react";

import {
  PublicCtaSection,
  PublicInfoGrid,
  PublicPageHero,
  PublicSection,
  PublicTimeline,
} from "@/components/sections/public-page-sections";

export function AboutPageSection() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <PublicPageHero
        badge="About"
        title="AI Career Helper exists to make job searching feel more strategic, calm, and high-signal."
        description="We built the product around a simple belief: candidates do better when job discovery, resume quality, writing support, and interview prep work as one connected system instead of four disconnected tools."
        primaryAction={{ href: "/register", label: "Join the Platform" }}
        secondaryAction={{ href: "/jobs", label: "Explore Opportunities" }}
        highlights={[
          "Discover roles with cleaner filters and stronger context.",
          "Strengthen your applications with focused AI assistance.",
          "Track momentum across saved jobs, applications, and prep work in one place.",
        ]}
      />

      <PublicSection
        badge="Product Principles"
        title="What we optimize for every time we add a new workflow."
        description="The platform is designed to help candidates make better decisions faster while keeping the experience trustworthy, actionable, and premium."
        className="pb-8"
      >
        <PublicInfoGrid
          items={[
            {
              title: "Practical AI",
              description: "AI should improve real application quality, not generate vague content that sounds impressive but says little.",
              icon: BrainCircuit,
            },
            {
              title: "Clear direction",
              description: "Candidates need better prioritization, cleaner signals, and more confidence about what to do next.",
              icon: Compass,
            },
            {
              title: "Connected workflow",
              description: "Discovery, writing, and preparation should reinforce each other instead of living in separate products.",
              icon: Workflow,
            },
          ]}
        />
      </PublicSection>

      <PublicSection
        badge="How It Works"
        title="A candidate journey that gets stronger with every step."
        description="The platform is arranged so each action creates better input for the next one, which leads to sharper applications and more confident interviews."
        className="pb-10"
      >
        <PublicTimeline
          items={[
            {
              title: "Start with discovery",
              description: "Use the jobs explorer and companies directory to identify roles and teams that actually match your direction.",
            },
            {
              title: "Sharpen the application",
              description: "Run a resume analysis, generate a cover letter, and keep your profile aligned to the role you are targeting.",
            },
            {
              title: "Prepare with intention",
              description: "Use the interview assistant and dashboard history to practice smarter and keep momentum visible.",
            },
          ]}
        />
      </PublicSection>

      <PublicCtaSection
        badge="Build With Us"
        title="Use AI Career Helper like a real career operating system."
        description="If you want a calmer, more structured way to discover roles, write stronger applications, and prepare for interviews, the platform is ready."
        primaryAction={{ href: "/register", label: "Create Your Account" }}
        secondaryAction={{ href: "/contact", label: "Contact Us" }}
      />
    </main>
  );
}
