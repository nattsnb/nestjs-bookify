import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({
    description: 'Numerical rating score (e.g. 1–5)',
    example: 4,
  })
  @IsInt()
  @IsNotEmpty()
  score: number;

  @ApiPropertyOptional({
    description: 'Optional written review from the user',
    example: 'Amazing place, would definitely book again!',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Review cannot be an empty string if provided' })
  review?: string;

  @ApiProperty({
    description: 'ID of the reservation associated with this rating',
    example: 45,
  })
  @IsInt()
  @IsNotEmpty()
  reservationId: number;
}
