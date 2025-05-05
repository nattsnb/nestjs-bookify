import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVenueDto {
  @ApiProperty({ description: 'Name of the venue', example: 'Seaside Villa' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the venue',
    example: 'A beautiful villa near the beach with a private pool.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'List of image URLs',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  images: string[];

  @ApiProperty({ description: 'Price per night in EUR cents', example: 12000 })
  @IsInt()
  @IsNotEmpty()
  pricePerNightInEURCent: number;

  @ApiProperty({ description: 'Average rating of the venue', example: 4.8 })
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @ApiProperty({ description: 'Maximum guest capacity', example: 6 })
  @IsInt()
  @IsNotEmpty()
  capacity: number;

  @ApiProperty({ description: 'Number of beds', example: 3 })
  @IsInt()
  @IsNotEmpty()
  amountsOfBeds: number;

  @ApiProperty({
    description:
      'Details about additional sleeping arrangements (max 80 characters)',
    example: 'Sofa bed available for 1 adult.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80, {
    message: 'Extra sleeping details must be at most 80 characters long',
  })
  extraSleepingDetails: string;

  @ApiProperty({ description: 'Check-in hour in 24h format', example: 15 })
  @IsInt()
  @IsNotEmpty()
  checkInHour: number;

  @ApiProperty({ description: 'Check-out hour in 24h format', example: 11 })
  @IsInt()
  @IsNotEmpty()
  checkOutHour: number;

  @ApiProperty({
    description: 'Distance from city center in meters',
    example: 1500,
  })
  @IsInt()
  @IsNotEmpty()
  distanceFromCityCenterInMeters: number;

  @ApiPropertyOptional({
    description: 'Facebook page URL',
    example: 'https://facebook.com/seasidevilla',
  })
  @IsString()
  @IsOptional()
  facebookUrl?: string;

  @ApiPropertyOptional({
    description: 'Instagram profile URL',
    example: 'https://instagram.com/seasidevilla',
  })
  @IsString()
  @IsOptional()
  instagramUrl?: string;

  @ApiPropertyOptional({
    description: 'Twitter profile URL',
    example: 'https://twitter.com/seasidevilla',
  })
  @IsString()
  @IsOptional()
  twitterUrl?: string;

  @ApiPropertyOptional({
    description: 'Official website URL',
    example: 'https://seasidevilla.com',
  })
  @IsString()
  @IsOptional()
  websiteUrl?: string;

  @ApiProperty({ description: 'Street number of the venue', example: '25B' })
  @IsString()
  @IsNotEmpty()
  streetNumber: string;

  @ApiProperty({
    description: 'Street name of the venue',
    example: 'Ocean Drive',
  })
  @IsString()
  @IsNotEmpty()
  streetName: string;

  @ApiProperty({
    description: 'Postal code of the venue location',
    example: '10001',
  })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({
    description: 'City where the venue is located',
    example: 'Lisbon',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiPropertyOptional({
    description: 'IDs of associated amenities',
    example: [1, 3, 7],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  amenitiesIds?: number[];
}
