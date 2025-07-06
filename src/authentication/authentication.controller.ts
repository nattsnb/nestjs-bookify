import { AuthenticationService } from './authentication.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { LogInDto } from './dto/log-in.dto';
import { Response } from 'express';
import { JwtAuthenticationGuard } from './jwt-authentication.guard';
import { RequestWithUser } from './request-with-user';
import { AuthenticationResponseDto } from './dto/authentication-response.dto';
import { TransformPlainToInstance } from 'class-transformer';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('sign-up')
  @ApiBody({ type: SignUpDto })
  @TransformPlainToInstance(AuthenticationResponseDto)
  async signUp(@Body() signUpData: SignUpDto) {
    return this.authenticationService.signUp(signUpData);
  }

  @HttpCode(200)
  @Post('log-in')
  @ApiBody({ type: LogInDto })
  @TransformPlainToInstance(AuthenticationResponseDto)
  async logIn(
    @Body() logInData: LogInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authenticationService.logIn(logInData, response);
  }

  @HttpCode(200)
  @Post('log-out')
  logOut(@Res({ passthrough: true }) response: Response) {
    return this.authenticationService.logOut(response);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  @TransformPlainToInstance(AuthenticationResponseDto)
  authenticate(@Req() request: RequestWithUser) {
    return this.authenticationService.authenticate(request);
  }
}
