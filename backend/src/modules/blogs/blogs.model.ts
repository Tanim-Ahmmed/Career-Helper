import { model, Schema } from "mongoose";

import { slugify } from "../../utils/slugify";
import type { IBlog } from "./blogs.interface";

const blogsSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      trim: true,
      default: "Career Growth",
    },
    tags: {
      type: [String],
      default: [],
    },
    authorName: {
      type: String,
      trim: true,
      default: "AI Career Helper Team",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    readTime: {
      type: String,
      trim: true,
      default: "5 min read",
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

blogsSchema.pre("validate", function setSlug(next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }

  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

export const blogsModel = model<IBlog>("Blog", blogsSchema);
