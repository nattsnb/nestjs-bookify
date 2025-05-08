/*
  Warnings:

  - You are about to drop the column `status` on the `Reservation` table. All the data in the column will be lost.
  - Added the required column `isActive` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "status",
ADD COLUMN     "isActive" BOOLEAN NOT NULL;

-- DropEnum
DROP TYPE "StatusEnum";
