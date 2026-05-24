import type { Metadata } from "next";

import { CompaniesPage } from "@/components/sections/companies-page";

export const metadata: Metadata = {
  title: "Companies | AI Career Helper",
  description:
    "Explore hiring companies, compare work styles, and move from employer research into live job opportunities with AI Career Helper.",
};

export default function CompaniesRoute() {
  return <CompaniesPage />;
}
