import { hash, verify } from "@node-rs/argon2";

const ARGON2ID_ALGORITHM = 2;

export function hashPassword(password: string): Promise<string> {
  return hash(password, { algorithm: ARGON2ID_ALGORITHM });
}

export function verifyPassword(
  passwordHash: string,
  password: string
): Promise<boolean> {
  return verify(passwordHash, password);
}
