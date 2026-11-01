import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { destroyAllSessions, getCurrentUser } from "@/lib/session";

export async function POST(request: Request) {
  const admin = await getCurrentUser();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (admin.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let email = "";

  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const body = (await request.json()) as { email?: unknown };
      email = typeof body.email === "string" ? body.email : "";
    } else {
      const formData = await request.formData();
      const value = formData.get("email");
      email = typeof value === "string" ? value : "";
    }
  } catch {
    return NextResponse.json(
      { error: "Could not read the request body." },
      { status: 400 }
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return NextResponse.json(
      { error: "Email is required." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { bannedAt: new Date() },
  });
  await destroyAllSessions(user.id);

  return NextResponse.json({ ok: true });
}
