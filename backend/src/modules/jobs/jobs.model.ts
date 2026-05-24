import { model, Schema } from "mongoose";

import type { IJob } from "./jobs.interface";

const salarySchema = new Schema(
  {
    min: {
      type: Number,
      required: true,
      min: 0,
    },
    max: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      default: "USD",
    },
    period: {
      type: String,
      enum: ["hour", "month", "year"],
      required: true,
      default: "year",
    },
  },
  {
    _id: false,
    versionKey: false,
  },
);

const jobsSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    companyLogo: {
      type: String,
      trim: true,
      default: "",
    },
    companyWebsite: {
      type: String,
      trim: true,
      default: "",
    },
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "freelance"],
      required: true,
    },
    workplaceType: {
      type: String,
      enum: ["remote", "hybrid", "on-site"],
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    experienceLevel: {
      type: String,
      required: true,
      trim: true,
    },
    salary: {
      type: salarySchema,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    skillsRequired: {
      type: [String],
      required: true,
      default: [],
    },
    responsibilities: {
      type: [String],
      required: true,
      default: [],
    },
    requirements: {
      type: [String],
      required: true,
      default: [],
    },
    benefits: {
      type: [String],
      required: true,
      default: [],
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 240,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    applicantsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "published", "closed"],
      default: "draft",
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    applicationDeadline: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

jobsSchema.index({ title: "text", company: "text", shortDescription: "text", tags: "text" });
jobsSchema.index({ status: 1, featured: 1, category: 1, createdAt: -1 });

export const jobsModel = model<IJob>("Job", jobsSchema);
