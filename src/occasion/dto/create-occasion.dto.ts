import { IsString, IsNotEmpty, IsArray, IsInt } from 'class-validator';

export class CreateOccasionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsInt({ each: true })
  amenities?: number[];
}
