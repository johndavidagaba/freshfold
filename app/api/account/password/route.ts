import { NextResponse } from "next/server";
import { z } from "zod";
import { getBreachCount } from "@/lib/breach";
import { hashPassword, verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { deleteOtherSessions, getCurrentUser } from "@/lib/session";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().trim().min(1),
    newPassword: z.string().trim().min(12).max(128),
  })
  .strict();

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const validation = changePasswordSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { errors: validation.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = validation.data;
  const breachCount = await getBreachCount(data.newPassword);

  if (breachCount !== null && breachCount > 0) {
    return NextResponse.json(
      {
        errors: {
          newPassword: [
            "This password has appeared in a data breach. Choose a different one.",
          ],
        },
      },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: { passwordHash: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentPasswordMatches = await verifyPassword(
    user.passwordHash,
    data.currentPassword
  );

  if (!currentPasswordMatches) {
    return NextResponse.json(
      {
        errors: {
          currentPassword: ["Your current password is incorrect."],
        },
      },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(data.newPassword);

  await prisma.user.update({
    where: { id: currentUser.id },
    data: { passwordHash },
  });

  const otherSessionsEnded = await deleteOtherSessions(currentUser.id);

  console.log(
    `[password] changed for ${currentUser.id}, ended ${otherSessionsEnded} other sessions`
  );

  return NextResponse.json({ ok: true, otherSessionsEnded });
}
