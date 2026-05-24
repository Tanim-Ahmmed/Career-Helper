"use client";

import { DatabaseZap, Eye, LockKeyhole, ShieldCheck } from "lucide-react";

import {
  PublicInfoGrid,
  PublicPageHero,
  PublicSection,
  PublicTimeline,
} from "@/components/sections/public-page-sections";

export function PrivacyPolicyPageSection() {
  return (
    <main className="min-h-screen overflow-x-hidden pb-16">
      <PublicPageHero
        badge="Privacy Policy"
        title="Privacy matters because career data is personal, contextual, and often high-stakes."
        description="This page explains the practical privacy expectations for using AI Career Helper, including what kinds of information may be stored in your account, how platform activity supports features, and how to contact us for privacy-related questions."
        primaryAction={{ href: "/contact", label: "Contact Privacy Support" }}
        secondaryAction={{ href: "/register", label: "Create Account" }}
        highlights={[
          "Account details and platform activity help personalize your dashboard and AI workflows.",
          "Protected routes and authenticated requests are used for account-bound product features.",
          "You can contact the team directly for privacy-related questions or concerns.",
        ]}
      />

      <PublicSection
        badge="Key Principles"
        title="How we think about data responsibility."
        description="These principles are meant to keep the product useful while staying thoughtful about the sensitivity of career-related information."
        className="pb-8"
      >
        <PublicInfoGrid
          items={[
            {
              title: "Relevant data only",
              description: "We focus on information that helps power accounts, jobs, AI history, applications, and related platform workflows.",
              icon: DatabaseZap,
            },
            {
              title: "Visibility and control",
              description: "Users should understand what kinds of information affect their experience and know where to ask questions.",
              icon: Eye,
            },
            {
              title: "Protected access",
              description: "Authenticated routes, role controls, and backend protections are used where account or admin access is required.",
              icon: LockKeyhole,
            },
          ]}
        />
      </PublicSection>

      <PublicSection
        badge="Policy Summary"
        title="What kinds of information the platform uses."
        description="This summary is written in clear product language so candidates can understand the relationship between data and functionality."
        className="pb-10"
      >
        <PublicTimeline
          items={[
            {
              title: "Account and profile information",
              description: "Your account may include identity, profile, skills, experience, resume links, and related career information you choose to provide.",
            },
            {
              title: "Product activity",
              description: "Saved jobs, applications, dashboard usage, and AI history can be stored to support continuity, tracking, and feature quality.",
            },
            {
              title: "AI-assisted workflows",
              description: "Resume analysis, cover letter generation, and interview preparation may create stored history records tied to your authenticated account.",
            },
            {
              title: "Support and trust requests",
              description: "When you contact the team, your message may be used to investigate issues, improve workflows, and respond appropriately.",
            },
          ]}
        />
      </PublicSection>

      <PublicSection
        badge="Need More Detail?"
        title="Questions about privacy should be easy to raise."
        description="If you need clarification about account data, AI history, or privacy expectations while using the platform, contact us directly so we can respond with context."
      >
        <PublicInfoGrid
          items={[
            {
              title: "Privacy contact",
              description: "Send privacy-related questions or requests through the main contact flow so they can be handled directly.",
              value: "privacy@aicareerhelper.com",
              icon: ShieldCheck,
            },
          ]}
          columnsClassName="grid gap-4 md:grid-cols-1 xl:grid-cols-1"
        />
      </PublicSection>
    </main>
  );
}
