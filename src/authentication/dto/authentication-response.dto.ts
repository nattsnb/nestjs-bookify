import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class AuthenticationResponseDto implements User {
  id: number;
  email: string;
  name: string;

  @Exclude()
  password: string;
}
