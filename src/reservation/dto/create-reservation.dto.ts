import { IsInt, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({ description: 'ID of the venue being reserved', example: 5 })
  @IsInt()
  @IsNotEmpty()
  venueId: number;

  @ApiProperty({
    description: 'Start date (YYYY-MM-DD)',
    example: '2025-08-01',
  })
  @IsDateString({ strict: true }, { message: 'Must be in YYYY-MM-DD format' })
  @IsNotEmpty()
  dateStart: string;

  @ApiProperty({ description: 'End date (YYYY-MM-DD)', example: '2025-08-05' })
  @IsDateString({ strict: true }, { message: 'Must be in YYYY-MM-DD format' })
  @IsNotEmpty()
  dateEnd: string;
}
