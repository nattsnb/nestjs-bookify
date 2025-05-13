import { IsString, IsNotEmpty, IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOccasionDto {
  @ApiProperty({
    description: 'Name of the occasion',
    example: 'Birthday Party',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'List of amenity IDs associated with the occasion',
    example: [1, 2, 5],
    required: true,
  })
  @IsArray()
  @IsInt({ each: true })
  amenities: number[];
}
