import { z } from "zod";

const socialLinksSchema = z
  .object({
    linkedin: z.string().trim().optional(),
    github: z.string().trim().optional(),
    portfolio: z.string().trim().optional(),
    website: z.string().trim().optional(),
  })
  .partial();

const recruiterProfileSchema = z.object({
  companyName: z.string().trim().max(100).optional(),
  companyLogo: z.string().trim().optional(),
  companyWebsite: z.string().trim().optional(),
  companyLocation: z.string().trim().max(100).optional(),

  industry: z.string().trim().max(100).optional(),
  designation: z.string().trim().max(100).optional(),

  companyDescription: z.string().trim().max(1000).optional(),

  companySize: z
    .enum(["1-10", "11-50", "51-200", "201-500", "500+"])
    .optional(),

  foundedYear: z.number().int().min(1900).max(new Date().getFullYear()).optional(),

  phone: z.string().trim().max(30).optional(),

  hiringStatus: z
    .enum([
      "actively_hiring",
      "occasionally_hiring",
      "not_hiring",
    ])
    .optional(),
});

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    username: z
      .string()
      .trim()
      .min(3)
      .max(30)
      .regex(
        /^[a-zA-Z0-9._-]+$/,
        "Username contains invalid characters."
      ),

    email: z.email().trim().toLowerCase(),
    password: z.string().min(8).max(72),

    role: z.enum(["user", "recruiter"]).default("user"),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const updateUserProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80).optional(),
    username: z
      .string()
      .trim()
      .min(3)
      .max(30)
      .regex(
        /^[a-zA-Z0-9._-]+$/,
        "Username contains invalid characters."
      )
      .optional(),

    avatar: z.string().trim().optional(),

    userProfile: z
      .object({
        profession: z.string().trim().max(80).optional(),
        experienceLevel: z.string().trim().max(50).optional(),
        skills: z.array(z.string().trim().min(1)).max(20).optional(),
        bio: z.string().trim().max(300).optional(),
        resumeUrl: z.string().trim().optional(),
        socialLinks: socialLinksSchema.optional(),
      })
      .optional(),
  }),
  recruiterProfile: recruiterProfileSchema.optional(),

  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const updateRecruiterProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80).optional(),

    username: z
      .string()
      .trim()
      .min(3)
      .max(30)
      .regex(
        /^[a-zA-Z0-9._-]+$/,
        "Username contains invalid characters."
      )
      .optional(),

    avatar: z.string().trim().optional(),

    recruiterProfile: recruiterProfileSchema.optional(),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const savedJobParamSchema = z.object({
  body: z.object({}).default({}),
  query: z.object({}).default({}),
  params: z.object({
    jobId: z.string().trim().min(1),
  }),
});