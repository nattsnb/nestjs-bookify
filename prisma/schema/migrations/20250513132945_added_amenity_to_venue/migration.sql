-- CreateTable
CREATE TABLE "AmenityToVenue" (
    "venueId" INTEGER NOT NULL,
    "amenityId" INTEGER NOT NULL,

    CONSTRAINT "AmenityToVenue_pkey" PRIMARY KEY ("venueId","amenityId")
);

-- AddForeignKey
ALTER TABLE "AmenityToVenue" ADD CONSTRAINT "AmenityToVenue_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmenityToVenue" ADD CONSTRAINT "AmenityToVenue_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "Amenity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
