-- CreateTable
CREATE TABLE "VenuesAmenities" (
    "id" SERIAL NOT NULL,
    "amenities" JSONB NOT NULL,
    "roomAmenities" JSONB NOT NULL,
    "handicapAccessibility" JSONB NOT NULL,
    "neighbourhoods" JSONB NOT NULL,
    "occasions" JSONB NOT NULL,

    CONSTRAINT "VenuesAmenities_pkey" PRIMARY KEY ("id")
);
