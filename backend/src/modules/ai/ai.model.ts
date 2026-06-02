import { model, Schema } from "mongoose";

import type { IAiHistory } from "./ai.interface";

const aiHistorySchema = new Schema<IAiHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "recruiter", "admin"],
      required: true,
    },

    inputType: {
      type: String,
      enum: ["text", "resume", "job", "application"],
      default: "text",
    },

    feature: {
      type: String,
      enum: [
        "general",
        "resume-analyzer",
        "cover-letter-generator",
        "interview-assistant",
        "job-generator",
        "candidate-screening",
        "job-match",
        "career-coach",
      ],
      required: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    prompt: {
      type: String,
      required: true,
      trim: true,
    },
    responseText: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["success", "error"],
      default: "success",
    },
    errorMessage: {
      type: String,
      trim: true,
      default: "",
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },

    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      default: null,
    },
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      default: null,
    },
    tokensUsed: {
      type: Number,
      default: 0,
    },
    cost: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const aiHistoryModel = model<IAiHistory>("AiHistory", aiHistorySchema, "ai_history");
