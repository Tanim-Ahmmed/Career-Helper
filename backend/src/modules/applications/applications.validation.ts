import { z } from "zod";

export const createApplicationSchema = z.object({
  body: z.object({
    jobId: z.string().trim().min(1),
    resumeUrl: z.string().trim().optional(),
    coverLetter: z.string().trim().min(20).max(5000).optional(),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const applicationsQuerySchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({
    status: z
      .enum(["pending", "reviewed", "interview", "accepted", "rejected"])
      .optional(),
    search: z.string().trim().optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
});

export const updateApplicationSchema = z.object({
  body: z.object({
    applicationStatus: z.enum(["pending", "reviewed", "interview", "accepted", "rejected"]),
    interviewDate: z
      .union([z.string().datetime(), z.literal(""), z.null()])
      .transform((value) => (value === "" ? null : value))
      .optional(),
    feedback: z.string().trim().max(5000).optional(),
  }),
  params: z.object({
    id: z.string().trim().min(1),
  }),
  query: z.object({}).default({}),
});
