import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getNow() {
  const argument = process.argv.find((value) => value.startsWith("--now="));

  if (!argument) return new Date();

  const value = argument.slice("--now=".length);
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    console.error(`[purge] invalid --now value: ${value}`);
    process.exit(1);
  }

  return date;
}

async function main() {
  const now = getNow();
  const users = await prisma.user.findMany({
    where: {
      purgeAfter: { lte: now },
      email: { not: { endsWith: "@invalid" } },
    },
    select: { id: true },
  });

  for (const user of users) {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          name: "Deleted user",
          email: `deleted-${user.id}@invalid`,
          phone: null,
          passwordHash: "",
        },
      }),
      prisma.verificationCode.deleteMany({
        where: { userId: user.id },
      }),
    ]);
  }

  console.log(`[purge] anonymised ${users.length} users`);

  for (const user of users) {
    console.log(user.id);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
