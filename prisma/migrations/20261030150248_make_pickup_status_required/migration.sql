/*
  Warnings:

  - Made the column `status` on table `PickupRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PickupRequest" ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'requested';
