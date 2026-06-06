"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Inbox,
  Sparkles,
  Users,
  CheckCircle,
  XOctagon,
  User,
  Lock,
  Mail,
  Calendar,
  FileText
} from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { DashboardListLoadingShell } from "@/components/shared/loading-shells";
import { PageHeader } from "@/components/shared/page-header";
import { PrimaryButton } from "@/components/shared/primary-button";
import { SectionBadge } from "@/components/shared/section-badge";
import { fetchApplications } from "@/services/dashboard";
import { api } from "@/services/api";
import { toast } from "sonner";

// TypeScript টাইপ ডিফাইন করা হলো ফিক্স করার জন্য
interface JobDetails {
  _id?: string;
  title?: string;
  company?: string;
  status?: string;
}

interface ApplicationType {
  _id: string;
  applicationStatus: string;
  coverLetter?: string;
  resumeText?: string;
  createdAt: string;
  job: JobDetails;
  applicant: object;
}

export default function UserApplicationsPage() {
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [isBulkLoading, setIsBulkLoading] = useState<boolean>(false);

  const applicationsQuery = useQuery<ApplicationType[]>({
    queryKey: ["applications"],
    queryFn: () => fetchApplications() as unknown as Promise<ApplicationType[]>,
  });

  const applications = applicationsQuery.data || [];

  console.log(applications);

  // 🚀 Bulk AI Shortlist Automation Method (Updated: No jobId payload needed)
  const handleBulkAiShortlist = async () => {
    if (!window.confirm("Run AI Automation across all active jobs? This will instantly evaluate resumes.")) return;

    try {
      setIsBulkLoading(true);
      // ব্যাকএন্ড এখন নিজেই সব জব বের করবে, তাই বডিতে কিছু পাঠানো লাগবে না 🎯
      const response = await api.post(`/ai/resume-analyzer`);
      toast.success(`AI Automation Successful! Evaluation complete.`);
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsBulkLoading(false);
    }
  };

  // 🔄 Single Status Update Dropdown Handler
  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    try {
      const response = await api.patch(`/applications/${applicationId}`, { status: newStatus });

      toast.success("Status updated successfully!");
      window.location.reload();
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  // 🔍 ফ্রন্টএন্ড ফিল্টারিং
  const filteredApplications = applications.filter((app) => app.applicationStatus === activeTab);

  // ট্যাব কাউন্টার হেল্পার ফাংশন
  const getCount = (status: string) => applications.filter((app) => app.applicationStatus === status).length;

  if (applicationsQuery.isLoading) {
    return <DashboardListLoadingShell items={3} />;
  }

  return (
    <div className="space-y-4 text-gray-900 dark:text-gray-100">
      <PageHeader
        badge={<SectionBadge>Applications</SectionBadge>}
        title="Tracked applications"
        description="Monitor status changes, interview timing, and feedback from every role connected to your account."
      />

      <div className="grid gap-4">
        {applications.length ? (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs transition-colors">

            {/* 1. TOP HEADER SECTION */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Applicant Tracking Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Monitor pipeline, view credentials, and invoke AI automation screening.</p>
              </div>

              {/* 🚀 গ্লোবাল এআই অটোমেশন বাটন */}
              <button
                disabled={isBulkLoading || getCount("pending") === 0}
                onClick={handleBulkAiShortlist}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md transition-all disabled:opacity-40"
              >
                {isBulkLoading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Run AI Resume Screening (Match ≥ 85%)
              </button>
            </div>

            {/* 2. TAB CONTROLS NAVIGATION */}
            <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-800 gap-2 mb-6">
              {[
                { id: "pending", label: "Pending Review", icon: <Inbox className="w-4 h-4" />, color: "bg-blue-500 text-white" },
                { id: "shortlisted", label: "AI Shortlisted", icon: <Sparkles className="w-4 h-4" />, color: "bg-amber-500 text-white" },
                { id: "interviewing", label: "Interviews", icon: <Users className="w-4 h-4" />, color: "bg-purple-500 text-white" },
                { id: "offered", label: "Job Offered", icon: <CheckCircle className="w-4 h-4" />, color: "bg-green-500 text-white" },
                { id: "rejected", label: "Rejected", icon: <XOctagon className="w-4 h-4" />, color: "bg-red-500 text-white" }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                const count = getCount(tab.id);

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-all rounded-t-lg -mb-[2px] ${isActive
                      ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-900 shadow-xs font-semibold"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                  >
                    {tab.icon}
                    {tab.label}
                    <span className={`text-xs ml-1 px-2 py-0.5 rounded-full ${isActive ? tab.color : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 font-bold"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 3. APPLICATION RENDER LIST */}
            <div className="space-y-4">
              {filteredApplications.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-400">
                  <Inbox className="w-12 h-12 mx-auto text-gray-200 dark:text-gray-700 mb-2" />
                  <p className="text-base font-semibold">No applicants inside this stage yet</p>
                </div>
              ) : (
                filteredApplications.map((app: any) => {
                  // টাইপ সেফ উপায়ে অবজেক্ট চেক করা (TS Error Fix)
                  const isJobClosed = app.job.status === "closed";

                  return (
                    <div
                      key={app._id}
                      className={`bg-white dark:bg-gray-900 border rounded-xl p-5 shadow-xs flex flex-col lg:flex-row justify-between gap-6 transition-colors ${isJobClosed ? "bg-gray-50 dark:bg-gray-800/50 opacity-75" : "border-gray-200 dark:border-gray-800"
                        }`}
                    >
                      {/* Left Side Info */}
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400 dark:text-gray-500" /> {app.applicant.name || "Anonymous Candidate"}
                          </h3>
                          {isJobClosed && (
                            <span className="text-[11px] bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Post Closed
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-100 dark:border-gray-700 inline-block">
                          <span className="font-semibold text-indigo-600 dark:text-indigo-400">{app.applicant.profession || "Unknown Role"}</span> • {app.job.company || "Unknown Company"}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                          <span><Mail className="w-3.5 h-3.5 inline mr-1" /> {app.applicant.email}</span>
                          <span><Calendar className="w-3.5 h-3.5 inline mr-1" /> Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Right Side Workflow Actions */}
                      <div className="flex flex-col sm:flex-row lg:flex-col justify-end items-end gap-3 lg:min-w-[180px]">
                        <button
                          type="button"
                          onClick={() => {
                            if (app.resumeUrl) {
                              window.open(app.resumeUrl, "_blank");
                            }
                          }}
                          className="w-full text-xs font-semibold px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Resume
                        </button>

                        <div className="w-full">
                          <select
                            disabled={isJobClosed}
                            value={app.applicationStatus}
                            onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                            className="w-full text-xs font-bold p-2 rounded-lg border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 cursor-pointer disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400"
                          >
                            <option value="pending">Pending Review</option>
                            <option value="shortlisted">Shortlist</option>
                            <option value="interviewing">Interview</option>
                            <option value="offered">Send Offer</option>
                            <option value="rejected">Reject</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          <EmptyState
            title="No applications submitted yet"
            description="Apply from any live job detail page and your submissions will appear here with their latest status, timing, and feedback."
            action={
              <PrimaryButton asChild>
                <Link href="/jobs">Browse jobs</Link>
              </PrimaryButton>
            }
          />
        )}
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-border/70 bg-background/70 p-4 dark:border-gray-800 dark:bg-gray-900">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground dark:text-gray-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-foreground dark:text-white">{value}</p>
    </div>
  );
}