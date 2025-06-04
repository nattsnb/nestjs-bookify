import { AmenityDto } from '../../amenity/dto/amenity.dto';
import { ReservationDto } from '../../reservation/dto/reservation.dto';
import { FavouriteDto } from '../../favourite/dto/favourite.dto';
import { VenueTypeDto } from '../../venue-type/dto/venue-type.dto';

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
  checkInHour: number;
  checkOutHour: number;
  distanceFromCityCenterInMeters: number;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  streetNumber: string;
  streetName: string;
  postalCode: string;
  city: string;
  latitude: number;
  longitude: number;
  ownerId: number;
  amenities?: AmenityDto[];
  reservations?: ReservationDto[];
  favourites?: FavouriteDto[];
  venueType: VenueTypeDto;
}
