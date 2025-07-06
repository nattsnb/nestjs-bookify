import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAmenityDto {
  @ApiProperty({
    example: 'Wi-Fi',
    description: 'The name of the amenity',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 1,
    description: 'ID of the category this amenity belongs to',
  })
  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}
