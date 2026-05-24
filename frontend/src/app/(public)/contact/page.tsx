import type { Metadata } from "next";
import { ContactPageSection } from "@/components/sections/contact-page";

export const metadata: Metadata = {
  title: "Contact | AI Career Helper",
  description:
    "Contact AI Career Helper for product questions, support, partnerships, or platform feedback.",
};

export default function ContactPage() {
  return <ContactPageSection />;
}
