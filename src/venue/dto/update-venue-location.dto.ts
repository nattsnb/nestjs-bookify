import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVenueLocationDto {
  @ApiProperty({ description: 'Street number of the venue', example: '1' })
  @IsString()
  @IsNotEmpty()
  streetNumber: string;

  @ApiProperty({
    description: 'Street name of the venue',
    example: 'Praça do Comércio',
  })
  @IsString()
  @IsNotEmpty()
  streetName: string;

  @ApiProperty({
    description: 'Postal code of the venue location',
    example: '1100-148',
  })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({
    description: 'City where the venue is located',
    example: 'Lisboa',
  })
  @IsString()
  @IsNotEmpty()
  city: string;
}
