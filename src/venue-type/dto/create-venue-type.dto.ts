import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVenueTypeDto {
  @ApiProperty({
    description: 'Name of the venue type',
    example: 'tree house',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
