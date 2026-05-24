import dotenv from "dotenv";

dotenv.config();

type NodeEnvironment = "development" | "production" | "test";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getNodeEnvironment(value: string | undefined): NodeEnvironment {
  if (value === "production" || value === "test") {
    return value;
  }

  return "development";
}

export const env = {
  get PORT() {
    return Number(process.env.PORT || 5000);
  },
  get NODE_ENV() {
    return getNodeEnvironment(process.env.NODE_ENV);
  },
  get CLIENT_URL() {
    return getRequiredEnv("CLIENT_URL");
  },
  get MONGODB_URI() {
    return getRequiredEnv("MONGODB_URI");
  },
  get ACCESS_TOKEN_SECRET() {
    return getRequiredEnv("ACCESS_TOKEN_SECRET");
  },
  get ACCESS_TOKEN_EXPIRES_IN() {
    return getRequiredEnv("ACCESS_TOKEN_EXPIRES_IN");
  },
  get CLOUDINARY_CLOUD_NAME() {
    return getRequiredEnv("CLOUDINARY_CLOUD_NAME");
  },
  get CLOUDINARY_API_KEY() {
    return getRequiredEnv("CLOUDINARY_API_KEY");
  },
  get CLOUDINARY_API_SECRET() {
    return getRequiredEnv("CLOUDINARY_API_SECRET");
  },
  get GEMINI_API_KEY() {
    return getRequiredEnv("GEMINI_API_KEY");
  },
} as const;

export function getAdminSeedEnv() {
  return {
    ADMIN_NAME: getRequiredEnv("ADMIN_NAME"),
    ADMIN_USERNAME: getRequiredEnv("ADMIN_USERNAME"),
    ADMIN_EMAIL: getRequiredEnv("ADMIN_EMAIL"),
    ADMIN_PASSWORD: getRequiredEnv("ADMIN_PASSWORD"),
    ADMIN_PROFESSION: process.env.ADMIN_PROFESSION?.trim() || "",
  };
}
