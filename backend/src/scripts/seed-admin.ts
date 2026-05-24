import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { connectToDatabase } from "../config/database";
import { getAdminSeedEnv } from "../config/env";
import { SALT_ROUNDS } from "../modules/auth/auth.constants";
import { usersModel } from "../modules/users/users.model";

async function seedAdmin() {
  const adminEnv = getAdminSeedEnv();
  const normalizedEmail = adminEnv.ADMIN_EMAIL.trim().toLowerCase();
  const normalizedUsername = adminEnv.ADMIN_USERNAME.trim().toLowerCase();
  const hashedPassword = await bcrypt.hash(adminEnv.ADMIN_PASSWORD, SALT_ROUNDS);

  const matches = await usersModel.find({
    $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
  });

  const uniqueIds = new Set(matches.map((user) => user._id.toString()));

  if (uniqueIds.size > 1) {
    throw new Error(
      "Admin seed conflict: ADMIN_EMAIL and ADMIN_USERNAME match different existing users.",
    );
  }

  const profession = adminEnv.ADMIN_PROFESSION || "Platform Admin";

  if (matches[0]) {
    const updatedAdmin = await usersModel
      .findByIdAndUpdate(
        matches[0]._id,
        {
          name: adminEnv.ADMIN_NAME.trim(),
          username: normalizedUsername,
          email: normalizedEmail,
          password: hashedPassword,
          profession,
          role: "admin",
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .select("name username email role profession");

    console.log(
      `Updated existing user to admin: ${updatedAdmin?.email} (${updatedAdmin?.username})`,
    );
    return;
  }

  const createdAdmin = await usersModel.create({
    name: adminEnv.ADMIN_NAME.trim(),
    username: normalizedUsername,
    email: normalizedEmail,
    password: hashedPassword,
    profession,
    role: "admin",
    skills: [],
    socialLinks: {},
  });

  console.log(`Created admin user: ${createdAdmin.email} (${createdAdmin.username})`);
}

async function main() {
  try {
    await connectToDatabase();
    await seedAdmin();
    console.log("Admin seed completed successfully.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown admin seed error.";
    console.error(`Admin seed failed: ${message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

void main();
