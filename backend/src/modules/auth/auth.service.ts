import bcrypt from "bcryptjs";

import { usersModel } from "../users/users.model";
import { env } from "../../config/env";
import { AppError } from "../../utils/app-error";
import { signToken } from "../../utils/jwt";
import { SALT_ROUNDS } from "./auth.constants";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  SafeUserDocument,
} from "./auth.interface";
import type { SignOptions } from "jsonwebtoken";

function serializeUser(user: SafeUserDocument) {
  return {
    id: user._id.toString(),
    name: user.name,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    aiUsageCount: user.aiUsageCount,
    savedJobs: user.userProfile?.savedJobs.map((jobId) => jobId.toString()),
    appliedJobs: user.userProfile?.appliedJobs.map((jobId) => jobId.toString()),
  };
}

function buildAuthResponse(user: SafeUserDocument): AuthResponse {
  const token = signToken(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    env.ACCESS_TOKEN_SECRET,
    env.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
  );

  return {
    token,
    user: serializeUser(user),
  };
}

async function register(payload: RegisterPayload) {
  const existingUser = await usersModel.findOne({
    $or: [{ email: payload.email.toLowerCase() }, { username: payload.username.toLowerCase() }],
  });

  if (existingUser) {
    throw new AppError("A user with this email or username already exists.", 409);
  }

  const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);

  const user = await usersModel.create({
    ...payload,
    email: payload.email.toLowerCase(),
    username: payload.username.toLowerCase(),
    password: hashedPassword,
    skills: payload.skills ?? [],
    socialLinks: payload.socialLinks ?? {},
  });

  const safeUser = await usersModel.findById(user._id).select("-password");

  if (!safeUser) {
    throw new AppError("Failed to load registered user.", 500);
  }

  return buildAuthResponse(safeUser);
}

async function login(payload: LoginPayload) {
  const user = await usersModel.findOne({
    email: payload.email.toLowerCase(),
  });

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password.", 401);
  }

  const safeUser = await usersModel.findById(user._id).select("-password");

  if (!safeUser) {
    throw new AppError("Failed to load authenticated user.", 500);
  }

  return buildAuthResponse(safeUser);
}

async function googleLogin(payload: {
  email: string;
  name: string;
  avatar?: string;
}) {
  const email = payload.email.toLowerCase();

  let user = await usersModel.findOne({ email });

  if (!user) {
    const baseUsername = email.split("@")[0];

    const existingUsername = await usersModel.findOne({
      username: baseUsername,
    });

    const username = existingUsername
      ? `${baseUsername}_${Date.now()}`
      : baseUsername;

    user = await usersModel.create({
      name: payload.name,
      email,
      avatar: payload.avatar ?? "",
      username,
      password: crypto.randomUUID(),
      provider: "google",
      role: "user",
      skills: [],
      socialLinks: {},
    });
  }

  const safeUser = await usersModel.findById(user._id).select("-password");

  if (!safeUser) {
    throw new AppError("Failed to load Google user.", 500);
  }

  return buildAuthResponse(safeUser);
}

function logout() {
  return {
    success: true,
    message: "Logout successful. Remove the token from the client to complete sign-out.",
  };
}

function getCurrentUser(user: SafeUserDocument) {
  return serializeUser(user);
}

async function updateCurrentUser(user: SafeUserDocument, data:SafeUserDocument) {
  await usersModel.findByIdAndUpdate(user.id, data,{new:true})
  return serializeUser(user);
}

function getStatus() {
  return {
    module: "auth",
    ready: true,
    features: ["register", "login", "logout", "protected-routes", "role-based-authorization"],
  };
}

export const authService = {
  register,
  login,
  googleLogin,
  logout,
  getCurrentUser,
  updateCurrentUser,
  getStatus,
};
