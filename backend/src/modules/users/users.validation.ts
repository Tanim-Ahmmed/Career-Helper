import { z } from "zod";

const socialLinksSchema = z
  .object({
    linkedin: z.string().trim().optional(),
    github: z.string().trim().optional(),
    portfolio: z.string().trim().optional(),
    website: z.string().trim().optional(),
  })
  .partial();

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    username: z
      .string()
      .trim()
      .min(3)
      .max(30)
      .regex(/^[a-zA-Z0-9._-]+$/, "Username contains invalid characters."),
    email: z.email().trim().toLowerCase(),
    password: z.string().min(8).max(72),
    profession: z.string().trim().max(80).optional(),
    experienceLevel: z.string().trim().max(50).optional(),
    skills: z.array(z.string().trim().min(1)).max(20).optional(),
    bio: z.string().trim().max(300).optional(),
    socialLinks: socialLinksSchema.optional(),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80).optional(),
    username: z
      .string()
      .trim()
      .min(3)
      .max(30)
      .regex(/^[a-zA-Z0-9._-]+$/, "Username contains invalid characters.")
      .optional(),
    profession: z.string().trim().max(80).optional(),
    experienceLevel: z.string().trim().max(50).optional(),
    skills: z.array(z.string().trim().min(1)).max(20).optional(),
    bio: z.string().trim().max(300).optional(),
    avatar: z.string().trim().optional(),
    resumeUrl: z.string().trim().optional(),
    socialLinks: socialLinksSchema.optional(),
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
