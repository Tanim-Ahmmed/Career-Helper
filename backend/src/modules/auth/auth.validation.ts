import { z } from "zod";

import { createUserSchema } from "../users/users.validation";

export const registerSchema = createUserSchema;

export const loginSchema = z.object({
  body: z.object({
    email: z.email().trim().toLowerCase(),
    password: z.string().min(8).max(72),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});
