export class VenueDto {
  id: number;
  name: string;
  description: string;
  images: string[];
  pricePerNightInEURCent: number;
  rating: number;
  capacity: number;
  amountsOfBeds: number;
  extraSleepingDetails: string;
  checkInHourPM: number;
  checkOutHourAM: number;
  distanceFromCityCenterInM: number;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  websiteUrl: string;
  streetNumber: string;
  streetName: string;
  postalCode: string;
  city: string;
  ownerId: number;
}
