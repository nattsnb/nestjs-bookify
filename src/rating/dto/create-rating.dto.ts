import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateRatingDto {
  @IsInt()
  @IsNotEmpty()
  venueId: number;

  @IsInt()
  @IsNotEmpty()
  score: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Review cannot be an empty string if provided' })
  review?: string;

  @IsInt()
  @IsNotEmpty()
  reservationId: number;
}
