import { Amenity } from '@prisma/client';

export class CategoryDto {
  id: number;
  name: string;
  amenities: Amenity[];
}
