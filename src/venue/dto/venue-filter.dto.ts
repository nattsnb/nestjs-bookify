import { Transform } from 'class-transformer';
import { IsOptional, IsArray, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class VenueFilterDto {
  @ApiPropertyOptional({
    description: 'Array of amenity IDs',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map(Number)
      : value.split(',').map((v: number) => Number(v)),
  )
  @IsInt({ each: true })
  amenities?: number[];

  @ApiPropertyOptional({
    description: 'Array of occasion IDs',
    example: [4, 5],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map(Number)
      : value.split(',').map((v: number) => Number(v)),
  )
  @IsInt({ each: true })
  occasions?: number[];
}
