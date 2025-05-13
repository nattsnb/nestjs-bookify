/*
  Warnings:

  - You are about to drop the `_AmenityToVenue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AmenityToVenue" DROP CONSTRAINT "_AmenityToVenue_A_fkey";

-- DropForeignKey
ALTER TABLE "_AmenityToVenue" DROP CONSTRAINT "_AmenityToVenue_B_fkey";

-- DropTable
DROP TABLE "_AmenityToVenue";
