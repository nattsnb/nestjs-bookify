import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsDate,
  IsEnum,
} from 'class-validator';
import { StatusEnum } from '@prisma/client';

export class CreateVenueReservationUserDto {
  @IsInt()
  @IsNotEmpty()
  venueId: number;

  @IsDate()
  @IsNotEmpty()
  dateStart: Date;

  @IsDate()
  @IsNotEmpty()
  dateEnd: Date;

  @IsEnum(StatusEnum)
  @IsNotEmpty()
  status: StatusEnum;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Review cannot be an empty if provided' })
  review?: string;
}
