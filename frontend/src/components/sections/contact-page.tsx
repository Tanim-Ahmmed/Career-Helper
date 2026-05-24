"use client";

import { Clock3, LifeBuoy, Mail, MapPinned, MessageSquareText, ShieldCheck } from "lucide-react";

import { GlassCard } from "@/components/cards/glass-card";
import {
  PublicCtaSection,
  PublicInfoGrid,
  PublicPageHero,
  PublicSection,
} from "@/components/sections/public-page-sections";

export function ContactPageSection() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <PublicPageHero
        badge="Contact"
        title="Reach out when you need support, product clarity, or a conversation about the platform."
        description="Whether you are using the AI tools, exploring the dashboard, or evaluating the platform for a team, we want it to be easy to get the right help quickly."
        primaryAction={{ href: "mailto:hello@aicareerhelper.com", label: "Email Support" }}
        secondaryAction={{ href: "/about", label: "Learn About the Product" }}
        highlights={[
          "Product questions, support needs, and workflow feedback are all welcome.",
          "We prioritize clear replies and practical help over generic canned responses.",
          "You can reach out before signing up or while actively using the platform.",
        ]}
      />

      <PublicSection
        badge="Contact Channels"
        title="The fastest ways to reach the team."
        description="Use the channel that best matches the kind of help you need. Each path is meant to keep the conversation focused and useful."
        className="pb-8"
      >
        <PublicInfoGrid
          items={[
            {
              title: "Support and product help",
              description: "Questions about the dashboard, AI tools, or public job workflows.",
              value: "hello@aicareerhelper.com",
              icon: Mail,
            },
            {
              title: "Partnership conversations",
              description: "Hiring, content, and ecosystem conversations connected to growth and distribution.",
              value: "partners@aicareerhelper.com",
              icon: MessageSquareText,
            },
            {
              title: "Trust and privacy requests",
              description: "Requests involving account privacy, platform trust, or sensitive data concerns.",
              value: "privacy@aicareerhelper.com",
              icon: ShieldCheck,
            },
          ]}
        />
      </PublicSection>

      <PublicSection
        badge="Response Expectations"
        title="A little clarity before you send a note."
        description="Helpful support usually starts with context. Sharing the page, workflow, or issue you’re seeing helps us respond with a much better answer."
        className="pb-10"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <GlassCard className="space-y-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Clock3 className="size-5" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Response timing</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              Most product and support questions should expect a response window of one business day.
            </p>
          </GlassCard>
          <GlassCard className="space-y-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
              <LifeBuoy className="size-5" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Best support requests</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              Include what page you were on, what you expected, what happened instead, and any relevant screenshot details.
            </p>
          </GlassCard>
          <GlassCard className="space-y-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <MapPinned className="size-5" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Operating context</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              AI Career Helper is built for modern remote-first candidates, teams, and evaluators working across global markets.
            </p>
          </GlassCard>
        </div>
      </PublicSection>

      <PublicCtaSection
        badge="Start Here"
        title="Want a better first conversation?"
        description="Browse the product, explore the jobs feed, and review the privacy policy before reaching out so we can meet you with the right context."
        primaryAction={{ href: "/jobs", label: "Open Jobs Explorer" }}
        secondaryAction={{ href: "/privacy-policy", label: "Read Privacy Policy" }}
      />
    </main>
  );
}
