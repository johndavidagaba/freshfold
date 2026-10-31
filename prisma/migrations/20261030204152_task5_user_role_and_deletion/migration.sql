-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bannedAt" TIMESTAMP(3),
ADD COLUMN     "deletionRequestedAt" TIMESTAMP(3),
ADD COLUMN     "purgeAfter" TIMESTAMP(3),
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'customer';
