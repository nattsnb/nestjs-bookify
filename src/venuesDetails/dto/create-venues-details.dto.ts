import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VenueDto } from '../../venues/dto/venue.dto';

export class CreateVenueDetailsDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @Type(() => VenueDto)
  @IsObject()
  @ValidateNested()
  venuesBasicData: VenueDto;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsNumber({}, { each: true })
  activeAmenities: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  activeRoomAmenities: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  activeHandicapAccessibility: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  activeNeighbourhoods: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  suitableOccasions: number[];

  @IsNumber()
  @IsNotEmpty()
  maxCapacity: number;

  @IsNumber()
  @IsNotEmpty()
  amountOfBeds: number;

  @IsString()
  @IsNotEmpty()
  extraDetails: string;

  @IsNumber()
  @IsNotEmpty()
  checkInHourPM: number;

  @IsNumber()
  @IsNotEmpty()
  checkOutHourAM: number;

  @IsNumber()
  @IsNotEmpty()
  distanceFromCityCenterInKM: number;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  fb: string;

  @IsString()
  @IsNotEmpty()
  instagram: string;

  @IsString()
  @IsNotEmpty()
  twitter: string;

  @IsString()
  @IsNotEmpty()
  website: string;
}
