import { model, Schema } from "mongoose";

import type { IApplication } from "./applications.interface";

const applicationsSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    resumeText: {
      type: String,
      trim: true,
      default: "",
    },
    resumeUrl: {
      type: String,
      trim: true,
      default: "",
    },
    coverLetter: {
      type: String,
      trim: true,
      default: "",
    },
    applicationStatus: {
      type: String,
      enum: ["pending", "reviewed", "interview", "accepted", "rejected"],
      default: "pending",
    },
    interviewDate: {
      type: Date,
      default: null,
    },
    score: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

applicationsSchema.index({ userId: 1, jobId: 1 }, { unique: true });
applicationsSchema.index({ applicationStatus: 1, updatedAt: -1 });

export const applicationsModel = model<IApplication>("Application", applicationsSchema);
