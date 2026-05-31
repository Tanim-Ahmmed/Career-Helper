"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/cards/glass-card";
import { getErrorMessage } from "@/lib/api-error";
import { login, register, googleLogin } from "@/services/auth";
import { useAuthStore } from "@/store/auth-store";

type AuthMode = "login" | "register";

/* ==================== ZOD SCHEMAS ==================== */

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
    .regex(/^[a-zA-Z0-9._-]+$/, "Use letters, numbers, dots, underscores, or dashes."),
  role: z.enum(["user", "recruiter"], {
    errorMap: () => ({ message: "Please select a role." }),
  }),
});

/* ==================== TYPE DEFINITIONS ==================== */

type AuthFormValues = z.infer<typeof registerSchema>;

interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  id?: string;
  required?: boolean;
}

/* ==================== MAIN COMPONENT ==================== */

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
    mode: "onBlur",
  });

  const isSubmitting = form.formState.isSubmitting;

  /* ==================== GOOGLE LOGIN HANDLER ==================== */

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email || !user.displayName) {
        toast.error("Unable to retrieve account information from Google");
        return;
      }

      // Get role from form
      const selectedRole = form.getValues("role") || "user";

      const response = await googleLogin({
        name: user.displayName,
        email: user.email,
        username: user.email.split("@")[0],
        role: selectedRole,
      });

      setSession(response);
      toast.success("Google login successful!");

      // Navigate based on user role
      const redirectPath =
        response.user.role === "admin"
          ? "/admin"
          : response.user.role === "recruiter"
            ? "/recruiter"
            : "/dashboard";

      router.push(redirectPath);
    } catch (error) {
      console.error("Google login error:", error);

      const firebaseError = error as FirebaseError;

      // Handle specific Firebase auth errors
      switch (firebaseError?.code) {
        case "auth/popup-closed-by-user":
          toast.error("Login cancelled. Please try again.");
          break;
        case "auth/popup-blocked":
          toast.error("Popup was blocked. Please allow popups and try again.");
          break;
        case "auth/cancelled-popup-request":
          // User cancelled silently
          break;
        case "auth/network-request-failed":
          toast.error("Network error. Please check your connection and try again.");
          break;
        default:
          toast.error("Google login failed. Please try again.");
      }
    }
  };

  /* ==================== FORM SUBMISSION HANDLER ==================== */

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
              role: values.role,
            });

      setSession(response);

      toast.success(
        mode === "login"
          ? "Login successful. Redirecting..."
          : "Account created successfully. Welcome!"
      );

      // Navigate based on user role
      const redirectPath =
        response.user.role === "admin"
          ? "/admin"
          : response.user.role === "recruiter"
            ? "/recruiter"
            : "/dashboard";

      router.push(redirectPath);
      router.refresh();
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(
        getErrorMessage(error, "Authentication failed. Please try again.")
      );
    }
  });

  /* ==================== RENDER ==================== */

  return (
    <GlassCard className="w-full max-w-2xl rounded-[2rem] border-white/20 bg-white/70 p-8 dark:bg-slate-950/60">
      {/* Header Section */}
      <div className="space-y-3 mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
          {mode === "login" ? "Welcome back" : "Create account"}
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {mode === "login"
            ? "Access your career workspace."
            : "Start your AI-powered career system."}
        </h1>

        <p className="text-sm text-muted-foreground">
          {mode === "login"
            ? "Sign in to continue."
            : "Create your professional profile."}
        </p>
      </div>

      {/* Google Login Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full mt-2"
        onClick={handleGoogleLogin}
        disabled={isSubmitting}
        aria-label="Continue with Google"
      >
        {isSubmitting ? (
          <>
            <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
            Processing...
          </>
        ) : (
          "Continue with Google"
        )}
      </Button>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">OR</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Auth Form */}
      <form onSubmit={onSubmit} className="grid gap-4" noValidate>
        {/* Registration-Only Fields */}
        {mode === "register" && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Full Name"
                error={form.formState.errors.name?.message}
                id="fullname"
                required
              >
                <input
                  id="fullname"
                  className={inputClassName}
                  placeholder="John Doe"
                  autoComplete="name"
                  disabled={isSubmitting}
                  {...form.register("name")}
                />
              </Field>

              <Field
                label="Username"
                error={form.formState.errors.username?.message}
                id="username"
                hint="Letters, numbers, dots, dashes, or underscores"
                required
              >
                <input
                  id="username"
                  className={inputClassName}
                  placeholder="johndoe"
                  autoComplete="username"
                  disabled={isSubmitting}
                  {...form.register("username")}
                />
              </Field>
            </div>

            {/* Role Selection */}
            <Field
              label="Select Role"
              error={form.formState.errors.role?.message}
              id="role"
              required
            >
              <select
                id="role"
                className={`${inputClassName} cursor-pointer`}
                disabled={isSubmitting}
                {...form.register("role")}
              >
                <option value="">-- Choose your role --</option>
                <option value="user">Job Seeker</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </Field>
          </>
        )}

        {/* Email & Password Fields */}
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Email Address"
            error={form.formState.errors.email?.message}
            id="email"
            required
          >
            <input
              id="email"
              className={inputClassName}
              type="email"
              placeholder="you@example.com"
              autoComplete={mode === "login" ? "email" : "off"}
              disabled={isSubmitting}
              {...form.register("email")}
            />
          </Field>

          <Field
            label="Password"
            error={form.formState.errors.password?.message}
            id="password"
            hint={mode === "register" ? "Minimum 8 characters" : undefined}
            required
          >
            <input
              id="password"
              className={inputClassName}
              type="password"
              placeholder="••••••••"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              disabled={isSubmitting}
              {...form.register("password")}
            />
          </Field>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full mt-2"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
              {mode === "login" ? "Signing in..." : "Creating account..."}
            </>
          ) : mode === "login" ? (
            "Sign In"
          ) : (
            "Create Account"
          )}
        </Button>

        {/* Toggle Auth Mode Link */}
        <p className="text-center text-sm text-muted-foreground">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <Link
            href={mode === "login" ? "/register" : "/login"}
            className="font-semibold text-primary hover:underline transition-all"
            tabIndex={0}
          >
            {mode === "login" ? "Register" : "Login"}
          </Link>
        </p>
      </form>
    </GlassCard>
  );
}

/* ==================== FIELD COMPONENT ==================== */

function Field({
  label,
  error,
  hint,
  id,
  required,
  children,
}: FieldProps) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {children}

      {error && (
        <span className="text-xs text-red-500" role="alert">
          ✕ {error}
        </span>
      )}

      {hint && !error && (
        <span className="text-xs text-muted-foreground">{hint}</span>
      )}
    </div>
  );
}

/* ==================== INPUT STYLING ==================== */

const inputClassName =
  "h-12 w-full rounded-2xl border border-input bg-background/70 px-4 text-sm placeholder:text-muted-foreground outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed";
