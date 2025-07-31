import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVenueDetailsDto {
  @ApiPropertyOptional({
    description: 'Name of the venue',
    example: 'Seaside Villa',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Description of the venue',
    example: 'A beautiful villa near the beach with a private pool.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'List of image URLs',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({
    description: 'Price per night in EUR cents',
    example: 12000,
  })
  @IsOptional()
  @IsInt()
  pricePerNightInEURCent?: number;

  @ApiPropertyOptional({
    description: 'Average rating of the venue',
    example: 4.8,
  })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiPropertyOptional({ description: 'Maximum guest capacity', example: 6 })
  @IsOptional()
  @IsInt()
  capacity?: number;

  @ApiPropertyOptional({ description: 'Number of beds', example: 3 })
  @IsOptional()
  @IsInt()
  amountsOfBeds?: number;

  @ApiPropertyOptional({
    description:
      'Details about additional sleeping arrangements (max 80 characters)',
    example: 'Sofa bed available for 1 adult.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(80, {
    message: 'Extra sleeping details must be at most 80 characters long',
  })
  extraSleepingDetails?: string;

  @ApiPropertyOptional({
    description: 'Check-in hour in 24h format',
    example: 15,
  })
  @IsOptional()
  @IsInt()
  checkInHour?: number;

  @ApiPropertyOptional({
    description: 'Check-out hour in 24h format',
    example: 11,
  })
  @IsOptional()
  @IsInt()
  checkOutHour?: number;

  @ApiPropertyOptional({
    description: 'Distance from city center in meters',
    example: 1500,
  })
  @IsOptional()
  @IsInt()
  distanceFromCityCenterInMeters?: number;

  @ApiPropertyOptional({
    description: 'Facebook page URL',
    example: 'https://facebook.com/seasidevilla',
  })
  @IsOptional()
  @IsString()
  facebookUrl?: string;

  @ApiPropertyOptional({
    description: 'Instagram profile URL',
    example: 'https://instagram.com/seasidevilla',
  })
  @IsOptional()
  @IsString()
  instagramUrl?: string;

  @ApiPropertyOptional({
    description: 'Twitter profile URL',
    example: 'https://twitter.com/seasidevilla',
  })
  @IsOptional()
  @IsString()
  twitterUrl?: string;

  @ApiPropertyOptional({
    description: 'Official website URL',
    example: 'https://seasidevilla.com',
  })
  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @ApiPropertyOptional({
    description: 'ID of the venue type',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  venueTypeId?: number;
}
