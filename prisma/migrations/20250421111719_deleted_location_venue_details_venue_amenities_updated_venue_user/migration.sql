/*
  Warnings:

  - You are about to drop the column `locationId` on the `Venue` table. All the data in the column will be lost.
  - You are about to drop the column `reviews` on the `Venue` table. All the data in the column will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VenueDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VenuesAmenities` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `amountsOfBeds` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkInHourPM` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkOutHourAM` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distanceFromCityCenterInM` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extraSleepingDetails` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facebookUrl` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instagramUrl` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streetName` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streetNumber` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `twitterUrl` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `websiteUrl` to the `Venue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Venue" DROP CONSTRAINT "Venue_locationId_fkey";

-- DropForeignKey
ALTER TABLE "VenueDetails" DROP CONSTRAINT "VenueDetails_venuesBasicDataId_fkey";

-- DropIndex
DROP INDEX "Venue_locationId_key";

-- AlterTable
ALTER TABLE "Venue" DROP COLUMN "locationId",
DROP COLUMN "reviews",
ADD COLUMN     "amountsOfBeds" INTEGER NOT NULL,
ADD COLUMN     "checkInHourPM" INTEGER NOT NULL,
ADD COLUMN     "checkOutHourAM" INTEGER NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "distanceFromCityCenterInM" INTEGER NOT NULL,
ADD COLUMN     "extraSleepingDetails" TEXT NOT NULL,
ADD COLUMN     "facebookUrl" TEXT NOT NULL,
ADD COLUMN     "instagramUrl" TEXT NOT NULL,
ADD COLUMN     "ownerId" INTEGER NOT NULL,
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "streetName" TEXT NOT NULL,
ADD COLUMN     "streetNumber" TEXT NOT NULL,
ADD COLUMN     "twitterUrl" TEXT NOT NULL,
ADD COLUMN     "websiteUrl" TEXT NOT NULL;

-- DropTable
DROP TABLE "Location";

-- DropTable
DROP TABLE "VenueDetails";

-- DropTable
DROP TABLE "VenuesAmenities";

-- AddForeignKey
ALTER TABLE "Venue" ADD CONSTRAINT "Venue_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
