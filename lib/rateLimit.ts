import { prisma } from "@/lib/prisma";

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (!forwardedFor) return "unknown";

  const first = forwardedFor.split(",")[0]?.trim();

  return first || "unknown";
}

export async function limit(
  key: string,
  max: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = new Date();
  const current = await prisma.rateLimit.findUnique({ where: { key } });

  if (!current) {
    await prisma.rateLimit.create({
      data: { key, count: 1, windowStart: now },
    });

    return { allowed: true, retryAfterSeconds: 0 };
  }

  const elapsedMs = now.getTime() - current.windowStart.getTime();

  if (elapsedMs >= windowMs) {
    await prisma.rateLimit.update({
      where: { key },
      data: { count: 1, windowStart: now },
    });

    return { allowed: true, retryAfterSeconds: 0 };
  }

  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((windowMs - elapsedMs) / 1000)
  );

  if (current.count >= max) {
    return { allowed: false, retryAfterSeconds };
  }

  await prisma.rateLimit.update({
    where: { key },
    data: { count: { increment: 1 } },
  });

  return { allowed: true, retryAfterSeconds: 0 };
}
