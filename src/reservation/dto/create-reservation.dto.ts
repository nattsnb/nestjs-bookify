import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsDate,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @ApiProperty({
    description: 'ID of the venue being reserved',
    example: 5,
  })
  @IsInt()
  @IsNotEmpty()
  venueId: number;

  @ApiProperty({
    description: 'Start date of the reservation (ISO format)',
    example: '2025-08-01',
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dateStart: Date;

  @ApiProperty({
    description: 'End date of the reservation (ISO format)',
    example: '2025-08-05',
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dateEnd: Date;
}
