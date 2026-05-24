import mongoose from "mongoose";

const connectionStates = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
} as const;

export function getDatabaseStatus() {
  return connectionStates[mongoose.connection.readyState as 0 | 1 | 2 | 3] ?? "unknown";
}
