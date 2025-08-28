import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { WrongCredentialsException } from './wrong-credentials-exception';
import { LogInDto } from './dto/log-in.dto';
import { TokenPayload } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { RequestWithUser } from './request-with-user';
import { Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UserService,
  ) {}

  async signUp(signUpData: SignUpDto) {
    try {
      const hashedPassword = await bcrypt.hash(signUpData.password, 10);
      return await this.usersService.create({
        email: signUpData.email,
        password: hashedPassword,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.UniqueConstraintViolated
      ) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async logIn(logInData: LogInDto, response: Response) {
    const user = await this.getAuthenticatedUser(logInData);
    const cookie = this.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    return user;
  }

  logOut(response: Response) {
    const cookie = this.getCookieForLogOut();
    response.setHeader('Set-Cookie', cookie);
  }

  authenticate(request: RequestWithUser) {
    return request.user;
  }

  async getAuthenticatedUser(logInData: LogInDto) {
    const user = await this.getUserByEmail(logInData.email);
    const isPasswordVerified = await this.verifyPassword(
      logInData.password,
      user.password,
    );
    if (!isPasswordVerified) {
      throw new WrongCredentialsException();
    }
    return user;
  }

  async getUserByEmail(email: string) {
    try {
      return await this.usersService.getByEmail(email);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new WrongCredentialsException();
      }
      throw error;
    }
  }

  async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }

  getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
