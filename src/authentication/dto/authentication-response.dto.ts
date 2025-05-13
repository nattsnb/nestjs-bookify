import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { TransformPhoneNumberToDisplay } from '../../Utilities/transform-phone-number-to-display';
import { ApiProperty } from '@nestjs/swagger';

export class AuthenticationResponseDto implements User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @Exclude()
  password: string;

  @ApiProperty()
  @TransformPhoneNumberToDisplay()
  phoneNumber: string;
}
