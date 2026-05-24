import type { IUserDocument } from "../modules/users/users.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }

    interface Locals {
      validated?: {
        body?: unknown;
        query?: unknown;
        params?: unknown;
      };
    }
  }
}

export {};
