import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { getClientIp, limit } from "@/lib/rateLimit";
import { loginSchema } from "@/lib/validation";

const WINDOW_MS = 15 * 60 * 1000;
const DUMMY_PASSWORD_HASH =
  "$argon2id$v=19$m=19456,t=2,p=1$/Q7XOOsKyiVr3q+6NEnxNQ$favzEhljVIma8W+UZJTNBawuWyXPctwWlcvwYdJc+F8";

function tooManyAttempts(retryAfterSeconds: number) {
  const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));

  return NextResponse.json(
    { error: `Too many attempts. Try again in ${minutes} minutes.` },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSeconds) },
    }
  );
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const ipRateLimit = await limit(`login:${ip}`, 10, WINDOW_MS);

  if (!ipRateLimit.allowed) {
    return tooManyAttempts(ipRateLimit.retryAfterSeconds);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const emailForKey =
    typeof body === "object" &&
    body !== null &&
    typeof (body as { email?: unknown }).email === "string"
      ? (body as { email: string }).email.trim().toLowerCase()
      : "";
  const emailRateLimit = await limit(
    `login-email:${emailForKey}`,
    5,
    WINDOW_MS
  );

  if (!emailRateLimit.allowed) {
    return tooManyAttempts(emailRateLimit.retryAfterSeconds);
  }

  const validation = loginSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { errors: validation.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = validation.data;
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });
  const passwordHash = user?.passwordHash ?? DUMMY_PASSWORD_HASH;
  const passwordMatches = await verifyPassword(passwordHash, data.password);

  if (!user || !passwordMatches) {
    return NextResponse.json(
      { error: "Email or password is incorrect." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    ok: true,
    verified: user.emailVerifiedAt !== null,
  });
}
