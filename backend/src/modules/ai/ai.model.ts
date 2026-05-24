import { model, Schema } from "mongoose";

import type { IAiHistory } from "./ai.interface";

const aiHistorySchema = new Schema<IAiHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    feature: {
      type: String,
      enum: [
        "general",
        "resume-analyzer",
        "cover-letter-generator",
        "interview-assistant",
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
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const aiHistoryModel = model<IAiHistory>("AiHistory", aiHistorySchema, "ai_history");
