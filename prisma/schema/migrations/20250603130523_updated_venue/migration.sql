-- CreateEnum
CREATE TYPE "VenueType" AS ENUM ('HUT', 'HOUSE', 'LOFT', 'ROOM', 'STUDIO', 'CABIN', 'VILLA');

-- AlterTable
ALTER TABLE "Venue" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "type" "VenueType";
