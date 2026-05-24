import type { Application } from "@/types/application";
import type { AuthUser } from "@/types/auth";
import type { Blog } from "@/types/blog";
import type { AdminDashboardResponse, UserDashboardResponse } from "@/types/dashboard";
import type { Job } from "@/types/job";

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(date);
}

function getLastMonths(monthCount: number) {
  const months: Array<{ label: string; key: string }> = [];
  const current = new Date();

  for (let index = monthCount - 1; index >= 0; index -= 1) {
    const date = new Date(current.getFullYear(), current.getMonth() - index, 1);
    months.push({
      label: formatMonth(date),
      key: `${date.getFullYear()}-${date.getMonth()}`,
    });
  }

  return months;
}

function buildTimelineBucketMap(monthCount: number) {
  return getLastMonths(monthCount).map((month) => ({
    label: month.label,
    key: month.key,
    users: 0,
    jobs: 0,
    applications: 0,
    blogs: 0,
  }));
}

function incrementTimelineEntry(
  entries: ReturnType<typeof buildTimelineBucketMap>,
  isoDate: string | undefined,
  key: "users" | "jobs" | "applications" | "blogs",
) {
  if (!isoDate) {
    return;
  }

  const date = new Date(isoDate);
  const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
  const entry = entries.find((item) => item.key === monthKey);

  if (entry) {
    entry[key] += 1;
  }
}

export function buildPlatformActivityTimeline(input: {
  users: AuthUser[];
  jobs: Job[];
  applications: Application[];
  blogs: Blog[];
}) {
  const entries = buildTimelineBucketMap(6);

  input.users.forEach((user) => incrementTimelineEntry(entries, user.createdAt, "users"));
  input.jobs.forEach((job) => incrementTimelineEntry(entries, job.createdAt, "jobs"));
  input.applications.forEach((application) =>
    incrementTimelineEntry(entries, application.createdAt, "applications"),
  );
  input.blogs.forEach((blog) => incrementTimelineEntry(entries, blog.createdAt, "blogs"));

  return entries.map((entry) => ({
    label: entry.label,
    users: entry.users,
    jobs: entry.jobs,
    applications: entry.applications,
    blogs: entry.blogs,
  }));
}

export function buildApplicationStatusAnalytics(applications: Application[]) {
  const statusMap = new Map<string, number>([
    ["pending", 0],
    ["reviewed", 0],
    ["interview", 0],
    ["accepted", 0],
    ["rejected", 0],
  ]);

  applications.forEach((application) => {
    statusMap.set(
      application.applicationStatus,
      (statusMap.get(application.applicationStatus) ?? 0) + 1,
    );
  });

  return Array.from(statusMap.entries())
    .map(([label, value]) => ({
      label,
      value,
    }))
    .filter((entry) => entry.value > 0);
}

export function buildPipelineAnalytics(
  stats: AdminDashboardResponse["stats"],
  jobs: Job[],
  blogs: Blog[],
) {
  const topJobCategories = jobs.reduce<Record<string, number>>((accumulator, job) => {
    accumulator[job.category] = (accumulator[job.category] ?? 0) + 1;
    return accumulator;
  }, {});

  const sortedCategories = Object.entries(topJobCategories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, count]) => ({
      label,
      jobs: count,
    }));

  const contentMix = [
    { label: "Published Jobs", jobs: stats.publishedJobs, blogs: 0 },
    { label: "Draft Jobs", jobs: stats.draftJobs, blogs: 0 },
    { label: "Featured Jobs", jobs: stats.featuredJobs, blogs: 0 },
    { label: "Published Blogs", jobs: 0, blogs: stats.publishedBlogs },
    { label: "Draft Blogs", jobs: 0, blogs: stats.draftBlogs },
  ];

  const blogCategories = blogs.reduce<Record<string, number>>((accumulator, blog) => {
    accumulator[blog.category] = (accumulator[blog.category] ?? 0) + 1;
    return accumulator;
  }, {});

  const topBlogCategories = Object.entries(blogCategories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, value]) => ({
      label,
      value,
    }));

  return {
    topJobCategories: sortedCategories,
    contentMix,
    topBlogCategories,
  };
}

export function buildUserProgressAnalytics(
  dashboard: UserDashboardResponse | undefined,
  applications: Application[],
) {
  const progressMix = [
    { label: "Saved Jobs", value: dashboard?.stats.savedJobs ?? 0 },
    { label: "Applications", value: dashboard?.stats.appliedJobs ?? 0 },
    { label: "AI Usage", value: dashboard?.stats.aiUsageCount ?? 0 },
    { label: "Profile Score", value: dashboard?.stats.profileCompletion ?? 0 },
  ];

  const categoryCounts = [...(dashboard?.savedJobs ?? []), ...(dashboard?.recommendedJobs ?? [])]
    .reduce<Record<string, number>>((accumulator, job) => {
      accumulator[job.category] = (accumulator[job.category] ?? 0) + 1;
      return accumulator;
    }, {});

  const opportunityCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, value]) => ({
      label,
      value,
    }));

  const applicationStatuses = buildApplicationStatusAnalytics(applications);

  return {
    progressMix,
    opportunityCategories,
    applicationStatuses,
  };
}
