import { NextResponse } from "next/server";
import { getClientIp, limit } from "@/lib/rateLimit";
import { resetSchema } from "@/lib/validation";

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
  const ip = getClientIp(request);
  const rateLimit = await limit(`reset:${ip}`, 3, WINDOW_MS);

  if (!rateLimit.allowed) {
    return tooManyAttempts(rateLimit.retryAfterSeconds);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const validation = resetSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { errors: validation.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "If an account uses that email, we've sent a reset link.",
  });
}
