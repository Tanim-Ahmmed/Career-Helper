"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/cards/glass-card";
import { getErrorMessage } from "@/lib/api-error";
import { login, register } from "@/services/auth";
import { useAuthStore } from "@/store/auth-store";

const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  name: z.string().optional(),
  username: z.string().optional(),
  profession: z.string().optional(),
  experienceLevel: z.string().optional(),
  skills: z.string().optional(),
});

const registerSchema = loginSchema.extend({
  name: z.string().trim().min(2, "Name is too short."),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .regex(/^[a-zA-Z0-9._-]+$/, "Use letters, numbers, dots, underscores, or dashes."),
  profession: z.string().trim().optional(),
  experienceLevel: z.string().trim().optional(),
  skills: z.string().trim().optional(),
});

type AuthMode = "login" | "register";
type AuthFormValues = {
  email: string;
  password: string;
  name: string;
  username: string;
  profession: string;
  experienceLevel: string;
  skills: string;
};

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  const schema = mode === "login" ? loginSchema : registerSchema;
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      profession: "",
      experienceLevel: "",
      skills: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const response =
        mode === "login"
          ? await login({
              email: values.email,
              password: values.password,
            })
          : await register({
              name: values.name,
              username: values.username,
              email: values.email,
              password: values.password,
              profession: values.profession,
              experienceLevel: values.experienceLevel,
              skills: values.skills
                .split(",")
                .map((skill: string) => skill.trim())
                .filter(Boolean),
            });

      setSession(response);
      toast.success(
        mode === "login" ? "Login successful. Redirecting to your workspace." : "Account created successfully.",
      );
      router.push(response.user.role === "admin" ? "/admin" : "/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Unable to complete authentication. Please verify your details and try again.",
        ),
      );
    }
  });

  return (
    <GlassCard className="w-full max-w-2xl rounded-[2rem] border-white/20 bg-white/70 p-8 dark:bg-slate-950/60">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
          {mode === "login" ? "Welcome back" : "Create account"}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {mode === "login"
            ? "Access your career workspace."
            : "Start your AI-powered career growth system."}
        </h1>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          {mode === "login"
            ? "Sign in to reach your dashboard, saved jobs, applications, and AI tools."
            : "Register a professional profile so you can manage applications, track progress, and unlock upcoming AI workflows."}
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 grid gap-4">
        {mode === "register" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full name" error={form.formState.errors.name?.message}>
              <input className={inputClassName} {...form.register("name")} />
            </Field>
            <Field label="Username" error={form.formState.errors.username?.message}>
              <input className={inputClassName} {...form.register("username")} />
            </Field>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Email address" error={form.formState.errors.email?.message}>
            <input className={inputClassName} type="email" {...form.register("email")} />
          </Field>
          <Field label="Password" error={form.formState.errors.password?.message}>
            <input className={inputClassName} type="password" {...form.register("password")} />
          </Field>
        </div>

        {mode === "register" ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Profession">
                <input className={inputClassName} {...form.register("profession")} />
              </Field>
              <Field label="Experience level">
                <input className={inputClassName} {...form.register("experienceLevel")} />
              </Field>
            </div>
            <Field
              label="Skills"
              hint="Comma-separated, for example: React, TypeScript, Product Design"
            >
              <input className={inputClassName} {...form.register("skills")} />
            </Field>
          </>
        ) : null}

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? mode === "login"
                ? "Signing in..."
                : "Creating account..."
              : mode === "login"
                ? "Sign In"
                : "Create Account"}
          </Button>
          <p className="text-sm text-muted-foreground">
            {mode === "login" ? "Need an account?" : "Already have an account?"}{" "}
            <Link
              href={mode === "login" ? "/register" : "/login"}
              className="font-semibold text-primary"
            >
              {mode === "login" ? "Register" : "Login"}
            </Link>
          </p>
        </div>
      </form>
    </GlassCard>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm text-foreground">
      <span className="font-medium">{label}</span>
      {children}
      {error ? <span className="text-xs text-rose-500">{error}</span> : null}
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

const inputClassName =
  "h-12 rounded-2xl border border-border/70 bg-background/70 px-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20";
