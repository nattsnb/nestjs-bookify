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

export class CreateVenueDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

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
}
