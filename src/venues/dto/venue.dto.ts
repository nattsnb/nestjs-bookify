import { LocationDto } from './location.dto';

export class VenueDto {
  id: number;
  location: LocationDto;
  pricePerNightInEURCent: number;
  rating: number;
  reviews: number;
  capacity: number;
  name: string;
  images: string[];
}
