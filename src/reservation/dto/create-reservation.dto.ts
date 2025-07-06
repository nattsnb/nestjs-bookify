import { IsInt, IsNotEmpty, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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
    description: 'Start date of the reservation (ISO format with time)',
    example: '2025-08-01T14:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dateStart: Date;

  @ApiProperty({
    description: 'End date of the reservation (ISO format with time)',
    example: '2025-08-05T10:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dateEnd: Date;
}
