import { JobDetailsPage } from "@/components/sections/job-details-page";

export default async function JobDetailsRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <JobDetailsPage slug={slug} />;
}
