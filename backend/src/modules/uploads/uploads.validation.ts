import { z } from "zod";

export const uploadFileSchema = z.object({
  body: z.object({
    resource: z.enum([
      "avatar",
      "company-logo",
      "job-banner",
      "resume",
      "blog-image",
    ]),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});
