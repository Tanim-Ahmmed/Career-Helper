import type { Server } from "node:http";

import mongoose from "mongoose";

import app from "./app";
import { connectToDatabase } from "./config/database";
import { env } from "./config/env";

let server: Server | undefined;

async function bootstrap() {
  await connectToDatabase();

  server = app.listen(env.PORT, () => {
    console.log(
      `Backend server running on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`,
    );
  });
}

async function shutdown(signal: string) {
  console.log(`${signal} received. Shutting down AI Career Helper API...`);

  if (server) {
    await new Promise<void>((resolve, reject) => {
      server?.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  await mongoose.connection.close();
  process.exit(0);
}

bootstrap().catch((error: unknown) => {
  console.error("Failed to bootstrap backend server.", error);
  process.exit(1);
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
