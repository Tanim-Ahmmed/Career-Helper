"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/cards/glass-card";
import { getErrorMessage } from "@/lib/api-error";
import { DashboardFormLoadingShell } from "@/components/shared/loading-shells";
import { PageHeader } from "@/components/shared/page-header";
import { SectionBadge } from "@/components/shared/section-badge";
import { fetchUserDashboard, updateProfile } from "@/services/dashboard";
import { useAuthStore } from "@/store/auth-store";
import type { AuthUser } from "@/types/auth";

type ProfileFormValues = {
  name: string;
  username: string;
  profession: string;
  experienceLevel: string;
  bio: string;
  avatar: string;
  resumeUrl: string;
  skills: string;
  linkedin: string;
  github: string;
  portfolio: string;
  website: string;
};

export default function ProfileSettingsPage() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  const dashboardQuery = useQuery({
    queryKey: ["user-dashboard"],
    queryFn: fetchUserDashboard,
  });

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      name: "",
      username: "",
      profession: "",
      experienceLevel: "",
      bio: "",
      avatar: "",
      resumeUrl: "",
      skills: "",
      linkedin: "",
      github: "",
      portfolio: "",
      website: "",
    },
  });

  useEffect(() => {
    const profile = dashboardQuery.data?.profile;

    if (!profile) {
      return;
    }

    form.reset({
      name: profile.name ?? "",
      username: profile.username ?? "",
      profession: profile.profession ?? "",
      experienceLevel: profile.experienceLevel ?? "",
      bio: profile.bio ?? "",
      avatar: profile.avatar ?? "",
      resumeUrl: profile.resumeUrl ?? "",
      skills: profile.skills?.join(", ") ?? "",
      linkedin: profile.socialLinks?.linkedin ?? "",
      github: profile.socialLinks?.github ?? "",
      portfolio: profile.socialLinks?.portfolio ?? "",
      website: profile.socialLinks?.website ?? "",
    });
  }, [dashboardQuery.data?.profile, form]);

  if (dashboardQuery.isLoading && !dashboardQuery.data) {
    return <DashboardFormLoadingShell />;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const updatedProfile = await updateProfile({
        name: values.name,
        username: values.username,
        profession: values.profession,
        experienceLevel: values.experienceLevel,
        bio: values.bio,
        avatar: values.avatar,
        resumeUrl: values.resumeUrl,
        skills: values.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        socialLinks: {
          linkedin: values.linkedin,
          github: values.github,
          portfolio: values.portfolio,
          website: values.website,
        },
      } as Partial<AuthUser>);

      updateUser(updatedProfile);
      await queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to save your profile right now."));
    }
  });

  return (
    <div className="space-y-4">
      <PageHeader
        badge={<SectionBadge>Profile Settings</SectionBadge>}
        title="Refine your career identity"
        description="Keep your profile current so saved jobs, future AI recommendations, and admin-side records all stay aligned."
      />

      <GlassCard>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full name">
              <input className={inputClassName} {...form.register("name")} />
            </Field>
            <Field label="Username">
              <input className={inputClassName} {...form.register("username")} />
            </Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Profession">
              <input className={inputClassName} {...form.register("profession")} />
            </Field>
            <Field label="Experience level">
              <input className={inputClassName} {...form.register("experienceLevel")} />
            </Field>
          </div>
          <Field label="Bio">
            <textarea className={`${inputClassName} min-h-32 py-3`} {...form.register("bio")} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Avatar URL">
              <input className={inputClassName} {...form.register("avatar")} />
            </Field>
            <Field label="Resume URL">
              <input className={inputClassName} {...form.register("resumeUrl")} />
            </Field>
          </div>
          <Field label="Skills">
            <input className={inputClassName} {...form.register("skills")} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="LinkedIn">
              <input className={inputClassName} {...form.register("linkedin")} />
            </Field>
            <Field label="GitHub">
              <input className={inputClassName} {...form.register("github")} />
            </Field>
            <Field label="Portfolio">
              <input className={inputClassName} {...form.register("portfolio")} />
            </Field>
            <Field label="Website">
              <input className={inputClassName} {...form.register("website")} />
            </Field>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save profile"}
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm text-foreground">
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
}

const inputClassName =
  "h-12 rounded-2xl border border-border/70 bg-background/70 px-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20";
