import { after, NextResponse } from "next/server";
import { getBreachCount } from "@/lib/breach";
import { sendVerificationEmail } from "@/lib/mailer";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { getClientIp, limit } from "@/lib/rateLimit";
import { signupSchema } from "@/lib/validation";
import { createCode } from "@/lib/verification";

const WINDOW_MS = 15 * 60 * 1000;

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
  const totalStart = performance.now();
  const ip = getClientIp(request);
  const rateLimit = await limit(`signup:${ip}`, 5, WINDOW_MS);

  if (!rateLimit.allowed) {
    return tooManyAttempts(rateLimit.retryAfterSeconds);
  }

  let body: unknown;
  const parseStart = performance.now();

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parseMs = performance.now() - parseStart;
  const validateStart = performance.now();
  const validation = signupSchema.safeParse(body);
  const validateMs = performance.now() - validateStart;

  if (!validation.success) {
    return NextResponse.json(
      { errors: validation.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = validation.data;
  const breachStart = performance.now();
  const breachCount = await getBreachCount(data.password);
  const breachMs = performance.now() - breachStart;

  if (breachCount !== null && breachCount > 0) {
    return NextResponse.json(
      {
        errors: {
          password: [
            "This password has appeared in a data breach. Choose a different one.",
          ],
        },
      },
      { status: 400 }
    );
  }

  const hashStart = performance.now();
  const passwordHash = await hashPassword(data.password);
  const hashMs = performance.now() - hashStart;

  const dbStart = performance.now();
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    return NextResponse.json(
      { error: "An account with that email already exists." },
      { status: 409 }
    );
  }

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash,
      termsAcceptedAt: new Date(),
    },
  });
  const verificationCode = await createCode(user.id);
  const dbMs = performance.now() - dbStart;
  const emailMode =
    process.env.EMAIL_MODE === "sync" ? "sync" : "background";
  const emailStart = performance.now();

  if (emailMode === "sync") {
    await sendVerificationEmail(user.email, user.name, verificationCode);
  } else {
    after(async () => {
      try {
        await sendVerificationEmail(user.email, user.name, verificationCode);
      } catch (error) {
        console.error("[signup] background verification email failed", error);
      }
    });
  }

  const emailMs = performance.now() - emailStart;
  const totalMs = performance.now() - totalStart;

  console.log(
    `[signup] parse ${Math.round(parseMs)}ms validate ${Math.round(
      validateMs
    )}ms breach ${Math.round(breachMs)}ms hash ${Math.round(
      hashMs
    )}ms db ${Math.round(dbMs)}ms email ${Math.round(emailMs)}ms (${emailMode}) total ${Math.round(
      totalMs
    )}ms`
  );

  return NextResponse.json(
    { id: user.id, email: user.email },
    { status: 201 }
  );
}
