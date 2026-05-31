"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/cards/glass-card";
import { getErrorMessage } from "@/lib/api-error";
import { login, register, googleLogin } from "@/services/auth";
import { useAuthStore } from "@/store/auth-store";

type Role = "user" | "recruiter";
type AuthMode = "login" | "register";

/* ---------------- ZOD SCHEMA ---------------- */

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const registerSchema = loginSchema.extend({
  name: z.string().trim().min(2, "Name is too short."),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .regex(/^[a-zA-Z0-9._-]+$/, "Invalid username format."),
  role: z.enum(["user", "recruiter"], {
    message: "Select a role.",
  }),
});

/* ---------------- TYPE ---------------- */

type AuthFormValues = {
  name?: string;
  username?: string;
  email: string;
  password: string;
  role?: Role;
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
      role: "user",
    },
  });

  /* ---------------- GOOGLE LOGIN ---------------- */

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      const response = await googleLogin({
        name: user.displayName || "User",
        email: user.email!,
        username: user.email!.split("@")[0],
        role: form.role,
      });

      setSession(response);

      toast.success("Google login successful");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Google login failed");
    }
  };

  /* ---------------- SUBMIT ---------------- */

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const response =
        mode === "login"
          ? await login({
              email: values.email,
              password: values.password,
            })
          : await register({
              name: values.name!,
              username: values.username!,
              email: values.email,
              password: values.password,
              role: values.role!,
            });

      setSession(response);

      toast.success(
        mode === "login"
          ? "Login successful"
          : "Account created successfully"
      );

      router.push(
        response.user.role === "admin"
          ? "/admin"
          : response.user.role === "recruiter"
          ? "/recruiter"
          : "/dashboard"
      );

      router.refresh();
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Authentication failed. Try again.")
      );
    }
  });

  /* ---------------- UI ---------------- */

  return (
    <GlassCard className="w-full max-w-2xl rounded-[2rem] border-white/20 bg-white/70 p-8 dark:bg-slate-950/60">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
          {mode === "login" ? "Welcome back" : "Create account"}
        </p>

        <h1 className="text-3xl font-semibold tracking-tight">
          {mode === "login"
            ? "Access your workspace"
            : "Start your professional journey"}
        </h1>
      </div>

      {/* Google */}
      <Button
        type="button"
        variant="outline"
        className="w-full mt-6"
        onClick={handleGoogleLogin}
      >
        Continue with Google
      </Button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">OR</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* FORM */}
      <form onSubmit={onSubmit} className="grid gap-4">
        {mode === "register" && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full Name" error={form.formState.errors.name?.message}>
                <input className={inputClassName} {...form.register("name")} />
              </Field>

              <Field label="Username" error={form.formState.errors.username?.message}>
                <input className={inputClassName} {...form.register("username")} />
              </Field>
            </div>

            {/* ROLE DROPDOWN */}
            <Field label="Select Role" error={form.formState.errors.role?.message}>
              <select className={inputClassName} {...form.register("role")}>
                <option value="user">User</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </Field>
          </>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Email" error={form.formState.errors.email?.message}>
            <input
              className={inputClassName}
              type="email"
              {...form.register("email")}
            />
          </Field>

          <Field label="Password" error={form.formState.errors.password?.message}>
            <input
              className={inputClassName}
              type="password"
              {...form.register("password")}
            />
          </Field>
        </div>

        <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
          {mode === "login" ? "Sign In" : "Create Account"}
        </Button>

        <p className="text-sm text-muted-foreground">
          {mode === "login" ? "Need account?" : "Already have account?"}{" "}
          <Link
            href={mode === "login" ? "/register" : "/login"}
            className="font-semibold text-primary"
          >
            {mode === "login" ? "Register" : "Login"}
          </Link>
        </p>
      </form>
    </GlassCard>
  );
}

/* ---------------- FIELD COMPONENT ---------------- */

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium">{label}</span>
      {children}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}

/* ---------------- INPUT STYLE ---------------- */

const inputClassName =
  "h-12 w-full rounded-2xl border bg-background/70 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/20";
