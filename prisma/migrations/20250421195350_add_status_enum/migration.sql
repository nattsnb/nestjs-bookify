/*
  Warnings:

  - Added the required column `status` to the `VenueReservationUser` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusEnum" AS ENUM ('RESERVED', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "VenueReservationUser" ADD COLUMN     "status" "StatusEnum" NOT NULL;
