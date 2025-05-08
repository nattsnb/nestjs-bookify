import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { JwtAuthenticationGuard } from '../authentication/jwt-authentication.guard';
import { RequestWithUser } from '../authentication/request-with-user';
import { ApiBody } from '@nestjs/swagger';
import { CreateFavouriteDto } from './dto/create-favourite.dto';

@Controller('favourite')
export class FavouriteController {
  constructor(private readonly favouriteService: FavouriteService) {}

  @Get()
  getAll() {
    return this.favouriteService.getAll();
  }

  @Get('user/:id')
  getByUser(@Param('id', ParseIntPipe) id: number) {
    return this.favouriteService.getByUser(id);
  }

  @Get('venue/:id')
  getByVenue(@Param('id', ParseIntPipe) id: number) {
    return this.favouriteService.getByVenue(id);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.favouriteService.getOne(id);
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @ApiBody({ type: CreateFavouriteDto })
  create(@Body() dto: CreateFavouriteDto, @Req() request: RequestWithUser) {
    return this.favouriteService.create(dto.venueId, request.user.id);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.favouriteService.delete(id);
  }
}
