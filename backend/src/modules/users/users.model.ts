import { model, Schema } from "mongoose";

import type { IUser } from "./users.interface";

const socialLinksSchema = new Schema(
  {
    linkedin: { type: String, trim: true, default: "" },
    github: { type: String, trim: true, default: "" },
    portfolio: { type: String, trim: true, default: "" },
    website: { type: String, trim: true, default: "" },
  },
  {
    _id: false,
    versionKey: false,
  },
);

const usersSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    avatar: {
      type: String,
      trim: true,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    profession: {
      type: String,
      trim: true,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    experienceLevel: {
      type: String,
      trim: true,
      default: "",
    },
    resumeUrl: {
      type: String,
      trim: true,
      default: "",
    },
    socialLinks: {
      type: socialLinksSchema,
      default: () => ({}),
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    savedJobs: {
      type: [Schema.Types.ObjectId],
      ref: "Job",
      default: [],
    },
    appliedJobs: {
      type: [Schema.Types.ObjectId],
      ref: "Job",
      default: [],
    },
    aiUsageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const usersModel = model<IUser>("User", usersSchema);
