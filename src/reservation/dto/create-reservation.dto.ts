import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsDate,
  IsEnum,
} from 'class-validator';
import { StatusEnum } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
    example: '2025-08-01T15:00:00.000Z',
  })
  @IsDate()
  @IsNotEmpty()
  dateStart: Date;

  @ApiProperty({
    description: 'End date of the reservation (ISO format)',
    example: '2025-08-05T11:00:00.000Z',
  })
  @IsDate()
  @IsNotEmpty()
  dateEnd: Date;

  @ApiProperty({
    description: 'Status of the reservation',
    enum: StatusEnum,
    example: StatusEnum.RESERVED,
  })
  @IsEnum(StatusEnum)
  @IsNotEmpty()
  status: StatusEnum;

  @ApiPropertyOptional({
    description: 'Optional review for the reservation',
    example: 'Everything went smoothly and the place was great!',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Review cannot be an empty if provided' })
  review?: string;
}
