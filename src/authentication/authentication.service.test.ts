import { AuthenticationService } from './authentication.service';
import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { NotFoundException } from '@nestjs/common';
import { WrongCredentialsException } from './wrong-credentials-exception';
import { SignUpDto } from './dto/sign-up.dto';
import { LogInDto } from './dto/log-in.dto';
import { hash } from 'bcrypt';
import { Response } from 'express';
import { RequestWithUser } from './request-with-user';
import { User, Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';

describe('The AuthenticationService', () => {
  let getByEmailMock: jest.Mock;
  let createMock: jest.Mock;
  let authenticationService: AuthenticationService;
  let password: string;
  let userData: User;
  let response: Response;

  beforeEach(async () => {
    getByEmailMock = jest.fn();
    createMock = jest.fn();

    const jwtSignMock = jest.fn().mockReturnValue('mocked-token');
    const configGetMock = jest.fn().mockReturnValue('43200');

    const module = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: UserService,
          useValue: {
            getByEmail: getByEmailMock,
            create: createMock,
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jwtSignMock,
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: configGetMock,
          },
        },
      ],
      imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
          secretOrPrivateKey: 'Secret key',
        }),
      ],
    }).compile();
    authenticationService = await module.get(AuthenticationService);

    password = 'strongPassword123';
    const hashedPassword = await hash(password, 10);
    userData = {
      id: 1,
      email: 'jane.doe@example.com',
      name: 'Jane Doe',
      password: hashedPassword,
      phoneNumber: '123456789',
    };

    response = {
      setHeader: jest.fn(),
    } as unknown as Response;
  });

  describe('signUp', () => {
    let signUpData: SignUpDto;

    beforeEach(() => {
      signUpData = {
        name: userData.name,
        email: userData.email,
        password: password,
        phoneNumber: userData.phoneNumber,
      };
    });

    it('should return valid user when data is correct', async () => {
      createMock.mockResolvedValue(userData);
      const result = await authenticationService.signUp(signUpData);
      expect(result).toBe(userData);
    });

    it('should throw ConflictException when email is already taken', async () => {
      createMock.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
          code: PrismaError.UniqueConstraintViolated,
          clientVersion: Prisma.prismaVersion.client,
        }),
      );
      await expect(authenticationService.signUp(signUpData)).rejects.toThrow(
        Prisma.PrismaClientKnownRequestError,
      );
    });
  });

  describe('logIn', () => {
    it('should return user and set cookie when credentials are valid', async () => {
      getByEmailMock.mockResolvedValue(userData);
      const logInData: LogInDto = { email: userData.email, password };
      const result = await authenticationService.logIn(logInData, response);
      expect(response.setHeader).toHaveBeenCalledWith(
        'Set-Cookie',
        'Authentication=mocked-token; HttpOnly; Path=/; Max-Age=43200',
      );
      expect(result).toBe(userData);
    });

    it('should throw WrongCredentialsException when email is not found', async () => {
      getByEmailMock.mockRejectedValue(new NotFoundException());
      const logInData: LogInDto = { email: 'notfound@example.com', password };
      await expect(
        authenticationService.logIn(logInData, response),
      ).rejects.toThrow(WrongCredentialsException);
    });

    it('should throw WrongCredentialsException when password is incorrect', async () => {
      getByEmailMock.mockResolvedValue(userData);
      const logInData: LogInDto = {
        email: userData.email,
        password: 'wrongPassword',
      };
      await expect(
        authenticationService.logIn(logInData, response),
      ).rejects.toThrow(WrongCredentialsException);
    });
  });

  describe('getCookieWithJwtToken', () => {
    it('should return cookie with token and expiration', () => {
      const result = authenticationService.getCookieWithJwtToken(userData.id);
      expect(result).toBe(
        'Authentication=mocked-token; HttpOnly; Path=/; Max-Age=43200',
      );
    });
  });

  describe('getCookieForLogOut', () => {
    it('should return cookie clearing authentication', () => {
      const result = authenticationService.getCookieForLogOut();
      expect(result).toBe('Authentication=; HttpOnly; Path=/; Max-Age=0');
    });
  });

  describe('authenticate', () => {
    it('should return user from request', () => {
      const request = { user: userData } as RequestWithUser;
      const result = authenticationService.authenticate(request);
      expect(result).toBe(userData);
    });
  });

  describe('getAuthenticatedUser', () => {
    it('should return user when email and password are valid', async () => {
      getByEmailMock.mockResolvedValue(userData);
      const result = await authenticationService.getAuthenticatedUser({
        email: userData.email,
        password,
      });
      expect(result).toBe(userData);
    });

    it('should throw WrongCredentialsException when password is invalid', async () => {
      getByEmailMock.mockResolvedValue(userData);
      const result = authenticationService.getAuthenticatedUser({
        email: userData.email,
        password: 'invalid-password',
      });
      await expect(result).rejects.toThrow(WrongCredentialsException);
    });

    it('should throw WrongCredentialsException when user not found', async () => {
      getByEmailMock.mockRejectedValue(new NotFoundException());
      const result = authenticationService.getAuthenticatedUser({
        email: 'notfound@example.com',
        password,
      });
      await expect(result).rejects.toThrow(WrongCredentialsException);
    });
  });

  describe('verifyPassword', () => {
    it('should return true if passwords match', async () => {
      const plain = 'test123';
      const hashed = await hash(plain, 10);
      const result = await authenticationService.verifyPassword(plain, hashed);
      expect(result).toBe(true);
    });

    it('should return false if passwords do not match', async () => {
      const result = await authenticationService.verifyPassword(
        'wrong',
        userData.password,
      );
      expect(result).toBe(false);
    });
  });

  describe('getUserByEmail', () => {
    it('should return user if found', async () => {
      getByEmailMock.mockResolvedValue(userData);
      const result = await authenticationService.getUserByEmail(userData.email);
      expect(result).toBe(userData);
    });

    it('should throw WrongCredentialsException if NotFoundException is thrown', async () => {
      getByEmailMock.mockRejectedValue(new NotFoundException());
      await expect(
        authenticationService.getUserByEmail('notfound@example.com'),
      ).rejects.toThrow(WrongCredentialsException);
    });
  });
});
