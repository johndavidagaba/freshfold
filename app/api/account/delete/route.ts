import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  clearSessionCookie,
  destroyAllSessions,
  getCurrentUser,
} from "@/lib/session";

const PURGE_DELAY_MS = 30 * 24 * 60 * 60 * 1000;

export async function POST() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const purgeAfter = new Date(now.getTime() + PURGE_DELAY_MS);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      deletionRequestedAt: now,
      purgeAfter,
    },
  });

  await destroyAllSessions(user.id);
  await clearSessionCookie();

  return NextResponse.json({ ok: true, purgeAfter });
}
