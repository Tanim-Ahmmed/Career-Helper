import type { Metadata } from "next";
import { PrivacyPolicyPageSection } from "@/components/sections/privacy-policy-page";

export const metadata: Metadata = {
  title: "Privacy Policy | AI Career Helper",
  description:
    "Read how AI Career Helper handles account information, job activity, AI usage history, and platform privacy responsibilities.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyPageSection />;
}
