import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsArray,
  IsInt,
  IsNumber,
  IsString,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class VenueFilterDto {
  @ApiPropertyOptional({
    description: 'Array of amenity IDs',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((id) => Number(id))
      : value.split(',').map((id: string) => Number(id)),
  )
  @IsInt({ each: true })
  amenities?: number[];

  @ApiPropertyOptional({
    description: 'Array of occasion IDs',
    example: [4, 5],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((id) => Number(id))
      : value.split(',').map((id: string) => Number(id)),
  )
  @IsInt({ each: true })
  occasions?: number[];

  @ApiPropertyOptional({
    description: 'Array of venue type IDs',
    example: [1, 2],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((id) => Number(id))
      : value.split(',').map((id: string) => Number(id)),
  )
  @IsInt({ each: true })
  venueTypes?: number[];

  @ApiPropertyOptional({
    description: 'Minimum price per night',
    example: 100,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  priceMin?: number;

  @ApiPropertyOptional({
    description: 'Maximum price per night',
    example: 500,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  priceMax?: number;

  @ApiPropertyOptional({
    description: 'Start date for reservation (YYYY-MM-DD)',
    example: '2025-07-01',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  dateStart?: string;

  @ApiPropertyOptional({
    description: 'End date for reservation (YYYY-MM-DD)',
    example: '2025-07-05',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  dateEnd?: string;

  @ApiPropertyOptional({
    description: 'Minimum number of guests',
    example: 4,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  guests?: number;

  @ApiPropertyOptional({
    description: 'City or locality to search around',
    example: 'Gdańsk',
    type: String,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Search radius in kilometers from the specified city',
    example: 10,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  radiusKm?: number;

  @ApiPropertyOptional({
    description: 'Latitude of reference point',
    example: 54.352,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Longitude of reference point',
    example: 18.6466,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  longitude?: number;
}
