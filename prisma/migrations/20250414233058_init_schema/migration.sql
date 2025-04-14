-- CreateTable
CREATE TABLE "Venue" (
    "id" SERIAL NOT NULL,
    "locationId" INTEGER,
    "pricePerNightInEURCent" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "reviews" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "images" JSONB NOT NULL,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "streetNumber" INTEGER NOT NULL,
    "streetName" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueDetails" (
    "id" SERIAL NOT NULL,
    "venuesBasicDataId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "activeFiltersAndOccasions" JSONB NOT NULL,
    "sleepingDetails" JSONB NOT NULL,
    "checkInHourPM" INTEGER NOT NULL,
    "checkOutHourAM" INTEGER NOT NULL,
    "distanceFromCityCenterInKM" DOUBLE PRECISION NOT NULL,
    "contactDetails" JSONB NOT NULL,
    "socialMediaLinks" JSONB NOT NULL,

    CONSTRAINT "VenueDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Venue_locationId_key" ON "Venue"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "VenueDetails_venuesBasicDataId_key" ON "VenueDetails"("venuesBasicDataId");

-- AddForeignKey
ALTER TABLE "Venue" ADD CONSTRAINT "Venue_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueDetails" ADD CONSTRAINT "VenueDetails_venuesBasicDataId_fkey" FOREIGN KEY ("venuesBasicDataId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
