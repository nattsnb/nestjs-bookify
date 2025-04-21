-- CreateTable
CREATE TABLE "VenueRatingUser" (
    "id" SERIAL NOT NULL,
    "venueId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "review" TEXT,

    CONSTRAINT "VenueRatingUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueReservationUser" (
    "id" SERIAL NOT NULL,
    "venueId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "dateStart" TIMESTAMP(3) NOT NULL,
    "dateEnd" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueReservationUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueFavouriteUser" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "venueId" INTEGER NOT NULL,

    CONSTRAINT "VenueFavouriteUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VenueFavouriteUser_userId_venueId_key" ON "VenueFavouriteUser"("userId", "venueId");

-- AddForeignKey
ALTER TABLE "VenueRatingUser" ADD CONSTRAINT "VenueRatingUser_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueRatingUser" ADD CONSTRAINT "VenueRatingUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueReservationUser" ADD CONSTRAINT "VenueReservationUser_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueReservationUser" ADD CONSTRAINT "VenueReservationUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueFavouriteUser" ADD CONSTRAINT "VenueFavouriteUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueFavouriteUser" ADD CONSTRAINT "VenueFavouriteUser_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
