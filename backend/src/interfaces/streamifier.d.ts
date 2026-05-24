declare module "streamifier" {
  import type { Readable } from "node:stream";

  export function createReadStream(buffer: Buffer): Readable;
}
