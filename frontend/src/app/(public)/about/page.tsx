import type { Metadata } from "next";
import { AboutPageSection } from "@/components/sections/about-page";

export const metadata: Metadata = {
  title: "About | AI Career Helper",
  description:
    "Learn how AI Career Helper helps candidates connect job discovery, application quality, and interview readiness in one premium workflow.",
};

export default function AboutPage() {
  return <AboutPageSection />;
}
