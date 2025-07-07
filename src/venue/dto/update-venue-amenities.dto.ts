import { IsArray, IsInt, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVenueAmenitiesDto {
  @ApiPropertyOptional({
    description: 'IDs of associated amenities',
    example: [1, 3, 7],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  amenitiesIds?: number[];
}
