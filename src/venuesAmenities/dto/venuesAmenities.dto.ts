export class VenuesAmenitiesDto {
  amenities: {
    id: number;
    name: string;
  }[];
  roomAmenities: {
    id: number;
    name: string;
  }[];
  handicapAccessibility: {
    id: number;
    name: string;
  }[];
  neighbourhoods: {
    id: number;
    name: string;
  }[];
  occasions: {
    id: number;
    name: string;
    requiredAmenities: number[];
    requiredRoomAmenities: number[];
    accessibility: number[];
    neighborhoods: number[];
  }[];
}
