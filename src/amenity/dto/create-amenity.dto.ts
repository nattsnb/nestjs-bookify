import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateAmenityDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}
