import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from './location.dto';
import { VenueDetailsDto } from '../../venuesDetails/dto/venuesDetails.dto';

export class CreateVenueDto {
  @Type(() => LocationDto)
  @IsObject()
  @ValidateNested()
  location?: LocationDto;

  @IsNumber()
  @IsNotEmpty()
  pricePerNightInEURCent: number;

  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @IsNumber()
  @IsNotEmpty()
  reviews: number;

  @IsNumber()
  @IsNotEmpty()
  capacity: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  images: string[];

  @ValidateNested()
  @Type(() => VenueDetailsDto)
  venueDetails: VenueDetailsDto;
}
