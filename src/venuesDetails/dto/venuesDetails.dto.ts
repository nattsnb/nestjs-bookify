import { VenueDto } from '../../venues/dto/venue.dto';

export class VenueDetailsDto {
  id: number;
  venuesBasicData: VenueDto;
  description: string;
  activeFiltersAndOccasions: {
    activeFilters: {
      activeAmenities: number[];
      activeRoomAmenities: number[];
      activeHandicapAccessibility: number[];
      activeNeighbourhoods: number[];
    };
    suitableOccasions: number[];
  };
  sleepingDetails: {
    maxCapacity: number;
    amountOfBeds: number;
    extraDetails: string;
  };
  checkInHourPM: number;
  checkOutHourAM: number;
  distanceFromCityCenterInKM: number;
  contactDetails: {
    phone: string;
    email: string;
  };
  socialMediaLinks: {
    fb: string;
    instagram: string;
    twitter: string;
    website: string;
  };
}
