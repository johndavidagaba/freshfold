import { createHash, randomInt } from "node:crypto";
import { prisma } from "@/lib/prisma";

export type VerifyCodeResult =
  | { status: 200 }
  | { status: 400 | 410 | 429; error: string };

function hashCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

export async function createCode(userId: string): Promise<string> {
  const code = String(randomInt(0, 1000000)).padStart(6, "0");
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.verificationCode.create({
    data: {
      userId,
      codeHash: hashCode(code),
      expiresAt,
    },
  });

  return code;
}

export async function verifyCode(
  email: string,
  code: string
): Promise<VerifyCodeResult> {
  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

  if (!user) {
    return { status: 400, error: "Invalid code." };
  }

  const verificationCode = await prisma.verificationCode.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  if (!verificationCode) {
    return { status: 400, error: "Invalid code." };
  }

  if (verificationCode.expiresAt <= new Date()) {
    return { status: 410, error: "This code has expired. Request a new one." };
  }

  if (verificationCode.attempts >= 5) {
    return {
      status: 429,
      error: "Too many wrong codes. Request a new one.",
    };
  }

  if (hashCode(code) !== verificationCode.codeHash) {
    await prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: { attempts: { increment: 1 } },
    });

    return { status: 400, error: "Invalid code." };
  }

  const now = new Date();

  await prisma.$transaction([
    prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: { usedAt: now },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { emailVerifiedAt: now },
    }),
  ]);

  return { status: 200 };
}
