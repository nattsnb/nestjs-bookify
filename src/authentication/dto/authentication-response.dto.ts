import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { TransformPhoneNumberToDisplay } from '../../Utilities/transform-phone-number-to-display';

export class AuthenticationResponseDto implements User {
  id: number;
  email: string;
  name: string;

  @Exclude()
  password: string;

  @TransformPhoneNumberToDisplay()
  phoneNumber: string;
}
