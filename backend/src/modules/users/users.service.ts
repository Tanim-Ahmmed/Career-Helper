import { applicationsModel } from "../applications/applications.model";
import { blogsModel } from "../blogs/blogs.model";
import { jobsModel } from "../jobs/jobs.model";
import { usersModel } from "./users.model";
import { AppError } from "../../utils/app-error";
import type { IUserDocument } from "./users.interface";

function serializeUser(user: IUserDocument) {
  return {
    id: user._id.toString(),
    name: user.name,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    userProfile: {
      bio: user.userProfile?.bio,
      profession: user.userProfile?.profession,
      skills: user.userProfile?.skills,
      experienceLevel: user.userProfile?.experienceLevel,
      resumeUrl: user.userProfile?.resumeUrl,
      socialLinks: user.userProfile?.socialLinks,
      savedJobs: user.userProfile?.savedJobs.map((jobId) => jobId.toString()),
      appliedJobs: user.userProfile?.appliedJobs.map((jobId) => jobId.toString()),
    },
    recruiterProfile:{
      companyName: user.recruiterProfile?.companyName,
      companyLogo: user.recruiterProfile?.companyLogo,
      companyWebsite: user.recruiterProfile?.companyWebsite,
      companyLocation: user.recruiterProfile?.companyLocation,
    
      companySize: user.recruiterProfile?.companySize,
      industry: user.recruiterProfile?.industry,
      designation: user.recruiterProfile?.designation,
      companyDescription: user.recruiterProfile?.companyDescription,
      foundedYear: user.recruiterProfile?.foundedYear,
      phone: user.recruiterProfile?.phone,
      isVerified: user.recruiterProfile?.isVerified,
      hiringStatus:user.recruiterProfile?.hiringStatus,
      isComplete: user.recruiterProfile?.isComplete,
    },
    role: user.role,
    aiUsageCount: user.aiUsageCount,
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
  };
}

function calculateProfileCompletion(user: IUserDocument) {
  const checkpoints = [
    user.avatar,
    user.userProfile?.bio,
    user.userProfile?.profession,
    user.userProfile?.experienceLevel,
    user.userProfile?.resumeUrl,
    user.userProfile?.skills ? "skills" : "",
    Object.values(user.userProfile?.socialLinks ?? {}).some(Boolean) ? "social" : "",
  ];

  const completedCount = checkpoints.filter(Boolean).length;
  return Math.round((completedCount / checkpoints.length) * 100);
}

async function updateProfile(userId: string, payload: Partial<IUserDocument>) {
  if (payload.username) {
    const existingUser = await usersModel.findOne({
      username: payload.username.toLowerCase(),
      _id: { $ne: userId },
    });

    if (existingUser) {
      throw new AppError("That username is already taken.", 409);
    }
  }

  const updatedUser = await usersModel
    .findByIdAndUpdate(
      userId,
      {
        ...payload,
        username: payload.username?.toLowerCase(),
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .select("-password");

  if (!updatedUser) {
    throw new AppError("User not found.", 404);
  }

  return serializeUser(updatedUser);
}

async function getUserDashboard(user: IUserDocument) {
  const [applications, savedJobs, recommendedJobs] = await Promise.all([
    applicationsModel
      .find({ userId: user._id })
      .populate("jobId", "title slug company location workplaceType employmentType applicationDeadline")
      .sort({ updatedAt: -1 })
      .limit(5),
    jobsModel
      .find({
        _id: { $in: user?.userProfile?.savedJobs },
      })
      .sort({ updatedAt: -1 })
      .limit(4),
    jobsModel
      .find({
        status: "published",
        $or: [{ featured: true }, { category: { $in: user?.userProfile?.skills.slice(0, 3) } }],
      })
      .sort({ featured: -1, createdAt: -1 })
      .limit(4),
  ]);

  return {
    stats: {
      savedJobs: user?.userProfile?.savedJobs.length,
      appliedJobs: user?.userProfile?.appliedJobs.length,
      aiUsageCount: user.aiUsageCount,
      profileCompletion: calculateProfileCompletion(user),
    },
    profile: serializeUser(user),
    recentApplications: applications,
    savedJobs,
    recommendedJobs,
  };
}

async function getAdminDashboard() {
  const [totalUsers, totalAdmins, totalJobs, publishedJobs, totalApplications, totalBlogs, recentUsers] =
    await Promise.all([
      usersModel.countDocuments(),
      usersModel.countDocuments({ role: "admin" }),
      jobsModel.countDocuments(),
      jobsModel.countDocuments({ status: "published" }),
      applicationsModel.countDocuments(),
      blogsModel.countDocuments(),
      usersModel.find().select("-password").sort({ createdAt: -1 }).limit(6),
    ]);

  const [draftJobs, featuredJobs, draftBlogs, publishedBlogs] = await Promise.all([
    jobsModel.countDocuments({ status: "draft" }),
    jobsModel.countDocuments({ featured: true }),
    blogsModel.countDocuments({ status: "draft" }),
    blogsModel.countDocuments({ status: "published" }),
  ]);

  return {
    stats: {
      totalUsers,
      totalAdmins,
      totalJobs,
      publishedJobs,
      draftJobs,
      featuredJobs,
      totalApplications,
      totalBlogs,
      draftBlogs,
      publishedBlogs,
    },
    recentUsers: recentUsers.map(serializeUser),
  };
}

async function getAdminUsers() {
  const users = await usersModel.find().select("-password").sort({ createdAt: -1 });
  return users.map(serializeUser);
}

async function saveJob(userId: string, jobId: string) {
  const job = await jobsModel.findById(jobId);

  if (!job || job.status !== "published") {
    throw new AppError("This job is not available to save.", 404);
  }

  const updatedUser = await usersModel
    .findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          savedJobs: job._id,
        },
      },
      {
        new: true,
      },
    )
    .select("-password");

  if (!updatedUser) {
    throw new AppError("User not found.", 404);
  }

  return serializeUser(updatedUser);
}

async function unsaveJob(userId: string, jobId: string) {
  const updatedUser = await usersModel
    .findByIdAndUpdate(
      userId,
      {
        $pull: {
          savedJobs: jobId,
        },
      },
      {
        new: true,
      },
    )
    .select("-password");

  if (!updatedUser) {
    throw new AppError("User not found.", 404);
  }

  return serializeUser(updatedUser);
}

export const usersService = {
  getStatus() {
    return {
      module: "users",
      ready: true,
      features: ["profile", "user-dashboard", "admin-dashboard"],
    };
  },
  getProfile(user: IUserDocument) {
    return serializeUser(user);
  },
  updateProfile,
  getUserDashboard,
  getAdminDashboard,
  getAdminUsers,
  saveJob,
  unsaveJob,
};
