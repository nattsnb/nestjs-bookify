import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class LocationDto {
  @IsNumber()
  streetNumber: number;

  @IsString()
  @IsNotEmpty()
  streetName: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  city: string;
}
