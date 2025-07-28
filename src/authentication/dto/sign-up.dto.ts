import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'jane.doe@example.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password (at least 8 characters)',
    example: 'securePassword123',
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
