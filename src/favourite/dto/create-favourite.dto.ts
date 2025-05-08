import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFavouriteDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  venueId: number;
}
