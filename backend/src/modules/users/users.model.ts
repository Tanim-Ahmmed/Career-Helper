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

const userProfileSchema = new Schema(
  {
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
    isComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
    versionKey: false,
  },
);

const recruiterProfileSchema = new Schema(
  {
    companyName: {
      type: String,
      trim: true,
      default: "",
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

    companyLocation: {
      type: String,
      trim: true,
      default: "",
    },

    companySize: {
      type: String,
      enum: [
        "1-10",
        "11-50",
        "51-200",
        "201-500",
        "500+",
      ],
      default: "1-10",
    },

    industry: {
      type: String,
      trim: true,
      default: "",
    },

    designation: {
      type: String,
      trim: true,
      default: "",
    },

    companyDescription: {
      type: String,
      trim: true,
      default: "",
    },

    foundedYear: {
      type: Number,
      default: null,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    hiringStatus: {
      type: String,
      enum: ["actively_hiring", "occasionally_hiring", "not_hiring"],
      default: "actively_hiring",
    },

    isComplete: {
      type: Boolean,
      default: false,
    },
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
    
    role: {
      type: String,
      enum: ["admin", "user", "recruiter"],
      default: "user",
    },

    userProfile: {
      type: userProfileSchema,
      default: () => ({}),
    },

    recruiterProfile: {
      type: recruiterProfileSchema,
      default: () => ({}),
    },
    
    aiUsageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const usersModel = model<IUser>("User", usersSchema);
