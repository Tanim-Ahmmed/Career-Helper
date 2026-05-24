import { z } from "zod";

const salarySchema = z
  .object({
    min: z.number().nonnegative(),
    max: z.number().nonnegative(),
    currency: z.string().trim().min(3).max(3).default("USD"),
    period: z.enum(["hour", "month", "year"]),
  })
  .refine((value) => value.max >= value.min, {
    message: "Salary max must be greater than or equal to salary min.",
    path: ["max"],
  });

const stringList = z.array(z.string().trim().min(1)).min(1);

const baseJobSchema = z.object({
  title: z.string().trim().min(3).max(140),
  company: z.string().trim().min(2).max(120),
  companyLogo: z.string().trim().optional().default(""),
  companyWebsite: z.string().trim().optional().default(""),
  employmentType: z.enum(["full-time", "part-time", "contract", "internship", "freelance"]),
  workplaceType: z.enum(["remote", "hybrid", "on-site"]),
  category: z.string().trim().min(2).max(80),
  experienceLevel: z.string().trim().min(2).max(80),
  salary: salarySchema,
  location: z.string().trim().min(2).max(120),
  skillsRequired: stringList,
  responsibilities: stringList,
  requirements: stringList,
  benefits: z.array(z.string().trim().min(1)).default([]),
  shortDescription: z.string().trim().min(30).max(240),
  description: z.string().trim().min(80),
  tags: z.array(z.string().trim().min(1)).default([]),
  applicantsCount: z.number().int().nonnegative().optional().default(0),
  featured: z.boolean().optional().default(false),
  status: z.enum(["draft", "published", "closed"]).optional().default("draft"),
  views: z.number().int().nonnegative().optional().default(0),
  applicationDeadline: z.coerce.date(),
});

export const createJobSchema = z.object({
  body: baseJobSchema,
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const updateJobSchema = z.object({
  body: baseJobSchema.partial().refine((value) => Object.keys(value).length > 0, {
    message: "At least one job field is required for update.",
  }),
  params: z.object({
    id: z.string().trim().min(1),
  }),
  query: z.object({}).default({}),
});

export const jobsQuerySchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({
    search: z.string().trim().optional(),
    category: z.string().trim().optional(),
    employmentType: z
      .enum(["full-time", "part-time", "contract", "internship", "freelance"])
      .optional(),
    workplaceType: z.enum(["remote", "hybrid", "on-site"]).optional(),
    experienceLevel: z.string().trim().optional(),
    location: z.string().trim().optional(),
    status: z.enum(["draft", "published", "closed"]).optional(),
    featured: z
      .enum(["true", "false"])
      .transform((value) => value === "true")
      .optional(),
    skills: z
      .union([z.string(), z.array(z.string())])
      .transform((value) =>
        Array.isArray(value)
          ? value.map((item) => item.trim()).filter(Boolean)
          : value
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
      )
      .optional(),
    sortBy: z.enum(["createdAt", "applicationDeadline", "views", "applicantsCount"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    includeDrafts: z
      .enum(["true", "false"])
      .transform((value) => value === "true")
      .optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(50).optional(),
  }),
});

export const jobSlugParamSchema = z.object({
  body: z.object({}).default({}),
  query: z.object({}).default({}),
  params: z.object({
    slug: z.string().trim().min(1),
  }),
});
