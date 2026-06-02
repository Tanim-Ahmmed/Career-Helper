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

type ProfileFormValues = {
  name: string;
  username: string;
  avatar: string;

  userProfile?: {
    profession: string;
    experienceLevel: string;
    bio: string;
    skills: string;
    resumeUrl: string;

    socialLinks: {
      linkedin: string;
      github: string;
      portfolio: string;
      website: string;
    };
  };

  recruiterProfile?: {
    companyName: string;
    companyLogo: string;
    companyWebsite: string;
    companyLocation: string;

    industry: string;
    designation: string;

    companyDescription: string;

    companySize:
    | "1-10"
    | "11-50"
    | "51-200"
    | "201-500"
    | "500+"
    | "";

    foundedYear: string;

    phone: string;

    hiringStatus:
    | "actively_hiring"
    | "occasionally_hiring"
    | "not_hiring"
    | "";
  };
};

export default function ProfileSettingsPage() {
  const queryClient = useQueryClient();

  const currentUser = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const role = currentUser?.role;

  const dashboardQuery = useQuery({
    queryKey: ["user-dashboard"],
    queryFn: fetchUserDashboard,
  });

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      name: "",
      username: "",
      avatar: "",

      userProfile: {
        profession: "",
        experienceLevel: "",
        bio: "",
        resumeUrl: "",
        skills: "",

        socialLinks: {
          linkedin: "",
          github: "",
          portfolio: "",
          website: "",
        },
      },

      recruiterProfile: {
        companyName: "",
        companyLogo: "",
        companyWebsite: "",
        companyLocation: "",
        industry: "",
        designation: "",
        companyDescription: "",
        companySize: "",
        foundedYear: "",
        phone: "",
        hiringStatus: "",
      },
    },
  });

  useEffect(() => {
    const profile = dashboardQuery.data?.profile;

    if (!profile) return;

    form.reset({
      name: profile.name ?? "",
      username: profile.username ?? "",
      avatar: profile.avatar ?? "",

      userProfile: {
        profession: profile.userProfile?.profession ?? "",
        experienceLevel: profile.userProfile?.experienceLevel ?? "",
        bio: profile.userProfile?.bio ?? "",
        resumeUrl: profile.userProfile?.resumeUrl ?? "",
        skills: profile.userProfile?.skills?.join(", ") ?? "",
        socialLinks: {
          linkedin: profile.userProfile?.socialLinks?.linkedin ?? "",
          github: profile.userProfile?.socialLinks?.github ?? "",
          portfolio: profile.userProfile?.socialLinks?.portfolio ?? "",
          website: profile.userProfile?.socialLinks?.website ?? "",
        },
      },

      recruiterProfile: {
        companyName: profile.recruiterProfile?.companyName ?? "",
        companyLogo: profile.recruiterProfile?.companyLogo ?? "",
        companyWebsite: profile.recruiterProfile?.companyWebsite ?? "",
        companyLocation: profile.recruiterProfile?.companyLocation ?? "",
        industry: profile.recruiterProfile?.industry ?? "",
        designation: profile.recruiterProfile?.designation ?? "",
        companyDescription: profile.recruiterProfile?.companyDescription ?? "",
        companySize: profile.recruiterProfile?.companySize ?? "",
        foundedYear: profile.recruiterProfile?.foundedYear?.toString() ?? "",
        phone: profile.recruiterProfile?.phone ?? "",
        hiringStatus: profile.recruiterProfile?.hiringStatus ?? "",
      },
    });
  }, [dashboardQuery.data?.profile, form]);

  if (dashboardQuery.isLoading && !dashboardQuery.data) {
    return <DashboardFormLoadingShell />;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const payload: any = {
        name: values.name,
        username: values.username,
        avatar: values.avatar,
      };

      if (role === "user") {
        payload.userProfile = {
          ...values.userProfile,

          skills:
            values.userProfile?.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean) ?? [],
        };
      }

      if (role === "recruiter") {
        payload.recruiterProfile = {
          ...values.recruiterProfile,

          foundedYear: values.recruiterProfile?.foundedYear
            ? Number(values.recruiterProfile.foundedYear)
            : undefined,
        };
      }

      const updatedProfile = await updateProfile(payload);

      updateUser(updatedProfile);

      await queryClient.invalidateQueries({
        queryKey: ["user-dashboard"],
      });

      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Unable to save your profile right now."
        )
      );
    }
  });

  return (
    <div className="space-y-4">
      <PageHeader
        badge={<SectionBadge>Profile Settings</SectionBadge>}
        title="Refine your profile"
        description="Manage your public identity and profile information."
      />

      <GlassCard>
        <form onSubmit={onSubmit} className="grid gap-4">

          {/* COMMON FIELDS */}

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full name">
              <input
                className={inputClassName}
                {...form.register("name")}
              />
            </Field>

            <Field label="Username">
              <input
                className={inputClassName}
                {...form.register("username")}
              />
            </Field>
          </div>

          <Field label="Avatar URL">
            <input
              className={inputClassName}
              {...form.register("avatar")}
            />
          </Field>

          {/* USER PROFILE */}

          {role === "user" && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Profession">
                  <input
                    className={inputClassName}
                    {...form.register(
                      "userProfile.profession"
                    )}
                  />
                </Field>

                <Field label="Experience level">
                  <input
                    className={inputClassName}
                    {...form.register(
                      "userProfile.experienceLevel"
                    )}
                  />
                </Field>
              </div>

              <Field label="Bio">
                <textarea
                  className={`${inputClassName} min-h-32 py-3`}
                  {...form.register("userProfile.bio")}
                />
              </Field>

              <Field label="Skills">
                <input
                  className={inputClassName}
                  placeholder="React, Node.js, MongoDB"
                  {...form.register("userProfile.skills")}
                />
              </Field>

              <Field label="Resume URL">
                <input
                  className={inputClassName}
                  {...form.register(
                    "userProfile.resumeUrl"
                  )}
                />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="LinkedIn">
                  <input
                    className={inputClassName}
                    {...form.register(
                      "userProfile.socialLinks.linkedin"
                    )}
                  />
                </Field>

                <Field label="GitHub">
                  <input
                    className={inputClassName}
                    {...form.register(
                      "userProfile.socialLinks.github"
                    )}
                  />
                </Field>

                <Field label="Portfolio">
                  <input
                    className={inputClassName}
                    {...form.register(
                      "userProfile.socialLinks.portfolio"
                    )}
                  />
                </Field>

                <Field label="Website">
                  <input
                    className={inputClassName}
                    {...form.register(
                      "userProfile.socialLinks.website"
                    )}
                  />
                </Field>
              </div>
            </>
          )}

          {/* RECRUITER PROFILE */}

          {role === "recruiter" && (
            <>
              <div className="grid gap-4 md:grid-cols-2">

                <Field label="Company name">
                  <input
                    className={inputClassName}
                    {...form.register(
                      "recruiterProfile.companyName"
                    )}
                  />
                </Field>

                <Field label="Company logo">
                  <input
                    className={inputClassName}
                    {...form.register(
                      "recruiterProfile.companyLogo"
                    )}
                  />
                </Field>

                <Field label="Company website">
                  <input
                    className={inputClassName}
                    {...form.register(
                      "recruiterProfile.companyWebsite"
                    )}
                  />
                </Field>

                <Field label="Company location">
                  <input
                    className={inputClassName}
                    {...form.register(
                      "recruiterProfile.companyLocation"
                    )}
                  />
                </Field>

                <Field label="Industry">
                  <input
                    className={inputClassName}
                    {...form.register(
                      "recruiterProfile.industry"
                    )}
                  />
                </Field>

                <Field label="Designation">
                  <input
                    className={inputClassName}
                    {...form.register(
                      "recruiterProfile.designation"
                    )}
                  />
                </Field>

                <Field label="Company size">
                  <select
                    className={inputClassName}
                    {...form.register(
                      "recruiterProfile.companySize"
                    )}
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="500+">500+</option>
                  </select>
                </Field>

                <Field label="Founded year">
                  <input
                    type="number"
                    className={inputClassName}
                    {...form.register(
                      "recruiterProfile.foundedYear"
                    )}
                  />
                </Field>

                <Field label="Phone">
                  <input
                    className={inputClassName}
                    {...form.register(
                      "recruiterProfile.phone"
                    )}
                  />
                </Field>

                <Field label="Hiring status">
                  <select
                    className={inputClassName}
                    {...form.register(
                      "recruiterProfile.hiringStatus"
                    )}
                  >
                    <option value="">
                      Select hiring status
                    </option>

                    <option value="actively_hiring">
                      Actively Hiring
                    </option>

                    <option value="occasionally_hiring">
                      Occasionally Hiring
                    </option>

                    <option value="not_hiring">
                      Not Hiring
                    </option>
                  </select>
                </Field>
              </div>

              <Field label="Company description">
                <textarea
                  className={`${inputClassName} min-h-32 py-3`}
                  {...form.register(
                    "recruiterProfile.companyDescription"
                  )}
                />
              </Field>
            </>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Saving..."
                : "Save profile"}
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
