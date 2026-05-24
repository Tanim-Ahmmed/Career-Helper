import { z } from "zod";

const aiFeatureSchema = z.enum([
  "general",
  "resume-analyzer",
  "cover-letter-generator",
  "interview-assistant",
]);

const metadataValueSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export const generateAiContentSchema = z.object({
  body: z.object({
    feature: aiFeatureSchema,
    prompt: z.string().trim().min(10).max(12000),
    context: z.array(z.string().trim().min(1)).max(12).optional().default([]),
    systemInstruction: z.string().trim().max(4000).optional(),
    metadata: z.record(z.string(), metadataValueSchema).optional(),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const aiHistoryQuerySchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({
    limit: z.coerce.number().int().min(1).max(50).optional(),
    feature: aiFeatureSchema.optional(),
  }),
});

export const resumeAnalyzerSchema = z.object({
  body: z.object({
    resumeText: z.string().trim().min(120).max(30000),
    targetJobTitle: z.string().trim().max(200).optional(),
    targetJobDescription: z.string().trim().max(12000).optional(),
    targetSkills: z.array(z.string().trim().min(1)).max(30).optional().default([]),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const coverLetterGeneratorSchema = z.object({
  body: z.object({
    applicantName: z.string().trim().max(120).optional(),
    jobTitle: z.string().trim().min(2).max(200),
    companyName: z.string().trim().min(2).max(200),
    hiringManagerName: z.string().trim().max(120).optional(),
    tone: z.enum(["professional", "confident", "warm"]).optional().default("professional"),
    yearsOfExperience: z.coerce.number().min(0).max(50).optional(),
    jobDescription: z.string().trim().max(12000).optional(),
    keySkills: z.array(z.string().trim().min(1)).max(25).optional().default([]),
    achievements: z.array(z.string().trim().min(1)).max(12).optional().default([]),
    relevantExperience: z.string().trim().max(8000).optional(),
    additionalContext: z.string().trim().max(4000).optional(),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const interviewAssistantSchema = z.object({
  body: z.object({
    jobTitle: z.string().trim().min(2).max(200),
    companyName: z.string().trim().max(200).optional(),
    experienceLevel: z.string().trim().max(120).optional(),
    interviewType: z
      .enum(["technical", "behavioral", "hr", "mixed"])
      .optional()
      .default("mixed"),
    jobDescription: z.string().trim().max(12000).optional(),
    focusAreas: z.array(z.string().trim().min(1)).max(12).optional().default([]),
    resumeHighlights: z.array(z.string().trim().min(1)).max(12).optional().default([]),
    numberOfQuestions: z.coerce.number().int().min(3).max(10).optional().default(5),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});
