import jwt, { type SignOptions } from "jsonwebtoken";

import type { JwtPayload } from "../modules/auth/auth.interface";

export function signToken(
  payload: JwtPayload,
  secret: string,
  expiresIn: SignOptions["expiresIn"],
) {
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyToken(token: string, secret: string) {
  return jwt.verify(token, secret) as JwtPayload;
}
