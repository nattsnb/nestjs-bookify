import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateVenueDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  images: string[];

  @IsInt()
  @IsNotEmpty()
  pricePerNightInEURCent: number;

  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @IsInt()
  @IsNotEmpty()
  capacity: number;

  @IsInt()
  @IsNotEmpty()
  amountsOfBeds: number;

  @IsString()
  @IsNotEmpty()
  extraSleepingDetails: string;

  @IsInt()
  @IsNotEmpty()
  checkInHourPM: number;

  @IsInt()
  @IsNotEmpty()
  checkOutHourAM: number;

  @IsInt()
  @IsNotEmpty()
  distanceFromCityCenterInM: number;

  @IsString()
  @IsOptional()
  facebookUrl: string;

  @IsString()
  @IsOptional()
  instagramUrl: string;

  @IsString()
  @IsOptional()
  twitterUrl: string;

  @IsString()
  @IsOptional()
  websiteUrl: string;

  @IsString()
  @IsNotEmpty()
  streetNumber: string;

  @IsString()
  @IsNotEmpty()
  streetName: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsInt()
  @IsNotEmpty()
  ownerId: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  amenitiesIds?: number[];
}
