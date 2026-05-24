"use client";

import { startTransition, useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import { JobCard } from "@/components/cards/job-card";
import { SkeletonCard } from "@/components/cards/skeleton-card";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { PrimaryButton } from "@/components/shared/primary-button";
import { SectionBadge } from "@/components/shared/section-badge";
import { Button } from "@/components/ui/button";
import { useJobsQuery } from "@/hooks/use-jobs-query";
import { cn } from "@/lib/utils";
import type { JobsQueryParams } from "@/types/job";

const initialFilters: JobsQueryParams = {
  search: "",
  category: "",
  employmentType: "",
  workplaceType: "",
  experienceLevel: "",
  location: "",
  featured: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  limit: 8,
};

const categoryOptions = ["Design", "Engineering", "Product", "Marketing", "Operations"];
const experienceOptions = ["Junior", "Mid Level", "Senior", "Lead"];

export function JobsExplorePage() {
  const [filters, setFilters] = useState<JobsQueryParams>(initialFilters);
  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      startTransition(() => {
        setFilters((current) => ({
          ...current,
          search: searchInput.trim(),
          page: 1,
        }));
      });
    }, 450);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  const queryParams = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== "" && value !== undefined),
  ) as JobsQueryParams;

  const { data, isLoading, isFetching, isError } = useJobsQuery(queryParams);
  const jobs = data?.jobs ?? [];
  const meta = data?.meta;
  const visiblePages = meta ? getVisiblePageNumbers(meta.page, meta.totalPages) : [];

  const updateFilter = <K extends keyof JobsQueryParams>(
    key: K,
    value: JobsQueryParams[K],
  ) => {
    startTransition(() => {
      setFilters((current) => ({
        ...current,
        [key]: value,
        page: 1,
      }));
    });
  };

  const setPage = (page: number) => {
    startTransition(() => {
      setFilters((current) => ({
        ...current,
        page,
      }));
    });
  };

  const clearFilters = () => {
    setSearchInput("");
    startTransition(() => {
      setFilters(initialFilters);
    });
  };

  return (
    <main className="min-h-screen overflow-x-hidden pb-16 pt-32 sm:pt-36">
      <Container className="space-y-8">
        <PageHeader
          badge={<SectionBadge>Jobs Explore</SectionBadge>}
          title="Find focused opportunities with real filters, faster search, and a cleaner signal."
          description="This explore page connects directly to the jobs backend from STEP 9 and supports debounced search, filtering, sorting, pagination, and loading states in a premium responsive layout."
          action={
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                className="lg:hidden"
                onClick={() => setShowFilters((current) => !current)}
              >
                <SlidersHorizontal className="size-4" />
                Filters
              </Button>
              <PrimaryButton onClick={clearFilters} variant="outline">
                Reset
              </PrimaryButton>
            </div>
          }
        />

        <section className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside
            className={cn(
              "space-y-4 rounded-[2rem] border border-border/60 p-5 shadow-glass glass-panel xl:sticky xl:top-28 xl:self-start",
              showFilters ? "block" : "hidden xl:block",
            )}
          >
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search jobs, companies, or skills"
                className="h-12 w-full rounded-[1.2rem] border border-border/70 bg-background/80 pl-11 pr-4 text-sm text-foreground outline-none transition-shadow duration-200 placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <FilterSelect
              label="Category"
              value={filters.category ?? ""}
              onChange={(value) => updateFilter("category", value)}
              options={categoryOptions}
            />

            <FilterSelect
              label="Employment Type"
              value={filters.employmentType ?? ""}
              onChange={(value) => updateFilter("employmentType", value as JobsQueryParams["employmentType"])}
              options={["full-time", "part-time", "contract", "internship", "freelance"]}
            />

            <FilterSelect
              label="Workplace Type"
              value={filters.workplaceType ?? ""}
              onChange={(value) => updateFilter("workplaceType", value as JobsQueryParams["workplaceType"])}
              options={["remote", "hybrid", "on-site"]}
            />

            <FilterSelect
              label="Experience Level"
              value={filters.experienceLevel ?? ""}
              onChange={(value) => updateFilter("experienceLevel", value)}
              options={experienceOptions}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Location
              </label>
              <input
                value={filters.location ?? ""}
                onChange={(event) => updateFilter("location", event.target.value)}
                placeholder="Remote, New York, Dhaka..."
                className="h-11 w-full rounded-[1rem] border border-border/70 bg-background/80 px-4 text-sm text-foreground outline-none transition-shadow duration-200 placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <FilterSelect
              label="Featured"
              value={filters.featured ?? ""}
              onChange={(value) => updateFilter("featured", value as JobsQueryParams["featured"])}
              options={["true"]}
              labels={{ true: "Featured only" }}
            />

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <FilterSelect
                label="Sort By"
                value={filters.sortBy ?? "createdAt"}
                onChange={(value) => updateFilter("sortBy", value as JobsQueryParams["sortBy"])}
                options={["createdAt", "applicationDeadline", "views", "applicantsCount"]}
                labels={{
                  createdAt: "Newest",
                  applicationDeadline: "Deadline",
                  views: "Views",
                  applicantsCount: "Applicants",
                }}
              />
              <FilterSelect
                label="Sort Order"
                value={filters.sortOrder ?? "desc"}
                onChange={(value) => updateFilter("sortOrder", value as JobsQueryParams["sortOrder"])}
                options={["desc", "asc"]}
                labels={{ desc: "Descending", asc: "Ascending" }}
              />
            </div>
          </aside>

          <div className="min-w-0 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-border/60 px-4 py-4 shadow-glass glass-panel">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {meta ? `${meta.total} opportunities found` : "Searching jobs..."}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isFetching ? "Refreshing results..." : "Search updates after a short debounce."}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {meta ? `Page ${meta.page} of ${meta.totalPages}` : "Page 1"}
              </div>
            </div>

            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
                {Array.from({ length: 8 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : isError ? (
              <EmptyState
                title="Jobs could not be loaded"
                description="The jobs explore page could not reach the backend successfully. Confirm the API server is running and `NEXT_PUBLIC_API_URL` points to the backend base URL."
                action={<PrimaryButton onClick={() => window.location.reload()}>Retry</PrimaryButton>}
              />
            ) : jobs.length === 0 ? (
              <EmptyState
                title="No jobs match these filters yet"
                description="Try widening the search, removing one of the active filters, or switching the sorting strategy to explore more available roles."
                action={<PrimaryButton onClick={clearFilters}>Clear filters</PrimaryButton>}
              />
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
                  {jobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>

                {meta && meta.totalPages > 1 ? (
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={meta.page <= 1}
                      onClick={() => setPage(meta.page - 1)}
                    >
                      Previous
                    </Button>
                    {visiblePages.map((pageNumber) => {
                      return (
                        <Button
                          key={pageNumber}
                          type="button"
                          variant={pageNumber === meta.page ? "default" : "outline"}
                          onClick={() => setPage(pageNumber)}
                          className="min-w-11"
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                    <Button
                      type="button"
                      variant="outline"
                      disabled={meta.page >= meta.totalPages}
                      onClick={() => setPage(meta.page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </section>
      </Container>
    </main>
  );
}

function getVisiblePageNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5];
  }

  if (currentPage >= totalPages - 2) {
    return Array.from({ length: 5 }, (_, index) => totalPages - 4 + index);
  }

  return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  labels,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  labels?: Record<string, string>;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-[1rem] border border-border/70 bg-background/80 px-4 text-sm text-foreground outline-none transition-shadow duration-200 focus:ring-2 focus:ring-primary/20"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {labels?.[option] ?? option}
          </option>
        ))}
      </select>
    </div>
  );
}
